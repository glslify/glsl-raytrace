precision mediump float;

uniform vec2  iResolution;
uniform float iGlobalTime;

vec2 doModel(vec3 p);

#pragma glslify: raytrace = require('./', map = doModel, steps = 50)
#pragma glslify: noise    = require('glsl-noise/simplex/4d')
#pragma glslify: square   = require('glsl-square-frame')
#pragma glslify: smin     = require('glsl-smooth-min')
#pragma glslify: camera   = require('glsl-camera-ray')

vec2 doModel(vec3 p) {
  float r = 1.0;

  r += noise(vec4(p * 0.75, iGlobalTime)) * 0.25;

  return vec2(length(p) - r, 0.0);
}

vec3 doMaterial(vec3 pos, vec3 nor) {
  return vec3(0.4, 0.768, 1.0) * 0.5;
}

vec3 doLighting(vec3 pos, vec3 nor, vec3 rd, float dis, vec3 mal) {
  vec3 lin = vec3(0.0);

  vec3  lig = normalize(vec3(1.0,0.7,0.9));
  float dif = max(dot(nor,lig),0.0);

  lin += dif*vec3(2);
  lin += vec3(0.05);

  return mal*lin;
}

vec3 calcNormal(vec3 pos) {
  const float eps = 0.002;

  const vec3 v1 = vec3( 1.0,-1.0,-1.0);
  const vec3 v2 = vec3(-1.0,-1.0, 1.0);
  const vec3 v3 = vec3(-1.0, 1.0,-1.0);
  const vec3 v4 = vec3( 1.0, 1.0, 1.0);

  return normalize( v1*doModel( pos + v1*eps ).x +
                    v2*doModel( pos + v2*eps ).x +
                    v3*doModel( pos + v3*eps ).x +
                    v4*doModel( pos + v4*eps ).x );
}

void main() {
  float cameraAngle  = 0.8 * iGlobalTime;
  vec3  rayOrigin    = vec3(3.5 * sin(cameraAngle), 3.0, 3.5 * cos(cameraAngle));
  vec3  rayTarget    = vec3(0, 0, 0);
  vec2  screenPos    = square(iResolution);
  vec3  rayDirection = camera(rayOrigin, rayTarget, screenPos, 2.0);

  vec3 col = vec3(0.015);
  vec2 t   = raytrace(rayOrigin, rayDirection);

  if (t.x > -0.5) {
    vec3 pos = rayOrigin + t.x * rayDirection;
    vec3 nor = calcNormal(pos);
    vec3 mal = doMaterial(pos, nor);

    col = doLighting(pos, nor, rayDirection, t.x, mal);
  }

  col = pow(clamp(col,0.0,1.0), vec3(0.4545));

  gl_FragColor = vec4( col, 1.0 );
}
