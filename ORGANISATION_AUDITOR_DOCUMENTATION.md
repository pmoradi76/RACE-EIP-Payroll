# PayGuard Organisation/Auditor Experience - Complete Documentation

**Version:** 1.0  
**Last Updated:** January 2, 2026  
**Purpose:** Reference documentation for the Organisation/Auditor workflow - NO CODE CHANGES

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
The Organisation/Auditor experience is a state-based single-page application managed by `OrganisationDashboardWrapper.tsx`. Navigation between pages is handled through React state changes, not traditional routing.

### Navigation Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        Landing Page                              │
│                       (Not in scope)                             │
└──────────────────────────────┬──────────────────────────────────┘
                               │
                    Sign In → Select User Type
                               │
                    Login as "Organisation/Auditor"
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                    DASHBOARD (Main Hub)                          │
│  File: OrganisationDashboardPage.tsx                            │
│  State: 'dashboard'                                              │
│                                                                   │
│  Key Metrics:                                                    │
│  • Total Employees: 143                                          │
│  • Underpaid Employees: 12                                       │
│  • Review Queue: 8 items                                         │
│  • Total At Risk: $4,284                                         │
│                                                                   │
│  Actions Available:                                              │
│  [New Bulk Audit] → Bulk Audit Wizard                           │
│  [View All Results] → Audit Results Page (most recent)          │
│  [View History] → Audit History                                  │
│  [Review Now] → Review Queue                                     │
│  High-risk employee row click → Employee detail modal (concept)  │
└──────────────────────────┬───────────────────┬──────────────────┘
                           │                   │
        ┌──────────────────┴────┐             │
        │                       │             │
        ▼                       ▼             ▼
┌──────────────┐   ┌───────────────┐   ┌─────────────┐
│ BULK AUDIT   │   │ AUDIT HISTORY │   │ REVIEW      │
│ WIZARD       │   │               │   │ QUEUE       │
│ (5 steps)    │   │ List of past  │   │             │
│              │   │ audit runs    │   │ HITL items  │
└──────┬───────┘   └───────┬───────┘   └─────────────┘
       │                   │
       │ Complete          │ Click row
       ▼                   ▼
┌──────────────────┐  ┌────────────────┐
│ COMPREHENSIVE    │  │ AUDIT DETAIL   │
│ AUDIT REVIEW     │  │ PAGE           │
│                  │  │ (6 tabs)       │
│ 3 Tabs:          │  │                │
│ • All Employees  │  │ • Inputs       │
│ • Analytics      │  │ • Processing   │
│ • Human Review   │  │ • Employees    │
│                  │  │ • Analytics    │
└──────────────────┘  │ • HITL         │
                      │ • Timeline     │
                      └────────────────┘
```

### Entry Points from Dashboard

| Button/Link | Target View | State Change | Handler |
|-------------|-------------|--------------|---------|
| "New Bulk Audit" | Bulk Audit Wizard | `setCurrentView('bulk-audit-wizard')` | `handleNewBulkAudit()` |
| "View All Results" | Audit Results | `setCurrentView('audit-results')` | `handleViewAuditResults()` |
| "View History" | Audit History | `setCurrentView('audit-history')` | Direct state change |
| "Review Now" | Review Queue | `setCurrentView('review-queue')` | Direct state change |
| Employee table row | (Conceptual) Employee modal | Would open modal overlay | Not implemented yet |

### Back Navigation Patterns

| From Page | Back Button → Target | Handler |
|-----------|---------------------|---------|
| Bulk Audit Wizard | Dashboard | `onClose()` |
| Audit Results | Dashboard | `onBack()` |
| Audit History | Dashboard | `onBack()` |
| Audit Detail | Audit History | `onBack()` |
| Comprehensive Review | Audit History | `onBackToHistory()` |
| Review Queue | Audit Results | `onBack()` |
| Reports & Insights | Audit Results | `onBack()` |

### Modal Flows (Conceptual)

**Employee Detail Modal** (not yet implemented)
- Trigger: Click employee row in any table
- Display: Overlay modal showing:
  - Employee summary
  - Calculation breakdown
  - Evidence documents
  - Timeline
- Actions: Close, Export, Flag for Review

**Review Decision Modal** (present in Review Queue)
- Trigger: "Review" button on HITL item
- Display: Review details + decision form
- Actions: Approve, Reject, Request More Info

---

## B) Route Table

**Note:** The application uses React state-based navigation, NOT URL-based routing. The "routes" below are conceptual paths representing different application states.

| State Value | Page Name | Purpose | Required Params | Conceptual URL (if routed) |
|-------------|-----------|---------|-----------------|----------------------------|
| `'dashboard'` | Dashboard | Main overview with KPIs | None | `/organisation` |
| `'bulk-audit-wizard'` | Bulk Audit Wizard | 5-step form to submit new audit | None | `/organisation/audit/new` |
| `'audit-results'` | Audit Results | Most recent audit results | `auditId` (optional) | `/organisation/audit/results` |
| `'audit-history'` | Audit History | List of all past audit requests | None | `/organisation/audit/history` |
| `'audit-detail'` | Audit Detail | Detailed view of single audit | `auditId` (required) | `/organisation/audit/{id}` |
| `'comprehensive-review'` | Comprehensive Review | Post-submission review page | `auditId` (required) | `/organisation/audit/{id}/review` |
| `'reports-insights'` | Reports & Insights | Analytics and trends | None | `/organisation/reports` |
| `'review-queue'` | Review Queue | Human-in-the-loop items | None | `/organisation/review-queue` |

### State Management

**Current implementation:**
```typescript
// In OrganisationDashboardWrapper.tsx
type OrganisationView = 
  | 'dashboard'
  | 'bulk-audit-wizard'
  | 'audit-results'
  | 'audit-history'
  | 'audit-detail'
  | 'comprehensive-review'
  | 'reports-insights'
  | 'review-queue';

