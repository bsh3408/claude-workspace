package kr.aiyeppeun

/**
 * 메시지를 받는 상대. 상대에 따라 "공손함"의 모양이 완전히 달라진다.
 * - 선생님/교수님: 예의는 갖추되 지나치게 사무적이면 오히려 어색함
 * - 직장 상사: 간결함이 곧 예의. 장황한 존댓말은 감점
 * - 어른/친척: 따뜻함이 우선, 격식은 그 다음
 * - 거래처: 격식과 명확성이 최우선
 */
enum class Tone(val key: String, val label: String, val guidance: String) {
    TEACHER(
        key = "teacher",
        label = "선생님",
        guidance = """
            받는 사람은 학교 선생님이다.
            - 학생다운 예의를 갖추되, 지나치게 사무적이거나 딱딱하면 오히려 어색하다.
            - 부탁이나 요청은 반드시 쿠션어를 앞에 두고, 상대에게 선택권을 남긴다.
            - 이모티콘은 쓰지 않는다.
        """.trimIndent()
    ),
    BOSS(
        key = "boss",
        label = "직장 상사",
        guidance = """
            받는 사람은 직장 상사다.
            - 간결함이 곧 예의다. 장황한 존댓말과 불필요한 인사말은 오히려 감점이다.
            - 용건과 필요한 조치를 앞쪽에 배치한다.
            - 사과나 보고는 변명보다 사실과 대안을 먼저 쓴다.
        """.trimIndent()
    ),
    PROFESSOR(
        key = "professor",
        label = "교수님",
        guidance = """
            받는 사람은 대학 교수다.
            - 격식을 갖춘 문어체에 가깝게 쓴다.
            - 본인이 누구인지(수업명/학번 등)가 필요해 보이면 자리를 비워두지 말고
              [수업명] 같은 대괄호 자리표시자로 남겨 사용자가 채우게 한다.
        """.trimIndent()
    ),
    ELDER(
        key = "elder",
        label = "어른·친척",
        guidance = """
            받는 사람은 나이 많은 친척이나 어른이다.
            - 격식보다 따뜻함이 우선이다. 안부를 챙기는 한 마디가 자연스럽다.
            - 너무 사무적인 표현은 오히려 정 없어 보인다.
        """.trimIndent()
    ),
    CLIENT(
        key = "client",
        label = "거래처",
        guidance = """
            받는 사람은 사외 거래처 담당자다.
            - 격식과 명확성이 최우선이다. 애매한 표현을 남기지 않는다.
            - 일정과 요청 사항은 구체적으로 적는다.
        """.trimIndent()
    );

    companion object {
        fun fromKey(key: String?): Tone = entries.firstOrNull { it.key == key } ?: TEACHER
    }
}
