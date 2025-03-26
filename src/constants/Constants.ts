// String constants
export const GAME_UPDATE_HEADER_NAME = "Game_Update_Header";
export const PLAYER_ACTION_UPDATE_HEADER_NAME = "Player_Update_Header";
export const NEW_GAME_PARAM = "newGame";
export const FALSE_STRING_VALUE = "false";
export const PLAYER_NAME_PARAM = "playerName";
export const DEFAULT_PLAYER_NAME_PARAM = "Guest";

// Numbers
export const UPDATE_BUFFER_SIZE = 35; // Number of updates that can be queued to a player
export const DELAY_BETWEEN_SERVER_EVENTS = 1000; // in ms
export const INVALID_BET_AMOUNT = -1;

// Other
// export const BASE_WS_URL = "wss://api.hossainsafwan.com/ws/game";
export const BASE_WS_URL = import.meta.env.VITE_BASE_WS_URL;
export const START_COMMAND = "START";
