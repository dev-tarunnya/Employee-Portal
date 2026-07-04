


// ==================== DATA LAYER ====================
// Simulates Dataverse tables — in production these would be Dataverse API calls

const USERS = {
  employee: { name:'Sarah Chen', role:'Employee', department:'Engineering', initials:'SC', color:'var(--info)' },
  manager:  { name:'Marcus Rivera', role:'Manager', department:'Engineering', initials:'MR', color:'var(--accent)' },
  hr:       { name:'Priya Sharma', role:'HR Admin', department:'Human Resources', initials:'PS', color:'var(--warning)' }
};

// Document folders with role-based visibility
const FOLDERS = [
  { id:'company-policies', name:'Company Policies', icon:'fa-gavel', roles:['employee','manager','hr'] },
  { id:'engineering', name:'Engineering Docs', icon:'fa-code', roles:['employee','manager','hr'] },
  { id:'hr-confidential', name:'HR Confidential', icon:'fa-lock', roles:['hr'] },
  { id:'finance', name:'Finance Reports', icon:'fa-chart-pie', roles:['manager','hr'] },
  { id:'templates', name:'Templates', icon:'fa-file-lines', roles:['employee','manager','hr'] },
  { id:'it-security', name:'IT Security Policies', icon:'fa-shield-halved', roles:['hr','manager'] },
];

// Files in each folder
const FILES = {
  'company-policies': [
    { name:'Employee Handbook 2025.pdf', type:'pdf', size:'2.4 MB', date:'2025-01-15', author:'HR Team' },
    { name:'Code of Conduct.docx', type:'doc', size:'890 KB', date:'2024-11-20', author:'Legal' },
    { name:'Remote Work Policy.pdf', type:'pdf', size:'1.1 MB', date:'2025-01-08', author:'HR Team' },
  ],
  'engineering': [
    { name:'Sprint Planning Template.xlsx', type:'xls', size:'340 KB', date:'2025-01-22', author:'Marcus R.' },
    { name:'Architecture Decision Record.docx', type:'doc', size:'520 KB', date:'2025-01-18', author:'Sarah C.' },
    { name:'API Documentation.pdf', type:'pdf', size:'3.8 MB', date:'2024-12-10', author:'Dev Team' },
    { name:'Infrastructure Diagram.png', type:'img', size:'1.7 MB', date:'2025-01-05', author:'DevOps' },
  ],
  'hr-confidential': [
    { name:'Salary Band Structure.xlsx', type:'xls', size:'280 KB', date:'2025-01-01', author:'Priya S.' },
    { name:'Redundancy Policy.pdf', type:'pdf', size:'450 KB', date:'2024-09-15', author:'Legal' },
  ],
  'finance': [
    { name:'Q4 2024 Financial Report.pdf', type:'pdf', size:'5.2 MB', date:'2025-01-20', author:'CFO Office' },
    { name:'Budget Allocation 2025.xlsx', type:'xls', size:'1.3 MB', date:'2025-01-10', author:'Finance' },
  ],
  'templates': [
    { name:'Meeting Minutes Template.docx', type:'doc', size:'120 KB', date:'2024-06-01', author:'Admin' },
    { name:'Project Proposal Template.docx', type:'doc', size:'95 KB', date:'2024-06-01', author:'PMO' },
    { name:'Expense Claim Form.pdf', type:'pdf', size:'200 KB', date:'2024-08-15', author:'Finance' },
  ],
  'it-security': [
    { name:'Information Security Policy.pdf', type:'pdf', size:'1.8 MB', date:'2025-01-02', author:'CISO' },
    { name:'Incident Response Playbook.pdf', type:'pdf', size:'2.1 MB', date:'2024-11-30', author:'SecOps' },
  ],
};

// Leave types
const LEAVE_TYPES = [
  { id:'annual', name:'Annual Leave', icon:'fa-umbrella-beach', balance:18, maxDays:24 },
  { id:'sick', name:'Sick Leave', icon:'fa-stethoscope', balance:10, maxDays:10 },
  { id:'personal', name:'Personal/Carer\'s Leave', icon:'fa-heart-pulse', balance:5, maxDays:5 },
  { id:'unpaid', name:'Unpaid Leave', icon:'fa-circle-pause', balance:null, maxDays:999 },
  { id:'compassionate', name:'Compassionate Leave', icon:'fa-hand-holding-heart', balance:2, maxDays:2 },
  { id:'study', name:'Study Leave', icon:'fa-graduation-cap', balance:3, maxDays:3 },
];

