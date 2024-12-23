import * as THREE from 'three';
import { CONSTANTS } from './constants.js';

class Moon {
    constructor() {
        this.angle = 0; // Ay'ın yörüngedeki mevcut açısı
        this.orbitSpeed = (2 * Math.PI) / CONSTANTS.MOON_ROTATION_PERIOD; // Ay'ın yörünge hızı

        this.mesh = this.createMoonMesh();
        this.mesh.position.set(CONSTANTS.MOON_ORBIT_RADIUS, 0, 0); // Ay'ın başlangıç pozisyonu

        console.log('🌑 Ay oluşturuldu ve sahneye eklendi.');
    }

    /**
     * 🌑 Ay modelini oluşturur.
     * @returns {THREE.Mesh} - Ay mesh nesnesi.
     */
    createMoonMesh() {
        const geometry = new THREE.SphereGeometry(CONSTANTS.EARTH_RADIUS * 0.27, 32, 32);
        const textureLoader = new THREE.TextureLoader();

        const moonTexture = textureLoader.load(
            'textures/moon_texture.png',
            undefined,
            undefined,
            (error) => console.error('❌ Ay dokusu yüklenirken hata oluştu:', error)
        );

        const material = new THREE.MeshPhongMaterial({
            map: moonTexture,  // Yüzey dokusu
            shininess: 10,     // Hafif parlaklık
        });

        return new THREE.Mesh(geometry, material);
    }

    /**
     * 🔄 Ay'ın yörüngedeki hareketini ve kendi etrafındaki dönüşünü günceller.
     * @param {number} deltaTime - Zaman aralığı.
     */
    update(deltaTime) {
        if (!this.mesh) {
            console.warn('⚠️ Ay mesh nesnesi mevcut değil.');
            return;
        }

        // Yörünge hareketi
        this.angle += this.orbitSpeed * deltaTime;
        const x = CONSTANTS.MOON_ORBIT_RADIUS * Math.cos(this.angle);
        const z = CONSTANTS.MOON_ORBIT_RADIUS * Math.sin(this.angle);
        this.mesh.position.set(x, 0, z);

        // Kendi etrafında dönüş
        this.mesh.rotation.y += (2 * Math.PI / CONSTANTS.MOON_ROTATION_PERIOD) * deltaTime;

        console.log(`🌑 Ay güncellendi → Pozisyon: (${x.toFixed(2)}, 0, ${z.toFixed(2)})`);
    }

    /**
     * 🔄 Ay'ı sıfırlar.
     */
    reset() {
        this.angle = 0;
        this.mesh.position.set(CONSTANTS.MOON_ORBIT_RADIUS, 0, 0);
        this.mesh.rotation.y = 0;
        console.log('🔄 Ay sıfırlandı ve başlangıç konumuna döndü.');
    }
}

export default Moon;
