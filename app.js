(function () {
  "use strict";

  const STORAGE_KEY = "greenlog_sensor_readings_v1";

  const sensorForm = document.getElementById("sensor-form");
  const errorBanner = document.getElementById("form-error-banner");
  const readingsList = document.getElementById("readings-list");
  const logCount = document.getElementById("log-count");
  const emptyState = document.getElementById("empty-state");
  const btnClearAll = document.getElementById("btn-clear-all");

  const inputZone = document.getElementById("zone-name");
  const inputTemp = document.getElementById("air-temp");
  const inputHumidity = document.getElementById("humidity");
  const inputPh = document.getElementById("soil-ph");
  const inputEc = document.getElementById("soil-ec");
  const inputMoisture = document.getElementById("soil-moisture");

  let readings = loadReadings();

  function loadReadings() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Failed to load readings from storage", error);
      return [];
    }
  }

  function saveReadings() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(readings));
    } catch (error) {
      console.error("Failed to save readings to storage", error);
    }
  }
})();
