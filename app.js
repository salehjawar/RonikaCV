const state = {
  lang: 'en',
  template: 'modern',
  font: "'Open Sans', sans-serif",
  photoBase64: null,
};

const labels = {
  en: { 
      personal: "Personal Info", exp: "Experience", edu: "Education", skill: "Skills", 
      lang_section: "Languages", summary: "Summary", contact: "Contact", 
      export: "Export Resume", photo: "Photo", font: "Font Style",
      dob: "Date of Birth", marital: "Marital Status", tribe: "Tribe/Ethnicity"
  },
  ku: { 
      personal: "زانیاری کەسی", exp: "ئەزموونی کار", edu: "خوێندن", skill: "تواناکان", 
      lang_section: "زمانەکان", summary: "پوختە", contact: "پەیوەندی", 
      export: "داگرتنی سی‌وی", photo: "وێنە", font: "جۆری فۆنت",
      dob: "بەرواری لەدایکبوون", marital: "باری خێزانی", tribe: "عەشیرەت"
  }
};

function updateUI() {
  state.lang = document.getElementById('languageSelect').value;
  const t = labels[state.lang];
  document.body.className = state.lang === 'ku' ? 'rtl' : '';
  
  document.getElementById('lblPersonal').innerText = t.personal;
  document.getElementById('lblPhoto').innerText = t.photo;
  document.getElementById('lblFont').innerText = t.font;
  document.getElementById('btnAddExp').innerText = state.lang === 'en' ? 'Exp' : 'ئەزموون';
  document.getElementById('btnAddEdu').innerText = state.lang === 'en' ? 'Edu' : 'خوێندن';
  document.getElementById('btnAddSkill').innerText = state.lang === 'en' ? 'Skill' : 'توانا';
  document.getElementById('btnAddLang').innerText = state.lang === 'en' ? 'Lang' : 'زمان';
  document.getElementById('lblExport').innerText = t.export;
  
  document.getElementById('dob').placeholder = t.dob;
  document.getElementById('marital').placeholder = t.marital;
  document.getElementById('tribe').placeholder = t.tribe;

  renderPreview();
}

function setTemplate(name, el) {
  state.template = name;
  document.querySelectorAll('.t-opt').forEach(d => {
      d.classList.remove('active');
      if(d.textContent.toLowerCase().includes(name) || d.getAttribute('onclick').includes(name)) d.classList.add('active');
  });
  document.querySelectorAll('.mt-opt').forEach(d => {
      d.classList.remove('active');
      if(d.dataset.t === name) d.classList.add('active');
  });
  if(el && el.classList) el.classList.add('active');
  renderPreview();
}

function switchMobileTab(tabName) {
    const editor = document.getElementById('editorTab');
    const preview = document.getElementById('previewTab');
    const btnEdit = document.getElementById('navEdit');
    const btnPreview = document.getElementById('navPreview');
    if (tabName === 'editor') {
        editor.style.display = 'flex';
        preview.style.display = 'none';
        btnEdit.classList.add('active');
        btnPreview.classList.remove('active');
    } else {
        editor.style.display = 'none';
        preview.style.display = 'flex';
        btnEdit.classList.remove('active');
        btnPreview.classList.add('active');
    }
}

function toggleSection(id) { document.getElementById(id).classList.toggle('open'); }

function handlePhotoUpload(input) {
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = (e) => { state.photoBase64 = e.target.result; renderPreview(); };
    reader.readAsDataURL(input.files[0]);
  }
}

