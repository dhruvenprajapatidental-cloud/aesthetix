function updateSubscriptionUI() {
  const badge = document.getElementById('sub-status-badge');
  const desc = document.getElementById('sub-status-desc');
  const btn = document.getElementById('sub-manage-btn');
  if(!badge) return;
  
  if (userTier === 0) {
    badge.className = 'sub-status';
    badge.style.background = 'rgba(255,255,255,0.1)';
    badge.style.color = '#fff';
    badge.innerHTML = '🔒 Free Plan';
    desc.innerHTML = 'You are on the free plan. Upgrade to unlock all days and premium tracking.';
    btn.style.display = 'inline-block';
    btn.innerHTML = '💎 Upgrade Plan';
    btn.onclick = () => showPremiumModal();
  } else if (userTier === 1) {
    badge.className = 'sub-status sub-active';
    badge.style.background = 'rgba(109,40,217,0.2)';
    badge.style.color = 'var(--primary)';
    badge.innerHTML = '✓ Active — Pro';
    let actDate = parseInt(localStorage.getItem('aesthetix_activation_date')) || Date.now();
    let expDate = new Date(actDate + 31536000000).toLocaleDateString();
    desc.innerHTML = 'Your Pro access is active until <b>' + expDate + '</b>. Enjoy all features!';
    btn.style.display = 'inline-block';
    btn.innerHTML = '⭐ Upgrade to Lifetime';
    btn.onclick = () => window.open('https://rzp.io/rzp/cHTLyxKb', '_blank');
  } else if (userTier === 2) {
    badge.className = 'sub-status';
    badge.style.background = 'rgba(234,179,8,0.2)';
    badge.style.color = '#eab308';
    badge.innerHTML = '👑 Active — Lifetime';
    desc.innerHTML = 'You have Lifetime access! Never pay again.';
    btn.style.display = 'none';
  }
}

function activatePremium() {
  const code = document.getElementById('activationCode').value.trim().toUpperCase();
  const validTier = validateCode(code);
  if(validTier > 0) {
    localStorage.setItem('aesthetix_tier', validTier.toString());
    localStorage.setItem('aesthetix_activation_date', Date.now().toString());
    userTier = validTier;
    showToast((validTier === 2 ? 'Lifetime' : 'Pro') + ' Tier Unlocked! 🎉', 'success');
    document.getElementById('unlock-card').style.display = 'none';
    renderSplit(); // Refresh split view
    updateSubscriptionUI();
  } else {
    showToast('Invalid Code', 'error');
  }
}

setTimeout(updateSubscriptionUI, 100);

// ═══════════════════════════════════════════════════════════════
// STATE & DATA
// ═══════════════════════════════════════════════════════════════

let userTier = parseInt(localStorage.getItem('aesthetix_tier') || '0'); // 0=Free, 1=Pro, 2=Elite
if (userTier === 1) {
  let activationDate = localStorage.getItem('aesthetix_activation_date');
  if (activationDate) {
    if (Date.now() - parseInt(activationDate) > 31536000000) {
      userTier = 0;
      localStorage.setItem('aesthetix_tier', '0');
      localStorage.removeItem('aesthetix_activation_date');
      setTimeout(() => alert('Your 1-Year Pro Subscription has expired. Please renew.'), 1000);
    }
  } else {
    localStorage.setItem('aesthetix_activation_date', Date.now().toString());
  }
}
let currentPage = 'landing';

function validateCode(code) {
  if (!code || code.length < 10) return 0;
  const prefix = code.substring(0, 3);
  let h = 0;
  const str = code + "AESTHETIX2026";
  for(let i=0; i<str.length; i++) h = Math.imul(31, h) + str.charCodeAt(i) | 0;
  // If hash ends in specific digits or matches criteria:
  // For simplicity, ANY code starting with PRO- that has a specific checksum:
  let sum = 0;
  for(let i=4; i<code.length; i++) sum += code.charCodeAt(i);
  
  if (sum % 97 === 42) {
    if (prefix === 'PRO') return 1;
    if (prefix === 'LIF') return 2;
  }
  return 0;
}

let currentAppPage = 'dashboard';
let selectedPhotoWeek = 1;

