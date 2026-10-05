const cards = [2, 3, 4, 5, 6, 7, 8, 9, 10, "Valet", "Dame", "Roi", "As"];

const tirer = document.getElementById('tirer');

const cartesJoueurElement = document.getElementById('carte');

const totalScore = document.getElementById('score');

const rester = document.getElementById('rester');

const resultat = document.getElementById('resultat');

const nouvellePartie = document.getElementById('nouvellePartie');

const totalScoreCroupier = document.getElementById('scoreCroupier');

const cartesCroupierElement = document.getElementById('cartesCroupier');

let score = 0;
let jeuTermine = false;
let scoreCroupier = 0;
let cartesJoueur = [];
let cartesCroupier = [];

function tirerCarte(){
    return cards[Math.floor(Math.random() * cards.length)];
}

function distribuerCartes(){
    cartesJoueur = [];
    cartesCroupier = [];

    cartesJoueur.push(tirerCarte());
    cartesCroupier.push(tirerCarte());
    cartesJoueur.push(tirerCarte());
    cartesCroupier.push(tirerCarte());

    score = calculerScore(cartesJoueur);
    totalScore.textContent = score;

    cartesJoueurElement.textContent = cartesJoueur.join(", ");
    cartesCroupierElement.textContent = cartesCroupier[0] + ", ?";

    totalScoreCroupier.textContent = "?";
}

tirer.addEventListener('click', function() {

    if (jeuTermine){
        return;
    }

    const card = tirerCarte();

    cartesJoueur.push(card);

    cartesJoueurElement.textContent = cartesJoueur.join(", ");

    score = calculerScore(cartesJoueur);

    totalScore.textContent = score;

    if (score > 21){
        resultat.textContent = "Perdu !";
        jeuTermine = true;
    }
});

rester.addEventListener('click', function() {

   jeuTermine = true;

   cartesCroupierElement.textContent = cartesCroupier.join(", ");

   scoreCroupier = calculerScore(cartesCroupier);
   totalScoreCroupier.textContent = scoreCroupier;

   while ( scoreCroupier < 17){
        const card = tirerCarte();

        cartesCroupier.push(card);

        scoreCroupier = calculerScore(cartesCroupier);

        cartesCroupierElement.textContent = cartesCroupier.join(", ");
        totalScoreCroupier.textContent = scoreCroupier;
   }
   if (scoreCroupier > 21){
        resultat.textContent = "Gagné !";
   }
   else if (score > scoreCroupier){
        resultat.textContent = "Gagné !";
   }
   else if (score < scoreCroupier){
        resultat.textContent = "Perdu !";
   }
   else{
        resultat.textContent = "Egalité !";
   }
});

nouvellePartie.addEventListener('click', function(){
    score = 0;
    jeuTermine = false;
    scoreCroupier = 0;
    resultat.textContent = "";

    distribuerCartes();

});

function valeurCarte(card) {

    if (card == "Valet" || card =="Dame" || card == "Roi"){
        return 10;

    } 
    return card;
};

function calculerScore(cartes){
    let score = 0;
    let nombreAs = 0;

    for( let card of cartes){
        if (card == "As"){
            nombreAs++;
            score = score + 11;
        } else{
        score = score + valeurCarte(card);
        }
    }
    while (score > 21 && nombreAs >0){
        score = score - 10;
        nombreAs--;
    }
    return score;
}

distribuerCartes();

