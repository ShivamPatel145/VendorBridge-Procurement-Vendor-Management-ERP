import { ApprovalsRepository } from './approvals.repository';
import { NotFoundError, ValidationError, ForbiddenError } from '../../shared/errors/AppError';
import { ActivityLogger } from '../../shared/utils/activityLogger';
import { EmailService } from '../../shared/services/email.service';
import prisma from '../../config/database';
// Import PO Service dynamically or lazily to avoid circular dependencies
import { POService } from '../purchase-orders/po.service';

export class ApprovalsService {
  public static async startWorkflow(data: any, actorId: string, ipAddress?: string) {
    const quotation = await prisma.quotation.findFirst({
      where: { id: data.quotationId, deletedAt: null },
    });
    if (!quotation) {
      throw new NotFoundError('Quotation');
    }

    if (quotation.status !== 'SUBMITTED') {
      throw new ValidationError('Quotation must be in SUBMITTED state to start approval');
    }

    // Check if workflow already exists
    const existing = await ApprovalsRepository.findWorkflowByQuotationId(data.quotationId);
    if (existing) {
      throw new ValidationError('Approval workflow already started for this quotation');
    }

    // Sort steps by stepNumber to make sure they are sequential
    const sortedSteps = [...data.steps].sort((a, b) => a.stepNumber - b.stepNumber);

    const workflow = await ApprovalsRepository.createWorkflow(data.quotationId, sortedSteps);

    // Update quotation status to UNDER_REVIEW
    await prisma.quotation.update({
      where: { id: data.quotationId },
      data: { status: 'UNDER_REVIEW' },
    });

    // Notify first approver
    const firstStep = sortedSteps[0];
    const firstApprover = await prisma.user.findUnique({ where: { id: firstStep.approverId } });
    if (firstApprover) {
      await prisma.notification.create({
        data: {
          userId: firstApprover.id,
          type: 'APPROVAL_REQUIRED',
          title: 'Approval Required',
          message: `Your approval is required for Quotation (RFQ: ${quotation.rfqId})`,
          link: `/approvals`,
        },
      });
    }

    await ActivityLogger.log({
      userId: actorId,
      action: 'START_APPROVAL_WORKFLOW',
      entity: 'ApprovalWorkflow',
      entityId: workflow.id,
      ipAddress,
    });

    return ApprovalsRepository.findWorkflowById(workflow.id);
  }

