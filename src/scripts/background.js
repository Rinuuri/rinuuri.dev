import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'; 
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import {loadShader} from './common';
import fragmentShaderPath from '../shaders/background.glsl' assert { type: 'string' };

export async function init(canvas) {
    let lastTime = performance.now();
    let time = 0;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(0, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({antialias: false, canvas: canvas});
    renderer.setSize(window.innerWidth/2, window.innerHeight/2, false);
    const composer = new EffectComposer( renderer );
    
    const uniforms = {
        u_resolution: {value: new THREE.Vector2(window.innerWidth, window.innerHeight)
                                .multiplyScalar(window.devicePixelRatio)
        },
        aspect: {value: window.innerWidth/ window.innerHeight},
        u_time_sin: {value: 0},
        u_time: {value: 0},
        u_scale: {value: window.innerHeight/1000}     
    }
    
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
        renderer.setSize(window.innerWidth/2, window.innerHeight/2, false);
    });

    renderer.setAnimationLoop( animate );

    function animate() {
        const currentTime = performance.now();
        const deltaTime = currentTime - lastTime;
        lastTime = currentTime;
        composer.render( scene, camera );
        time += 0.0015*deltaTime;
        postprocessingshader.uniforms.u_time.value = time*0.01;
    }

    animate();
}