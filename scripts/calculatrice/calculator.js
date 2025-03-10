// Thomas
import { Parser } from "../../modules/expr-eval-master/index.js";

// Définir des constantes pour différents types d'entrées
const NUMBERS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "."];
const FUNCTIONS = ["sin", "asin", "cos", "acos", "tan", "atan", "log10", "ln", "fact"];
const CONSTANTS = ["pi", "e", "x", "a", "b", "i"];
const OPERATORS = ["+", "-", "*", "/", "^"];
const UNARY_OPERATORS = ["!", "^2", "^3"]
const PARENTHESIS = ["(", ")"]
const NEW_VALUE = NUMBERS + FUNCTIONS + CONSTANTS;

// Obtenir des références aux éléments du DOM
const calcul_display = document.getElementById("calcul-display");
const calcul_display_base = document.getElementById("calcul-display-base");
const calcul_display_current = document.getElementById("calcul-display-current");
const calcul_display_autocomplete = document.getElementById("calcul-display-autocomplete");
const calcul_output = document.getElementById("calcul-output");
const variable_x = document.getElementById("x-value");
const variable_a = document.getElementById("a-value");
const variable_b = document.getElementById("b-value");
const history = document.getElementById("history");

// Initialiser le parser
const parser = new Parser();

// Initialiser les variables
var result = ""
var calcul = "";
var current_token = ""
var current_token_type = ""
var opened_parenthesis = ""

// Fonction pour ajouter un calcul à l'historique
function history_add(stored_calcul, stored_result) {
    let history_item = document.createElement("p");
    history_item.innerText = stored_calcul + " = " + stored_result;
    history_item.classList.add("history-item");
    history_item.dataset.calculus = calcul + current_token + opened_parenthesis;
    history.appendChild(history_item);
    history_item.addEventListener("click", (e) => {
        calcul = history_item.dataset.calculus;
        current_token = "";
        current_token_type = "";
        opened_parenthesis = "";
        calcul_display_base.innerText = calcul;
        calcul_display_current.innerText = current_token;
        calcul_display_autocomplete.innerText = opened_parenthesis;
        calculate(false);
        calcul_output.innerText = result;
    })
}

// Fonction pour calculer le résultat de l'expression actuelle
function calculate(save_to_history = false) {
    let x = parseFloat(variable_x.value);
    let a = parseFloat(variable_a.value);
    let b = parseFloat(variable_b.value);
    console.log(x, a, b);
    console.log("calcul = ", calcul + current_token + opened_parenthesis)
    try {
        result = Parser.evaluate(calcul + current_token + opened_parenthesis, { pi: Math.PI, e: Math.E, x: x, a: a, b: b });
        console.log("result = ", result);
        if (save_to_history) {
            history_add(calcul + current_token + opened_parenthesis, result);
            console.log("window.localStorage.getItem(\"history-length\") :", window.localStorage.getItem("history-length"))
            window.localStorage.setItem("history-" + window.localStorage.getItem("history-length"), calcul + current_token + opened_parenthesis);
            window.localStorage.setItem("history-length", parseInt(window.localStorage.getItem("history-length")) + 1);
        }
        return true
    } catch ({ name, message }) {
        console.log(name, message)
        result = name
        return false;
    }
}

