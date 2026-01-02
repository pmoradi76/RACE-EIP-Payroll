# PayGuard Design System

## Overview

This design system provides a comprehensive set of reusable components, layouts, and patterns for building the PayGuard application. It ensures consistency across all user interfaces and accelerates development.

---

## Component Library

### 1. Status Badges (`/components/design-system/StatusBadge.tsx`)

**Purpose**: Indicate processing states of AI agents, jobs, or system tasks.

**Usage**:
```tsx
import { StatusBadge } from './components/design-system/StatusBadge';

<StatusBadge status="done" size="md" showIcon={true} />
```

**Props**:
- `status`: `'done' | 'running' | 'needs-review' | 'failed' | 'pending'`
- `size`: `'sm' | 'md' | 'lg'` (default: `'md'`)
- `showIcon`: `boolean` (default: `true`)
- `label`: `string` (optional, overrides default label)

**Status Types**:
- `done`: Green badge with checkmark (completed successfully)
- `running`: Blue badge with spinning loader (in progress)
- `needs-review`: Amber badge with alert icon (requires human review)
- `failed`: Red badge with X icon (error occurred)
- `pending`: Gray badge with clock icon (queued/waiting)

---

### 2. Severity Badges (`/components/design-system/SeverityBadge.tsx`)

**Purpose**: Display compliance results and payment status.

**Usage**:
```tsx
import { SeverityBadge } from './components/design-system/SeverityBadge';

<SeverityBadge severity="underpaid" size="md" />
```

**Props**:
- `severity`: `'ok' | 'underpaid' | 'needs-review' | 'overpaid'`
- `size`: `'sm' | 'md' | 'lg'` (default: `'md'`)
- `label`: `string` (optional, overrides default label)

**Severity Types**:
- `ok`: Green (employee paid correctly)
- `underpaid`: Red (employee underpaid)
- `needs-review`: Amber (uncertain, requires review)
- `overpaid`: Purple (employee overpaid)

---

### 3. Anomaly Score Pill (`/components/design-system/AnomalyScorePill.tsx`)

**Purpose**: Display ML-powered risk scores (0-100) with automatic color coding.

**Usage**:
```tsx
import { AnomalyScorePill } from './components/design-system/AnomalyScorePill';

<AnomalyScorePill score={87} showLabel={true} size="md" />
```

**Props**:
- `score`: `number` (0-100, automatically clamped)
- `size`: `'sm' | 'md' | 'lg'` (default: `'md'`)
- `showLabel`: `boolean` (default: `true`, shows risk level text)

**Score Ranges**:
- 0-19: Green (Minimal Risk)
- 20-39: Yellow (Low Risk)
- 40-59: Amber (Medium Risk)
- 60-79: Orange (High Risk)
- 80-100: Red (Critical Risk)

---

### 4. Progress Stepper (`/components/design-system/ProgressStepper.tsx`)

**Purpose**: Display multi-step workflows with clear progression.

**Usage**:
```tsx
import { ProgressStepper } from './components/design-system/ProgressStepper';

const steps = [
  { id: '1', label: 'Upload', description: 'Documents received', status: 'completed' },
  { id: '2', label: 'Process', description: 'AI analysis', status: 'current' },
  { id: '3', label: 'Review', status: 'upcoming' }
];

<ProgressStepper steps={steps} orientation="horizontal" />
```

**Props**:
- `steps`: `ProgressStep[]`
- `orientation`: `'horizontal' | 'vertical'` (default: `'horizontal'`)

**ProgressStep Interface**:
```typescript
interface ProgressStep {
  id: string;
  label: string;
  description?: string;
  status: 'completed' | 'current' | 'upcoming';
}
```

---

### 5. Breadcrumb (`/components/design-system/Breadcrumb.tsx`)

**Purpose**: Hierarchical navigation showing page location.

**Usage**:
```tsx
import { Breadcrumb } from './components/design-system/Breadcrumb';

<Breadcrumb 
  items={[
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Employees', href: '/employees' },
    { label: 'Ava Nguyen' }
  ]}
  showHome={true}
/>
```

