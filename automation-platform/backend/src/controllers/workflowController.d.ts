import type { Request, Response } from 'express';
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: number;
                email: string;
                role: string;
                name: string;
            };
        }
    }
}
export declare class WorkflowController {
    getWorkflows(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getWorkflowById(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    createWorkflow(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    updateWorkflow(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    deleteWorkflow(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getWorkflowExecutions(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    searchWorkflowsByNodeProperties(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    cloneWorkflow(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
export declare const workflowController: WorkflowController;
//# sourceMappingURL=workflowController.d.ts.map