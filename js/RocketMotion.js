// RocketMotion.js
class RocketMotion {
    constructor() {
        this.currentPath = null;
        this.targetSatellite = null;
        this.progress = 0;
        this.orbitRadius = CONSTANTS.GEO_ORBIT_RADIUS;
        this.speed = 0.002; // Hareket hızı
    }

    // Yeni bir yol planla
    planPath(rocket, targetSatellite) {
        if (!rocket || !targetSatellite || !targetSatellite.mesh) {
            console.warn('Rota planlama başarısız: Roket veya hedef uydu geçersiz.');
            return;
        }
    
        const startPos = rocket.getPosition();
        const targetPos = targetSatellite.mesh.position;
    
        const earthCenter = new THREE.Vector3(0, 0, 0);
        const orbitHeight = CONSTANTS.GEO_ORBIT_RADIUS * 1.1;
    
        const startDirection = startPos.clone().sub(earthCenter).normalize();
        const targetDirection = targetPos.clone().sub(earthCenter).normalize();
    
        const midPoint = new THREE.Vector3().addVectors(
            startDirection.multiplyScalar(orbitHeight),
            targetDirection.multiplyScalar(orbitHeight)
        ).multiplyScalar(0.5);
    
        this.currentPath = {
            start: startPos.clone(),
            midPoint: midPoint,
            target: targetPos.clone(),
            phase: 'transfer'
        };
    
        this.progress = 0;
    }
    
    updatePosition(rocket, deltaTime) {
        if (!this.currentPath || !this.currentPath.start || !this.currentPath.midPoint || !this.currentPath.target) {
            console.warn('Geçersiz rota parametreleri, hareket durduruldu.');
            this.currentPath = null;
            return false;
        }
    
        // Hız faktörünü deltaTime ile sınırla
        const step = CONSTANTS.ROCKET_SPEED * deltaTime;
        const totalDistance = this.currentPath.start.distanceTo(this.currentPath.target);
        this.progress += step / totalDistance;
    
        // İlerleme sınırlandırılması
        if (this.progress > 1) {
            this.progress = 1;
        }
    
        if (this.progress < 0.5) {
            // İlk etap: Başlangıçtan ara noktaya
            rocket.mesh.position.lerpVectors(
                this.currentPath.start,
                this.currentPath.midPoint,
                this.progress * 2
            );
        } else if (this.progress <= 1) {
            // İkinci etap: Ara noktadan hedefe
            rocket.mesh.position.lerpVectors(
                this.currentPath.midPoint,
                this.currentPath.target,
                (this.progress - 0.5) * 2
            );
        }
    
        // Hedefe ulaşıldı
        if (this.progress >= 1) {
            rocket.mesh.position.copy(this.currentPath.target);
            this.currentPath = null;
            this.progress = 0;
            return true;
        }
    
        return false;
    }
    
    

    calculateOrbitPosition(start, end, progress) {
        // Bezier eğrisi kullanarak yörünge hesapla
        const midPoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
        const up = new THREE.Vector3(0, 0, 1);
        
        // Yörünge yüksekliği için sinüs fonksiyonu kullan
        const heightOffset = Math.sin(progress * Math.PI) * this.orbitParams.heightOffset;
        midPoint.add(up.multiplyScalar(heightOffset));

        // Quadratic Bezier eğrisi
        const p0 = start;
        const p1 = midPoint;
        const p2 = end;

        const position = new THREE.Vector3();
        
        // Bezier interpolasyonu
        position.x = this.quadraticBezier(p0.x, p1.x, p2.x, progress);
        position.y = this.quadraticBezier(p0.y, p1.y, p2.y, progress);
        position.z = this.quadraticBezier(p0.z, p1.z, p2.z, progress);

        return position;
    }

    quadraticBezier(p0, p1, p2, t) {
        const oneMinusT = 1 - t;
        return oneMinusT * oneMinusT * p0 + 
               2 * oneMinusT * t * p1 + 
               t * t * p2;
    }

    updateRocketOrientation(rocket, targetPos) {
        const direction = new THREE.Vector3()
            .subVectors(targetPos, rocket.mesh.position)
            .normalize();

        if (direction.length() > 0.001) {
            rocket.mesh.quaternion.setFromUnitVectors(
                new THREE.Vector3(0, 1, 0),
                direction
            );
        }
    }

    getProgress() {
        return this.progress;
    }

    reset() {
        this.currentPath = null;
        this.targetSatellite = null;
        this.progress = 0;
    }
}