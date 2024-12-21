class SpaceSimulation {
    constructor() {
        console.log('SpaceSimulation constructor başladı');
        
        try {
            this.sceneManager = new SceneManager();
            this.earth = new Earth();
            this.moon = new Moon(); // Ay nesnesi oluşturuldu
            console.log('Moon nesnesi:', this.moon);
            console.log('Moon mesh:', this.moon.mesh);
            this.satellites = [];
            this.rocket = new Rocket();
            this.infoPanel = new InfoPanel();

            this.initialize();
        } catch (error) {
            console.error('Constructor hatası:', error);
        }
    }

    initialize() {
        this.sceneManager.add(this.earth.mesh);
        this.sceneManager.add(this.moon.mesh); // Ay sahneye eklendi

        for (let i = 0; i < CONSTANTS.NUM_SATELLITES; i++) {
            const satellite = new Satellite(i);
            this.satellites.push(satellite);
            this.sceneManager.add(satellite.mesh);
            this.sceneManager.add(satellite.trail.line);
        }

        this.sceneManager.add(this.rocket.mesh);
        this.sceneManager.add(this.rocket.trail.line);

        this.animate();
    }

    animate() {
        try {
            requestAnimationFrame(this.animate.bind(this));
    
            this.earth.rotate();
            this.moon.updatePosition(); // Ay'ın pozisyon ve dönüş güncellemesi
            this.satellites.forEach(satellite => satellite.update());
            this.rocket.update(this.satellites);
            this.infoPanel.update(this.rocket.currentTargetIndex);
    
            this.sceneManager.render();
        } catch (error) {
            console.error('Animate hatası:', error);
        }
    }
}
