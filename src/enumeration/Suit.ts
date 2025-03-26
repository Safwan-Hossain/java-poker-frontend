export enum Suit {
    CLUBS = "CLUBS",
    DIAMONDS = "DIAMONDS",
    HEARTS = "HEARTS",
    SPADES = "SPADES"
}

export function suitToSymbol(suit: Suit): string {
    switch (suit) {
        case Suit.HEARTS: return '♥';
        case Suit.DIAMONDS: return '♦';
        case Suit.CLUBS: return '♣';
        case Suit.SPADES: return '♠';
        default: return '?';
    }
}
