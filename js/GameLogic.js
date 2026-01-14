import { STRINGS } from "../lang/messages/en/string.js";

export class GameLogic {
    constructor(buttonCount) {
        this.buttonCount = buttonCount;
        this.correctSequence = [];
        this.userSequence = 0;
    }

    generateSequence() {
        this.correctSequence = [];
        for (let i = 0; i < this.buttonCount; i++) {
            this.correctSequence.push(i);
        }
        this.correctSequence.sort(() => Math.random() - 0.5);
    }

    checkGuess(buttonId) {
        if (buttonId === this.correctSequence[this.userSequence]) {
            this.userSequence++;
            return true;
        }
        return false;
    }

    setLabel(label) {
        this.element.innerText = label;
    }
}
