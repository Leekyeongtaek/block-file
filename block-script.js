const input = document.getElementById("customInput");
const addBtn = document.getElementById("addBtn");
const clearBtn = document.getElementById("clearBtn");
const list = document.getElementById("customList");
const countText = document.getElementById("count");
const fixedCheckboxes = document.querySelectorAll('input[type="checkbox"]');

// 영문, 숫자 정규식
input.addEventListener("input", () => {
  input.value = input.value
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
});

const savedCustom = JSON.parse(
  localStorage.getItem("customExtensions")
) || [];

let customExtensions = new Set(savedCustom);

function saveCustomExtensions() {
  localStorage.setItem(
    "customExtensions",
    JSON.stringify([...customExtensions])
  );
}

function getFixedExtensions() {
    return Array.from(fixedCheckboxes).map(cb => cb.value);
}

// localStorage 변수 단위 -> 프로토콜 + 도메인 + 포트
const savedFixed = JSON.parse(localStorage.getItem("fixedExtensions")) || [];

fixedCheckboxes.forEach(cb => {
  if (savedFixed.includes(cb.value)) {
    cb.checked = true;
  }
});

fixedCheckboxes.forEach(cb => {
  cb.addEventListener("change", () => {
    const checkedValues = Array.from(fixedCheckboxes)
      .filter(c => c.checked)
      .map(c => c.value);

    localStorage.setItem(
      "fixedExtensions",
      JSON.stringify(checkedValues)
    );
  });
});

addBtn.addEventListener("click", () => {
  const value = input.value.trim().toLowerCase();

  if (!value) {
    return;
  }

  if (!/^[a-z0-9]+$/.test(value)) {
    alert("확장자는 영문과 숫자만 입력 가능합니다.");
    return;
  }

  const fixedExtensions = getFixedExtensions();
  if (fixedExtensions.includes(value)) {
    alert("고정 확장자에 있는 값은 입력할 수 없습니다.");
    return;
  }

  if (value.length > 20) {
    alert("확장자는 최대 20자까지 입력 가능합니다.");
    return;
  }

  if (customExtensions.has(value)) {
    alert("이미 등록된 확장자입니다.");
    return;
  }

  if (customExtensions.size >= 200) {
    alert("최대 200개까지 등록 가능합니다.");
    return;
  }

  customExtensions.add(value);
  saveCustomExtensions();
  input.value = "";
  render();
});

function render() {
  list.innerHTML = "";
  customExtensions.forEach(ext => {
    const tag = document.createElement("div");
    tag.className = "tag";
    tag.innerHTML = `
      ${ext}
      <button data-ext="${ext}">✕</button>
    `;
    list.appendChild(tag);
  });

  countText.textContent = `${customExtensions.size} / 200`;
}

list.addEventListener("click", (e) => {
  if (e.target.tagName === "BUTTON") {
    const ext = e.target.dataset.ext;
    customExtensions.delete(ext);
    saveCustomExtensions();
    render();
  }
});

clearBtn.addEventListener("click", () => {
  if (customExtensions.size === 0) {
    return;
  }

  const ok = confirm("커스텀 확장자를 모두 삭제하시겠습니까?");
  if (!ok) {
    return;
  }

  customExtensions.clear();
  localStorage.removeItem("customExtensions");
  render();
});

render();