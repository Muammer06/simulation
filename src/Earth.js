import * as THREE from 'three';
import { CONSTANTS } from './constants.js';

class Earth {
    constructor() {
        this.mesh = this.createEarthMesh();
        this.mesh.rotation.y = Math.PI / 2; // Dünya eksenini hizalama
    }

    /**
     * 🌍 Dünya modelini oluşturur.
     * @returns {THREE.Mesh} - Dünya mesh nesnesi.
     */
    createEarthMesh() {
        const geometry = new THREE.SphereGeometry(CONSTANTS.EARTH_RADIUS, 64, 64);
        const textureLoader = new THREE.TextureLoader();

        // Dokuları yükle ve hata durumlarını yakala
        const earthTexture = textureLoader.load(
            'textures/earth_texture.jpg',
            undefined,
            undefined,
            (error) => console.error('❌ Dünya dokusu yüklenirken hata oluştu:', error)
        );

        const normalMap = textureLoader.load(
            'textures/earth_normal.jpg',
            undefined,
            undefined,
            (error) => console.error('❌ Dünya normal haritası yüklenirken hata oluştu:', error)
        );

        const specularMap = textureLoader.load(
            'textures/earth_specular.png',
            undefined,
            undefined,
            (error) => console.error('❌ Dünya yansıma haritası yüklenirken hata oluştu:', error)
        );

        const material = new THREE.MeshPhongMaterial({
            map: earthTexture,        // Yüzey dokusu
            normalMap: normalMap,     // Yüzey detayları
            specularMap: specularMap, // Yansıma haritası
            shininess: 20,            // Parlaklık seviyesi
            specular: new THREE.Color(0x333333), // Yansıma rengi
        });

        return new THREE.Mesh(geometry, material);
    }

    /**
     * 🔄 Dünya'yı döndürür.
     * @param {number} deltaTime - Zaman aralığı.
     */
    rotate(deltaTime) {
        if (!this.mesh) {
            console.warn('⚠️ Dünya mesh nesnesi mevcut değil.');
            return;
        }
        this.mesh.rotation.y += (2 * Math.PI / CONSTANTS.EARTH_ROTATION_PERIOD) * deltaTime;
    }

    /**
     * 🔄 Dünya'yı sıfırlar.
     */
    reset() {
        if (this.mesh) {
            this.mesh.rotation.y = Math.PI / 2;
            console.log('🔄 Dünya sıfırlandı ve başlangıç konumuna döndü.');
        }
    }
}

export default Earth;
