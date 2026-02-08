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

## Notes

- The mock API responds instantly, so a minimum loading delay is intentionally added
  to make loading states more perceptible and closer to real-world behavior.
