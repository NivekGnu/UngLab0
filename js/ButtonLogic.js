import { STRINGS } from "../lang/messages/en/string.js";

export class Button {
    constructor(id, color, onClick) {
        this.id = id;
        this.color = color;
        this.element = document.getElementById("gameContainer").appendChild(document.createElement("button"));
        this.setup(onClick);
    }

    setup(onClick) {
        this.element.style.cssText = `
            position: relative;
            background-color: ${this.color};
            width: 180px;
            height: 50px;
            margin: 10px;
            cursor: pointer;
            font-weight: bold;
            font-size: 40px;
            margin: 0;
        `;
        this.element.addEventListener("click", () => onClick(this.id));
        document.getElementById("gameContainer").appendChild(this.element);
    }

    moveButton(x, y) {
        this.element.style.left = `${x}px`;
        this.element.style.top = `${y}px`;
    }

    setLabel(label) {
        this.element.innerText = label;
    }

    toggleDisabled() {
        this.element.disabled = true;
        this.element.style.opacity = 0.5;
        this.element.style.cursor = "not-allowed";
    }
}
