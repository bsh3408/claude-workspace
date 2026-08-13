package kr.aiyeppeun

import android.content.Context

/**
 * 프로토타입용 설정 저장소.
 *
 * 주의: API 키를 단말에 그대로 저장한다. 프로토타입이라 이렇게 두었지만,
 * 배포판에서는 키를 앱에 두면 안 된다. 자체 백엔드를 두고 앱은 백엔드에만
 * 요청하도록 바꿔야 한다. README의 "배포 전에 반드시 바꿔야 할 것" 참고.
 */
class Prefs(context: Context) {
    private val sp = context.getSharedPreferences("aiyeppeun", Context.MODE_PRIVATE)

    var apiKey: String
        get() = sp.getString(KEY_API, "").orEmpty()
        set(value) = sp.edit().putString(KEY_API, value.trim()).apply()

    var defaultTone: Tone
        get() = Tone.fromKey(sp.getString(KEY_TONE, null))
        set(value) = sp.edit().putString(KEY_TONE, value.key).apply()

    /** 켜면 결과 확인 없이 곧바로 원문을 교정문으로 교체한다. 탭 한 번이 줄어든다. */
    var autoApply: Boolean
        get() = sp.getBoolean(KEY_AUTO, false)
        set(value) = sp.edit().putBoolean(KEY_AUTO, value).apply()

    private companion object {
        const val KEY_API = "api_key"
        const val KEY_TONE = "default_tone"
        const val KEY_AUTO = "auto_apply"
    }
}
