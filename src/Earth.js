import * as THREE from 'three';
import { CONSTANTS } from './constants.js';  // <-- Dizininize uygun yol

class Earth {
    constructor() {
        const geometry = new THREE.SphereGeometry(CONSTANTS.EARTH_RADIUS, 64, 64);
        const textureLoader = new THREE.TextureLoader();

        const earthTexture = textureLoader.load('textures/earth_texture.jpg'); // Yüzey dokusu
        const normalMap = textureLoader.load('textures/earth_normal.jpg'); // Yüzey detayları
        const specularMap = textureLoader.load('textures/earth_specular.png'); // Yansıma haritası

        const material = new THREE.MeshPhongMaterial({
            map: earthTexture, // Yüzey dokusu
            normalMap: normalMap, // Yüzey detayları
            shininess: 20, // Hafif parlaklık
            specularMap: specularMap, // Yansıma haritası (opsiyonel)
            specular: new THREE.Color(0x333333) // Hafif parlaklık tonu
        });
        this.mesh = new THREE.Mesh(geometry, material);

        this.mesh.rotation.y = Math.PI / 2; // Doğru hizalama için
    }

    rotate(deltaTime) {
        this.mesh.rotation.y += (2 * Math.PI / CONSTANTS.EARTH_ROTATION_PERIOD) * deltaTime;
    }
}
export default Earth;