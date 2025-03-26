export enum PlayerAction {
    HOST_SAYS_START = "HOST_SAYS_START",
    QUIT = "QUIT",
    FOLD = "FOLD",
    BET = "BET",
    RAISE = "RAISE",
    CALL = "CALL",
    CHECK = "CHECK",
    WAIT = "WAIT",
}

export namespace PlayerAction {
    export function isABet(action: PlayerAction): boolean {
        return action === PlayerAction.BET || action === PlayerAction.RAISE;
    }

    export function actionIsValid(action: string): boolean {
        return Object.values(PlayerAction).includes(action as PlayerAction);
    }

    export function getActionByString(action: string): PlayerAction | undefined {
        const normalizedAction = action.toUpperCase();
        const actions = Object.values(PlayerAction) as string[];

        const matchedAction = actions.find((a) => a.toUpperCase() === normalizedAction);

        return matchedAction as PlayerAction | undefined;
    }

}
