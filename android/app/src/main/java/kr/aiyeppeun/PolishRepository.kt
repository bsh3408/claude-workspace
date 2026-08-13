package kr.aiyeppeun

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONArray
import org.json.JSONObject
import java.util.concurrent.TimeUnit

/** 교정 결과. note 는 "뭘 왜 고쳤는지" 한 줄 설명 — 사용자가 다음엔 스스로 쓰게 만드는 장치. */
data class PolishResult(val polished: String, val note: String)

class PolishError(message: String) : Exception(message)

object PolishRepository {

    private const val ENDPOINT = "https://api.anthropic.com/v1/messages"
    private const val MODEL = "claude-sonnet-5"

    private val client = OkHttpClient.Builder()
        .callTimeout(30, TimeUnit.SECONDS)
        .build()

    private val JSON = "application/json; charset=utf-8".toMediaType()

    /**
     * 교정의 핵심 원칙은 "고치는 것"이 아니라 "덜 고치는 것"이다.
     * 과하게 격식을 씌우면 사용자가 자기 말투를 잃었다고 느끼고 앱을 지운다.
     */
    private fun systemPrompt(tone: Tone): String = """
        너는 한국어 메신저 메시지를 상대에 맞게 다듬어 주는 교정기다.
        사용자가 방금 입력창에 쓴 문장을 받아, 그대로 보내도 실례가 되지 않을 문장으로 고친다.

        ${tone.guidance}

        지켜야 할 원칙:
        1. 원문의 의도와 사실을 절대 바꾸지 않는다. 없는 약속, 없는 이유, 없는 사정을 지어내지 않는다.
        2. 최소한만 고친다. 이미 충분히 공손한 문장은 거의 그대로 둔다.
           고칠 것이 없으면 원문을 그대로 돌려준다.
        3. 과공은 비례다. "~해 주시면 감사하겠습니다만" 같은 과한 존댓말을 겹쳐 쓰지 않는다.
           존댓말 남발은 공손한 게 아니라 어색한 것이다.
        4. 길이를 원문의 2배 이상으로 늘리지 않는다. 메신저는 짧아야 읽힌다.
        5. 사용자의 말투를 지운 남의 문장을 만들지 않는다. 같은 사람이 쓴 티가 나야 한다.
        6. 부탁·거절·사과는 쿠션어와 완곡 표현을 쓰되, 정작 용건이 흐려지지 않게 한다.
        7. 원문에 욕설이나 감정적 표현이 있으면 뜻은 유지하고 표현만 중화한다.

        반드시 아래 형태의 JSON 하나만 출력한다. 다른 말은 쓰지 않는다.
        {"polished": "교정된 메시지 본문", "note": "무엇을 왜 고쳤는지 한 문장, 40자 이내"}
    """.trimIndent()

    suspend fun polish(apiKey: String, text: String, tone: Tone): PolishResult =
        withContext(Dispatchers.IO) {
            if (apiKey.isBlank()) throw PolishError("API 키가 설정되지 않았습니다. 아이예뻐 앱을 열어 키를 입력해 주세요.")

            val body = JSONObject().apply {
                put("model", MODEL)
                put("max_tokens", 1024)
                put("system", systemPrompt(tone))
                put("messages", JSONArray().apply {
                    put(JSONObject().apply {
                        put("role", "user")
                        put("content", text)
                    })
                    // 프리필로 JSON 출력을 강제한다. 모델이 설명 문장부터 쓰는 사고를 막는다.
                    put(JSONObject().apply {
                        put("role", "assistant")
                        put("content", "{")
                    })
                })
            }

            val request = Request.Builder()
                .url(ENDPOINT)
                .addHeader("x-api-key", apiKey)
                .addHeader("anthropic-version", "2023-06-01")
                .addHeader("content-type", "application/json")
                .post(body.toString().toRequestBody(JSON))
                .build()

            val raw = try {
                client.newCall(request).execute().use { response ->
                    val payload = response.body?.string().orEmpty()
                    if (!response.isSuccessful) throw PolishError(errorMessage(response.code, payload))
                    payload
                }
            } catch (e: PolishError) {
                throw e
            } catch (e: Exception) {
                throw PolishError("네트워크에 연결하지 못했습니다. 잠시 후 다시 시도해 주세요.")
            }

            parse(raw, text)
        }

    private fun errorMessage(code: Int, payload: String): String = when (code) {
        401 -> "API 키가 올바르지 않습니다. 앱에서 키를 다시 확인해 주세요."
        429 -> "요청이 몰리고 있습니다. 잠시 후 다시 시도해 주세요."
        in 500..599 -> "서버가 일시적으로 응답하지 않습니다. 잠시 후 다시 시도해 주세요."
        else -> {
            val detail = runCatching {
                JSONObject(payload).getJSONObject("error").getString("message")
            }.getOrNull()
            detail?.let { "교정에 실패했습니다: $it" } ?: "교정에 실패했습니다. (HTTP $code)"
        }
    }

    private fun parse(raw: String, original: String): PolishResult {
        val text = runCatching {
            JSONObject(raw).getJSONArray("content").getJSONObject(0).getString("text")
        }.getOrElse { throw PolishError("응답을 이해하지 못했습니다. 다시 시도해 주세요.") }

        // 프리필한 "{" 를 되붙여 온전한 JSON으로 만든다.
        val json = runCatching { JSONObject("{$text") }.getOrNull()
            ?: throw PolishError("응답을 이해하지 못했습니다. 다시 시도해 주세요.")

        val polished = json.optString("polished").trim()
        if (polished.isEmpty()) throw PolishError("교정 결과가 비어 있습니다. 다시 시도해 주세요.")

        val note = json.optString("note").trim().ifEmpty {
            if (polished == original) "고칠 부분이 없어 그대로 두었어요." else "표현을 다듬었어요."
        }
        return PolishResult(polished = polished, note = note)
    }
}
