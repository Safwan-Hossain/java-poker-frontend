import {ClientGameState} from "../models/ClientGameState";
import {GameUpdateVisitor} from "../updates/GameUpdateVisitor";
import {GameUpdate} from "../updates/GameUpdate";
import {GameStateSnapshotUpdate} from "../updates/impl/GameStateSnapshotUpdate";
import {PlayerActionUpdate} from "../updates/impl/PlayerActionUpdate";
import {PlayerTurnUpdate} from "../updates/impl/PlayerTurnUpdate";
import {RoundStateUpdate} from "../updates/impl/RoundStateUpdate";
import {ServerMessageUpdate} from "../updates/impl/ServerMessageUpdate";
import {ConnectionStatusUpdate} from "../updates/impl/ConnectionStatusUpdate";
import {PlayerSetupUpdate} from "../updates/impl/PlayerSetupUpdate";
import {ShowdownResultUpdate} from "../updates/impl/ShowdownResultUpdate";
import {Player} from "../models/Player";
import {UIManager} from "../view/UIManager.ts";
import {ConnectionStatus} from "../enumeration/ConnectionStatus.ts";
import {RoundState} from "../enumeration/RoundState.ts";

export class ViewUpdateHandler implements GameUpdateVisitor {
    constructor(
        private readonly uiManager: UIManager,
        private readonly localState: ClientGameState // Readonly to prevent mutation
    ) {}

    public updateView(update: GameUpdate): void {
        update.dispatchTo(this);
    }

    handleGameStateSnapshotUpdate(update: GameStateSnapshotUpdate): void {

        console.log("SNAPSHOT RECEIVED");
        const player = this.getPlayerById(update.playerIdWithTurn);

        if (!player) { return; }

        console.log(update.roundState == RoundState.PRE_FLOP, update.roundState);
        if (update.roundState == RoundState.PRE_FLOP) {
            console.log("GAME STARTED");
            this.uiManager.onGameStarted();
            this.uiManager.announceRoundState(update.roundState);
            this.uiManager.revealMyPlayerCards(update.playerHand);
        }
    }

    handlePlayerActionUpdate(update: PlayerActionUpdate): void {
        const player = this.getPlayerById(update.playerId);
        console.log("PLAYER: ", player, update)
        if (player) {
            this.uiManager.displayPlayerAction(player.name, update.action, update.betAmount);
        }
    }

    handlePlayerTurnUpdate(update: PlayerTurnUpdate): void {
        const isMyPlayerTurn = this.isMyPlayer(update.playerIdWithTurn);
        const player = this.getPlayerById(update.playerIdWithTurn);
        if (!player) { return; }

        this.uiManager.announceTurn(player.name, isMyPlayerTurn);

        if (isMyPlayerTurn) {
            this.uiManager.setBetRange(update.minimumBetAmount, update.maximumBetAmount);
            this.uiManager.updateAvailableActions(update.validPlayerActions)
        }
    }

    handleRoundStateUpdate(update: RoundStateUpdate): void {
        if (update) {
            this.uiManager.announceRoundState(update.roundState, update.tableCards.map(card => card.toString()));
        }
    }

    handleServerMessageUpdate(update: ServerMessageUpdate): void {
        if (update) {

        }
        // this.gameView.displayServerMessage(update.serverMessage);
    }

    handleConnectionStatusUpdate(update: ConnectionStatusUpdate): void {
        console.log("CONNECTION UPDATE: ", update);
        if (update.connectionStatus == ConnectionStatus.JOINED) {
            this.uiManager.onNewPlayerJoined(update.playerName, update.playerId);
        }
    }

    handlePlayerSetupUpdate(update: PlayerSetupUpdate): void {
        this.uiManager.setSessionId(update.tableSessionId);
        this.uiManager.addMultiplePlayers(update.existingPlayers);
    }

    handleShowdownResultUpdate(update: ShowdownResultUpdate): void {
        // Show final table cards
        // this.uiManager.displayTableCards(update.tableCards);

        // Announce winners and how much each won
        if (update.winnersForThisRound.length > 0) {
            const winnerNames = update.winnersForThisRound.map(p => p.name);
            const share = update.sharePerWinner;
            this.uiManager.displayWinners(winnerNames, share);
        }

        // Display total pot
        this.uiManager.displayTotalPot(update.totalPot);

        // Announce bankrupt players if any
        if (update.bankruptPlayers.length > 0) {
            const bankruptNames = update.bankruptPlayers.map(p => p.name);
            this.uiManager.announceBankruptPlayers(bankruptNames);
        }
    }


    private getPlayerById(playerId: string): Player | null {
        return this.localState.players.find(player => player.playerId === playerId) || null;
    }

    private isMyPlayer(playerId: string): boolean {
        return this.localState.myPlayerId === playerId;
    }
}
