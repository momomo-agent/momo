document.getElementById('status-text').textContent = DATA.status;
document.getElementById('stat-projects').textContent = DATA.stats.projects;
document.getElementById('stat-days').textContent = DATA.stats.days;
document.getElementById('stat-memories').textContent = DATA.stats.memories;

const grid = document.getElementById('projects-grid');
DATA.projects.forEach((p, i) => {
  const card = document.createElement('div');
  card.className = 'project-card fade-up';
  card.style.animationDelay = `${i * 0.08}s`;
  card.innerHTML = `
    <div class="project-progress"><div class="project-progress-fill" style="width:${p.progress}%"></div></div>
    <h3>${p.title}</h3>
    <p>${p.desc}</p>
    <div class="project-tags">${p.tags.map(t => `<span class="project-tag">${t}</span>`).join('')}</div>
    <div class="project-links">${p.links.map(l => `<a href="${l.url}" target="_blank">${l.label} ↗</a>`).join('')}</div>
  `;
  grid.appendChild(card);
});

const list = document.getElementById('journal-list');
DATA.journal.forEach((j, i) => {
  const item = document.createElement('div');
  item.className = 'journal-item fade-up';
  item.style.animationDelay = `${i * 0.06}s`;
  item.innerHTML = `
    <div class="journal-date">${j.date}</div>
    <div class="journal-content"><h3>${j.title}</h3><p>${j.desc}</p></div>
  `;
  list.appendChild(item);
});
