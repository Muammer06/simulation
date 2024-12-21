class Satellite {
    constructor(index) {
        this.createSatellite(index);
        this.createTrail();
        this.fuel = 100; // Başlangıç yakıt seviyesi
    }

    createSatellite(index) {
        const geometry = new THREE.SphereGeometry(CONSTANTS.EARTH_RADIUS * 0.05, 8, 8);
        const material = new THREE.MeshPhongMaterial({
            color: new THREE.Color().setHSL(index / CONSTANTS.NUM_SATELLITES, 1, 0.5),
            shininess: 30
        });
        this.mesh = new THREE.Mesh(geometry, material);
        
        this.mesh.userData = {
            inclination: Math.random() * Math.PI,
            ascendingNode: (2 * Math.PI * index) / CONSTANTS.NUM_SATELLITES,
            angle: Math.random() * Math.PI * 2
        };
    }

    createTrail() {
        const trailGeometry = new THREE.BufferGeometry();
        const trailMaterial = new THREE.LineBasicMaterial({
            color: this.mesh.material.color,
            opacity: 0.5,
            transparent: true
        });
        this.trail = {
            line: new THREE.Line(trailGeometry, trailMaterial),
            positions: []
        };
    }

    update() {
        if (this.fuel > 0) {
            const userData = this.mesh.userData;
            userData.angle += 0.001 * CONSTANTS.SIMULATION_SPEED;
            
            const position = this.calculatePosition(userData);
            this.mesh.position.copy(position);
            
            this.updateTrail(position);
            this.consumeFuel();
        }
    }

    consumeFuel() {
        this.fuel -= CONSTANTS.SATELLITE_FUEL_CONSUMPTION_RATE;
        if (this.fuel < 0) this.fuel = 0;
    }
    
    calculatePosition(userData) {
        // Kepler yörünge elemanlarını kullan
        const x = CONSTANTS.GEO_ORBIT_RADIUS * (
            Math.cos(userData.ascendingNode) * Math.cos(userData.angle) -
            Math.sin(userData.ascendingNode) * Math.sin(userData.angle) * 
            Math.cos(userData.inclination)
        );
        
        const y = CONSTANTS.GEO_ORBIT_RADIUS * (
            Math.sin(userData.ascendingNode) * Math.cos(userData.angle) +
            Math.cos(userData.ascendingNode) * Math.sin(userData.angle) * 
            Math.cos(userData.inclination)
        );
        
        const z = CONSTANTS.GEO_ORBIT_RADIUS * (
            Math.sin(userData.angle) * Math.sin(userData.inclination)
        );
    
        return new THREE.Vector3(x, y, z);
    }

    updateTrail(position) {
        this.trail.positions.push(position.clone());
        if (this.trail.positions.length > CONSTANTS.MAX_TRAIL_LENGTH) {
            this.trail.positions.shift();
        }
        this.trail.line.geometry.setFromPoints(this.trail.positions);
    }
}