const [currentView, setCurrentView] = useState<OrganisationView>('dashboard');
const [selectedAuditId, setSelectedAuditId] = useState<string | null>(null);
```

**To convert to URL routing (future):**
- Use React Router or Next.js App Router
- Map each state to a URL path
- Pass `auditId` as URL parameter
- Enable browser back/forward navigation
- Enable direct linking to specific audits

---

## C) Page → TSX Ownership Map

### Primary Components

| Page/View | TSX File | Purpose | Props Interface |
|-----------|----------|---------|-----------------|
| **Main Wrapper** | `/components/dashboards/OrganisationDashboardWrapper.tsx` | State orchestrator, routing logic | `{ onLogout: () => void }` |
| **Dashboard** | `/components/dashboards/OrganisationDashboardPage.tsx` | Main landing page with KPIs | `{ onNewBulkAudit, onViewAuditHistory, onViewReviewQueue, onLogout }` |
| **Bulk Audit Wizard** | `/components/organisation/BulkAuditWizard.tsx` | 5-step audit creation flow | `{ onClose, onComplete, onLogout }` |
| **Audit Results** | `/components/organisation/AuditResultsPage.tsx` | Display results of most recent audit | `{ onBack, onViewHistory, onViewReports, onViewReviewQueue, onLogout }` |
| **Audit History** | `/components/organisation/AuditHistoryPage.tsx` | Searchable list of past audits | `{ onBack, onViewResults, onViewDetail, onNewAudit, onLogout }` |
| **Audit Detail** | `/components/organisation/AuditDetailPage.tsx` | 6-tab detailed audit view | `{ auditId, onBack, onLogout }` |
| **Comprehensive Review** | `/components/organisation/ComprehensiveAuditReview.tsx` | Post-submission review (3 tabs) | `{ auditId, onBackToHistory, onViewReviewQueue, onLogout }` |
| **Reports & Insights** | `/components/organisation/ReportsInsightsPage.tsx` | Analytics and trends | `{ onBack, onViewResults, onLogout }` |
| **Review Queue** | `/components/organisation/ReviewQueuePage.tsx` | Human-in-the-loop decision queue | `{ onBack, onLogout }` |

### Shared Components (Design System)

| Component | File | Purpose | Used By |
|-----------|------|---------|---------|
| **StatusBadge** | `/components/design-system/StatusBadge.tsx` | Running/Done/Needs Review/Failed badges | Agent status displays |
| **SeverityBadge** | `/components/design-system/SeverityBadge.tsx` | OK/Underpaid/Needs Review status | Employee payment status |
| **AnomalyScorePill** | `/components/design-system/AnomalyScorePill.tsx` | 0-100 confidence score display | All employee tables |
| **PageHeader** | `/components/design-system/PageHeader.tsx` | Page title + description | All pages |
| **Card** | `/components/ui/card.tsx` | Card container (shadcn/ui) | All pages |
| **Table** | `/components/ui/table.tsx` | Data table (shadcn/ui) | Employee lists, history |
| **Tabs** | `/components/ui/tabs.tsx` | Tab navigation | Detail pages |
| **Button** | `/components/ui/button.tsx` | All buttons | Everywhere |
| **Badge** | `/components/ui/badge.tsx` | Generic badge | Counts, labels |
| **Progress** | `/components/ui/progress.tsx` | Progress bar | Wizard steps, agent execution |
| **Select** | `/components/ui/select.tsx` | Dropdown selector | Filters |
| **Input** | `/components/ui/input.tsx` | Text input | Search, forms |

### Layout Components

| Component | File | Purpose |
|-----------|------|---------|
| **OrganisationDashboardShell** | `/components/shells/OrganisationDashboardShell.tsx` | Sidebar + top bar wrapper (not used on all pages) |
| **AppShell** | `/components/layouts/AppShell.tsx` | Base layout with navigation |

**Note:** Not all Organisation pages use the sidebar shell. Many standalone pages (Audit History, Detail, Review) implement their own top navigation bar for a cleaner, focused experience.

### Sample Data Location

All pages currently use **inline sample data** defined as constants within each component file:

- `OrganisationDashboardPage.tsx`: `highRiskEmployees` array (lines 13-54)
- `AuditHistoryPage.tsx`: `auditRequests` array (lines 54-110)
- `AuditDetailPage.tsx`: `auditData`, `employees`, `agentSteps` objects (lines 119-300+)
- `ComprehensiveAuditReview.tsx`: `allEmployees` array (lines 83-400+)
- `ReviewQueuePage.tsx`: `reviewItems` array

**To wire to real data:**
- Move sample data to `/data/sampleData.ts` for development
- Replace with API calls: `fetchAuditHistory()`, `fetchAuditDetail(id)`, etc.
- Add loading/error states
- Implement data fetching hooks or services

---

## D) Interaction Map ("What Runs When I Click")

### Dashboard (OrganisationDashboardPage.tsx)

#### 1. "New Bulk Audit" Button (Top-right)
- **Label:** "New Bulk Audit"
- **Location:** Top bar, right side
- **Current behavior:** Static button
- **Intended behavior:** Navigate to Bulk Audit Wizard
- **Action type:** Navigation
- **Handler:** `onClick={onNewBulkAudit}` → wrapper sets state to `'bulk-audit-wizard'`
- **Data:** None
- **UI update:** Full page change to wizard
- **Loading state:** N/A
- **What changes:** Replace entire page content with 5-step wizard

#### 2. "Review Now" Button (Review Queue Card)
- **Label:** "Review Now"
- **Location:** Dashboard → Review Queue card (third KPI card)
- **Current behavior:** Static button
- **Intended behavior:** Navigate to Review Queue page
- **Action type:** Navigation
- **Handler:** `onClick={onViewReviewQueue}` → wrapper sets state to `'review-queue'`
- **Data:** None
- **UI update:** Full page change
- **Loading state:** N/A

#### 3. High-Risk Employee Table Row Click
- **Label:** Employee name (e.g., "Ava Nguyen")
- **Location:** Dashboard → High-Risk Employees table → Any row
- **Current behavior:** No interaction (rows not clickable)
- **Intended behavior:** Open employee detail modal or navigate to employee page
- **Action type:** Modal open (conceptual)
- **Handler location:** Would add `onClick` to `<TableRow>` element
- **Data read:** `employee` object from `highRiskEmployees` array
- **UI update:** Modal overlay displaying:
  - Employee summary (name, role, amount)
  - Calculation breakdown
  - Evidence documents
  - Timeline of processing
- **What to implement:**
  - Add `cursor-pointer` and `hover:bg-muted` to table rows
  - Create `EmployeeDetailModal` component
  - Pass selected employee data to modal
  - Add close button to modal

#### 4. "View All Results" Button
- **Label:** "View All Results" (below high-risk table)
- **Location:** Dashboard → below employee table
- **Current behavior:** Static button
- **Intended behavior:** Navigate to Audit Results page showing most recent audit
- **Action type:** Navigation
- **Handler:** `onClick` would trigger navigation to audit results
- **Data:** Would load most recent audit ID
- **UI update:** Full page change to Audit Results

#### 5. "View History" Link
- **Label:** "View History" (in Recent Audits section)
- **Location:** Dashboard → Recent Audits card
- **Current behavior:** Static link (if present)
- **Intended behavior:** Navigate to Audit History page
- **Action type:** Navigation
- **Handler:** `onClick={onViewAuditHistory}`

---

### Bulk Audit Wizard (BulkAuditWizard.tsx)

#### Step Navigation

| Step | Button | Action | Validation Required | Handler |
|------|--------|--------|---------------------|---------|
| 1 → 2 | "Next" | Advance to step 2 | Organisation type, name, state | `handleNext()` checks form fields |
| 2 → 3 | "Next" | Advance to step 3 | Award selected OR enterprise agreement uploaded | Form validation |
| 3 → 4 | "Upload Files" | Process ZIP file, advance | Valid ZIP file with matching structure | `handleUpload()` + loading state |
| 4 → 5 | "Configure & Run" | Start agent processing | Review threshold, audit mode | `handleStartAudit()` |
| 5 → Done | (Automatic after completion) | Navigate to Comprehensive Review | N/A | `onComplete()` after agents finish |
| Any step | "Cancel" / Close | Return to dashboard | None | `onClose()` |

#### Step 1: Organisation Setup
- **Input fields:** Organisation type (select), Organisation name (text), State (select)
- **Handler location:** Local state in `BulkAuditWizard.tsx`
- **Data stored:** Form state object
- **Validation:** All fields required before Next
- **API call (future):** `POST /api/organisation/validate` to check if org exists

#### Step 2: Award Selection
- **Options:** Select award from dropdown OR upload enterprise agreement
- **Handler:** File input `onChange` event
- **Data:** Selected award slug OR uploaded file name
- **Validation:** At least one option required
- **API call (future):** `GET /api/awards/list`, `POST /api/awards/upload`

#### Step 3: Upload Payroll Data
- **UI:** Drag-and-drop zone OR "Browse Files" button
- **Accepts:** `.zip` file containing contracts, timesheets, payslips
- **Handler:** `handleUpload(file)`
- **Current behavior:** Simulated upload with progress bar
- **Intended behavior:**
  - Upload file to server
  - Parse ZIP structure
  - Validate file contents (contracts.csv, timesheets.csv, payslips.csv)
  - Auto-map columns if possible
  - Show preview of detected structure
- **Loading state:** Progress bar from 0-100%
- **API call:** `POST /api/audit/upload` (multipart/form-data)
- **Success response:** `{ structureDetected, employeeCount, errors[] }`

#### Step 4: Configure Audit
- **Options:**
  - Review threshold (slider: confidence < 0.70)
  - Audit mode (radio: Show all vs. Show flagged only)
- **Handler:** Local state updates
- **Data:** Configuration object `{ threshold, mode }`
- **Button:** "Configure & Run"
- **Intended behavior:** Store config, trigger audit run

#### Step 5: Processing
- **Display:** 10 agent progress indicators with live status updates
- **Current behavior:** Simulated progress with setTimeout
- **Intended behavior:**
  - WebSocket connection to backend
  - Real-time updates as agents complete
  - Show agent name, status (Running/Done/Failed), duration
  - Show any errors or warnings
- **Agents (10 total):**
  1. Document Parser
  2. Award Interpreter
  3. Classification Mapper
  4. Contract Analyzer
  5. Time Calculator
  6. Rate Validator
  7. Penalty Detector
  8. Evidence Collector
  9. Confidence Scorer
  10. Report Generator
- **Completion:** Auto-navigate to Comprehensive Review page
- **API interaction:**
  - `POST /api/audit/start` → returns `{ auditId, websocketUrl }`
  - WebSocket: `ws://api/audit/{id}/progress`
  - Receives: `{ agentId, status, progress, message }`

