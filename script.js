const cards = [2, 3, 4, 5, 6, 7, 8, 9, 10, "Valet", "Dame", "Roi", "As"];

const button = document.getElementById('tirer');

const carteElement = document.getElementById('carte');

const totalscore = document.getElementById('score');

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

function distribuerCartes(){
    cartesJoueur = [];
    cartesCroupier = [];

    cartesJoueur.push(cards[Math.floor(Math.random() * cards.length)]);
    cartesCroupier.push(cards[Math.floor(Math.random() * cards.length)]);
    cartesJoueur.push(cards[Math.floor(Math.random() * cards.length)]);
    cartesCroupier.push(cards[Math.floor(Math.random() * cards.length)]);

    score = calculerScore(cartesJoueur);
    totalscore.textContent = score;

    carteElement.textContent = cartesJoueur.join(", ");
    cartesCroupierElement.textContent = cartesCroupier[0] + ", ?";

    totalScoreCroupier.textContent = "?";
}

button.addEventListener('click', function() {

    if (jeuTermine){
        return;
    }

    const card = cards[Math.floor(Math.random() * cards.length)];

    cartesJoueur.push(card);

    carteElement.textContent = cartesJoueur.join(", ");

    score = calculerScore(cartesJoueur);

    totalscore.textContent = score;

    if (score > 21){
        console.log("Perdu !");
        jeuTermine = true;
    }
});

rester.addEventListener('click', function() {

   jeuTermine = true;

   cartesCroupierElement.textContent = cartesCroupier.join(", ");

   scoreCroupier = calculerScore(cartesCroupier);
   totalScoreCroupier.textContent = scoreCroupier;

   while ( scoreCroupier < 17){
        const card = cards[Math.floor(Math.random() * cards.length)];

        cartesCroupier.push(card)

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

