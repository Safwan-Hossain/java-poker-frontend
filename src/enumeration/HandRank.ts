export enum HandRank {
    HIGH_CARD = 1,
    ONE_PAIR,
    TWO_PAIR,
    THREE_OF_A_KIND,
    STRAIGHT,
    FLUSH,
    FULL_HOUSE,
    FOUR_OF_A_KIND,
    STRAIGHT_FLUSH,
    ROYAL_FLUSH
}

export namespace HandRank {
    const HAND_RANK_DESCRIPTIONS = new Map<HandRank, string>([
        [HandRank.HIGH_CARD, "High Card"],
        [HandRank.ONE_PAIR, "One Pair"],
        [HandRank.TWO_PAIR, "Two Pair"],
        [HandRank.THREE_OF_A_KIND, "Three of a Kind"],
        [HandRank.STRAIGHT, "Straight"],
        [HandRank.FLUSH, "Flush"],
        [HandRank.FULL_HOUSE, "Full House"],
        [HandRank.FOUR_OF_A_KIND, "Four of a Kind"],
        [HandRank.STRAIGHT_FLUSH, "Straight Flush"],
        [HandRank.ROYAL_FLUSH, "Royal Flush"]
    ]);

    export function compare(a: HandRank, b: HandRank): number {
        return a - b;
    }

    export function getDescription(rank: HandRank): string {
        return HAND_RANK_DESCRIPTIONS.get(rank) ?? "Unknown";
    }
}
