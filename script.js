// ======================= STICKERS =======================

let highestZ = 1000

function startStickerDrag(e, stickerType) {
  draggedStickerType = stickerType
  e.dataTransfer.setData("text/plain", stickerType)
}

function allowDrop(e) {
  e.preventDefault()
}

function dropSticker(e) {
  e.preventDefault()

  const stickerType = e.dataTransfer.getData("text/plain") || draggedStickerType
  if (!stickerType) return

  createPlacedSticker(stickerType, e.clientX, e.clientY)
  triggerSparkles()
}

function createPlacedSticker(stickerType, x, y) {
  const canvas = document.getElementById("stickerCanvas")

  const sticker = document.createElement("div")
  sticker.className = "placed-sticker"

  const size = 80 + Math.random() * 50
  sticker.style.width = size + "px"
  sticker.style.height = size + "px"
  sticker.style.left = x - size / 2 + "px"
  sticker.style.top = y - size / 2 + "px"
  sticker.style.zIndex = highestZ++

  const img = document.createElement("img")
  img.src = stickerType

  const deleteBtn = document.createElement("button")
  deleteBtn.className = "sticker-delete-btn"
  deleteBtn.textContent = "✕"
  deleteBtn.onclick = () => sticker.remove()

  sticker.appendChild(img)
  sticker.appendChild(deleteBtn)
  canvas.appendChild(sticker)

  makeStickerDraggable(sticker)
}

function makeStickerDraggable(sticker) {
  let offsetX = 0
  let offsetY = 0
  let isDown = false

  sticker.addEventListener("mousedown", (e) => {
    isDown = true
    offsetX = e.clientX - sticker.offsetLeft
    offsetY = e.clientY - sticker.offsetTop

    sticker.style.zIndex = highestZ++
  })

  document.addEventListener("mousemove", (e) => {
    if (!isDown) return
    sticker.style.left = e.clientX - offsetX + "px"
    sticker.style.top = e.clientY - offsetY + "px"
  })

  document.addEventListener("mouseup", () => {
    isDown = false
  })

  sticker.addEventListener("dblclick", () => {
    sticker.remove()
  })
}

function clearAllStickers() {
  if (!confirm("clear all stickers??")) return
  document.querySelectorAll(".placed-sticker").forEach(s => s.remove())
  triggerSparkles()
}


// ======================= CUSTOM STICKERS =======================

// file upload
document.getElementById("customStickerInput")?.addEventListener("change", (e) => {
  const file = e.target.files[0]
  if (!file) return

  const reader = new FileReader()

  reader.onload = () => {
    const imgData = reader.result
    createPlacedSticker(
      imgData,
      window.innerWidth / 2,
      window.innerHeight / 2
    )
    triggerSparkles()
    showMessage("custom sticker added!! 💖")
  }

  reader.readAsDataURL(file)
})

// ctrl + v paste images
document.addEventListener("paste", function(e){

  const items = e.clipboardData.items

  for(let i=0;i<items.length;i++){

    if(items[i].type.indexOf("image") !== -1){

      const file = items[i].getAsFile()
      const url = URL.createObjectURL(file)

      createPlacedSticker(
        url,
        window.innerWidth / 2,
        window.innerHeight / 2
      )

      triggerSparkles()
      showMessage("pasted sticker!! ✨")

    }

  }

})
