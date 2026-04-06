import type { StdinData } from './types.js';
export declare function readStdin(): Promise<StdinData | null>;
export declare function getTotalTokens(stdin: StdinData): number;
export declare function getContextPercent(stdin: StdinData): number;
export declare function getBufferedPercent(stdin: StdinData): number;
export declare function isGLMModelId(modelId?: string): boolean;
export declare function normalizeGLMModelLabel(modelId: string): string | null;
export declare function getModelName(stdin: StdinData): string;
export declare function isBedrockModelId(modelId?: string): boolean;
export declare function getProviderLabel(stdin: StdinData): string | null;
//# sourceMappingURL=stdin.d.ts.map