// Fonction pour gérer les pressions sur les boutons de la calculatrice
function handle_button_press(char_id) {
    /* Cette fonction est appelée lorsqu'un bouton de la calculatrice est cliqué.
    Elle vérifie si l'action est possible et l'ajoute au calcul. */
    if (char_id == "eq") {
        return calculate(true);
    }
    if (char_id == "clear") {
        calcul = "";
        current_token = "";
        current_token_type = "";
        opened_parenthesis = "";
        return true;
    }
    if (char_id == "Backspace") {
        console.log("Backspace pressé")
        if (current_token) {
            console.log("ct")
            current_token = current_token.substring(0, current_token.length - 1);
        } else {
            if (calcul[calcul.length - 1] == "(") {
                opened_parenthesis = opened_parenthesis.substring(0, opened_parenthesis.length - 1);
            } else if (calcul[calcul.length - 1] == ")") {
                opened_parenthesis += ")";
            }
            calcul = calcul.substring(0, calcul.length - 1);
        }
        return true;
    }

    // Gérer différents types d'entrées en fonction du type de jeton actuel
    if (current_token_type == "num") {
        // Le dernier jeton est un nombre, considérer les entrées avec ceci
        if (NUMBERS.includes(char_id)) {
            // Toujours en train d'écrire un nombre
            current_token += char_id;
            console.log("0 -> 0");
        } else if (CONSTANTS.includes(char_id)) {
            // C'est une constante
            calcul += current_token + "*";
            current_token = char_id;
            current_token_type = "const";
        } else if (OPERATORS.includes(char_id)) {
            // Faire un calcul avec le dernier nombre
            calcul += current_token;
            current_token = char_id;
            current_token_type = "op";
        } else if (FUNCTIONS.includes(char_id)) {
            // Utiliser une fonction, mettre le nombre d'entrée à l'intérieur de la fonction
            calcul += char_id + "(";
            opened_parenthesis += ")";
        } else if (char_id == "p-open") {
            // Gestion des parenthèses, ouvrir et fermer
            calcul += "(";
            opened_parenthesis += ")";
        } else if (char_id == "p-close") {
            // Gestion des parenthèses, ouvrir et fermer
            calcul += current_token + ")";
            current_token = ""
            current_token_type = "p-close"
            opened_parenthesis = opened_parenthesis.substring(0, opened_parenthesis.length - 1);
        } else if (UNARY_OPERATORS.includes(char_id)) {
            current_token += char_id;
            current_token_type = "const";
        } else {
            // Alerter que l'entrée a échoué
            return false;
        }
        // Retourner le succès
        return true;
    }
    if (current_token_type == "const") {
        // Le dernier jeton est une constante, considérer les entrées avec ceci
        if (NUMBERS.includes(char_id)) {
            // Toujours en train d'écrire un nombre
            calcul += current_token + "*";
            current_token = char_id;
            current_token_type = "num";
        } else if (CONSTANTS.includes(char_id)) {
            // C'est une constante
            calcul += current_token + "*";
            current_token = char_id;
            current_token_type = "const";
        } else if (OPERATORS.includes(char_id)) {
            // Faire un calcul avec la dernière constante
            calcul += current_token;
            current_token = char_id;
            current_token_type = "op";
        } else if (FUNCTIONS.includes(char_id)) {
            // Utiliser une fonction, mettre la constante d'entrée à l'intérieur de la fonction
            calcul += char_id + "(";
            opened_parenthesis += ")";
        } else if (char_id == "p-open") {
            // Gestion des parenthèses, ouvrir et fermer
            calcul += "(";
            opened_parenthesis += ")";
        } else if (char_id == "p-close") {
            // Gestion des parenthèses, ouvrir et fermer
            calcul += current_token + ")";
            current_token = ""
            current_token_type = "p-close"
            opened_parenthesis = opened_parenthesis.substring(0, opened_parenthesis.length - 1);
        } else if (UNARY_OPERATORS.includes(char_id)) {
            current_token += char_id;
            current_token_type = "const";
        } else {
            // Alerter que l'entrée a échoué
            return false;
        }
        // Retourner le succès
        return true;
    }
    if (current_token_type == "op") {
        // Le dernier jeton est un opérateur
        if (NUMBERS.includes(char_id)) {
            // Le nouveau jeton est un nombre. Faire ainsi
            calcul += current_token;
            current_token = char_id;
            current_token_type = "num";
        } else if (CONSTANTS.includes(char_id)) {
            // C'est une constante
            calcul += current_token;
            current_token = char_id;
            current_token_type = "const";
        } else if (FUNCTIONS.includes(char_id)) {
            // Le nouveau jeton est une fonction
            calcul += current_token;
            calcul += char_id + "(";
            opened_parenthesis += ")";
            current_token_type = "p-open";
        } else if (char_id == "-") {
            calcul += current_token + "(-";
            current_token = "";
            current_token_type = "p-open";
            opened_parenthesis += ")";
        } else if (char_id == "p-open") {
            // Une parenthèse est ajoutée.
            calcul += current_token + "(";
            current_token == "";
            current_token_type = "p-open";
            opened_parenthesis += ")";
        } else {
            return false;
        }
        return true;
    }
    if (current_token_type == "p-open" || current_token_type == "") {
        // Le dernier jeton est une parenthèse
        if (NUMBERS.includes(char_id)) {
            // Le nouveau jeton est un nombre. Faire ainsi
            current_token = char_id;
            current_token_type = "num";
            console.log("... ( -> 0");
        } else if (CONSTANTS.includes(char_id)) {
            // C'est une constante
            current_token = char_id;
            current_token_type = "const";
        } else if (FUNCTIONS.includes(char_id)) {
            // Le nouveau jeton est une fonction
            calcul += char_id + "(";
            opened_parenthesis += ")";
            current_token_type = "p-open";
        } else if (char_id == "p-open") {
            // Gestion des parenthèses, ouvrir et fermer
            calcul += "(";
            opened_parenthesis += ")";
        } else if (char_id == "p-close") {
            // Gestion des parenthèses, ouvrir et fermer
            calcul += current_token + ")";
            current_token = "";
            current_token_type = "p-close";
            opened_parenthesis = opened_parenthesis.substring(0, opened_parenthesis.length - 1);
        } else if (char_id == "-") {
            current_token = "-";
            current_token_type = "op";
        } else {
            return false;
        }
        return true;
    }
    if (current_token_type == "p-close") {
        if (NUMBERS.includes(char_id)) {
            // Un nombre!
            calcul += "*";
            current_token = char_id;
            current_token_type = "num";
        } else if (OPERATORS.includes(char_id)) {
            current_token = char_id;
            current_token_type = "op";
        } else if (FUNCTIONS.includes(char_id)) {
            calcul += "*" + char_id + "(";
            current_token = "";
            current_token_type = "p-open";
            opened_parenthesis += ")";
        } else {
            return false;
        }
    }
}

