import { CONSTANTS } from './constants.js';  // <-- Dizininize uygun yol
import * as THREE from 'three';


class Satellite {
    constructor(index) {
        const geometry = new THREE.SphereGeometry(CONSTANTS.EARTH_RADIUS * 0.05, 16, 16);
        const material = new THREE.MeshPhongMaterial({ color: 0xff0000 });
        this.mesh = new THREE.Mesh(geometry, material);

        this.fuel = 100;
        this.age = 0;
        this.lifetime = Math.random() * (10 - 3) + 3;
        this.name = `Uydu ${index + 1}`;
        this.visited = false; // Ziyaret edildi mi?

        this.position = new THREE.Vector3();
        this.setInitialPosition(index);
        this.createTrail();
    }
    visit() {
        this.visited = true;
        console.log(`${this.name} ziyaret edildi.`);
    }
    
    setInitialPosition(index) {
        const angle = (2 * Math.PI * index) / CONSTANTS.NUM_SATELLITES;
        this.position.set(
            CONSTANTS.GEO_ORBIT_RADIUS * Math.cos(angle),
            0,
            CONSTANTS.GEO_ORBIT_RADIUS * Math.sin(angle)
        );
        this.mesh.position.copy(this.position);
    }

    simulateMovement(simulationTime) {
        const orbitSpeed = (2 * Math.PI) / CONSTANTS.SATELLITE_ORBIT_PERIOD;
        const angle = orbitSpeed * simulationTime;

        this.position.x = CONSTANTS.GEO_ORBIT_RADIUS * Math.cos(angle);
        this.position.z = CONSTANTS.GEO_ORBIT_RADIUS * Math.sin(angle);
        this.mesh.position.copy(this.position);
    }
    createTrail() {
        this.trail = {
            line: new THREE.Line(
                new THREE.BufferGeometry(),
                new THREE.LineBasicMaterial({
                    color: 0x0000ff,
                    opacity: 0.5,
                    transparent: true
                })
            ),
            positions: []
        };
    }

    update(deltaTime) {
        const orbitSpeed = (2 * Math.PI) / CONSTANTS.SATELLITE_ORBIT_PERIOD;
        const angle = orbitSpeed * (this.age + deltaTime);
    
        this.mesh.position.x = CONSTANTS.GEO_ORBIT_RADIUS * Math.cos(angle);
        this.mesh.position.z = CONSTANTS.GEO_ORBIT_RADIUS * Math.sin(angle);
    
        this.age += deltaTime / CONSTANTS.SECONDS_IN_A_DAY;
    }
    
    

    getRemainingLifetime() {
        return Math.max(this.lifetime - this.age, 0);
    }

    
    
}

export default Satellite;   