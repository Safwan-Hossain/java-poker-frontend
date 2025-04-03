import { GameUpdate } from '../GameUpdate';
import { GameUpdateVisitor } from '../GameUpdateVisitor';
import {Player} from "../../models/Player.ts";
import {GameUpdateType} from "../../enumeration/GameUpdateType.ts";

export class PlayerSetupUpdate extends GameUpdate {
    readonly updateType = GameUpdateType.PLAYER_SETUP_UPDATE;
    readonly tableSessionId: string;
    readonly playerName: string;
    readonly playerId: string;
    readonly isHost: boolean;
    readonly existingPlayers: Player[];


    constructor(tableSessionId: string, playerName: string, playerId: string, isHost: boolean, existingPlayers: Player[]) {
        super();
        this.tableSessionId = tableSessionId;
        this.playerName = playerName;
        this.playerId = playerId;
        this.isHost = isHost;
        this.existingPlayers = existingPlayers;
    }

    static fromJSON(raw: any): PlayerSetupUpdate {
        return new PlayerSetupUpdate(
            raw.tableSessionId,
            raw.playerName,
            raw.playerId,
            raw.isHost,
            raw.existingPlayers.map((p: any) => Player.fromJSON(p)),
        );
    }

    dispatchTo(visitor: GameUpdateVisitor): void {
        visitor.handlePlayerSetupUpdate(this);
    }
}
