function lookAtTriangles() {
  /** @type {HTMLCanvasElement} */
  let canvas = document.getElementById('look-at-triangles')

  /** @type {WebGL2RenderingContext} */
  let gl = getWebGLContext(canvas, true)

  // Vertex shader program
  var VSHADER_SOURCE = `
    attribute vec4 a_Position;
    attribute vec4 a_Color;
    uniform mat4 u_ViewMatrix;
    varying vec4 v_Color;
    void main() {
        gl_Position = u_ViewMatrix * a_Position;
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
    // Vertex coordinates and color(RGBA)
     0.0,  0.5,  -0.4,  0.4,  1.0,  0.4, // The back green one
    -0.5, -0.5,  -0.4,  0.4,  1.0,  0.4,
     0.5, -0.5,  -0.4,  1.0,  0.4,  0.4, 
   
     0.5,  0.4,  -0.2,  1.0,  0.4,  0.4, // The middle yellow one
    -0.5,  0.4,  -0.2,  1.0,  1.0,  0.4,
     0.0, -0.6,  -0.2,  1.0,  1.0,  0.4, 

     0.0,  0.5,   0.0,  0.4,  0.4,  1.0,  // The front blue one 
    -0.5, -0.5,   0.0,  0.4,  0.4,  1.0,
     0.5, -0.5,   0.0,  1.0,  0.4,  0.4, 
  ]);

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
  var u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix')
  var viewMatrix = new Matrix4()
  viewMatrix.setLookAt(0.2, 0.25, 0.25, 0, 0, 0, 0, 1, 0)
  //   viewMatrix.setLookAt(0, 0, 0, 0, 0, 1, 0, 1, 0);

  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements)

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT)

  // Draw the rectangle
  gl.drawArrays(gl.TRIANGLES, 0, 9)
}
