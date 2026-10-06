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

    cards.length = 0;

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

const regles = document.getElementById('regles');

const fenetreRegles = document.getElementById('fenetreRegles');

const fermerRegles = document.getElementById('fermerRegles');

const accueil = document.getElementById('accueil');

const pseudo = document.getElementById('pseudo');

const jouer = document.getElementById('jouer');

const bienvenue = document.getElementById('bienvenue');

const nomJoueur = document.getElementById('nomJoueur');

const doubler = document.getElementById("doubler");

let score = 0;
let jeuTermine = false;
let scoreCroupier = 0;
let cartesJoueur = [];
let cartesCroupier = [];

function tirerCarte(){
    return cards[Math.floor(Math.random() * cards.length)];
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

        element.appendChild(carte);
    }
}

function distribuerCartes(){
    cartesJoueur = [];
    cartesCroupier = [];

    cartesJoueurElement.innerHTML = "";
    cartesCroupierElement.innerHTML = "";

    totalScore.textContent = "0";
    totalScoreCroupier.textContent = "?";

    setTimeout(() => {
        const card = tirerCarte();

        cartesJoueur.push(card);
        afficherCarte(card, cartesJoueurElement);

    }, 300);

    setTimeout(() => {
        const card = tirerCarte();

        cartesCroupier.push(card);
        afficherCarte(card, cartesCroupierElement, true);

    }, 900);

    setTimeout(() => {
        const card = tirerCarte();

        cartesJoueur.push(card);
        afficherCarte(card, cartesJoueurElement);

        score = calculerScore(cartesJoueur);
        totalScore.textContent = score;

    }, 1500);

    setTimeout(() => {
        const card = tirerCarte();

        cartesCroupier.push(card);
        afficherCarte(card, cartesCroupierElement);

        scoreCroupier = calculerScore(cartesCroupier);

        const blackjackJoueur = score === 21 && cartesJoueur.length === 2;
        const blackjackCroupier = scoreCroupier === 21 && cartesCroupier.length === 2;

        if ((score === 9 || score === 10 || score === 11) && !blackjackCroupier) {
            doubler.style.display = "inline-block";
        }

        if (blackjackJoueur || blackjackCroupier){

            afficherCartes(cartesCroupier, cartesCroupierElement);
            totalScoreCroupier.textContent = scoreCroupier;

            if (blackjackJoueur && blackjackCroupier){
                resultat.textContent = "Egalité !";
                payerGain(1);
            }
            else if (blackjackJoueur){
                resultat.textContent = "Blackjack ! vous gagnez !";
                payerGain(2.5);
            }
            else{
                resultat.textContent = "Blackjack du croupier ! vous perdez !";
            }

            jeuTermine = true;
        }

    }, 2100);
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
        payerGain(2);
    }
    else if (score > scoreCroupier){
        resultat.textContent = "Gagné !";
        payerGain(2);
    }
    else if (score < scoreCroupier){
        resultat.textContent = "Perdu !";
    }
    else{
        resultat.textContent = "Egalité !";
        payerGain(1);
    }
});

nouvellePartie.addEventListener('click', function(){
    score = 0;
    jeuTermine = false;
    scoreCroupier = 0;
    resultat.textContent = "";

    mise = 0;
    miseElement.textContent = "0 €";

    partieEnCours = false;

});

function calculerScore(cartes){
    let score = 0;
    let nombreAs = 0;

    for( let card of cartes){
        if (card.nom === "As"){
            nombreAs++;
            score = score + 11;
        } else{
            score += card.valeur;
        }
    }
    while (score > 21 && nombreAs >0){
        score -= 10;
        nombreAs--;
    }
    return score;
}

function scoresPossibles(cartes){

    let score = 0;
    let nombreAs = 0;

    for (let card of cartes){

        if (card.nom === "As"){
            nombreAs++;
            score += 11;
        } else {
            score += card.valeur;
        }
    }

    const scores = [score];

    while (nombreAs > 0){
        score -= 10;
        nombreAs--;

        scores.push(score);
    }

    return scores;
}

function payerGain(multiplicateur){

    solde += mise * multiplicateur;

    soldeElement.textContent = solde;
}

regles.addEventListener('click', function(){
    fenetreRegles.style.display = "flex";
});

fermerRegles.addEventListener('click', function(){
    fenetreRegles.style.display = "none";
});

jouer.addEventListener('click', function(){

    if (pseudo.value.trim() === ""){
        return;
    }

    nomJoueur.textContent = pseudo.value;
    bienvenue.textContent = "Bienvenue " + pseudo.value;

    accueil.style.display = "none";
    document.querySelector(".table").style.display = "block";

});

let mise = 0;
let partieEnCours = false;
let solde = 1000;

const miseElement = document.getElementById("mise");
const soldeElement = document.getElementById("solde");
const jetons = document.querySelectorAll(".jeton");
const validerMise = document.getElementById("validerMise");

jetons.forEach(function(jeton){

    jeton.addEventListener("click", function(){

        if (partieEnCours){
            return;
        }

        mise += Number(jeton.dataset.valeur);

        miseElement.textContent = mise + " €";

    });
});

validerMise.addEventListener("click", function(){

    if (mise === 0 || partieEnCours){
        return;
    }

    if (mise > solde){
        return;
    }

    solde -= mise;
    soldeElement.textContent = solde;

    partieEnCours = true;

    distribuerCartes();
});
