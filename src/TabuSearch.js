// TabuSearch.js

class TabuSearch {
    constructor(satellites, rockets, maxIterations = 100) {
        this.satellites = satellites;
        this.rockets = rockets;
        this.maxIterations = maxIterations;
        this.tabuList = [];
    }

    optimize() {
        console.log('%c🧠 TABU Search Başlatılıyor...', 'color: cyan; font-weight: bold;');
    
        let bestRoutes = [];
        let bestCosts = [];
    
        if (!this.rockets.length || !this.satellites.length) {
            console.error('❌ Roket veya Uydu listesi boş. Optimizasyon yapılamıyor.');
            return { routes: [], costs: [] };
        }
    
        for (let i = 0; i < this.rockets.length; i++) {
            const route = this.shuffleArray(this.satellites.slice());
            const cost = this.calculateTotalCosts([route])[0];
            bestRoutes.push(route);
            bestCosts.push(cost);
        }
    
        console.log('%c✅ TABU Search Tamamlandı!', 'color: lime; font-weight: bold;');
        return { routes: bestRoutes, costs: bestCosts };
    }
    
    
    
    calculateCost(routes) {
        let totalCost = 0;
        routes.forEach(route => {
            for (let i = 0; i < route.length - 1; i++) {
                totalCost += Math.abs(route[i].position.x - route[i + 1].position.x);
            }
        });
        return totalCost;
    }

   


    calculateTotalCosts(routes) {
        return routes.map(route => {
            let totalDistance = 0;
            for (let i = 0; i < route.length - 1; i++) {
                totalDistance += this.calculateDistance(route[i], route[i + 1]);
            }
            return totalDistance;
        });
    }
    
    /**
     * 📏 İki nokta arasındaki mesafeyi hesaplar.
     */
    calculateDistance(nodeA, nodeB) {
        return Math.sqrt(
            Math.pow(nodeA.position.x - nodeB.position.x, 2) +
            Math.pow(nodeA.position.y - nodeB.position.y, 2) +
            Math.pow(nodeA.position.z - nodeB.position.z, 2)
        );
    }
    
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
}

export default TabuSearch;