// Requests data store (simulates Dataverse table)
let requests = [
  { id:'REQ-001', type:'leave', detail:'Annual Leave — 3 days', submitted:'2025-01-20', status:'approved', by:'Sarah Chen' },
  { id:'REQ-002', type:'payroll', detail:'Payslip Correction — Jan 2025', submitted:'2025-01-22', status:'pending', by:'Sarah Chen' },
  { id:'REQ-003', type:'leave', detail:'Sick Leave — 1 day', submitted:'2025-01-25', status:'pending', by:'Sarah Chen' },
  { id:'REQ-004', type:'payroll', detail:'Tax Declaration Update', submitted:'2024-12-15', status:'approved', by:'Sarah Chen' },
  { id:'REQ-005', type:'leave', detail:'Personal Leave — 2 days', submitted:'2024-11-08', status:'rejected', by:'Sarah Chen' },
  { id:'REQ-006', type:'leave', detail:'Annual Leave — 5 days', submitted:'2025-01-23', status:'pending', by:'James Wilson' },
  { id:'REQ-007', type:'payroll', detail:'Bank Details Update', submitted:'2025-01-24', status:'pending', by:'Emily Tran' },
  { id:'REQ-008', type:'leave', detail:'Compassionate Leave — 2 days', submitted:'2025-01-26', status:'pending', by:'David Park' },
];
let reqCounter = 9;

// Permission matrix for the Permissions page
const FOLDER_PERMS = [
  { folder:'Company Policies', employee:true, manager:true, hr:true },
  { folder:'Engineering Docs', employee:true, manager:true, hr:true },
  { folder:'HR Confidential', employee:false, manager:false, hr:true },
  { folder:'Finance Reports', employee:false, manager:true, hr:true },
  { folder:'Templates', employee:true, manager:true, hr:true },
  { folder:'IT Security Policies', employee:false, manager:true, hr:true },
];
const FORM_PERMS = [
  { form:'Leave Request', employee:true, manager:true, hr:true },
  { form:'Payslip Correction', employee:true, manager:true, hr:true },
  { form:'Tax Declaration', employee:true, manager:true, hr:true },
  { form:'Expense Claim', employee:true, manager:true, hr:true },
  { form:'Bank Details Update', employee:true, manager:true, hr:true },
  { form:'Approvals Panel', employee:false, manager:true, hr:true },
  { form:'Permission Management', employee:false, manager:false, hr:true },
];

// ==================== STATE ====================
let currentRole = null;
let currentPage = 'dashboard';
let selectedLeaveType = null;
let currentFolder = 'company-policies';
let uploadQueue = [];

// ==================== AUTH ====================
function loginAs(role) {
  currentRole = role;
  const user = USERS[role];
  document.getElementById('user-name').textContent = user.name;
  document.getElementById('user-role').textContent = user.role + ' — ' + user.department;
  document.getElementById('user-avatar').textContent = user.initials;
  document.getElementById('user-avatar').style.background = user.color.replace(')', ',0.15)').replace('var(','rgba(').replace('--info','91,155,245').replace('--accent','0,201,167').replace('--warning','255,179,71');
  document.getElementById('user-avatar').style.color = user.color;

  // Role-based nav visibility
  document.getElementById('nav-approvals').style.display = (role === 'manager' || role === 'hr') ? 'flex' : 'none';
  document.getElementById('nav-permissions').style.display = (role === 'hr') ? 'flex' : 'none';
  document.getElementById('nav-handoff').style.display = (role === 'hr') ? 'flex' : 'none';

  document.getElementById('login-screen').classList.add('hidden');
  document.getElementById('app').classList.add('active');
  navigateTo('dashboard');
  showToast('success', 'Welcome back, ' + user.name);
}

function logout() {
  currentRole = null;
  document.getElementById('app').classList.remove('active');
  document.getElementById('login-screen').classList.remove('hidden');
}

// ==================== NAVIGATION ====================
function navigateTo(page) {
  currentPage = page;
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + page).classList.add('active');
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const navItem = document.querySelector(`.nav-item[data-page="${page}"]`);
  if (navItem) navItem.classList.add('active');

  const titles = {
    dashboard:'Dashboard', documents:'Documents', leave:'Leave Request',
    payroll:'Payroll Forms', requests:'My Requests', approvals:'Approvals',
    permissions:'Permissions', handoff:'Handoff Guide'
  };
  document.getElementById('page-title').textContent = titles[page] || page;

  // Render page-specific content
  if (page === 'dashboard') renderDashboard();
  if (page === 'documents') renderDocuments();
  if (page === 'leave') initLeaveForm();
  if (page === 'requests') renderRequests();
  if (page === 'approvals') renderApprovals();
  if (page === 'permissions') renderPermissions();

  // Close mobile sidebar
  document.getElementById('sidebar').classList.remove('open');
}

function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
}

