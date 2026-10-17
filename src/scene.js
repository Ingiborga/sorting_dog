import * as THREE from 'three';
import { HDRLoader } from 'three/addons/loaders/HDRLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

//возвращает настроенную сцену
export async function createScene(){
    const scene = new THREE.Scene();
    //настройка бэкграунда
    try {
    const hdr = new HDRLoader();
    const envMap = await hdr.loadAsync(
      '../textures/citrus_orchard_road_puresky_1k.hdr'
    );
    envMap.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = envMap;
    scene.background = envMap;
  } catch (error) {
    console.error('Не удалось загрузить HDR-фон:', error);
    scene.background = new THREE.Color(0x87ceeb);
  }
    //настройка статичных объектов сцены
    //земля
    const geometry = new THREE.PlaneGeometry( 1000, 1000);
    const material = new THREE.MeshBasicMaterial( { color: 0x00FA9A, side: THREE.DoubleSide } );
    const plane = new THREE.Mesh( geometry, material );
    plane.rotation.set( THREE.MathUtils.degToRad( 90 ), 0, 0 );
    scene.add( plane );
    //собака
    try {
    const loader = new GLTFLoader();
    const gltf = await loader.loadAsync('../res/models/dog.gltf');
    const model = gltf.scene;
    model.scale.set(1, 1, 1);
    model.position.set(0, 0, 0);
    scene.add(model);
  } catch (error) {
    console.error('Не удалось загрузить модель собаки:', error);
  }
  //свет
    const ambLight = new THREE.AmbientLight( 0x404040 );
    scene.add( ambLight );
    const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
    scene.add( directionalLight );
    return scene;
}
//возвращает настроенную камеру
export function createCamera(){
    const camera = new THREE.PerspectiveCamera(
        75, window.innerWidth / window.innerHeight, 0.5, 1000
    );
    camera.position.set( -2, 1, 2);
    return camera
}
