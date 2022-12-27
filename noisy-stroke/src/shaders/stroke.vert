uniform float time;
varying vec2 vUv;
varying vec3 vPosition;
varying vec2 vScreenSpace;
varying vec3 vNormal;

void main() {
    /*vUv = uv;
    vPosition = position;
    vNormal = normalize(mat3(modelMatrix)*normal);

    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0);

    // Get the screen coordinate to render the object
    // The color of object will stay the same position
    // when we zoom-in and out.
    vScreenSpace = gl_Position.xy/gl_Position.w;
    */

    vUv = uv;
    vPosition = position;
    vNormal = normalize(mat3(modelMatrix)*normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.);

    vScreenSpace = gl_Position.xy/gl_Position.w;
}
