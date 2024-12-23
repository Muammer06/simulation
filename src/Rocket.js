import { CONSTANTS } from './constants.js'; // Sabit değerleri içe aktar
import * as THREE from 'three'; // Three.js kütüphanesi
import RocketMotion from './RocketMotion.js'; // Roket hareket yönetimi

class Rocket {
    constructor(index, initialFuel = CONSTANTS.MAX_FUEL) {
        this.index = index;
        this.fuel = initialFuel; // Başlangıç yakıt miktarı
        this.alive = true;
        this.motion = new RocketMotion(); // Roket hareketleri için nesne
        this.currentTarget = null; // Mevcut hedef

        this.createRocket(); // Roket modeli oluştur
        this.createTrail(); // İz oluştur

        console.log(`🚀 Roket ${this.index}: Başlangıç yakıtı ${this.fuel} L`);
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

        const material = new THREE.MeshPhongMaterial({
            color: 0xff0000,
            shininess: 50,
        });

        this.mesh = new THREE.Mesh(geometry, material);
    }

    /**
     * 🌟 Roketin izini oluşturur.
     */
    createTrail() {
        const trailGeometry = new THREE.BufferGeometry();
        const trailMaterial = new THREE.LineBasicMaterial({
            color: 0x00ff00,
            opacity: 0.5,
            transparent: true,
        });

        this.trail = {
            line: new THREE.Line(trailGeometry, trailMaterial),
            positions: [],
        };
    }

    /**
 * 🚀 Optimize edilmiş rotayı takip eder.
 * @param {Array} route - Optimize edilmiş rota dizisi.
 */
followOptimizedRoute(route) {
    if (!Array.isArray(route) || route.length === 0) {
        console.warn(`⚠️ Roket ${this.index}: Geçersiz rota verisi.`);
        return;
    }

    this.optimizedRoute = route;
    this.currentTargetIndex = 0;
    console.log(
        `🚀 Roket ${this.index}: Optimize rota belirlendi → ${route.map(node => node.name || 'N/A').join(' → ')}`
    );
}

    /**
     * 🎯 Belirli bir uyduya hareket eder.
     * @param {Object} target - Hedef uydu nesnesi
     */
    moveToSatellite(target) {
        if (!this.alive || !target) return;

        this.currentTarget = target;
        this.motion.planPath(this, target);

        console.log(`🚀 Roket ${this.index}: ${this.currentTarget.name} hedefine hareket ediyor.`);
    }

    /**
     * 🔄 Roketin güncelleme döngüsü.
     * @param {number} deltaTime - Zaman aralığı
     */
    update(deltaTime) {
        if (this.checkFuelForReturn()) return;
    
        if (!this.alive || !this.motion.currentPath) return;
    
        const completed = this.motion.updatePosition(this, deltaTime);
        this.consumeFuel(deltaTime);
    
        if (completed) {
            console.log(`🏁 Roket ${this.index}: ${this.currentTarget?.name} hedefine ulaştı.`);
            this.motion.reset();
        }
    
        this.updateTrail();
        this.updateInfo();
    }
    
    /**
     * 📊 Anlık Bilgi Güncelle
     */
    updateInfo() {
        const infoPanel = document.getElementById('route');
        if (infoPanel) {
            infoPanel.innerHTML = `
                <h4>Roket ${this.index}:</h4>
                🚀 Konum: (${this.mesh.position.x.toFixed(2)}, ${this.mesh.position.y.toFixed(2)}, ${this.mesh.position.z.toFixed(2)})
                <br>⛽ Yakıt: ${this.fuel.toFixed(2)} L
            `;
        }
    }
    

    /**
     * ⛽ Yakıt tüketimini işler.
     * @param {number} deltaTime - Zaman aralığı
     */
    consumeFuel(deltaTime) {
        const distanceTravelled = this.motion?.distance || 0;
        const fuelToConsume = distanceTravelled * CONSTANTS.FUEL_CONSUMPTION_RATE;

        if (this.fuel <= fuelToConsume + this.calculateRequiredFuelToMoon()) {
            console.warn(`⚠️ Roket ${this.index}: Yakıt kritik seviyede, Ay'a dönüş gerekiyor.`);
            this.returnToMoon();
            return;
        }

        this.fuel -= fuelToConsume;
        console.log(
            `⛽ Roket ${this.index}: Tüketilen Yakıt: ${fuelToConsume.toFixed(2)} L, Kalan Yakıt: ${this.fuel.toFixed(2)} L`
        );
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
        this.currentTarget = null;
        this.alive = true;

        console.log(`🔄 Roket ${this.index} sıfırlandı ve başlangıç konumuna döndü.`);
    }
    


    consumeFuel(deltaTime) {
        const fuelToConsume = CONSTANTS.FUEL_CONSUMPTION_RATE * deltaTime;
    
        if (this.fuel <= fuelToConsume) {
            this.fuel = 0;
            this.alive = false;
            console.warn(`❌ Roket ${this.index}: Yakıt tamamen bitti.`);
            return;
        }
    
        this.fuel -= fuelToConsume;
        console.log(`⛽ Roket ${this.index}: Yakıt Tüketildi: ${fuelToConsume.toFixed(2)} L, Kalan Yakıt: ${this.fuel.toFixed(2)} L`);
    }
    
    calculateRequiredFuelToMoon() {
        // Ay'a dönüş mesafesi ve yakıt tüketimi hesaplaması
        const distanceToMoon = CONSTANTS.MOON_ORBIT_RADIUS;
        return distanceToMoon * CONSTANTS.FUEL_CONSUMPTION_RATE;
    }
    
    returnToMoon() {
        if (this.currentTarget?.name === 'Moon') {
            console.log(`🌑 Roket ${this.index}: Zaten Ay'a dönüyor.`);
            return;
        }
    
        this.motion.planPath(this, {
            mesh: { position: new THREE.Vector3(0, 0, CONSTANTS.MOON_ORBIT_RADIUS) },
        });
        this.currentTarget = { name: 'Moon' };
        console.log(`🚀 Roket ${this.index}: Ay'a dönüş başlatıldı.`);
    }



checkFuelForReturn() {
    const requiredFuelToMoon = this.calculateRequiredFuelToMoon();

    if (this.fuel <= requiredFuelToMoon && this.currentTarget?.name !== 'Moon') {
        console.warn(`🚨 Roket ${this.index}: Yakıt kritik seviyede, Ay'a dönüş başlatılıyor.`);
        this.returnToMoon();
        return true;
    }

    if (this.currentTarget?.name === 'Moon') {
        console.log(`🌑 Roket ${this.index}: Zaten Ay'a dönüyor.`);
        return true;
    }

    return false;
}



}

export default Rocket;
