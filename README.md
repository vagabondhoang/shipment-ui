# Shipment Management UI

A React application to manage and view shipment containers,
built as a take-home assignment(Jitsu Viet Nam).

## Tech Stack

- React + TypeScript
- Vite
- Vitest + testing-library/react
- json-server (mock API)

## Features

- Search shipments by client or container label (with debounce)
- Filter shipments by status (Open / In Transit / Delivered)
- Pagination with “Load more”
- Shipment details panel
- Status update with confirmation dialog
- Optimistic UI update with rollback on API failure
- Unit tests for some components and API layer
- **Filter & search state persistence via URL query parameters**

## Running the project

**_You can see script command on package.json file_**

### 1. Install dependencies

````bash
    npm install
If you encounter dependency issues, you can clean the npm cache and reinstall:
```bash
    npm cache clean --force
    npm install
### 2. Generate mock data
```bash
    npm run generate:data
### 3. Start mock api server
    npm run mock:api
⚠️ Important:
Make sure the mock API server is running before starting the frontend.
### 4. Start the frontend application
    npm run dev

    Open the app in your browser
    http://localhost:5173/
### 5. (Optional) Run tests
npm run test
## Project Structure (Key Files)

src/
├── api/
│ └── shipments.api.ts # API layer
├── hooks/
│ ├── useShipments.ts # Core business logic
│ └── useDebounce.ts
├── components/
│ ├── shipments/
│ │ ├── ShipmentList.tsx
│ │ ├── ShipmentDetailsPanel.tsx
│ │ └── **test**/
│ └── common/
│ └── ConfirmDialog.tsx
├── utils/
│ ├── ensureMinDelay.ts
│ └── query.ts
├── constants/
│ └── shipmentStatus.ts
└── test/
└── setup.ts
````

## Notes & Assumptions

### Responsive Design

This implementation focuses primarily on desktop usage, which aligns with the expected workflow of managing shipment data in a data-heavy interface.

Responsive behavior (mobile / tablet layouts) is not fully covered in this submission.  
For the best review experience, please view the application on a desktop screen.

### Date & Time Handling

Dates are currently formatted using the native JavaScript `Date` API for simplicity.

In a real production system, date and time handling would require:

- Explicit timezone awareness (e.g. user locale vs. server timezone)
- A dedicated date library (e.g. `dayjs`, `date-fns`, or `luxon`)
- Clear contracts from the backend regarding timezone and format

This was intentionally kept minimal to focus on application state, data flow, and UI behavior.

### Loading behavior

- The mock API responds instantly, so a minimum loading delay is intentionally added
  to make loading states more perceptible and closer to real-world behavior.

### Assignment Status

- Assignment status is derived from shipment statuses.
  When a shipment changes assignment, both the previous and the new assignment are recalculated to ensure consistency.
  In a real system, this logic would be handled transactionally in the backend.
- We have 3 cases below:
  Invariant A

Assignment DELIVERED
→ all shipments must be DELIVERED

Invariant B

Assignment OPEN
→ all shipments must be OPEN

Invariant C

Assignment IN_TRANSIT
→ exists at least one shipment IN_TRANSIT or DELIVERED
→ but not all DELIVERED
