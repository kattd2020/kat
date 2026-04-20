// State
let currentWeek = 0;
let activeFilter = 'all';
let startDate = new Date();
let mealPlan = [];
let currentDayData = null;

const CATEGORIES = ['chicken', 'beef', 'pork', 'groundTurkey'];
const CAT_NAMES = { beef: 'Beef', pork: 'Pork', chicken: 'Chicken', groundTurkey: 'Ground Turkey' };
const CAT_ICONS = { beef: '🥩', pork: '🥓', chicken: '🍗', groundTurkey: '🦃' };
const TOTAL_WEEKS = Math.ceil(365 / 7); // 53

function init() {
  const saved = localStorage.getItem('mealPlannerSettings');
  if (saved) {
    try {
      const s = JSON.parse(saved);
      startDate = new Date(s.startDate);
      if (isNaN(startDate)) startDate = new Date();
    } catch (_) { startDate = new Date(); }
  }
  startDate.setHours(0, 0, 0, 0);

  document.getElementById('startDateInput').value = toInputDate(startDate);
  mealPlan = generateMealPlan();
  populateWeekSelect();
  currentWeek = getCurrentWeek();
  renderWeek();
  setupEventListeners();

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  }
}

function generateMealPlan() {
  const plan = [];
  for (let day = 0; day < 365; day++) {
    const bCat = CATEGORIES[day % 4];
    const lCat = CATEGORIES[(day + 1) % 4];
    const dCat = CATEGORIES[(day + 2) % 4];
    const cycle = Math.floor(day / 4);
    const date = new Date(startDate);
    date.setDate(date.getDate() + day);
    plan.push({
      day: day + 1,
      date,
      meals: {
        breakfast: { category: bCat, name: MEAL_DATA[bCat].breakfast[cycle % MEAL_DATA[bCat].breakfast.length] },
        lunch:     { category: lCat, name: MEAL_DATA[lCat].lunch[cycle % MEAL_DATA[lCat].lunch.length] },
        dinner:    { category: dCat, name: MEAL_DATA[dCat].dinner[cycle % MEAL_DATA[dCat].dinner.length] }
      }
    });
  }
  return plan;
}

function getCurrentWeek() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.floor((today - startDate) / 86400000);
  if (diff < 0) return 0;
  return Math.min(Math.floor(diff / 7), TOTAL_WEEKS - 1);
}

function populateWeekSelect() {
  const sel = document.getElementById('weekSelect');
  sel.innerHTML = '';
  for (let w = 0; w < TOTAL_WEEKS; w++) {
    const s = w * 7;
    const e = Math.min(s + 6, 364);
    const opt = document.createElement('option');
    opt.value = w;
    opt.textContent = `Week ${w + 1}: ${shortDate(mealPlan[s].date)} – ${shortDate(mealPlan[e].date)}`;
    sel.appendChild(opt);
  }
}

function renderWeek() {
  const s = currentWeek * 7;
  const e = Math.min(s + 6, 364);
  const days = mealPlan.slice(s, e + 1);

  document.getElementById('weekLabel').textContent = `Week ${currentWeek + 1} of ${TOTAL_WEEKS}`;
  document.getElementById('weekDates').textContent = `${longDate(days[0].date)} – ${longDate(days[days.length - 1].date)}`;
  document.getElementById('weekSelect').value = currentWeek;
  document.getElementById('prevWeekBtn').disabled = currentWeek === 0;
  document.getElementById('nextWeekBtn').disabled = currentWeek === TOTAL_WEEKS - 1;

  const main = document.getElementById('mainContent');
  main.innerHTML = '';
  days.forEach(d => main.appendChild(makeDayCard(d)));
  applyFilter();
}

function makeDayCard(d) {
  const card = document.createElement('div');
  card.className = 'day-card';
  card.dataset.categories = JSON.stringify([
    d.meals.breakfast.category,
    d.meals.lunch.category,
    d.meals.dinner.category
  ]);

  const isToday = sameDay(d.date, new Date());
  const dow = d.date.toLocaleDateString('en-US', { weekday: 'long' });

  card.innerHTML = `
    <div class="day-card-header${isToday ? ' today-header' : ''}">
      <span class="day-number">Day ${d.day}</span>
      <span class="day-date">${dow}, ${longDate(d.date)}</span>
      ${isToday ? '<span class="today-badge">TODAY</span>' : ''}
    </div>
    <div class="day-card-body">
      ${mealRow('Breakfast', d.meals.breakfast)}
      ${mealRow('Lunch', d.meals.lunch)}
      ${mealRow('Dinner', d.meals.dinner)}
    </div>
  `;

  card.addEventListener('click', () => openModal(d));
  return card;
}

