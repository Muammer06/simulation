import * as THREE from 'three';

class SceneManager {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.getElementById('canvas-container')?.appendChild(this.renderer.domElement);

        this.earth = null;
        this.moon = null;

        this.setupLighting();
        this.setupCamera();
        window.addEventListener('resize', this.onWindowResize.bind(this));
    }

    /**
     * 💡 Sahneye ışık ekler.
     */
    setupLighting() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Genel ortam ışığı
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(10, 10, 10);
        this.scene.add(directionalLight);

        console.log('💡 Işıklar sahneye eklendi.');
    }

    /**
     * 🎥 Kamerayı başlatır.
     */
    setupCamera() {
        this.camera.position.set(0, 10, 20);
        this.camera.lookAt(0, 0, 0);
        console.log('🎥 Kamera ayarlandı.');
    }

    /**
     * 🌍 Dünya modelini oluşturur ve sahneye ekler.
     */
    createEarth() {
        if (this.earth) {
            console.warn('⚠️ Dünya zaten sahneye eklenmiş.');
            return;
        }

        const geometry = new THREE.SphereGeometry(5, 32, 32);
        const material = new THREE.MeshStandardMaterial({ color: 0x0000ff });
        this.earth = new THREE.Mesh(geometry, material);
        this.earth.position.set(0, 0, 0);
        this.scene.add(this.earth);
        console.log('🌍 Dünya sahneye eklendi.');
    }

    /**
     * 🌑 Ay modelini oluşturur ve sahneye ekler.
     */
    createMoon() {
        if (this.moon) {
            console.warn('⚠️ Ay zaten sahneye eklenmiş.');
            return;
        }

        const geometry = new THREE.SphereGeometry(1, 32, 32);
        const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
        this.moon = new THREE.Mesh(geometry, material);
        this.moon.position.set(10, 0, 0);
        this.scene.add(this.moon);
        console.log('🌑 Ay sahneye eklendi.');
    }

    /**
     * 🛰️ Uyduyu sahneye ekler.
     * @param {Satellite} satellite
     */
    addSatellite(satellite) {
        if (!satellite.mesh) return;
        this.scene.add(satellite.mesh);
        console.log(`🛰️ Uydu ${satellite.index} sahneye eklendi.`);
    }
    clearPaths() {
        const toRemove = [];
        this.scene.traverse((child) => {
            if (child.isLine) {
                toRemove.push(child);
            }
        });
    
        toRemove.forEach((line) => {
            this.scene.remove(line);
        });
    
        console.log('🧹 Eski yollar temizlendi.');
    }
    

    /**
     * 🚀 Roketi sahneye ekler.
     * @param {Rocket} rocket
     */
    addRocket(rocket) {
        if (!rocket?.mesh) {
            console.error('❌ Geçersiz roket nesnesi.');
            return;
        }
        this.scene.add(rocket.mesh);
        console.log(`🚀 Roket ${rocket.index} sahneye eklendi.`);
    }

    /**
     * 📦 Genel sahneye herhangi bir nesne ekler.
     * @param {THREE.Object3D} object
     */
    addObject(object) {
        if (!object) {
            console.error('❌ Geçersiz nesne.');
            return;
        }
        this.scene.add(object);
        console.log('📦 Nesne sahneye eklendi.');
    }

    /**
     * 🔄 Sahneyi yeniden boyutlandırır.
     */
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        console.log('🔄 Sahne boyutları güncellendi.');
    }

    /**
     * 🖥️ Sahneyi render eder.
     */
    render() {
        this.renderer.render(this.scene, this.camera);
    }

    /**
     * 🔄 Sahneyi sıfırlar.
     */
    reset() {
        while (this.scene.children.length > 0) {
            this.scene.remove(this.scene.children[0]);
        }

        this.earth = null;
        this.moon = null;

        this.setupLighting();
        this.setupCamera();

        console.log('🔄 Sahne sıfırlandı ve temel bileşenler yeniden oluşturuldu.');
    }
}

export default SceneManager;