**Props**:
- `items`: `BreadcrumbItem[]`
- `showHome`: `boolean` (default: `true`)

---

### 6. Page Header (`/components/design-system/PageHeader.tsx`)

**Purpose**: Standard page header with title, description, and action buttons.

**Usage**:
```tsx
import { PageHeader } from './components/design-system/PageHeader';

<PageHeader 
  title="Dashboard"
  description="Overview of compliance status"
  actions={
    <>
      <Button variant="outline">Export</Button>
      <Button>New Audit</Button>
    </>
  }
/>
```

**Props**:
- `title`: `string` (required)
- `description`: `string` (optional)
- `actions`: `ReactNode` (optional)

---

### 7. Empty State (`/components/design-system/EmptyState.tsx`)

**Purpose**: Display when no data is available.

**Usage**:
```tsx
import { EmptyState } from './components/design-system/EmptyState';
import { Inbox } from 'lucide-react';

<EmptyState 
  icon={Inbox}
  title="No documents found"
  description="Upload your first document to get started"
  action={<Button>Upload Document</Button>}
/>
```

**Props**:
- `icon`: `LucideIcon` (optional)
- `title`: `string` (required)
- `description`: `string` (optional)
- `action`: `ReactNode` (optional)

---

### 8. Top Bar (`/components/design-system/TopBar.tsx`)

**Purpose**: Application-wide top navigation bar.

**Usage**:
```tsx
import { TopBar } from './components/design-system/TopBar';

<TopBar 
  title="Dashboard"
  icon={Home}
  actions={<Button>Action</Button>}
  showNotifications={true}
  onMenuToggle={() => setMenuOpen(!menuOpen)}
/>
```

**Props**:
- `title`: `string` (required)
- `icon`: `LucideIcon` (optional)
- `actions`: `ReactNode` (optional)
- `showNotifications`: `boolean` (default: `true`)
- `userAvatar`: `ReactNode` (optional)
- `onMenuToggle`: `() => void` (optional, for mobile menu)

---

### 9. Sidebar (`/components/design-system/Sidebar.tsx`)

**Purpose**: Left-side navigation menu.

**Usage**:
```tsx
import { Sidebar } from './components/design-system/Sidebar';

const sections = [
  {
    title: 'Main',
    items: [
      { id: '1', label: 'Dashboard', icon: Home, href: '/', active: true },
      { id: '2', label: 'Reports', icon: FileText, href: '/reports', badge: 3 }
    ]
  }
];

<Sidebar 
  sections={sections} 
  footer={<UserProfile />}
  collapsed={false}
/>
```

**Props**:
- `sections`: `SidebarSection[]` (required)
- `footer`: `ReactNode` (optional)
- `collapsed`: `boolean` (default: `false`)

**Interfaces**:
```typescript
interface SidebarItem {
  id: string;
  label: string;
  icon: LucideIcon;
  href?: string;
  active?: boolean;
  badge?: string | number;
}

interface SidebarSection {
  title?: string;
  items: SidebarItem[];
}
```

---

## Layout Components

### App Shell (`/components/layouts/AppShell.tsx`)

**Purpose**: Complete application layout with sidebar, top bar, and main content area.

**Usage**:
```tsx
import { AppShell } from './components/layouts/AppShell';

<AppShell
  sidebarSections={sections}
  topBarTitle="Dashboard"
  topBarIcon={Home}
  topBarActions={<Button>Action</Button>}
  breadcrumbs={[{ label: 'Home', href: '/' }]}
  sidebarFooter={<UserProfile />}
>
  {/* Page content */}
</AppShell>
```

**Props**:
- `children`: `ReactNode` (required)
- `sidebarSections`: `SidebarSection[]` (required)
- `topBarTitle`: `string` (required)
- `topBarIcon`: `LucideIcon` (optional)
- `topBarActions`: `ReactNode` (optional)
- `breadcrumbs`: `BreadcrumbItem[]` (optional)
- `sidebarFooter`: `ReactNode` (optional)

---

## Role-Based Shells

### 1. Employee Dashboard Shell (`/components/shells/EmployeeDashboardShell.tsx`)

