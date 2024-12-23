import { CONSTANTS } from './constants.js';
import * as THREE from 'three';

class Satellite {
    constructor(index) {
        this.index = index;
        this.name = `Uydu ${index}`;
        this.age = 0; // Uydu yaşı (gün cinsinden)
        this.lifetime = this.generateLifetime(); // Rastgele yaşam süresi
        this.position = this.generateInitialPosition(index);
        this.mesh = this.createMesh();
        this.trail = this.createTrail();
        this.visited = false;

        console.log(`🛰️ ${this.name}: Oluşturuldu. Ömür: ${this.lifetime.toFixed(2)} yıl`);
    }

    generateInitialPosition(index) {
        const angle = (2 * Math.PI * index) / CONSTANTS.NUM_SATELLITES;
        const x = CONSTANTS.GEO_ORBIT_RADIUS * Math.cos(angle);
        const z = CONSTANTS.GEO_ORBIT_RADIUS * Math.sin(angle);
        const y = 0; // Sabit y değeri
    
        return new THREE.Vector3(x, y, z);
    }
    

    /**
     * 🛰️ Uydu modelini oluşturur.
     * @returns {THREE.Mesh}
     */
    createMesh() {
        const geometry = new THREE.SphereGeometry(0.5, 32, 32);
        const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.copy(this.position);

        return mesh;
    }

    /**
     * 📍 Uydu izini oluşturur.
     * @returns {{line: THREE.Line, positions: Array}}
     */
    createTrail() {
        return {
            line: new THREE.Line(
                new THREE.BufferGeometry(),
                new THREE.LineBasicMaterial({
                    color: 0x0000ff,
                    opacity: 0.5,
                    transparent: true,
                })
            ),
            positions: [],
        };
    }

    /**
     * 📅 Rastgele uydu yaşam süresi oluşturur.
     * @returns {number} - Yaşam süresi (yıl cinsinden)
     */
    generateLifetime() {
        return (
            CONSTANTS.SATELLITE_LIFETIME_MIN +
            Math.random() * (CONSTANTS.SATELLITE_LIFETIME_MAX - CONSTANTS.SATELLITE_LIFETIME_MIN)
        );
    }

    /**
     * 🛰️ Uydunun hareketini simüle eder.
     * @param {number} simulationTime - Simülasyon süresi
     */
    simulateMovement(simulationTime) {
        const orbitSpeed = (2 * Math.PI) / CONSTANTS.SATELLITE_ORBIT_PERIOD;
        const angle = orbitSpeed * simulationTime;

        this.position.x = CONSTANTS.GEO_ORBIT_RADIUS * Math.cos(angle);
        this.position.z = CONSTANTS.GEO_ORBIT_RADIUS * Math.sin(angle);
        this.mesh.position.copy(this.position);
    }

    /**
     * 🕒 Uydunun kalan ömrünü döner.
     * @returns {number} - Kalan yaşam süresi (gün cinsinden)
     */
    getRemainingLifetime() {
        return Math.max(this.lifetime * 365 - this.age, 0); // Yıl → Gün
    }

    /**
     * ✅ Uydu ziyaret edildi olarak işaretlenir.
     */
    visit() {
        this.visited = true;
        console.log(`✅ ${this.name}: Ziyaret edildi.`);
    }

    /**
     * 🔄 Uydunun hareketini ve yaşını günceller.
     * @param {number} deltaTime - Zaman aralığı (saniye)
     */
    update(deltaTime) {
        this.age += deltaTime / CONSTANTS.SECONDS_IN_A_DAY; // Yaş gün cinsinden hesaplanır

        if (this.age >= this.lifetime * 365) {
            console.warn(`⚠️ ${this.name}: Kullanım ömrü sona erdi.`);
            this.visited = true;
            return;
        }

        // Yörünge hareketi
        const orbitSpeed = (2 * Math.PI) / CONSTANTS.SATELLITE_ORBIT_PERIOD;
        const angle = orbitSpeed * this.age;

        this.position.x = CONSTANTS.GEO_ORBIT_RADIUS * Math.cos(angle);
        this.position.z = CONSTANTS.GEO_ORBIT_RADIUS * Math.sin(angle);
        this.mesh.position.copy(this.position);

        // İz güncelleme
        this.updateTrail();
    }

    /**
     * 📍 Uydu izini günceller.
     */
    updateTrail() {
        this.trail.positions.push(this.mesh.position.clone());
        if (this.trail.positions.length > CONSTANTS.MAX_TRAIL_LENGTH) {
            this.trail.positions.shift();
        }
        this.trail.line.geometry.setFromPoints(this.trail.positions);
    }

    /**
     * 🔄 Uyduyu sıfırlar.
     */
    reset() {
        this.age = 0;
        this.visited = false;
        this.position = this.generateInitialPosition(this.index);
        this.mesh.position.copy(this.position);
        this.trail.positions = [];
        console.log(`🔄 ${this.name}: Sıfırlandı.`);
    }
}

export default Satellite;
