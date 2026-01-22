let isAdmin = false;
let selectedCard = null;
let currentMember = "all";

const pocaGrid = document.getElementById("pocaGrid");
const imageInput = document.getElementById("imageInput");

document.getElementById("adminBtn").onclick = () => {
  openModal("adminModal");
};

document.getElementById("adminConfirmBtn").onclick = () => {
  const pw = document.getElementById("adminPassword").value;
  if (pw === "0000") {
    isAdmin = true;
    alert("관리자 모드 ON");
    closeModal("adminModal");
  } else {
    alert("비밀번호 틀림");
  }
};

document.getElementById("addBtn").onclick = () => {
  if (!isAdmin) {
    alert("관리자만 등록 가능");
    return;
  }
  imageInput.click();
};

imageInput.onchange = (e) => {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onload = () => {
    createCard(reader.result, "멤버", "앨범");
  };
  reader.readAsDataURL(file);
};

function createCard(img, member, album) {
  const card = document.createElement("div");
  card.className = "poca-card";
  card.style.backgroundImage = `url(${img})`;
  card.dataset.member = member;
  card.dataset.album = album;

  card.onclick = () => {
    card.classList.toggle("not-owned");
  };

  card.oncontextmenu = (e) => {
    e.preventDefault();
    if (!isAdmin) return;
    selectedCard = card;
    document.getElementById("editMember").value = member;
    document.getElementById("editAlbum").value = album;
    openModal("editModal");
  };

  pocaGrid.appendChild(card);
}

document.getElementById("saveBtn").onclick = () => {
  selectedCard.dataset.member = document.getElementById("editMember").value;
  selectedCard.dataset.album = document.getElementById("editAlbum").value;
  closeModal("editModal");
};

document.getElementById("deleteBtn").onclick = () => {
  selectedCard.remove();
  closeModal("editModal");
};

function openModal(id) {
  document.getElementById(id).classList.remove("hidden");
}

function closeModal(id) {
  document.getElementById(id).classList.add("hidden");
}