// Fonction pour configurer la calculatrice
function setup_calculator() {
    var calculator_buttons = document.getElementsByClassName("calculator-button");
    console.log(calculator_buttons);
    // Ajouter un eventListener pour chaque bouton.
    for (let button_index = 0; button_index < calculator_buttons.length; button_index++) {
        const button = calculator_buttons[button_index];

        button.addEventListener("click", function () {
            console.log("____________________")
            handle_button_press(this.id);
            console.log("this.id = ", this.id);
            console.log("current_token = ", current_token)
            console.log("calcul = ", calcul);
            calcul_display_base.innerText = calcul;
            calcul_display_current.innerText = current_token;
            calcul_display_autocomplete.innerText = opened_parenthesis;
            calcul_output.innerText = result;
        });
    }

    // Ajouter des écouteurs d'événements pour les entrées de variables
    variable_x.addEventListener("input", (e) => {
        console.log("____________________")
        if (calculate(false)) {
            calcul_output.innerText = result;
        }
    });
    variable_a.addEventListener("input", (e) => {
        console.log("____________________")
        if (calculate(false)) {
            calcul_output.innerText = result;
        }
    });
    variable_b.addEventListener("input", (e) => {
        console.log("____________________")
        if (calculate(false)) {
            calcul_output.innerText = result;
        }
    })

    // Charger l'historique à partir du stockage local
    if (window.localStorage.getItem("history-length") === null) {
        window.localStorage.setItem("history-length", "0");
    } else {
        for (let index = 0; index < window.localStorage.getItem("history-length"); index++) {
            const element = window.localStorage.getItem("history-" + index.toString());
            calcul = element;
            calculate(false);
            history_add(calcul, result);
        }
        calcul = "";
    }

    // Ajouter un écouteur d'événements pour l'entrée du clavier
    window.onkeyup = function (e) {
        console.log(e.target.tagName)
        if (e.target.tagName != "INPUT") {
            if (!(e.ctrlKey || e.metaKey)) {
                // 653*sin((x*x*x*a/(983*x*tan(81/360*2*pi)/1)/1)^.5)
                let key_pressed = e.key;
                key_pressed = key_pressed == "," ? "." : key_pressed;
                key_pressed = key_pressed == "Enter" ? "eq" : key_pressed;
                key_pressed = key_pressed == "c" ? "clear" : key_pressed;
                key_pressed = key_pressed == "(" ? "p-open" : key_pressed;
                key_pressed = key_pressed == ")" ? "p-close" : key_pressed;
                console.log(key_pressed)
                if (NUMBERS + OPERATORS + CONSTANTS.includes(key_pressed)) {
                    console.log("____________________")
                    console.log("this.id = ", key_pressed);
                    console.log("current_token = ", current_token)
                    console.log("calcul = ", calcul);
                    handle_button_press(key_pressed);
                    calcul_display_base.innerText = calcul;
                    calcul_display_current.innerText = current_token;
                    calcul_display_autocomplete.innerText = opened_parenthesis;
                    calcul_output.innerText = result;
                }
            }
        }
    }
}

// Initialiser la calculatrice
setup_calculator();

// Exporter les fonctions pour une utilisation externe
export { setup_calculator, handle_button_press, calculate, calcul, result };