// ==================== DASHBOARD ====================
function renderDashboard() {
  const pendingCount = requests.filter(r => r.status === 'pending' && (currentRole === 'hr' || r.by === USERS[currentRole].name)).length;
  document.getElementById('dash-pending').textContent = pendingCount;

  const badge = document.getElementById('pending-badge');
  if (pendingCount > 0) { badge.style.display = 'inline'; badge.textContent = pendingCount; }
  else { badge.style.display = 'none'; }

  // Approval badge for managers/HR
  if (currentRole === 'manager' || currentRole === 'hr') {
    const approvalCount = requests.filter(r => r.status === 'pending' && r.by !== USERS[currentRole].name).length;
    const ab = document.getElementById('approval-badge');
    ab.textContent = approvalCount;
    ab.style.display = approvalCount > 0 ? 'inline' : 'none';
  }

  // Recent requests (user's own)
  const userRequests = requests.filter(r => r.by === USERS[currentRole].name).slice(0, 5);
  const tbody = document.getElementById('dash-recent-table');
  tbody.innerHTML = userRequests.map(r => `
    <tr>
      <td><span style="font-weight:600;font-size:13px;">${r.type === 'leave' ? 'Leave' : 'Payroll'}</span></td>
      <td style="color:var(--fg-muted);font-size:13px;">${r.detail}</td>
      <td style="color:var(--fg-muted);font-size:13px;">${r.submitted}</td>
      <td><span class="badge ${r.status}">${r.status.charAt(0).toUpperCase()+r.status.slice(1)}</span></td>
    </tr>
  `).join('');

  // Leave breakdown
  const breakdown = document.getElementById('leave-breakdown');
  const types = LEAVE_TYPES.slice(0, 4);
  breakdown.innerHTML = types.map(t => {
    const pct = t.balance !== null ? Math.round((t.balance / t.maxDays) * 100) : 0;
    const color = pct > 50 ? 'var(--accent)' : pct > 20 ? 'var(--warning)' : 'var(--danger)';
    return `<div>
      <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:4px;">
        <span style="color:var(--fg-muted);">${t.name}</span>
        <span style="font-weight:600;">${t.balance !== null ? t.balance + '/' + t.maxDays : 'N/A'}</span>
      </div>
      <div class="progress-bar"><div class="progress-fill" style="width:${pct}%;background:${color};"></div></div>
    </div>`;
  }).join('');
}

// ==================== DOCUMENTS ====================
function renderDocuments() {
  const tree = document.getElementById('folder-tree');
  const visibleFolders = FOLDERS.filter(f => f.roles.includes(currentRole));
  tree.innerHTML = visibleFolders.map(f => `
    <div class="folder-item ${f.id === currentFolder ? 'active' : ''}" onclick="selectFolder('${f.id}')">
      <i class="fa-solid ${f.icon}" style="width:18px;text-align:center;"></i>
      <span>${f.name}</span>
      ${!f.roles.includes('employee') ? '<i class="fa-solid fa-lock" style="font-size:10px;color:var(--fg-dim);margin-left:auto;"></i>' : ''}
    </div>
  `).join('');

  renderFileList();
}

function selectFolder(folderId) {
  currentFolder = folderId;
  const folder = FOLDERS.find(f => f.id === folderId);
  document.getElementById('current-folder-title').textContent = folder ? folder.name : '';
  renderDocuments();
}

function renderFileList() {
  const list = document.getElementById('file-list');
  const files = FILES[currentFolder] || [];
  if (files.length === 0) {
    list.innerHTML = '<div style="text-align:center;padding:40px;color:var(--fg-dim);"><i class="fa-solid fa-folder-open" style="font-size:32px;margin-bottom:10px;display:block;"></i>This folder is empty</div>';
    return;
  }
  list.innerHTML = files.map(f => {
    const iconClass = f.type === 'pdf' ? 'fa-file-pdf' : f.type === 'doc' ? 'fa-file-word' : f.type === 'xls' ? 'fa-file-excel' : 'fa-file-image';
    return `<div class="file-item">
      <div class="file-icon ${f.type}"><i class="fa-solid ${iconClass}"></i></div>
      <div style="flex:1;min-width:0;">
        <div style="font-weight:600;font-size:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${f.name}</div>
        <div style="font-size:12px;color:var(--fg-muted);">${f.size} — ${f.author} — ${f.date}</div>
      </div>
      <button class="btn btn-secondary btn-sm" onclick="downloadFile('${f.name}')" title="Download"><i class="fa-solid fa-download"></i></button>
    </div>`;
  }).join('');
}

function downloadFile(name) {
  showToast('success', `Downloading "${name}" — in production this fetches from Dataverse/Azure Blob`);
}

