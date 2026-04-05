// ==UserScript==
// @name         SearchAIO — Professional (Editable Query Focus)
// @namespace    https://achma-learning.github.io/searchAIO/
// @version      6.3
// @description  Selection → ⚡ → Edit text & Search across Medical/Academic/AI grids.
// @author       SearchAIO
// @match        *://*/*
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/568031/SearchAIO%20%E2%80%94%20Professional%20%28Editable%20Query%20Focus%29.user.js
// @updateURL https://update.greasyfork.org/scripts/568031/SearchAIO%20%E2%80%94%20Professional%20%28Editable%20Query%20Focus%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const ENGINES = [
        // 🌐 GÉNÉRALE
        { id: 'google', label: 'Google', cat: 'general', url: 'https://google.com/search?q={q}', icon: '🌐' },
        { id: 'youtube', label: 'YouTube', cat: 'general', url: 'https://www.youtube.com/results?search_query={q}', icon: '▶️' },
        { id: 'wikipedia', label: 'Wikipedia', cat: 'general', url: 'https://fr.wikipedia.org/wiki/{q}', icon: '📖' },
        { id: 'yandex', label: 'Yandex', cat: 'general', url: 'https://yandex.com/search/?text={q}', icon: '🇷🇺' },
        { id: 'baidu', label: 'Baidu', cat: 'general', url: 'https://www.baidu.com/s?wd={q}', icon: '🇨🇳' },

        // 🎓 ACADÉMIQUE
        { id: 'scholar', label: 'Google Scholar', cat: 'academic', url: 'https://scholar.google.com/scholar?q={q}', icon: '🎓' },
        { id: 'pubmed', label: 'PubMed', cat: 'academic', url: 'https://pubmed.ncbi.nlm.nih.gov/?term={q}', icon: '🧬' },
        { id: 'rgate', label: 'ResearchGate', cat: 'academic', url: 'https://www.researchgate.net/search/publication?q={q}', icon: '🔬' },
        { id: 'cismef_th', label: 'CISMeF Thèses', cat: 'academic', url: 'https://doc-cismef.chu-rouen.fr/publication/theses?q={q}', icon: '📜' },
        { id: 'scihub', label: 'Sci-Hub', cat: 'academic', url: 'https://sci-hub.se/{q}', icon: '🔓' },

        // ⚕️ MÉDICAL
        { id: 'hetop', label: 'HeTOP', cat: 'medical', url: 'https://www.hetop.eu/hetop/fr/?q=&home&oti=all&q={q}', icon: '🏥' },
        { id: 'vidal', label: 'Vidal', cat: 'medical', url: 'https://www.vidal.fr/recherche.html?query={q}', icon: '💊' },
        { id: 'anm', label: 'Acad. Méd. (ANM)', cat: 'medical', url: 'http://91.209.229.113/search?titre={q}', icon: '⚖️' },
        { id: 'has', label: 'HAS Santé', cat: 'medical', url: 'https://www.has-sante.fr/jcms/fc_2875171/fr/resultat-de-recherche?text={q}', icon: '🛡️' },
        { id: 'msps', label: 'MSPS (Morocco)', cat: 'medical', url: 'https://www.google.com/search?q=site:sante.gov.ma%20{q}', icon: '🇲🇦' },
        { id: 'ammps', label: 'AMMPS (Médocs)', cat: 'medical', url: 'https://ammps.sante.gov.ma/basesdedonnes/listes-medicaments?search={q}', icon: '📦' },
        { id: 'radiopaedia', label: 'Radiopaedia', cat: 'medical', url: 'https://radiopaedia.org/search?q={q}', icon: '🦴' },
        { id: 'cismef_pt', label: 'CISMeF Portal', cat: 'medical', url: 'https://doccismef.chu-rouen.fr/dc/#env=basic&q={q}', icon: '🔎' },

        // 🤖 ADVANCED (AI)
        { id: 'wolfram', label: 'Wolfram Alpha', cat: 'ai', url: 'https://www.wolframalpha.com/input?i={q}', icon: '🔢' },
        { id: 'perplexity', label: 'Perplexity AI', cat: 'ai', url: 'https://www.perplexity.ai/search?q={q}', icon: '🔍' },
        { id: 'gemini', label: 'Google Gemini', cat: 'ai', url: 'https://gemini.google.com/app', icon: '✨', clipboard: true },
        { id: 'chatgpt', label: 'ChatGPT', cat: 'ai', url: 'https://chatgpt.com/?q={q}', icon: '💬' },
        { id: 'claude', label: 'Claude AI', cat: 'ai', url: 'https://claude.ai/new', icon: '🎭', clipboard: true }
    ];

    const CATS = ['general', 'academic', 'medical', 'ai'];
    const CAT_LABELS = { general: '🌐 Générale', academic: '🎓 Académique', medical: '⚕️ Médical', ai: '🤖 Advanced' };

    let activeCat = GM_getValue("cat", "medical");
    let query = '';
    let triggerBtn = null;
    let gridPopup = null;
    let selectedIndex = 0;

    const style = document.createElement('style');
    style.textContent = `
        #saio-trigger { all: initial; position: absolute; z-index: 2147483647; width: 42px; height: 42px; background: transparent; cursor: pointer; display: flex; align-items: center; justify-content: center; }
        #saio-trigger-inner { width: 34px; height: 34px; background: #fff; border: 2.5px solid #007aff; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.2); display: flex; align-items: center; justify-content: center; font-size: 20px; transition: transform 0.1s; }
        #saio-trigger:hover #saio-trigger-inner { transform: scale(1.15) translateY(-2px); }

        #saio-p { all: initial; position: fixed; z-index: 2147483647; width: 480px; background: rgba(26, 26, 26, 0.92); backdrop-filter: blur(25px); border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 20px; box-shadow: 0 30px 80px rgba(0,0,0,0.7); font-family: system-ui, -apple-system, sans-serif; color: white; overflow: hidden; animation: saio-pop 0.12s ease-out; }
        @keyframes saio-pop { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }

        .saio-h { padding: 18px; background: rgba(255,255,255,0.02); border-bottom: 1px solid rgba(255,255,255,0.1); }
        
        /* Editable Input Styling */
        .saio-edit-box { width: 100%; background: rgba(0,0,0,0.2); border: 1.5px solid #007aff; border-radius: 8px; padding: 10px 12px; color: #fff; font-size: 14px; margin-bottom: 12px; outline: none; box-sizing: border-box; font-family: inherit; }
        .saio-edit-box:focus { background: rgba(0,0,0,0.4); box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.2); }

        .saio-tabs { display: flex; gap: 6px; }
        .saio-tab { flex: 1; text-align: center; padding: 10px 4px; border-radius: 10px; font-size: 11px; cursor: pointer; transition: 0.2s; background: rgba(255,255,255,0.04); color: #888; }
        .saio-tab.active { background: #007aff; color: #fff; font-weight: bold; }

        .saio-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; padding: 14px; }
        .saio-item { display: flex; align-items: center; gap: 12px; padding: 12px; border-radius: 12px; cursor: pointer; font-size: 13px; transition: 0.1s; background: rgba(255,255,255,0.03); }
        .saio-item:hover { background: rgba(255, 255, 255, 0.07); }
        .saio-item.selected { background: #007aff !important; color: white; }
        .saio-icon-box { font-size: 18px; width: 24px; text-align: center; }

        .saio-f { padding: 10px 18px; font-size: 10px; color: #555; background: rgba(0,0,0,0.3); display: flex; justify-content: space-between; }
    `;
    document.head.appendChild(style);

    function getFiltered() { return ENGINES.filter(e => e.cat === activeCat); }

    function render() {
        if (!gridPopup) return;
        const grid = gridPopup.querySelector('.saio-grid');
        grid.innerHTML = '';
        const items = getFiltered();
        items.forEach((e, i) => {
            const div = document.createElement('div');
            div.className = 'saio-item' + (i === selectedIndex ? ' selected' : '');
            div.innerHTML = `<span class="saio-icon-box">${e.icon}</span> <span>${e.label}</span>`;
            div.onclick = (ev) => { ev.stopPropagation(); launch(e); };
            div.onmouseenter = () => { selectedIndex = i; render(); };
            grid.appendChild(div);
        });
        gridPopup.querySelectorAll('.saio-tab').forEach((t, i) => {
            t.className = `saio-tab ${CATS[i] === activeCat ? 'active' : ''}`;
        });
    }

    function launch(e) {
        const finalQuery = gridPopup.querySelector('.saio-edit-box').value || query;
        if (e.clipboard) navigator.clipboard.writeText(finalQuery).catch(() => {});
        const url = e.url.replace('{q}', encodeURIComponent(finalQuery));
        GM_openInTab(url, { active: true });
        close();
    }

    function openPopup(x, y) {
        close();
        selectedIndex = 0;
        gridPopup = document.createElement('div');
        gridPopup.id = 'saio-p';
        gridPopup.onmousedown = (e) => e.stopPropagation();

        gridPopup.innerHTML = `
            <div class="saio-h">
                <input type="text" class="saio-edit-box" value="${query}" placeholder="Modifier la recherche...">
                <div class="saio-tabs">
                    ${CATS.map(c => `<div class="saio-tab" data-cat="${c}">${CAT_LABELS[c]}</div>`).join('')}
                </div>
            </div>
            <div class="saio-grid"></div>
            <div class="saio-f">
                <span>Tab/Arrows to navigate • Enter to Search</span>
                <span>SearchAIO v6.3</span>
            </div>
        `;
        document.body.appendChild(gridPopup);

        let l = Math.min(x, window.innerWidth - 500);
        let t = Math.min(y, window.innerHeight - 450);
        gridPopup.style.left = Math.max(10, l) + 'px';
        gridPopup.style.top = Math.max(10, t) + 'px';

        const input = gridPopup.querySelector('.saio-edit-box');
        input.focus();
        input.select();

        gridPopup.querySelectorAll('.saio-tab').forEach(t => {
            t.onclick = (ev) => {
                ev.stopPropagation();
                activeCat = t.dataset.cat;
                GM_setValue("cat", activeCat);
                selectedIndex = 0;
                render();
            };
        });

        render();

        const keyHandler = (e) => {
            if (!gridPopup) return;
            const items = getFiltered();
            
            // Allow typing in input but handle Enter/Arrows
            if (e.key === 'Enter') {
                e.preventDefault();
                launch(items[selectedIndex]);
            } else if (e.key === 'Escape') {
                close();
            } else if (['1','2','3','4'].includes(e.key) && document.activeElement !== input) {
                activeCat = CATS[parseInt(e.key) - 1];
                GM_setValue("cat", activeCat);
                selectedIndex = 0;
                render();
            } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                // If using arrows, move selection in grid
                if (e.key === 'ArrowDown' && selectedIndex + 2 < items.length) selectedIndex += 2;
                if (e.key === 'ArrowUp' && selectedIndex - 2 >= 0) selectedIndex -= 2;
                render();
            } else if (e.key === 'ArrowRight' && selectedIndex + 1 < items.length) {
                if (document.activeElement !== input) { selectedIndex++; render(); }
            } else if (e.key === 'ArrowLeft' && selectedIndex > 0) {
                if (document.activeElement !== input) { selectedIndex--; render(); }
            }
        };
        window.addEventListener('keydown', keyHandler);
        gridPopup._kh = keyHandler;
    }

    function close() {
        if (triggerBtn) triggerBtn.remove();
        if (gridPopup) {
            window.removeEventListener('keydown', gridPopup._kh);
            gridPopup.remove();
        }
        triggerBtn = null; gridPopup = null;
    }

    document.addEventListener('mouseup', (e) => {
        if (gridPopup && gridPopup.contains(e.target)) return;
        setTimeout(() => {
            const text = window.getSelection().toString().trim();
            if (text.length > 1) {
                query = text;
                if (triggerBtn) triggerBtn.remove();
                triggerBtn = document.createElement('div');
                triggerBtn.id = 'saio-trigger';
                triggerBtn.innerHTML = '<div id="saio-trigger-inner">⚡</div>';
                document.body.appendChild(triggerBtn);
                const r = window.getSelection().getRangeAt(0).getBoundingClientRect();
                triggerBtn.style.left = (r.right + window.scrollX - 10) + 'px';
                triggerBtn.style.top = (r.top + window.scrollY - 45) + 'px';
                triggerBtn.onclick = (ev) => {
                    ev.stopPropagation();
                    openPopup(ev.clientX, ev.clientY);
                    triggerBtn.remove();
                };
            } else if (!gridPopup) close();
        }, 30);
    });

    document.addEventListener('mousedown', (e) => {
        if (gridPopup && !gridPopup.contains(e.target)) close();
    });

})();
