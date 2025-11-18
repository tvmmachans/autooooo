import type { Request, Response } from 'express';
export declare class SettingsController {
    getUserSettings(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    updateUserSettings(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    changePassword(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    setup2FA(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    verify2FA(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    disable2FA(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getWorkspaceSettings(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    updateWorkspaceSettings(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getApiKeys(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    createApiKey(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    revokeApiKey(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getIntegrations(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    connectIntegration(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    disconnectIntegration(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getAIServiceConfig(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    updateAIServiceConfig(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getWorkflowPreferences(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    updateWorkflowPreferences(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getSecurityLogs(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    private logAudit;
}
export declare const settingsController: SettingsController;
//# sourceMappingURL=settingsController.d.ts.map