Pre-configured app shell for employee users.

**Navigation Items**:
- Dashboard
- Check My Pay (upload)
- My Reports (history)
- Issues Found (with badge)
- Ask About Awards (chatbot)
- Help & Guides
- Settings

**Usage**:
```tsx
import { EmployeeDashboardShell } from './components/shells/EmployeeDashboardShell';

<EmployeeDashboardShell 
  topBarTitle="My Dashboard"
  breadcrumbs={[{ label: 'Dashboard' }]}
>
  {/* Dashboard content */}
</EmployeeDashboardShell>
```

---

### 2. Organisation Dashboard Shell (`/components/shells/OrganisationDashboardShell.tsx`)

Pre-configured app shell for HR managers and auditors.

**Navigation Sections**:
- **Overview**: Dashboard, Employees
- **Audits**: Bulk Upload, Audit Reports, Review Queue
- **Insights**: Analytics, Exports
- **System**: Settings

**Usage**:
```tsx
import { OrganisationDashboardShell } from './components/shells/OrganisationDashboardShell';

<OrganisationDashboardShell 
  topBarTitle="Compliance Dashboard"
  breadcrumbs={[{ label: 'Dashboard' }]}
>
  {/* Dashboard content */}
</OrganisationDashboardShell>
```

---

### 3. Admin Dashboard Shell (`/components/shells/AdminDashboardShell.tsx`)

Pre-configured app shell for system administrators.

**Navigation Sections**:
- **Configuration**: System Overview, Award Library, Prompt Bank, Model Routing
- **Monitoring**: Audit Logs, Performance
- **Access**: User Management, API Keys
- **System**: System Settings

**Usage**:
```tsx
import { AdminDashboardShell } from './components/shells/AdminDashboardShell';

<AdminDashboardShell 
  topBarTitle="System Administration"
  breadcrumbs={[{ label: 'Admin' }]}
>
  {/* Admin content */}
</AdminDashboardShell>
```

---

## Color System

### Severity Colors

```css
/* OK / Success */
bg-green-100 text-green-800 border-green-300

/* Underpaid / Error */
bg-red-100 text-red-800 border-red-300

/* Needs Review / Warning */
bg-amber-100 text-amber-800 border-amber-300

/* Overpaid / Info */
bg-purple-100 text-purple-800 border-purple-300
```

### Status Colors

```css
/* Done / Completed */
bg-green-50 text-green-700 border-green-200

/* Running / In Progress */
bg-blue-50 text-blue-700 border-blue-200

/* Needs Review */
bg-amber-50 text-amber-700 border-amber-200

/* Failed */
bg-red-50 text-red-700 border-red-200

/* Pending */
bg-gray-50 text-gray-700 border-gray-200
```

### Anomaly Score Gradient

- 0-19: `bg-green-100 text-green-800 border-green-300`
- 20-39: `bg-yellow-100 text-yellow-800 border-yellow-300`
- 40-59: `bg-amber-100 text-amber-800 border-amber-300`
- 60-79: `bg-orange-100 text-orange-800 border-orange-300`
- 80-100: `bg-red-100 text-red-800 border-red-300`

---

## Spacing System

Use Tailwind's default spacing scale consistently:

- `gap-2` / `p-2` = 0.5rem (8px)
- `gap-3` / `p-3` = 0.75rem (12px)
- `gap-4` / `p-4` = 1rem (16px)
- `gap-6` / `p-6` = 1.5rem (24px)
- `gap-8` / `p-8` = 2rem (32px)

### Component Spacing Guidelines

- **Card padding**: `p-6`
- **Section margins**: `mb-6` between major sections
- **Grid gaps**: `gap-6` for cards, `gap-4` for form fields
- **Button gaps**: `gap-2` for icon + text

---

## Border Radius

Standard: 12px (`rounded-xl` for cards)

- Cards: `rounded-xl` (12px)
- Buttons: `rounded-lg` (8px)
- Badges/Pills: `rounded-full`
- Inputs: `rounded-lg` (8px)

---

## Typography

