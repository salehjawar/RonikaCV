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
      dob: "Date of Birth", marital: "Marital Status", tribe: "Tribe/Ethnicity",
      textSize: "Text Size", photoZoom: "Photo Zoom", photoX: "Left / Right", photoY: "Up / Down"
  },
  ku: { 
      personal: "زانیاری کەسی", exp: "ئەزموونی کار", edu: "خوێندن", skill: "تواناکان", 
      lang_section: "زمانەکان", summary: "پوختە", contact: "پەیوەندی", 
      export: "داگرتنی سی‌وی", photo: "وێنە", font: "جۆری فۆنت",
      dob: "بەرواری لەدایکبوون", marital: "باری خێزانی", tribe: "عەشیرەت",
      textSize: "قەبارەی فۆنت", photoZoom: "زوومکردنی وێنە", photoX: "چەپ / ڕاست", photoY: "سەرەوە / خوارەوە"
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
  
  document.getElementById('lblTextSize').innerText = t.textSize;
  document.getElementById('lblPhotoZoom').innerText = t.photoZoom;
  document.getElementById('lblPhotoX').innerText = t.photoX;
  document.getElementById('lblPhotoY').innerText = t.photoY;

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
    reader.onload = (e) => { 
        state.photoBase64 = e.target.result; 
        document.getElementById('photoControls').style.display = 'flex'; 
        document.getElementById('photoControls').style.flexDirection = 'column'; 
        renderPreview(); 
    };
    reader.readAsDataURL(input.files[0]);
  }
}

function addItem(type) {
  const container = document.getElementById(`${type}Container`);
  const id = Date.now();
  let html = '';
  
  let badgeIcon = '';
  let badgeText = '';
  if (type === 'education') { badgeIcon = 'fas fa-graduation-cap'; badgeText = state.lang === 'en' ? 'Education' : 'خوێندن'; }
  if (type === 'experience') { badgeIcon = 'fas fa-briefcase'; badgeText = state.lang === 'en' ? 'Experience' : 'ئەزموونی کار'; }
  if (type === 'skill') { badgeIcon = 'fas fa-star'; badgeText = state.lang === 'en' ? 'Skill' : 'توانا'; }
  if (type === 'language') { badgeIcon = 'fas fa-language'; badgeText = state.lang === 'en' ? 'Language' : 'زمان'; }

  const badgeHTML = `<div class="item-badge"><i class="${badgeIcon}"></i> ${badgeText}</div>`;

  if (type === 'skill' || type === 'language') {
    const placeholder = type === 'skill' ? (state.lang === 'en' ? 'Skill Name' : 'ناوی توانا') : (state.lang === 'en' ? 'Language' : 'زمان');
    const inputClass = type === 'skill' ? 'inp-skill' : 'inp-lang';
    html = `
      <div class="item-card" id="item-${id}">
        ${badgeHTML}
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
    const ph = state.lang === 'en' ? { t: "Title / Degree", o: "Company / Uni", d: "Date", x: "Description" } : { t: "ناونیشان / بڕوانامە", o: "کۆمپانیا / زانکۆ", d: "بەروار", x: "تێبینی" };
    html = `
      <div class="item-card" id="item-${id}">
        ${badgeHTML}
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
    dob: getVal('dob'),
    marital: getVal('marital'),
    tribe: getVal('tribe'),
    summary: getVal('summary'),
    photo: state.photoBase64,
    photoZoom: getVal('photoZoom') || 100,
    photoX: getVal('photoX') || 50,
    photoY: getVal('photoY') || 50,
    skills: skills,
    languages: languages,
    exp: getItems('experienceContainer'),
    edu: getItems('educationContainer')
  };
}

function renderSkillVisuals(level, type) {
  if (type === 'bar') return `<div class="skill-bar-container"><div class="skill-bar-fill" style="width:${level*20}%"></div></div>`;
  if (type === 'dots') { let dots = ''; for(let i=0; i<5; i++) dots += `<div class="dot ${i<level?'filled':''}"></div>`; return `<div class="dots">${dots}</div>`; }
  let stars = ''; for(let i=0; i<level; i++) stars += '★'; return `<span class="stars">${stars}</span>`;
}