// Full workout split data
const PROGRAM = [{"id": "day1", "name": "Day 1 – Shoulders + Triceps + Abs", "focus": "Round delts + triceps size", "cardio": "15–20 min incline walk", "notes": ["Start with overhead press while fresh.", "Keep lateral raises strict — no swing reps.", "Use triceps exercises for tension and squeeze, not ego weight."], "exercises": [["Overhead Press", "4 x 6–8", "Ribs down, glutes tight, bar path close to face.", "day1-overhead-press", 4], ["Dumbbell Lateral Raise", "4 x 12–18", "Small elbow bend, raise only to shoulder height.", "day1-dumbbell-lateral-raise", 4], ["Cable / Machine Lateral Raise", "3 x 12–15", "Constant tension, short pause at top.", "day1-cable-machine-lateral-raise", 3], ["Rear Delt Fly / Reverse Pec Deck", "4 x 12–15", "Lead with elbows, keep traps quiet.", "day1-rear-delt-fly-reverse-pec-deck", 4], ["Close-Grip Bench Press", "3 x 8–10", "Shoulders packed, elbows controlled.", "day1-close-grip-bench-press", 3], ["Assisted Dips (alt)", "3 x 8–10", "Use assistance if shoulders or depth feel bad.", "day1-assisted-dips-alt", 3], ["Overhead Triceps Extension", "3 x 10–12", "Keep elbows fixed, long-head stretch.", "day1-overhead-triceps-extension", 3], ["Rope Pushdown", "3 x 12–15", "Spread rope apart at bottom.", "day1-rope-pushdown", 3], ["Cable Crunch", "4 x 12–15", "Crunch ribs to pelvis, don’t hinge.", "day1-cable-crunch", 4], ["Hanging Leg Raise", "3 x 10–15", "Posterior pelvic tilt first, no swing.", "day1-hanging-leg-raise", 3]]}, {"id": "day2", "name": "Day 2 – Back + Biceps", "focus": "V-taper + arms", "cardio": "10–15 min walk or cycle", "notes": ["Pull with elbows, not just hands.", "Rows stay chest-up and stable.", "On curls, own the lowering phase."], "exercises": [["Lat Pulldown", "4 x 8–12", "Shoulders down first, elbows drive toward ribs.", "day2-lat-pulldown", 4], ["Pull-Up (alt)", "4 x 6–10", "Full hang with control, chest up.", "day2-pull-up-alt", 4], ["Seated Cable Row", "4 x 8–12", "Pull to lower ribs, don’t rock back.", "day2-seated-cable-row", 4], ["Single-Arm Dumbbell Row", "3 x 10–12", "Flat back, no torso twist.", "day2-single-arm-dumbbell-row", 3], ["Straight-Arm Pulldown", "3 x 12–15", "Feel your lats stretch and contract.", "day2-straight-arm-pulldown", 3], ["Face Pull", "3 x 12–15", "Elbows high, pull to forehead.", "day2-face-pull", 3], ["EZ / Barbell Curl", "3 x 8–10", "Upper arm by side, no body swing.", "day2-ez-barbell-curl", 3], ["Incline Dumbbell Curl", "3 x 10–12", "Deep stretch at bottom.", "day2-incline-dumbbell-curl", 3], ["Hammer Curl", "3 x 10–12", "Neutral grip, don’t let elbows drift back.", "day2-hammer-curl", 3]]}, {"id": "day3", "name": "Day 3 – Legs + Glute Control + Abs", "focus": "Shape, balance, metabolism", "cardio": "20–25 min incline treadmill or brisk walk", "notes": ["Train legs properly — don’t skip them.", "RDL is a hinge, not a squat.", "Lunges are for control and shape."], "exercises": [["Squat", "4 x 8–10", "Brace, knees track over toes, use controllable depth.", "day3-squat", 4], ["Leg Press (alt)", "4 x 8–10", "Keep glutes on the pad, no low-back rounding.", "day3-leg-press-alt", 4], ["Romanian Deadlift", "4 x 8–10", "Soft knees, hips back, bar close to legs.", "day3-romanian-deadlift", 4], ["Walking Lunges", "3 x 12 steps each leg", "Stay rooted and balanced.", "day3-walking-lunges", 3], ["Leg Curl", "3 x 12–15", "Control the return.", "day3-leg-curl", 3], ["Leg Extension", "3 x 12–15", "Pause and squeeze quads at top.", "day3-leg-extension", 3], ["Standing Calf Raise", "4 x 12–15", "Full stretch at bottom, full squeeze at top.", "day3-standing-calf-raise", 4], ["Decline Crunch", "3 x 15", "Curl, don’t yank the neck.", "day3-decline-crunch", 3], ["Plank", "3 x 45–60 sec", "Glutes tight, ribs down.", "day3-plank", 3], ["Russian Twist / Core Twist", "3 x 20", "Rotate with control, don’t fling.", "day3-russian-twist-core-twist", 3]]}, {"id": "day4", "name": "Day 4 – Chest + Shoulders", "focus": "Upper chest + side delts", "cardio": "15 min incline walk", "notes": ["Incline press is the priority.", "Shoulders packed for pressing, traps quiet on raises.", "Push-up burnout = clean pump reps only."], "exercises": [["Incline Dumbbell Press", "4 x 8–10", "Bench around 20–30°, elbows under wrists.", "day4-incline-dumbbell-press", 4], ["Machine Chest Press", "3 x 6–10", "Feet planted, smooth pressing path.", "day4-machine-chest-press", 3], ["Bench Press (alt)", "3 x 6–10", "Control down, no bounce.", "day4-bench-press-alt", 3], ["Cable Fly", "3 x 12–15", "Hug motion, big chest squeeze.", "day4-cable-fly", 3], ["Seated Dumbbell Shoulder Press", "3 x 8–10", "No low-back arch.", "day4-seated-dumbbell-shoulder-press", 3], ["Dumbbell Lateral Raise", "4 x 12–20", "Strict, smooth, shoulders down.", "day4-dumbbell-lateral-raise", 4], ["Rear Delt Fly", "3 x 12–15", "Lead with elbows.", "day4-rear-delt-fly", 3], ["Push-Ups Burnout", "2 sets near failure", "Body in one line, full range.", "day4-push-ups-burnout", 2]]}, {"id": "day5", "name": "Day 5 – Arms Specialization + Abs", "focus": "Biceps, triceps, forearms, abs", "cardio": "15–20 min walk", "notes": ["Chase tension and pump, not ugly cheating.", "Vary elbow angle for fuller arm development.", "Keep forearm work clean if elbows feel tender."], "exercises": [["EZ Bar Curl", "4 x 8–10", "Squeeze the top.", "day5-ez-bar-curl", 4], ["Incline Curl", "3 x 10–12", "Deep stretch, shoulders back.", "day5-incline-curl", 3], ["Cable Curl", "3 x 12–15", "Constant tension; don’t rest at bottom.", "day5-cable-curl", 3], ["Close-Grip Push-Up", "3 x 10–12", "Pick a shoulder-friendly version.", "day5-close-grip-push-up", 3], ["Bench Dip (alt)", "3 x 10–12", "Stop if front shoulders feel cranky.", "day5-bench-dip-alt", 3], ["Overhead Triceps Extension", "3 x 10–12", "Deep stretch, stable elbows.", "day5-overhead-triceps-extension", 3], ["Rope Pushdown", "4 x 12–15", "Full extension every rep.", "day5-rope-pushdown", 4], ["Reverse Curl", "2–3 sets", "Control wrists; no bounce.", "day5-reverse-curl", 2], ["Wrist Curl (alt)", "2–3 sets", "Let the bar roll to fingers, then curl back.", "day5-wrist-curl-alt", 2], ["Cable Crunch", "4 x 12–15", "Crunch down, not back.", "day5-cable-crunch", 4], ["Leg Raise", "3 x 12–15", "Control swing, tuck pelvis.", "day5-leg-raise", 3], ["Side Plank", "3 x 30–45 sec/side", "Stack ribs over pelvis.", "day5-side-plank", 3]]}, {"id": "day6", "name": "Day 6 – Full Upper Pump + Fat-Loss Cardio", "focus": "Shape, blood flow, calorie burn", "cardio": "Choose one: 20–30 min incline walk OR 15 min moderate cycling", "notes": ["This day should feel productive, not crushing.", "Use a lighter pump style.", "If recovery is poor, do cardio + mobility only."], "exercises": [["Lat Pulldown", "3 x 12", "Smooth reps, focus on lat squeeze.", "day6-lat-pulldown", 3], ["Machine Chest Press", "3 x 12", "Controlled tempo, chest squeeze.", "day6-machine-chest-press", 3], ["Lateral Raise", "4 x 15–20", "Light, strict, burning reps.", "day6-lateral-raise", 4], ["Rear Delt Fly", "3 x 15", "Keep traps quiet.", "day6-rear-delt-fly", 3], ["Cable Curl", "3 x 15", "Constant tension.", "day6-cable-curl", 3], ["Rope Pushdown", "3 x 15", "Full extension every rep.", "day6-rope-pushdown", 3], ["Shrugs", "3 x 12–15", "Shrug straight up/down, do not roll shoulders.", "day6-shrugs", 3]]}, {"id": "day7", "name": "Day 7 – Rest / Active Recovery", "focus": "Recovery, posture, mobility", "cardio": "8k–12k steps + mobility", "notes": ["Walk, stretch, sleep well, hydrate.", "No junk binge today.", "Recovery is part of the aesthetic plan."], "exercises": [["Steps", "8,000–12,000", "Split through the day if needed.", "day7-steps", 8], ["Mobility + Stretching", "10–20 min", "Focus on shoulders, hips, chest, T-spine, hamstrings.", "day7-mobility-stretching", 10]]}];