// Drag & drop
function initDropZones() {
  const zones = [document.getElementById('drop-zone'), document.getElementById('modal-drop-zone')];
  zones.forEach(zone => {
    if (!zone) return;
    zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('dragover'); });
    zone.addEventListener('dragleave', () => zone.classList.remove('dragover'));
    zone.addEventListener('drop', e => {
      e.preventDefault(); zone.classList.remove('dragover');
      handleFiles(e.dataTransfer.files, zone.id);
    });
    zone.addEventListener('click', () => {
      const input = zone.id === 'modal-drop-zone' ? document.getElementById('modal-file-input') : document.getElementById('file-input');
      input.click();
    });
  });

  document.getElementById('file-input').addEventListener('change', e => handleFiles(e.target.files, 'drop-zone'));
  document.getElementById('modal-file-input').addEventListener('change', e => handleFiles(e.target.files, 'modal-drop-zone'));
  document.getElementById('receipt-input')?.addEventListener('change', e => {
    if (e.target.files.length > 0) {
      showToast('info', `Receipt attached: ${e.target.files[0].name}`);
    }
  });
  const receiptDrop = document.getElementById('receipt-drop');
  if (receiptDrop) {
    receiptDrop.addEventListener('dragover', e => { e.preventDefault(); receiptDrop.style.borderColor='var(--accent)'; receiptDrop.style.background='var(--accent-dim)'; });
    receiptDrop.addEventListener('dragleave', () => { receiptDrop.style.borderColor=''; receiptDrop.style.background=''; });
    receiptDrop.addEventListener('drop', e => {
      e.preventDefault(); receiptDrop.style.borderColor=''; receiptDrop.style.background='';
      if (e.dataTransfer.files.length > 0) showToast('info', `Receipt attached: ${e.dataTransfer.files[0].name}`);
    });
    receiptDrop.addEventListener('click', () => document.getElementById('receipt-input').click());
  }
}

function handleFiles(fileList, zoneId) {
  if (zoneId === 'modal-drop-zone' || zoneId === 'upload-modal') {
    uploadQueue = [...uploadQueue, ...Array.from(fileList)];
    renderUploadQueue();
  } else {
    // Direct drop on documents page
    const folder = FOLDERS.find(f => f.id === currentFolder);
    Array.from(fileList).forEach(f => {
      const ext = f.name.split('.').pop().toLowerCase();
      const type = ext === 'pdf' ? 'pdf' : ext === 'doc' || ext === 'docx' ? 'doc' : ext === 'xls' || ext === 'xlsx' ? 'xls' : 'img';
      FILES[currentFolder].push({
        name: f.name, type, size: (f.size / 1024 / 1024).toFixed(1) + ' MB',
        date: new Date().toISOString().split('T')[0], author: USERS[currentRole].name
      });
    });
    renderFileList();
    showToast('success', `${fileList.length} file(s) uploaded to "${folder.name}" — written to Dataverse`);
  }
}

function showUploadModal() {
  uploadQueue = [];
  renderUploadQueue();
  document.getElementById('upload-modal').classList.add('active');
}
function closeUploadModal() {
  document.getElementById('upload-modal').classList.remove('active');
  uploadQueue = [];
}
function renderUploadQueue() {
  const queue = document.getElementById('upload-queue');
  const btn = document.getElementById('upload-confirm-btn');
  if (uploadQueue.length === 0) { queue.innerHTML = ''; btn.style.display = 'none'; return; }
  btn.style.display = 'inline-flex';
  document.getElementById('upload-count').textContent = uploadQueue.length;
  queue.innerHTML = uploadQueue.map((f, i) => `
    <div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--border);">
      <i class="fa-solid fa-file" style="color:var(--fg-dim);"></i>
      <span style="flex:1;font-size:13px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${f.name}</span>
      <span style="font-size:12px;color:var(--fg-dim);">${(f.size/1024).toFixed(0)} KB</span>
      <button onclick="removeFromQueue(${i})" style="background:none;border:none;color:var(--danger);cursor:pointer;font-size:12px;"><i class="fa-solid fa-xmark"></i></button>
    </div>
  `).join('');
}
function removeFromQueue(i) { uploadQueue.splice(i, 1); renderUploadQueue(); }
function confirmUpload() {
  const folder = FOLDERS.find(f => f.id === currentFolder);
  uploadQueue.forEach(f => {
    const ext = f.name.split('.').pop().toLowerCase();
    const type = ext === 'pdf' ? 'pdf' : ext === 'doc' || ext === 'docx' ? 'doc' : ext === 'xls' || ext === 'xlsx' ? 'xls' : 'img';
    FILES[currentFolder].push({
      name: f.name, type, size: (f.size / 1024 / 1024).toFixed(1) + ' MB',
      date: new Date().toISOString().split('T')[0], author: USERS[currentRole].name
    });
  });
  closeUploadModal();
  renderFileList();
  showToast('success', `${uploadQueue.length} file(s) uploaded to "${folder.name}" — written to Dataverse`);
  uploadQueue = [];
}

