import { CONSTANTS } from './constants.js';  // Sabit değerleri içe aktar
import * as THREE from 'three';             // Three.js kütüphanesi
import RocketMotion from './RocketMotion.js'; // Roket hareket yönetimi

class Rocket {
    constructor(index) {
        this.index = index;
        this.fuel = CONSTANTS.MAX_FUEL;      // Maksimum yakıt seviyesi
        this.route = [];                    // İzlenen rota
        this.alive = true;                  // Roketin durumu
        this.motion = new RocketMotion();   // Roket hareket yöneticisi
        this.currentTarget = null;          // Şu anki hedef
        this.previousPosition = null;       // Önceki pozisyon (yakıt hesabı için)

        this.createRocket();                // Roket modeli oluştur
        this.createTrail();                 // Roket izi oluştur
    }

    /**
     * 🚀 Roket modelini oluşturur.
     */
    createRocket() {
        const geometry = new THREE.CylinderGeometry(
            CONSTANTS.EARTH_RADIUS * 0.04,
            CONSTANTS.EARTH_RADIUS * 0.02,
            CONSTANTS.EARTH_RADIUS * 0.1,
            32
        );

        const textureLoader = new THREE.TextureLoader();
        const rocketTexture = textureLoader.load('textures/rocket/rocket_texture.jpg');

        const material = new THREE.MeshPhongMaterial({
            map: rocketTexture,
            shininess: 50,
            emissive: 0x111111
        });

        this.mesh = new THREE.Mesh(geometry, material);

        const coneGeometry = new THREE.ConeGeometry(
            CONSTANTS.EARTH_RADIUS * 0.04,
            CONSTANTS.EARTH_RADIUS * 0.1,
            32
        );

        const coneMaterial = new THREE.MeshPhongMaterial({
            color: 0xff0000,
            shininess: 50
        });

        const cone = new THREE.Mesh(coneGeometry, coneMaterial);
        cone.position.set(0, CONSTANTS.EARTH_RADIUS * 0.05, 0);
        this.mesh.add(cone);
    }

    /**
     * 🌟 Roketin izini oluşturur.
     */
    createTrail() {
        const trailGeometry = new THREE.BufferGeometry();
        const trailMaterial = new THREE.LineBasicMaterial({
            color: 0x00ff00,
            opacity: 0.5,
            transparent: true
        });

        this.trail = {
            line: new THREE.Line(trailGeometry, trailMaterial),
            positions: []
        };
    }

    /**
     * 🎯 Rastgele bir uyduya hareket eder.
     * @param {Array} satellites - Uydular dizisi.
     */
    moveToRandomSatellite(satellites) {
        if (!this.alive) return;

        const availableSatellites = satellites.filter(sat => !this.route.includes(sat));
        if (availableSatellites.length === 0) {
            this.alive = false;
            console.warn(`Roket ${this.index}: Uygun hedef kalmadı.`);
            return;
        }

        const target = availableSatellites[Math.floor(Math.random() * availableSatellites.length)];
        this.route.push(target);
        this.motion.planPath(this, target);
    }

    /**
     * ⏳ Roketi günceller ve hareketini sağlar.
     * @param {number} deltaTime - Geçen süre.
     */
    update(deltaTime) {
        if (!this.alive || !this.motion.currentPath) return;
    
        const completed = this.motion.updatePosition(this, deltaTime);
        this.consumeFuel(deltaTime);
    
        if (completed) {
            console.log(`Roket ${this.index}: ${this.currentTarget?.name} hedefine ulaştı.`);
            this.motion.reset();
        }
    
        this.updateTrail();
    }
    
    /**
     * ⛽ Yakıt tüketimini hesaplar ve günceller.
     * @param {number} deltaTime - Geçen süre.
     */
    consumeFuel(deltaTime) {
        const currentPosition = this.mesh.position.clone();

        if (!this.previousPosition) {
            this.previousPosition = currentPosition;
            return;
        }

        const distanceTravelled = currentPosition.distanceTo(this.previousPosition);
        const fuelToConsume = distanceTravelled * CONSTANTS.FUEL_CONSUMPTION_RATE;

        if (this.fuel - fuelToConsume < this.calculateRequiredFuelToMoon()) {
            console.warn('Yakıt kritik seviyede, tüketim durduruldu.');
            return;
        }

        this.fuel -= fuelToConsume;
        this.previousPosition = currentPosition;

        console.log(`Yakıt Tüketildi: ${fuelToConsume.toFixed(2)} L, Kalan Yakıt: ${this.fuel.toFixed(2)} L`);
    }

    /**
     * 🚀 Uyduya yakıt aktarır.
     * @param {Object} satellite - Hedef uydu.
     */
    refuelSatellite(satellite) {
        const requiredFuel = 100 - satellite.fuel;
        const fuelToTransfer = Math.min(requiredFuel, CONSTANTS.FUEL_TRANSFER_RATE, this.fuel - this.calculateRequiredFuelToMoon());

        if (fuelToTransfer <= 0) {
            console.warn('Yeterli yakıt yok, aktarım durduruldu.');
            return;
        }

        satellite.fuel += fuelToTransfer;
        this.fuel -= fuelToTransfer;

        console.log(`Uyduya ${fuelToTransfer.toFixed(2)} L yakıt aktarıldı. Roket kalan yakıt: ${this.fuel.toFixed(2)} L`);
    }

    /**
     * 🌕 Ay'a dönüş için gerekli yakıtı hesaplar.
     */
    calculateRequiredFuelToMoon() {
        const distanceToMoon = CONSTANTS.MOON_ORBIT_RADIUS;
        return (distanceToMoon / CONSTANTS.ROCKET_SPEED) * CONSTANTS.FUEL_CONSUMPTION_RATE * 1.5;
    }

    /**
     * 📍 Roket izini günceller.
     */
    updateTrail() {
        this.trail.positions.push(this.mesh.position.clone());
        if (this.trail.positions.length > CONSTANTS.MAX_TRAIL_LENGTH) {
            this.trail.positions.shift();
        }
        this.trail.line.geometry.setFromPoints(this.trail.positions);
    }

    /**
     * 🔄 Roketi sıfırlar.
     */
    reset() {
        this.mesh.position.set(CONSTANTS.MOON_ORBIT_RADIUS, 0, 0);
        this.motion.reset();
        this.fuel = CONSTANTS.MAX_FUEL;
        this.previousPosition = null;
        console.log('Roket sıfırlandı ve başlangıç konumuna döndü.');
    }
}

export default Rocket;