// Get all unique exercises
function getAllExercises() {
  const exercises = new Set();
  SPLIT_DATA.forEach(day => {
    day.exercises.forEach(ex => exercises.add(ex.name));
  });
  return Array.from(exercises).sort();
}

// ═══════════════════════════════════════════════════════════════
// NAVIGATION
// ═══════════════════════════════════════════════════════════════
function openPayment() {
  window.open('https://razorpay.me/@dhruvenvinodkumarprajapati', '_blank');
}

function launchApp() {
  currentPage = 'app';
  document.getElementById('landing-page').style.display = 'none';
  document.getElementById('app-page').style.display = 'block';
  document.getElementById('loginModal').classList.remove('show');
  window.scrollTo(0, 0);
  navigateTo('dashboard');
  updateDashboard();
}

function goToLanding() {
  currentPage = 'landing';
  document.getElementById('landing-page').style.display = 'block';
  document.getElementById('app-page').style.display = 'none';
  window.scrollTo(0, 0);
}



function showPremiumModal() {
  if (!document.getElementById('premiumModal')) {
    const div = document.createElement('div');
    div.innerHTML = `<div class="modal-overlay" id="premiumModal" style="background:rgba(0,0,0,0.8);backdrop-filter:blur(5px);position:fixed;top:0;left:0;right:0;bottom:0;z-index:9999;display:flex;align-items:center;justify-content:center;opacity:0;pointer-events:none;transition:opacity 0.3s;">
  <div class="modal-content" style="text-align:left;background:var(--bg2);padding:30px;border-radius:20px;border:1px solid var(--border);max-width:95%;width:450px;transform:translateY(20px);transition:transform 0.3s; max-height:90vh; overflow-y:auto;">
    <h2 style="margin-bottom:10px; text-align:center;">Upgrade Your Plan 🚀</h2>
    <p style="color:var(--text2);margin-bottom:20px; text-align:center;">Unlock the full 8-Week Split and premium tracking features.</p>
    
    <div style="background:linear-gradient(145deg, rgba(109,40,217,0.2) 0%, rgba(109,40,217,0.05) 100%); border:1px solid var(--primary); padding:20px; border-radius:15px; margin-bottom:15px;">
      <h3 style="color:var(--primary); margin-bottom:5px;">🔵 Pro Tier — ₹499/yr</h3>
      <ul style="color:var(--text2); font-size:0.9rem; margin-bottom:15px; padding-left:20px;">
        <li>Unlock Days 2-7 of the split</li>
        <li>Progress & Weight Tracking</li>
        <li>Photo Logger & Coach Notes</li>
      </ul>
      <button class="btn btn-primary" style="width:100%;" onclick="window.open('https://rzp.io/rzp/eg3ZHbwf', '_blank')">Get Pro</button>
    </div>

    <div style="background:linear-gradient(145deg, rgba(234,179,8,0.2) 0%, rgba(234,179,8,0.05) 100%); border:1px solid #eab308; padding:20px; border-radius:15px; margin-bottom:15px;">
      <h3 style="color:#eab308; margin-bottom:5px;">🟡 Lifetime Tier — ₹799</h3>
      <ul style="color:var(--text2); font-size:0.9rem; margin-bottom:15px; padding-left:20px;">
        <li>Everything in Pro</li>
        <li>Lifetime Free App Access</li>
        <li>Never pay a subscription again</li>
      </ul>
      <button class="btn" style="width:100%; background:#eab308; color:#000;" onclick="window.open('https://rzp.io/rzp/cHTLyxKb', '_blank')">Get Lifetime</button>
    </div>

    <button class="btn btn-outline" style="width:100%;" onclick="hidePremiumModal()">Maybe Later</button>
  </div>
</div>`;
    document.body.appendChild(div.firstElementChild);
    const style = document.createElement('style');
    style.innerHTML = '#premiumModal.show { opacity:1!important; pointer-events:auto!important; } #premiumModal.show .modal-content { transform:translateY(0)!important; } .locked-day { opacity:0.5; cursor:pointer; }';
    document.head.appendChild(style);
  }
  document.getElementById('premiumModal').classList.add('show');
}

