import * as THREE from 'three';

import { createScene, createCamera} from './scene.js';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { DragControls } from 'three/addons/controls/DragControls.js';


const scene = await createScene();

const camera = createCamera();
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const controls = new OrbitControls( camera, renderer.domElement );
// controls.update() must be called after any manual changes to the camera's transform

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();