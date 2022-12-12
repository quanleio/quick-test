#pragma glslify: snoise2 = require(glsl-noise/simplex/2d)

uniform vec3 uColor;
uniform vec3 uLightColor;
uniform float uLightIntensity;
uniform float myNoiseScaleVal;

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
    uv /= myNoiseScaleVal;

    vec3 colorNoise = vec3(snoise2(uv) * 0.5 + .5);
    colorNoise *= pow(light_value.r, 5.);

    gl_FragColor.r = max(colorNoise.r, uColor.r);
    gl_FragColor.g = max(colorNoise.g, uColor.g);
    gl_FragColor.b = max(colorNoise.b, uColor.b);
    gl_FragColor.a = 1.0;
}
