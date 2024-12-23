class InfoPanel {
    constructor() {
        // DOM elemanlarını doğrudan başlat
        this.routeElement = document.getElementById('route');
        this.costElement = document.getElementById('cost');
        this.statusElement = document.getElementById('status'); // Ek özellik için

        // Kontrol ve uyarı mekanizması
        this.checkElements();
    }

    /**
     * ✅ Gerekli DOM elemanlarının varlığını kontrol eder.
     */
    checkElements() {
        if (!this.routeElement) {
            console.error('❌ Hata: "route" elementi bulunamadı. Lütfen index.html dosyasını kontrol edin.');
        }
        if (!this.costElement) {
            console.error('❌ Hata: "cost" elementi bulunamadı. Lütfen index.html dosyasını kontrol edin.');
        }
        if (!this.statusElement) {
            console.warn('⚠️ Uyarı: "status" elementi tanımlı değil. Gelecekte ek bilgi gösterimleri için eklenebilir.');
        }
    }

    /**
     * 📍 Optimum rotayı günceller.
     * @param {Array} route - Optimum rota dizisi.
     */
    updateRoute(route) {
        if (!this.routeElement) {
            console.warn('⚠️ Rota elementi mevcut değil.');
            return;
        }

        if (!route || route.length === 0) {
            this.routeElement.innerHTML = `
                <h4>Optimum Rota</h4>
                ❌ Geçerli bir rota bulunamadı.
            `;
            return;
        }

        this.routeElement.innerHTML = `
            <h4>Optimum Rota</h4>
            ${route.map(node => node.name || 'Bilinmeyen').join(' → ')}
        `;
    }

    /**
     * 💰 Toplam maliyeti günceller.
     * @param {number} totalCost - Toplam maliyet.
     */
    updateCost(totalCost) {
        if (!this.costElement) {
            console.warn('⚠️ Maliyet elementi mevcut değil.');
            return;
        }

        this.costElement.innerHTML = `
            <h4>Toplam Maliyet</h4>
            ${totalCost === Infinity ? '∞' : totalCost.toFixed(2)} Birim
        `;
    }

    /**
     * 📊 Simülasyon durumunu günceller.
     * @param {string} status - Simülasyon durumu.
     */
    updateStatus(status) {
        if (!this.statusElement) {
            console.warn('⚠️ Durum elementi mevcut değil.');
            return;
        }

        this.statusElement.innerHTML = `
            <h4>Simülasyon Durumu</h4>
            ${status}
        `;
    }

    /**
     * 🔄 Tüm paneli sıfırlar.
     */
    reset() {
        if (this.routeElement) {
            this.routeElement.innerHTML = `
                <h4>Optimum Rota</h4>
                Henüz hesaplanmadı.
            `;
        }

        if (this.costElement) {
            this.costElement.innerHTML = `
                <h4>Toplam Maliyet</h4>
                Henüz hesaplanmadı.
            `;
        }

        if (this.statusElement) {
            this.statusElement.innerHTML = `
                <h4>Simülasyon Durumu</h4>
                Beklemede...
            `;
        }

        console.log('🔄 InfoPanel sıfırlandı.');
    }
}

export default InfoPanel;
