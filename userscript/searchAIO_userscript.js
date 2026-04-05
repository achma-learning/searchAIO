// ==UserScript==
// @name         SearchAIO — Sidebar Power Search
// @namespace    https://achma-learning.github.io/searchAIO/
// @version      7.0
// @description  Selection → ⚡ → Edit text & Search across Medical/Academic/AI grids. Alt+S to open sidebar.
// @author       SearchAIO
// @match        *://*/*
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL  https://update.greasyfork.org/scripts/568031/SearchAIO%20%E2%80%94%20Professional%20%28Editable%20Query%20Focus%29.user.js
// @updateURL    https://update.greasyfork.org/scripts/568031/SearchAIO%20%E2%80%94%20Professional%20%28Editable%20Query%20Focus%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ── Engines (synced with index.html) ──────────────────────────
    const ENGINES = [
        // 🌐 General
        { id: 'google',   label: 'Google',            cat: 'general',  url: 'https://www.google.com/search?q={q}' },
        { id: 'youtube',  label: 'YouTube',           cat: 'general',  url: 'https://www.youtube.com/results?search_query={q}' },
        { id: 'brave',    label: 'Brave Search',      cat: 'general',  url: 'https://search.brave.com/search?q={q}' },
        { id: 'ddg',      label: 'DuckDuckGo',        cat: 'general',  url: 'https://duckduckgo.com/?q={q}' },
        { id: 'yandex',   label: 'Yandex',            cat: 'general',  url: 'https://yandex.com/search/?text={q}' },
        { id: 'bing',     label: 'Bing',              cat: 'general',  url: 'https://www.bing.com/search?q={q}' },
        { id: 'baidu',    label: 'Baidu',             cat: 'general',  url: 'https://www.baidu.com/s?wd={q}' },
        { id: 'gplus',    label: 'Google Avancé',     cat: 'general',  url: 'https://www.google.com/advanced_search?q={q}' },
        { id: 'wiki',     label: 'Wikipedia',         cat: 'general',  url: 'https://wikipedia.org/w/index.php?search={q}' },
        { id: 'bdbk',     label: 'Baidu Baike',       cat: 'general',  url: 'https://baike.baidu.com/item/{q}' },
        { id: 'grokw',    label: 'Grokipedia',        cat: 'general',  url: 'https://grokipedia.com/search?q={q}' },
        { id: 'ww',       label: 'WikiWand',          cat: 'general',  url: 'https://www.wikiwand.com/en/search?q={q}' },

        // 🎓 Academic
        { id: 'scholar',   label: 'Google Scholar',   cat: 'academic', url: 'https://scholar.google.com/scholar?q={q}' },
        { id: 'pubmed',    label: 'PubMed',           cat: 'academic', url: 'https://pubmed.ncbi.nlm.nih.gov/?term={q}' },
        { id: 'arxiv',     label: 'arXiv',            cat: 'academic', url: 'https://arxiv.org/search/?query={q}' },
        { id: 'gpat',      label: 'Google Patents',   cat: 'academic', url: 'https://patents.google.com/?q={q}' },
        { id: 'these20',   label: 'These2.0',         cat: 'academic', url: 'https://thesefmpm.vercel.app/search?page=1&search={q}' },
        { id: 'cismefth',  label: 'CISMeF Thèses',   cat: 'academic', url: 'https://doccismef.chu-rouen.fr/dc/#env=thm&q={q}' },
        { id: 'toubkal',   label: 'Toubkal',          cat: 'academic', url: 'https://toubkal.imist.ma/search?query={q}' },
        { id: 'thesesfr',  label: 'Theses.fr',        cat: 'academic', url: 'https://theses.fr/resultats?q={q}' },
        { id: 'rgate',     label: 'ResearchGate',     cat: 'academic', url: 'https://www.researchgate.net/search/publication?q={q}' },
        { id: 'ndltd',     label: 'NDLTD',            cat: 'academic', url: 'http://search.ndltd.org/search.php?q={q}' },
        { id: 'proinserm', label: 'Pro Inserm',       cat: 'academic', url: 'https://pro.inserm.fr/?s={q}' },
        { id: 'bdedu',     label: 'Baidu Scholar',    cat: 'academic', url: 'https://xueshu.baidu.com/ndscholar/browse/search?wd={q}' },
        { id: 'cybl',      label: 'CyberLeninka',     cat: 'academic', url: 'https://cyberleninka.ru/search?q={q}' },

        // ⚕️ Medical
        { id: 'cismef',    label: 'CISMeF',            cat: 'medical', url: 'https://doccismef.chu-rouen.fr/dc/#env=basic&q={q}' },
        { id: 'msps',      label: 'MSPS (Morocco)',     cat: 'medical', url: 'https://www.google.com/search?q=site:sante.gov.ma+{q}' },
        { id: 'ammps',     label: 'AMMPS',              cat: 'medical', url: 'https://ammps.sante.gov.ma/recherche-medicaments?search={q}' },
        { id: 'has',       label: 'HAS',                cat: 'medical', url: 'https://www.has-sante.fr/jcms/fc_2875171/fr/resultat-de-recherche?text={q}' },
        { id: 'vidal',     label: 'VIDAL',              cat: 'medical', url: 'https://www.vidal.fr/recherche.html?query={q}' },
        { id: 'mesh',      label: 'MeSH Browser',       cat: 'medical', url: 'https://meshb.nlm.nih.gov/search?searchInField=allTerms&searchString={q}' },
        { id: 'lissa',     label: 'LISSA',              cat: 'medical', url: 'https://www.lissa.fr/dc/#env=lissa&q={q}' },
        { id: 'anm',       label: 'Acad. Méd. (ANM)',   cat: 'medical', url: 'http://91.209.229.113/search?titre={q}' },
        { id: 'hetop',     label: 'HETOP',              cat: 'medical', url: 'https://www.hetop.eu/hetop/fr/#oti=all&q={q}' },
        { id: 'nejm',      label: 'NEJM',               cat: 'medical', url: 'https://www.nejm.org/search?q={q}' },
        { id: 'rp',        label: 'Radiopaedia',        cat: 'medical', url: 'https://radiopaedia.org/search?q={q}' },
        { id: 'utd',       label: 'UpToDate',           cat: 'medical', url: 'https://www.uptodate.com/contents/search?search={q}' },
        { id: 'coch',      label: 'Cochrane',           cat: 'medical', url: 'https://www.cochranelibrary.com/search?q={q}' },
        { id: 'medscape',  label: 'Medscape',           cat: 'medical', url: 'https://search.medscape.com/search/fr/{q}' },
        { id: 'openmd',    label: 'OpenMD',             cat: 'medical', url: 'https://openmd.com/search?q={q}' },
        { id: 'dd',        label: 'Diseases DB',        cat: 'medical', url: 'http://www.diseasesdatabase.com/item_choice.asp?strUserInput={q}' },
        { id: 'webmd',     label: 'WebMD',              cat: 'medical', url: 'https://www.webmd.com/search?query={q}' },
        { id: 'nih',       label: 'NIH',                cat: 'medical', url: 'https://search.usa.gov/search?utf8=%E2%9C%93&affiliate=nih&query={q}' },
        { id: 'drugs',     label: 'Drugs.com',          cat: 'medical', url: 'https://www.drugs.com/search.php?searchterm={q}' },
        { id: 'cdc',       label: 'CDC',                cat: 'medical', url: 'https://search.cdc.gov/search/?query={q}' },

        // 🤖 AI / Advanced
        { id: 'wolfram',    label: 'Wolfram Alpha',  cat: 'ai', url: 'https://www.wolframalpha.com/input?i={q}' },
        { id: 'chatgpt',    label: 'ChatGPT',        cat: 'ai', url: 'https://chatgpt.com/?prompt={q}' },
        { id: 'claude',     label: 'Claude AI',      cat: 'ai', url: 'https://claude.ai/new?q={q}', clipboard: true },
        { id: 'gemini',     label: 'Gemini',         cat: 'ai', url: 'https://gemini.google.com/app?q={q}', clipboard: true },
        { id: 'gai',        label: 'Google AI Mode', cat: 'ai', url: 'https://www.google.com/search?udm=50&q={q}' },
        { id: 'perplexity', label: 'Perplexity',     cat: 'ai', url: 'https://www.perplexity.ai/search?q={q}' },
        { id: 'copilot',    label: 'Copilot',        cat: 'ai', url: 'https://copilot.microsoft.com/?q={q}', clipboard: true },
        { id: 'cbd',        label: 'Chat Baidu',     cat: 'ai', url: 'https://chat.baidu.com/search?word={q}' },
        { id: 'ernie',      label: 'Baidu AI',       cat: 'ai', url: 'https://ernie.baidu.com/', clipboard: true },
        { id: 'duckai',     label: 'Duck.ai',        cat: 'ai', url: 'https://duck.ai/chat?q={q}' },
        { id: 'alphaf',     label: 'AlphaFold',      cat: 'ai', url: 'https://alphafold.ebi.ac.uk/search/text/{q}' },
    ];

    const CATS = ['general', 'academic', 'medical', 'ai'];
    const CAT_LABELS = { general: '🌐 General', academic: '🎓 Academic', medical: '⚕️ Medical', ai: '🤖 AI' };
    const CAT_KEYS = { general: '1', academic: '2', medical: '3', ai: '4' };

    let activeCat = GM_getValue('saio_cat', 'medical');
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
#saio-trigger-inner{width:30px;height:30px;background:#111;border:2px solid #007aff;border-radius:10px;box-shadow:0 2px 12px rgba(0,0,0,.3);display:flex;align-items:center;justify-content:center;font-size:16px;transition:transform .1s;color:#fff}
#saio-trigger:hover #saio-trigger-inner{transform:scale(1.12);border-color:#38bdf8}

