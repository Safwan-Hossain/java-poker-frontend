export class TableIdInputManager {
    private tableIdInputs: NodeListOf<HTMLInputElement>;

    constructor() {
        this.tableIdInputs = document.querySelectorAll(".table-id-input");
    }

    public setupTableIdInputs(): void {
        this.tableIdInputs.forEach((input, index) => {
            input.addEventListener("input", (e) => this.handleInput(e, index));
            input.addEventListener("keydown", (e) => this.handleKeyDown(e, index));
            input.addEventListener("click", (e) => this.handleClick(e));
            input.addEventListener("paste", (e) => this.handlePaste(e, index)); // Add paste event listener
        });
    }

    private handleInput(event: Event, index: number): void {
        const target = event.target as HTMLInputElement;
        const value = target.value;

        if (!this.isValidInput(value)) {
            target.value = "";
            return;
        }

        // Move to the next input if the current one has a value
        if (value && index < this.tableIdInputs.length - 1) {
            this.tableIdInputs[index + 1].focus();
        }
    }

    private handleKeyDown(event: KeyboardEvent, index: number): void {
        const target = event.target as HTMLInputElement;

        // Move back if pressing backspace in an empty input
        if (event.key === "Backspace" && !target.value && index > 0) {
            this.tableIdInputs[index - 1].focus();
        }
    }

    private handleClick(event: MouseEvent): void {
        event.preventDefault();
        this.focusFirstEmptyInput();
    }

    private handlePaste(event: ClipboardEvent, index: number): void {
        event.preventDefault();
        const clipboardData = event.clipboardData?.getData("text") || "";
        const sanitizedData = clipboardData.replace(/[^a-zA-Z0-9]/g, ""); // Remove invalid characters

        if (!sanitizedData) return;

        let currentIndex = index;
        for (let char of sanitizedData) {
            if (currentIndex >= this.tableIdInputs.length) break;
            this.tableIdInputs[currentIndex].value = char;
            currentIndex++;
        }

        // Focus on the next empty input after paste
        this.focusFirstEmptyInput();
    }

    /**
     * allows only letters and numbers (A-Z, a-z, 0-9).
     */
    private isValidInput(value: string): boolean {
        return /^[a-zA-Z0-9]$/.test(value);
    }

    /**
     * Focus on the first empty input box.
     */
    public focusFirstEmptyInput(): void {
        for (const input of this.tableIdInputs) {
            if (input.value === "") {
                input.focus();
                return;
            }
        }

        // If all boxes are filled, focus the last one
        this.tableIdInputs[this.tableIdInputs.length - 1].focus();
    }
}
