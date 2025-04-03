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
import {HandRank} from "../enumeration/HandRank.ts";
import {GameOverUpdate} from "../updates/impl/GameOverUpdate.ts";

export class ViewUpdateHandler implements GameUpdateVisitor {
    constructor(
        private readonly uiManager: UIManager,
        private readonly localState: ClientGameState // Readonly to prevent mutation
    ) {}

    public updateView(update: GameUpdate): void {
        update.dispatchTo(this);
    }

    handleGameStateSnapshotUpdate(update: GameStateSnapshotUpdate): void {

        const player = this.getPlayerById(update.playerIdWithTurn);

        if (!player) { return; }

        if (update.roundState == RoundState.PRE_FLOP) {
            console.log("GAME STARTED");
            this.uiManager.onGameStarted();
            this.uiManager.announceRoundState(update.roundState);
            this.uiManager.revealMyPlayerCards(update.playerHand);
        }
    }

    handlePlayerActionUpdate(update: PlayerActionUpdate): void {
        const player = this.getPlayerById(update.playerId);
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
        if (update.connectionStatus == ConnectionStatus.JOINED) {
            this.uiManager.onNewPlayerJoined(update.playerName, update.playerId);
        }
        if (update.connectionStatus == ConnectionStatus.DISCONNECTED) {
            this.uiManager.onPlayerLeft(update.playerId);
        }
    }

    handlePlayerSetupUpdate(update: PlayerSetupUpdate): void {
        this.uiManager.setSessionId(update.tableSessionId);
        this.uiManager.addMultiplePlayers(update.existingPlayers);
    }

    handleShowdownResultUpdate(update: ShowdownResultUpdate): void {

        update.players.forEach(player => {
            const handEvaluation = update.playerHandEvaluations.get(player.playerId);

            if (!handEvaluation) return;

            const playerName = player.name;
            const cards = handEvaluation ? handEvaluation.getCards().map(card => card.toString()) : ['Unknown cards'];
            const handRank = HandRank.getDescription(handEvaluation.handRank);

            this.uiManager.displayPlayerHand(playerName, cards, handRank);
        });

        const winners = update.winnersForThisRound
            .map(winner => {
                const handEvaluation = update.playerHandEvaluations.get(winner.playerId)!;
                return {
                    name: winner.name,
                    handRank: HandRank.getDescription(handEvaluation.handRank),
                };
            });

        this.uiManager.displayWinners(winners, update.sharePerWinner);


        // Display total pot
        this.uiManager.displayTotalPot(update.totalPot);

        // Announce bankrupt players if any
        if (update.bankruptPlayers.length > 0) {
            const bankruptNames = update.bankruptPlayers.map(p => p.name);
            this.uiManager.announceBankruptPlayers(bankruptNames);
        }
    }


    handleGameOverUpdate(update: GameOverUpdate) {
        this.uiManager.announceGameOver(update.winner.name, update.winner.chips);
    }

    private getPlayerById(playerId: string): Player | null {
        return this.localState.players.find(player => player.playerId === playerId) || null;
    }

    private isMyPlayer(playerId: string): boolean {
        return this.localState.myPlayerId === playerId;
    }
}
