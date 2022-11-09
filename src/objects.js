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