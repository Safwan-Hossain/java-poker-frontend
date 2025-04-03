import { PlayerAction } from '../../enumeration/PlayerAction';
import { GameUpdate } from '../GameUpdate';
import { GameUpdateVisitor } from '../GameUpdateVisitor';
import { GameUpdateType } from '../../enumeration/GameUpdateType.ts';

export class PlayerActionUpdate extends GameUpdate {
    readonly updateType = GameUpdateType.PLAYER_ACTION_UPDATE;
    readonly playerId: string;
    readonly action: PlayerAction;
    readonly betAmount: number;
    readonly updatedPlayerChips: number;
    readonly updatedTotalPot: number;

    constructor(
        playerId: string,
        action: PlayerAction,
        betAmount: number,
        updatedPlayerChips: number,
        updatedTotalPot: number
    ) {
        super();
        this.playerId = playerId;
        this.action = action;
        this.betAmount = betAmount;
        this.updatedPlayerChips = updatedPlayerChips;
        this.updatedTotalPot = updatedTotalPot;
    }

    static fromJSON(raw: any): PlayerActionUpdate {
        return new PlayerActionUpdate(
            raw.playerId,
            raw.action,
            raw.betAmount,
            raw.updatedPlayerChips,
            raw.updatedTotalPot
        );
    }

    dispatchTo(visitor: GameUpdateVisitor): void {
        visitor.handlePlayerActionUpdate(this);
    }
}
