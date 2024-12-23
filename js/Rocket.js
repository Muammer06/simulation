
class Rocket {
    constructor() {
        this.createRocket();
        this.createTrail();
        this.currentTargetIndex = 0;
        this.fuel = CONSTANTS.MAX_FUEL;
        this.motion = new RocketMotion();
        this.optimizedRoute = [];
        this.previousPosition = null;

        this.mesh.position.set(CONSTANTS.MOON_ORBIT_RADIUS, 0, 0); // Roket başlangıç konumu Ay
    }

    /**
     * Roket modelini oluşturur.
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
     * Roketin izini oluşturur.
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
     * Roketi günceller ve hedefe hareket ettirir.
     */
    update(satellites, deltaTime) {
        const requiredFuelToMoon = this.calculateRequiredFuelToMoon();

        if (this.fuel <= requiredFuelToMoon) {
            console.warn('Yakıt kritik seviyede, Ay\'a dönüş başlatılıyor.');
            this.returnToMoon(deltaTime);
            return;
        }

        if (this.currentTargetIndex >= satellites.length) {
            console.log("Tüm uydular ziyaret edildi.");
            return;
        }

        const currentTarget = satellites[this.currentTargetIndex];

        if (!this.motion.currentPath) {
            this.motion.planPath(this, currentTarget);
        }

        const completed = this.motion.updatePosition(this, deltaTime); // HATA BURADAYDI
        this.consumeFuel(deltaTime);

        if (completed && currentTarget.fuel < 100) {
            this.refuelSatellite(currentTarget);
            this.currentTargetIndex++;
            this.motion.reset();
        }

        this.updateTrail();
    }

    /**
     * Yakıt tüketimini hesaplar ve uygular.
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
     * Uyduya yakıt aktarır.
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


    getPosition() {
        return this.mesh.position.clone();
    }
    

    /**
     * Ay'a dönüş için gerekli yakıtı hesaplar.
     */
    calculateRequiredFuelToMoon() {
        const distanceToMoon = CONSTANTS.MOON_ORBIT_RADIUS;
        return (distanceToMoon / CONSTANTS.ROCKET_SPEED) * CONSTANTS.FUEL_CONSUMPTION_RATE * 1.5;
    }

    /**
     * Optimize rota takibini başlatır.
     */
    followOptimizedRoute(route) {
        this.optimizedRoute = route;
        this.currentTargetIndex = 0;
    }

    /**
     * Ay'a dönüşü gerçekleştirir ve yakıt doldurur.
     */
    returnToMoon(deltaTime) {
        if (!this.motion.currentPath) {
            this.motion.planPath(this, {
                mesh: { position: new THREE.Vector3(CONSTANTS.MOON_ORBIT_RADIUS, 0, 0) }
            });
        }

        const completed = this.motion.updatePosition(this, deltaTime);
        this.consumeFuel(deltaTime);

        if (completed) {
            this.fuel = CONSTANTS.MAX_FUEL;
            this.motion.reset();
            console.log('Roket Ay\'a ulaştı ve yakıt dolduruldu.');
        }

        this.updateTrail();
    }

    /**
     * Roket izini günceller.
     */
    updateTrail() {
        this.trail.positions.push(this.mesh.position.clone());
        if (this.trail.positions.length > CONSTANTS.MAX_TRAIL_LENGTH) {
            this.trail.positions.shift();
        }
        this.trail.line.geometry.setFromPoints(this.trail.positions);
    }

    /**
     * Roketi sıfırlar.
     */
    reset() {
        this.mesh.position.set(CONSTANTS.MOON_ORBIT_RADIUS, 0, 0);
        this.motion.reset();
        this.fuel = CONSTANTS.MAX_FUEL;
        this.previousPosition = null;
        console.log('Roket sıfırlandı ve başlangıç konumuna döndü.');
    }
}