---

### Audit History (AuditHistoryPage.tsx)

#### 1. Search Box
- **Label:** "Search by Request ID or pay period..."
- **Location:** Top of page, left side
- **Current behavior:** Filters list by matching `requestId` or `payPeriod` fields
- **Handler:** `onChange={(e) => setSearchQuery(e.target.value)}`
- **Data:** Local state `searchQuery`
- **UI update:** Table rows filter in real-time
- **Implementation:** Client-side filter using `.includes()`

#### 2. Status Filter Dropdown
- **Label:** "All Status" (Select component)
- **Location:** Next to search box
- **Options:** All, Completed, In Progress, Failed
- **Current behavior:** Filters list by status
- **Handler:** `onValueChange={setStatusFilter}`
- **Data:** Local state `statusFilter`
- **UI update:** Table rows filter
- **Implementation:** Client-side `.filter()`

#### 3. "Underpaid Only" Checkbox
- **Label:** "Show underpaid only"
- **Location:** Right side of filters row
- **Current behavior:** Filters to audits with `underpaidCount > 0`
- **Handler:** `onCheckedChange={setUnderpaidOnlyFilter}`
- **Data:** Boolean state
- **UI update:** Table rows filter

#### 4. Audit Request Table Row Click
- **Label:** Any row in the table
- **Location:** Main table body
- **Current behavior:** Static (not clickable)
- **Intended behavior:** Navigate to Audit Detail page
- **Action type:** Navigation
- **Handler:** `onClick={() => onViewDetail(request.id)}`
- **Data:** `request.id` passed to `setSelectedAuditId()`
- **UI update:** Full page change to Audit Detail (6 tabs)
- **Implementation needed:** Add `cursor-pointer` class and click handler to rows

#### 5. "View Results" Button (per row)
- **Label:** Icon button (eye icon) or "View" text button
- **Location:** Action column in each table row
- **Current behavior:** May be present as icon
- **Intended behavior:** Navigate to Audit Results page for that specific audit
- **Handler:** `onClick={(e) => { e.stopPropagation(); onViewResults(request.id); }}`
- **Data:** Specific audit ID
- **Note:** `stopPropagation()` prevents row click event

#### 6. "Download Report" Button (per row)
- **Label:** Download icon
- **Location:** Action column
- **Current behavior:** Static
- **Intended behavior:** Generate and download PDF/Excel report
- **Action type:** File download
- **API call:** `GET /api/audit/{id}/report?format=pdf`
- **Handler:** Trigger browser download
- **Loading state:** Show spinner on icon while generating

#### 7. "New Audit" Button (Top-right)
- **Label:** "New Audit"
- **Location:** Top navigation bar
- **Handler:** `onClick={onNewAudit}` → navigates to Bulk Audit Wizard
- **Action type:** Navigation

#### 8. Export/Download Actions (Conceptual)
- **Label:** "Export History" button
- **Location:** Top-right area
- **Intended behavior:** Export full audit history as CSV or Excel
- **API call:** `GET /api/audit/history/export`
- **Implementation:** Generate CSV client-side or fetch from API

---

### Audit Detail Page (AuditDetailPage.tsx)

**6-Tab Structure:** Inputs, Processing & Agents, Employee Results, Analytics & Insights, Human Review (HITL), Audit Timeline

#### Tab 1: Original Inputs

**Display Only (No Interactions):**
- Organisation details (read-only)
- Pay period (read-only)
- Award/enterprise agreement (read-only)
- Uploaded file name (read-only)
- Detected structure (contracts, worksheets, payslips count)
- Audit configuration (threshold, mode)

**Possible Action:**
- "Download Original Files" button
  - Action: Download ZIP of originally uploaded files
  - API: `GET /api/audit/{id}/original-files`

#### Tab 2: Processing & Agents

**Agent Execution Table:**
- Shows 10 agents with status badges (Done, Running, Failed)
- Duration, errors, retries columns

**Interactions:**
1. **Expand/Collapse Agent Details**
   - Label: Chevron icon on each row
   - Action: Toggle expanded view showing detailed logs
   - Handler: `setExpandedAgents(prev => ({ ...prev, [agentId]: !prev[agentId] }))`
   - UI update: Show/hide log panel below row

2. **"Retry Failed Agent" Button** (if agent failed)
   - Label: "Retry"
   - Location: Agent row action column
   - Action: Re-run specific agent
   - API: `POST /api/audit/{id}/agent/{agentId}/retry`
   - Loading state: Show spinner, disable button
   - Success: Update agent status to Running, then Done
   - UI update: Agent row status changes

3. **"View Agent Logs" Link**
   - Action: Open modal or expand section with full logs
   - Display: Timestamped log entries
   - Handler: `setSelectedAgentLogs(agentId)`

#### Tab 3: Employee Results

**Employee Table with Filtering:**

**1. Search Box**
- Handler: `onChange={(e) => setSearchQuery(e.target.value)}`
- Filters: Employee name, ID, role

**2. Status Filter Dropdown**
- Options: All, OK, Underpaid, Needs Review
- Handler: `onValueChange={setStatusFilter}`

**3. Sort Options** (Conceptual)
- Columns: Name, Underpayment Amount, Anomaly Score, Confidence
- Handler: `onClick` on column header
- Logic: Sort array by selected field, toggle ASC/DESC

**4. Table Row Click**
- Action: Open employee detail modal or expand row
- Handler: `onClick={() => setSelectedEmployee(employee)}`
- UI update: Modal/drawer displays:
  - Summary (status, amounts)
  - Calculation breakdown (line items)
  - Evidence documents (contract, timesheet, payslip excerpts)
  - AI explanation
  - Award clause citations

**5. Row Actions:**
- **"Flag for Review" Icon** (if status = underpaid but not in HITL queue)
  - Action: Add employee to review queue
  - API: `POST /api/hitl/add` with employee ID
  - UI update: Status changes to "needs-review", badge updates
  
- **"Export Evidence Pack" Icon**
  - Action: Download PDF with all evidence for this employee
  - API: `GET /api/audit/{id}/employee/{empId}/evidence`

**6. Bulk Actions** (Conceptual)
- Select multiple employees (checkboxes)
- Actions: "Flag All", "Export Selected", "Approve All"

#### Tab 4: Analytics & Insights

**Interactive Charts:**

**1. Payment Status Distribution (Pie Chart)**
- Display: OK, Underpaid, Needs Review counts
- Interaction: Click slice to filter employee table
- Handler: `onClick={(data) => setStatusFilter(data.name)}`

