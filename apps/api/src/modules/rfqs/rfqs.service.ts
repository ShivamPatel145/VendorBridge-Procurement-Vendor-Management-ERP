import { RFQsRepository } from './rfqs.repository';
import { CloudinaryService } from '../../shared/services/cloudinary.service';
import { EmailService } from '../../shared/services/email.service';
import { NotFoundError, ValidationError } from '../../shared/errors/AppError';
import { ActivityLogger } from '../../shared/utils/activityLogger';
import prisma from '../../config/database';

export class RFQsService {
  public static async createRFQ(data: any, actorId: string, ipAddress?: string) {
    const rfq = await RFQsRepository.create(
      {
        title: data.title,
        description: data.description,
        deadline: data.deadline,
        createdById: actorId,
      },
      data.items
    );

    await ActivityLogger.log({
      userId: actorId,
      action: 'CREATE_RFQ',
      entity: 'RFQ',
      entityId: rfq.id,
      ipAddress,
    });

    return RFQsRepository.findById(rfq.id);
  }

  public static async updateRFQ(id: string, data: any, actorId: string, ipAddress?: string) {
    const rfq = await RFQsRepository.findById(id);
    if (!rfq) {
      throw new NotFoundError('RFQ');
    }

    const updated = await RFQsRepository.update(id, data);

    await ActivityLogger.log({
      userId: actorId,
      action: 'UPDATE_RFQ',
      entity: 'RFQ',
      entityId: id,
      ipAddress,
    });

    return updated;
  }

  public static async publishRFQ(id: string, actorId: string, ipAddress?: string) {
    const rfq = await RFQsRepository.findById(id);
    if (!rfq) {
      throw new NotFoundError('RFQ');
    }

    if (rfq.status !== 'DRAFT') {
      throw new ValidationError('Only draft RFQs can be published');
    }

    const updated = await RFQsRepository.update(id, { status: 'PUBLISHED' });

    await ActivityLogger.log({
      userId: actorId,
      action: 'PUBLISH_RFQ',
      entity: 'RFQ',
      entityId: id,
      ipAddress,
    });

    return updated;
  }

  public static async closeRFQ(id: string, actorId: string, ipAddress?: string) {
    const rfq = await RFQsRepository.findById(id);
    if (!rfq) {
      throw new NotFoundError('RFQ');
    }

    const updated = await RFQsRepository.update(id, { status: 'CLOSED' });

    await ActivityLogger.log({
      userId: actorId,
      action: 'CLOSE_RFQ',
      entity: 'RFQ',
      entityId: id,
      ipAddress,
    });

    return updated;
  }

  public static async inviteVendors(id: string, vendorIds: string[], actorId: string, ipAddress?: string) {
    const rfq = await RFQsRepository.findById(id);
    if (!rfq) {
      throw new NotFoundError('RFQ');
    }

    await RFQsRepository.inviteVendors(id, vendorIds);

    const vendors = await prisma.vendor.findMany({
      where: { id: { in: vendorIds } },
      include: { user: true },
    });

    for (const vendor of vendors) {
      await prisma.notification.create({
        data: {
          userId: vendor.userId,
          type: 'RFQ_INVITED',
          title: 'New RFQ Invitation',
          message: `You have been invited to submit a quotation for RFQ: "${rfq.title}"`,
          link: `/vendor-portal/rfqs/${rfq.id}`,
        },
      });

      await EmailService.sendEmail({
        to: vendor.user.email,
        subject: `Invitation to RFQ: ${rfq.title}`,
        template: 'rfq_invited',
        html: `
          <h1>RFQ Invitation</h1>
          <p>Dear ${vendor.companyName},</p>
          <p>You are invited to submit a quotation for the following RFQ:</p>
          <h3>${rfq.title}</h3>
          <p>${rfq.description || ''}</p>
          <p><strong>Deadline:</strong> ${new Date(rfq.deadline).toLocaleDateString()}</p>
          <p>Please log in to your vendor portal to submit your bid before the deadline.</p>
        `,
      });
    }

    await ActivityLogger.log({
      userId: actorId,
      action: 'INVITE_VENDORS_RFQ',
      entity: 'RFQ',
      entityId: id,
      metadata: { invitedVendorIds: vendorIds },
      ipAddress,
    });
  }

  public static async uploadAttachment(
    rfqId: string,
    buffer: Buffer,
    filename: string,
    mimetype: string,
    actorId: string,
    ipAddress?: string
  ) {
    const rfq = await RFQsRepository.findById(rfqId);
    if (!rfq) {
      throw new NotFoundError('RFQ');
    }

    const resourceType = mimetype.startsWith('image/') ? 'image' : 'raw';
    const uploadResult = await CloudinaryService.uploadBuffer(
      buffer,
      `rfqs/${rfqId}`,
      filename,
      resourceType
    );

    const attachment = await RFQsRepository.createAttachment({
      rfqId,
      fileName: filename,
      fileUrl: uploadResult.url,
    });

    await ActivityLogger.log({
      userId: actorId,
      action: 'UPLOAD_RFQ_ATTACHMENT',
      entity: 'RFQAttachment',
      entityId: attachment.id,
      ipAddress,
    });

    return attachment;
  }

  public static async listRFQs(params: any) {
    return RFQsRepository.list(params);
  }

  public static async getRFQ(id: string) {
    const rfq = await RFQsRepository.findById(id);
    if (!rfq) {
      throw new NotFoundError('RFQ');
    }
    return rfq;
  }
}

export default RFQsService;
