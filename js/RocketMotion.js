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

        // Yörünge parametrelerini hesapla
        const distance = startPos.distanceTo(targetPos);
        const midPoint = new THREE.Vector3().addVectors(startPos, targetPos).multiplyScalar(0.5);
        const heightOffset = distance * 0.2; // Yörünge yüksekliği

        this.orbitParams = {
            midPoint: midPoint,
            heightOffset: heightOffset,
            distance: distance
        };
    }

    // Roketi hareket ettir
    updatePosition(rocket) {
        if (!this.currentPath) return false;

        const currentTime = Date.now();
        const elapsedTime = (currentTime - this.currentPath.startTime) / 1000;

        // Hedef uydunun güncel pozisyonunu al
        const currentTargetPos = this.targetSatellite.mesh.position.clone();
        this.currentPath.target.copy(currentTargetPos);

        // İlerlemeyi güncelle
        this.progress += this.speed;
        
        if (this.progress >= 1) {
            return true; // Hareket tamamlandı
        }

        // Yörünge hareketi hesapla
        const newPosition = this.calculateOrbitPosition(
            this.currentPath.start,
            currentTargetPos,
            this.progress
        );

        // Pozisyonu güncelle
        rocket.mesh.position.copy(newPosition);
        this.currentPath.current.copy(newPosition);

        // Roketi yönlendir
        this.updateRocketOrientation(rocket, currentTargetPos);

        return false; // Hareket devam ediyor
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