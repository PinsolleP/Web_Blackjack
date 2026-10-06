const couleurs = ["♥", "♦", "♣", "♠"];

const valeurs = [
    { nom: "2", valeur: 2 },
    { nom: "3", valeur: 3 },
    { nom: "4", valeur: 4 },
    { nom: "5", valeur: 5 },
    { nom: "6", valeur: 6 },
    { nom: "7", valeur: 7 },
    { nom: "8", valeur: 8 },
    { nom: "9", valeur: 9 },
    { nom: "10", valeur: 10 },
    { nom: "Valet", valeur: 10 },
    { nom: "Dame", valeur: 10 },
    { nom: "Roi", valeur: 10 },
    { nom: "As", valeur: 11 }
];

const cards = [];

for (let couleur of couleurs){
    for ( let valeur of valeurs){
        cards.push({
            nom: valeur.nom,
            couleur: couleur,
            valeur: valeur.valeur
        });
    }
}

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
    const index = Math.floor(Math.random() * cards.length);
    return cards.splice(index, 1)[0];
}

function creerCarte(card){

    const carte = document.createElement("div");
    carte.classList.add("carte");

    const valeur = document.createElement("span");
    valeur.classList.add("valeur");

    if (card.nom === "Valet") {
            valeur.textContent = "J";
        }
        else if (card.nom === "Dame") {
            valeur.textContent = "Q";
        }
        else if (card.nom === "Roi") {
            valeur.textContent = "K";
        }
        else {
            valeur.textContent = card.nom;
        }

        const couleur = document.createElement("span");
        couleur.classList.add("couleur");

        if (card.couleur === "♥" || card.couleur === "♦"){
            couleur.classList.add("rouge");
        }

        couleur.textContent = card.couleur;

        
        carte.appendChild(valeur);
        carte.appendChild(couleur);

        return carte;
}

function afficherCarte(card, element, cacher = false){


    if (cacher){
        const carte = document.createElement("div");
        carte.classList.add("carte", "dos");
        element.appendChild(carte);
        return;
    }

    const carte = creerCarte(card);
    element.appendChild(carte);
    
    }

function afficherCartes(cartes, element, cacherPremiere = false){

    element.innerHTML = "";

    for ( let i = 0; i < cartes.length; i++){

        if ( cacherPremiere && i === 0){
            const carteCachee = document.createElement("div");
            carteCachee.classList.add("carte", "dos");
            element.appendChild(carteCachee);
            continue;        
        }

        const carte = creerCarte(cartes[i]);
        carte.style.animationDelay = `${i * 0.70}s`;

        element.appendChild(carte);
    }
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

    afficherCartes(cartesJoueur, cartesJoueurElement);
    afficherCartes(cartesCroupier, cartesCroupierElement, true);
    totalScoreCroupier.textContent = "?";

    scoreCroupier = calculerScore(cartesCroupier);

    const blackjackJoueur = score === 21 && cartesJoueur.length === 2;
    const blackjackCroupier = scoreCroupier === 21 && cartesCroupier.length === 2;

    if (blackjackJoueur || blackjackCroupier){

        afficherCartes(cartesCroupier, cartesCroupierElement);
        totalScoreCroupier.textContent = scoreCroupier;

        if (blackjackJoueur && blackjackCroupier){
            resultat.textContent = "Egalité !";
        }
        else if (blackjackJoueur){
            resultat.textContent = "Blackjack ! vous gagnez !";
        }
        else{
            resultat.textContent = "Blackjack du croupier ! vous perdez !";
        }
        jeuTermine = true;
        }
    }

tirer.addEventListener('click', function() {

    if (jeuTermine){
        return;
    }

    const card = tirerCarte();

    cartesJoueur.push(card);

    afficherCarte(card, cartesJoueurElement);

    score = calculerScore(cartesJoueur);

    totalScore.textContent = score;

    if (score > 21){
        resultat.textContent = "Perdu !";
        jeuTermine = true;

        afficherCartes(cartesCroupier, cartesCroupierElement);

        scoreCroupier = calculerScore(cartesCroupier);
        totalScoreCroupier.textContent = scoreCroupier;
    }
});

rester.addEventListener('click', function() {

    if (jeuTermine){
        return;
    }

    jeuTermine = true;

    cartesCroupierElement.innerHTML = "";

    afficherCartes(cartesCroupier, cartesCroupierElement);

    scoreCroupier = calculerScore(cartesCroupier);
    totalScoreCroupier.textContent = scoreCroupier;

    while ( scoreCroupier < 17){
        const card = tirerCarte();

        cartesCroupier.push(card);
        afficherCarte(card, cartesCroupierElement)

        scoreCroupier = calculerScore(cartesCroupier);

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

function calculerScore(cartes){
    let score = 0;
    let nombreAs = 0;

    for( let card of cartes){
        if (card.nom === "As"){
            nombreAs++;
            score = score + 11;
        } else{
        score = score + card.valeur;
        }
    }
    while (score > 21 && nombreAs >0){
        score = score - 10;
        nombreAs--;
    }
    return score;
}

distribuerCartes();

