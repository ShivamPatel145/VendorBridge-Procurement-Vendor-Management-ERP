import prisma from '../../config/database';
import { Prisma, ApprovalWorkflow, ApprovalStep, ApprovalAction } from '@prisma/client';

export class ApprovalsRepository {
  public static async findWorkflowById(id: string): Promise<any | null> {
    return prisma.approvalWorkflow.findUnique({
      where: { id },
      include: {
        quotation: {
          include: {
            vendor: true,
            rfq: true,
          },
        },
        steps: {
          orderBy: { stepNumber: 'asc' },
          include: {
            actions: {
              include: {
                user: { select: { id: true, name: true, email: true } },
              },
            },
          },
        },
      },
    });
  }

  public static async findWorkflowByQuotationId(quotationId: string): Promise<any | null> {
    return prisma.approvalWorkflow.findFirst({
      where: { quotationId },
      include: {
        steps: {
          orderBy: { stepNumber: 'asc' },
        },
      },
    });
  }

  public static async createWorkflow(
    quotationId: string,
    steps: { stepNumber: number; approverId: string; dueDate?: Date }[]
  ): Promise<ApprovalWorkflow> {
    return prisma.$transaction(async (tx) => {
      const workflow = await tx.approvalWorkflow.create({
        data: {
          quotationId,
          totalSteps: steps.length,
          currentStep: 1,
          status: 'PENDING',
        },
      });

      await tx.approvalStep.createMany({
        data: steps.map((step) => ({
          workflowId: workflow.id,
          stepNumber: step.stepNumber,
          approverId: step.approverId,
          status: 'PENDING',
          dueDate: step.dueDate,
        })),
      });

      return workflow;
    });
  }

  public static async takeAction(params: {
    workflowId: string;
    stepId: string;
    userId: string;
    action: any;
    comment?: string;
  }): Promise<ApprovalAction> {
    return prisma.$transaction(async (tx) => {
      // Create the approval action record
      const action = await tx.approvalAction.create({
        data: {
          stepId: params.stepId,
          userId: params.userId,
          action: params.action,
          comment: params.comment,
        },
      });

      // Update the step status
      await tx.approvalStep.update({
        where: { id: params.stepId },
        data: { status: params.action },
      });

      return action;
    });
  }

  public static async updateWorkflow(
    id: string,
    data: Prisma.ApprovalWorkflowUpdateInput
  ): Promise<ApprovalWorkflow> {
    return prisma.approvalWorkflow.update({
      where: { id },
      data,
    });
  }

  public static async listPending(userId: string): Promise<any[]> {
    return prisma.approvalStep.findMany({
      where: {
        approverId: userId,
        status: 'PENDING',
        workflow: {
          status: 'PENDING',
        },
      },
      include: {
        workflow: {
          include: {
            quotation: {
              include: {
                vendor: true,
                rfq: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}

export default ApprovalsRepository;