function addItem(type) {
  const container = document.getElementById(`${type}Container`);
  const id = Date.now();
  let html = '';
  if (type === 'skill' || type === 'language') {
    const placeholder = type === 'skill' ? (state.lang === 'en' ? 'Skill Name' : 'ناوی توانا') : (state.lang === 'en' ? 'Language' : 'زمان');
    const inputClass = type === 'skill' ? 'inp-skill' : 'inp-lang';
    html = `<div class="item-card" id="item-${id}"><button class="btn-remove" onclick="removeItem(${id})">X</button><div style="display:flex; gap:5px;"><input type="text" class="${inputClass}" placeholder="${placeholder}" oninput="renderPreview()" style="flex:2"><select class="inp-level" onchange="renderPreview()" style="flex:1"><option value="5">5/5</option><option value="4">4/5</option><option value="3">3/5</option><option value="2">2/5</option><option value="1">1/5</option></select></div></div>`;
  } else {
    const ph = state.lang === 'en' ? { t: "Title / Degree", o: "Company / Uni", d: "Date", x: "Description" } : { t: "ناونیشان / بڕوانامە", o: "کۆمپانیا / زانکۆ", d: "بەروار", x: "تێبینی" };
    html = `<div class="item-card" id="item-${id}"><button class="btn-remove" onclick="removeItem(${id})">X</button><div class="form-group"><input type="text" class="inp-title" placeholder="${ph.t}" oninput="renderPreview()"></div><div class="form-group"><input type="text" class="inp-org" placeholder="${ph.o}" oninput="renderPreview()"></div><div class="form-group"><input type="text" class="inp-date" placeholder="${ph.d}" oninput="renderPreview()"></div><div class="form-group"><textarea class="inp-desc" placeholder="${ph.x}" rows="2" oninput="renderPreview()"></textarea></div></div>`;
  }
  container.insertAdjacentHTML('beforeend', html);
}

function removeItem(id) { document.getElementById(`item-${id}`).remove(); renderPreview(); }

function getData() {
  const getVal = (id) => { const el = document.getElementById(id); return el ? el.value : ''; };
  const skills = [];
  document.querySelectorAll('#skillContainer .item-card').forEach(div => {
    skills.push({ name: div.querySelector('.inp-skill').value, level: parseInt(div.querySelector('.inp-level').value) });
  });
  const languages = [];
  document.querySelectorAll('#languageContainer .item-card').forEach(div => {
    languages.push({ name: div.querySelector('.inp-lang').value, level: parseInt(div.querySelector('.inp-level').value) });
  });
  const getItems = (containerId) => {
    const items = [];
    document.querySelectorAll(`#${containerId} .item-card`).forEach(div => {
      items.push({
        title: div.querySelector('.inp-title').value,
        org: div.querySelector('.inp-org').value,
        date: div.querySelector('.inp-date').value,
        desc: div.querySelector('.inp-desc').value
      });
    });
    return items;
  };
  return {
    fullName: getVal('fullName') || (state.lang === 'ku' ? "ناوی سی‌وی" : "Your Name"),
    jobTitle: getVal('jobTitle') || "Job Title",
    phone: getVal('phone'),
    email: getVal('email'),
    address: getVal('address'),
    dob: getVal('dob'),
    marital: getVal('marital'),
    tribe: getVal('tribe'),
    summary: getVal('summary'),
    photo: state.photoBase64,
    skills: skills,
    languages: languages,
    exp: getItems('experienceContainer'),
    edu: getItems('educationContainer')
  };
}

function renderSkillVisuals(level, type) {
  if (type === 'bar') return `<div class="skill-bar-container"><div class="skill-bar-fill" style="width:${level*20}%"></div></div>`;
  if (type === 'dots') { let dots = ''; for(let i=0; i<5; i++) dots += `<div class="dot ${i<level?'filled':''}"></div>`; return `<div class="dots">${dots}</div>`; }
  // Stars visual
  let stars = ''; for(let i=0; i<level; i++) stars += '★'; return `<span class="stars">${stars}</span>`;
}

function renderItems(items, title) {
  if (!items.length) return '';
  return `<div class="section-title">${title}</div>${items.map(i => `<div class="item"><div class="item-head"><span>${i.title}</span> <span>${i.date}</span></div><div class="item-sub">${i.org}</div><div class="item-desc">${i.desc}</div></div>`).join('')}`;
}

