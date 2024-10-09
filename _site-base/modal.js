function closeIfIsModal(event) {
  const modal = document.getElementById("myModal");
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

function closeModal() {
  const modal = document.getElementById("myModal");
  modal.style.display = "none";
}

function addModalStyle() {
  const style = document.createElement("style");
  style.innerHTML = /* css */`
    .modal { display: none; position: fixed; z-index: 1; left: 0; top: 0; width: 100%; height: 100%; overflow: auto; background-color: rgb(0,0,0); background-color: rgba(0,0,0,0.4); padding-top: 60px; }
    .modal-content { background-color: #fefefe; margin: 5% auto; padding: 20px; border: 1px solid #888; width: 80%; border-radius: 1rem; }
    .close { color: #aaa; float: right; font-size: 28px; font-weight: bold; }
    .close:hover, .close:focus { color: black; text-decoration: none; cursor: pointer; }`;
  document.head.appendChild(style);
}

function addModalEvents() {
  document.getElementById('closeModal').addEventListener('click', closeModal);
  window.addEventListener('click', closeIfIsModal);
}

export function createaModal() {
  const modal = document.createElement("div");
  modal.id = "myModal";
  modal.classList.add("modal");
  modal.style.display = "none";
  modal.innerHTML = /* html */ `
    <div class="modal-content">
      <span id="closeModal" class="close">&times;</span>
      <p id="modalText">Texto del modal</p>
    </div>
  `;
  document.body.appendChild(modal);
  addModalStyle();
  addModalEvents();
}