**2. Underpayment by Day of Week (Bar Chart)**
- Display: Total underpayment aggregated by day
- Interaction: Hover for tooltip, click to drill down
- Data: Pre-calculated in audit result

**3. Underpayment by Pay Code (Bar Chart)**
- Display: Top pay codes with issues (evening, weekend, overtime)
- Interaction: Click to see affected employees
- Handler: `onClick={(data) => filterByPayCode(data.payCode)}`

**4. Root Cause Analysis Cards**
- Display: Top 3 issues (e.g., "Evening hours at ordinary rate")
- Interaction: Click to filter employees with this issue
- Handler: `onClick={() => setReasonFilter(reason)}`

**5. High-Risk Pattern Recommendations**
- Display: List of patterns detected
- Interaction: Click "View Affected Employees" link
- Action: Filter employee table by pattern

**6. Export Analytics Button**
- Label: "Export Analytics Report"
- Action: Generate PDF/Excel with charts and insights
- API: `GET /api/audit/{id}/analytics/export`

#### Tab 5: Human Review (HITL)

**Review Queue Items:**

**1. Review Item Cards/Table**
- Display: Employees flagged for human review
- Shows: Name, issue type, confidence score, primary reason

**2. "Review" Button per Item**
- Label: "Review"
- Action: Open review decision modal
- Handler: `onClick={() => setSelectedReviewItem(item)}`
- Modal displays:
  - Employee details
  - AI explanation
  - Evidence documents
  - Decision form: Approve AI decision / Override / Request more info
  - Notes textarea
  - Submit/Cancel buttons

**3. Decision Submission**
- Label: "Submit Decision"
- Handler: `handleSubmitDecision(itemId, decision, notes)`
- API: `POST /api/hitl/decision`
- Request: `{ auditId, employeeId, decision, reviewerNotes }`
- Success: Remove item from queue, update employee status
- UI update: Item removed, queue count decreases

**4. "Approve All AI Decisions" Button** (Batch action)
- Label: "Approve All" (with confirmation)
- Action: Bulk approve all items in current queue
- Handler: Show confirmation modal, then submit
- API: `POST /api/hitl/batch-approve`
- UI update: Clear queue, show success toast

**5. Filter by Issue Type**
- Options: Allowance ambiguity, Classification uncertain, Missing data
- Handler: Filter review items by issue type

#### Tab 6: Audit Timeline

**Display Only (No Interactions):**
- Chronological list of events:
  - Audit submitted
  - Processing started
  - Each agent completion
  - HITL decisions
  - Report generated
  - Audit completed

**Possible Interactions:**
1. **Filter by Actor** (System, AI Agent, Human Reviewer)
2. **Filter by Event Type** (Submission, Processing, Decision, Export)
3. **Export Timeline** button → CSV of all events

---

### Comprehensive Audit Review (ComprehensiveAuditReview.tsx)

**3-Tab Structure:** All Employees, Analytics & Insights, Human Review

#### Tab 1: All Employees

**Same as "Employee Results" in Audit Detail Tab 3** (see above)

Additional actions:
- **"Save to History" Button**
  - Label: "Save & Return to History"
  - Action: Finalize audit, navigate back
  - Handler: `onBackToHistory()`
  - Note: Already auto-saved, this is just navigation

#### Tab 2: Analytics & Insights

**Same as Audit Detail Tab 4** (see above)

#### Tab 3: Human Review

**Same as Audit Detail Tab 5** (see above)

Additional action:
- **"Go to Full Review Queue" Button**
  - Label: "View All in Review Queue"
  - Action: Navigate to standalone Review Queue page
  - Handler: `onClick={onViewReviewQueue}`

---

### Review Queue (ReviewQueuePage.tsx)

**Dedicated page for HITL items across ALL audits**

#### 1. Queue Items Table
- Display: All pending review items from all recent audits
- Columns: Employee, Audit ID, Issue, Confidence, Age (days pending)

#### 2. Sort by Priority
- Options: Oldest first, Lowest confidence, Highest underpayment
- Handler: `onValueChange={setSortBy}`
- Logic: Client-side sort or API call

#### 3. Filter by Issue Type
- Options: Same as in Audit Detail HITL tab
- Handler: `setIssueTypeFilter`

#### 4. "Review" Button per Item
- **Same as Audit Detail HITL tab** (see above)

#### 5. Batch Actions
- **"Assign to Reviewer" Dropdown** (Multi-select + assign)
  - For multi-user systems
  - API: `POST /api/hitl/assign`
  
- **"Escalate Selected" Button**
  - Mark items for senior review
  - API: `POST /api/hitl/escalate`

#### 6. "Back to Results" Button
- Label: "Back"
- Action: Navigate to previous page (Audit Results or Dashboard)
- Handler: `onClick={onBack}`

---

### Reports & Insights (ReportsInsightsPage.tsx)

**Conceptual page for cross-audit analytics and trends**

#### Current Status: Partially Implemented

#### 1. Date Range Selector
- **Label:** "From [date] to [date]"
- **Action:** Filter reports by date range
- **Handler:** `setDateRange({ start, end })`
- **API:** `GET /api/reports/metrics?start=...&end=...`

#### 2. Report Types (Cards/Tabs)
- **Compliance Overview:** Overall pass/fail rates
- **Underpayment Trends:** Month-over-month liability
- **Risk Heatmap:** By department, role, pay code
- **Cost Analysis:** Estimated remediation costs

#### 3. Export Options
- **"Export as PDF" Button**
  - Generates executive summary report
  - API: `GET /api/reports/export?format=pdf`
  
- **"Export as Excel" Button**
  - Raw data with charts
  - API: `GET /api/reports/export?format=xlsx`

#### 4. Schedule Reports (Future Feature)
- **"Schedule Recurring Report" Button**
- **Action:** Set up weekly/monthly automated reports
- **API:** `POST /api/reports/schedule`

---

## E) Data Model Reference

**Note:** These TypeScript interfaces are for documentation and type safety. They represent the expected data structure when the app is connected to a real backend.

### Core Types

