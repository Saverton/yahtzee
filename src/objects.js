class Die {
    // construct a die with x sides.
    constructor(sides) {
        this.sides = sides;
        this.currentSide = 1;
    }

    get roll() {
        this.rollDie();
        return this.currentSide;
    }

    rollDie() {
        this.currentSide = Math.floor(Math.random() * this.sides + 1);
    }
}

class Hand {
    constructor(scoreMethod, isValid) {
        this.scoreMethod = scoreMethod;
        this.isValid = isValid;
    }

    score(dice) {
        if (this.isValid(dice)) {
            return this.scoreMethod(dice);
        } else {
            return 0;
        }
    }
}

class Scorecard {
    constructor() {
        this.aces = {score: 0, used: false}
        this.deuces = {score: 0, used: false}
        this.threes = {score: 0, used: false}
        this.fours = {score: 0, used: false}
        this.fives = {score: 0, used: false}
        this.sixes = {score: 0, used: false}
        this.threeOfAKind = {score: 0, used: false}
        this.fourOfAKind = {score: 0, used: false}
        this.fullHouse = {score: 0, used: false}
        this.smallStraight = {score: 0, used: false}
        this.largeStraight = {score: 0, used: false}
        this.yahtzee = {score: 0, used: false}
        this.chance = {score: 0, used: false}
        this.yahtzeeBonus = {score: 0}
        this.scoreBonus = {score: 0}
    }
}

const HAND_TYPES = {
    aces: new Hand(addAllOfType(1), returnTrue),
    deuces: new Hand(addAllOfType(2), returnTrue),
    threes: new Hand(addAllOfType(3), returnTrue),
    fours: new Hand(addAllOfType(4), returnTrue),
    fives: new Hand(addAllOfType(5), returnTrue),
    sixes: new Hand(addAllOfType(6), returnTrue),
    threeOfAKind: new Hand(totalDice, hasXOfAKind(3)),
    fourOfAKind: new Hand(totalDice, hasXOfAKind(4)),
    fullHouse: new Hand(returnNumber(25), (dice) => {
        const hash = diceToHash(dice);
        return (hashContains(hash, 2) && hashContains(hash, 3));
    }),
    smallStraight: new Hand(returnNumber(30), hasStraightOfLength(4)),
    largeStraight: new Hand(returnNumber(40), hasStraightOfLength(5)),
    yahtzee: new Hand(returnNumber(50), hasXOfAKind(5)),
    chance: new Hand(totalDice, returnTrue)
}

function returnTrue() {
    return true;
}

function returnNumber(number) {
    return () => number;
}

function addAllOfType(number) {
    return function(dice) {
        return dice.filter((element) => element.currentSide === number).reduce((sum, element) => sum + element.currentSide, 0);
    };
}

function totalDice(dice) {
    return dice.reduce((sum, element) => sum + element.currentSide, 0);
}

function hasXOfAKind(x) {
    return function(dice) {
        const hash = diceToHash(dice);
        for (let side in hash) {
            if (hash[side] >= x)
                return true;
        }
        return false;
    }
}

function diceToHash(dice) {
    const hash = {};
        for (let die of dice) {
            if (hash[die.currentSide])
                hash[die.currentSide]++;
            else
                hash[die.currentSide] = 1;
        }
    return hash;
}

function hashContains(hash, number) {
    for (let side in hash) {
        if (hash[side] === number)
            return true;
    }
    return false;
}

function hasStraightOfLength(length) {
    return function(dice) {
        const hash = {};
        dice = dice.filter((element) => {
            if (hash[element.currentSide] !== undefined)
                return false;
            else {
                hash[element.currentSide] = true;
                return true;
            }
        });
        const numDice = toNumberArray(dice);
        let longestStraight = 1;
        let currentStraight = 1;
        sortDice(numDice);
        let lastNumber = numDice[0];
        for (let i = 1; i < numDice.length; i++) {
            if (numDice[i] === lastNumber + 1) {
                currentStraight++;
                if (currentStraight > longestStraight) 
                    longestStraight = currentStraight;
            } else {
                currentStraight = 1;
            }
            lastNumber = numDice[i];
        }
        return (longestStraight >= length);
    }
}

function sortDice(dice) {
    for (let i = 0; i < dice.length; i++) {
        const minIndex = minIndexFrom(dice, i);
        const temp = dice[i];
        dice[i] = dice[minIndex];
        dice[minIndex] = temp;
    }
    return dice;
}

function toNumberArray(dice) {
    return dice.map((element) => element.currentSide);
}

function minIndexFrom(arr, startIndex) {
    let minIndex = startIndex;
    for (let i = startIndex; i < arr.length; i++) {
        if (arr[i] < arr[minIndex])
            minIndex = i;
    }
    return minIndex;
}