/* Sidebar overlay */
#saio-overlay{position:fixed;inset:0;z-index:2147483646;background:rgba(0,0,0,.35);backdrop-filter:blur(3px);-webkit-backdrop-filter:blur(3px);opacity:0;transition:opacity .15s;pointer-events:auto}
#saio-overlay.saio-show{opacity:1}

/* Sidebar */
#saio-sb{all:initial;position:fixed;z-index:2147483647;top:50%;left:50%;transform:translate(-50%,-50%) scale(.96);width:520px;max-height:85vh;background:rgba(18,18,22,.96);backdrop-filter:blur(28px) saturate(1.6);-webkit-backdrop-filter:blur(28px) saturate(1.6);border:1px solid rgba(255,255,255,.08);border-radius:16px;box-shadow:0 24px 80px rgba(0,0,0,.6);font-family:system-ui,-apple-system,'Segoe UI',sans-serif;color:#e2e8f0;overflow:hidden;display:flex;flex-direction:column;opacity:0;transition:opacity .12s,transform .12s}
#saio-sb.saio-show{opacity:1;transform:translate(-50%,-50%) scale(1)}

/* Header */
.saio-hd{padding:14px 16px 10px;border-bottom:1px solid rgba(255,255,255,.06);flex-shrink:0}
.saio-input{width:100%;background:rgba(255,255,255,.05);border:1.5px solid rgba(255,255,255,.12);border-radius:8px;padding:9px 12px;color:#fff;font-size:14px;outline:none;box-sizing:border-box;font-family:inherit;transition:border-color .15s,box-shadow .15s}
.saio-input:focus{border-color:#007aff;box-shadow:0 0 0 3px rgba(0,122,255,.15)}
.saio-input::placeholder{color:#555}

/* Tabs */
.saio-tabs{display:flex;gap:4px;margin-top:10px}
.saio-tab{flex:1;text-align:center;padding:7px 2px;border-radius:8px;font-size:11px;font-weight:500;cursor:pointer;transition:all .12s;background:rgba(255,255,255,.03);color:#666;user-select:none;white-space:nowrap}
.saio-tab:hover{background:rgba(255,255,255,.07);color:#aaa}
.saio-tab.saio-active{background:#007aff;color:#fff;font-weight:700}
.saio-tab .saio-key{display:inline-block;font-size:9px;opacity:.5;margin-left:3px;background:rgba(255,255,255,.1);padding:1px 4px;border-radius:3px;vertical-align:middle}
.saio-tab.saio-active .saio-key{opacity:.7;background:rgba(255,255,255,.2)}

/* Grid */
.saio-grid{display:grid;grid-template-columns:1fr 1fr;gap:4px;padding:10px 12px;overflow-y:auto;flex:1;min-height:0;scrollbar-width:thin;scrollbar-color:rgba(255,255,255,.1) transparent}
.saio-grid::-webkit-scrollbar{width:5px}
.saio-grid::-webkit-scrollbar-thumb{background:rgba(255,255,255,.1);border-radius:4px}
.saio-item{display:flex;align-items:center;gap:8px;padding:8px 10px;border-radius:8px;cursor:pointer;font-size:12.5px;transition:background .08s;background:transparent;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;user-select:none;color:#bbb}
.saio-item:hover{background:rgba(255,255,255,.06)}
.saio-item.saio-sel{background:rgba(0,122,255,.85);color:#fff}
.saio-item .saio-idx{font-size:9px;color:#555;min-width:12px;text-align:right;font-family:monospace}
.saio-item.saio-sel .saio-idx{color:rgba(255,255,255,.5)}
.saio-item .saio-cb{font-size:8px;color:#007aff;margin-left:auto;flex-shrink:0;opacity:.6}
.saio-item.saio-sel .saio-cb{color:rgba(255,255,255,.6)}

/* Empty state */
.saio-empty{padding:24px;text-align:center;color:#555;font-size:13px}

/* Footer */
.saio-ft{padding:7px 14px;font-size:9.5px;color:#444;background:rgba(0,0,0,.25);display:flex;justify-content:space-between;flex-shrink:0;border-top:1px solid rgba(255,255,255,.04)}
.saio-ft kbd{background:rgba(255,255,255,.06);padding:1px 5px;border-radius:3px;font-family:inherit;color:#555}
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
                div.onclick = (ev) => { ev.stopPropagation(); launch(e); };
                div.onmouseenter = () => { selectedIndex = i; render(); };
                grid.appendChild(div);
            });
            // scroll selected into view
            const sel = grid.querySelector('.saio-sel');
            if (sel) sel.scrollIntoView({ block: 'nearest' });
        }

        sidebar.querySelectorAll('.saio-tab').forEach((t, i) => {
            t.className = 'saio-tab' + (CATS[i] === activeCat ? ' saio-active' : '');
        });
    }

    // ── Launch ───────────────────────────────────────────────────
    function launch(e) {
        const input = sidebar && sidebar.querySelector('.saio-input');
        const finalQuery = (input && input.value.trim()) || query;
        if (!finalQuery) return;
        if (e.clipboard) navigator.clipboard.writeText(finalQuery).catch(() => {});
        const url = e.url.replace('{q}', encodeURIComponent(finalQuery));
        GM_openInTab(url, { active: true });
        closeSidebar();
    }

    // ── Open Sidebar (centered) ──────────────────────────────────
    function openSidebar() {
        if (sidebar) { closeSidebar(); return; }
        selectedIndex = 0;
        filterText = '';

        // Overlay
        const overlay = document.createElement('div');
        overlay.id = 'saio-overlay';
        overlay.onclick = () => closeSidebar();
        document.body.appendChild(overlay);

        // Sidebar
        sidebar = document.createElement('div');
        sidebar.id = 'saio-sb';
        sidebar.onmousedown = (e) => e.stopPropagation();

        sidebar.innerHTML = `
            <div class="saio-hd">
                <input type="text" class="saio-input" value="${escAttr(query)}" placeholder="Search anything... (Alt+S)">
                <div class="saio-tabs">
                    ${CATS.map((c, i) => `<div class="saio-tab" data-cat="${c}">${CAT_LABELS[c]}<span class="saio-key">${i + 1}</span></div>`).join('')}
                </div>
            </div>
            <div class="saio-grid"></div>
            <div class="saio-ft">
                <span><kbd>Tab</kbd> cats <kbd>↑↓</kbd> nav <kbd>Enter</kbd> go <kbd>Esc</kbd> close</span>
                <span>SearchAIO v7.0</span>
            </div>
        `;
        document.body.appendChild(sidebar);

        // Animate in
        requestAnimationFrame(() => {
            overlay.classList.add('saio-show');
            sidebar.classList.add('saio-show');
        });

        const input = sidebar.querySelector('.saio-input');
        input.focus();
        input.select();

        // Tab clicks
        sidebar.querySelectorAll('.saio-tab').forEach(t => {
            t.onclick = (ev) => {
                ev.stopPropagation();
                activeCat = t.dataset.cat;
                GM_setValue('saio_cat', activeCat);
                selectedIndex = 0;
                render();
                input.focus();
            };
        });

        // Filter on input
        input.addEventListener('input', () => {
            // no filtering on main query — user types query freely
        });

        render();

        // ── Keyboard handler ─────────────────────────────────────
        const keyHandler = (e) => {
            if (!sidebar) return;
            const items = getFiltered();
            const isInput = document.activeElement === input;
            const cols = 2;

            if (e.key === 'Escape') {
                e.preventDefault();
                closeSidebar();
                return;
            }

            if (e.key === 'Enter') {
                e.preventDefault();
                if (items[selectedIndex]) launch(items[selectedIndex]);
                return;
            }

            // Tab cycles categories (Shift+Tab backwards)
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

            // Number keys 1-4 switch categories (when not typing in input)
            if (!isInput && ['1', '2', '3', '4'].includes(e.key)) {
                activeCat = CATS[parseInt(e.key) - 1];
                GM_setValue('saio_cat', activeCat);
                selectedIndex = 0;
                render();
                return;
            }

            // Letter shortcuts a-z to jump to engine (when not in input)
            if (!isInput && /^[a-z]$/.test(e.key) && !e.ctrlKey && !e.metaKey && !e.altKey) {
                const idx = e.key.charCodeAt(0) - 97;
                if (idx >= 0 && idx < items.length) {
                    e.preventDefault();
                    launch(items[idx]);
                }
                return;
            }

            // Arrow navigation
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

            // / to focus input
            if (e.key === '/' && !isInput) {
                e.preventDefault();
                input.focus();
                input.select();
                return;
            }
        };

        window.addEventListener('keydown', keyHandler, true);
        sidebar._kh = keyHandler;
        sidebar._ov = overlay;
    }

    // ── Close ────────────────────────────────────────────────────
    function closeSidebar() {
        if (triggerBtn) { triggerBtn.remove(); triggerBtn = null; }
        if (sidebar) {
            window.removeEventListener('keydown', sidebar._kh, true);
            if (sidebar._ov) sidebar._ov.remove();
            sidebar.remove();
            sidebar = null;
        }
    }

    // ── Selection → ⚡ trigger ───────────────────────────────────
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
                triggerBtn.innerHTML = '<div id="saio-trigger-inner">⚡</div>';
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

    // Click outside closes sidebar
    document.addEventListener('mousedown', (e) => {
        if (sidebar && !sidebar.contains(e.target)) closeSidebar();
    });

    // ── Alt+S global shortcut ────────────────────────────────────
    document.addEventListener('keydown', (e) => {
        if (e.altKey && e.key.toLowerCase() === 's') {
            e.preventDefault();
            e.stopPropagation();
            // Grab current selection if any
            const sel = window.getSelection();
            const text = sel ? sel.toString().trim() : '';
            if (text.length > 1) query = text;
            openSidebar();
        }
    }, true);

})();