// ==================== LEAVE REQUEST ====================
function initLeaveForm() {
  selectedLeaveType = null;
  document.querySelectorAll('.leave-step').forEach(s => s.style.display = 'none');
  document.getElementById('leave-step-1').style.display = 'block';
  document.querySelectorAll('#leave-steps .step').forEach((s, i) => {
    s.classList.remove('active','completed');
    if (i === 0) s.classList.add('active');
  });
  clearErrors();
  renderLeaveTypes();
}

function renderLeaveTypes() {
  const grid = document.getElementById('leave-type-grid');
  grid.innerHTML = LEAVE_TYPES.map(t => `
    <div class="folder-item" style="flex-direction:column;align-items:flex-start;padding:16px;border:1px solid var(--border);border-radius:var(--radius);cursor:pointer;" onclick="selectLeaveType('${t.id}')" id="lt-${t.id}">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
        <i class="fa-solid ${t.icon}" style="font-size:18px;color:var(--accent);"></i>
        <span style="font-weight:600;font-size:14px;">${t.name}</span>
      </div>
      <div style="font-size:12px;color:var(--fg-muted);">${t.balance !== null ? t.balance + ' days remaining' : 'No balance limit'}</div>
    </div>
  `).join('');
}

function selectLeaveType(id) {
  selectedLeaveType = id;
  document.querySelectorAll('[id^="lt-"]').forEach(el => {
    el.style.borderColor = el.id === 'lt-' + id ? 'var(--accent)' : 'var(--border)';
    el.style.background = el.id === 'lt-' + id ? 'var(--accent-dim)' : '';
  });
  document.getElementById('err-leave-type').classList.remove('show');
}

function leaveNext(step) {
  clearErrors();
  if (step === 2) {
    if (!selectedLeaveType) { document.getElementById('err-leave-type').classList.add('show'); return; }
    document.querySelectorAll('.leave-step').forEach(s => s.style.display = 'none');
    document.getElementById('leave-step-2').style.display = 'block';
    updateSteps(2);
  } else if (step === 3) {
    const start = document.getElementById('leave-start').value;
    const end = document.getElementById('leave-end').value;
    let valid = true;
    if (!start) { document.getElementById('err-leave-start').classList.add('show'); document.getElementById('leave-start').classList.add('error'); valid = false; }
    if (!end) { document.getElementById('err-leave-end').classList.add('show'); document.getElementById('leave-end').classList.add('error'); valid = false; }
    if (start && end && new Date(end) < new Date(start)) {
      document.getElementById('err-leave-dates').classList.add('show'); valid = false;
    }
    if (!valid) return;

    // Build review
    const lt = LEAVE_TYPES.find(t => t.id === selectedLeaveType);
    const days = calcBusinessDays(new Date(start), new Date(end));
    const review = document.getElementById('leave-review');
    review.innerHTML = `
      <div style="display:flex;justify-content:space-between;padding:12px 16px;background:var(--bg-raised);border-radius:8px;">
        <span style="color:var(--fg-muted);font-size:13px;">Leave Type</span>
        <span style="font-weight:600;font-size:14px;">${lt.name}</span>
      </div>
      <div style="display:flex;justify-content:space-between;padding:12px 16px;background:var(--bg-raised);border-radius:8px;">
        <span style="color:var(--fg-muted);font-size:13px;">Start Date</span>
        <span style="font-weight:600;font-size:14px;">${formatDate(start)}</span>
      </div>
      <div style="display:flex;justify-content:space-between;padding:12px 16px;background:var(--bg-raised);border-radius:8px;">
        <span style="color:var(--fg-muted);font-size:13px;">End Date</span>
        <span style="font-weight:600;font-size:14px;">${formatDate(end)}</span>
      </div>
      <div style="display:flex;justify-content:space-between;padding:12px 16px;background:var(--bg-raised);border-radius:8px;">
        <span style="color:var(--fg-muted);font-size:13px;">Business Days</span>
        <span style="font-weight:700;font-size:14px;color:var(--accent);">${days} day${days !== 1 ? 's' : ''}</span>
      </div>
      <div style="padding:12px 16px;background:var(--bg-raised);border-radius:8px;">
        <span style="color:var(--fg-muted);font-size:13px;display:block;margin-bottom:4px;">Notes</span>
        <span style="font-size:14px;">${document.getElementById('leave-reason').value || '<em style="color:var(--fg-dim);">None provided</em>'}</span>
      </div>
    `;
    document.querySelectorAll('.leave-step').forEach(s => s.style.display = 'none');
    document.getElementById('leave-step-3').style.display = 'block';
    updateSteps(3);
  } else {
    document.querySelectorAll('.leave-step').forEach(s => s.style.display = 'none');
    document.getElementById('leave-step-' + step).style.display = 'block';
    updateSteps(step);
  }
}

