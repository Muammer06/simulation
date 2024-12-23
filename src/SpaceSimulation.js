import * as THREE from 'three';
import { CONSTANTS } from './constants.js';
import TabuSearch from './TabuSearch.js';
import SceneManager from './SceneManager.js';
import InfoPanel from './InfoPanel.js';
import Earth from './Earth.js';
import Moon from './Moon.js';
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
        this.simulationTime = 0;
        this.optimizedRoute = [];
        this.totalCost = 0;
        this.tabuSearch = null;
        this.simulationInterval = null;
    }

    initializeScene() {
        this.sceneManager.createEarth();
        this.sceneManager.createMoon();
    
        const satelliteCount = parseInt(document.getElementById('satelliteCount').value) || 10;
        for (let i = 0; i < satelliteCount; i++) {
            const satellite = new Satellite(i);
            this.satellites.push(satellite);
            this.sceneManager.addSatellite(satellite);
        }
    
        const rocketCount = parseInt(document.getElementById('rocketCount').value) || 5;
        for (let i = 0; i < rocketCount; i++) {
            const rocket = new Rocket(i, CONSTANTS.MAX_FUEL);
            this.rockets.push(rocket);
            this.sceneManager.addRocket(rocket);
        }
    
        this.sceneManager.render();
    }
    
    

    /**
     * 🔄 Simülasyonu her karede günceller.
     */
    update() {
        this.simulationTime += CONSTANTS.SIMULATION_TIME_STEP;

        this.earth.rotate(CONSTANTS.SIMULATION_TIME_STEP);
        this.moon.update(CONSTANTS.SIMULATION_TIME_STEP);
        this.satellites.forEach(sat => sat.update(CONSTANTS.SIMULATION_TIME_STEP));
        this.rockets.forEach(rocket => rocket.update(CONSTANTS.SIMULATION_TIME_STEP));

        this.infoPanel.update(this.simulationTime, this.satellites, this.rockets);

        this.rockets.forEach((rocket) => {
            rocket.update(CONSTANTS.SIMULATION_TIME_STEP);
            if (!rocket.alive) {
                console.warn(`❌ Roket ${rocket.index}: Devre dışı, yakıt tamamen bitti.`);
            }
        });
    
        this.satellites.forEach(satellite => satellite.update(CONSTANTS.SIMULATION_TIME_STEP));
    
        this.sceneManager.render();
    }

    /**
     * 🛠️ Sahneyi sıfırlar.
     */
    reset() {
        console.log('🔄 Simülasyon sıfırlanıyor...');
        this.stopSimulation();
        this.sceneManager.reset();
        this.satellites = [];
        this.rockets = [];
        this.simulationTime = 0;
    }

    /**
     * 🚀 Simülasyonu başlatır.
     */
    startSimulation() {
        if (this.simulationRunning) {
            console.warn('⚠️ Simülasyon zaten çalışıyor.');
            return;
        }

        console.log('%c🚀 Simülasyon Başlatılıyor...', 'color: lime; font-weight: bold;');
        this.simulationRunning = true;

        this.simulationInterval = setInterval(() => {
            this.update();
        }, 100); // 100 ms aralıklarla güncelle
    }

    /**
     * 🛑 Simülasyonu durdurur.
     */
    stopSimulation() {
        if (!this.simulationRunning) {
            console.warn('⚠️ Simülasyon zaten durdurulmuş.');
            return;
        }

        console.log('%c🛑 Simülasyon Durduruldu.', 'color: red; font-weight: bold;');
        clearInterval(this.simulationInterval);
        this.simulationRunning = false;
    }

    /**
     * 🤖 TABU Search algoritmasını çalıştırarak optimum rotayı hesaplar.
     */
    async optimizeRoute(iterationCount = CONSTANTS.TABU_ITERATIONS) {
        console.log('%c🚀 TABU Search Başlatılıyor...', 'color: blue; font-weight: bold;');
        this.tabuSearch = new TabuSearch(this.satellites, this.rockets, iterationCount);

        const optimizedResult = await this.tabuSearch.optimize();

        this.optimizedRoute = optimizedResult.route;
        this.totalCost = optimizedResult.cost;

        console.log(
            `%c✅ Optimum Rota: ${this.optimizedRoute.map(node => node.name).join(' → ')}`,
            'color: green; font-weight: bold;'
        );
        console.log(`💰 Toplam Maliyet: ${this.totalCost.toFixed(2)}`);

        this.rockets.forEach((rocket, index) => {
            rocket.followOptimizedRoute(this.optimizedRoute[index]);
        });

        this.infoPanel.updateRoute(this.optimizedRoute);
        this.infoPanel.updateCost(this.totalCost);
        console.log('%c✅ Tüm Roketler için Optimizasyon Tamamlandı!', 'color: green; font-weight: bold;');
    }

    /**
     * 🎥 Belirli bir rotayı animasyonla gösterir.
     * @param {Array} route - Optimize edilmiş rota
     */
    async animateRoute(route) {
        for (const currentTarget of route) {
            for (const rocket of this.rockets) {
                rocket.motion.planPath(rocket, currentTarget);

                while (!rocket.motion.updatePosition(rocket, CONSTANTS.SIMULATION_TIME_STEP)) {
                    rocket.consumeFuel(CONSTANTS.SIMULATION_TIME_STEP);
                    this.sceneManager.render();
                    await this.sleep(100); // Kısa gecikme
                }

                console.log(`🚀 Roket ${rocket.index}, ${currentTarget.name} hedefine ulaştı.`);
            }
        }
        console.log('🎬 Rota animasyonu tamamlandı.');
    }

    /**
     * 💤 Belirli bir süre bekler.
     * @param {number} ms - Milisaniye cinsinden süre
     * @returns {Promise}
     */
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async optimizeRouteWithTabuSearch() {
        console.log('%c🚀 TABU Search Optimizasyonu Başlatılıyor...', 'color: blue; font-weight: bold;');
        this.sceneManager.clearPaths(); // Eski yolları temizle
    
        this.tabuSearch = new TabuSearch(this.satellites, this.rockets);
        const optimizedResult = await this.tabuSearch.optimize();
    
        this.optimizedRoute = optimizedResult.route;
        this.totalCost = optimizedResult.cost;
    
        console.log(`✅ Nihai Rota: ${this.optimizedRoute.map(node => node.name).join(' → ')}`);
        console.log(`💰 Toplam Maliyet: ${this.totalCost.toFixed(2)}`);
    }
    
    
}
