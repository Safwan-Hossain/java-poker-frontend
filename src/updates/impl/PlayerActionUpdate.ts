import { PlayerAction } from '../../enumeration/PlayerAction';
import { GameUpdate } from '../GameUpdate';
import { GameUpdateVisitor } from '../GameUpdateVisitor';
import {GameUpdateType} from "../../enumeration/GameUpdateType.ts";

export class PlayerActionUpdate extends GameUpdate {
    readonly updateType = GameUpdateType.PLAYER_ACTION_UPDATE;
    readonly playerId: string;
    readonly action: PlayerAction;
    readonly betAmount: number;

    constructor(playerId: string, action: PlayerAction, betAmount: number) {
        super();
        this.playerId = playerId;
        this.action = action;
        this.betAmount = betAmount;
    }

    static fromJSON(raw: any): PlayerActionUpdate {
        return new PlayerActionUpdate(
            raw.playerId,
            raw.action,
            raw.betAmount
        );
    }

    dispatchTo(visitor: GameUpdateVisitor): void {
        visitor.handlePlayerActionUpdate(this);
    }
}
