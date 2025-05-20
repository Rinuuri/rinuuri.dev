import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'; 
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import {loadShader} from './common';
import fragmentShaderPath from '../shaders/background.glsl' assert { type: 'string' };

let lastTime = performance.now();
let time = 0;

// Initialize the scene
async function init() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(0, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({antialias: false, canvas: document.querySelector('#background-renderer')});
    renderer.setSize(window.innerWidth, window.innerHeight);
    const composer = new EffectComposer( renderer );
    //document.body.appendChild(renderer.domElement);
    const uniforms = {
        u_resolution: {value: new THREE.Vector2(window.innerWidth, window.innerHeight)
                                .multiplyScalar(window.devicePixelRatio)
        },
        aspect: {value: window.innerWidth/ window.innerHeight},
        u_time: {value: 0},
        u_mouse: {value: new THREE.Vector2(0.5, 0.5)},
        u_scale: {value: window.innerHeight/1000}     
    }
    
    // Load the fragment shader
    const fragmentShader = await loadShader(fragmentShaderPath);
    const postprocessingshader = new THREE.ShaderMaterial({
        fragmentShader: fragmentShader,
        uniforms
    });

    composer.addPass( new ShaderPass(postprocessingshader));

    window.addEventListener('resize', function() {
        const aspect = window.innerWidth/window.innerHeight;
        postprocessingshader.uniforms.u_resolution.value = new THREE.Vector2(window.innerWidth, window.innerHeight)
                                .multiplyScalar(window.devicePixelRatio);                    
        postprocessingshader.uniforms.aspect.value = aspect;
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    window.addEventListener('mousemove', function(event) {
        postprocessingshader.uniforms.u_mouse.value = new THREE.Vector2(1-event.clientX/window.innerWidth, event.clientY/window.innerHeight)
         });

    renderer.setAnimationLoop( animate );

    function animate() {
        const currentTime = performance.now();
        const deltaTime = currentTime - lastTime;
        lastTime = currentTime;
        composer.render( scene, camera );
        time += 0.0015*deltaTime;
        postprocessingshader.uniforms.u_time.value = Math.sin(time)*0.015;
    }

    animate();
}

// Start the application
init().catch(console.error);
