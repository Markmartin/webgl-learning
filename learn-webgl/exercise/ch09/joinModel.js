function joinModel() {
  var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  attribute vec4 a_Normal;
  uniform mat4 u_MvpMatrix;
  uniform mat4 u_NormalMatrix;
  varying vec4 v_Color;
  void main() {
    gl_Position = u_MvpMatrix * a_Position;
    vec3 lightDirection = normalize(vec3(0.0, 0.5, 0.7));
    vec4 color = vec4(1.0, 0.4, 0.0, 1.0);
    vec3 normal = normalize((u_NormalMatrix * a_Normal).xyz);
    float nDotL = max(dot(normal, lightDirection), 0.0);
    v_Color = vec4(color.rgb * nDotL + vec3(0.2), color.a);
  }
  `

  var FSHADER_SOURCE = `
  precision mediump float;
  varying vec4 v_Color;
  void main() {
    gl_FragColor = v_Color;
  }
  `

  /** @type {HTMLCanvasElement} */
  let canvas = document.getElementById('join-model')

  /** @type {WebGL2RenderingContext} */
  let gl = getWebGLContext(canvas, true)

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

  var vertices = new Float32Array([
    1.5,
    10.0,
    1.5,
    -1.5,
    10.0,
    1.5,
    -1.5,
    0.0,
    1.5,
    1.5,
    0.0,
    1.5, // v0-v1-v2-v3 front
    1.5,
    10.0,
    1.5,
    1.5,
    0.0,
    1.5,
    1.5,
    0.0,
    -1.5,
    1.5,
    10.0,
    -1.5, // v0-v3-v4-v5 right
    1.5,
    10.0,
    1.5,
    1.5,
    10.0,
    -1.5,
    -1.5,
    10.0,
    -1.5,
    -1.5,
    10.0,
    1.5, // v0-v5-v6-v1 up
    -1.5,
    10.0,
    1.5,
    -1.5,
    10.0,
    -1.5,
    -1.5,
    0.0,
    -1.5,
    -1.5,
    0.0,
    1.5, // v1-v6-v7-v2 left
    -1.5,
    0.0,
    -1.5,
    1.5,
    0.0,
    -1.5,
    1.5,
    0.0,
    1.5,
    -1.5,
    0.0,
    1.5, // v7-v4-v3-v2 down
    1.5,
    0.0,
    -1.5,
    -1.5,
    0.0,
    -1.5,
    -1.5,
    10.0,
    -1.5,
    1.5,
    10.0,
    -1.5 // v4-v7-v6-v5 back
  ])

  // Normal
  var normals = new Float32Array([
    0.0,
    0.0,
    1.0,
    0.0,
    0.0,
    1.0,
    0.0,
    0.0,
    1.0,
    0.0,
    0.0,
    1.0, // v0-v1-v2-v3 front
    1.0,
    0.0,
    0.0,
    1.0,
    0.0,
    0.0,
    1.0,
    0.0,
    0.0,
    1.0,
    0.0,
    0.0, // v0-v3-v4-v5 right
    0.0,
    1.0,
    0.0,
    0.0,
    1.0,
    0.0,
    0.0,
    1.0,
    0.0,
    0.0,
    1.0,
    0.0, // v0-v5-v6-v1 up
    -1.0,
    0.0,
    0.0,
    -1.0,
    0.0,
    0.0,
    -1.0,
    0.0,
    0.0,
    -1.0,
    0.0,
    0.0, // v1-v6-v7-v2 left
    0.0,
    -1.0,
    0.0,
    0.0,
    -1.0,
    0.0,
    0.0,
    -1.0,
    0.0,
    0.0,
    -1.0,
    0.0, // v7-v4-v3-v2 down
    0.0,
    0.0,
    -1.0,
    0.0,
    0.0,
    -1.0,
    0.0,
    0.0,
    -1.0,
    0.0,
    0.0,
    -1.0 // v4-v7-v6-v5 back
  ])

  // Indices of the vertices
  var indices = new Uint8Array([
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

  var vertexBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

  var a_Position = gl.getAttribLocation(gl.program, 'a_Position')
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0)
  gl.enableVertexAttribArray(a_Position)

  var normalBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, normals, gl.STATIC_DRAW)

  var a_Normal = gl.getAttribLocation(gl.program, 'a_Normal')
  gl.vertexAttribPointer(a_Normal, 3, gl.FLOAT, false, 0, 0)
  gl.enableVertexAttribArray(a_Normal)

  gl.bindBuffer(gl.ARRAY_BUFFER, null)

  var indexBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW)

  var u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix')
  var u_NormalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix')

  var viewProjMatrix = new Matrix4()
  var modelMatrix = new Matrix4()
  var mvpMatrix = new Matrix4()
  var normalMatrix = new Matrix4()

  gl.clearColor(0.0, 0.0, 0.0, 1.0)
  gl.enable(gl.DEPTH_TEST)

  var ANGLE_STEP = 3.0
  var arm1Angle = -90.0
  var join1Angle = 0.0

  function draw() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

    viewProjMatrix.setPerspective(50.0, canvas.width / canvas.height, 1.0, 100.0)
    viewProjMatrix.lookAt(20.0, 10.0, 30.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0)
    modelMatrix.setTranslate(0.0, -12.0, 0.0)
    modelMatrix.rotate(arm1Angle, 0.0, 1.0, 0.0)
    mvpMatrix.set(viewProjMatrix)
    mvpMatrix.multiply(modelMatrix)
    gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements)
    normalMatrix.setInverseOf(modelMatrix)
    normalMatrix.transpose()
    gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements)
    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_BYTE, 0)

    modelMatrix.translate(0.0, 10.0, 0.0)
    modelMatrix.rotate(join1Angle, 0.0, 0.0, 1.0)
    modelMatrix.scale(1.3, 1.0, 1.3)
    mvpMatrix.set(viewProjMatrix)
    mvpMatrix.multiply(modelMatrix)
    gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements)
    normalMatrix.setInverseOf(modelMatrix)
    normalMatrix.transpose()
    gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements)
    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_BYTE, 0)
  }

  draw()

  document.onkeydown = function (e) {
    console.log(e.code)
    switch (e.code) {
      case 'ArrowLeft':
        arm1Angle = (arm1Angle - ANGLE_STEP) % 360
        break
      case 'ArrowRight':
        arm1Angle = (arm1Angle + ANGLE_STEP) % 360
        break
      case 'ArrowUp':
        if (join1Angle < 135.0) join1Angle = join1Angle + ANGLE_STEP
        console.log(join1Angle)
        break
      case 'ArrowDown':
        if (join1Angle > -135.0) join1Angle = join1Angle - ANGLE_STEP
        console.log(join1Angle)
        break
      default:
        return
    }
    draw()
  }
}