// --- RENDER PREVIEW ---
function renderPreview() {
  try { autoSave(); } catch(e) {}
  const data = getData();
  const t = labels[state.lang];
  const container = document.getElementById('resumePreview');
  container.style.fontFamily = document.getElementById('fontSelect').value;

  let html = '';
  const sectionEdu = renderItems(data.edu, state.lang === 'en' ? "Education" : "خوێندن");
  const sectionExp = renderItems(data.exp, state.lang === 'en' ? "Experience" : "ئەزموونی کار");

  // --- VISUAL STYLE LOGIC ---
  let skillType = 'stars'; // Default
  if (state.template === 'modern') skillType = 'stars'; // Changed to STARS per request
  if (state.template === 'sky') skillType = 'stars';    // Changed to STARS per request
  if (state.template === 'creative') skillType = 'dots';
  if (state.template === 'bold') skillType = 'dots';
  // You can set other templates to 'bar' if needed, e.g., 'minimal' or 'elegant'

  const skillsListHTML = data.skills.length ? `
    <div class="section-title">${t.skill}</div>
    <div class="main-skills-grid">
      ${data.skills.map(s => `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:5px; gap:10px;">
          <span style="font-weight:bold; min-width:100px;">${s.name}</span>
          <div style="flex:1; text-align:right;">${renderSkillVisuals(s.level, skillType)}</div>
        </div>
      `).join('')}
    </div>` : '';

  const languagesListHTML = data.languages.length ? `
    <div class="section-title">${t.lang_section}</div>
    <div class="main-skills-grid">
      ${data.languages.map(s => `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:5px; gap:10px;">
          <span style="font-weight:bold; min-width:100px;">${s.name}</span>
          <div style="flex:1; text-align:right;">${renderSkillVisuals(s.level, skillType)}</div>
        </div>
      `).join('')}
    </div>` : '';

  // --- SIDEBAR DETAILS (Updated: Text Titles instead of Icons) ---
  const getSidebarDetails = () => `
    <div class="contact-section">
      <div class="section-title" style="margin-top:0;">${t.contact}</div>
      <div class="contact-item"><i class="fas fa-phone"></i> ${data.phone}</div>
      <div class="contact-item"><i class="fas fa-envelope"></i> ${data.email}</div>
      <div class="contact-item"><i class="fas fa-map-marker-alt"></i> ${data.address}</div>
      
      ${data.dob || data.marital || data.tribe ? `<div class="section-title" style="margin-top:20px; border-top:1px solid rgba(255,255,255,0.2); padding-top:10px;">${state.lang==='en'?'Personal':'کەسی'}</div>` : ''}
      
      ${data.dob ? `<div class="contact-item"><b>${t.dob}:</b> <br>${data.dob}</div>` : ''}
      ${data.marital ? `<div class="contact-item"><b>${t.marital}:</b> <br>${data.marital}</div>` : ''}
      ${data.tribe ? `<div class="contact-item"><b>${t.tribe}:</b> <br>${data.tribe}</div>` : ''}
    </div>
  `;

  // --- TEMPLATES ---
  if (state.template === 'sky') { 
    html = `
      <div class="template-sky">
        <div class="sidebar">
          ${data.photo ? `<img src="${data.photo}" class="photo">` : ''}
          ${getSidebarDetails()}
        </div>
        <div class="main">
          <h1>${data.fullName}</h1>
          <h2>${data.jobTitle}</h2>
          ${data.summary ? `<div class="section-title">${t.summary}</div><p>${data.summary}</p>` : ''}
          ${sectionExp}
          ${sectionEdu}
          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px;">
            <div>${skillsListHTML}</div>
            <div>${languagesListHTML}</div>
          </div>
        </div>
      </div>`;
  }
  else if (state.template === 'modern') {
    html = `
      <div class="template-modern">
        <div class="sidebar">
          ${data.photo ? `<img src="${data.photo}" class="photo">` : ''}
          ${getSidebarDetails()}
        </div>
        <div class="main">
          <h1>${data.fullName}</h1>
          <h2>${data.jobTitle}</h2>
          ${data.summary ? `<div class="section-title">${t.summary}</div><p>${data.summary}</p>` : ''}
          ${sectionEdu}
          ${sectionExp}
          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px;">
            <div>${skillsListHTML}</div>
            <div>${languagesListHTML}</div>
          </div>
        </div>
      </div>`;
  } 
  else if (state.template === 'elegant') {
    html = `
      <div class="template-elegant">
        <header>
          ${data.photo ? `<img src="${data.photo}" class="photo">` : ''}
          <h1>${data.fullName}</h1>
          <h2>${data.jobTitle}</h2>
          <div class="contact-row">
            <span>${data.phone}</span> | <span>${data.email}</span> | <span>${data.address}</span>
          </div>
           <div class="contact-row" style="margin-top:5px; font-size:12px; color:#777;">
            ${data.dob ? `<span><b>${t.dob}:</b> ${data.dob}</span>` : ''}
            ${data.marital ? ` | <span><b>${t.marital}:</b> ${data.marital}</span>` : ''} 
            ${data.tribe ? ` | <span><b>${t.tribe}:</b> ${data.tribe}</span>` : ''}
          </div>
        </header>
        ${data.summary ? `<div class="section-title">${t.summary}</div><p>${data.summary}</p>` : ''}
        ${sectionEdu}
        ${sectionExp}
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px;">
            <div>${skillsListHTML}</div>
            <div>${languagesListHTML}</div>
        </div>
      </div>`;
  }
  // (Minimal, Creative, Bold, Compact skipped for brevity, they follow similar logic)
  else {
      // Fallback
       html = `
      <div class="template-modern">
        <div class="sidebar">
          ${data.photo ? `<img src="${data.photo}" class="photo">` : ''}
          ${getSidebarDetails()}
        </div>
        <div class="main">
          <h1>${data.fullName}</h1>
          <h2>${data.jobTitle}</h2>
          ${data.summary ? `<div class="section-title">${t.summary}</div><p>${data.summary}</p>` : ''}
          ${sectionEdu}
          ${sectionExp}
          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px;">
            <div>${skillsListHTML}</div>
            <div>${languagesListHTML}</div>
          </div>
        </div>
      </div>`;
  }

  container.innerHTML = html;
}

