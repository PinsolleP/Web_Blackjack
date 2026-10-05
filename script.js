const cards = [2, 3, 4, 5, 6, 7, 8, 9, 10, "Valet", "Dame", "Roi", "As"];

const button = document.getElementById('tirer');

const carteElement = document.getElementById('carte');

const totalscore = document.getElementById('score');

const rester = document.getElementById('rester');

let score = 0;
let jeuTermine = false;
let scoreCroupier = 0;

button.addEventListener('click', function() {
    if (jeuTermine){
        return;
    }
    const card = cards[Math.floor(Math.random() * cards.length)];
    carteElement.textContent = card;
    score = score + valeurCarte(card, score);
    totalscore.textContent = score;
    if (score > 21){
        console.log("Perdu !");
        jeuTermine = true;
    }
});

rester.addEventListener('click', function() {
   jeuTermine = true;
});

function valeurCarte(card, score) {

    if (card == "Valet" || card =="Dame" || card == "Roi"){
        return 10;

    } else if (card == "As"){
        if (score + 11 > 21){
        return 1;
        }
        return 11;

    } else {
    return card;
    }
};

