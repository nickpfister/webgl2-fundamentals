#version 300 es

//This receives input from a buffer
in vec4 a_position;

void main(){
    //Special variable a vertex shader is responsible for setting
    gl_Position = a_position;
}