// --- DUAL STRATEGY EXPORT (WINDOWS & MOBILE) ---
function exportPDF() {
  if (window.innerWidth >= 1024) {
    // WINDOWS MODE (Simple & Reliable)
    const element = document.getElementById('resumePreview');
    const originalWidth = element.style.width;
    element.style.width = '210mm'; 
    element.style.minHeight = '296.8mm';
    element.style.height = 'auto';

    const opt = {
      margin: 0,
      filename: 'CV.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save().then(() => {
        element.style.width = originalWidth;
    });

  } else {
    // MOBILE MODE (Ghost Container)
    exportPDFMobile();
  }
}

function exportPDFMobile() {
  const original = document.getElementById('resumePreview');
  const clone = original.cloneNode(true);
  const overlay = document.createElement('div');
  
  Object.assign(overlay.style, {
    position: 'fixed', top: '0', left: '0', width: '100vw', height: '100vh',
    zIndex: '999999', background: '#525659', overflow: 'auto',
    display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: '0'
  });

  Object.assign(clone.style, {
    width: '210mm', minWidth: '210mm', height: 'auto', minHeight: '296.8mm',
    transform: 'none', margin: '0', boxShadow: 'none', background: 'white'
  });
  clone.classList.remove('mobile-preview');

  overlay.appendChild(clone);
  document.body.appendChild(overlay);
  window.scrollTo(0, 0);

  const opt = {
    margin: 0, filename: 'CV.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, scrollY: 0, scrollX: 0, windowWidth: 794 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };
  
  html2pdf().set(opt).from(clone).save().then(() => { document.body.removeChild(overlay); })
    .catch((err) => { if(document.body.contains(overlay)) document.body.removeChild(overlay); });
}

function exportWord() {
  const data = getData();
  const t = labels[state.lang];
  const isRTL = state.lang === 'ku';
  const styles = `body { font-family: sans-serif; }`;
  let content = `
    <html ${isRTL ? 'dir="rtl"' : ''}><head><meta charset="utf-8"><style>${styles}</style></head><body>
      <h1>${data.fullName}</h1>
      <p>${data.jobTitle}<br>${data.phone} | ${data.email}</p>
      ${data.summary ? `<h3>${t.summary}</h3><p>${data.summary}</p>` : ''}
      ${data.edu.length ? `<h3>${t.edu}</h3>` : ''}
      ${data.edu.map(i => `<p><b>${i.title}</b>, ${i.org}<br>${i.date}<br>${i.desc}</p>`).join('')}
      ${data.exp.length ? `<h3>${t.exp}</h3>` : ''}
      ${data.exp.map(i => `<p><b>${i.title}</b>, ${i.org}<br>${i.date}<br>${i.desc}</p>`).join('')}
      ${data.skills.length ? `<h3>${t.skill}</h3>` : ''}
      <ul>${data.skills.map(s => `<li>${s.name} (${s.level}/5)</li>`).join('')}</ul>
      ${data.languages.length ? `<h3>${t.lang_section}</h3>` : ''}
      <ul>${data.languages.map(s => `<li>${s.name} (${s.level}/5)</li>`).join('')}</ul>
    </body></html>`;
  const blob = new Blob(['\ufeff', content], { type: 'application/msword' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `CV-${data.fullName}.doc`;
  link.click();
}

function saveProjectData() {
  try {
    const data = getData();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "CV_Project.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  } catch(e) { alert("Save failed."); }
}

function loadProjectData(input) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const data = JSON.parse(e.target.result);
      populateForm(data);
      alert("Loaded successfully!");
    } catch (err) { alert("Error loading file."); }
  };
  reader.readAsText(file);
}

function populateForm(data) {
  if(!data) return;
  document.getElementById('educationContainer').innerHTML = '';
  document.getElementById('experienceContainer').innerHTML = '';
  document.getElementById('skillContainer').innerHTML = '';
  document.getElementById('languageContainer').innerHTML = '';
  const safeVal = (id, val) => { const el = document.getElementById(id); if(el) el.value = val || ''; };
  safeVal('fullName', data.fullName);
  safeVal('jobTitle', data.jobTitle);
  safeVal('phone', data.phone);
  safeVal('email', data.email);
  safeVal('address', data.address);
  safeVal('summary', data.summary);
  safeVal('dob', data.dob);
  safeVal('marital', data.marital);
  safeVal('tribe', data.tribe);
  if (data.photo) state.photoBase64 = data.photo;
  const addItemsSafe = (arr, type, fields) => {
      if(arr && Array.isArray(arr)) {
          arr.forEach(item => {
              addItem(type);
              const container = document.getElementById(`${type}Container`);
              const card = container.lastElementChild;
              if(card) {
                  fields.forEach(f => {
                      const inp = card.querySelector(f.sel);
                      if(inp) inp.value = item[f.key] || '';
                  });
              }
          });
      }
  };
  addItemsSafe(data.edu, 'education', [{sel: '.inp-title', key: 'title'}, {sel: '.inp-org', key: 'org'}, {sel: '.inp-date', key: 'date'}, {sel: '.inp-desc', key: 'desc'}]);
  addItemsSafe(data.exp, 'experience', [{sel: '.inp-title', key: 'title'}, {sel: '.inp-org', key: 'org'}, {sel: '.inp-date', key: 'date'}, {sel: '.inp-desc', key: 'desc'}]);
  addItemsSafe(data.skills, 'skill', [{sel: '.inp-skill', key: 'name'}, {sel: '.inp-level', key: 'level'}]);
  addItemsSafe(data.languages, 'language', [{sel: '.inp-lang', key: 'name'}, {sel: '.inp-level', key: 'level'}]);
  renderPreview();
}

function resetData() {
    if(confirm("Are you sure?")) {
        localStorage.removeItem('cv_autosave');
        location.reload();
    }
}

function autoSave() {
    const data = getData();
    localStorage.setItem('cv_autosave', JSON.stringify(data));
}

window.addEventListener('load', () => {
    const saved = localStorage.getItem('cv_autosave');
    if(saved) { try { populateForm(JSON.parse(saved)); } catch(e) {} } else { updateUI(); }
});
