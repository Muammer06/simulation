// SpaceSimulation.js
import * as THREE from 'three';
import { CONSTANTS } from './constants.js';  // Sabit değerleri içe aktar

import TabuSearch from './TabuSearch.js';

import SceneManager from './SceneManager.js';
import InfoPanel from './InfoPanel.js';
import Earth from './Earth.js';
import  Moon  from './Moon.js';
import Satellite from './Satellite.js';
import Rocket from './Rocket.js';

export class SpaceSimulation {
    constructor() {
        this.sceneManager = new SceneManager();
        this.earth = new Earth();
        this.moon = new Moon();
        this.satellites = [];
        this.rockets = [];
        this.infoPanel = new InfoPanel();
        this.simulationRunning = false;
        this.simulationPaused = false;
        this.simulationTime = 0;
        this.optimizedRoute = [];
        this.totalCost = 0;
    }

    initialize(satelliteCount = 30, rocketCount = 5, maxGenerations = 4, simulationSpeed = 1) {
        console.log('Simülasyon başlatılıyor...');
        this.reset();
        this.setupScene();
        this.createSatellites(satelliteCount);
        this.createRockets(rocketCount);
        CONSTANTS.SIMULATION_SPEED = simulationSpeed;
        console.log(`Simülasyon ${satelliteCount} uydu ve ${rocketCount} roket ile başlatıldı.`);
    }

    setupScene() {
        if (!this.sceneManager || !this.sceneManager.add) {
            console.error('SceneManager başlatılamadı veya add metodu mevcut değil.');
            return;
        }
        this.sceneManager.add(this.earth.mesh);
        this.sceneManager.add(this.moon.mesh);
    }
    

    createSatellites(count) {
        for (let i = 0; i < count; i++) {
            const satellite = new Satellite(i);
            this.satellites.push(satellite);
            this.sceneManager.add(satellite.mesh);
        }
    }

    createRockets(count) {
        this.rockets = []; // Roket dizisini başlat
        for (let i = 0; i < count; i++) {
            const rocket = new Rocket(i);
            this.rockets.push(rocket);
            this.sceneManager.add(rocket.mesh);
        }
        console.log('Roketler oluşturuldu:', this.rockets);
    }
    
    

    reset() {
        console.log('Simülasyon sıfırlanıyor...');
        this.satellites.forEach(sat => this.sceneManager.scene.remove(sat.mesh));
        this.rockets.forEach(rocket => this.sceneManager.scene.remove(rocket.mesh));
        this.satellites = [];
        this.rockets = [];
        this.simulationTime = 0;
        this.optimizedRoute = [];
    }

    animate() {
        if (!this.simulationRunning) return;
        requestAnimationFrame(this.animate.bind(this));
        const deltaTime = CONSTANTS.SIMULATION_SPEED * (1 / 60);
        this.simulationTime += deltaTime;
        
        this.earth.rotate(deltaTime);
        this.moon.update(deltaTime);
        this.satellites.forEach(sat => sat.update(deltaTime));
        this.rockets.forEach(rocket => rocket.update(deltaTime));
        
        this.infoPanel.update(this.simulationTime, this.satellites, this.rockets);
        this.sceneManager.render();
    }







    async optimizeRoute() {
        console.log('Gerçek zamanlı TABU Search başlatılıyor...');
        if (!this.tabuSearch) {
            this.tabuSearch = new TabuSearch(this.satellites, this.rockets); // 'this.rockets' bir dizi olmalı
        }
    
        const optimizedResult = await this.tabuSearch.optimize();
        this.optimizedRoute = optimizedResult.route;
        this.totalCost = optimizedResult.cost;
    
        this.infoPanel.updateRoute(this.optimizedRoute);
        this.infoPanel.updateCost(this.totalCost);
    
        console.log(
            'Optimum Rota:',
            this.optimizedRoute.map((node) => node.name).join(' → ')
        );
    }
    
    
    async animateRoute(route) {
        for (let i = 0; i < route.length; i++) {
            const currentTarget = route[i];
    
            // Roketi hedef uyduya hareket ettir
            this.rockets[0].motion.planPath(this.rockets[0], currentTarget);
            while (!this.rockets[0].motion.updatePosition(this.rockets[0], CONSTANTS.SIMULATION_TIME_STEP)) {
                this.rockets[0].consumeFuel(CONSTANTS.SIMULATION_TIME_STEP);
                this.sceneManager.render();
                await this.sleep(100); // Görsel güncelleme için kısa bekleme süresi
            }
    
            console.log(`Roket ${this.rockets[0].index}, ${currentTarget.name} hedefine ulaştı.`);
        }
    
        console.log('Rota animasyonu tamamlandı.');
    }
    
    // Yardımcı bir uyku fonksiyonu ekleyelim
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    


}
//export default SpaceSimulation;
