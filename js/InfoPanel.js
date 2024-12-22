class InfoPanel {
    constructor() {
        this.infoElement = document.getElementById('info');
        this.statsElement = document.getElementById('stats');
    }

    update(currentTargetIndex, rocketFuel, satellites, simulationTime) {
        const elapsedDays = Math.floor(simulationTime / CONSTANTS.SECONDS_IN_A_DAY);
        const elapsedHours = Math.floor((simulationTime % CONSTANTS.SECONDS_IN_A_DAY) / 3600);
        const elapsedMinutes = Math.floor((simulationTime % 3600) / 60);
    
        this.infoElement.innerHTML = `
            Uzay Simülasyonu<br>
            Simülasyon Zamanı: ${elapsedDays} gün, ${elapsedHours} saat, ${elapsedMinutes} dakika
        `;
    
        this.statsElement.innerHTML = `
            <strong>Simülasyon Hızı:</strong> ${CONSTANTS.SIMULATION_SPEED}x<br>
            <strong>Roket Yakıt:</strong> ${rocketFuel.toFixed(1)}<br>
            <strong>Uydu Bilgileri:</strong><br>
            ${satellites.map((sat, i) => 
                `Uydu ${i + 1}: Yaş: ${sat.age.toFixed(2)} gün, Kalan Ömür: ${sat.getRemainingLifetime()} yıl`
            ).join('<br>')}
        `;
    }
    
    
    
    
    
}
