class Moon {
    constructor() {
        const geometry = new THREE.SphereGeometry(CONSTANTS.MOON_RADIUS*4, 128, 128);
        const material = new THREE.MeshPhongMaterial({
            map: new THREE.TextureLoader().load('textures/moon_texture.png'),
            shininess: 500,
        });

        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.set(CONSTANTS.MOON_ORBIT_RADIUS, 0, 0);

        this.rotationSpeed = (2 * Math.PI) / (CONSTANTS.MOON_ROTATION_PERIOD * 24 * 60 * 60); // Gerçekçi dönüş hızı
    }

    update(deltaTime) {
        // Ay, 27 günde bir tur tamamlamalı
        this.angle += this.orbitSpeed; // Update orbit position
        const x = CONSTANTS.MOON_ORBIT_RADIUS * Math.cos(this.angle);
        const z = CONSTANTS.MOON_ORBIT_RADIUS * Math.sin(this.angle);
        this.mesh.position.set(x, 0, z);
        this.mesh.rotation.y += (2 * Math.PI / CONSTANTS.MOON_ROTATION_PERIOD) * deltaTime;
    }
    

    getLaunchPosition() {
        return new THREE.Vector3(
            CONSTANTS.MOON_RADIUS * 0.8,
            0,
            CONSTANTS.MOON_RADIUS * 0.5
        );
    }
 

    reset() {
        // Ay başlangıç pozisyonuna döner
        this.mesh.position.set(CONSTANTS.MOON_ORBIT_RADIUS, 0, 0);
        this.angle = 0;
        console.log('Ay sıfırlandı ve başlangıç pozisyonuna döndü.');
    }
    
}
