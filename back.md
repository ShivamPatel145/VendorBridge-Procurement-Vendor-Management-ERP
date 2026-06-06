# VendorBridge API — Postman Testing Guide

Complete step-by-step guide to run the backend, test every API in Postman, and verify data is stored in your **Neon PostgreSQL** database via Prisma.

---

## STEP 1 — Set Up the Backend

### 1.1 Create your `.env` file

Navigate to `apps/api/` and copy the example:

```bash
cd apps/api
copy .env.example .env
```

Your `.env` already has real credentials filled in (Neon DB, Upstash Redis, Cloudinary, Resend). It should look like this:

```env
NODE_ENV=development
PORT=4000
API_VERSION=v1

DATABASE_URL=postgresql://neondb_owner:npg_CV3jiFJcSD1L@ep-misty-queen-ao67u6yl.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require

JWT_SECRET=ce6786eedf99f1988d979f4c9e9a32519e113adc2565409532c9ffe970812ca1b8c8c6ba3ce18fbed0f8ba7031577ada518d1
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_SECRET=8e0af2749ff6737088e250cc734
REFRESH_TOKEN_EXPIRES_IN=7d

UPSTASH_REDIS_REST_URL=https://emerging-titmouse-144039.upstash.io
UPSTASH_REDIS_REST_TOKEN=ggAAAAAAAjKnAAIgcDGjKwE3wgirqUWeDWQDZ5XEVdG5otgfEHkQilX9dphPNw

CLOUDINARY_CLOUD_NAME=dhobldwor
CLOUDINARY_API_KEY=282942171487935
CLOUDINARY_API_SECRET=6mGpevX8RzffyZSfMVydBoGNbO8

RESEND_API_KEY=re_hWZAZs2R_G7tDrvbBgjh5MM2tUN4zZoWa
EMAIL_FROM=onboarding@resend.dev

FRONTEND_URL=http://localhost:3000
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX=100
```

---

### 1.2 Install dependencies

```bash
cd apps/api
npm install
```

---

### 1.3 Push Prisma schema to Neon database

This creates all tables in your Neon PostgreSQL database:

```bash
npx prisma migrate dev --name init
```

> If you get a migration prompt, type a name like `init` and press Enter.  
> If the DB already has tables and you just want to sync, run:

```bash
npx prisma db push
```

---

### 1.4 Generate Prisma client

```bash
npx prisma generate
```

---

### 1.5 Start the dev server

```bash
npm run dev
```

You should see:

```
🚀 VendorBridge API running on port 4000
📶 Cache: Using Upstash Redis REST Client
```

The API is now live at: **`http://localhost:4000`**

---

### 1.6 Health check (confirm server is running)

Open Postman and send:

```
GET http://localhost:4000/health
```

**Expected response:**
```json
{
  "status": "ok",
  "version": "v1",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

## STEP 2 — Postman Setup

### 2.1 Create a Collection

1. Open Postman → click **New** → **Collection** → name it `VendorBridge API`

### 2.2 Create an Environment

1. Click the **Environments** tab → **New Environment** → name it `VendorBridge Local`
2. Add these variables:

| Variable | Initial Value |
|---|---|
| `BASE_URL` | `http://localhost:4000/api/v1` |
| `ACCESS_TOKEN` | *(leave blank — auto-filled after login)* |
| `REFRESH_TOKEN` | *(leave blank — auto-filled after login)* |
| `ADMIN_TOKEN` | *(leave blank — auto-filled after admin login)* |
| `VENDOR_TOKEN` | *(leave blank — auto-filled after vendor login)* |
| `MANAGER_TOKEN` | *(leave blank — auto-filled after manager login)* |

3. Select this environment from the top-right dropdown in Postman.

### 2.3 Set default headers for all requests

In every request that requires authentication, add this header:

| Key | Value |
|---|---|
| `Content-Type` | `application/json` |
| `Authorization` | `Bearer {{ACCESS_TOKEN}}` |

> **Tip:** Set this at the Collection level → **Authorization** tab → Type: `Bearer Token` → Token: `{{ACCESS_TOKEN}}` — then all requests inherit it.

---

## STEP 3 — AUTH APIs

