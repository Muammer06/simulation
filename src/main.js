import './constants.js';
import './Earth.js';
import './Moon.js';
import './SceneManager.js';
import './InfoPanel.js';
import Rocket from './Rocket.js';
import Satellite from './Satellite.js';
import { SpaceSimulation } from './SpaceSimulation.js';

let simulation; // Global olarak simulation değişkeni tanımlandı

document.addEventListener('DOMContentLoaded', () => {
    simulation = new SpaceSimulation(); // Global nesneye atandı
    simulation.initializeScene();

    // 🌍 DOM Elemanları Kontrolü
    const simulateButton = document.getElementById('simulateAndOptimize');
    const startButton = document.getElementById('startSimulation');
    const stopButton = document.getElementById('stopSimulation');
    const resetButton = document.getElementById('resetSimulation');
    const satelliteInput = document.getElementById('satelliteCount');
    const rocketInput = document.getElementById('rocketCount');
    const iterationInput = document.getElementById('iterationCount');
    const fuelInput = document.getElementById('fuelAmount');

    if (!simulateButton || !startButton || !stopButton || !resetButton || !satelliteInput || !rocketInput || !iterationInput || !fuelInput) {
        console.error('❌ Hata: Gerekli DOM elemanları bulunamadı. Lütfen HTML dosyasını kontrol edin.');
        return;
    }

    // 🌍 Simülasyonu Başlat ve Rota Hesapla
    simulateButton.addEventListener('click', async () => {
        const satelliteCount = parseInt(satelliteInput.value) || 10;
        const rocketCount = parseInt(rocketInput.value) || 5;
        const iterationCount = parseInt(iterationInput.value) || 10;
        const fuelAmount = parseFloat(fuelInput.value) || 1000;

        console.log(`🛰️ Uydu Sayısı: ${satelliteCount}`);
        console.log(`🚀 Roket Sayısı: ${rocketCount}`);
        console.log(`🔄 İterasyon Sayısı: ${iterationCount}`);
        console.log(`⛽ Yakıt Miktarı: ${fuelAmount} L`);

        simulation.reset();

        // 🛰️ Uyduları oluştur
        simulation.satellites = [];
        for (let i = 0; i < satelliteCount; i++) {
            const satellite = new Satellite(i);
            simulation.satellites.push(satellite);
            simulation.sceneManager.addSatellite(satellite);
        }

        // 🚀 Roketleri oluştur
        simulation.rockets = [];
        for (let i = 0; i < rocketCount; i++) {
            const rocket = new Rocket(i, fuelAmount);
            simulation.rockets.push(rocket);
            simulation.sceneManager.addRocket(rocket);
        }

        await simulation.optimizeRouteWithTabuSearch();
        // 🌟 Görsel Güncelleme
        simulation.sceneManager.render();
    });

    // 🚀 Simülasyonu Başlat
    startButton.addEventListener('click', () => {
        console.log(`▶️ Simülasyon Başlatılıyor...`);
        simulation.startSimulation();
    });

    // 🛑 Simülasyonu Durdur
    stopButton.addEventListener('click', () => {
        console.log(`⏸️ Simülasyon Durduruldu.`);
        simulation.stopSimulation();
    });

    // 🔄 Simülasyonu Sıfırla
    resetButton.addEventListener('click', () => {
        console.log(`🔄 Simülasyon Sıfırlanıyor...`);
        simulation.reset();
    });
});
