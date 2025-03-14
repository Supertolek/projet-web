// Thomas
import { calculate, result } from "./calculator.js";

// Récupération des éléments du DOM
const my_graph = document.getElementById("my-graph");
const variable_x = document.getElementById("x-value");
const min_truc = document.getElementById("min-value");
const max_truc = document.getElementById("max-value");
const step_truc = document.getElementById("step-value");

// Initialisation du graphique
const my_chart = new Chart("my-graph", {
    type: "line",
    data: {
        labels: [],
        datasets: [{
            data: []
        }]
    }
});

// Fonction pour tracer le graphique
function plot_graph(x_values, y_values) {
    my_chart.data.labels = x_values;
    my_chart.data.datasets[0].data = y_values;
    my_chart.update();
}

// Ajout d'un écouteur d'événement pour le clic sur le graphique
my_graph.addEventListener("click", (e) => {
    // Récupération du domaine
    let min_value = min_truc.value;
    let max_value = max_truc.value;
    let step_value = parseFloat(step_truc.value);
    [min_value, max_value] = [Math.min(min_value, max_value), Math.max(min_value, max_value)];
    step_value = step_value == 0 ? 1 : step_value;
    console.log("min_value = ", min_value);
    console.log("max_value = ", max_value);
    console.log("step_value = ", step_value);
    // Récupération des valeurs
    let x_values = [];
    let y_values = [];
    for (let index = min_value; index <= max_value; index += step_value) {
        variable_x.value = index;
        calculate(false)
        x_values.push(index.toPrecision(3));
        y_values.push(result);
    }
    // Tracer le graphique
    console.log("y_values = ", y_values);
    plot_graph(x_values, y_values);
})

export { my_chart };