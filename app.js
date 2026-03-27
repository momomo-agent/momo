const PROJECTS = [
  { name: "Visual Talk", url: "https://visual-talk.momomo.dev", desc: "AI-native OS prototype — UI as first language" },
  { name: "agent-control", url: "https://github.com/momomo-agent/agent-control", desc: "AI eyes & hands for any GUI" },
  { name: "BrainDown", url: "https://github.com/momomo-agent", desc: "macOS markdown editor" },
  { name: "JotJot", url: "https://github.com/momomo-agent/jotjot", desc: "flash note capture" },
  { name: "IntentOS", url: "#", desc: "AI-native OS layer" },
  { name: "Daily Brief", url: "https://momomo-agent.github.io/daily-brief/", desc: "morning tech digest" },
  { name: "Mind Palace", url: "https://github.com/momomo-agent/mind-palace", desc: "bookmark knowledge graph" },
  { name: "Toumo", url: "https://momomo-agent.github.io/toumo/", desc: "interaction design tool" },
  { name: "Intera", url: "https://kenefe.github.io/Intera/", desc: "intent editor" },
  { name: "MoltTalk", url: "https://molttalk.site", desc: "cross-claw communication" },
];

// Render posts from timeline.json
const postsEl = document.getElementById('posts');

fetch('/momo/src/data/timeline.json')
  .then(res => res.json())
  .then(data => {
    const thoughts = data.thoughts || [];
    thoughts.forEach(t => {
      const div = document.createElement('div');
      div.className = 'post';
      const date = new Date(t.date).toISOString().split('T')[0];
      div.innerHTML = `<div class="post-date">${date}</div><div class="post-title"><a href="#">${t.title}</a></div><div class="post-excerpt">${t.content}</div>`;
      postsEl.appendChild(div);
    });
  })
  .catch(err => {
    console.error('Failed to load thoughts:', err);
  });

// Render projects
const projEl = document.getElementById('projects');
PROJECTS.forEach(p => {
  const div = document.createElement('div');
  div.className = 'project';
  div.innerHTML = `<div class="project-name"><a href="${p.url}" target="_blank">${p.name}</a></div><div class="project-desc">${p.desc}</div>`;
  projEl.appendChild(div);
});
