function orthoView_halfSize() {
  /** @type {HTMLCanvasElement} */
  let canvas = document.getElementById('ortho-view-half-size')

  /** @type {WebGL2RenderingContext} */
  let gl = getWebGLContext(canvas, true)

  // Vertex shader program
  var VSHADER_SOURCE = `
        attribute vec4 a_Position;
        attribute vec4 a_Color;
        uniform mat4 u_ProjMatrix;
        varying vec4 v_Color;
        void main() {
          gl_Position = u_ProjMatrix * a_Position;
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
    0.5,
    -0.4,
    0.4,
    1.0,
    0.4, // The back green one
    -0.5,
    -0.5,
    -0.4,
    0.4,
    1.0,
    0.4,
    0.5,
    -0.5,
    -0.4,
    1.0,
    0.4,
    0.4,

    0.7,
    0.2,
    -0.2,
    1.0,
    0.4,
    0.4, // The middle yellow one
    -0.7,
    0.2,
    -0.2,
    1.0,
    1.0,
    0.4,
    0.0,
    0.0,
    -0.2,
    1.0,
    1.0,
    0.4,

    0.0,
    0.3,
    0.0,
    0.4,
    0.4,
    1.0, // The front blue one
    -0.3,
    -0.3,
    0.0,
    0.4,
    0.4,
    1.0,
    0.3,
    -0.3,
    0.0,
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
  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0)

  var g_near = 0.0
  var g_far = 0.5
  var u_ProjMatrix = gl.getUniformLocation(gl.program, 'u_ProjMatrix')
  var projMatrix = new Matrix4()
  projMatrix.setOrtho(-1.0, 1.0, -1.0, 1.0, g_near, g_far)
  gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements)
  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT)

  // Draw the rectangle
  gl.drawArrays(gl.TRIANGLES, 0, 9)

  function drawNearFarTriangle() {
    // projMatrix.setOrtho(-0.5, 0.5, -0.5, 0.5, g_near, g_far)
    projMatrix.setOrtho(-0.5, 0.5, -1.0, 1.0, g_near, g_far)
    gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements)
    // Clear <canvas>
    // gl.clear(gl.COLOR_BUFFER_BIT)

    // Draw the rectangle
    gl.clearColor(0.0, 0.0, 0.0, 1.0)
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.drawArrays(gl.TRIANGLES, 0, 9)
  }

  document.onkeydown = function (e) {
    if (e.code == 'ArrowRight') {
      g_near += 0.01
    }
    if (e.code == 'ArrowLeft') {
      g_near -= 0.01
    }
    if (e.code == 'ArrowDown') {
      g_far += 0.01
    }
    if (e.code == 'ArrowUp') {
      g_far -= 0.01
    }

    console.log(g_near + ':' + g_far)
    drawNearFarTriangle()
    return
  }
}
