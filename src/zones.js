import * as THREE from 'three';

function createZone(x,z,color,name,rotate){
    const geometry = new THREE.PlaneGeometry( 2,2);
    const material = new THREE.MeshBasicMaterial( { color, side: THREE.DoubleSide } );
    const plane = new THREE.Mesh( geometry, material );
    plane.position.set(x, 0.1, z);
    plane.rotation.set(THREE.MathUtils.degToRad(90), 0, rotate);
    return plane;
}
export function initZones(scene){
    const green_zone = createZone(-2,2,0x9ACD32,'true',THREE.MathUtils.degToRad(30));
    const red_zone = createZone(2,2,0xDC143C,'false',THREE.MathUtils.degToRad(-30));
    scene.add(green_zone);
    scene.add(red_zone);
    return { green_zone, red_zone };
}

function isPointOverZone(point, zone) {
  const local = zone.worldToLocal(point.clone());
  const half = 1;
  return Math.abs(local.x) <= half && Math.abs(local.z) <= half;
}

export function getZoneUnderObject(object,green_zone, red_zone) {
  if (isPointOverZone(object.position, green_zone)) {
    object.userData.zone = 'like';
    return 'like'
   };
  if (isPointOverZone(object.position, red_zone)) {
    object.userData.zone = 'dislike';
    return 'dislike'
   };
  return null;
}