class InfoPanel {
    constructor() {
        this.infoElement = document.getElementById('info');
        this.statsElement = document.getElementById('stats');
    }

    update(currentTargetIndex, rocketFuel, satellites) {
        this.infoElement.innerHTML = `Uzay Simülasyonu`;
        this.statsElement.innerHTML = `
            <strong>Roket Yakıt:</strong> ${rocketFuel.toFixed(1)}<br>
            <strong>Uydu Yakıt Durumu:</strong><br>
            ${satellites.map((sat, i) => 
                `Uydu ${i + 1}: ${sat.fuel.toFixed(1)}`
            ).join('<br>')}
        `;
    }
}
