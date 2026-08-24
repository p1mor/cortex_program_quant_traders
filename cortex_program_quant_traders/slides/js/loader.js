/* ═══════════════════════════════════════════════════════════════════════════
   CORTEX QUANT TRADER  ·  SLIDE LOADER  ·  v1.0
   TechPulse Consulting  ·  Proprietary Framework
   ═══════════════════════════════════════════════════════════════════════════ */

'use strict';

const SlideLoader = (() => {

  const MODULES = {
    '0': {
      name: 'Programa Formativo',
      color: '#6b7280',
      slides: [
        { id: '00-portada',  title: 'Portada' },
        { id: '01-indice',   title: 'Indice del Programa' },
      ]
    },
    '1': {
      name: 'Módulo I — Fundamentos',
      color: '#0033ff',
      slides: [
  { id: '00-portada', title: 'Portada — Fundamentos y Microestructura' },
  { id: '01-origen-vida-neuronas', title: 'Del origen de la vida a las neuronas' },
  { id: '02-finanzas-era-sumeria', title: 'Finanzas desde la era sumeria' },
  { id: '03-mercados', title: 'El mercado financiero y su naturaleza' },
  { id: '04-evolucion', title: 'Evolución histórica del trading' },
  { id: '07-participantes', title: 'Taxonomía de Participantes' },
  { id: '05-precio', title: 'El precio' },
  { id: '06-liquidez', title: 'Oferta, Demanda y Liquidez' },
  { id: '08-ticks', title: 'Ticks, Tick Size y Nocional' },
  { id: '09-spread', title: 'The Bid-Ask Spread' },
  { id: '10-slippage', title: 'Slippage e Impacto de Mercado' },
  { id: '11-activos', title: 'Futuros, Stocks y Forex' },
  { id: '12-complex', title: 'Commodities, Bonos y Sintéticos' },
  { id: '13-tape', title: 'Tape Reading y Footprint' },
]

    },
    '2': {
      name: 'Modulo II — Quant Trading',
      color: '#a48cff',
      slides: [
        { id: '00-portada', title: 'Portada — Trading Cuantitativo' },
        { id: '01-revolucion',  title: 'Revoluci\u00f3n Cuantitativa' },
        { id: '02-perfil',      title: 'Perfil del Quant' },
        { id: '03-paradigmas',  title: 'Sistem\u00e1tico vs. Discrecional' },
        { id: '04-edge',        title: 'El Edge Estad\u00edstico' },
        { id: '05-diseno',      title: 'Dise\u00f1o de Estrategias Mec\u00e1nicas' },
        { id: '06-backtesting', title: 'Backtesting Riguroso' },
        { id: '07-overfitting', title: 'Overfitting' },
        { id: '08-robustez1',   title: 'Pruebas de Robustez' },
        { id: '09-montecarlo',  title: 'Monte Carlo' },
        { id: '10-walkforward', title: 'Walk Forward' },
      ]
    },
    '3': {
      name: 'Módulo III — Cortex-Dendrita',
      color: '#06B6D4',
      slides: [
        { id: '00-portada',                       title: 'Portada — Cortex-Dendrita' },
        { id: '01-introduccion',                  title: 'Introducción a Cortex-Dendrita' },
        { id: '02-filosofia',                     title: 'Filosofía de la Inferencia' },
        { id: '03-cortex-dendrita',               title: 'Cortex vs. Dendrita' },
        { id: '04-metodo-cientifico',              title: 'El Método Científico en Cortex-Dendrita' },
        { id: '05-arquitectura-multidimensional', title: 'Arquitectura Multidimensional' },
        { id: '06-hwte-eje-inferencial',          title: 'HWTE como Eje Inferencial' },
        { id: '07-macrociclo-frontera-migracion', title: 'Macrociclo, Frontera y Migración' },
        { id: '08-microciclos-confluencia',       title: 'Microciclos y Confluencia Multidimensional' },
        { id: '09-observacion-acumulacion-sesgo', title: 'Observación y Acumulación de Sesgo' },
        { id: '10-lectura-unilateral-multilateral', title: 'Lectura Unilateral y Multilateral del Mercado' },
        { id: '11-confluencia-divergencia-intermercado', title: 'Confluencia, Divergencia y Sesgo Intermercado' },
        { id: '12-hipotesis-tesis',               title: 'De la Hipótesis a la Tesis Inferencial' },
        { id: '13-contraste-falsacion-invalidacion', title: 'Contraste, Falsación e Invalidación' },
        { id: '14-vigencia-retoma-tesis',         title: 'Vigencia y Retoma de la Tesis' },
        { id: '15-inferencia-ejecucion',          title: 'De la Inferencia a la Ejecución Multidimensional' },
        { id: '16-gestion-inferencia',            title: 'Gestión de la Inferencia: Entrada, Stop y Salida' },
        { id: '17-tecnicas-ejecucion',            title: 'Técnicas de Ejecución y Adaptación al Mercado' },
        { id: '18-cobertura-multimercado',        title: 'Cobertura y Arquitectura Multimercado' },
        { id: '19-protocolo-integral',            title: 'Protocolo Integral de Inferencia Cortex-Dendrita' },
      ]
    }
  };

  async function loadAll(deck) {
    const order = ['0', '1', '2', '3'];
    let loaded = 0;

    for (const mod of order) {
      const info = MODULES[mod];
      if (!info) continue;

      for (const slide of info.slides) {
        const path = `modules/m${mod}/${slide.id}.html`;
        try {
          // Los slides se editan durante la sesión: nunca reutilizar una copia
          // anterior almacenada por el navegador.
          const resp = await fetch(path, { cache: 'no-store' });
          if (!resp.ok) throw new Error(`${resp.status}`);
          const html = await resp.text();
          const parsed = new DOMParser().parseFromString(html, 'text/html');
          const section = parsed.querySelector('section.slide');
          if (section) {
            /* Import only slide-scoped local styles. Unscoped document styles
               would leak into the rest of the presentation. */
            parsed.querySelectorAll('style').forEach((style, index) => {
              const css = style.textContent || '';
              const scope = `#${section.id}`;
              const styleId = `style-${mod}-${slide.id}-${index}`.replace(/[^a-zA-Z0-9_-]/g, '-');

              if (section.id && css.includes(scope) && !document.getElementById(styleId)) {
                const localStyle = document.createElement('style');
                localStyle.id = styleId;
                localStyle.textContent = css;
                document.head.appendChild(localStyle);
              }
            });

            /* Inject data-module if missing */
            if (!section.dataset.module) section.dataset.module = mod;
            deck.appendChild(section);
            loaded++;
          }
        } catch (err) {
          console.warn(`[SlideLoader] Failed: ${path} — ${err.message}`);
        }
      }
    }

    return loaded;
  }

  function getModules() { return MODULES; }

  return { loadAll, getModules };

})();
