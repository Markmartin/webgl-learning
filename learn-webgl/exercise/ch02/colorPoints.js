function drawColorPoints() {
  /** @type {HTMLCanvasElement} */
  let canvas = document.getElementById('color-points')

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
    precision mediump float;
    uniform vec4 u_FragColor;
    void main() {
      gl_FragColor = u_FragColor;
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
    // let position = new Float32Array([0.0, 0.5, 0.0])
    // gl.vertexAttrib3fv(a_Position, position)
    gl.vertexAttrib3f(a_Position, 0.5, 0.5, 0.0)
  }

  var a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize')
  if (a_Position >= 0) {
    gl.vertexAttrib1f(a_PointSize, 10.0)
  }

  var u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor')
  //   if (u_FragColor) {
  //     gl.uniform4f(u_FragColor, 0.0, 1.0, 0.0, 1.0)
  //   }

  gl.clearColor(0.0, 0.0, 0.0, 1.0)
  gl.clear(gl.COLOR_BUFFER_BIT)
  //   gl.drawArrays(gl.POINTS, 0, 1)

  var g_points = []
  var g_colors = []

  if (canvas) {
    canvas.addEventListener('mousedown', function (e) {
      let x = e.clientX
      let y = e.clientY
      let rect = e.target.getBoundingClientRect()
      let x_Position = (x - rect.left - rect.width / 2) / (rect.width / 2)
      let y_Position = (rect.height / 2 - (y - rect.top)) / (rect.height / 2)
      console.log(`x:${x_Position},y:${y_Position}`)

      g_points.push({
        x: x_Position,
        y: y_Position
      })

      if (x_Position >= 0.0 && y_Position >= 0.0) {
        g_colors.push([1.0, 0.0, 0.0, 1.0])
      } else if (x_Position < 0.0 && y_Position < 0.0) {
        g_colors.push([0.0, 1.0, 0.0, 1.0])
      } else {
        g_colors.push([1.0, 1.0, 1.0, 1.0])
      }

      gl.clear(gl.COLOR_BUFFER_BIT)

      for (let i = 0; i < g_points.length; i++) {
        gl.vertexAttrib3f(a_Position, g_points[i].x, g_points[i].y, 0.0)
        gl.uniform4f(u_FragColor, g_colors[i][0], g_colors[i][1], g_colors[i][2], g_colors[i][3])
        gl.drawArrays(gl.POINTS, 0, 1)
      }
    })
  }
}
