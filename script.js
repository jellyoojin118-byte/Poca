let isAdmin = false;
let selectedCard = null;

const adminBtn = document.getElementById("adminBtn");
const addBtn = document.getElementById("addBtn");
const fileInput = document.getElementById("fileInput");
const cardGrid = document.getElementById("cardGrid");

const modal = document.getElementById("editModal");
const closeModal = document.getElementById("closeModal");
const editMember = document.getElementById("editMember");
const editAlbum = document.getElementById("editAlbum");
const saveBtn = document.getElementById("saveBtn");
const deleteBtn = document.getElementById("deleteBtn");

/* 관리자 모드 */
adminBtn.onclick = () => {
  const pw = prompt("비밀번호 입력");
  if (pw === "0000") {
    isAdmin = !isAdmin;
    alert(isAdmin ? "관리자 모드 ON" : "관리자 모드 OFF");
  }
};

/* 포카 추가 */
addBtn.onclick = () => {
  if (!isAdmin) return alert("관리자 모드만 가능");
  fileInput.click();
};

fileInput.onchange = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const member = prompt("멤버 이름");
  const album = prompt("앨범 / 포카 이름");

  const reader = new FileReader();
  reader.onload = () => {
    const card = document.createElement("div");
    card.className = "card";
    card.dataset.member = member;
    card.dataset.album = album;

    const img = document.createElement("img");
    img.src = reader.result;

    card.appendChild(img);
    cardGrid.appendChild(card);

    /* 보유 토글 */
    card.onclick = () => {
      card.classList.toggle("unowned");
    };

    /* 관리자 수정 */
    card.oncontextmenu = (e) => {
      e.preventDefault();
      if (!isAdmin) return;

      selectedCard = card;
      editMember.value = card.dataset.member;
      editAlbum.value = card.dataset.album;
      modal.classList.remove("hidden");
    };
  };
  reader.readAsDataURL(file);
  fileInput.value = "";
};

/* 모달 */
closeModal.onclick = () => modal.classList.add("hidden");

saveBtn.onclick = () => {
  selectedCard.dataset.member = editMember.value;
  selectedCard.dataset.album = editAlbum.value;
  modal.classList.add("hidden");
};

deleteBtn.onclick = () => {
  selectedCard.remove();
  modal.classList.add("hidden");
};