var canvas = getElementById("c");
var gl = canvas.getContext("webgl2")

if(!gl){
    //no webgl2!
}

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

function createShader(gl, type, source){

}