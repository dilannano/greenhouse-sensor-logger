# Greenhouse Sensor Logger

A single-page greenhouse sensor dashboard built with HTML5, CSS3 and Vanilla JavaScript (ES6+). Users record pH, EC, temperature and humidity readings for a greenhouse bay. Each reading is validated, classified as **Optimal**, **Warning** or **Critical Hazard**, rendered as a log card, and saved to `localStorage` so it survives page reloads.

CSI 3150 – Assignment 2B. No frameworks, libraries or CSS utilities are used.

## How to Run

1. Clone or download this repository.
2. Open `index.html` in any modern browser.

No build step or server is needed.

## File Structure

```text
├── index.html   # Page structure (semantic HTML5)
├── styles.css   # Layout and styling (Flexbox + Grid)
├── app.js       # Validation, classification, rendering, storage (wrapped in an IIFE)
└── README.md    # Project overview + Assignment 2A design response
```

---

# Assignment 2A Design Response

## 4.1 User Flow

**Starting State:** The user lands on the Greenhouse Sensor Logger page. The page shows the header with the total log count, the "Record Sensor Reading" form on the left, and the "Sensor Logs" section on the right, which displays "No readings yet." if there are no saved logs.

**Action 1:** The user selects a bay and enters pH, EC, temperature, and humidity values into the form. The number inputs use minimum, maximum, and step constraints, and any value out of range turns the input border red.

**Action 2:** The user clicks the "Record Reading" button. JavaScript checks that all fields are valid, calculates the status, saves the log to localStorage, and clears the form.

**Action 3:** A new log card appears in the Sensor Logs section showing the bay, readings, time, and a status tag of "Optimal," "Warning," or "Critical Hazard."

**Action 4:** The user clicks "Delete" on a card to remove one log, or clicks "Clear All" to remove every log.

**Terminal State:** The Sensor Logs section shows only the logs the user kept, and the form is empty and ready for the next reading. The logs stay saved after refreshing the page.

## 4.2 Norman Design Principles

| Principle / Concept | System Context | Response |
|---|---|---|
| **Gulf of Execution** | Typing numeric sensor metrics (pH, Electrical Conductivity [EC], Temp, Humidity) | Each input has a label that includes its unit, like "EC (mS/cm)" or "Temp °F", so the user knows exactly what to enter and in which unit. The placeholder shows an example value, like 6.0 for pH, so the user can see the expected format before typing. The inputs also use `type="number"` with a step value, which tells the user to enter a number and how many decimal places to use. |
| **Gulf of Evaluation** | Ingesting sensor values after clicking "Record Reading" | After the user clicks "Record Reading," JavaScript calculates the status and immediately adds a new log card to the list. The card shows a status tag that says "Optimal," "Warning," or "Critical Hazard," colored green, yellow, or red so the user can tell the result at a glance. |
| **System Constraint** | E.g. Water pH boundaries (0.0 ≤ pH ≤ 14.0) | Each input uses the `type="number"`, `min`, `max`, `step`, and `required` attributes. For example, pH has `min="0" max="14" step="0.1"`, and EC and humidity have `min="0"` so negative values aren't allowed. When the form is submitted, JavaScript also checks that each value is a number within its min and max; if any value fails, it shows an error message and the log is not saved. |
| **Visual Feedback State** | Real-time input error / out-of-bounds | An `input` event listener checks each value as the user types. If the number is outside the allowed range, JavaScript adds an `input-invalid` class to the field, which turns its border red. Once the user fixes the value, the class is removed and the border goes back to normal. |
| **Error Recovery** | Accidental or test data submissions | Each log card has its own "Delete" button, so the user can remove one bad or test record without affecting the others. There is also a "Clear All" button that removes every log from the page and from localStorage at once. |

## 4.3 Component Tree

`[STATIC]` = written in the HTML file. `[DYNAMIC]` = created or changed by JavaScript. `(Event:)` = element has an event listener.

