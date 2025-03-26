import { GameUpdate } from '../GameUpdate';
import { GameUpdateVisitor } from '../GameUpdateVisitor';
import {GameUpdateType} from "../../enumeration/GameUpdateType.ts";

export class ServerMessageUpdate extends GameUpdate {
    readonly updateType = GameUpdateType.SERVER_MESSAGE_UPDATE;
    readonly serverMessage: string;

    constructor(serverMessage: string) {
        super();
        this.serverMessage = serverMessage;
    }

    static fromJSON(raw: any): ServerMessageUpdate {
        return new ServerMessageUpdate(raw.serverMessage);
    }

    dispatchTo(visitor: GameUpdateVisitor): void {
        visitor.handleServerMessageUpdate(this);
    }
}