function updateSteps(current) {
  document.querySelectorAll('#leave-steps .step').forEach((s, i) => {
    s.classList.remove('active','completed');
    if (i + 1 < current) s.classList.add('completed');
    if (i + 1 === current) s.classList.add('active');
  });
}

function calcLeaveDays() {
  const start = document.getElementById('leave-start').value;
  const end = document.getElementById('leave-end').value;
  const summary = document.getElementById('leave-days-summary');
  if (start && end) {
    const days = calcBusinessDays(new Date(start), new Date(end));
    if (days >= 0) {
      summary.style.display = 'block';
      document.getElementById('leave-days-count').textContent = `${days} business day${days !== 1 ? 's' : ''} selected`;
    } else {
      summary.style.display = 'none';
    }
  } else {
    summary.style.display = 'none';
  }
}

function calcBusinessDays(start, end) {
  if (end < start) return -1;
  let count = 0;
  let current = new Date(start);
  while (current <= end) {
    const day = current.getDay();
    if (day !== 0 && day !== 6) count++;
    current.setDate(current.getDate() + 1);
  }
  return count;
}

function submitLeave() {
  const btn = document.getElementById('leave-submit-btn');
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Writing to Dataverse...';
  btn.disabled = true;

  setTimeout(() => {
    const lt = LEAVE_TYPES.find(t => t.id === selectedLeaveType);
    const start = document.getElementById('leave-start').value;
    const end = document.getElementById('leave-end').value;
    const days = calcBusinessDays(new Date(start), new Date(end));

    const newReq = {
      id: 'REQ-' + String(reqCounter++).padStart(3, '0'),
      type: 'leave',
      detail: `${lt.name} — ${days} day${days !== 1 ? 's' : ''}`,
      submitted: new Date().toISOString().split('T')[0],
      status: 'pending',
      by: USERS[currentRole].name
    };
    requests.unshift(newReq);

    btn.innerHTML = '<i class="fa-solid fa-check"></i> Submitted';
    btn.style.background = 'var(--success)';

    showToast('success', `Leave request ${newReq.id} created — approval flow triggered. Email notification will be sent to ${currentRole === 'employee' ? 'Marcus Rivera' : 'Priya Sharma'}.`);

    setTimeout(() => {
      btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Submit to Dataverse';
      btn.style.background = '';
      btn.disabled = false;
      navigateTo('requests');
    }, 2000);
  }, 1500);
}

// ==================== PAYROLL FORMS ====================
function switchPayrollTab(tab) {
  document.querySelectorAll('.payroll-tab').forEach(t => t.style.display = 'none');
  document.querySelectorAll('#payroll-tabs .tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('tab-' + tab).style.display = 'block';
  document.querySelector(`#payroll-tabs [data-tab="${tab}"]`).classList.add('active');
  clearErrors();
}

function submitPayrollForm(type) {
  clearErrors();
  let valid = true;

  if (type === 'payslip') {
    if (!val('pay-period','err-pay-period')) valid = false;
    if (!val('correction-type','err-correction-type')) valid = false;
    if (!val('expected-amount','err-expected-amount')) valid = false;
    if (!val('actual-amount','err-actual-amount')) valid = false;
    if (!val('pay-description','err-pay-description')) valid = false;
  } else if (type === 'tax') {
    const tfn = document.getElementById('tfn-input').value.replace(/\s/g,'');
    if (tfn.length !== 9 || !/^\d{9}$/.test(tfn)) {
      document.getElementById('err-tfn').classList.add('show');
      document.getElementById('tfn-input').classList.add('error');
      valid = false;
    }
    if (!val('residency-status','err-residency')) valid = false;
    if (!val('tft-claim','err-tft')) valid = false;
  } else if (type === 'expense') {
    if (!val('expense-category','err-expense-cat')) valid = false;
    if (!val('expense-date','err-expense-date')) valid = false;
    if (!val('expense-amount','err-expense-amount')) valid = false;
    if (!val('expense-desc','err-expense-desc')) valid = false;
  } else if (type === 'bank') {
    if (!val('bank-name','err-bank-name')) valid = false;
    const bsb = document.getElementById('bank-bsb').value.replace(/-/g,'');
    if (bsb.length !== 6 || !/^\d{6}$/.test(bsb)) {
      document.getElementById('err-bank-bsb').classList.add('show');
      document.getElementById('bank-bsb').classList.add('error');
      valid = false;
    }
    const acc = document.getElementById('bank-account').value;
    if (acc.length < 6) {
      document.getElementById('err-bank-account').classList.add('show');
      document.getElementById('bank-account').classList.add('error');
      valid = false;
    }
    if (!val('bank-accname','err-bank-accname')) valid = false;
  }

  if (!valid) return;

  const typeLabels = { payslip:'Payslip Correction', tax:'Tax Declaration', expense:'Expense Claim', bank:'Bank Details Update' };
  const newReq = {
    id: 'REQ-' + String(reqCounter++).padStart(3, '0'),
    type: 'payroll',
    detail: typeLabels[type],
    submitted: new Date().toISOString().split('T')[0],
    status: 'pending',
    by: USERS[currentRole].name
  };
  requests.unshift(newReq);

  showToast('success', `${typeLabels[type]} ${newReq.id} submitted — approval flow triggered. You'll receive an email once approved or rejected.`);
  clearPayrollForm(type);
}

function clearPayrollForm(type) {
  const ids = {
    payslip: ['pay-period','correction-type','expected-amount','actual-amount','pay-description'],
    tax: ['tfn-input','residency-status','tft-claim'],
    expense: ['expense-category','expense-date','expense-amount','expense-desc'],
    bank: ['bank-name','bank-bsb','bank-account','bank-accname']
  };
  (ids[type] || []).forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
    if (el) el.classList.remove('error');
  });
  clearErrors();
}

