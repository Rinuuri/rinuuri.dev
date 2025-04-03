import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'; 
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { loadShader } from './common';
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js';

const fov = 75;
const aspect = 1;
const near = 0.1;
const far = 5;

const canvas = document.querySelector('#other_tech_cube');
const renderer = new THREE.WebGLRenderer({antialias: false, canvas});
renderer.setSize( canvas.clientWidth, canvas.clientHeight );
renderer.setClearColor( 0xffffff, 0);
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.z = 1.4;

const scene = new THREE.Scene();

const fragmentShader = await loadShader('../shaders/tech_cube.glsl');

// Create a material using the loaded fragment shader
const shader = new THREE.ShaderMaterial({
  fragmentShader: fragmentShader
});


const composer = new EffectComposer( renderer );

composer.addPass( new RenderPass(scene, camera) );
const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight).multiplyScalar(window.devicePixelRatio), 1.5, 0.4, 0.85);
bloomPass.threshold = 0.3;
bloomPass.strength = 0.8;
bloomPass.radius = 0.05;


// Add the bloom pass to the pipeline
composer.addPass(bloomPass);

var geometry = new THREE.BoxGeometry(1, 1, 1);

var materials = [];
materials.push(shader);
materials.push(shader);
materials.push(shader);
materials.push(shader);
materials.push(shader);
materials.push(shader);

var cube = new THREE.Mesh(geometry, materials);

scene.add(cube);

const ambientLight = new THREE.AmbientLight(0xffffff, 2.8);
scene.add(ambientLight);

function render(time) {
    composer.render( scene, camera );
    requestAnimationFrame(render);
}
requestAnimationFrame(render);