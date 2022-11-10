/* constants */

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
const scorecardTable = document.querySelector('.scorecard tbody');
const totalScoreDisplay = document.getElementById('total-points');
const scoreReport = document.querySelector('.game-report');
const scoreReportScorecard = document.querySelector('.game-report .scorecard tbody');
const gameResetButton = document.getElementById('reset-button');
const keepDieCheckboxes = Array.from(document.getElementsByClassName('keep-checkbox'));
const diceArray = Array.from(document.getElementsByClassName('die'));

/* global variables */

let dice = [new Die(6), new Die(6), new Die(6), new Die(6), new Die(6)];
let rollsThisTurn = 3;

let totalScore = 0;
let scorecard = new Scorecard();

/* init function: calls on load */
function init() {
    updateDiceDisplay();
    rollDiceForm.addEventListener('submit', handleDiceRoll);
    handForm.addEventListener('submit', handleHandFormSubmit);
    handSelector.addEventListener('change', handleHandPreview);
    gameResetButton.addEventListener('click', handleGameReset);
}

/* game functions */

function updateDiceDisplay() {
    dice.forEach((die, index) => {
        const diceImg = document.createElement('img');
        diceImg.src = getDieImage(die);
        diceArray[index].innerHTML = '';
        diceArray[index].append(diceImg);
    })
}

function getDieImage(die) {
    return DICE_IMAGES[die.currentSide];
}

function displayScorePreview(hand) {
    currentPoints.textContent = getScoreForHand(hand);
}

function updateRollsThisTurn(amount) {
    rollsThisTurn = amount;
    rollsThisTurnDisplay.textContent = rollsThisTurn;
    if (rollsThisTurn === 0) {
        keepDieCheckboxes.forEach(disableElement);
        disableElement(diceSubmitButton);
    }
}

// on any given roll, check if a yahtzee bonus occurs, and execute its behavior if it does.
function checkForYahtzeeBonus() {
    if (HAND_TYPES.yahtzee.isValid(dice) && scorecard.yahtzee.used) {
        console.log('yahtzee bonus!')
        totalScore += 100;
        scorecard.yahtzeeBonus.score += 100;
        // display yahtzee bonus icon
        resetTurn();
    }
}

function resetTurn() {
    updateRollsThisTurn(3);
    disableElement(handSubmitButton);
    enableElement(diceSubmitButton);
    currentPoints.textContent = 0;
    keepDieCheckboxes.forEach((checkbox) => {
        uncheck(checkbox);
        disableElement(checkbox);
    });
    checkGameEnds();
}

function getScoreForHand(hand) {
    return HAND_TYPES[hand].score(dice);
}

function updateScore(hand, scoreThisHand) {
    totalScore += scoreThisHand;
    scorecard[hand].score = scoreThisHand;
    scorecard[hand].used = true;
    
    const scorecardEntry = scorecardTable.querySelector(`.scorecard-${camelCaseToDashes(hand)}`);
    const handScore = scorecardEntry.querySelector('.score')
    scorecardEntry.classList.add('scored');
    handScore.textContent = scoreThisHand;
    
    totalScoreDisplay.textContent = totalScore;
}

function checkGameEnds() {
    if (handSelector.children.length === 1) {
        tallyFinalScores();
    }
}

function tallyFinalScores() {
    checkForBonusScore();
    showScoreReport();
}

function checkForBonusScore() {
    if (scorecard.aces.score + scorecard.deuces.score + scorecard.threes.score + scorecard.fours.score + scorecard.fives.score + scorecard.sixes.score >= 63) {
        totalScore += 35;
        scorecard.scoreBonus.score = 35;
    }
}

function showScoreReport() {
    scoreReport.classList.remove('hidden');
    for (let hand in scorecard) {
        const scorecardEntry = scoreReportScorecard.querySelector(`.scorecard-${camelCaseToDashes(hand)} .score`);
        scorecardEntry.textContent = scorecard[hand].score;
    }
    const totalPointsScorecard = scoreReportScorecard.querySelector(`.scorecard-total .score`);
    totalPointsScorecard.textContent = totalScore;
}

function removeHand(hand) {
    const handSelection = document.getElementById(camelCaseToDashes(hand));
    handSelection.remove();
}

