export declare enum CONSTANTS {
    mcp_delimiter = "_mcp_",
    /** System user ID for app-level OAuth tokens (all zeros ObjectId) */
    SYSTEM_USER_ID = "000000000000000000000000"
}
export declare function isSystemUserId(userId?: string): boolean;
