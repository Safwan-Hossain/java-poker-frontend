import {catchError, tap} from "rxjs/operators";
import {PlayerAction} from "../enumeration/PlayerAction";
import {UserClient} from "../client/UserClient";
import {ClientGameState} from "../models/ClientGameState";
import {ViewUpdateHandler} from "./ViewUpdateHandler";
import {ClientGameStateUpdateHandler} from "./ClientGameStateUpdateHandler.ts";
import {GameUpdate} from "../updates/GameUpdate";
import {INVALID_BET_AMOUNT} from "../constants/Constants";
import {PlayerActionUpdate} from "../updates/impl/PlayerActionUpdate";
import {UIManager} from "../view/UIManager.ts";
import {Observable, of} from "rxjs";

export class GameSessionController {
    private localState: ClientGameState;
    private gameStateUpdateHandler: ClientGameStateUpdateHandler;
    private viewUpdateHandler: ViewUpdateHandler;
    private userClient: UserClient;
    private readonly uiManager: UIManager;

    constructor(uiManager: UIManager) {
        this.uiManager = uiManager;
        this.userClient = new UserClient();
        this.localState = new ClientGameState();
        this.gameStateUpdateHandler = new ClientGameStateUpdateHandler(this.localState);
        this.viewUpdateHandler = new ViewUpdateHandler(this.uiManager, this.localState);

        this.uiManager.onCreateLobby = (playerName) => this.createNewLobby(playerName);
        this.uiManager.onJoinLobby = (playerName, tableId) => this.joinExistingLobby(playerName, tableId);
        this.uiManager.onStartGame = () => this.handleStartGameAction().subscribe();
        this.uiManager.onPlayerAction = (action, amount) => this.sendPlayerActionUpdate(action, amount)
    }

    public init() {
        this.uiManager.init();
    }

    createNewLobby(playerName: string): void {
        this.userClient.connectToNewGame(playerName)
            .pipe(
                tap(() => this.subscribeToInboundUpdates()),
                catchError(this.onFailToConnectToServer)
            )
            .subscribe();
    }


    joinExistingLobby(playerName: string, tableId: string): void {
        this.userClient.connectToExistingGame(playerName, tableId)
            .pipe(
                tap(() => this.subscribeToInboundUpdates()),
                catchError(this.onFailToConnectToServer)
            )
            .subscribe();
    }


    private onFailToConnectToServer(error: any): Observable<void> {
        console.error("Failed to connect to server. Please exit.", error);
        return of();
    }


    // sets up subscription for incoming updates
    private subscribeToInboundUpdates(): void {
        this.userClient.receiveGameUpdates().subscribe({
            next: (update: GameUpdate) => this.handleServerUpdate(update),
            error: (error) => console.error("Inbound stream error:", error),
            complete: () => console.info("Server closed the connection."),
        });
    }

    private handleServerUpdate(update: GameUpdate): void {
        of(update).pipe(
            tap(this.logUpdateType),
            tap(this.updateGameState),
            tap(this.updateView)
        ).subscribe();
    }


    private logUpdateType(update: GameUpdate): void {
        console.warn(`Received update type: ${typeof update}`, update);
    }


    private updateGameState = (update: GameUpdate): void => {
        this.gameStateUpdateHandler.updateGameState(update);
    };

    private updateView = (update: GameUpdate): void => {
        this.viewUpdateHandler.updateView(update);
    };


    private handleStartGameAction(): Observable<void> {
        return this.sendPlayerActionUpdate(PlayerAction.HOST_SAYS_START, INVALID_BET_AMOUNT);
    }


    private sendPlayerActionUpdate(action: PlayerAction, betAmount: number): Observable<void> {
        const update:PlayerActionUpdate = this.createPlayerActionUpdate(action, betAmount);
        return this.sendGameUpdate(update);
    }


    private createPlayerActionUpdate(action: PlayerAction, betAmount: number): PlayerActionUpdate {

        if (action == PlayerAction.BET || action == PlayerAction.RAISE) {
            if (this.localState.validPlayerActions.has(PlayerAction.BET)) {
                action = PlayerAction.BET;
            }
            else {
                action = PlayerAction.RAISE;
            }

        }
        return new PlayerActionUpdate(this.localState.myPlayerId, action, betAmount, -1, -1);
    }


    private sendGameUpdate(update: PlayerActionUpdate): Observable<void> {
        this.userClient.sendGameUpdate(update);
        return of(void 0);
    }
}
