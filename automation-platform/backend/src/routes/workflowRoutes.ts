import { Router } from 'express';
import { workflowController } from '../controllers/workflowController.js';
import { executionService } from '../services/ExecutionService.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// Apply authentication middleware to all routes
router.use(authenticate);

// Workflow CRUD routes
router.get('/workflows', workflowController.getWorkflows);
router.get('/workflows/search', workflowController.searchWorkflowsByNodeProperties);
router.post('/workflows', workflowController.createWorkflow);
router.get('/workflows/:id', workflowController.getWorkflowById);
router.put('/workflows/:id', workflowController.updateWorkflow);
router.delete('/workflows/:id', workflowController.deleteWorkflow);
router.post('/workflows/:id/clone', workflowController.cloneWorkflow);

// Workflow execution routes
router.get('/workflows/:id/executions', workflowController.getWorkflowExecutions);
router.post('/workflows/:id/execute', async (req, res) => {
  try {
    const workflowId = parseInt(req.params.id);
    const input = req.body;
    const userId = req.user!.id;

    const result = await executionService.executeWorkflow(workflowId, input, userId);
    res.json(result);
  } catch (error) {
    console.error('Error executing workflow:', error);
    res.status(500).json({ error: 'Failed to execute workflow' });
  }
});

// Execution management routes
router.get('/executions/:id', async (req, res) => {
  try {
    const executionId = parseInt(req.params.id);
    const status = await executionService.getExecutionStatus(executionId);
    res.json(status);
  } catch (error) {
    console.error('Error getting execution status:', error);
    res.status(500).json({ error: 'Failed to get execution status' });
  }
});

router.get('/executions/:id/logs', async (req, res) => {
  try {
    const executionId = parseInt(req.params.id);
    const { level, nodeId, dateFrom, dateTo, search, page, limit } = req.query;

    const filters = {
      level: level ? (Array.isArray(level) ? level : [level]) as string[] : undefined,
      nodeId: nodeId as string,
      dateFrom: dateFrom ? new Date(dateFrom as string) : undefined,
      dateTo: dateTo ? new Date(dateTo as string) : undefined,
      search: search as string,
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
    };

    const logs = await executionService.getExecutionLogsAdvanced(executionId, filters);
    res.json(logs);
  } catch (error) {
    console.error('Error getting execution logs:', error);
    res.status(500).json({ error: 'Failed to get execution logs' });
  }
});

// Bulk operations
router.put('/executions/bulk/status', async (req, res) => {
  try {
    const { executionIds, status } = req.body;
    const result = await executionService.bulkUpdateExecutionStatus(executionIds, status);
    res.json(result);
  } catch (error) {
    console.error('Error updating execution status:', error);
    res.status(500).json({ error: 'Failed to update execution status' });
  }
});

router.delete('/executions/bulk', async (req, res) => {
  try {
    const { executionIds } = req.body;
    const userId = req.user!.id;
    const result = await executionService.bulkDeleteExecutions(executionIds, userId);
    res.json(result);
  } catch (error) {
    console.error('Error deleting executions:', error);
    res.status(500).json({ error: 'Failed to delete executions' });
  }
});

// Analytics and monitoring
router.get('/workflows/:id/metrics', async (req, res) => {
  try {
    const workflowId = parseInt(req.params.id);
    const { from, to } = req.query;

    const timeRange = {
      from: new Date(from as string),
      to: new Date(to as string),
    };

    const metrics = await executionService.getExecutionMetrics(workflowId, timeRange);
    res.json(metrics);
  } catch (error) {
    console.error('Error getting execution metrics:', error);
    res.status(500).json({ error: 'Failed to get execution metrics' });
  }
});

router.get('/executions/active', async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
    const activeExecutions = await executionService.getActiveExecutionsWithDetails(limit);
    res.json(activeExecutions);
  } catch (error) {
    console.error('Error getting active executions:', error);
    res.status(500).json({ error: 'Failed to get active executions' });
  }
});

// Cleanup routes (admin only)
router.delete('/executions/cleanup', async (req, res) => {
  try {
    const { olderThanDays } = req.body;
    const userId = req.user!.id;

    const result = await executionService.cleanupOldExecutions(olderThanDays, userId);
    res.json(result);
  } catch (error) {
    console.error('Error cleaning up executions:', error);
    res.status(500).json({ error: 'Failed to cleanup executions' });
  }
});

export default router;
