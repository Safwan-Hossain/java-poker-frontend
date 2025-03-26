import {Suit, suitToSymbol} from "../enumeration/Suit";
import {Rank, rankToString} from "../enumeration/Rank";

export class Card {
    readonly suit: Suit;
    readonly rank: Rank;

    constructor(suit: Suit, rank: Rank) {
        if (!suit || !rank) {
            throw new Error("Suit and Rank cannot be null or undefined.");
        }
        this.suit = suit;
        this.rank = rank;
    }

    toString(): string {
        return `${rankToString(this.rank)}${suitToSymbol(this.suit)}`;
    }

    compareTo(other: Card): number {
        return this.rank - other.rank;
    }

    equals(other: unknown): boolean {
        return other instanceof Card && this.suit === other.suit && this.rank === other.rank;
    }


    static fromJSON(raw: any): Card {
        return new Card(
            Suit[raw.suit as keyof typeof Suit],
            Rank[raw.rank as keyof typeof Rank]
        );
    }
}