function resetGame() {
    scoreReport.classList.toggle('hidden');

    scorecard = new Scorecard();
    totalScore = 0;
    totalScoreDisplay.textContent = totalScore;

    updateRollsThisTurn(3);

    dice = [new Die(6), new Die(6), new Die(6), new Die(6), new Die(6)];
    updateDiceDisplay()

    resetScoreCardDisplay();

    handSelector.innerHTML = `
        <option value="">(select a hand)</option>
        <option id="aces" value="aces">Aces</option>
        <option id="deuces" value="deuces">Deuces</option>
        <option id="threes" value="threes">Threes</option>
        <option id="fours" value="fours">Fours</option>
        <option id="fives" value="fives">Fives</option>
        <option id="sixes" value="sixes">Sixes</option>
        <option id="three-of-a-kind" value="three-of-a-kind">Three of a kind</option>
        <option id="four-of-a-kind" value="four-of-a-kind">Four of a kind</option>
        <option id="full-house" value="full-house">Full house</option>
        <option id="small-straight" value="small-straight">Small straight</option>
        <option id="large-straight" value="large-straight">Large straight</option>
        <option id="yahtzee" value="yahtzee">Yahtzee</option>
        <option id="chance" value="chance">Chance</option>
    `;
}

function resetScoreCardDisplay() {
    scoreCardDisplayArray = Array.from(scorecardTable.children);
    scoreCardDisplayArray.forEach((tableRow) => {
        const score = tableRow.querySelector('.score');
        score.textContent = '-';
        tableRow.classList.remove('scored');
    });
}

/* event handlers */

function handleDiceRoll(event) {
    event.preventDefault();

    const diceToKeep = keepDieCheckboxes.map((element) => element.checked);

    dice.forEach((die, index) => {
        if (!diceToKeep[index])
            die.roll;
    });

    keepDieCheckboxes.forEach(enableElement);

    updateRollsThisTurn(rollsThisTurn - 1);
    enableElement(handSubmitButton);

    updateDiceDisplay();

    checkForYahtzeeBonus();
}

function handleHandFormSubmit(event) {
    event.preventDefault();
    const hand = dashesToCamelCase(event.target['hand-select'].value);
    const scoreForThisHand = getScoreForHand(hand);
    updateScore(hand, scoreForThisHand);
    removeHand(hand);
    resetTurn();
}

function handleHandPreview(event) {
    const hand = dashesToCamelCase(event.target.value);
    let potentialPoints
    if (event.target.value === '')
        potentialPoints = 0;
    else
        potentialPoints = getScoreForHand(hand);
    currentPoints.textContent = potentialPoints;
}

function handleGameReset() {
    resetGame();
    resetTurn();
}

/* helper functions */

// remove the disabled class item and attribute from the passed element.
function enableElement(element) {
    element.classList.remove('disabled');
    element.removeAttribute('disabled');
}

// add the disabled class and attribute to the passed element.
function disableElement(element) {
    element.classList.add('disabled');
    element.setAttribute('disabled', 'true');
}

// return an array of booleans corresponding to checkbox styles
function getCheckboxArray(array, element) {
    array.push[element.checked];
    return array;
}

// uncheck a checkbox element
function uncheck(checkbox) {
    checkbox.checked = false;
}

// convert an html lower-case-dashed string to a camelCase string
function dashesToCamelCase(str) {
    return str.split('-').map((element, index) => {
        if (index !== 0)
            return element[0].toUpperCase() + element.substring(1);
        else
            return element;
    }).join('');
}

// convert a camelCase string to an html lower-case-dashed string
function camelCaseToDashes(str) {
    for (let i = 0; i < str.length; i++) {
        const char = str[i];
        if (char === char.toUpperCase()) {
            str = str.substring(0, i) + '-' + char.toLowerCase() + str.substring(i + 1);
        }
    }
    return str;
}

/* call init function on load */
init();

// /**
//  * TODO:
//  * 2. Game reset (done)
//  * 3. Better code formatting (done)
//  * 4a. fix yahtzee message 
//  * 4b. Write rules 
//  * 5. Improve styling 
//  * 6. Write styling for mobile devices 
//  */