export class LobbyUI {
    public onStartGameClicked: (() => void) | null = null;
    private lobbyPlayers: HTMLDivElement | null;
    private lobbyContainer: HTMLDivElement | null;
    private startGameButton: HTMLButtonElement | null;

    private players: Map<string, string>;

    constructor() {
        this.lobbyPlayers = this.getElement<HTMLDivElement>("lobbyPlayers");
        this.lobbyContainer = this.getElement<HTMLDivElement>("lobbyContainer");
        this.startGameButton = this.getElement<HTMLButtonElement>("startGameButton");

        this.players = new Map();
        this.setupCopySessionIdContainer();
        this.setupStartGameButton();
    }

    public updateSessionId(sessionId: string): void {
        const sessionIdTextElement = this.getElement<HTMLSpanElement>("sessionIdText");
        if (sessionIdTextElement) {
            sessionIdTextElement.textContent = sessionId;
        }
    }

    public toggleHostControls(isHost: boolean): void {
        const hostMessage = this.getElement<HTMLParagraphElement>("hostMessage");

        if (!this.startGameButton || !hostMessage) return;

        if (isHost) {
            this.startGameButton.style.display = "inline-block";
            hostMessage.style.display = "none";
        } else {
            this.startGameButton.style.display = "none";
            hostMessage.style.display = "block";
        }
    }

    public show(): void {
        this.toggleLobbyVisibility(true);
    }

    public hide(): void {
        this.toggleLobbyVisibility(false);
    }

    private getElement<T extends HTMLElement>(id: string): T | null {
        return document.getElementById(id) as T | null;
    }

    private setupStartGameButton(): void {
        this.startGameButton?.addEventListener("click", () => this.onStartGameClicked?.());
    }

    private toggleLobbyVisibility(isVisible: boolean): void {
        if (this.lobbyContainer) {
            this.lobbyContainer.style.display = isVisible ? "block" : "none";
        }
    }

    private updateStartGameButton() {
        if (!this.startGameButton) return;

        this.startGameButton.disabled = !this.players || this.players.size < 2;
    }

    private setupCopySessionIdContainer(): void {
        const sessionIdContainer = this.getElement<HTMLDivElement>("sessionIdContainer");
        const sessionIdTextElement = this.getElement<HTMLSpanElement>("sessionIdText");

        if (!sessionIdContainer || !sessionIdTextElement) {
            console.warn("Session ID container or text element is missing.");
            return;
        }

        sessionIdContainer.addEventListener("click", () => this.copySessionId(sessionIdTextElement, sessionIdContainer));
    }

    private async copySessionId(sessionIdTextElement: HTMLSpanElement, sessionIdContainer: HTMLDivElement): Promise<void> {
        const sessionId = sessionIdTextElement.textContent?.trim();

        if (!sessionId) {
            return;
        }

        try {
            await navigator.clipboard.writeText(sessionId);
            this.flashElement(sessionIdContainer);
        } catch (err) {
            alert("Failed to copy session ID.");
        }
    }

    private flashElement(element: HTMLElement): void {
        element.style.transition = "opacity 0.2s";
        element.style.opacity = "0.6";
        setTimeout(() => element.style.opacity = "1", 200);
    }



    /**
     * Adds a player to the lobby UI.
     * @param playerName - The name of the player.
     * @param playerId - The unique ID of the player.
     */
    public addPlayer(playerName: string, playerId: string): void {
        if (!this.players.has(playerId)) {
            this.players.set(playerId, playerName);

            const playerElement = this.createPlayerElement(playerId, playerName);
            this.lobbyPlayers?.appendChild(playerElement);
        } else {
            console.warn(`Player with ID ${playerId} already exists.`);
        }
        this.updateStartGameButton();
    }


    public removePlayer(playerId: string): void {
        if (this.players.has(playerId)) {
            this.players.delete(playerId);

            const playerElement = this.getPlayerElement(playerId);
            playerElement?.remove();
        } else {
            console.warn(`Player with ID ${playerId} does not exist.`);
        }
    }


    private getPlayerElement(playerId: string): HTMLDivElement | null {
        return this.lobbyPlayers?.querySelector(`div[data-player-id="${playerId}"]`) ?? null;
    }


    private createPlayerElement(playerId: string, playerName: string): HTMLDivElement {
        const playerElement = document.createElement("div");
        playerElement.classList.add("player-card");
        playerElement.dataset.playerId = playerId;

        const playerNameElement = document.createElement("span");
        playerNameElement.classList.add("player-name");
        playerNameElement.textContent = playerName;

        playerElement.appendChild(playerNameElement);
        return playerElement;
    }

}
