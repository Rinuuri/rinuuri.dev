import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'; 
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';

let lastTime = performance.now();
//let fps = 0;
let time = 0;

// Function to load the shader file
async function loadShader(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to load shader: ${response.statusText}`);
    }
    return await response.text();
}

// Initialize the scene
async function init() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
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
        u_mouse: {value: new THREE.Vector2(0.5, 0.5)}
    }
    
    // Load the fragment shader
    const fragmentShader = await loadShader('../shaders/background.glsl');

    // Create a material using the loaded fragment shader
    const postprocessingshader = new THREE.ShaderMaterial({
        fragmentShader: fragmentShader,
        uniforms
    });

    composer.addPass( new ShaderPass(postprocessingshader));
    const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight).multiplyScalar(window.devicePixelRatio), 1.5, 0.4, 0.85);
    bloomPass.threshold = 0.3;
    bloomPass.strength = 0.8;
    bloomPass.radius = 0.05;
    
    // Add the bloom pass to the 
    composer.addPass(bloomPass);

    window.addEventListener('resize', function() {
        const aspect = window.innerWidth/window.innerHeight;
        camera.aspect = aspect;
        postprocessingshader.uniforms.u_resolution.value = new THREE.Vector2(window.innerWidth, window.innerHeight)
                                .multiplyScalar(window.devicePixelRatio);
        postprocessingshader.uniforms.aspect.value = aspect;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    window.addEventListener('mousemove', function(event) {
        postprocessingshader.uniforms.u_mouse.value = new THREE.Vector2(1-event.clientX/window.innerWidth, event.clientY/window.innerHeight)
        //console.log('Mouse position: ' + event.clientX/window.innerWidth + ', ' + event.clientY/window.innerHeight);
      });

    // Create a geometry and mesh
    //const geometry = new THREE.PlaneGeometry(2, 2);
    //const mesh = new THREE.Mesh(geometry, material);
    //scene.add(mesh);

    //camera.position.z = 1;

    renderer.setAnimationLoop( animate );

    function animate() {
        const currentTime = performance.now();
        const deltaTime = currentTime - lastTime;
        lastTime = currentTime;
        //fps = Math.round(1000 / deltaTime);
        //console.log(`FPS: ${fps}`);
        //requestAnimationFrame(animate);
        composer.render( scene, camera );
        time += 0.0015*deltaTime;
        postprocessingshader.uniforms.u_time.value = Math.sin(time)*0.025;
        //requestAnimationFrame(animate);
    }

    animate();
}


// Start the application
init().catch(console.error);
