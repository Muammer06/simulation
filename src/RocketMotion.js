import * as THREE from 'three';
import { CONSTANTS } from './constants.js'; // Sabit değerleri içe aktar

class RocketMotion {
    constructor() {
        this.currentPath = null; // Roketin mevcut yolu
        this.progress = 0; // Hareket ilerleme oranı (0-1)
        this.isMoving = false; // Roketin hareket durumu
    }

    /**
     * 🚀 Roketin hedef uyduya olan yörüngesini planlar.
     * @param {Rocket} rocket - Roket nesnesi.
     * @param {Satellite} target - Hedef uydu nesnesi.
     */
    planPath(rocket, target) {
        if (!rocket || !rocket.mesh || !target || !target.mesh) {
            console.warn('❌ Roket veya hedef uydu bilgileri eksik.');
            return;
        }

        const startPos = rocket.mesh.position.clone();
        const targetPos = target.mesh.position.clone();

        // Yörünge orta noktası (basit bir yükselti eklenerek)
        const midPoint = new THREE.Vector3().addVectors(startPos, targetPos).multiplyScalar(0.5);
        midPoint.y += CONSTANTS.GEO_ORBIT_RADIUS * 0.5;

        this.currentPath = {
            start: startPos,
            midPoint: midPoint,
            target: targetPos,
            distance: startPos.distanceTo(targetPos),
        };

        this.progress = 0;
        this.isMoving = true;

        console.log('✅ Yörünge başarıyla planlandı.');
    }

    /**
     * 🔄 Roketi hedefe doğru ilerletir.
     * @param {Rocket} rocket - Roket nesnesi.
     * @param {number} deltaTime - Geçen süre.
     * @returns {boolean} - Roket hedefe ulaştıysa true döner.
     */
    updatePosition(rocket, deltaTime) {
        if (!this.currentPath) {
            console.warn('⚠️ Hareket yolu tanımlı değil.');
            return false;
        }

        if (!this.isMoving) return false;

        // İlerleme oranını güncelle
        this.progress += deltaTime * CONSTANTS.ROCKET_SPEED / this.currentPath.distance;

        if (this.progress >= 1) {
            rocket.mesh.position.copy(this.currentPath.target);
            this.reset();
            console.log(`🏁 Roket ${rocket.index} hedefe ulaştı.`);
            return true;
        }

        // Bezier eğrisi üzerinden pozisyonu hesapla
        const position = this.calculateOrbitPosition(
            this.currentPath.start,
            this.currentPath.midPoint,
            this.currentPath.target,
            this.progress
        );

        rocket.mesh.position.copy(position);
        return false;
    }

    /**
     * 📍 Bezier eğrisi üzerinde belirli bir ilerleme oranına göre pozisyonu hesaplar.
     * @param {THREE.Vector3} start - Başlangıç noktası.
     * @param {THREE.Vector3} mid - Ara nokta (yörünge).
     * @param {THREE.Vector3} end - Hedef noktası.
     * @param {number} t - İlerleme oranı (0 ile 1 arasında).
     * @returns {THREE.Vector3} - Hesaplanan pozisyon.
     */
    calculateOrbitPosition(start, mid, end, t) {
        return new THREE.Vector3(
            this.quadraticBezier(start.x, mid.x, end.x, t),
            this.quadraticBezier(start.y, mid.y, end.y, t),
            this.quadraticBezier(start.z, mid.z, end.z, t)
        );
    }

    /**
     * 📐 Bezier eğrisi hesaplaması.
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
     * 🛑 Roket hareketini durdurur ve sıfırlar.
     */
    stop() {
        this.isMoving = false;
        console.log('🛑 Roket hareketi durduruldu.');
    }

    /**
     * 🔄 Hareket verilerini sıfırlar.
     */
    reset() {
        this.currentPath = null;
        this.progress = 0;
        this.isMoving = false;
        console.log('🔄 RocketMotion sıfırlandı.');
    }

    /**
     * 🚦 Roketin hareket durumunu kontrol eder.
     * @returns {boolean} - Roket hareket halinde mi?
     */
    isInMotion() {
        return this.isMoving;
    }
}

export default RocketMotion;