// ==================== REQUESTS ====================
function renderRequests() {
  const typeFilter = document.getElementById('filter-type').value;
  const statusFilter = document.getElementById('filter-status').value;

  let filtered = requests.filter(r => {
    if (currentRole !== 'hr' && r.by !== USERS[currentRole].name) return false;
    if (typeFilter !== 'all' && r.type !== typeFilter) return false;
    if (statusFilter !== 'all' && r.status !== statusFilter) return false;
    return true;
  });

  const tbody = document.getElementById('requests-table');
  const noReqs = document.getElementById('no-requests');

  if (filtered.length === 0) {
    tbody.innerHTML = '';
    noReqs.style.display = 'block';
    return;
  }
  noReqs.style.display = 'none';

  tbody.innerHTML = filtered.map(r => `
    <tr>
      <td style="font-weight:600;font-size:13px;color:var(--accent);">${r.id}</td>
      <td><span style="font-size:13px;">${r.type === 'leave' ? 'Leave' : 'Payroll'}</span></td>
      <td style="font-size:13px;color:var(--fg-muted);">${r.detail}</td>
      <td style="font-size:13px;color:var(--fg-muted);">${r.submitted}</td>
      <td><span class="badge ${r.status}">${r.status.charAt(0).toUpperCase()+r.status.slice(1)}</span></td>
      <td>${r.status === 'pending' ? `<button class="btn btn-danger btn-sm" onclick="cancelRequest('${r.id}')"><i class="fa-solid fa-xmark"></i> Cancel</button>` : '<span style="font-size:12px;color:var(--fg-dim);">—</span>'}</td>
    </tr>
  `).join('');
}

function cancelRequest(id) {
  const req = requests.find(r => r.id === id);
  if (req) {
    req.status = 'rejected';
    renderRequests();
    showToast('info', `${id} has been cancelled.`);
  }
}

// ==================== APPROVALS ====================
function renderApprovals() {
  const pendingReqs = requests.filter(r => r.status === 'pending' && r.by !== USERS[currentRole].name);
  const list = document.getElementById('approvals-list');
  const noApprovals = document.getElementById('no-approvals');

  if (pendingReqs.length === 0) {
    list.innerHTML = '';
    noApprovals.style.display = 'block';
    return;
  }
  noApprovals.style.display = 'none';

  list.innerHTML = pendingReqs.map(r => `
    <div class="approval-card" id="approval-${r.id}">
      <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:12px;">
        <div>
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">
            <span style="font-weight:700;font-size:14px;color:var(--accent);">${r.id}</span>
            <span class="badge pending">Pending</span>
          </div>
          <div style="font-size:15px;font-weight:600;margin-bottom:2px;">${r.detail}</div>
          <div style="font-size:12px;color:var(--fg-muted);">Submitted by ${r.by} on ${r.submitted}</div>
        </div>
        <div style="width:40px;height:40px;border-radius:10px;background:var(--bg-hover);display:flex;align-items:center;justify-content:center;">
          <i class="fa-solid ${r.type === 'leave' ? 'fa-calendar' : 'fa-money-bill'}" style="color:var(--fg-muted);"></i>
        </div>
      </div>
      <div style="display:flex;gap:8px;justify-content:flex-end;">
        <button class="btn btn-danger btn-sm" onclick="handleApproval('${r.id}','rejected')">
          <i class="fa-solid fa-xmark"></i> Reject
        </button>
        <button class="btn btn-primary btn-sm" onclick="handleApproval('${r.id}','approved')">
          <i class="fa-solid fa-check"></i> Approve
        </button>
      </div>
    </div>
  `).join('');
}

