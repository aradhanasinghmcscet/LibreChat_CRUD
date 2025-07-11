/// <reference types="node" />
import { EventEmitter } from 'events';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import type { MCPOAuthTokens } from './oauth/types';
import type * as t from './types';
export declare class MCPConnection extends EventEmitter {
    private readonly options;
    private static instance;
    client: Client;
    private transport;
    private connectionState;
    private connectPromise;
    private lastError;
    private lastConfigUpdate;
    private readonly CONFIG_TTL;
    private readonly MAX_RECONNECT_ATTEMPTS;
    readonly serverName: string;
    private shouldStopReconnecting;
    private isReconnecting;
    private isInitializing;
    private reconnectAttempts;
    private readonly userId?;
    private lastPingTime;
    private oauthTokens?;
    private oauthRequired;
    iconPath?: string;
    timeout?: number;
    url?: string;
    constructor(serverName: string, options: t.MCPOptions, userId?: string, oauthTokens?: MCPOAuthTokens | null);
    /** Helper to generate consistent log prefixes */
    private getLogPrefix;
    static getInstance(serverName: string, options: t.MCPOptions, userId?: string): MCPConnection;
    static getExistingInstance(): MCPConnection | null;
    static destroyInstance(): Promise<void>;
    private emitError;
    private constructTransport;
    private setupEventListeners;
    private handleReconnection;
    private subscribeToResources;
    private invalidateCache;
    connectClient(): Promise<void>;
    private setupTransportDebugHandlers;
    connect(): Promise<void>;
    private setupTransportErrorHandlers;
    disconnect(): Promise<void>;
    fetchResources(): Promise<t.MCPResource[]>;
    fetchTools(): Promise<import("zod").objectOutputType<{
        name: import("zod").ZodString;
        title: import("zod").ZodOptional<import("zod").ZodString>;
    } & {
        description: import("zod").ZodOptional<import("zod").ZodString>;
        inputSchema: import("zod").ZodObject<{
            type: import("zod").ZodLiteral<"object">;
            properties: import("zod").ZodOptional<import("zod").ZodObject<{}, "passthrough", import("zod").ZodTypeAny, import("zod").objectOutputType<{}, import("zod").ZodTypeAny, "passthrough">, import("zod").objectInputType<{}, import("zod").ZodTypeAny, "passthrough">>>;
            required: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>;
        }, "passthrough", import("zod").ZodTypeAny, import("zod").objectOutputType<{
            type: import("zod").ZodLiteral<"object">;
            properties: import("zod").ZodOptional<import("zod").ZodObject<{}, "passthrough", import("zod").ZodTypeAny, import("zod").objectOutputType<{}, import("zod").ZodTypeAny, "passthrough">, import("zod").objectInputType<{}, import("zod").ZodTypeAny, "passthrough">>>;
            required: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>;
        }, import("zod").ZodTypeAny, "passthrough">, import("zod").objectInputType<{
            type: import("zod").ZodLiteral<"object">;
            properties: import("zod").ZodOptional<import("zod").ZodObject<{}, "passthrough", import("zod").ZodTypeAny, import("zod").objectOutputType<{}, import("zod").ZodTypeAny, "passthrough">, import("zod").objectInputType<{}, import("zod").ZodTypeAny, "passthrough">>>;
            required: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>;
        }, import("zod").ZodTypeAny, "passthrough">>;
        outputSchema: import("zod").ZodOptional<import("zod").ZodObject<{
            type: import("zod").ZodLiteral<"object">;
            properties: import("zod").ZodOptional<import("zod").ZodObject<{}, "passthrough", import("zod").ZodTypeAny, import("zod").objectOutputType<{}, import("zod").ZodTypeAny, "passthrough">, import("zod").objectInputType<{}, import("zod").ZodTypeAny, "passthrough">>>;
            required: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>;
        }, "passthrough", import("zod").ZodTypeAny, import("zod").objectOutputType<{
            type: import("zod").ZodLiteral<"object">;
            properties: import("zod").ZodOptional<import("zod").ZodObject<{}, "passthrough", import("zod").ZodTypeAny, import("zod").objectOutputType<{}, import("zod").ZodTypeAny, "passthrough">, import("zod").objectInputType<{}, import("zod").ZodTypeAny, "passthrough">>>;
            required: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>;
        }, import("zod").ZodTypeAny, "passthrough">, import("zod").objectInputType<{
            type: import("zod").ZodLiteral<"object">;
            properties: import("zod").ZodOptional<import("zod").ZodObject<{}, "passthrough", import("zod").ZodTypeAny, import("zod").objectOutputType<{}, import("zod").ZodTypeAny, "passthrough">, import("zod").objectInputType<{}, import("zod").ZodTypeAny, "passthrough">>>;
            required: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>;
        }, import("zod").ZodTypeAny, "passthrough">>>;
        annotations: import("zod").ZodOptional<import("zod").ZodObject<{
            title: import("zod").ZodOptional<import("zod").ZodString>;
            readOnlyHint: import("zod").ZodOptional<import("zod").ZodBoolean>;
            destructiveHint: import("zod").ZodOptional<import("zod").ZodBoolean>;
            idempotentHint: import("zod").ZodOptional<import("zod").ZodBoolean>;
            openWorldHint: import("zod").ZodOptional<import("zod").ZodBoolean>;
        }, "passthrough", import("zod").ZodTypeAny, import("zod").objectOutputType<{
            title: import("zod").ZodOptional<import("zod").ZodString>;
            readOnlyHint: import("zod").ZodOptional<import("zod").ZodBoolean>;
            destructiveHint: import("zod").ZodOptional<import("zod").ZodBoolean>;
            idempotentHint: import("zod").ZodOptional<import("zod").ZodBoolean>;
            openWorldHint: import("zod").ZodOptional<import("zod").ZodBoolean>;
        }, import("zod").ZodTypeAny, "passthrough">, import("zod").objectInputType<{
            title: import("zod").ZodOptional<import("zod").ZodString>;
            readOnlyHint: import("zod").ZodOptional<import("zod").ZodBoolean>;
            destructiveHint: import("zod").ZodOptional<import("zod").ZodBoolean>;
            idempotentHint: import("zod").ZodOptional<import("zod").ZodBoolean>;
            openWorldHint: import("zod").ZodOptional<import("zod").ZodBoolean>;
        }, import("zod").ZodTypeAny, "passthrough">>>;
        _meta: import("zod").ZodOptional<import("zod").ZodObject<{}, "passthrough", import("zod").ZodTypeAny, import("zod").objectOutputType<{}, import("zod").ZodTypeAny, "passthrough">, import("zod").objectInputType<{}, import("zod").ZodTypeAny, "passthrough">>>;
    }, import("zod").ZodTypeAny, "passthrough">[]>;
    fetchPrompts(): Promise<t.MCPPrompt[]>;
    isConnected(): Promise<boolean>;
    setOAuthTokens(tokens: MCPOAuthTokens): void;
    private isOAuthError;
}
