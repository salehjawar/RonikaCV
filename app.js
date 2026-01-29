const state = {
  lang: 'en',
  template: 'modern', // پیش‌فرض: مدرن
  font: "'Open Sans', sans-serif",
  photoBase64: null,
};

const labels = {
  en: { personal: "Personal Info", exp: "Experience", edu: "Education", skill: "Skills", lang_section: "Languages", summary: "Summary", contact: "Contact", export: "Export Resume", photo: "Photo", font: "Font Style" },
  ku: { personal: "زانیاری کەسی", exp: "ئەزموونی کار", edu: "خوێندن", skill: "تواناکان", lang_section: "زمانەکان", summary: "پوختە", contact: "پەیوەندی", export: "داگرتنی سی‌وی", photo: "وێنە", font: "جۆری فۆنت" }
};

// UI Functions
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

  renderPreview();
}

function setTemplate(name, el) {
  state.template = name;
  document.querySelectorAll('.t-opt').forEach(d => d.classList.remove('active'));
  el.classList.add('active');
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

function toggleSection(id) {
  document.getElementById(id).classList.toggle('open');
}

function handlePhotoUpload(input) {
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = (e) => { state.photoBase64 = e.target.result; renderPreview(); };
    reader.readAsDataURL(input.files[0]);
  }
}

// Data Management
function addItem(type) {
  const container = document.getElementById(`${type}Container`);
  const id = Date.now();
  let html = '';

  if (type === 'skill' || type === 'language') {
    const placeholder = type === 'skill' ? (state.lang === 'en' ? 'Skill Name' : 'ناوی توانا') : (state.lang === 'en' ? 'Language' : 'زمان');
    const inputClass = type === 'skill' ? 'inp-skill' : 'inp-lang';
    
    html = `
      <div class="item-card" id="item-${id}">
        <button class="btn-remove" onclick="removeItem(${id})">X</button>
        <div style="display:flex; gap:5px;">
          <input type="text" class="${inputClass}" placeholder="${placeholder}" oninput="renderPreview()" style="flex:2">
          <select class="inp-level" onchange="renderPreview()" style="flex:1">
            <option value="5">5/5</option>
            <option value="4">4/5</option>
            <option value="3">3/5</option>
            <option value="2">2/5</option>
            <option value="1">1/5</option>
          </select>
        </div>
      </div>`;
  } else {
    const ph = state.lang === 'en' ? 
      { t: "Title / Degree", o: "Company / Uni", d: "Date", x: "Description" } :
      { t: "ناونیشان / بڕوانامە", o: "کۆمپانیا / زانکۆ", d: "بەروار", x: "تێبینی" };
      
    html = `
      <div class="item-card" id="item-${id}">
        <button class="btn-remove" onclick="removeItem(${id})">X</button>
        <div class="form-group"><input type="text" class="inp-title" placeholder="${ph.t}" oninput="renderPreview()"></div>
        <div class="form-group"><input type="text" class="inp-org" placeholder="${ph.o}" oninput="renderPreview()"></div>
        <div class="form-group"><input type="text" class="inp-date" placeholder="${ph.d}" oninput="renderPreview()"></div>
        <div class="form-group"><textarea class="inp-desc" placeholder="${ph.x}" rows="2" oninput="renderPreview()"></textarea></div>
      </div>`;
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
    summary: getVal('summary'),
    photo: state.photoBase64,
    skills: skills,
    languages: languages,
    exp: getItems('experienceContainer'),
    edu: getItems('educationContainer')
  };
}

function renderSkillVisuals(level, type) {
  if (type === 'bar') {
    return `<div class="skill-bar-container"><div class="skill-bar-fill" style="width:${level*20}%"></div></div>`;
  } else if (type === 'dots') {
    let dots = '';
    for(let i=0; i<5; i++) dots += `<div class="dot ${i<level?'filled':''}"></div>`;
    return `<div class="dots">${dots}</div>`;
  } else {
    let stars = '';
    for(let i=0; i<level; i++) stars += '★';
    return `<span class="stars">${stars}</span>`;
  }
}

function renderItems(items, title) {
  if (!items.length) return '';
  return `
    <div class="section-title">${title}</div>
    ${items.map(i => `
      <div class="item">
        <div class="item-head"><span>${i.title}</span> <span>${i.date}</span></div>
        <div class="item-sub">${i.org}</div>
        <div class="item-desc">${i.desc}</div>
      </div>
    `).join('')}`;
}

