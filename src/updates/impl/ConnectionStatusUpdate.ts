import { GameUpdate } from "../GameUpdate";
import { GameUpdateVisitor } from "../GameUpdateVisitor";
import { ConnectionStatus } from "../../enumeration/ConnectionStatus";
import {GameUpdateType} from "../../enumeration/GameUpdateType.ts";


export class ConnectionStatusUpdate extends GameUpdate {
    readonly updateType = GameUpdateType.CONNECTION_STATUS_UPDATE;
    readonly connectionStatus: ConnectionStatus;
    readonly playerId: string;
    readonly playerName: string;


    constructor(connectionStatus: ConnectionStatus, playerId: string, playerName: string) {
        super();
        this.connectionStatus = connectionStatus;
        this.playerId = playerId;
        this.playerName = playerName;
    }

    static fromJSON(raw: any): ConnectionStatusUpdate {
        return new ConnectionStatusUpdate(raw.connectionStatus, raw.playerId, raw.playerName);
    }


    dispatchTo(visitor: GameUpdateVisitor): void {
        visitor.handleConnectionStatusUpdate(this);
    }
}
