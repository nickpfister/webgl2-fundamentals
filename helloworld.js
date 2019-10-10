"use strict";

var vertexShaderSource = `#version 300 es

//This receives input from a buffer
in vec4 a_position;

void main(){
    //Special variable a vertex shader is responsible for setting
    gl_Position = a_position;
}
`;

var fragmentShaderSource = `#version 300 es

//Define the precision of floats
precision mediump float;

out vec4 outColor;

void main(){
    //Set color to a constant
    outColor = vec4(1, 0.5, 0, 1);
}`;

// Creates a shader given a rendering context, shader type, and source code for the shader
function createShader(gl, type, source) {
  var shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }

  console.log(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
}

function createProgram(gl, vertexShader, fragmentShader) {
  var program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  var success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }

  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
}

function main() {
  //Get the canvas element from index.html
  var canvas = document.getElementById("c");

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

  // Look up where vertex data goes
  var positionAttributeLocation = gl.getAttribLocation(program, "a_position");

  // Create a position buffer - think of this as a queue for vertexes to be processed
  var positionBuffer = gl.createBuffer();

  // Binds ARRAY_BUFFER to a target positionBuffer
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // Position data for the vertexes - 3 pairs of xy coordinates
  var positions = [0, 0, 0, 0.5, 0.7, 0];

  // Copies data to the position buffer on the GPU
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  // Create and bind the vertex array
  // Calls to bindBuffer or vertexAttribPointer will be "recorded" in the VAO
  var vao = gl.createVertexArray();
  gl.bindVertexArray(vao);

  // Turn on the attribute
  gl.enableVertexAttribArray(positionAttributeLocation);

  // Tells the attribute how to get data out of the positionBuffer
  var size = 2;             // 2 components per iterations
  var type = gl.FLOAT;      // the data is 32 bit floats
  var normalize = false;    // Don't normalize the data
  var stride = 0;           // 0 = moveForwardSize * sizeOf(type) each iteration to get to next position
  var offset = 0;           // start at the beginning of the buffer

  gl.vertexAttribPointer(
    positionAttributeLocation,
    size,
    type,
    normalize,
    stride,
    offset
  );
  
  // No idea what this does - look it up
  webglUtils.resizeCanvasToDisplaySize(gl.canvas);

  // Tells WebGL how to convert from clip space to pixels
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  // This clears the canvas
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Tells WebGL to use our program
  gl.useProgram(program);

  // Bind the attribute/buffer we want
  // Why do we have to run this twice?
  gl.bindVertexArray(vao);

  // Draws everything!
  var primitiveType = gl.TRIANGLES;
  var offset = 0;
  var count = 3;
  gl.drawArrays(primitiveType, offset, count);
}

main();
