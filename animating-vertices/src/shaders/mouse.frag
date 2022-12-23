uniform float uTime;
uniform float uProgress;
uniform sampler2D texture1;
uniform vec4 uResolution;

varying vec2 vUv;

void main() {
    // gl_FragColor = vec4(vUv, 0.0, 1.0);

    vec2 newUV = (vUv - vec2(0.5)) * uResolution.zw + vec2(0.5);
    gl_FragColor = texture2D(texture1, newUV);
}