Base path: `{{BASE_URL}}/auth`

---

### 3.1 Register — Admin User

```
POST {{BASE_URL}}/auth/register
```

**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "name": "Admin User",
  "email": "admin@vendorbridge.com",
  "password": "Admin@1234",
  "role": "ADMIN"
}
```

**Expected Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "clx...",
    "name": "Admin User",
    "email": "admin@vendorbridge.com",
    "role": "ADMIN"
  }
}
```

✅ **DB Check:** Go to [Neon Console](https://console.neon.tech) → your project → **Tables** → `users` table. You should see a new row with `role = ADMIN`.

---

### 3.2 Register — Procurement Officer

```
POST {{BASE_URL}}/auth/register
```

**Body:**
```json
{
  "name": "Procurement Officer",
  "email": "procurement@vendorbridge.com",
  "password": "Procure@1234",
  "role": "PROCUREMENT_OFFICER"
}
```

---

### 3.3 Register — Manager

```
POST {{BASE_URL}}/auth/register
```

**Body:**
```json
{
  "name": "Manager User",
  "email": "manager@vendorbridge.com",
  "password": "Manager@1234",
  "role": "MANAGER"
}
```

---

### 3.4 Register — Vendor User

This automatically creates both a `User` AND a `Vendor` record in the DB.

```
POST {{BASE_URL}}/auth/register
```

**Body:**
```json
{
  "name": "Vendor Contact Person",
  "email": "vendor@acme.com",
  "password": "Vendor@1234",
  "role": "VENDOR",
  "companyName": "ACME Supplies Ltd",
  "contactPerson": "John Smith",
  "phone": "+1-555-0101",
  "address": "123 Supply Street, Mumbai, India"
}
```

**Expected Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "clx...",
    "name": "Vendor Contact Person",
    "email": "vendor@acme.com",
    "role": "VENDOR"
  }
}
```

✅ **DB Check:** Check both `users` table AND `vendors` table. The vendor row should have `status = PENDING`.

---

### 3.5 Login — Admin

```
POST {{BASE_URL}}/auth/login
```

**Body:**
```json
{
  "email": "admin@vendorbridge.com",
  "password": "Admin@1234"
}
```

**Expected Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "clx...",
      "name": "Admin User",
      "email": "admin@vendorbridge.com",
      "role": "ADMIN"
    },
    "accessToken": "eyJ...",
    "refreshToken": "eyJ..."
  }
}
```

**Auto-save the tokens — add this to the Tests tab in Postman:**
```javascript
const res = pm.response.json();
if (res.data?.accessToken) {
  pm.environment.set("ACCESS_TOKEN", res.data.accessToken);
  pm.environment.set("REFRESH_TOKEN", res.data.refreshToken);
  pm.environment.set("ADMIN_TOKEN", res.data.accessToken);
}
```

✅ **DB Check:** Check the `activity_logs` table — you should see a row with `action = LOGIN`.

---

### 3.6 Login — Manager (save MANAGER_TOKEN)

```
POST {{BASE_URL}}/auth/login
```

**Body:**
```json
{
  "email": "manager@vendorbridge.com",
  "password": "Manager@1234"
}
```

**Tests tab:**
```javascript
const res = pm.response.json();
if (res.data?.accessToken) {
  pm.environment.set("MANAGER_TOKEN", res.data.accessToken);
}
```

---

### 3.7 Login — Vendor (save VENDOR_TOKEN)

```
POST {{BASE_URL}}/auth/login
```

**Body:**
```json
{
  "email": "vendor@acme.com",
  "password": "Vendor@1234"
}
```

**Tests tab:**
```javascript
const res = pm.response.json();
if (res.data?.accessToken) {
  pm.environment.set("VENDOR_TOKEN", res.data.accessToken);
}
```

---

### 3.8 Get Current User (Me)

```
GET {{BASE_URL}}/auth/me
```

**Headers:**
```
Authorization: Bearer {{ACCESS_TOKEN}}
```