  public static async takeAction(
    workflowId: string,
    actionType: 'APPROVED' | 'REJECTED' | 'REVISION_REQUESTED',
    comment: string | undefined,
    userId: string,
    ipAddress?: string
  ) {
    const workflow = await ApprovalsRepository.findWorkflowById(workflowId);
    if (!workflow) {
      throw new NotFoundError('ApprovalWorkflow');
    }

    if (workflow.status !== 'PENDING') {
      throw new ValidationError('This workflow has already been finalized');
    }

    // Find the active step
    const currentStep = workflow.steps.find((s: any) => s.stepNumber === workflow.currentStep);
    if (!currentStep) {
      throw new NotFoundError('Current approval step');
    }

    if (currentStep.approverId !== userId) {
      throw new ForbiddenError('You are not authorized to approve this step');
    }

    if (currentStep.status !== 'PENDING') {
      throw new ValidationError('This step has already been acted upon');
    }

    // Register action
    await ApprovalsRepository.takeAction({
      workflowId,
      stepId: currentStep.id,
      userId,
      action: actionType,
      comment,
    });

    const quotationId = workflow.quotationId;

    if (actionType === 'REJECTED') {
      // Finalize workflow as REJECTED
      await ApprovalsRepository.updateWorkflow(workflowId, { status: 'REJECTED' });
      await prisma.quotation.update({
        where: { id: quotationId },
        data: { status: 'REJECTED' },
      });

      // Notify Vendor
      const vendorUser = await prisma.user.findUnique({ where: { id: workflow.quotation.vendor.userId } });
      if (vendorUser) {
        await prisma.notification.create({
          data: {
            userId: vendorUser.id,
            type: 'APPROVAL_DONE',
            title: 'Quotation Rejected',
            message: `Your quotation for RFQ "${workflow.quotation.rfq.title}" has been rejected.`,
            link: `/vendor-portal/rfqs`,
          },
        });
      }
    } else if (actionType === 'REVISION_REQUESTED') {
      // Reset workflow state & send quotation back to DRAFT
      await ApprovalsRepository.updateWorkflow(workflowId, { status: 'REVISION_REQUESTED' });
      await prisma.quotation.update({
        where: { id: quotationId },
        data: { status: 'DRAFT' },
      });

      // Notify Vendor
      const vendorUser = await prisma.user.findUnique({ where: { id: workflow.quotation.vendor.userId } });
      if (vendorUser) {
        await prisma.notification.create({
          data: {
            userId: vendorUser.id,
            type: 'APPROVAL_DONE',
            title: 'Revision Requested',
            message: `A revision has been requested for your quotation (RFQ: "${workflow.quotation.rfq.title}"). Comments: ${comment || 'None'}`,
            link: `/vendor-portal/rfqs`,
          },
        });
      }
    } else if (actionType === 'APPROVED') {
      // Check if there is a next step
      if (workflow.currentStep < workflow.totalSteps) {
        const nextStepNumber = workflow.currentStep + 1;
        await ApprovalsRepository.updateWorkflow(workflowId, { currentStep: nextStepNumber });

        // Notify next approver
        const nextStep = workflow.steps.find((s: any) => s.stepNumber === nextStepNumber);
        if (nextStep) {
          const nextApprover = await prisma.user.findUnique({ where: { id: nextStep.approverId } });
          if (nextApprover) {
            await prisma.notification.create({
              data: {
                userId: nextApprover.id,
                type: 'APPROVAL_REQUIRED',
                title: 'Approval Required',
                message: `Your approval is required for Quotation (RFQ: ${workflow.quotation.rfqId})`,
                link: `/approvals`,
              },
            });
          }
        }
      } else {
        // Final Approval reached!
        await ApprovalsRepository.updateWorkflow(workflowId, { status: 'APPROVED' });
        await prisma.quotation.update({
          where: { id: quotationId },
          data: { status: 'ACCEPTED' },
        });

        // Notify Vendor
        const vendorUser = await prisma.user.findUnique({ where: { id: workflow.quotation.vendor.userId } });
        if (vendorUser) {
          await prisma.notification.create({
            data: {
              userId: vendorUser.id,
              type: 'APPROVAL_DONE',
              title: 'Quotation Accepted',
              message: `Congratulations! Your quotation for RFQ "${workflow.quotation.rfq.title}" has been accepted.`,
              link: `/vendor-portal/purchase-orders`,
            },
          });
        }

        // Auto-generate Purchase Order!
        try {
          await POService.generateFromQuotation(quotationId, userId, ipAddress);
        } catch (poError) {
          console.error('Failed to auto-generate PO upon final approval:', poError);
        }
      }
    }

    await ActivityLogger.log({
      userId,
      action: `TAKE_APPROVAL_ACTION_${actionType}`,
      entity: 'ApprovalWorkflow',
      entityId: workflowId,
      metadata: { action: actionType, comment },
      ipAddress,
    });

    return ApprovalsRepository.findWorkflowById(workflowId);
  }

  public static async getWorkflow(id: string) {
    const workflow = await ApprovalsRepository.findWorkflowById(id);
    if (!workflow) {
      throw new NotFoundError('ApprovalWorkflow');
    }
    return workflow;
  }

  public static async getWorkflowByQuotation(quotationId: string) {
    const workflow = await ApprovalsRepository.findWorkflowByQuotationId(quotationId);
    if (!workflow) {
      throw new NotFoundError('ApprovalWorkflow');
    }
    return ApprovalsRepository.findWorkflowById(workflow.id);
  }

  public static async listPendingApprovals(userId: string) {
    return ApprovalsRepository.listPending(userId);
  }
}

export default ApprovalsService;
