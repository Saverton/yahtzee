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
const rollsThisTurnDisplay = document.getElementById('rolls-left')

const dice = [new Die(6), new Die(6), new Die(6), new Die(6), new Die(6)];
let rollsThisTurn = 3;

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
        if (!keepDice[index + 1])
            die.roll;
    });
    rollsThisTurn--;
    rollsThisTurnDisplay.textContent = rollsThisTurn;
    // disable roll if rolls this turn is 0
    loadDice();
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

loadDice();

/**
 * Roll The Dice:
 *  1. must roll each die to be a new random die
 *  2. must decrement the rolls remaining
 *  3. must not roll the dice that are marked as reserved.
 */