**Expected Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "clx...",
    "name": "Admin User",
    "email": "admin@vendorbridge.com",
    "role": "ADMIN",
    "isActive": true
  }
}
```

---

### 3.9 Refresh Token

```
POST {{BASE_URL}}/auth/refresh
```

**Body:**
```json
{
  "refreshToken": "{{REFRESH_TOKEN}}"
}
```

**Expected:** New `accessToken` and `refreshToken` pair.

✅ **Redis Check:** The old refresh token key is deleted and a new one is created in Upstash.

---

### 3.10 Forgot Password

```
POST {{BASE_URL}}/auth/forgot-password
```

**Body:**
```json
{
  "email": "admin@vendorbridge.com"
}
```

**Expected (200):** `{ "success": true, "message": "..." }`

✅ **DB Check:** Check `email_logs` table — a row appears with `template = forgot_password`.

---

### 3.11 Logout

```
POST {{BASE_URL}}/auth/logout
```

**Headers:**
```
Authorization: Bearer {{ACCESS_TOKEN}}
```

**Body:**
```json
{
  "refreshToken": "{{REFRESH_TOKEN}}"
}
```

---

## STEP 4 — USERS APIs

> Requires `ADMIN` or `MANAGER` token.

Base path: `{{BASE_URL}}/users`

Switch `ACCESS_TOKEN` to your admin token for this section.

---

### 4.1 List All Users

```
GET {{BASE_URL}}/users
```

**Headers:** `Authorization: Bearer {{ADMIN_TOKEN}}`

**Query params (optional):**
- `?role=VENDOR`
- `?search=John`
- `?page=1&limit=10`

---

### 4.2 Create User (by Admin)

```
POST {{BASE_URL}}/users
```

**Headers:** `Authorization: Bearer {{ADMIN_TOKEN}}`

**Body:**
```json
{
  "name": "Second Officer",
  "email": "officer2@vendorbridge.com",
  "password": "Officer@1234",
  "role": "PROCUREMENT_OFFICER"
}
```

---

### 4.3 Get User by ID

```
GET {{BASE_URL}}/users/:id
```

Replace `:id` with an actual user ID from the previous list response.

---

### 4.4 Update User

```
PUT {{BASE_URL}}/users/:id
```

**Body:**
```json
{
  "name": "Updated Officer Name",
  "isActive": true
}
```

---

### 4.5 Delete User (soft delete)

```
DELETE {{BASE_URL}}/users/:id
```

✅ **DB Check:** The row still exists in `users` table but `deleted_at` is now set to a timestamp.

---

## STEP 5 — VENDOR CATEGORIES

> Admin/Manager only. Do this before testing vendors.

---

### 5.1 Create a Vendor Category

```
POST {{BASE_URL}}/vendors/categories
```

**Headers:** `Authorization: Bearer {{ADMIN_TOKEN}}`

**Body:**
```json
{
  "name": "IT & Technology",
  "description": "Vendors supplying IT hardware, software and services"
}
```

**Save the category `id` from the response — you'll use it in vendor update.**

✅ **DB Check:** Check `vendor_categories` table.

---

### 5.2 List All Categories

```
GET {{BASE_URL}}/vendors/categories/all
```

---

## STEP 6 — VENDORS APIs

Base path: `{{BASE_URL}}/vendors`

---

### 6.1 List All Vendors

```
GET {{BASE_URL}}/vendors
```

**Headers:** `Authorization: Bearer {{ADMIN_TOKEN}}`

**Optional query params:**
- `?status=PENDING`
- `?search=ACME`

---

### 6.2 Get Vendor by ID

```
GET {{BASE_URL}}/vendors/:id
```

Replace `:id` with the vendor ID from the list.

---

### 6.3 Get My Vendor Profile (as Vendor)

```
GET {{BASE_URL}}/vendors/me
```

**Headers:** `Authorization: Bearer {{VENDOR_TOKEN}}`

---

### 6.4 Update Vendor Profile

```
PUT {{BASE_URL}}/vendors/:id
```

**Headers:** `Authorization: Bearer {{VENDOR_TOKEN}}`

**Body:**
```json
{
  "companyName": "ACME Supplies Ltd Updated",
  "phone": "+1-555-9999",
  "website": "https://www.acme.com",
  "taxId": "GST123456789"
}
```

---

### 6.5 Approve Vendor (Admin/Manager only)

This is critical — a vendor must be `APPROVED` before they can submit quotations.

```
PATCH {{BASE_URL}}/vendors/:id/status
```

**Headers:** `Authorization: Bearer {{ADMIN_TOKEN}}`

**Body:**
```json
{
  "status": "APPROVED"
}
```

✅ **DB Check:** Check `vendors` table — the `status` column should now be `APPROVED`.

---

### 6.6 Upload Vendor Document

```
POST {{BASE_URL}}/vendors/:id/documents
```

**Headers:** `Authorization: Bearer {{VENDOR_TOKEN}}`

**Body:** `form-data`
| Key | Value | Type |
|---|---|---|
| `file` | *(select a PDF or image file)* | File |
| `name` | `Business Registration Certificate` | Text |

✅ **DB Check:** Check `vendor_documents` table. Check Cloudinary dashboard — file should be uploaded under `vendors/` folder.

---

## STEP 7 — RFQ APIs

> Creating RFQs requires `ADMIN` or `PROCUREMENT_OFFICER` token.

Base path: `{{BASE_URL}}/rfqs`

---

### 7.1 Create RFQ

```
POST {{BASE_URL}}/rfqs
```

**Headers:** `Authorization: Bearer {{ADMIN_TOKEN}}`

**Body:**
```json
{
  "title": "Office Supplies Q3 2024",
  "description": "We need office supplies for the new office setup including desks, chairs, and stationery.",
  "deadline": "2024-12-31T23:59:00.000Z",
  "items": [
    {
      "description": "Office Desk - Wooden, 4ft",
      "quantity": 10,
      "unit": "pieces"
    },
    {
      "description": "Ergonomic Office Chair",
      "quantity": 10,
      "unit": "pieces"
    },
    {
      "description": "A4 Printing Paper (500 sheets per ream)",
      "quantity": 50,
      "unit": "reams"
    }
  ]
}
```

**Save the RFQ `id` from the response.**

✅ **DB Check:** Check `rfqs` table (status = `DRAFT`) and `rfq_items` table (3 rows linked to the RFQ id).

---

### 7.2 List RFQs

```
GET {{BASE_URL}}/rfqs
```

**Optional query params:**
- `?status=DRAFT`
- `?search=Office`
- `?page=1&limit=10`

---

### 7.3 Get RFQ by ID

```
GET {{BASE_URL}}/rfqs/:rfqId
```

---

### 7.4 Update RFQ

```
PUT {{BASE_URL}}/rfqs/:rfqId
```

**Headers:** `Authorization: Bearer {{ADMIN_TOKEN}}`

**Body:**
```json
{
  "title": "Office Supplies Q3 2024 - Updated",
  "description": "Updated description with more details."
}
```

---

### 7.5 Invite Vendors to RFQ

The vendor must exist and be `APPROVED` first (done in Step 6.5).

```
POST {{BASE_URL}}/rfqs/:rfqId/invite
```

**Headers:** `Authorization: Bearer {{ADMIN_TOKEN}}`

**Body:**
```json
{
  "vendorIds": ["<vendor_id_here>"]
}
```

Replace `<vendor_id_here>` with the vendor ID from Step 6.1.

✅ **DB Check:** Check `rfq_vendors` table — should have a row linking your RFQ to the vendor. Check `notifications` table — the vendor should have a notification of type `RFQ_INVITED`.

---

### 7.6 Publish RFQ

This makes the RFQ visible to invited vendors.

```
POST {{BASE_URL}}/rfqs/:rfqId/publish
```

**Headers:** `Authorization: Bearer {{ADMIN_TOKEN}}`

**No body required.**

✅ **DB Check:** `rfqs.status` should now be `PUBLISHED`.

---

### 7.7 Close RFQ

```
POST {{BASE_URL}}/rfqs/:rfqId/close
```

**Headers:** `Authorization: Bearer {{ADMIN_TOKEN}}`

*(Do this after quotations are submitted — come back to this later)*

---

## STEP 8 — QUOTATION APIs

> Creating quotations requires `VENDOR` token. The vendor must be `APPROVED` and the RFQ must be `PUBLISHED`.

Base path: `{{BASE_URL}}/quotations`

---

### 8.1 Create Quotation (as Vendor)

```
POST {{BASE_URL}}/quotations
```

**Headers:** `Authorization: Bearer {{VENDOR_TOKEN}}`

**Body:**
```json
{
  "rfqId": "<rfq_id_from_step_7.1>",
  "notes": "We can deliver within 2 weeks. Prices are inclusive of GST.",
  "validUntil": "2025-01-15T23:59:00.000Z",
  "items": [
    {
      "description": "Office Desk - Wooden, 4ft",
      "quantity": 10,
      "unitPrice": 150.00
    },
    {
      "description": "Ergonomic Office Chair",
      "quantity": 10,
      "unitPrice": 200.00
    },
    {
      "description": "A4 Printing Paper (500 sheets per ream)",
      "quantity": 50,
      "unitPrice": 5.00
    }
  ]
}
```

**Save the quotation `id` from the response.**

✅ **DB Check:** Check `quotations` table (status = `DRAFT`) and `quotation_items` table (3 rows). `total_amount` should be `(10×150) + (10×200) + (50×5) = 3750.00`.

---

### 8.2 List Quotations

```
GET {{BASE_URL}}/quotations
```

**Optional query params:**
- `?rfqId=<rfq_id>`
- `?status=DRAFT`

---

### 8.3 Get Quotation by ID

```
GET {{BASE_URL}}/quotations/:quotationId
```

---

### 8.4 Submit Quotation (change status to SUBMITTED)

```
PUT {{BASE_URL}}/quotations/:quotationId
```

**Headers:** `Authorization: Bearer {{VENDOR_TOKEN}}`

**Body:**
```json
{
  "status": "SUBMITTED"
}
```

✅ **DB Check:**
- `quotations.status` → `SUBMITTED`
- `rfqs.status` → `EVALUATING` (auto-updated)
- `notifications` table → procurement officer gets a `QUOTATION_RECEIVED` notification

---

### 8.5 Compare Quotations for an RFQ

This returns a matrix comparing all vendor bids per line item.

```
GET {{BASE_URL}}/quotations/compare/rfq/:rfqId
```

**Headers:** `Authorization: Bearer {{ADMIN_TOKEN}}`

> **Note:** This works best after inviting a second vendor and having them submit a quotation too. Repeat steps 3.4, 3.7, 6.5, and 8.1–8.4 for a second vendor.

---

## STEP 9 — APPROVAL APIs

> Starting workflow requires `ADMIN` or `PROCUREMENT_OFFICER`. Taking action requires `ADMIN` or `MANAGER`.

Base path: `{{BASE_URL}}/approvals`

The quotation must be in `SUBMITTED` status first.

---

### 9.1 Start Approval Workflow

You need the Manager's user ID. Get it from `GET {{BASE_URL}}/users` with your admin token first.

```
POST {{BASE_URL}}/approvals
```

**Headers:** `Authorization: Bearer {{ADMIN_TOKEN}}`

**Body:**
```json
{
  "quotationId": "<quotation_id_from_step_8.1>",
  "steps": [
    {
      "stepNumber": 1,
      "approverId": "<manager_user_id>",
      "dueDate": "2025-01-20T23:59:00.000Z"
    }
  ]
}
```

**Save the workflow `id` from the response.**

✅ **DB Check:**
- `approval_workflows` table → status = `PENDING`, current_step = `1`
- `approval_steps` table → 1 row
- `notifications` table → manager gets an `APPROVAL_REQUIRED` notification
- `quotations.status` → `UNDER_REVIEW`

---

### 9.2 List Pending Approvals (as Manager)

```
GET {{BASE_URL}}/approvals/pending
```

**Headers:** `Authorization: Bearer {{MANAGER_TOKEN}}`

---

### 9.3 Get Workflow by ID

```
GET {{BASE_URL}}/approvals/:workflowId
```

---

### 9.4 Get Workflow by Quotation ID

```
GET {{BASE_URL}}/approvals/quotation/:quotationId
```

---

### 9.5 Take Approval Action — APPROVE (as Manager)

This is the critical step. Final approval triggers auto-generation of a Purchase Order!

```
POST {{BASE_URL}}/approvals/:workflowId/action
```

**Headers:** `Authorization: Bearer {{MANAGER_TOKEN}}`

**Body:**
```json
{
  "action": "APPROVED",
  "comment": "Prices look good, approved for purchase."
}
```

✅ **DB Check (after approval):**
- `approval_workflows.status` → `APPROVED`
- `approval_steps.status` → `APPROVED`
- `approval_actions` table → 1 row with `action = APPROVED`
- `quotations.status` → `ACCEPTED`
- `purchase_orders` table → **Auto-generated PO** with number like `PO-2024-0001`
- `po_items` table → items copied from quotation
- `notifications` table → vendor gets `PO_GENERATED` notification
- `email_logs` table → vendor email logged
- Cloudinary → PDF uploaded under `pos/` folder

---

### 9.6 Take Approval Action — REJECT

```
POST {{BASE_URL}}/approvals/:workflowId/action
```

**Headers:** `Authorization: Bearer {{MANAGER_TOKEN}}`

**Body:**
```json
{
  "action": "REJECTED",
  "comment": "Prices are too high. Please resubmit with better pricing."
}
```

✅ **DB Check:** `quotations.status` → `REJECTED`, vendor gets `APPROVAL_DONE` notification.

---

### 9.7 Take Approval Action — REQUEST REVISION

```
POST {{BASE_URL}}/approvals/:workflowId/action
```

**Body:**
```json
{
  "action": "REVISION_REQUESTED",
  "comment": "Please provide better terms for payment and reduce delivery time."
}
```

✅ **DB Check:** `quotations.status` → back to `DRAFT`.

---

## STEP 10 — PURCHASE ORDER APIs

> PO is usually auto-generated after final approval. You can also manually trigger generation.

Base path: `{{BASE_URL}}/purchase-orders`

---

### 10.1 List Purchase Orders

```
GET {{BASE_URL}}/purchase-orders
```

**Headers:** `Authorization: Bearer {{ADMIN_TOKEN}}`

**Optional query params:**
- `?status=APPROVED`
- `?poNumber=PO-2024`

---

### 10.2 Get PO by ID

```
GET {{BASE_URL}}/purchase-orders/:poId
```

The response includes the PDF URL (`pdfUrl` field) — open it in browser to see the generated PDF.

---

### 10.3 Manually Generate PO (if auto-generation skipped)

```
POST {{BASE_URL}}/purchase-orders/generate
```

**Headers:** `Authorization: Bearer {{ADMIN_TOKEN}}`

**Body:**
```json
{
  "quotationId": "<quotation_id>"
}
```

> Only works if quotation status is `ACCEPTED`.

---

### 10.4 Update PO Status

```
PUT {{BASE_URL}}/purchase-orders/:poId
```

**Headers:** `Authorization: Bearer {{ADMIN_TOKEN}}`

**Body — Send PO to Vendor:**
```json
{
  "status": "SENT"
}
```

**Body — Vendor Acknowledges (use VENDOR_TOKEN):**
```json
{
  "status": "ACKNOWLEDGED"
}
```

**Body — Mark as Completed:**
```json
{
  "status": "COMPLETED",
  "deliveryDate": "2025-02-01T00:00:00.000Z",
  "terms": "Net 30 payment terms. FOB Destination."
}
```

✅ **DB Check:** `purchase_orders.status` updates accordingly.

---

## STEP 11 — INVOICE APIs

> Vendors generate invoices. Procurement team records payment.

Base path: `{{BASE_URL}}/invoices`

The PO must be in `APPROVED` or `SENT` status.

---

### 11.1 Generate Invoice (as Vendor)

```
POST {{BASE_URL}}/invoices/generate
```

**Headers:** `Authorization: Bearer {{VENDOR_TOKEN}}`

**Body:**
```json
{
  "poId": "<po_id_from_step_10.2>",
  "dueDate": "2025-02-28T23:59:00.000Z"
}
```

**Save the invoice `id` from the response.**

✅ **DB Check:**
- `invoices` table → new row, `invoice_number` like `INV-2024-0001`
- `invoice_items` table → items copied from PO
- `notifications` table → procurement officer gets `INVOICE_SENT` notification
- `email_logs` table → invoice email logged to procurement officer
- Cloudinary → invoice PDF uploaded under `invoices/` folder

---

### 11.2 List Invoices

```
GET {{BASE_URL}}/invoices
```

**Optional query params:**
- `?status=PENDING`
- `?invoiceNumber=INV-2024`

---

### 11.3 Get Invoice by ID

```
GET {{BASE_URL}}/invoices/:invoiceId
```

The `pdfUrl` field in the response is a direct link to the invoice PDF.

---

### 11.4 Update Invoice Status

```
PUT {{BASE_URL}}/invoices/:invoiceId
```

**Headers:** `Authorization: Bearer {{ADMIN_TOKEN}}`

**Body — Approve Invoice:**
```json
{
  "status": "APPROVED"
}
```

---

### 11.5 Record Payment

```
POST {{BASE_URL}}/invoices/:invoiceId/pay
```

**Headers:** `Authorization: Bearer {{ADMIN_TOKEN}}`

**Body:**
```json
{
  "amount": 3750.00,
  "method": "Bank Transfer",
  "reference": "TXN-20240601-001"
}
```

✅ **DB Check:**
- `payments` table → new payment row
- `notifications` table → vendor gets `PAYMENT_RECEIVED` notification
- `email_logs` table → payment email logged to vendor

---

## STEP 12 — NOTIFICATIONS APIs

Base path: `{{BASE_URL}}/notifications`

---

### 12.1 List My Notifications

```
GET {{BASE_URL}}/notifications
```

**Headers:** `Authorization: Bearer {{VENDOR_TOKEN}}`

**Optional query params:**
- `?page=1&limit=20`

---

### 12.2 Get Unread Count

```
GET {{BASE_URL}}/notifications/unread-count
```

**Expected Response:**
```json
{
  "success": true,
  "data": { "count": 3 }
}
```

---

### 12.3 Mark Single Notification as Read

```
PATCH {{BASE_URL}}/notifications/:notificationId/read
```

✅ **DB Check:** `notifications.is_read` → `true`

---

### 12.4 Mark All Notifications as Read

```
POST {{BASE_URL}}/notifications/read-all
```

✅ **DB Check:** All notification rows for this user → `is_read = true`

---

## STEP 13 — REPORTS APIs

> Admin and Manager access only.

Base path: `{{BASE_URL}}/reports`

---

### 13.1 Procurement Summary Report

Returns: monthly spend by vendor, RFQ response rates, PO/invoice status breakdown.

```
GET {{BASE_URL}}/reports/summary
```

**Headers:** `Authorization: Bearer {{ADMIN_TOKEN}}`

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "spendByVendor": [...],
    "rfqResponseRates": [...],
    "poInvoiceSummary": {
      "po": [{ "status": "APPROVED", "count": 1, "totalAmount": 3750 }],
      "invoice": [{ "status": "PENDING", "count": 1, "totalAmount": 3750 }]
    }
  }
}
```

