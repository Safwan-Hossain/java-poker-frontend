export class NameFormUI {
    // Callbacks
    public onNameSubmitted: ((playerName: string) => void) | null = null;
    public onBackRequested: (() => void) | null = null;

    private readonly nameFormContainer: HTMLDivElement;

    constructor() {
        this.nameFormContainer = document.getElementById("nameFormContainer") as HTMLDivElement;
        const nameInput = document.getElementById("nameInput") as HTMLInputElement;
        const nameSubmitButton = document.getElementById("nameSubmitButton") as HTMLButtonElement;
        const backButton = document.getElementById("backButton") as HTMLButtonElement;

        nameSubmitButton?.addEventListener("click", () => {
            const playerName = nameInput?.value.trim();
            if (!playerName) {
                alert("Please enter your name to start the game.");
                return;
            }

            if (this.onNameSubmitted) {
                this.onNameSubmitted(playerName);
            }
        });

        backButton?.addEventListener("click", () => {
            if (this.onBackRequested) {
                this.onBackRequested();
            }
        });
    }

    public show(): void {
        const backButton = document.getElementById("backButton");
        if (this.nameFormContainer) this.nameFormContainer.style.display = "flex";
        if (backButton) backButton.style.display = "block";
    }

    public hide(): void {
        const backButton = document.getElementById("backButton");
        if (this.nameFormContainer) this.nameFormContainer.style.display = "none";
        if (backButton) backButton.style.display = "none";
    }
}
