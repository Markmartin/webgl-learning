function helloCanvas() {
  let canvas = document.getElementById('webgl')
  let gl = getWebGLContext(canvas, true)
  gl.clearColor(0.5, 0.5, 0.5, 1.0)
  // gl.clearColor()
  gl.clear(gl.COLOR_BUFFER_BIT)
}
