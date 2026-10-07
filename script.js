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

 const symboles = {
    "Valet": "J",
    "Dame": "Q",
    "Roi": "K"
    };

const cards = [];

function creerPaquet() {

    cards.length = 0;

    for (const couleur of couleurs) {
        for (const valeur of valeurs) {
            cards.push({
                nom: valeur.nom,
                couleur: couleur,
                valeur: valeur.valeur
            });
        }
    }
}

creerPaquet();

//Eléments HTML

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

const miseElement = document.getElementById("mise");

const soldeElement = document.getElementById("solde");

const jetons = document.querySelectorAll(".jeton");

const validerMise = document.getElementById("validerMise");

//Variables du jeu
let score = 0;
let jeuTermine = false;
let scoreCroupier = 0;
let cartesJoueur = [];
let cartesCroupier = [];
let mise = 0;
let partieEnCours = false;
let solde = 1000;

function tirerCarte() {

    const index = Math.floor(Math.random() * cards.length);

    return cards.splice(index, 1)[0];
}

function creerCarte(card){

    const carte = document.createElement("div");
    carte.classList.add("carte");

    const valeur = document.createElement("span");
    valeur.classList.add("valeur");

    valeur.textContent = symboles[card.nom] || card.nom;

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

function creerDosCarte() {
    const carte = document.createElement("div");
    carte.classList.add("carte", "dos");

    return carte;
}

function afficherCarte(card, element, cacher = false){

    if (cacher){
        element.appendChild(creerDosCarte());
        return;
    }

    const carte = creerCarte(card);
    element.appendChild(carte);
    
    }

function afficherCartes(cartes, element, cacherPremiere = false){

    element.innerHTML = "";

    for ( let i = 0; i < cartes.length; i++){

        if ( cacherPremiere && i === 0){
            element.appendChild(creerDosCarte());
            continue;        
        }

        const carte = creerCarte(cartes[i]);

        element.appendChild(carte);
    }
}

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

function verifierBlackjack() {

    const blackjackJoueur =
        score === 21 && cartesJoueur.length === 2;

    const blackjackCroupier =
        scoreCroupier === 21 && cartesCroupier.length === 2;

    if (!blackjackJoueur && !blackjackCroupier) {
        return;
    }

    afficherCartes(cartesCroupier, cartesCroupierElement);
    totalScoreCroupier.textContent = scoreCroupier;

    if (blackjackJoueur && blackjackCroupier) {
        resultat.textContent = "Egalité !";
        payerGain(1);
    }
    else if (blackjackJoueur) {
        resultat.textContent = "Blackjack ! vous gagnez !";
        payerGain(2.5);
    }
    else {
        resultat.textContent = "Blackjack du croupier ! vous perdez !";
    }

    jeuTermine = true;
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

    }, 700);

    setTimeout(() => {
        const card = tirerCarte();

        cartesJoueur.push(card);
        afficherCarte(card, cartesJoueurElement);

        score = calculerScore(cartesJoueur);
        totalScore.textContent = score;

    }, 1100);

    setTimeout(() => {
        const card = tirerCarte();

        cartesCroupier.push(card);
        afficherCarte(card, cartesCroupierElement);

        scoreCroupier = calculerScore(cartesCroupier);

        // Gestion du Double Down
        verifierBlackjack();

        if (!jeuTermine) {
            const scoresJoueur = scoresPossibles(cartesJoueur);

            if (scoresJoueur.some(score => score === 9 || score === 10 || score === 11)) {
                doubler.style.display = "inline-block";
            }
        }
    }, 1500);
}

function tirerCarteJoueur() {
    const card = tirerCarte();

    cartesJoueur.push(card);
    afficherCarte(card, cartesJoueurElement);

    score = calculerScore(cartesJoueur);
    totalScore.textContent = score;
}

function tirerCarteCroupier() {
    const card = tirerCarte();

    cartesCroupier.push(card);
    afficherCarte(card, cartesCroupierElement);

    scoreCroupier = calculerScore(cartesCroupier);
    totalScoreCroupier.textContent = scoreCroupier;
}

function jouerCroupier(){

    cartesCroupierElement.innerHTML = "";

    afficherCartes(cartesCroupier, cartesCroupierElement);

    scoreCroupier = calculerScore(cartesCroupier);
    totalScoreCroupier.textContent = scoreCroupier;

    while (scoreCroupier < 17){
        tirerCarteCroupier();
    }
}

function terminerPartie() {
    jeuTermine = true;
    partieEnCours = false;
}

function determinerResultat(){
    
    if (scoreCroupier > 21 || score > scoreCroupier){
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

    terminerPartie();
}

function payerGain(multiplicateur){

    solde += mise * multiplicateur;

    soldeElement.textContent = solde;
}

tirer.addEventListener('click', function() {

    if (jeuTermine){
        return;
    }

    tirerCarteJoueur();

    doubler.style.display = "none";

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

    jouerCroupier();

    determinerResultat();
});

nouvellePartie.addEventListener('click', function(){

    creerPaquet();

    score = 0;
    scoreCroupier = 0;
    jeuTermine = false;
    partieEnCours = false;

    cartesJoueur = [];
    cartesCroupier = [];

    cartesJoueurElement.innerHTML = "";
    cartesCroupierElement.innerHTML = "";

    totalScore.textContent = "0";
    totalScoreCroupier.textContent = "?";

    resultat.textContent = "";

    mise = 0;
    miseElement.textContent = "0 €";

    doubler.style.display = "none";
});

doubler.addEventListener("click", function(){

    if (jeuTermine || !partieEnCours){
        return;
    }

    if (mise > solde){
        return;
    }

    solde -= mise;
    mise *= 2;

    soldeElement.textContent = solde;
    miseElement.textContent = mise + " €";

    doubler.style.display = "none";

    tirerCarteJoueur();

    if (score > 21){
    resultat.textContent = "Perdu !";
    }
    else{
        jouerCroupier();
        determinerResultat();
    }

    jeuTermine = true;
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

regles.addEventListener('click', function(){
    fenetreRegles.style.display = "flex";
});

fermerRegles.addEventListener('click', function(){
    fenetreRegles.style.display = "none";
});

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