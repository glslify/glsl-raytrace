# glsl-raytrace

[![stable](http://badges.github.io/stability-badges/dist/stable.svg)](http://github.com/badges/stability-badges)

Given a signed distance function and ray, trace a scene to find the first point
of intersection.

## Usage

[![NPM](https://nodei.co/npm/glsl-raytrace.png)](https://nodei.co/npm/glsl-raytrace/)

### `raytrace = require(glsl-raytrace, <map>, <steps>)`

Loads the raytrace function into your shader. Note that `map`
and `steps` are required to be defined when using this module.

#### `vec2 map(vec3 position)`

Your signed distance function, responsible for defining the
solid shapes in your scene. Accepts `position`, and returns
a `vec2`, representing:

* The signed distance from the surface, i.e. how far from the
  surface that position is. If inside the surface, this
  number should be negative. If a collision isn't made, this
  number should be `-1.0`. Fortunately there's a bunch of
  easily composable primitives so this isn't as scary as it
  sounds once you're familiar with it.
* A second attribute for assigning a property to the surface.
  Often, this is used as a material ID to apply different
  effects to different surfaces, but it could really be
  anything.

#### `int steps`

The maximum number of steps to attempt for each trace.

``` glsl
vec2 doModel(vec3 p);

#pragma glslify: raytrace = require('glsl-raytrace', map = doModel, steps = 90)

vec2 doModel(vec3 position) {
  float radius  = 1.0;
  float dist    = length(position) - radius;
  float objType = 1.0;

  return vec2(dist, objType);
}
```

### `vec2 raytrace(vec3 ro, vec3 rd)`

Once set up, you can then use the `raytrace` function to
trace a ray and get how far it travels before making a
collision. You can then use this value to determine the point
of the collision, the surface normal and lighting conditions,
etc.

* `ro` is the ray origin.
* `rd` is a *unit vector* (i.e. normalized) representing the
  ray direction.

``` glsl
#pragma glslify: square   = require('glsl-square-frame')
#pragma glslify: camera   = require('glsl-camera-ray')
#pragma glslify: raytrace = require('glsl-raytrace')

uniform vec2  iResolution;
uniform float iGlobalTime;

void main() {
  // Bootstrap a Shadertoy-style raytracing scene:
  float cameraAngle  = 0.8 * iGlobalTime;
  vec3  rayOrigin    = vec3(3.5 * sin(cameraAngle), 3.0, 3.5 * cos(cameraAngle));
  vec3  rayTarget    = vec3(0, 0, 0);
  vec2  screenPos    = square(iResolution.xy);
  float lensLength   = 2.0;
  vec3  rayDirection = camera(rayOrigin, rayTarget, screenPos, lensLength);

  vec2 collision = raytrace(rayOrigin, rayDirection);

  // If the ray collides, draw the surface
  if (collision.x > -0.5) {
    // Determine the point of collision
    vec3 pos = rayOrigin + rayDirection * collision.x;

    // ...
  }

  // ...
}
```

### `raytrace(vec3 ro, vec3 rd, float maxd, float precis)`

For more control, you may optionally include:

* `float maxd`: the maxium distance to trace. Defaults to 20.
* `float precis`: the minimum closeness to the surface before
  considering the trace to be a collision. Defaults to 0.001.
  Increasing this number will improve performance.

## Contributing

See [stackgl/contributing](https://github.com/stackgl/contributing) for details.

## License

MIT. See [LICENSE.md](http://github.com/stackgl/glsl-raytrace/blob/master/LICENSE.md) for details.
