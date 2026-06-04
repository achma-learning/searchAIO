// ==UserScript==
// @name         SearchAIO Med — Thesis & Clinical Power Search
// @namespace    https://achma-learning.github.io/searchAIO/
// @version      1.0
// @description  Select text → ⚡ → search medical/academic engines, fire Search Packs (PubMed+Cochrane+UpToDate…), apply PubMed filters, resolve DOI/PMID/NCT, translate FR/AR→EN. Built for medical students writing a thesis and doctors in daily practice. Alt+S to open.
// @author       SearchAIO
// @match        *://*/*
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @connect      translate.googleapis.com
// @run-at       document-idle
// @license      MIT
// ==/UserScript==

(function () {
    'use strict';

    // ── Engines (synced with index.html) ──────────────────────────
    // plus:true  → encode spaces as '+'  ·  clipboard:true → copy query (AI paste)
    // pubmed:true → PubMed-syntax filters apply when launching this engine
    const ENGINES = [
        // ⚕️ Medical
        { id: 'pubmed',   label: 'PubMed',          cat: 'medical',  url: 'https://pubmed.ncbi.nlm.nih.gov/?term={q}', pubmed: true },
        { id: 'cismef',   label: 'CISMeF',          cat: 'medical',  url: 'https://doccismef.chu-rouen.fr/dc/#env=basic&q={q}' },
        { id: 'mesh',     label: 'MeSH Browser',    cat: 'medical',  url: 'https://meshb.nlm.nih.gov/search?searchInField=allTerms&searchString={q}' },
        { id: 'coch',     label: 'Cochrane',        cat: 'medical',  url: 'https://www.cochranelibrary.com/search?q={q}' },
        { id: 'utd',      label: 'UpToDate',        cat: 'medical',  url: 'https://www.uptodate.com/contents/search?search={q}' },
        { id: 'nejm',     label: 'NEJM',            cat: 'medical',  url: 'https://www.nejm.org/search?q={q}' },
        { id: 'medscape', label: 'Medscape',        cat: 'medical',  url: 'https://search.medscape.com/search/?q={q}' },
        { id: 'rp',       label: 'Radiopaedia',     cat: 'medical',  url: 'https://radiopaedia.org/search?q={q}' },
        { id: 'has',      label: 'HAS',             cat: 'medical',  url: 'https://www.has-sante.fr/jcms/fc_2875171/fr/resultat-de-recherche?text={q}' },
        { id: 'vidal',    label: 'VIDAL',           cat: 'medical',  url: 'https://www.vidal.fr/recherche.html?query={q}' },
        { id: 'drugs',    label: 'Drugs.com',       cat: 'medical',  url: 'https://www.drugs.com/search.php?searchterm={q}' },
        { id: 'ammps',    label: 'AMMPS (Maroc)',   cat: 'medical',  url: 'https://ammps.sante.gov.ma/recherche-medicaments?search={q}', plus: true },
        { id: 'msps',     label: 'MSPS (Maroc)',    cat: 'medical',  url: 'https://www.google.com/search?q=site:sante.gov.ma+{q}' },
        { id: 'lissa',    label: 'LISSA',           cat: 'medical',  url: 'https://www.lissa.fr/dc/#env=lissa&q={q}' },
        { id: 'hetop',    label: 'HETOP',           cat: 'medical',  url: 'https://www.hetop.eu/hetop/fr/#oti=all&q={q}', plus: true },
        { id: 'openmd',   label: 'OpenMD',          cat: 'medical',  url: 'https://openmd.com/search?q={q}' },
        { id: 'webmd',    label: 'WebMD',           cat: 'medical',  url: 'https://www.webmd.com/search?query={q}' },
        { id: 'nih',      label: 'NIH',             cat: 'medical',  url: 'https://search.usa.gov/search?utf8=%E2%9C%93&affiliate=nih&query={q}' },
        { id: 'cdc',      label: 'CDC',             cat: 'medical',  url: 'https://search.cdc.gov/search/?query={q}' },
        { id: 'dd',       label: 'Diseases DB',     cat: 'medical',  url: 'http://www.diseasesdatabase.com/item_choice.asp?strUserInput={q}' },

        // 🎓 Academic / Thèses
        { id: 'scholar',  label: 'Google Scholar',  cat: 'academic', url: 'https://scholar.google.com/scholar?q={q}' },
        { id: 'arxiv',    label: 'arXiv',           cat: 'academic', url: 'https://arxiv.org/search/?query={q}' },
        { id: 'gpat',     label: 'Google Patents',  cat: 'academic', url: 'https://patents.google.com/?q={q}' },
        { id: 'rgate',    label: 'ResearchGate',    cat: 'academic', url: 'https://www.researchgate.net/search/publication?q={q}' },
        { id: 'cismefth', label: 'CISMeF Thèses',   cat: 'academic', url: 'https://doccismef.chu-rouen.fr/dc/#env=thm&q={q}' },
        { id: 'toubkal',  label: 'Toubkal (Maroc)', cat: 'academic', url: 'https://toubkal.imist.ma/search?query={q}' },
        { id: 'these20',  label: 'These2.0 (FMPM)', cat: 'academic', url: 'https://thesefmpm.vercel.app/search?page=1&search={q}' },
        { id: 'thesesfr', label: 'Theses.fr',       cat: 'academic', url: 'https://theses.fr/resultats?q={q}' },
        { id: 'proinserm',label: 'Pro Inserm',      cat: 'academic', url: 'https://pro.inserm.fr/?s={q}' },
        { id: 'ndltd',    label: 'NDLTD',           cat: 'academic', url: 'http://search.ndltd.org/search.php?q={q}' },
        { id: 'cybl',     label: 'CyberLeninka',    cat: 'academic', url: 'https://cyberleninka.ru/search?q={q}' },
        { id: 'bdedu',    label: 'Baidu Scholar',   cat: 'academic', url: 'https://xueshu.baidu.com/ndscholar/browse/search?wd={q}', plus: true },

        // 🌐 General
        { id: 'google',   label: 'Google',          cat: 'general',  url: 'https://www.google.com/search?q={q}' },
        { id: 'wiki',     label: 'Wikipedia',       cat: 'general',  url: 'https://wikipedia.org/w/index.php?search={q}' },
        { id: 'ddg',      label: 'DuckDuckGo',      cat: 'general',  url: 'https://duckduckgo.com/?q={q}' },
        { id: 'brave',    label: 'Brave Search',    cat: 'general',  url: 'https://search.brave.com/search?q={q}' },
        { id: 'bing',     label: 'Bing',            cat: 'general',  url: 'https://www.bing.com/search?q={q}' },
        { id: 'youtube',  label: 'YouTube',         cat: 'general',  url: 'https://www.youtube.com/results?search_query={q}' },
        { id: 'gimg',     label: 'Google Images',   cat: 'general',  url: 'https://www.google.com/search?udm=2&q={q}' },

        // 🤖 AI / Advanced
        { id: 'perplexity', label: 'Perplexity',    cat: 'ai', url: 'https://www.perplexity.ai/search?q={q}' },
        { id: 'gai',        label: 'Google AI Mode',cat: 'ai', url: 'https://www.google.com/search?udm=50&q={q}' },
        { id: 'chatgpt',    label: 'ChatGPT',       cat: 'ai', url: 'https://chatgpt.com/?prompt={q}', plus: true },
        { id: 'claude',     label: 'Claude AI',     cat: 'ai', url: 'https://claude.ai/new?q={q}', clipboard: true },
        { id: 'gemini',     label: 'Gemini',        cat: 'ai', url: 'https://gemini.google.com/app?q={q}', clipboard: true },
        { id: 'wolfram',    label: 'Wolfram Alpha', cat: 'ai', url: 'https://www.wolframalpha.com/input?i={q}' },
        { id: 'alphaf',     label: 'AlphaFold',     cat: 'ai', url: 'https://alphafold.ebi.ac.uk/search/text/{q}' },
    ];
    const ENG = Object.fromEntries(ENGINES.map(e => [e.id, e]));

    const CATS = ['medical', 'academic', 'general', 'ai'];
    const CAT_LABELS = { medical: '⚕️ Medical', academic: '🎓 Thèses', general: '🌐 General', ai: '🤖 AI' };

    // ── Search Packs (one query → several engines at once) ─────────
    const PACKS = [
        { id: 'ebm',    icon: '🔬', label: 'Evidence (EBM)',  desc: 'PubMed · Cochrane · UpToDate · NEJM', engines: ['pubmed', 'coch', 'utd', 'nejm'] },
        { id: 'drug',   icon: '💊', label: 'Médicament',       desc: 'VIDAL · Drugs.com · AMMPS · Medscape', engines: ['vidal', 'drugs', 'ammps', 'medscape'] },
        { id: 'term',   icon: '📖', label: 'Terminologie',     desc: 'MeSH · HETOP · CISMeF',                engines: ['mesh', 'hetop', 'cismef'] },
        { id: 'thesis', icon: '🎓', label: 'Thèse (FR/MA)',    desc: 'Toubkal · These2.0 · Theses.fr · CISMeF Th. · Scholar', engines: ['toubkal', 'these20', 'thesesfr', 'cismefth', 'scholar'] },
        { id: 'maroc',  icon: '🇲🇦', label: 'Maroc',            desc: 'MSPS · AMMPS · CISMeF',                engines: ['msps', 'ammps', 'cismef'] },
        { id: 'img',    icon: '🖼️', label: 'Imagerie',         desc: 'Radiopaedia · Google Images',          engines: ['rp', 'gimg'] },
    ];

    // ── PubMed power filters (applied only to PubMed-bound queries) ─
    const PM_FILTERS = [
        { id: 'review', label: 'Review',         term: 'AND review[pt]' },
        { id: 'sysrev', label: 'Syst. Review',   term: 'AND systematic[sb]' },
        { id: 'meta',   label: 'Meta-analysis',  term: 'AND meta-analysis[pt]' },
        { id: 'rct',    label: 'RCT',            term: 'AND randomized controlled trial[pt]' },
        { id: 'fft',    label: 'Free full text', term: 'AND free full text[sb]' },
        { id: 'humans', label: 'Humans',         term: 'AND humans[mh]' },
        { id: 'y5',     label: '≤ 5 yrs',        term: '__Y5__' },
        { id: 'tiab',   label: 'Title/Abstract', term: '__TIAB__' },
    ];

    // ── State ─────────────────────────────────────────────────────
    let activeCat   = GM_getValue('saiomed_cat', 'medical');
    let activePm    = new Set(GM_getValue('saiomed_pm', []));
    let query       = '';
    let triggerBtn  = null;
    let sidebar     = null;
    let selectedIndex = 0;
    let filterText  = '';
    let helpModal   = null;

    // ── CSS ───────────────────────────────────────────────────────
    const style = document.createElement('style');
    style.textContent = `
#saiom-trigger{all:initial;position:absolute;z-index:2147483647;width:38px;height:38px;cursor:pointer;display:flex;align-items:center;justify-content:center}
#saiom-trigger-inner{width:30px;height:30px;background:#0d1b33;border:2px solid #9c5af2;border-radius:10px;box-shadow:0 2px 12px rgba(0,0,0,.4);display:flex;align-items:center;justify-content:center;font-size:16px;transition:transform .1s}
#saiom-trigger:hover #saiom-trigger-inner{transform:scale(1.14);border-color:#b98cfa}
#saiom-overlay{position:fixed;inset:0;z-index:2147483646;background:rgba(0,0,0,.4);backdrop-filter:blur(3px);-webkit-backdrop-filter:blur(3px);opacity:0;transition:opacity .15s}
#saiom-overlay.show{opacity:1}
#saiom-sb{all:initial;position:fixed;z-index:2147483647;top:50%;left:50%;transform:translate(-50%,-50%) scale(.96);width:560px;max-width:94vw;max-height:88vh;background:rgba(16,22,38,.97);backdrop-filter:blur(28px) saturate(1.6);-webkit-backdrop-filter:blur(28px) saturate(1.6);border:1px solid rgba(156,90,242,.25);border-radius:16px;box-shadow:0 24px 80px rgba(0,0,0,.65);font-family:system-ui,-apple-system,'Segoe UI',sans-serif;color:#e2e8f0;overflow:hidden;display:flex;flex-direction:column;opacity:0;transition:opacity .12s,transform .12s}
#saiom-sb.show{opacity:1;transform:translate(-50%,-50%) scale(1)}
.saiom-hd{padding:14px 16px 10px;border-bottom:1px solid rgba(255,255,255,.06);flex-shrink:0}
.saiom-inwrap{display:flex;gap:6px}
.saiom-input{flex:1;background:rgba(255,255,255,.05);border:1.5px solid rgba(255,255,255,.12);border-radius:8px;padding:9px 12px;color:#fff;font-size:14px;outline:none;box-sizing:border-box;font-family:inherit;transition:border-color .15s,box-shadow .15s}
.saiom-input:focus{border-color:#9c5af2;box-shadow:0 0 0 3px rgba(156,90,242,.18)}
.saiom-input::placeholder{color:#5a6478}
.saiom-tr{background:rgba(156,90,242,.14);border:1px solid rgba(156,90,242,.3);color:#c9b1f7;border-radius:8px;font-size:11px;font-weight:700;cursor:pointer;padding:0 9px;font-family:inherit;transition:all .12s;white-space:nowrap}
.saiom-tr:hover{background:rgba(156,90,242,.28);color:#fff}
.saiom-status{font-size:10.5px;color:#7c87a0;margin-top:6px;min-height:13px}
.saiom-status.ok{color:#3fb950}.saiom-status.err{color:#f85149}
.saiom-smart{display:flex;flex-wrap:wrap;gap:6px;margin-top:9px}
.saiom-smart-btn{background:linear-gradient(135deg,#1f6feb,#388bfd);border:none;color:#fff;border-radius:8px;font-size:11.5px;font-weight:700;cursor:pointer;padding:6px 11px;font-family:inherit;display:flex;align-items:center;gap:5px;transition:transform .12s,box-shadow .12s}
.saiom-smart-btn:hover{transform:translateY(-1px);box-shadow:0 4px 12px rgba(56,139,253,.4)}
.saiom-smart-btn small{opacity:.7;font-weight:500;font-size:9.5px}
.saiom-tabs{display:flex;gap:4px;margin-top:10px}
.saiom-tab{flex:1;text-align:center;padding:7px 2px;border-radius:8px;font-size:11px;font-weight:600;cursor:pointer;transition:all .12s;background:rgba(255,255,255,.03);color:#6b7488;user-select:none;white-space:nowrap}
.saiom-tab:hover{background:rgba(255,255,255,.07);color:#aeb6c6}
.saiom-tab.active{background:linear-gradient(135deg,#7c4ddb,#9c5af2);color:#fff;font-weight:800}
.saiom-pmbar{display:flex;flex-wrap:wrap;gap:5px;align-items:center;padding:8px 16px;border-bottom:1px solid rgba(255,255,255,.06);background:rgba(156,90,242,.05);flex-shrink:0}
.saiom-pmbar .saiom-pmlab{font-size:9.5px;color:#8a93a8;font-weight:700;text-transform:uppercase;letter-spacing:.04em;margin-right:2px}
.saiom-chip{font-size:10.5px;border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.04);color:#9aa3b6;border-radius:20px;padding:3px 9px;cursor:pointer;user-select:none;transition:all .12s;font-family:inherit}
.saiom-chip:hover{border-color:rgba(156,90,242,.5);color:#cdb6f6}
.saiom-chip.on{background:rgba(156,90,242,.9);border-color:transparent;color:#fff;font-weight:700}
.saiom-body{overflow-y:auto;flex:1;min-height:0;scrollbar-width:thin;scrollbar-color:rgba(156,90,242,.3) transparent}
.saiom-body::-webkit-scrollbar{width:6px}.saiom-body::-webkit-scrollbar-thumb{background:rgba(156,90,242,.3);border-radius:4px}
.saiom-grid{display:grid;grid-template-columns:1fr 1fr;gap:4px;padding:10px 12px}
.saiom-item{display:flex;align-items:center;gap:8px;padding:8px 10px;border-radius:8px;cursor:pointer;font-size:12.5px;transition:background .08s;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;user-select:none;color:#b6bdcb}
.saiom-item:hover{background:rgba(255,255,255,.06)}
.saiom-item.sel{background:linear-gradient(135deg,rgba(124,77,219,.9),rgba(156,90,242,.9));color:#fff}
.saiom-item .saiom-idx{font-size:9px;color:#5a6478;min-width:12px;text-align:right;font-family:monospace}
.saiom-item.sel .saiom-idx{color:rgba(255,255,255,.55)}
.saiom-item .saiom-cb{font-size:8px;color:#9c5af2;margin-left:auto;flex-shrink:0;opacity:.7}
.saiom-item.sel .saiom-cb{color:rgba(255,255,255,.7)}
.saiom-packs{display:flex;flex-direction:column;gap:7px;padding:12px}
.saiom-pack{display:flex;align-items:center;gap:11px;padding:11px 13px;border-radius:10px;cursor:pointer;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.07);transition:all .12s;user-select:none}
.saiom-pack:hover,.saiom-pack.sel{background:rgba(156,90,242,.16);border-color:rgba(156,90,242,.45)}
.saiom-pack-ic{font-size:20px;flex-shrink:0;width:26px;text-align:center}
.saiom-pack-tx{flex:1;min-width:0}
.saiom-pack-tt{font-size:13px;font-weight:700;color:#eceff5}
.saiom-pack-ds{font-size:10.5px;color:#7c87a0;margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.saiom-pack-n{font-size:10px;color:#9c5af2;font-weight:800;background:rgba(156,90,242,.14);border-radius:20px;padding:2px 8px;flex-shrink:0}
.saiom-empty{padding:24px;text-align:center;color:#5a6478;font-size:13px}
.saiom-ft{padding:7px 14px;font-size:9.5px;color:#5a6478;background:rgba(0,0,0,.28);display:flex;justify-content:space-between;align-items:center;flex-shrink:0;border-top:1px solid rgba(255,255,255,.04)}
.saiom-ft kbd{background:rgba(255,255,255,.06);padding:1px 5px;border-radius:3px;font-family:inherit;color:#7c87a0}
.saiom-help-btn{background:none;border:1px solid rgba(255,255,255,.1);border-radius:4px;color:#7c87a0;cursor:pointer;font-size:inherit;padding:1px 5px;font-family:inherit;transition:all .12s}
.saiom-help-btn:hover{background:rgba(255,255,255,.08);color:#cdd3df}
#saiom-help{all:initial;position:fixed;z-index:2147483647;top:50%;left:50%;transform:translate(-50%,-50%) scale(.96);width:420px;max-width:92vw;background:rgba(16,22,38,.98);backdrop-filter:blur(28px);-webkit-backdrop-filter:blur(28px);border:1px solid rgba(156,90,242,.3);border-radius:14px;box-shadow:0 24px 80px rgba(0,0,0,.7);font-family:system-ui,-apple-system,sans-serif;color:#e2e8f0;padding:20px;opacity:0;transition:opacity .12s,transform .12s}
#saiom-help.show{opacity:1;transform:translate(-50%,-50%) scale(1)}
#saiom-help h3{margin:0 0 12px;font-size:14px;font-weight:800;color:#fff}
#saiom-help table{width:100%;border-collapse:collapse;font-size:11.5px}
#saiom-help td{padding:4px 0;vertical-align:top}
#saiom-help td:first-child{color:#9c5af2;font-weight:700;white-space:nowrap;padding-right:12px;font-family:monospace;font-size:10.5px}
#saiom-help td:last-child{color:#9aa3b6}
#saiom-help .cl{margin-top:12px;text-align:center;font-size:10px;color:#5a6478}
`;
    document.head.appendChild(style);

    // ── Helpers ───────────────────────────────────────────────────
    function escAttr(s) { return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
    function enc(engine, q) { const e = encodeURIComponent(q); return engine && engine.plus ? e.replace(/%20/g, '+') : e; }

    // PubMed term builder: applies active power filters with correct syntax.
    function pubmedTerm(q) {
        let base = q;
        if (activePm.has('tiab')) base = `(${q})[tiab]`;
        const parts = [base];
        PM_FILTERS.forEach(f => {
            if (!activePm.has(f.id) || f.id === 'tiab') return;
            if (f.id === 'y5') {
                const y = new Date().getFullYear() - 5;
                parts.push(`AND ("${y}"[dp] : "3000"[dp])`);
            } else {
                parts.push(f.term);
            }
        });
        return parts.join(' ');
    }

    function buildUrl(engine, q) {
        const finalQ = engine.pubmed ? pubmedTerm(q) : q;
        return engine.url.replace('{q}', enc(engine, finalQ));
    }

    // ── Identifier detection (DOI / PMID / NCT) ───────────────────
    function detectIds(text) {
        const ids = [];
        const t = text.trim();
        const doi = t.match(/10\.\d{4,9}\/[-._;()/:A-Za-z0-9]+/);
        if (doi) ids.push({ icon: '🔗', label: 'Ouvrir DOI', sub: doi[0].slice(0, 22), url: 'https://doi.org/' + doi[0] });
        let pmid = t.match(/\bPMID:?\s*(\d{6,9})\b/i);
        if (!pmid && /^\d{7,8}$/.test(t)) pmid = [null, t];
        if (pmid) ids.push({ icon: '🧬', label: 'PubMed (PMID)', sub: pmid[1], url: 'https://pubmed.ncbi.nlm.nih.gov/' + pmid[1] + '/' });
        const nct = t.match(/\bNCT\d{8}\b/i);
        if (nct) ids.push({ icon: '⚗️', label: 'Essai clinique', sub: nct[0].toUpperCase(), url: 'https://clinicaltrials.gov/study/' + nct[0].toUpperCase() });
        return ids;
    }

    // ── Translation (FR/AR/auto → EN or FR) via free Google endpoint ─
    function translate(text, target, statusEl, inputEl) {
        if (!text.trim()) return;
        statusEl.className = 'saiom-status'; statusEl.textContent = `⏳ Traduction → ${target.toUpperCase()}…`;
        const url = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl='
            + target + '&dt=t&q=' + encodeURIComponent(text);
        GM_xmlhttpRequest({
            method: 'GET', url,
            onload(r) {
                try {
                    const data = JSON.parse(r.responseText);
                    const out = (data[0] || []).map(seg => seg[0]).join('');
                    if (out) {
                        inputEl.value = out; query = out;
                        statusEl.className = 'saiom-status ok'; statusEl.textContent = `✓ Traduit → ${target.toUpperCase()}`;
                    } else throw new Error('empty');
                } catch (_) {
                    statusEl.className = 'saiom-status err'; statusEl.textContent = '✗ Traduction indisponible';
                }
            },
            onerror() { statusEl.className = 'saiom-status err'; statusEl.textContent = '✗ Échec réseau (traduction)'; }
        });
    }

    // ── Launch single / pack ──────────────────────────────────────
    function currentQuery() {
        const input = sidebar && sidebar.querySelector('.saiom-input');
        return ((input && input.value.trim()) || query || '').trim();
    }
    function launch(engine) {
        const q = currentQuery(); if (!q) return;
        if (engine.clipboard) navigator.clipboard.writeText(q).catch(() => {});
        const url = buildUrl(engine, q);
        closeSidebar();
        GM_openInTab(url, { active: true, insert: true });
    }
    function launchPack(pack) {
        const q = currentQuery(); if (!q) return;
        const urls = pack.engines.map(id => ENG[id]).filter(Boolean).map(e => buildUrl(e, q));
        closeSidebar();
        urls.forEach((u, i) => GM_openInTab(u, { active: i === 0, insert: true }));
    }
    function openId(id) { closeSidebar(); GM_openInTab(id.url, { active: true, insert: true }); }

    // ── Filtered engine list ──────────────────────────────────────
    function getFiltered() {
        const list = ENGINES.filter(e => e.cat === activeCat);
        if (!filterText) return list;
        const f = filterText.toLowerCase();
        return list.filter(e => e.label.toLowerCase().includes(f) || e.id.toLowerCase().includes(f));
    }
    const isPacks = () => activeCat === 'packs';

    // ── Render body (engine grid OR packs) ────────────────────────
    function renderBody() {
        if (!sidebar) return;
        const body = sidebar.querySelector('.saiom-body');
        body.innerHTML = '';

        if (isPacks()) {
            const wrap = document.createElement('div'); wrap.className = 'saiom-packs';
            PACKS.forEach((p, i) => {
                const d = document.createElement('div');
                d.className = 'saiom-pack' + (i === selectedIndex ? ' sel' : '');
                d.innerHTML = `<div class="saiom-pack-ic">${p.icon}</div>
                    <div class="saiom-pack-tx"><div class="saiom-pack-tt">${escAttr(p.label)}</div><div class="saiom-pack-ds">${escAttr(p.desc)}</div></div>
                    <div class="saiom-pack-n">${p.engines.length}↗</div>`;
                d.addEventListener('click', ev => { ev.stopPropagation(); launchPack(p); });
                d.addEventListener('mouseenter', () => { selectedIndex = i; markSel('.saiom-pack', i); });
                wrap.appendChild(d);
            });
            body.appendChild(wrap);
        } else {
            const items = getFiltered();
            if (selectedIndex >= items.length) selectedIndex = Math.max(0, items.length - 1);
            if (!items.length) { body.innerHTML = '<div class="saiom-empty">Aucun moteur ne correspond</div>'; }
            else {
                const grid = document.createElement('div'); grid.className = 'saiom-grid';
                items.forEach((e, i) => {
                    const div = document.createElement('div');
                    div.className = 'saiom-item' + (i === selectedIndex ? ' sel' : '');
                    const letter = i < 26 ? String.fromCharCode(97 + i) : '';
                    div.innerHTML = `<span class="saiom-idx">${letter}</span><span>${escAttr(e.label)}</span>${e.clipboard ? '<span class="saiom-cb">+clip</span>' : ''}`;
                    div.addEventListener('click', ev => { ev.stopPropagation(); launch(e); });
                    div.addEventListener('mouseenter', () => { selectedIndex = i; markSel('.saiom-item', i); });
                    grid.appendChild(div);
                });
                body.appendChild(grid);
            }
        }
        const sel = body.querySelector('.sel'); if (sel) sel.scrollIntoView({ block: 'nearest' });
    }
    function markSel(selector, i) {
        const nodes = sidebar.querySelectorAll(selector);
        nodes.forEach((n, k) => n.classList.toggle('sel', k === i));
    }
    function renderTabs() {
        sidebar.querySelectorAll('.saiom-tab').forEach(t => t.classList.toggle('active', t.dataset.cat === activeCat));
    }

    // ── Open sidebar ──────────────────────────────────────────────
    function openSidebar() {
        if (sidebar) { closeSidebar(); return; }
        selectedIndex = 0; filterText = '';

        const overlay = document.createElement('div');
        overlay.id = 'saiom-overlay';
        overlay.onclick = () => closeSidebar();
        document.body.appendChild(overlay);

        sidebar = document.createElement('div');
        sidebar.id = 'saiom-sb';
        sidebar.onmousedown = e => e.stopPropagation();

        const ids = detectIds(query);
        const smartHtml = ids.length
            ? `<div class="saiom-smart">${ids.map((d, i) =>
                `<button class="saiom-smart-btn" data-id="${i}">${d.icon} ${escAttr(d.label)} <small>${escAttr(d.sub)}</small></button>`).join('')}</div>`
            : '';
        const tabs = ['packs', ...CATS];
        const tabLabel = c => c === 'packs' ? '⚡ Packs' : CAT_LABELS[c];

        sidebar.innerHTML = `
            <div class="saiom-hd">
                <div class="saiom-inwrap">
                    <input type="text" class="saiom-input" value="${escAttr(query)}" placeholder="Requête… (/ pour éditer)">
                    <button class="saiom-tr" data-tr="en" title="Traduire → Anglais">→EN</button>
                    <button class="saiom-tr" data-tr="fr" title="Traduire → Français">→FR</button>
                </div>
                <div class="saiom-status"></div>
                ${smartHtml}
                <div class="saiom-tabs">
                    ${tabs.map((c, i) => `<div class="saiom-tab" data-cat="${c}">${tabLabel(c)}</div>`).join('')}
                </div>
            </div>
            <div class="saiom-pmbar">
                <span class="saiom-pmlab">PubMed</span>
                ${PM_FILTERS.map(f => `<span class="saiom-chip${activePm.has(f.id) ? ' on' : ''}" data-pm="${f.id}">${escAttr(f.label)}</span>`).join('')}
            </div>
            <div class="saiom-body"></div>
            <div class="saiom-ft">
                <span><kbd>/</kbd> éditer <kbd>Tab</kbd> onglets <kbd>a-z</kbd> lancer <kbd>Esc</kbd> fermer</span>
                <span>Med v1.0 <button class="saiom-help-btn" title="Aide (Ctrl+?)">⌨️</button></span>
            </div>`;
        document.body.appendChild(sidebar);
        requestAnimationFrame(() => { overlay.classList.add('show'); sidebar.classList.add('show'); });

        const input = sidebar.querySelector('.saiom-input');
        const statusEl = sidebar.querySelector('.saiom-status');
        sidebar.focus();

        // Smart identifier buttons
        sidebar.querySelectorAll('.saiom-smart-btn').forEach(b =>
            b.onclick = ev => { ev.stopPropagation(); openId(ids[+b.dataset.id]); });
        // Translate buttons
        sidebar.querySelectorAll('.saiom-tr').forEach(b =>
            b.onclick = ev => { ev.stopPropagation(); translate(currentQuery(), b.dataset.tr, statusEl, input); });
        // Tab clicks
        sidebar.querySelectorAll('.saiom-tab').forEach(t =>
            t.onclick = ev => { ev.stopPropagation(); setCat(t.dataset.cat); });
        // PubMed chips
        sidebar.querySelectorAll('.saiom-chip').forEach(c =>
            c.onclick = ev => {
                ev.stopPropagation();
                const id = c.dataset.pm;
                if (activePm.has(id)) activePm.delete(id); else activePm.add(id);
                c.classList.toggle('on');
                GM_setValue('saiomed_pm', [...activePm]);
            });
        // Help
        sidebar.querySelector('.saiom-help-btn').onclick = ev => { ev.stopPropagation(); toggleHelp(); };

        renderTabs(); renderBody();
        window.addEventListener('keydown', keyHandler, true);
        sidebar._kh = keyHandler; sidebar._ov = overlay;
    }

    function setCat(c) { activeCat = c; if (CATS.includes(c)) GM_setValue('saiomed_cat', c); selectedIndex = 0; renderTabs(); renderBody(); }

    // ── Keyboard ──────────────────────────────────────────────────
    function keyHandler(e) {
        if (!sidebar) return;
        const input = sidebar.querySelector('.saiom-input');
        const isInput = document.activeElement === input;
        const tabs = ['packs', ...CATS];
        const count = isPacks() ? PACKS.length : getFiltered().length;
        const cols = isPacks() ? 1 : 2;

        if (e.key === 'Escape') { e.preventDefault(); closeSidebar(); return; }
        if (e.key === 'Enter') {
            e.preventDefault();
            if (isPacks()) { if (PACKS[selectedIndex]) launchPack(PACKS[selectedIndex]); }
            else { const it = getFiltered()[selectedIndex]; if (it) launch(it); }
            return;
        }
        if (e.key === 'Tab') {
            e.preventDefault();
            const dir = e.shiftKey ? -1 : 1, ci = tabs.indexOf(activeCat);
            setCat(tabs[(ci + dir + tabs.length) % tabs.length]);
            return;
        }
        if (!isInput && /^[1-5]$/.test(e.key)) { setCat(tabs[+e.key - 1]); return; }
        if (!isInput && /^[a-z]$/i.test(e.key) && !e.ctrlKey && !e.metaKey && !e.altKey) {
            const idx = e.key.toLowerCase().charCodeAt(0) - 97;
            if (isPacks()) { if (idx < PACKS.length) { e.preventDefault(); launchPack(PACKS[idx]); } }
            else { const it = getFiltered()[idx]; if (it) { e.preventDefault(); launch(it); } }
            return;
        }
        if (e.key === 'ArrowDown') { e.preventDefault(); if (isInput) input.blur(); selectedIndex = Math.min(count - 1, selectedIndex + cols); renderBody(); return; }
        if (e.key === 'ArrowUp')   { e.preventDefault(); if (selectedIndex - cols >= 0) selectedIndex -= cols; else { selectedIndex = 0; input.focus(); input.select(); } renderBody(); return; }
        if (e.key === 'ArrowRight' && !isInput) { e.preventDefault(); if (selectedIndex + 1 < count) selectedIndex++; renderBody(); return; }
        if (e.key === 'ArrowLeft'  && !isInput) { e.preventDefault(); if (selectedIndex > 0) selectedIndex--; renderBody(); return; }
        if (e.key === '/') { e.preventDefault(); if (isInput) input.blur(); else { input.focus(); input.select(); } return; }
        if (e.key === '?' && e.ctrlKey) { e.preventDefault(); toggleHelp(); return; }
    }

    // ── Help modal ────────────────────────────────────────────────
    function toggleHelp() {
        if (helpModal) { helpModal.remove(); helpModal = null; return; }
        helpModal = document.createElement('div');
        helpModal.id = 'saiom-help';
        helpModal.onmousedown = e => e.stopPropagation();
        helpModal.innerHTML = `
            <h3>⚕️ SearchAIO Med — Aide</h3>
            <table>
                <tr><td>Alt+S</td><td>Ouvrir / fermer la barre (sélection auto)</td></tr>
                <tr><td>⚡ Packs</td><td>Lance 1 requête sur plusieurs moteurs à la fois</td></tr>
                <tr><td>→EN / →FR</td><td>Traduit la requête (recherche MeSH/PubMed en anglais)</td></tr>
                <tr><td>Puces PubMed</td><td>Review · RCT · Méta · Free full text · ≤5 ans · TIAB…</td></tr>
                <tr><td>DOI/PMID/NCT</td><td>Sélection détectée → résolution directe (doi.org, PubMed, ClinicalTrials)</td></tr>
                <tr><td>/</td><td>Focus / défocus le champ de requête</td></tr>
                <tr><td>a-z</td><td>Lancer un moteur / pack par lettre</td></tr>
                <tr><td>1-5</td><td>Changer d'onglet · <b>Tab</b> = suivant</td></tr>
                <tr><td>↑ ↓ ← →</td><td>Naviguer · <b>Enter</b> lancer</td></tr>
                <tr><td>Esc</td><td>Fermer</td></tr>
            </table>
            <div class="cl">Esc ou Ctrl+? pour fermer</div>`;
        document.body.appendChild(helpModal);
        requestAnimationFrame(() => helpModal.classList.add('show'));
    }

    // ── Close ─────────────────────────────────────────────────────
    function closeSidebar() {
        if (helpModal) { helpModal.remove(); helpModal = null; }
        if (triggerBtn) { triggerBtn.remove(); triggerBtn = null; }
        if (sidebar) {
            window.removeEventListener('keydown', sidebar._kh, true);
            if (sidebar._ov) sidebar._ov.remove();
            sidebar.remove(); sidebar = null;
        }
    }

    // ── Selection → ⚡ trigger ────────────────────────────────────
    document.addEventListener('mouseup', e => {
        if (sidebar && sidebar.contains(e.target)) return;
        if (triggerBtn && triggerBtn.contains(e.target)) return;
        setTimeout(() => {
            const sel = window.getSelection();
            const text = sel ? sel.toString().trim() : '';
            if (text.length > 1) {
                query = text;
                if (triggerBtn) triggerBtn.remove();
                triggerBtn = document.createElement('div');
                triggerBtn.id = 'saiom-trigger';
                triggerBtn.innerHTML = '<div id="saiom-trigger-inner">⚡</div>';
                document.body.appendChild(triggerBtn);
                const r = sel.getRangeAt(0).getBoundingClientRect();
                triggerBtn.style.left = (r.right + window.scrollX - 8) + 'px';
                triggerBtn.style.top = (r.top + window.scrollY - 42) + 'px';
                triggerBtn.onclick = ev => { ev.stopPropagation(); ev.preventDefault(); openSidebar(); };
            } else if (!sidebar && triggerBtn) {
                triggerBtn.remove(); triggerBtn = null;
            }
        }, 30);
    });

    document.addEventListener('mousedown', e => { if (sidebar && !sidebar.contains(e.target)) closeSidebar(); });

    // ── Global shortcuts ──────────────────────────────────────────
    document.addEventListener('keydown', e => {
        if (e.altKey && e.key.toLowerCase() === 's') {
            e.preventDefault(); e.stopPropagation();
            const sel = window.getSelection();
            const text = sel ? sel.toString().trim() : '';
            if (text.length > 1) query = text;
            openSidebar();
            return;
        }
        if (e.key === '?' && e.ctrlKey) { e.preventDefault(); e.stopPropagation(); toggleHelp(); return; }
        if (e.key === 'Escape' && helpModal && !sidebar) { e.preventDefault(); helpModal.remove(); helpModal = null; }
    }, true);

})();
