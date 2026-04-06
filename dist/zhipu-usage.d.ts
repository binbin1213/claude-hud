export interface ZhipuUsageData {
    tokenPercentage: number | null;
    tokenNextReset: Date | null;
    timePercentage: number | null;
    timeRemaining: number | null;
    timeUsage: number | null;
    timeTotal: number | null;
    timeNextReset: Date | null;
    level: string | null;
    apiUnavailable?: boolean;
    apiError?: string;
}
export declare function getZhipuUsage(): Promise<ZhipuUsageData>;
//# sourceMappingURL=zhipu-usage.d.ts.map