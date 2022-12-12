
uniform vec3 uLightPos;

varying vec3 vNormal;
varying vec3 vSurfaceToLight;

void main() {

    vNormal = normalize( normalMatrix * normal);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);

    vec3 surfaceToLightDirection = vec3( modelViewMatrix * vec4(position, 1.));
    vec3 worldLightPos = vec3( viewMatrix * vec4(uLightPos, 1.));
    vSurfaceToLight = normalize( worldLightPos - surfaceToLightDirection);
}
