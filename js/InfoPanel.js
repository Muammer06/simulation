class InfoPanel {
    constructor() {
        this.infoElement = document.getElementById('info');
        this.statsElement = document.getElementById('stats');
    }

    update(currentTargetIndex) {
        this.infoElement.innerHTML = `Uzay Simülasyonu`;
        this.statsElement.innerHTML = 
            `Ziyaret Edilen Uydu: ${currentTargetIndex}/${CONSTANTS.NUM_SATELLITES}`;
    }
}