function renderPreview() {
  try { autoSave(); } catch(e) {}
  const data = getData();
  const t = labels[state.lang];
  const container = document.getElementById('resumePreview');
  container.style.fontFamily = document.getElementById('fontSelect').value;

  let html = '';
  const sectionEdu = renderItems(data.edu, state.lang === 'en' ? "Education" : "خوێندن");
  const sectionExp = renderItems(data.exp, state.lang === 'en' ? "Experience" : "ئەزموونی کار");

  let skillType = 'stars';
  if (state.template === 'modern') skillType = 'bar';
  if (state.template === 'sky') skillType = 'bar';
  if (state.template === 'creative') skillType = 'dots';
  if (state.template === 'bold') skillType = 'dots';

  const skillsListHTML = data.skills.length ? `
    <div class="section-title">${t.skill}</div>
    <div class="skills-list">
      ${data.skills.map(s => `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:5px;">
          <span>${s.name}</span>
          ${renderSkillVisuals(s.level, skillType)}
        </div>
      `).join('')}
    </div>` : '';

  const languagesListHTML = data.languages.length ? `
    <div class="section-title">${t.lang_section}</div>
    <div class="skills-list">
      ${data.languages.map(s => `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:5px;">
          <span>${s.name}</span>
          ${renderSkillVisuals(s.level, skillType)}
        </div>
      `).join('')}
    </div>` : '';

  if (state.template === 'sky') { 
    html = `
      <div class="template-sky">
        <div class="sidebar">
          ${data.photo ? `<img src="${data.photo}" class="photo">` : ''}
          <div class="section-title">${t.contact}</div>
          <div class="contact-item"><i class="fas fa-phone"></i> ${data.phone}</div>
          <div class="contact-item"><i class="fas fa-envelope"></i> ${data.email}</div>
          <div class="contact-item"><i class="fas fa-map-marker-alt"></i> ${data.address}</div>
          ${skillsListHTML}
          ${languagesListHTML}
        </div>
        <div class="main">
          <h1>${data.fullName}</h1>
          <h2>${data.jobTitle}</h2>
          ${data.summary ? `<div class="section-title">${t.summary}</div><p>${data.summary}</p>` : ''}
          ${sectionExp}
          ${sectionEdu} </div>
      </div>`;
  }
  else if (state.template === 'modern') {
    html = `
      <div class="template-modern">
        <div class="sidebar">
          ${data.photo ? `<img src="${data.photo}" class="photo">` : ''}
          <div class="section-title">${t.contact}</div>
          <p style="font-size:13px; line-height:1.6;">${data.phone}<br>${data.email}<br>${data.address}</p>
          ${languagesListHTML}
        </div>
        <div class="main">
          <h1>${data.fullName}</h1>
          <h2>${data.jobTitle}</h2>
          ${data.summary ? `<div class="section-title">${t.summary}</div><p>${data.summary}</p>` : ''}
          ${sectionEdu}
          ${sectionExp}
          ${skillsListHTML}
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
          <div style="font-size:13px; margin-top:10px;">${data.phone} | ${data.email} | ${data.address}</div>
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
  else if (state.template === 'creative') {
    html = `
      <div class="template-creative">
        <header>
          ${data.photo ? `<img src="${data.photo}" class="photo">` : ''}
          <div>
            <h1>${data.fullName}</h1>
            <h2>${data.jobTitle}</h2>
            <div style="font-size:12px; color:#666; margin-top:5px;">${data.phone} | ${data.email}</div>
          </div>
        </header>
        ${data.summary ? `<div class="section-title">${t.summary}</div><p>${data.summary}</p>` : ''}
        ${sectionEdu}
        ${sectionExp}
        ${skillsListHTML}
        ${languagesListHTML}
      </div>`;
  }
  else if (state.template === 'minimal') {
    html = `
      <div class="template-minimal">
        <header>
            <h1>${data.fullName}</h1>
            <h2>${data.jobTitle}</h2>
            <div style="font-size:12px; margin-top:10px; border-top:1px solid #eee; padding-top:5px;">
                ${data.phone} &bull; ${data.email} &bull; ${data.address}
            </div>
        </header>
        ${data.summary ? `<div class="section-title">${t.summary}</div><p>${data.summary}</p>` : ''}
        ${sectionEdu}
        ${sectionExp}
        ${skillsListHTML}
        ${languagesListHTML}
      </div>`;
  }
  else if (state.template === 'bold') {
    html = `
      <div class="template-bold">
        <header>
            ${data.photo ? `<img src="${data.photo}" class="photo">` : ''}
            <div>
                <h1>${data.fullName}</h1>
                <div style="color:#ddd;">${data.jobTitle}</div>
            </div>
        </header>
        <div class="content">
            <div class="left-col">
                <div class="section-title">${t.contact}</div>
                <div style="margin-bottom:20px; font-size:13px;">${data.phone}<br>${data.email}<br>${data.address}</div>
                ${languagesListHTML}
            </div>
            <div class="right-col">
                ${data.summary ? `<div class="section-title">${t.summary}</div><p>${data.summary}</p>` : ''}
                ${sectionEdu}
                ${sectionExp}
                ${skillsListHTML}
            </div>
        </div>
      </div>`;
  }
  else if (state.template === 'compact') {
    html = `
      <div class="template-compact">
        <header>
            <div>
                <h1>${data.fullName}</h1>
                <div style="color:#666;">${data.jobTitle}</div>
            </div>
            <div style="text-align:right; font-size:12px;">
                ${data.phone}<br>${data.email}<br>${data.address}
            </div>
        </header>
        <div class="cols">
            <div>
                ${data.summary ? `<div class="section-title">${t.summary}</div><p>${data.summary}</p>` : ''}
                ${sectionEdu}
                ${sectionExp}
            </div>
            <div style="background:#f9f9f9; padding:10px; border-radius:5px; height:fit-content;">
                ${skillsListHTML}
                ${languagesListHTML}
            </div>
        </div>
      </div>`;
  }

  container.innerHTML = html;
}

function exportPDF() {
  const element = document.getElementById('resumePreview');
  const opt = {
    margin: 0,
    filename: 'CV.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, scrollY: 0 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };
  element.style.minHeight = 'unset';
  element.style.height = 'auto';
  html2pdf().set(opt).from(element).save().then(() => {
     element.style.minHeight = '';
     element.style.height = '';
  });
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
