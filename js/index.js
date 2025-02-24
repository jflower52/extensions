$(document).ready(function () {
  const welcomeMessage = $("#welcomeMessage");
  const resetNameButton = $("#resetNameButton");
  const attendanceGrid = $("#attendance-grid");

  // 저장된 이름 가져오기
  function loadName() {
    const savedName = localStorage.getItem("userName");
    if (savedName) {
      displayWelcomeMessage(savedName);
    } else {
      // 알림창으로 이름 입력 받기
      const name = prompt("이름을 입력하세요");
      if (name && name.trim()) {
        localStorage.setItem("userName", name.trim());
        displayWelcomeMessage(name.trim());
      }
    }
  }

  // 시간대별 환영 메시지 표시
  function displayWelcomeMessage(name) {
    const now = new Date();
    const hours = now.getHours();

    let greeting = "";
    if (hours >= 6 && hours < 12) {
      greeting = "Good Morning";
    } else if (hours >= 12 && hours < 18) {
      greeting = "Good Afternoon";
    } else {
      greeting = "Good Night";
    }

    welcomeMessage.text(`${greeting}, ${name}님!`);
  }

  // 이름 초기화 버튼 클릭 이벤트
  resetNameButton.click(function () {
    localStorage.removeItem("userName");
    welcomeMessage.text(""); // 환영 메시지 초기화
    loadName(); // 다시 이름 입력 받기
  });

  loadName();

  // 날짜 및 시간
  function currentTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    const date = now.getDate().toString().padStart(2, "0");
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const seconds = now.getSeconds().toString().padStart(2, "0");
    document.getElementById("clock").innerText = `${year}.${month}.${date}\n${hours}:${minutes}:${seconds}`;

    // 배경 업데이트
    updateBackground(hours);
  }

  // 시간대별 배경 변경
  function updateBackground(hours) {
    const body = document.body;
    body.className = ""; // 기존 클래스 초기화

    if (hours >= 6 && hours < 12) {
      body.classList.add("morning"); // 아침
    } else if (hours >= 12 && hours < 18) {
      body.classList.add("afternoon"); // 오후
    } else if (hours >= 18 && hours < 24) {
      body.classList.add("night"); // 밤
    } else {
      body.classList.add("dawn"); // 새벽
    }
  }

  // 1초마다 업데이트
  setInterval(() => {
    currentTime();
  }, 1000);

  // 현재 온도 및 날씨 가져오기
  (function getLocation() {
    navigator.geolocation.getCurrentPosition(async (position) => {
      let latitude = position.coords.latitude;
      let longitude = position.coords.longitude;
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=de4298a699ccf43701fe6d0d4034a7c1&units=metric`);
      const data = await response.json();
      const {
        main: { temp },
        weather,
      } = data;

      // 날씨 상태 가져오기
      const weatherCondition = weather[0].main;

      // 날씨 아이콘 매칭
      let weatherIcon = "";
      switch (weatherCondition) {
        case "Clear":
          weatherIcon = "☀️"; // 맑음
          break;
        case "Clouds":
          weatherIcon = "☁️"; // 흐림
          break;
        case "Rain":
          weatherIcon = "🌧️"; // 비
          break;
        case "Snow":
          weatherIcon = "❄️"; // 눈
          break;
        case "Thunderstorm":
          weatherIcon = "⛈️"; // 천둥번개
          break;
        case "Drizzle":
          weatherIcon = "🌦️"; // 이슬비
          break;
        case "Mist":
        case "Fog":
        case "Haze":
          weatherIcon = "🌫️"; // 안개
          break;
        default:
          weatherIcon = "🌍"; // 기본 아이콘
      }

      // 화면에 출력
      document.getElementById("weather").innerText = `날씨: ${weatherIcon}\n현재 온도: ${temp}°C`;
    });
  })();

  // 출석 기능
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // 0부터 시작 (0은 1월, 11은 12월)
  const currentDate = now.getDate(); // 오늘 날짜

  // 월별 첫날이 시작되는 요일을 가져옵니다
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const firstDay = firstDayOfMonth.getDay(); // 0: 일요일, 6: 토요일

  // 해당 월의 마지막 날짜를 구합니다
  const lastDateOfMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  // 출석 정보를 가져옵니다 (LocalStorage)
  let attendance = JSON.parse(localStorage.getItem("attendance")) || {};

  // 월별 캘린더를 생성합니다
  function generateCalendar() {
    // 빈 칸을 채우기 위해 첫 날에 해당하는 칸만큼 비워둡니다
    for (let i = 0; i < firstDay; i++) {
      attendanceGrid.append('<div class="day"></div>');
    }

    // 해당 월의 모든 날짜를 생성합니다
    for (let day = 1; day <= lastDateOfMonth; day++) {
      const dayString = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const attended = attendance[dayString] || false;
      const dayClass = attended ? "attended" : "not-attended";

      attendanceGrid.append(`
        <div class="day ${dayClass}" data-day="${dayString}">
          ${day}
        </div>
      `);
    }

    // 자동 출석 처리 (현재 날짜)
    const currentDayString = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(currentDate).padStart(2, "0")}`;
    if (!attendance[currentDayString]) {
      // 현재 날짜에 출석이 안 되어 있으면 출석 처리
      attendance[currentDayString] = true;
      localStorage.setItem("attendance", JSON.stringify(attendance));

      // 해당 날짜의 칸을 "attended" 클래스로 변경
      $(`[data-day="${currentDayString}"]`).removeClass("not-attended").addClass("attended");
    }
  }

  generateCalendar();
});
