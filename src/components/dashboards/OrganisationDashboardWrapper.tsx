import { useState } from 'react';
import { OrganisationDashboardPage } from './OrganisationDashboardPage';
import { BulkAuditWizard } from '../organisation/BulkAuditWizard';
import { AuditResultsPage } from '../organisation/AuditResultsPage';
import { AuditHistoryPage } from '../organisation/AuditHistoryPage';
import { AuditDetailPage } from '../organisation/AuditDetailPage';
import { ComprehensiveAuditReview } from '../organisation/ComprehensiveAuditReview';
import { ReportsInsightsPage } from '../organisation/ReportsInsightsPage';
import { ReviewQueuePage } from '../organisation/ReviewQueuePage';

type OrganisationView = 
  | 'dashboard'
  | 'bulk-audit-wizard'
  | 'audit-results'
  | 'audit-history'
  | 'audit-detail'
  | 'comprehensive-review'
  | 'reports-insights'
  | 'review-queue';

interface OrganisationDashboardWrapperProps {
  onLogout: () => void;
}

export function OrganisationDashboardWrapper({ onLogout }: OrganisationDashboardWrapperProps) {
  const [currentView, setCurrentView] = useState<OrganisationView>('dashboard');
  const [selectedAuditId, setSelectedAuditId] = useState<string | null>(null);

  const handleViewAuditResults = (auditId?: string) => {
    if (auditId) {
      setSelectedAuditId(auditId);
    }
    setCurrentView('audit-results');
  };

  const handleViewAuditDetail = (auditId: string) => {
    setSelectedAuditId(auditId);
    setCurrentView('audit-detail');
  };

  const handleViewComprehensiveReview = (auditId: string) => {
    setSelectedAuditId(auditId);
    setCurrentView('comprehensive-review');
  };

  const handleNewBulkAudit = () => {
    setCurrentView('bulk-audit-wizard');
  };

  const handleBulkAuditComplete = () => {
    // After completing bulk audit, show comprehensive review
    setSelectedAuditId('AUD-2025-004'); // Set the new audit ID
    setCurrentView('comprehensive-review');
  };

  return (
    <>
      {currentView === 'dashboard' && (
        <OrganisationDashboardPage
          onNewBulkAudit={handleNewBulkAudit}
          onViewAuditHistory={() => setCurrentView('audit-history')}
          onViewReviewQueue={() => setCurrentView('review-queue')}
          onLogout={onLogout}
        />
      )}

      {currentView === 'bulk-audit-wizard' && (
        <BulkAuditWizard 
          onClose={() => setCurrentView('dashboard')}
          onComplete={handleBulkAuditComplete}
          onLogout={onLogout}
        />
      )}

      {currentView === 'audit-results' && (
        <AuditResultsPage
          onBack={() => setCurrentView('dashboard')}
          onViewHistory={() => setCurrentView('audit-history')}
          onViewReports={() => setCurrentView('reports-insights')}
          onViewReviewQueue={() => setCurrentView('review-queue')}
          onLogout={onLogout}
        />
      )}

      {currentView === 'audit-history' && (
        <AuditHistoryPage
          onBack={() => setCurrentView('dashboard')}
          onViewResults={handleViewAuditResults}
          onViewDetail={handleViewAuditDetail}
          onNewAudit={handleNewBulkAudit}
          onLogout={onLogout}
        />
      )}

      {currentView === 'audit-detail' && selectedAuditId && (
        <AuditDetailPage
          auditId={selectedAuditId}
          onBack={() => setCurrentView('audit-history')}
          onLogout={onLogout}
        />
      )}

      {currentView === 'comprehensive-review' && selectedAuditId && (
        <ComprehensiveAuditReview
          auditId={selectedAuditId}
          onBackToHistory={() => setCurrentView('audit-history')}
          onViewReviewQueue={() => setCurrentView('review-queue')}
          onLogout={onLogout}
        />
      )}

      {currentView === 'reports-insights' && (
        <ReportsInsightsPage
          onBack={() => setCurrentView('audit-results')}
          onViewResults={() => setCurrentView('audit-results')}
          onLogout={onLogout}
        />
      )}

      {currentView === 'review-queue' && (
        <ReviewQueuePage
          onBack={() => setCurrentView('audit-results')}
          onLogout={onLogout}
        />
      )}
    </>
  );
}
