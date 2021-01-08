function drawPoint2() {
  /** @type {HTMLCanvasElement} */
  let canvas = document.getElementById('point2')

  canvas.addEventListener('mousedown', function (e) {
    console.log(e)
  })

  /** @type {WebGL2RenderingContext} */
  let gl = getWebGLContext(canvas, true)

  // Vertex shader program
  var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  attribute float a_PointSize;
  void main() {
    gl_Position = a_Position;
    gl_PointSize = a_PointSize;
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
    gl.program = program
  }

  var a_Position = gl.getAttribLocation(gl.program, 'a_Position')
  if (a_Position >= 0) {
    let position = new Float32Array([0.0, 0.5, 0.0])
    gl.vertexAttrib3fv(a_Position, position)
    // gl.vertexAttrib3f(a_Position, 0.5, 0.5, 0.0)
  }

  var a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize')
  if (a_Position >= 0) {
    gl.vertexAttrib1f(a_PointSize, 20.0)
  }

  gl.clearColor(0.0, 0.0, 0.0, 1.0)
  gl.clear(gl.COLOR_BUFFER_BIT)
  gl.drawArrays(gl.POINTS, 0, 1)
}
