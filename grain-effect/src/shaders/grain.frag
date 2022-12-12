#pragma glslify: snoise2 = require(glsl-noise/simplex/2d)

uniform vec3 uColor;
uniform vec3 uLightColor;
uniform float uLightIntensity;

varying vec3 vNormal;
varying vec3 vSurfaceToLight;

vec3 light_reflection(vec3 lightColor) {
    vec3 ambient = lightColor;

    vec3 diffuse = lightColor * dot(vSurfaceToLight, vNormal);

    return( ambient + diffuse );
}

void main() {
    vec3 light_value = light_reflection(uLightColor);
    light_value *= uLightIntensity;

    vec2 uv = gl_FragCoord.xy;

    vec3 noiseColors = vec3(snoise2(uv));

    gl_FragColor = vec4(noiseColors, 1.);
}
