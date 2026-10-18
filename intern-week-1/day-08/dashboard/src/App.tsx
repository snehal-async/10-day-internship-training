import { useState, useEffect, useCallback } from 'react';
import {
  Building2,
  ClipboardList,
  AlertCircle,
  LayoutDashboard,
  Database,
  UserCheck,
  LogIn,
  Layers,
} from 'lucide-react';
import { api, getStoredUser, clearStoredAuth, getStoredToken } from './services/api';
import type {
  AuthUser,
  Complaint,
  ComplaintStatus,
  DashboardStatsData,
  Facility,
  Inspection,
  UserSummary,
} from './types';

import { ToastContainer, type ToastMessage } from './components/Toast';
import { ConfirmModal } from './components/ConfirmModal';
import { AuthModal } from './components/AuthModal';
import { FacilityModal } from './components/FacilityModal';
import { FacilityDetailModal } from './components/FacilityDetailModal';
import { InspectionModal } from './components/InspectionModal';
import { InspectionDetailModal } from './components/InspectionDetailModal';
import { ComplaintModal } from './components/ComplaintModal';
import { ComplaintDetailModal } from './components/ComplaintDetailModal';

import { OverviewView } from './components/OverviewView';
import { FacilitiesView } from './components/FacilitiesView';
import { InspectionsView } from './components/InspectionsView';
import { ComplaintsView } from './components/ComplaintsView';

type Tab = 'overview' | 'facilities' | 'inspections' | 'complaints';

