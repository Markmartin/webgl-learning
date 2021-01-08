function rotatedTriangleMatrix4() {
  /** @type {HTMLCanvasElement} */
  let canvas = document.getElementById('rotated-triangle-matrix4')

  /** @type {WebGL2RenderingContext} */
  let gl = getWebGLContext(canvas, true)

  // Vertex shader program
  var VSHADER_SOURCE = `
          attribute vec4 a_Position;
          uniform mat4 u_xformMatrix;
          void main() {
           gl_Position = u_xformMatrix * a_Position;
           gl_Position.w = 1.0;
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

  var vertexBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
  var vertices = new Float32Array([-0.5, -0.5, 0.5, -0.5, -0.5, 0.5])
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

  var a_Position = gl.getAttribLocation(gl.program, 'a_Position')
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0)
  gl.enableVertexAttribArray(a_Position)

  // The rotation angle
  var ANGLE = -90.0
  var radian = (Math.PI * ANGLE) / 180.0 // Convert to radians
  var cosB = Math.cos(radian)
  var sinB = Math.sin(radian)

  // 旋转矩阵
  //   var xformMatrix = new Float32Array([
  //     cosB,
  //     sinB,
  //     0.0,
  //     0.0,
  //     -sinB,
  //     cosB,
  //     0.0,
  //     0.0,
  //     0.0,
  //     0.0,
  //     1.0,
  //     0.0,
  //     0.0,
  //     0.0,
  //     0.0,
  //     1.0
  //   ])

  xformMatrix = new Matrix4()
  xformMatrix.setRotate(ANGLE, 0, 0, 1)
  //   xformMatrix.setScale(0.5, 0.5, 0.0)
  var u_xformMatrix = gl.getUniformLocation(gl.program, 'u_xformMatrix')
  gl.uniformMatrix4fv(u_xformMatrix, false, xformMatrix.elements)

  gl.clearColor(0, 0, 0, 1)

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT)

  // Draw three points
  gl.drawArrays(gl.TRIANGLES, 0, 3)
}