function hidePremiumModal() {
  const m = document.getElementById('premiumModal');
  if(m) m.classList.remove('show');
}

function navigateTo(page) {
  if (userTier === 0 && ['progress', 'photos', 'notes'].includes(page)) {
    showPremiumModal();
    return;
  }


  currentAppPage = page;
  // Hide all sections
  document.querySelectorAll('.app-page-section').forEach(s => {
    s.classList.remove('active');
    s.style.display = 'none';
  });
  // Show target
  const target = document.getElementById('page-' + page);
  if (target) {
    target.style.display = 'block';
    // Trigger reflow for animation
    void target.offsetWidth;
    target.classList.add('active');
  }
  // Update sidebar
  document.querySelectorAll('.sidebar-item').forEach(item => {
    item.classList.toggle('active', item.dataset.page === page);
  });
  // Update tab bar
  document.querySelectorAll('.tab-item').forEach(item => {
    item.classList.toggle('active', item.dataset.page === page);
  });
  // Page-specific init
  if (page === 'dashboard') updateDashboard();
  if (page === 'today') renderTodayWorkout();
  if (page === 'split') renderSplit();
  if (page === 'progress') { setDefaultDate(); renderChart(); renderWeightHistory(); }
  if (page === 'photos') renderPhotos();
  if (page === 'notes') loadNotes();
  if (page === 'library') renderLibrary();

  window.scrollTo(0, 0);
}

// ═══════════════════════════════════════════════════════════════
// LANDING PAGE INTERACTIONS
// ═══════════════════════════════════════════════════════════════
// Navbar scroll effect
window.addEventListener('scroll', () => {
  const navbar = document.getElementById('navbar');
  if (navbar) {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }
});

// FAQ toggle
function toggleFaq(btn) {
  const item = btn.closest('.faq-item');
  item.classList.toggle('open');
}

// Login modal
function showLoginModal() {
  document.getElementById('loginModal').classList.add('show');
}
function hideLoginModal() {
  document.getElementById('loginModal').classList.remove('show');
}

// Mobile menu (simple scroll-to)
function toggleMobileMenu() {
  // Simple: just scroll to features
  document.getElementById('features').scrollIntoView({ behavior: 'smooth' });
}

// ═══════════════════════════════════════════════════════════════
// DASHBOARD
// ═══════════════════════════════════════════════════════════════
function getTodayDayIndex() {
  // Sunday=0, but our program starts Monday=Day1
  const jsDay = new Date().getDay();
  // Map: Mon=1, Tue=2, Wed=3, Thu=4, Fri=5, Sat=6, Sun=7
  return jsDay === 0 ? 7 : jsDay;
}

