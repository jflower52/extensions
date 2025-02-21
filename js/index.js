// 환영 메시지 처리
$(document).ready(function () {
  const welcomeMessage = $("#welcomeMessage");
  const resetNameButton = $("#resetNameButton");

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
});

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

// 현재 온도
(function getLocation() {
  navigator.geolocation.getCurrentPosition(async (position) => {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=de4298a699ccf43701fe6d0d4034a7c1&units=metric`);
    const data = await response.json();
    const {
      main: { temp },
    } = data;
    document.getElementById("weather").innerText = `현재 온도: ${temp}`;
  });
})();
