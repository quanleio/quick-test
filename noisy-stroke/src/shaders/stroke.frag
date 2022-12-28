uniform float uTime;
uniform float uProgress;
uniform sampler2D uNoiseTexture;
varying vec2 vScreenSpace;
varying vec3 vViewDiection;
varying vec3 vPosition;
varying vec3 vNormal;

// Description : Custom noise
//      Author : Yuri Artiukh
//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.
//    Tutorial : https://youtu.be/_qJdpSr3HkM
//
float threshold(float edge0, float edge1, float x) {
    return clamp((x - edge0) / (edge1 - edge0), 0.0, 1.0);
}

float hash(vec3 p) {
    p = fract( p*0.3183099+.1 );
    p *= 17.0;
    return fract(p.x*p.y*p.z*(p.x+p.y+p.z));
}

float noise (in vec3 x) {
    vec3 i = floor(x);
    vec3 f = fract(x);
    f = f*f*(3.0-2.0*f);

    return mix(mix(mix( hash(i+vec3(0,0,0)),
                        hash(i+vec3(1,0,0)),f.x),
                        mix( hash(i+vec3(0,1,0)),
                        hash(i+vec3(1,1,0)),f.x),f.y),
                        mix(mix( hash(i+vec3(0,0,1)),
                        hash(i+vec3(1,0,1)),f.x),
                        mix( hash(i+vec3(0,1,1)),
                        hash(i+vec3(1,1,1)),f.x),f.y),f.z);
}

/*float rand (float n) { return fract(sin(n) * 43758.5453123);}

float noise (float p) {
    float fl = floor(p);
    float fc = fract(p);

    return mix(rand(fl), rand(fl + 1.0), fc);
}*/

void main() {

    // light value can be negative at some points so we *0.5 and + 0.5 to make it positive
    float light = dot(vNormal, normalize(vec3(1.))); // * 0.5 + 0.5;

    float ttt = texture2D(uNoiseTexture, .5 * (vScreenSpace + 1.)).r;

    float stroke = cos((vScreenSpace.x - vScreenSpace.y) * 1000.);  // from -1 to 1

    float smallnoise = noise(500. * vec3(vScreenSpace, 1.));
    float bignoise = noise(5. * vec3(vScreenSpace, uTime/4.));

    // For 3D effect, the edge of the object should be
    // darker
    float fresnel = 1. - dot(vNormal, -vViewDiection);
    fresnel = fresnel*fresnel*fresnel;

    stroke += (smallnoise*2. -1.) + (bignoise*2. - 1.);

    stroke = 1. - smoothstep(1.*light-0.2, 1.*light+0.2, stroke);

    float stroke1 = 1. - smoothstep(2.*light-2., 2.*light+2., stroke);

    float temp = uProgress;
    temp += (2.*ttt - 1.)*0.2;
    float distanceFromCenter = length(vScreenSpace);
    temp = smoothstep(temp - 0.005, temp, distanceFromCenter);

    float finalLook = mix(stroke, stroke1, temp);
    gl_FragColor = vec4(vec3(finalLook), 1.);
//    gl_FragColor = vec4(vec3(fresnel), 1.);
//    gl_FragColor = vec4(vScreenSpace, 0., 1.);
//    gl_FragColor = vec4(vNormal, 1.);
//    gl_FragColor = vec4(vec3(distanceFromCenter), 1.);
//    gl_FragColor = vec4(vec3(temp), 1.);
//    gl_FragColor = vec4(vec3(progress), 1.);
//    gl_FragColor = vec4(vec3(light), 1.);
//    gl_FragColor = vec4(vec3(bignoise), 1.);
//    gl_FragColor = vec4(vec3(noise(100. *vec3(vScreenSpace, 1.))), 1.);
}
