class Earth {
    constructor() {
        const geometry = new THREE.SphereGeometry(CONSTANTS.EARTH_RADIUS * 1.5, 64, 64); // Daha detaylı yüzey

        const textureLoader = new THREE.TextureLoader();
        const earthTexture = textureLoader.load('textures/earth_texture.jpg'); // Yüzey dokusu
        const normalMap = textureLoader.load('textures/earth_normal.jpg'); // Yüzey detayları
        const specularMap = textureLoader.load('textures/earth_specular.png'); // Yansıma haritası

        const material = new THREE.MeshPhongMaterial({
            map: earthTexture, // Yüzey dokusu
            normalMap: normalMap, // Yüzey detayları
            shininess: 20, // Hafif parlaklık
            specularMap: specularMap, // Yansıma haritası (opsiyonel)
            specular: new THREE.Color(0x333333) // Hafif parlaklık tonu
        });

        this.mesh = new THREE.Mesh(geometry, material);
    }

    rotate() {
        this.mesh.rotation.y += 0.001 * CONSTANTS.SIMULATION_SPEED; // Dünya dönüş hızı
    }
}
