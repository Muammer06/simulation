class Rocket {
    constructor() {
        this.createRocket();
        this.createTrail();
        this.currentTargetIndex = 0;
        this.fuel = CONSTANTS.MAX_FUEL;
        this.motion = new RocketMotion();
    }

    createRocket() {
        const geometry = new THREE.ConeGeometry(
            CONSTANTS.EARTH_RADIUS * 0.08,
            CONSTANTS.EARTH_RADIUS * 0.2,
            8
        );
        
        const material = new THREE.MeshPhongMaterial({
            color: 0x00ff00,
            emissive: 0x002200,
            shininess: 300
        });
        
        this.mesh = new THREE.Mesh(geometry, material);
        // Roketi Ay'ın pozisyonuna yerleştir
        this.mesh.position.set(CONSTANTS.MOON_ORBIT_RADIUS, 0, 0);
    }

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

    update(satellites) {
        if (this.fuel <= 0) {
            this.returnToMoon(); // Yakıt biterse Ay'a dön
            return;
        }
    
        if (this.currentTargetIndex >= satellites.length) {
            console.log("Tüm uydular ziyaret edildi.");
            return; // Tüm uydular ziyaret edildiyse dur
        }
    
        const currentTarget = satellites[this.currentTargetIndex];
    
        // Hedefe doğru ilerle
        if (!this.motion.currentPath) {
            this.motion.planPath(this, currentTarget);
        }
    
        const completed = this.motion.updatePosition(this);
        this.consumeFuel(); // Hareket sırasında yakıt tüketimi
    
        if (completed && currentTarget.fuel < 100) {
            this.refuelSatellite(currentTarget); // Hedef uyduya yakıt aktar
            this.currentTargetIndex++;
            this.motion.reset();
        }
    
        this.updateTrail(); // İz güncellemesi
    }

    refuelSatellite(satellite) {
        const requiredFuel = 100 - satellite.fuel;
        const fuelToTransfer = Math.min(requiredFuel, CONSTANTS.FUEL_TRANSFER_RATE, this.fuel);
        satellite.fuel += fuelToTransfer;
        this.fuel -= fuelToTransfer;
        console.log(`Uyduya ${fuelToTransfer} yakıt transfer edildi.`);
    }
    
    consumeFuel() {
        this.fuel -= CONSTANTS.FUEL_CONSUMPTION_RATE;
        if (this.fuel < 0) this.fuel = 0;
        console.log(`Roket yakıtı: ${this.fuel.toFixed(2)}`);
    }
    

    returnToMoon() {
        if (!this.motion.currentPath) {
            this.motion.planPath(this, { 
                mesh: { position: new THREE.Vector3(CONSTANTS.MOON_ORBIT_RADIUS, 0, 0) }
            });
        }
    
        const completed = this.motion.updatePosition(this);
        this.consumeFuel();
    
        if (completed) {
            this.fuel = CONSTANTS.MAX_FUEL; // Ay'da yakıt doldur
            this.motion.reset();
            console.log("Roket Ay'a ulaştı ve yakıtı doldurdu.");
        }
    
        this.updateTrail();
    }
    

    updateTrail() {
        // Roketin izini güncelle
        this.trail.positions.push(this.mesh.position.clone());
        if (this.trail.positions.length > CONSTANTS.MAX_TRAIL_LENGTH) {
            this.trail.positions.shift(); // Eski izleri kaldır
        }
        this.trail.line.geometry.setFromPoints(this.trail.positions);
    }

    getPosition() {
        return this.mesh.position;
    }
}