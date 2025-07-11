import type { AssistantsEndpoint } from './schemas';
import * as q from './types/queries';
export declare const health: () => string;
export declare const user: () => string;
export declare const balance: () => string;
export declare const userPlugins: () => string;
export declare const deleteUser: () => string;
export declare const messages: (params: q.MessagesListParams) => string;
export declare const shareMessages: (shareId: string) => string;
export declare const getSharedLink: (conversationId: string) => string;
export declare const getSharedLinks: (pageSize: number, isPublic: boolean, sortBy: 'title' | 'createdAt', sortDirection: 'asc' | 'desc', search?: string, cursor?: string) => string;
export declare const createSharedLink: (conversationId: string) => string;
export declare const updateSharedLink: (shareId: string) => string;
export declare const keys: () => string;
export declare const userKeyQuery: (name: string) => string;
export declare const revokeUserKey: (name: string) => string;
export declare const revokeAllUserKeys: () => string;
export declare const conversationsRoot = "/api/convos";
export declare const conversations: (params: q.ConversationListParams) => string;
export declare const conversationById: (id: string) => string;
export declare const genTitle: () => string;
export declare const updateConversation: () => string;
export declare const deleteConversation: () => string;
export declare const deleteAllConversation: () => string;
export declare const importConversation: () => string;
export declare const forkConversation: () => string;
export declare const duplicateConversation: () => string;
export declare const search: (q: string, cursor?: string | null) => string;
export declare const searchEnabled: () => string;
export declare const presets: () => string;
export declare const deletePreset: () => string;
export declare const aiEndpoints: () => string;
export declare const endpointsConfigOverride: () => string;
export declare const models: () => string;
export declare const tokenizer: () => string;
export declare const login: () => string;
export declare const logout: () => string;
export declare const register: () => string;
export declare const loginFacebook: () => string;
export declare const loginGoogle: () => string;
export declare const refreshToken: (retry?: boolean) => string;
export declare const requestPasswordReset: () => string;
export declare const resetPassword: () => string;
export declare const verifyEmail: () => string;
export declare const resendVerificationEmail: () => string;
export declare const plugins: () => string;
export declare const config: () => string;
export declare const prompts: () => string;
export declare const assistants: ({ path, options, version, endpoint, isAvatar, }: {
    path?: string | undefined;
    options?: object | undefined;
    endpoint?: AssistantsEndpoint | undefined;
    version: number | string;
    isAvatar?: boolean | undefined;
}) => string;
export declare const agents: ({ path, options }: {
    path?: string | undefined;
    options?: object | undefined;
}) => string;
export declare const revertAgentVersion: (agent_id: string) => string;
export declare const files: () => string;
export declare const images: () => string;
export declare const avatar: () => string;
export declare const speech: () => string;
export declare const speechToText: () => string;
export declare const textToSpeech: () => string;
export declare const textToSpeechManual: () => string;
export declare const textToSpeechVoices: () => string;
export declare const getCustomConfigSpeech: () => string;
export declare const getPromptGroup: (_id: string) => string;
export declare const getPromptGroupsWithFilters: (filter: object) => string;
export declare const getPromptsWithFilters: (filter: object) => string;
export declare const getPrompt: (_id: string) => string;
export declare const getRandomPrompts: (limit: number, skip: number) => string;
export declare const postPrompt: () => string;
export declare const updatePromptGroup: (_id: string) => string;
export declare const updatePromptLabels: (_id: string) => string;
export declare const updatePromptTag: (_id: string) => string;
export declare const deletePromptGroup: (_id: string) => string;
export declare const deletePrompt: ({ _id, groupId }: {
    _id: string;
    groupId: string;
}) => string;
export declare const getCategories: () => string;
export declare const getAllPromptGroups: () => string;
export declare const roles: () => string;
export declare const getRole: (roleName: string) => string;
export declare const updatePromptPermissions: (roleName: string) => string;
export declare const updateMemoryPermissions: (roleName: string) => string;
export declare const updateAgentPermissions: (roleName: string) => string;
export declare const conversationTags: (tag?: string) => string;
export declare const conversationTagsList: (pageNumber: string, sort?: string, order?: string) => string;
export declare const addTagToConversation: (conversationId: string) => string;
export declare const userTerms: () => string;
export declare const acceptUserTerms: () => string;
export declare const banner: () => string;
export declare const feedback: (conversationId: string, messageId: string) => string;
export declare const enableTwoFactor: () => string;
export declare const verifyTwoFactor: () => string;
export declare const confirmTwoFactor: () => string;
export declare const disableTwoFactor: () => string;
export declare const regenerateBackupCodes: () => string;
export declare const verifyTwoFactorTemp: () => string;
export declare const memories: () => string;
export declare const memory: (key: string) => string;
export declare const memoryPreferences: () => string;
