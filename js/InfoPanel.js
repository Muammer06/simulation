class InfoPanel {
    constructor() {
        this.infoElement = document.getElementById('info');
        this.statsElement = document.getElementById('stats');
        this.costElement = document.getElementById('cost');
        this.routeElement = document.getElementById('route');
    }

    /**
     * @param {number} currentTargetIndex - Roketin mevcut hedef uydu indeksi.
     * @param {number} rocketFuel - Roketin mevcut yakıt miktarı.
     * @param {Array} satellites - Simülasyondaki tüm uyduların listesi.
     * @param {number} simulationTime - Simülasyonun toplam geçen zamanı (saniye cinsinden).
     */
    update(currentTargetIndex, rocketFuel, satellites, simulationTime) {
        const elapsedDays = Math.floor(simulationTime / CONSTANTS.SECONDS_IN_A_DAY);
        const elapsedHours = Math.floor((simulationTime % CONSTANTS.SECONDS_IN_A_DAY) / 3600);
        const elapsedMinutes = Math.floor((simulationTime % 3600) / 60);
    
        this.infoElement.innerHTML = `
            <h3>Uzay Simülasyonu</h3>
            <strong>Simülasyon Zamanı:</strong> ${elapsedDays} gün, ${elapsedHours} saat, ${elapsedMinutes} dakika<br>
            <strong>Simülasyon Hızı:</strong> ${CONSTANTS.SIMULATION_SPEED}x
        `;
    
        this.statsElement.innerHTML = `
            <h4>Roket Bilgileri</h4>
            <strong>Mevcut Hedef:</strong> ${currentTargetIndex + 1}<br>
            <strong>Yakıt Seviyesi:</strong> ${rocketFuel.toFixed(1)} L<br>
            <h4>Uydu Bilgileri</h4>
            ${satellites.map((sat, i) => {
                const remainingLifetime = sat.getRemainingLifetime();
                return `<strong>Uydu ${i + 1}:</strong> 
                    Yaş: ${sat.age.toFixed(2)} gün, 
                    Kalan Ömür: ${(typeof remainingLifetime === 'number' ? remainingLifetime.toFixed(2) : 'N/A')} yıl, 
                    Yakıt: ${sat.fuel.toFixed(1)} L`;
            }).join('<br>')}
        `;
    }
    

    /**
     * TABU Search toplam maliyet bilgisini günceller.
     * @param {number} totalCost - Hesaplanan toplam maliyet.
     */
    updateCost(totalCost) {
        this.costElement.innerHTML = `
            <h4>Optimizasyon Maliyeti</h4>
            <strong>Toplam Maliyet:</strong> ${totalCost.toFixed(2)}
        `;
    }

    /**
     * TABU Search tarafından belirlenen rota bilgisini gösterir.
     * @param {Array} route - Optimize edilmiş rota dizisi.
     */
    updateRoute(route) {
        this.routeElement.innerHTML = `
            <h4>Optimum Rota</h4>
            ${route.map(node => node.name).join(' → ')}
        `;
    }
}
