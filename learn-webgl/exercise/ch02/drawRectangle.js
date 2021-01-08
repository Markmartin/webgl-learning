function drawRectangle() {
  /** @type {HTMLCanvasElement} */
  let canvas = document.getElementById('drawRectangle')
  if (!canvas) {
    console.log('canvas not exist')
    return
  }

  let ctx = canvas.getContext('2d')
  ctx.fillStyle = 'rgba(0, 0, 255, 1)'
  ctx.fillRect(10, 10, 150, 150)
}
