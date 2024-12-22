class Rocket {
    constructor() {
        this.createRocket();
        this.createTrail();
        this.currentTargetIndex = 0;
        this.fuel = CONSTANTS.MAX_FUEL;
        this.motion = new RocketMotion();
        const geometry = new THREE.CylinderGeometry(
            CONSTANTS.EARTH_RADIUS * 0.04, 
            CONSTANTS.EARTH_RADIUS * 0.02, 
            CONSTANTS.EARTH_RADIUS * 0.1, 
            32
        );
    
        const textureLoader = new THREE.TextureLoader();
        const rocketTexture = textureLoader.load('textures/rocket/rocket_texture.jpg'); // Gerçekçi roket dokusu
    
        const material = new THREE.MeshPhongMaterial({
            map: rocketTexture,
            shininess: 50,
            emissive: 0x111111
        });
    
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.set(CONSTANTS.MOON_ORBIT_RADIUS, 0, 0);
    
        // Roket uç kısmı
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

    update(satellites, deltaTime) {
        // Ay'a dönüş için gereken yakıt miktarını kontrol et
        const requiredFuelToMoon = this.calculateRequiredFuelToMoon();
    
        if (this.fuel <= requiredFuelToMoon) {
            console.warn('Ay\'a dönüş için yeterli yakıt seviyesi kritik, uydulara yakıt aktarımı durduruldu.');
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
    
        const completed = this.motion.updatePosition(this, deltaTime);
        this.consumeFuel(deltaTime, requiredFuelToMoon);
    
        if (completed && currentTarget.fuel < 100) {
            this.refuelSatellite(currentTarget);
            this.currentTargetIndex++;
            this.motion.reset();
        }
    
        this.updateTrail();
    }
    
    
    consumeFuel(deltaTime) {
        const currentPosition = this.mesh.position.clone();
    
        // Önceki pozisyonu yoksa başlat
        if (!this.previousPosition) {
            this.previousPosition = currentPosition;
            return;
        }
    
        // Alınan mesafeyi hesapla
        const distanceTravelled = currentPosition.distanceTo(this.previousPosition);
    
        // Mesafeye dayalı yakıt tüketimi
        const fuelToConsume = distanceTravelled * CONSTANTS.FUEL_CONSUMPTION_RATE;
    
        if (this.fuel - fuelToConsume < this.calculateRequiredFuelToMoon()) {
            console.warn('Yakıt kritik seviyede, Ay\'a dönüş başlatılıyor.');
            return;
        }
    
        this.fuel -= fuelToConsume;
    
        // Mevcut pozisyonu bir sonraki hesaplama için kaydet
        this.previousPosition = currentPosition;
    
        console.log(`Yakıt Tüketildi: ${fuelToConsume.toFixed(2)}. Kalan Yakıt: ${this.fuel.toFixed(2)}`);
    }
    
    
/*
    consumeFuel(deltaTime) {
        const distanceTravelled = deltaTime * CONSTANTS.ROCKET_SPEED;
    
        const fuelToConsume = distanceTravelled * CONSTANTS.FUEL_CONSUMPTION_RATE;
        if (this.fuel - fuelToConsume < this.calculateRequiredFuelToMoon()) {
            console.warn('Yakıt kritik seviyede, tüketim sınırlandırıldı.');
            return;
        }
    
        this.fuel -= fuelToConsume;
        console.log(`Yakıt Tüketildi: ${fuelToConsume.toFixed(2)}, Kalan Yakıt: ${this.fuel.toFixed(2)}`);
    }
    */
    refuelSatellite(satellite) {
        const requiredFuel = 100 - satellite.fuel;
        const fuelToTransfer = Math.min(requiredFuel, CONSTANTS.FUEL_TRANSFER_RATE, this.fuel - this.calculateRequiredFuelToMoon());
    
        if (fuelToTransfer <= 0) {
            console.warn('Ay\'a dönüş için yeterli yakıt sağlanamadığından yakıt aktarımı durduruldu.');
            return;
        }
    
        satellite.fuel += fuelToTransfer;
        this.fuel -= fuelToTransfer;
    
        console.log(`Uyduya ${fuelToTransfer.toFixed(2)} yakıt transfer edildi. Roket kalan yakıt: ${this.fuel.toFixed(2)}`);
    }
    
    calculateRequiredFuelToMoon() {
        // Ay'a dönüş için gereken yakıt miktarı
        const distanceToMoon = CONSTANTS.MOON_ORBIT_RADIUS;
        return (distanceToMoon / CONSTANTS.ROCKET_SPEED) * CONSTANTS.FUEL_CONSUMPTION_RATE * 1.5; // Güvenlik faktörü
    }
    
    
    
    followOptimizedRoute(route) {
        this.optimizedRoute = route;
        this.currentTargetIndex = 0;
    }



    returnToMoon(deltaTime) {
        if (!this.motion.currentPath) {
            this.motion.planPath(this, {
                mesh: { position: new THREE.Vector3(CONSTANTS.MOON_ORBIT_RADIUS, 0, 0) }
            });
        }
    
        const completed = this.motion.updatePosition(this, deltaTime);
        this.consumeFuel(deltaTime);
    
        if (completed) {
            this.fuel = CONSTANTS.MAX_FUEL; // Ay'da yakıt doldur
            this.motion.reset();
            console.log('Roket Ay\'a ulaştı ve yakıtı tamamen dolduruldu.');
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

    reset() {
        // Roket başlangıç pozisyonuna döner
        this.mesh.position.set(CONSTANTS.MOON_ORBIT_RADIUS, 0, 0);
        this.motion.reset();
        this.fuel = CONSTANTS.MAX_FUEL;
        console.log('Roket sıfırlandı ve başlangıç pozisyonuna döndü.');
    }
    
    planPath(rocket, targetSatellite) {
        const startPos = rocket.getPosition();
        const targetPos = targetSatellite.mesh.position;
    
        this.currentPath = {
            start: startPos.clone(),
            current: startPos.clone(),
            target: targetPos.clone(),
            startTime: Date.now(),
            phase: 'transfer' // transfer veya approach
        };
    
        this.targetSatellite = targetSatellite;
        this.progress = 0;
    
        // Yörünge parametreleri
        const distance = startPos.distanceTo(targetPos);
        const midPoint = new THREE.Vector3().addVectors(startPos, targetPos).multiplyScalar(0.5);
    
        // Dünya merkezinden uzak bir noktada ara nokta oluştur
        const normal = new THREE.Vector3().subVectors(startPos, targetPos).normalize();
        const orbitHeight = CONSTANTS.GEO_ORBIT_RADIUS * 0.5; // Yörünge yüksekliği
    
        midPoint.add(normal.multiplyScalar(orbitHeight));
    
        this.orbitParams = {
            midPoint: midPoint,
            heightOffset: orbitHeight,
            distance: distance
        };
    }
    
    calculateOrbitPosition(start, end, progress) {
        // Dünya içinden geçmeyi engellemek için yörünge noktalarını ayarla
        const midPoint = this.orbitParams.midPoint;
        const heightOffset = this.orbitParams.heightOffset;
    
        // Bezier eğrisi kullanarak yörünge hareketi
        const p0 = start;
        const p1 = midPoint;
        const p2 = end;
    
        const position = new THREE.Vector3();
        position.x = this.quadraticBezier(p0.x, p1.x, p2.x, progress);
        position.y = this.quadraticBezier(p0.y, p1.y, p2.y, progress);
        position.z = this.quadraticBezier(p0.z, p1.z, p2.z, progress);
    
        return position;
    }
}