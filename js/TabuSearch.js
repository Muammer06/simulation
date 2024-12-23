class TabuSearch {
    constructor(satellites, rocket) {
        this.satellites = satellites;
        this.rocket = rocket;
        this.tabuList = [];
        this.bestRoute = [];
        this.bestCost = Infinity;
        this.maxIterations = 100;
        this.tabuListSize = 50;
    }

    optimize() {
        console.log('TABU Search başladı...');
        let currentRoute = [this.rocket, ...this.satellites, this.rocket];
        let currentCost = this.calculateCost(currentRoute);

        for (let iteration = 0; iteration < this.maxIterations; iteration++) {
            const neighbor = this.generateNeighbor(currentRoute);
            const neighborCost = this.calculateCost(neighbor);

            if (neighborCost < currentCost && !this.tabuList.includes(neighbor)) {
                currentRoute = neighbor;
                currentCost = neighborCost;

                if (neighborCost < this.bestCost) {
                    this.bestRoute = [...neighbor];
                    this.bestCost = neighborCost;
                }

                this.tabuList.push(neighbor);
                if (this.tabuList.length > this.tabuListSize) {
                    this.tabuList.shift();
                }
            }
        }

        console.log('TABU Search tamamlandı.');
        return { route: this.bestRoute, cost: this.bestCost };
    }

    calculateCost(route) {
        let totalDistance = 0;
        for (let i = 0; i < route.length - 1; i++) {
            totalDistance += route[i].mesh.position.distanceTo(route[i + 1].mesh.position);
        }
        return totalDistance;
    }

    generateNeighbor(route) {
        const newRoute = [...route];
        const [i, j] = [Math.floor(Math.random() * route.length), Math.floor(Math.random() * route.length)];
        [newRoute[i], newRoute[j]] = [newRoute[j], newRoute[i]];
        return newRoute;
    }
}

