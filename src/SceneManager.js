import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Three.js kodunuz

class SceneManager {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        this.setupControls();
        this.setupLights();
    }

    setupControls() {
        try {
            this.controls = new OrbitControls(this.camera, this.renderer.domElement);
            this.controls.enableDamping = true;
            this.controls.dampingFactor = 0.05;
            console.log('OrbitControls başarıyla oluşturuldu.');
        } catch (error) {
            console.error('OrbitControls oluşturulurken hata oluştu:', error);
        }
    }

    setupLights() {
        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(10, 10, 10);
        this.scene.add(light);
    }

    render() {
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }

    
    add(object) {
        this.scene.add(object);
    }
}

export default SceneManager;
