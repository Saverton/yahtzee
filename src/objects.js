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

const HAND_TYPES = {
    aces: {
        score: addAllOfType(1)
    },
    deuces: {
        score: addAllOfType(2)
    },
    threes: {
        score: addAllOfType(3)
    },
    fours: {
        score: addAllOfType(4)
    },
    fives: {
        score: addAllOfType(5)
    },
    sixes: {
        score: addAllOfType(6)
    },
}

function addAllOfType(number) {
    return function(dice) {
        return dice.filter((element) => element.currentSide === number).reduce((sum, element) => sum + element.currentSide, 0);
    };
}