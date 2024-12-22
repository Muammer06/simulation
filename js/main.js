class SpaceSimulation {
    constructor() {
        this.sceneManager = new SceneManager();
        this.earth = new Earth();
        this.moon = new Moon();
        this.satellites = [];
        this.rocket = new Rocket();
        this.infoPanel = new InfoPanel();
        this.simulationRunning = false;
        this.simulationPaused = false;
        this.simulationTime = 0; // Simülasyon zamanı

        this.setupControls();
    }

    reset() {
        // Sahnedeki nesneleri temizle
        this.satellites.forEach(satellite => {
            this.sceneManager.scene.remove(satellite.mesh);
            this.sceneManager.scene.remove(satellite.trail.line);
        });

        this.satellites = []; // Uydu listesini temizle

        this.sceneManager.scene.remove(this.rocket.mesh);
        this.sceneManager.scene.remove(this.rocket.trail.line);
        this.sceneManager.scene.remove(this.moon.mesh);

        this.simulationTime = 0; // Zaman sıfırla
        console.log('Simülasyon sıfırlandı.');
    }

    initialize() {
        console.log('Simülasyon başlatılıyor...');
    
        // Simülasyonu tamamen sıfırla
        this.reset();
    
        // Dünya, Ay ve Roket sahneye eklenir
        this.sceneManager.add(this.earth.mesh);
        this.sceneManager.add(this.moon.mesh);
        this.rocket.reset();
        this.sceneManager.add(this.rocket.mesh);
        this.sceneManager.add(this.rocket.trail.line);
    
        // Kullanıcıdan uydu sayısını al
        const satelliteCountInput = document.getElementById('satelliteCount');
        const satelliteCount = parseInt(satelliteCountInput.value) || CONSTANTS.NUM_SATELLITES;
    
        console.log(`Uydu sayısı: ${satelliteCount}`);
    
        // Uyduları oluştur
        for (let i = 0; i < satelliteCount; i++) {
            const satellite = new Satellite(i);
            this.satellites.push(satellite);
            this.sceneManager.add(satellite.mesh);
            this.sceneManager.add(satellite.trail.line);
        }
    
        this.simulationTime = 0; // Zaman sıfırla
        console.log(`Toplam ${satelliteCount} uydu oluşturuldu.`);
        this.animate();
    }
    

    setupControls() {
        const speedControl = document.getElementById('speedControl');
        speedControl.addEventListener('input', (event) => {
            const newSpeed = parseFloat(event.target.value);
            if (!isNaN(newSpeed) && newSpeed > 0) {
                CONSTANTS.SIMULATION_SPEED = newSpeed;
                console.log(`Simülasyon Hızı Ayarlandı: ${CONSTANTS.SIMULATION_SPEED}x`);
            }
        });

        const startButton = document.getElementById('startButton');
        startButton.addEventListener('click', () => {
            if (!this.simulationRunning) {
                this.simulationRunning = true;
                this.simulationPaused = false;
                this.initialize();
            }
        });

        const stopButton = document.getElementById('stopButton');
        stopButton.addEventListener('click', () => {
            this.simulationRunning = false;
            console.log('Simülasyon Durduruldu');
        });

        const resumeButton = document.getElementById('resumeButton');
        resumeButton.addEventListener('click', () => {
            if (!this.simulationRunning && this.simulationPaused) {
                this.simulationRunning = true;
                console.log('Simülasyon Devam Ettirildi');
                this.animate();
            }
        });
    }

    animate() {
        if (!this.simulationRunning) {
            this.simulationPaused = true;
            return;
        }
    
        requestAnimationFrame(this.animate.bind(this));
    
        const deltaTime = CONSTANTS.SIMULATION_SPEED * (1 / 60); 
        this.simulationTime += deltaTime;
    
        console.log(`Delta Time: ${deltaTime.toFixed(4)} saniye`);
    
        this.earth.rotate(deltaTime);
        this.moon.update(deltaTime);
        this.satellites.forEach(satellite => satellite.update(deltaTime));
        this.rocket.update(this.satellites, deltaTime);
    
        this.infoPanel.update(
            this.rocket.currentTargetIndex,
            this.rocket.fuel,
            this.satellites,
            this.simulationTime
        );
    
        this.sceneManager.render();
    }

    showPath() {
        const points = [
            this.currentPath.start,
            this.currentPath.midPoint,
            this.currentPath.target
        ];
    
        const pathGeometry = new THREE.BufferGeometry().setFromPoints(points);
        const pathMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
        const pathLine = new THREE.Line(pathGeometry, pathMaterial);
    
        this.sceneManager.scene.add(pathLine);
    }
    
}
