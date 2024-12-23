import { CONSTANTS } from './constants.js';
import Rocket from './Rocket.js';

class TabuSearch {
    constructor(satellites, rockets) {
        this.satellites = satellites; // Tüm uydular
        this.rockets = rockets; // Tüm roketler
        this.tabuList = []; // TABU listesi
        this.bestRoute = []; // En iyi rota
        this.bestCost = Infinity; // En düşük maliyet
        this.maxIterations = CONSTANTS.TABU_ITERATIONS || 500;
        this.tabuListSize = CONSTANTS.TABU_LIST_SIZE || 50;
    }

    /**
     * 🛠️ Rota Optimizasyonu
     */
    async optimize() {
        console.log('TABU Search başlatılıyor...');
    
        const currentRoutes = this.initializeRoutes();
        if (currentRoutes.length === 0) {
            console.error('❌ Rota oluşturulamadı, optimize iptal edildi.');
            return { route: [], cost: Infinity };
        }
    
        let currentCosts = this.calculateTotalCosts(currentRoutes);
    
        for (let iteration = 0; iteration < this.maxIterations; iteration++) {
            console.log(`🔄 Iteration ${iteration + 1}`);
    
            const neighborRoutes = this.generateNeighbor(currentRoutes);
            const neighborCosts = this.calculateTotalCosts(neighborRoutes);
    
            for (let i = 0; i < neighborRoutes.length; i++) {
                if (
                    neighborCosts[i] < currentCosts[i] &&
                    !this.isInTabuList(neighborRoutes[i])
                ) {
                    currentRoutes[i] = neighborRoutes[i];
                    currentCosts[i] = neighborCosts[i];
    
                    if (neighborCosts[i] < this.bestCost) {
                        this.bestRoute = [...neighborRoutes[i]];
                        this.bestCost = neighborCosts[i];
                    }
    
                    this.addToTabuList(neighborRoutes[i]);
                }
            }
    
            await this.animateRoutes(currentRoutes);
        }
    
        console.log('✅ TABU Search tamamlandı!');
        return { route: this.bestRoute, cost: this.bestCost };
    }
    

    /**
     * 🚀 Başlangıç rotalarını oluştur
     */
    initializeRoutes() {
        if (!Array.isArray(this.rockets)) {
            console.error('❌ Hata: Roketler dizisi düzgün aktarılmadı!', this.rockets);
            return [];
        }
    
        return this.rockets.map((rocket) => {
            return this.shuffleArray(this.satellites.slice());
        });
    }
    

    /**
     * 💰 Toplam maliyetleri hesapla
     */
    calculateTotalCosts(routes) {
        return routes.map((route) => {
            let totalDistance = 0;
            for (let i = 0; i < route.length - 1; i++) {
                totalDistance += route[i].mesh.position.distanceTo(
                    route[i + 1].mesh.position
                );
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
                Math.floor(Math.random() * route.length)
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
        return this.tabuList.some(
            (tabuRoute) =>
                JSON.stringify(tabuRoute) === JSON.stringify(route)
        );
    }

    /**
     * 📊 Rotayı animasyon ile göster
     */
    async animateRoutes(routes) {
        for (let i = 0; i < this.rockets.length; i++) {
            const rocket = this.rockets[i];
            const route = routes[i];

            for (const target of route) {
                rocket.motion.planPath(rocket, target);

                while (
                    !rocket.motion.updatePosition(rocket, CONSTANTS.SIMULATION_TIME_STEP)
                ) {
                    rocket.consumeFuel(CONSTANTS.SIMULATION_TIME_STEP);
                    await this.sleep(100); // Anlık animasyon için bekle
                }

                console.log(
                    `🚀 Roket ${rocket.index}, ${target.name} hedefine ulaştı.`
                );
            }
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
