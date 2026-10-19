import { useState, useEffect, useCallback } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { api, getStoredUser, clearStoredAuth } from './services/api';
import { ToastContainer } from './components/common/Toast';
import { ConfirmModal } from './components/common/ConfirmModal';
import { AuthModal } from './components/common/AuthModal';
import { Sidebar } from './components/layout/Sidebar';
import { TopHeader } from './components/layout/TopHeader';
import { OverviewView } from './components/dashboard/OverviewView';
import { FacilitiesView } from './components/facilities/FacilitiesView';
import { FacilityDetailsPage } from './components/facilities/FacilityDetailsPage';
import { FacilityDetailModal } from './components/facilities/FacilityDetailModal';
import { FacilityFormModal } from './components/facilities/FacilityFormModal';
import { InspectionsView } from './components/inspections/InspectionsView';
import { InspectionFormModal } from './components/inspections/InspectionFormModal';
import { InspectionDetailModal } from './components/inspections/InspectionDetailModal';
import { ComplaintsView } from './components/complaints/ComplaintsView';
import { ComplaintFormModal } from './components/complaints/ComplaintFormModal';
import { ComplaintDetailModal } from './components/complaints/ComplaintDetailModal';
import { AngularIntegrationView } from './components/angular-integration/AngularIntegrationView';
import { EmptyState } from './components/common/EmptyState';

