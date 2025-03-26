export class MainMenuUI {
    // Callbacks for high-level events
    public onNewGameRequested: (() => void) | null = null;
    public onJoinGameRequested: (() => void) | null = null;
    public onQuitGameRequested: (() => void) | null = null;

    constructor() {
        const newGameButton = document.getElementById("newGame") as HTMLButtonElement;
        const joinGameButton = document.getElementById("joinGame") as HTMLButtonElement;
        const quitGameButton = document.getElementById("quitGame") as HTMLButtonElement;

        newGameButton?.addEventListener("click", () => {
            if (this.onNewGameRequested) {
                this.onNewGameRequested();
            }
        });

        joinGameButton?.addEventListener("click", () => {
            if (this.onJoinGameRequested) {
                this.onJoinGameRequested();
            }
        });

        quitGameButton?.addEventListener("click", () => {
            if (this.onQuitGameRequested) {
                this.onQuitGameRequested();
            }
        });
    }

    public show(): void {
        // Show main menu container
        const mainMenuContainer = document.getElementById("mainMenuContainer") as HTMLDivElement;
        if (mainMenuContainer) mainMenuContainer.style.display = "block";
    }

    public hide(): void {
        // Hide main menu container
        const mainMenuContainer = document.getElementById("mainMenuContainer") as HTMLDivElement;
        if (mainMenuContainer) mainMenuContainer.style.display = "none";
    }
}