```typescript
// ============================================================
// AUDIT REQUEST & RESPONSE
// ============================================================

/**
 * Represents a single bulk audit request/submission
 */
interface AuditRequest {
  id: string;                          // Unique audit ID (e.g., "AUD-2025-004")
  requestId: string;                   // Human-readable ID (same as id or formatted)
  organisationId: string;              // FK to organisation
  organisationName: string;            // Display name
  organisationType: OrganisationType;  // Childcare, Retail, Healthcare, etc.
  state: AustralianState;              // VIC, NSW, QLD, etc.
  
  // Award/Agreement
  awardId?: string;                    // FK to award database
  awardName?: string;                  // e.g., "Children's Services Award 2010"
  enterpriseAgreementFile?: string;    // S3 path to uploaded EA
  
  // Pay period
  payPeriodStart: Date;
  payPeriodEnd: Date;
  payPeriodLabel: string;              // "01–14 Aug 2025"
  
  // Input files
  zipFileUrl: string;                  // S3 path to uploaded ZIP
  detectedStructure: {
    contractsCount: number;
    worksheetsCount: number;
    payslipsCount: number;
    otherFiles?: string[];
  };
  
  // Configuration
  humanReviewThreshold: number;        // Confidence threshold (e.g., 0.70)
  auditMode: 'all' | 'flagged-only';   // Show all employees or just issues
  
  // Status
  status: AuditStatus;                 // 'pending' | 'processing' | 'completed' | 'failed'
  
  // Results summary
  employeesChecked: number;
  okCount: number;                     // Correctly paid
  underpaidCount: number;              // Detected underpayment
  needsReviewCount: number;            // Flagged for human review
  estimatedUnderpayment: number;       // Total liability in dollars
  
  // Metadata
  submittedBy: string;                 // User ID
  submittedDate: Date;
  completedDate?: Date;
  processingDuration?: number;         // Seconds
  
  // Agent execution
  agentSteps?: AgentStep[];
  
  // Related records
  employeeResults?: EmployeeResult[];
  reviewItems?: HITLReviewItem[];
}

type AuditStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
type OrganisationType = 'childcare' | 'retail' | 'healthcare' | 'hospitality' | 'other';
type AustralianState = 'NSW' | 'VIC' | 'QLD' | 'SA' | 'WA' | 'TAS' | 'NT' | 'ACT';

/**
 * Represents a single employee's audit result within an audit request
 */
interface EmployeeResult {
  id: string;                          // Unique result ID
  auditId: string;                     // FK to parent audit
  
  // Employee identification
  employeeId: string;                  // From uploaded data (e.g., "E-014")
  employeeName: string;
  role: string;                        // Job title
  employmentType: EmploymentType;      // Full-time, Part-time, Casual
  department?: string;
  
  // Payment status
  status: PaymentStatus;               // 'ok' | 'underpaid' | 'needs-review'
  
  // Amounts
  paidAmount: number;                  // What they received
  entitledAmount: number;              // What they should have received
  underpayment: number;                // Difference (entitledAmount - paidAmount)
  
  // AI analysis
  anomalyScore: number;                // 0-100 confidence score
  confidence: number;                  // 0.0-1.0 probability
  primaryReason: string;               // Short summary (e.g., "Evening hours at ordinary rate")
  explanation: string;                 // Detailed AI-generated explanation
  
  // HITL
  hitlRequired: boolean;               // True if confidence < threshold
  hitlStatus?: HITLStatus;             // 'pending' | 'approved' | 'overridden'
  reviewedBy?: string;                 // Reviewer user ID
  reviewedDate?: Date;
  reviewerNotes?: string;
  
  // Evidence
  evidence: EmployeeEvidence;
  
  // Calculation breakdown
  calculationDetails?: CalculationLine[];
  
  // Timeline
  processedDate: Date;
  lastUpdated: Date;
}

type EmploymentType = 'full-time' | 'part-time' | 'casual';
type PaymentStatus = 'ok' | 'underpaid' | 'needs-review';
type HITLStatus = 'pending' | 'approved' | 'overridden' | 'escalated';

/**
 * Evidence documents and citations for an employee
 */
interface EmployeeEvidence {
  contract?: {
    fileName: string;
    excerpt: string;                   // Relevant clause text
    s3Url?: string;                    // Full document
  };
  worksheet?: {
    fileName: string;
    excerpt: string;                   // Relevant rows (e.g., timesheet entries)
    s3Url?: string;
  };
  payslip?: {
    fileName: string;
    excerpt: string;                   // Relevant pay lines
    s3Url?: string;
  };
  awardClauses?: AwardClauseCitation[];
}

interface AwardClauseCitation {
  clauseNumber: string;                // e.g., "25.3"
  clauseTitle: string;                 // e.g., "Evening penalty rates"
  text: string;                        // Full clause text
  page?: number;                       // Page in award PDF
  relevance: string;                   // Why this clause applies
}

/**
 * Line-item calculation breakdown
 */
interface CalculationLine {
  id: string;
  lineNumber: number;
  description: string;                 // "Evening hours 6pm-9pm Wed"
  hoursWorked: number;
  rateType: string;                    // "Evening", "Ordinary", "Saturday", etc.
  ratePaid: number;                    // $/hr actually paid
  rateEntitled: number;                // $/hr should be paid
  amountPaid: number;
  amountEntitled: number;
  difference: number;                  // Underpayment for this line
  awardClause?: string;                // Reference
}

// ============================================================
// AGENT EXECUTION
// ============================================================

/**
 * Represents one agent in the 10-agent pipeline
 */
interface AgentStep {
  id: string;
  auditId: string;
  
  // Agent details
  agentName: string;                   // "Document Parser", "Rate Validator", etc.
  agentType: AgentType;
  sequenceNumber: number;              // 1-10 execution order
  
  // Execution status
  status: AgentStatus;                 // 'pending' | 'running' | 'done' | 'failed'
  
  // Timing
  startedAt?: Date;
  completedAt?: Date;
  duration?: number;                   // Seconds
  
  // Errors
  errors: number;                      // Count of errors
  retries: number;                     // Retry attempts
  errorMessage?: string;               // If failed
  
  // Logs
  logs?: AgentLogEntry[];
}

type AgentType = 
  | 'document-parser'
  | 'award-interpreter'
  | 'classification-mapper'
  | 'contract-analyzer'
  | 'time-calculator'
  | 'rate-validator'
  | 'penalty-detector'
  | 'evidence-collector'
  | 'confidence-scorer'
  | 'report-generator';

type AgentStatus = 'pending' | 'running' | 'done' | 'failed' | 'skipped';

interface AgentLogEntry {
  timestamp: Date;
  level: 'info' | 'warning' | 'error';
  message: string;
  metadata?: Record<string, any>;
}

// ============================================================
// HUMAN-IN-THE-LOOP (HITL) REVIEW
// ============================================================

/**
 * An item requiring human review
 */
interface HITLReviewItem {
  id: string;
  auditId: string;
  employeeResultId: string;
  
  // Context
  employeeName: string;
  employeeId: string;
  
  // Issue details
  issueType: HITLIssueType;
  description: string;                 // Why flagged
  aiRecommendation: string;            // What AI thinks
  confidence: number;                  // AI confidence (low)
  
  // Priority
  priority: 'low' | 'medium' | 'high' | 'urgent';
  age: number;                         // Days pending
  
  // Assignment
  assignedTo?: string;                 // Reviewer user ID
  assignedDate?: Date;
  
  // Decision
  status: HITLStatus;
  decision?: HITLDecision;
  decidedBy?: string;
  decidedDate?: Date;
  reviewerNotes?: string;
  
  // Metadata
  createdDate: Date;
  lastUpdated: Date;
}

type HITLIssueType = 
  | 'allowance-ambiguity'
  | 'classification-uncertain'
  | 'missing-data'
  | 'enterprise-agreement-clause'
  | 'conflicting-information'
  | 'complex-penalty-calculation'
  | 'other';

interface HITLDecision {
  decision: 'approve-ai' | 'override' | 'request-more-info' | 'escalate';
  overriddenStatus?: PaymentStatus;    // If override
  overriddenAmount?: number;           // If override
  reasoning: string;                   // Reviewer explanation
  attachments?: string[];              // Additional evidence URLs
}

// ============================================================
// ANALYTICS & INSIGHTS
// ============================================================

/**
 * Aggregated analytics for an audit or across audits
 */
interface AuditAnalytics {
  auditId?: string;                    // Specific audit, or null for cross-audit
  dateRange?: {
    start: Date;
    end: Date;
  };
  
  // Distribution
  paymentStatusDistribution: {
    ok: number;
    underpaid: number;
    needsReview: number;
  };
  
  // Root causes (top issues)
  rootCauses: RootCauseAnalysis[];
  
  // By dimension
  underpaymentByDayOfWeek: DayOfWeekMetric[];
  underpaymentByPayCode: PayCodeMetric[];
  underpaymentByRole: RoleMetric[];
  underpaymentByEmploymentType: EmploymentTypeMetric[];
  
  // Trends (if cross-audit)
  monthlyTrends?: MonthlyTrend[];
  
  // Risk patterns
  highRiskPatterns: RiskPattern[];
}

interface RootCauseAnalysis {
  reason: string;                      // e.g., "Evening hours at ordinary rate"
  employeeCount: number;               // How many affected
  totalUnderpayment: number;           // $ impact
  percentage: number;                  // % of total issues
  recommendation: string;              // How to fix
}

interface DayOfWeekMetric {
  day: string;                         // "Monday", "Tuesday", etc.
  underpaymentAmount: number;
  employeeCount: number;
}

interface PayCodeMetric {
  payCode: string;                     // "Evening", "Weekend", "Overtime", etc.
  underpaymentAmount: number;
  employeeCount: number;
  color: string;                       // For chart
}

interface RoleMetric {
  role: string;                        // "Educator", "Room Leader", etc.
  underpaymentAmount: number;
  employeeCount: number;
}

interface EmploymentTypeMetric {
  employmentType: EmploymentType;
  underpaymentAmount: number;
  employeeCount: number;
}

interface MonthlyTrend {
  month: string;                       // "Aug 2025"
  totalAudits: number;
  totalEmployeesChecked: number;
  underpaidCount: number;
  totalLiability: number;
  complianceRate: number;              // % OK
}

interface RiskPattern {
  id: string;
  pattern: string;                     // "Casual employees consistently missing weekend penalties"
  severity: 'low' | 'medium' | 'high' | 'critical';
  employeesAffected: number;
  estimatedImpact: number;             // $ per pay period
  recommendation: string;
  awardClause?: string;
}

// ============================================================
// TIMELINE & AUDIT TRAIL
// ============================================================

/**
 * Audit trail event
 */
interface TimelineEvent {
  id: string;
  auditId: string;
  
  // Event details
  timestamp: Date;
  eventType: TimelineEventType;
  actor: string;                       // User ID, "System", or "AI Agent"
  actorName: string;                   // Display name
  
  // What happened
  event: string;                       // Short summary
  details: string;                     // Detailed description
  metadata?: Record<string, any>;      // Additional context
  
  // Related records
  employeeId?: string;                 // If employee-specific
  agentId?: string;                    // If agent-related
}

type TimelineEventType =
  | 'audit-submitted'
  | 'processing-started'
  | 'agent-completed'
  | 'agent-failed'
  | 'employee-flagged'
  | 'hitl-decision'
  | 'report-generated'
  | 'audit-completed'
  | 'export-downloaded'
  | 'audit-cancelled';

// ============================================================
// REPORT GENERATION
// ============================================================

/**
 * Export/report configuration
 */
interface ReportRequest {
  auditId?: string;                    // Specific audit, or null for cross-audit
  reportType: ReportType;
  format: 'pdf' | 'excel' | 'csv';
  
  // Filters
  dateRange?: { start: Date; end: Date };
  includeEmployees?: boolean;
  includeCalculations?: boolean;
  includeEvidence?: boolean;
  includeAnalytics?: boolean;
  
  // Recipients (for scheduled reports)
  recipients?: string[];               // Email addresses
}

type ReportType = 
  | 'executive-summary'
  | 'detailed-audit'
  | 'compliance-overview'
  | 'underpayment-analysis'
  | 'employee-evidence-pack'
  | 'hitl-decisions';

// ============================================================
// USER & ORGANISATION
// ============================================================

/**
 * Organisation/Auditor user
 */
interface OrganisationUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'hr-manager' | 'auditor' | 'reviewer';
  
  // Organisation
  organisationId: string;
  organisationName: string;
  
  // Permissions
  canCreateAudits: boolean;
  canReviewHITL: boolean;
  canExportReports: boolean;
  canManageUsers: boolean;
  
  // Metadata
  createdDate: Date;
  lastLogin?: Date;
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
    pagination?: PaginationMeta;
  };
}

interface PaginationMeta {
  page: number;
  pageSize: number;
  totalPages: number;
  totalRecords: number;
  hasNext: boolean;
  hasPrevious: boolean;
}
```

