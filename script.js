let isAdmin = false;
let currentMember = "전체";
let editIndex = null;

const pocas = JSON.parse(localStorage.getItem("pocas") || "[]");

const grid = document.getElementById("pocaGrid");
const searchInput = document.getElementById("searchInput");
const members = document.querySelectorAll(".member");
const addBtn = document.querySelector(".fab.add");
const adminBtn = document.querySelector(".fab.admin");

const modal = document.getElementById("modal");
const editMember = document.getElementById("editMember");
const editAlbum = document.getElementById("editAlbum");

function save() {
  localStorage.setItem("pocas", JSON.stringify(pocas));
}

function render() {
  grid.innerHTML = "";
  const keyword = searchInput.value.toLowerCase();

  pocas.forEach((p, i) => {
    if (
      (currentMember === "전체" || p.member === currentMember) &&
      p.album.toLowerCase().includes(keyword)
    ) {
      const card = document.createElement("div");
      card.className = "poca-card" + (p.owned ? "" : " not-owned");
      card.style.backgroundImage = `url(${p.image})`;

      card.onclick = () => {
        p.owned = !p.owned;
        save();
        render();
      };

      if (isAdmin) {
        let t;
        card.ontouchstart = () => t = setTimeout(() => openModal(i), 600);
        card.ontouchend = () => clearTimeout(t);
      }

      grid.appendChild(card);
    }
  });
}

members.forEach(m => {
  m.onclick = () => {
    members.forEach(x => x.classList.remove("active"));
    m.classList.add("active");
    currentMember = m.textContent;
    render();
  };
});

searchInput.oninput = render;

adminBtn.onclick = () => {
  if (prompt("비밀번호 입력") === "0000") {
    isAdmin = true;
    alert("관리자 모드 ON");
  }
};

addBtn.onclick = () => {
  if (!isAdmin) return alert("관리자만 가능");

  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";

  input.onchange = e => {
    const reader = new FileReader();
    reader.onload = () => {
      const member = prompt("멤버");
      const album = prompt("포카 이름");
      pocas.push({ member, album, image: reader.result, owned: true });
      save();
      render();
    };
    reader.readAsDataURL(e.target.files[0]);
  };
  input.click();
};

function openModal(i) {
  editIndex = i;
  editMember.value = pocas[i].member;
  editAlbum.value = pocas[i].album;
  modal.classList.remove("hidden");
}

document.querySelector(".close-btn").onclick = () =>
  modal.classList.add("hidden");

document.getElementById("saveBtn").onclick = () => {
  pocas[editIndex].member = editMember.value;
  pocas[editIndex].album = editAlbum.value;
  save();
  modal.classList.add("hidden");
  render();
};

document.getElementById("deleteBtn").onclick = () => {
  pocas.splice(editIndex, 1);
  save();
  modal.classList.add("hidden");
  render();
};

render();