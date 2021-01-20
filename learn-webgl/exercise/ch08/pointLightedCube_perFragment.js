function pointLightedCube_perFragment() {
  /** @type {HTMLCanvasElement} */
  let canvas = document.getElementById('point-lighted-cube-per-fragment')

  /** @type {WebGL2RenderingContext} */
  let gl = getWebGLContext(canvas, true)

  // Vertex shader program
  var VSHADER_SOURCE = `
        attribute vec4 a_Position;
        attribute vec4 a_Color;
        attribute vec4 a_Normal;
        uniform mat4 u_MvpMatrix;
        uniform mat4 u_ModelMatrix;
        uniform mat4 u_NormalMatrix;
        varying vec4 v_Color;
        varying vec3 v_Normal;
        varying vec3 v_Position;
        void main() {
          gl_Position = u_MvpMatrix * a_Position;
          v_Position = vec3(u_ModelMatrix * a_Position);
          v_Normal = normalize(vec3(u_NormalMatrix * a_Normal));
          v_Color = a_Color;
        }
        `

  // Fragment shader program
  var FSHADER_SOURCE = `
        precision mediump float;
        uniform vec3 u_LightColor;
        uniform vec3 u_LightPosition;
        uniform vec3 u_AmbientLight;
        varying vec3 v_Normal;
        varying vec3 v_Position;
        varying vec4 v_Color;
        void main() {
            vec3 normal = normalize(v_Normal);
            vec3 lightDirection = normalize(u_LightPosition - v_Position);
            float nDotL = max(dot(lightDirection, normal), 0.0);
            vec3 diffuse = u_LightColor * vec3(v_Color) * nDotL;
            vec3 ambient = u_AmbientLight * vec3(v_Color);
            gl_FragColor = vec4(diffuse + ambient, v_Color.a);
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
    2.0,
    2.0,
    2.0,
    -2.0,
    2.0,
    2.0,
    -2.0,
    -2.0,
    2.0,
    2.0,
    -2.0,
    2.0, // v0-v1-v2-v3 front
    2.0,
    2.0,
    2.0,
    2.0,
    -2.0,
    2.0,
    2.0,
    -2.0,
    -2.0,
    2.0,
    2.0,
    -2.0, // v0-v3-v4-v5 right
    2.0,
    2.0,
    2.0,
    2.0,
    2.0,
    -2.0,
    -2.0,
    2.0,
    -2.0,
    -2.0,
    2.0,
    2.0, // v0-v5-v6-v1 up
    -2.0,
    2.0,
    2.0,
    -2.0,
    2.0,
    -2.0,
    -2.0,
    -2.0,
    -2.0,
    -2.0,
    -2.0,
    2.0, // v1-v6-v7-v2 left
    -2.0,
    -2.0,
    -2.0,
    2.0,
    -2.0,
    -2.0,
    2.0,
    -2.0,
    2.0,
    -2.0,
    -2.0,
    2.0, // v7-v4-v3-v2 down
    2.0,
    -2.0,
    -2.0,
    -2.0,
    -2.0,
    -2.0,
    -2.0,
    2.0,
    -2.0,
    2.0,
    2.0,
    -2.0 // v4-v7-v6-v5 back
  ])

  var colors = new Float32Array([
    1,
    0,
    0,
    1,
    0,
    0,
    1,
    0,
    0,
    1,
    0,
    0, // v0-v1-v2-v3 front
    1,
    0,
    0,
    1,
    0,
    0,
    1,
    0,
    0,
    1,
    0,
    0, // v0-v3-v4-v5 right
    1,
    0,
    0,
    1,
    0,
    0,
    1,
    0,
    0,
    1,
    0,
    0, // v0-v5-v6-v1 up
    1,
    0,
    0,
    1,
    0,
    0,
    1,
    0,
    0,
    1,
    0,
    0, // v1-v6-v7-v2 left
    1,
    0,
    0,
    1,
    0,
    0,
    1,
    0,
    0,
    1,
    0,
    0, // v7-v4-v3-v2 down
    1,
    0,
    0,
    1,
    0,
    0,
    1,
    0,
    0,
    1,
    0,
    0 // v4-v7-v6-v5 back
  ])

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

  var colorBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW)

  var a_Color = gl.getAttribLocation(gl.program, 'a_Color')
  gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, 0, 0)
  gl.enableVertexAttribArray(a_Color)

  var normalBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, normals, gl.STATIC_DRAW)

  var a_Normal = gl.getAttribLocation(gl.program, 'a_Normal')
  gl.vertexAttribPointer(a_Normal, 3, gl.FLOAT, false, 0, 0)
  gl.enableVertexAttribArray(a_Normal)

  var indexBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW)

  var u_LightColor = gl.getUniformLocation(gl.program, 'u_LightColor')
  gl.uniform3f(u_LightColor, 1.0, 1.0, 1.0)

  var u_LightPosition = gl.getUniformLocation(gl.program, 'u_LightPosition')
  gl.uniform3f(u_LightPosition, 2.3, 4.0, 3.5)

  var u_AmbientLight = gl.getUniformLocation(gl.program, 'u_AmbientLight')
  gl.uniform3f(u_AmbientLight, 0.2, 0.2, 0.2)

  var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix')
  var u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix')
  var u_NormalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix')
  // var mvpMatrix = new Matrix4()
  // mvpMatrix.setPerspective(30, 1, 1, 100)
  // mvpMatrix.lookAt(3, 3, 7, 0, 0, 0, 0, 1, 0)
  // gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements)
  var modelMatrix = new Matrix4() // Model matrix
  var mvpMatrix = new Matrix4() // Model view projection matrix
  var normalMatrix = new Matrix4() // Transformation matrix for normals

  modelMatrix.setRotate(90, 0, 1, 0)
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)

  mvpMatrix.setPerspective(30, canvas.width / canvas.height, 1, 100)
  mvpMatrix.lookAt(6, 6, 14, 0, 0, 0, 0, 1, 0)
  mvpMatrix.multiply(modelMatrix)
  gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements)

  normalMatrix.setInverseOf(modelMatrix)
  normalMatrix.transpose()
  gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements)

  gl.clearColor(0, 0, 0, 1)
  gl.enable(gl.DEPTH_TEST)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

  // Draw the cube
  gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_BYTE, 0)
}
