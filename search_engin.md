# SearchAIO Engine Wiki

This document provides a detailed overview of all search engines integrated into the SearchAIO tool. An asterisk (*) next to an engine's name indicates that it requires the query to be manually pasted after redirection.

---

## 🌐 General Search

### Google (`g:`)
- **URL**: `https://www.google.com/search?q=`
- **Notes**: Standard Google search. Supports advanced operators.

### YouTube (`yt:`)
- **URL**: `https://www.youtube.com/results?search_query=`
- **Notes**: Supports special filters for sorting, type, duration, and upload date.

### Brave Search (`brave:`)
- **URL**: `https://search.brave.com/search?q=`

### DuckDuckGo (`ddg:`)
- **URL**: `https://duckduckgo.com/?q=`

### Yandex (`yan:`)
- **URL**: `https://yandex.com/search/?text=`

### Bing (`bing:`)
- **URL**: `https://www.bing.com/search?q=`

### Baidu (`bd:`)
- **URL**: `https://www.baidu.com/s?wd=`

### Google Avancé (`gplus:`)
- **URL**: `https://www.google.com/advanced_search?q=`

---

## 🎓 Academic / Thèses

### Google Scholar (`scholar:`)
- **URL**: `https://scholar.google.com/scholar?q=`

### PubMed (`pubmed:`)
- **URL**: `https://pubmed.ncbi.nlm.nih.gov/?term=`

### arXiv (`arxiv:`)
- **URL**: `https://arxiv.org/search/?query=`

### Google Patents (`gpat:`)
- **URL**: `https://patents.google.com/`
- **Notes**: Uses a special URL structure for queries: `?q=(QUERY)&oq=QUERY`

### These2.0 (`these2.0:`)
- **URL**: `https://thesefmpm.vercel.app/search?page=1&search=`

### CISMeF Thèses (`cismef-th:`)
- **URL**: `https://doccismef.chu-rouen.fr/dc/#env=thm&q=`

### Toubkal (`these-ma:`)
- **URL**: `https://toubkal.imist.ma/search?query=`
- **Notes**: Appends `&submit=OK` to the query.

### Theses.fr (`these-fr:`)
- **URL**: `https://theses.fr/resultats?filtres=%255BStatut%25253D%252522soutenue%252522~Statut%25253D%252522Accessibles%252520en%252520ligne%252522%255D&q=`

### ResearchGate (`rgate:`)
- **URL**: `https://www.researchgate.net/search/publication?q=`

### NDLTD (`ndltd:`)
- **URL**: `http://search.ndltd.org/search.php?q=`

### Pro Inserm (`proinserm:`)
- **URL**: `https://pro.inserm.fr/?s=`

### Baidu Scholar (Xueshu) (`bdedu:`)
- **URL**: `https://xueshu.baidu.com/ndscholar/browse/search?wd=`
- **Notes**: Uses `+` for spaces in the query.

---

## ⚕️ Medical / Health

### CISMeF (`cismef:`)
- **URL**: `https://doccismef.chu-rouen.fr/dc/#`
- **Notes**: Base for several aliases with different `env` parameters.

### Ministère de la santé (`msps:`)
- **URL**: `https://www.google.com/search?q=site:sante.gov.ma `

### HAS (`has:`)
- **URL**: `https://www.has-sante.fr/jcms/fc_2875171/fr/resultat-de-recherche?text=`

### VIDAL (`vidal:`)
- **URL**: `https://www.vidal.fr/recherche.html?query=`

### MeSH Browser (`mesh:`)
- **URL**: `https://meshb.nlm.nih.gov/search?searchInField=allTerms&searchString=`

### LISSA (`lissa:`)
- **URL**: `https://www.lissa.fr/dc/#env=lissa&q=`

### Académie nationale de médecine (`anm:`)
- **URL**: `http://dictionnaire.academie-medecine.fr/search?titre=`

### HETOP (`hetop:`)
- **URL**: `https://www.hetop.eu/hetop/fr/#q=`
- **URL**: `https://www.nejm.org/search?q=`

### NEJM (`nejm:`)
- **URL**: `https://www.nejm.org/search?q=`

### Radiopaedia (`rp:`)
- **URL**: `https://radiopaedia.org/search?q=`

### UpToDate (`utd:`)
- **URL**: `https://www.uptodate.com/contents/search?search=`

### Cochrane Library (`coch:`)
- **URL**: `https://www.cochranelibrary.com/search?q=`

### Medscape (`medscape:`)
- **URL**: `https://search.medscape.com/search/fr/`

### OpenMD (`openmd:`)
- **URL**: `https://openmd.com/search?q=`

### Diseases Database (`dd:`)
- **URL**: `http://www.diseasesdatabase.com/item_choice.asp?strUserInput=`

### WebMD (`webmd:`)
- **URL**: `https://www.webmd.com/search?query=`

### NIH (`nih:`)
- **URL**: `https://search.usa.gov/search?utf8=%E2%9C%93&affiliate=nih&query=`

### Drugs.com (`drugs:`)
- **URL**: `https://www.drugs.com/search.php?searchterm=`

### CDC (`cdc:`)
- **URL**: `https://search.cdc.gov/search/?query=`

---

## 🤖 AI / Advanced

### Wolfram Alpha (`wolf:`)
- **URL**: `https://www.wolframalpha.com/input?i=`

### ChatGPT (`chatgpt:`)
- **URL**: `https://chatgpt.com/`
- **Notes**: **Requires Manual Paste.**

### Claude AI (`claude:`)
- **URL**: `https://claude.ai/`
- **Notes**: **Requires Manual Paste.**

### Gemini (`gemini:`)
- **URL**: `https://gemini.google.com/app`
- **Notes**: **Requires Manual Paste.**

### Google AI Mode (`gai:`)
- **URL**: `https://www.google.com/search?udm=50&q=`
- **Notes**: Uses Google's experimental AI mode (`udm=50`).

### Perplexity (`perplexity:`)
- **URL**: `https://www.perplexity.ai/search?q=`

### Copilot (`copilot:`)
- **URL**: `https://copilot.microsoft.com/`
- **Notes**: **Requires Manual Paste.**

### Chat Baidu (`cbd:`)
- **URL**: `https://chat.baidu.com/search?word=`
- **Notes**: Uses `+` for spaces in the query.

### Baidu AI (`ernie:`)
- **URL**: `https://ernie.baidu.com/`
- **Notes**: **Requires Manual Paste.**

### Duck.ai (`duckai:`)
- **URL**: `https://duck.ai/chat?q=`
- **Notes**: Uses `+` for spaces in the query.
