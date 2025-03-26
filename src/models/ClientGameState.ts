import { PlayerAction } from "../enumeration/PlayerAction";
import { RoundState } from "../enumeration/RoundState";
import { Card } from "./Card";
import { Player } from "./Player";

export class ClientGameState {
    public myPlayerId: string = "";
    public isMyPlayerHost: boolean = false;
    public isGameStarted: boolean = false;
    public tableId: string = "";
    public players: Player[] = [];
    public tableCards: Card[] = [];
    public bettings: Map<string, number> = new Map();
    public totalPot: number = 0;
    public minimumBet: number = 0;
    public minimumCall: number = 0;
    public maximumBet: number = 0;
    public roundState?: RoundState;
    public playerIdWithTurn?: string;
    public validPlayerActions: Set<PlayerAction> = new Set();

    constructor(init?: Partial<ClientGameState>) {
        Object.assign(this, init);
    }

    public isMyPlayerTurn(): boolean {
        return this.myPlayerId === this.playerIdWithTurn;
    }

    public getPlayerById(playerId: string): Player | undefined {
        return this.players.find(player => player.playerId === playerId);
    }
}