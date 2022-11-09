console.log('Hello, World!');

const DICE_IMAGES = {
    '1': './images/die-1.png',
    '2': './images/die-2.png',
    '3': './images/die-3.png',
    '4': './images/die-4.png',
    '5': './images/die-5.png',
    '6': './images/die-6.png',
}

const diceContainer = document.getElementById('dice-container');
const rollDiceForm = document.getElementById('roll-dice-form');
const handForm = document.getElementById('hand-select-form');
const rollsThisTurnDisplay = document.getElementById('rolls-left');
const handSelector = document.getElementById('hand-select');
const currentPoints = document.getElementById('current-points');
const diceSubmitButton = document.querySelector('#roll-dice-form input[type="submit"]');
const handSubmitButton = document.querySelector('#hand-select-form input[type="submit"]');
const scorecardTable = document.querySelector('#scorecard tbody').children;
const totalScoreDisplay = document.getElementById('total-points');


const dice = [new Die(6), new Die(6), new Die(6), new Die(6), new Die(6)];
let rollsThisTurn = 3;

let totalScore = 0;
const scorecard = {
    aces: {score: 0, used: false},
    deuces: {score: 0, used: false},
    threes: {score: 0, used: false},
    fours: {score: 0, used: false},
    fives: {score: 0, used: false},
    sixes: {score: 0, used: false},
    threeOfAKind: {score: 0, used: false},
    fourOfAKind: {score: 0, used: false},
    fullHouse: {score: 0, used: false},
    smallStraight: {score: 0, used: false},
    largeStraight: {score: 0, used: false},
    yahtzee: {score: 0, used: false},
    chance: {score: 0, used: false}
}

rollDiceForm.addEventListener('submit', e => {
    e.preventDefault();
    const keepDice = {
        1: e.target['freeze-die-1'].checked,
        2: e.target['freeze-die-2'].checked,
        3: e.target['freeze-die-3'].checked,
        4: e.target['freeze-die-4'].checked,
        5: e.target['freeze-die-5'].checked,
    }
    dice.forEach((die, index) => {
        if (!keepDice[index + 1]) {
            die.roll
            // test yahtzee bonus
            // die.currentSide = 1;
        }
    });
    if (rollsThisTurn === 3) {
        toggleKeepDisabled();
    }
    rollsThisTurn--;
    rollsThisTurnDisplay.textContent = rollsThisTurn;
    if (rollsThisTurn === 0) {
        diceSubmitButton.toggleAttribute('disabled');
        diceSubmitButton.classList.toggle('disabled');
    }
    if (handSubmitButton.classList.contains('disabled')) {
        handSubmitButton.classList.toggle('disabled');
        handSubmitButton.toggleAttribute('disabled');
    }
    loadDice();
    if (checkForYahtzeeBonus()) {
        console.log('yahtzee bonus!')
        //yahtzee bonus message!
        totalScore += 100;
        // reset rolls, score
    }
})

handSelector.addEventListener('change', (e) => {
    let potentialPoints
    if (e.target.value === '')
        potentialPoints = 0;
    else
        potentialPoints = HAND_TYPES[dashesToCamelCase(e.target.value)].score(dice);
    currentPoints.textContent = potentialPoints;
});

handForm.addEventListener('submit', e => {
    e.preventDefault();
    const hand = dashesToCamelCase(e.target['hand-select'].value);
    if (hand === '') 
        return;
    submitHand(hand);
    e.target.reset();
})

function loadDice() {
    dice.forEach((die, index) => {
        const dieContainer = document.getElementById(`die-${index + 1}`);
        const dieImage = document.createElement('img');
        dieImage.src = DICE_IMAGES[die.currentSide];

        dieContainer.innerHTML = '';
        dieContainer.appendChild(dieImage);
    })
}

function submitHand(hand) {
    const scoreThisHand = HAND_TYPES[hand].score(dice);
    // submit the current hand and add points
    totalScore += scoreThisHand
    scorecard[hand].score = scoreThisHand;
    scorecard[hand].used = true;
    // update the scorecard
    const handTableRow = document.getElementById(`scorecard-${camelCaseToDashes(hand)}`);
    const handScore = handTableRow.querySelector('.score');
    handTableRow.classList.add('scored');
    handScore.textContent = scoreThisHand;
    // update the total points display
    totalScoreDisplay.textContent = totalScore;
    // remove the hand from the select list
    const handSelection = document.getElementById(camelCaseToDashes(hand));
    handSelection.remove();
    // disable select and re-enable roll
    handSubmitButton.classList.toggle('disabled');
    handSubmitButton.toggleAttribute('disabled');
    if(diceSubmitButton.classList.contains('disabled')) {
        diceSubmitButton.toggleAttribute('disabled');
        diceSubmitButton.classList.toggle('disabled');
    }
    // reset roll count
    rollsThisTurn = 3;
    rollsThisTurnDisplay.textContent = rollsThisTurn;
    // reset score preview
    currentPoints.textContent = 0;
    // disable keeps
    toggleKeepDisabled();
    uncheckAllKeep();
    // check for win
    if (handSelector.children.length === 1) {
        // end game, tally score
        tallyFinalScores();
    }
}

function toggleKeepDisabled() {
    for (let i = 1; i <= 5; i++) {
        const keepCheckbox = document.getElementById(`freeze-die-${i}`);
        keepCheckbox.toggleAttribute('disabled');
    }
}

function uncheckAllKeep() {
    for (let i = 1; i <= 5; i++) {
        const keepCheckbox = document.getElementById(`freeze-die-${i}`);
        keepCheckbox.checked = false;
    }
}

function dashesToCamelCase(str) {
    return str.split('-').map((element, index) => {
        if (index !== 0)
            return element[0].toUpperCase() + element.substring(1);
        else
            return element;
    }).join('');
}

function camelCaseToDashes(str) {
    for (let i = 0; i < str.length; i++) {
        const char = str[i];
        if (char === char.toUpperCase()) {
            str = str.substring(0, i) + '-' + char.toLowerCase() + str.substring(i + 1);
        }
    }
    return str;
}

function tallyFinalScores() {
    if (scorecard.aces.score + scorecard.deuces.score + scorecard.threes.score + scorecard.fours.score + scorecard.fives.score + scorecard.sixes.score >= 63) {
        totalScore += 35;
    }
    
    console.log(totalScore);
}

// on any given roll, check if a yahtzee bonus occurs
function checkForYahtzeeBonus() {
    return (HAND_TYPES.yahtzee.isValid(dice) && scorecard.yahtzee.used)
}

loadDice();