```text
<body> (CSS: flex, column) [STATIC]
├── <header class="site-header"> [STATIC]
│   └── <div class="header-inner"> (CSS: flex, row, space-between) [STATIC]
│       ├── <div class="brand"> 🌱 + <h1> "Greenhouse Sensor Logger" [STATIC]
│       └── <p class="header-status"> "Total Logs:" [STATIC]
│           └── <span id="log-count" class="count-badge"> number of logs [DYNAMIC]
├── <main class="dashboard"> (CSS: grid, 1fr 2fr; 1 column on mobile) [STATIC]
│   ├── <section class="panel form-panel"> [STATIC]
│   │   ├── <h2> "Record Sensor Reading" [STATIC]
│   │   ├── <div id="error-message" class="alert alert-error hidden" role="alert"> list of error messages [DYNAMIC]
│   │   └── <form id="sensor-form" novalidate> (CSS: flex, column) [STATIC] (Event: submit) (Event: input)
│   │       ├── <div class="form-group"> [STATIC]
│   │       │   ├── <label for="bay"> "Bay *" [STATIC]
│   │       │   └── <select id="bay" required> "Select a bay", Bay 1–4 [STATIC]
│   │       ├── <div class="form-row"> (CSS: flex, row) [STATIC]
│   │       │   ├── <div class="form-group"> <label for="ph"> "pH *" + <input id="ph" type="number" min="0" max="14" step="0.1" placeholder="6.0" required> [STATIC]
│   │       │   └── <div class="form-group"> <label for="ec"> "EC (mS/cm) *" + <input id="ec" type="number" min="0" max="10" step="0.1" placeholder="1.5" required> [STATIC]
│   │       ├── <div class="form-row"> (CSS: flex, row) [STATIC]
│   │       │   ├── <div class="form-group"> <label for="temp"> "Temp (°F) *" + <input id="temp" type="number" min="-40" max="140" step="0.1" placeholder="68" required> [STATIC]
│   │       │   └── <div class="form-group"> <label for="humidity"> "Humidity (%) *" + <input id="humidity" type="number" min="0" max="100" step="1" placeholder="60" required> [STATIC]
│   │       └── <button type="submit" id="btn-submit" class="btn btn-primary btn-block"> "Record Reading" [STATIC]
│   └── <section class="panel log-panel"> [STATIC]
│       ├── <div class="log-header"> (CSS: flex, row, space-between) [STATIC]
│       │   ├── <h2> "Sensor Logs" [STATIC]
│       │   └── <button id="btn-clear" class="btn btn-outline-danger btn-sm"> "Clear All" [STATIC] (Event: click)
│       ├── <p id="empty-message" class="empty-state"> "No readings yet." [STATIC, shown/hidden by JS]
│       └── <ul id="log-list" class="readings-grid"> (CSS: grid, auto-fill) [STATIC] (Event: click, delegated for delete buttons)
│           └── <li class="log-card status-optimal|warning|critical"> (CSS: flex, column) [DYNAMIC] (one card per log)
│               ├── <div class="card-top"> (CSS: flex, row, space-between) [DYNAMIC]
│               │   ├── <h3> bay name [DYNAMIC]
│               │   └── <span class="status-tag"> "Optimal" / "Warning" / "Critical Hazard" [DYNAMIC]
│               ├── <p class="card-values"> pH, EC, Temp, Humidity values [DYNAMIC]
│               ├── <p class="timestamp"> time recorded [DYNAMIC]
│               └── <button class="btn btn-outline-danger btn-sm btn-delete" data-id="..."> "Delete" [DYNAMIC]
└── <footer class="site-footer"> [STATIC]
    └── <p> "CSI 3150 Assignment 2" [STATIC]
```

## 4.4 Data Schema

```js
const sensorLogSchema = {
  id: "String",        // Unique identifier for each log
  bay: "String",       // Greenhouse bay, e.g. "Bay 2"
  ph: "Number",        // pH value (0 - 14)
  ec: "Number",        // Electrical conductivity in mS/cm
  temp: "Number",      // Air temperature in °F
  humidity: "Number",  // Relative humidity in %
  status: "String",    // "Optimal", "Warning", or "Critical Hazard"
  timestamp: "String"  // Date and time the reading was recorded
};
```

All logs are stored in an array and saved to localStorage under the key `greenlog_sensor_readings_v1`.

## Status Classification Rules

A reading is checked against the Critical bounds first, then the Warning bounds. If any single value falls outside a range, that status applies.

| Metric | Optimal | Warning | Critical Hazard |
|---|---|---|---|
| pH | 5.5 – 6.5 | 5.0 – 5.4 or 6.6 – 7.0 | < 5.0 or > 7.0 |
| EC (mS/cm) | 1.0 – 2.5 | 0.5 – 0.9 or 2.6 – 3.5 | < 0.5 or > 3.5 |
| Temp (°F) | 65 – 80 | 55 – 64 or 81 – 90 | < 55 or > 90 |
| Humidity (%) | 50 – 70 | 40 – 49 or 71 – 80 | < 40 or > 80 |

Boundary values count toward the better tier (e.g. pH 5.5 is Optimal, pH 5.0 is Warning, pH 7.0 is Warning).
