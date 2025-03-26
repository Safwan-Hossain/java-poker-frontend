import { PlayerAction } from '../../enumeration/PlayerAction';
import { GameUpdate } from '../GameUpdate';
import { GameUpdateVisitor } from '../GameUpdateVisitor';
import {GameUpdateType} from "../../enumeration/GameUpdateType.ts";

export class PlayerTurnUpdate extends GameUpdate {
    readonly updateType = GameUpdateType.PLAYER_TURN_UPDATE;
    readonly playerIdWithTurn: string;
    readonly validPlayerActions: Set<PlayerAction>;
    readonly minimumBetAmount: number;
    readonly maximumBetAmount: number;
    readonly minimumCallAmount: number;

    constructor(
        playerIdWithTurn: string,
        validPlayerActions: PlayerAction[],
        minimumBetAmount: number,
        maximumBetAmount: number,
        minimumCallAmount: number
    ) {
        super();
        this.playerIdWithTurn = playerIdWithTurn;
        this.validPlayerActions = new Set(validPlayerActions);
        this.minimumBetAmount = minimumBetAmount;
        this.maximumBetAmount = maximumBetAmount;
        this.minimumCallAmount = minimumCallAmount;
    }

    static fromJSON(raw: any): PlayerTurnUpdate {
        return new PlayerTurnUpdate(
            raw.playerIdWithTurn,
            raw.validPlayerActions,
            raw.minimumBetAmount,
            raw.maximumBetAmount,
            raw.minimumCallAmount
        );
    }

    dispatchTo(visitor: GameUpdateVisitor): void {
        console.log("Dispatching to playerTurnUpdate");
        visitor.handlePlayerTurnUpdate(this);
    }
}
