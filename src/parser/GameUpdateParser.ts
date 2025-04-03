import { GameUpdateType } from "../enumeration/GameUpdateType";
import { GameUpdate } from "../updates/GameUpdate";
import { ConnectionStatusUpdate } from "../updates/impl/ConnectionStatusUpdate";
import { GameStateSnapshotUpdate } from "../updates/impl/GameStateSnapshotUpdate";
import { PlayerActionUpdate } from "../updates/impl/PlayerActionUpdate";
import { PlayerSetupUpdate } from "../updates/impl/PlayerSetupUpdate";
import { PlayerTurnUpdate } from "../updates/impl/PlayerTurnUpdate";
import { RoundStateUpdate } from "../updates/impl/RoundStateUpdate";
import { ServerMessageUpdate } from "../updates/impl/ServerMessageUpdate";
import { ShowdownResultUpdate } from "../updates/impl/ShowdownResultUpdate";
import {GameOverUpdate} from "../updates/impl/GameOverUpdate.ts";

export class GameUpdateParser {

    /** Parses a raw object into a GameUpdate */
    public static parse(raw: unknown): GameUpdate {
        if (!this.isValidGameUpdate(raw)) {
            throw new Error("Invalid game update format received.");
        }

        switch (raw.updateType) {
            case GameUpdateType.CONNECTION_STATUS_UPDATE:
                return ConnectionStatusUpdate.fromJSON(raw);
            case GameUpdateType.GAME_STATE_SNAPSHOT_UPDATE:
                return GameStateSnapshotUpdate.fromJSON(raw);
            case GameUpdateType.PLAYER_ACTION_UPDATE:
                return PlayerActionUpdate.fromJSON(raw);
            case GameUpdateType.PLAYER_SETUP_UPDATE:
                return PlayerSetupUpdate.fromJSON(raw);
            case GameUpdateType.PLAYER_TURN_UPDATE:
                return PlayerTurnUpdate.fromJSON(raw);
            case GameUpdateType.ROUND_STATE_UPDATE:
                return RoundStateUpdate.fromJSON(raw);
            case GameUpdateType.SERVER_MESSAGE_UPDATE:
                return ServerMessageUpdate.fromJSON(raw);
            case GameUpdateType.SHOWDOWN_RESULT_UPDATE:
                return ShowdownResultUpdate.fromJSON(raw);
            case GameUpdateType.GAME_OVER_UPDATE:
                return GameOverUpdate.fromJSON(raw);
            default:
                throw new Error(`Unknown update type received: ${(raw as any).updateType}`);
        }

    }

    private static isValidGameUpdate(obj: unknown): obj is { updateType: GameUpdateType } {
        return (
            typeof obj === "object" &&
            obj !== null &&
            "updateType" in obj &&
            Object.values(GameUpdateType).includes((obj as any).updateType)
        );
    }
}
