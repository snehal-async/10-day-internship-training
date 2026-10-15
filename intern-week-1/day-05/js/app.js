/**
 * app.js - Controller wiring Event Listeners, State Management & Filter Pipeline
 */

document.addEventListener('DOMContentLoaded', async () => {
  // Application State
  const state = {
    allEmployees: [],
    searchQuery: '',
    departmentFilter: 'All',
    statusFilter: 'All',
    sortOption: 'name-asc'
  };

  // 1. Initial Data Load
  try {
    UI.elements.loadingState.classList.remove('hidden');
    state.allEmployees = await EmployeeAPI.init();
    UI.populateDepartmentFilter(state.allEmployees);
    applyFiltersAndRender();
  } catch (err) {
    console.error('Failed to initialize employee directory:', err);
    UI.showToast('Failed to load employee records.', 'error');
  } finally {
    UI.elements.loadingState.classList.add('hidden');
  }

  // -------------------------------------------------------------------------
  // Filter & Search Pipeline
  // -------------------------------------------------------------------------
  function applyFiltersAndRender() {
    let filtered = [...state.allEmployees];

    // 1. Live Text Search (First name, Last name, Full name, Email, Department, Designation)
    const q = state.searchQuery.trim().toLowerCase();
    if (q) {
      filtered = filtered.filter(emp => {
        const fullName = `${emp.firstName} ${emp.lastName}`.toLowerCase();
        return (
          fullName.includes(q) ||
          (emp.email && emp.email.toLowerCase().includes(q)) ||
          (emp.department && emp.department.toLowerCase().includes(q)) ||
          (emp.designation && emp.designation.toLowerCase().includes(q))
        );
      });
    }

    // 2. Department Filter
    if (state.departmentFilter !== 'All') {
      filtered = filtered.filter(emp => emp.department === state.departmentFilter);
    }

    // 3. Status Filter
    if (state.statusFilter !== 'All') {
      filtered = filtered.filter(emp => emp.status === state.statusFilter);
    }

    // 4. Sorting
    filtered.sort((a, b) => {
      switch (state.sortOption) {
        case 'name-asc':
          return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
        case 'name-desc':
          return `${b.firstName} ${b.lastName}`.localeCompare(`${a.firstName} ${a.lastName}`);
        case 'dept-asc':
          return (a.department || '').localeCompare(b.department || '');
        case 'date-desc':
          return new Date(b.joiningDate || 0) - new Date(a.joiningDate || 0);
        case 'date-asc':
          return new Date(a.joiningDate || 0) - new Date(b.joiningDate || 0);
        case 'salary-desc':
          return (b.salary || 0) - (a.salary || 0);
        case 'salary-asc':
          return (a.salary || 0) - (b.salary || 0);
        default:
          return 0;
      }
    });

    // Update Banner if active filter
    const isFiltered = q || state.departmentFilter !== 'All' || state.statusFilter !== 'All';
    if (isFiltered) {
      UI.elements.filterStatusBar.classList.remove('hidden');
      UI.elements.filterStatusText.textContent = `Showing ${filtered.length} of ${state.allEmployees.length} total employees (Filtered)`;
    } else {
      UI.elements.filterStatusBar.classList.add('hidden');
    }

    // Render Table and Summary Cards
    UI.renderTable(filtered, handleTableAction);
    UI.updateSummaryMetrics(state.allEmployees);
  }

  // -------------------------------------------------------------------------
  // Table Actions Dispatcher (View, Edit, Delete)
  // -------------------------------------------------------------------------
  function handleTableAction(action, employeeId) {
    const emp = EmployeeAPI.getById(employeeId);
    if (!emp) {
      UI.showToast(`Employee ${employeeId} not found.`, 'error');
      return;
    }

    if (action === 'view') {
      UI.openDetailsModal(emp, (id) => handleTableAction('edit', id));
    } else if (action === 'edit') {
      UI.openEditModal(emp);
    } else if (action === 'delete') {
      UI.openDeleteModal(emp, confirmDelete);
    }
  }

  function confirmDelete(id) {
    const success = EmployeeAPI.delete(id);
    if (success) {
      state.allEmployees = EmployeeAPI.getAll();
      UI.populateDepartmentFilter(state.allEmployees);
      applyFiltersAndRender();
      UI.showToast(`Employee ${id} deleted successfully.`, 'success');
    } else {
      UI.showToast('Failed to delete employee record.', 'error');
    }
  }

  // -------------------------------------------------------------------------
  // Form Submission (Add & Edit)
  // -------------------------------------------------------------------------
  UI.elements.employeeForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const empId = UI.elements.formEmployeeId.value;
    const isEditing = Boolean(empId);

    const formData = {
      firstName: UI.elements.formFirstName.value,
      lastName: UI.elements.formLastName.value,
      email: UI.elements.formEmail.value,
      phone: UI.elements.formPhone.value,
      department: UI.elements.formDepartment.value,
      designation: UI.elements.formDesignation.value,
      status: UI.elements.formStatus.value,
      joiningDate: UI.elements.formJoiningDate.value,
      salary: UI.elements.formSalary.value
    };

    // Run Validation
    const validationResult = Validation.validate(formData, isEditing ? empId : null);
    if (!validationResult.isValid) {
      UI.displayFormErrors(validationResult.errors);
      return;
    }

    try {
      if (isEditing) {
        EmployeeAPI.update(empId, formData);
        UI.showToast(`Employee ${empId} updated successfully.`, 'success');
      } else {
        const created = EmployeeAPI.create(formData);
        UI.showToast(`New employee ${created.firstName} ${created.lastName} added!`, 'success');
      }

      UI.closeEmployeeModal();
      state.allEmployees = EmployeeAPI.getAll();
      UI.populateDepartmentFilter(state.allEmployees);
      applyFiltersAndRender();
    } catch (err) {
      console.error('Error saving employee record:', err);
      UI.showToast(err.message || 'Error occurred while saving.', 'error');
    }
  });

  // -------------------------------------------------------------------------
  // Interactive Event Listeners
  // -------------------------------------------------------------------------
  
  // Live Search
  UI.elements.searchInput.addEventListener('input', (e) => {
    state.searchQuery = e.target.value;
    if (state.searchQuery) {
      UI.elements.btnClearSearch.classList.remove('hidden');
    } else {
      UI.elements.btnClearSearch.classList.add('hidden');
    }
    applyFiltersAndRender();
  });

  UI.elements.btnClearSearch.addEventListener('click', () => {
    UI.elements.searchInput.value = '';
    state.searchQuery = '';
    UI.elements.btnClearSearch.classList.add('hidden');
    UI.elements.searchInput.focus();
    applyFiltersAndRender();
  });

  // Department Filter
  UI.elements.filterDept.addEventListener('change', (e) => {
    state.departmentFilter = e.target.value;
    applyFiltersAndRender();
  });

  // Status Filter
  UI.elements.filterStatus.addEventListener('change', (e) => {
    state.statusFilter = e.target.value;
    applyFiltersAndRender();
  });

  // Sort Option
  UI.elements.sortSelect.addEventListener('change', (e) => {
    state.sortOption = e.target.value;
    applyFiltersAndRender();
  });

  // Clear Filters
  document.getElementById('btn-clear-filters').addEventListener('click', () => {
    UI.elements.searchInput.value = '';
    UI.elements.btnClearSearch.classList.add('hidden');
    UI.elements.filterDept.value = 'All';
    UI.elements.filterStatus.value = 'All';
    UI.elements.sortSelect.value = 'name-asc';

    state.searchQuery = '';
    state.departmentFilter = 'All';
    state.statusFilter = 'All';
    state.sortOption = 'name-asc';

    applyFiltersAndRender();
    UI.showToast('Filters cleared.', 'info');
  });

  // Add Employee Button
  document.getElementById('btn-add-employee').addEventListener('click', () => {
    UI.openAddModal();
  });

  // Reset Demo Data Button
  document.getElementById('btn-reset-data').addEventListener('click', () => {
    if (confirm('Restore default 22 sample employee records? (Your local changes will be reset).')) {
      state.allEmployees = EmployeeAPI.reset();
      UI.populateDepartmentFilter(state.allEmployees);
      applyFiltersAndRender();
      UI.showToast('Demo dataset restored to 22 default records.', 'info');
    }
  });

  // Modal Close Handlers
  document.getElementById('btn-modal-close').addEventListener('click', () => UI.closeEmployeeModal());
  document.getElementById('btn-modal-cancel').addEventListener('click', () => UI.closeEmployeeModal());

  document.getElementById('btn-details-close').addEventListener('click', () => UI.closeDetailsModal());
  document.getElementById('btn-details-dismiss').addEventListener('click', () => UI.closeDetailsModal());

  document.getElementById('btn-delete-close').addEventListener('click', () => UI.closeDeleteModal());
  document.getElementById('btn-delete-cancel').addEventListener('click', () => UI.closeDeleteModal());

  // Close Modals on Backdrop Click
  window.addEventListener('click', (e) => {
    if (e.target === UI.elements.employeeModal) UI.closeEmployeeModal();
    if (e.target === UI.elements.detailsModal) UI.closeDetailsModal();
    if (e.target === UI.elements.deleteModal) UI.closeDeleteModal();
  });

  // Close Modals on Escape Key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      UI.closeEmployeeModal();
      UI.closeDetailsModal();
      UI.closeDeleteModal();
    }
  });
});