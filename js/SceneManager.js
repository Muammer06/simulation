class SceneManager {
    constructor() {
        console.log('SceneManager constructor başladı');
        try {
            this.scene = new THREE.Scene();
            console.log('Scene oluşturuldu');
            
            this.setupCamera();
            console.log('Camera kuruldu');
            
            this.setupRenderer();
            console.log('Renderer kuruldu');
            
            this.setupLights();
            console.log('Işıklar kuruldu');
            
            this.setupControls();
            console.log('Kontroller kuruldu');
            
            this.setupEventListeners();
            console.log('Event listener\'lar kuruldu');
        } catch (error) {
            console.error('SceneManager constructor hatası:', error);
        }
    }

    setupCamera() {
        this.camera = new THREE.PerspectiveCamera(
            60, // Görüş Açısı (FOV)
            window.innerWidth / window.innerHeight,
            1, 
            CONSTANTS.MOON_ORBIT_RADIUS * 20 // Far Clipping Plane (Ay'ı içerecek şekilde artırıldı)
        );
    
        // Kamerayı Ay ve Dünya arasında bir noktaya yerleştir
        this.camera.position.set(
            CONSTANTS.MOON_ORBIT_RADIUS * 0.5, 
            CONSTANTS.MOON_ORBIT_RADIUS * 0.3, 
            CONSTANTS.MOON_ORBIT_RADIUS * 0.5
        );
    
        this.camera.lookAt(0, 0, 0); // Kamerayı Dünya merkezine yönlendir
    }
    
    
    
    setupRenderer() {
        this.renderer = new THREE.WebGLRenderer({ antialias: true, logarithmicDepthBuffer: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x000000);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        document.body.appendChild(this.renderer.domElement);
    }
    
    

    setupLights() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.7); // Genel ışıklandırma
        this.scene.add(ambientLight);
    
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(
            CONSTANTS.EARTH_RADIUS * 2, 
            CONSTANTS.EARTH_RADIUS * 2, 
            CONSTANTS.EARTH_RADIUS * 2
        );
        directionalLight.castShadow = true;
        this.scene.add(directionalLight);
    
        const pointLight = new THREE.PointLight(0xffffff, 1.2, CONSTANTS.GEO_ORBIT_RADIUS * 2);
        pointLight.position.set(
            CONSTANTS.EARTH_RADIUS * 1.5, 
            CONSTANTS.EARTH_RADIUS * 1.5, 
            CONSTANTS.EARTH_RADIUS * 1.5
        );
        this.scene.add(pointLight);
    }
    
    

    setupControls() {
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.minDistance = CONSTANTS.EARTH_RADIUS * 1; // Yakınlaştırma sınırı
        this.controls.maxDistance = CONSTANTS.MOON_ORBIT_RADIUS * 500; // Uzaklaştırma sınırı
        this.controls.enableDamping = true; // Daha yumuşak hareket
        this.controls.dampingFactor = 0.05;
    }
    

    setupEventListeners() {
        window.addEventListener('resize', this.onWindowResize.bind(this), false);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    add(object) {
        this.scene.add(object);
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }
}