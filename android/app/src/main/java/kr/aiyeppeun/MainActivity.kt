package kr.aiyeppeun

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Card
import androidx.compose.material3.FilterChip
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Surface
import androidx.compose.material3.Switch
import androidx.compose.material3.Text
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.unit.dp

/**
 * 설정 화면. 이 앱은 여기서 할 일이 거의 없는 것이 정상이다.
 * 실제 사용은 전부 다른 앱의 텍스트 선택 메뉴에서 일어난다.
 */
class MainActivity : ComponentActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val prefs = Prefs(this)

        setContent {
            MaterialTheme {
                Surface(modifier = Modifier.fillMaxSize()) {
                    var apiKey by remember { mutableStateOf(prefs.apiKey) }
                    var tone by remember { mutableStateOf(prefs.defaultTone) }
                    var autoApply by remember { mutableStateOf(prefs.autoApply) }

                    Column(
                        modifier = Modifier
                            .fillMaxSize()
                            .verticalScroll(rememberScrollState())
                            .padding(24.dp),
                    ) {
                        Text("아이예뻐", style = MaterialTheme.typography.headlineMedium, fontWeight = FontWeight.Bold)
                        Spacer(Modifier.height(6.dp))
                        Text(
                            "보내기 전에 한 번 더 다듬어 주는 앱",
                            style = MaterialTheme.typography.bodyMedium,
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                        )

                        Spacer(Modifier.height(28.dp))
                        SectionTitle("쓰는 법")
                        Card(modifier = Modifier.fillMaxWidth()) {
                            Column(Modifier.padding(16.dp)) {
                                Step(1, "카톡이나 문자에 평소처럼 메시지를 씁니다.")
                                Step(2, "입력창의 글자를 길게 눌러 선택합니다.")
                                Step(3, "뜨는 메뉴에서 '아이예뻐'를 고릅니다. (안 보이면 ⋮ 를 누르세요)")
                                Step(4, "다듬어진 문장을 확인하고 그대로 보냅니다.")
                                Spacer(Modifier.height(10.dp))
                                Text(
                                    "키보드를 바꾸거나 권한을 켤 필요가 없습니다.",
                                    style = MaterialTheme.typography.bodySmall,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                                )
                            }
                        }

                        Spacer(Modifier.height(28.dp))
                        SectionTitle("기본으로 쓸 상대")
                        Text(
                            "교정할 때마다 고르지 않아도 되도록 기본값을 하나 정해 둡니다. 그 자리에서 바꿀 수도 있습니다.",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                        )
                        Spacer(Modifier.height(10.dp))
                        Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                            Tone.entries.forEach { candidate ->
                                FilterChip(
                                    selected = candidate == tone,
                                    onClick = {
                                        tone = candidate
                                        prefs.defaultTone = candidate
                                    },
                                    label = { Text(candidate.label) },
                                )
                            }
                        }

                        Spacer(Modifier.height(28.dp))
                        SectionTitle("확인 없이 바로 바꾸기")
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            verticalAlignment = Alignment.CenterVertically,
                        ) {
                            Text(
                                "켜면 결과 확인 화면 없이 곧바로 교체합니다. 탭이 한 번 줄어드는 대신, 바뀐 문장을 미리 보지 못합니다.",
                                style = MaterialTheme.typography.bodySmall,
                                color = MaterialTheme.colorScheme.onSurfaceVariant,
                                modifier = Modifier.weight(1f),
                            )
                            Switch(
                                checked = autoApply,
                                onCheckedChange = {
                                    autoApply = it
                                    prefs.autoApply = it
                                },
                            )
                        }

                        Spacer(Modifier.height(28.dp))
                        SectionTitle("Claude API 키")
                        OutlinedTextField(
                            value = apiKey,
                            onValueChange = {
                                apiKey = it
                                prefs.apiKey = it
                            },
                            label = { Text("sk-ant-...") },
                            singleLine = true,
                            visualTransformation = PasswordVisualTransformation(),
                            modifier = Modifier.fillMaxWidth(),
                        )
                        Spacer(Modifier.height(8.dp))
                        Text(
                            "프로토타입이라 키를 이 기기에만 저장합니다. 실제 배포판에서는 키를 앱에 두면 안 되고, " +
                                "직접 운영하는 서버를 거쳐야 합니다.",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.error,
                        )

                        Spacer(Modifier.height(28.dp))
                        SectionTitle("개인정보")
                        Text(
                            "교정을 누른 그 문장만 Claude API로 전송됩니다. 누르지 않은 메시지는 앱이 볼 수 없고, " +
                                "대화 내용을 저장하지 않습니다. 비밀번호나 카드번호는 절대 교정하지 마세요.",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                        )
                        Spacer(Modifier.height(40.dp))
                    }
                }
            }
        }
    }
}

@androidx.compose.runtime.Composable
private fun SectionTitle(text: String) {
    Text(text, style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.SemiBold)
    Spacer(Modifier.height(8.dp))
}

@androidx.compose.runtime.Composable
private fun Step(number: Int, text: String) {
    Row(Modifier.padding(vertical = 4.dp)) {
        Text("$number.", style = MaterialTheme.typography.bodyMedium, fontWeight = FontWeight.Bold)
        Spacer(Modifier.fillMaxWidth(0f))
        Text("  $text", style = MaterialTheme.typography.bodyMedium)
    }
}
