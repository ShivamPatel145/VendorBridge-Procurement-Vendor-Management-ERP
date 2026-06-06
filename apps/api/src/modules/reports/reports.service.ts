import { ReportsRepository } from './reports.repository';

export class ReportsService {
  public static async getProcurementSummary() {
    const [spend, rfqRates, statusSummary] = await Promise.all([
      ReportsRepository.getSpendByVendorMonthly(),
      ReportsRepository.getRFQResponseRate(),
      ReportsRepository.getPOInvoiceStatusSummary(),
    ]);

    return {
      spendByVendor: spend.map((s: any) => ({
        ...s,
        totalSpend: Number(s.totalSpend),
      })),
      rfqResponseRates: rfqRates.map((r: any) => ({
        ...r,
        invitedCount: Number(r.invitedCount),
        responseCount: Number(r.responseCount),
        responseRate: Number(r.responseRate),
      })),
      statusSummary,
    };
  }

  public static async getActivityLogs(params: { search?: string; page: number; limit: number }) {
    return ReportsRepository.listActivityLogs(params);
  }
}

export default ReportsService;
