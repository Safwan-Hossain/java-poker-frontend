import { TableIdInputManager } from "./TableIdInputComponent";

export class JoinGameUI {

    public onJoinLobbySubmitted: ((playerName: string, tableId: string) => void) | null = null;
    public onBackRequested: (() => void) | null = null;

    private nameTableFormContainer: HTMLDivElement | null;
    private backButton: HTMLButtonElement | null;
    private nameTableInput: HTMLInputElement | null;
    private nameTableSubmitButton: HTMLButtonElement | null;
    private tableIdInputManager: TableIdInputManager;

    constructor() {
        // Get DOM elements
        this.nameTableFormContainer = document.getElementById("nameTableFormContainer") as HTMLDivElement;
        this.nameTableInput = document.getElementById("nameTableInput") as HTMLInputElement;
        this.nameTableSubmitButton = document.getElementById("nameTableSubmitButton") as HTMLButtonElement;
        this.backButton = document.getElementById("backButton") as HTMLButtonElement;

        // Initialize table ID input manager
        this.tableIdInputManager = new TableIdInputManager();
        this.tableIdInputManager.setupTableIdInputs();

        this.initializeEvents();
    }

    private initializeEvents(): void {
        this.nameTableSubmitButton?.addEventListener("click", () => this.handleJoinGameSubmit());

        this.backButton?.addEventListener("click", () => {
            if (this.onBackRequested) {
                this.onBackRequested();
            }
        });
    }

    private handleJoinGameSubmit(): void {
        const playerName = this.nameTableInput?.value.trim();
        const tableIdInputs = document.querySelectorAll(".table-id-input") as NodeListOf<HTMLInputElement>;

        // Collect the 6 digit table ID
        const tableId = Array.from(tableIdInputs).map(input => input.value).join("");

        if (!playerName) {
            alert("Please enter your name.");
            return;
        }

        if (tableId.length !== 6) {
            alert("Please enter a valid 6-digit Table ID.");
            return;
        }

        if (this.onJoinLobbySubmitted) {
            this.onJoinLobbySubmitted(playerName, tableId);
        }
    }

    public show(): void {
        if (this.nameTableFormContainer) this.nameTableFormContainer.style.display = "block";
        if (this.backButton) this.backButton.style.display = "block";
    }

    public hide(): void {
        if (this.nameTableFormContainer) this.nameTableFormContainer.style.display = "none";
        if (this.backButton) this.backButton.style.display = "none";
    }
}
