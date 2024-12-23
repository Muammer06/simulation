export const CONSTANTS = {
    EARTH_RADIUS: 6371,
    GEO_ALTITUDE: 35786,
    GEO_ORBIT_RADIUS: 6371 + 35786,
    MOON_RADIUS: 1737,
    MOON_ORBIT_RADIUS: 384400,
    ROCKET_SPEED: 0.00000000000005,
    //MAX_TRAIL_LENGTH: 50,
    MAX_FUEL: 100000000000,
    FUEL_CONSUMPTION_RATE: 0.1,
    FUEL_TRANSFER_RATE: 100,
    SATELLITE_FUEL_CONSUMPTION_RATE: 0.01,
    SATELLITE_LIFETIME_MIN: 3, // Minimum ömür (yıl)
    SATELLITE_LIFETIME_MAX: 10, // Maksimum ömür (yıl)
    SIMULATION_START_DATE: '2024-01-01T00:00:00',
    SIMULATION_SPEED: 1, // Simülasyon hız faktörü
    SIMULATION_TIME_SCALE: 60, // 1 saniye = 1 dakika

    INITIAL_ROCKET_COUNT: 5, // İlk aşamada fırlatılacak roket sayısı
    MAX_ROCKET_GENERATIONS: 4,

    
    EARTH_ROTATION_PERIOD: 24 * 60 , // Dünya'nın dönüş süresi (saniye)
    SATELLITE_ORBIT_PERIOD: 24  , // Uydu yörünge süresi (saniye)
    YEAR_PERIOD: 365 * 24 * 60 * 60, // 1 yıl (saniye)
    MOON_ROTATION_PERIOD: 27 * 24 * 60 * 60, // Ay'ın dönüş süresi (saniye)

    EARTH_RADIUS: 6371,
    GEO_ALTITUDE: 35786,
    GEO_ORBIT_RADIUS: 6371 + 35786,
    NUM_SATELLITES: 30,
    ROCKET_SPEED: 1000,
    SIMULATION_SPEED: 1, // Zaman hız çarpanı
    MAX_TRAIL_LENGTH: 50,
    SATELLITE_FUEL_CONSUMPTION_RATE: 0.05,
    SECONDS_IN_A_DAY: 86400, // Bir gün = 24 saat = 86400 saniye
    EARTH_ROTATION_PERIOD: 86400, // Dünya 24 saatte bir tur atar (saniye cinsinden)
    SATELLITE_ORBIT_PERIOD: 86400, // Uydu 24 saatte bir tur atar (saniye cinsinden)
    YEAR_PERIOD: 31536000, // Bir yıl = 365 gün = 31,536,000 saniye
    MOON_ROTATION_PERIOD: 2332800,// Ay 27 günde bir tur atar (saniye cinsinden)
    SIMULATION_TIME_STEP: 1000, // Her iterasyonda geçen zaman (saniye)


    INITIAL_ROCKET_COUNT: 3,
    MAX_ITERATIONS: 50,
    MAX_FUEL: 1000,
    SATELLITE_VISIT_COST: 10,
    SIMULATION_SPEED: 1,


    TABU_ITERATIONS: 500,
    TABU_LIST_SIZE: 50,


    ROCKET_SPEED: 100,
    MAX_FUEL: 1000,


        SIMULATION_INITIAL_TIME: 3600, // 1 saat
        SIMULATION_TIME_STEP: 100, // Zaman adımı
        SATELLITE_ORBIT_PERIOD: 86400, // 24 saat
        SECONDS_IN_A_DAY: 86400,

    

};