function handleApproval(id, status) {
  const req = requests.find(r => r.id === id);
  if (req) {
    req.status = status;
    const card = document.getElementById('approval-' + id);
    if (card) {
      card.style.transition = 'all 0.3s';
      card.style.opacity = '0';
      card.style.transform = 'translateX(20px)';
    }
    const verb = status === 'approved' ? 'approved' : 'rejected';
    showToast(status === 'approved' ? 'success' : 'error', `${id} ${verb} — email notification sent to ${req.by}.`);

    setTimeout(() => {
      renderApprovals();
      // Update badges
      const pendingCount = requests.filter(r => r.status === 'pending' && r.by !== USERS[currentRole].name).length;
      const ab = document.getElementById('approval-badge');
      ab.textContent = pendingCount;
      ab.style.display = pendingCount > 0 ? 'inline' : 'none';
    }, 300);
  }
}

// ==================== PERMISSIONS ====================
function renderPermissions() {
  const ft = document.getElementById('perm-folder-table');
  ft.innerHTML = FOLDER_PERMS.map(p => `
    <tr>
      <td style="font-weight:500;">${p.folder}</td>
      <td>${p.employee ? '<i class="fa-solid fa-check" style="color:var(--success);"></i>' : '<i class="fa-solid fa-xmark" style="color:var(--danger);"></i>'}</td>
      <td>${p.manager ? '<i class="fa-solid fa-check" style="color:var(--success);"></i>' : '<i class="fa-solid fa-xmark" style="color:var(--danger);"></i>'}</td>
      <td>${p.hr ? '<i class="fa-solid fa-check" style="color:var(--success);"></i>' : '<i class="fa-solid fa-xmark" style="color:var(--danger);"></i>'}</td>
    </tr>
  `).join('');

  const frt = document.getElementById('perm-form-table');
  frt.innerHTML = FORM_PERMS.map(p => `
    <tr>
      <td style="font-weight:500;">${p.form}</td>
      <td>${p.employee ? '<i class="fa-solid fa-check" style="color:var(--success);"></i>' : '<i class="fa-solid fa-xmark" style="color:var(--danger);"></i>'}</td>
      <td>${p.manager ? '<i class="fa-solid fa-check" style="color:var(--success);"></i>' : '<i class="fa-solid fa-xmark" style="color:var(--danger);"></i>'}</td>
      <td>${p.hr ? '<i class="fa-solid fa-check" style="color:var(--success);"></i>' : '<i class="fa-solid fa-xmark" style="color:var(--danger);"></i>'}</td>
    </tr>
  `).join('');
}

// ==================== UTILITIES ====================
function val(inputId, errorId) {
  const el = document.getElementById(inputId);
  const err = document.getElementById(errorId);
  if (!el.value.trim()) {
    err.classList.add('show');
    el.classList.add('error');
    return false;
  }
  return true;
}

function clearErrors() {
  document.querySelectorAll('.error-msg').forEach(e => e.classList.remove('show'));
  document.querySelectorAll('.form-input, .form-select, .form-textarea').forEach(e => e.classList.remove('error'));
}

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-AU', { weekday:'short', day:'numeric', month:'short', year:'numeric' });
}

function showToast(type, message) {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = 'toast ' + type;
  const icons = { success:'fa-check-circle', error:'fa-circle-exclamation', info:'fa-circle-info' };
  const colors = { success:'var(--success)', error:'var(--danger)', info:'var(--info)' };
  toast.innerHTML = `<i class="fa-solid ${icons[type]}" style="color:${colors[type]};font-size:16px;"></i><span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'slideOut 0.3s ease forwards';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// ==================== RESPONSIVE ====================
function handleResize() {
  const toggle = document.getElementById('menu-toggle');
  if (window.innerWidth <= 768) {
    toggle.style.display = 'block';
  } else {
    toggle.style.display = 'none';
    document.getElementById('sidebar').classList.remove('open');
  }
}
window.addEventListener('resize', handleResize);

// ==================== INIT ====================
document.addEventListener('DOMContentLoaded', () => {
  handleResize();
  initDropZones();

  // Set min dates for date inputs
  const today = new Date().toISOString().split('T')[0];
  const leaveStart = document.getElementById('leave-start');
  const leaveEnd = document.getElementById('leave-end');
  if (leaveStart) leaveStart.min = today;
  if (leaveEnd) leaveEnd.min = today;

  // TFN auto-format
  document.getElementById('tfn-input')?.addEventListener('input', function() {
    let v = this.value.replace(/\s/g, '').replace(/(\d{3})/g, '$1 ').trim();
    this.value = v;
  });

  // BSB auto-format
  document.getElementById('bank-bsb')?.addEventListener('input', function() {
    let v = this.value.replace(/[^0-9]/g, '');
    if (v.length > 3) v = v.slice(0,3) + '-' + v.slice(3,6);
    this.value = v;
  });
});
