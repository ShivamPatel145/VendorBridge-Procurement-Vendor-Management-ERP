import { PrismaClient, Role, VendorStatus, RFQStatus, QuotationStatus, ApprovalStatus, POStatus, InvoiceStatus } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data in correct order (respecting foreign keys)
  await prisma.activityLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.emailLog.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.invoiceItem.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.pOItem.deleteMany();
  await prisma.purchaseOrder.deleteMany();
  await prisma.approvalAction.deleteMany();
  await prisma.approvalStep.deleteMany();
  await prisma.approvalWorkflow.deleteMany();
  await prisma.quotationAttachment.deleteMany();
  await prisma.quotationItem.deleteMany();
  await prisma.quotation.deleteMany();
  await prisma.rFQAttachment.deleteMany();
  await prisma.rFQVendor.deleteMany();
  await prisma.rFQItem.deleteMany();
  await prisma.rFQ.deleteMany();
  await prisma.vendorDocument.deleteMany();
  await prisma.vendor.deleteMany();
  await prisma.vendorCategory.deleteMany();
  await prisma.user.deleteMany();

  console.log('✅ Cleared existing data');

  // Create password hash
  const passwordHash = await bcrypt.hash('Demo@1234', 10);

  // 1. Create Users
  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@vendorbridge.demo',
      passwordHash,
      role: Role.ADMIN,
    },
  });

  const procurementOfficer = await prisma.user.create({
    data: {
      name: 'Procurement Officer',
      email: 'officer@vendorbridge.demo',
      passwordHash,
      role: Role.PROCUREMENT_OFFICER,
    },
  });

  const manager = await prisma.user.create({
    data: {
      name: 'Manager User',
      email: 'manager@vendorbridge.demo',
      passwordHash,
      role: Role.MANAGER,
    },
  });

  const vendorUser1 = await prisma.user.create({
    data: {
      name: 'Vendor Contact 1',
      email: 'vendor@vendorbridge.demo',
      passwordHash,
      role: Role.VENDOR,
    },
  });

  const vendorUser2 = await prisma.user.create({
    data: {
      name: 'Vendor Contact 2',
      email: 'vendor2@vendorbridge.demo',
      passwordHash,
      role: Role.VENDOR,
    },
  });

  const vendorUser3 = await prisma.user.create({
    data: {
      name: 'Vendor Contact 3',
      email: 'vendor3@vendorbridge.demo',
      passwordHash,
      role: Role.VENDOR,
    },
  });

  console.log('✅ Created users');

  // 2. Create Vendor Categories
  const itCategory = await prisma.vendorCategory.create({
    data: {
      name: 'IT Hardware',
      description: 'Computer hardware and accessories',
    },
  });

  const furnitureCategory = await prisma.vendorCategory.create({
    data: {
      name: 'Office Furniture',
      description: 'Office furniture and fixtures',
    },
  });

  const stationeryCategory = await prisma.vendorCategory.create({
    data: {
      name: 'Stationery',
      description: 'Office stationery and supplies',
    },
  });

  console.log('✅ Created vendor categories');

  // 3. Create Vendors
  const vendor1 = await prisma.vendor.create({
    data: {
      userId: vendorUser1.id,
      companyName: 'TechCorp Solutions',
      contactPerson: 'John Smith',
      phone: '+91 9876543210',
      address: '123 Tech Park, Bangalore, Karnataka 560001',
      taxId: '29AABCU9603R1ZV',
      website: 'https://techcorp.example.com',
      status: VendorStatus.APPROVED,
      categoryId: itCategory.id,
      rating: 4.5,
    },
  });

  const vendor2 = await prisma.vendor.create({
    data: {
      userId: vendorUser2.id,
      companyName: 'Office Furniture Co.',
      contactPerson: 'Sarah Johnson',
      phone: '+91 9876543211',
      address: '456 Furniture Street, Mumbai, Maharashtra 400001',
      taxId: '27AABCU9604R1ZW',
      website: 'https://officefurniture.example.com',
      status: VendorStatus.APPROVED,
      categoryId: furnitureCategory.id,
      rating: 4.2,
    },
  });

  const vendor3 = await prisma.vendor.create({
    data: {
      userId: vendorUser3.id,
      companyName: 'Stationery World',
      contactPerson: 'Michael Brown',
      phone: '+91 9876543212',
      address: '789 Paper Lane, Delhi 110001',
      taxId: '07AABCU9605R1ZX',
      status: VendorStatus.APPROVED,
      categoryId: stationeryCategory.id,
      rating: 4.0,
    },
  });

  console.log('✅ Created vendors');

  // 4. Create RFQs
  const rfq1 = await prisma.rFQ.create({
    data: {
      title: 'Office Laptops Procurement Q2 2025',
      description: 'Procurement of 50 business laptops for new employees',
      status: RFQStatus.PUBLISHED,
      deadline: new Date('2025-07-15'),
      createdById: procurementOfficer.id,
      items: {
        create: [
          {
            description: 'Business Laptop - Core i5, 16GB RAM, 512GB SSD',
            quantity: 50,
            unit: 'pcs',
          },
          {
            description: 'Laptop Bag',
            quantity: 50,
            unit: 'pcs',
          },
        ],
      },
    },
  });

  const rfq2 = await prisma.rFQ.create({
    data: {
      title: 'Office Furniture for New Branch',
      description: 'Complete office furniture setup for 100 employees',
      status: RFQStatus.PUBLISHED,
      deadline: new Date('2025-07-20'),
      createdById: procurementOfficer.id,
      items: {
        create: [
          {
            description: 'Ergonomic Office Chair',
            quantity: 100,
            unit: 'pcs',
          },
          {
            description: 'Office Desk with Drawers',
            quantity: 100,
            unit: 'pcs',
          },
          {
            description: 'Filing Cabinet',
            quantity: 25,
            unit: 'pcs',
          },
        ],
      },
    },
  });

  const rfq3 = await prisma.rFQ.create({
    data: {
      title: 'Office Stationery Q3 2025',
      description: 'Quarterly stationery supplies',
      status: RFQStatus.PUBLISHED,
      deadline: new Date('2025-07-10'),
      createdById: procurementOfficer.id,
      items: {
        create: [
          {
            description: 'A4 Paper Reams',
            quantity: 500,
            unit: 'reams',
          },
          {
            description: 'Ballpoint Pens (Blue)',
            quantity: 1000,
            unit: 'pcs',
          },
          {
            description: 'Stapler with Staples',
            quantity: 50,
            unit: 'sets',
          },
        ],
      },
    },
  });

  console.log('✅ Created RFQs');

  // 5. Invite Vendors to RFQs
  await prisma.rFQVendor.createMany({
    data: [
      { rfqId: rfq1.id, vendorId: vendor1.id, viewed: true },
      { rfqId: rfq2.id, vendorId: vendor2.id, viewed: true },
      { rfqId: rfq3.id, vendorId: vendor3.id, viewed: true },
    ],
  });

  console.log('✅ Invited vendors to RFQs');

  // 6. Create Quotations
  const quotation1 = await prisma.quotation.create({
    data: {
      rfqId: rfq1.id,
      vendorId: vendor1.id,
      status: QuotationStatus.SUBMITTED,
      totalAmount: 3750000,
      notes: 'Premium business laptops with 3-year warranty',
      validUntil: new Date('2025-07-25'),
      submittedAt: new Date(),
      items: {
        create: [
          {
            description: 'Business Laptop - Core i5, 16GB RAM, 512GB SSD',
            quantity: 50,
            unitPrice: 70000,
            totalPrice: 3500000,
          },
          {
            description: 'Laptop Bag',
            quantity: 50,
            unitPrice: 5000,
            totalPrice: 250000,
          },
        ],
      },
    },
  });

  const quotation2 = await prisma.quotation.create({
    data: {
      rfqId: rfq2.id,
      vendorId: vendor2.id,
      status: QuotationStatus.SUBMITTED,
      totalAmount: 2250000,
      notes: 'Ergonomic furniture with 5-year warranty',
      validUntil: new Date('2025-07-30'),
      submittedAt: new Date(),
      items: {
        create: [
          {
            description: 'Ergonomic Office Chair',
            quantity: 100,
            unitPrice: 15000,
            totalPrice: 1500000,
          },
          {
            description: 'Office Desk with Drawers',
            quantity: 100,
            unitPrice: 6000,
            totalPrice: 600000,
          },
          {
            description: 'Filing Cabinet',
            quantity: 25,
            unitPrice: 6000,
            totalPrice: 150000,
          },
        ],
      },
    },
  });

  const quotation3 = await prisma.quotation.create({
    data: {
      rfqId: rfq3.id,
      vendorId: vendor3.id,
      status: QuotationStatus.SUBMITTED,
      totalAmount: 185000,
      notes: 'Premium quality stationery',
      validUntil: new Date('2025-07-15'),
      submittedAt: new Date(),
      items: {
        create: [
          {
            description: 'A4 Paper Reams',
            quantity: 500,
            unitPrice: 300,
            totalPrice: 150000,
          },
          {
            description: 'Ballpoint Pens (Blue)',
            quantity: 1000,
            unitPrice: 25,
            totalPrice: 25000,
          },
          {
            description: 'Stapler with Staples',
            quantity: 50,
            unitPrice: 200,
            totalPrice: 10000,
          },
        ],
      },
    },
  });

  console.log('✅ Created quotations');

  // 7. Create Approval Workflows
  const approval1 = await prisma.approvalWorkflow.create({
    data: {
      quotationId: quotation1.id,
      currentStep: 1,
      totalSteps: 1,
      status: ApprovalStatus.PENDING,
      steps: {
        create: {
          stepNumber: 1,
          approverId: manager.id,
          status: ApprovalStatus.PENDING,
          dueDate: new Date('2025-07-05'),
        },
      },
    },
  });

  const approval2 = await prisma.approvalWorkflow.create({
    data: {
      quotationId: quotation2.id,
      currentStep: 1,
      totalSteps: 1,
      status: ApprovalStatus.APPROVED,
      steps: {
        create: {
          stepNumber: 1,
          approverId: manager.id,
          status: ApprovalStatus.APPROVED,
          dueDate: new Date('2025-07-05'),
          actions: {
            create: {
              userId: manager.id,
              action: ApprovalStatus.APPROVED,
              comment: 'Approved - Good pricing and quality',
            },
          },
        },
      },
    },
  });

  console.log('✅ Created approval workflows');

  // 8. Update quotation status for approved
  await prisma.quotation.update({
    where: { id: quotation2.id },
    data: { status: QuotationStatus.ACCEPTED },
  });

  // 9. Create Purchase Order from approved quotation
  const po1 = await prisma.purchaseOrder.create({
    data: {
      poNumber: 'PO-2025-001',
      quotationId: quotation2.id,
      createdById: procurementOfficer.id,
      status: POStatus.APPROVED,
      totalAmount: 2250000,
      deliveryDate: new Date('2025-08-15'),
      terms: 'Payment within 30 days of delivery. 5-year warranty on all items.',
      items: {
        create: [
          {
            description: 'Ergonomic Office Chair',
            quantity: 100,
            unitPrice: 15000,
            totalPrice: 1500000,
          },
          {
            description: 'Office Desk with Drawers',
            quantity: 100,
            unitPrice: 6000,
            totalPrice: 600000,
          },
          {
            description: 'Filing Cabinet',
            quantity: 25,
            unitPrice: 6000,
            totalPrice: 150000,
          },
        ],
      },
    },
  });

  console.log('✅ Created purchase order');

  // 10. Create Invoice from PO
  const invoice1 = await prisma.invoice.create({
    data: {
      invoiceNumber: 'INV-2025-001',
      poId: po1.id,
      createdById: procurementOfficer.id,
      status: InvoiceStatus.PENDING,
      totalAmount: 2250000,
      dueDate: new Date('2025-08-30'),
      items: {
        create: [
          {
            description: 'Ergonomic Office Chair',
            quantity: 100,
            unitPrice: 15000,
            totalPrice: 1500000,
          },
          {
            description: 'Office Desk with Drawers',
            quantity: 100,
            unitPrice: 6000,
            totalPrice: 600000,
          },
          {
            description: 'Filing Cabinet',
            quantity: 25,
            unitPrice: 6000,
            totalPrice: 150000,
          },
        ],
      },
    },
  });

  console.log('✅ Created invoice');

  // 11. Create Activity Logs
  await prisma.activityLog.createMany({
    data: [
      {
        userId: procurementOfficer.id,
        action: 'CREATE',
        entity: 'RFQ',
        entityId: rfq1.id,
        metadata: { title: rfq1.title },
      },
      {
        userId: vendorUser1.id,
        action: 'SUBMIT',
        entity: 'Quotation',
        entityId: quotation1.id,
        metadata: { amount: 3750000 },
      },
      {
        userId: manager.id,
        action: 'APPROVE',
        entity: 'Approval',
        entityId: approval2.id,
        metadata: { quotationId: quotation2.id },
      },
      {
        userId: procurementOfficer.id,
        action: 'GENERATE',
        entity: 'PurchaseOrder',
        entityId: po1.id,
        metadata: { poNumber: 'PO-2025-001' },
      },
    ],
  });

  console.log('✅ Created activity logs');

  // 12. Create Notifications
  await prisma.notification.createMany({
    data: [
      {
        userId: manager.id,
        type: 'APPROVAL_REQUIRED',
        title: 'Approval Required',
        message: 'Quotation for Office Laptops needs your approval',
        link: `/approvals/${approval1.id}`,
      },
      {
        userId: procurementOfficer.id,
        type: 'APPROVAL_DONE',
        title: 'Quotation Approved',
        message: 'Office Furniture quotation has been approved',
        link: `/quotations/${quotation2.id}`,
      },
      {
        userId: vendorUser2.id,
        type: 'PO_GENERATED',
        title: 'Purchase Order Generated',
        message: 'PO-2025-001 has been created for your quotation',
        link: `/vendor-portal/purchase-orders/${po1.id}`,
      },
    ],
  });

  console.log('✅ Created notifications');

  console.log('\n🎉 Database seeding completed successfully!\n');
  console.log('📧 Login Credentials:');
  console.log('Admin: admin@vendorbridge.demo / Demo@1234');
  console.log('Procurement Officer: officer@vendorbridge.demo / Demo@1234');
  console.log('Manager: manager@vendorbridge.demo / Demo@1234');
  console.log('Vendor 1: vendor@vendorbridge.demo / Demo@1234');
  console.log('Vendor 2: vendor2@vendorbridge.demo / Demo@1234');
  console.log('Vendor 3: vendor3@vendorbridge.demo / Demo@1234\n');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
