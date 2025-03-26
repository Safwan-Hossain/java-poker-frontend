import { GameUpdate } from "../GameUpdate";
import { GameUpdateVisitor } from "../GameUpdateVisitor";
import { RoundState } from "../../enumeration/RoundState";
import { Card } from "../../models/Card";
import { Player } from "../../models/Player";
import {GameUpdateType} from "../../enumeration/GameUpdateType.ts";

export class GameStateSnapshotUpdate extends GameUpdate {
    readonly updateType = GameUpdateType.GAME_STATE_SNAPSHOT_UPDATE;
    readonly targetPlayerIdToUpdate: string;
    readonly playerIdWithTurn: string;
    readonly roundState: RoundState;
    readonly playerBettings: Map<string, number>;
    readonly sanitizedPlayers: Player[];
    readonly tableCards: Card[];
    readonly playerHand: Card[];

    constructor(
        targetPlayerIdToUpdate: string,
        playerIdWithTurn: string,
        roundState: RoundState,
        playerBettings: Map<string, number>,
        sanitizedPlayers: Player[],
        tableCards: Card[],
        playerHand: Card[]
    ) {
        super();
        this.targetPlayerIdToUpdate = targetPlayerIdToUpdate;
        this.playerIdWithTurn = playerIdWithTurn;
        this.roundState = roundState;
        this.playerBettings = playerBettings;
        this.sanitizedPlayers = sanitizedPlayers;
        this.tableCards = tableCards;
        this.playerHand = playerHand;
    }

    static fromJSON(raw: any): GameStateSnapshotUpdate {
        return new GameStateSnapshotUpdate(
            raw.targetPlayerIdToUpdate,
            raw.playerIdWithTurn,
            raw.roundState,
            new Map(Object.entries(raw.playerBettings)),
            raw.sanitizedPlayers.map((p: any) => Player.fromJSON(p)),
            raw.tableCards.map((c: any) => Card.fromJSON(c)),
            raw.playerHand.map((c: any) => Card.fromJSON(c))
        );
    }

    dispatchTo(visitor: GameUpdateVisitor): void {
        visitor.handleGameStateSnapshotUpdate(this);
    }
}
