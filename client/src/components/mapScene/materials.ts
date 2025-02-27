import * as THREE from 'three';
import { shaderMaterial } from "@react-three/drei";
import { tileSize } from './constants';
import { extend } from '@react-three/fiber';

export const GradientMaterial = shaderMaterial(
    {
      color1: new THREE.Color('#bad2e9'),
      color2: new THREE.Color('#f3f8fc'),
      time: 0,
      tileSize: tileSize
    },
    `
      varying vec3 vPosition;
      void main() {
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `
    ,
    `
      uniform vec3 color1;
      uniform vec3 color2;
      uniform float tileSize;
      varying vec3 vPosition;
      void main() {
        float height = (vPosition.y + tileSize);
        vec3 color = mix(color1, color2, height);
        gl_FragColor = vec4(color, 1.0);
      }
    `
  );

export const PulsingMaterial = shaderMaterial(
    {
      baseColor: new THREE.Color('#bad2e9'),
      pulseColor: new THREE.Color('#0e0eff'),
      time: 0,
      tileSize: tileSize
    },
    `
      varying vec3 vPosition;
      void main() {
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }`
    ,
      `
      uniform vec3 baseColor;
      uniform vec3 pulseColor;
      uniform float time;
      uniform float tileSize;
      varying vec3 vPosition;
      void main() {
        float height = (vPosition.y + tileSize) / 0.5;
        vec3 color = mix(baseColor, pulseColor, abs(sin(time * 3.0)) * height);
        gl_FragColor = vec4(color, 1.0);
      }
    `
  );

export const blockedAreaMaterial = new THREE.ShaderMaterial({
    uniforms: {
      color: { value: new THREE.Color('#3b4d6b') },
      opacity: { value: 0.5 }
    },
    vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
    `,
    fragmentShader: `
    uniform vec3 color;
    uniform float opacity;
    void main() {
      gl_FragColor = vec4(color, opacity);
    }
    `,
    transparent: true
  });

  export const PathShaderMaterial = shaderMaterial(
    {
      color: new THREE.Color(0x0000ff),
      time: 0,
    },
    `precision mediump float;
    varying vec2 vUv;
  
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }`,
    `precision mediump float;
    uniform float time;
    uniform vec3 color;
    varying vec2 vUv;
  
    void main() {
      float phase = sin(vUv.x * 20.0 + time);
      gl_FragColor = mix(vec4(color, 1.0), vec4(0.5, 0.7, 1.0, 1.0), phase);
    }`
  );
  
  // Register the shader material so it can be used within R3F
  extend({ PathShaderMaterial });

  export const BlockedTileMaterial = shaderMaterial(
    // Uniforms (global variables that you can use in the shader)
    {
      color: new THREE.Color(1, 0, 0), // RGB red
      opacity: .8 // Semi-transparent
    },
    // Vertex Shader
    `
    void main() {
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
    `,
    // Fragment Shader
    `
    uniform vec3 color;
    uniform float opacity;
    void main() {
      gl_FragColor = vec4(color, opacity); // Set the color and opacity
    }
    `
  );