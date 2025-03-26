import { Typewriter } from "./Typewriter.ts"; // adjust path if needed

export class NarrationManager {
    private readonly MAX_HISTORY = 50;
    private readonly DELAY_MS = 100;

    private queue: string[] = [];
    private isNarrating = false;
    private resolvers: Array<() => void> = [];
    private listElement: HTMLUListElement;

    private typewriter?: Typewriter;

    constructor(listId: string, useTypewriter = true) {
        const list = document.getElementById(listId);
        if (!(list instanceof HTMLUListElement)) {
            throw new Error(`Element with ID '${listId}' not found or not a <ul>`);
        }

        this.listElement = list;

        if (useTypewriter) {
            this.typewriter = new Typewriter(); // Default speed is 15ms
        }
    }

    public async queueMessage(message: string): Promise<void> {
        return new Promise(resolve => {
            this.queue.push(message);
            this.resolvers.push(resolve);
            void this.processQueue();
        });
    }

    private async processQueue(): Promise<void> {
        if (this.isNarrating || this.queue.length === 0) return;

        this.isNarrating = true;

        while (this.queue.length > 0) {
            const message = this.queue.shift();
            if (!message) continue;

            const prevLatest = this.listElement.querySelector("li.latest");
            if (prevLatest) prevLatest.classList.remove("latest");

            const li = document.createElement("li");
            li.classList.add("latest");
            this.listElement.appendChild(li);

            if (this.typewriter) {
                await this.typewriter.typeTo(li, message);
            } else {
                li.textContent = message;
            }

            await new Promise(requestAnimationFrame);

            while (this.listElement.children.length > this.MAX_HISTORY) {
                this.listElement.removeChild(this.listElement.firstChild!);
            }

            await new Promise(res => setTimeout(res, this.DELAY_MS));
        }

        this.isNarrating = false;

        while (this.resolvers.length > 0) {
            const resolve = this.resolvers.shift();
            if (resolve) resolve();
        }
    }

    public waitUntilDone(): Promise<void> {
        if (!this.isNarrating) return Promise.resolve();

        return new Promise(resolve => {
            this.resolvers.push(resolve);
        });
    }

    public clear(): void {
        this.listElement.innerHTML = "";
        this.queue = [];
        this.resolvers = [];
        this.isNarrating = false;
    }
}
