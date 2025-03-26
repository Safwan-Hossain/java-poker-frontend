import { PlayerAction } from "../enumeration/PlayerAction.ts";
import { RoundState } from "../enumeration/RoundState.ts";
import { GameMessages } from "./GameMessages.ts";
import {NarrationManager} from "./NarrationManager.ts";
import {Card} from "../models/Card.ts";
import {rankToString} from "../enumeration/Rank.ts";
import {suitToSymbol} from "../enumeration/Suit.ts";

export class GameUI {
    private readonly INVALID_BET_AMOUNT = -1;

    private gameInteraction!: HTMLDivElement;
    private cardRevealContainer!: HTMLDivElement;
    private betSlider!: HTMLInputElement;
    private betValueDisplay!: HTMLSpanElement;
    private foldButton!: HTMLButtonElement;
    private callButton!: HTMLButtonElement;
    private betRaiseButton!: HTMLButtonElement;
    private quitButton!: HTMLButtonElement;
    private playerCardsContainer!: HTMLDivElement;
    private totalPotAmount!: HTMLElement;



    private currentAvailableActions: Set<PlayerAction> = new Set();
    private narration!: NarrationManager;

    constructor() {
        this.initializeUIElements();
        this.narration = new NarrationManager("narrationList");
        this.setupBetSliderHandler();
        this.disableActionButtons();
    }

    private initializeUIElements(): void {
        this.gameInteraction = document.getElementById("gameInteraction") as HTMLDivElement;
        this.cardRevealContainer = document.getElementById("cardRevealContainer") as HTMLDivElement;
        this.betSlider = document.getElementById("betSlider") as HTMLInputElement;
        this.betValueDisplay = document.getElementById("betValueDisplay") as HTMLSpanElement;
        this.foldButton = document.getElementById("foldButton") as HTMLButtonElement;
        this.callButton = document.getElementById("callButton") as HTMLButtonElement;
        this.betRaiseButton = document.getElementById("betRaiseButton") as HTMLButtonElement;
        this.quitButton = document.getElementById("quitButton") as HTMLButtonElement;
        this.playerCardsContainer = document.getElementById("playerCards") as HTMLDivElement;
        this.totalPotAmount = document.getElementById("totalPotAmount") as HTMLDivElement;


    }

    public updateTotalPot(amount: number): void {
        this.totalPotAmount.textContent = `$${amount}`;
    }



    public displayPlayerCards(cards: Card[]): void {
        this.playerCardsContainer.innerHTML = "";

        for (const card of cards) {
            const cardEl = this.createCardElement(card);
            this.playerCardsContainer.appendChild(cardEl);
        }
    }


    private createCardElement(card: Card): HTMLDivElement {
        const cardEl = document.createElement("div");
        cardEl.classList.add("card");

        const rank = rankToString(card.rank);
        const suitSymbol = suitToSymbol(card.suit);
        const isRed = suitSymbol === "♥" || suitSymbol === "♦";

        cardEl.classList.add(isRed ? "red" : "black");

        cardEl.innerHTML = `
        <div class="corner top">${rank}</div>
        <div class="suit">${suitSymbol}</div>
        <div class="corner bottom">${rank}</div>
        `;

        return cardEl;
    }


    public displayWinners(winnerNames: string[], sharePerWinner: number): void {
        const message = GameMessages.getWinnersMessage(winnerNames, sharePerWinner);
        void this.narration.queueMessage(message);
    }

    public displayTotalPot(totalPot: number): void {
        this.totalPotAmount.textContent = `$${totalPot}`;
        void this.narration.queueMessage(GameMessages.getTotalPotMessage(totalPot));
    }

    public announceBankruptPlayers(playerNames: string[]): void {
        const message = GameMessages.getBankruptPlayersMessage(playerNames);
        void this.narration.queueMessage(message);
    }

