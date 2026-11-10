(function(){
  const setupScreen = document.getElementById('setup-screen');
  const savedControlsWrap = document.getElementById('savedControlsWrap');
  const typeScreen = document.getElementById('type-screen');
  const resultScreen = document.getElementById('result-screen');
  const voiceSelectWrap = document.getElementById('voiceSelectWrap');
  const sourceText = document.getElementById('sourceText');
  const startBtn = document.getElementById('startBtn');
  const sampleBtn = document.getElementById('sampleBtn');
  const restartBtn = document.getElementById('restartBtn');
  const finishBtn = document.getElementById('finishBtn');
  const tryAgainBtn = document.getElementById('tryAgainBtn');
  const autoBtn = document.getElementById('autoBtn');
  const autoSpeed = document.getElementById('autoSpeed');
  const autoSpeedLabel = document.getElementById('autoSpeedLabel');
  const wordsContainer = document.getElementById('wordsContainer');
  const hiddenInput = document.getElementById('hiddenInput');
  const tooltip = document.getElementById('tooltip');
  const tooltipText = document.getElementById('tooltipText');
  const tooltipSaveBtn = document.getElementById('tooltipSaveBtn');
  const tooltipLiveBtn = document.getElementById('tooltipLiveBtn');
  const selTranslateBtn = document.getElementById('selTranslateBtn');
  const selTranslateBtnLabel = document.getElementById('selTranslateBtnLabel');
  const selTranslateBubble = document.getElementById('selTranslateBubble');
  const selTranslateBubbleText = document.getElementById('selTranslateBubbleText');
  const selTranslateSaveBtn = document.getElementById('selTranslateSaveBtn');
  const selTranslatePlayBtn = document.getElementById('selTranslatePlayBtn');
  const wordPosEl = document.getElementById('wordPos');
  const wordTotalEl = document.getElementById('wordTotal');
  const liveWpmEl = document.getElementById('liveWpm');
  const finalWpmEl = document.getElementById('finalWpm');
  const finalAccEl = document.getElementById('finalAcc');

  const setupTitleEl = document.getElementById('setupTitle');
  const langSelectLabelEl = document.getElementById('langSelectLabel');
  const brandSubEl = document.getElementById('brandSub');
  const wordUnitLabelEl = document.getElementById('wordUnitLabel');
  const wpmLabelEl = document.getElementById('wpmLabel');
  const typeMsgEl = document.getElementById('typeMsg');
  const resultTitleEl = document.getElementById('resultTitle');
  const labelWpmEl = document.getElementById('labelWpm');
  const labelAccEl = document.getElementById('labelAcc');

  const savedToggle = document.getElementById('savedToggle');
  const savedToggleLabel = document.getElementById('savedToggleLabel');
  const savedCountEl = document.getElementById('savedCount');
  const savedOverlay = document.getElementById('savedOverlay');
  const savedPanel = document.getElementById('savedPanel');
  const savedPanelTitleEl = document.getElementById('savedPanelTitle');
  const savedPanelClose = document.getElementById('savedPanelClose');
  const savedListEl = document.getElementById('savedList');
  const reviewSavedBtn = document.getElementById('reviewSavedBtn');
  const exportWordsBtn = document.getElementById('exportWordsBtn');
  const exportWordsBtnLabel = document.getElementById('exportWordsBtnLabel');
  const interactiveReviewBtn = document.getElementById('interactiveReviewBtn');
  const interactiveReviewBtnLabel = document.getElementById('interactiveReviewBtnLabel');
  const savedQuickActions = document.getElementById('savedQuickActions');
  const savedPanelActions = document.getElementById('savedPanelActions');
  const exportWordsBtnPanel = document.getElementById('exportWordsBtnPanel');
  const exportWordsBtnPanelLabel = document.getElementById('exportWordsBtnPanelLabel');
  const interactiveReviewBtnPanel = document.getElementById('interactiveReviewBtnPanel');
  const interactiveReviewBtnPanelLabel = document.getElementById('interactiveReviewBtnPanelLabel');
  const reviewOverlay = document.getElementById('reviewOverlay');
  const reviewCloseBtn = document.getElementById('reviewCloseBtn');
  const reviewProgress = document.getElementById('reviewProgress');
  const reviewStage = document.getElementById('reviewStage');
  const speakToggleBtn = document.getElementById('speakToggleBtn');
  const speakToggleLabel = document.getElementById('speakToggleLabel');
  const voiceSelect = document.getElementById('voiceSelect');
  const listenBtn = document.getElementById('listenBtn');
  const listenBtnLabel = document.getElementById('listenBtnLabel');
  const exportModalOverlay = document.getElementById('exportModalOverlay');
  const exportModalTitle = document.getElementById('exportModalTitle');
  const exportDatesLabelEl = document.getElementById('exportDatesLabel');
  const exportSelectAllBtn = document.getElementById('exportSelectAllBtn');
  const exportDateList = document.getElementById('exportDateList');
  const exportLangLabelEl = document.getElementById('exportLangLabel');
  const exportLangTarget = document.getElementById('exportLangTarget');
  const exportLangTargetLabel = document.getElementById('exportLangTargetLabel');
  const exportLangEs = document.getElementById('exportLangEs');
  const exportFormatLabelEl = document.getElementById('exportFormatLabel');
  const subtitlesToggleBtn = document.getElementById('subtitlesToggleBtn');
  const reviewModalOverlay = document.getElementById('reviewModalOverlay');
  const reviewModalTitle = document.getElementById('reviewModalTitle');
  const reviewDatesLabelEl = document.getElementById('reviewDatesLabel');
  const reviewSelectAllBtn = document.getElementById('reviewSelectAllBtn');
  const reviewDateList = document.getElementById('reviewDateList');
  const reviewModalClose = document.getElementById('reviewModalClose');
  const reviewModalCancelBtn = document.getElementById('reviewModalCancel');
  const reviewModalConfirmBtn = document.getElementById('reviewModalConfirm');
  const subtitlesToggleLabel = document.getElementById('subtitlesToggleLabel');
  const exportModalClose = document.getElementById('exportModalClose');
  const exportModalCancelBtn = document.getElementById('exportModalCancel');
  const exportModalConfirmBtn = document.getElementById('exportModalConfirm');

  const SAMPLE_TOPICS = window.ZELTHA_DATA.SAMPLE_TOPICS;

  const PRECOMPUTED = window.ZELTHA_DATA.PRECOMPUTED;
  // Cada texto de ejemplo es { id, title, text }. Estos mapas permiten saber
  // de qué texto de la lista viene lo que se está practicando.
  const TEXT_ID_BY_TEXT = {};
  const TEXT_ITEM_BY_ID = {};
  SAMPLE_TOPICS.forEach(tp => tp.texts.forEach(x => {
    TEXT_ID_BY_TEXT[x.text.trim()] = x.id;
    TEXT_ITEM_BY_ID[x.id] = x;
  }));

  const LANGS = window.ZELTHA_DATA.LANGS;

  const langOptions = document.getElementById('langOptions');
  let selectedLang = 'en';
  // Estado del selector de voz (declarado aquí, arriba, porque applyLang()
  // llama a populateVoiceSelect() desde el arranque de la página y de lo
  // contrario caería en zona muerta temporal por usar "let" más abajo).
  let voicesList = [];
  let voicesByLangCode = {};

  // ---------- Palabras guardadas para recordar/repasar ----------
  // Se persisten en localStorage, así que sobreviven a recargar la página
  // o cerrar el navegador. Declaradas acá arriba porque applyLang('en')
  // las necesita ya en la primera carga.
  const SAVED_WORDS_STORAGE_KEY = 'zeltha_saved_words_v1';

  function loadSavedWordsFromStorage(){
    try{
      const raw = localStorage.getItem(SAVED_WORDS_STORAGE_KEY);
      if(!raw) return [];
      const parsed = JSON.parse(raw);
      if(!Array.isArray(parsed)) return [];
      // Validamos la forma mínima esperada de cada entrada por las dudas
      // de que el storage tenga datos viejos o corruptos. Las entradas
      // guardadas antes de que existiera el campo savedAt simplemente
      // quedan sin fecha (se agrupan aparte al mostrarlas/exportarlas).
      // Las palabras guardadas antes de existir el campo lang se toman como inglés.
      return parsed
        .filter(sw => sw && typeof sw.key === 'string' && typeof sw.word === 'string')
        .map(sw => (typeof sw.lang === 'string' && sw.lang) ? sw : Object.assign({}, sw, { lang: 'en' }));
    }catch(err){
      console.warn('No se pudieron cargar las palabras guardadas:', err);
      return [];
    }
  }

  // Clave de agrupación por fecha (YYYY-MM-DD) a partir de savedAt.
  // Las palabras guardadas antes de tener este campo caen en 'sin-fecha'.
  const NO_DATE_KEY = 'sin-fecha';
  function dateKeyOf(sw){
    if(sw && typeof sw.savedAt === 'string' && sw.savedAt.length >= 10) return sw.savedAt.slice(0, 10);
    return NO_DATE_KEY;
  }

  function formatDateLabel(dateKey){
    const t = LANGS[selectedLang];
    if(dateKey === NO_DATE_KEY) return t.exportNoDateLabel;
    const d = new Date(dateKey + 'T00:00:00');
    if(isNaN(d.getTime())) return dateKey;
    try{
      return d.toLocaleDateString(t.tl === 'zh-CN' ? 'zh-CN' : (t.htmlLang === 'pt' ? 'pt-BR' : 'en-US'), { day: '2-digit', month: 'short', year: 'numeric' });
    }catch(e){
      return dateKey;
    }
  }

  // Agrupa curSaved() en bloques por fecha, más recientes primero.
  function groupSavedWordsByDate(){
    const groups = new Map();
    curSaved().forEach(sw => {
      const key = dateKeyOf(sw);
      if(!groups.has(key)) groups.set(key, []);
      groups.get(key).push(sw);
    });
    const keys = Array.from(groups.keys()).sort((a, b) => {
      if(a === NO_DATE_KEY) return 1;
      if(b === NO_DATE_KEY) return -1;
      return b.localeCompare(a); // más reciente primero
    });
    return keys.map(key => ({ key, label: formatDateLabel(key), items: groups.get(key) }));
  }

  function persistSavedWords(){
    try{
      localStorage.setItem(SAVED_WORDS_STORAGE_KEY, JSON.stringify(allSavedWords));
    }catch(err){
      console.warn('No se pudieron guardar las palabras (storage lleno o bloqueado):', err);
    }
  }

  // Todas las palabras guardadas, de todos los idiomas: [{ key, word, translation, lang, savedAt }]
  let allSavedWords = loadSavedWordsFromStorage();
  // Solo las del idioma elegido: es lo que ven el panel, el recuerdo y la exportación.
  function curSaved(){
    return allSavedWords.filter(sw => sw.lang === selectedLang);
  }
  let isReviewSession = false;
  let speechEnabled = true; // pronunciación automática de cada palabra
  // La traducción sobre la palabra actual está apagada por defecto: aparece
  // al hacer click/toque en una palabra (y se oculta sola), y se mantiene
  // visible sobre cada palabra mientras el modo AUTOMÁTICO está activo.
  let pendingSelectionText = ''; // frase actualmente seleccionada para traducir (arrastre con mouse/dedo)
  let pendingSelectionWords = []; // palabras individuales de esa selección, para guardarlas por separado
  let currentSelTranslationText = ''; // traducción de esa frase, para poder guardarla

  // Subtítulo fijo en español para botones cuyo texto principal cambia
  // según el idioma de la interfaz (inglés/portugués/chino). Usamos esto
  // en vez de sólo textContent para que el subtítulo sobreviva a los
  // cambios de idioma en vez de ser borrado por ellos.
  const ES_SUBTITLES_MAP = {
    startBtn: 'iniciar',
    sampleBtn: 'texto de ejemplo',
    restartBtn: 'reiniciar',
    finishBtn: 'terminar',
    autoBtn: 'automático',
    tryAgainBtn: 'otro texto',
    reviewSavedBtn: 'revisar palabras guardadas'
  };
  // Mostrar/ocultar subtítulos en español (botón junto a WORDS).
  const ES_SUBS_STORAGE_KEY = 'zeltha_es_subs_v1';
  let esSubsEnabled = true;
  try{ esSubsEnabled = localStorage.getItem(ES_SUBS_STORAGE_KEY) !== '0'; }catch(e){ /* ignore */ }
  function applyEsSubsState(){
    document.body.classList.toggle('no-es-subs', !esSubsEnabled);
    const b = document.getElementById('subtitlesToggleBtn');
    if(b){
      b.classList.toggle('sub-active', esSubsEnabled);
      b.setAttribute('aria-pressed', esSubsEnabled ? 'true' : 'false');
    }
    if(typeof adjustSetupScreenOffset === 'function') adjustSetupScreenOffset();
  }
  applyEsSubsState();

  // Botón de texto de ejemplo: tras cargar un texto pasa a "Otro texto".
  let sampleUsed = false;
  function setBtnLabelWithEsSub(el, mainText, esOverride){
    if(!el) return;
    const esText = esOverride || ES_SUBTITLES_MAP[el.id];
    el.textContent = mainText;
    if(esText){
      el.classList.add('has-es-sub');
      const sub = document.createElement('span');
      sub.className = 'es-sub';
      sub.textContent = esText;
      el.appendChild(sub);
    }
  }

  function applyLang(code){
    selectedLang = code;
    const t = LANGS[code];
    document.body.classList.remove('theme-pt', 'theme-zh');
    if(t.theme) document.body.classList.add(t.theme);
    document.documentElement.lang = t.htmlLang;
    document.title = t.pageTitle;
    if(brandSubEl) brandSubEl.textContent = t.brandSub;
    if(setupTitleEl) setupTitleEl.textContent = t.setupTitle;
    if(langSelectLabelEl) langSelectLabelEl.textContent = t.langSelectLabel;
    sourceText.placeholder = t.placeholder;
    const setupHintEl = document.querySelector('#setup-screen .hint');
    if(setupHintEl) setupHintEl.textContent = t.hint;
    startBtn.dataset.baseLabel = t.startBtn;
    setBtnLabelWithEsSub(startBtn, t.startBtn);
    if(sampleUsed) setBtnLabelWithEsSub(sampleBtn, t.sampleAnotherBtn, 'otro texto');
    else setBtnLabelWithEsSub(sampleBtn, t.sampleBtn);
    hiddenInput.placeholder = t.hiddenInputPlaceholder;
    if(wordUnitLabelEl) wordUnitLabelEl.textContent = t.wordUnitLabel;
    if(wpmLabelEl) wpmLabelEl.textContent = t.wpmLabel;
    // (sin mensaje de ayuda en esta zona)
    setBtnLabelWithEsSub(restartBtn, t.restartBtn);
    if(finishBtn) setBtnLabelWithEsSub(finishBtn, t.finishBtn);
    if(autoBtn) setBtnLabelWithEsSub(autoBtn, t.autoBtn);
    const autoSpeedTagEl = document.getElementById('autoSpeedTag');
    if(autoSpeedTagEl) autoSpeedTagEl.textContent = t.autoSpeedTag;
    if(resultTitleEl) resultTitleEl.textContent = t.resultTitle;
    if(labelWpmEl) labelWpmEl.textContent = t.labelWpm;
    if(labelAccEl) labelAccEl.textContent = t.labelAcc;
    setBtnLabelWithEsSub(tryAgainBtn, t.tryAgainBtn);
    if(savedToggleLabel) savedToggleLabel.textContent = t.savedToggleLabel;
    if(savedPanelTitleEl) savedPanelTitleEl.textContent = t.savedPanelTitle;
    if(exportWordsBtnLabel) exportWordsBtnLabel.textContent = t.exportBtn;
    if(interactiveReviewBtnLabel) interactiveReviewBtnLabel.textContent = t.interactiveBtn;
    if(exportWordsBtnPanelLabel) exportWordsBtnPanelLabel.textContent = t.exportBtn;
    if(interactiveReviewBtnPanelLabel) interactiveReviewBtnPanelLabel.textContent = t.interactiveBtn;
    if(tooltipSaveBtn){
      const isActive = tooltipSaveBtn.classList.contains('saved-active');
      const label = (isActive ? t.saveWordBtnActive : t.saveWordBtn) + ' (Ctrl+S)';
      tooltipSaveBtn.title = label;
      tooltipSaveBtn.setAttribute('aria-label', label);
    }
    refreshSelTranslateSaveState();
    if(speakToggleLabel) speakToggleLabel.textContent = t.speakToggleLabel;
    if(speakToggleBtn) speakToggleBtn.title = t.speakToggleTitle;
    if(listenBtnLabel) listenBtnLabel.textContent = t.listenBtnLabel;
    if(listenBtn) listenBtn.title = t.listenBtnTitle;
    if(exportModalTitle) exportModalTitle.textContent = t.exportByDatesTitle;
    if(exportDatesLabelEl) exportDatesLabelEl.textContent = t.exportDatesLabel;
    if(exportSelectAllBtn) exportSelectAllBtn.textContent = t.exportSelectAll;
    if(exportLangLabelEl) exportLangLabelEl.textContent = t.exportLangLabel;
    if(exportFormatLabelEl) exportFormatLabelEl.textContent = t.exportFormatLabel;
    if(subtitlesToggleLabel) subtitlesToggleLabel.textContent = t.subtitlesToggleLabel;
    if(reviewModalTitle) reviewModalTitle.textContent = t.reviewByDatesTitle;
    if(reviewDatesLabelEl) reviewDatesLabelEl.textContent = t.reviewDatesLabel;
    if(reviewSelectAllBtn) reviewSelectAllBtn.textContent = t.exportSelectAll;
    if(reviewModalCancelBtn) reviewModalCancelBtn.textContent = t.exportModalCancel;
    if(reviewModalConfirmBtn) reviewModalConfirmBtn.textContent = t.reviewModalConfirm;
    if(subtitlesToggleBtn) subtitlesToggleBtn.title = t.subtitlesToggleTitle;
    if(exportLangTargetLabel) exportLangTargetLabel.textContent = t.exportLangTargetLabel;
    if(exportModalCancelBtn) exportModalCancelBtn.textContent = t.exportModalCancel;
    if(exportModalConfirmBtn) exportModalConfirmBtn.textContent = t.exportModalConfirm;
    if(selTranslateBtnLabel) selTranslateBtnLabel.textContent = t.selTranslateBtn;
    if(selTranslatePlayBtn){
      selTranslatePlayBtn.title = t.selTranslatePlayTitle;
      selTranslatePlayBtn.setAttribute('aria-label', t.selTranslatePlayTitle);
    }
    // Las palabras guardadas se muestran por idioma: al cambiar, se recarga la lista.
    renderSavedWordsPanel();
    updateReviewSavedBtn();
    langOptions.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === code);
    });
    populateVoiceSelect();
    adjustSetupScreenOffset();
  }

  // En la pantalla de entrada, la barra de botones de arriba (traducir
  // página, efectos, palabras) está en position:fixed y puede ocupar más
  // o menos alto según el idioma de la interfaz o si se envuelve en más
  // de una fila. Este ajuste mide su altura real y empuja el contenido
  // de #setup-screen lo necesario para que nunca quede tapado.
  function adjustSetupScreenOffset(){
    if(!setupScreen || !savedControlsWrap) return;
    if(window.innerWidth > 600){
      setupScreen.style.marginTop = '';
      return;
    }
    const wrapRect = savedControlsWrap.getBoundingClientRect();
    const gap = 18;
    const needed = wrapRect.bottom + gap;
    const currentRect = setupScreen.getBoundingClientRect();
    const currentMarginTop = parseFloat(getComputedStyle(setupScreen).marginTop) || 0;
    const topWithoutMargin = currentRect.top - currentMarginTop;
    const desiredMarginTop = Math.max(0, needed - topWithoutMargin);
    setupScreen.style.marginTop = desiredMarginTop + 'px';
  }
  window.addEventListener('resize', adjustSetupScreenOffset);
  window.addEventListener('load', adjustSetupScreenOffset);

  langOptions.addEventListener('click', (e) => {
    const btn = e.target.closest('.lang-btn');
    if(!btn) return;
    applyLang(btn.dataset.lang);
    refreshSaveButtonState(); // el botón de guardar depende del idioma elegido
  });

  applyLang('en');

  let words = [];
  let currentIndex = 0;
  let correctChars = 0;
  let incorrectChars = 0;
  let startTime = null;
  const translationCache = {};

  function savedKey(word){
    const c = cleanWord(word);
    return (c || word).toLowerCase();
  }

  function isWordSaved(word){
    return curSaved().some(sw => sw.key === savedKey(word));
  }

  function addSavedWord(word, translation){
    const key = savedKey(word);
    if(!key || curSaved().some(sw => sw.key === key)) return;
    allSavedWords.push({ key, word, translation: translation || '', lang: selectedLang, savedAt: new Date().toISOString() });
    persistSavedWords();
    renderSavedWordsPanel();
  }

  function removeSavedWord(key){
    allSavedWords = allSavedWords.filter(sw => !(sw.key === key && sw.lang === selectedLang));
    persistSavedWords();
    renderSavedWordsPanel();
    refreshSaveButtonState();
  }

  async function toggleCurrentWordSaved(){
    const idx = getTooltipIndex();
    if(idx >= words.length) return;
    const word = words[idx];
    const key = savedKey(word);
    if(curSaved().some(sw => sw.key === key)){
      removeSavedWord(key);
    }else{
      const translation = (liveShownIndex === idx && liveShownTranslation)
        ? liveShownTranslation
        : await getTranslation(word, idx);
      addSavedWord(word, translation && translation !== '?' ? translation : '');
    }
    refreshSaveButtonState();
  }

  function refreshSaveButtonState(){
    if(!tooltipSaveBtn) return;
    const idx = getTooltipIndex();
    if(liveShownIndex !== null && liveShownIndex !== idx) resetLiveState();
    const t = LANGS[selectedLang];
    const saved = idx < words.length && isWordSaved(words[idx]);
    tooltipSaveBtn.classList.toggle('saved-active', saved);
    const label = (saved ? t.saveWordBtnActive : t.saveWordBtn) + ' (Ctrl+S)';
    tooltipSaveBtn.title = label;
    tooltipSaveBtn.setAttribute('aria-label', label);
  }

  function renderSavedWordsPanel(){
    const t = LANGS[selectedLang];
    if(savedCountEl) savedCountEl.textContent = curSaved().length;
    if(exportWordsBtn) exportWordsBtn.disabled = curSaved().length === 0;
    if(interactiveReviewBtn) interactiveReviewBtn.disabled = curSaved().length === 0;
    if(exportWordsBtnPanel) exportWordsBtnPanel.disabled = curSaved().length === 0;
    if(interactiveReviewBtnPanel) interactiveReviewBtnPanel.disabled = curSaved().length === 0;
    if(!savedListEl) return;
    savedListEl.innerHTML = '';
    if(curSaved().length === 0){
      const p = document.createElement('div');
      p.className = 'saved-empty';
      p.textContent = t.savedEmpty;
      savedListEl.appendChild(p);
      return;
    }
    // Agrupamos por bloques de fecha (más reciente primero) para que
    // sea fácil ubicar cuándo se guardó cada palabra.
    groupSavedWordsByDate().forEach(group => {
      const groupEl = document.createElement('div');
      groupEl.className = 'saved-date-group';
      const header = document.createElement('div');
      header.className = 'saved-date-header';
      const labelEl = document.createElement('span');
      labelEl.className = 'date-label';
      labelEl.textContent = group.label;
      const countEl = document.createElement('span');
      countEl.className = 'date-count';
      countEl.textContent = group.items.length;
      header.appendChild(labelEl);
      header.appendChild(countEl);
      groupEl.appendChild(header);

      group.items.forEach(sw => {
        const row = document.createElement('div');
        row.className = 'saved-item';
        const textWrap = document.createElement('div');
        textWrap.className = 'saved-item-text';
        const wEl = document.createElement('div');
        wEl.className = 'w';
        wEl.textContent = sw.word;
        textWrap.appendChild(wEl);
        if(sw.translation){
          const trEl = document.createElement('div');
          trEl.className = 'tr';
          trEl.textContent = sw.translation;
          textWrap.appendChild(trEl);
        }
        row.appendChild(textWrap);
        const rmBtn = document.createElement('button');
        rmBtn.type = 'button';
        rmBtn.textContent = '✕';
        rmBtn.title = t.removeSavedTitle;
        rmBtn.addEventListener('click', () => removeSavedWord(sw.key));
        row.appendChild(rmBtn);
        groupEl.appendChild(row);
      });

      savedListEl.appendChild(groupEl);
    });
  }

  function updateReviewSavedBtn(){
    if(!reviewSavedBtn) return;
    const t = LANGS[selectedLang];
    if(curSaved().length > 0){
      reviewSavedBtn.hidden = false;
      setBtnLabelWithEsSub(reviewSavedBtn, `${t.reviewSavedBtn} (${curSaved().length})`);
    }else{
      reviewSavedBtn.hidden = true;
    }
  }

  // ---------- Exportar palabras guardadas, por bloques de fecha ----------
  // Formatos: Excel (.xlsx), CSV o texto (.txt), con 2 bloques por fila.
  function csvEscape(val){
    const s = String(val == null ? '' : val);
    if(/[",\n]/.test(s)) return '"' + s.replace(/"/g, '""') + '"';
    return s;
  }

  // Cada fila lleva EXPORT_PAIRS_PER_ROW bloques (inglés | español) separados
  // por una columna vacía:  EN, ES, (vacía), EN, ES
  const EXPORT_PAIRS_PER_ROW = 2;

  function buildExportMatrix(items, includeTarget, includeEs){
    const t = LANGS[selectedLang];
    const langs = [];
    if(includeTarget) langs.push({ head: t.exportLangTargetLabel, get: it => it.word });
    if(includeEs) langs.push({ head: 'Español', get: it => it.translation });
    const header = [];
    for(let g = 0; g < EXPORT_PAIRS_PER_ROW; g++){
      if(g > 0) header.push('');           // columna vacía separadora
      langs.forEach(l => header.push(l.head));
    }
    const rows = [header];
    for(let i = 0; i < items.length; i += EXPORT_PAIRS_PER_ROW){
      const row = [];
      for(let g = 0; g < EXPORT_PAIRS_PER_ROW; g++){
        const it = items[i + g];
        if(g > 0) row.push('');            // columna vacía separadora
        langs.forEach(l => row.push(it ? (l.get(it) || '') : ''));
      }
      rows.push(row);
    }
    return rows;
  }

  function buildExportCsv(matrix){
    // BOM al inicio para que Excel muestre bien tildes y ñ.
    return '\ufeff' + matrix.map(r => r.map(csvEscape).join(',')).join('\r\n');
  }

  function buildExportTxt(matrix){
    return matrix.map(r => r.map(v => String(v == null ? '' : v).replace(/[\t\r\n]+/g, ' ')).join('\t')).join('\r\n');
  }

  // ----- Excel (.xlsx) sin librerías: un ZIP "sin compresión" con el XML mínimo -----
  const CRC_TABLE = (() => {
    const tbl = new Uint32Array(256);
    for(let n = 0; n < 256; n++){
      let c = n;
      for(let k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
      tbl[n] = c >>> 0;
    }
    return tbl;
  })();
  function crc32(bytes){
    let c = 0xFFFFFFFF;
    for(let i = 0; i < bytes.length; i++) c = CRC_TABLE[(c ^ bytes[i]) & 0xFF] ^ (c >>> 8);
    return (c ^ 0xFFFFFFFF) >>> 0;
  }
  function zipStore(files){
    const enc = new TextEncoder();
    const chunks = [];
    const central = [];
    let offset = 0;
    files.forEach(f => {
      const name = enc.encode(f.name);
      const data = enc.encode(f.content);
      const crc = crc32(data);
      const lh = new DataView(new ArrayBuffer(30));
      lh.setUint32(0, 0x04034b50, true); lh.setUint16(4, 20, true); lh.setUint16(6, 0x0800, true);
      lh.setUint16(8, 0, true); lh.setUint16(10, 0, true); lh.setUint16(12, 0x21, true);
      lh.setUint32(14, crc, true); lh.setUint32(18, data.length, true); lh.setUint32(22, data.length, true);
      lh.setUint16(26, name.length, true); lh.setUint16(28, 0, true);
      chunks.push(new Uint8Array(lh.buffer), name, data);
      const ch = new DataView(new ArrayBuffer(46));
      ch.setUint32(0, 0x02014b50, true); ch.setUint16(4, 20, true); ch.setUint16(6, 20, true);
      ch.setUint16(8, 0x0800, true); ch.setUint16(10, 0, true); ch.setUint16(12, 0, true); ch.setUint16(14, 0x21, true);
      ch.setUint32(16, crc, true); ch.setUint32(20, data.length, true); ch.setUint32(24, data.length, true);
      ch.setUint16(28, name.length, true); ch.setUint32(42, offset, true);
      central.push(new Uint8Array(ch.buffer), name);
      offset += 30 + name.length + data.length;
    });
    let cdSize = 0;
    central.forEach(c => { cdSize += c.length; });
    const end = new DataView(new ArrayBuffer(22));
    end.setUint32(0, 0x06054b50, true);
    end.setUint16(8, files.length, true); end.setUint16(10, files.length, true);
    end.setUint32(12, cdSize, true); end.setUint32(16, offset, true);
    const all = chunks.concat(central, [new Uint8Array(end.buffer)]);
    const total = all.reduce((n, c) => n + c.length, 0);
    const out = new Uint8Array(total);
    let pos = 0;
    all.forEach(c => { out.set(c, pos); pos += c.length; });
    return out;
  }
  function xmlEsc(v){
    return String(v == null ? '' : v)
      .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '')
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function xlsxColName(i){
    let n = i + 1, s = '';
    while(n > 0){ const m = (n - 1) % 26; s = String.fromCharCode(65 + m) + s; n = Math.floor((n - 1) / 26); }
    return s;
  }
  function buildExportXlsx(matrix){
    const header = matrix[0];
    const cols = header.map((h, i) => {
      const isSep = h === '';
      return `<col min="${i + 1}" max="${i + 1}" width="${isSep ? 3 : 24}" customWidth="1"/>`;
    }).join('');
    const rowsXml = matrix.map((row, r) => {
      const cells = row.map((v, c) => {
        if(v === '' || v == null) return '';
        const ref = xlsxColName(c) + (r + 1);
        return `<c r="${ref}" t="inlineStr"${r === 0 ? ' s="1"' : ''}><is><t xml:space="preserve">${xmlEsc(v)}</t></is></c>`;
      }).join('');
      return `<row r="${r + 1}">${cells}</row>`;
    }).join('');
    const head = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n';
    const ns = 'http://schemas.openxmlformats.org/spreadsheetml/2006/main';
    return zipStore([
      { name: '[Content_Types].xml', content: head + '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/></Types>' },
      { name: '_rels/.rels', content: head + '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>' },
      { name: 'xl/workbook.xml', content: head + `<workbook xmlns="${ns}" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="Palabras" sheetId="1" r:id="rId1"/></sheets></workbook>` },
      { name: 'xl/_rels/workbook.xml.rels', content: head + '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>' },
      { name: 'xl/styles.xml', content: head + `<styleSheet xmlns="${ns}"><fonts count="2"><font><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="11"/><name val="Calibri"/></font></fonts><fills count="2"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill></fills><borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="2"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf numFmtId="0" fontId="1" fillId="0" borderId="0" xfId="0" applyFont="1"/></cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>` },
      { name: 'xl/worksheets/sheet1.xml', content: head + `<worksheet xmlns="${ns}"><sheetViews><sheetView workbookViewId="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews><cols>${cols}</cols><sheetData>${rowsXml}</sheetData></worksheet>` }
    ]);
  }

  async function shareOrDownload(content, fileName, mimeType, shareTitle){
    const blob = new Blob([content], { type: mimeType });
    try{
      const file = new File([blob], fileName, { type: mimeType });
      if(navigator.canShare && navigator.canShare({ files: [file] })){
        await navigator.share({ files: [file], title: shareTitle });
        return;
      }
    }catch(err){
      if(err && err.name === 'AbortError') return;
    }
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
  }

  let exportSelectedDateKeys = new Set();

  function openExportModal(){
    if(curSaved().length === 0 || !exportModalOverlay) return;
    const groups = groupSavedWordsByDate();
    exportSelectedDateKeys = new Set(groups.map(g => g.key)); // todas seleccionadas por defecto
    renderExportDateList(groups);
    exportModalOverlay.hidden = false;
  }

  function closeExportModal(){
    if(exportModalOverlay) exportModalOverlay.hidden = true;
  }

  function renderExportDateList(groups){
    if(!exportDateList) return;
    exportDateList.innerHTML = '';
    groups.forEach(group => {
      const row = document.createElement('label');
      row.className = 'export-date-row';
      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.checked = exportSelectedDateKeys.has(group.key);
      cb.addEventListener('change', () => {
        if(cb.checked) exportSelectedDateKeys.add(group.key);
        else exportSelectedDateKeys.delete(group.key);
      });
      const labelSpan = document.createElement('span');
      labelSpan.textContent = group.label;
      const countSpan = document.createElement('span');
      countSpan.className = 'date-count';
      countSpan.textContent = group.items.length;
      row.appendChild(cb);
      row.appendChild(labelSpan);
      row.appendChild(countSpan);
      exportDateList.appendChild(row);
    });
  }

  if(exportSelectAllBtn){
    exportSelectAllBtn.addEventListener('click', () => {
      const groups = groupSavedWordsByDate();
      const allSelected = groups.every(g => exportSelectedDateKeys.has(g.key));
      exportSelectedDateKeys = allSelected ? new Set() : new Set(groups.map(g => g.key));
      renderExportDateList(groups);
    });
  }

  async function confirmExport(){
    const t = LANGS[selectedLang];
    const groups = groupSavedWordsByDate().filter(g => exportSelectedDateKeys.has(g.key));
    const items = groups.flatMap(g => g.items);
    if(items.length === 0){
      alert(t.exportNoWordsSelected);
      return;
    }
    const includeTarget = !exportLangTarget || exportLangTarget.checked;
    const includeEs = !exportLangEs || exportLangEs.checked;
    if(!includeTarget && !includeEs){
      alert(t.exportNoLangSelected);
      return;
    }
    const matrix = buildExportMatrix(items, includeTarget, includeEs);
    const chosen = document.querySelector('input[name="exportFormat"]:checked');
    const format = chosen ? chosen.value : 'xlsx';
    if(format === 'csv'){
      await shareOrDownload(buildExportCsv(matrix), 'palabras-zeltha.csv', 'text/csv;charset=utf-8', t.exportShareTitle);
    }else if(format === 'txt'){
      await shareOrDownload('\ufeff' + buildExportTxt(matrix), 'palabras-zeltha.txt', 'text/plain;charset=utf-8', t.exportShareTitle);
    }else{
      await shareOrDownload(buildExportXlsx(matrix), 'palabras-zeltha.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', t.exportShareTitle);
    }
    closeExportModal();
  }

  if(exportWordsBtn) exportWordsBtn.addEventListener('click', openExportModal);
  if(exportWordsBtnPanel) exportWordsBtnPanel.addEventListener('click', openExportModal);
  if(exportModalClose) exportModalClose.addEventListener('click', closeExportModal);
  if(exportModalCancelBtn) exportModalCancelBtn.addEventListener('click', closeExportModal);
  if(exportModalConfirmBtn) exportModalConfirmBtn.addEventListener('click', confirmExport);
  if(exportModalOverlay) exportModalOverlay.addEventListener('click', (e) => { if(e.target === exportModalOverlay) closeExportModal(); });

  // ---------- Recuerdo interactivo: animación + quiz de repaso ----------
  const FILLER_TRANSLATIONS = ['casa','tiempo','viaje','trabajo','comida','historia','amigo','ciudad','mañana','recuerdo','camino','idea','fuego','puerta','río','montaña','silencio','espejo','jardín','sueño'];
  const REVIEW_COLOR_PALETTE = ['#ff8a3d','#ff4d9e','#ffd93d','#8a7bff','#3cdc6e','#4dc9ff','#ff6b6b','#c792ff','#7fffd4','#ffb347'];

  function randomReviewColor(){
    return REVIEW_COLOR_PALETTE[Math.floor(Math.random() * REVIEW_COLOR_PALETTE.length)];
  }
  function shuffleArr(arr){
    const a = arr.slice();
    for(let i = a.length - 1; i > 0; i--){
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  let reviewQueue = [];
  let originalReviewPool = null; // palabras con las que empezó el repaso (antes de reintentar)
  let reviewMissed = [];         // palabras falladas en la sesión actual
  let reviewPos = 0;
  let reviewScore = 0;
  let reviewAdvanceTimer = null;

  // ---------- Voz y controles del repaso interactivo ----------
  const REVIEW_TRANSLATION_SPEECH_LANG = 'es-ES';
  let reviewMuted = false;
  try{ reviewMuted = localStorage.getItem('zeltha_review_muted') === '1'; }catch(e){ /* ignore */ }
  let reviewSpeed = 1; // multiplicador de velocidad (voz + tiempos de espera)
  try{
    const sv = parseFloat(localStorage.getItem('zeltha_review_speed'));
    if(sv >= 0.5 && sv <= 2) reviewSpeed = sv;
  }catch(e){ /* ignore */ }
  let reviewGen = 0; // se incrementa al saltar/cerrar/cambiar de paso: invalida callbacks viejos

  const SVG_SPEAKER = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>';
  const SVG_SPEAKER_OFF = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>';
  const SVG_PLAY = '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="8 4 20 12 8 20 8 4"></polygon></svg>';
  const SVG_SKIP = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 4 15 12 5 20 5 4"></polygon><line x1="19" y1="5" x2="19" y2="19"></line></svg>';

  const reviewBoxEl = document.getElementById('reviewBox');
  const reviewControls = document.createElement('div');
  reviewControls.className = 'review-controls';
  reviewControls.hidden = true;
  const reviewMuteBtn = document.createElement('button');
  reviewMuteBtn.type = 'button';
  reviewMuteBtn.className = 'review-ctrl-btn';
  const reviewSkipBtn = document.createElement('button');
  reviewSkipBtn.type = 'button';
  reviewSkipBtn.className = 'review-ctrl-btn';
  const reviewSpeedWrap = document.createElement('label');
  reviewSpeedWrap.className = 'review-speed';
  const reviewSpeedText = document.createElement('span');
  const reviewSpeedInput = document.createElement('input');
  reviewSpeedInput.type = 'range';
  reviewSpeedInput.min = '0.5'; reviewSpeedInput.max = '2'; reviewSpeedInput.step = '0.25';
  reviewSpeedInput.value = String(reviewSpeed);
  const reviewSpeedVal = document.createElement('span');
  reviewSpeedVal.className = 'review-speed-val';
  function formatSpeed(v){ return (Math.round(v * 100) / 100) + '×'; }
  reviewSpeedVal.textContent = formatSpeed(reviewSpeed);
  reviewSpeedInput.addEventListener('input', () => {
    reviewSpeed = parseFloat(reviewSpeedInput.value) || 1;
    reviewSpeedVal.textContent = formatSpeed(reviewSpeed);
    try{ localStorage.setItem('zeltha_review_speed', String(reviewSpeed)); }catch(e){ /* ignore */ }
  });
  reviewSpeedWrap.appendChild(reviewSpeedText);
  reviewSpeedWrap.appendChild(reviewSpeedInput);
  reviewSpeedWrap.appendChild(reviewSpeedVal);
  reviewControls.appendChild(reviewSpeedWrap);
  reviewControls.appendChild(reviewMuteBtn);
  reviewControls.appendChild(reviewSkipBtn);
  if(reviewBoxEl) reviewBoxEl.appendChild(reviewControls);

  function refreshReviewMuteBtn(){
    const t = LANGS[selectedLang] || {};
    const label = reviewMuted ? t.reviewUnmuteTitle : t.reviewMuteTitle;
    reviewMuteBtn.innerHTML = (reviewMuted ? SVG_SPEAKER_OFF : SVG_SPEAKER) + '<span>' + (label || '') + '</span>';
    reviewMuteBtn.classList.toggle('is-muted', reviewMuted);
    reviewMuteBtn.title = label || '';
    reviewMuteBtn.setAttribute('aria-label', label || '');
    reviewMuteBtn.setAttribute('aria-pressed', reviewMuted ? 'true' : 'false');
  }
  // mute: mostrar/ocultar botón de silenciar. skip: mostrar/ocultar "saltar a preguntas".
  function setReviewControls(showMute, showSkip, showSpeed){
    const t = LANGS[selectedLang] || {};
    reviewMuteBtn.hidden = !showMute;
    reviewSkipBtn.hidden = !showSkip;
    reviewSpeedWrap.hidden = !showSpeed;
    reviewSpeedText.textContent = t.reviewSpeedLabel || '';
    reviewSpeedWrap.title = t.reviewSpeedLabel || '';
    reviewSkipBtn.innerHTML = SVG_SKIP + '<span>' + (t.reviewSkipBtn || '') + '</span>';
    reviewSkipBtn.title = t.reviewSkipBtn || '';
    reviewSkipBtn.setAttribute('aria-label', t.reviewSkipBtn || '');
    refreshReviewMuteBtn();
    reviewControls.hidden = !(showMute || showSkip || showSpeed);
  }
  function hideReviewControls(){ reviewControls.hidden = true; }

  reviewMuteBtn.addEventListener('click', () => {
    reviewMuted = !reviewMuted;
    try{ localStorage.setItem('zeltha_review_muted', reviewMuted ? '1' : '0'); }catch(e){ /* ignore */ }
    if(reviewMuted) cancelSpeech();
    refreshReviewMuteBtn();
  });
  reviewSkipBtn.addEventListener('click', () => {
    reviewGen++;
    if(reviewAdvanceTimer){ clearTimeout(reviewAdvanceTimer); reviewAdvanceTimer = null; }
    cancelSpeech();
    reviewPos = 0;
    reviewScore = 0;
    reviewMissed = [];
    runReviewQuizStep();
  });

  function getReviewWordLang(){
    return (LANGS[selectedLang] && LANGS[selectedLang].speechLang) || 'en-US';
  }

  // Habla un texto y devuelve una promesa que se resuelve cuando termina
  // (o de inmediato si está silenciado / no hay síntesis de voz).
  // force=true ignora el silencio (botón de repetir pronunciación).
  function reviewSpeak(text, lang, force){
    return new Promise((resolve) => {
      if((reviewMuted && !force) || !text || !('speechSynthesis' in window)){ resolve(); return; }
      const myGen = reviewGen;
      let done = false;
      let guard = null;
      const finish = () => { if(done) return; done = true; if(guard) clearTimeout(guard); resolve(); };
      guard = setTimeout(finish, 9000); // por si el navegador nunca dispara onend
      // pequeña pausa: algunos navegadores ignoran speak() justo después de cancel()
      setTimeout(() => {
        if(myGen !== reviewGen){ finish(); return; }
        speakUtterance(text, lang, Math.max(0.5, Math.min(2, 0.95 * reviewSpeed))).then(finish);
      }, 110);
    });
  }

  function setReviewProgress(text){
    if(reviewProgress) reviewProgress.textContent = text;
  }

  function openReviewOverlay(){
    if(reviewOverlay) reviewOverlay.classList.add('open');
  }
  function closeReviewOverlay(){
    if(reviewOverlay) reviewOverlay.classList.remove('open');
    if(reviewAdvanceTimer){ clearTimeout(reviewAdvanceTimer); reviewAdvanceTimer = null; }
    reviewGen++;
    cancelSpeech();
    hideReviewControls();
  }

  // Elegir qué fechas repasar: si solo hay un día guardado, empieza directo;
  // si hay varios, abre el selector de fechas (todas marcadas por defecto).
  let reviewSelectedDateKeys = new Set();

  // mode: 'recall' (recuerdo interactivo) o 'typing' (repasar tecleando).
  let reviewModalMode = 'recall';
  function launchReview(mode, items){
    if(mode === 'typing'){
      isReviewSession = true;
      currentPrecomputedGlosses = null;
      startTypingSession(items.map(sw => sw.word));
      setQuickActionsAuto(true);
    }else{
      startInteractiveReview(items);
    }
  }
  function openReviewModal(mode){
    reviewModalMode = mode === 'typing' ? 'typing' : 'recall';
    if(curSaved().length === 0) return;
    const groups = groupSavedWordsByDate();
    if(!reviewModalOverlay){
      launchReview(reviewModalMode, curSaved());
      return;
    }
    const t = LANGS[selectedLang];
    if(reviewModalTitle) reviewModalTitle.textContent = reviewModalMode === 'typing' ? t.reviewSavedBtn : t.reviewByDatesTitle;
    reviewSelectedDateKeys = new Set(groups.map(g => g.key));
    renderReviewDateList(groups);
    reviewModalOverlay.hidden = false;
  }
  function closeReviewModal(){
    if(reviewModalOverlay) reviewModalOverlay.hidden = true;
  }
  function renderReviewDateList(groups){
    if(!reviewDateList) return;
    reviewDateList.innerHTML = '';
    groups.forEach(group => {
      const row = document.createElement('label');
      row.className = 'export-date-row';
      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.checked = reviewSelectedDateKeys.has(group.key);
      cb.addEventListener('change', () => {
        if(cb.checked) reviewSelectedDateKeys.add(group.key);
        else reviewSelectedDateKeys.delete(group.key);
      });
      const labelSpan = document.createElement('span');
      labelSpan.textContent = group.label;
      const countSpan = document.createElement('span');
      countSpan.className = 'date-count';
      countSpan.textContent = group.items.length;
      row.appendChild(cb);
      row.appendChild(labelSpan);
      row.appendChild(countSpan);
      reviewDateList.appendChild(row);
    });
  }
  if(reviewSelectAllBtn){
    reviewSelectAllBtn.addEventListener('click', () => {
      const groups = groupSavedWordsByDate();
      const allSelected = groups.every(g => reviewSelectedDateKeys.has(g.key));
      reviewSelectedDateKeys = allSelected ? new Set() : new Set(groups.map(g => g.key));
      renderReviewDateList(groups);
    });
  }
  if(reviewModalConfirmBtn){
    reviewModalConfirmBtn.addEventListener('click', () => {
      const t = LANGS[selectedLang];
      const items = groupSavedWordsByDate().filter(g => reviewSelectedDateKeys.has(g.key)).flatMap(g => g.items);
      if(items.length === 0){ alert(t.reviewNoWordsSelected); return; }
      closeReviewModal();
      launchReview(reviewModalMode, items);
    });
  }
  if(reviewModalClose) reviewModalClose.addEventListener('click', closeReviewModal);
  if(reviewModalCancelBtn) reviewModalCancelBtn.addEventListener('click', closeReviewModal);
  if(reviewModalOverlay) reviewModalOverlay.addEventListener('click', (e) => { if(e.target === reviewModalOverlay) closeReviewModal(); });

  function startInteractiveReview(items, isRetry){
    const pool = Array.isArray(items) ? items : curSaved();
    if(pool.length === 0) return;
    if(!isRetry) originalReviewPool = pool;
    reviewMissed = [];
    if(reviewAdvanceTimer){ clearTimeout(reviewAdvanceTimer); reviewAdvanceTimer = null; }
    reviewQueue = shuffleArr(pool);
    reviewPos = 0;
    reviewScore = 0;
    openReviewOverlay();
    showReviewStartScreen();
  }

  function showReviewStartScreen(){
    reviewGen++;
    cancelSpeech();
    hideReviewControls();
    const t = LANGS[selectedLang];
    setReviewProgress('');
    reviewStage.innerHTML = '';
    const startWrap = document.createElement('div');
    startWrap.className = 'review-start-wrap';
    const startBtn2 = document.createElement('button');
    startBtn2.type = 'button';
    startBtn2.className = 'saved-action-btn review-start-btn';
    startBtn2.textContent = t.reviewStartBtn;
    startBtn2.addEventListener('click', () => { runReviewAnimStep(); });
    startWrap.appendChild(startBtn2);
    reviewStage.appendChild(startWrap);
  }

  // ---------- Motor de animaciones variadas para la fase de memorización ----------
  const REVIEW_POSITION_ROWS = [
    ['rp-tl','rp-tc','rp-tr'],
    ['rp-ml','rp-c','rp-mr'],
    ['rp-bl','rp-bc','rp-br']
  ];
  const ENTRANCE_ANIMS = [
    { name: 'scale-in', duration: 620 },
    { name: 'pop-in', duration: 600 },
    { name: 'flip3d-in', duration: 720 },
    { name: 'slam-in', duration: 600 },
    { name: 'split-in', duration: 850 },
    { name: 'typewriter-in', duration: 950 }
  ];
  const EXIT_ANIMS = [
    { name: 'particle-dissolve-out', duration: 900 },
    { name: 'smoke-out', duration: 900 },
    { name: 'flip3d-out', duration: 750 },
    { name: 'shatter-out', duration: 620 },
    { name: 'glitch-destroy-out', duration: 880 }
  ];

  // Duraciones reales de las animaciones letra-por-letra, usadas para
  // calcular cuánto tarda en completarse split-in/typewriter-in según
  // el largo del texto (antes se usaba una duración fija que cortaba
  // la animación de palabras largas a mitad de camino, haciendo que
  // parpadeen y desaparezcan antes de poder leerlas).
  const LETTER_STAGGER_SPLIT = 35;   // ms entre letras (split-in)
  const LETTER_DURATION_SPLIT = 600; // duración de rv-letter-fly-in
  const LETTER_STAGGER_TYPE = 55;    // ms entre letras (typewriter-in)
  const LETTER_DURATION_TYPE = 180;  // duración de rv-letter-typewriter-in
  const TYPEWRITER_PULSE_DELAY = 100;
  const TYPEWRITER_PULSE_DURATION = 350; // duración de rv-typewriter-pulse
  const LETTER_STAGGER_SHATTER = 18; // ms entre letras al destruirse
  const LETTER_DURATION_SHATTER = 550; // duración de rv-letter-fly-out
  const GLITCH_PRE_DELAY = 260;

  function textLen(text){ return Math.max(1, Array.from(text || '').length); }

  function computeEntranceDuration(anim, text){
    if(anim.name === 'split-in'){
      return (textLen(text) - 1) * LETTER_STAGGER_SPLIT + LETTER_DURATION_SPLIT;
    }
    if(anim.name === 'typewriter-in'){
      return textLen(text) * LETTER_STAGGER_TYPE + TYPEWRITER_PULSE_DELAY + TYPEWRITER_PULSE_DURATION;
    }
    return anim.duration;
  }

  function computeExitDuration(anim, text){
    if(anim.name === 'shatter-out'){
      return (textLen(text) - 1) * LETTER_STAGGER_SHATTER + LETTER_DURATION_SHATTER;
    }
    if(anim.name === 'glitch-destroy-out'){
      return GLITCH_PRE_DELAY + (textLen(text) - 1) * LETTER_STAGGER_SHATTER + LETTER_DURATION_SHATTER;
    }
    return anim.duration;
  }

  // Tiempo de lectura garantizado para la traducción antes de que
  // empiece a desaparecer: escala con el largo del texto para que
  // las traducciones más largas queden visibles el tiempo suficiente.
  function computeReadHoldMs(text){
    const len = (text || '').length;
    return Math.max(2400, Math.min(4500, 1500 + len * 80));
  }

  function pickRandom(arr){ return arr[Math.floor(Math.random() * arr.length)]; }

  // Elige dos posiciones para palabra/traducción que queden en filas
  // distintas (arriba/medio/abajo), para que nunca se superpongan
  // visualmente sin importar qué tan larga sea cada una.
  function pickTwoDistinctPositions(){
    const rowIdxA = Math.floor(Math.random() * REVIEW_POSITION_ROWS.length);
    let rowIdxB = Math.floor(Math.random() * REVIEW_POSITION_ROWS.length);
    let guard = 0;
    while(rowIdxB === rowIdxA && guard < 6){ rowIdxB = Math.floor(Math.random() * REVIEW_POSITION_ROWS.length); guard++; }
    const a = pickRandom(REVIEW_POSITION_ROWS[rowIdxA]);
    const b = pickRandom(REVIEW_POSITION_ROWS[rowIdxB]);
    return [a, b];
  }


  function clearAnimClasses(el){
    el.className = el.className.replace(/\banim-\S+/g, '').trim();
  }

  function splitIntoLetters(el){
    const text = el.textContent;
    el.textContent = '';
    const spans = [];
    for(const ch of text){
      const span = document.createElement('span');
      span.className = 'review-letter';
      span.textContent = ch === ' ' ? '\u00A0' : ch;
      el.appendChild(span);
      spans.push(span);
    }
    return spans;
  }

  function playEntrance(el, anim, cb){
    const text = el.textContent;
    const realDuration = computeEntranceDuration(anim, text);
    if(anim.name === 'split-in'){
      const letters = splitIntoLetters(el);
      el.style.opacity = '1';
      letters.forEach((span, i) => {
        span.style.setProperty('--dx', ((Math.random() * 2 - 1) * 140).toFixed(0) + 'px');
        span.style.setProperty('--dy', ((Math.random() * 2 - 1) * 140).toFixed(0) + 'px');
        span.style.setProperty('--rot', ((Math.random() * 2 - 1) * 100).toFixed(0) + 'deg');
        span.style.animationDelay = (i * LETTER_STAGGER_SPLIT) + 'ms';
        span.classList.add('letter-fly-in');
      });
    }else if(anim.name === 'typewriter-in'){
      const letters = splitIntoLetters(el);
      el.style.opacity = '1';
      letters.forEach((span, i) => {
        span.style.animationDelay = (i * LETTER_STAGGER_TYPE) + 'ms';
        span.classList.add('letter-typewriter-in');
      });
      setTimeout(() => { el.classList.add('anim-typewriter-pulse'); }, letters.length * LETTER_STAGGER_TYPE + TYPEWRITER_PULSE_DELAY);
    }else{
      el.classList.add('anim-' + anim.name);
    }
    reviewAdvanceTimer = setTimeout(cb, realDuration);
  }

  function playExit(el, anim, cb){
    const text = el.textContent;
    const realDuration = computeExitDuration(anim, text);
    if(anim.name === 'shatter-out' || anim.name === 'glitch-destroy-out'){
      const runShatter = () => {
        let letters = el.querySelectorAll('.review-letter');
        if(!letters.length) letters = splitIntoLetters(el);
        letters.forEach((span, i) => {
          span.style.setProperty('--dx', ((Math.random() * 2 - 1) * 170).toFixed(0) + 'px');
          span.style.setProperty('--dy', (-Math.random() * 170 - 20).toFixed(0) + 'px');
          span.style.setProperty('--rot', ((Math.random() * 2 - 1) * 200).toFixed(0) + 'deg');
          span.style.animationDelay = (i * LETTER_STAGGER_SHATTER) + 'ms';
          span.classList.remove('letter-fly-in', 'letter-typewriter-in');
          span.classList.add('letter-fly-out');
        });
      };
      if(anim.name === 'glitch-destroy-out'){
        el.style.opacity = '1'; // evita que la palabra desaparezca de golpe al quitar la animación de entrada
        clearAnimClasses(el);
        el.classList.add('anim-glitch-pre');
        reviewAdvanceTimer = setTimeout(() => { el.classList.remove('anim-glitch-pre'); runShatter(); }, GLITCH_PRE_DELAY);
      }else{
        runShatter();
      }
    }else{
      clearAnimClasses(el);
      el.classList.add('anim-' + anim.name);
    }
    reviewAdvanceTimer = setTimeout(cb, realDuration);
  }

  function runReviewAnimStep(){
    if(reviewPos >= reviewQueue.length){
      reviewPos = 0;
      runReviewQuizStep();
      return;
    }
    const gen = ++reviewGen;
    const live = () => gen === reviewGen;
    const later = (ms, fn) => {
      reviewAdvanceTimer = setTimeout(() => { if(live()) fn(); }, ms);
    };
    cancelSpeech();
    setReviewControls(true, true, true);

    const t = LANGS[selectedLang];
    const item = reviewQueue[reviewPos];
    setReviewProgress(`${t.reviewAnimLabel} ${reviewPos + 1}/${reviewQueue.length}`);
    reviewStage.innerHTML = '';

    const layer = document.createElement('div');
    layer.className = 'review-anim-layer';
    reviewStage.appendChild(layer);

    const [wordPosCls, trPosCls] = pickTwoDistinctPositions();

    const wordWrap = document.createElement('div');
    wordWrap.className = 'review-pos ' + wordPosCls;
    const wordEl = document.createElement('div');
    wordEl.className = 'review-word';
    wordEl.textContent = item.word;
    wordWrap.appendChild(wordEl);
    layer.appendChild(wordWrap);

    const trWrap = document.createElement('div');
    trWrap.className = 'review-pos ' + trPosCls;
    const trEl = document.createElement('div');
    trEl.className = 'review-translation';
    trEl.textContent = item.translation || '—';
    trWrap.appendChild(trEl);
    layer.appendChild(trWrap);

    const wordEntrance = pickRandom(ENTRANCE_ANIMS);
    const wordExit = pickRandom(EXIT_ANIMS);
    const trEntrance = pickRandom(ENTRANCE_ANIMS);
    const trExit = pickRandom(EXIT_ANIMS);

    // (la velocidad se lee en el momento de programar cada espera, así el slider
    // también funciona a mitad del repaso)
    const readHoldMs = () => computeReadHoldMs(item.translation || item.word) / reviewSpeed;

    // 1) Entra la palabra y se pronuncia; se espera a que termine la animación Y la voz.
    const wordSpeech = reviewSpeak(item.word, getReviewWordLang());
    const wordIn = new Promise(res => playEntrance(wordEl, wordEntrance, res));
    Promise.all([wordIn, wordSpeech]).then(() => {
      if(!live()) return;
      later(480 / reviewSpeed, () => {
        // 2) Entra la traducción y se pronuncia en español.
        trEl.style.setProperty('--tcolor', randomReviewColor());
        const trSpeech = reviewSpeak(item.translation, REVIEW_TRANSLATION_SPEECH_LANG);
        const trIn = new Promise(res => playEntrance(trEl, trEntrance, res));
        Promise.all([trIn, trSpeech]).then(() => {
          if(!live()) return;
          // 3) Ambas quedan visibles juntas un rato y luego salen a la vez.
          later(readHoldMs(), () => {
            playExit(wordEl, wordExit, () => {});
            playExit(trEl, trExit, () => {
              later(140 / reviewSpeed, () => {
                reviewPos++;
                runReviewAnimStep();
              });
            });
          });
        });
      });
    });
  }


  function buildQuizOptions(correct){
    const others = curSaved()
      .map(sw => sw.translation)
      .filter(tr => tr && tr !== correct);
    let pool = shuffleArr(Array.from(new Set(others))).slice(0, 2);
    while(pool.length < 2){
      const filler = FILLER_TRANSLATIONS[Math.floor(Math.random() * FILLER_TRANSLATIONS.length)];
      if(filler !== correct && !pool.includes(filler)) pool.push(filler);
    }
    return shuffleArr([correct, ...pool]);
  }

  function runReviewQuizStep(){
    if(reviewPos >= reviewQueue.length){
      runReviewResults();
      return;
    }
    const gen = ++reviewGen;
    cancelSpeech();
    setReviewControls(true, false, false);
    const t = LANGS[selectedLang];
    const item = reviewQueue[reviewPos];
    const correct = item.translation || FILLER_TRANSLATIONS[0];
    setReviewProgress(`${t.reviewQuizLabel} ${reviewPos + 1}/${reviewQueue.length}`);
    reviewStage.innerHTML = '';

    const wordRow = document.createElement('div');
    wordRow.className = 'review-quiz-word-row';
    const wordEl = document.createElement('div');
    wordEl.className = 'review-quiz-word';
    wordEl.textContent = item.word;
    wordRow.appendChild(wordEl);
    const replayBtn = document.createElement('button');
    replayBtn.type = 'button';
    replayBtn.className = 'review-replay-btn';
    replayBtn.innerHTML = SVG_PLAY;
    replayBtn.title = t.reviewReplayTitle || '';
    replayBtn.setAttribute('aria-label', t.reviewReplayTitle || '');
    replayBtn.addEventListener('click', () => {
      cancelSpeech();
      reviewSpeak(item.word, getReviewWordLang(), true);
    });
    wordRow.appendChild(replayBtn);
    reviewStage.appendChild(wordRow);

    const optionsWrap = document.createElement('div');
    optionsWrap.className = 'review-options';
    buildQuizOptions(correct).forEach(opt => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'review-option';
      btn.textContent = opt;
      btn.addEventListener('click', () => handleReviewAnswer(btn, opt, correct, optionsWrap));
      optionsWrap.appendChild(btn);
    });
    reviewStage.appendChild(optionsWrap);

    const feedback = document.createElement('div');
    feedback.className = 'review-feedback';
    feedback.id = 'reviewFeedback';
    reviewStage.appendChild(feedback);

    // Al mostrar la pregunta, se lee sola la palabra en el idioma estudiado.
    if(gen === reviewGen) reviewSpeak(item.word, getReviewWordLang());
  }

  function handleReviewAnswer(btn, chosen, correct, optionsWrap){
    const t = LANGS[selectedLang];
    optionsWrap.querySelectorAll('.review-option').forEach(b => b.disabled = true);
    const isCorrect = chosen === correct;
    if(isCorrect){
      btn.classList.add('correct');
      reviewScore++;
    }else{
      btn.classList.add('incorrect');
      const missedItem = reviewQueue[reviewPos];
      if(missedItem && !reviewMissed.includes(missedItem)) reviewMissed.push(missedItem);
      optionsWrap.querySelectorAll('.review-option').forEach(b => {
        if(b.textContent === correct) b.classList.add('correct');
      });
    }
    const feedback = document.getElementById('reviewFeedback');
    if(feedback){
      feedback.textContent = isCorrect ? t.reviewCorrect : t.reviewIncorrect;
      feedback.className = 'review-feedback show ' + (isCorrect ? 'ok' : 'bad');
    }
    reviewAdvanceTimer = setTimeout(() => {
      reviewPos++;
      runReviewQuizStep();
    }, 1100);
  }

  function runReviewResults(){
    const t = LANGS[selectedLang];
    reviewGen++;
    cancelSpeech();
    hideReviewControls();
    setReviewProgress(t.reviewResultsLabel);
    reviewStage.innerHTML = '';
    // Felicitación solo si se recordó todo (ninguna respuesta fallada).
    const perfect = reviewQueue.length > 0 && reviewScore === reviewQueue.length && reviewMissed.length === 0;
    if(perfect){
      const confetti = document.createElement('div');
      confetti.className = 'review-confetti';
      const colors = ['#3cdc6e', '#ffd23c', '#ff4d5e', '#4db8ff', '#c77dff', '#ffffff'];
      for(let i = 0; i < 44; i++){
        const piece = document.createElement('span');
        piece.className = 'confetti-piece';
        piece.style.left = (Math.random() * 100).toFixed(1) + '%';
        piece.style.background = colors[i % colors.length];
        piece.style.setProperty('--cdelay', (Math.random() * 1.2).toFixed(2) + 's');
        piece.style.setProperty('--cdur', (2.4 + Math.random() * 1.8).toFixed(2) + 's');
        piece.style.setProperty('--cdrift', ((Math.random() * 2 - 1) * 90).toFixed(0) + 'px');
        piece.style.setProperty('--crot', (360 + Math.random() * 540).toFixed(0) + 'deg');
        confetti.appendChild(piece);
      }
      reviewStage.appendChild(confetti);
      const congrats = document.createElement('div');
      congrats.className = 'review-congrats';
      congrats.textContent = '🎉 ' + (t.reviewCongratsTitle || '') + ' 🎉';
      reviewStage.appendChild(congrats);
      const congratsSub = document.createElement('div');
      congratsSub.className = 'review-congrats-sub';
      congratsSub.textContent = t.reviewCongratsSub || '';
      reviewStage.appendChild(congratsSub);
    }
    const scoreEl = document.createElement('div');
    scoreEl.className = 'review-results-score';
    scoreEl.textContent = `${reviewScore}/${reviewQueue.length}`;
    reviewStage.appendChild(scoreEl);
    const labelEl = document.createElement('div');
    labelEl.className = 'review-results-label';
    labelEl.textContent = t.reviewResultsSub;
    reviewStage.appendChild(labelEl);
    const btnRow = document.createElement('div');
    btnRow.className = 'review-btn-row';
    const retryBtn = document.createElement('button');
    retryBtn.type = 'button';
    retryBtn.className = 'saved-action-btn';
    // "Reintentar" repasa SOLO las palabras falladas (animación y preguntas).
    // Si no falló ninguna, vuelve a repasar todas las del inicio.
    const missedNow = reviewMissed.slice();
    retryBtn.textContent = missedNow.length > 0 ? `${t.reviewRetryBtn} (${missedNow.length})` : t.reviewRetryBtn;
    retryBtn.addEventListener('click', () => {
      if(missedNow.length > 0) startInteractiveReview(missedNow, true);
      else startInteractiveReview(originalReviewPool);
    });
    btnRow.appendChild(retryBtn);
    const closeBtn2 = document.createElement('button');
    closeBtn2.type = 'button';
    closeBtn2.className = 'saved-action-btn';
    closeBtn2.textContent = t.reviewCloseBtnLabel;
    closeBtn2.addEventListener('click', closeReviewOverlay);
    btnRow.appendChild(closeBtn2);
    reviewStage.appendChild(btnRow);
  }

  if(interactiveReviewBtn) interactiveReviewBtn.addEventListener('click', () => { closeSavedPanel(); openReviewModal('recall'); });
  if(interactiveReviewBtnPanel) interactiveReviewBtnPanel.addEventListener('click', () => { closeSavedPanel(); openReviewModal('recall'); });
  if(reviewCloseBtn) reviewCloseBtn.addEventListener('click', closeReviewOverlay);
  if(reviewOverlay) reviewOverlay.addEventListener('click', (e) => { if(e.target === reviewOverlay) closeReviewOverlay(); });

  function setQuickActionsAuto(show){
    if(savedQuickActions) savedQuickActions.classList.toggle('auto-hidden', !show);
  }

  function openSavedPanel(){
    if(savedPanel) savedPanel.classList.add('open');
    if(savedOverlay) savedOverlay.classList.add('open');
  }
  function closeSavedPanel(){
    if(savedPanel) savedPanel.classList.remove('open');
    if(savedOverlay) savedOverlay.classList.remove('open');
  }

  if(savedToggle) savedToggle.addEventListener('click', openSavedPanel);
  if(savedPanelClose) savedPanelClose.addEventListener('click', closeSavedPanel);
  if(savedOverlay) savedOverlay.addEventListener('click', closeSavedPanel);

  // ---------- Selector de voz ----------
  // Permite elegir, entre las voces que ofrece el navegador/sistema operativo,
  // cuál usar para la pronunciación. La preferencia se guarda por idioma en
  // localStorage para que se recuerde entre sesiones.
  function loadSavedVoicePrefs(){
    try{
      const raw = localStorage.getItem('zeltha_voice_prefs');
      voicesByLangCode = raw ? JSON.parse(raw) : {};
    }catch(e){ voicesByLangCode = {}; }
  }
  function saveVoicePrefs(){
    try{ localStorage.setItem('zeltha_voice_prefs', JSON.stringify(voicesByLangCode)); }catch(e){ /* ignore */ }
  }
  loadSavedVoicePrefs();

  function getVoiceLangPrefix(){
    const speechLang = (LANGS[selectedLang] && LANGS[selectedLang].speechLang) || 'en-US';
    return speechLang.split('-')[0].toLowerCase();
  }

  function populateVoiceSelect(){
    if(!voiceSelect) return;
    voicesList = ('speechSynthesis' in window) ? window.speechSynthesis.getVoices() : [];
    const prefix = getVoiceLangPrefix();
    const matches = voicesList.filter(v => v.lang && v.lang.toLowerCase().startsWith(prefix));
    const pool = matches.length ? matches : voicesList;
    voiceSelect.innerHTML = '';
    if(pool.length === 0){
      const opt = document.createElement('option');
      opt.textContent = '(voz del sistema)';
      opt.value = '';
      voiceSelect.appendChild(opt);
      voiceSelect.disabled = true;
      return;
    }
    voiceSelect.disabled = false;
    const defaultOpt = document.createElement('option');
    defaultOpt.value = '';
    defaultOpt.textContent = 'Voz predeterminada';
    voiceSelect.appendChild(defaultOpt);
    pool.forEach(v => {
      const opt = document.createElement('option');
      opt.value = v.voiceURI;
      opt.textContent = v.name + (v.lang ? ' (' + v.lang + ')' : '');
      voiceSelect.appendChild(opt);
    });
    const saved = voicesByLangCode[selectedLang];
    voiceSelect.value = (saved && pool.some(v => v.voiceURI === saved)) ? saved : '';
  }

  function getSelectedVoice(){
    if(!('speechSynthesis' in window)) return null;
    const uri = voicesByLangCode[selectedLang];
    if(!uri) return null;
    const list = voicesList.length ? voicesList : window.speechSynthesis.getVoices();
    return list.find(v => v.voiceURI === uri) || null;
  }

  if(voiceSelect){
    voiceSelect.addEventListener('change', () => {
      if(voiceSelect.value) voicesByLangCode[selectedLang] = voiceSelect.value;
      else delete voicesByLangCode[selectedLang];
      saveVoicePrefs();
    });
  }

  if('speechSynthesis' in window){
    window.speechSynthesis.onvoiceschanged = populateVoiceSelect;
    populateVoiceSelect(); // algunos navegadores ya tienen la lista lista de entrada
  }

  function speakWord(word){
    if(!speechEnabled || !word) return;
    if(!('speechSynthesis' in window)) return;
    try{
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(word);
      utter.lang = (LANGS[selectedLang] && LANGS[selectedLang].speechLang) || 'en-US';
      utter.rate = 0.95;
      const voice = getSelectedVoice();
      if(voice) utter.voice = voice;
      window.speechSynthesis.speak(utter);
    }catch(e){ /* síntesis de voz no disponible en este navegador */ }
  }

  function cancelSpeech(){
    if('speechSynthesis' in window){
      try{ window.speechSynthesis.cancel(); }catch(e){ /* ignore */ }
    }
  }

  // ---------- "Escuchar" (modo solo-audio) ----------
  // Toggle independiente del interruptor "Voz": al activarse, lee TODO el
  // texto de corrido —cada palabra en el idioma elegido y, apenas termina,
  // su significado en español— avanzando también el resaltado en pantalla.
  // Pensado para poder escuchar el contenido completo como si fuera un
  // audio, sin necesidad de mirar la pantalla ni ir tipeando.
  let listenAllActive = false;
  let listenAllAbort = false;

  function speakUtterance(text, lang, rate){
    return new Promise((resolve) => {
      if(!('speechSynthesis' in window) || !text){ resolve(); return; }
      try{
        const utter = new SpeechSynthesisUtterance(text);
        utter.lang = lang;
        utter.rate = rate;
        // Solo aplicamos la voz elegida si el idioma de esta frase coincide
        // con el idioma actualmente seleccionado (evita usar, p.ej., una voz
        // en inglés para leer el significado en español).
        const speechLang = (LANGS[selectedLang] && LANGS[selectedLang].speechLang) || 'en-US';
        if(lang === speechLang){
          const voice = getSelectedVoice();
          if(voice) utter.voice = voice;
        }
        utter.onend = () => resolve();
        utter.onerror = () => resolve();
        window.speechSynthesis.speak(utter);
      }catch(e){ resolve(); }
    });
  }

  // Hace scroll del recuadro de palabras. En vez de subir de a una línea
  // cada vez que la palabra actual llega al borde inferior, cuando el
  // texto se sale del recuadro por abajo saltamos directo al extremo
  // superior, para que luego vuelva a bajar de nuevo desde ahí.
  function scrollWordIntoView(activeEl){
    if(!activeEl || !wordsContainer) return;
    const containerRect = wordsContainer.getBoundingClientRect();
    const elRect = activeEl.getBoundingClientRect();
    const margin = 2;
    if(elRect.top < containerRect.top - margin){
      // la palabra quedó arriba del área visible (p.ej. al retroceder)
      activeEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }else if(elRect.bottom > containerRect.bottom + margin){
      // llegó al final del recuadro: en vez de subir de a una línea,
      // saltamos para que esta línea pase a quedar arriba del todo
      // (como si el recuadro se "reiniciara") y así vuelva a bajar.
      wordsContainer.scrollTop += (elRect.top - containerRect.top);
    }
  }

  function highlightWordForListen(i){
    const wordEls = wordsContainer.querySelectorAll('.word');
    wordEls.forEach(el => el.classList.remove('current'));
    const activeEl = wordEls[i];
    if(!activeEl) return;
    activeEl.classList.add('current');
    scrollWordIntoView(activeEl);
    wordPosEl.textContent = Math.min(i + 1, words.length);
  }

  // ---------- Wake Lock: evita que la pantalla se bloquee mientras se
  // escucha o el modo automático está activo (especialmente útil con
  // textos largos, donde la inactividad del teclado dispara el bloqueo). ----------
  let wakeLock = null;

  async function requestWakeLock(){
    if(!('wakeLock' in navigator)) return;
    try{
      wakeLock = await navigator.wakeLock.request('screen');
      wakeLock.addEventListener('release', () => { wakeLock = null; });
    }catch(err){
      wakeLock = null; // el navegador puede rechazarlo (p.ej. pestaña en segundo plano)
    }
  }

  async function releaseWakeLock(){
    if(wakeLock){
      try{ await wakeLock.release(); }catch(err){ /* noop */ }
      wakeLock = null;
    }
  }

  // Si la pantalla llegó a apagarse igual (o el usuario cambió de pestaña),
  // al volver a la página se vuelve a pedir el wake lock si seguimos activos.
  document.addEventListener('visibilitychange', () => {
    if(document.visibilityState === 'visible' && (listenAllActive || autoMode)){
      requestWakeLock();
    }
  });

  function stopListenAll(){
    const wasActive = listenAllActive;
    listenAllActive = false;
    listenAllAbort = true;
    cancelSpeech();
    if(listenBtn) listenBtn.classList.remove('listen-active');
    if(!autoMode) releaseWakeLock();
    if(wasActive && currentIndex < words.length && typeScreen && !typeScreen.hidden){
      hiddenInput.disabled = false;
      updateCurrentWordUI();
    }
  }

  async function startListenAll(){
    if(words.length === 0 || !('speechSynthesis' in window)) return;
    listenAllActive = true;
    listenAllAbort = false;
    if(listenBtn) listenBtn.classList.add('listen-active');
    hiddenInput.disabled = true;
    requestWakeLock();
    const wordLang = (LANGS[selectedLang] && LANGS[selectedLang].speechLang) || 'en-US';

    for(let i = 0; i < words.length; i++){
      if(listenAllAbort) break;
      const word = words[i];
      if(!word) continue;

      highlightWordForListen(i);
      await speakUtterance(word, wordLang, 0.9);
      if(listenAllAbort) break;

      const translation = await getTranslation(word, i);
      if(listenAllAbort) break;
      const pinyinMatch = /^(.*) \(([^)]+)\)$/.exec(translation || '');
      const meaning = pinyinMatch ? pinyinMatch[1] : translation;
      if(meaning && meaning !== '?'){
        await speakUtterance(meaning, 'es-ES', 0.95);
        if(listenAllAbort) break;
      }
      await new Promise(r => setTimeout(r, 280)); // pausa breve entre palabras
    }

    listenAllActive = false;
    if(listenBtn) listenBtn.classList.remove('listen-active');
    if(!autoMode) releaseWakeLock();
    if(!listenAllAbort && typeScreen && !typeScreen.hidden){
      // terminó de leer todo el texto: vuelve a habilitar el tecleo
      // manteniendo el progreso donde estaba antes de escuchar
      hiddenInput.disabled = false;
      updateCurrentWordUI();
    }
  }

  if(listenBtn){
    listenBtn.addEventListener('click', () => {
      if(listenAllActive){
        stopListenAll();
      }else{
        autoMode = false;
        stopAuto();
        if(autoBtn) autoBtn.classList.remove('auto-active');
        startListenAll();
      }
    });
  }

  if(speakToggleBtn){
    speakToggleBtn.addEventListener('click', () => {
      speechEnabled = !speechEnabled;
      speakToggleBtn.classList.toggle('speak-active', speechEnabled);
      if(!speechEnabled) cancelSpeech();
    });
  }

  if(subtitlesToggleBtn){
    subtitlesToggleBtn.addEventListener('click', () => {
      esSubsEnabled = !esSubsEnabled;
      try{ localStorage.setItem(ES_SUBS_STORAGE_KEY, esSubsEnabled ? '1' : '0'); }catch(e){ /* ignore */ }
      applyEsSubsState();
    });
  }

  if(tooltipSaveBtn){
    tooltipSaveBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleCurrentWordSaved();
    });
  }

  // ---- Traducción en vivo (botón wifi): solo cuando el usuario la pide ----
  // La traducción normal de cada palabra es la que viene con el contexto del
  // texto. Con el wifi se consulta la palabra suelta en un traductor en línea.
  let liveShownIndex = null;      // índice de la palabra cuya traducción en vivo se está viendo
  let liveShownTranslation = '';

  function resetLiveState(){
    liveShownIndex = null;
    liveShownTranslation = '';
    tooltip.classList.remove('live-mode', 'tip-vertical');
    if(tooltipLiveBtn) tooltipLiveBtn.classList.remove('live-active', 'live-loading');
  }

  function renderTooltipTranslation(translation, isLive){
    const pinyinMatch = /^(.*) \(([^)]+)\)$/.exec(translation);
    if(pinyinMatch){
      tooltipText.innerHTML = `${escapeHtml2(pinyinMatch[1])} <span class="pinyin">${escapeHtml2(pinyinMatch[2])}</span>`;
    }else{
      tooltipText.textContent = translation;
    }
    tooltip.classList.toggle('live-mode', !!isLive);
    tooltip.classList.remove('tip-vertical');
  }

  // Significados numerados, uno por línea: ① para / ② por / ③ durante.
  function renderLiveBubble(live){
    const terms = live.terms || [];
    if(terms.length < 2){ renderTooltipTranslation(live.main, true); return; }
    const vertical = true; // desde 2 significados ya se apilan en vertical
    tooltipText.innerHTML =
      '<span class="means ' + (vertical ? 'means-v' : 'means-h') + '">' +
        terms.map((t, i) => '<span class="mean"><span class="mean-n">' + (i + 1) + '</span><span class="mean-t">' + escapeHtml2(t) + '</span></span>').join('') +
      '</span>' + (live.pinyin ? ' <span class="pinyin">' + escapeHtml2(live.pinyin) + '</span>' : '');
    tooltip.classList.add('live-mode');
    tooltip.classList.toggle('tip-vertical', vertical);
  }

  // Mantiene visible el recuadro (si vino de un toque sobre una palabra) mientras se usa.
  function holdTooltipOpen(ms){
    if(tooltipOverrideTimer){ clearTimeout(tooltipOverrideTimer); tooltipOverrideTimer = null; }
    if(tooltipOverrideIndex == null) return;
    tooltipOverrideTimer = setTimeout(() => {
      tooltipOverrideIndex = null;
      tooltipOverrideTimer = null;
      restoreTooltipToCurrentWord();
    }, ms);
  }

  if(tooltipLiveBtn){
    tooltipLiveBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      e.stopPropagation();
      const idx = getTooltipIndex();
      if(idx >= words.length) return;
      const wordEl = wordsContainer.querySelectorAll('.word')[idx];
      holdTooltipOpen(6000);
      if(liveShownIndex === idx){
        // segundo toque: volver a la traducción en contexto
        resetLiveState();
        renderTooltipTranslation(await getTranslation(words[idx], idx));
        if(wordEl) positionTooltip(wordEl);
        holdTooltipOpen(3500);
        return;
      }
      tooltipLiveBtn.classList.add('live-loading');
      const live = await getLiveMeanings(words[idx]);
      tooltipLiveBtn.classList.remove('live-loading');
      if(getTooltipIndex() !== idx) return; // el usuario ya cambió de palabra
      if(live){
        liveShownIndex = idx;
        liveShownTranslation = live.main;   // lo que se guarda: el significado principal
        tooltipLiveBtn.classList.add('live-active');
        renderLiveBubble(live); // lo que se ve: hasta 5 significados numerados
      }else{
        tooltipText.textContent = 'sin conexión';
      }
      if(wordEl) positionTooltip(wordEl);
      holdTooltipOpen(6000);
    });
  }

  // Atajo de teclado: Ctrl+S (Windows/Linux) o Cmd+S (Mac) guarda/quita
  // la palabra actual mientras se está tipeando, sin abrir el diálogo
  // de "Guardar página" del navegador.
  window.addEventListener('keydown', (e) => {
    const key = (e.key || '').toLowerCase();
    if((e.ctrlKey || e.metaKey) && key === 's'){
      if(typeScreen && !typeScreen.hidden && currentIndex < words.length){
        e.preventDefault();
        toggleCurrentWordSaved();
      }
    }
  });
  if(reviewSavedBtn){
    reviewSavedBtn.addEventListener('click', () => openReviewModal('typing'));
  }

  // ---------- Modo automático: avanza de palabra en palabra cada X ms ----------
  let autoMode = false;
  let autoTimer = null;
  let autoSpeedMs = autoSpeed ? parseInt(autoSpeed.value, 10) : 2000;

  function startAuto(){
    if(autoTimer) clearInterval(autoTimer);
    if(startTime === null) startTime = Date.now();
    hiddenInput.disabled = true;
    requestWakeLock();
    autoTimer = setInterval(() => {
      if(currentIndex >= words.length){
        stopAuto();
        return;
      }
      commitWord(words[currentIndex]); // se toma como escrita correctamente, sin espacio
      hiddenInput.value = '';
    }, autoSpeedMs);
  }

  function stopAuto(){
    if(autoTimer){ clearInterval(autoTimer); autoTimer = null; }
    if(!listenAllActive) releaseWakeLock();
    if(currentIndex < words.length) hiddenInput.disabled = false;
  }

  function toggleAuto(){
    autoMode = !autoMode;
    if(autoBtn) autoBtn.classList.toggle('auto-active', autoMode);
    if(autoMode){
      stopListenAll();
      startAuto();
      showCurrentWordTooltip();
    }else{
      stopAuto();
      if(tooltipOverrideIndex == null) tooltip.classList.remove('show');
    }
  }

  // Muestra la traducción sobre la palabra actual (sin volver a pronunciarla).
  async function showCurrentWordTooltip(){
    const wordEls = wordsContainer.querySelectorAll('.word');
    const activeEl = wordEls[currentIndex];
    if(!autoMode || !activeEl || currentIndex >= words.length || tooltipOverrideIndex != null) return;
    tooltipText.textContent = '...';
    tooltip.classList.add('show');
    positionTooltip(activeEl);
    const translation = await getTranslation(words[currentIndex], currentIndex);
    if(autoMode && tooltipOverrideIndex == null && wordsContainer.querySelectorAll('.word')[currentIndex] === activeEl){
      const pinyinMatch = /^(.*) \(([^)]+)\)$/.exec(translation);
      if(pinyinMatch){
        tooltipText.innerHTML = `${escapeHtml2(pinyinMatch[1])} <span class="pinyin">${escapeHtml2(pinyinMatch[2])}</span>`;
      }else{
        tooltipText.textContent = translation;
      }
      tooltip.classList.add('show');
      positionTooltip(activeEl);
    }
  }

  if(autoBtn){
    autoBtn.addEventListener('click', toggleAuto);
  }

  if(autoSpeed){
    autoSpeed.addEventListener('input', () => {
      autoSpeedMs = parseInt(autoSpeed.value, 10);
      if(autoSpeedLabel) autoSpeedLabel.textContent = (autoSpeedMs / 1000).toFixed(1) + 's';
      if(autoMode) startAuto(); // reinicia el intervalo con la nueva velocidad
    });
  }

  const sampleModalOverlay = document.getElementById('sampleModalOverlay');
  const sampleModalGrid = document.getElementById('sampleModalGrid');
  const sampleModalClose = document.getElementById('sampleModalClose');

  if(sampleModalGrid){
    SAMPLE_TOPICS.forEach(topic => {
      const item = document.createElement('button');
      item.type = 'button';
      item.className = 'sample-topic-btn';
      item.dataset.topic = topic.key;
      item.innerHTML = `<span class="sample-topic-icon">${topic.icon || '📄'}</span>${escapeHtml2(topic.label)}`;
      sampleModalGrid.appendChild(item);
    });
  }

  // ---- Progreso por texto (lista de textos de ejemplo) ----
  // textProgress[id][idioma] = { opened: true, mastered: true }
  const TEXT_PROGRESS_KEY = 'zeltha_text_progress_v2';
  let sessionTextId = null; // id del texto de la lista que se está practicando
  let textProgress = {};
  try{
    const raw = localStorage.getItem(TEXT_PROGRESS_KEY);
    if(raw){
      textProgress = JSON.parse(raw) || {};
    }else{
      // v1 marcaba "abierto" al iniciar; ahora solo cuenta al finalizar. Se conservan los ✓.
      const old = JSON.parse(localStorage.getItem('zeltha_text_progress_v1')) || {};
      Object.keys(old).forEach(id => Object.keys(old[id] || {}).forEach(lang => {
        if(old[id][lang] && old[id][lang].mastered){
          textProgress[id] = textProgress[id] || {};
          textProgress[id][lang] = { mastered: true };
        }
      }));
      localStorage.setItem(TEXT_PROGRESS_KEY, JSON.stringify(textProgress));
    }
  }catch(e){ textProgress = {}; }

  function getTextProg(id){
    return (textProgress[id] && textProgress[id][selectedLang]) || {};
  }
  function setTextProg(id, patch){
    textProgress[id] = textProgress[id] || {};
    textProgress[id][selectedLang] = Object.assign({}, textProgress[id][selectedLang], patch);
    try{ localStorage.setItem(TEXT_PROGRESS_KEY, JSON.stringify(textProgress)); }catch(e){ /* ignore */ }
  }

  // Palabras únicas del texto, en el idioma elegido (las mismas que se guardan).
  function uniqueWordKeysOf(spanishText){
    const pre = PRECOMPUTED[spanishText] && PRECOMPUTED[spanishText][LANGS[selectedLang].tl];
    if(!pre) return null;
    const toks = selectedLang === 'zh'
      ? [...pre.text].filter(ch => /\S/.test(ch))
      : pre.text.split(/\s+/).filter(Boolean);
    const set = new Set();
    toks.forEach(w => { if(cleanWord(w)) set.add(savedKey(w)); });
    return set;
  }

  // % de comprensión = palabras del texto que NO guardaste como "a recordar".
  function textStatus(item){
    const prog = getTextProg(item.id);
    if(prog.mastered) return { pct: 100, mastered: true };
    if(!prog.opened) return { pct: null, mastered: false }; // nunca finalizado → "Nuevo"
    const keys = uniqueWordKeysOf(item.text.trim());
    if(!keys || !keys.size) return { pct: null, mastered: false };
    const saved = new Set(curSaved().map(sw => sw.key));
    let unknown = 0;
    keys.forEach(k => { if(saved.has(k)) unknown++; });
    return { pct: Math.round(100 * (1 - unknown / keys.size)), mastered: false };
  }

  // ---- Vista 2 del modal: lista de textos ----
  const sampleModalTitle = document.getElementById('sampleModalTitle');
  const sampleModalBack = document.getElementById('sampleModalBack');
  const sampleTextList = document.getElementById('sampleTextList');
  let sampleListItems = [];

  function pctClass(st){
    if(st.mastered) return 'pct-high';
    if(st.pct === null) return 'pct-new';
    return st.pct >= 80 ? 'pct-high' : (st.pct >= 50 ? 'pct-mid' : 'pct-low');
  }

  function buildTextRow(item, withIcon){
    const st = textStatus(item);
    const row = document.createElement('div');
    row.className = 'sample-text-row';
    row.dataset.id = item.id;
    row.tabIndex = 0;
    row.setAttribute('role', 'button');
    const pctLabel = st.pct === null ? 'Nuevo' : st.pct + '%';
    const checkTitle = st.mastered ? 'Quitar marca de entendido' : 'Marcar como entendido';
    row.innerHTML =
      (withIcon && item.icon ? `<span class="sample-topic-icon">${item.icon}</span>` : '') +
      `<span class="sample-text-title">${escapeHtml2(item.title)}</span>` +
      `<span class="sample-text-pct ${pctClass(st)}">${pctLabel}</span>` +
      `<button type="button" class="sample-text-check${st.mastered ? ' on' : ''}" aria-pressed="${st.mastered}" title="${checkTitle}" aria-label="${checkTitle}">✓</button>`;
    return row;
  }

  function showTopicsView(){
    sampleListItems = [];
    if(sampleModalTitle) sampleModalTitle.textContent = 'Elige un tema';
    if(sampleModalBack) sampleModalBack.hidden = true;
    if(sampleTextList){ sampleTextList.hidden = true; sampleTextList.innerHTML = ''; }
    if(sampleModalGrid) sampleModalGrid.hidden = false;
  }

  function showTextList(topicKey){
    const topics = topicKey ? SAMPLE_TOPICS.filter(t => t.key === topicKey) : SAMPLE_TOPICS;
    const t0 = topics[0];
    sampleListItems = topics.flatMap(tp => tp.texts.map(x => Object.assign({ icon: tp.icon }, x)));
    if(sampleModalTitle) sampleModalTitle.textContent = topicKey && t0 ? `${t0.icon || ''} ${t0.label}`.trim() : 'Todos los textos';
    if(sampleModalBack) sampleModalBack.hidden = false;
    if(sampleModalGrid) sampleModalGrid.hidden = true;
    if(!sampleTextList) return;
    sampleTextList.innerHTML = '';
    const rnd = document.createElement('div');
    rnd.className = 'sample-text-row sample-text-random';
    rnd.tabIndex = 0;
    rnd.setAttribute('role', 'button');
    rnd.innerHTML = '<span class="sample-topic-icon">🎲</span><span class="sample-text-title">Texto al azar</span>';
    sampleTextList.appendChild(rnd);
    sampleListItems.forEach(item => sampleTextList.appendChild(buildTextRow(item, !topicKey)));
    sampleTextList.hidden = false;
    const box = document.getElementById('sampleModal');
    if(box) box.scrollTop = 0;
  }

  function chooseSampleText(item){
    if(!item) return;
    sourceText.value = item.text;
    closeSampleModal();
    sampleUsed = true;
    lastSampleValue = sourceText.value;
    applyLang(selectedLang);
  }

  function pickRandomFromList(){
    const pending = sampleListItems.filter(x => !getTextProg(x.id).mastered);
    const pool = pending.length ? pending : sampleListItems;
    return pool.length ? pool[Math.floor(Math.random() * pool.length)] : null;
  }

  function openSampleModal(){
    showTopicsView();
    if(sampleModalOverlay) sampleModalOverlay.hidden = false;
  }
  function closeSampleModal(){
    if(sampleModalOverlay) sampleModalOverlay.hidden = true;
  }

  sampleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    openSampleModal();
  });

  if(sampleModalGrid){
    sampleModalGrid.addEventListener('click', (e) => {
      const btn = e.target.closest('.sample-topic-btn');
      if(!btn) return;
      showTextList(btn.dataset.topic || '');
    });
  }

  if(sampleModalBack) sampleModalBack.addEventListener('click', showTopicsView);

  if(sampleTextList){
    sampleTextList.addEventListener('click', (e) => {
      const check = e.target.closest('.sample-text-check');
      const row = e.target.closest('.sample-text-row');
      if(!row) return;
      if(check){
        // marcar / desmarcar como entendido (sin abrir el texto)
        const id = row.dataset.id;
        setTextProg(id, { mastered: !getTextProg(id).mastered });
        const item = sampleListItems.find(x => x.id === id);
        row.replaceWith(buildTextRow(item, !!(item && item.icon && sampleListItems.some(x => x.icon !== item.icon))));
        return;
      }
      if(row.classList.contains('sample-text-random')){ chooseSampleText(pickRandomFromList()); return; }
      chooseSampleText(TEXT_ITEM_BY_ID[row.dataset.id]);
    });
    sampleTextList.addEventListener('keydown', (e) => {
      if((e.key !== 'Enter' && e.key !== ' ') || e.target.closest('.sample-text-check')) return;
      const row = e.target.closest('.sample-text-row');
      if(!row) return;
      e.preventDefault();
      row.click();
    });
  }

  if(sampleModalClose) sampleModalClose.addEventListener('click', closeSampleModal);

  // Si el usuario borra o reescribe el texto a mano, el botón vuelve a su
  // nombre original ("Usar texto de ejemplo").
  let lastSampleValue = '';
  sourceText.addEventListener('input', () => {
    if(sampleUsed && sourceText.value !== lastSampleValue){
      sampleUsed = false;
      applyLang(selectedLang);
    }
  });

  if(sampleModalOverlay){
    sampleModalOverlay.addEventListener('click', (e) => {
      if(e.target === sampleModalOverlay) closeSampleModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape' && sampleModalOverlay && !sampleModalOverlay.hidden){
      closeSampleModal();
    }
  });

  startBtn.addEventListener('click', async () => {
    const text = sourceText.value.trim();
    if(!text){ sourceText.focus(); return; }
    sessionTextId = TEXT_ID_BY_TEXT[text] || null; // null si el texto es propio (no de la lista)
    const t = LANGS[selectedLang];
    const originalLabel = startBtn.dataset.baseLabel || t.startBtn;
    startBtn.disabled = true;
    setBtnLabelWithEsSub(startBtn, t.translatingLabel);
    try{
      const pre = PRECOMPUTED[text] && PRECOMPUTED[text][t.tl];
      if(pre){
        beginSession(pre.text, pre.glosses);
      }else{
        const converted = await translateFullTextPreserveLines(text, t.tl);
        beginSession(converted || text);
      }
    } finally {
      startBtn.disabled = false;
      setBtnLabelWithEsSub(startBtn, originalLabel);
    }
  });

  restartBtn.addEventListener('click', resetToSetup);
  if(finishBtn){
    finishBtn.addEventListener('click', () => {
      if(typeScreen && !typeScreen.hidden) finishSession();
    });
  }
  tryAgainBtn.addEventListener('click', resetToSetup);

  function resetToSetup(){
    autoMode = false;
    stopAuto();
    if(autoBtn) autoBtn.classList.remove('auto-active');
    stopListenAll();
    setupScreen.hidden = false;
    typeScreen.hidden = true;
    resultScreen.hidden = true;
    document.body.classList.remove('in-session');
    syncSubtitlesBtnCompact();
    if(voiceSelectWrap) voiceSelectWrap.hidden = true;
    hiddenInput.value = '';
    closeSavedPanel();
    setQuickActionsAuto(false);
    cancelSpeech();
    hideSelTranslateUI();
  }

  // Traduce el texto en español COMPLETO al idioma elegido (para que
  // el usuario practique tecleando en el idioma que quiere aprender).
  async function translateFullText(text, tl){
    try{
      const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=es&tl=${tl}&dt=t&q=${encodeURIComponent(text)}`);
      if(res.ok){
        const data = await res.json();
        if(data && Array.isArray(data[0])){
          const joined = data[0].map(chunk => chunk && chunk[0] ? chunk[0] : '').join('');
          if(joined.trim()) return joined.trim();
        }
      }
    }catch(e){ /* fall through to backup */ }

    try{
      const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=es|${tl.split('-')[0]}`);
      const data = await res.json();
      const translated = data && data.responseData && data.responseData.translatedText;
      if(translated) return translated;
    }catch(e){ /* give up */ }

    return '';
  }

  // Traduce el texto conservando los saltos de línea (por ejemplo,
  // guiones tipo "Vendedor: ... / Cliente: ..."), traduciendo cada
  // línea por separado en vez de todo el bloque de una vez.
  async function translateFullTextPreserveLines(text, tl){
    const lines = text.split('\n');
    const nonEmptyLines = lines.filter(l => l.trim());
    if(nonEmptyLines.length <= 1){
      return await translateFullText(text, tl);
    }
    const translatedLines = await Promise.all(
      lines.map(async (line) => {
        const trimmed = line.trim();
        if(!trimmed) return '';
        const t = await translateFullText(trimmed, tl);
        return t || trimmed;
      })
    );
    return translatedLines.join('\n');
  }

  let lineBreakBefore = new Set();
  // Glosses ya resueltas con contexto para la sesión actual (si el texto
  // es uno de los 50 predeterminados). Alineadas por índice con "words".
  let currentPrecomputedGlosses = null;

  function beginSession(text, glosses){
    isReviewSession = false;
    currentPrecomputedGlosses = glosses || null;
    const lines = text.split('\n');
    const wordList = [];
    const breaks = new Set();
    lines.forEach((line, li) => {
      const lineWords = selectedLang === 'zh'
        ? [...line].filter(ch => /\S/.test(ch))
        : line.split(/\s+/).filter(Boolean);
      if(lineWords.length && li > 0){
        breaks.add(wordList.length); // marca el índice donde empieza la nueva línea
      }
      wordList.push(...lineWords);
    });
    startTypingSession(wordList, breaks);
  }

  function syncSubtitlesBtnCompact(){
    if(!subtitlesToggleBtn) return;
    const compact = document.body.classList.contains('in-session') && window.innerWidth <= 600;
    if(subtitlesToggleLabel) subtitlesToggleLabel.style.display = compact ? 'none' : '';
    const esSub = subtitlesToggleBtn.querySelector('.es-sub');
    if(esSub) esSub.style.display = compact ? 'none' : '';
    if(compact){
      subtitlesToggleBtn.style.padding = '9px';
      subtitlesToggleBtn.style.minWidth = '0';
      subtitlesToggleBtn.style.width = 'auto';
    } else {
      subtitlesToggleBtn.style.padding = '';
      subtitlesToggleBtn.style.minWidth = '';
      subtitlesToggleBtn.style.width = '';
    }
  }
  window.addEventListener('resize', syncSubtitlesBtnCompact);

  function startTypingSession(wordList, breaks){
    words = wordList;
    lineBreakBefore = breaks || new Set();
    currentIndex = 0;
    correctChars = 0;
    incorrectChars = 0;
    startTime = null;
    autoMode = false;
    stopAuto();
    if(autoBtn) autoBtn.classList.remove('auto-active');
    wordTotalEl.textContent = words.length;
    renderWords();
    setupScreen.hidden = true;
    resultScreen.hidden = true;
    typeScreen.hidden = false;
    document.body.classList.add('in-session');
    syncSubtitlesBtnCompact();
    if(voiceSelectWrap) voiceSelectWrap.hidden = false;
    setQuickActionsAuto(false);
    hiddenInput.value = '';
    hiddenInput.disabled = false;
    hideSelTranslateUI();
    updateCurrentWordUI();
    prefetchAround(currentIndex);
  }

  function renderWords(){
    wordsContainer.innerHTML = '';
    words.forEach((w, i) => {
      if(lineBreakBefore.has(i)){
        wordsContainer.appendChild(document.createElement('br'));
      }
      const span = document.createElement('span');
      span.className = 'word';
      span.dataset.index = i;
      span.innerHTML = [...w].map(ch => `<span class="char">${escapeHtml(ch)}</span>`).join('');
      wordsContainer.appendChild(span);
    });
  }

  function escapeHtml(ch){
    if(ch === '<') return '&lt;';
    if(ch === '>') return '&gt;';
    if(ch === '&') return '&amp;';
    return ch;
  }

  function escapeHtml2(str){
    return String(str).replace(/[<>&]/g, ch => escapeHtml(ch));
  }

  function cleanWord(w){
    // Ahora la palabra a tipear ya está en el idioma elegido (en/pt/zh)
    if(selectedLang === 'zh') return w.replace(/[^\u4e00-\u9fff\u3400-\u4dbf]/g, '');
    return w.toLowerCase().replace(/[^a-zA-ZÀ-ÿ'-]/g, '');
  }

  // Traduce cada palabra individual (ya en el idioma elegido) de vuelta
  // al español, para mostrarla como ayuda en el tooltip. Para chino,
  // además se intenta traer el pinyin de esa palabra.
  async function getTranslation(word, index, forceLive){
    const key = cleanWord(word);
    if(!key) return '';
    // Si esta sesión tiene glosses ya armadas con contexto (uno de los
    // 50 textos predeterminados), usamos esa directamente sin llamar a
    // ninguna API en vivo.
    if(!forceLive && currentPrecomputedGlosses && index != null && currentPrecomputedGlosses[index] !== undefined){
      return currentPrecomputedGlosses[index];
    }
    // En modo repaso de "palabras guardadas", usamos la traducción que
    // ya quedó guardada (con su contexto original) en vez de traducir
    // la palabra de nuevo aislada, que puede dar un significado distinto
    // (ej. "I'll" traducido suelto puede confundirse con "ill").
    if(!forceLive && isReviewSession){
      const saved = curSaved().find(sw => sw.key === key);
      if(saved && saved.translation) return saved.translation;
    }
    const cacheKey = selectedLang + ':' + key;
    if(forceLive){
      // Traducción en vivo pedida por el usuario: se reintenta si falló antes
      // y se espera si ya hay una consulta en curso para esa palabra.
      if(translationCache[cacheKey] === '?') delete translationCache[cacheKey];
      for(let i = 0; i < 40 && translationCache[cacheKey] === null; i++) await new Promise(r => setTimeout(r, 150));
      if(translationCache[cacheKey] === null) delete translationCache[cacheKey];
    }
    if(translationCache[cacheKey] !== undefined) return translationCache[cacheKey];
    translationCache[cacheKey] = null; // mark in-flight
    const sl = LANGS[selectedLang].tl; // idioma en el que está escrita la palabra a tipear
    const isZh = sl.startsWith('zh');

    // Primary: Google's public translate endpoint (reliable CORS for browser fetch)
    // Para chino pedimos también dt=rm (romanización/pinyin de la palabra original).
    try{
      const dtParams = isZh ? 'dt=t&dt=rm' : 'dt=t';
      const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sl}&tl=es&${dtParams}&q=${encodeURIComponent(key)}`);
      if(res.ok){
        const data = await res.json();
        const translated = data && data[0] && data[0][0] && data[0][0][0];
        if(translated){
          let result = translated.toLowerCase();
          if(isZh){
            const pinyin = extractPinyin(data);
            if(pinyin) result += ' (' + pinyin + ')';
          }
          translationCache[cacheKey] = result;
          return result;
        }
      }
    }catch(e){ /* fall through to backup */ }

    // Backup: MyMemory (sin pinyin)
    try{
      const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(key)}&langpair=${sl.split('-')[0]}|es`);
      const data = await res.json();
      let translated = data && data.responseData && data.responseData.translatedText;
      if(translated){
        translationCache[cacheKey] = translated.toLowerCase();
        return translationCache[cacheKey];
      }
    }catch(e){ /* give up */ }

    translationCache[cacheKey] = '?';
    return translationCache[cacheKey];
  }

  // Intenta extraer la romanización (pinyin) devuelta por el endpoint de Google
  // cuando se pide dt=rm. El formato no es estable, así que se prueba de forma
  // defensiva y si no se encuentra simplemente no se muestra pinyin.
  function extractPinyin(data){
    try{
      const sentences = data[0];
      if(!Array.isArray(sentences)) return '';
      for(const entry of sentences){
        if(Array.isArray(entry)){
          for(let i = entry.length - 1; i >= 2; i--){
            if(typeof entry[i] === 'string' && entry[i]){
              return entry[i];
            }
          }
        }
      }
    }catch(e){ /* ignore */ }
    return '';
  }

  // Traducción en vivo de la palabra SUELTA (sin contexto). Pide también el
  // diccionario del traductor para mostrar hasta 3 significados posibles,
  // así se nota la diferencia con la traducción en contexto.
  const liveCache = {};
  async function getLiveMeanings(word){
    const key = cleanWord(word);
    if(!key) return null;
    const sl = LANGS[selectedLang].tl;
    const isZh = sl.startsWith('zh');
    const ck = sl + ':' + key;
    if(liveCache[ck]) return liveCache[ck];
    try{
      const dt = isZh ? 'dt=t&dt=bd&dt=rm' : 'dt=t&dt=bd';
      const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sl}&tl=es&${dt}&q=${encodeURIComponent(key)}`);
      if(res.ok){
        const data = await res.json();
        const main = data && data[0] && data[0][0] && data[0][0][0];
        if(main){
          const terms = [String(main).toLowerCase()];
          if(Array.isArray(data[1])){
            data[1].forEach(entry => {
              if(Array.isArray(entry) && Array.isArray(entry[1])){
                entry[1].forEach(t => {
                  const v = String(t).toLowerCase();
                  if(terms.indexOf(v) === -1) terms.push(v);
                });
              }
            });
          }
          const pinyin = isZh ? extractPinyin(data) : '';
          const out = {
            main: terms[0] + (pinyin ? ' (' + pinyin + ')' : ''),
            terms: terms.slice(0, 5),
            pinyin: pinyin
          };
          liveCache[ck] = out;
          return out;
        }
      }
    }catch(e){ /* se prueba el respaldo */ }
    try{
      const t = await getTranslation(word, null, true);
      if(t && t !== '?') return { main: t, terms: [t], pinyin: '' };
    }catch(e){ /* sin conexión */ }
    return null;
  }

  function prefetchAround(index){
    for(let i = index; i < Math.min(index + 4, words.length); i++){
      getTranslation(words[i], i);
    }
  }

  async function updateCurrentWordUI(){
    wordPosEl.textContent = Math.min(currentIndex + 1, words.length);
    const wordEls = wordsContainer.querySelectorAll('.word');
    wordEls.forEach(el => el.classList.remove('current'));
    const activeEl = wordEls[currentIndex];
    if(!activeEl){
      tooltip.classList.remove('show');
      refreshSaveButtonState();
      cancelSpeech();
      return;
    }
    activeEl.classList.add('current');
    scrollWordIntoView(activeEl);
    refreshSaveButtonState();
    speakWord(words[currentIndex]);

    // La traducción automática sobre la palabra está desactivada por
    // defecto: solo se muestra el flotante aquí si el usuario la activó.
    // Igual seguimos pidiendo la traducción abajo, porque hace falta para
    // poder guardarla junto a la palabra.
    const showAutoTooltip = autoMode && tooltipOverrideIndex == null;
    if(showAutoTooltip){
      tooltipText.textContent = '...';
      tooltip.classList.add('show');
      positionTooltip(activeEl);
    }else if(tooltipOverrideIndex == null){
      tooltip.classList.remove('show');
    }

    const translation = await getTranslation(words[currentIndex], currentIndex);
    // guard against race if user already moved on
    if(wordEls[currentIndex] === activeEl && activeEl.classList.contains('current')){
      if(autoMode && tooltipOverrideIndex == null){
        const pinyinMatch = /^(.*) \(([^)]+)\)$/.exec(translation);
        if(pinyinMatch){
          tooltipText.innerHTML = `${escapeHtml2(pinyinMatch[1])} <span class="pinyin">${escapeHtml2(pinyinMatch[2])}</span>`;
        }else{
          tooltipText.textContent = translation;
        }
        tooltip.classList.add('show');
        positionTooltip(activeEl);
      }
      if(translation && translation !== '?'){
        const key = savedKey(words[currentIndex]);
        const sw = curSaved().find(s => s.key === key);
        if(sw && !sw.translation){
          sw.translation = translation;
          persistSavedWords();
          renderSavedWordsPanel();
        }
      }
      if(translation === '?' && !window.__networkWarned){
        window.__networkWarned = true;
      }
    }
  }

  function positionTooltip(activeEl){
    const stageRect = wordsContainer.parentElement.getBoundingClientRect();
    const wordRect = activeEl.getBoundingClientRect();
    const center = wordRect.left - stageRect.left + wordRect.width / 2;
    // La burbuja no debe salirse del recuadro/pantalla (sobre todo con traducciones largas):
    // se desplaza lo necesario y la flechita sigue apuntando a la palabra.
    const half = tooltip.offsetWidth / 2;
    const margin = 6;
    const clamped = Math.max(half + margin, Math.min(center, stageRect.width - half - margin));
    tooltip.style.left = clamped + 'px';
    const arrowShift = Math.max(-(half - 16), Math.min(half - 16, center - clamped));
    tooltip.style.setProperty('--arrow-x', arrowShift + 'px');
    const gap = 8;
    const h = tooltip.offsetHeight;
    let top = wordRect.top - stageRect.top - h - gap;          // encima de la palabra
    const below = top < -2;
    if(below) top = wordRect.bottom - stageRect.top + gap;      // si arriba no cabe: debajo
    tooltip.style.top = top + 'px';
    tooltip.classList.toggle('tip-below', below);
  }

  // ---------- Traducción rápida al hacer click en cualquier palabra ----------
  // Reutiliza el mismo flotante que aparece al tipear (con el ícono de
  // guardar al costado). Se muestra sobre la palabra clickeada, reproduce
  // su pronunciación, y después de un momento vuelve a mostrar la palabra
  // que se está tipeando (o se oculta si no hay sesión activa).
  let tooltipOverrideIndex = null;
  let tooltipOverrideTimer = null;

  function getTooltipIndex(){
    return tooltipOverrideIndex != null ? tooltipOverrideIndex : currentIndex;
  }

  function restoreTooltipToCurrentWord(){
    resetLiveState();
    const wordEls = wordsContainer.querySelectorAll('.word');
    const activeEl = wordEls[currentIndex];
    if(!activeEl || currentIndex >= words.length || !typeScreen || typeScreen.hidden){
      tooltip.classList.remove('show');
      refreshSaveButtonState();
      return;
    }
    // Si la auto-traducción está desactivada, al terminar el momento de
    // click sobre una palabra el flotante simplemente se oculta, en vez
    // de quedarse mostrando la palabra actual todo el tiempo.
    if(!autoMode){
      tooltip.classList.remove('show');
      refreshSaveButtonState();
      return;
    }
    positionTooltip(activeEl);
    refreshSaveButtonState();
    const cacheKey = selectedLang + ':' + cleanWord(words[currentIndex]);
    const cached = translationCache[cacheKey];
    if(cached){
      const pinyinMatch = /^(.*) \(([^)]+)\)$/.exec(cached);
      if(pinyinMatch){
        tooltipText.innerHTML = `${escapeHtml2(pinyinMatch[1])} <span class="pinyin">${escapeHtml2(pinyinMatch[2])}</span>`;
      }else{
        tooltipText.textContent = cached;
      }
    }
  }

  async function showWordClickTranslation(wordEl){
    if(!wordEl) return;
    const idx = parseInt(wordEl.dataset.index, 10);
    const word = words[idx];
    if(!word) return;

    if(tooltipOverrideTimer){ clearTimeout(tooltipOverrideTimer); tooltipOverrideTimer = null; }
    tooltipOverrideIndex = idx;
    resetLiveState();

    tooltipText.textContent = '...';
    tooltip.classList.add('show');
    positionTooltip(wordEl);
    refreshSaveButtonState();
    speakWord(word);

    const translation = await getTranslation(word, idx);
    if(tooltipOverrideIndex === idx){
      const pinyinMatch = /^(.*) \(([^)]+)\)$/.exec(translation);
      if(pinyinMatch){
        tooltipText.innerHTML = `${escapeHtml2(pinyinMatch[1])} <span class="pinyin">${escapeHtml2(pinyinMatch[2])}</span>`;
      }else{
        tooltipText.textContent = translation;
      }
      positionTooltip(wordEl);
    }

    tooltipOverrideTimer = setTimeout(() => {
      tooltipOverrideIndex = null;
      tooltipOverrideTimer = null;
      restoreTooltipToCurrentWord();
    }, 3500); // un poco más de tiempo para poder tocar el wifi o guardar
  }

  hiddenInput.addEventListener('input', (e) => {
    if(startTime === null) startTime = Date.now();
    const value = hiddenInput.value;

    if(value.endsWith(' ')){
      commitWord(value.trim());
      hiddenInput.value = '';
      return;
    }
    paintCurrentWord(value);
    updateLiveWpm();
  });

  hiddenInput.addEventListener('keydown', (e) => {
    if(e.key === 'Enter'){
      e.preventDefault();
      const value = hiddenInput.value;
      commitWord(value.trim());
      hiddenInput.value = '';
    }
  });

  function paintCurrentWord(typed){
    const wordEls = wordsContainer.querySelectorAll('.word');
    const activeEl = wordEls[currentIndex];
    if(!activeEl) return;
    const target = words[currentIndex];
    const charEls = activeEl.querySelectorAll('.char');
    const maxLen = Math.max(typed.length, target.length);

    // remove extra char spans beyond target length first
    activeEl.querySelectorAll('.char.extra').forEach(el => el.remove());

    for(let i = 0; i < target.length; i++){
      const el = charEls[i];
      if(!el) continue;
      el.classList.remove('correct','incorrect');
      if(i < typed.length){
        el.classList.add(typed[i] === target[i] ? 'correct' : 'incorrect');
      }
    }
    if(typed.length > target.length){
      const extra = typed.slice(target.length);
      for(const ch of extra){
        const s = document.createElement('span');
        s.className = 'char extra';
        s.textContent = ch;
        activeEl.appendChild(s);
      }
    }
  }

  function commitWord(typed){
    const target = words[currentIndex];
    const len = Math.max(typed.length, target.length);
    for(let i = 0; i < len; i++){
      if(typed[i] === target[i] && typed[i] !== undefined) correctChars++;
      else incorrectChars++;
    }
    const wordEls = wordsContainer.querySelectorAll('.word');
    const activeEl = wordEls[currentIndex];
    if(activeEl) activeEl.classList.add('done');

    currentIndex++;
    if(currentIndex >= words.length){
      finishSession();
      return;
    }
    updateCurrentWordUI();
    prefetchAround(currentIndex);
    updateLiveWpm();
  }

  function updateLiveWpm(){
    if(!startTime) return;
    const minutes = (Date.now() - startTime) / 60000;
    const wpm = minutes > 0 ? Math.round((correctChars / 5) / minutes) : 0;
    liveWpmEl.textContent = wpm;
  }

  function finishSession(){
    stopAuto();
    autoMode = false;
    if(autoBtn) autoBtn.classList.remove('auto-active');
    hiddenInput.disabled = true;
    tooltip.classList.remove('show');
    cancelSpeech();
    hideSelTranslateUI();
    const minutes = startTime ? (Date.now() - startTime) / 60000 : 0;
    const wpm = minutes > 0 ? Math.round((correctChars / 5) / minutes) : 0;
    const totalChars = correctChars + incorrectChars;
    const acc = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 100;
    finalWpmEl.textContent = wpm;
    finalAccEl.textContent = acc + '%';
    typeScreen.hidden = true;
    resultScreen.hidden = false;
    if(voiceSelectWrap) voiceSelectWrap.hidden = true;
    setQuickActionsAuto(true);
    updateReviewSavedBtn();
    // Solo al finalizar el texto de la lista cuenta como leído (y muestra su %).
    if(sessionTextId && !isReviewSession) setTextProg(sessionTextId, { opened: true });
    onSessionFinished();
  }

  wordsContainer.addEventListener('click', (e) => {
    const wordEl = e.target.closest('.word');
    if(wordEl) showWordClickTranslation(wordEl);
  });

  // ---------- Traducción de un tramo seleccionado con el mouse (varias palabras) ----------
  // El usuario arrastra el mouse sobre dos o más palabras del texto a tipear.
  // Al soltar el botón, si la selección abarca más de una palabra, aparece un
  // botoncito "Traducir" flotante sobre la selección. Al hacer click se traduce
  // la frase completa (del idioma que se está practicando, de vuelta al español)
  // y el resultado se muestra en una burbuja, reutilizando los mismos endpoints
  // de traducción que ya usa la app.
  const selPhraseCache = {};

  // Una selección se considera "guardada" cuando todas sus palabras ya
  // están guardadas individualmente (cada una con su propia entrada,
  // igual que si se hubieran guardado una por una mientras se tipeaba).
  function isPhraseSaved(wordsList){
    if(!wordsList || !wordsList.length) return false;
    return wordsList.every(w => isWordSaved(w));
  }

  // Traduce (si hace falta) y guarda cada palabra de la selección como una
  // entrada independiente en "palabras para recordar", en vez de guardar
  // toda la frase pegada como si fuera una sola palabra.
  async function addSavedPhraseWords(wordsList){
    for(const w of wordsList){
      if(isWordSaved(w)) continue;
      const translation = await getTranslation(w);
      addSavedWord(w, translation && translation !== '?' ? translation : '');
    }
  }

  function removeSavedPhraseWords(wordsList){
    wordsList.forEach(w => {
      const key = savedKey(w);
      allSavedWords = allSavedWords.filter(sw => !(sw.key === key && sw.lang === selectedLang));
    });
    persistSavedWords();
    renderSavedWordsPanel();
  }

  function refreshSelTranslateSaveState(){
    if(!selTranslateSaveBtn) return;
    const t = LANGS[selectedLang];
    const saved = isPhraseSaved(pendingSelectionWords);
    selTranslateSaveBtn.classList.toggle('saved-active', saved);
    const label = saved ? t.saveWordBtnActive : t.saveWordBtn;
    selTranslateSaveBtn.title = label;
    selTranslateSaveBtn.setAttribute('aria-label', label);
  }

  async function toggleSelTranslateSaved(){
    if(!pendingSelectionWords.length) return;
    const wordsList = pendingSelectionWords.slice();
    if(isPhraseSaved(wordsList)){
      removeSavedPhraseWords(wordsList);
      refreshSelTranslateSaveState();
    }else{
      selTranslateSaveBtn.classList.add('saving-active');
      await addSavedPhraseWords(wordsList);
      selTranslateSaveBtn.classList.remove('saving-active');
      refreshSelTranslateSaveState();
    }
  }

  if(selTranslateSaveBtn){
    selTranslateSaveBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleSelTranslateSaved();
    });
  }

  if(selTranslatePlayBtn){
    selTranslatePlayBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      e.stopPropagation();
      if(!pendingSelectionText || !('speechSynthesis' in window)) return;
      try{ window.speechSynthesis.cancel(); }catch(err){ /* ignore */ }
      const lang = (LANGS[selectedLang] && LANGS[selectedLang].speechLang) || 'en-US';
      selTranslatePlayBtn.classList.add('playing-active');
      await speakUtterance(pendingSelectionText, lang, 0.85);
      selTranslatePlayBtn.classList.remove('playing-active');
    });
  }

  function positionSelUI(el, rect){
    const stageEl = wordsContainer.parentElement;
    const stageRect = stageEl.getBoundingClientRect();
    let left = rect.left - stageRect.left + rect.width / 2;
    left = Math.max(30, Math.min(left, stageRect.width - 30));
    el.style.left = left + 'px';
    const top = rect.top - stageRect.top - 38;
    el.style.top = Math.max(6, top) + 'px';
  }

  function hideSelTranslateUI(){
    selTranslateBtn.classList.remove('show');
    selTranslateBubble.classList.remove('show');
    if(selTranslatePlayBtn && selTranslatePlayBtn.classList.contains('playing-active')){
      selTranslatePlayBtn.classList.remove('playing-active');
      try{ window.speechSynthesis.cancel(); }catch(err){ /* ignore */ }
    }
    wordsContainer.querySelectorAll('.word.phrase-picked').forEach(el => el.classList.remove('phrase-picked'));
    pendingSelectionText = '';
    pendingSelectionWords = [];
    currentSelTranslationText = '';
  }

  // Las palabras se renderizan como spans contiguos sin un espacio real entre
  // ellos (el espacio visual es solo margen CSS), así que selection.toString()
  // devuelve el texto pegado (ej. "Laociosidades"). Por eso, para saber cuántas
  // palabras tocó la selección y para armar la frase a traducir con espacios
  // correctos, se mira qué elementos .word intersecta el Range, y se reconstruye
  // el texto a partir del array `words` original.
  function getSelectedWordRange(range){
    const wordEls = wordsContainer.querySelectorAll('.word');
    let minIdx = null, maxIdx = null;
    wordEls.forEach(el => {
      if(range.intersectsNode(el)){
        const idx = parseInt(el.dataset.index, 10);
        if(minIdx === null || idx < minIdx) minIdx = idx;
        if(maxIdx === null || idx > maxIdx) maxIdx = idx;
      }
    });
    if(minIdx === null) return null;
    return { minIdx, maxIdx };
  }

  async function translateSelectedPhrase(text){
    const sl = LANGS[selectedLang].tl;
    const cacheKey = selectedLang + ':' + text.toLowerCase();
    if(selPhraseCache[cacheKey]) return selPhraseCache[cacheKey];

    try{
      const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sl}&tl=es&dt=t&q=${encodeURIComponent(text)}`);
      if(res.ok){
        const data = await res.json();
        if(data && Array.isArray(data[0])){
          const joined = data[0].map(chunk => chunk && chunk[0] ? chunk[0] : '').join('');
          if(joined.trim()){
            selPhraseCache[cacheKey] = joined.trim();
            return selPhraseCache[cacheKey];
          }
        }
      }
    }catch(e){ /* sigue al respaldo */ }

    try{
      const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sl.split('-')[0]}|es`);
      const data = await res.json();
      const translated = data && data.responseData && data.responseData.translatedText;
      if(translated){
        selPhraseCache[cacheKey] = translated;
        return selPhraseCache[cacheKey];
      }
    }catch(e){ /* nada más para intentar */ }

    return '';
  }

  // isTouchDevice: en celulares, el arrastre de la selección se hace con los
  // "handles" nativos del sistema operativo, que no siempre disparan mouseup
  // sobre el contenedor. Por eso usamos 'selectionchange' (dispara siempre que
  // cambia la selección, sea con mouse o con los handles táctiles).
  const isTouchDevice = window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  if(isTouchDevice){
    selTranslateBtn.classList.add('touch-mode');
    selTranslateBubble.classList.add('touch-mode');
    // En táctil no usamos la selección real del navegador (ver comentario en
    // el CSS de .touch-nosel): así el sistema nunca muestra su propia barra
    // de "Traducir / Copiar / Compartir" tapando nuestra UI.
    wordsContainer.classList.add('touch-nosel');
    // Estos dos elementos quedan fijos y centrados en pantalla (ver CSS
    // .touch-mode), así que no necesitan vivir dentro de .stage/.app. Los
    // sacamos al <body> para que escapen del stacking context de .app
    // (position:relative + z-index:1) y su z-index:9999 gane de verdad
    // contra la barra de botones fija de arriba (#savedControlsWrap,
    // z-index:20), en vez de quedar atrapados "detrás" de todo .app.
    document.body.appendChild(selTranslateBtn);
    document.body.appendChild(selTranslateBubble);
  }

  function updateSelectionTranslateUI(){
    if(!typeScreen || typeScreen.hidden){ hideSelTranslateUI(); return; }

    const selection = window.getSelection();
    if(!selection || selection.rangeCount === 0){ hideSelTranslateUI(); return; }
    const rawText = selection.toString().trim();

    if(!rawText || selection.isCollapsed ||
       !selection.anchorNode || !selection.focusNode ||
       !wordsContainer.contains(selection.anchorNode) ||
       !wordsContainer.contains(selection.focusNode)){
      hideSelTranslateUI();
      return;
    }

    const range = selection.getRangeAt(0);
    const wordRange = getSelectedWordRange(range);
    if(!wordRange || wordRange.maxIdx <= wordRange.minIdx){
      hideSelTranslateUI();
      return;
    }

    const phraseWords = words.slice(wordRange.minIdx, wordRange.maxIdx + 1);
    const joiner = selectedLang === 'zh' ? '' : ' ';
    pendingSelectionText = phraseWords.join(joiner);
    pendingSelectionWords = phraseWords.slice();

    selTranslateBubble.classList.remove('show');
    if(!isTouchDevice){
      // En PC lo anclamos justo sobre la selección.
      positionSelUI(selTranslateBtn, range.getBoundingClientRect());
    }
    // En celular queda fijo abajo de la pantalla (ver CSS .touch-mode), lejos
    // de la barra nativa de copiar/pegar que el sistema pone sobre lo seleccionado.
    selTranslateBtn.classList.add('show');
  }

  let selChangeTimer = null;
  if(!isTouchDevice){
    // En escritorio sí usamos la selección real del navegador: ahí no existe
    // esa barra flotante de Android, así que no hay nada que tapar.
    document.addEventListener('selectionchange', () => {
      if(selChangeTimer) clearTimeout(selChangeTimer);
      selChangeTimer = setTimeout(updateSelectionTranslateUI, 120);
    });
  }

  wordsContainer.addEventListener('scroll', hideSelTranslateUI);

  // ---------- Selección táctil manual (sin usar window.getSelection) ----------
  // Mantener presionada una palabra y arrastrar sobre las demás arma la frase,
  // igual que antes, pero sin crear una selección real de texto: por eso el
  // sistema operativo nunca dispara su propia barra "Traducir/Copiar/Compartir".
  if(isTouchDevice){
    let touchTimer = null;
    let dragging = false;
    let startIdx = null, startX = 0, startY = 0;
    let suppressNextClick = false;

    function clearPhrasePickHighlight(){
      wordsContainer.querySelectorAll('.word.phrase-picked').forEach(el => el.classList.remove('phrase-picked'));
    }

    function applyPhrasePick(minIdx, maxIdx){
      clearPhrasePickHighlight();
      wordsContainer.querySelectorAll('.word').forEach(el => {
        const idx = parseInt(el.dataset.index, 10);
        if(idx >= minIdx && idx <= maxIdx) el.classList.add('phrase-picked');
      });
    }

    function wordIdxAtPoint(x, y){
      const el = document.elementFromPoint(x, y);
      const wordEl = el && el.closest ? el.closest('.word') : null;
      if(!wordEl || !wordsContainer.contains(wordEl)) return null;
      return parseInt(wordEl.dataset.index, 10);
    }

    function endDrag(commit){
      if(touchTimer){ clearTimeout(touchTimer); touchTimer = null; }
      let committed = false;
      if(dragging && commit && startIdx !== null){
        const picked = wordsContainer.querySelectorAll('.word.phrase-picked');
        let minIdx = null, maxIdx = null;
        picked.forEach(el => {
          const idx = parseInt(el.dataset.index, 10);
          if(minIdx === null || idx < minIdx) minIdx = idx;
          if(maxIdx === null || idx > maxIdx) maxIdx = idx;
        });
        if(minIdx !== null && maxIdx > minIdx){
          const phraseWords = words.slice(minIdx, maxIdx + 1);
          const joiner = selectedLang === 'zh' ? '' : ' ';
          pendingSelectionText = phraseWords.join(joiner);
          pendingSelectionWords = phraseWords.slice();
          selTranslateBubble.classList.remove('show');
          selTranslateBtn.classList.add('show');
          suppressNextClick = true;
          committed = true;
        }
      }
      // Si se confirmó una frase, dejamos las palabras sombreadas hasta que
      // se cierre el botón/burbuja de traducción (ver hideSelTranslateUI),
      // para que se note claramente cuál es el conjunto que se está traduciendo.
      if(dragging && !committed) clearPhrasePickHighlight();
      dragging = false;
      startIdx = null;
    }

    wordsContainer.addEventListener('touchstart', (e) => {
      const idx = wordIdxAtPoint(e.touches[0].clientX, e.touches[0].clientY);
      if(idx === null) return;
      startIdx = idx;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      if(touchTimer) clearTimeout(touchTimer);
      touchTimer = setTimeout(() => {
        dragging = true;
        hideSelTranslateUI();
        applyPhrasePick(startIdx, startIdx);
      }, 320);
    }, { passive: true });

    wordsContainer.addEventListener('touchmove', (e) => {
      if(!dragging){
        // Si se mueve mucho antes del long-press, es un scroll normal: cancelamos.
        const dx = Math.abs(e.touches[0].clientX - startX);
        const dy = Math.abs(e.touches[0].clientY - startY);
        if(dx > 12 || dy > 12){
          if(touchTimer){ clearTimeout(touchTimer); touchTimer = null; }
        }
        return;
      }
      e.preventDefault();
      const idx = wordIdxAtPoint(e.touches[0].clientX, e.touches[0].clientY);
      if(idx === null) return;
      const minIdx = Math.min(startIdx, idx);
      const maxIdx = Math.max(startIdx, idx);
      applyPhrasePick(minIdx, maxIdx);
    }, { passive: false });

    wordsContainer.addEventListener('touchend', () => endDrag(true));
    wordsContainer.addEventListener('touchcancel', () => endDrag(false));

    wordsContainer.addEventListener('click', (e) => {
      if(suppressNextClick){
        suppressNextClick = false;
        e.stopImmediatePropagation();
        e.preventDefault();
      }
    }, true);
  }

  selTranslateBtn.addEventListener('click', async () => {
    if(!pendingSelectionText) return;
    const text = pendingSelectionText;
    const btnRect = selTranslateBtn.getBoundingClientRect();

    selTranslateBtn.classList.remove('show');
    selTranslateBubbleText.textContent = '...';
    currentSelTranslationText = '';
    refreshSelTranslateSaveState();
    if(!isTouchDevice) positionSelUI(selTranslateBubble, btnRect);
    selTranslateBubble.classList.add('show');

    const translation = await translateSelectedPhrase(text);
    currentSelTranslationText = translation || '';
    selTranslateBubbleText.textContent = translation || '?';
    refreshSelTranslateSaveState();
  });

  document.addEventListener('mousedown', (e) => {
    if(e.target.closest('#selTranslateBtn') || e.target.closest('#selTranslateBubble')) return;
    if(selTranslateBubble.classList.contains('show')) hideSelTranslateUI();
  });
  document.addEventListener('touchstart', (e) => {
    if(e.target.closest('#selTranslateBtn') || e.target.closest('#selTranslateBubble')) return;
    if(selTranslateBubble.classList.contains('show')) hideSelTranslateUI();
  });

  applyLang('en');

  // ---------- Subtítulo en español dentro de los botones principales ----------
  // La interfaz cambia por completo al idioma elegido (inglés/portugués/
  // chino), lo que hace difícil de navegar para alguien que recién empieza
  // y todavía no conoce ese idioma. Estos pequeños subtítulos en español,
  // fijos sin importar el idioma de la interfaz, ayudan a ubicarse.
  const ES_SUBTITLES = {
    speakToggleBtn: 'voz',
    listenBtn: 'escuchar',
    savedToggle: 'palabras',
    subtitlesToggleBtn: 'traducir página',
    interactiveReviewBtn: 'recuerdo interactivo',
    interactiveReviewBtnPanel: 'recuerdo interactivo',
    exportWordsBtn: 'exportar palabras guardadas',
    exportWordsBtnPanel: 'exportar palabras guardadas',
    selTranslateBtn: 'traducir'
  };
  Object.keys(ES_SUBTITLES).forEach(id => {
    const el = document.getElementById(id);
    if(!el || el.querySelector('.es-sub')) return;
    const sub = document.createElement('span');
    sub.className = 'es-sub';
    sub.textContent = ES_SUBTITLES[id];
    el.classList.add('has-es-sub');
    el.appendChild(sub);
  });

  // ===================== Tiempo de práctica (meta diaria, racha) =====================
  // Cuenta solo el tiempo ACTIVO: página visible y con actividad en el último
  // minuto (o con el modo automático / la voz funcionando). Todo se guarda en
  // este navegador: zeltha_time_v1 = { goalMin, goalSet, hintShown, celebrated,
  // days: { 'AAAA-MM-DD': { s: segundos, g: meta en minutos ese día } } }
  const TIME_KEY = 'zeltha_time_v1';
  const GOAL_CHOICES = [5, 10, 15, 20, 30, 45, 60];
  const IDLE_MS = 60000;
  const STREAK_MILESTONES = [3, 7, 14, 30, 60, 100, 365];
  let timeCounting = false; // true mientras el reloj está corriendo (hay actividad)
  const timeChip = document.getElementById('timeChip');
  const timeChipLabel = document.getElementById('timeChipLabel');
  const timeModalOverlay = document.getElementById('timeModalOverlay');
  const timeModalBody = document.getElementById('timeModalBody');
  const timeModalClose = document.getElementById('timeModalClose');
  const zToast = document.getElementById('zToast');

  function dayKey(d){
    d = d || new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }
  function defaultTimeData(){ return { goalMin: 10, goalSet: false, goalUpdatedAt: 0, hintShown: false, celebrated: '', days: {} }; }
  function loadTime(){
    try{
      const d = JSON.parse(localStorage.getItem(TIME_KEY));
      if(d && typeof d === 'object') return Object.assign(defaultTimeData(), d, { days: d.days || {} });
    }catch(e){ /* ignore */ }
    return defaultTimeData();
  }
  function saveTime(d){ try{ localStorage.setItem(TIME_KEY, JSON.stringify(d)); }catch(e){ /* ignore */ } }

  let timeData = loadTime();
  let pendingSec = 0;
  let lastActivity = 0; // nada cuenta hasta que haya una acción real en la práctica
  let lastTick = Date.now();

  ['pointerdown', 'keydown', 'touchstart', 'mousemove', 'wheel', 'scroll'].forEach(ev =>
    window.addEventListener(ev, () => { lastActivity = Date.now(); }, { passive: true, capture: true }));

  function todayInfo(){
    const day = timeData.days[dayKey()];
    return { sec: (day ? day.s : 0) + pendingSec, goalMin: day ? day.g : timeData.goalMin };
  }

  let toastTimer = null;
  function showToast(msg, ms){
    if(!zToast) return;
    zToast.textContent = msg;
    zToast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => zToast.classList.remove('show'), ms || 3500);
  }

  function metDay(d, k){ const x = d.days[k]; return !!x && x.s >= x.g * 60; }

  // Racha = días seguidos cumpliendo la meta. Hoy aún puede cumplirse. Se perdona
  // 1 día fallado por mes calendario ("día de gracia") para que un tropiezo no borre todo.
  function computeStreak(d){
    let streak = 0;
    const graceUsed = {};
    const cur = new Date();
    if(!metDay(d, dayKey(cur))) cur.setDate(cur.getDate() - 1);
    for(let i = 0; i < 500; i++){
      const k = dayKey(cur);
      if(metDay(d, k)) streak++;
      else{
        const mk = k.slice(0, 7);
        if(graceUsed[mk]) break;
        graceUsed[mk] = true;
      }
      cur.setDate(cur.getDate() - 1);
    }
    return { streak: streak, graceUsedMonth: !!graceUsed[dayKey().slice(0, 7)] };
  }

  function celebrateGoal(){
    const k = dayKey();
    if(timeData.celebrated === k) return;
    timeData.celebrated = k;
    saveTime(timeData);
    const streak = computeStreak(timeData).streak;
    let msg = '¡Meta de hoy cumplida! 🔥';
    if(streak >= 2) msg += ' Racha de ' + streak + ' días';
    if(STREAK_MILESTONES.indexOf(streak) !== -1) msg = '🏆 ¡' + streak + ' días seguidos! Eso es constancia de verdad.';
    showToast(msg, 5500);
    if(timeChip){
      timeChip.classList.add('just-met');
      setTimeout(() => timeChip.classList.remove('just-met'), 2600);
    }
  }

  function flushTime(){
    if(pendingSec <= 0) return;
    const fresh = loadTime(); // por si hay otra pestaña abierta
    const k = dayKey();
    const day = fresh.days[k] || { s: 0, g: fresh.goalMin };
    const before = day.s;
    day.s = Math.round((day.s + pendingSec) * 10) / 10;
    pendingSec = 0;
    fresh.days[k] = day;
    timeData = fresh;
    saveTime(fresh);
    if(before < day.g * 60 && day.s >= day.g * 60) celebrateGoal();
    updateTimeChip();
    if(timeModalOverlay && !timeModalOverlay.hidden) renderTimePanel();
  }

  // 00:03:27 (horas:minutos:segundos)
  function fmtClock(sec){
    sec = Math.floor(sec);
    const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = sec % 60;
    return String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
  }

  function updateTimeChip(){
    const t = todayInfo();
    const frac = Math.min(t.sec / (t.goalMin * 60), 1);
    if(timeChipLabel) timeChipLabel.textContent = fmtClock(t.sec);
    const dot = document.getElementById('timeDot');
    if(dot) dot.classList.toggle('on', timeCounting);
    if(timeChip){
      timeChip.classList.toggle('goal-met', frac >= 1);
      timeChip.classList.toggle('counting', timeCounting);
      timeChip.title = 'Hoy: ' + fmtClock(t.sec) + ' de ' + t.goalMin + ' min — ' +
        (timeCounting ? 'contando' : 'en pausa (cuenta solo mientras practicas)') + '. Toca para ver tu constancia';
    }
    // si el panel está abierto, su reloj también corre en vivo
    const big = document.getElementById('timeBigClock');
    if(big){
      big.textContent = fmtClock(t.sec);
      const bar = document.getElementById('timeHeroBar');
      if(bar){
        const C = parseFloat(bar.getAttribute('stroke-dasharray'));
        bar.setAttribute('stroke-dashoffset', String(C * (1 - frac)));
        bar.classList.toggle('met', frac >= 1);
      }
    }
  }

  // Práctica real = hay un texto abierto o un repaso en marcha, y ningún panel encima.
  // Pantalla de inicio, lista de textos, resultados y paneles → en pausa.
  function practiceActive(){
    const panelIds = ['sampleModalOverlay', 'timeModalOverlay', 'exportModalOverlay', 'reviewModalOverlay'];
    const panelOpen = (savedPanel && savedPanel.classList.contains('open')) ||
      panelIds.some(id => { const el = document.getElementById(id); return !!el && !el.hidden; });
    if(panelOpen) return false;
    if(reviewOverlay && reviewOverlay.classList.contains('open')) return true; // "Recuerdo interactivo"
    return !!(typeScreen && !typeScreen.hidden); // texto abierto o repaso de palabras guardadas
  }

  function tickTime(){
    const now = Date.now();
    const dt = Math.min((now - lastTick) / 1000, 2);
    lastTick = now;
    let active = document.visibilityState === 'visible' && practiceActive();
    if(active){
      if(autoMode || (window.speechSynthesis && window.speechSynthesis.speaking)) lastActivity = now;
      active = (now - lastActivity) <= IDLE_MS;
    }
    timeCounting = active;
    if(active) pendingSec += dt;
    if(active && pendingSec >= 5) flushTime(); else updateTimeChip();
  }

  function fmtDuration(sec){
    const m = Math.floor(sec / 60);
    return m < 60 ? m + ' min' : Math.floor(m / 60) + ' h ' + (m % 60) + ' min';
  }

  function renderTimePanel(){
    if(!timeModalBody) return;
    const t = todayInfo();
    const frac = Math.min(t.sec / (t.goalMin * 60), 1);
    const met = frac >= 1;
    const left = Math.max(0, Math.ceil((t.goalMin * 60 - t.sec) / 60));
    const R = 74, C = 2 * Math.PI * R;
    const streakInfo = computeStreak(timeData);

    const days7 = [];
    for(let i = 6; i >= 0; i--){
      const d = new Date();
      d.setDate(d.getDate() - i);
      const x = timeData.days[dayKey(d)];
      days7.push({
        label: 'DLMXJVS'.charAt(d.getDay()),
        s: i === 0 ? t.sec : (x ? x.s : 0),
        g: i === 0 ? t.goalMin : (x ? x.g : timeData.goalMin),
        today: i === 0
      });
    }
    const scale = Math.max.apply(null, days7.map(d => Math.max(d.s, d.g * 60)).concat([1]));
    const weekSec = days7.reduce((a, d) => a + d.s, 0);
    let totalSec = pendingSec;
    Object.keys(timeData.days).forEach(k => { totalSec += timeData.days[k].s; });

    const msg = met ? '¡Meta cumplida! 🔥'
      : (t.sec < 30 ? 'Unos minutos al día bastan: lo difícil es empezar.' : 'Te faltan ' + left + ' min para tu meta de hoy');

    timeModalBody.innerHTML =
      '<div class="time-hero">' +
        '<svg viewBox="0 0 170 170" width="170" height="170" aria-hidden="true">' +
          '<circle class="trk" cx="85" cy="85" r="' + R + '"/>' +
          '<circle class="bar' + (met ? ' met' : '') + '" id="timeHeroBar" cx="85" cy="85" r="' + R + '" stroke-dasharray="' + C + '" stroke-dashoffset="' + (C * (1 - frac)) + '"/>' +
        '</svg>' +
        '<div class="time-hero-center"><div class="time-big" id="timeBigClock">' + fmtClock(t.sec) + '</div><div class="time-sub">meta: ' + t.goalMin + ' min</div></div>' +
      '</div>' +
      '<div class="time-msg">' + msg + '</div>' +
      '<div class="time-section-label">Meta diaria</div>' +
      '<div class="time-goal-row">' +
        GOAL_CHOICES.map(m => '<button type="button" class="time-goal-chip' + (m === t.goalMin ? ' on' : '') + '" data-min="' + m + '">' + m + ' min</button>').join('') +
      '</div>' +
      '<div class="time-stats">' +
        '<div class="time-stat"><div class="time-stat-big">' + streakInfo.streak + ' 🔥</div><div class="time-stat-label">días de racha</div></div>' +
        '<div class="time-stat"><div class="time-stat-big">' + fmtDuration(weekSec) + '</div><div class="time-stat-label">últimos 7 días</div></div>' +
        '<div class="time-stat"><div class="time-stat-big">' + fmtDuration(totalSec) + '</div><div class="time-stat-label">en total</div></div>' +
      '</div>' +
      '<div class="time-section-label">Esta semana</div>' +
      '<div class="time-week">' +
        days7.map(d =>
          '<div class="time-bar-col"><div class="time-bar-track">' +
            '<div class="time-bar-fill' + (d.s >= d.g * 60 ? ' met' : '') + '" style="height:' + Math.round(100 * d.s / scale) + '%"></div>' +
            '<div class="time-bar-goal" style="bottom:' + Math.round(100 * d.g * 60 / scale) + '%"></div>' +
          '</div><span class="time-bar-day' + (d.today ? ' today' : '') + '">' + d.label + '</span></div>').join('') +
      '</div>' +
      '<p class="time-note">🛡️ Día de gracia de este mes: <b>' + (streakInfo.graceUsedMonth ? 'usado' : 'disponible') + '</b>. Si fallas un día, tu racha no se rompe.<br>El reloj cuenta solo mientras practicas (con un texto abierto o un repaso en marcha) y haces algo cada minuto.</p>';
  }

  function setGoal(min){
    flushTime();
    timeData = loadTime();
    timeData.goalMin = min;
    timeData.goalSet = true;
    timeData.goalUpdatedAt = Date.now();
    const day = timeData.days[dayKey()];
    if(day) day.g = min;
    saveTime(timeData);
    updateTimeChip();
    renderTimePanel();
    const t = todayInfo();
    if(t.sec >= t.goalMin * 60 && timeData.celebrated !== dayKey()) celebrateGoal();
  }

  function openTimePanel(){
    flushTime();
    renderTimePanel();
    if(timeModalOverlay) timeModalOverlay.hidden = false;
  }
  function closeTimePanel(){ if(timeModalOverlay) timeModalOverlay.hidden = true; }

  // Al terminar un texto: aviso de cuánto falta para la meta (o nada si ya se cumplió).
  function onSessionFinished(){
    flushTime();
    const day = timeData.days[dayKey()];
    if(!day || day.s >= day.g * 60) return;
    const left = Math.ceil((day.g * 60 - day.s) / 60);
    showToast('Buen trabajo 👏 Te faltan ' + left + ' min para tu meta de hoy', 5000);
  }

  if(timeChip) timeChip.addEventListener('click', openTimePanel);
  if(timeModalClose) timeModalClose.addEventListener('click', closeTimePanel);
  if(timeModalOverlay) timeModalOverlay.addEventListener('click', (e) => { if(e.target === timeModalOverlay) closeTimePanel(); });
  if(timeModalBody) timeModalBody.addEventListener('click', (e) => {
    const chip = e.target.closest('.time-goal-chip');
    if(chip) setGoal(parseInt(chip.dataset.min, 10));
  });
  document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape' && timeModalOverlay && !timeModalOverlay.hidden) closeTimePanel();
  });
  document.addEventListener('visibilitychange', () => {
    if(document.visibilityState === 'hidden') flushTime(); else lastTick = Date.now();
  });
  window.addEventListener('pagehide', flushTime);

  // ===================== Copia de seguridad: exportar / importar progreso =====================
  // Manual y sin cuentas: se genera un archivo (o un texto) con el progreso y en el
  // otro dispositivo se importa. Al importar se COMBINA con lo que ya hay:
  //  · palabras guardadas: se suman las que falten (no se borra ninguna)
  //  · textos: se suman los "finalizados" y los ✓ de entendido
  //  · tiempo: de cada día queda el valor mayor (así importar dos veces no duplica minutos)
  //  · meta diaria: queda la que se cambió más recientemente
  // No se copian preferencias propias de cada aparato (voz, velocidad, efectos).
  const SYNC_VERSION = 1;
  const syncMsg = document.getElementById('syncMsg');
  const syncPasteBox = document.getElementById('syncPasteBox');
  const syncPasteArea = document.getElementById('syncPasteArea');
  const syncFileInput = document.getElementById('syncFileInput');

  function setSyncMsg(text, isError){
    if(!syncMsg) return;
    syncMsg.textContent = text || '';
    syncMsg.classList.toggle('error', !!isError);
  }

  function buildProgressSnapshot(){
    flushTime();
    return {
      app: 'zeltha',
      version: SYNC_VERSION,
      exportedAt: new Date().toISOString(),
      savedWords: allSavedWords,
      textProgress: textProgress,
      time: {
        goalMin: timeData.goalMin,
        goalSet: timeData.goalSet,
        goalUpdatedAt: timeData.goalUpdatedAt || 0,
        celebrated: timeData.celebrated,
        days: timeData.days
      }
    };
  }

  function mergeProgress(snap){
    const sum = { words: 0, texts: 0, days: 0, goal: false };

    // --- palabras guardadas ---
    (Array.isArray(snap.savedWords) ? snap.savedWords : []).forEach(sw => {
      if(!sw || typeof sw.key !== 'string' || typeof sw.word !== 'string' || !sw.key) return;
      const lang = (typeof sw.lang === 'string' && sw.lang) ? sw.lang : 'en';
      const mine = allSavedWords.find(x => x.key === sw.key && x.lang === lang);
      if(mine){
        if(!mine.translation && sw.translation) mine.translation = String(sw.translation).slice(0, 300);
        return;
      }
      allSavedWords.push({
        key: sw.key.slice(0, 100),
        word: sw.word.slice(0, 100),
        translation: String(sw.translation || '').slice(0, 300),
        lang: lang,
        savedAt: typeof sw.savedAt === 'string' ? sw.savedAt : new Date().toISOString()
      });
      sum.words++;
    });
    persistSavedWords();
    renderSavedWordsPanel();
    updateReviewSavedBtn();

    // --- progreso por texto ---
    const tp = snap.textProgress;
    if(tp && typeof tp === 'object'){
      Object.keys(tp).forEach(id => {
        if(!TEXT_ITEM_BY_ID[id] || !tp[id] || typeof tp[id] !== 'object') return;
        Object.keys(tp[id]).forEach(lang => {
          const src = tp[id][lang] || {};
          const cur = (textProgress[id] && textProgress[id][lang]) || {};
          const opened = !!(cur.opened || src.opened);
          const mastered = !!(cur.mastered || src.mastered);
          if(opened === !!cur.opened && mastered === !!cur.mastered) return;
          const out = {};
          if(opened) out.opened = true;
          if(mastered) out.mastered = true;
          textProgress[id] = textProgress[id] || {};
          textProgress[id][lang] = out;
          sum.texts++;
        });
      });
      try{ localStorage.setItem(TEXT_PROGRESS_KEY, JSON.stringify(textProgress)); }catch(e){ /* ignore */ }
    }

    // --- tiempo y meta ---
    const t = snap.time;
    if(t && typeof t === 'object'){
      flushTime();
      const mine = loadTime();
      const days = (t.days && typeof t.days === 'object') ? t.days : {};
      Object.keys(days).forEach(k => {
        const d = days[k];
        if(!/^\d{4}-\d{2}-\d{2}$/.test(k) || !d || typeof d.s !== 'number' || !isFinite(d.s) || d.s < 0) return;
        const g = (typeof d.g === 'number' && d.g >= 1 && d.g <= 600) ? d.g : mine.goalMin;
        const cur = mine.days[k];
        if(!cur || d.s > cur.s){
          mine.days[k] = { s: Math.round(d.s * 10) / 10, g: g };
          sum.days++;
        }
      });
      if(typeof t.goalMin === 'number' && t.goalMin >= 1 && t.goalMin <= 600 && (t.goalUpdatedAt || 0) > (mine.goalUpdatedAt || 0)){
        mine.goalMin = t.goalMin;
        mine.goalSet = !!t.goalSet;
        mine.goalUpdatedAt = t.goalUpdatedAt;
        const today = mine.days[dayKey()];
        if(today) today.g = mine.goalMin;
        sum.goal = true;
      }
      if(typeof t.celebrated === 'string' && t.celebrated > (mine.celebrated || '')) mine.celebrated = t.celebrated;
      timeData = mine;
      saveTime(mine);
      updateTimeChip();
      renderTimePanel();
    }
    return sum;
  }

  function importProgressText(text){
    let snap = null;
    try{ snap = JSON.parse(String(text).trim()); }catch(e){ /* se avisa abajo */ }
    if(!snap || typeof snap !== 'object' || snap.app !== 'zeltha'){
      setSyncMsg('Eso no parece un progreso de Zeltha. Usa un archivo exportado desde la app, o pega el texto completo.', true);
      return;
    }
    if(typeof snap.version === 'number' && snap.version > SYNC_VERSION){
      setSyncMsg('Ese archivo viene de una versión más nueva de Zeltha. Actualiza la página (Ctrl+Shift+R) e inténtalo de nuevo.', true);
      return;
    }
    const sum = mergeProgress(snap);
    const parts = [];
    if(sum.words) parts.push(sum.words + (sum.words === 1 ? ' palabra nueva' : ' palabras nuevas'));
    if(sum.texts) parts.push(sum.texts + (sum.texts === 1 ? ' avance de texto' : ' avances de texto'));
    if(sum.days) parts.push(sum.days + (sum.days === 1 ? ' día de tiempo' : ' días de tiempo'));
    if(sum.goal) parts.push('meta diaria actualizada');
    setSyncMsg(parts.length ? 'Importado ✓ ' + parts.join(' · ') : 'Importado ✓ Ya tenías todo, no había nada nuevo.', false);
  }

  const syncExportBtn = document.getElementById('syncExportBtn');
  const syncImportBtn = document.getElementById('syncImportBtn');
  const syncCopyBtn = document.getElementById('syncCopyBtn');
  const syncPasteBtn = document.getElementById('syncPasteBtn');
  const syncPasteGo = document.getElementById('syncPasteGo');

  if(syncExportBtn) syncExportBtn.addEventListener('click', async () => {
    const json = JSON.stringify(buildProgressSnapshot(), null, 2);
    await shareOrDownload(json, 'zeltha-progreso-' + dayKey() + '.json', 'application/json', 'Progreso de Zeltha');
    setSyncMsg('Archivo listo. Llévalo al otro dispositivo (WhatsApp, Drive, correo…) y ahí toca "Importar archivo".', false);
  });
  if(syncImportBtn && syncFileInput) syncImportBtn.addEventListener('click', () => { syncFileInput.value = ''; syncFileInput.click(); });
  if(syncFileInput) syncFileInput.addEventListener('change', () => {
    const f = syncFileInput.files && syncFileInput.files[0];
    if(!f) return;
    const reader = new FileReader();
    reader.onload = () => importProgressText(reader.result);
    reader.onerror = () => setSyncMsg('No se pudo leer el archivo.', true);
    reader.readAsText(f);
  });
  if(syncCopyBtn) syncCopyBtn.addEventListener('click', async () => {
    const json = JSON.stringify(buildProgressSnapshot());
    try{
      await navigator.clipboard.writeText(json);
      setSyncMsg('Texto copiado. Pégalo en el otro dispositivo con "Pegar texto".', false);
    }catch(e){
      // si el navegador no deja copiar, se muestra el texto para copiarlo a mano
      if(syncPasteBox) syncPasteBox.hidden = false;
      if(syncPasteArea){ syncPasteArea.value = json; syncPasteArea.focus(); syncPasteArea.select(); }
      setSyncMsg('Tu navegador no permitió copiar solo: el texto quedó seleccionado, cópialo a mano.', true);
    }
  });
  if(syncPasteBtn) syncPasteBtn.addEventListener('click', () => {
    if(!syncPasteBox) return;
    syncPasteBox.hidden = !syncPasteBox.hidden;
    if(!syncPasteBox.hidden && syncPasteArea){ syncPasteArea.value = ''; syncPasteArea.focus(); }
  });
  if(syncPasteGo) syncPasteGo.addEventListener('click', () => {
    if(!syncPasteArea || !syncPasteArea.value.trim()){ setSyncMsg('Primero pega el texto copiado del otro dispositivo.', true); return; }
    importProgressText(syncPasteArea.value);
    if(syncPasteBox) syncPasteBox.hidden = true;
    syncPasteArea.value = '';
  });

  updateTimeChip();
  setInterval(tickTime, 1000);
  if(!timeData.goalSet && !timeData.hintShown){
    setTimeout(() => {
      timeData.hintShown = true;
      saveTime(timeData);
      showToast('⏱️ Elige cuántos minutos al día quieres practicar: toca el contador de arriba', 7000);
    }, 3000);
  }
})();
(function(){
  const numField = document.getElementById('numField');
  const mandalaField = document.getElementById('mandalaField');
  const bgFxToggleBtn = document.getElementById('bgFxToggleBtn');
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // La línea de escaneo (.bg-fx::after) es pura animación CSS y queda
  // siempre activa; lo que este bloque controla es si se siguen generando
  // mandalas y números flotantes, o no.
  let bgFxEnabled = true;
  try{
    const saved = localStorage.getItem('zeltha_bgfx_enabled');
    if(saved !== null) bgFxEnabled = saved === '1';
  }catch(e){ /* ignore */ }

  function clearBgFxFields(){
    if(mandalaField) mandalaField.innerHTML = '';
    if(numField) numField.innerHTML = '';
  }

  function updateBgFxToggleUI(){
    if(!bgFxToggleBtn) return;
    bgFxToggleBtn.classList.toggle('sub-active', bgFxEnabled);
    bgFxToggleBtn.setAttribute('aria-pressed', bgFxEnabled ? 'true' : 'false');
    bgFxToggleBtn.title = bgFxEnabled
      ? 'Desactivar efectos de fondo (mandalas y números)'
      : 'Activar efectos de fondo (mandalas y números)';
  }

  if(reduceMotion){
    // El sistema pide menos movimiento: dejamos el botón oculto y los
    // efectos apagados, tal como se comportaba la página originalmente.
    if(bgFxToggleBtn) bgFxToggleBtn.style.display = 'none';
    return;
  }

  updateBgFxToggleUI();
  if(!bgFxEnabled) clearBgFxFields();

  if(bgFxToggleBtn){
    bgFxToggleBtn.addEventListener('click', () => {
      bgFxEnabled = !bgFxEnabled;
      updateBgFxToggleUI();
      try{ localStorage.setItem('zeltha_bgfx_enabled', bgFxEnabled ? '1' : '0'); }catch(e){ /* ignore */ }
      if(!bgFxEnabled) clearBgFxFields();
    });
  }

  const vanishStyles = ['style-flash', 'style-explode', 'style-dissolve'];
  const mandalaStyles = [
    { cls: 'style-implode', dur: 8 },
    { cls: 'style-burst', dur: 7 },
    { cls: 'style-dissolve', dur: 9.5 }
  ];

  const CJK_CHARS = '零一二三四五六七八九十百千万光速能量核心网络数据系统扫描连接信号轨道量子传感器控制协议解析';

  function randomToken(){
    const kind = Math.random();
    if(kind < 0.4){
      const len = 1 + Math.floor(Math.random() * 4);
      let s = '';
      for(let i=0;i<len;i++) s += Math.floor(Math.random()*10);
      return s;
    }else if(kind < 0.6){
      return (Math.random()*100).toFixed(2);
    }else if(kind < 0.8){
      const len = 1 + Math.floor(Math.random() * 3);
      let s = '';
      for(let i=0;i<len;i++) s += CJK_CHARS[Math.floor(Math.random()*CJK_CHARS.length)];
      return s;
    }else{
      let s = '';
      for(let i=0;i<8;i++) s += Math.random() < 0.5 ? '0' : '1';
      return s;
    }
  }

  function spawnNumber(){
    if(!bgFxEnabled) return;
    if(!numField || !document.body.contains(numField)) return;
    const el = document.createElement('span');
    const style = vanishStyles[Math.floor(Math.random() * vanishStyles.length)];
    el.className = 'float-num ' + style;
    el.textContent = randomToken();
    const size = 14 + Math.random() * 26;
    el.style.fontSize = size + 'px';
    el.style.left = (2 + Math.random() * 92) + 'vw';
    el.style.top = (4 + Math.random() * 88) + 'vh';
    numField.appendChild(el);
    el.addEventListener('animationend', () => el.remove());
    setTimeout(() => { if(el.parentNode) el.remove(); }, 4200);
  }

  // A wider set of more intricate mandala motif templates (kept geometric + monochrome)
  const MANDALA_SVGS = [
    // simple ring + hexagon
    `<svg viewBox="0 0 200 200"><circle cx="100" cy="100" r="90"/><circle cx="100" cy="100" r="60"/><polygon points="100,15 175,65 145,175 55,175 25,65"/></svg>`,
    // diamond cross
    `<svg viewBox="0 0 200 200"><circle cx="100" cy="100" r="80"/><polygon points="100,30 160,100 100,170 40,100"/><line x1="100" y1="10" x2="100" y2="190"/><line x1="10" y1="100" x2="190" y2="100"/></svg>`,
    // heptagon nested
    `<svg viewBox="0 0 200 200"><circle cx="100" cy="100" r="70"/><circle cx="100" cy="100" r="40"/><polygon points="100,20 176,60 176,140 100,180 24,140 24,60"/></svg>`,
    // rotated square star
    `<svg viewBox="0 0 200 200"><polygon points="100,10 190,100 100,190 10,100"/><polygon points="100,50 150,100 100,150 50,100"/><circle cx="100" cy="100" r="88"/></svg>`,
    // eight-petal flower
    `<svg viewBox="0 0 200 200">
       <circle cx="100" cy="100" r="92"/>
       <circle cx="100" cy="100" r="20"/>
       <g>
         <ellipse cx="100" cy="45" rx="14" ry="40"/>
         <ellipse cx="100" cy="45" rx="14" ry="40" transform="rotate(45 100 100)"/>
         <ellipse cx="100" cy="45" rx="14" ry="40" transform="rotate(90 100 100)"/>
         <ellipse cx="100" cy="45" rx="14" ry="40" transform="rotate(135 100 100)"/>
         <ellipse cx="100" cy="45" rx="14" ry="40" transform="rotate(180 100 100)"/>
         <ellipse cx="100" cy="45" rx="14" ry="40" transform="rotate(225 100 100)"/>
         <ellipse cx="100" cy="45" rx="14" ry="40" transform="rotate(270 100 100)"/>
         <ellipse cx="100" cy="45" rx="14" ry="40" transform="rotate(315 100 100)"/>
       </g>
     </svg>`,
    // twelve-point star burst
    `<svg viewBox="0 0 200 200">
       <circle cx="100" cy="100" r="94"/>
       <circle cx="100" cy="100" r="66"/>
       <g>
         <line x1="100" y1="6" x2="100" y2="194"/>
         <line x1="6" y1="100" x2="194" y2="100"/>
         <line x1="30" y1="30" x2="170" y2="170"/>
         <line x1="30" y1="170" x2="170" y2="30"/>
         <line x1="100" y1="6" x2="100" y2="194" transform="rotate(30 100 100)"/>
         <line x1="6" y1="100" x2="194" y2="100" transform="rotate(30 100 100)"/>
       </g>
       <polygon points="100,34 166,100 100,166 34,100"/>
     </svg>`,
    // triple nested triangles wheel
    `<svg viewBox="0 0 200 200">
       <circle cx="100" cy="100" r="90"/>
       <polygon points="100,14 178,150 22,150"/>
       <polygon points="100,14 178,150 22,150" transform="rotate(60 100 100)"/>
       <polygon points="100,14 178,150 22,150" transform="rotate(120 100 100)"/>
       <circle cx="100" cy="100" r="30"/>
     </svg>`,
    // lattice hex grid mandala
    `<svg viewBox="0 0 200 200">
       <circle cx="100" cy="100" r="95"/>
       <polygon points="100,20 165,58 165,142 100,180 35,142 35,58"/>
       <polygon points="100,20 165,58 165,142 100,180 35,142 35,58" transform="rotate(30 100 100)"/>
       <polygon points="100,55 145,80 145,120 100,145 55,120 55,80"/>
       <circle cx="100" cy="100" r="18"/>
     </svg>`,
    // spiral-like concentric rotated squares
    `<svg viewBox="0 0 200 200">
       <circle cx="100" cy="100" r="92"/>
       <rect x="35" y="35" width="130" height="130"/>
       <rect x="50" y="50" width="100" height="100" transform="rotate(15 100 100)"/>
       <rect x="65" y="65" width="70" height="70" transform="rotate(30 100 100)"/>
       <rect x="80" y="80" width="40" height="40" transform="rotate(45 100 100)"/>
     </svg>`,
    // sixteen-spoke wheel
    `<svg viewBox="0 0 200 200">
       <circle cx="100" cy="100" r="96"/>
       <circle cx="100" cy="100" r="78"/>
       <circle cx="100" cy="100" r="50"/>
       <g>
         <line x1="100" y1="4" x2="100" y2="196"/>
         <line x1="4" y1="100" x2="196" y2="100"/>
         <line x1="100" y1="4" x2="100" y2="196" transform="rotate(22.5 100 100)"/>
         <line x1="4" y1="100" x2="196" y2="100" transform="rotate(22.5 100 100)"/>
         <line x1="100" y1="4" x2="100" y2="196" transform="rotate(45 100 100)"/>
         <line x1="4" y1="100" x2="196" y2="100" transform="rotate(45 100 100)"/>
         <line x1="100" y1="4" x2="100" y2="196" transform="rotate(67.5 100 100)"/>
         <line x1="4" y1="100" x2="196" y2="100" transform="rotate(67.5 100 100)"/>
       </g>
     </svg>`,
    // twelve-petal lotus with core
    `<svg viewBox="0 0 200 200">
       <circle cx="100" cy="100" r="90"/>
       <circle cx="100" cy="100" r="14"/>
       <g>
         <ellipse cx="100" cy="42" rx="10" ry="34" transform="rotate(0 100 100)"/>
         <ellipse cx="100" cy="42" rx="10" ry="34" transform="rotate(30 100 100)"/>
         <ellipse cx="100" cy="42" rx="10" ry="34" transform="rotate(60 100 100)"/>
         <ellipse cx="100" cy="42" rx="10" ry="34" transform="rotate(90 100 100)"/>
         <ellipse cx="100" cy="42" rx="10" ry="34" transform="rotate(120 100 100)"/>
         <ellipse cx="100" cy="42" rx="10" ry="34" transform="rotate(150 100 100)"/>
         <ellipse cx="100" cy="42" rx="10" ry="34" transform="rotate(180 100 100)"/>
         <ellipse cx="100" cy="42" rx="10" ry="34" transform="rotate(210 100 100)"/>
         <ellipse cx="100" cy="42" rx="10" ry="34" transform="rotate(240 100 100)"/>
         <ellipse cx="100" cy="42" rx="10" ry="34" transform="rotate(270 100 100)"/>
         <ellipse cx="100" cy="42" rx="10" ry="34" transform="rotate(300 100 100)"/>
         <ellipse cx="100" cy="42" rx="10" ry="34" transform="rotate(330 100 100)"/>
       </g>
     </svg>`,
    // layered pentagon lattice
    `<svg viewBox="0 0 200 200">
       <circle cx="100" cy="100" r="92"/>
       <polygon points="100,12 182,72 150,168 50,168 18,72"/>
       <polygon points="100,12 182,72 150,168 50,168 18,72" transform="rotate(36 100 100)"/>
       <polygon points="100,45 152,82 132,142 68,142 48,82"/>
       <circle cx="100" cy="100" r="22"/>
     </svg>`,
    // interlocking triangles (star of David style) x2
    `<svg viewBox="0 0 200 200">
       <circle cx="100" cy="100" r="94"/>
       <polygon points="100,16 178,152 22,152"/>
       <polygon points="100,184 22,48 178,48"/>
       <polygon points="100,50 148,132 52,132" transform="rotate(0 100 100)"/>
     </svg>`,
    // concentric octagon rings with radial ticks
    `<svg viewBox="0 0 200 200">
       <polygon points="100,15 148,32 172,76 172,124 148,168 100,185 52,168 28,124 28,76 52,32"/>
       <polygon points="100,45 133,58 150,88 150,112 133,142 100,155 67,142 50,112 50,88 67,58"/>
       <circle cx="100" cy="100" r="16"/>
       <g>
         <line x1="100" y1="15" x2="100" y2="0"/>
         <line x1="172" y1="76" x2="186" y2="68"/>
         <line x1="172" y1="124" x2="186" y2="132"/>
         <line x1="100" y1="185" x2="100" y2="200"/>
         <line x1="28" y1="124" x2="14" y2="132"/>
         <line x1="28" y1="76" x2="14" y2="68"/>
       </g>
     </svg>`,
    // spirograph loops
    `<svg viewBox="0 0 200 200">
       <circle cx="100" cy="100" r="90"/>
       <circle cx="70" cy="100" r="40"/>
       <circle cx="130" cy="100" r="40"/>
       <circle cx="100" cy="70" r="40"/>
       <circle cx="100" cy="130" r="40"/>
       <circle cx="100" cy="100" r="14"/>
     </svg>`,
    // ten-point star mandala
    `<svg viewBox="0 0 200 200">
       <circle cx="100" cy="100" r="95"/>
       <polygon points="100,10 118,70 180,70 130,108 150,168 100,132 50,168 70,108 20,70 82,70"/>
       <circle cx="100" cy="100" r="34"/>
     </svg>`,
    // triple ring lace with dots
    `<svg viewBox="0 0 200 200">
       <circle cx="100" cy="100" r="92"/>
       <circle cx="100" cy="100" r="72"/>
       <circle cx="100" cy="100" r="52"/>
       <circle cx="100" cy="30" r="5"/>
       <circle cx="100" cy="170" r="5"/>
       <circle cx="30" cy="100" r="5"/>
       <circle cx="170" cy="100" r="5"/>
       <circle cx="150" cy="50" r="5"/>
       <circle cx="50" cy="150" r="5"/>
       <circle cx="150" cy="150" r="5"/>
       <circle cx="50" cy="50" r="5"/>
     </svg>`,
    // fractal-ish nested squares diamonds
    `<svg viewBox="0 0 200 200">
       <circle cx="100" cy="100" r="94"/>
       <polygon points="100,10 190,100 100,190 10,100"/>
       <polygon points="100,40 160,100 100,160 40,100"/>
       <polygon points="100,70 130,100 100,130 70,100"/>
       <polygon points="100,10 190,100 100,190 10,100" transform="rotate(45 100 100)"/>
     </svg>`
  ];

  function spawnMandala(){
    if(!bgFxEnabled) return;
    if(!mandalaField || !document.body.contains(mandalaField)) return;
    const wrap = document.createElement('div');
    const picked = mandalaStyles[Math.floor(Math.random() * mandalaStyles.length)];
    wrap.className = 'mandala-piece ' + picked.cls;
    wrap.style.setProperty('--dur', picked.dur + 's');
    const size = 90 + Math.random() * 220; // 90px - 310px
    wrap.style.width = size + 'px';
    wrap.style.height = size + 'px';
    wrap.style.left = (Math.random() * 90) + 'vw';
    wrap.style.top = (Math.random() * 88) + 'vh';
    wrap.innerHTML = MANDALA_SVGS[Math.floor(Math.random() * MANDALA_SVGS.length)];
    mandalaField.appendChild(wrap);
    wrap.addEventListener('animationend', () => wrap.remove());
    setTimeout(() => { if(wrap.parentNode) wrap.remove(); }, (picked.dur + 1) * 1000);
  }

  function scheduleNext(fn, minMs, maxMs){
    const delay = minMs + Math.random() * (maxMs - minMs);
    setTimeout(() => { fn(); scheduleNext(fn, minMs, maxMs); }, delay);
  }

  scheduleNext(spawnNumber, 350, 850);
  scheduleNext(spawnMandala, 2200, 3800);
  setTimeout(spawnMandala, 400);

})();
