import {PlayerAction} from "../enumeration/PlayerAction.ts";
import {RoundState} from "../enumeration/RoundState.ts";

export class GameMessages {
    private static playerActions: Record<PlayerAction, (player: string, amount?: number) => string> = {
        [PlayerAction.BET]: (player, amount) => `💰 ${player} confidently places a bet of $${amount}!`,
        [PlayerAction.RAISE]: (player, amount) => `📈 ${player} takes it up a notch and raises the bet to $${amount}!`,
        [PlayerAction.FOLD]: (player) => `🙈 ${player} decides to fold. A tough choice, but sometimes the right one!`,
        [PlayerAction.CALL]: (player) => `🎯 ${player} calls the current bet. They’re staying in this game!`,
        [PlayerAction.CHECK]: (player) => `🤔 ${player} checks, keeping their cards close to their chest.`,
        [PlayerAction.QUIT]: (player) => `🚪 ${player} has left the table. Maybe next time!`,
        [PlayerAction.WAIT]: (player) => `⏳ ${player} is patiently waiting for their turn. The tension builds...`,
        [PlayerAction.HOST_SAYS_START]: () => `🎬 The host has started the game! Let’s shuffle up and deal!`,
    };

    private static roundStages: Record<RoundState, (cards?: string[]) => string> = {
        [RoundState.PRE_FLOP]: () => `🃏 The cards are dealt, and the battle begins!`,
        [RoundState.FLOP]: (cards = []) => `🎲 The Flop hits the table: ${cards.join(", ")}. The game just got real!`,
        [RoundState.TURN]: (cards = []) => `🔥 The Turn card is revealed: ${cards[0]}. Things are heating up!`,
        [RoundState.RIVER]: (cards = []) => `🌊 The River card is out: ${cards[0]}. This is the final moment of truth!`,
        [RoundState.SHOWDOWN]: () => `🏆 It's SHOWDOWN time! The players reveal their hands. Who will take the pot?`,
    };

    public static getPlayerActionMessage(playerName: string, action: PlayerAction, amount?: number): string {
        return this.playerActions[action]?.(playerName, amount) || `⚡ ${playerName} makes a bold move! What could it be?`;
    }

    public static getRoundStageMessage(stage: RoundState, cards: string[] = []): string {
        return this.roundStages[stage]?.(cards) || `🎭 The game moves to the next phase: ${stage}. Stay tuned!`;
    }

    public static getYourTurnMessage(): string {
        return `👉 It's your turn! Time to make a move — will you bet, check, or go all-in?`;
    }

    public static getOpponentTurnMessage(currentPlayer: string): string {
        return `🎭 It's ${currentPlayer}'s turn to act. What will they do next? The tension is rising!`;
    }

    public static getMyPlayerCardsRevealMessage(cards: string[]): string {
        if (cards.length === 0) {
            return `❌ An error occurred. Your hand is empty.`;
        }
        return `🃏 You flip over your cards: ${cards.join(", ")}. The moment of truth is here!`;
    }

    public static getCommunityCardsMessage(cards: string[]): string {
        return `🃏 Community cards revealed: ${cards.join(", ")}`;
    }

    public static getWinnersMessage(winnerNames: string[], sharePerWinner: number): string {
        if (winnerNames.length === 1) {
            return `🏆 ${winnerNames[0]} wins the pot and takes home $${sharePerWinner}!`;
        } else {
            const names = winnerNames.join(", ");
            return `🤝 It's a split pot! ${names} each win $${sharePerWinner}`;
        }
    }

    public static getTotalPotMessage(totalPot: number): string {
        return `💰 The total pot is now $${totalPot}`;
    }

    public static getBankruptPlayersMessage(playerNames: string[]): string {
        const names = playerNames.join(", ");
        return `😵 Bankrupt players: ${names}. Better luck next time!`;
    }

}
