import { GameUpdate } from '../GameUpdate';
import { GameUpdateVisitor } from '../GameUpdateVisitor';
import {GameUpdateType} from "../../enumeration/GameUpdateType.ts";
import {Player} from "../../models/Player.ts";

export class GameOverUpdate extends GameUpdate {
    readonly updateType = GameUpdateType.GAME_OVER_UPDATE;
    readonly winner: Player;

    constructor(winner: Player) {
        super();
        this.winner = winner;
    }

    static fromJSON(raw: any): GameOverUpdate {
        const winner = Player.fromJSON(raw.winner);
        return new GameOverUpdate(winner);
    }

    dispatchTo(visitor: GameUpdateVisitor): void {
        visitor.handleGameOverUpdate(this);
    }
}
