"use strict";

// var vertexShaderSource = `#version 300 es

// //This receives input from a buffer
// in vec4 a_position;

// void main(){
//     //Special variable a vertex shader is responsible for setting
//     gl_Position = a_position;
// }
// `;

// Here's the 2D version
var vertexShaderSource = `#version 300 es

//This receives input from a buffer
in vec2 a_position;

uniform vec2 u_resolution;

// In here we must convert from pixels to clip space
void main(){
    // Convert the position from pixels to 0.0 to 1.0
    vec2 zeroToOne = a_position / u_resolution;

    // Convert from 0-1 to 0-2
    vec2 zeroToTwo = zeroToOne * 2.0;

    // Convert from 0-2 to -1->+1 (clipspace)
    vec2 clipSpace = zeroToTwo - 1.0;

    gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
}
`;

var fragmentShaderSource = `#version 300 es

//Define the precision of floats
precision mediump float;

uniform vec4 u_color;

out vec4 outColor;

void main(){
    outColor = u_color;
}`;

function randomInt(range) {
  return Math.floor(Math.random() * range);
}

function setRectangle(gl, x, y, width, height) {
  var x1 = x;
  var x2 = x + width;
  var y1 = y;
  var y2 = y + height;

  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([x1, y1, x2, y1, x1, y2, x1, y2, x2, y1, x2, y2]),
    gl.STATIC_DRAW
  );
}

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
