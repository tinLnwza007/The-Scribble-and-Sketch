/* ============================================
   My Creative Archive — Todo App Logic (Trello & Theme Mod)
   ============================================ */

(function () {
  'use strict';

  // ─── DOM References ───
  const form = document.getElementById('add-todo-form');
  const input = document.getElementById('todo-input');
  const list = document.getElementById('todo-list');
  const trelloBoard = document.getElementById('trello-board');
  const emptyState = document.getElementById('empty-state');
  const statsBar = document.getElementById('stats-bar');
  const statsInfo = document.getElementById('stats-info');
  const clearDoneBtn = document.getElementById('clear-done-btn');
  
  // Filter tabs & counts
  const filterBar = document.getElementById('filter-bar');
  const countAll = document.getElementById('count-all');
  const countActive = document.getElementById('count-active');
  const countDone = document.getElementById('count-done');
  
  // Column Lists
  const todoColList = document.getElementById('todo-column-list');
  const doingColList = document.getElementById('doing-column-list');
  const doneColList = document.getElementById('done-column-list');
  
  // Column Badge Counts
  const todoCountBadge = document.getElementById('todo-count');
  const doingCountBadge = document.getElementById('doing-count');
  const doneCountBadge = document.getElementById('done-count');

  // Theme & View Switchers
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const themeIcon = document.getElementById('theme-icon');
  const viewSwitcher = document.getElementById('view-switcher');
  const viewListBtn = document.getElementById('view-list-btn');
  const viewBoardBtn = document.getElementById('view-board-btn');
  const toolbar = document.getElementById('toolbar');

  // ─── Constants & Storage Keys ───
  const STORAGE_KEY = 'creative-archive-todos';
  const THEME_KEY = 'creative-archive-theme';
  const VIEW_KEY = 'creative-archive-view';

  // ─── State ───
  let todos = loadTodos();
  let currentFilter = 'all'; // 'all' | 'active' | 'done'
  let currentView = localStorage.getItem(VIEW_KEY) || 'list'; // 'list' | 'board'
  let draggedId = null;

  // ─── LocalStorage ───
  function loadTodos() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      const parsed = data ? JSON.parse(data) : [];
      
      // Data Migration: handle old "done" structure and guarantee status
      let migrated = false;
      parsed.forEach(t => {
        if (t.status === undefined) {
          t.status = t.done ? 'done' : 'todo';
          migrated = true;
        }
        if (t.done === undefined) {
          t.done = (t.status === 'done');
          migrated = true;
        }
      });
      if (migrated && parsed.length > 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
      }
      return parsed;
    } catch {
      return [];
    }
  }

  function saveTodos() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }

  // ─── Theme Management ───
  function initTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
      themeIcon.textContent = 'light_mode';
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
      themeIcon.textContent = 'dark_mode';
    }
  }

  function toggleTheme() {
    const isDark = document.documentElement.classList.contains('dark');
    if (isDark) {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
      themeIcon.textContent = 'dark_mode';
      localStorage.setItem(THEME_KEY, 'light');
    } else {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
      themeIcon.textContent = 'light_mode';
      localStorage.setItem(THEME_KEY, 'dark');
    }
  }

  // ─── Helpers ───
  function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  function formatDate(timestamp) {
    const d = new Date(timestamp);
    const day = d.getDate();
    const months = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
                     'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
    const month = months[d.getMonth()];
    const hours = String(d.getHours()).padStart(2, '0');
    const mins = String(d.getMinutes()).padStart(2, '0');
    return `${day} ${month} ${hours}:${mins}`;
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  const handDrawnX = `
    <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 4 L16 16" />
      <path d="M16 5 L4 15" />
    </svg>
  `;

  // ─── Render View Controller ───
  function switchView(view) {
    currentView = view;
    localStorage.setItem(VIEW_KEY, view);

    viewListBtn.classList.toggle('view-btn--active', view === 'list');
    viewBoardBtn.classList.toggle('view-btn--active', view === 'board');

    if (view === 'list') {
      filterBar.style.display = 'flex';
      statsBar.style.display = 'flex';
      trelloBoard.style.display = 'none';
      list.style.display = 'flex';
    } else {
      filterBar.style.display = 'none';
      statsBar.style.display = 'none';
      trelloBoard.style.display = 'flex';
      list.style.display = 'none';
    }

    renderTodos();
  }

  function updateCounts() {
    const total = todos.length;
    const todoCount = todos.filter(t => t.status === 'todo').length;
    const doingCount = todos.filter(t => t.status === 'doing').length;
    const doneCount = todos.filter(t => t.status === 'done').length;

    // Filters counts (done counts match the tab logic)
    countAll.textContent = total;
    countActive.textContent = todoCount + doingCount;
    countDone.textContent = doneCount;

    // Board columns counts
    todoCountBadge.textContent = todoCount;
    doingCountBadge.textContent = doingCount;
    doneCountBadge.textContent = doneCount;

    statsInfo.innerHTML = `<strong>${total}</strong> รายการ · <strong>${doneCount}</strong> เสร็จแล้ว`;
    clearDoneBtn.style.display = doneCount > 0 ? 'block' : 'none';
  }

  function renderTodos() {
    if (todos.length === 0) {
      emptyState.style.display = 'flex';
      list.style.display = 'none';
      trelloBoard.style.display = 'none';
      updateCounts();
      return;
    }

    emptyState.style.display = 'none';

    if (currentView === 'list') {
      list.style.display = 'flex';
      trelloBoard.style.display = 'none';
      renderListView();
    } else {
      list.style.display = 'none';
      trelloBoard.style.display = 'flex';
      renderBoardView();
    }

    updateCounts();
  }

  // ─── List View Rendering ───
  function renderListView() {
    list.innerHTML = '';
    
    let filtered = todos;
    if (currentFilter === 'active') {
      filtered = todos.filter(t => t.status !== 'done');
    } else if (currentFilter === 'done') {
      filtered = todos.filter(t => t.status === 'done');
    }

    if (filtered.length === 0) {
      list.innerHTML = `<li class="empty-state" style="padding: 32px 0;"><p class="empty-state__text">ไม่มีข้อมูลสำหรับตัวกรองนี้</p></li>`;
      return;
    }

    filtered.forEach((todo, index) => {
      const li = createTodoElement(todo, index, false);
      list.appendChild(li);
    });
  }

  // ─── Board View Rendering ───
  function renderBoardView() {
    todoColList.innerHTML = '';
    doingColList.innerHTML = '';
    doneColList.innerHTML = '';

    todos.forEach((todo, index) => {
      const card = createTodoElement(todo, index, true);
      
      if (todo.status === 'todo') {
        todoColList.appendChild(card);
      } else if (todo.status === 'doing') {
        doingColList.appendChild(card);
      } else {
        doneColList.appendChild(card);
      }
    });
  }

  // ─── Card Element Creation ───
  function createTodoElement(todo, index, isBoardCard) {
    const li = document.createElement('li');
    let itemClass = `todo-item todo-item--${todo.status}`;
    if (todo.status === 'done') itemClass += ' todo-item--done';
    
    li.className = itemClass;
    li.dataset.id = todo.id;
    li.style.animationDelay = `${index * 0.04}s`;
    
    if (isBoardCard) {
      li.draggable = true;
    }

    // Status Selector dropdown options
    const statusSelect = `
      <select class="todo-item__move-selector" data-id="${todo.id}" aria-label="ย้ายสถานะ">
        <option value="todo" ${todo.status === 'todo' ? 'selected' : ''}>To Do</option>
        <option value="doing" ${todo.status === 'doing' ? 'selected' : ''}>Doing</option>
        <option value="done" ${todo.status === 'done' ? 'selected' : ''}>Done</option>
      </select>
    `;

    // Status tag
    let statusText = 'To Do';
    if (todo.status === 'doing') statusText = 'Doing';
    if (todo.status === 'done') statusText = 'Done';
    const statusTag = `<span class="todo-item__status-tag todo-item__status-tag--${todo.status}">${statusText}</span>`;

    li.innerHTML = `
      <label class="todo-checkbox" id="checkbox-${todo.id}">
        <input type="checkbox" ${todo.status === 'done' ? 'checked' : ''} aria-label="สถานะ: ${escapeHtml(todo.text)}">
        <span class="todo-checkbox__box"></span>
        <span class="todo-checkbox__mark">${handDrawnX}</span>
      </label>
      <div class="todo-item__content">
        <p class="todo-item__text" id="text-${todo.id}">${escapeHtml(todo.text)}</p>
        <div class="todo-item__meta">
          <span class="todo-item__date">${formatDate(todo.createdAt)}</span>
          ${isBoardCard ? '' : statusTag}
        </div>
      </div>
      <div class="todo-item__actions">
        ${statusSelect}
        <button class="todo-action-btn todo-action-btn--edit" aria-label="แก้ไข" data-action="edit" id="edit-btn-${todo.id}">
          <span class="material-symbols-outlined">edit</span>
        </button>
        <button class="todo-action-btn todo-action-btn--delete" aria-label="ลบ" data-action="delete" id="delete-btn-${todo.id}">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>
    `;

    // ─── Attach Events ───
    
    // Checkbox toggle (List View)
    const checkbox = li.querySelector('input[type="checkbox"]');
    checkbox.addEventListener('change', () => toggleTodoDone(todo.id));

    // Status Dropdown Switch
    const select = li.querySelector('.todo-item__move-selector');
    select.addEventListener('change', (e) => {
      updateTodoStatus(todo.id, e.target.value);
    });

    // Edit button
    const editBtn = li.querySelector('[data-action="edit"]');
    editBtn.addEventListener('click', () => startEdit(todo.id, li));

    // Delete button
    const deleteBtn = li.querySelector('[data-action="delete"]');
    deleteBtn.addEventListener('click', () => deleteTodo(todo.id, li));

    // Double click to edit
    const textEl = li.querySelector('.todo-item__text');
    textEl.addEventListener('dblclick', () => startEdit(todo.id, li));

    // ─── Drag & Drop Event Handlers ───
    if (isBoardCard) {
      li.addEventListener('dragstart', (e) => {
        draggedId = todo.id;
        li.classList.add('todo-item--dragging');
        e.dataTransfer.setData('text/plain', todo.id);
        e.dataTransfer.effectAllowed = 'move';
      });

      li.addEventListener('dragend', () => {
        li.classList.remove('todo-item--dragging');
        draggedId = null;
      });
    }

    return li;
  }

  // ─── CRUD & Actions ───
  function addTodo(text) {
    const trimmed = text.trim();
    if (!trimmed) return;

    const todo = {
      id: generateId(),
      text: trimmed,
      status: 'todo',
      done: false,
      createdAt: Date.now()
    };

    todos.unshift(todo);
    saveTodos();
    renderTodos();
  }

  function toggleTodoDone(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
      if (todo.status === 'done') {
        todo.status = 'todo';
        todo.done = false;
      } else {
        todo.status = 'done';
        todo.done = true;
      }
      saveTodos();
      renderTodos();
    }
  }

  function updateTodoStatus(id, newStatus) {
    const todo = todos.find(t => t.id === id);
    if (todo && todo.status !== newStatus) {
      todo.status = newStatus;
      todo.done = (newStatus === 'done');
      saveTodos();
      renderTodos();
    }
  }

  function deleteTodo(id, element) {
    element.classList.add('todo-item--removing');
    element.addEventListener('animationend', () => {
      todos = todos.filter(t => t.id !== id);
      saveTodos();
      renderTodos();
    }, { once: true });
  }

  function startEdit(id, li) {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;

    const textEl = li.querySelector('.todo-item__text');
    const currentText = todo.text;

    const editInput = document.createElement('input');
    editInput.type = 'text';
    editInput.className = 'todo-item__edit-input';
    editInput.value = currentText;
    editInput.maxLength = 200;

    textEl.replaceWith(editInput);
    editInput.focus();
    editInput.select();

    function finishEdit() {
      const newText = editInput.value.trim();
      if (newText && newText !== currentText) {
        todo.text = newText;
        saveTodos();
      }
      renderTodos();
    }

    editInput.addEventListener('blur', finishEdit);
    editInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        editInput.blur();
      }
      if (e.key === 'Escape') {
        editInput.value = currentText;
        editInput.blur();
      }
    });
  }

  function clearDoneTodos() {
    const doneItems = document.querySelectorAll('.todo-item--done');
    if (doneItems.length === 0) return;

    doneItems.forEach((item, i) => {
      item.style.animationDelay = `${i * 0.05}s`;
      item.classList.add('todo-item--removing');
    });

    setTimeout(() => {
      todos = todos.filter(t => t.status !== 'done');
      saveTodos();
      renderTodos();
    }, 300 + doneItems.length * 50);
  }

  // ─── Setup Columns Drag & Drop ───
  function initDragAndDrop() {
    const columns = document.querySelectorAll('.board-column__list');
    
    columns.forEach(col => {
      col.addEventListener('dragover', (e) => {
        e.preventDefault();
        col.classList.add('board-column__list--dragover');
        e.dataTransfer.dropEffect = 'move';
      });

      col.addEventListener('dragleave', () => {
        col.classList.remove('board-column__list--dragover');
      });

      col.addEventListener('drop', (e) => {
        e.preventDefault();
        col.classList.remove('board-column__list--dragover');
        
        const id = e.dataTransfer.getData('text/plain') || draggedId;
        const targetStatus = col.dataset.status;
        
        if (id && targetStatus) {
          updateTodoStatus(id, targetStatus);
        }
      });
    });
  }

  // ─── Event Listeners ───
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    addTodo(input.value);
    input.value = '';
    input.focus();
  });

  clearDoneBtn.addEventListener('click', clearDoneTodos);

  // Filter Bar tabs toggle (List view only)
  filterBar.addEventListener('click', (e) => {
    const tab = e.target.closest('.filter-tab');
    if (!tab) return;

    const filter = tab.dataset.filter;
    if (filter === currentFilter) return;

    currentFilter = filter;

    filterBar.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('filter-tab--active'));
    tab.classList.add('filter-tab--active');

    renderTodos();
  });

  // View Switcher clicks
  viewSwitcher.addEventListener('click', (e) => {
    const btn = e.target.closest('.view-btn');
    if (!btn) return;

    const view = btn.dataset.view;
    if (view === currentView) return;

    switchView(view);
  });

  // Theme switcher
  themeToggleBtn.addEventListener('click', toggleTheme);

  // ─── Scroll Reveal ───
  function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.05,
      rootMargin: '0px 0px -20px 0px'
    });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }

  // ─── Init ───
  function init() {
    initTheme();
    switchView(currentView); // Handles switching tabs, layout structure, and rendering
    initDragAndDrop();
    initScrollReveal();
    input.focus();
  }

  // Launch
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
