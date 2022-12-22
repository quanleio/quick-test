uniform float time;
uniform float progress;
uniform sampler2D texture;
uniform vec4 resolution;
varying vec2 vUv;
varying vec2 vPosition;
float PI = 3.141592653589793;

void main() {
    gl_FragColor = vec4(1., 1., 1., 0.4);
}
