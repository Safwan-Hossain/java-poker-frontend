import { Card } from './Card';
import {PokerRole} from "../enumeration/PokerRole.ts";

export class Player {
    private _name: string;
    private _playerId: string;
    private _chips = 0;
    private _hand: Card[] = [];
    private _hasTurn = false;
    private _isFolded = false;
    private _isHost = false;
    private _role?: PokerRole;

    constructor(name: string, playerId: string) {
        this._name = name;
        this._playerId = playerId;
    }

    clone(): Player {
        const copy = new Player(this._name, this._playerId);
        copy._chips = this._chips;
        copy._hand = [...this._hand];
        copy._hasTurn = this._hasTurn;
        copy._isFolded = this._isFolded;
        copy._isHost = this._isHost;
        copy._role = this._role;
        return copy;
    }
    static fromJSON(raw: any): Player {

        const player = new Player(raw.name, raw.playerId);
        player._chips = raw.chips ?? 0;
        player._hand = raw.hand ? raw.hand.map((c: any) => Card.fromJSON(c)) : [];
        player._hasTurn = raw.hasTurn ?? false;
        player._isFolded = raw.isFolded ?? false;
        player._isHost = raw.isHost ?? false;
        player._role = raw.role ? PokerRole[raw.role as keyof typeof PokerRole] : undefined;
        return player;
    }

    get name(): string {
        return this._name;
    }

    get playerId(): string {
        return this._playerId;
    }

    get chips(): number {
        return this._chips;
    }

    set chips(value: number) {
        if (value < 0) throw new Error("Chips cannot be negative");
        this._chips = value;
    }

    get hand(): ReadonlyArray<Card> {
        return this._hand;
    }

    set hand(cards: Card[]) {
        this._hand = [...cards];
    }

    get hasTurn(): boolean {
        return this._hasTurn;
    }

    set hasTurn(value: boolean) {
        this._hasTurn = value;
    }

    get isFolded(): boolean {
        return this._isFolded;
    }

    set isFolded(value: boolean) {
        this._isFolded = value;
    }

    get isHost(): boolean {
        return this._isHost;
    }

    set isHost(value: boolean) {
        this._isHost = value;
    }

    get role(): PokerRole | undefined {
        return this._role;
    }

    set role(value: PokerRole | undefined) {
        this._role = value;
    }

    takeChips(amount: number): void {
        if (amount > this._chips) throw new Error("Not enough chips");
        this._chips -= amount;
    }

    awardChips(amount: number): void {
        if (amount < 0) throw new Error("Amount must be positive");
        this._chips += amount;
    }

    resetHand(): void {
        this._hand = [];
    }

    addToHand(cardOrCards: Card | Card[]): void {
        if (Array.isArray(cardOrCards)) {
            this._hand.push(...cardOrCards);
        } else {
            this._hand.push(cardOrCards);
        }
    }

    isBankrupt(): boolean {
        return this._chips <= 0;
    }

    equals(other: Player): boolean {
        return this._playerId === other._playerId;
    }

    toString(): string {
        return this._name;
    }
}
