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
}
// 1초마다 업데이트
setInterval(() => {
  currentTime();
}, 1000);
