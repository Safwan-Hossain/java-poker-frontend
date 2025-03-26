import { GameUpdateVisitor } from "./GameUpdateVisitor";

export abstract class GameUpdate {
    readonly updateId: string;
    readonly creationTime: Date;
    broadcastTime?: Date;
    receivedTime?: Date;

    protected constructor() {
        this.updateId = crypto.randomUUID();
        this.creationTime = new Date();
    }

    public abstract dispatchTo(visitor: GameUpdateVisitor): void;

    private calculateDuration(start?: Date, end?: Date): number | null {
        return start && end ? end.getTime() - start.getTime() : null;
    }

    getCreationToBroadcastDelay(): number | null {
        return this.calculateDuration(this.creationTime, this.broadcastTime);
    }

    getBroadcastToReceivedDelay(): number | null {
        return this.calculateDuration(this.broadcastTime, this.receivedTime);
    }

    getTimingsInfo(singleLine: boolean = false): string {
        const separator = singleLine ? " | " : "\n";
        return [
            `Update ID: ${this.updateId}`,
            `Creation Time: ${this.creationTime.toISOString()}`,
            `Broadcast Time: ${this.formatTime(this.broadcastTime, "Not Broadcasted Yet")}`,
            `Received Time: ${this.formatTime(this.receivedTime, "Not Received Yet")}`
        ].join(separator);
    }

    getDelaysInfo(singleLine: boolean = false): string {
        const separator = singleLine ? " | " : "\n";
        return [
            `Creation to Broadcast Delay: ${this.getDelayString(this.getCreationToBroadcastDelay())}`,
            `Broadcast to Received Delay: ${this.getDelayString(this.getBroadcastToReceivedDelay())}`
        ].join(separator);
    }

    getTimingsAndDelaysInfo(singleLine: boolean = false): string {
        return this.getTimingsInfo(singleLine) + (singleLine ? " | " : "\n") + this.getDelaysInfo(singleLine);
    }

    private formatTime(time?: Date, defaultValue: string = "N/A"): string {
        return time ? time.toISOString() : defaultValue;
    }

    private getDelayString(delay: number | null): string {
        return delay !== null ? `${delay} ms` : "N/A";
    }
}
