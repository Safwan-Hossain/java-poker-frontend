export class Typewriter {
    constructor(
        private minSpeed = 15,
        private maxSpeed = 40
    ) {}

    public async typeTo(element: HTMLElement, text: string): Promise<void> {
        let output = "";
        element.classList.add("typing");

        const container = element.closest(".info-box") as HTMLElement | null;
        if (!container) return;

        // Flag to track if we should auto-scroll
        let autoScroll = true;

        // Detect user scroll activity
        const handleScroll = () => {
            const atBottom =
                Math.abs(container.scrollTop + container.clientHeight - container.scrollHeight) < 5;
            autoScroll = atBottom;
        };

        container.addEventListener("scroll", handleScroll);

        // Initial pause before typing starts
        await this.sleep(this.randomBetween(150, 300));

        for (const char of text) {
            output += char;
            element.textContent = output;

            if (autoScroll) {
                container.scrollTop = container.scrollHeight;
            }

            await this.delayForChar(char);
        }

        element.classList.remove("typing");
        container.removeEventListener("scroll", handleScroll);
    }

    private sleep(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    private delayForChar(char: string): Promise<void> {
        let delay = this.randomDelay();

        if (".!?".includes(char)) delay += 250;
        else if (",;".includes(char)) delay += 120;
        else if (char === " ") delay += 15;

        return this.sleep(delay);
    }

    private randomDelay(): number {
        return this.randomBetween(this.minSpeed, this.maxSpeed);
    }

    private randomBetween(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}
