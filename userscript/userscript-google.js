// ==UserScript==
// @name         SearchAIO — Gemini Edition
// @namespace    https://achma-learning.github.io/searchAIO/
// @version      8.0
// @description  Selection → ✨ → Edit text & Search across Google AI Plus, Medical, and Academic grids.
// @author       SearchAIO (Optimized)
// @match        *://*/*
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==
 
(function () {
    'use strict';
 
    // ── Engines ──────────────────────────
    const ENGINES = [
        // ✨ Google AI Plus (Prioritized)
        { id: 'gemini',     label: 'Gemini Advanced',  cat: 'google_ai', url: 'https://gemini.google.com/app?q={q}', clipboard: true },
        { id: 'notebooklm', label: 'NotebookLM',       cat: 'google_ai', url: 'https://notebooklm.google.com/', clipboard: true },
        { id: 'gai',        label: 'AI Overviews',     cat: 'google_ai', url: 'https://www.google.com/search?udm=50&q={q}' },
        { id: 'gdocs',      label: 'Docs (Help Me Write)', cat: 'google_ai', url: 'https://docs.google.com/document/create', clipboard: true },
        { id: 'scholarai',  label: 'Scholar + AI',     cat: 'google_ai', url: 'https://scholar.google.com/scholar?q={q}' },
        { id: 'gpat',       label: 'Google Patents',   cat: 'google_ai', url: 'https://patents.google.com/?q={q}' },

        // ⚕️ Medical
        { id: 'cismef',    label: 'CISMeF',            cat: 'medical', url: 'https://doccismef.chu-rouen.fr/dc/#env=basic&q={q}' },
        { id: 'msps',      label: 'MSPS (Morocco)',    cat: 'medical', url: 'https://www.google.com/search?q=site:sante.gov.ma+{q}' },
        { id: 'ammps',     label: 'AMMPS',             cat: 'medical', url: 'https://ammps.sante.gov.ma/recherche-medicaments?search={q}' },
        { id: 'has',       label: 'HAS',               cat: 'medical', url: 'https://www.has-sante.fr/jcms/fc_2875171/fr/resultat-de-recherche?text={q}' },
        { id: 'vidal',     label: 'VIDAL',             cat: 'medical', url: 'https://www.vidal.fr/recherche.html?query={q}' },
        { id: 'mesh',      label: 'MeSH Browser',      cat: 'medical', url: 'https://meshb.nlm.nih.gov/search?searchInField=allTerms&searchString={q}' },
        { id: 'lissa',     label: 'LISSA',             cat: 'medical', url: 'https://www.lissa.fr/dc/#env=lissa&q={q}' },
        { id: 'anm',       label: 'Acad. Méd. (ANM)',  cat: 'medical', url: 'http://91.209.229.113/search?titre={q}' },
        { id: 'hetop',     label: 'HETOP',             cat: 'medical', url: 'https://www.hetop.eu/hetop/fr/#oti=all&q={q}' },
        { id: 'nejm',      label: 'NEJM',              cat: 'medical', url: 'https://www.nejm.org/search?q={q}' },
        { id: 'rp',        label: 'Radiopaedia',       cat: 'medical', url: 'https://radiopaedia.org/search?q={q}' },
        { id: 'utd',       label: 'UpToDate',          cat: 'medical', url: 'https://www.uptodate.com/contents/search?search={q}' },
        { id: 'coch',      label: 'Cochrane',          cat: 'medical', url: 'https://www.cochranelibrary.com/search?q={q}' },
        { id: 'medscape',  label: 'Medscape',          cat: 'medical', url: 'https://search.medscape.com/search/fr/{q}' },

        // 🎓 Academic
        { id: 'pubmed',    label: 'PubMed',           cat: 'academic', url: 'https://pubmed.ncbi.nlm.nih.gov/?term={q}' },
        { id: 'arxiv',     label: 'arXiv',            cat: 'academic', url: 'https://arxiv.org/search/?query={q}' },
        { id: 'these20',   label: 'These2.0',         cat: 'academic', url: 'https://thesefmpm.vercel.app/search?page=1&search={q}' },
        { id: 'cismefth',  label: 'CISMeF Thèses',    cat: 'academic', url: 'https://doccismef.chu-rouen.fr/dc/#env=thm&q={q}' },
        { id: 'toubkal',   label: 'Toubkal',          cat: 'academic', url: 'https://toubkal.imist.ma/search?query={q}' },
        { id: 'thesesfr',  label: 'Theses.fr',        cat: 'academic', url: 'https://theses.fr/resultats?q={q}' },
        { id: 'rgate',     label: 'ResearchGate',     cat: 'academic', url: 'https://www.researchgate.net/search/publication?q={q}' },
        { id: 'ndltd',     label: 'NDLTD',            cat: 'academic', url: 'http://search.ndltd.org/search.php?q={q}' },
        { id: 'proinserm', label: 'Pro Inserm',       cat: 'academic', url: 'https://pro.inserm.fr/?s={q}' },
 
        // 🌐 General
        { id: 'google',   label: 'Google Search',     cat: 'general',  url: 'https://www.google.com/search?q={q}' },
        { id: 'youtube',  label: 'YouTube',           cat: 'general',  url: 'https://www.youtube.com/results?search_query={q}' },
        { id: 'wiki',     label: 'Wikipedia',         cat: 'general',  url: 'https://wikipedia.org/w/index.php?search={q}' },
 
        // 🤖 Other AI
        { id: 'chatgpt',    label: 'ChatGPT',        cat: 'other_ai', url: 'https://chatgpt.com/?prompt={q}' },
        { id: 'claude',     label: 'Claude AI',      cat: 'other_ai', url: 'https://claude.ai/new?q={q}', clipboard: true },
        { id: 'perplexity', label: 'Perplexity',     cat: 'other_ai', url: 'https://www.perplexity.ai/search?q={q}' }
    ];
 
    const CATS = ['google_ai', 'medical', 'academic', 'general', 'other_ai'];
    const CAT_LABELS = { google_ai: '✨ Google AI', medical: '⚕️ Medical', academic: '🎓 Academic', general: '🌐 General', other_ai: '🤖 Other' };
 
    let activeCat = GM_getValue('saio_cat', 'google_ai');
    let query = '';
    let triggerBtn = null;
    let sidebar = null;
    let selectedIndex = 0;
    let filterText = '';
 
    // ── CSS ───────────────────────────────────────────────────────
    const style = document.createElement('style');
    style.textContent = `
/* Trigger button */
#saio-trigger{all:initial;position:absolute;z-index:2147483647;width:38px;height:38px;background:transparent;cursor:pointer;display:flex;align-items:center;justify-content:center}
#saio-trigger-inner{width:30px;height:30px;background:#111;border:2px solid transparent;background-clip:padding-box;border-radius:10px;box-shadow:0 2px 12px rgba(0,0,0,.3);display:flex;align-items:center;justify-content:center;font-size:16px;transition:transform .1s;color:#fff}
#saio-trigger-inner::before{content:"";position:absolute;inset:-2px;border-radius:12px;z-index:-1;background:linear-gradient(135deg,#4285F4,#9B72CB,#D96570);transition:opacity .2s}
#saio-trigger:hover #saio-trigger-inner{transform:scale(1.12)}
 
/* Sidebar overlay */
#saio-overlay{position:fixed;inset:0;z-index:2147483646;background:rgba(0,0,0,.35);backdrop-filter:blur(3px);-webkit-backdrop-filter:blur(3px);opacity:0;transition:opacity .15s;pointer-events:auto}
#saio-overlay.saio-show{opacity:1}
 
/* Sidebar */
#saio-sb{all:initial;position:fixed;z-index:2147483647;top:50%;left:50%;transform:translate(-50%,-50%) scale(.96);width:540px;max-height:85vh;background:rgba(18,18,22,.96);backdrop-filter:blur(28px) saturate(1.6);-webkit-backdrop-filter:blur(28px) saturate(1.6);border:1px solid rgba(255,255,255,.08);border-radius:16px;box-shadow:0 24px 80px rgba(0,0,0,.6);font-family:system-ui,-apple-system,'Segoe UI',sans-serif;color:#e2e8f0;overflow:hidden;display:flex;flex-direction:column;opacity:0;transition:opacity .12s,transform .12s}
#saio-sb.saio-show{opacity:1;transform:translate(-50%,-50%) scale(1)}
 
/* Header */
.saio-hd{padding:14px 16px 10px;border-bottom:1px solid rgba(255,255,255,.06);flex-shrink:0}
.saio-input{width:100%;background:rgba(255,255,255,.05);border:1.5px solid rgba(255,255,255,.12);border-radius:8px;padding:9px 12px;color:#fff;font-size:14px;outline:none;box-sizing:border-box;font-family:inherit;transition:border-color .15s,box-shadow .15s}
.saio-input:focus{border-color:#9B72CB;box-shadow:0 0 0 3px rgba(155,114,203,.15)}
.saio-input::placeholder{color:#555}
 
/* Tabs */
.saio-tabs{display:flex;gap:4px;margin-top:10px}
.saio-tab{flex:1;text-align:center;padding:7px 2px;border-radius:8px;font-size:11px;font-weight:500;cursor:pointer;transition:all .12s;background:rgba(255,255,255,.03);color:#666;user-select:none;white-space:nowrap}
.saio-tab:hover{background:rgba(255,255,255,.07);color:#aaa}
.saio-tab.saio-active{background:#007aff;color:#fff;font-weight:700}
/* Special styling for Google AI Tab */
.saio-tab[data-cat="google_ai"].saio-active{background:linear-gradient(135deg,#4285F4,#9B72CB,#D96570);color:#fff;}
.saio-tab .saio-key{display:inline-block;font-size:9px;opacity:.5;margin-left:3px;background:rgba(255,255,255,.1);padding:1px 4px;border-radius:3px;vertical-align:middle}
.saio-tab.saio-active .saio-key{opacity:.9;background:rgba(255,255,255,.25)}
 
/* Grid */
.saio-grid{display:grid;grid-template-columns:1fr 1fr;gap:4px;padding:10px 12px;overflow-y:auto;flex:1;min-height:0;scrollbar-width:thin;scrollbar-color:rgba(255,255,255,.1) transparent}
.saio-grid::-webkit-scrollbar{width:5px}
.saio-grid::-webkit-scrollbar-thumb{background:rgba(255,255,255,.1);border-radius:4px}
.saio-item{display:flex;align-items:center;gap:8px;padding:8px 10px;border-radius:8px;cursor:pointer;font-size:12.5px;transition:background .08s;background:transparent;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;user-select:none;color:#bbb}
.saio-item:hover{background:rgba(255,255,255,.06)}
.saio-item.saio-sel{background:rgba(255,255,255,.15);color:#fff;border-left:3px solid #9B72CB;}
.saio-item .saio-idx{font-size:9px;color:#555;min-width:12px;text-align:right;font-family:monospace}
.saio-item.saio-sel .saio-idx{color:rgba(255,255,255,.5)}
.saio-item .saio-cb{font-size:8px;color:#9B72CB;margin-left:auto;flex-shrink:0;opacity:.8;font-weight:bold;}
.saio-item.saio-sel .saio-cb{color:#D96570;}
 
/* Empty state */
.saio-empty{padding:24px;text-align:center;color:#555;font-size:13px}
 
/* Footer */
.saio-ft{padding:7px 14px;font-size:9.5px;color:#444;background:rgba(0,0,0,.25);display:flex;justify-content:space-between;align-items:center;flex-shrink:0;border-top:1px solid rgba(255,255,255,.04)}
.saio-ft kbd{background:rgba(255,255,255,.06);padding:1px 5px;border-radius:3px;font-family:inherit;color:#555}
.saio-ft-right{display:flex;align-items:center;gap:6px}
.saio-help-btn{background:none;border:1px solid rgba(255,255,255,.1);border-radius:4px;color:#555;cursor:pointer;font-size:inherit;padding:1px 5px;line-height:1.2;transition:all .12s;font-family:inherit}
.saio-help-btn:hover{background:rgba(255,255,255,.08);color:#888;border-color:rgba(255,255,255,.2)}
 
/* Help modal */
#saio-help{all:initial;position:fixed;z-index:2147483647;top:50%;left:50%;transform:translate(-50%,-50%) scale(.96);width:380px;background:rgba(18,18,22,.98);backdrop-filter:blur(28px);-webkit-backdrop-filter:blur(28px);border:1px solid rgba(255,255,255,.1);border-radius:14px;box-shadow:0 24px 80px rgba(0,0,0,.7);font-family:system-ui,-apple-system,'Segoe UI',sans-serif;color:#e2e8f0;padding:20px;opacity:0;transition:opacity .12s,transform .12s}
#saio-help.saio-show{opacity:1;transform:translate(-50%,-50%) scale(1)}
#saio-help h3{margin:0 0 14px;font-size:14px;font-weight:700;color:#fff}
#saio-help table{width:100%;border-collapse:collapse;font-size:11.5px}
#saio-help td{padding:4px 0;vertical-align:top}
#saio-help td:first-child{color:#9B72CB;font-weight:600;white-space:nowrap;padding-right:12px;font-family:'SF Mono','Cascadia Code',monospace;font-size:10.5px}
#saio-help td:last-child{color:#999}
#saio-help .saio-help-close{margin-top:14px;text-align:center;font-size:10px;color:#555}
`;
    document.head.appendChild(style);
 
    // ── Helpers ───────────────────────────────────────────────────
    function getFiltered() {
        const catEngines = ENGINES.filter(e => e.cat === activeCat);
        if (!filterText) return catEngines;
        const f = filterText.toLowerCase();
        return catEngines.filter(e => e.label.toLowerCase().includes(f) || e.id.toLowerCase().includes(f));
    }
 
    function escAttr(s) { return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
 
    // ── Render ───────────────────────────────────────────────────
    function render() {
        if (!sidebar) return;
        const grid = sidebar.querySelector('.saio-grid');
        grid.innerHTML = '';
        const items = getFiltered();
        if (selectedIndex >= items.length) selectedIndex = Math.max(0, items.length - 1);
 
        if (!items.length) {
            grid.innerHTML = '<div class="saio-empty">No engines match filter</div>';
        } else {
            items.forEach((e, i) => {
                const div = document.createElement('div');
                div.className = 'saio-item' + (i === selectedIndex ? ' saio-sel' : '');
                div.dataset.idx = i;
                const idxLabel = String.fromCharCode(97 + i); // a, b, c...
                div.innerHTML = `<span class="saio-idx">${i < 26 ? idxLabel : ''}</span><span>${escAttr(e.label)}</span>${e.clipboard ? '<span class="saio-cb">+clip</span>' : ''}`;
                div.addEventListener('click', (ev) => { ev.stopPropagation(); ev.preventDefault(); launch(e); });
                div.addEventListener('mouseenter', () => {
                    const prev = grid.querySelector('.saio-sel');
                    if (prev) prev.classList.remove('saio-sel');
                    div.classList.add('saio-sel');
                    selectedIndex = i;
                });
                grid.appendChild(div);
            });
            const sel = grid.querySelector('.saio-sel');
            if (sel) sel.scrollIntoView({ block: 'nearest' });
        }
 
        sidebar.querySelectorAll('.saio-tab').forEach((t, i) => {
            t.className = 'saio-tab' + (CATS[i] === activeCat ? ' saio-active' : '');
        });
    }
 
    // ── Launch ───────────────────────────────────────────────────
    function launch(engine) {
        const input = sidebar && sidebar.querySelector('.saio-input');
        const finalQuery = (input && input.value.trim()) || query;
        if (!finalQuery && !engine.url.includes('notebooklm')) return; // Allow launching NotebookLM empty
        if (engine.clipboard) navigator.clipboard.writeText(finalQuery).catch(() => {});
        const url = engine.url.replace('{q}', encodeURIComponent(finalQuery));
        closeSidebar();
        GM_openInTab(url, { active: true });
    }
 
    // ── Open Sidebar ─────────────────────────────────────────────
    function openSidebar() {
        if (sidebar) { closeSidebar(); return; }
        selectedIndex = 0;
        filterText = '';
 
        const overlay = document.createElement('div');
        overlay.id = 'saio-overlay';
        overlay.onclick = () => closeSidebar();
        document.body.appendChild(overlay);
 
        sidebar = document.createElement('div');
        sidebar.id = 'saio-sb';
        sidebar.onmousedown = (e) => e.stopPropagation();
 
        sidebar.innerHTML = `
            <div class="saio-hd">
                <input type="text" class="saio-input" value="${escAttr(query)}" placeholder="Type query… (/ to focus)">
                <div class="saio-tabs">
                    ${CATS.map((c, i) => `<div class="saio-tab" data-cat="${c}">${CAT_LABELS[c]}<span class="saio-key">${i + 1}</span></div>`).join('')}
                </div>
            </div>
            <div class="saio-grid"></div>
            <div class="saio-ft">
                <span><kbd>/</kbd> edit <kbd>Tab</kbd> cats <kbd>a-z</kbd> go <kbd>Esc</kbd> close</span>
                <span class="saio-ft-right">SearchAIO v8.0 ✨ <button class="saio-help-btn" title="Keyboard shortcuts (Ctrl+?)">⌨️</button></span>
            </div>
        `;
        document.body.appendChild(sidebar);
 
        requestAnimationFrame(() => {
            overlay.classList.add('saio-show');
            sidebar.classList.add('saio-show');
        });
 
        const input = sidebar.querySelector('.saio-input');
        sidebar.focus();
 
        sidebar.querySelector('.saio-help-btn').onclick = (ev) => {
            ev.stopPropagation();
            toggleHelp();
        };
 
        sidebar.querySelectorAll('.saio-tab').forEach(t => {
            t.onclick = (ev) => {
                ev.stopPropagation();
                activeCat = t.dataset.cat;
                GM_setValue('saio_cat', activeCat);
                selectedIndex = 0;
                render();
            };
        });
 
        render();
 
        const keyHandler = (e) => {
            if (!sidebar) return;
            const items = getFiltered();
            const isInput = document.activeElement === input;
            const cols = 2;
 
            if (e.key === 'Escape') { e.preventDefault(); closeSidebar(); return; }
            if (e.key === 'Enter') { e.preventDefault(); if (items[selectedIndex]) launch(items[selectedIndex]); return; }
 
            if (e.key === 'Tab') {
                e.preventDefault();
                const dir = e.shiftKey ? -1 : 1;
                const ci = CATS.indexOf(activeCat);
                activeCat = CATS[(ci + dir + CATS.length) % CATS.length];
                GM_setValue('saio_cat', activeCat);
                selectedIndex = 0;
                render();
                return;
            }
 
            if (!isInput && ['1', '2', '3', '4', '5'].includes(e.key)) {
                activeCat = CATS[parseInt(e.key) - 1];
                GM_setValue('saio_cat', activeCat);
                selectedIndex = 0;
                render();
                return;
            }
 
            if (!isInput && /^[a-zA-Z]$/.test(e.key) && !e.ctrlKey && !e.metaKey && !e.altKey) {
                const idx = e.key.toLowerCase().charCodeAt(0) - 97;
                if (idx >= 0 && idx < items.length) { e.preventDefault(); launch(items[idx]); }
                return;
            }
 
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (isInput) { input.blur(); selectedIndex = 0; }
                else if (selectedIndex + cols < items.length) selectedIndex += cols;
                else selectedIndex = Math.min(items.length - 1, selectedIndex + cols);
                render();
                return;
            }
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (selectedIndex - cols >= 0) selectedIndex -= cols;
                else { selectedIndex = 0; input.focus(); input.select(); }
                render();
                return;
            }
            if (e.key === 'ArrowRight' && !isInput) {
                e.preventDefault();
                if (selectedIndex + 1 < items.length) selectedIndex++;
                render();
                return;
            }
            if (e.key === 'ArrowLeft' && !isInput) {
                e.preventDefault();
                if (selectedIndex > 0) selectedIndex--;
                render();
                return;
            }
 
            if (e.key === '/') {
                e.preventDefault();
                if (isInput) input.blur();
                else { input.focus(); input.select(); }
                return;
            }
            if (e.key === '?' && e.ctrlKey) { e.preventDefault(); toggleHelp(); return; }
        };
 
        window.addEventListener('keydown', keyHandler, true);
        sidebar._kh = keyHandler;
        sidebar._ov = overlay;
    }
 
    let helpModal = null;
    function toggleHelp() {
        if (helpModal) { helpModal.remove(); helpModal = null; return; }
        helpModal = document.createElement('div');
        helpModal.id = 'saio-help';
        helpModal.onmousedown = (e) => e.stopPropagation();
        helpModal.innerHTML = `
            <h3>⌨️ Keyboard Shortcuts</h3>
            <table>
                <tr><td>Alt+S</td><td>Open/close sidebar</td></tr>
                <tr><td>/</td><td>Focus / unfocus search input</td></tr>
                <tr><td>a-z</td><td>Launch engine by letter (grid mode)</td></tr>
                <tr><td>1-5</td><td>Switch category (grid mode)</td></tr>
                <tr><td>Tab</td><td>Next category (Shift+Tab = prev)</td></tr>
                <tr><td>↑ ↓ ← →</td><td>Navigate engine grid</td></tr>
                <tr><td>Enter</td><td>Launch selected engine</td></tr>
                <tr><td>Escape</td><td>Close sidebar / close help</td></tr>
                <tr><td>Ctrl+?</td><td>Toggle this help</td></tr>
            </table>
            <div class="saio-help-close">Press <b>Esc</b> or <b>Ctrl+?</b> to close</div>
        `;
        document.body.appendChild(helpModal);
        requestAnimationFrame(() => helpModal.classList.add('saio-show'));
    }
 
    function closeSidebar() {
        if (helpModal) { helpModal.remove(); helpModal = null; }
        if (triggerBtn) { triggerBtn.remove(); triggerBtn = null; }
        if (sidebar) {
            window.removeEventListener('keydown', sidebar._kh, true);
            if (sidebar._ov) sidebar._ov.remove();
            sidebar.remove();
            sidebar = null;
        }
    }
 
    document.addEventListener('mouseup', (e) => {
        if (sidebar && sidebar.contains(e.target)) return;
        if (triggerBtn && triggerBtn.contains(e.target)) return;
        setTimeout(() => {
            const sel = window.getSelection();
            const text = sel ? sel.toString().trim() : '';
            if (text.length > 1) {
                query = text;
                if (triggerBtn) triggerBtn.remove();
                triggerBtn = document.createElement('div');
                triggerBtn.id = 'saio-trigger';
                triggerBtn.innerHTML = '<div id="saio-trigger-inner">✨</div>';
                document.body.appendChild(triggerBtn);
                const r = sel.getRangeAt(0).getBoundingClientRect();
                triggerBtn.style.left = (r.right + window.scrollX - 8) + 'px';
                triggerBtn.style.top = (r.top + window.scrollY - 42) + 'px';
                triggerBtn.onclick = (ev) => {
                    ev.stopPropagation();
                    ev.preventDefault();
                    openSidebar();
                };
            } else if (!sidebar) {
                if (triggerBtn) { triggerBtn.remove(); triggerBtn = null; }
            }
        }, 30);
    });
 
    document.addEventListener('mousedown', (e) => {
        if (sidebar && !sidebar.contains(e.target)) closeSidebar();
    });
 
    document.addEventListener('keydown', (e) => {
        if (e.altKey && e.key.toLowerCase() === 's') {
            e.preventDefault();
            e.stopPropagation();
            const sel = window.getSelection();
            const text = sel ? sel.toString().trim() : '';
            if (text.length > 1) query = text;
            openSidebar();
            return;
        }
        if (e.key === '?' && e.ctrlKey) {
            e.preventDefault();
            e.stopPropagation();
            toggleHelp();
            return;
        }
        if (e.key === 'Escape' && helpModal) {
            e.preventDefault();
            helpModal.remove();
            helpModal = null;
        }
    }, true);
 
})();