---

## F) Implementation Guidelines

### Overview
This section explains HOW a developer would wire the existing UI to real backend systems, APIs, and databases. It does NOT provide implementation code, but conceptual steps and file locations.

---

### 1. Replace Sample Data with API Calls

#### Current State
All Organisation pages use inline sample data arrays:
- `OrganisationDashboardPage.tsx`: Lines 13-54 (`highRiskEmployees`)
- `AuditHistoryPage.tsx`: Lines 54-110 (`auditRequests`)
- `AuditDetailPage.tsx`: Lines 119-300+ (multiple data objects)
- `ComprehensiveAuditReview.tsx`: Lines 83-400+ (`allEmployees`)
- `ReviewQueuePage.tsx`: Inline `reviewItems`

#### Steps to Replace with Real Data

**Step 1: Create API Service Layer**
- Create new file: `/services/auditApi.ts`
- Define functions:
  ```typescript
  // Conceptual structure (not actual code)
  export async function fetchAuditHistory(params?: FilterParams): Promise<AuditRequest[]>
  export async function fetchAuditDetail(auditId: string): Promise<AuditRequest>
  export async function fetchEmployeeResults(auditId: string): Promise<EmployeeResult[]>
  export async function submitBulkAudit(data: FormData): Promise<{ auditId: string }>
  export async function fetchHITLQueue(): Promise<HITLReviewItem[]>
  export async function submitHITLDecision(itemId: string, decision: HITLDecision): Promise<void>
  ```
- Use `fetch()` or `axios` for HTTP requests
- Handle errors and return typed data

**Step 2: Add Data Fetching Hooks**
- Create custom hooks in `/hooks/useAuditData.ts`:
  ```typescript
  // Conceptual
  export function useAuditHistory() {
    const [data, setData] = useState<AuditRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    
    useEffect(() => {
      // Fetch data on mount
      fetchAuditHistory()
        .then(setData)
        .catch(setError)
        .finally(() => setLoading(false));
    }, []);
    
    return { data, loading, error, refetch };
  }
  ```

**Step 3: Replace Sample Data in Components**
- In `AuditHistoryPage.tsx`:
  - Remove `const auditRequests = [...]` array (lines 54-110)
  - Add: `const { data: auditRequests, loading, error } = useAuditHistory()`
  - Add loading spinner: `{loading && <LoadingSpinner />}`
  - Add error display: `{error && <ErrorAlert message={error.message} />}`
  - Use `auditRequests` from API instead of hardcoded data

**Step 4: Repeat for All Pages**
- `OrganisationDashboardPage.tsx`: Fetch high-risk employees from `/api/dashboard/metrics`
- `AuditDetailPage.tsx`: Fetch audit detail from `/api/audit/{id}`
- `ComprehensiveAuditReview.tsx`: Fetch employee results from `/api/audit/{id}/employees`
- `ReviewQueuePage.tsx`: Fetch HITL queue from `/api/hitl/queue`

---

### 2. Connect Filters, Sorting, and Pagination

#### Current State
Filtering is implemented **client-side** using `.filter()` and `.includes()` on arrays.

#### Steps to Implement Server-Side Filtering

**Step 1: Add Query Parameters to API Calls**
- Modify API functions to accept filter parameters:
  ```typescript
  // Conceptual
  interface AuditHistoryParams {
    search?: string;
    status?: string;
    underpaidOnly?: boolean;
    page?: number;
    pageSize?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }
  
  export async function fetchAuditHistory(params: AuditHistoryParams): Promise<{
    data: AuditRequest[];
    pagination: PaginationMeta;
  }>
  ```

**Step 2: Update UI to Trigger API Calls on Filter Change**
- In `AuditHistoryPage.tsx`:
  - When user types in search box:
    - Debounce input (use `useDebounce` hook)
    - Call `refetch({ search: query })`
  - When user changes status dropdown:
    - Call `refetch({ status: value })`
  - Combine all filters into single API call

**Step 3: Add Pagination Controls**
- Display pagination UI at bottom of table
- Track current page in state: `const [page, setPage] = useState(1)`
- On page change, call `refetch({ page: newPage })`
- Display: "Showing 1-20 of 150 results"