export function App() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [apiOnline, setApiOnline] = useState<boolean | null>(null);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(getStoredUser());

  // Data states
  const [stats, setStats] = useState<DashboardStatsData | null>(null);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [inspectors, setInspectors] = useState<UserSummary[]>([]);

  // Loading & error states
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [isLoadingFacilities, setIsLoadingFacilities] = useState(false);
  const [isLoadingInspections, setIsLoadingInspections] = useState(false);
  const [isLoadingComplaints, setIsLoadingComplaints] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const [statsError, setStatsError] = useState<string | null>(null);
  const [facilitiesError, setFacilitiesError] = useState<string | null>(null);
  const [inspectionsError, setInspectionsError] = useState<string | null>(null);
  const [complaintsError, setComplaintsError] = useState<string | null>(null);

  // Modals state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Facility modals
  const [facilityModalState, setFacilityModalState] = useState<{
    isOpen: boolean;
    facility: Facility | null;
  }>({ isOpen: false, facility: null });

  const [viewFacility, setViewFacility] = useState<Facility | null>(null);

  // Inspection modals
  const [inspectionModalState, setInspectionModalState] = useState<{
    isOpen: boolean;
    inspection: Inspection | null;
  }>({ isOpen: false, inspection: null });

  const [viewInspection, setViewInspection] = useState<Inspection | null>(null);

  // Complaint modals
  const [complaintModalState, setComplaintModalState] = useState<{
    isOpen: boolean;
    complaint: Complaint | null;
  }>({ isOpen: false, complaint: null });

  const [viewComplaint, setViewComplaint] = useState<Complaint | null>(null);

  // Delete confirm state
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    type: 'facility' | 'inspection' | 'complaint' | null;
    id: number | null;
    title: string;
    message: string;
  }>({
    isOpen: false,
    type: null,
    id: null,
    title: '',
    message: '',
  });

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'error' | 'info', message: string, title?: string) => {
    const id = `${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    setToasts((prev) => [...prev, { id, type, title, message }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Check backend health
  const checkHealth = useCallback(async () => {
    try {
      const res = await api.checkHealth();
      setApiOnline(res.status === 'healthy');
    } catch {
      setApiOnline(false);
    }
  }, []);

  // Fetch Dashboard Stats
  const loadStats = useCallback(async () => {
    setIsLoadingStats(true);
    setStatsError(null);
    try {
      const data = await api.getStats();
      setStats(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch dashboard metrics';
      setStatsError(msg);
    } finally {
      setIsLoadingStats(false);
    }
  }, []);

  // Fetch Facilities
  const loadFacilities = useCallback(async () => {
    setIsLoadingFacilities(true);
    setFacilitiesError(null);
    try {
      const res = await api.getFacilities({ per_page: 100 });
      setFacilities(res.data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch facilities';
      setFacilitiesError(msg);
    } finally {
      setIsLoadingFacilities(false);
    }
  }, []);

  // Fetch Inspections
  const loadInspections = useCallback(async () => {
    setIsLoadingInspections(true);
    setInspectionsError(null);
    try {
      const res = await api.getInspections({ per_page: 100 });
      setInspections(res.data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch inspections';
      setInspectionsError(msg);
    } finally {
      setIsLoadingInspections(false);
    }
  }, []);

  // Fetch Complaints
  const loadComplaints = useCallback(async () => {
    setIsLoadingComplaints(true);
    setComplaintsError(null);
    try {
      const res = await api.getComplaints({ per_page: 100 });
      setComplaints(res.data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch complaints';
      setComplaintsError(msg);
    } finally {
      setIsLoadingComplaints(false);
    }
  }, []);

  // Fetch Inspectors lookup
  const loadInspectors = useCallback(async () => {
    try {
      const list = await api.getInspectors();
      setInspectors(list);
    } catch {
      // Ignore lookup failure
    }
  }, []);

  // Initial loading
  useEffect(() => {
    checkHealth();
    loadStats();
    loadFacilities();
    loadInspections();
    loadComplaints();
    loadInspectors();

    // Auto-login as Demo Admin if no token is stored so users can edit immediately
    if (!getStoredToken()) {
      api.login('sarah.admin@enterprise.local', 'Password123!')
        .then((res) => {
          setCurrentUser(res.user);
          addToast('info', 'Authenticated as Demo Admin (Sarah Jenkins)', 'Session Started');
        })
        .catch(() => {
          // Token could not be initialized, user can still click Demo Admin
        });
    }
  }, [checkHealth, loadStats, loadFacilities, loadInspections, loadComplaints, loadInspectors]);

  // Auth actions
  const handleLogin = async (email: string, pass: string) => {
    setActionLoading(true);
    try {
      const res = await api.login(email, pass);
      setCurrentUser(res.user);
      addToast('success', `Welcome back, ${res.user.name}!`, 'Authentication Successful');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Login failed';
      addToast('error', msg, 'Authentication Failed');
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  const handleLogout = async () => {
    setActionLoading(true);
    try {
      await api.logout();
      setCurrentUser(null);
      addToast('info', 'You have been signed out.', 'Logged Out');
    } catch {
      clearStoredAuth();
      setCurrentUser(null);
    } finally {
      setActionLoading(false);
    }
  };

  // Facility Save
  const handleSaveFacility = async (data: Partial<Facility>) => {
    setActionLoading(true);
    try {
      if (facilityModalState.facility) {
        const updated = await api.updateFacility(facilityModalState.facility.id, data);
        setFacilities((prev) => prev.map((f) => (f.id === updated.id ? updated : f)));
        addToast('success', `Facility "${updated.name}" updated successfully.`, 'Facility Updated');
      } else {
        const created = await api.createFacility(data);
        setFacilities((prev) => [created, ...prev]);
        addToast('success', `Facility "${created.name}" created successfully.`, 'Facility Created');
      }
      setFacilityModalState({ isOpen: false, facility: null });
      loadStats();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save facility';
      addToast('error', msg, 'Save Error');
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  // Inspection Save
  const handleSaveInspection = async (data: Partial<Inspection>) => {
    setActionLoading(true);
    try {
      if (inspectionModalState.inspection) {
        const updated = await api.updateInspection(inspectionModalState.inspection.id, data);
        setInspections((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
        addToast('success', `Inspection audit #${updated.inspection_number} updated.`, 'Audit Updated');
      } else {
        const created = await api.createInspection(data);
        setInspections((prev) => [created, ...prev]);
        addToast('success', `Inspection audit #${created.inspection_number} recorded.`, 'Audit Recorded');
      }
      setInspectionModalState({ isOpen: false, inspection: null });
      loadStats();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save inspection';
      addToast('error', msg, 'Save Error');
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  // Complaint Save
  const handleSaveComplaint = async (data: Partial<Complaint>) => {
    setActionLoading(true);
    try {
      if (complaintModalState.complaint) {
        const updated = await api.updateComplaint(complaintModalState.complaint.id, data);
        setComplaints((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
        addToast('success', `Ticket #${updated.ticket_number} updated successfully.`, 'Ticket Updated');
      } else {
        const created = await api.createComplaint(data);
        setComplaints((prev) => [created, ...prev]);
        addToast('success', `Ticket #${created.ticket_number} created successfully.`, 'Ticket Created');
      }
      setComplaintModalState({ isOpen: false, complaint: null });
      loadStats();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save complaint';
      addToast('error', msg, 'Save Error');
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  // Quick Complaint Status Change
  const handleQuickStatusChange = async (complaint: Complaint, status: ComplaintStatus) => {
    try {
      const updated = await api.updateComplaint(complaint.id, {
        status,
        resolution_notes:
          status === 'resolved' && !complaint.resolution_notes
            ? 'Resolved via dashboard quick-action.'
            : complaint.resolution_notes,
      });
      setComplaints((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
      if (viewComplaint && viewComplaint.id === updated.id) {
        setViewComplaint(updated);
      }
      addToast('success', `Ticket #${updated.ticket_number} status set to ${status}.`, 'Status Updated');
      loadStats();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update ticket status';
      addToast('error', msg, 'Status Update Failed');
    }
  };

  // Deletion Execution
  const handleConfirmDelete = async () => {
    if (!deleteConfirm.type || !deleteConfirm.id) return;
    setActionLoading(true);

    try {
      if (deleteConfirm.type === 'facility') {
        await api.deleteFacility(deleteConfirm.id);
        setFacilities((prev) => prev.filter((f) => f.id !== deleteConfirm.id));
        addToast('success', 'Facility and associated cascade records removed.', 'Facility Deleted');
      } else if (deleteConfirm.type === 'inspection') {
        await api.deleteInspection(deleteConfirm.id);
        setInspections((prev) => prev.filter((i) => i.id !== deleteConfirm.id));
        addToast('success', 'Inspection audit record deleted.', 'Inspection Deleted');
      } else if (deleteConfirm.type === 'complaint') {
        await api.deleteComplaint(deleteConfirm.id);
        setComplaints((prev) => prev.filter((c) => c.id !== deleteConfirm.id));
        addToast('success', 'Maintenance complaint ticket deleted.', 'Ticket Deleted');
      }
      setDeleteConfirm({ isOpen: false, type: null, id: null, title: '', message: '' });
      loadStats();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete record';
      addToast('error', msg, 'Deletion Failed');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="app-container">
      {/* Top Navbar */}
      <header className="top-bar">
        <div className="brand">
          <div className="brand-icon">
            <Layers size={22} />
          </div>
          <div>
            <span style={{ color: '#ffffff' }}>FacilityOps</span>
            <span style={{ color: '#818cf8', marginLeft: 4 }}>Hub</span>
          </div>
          <span className="brand-badge">Day 8 Internship</span>
        </div>

        {/* Navigation Tabs */}
        <nav className="nav-tabs">
          <button
            type="button"
            className={`nav-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <LayoutDashboard size={16} /> Overview
          </button>
          <button
            type="button"
            className={`nav-tab-btn ${activeTab === 'facilities' ? 'active' : ''}`}
            onClick={() => setActiveTab('facilities')}
          >
            <Building2 size={16} /> Facilities ({facilities.length})
          </button>
          <button
            type="button"
            className={`nav-tab-btn ${activeTab === 'inspections' ? 'active' : ''}`}
            onClick={() => setActiveTab('inspections')}
          >
            <ClipboardList size={16} /> Inspections ({inspections.length})
          </button>
          <button
            type="button"
            className={`nav-tab-btn ${activeTab === 'complaints' ? 'active' : ''}`}
            onClick={() => setActiveTab('complaints')}
          >
            <AlertCircle size={16} /> Complaints ({complaints.length})
          </button>
        </nav>

        {/* Database & API Status / Auth Bar */}
        <div className="user-status-bar">
          <div className={`system-pill ${apiOnline === false ? 'offline' : ''}`} title="PostgreSQL 18 active database">
            <span className="pulse-dot" />
            <Database size={13} />
            <span>PostgreSQL 18</span>
          </div>

          <button
            type="button"
            className="btn btn-secondary"
            style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem' }}
            onClick={() => setIsAuthModalOpen(true)}
          >
            {currentUser ? (
              <>
                <UserCheck size={15} color="#34d399" />
                <span>{currentUser.name}</span>
              </>
            ) : (
              <>
                <LogIn size={15} />
                <span>Sign In / Demo Admin</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="main-content">
        {activeTab === 'overview' && (
          <OverviewView
            stats={stats}
            isLoading={isLoadingStats}
            error={statsError}
            onRefresh={loadStats}
            onNavigateTab={setActiveTab}
            onOpenCreateFacility={() => setFacilityModalState({ isOpen: true, facility: null })}
            onOpenCreateInspection={() => setInspectionModalState({ isOpen: true, inspection: null })}
            onOpenCreateComplaint={() => setComplaintModalState({ isOpen: true, complaint: null })}
            onSelectInspection={(insp) => setViewInspection(insp)}
            onSelectComplaint={(comp) => setViewComplaint(comp)}
          />
        )}

        {activeTab === 'facilities' && (
          <FacilitiesView
            facilities={facilities}
            isLoading={isLoadingFacilities}
            error={facilitiesError}
            onRefresh={loadFacilities}
            onOpenCreate={() => setFacilityModalState({ isOpen: true, facility: null })}
            onSelectFacility={(fac) => setViewFacility(fac)}
            onEditFacility={(fac) => setFacilityModalState({ isOpen: true, facility: fac })}
            onDeleteFacility={(fac) =>
              setDeleteConfirm({
                isOpen: true,
                type: 'facility',
                id: fac.id,
                title: `Delete Facility: ${fac.name}`,
                message: `Are you sure you want to permanently delete "${fac.name}" (${fac.facility_code})? All associated inspection audits and maintenance tickets will be removed via PostgreSQL foreign key cascade.`,
              })
            }
          />
        )}

        {activeTab === 'inspections' && (
          <InspectionsView
            inspections={inspections}
            facilities={facilities}
            isLoading={isLoadingInspections}
            error={inspectionsError}
            onRefresh={loadInspections}
            onOpenCreate={() => setInspectionModalState({ isOpen: true, inspection: null })}
            onSelectInspection={(insp) => setViewInspection(insp)}
            onEditInspection={(insp) => setInspectionModalState({ isOpen: true, inspection: insp })}
            onDeleteInspection={(insp) =>
              setDeleteConfirm({
                isOpen: true,
                type: 'inspection',
                id: insp.id,
                title: `Delete Inspection: ${insp.inspection_number}`,
                message: `Are you sure you want to delete inspection record #${insp.inspection_number}? This cannot be undone.`,
              })
            }
          />
        )}

        {activeTab === 'complaints' && (
          <ComplaintsView
            complaints={complaints}
            facilities={facilities}
            isLoading={isLoadingComplaints}
            error={complaintsError}
            onRefresh={loadComplaints}
            onOpenCreate={() => setComplaintModalState({ isOpen: true, complaint: null })}
            onSelectComplaint={(comp) => setViewComplaint(comp)}
            onEditComplaint={(comp) => setComplaintModalState({ isOpen: true, complaint: comp })}
            onDeleteComplaint={(comp) =>
              setDeleteConfirm({
                isOpen: true,
                type: 'complaint',
                id: comp.id,
                title: `Delete Complaint: ${comp.ticket_number}`,
                message: `Are you sure you want to delete maintenance ticket #${comp.ticket_number} ("${comp.title}")?`,
              })
            }
            onQuickStatusChange={handleQuickStatusChange}
          />
        )}
      </main>

      {/* Modals */}
      <FacilityModal
        isOpen={facilityModalState.isOpen}
        facility={facilityModalState.facility}
        isLoading={actionLoading}
        onClose={() => setFacilityModalState({ isOpen: false, facility: null })}
        onSave={handleSaveFacility}
      />

      <FacilityDetailModal
        facility={viewFacility}
        isOpen={!!viewFacility}
        onClose={() => setViewFacility(null)}
        onEdit={(fac) => {
          setViewFacility(null);
          setFacilityModalState({ isOpen: true, facility: fac });
        }}
      />

      <InspectionModal
        isOpen={inspectionModalState.isOpen}
        inspection={inspectionModalState.inspection}
        facilities={facilities}
        inspectors={inspectors}
        isLoading={actionLoading}
        onClose={() => setInspectionModalState({ isOpen: false, inspection: null })}
        onSave={handleSaveInspection}
      />

      <InspectionDetailModal
        inspection={viewInspection}
        isOpen={!!viewInspection}
        onClose={() => setViewInspection(null)}
        onEdit={(insp) => {
          setViewInspection(null);
          setInspectionModalState({ isOpen: true, inspection: insp });
        }}
      />

      <ComplaintModal
        isOpen={complaintModalState.isOpen}
        complaint={complaintModalState.complaint}
        facilities={facilities}
        users={inspectors}
        isLoading={actionLoading}
        onClose={() => setComplaintModalState({ isOpen: false, complaint: null })}
        onSave={handleSaveComplaint}
      />

      <ComplaintDetailModal
        complaint={viewComplaint}
        isOpen={!!viewComplaint}
        onClose={() => setViewComplaint(null)}
        onEdit={(comp) => {
          setViewComplaint(null);
          setComplaintModalState({ isOpen: true, complaint: comp });
        }}
        onQuickStatusChange={handleQuickStatusChange}
      />

      <ConfirmModal
        isOpen={deleteConfirm.isOpen}
        title={deleteConfirm.title}
        message={deleteConfirm.message}
        confirmLabel="Confirm Delete"
        isDestructive={true}
        isLoading={actionLoading}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteConfirm({ isOpen: false, type: null, id: null, title: '', message: '' })}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        currentUser={currentUser}
        isLoading={actionLoading}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

export default App;
