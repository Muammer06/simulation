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
        if (this.currentTargetIndex >= satellites.length) {
            return;
        }

        const currentTarget = satellites[this.currentTargetIndex];

        // Yeni hedef için yol planla
        if (!this.motion.currentPath) {
            this.motion.planPath(this, currentTarget);
        }

        // Hareketi güncelle
        const completed = this.motion.updatePosition(this);
        if (completed) {
            this.currentTargetIndex++;
            this.motion.reset();
        }

        // İzi güncelle
        this.updateTrail();
    }

    updateTrail() {
        this.trail.positions.push(this.mesh.position.clone());
        if (this.trail.positions.length > 50) {
            this.trail.positions.shift();
        }
        this.trail.line.geometry.setFromPoints(this.trail.positions);
    }

    getPosition() {
        return this.mesh.position;
    }
}