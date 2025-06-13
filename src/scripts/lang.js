import * as THREE from 'three';
import translations from '../translations.json' assert { type: 'json' };
import engPath from '../images/english.webp'
import nldPath from '../images/dutch.webp'
import rusPath from '../images/russian.webp'

export async function init(canvas) {
  let language = "en";

  function determineLanguage(){
    const userLang = localStorage.getItem("preferredLanguage") || navigator.language || navigator.userLanguage; 
    switch (userLang) {
      case "ru": {
        language = "ru";
        cube.rotation.y = 1.5707963267948966;
        break;
      }
      case "nl": {
        language = "nl";
        cube.rotation.y = 4.71238898038469;
      }
    }
    if (language != "en") setLanguage(language);
  }

  var elements = document.querySelectorAll('[ts]');

  function setLanguage(l) {
      language = l;
      const arr = translations[language];
      elements.forEach(function(element) {
          var key = element.getAttribute('ts');
          
          if (arr.hasOwnProperty(key)) {
              element.innerHTML = arr[key];
          }
      });
  }


  const fov = 75;
  const aspect = 1;
  const near = 0.1;
  const far = 5;

  const renderer = new THREE.WebGLRenderer({antialias: false, canvas});
  renderer.setSize( 90,90 );
  renderer.setClearColor( 0xffffff, 0);
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = 1.4;

  const scene = new THREE.Scene();

  const discardMaterial = new THREE.ShaderMaterial({
    vertexShader:`
          void main() {
              gl_Position = vec4(1.0);
          }`,
    fragmentShader: `
          void main() {
              gl_FragColor = vec4(1.0);
              discard;
          }
      `
  });

  var geometry = new THREE.BoxGeometry(1, 1, 1);
  var texture = new THREE.TextureLoader();
  var materials = [];
  const dutch = texture.load(nldPath);
  dutch.magFilter = THREE.NearestFilter;
  dutch.minFilter = THREE.NearestFilter;
  const english = texture.load(engPath);
  english.magFilter = THREE.NearestFilter;
  english.minFilter = THREE.NearestFilter;
  const russian = texture.load(rusPath);
  russian.magFilter = THREE.NearestFilter;
  russian.minFilter = THREE.NearestFilter;
  materials.push(new THREE.MeshPhongMaterial({map: dutch}));
  materials.push(new THREE.MeshPhongMaterial({map: russian}));
  materials.push(discardMaterial);
  materials.push(discardMaterial);
  materials.push(new THREE.MeshPhongMaterial({map: english}));
  materials.push(new THREE.MeshPhongMaterial({map: english}));

  var cube = new THREE.Mesh(geometry, materials);

  determineLanguage();

  scene.add(cube);


  const ambientLight = new THREE.AmbientLight(0xffffff, 2.8);
  scene.add(ambientLight);

  let isDragging = false;
  let previousX;
  let velocity = 0;
  const friction = 0.4;
  // Define the possible rotation positions
  const snapPositions = [0, Math.PI / 2, Math.PI, Math.PI * 3 / 2];

  // Store the current snapped position
  let currentSnapPosition = 0;

  function startDrag(event) {
    isDragging = true;
    previousX = event.clientX || event.touches[0].clientX;
    canvas.style.cursor = "grabbing"; 
  }

  function drag(event) {
    if (isDragging) {
      const currentX = event.clientX || event.touches[0].clientX;
      velocity += (currentX - previousX) * 0.05;
      previousX = currentX;
    }
  }

  function endDrag() {
    isDragging = false;
    canvas.style.cursor = "grab"; 
    snapCube();
  }

  function snapCube() {
    // Normalize the cube's rotation to be within the range [0, 2 * PI)
    let rotation = cube.rotation.y % (2 * Math.PI);
    if (rotation < -Math.PI/4) {
      rotation += 2 * Math.PI;
    } else if (rotation > 5.49778718038469) {
      rotation -= 2 * Math.PI;
    }

    // Calculate the closest snap position
    const closestSnapPosition = snapPositions.reduce((prev, curr) => {
      return Math.abs(curr - rotation) < Math.abs(prev - rotation) ? curr : prev;
    }, snapPositions[0]);

    // Interpolate to the closest snap position
    const snapTime = 0.5; // seconds
    const snapStart = rotation;
    const snapEnd = closestSnapPosition;
    const snapStartTime = performance.now();

    function snapRender(time) {
      const t = (time - snapStartTime) / (snapTime * 1000);
      cube.rotation.y = snapStart + (snapEnd - snapStart) * t;
      if (t < 1) {
        requestAnimationFrame(snapRender);
      } else {
        cube.rotation.y = snapEnd;
        currentSnapPosition = snapEnd;
        let lang;
        switch (snapEnd){
          case 1.5707963267948966:
            lang = "ru";
            break;
          case 0:
            lang = "en";
            break;
          case 3.141592653589793:
            lang = "en";
            break;
          case 4.71238898038469:
            lang = "nl";
            break;
        }
        if (lang != language) {
          setLanguage(lang);
          localStorage.setItem("preferredLanguage",language);
        }
      }
    }
    requestAnimationFrame(snapRender);
  }

  canvas.addEventListener('mousedown', startDrag);
  canvas.addEventListener('touchstart', startDrag);
  canvas.addEventListener('mousemove', drag);
  canvas.addEventListener('touchmove', drag);
  canvas.addEventListener("mouseleave", endDrag);
  canvas.addEventListener('mouseup', endDrag);
  canvas.addEventListener('touchend', endDrag);

  function render(time) {
    renderer.render(scene, camera);

    velocity *= friction;
    cube.rotation.y += velocity;

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}