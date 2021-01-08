function drawPoint1() {
  /** @type {HTMLCanvasElement} */
  let canvas = document.getElementById('point1')
  /** @type {WebGL2RenderingContext} */
  let gl = getWebGLContext(canvas, true)

  // Vertex shader program
  var VSHADER_SOURCE = `
  void main() {
    gl_Position = vec4(0.0, 0.0, 0.0, 1.0);
    gl_PointSize = 10.0;
  }
  `

  // Fragment shader program
  var FSHADER_SOURCE = `
  void main() {
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
  }
  `

  var vertex_shader = gl.createShader(gl.VERTEX_SHADER)

  if (vertex_shader) {
    gl.shaderSource(vertex_shader, VSHADER_SOURCE)
    gl.compileShader(vertex_shader)
  }

  var fragment_shader = gl.createShader(gl.FRAGMENT_SHADER)
  if (fragment_shader) {
    gl.shaderSource(fragment_shader, FSHADER_SOURCE)
    gl.compileShader(fragment_shader)
  }

  var program = gl.createProgram()
  if (program) {
    gl.attachShader(program, vertex_shader)
    gl.attachShader(program, fragment_shader)
    gl.linkProgram(program)
    gl.useProgram(program)
  }

  gl.clearColor(0.0, 0.0, 0.0, 1.0)
  gl.clear(gl.COLOR_BUFFER_BIT)
  gl.drawArrays(gl.POINTS, 0, 1)
}
