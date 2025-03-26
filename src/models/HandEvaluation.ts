import { HandRank } from "../enumeration/HandRank";
import { Card } from "../models/Card";

/**
 * Represents the evaluation of a hand in Texas Hold'em.
 * Implements Comparable to compare hand evaluations.
 */
export class HandEvaluation {
    readonly handRank: HandRank;
    private readonly cards: Card[];

    constructor(handRank: HandRank, cards: Card[]) {
        if (!handRank || !cards) {
            throw new Error("Invalid HandEvaluation, parameter(s) are null");
        }
        this.handRank = handRank;
        this.cards = [...cards].sort((a, b) => b.compareTo(a));
    }

    static fromJSON(raw: any): HandEvaluation {
        const handRank = HandRank[raw.handRank as keyof Omit<typeof HandRank, 'compare' | 'getDescription'>];

        if (handRank === undefined) {
            throw new Error(`Invalid HandRank value: ${raw.handRank}`);
        }

        return new HandEvaluation(
            handRank,
            raw.cards.map((c: any) => Card.fromJSON(c))
        );
    }


    /**
     * Returns a copy of the cards array to prevent mutation.
     */
    public getCards(): ReadonlyArray<Card> {
        return [...this.cards]; // Returns a new array instance
    }

    public compareTo(other: HandEvaluation): number {
        // Step 1: Compare hand ranks
        const rankComparison = this.handRank - other.handRank;
        if (rankComparison !== 0) {
            return rankComparison;
        }

        // Step 2: Compare individual cards in descending order
        return this.compareCards(this.cards, other.cards);
    }

    private compareCards(cards1: Card[], cards2: Card[]): number {
        for (let i = 0; i < cards1.length; i++) {
            const cardComparison = cards1[i].compareTo(cards2[i]);
            if (cardComparison !== 0) {
                return cardComparison;
            }
        }
        return 0; // If all cards are equal, return 0 (tie)
    }

}
