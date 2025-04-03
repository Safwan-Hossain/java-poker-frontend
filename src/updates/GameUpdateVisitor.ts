import { GameStateSnapshotUpdate } from "./impl/GameStateSnapshotUpdate";
import { ConnectionStatusUpdate } from "./impl/ConnectionStatusUpdate";
import { PlayerActionUpdate } from "./impl/PlayerActionUpdate";
import { PlayerTurnUpdate } from "./impl/PlayerTurnUpdate";
import { RoundStateUpdate } from "./impl/RoundStateUpdate";
import { ServerMessageUpdate } from "./impl/ServerMessageUpdate";
import { PlayerSetupUpdate } from "./impl/PlayerSetupUpdate";
import { ShowdownResultUpdate } from "./impl/ShowdownResultUpdate";
import {GameOverUpdate} from "./impl/GameOverUpdate.ts";

/**
 * Interface for handling game state updates using the Visitor Pattern.
 */
export interface GameUpdateVisitor {
    handleGameStateSnapshotUpdate(update: GameStateSnapshotUpdate): void;
    handlePlayerActionUpdate(update: PlayerActionUpdate): void;
    handlePlayerTurnUpdate(update: PlayerTurnUpdate): void;
    handleRoundStateUpdate(update: RoundStateUpdate): void;
    handleServerMessageUpdate(update: ServerMessageUpdate): void;
    handleConnectionStatusUpdate(update: ConnectionStatusUpdate): void;
    handlePlayerSetupUpdate(update: PlayerSetupUpdate): void;
    handleShowdownResultUpdate(update: ShowdownResultUpdate): void;
    handleGameOverUpdate(update: GameOverUpdate): void;
}
