/**
 * ui.js - DOM Rendering, Safe Node Construction & Modal Management
 */

const UI = {
  elements: {
    tableBody: document.getElementById('employee-table-body'),
    loadingState: document.getElementById('table-loading'),
    emptyState: document.getElementById('table-empty'),
    emptyMessage: document.getElementById('empty-message'),
    
    // Stats
    statTotal: document.getElementById('stat-total'),
    statActive: document.getElementById('stat-active'),
    statInactive: document.getElementById('stat-inactive'),
    statDepts: document.getElementById('stat-depts'),
    
    // Filters & Search
    filterDept: document.getElementById('filter-department'),
    filterStatus: document.getElementById('filter-status'),
    sortSelect: document.getElementById('sort-select'),
    searchInput: document.getElementById('search-input'),
    btnClearSearch: document.getElementById('btn-clear-search'),
    filterStatusBar: document.getElementById('filter-status-bar'),
    filterStatusText: document.getElementById('filter-status-text'),
    
    // Modals
    employeeModal: document.getElementById('employee-modal'),
    modalTitle: document.getElementById('modal-title'),
    employeeForm: document.getElementById('employee-form'),
    formEmployeeId: document.getElementById('form-employee-id'),
    formFirstName: document.getElementById('form-first-name'),
    formLastName: document.getElementById('form-last-name'),
    formEmail: document.getElementById('form-email'),
    formPhone: document.getElementById('form-phone'),
    formDepartment: document.getElementById('form-department'),
    formDesignation: document.getElementById('form-designation'),
    formStatus: document.getElementById('form-status'),
    formJoiningDate: document.getElementById('form-joining-date'),
    formSalary: document.getElementById('form-salary'),
    
    detailsModal: document.getElementById('details-modal'),
    detailsContent: document.getElementById('details-content'),
    
    deleteModal: document.getElementById('delete-modal'),
    deleteEmployeeName: document.getElementById('delete-employee-name'),
    
    toastContainer: document.getElementById('toast-container')
  },

  /**
   * Safely render the employee table using programmatic DOM elements
   * (Guarantees zero XSS vulnerability from user input)
   */
  renderTable(employees, onAction) {
    const tbody = this.elements.tableBody;
    tbody.innerHTML = '';

    if (!employees || employees.length === 0) {
      this.elements.emptyState.classList.remove('hidden');
      return;
    }
    this.elements.emptyState.classList.add('hidden');

    const fragment = document.createDocumentFragment();

    employees.forEach(emp => {
      const tr = document.createElement('tr');
      tr.setAttribute('data-id', emp.id);

      // 1. Employee Info (Avatar + Name + Email)
      const tdEmp = document.createElement('td');
      const metaDiv = document.createElement('div');
      metaDiv.className = 'employee-meta';

      const avatar = document.createElement('div');
      avatar.className = 'avatar-badge';
      const initials = `${(emp.firstName || '').charAt(0)}${(emp.lastName || '').charAt(0)}`.toUpperCase();
      avatar.textContent = initials || 'EM';

      const textContainer = document.createElement('div');
      const nameSpan = document.createElement('span');
      nameSpan.className = 'emp-name';
      nameSpan.textContent = `${emp.firstName} ${emp.lastName}`;

      const emailSpan = document.createElement('span');
      emailSpan.className = 'emp-email';
      emailSpan.textContent = emp.email;

      textContainer.appendChild(nameSpan);
      textContainer.appendChild(emailSpan);
      metaDiv.appendChild(avatar);
      metaDiv.appendChild(textContainer);
      tdEmp.appendChild(metaDiv);

      // 2. Department
      const tdDept = document.createElement('td');
      tdDept.textContent = emp.department;

      // 3. Designation
      const tdDesig = document.createElement('td');
      tdDesig.textContent = emp.designation;

      // 4. Status Pill
      const tdStatus = document.createElement('td');
      const pill = document.createElement('span');
      const isActive = emp.status === 'Active';
      pill.className = `status-pill ${isActive ? 'status-active' : 'status-inactive'}`;
      
      const dot = document.createElement('span');
      dot.className = 'status-dot';
      pill.appendChild(dot);
      
      const statusText = document.createTextNode(emp.status);
      pill.appendChild(statusText);
      tdStatus.appendChild(pill);

      // 5. Joining Date
      const tdDate = document.createElement('td');
      tdDate.textContent = this.formatDate(emp.joiningDate);

      // 6. Salary
      const tdSalary = document.createElement('td');
      tdSalary.textContent = `$${Number(emp.salary || 0).toLocaleString()}`;

      // 7. Action Buttons
      const tdActions = document.createElement('td');
      tdActions.className = 'text-right';
      const actionsDiv = document.createElement('div');
      actionsDiv.className = 'table-actions';

      // View
      const btnView = document.createElement('button');
      btnView.className = 'action-btn action-btn-view';
      btnView.title = 'View details';
      btnView.setAttribute('aria-label', `View details for ${emp.firstName} ${emp.lastName}`);
      btnView.innerHTML = '👁️ View';
      btnView.addEventListener('click', () => onAction('view', emp.id));

      // Edit
      const btnEdit = document.createElement('button');
      btnEdit.className = 'action-btn action-btn-edit';
      btnEdit.title = 'Edit employee';
      btnEdit.setAttribute('aria-label', `Edit ${emp.firstName} ${emp.lastName}`);
      btnEdit.innerHTML = '✏️ Edit';
      btnEdit.addEventListener('click', () => onAction('edit', emp.id));

      // Delete
      const btnDelete = document.createElement('button');
      btnDelete.className = 'action-btn action-btn-delete';
      btnDelete.title = 'Delete employee';
      btnDelete.setAttribute('aria-label', `Delete ${emp.firstName} ${emp.lastName}`);
      btnDelete.innerHTML = '🗑️ Delete';
      btnDelete.addEventListener('click', () => onAction('delete', emp.id));

      actionsDiv.appendChild(btnView);
      actionsDiv.appendChild(btnEdit);
      actionsDiv.appendChild(btnDelete);
      tdActions.appendChild(actionsDiv);

      // Assemble Row
      tr.appendChild(tdEmp);
      tr.appendChild(tdDept);
      tr.appendChild(tdDesig);
      tr.appendChild(tdStatus);
      tr.appendChild(tdDate);
      tr.appendChild(tdSalary);
      tr.appendChild(tdActions);

      fragment.appendChild(tr);
    });

    tbody.appendChild(fragment);
  },

  /**
   * Update Summary Metric Counters
   */
  updateSummaryMetrics(allEmployees) {
    const total = allEmployees.length;
    const active = allEmployees.filter(e => e.status === 'Active').length;
    const inactive = total - active;
    const depts = new Set(allEmployees.map(e => e.department).filter(Boolean)).size;

    this.elements.statTotal.textContent = total;
    this.elements.statActive.textContent = active;
    this.elements.statInactive.textContent = inactive;
    this.elements.statDepts.textContent = depts;
  },

  /**
   * Populate Department dropdown dynamically
   */
  populateDepartmentFilter(employees) {
    const select = this.elements.filterDept;
    const currentVal = select.value;
    const depts = Array.from(new Set(employees.map(e => e.department).filter(Boolean))).sort();

    select.innerHTML = '<option value="All">All Departments</option>';
    depts.forEach(dept => {
      const opt = document.createElement('option');
      opt.value = dept;
      opt.textContent = dept;
      select.appendChild(opt);
    });

    if (depts.includes(currentVal)) {
      select.value = currentVal;
    }
  },

  /**
   * Open Modal in Add Mode
   */
  openAddModal() {
    this.clearFormErrors();
    this.elements.employeeForm.reset();
    this.elements.formEmployeeId.value = '';
    this.elements.modalTitle.textContent = 'Add New Employee';
    this.elements.employeeModal.classList.remove('hidden');
    this.elements.employeeModal.setAttribute('aria-hidden', 'false');
    this.elements.formFirstName.focus();
  },

  /**
   * Open Modal in Edit Mode
   */
  openEditModal(emp) {
    this.clearFormErrors();
    this.elements.formEmployeeId.value = emp.id;
    this.elements.formFirstName.value = emp.firstName || '';
    this.elements.formLastName.value = emp.lastName || '';
    this.elements.formEmail.value = emp.email || '';
    this.elements.formPhone.value = emp.phone || '';
    this.elements.formDepartment.value = emp.department || '';
    this.elements.formDesignation.value = emp.designation || '';
    this.elements.formStatus.value = emp.status || 'Active';
    this.elements.formJoiningDate.value = emp.joiningDate || '';
    this.elements.formSalary.value = emp.salary || '';

    this.elements.modalTitle.textContent = `Edit Employee (${emp.id})`;
    this.elements.employeeModal.classList.remove('hidden');
    this.elements.employeeModal.setAttribute('aria-hidden', 'false');
    this.elements.formFirstName.focus();
  },

  closeEmployeeModal() {
    this.elements.employeeModal.classList.add('hidden');
    this.elements.employeeModal.setAttribute('aria-hidden', 'true');
  },

  /**
   * Populate and Open Details Modal
   */
  openDetailsModal(emp, onEditClick) {
    const container = this.elements.detailsContent;
    container.innerHTML = '';

    const profileCard = document.createElement('div');
    profileCard.className = 'profile-card';

    const avatar = document.createElement('div');
    avatar.className = 'profile-avatar';
    avatar.textContent = `${(emp.firstName || '').charAt(0)}${(emp.lastName || '').charAt(0)}`.toUpperCase();

    const info = document.createElement('div');
    const name = document.createElement('div');
    name.className = 'profile-name';
    name.textContent = `${emp.firstName} ${emp.lastName}`;

    const desig = document.createElement('div');
    desig.className = 'profile-designation';
    desig.textContent = `${emp.designation} • ${emp.department}`;

    info.appendChild(name);
    info.appendChild(desig);
    profileCard.appendChild(avatar);
    profileCard.appendChild(info);
    container.appendChild(profileCard);

    // Grid of Details
    const grid = document.createElement('div');
    grid.className = 'detail-grid';

    const items = [
      { label: 'Employee ID', val: emp.id },
      { label: 'Status', val: emp.status },
      { label: 'Email Address', val: emp.email },
      { label: 'Phone Number', val: emp.phone },
      { label: 'Joining Date', val: this.formatDate(emp.joiningDate) },
      { label: 'Annual Salary', val: `$${Number(emp.salary || 0).toLocaleString()}` }
    ];

    items.forEach(it => {
      const itemDiv = document.createElement('div');
      itemDiv.className = 'detail-item';
      
      const lbl = document.createElement('span');
      lbl.className = 'detail-label';
      lbl.textContent = it.label;

      const val = document.createElement('span');
      val.className = 'detail-val';
      val.textContent = it.val;

      itemDiv.appendChild(lbl);
      itemDiv.appendChild(val);
      grid.appendChild(itemDiv);
    });

    container.appendChild(grid);

    // Edit button inside details modal
    const btnEdit = document.getElementById('btn-details-edit');
    btnEdit.onclick = () => {
      this.closeDetailsModal();
      onEditClick(emp.id);
    };

    this.elements.detailsModal.classList.remove('hidden');
    this.elements.detailsModal.setAttribute('aria-hidden', 'false');
  },

  closeDetailsModal() {
    this.elements.detailsModal.classList.add('hidden');
    this.elements.detailsModal.setAttribute('aria-hidden', 'true');
  },

  /**
   * Open Delete Confirmation Modal
   */
  openDeleteModal(emp, onConfirm) {
    this.elements.deleteEmployeeName.textContent = `${emp.firstName} ${emp.lastName} (${emp.id})`;
    
    const confirmBtn = document.getElementById('btn-delete-confirm');
    confirmBtn.onclick = () => {
      this.closeDeleteModal();
      onConfirm(emp.id);
    };

    this.elements.deleteModal.classList.remove('hidden');
    this.elements.deleteModal.setAttribute('aria-hidden', 'false');
  },

  closeDeleteModal() {
    this.elements.deleteModal.classList.add('hidden');
    this.elements.deleteModal.setAttribute('aria-hidden', 'true');
  },

  /**
   * Display inline validation errors on the form
   */
  displayFormErrors(errors) {
    this.clearFormErrors();
    const map = {
      firstName: { input: this.elements.formFirstName, err: document.getElementById('err-first-name') },
      lastName: { input: this.elements.formLastName, err: document.getElementById('err-last-name') },
      email: { input: this.elements.formEmail, err: document.getElementById('err-email') },
      phone: { input: this.elements.formPhone, err: document.getElementById('err-phone') },
      department: { input: this.elements.formDepartment, err: document.getElementById('err-department') },
      designation: { input: this.elements.formDesignation, err: document.getElementById('err-designation') },
      status: { input: this.elements.formStatus, err: document.getElementById('err-status') },
      joiningDate: { input: this.elements.formJoiningDate, err: document.getElementById('err-joining-date') },
      salary: { input: this.elements.formSalary, err: document.getElementById('err-salary') }
    };

    let firstErrorInput = null;

    Object.keys(errors).forEach(key => {
      if (map[key]) {
        map[key].input.classList.add('input-error');
        map[key].err.textContent = errors[key];
        if (!firstErrorInput) firstErrorInput = map[key].input;
      }
    });

    if (firstErrorInput) {
      firstErrorInput.focus();
    }
  },

  clearFormErrors() {
    const inputs = this.elements.employeeForm.querySelectorAll('input, select');
    inputs.forEach(i => i.classList.remove('input-error'));
    const errSpans = this.elements.employeeForm.querySelectorAll('.field-error');
    errSpans.forEach(s => s.textContent = '');
  },

  /**
   * Toast notification display
   */
  showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    const icon = document.createElement('span');
    icon.textContent = type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️';
    
    const text = document.createElement('span');
    text.textContent = message;

    toast.appendChild(icon);
    toast.appendChild(text);
    this.elements.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  },

  formatDate(dateStr) {
    if (!dateStr) return 'N/A';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  }
};