Use default typography from `/styles/globals.css`. Do not override unless specifically requested.

**Headings**:
- `<h1>`: Page titles
- `<h2>`: Section titles
- `<h3>`: Subsection titles
- `<h4>`: Card titles

**Body Text**:
- Default: 16px (1rem)
- Small: `text-sm` (14px)
- Extra small: `text-xs` (12px)

**Muted Text**: Use `text-muted-foreground` for secondary text

---

## File Structure

```
/components/
  /design-system/
    StatusBadge.tsx
    SeverityBadge.tsx
    AnomalyScorePill.tsx
    ProgressStepper.tsx
    Breadcrumb.tsx
    PageHeader.tsx
    EmptyState.tsx
    TopBar.tsx
    Sidebar.tsx
  /layouts/
    AppShell.tsx
  /shells/
    EmployeeDashboardShell.tsx
    OrganisationDashboardShell.tsx
    AdminDashboardShell.tsx
  /dashboards/
    EmployeeDashboard.tsx
    OrganisationDashboard.tsx
    AdminDashboard.tsx
  /ui/
    [Shadcn UI components]
```

---

## Naming Conventions

### Components
- PascalCase: `StatusBadge`, `AnomalyScorePill`
- Descriptive names: `PageHeader` not `Header`

### Props
- camelCase: `showIcon`, `topBarTitle`
- Boolean props: prefix with `show`, `is`, `has`

### Types
- PascalCase: `StatusType`, `SeverityType`
- Suffix with `Type`, `Props`, `Interface`

### Files
- PascalCase matching component: `StatusBadge.tsx`
- Co-locate related types in same file

---

## Best Practices

1. **Always use design system components** - Don't create custom badges/pills
2. **Consistent spacing** - Use spacing system (gap-2, gap-4, gap-6)
3. **Color semantics** - Use severity colors for results, status colors for processes
4. **Responsive design** - Use grid with breakpoints (md:, lg:)
5. **Accessibility** - Include proper labels, ARIA attributes
6. **Type safety** - Use TypeScript types for all props

---

## Examples

### Complete Dashboard Card

```tsx
<Card>
  <CardHeader>
    <div className="flex items-center justify-between">
      <div>
        <CardTitle>Employee Details</CardTitle>
        <CardDescription>Compliance status for current period</CardDescription>
      </div>
      <StatusBadge status="done" />
    </div>
  </CardHeader>
  <CardContent>
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span>Risk Score</span>
        <AnomalyScorePill score={87} />
      </div>
      <div className="flex items-center justify-between">
        <span>Payment Status</span>
        <SeverityBadge severity="underpaid" />
      </div>
    </div>
  </CardContent>
</Card>
```

### Full Dashboard Page

```tsx
import { EmployeeDashboardShell } from './components/shells/EmployeeDashboardShell';
import { PageHeader } from './components/design-system/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Button } from './components/ui/button';

export function MyDashboard() {
  return (
    <EmployeeDashboardShell
      topBarTitle="My Dashboard"
      breadcrumbs={[{ label: 'Dashboard' }]}
    >
      <PageHeader 
        title="Welcome back"
        description="Your compliance overview"
        actions={<Button>New Check</Button>}
      />
      
      <div className="grid md:grid-cols-3 gap-6">
        {/* Dashboard cards */}
      </div>
    </EmployeeDashboardShell>
  );
}
```

---

## Developer Handoff Checklist

- [ ] Review all components in `/components/design-system/`
- [ ] Test responsive behavior (mobile, tablet, desktop)
- [ ] Verify color consistency across all components
- [ ] Check accessibility (keyboard navigation, screen readers)
- [ ] Test all three role-based shells
- [ ] Validate TypeScript types
- [ ] Review spacing consistency
- [ ] Test empty states and error states
- [ ] Verify badge and pill color logic
- [ ] Test progress stepper with different step counts

---

## Support

For questions or clarifications about the design system, refer to:
- Component source code: `/components/design-system/`
- Example implementations: `/components/dashboards/`
- Design system showcase: `/components/DesignSystemShowcase.tsx`
