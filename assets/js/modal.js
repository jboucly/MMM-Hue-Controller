var btn = document.getElementById("btn-modal");
var modal = document.getElementById("color-modal");
var span = document.getElementsByClassName("close")[0];
const modalContainer = document.getElementById("modal-container");

const colors = [
  "#78cff2",
  "#2da7e4",
  "#f2bba0",
  "#f3c39a",
  "#50e8ff",
  "#94c930",
  "#86bc39",
];

colors.forEach((color) => {
  const div = document.createElement("div");
  div.classList.add("color");
  div.style.backgroundColor = color;

  div.addEventListener("click", () => {
    document.dispatchEvent(new CustomEvent("colorChange", { detail: color }));
    modal.style.display = "none";
  });

  modalContainer.appendChild(div);
});

btn.onclick = function () {
  modal.style.display = "block";
};

span.onclick = function () {
  modal.style.display = "none";
};

window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};