    private setupBetSliderHandler(): void {
        this.betSlider.addEventListener("input", () => {
            const amount = this.getSelectedBetAmount();
            this.betValueDisplay.textContent = `$${amount}`;
            this.betRaiseButton.textContent = amount > 0 ? "Raise" : "Bet";
        });
    }

    public onPlayerAction(callback: (action: PlayerAction, amount: number) => void): void {
        this.foldButton.addEventListener("click", () => {
            callback(PlayerAction.FOLD, this.INVALID_BET_AMOUNT);
            this.disableActionButtons();
        });

        this.callButton.addEventListener("click", () => {
            const isCheck = this.currentAvailableActions.has(PlayerAction.CHECK);
            const action = isCheck ? PlayerAction.CHECK : PlayerAction.CALL;
            const amount = isCheck ? this.INVALID_BET_AMOUNT : this.getSelectedBetAmount();
            callback(action, amount);
            this.disableActionButtons();
        });

        this.betRaiseButton.addEventListener("click", () => {
            const amount = this.getSelectedBetAmount();
            const action = amount > 0 ? PlayerAction.RAISE : PlayerAction.BET;
            callback(action, amount);
            this.disableActionButtons();
        });
    }

    public onQuit(callback: () => void): void {
        this.quitButton.addEventListener("click", callback);
    }

    public show(): void {
        this.gameInteraction.style.display = "flex";
    }

    public hide(): void {
        this.gameInteraction.style.display = "none";
    }

    public disableActionButtons(): void {
        this.foldButton.disabled = true;
        this.callButton.disabled = true;
        this.betRaiseButton.disabled = true;
    }

    public async updateAvailableActions(actions: Set<PlayerAction>): Promise<void> {
        await this.narration.waitUntilDone();

        this.currentAvailableActions = actions;

        this.foldButton.disabled = !actions.has(PlayerAction.FOLD);

        const canCall = actions.has(PlayerAction.CALL);
        const canCheck = actions.has(PlayerAction.CHECK);
        this.callButton.disabled = !canCall && !canCheck;
        this.callButton.textContent = canCheck ? "Check" : "Call";

        const canBetOrRaise = actions.has(PlayerAction.BET) || actions.has(PlayerAction.RAISE);
        this.betRaiseButton.disabled = !canBetOrRaise;

        if (canBetOrRaise) {
            const amount = this.getSelectedBetAmount();
            this.betRaiseButton.textContent = amount > 0 ? "Raise" : "Bet";
        }
    }

    public displayPlayerAction(playerName: string, action: PlayerAction, amount?: number): void {
        const msg = GameMessages.getPlayerActionMessage(playerName, action, amount);
        void this.narration.queueMessage(msg);
    }

    public revealCards(stage: RoundState, cards: string[]): void {
        const msg = GameMessages.getRoundStageMessage(stage, cards);
        void this.narration.queueMessage(msg);
    }

    public announceYourTurn(): void {
        void this.narration.queueMessage(GameMessages.getYourTurnMessage());
    }

    public announceOpponentTurn(currentPlayer: string): void {
        void this.narration.queueMessage(GameMessages.getOpponentTurnMessage(currentPlayer));
    }

    public announceNewRoundState(roundState: RoundState, cards: string[] = []): void {
        void this.narration.queueMessage(GameMessages.getRoundStageMessage(roundState, cards));
    }

    public revealMyPlayerCards(cards: string[] = []): void {
        void this.narration.queueMessage(GameMessages.getMyPlayerCardsRevealMessage(cards));
    }

    public clearRevealedCards(): void {
        this.cardRevealContainer.innerHTML = "";
    }

    public setBetRange(min: number, max: number, defaultValue: number = min): void {
        this.betSlider.min = min.toString();
        this.betSlider.max = max.toString();
        this.betSlider.value = defaultValue.toString();
        this.betValueDisplay.textContent = `$${defaultValue}`;
    }

    public setBetStep(step: number): void {
        this.betSlider.step = step.toString();
    }

    public getSelectedBetAmount(): number {
        return parseInt(this.betSlider.value, 10);
    }
}