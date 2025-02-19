$(document).ready(function () {
  function updateDateTime() {
    $.get("https://timeapi.io/api/Time/current/zone?timeZone=Asia/Seoul", function (data) {
      let dateTime = new Date(data.dateTime);

      // 날짜 형식 지정
      let options = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true, // 오후/오전 표시
      };

      // 날짜 포맷을 2025. 02. 19. 오후 03:45:04 형식으로 변환
      let formattedDateTime = dateTime.toLocaleString("ko-KR", options).replace(/,/g, ".");

      $("#dateTime").text(formattedDateTime);
    }).fail(function () {
      $("#dateTime").text("시간을 가져올 수 없습니다.");
    });
  }

  // 처음 로딩 시 시간 표시
  updateDateTime();

  // 1초마다 시간 갱신
  setInterval(updateDateTime, 1000); // 1000ms = 1초
});
