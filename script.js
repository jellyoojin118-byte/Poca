let isAdmin = false;
let selectedCard = null;

const cards = [
  {
    id: 1,
    member: "정한",
    album: "FACE THE SUN",
    image: "",
    owned: true
  }
];

const grid = document.getElementById("pocaGrid");
const editModal = document.getElementById("editModal");
const addModal = document.getElementById("addModal");

function renderCards() {
  grid.innerHTML = "";

  cards.forEach(card => {
    const div = document.createElement("div");
    div.className = "poca-card";
    if (!card.owned) div.classList.add("not-owned");

    if (card.image) {
      const img = document.createElement("img");
      img.src = card.image;
      div.appendChild(img);
    }

    div.onclick = () => {
      card.owned = !card.owned;
      renderCards();
    };

    div.oncontextmenu = e => {
      e.preventDefault();
      if (!isAdmin) return;

      selectedCard = card;
      document.getElementById("editMember").value = card.member;
      document.getElementById("editAlbum").value = card.album;
      editModal.classList.remove("hidden");
    };

    grid.appendChild(div);
  });
}

renderCards();

/* 관리자 */
document.getElementById("adminBtn").onclick = () => {
  const pw = prompt("비밀번호 입력");
  if (pw === "0000") {
    isAdmin = true;
    alert("관리자 모드 ON");
  }
};

/* 수정 */
document.getElementById("saveBtn").onclick = () => {
  selectedCard.member = document.getElementById("editMember").value;
  selectedCard.album = document.getElementById("editAlbum").value;
  editModal.classList.add("hidden");
  renderCards();
};

/* 삭제 */
document.getElementById("deleteBtn").onclick = () => {
  const idx = cards.findIndex(c => c.id === selectedCard.id);
  cards.splice(idx, 1);
  editModal.classList.add("hidden");
  renderCards();
};

/* 모달 닫기 */
document.getElementById("closeModal").onclick = () => {
  editModal.classList.add("hidden");
};

/* 추가 */
document.getElementById("addBtn").onclick = () => {
  if (!isAdmin) return;
  addModal.classList.remove("hidden");
};

document.getElementById("addSaveBtn").onclick = () => {
  const member = document.getElementById("addMember").value;
  const album = document.getElementById("addAlbum").value;
  const file = document.getElementById("addImage").files[0];

  const reader = new FileReader();
  reader.onload = () => {
    cards.push({
      id: Date.now(),
      member,
      album,
      image: reader.result,
      owned: true
    });
    addModal.classList.add("hidden");
    renderCards();
  };
  reader.readAsDataURL(file);
};

document.getElementById("closeAddModal").onclick = () => {
  addModal.classList.add("hidden");
};