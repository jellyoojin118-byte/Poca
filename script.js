const ADMIN_PASSWORD = "0000";

let isAdmin = false;
let currentMember = "전체";
let editIndex = null;

let pocas = JSON.parse(localStorage.getItem("pocas") || "[]");

const grid = document.querySelector(".poca-grid");
const members = document.querySelectorAll(".member");
const searchInput = document.getElementById("searchInput");

const addBtn = document.querySelector(".fab.add");
const adminBtn = document.querySelector(".fab.admin");

/* 모달 */
const modal = document.getElementById("editModal");
const closeModal = document.getElementById("closeModal");
const editMember = document.getElementById("editMember");
const editAlbum = document.getElementById("editAlbum");
const saveBtn = document.getElementById("saveBtn");
const deleteBtn = document.getElementById("deleteBtn");

/* 렌더 */
function render() {
  grid.innerHTML = "";
  const keyword = searchInput.value.toLowerCase();

  pocas.forEach((p, i) => {
    if (
      (currentMember !== "전체" && p.member !== currentMember) ||
      !p.album.toLowerCase().includes(keyword)
    ) return;

    const card = document.createElement("div");
    card.className = "poca-card";
    card.style.backgroundImage = `url(${p.image})`;
    if (!p.owned) card.classList.add("not-owned");

    // 보유 / 미보유
    card.addEventListener("click", () => {
      p.owned = !p.owned;
      save();
    });

    // 꾹 누르기 (관리자)
    if (isAdmin) {
      let timer;
      card.addEventListener("touchstart", () => {
        timer = setTimeout(() => openModal(i), 600);
      });
      card.addEventListener("touchend", () => clearTimeout(timer));
    }

    grid.appendChild(card);
  });
}

function save() {
  localStorage.setItem("pocas", JSON.stringify(pocas));
  render();
}

/* 멤버 필터 */
members.forEach(btn => {
  btn.addEventListener("click", () => {
    members.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentMember = btn.textContent;
    render();
  });
});

/* 검색 */
searchInput.addEventListener("input", render);

/* 관리자 */
adminBtn.addEventListener("click", () => {
  const pw = prompt("관리자 비밀번호");
  if (pw === ADMIN_PASSWORD) {
    isAdmin = true;
    alert("관리자 모드 ON");
  }
});

/* 추가 */
addBtn.addEventListener("click", () => {
  if (!isAdmin) return;

  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";

  input.onchange = e => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      const member = prompt("멤버 이름");
      const album = prompt("앨범 / 포카 이름");

      if (!member || !album) return;

      pocas.push({
        member,
        album,
        image: reader.result,
        owned: true
      });

      save();
    };

    reader.readAsDataURL(file);
  };

  input.click();
});

/* 수정 / 삭제 */
function openModal(index) {
  editIndex = index;
  editMember.value = pocas[index].member;
  editAlbum.value = pocas[index].album;
  modal.classList.remove("hidden");
}

closeModal.onclick = () => modal.classList.add("hidden");

saveBtn.onclick = () => {
  pocas[editIndex].member = editMember.value;
  pocas[editIndex].album = editAlbum.value;
  modal.classList.add("hidden");
  save();
};

deleteBtn.onclick = () => {
  pocas.splice(editIndex, 1);
  modal.classList.add("hidden");
  save();
};

render();