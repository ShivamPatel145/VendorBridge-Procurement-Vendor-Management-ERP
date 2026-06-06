/** Shared TypeScript types for VendorBridge */

export type UserRole = 'ADMIN' | 'PROCUREMENT_OFFICER' | 'MANAGER' | 'VENDOR';
export type VendorStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';
export type RFQStatus = 'DRAFT' | 'PUBLISHED' | 'CLOSED' | 'EVALUATING' | 'AWARDED' | 'CANCELLED';
export type QuotationStatus = 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'ACCEPTED' | 'REJECTED';
export type ApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'REVISION_REQUESTED';
export type POStatus = 'DRAFT' | 'APPROVED' | 'SENT' | 'ACKNOWLEDGED' | 'COMPLETED' | 'CANCELLED';
export type InvoiceStatus = 'DRAFT' | 'PENDING' | 'APPROVED' | 'SENT' | 'PAID' | 'CANCELLED';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
}

export interface Vendor {
  id: string;
  companyName: string;
  contactPerson: string;
  phone: string;
  address: string;
  taxId?: string;
  status: VendorStatus;
  rating?: number;
  category?: VendorCategory;
  createdAt: string;
}

export interface VendorCategory {
  id: string;
  name: string;
  description?: string;
}

export interface RFQ {
  id: string;
  title: string;
  description?: string;
  status: RFQStatus;
  deadline: string;
  createdBy: User;
  items: RFQItem[];
  createdAt: string;
}

export interface RFQItem {
  id: string;
  description: string;
  quantity: number;
  unit: string;
}

export interface Quotation {
  id: string;
  rfq: RFQ;
  vendor: Vendor;
  status: QuotationStatus;
  totalAmount: number;
  notes?: string;
  validUntil?: string;
  submittedAt?: string;
  items: QuotationItem[];
}

export interface QuotationItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  quotation: Quotation;
  status: POStatus;
  totalAmount: number;
  deliveryDate?: string;
  terms?: string;
  pdfUrl?: string;
  createdAt: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  po: PurchaseOrder;
  status: InvoiceStatus;
  totalAmount: number;
  dueDate: string;
  paidAt?: string;
  pdfUrl?: string;
  emailSentAt?: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  link?: string;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  meta: { page: number; limit: number; total: number };
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface ApiError {
  success: false;
  code: string;
  message: string;
}
