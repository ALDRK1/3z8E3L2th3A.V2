// Carga los textos (data/*.json) y, cuando están listos, arranca la app (js/app.js).
(function(){
  // Súbele el número a VERSION cada vez que actualices la página: así el navegador
  // descarga los archivos nuevos en vez de usar copias guardadas de antes.
  const VERSION = '20261031-8';
  const get = p => fetch(p + '?v=' + VERSION).then(r => {
    if(!r.ok) throw new Error(p + ' → ' + r.status);
    return r.json();
  });

  async function boot(){
    const idx = await get('data/index.json');

    const [uiList, topics, trList] = await Promise.all([
      Promise.all(idx.langs.map(c => get('data/ui/' + c + '.json'))),
      Promise.all(idx.topics.map(k => get('data/topics/' + k + '.json'))),
      Promise.all(idx.translations.map(k => get('data/translations/' + k + '.json')))
    ]);

    const LANGS = {};
    idx.langs.forEach((c, i) => { LANGS[c] = uiList[i]; });

    window.ZELTHA_DATA = {
      LANGS: LANGS,
      SAMPLE_TOPICS: topics,
      PRECOMPUTED: Object.assign({}, ...trList)
    };

    const s = document.createElement('script');
    s.src = 'js/app.js?v=' + VERSION;
    document.body.appendChild(s);
  }

  boot().catch(err => {
    console.error('ZELTHA: no se pudieron cargar los datos', err);
    document.body.insertAdjacentHTML('afterbegin',
      '<p style="color:#ff6b6b;padding:16px;font-family:monospace">Error cargando datos: ' + err.message + '</p>');
  });
})();
