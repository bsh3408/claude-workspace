package kr.aiyeppeun

import android.app.Activity
import android.content.ClipData
import android.content.ClipboardManager
import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.FilterChip
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Button
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.lifecycle.lifecycleScope
import kotlinx.coroutines.launch

/**
 * 앱의 전부라고 해도 되는 화면.
 *
 * 카톡·문자·메일 어디서든 입력창의 글자를 선택하고 메뉴에서 "아이예뻐"를 고르면
 * 이 액티비티가 투명하게 그 위에 떠서 교정 결과를 보여준다. 앱 전환이 없기 때문에
 * 사용자는 카톡에서 나갔다는 느낌을 받지 않는다.
 *
 * 결과를 확정하면 setResult 로 교정문을 돌려주고, 호출한 앱이 선택 영역을 그 글자로
 * 바꿔치기한다. 클립보드를 거치지 않는다.
 */
class ProcessTextActivity : ComponentActivity() {

    private sealed interface UiState {
        data object Loading : UiState
        data class Done(val result: PolishResult) : UiState
        data class Failed(val message: String) : UiState
    }

    private lateinit var prefs: Prefs
    private lateinit var original: String

    /**
     * 호출한 앱이 텍스트를 읽기 전용으로 넘긴 경우(웹뷰의 본문 선택 등)에는
     * 글자를 되돌려 줘도 반영되지 않는다. 이때는 "적용" 대신 "복사"를 제공한다.
     */
    private var readOnly = false

    private var state by mutableStateOf<UiState>(UiState.Loading)
    private var tone: Tone = Tone.TEACHER

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        prefs = Prefs(this)

        original = intent.getCharSequenceExtra(Intent.EXTRA_PROCESS_TEXT)?.toString().orEmpty()
        readOnly = intent.getBooleanExtra(Intent.EXTRA_PROCESS_TEXT_READONLY, false)
        tone = prefs.defaultTone

        if (original.isBlank()) {
            toast("고칠 문장이 없어요.")
            finish()
            return
        }

        setContent {
            AiYeppeunTheme {
                ResultSheet(
                    original = original,
                    state = state,
                    tone = tone,
                    readOnly = readOnly,
                    onToneChange = { selected ->
                        tone = selected
                        polish()
                    },
                    onApply = ::applyAndFinish,
                    onRetry = ::polish,
                    onDismiss = ::finish,
                )
            }
        }

        polish()
    }

    private fun polish() {
        state = UiState.Loading
        lifecycleScope.launch {
            state = try {
                val result = PolishRepository.polish(prefs.apiKey, original, tone)
                // 자동 적용 설정이 켜져 있으면 확인 탭 없이 바로 교체한다.
                if (prefs.autoApply && !readOnly) {
                    applyAndFinish(result.polished)
                    return@launch
                }
                UiState.Done(result)
            } catch (e: PolishError) {
                UiState.Failed(e.message ?: "교정에 실패했습니다.")
            } catch (e: Exception) {
                UiState.Failed("교정에 실패했습니다. 다시 시도해 주세요.")
            }
        }
    }

    private fun applyAndFinish(polished: String) {
        if (readOnly) {
            val clipboard = getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager
            clipboard.setPrimaryClip(ClipData.newPlainText("아이예뻐", polished))
            toast("교정한 문장을 복사했어요.")
            finish()
            return
        }
        setResult(Activity.RESULT_OK, Intent().putExtra(Intent.EXTRA_PROCESS_TEXT, polished))
        finish()
    }

    private fun toast(message: String) =
        Toast.makeText(this, message, Toast.LENGTH_SHORT).show()

    @Composable
    private fun ResultSheet(
        original: String,
        state: UiState,
        tone: Tone,
        readOnly: Boolean,
        onToneChange: (Tone) -> Unit,
        onApply: (String) -> Unit,
        onRetry: () -> Unit,
        onDismiss: () -> Unit,
    ) {
        Box(
            modifier = Modifier.fillMaxSize(),
            contentAlignment = Alignment.BottomCenter,
        ) {
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(12.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
            ) {
                Column(
                    modifier = Modifier
                        .padding(20.dp)
                        .verticalScroll(rememberScrollState()),
                ) {
                    Text(
                        text = "아이예뻐",
                        style = MaterialTheme.typography.labelLarge,
                        color = MaterialTheme.colorScheme.primary,
                        fontWeight = FontWeight.Bold,
                    )
                    Spacer(Modifier.height(12.dp))

                    when (state) {
                        is UiState.Loading -> LoadingBody(original)
                        is UiState.Failed -> FailedBody(state.message)
                        is UiState.Done -> DoneBody(original, state.result)
                    }

                    Spacer(Modifier.height(16.dp))
                    ToneRow(tone = tone, enabled = state !is UiState.Loading, onToneChange = onToneChange)
                    Spacer(Modifier.height(16.dp))

                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        OutlinedButton(onClick = onDismiss, modifier = Modifier.weight(1f)) {
                            Text("취소")
                        }
                        when (state) {
                            is UiState.Done -> Button(
                                onClick = { onApply(state.result.polished) },
                                modifier = Modifier.weight(2f),
                            ) {
                                Text(if (readOnly) "복사하기" else "이걸로 보내기")
                            }
                            is UiState.Failed -> Button(onClick = onRetry, modifier = Modifier.weight(2f)) {
                                Text("다시 시도")
                            }
                            is UiState.Loading -> Button(
                                onClick = {},
                                enabled = false,
                                modifier = Modifier.weight(2f),
                            ) {
                                Text("다듬는 중")
                            }
                        }
                    }
                }
            }
        }
    }

    @Composable
    private fun LoadingBody(original: String) {
        Column {
            OriginalBlock(original)
            Spacer(Modifier.height(16.dp))
            Row(verticalAlignment = Alignment.CenterVertically) {
                CircularProgressIndicator(modifier = Modifier.size(18.dp), strokeWidth = 2.dp)
                Spacer(Modifier.height(0.dp))
                Text(
                    text = "  다듬는 중이에요…",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
            }
        }
    }

    @Composable
    private fun FailedBody(message: String) {
        Text(
            text = message,
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.error,
        )
    }

    @Composable
    private fun DoneBody(original: String, result: PolishResult) {
        Column {
            OriginalBlock(original)
            Spacer(Modifier.height(14.dp))
            Text(
                text = result.polished,
                style = MaterialTheme.typography.bodyLarge,
            )
            Spacer(Modifier.height(8.dp))
            Text(
                text = "✎ ${result.note}",
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
            )
        }
    }

    @Composable
    private fun OriginalBlock(original: String) {
        Text(
            text = original,
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
        )
    }

    @Composable
    private fun ToneRow(tone: Tone, enabled: Boolean, onToneChange: (Tone) -> Unit) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .horizontalScroll(rememberScrollState()),
            horizontalArrangement = Arrangement.spacedBy(6.dp),
        ) {
            Tone.entries.forEach { candidate ->
                FilterChip(
                    selected = candidate == tone,
                    enabled = enabled,
                    onClick = { if (candidate != tone) onToneChange(candidate) },
                    label = { Text(candidate.label) },
                )
            }
        }
    }
}

@Composable
fun AiYeppeunTheme(content: @Composable () -> Unit) {
    MaterialTheme {
        Surface(color = androidx.compose.ui.graphics.Color.Transparent, content = content)
    }
}
