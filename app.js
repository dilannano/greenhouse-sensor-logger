(function () {
  "use strict";

  const STORAGE_KEY = "greenlog_sensor_readings_v1";

  const sensorForm = document.getElementById("sensor-form");
  const errorMessage = document.getElementById("error-message");
  const logList = document.getElementById("log-list");
  const logCount = document.getElementById("log-count");
  const emptyMessage = document.getElementById("empty-message");
  const btnClear = document.getElementById("btn-clear");

  const inputBay = document.getElementById("bay");
  const inputPh = document.getElementById("ph");
  const inputEc = document.getElementById("ec");
  const inputTemp = document.getElementById("temp");
  const inputHumidity = document.getElementById("humidity");

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
