import { Request, Response, NextFunction } from 'express';
import { ReportsService } from './reports.service';
import { queryLogsSchema } from './reports.validator';

export class ReportsController {
  public static async getSummary(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await ReportsService.getProcurementSummary();
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  public static async getAuditLogs(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const query = queryLogsSchema.parse(req.query);
      const page = parseInt(query.page, 10);
      const limit = parseInt(query.limit, 10);

      const result = await ReportsService.getActivityLogs({
        search: query.search,
        page,
        limit,
      });

      res.status(200).json({
        success: true,
        data: result.logs,
        meta: {
          page,
          limit,
          total: result.total,
        },
      });
    } catch (err) {
      next(err);
    }
  }
}

export default ReportsController;
