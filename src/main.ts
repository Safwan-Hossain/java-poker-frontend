import { UIManager } from "./view/UIManager";
import {GameSessionController} from "./controller/GameSessionController.ts";

document.addEventListener("DOMContentLoaded", () => {
    const uiManager = new UIManager();
    const gameSessionController = new GameSessionController(uiManager);
    gameSessionController.init();
});