function updateDashboard() {
  const dayIdx = getTodayDayIndex();
  const dayData = SPLIT_DATA[dayIdx - 1];

  document.getElementById('kpi-workout').textContent = dayData.name;
  document.getElementById('kpi-day-name').textContent = 'Day ' + dayIdx + ' — ' + ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'][dayIdx-1];

  // Completion
  const todayKey = 'workout_' + new Date().toISOString().slice(0,10);
  const saved = JSON.parse(localStorage.getItem(todayKey) || '{}');
  let totalSets = 0, doneSets = 0;
  dayData.exercises.forEach(ex => {
    const numSets = parseInt(ex.reps) || 3;
    totalSets += numSets;
    for (let s = 1; s <= numSets; s++) {
      if (saved[ex.name + '_set' + s + '_done']) doneSets++;
    }
  });
  const pct = totalSets > 0 ? Math.round((doneSets / totalSets) * 100) : 0;
  document.getElementById('kpi-completion').textContent = pct + '%';

  // Latest weight
  const weights = JSON.parse(localStorage.getItem('weights') || '[]');
  if (weights.length > 0) {
    const latest = weights[weights.length - 1];
    document.getElementById('kpi-weight').textContent = latest.value + ' kg';
  } else {
    document.getElementById('kpi-weight').textContent = '— kg';
  }

  // Photos count
  let photoCount = 0;
  for (let w = 1; w <= 8; w++) {
    ['front','side','back'].forEach(pos => {
      if (localStorage.getItem('photo_w' + w + '_' + pos)) photoCount++;
    });
  }
  document.getElementById('kpi-photos').textContent = photoCount;

  // Current week
  const startDate = localStorage.getItem('programStart');
  if (startDate) {
    const diff = Math.floor((Date.now() - new Date(startDate).getTime()) / (1000*60*60*24));
    const week = Math.min(8, Math.max(1, Math.floor(diff / 7) + 1));
    document.getElementById('currentWeek').textContent = week;
  } else {
    localStorage.setItem('programStart', new Date().toISOString().slice(0,10));
  }
}

// ═══════════════════════════════════════════════════════════════
// TODAY'S WORKOUT
// ═══════════════════════════════════════════════════════════════


async function renderTodayWorkout() {
  const dayIdx = getTodayDayIndex();
  const dayData = PROGRAM[dayIdx - 1];
  const dateStr = new Date().toISOString().slice(0,10);
  const todayKey = 'workout_' + dateStr;
  const saved = JSON.parse(localStorage.getItem(todayKey) || '{}');

  document.getElementById('today-subtitle').innerHTML =
    `<span class="day-badge">Day ${dayIdx}</span>&nbsp; ${dayData.name} — ${new Date().toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' })}`;

  let html = '';
  for (const ex of dayData.exercises) {
    const exName = ex[0];
    const exReps = ex[1];
    const exCue = ex[2];
    const exId = ex[3];
    const numSets = parseInt(ex[4]) || 3;
    const gifUrl = await getGifForExercise(exId);
    
    html += `<div class="exercise-card">
      <div class="exercise-header">
        <span class="exercise-name" style="font-weight:600;">${exName}</span>
        <span class="exercise-scheme" style="background:var(--bg3); padding:4px 8px; border-radius:6px; font-size:0.85rem;">${exReps}</span>
      </div>
      <div class="exercise-cue" style="color:var(--text2); font-size:0.9rem; margin-top:5px; margin-bottom:15px;">💡 ${exCue}</div>
      <div style="margin-top:15px; margin-bottom:15px; border-bottom:1px solid rgba(255,255,255,0.05); padding-bottom:15px;">
        ${gifUrl ? `<img src="${gifUrl}" style="max-width:100%; border-radius:8px; margin-bottom:10px;">` : ''}
        <button class="btn btn-outline btn-sm" onclick="triggerUpload('${exId}')" style="width:100%; font-size:0.8rem; padding:8px;">Upload GIF</button>
        <input type="file" id="file-${exId}" accept="image/*" style="display:none" onchange="uploadGif(event, '${exId}')">
      </div>`;

    for (let s = 1; s <= numSets; s++) {
      const wKey = exId + '_set' + s + '_weight';
      const rKey = exId + '_set' + s + '_reps';
      const dKey = exId + '_set' + s + '_done';
      html += `<div class="set-row" style="display:flex; align-items:center; gap:10px; margin-bottom:10px;">
        <span class="set-label" style="width:50px; font-size:0.9rem; color:var(--text2);">Set ${s}</span>
        <input type="number" class="set-input form-input" style="flex:1; padding:8px;" placeholder="kg" data-key="${wKey}" value="${saved[wKey] || ''}" step="0.5">
        <input type="number" class="set-input form-input" style="flex:1; padding:8px;" placeholder="reps" data-key="${rKey}" value="${saved[rKey] || ''}">
        <input type="checkbox" class="set-done" style="width:24px; height:24px; accent-color:var(--primary);" data-key="${dKey}" ${saved[dKey] ? 'checked' : ''}>
      </div>`;
    }
    html += '</div>';
  }

  document.getElementById('today-workout-content').innerHTML = html;
}



function saveTodaysWorkout() {
  const dateStr = new Date().toISOString().slice(0,10);
  const todayKey = 'workout_' + dateStr;
  const data = {};

  document.querySelectorAll('#page-today .set-input').forEach(input => {
    if (input.value) data[input.dataset.key] = input.value;
  });
  document.querySelectorAll('#page-today .set-done').forEach(cb => {
    if (cb.checked) data[cb.dataset.key] = true;
  });

  localStorage.setItem(todayKey, JSON.stringify(data));
  showToast('Workout saved! 💪', 'success');
}

// ═══════════════════════════════════════════════════════════════
// SPLIT VIEW
// ═══════════════════════════════════════════════════════════════