function renderItems(items, title) {
  if (!items.length) return '';
  return `<div class="section-title">${title}</div>${items.map(i => `<div class="item"><div class="item-head"><span>${i.title}</span> <span>${i.date}</span></div><div class="item-sub">${i.org}</div><div class="item-desc">${i.desc}</div></div>`).join('')}`;
}

function renderPreview() {
  try { autoSave(); } catch(e) {}
  const data = getData();
  const t = labels[state.lang];
  const container = document.getElementById('resumePreview');
  
  container.style.fontFamily = document.getElementById('fontSelect').value;
  container.className = document.getElementById('textSizeSelect').value;

  let html = '';
  const sectionEdu = renderItems(data.edu, state.lang === 'en' ? "Education" : "خوێندن");
  const sectionExp = renderItems(data.exp, state.lang === 'en' ? "Experience" : "ئەزموونی کار");

  let skillType = 'stars'; 
  if (state.template === 'creative') skillType = 'dots';
  if (state.template === 'bold') skillType = 'dots';

  // استفاده از Background-image به جای img برای تنظیم دقیق و پشتیبانی 100% در PDF
  const photoHTML = data.photo ? `
    <div class="photo-frame">
        <div class="photo-img" style="background-image: url('${data.photo}'); background-size: ${data.photoZoom}%; background-position: ${data.photoX}% ${data.photoY}%;"></div>
    </div>` : '';

  const skillsListHTML = data.skills.length ? `
    <div class="section-title">${t.skill}</div>
    <div class="main-skills-grid">
      ${data.skills.map(s => `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:5px; gap:10px;">
          <span style="font-weight:bold; min-width:100px; word-break: break-word;">${s.name}</span>
          <div style="flex:1; text-align:end; white-space:nowrap;">${renderSkillVisuals(s.level, skillType)}</div>
        </div>
      `).join('')}
    </div>` : '';

  const languagesListHTML = data.languages.length ? `
    <div class="section-title">${t.lang_section}</div>
    <div class="main-skills-grid">
      ${data.languages.map(s => `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:5px; gap:10px;">
          <span style="font-weight:bold; min-width:100px; word-break: break-word;">${s.name}</span>
          <div style="flex:1; text-align:end; white-space:nowrap;">${renderSkillVisuals(s.level, skillType)}</div>
        </div>
      `).join('')}
    </div>` : '';

  const getSidebarDetails = (darkTheme = false) => {
    const align = state.lang === 'ku' ? 'right' : 'left';
    const textColor = darkTheme ? 'white' : '#444';
    const iconColor = darkTheme ? 'white' : 'var(--sky-blue)'; 

    return `
    <div class="contact-section" style="text-align: ${align};">
      <div class="section-title" style="margin-top:0; ${darkTheme ? 'color:white; border-color:rgba(255,255,255,0.2);' : ''}">${t.contact}</div>
      
      <div style="display:block; margin-bottom:10px; font-size:1em; color:${textColor};">
          <i class="fas fa-phone" style="width:15px; display:inline-block; text-align:center; color:${iconColor};"></i>
          <span style="direction:ltr; display:inline-block;">${data.phone}</span>
      </div>
      <div style="display:block; margin-bottom:10px; font-size:1em; color:${textColor}; word-break:break-all;">
          <i class="fas fa-envelope" style="width:15px; display:inline-block; text-align:center; color:${iconColor};"></i>
          <span>${data.email}</span>
      </div>
      <div style="display:block; margin-bottom:15px; font-size:1em; color:${textColor}; line-height:1.4;">
          <i class="fas fa-map-marker-alt" style="width:15px; display:inline-block; text-align:center; color:${iconColor};"></i>
          <span>${data.address}</span>
      </div>
      
      ${data.dob || data.marital || data.tribe ? `<div class="section-title" style="margin-top:20px; border-top:1px solid rgba(255,255,255,0.2); padding-top:10px; ${darkTheme ? 'color:white;' : ''}">${state.lang==='en'?'Personal':'کەسی'}</div>` : ''}
      
      ${data.dob ? `<div style="display:block; margin-bottom:12px; font-size:1em; color:${textColor};"><strong style="display:inline-block;">${t.dob}:&rlm;</strong><div style="margin-top:3px; opacity:0.9;">${data.dob}</div></div>` : ''}
      ${data.marital ? `<div style="display:block; margin-bottom:12px; font-size:1em; color:${textColor};"><strong style="display:inline-block;">${t.marital}:&rlm;</strong><div style="margin-top:3px; opacity:0.9;">${data.marital}</div></div>` : ''}
      ${data.tribe ? `<div style="display:block; margin-bottom:12px; font-size:1em; color:${textColor};"><strong style="display:inline-block;">${t.tribe}:&rlm;</strong><div style="margin-top:3px; opacity:0.9;">${data.tribe}</div></div>` : ''}
    </div>
  `};

  const getHeaderDetails = () => `
    <div class="contact-row" style="display:flex; justify-content:center; flex-wrap:wrap; gap:10px;">
      ${data.phone ? `<span style="direction:ltr; display:inline-block;">${data.phone}</span>` : ''}
      ${data.email ? `<span style="border-${state.lang === 'ku' ? 'right' : 'left'}:1px solid #ccc; padding-${state.lang === 'ku' ? 'right' : 'left'}:10px;">${data.email}</span>` : ''}
      ${data.address ? `<span style="border-${state.lang === 'ku' ? 'right' : 'left'}:1px solid #ccc; padding-${state.lang === 'ku' ? 'right' : 'left'}:10px;">${data.address}</span>` : ''}
    </div>
    <div class="contact-row" style="display:flex; justify-content:center; flex-wrap:wrap; gap:10px; margin-top:8px; font-size:0.9em; opacity:0.8;">
      ${data.dob ? `<span><strong>${t.dob}:&rlm;</strong> ${data.dob}</span>` : ''}
      ${data.marital ? `<span style="border-${state.lang === 'ku' ? 'right' : 'left'}:1px solid #ccc; padding-${state.lang === 'ku' ? 'right' : 'left'}:10px;"><strong>${t.marital}:&rlm;</strong> ${data.marital}</span>` : ''} 
      ${data.tribe ? `<span style="border-${state.lang === 'ku' ? 'right' : 'left'}:1px solid #ccc; padding-${state.lang === 'ku' ? 'right' : 'left'}:10px;"><strong>${t.tribe}:&rlm;</strong> ${data.tribe}</span>` : ''}
    </div>
  `;

  if (state.template === 'sky') { 
    html = `
      <div class="template-sky">
        <div class="sidebar">
          ${photoHTML}
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
          ${photoHTML}
          ${getSidebarDetails(true)} </div>
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
          ${photoHTML}
          <h1>${data.fullName}</h1>
          <h2>${data.jobTitle}</h2>
          ${getHeaderDetails()}
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
          ${photoHTML}
          <div>
            <h1>${data.fullName}</h1>
            <h2>${data.jobTitle}</h2>
            ${getHeaderDetails()}
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
  else if (state.template === 'minimal') {
    html = `
      <div class="template-minimal">
        <header>
            <h1>${data.fullName}</h1>
            <h2>${data.jobTitle}</h2>
            <div style="margin-top:10px; border-top:1px solid #eee; padding-top:10px;">
               ${getHeaderDetails()}
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
  else if (state.template === 'bold') {
    html = `
      <div class="template-bold">
        <header>
            ${photoHTML}
            <div>
                <h1>${data.fullName}</h1>
                <div style="color:#f1c40f;">${data.jobTitle}</div>
            </div>
        </header>
        <div class="content">
            <div class="left-col">
                ${getSidebarDetails(true)} 
            </div>
            <div class="right-col">
                ${data.summary ? `<div class="section-title">${t.summary}</div><p>${data.summary}</p>` : ''}
                ${sectionEdu}
                ${sectionExp}
                <div style="margin-top:20px;">
                    ${skillsListHTML}
                    ${languagesListHTML}
                </div>
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
            <div style="text-align:end; font-size:0.9em;">
                <div><span style="direction:ltr; display:inline-block;">${data.phone}</span></div>
                <div>${data.email}</div>
                <div>${data.address}</div>
                ${data.dob ? `<div>${data.dob}</div>` : ''}
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
                ${data.marital || data.tribe ? `<hr style="margin:10px 0; opacity:0.2;">` : ''}
                ${data.marital ? `<div style="font-size:0.9em;"><b>${t.marital}:&rlm;</b> ${data.marital}</div>` : ''}
                ${data.tribe ? `<div style="font-size:0.9em;"><b>${t.tribe}:&rlm;</b> ${data.tribe}</div>` : ''}
            </div>
        </div>
      </div>`;
  }

  container.innerHTML = html;
}

function exportPDF() {
  if (window.innerWidth >= 1024) {
    const element = document.getElementById('resumePreview');
    const originalWidth = element.style.width;
    element.style.width = '210mm'; 
    element.style.minHeight = '296.8mm';
    element.style.height = 'auto';

    const opt = {
      margin: 0, filename: 'CV.pdf', image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save().then(() => { element.style.width = originalWidth; });
  } else {
    exportPDFMobile();
  }
}

function exportPDFMobile() {
  const original = document.getElementById('resumePreview');
  const clone = original.cloneNode(true);
  const overlay = document.createElement('div');
  
  Object.assign(overlay.style, {
    position: 'fixed', top: '0', left: '0', width: '100vw', height: '100vh',
    zIndex: '999999', background: '#525659', overflow: 'hidden',
    display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start', padding: '0',
    direction: 'ltr' 
  });

  Object.assign(clone.style, {
    width: '210mm', minWidth: '210mm', height: 'auto', minHeight: '296.8mm',
    transform: 'none', margin: '0', boxShadow: 'none', background: 'white',
    direction: state.lang === 'ku' ? 'rtl' : 'ltr',
    fontFamily: state.lang === 'ku' ? "'Vazirmatn', sans-serif" : ""
  });
  clone.classList.remove('mobile-preview');

  overlay.appendChild(clone);
  document.body.appendChild(overlay);
  
  const originalBodyDir = document.body.style.direction;
  if (state.lang === 'ku') { document.body.style.direction = 'ltr'; }
  window.scrollTo(0, 0);

  const opt = {
    margin: 0, filename: 'CV.pdf', image: { type: 'jpeg', quality: 1 },
    html2canvas: { scale: 2, useCORS: true, scrollY: 0, scrollX: 0, x: 0, y: 0, windowWidth: 794 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };
  
  html2pdf().set(opt).from(clone).save().then(() => { 
      document.body.removeChild(overlay); 
      if (state.lang === 'ku') document.body.style.direction = originalBodyDir;
  }).catch((err) => { 
      console.error(err);
      if(document.body.contains(overlay)) document.body.removeChild(overlay); 
      if (state.lang === 'ku') document.body.style.direction = originalBodyDir;
  });
}

function exportWord() { 
  const data = getData(); const t = labels[state.lang]; const isRTL = state.lang === 'ku'; const styles = `body { font-family: sans-serif; }`;
  let content = `<html ${isRTL ? 'dir="rtl"' : ''}><head><meta charset="utf-8"><style>${styles}</style></head><body><h1>${data.fullName}</h1><p>${data.jobTitle}<br>${data.phone} | ${data.email}</p>${data.summary ? `<h3>${t.summary}</h3><p>${data.summary}</p>` : ''}${data.edu.length ? `<h3>${t.edu}</h3>` : ''}${data.edu.map(i => `<p><b>${i.title}</b>, ${i.org}<br>${i.date}<br>${i.desc}</p>`).join('')}${data.exp.length ? `<h3>${t.exp}</h3>` : ''}${data.exp.map(i => `<p><b>${i.title}</b>, ${i.org}<br>${i.date}<br>${i.desc}</p>`).join('')}${data.skills.length ? `<h3>${t.skill}</h3>` : ''}<ul>${data.skills.map(s => `<li>${s.name} (${s.level}/5)</li>`).join('')}</ul></body></html>`;
  const blob = new Blob(['\ufeff', content], { type: 'application/msword' }); const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = `CV-${data.fullName}.doc`; link.click();
}

function saveProjectData() { try { const data = getData(); const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data)); const downloadAnchorNode = document.createElement('a'); downloadAnchorNode.setAttribute("href", dataStr); downloadAnchorNode.setAttribute("download", "CV_Project.json"); document.body.appendChild(downloadAnchorNode); downloadAnchorNode.click(); downloadAnchorNode.remove(); } catch(e) { alert("Save failed."); } }
function loadProjectData(input) { const file = input.files[0]; if (!file) return; const reader = new FileReader(); reader.onload = function(e) { try { const data = JSON.parse(e.target.result); populateForm(data); document.getElementById('photoControls').style.display = data.photo ? 'flex' : 'none'; document.getElementById('photoControls').style.flexDirection = 'column'; alert("Loaded successfully!"); } catch (err) { alert("Error loading file."); } }; reader.readAsText(file); }
function populateForm(data) { if(!data) return; document.getElementById('educationContainer').innerHTML = ''; document.getElementById('experienceContainer').innerHTML = ''; document.getElementById('skillContainer').innerHTML = ''; document.getElementById('languageContainer').innerHTML = ''; const safeVal = (id, val) => { const el = document.getElementById(id); if(el) el.value = val || ''; }; safeVal('fullName', data.fullName); safeVal('jobTitle', data.jobTitle); safeVal('phone', data.phone); safeVal('email', data.email); safeVal('address', data.address); safeVal('summary', data.summary); safeVal('dob', data.dob); safeVal('marital', data.marital); safeVal('tribe', data.tribe); if(data.photoZoom) safeVal('photoZoom', data.photoZoom); if(data.photoX) safeVal('photoX', data.photoX); if(data.photoY) safeVal('photoY', data.photoY); if (data.photo) { state.photoBase64 = data.photo; document.getElementById('photoControls').style.display = 'flex'; document.getElementById('photoControls').style.flexDirection = 'column'; } const addItemsSafe = (arr, type, fields) => { if(arr && Array.isArray(arr)) { arr.forEach(item => { addItem(type); const container = document.getElementById(`${type}Container`); const card = container.lastElementChild; if(card) { fields.forEach(f => { const inp = card.querySelector(f.sel); if(inp) inp.value = item[f.key] || ''; }); } }); } }; addItemsSafe(data.edu, 'education', [{sel: '.inp-title', key: 'title'}, {sel: '.inp-org', key: 'org'}, {sel: '.inp-date', key: 'date'}, {sel: '.inp-desc', key: 'desc'}]); addItemsSafe(data.exp, 'experience', [{sel: '.inp-title', key: 'title'}, {sel: '.inp-org', key: 'org'}, {sel: '.inp-date', key: 'date'}, {sel: '.inp-desc', key: 'desc'}]); addItemsSafe(data.skills, 'skill', [{sel: '.inp-skill', key: 'name'}, {sel: '.inp-level', key: 'level'}]); addItemsSafe(data.languages, 'language', [{sel: '.inp-lang', key: 'name'}, {sel: '.inp-level', key: 'level'}]); renderPreview(); }
function resetData() { if(confirm("Are you sure?")) { localStorage.removeItem('cv_autosave'); location.reload(); } }
function autoSave() { const data = getData(); localStorage.setItem('cv_autosave', JSON.stringify(data)); }
window.addEventListener('load', () => { const saved = localStorage.getItem('cv_autosave'); if(saved) { try { populateForm(JSON.parse(saved)); } catch(e) {} } else { updateUI(); } });
