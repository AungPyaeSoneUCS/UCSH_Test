// Copyright (c) 2025 by Tommy Ho (https://codepen.io/tommyho/pen/ByaWYmR)
/* Sources: https://github.com/klevron/threejs-toys */
/* Revised by: tommyho510@gmail.com */

import { butterfliesBackground } from 'https://unpkg.com/threejs-toys@0.0.8/build/threejs-toys.module.cdn.min.js'

const pc = butterfliesBackground({
  el: document.getElementById('app'),
  eventsEl: document.body,
  gpgpuSize: 18,
  background: 0x88CEFF,
  material: 'phong', // or 'standard' 'basic'
  lights: [
    { type: 'ambient', params: [0xffffff, 0.5] },
    { type: 'directional', params: [0xffffff, 1], props: { position: [10, 0, 0] } }
  ],
  materialParams: { transparent: true, alphaTest: 0.5 },
  texture: 'https://assets.codepen.io/33787/butterflies.png',
  textureCount: 4,
  wingsScale: [2, 2, 2],
  wingsWidthSegments: 16,
  wingsHeightSegments: 16,
  wingsSpeed: 0.75,
  wingsDisplacementScale: 1.25,
  noiseCoordScale: 0.01,
  noiseTimeCoef: 0.0005,
  noiseIntensity: 0.0025,
  attractionRadius1: 100,
  attractionRadius2: 150,
  maxVelocity: 0.1
})

