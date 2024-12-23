import { CONSTANTS } from './constants.js';
import Rocket from './Rocket.js';
import * as THREE from 'three';

class TabuSearch {
    constructor(satellites, rockets, maxIterations = CONSTANTS.TABU_ITERATIONS) {
        this.satellites = satellites;
        this.rockets = rockets;
        this.tabuList = [];
        this.bestRoutes = [];
        this.bestCosts = [];
        this.maxIterations = maxIterations;
        this.tabuListSize = CONSTANTS.TABU_LIST_SIZE;

        console.log(`🔄 TABU Search İterasyon Sayısı: ${this.maxIterations}`);
    }

    /**
     * 🧠 TABU Search Algoritmasını Çalıştır
     */
    async optimize() {
        console.log('%c🧠 TABU Search Başlatılıyor...', 'color: cyan; font-weight: bold;');

        let currentRoutes = this.initializeRoutes();
        let currentCosts = this.calculateTotalCosts(currentRoutes);

        console.log('🔍 İlk Rotalar:', currentRoutes);
        console.log('💰 İlk Maliyetler:', currentCosts);

        if (currentRoutes.length === 0 || currentCosts.length === 0) {
            console.error('❌ TABU Search: Başlangıç rotaları oluşturulamadı.');
            return { routes: [], costs: [] };
        }

        let iteration = 0;
        let globalBestRoutes = [...currentRoutes];
        let globalBestCosts = [...currentCosts];

        while (iteration < this.maxIterations) {
            console.log(`🔄 İterasyon: ${iteration + 1}`);

            const neighborRoutes = this.generateNeighbor(currentRoutes);
            const neighborCosts = this.calculateTotalCosts(neighborRoutes);

            let improvement = false;

            for (let i = 0; i < neighborRoutes.length; i++) {
                if (
                    neighborCosts[i] < currentCosts[i] &&
                    !this.isInTabuList(neighborRoutes[i])
                ) {
                    currentRoutes[i] = neighborRoutes[i];
                    currentCosts[i] = neighborCosts[i];
                    improvement = true;

                    if (neighborCosts[i] < globalBestCosts[i]) {
                        globalBestRoutes[i] = [...neighborRoutes[i]];
                        globalBestCosts[i] = neighborCosts[i];
                        console.log(`🏆 Roket ${i} için Yeni En İyi Maliyet: ${globalBestCosts[i]}`);
                    }

                    this.addToTabuList(neighborRoutes[i]);
                }
            }

            if (!improvement) {
                console.warn('⚠️ İyileştirme bulunamadı, döngü durduruluyor.');
                break;
            }

            iteration++;
            await this.animateRoutes(currentRoutes);
        }

        console.log('%c✅ TABU Search Tamamlandı!', 'color: lime; font-weight: bold;');

        for (let i = 0; i < globalBestRoutes.length; i++) {
            console.log(
                `🚀 Roket ${i} için Nihai Rota: ${globalBestRoutes[i]
                    .map((node) => node.name)
                    .join(' → ')}`
            );
            console.log(`💰 Toplam Maliyet: ${globalBestCosts[i].toFixed(2)}`);
        }

        return { routes: globalBestRoutes, costs: globalBestCosts };
    }

    /**
     * 🛰️ Başlangıç Rotalarını Oluştur
     */
    initializeRoutes() {
        if (!Array.isArray(this.rockets) || this.rockets.length === 0) {
            console.error('❌ Roketler dizisi geçersiz veya boş.');
            return [];
        }

        if (!Array.isArray(this.satellites) || this.satellites.length === 0) {
            console.error('❌ Uydular dizisi geçersiz veya boş.');
            return [];
        }

        console.log('🛰️ Uydular:', this.satellites.map((sat) => sat.name));
        console.log('🚀 Roketler:', this.rockets.map((rocket) => rocket.index));

        return this.rockets.map(() => this.shuffleArray(this.satellites.slice()));
    }

    /**
     * 💰 Toplam maliyetleri hesapla
     */
    calculateTotalCosts(routes) {
        return routes.map((route) => {
            let totalDistance = 0;
            for (let i = 0; i < route.length - 1; i++) {
                totalDistance += route[i].mesh.position.distanceTo(route[i + 1].mesh.position);
            }
            return totalDistance;
        });
    }

    /**
     * 🔀 Komşu rotaları oluştur
     */
    generateNeighbor(routes) {
        return routes.map((route) => {
            const newRoute = [...route];
            const [i, j] = [
                Math.floor(Math.random() * route.length),
                Math.floor(Math.random() * route.length),
            ];
            [newRoute[i], newRoute[j]] = [newRoute[j], newRoute[i]];
            return newRoute;
        });
    }

    /**
     * ✅ TABU listesine ekle
     */
    addToTabuList(route) {
        this.tabuList.push(route);
        if (this.tabuList.length > this.tabuListSize) {
            this.tabuList.shift();
        }
    }

