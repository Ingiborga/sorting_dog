import * as THREE from 'three';

export const factories = {
  box: ({ color, size = 1 }) => {
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(size, size, size),
      new THREE.MeshStandardMaterial({ color })
    );
    return mesh;
  },

  sphere: ({ color, radius = 0.5, segments = 8 }) => {
    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(radius, segments, segments),
      new THREE.MeshStandardMaterial({ color, roughness: 0.2, metalness: 0.8 })
    );
    return mesh;
  },

  cylinder: ({ color, radius = 0.5, height = 1 }) => {
    const mesh = new THREE.Mesh(
      new THREE.ConeGeometry(radius, height, 32),
      new THREE.MeshStandardMaterial({ color })
    );
    return mesh;
  },
};

export function createObject({ type, position = [0,0,0], rotation = [0,0,0], ...params }) {
  const factory = factories[type];
  if (!factory) throw new Error(`Unknown type: ${type}`);

  const mesh = factory(params);
  mesh.position.set(...position);
  mesh.rotation.set(...rotation);
  return mesh;
}