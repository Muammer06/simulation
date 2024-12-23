import * as THREE from 'three';
import { CONSTANTS } from './constants.js';  // <-- Dizininize uygun yol


 class Moon {
    constructor() {
        const geometry = new THREE.SphereGeometry(CONSTANTS.EARTH_RADIUS * 0.27, 32, 32);
        const material = new THREE.MeshPhongMaterial({
            map: new THREE.TextureLoader().load('textures/moon_texture.png'),
            shininess: 500,
        });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.set(CONSTANTS.MOON_ORBIT_RADIUS, 0, 0);
        this.rotationSpeed = (2 * Math.PI) / (CONSTANTS.MOON_ROTATION_PERIOD * 24 * 60 * 60); // Gerçekçi dönüş hızı

    }

    update(deltaTime) {
        this.angle += this.orbitSpeed; // Update orbit position
        const x = CONSTANTS.MOON_ORBIT_RADIUS * Math.cos(this.angle);
        const z = CONSTANTS.MOON_ORBIT_RADIUS * Math.sin(this.angle);
        this.mesh.position.set(x, 0, z);
        this.mesh.rotation.y += (2 * Math.PI / CONSTANTS.MOON_ROTATION_PERIOD) * deltaTime;
    }
}

export default Moon;