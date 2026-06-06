# VendorBridge — Project Documentation

This folder contains key reference documents for the project.

## Files

| File | Source | Description |
|------|--------|-------------|
| `problem-statement.pdf` | **Odoo Hackathon** (official) | Original problem statement provided by Odoo. This is the **source of truth** for all requirements. |
| `vendorbridge-architecture.html` | Claude AI (generated) | Visual system architecture document — open in any browser. Covers High-Level Architecture, DB Design, API flow, Auth flow, Deployment. |

## How to View Architecture

```bash
# Just open in browser
start docs/vendorbridge-architecture.html
```

Or double-click `vendorbridge-architecture.html` in your file explorer.

## Important Notes

- **Do NOT modify** `problem-statement.pdf` — it is the official Odoo document
- The architecture HTML is a **reference only** — actual implementation may evolve
- All development decisions should align with `problem-statement.pdf`
