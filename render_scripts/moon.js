import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'; import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';

function generateRandomFloat32Array(size) {
  const array = new Float32Array(size);
  for (let i = 0; i < size; i++) {
    array[i] = Math.random();
    if (i%2==1){
        if(array[i] <= 0.6) array[i] += 0.6;
        else if(array[i] >= 0.9) array[i] -= 0.1;
    }
  }
  return array;
}

const canvas = document.getElementById('moon-renderer');
let aspect = window.innerWidth/ window.innerHeight;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, aspect, 0.1, 1000 );

const points = generateRandomFloat32Array(40);
const texture = new THREE.DataTexture(points, points.length / 2, 1, THREE.RGFormat, THREE.FloatType);
texture.needsUpdate = true;

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: false});
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );
const composer = new EffectComposer( renderer );
document.body.appendChild( renderer.domElement );

camera.position.z = 5;

const mspfElement = document.createElement('div');
mspfElement.style.position = 'absolute';
mspfElement.style.top = '30px';
mspfElement.style.left = '10px';
mspfElement.style.color = 'white';
const fpsElement = document.createElement('div');
fpsElement.style.position = 'absolute';
fpsElement.style.top = '10px';
fpsElement.style.left = '10px';
fpsElement.style.color = 'white';
document.body.appendChild(fpsElement);
document.body.appendChild(mspfElement);

let isDragging = false;
let previousX;
let velocity = 0;
let friction = 0.4;

function startDrag(event) {
  isDragging = true;
  previousX = event.clientX || event.touches[0].clientX;
}


function drag(event) {
  if (isDragging) {
    const currentX = event.clientX || event.touches[0].clientX;
    const delta = currentX - previousX;
    velocity += delta * 0.01;
    previousX = currentX;
  }
}

function endDrag() {
  isDragging = false;
}

document.addEventListener('mousedown', startDrag);
document.addEventListener('touchstart', startDrag);
document.addEventListener('mousemove', drag);
document.addEventListener('touchmove', drag);
document.addEventListener('mouseup', endDrag);
document.addEventListener('touchend', endDrag);

let lastTime = performance.now();
let fps = 0;

let minmspf = 10000;
let maxmspf = 0;

const uniforms = {
    tDiffuse: { value: null },
    u_resolution: {value: new THREE.Vector2(window.innerWidth, window.innerHeight)
                            .multiplyScalar(window.devicePixelRatio)
    },
    aspect: {value: aspect}
}

const sphereFragmentShader = new THREE.ShaderMaterial({
    vertexShader:`
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        }`,
    fragmentShader: `
        varying vec2 vUv;
        uniform sampler2D pointsTexture;

        void main() {

            lowp vec2 pos = vUv;
            lowp vec2 point;
            lowp vec3 color;
            lowp float distance;
            lowp float size = 0.5;
            for (lowp float i = 0.0; i < 20.0; i++) {
                point = texture2D(pointsTexture, vec2(i / 20.0, 0.0)).xy;
                distance = 1.0 + dot(pos-point,pos-point)*(-100000.0*size);
                color.rb += distance*step(0.0, distance)*0.85;
                size = point.y;
            }
            gl_FragColor += vec4(color,1.0);

        }
    `,
    uniforms: {
        pointsTexture: { value: texture}//new THREE.TextureLoader().load('./nederland.jpg') },
    }
});

const postprocessingshader = new THREE.ShaderMaterial({
    vertexShader:`
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        }`,
    fragmentShader: `
        uniform vec2 u_resolution;
        uniform float aspect;
        uniform sampler2D tDiffuse;
        varying vec2 vUv;
        void main() {
            lowp vec2 pixelPos = gl_FragCoord.xy / u_resolution;
            lowp vec4 previousColor = texture2D(tDiffuse, vUv);
            pixelPos.x *= aspect;
            lowp float distanceOUT = (pow(length(pixelPos - vec2(0.5*aspect, 0.5)), 20.0)*10000000.0);
            lowp float distanceIN = 1.0+(pow(length(pixelPos - vec2(0.5*aspect, 0.5)), 20.0)*-10000000.0);
            lowp float ringIN = distanceIN*step(distanceIN, 0.5);
            distanceOUT *= step(distanceOUT, 0.5);
            lowp float color = ringIN+distanceOUT;

            previousColor.rgb += color;
            previousColor.a = distanceIN;
            gl_FragColor = previousColor;
        }

    `,
    uniforms
});


const geometry = new THREE.SphereGeometry( 2.78, 16, 8 );
const sphere = new THREE.Mesh( geometry, sphereFragmentShader );
scene.add( sphere );
const renderPass = new RenderPass( scene, camera );
composer.addPass( renderPass );
composer.addPass( new ShaderPass(postprocessingshader));

window.addEventListener('resize', function() {
    aspect = window.innerWidth/window.innerHeight;
    camera.aspect = aspect;
    postprocessingshader.uniforms.u_resolution.value = new THREE.Vector2(window.innerWidth, window.innerHeight)
                            .multiplyScalar(window.devicePixelRatio);
    postprocessingshader.uniforms.aspect.value = aspect;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
sphere.rotation.x = 0.95;
function animate() {
    const currentTime = performance.now();
    const deltaTime = currentTime - lastTime;
    lastTime = currentTime;
    fps = Math.round(1000 / deltaTime);
    fpsElement.textContent = `FPS: ${fps}`;
    mspfElement.textContent = `MSPF: ${deltaTime}`;
    velocity *= friction;
    sphere.rotation.y += velocity+0.0055;

	composer.render( scene, camera );

}