async function renderSplit() {
  let html = '';
  for (let i = 0; i < PROGRAM.length; i++) {
    const day = PROGRAM[i];
    const isLocked = userTier === 0 && day.id !== 'day1';
    
    // Notes list
    const notesHtml = day.notes ? day.notes.map(n => `<li style="margin-bottom:5px;">${n}</li>`).join('') : '';

    html += `<div class="split-day ${isLocked ? 'locked-day' : ''}" id="split-day-${i}" ${isLocked ? 'onclick="showPremiumModal()"' : ''}>
      <div class="split-day-header" ${!isLocked ? `onclick="toggleSplitDay(${i})"` : ''}>
        <div>
          <div class="split-day-name">${day.name}</div>
          <div style="display:flex; gap:8px; margin-top:5px; font-size:0.75rem;">
            ${day.focus ? `<span style="background:var(--primary); color:#fff; padding:2px 8px; border-radius:12px;">🎯 ${day.focus}</span>` : ''}
            ${day.cardio ? `<span style="background:rgba(255,255,255,0.1); padding:2px 8px; border-radius:12px;">🏃 ${day.cardio}</span>` : ''}
          </div>
        </div>
        <div>${isLocked ? '🔒' : '▼'}</div>
      </div>
      <div class="split-day-body">`;
      
    if (!isLocked) {
      if (notesHtml) {
        html += `<div style="background:var(--bg3); padding:15px; border-radius:8px; margin-bottom:20px;">
          <h4 style="margin-bottom:10px; color:var(--primary);">Coach Notes</h4>
          <ul style="color:var(--text2); font-size:0.9rem; padding-left:20px;">${notesHtml}</ul>
        </div>`;
      }

      for (const ex of day.exercises) {
        const exName = ex[0];
        const exReps = ex[1];
        const exId = ex[3];
        const gifUrl = await getGifForExercise(exId);
        html += `<div class="split-exercise" style="display:block;">
          <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
            <span class="split-exercise-name" style="font-weight:600;">${exName}</span>
            <span class="split-exercise-reps" style="background:var(--bg3); padding:2px 6px; border-radius:4px; font-size:0.8rem;">${exReps}</span>
          </div>
          <div style="margin-top:10px;">
            ${gifUrl ? `<img src="${gifUrl}" style="max-width:100%; border-radius:8px; margin-bottom:10px;">` : ''}
            <button class="btn btn-outline btn-sm" onclick="triggerUpload('${exId}')" style="width:100%;">Upload GIF</button>
            <input type="file" id="file-${exId}" accept="image/*" style="display:none" onchange="uploadGif(event, '${exId}')">
          </div>
        </div>`;
      }
    }
    html += '</div></div>';
  }
  document.getElementById('split-content').innerHTML = html;
}



function toggleSplitDay(dayNum) {
  document.getElementById('split-day-' + dayNum).classList.toggle('open');
}

// ═══════════════════════════════════════════════════════════════
// PROGRESS TRACKER
// ═══════════════════════════════════════════════════════════════
function setDefaultDate() {
  document.getElementById('weightDate').value = new Date().toISOString().slice(0,10);
}

function saveWeight() {
  const date = document.getElementById('weightDate').value;
  const value = parseFloat(document.getElementById('weightValue').value);
  if (!date || isNaN(value)) {
    showToast('Please enter a valid date and weight', 'error');
    return;
  }
  const weights = JSON.parse(localStorage.getItem('weights') || '[]');
  // Remove existing entry for same date
  const filtered = weights.filter(w => w.date !== date);
  filtered.push({ date, value });
  filtered.sort((a, b) => a.date.localeCompare(b.date));
  localStorage.setItem('weights', JSON.stringify(filtered));
  document.getElementById('weightValue').value = '';
  showToast('Weight logged: ' + value + ' kg ✓', 'success');
  renderChart();
  renderWeightHistory();
}

