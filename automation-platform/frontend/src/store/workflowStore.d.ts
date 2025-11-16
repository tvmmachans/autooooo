import { Workflow, Execution } from '../types/database.js';
interface WorkflowState {
    workflows: Workflow[];
    currentWorkflow: Workflow | null;
    loading: boolean;
    error: string | null;
    executions: Execution[];
    currentExecution: Execution | null;
    executionLoading: boolean;
    subscriptions: Map<string, () => void>;
    setWorkflows: (workflows: Workflow[]) => void;
    setCurrentWorkflow: (workflow: Workflow | null) => void;
    addWorkflow: (workflow: Workflow) => void;
    updateWorkflow: (id: number, updates: Partial<Workflow>) => void;
    deleteWorkflow: (id: number) => void;
    setExecutions: (executions: Execution[]) => void;
    setCurrentExecution: (execution: Execution | null) => void;
    addExecution: (execution: Execution) => void;
    updateExecution: (id: number, updates: Partial<Execution>) => void;
    optimisticUpdateWorkflow: (id: number, updates: Partial<Workflow>) => () => void;
    optimisticUpdateExecution: (id: number, updates: Partial<Execution>) => () => void;
    subscribeToWorkflow: (id: number) => void;
    subscribeToExecution: (id: number) => void;
    unsubscribeFromWorkflow: (id: number) => void;
    unsubscribeFromExecution: (id: number) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    setExecutionLoading: (loading: boolean) => void;
}
export declare const useWorkflowStore: import("zustand").UseBoundStore<Omit<import("zustand").StoreApi<WorkflowState>, "subscribe"> & {
    subscribe: {
        (listener: (selectedState: WorkflowState, previousSelectedState: WorkflowState) => void): () => void;
        <U>(selector: (state: WorkflowState) => U, listener: (selectedState: U, previousSelectedState: U) => void, options?: {
            equalityFn?: (a: U, b: U) => boolean;
            fireImmediately?: boolean;
        } | undefined): () => void;
    };
}>;
export declare const useWorkflows: () => Workflow[];
export declare const useCurrentWorkflow: () => Workflow | null;
export declare const useWorkflowLoading: () => boolean;
export declare const useWorkflowError: () => string | null;
export declare const useExecutions: () => Execution[];
export declare const useCurrentExecution: () => Execution | null;
export declare const useExecutionLoading: () => boolean;
export declare const useWorkflowActions: () => {
    setWorkflows: (workflows: Workflow[]) => void;
    setCurrentWorkflow: (workflow: Workflow | null) => void;
    addWorkflow: (workflow: Workflow) => void;
    updateWorkflow: (id: number, updates: Partial<Workflow>) => void;
    deleteWorkflow: (id: number) => void;
    optimisticUpdateWorkflow: (id: number, updates: Partial<Workflow>) => () => void;
    subscribeToWorkflow: (id: number) => void;
    unsubscribeFromWorkflow: (id: number) => void;
};
export declare const useExecutionActions: () => {
    setExecutions: (executions: Execution[]) => void;
    setCurrentExecution: (execution: Execution | null) => void;
    addExecution: (execution: Execution) => void;
    updateExecution: (id: number, updates: Partial<Execution>) => void;
    optimisticUpdateExecution: (id: number, updates: Partial<Execution>) => () => void;
    subscribeToExecution: (id: number) => void;
    unsubscribeFromExecution: (id: number) => void;
};
export {};
//# sourceMappingURL=workflowStore.d.ts.map