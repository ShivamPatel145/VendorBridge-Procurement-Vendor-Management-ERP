import { VendorsRepository } from './vendors.repository';
import { CloudinaryService } from '../../shared/services/cloudinary.service';
import { NotFoundError } from '../../shared/errors/AppError';
import { ActivityLogger } from '../../shared/utils/activityLogger';

export class VendorsService {
  public static async updateVendor(id: string, data: any, actorId: string, ipAddress?: string) {
    const vendor = await VendorsRepository.findById(id);
    if (!vendor) {
      throw new NotFoundError('Vendor');
    }

    const updated = await VendorsRepository.update(id, data);

    await ActivityLogger.log({
      userId: actorId,
      action: 'UPDATE_VENDOR',
      entity: 'Vendor',
      entityId: id,
      ipAddress,
    });

    return updated;
  }

  public static async updateVendorStatus(id: string, status: any, actorId: string, ipAddress?: string) {
    const vendor = await VendorsRepository.findById(id);
    if (!vendor) {
      throw new NotFoundError('Vendor');
    }

    const updated = await VendorsRepository.updateStatus(id, status);

    await ActivityLogger.log({
      userId: actorId,
      action: `VENDOR_STATUS_${status}`,
      entity: 'Vendor',
      entityId: id,
      metadata: { status },
      ipAddress,
    });

    return updated;
  }

  public static async uploadDocument(
    vendorId: string,
    buffer: Buffer,
    filename: string,
    mimetype: string,
    actorId: string,
    ipAddress?: string
  ) {
    const vendor = await VendorsRepository.findById(vendorId);
    if (!vendor) {
      throw new NotFoundError('Vendor');
    }

    const resourceType = mimetype.startsWith('image/') ? 'image' : 'raw';
    const uploadResult = await CloudinaryService.uploadBuffer(
      buffer,
      `vendors/${vendorId}`,
      filename,
      resourceType
    );

    const doc = await VendorsRepository.createDocument({
      vendorId,
      name: filename,
      fileUrl: uploadResult.url,
      fileType: mimetype,
    });

    await ActivityLogger.log({
      userId: actorId,
      action: 'UPLOAD_VENDOR_DOCUMENT',
      entity: 'VendorDocument',
      entityId: doc.id,
      ipAddress,
    });

    return doc;
  }

  public static async listVendors(params: any) {
    return VendorsRepository.list(params);
  }

  public static async getVendor(id: string) {
    const vendor = await VendorsRepository.findById(id);
    if (!vendor) {
      throw new NotFoundError('Vendor');
    }
    return vendor;
  }

  public static async getVendorByUserId(userId: string) {
    const vendor = await VendorsRepository.findByUserId(userId);
    if (!vendor) {
      throw new NotFoundError('Vendor');
    }
    return vendor;
  }

  // Categories
  public static async createCategory(data: any, actorId: string, ipAddress?: string) {
    const cat = await VendorsRepository.createCategory(data);
    await ActivityLogger.log({
      userId: actorId,
      action: 'CREATE_VENDOR_CATEGORY',
      entity: 'VendorCategory',
      entityId: cat.id,
      ipAddress,
    });
    return cat;
  }

  public static async listCategories() {
    return VendorsRepository.listCategories();
  }

  public static async deleteCategory(id: string, actorId: string, ipAddress?: string) {
    const cat = await VendorsRepository.getCategoryById(id);
    if (!cat) {
      throw new NotFoundError('VendorCategory');
    }
    await VendorsRepository.deleteCategory(id);
    await ActivityLogger.log({
      userId: actorId,
      action: 'DELETE_VENDOR_CATEGORY',
      entity: 'VendorCategory',
      entityId: id,
      ipAddress,
    });
  }
}

export default VendorsService;