function renderChart() {
  const canvas = document.getElementById('progressChart');
  const ctx = canvas.getContext('2d');
  const rect = canvas.parentElement.getBoundingClientRect();
  canvas.width = rect.width - 48;
  canvas.height = 300;
  const W = canvas.width;
  const H = canvas.height;

  ctx.clearRect(0, 0, W, H);

  const weights = JSON.parse(localStorage.getItem('weights') || '[]');

  if (weights.length < 2) {
    ctx.fillStyle = 'rgba(240,240,255,0.3)';
    ctx.font = '500 14px Outfit';
    ctx.textAlign = 'center';
    ctx.fillText('Log at least 2 weight entries to see your trend chart', W/2, H/2);
    return;
  }

  const values = weights.map(w => w.value);
  const minV = Math.min(...values) - 1;
  const maxV = Math.max(...values) + 1;
  const range = maxV - minV || 1;

  const padL = 50, padR = 20, padT = 20, padB = 40;
  const chartW = W - padL - padR;
  const chartH = H - padT - padB;

  // Grid lines
  ctx.strokeStyle = 'rgba(255,255,255,0.06)';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = padT + (chartH / 4) * i;
    ctx.beginPath();
    ctx.moveTo(padL, y);
    ctx.lineTo(W - padR, y);
    ctx.stroke();

    const val = (maxV - (range / 4) * i).toFixed(1);
    ctx.fillStyle = 'rgba(240,240,255,0.4)';
    ctx.font = '400 11px Outfit';
    ctx.textAlign = 'right';
    ctx.fillText(val, padL - 8, y + 4);
  }

  // Gradient fill
  const grad = ctx.createLinearGradient(0, padT, 0, H - padB);
  grad.addColorStop(0, 'rgba(109,40,217,0.3)');
  grad.addColorStop(1, 'rgba(109,40,217,0)');

  // Points
  const points = values.map((v, i) => ({
    x: padL + (i / (values.length - 1)) * chartW,
    y: padT + (1 - (v - minV) / range) * chartH
  }));

  // Fill area
  ctx.beginPath();
  ctx.moveTo(points[0].x, H - padB);
  points.forEach(p => ctx.lineTo(p.x, p.y));
  ctx.lineTo(points[points.length-1].x, H - padB);
  ctx.closePath();
  ctx.fillStyle = grad;
  ctx.fill();

  // Line
  ctx.beginPath();
  points.forEach((p, i) => {
    if (i === 0) ctx.moveTo(p.x, p.y);
    else ctx.lineTo(p.x, p.y);
  });
  ctx.strokeStyle = '#8b5cf6';
  ctx.lineWidth = 2.5;
  ctx.lineJoin = 'round';
  ctx.stroke();

  // Dots
  points.forEach((p, i) => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#8b5cf6';
    ctx.fill();
    ctx.strokeStyle = '#050508';
    ctx.lineWidth = 2;
    ctx.stroke();
  });

  // X-axis labels
  ctx.fillStyle = 'rgba(240,240,255,0.4)';
  ctx.font = '400 10px Outfit';
  ctx.textAlign = 'center';
  const step = Math.max(1, Math.floor(weights.length / 6));
  weights.forEach((w, i) => {
    if (i % step === 0 || i === weights.length - 1) {
      const x = padL + (i / (values.length - 1)) * chartW;
      ctx.fillText(w.date.slice(5), x, H - padB + 18);
    }
  });
}

function renderWeightHistory() {
  const weights = JSON.parse(localStorage.getItem('weights') || '[]');
  if (weights.length === 0) {
    document.getElementById('weight-history').innerHTML = '<p style="color:var(--text2);font-size:0.9rem;">No entries yet. Log your first weight above!</p>';
    return;
  }
  let html = '<div style="max-height:200px;overflow-y:auto;">';
  [...weights].reverse().forEach(w => {
    html += `<div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid var(--border);">
      <span style="font-weight:600;">${w.value} kg</span>
      <span style="color:var(--text2);font-size:0.85rem;">${w.date}</span>
      <button style="background:none;color:var(--danger);font-size:0.8rem;font-weight:600;cursor:pointer;border:none;font-family:inherit;" onclick="deleteWeight('${w.date}')">✕</button>
    </div>`;
  });
  html += '</div>';
  document.getElementById('weight-history').innerHTML = html;
}

function deleteWeight(date) {
  let weights = JSON.parse(localStorage.getItem('weights') || '[]');
  weights = weights.filter(w => w.date !== date);
  localStorage.setItem('weights', JSON.stringify(weights));
  renderChart();
  renderWeightHistory();
  showToast('Entry deleted', 'success');
}

// ═══════════════════════════════════════════════════════════════
// PHOTOS
// ═══════════════════════════════════════════════════════════════
function renderPhotos() {
  // Week selector
  let selHtml = '';
  for (let w = 1; w <= 8; w++) {
    selHtml += `<button class="week-btn ${w === selectedPhotoWeek ? 'active' : ''}" onclick="selectPhotoWeek(${w})">Week ${w}</button>`;
  }
  document.getElementById('photo-week-selector').innerHTML = selHtml;

  // Photo grid
  const positions = ['front', 'side', 'back'];
  let gridHtml = '';
  positions.forEach(pos => {
    const key = 'photo_w' + selectedPhotoWeek + '_' + pos;
    const data = localStorage.getItem(key);
    if (data) {
      gridHtml += `<div class="photo-slot" onclick="removePhoto('${key}', this)" style="padding:0;">
        <img src="${data}" alt="${pos}">
      </div>`;
    } else {
      gridHtml += `<div class="photo-slot" onclick="this.querySelector('input').click()">
        <div class="photo-icon">📷</div>
        <div class="photo-label">${pos.charAt(0).toUpperCase() + pos.slice(1)}</div>
        <input type="file" accept="image/*" style="display:none;" onchange="uploadPhoto(event, '${key}')">
      </div>`;
    }
  });
  document.getElementById('photo-grid').innerHTML = gridHtml;
}

function selectPhotoWeek(w) {
  selectedPhotoWeek = w;
  renderPhotos();
}

