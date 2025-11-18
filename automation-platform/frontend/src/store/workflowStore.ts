import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { Workflow, Execution } from '../types/database.js';

// Store state interface
interface WorkflowState {
  // Workflow data
  workflows: Workflow[];
  currentWorkflow: Workflow | null;
  loading: boolean;
  error: string | null;

  // Execution data
  executions: Execution[];
  currentExecution: Execution | null;
  executionLoading: boolean;

  // Real-time subscriptions
  subscriptions: Map<string, () => void>;

  // Actions
  setWorkflows: (workflows: Workflow[]) => void;
  setCurrentWorkflow: (workflow: Workflow | null) => void;
  addWorkflow: (workflow: Workflow) => void;
  updateWorkflow: (id: number, updates: Partial<Workflow>) => void;
  deleteWorkflow: (id: number) => void;

  // Execution actions
  setExecutions: (executions: Execution[]) => void;
  setCurrentExecution: (execution: Execution | null) => void;
  addExecution: (execution: Execution) => void;
  updateExecution: (id: number, updates: Partial<Execution>) => void;

  // Optimistic updates
  optimisticUpdateWorkflow: (id: number, updates: Partial<Workflow>) => () => void;
  optimisticUpdateExecution: (id: number, updates: Partial<Execution>) => () => void;

  // Real-time subscriptions
  subscribeToWorkflow: (id: number) => void;
  subscribeToExecution: (id: number) => void;
  unsubscribeFromWorkflow: (id: number) => void;
  unsubscribeFromExecution: (id: number) => void;

  // Utility actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setExecutionLoading: (loading: boolean) => void;
}