function mealRow(label, meal) {
  return `<div class="meal-row">
    <span class="meal-label">${label}</span>
    <span class="meal-name">${meal.name}</span>
    <span class="category-badge badge-${meal.category}">${CAT_ICONS[meal.category]} ${CAT_NAMES[meal.category]}</span>
  </div>`;
}

function applyFilter() {
  document.querySelectorAll('.day-card').forEach(card => {
    const cats = JSON.parse(card.dataset.categories);
    card.classList.toggle('filtered-out', activeFilter !== 'all' && !cats.includes(activeFilter));
  });
}

function openModal(d) {
  currentDayData = d;
  const dow = d.date.toLocaleDateString('en-US', { weekday: 'long' });
  document.getElementById('modalDayTitle').textContent = `Day ${d.day}`;
  document.getElementById('modalDayDate').textContent = `${dow}, ${longDate(d.date)}`;

  const mealsEl = document.getElementById('modalMeals');
  mealsEl.innerHTML = '';
  ['breakfast', 'lunch', 'dinner'].forEach(type => {
    const m = d.meals[type];
    const el = document.createElement('div');
    el.className = 'modal-meal-card';
    el.innerHTML = `
      <div class="modal-meal-type">${type}</div>
      <div class="modal-meal-name">${m.name}</div>
      <span class="modal-meal-badge badge-${m.category}">${CAT_ICONS[m.category]} ${CAT_NAMES[m.category]}</span>
    `;
    mealsEl.appendChild(el);
  });

  buildQR(d);
  document.getElementById('dayModal').classList.remove('hidden');
}

function buildQR(d) {
  const el = document.getElementById('qrcode');
  el.innerHTML = '';

  const text = [
    `365 Meal Planner — Day ${d.day}`,
    `Date: ${d.date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}`,
    `Breakfast: ${d.meals.breakfast.name} (${CAT_NAMES[d.meals.breakfast.category]})`,
    `Lunch: ${d.meals.lunch.name} (${CAT_NAMES[d.meals.lunch.category]})`,
    `Dinner: ${d.meals.dinner.name} (${CAT_NAMES[d.meals.dinner.category]})`
  ].join('\n');

  if (typeof QRCode !== 'undefined') {
    try {
      new QRCode(el, { text, width: 200, height: 200, colorDark: '#2C3E50', colorLight: '#FFFFFF', correctLevel: QRCode.CorrectLevel.M });
    } catch (_) {
      el.innerHTML = '<p class="qr-unavail">QR generation failed.</p>';
    }
  } else {
    el.innerHTML = '<p class="qr-unavail">QR unavailable — connect to internet once to enable offline QR.</p>';
  }
}

function closeModal() {
  document.getElementById('dayModal').classList.add('hidden');
  currentDayData = null;
}

function closeSettings() {
  document.getElementById('settingsModal').classList.add('hidden');
}