**Step 4: Add Sorting**
- Make table column headers clickable
- Track sort state: `const [sortBy, setSortBy] = useState('submittedDate')`
- On column click:
  - Toggle sort order (asc/desc)
  - Call `refetch({ sortBy, sortOrder })`
- Display sort indicator (up/down arrow) on active column

---

### 3. Implement Bulk Audit Wizard with Real Upload

#### Current State
Bulk Audit Wizard simulates file upload with `setTimeout()` and shows fake progress.

#### Steps to Implement Real Upload

**Step 1: File Upload to Server**
- In `BulkAuditWizard.tsx`, Step 3:
  - On file drop/select, create `FormData`:
    ```typescript
    const formData = new FormData();
    formData.append('file', zipFile);
    formData.append('organisationType', orgType);
    formData.append('organisationName', orgName);
    // ... other form fields
    ```
  - Send to API: `POST /api/audit/upload`
  - Show real upload progress using `XMLHttpRequest.upload.onprogress` or `axios` progress callback
  - Update progress bar: `setUploadProgress(percentage)`

**Step 2: Validate ZIP Structure**
- Backend validates file and returns:
  ```json
  {
    "success": true,
    "structureDetected": {
      "contractsCount": 12,
      "worksheetsCount": 12,
      "payslipsCount": 12
    },
    "errors": []
  }
  ```
- Display structure in UI
- If errors, show in error list with actionable messages

**Step 3: Start Audit Processing**
- On "Configure & Run" button (Step 4):
  - Send config to API: `POST /api/audit/start`
  - Receive response: `{ auditId: "AUD-2025-004", websocketUrl: "ws://..." }`
  - Store `auditId` in state

**Step 4: Real-Time Agent Updates via WebSocket**
- In Step 5 (Processing):
  - Connect to WebSocket: `const ws = new WebSocket(websocketUrl)`
  - Listen for messages:
    ```typescript
    ws.onmessage = (event) => {
      const update = JSON.parse(event.data);
      // update = { agentId, status, progress, message }
      updateAgentStatus(update.agentId, update);
    };
    ```
  - Update agent cards in real-time
  - Show live status: Running → Done
  - Display duration, errors

**Step 5: Completion Redirect**
- When all agents complete:
  - Receive final message: `{ type: 'AUDIT_COMPLETE', auditId }`
  - Navigate to Comprehensive Review: `onComplete(auditId)`

---

### 4. Implement Review Queue Actions

#### Current State
Review Queue displays items but buttons are static.

#### Steps to Implement HITL Workflow

**Step 1: Fetch Queue Items**
- In `ReviewQueuePage.tsx`:
  - Replace sample data with API call:
    ```typescript
    const { data: reviewItems, loading, error, refetch } = useHITLQueue();
    ```

**Step 2: Open Review Modal**
- On "Review" button click:
  - Set selected item in state: `setSelectedReviewItem(item)`
  - Open modal: `setIsReviewModalOpen(true)`
  - Modal displays:
    - Employee details
    - AI explanation
    - Evidence documents
    - Decision form with options:
      - [ ] Approve AI decision
      - [ ] Override (requires new status/amount)
      - [ ] Request more information
    - Notes textarea

**Step 3: Submit Decision**
- On "Submit Decision" button:
  - Validate form (decision selected, notes if override)
  - Call API: `POST /api/hitl/decision`
  - Request body:
    ```json
    {
      "itemId": "...",
      "decision": "approve-ai",
      "notes": "Confirmed with payroll records",
      "overriddenStatus": null,
      "overriddenAmount": null
    }
    ```
  - On success:
    - Remove item from queue UI
    - Show success toast: "Decision submitted"
    - Refetch queue: `refetch()`

**Step 4: Batch Actions**
- "Approve All" button:
  - Show confirmation modal: "Approve all 8 items?"
  - On confirm, call: `POST /api/hitl/batch-approve`
  - Clear queue, show success message

**Step 5: Update Related Pages**
- When decision is made, update:
  - Dashboard: Review Queue count decreases
  - Audit Detail HITL tab: Item removed
  - Employee result: Status changes to "approved" or "overridden"

---

### 5. Populate Reports & Insights with Real Metrics

#### Current State
`ReportsInsightsPage.tsx` may have placeholder content or static charts.

#### Steps to Implement Analytics

**Step 1: Fetch Aggregated Metrics**
- Create API endpoint: `GET /api/reports/analytics`
- Query params:
  ```typescript
  {
    dateRange: { start: '2025-06-01', end: '2025-08-31' },
    organisationId: '...'
  }
  ```
- Response: `AuditAnalytics` object (see Data Model section)

**Step 2: Display Key Metrics Cards**
- Show cards:
  - Total audits run
  - Total employees checked
  - Total underpaid
  - Total liability
  - Compliance rate (% OK)
- Data comes from `analytics.paymentStatusDistribution`

**Step 3: Render Charts with Recharts**
- **Pie Chart:** Payment status distribution
  ```typescript
  // Conceptual
  const pieData = [
    { name: 'OK', value: analytics.paymentStatusDistribution.ok, color: '#10b981' },
    { name: 'Underpaid', value: analytics.paymentStatusDistribution.underpaid, color: '#ef4444' },
    { name: 'Needs Review', value: analytics.paymentStatusDistribution.needsReview, color: '#f59e0b' }
  ];
  ```
  - Already implemented in some pages; wire to real data

- **Bar Chart:** Underpayment by day of week
  ```typescript
  const barData = analytics.underpaymentByDayOfWeek.map(d => ({
    day: d.day,
    amount: d.underpaymentAmount
  }));
  ```

- **Bar Chart:** Top pay codes
  - Use `analytics.underpaymentByPayCode`

**Step 4: Root Cause Analysis**
- Display top 3 issues from `analytics.rootCauses`
- Show:
  - Reason (e.g., "Evening hours at ordinary rate")
  - Employee count
  - Total $ impact
  - Recommendation
- Make clickable to filter employee table

**Step 5: Trend Line Chart (Cross-Audit)**
- For date ranges spanning multiple audits:
  - Use `analytics.monthlyTrends`
  - Display line chart showing underpayment over time
  - Use Recharts `<LineChart>`

**Step 6: Export Reports**
- "Export as PDF" button:
  - Call: `GET /api/reports/export?format=pdf&dateRange=...`
  - Receive blob URL
  - Trigger browser download:
    ```typescript
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'PayGuard_Report.pdf';
    a.click();
    ```

---

### 6. Add Loading and Error States

#### Current State
No loading spinners or error handling in most components.

#### Steps to Implement Loading/Error States

**Step 1: Create Shared Components**
- `/components/ui/LoadingSpinner.tsx`: Spinner component
- `/components/ui/ErrorAlert.tsx`: Error message component
- `/components/ui/EmptyState.tsx`: No data message

**Step 2: Add to Data Fetching Components**
- In every component that fetches data:
  ```typescript
  const { data, loading, error } = useDataHook();
  
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorAlert message={error.message} onRetry={refetch} />;
  if (data.length === 0) return <EmptyState message="No audits found" />;
  
  return <DataDisplay data={data} />;
  ```

**Step 3: Add Skeleton Loaders (Optional)**
- Instead of full-page spinner, show skeleton:
  - Table rows with grey placeholder bars
  - Card placeholders
  - Use `react-loading-skeleton` library or custom CSS

**Step 4: Add Toast Notifications**
- Install `sonner` or use existing toast system
- Show success/error toasts for actions:
  - "Audit submitted successfully"
  - "Decision saved"
  - "Error: Failed to upload file"

---

### 7. Implement Employee Detail Modal

#### Current State
Employee table rows are not clickable; no detail modal exists.

#### Steps to Implement

