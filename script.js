let draggedSticker = null;
let offsetX = 0;
let offsetY = 0;

const canvas = document.getElementById("stickerCanvas");

// allow drop
function allowDrop(e) {
  e.preventDefault();
}

// start drag from toolbar
function startStickerDrag(e, src) {
  e.dataTransfer.setData("sticker", src);
}

// drop sticker
function dropSticker(e) {
  e.preventDefault();

  const src = e.dataTransfer.getData("sticker");
  if (!src) return;

  createPlacedSticker(src, e.clientX, e.clientY, true);
}

// create sticker
function createPlacedSticker(src, x, y, save = true) {
  const img = document.createElement("img");

  img.src = src;
  img.className = "placedSticker";

  img.style.left = x + "px";
  img.style.top = y + "px";

  img.addEventListener("mousedown", startMoveSticker);

  canvas.appendChild(img);

  if (save) saveStickers();
}

// move sticker
function startMoveSticker(e) {
  draggedSticker = e.target;

  offsetX = e.clientX - draggedSticker.offsetLeft;
  offsetY = e.clientY - draggedSticker.offsetTop;

  document.addEventListener("mousemove", moveSticker);
  document.addEventListener("mouseup", stopMoveSticker);
}

function moveSticker(e) {
  if (!draggedSticker) return;

  draggedSticker.style.left = e.clientX - offsetX + "px";
  draggedSticker.style.top = e.clientY - offsetY + "px";
}

function stopMoveSticker() {
  if (draggedSticker) saveStickers();

  document.removeEventListener("mousemove", moveSticker);
  document.removeEventListener("mouseup", stopMoveSticker);

  draggedSticker = null;
}

// save stickers
function saveStickers() {
  const stickers = [];

  document.querySelectorAll(".placedSticker").forEach(sticker => {
    stickers.push({
      src: sticker.src,
      x: sticker.style.left,
      y: sticker.style.top
    });
  });

  localStorage.setItem("stickers", JSON.stringify(stickers));
}

// load stickers
function loadStickers() {
  const saved = localStorage.getItem("stickers");
  if (!saved) return;

  const stickers = JSON.parse(saved);

  stickers.forEach(sticker => {
    createPlacedSticker(sticker.src, parseInt(sticker.x), parseInt(sticker.y), false);
  });
}

// clear stickers
function clearAllStickers() {
  document.querySelectorAll(".placedSticker").forEach(s => s.remove());
  localStorage.removeItem("stickers");
}

// custom sticker upload
document.getElementById("customStickerInput")?.addEventListener("change", e => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = function(event) {
    createPlacedSticker(
      event.target.result,
      window.innerWidth / 2,
      window.innerHeight / 2,
      true
    );
  };

  reader.readAsDataURL(file);
});

// load on start
window.addEventListener("load", loadStickers);
