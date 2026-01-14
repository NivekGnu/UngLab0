import { STRINGS } from "../lang/messages/en/string.js";
import { Button } from "./ButtonLogic.js";
import { GameLogic } from "./GameLogic.js";

// Colours for buttons in hex; ROYGBIV order
const COLORS = ["#FF0000", "#FFA500", "#FFFF00", "#00FF00", "#0000FF", "#4B0082", "#EE82EE"];

function initializeMenu() {
    const gameMenu = document.getElementById("menu");
    const welcomeMessage = document.createElement("h2");
    const instructionMessage = document.createElement("h2");
    const inputField = document.getElementById("buttonCountInput");
    const startButton = document.getElementById("startButton");

    welcomeMessage.id = "welcomeMessage";
    instructionMessage.id = "instructionMessage";
    welcomeMessage.innerText = STRINGS.WELCOME_MESSAGE;
    instructionMessage.innerText = STRINGS.INSTRUCTION_MESSAGE;
    inputField.placeholder = STRINGS.START_MESSAGE;
    startButton.innerText = STRINGS.START_BUTTON;

    gameMenu.insertBefore(welcomeMessage, gameMenu.firstChild);
    gameMenu.insertBefore(instructionMessage, gameMenu.firstChild.nextSibling);
}

class GameManager {
    constructor(numberOfButtons) {
        this.numberOfButtons = numberOfButtons;
        this.buttons = [];
        this.gameLogic = new GameLogic(numberOfButtons);
    }

    start() {
        document.getElementById("gameContainer").innerHTML = "";

        this.gameLogic.generateSequence();

        for (let i = 0; i < this.numberOfButtons; i++) {
            const button = new Button(
                this.gameLogic.correctSequence[i],
                COLORS[this.gameLogic.correctSequence[i] % COLORS.length],
                (id) => this.handleButtonClick(id)
            );
            button.setLabel(i + 1);
            button.element.style.pointerEvents = "none";
            this.buttons.push(button);
        }

        this.shuffleTextAnimation();

        setTimeout(() => {
            this.scrambleSequence(this.numberOfButtons);
        }, this.numberOfButtons * 1000);
    }

    scrambleSequence(timeLeft) {
        if (timeLeft > 0) {
            this.scatterButtons(false); 

            setTimeout(() => {
                this.scrambleSequence(timeLeft - 1);
            }, 2000);
        } else {
            this.stopShuffleAnimation();
            this.enableButtons();
        }
    }

    scatterButtons(hideLabel = true) {
        const gameContainer = document.getElementById("gameContainer");
        const containerWidth = gameContainer.clientWidth;
        const containerHeight = gameContainer.clientHeight;

        this.buttons.forEach(button => {
            button.element.style.position = "absolute";

            const maxX = containerWidth - 200;
            const maxY = containerHeight - 60;

            const x = Math.max(0, Math.floor(Math.random() * maxX));
            const y = Math.max(0, Math.floor(Math.random() * maxY));

            button.moveButton(x, y);
            if (hideLabel) {
                button.element.innerText = STRINGS.HIDE_TEXT;
            }
        });
    }

    enableButtons() {
        document.getElementById("instructionMessage").innerText = STRINGS.INSTRUCTION_MESSAGE;
        this.buttons.forEach(button => {
            button.element.innerText = STRINGS.HIDE_TEXT;
            button.element.style.pointerEvents = "auto";
        });
    }

    handleButtonClick(buttonId) {
        if (this.gameLogic.checkGuess(buttonId)) {
            const correctButton = this.buttons.find(button => button.id === buttonId);
            correctButton.setLabel(this.gameLogic.userSequence);
            correctButton.toggleDisabled();

            if (this.gameLogic.userSequence === this.numberOfButtons) {
                alert(STRINGS.WIN_MESSAGE);
            }
        } else {
            for (let i = 0; i < this.buttons.length; i++) {
                const button = this.buttons[i];
                button.setLabel(i + 1);
                button.toggleDisabled();
            }
            this.gameLogic.userSequence = 0;
            alert(STRINGS.LOSE_MESSAGE);
        }
    }

    shuffleTextAnimation() {
        const shuffleStates = [STRINGS.SHUFFLE1, STRINGS.SHUFFLE2, STRINGS.SHUFFLE3];
        const shuffleMessage = document.getElementById("instructionMessage");
        let index = 0;

        document.getElementById("welcomeMessage").style.display = "none";

        this.shuffleInterval = setInterval(() => {
            shuffleMessage.innerText = shuffleStates[index];
            index = (index + 1) % shuffleStates.length;
        }, 250);
    }

    stopShuffleAnimation() {
        clearInterval(this.shuffleInterval);
    }
}

initializeMenu();

const form = document.getElementById("formField");
form.addEventListener("submit", (event) => {
    event.preventDefault();
    const buttonCount = parseInt(document.getElementById("buttonCountInput").value);
    const gameManager = new GameManager(buttonCount);
    gameManager.start();
});