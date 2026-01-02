# PayGuard Employee Experience - Complete Documentation

**Version:** 1.0  
**Last Updated:** January 2, 2026  
**Purpose:** Reference documentation for the Employee workflow - NO CODE CHANGES

---

## Table of Contents

1. [Navigation Diagram](#a-navigation-diagram)
2. [Route Table](#b-route-table)
3. [Page → TSX Ownership Map](#c-page--tsx-ownership-map)
4. [Interaction Map](#d-interaction-map)
5. [Data Model Reference](#e-data-model-reference)
6. [Implementation Guidelines](#f-implementation-guidelines)

---

## A) Navigation Diagram

### Overview
The Employee experience is a state-based single-page application managed by `EmployeeDashboardPage.tsx`. Navigation between pages is handled through React state changes, not traditional routing. The workflow centers around two main features: submitting pay check requests and chatting with the Award Assistant.

### Navigation Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        Landing Page                              │
│                       (Not in scope)                             │
└──────────────────────────────┬──────────────────────────────────┘
                               │
                    Sign In → Select User Type
                               │
                    Login as "Employee"
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                   EMPLOYEE DASHBOARD                             │
│  File: EmployeeDashboardPage.tsx                                │
│  State: Default view                                             │
│                                                                   │
│  User Profile: Ava Nguyen                                        │
│  • BrightSteps Early Learning                                    │
│  • Casual Educator                                               │
│                                                                   │
│  Latest Result Card (if exists):                                 │
│  • Pay period: 01–14 Aug 2025                                   │
│  • Paid: $540 | Entitled: $612                                   │
│  • Status: Underpaid -$72                                        │
│                                                                   │
│  Recent Requests Table:                                          │
│  • REQ-2025-003: Underpaid -$72                                 │
│  • REQ-2025-002: OK                                              │
│  • REQ-2025-001: OK                                              │
│                                                                   │
│  Agent Activity Log (right sidebar):                             │
│  • Recent AI agents that processed checks                        │
│                                                                   │
│  Award Assistant Chat (embedded):                                │
│  • Inline chat interface with suggested questions                │
│  • Upload Supporting Document button                             │
│                                                                   │
│  Actions Available:                                              │
│  [New Pay Check Request] → Pay Check Wizard (5 steps)           │
│  [Chat with Award Assistant] → Full Award Chat Page              │
│  Request row click → Request Detail Page (4 tabs)                │
│  [Upload Supporting Document] → Document Upload Modal            │
└──────────────────────────┬──────────────────┬──────────────────┘
                           │                   │
        ┌──────────────────┴────┐             │
        │                       │             │
        ▼                       ▼             ▼
┌──────────────┐   ┌───────────────┐   ┌─────────────┐
│ PAY CHECK    │   │ REQUEST       │   │ AWARD CHAT  │
│ WIZARD       │   │ DETAIL        │   │ PAGE        │
│ (5 steps)    │   │ (4 tabs)      │   │ (Full       │
│              │   │               │   │  screen)    │
│ 1. Meta      │   │ • Summary     │   │             │
│    Details   │   │ • Calculation │   │ RAG-powered │
│ 2. Upload    │   │ • Evidence    │   │ Q&A about   │
│    Documents │   │ • Timeline    │   │ award       │
│ 3. Review    │   │               │   │ entitlement │
│    Extracted │   └───────────────┘   │             │
│ 4. Run       │                       │ + Document  │
│    Agentic   │                       │   Upload    │
│    Check     │                       │   Modal     │
│ 5. Results   │                       └─────────────┘
│    (4 tabs)  │
└──────────────┘
```

### Entry Points from Dashboard

| Button/Link | Target View | State Change | Handler |
|-------------|-------------|--------------|---------|
| "New Pay Check Request" (header button) | Pay Check Wizard | `setShowWizard(true)` | Opens wizard modal |
| "Chat with Award Assistant" (header button) | Award Chat Page | `setShowAwardChat(true)` | Full page navigation |
| Request table row click | Request Detail Page | `setViewingRequestId(id)` | Navigate to detail |
| "View Full Details" link | Request Detail Page | `setViewingRequestId(id)` | Same as row click |
| "Upload Supporting Document" (in chat) | Document Upload Modal | Opens modal overlay | File upload flow |
| Suggested question click | (Inline action) | Sends message to chat | Populates and submits message |

### Back Navigation Patterns

| From Page | Back Button → Target | Handler |
|-----------|---------------------|---------|
| Pay Check Wizard | Dashboard | `onClose()` closes modal |
| Request Detail Page | Dashboard | `onBack()` sets `viewingRequestId` to null |
| Award Chat Page | Dashboard | `onBack()` sets `showAwardChat` to false |
| Document Upload Modal | Award Chat | `onClose()` closes modal |

### Modal Flows

**Pay Check Wizard** (Modal overlay)
- Trigger: "New Pay Check Request" button
- Display: Full-screen modal with 5-step wizard
- Steps: Meta Details → Upload → Review → Processing → Results
- Navigation: Linear progression, can jump back to previous steps
- Exit: Close button or "Done" on final step

**Document Upload Modal** (Modal overlay)
- Trigger: "Upload Supporting Document" button in Award Chat
- Display: File upload interface with drag-and-drop
- Actions: Browse files, drag/drop, upload, cancel
- Exit: Close button (X), Cancel button, or click outside modal

**Request Detail Page** (Full page replacement)
- Trigger: Click any request row in dashboard table
- Display: 4-tab detailed view of single request
- Tabs: Summary, Calculation Details, Evidence, Timeline
- Exit: Back button returns to dashboard

---

## B) Route Table

**Note:** The application uses React state-based navigation, NOT URL-based routing. The "routes" below are conceptual paths representing different application states.

| State Value | Page Name | Purpose | Required Params | Conceptual URL (if routed) |
|-------------|-----------|---------|-----------------|----------------------------|
| Default (base) | Employee Dashboard | Main overview with recent checks | None | `/employee` |
| `showWizard=true` | Pay Check Wizard | 5-step flow to submit new request | None | `/employee/check/new` |
| `viewingRequestId={id}` | Request Detail | Detailed view of single request | `requestId` (required) | `/employee/check/{id}` |
| `showAwardChat=true` | Award Chat Page | Full-screen RAG-powered Q&A | None | `/employee/assistant` |
| Modal state | Document Upload Modal | Upload contract/docs for chat | None | (Modal overlay) |

### State Management

**Current implementation:**
```typescript
// In EmployeeDashboardPage.tsx
const [showWizard, setShowWizard] = useState(false);
const [viewingRequestId, setViewingRequestId] = useState<string | null>(null);
const [showAwardChat, setShowAwardChat] = useState(false);
```

**Rendering logic:**
```typescript
if (showAwardChat) return <AwardChatPage onBack={() => setShowAwardChat(false)} />;
if (viewingRequestId) return <RequestDetailPage requestId={viewingRequestId} onBack={...} />;
if (showWizard) return <PayCheckWizard modal overlay />;
return <Dashboard />;
```

**To convert to URL routing (future):**
- Use React Router or Next.js App Router
- Map each state to a URL path
- Pass `requestId` as URL parameter: `/employee/check/:id`
- Enable browser back/forward navigation
- Enable direct linking to specific requests
- Preserve wizard state in URL query params

---

## C) Page → TSX Ownership Map

### Primary Components

| Page/View | TSX File | Purpose | Props Interface |
|-----------|----------|---------|-----------------|
| **Main Page** | `/components/dashboards/EmployeeDashboardPage.tsx` | State orchestrator, renders all views | `{ onLogout: () => void }` |
| **Dashboard (old)** | `/components/dashboards/EmployeeDashboard.tsx` | Legacy component (may not be used) | N/A |
| **Pay Check Wizard** | `/components/employee/PayCheckWizard.tsx` | 5-step modal wizard for new check | `{ onClose: () => void }` |
| **Request Detail** | `/components/employee/RequestDetailPage.tsx` | 4-tab detailed request view | `{ requestId: string; onBack: () => void }` |
| **Award Chat Page** | `/components/employee/AwardChatPage.tsx` | Full-screen chat with RAG assistant | `{ onBack?: () => void }` |
| **Document Upload Modal** | `/components/employee/DocumentUploadModal.tsx` | Upload contract for chat context | `{ onClose: () => void; onUpload: (fileName: string) => void }` |
| **Award Pack Setup Modal** | `/components/employee/AwardPackSetupModal.tsx` | Configure award context (may be deprecated) | Props defined in file |
| **Knowledge Base Building** | `/components/employee/KnowledgeBaseBuildingScreen.tsx` | Loading screen for RAG setup (may be deprecated) | Props defined in file |

### Wizard Step Components (5 Steps)

| Step | TSX File | Purpose | Props Interface |
|------|----------|---------|-----------------|
| **Step 1** | `/components/employee/wizard-steps/MetaDetailsStep.tsx` | Collect job/period metadata | `{ data: WizardData; onNext: (data) => void; onCancel: () => void }` |
| **Step 2** | `/components/employee/wizard-steps/UploadDocumentsStep.tsx` | Upload contract, timesheet, payslip | `{ data: WizardData; onNext: (data) => void; onBack: () => void }` |
| **Step 3** | `/components/employee/wizard-steps/ReviewExtractedStep.tsx` | Review AI-extracted data | `{ data: WizardData; onNext: (data) => void; onBack: () => void }` |
| **Step 4** | `/components/employee/wizard-steps/RunAgenticCheckStep.tsx` | Live AI processing with 10 agents | `{ data: WizardData; onNext: (data) => void }` |
| **Step 5** | `/components/employee/wizard-steps/ResultsStep.tsx` | Final results with 4 tabs | `{ data: WizardData; onClose: () => void }` |

### Shared Components (Design System)

| Component | File | Purpose | Used By |
|-----------|------|---------|---------|
| **StatusBadge** | `/components/design-system/StatusBadge.tsx` | Done/Running/Pending/Failed badges | Agent status, timeline |
| **SeverityBadge** | `/components/design-system/SeverityBadge.tsx` | OK/Underpaid/Needs Review status | Payment status |
| **AnomalyScorePill** | `/components/design-system/AnomalyScorePill.tsx` | 0-100 confidence score display | Results, detail pages |
| **PageHeader** | `/components/design-system/PageHeader.tsx` | Page title + actions | Dashboard, detail pages |
| **ProgressStepper** | `/components/design-system/ProgressStepper.tsx` | Visual step indicator | Wizard left sidebar |
| **EmptyState** | `/components/design-system/EmptyState.tsx` | No data message | Dashboard if no requests |
| **Card** | `/components/ui/card.tsx` | Card container (shadcn/ui) | All pages |
| **Table** | `/components/ui/table.tsx` | Data table (shadcn/ui) | Dashboard, detail pages |
| **Tabs** | `/components/ui/tabs.tsx` | Tab navigation | Detail pages, wizard results |
| **Button** | `/components/ui/button.tsx` | All buttons | Everywhere |
| **Input** | `/components/ui/input.tsx` | Text input | Chat, forms |
| **Progress** | `/components/ui/progress.tsx` | Progress bar | Agent processing |

### Layout Components

| Component | File | Purpose |
|-----------|------|---------|
| **EmployeeDashboardShell** | `/components/shells/EmployeeDashboardShell.tsx` | Sidebar + top bar wrapper (not used by all pages) |

**Note:** `EmployeeDashboardPage.tsx` implements its own top navigation bar directly in the file, not using the shell wrapper, for a cleaner focused experience.

### Sample Data Location

All pages currently use **inline sample data** defined as constants within each component file:

- `EmployeeDashboardPage.tsx`: Lines 18-71 (`latestResult`, `requests`, `agentActivity`)
- `RequestDetailPage.tsx`: Lines 54-200+ (`requestDataMap` with multiple sample requests)
- `AwardChatPage.tsx`: Lines 35-48 (initial messages, suggested prompts)
- Wizard steps: Each step has sample extracted data

**To wire to real data:**
- Move sample data to `/data/sampleData.ts` for development
- Replace with API calls: `fetchMyRequests()`, `fetchRequestDetail(id)`, etc.
- Add loading/error states
- Implement data fetching hooks or services

---

## D) Interaction Map ("What Runs When I Click")

### Employee Dashboard (EmployeeDashboardPage.tsx)

#### 1. "New Pay Check Request" Button (Top-right header)
- **Label:** "New Pay Check Request"
- **Location:** Page header, right side (with Upload icon)
- **Current behavior:** Opens Pay Check Wizard modal
- **Intended behavior:** Same as current
- **Action type:** Modal open
- **Handler:** `onClick={() => setShowWizard(true)}`
- **Data:** None
- **UI update:** Full-screen modal overlay with wizard
- **Loading state:** N/A
- **What changes:** Modal appears over dashboard

#### 2. "Chat with Award Assistant" Button (Top-right header)
- **Label:** "Chat with Award Assistant"
- **Location:** Page header, left of New Request button
- **Current behavior:** Navigates to full-screen Award Chat page
- **Intended behavior:** Same as current
- **Action type:** Page navigation
- **Handler:** `onClick={() => setShowAwardChat(true)}`
- **Data:** None
- **UI update:** Full page change to Award Chat
- **Loading state:** N/A

#### 3. Latest Result Card - "View Full Details" Link
- **Label:** "View Full Details →"
- **Location:** Inside "Latest Result" card (if request exists)
- **Current behavior:** Opens Request Detail page
- **Intended behavior:** Navigate to detailed 4-tab view
- **Action type:** Navigation
- **Handler:** `onClick={() => setViewingRequestId(latestResult.requestId)}`
- **Data:** Request ID from latest result
- **UI update:** Full page change to Request Detail

#### 4. Request Table Row Click
- **Label:** Any row in "Recent Requests" table
- **Location:** Main content area, below latest result card
- **Current behavior:** Opens Request Detail page
- **Intended behavior:** Same as current
- **Action type:** Navigation
- **Handler:** `onClick={() => setViewingRequestId(request.id)}` on `<TableRow>`
- **Data:** Request ID from clicked row
- **UI update:** Full page change to Request Detail
- **Styling:** Rows have `cursor-pointer hover:bg-muted` classes

#### 5. Embedded Chat - Suggested Question Click
- **Label:** Suggested questions (e.g., "What are my entitlements for evening shifts?")
- **Location:** Embedded chat section, right sidebar
- **Current behavior:** Populates chat input and sends message
- **Intended behavior:** Same as current
- **Action type:** Chat interaction
- **Handler:** `handleQuestionClick(question)` → Sets input value → `handleSendMessage()`
- **Data:** Pre-defined question string
- **UI update:** Message appears in chat, AI response generated
- **Loading state:** Brief delay (800ms) simulating AI thinking

#### 6. Embedded Chat - Send Message Button
- **Label:** Send icon button (paper plane)
- **Location:** Chat input area, right side
- **Current behavior:** Sends user message, generates AI response
- **Intended behavior:** Send to RAG API, get real AI response
- **Action type:** API call (future)
- **Handler:** `handleSendMessage()`
- **Current implementation:**
  - Adds user message to `chatMessages` state
  - Uses `getAIResponse()` function with keyword matching
  - Simulates 800ms delay with `setTimeout`
  - Adds AI response to messages
- **Intended implementation:**
  - Call API: `POST /api/chat/message`
  - Request: `{ message: string, context?: contractData }`
  - Response: `{ response: string, citations: [] }`
  - Stream response for real-time typing effect
- **Data read:** `chatMessage` input state
- **Data write:** `chatMessages` array state
- **Loading state:** Show "typing..." indicator while waiting

#### 7. Agent Activity Log (Right Sidebar)
- **Label:** Recent agent names and timestamps
- **Location:** Right sidebar, "Recent Agent Activity" section
- **Current behavior:** Static display, not interactive
- **Intended behavior:** Could be clickable to show agent details
- **Possible future interaction:**
  - Click agent name → Show modal with agent logs
  - Click "View All" → Navigate to full activity history

#### 8. Empty State (If No Requests)
- **Display:** When `requests.length === 0`
- **Component:** `<EmptyState>` from design system
- **Message:** "No pay check requests yet. Submit your first check to get started!"
- **Action button:** "Submit First Check" → Opens wizard

---

### Pay Check Wizard (PayCheckWizard.tsx)

**5-Step Modal Flow**

#### Overall Navigation

| Action | Button/Element | Handler | Behavior |
|--------|---------------|---------|----------|
| Close wizard | X button (top-right) | `onClose()` | Close modal, return to dashboard |
| Next step | "Next" button | `handleNext(data)` | Save data, advance to next step |
| Previous step | "Back" button | `handleBack()` | Go to previous step (data preserved) |
| Jump to step | Click step in left sidebar | `handleStepClick(stepNumber)` | Only works for completed steps |

#### Step 1: Meta Details (MetaDetailsStep.tsx)

**Form Fields:**
1. **Organisation Type** (Dropdown)
   - Options: Childcare, Retail, Healthcare, Hospitality
   - Default: "Childcare" (pre-filled for Ava)
   - Required: Yes
   - Validation: Must select option

2. **Organisation Name** (Text input)
   - Default: "BrightSteps Early Learning" (pre-filled)
   - Required: Yes
   - Validation: Non-empty string

3. **Employment Type** (Dropdown)
   - Options: Full-time, Part-time, Casual
   - Default: "Casual" (pre-filled)
   - Required: Yes

4. **Role Title** (Text input)
   - Default: "Educator" (pre-filled)
   - Required: Yes
   - Purpose: For award classification matching

5. **Classification Level** (Text input)
   - Optional field
   - Purpose: Specific award level (e.g., "Level 3")
   - Helps narrow down entitlements

6. **Pay Period** (Date pickers)
   - Start date and end date
   - Default: "2025-08-01" to "2025-08-14"
   - Required: Yes
   - Validation: End date must be after start date

7. **State** (Dropdown)
   - Options: NSW, VIC, QLD, SA, WA, TAS, NT, ACT
   - Default: "VIC"
   - Purpose: State-specific award variations

8. **Public Holiday** (Checkbox)
   - Label: "This period included a public holiday"
   - Default: Unchecked
   - Purpose: Triggers public holiday penalty checks

**Buttons:**
- **"Next"**: Validates all required fields → `onNext(formData)` → Advances to Step 2
- **"Cancel"**: Closes wizard → `onCancel()`

**Validation:**
- All required fields must be filled
- Date range must be valid
- Show error messages below invalid fields

#### Step 2: Upload Documents (UploadDocumentsStep.tsx)

**3 Upload Zones:**

1. **Employment Contract** (Required)
   - Formats: PDF, DOCX, DOC
   - Max size: 10MB
   - Display: Drag-and-drop zone or "Browse Files" button
   - Status: Shows file name + size when uploaded
   - Actions: "Change File" or "Remove" buttons
   - Validation: Required before Next

2. **Timesheet/Worksheet** (Required)
   - Formats: PDF, DOCX, XLS, XLSX, CSV
   - Max size: 10MB
   - Same UI pattern as contract
   - Purpose: Records of hours worked

3. **Payslip** (Required)
   - Formats: PDF, DOCX
   - Max size: 10MB
   - Purpose: What employer actually paid

**Upload Process:**
- Current: Files stored in component state, not uploaded yet
- Intended: 
  - Upload to server: `POST /api/upload/document`
  - Receive: `{ fileUrl: string, fileId: string }`
  - Store file IDs for next steps

**Buttons:**
- **"Back"**: Return to Step 1 → `onBack()`
- **"Next"**: Validates all 3 files present → `onNext({ contractFile, worksheetFile, payslipFile })` → Step 3

**Helper Features:**
- "Demo Files" button: Auto-fills with sample files
- File preview icon (future): Show first page thumbnail

#### Step 3: Review Extracted Info (ReviewExtractedStep.tsx)

**Display: AI-Extracted Data Review**

**Purpose:** Show what AI extracted from uploaded documents before processing

**Extracted Data Cards:**

1. **From Contract:**
   - Base hourly rate (e.g., "$28.50/hr")
   - Evening rate (if specified)
   - Weekend rates
   - Other penalties
   - Classification level
   - Source: Contract clause references

2. **From Timesheet:**
   - Total hours worked
   - Breakdown by day
   - Breakdown by time period (ordinary, evening, weekend)
   - Dates and times
   - Source: Worksheet row references

3. **From Payslip:**
   - Total paid amount
   - Breakdown by pay component
   - Ordinary hours × rate
   - Penalty hours × rate (if any)
   - Deductions
   - Source: Payslip line items

**Editable Fields:**
- Each extracted value has an "Edit" icon
- Click edit → Inline text input appears
- Change value → Updates `extractedData` in wizard state
- Purpose: Correct any OCR/extraction errors

**Validation Warnings:**
- Show yellow warning badge if:
  - Contract rate < Award minimum
  - Hours worked don't match payslip hours
  - Missing expected penalty rates
- Purpose: Flag potential issues before analysis

**Buttons:**
- **"Back"**: Return to Step 2 → `onBack()`
- **"Looks Good, Continue"**: Confirms data → `onNext({ extractedData })` → Step 4

**Current Implementation:**
- Shows sample extracted data (hardcoded)
- Edit functionality may be placeholder

**Intended Implementation:**
- Call API after upload: `POST /api/extract/parse` with file IDs
- Receive structured JSON with extracted values
- Allow user to correct errors
- Save confirmed data for analysis

#### Step 4: Run Agentic Check (RunAgenticCheckStep.tsx)

**Display: Live AI Agent Processing**

**Purpose:** Show 10 AI agents running in sequence to analyze documents

**Agent Pipeline (10 Agents):**

1. **Award Agent**
   - Purpose: Identify applicable award from job details
   - Input: Org type, state, role
   - Output: Award name, clauses

2. **Contract Agent**
   - Purpose: Parse contract for rates and terms
   - Input: Contract file
   - Output: Base rate, penalty rates, clauses

3. **Worksheet Agent**
   - Purpose: Extract hours from timesheet
   - Input: Worksheet file
   - Output: Hours by day, by type

4. **Payslip Agent**
   - Purpose: Extract payment data
   - Input: Payslip file
   - Output: Amount paid, line items

5. **Retrieval Agent**
   - Purpose: Fetch relevant award clauses from RAG database
   - Input: Award name, job type
   - Output: Award clause text

6. **Time Categorisation Agent**
   - Purpose: Classify hours (ordinary, evening, weekend, etc.)
   - Input: Timesheet hours
   - Output: Categorized hours

7. **Calculator Agent**
   - Purpose: Calculate entitlements based on award + contract
   - Input: Hours, rates, award clauses
   - Output: Entitled amount per category

8. **Underpayment Detector**
   - Purpose: Compare paid vs. entitled
   - Input: Paid amount, entitled amount
   - Output: Difference, flagged issues

9. **Explanation Agent**
   - Purpose: Generate human-readable explanation
   - Input: Calculation results
   - Output: Plain English explanation

10. **Guardrail Agent**
    - Purpose: Quality checks, validate logic
    - Input: All results
    - Output: Pass/fail, warnings

**UI Display:**
- Each agent shown as a card with:
  - Agent name
  - Status badge (Running, Done, Failed)
  - Progress bar (if running)
  - Duration (when done)
  - Error count (if any)
  - Expandable logs (click to show details)

**Current Implementation:**
- Simulated with `setTimeout()` delays
- Each agent "completes" after 1-2 seconds
- Hardcoded to always succeed

**Intended Implementation:**
- WebSocket connection to backend:
  ```typescript
  const ws = new WebSocket(`ws://api/check/${checkId}/progress`);
  ws.onmessage = (event) => {
    const update = JSON.parse(event.data);
    // update = { agentId, status, progress, message, logs }
    updateAgentStatus(update);
  };
  ```
- Real-time updates as each agent completes
- Handle failures: Retry button, error details
- Logs streamed live

**Auto-Advance:**
- When all agents complete successfully → `onNext({ results })` → Step 5
- No button needed, auto-advances

**Error Handling:**
- If agent fails:
  - Show "Retry" button
  - Display error message
  - Allow user to proceed anyway or fix and retry

#### Step 5: Results (ResultsStep.tsx)

**Display: Final Results with 4 Tabs**

This is the same component structure as `RequestDetailPage`, embedded in wizard.

**Summary Banner:**
- Large status indicator: OK (green) or Underpaid (red) or Needs Review (amber)
- Key numbers:
  - Paid: $540.00
  - Entitled: $612.00
  - Difference: -$72.00 (underpaid)
- Confidence score: 86/100

**4 Tabs:**

1. **Summary Tab**
   - Key metrics cards
   - Severity badge
   - Primary explanation
   - Top issues list
   - Recommendation: "You may be entitled to $72.00 in back pay"

2. **Calculation Details Tab**
   - Line-item breakdown table:
     - Component | Hours | Rate | Expected | Paid | Difference
     - Ordinary hours | 16 | $28.00 | $448 | $448 | $0
     - Evening hours | 2 | $34.00 | $68 | $56 | -$12
     - Casual loading | — | 25% | $129 | $36 | -$60
   - Total row at bottom
   - Explanation of each line

3. **Evidence Tab**
   - Evidence cards showing:
     - Contract excerpt with highlighted clause
     - Worksheet excerpt with relevant rows
     - Payslip excerpt with line items
     - Award clause citations
   - Each card has:
     - Document type icon
     - Title
     - Excerpt text
     - Reference (page/clause)
     - Confidence score pill

4. **Timeline Tab**
   - Chronological list of events:
     - Request submitted
     - Documents uploaded
     - Each agent execution
     - Analysis complete
   - Shows timestamps, agent names, status badges

**Buttons:**
- **"Download Evidence Pack"**: Export PDF with all details
  - API: `GET /api/check/{id}/evidence-pack`
  - Triggers browser download
- **"Done"**: Close wizard, return to dashboard
  - Handler: `onClose()`
  - Dashboard will now show this request in table

---

### Request Detail Page (RequestDetailPage.tsx)

**Triggered by:** Click request row in dashboard

**Display:** Full-page 4-tab view (same tabs as Wizard Step 5 Results)

**Top Header:**
- Back button (arrow left) → Returns to dashboard
- Request ID badge (e.g., "REQ-2025-003")
- Pay period: "01–14 Aug 2025"
- Organisation: "BrightSteps Early Learning • Childcare"
- Submitted date: "15 Aug 2025"
- Status badge: Done

**Key Metrics Row (Below Header):**
- Paid: $540.00
- Entitled: $612.00
- Difference: -$72.00 (with severity badge)

**4 Tabs (Same as Wizard Results):**

See "Step 5: Results" above for detailed tab breakdown.

**Interactions:**

1. **Back Button**
   - Handler: `onBack()` → `setViewingRequestId(null)`
   - Returns to dashboard

2. **Tab Navigation**
   - Click tab trigger → Switch active tab
   - Handler: Built into `<Tabs>` component
   - State: `defaultValue="summary"`

3. **Download Evidence Pack Button**
   - Location: Top-right corner or bottom of page
   - Handler: `handleDownload()`
   - API: `GET /api/check/${requestId}/evidence-pack`
   - Downloads PDF with:
     - Cover page
     - Summary
     - Full calculation breakdown
     - Evidence excerpts with highlights
     - Timeline

4. **Export to CSV** (Conceptual)
   - Export calculation table as CSV
   - For importing into spreadsheet

5. **Flag for Dispute** (Future Feature)
   - If underpaid, allow flagging for employer dispute
   - Opens modal to add notes
   - Submits formal dispute request

**Data Source:**
- Current: `requestDataMap` object with hardcoded sample data for different request IDs
- Intended: 
  - API call: `GET /api/check/${requestId}`
  - Response: Full `CheckRequest` object with all data
  - Loading state while fetching

---

### Award Chat Page (AwardChatPage.tsx)

**Full-Screen RAG-Powered Q&A Interface**

#### Layout

**Left Sidebar (30% width):**
1. **Uploaded Documents Section**
   - Shows list of uploaded contracts
   - Each document card shows:
     - File name
     - Upload date
     - "Remove" button
   - Purpose: Context for personalized answers

2. **Upload Supporting Document Button**
   - Opens Document Upload Modal
   - Allows adding contract for personalized context

3. **"Use contract context" Checkbox**
   - When checked: Answers reference user's specific contract
   - When unchecked: Generic award information only
   - Handler: `setUseContractContext(!useContractContext)`

4. **Suggested Prompts**
   - Pre-written questions user can click:
     - "What are penalty rates after 6pm in childcare?"
     - "Do I get allowances for split shifts?"
     - "What evidence do I need to raise an underpayment issue?"
     - "How are evening hours defined under my award?"
   - Click → Populates input and sends

**Main Chat Area (70% width):**
- **Header:**
  - Award Assistant title
  - Award badge: "Children's Services Award 2010"
  - Back button (if accessed from dashboard)

- **Message List:**
  - Scrollable chat history
  - User messages: Right-aligned, blue background
  - AI messages: Left-aligned, grey background
  - Each AI message includes:
    - Response text (supports Markdown)
    - Citations section (if applicable):
      - Citation text
      - Reference (e.g., "Award p.12, Clause 25.3")
      - Clickable to view source
  - Height: `h-[calc(100vh-12rem)]` (increased for better visibility)
  - Message bubbles: `max-w-[95%]` (wide bubbles for readability)

- **Input Area (Bottom):**
  - Text input field with placeholder: "Ask about your award entitlements..."
  - Send button (paper plane icon)
  - Character count (optional)
  - Auto-resize textarea

#### Interactions

1. **Send Message Button**
   - **Handler:** `handleSendMessage()`
   - **Current implementation:**
     - Adds user message to `messages` state
     - Calls `getAIResponse()` with keyword matching
     - 11 pre-defined response patterns:
       - Penalty rates / evening
       - Overtime
       - Leave entitlements
       - Public holidays
       - Contract upload
       - Split shifts
       - Evidence/underpayment
       - Minimum wage
       - Classifications
       - Breaks
       - Default fallback
     - Simulates 800ms delay
     - Adds AI response with citations
   - **Intended implementation:**
     - API call: `POST /api/chat/message`
     - Request:
       ```json
       {
         "message": "What are evening penalty rates?",
         "context": {
           "useContract": true,
           "contractFileId": "...",
           "award": "Children's Services Award 2010",
           "employmentType": "Casual"
         }
       }
       ```
     - Response:
       ```json
       {
         "response": "Based on your contract and the award...",
         "citations": [
           { "text": "Evening penalty", "reference": "Award p.12, Clause 25.3" }
         ],
         "confidence": 0.92
       }
       ```
     - Stream response for typing effect (Server-Sent Events or WebSocket)
     - Real RAG retrieval from award database

2. **Suggested Prompt Click**
   - **Handler:** `onClick={() => { setMessageInput(prompt); handleSendMessage(); }}`
   - Auto-fills input and submits immediately
   - User sees their question appear in chat

3. **Upload Supporting Document Button**
   - **Handler:** `onClick={() => setShowUploadModal(true)}`
   - Opens `DocumentUploadModal`

4. **Citation Click** (Future)
   - Click citation reference → Opens modal or sidebar with full award clause
   - Shows PDF page with highlighted text
   - API: `GET /api/award/clause/${clauseId}`

5. **Copy Message Button** (Future)
   - Copy AI response to clipboard
   - Shows "Copied!" toast

6. **Regenerate Response Button** (Future)
   - Re-run RAG query for different answer
   - API: Same as send message, with `regenerate: true` flag

7. **Thumbs Up/Down** (Future)
   - Feedback on answer quality
   - API: `POST /api/chat/feedback`
   - Improves RAG ranking over time

8. **Clear Chat Button** (Conceptual)
   - Clears all messages
   - Confirmation modal: "Are you sure?"

9. **Export Chat Button** (Conceptual)
   - Download chat history as PDF or TXT
   - API: `GET /api/chat/export?format=pdf`

#### Chat Message Flow

**User sends:** "What are my entitlements for evening shifts?"

**AI responds:**
```
Under the Children's Services Award, hours worked after 6pm are paid at the evening rate. For your role, this is typically higher than the ordinary rate...

📎 Citations:
• Evening penalty window - Award p.12, Clause 25.3
• Casual loading interaction - Award p.15, Clause 12.2
```

**If contract uploaded:**
```
Based on your contract with BrightSteps Early Learning:
• Your base rate: $28.50/hr
• Your evening rate: $31.35/hr (10% penalty + 25% casual loading)

Under the Children's Services Award 2010, you are entitled to...

📎 Citations:
• Your contract, Clause 4.2
• Award p.12, Clause 25.3
```

---

### Document Upload Modal (DocumentUploadModal.tsx)

**Modal Overlay for Uploading Contract/Docs to Chat**

#### UI Components

**Header:**
- Title: "Upload Supporting Document"
- Description: "Add your contract or other documents to get personalized answers"
- Close button (X icon)

**Drag-and-Drop Zone:**
- Border: Dashed, changes to primary color on drag-over
- Icon: Upload icon (cloud with arrow)
- Text: "Drag and drop your document here, or"
- "Browse files" button (fake file input)
- Supported formats: "PDF, DOCX (max 10MB)"

**After File Selected:**
- Green checkmark icon
- "File selected: [filename]"
- "Choose different file" button

**Suggested Documents Section:**
- 2-column grid of suggestions:
  - [📄 Employment Contract]
  - [📄 Enterprise Agreement]
- Purpose: Help users know what to upload
- Not interactive (just informational)

**Privacy Notice:**
- Blue info box at bottom
- "Privacy: Your documents are encrypted and only used to provide personalized answers. They are not shared with third parties."

**Action Buttons:**
- **"Upload Document"** (primary button)
  - Disabled until file selected
  - Handler: `handleUpload()`
  - Current: Calls `onUpload(fileName)` prop
  - Intended: Upload file to server, add to chat context
- **"Cancel"** (secondary button)
  - Handler: `onClose()`
  - Closes modal without uploading

#### Interactions

1. **Drag and Drop**
   - **Events:** `onDragEnter`, `onDragOver`, `onDragLeave`, `onDrop`
   - **Handler:** `handleDrag()`, `handleDrop()`
   - **Behavior:**
     - Highlight zone when dragging over
     - Read dropped file
     - Validate file type and size
     - Set `selectedFile` state

2. **Browse Files Button**
   - **Handler:** Triggers hidden `<input type="file">`
   - **Event:** `onChange={handleFileSelect}`
   - **Accept:** `.pdf,.docx,.doc`
   - **Max size:** 10MB (validated in handler)

3. **Choose Different File**
   - **Handler:** `onClick={() => setSelectedFile(null)}`
   - Clears selected file, returns to drop zone

4. **Upload Document Button**
   - **Handler:** `handleUpload()`
   - **Current implementation:**
     ```typescript
     if (selectedFile) {
       onUpload(selectedFile); // Just passes filename
     }
     ```
   - **Intended implementation:**
     - Create FormData
     - Upload to server: `POST /api/upload/contract`
     - Show progress bar (0-100%)
     - On success: Add to chat context
     - On error: Show error message
     - Close modal

5. **Cancel Button**
   - **Handler:** `onClose()`
   - No upload, just closes modal

6. **Close Button (X)**
   - Same as Cancel

7. **Click Outside Modal**
   - **Handler:** Added to backdrop `onClick={onClose}`
   - Inner card: `onClick={(e) => e.stopPropagation()}`
   - Closes modal when clicking dark background

---

## E) Data Model Reference

**Note:** These TypeScript interfaces are for documentation and type safety. They represent the expected data structure when the app is connected to a real backend.

### Core Types

```typescript
// ============================================================
// PAY CHECK REQUEST & RESPONSE
// ============================================================

/**
 * Represents a single employee pay check verification request
 */
interface CheckRequest {
  id: string;                          // Unique request ID (e.g., "REQ-2025-003")
  
  // Employee (from auth context or form)
  employeeId: string;                  // User ID
  employeeName: string;                // Display name
  
  // Job details (from Step 1)
  organisationType: OrganisationType;  // Childcare, Retail, etc.
  organisationName: string;
  employmentType: EmploymentType;      // Full-time, Part-time, Casual
  roleTitle: string;                   // Job title
  classificationLevel?: string;        // Award level (if applicable)
  state: AustralianState;              // VIC, NSW, etc.
  
  // Pay period (from Step 1)
  payPeriodStart: Date;
  payPeriodEnd: Date;
  payPeriodLabel: string;              // "01–14 Aug 2025"
  hasPublicHoliday: boolean;
  
  // Uploaded documents (from Step 2)
  contractFileUrl: string;             // S3 URL
  worksheetFileUrl: string;
  payslipFileUrl: string;
  
  // Extracted data (from Step 3)
  extractedData: ExtractedData;
  
  // Results (from Step 4-5)
  status: CheckStatus;                 // 'processing' | 'completed' | 'failed'
  severity: PaymentSeverity;           // 'ok' | 'underpaid' | 'needs-review'
  
  // Amounts
  paidAmount: number;                  // From payslip
  entitledAmount: number;              // Calculated
  difference: number;                  // Underpayment (negative) or overpayment (positive)
  
  // AI analysis
  anomalyScore: number;                // 0-100 confidence score
  confidence: number;                  // 0.0-1.0 probability
  explanation: string;                 // Plain English explanation
  
  // Breakdown
  calculationBreakdown: CalculationLine[];
  evidence: Evidence[];
  timeline: TimelineEvent[];
  
  // Metadata
  submittedDate: Date;
  completedDate?: Date;
  processingDuration?: number;         // Seconds
  
  // Award context
  awardName: string;                   // "Children's Services Award 2010"
  awardCode?: string;                  // "MA000120"
  relevantClauses: AwardClause[];
}

type CheckStatus = 'draft' | 'processing' | 'completed' | 'failed';
type PaymentSeverity = 'ok' | 'underpaid' | 'overpaid' | 'needs-review';
type OrganisationType = 'childcare' | 'retail' | 'healthcare' | 'hospitality' | 'other';
type EmploymentType = 'full-time' | 'part-time' | 'casual';
type AustralianState = 'NSW' | 'VIC' | 'QLD' | 'SA' | 'WA' | 'TAS' | 'NT' | 'ACT';

/**
 * Data extracted from uploaded documents by AI (Step 3)
 */
interface ExtractedData {
  // From contract
  contract: {
    baseRate: number;                  // $/hr
    eveningRate?: number;
    saturdayRate?: number;
    sundayRate?: number;
    publicHolidayRate?: number;
    casualLoading?: number;            // % (e.g., 25)
    classificationLevel?: string;
    effectiveDate?: Date;
    clauses: Array<{
      clauseNumber: string;
      text: string;
    }>;
  };
  
  // From timesheet
  worksheet: {
    totalHours: number;
    breakdown: Array<{
      date: string;                    // "2025-08-05"
      dayOfWeek: string;               // "Wednesday"
      timeRange: string;               // "18:00-20:00"
      hours: number;
      category: HourCategory;          // "ordinary" | "evening" | "weekend"
      isPublicHoliday: boolean;
    }>;
    summary: {
      ordinaryHours: number;
      eveningHours: number;
      weekendHours: number;
      publicHolidayHours: number;
    };
  };
  
  // From payslip
  payslip: {
    totalGross: number;
    totalNet: number;
    lineItems: Array<{
      description: string;             // "Ordinary hours"
      hours?: number;
      rate?: number;
      amount: number;
    }>;
    deductions: Array<{
      description: string;
      amount: number;
    }>;
    payDate: Date;
  };
}

type HourCategory = 'ordinary' | 'evening' | 'saturday' | 'sunday' | 'public-holiday' | 'overtime';

/**
 * Single line in calculation breakdown table
 */
interface CalculationLine {
  id: string;
  component: string;                   // "Ordinary hours", "Evening hours", etc.
  hours?: number;                      // If hourly component
  rate?: number;                       // $/hr
  percentage?: number;                 // For loadings (e.g., 25%)
  expected: number;                    // Amount should have been paid
  paid: number;                        // Amount actually paid
  difference: number;                  // Underpayment (negative) or overpayment (positive)
  explanation?: string;                // Why this component matters
  awardClauseRef?: string;             // Clause number
}

/**
 * Evidence item from documents
 */
interface Evidence {
  type: 'contract' | 'worksheet' | 'payslip' | 'award';
  title: string;                       // Short summary
  excerpt: string;                     // Relevant text excerpt
  reference: string;                   // "Page 3, Clause 4.2" or "Row 5"
  confidence: number;                  // 0.0-1.0 AI confidence in extraction
  highlightedText?: string;            // Text to highlight in UI
  sourceUrl?: string;                  // Link to full document
}

/**
 * Timeline event during processing
 */
interface TimelineEvent {
  time: string;                        // ISO timestamp or display string
  event: string;                       // "Contract parsed", "Underpayment detected"
  agent: string;                       // "Contract Agent", "System"
  status?: 'done' | 'running' | 'failed';
  details?: string;                    // Additional context
}

/**
 * Award clause citation
 */
interface AwardClause {
  clauseNumber: string;                // "25.3"
  clauseTitle: string;                 // "Evening penalty rates"
  text: string;                        // Full clause text
  page?: number;                       // Page in PDF
  relevance: string;                   // Why this clause applies
  url?: string;                        // Link to official source
}

// ============================================================
// AGENT EXECUTION
// ============================================================

/**
 * Status of one agent in the 10-agent pipeline (Step 4)
 */
interface AgentStatus {
  id: string;
  name: string;                        // "Award Agent", "Calculator Agent", etc.
  sequenceNumber: number;              // 1-10
  status: 'pending' | 'running' | 'done' | 'failed';
  startedAt?: Date;
  completedAt?: Date;
  duration?: number;                   // Seconds
  progress?: number;                   // 0-100
  errorMessage?: string;
  logs: AgentLog[];
}

interface AgentLog {
  timestamp: Date;
  level: 'info' | 'warning' | 'error';
  message: string;
}

// ============================================================
// AWARD CHAT & RAG
// ============================================================

/**
 * Chat message in Award Assistant
 */
interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;                     // Markdown-formatted text
  citations?: Citation[];
  timestamp: Date;
  confidence?: number;                 // AI confidence in answer (0-1)
}

interface Citation {
  text: string;                        // Short label (e.g., "Evening penalty window")
  reference: string;                   // "Award p.12, Clause 25.3"
  clauseId?: string;                   // For linking to full clause
  url?: string;                        // Link to source document
}

/**
 * Chat request to RAG API
 */
interface ChatRequest {
  message: string;                     // User's question
  context?: ChatContext;               // Optional personalized context
  conversationId?: string;             // For multi-turn conversations
}

interface ChatContext {
  useContract: boolean;                // Whether to use uploaded contract
  contractFileId?: string;             // Uploaded contract reference
  award: string;                       // "Children's Services Award 2010"
  employmentType: EmploymentType;
  state: AustralianState;
  roleTitle?: string;
}

/**
 * Chat response from RAG API
 */
interface ChatResponse {
  response: string;                    // AI-generated answer (Markdown)
  citations: Citation[];
  confidence: number;                  // 0.0-1.0
  conversationId: string;              // For follow-up questions
  relatedQuestions?: string[];         // Suggested follow-ups
}

/**
 * Uploaded document for chat context
 */
interface UploadedDocument {
  id: string;
  fileName: string;
  fileType: 'contract' | 'enterprise-agreement' | 'other';
  fileSize: number;                    // Bytes
  uploadDate: Date;
  status: 'processing' | 'ready' | 'failed';
  s3Url: string;
  extractedSummary?: string;           // AI summary of contents
}

// ============================================================
// USER PROFILE
// ============================================================

/**
 * Employee user profile
 */
interface EmployeeUser {
  id: string;
  email: string;
  name: string;
  
  // Employment details
  organisationName: string;
  organisationType: OrganisationType;
  employmentType: EmploymentType;
  roleTitle: string;
  state: AustralianState;
  startDate?: Date;
  
  // Award context
  applicableAward?: string;
  classificationLevel?: string;
  
  // Settings
  notificationsEnabled: boolean;
  emailNotifications: boolean;
  
  // Metadata
  createdDate: Date;
  lastLogin?: Date;
}

// ============================================================
// DASHBOARD METRICS
// ============================================================

/**
 * Dashboard summary data
 */
interface DashboardMetrics {
  // Latest result
  latestResult?: {
    requestId: string;
    payPeriod: string;
    paid: number;
    entitled: number;
    difference: number;
    severity: PaymentSeverity;
    processedDate: string;
  };
  
  // Summary stats
  totalRequests: number;
  underpaidCount: number;
  okCount: number;
  totalUnderpayment: number;          // Sum of all underpayments
  
  // Recent requests (for table)
  recentRequests: CheckRequest[];     // Last 5-10 requests
  
  // Agent activity (for sidebar)
  recentAgentActivity: Array<{
    agent: string;
    timestamp: string;
    status: 'done' | 'running' | 'failed';
    requestId?: string;
  }>;
}

// ============================================================
// API RESPONSE WRAPPERS
// ============================================================

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    timestamp: Date;
    requestId: string;
  };
}

// ============================================================
// WIZARD STATE
// ============================================================

/**
 * Wizard data structure (used internally by PayCheckWizard)
 */
interface WizardData {
  // Step 1: Meta details
  organisationType: string;
  organisationName: string;
  employmentType: string;
  roleTitle: string;
  classificationLevel: string;
  periodStart: string;                 // ISO date string
  periodEnd: string;
  state: string;
  hasPublicHoliday: boolean;
  
  // Step 2: Documents
  contractFile: File | null;
  worksheetFile: File | null;
  payslipFile: File | null;
  
  // Step 3: Extracted data
  extractedData: ExtractedData | null;
  
  // Step 4-5: Results
  results: CheckRequest | null;
}
```

---

## F) Implementation Guidelines

### Overview
This section explains HOW a developer would wire the existing UI to real backend systems, APIs, and databases. It does NOT provide implementation code, but conceptual steps and file locations.

---

### 1. Replace Sample Data with API Calls

#### Current State
All Employee pages use inline sample data:
- `EmployeeDashboardPage.tsx`: Lines 18-71 (latest result, requests, agent activity)
- `RequestDetailPage.tsx`: Lines 54-200+ (`requestDataMap` with multiple sample requests)
- `AwardChatPage.tsx`: Initial messages and suggested prompts hardcoded
- Wizard steps: Sample extracted data

#### Steps to Replace with Real Data

**Step 1: Create API Service Layer**
- Create new file: `/services/checkApi.ts`
- Define functions:
  ```typescript
  // Conceptual structure (not actual code)
  export async function fetchMyRequests(): Promise<CheckRequest[]>
  export async function fetchRequestDetail(requestId: string): Promise<CheckRequest>
  export async function submitCheckRequest(data: WizardData): Promise<{ requestId: string }>
  export async function uploadDocument(file: File, type: string): Promise<{ fileId: string, fileUrl: string }>
  export async function extractDocumentData(fileIds: string[]): Promise<ExtractedData>
  export async function startAgenticCheck(requestId: string): Promise<{ websocketUrl: string }>
  ```

**Step 2: Create Chat API Service**
- Create file: `/services/chatApi.ts`
- Functions:
  ```typescript
  export async function sendChatMessage(request: ChatRequest): Promise<ChatResponse>
  export async function uploadContractForChat(file: File): Promise<UploadedDocument>
  export async function fetchChatHistory(conversationId?: string): Promise<ChatMessage[]>
  ```

**Step 3: Add Data Fetching Hooks**
- Create custom hooks in `/hooks/useCheckData.ts`:
  ```typescript
  // Conceptual
  export function useMyRequests() {
    const [data, setData] = useState<CheckRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    
    useEffect(() => {
      fetchMyRequests()
        .then(setData)
        .catch(setError)
        .finally(() => setLoading(false));
    }, []);
    
    return { data, loading, error, refetch };
  }
  
  export function useRequestDetail(requestId: string) {
    // Similar pattern
  }
  ```

**Step 4: Replace Sample Data in Components**
- In `EmployeeDashboardPage.tsx`:
  - Remove `latestResult` object (lines 19-27)
  - Remove `requests` array (lines 29-57)
  - Add: `const { data: requests, loading, error } = useMyRequests()`
  - Derive `latestResult` from `requests[0]`
  - Add loading spinner: `{loading && <LoadingSpinner />}`
  - Add error display: `{error && <ErrorAlert message={error.message} />}`

- In `RequestDetailPage.tsx`:
  - Remove `requestDataMap` (lines 54-200+)
  - Add: `const { data: requestData, loading, error } = useRequestDetail(requestId)`
  - Use `requestData` instead of `requestDataMap[requestId]`

---

### 2. Implement Pay Check Wizard with Real Processing

#### Step 1: Meta Details (No API Yet)
- Store form data in local state
- Validation is already implemented
- No API call needed until submission

#### Step 2: Upload Documents

**Current:** Files stored in component state only

**Implement:**
1. Create upload handler in `UploadDocumentsStep.tsx`:
   ```typescript
   const handleFileUpload = async (file: File, type: string) => {
     setUploading(true);
     try {
       const result = await uploadDocument(file, type);
       // result = { fileId, fileUrl }
       return result.fileId;
     } catch (error) {
       setError(`Failed to upload ${type}`);
     } finally {
       setUploading(false);
     }
   };
   ```

2. Upload immediately on file selection or wait until Next
   - Option A: Upload on selection (better UX, instant feedback)
   - Option B: Upload on Next button (simpler, batch operation)

3. Show upload progress:
   - Use `XMLHttpRequest` or `axios` with progress callback
   - Update progress bar: `setUploadProgress(percentage)`

4. Store file IDs in wizard state:
   ```typescript
   onNext({
     contractFileId: 'file_abc123',
     worksheetFileId: 'file_def456',
     payslipFileId: 'file_ghi789'
   });
   ```

#### Step 3: Review Extracted Data

**Current:** Shows hardcoded sample extraction

**Implement:**
1. On step mount, call extraction API:
   ```typescript
   useEffect(() => {
     const extractData = async () => {
       setExtracting(true);
       try {
         const extracted = await extractDocumentData([
           wizardData.contractFileId,
           wizardData.worksheetFileId,
           wizardData.payslipFileId
         ]);
         setExtractedData(extracted);
       } catch (error) {
         setError('Failed to extract data');
       } finally {
         setExtracting(false);
       }
     };
     extractData();
   }, []);
   ```

2. API endpoint: `POST /api/extract/parse`
   - Request: `{ fileIds: string[], metadata: { orgType, employmentType, etc. } }`
   - Response: `ExtractedData` object
   - Processing time: 5-15 seconds (show loading)

3. Display extracted data in editable fields
4. Save user corrections to state
5. Pass confirmed data to next step

#### Step 4: Run Agentic Check

**Current:** Simulated with setTimeout

**Implement:**
1. Create WebSocket connection:
   ```typescript
   useEffect(() => {
     const startCheck = async () => {
       // Create check request on backend
       const { requestId, websocketUrl } = await startAgenticCheck({
         ...wizardData,
         extractedData: confirmedData
       });
       
       // Connect to WebSocket for live updates
       const ws = new WebSocket(websocketUrl);
       
       ws.onopen = () => {
         console.log('Connected to agent stream');
       };
       
       ws.onmessage = (event) => {
         const update = JSON.parse(event.data);
         // update = { agentId, status, progress, message, logs }
         
         updateAgentStatus(update.agentId, {
           status: update.status,
           progress: update.progress,
           logs: [...existingLogs, ...update.logs]
         });
         
         // Check if all agents complete
         if (update.type === 'COMPLETE') {
           setResults(update.results);
           onNext({ results: update.results });
         }
       };
       
       ws.onerror = (error) => {
         setError('Processing failed');
       };
       
       return () => ws.close();
     };
     
     startCheck();
   }, []);
   ```

2. Backend implements:
   - Orchestrates 10 agents in sequence
   - Sends WebSocket updates after each agent
   - Message format: `{ agentId, name, status, duration, logs[] }`

3. Handle failures:
   - If agent fails, show "Retry" button
   - Allow skipping failed agent
   - Show detailed error logs

#### Step 5: Results

**Current:** Shows sample results

**After Step 4:** Results already received from WebSocket, stored in wizard state

**No additional API needed** - just display results

---

### 3. Implement Award Chat with Real RAG

#### Current State
- Keyword-based responses with 11 pre-defined patterns
- Simulated 800ms delay
- Fake citations

#### Steps to Implement Real RAG

**Step 1: Set Up Chat Service**
- Create `/services/chatApi.ts`:
  ```typescript
  export async function sendMessage(request: ChatRequest): Promise<ChatResponse> {
    const response = await fetch('/api/chat/message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request)
    });
    return response.json();
  }
  ```

**Step 2: Replace Keyword Matching**
- In `AwardChatPage.tsx`, replace `getAIResponse()`:
  ```typescript
  const handleSendMessage = async () => {
    if (!messageInput.trim()) return;
    
    // Add user message immediately
    const userMsg: ChatMessage = {
      id: generateId(),
      role: 'user',
      content: messageInput,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);
    setMessageInput('');
    setIsTyping(true);
    
    try {
      // Call real RAG API
      const response = await sendMessage({
        message: messageInput,
        context: {
          useContract: useContractContext,
          contractFileId: uploadedContract?.id,
          award: 'Children\\'s Services Award 2010',
          employmentType: 'Casual', // From user profile
          state: 'VIC',
          roleTitle: 'Educator'
        },
        conversationId: currentConversationId
      });
      
      // Add AI response
      const aiMsg: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: response.response,
        citations: response.citations,
        timestamp: new Date(),
        confidence: response.confidence
      };
      setMessages(prev => [...prev, aiMsg]);
      setCurrentConversationId(response.conversationId);
      
    } catch (error) {
      // Show error message in chat
      const errorMsg: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };
  ```

**Step 3: Implement Streaming (Optional)**
- For real-time typing effect, use Server-Sent Events:
  ```typescript
  const handleSendMessageStreaming = async () => {
    // ... add user message ...
    
    const response = await fetch('/api/chat/stream', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: messageInput, context })
    });
    
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    
    let aiMessage = '';
    const aiMsgId = generateId();
    
    // Add empty AI message that will be updated
    setMessages(prev => [...prev, {
      id: aiMsgId,
      role: 'assistant',
      content: '',
      timestamp: new Date()
    }]);
    
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      const chunk = decoder.decode(value);
      aiMessage += chunk;
      
      // Update message in real-time
      setMessages(prev => prev.map(msg => 
        msg.id === aiMsgId 
          ? { ...msg, content: aiMessage }
          : msg
      ));
    }
  };
  ```

**Step 4: Document Upload for Context**
- In `DocumentUploadModal.tsx`, implement real upload:
  ```typescript
  const handleUpload = async () => {
    if (!selectedFile) return;
    
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('type', 'contract');
      
      const result = await uploadContractForChat(selectedFile);
      // result = { id, fileName, status, s3Url }
      
      onUpload(result); // Pass to parent
      onClose();
    } catch (error) {
      setError('Upload failed');
    } finally {
      setUploading(false);
    }
  };
  ```

- Show uploaded documents in chat sidebar:
  ```typescript
  {uploadedDocuments.map(doc => (
    <div key={doc.id} className="document-card">
      <FileText icon />
      <span>{doc.fileName}</span>
      <Button onClick={() => removeDocument(doc.id)}>Remove</Button>
    </div>
  ))}
  ```

**Step 5: Backend RAG Implementation (Out of Scope)**
- Vector database with award clauses
- Embeddings for semantic search
- LLM for answer generation
- Citation extraction
- Contract context injection

---

### 4. Add Loading and Error States

#### Current State
Minimal loading/error handling

#### Steps to Implement

**Step 1: Create Shared Components**
- `/components/ui/LoadingSpinner.tsx`: Spinner with optional text
- `/components/ui/ErrorAlert.tsx`: Error message with retry button
- `/components/ui/EmptyState.tsx`: Already exists

**Step 2: Add to Dashboard**
- Wrap requests table:
  ```typescript
  {loading && <LoadingSpinner text="Loading your requests..." />}
  {error && <ErrorAlert message={error.message} onRetry={refetch} />}
  {!loading && !error && requests.length === 0 && (
    <EmptyState 
      title="No requests yet"
      description="Submit your first pay check to get started"
      action={<Button onClick={() => setShowWizard(true)}>Submit First Check</Button>}
    />
  )}
  {!loading && !error && requests.length > 0 && (
    <Table>...</Table>
  )}
  ```

**Step 3: Add to Request Detail**
- Show skeleton loader while fetching:
  ```typescript
  {loading && (
    <div className="space-y-4">
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-64 w-full" />
    </div>
  )}
  ```

**Step 4: Add to Wizard Steps**
- Step 2 (Upload): Show progress bar per file
- Step 3 (Extract): Show "Extracting data..." spinner
- Step 4 (Agents): Already has per-agent progress

**Step 5: Add Toast Notifications**
- Use existing `sonner` for success/error toasts:
  ```typescript
  import { toast } from 'sonner';
  
  // On success
  toast.success('Pay check submitted successfully!');
  
  // On error
  toast.error('Failed to upload document. Please try again.');
  ```

---

### 5. Implement Export Functionality

#### Evidence Pack Export

**Current:** "Download Evidence Pack" button exists but may be static

**Implement:**
1. In `RequestDetailPage.tsx` and `ResultsStep.tsx`:
   ```typescript
   const handleDownloadEvidencePack = async () => {
     setDownloading(true);
     try {
       const blob = await fetch(`/api/check/${requestId}/evidence-pack`).then(r => r.blob());
       const url = window.URL.createObjectURL(blob);
       const a = document.createElement('a');
       a.href = url;
       a.download = `PayGuard_Evidence_${requestId}.pdf`;
       document.body.appendChild(a);
       a.click();
       document.body.removeChild(a);
       window.URL.revokeObjectURL(url);
       toast.success('Evidence pack downloaded');
     } catch (error) {
       toast.error('Download failed');
     } finally {
       setDownloading(false);
     }
   };
   ```

2. Backend generates PDF with:
   - Cover page (request ID, period, employee name)
   - Summary (paid vs. entitled, severity badge)
   - Full calculation breakdown table
   - Evidence excerpts with highlights
   - Award clause citations
   - Timeline of processing

#### Chat Export

**Implement:**
1. Add "Export Chat" button to chat page
2. Generate PDF or TXT with full conversation
3. API: `GET /api/chat/export?conversationId=...&format=pdf`

---

### 6. Implement Notifications

#### Conceptual Feature (Future)

**Step 1: WebSocket for Real-Time Notifications**
- Connect to notification service when user logs in
- Listen for events:
  - Check processing complete
  - Underpayment detected
  - New message from Award Assistant (if async)

**Step 2: Display in UI**
- Bell icon in top bar (currently static)
- Badge with count of unread notifications
- Dropdown menu showing recent notifications
- Click notification → Navigate to relevant page

**Step 3: Email Notifications**
- Backend sends email when check completes
- Include summary and link to view details

---

### 7. File Locations Summary

| Task | Files to Modify | New Files to Create |
|------|-----------------|---------------------|
| Replace sample data | `EmployeeDashboardPage.tsx`<br>`RequestDetailPage.tsx`<br>`AwardChatPage.tsx` | `/services/checkApi.ts`<br>`/services/chatApi.ts`<br>`/hooks/useCheckData.ts` |
| Add loading/error states | All data-fetching components | `/components/ui/LoadingSpinner.tsx`<br>`/components/ui/ErrorAlert.tsx` (if not exist) |
| Real file upload | Wizard Step 2: `UploadDocumentsStep.tsx` | Update API service |
| Document extraction | Wizard Step 3: `ReviewExtractedStep.tsx` | Update API service |
| WebSocket for agents | Wizard Step 4: `RunAgenticCheckStep.tsx` | `/services/websocketService.ts` (optional) |
| RAG chat | `AwardChatPage.tsx` | Update `/services/chatApi.ts` |
| Document upload modal | `DocumentUploadModal.tsx` | Update API service |
| Export functionality | `RequestDetailPage.tsx`<br>`ResultsStep.tsx` | `/utils/exportHelpers.ts` (optional) |
| Notifications | `EmployeeDashboardPage.tsx` | `/services/notificationService.ts` |

---

### 8. Backend API Endpoints (Reference)

**Note:** This is a conceptual list of endpoints the frontend would call. Backend implementation is out of scope.

| Method | Endpoint | Purpose | Request | Response |
|--------|----------|---------|---------|----------|
| GET | `/api/employee/requests` | List my requests | None | `CheckRequest[]` |
| GET | `/api/check/:id` | Single request detail | None | `CheckRequest` |
| POST | `/api/upload/document` | Upload single document | FormData with file | `{ fileId, fileUrl }` |
| POST | `/api/extract/parse` | Extract data from docs | `{ fileIds: [], metadata }` | `ExtractedData` |
| POST | `/api/check/submit` | Submit new check request | `WizardData` | `{ requestId }` |
| POST | `/api/check/start` | Start agent processing | `{ requestId }` | `{ websocketUrl }` |
| WebSocket | `/ws/check/:id/progress` | Live agent updates | N/A | Stream of `{ agentId, status, progress }` |
| GET | `/api/check/:id/evidence-pack` | Download evidence PDF | None | Blob (PDF) |
| POST | `/api/chat/message` | Send chat message | `ChatRequest` | `ChatResponse` |
| POST | `/api/chat/stream` | Streaming chat | `ChatRequest` | SSE stream of text chunks |
| POST | `/api/chat/upload-contract` | Upload contract for chat | FormData with file | `UploadedDocument` |
| GET | `/api/chat/history` | Get chat history | `?conversationId=` | `ChatMessage[]` |
| GET | `/api/chat/export` | Export chat | `?conversationId=&format=` | Blob (PDF/TXT) |
| GET | `/api/employee/dashboard` | Dashboard metrics | None | `DashboardMetrics` |

---

## Summary

This document provides a comprehensive reference for the **Employee experience** in PayGuard without modifying any code. It covers:

✅ **Navigation flows** between all pages and modals  
✅ **Route/state mapping** for the React app  
✅ **Page ownership** (which TSX files implement which screens)  
✅ **Complete interaction map** for every button, form field, chat input, upload  
✅ **TypeScript data models** for all entities  
✅ **Implementation guidelines** for wiring to real APIs  

**Next Steps for Development:**
1. Create API service layer (`/services/checkApi.ts`, `/services/chatApi.ts`)
2. Implement data fetching hooks (`/hooks/useCheckData.ts`)
3. Replace sample data in dashboard and detail pages
4. Add loading/error UI components
5. Implement real file upload with progress in wizard Step 2
6. Wire document extraction API to wizard Step 3
7. Connect WebSocket for live agent updates in wizard Step 4
8. Replace keyword-based chat with real RAG API
9. Implement document upload for chat context
10. Add export functionality for evidence packs

**Key Files to Focus On:**
- `/components/dashboards/EmployeeDashboardPage.tsx` (main state orchestrator)
- `/components/employee/PayCheckWizard.tsx` (5-step wizard)
- `/components/employee/wizard-steps/` (individual step components)
- `/components/employee/RequestDetailPage.tsx` (4-tab detail view)
- `/components/employee/AwardChatPage.tsx` (RAG-powered chat)
- `/components/employee/DocumentUploadModal.tsx` (file upload)

**Special Features:**
- **10-Agent Pipeline:** Real-time processing with WebSocket updates
- **RAG-Powered Chat:** Award Assistant with document context and citations
- **Evidence Pack Export:** Comprehensive PDF with all details
- **Inline Chat:** Embedded chat on dashboard for quick questions

---

**Document Version:** 1.0  
**Created:** January 2, 2026  
**Purpose:** Reference and handoff documentation only — no code changes