function printWeek() {
  const s = currentWeek * 7;
  const e = Math.min(s + 6, 364);
  const days = mealPlan.slice(s, e + 1);

  const pc = document.getElementById('printContent');
  pc.innerHTML = `
    <h2>Week ${currentWeek + 1}: ${longDate(days[0].date)} – ${longDate(days[days.length - 1].date)}</h2>
    ${days.map(d => `
      <div class="print-week-card">
        <div class="print-day-header">Day ${d.day} — ${d.date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</div>
        <div class="print-meal-row"><strong>Breakfast:</strong> ${d.meals.breakfast.name} (${CAT_NAMES[d.meals.breakfast.category]})</div>
        <div class="print-meal-row"><strong>Lunch:</strong> ${d.meals.lunch.name} (${CAT_NAMES[d.meals.lunch.category]})</div>
        <div class="print-meal-row"><strong>Dinner:</strong> ${d.meals.dinner.name} (${CAT_NAMES[d.meals.dinner.category]})</div>
      </div>
    `).join('')}
  `;
  window.print();
}

function printDay() {
  if (!currentDayData) return;
  const d = currentDayData;
  const dow = d.date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  const pc = document.getElementById('printContent');
  pc.innerHTML = `
    <div class="print-week-card">
      <div class="print-day-header">Day ${d.day} — ${dow}</div>
      <div class="print-meal-row"><strong>Breakfast:</strong> ${d.meals.breakfast.name} (${CAT_NAMES[d.meals.breakfast.category]})</div>
      <div class="print-meal-row"><strong>Lunch:</strong> ${d.meals.lunch.name} (${CAT_NAMES[d.meals.lunch.category]})</div>
      <div class="print-meal-row"><strong>Dinner:</strong> ${d.meals.dinner.name} (${CAT_NAMES[d.meals.dinner.category]})</div>
    </div>
    <div class="print-qr-section" id="printQRContainer">
      <p style="margin-bottom:6px;font-size:12px;color:#666;">Scan QR to share this day's meals</p>
    </div>
  `;

  const pqr = document.getElementById('printQRContainer');
  if (typeof QRCode !== 'undefined') {
    const short = `Day ${d.day}: ${d.meals.breakfast.name} | ${d.meals.lunch.name} | ${d.meals.dinner.name}`;
    try { new QRCode(pqr, { text: short, width: 130, height: 130, colorDark: '#2C3E50', colorLight: '#FFFFFF' }); } catch (_) {}
  }

  window.print();
}

async function shareDay() {
  if (!currentDayData) return;
  const d = currentDayData;
  const text = `Day ${d.day} Meal Plan:\nBreakfast: ${d.meals.breakfast.name}\nLunch: ${d.meals.lunch.name}\nDinner: ${d.meals.dinner.name}`;

  if (navigator.share) {
    try { await navigator.share({ title: `Meal Plan Day ${d.day}`, text }); } catch (_) {}
  } else if (navigator.clipboard) {
    await navigator.clipboard.writeText(text);
    showToast('Meal plan copied to clipboard!');
  }
}

function downloadQR() {
  const canvas = document.querySelector('#qrcode canvas');
  if (canvas) {
    const a = document.createElement('a');
    a.download = `meal-plan-day-${currentDayData?.day || 0}.png`;
    a.href = canvas.toDataURL();
    a.click();
  } else {
    showToast('QR code not available to download.');
  }
}

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

function setupEventListeners() {
  document.getElementById('prevWeekBtn').addEventListener('click', () => {
    if (currentWeek > 0) { currentWeek--; renderWeek(); }
  });
  document.getElementById('nextWeekBtn').addEventListener('click', () => {
    if (currentWeek < TOTAL_WEEKS - 1) { currentWeek++; renderWeek(); }
  });
  document.getElementById('todayBtn').addEventListener('click', () => {
    currentWeek = getCurrentWeek();
    renderWeek();
  });
  document.getElementById('weekSelect').addEventListener('change', e => {
    currentWeek = parseInt(e.target.value, 10);
    renderWeek();
  });

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.dataset.category;
      applyFilter();
    });
  });

  document.getElementById('modalClose').addEventListener('click', closeModal);
  document.getElementById('modalOverlay').addEventListener('click', closeModal);

  document.getElementById('settingsBtn').addEventListener('click', () => {
    document.getElementById('settingsModal').classList.remove('hidden');
  });
  document.getElementById('settingsClose').addEventListener('click', closeSettings);
  document.getElementById('settingsOverlay').addEventListener('click', closeSettings);
  document.getElementById('saveSettings').addEventListener('click', () => {
    const val = document.getElementById('startDateInput').value;
    if (val) {
      startDate = new Date(val + 'T00:00:00');
      localStorage.setItem('mealPlannerSettings', JSON.stringify({ startDate: startDate.toISOString() }));
      mealPlan = generateMealPlan();
      populateWeekSelect();
      currentWeek = getCurrentWeek();
      renderWeek();
    }
    closeSettings();
  });

  document.getElementById('printWeekBtn').addEventListener('click', printWeek);
  document.getElementById('printDayBtn').addEventListener('click', printDay);
  document.getElementById('shareBtn').addEventListener('click', shareDay);
  document.getElementById('downloadQrBtn').addEventListener('click', downloadQR);

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeModal(); closeSettings(); }
    if (e.key === 'ArrowRight' && !e.target.closest('.modal')) { if (currentWeek < TOTAL_WEEKS - 1) { currentWeek++; renderWeek(); } }
    if (e.key === 'ArrowLeft' && !e.target.closest('.modal')) { if (currentWeek > 0) { currentWeek--; renderWeek(); } }
  });
}

// Date helpers
function longDate(d) {
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
function shortDate(d) {
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
function toInputDate(d) {
  return d.toISOString().split('T')[0];
}
function sameDay(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

init();
