// Recursos interativos da página do Guia experimental.
(function () {
  const FIG = 'assets/guia/fig/';
  const PAGES = 19; // a página 20 do PDF está em branco
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const store = {
    get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* armazenamento indisponível */ } },
  };

  // ---------- Conteúdo (transcrito das figuras do guia) ----------
  const STEPS = [
    'Separar os materiais: safranina, HCl 1 M e um recipiente para a safranina.',
    'Retirar a raiz da solução de Carnoy.',
    'Lavar a raiz em água destilada.',
    'Transferir a raiz para o HCl 1 M para promover o amolecimento da raiz.',
    'Aquecer o HCl em capela de exaustão.',
    'Lavar a raiz em água destilada.',
    'Transferir a raiz para a safranina.',
    'Aquecer a safranina na capela de exaustão.',
    'Lavar a raiz em água destilada.',
    'Transferir a raiz para a lâmina de microscopia e secar cuidadosamente o excesso de água com papel absorvente.',
    'Cortar a região apical sobre a lâmina.',
    'Realizar leve pressão para espalhar o material e facilitar a observação.',
  ];

  const PHASES = [
    { id: 'interfase', name: 'Interfase', en: 'Interphase', desc: 'Núcleo íntegro com cromatina difusa (descondensada) e nucléolo visível. É o período de crescimento celular e replicação do DNA, que antecede a divisão celular.' },
    { id: 'profase', name: 'Prófase', en: 'Prophase', desc: 'A cromatina se condensa em cromossomos visíveis. O nucléolo desaparece e a carioteca (núcleo) começa a se desorganizar. Inicia-se a formação do fuso mitótico.' },
    { id: 'metafase', name: 'Metáfase', en: 'Metaphase', desc: 'Os cromossomos estão alinhados na placa equatorial (equador da célula), ligados às fibras do fuso mitótico por seus centrômeros.' },
    { id: 'anafase', name: 'Anáfase', en: 'Anaphase', desc: 'As cromátides-irmãs se separam e migram para polos opostos da célula, puxadas pelas fibras do fuso mitótico.' },
    { id: 'telofase', name: 'Telófase', en: 'Telophase', desc: 'Os cromossomos chegam aos polos opostos da célula e começam a se descondensar. A carioteca se reorganiza ao redor de cada conjunto de cromossomos, formando dois novos núcleos. O nucléolo reaparece e o fuso mitótico desaparece.' },
  ];

  const KINDS = { aneugenica: 'Aneugênica', clastogenica: 'Clastogênica', nuclear: 'Nuclear' };
  const ABNORMAL = [
    { id: 'c-metafase', kind: 'aneugenica', name: 'C-metáfase', en: 'C-metaphase', desc: 'Cromossomos dispersos e desorganizados devido à inibição ou ausência do fuso mitótico, observada principalmente em metáfase.' },
    { id: 'metafase-desorganizada', kind: 'aneugenica', name: 'Metáfase desorganizada', en: 'Disorganized metaphase', desc: 'Disposição irregular dos cromossomos na placa metafásica devido a alterações no fuso mitótico, observada principalmente em metáfase.' },
    { id: 'poliploidia', kind: 'aneugenica', name: 'Poliploidia', en: 'Polyploidy', desc: 'Célula com número de cromossomos superior ao normal (2n = 16) devido a falhas na segregação cromossômica ou na citocinese, identificada principalmente em metáfase.' },
    { id: 'aderencia', kind: 'aneugenica', name: 'Aderência cromossômica', en: 'Chromosomal adhesion', desc: 'Aderência anormal entre cromossomos, dificultando sua separação, mais frequente em metáfase e anáfase.' },
    { id: 'ponte', kind: 'clastogenica', name: 'Ponte cromossômica', en: 'Chromosome bridge', desc: 'Estrutura que conecta dois grupos cromossômicos durante a migração para os polos celulares, observada principalmente em anáfase e telófase.' },
    { id: 'quebra', kind: 'clastogenica', name: 'Quebra cromossômica', en: 'Chromosomal breakage', desc: 'Interrupção da continuidade estrutural do cromossomo, podendo ocorrer da prófase à anáfase.' },
    { id: 'fragmentos', kind: 'clastogenica', name: 'Fragmentos cromossômicos', en: 'Chromosome fragment', desc: 'Pequena porção de cromossomo resultante de quebra cromossômica, geralmente observada em anáfase e telófase.' },
    { id: 'micronucleo', kind: 'nuclear', name: 'Micronúcleo', en: 'Micronucleus', desc: 'Pequena estrutura nuclear, separada do núcleo principal, formada por cromossomos inteiros ou fragmentos cromossômicos que não foram incorporados aos núcleos das células-filhas durante a divisão celular.' },
    { id: 'binucleada', kind: 'nuclear', name: 'Célula binucleada', en: 'Binucleated cell', desc: 'Presença de dois núcleos distintos em uma mesma célula, geralmente decorrente de uma falha na citocinese após a divisão nuclear.' },
    { id: 'lobulado', kind: 'nuclear', name: 'Núcleo lobulado', en: 'Lobulated nucleus', desc: 'Presença de uma ou mais projeções ou lobulações no contorno do núcleo, conferindo-lhe aspecto irregular ou parcialmente segmentado, observada principalmente durante a intérfase.' },
  ];

  // [min, max] em minutos
  const TIMES = {
    neg: { hcl: [6, 7], saf: [1, 2] },
    pos: { hcl: [5, 5], saf: [1, 1] },
    gli: { hcl: [4, 5], saf: [1, 1] },
    dmso: { hcl: [4, 5], saf: [1, 1] },
    nano: { hcl: [5, 5], saf: [1, 1] },
  };

  // ---------- Barra de progresso de leitura ----------
  const bar = $('.read-progress span');
  if (bar) {
    const upd = () => {
      const h = document.documentElement.scrollHeight - innerHeight;
      bar.style.transform = `scaleX(${h > 0 ? Math.min(1, scrollY / h) : 0})`;
    };
    addEventListener('scroll', upd, { passive: true });
    upd();
  }

  // ---------- Lightbox ----------
  const lb = $('[data-lightbox]');
  function openLightbox(src, alt, html = '') {
    $('[data-lightbox-img]', lb).src = src;
    $('[data-lightbox-img]', lb).alt = alt;
    $('[data-lightbox-text]', lb).innerHTML = html;
    lb.showModal();
  }
  $('[data-lightbox-close]', lb).addEventListener('click', () => lb.close());
  lb.addEventListener('click', (e) => { if (e.target === lb) lb.close(); });
  $$('.zoomable img').forEach((img) => {
    img.tabIndex = 0;
    img.setAttribute('role', 'button');
    const caption = img.closest('figure').querySelector('figcaption');
    const open = () => openLightbox(img.src, img.alt, caption ? caption.innerHTML : '');
    img.addEventListener('click', open);
    img.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
  });

  // ---------- Leitor do guia (páginas do PDF) ----------
  const viewer = $('[data-viewer]');
  const pad = (n) => String(n).padStart(2, '0');
  let page = 1;
  const thumbs = $('[data-viewer-thumbs]', viewer);
  for (let i = 1; i <= PAGES; i++) {
    const b = document.createElement('button');
    b.type = 'button';
    b.innerHTML = `<img src="assets/guia/paginas/mini/p${pad(i)}.webp" alt="" loading="lazy"><span>${i}</span>`;
    b.setAttribute('aria-label', `Página ${i}`);
    b.addEventListener('click', () => showPage(i));
    thumbs.append(b);
  }
  function showPage(n) {
    page = Math.min(PAGES, Math.max(1, n));
    const img = $('[data-viewer-img]', viewer);
    img.src = `assets/guia/paginas/p${pad(page)}.webp`;
    img.alt = `Página ${page} do guia`;
    $('[data-viewer-count]', viewer).textContent = `Página ${page} de ${PAGES}`;
    $$('button', thumbs).forEach((b, i) => b.classList.toggle('active', i + 1 === page));
    thumbs.children[page - 1].scrollIntoView({ block: 'nearest', inline: 'center' });
    // pré-carrega a próxima
    if (page < PAGES) new Image().src = `assets/guia/paginas/p${pad(page + 1)}.webp`;
  }
  $$('[data-open-viewer]').forEach((b) => b.addEventListener('click', () => {
    viewer.showModal();
    showPage(Number(b.dataset.openViewer) || page);
  }));
  $('[data-viewer-prev]', viewer).addEventListener('click', () => showPage(page - 1));
  $('[data-viewer-next]', viewer).addEventListener('click', () => showPage(page + 1));
  $('[data-viewer-close]', viewer).addEventListener('click', () => viewer.close());
  viewer.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') showPage(page + 1);
    if (e.key === 'ArrowLeft') showPage(page - 1);
  });
  let touchX = null;
  const stage = $('.viewer-stage', viewer);
  stage.addEventListener('touchstart', (e) => { touchX = e.touches[0].clientX; }, { passive: true });
  stage.addEventListener('touchend', (e) => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 50) showPage(page + (dx < 0 ? 1 : -1));
    touchX = null;
  });

  // ---------- Lista de materiais ----------
  $$('[data-checklist]').forEach((box) => {
    const key = 'toxgen-checklist-' + box.dataset.checklist;
    const inputs = $$('input[type=checkbox]', box);
    const saved = store.get(key) || [];
    inputs.forEach((inp, i) => { inp.checked = !!saved[i]; });
    const count = () => {
      const n = inputs.filter((i) => i.checked).length;
      $('.checklist-count', box).textContent = `${n} de ${inputs.length} separados`;
      box.classList.toggle('done', n === inputs.length);
    };
    box.addEventListener('change', () => { store.set(key, inputs.map((i) => i.checked)); count(); });
    $('[data-reset]', box).addEventListener('click', () => {
      inputs.forEach((i) => { i.checked = false; });
      store.set(key, []);
      count();
    });
    count();
  });

  // ---------- Passo a passo (Figura 4) ----------
  const st = $('[data-stepper]');
  if (st) {
    let cur = 0;
    const dots = $('[data-dots]', st);
    STEPS.forEach((_, i) => {
      const d = document.createElement('button');
      d.type = 'button';
      d.setAttribute('role', 'tab');
      d.setAttribute('aria-label', `Etapa ${i + 1}`);
      d.textContent = i + 1;
      d.addEventListener('click', () => go(i));
      dots.append(d);
    });
    function go(i) {
      cur = (i + STEPS.length) % STEPS.length;
      const img = $('[data-step-img]', st);
      img.src = `${FIG}etapa-${pad(cur + 1)}.webp`;
      img.alt = STEPS[cur];
      $('[data-step-num]', st).textContent = cur + 1;
      $('[data-step-label]', st).textContent = `Etapa ${cur + 1} de ${STEPS.length}`;
      $('[data-step-text]', st).textContent = STEPS[cur];
      $$('button', dots).forEach((d, k) => d.setAttribute('aria-selected', String(k === cur)));
    }
    $('[data-prev]', st).addEventListener('click', () => go(cur - 1));
    $('[data-next]', st).addEventListener('click', () => go(cur + 1));
    st.tabIndex = 0;
    st.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') go(cur + 1);
      if (e.key === 'ArrowLeft') go(cur - 1);
    });
    go(0);
  }

  // ---------- Cronômetro ----------
  const tm = $('[data-timer]');
  if (tm) {
    let stage = 'hcl', start = null, elapsed = 0, raf = null;
    const fmt = (s) => `${pad(Math.floor(s / 60))}:${pad(Math.floor(s % 60))}`;
    const win = () => TIMES[$('[data-timer-group]', tm).value][stage];
    const label = ([a, b]) => (a === b ? `${a} min` : `${a}–${b} min`);
    function render() {
      const [a, b] = win();
      const total = (b + 1) * 60; // escala da barra: até 1 min após o limite
      const s = elapsed + (start ? (Date.now() - start) / 1000 : 0);
      $('[data-timer-clock]', tm).textContent = fmt(s);
      $('[data-timer-target]', tm).textContent = `Alvo: ${label([a, b])}`;
      const w = $('[data-timer-window]', tm);
      w.style.left = `${(a * 60 / total) * 100}%`;
      w.style.width = `${Math.max(1.5, ((b - a) * 60 / total) * 100)}%`;
      $('[data-timer-fill]', tm).style.width = `${Math.min(100, (s / total) * 100)}%`;
      let status = 'Pronto para iniciar.', cls = '';
      if (s > 0) {
        if (s < a * 60) status = `Aguarde… faltam ${fmt(a * 60 - s)} para o tempo mínimo.`;
        else if (s <= b * 60) { status = 'Dentro do tempo indicado — retire a raiz.'; cls = 'ok'; }
        else { status = 'Tempo excedido!'; cls = 'over'; }
      }
      const el = $('[data-timer-status]', tm);
      if (el.textContent !== status) {
        el.textContent = status;
        if (cls && start && navigator.vibrate) navigator.vibrate(200);
      }
      tm.dataset.state = cls;
      if (start) raf = requestAnimationFrame(render);
    }
    const reset = () => { start = null; elapsed = 0; cancelAnimationFrame(raf); $('[data-timer-start]', tm).textContent = 'Iniciar'; render(); };
    $('[data-timer-start]', tm).addEventListener('click', (e) => {
      if (start) { elapsed += (Date.now() - start) / 1000; start = null; e.target.textContent = 'Continuar'; cancelAnimationFrame(raf); }
      else { start = Date.now(); e.target.textContent = 'Pausar'; render(); }
    });
    $('[data-timer-reset]', tm).addEventListener('click', reset);
    $('[data-timer-group]', tm).addEventListener('change', reset);
    $$('[data-timer-stage]', tm).forEach((b) => b.addEventListener('click', () => {
      stage = b.dataset.timerStage;
      $$('[data-timer-stage]', tm).forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      reset();
    }));
    render();
  }

  // ---------- Fases da mitose ----------
  const ph = $('[data-phases]');
  if (ph) {
    const tabs = $('.phase-tabs', ph);
    PHASES.forEach((p, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('role', 'tab');
      b.innerHTML = `<span>${i + 1}</span>${p.name}`;
      b.addEventListener('click', () => sel(i));
      tabs.append(b);
    });
    let cur = 0;
    function sel(i) {
      cur = i;
      const p = PHASES[i];
      const img = $('.phase-img img', ph);
      img.src = `${FIG}fase-${p.id}.webp`;
      img.alt = `Célula de Allium cepa em ${p.name.toLowerCase()}`;
      $('[data-phase-title]', ph).textContent = p.name;
      $('[data-phase-en]', ph).textContent = p.en;
      $('[data-phase-desc]', ph).textContent = p.desc;
      $$('button', tabs).forEach((b, k) => b.setAttribute('aria-selected', String(k === i)));
    }
    $('.phase-img', ph).addEventListener('click', () => {
      const p = PHASES[cur];
      openLightbox(`${FIG}fase-${p.id}.webp`, p.name, `<strong>${p.name}</strong> — ${p.desc}`);
    });
    tabs.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') { sel((cur + 1) % PHASES.length); tabs.children[cur].focus(); }
      if (e.key === 'ArrowLeft') { sel((cur - 1 + PHASES.length) % PHASES.length); tabs.children[cur].focus(); }
    });
    sel(0);
  }

  // ---------- Atlas de anormalidades ----------
  const atlas = $('[data-atlas]');
  if (atlas) {
    atlas.innerHTML = ABNORMAL.map((a) => `
      <button class="ab-card" type="button" data-kind="${a.kind}" data-id="${a.id}">
        <img src="${FIG}ab-${a.id}.webp" alt="${a.name} em célula de Allium cepa" loading="lazy">
        <span class="ab-kind k-${a.kind}">${KINDS[a.kind]}</span>
        <strong>${a.name}</strong>
        <em>${a.en}</em>
      </button>`).join('');
    atlas.addEventListener('click', (e) => {
      const card = e.target.closest('.ab-card');
      if (!card) return;
      const a = ABNORMAL.find((x) => x.id === card.dataset.id);
      openLightbox(`${FIG}ab-${a.id}.webp`, a.name, `<span class="ab-kind k-${a.kind}">${KINDS[a.kind]}</span><h3>${a.name} <em>(${a.en})</em></h3><p>${a.desc}</p>`);
    });
    const chips = $$('[data-ab-filter]');
    chips.forEach((c) => c.addEventListener('click', () => {
      chips.forEach((x) => x.setAttribute('aria-pressed', String(x === c)));
      const k = c.dataset.abFilter;
      $$('.ab-card', atlas).forEach((card) => { card.hidden = k !== 'all' && card.dataset.kind !== k; });
    }));
  }

  // ---------- Quiz ----------
  const qz = $('[data-quiz]');
  if (qz) {
    const pool = [
      ...PHASES.map((p) => ({ img: `${FIG}fase-${p.id}.webp`, answer: p.name, desc: p.desc })),
      ...ABNORMAL.map((a) => ({ img: `${FIG}ab-${a.id}.webp`, answer: a.name, desc: a.desc })),
    ];
    const names = pool.map((p) => p.answer);
    let order = [], idx = -1, right = 0, total = 0, answered = false;
    const shuffle = (arr) => { for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; } return arr; };
    function next() {
      if (++idx >= order.length) { order = shuffle([...pool.keys()]); idx = 0; }
      const q = pool[order[idx]];
      answered = false;
      $('.quiz-img img', qz).src = q.img;
      const opts = shuffle([q.answer, ...shuffle(names.filter((n) => n !== q.answer)).slice(0, 3)]);
      const box = $('[data-quiz-options]', qz);
      box.innerHTML = '';
      opts.forEach((o) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'quiz-opt';
        b.textContent = o;
        b.addEventListener('click', () => {
          if (answered) return;
          answered = true;
          total++;
          const ok = o === q.answer;
          if (ok) right++;
          $$('.quiz-opt', box).forEach((x) => {
            if (x.textContent === q.answer) x.classList.add('right');
            else if (x === b) x.classList.add('wrong');
            x.disabled = true;
          });
          $('[data-quiz-feedback]', qz).innerHTML = `${ok ? '✓ Correto!' : `✗ Era <strong>${q.answer}</strong>.`} ${q.desc}`;
          $('[data-quiz-feedback]', qz).className = 'quiz-feedback ' + (ok ? 'ok' : 'no');
          $('[data-quiz-score]', qz).textContent = `Acertos: ${right} de ${total}`;
        });
        box.append(b);
      });
      $('[data-quiz-feedback]', qz).textContent = '';
      $('[data-quiz-feedback]', qz).className = 'quiz-feedback';
    }
    $('[data-quiz-next]', qz).addEventListener('click', next);
    next();
  }
})();
