export const CONSTANTS = {
    // 🌍 Dünya ve Yörünge Parametreleri
    EARTH_RADIUS: 6371, // Dünya yarıçapı (km)
    GEO_ALTITUDE: 35786, // Jeostatik yörünge yüksekliği (km)
    GEO_ORBIT_RADIUS: 6371 + 35786, // Jeostatik yörünge yarıçapı (km)
    MOON_RADIUS: 1737, // Ay yarıçapı (km)
    MOON_ORBIT_RADIUS: 384400, // Dünya-Ay mesafesi (km)

    // 🚀 Roket Parametreleri
    INITIAL_ROCKET_COUNT: 5, // İlk aşamada fırlatılacak roket sayısı
    MAX_ROCKET_GENERATIONS: 4, // Maksimum roket nesil sayısı
    ROCKET_SPEED: 1000, // Roket hızı (birim/saniye)
    MAX_FUEL: 1000, // Roketin başlangıç yakıtı
    FUEL_CONSUMPTION_RATE: 0.1, // Birim mesafe başına yakıt tüketimi
    FUEL_TRANSFER_RATE: 10, // Uyduya aktarılacak maksimum yakıt

    // 🛰️ Uydu Parametreleri
    NUM_SATELLITES: 30, // Uydu sayısı
    SATELLITE_FUEL_CONSUMPTION_RATE: 0.05, // Uydu başına yakıt tüketimi
    SATELLITE_LIFETIME_MIN: 3, // Minimum uydu ömrü (yıl)
    SATELLITE_LIFETIME_MAX: 10, // Maksimum uydu ömrü (yıl)
    SATELLITE_ORBIT_PERIOD: 86400, // Uydu yörünge süresi (saniye)

    // 📊 Simülasyon Zamanı ve Hızı
    SIMULATION_START_DATE: '2024-01-01T00:00:00', // Simülasyon başlangıç tarihi
    SIMULATION_SPEED: 1, // Simülasyon hız faktörü
    SIMULATION_TIME_STEP: 1, // Simülasyon zaman aralığı (saniye)
    SIMULATION_INITIAL_TIME: 3600, // Simülasyon başlangıç zamanı (saniye)
    SECONDS_IN_A_DAY: 86400, // 1 gün = 24 saat = 86400 saniye
    YEAR_PERIOD: 31536000, // 1 yıl = 365 gün = 31,536,000 saniye
    MOON_ROTATION_PERIOD: 2332800, // Ay dönüş süresi (27 gün = 2,332,800 saniye)
    EARTH_ROTATION_PERIOD: 86400, // Dünya dönüş süresi (1 gün = 86,400 saniye)

    // ⚙️ TABU Search Parametreleri
    TABU_ITERATIONS: 100, // TABU Search maksimum iterasyon
    TABU_LIST_SIZE: 50, // TABU listesi maksimum boyut
    SATELLITE_VISIT_COST: 10, // Bir uyduyu ziyaret maliyeti

    // 📐 Diğer Parametreler
    MAX_TRAIL_LENGTH: 50, // Roket izi uzunluğu
    SIMULATION_TIME_SCALE: 60, // 1 saniye = 1 dakika
    MAX_ITERATIONS: 50, // Genel maksimum iterasyon
    SIMULATION_TIME_STEP_MS: 100 // Her adımda geçen süre (milisaniye)
};