function uploadPhoto(event, key) {
  const file = event.target.files[0];
  if (!file) return;
  const img = new Image();
  const reader = new FileReader();
  reader.onload = function(e) {
    img.onload = function() {
      const canvas = document.createElement('canvas');
      const MAX = 800;
      let w = img.width, h = img.height;
      if (w > h) { if (w > MAX) { h *= MAX / w; w = MAX; } }
      else { if (h > MAX) { w *= MAX / h; h = MAX; } }
      canvas.width = w; canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, w, h);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
      try {
        localStorage.setItem(key, dataUrl);
        renderPhotos();
        showToast('Photo saved! 📸', 'success');
      } catch (err) {
        showToast('Storage full! Try deleting old photos.', 'error');
      }
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

function removePhoto(key) {
  if (confirm('Remove this photo?')) {
    localStorage.removeItem(key);
    renderPhotos();
    showToast('Photo removed', 'success');
  }
}

// ═══════════════════════════════════════════════════════════════
// NOTES
// ═══════════════════════════════════════════════════════════════
function loadNotes() {
  document.getElementById('generalNotes').value = localStorage.getItem('notes_general') || '';
  loadDayNote();
  document.getElementById('noteDaySelect').addEventListener('change', loadDayNote);
}

function loadDayNote() {
  const day = document.getElementById('noteDaySelect').value;
  document.getElementById('dayNotes').value = localStorage.getItem('notes_' + day) || '';
}

function saveNotes(type) {
  if (type === 'general') {
    localStorage.setItem('notes_general', document.getElementById('generalNotes').value);
    showToast('General notes saved! 📝', 'success');
  }
}

function saveDayNote() {
  const day = document.getElementById('noteDaySelect').value;
  localStorage.setItem('notes_' + day, document.getElementById('dayNotes').value);
  showToast('Day note saved! ✓', 'success');
}

// ═══════════════════════════════════════════════════════════════
// EXERCISE LIBRARY
// ═══════════════════════════════════════════════════════════════
function renderLibrary() {
  const exercises = getAllExercises();
  const search = (document.getElementById('librarySearch')?.value || '').toLowerCase();
  const filtered = search ? exercises.filter(e => e.toLowerCase().includes(search)) : exercises;

  let html = '';
  filtered.forEach(name => {
    html += `<div class="library-item">
      <span style="font-weight:600;">${name}</span>
      <label class="btn btn-outline btn-sm" style="cursor:pointer;padding:6px 14px;font-size:0.8rem;">
        📎 GIF
        <input type="file" accept="image/gif,image/*" style="display:none;" onchange="uploadGif(event, '${name.replace(/'/g, "\\'")}')">
      </label>
    </div>`;
  });

  if (filtered.length === 0) {
    html = '<p style="text-align:center;color:var(--text2);padding:40px;">No exercises match your search.</p>';
  }

  document.getElementById('library-list').innerHTML = html;
}

function filterLibrary() { renderLibrary(); }

// IndexedDB for GIF storage
function openGifDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open('aestheticOfflineMediaDB', 1);
    req.onupgradeneeded = () => {
      req.result.createObjectStore('files', { keyPath: 'id' });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}


async function uploadGif(event, exerciseName) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = async function(e) {
    try {
      const db = await openGifDB();
      const tx = db.transaction('files', 'readwrite');
      tx.objectStore('files').put({ id: 'gif__' + exerciseName, dataUrl: e.target.result, name: file.name, type: file.type, updatedAt: Date.now() });
      showToast('GIF uploaded successfully!', 'success');
      renderTodayWorkout();
      renderSplit();
    } catch (err) {
      showToast('Error saving GIF', 'error');
    }
  };
  reader.readAsDataURL(file);
}

async function getGifForExercise(exName) {
  try {
    const db = await openGifDB();
    return new Promise(res => {
      const tx = db.transaction('files', 'readonly');
      const req = tx.objectStore('files').get('gif__' + exName);
      req.onsuccess = () => res(req.result ? req.result.dataUrl : null);
      req.onerror = () => res(null);
    });
  } catch(e) { return null; }
}

function triggerUpload(exName) {
  document.getElementById('file-' + exName).click();
}


// ═══════════════════════════════════════════════════════════════
// SETTINGS
// ═══════════════════════════════════════════════════════════════
function exportData() {
  const data = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    data[key] = localStorage.getItem(key);
  }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'aesthetix-backup-' + new Date().toISOString().slice(0,10) + '.json';
  a.click();
  URL.revokeObjectURL(url);
  showToast('Backup exported! 📤', 'success');
}

function importData(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const data = JSON.parse(e.target.result);
      Object.keys(data).forEach(key => {
        localStorage.setItem(key, data[key]);
      });
      showToast('Backup imported successfully! 📥', 'success');
      navigateTo('dashboard');
    } catch (err) {
      showToast('Invalid backup file', 'error');
    }
  };
  reader.readAsText(file);
}

function factoryReset() {
  if (confirm('⚠️ This will delete ALL your data including workouts, photos, weights, and notes. This cannot be undone.\n\nAre you sure?')) {
    if (confirm('Really? Last chance — all data will be permanently deleted.')) {
      localStorage.clear();
      showToast('All data reset. Starting fresh! 🔄', 'success');
      navigateTo('dashboard');
    }
  }
}

// ═══════════════════════════════════════════════════════════════
// TOAST NOTIFICATION
// ═══════════════════════════════════════════════════════════════
function showToast(message, type = 'success') {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast ' + type;
  toast.innerHTML = (type === 'success' ? '✅' : '❌') + ' ' + message;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(20px)';
    toast.style.transition = '0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

// ═══════════════════════════════════════════════════════════════
// INIT
// ═══════════════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  // Set program start if not set
  if (!localStorage.getItem('programStart')) {
    localStorage.setItem('programStart', new Date().toISOString().slice(0,10));
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(a.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // Close modal on overlay click
  document.getElementById('loginModal').addEventListener('click', function(e) {
    if (e.target === this) hideLoginModal();
  });

  // Resize chart on window resize
  window.addEventListener('resize', () => {
    if (currentAppPage === 'progress') renderChart();
  });
});

