class Moon {
    constructor() {
        const geometry = new THREE.SphereGeometry(CONSTANTS.MOON_RADIUS * 5.5, 64, 64); // Moon geometry

        const textureLoader = new THREE.TextureLoader();
        const moonTexture = textureLoader.load('textures/moon_texture.png'); // Load the moon texture

        const material = new THREE.MeshPhongMaterial({
            map: moonTexture, // Apply the texture to the moon
            shininess: 100, // Reduce shininess for a matte look
        });

        this.mesh = new THREE.Mesh(geometry, material);

        // Moon orbit and rotation setup
        this.angle = 0; // Initial orbit angle
        this.rotationSpeed = 0.001; // Rotation speed
        this.orbitSpeed = 0.0005; // Orbit speed

        this.updatePosition();
    }

    updatePosition() {
        this.angle += this.orbitSpeed; // Update orbit position
        const x = CONSTANTS.MOON_ORBIT_RADIUS * Math.cos(this.angle);
        const z = CONSTANTS.MOON_ORBIT_RADIUS * Math.sin(this.angle);
        this.mesh.position.set(x, 0, z);

        // Rotate the moon
        this.mesh.rotation.y += this.rotationSpeed;
    }
}
