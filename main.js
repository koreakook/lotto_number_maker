// import './style.css' // Removed for Live Server compatibility

console.log("Lotto script loaded");

// State
let isManualMode = false;
let manualCount = 0;
let selectedNumbers = new Set();

function init() {
  const btnYes = document.getElementById("btn-yes");
  const btnNo = document.getElementById("btn-no");
  const step2 = document.getElementById("step-2");
  const step3 = document.getElementById("step-3");
  const generateBtn = document.getElementById("generate-btn");
  const countBtns = document.querySelectorAll(".count-btn");
  const grid = document.getElementById("number-grid");

  const resultActions = document.getElementById("result-actions");
  const btnReset = document.getElementById("btn-reset");
  const btnRegenerate = document.getElementById("btn-regenerate");

  // Initialize Grid
  for (let i = 1; i <= 45; i++) {
    const btn = document.createElement("button");
    btn.classList.add("grid-btn");
    btn.textContent = i;
    btn.dataset.num = i;
    btn.addEventListener("click", () => toggleNumber(i));
    grid.appendChild(btn);
  }

  // Step 1: Manual Mode?
  btnYes.addEventListener("click", () => {
    isManualMode = true;
    btnYes.classList.add("selected");
    btnNo.classList.remove("selected");
    step2.classList.remove("hidden");
    step3.classList.add("hidden");
    generateBtn.classList.add("hidden");
    resetManualSelection();
  });

  btnNo.addEventListener("click", () => {
    isManualMode = false;
    btnNo.classList.add("selected");
    btnYes.classList.remove("selected");
    step2.classList.add("hidden");
    step3.classList.add("hidden");
    generateBtn.classList.remove("hidden");
    resetManualSelection();
  });

  // Step 2: How many?
  countBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      // UI update
      countBtns.forEach((b) => b.classList.remove("selected"));
      e.target.classList.add("selected");

      // Logic update
      manualCount = parseInt(e.target.dataset.value);
      selectedNumbers.clear();
      updateGridUI();

      // Show next step
      step3.classList.remove("hidden");
      generateBtn.classList.remove("hidden");
    });
  });

  if (generateBtn) {
    generateBtn.addEventListener("click", generateLottoNumbers);
  }

  // Result Actions
  if (btnReset) {
    btnReset.addEventListener("click", resetToStart);
  }
  if (btnRegenerate) {
    btnRegenerate.addEventListener("click", generateLottoNumbers);
  }
}

function resetManualSelection() {
  manualCount = 0;
  selectedNumbers.clear();
  document
    .querySelectorAll(".count-btn")
    .forEach((b) => b.classList.remove("selected"));
  updateGridUI();
}

function resetToStart() {
  // Reset State
  isManualMode = false;
  manualCount = 0;
  selectedNumbers.clear();

  // Reset UI Elements
  document.getElementById("btn-yes").classList.remove("selected");
  document.getElementById("btn-no").classList.remove("selected");
  document
    .querySelectorAll(".count-btn")
    .forEach((b) => b.classList.remove("selected"));
  updateGridUI();

  // Hide/Show Sections
  document.getElementById("step-2").classList.add("hidden");
  document.getElementById("step-3").classList.add("hidden");
  document.getElementById("generate-btn").classList.add("hidden");
  document.getElementById("result-actions").classList.add("hidden");

  // Clear Numbers
  const container = document.querySelector("#number-container");
  container.innerHTML =
    '<div class="placeholder-text">행운의 번호를 생성하세요!</div>';
}

function toggleNumber(num) {
  if (selectedNumbers.has(num)) {
    selectedNumbers.delete(num);
  } else {
    if (selectedNumbers.size < manualCount) {
      selectedNumbers.add(num);
    } else {
      alert(`최대 ${manualCount}개까지만 선택할 수 있습니다.`);
      return;
    }
  }
  updateGridUI();
}

function updateGridUI() {
  const buttons = document.querySelectorAll(".grid-btn");
  buttons.forEach((btn) => {
    const num = parseInt(btn.dataset.num);
    if (selectedNumbers.has(num)) {
      btn.classList.add("selected");
    } else {
      btn.classList.remove("selected");
    }

    // Disable unselected buttons if limit reached
    if (selectedNumbers.size >= manualCount && !selectedNumbers.has(num)) {
      btn.disabled = true;
    } else {
      btn.disabled = false;
    }
  });
}

function generateLottoNumbers() {
  console.log("Generate button clicked");
  try {
    const container = document.querySelector("#number-container");
    if (!container) throw new Error("Number container not found");

    // Validation for manual mode
    if (isManualMode) {
      if (manualCount === 0) {
        alert("선택할 번호 개수를 지정해주세요.");
        return;
      }
      if (selectedNumbers.size !== manualCount) {
        alert(`수동 번호를 ${manualCount}개 선택해주세요.`);
        return;
      }
    }

    container.innerHTML = ""; // Clear previous numbers

    const numbers = new Set(isManualMode ? selectedNumbers : []);

    while (numbers.size < 6) {
      numbers.add(Math.floor(Math.random() * 45) + 1);
    }

    const sortedNumbers = Array.from(numbers).sort((a, b) => a - b);

    sortedNumbers.forEach((num, index) => {
      const ball = document.createElement("div");
      ball.classList.add("lotto-ball");
      ball.textContent = num;

      // Determine color class
      if (num <= 10) ball.classList.add("ball-yellow");
      else if (num <= 20) ball.classList.add("ball-blue");
      else if (num <= 30) ball.classList.add("ball-red");
      else if (num <= 40) ball.classList.add("ball-gray");
      else ball.classList.add("ball-green");

      // Stagger animation
      ball.style.animationDelay = `${index * 0.1}s`;

      container.appendChild(ball);
    });
    console.log("Numbers generated:", sortedNumbers);

    // Show Result Actions
    document.getElementById("generate-btn").classList.add("hidden");
    document.getElementById("result-actions").classList.remove("hidden");
  } catch (error) {
    console.error("Error generating numbers:", error);
    alert("번호 생성 중 오류가 발생했습니다: " + error.message);
  }
}

// Initialize app
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
