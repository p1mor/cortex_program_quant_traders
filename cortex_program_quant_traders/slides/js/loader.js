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
      name: 'Modulo I — Fundamentos',
      color: '#0033ff',
      slides: [
        { id: '01-evolucion',     title: 'Evolucion Estructural' },
        { id: '02-mercados',      title: 'Naturaleza de los Mercados' },
        { id: '03-precio',        title: 'Que mueve el precio' },
        { id: '04-liquidez',      title: 'Oferta, Demanda y Liquidez' },
        { id: '05-participantes', title: 'Taxonomia de Participantes' },
        { id: '06-ticks',         title: 'Ticks y Nocional' },
        { id: '07-spread',        title: 'Bid-Ask Spread' },
        { id: '08-slippage',      title: 'Slippage e Impacto' },
        { id: '09-activos',       title: 'Futuros, Stocks y Forex' },
        { id: '10-complex',       title: 'Commodities, Bonos, Sinteticos' },
        { id: '11-tape',          title: 'Tape Reading y Footprint' },
      ]
    },
    '2': {
      name: 'Modulo II — Quant Trading',
      color: '#a48cff',
      slides: [
        { id: '01-revolucion',  title: 'Revolucion Cuantitativa' },
        { id: '02-perfil',      title: 'Perfil del Quant' },
        { id: '03-paradigmas',  title: 'Sistematico vs Discrecional' },
        { id: '04-edge',        title: 'El Edge Estadistico' },
        { id: '05-diseno',      title: 'Diseno de Estrategias' },
        { id: '06-backtesting', title: 'Backtesting Riguroso' },
        { id: '07-overfitting', title: 'Overfitting' },
        { id: '08-robustez1',   title: 'Pruebas de Robustez I' },
        { id: '09-montecarlo',  title: 'Monte Carlo' },
        { id: '10-walkforward', title: 'Walk Forward Analysis' },
      ]
    },
    '3': {
      name: 'Modulo III — Cortex-Dendrita',
      color: '#06B6D4',
      slides: [
        { id: '01-filosofia',     title: 'Filosofia Operativa' },
        { id: '02-arquitectura',  title: 'Cortex vs Dendrita' },
        { id: '03-probabilistico', title: 'Estado Probabilistico' },
        { id: '04-inferencia',    title: 'Inferencia en Tiempo Real' },
        { id: '05-variables',     title: 'Variables de Microestructura' },
        { id: '06-liquidez',      title: 'Liquidez y Perfiles' },
        { id: '07-entropia',      title: 'Entropia del Mercado' },
        { id: '08-contexto',      title: 'Contexto de Mercado' },
        { id: '09-matriz',        title: 'Long, Short o No Operar' },
        { id: '10-hibridacion',   title: 'Hibridacion Quant-Discrecional' },
        { id: '11-protocolo',     title: 'Protocolo de Decisiones' },
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
          const resp = await fetch(path);
          if (!resp.ok) throw new Error(`${resp.status}`);
          const html = await resp.text();
          const wrapper = document.createElement('div');
          wrapper.innerHTML = html;
          const section = wrapper.querySelector('section');
          if (section) {
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
