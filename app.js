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

  const numberFields = [
    { input: inputPh, label: "pH", min: 0, max: 14, unit: "" },
    { input: inputEc, label: "EC", min: 0, max: 10, unit: " mS/cm" },
    { input: inputTemp, label: "Temperature", min: -40, max: 140, unit: " °F" },
    { input: inputHumidity, label: "Humidity", min: 0, max: 100, unit: "%" },
  ];

  const statusLevels = {
    Optimal: "optimal",
    Warning: "warning",
    "Critical Hazard": "critical",
  };

  let readings = loadReadings();

  render();

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

  function evaluateStatus(ph, ec, temp, humidity) {
    if (
      ph < 5 || ph > 7 ||
      ec < 0.5 || ec > 3.5 ||
      temp < 55 || temp > 90 ||
      humidity < 40 || humidity > 80
    ) {
      return { level: "critical", label: "Critical Hazard" };
    }
    if (
      ph < 5.5 || ph > 6.5 ||
      ec < 1 || ec > 2.5 ||
      temp < 65 || temp > 80 ||
      humidity < 50 || humidity > 70
    ) {
      return { level: "warning", label: "Warning" };
    }
    return { level: "optimal", label: "Optimal" };
  }

  function validateInputs() {
    const errors = [];

    if (!inputBay.value) {
      errors.push("Please select a bay.");
      inputBay.classList.add("input-invalid");
    } else {
      inputBay.classList.remove("input-invalid");
    }

    numberFields.forEach(function (field) {
      const value = parseFloat(field.input.value);
      if (isNaN(value) || value < field.min || value > field.max) {
        errors.push(
          `${field.label} must be a number between ${field.min} and ${field.max}${field.unit}.`,
        );
        field.input.classList.add("input-invalid");
      } else {
        field.input.classList.remove("input-invalid");
      }
    });

    return errors;
  }

  function displayError(messages) {
    errorMessage.innerHTML = "";
    const list = document.createElement("ul");
    messages.forEach(function (message) {
      const item = document.createElement("li");
      item.textContent = message;
      list.appendChild(item);
    });
    errorMessage.appendChild(list);
    errorMessage.classList.remove("hidden");
  }

  function hideError() {
    errorMessage.innerHTML = "";
    errorMessage.classList.add("hidden");
  }

  sensorForm.addEventListener("input", function (event) {
    const field = numberFields.find(function (item) {
      return item.input === event.target;
    });

    if (field) {
      const value = parseFloat(field.input.value);
      const outOfRange =
        field.input.value !== "" &&
        (isNaN(value) || value < field.min || value > field.max);
      field.input.classList.toggle("input-invalid", outOfRange);
    }

    if (event.target === inputBay && inputBay.value) {
      inputBay.classList.remove("input-invalid");
    }

    if (!errorMessage.classList.contains("hidden")) {
      const errors = validateInputs();
      if (errors.length > 0) {
        displayError(errors);
      } else {
        hideError();
      }
    }
  });

  sensorForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const errors = validateInputs();
    if (errors.length > 0) {
      displayError(errors);
      return;
    }

    hideError();

    const ph = parseFloat(inputPh.value);
    const ec = parseFloat(inputEc.value);
    const temp = parseFloat(inputTemp.value);
    const humidity = parseFloat(inputHumidity.value);

    const reading = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
      bay: inputBay.value,
      ph: ph,
      ec: ec,
      temp: temp,
      humidity: humidity,
      status: evaluateStatus(ph, ec, temp, humidity).label,
      timestamp: new Date().toLocaleString(),
    };

    readings.unshift(reading);
    saveReadings();

    sensorForm.reset();
    inputBay.focus();
    render();
  });

  logList.addEventListener("click", function (event) {
    if (event.target.classList.contains("btn-delete")) {
      const readingId = event.target.dataset.id;
      readings = readings.filter(function (reading) {
        return reading.id !== readingId;
      });
      saveReadings();
      render();
    }
  });

  btnClear.addEventListener("click", function () {
    if (readings.length === 0) return;
    if (confirm("Are you sure you want to delete all sensor logs?")) {
      readings = [];
      saveReadings();
      render();
    }
  });

  function render() {
    logCount.textContent = readings.length;

    if (readings.length === 0) {
      emptyMessage.classList.remove("hidden");
      logList.innerHTML = "";
      return;
    }

    emptyMessage.classList.add("hidden");

    const fragment = document.createDocumentFragment();

    readings.forEach(function (reading) {
      const level = statusLevels[reading.status] || "optimal";

      const li = document.createElement("li");
      li.className = "log-card status-" + level;

      const top = document.createElement("div");
      top.className = "card-top";

      const bay = document.createElement("h3");
      bay.textContent = reading.bay;

      const tag = document.createElement("span");
      tag.className = "status-tag " + level;
      tag.textContent = reading.status;

      top.appendChild(bay);
      top.appendChild(tag);

      const values = document.createElement("p");
      values.className = "card-values";
      values.textContent =
        "pH " + reading.ph +
        " · EC " + reading.ec + " mS/cm" +
        " · " + reading.temp + " °F" +
        " · " + reading.humidity + "% RH";

      const time = document.createElement("p");
      time.className = "timestamp";
      time.textContent = "Recorded " + reading.timestamp;

      const deleteButton = document.createElement("button");
      deleteButton.type = "button";
      deleteButton.className = "btn btn-outline-danger btn-sm btn-delete";
      deleteButton.dataset.id = reading.id;
      deleteButton.textContent = "Delete";

      li.appendChild(top);
      li.appendChild(values);
      li.appendChild(time);
      li.appendChild(deleteButton);

      fragment.appendChild(li);
    });

    logList.innerHTML = "";
    logList.appendChild(fragment);
  }
})();
