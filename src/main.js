

// Üç boyutlu kütüphane
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CONSTANTS } from './constants.js';  // <-- Dizininize uygun yol

// Lokal modülleriniz:
import './constants.js';
import './Earth.js';
import './Moon.js';
import './Satellite.js';
import './SceneManager.js';
import './InfoPanel.js';
import './SpaceSimulation.js';
import RocketMotion from './RocketMotion.js';
import Rocket from './Rocket.js';
import { SpaceSimulation } from './SpaceSimulation.js';

document.addEventListener('DOMContentLoaded', () => {
    console.log('Ana dosya başlatılıyor...');
    
    let simulation;
    
    try {
        simulation = new SpaceSimulation();
    } catch (error) {
        console.error('SpaceSimulation sınıfı başlatılamadı:', error);
        return;
    }

    // Uydu ve Roket sayısı girişlerini al
    const satelliteCountInput = document.getElementById('satelliteCount');
    const rocketCountInput = document.getElementById('initialRocketCount');
    const maxGenerationsInput = document.getElementById('maxGenerations');
    const simulationSpeedInput = document.getElementById('simulationSpeed');

    // Simülasyonu Başlat ve Rota Hesapla Butonu
    document.getElementById('simulateAndOptimize').addEventListener('click', async () => {
        const satelliteCount = parseInt(satelliteCountInput.value) || 30;
        const rocketCount = parseInt(rocketCountInput.value) || 5;
        const maxGenerations = parseInt(maxGenerationsInput.value) || 4;
        const simulationSpeed = parseFloat(simulationSpeedInput.value) || 1;
        
        if (!simulation) {
            console.error('Simülasyon nesnesi oluşturulamadı.');
            return;
        }
        
        simulation.reset();
        simulation.initialize(satelliteCount, rocketCount, maxGenerations, simulationSpeed);
        console.log('Simülasyon başlatıldı ve rota hesaplanıyor...');
    
        await simulation.optimizeRoute();
        console.log('Simülasyon ve rota hesaplama tamamlandı.');
    });
    

    // Simülasyonu Çalıştır Butonu
    document.getElementById('startSimulation').addEventListener('click', () => {
        if (!simulation || !simulation.optimizedRoute || simulation.optimizedRoute.length === 0) {
            console.warn('Simülasyon başlamadan önce rota hesaplanmalı!');
            return;
        }
        simulation.simulationRunning = true;
        simulation.animate();
    
        // Rotayı InfoPanel üzerinden göster
        simulation.infoPanel.updateRoute(simulation.optimizedRoute);
        console.log('Simülasyon çalıştırılıyor...');
    });
    

    // Simülasyonu Durdur Butonu
    document.getElementById('stopSimulation').addEventListener('click', () => {
        if (simulation) {
            simulation.simulationRunning = false;
            console.log('Simülasyon durduruldu.');
        }
    });

    // Simülasyonu Sıfırla Butonu
    document.getElementById('resetSimulation').addEventListener('click', () => {
        if (simulation) {
            simulation.reset();
            console.log('Simülasyon sıfırlandı.');
        }
    });

    // Simülasyon Hız Kontrolü
    simulationSpeedInput.addEventListener('input', (event) => {
        const newSpeed = parseFloat(event.target.value);
        if (!isNaN(newSpeed) && newSpeed > 0) {
            CONSTANTS.SIMULATION_SPEED = newSpeed;
            console.log(`Simülasyon Hızı: ${CONSTANTS.SIMULATION_SPEED}`);
        }
    });
});