**Step 1: Create Modal Component**
- New file: `/components/organisation/EmployeeDetailModal.tsx`
- Props: `{ employee: EmployeeResult; onClose: () => void }`
- Layout: Full-screen modal or large overlay
- Tabs: Summary, Calculation, Evidence, Timeline (same as Case Detail in Employee dashboard)

**Step 2: Add Click Handler to Table Rows**
- In any table displaying employees:
  ```typescript
  <TableRow 
    className="cursor-pointer hover:bg-muted"
    onClick={() => setSelectedEmployee(employee)}
  >
  ```

**Step 3: Display Modal**
- In component:
  ```typescript
  {selectedEmployee && (
    <EmployeeDetailModal 
      employee={selectedEmployee} 
      onClose={() => setSelectedEmployee(null)} 
    />
  )}
  ```

**Step 4: Fetch Additional Data if Needed**
- If table only shows summary, fetch full details:
  - On modal open: `fetchEmployeeDetail(employeeId)`
  - Show loading spinner in modal while fetching
  - Display full calculation breakdown, evidence documents

**Step 5: Actions in Modal**
- "Export Evidence Pack" button → Download PDF
- "Flag for Review" button → Add to HITL queue
- "View Timeline" → Scroll to timeline section

---

### 8. Add Export Functionality

#### Current State
Export buttons may be present but static.

#### Steps to Implement

**Step 1: Export Audit History to CSV**
- Button: "Export History" in `AuditHistoryPage`
- Handler:
  ```typescript
  const handleExport = async () => {
    const csv = generateCSV(auditRequests); // or fetch from API
    downloadFile(csv, 'audit-history.csv', 'text/csv');
  };
  ```
- Use library like `papaparse` for CSV generation

**Step 2: Export Audit Detail to PDF**
- Button: "Download Report" in `AuditDetailPage`
- API call: `GET /api/audit/{id}/report?format=pdf`
- Receive blob, trigger download

**Step 3: Export Employee Evidence Pack**
- Per-employee export in table action column
- API: `GET /api/audit/{auditId}/employee/{empId}/evidence`
- Returns PDF with:
  - Cover page
  - Calculation breakdown
  - Contract excerpts
  - Timesheet highlights
  - Payslip annotations
  - Award clause citations

**Step 4: Bulk Export Selected Employees**
- Add checkboxes to employee table
- "Export Selected (5)" button
- API: `POST /api/audit/{id}/employees/export` with array of employee IDs

---

### 9. Add Notification System

#### Conceptual Feature (Future Implementation)

**Step 1: WebSocket Connection for Notifications**
- Connect to notification service: `ws://api/notifications`
- Listen for events:
  - Audit completed
  - New HITL item assigned to you
  - Decision overridden by admin

**Step 2: Display in UI**
- Bell icon in top bar with badge count
- Dropdown menu showing recent notifications
- Click notification → Navigate to relevant page

**Step 3: Email Notifications**
- Backend sends emails for:
  - Audit completion
  - HITL items requiring attention
  - Scheduled report delivery

---

### 10. File Locations Summary

| Task | Files to Modify | New Files to Create |
|------|-----------------|---------------------|
| Replace sample data | All pages in `/components/organisation/` | `/services/auditApi.ts`<br>`/hooks/useAuditData.ts` |
| Add loading/error states | All data-fetching components | `/components/ui/LoadingSpinner.tsx`<br>`/components/ui/ErrorAlert.tsx` |
| Server-side filtering | `AuditHistoryPage.tsx`<br>`ComprehensiveAuditReview.tsx` | Update API service functions |
| Real file upload | `BulkAuditWizard.tsx` | N/A (modify existing) |
| WebSocket for agents | `BulkAuditWizard.tsx` Step 5 | `/services/websocketService.ts` |
| HITL decisions | `ReviewQueuePage.tsx`<br>`AuditDetailPage.tsx` | `/components/organisation/HITLDecisionModal.tsx` |
| Employee detail modal | All employee tables | `/components/organisation/EmployeeDetailModal.tsx` |
| Export functionality | All pages with export buttons | `/utils/exportHelpers.ts` |
| Analytics charts | `ReportsInsightsPage.tsx`<br>`AuditDetailPage.tsx` (Analytics tab) | N/A (wire existing charts) |

---

### 11. Backend API Endpoints (Reference)

**Note:** This is a conceptual list of endpoints the frontend would call. Backend implementation is out of scope.

| Method | Endpoint | Purpose | Request | Response |
|--------|----------|---------|---------|----------|
| GET | `/api/dashboard/metrics` | Dashboard KPIs | None | `{ totalEmployees, underpaidCount, reviewQueueCount, totalAtRisk, highRiskEmployees[] }` |
| GET | `/api/audit/history` | List past audits | `?search=&status=&page=&pageSize=` | `{ data: AuditRequest[], pagination }` |
| GET | `/api/audit/:id` | Single audit detail | None | `AuditRequest` |
| GET | `/api/audit/:id/employees` | Employee results | `?status=&search=` | `EmployeeResult[]` |
| GET | `/api/audit/:id/analytics` | Analytics data | None | `AuditAnalytics` |
| POST | `/api/audit/upload` | Upload payroll ZIP | FormData with file | `{ structureDetected, employeeCount, errors[] }` |
| POST | `/api/audit/start` | Start audit processing | `{ orgType, award, config }` | `{ auditId, websocketUrl }` |
| GET | `/api/hitl/queue` | HITL review items | `?priority=&issueType=` | `HITLReviewItem[]` |
| POST | `/api/hitl/decision` | Submit HITL decision | `{ itemId, decision, notes }` | `{ success: true }` |
| POST | `/api/hitl/batch-approve` | Approve all items | `{ itemIds[] }` | `{ success: true }` |
| GET | `/api/reports/analytics` | Cross-audit analytics | `?dateRange=&orgId=` | `AuditAnalytics` |
| GET | `/api/reports/export` | Export report | `?format=pdf&auditId=` | Blob (PDF/Excel) |
| GET | `/api/audit/:id/report` | Single audit report | `?format=pdf` | Blob |
| GET | `/api/audit/:id/employee/:empId/evidence` | Employee evidence pack | None | Blob (PDF) |
| WebSocket | `/ws/audit/:id/progress` | Real-time agent updates | N/A | Stream of `{ agentId, status, progress }` |

---

## Summary

This document provides a comprehensive reference for the **Organisation/Auditor experience** in PayGuard without modifying any code. It covers:

✅ **Navigation flows** between all pages  
✅ **Route/state mapping** for the React app  
✅ **Page ownership** (which TSX files implement which screens)  
✅ **Complete interaction map** for every button, filter, table row, modal  
✅ **TypeScript data models** for all entities  
✅ **Implementation guidelines** for wiring to real APIs  

**Next Steps for Development:**
1. Create API service layer (`/services/auditApi.ts`)
2. Implement data fetching hooks (`/hooks/useAuditData.ts`)
3. Replace sample data in each component
4. Add loading/error UI components
5. Implement real file upload with progress
6. Connect WebSocket for live agent updates
7. Wire HITL decision modals to API
8. Implement export functionality
9. Add notification system

**Key Files to Focus On:**
- `/components/dashboards/OrganisationDashboardWrapper.tsx` (navigation orchestrator)
- `/components/organisation/AuditHistoryPage.tsx` (main list view)
- `/components/organisation/AuditDetailPage.tsx` (6-tab detail view)
- `/components/organisation/ComprehensiveAuditReview.tsx` (post-submission review)
- `/components/organisation/BulkAuditWizard.tsx` (5-step upload wizard)
- `/components/organisation/ReviewQueuePage.tsx` (HITL workflow)

---

**Document Version:** 1.0  
**Created:** January 2, 2026  
**Purpose:** Reference and handoff documentation only — no code changes
