const calcul_display = document.getElementById("calcul-display");
const calcul_overlay = document.getElementById("calcul-overlay");
const difficulty_selector = document.getElementById("difficulty-selector");
const score_display = document.getElementById("score-display");
let score = 0;
let btns = [];
let answer;

if (isNaN(parseInt(localStorage.getItem("calcul-mental-score")))) {
    localStorage.setItem("calcul-mental-score", 0);
} else {
    score = parseInt(localStorage.getItem("calcul-mental-score"));
    score_display.innerText = score;
}

for (let index = 0; index < 4; index++) {
    const button = document.getElementById("btn-" + index);
    button.addEventListener("click", function (e) {
        if (this.innerText == answer) {
            score++;
        } else {
            score--;
        }
        localStorage.setItem("calcul-mental-score", score);
        score_display.innerText = score;
        start_round();
    });
    btns.push(button);
}

function start_round() {
    let operation_index = Math.random() * 4;
    operation_index = Math.floor(operation_index);
    let num_1 = Math.floor(Math.random() * (parseInt(difficulty_selector.value)-2) + 2);
    let num_2 = Math.floor(Math.random() * (parseInt(difficulty_selector.value)-2) + 2);
    let alt_1;
    let alt_2;
    let alt_3;
    switch (operation_index) {
        case 0:
            answer = num_1 + num_2;
            alt_1 = num_1 - num_2;
            alt_2 = answer + 1;
            alt_3 = alt_1 - 1;
            break;
        case 1:
            answer = num_1 - num_2;
            alt_1 = num_1 + num_2;
            alt_2 = answer + 1;
            alt_3 = alt_1 - 1;
            break;
        case 2:
            answer = num_1 * num_2;
            alt_1 = Math.round(num_1 / num_2);
            alt_2 = answer + 2;
            alt_3 = alt_1 - 1;
            break;
        case 3:
            num_1 = Math.round(num_1 / num_2) * num_2;
            answer = Math.round(num_1 / num_2);
            alt_1 = num_1 * num_2;
            alt_2 = answer + 1;
            alt_3 = alt_1 - 1;
            break;
    }
    // Shuffle the values
    let unshuffled = [answer, alt_1, alt_2, alt_3];
    let shuffled = unshuffled
        .map(value => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value)
    
    // Display everything
    for (let index = 0; index < btns.length; index++) {
        const button = btns[index];
        const value = shuffled[index];
        button.innerText = value;
    }
    calcul_display.innerText = num_1 + "+-*/"[operation_index] + num_2
}

function start_game(rounds) {
}