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