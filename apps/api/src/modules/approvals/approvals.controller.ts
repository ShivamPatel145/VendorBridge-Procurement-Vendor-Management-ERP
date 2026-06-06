import { Request, Response, NextFunction } from 'express';
import { ApprovalsService } from './approvals.service';
import { startWorkflowSchema, takeApprovalActionSchema } from './approvals.validator';

export class ApprovalsController {
  public static async start(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = startWorkflowSchema.parse(req.body);
      const actorId = req.user!.userId;
      const result = await ApprovalsService.startWorkflow(data, actorId, req.ip);
      res.status(201).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  public static async takeAction(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { action, comment } = takeApprovalActionSchema.parse(req.body);
      const userId = req.user!.userId;
      const result = await ApprovalsService.takeAction(id, action, comment, userId, req.ip);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  public static async get(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const result = await ApprovalsService.getWorkflow(id);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  public static async getByQuotation(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { quotationId } = req.params;
      const result = await ApprovalsService.getWorkflowByQuotation(quotationId);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  public static async listPending(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const result = await ApprovalsService.listPendingApprovals(userId);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }
}

export default ApprovalsController;
