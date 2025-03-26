import { RoundState } from '../../enumeration/RoundState';
import { Card } from '../../models/Card';
import { GameUpdate } from '../GameUpdate';
import { GameUpdateVisitor } from '../GameUpdateVisitor';
import {GameUpdateType} from "../../enumeration/GameUpdateType.ts";

export class RoundStateUpdate extends GameUpdate {
    readonly updateType = GameUpdateType.ROUND_STATE_UPDATE;
    readonly roundState: RoundState;
    readonly tableCards: ReadonlyArray<Card>;

    constructor(roundState: RoundState, tableCards: Card[]) {
        super();
        this.roundState = roundState;
        this.tableCards = [...tableCards]; // Ensure immutability
    }

    static fromJSON(raw: any): RoundStateUpdate {
        return new RoundStateUpdate(
            raw.roundState,
            raw.tableCards.map((c: any) => Card.fromJSON(c))
        );
    }

    dispatchTo(visitor: GameUpdateVisitor): void {
        visitor.handleRoundStateUpdate(this);
    }
}
