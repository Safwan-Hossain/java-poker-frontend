import {
    BehaviorSubject, EMPTY, Observable, Subject, Subscription, timer
} from "rxjs";
import {
    catchError, map, tap
} from "rxjs/operators";
import { webSocket, WebSocketSubject } from "rxjs/webSocket";
import { GameUpdate } from "../updates/GameUpdate";
import { BASE_WS_URL } from "../constants/Constants";
import { GameUpdateParser } from "../parser/GameUpdateParser";

enum ConnectionStatus {
    DISCONNECTED = "DISCONNECTED",
    CONNECTING = "CONNECTING",
    CONNECTED = "CONNECTED",
    RECONNECTING = "RECONNECTING",
    FAILED = "FAILED",
}

const MAX_RETRIES = 10;
const RETRY_DELAY_MS = 2000;

export class UserClient {
    private socket$: WebSocketSubject<GameUpdate> | null = null;
    private inboundSubscription?: Subscription;
    private outboundSubscription?: Subscription;
    private reconnectSubscription?: Subscription;
    private userHasLeft = false;

    private outboundSubject = new Subject<GameUpdate>();
    private inboundSubject = new Subject<GameUpdate>();

    private reconnectAttempts = 0;
    private playerName: string = "";
    private lastUrl: string = "";

    private readonly connectionStatus$ = new BehaviorSubject<ConnectionStatus>(ConnectionStatus.DISCONNECTED);
    private readonly CLOSE_CODE_NOT_ACCEPTABLE = 406;


    public connectToNewGame(playerName: string): Observable<void> {
        this.playerName = playerName;
        return this.createConnectionObservable(this.buildNewGameUrl());
    }

    public connectToExistingGame(playerName: string, tableId: string): Observable<void> {
        this.playerName = playerName;
        return this.createConnectionObservable(this.buildExistingGameUrl(tableId));
    }

    public sendGameUpdate(update: GameUpdate): void {
        this.outboundSubject.next(update);
    }

    public receiveGameUpdates(): Observable<GameUpdate> {
        return this.inboundSubject.asObservable();
    }

    public getConnectionStatus(): Observable<ConnectionStatus> {
        return this.connectionStatus$.asObservable();
    }

    public quit(): void {
        this.userHasLeft = true;
        this.cancelReconnect();
        this.disconnect();
    }

    // --------------------------
    // WebSocket Connection Management
    // --------------------------

    private createConnectionObservable(url: string): Observable<void> {
        return new Observable<void>((observer) => {
            try {
                this.connect(url);
                observer.next();
                observer.complete();
            } catch (error) {
                observer.error(error);
            }
        });
    }

    private connect(url: string): void {
        this.disconnect();
        this.updateConnectionStatus(this.reconnectAttempts > 0 ? ConnectionStatus.RECONNECTING : ConnectionStatus.CONNECTING);

        console.info(`Connecting to WebSocket: ${url}`);
        this.lastUrl = url;

        this.socket$ = webSocket<GameUpdate>({
            url,
            openObserver: { next: () => this.onWebSocketConnected() },
            closeObserver: { next: (event) => this.onWebSocketDisconnected(event.code) },
        });

        this.setupSocketStreams();
    }

    private disconnect(): void {
        this.inboundSubscription?.unsubscribe();
        this.outboundSubscription?.unsubscribe();
        this.socket$?.complete();
        this.socket$ = null;
        this.reconnectAttempts = 0;
        this.updateConnectionStatus(ConnectionStatus.DISCONNECTED);
        console.info("WebSocket disconnected.");
    }

    private onWebSocketConnected(): void {
        this.updateConnectionStatus(ConnectionStatus.CONNECTED);
        this.reconnectAttempts = 0;
        console.info("WebSocket connection established");
    }

    private onWebSocketDisconnected(code: number): void {
        console.warn(`WebSocket connection closed. Code: ${code}`);
        this.handleDisconnection(code);
    }

    // --------------------------
    // Reconnection Logic
    // --------------------------

    private handleDisconnection(code: number): void {
        if (!this.shouldRetryConnection(code)) return;

        this.reconnectAttempts++;
        const delayMs = this.getExponentialBackoffDelay();

        this.cancelReconnect(); // Prevent multiple timers
        console.warn(`Reconnecting in ${delayMs / 1000} seconds...`);

        this.reconnectSubscription = timer(delayMs).subscribe(() => this.connect(this.lastUrl));
    }

    private shouldRetryConnection(code: number): boolean {
        if (code === this.CLOSE_CODE_NOT_ACCEPTABLE) {
            console.error("Session rejected by server. Stopping retries.");
            return false;
        }

        if (this.reconnectAttempts >= MAX_RETRIES) {
            console.error("Max retries reached. Stopping reconnection attempts.");
            this.updateConnectionStatus(ConnectionStatus.FAILED);
            return false;
        }

        if (this.userHasLeft) {
            console.warn("User has left, stopping reconnect attempts.");
            return false;
        }

        return true;
    }

    private getExponentialBackoffDelay(): number {
        return RETRY_DELAY_MS * Math.pow(2, this.reconnectAttempts - 1);
    }

    private cancelReconnect(): void {
        this.reconnectSubscription?.unsubscribe();
        this.reconnectSubscription = undefined;
    }


    // --------------------------
    // Socket Stream Handling
    // --------------------------

    private setupSocketStreams(): void {
        if (!this.socket$) return;

        this.inboundSubscription = this.socket$
            .pipe(
                map(this.parseIncomingMessage),
                tap((message) => this.onMessageReceived(message)),
                catchError((error) => this.handleStreamError(error))
            )
            .subscribe({
                error: (err) => console.error("Socket stream subscription error:", err),
                complete: () => console.log("Socket stream completed."),
            });

        this.outboundSubscription = this.outboundSubject.subscribe({
            next: (msg) => {
                console.info("Sending GameUpdate:", msg); // Log outbound update
                this.socket$?.next(msg);
            }
        });
    }

    private parseIncomingMessage(raw: unknown): GameUpdate {
        return GameUpdateParser.parse(raw);
    }

    private onMessageReceived(message: GameUpdate): void {
        this.inboundSubject.next(message);
    }

    private handleStreamError(error: unknown): Observable<GameUpdate> {
        console.error("Stream error (parsing/message issue):", error);
        return EMPTY; // Skip bad message but keep the stream alive
    }


    // --------------------------
    // misc
    // --------------------------

    private updateConnectionStatus(status: ConnectionStatus): void {
        this.connectionStatus$.next(status);
    }

    private buildExistingGameUrl(tableId: string): string {
        return `${BASE_WS_URL}/${tableId}?playerName=${encodeURIComponent(this.playerName)}`;
    }

    private buildNewGameUrl(): string {
        return `${BASE_WS_URL}?newGame=true&playerName=${encodeURIComponent(this.playerName)}`;
    }
}
