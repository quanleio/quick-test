uniform float uTime;
uniform float uProgress;
uniform vec4 uResolution;
uniform sampler2D texture1;

varying vec2 vUv;
const float PI = 3.1415925;

void main() {
    vUv = uv;

    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.);
}