    /**
     * ❌ TABU listesinde kontrol et
     */
    isInTabuList(route) {
        return this.tabuList.some((tabuRoute) => JSON.stringify(tabuRoute) === JSON.stringify(route));
    }

    async animateRoutes(routes) {
        for (let i = 0; i < this.rockets.length; i++) {
            const rocket = this.rockets[i];
            const route = routes[i];
    
            console.log(`🛰️ Roket ${rocket.index}: Rota üzerinde ilerliyor...`);
    
            for (const target of route) {
                if (!rocket.alive) {
                    console.warn(`⚠️ Roket ${rocket.index}: Devre dışı, rota tamamlanamıyor.`);
                    break;
                }
    
                rocket.motion.planPath(rocket, target);
    
                // ✅ Anlık Rotayı Görselleştir
                this.visualizePath(rocket, target);
    
                while (!rocket.motion.updatePosition(rocket, CONSTANTS.SIMULATION_TIME_STEP)) {
                    rocket.consumeFuel(CONSTANTS.SIMULATION_TIME_STEP);
                    this.updateInfoPanel(rocket, target);
                    await this.sleep(100); // Görsel güncelleme için bekleme
                }
    
                if (rocket.currentTarget?.name === 'Moon') {
                    console.log(`🌑 Roket ${rocket.index}: Ay'a başarıyla döndü.`);
                    rocket.reset();
                    break;
                }
    
                console.log(`🚀 Roket ${rocket.index}: ${target.name} hedefine ulaştı.`);
            }
        }
    }
    
    /**
     * 🚀 Anlık Rota Görselleştirme
     * @param {Rocket} rocket - Roket nesnesi
     * @param {Satellite} target - Hedef uydu
     */
    visualizePath(rocket, target) {
        const pathGeometry = new THREE.BufferGeometry().setFromPoints([
            rocket.mesh.position,
            target.mesh.position
        ]);
    
        const pathMaterial = new THREE.LineBasicMaterial({
            color: 0xff0000, // Kırmızı ile rota vurgulama
            linewidth: 2,
        });
    
        const pathLine = new THREE.Line(pathGeometry, pathMaterial);
        this.sceneManager.scene.add(pathLine);
    
        console.log(`🛤️ Roket ${rocket.index}: Rota görselleştirildi → ${target.name}`);
    }
    
    /**
     * 📊 Anlık Bilgi Paneli Güncelle
     * @param {Rocket} rocket - Roket nesnesi
     * @param {Satellite} target - Hedef uydu
     */
    updateInfoPanel(rocket, target) {
        const infoPanel = document.getElementById('route');
        const costPanel = document.getElementById('cost');
    
        if (infoPanel) {
            infoPanel.innerHTML = `
                <h4>Roket ${rocket.index} Hedefi:</h4>
                🛰️ ${target.name}
            `;
        }
    
        if (costPanel) {
            costPanel.innerHTML = `
                <h4>Kalan Yakıt:</h4>
                ⛽ ${rocket.fuel.toFixed(2)} L
            `;
        }
    }
    
    
    
    /**
     * 🚀 Anlık Rota Görselleştirme
     * @param {Rocket} rocket - Roket nesnesi
     * @param {Satellite} target - Hedef uydu
     */
    visualizePath(rocket, target) {
        const pathGeometry = new THREE.BufferGeometry().setFromPoints([
            rocket.mesh.position,
            target.mesh.position
        ]);
    
        const pathMaterial = new THREE.LineBasicMaterial({
            color: 0xff0000, // Kırmızı ile rota vurgulama
            linewidth: 2,
        });
    
        const pathLine = new THREE.Line(pathGeometry, pathMaterial);
        this.sceneManager.scene.add(pathLine);
    
        console.log(`🛤️ Roket ${rocket.index}: Rota görselleştirildi → ${target.name}`);
    }
    
    /**
     * 📊 Anlık Bilgi Paneli Güncelle
     * @param {Rocket} rocket - Roket nesnesi
     * @param {Satellite} target - Hedef uydu
     */
    updateInfoPanel(rocket, target) {
        const infoPanel = document.getElementById('route');
        const costPanel = document.getElementById('cost');
    
        if (infoPanel) {
            infoPanel.innerHTML = `
                <h4>Roket ${rocket.index} Hedefi:</h4>
                🛰️ ${target.name}
            `;
        }
    
        if (costPanel) {
            costPanel.innerHTML = `
                <h4>Kalan Yakıt:</h4>
                ⛽ ${rocket.fuel.toFixed(2)} L
            `;
        }
    }
    
    
    

    /**
     * 💤 Bekleme fonksiyonu
     */
    sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    /**
     * 🎲 Diziyi karıştır
     */
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
}

export default TabuSearch;
