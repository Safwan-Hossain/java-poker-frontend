import { MainMenuUI } from "./MainMenuUI";
import { NameFormUI } from "./NameFormUI";
import { LobbyUI } from "./LobbyUI";
import { GameUI } from "./GameUI";
import { JoinGameUI } from "./JoinGameUI";
import {Player} from "../models/Player.ts";
import {PlayerAction} from "../enumeration/PlayerAction.ts";
import {RoundState} from "../enumeration/RoundState.ts";
import {Card} from "../models/Card.ts";

export class UIManager {
    private mainMenuUI: MainMenuUI;
    private nameFormUI: NameFormUI;
    private joinGameUI: JoinGameUI;
    private lobbyUI: LobbyUI;
    private gameUI: GameUI;

    public onCreateLobby: ((playerName: string) => void) | null = null;
    public onJoinLobby: ((playerName: string, tableId: string) => void) | null = null;
    public onStartGame: (() => void) | null = null;
    public onPlayerAction: ((action: PlayerAction, amount: number) => void) | null = null;


    constructor() {
        this.mainMenuUI = new MainMenuUI();
        this.nameFormUI = new NameFormUI();
        this.joinGameUI = new JoinGameUI();
        this.lobbyUI = new LobbyUI();
        this.gameUI = new GameUI();

        // Set up UI event handlers
        this.mainMenuUI.onNewGameRequested = () => this.showNameForm();
        this.mainMenuUI.onJoinGameRequested = () => this.showJoinGameForm();
        this.mainMenuUI.onQuitGameRequested = () => alert("Thanks for playing Java Poker!");

        this.nameFormUI.onBackRequested = () => this.showMainMenu();

        this.nameFormUI.onNameSubmitted = (playerName) => {
            console.log("Trying to connect to lobby");
            this.onCreateLobby?.(playerName);
            this.lobbyUI.toggleHostControls(true);
            this.showLobby();
        };

        this.joinGameUI.onJoinLobbySubmitted = (playerName, tableId) => {
            this.onJoinLobby?.(playerName, tableId);
            this.lobbyUI.toggleHostControls(false);
            this.showLobby();
        };
        this.joinGameUI.onBackRequested = () => this.showMainMenu();

        this.lobbyUI.onStartGameClicked = () => {
            this.onStartGame?.();
            this.showGameUI();
        };

        this.gameUI.onPlayerAction((action, amount) => {
            this.onPlayerAction?.(action, amount);
        });

    }


    public init(): void {
        this.showMainMenu();
    }

    public displayTableCards(_cards: Card[]): void {
        // this.gameUI.displayTableCards(cards);
    }

    public displayWinners(winnerNames: string[], sharePerWinner: number): void {
        this.gameUI.displayWinners(winnerNames, sharePerWinner);
    }

    public displayTotalPot(totalPot: number): void {
        this.gameUI.displayTotalPot(totalPot);
    }

    public announceBankruptPlayers(playerNames: string[]): void {
        this.gameUI.announceBankruptPlayers(playerNames);
    }


    public setBetRange(min: number, max: number): void {
        this.gameUI.setBetRange(min, max);
    }

    public setBetStep(step: number): void {
        this.gameUI.setBetStep(step);
    }

    // TODO - change method name and better flow of how this is called from view handler
    public onGameStarted() {
        this.showGameUI();
    }

    public setSessionId(sessionId: string) {
        this.lobbyUI.updateSessionId(sessionId);
    }

    public onNewPlayerJoined(playerName: string, playerId: string) {
        this.lobbyUI.addPlayer(playerName, playerId);
    }

    public addMultiplePlayers(players: Player[]): void {
        players.forEach(player  => { this.lobbyUI.addPlayer(player.name, player.playerId);});
    }

    public displayPlayerAction(playerName: string, action: PlayerAction, amount?: number) {
        this.gameUI.displayPlayerAction(playerName, action, amount);
    }

    public announceRoundState(roundState: RoundState, cards: string[] = []) {
        this.gameUI.announceNewRoundState(roundState, cards);
    }

    public revealMyPlayerCards(cards: Card[]): void {
        this.gameUI.revealMyPlayerCards(cards.map(card => card.toString()));
        this.gameUI.displayPlayerCards(cards);

    }
    public updateAvailableActions(actions: Set<PlayerAction>): void {
        this.gameUI.updateAvailableActions(actions);
    }

    public announceTurn(playerName: string, isMyPlayerTurn: boolean): void {
        isMyPlayerTurn ? this.gameUI.announceYourTurn() : this.gameUI.announceOpponentTurn(playerName);
    }

    // UI Transition Methods
    private showMainMenu(): void {
        this.hideAll();
        this.mainMenuUI.show();
    }

    private showNameForm(): void {
        this.hideAll();
        this.nameFormUI.show();
    }

    private showJoinGameForm(): void {
        this.hideAll();
        this.joinGameUI.show();
    }

    private showLobby(): void {
        this.hideAll();
        this.lobbyUI.show();
    }

    private showGameUI(): void {
        this.hideAll();
        this.gameUI.show();
    }

    /**
     * Hides all UI screens.
     */
    private hideAll(): void {
        this.mainMenuUI.hide();
        this.nameFormUI.hide();
        this.joinGameUI.hide();
        this.lobbyUI.hide();
        this.gameUI.hide();
    }
}
