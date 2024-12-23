import * as THREE from 'three';
import { CONSTANTS } from './constants.js';  // <-- Dizininize uygun yol


class RocketMotion {
    constructor() {
        this.currentPath = null;
        this.progress = 0;
    }

    /**
     * Roketin hedef uyduya olan yörüngesini planlar.
     * @param {Rocket} rocket - Roket nesnesi.
     * @param {Satellite} target - Hedef uydu nesnesi.
     */
    planPath(rocket, target) {
        if (!rocket || !rocket.mesh || !target || !target.mesh) {
            console.warn('Roket veya hedef uydu bilgileri eksik.');
            return;
        }
    
        const startPos = rocket.mesh.position.clone();
        const targetPos = target.mesh.position.clone();
    
        const midPoint = new THREE.Vector3().addVectors(startPos, targetPos).multiplyScalar(0.5);
        const orbitHeight = CONSTANTS.GEO_ORBIT_RADIUS * 0.5;
        midPoint.y += orbitHeight;
    
        this.currentPath = {
            start: startPos,
            midPoint: midPoint,
            target: targetPos,
            distance: startPos.distanceTo(targetPos)
        };
    
        this.progress = 0;
        console.log('Yörünge başarıyla planlandı.');
    }
    

    /**
     * Roketi hedefe doğru ilerletir.
     * @param {Rocket} rocket - Roket nesnesi.
     * @param {number} deltaTime - Geçen süre.
     * @returns {boolean} - Roket hedefe ulaştıysa true döner.
     */
    updatePosition(rocket, deltaTime) {
        if (!this.currentPath) {
            console.warn('Hareket yolu tanımlı değil.');
            return false;
        }

        // Hareket ilerlemesini hesapla
        this.progress += deltaTime * CONSTANTS.ROCKET_SPEED / this.currentPath.distance;

        if (this.progress >= 1) {
            rocket.mesh.position.copy(this.currentPath.target);
            this.currentPath = null;
            this.progress = 0;
            return true; // Hedefe ulaşıldı
        }

        // Bezier eğrisi üzerinden hareket
        const position = this.calculateOrbitPosition(
            this.currentPath.start,
            this.currentPath.midPoint,
            this.currentPath.target,
            this.progress
        );

        rocket.mesh.position.copy(position);
        return false; // Hedefe henüz ulaşılmadı
    }

    /**
     * Bezier eğrisi üzerinde belirli bir ilerleme oranına göre pozisyonu hesaplar.
     * @param {THREE.Vector3} start - Başlangıç noktası.
     * @param {THREE.Vector3} mid - Ara nokta (yörünge).
     * @param {THREE.Vector3} end - Hedef noktası.
     * @param {number} t - İlerleme oranı (0 ile 1 arasında).
     * @returns {THREE.Vector3} - Hesaplanan pozisyon.
     */
    calculateOrbitPosition(start, mid, end, t) {
        const position = new THREE.Vector3();
        position.x = this.quadraticBezier(start.x, mid.x, end.x, t);
        position.y = this.quadraticBezier(start.y, mid.y, end.y, t);
        position.z = this.quadraticBezier(start.z, mid.z, end.z, t);
        return position;
    }

    /**
     * Bezier eğrisi hesaplaması.
     * @param {number} p0 - Başlangıç noktası değeri.
     * @param {number} p1 - Ara nokta değeri.
     * @param {number} p2 - Hedef noktası değeri.
     * @param {number} t - İlerleme oranı (0 ile 1 arasında).
     * @returns {number} - Bezier eğrisi sonucu.
     */
    quadraticBezier(p0, p1, p2, t) {
        return (1 - t) ** 2 * p0 + 2 * (1 - t) * t * p1 + t ** 2 * p2;
    }

    /**
     * Hareket verilerini sıfırlar.
     */
    reset() {
        this.currentPath = null;
        this.progress = 0;
        console.log('RocketMotion sıfırlandı.');
    }
}

// RocketMotion sınıfını dışa aktar

export default RocketMotion;    