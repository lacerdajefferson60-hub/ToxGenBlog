// Cabeçalho e rodapé compartilhados, injetados em todas as páginas.
// Cada página define <body data-page="..."> para marcar o item ativo.
(function () {
  const PAGES = [
    { id: 'home', label: 'home', href: './' },
    { id: 'sobre', label: 'sobre', href: 'sobre' },
    { id: 'guia', label: 'guia experimental', href: 'guia' },
    { id: 'experimento', label: 'experimento', href: 'experimento' },
    { id: 'faq', label: 'FAQ', href: 'faq' },
    { id: 'dicas', label: 'DICAS', href: 'dicas' },
  ];

  const current = document.body.dataset.page || 'home';
  const cur = (id) => (id === current ? ' aria-current="page"' : '');

  const brand = `
    <a class="brand" href="./" aria-label="ToxGen — início">
      <img class="brand-icon" src="assets/logo/logo-mark.svg" alt="" width="46" height="56">
      <span class="brand-name">Tox<b>Gen</b><small>CITOGENÉTICA · EDUCAÇÃO · CIÊNCIA</small></span>
    </a>`;

  const header = document.createElement('header');
  header.className = 'site-header';
  header.innerHTML = `
    <div class="container header-inner">
      ${brand}
      <nav class="mainnav" aria-label="Principal">
        <button class="nav-toggle" aria-expanded="false" aria-controls="menu">☰ menu</button>
        <ul id="menu">
          ${PAGES.map((p) => `<li><a href="${p.href}"${cur(p.id)}>${p.label}</a></li>`).join('')}
        </ul>
      </nav>
    </div>`;
  document.body.prepend(header);

  const footer = document.createElement('footer');
  footer.className = 'site-footer';
  footer.innerHTML = `
    <div class="container">
      <div class="footer-grid">
        <div>
          ${brand}
          <p style="margin-top:14px;max-width:320px">Guia experimental e recursos didáticos para o bioensaio de <em>Allium cepa</em> em testes de citogenotoxicidade.</p>
        </div>
        <div>
          <h4>Navegação</h4>
          <ul>${PAGES.map((p) => `<li><a href="${p.href}">${p.label.charAt(0).toUpperCase() + p.label.slice(1)}</a></li>`).join('')}</ul>
        </div>
        <div>
          <h4>Contato</h4>
          <ul>
            <li><a href="mailto:contato@citogeneticalab.com.br">contato@citogeneticalab.com.br</a></li>
            <li><a href="faq">Dúvidas frequentes</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">© ${new Date().getFullYear()} ToxGen. Conteúdo educacional.</div>
    </div>`;
  document.body.append(footer);

  // Menu mobile
  const nav = header.querySelector('.mainnav');
  const toggle = header.querySelector('.nav-toggle');
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });

  // Sombra do cabeçalho ao rolar
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 8);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Animação de entrada
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('in'));
  }

  // Sumário com destaque da seção atual
  const tocLinks = document.querySelectorAll('.toc a');
  if (tocLinks.length && 'IntersectionObserver' in window) {
    const map = new Map([...tocLinks].map((a) => [a.getAttribute('href').slice(1), a]));
    const so = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          tocLinks.forEach((a) => a.classList.remove('active'));
          map.get(e.target.id)?.classList.add('active');
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    map.forEach((_, id) => { const s = document.getElementById(id); if (s) so.observe(s); });
  }

  // Busca no FAQ
  const search = document.querySelector('.faq-search');
  if (search) {
    const items = document.querySelectorAll('.faq details');
    const empty = document.querySelector('.faq-empty');
    search.addEventListener('input', () => {
      const q = search.value.trim().toLowerCase();
      let shown = 0;
      items.forEach((d) => {
        const hit = !q || d.textContent.toLowerCase().includes(q);
        d.hidden = !hit;
        if (hit) shown++;
      });
      empty.style.display = shown ? 'none' : 'block';
    });
  }

  // Filtro de dicas
  const chips = document.querySelectorAll('.chip[data-filter]');
  chips.forEach((chip) => chip.addEventListener('click', () => {
    chips.forEach((c) => c.setAttribute('aria-pressed', String(c === chip)));
    const cat = chip.dataset.filter;
    document.querySelectorAll('.tip').forEach((t) => {
      t.hidden = cat !== 'all' && t.dataset.cat !== cat;
    });
  }));

  // Calculadora de índices (página experimento)
  const calc = document.querySelector('[data-calc]');
  if (calc) {
    const val = (name) => Math.max(0, Number(calc.querySelector(`[name="${name}"]`).value) || 0);
    const pct = (n, d) => (d > 0 ? ((n / d) * 100).toFixed(2).replace('.', ',') + '%' : '—');
    const set = (key, v) => (calc.querySelector(`[data-out="${key}"]`).textContent = v);
    const update = () => {
      const total = val('total');
      const div = val('pro') + val('meta') + val('ana') + val('telo');
      set('mi', pct(div, total));
      set('ca', pct(val('aberr'), total));
      set('mn', pct(val('micro'), total));
      const ctrl = val('controle');
      const mi = total > 0 ? (div / total) * 100 : 0;
      set('rel', ctrl > 0 && total > 0 ? ((mi / ctrl) * 100).toFixed(1).replace('.', ',') + '%' : '—');
    };
    calc.addEventListener('input', update);
    update();
  }
})();
