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

        this.tabuSearch = null; // TABU Search nesnesi
        this.optimizedRoute = []; // Optimize edilmiş rota
        this.totalCost = 0; // Toplam maliyet

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
    
        // TABU Search optimizasyonu
        this.optimizeRoute();

        this.animate();
    }

    optimizeRoute() {
        console.log('TABU Search başlatılıyor...');
        if (!this.tabuSearch) {
            this.tabuSearch = new TabuSearch(this.satellites, this.rocket);
        }
    
        const optimizedResult = this.tabuSearch.optimize();
    
        this.rocket.followOptimizedRoute(optimizedResult.route);
        this.infoPanel.updateCost(optimizedResult.cost);
        this.saveOptimizedRouteAsText(optimizedResult.route, optimizedResult.cost);
    }
    
    saveRouteAsText() {
        const routeText = `Optimal Route: ${this.optimizedRoute.map(node => node.name).join(' → ')}\nTotal Cost: ${this.totalCost}`;
        const blob = new Blob([routeText], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'optimal_route.txt';
        link.click();

        console.log('Rota bilgileri .txt dosyasına kaydedildi.');
    }


    saveOptimizedRouteAsText(route, totalCost) {
        const routeText = `
            Optimal Rota: ${route.map(node => node.name).join(' → ')}
            Toplam Maliyet: ${totalCost.toFixed(2)}
        `;
    
        const blob = new Blob([routeText], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `optimized_route_${Date.now()}.txt`;
        link.click();
    
        console.log('TABU Search tamamlandı ve rota indirildi.');
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
            this.optimizeRoute(); // TABU Search başlat
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

        const w1Slider = document.getElementById('w1-slider');
        const w2Slider = document.getElementById('w2-slider');

        w1Slider.addEventListener('input', (e) => {
            CONSTANTS.W1 = parseFloat(e.target.value);
            this.optimizeRoute();
        });

        w2Slider.addEventListener('input', (e) => {
            CONSTANTS.W2 = parseFloat(e.target.value);
            this.optimizeRoute();
        });
    }



    
    animate() {
        if (!this.simulationRunning) return;
    
        requestAnimationFrame(this.animate.bind(this));
    
        const deltaTime = CONSTANTS.SIMULATION_SPEED * (1 / 60);
        this.simulationTime += deltaTime; // Simülasyon zamanını güncelle
        
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
        const points = this.optimizedRoute.map(node => node.mesh.position);

        const pathGeometry = new THREE.BufferGeometry().setFromPoints(points);
        const pathMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
        const pathLine = new THREE.Line(pathGeometry, pathMaterial);

        this.sceneManager.scene.add(pathLine);
    }
}