---

### 13.2 Audit Logs

```
GET {{BASE_URL}}/reports/audit-logs
```

**Headers:** `Authorization: Bearer {{ADMIN_TOKEN}}`

**Optional query params:**
- `?search=LOGIN`
- `?search=GENERATE_PO`
- `?page=1&limit=20`

---

## STEP 14 — Verify Neon Database

### Method 1 — Prisma Studio (Recommended, Visual)

```bash
cd apps/api
npx prisma studio
```

This opens a browser at `http://localhost:5555` with a visual table browser. You can click on any model (User, Vendor, RFQ, etc.) and see all rows.

### Method 2 — Neon Console (Online)

1. Go to [console.neon.tech](https://console.neon.tech)
2. Open your project → **SQL Editor**
3. Run these queries to verify data:

```sql
-- Check all users
SELECT id, name, email, role, is_active, created_at FROM users ORDER BY created_at DESC;

-- Check vendors and their status
SELECT v.id, u.name, v.company_name, v.status FROM vendors v JOIN users u ON v.user_id = u.id;

-- Check RFQs and their items
SELECT r.id, r.title, r.status, COUNT(ri.id) as item_count
FROM rfqs r LEFT JOIN rfq_items ri ON r.id = ri.rfq_id
GROUP BY r.id, r.title, r.status;

-- Check quotations
SELECT q.id, q.status, q.total_amount, u.name as vendor_name
FROM quotations q
JOIN vendors v ON q.vendor_id = v.id
JOIN users u ON v.user_id = u.id;

-- Check approval workflows
SELECT aw.id, aw.status, aw.current_step, aw.total_steps FROM approval_workflows aw;

-- Check auto-generated purchase orders
SELECT po.id, po.po_number, po.status, po.total_amount, po.pdf_url
FROM purchase_orders po ORDER BY po.created_at DESC;

-- Check invoices
SELECT i.id, i.invoice_number, i.status, i.total_amount, i.due_date
FROM invoices i ORDER BY i.created_at DESC;

-- Check payments
SELECT p.id, p.amount, p.method, p.reference, p.paid_at FROM payments p;

-- Check notifications by type
SELECT type, COUNT(*) as count FROM notifications GROUP BY type;

-- Check activity log (audit trail)
SELECT al.action, al.entity, u.name, al.created_at
FROM activity_logs al JOIN users u ON al.user_id = u.id
ORDER BY al.created_at DESC LIMIT 20;

-- Check email logs
SELECT to, subject, template, status, sent_at FROM email_logs ORDER BY sent_at DESC;
```

---

## STEP 15 — Full End-to-End Flow Summary

Follow this order for the complete happy path:

```
1.  Register ADMIN             → POST /auth/register (role: ADMIN)
2.  Register MANAGER           → POST /auth/register (role: MANAGER)
3.  Register PROCUREMENT       → POST /auth/register (role: PROCUREMENT_OFFICER)
4.  Register VENDOR            → POST /auth/register (role: VENDOR + company details)
5.  Login ADMIN                → POST /auth/login → save ADMIN_TOKEN
6.  Login MANAGER              → POST /auth/login → save MANAGER_TOKEN
7.  Login VENDOR               → POST /auth/login → save VENDOR_TOKEN
8.  Approve Vendor             → PATCH /vendors/:id/status { status: APPROVED }
9.  Create RFQ                 → POST /rfqs (admin token)
10. Invite Vendor to RFQ       → POST /rfqs/:id/invite
11. Publish RFQ                → POST /rfqs/:id/publish
12. Create Quotation           → POST /quotations (vendor token)
13. Submit Quotation           → PUT /quotations/:id { status: SUBMITTED }
14. Start Approval Workflow    → POST /approvals (admin token, manager as approver)
15. Approve Quotation          → POST /approvals/:id/action { action: APPROVED } (manager token)
    ↳ PO auto-generated ✅
16. Check PO                   → GET /purchase-orders (check pdf_url)
17. Send PO to Vendor          → PUT /purchase-orders/:id { status: SENT }
18. Generate Invoice           → POST /invoices/generate (vendor token)
19. Record Payment             → POST /invoices/:id/pay (admin token)
20. Check Reports              → GET /reports/summary
21. View Audit Log             → GET /reports/audit-logs
22. Verify in Neon DB          → npx prisma studio  OR  Neon Console SQL Editor
```

---

## Common Errors & Fixes

| Error | Cause | Fix |
|---|---|---|
| `401 No token provided` | Missing Authorization header | Add `Bearer {{ACCESS_TOKEN}}` header |
| `403 You do not have permission` | Wrong role for endpoint | Use the correct token (admin/manager/vendor) |
| `404 Quotation not found` | Wrong ID | Copy exact ID from create response |
| `422 Quotation must be in SUBMITTED state` | Quotation not submitted yet | Run Step 8.4 first |
| `422 Vendor must be APPROVED` | Vendor still in PENDING state | Run Step 6.5 first |
| `422 RFQ must be PUBLISHED` | RFQ still in DRAFT state | Run Step 7.6 first |
| `409 Conflict` | Duplicate email on register | Use a different email |
| `500 DATABASE_URL not set` | Missing .env file | Copy `.env.example` to `.env` |
| `P2002 Prisma unique constraint` | Duplicate PO/invoice for same quotation | PO already exists for this quotation |
