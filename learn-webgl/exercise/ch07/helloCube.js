function helloCube() {
  /** @type {HTMLCanvasElement} */
  let canvas = document.getElementById('hello-cube')

  /** @type {WebGL2RenderingContext} */
  let gl = getWebGLContext(canvas, true)

  // Vertex shader program
  var VSHADER_SOURCE = `
      attribute vec4 a_Position;
      attribute vec4 a_Color;
      uniform mat4 u_MvpMatrix;
      varying vec4 v_Color;
      void main() {
        gl_Position = u_MvpMatrix * a_Position;
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

  // Create a cube
  //    v6----- v5
  //   /|      /|
  //  v1------v0|
  //  | |     | |
  //  | |v7---|-|v4
  //  |/      |/
  //  v2------v3
  var verticesColors = new Float32Array([
    // Vertex coordinates and color
    1.0,
    1.0,
    1.0,
    1.0,
    1.0,
    1.0, // v0 White
    -1.0,
    1.0,
    1.0,
    1.0,
    0.0,
    1.0, // v1 Magenta
    -1.0,
    -1.0,
    1.0,
    1.0,
    0.0,
    0.0, // v2 Red
    1.0,
    -1.0,
    1.0,
    1.0,
    1.0,
    0.0, // v3 Yellow
    1.0,
    -1.0,
    -1.0,
    0.0,
    1.0,
    0.0, // v4 Green
    1.0,
    1.0,
    -1.0,
    0.0,
    1.0,
    1.0, // v5 Cyan
    -1.0,
    1.0,
    -1.0,
    0.0,
    0.0,
    1.0, // v6 Blue
    -1.0,
    -1.0,
    -1.0,
    0.0,
    0.0,
    0.0 // v7 Black
  ])

  // Indices of the vertices
  var indices = new Uint8Array([
    0,
    1,
    2,
    0,
    2,
    3, // front
    0,
    3,
    4,
    0,
    4,
    5, // right
    0,
    5,
    6,
    0,
    6,
    1, // up
    1,
    6,
    7,
    1,
    7,
    2, // left
    7,
    4,
    3,
    7,
    3,
    2, // down
    4,
    7,
    6,
    4,
    6,
    5 // back
  ])

  console.log(indices.length)

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

  var indexBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW)

  var u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix')
  var mvpMatrix = new Matrix4()
  mvpMatrix.setPerspective(30, 1, 1, 100)
  mvpMatrix.lookAt(3, 3, 7, 0, 0, 0, 0, 1, 0)

  gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements)

  gl.enable(gl.DEPTH_TEST)
  gl.clearColor(0.0, 0.0, 0.0, 1.0)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

  // Draw the cube
  gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_BYTE, 0)
}
