function coloredCube() {
  /** @type {HTMLCanvasElement} */
  let canvas = document.getElementById('colored-cube')

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
  var vertices = new Float32Array([
    // Vertex coordinates
    1.0,
    1.0,
    1.0,
    -1.0,
    1.0,
    1.0,
    -1.0,
    -1.0,
    1.0,
    1.0,
    -1.0,
    1.0, // v0-v1-v2-v3 front
    1.0,
    1.0,
    1.0,
    1.0,
    -1.0,
    1.0,
    1.0,
    -1.0,
    -1.0,
    1.0,
    1.0,
    -1.0, // v0-v3-v4-v5 right
    1.0,
    1.0,
    1.0,
    1.0,
    1.0,
    -1.0,
    -1.0,
    1.0,
    -1.0,
    -1.0,
    1.0,
    1.0, // v0-v5-v6-v1 up
    -1.0,
    1.0,
    1.0,
    -1.0,
    1.0,
    -1.0,
    -1.0,
    -1.0,
    -1.0,
    -1.0,
    -1.0,
    1.0, // v1-v6-v7-v2 left
    -1.0,
    -1.0,
    -1.0,
    1.0,
    -1.0,
    -1.0,
    1.0,
    -1.0,
    1.0,
    -1.0,
    -1.0,
    1.0, // v7-v4-v3-v2 down
    1.0,
    -1.0,
    -1.0,
    -1.0,
    -1.0,
    -1.0,
    -1.0,
    1.0,
    -1.0,
    1.0,
    1.0,
    -1.0 // v4-v7-v6-v5 back
  ])

  var colors = new Float32Array([
    // Colors
    0.4,
    0.4,
    1.0,
    0.4,
    0.4,
    1.0,
    0.4,
    0.4,
    1.0,
    0.4,
    0.4,
    1.0, // v0-v1-v2-v3 front(blue)
    0.4,
    1.0,
    0.4,
    0.4,
    1.0,
    0.4,
    0.4,
    1.0,
    0.4,
    0.4,
    1.0,
    0.4, // v0-v3-v4-v5 right(green)
    1.0,
    0.4,
    0.4,
    1.0,
    0.4,
    0.4,
    1.0,
    0.4,
    0.4,
    1.0,
    0.4,
    0.4, // v0-v5-v6-v1 up(red)
    1.0,
    1.0,
    0.4,
    1.0,
    1.0,
    0.4,
    1.0,
    1.0,
    0.4,
    1.0,
    1.0,
    0.4, // v1-v6-v7-v2 left
    1.0,
    1.0,
    1.0,
    1.0,
    1.0,
    1.0,
    1.0,
    1.0,
    1.0,
    1.0,
    1.0,
    1.0, // v7-v4-v3-v2 down
    0.4,
    1.0,
    1.0,
    0.4,
    1.0,
    1.0,
    0.4,
    1.0,
    1.0,
    0.4,
    1.0,
    1.0 // v4-v7-v6-v5 back
  ])

  // Indices of the vertices
  var indices = new Uint8Array([
    // Indices of the vertices
    0,
    1,
    2,
    0,
    2,
    3, // front
    4,
    5,
    6,
    4,
    6,
    7, // right
    8,
    9,
    10,
    8,
    10,
    11, // up
    12,
    13,
    14,
    12,
    14,
    15, // left
    16,
    17,
    18,
    16,
    18,
    19, // down
    20,
    21,
    22,
    20,
    22,
    23 // back
  ])

  console.log(indices.length)

  var vertexBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

  var a_Position = gl.getAttribLocation(gl.program, 'a_Position')
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0)
  gl.enableVertexAttribArray(a_Position)
  indices
  var colorBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW)

  var a_Color = gl.getAttribLocation(gl.program, 'a_Color')
  gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, 0, 0)
  gl.enableVertexAttribArray(a_Color)

  var indexBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW)

  var u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix')
  var mvpMatrix = new Matrix4()
  mvpMatrix.setPerspective(30, 1, 1, 100)
  mvpMatrix.lookAt(3, 3, 7, 0, 0, 0, 0, 1, 0)

  gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements)

  gl.clearColor(0.0, 0.0, 0.0, 1.0)
  gl.enable(gl.DEPTH_TEST)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

  // Draw the cube
  gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_BYTE, 0)
}
