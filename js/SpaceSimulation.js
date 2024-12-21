class SpaceSimulation {
    constructor() {
        // Sabitler
        this.EARTH_RADIUS = 6371;
        this.GEO_ALTITUDE = 35786;
        this.GEO_ORBIT_RADIUS = this.EARTH_RADIUS + this.GEO_ALTITUDE;
        this.MOON_ORBIT_RADIUS = 384400;
        this.NUM_SATELLITES = 30;
        
        // Three.js bileşenleri
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;

        // Nesneler
        this.earth = null;
        this.satellites = [];
        this.satelliteTrails = [];

        this.init();
        this.createObjects();
        this.animate();
    }

    init() {
        // Scene oluştur
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x000000);

        // Camera oluştur
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            1,
            this.MOON_ORBIT_RADIUS * 2
        );
        this.camera.position.z = this.GEO_ORBIT_RADIUS * 2;

        // Renderer oluştur
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.getElementById('container').appendChild(this.renderer.domElement);

        // Işıklandırma
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);
        
        const pointLight = new THREE.PointLight(0xffffff, 1);
        pointLight.position.set(0, 0, this.GEO_ORBIT_RADIUS);
        this.scene.add(pointLight);

        // Kontroller
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        
        // Pencere yeniden boyutlandırma
        window.addEventListener('resize', this.onWindowResize.bind(this), false);
    }

    createObjects() {
        // Dünya
        const earthGeometry = new THREE.SphereGeometry(this.EARTH_RADIUS, 32, 32);
        const earthMaterial = new THREE.MeshPhongMaterial({
            color: 0x2233ff,
            emissive: 0x112244,
            shininess: 25
        });
        this.earth = new THREE.Mesh(earthGeometry, earthMaterial);
        this.scene.add(this.earth);

        // Uydular
        for (let i = 0; i < this.NUM_SATELLITES; i++) {
            this.createSatellite(i);
        }
    }

    createSatellite(index) {
        // Uydu geometrisi
        const satGeometry = new THREE.SphereGeometry(this.EARTH_RADIUS * 0.02, 8, 8);
        const satMaterial = new THREE.MeshPhongMaterial({
            color: new THREE.Color().setHSL(index / this.NUM_SATELLITES, 1, 0.5),
            shininess: 30
        });
        const satellite = new THREE.Mesh(satGeometry, satMaterial);

        // Uydu parametreleri
        satellite.userData = {
            inclination: Math.random() * Math.PI,
            ascendingNode: (2 * Math.PI * index) / this.NUM_SATELLITES,
            angle: Math.random() * Math.PI * 2
        };

        this.satellites.push(satellite);
        this.scene.add(satellite);

        // Uydu izi
        const trailGeometry = new THREE.BufferGeometry();
        const trailMaterial = new THREE.LineBasicMaterial({
            color: satMaterial.color,
            opacity: 0.5,
            transparent: true
        });
        const trail = new THREE.Line(trailGeometry, trailMaterial);
        this.satelliteTrails.push({
            line: trail,
            positions: []
        });
        this.scene.add(trail);
    }

    updateSatellitePositions(time) {
        this.satellites.forEach((satellite, index) => {
            const userData = satellite.userData;
            userData.angle += 0.001;

            const position = this.calculateSatellitePosition(userData);
            satellite.position.copy(position);

            // İz güncelle
            const trail = this.satelliteTrails[index];
            trail.positions.push(position.clone());
            if (trail.positions.length > 50) {
                trail.positions.shift();
            }
            trail.line.geometry.setFromPoints(trail.positions);
        });
    }

    calculateSatellitePosition(userData) {
        const x = this.GEO_ORBIT_RADIUS * (
            Math.cos(userData.ascendingNode) * Math.cos(userData.angle) -
            Math.sin(userData.ascendingNode) * Math.sin(userData.angle) * 
            Math.cos(userData.inclination)
        );
        
        const y = this.GEO_ORBIT_RADIUS * (
            Math.sin(userData.ascendingNode) * Math.cos(userData.angle) +
            Math.cos(userData.ascendingNode) * Math.sin(userData.angle) * 
            Math.cos(userData.inclination)
        );
        
        const z = this.GEO_ORBIT_RADIUS * (
            Math.sin(userData.angle) * Math.sin(userData.inclination)
        );

        return new THREE.Vector3(x, y, z);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));

        // Dünyayı döndür
        this.earth.rotation.y += 0.002;

        // Uyduları güncelle
        this.updateSatellitePositions(Date.now() * 0.001);

        // Render
        this.renderer.render(this.scene, this.camera);
    }
}