const input = document.getElementById("customInput");
const addBtn = document.getElementById("addBtn");
const list = document.getElementById("customList");
const countText = document.getElementById("count");

let customExtensions = new Set();

addBtn.addEventListener("click", () => {
  const value = input.value.trim().toLowerCase();

  if (!value) return;
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
    render();
  }
});