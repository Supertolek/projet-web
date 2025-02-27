const unitType = document.getElementById("unit-type");
const fromUnit = document.getElementById("from-unit");
const toUnit = document.getElementById("to-unit");
const inputValue = document.getElementById("input-value");
const result = document.getElementById("result");

const units = {
    length: { "Mètres": 1, "Kilomètres": 1000, "Centimètres": 0.01 },
    mass: { "Kilogrammes": 1, "Grammes": 0.001, "Tonnes": 1000 },
    temperature: { "Celsius": 1, "Fahrenheit": "F", "Kelvin": "K" }
};

function updateUnits() {
    fromUnit.innerHTML = "";
    toUnit.innerHTML = "";
    
    Object.keys(units[unitType.value]).forEach(unit => {
        fromUnit.innerHTML += `<option value="${unit}">${unit}</option>`;
        toUnit.innerHTML += `<option value="${unit}">${unit}</option>`;
    });
}

function convert() {
    let value = parseFloat(inputValue.value);
    if (isNaN(value)) return;
    
    let from = fromUnit.value;
    let to = toUnit.value;
    
    if (unitType.value === "temperature") {
        if (from === "Celsius" && to === "Fahrenheit") {
            value = value * 9/5 + 32;
        } else if (from === "Fahrenheit" && to === "Celsius") {
            value = (value - 32) * 5/9;
        } else if (from === "Celsius" && to === "Kelvin") {
            value = value + 273.15;
        } else if (from === "Kelvin" && to === "Celsius") {
            value = value - 273.15;
        }
    } else {
        value = value * (units[unitType.value][to] / units[unitType.value][from]);
    }
    
    result.textContent = `Résultat : ${value.toFixed(2)} ${to}`;
}

unitType.addEventListener("change", updateUnits);
window.onload = updateUnits;