export function App() {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchTerm] = useState('');

  // Live Backend connection state
  const [isOnline, setIsOnline] = useState(null);
  const [currentUser, setCurrentUser] = useState(getStoredUser());

  // Master Live Data States (PostgreSQL)
  const [stats, setStats] = useState(null);
  const [facilities, setFacilities] = useState([]);
  const [inspections, setInspections] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [inspectors, setInspectors] = useState([]);

  // Loading States
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState([]);

  // Modal States
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Facility modals
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [isFacilityDetailOpen, setIsFacilityDetailOpen] = useState(false);
  const [facilityFormState, setFacilityFormState] = useState({ isOpen: false, facility: null });

  // Inspection modals
  const [selectedInspection, setSelectedInspection] = useState(null);
  const [isInspectionDetailOpen, setIsInspectionDetailOpen] = useState(false);
  const [inspectionFormState, setInspectionFormState] = useState({ isOpen: false, facilityId: null });

  // Complaint modals
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [isComplaintDetailOpen, setIsComplaintDetailOpen] = useState(false);
  const [complaintFormState, setComplaintFormState] = useState({ isOpen: false, facilityId: null });

  // Delete Confirm modal
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, facilityId: null, facilityName: '' });

  // Toast Helper
  const showToast = useCallback((type, message, title) => {
    const id = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    setToasts((prev) => [...prev, { id, type, message, title }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Fetch Live Data Directly from PostgreSQL Backend
  const loadData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setIsRefreshing(true);
    else setIsLoading(true);

    try {
      const health = await api.checkBackendHealth();
      setIsOnline(health.online);

      if (!health.online) {
        showToast('warning', 'Backend server is unreachable. Operating in offline mode.', 'Offline Mode');
      }

      const [statsData, facilitiesData, inspectionsData, complaintsData, inspectorsData] = await Promise.all([
        api.getDashboardStats(),
        api.getFacilities(),
        api.getInspections(),
        api.getComplaints(),
        api.getInspectors(),
      ]);

      setStats(statsData);
      setFacilities(facilitiesData);
      setInspections(inspectionsData);
      setComplaints(complaintsData);
      setInspectors(inspectorsData);

      if (isRefresh) {
        showToast('info', 'Data refreshed successfully.');
      }
    } catch (err) {
      showToast('error', err.message || 'Could not fetch latest data.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Facility Actions (Direct to Database)
  async function handleSaveFacility(data) {
    setActionLoading(true);
    try {
      if (facilityFormState.facility) {
        const updated = await api.updateFacility(facilityFormState.facility.id, data);
        setFacilities((prev) => prev.map((f) => (f.id === updated.id ? updated : f)));
        showToast('success', `Facility ${updated.name} updated successfully.`);
      } else {
        const created = await api.createFacility(data);
        setFacilities((prev) => [created, ...prev]);
        showToast('success', `Facility ${created.name} (${created.facility_code}) registered.`);
      }
      setFacilityFormState({ isOpen: false, facility: null });
      const refreshedStats = await api.getDashboardStats();
      setStats(refreshedStats);
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : 'Failed to save facility.');
    } finally {
      setActionLoading(false);
    }
  }

  async function handleDeleteFacilityConfirm() {
    if (!deleteConfirm.facilityId) return;
    setActionLoading(true);
    try {
      await api.deleteFacility(deleteConfirm.facilityId);
      setFacilities((prev) => prev.filter((f) => f.id !== deleteConfirm.facilityId));
      showToast('success', `Facility "${deleteConfirm.facilityName}" removed from database.`);
      setDeleteConfirm({ isOpen: false, facilityId: null, facilityName: '' });
      const refreshedStats = await api.getDashboardStats();
      setStats(refreshedStats);
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : 'Could not delete facility.');
    } finally {
      setActionLoading(false);
    }
  }

  // Inspection Actions (Direct to Database)
  async function handleSaveInspection(data) {
    setActionLoading(true);
    try {
      const created = await api.createInspection(data);
      setInspections((prev) => [created, ...prev]);
      showToast('success', `Audit ${created.inspection_code} recorded in database (Score: ${created.score}%).`);
      setInspectionFormState({ isOpen: false, facilityId: null });
      const refreshedStats = await api.getDashboardStats();
      setStats(refreshedStats);
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : 'Failed to record inspection.');
    } finally {
      setActionLoading(false);
    }
  }

  // Complaint Actions (Direct to Database)
  async function handleSaveComplaint(data) {
    setActionLoading(true);
    try {
      const created = await api.createComplaint(data);
      setComplaints((prev) => [created, ...prev]);
      showToast('success', `Work order "${created.title}" dispatched to database.`);
      setComplaintFormState({ isOpen: false, facilityId: null });
      const refreshedStats = await api.getDashboardStats();
      setStats(refreshedStats);
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : 'Failed to log complaint.');
    } finally {
      setActionLoading(false);
    }
  }

  async function handleUpdateComplaintStatus(id, status, notes) {
    setActionLoading(true);
    try {
      const updated = await api.updateComplaintStatus(id, status, notes);
      setComplaints((prev) => prev.map((c) => (c.id === id ? updated : c)));
      if (selectedComplaint && selectedComplaint.id === id) {
        setSelectedComplaint(updated);
      }
      showToast('success', `Ticket #${id} status updated to "${status.replace('_', ' ')}".`);
      const refreshedStats = await api.getDashboardStats();
      setStats(refreshedStats);
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : 'Status update failed.');
    } finally {
      setActionLoading(false);
    }
  }

  function handleQuickAction(action) {
    if (action === 'facility') {
      setFacilityFormState({ isOpen: true, facility: null });
    } else if (action === 'inspection') {
      setInspectionFormState({ isOpen: true, facilityId: null });
    } else if (action === 'complaint') {
      setComplaintFormState({ isOpen: true, facilityId: null });
    }
  }

  const openComplaintsCount = complaints.filter((c) => c.status === 'open').length;

  return (
    <div className="app-root">
      {/* Deep Navy Left Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
        isOnline={isOnline}
        openComplaintsCount={openComplaintsCount}
      />

      {/* Main Content Area */}
      <div className={`app-main ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        {/* Top Header */}
        <TopHeader
          onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          searchQuery={searchQuery}
          onSearchChange={setSearchTerm}
          isOnline={isOnline}
          onRefresh={() => loadData(true)}
          isRefreshing={isRefreshing}
          currentUser={currentUser}
          onOpenAuth={() => setIsAuthModalOpen(true)}
          onLogout={async () => {
            await api.logout();
            setCurrentUser(null);
            clearStoredAuth();
            showToast('info', 'Signed out of FacilityOps');
          }}
          onQuickAction={handleQuickAction}
        />

        {/* View Routing with React Router */}
        <main style={{ flex: 1 }}>
          <Routes>
            <Route
              path="/"
              element={
                <OverviewView
                  stats={stats}
                  facilities={facilities}
                  complaints={complaints}
                  isLoading={isLoading}
                  onViewFacility={(id) => navigate(`/facilities/${id}`)}
                  onViewInspection={(ins) => {
                    setSelectedInspection(ins);
                    setIsInspectionDetailOpen(true);
                  }}
                  onViewComplaint={(comp) => {
                    setSelectedComplaint(comp);
                    setIsComplaintDetailOpen(true);
                  }}
                  onNavigateTab={(tab) =>
                    navigate(tab === 'facilities' ? '/facilities' : tab === 'inspections' ? '/inspections' : '/complaints')
                  }
                  onRecordInspection={() => setInspectionFormState({ isOpen: true, facilityId: null })}
                  onQuickResolveComplaint={(id) =>
                    handleUpdateComplaintStatus(id, 'resolved', 'Quick-resolved by facility manager')
                  }
                />
              }
            />

            <Route
              path="/facilities"
              element={
                <FacilitiesView
                  facilities={facilities}
                  isLoading={isLoading}
                  onViewFacility={(fac) => navigate(`/facilities/${fac.id}`)}
                  onEditFacility={(fac) => setFacilityFormState({ isOpen: true, facility: fac })}
                  onDeleteFacility={(id, name) =>
                    setDeleteConfirm({ isOpen: true, facilityId: id, facilityName: name })
                  }
                  onCreateFacility={() => setFacilityFormState({ isOpen: true, facility: null })}
                  onRecordAudit={(facilityId) => setInspectionFormState({ isOpen: true, facilityId })}
                />
              }
            />

            <Route
              path="/facilities/:id"
              element={
                <FacilityDetailsPage
                  facilities={facilities}
                  inspections={inspections}
                  complaints={complaints}
                  isLoading={isLoading}
                  onRecordInspection={(facilityId) => setInspectionFormState({ isOpen: true, facilityId })}
                  onLogComplaint={(facilityId) => setComplaintFormState({ isOpen: true, facilityId })}
                  onUpdateComplaintStatus={handleUpdateComplaintStatus}
                />
              }
            />

            <Route
              path="/inspections"
              element={
                <InspectionsView
                  inspections={inspections}
                  facilities={facilities}
                  isLoading={isLoading}
                  onViewInspection={(ins) => {
                    setSelectedInspection(ins);
                    setIsInspectionDetailOpen(true);
                  }}
                  onRecordInspection={() => setInspectionFormState({ isOpen: true, facilityId: null })}
                />
              }
            />

            <Route
              path="/complaints"
              element={
                <ComplaintsView
                  complaints={complaints}
                  facilities={facilities}
                  isLoading={isLoading}
                  onViewComplaint={(comp) => {
                    setSelectedComplaint(comp);
                    setIsComplaintDetailOpen(true);
                  }}
                  onLogComplaint={() => setComplaintFormState({ isOpen: true, facilityId: null })}
                  onUpdateStatus={handleUpdateComplaintStatus}
                />
              }
            />

            <Route path="/angular-inspection" element={<AngularIntegrationView />} />

            <Route
              path="*"
              element={
                <div className="page-container" style={{ marginTop: '2.5rem' }}>
                  <EmptyState
                    title="Page Not Found (404)"
                    description="The requested route does not exist in FacilityOps dashboard."
                    actionLabel="Return to Dashboard Overview"
                    onAction={() => navigate('/')}
                  />
                </div>
              }
            />
          </Routes>
        </main>
      </div>

      {/* Facility Modals */}
      <FacilityDetailModal
        facility={selectedFacility}
        inspections={inspections}
        complaints={complaints}
        isOpen={isFacilityDetailOpen}
        onClose={() => setIsFacilityDetailOpen(false)}
        onRecordAudit={(facilityId) => {
          setIsFacilityDetailOpen(false);
          setInspectionFormState({ isOpen: true, facilityId });
        }}
        onLogComplaint={(facilityId) => {
          setIsFacilityDetailOpen(false);
          setComplaintFormState({ isOpen: true, facilityId });
        }}
      />

      <FacilityFormModal
        isOpen={facilityFormState.isOpen}
        facility={facilityFormState.facility}
        onClose={() => setFacilityFormState({ isOpen: false, facility: null })}
        onSubmit={handleSaveFacility}
        isLoading={actionLoading}
      />

      {/* Inspection Modals */}
      <InspectionFormModal
        isOpen={inspectionFormState.isOpen}
        facilities={facilities}
        inspectors={inspectors}
        preselectedFacilityId={inspectionFormState.facilityId}
        onClose={() => setInspectionFormState({ isOpen: false, facilityId: null })}
        onSubmit={handleSaveInspection}
        isLoading={actionLoading}
      />

      <InspectionDetailModal
        inspection={selectedInspection}
        isOpen={isInspectionDetailOpen}
        onClose={() => setIsInspectionDetailOpen(false)}
      />

      {/* Complaint Modals */}
      <ComplaintFormModal
        isOpen={complaintFormState.isOpen}
        facilities={facilities}
        preselectedFacilityId={complaintFormState.facilityId}
        onClose={() => setComplaintFormState({ isOpen: false, facilityId: null })}
        onSubmit={handleSaveComplaint}
        isLoading={actionLoading}
      />

      <ComplaintDetailModal
        complaint={selectedComplaint}
        isOpen={isComplaintDetailOpen}
        onClose={() => setIsComplaintDetailOpen(false)}
        onUpdateStatus={handleUpdateComplaintStatus}
        isLoading={actionLoading}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteConfirm.isOpen}
        title="Decommission Facility Asset"
        message={`Are you sure you want to permanently remove "${deleteConfirm.facilityName}" from active management? All linked statutory records will be archived.`}
        confirmLabel="Confirm Decommission"
        isDanger={true}
        isLoading={actionLoading}
        onConfirm={handleDeleteFacilityConfirm}
        onCancel={() => setDeleteConfirm({ isOpen: false, facilityId: null, facilityName: '' })}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={(user) => {
          setCurrentUser(user);
          showToast('success', `Welcome back, ${user.name}`);
        }}
      />

      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
