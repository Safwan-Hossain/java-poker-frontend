import {GameUpdateVisitor} from "../updates/GameUpdateVisitor.ts";
import {GameUpdate} from "../updates/GameUpdate.ts";

import {GameStateSnapshotUpdate} from "../updates/impl/GameStateSnapshotUpdate.ts";
import {PlayerActionUpdate} from "../updates/impl/PlayerActionUpdate.ts";
import {PlayerTurnUpdate} from "../updates/impl/PlayerTurnUpdate.ts";
import {RoundStateUpdate} from "../updates/impl/RoundStateUpdate.ts";
import {ServerMessageUpdate} from "../updates/impl/ServerMessageUpdate.ts";
import {ConnectionStatusUpdate} from "../updates/impl/ConnectionStatusUpdate.ts";
import {PlayerSetupUpdate} from "../updates/impl/PlayerSetupUpdate.ts";
import {ShowdownResultUpdate} from "../updates/impl/ShowdownResultUpdate.ts";

import {ClientGameState} from "../models/ClientGameState.ts";
import {Player} from "../models/Player.ts";
import {PlayerAction} from "../enumeration/PlayerAction.ts";
import {ConnectionStatus} from "../enumeration/ConnectionStatus.ts";

export class ClientGameStateUpdateHandler implements GameUpdateVisitor {
    private localGameState: ClientGameState;

    constructor(localGameState: ClientGameState) {
        this.localGameState = localGameState;
    }

    public updateGameState(update: GameUpdate): void {
        console.log("Update game state", typeof update);
        update.dispatchTo(this);
    }

    public handlePlayerSetupUpdate(update: PlayerSetupUpdate): void {
        this.localGameState.myPlayerId = update.playerId;
        this.localGameState.isMyPlayerHost = update.isHost;
        console.log("LOCAL STATE IN HANDLER: ", this.localGameState)
    }

    public handleGameStateSnapshotUpdate(update: GameStateSnapshotUpdate): void {
        if (this.isMyPlayer(update.targetPlayerIdToUpdate)) {
            this.localGameState.players = update.sanitizedPlayers;
            this.localGameState.bettings = update.playerBettings;
            this.localGameState.tableCards = update.tableCards;
            this.localGameState.roundState = update.roundState;
            this.localGameState.playerIdWithTurn = update.playerIdWithTurn;
        }
    }

    public handlePlayerActionUpdate(update: PlayerActionUpdate): void {
        const player = this.localGameState.getPlayerById(update.playerId);
        if (player === undefined) {
            return;
        }
        switch (update.action) {
            case PlayerAction.HOST_SAYS_START:
                break;
            case PlayerAction.QUIT:
                break;
            case PlayerAction.FOLD:
                player.isFolded = true;
                break;
            case PlayerAction.BET:
                player.chips -= update.betAmount;
                this.localGameState.totalPot += update.betAmount;
                break;
            case PlayerAction.RAISE:
                player.chips -= update.betAmount;
                this.localGameState.totalPot += update.betAmount;
                break;
            case PlayerAction.CALL:
                player.chips -= update.betAmount;
                this.localGameState.totalPot += update.betAmount;
                break;
            case PlayerAction.CHECK:
                break;
            case PlayerAction.WAIT:
                break;
        }
    }

    public handlePlayerTurnUpdate(update: PlayerTurnUpdate): void {
        this.localGameState.playerIdWithTurn = update.playerIdWithTurn;
        this.localGameState.minimumBet = update.minimumBetAmount;
        this.localGameState.minimumCall = update.minimumCallAmount;

        if (this.isMyPlayer(update.playerIdWithTurn)) {
            this.localGameState.maximumBet = update.minimumCallAmount;
            this.localGameState.validPlayerActions = update.validPlayerActions;
        }
    }

    public handleRoundStateUpdate(update: RoundStateUpdate): void {
        this.localGameState.roundState = update.roundState;
        this.localGameState.tableCards = [...update.tableCards];
    }

    public handleServerMessageUpdate(_update: ServerMessageUpdate): void {
    }

    public handleConnectionStatusUpdate(update: ConnectionStatusUpdate): void {
        if (this.isMyPlayer(update.playerId)) {
            return;
        }

        switch (update.connectionStatus) {
            case ConnectionStatus.JOINED:
                this.addNewPlayer(update);
                break;
            case ConnectionStatus.DISCONNECTED:
            case ConnectionStatus.RECONNECTED:
                break;
        }
    }

    public handleShowdownResultUpdate(update: ShowdownResultUpdate): void {
        this.localGameState.roundState = update.roundState;
        this.localGameState.players = [...update.players];
        this.localGameState.tableCards = [...update.tableCards];
        this.localGameState.totalPot = update.totalPot;
    }

    private addNewPlayer(update: ConnectionStatusUpdate): void {
        const player = new Player(update.playerName, update.playerId);
        this.localGameState.players = [...this.localGameState.players, player];
    }

    private isMyPlayer(playerId: string): boolean {
        return this.localGameState.myPlayerId === playerId;
    }
}
