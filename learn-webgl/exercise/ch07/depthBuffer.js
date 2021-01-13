function depthBuffer() {
  /** @type {HTMLCanvasElement} */
  let canvas = document.getElementById('depth-buffer')

  /** @type {WebGL2RenderingContext} */
  let gl = getWebGLContext(canvas, true)

  // Vertex shader program
  var VSHADER_SOURCE = `
            attribute vec4 a_Position;
            attribute vec4 a_Color;
            uniform mat4 u_mvpMatrix;
            varying vec4 v_Color;
            void main() {
                gl_Position = u_mvpMatrix * a_Position;
                v_Color = a_Color;
            }
            `

  // Fragment shader program
  var FSHADER_SOURCE = `
            precision mediump float;
            varying vec4 v_Color;
            void main() {
                gl_FragColor = v_Color;
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

  var verticesColors = new Float32Array([
    // Vertex coordinates and color
    0.0,
    1.0,
    0.0,
    0.4,
    1.0,
    0.4, // The back green one
    -0.5,
    -1.0,
    0.0,
    0.4,
    1.0,
    0.4,
    0.5,
    -1.0,
    0.0,
    1.0,
    0.4,
    0.4,

    0.0,
    1.0,
    -2.0,
    1.0,
    1.0,
    0.4, // The middle yellow one
    -0.5,
    -1.0,
    -2.0,
    1.0,
    1.0,
    0.4,
    0.5,
    -1.0,
    -2.0,
    1.0,
    0.4,
    0.4,

    0.0,
    1.0,
    -4.0,
    0.4,
    0.4,
    1.0, // The front blue one
    -0.5,
    -1.0,
    -4.0,
    0.4,
    0.4,
    1.0,
    0.5,
    -1.0,
    -4.0,
    1.0,
    0.4,
    0.4
  ])

  var vertexColorBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW)

  var FSIZE = verticesColors.BYTES_PER_ELEMENT

  var a_Position = gl.getAttribLocation(gl.program, 'a_Position')
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 6, 0)
  gl.enableVertexAttribArray(a_Position)

  var a_Color = gl.getAttribLocation(gl.program, 'a_Color')
  gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3)
  gl.enableVertexAttribArray(a_Color)

  gl.bindBuffer(gl.ARRAY_BUFFER, null)
  gl.clearColor(0, 0, 0, 1)

  var u_mvpMatrix = gl.getUniformLocation(gl.program, 'u_mvpMatrix')
  var mvpMatrix = new Matrix4()

  var modelMatrix = new Matrix4()
  var viewMatrix = new Matrix4()
  var projMatrix = new Matrix4()

  modelMatrix.setTranslate(0.75, 0, 0)
  viewMatrix.setLookAt(0, 0, 5, 0, 0, -100, 0, 1, 0)
  projMatrix.setPerspective(30, canvas.width / canvas.height, 1, 100)

  mvpMatrix.set(projMatrix).multiply(viewMatrix).multiply(modelMatrix)

  gl.uniformMatrix4fv(u_mvpMatrix, false, mvpMatrix.elements)
  // Clear <canvas>
  gl.enable(gl.DEPTH_TEST)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

  // Draw the rectangle
  gl.drawArrays(gl.TRIANGLES, 0, 9)

  modelMatrix.setTranslate(-0.75, 0, 0)
  mvpMatrix.set(projMatrix).multiply(viewMatrix).multiply(modelMatrix)
  gl.uniformMatrix4fv(u_mvpMatrix, false, mvpMatrix.elements)
  gl.drawArrays(gl.TRIANGLES, 0, 9)
}
