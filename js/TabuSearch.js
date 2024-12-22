class TabuSearch {
    constructor(satellites, rocket) {
        this.satellites = satellites;
        this.rocket = rocket;
        this.tabuList = [];
        this.bestRoute = [];
        this.bestCost = Infinity;
        this.maxIterations = CONSTANTS.TABU_ITERATIONS;
        this.tabuListSize = CONSTANTS.TABU_LIST_SIZE;
    }

    calculateCost(route) {
        let totalDistance = 0;
        let totalFuel = 0;

        for (let i = 0; i < route.length - 1; i++) {
            const distance = route[i].mesh.position.distanceTo(route[i + 1].mesh.position);
            totalDistance += distance;
            totalFuel += distance * CONSTANTS.FUEL_CONSUMPTION_RATE;
        }

        return (CONSTANTS.W1 * totalDistance) + (CONSTANTS.W2 * totalFuel);
    }

    generateNeighbor(route) {
        const newRoute = [...route];
        const [i, j] = [Math.floor(Math.random() * route.length), Math.floor(Math.random() * route.length)];
        [newRoute[i], newRoute[j]] = [newRoute[j], newRoute[i]];
        return newRoute;
    }

    optimize() {
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

        return { route: this.bestRoute, cost: this.bestCost };
    }
}
