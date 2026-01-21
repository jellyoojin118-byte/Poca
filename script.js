let isAdmin = false;
let selectedId = null;
let currentMember = "전체";

const cards = [];

const grid = document.getElementById("pocaGrid");
const editModal = document.getElementById("editModal");
const addModal = document.getElementById("addModal");

/* 렌더 */
function render() {
  grid.innerHTML = "";

  const keyword = document.getElementById("searchInput").value;

  cards
    .filter(c => currentMember === "전체" || c.member === currentMember)
    .filter(c => c.album.includes(keyword))
    .forEach(card => {
      const div = document.createElement("div");
      div.className = "poca-card";
      if (!card.owned) div.classList.add("not-owned");

      const img = document.createElement("img");
      img.src = card.image;
      div.appendChild(img);

      // 클릭 = 보유 토글
      div.onclick = () => {
        card.owned = !card.owned;
        render();
      };

      // 꾹 누르기
      let pressTimer;
      div.addEventListener("touchstart", () => {
        pressTimer = setTimeout(() => {
          if (!isAdmin) return;
          openEdit(card.id);
        }, 600);
      });

      div.addEventListener("touchend", () => {
        clearTimeout(pressTimer);
      });

      grid.appendChild(div);
    });
}

/* 멤버 */
document.querySelectorAll(".member").forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll(".member").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentMember = btn.dataset.member;
    render();
  };
});

/* 검색 */
document.getElementById("searchInput").oninput = render;

/* 관리자 */
document.getElementById("adminBtn").onclick = () => {
  const pw = prompt("비밀번호");
  if (pw === "0000") {
    isAdmin = true;
    alert("관리자 모드 ON");
  }
};

/* 등록 */
document.getElementById("addBtn").onclick = () => {
  if (!isAdmin) return;
  addModal.classList.remove("hidden");
};

document.getElementById("addSaveBtn").onclick = () => {
  const file = document.getElementById("addImage").files[0];
  const reader = new FileReader();
  reader.onload = () => {
    cards.push({
      id: Date.now(),
      member: addMember.value,
      album: addAlbum.value,
      image: reader.result,
      owned: true
    });
    addModal.classList.add("hidden");
    render();
  };
  reader.readAsDataURL(file);
};

/* 수정 */
function openEdit(id) {
  const card = cards.find(c => c.id === id);
  selectedId = id;
  editMember.value = card.member;
  editAlbum.value = card.album;
  editModal.classList.remove("hidden");
}

saveBtn.onclick = () => {
  const card = cards.find(c => c.id === selectedId);
  card.member = editMember.value;
  card.album = editAlbum.value;
  editModal.classList.add("hidden");
  render();
};

deleteBtn.onclick = () => {
  const idx = cards.findIndex(c => c.id === selectedId);
  cards.splice(idx, 1);
  editModal.classList.add("hidden");
  render();
};

/* 닫기 */
closeEdit.onclick = () => editModal.classList.add("hidden");
closeAdd.onclick = () => addModal.classList.add("hidden");

render();