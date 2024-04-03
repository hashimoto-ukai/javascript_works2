const RANDOM_SENTENCE_URL_API = "https://api.quotable.io/random";
const typeDisplay = document.getElementById("typeDisplay");
const typeInput = document.getElementById("typeInput");
const timer = document.getElementById("timer");
const typeSound = new Audio("./audio/typing-sound.mp3");
const wrongSound = new Audio("./audio/wrong.mp3");
const correctSound = new Audio("./audio/correct.mp3");
let StartTime;
let originTime = 30;
let timerInterval;

// inputイベントのハンドラを追加
typeInput.addEventListener("input", () => {
  // タイプ音を再生
  typeSound.play();
  typeSound.currentTime = 0;

  const sentenceArray = typeDisplay.querySelectorAll("span");
  const arrayValue = typeInput.value.split("");
  let correct = true;
  sentenceArray.forEach((characterSpan, index) => {
    if (arrayValue[index] == null) {
      characterSpan.classList.remove("correct");
      characterSpan.classList.remove("incorrect");
      correct = false;
    } else if (characterSpan.innerText == arrayValue[index]) {
      characterSpan.classList.add("correct");
      characterSpan.classList.remove("incorrect");
    } else {
      characterSpan.classList.add("incorrect");
      characterSpan.classList.remove("correct");
      wrongSound.play();
      wrongSound.currentTime = 0;
      correct = false;
    }
  });

  if (correct == true) {
    correctSound.play();
    correctSound.currentTime = 0;
    RenderNextSentence();
  }
});

// ランダムな文章を取得する関数
async function GetRandomSentence() {
  const response = await fetch(RANDOM_SENTENCE_URL_API);
  const data = await response.json();
  return data.content;
}

// ランダムな文章を表示する関数
async function RenderNextSentence() {
  const sentence = await GetRandomSentence();
  console.log(sentence);

  typeDisplay.innerText = "";
  let oneText = sentence.split("");
  oneText.forEach((character) => {
    const characterSpan = document.createElement("span");
    characterSpan.innerText = character;
    typeDisplay.appendChild(characterSpan);
  });

  typeInput.value = "";

  StartTimer();
}

// タイマーを開始する関数
function StartTimer() {
  if (!StartTime) {
    timerInterval = setInterval(() => {
      timer.innerText = originTime - getTimerTime();
      if (timer.innerText <= 0) TimeUp();
    }, 1000);
    StartTime = new Date();
  }
}

// タイマーの経過時間を取得する関数
function getTimerTime() {
  return Math.floor((new Date() - StartTime) / 1000);
}

// タイムアップした場合の処理
function TimeUp() {
  clearInterval(timerInterval);
  RenderNextSentence();
}

// 最初の文章を表示
RenderNextSentence();