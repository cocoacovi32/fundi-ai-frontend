# Fundi AI React frontend

A mobile-first React frontend built with Vite. It includes Home, Diagnosis, Result, Repair Shops and History views, English/Kiswahili labels, browser speech-to-text, local history (last 10 diagnoses), and print-to-PDF.

## Requirements
- Node.js 18 or newer
- npm

## Run locally
```bash
npm install
npm run dev
```
Open the local URL printed by Vite (normally http://localhost:5173).

## Production build
```bash
npm run build
npm run preview
```

## Backend API contract

The frontend uses same-origin endpoints by default. Set `API_BASE` near the top of `src/App.jsx` if your backend runs on a different origin. Your backend must enable CORS for the frontend origin when using a separate origin.

### POST /api/diagnose
Request JSON:
```json
{
  "device": "phone",
  "symptom": "Phone gets hot and battery drains quickly",
  "language": "en"
}
```

Accepted response shapes include an array of diagnoses or an object containing `faults`, `top_faults`, or `results`. Each result can contain:
```json
{
  "title": "Battery degradation",
  "description": "The battery may have reduced capacity.",
  "confidence": 0.87,
  "risk_level": "medium",
  "fix_steps": ["Check battery usage", "Visit a qualified technician"],
  "estimated_cost": "1500–3500",
  "currency": "KES"
}
```
Confidence can be a fraction from 0 to 1 or a percentage from 0 to 100. It is displayed as supplied, not artificially adjusted. Missing confidence is shown as not provided.

### GET /api/shops
Accepted response shapes include an array or an object containing `shops` or `results`. Shop fields:
```json
{
  "id": 1,
  "name": "Example Repair Centre",
  "address": "Nairobi",
  "rating": 4.5,
  "price_range": "KES 1,000–3,000",
  "booking_url": "https://example.com/book"
}
```

Only HTTP, HTTPS, telephone and email links are accepted for shop contact links.

## Notes
- The frontend does not connect directly to a database. Your backend owns database access.
- Speech recognition depends on browser support and typically requires HTTPS or localhost permission.
- The PDF feature uses the browser print dialog; choose “Save as PDF”.
- Replace the sample endpoint paths or response mapping in `src/App.jsx` if your backend contract differs.


## Modern animated UI update

The home page now includes a Fundi AI technician illustration in `public/assets/fundi-technician.png`. Page content uses subtle entrance animation and distinct page accent colours. Existing Firebase and API logic is retained.

## Frontend-only Premium update

- Added a Premium navigation page with Free and KSh 499/month plan previews.
- Plan selection is UI-only; no payment gateway, subscription service, or backend was added.
- Added interactive checkboxes and progress counts for suggested repair steps.
- Normalized estimated diagnosis costs to display in KSh where possible.
- Added the exact #1A1A1A dark-grey theme token.
