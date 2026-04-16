let draggedSticker = null

function allowDrop(e){
  e.preventDefault()
}

function startStickerDrag(e, src){
  e.dataTransfer.setData("text", src)
}

function dropSticker(e){
  e.preventDefault()

  const src = e.dataTransfer.getData("text")

  const img = document.createElement("img")
  img.src = src
  img.className = "sticker"

  img.style.left = e.clientX + "px"
  img.style.top = e.clientY + "px"

  makeDraggable(img)

  document.getElementById("stickerCanvas").appendChild(img)
}

function makeDraggable(el){

  let offsetX = 0
  let offsetY = 0

  el.addEventListener("mousedown", (e)=>{

    draggedSticker = el

    offsetX = e.offsetX
    offsetY = e.offsetY

    document.addEventListener("mousemove", moveSticker)
    document.addEventListener("mouseup", stopMove)

  })

  function moveSticker(e){

    if(!draggedSticker) return

    draggedSticker.style.left = (e.clientX - offsetX) + "px"
    draggedSticker.style.top = (e.clientY - offsetY) + "px"

  }

  function stopMove(){

    document.removeEventListener("mousemove", moveSticker)
    document.removeEventListener("mouseup", stopMove)

    draggedSticker = null

  }

}

/* borrar todo */

function clearAllStickers(){
  document.getElementById("stickerCanvas").innerHTML = ""
}

/* custom stickers */

document.addEventListener("paste", function(e){

  const items = e.clipboardData.items

  for(let i=0;i<items.length;i++){

    if(items[i].type.indexOf("image") !== -1){

      const file = items[i].getAsFile()
      const url = URL.createObjectURL(file)

      const img = document.createElement("img")
      img.src = url
      img.className = "sticker"

      img.style.left = "50%"
      img.style.top = "50%"

      makeDraggable(img)

      document.getElementById("stickerCanvas").appendChild(img)

    }

  }

})
