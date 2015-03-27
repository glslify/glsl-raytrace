var canvas   = document.body.appendChild(document.createElement('canvas'))
var triangle = require('a-big-triangle')
var context  = require('gl-context')
var fit      = require('canvas-fit')
var Shader   = require('gl-shader')
var glslify  = require('glslify')

var start = Date.now()

window.addEventListener('resize', fit(canvas, window, 0.25), false)

Toy(function(gl) {
  return Shader(gl
    , glslify('./demo.vert')
    , glslify('./demo.frag')
  )
}, function(gl, shader) {
  shader.uniforms.iResolution = [gl.drawingBufferWidth, gl.drawingBufferHeight]
  shader.uniforms.iGlobalTime = (Date.now() - start) / 1000
})

// Extracted for gl-toy, need to do manual
// downsampling here :)
function Toy(shader, cb) {
  var gl = context(canvas, render)
  shader = shader(gl)

  function render() {
    var width = gl.drawingBufferWidth
    var height = gl.drawingBufferHeight
    gl.viewport(0, 0, width, height)

    shader.bind()
    cb(gl, shader)
    triangle(gl)
  }
}
