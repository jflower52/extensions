$(document).ready(function () {
  const welcomeMessage = $("#welcomeMessage");
  const resetNameButton = $("#resetNameButton");

  // 저장된 이름 가져오기
  function loadName() {
    const savedName = localStorage.getItem("userName");
    if (savedName) {
      welcomeMessage.text(`${savedName}님 환영합니다!`);
    } else {
      // 알림창으로 이름 입력 받기
      const name = prompt("이름을 입력하세요");
      if (name && name.trim()) {
        localStorage.setItem("userName", name.trim());
        welcomeMessage.text(`${name.trim()}님 환영합니다!`);
      }
    }
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

    // 잔디 출석체크 업데이트
    updateGrass(date);
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

  // 잔디 출석체크 업데이트
  function updateGrass(day) {
    const grassGrid = $("#grassGrid");
    const currentDay = new Date().getDate();
    const lastActiveDate = localStorage.getItem("lastActiveDate");

    // 잔디 그리드가 비어있는 경우에만 셀 생성
    if (grassGrid.children().length === 0) {
      // 그리드 셀 생성 (한 번만)
      for (let i = 1; i <= 30; i++) {
        const cell = $(`<div class="grass-cell" data-day="${i}"></div>`);
        if (lastActiveDate && lastActiveDate == i) {
          cell.addClass("active"); // 활성화된 날은 초록색
        } else {
          cell.addClass("inactive"); // 비활성화된 날은 회색
        }
        grassGrid.append(cell);
      }
    }

    // 현재 날짜 활동 표시
    if (currentDay !== lastActiveDate) {
      localStorage.setItem("lastActiveDate", currentDay);
      // 마지막 활성화된 날짜를 표시
      $(`.grass-cell[data-day="${currentDay}"]`).addClass("active").removeClass("inactive");
    }
  }

  // 온도 표시
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

  // 잔디 출석 그리드 토글 (접기/펼치기)
  $("#toggleGrassButton").click(function () {
    $("#grassGrid").toggle();
  });
});
