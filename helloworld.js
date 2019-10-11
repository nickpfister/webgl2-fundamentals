"use strict";

function randomInt(range) {
  return Math.floor(Math.random() * range);
}
// Creates a shader given a rendering context, shader type, and source code for the shader


function main() {
  //Get the canvas element from index.html
  var canvas = document.getElementById("c");
  canvas.width = window.innerWidth;
  canvas.height = 500;

  //Gets a drawing context for the canvas, returning a WebGL2RenderingContext
  var gl = canvas.getContext("webgl2");

  if (!gl) {
    // WebGL is not compatible, or didn't initialize properly
    return;
  }

  // Instantiate the vertex and fragment shaders
  var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  var fragmentShader = createShader(
    gl,
    gl.FRAGMENT_SHADER,
    fragmentShaderSource
  );

  // Creates a program - the combo of vertex/frag shaders
  var program = createProgram(gl, vertexShader, fragmentShader);

  // This is the location of the uniform resolution
  var resolutionUniformLocation = gl.getUniformLocation(
    program,
    "u_resolution"
  );

  // Look up where vertex data goes
  var positionAttributeLocation = gl.getAttribLocation(program, "a_position");

  var colorLocation = gl.getUniformLocation(program, "u_color");

  // Create a position buffer - think of this as a queue for vertexes to be processed
  var positionBuffer = gl.createBuffer();

  // Binds ARRAY_BUFFER to a target positionBuffer
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // Position data for the vertexes - 3 pairs of xy coordinates
  var positions = [10, 20, 80, 20, 10, 30, 10, 30, 80, 20, 80, 30];

  // Copies data to the position buffer on the GPU
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  // Create and bind the vertex array
  // Calls to bindBuffer or vertexAttribPointer will be "recorded" in the VAO
  var vao = gl.createVertexArray();
  gl.bindVertexArray(vao);

  // Turn on the attribute
  gl.enableVertexAttribArray(positionAttributeLocation);

  // Tells the attribute how to get data out of the positionBuffer
  var size = 2; // 2 components per iterations
  var type = gl.FLOAT; // the data is 32 bit floats
  var normalize = false; // Don't normalize the data
  var stride = 0; // 0 = moveForwardSize * sizeOf(type) each iteration to get to next position
  var offset = 0; // start at the beginning of the buffer

  gl.vertexAttribPointer(
    positionAttributeLocation,
    size,
    type,
    normalize,
    stride,
    offset
  );

  // Tells WebGL how to convert from clip space to pixels
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  // This clears the canvas
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Tells WebGL to use our program
  gl.useProgram(program);

  // This sets the uniform resolution. 2f means set it as a vec2
  gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

  // Bind the attribute/buffer we want
  // Why do we have to run this twice?
  gl.bindVertexArray(vao);

  // Draws everything!

  for (var ii = 0; ii < 50; ++ii) {
    setRectangle(
      gl,
      randomInt(300),
      randomInt(300),
      randomInt(300),
      randomInt(300)
    );
    gl.uniform4f(colorLocation, Math.random(), Math.random(), Math.random(), 1);

    var primitiveType = gl.TRIANGLES;
    var offset = 0;
    var count = 6;
    gl.drawArrays(primitiveType, offset, count);
  }
}

main();