// Create the store
export const useWorkflowStore = create<WorkflowState>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    workflows: [],
    currentWorkflow: null,
    loading: false,
    error: null,
    executions: [],
    currentExecution: null,
    executionLoading: false,
    subscriptions: new Map(),

    // Workflow actions
    setWorkflows: (workflows) => set({ workflows }),

    setCurrentWorkflow: (workflow) => set({ currentWorkflow: workflow }),

    addWorkflow: (workflow) =>
      set((state) => ({
        workflows: [...state.workflows, workflow],
      })),

    updateWorkflow: (id, updates) =>
      set((state) => ({
        workflows: state.workflows.map((w) => (w.id === id ? { ...w, ...updates } : w)),
        currentWorkflow: state.currentWorkflow?.id === id ? { ...state.currentWorkflow, ...updates } : state.currentWorkflow,
      })),

    deleteWorkflow: (id) =>
      set((state) => ({
        workflows: state.workflows.filter((w) => w.id !== id),
        currentWorkflow: state.currentWorkflow?.id === id ? null : state.currentWorkflow,
      })),

    // Execution actions
    setExecutions: (executions) => set({ executions }),

    setCurrentExecution: (execution) => set({ currentExecution: execution }),

    addExecution: (execution) =>
      set((state) => ({
        executions: [execution, ...state.executions],
      })),

    updateExecution: (id, updates) =>
      set((state) => ({
        executions: state.executions.map((e) => (e.id === id ? { ...e, ...updates } : e)),
        currentExecution: state.currentExecution?.id === id ? { ...state.currentExecution, ...updates } : state.currentExecution,
      })),

    // Optimistic updates with rollback
    optimisticUpdateWorkflow: (id, updates) => {
      const state = get();
      const originalWorkflow = state.workflows.find((w) => w.id === id);

      if (!originalWorkflow) {
        return () => {}; // No-op rollback
      }

      // Apply optimistic update
      set((state) => ({
        workflows: state.workflows.map((w) => (w.id === id ? { ...w, ...updates } : w)),
        currentWorkflow: state.currentWorkflow?.id === id ? { ...state.currentWorkflow, ...updates } : state.currentWorkflow,
      }));

      // Return rollback function
      return () => {
        set((state) => ({
          workflows: state.workflows.map((w) => (w.id === id ? originalWorkflow : w)),
          currentWorkflow: state.currentWorkflow?.id === id ? originalWorkflow : state.currentWorkflow,
        }));
      };
    },

    optimisticUpdateExecution: (id, updates) => {
      const state = get();
      const originalExecution = state.executions.find((e) => e.id === id);

      if (!originalExecution) {
        return () => {}; // No-op rollback
      }

      // Apply optimistic update
      set((state) => ({
        executions: state.executions.map((e) => (e.id === id ? { ...e, ...updates } : e)),
        currentExecution: state.currentExecution?.id === id ? { ...state.currentExecution, ...updates } : state.currentExecution,
      }));

      // Return rollback function
      return () => {
        set((state) => ({
          executions: state.executions.map((e) => (e.id === id ? originalExecution : e)),
          currentExecution: state.currentExecution?.id === id ? originalExecution : state.currentExecution,
        }));
      };
    },

    // Real-time subscriptions (placeholder implementations)
    subscribeToWorkflow: (id) => {
      // In a real implementation, this would set up WebSocket or Server-Sent Events
      // For now, we'll just track the subscription
      const subscriptionKey = `workflow-${id}`;
      if (!get().subscriptions.has(subscriptionKey)) {
        // Mock subscription - in real app, connect to real-time service
        const unsubscribe = () => {
          // Cleanup logic would go here
        };
        get().subscriptions.set(subscriptionKey, unsubscribe);
      }
    },

    subscribeToExecution: (id) => {
      const subscriptionKey = `execution-${id}`;
      if (!get().subscriptions.has(subscriptionKey)) {
        // Mock subscription - in real app, connect to real-time service
        const unsubscribe = () => {
          // Cleanup logic would go here
        };
        get().subscriptions.set(subscriptionKey, unsubscribe);
      }
    },

    unsubscribeFromWorkflow: (id) => {
      const subscriptionKey = `workflow-${id}`;
      const unsubscribe = get().subscriptions.get(subscriptionKey);
      if (unsubscribe) {
        unsubscribe();
        get().subscriptions.delete(subscriptionKey);
      }
    },

    unsubscribeFromExecution: (id) => {
      const subscriptionKey = `execution-${id}`;
      const unsubscribe = get().subscriptions.get(subscriptionKey);
      if (unsubscribe) {
        unsubscribe();
        get().subscriptions.delete(subscriptionKey);
      }
    },

    // Utility actions
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),
    setExecutionLoading: (loading) => set({ executionLoading: loading }),
  }))
);

// Selectors for common state slices
export const useWorkflows = () => useWorkflowStore((state) => state.workflows);
export const useCurrentWorkflow = () => useWorkflowStore((state) => state.currentWorkflow);
export const useWorkflowLoading = () => useWorkflowStore((state) => state.loading);
export const useWorkflowError = () => useWorkflowStore((state) => state.error);

export const useExecutions = () => useWorkflowStore((state) => state.executions);
export const useCurrentExecution = () => useWorkflowStore((state) => state.currentExecution);
export const useExecutionLoading = () => useWorkflowStore((state) => state.executionLoading);

// Action hooks
export const useWorkflowActions = () => useWorkflowStore((state) => ({
  setWorkflows: state.setWorkflows,
  setCurrentWorkflow: state.setCurrentWorkflow,
  addWorkflow: state.addWorkflow,
  updateWorkflow: state.updateWorkflow,
  deleteWorkflow: state.deleteWorkflow,
  optimisticUpdateWorkflow: state.optimisticUpdateWorkflow,
  subscribeToWorkflow: state.subscribeToWorkflow,
  unsubscribeFromWorkflow: state.unsubscribeFromWorkflow,
}));

export const useExecutionActions = () => useWorkflowStore((state) => ({
  setExecutions: state.setExecutions,
  setCurrentExecution: state.setCurrentExecution,
  addExecution: state.addExecution,
  updateExecution: state.updateExecution,
  optimisticUpdateExecution: state.optimisticUpdateExecution,
  subscribeToExecution: state.subscribeToExecution,
  unsubscribeFromExecution: state.unsubscribeFromExecution,
}));
