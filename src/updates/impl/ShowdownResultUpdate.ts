import { RoundState } from '../../enumeration/RoundState';
import { Card } from '../../models/Card';
import { HandEvaluation } from '../../models/HandEvaluation';
import { Player } from '../../models/Player';
import { GameUpdate } from '../GameUpdate';
import { GameUpdateVisitor } from '../GameUpdateVisitor';
import {GameUpdateType} from "../../enumeration/GameUpdateType.ts";

export class ShowdownResultUpdate extends GameUpdate {
    readonly updateType = GameUpdateType.SHOWDOWN_RESULT_UPDATE;
    readonly roundState: RoundState = RoundState.SHOWDOWN;
    readonly players: ReadonlyArray<Player>;
    readonly winnersForThisRound: ReadonlyArray<Player>;
    readonly bankruptPlayers: ReadonlyArray<Player>;
    readonly playerHandEvaluations: ReadonlyMap<String, HandEvaluation>;
    readonly tableCards: ReadonlyArray<Card>;
    readonly totalPot: number;
    readonly sharePerWinner: number;

    constructor(
        players: Player[],
        winnersForThisRound: Player[],
        bankruptPlayers: Player[],
        playerHandEvaluations: Map<String, HandEvaluation>,
        tableCards: Card[],
        totalPot: number,
        sharePerWinner: number
    ) {
        super();
        this.players = [...players];
        this.winnersForThisRound = [...winnersForThisRound];
        this.bankruptPlayers = [...bankruptPlayers];
        this.playerHandEvaluations = new Map(playerHandEvaluations);
        this.tableCards = [...tableCards];
        this.totalPot = totalPot;
        this.sharePerWinner = sharePerWinner;
    }

    static fromJSON(raw: any): ShowdownResultUpdate {
        return new ShowdownResultUpdate(
            raw.players.map((p: any) => Player.fromJSON(p)),
            raw.winnersForThisRound.map((p: any) => Player.fromJSON(p)),
            raw.bankruptPlayers.map((p: any) => Player.fromJSON(p)),
            new Map(
                Object.entries(raw.playerHandEvaluations).map(([key, value]) => [
                    key,
                    HandEvaluation.fromJSON(value)
                ])
            ),
            raw.tableCards.map((c: any) => Card.fromJSON(c)),
            raw.totalPot,
            raw.sharePerWinner
        );
    }

    dispatchTo(visitor: GameUpdateVisitor): void {
        visitor.handleShowdownResultUpdate(this);
    }
}
