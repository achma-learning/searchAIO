    let operatorHandlersInitialized = false;
    const filetypesWiki = {
      "📄 Documents & Text": [
        { ext: 'pdf', name: 'Adobe Portable Document Format' },
        { ext: ['doc', 'docx'], name: 'Microsoft Word' },
        { ext: 'rtf', name: 'Rich Text Format' },
        { ext: ['txt', 'text'], name: 'Plain Text' },
        { ext: 'odt', name: 'OpenDocument Text' },
        { ext: 'tex', name: 'LaTeX/TeX' },
        { ext: 'epub', name: 'Electronic Publication' },
        { ext: 'csv', name: 'Comma-Separated Values' },
        { ext: 'ps', name: 'Adobe PostScript' },
        { ext: ['wml', 'wap'], name: 'Wireless Markup Language' },
        { ext: 'xml', name: 'Extensible Markup Language' }
      ],
      "📊 Spreadsheets & Presentations": [
        { ext: ['xls', 'xlsx'], name: 'Microsoft Excel' },
        { ext: ['ppt', 'pptx'], name: 'Microsoft PowerPoint' },
        { ext: 'ods', name: 'OpenDocument Spreadsheet' },
        { ext: 'odp', name: 'OpenDocument Presentation' }
      ],
      "💻 Code & Web": [
        { ext: ['html', 'htm'], name: 'HTML' },
        { ext: 'py', name: 'Python' },
        { ext: 'js', name: 'JavaScript' },
        { ext: 'java', name: 'Java' },
        { ext: 'cpp', name: 'C++' },
        { ext: 'c', name: 'C / C Header' },
        { ext: 'h', name: 'C / C Header' },
        { ext: 'cs', name: 'C#' },
        { ext: 'pl', name: 'Perl' }
      ],
      "🖼️ Images": [
        { ext: 'jpg', name: 'JPEG image' },
        { ext: 'jpeg', name: 'JPEG image' },
        { ext: 'png', name: 'Portable Network Graphics' },
        { ext: 'gif', name: 'Graphics Interchange Format' },
        { ext: 'webp', name: 'WebP' },
        { ext: 'svg', name: 'Scalable Vector Graphics' },
        { ext: 'bmp', name: 'Bitmap' },
        { ext: 'avif', name: 'AV1 Image File Format' }
      ],
      "🎬 Video & Media": [
        { ext: 'mp4', name: 'MPEG-4 Video' },
        { ext: 'avi', name: 'AVI' },
        { ext: 'mov', name: 'Apple QuickTime Movie' },
        { ext: 'webm', name: 'WebM' },
        { ext: 'mkv', name: 'Matroska Video' },
        { ext: 'wmv', name: 'Windows Media Video' },
        { ext: 'mp3', name: 'MP3 Audio' },
        { ext: '3gp', name: '3GPP Multimedia' },
        { ext: '3g2', name: '3GPP Multimedia' },
        { ext: 'asf', name: 'Advanced Systems Format' },
        { ext: 'divx', name: 'DivX Video' },
        { ext: 'm2v', name: 'MPEG Video & Playlist' },
        { ext: 'm3u', name: 'MPEG Video & Playlist' },
        { ext: 'm3u8', name: 'MPEG Video & Playlist' },
        { ext: 'm4v', name: 'MPEG-4 Video' },
        { ext: 'ogv', name: 'Ogg Video' },
        { ext: 'qvt', name: 'QVT' },
        { ext: 'ram', name: 'Real Audio Media' },
        { ext: 'rm', name: 'Real Media' },
        { ext: 'vob', name: 'DVD Video Object' }
      ],
      "🗺️ Niche & Specialized": [
        { ext: 'kml', name: 'Keyhole Markup Language' },
        { ext: 'kmz', name: 'Keyhole Markup Language' },
        { ext: 'gpx', name: 'GPS Exchange Format' },
        { ext: 'hwp', name: 'Hanword Document' },
        { ext: 'dwf', name: 'Design Web Format' }
      ]
    };

    // AI-Assisted Comment: This object maps search prefixes (e.g., 'g:') to their corresponding search engine details.
    // Each entry contains the search engine's name and the base URL for constructing search queries.
    // The script uses this map to determine which search engine to use based on user input or selection.
    // searchEngines will be loaded from engines.js

    // AI-Assisted Comment: These constants store references to various DOM elements.
    // Caching these elements in variables improves performance by avoiding repeated DOM lookups.
    const searchInput = document.getElementById('searchInput');
    const searchForm = document.getElementById('searchForm');
    const searchSource = document.getElementById('searchSource');
    const wikiToggleBtn = document.getElementById('wikiToggleBtn');
    const wikiContent = document.getElementById('wikiContent');
    const keepWikiOpenCheckbox = document.getElementById('keepWikiOpenCheckbox');
    const filetypesBtn = document.getElementById('filetypesBtn');
    const filetypesPopup = document.getElementById('filetypesPopup');
    const siteCheckbox = document.getElementById('siteCheckbox');
    const popupOverlay = document.getElementById('popupOverlay');
    const closeFiletypes = document.getElementById('closeFiletypes');
    const bangsBtn = document.getElementById('bangsBtn');
    const youtubeFilters = document.getElementById('youtubeFilters');
    const googleOperatorFilters = document.getElementById('googleOperatorFilters');
    const cismefFilters = document.getElementById('cismefFilters');
    const googleWikiBtn = document.getElementById('googleWikiBtn');
    const googleWikiPopup = document.getElementById('googleWikiPopup');
    const closeGoogleWikiBtn = document.getElementById('closeGoogleWikiBtn');
    const keepGoogleWikiOpenCheckbox = document.getElementById('keepGoogleWikiOpenCheckbox');
    const bingOperatorFilters = document.getElementById('bingOperatorFilters');
    const bingWikiBtn = document.getElementById('bingWikiBtn');
    const bingWikiPopup = document.getElementById('bingWikiPopup');
    const closeBingWikiBtn = document.getElementById('closeBingWikiBtn');
    const keepBingWikiOpenCheckbox = document.getElementById('keepBingWikiOpenCheckbox');
    const keyboardShortcutsBtn = document.getElementById('keyboardShortcutsBtn'); // New button
    const keyboardShortcutsPopup = document.getElementById('keyboardShortcutsPopup');
    const closeShortcutsBtn = document.getElementById('closeShortcutsBtn');
    const wikiSearchInput = document.getElementById('wikiSearchInput');

    // Yandex Translation elements
    const yandexTranslationBox = document.getElementById('yandexTranslationBox');
    const yandexSourceLang = document.getElementById('yandexSourceLang');
    const yandexSourceText = document.getElementById('yandexSourceText'); // New element
    const yandexTargetText = document.getElementById('yandexTargetText');
    const yandexInsertBtn = document.getElementById('yandexInsertBtn');
    const yandexCopyBtn = document.getElementById('yandexCopyBtn'); const yandexTranslateStatus = document.getElementById('yandexTranslateStatus');

    // AI-Assisted Comment: This function dynamically adds favicon images next to each search engine radio button.
    // It fetches favicons from a public Google service using the domain specified in the searchEngines object.
    function addFaviconsToSearchEngines() {
      document.querySelectorAll('input[name="searchEngine"]').forEach(radio => {
        const prefix = radio.value;
        const searchEngine = searchEngines[prefix];
        if (searchEngine) { // Check if engine exists
          let faviconUrl;
          if (searchEngine.favicon) {
            faviconUrl = searchEngine.favicon;
          } else if (searchEngine.domain) {
            faviconUrl = `https://www.google.com/s2/favicons?sz=32&domain=${searchEngine.domain}`;
          }

          if (faviconUrl) {
            const img = document.createElement('img');
            img.src = faviconUrl;
            img.alt = `${searchEngine.name} Favicon`;
            img.classList.add('favicon-icon');
            radio.parentNode.insertBefore(img, radio.nextSibling);
          }
        }
      });
    }

    function openShortcutsPopup() {
      keyboardShortcutsPopup.classList.add('show');
      popupOverlay.classList.add('show');

      const shortcutsContent = document.getElementById('shortcuts-content');
      shortcutsContent.innerHTML = ''; // Clear previous content

      const shortcuts = [
        { keys: 'Ctrl + K', description: 'Focus on the search bar' },
        { keys: 'Ctrl + Shift + K', description: 'Clear the search bar' },
        { keys: 'Alt + ↑/↓', description: 'Cycle through search engines' },
        { keys: 'Alt + 1-4', description: 'Switch search engine category' },
        { keys: 'Ctrl + Shift + C', description: 'Copy the current search query' },
        { keys: 'Esc', description: 'Close any open pop-up' }
      ];

      const table = document.createElement('table');
      table.className = 'wiki-table';

      const thead = document.createElement('thead');
      thead.innerHTML = `
            <tr>
                <th>Shortcut</th>
                <th>Action</th>
            </tr>
        `;

      const tbody = document.createElement('tbody');
      shortcuts.forEach(shortcut => {
        const row = document.createElement('tr');
        const keysCell = document.createElement('td');
        const descCell = document.createElement('td');
        keysCell.innerHTML = `<code>${shortcut.keys}</code>`;
        descCell.textContent = shortcut.description;
        row.appendChild(keysCell);
        row.appendChild(descCell);
        tbody.appendChild(row);
      });

      table.appendChild(thead);
      table.appendChild(tbody);
      shortcutsContent.appendChild(table);

      // Optional: Improve accessibility
      keyboardShortcutsPopup.setAttribute('aria-hidden', 'false');
    }

    function closeShortcutsPopup() {
      keyboardShortcutsPopup.classList.remove('show');

      // Only close overlay if NO other popups are open
      if (!filetypesPopup.classList.contains('show') &&
        !googleWikiPopup.classList.contains('show') &&
        !bingWikiPopup.classList.contains('show')) {
        popupOverlay.classList.remove('show');
      }

      // Optional: Improve accessibility
      keyboardShortcutsPopup.setAttribute('aria-hidden', 'true');
    }

    keyboardShortcutsBtn.addEventListener('click', openShortcutsPopup);
    closeShortcutsBtn.addEventListener('click', closeShortcutsPopup);

    // Wiki search functionality
    if (wikiSearchInput) {
      wikiSearchInput.addEventListener('input', function() {
        const filter = this.value.toLowerCase().trim();
        const wikiItems = document.getElementById('wikiItems');
        if (!wikiItems) return;

        const lists = wikiItems.querySelectorAll('ul');
        const titles = wikiItems.querySelectorAll('h4');

        lists.forEach((list, index) => {
          let hasVisibleItems = false;
          const items = list.querySelectorAll('li');
          items.forEach(item => {
            const text = item.textContent.toLowerCase();
            if (text.includes(filter)) {
              item.style.display = '';
              hasVisibleItems = true;
            } else {
              item.style.display = 'none';
            }
          });

          // Hide title if no items match in this section
          if (titles[index]) {
            titles[index].style.display = hasVisibleItems ? '' : 'none';
          }
        });
      });
    }

    // Translation API function (using MyMemory - free, no key required)
    async function translateText(text, sourceLang, targetLang) {
      if (!text.trim()) return '';

      try {
        const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLang}|${targetLang}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.responseStatus === 200) {
          return data.responseData.translatedText;
        } else {
          throw new Error(data.responseDetails || 'Translation failed');
        }
      } catch (error) {
        console.error('Translation error:', error);
        throw error;
      }
    }

    let yandexTranslationTimeout;

    function scheduleYandexTranslation() {
      clearTimeout(yandexTranslationTimeout);

      // ADD THESE SAFETY CHECKS
      if (!yandexSourceLang || !yandexSourceText || !yandexTargetText) {
        console.warn('Yandex translation elements not ready');
        return;
      }

      const sourceLang = yandexSourceLang.value;
      const textToTranslate = yandexSourceText.value; // Get text from new input
      const targetLang = 'ru'; // Always translate to Russian

      if (!textToTranslate.trim()) {
        yandexTargetText.value = '';
        if (yandexTranslateStatus) yandexTranslateStatus.textContent = '';
        return;
      }

      if (yandexTranslateStatus) {
        yandexTranslateStatus.textContent = 'Translating...';
        yandexTranslateStatus.className = 'loading';
      }

      yandexTranslationTimeout = setTimeout(async () => {
        try {
          const translated = await translateText(textToTranslate, sourceLang, targetLang);
          yandexTargetText.value = translated;
          if (yandexTranslateStatus) {
            yandexTranslateStatus.textContent = 'Translation complete';
            yandexTranslateStatus.className = 'success';

            setTimeout(() => {
              if (yandexTranslateStatus && yandexTranslateStatus.textContent === 'Translation complete') {
                yandexTranslateStatus.textContent = '';
              }
            }, 2000);
          }
        } catch (error) {
          yandexTargetText.value = '';
          if (yandexTranslateStatus) {
            yandexTranslateStatus.textContent = 'Translation failed. Please try again.';
            yandexTranslateStatus.className = 'error';
          }
        }
      }, 500); // Debounce time
    }

    // AI-Assisted Comment: This function updates the UI to reflect the currently selected search engine.  // It reads the value of the search input, checks for a recognized prefix (like 'g:'),
    // and updates the 'searchSource' element with the name of the engine. It also synchronizes the radio button selection.
    function updateSearchSource() {
      let source = "Entrez une requête pour afficher la source";
      let color = "#555";
      let value = searchInput.value.trim();
      const searchPrefixFavicon = document.getElementById('search-prefix-favicon');

      let effectivePrefix = "";
      let effectiveEngine = null;

      // 1. Check for prefix in input
      for (const key of Object.keys(searchEngines)) {
        if (value.startsWith(key)) {
          effectivePrefix = key;
          break;
        }
      }

      // 2. If no prefix, use selected radio
      if (!effectivePrefix) {
        const selectedRadio = document.querySelector('input[name="searchEngine"]:checked');
        if (selectedRadio) {
          effectivePrefix = selectedRadio.value;
        }
      }

      if (effectivePrefix) {
        effectiveEngine = searchEngines[effectivePrefix];
      }

      // 3. Handle Aliases
      let sourceName = effectiveEngine ? effectiveEngine.name : null;
      if (effectiveEngine && effectiveEngine.isAlias) {
        const originalFilterValue = effectiveEngine.filterValue; // Save value from alias object
        sourceName = effectiveEngine.name; // Use alias name for display
        const aliasTargetPrefix = effectiveEngine.aliasFor;
        effectivePrefix = aliasTargetPrefix; // The real engine is the target
        effectiveEngine = searchEngines[aliasTargetPrefix];

        if (originalFilterValue) {
          const filterRadio = document.querySelector(`input[name="cismef_scope"][value="${originalFilterValue}"]`);
          if (filterRadio) {
            filterRadio.checked = true;
          }
        }
      }


      // Update UI
      if (effectiveEngine) {
        const categoryEmojis = { general: '🌐', academic: '🎓', medical: '⚕️', ai: '🤖' };
        const categoryMap = {
          general: ['g:', 'yt:', 'brave:', 'ddg:', 'yan:', 'bing:', 'bd:', 'gplus:'],
          academic: ['scholar:', 'pubmed:', 'arxiv:', 'gpat:', 'these2.0:', 'cismef-th:', 'these-ma:', 'these-fr:', 'rgate:', 'ndltd:', 'proinserm:', 'bdedu:'],
          medical: ['cismef:', 'msps:', 'has:', 'vidal:', 'mesh:', 'lissa:', 'anm:', 'hetop:', 'nejm:', 'rp:', 'utd:', 'coch:', 'medscape:', 'openmd:', 'dd:', 'webmd:', 'nih:', 'drugs:', 'cdc:', 'cismef-bp:', 'cismef-edu:', 'cismef-edn:', 'cismef-pat:'],
          ai: ['wolf:', 'chatgpt:', 'claude:', 'gemini:', 'gai:', 'perplexity:', 'copilot:', 'cbd:', 'ernie:', 'duckai:']
        };
        let engineCategory = 'general';
        for (const [cat, prefixes] of Object.entries(categoryMap)) {
          if (prefixes.includes(effectivePrefix)) { engineCategory = cat; break; }
        }
        const categoryEmoji = categoryEmojis[engineCategory] || '🔗';
        source = categoryEmoji + " " + sourceName;
        color = "#28a745";

        // Update favicon
        let faviconUrl;
        if (effectiveEngine && effectiveEngine.favicon) {
          faviconUrl = effectiveEngine.favicon;
        } else if (effectiveEngine && effectiveEngine.domain) {
          faviconUrl = `https://www.google.com/s2/favicons?sz=32&domain=${effectiveEngine.domain}`;
        }

        if (faviconUrl && faviconUrl !== searchPrefixFavicon.src) {
          searchPrefixFavicon.classList.remove('swapping');
          void searchPrefixFavicon.offsetWidth; // reflow to restart animation
          searchPrefixFavicon.src = faviconUrl;
          searchPrefixFavicon.alt = sourceName;
          searchPrefixFavicon.title = sourceName;
          searchPrefixFavicon.classList.add('swapping');
        } else if (!faviconUrl) {
          // Fallback to Google favicon
          if (!searchPrefixFavicon.src.includes('google.com')) {
            searchPrefixFavicon.classList.remove('swapping');
            void searchPrefixFavicon.offsetWidth;
            searchPrefixFavicon.src = 'https://www.google.com/s2/favicons?sz=64&domain=google.com';
            searchPrefixFavicon.alt = 'Google';
            searchPrefixFavicon.title = 'Google (défaut)';
            searchPrefixFavicon.classList.add('swapping');
          }
        }
        // Sync radio buttons
        document.querySelectorAll('input[name="searchEngine"]').forEach(radio => {
          const isEffective = radio.value === effectivePrefix;
          if (radio.checked !== isEffective) radio.checked = isEffective;
          radio.parentElement.classList.toggle('selected', isEffective);
        });
      } else {
        // No engine determined
        source = "Entrez une requête pour afficher la source";
        color = "#555";
        if (!searchPrefixFavicon.src.includes('google.com')) {
          searchPrefixFavicon.classList.remove('swapping');
          void searchPrefixFavicon.offsetWidth;
          searchPrefixFavicon.src = 'https://www.google.com/s2/favicons?sz=64&domain=google.com';
          searchPrefixFavicon.alt = 'Google';
          searchPrefixFavicon.title = 'Google (défaut)';
          searchPrefixFavicon.classList.add('swapping');
        }
      }

      // Toggle YouTube filters visibility
      youtubeFilters.style.display = (effectivePrefix === 'yt:') ? 'grid' : 'none';

      // Toggle Google Operator filters visibility
      const isGoogle = (effectivePrefix === 'g:');
      googleOperatorFilters.style.display = isGoogle ? 'grid' : 'none';
      filetypesBtn.style.display = isGoogle ? 'inline-block' : 'none';
      googleWikiBtn.style.display = isGoogle ? 'inline-block' : 'none';

      // Toggle Bing Operator filters visibility
      const isBing = (effectivePrefix === 'bing:');
      bingOperatorFilters.style.display = isBing ? 'grid' : 'none';
      bingWikiBtn.style.display = isBing ? 'inline-block' : 'none';

      // Toggle DuckDuckGo !bang button visibility
      const isDuckDuckGo = (effectivePrefix === 'ddg:');
      duckBangBtn.style.display = isDuckDuckGo ? 'inline-block' : 'none';

      // Toggle CISMeF filters visibility and select correct filter from alias
      if (effectivePrefix === 'cismef:') {
        cismefFilters.style.display = 'grid';
        const typedPrefixEngine = searchEngines[Object.keys(searchEngines).find(k => value.startsWith(k))];
        if (typedPrefixEngine && typedPrefixEngine.isAlias && typedPrefixEngine.filterValue) {
          const filterRadio = document.querySelector(`input[name="cismef_scope"][value="${typedPrefixEngine.filterValue}"]`);
          if (filterRadio) filterRadio.checked = true;
        }
      } else {
        cismefFilters.style.display = 'none';
      }

      // Toggle Yandex Translation Box visibility
      const isYandex = (effectivePrefix === 'yan:');
      const yandexBoxIsVisible = yandexTranslationBox.style.display !== 'none';

      yandexTranslationBox.style.display = isYandex ? 'grid' : 'none';

      if (isYandex && !yandexBoxIsVisible) { // Just switched TO yandex
        yandexSourceText.value = ''; // Clear the input field when Yandex is selected
        yandexSourceText.focus(); // Focus on the new input field
        scheduleYandexTranslation(); // Trigger translation from the new input field
      } else if (!isYandex && yandexBoxIsVisible) { // Just switched AWAY from yandex
        // Clear translation when not Yandex
        yandexSourceText.value = '';
        yandexTargetText.value = '';
        yandexTranslateStatus.textContent = '';
        yandexTranslateStatus.className = '';
      }

      searchSource.textContent = source;
      searchSource.style.color = color;
    }

    // AI-Assisted Comment: This adds a 'change' event listener to all search engine radio buttons.
    // When a user selects a different radio button, this code updates the search input field
    // by replacing the old prefix with the new one, while preserving the user's query.
    document.querySelectorAll('input[name="searchEngine"]').forEach(radio => {
      radio.addEventListener('change', function () {
        document.querySelectorAll('input[name="searchEngine"]').forEach(r =>
          r.parentElement.classList.remove('selected')
        );
        radio.parentElement.classList.add('selected');

        // Strip any existing prefix from the input, keep only the query
        let val = searchInput.value.trim();
        for (const key of Object.keys(searchEngines)) {
          if (val.toLowerCase().startsWith(key.toLowerCase())) {
            val = val.substring(key.length).trim();
            break;
          }
        }

        searchInput.value = val; // keep query, no prefix
        updateSearchSource();
        searchInput.focus();
      });
    });

    // AI-Assisted Comment: This is the main event listener for the form submission.
    // It prevents the default form submission, parses the user's input to separate the prefix and the query,
    // and then constructs the final search URL. It includes special handling for certain search engines.
    searchForm.addEventListener('submit', function (e) {
      e.preventDefault();
      let value = searchInput.value.trim();

      if (!value) return;

      if (value.startsWith('!')) {
        const bangUrl = 'https://duckduckgo.com/?q=' + encodeURIComponent(value);
        window.open(bangUrl, '_blank');
        return;
      }

      let prefix = '';
      let query = '';

      for (const key of Object.keys(searchEngines)) {
        if (value.startsWith(key)) {
          prefix = key;
          query = value.substring(prefix.length).trim();
          break;
        }
      }

      if (!prefix) {
        const selected = document.querySelector('input[name="searchEngine"]:checked');
        if (selected) prefix = selected.value;
        query = value;
      }

      if (siteCheckbox.checked) {
        const selectedRadio = document.querySelector('input[name="searchEngine"]:checked');
        if (selectedRadio && searchEngines[selectedRadio.value]) {
          let siteUrl = searchEngines[selectedRadio.value].url;
          try {
            let urlObj = new URL(siteUrl);
            siteUrl = urlObj.hostname;
          } catch (err) {
            siteUrl = siteUrl.replace(/^https?:\/\//, '').split(/[/?#]/)[0];
          }
          const googleQuery = encodeURIComponent(`site:${siteUrl} ${query}`);
          window.open('https://www.google.com/search?q=' + googleQuery, '_blank');
          return;
        }
      }

      const engine = searchEngines[prefix];
      if (engine && engine.isAlias) {
        const filterRadio = document.querySelector(`input[name="cismef_scope"][value="${engine.filterValue}"]`);
        if (filterRadio) filterRadio.checked = true;
        prefix = engine.aliasFor;
      }


      if (prefix && query) {
        if (prefix === 'yt:') {
          let finalUrl = searchEngines['yt:'].url + encodeURIComponent(query);
          const filterGroups = ['yt_sort', 'yt_type', 'yt_duration', 'yt_date'];

          for (const groupName of filterGroups) {
            const selectedRadio = document.querySelector(`#youtubeFilters input[name="${groupName}"]:checked`);
            if (selectedRadio && selectedRadio.value) {
              finalUrl += '&sp=' + selectedRadio.value;
              break;
            }
          }

          window.open(finalUrl, '_blank');
          return;
        } else if (prefix === 'cismef:') {
          let baseUrl = searchEngines['cismef:'].url;
          const selectedRadio = document.querySelector('input[name="cismef_scope"]:checked');
          let params = 'env=basic&q='; // Default
          if (selectedRadio) {
            params = selectedRadio.value;
          }
          let finalUrl = baseUrl + params + encodeURIComponent(query);
          window.open(finalUrl, '_blank');
          return;
        }


        const finalEngine = searchEngines[prefix];
        if (finalEngine) {
          if (finalEngine.promptBased) {
            navigator.clipboard.writeText(query).then(() => {
              createNotification('Query copied to clipboard! Paste it in the new tab.', 'success');
              window.open(finalEngine.url, '_blank');
            }).catch(err => {
              console.error('Failed to copy query: ', err);
              createNotification('Failed to copy query. Please copy it manually.', 'error');
              window.open(finalEngine.url, '_blank');
            });
            return;
          }

          let encodedQuery;
          if (finalEngine.plusEncoding) {
            encodedQuery = encodeURIComponent(query).replace(/%20/g, '+');
          } else {
            encodedQuery = encodeURIComponent(query);
          }

          let finalUrl;
          let baseUrl = finalEngine.url;

          if (prefix === 'these-ma:') {
            finalUrl = baseUrl + encodedQuery + '&submit=OK';
          } else if (prefix === 'gpat:') {
            finalUrl = baseUrl + '?q=(' + encodedQuery + ')&oq=' + encodedQuery;
          } else if (prefix === 'medscape:') {
            finalUrl = baseUrl + '?q="' + encodedQuery + '"';
          } else {
            finalUrl = baseUrl + encodedQuery;
          }

          // Apply Google Translate wrapper if language is selected
          if (selectedOutputLang !== 'original') {
            const translateUrl = `https://translate.google.com/translate?sl=auto&tl=${selectedOutputLang}&u=${encodeURIComponent(finalUrl)}`;
            window.open(translateUrl, '_blank');
            return;
          }

          // Otherwise open normally
          window.open(finalUrl, '_blank');
        }
      }
    });

    // AI-Assisted Comment: This function toggles the visibility of the wiki content area.
    // It also respects the "keep open" checkbox, preventing the wiki from closing if the user has checked it.
    wikiToggleBtn.addEventListener('click', () => {
      if (wikiContent.style.display === 'block') {
        if (!keepWikiOpenCheckbox.checked) {
          wikiContent.style.display = 'none';
        }
      } else {
        wikiContent.style.display = 'block';
        wikiContent.focus();
      }
    });

    bangsBtn.addEventListener('click', () => {
      // Reference official resource for DuckDuckGo !bangs
      const query = searchInput.value.trim();
      const url = 'https://duckduckgo.com/bangs?q=' + encodeURIComponent(query);
      window.open(url, 'bangsWindow', 'width=800,height=600,scrollbars=yes,resizable=yes');
    });

    // OLD VERSION BELOW (OPEN IN NEW TAB) :
    //    window.open('https://mosermichael.github.io/duckduckbang/html/main.html', '_blank');
    //    });


    // DuckDuckGo !bang button functionality
    const duckBangBtn = document.getElementById('duckBangBtn');

    duckBangBtn.addEventListener('click', () => {
      window.open('https://mosermichael.github.io/duckduckbang/html/main.html', 'duckBangWindow', 'width=800,height=600,scrollbars=yes,resizable=yes');
    });

    function renderFiletypesCheckboxes() {
      const grid = document.getElementById('filetype-grid');
      grid.innerHTML = '';
      const currentFiletypes = getCurrentlySelectedFiletypes();

      for (const [category, filetypes] of Object.entries(filetypesWiki)) {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'filetype-category';

        const title = document.createElement('h4');
        title.textContent = category;
        categoryDiv.appendChild(title);

        const itemsContainer = document.createElement('div');
        itemsContainer.className = 'filetype-items-container';

        filetypes.forEach(filetype => {
          let id, value, name, labelText;

          if (Array.isArray(filetype.ext)) {
            id = `ft-checkbox-${filetype.ext.join('-')}`;
            value = filetype.ext.join(',');
            name = filetype.name;
            labelText = `${name} (.${filetype.ext.join(', .')})`;
          } else {
            id = `ft-checkbox-${filetype.ext}`;
            value = filetype.ext;
            name = filetype.name;
            labelText = `${name} (.${filetype.ext})`;
          }

          const itemDiv = document.createElement('div');
          itemDiv.className = 'filetype-item';

          const label = document.createElement('label');
          label.setAttribute('for', id);

          const checkbox = document.createElement('input');
          checkbox.type = 'checkbox';
          checkbox.id = id;
          checkbox.value = value;
          checkbox.className = 'filetype-checkbox';

          const extensionsInValue = value.split(',');
          if (extensionsInValue.some(ext => currentFiletypes.includes(ext))) {
            checkbox.checked = true;
          }

          label.appendChild(checkbox);
          label.append(` ${labelText}`);

          itemDiv.appendChild(label);
          itemsContainer.appendChild(itemDiv);
        });
        categoryDiv.appendChild(itemsContainer);
        grid.appendChild(categoryDiv);
      }
    }

    function getCurrentlySelectedFiletypes() {
      let val = searchInput.value;
      const filetypeRegex = /filetype:([^\s()]+)/g;
      let matches;
      const extensions = [];
      while ((matches = filetypeRegex.exec(val)) !== null) {
        extensions.push(matches[1]);
      }
      return extensions;
    }

    function applyFiletypeFilter() {
      const checkedBoxes = document.querySelectorAll('.filetype-checkbox:checked');
      const allExtensions = [];
      Array.from(checkedBoxes).forEach(cb => {
        const exts = cb.value.split(',');
        allExtensions.push(...exts);
      });

      let val = searchInput.value.trim();

      const filetypeRegex = /\s*\((filetype:[^\)]+\))\s*|\s*filetype:[^\s]+/g;
      val = val.replace(filetypeRegex, '').trim();

      if (allExtensions.length > 0) {
        const filetypeQuery = allExtensions.map(ext => `filetype:${ext}`).join(' OR ');
        if (val.length > 0) val += ' ';
        val += allExtensions.length > 1 ? `(${filetypeQuery})` : filetypeQuery;
      }

      searchInput.value = val;
      updateSearchSource();
      closeFiletypesPopup();
      searchInput.focus();
    }

    function clearFiletypeSelection() {
      document.querySelectorAll('.filetype-checkbox').forEach(cb => cb.checked = false);
    }

    function openFiletypesPopup() {
      renderFiletypesCheckboxes();
      filetypesPopup.classList.add('show');
      popupOverlay.classList.add('show');
      document.getElementById('applyFiletypes').onclick = applyFiletypeFilter;
      document.getElementById('clearFiletypes').onclick = clearFiletypeSelection;
    }

    function closeFiletypesPopup() {
      filetypesPopup.classList.remove('show');
      popupOverlay.classList.remove('show');
    }

    function openGoogleWikiPopup() {
      googleWikiPopup.classList.add('show');
      popupOverlay.classList.add('show');
    }

    function closeGoogleWikiPopup() {
      googleWikiPopup.classList.remove('show');
      if (!filetypesPopup.classList.contains('show')) {
        popupOverlay.classList.remove('show');
      }
    }

    googleWikiBtn.addEventListener('click', openGoogleWikiPopup);
    closeGoogleWikiBtn.addEventListener('click', closeGoogleWikiPopup);

    function openBingWikiPopup() {
      bingWikiPopup.classList.add('show');
      popupOverlay.classList.add('show');
    }

    function closeBingWikiPopup() {
      bingWikiPopup.classList.remove('show');
      if (!filetypesPopup.classList.contains('show') && !googleWikiPopup.classList.contains('show')) {
        popupOverlay.classList.remove('show');
      }
    }

    bingWikiBtn.addEventListener('click', openBingWikiPopup);
    closeBingWikiBtn.addEventListener('click', closeBingWikiPopup);


    filetypesBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openFiletypesPopup();
    });

    closeFiletypes.addEventListener('click', closeFiletypesPopup);
    popupOverlay.addEventListener('click', () => {
      closeFiletypesPopup();

      if (keepGoogleWikiOpenCheckbox && !keepGoogleWikiOpenCheckbox.checked) {
        closeGoogleWikiPopup();
      }

      if (keepBingWikiOpenCheckbox && !keepBingWikiOpenCheckbox.checked) {
        closeBingWikiPopup();
      }

      closeShortcutsPopup(); // Always close shortcuts on overlay click
    });
    document.addEventListener('click', (e) => {
      if (!wikiContent.contains(e.target) && e.target !== wikiToggleBtn) {
        if (wikiContent.style.display === 'block' && !keepWikiOpenCheckbox.checked) {
          wikiContent.style.display = 'none';
        }
      }
    });

    document.addEventListener('keydown', (e) => {
      // Ctrl+K : Focus sur la recherche
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        searchInput.focus();
      }

      // Ctrl+Shift+K : Clear current url in search bar, and focus on search bar
      if (e.ctrlKey && e.shiftKey && e.key === 'K') {
        e.preventDefault();
        searchInput.value = '';
        searchInput.focus();
      }

      // Alt+Up/Down to cycle through search engines
      if (e.altKey && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
        e.preventDefault();

        const allRadios = Array.from(document.querySelectorAll('input[name="searchEngine"]'));
        const currentRadio = document.querySelector('input[name="searchEngine"]:checked');
        let currentIndex = allRadios.findIndex(radio => radio === currentRadio);

        if (e.key === 'ArrowDown') {
          currentIndex = (currentIndex + 1) % allRadios.length;
        } else { // ArrowUp
          currentIndex = (currentIndex - 1 + allRadios.length) % allRadios.length;
        }

        const nextRadio = allRadios[currentIndex];
        if (nextRadio) {
          nextRadio.click(); // .click() will check the radio and trigger the change event
        }
        searchInput.focus();
      }

      // Alt+1-4 : Basculer entre catégories
      if (e.altKey && e.key >= '1' && e.key <= '4') {
        e.preventDefault(); // Prevent default browser behavior for Alt+Number
        const groups = ['#group1', '#group2', '#group3', '#group4'];
        const firstRadio = document.querySelector(`${groups[e.key - 1]} input`);
        if (firstRadio) { // Check if the radio button exists
          firstRadio.click();
        }
      }

      // Ctrl+Shift+C : Copier la recherche actuelle
      if (e.ctrlKey && e.shiftKey && e.key === 'C') {
        e.preventDefault(); // Prevent default browser behavior for Ctrl+Shift+C
        copyCurrentSearch();
      }

      if (e.key === 'Escape') {
        if (filetypesPopup.classList.contains('show')) {
          closeFiletypesPopup();
        }
        if (googleWikiPopup.classList.contains('show') && !keepGoogleWikiOpenCheckbox.checked) {
          closeGoogleWikiPopup();
        }
        if (bingWikiPopup.classList.contains('show') && !keepBingWikiOpenCheckbox.checked) {
          closeBingWikiPopup();
        }
        if (wikiContent.style.display === 'block' && !keepWikiOpenCheckbox.checked) {
          wikiContent.style.display = 'none';
        }
        if (keyboardShortcutsPopup.classList.contains('show')) {
          closeShortcutsPopup();
        }

        // ADD THIS: Close language popup
        if (langPopup.classList.contains('show')) {
          closeLangPopupFn();
        }
      }
    });

    // Event listener for main search input to trigger UI updates
    // (Consolidated logic for grid filtering, autocomplete, and engine selection)
    searchInput.addEventListener('input', function (e) {
      const value = e.target.value;
      const valueLower = value.trim().toLowerCase();
      selectedIndex = -1;

      // 1. Grid Filtering: Filter radio buttons as user types
      const gridItems = document.querySelectorAll('.category-section label');
      const categorySections = document.querySelectorAll('.category-section');
      
      if (!valueLower || valueLower.includes(' ')) {
        gridItems.forEach(label => label.style.display = 'flex');
        categorySections.forEach(section => section.style.display = 'block');
      } else {
        categorySections.forEach(section => {
          let hasVisible = false;
          const labels = section.querySelectorAll('label');
          labels.forEach(label => {
            const prefix = label.querySelector('input').value.toLowerCase();
            const name = label.textContent.toLowerCase();
            if (prefix.includes(valueLower) || name.includes(valueLower)) {
              label.style.display = 'flex';
              hasVisible = true;
            } else {
              label.style.display = 'none';
            }
          });
          section.style.display = hasVisible ? 'block' : 'none';
        });
      }

      // 2. Meta-prefix handling for 'se:' (Search for search engine)
      if (valueLower.startsWith('se:')) {
        const query = valueLower.substring(3).trim();
        const matches = Object.keys(searchEngines)
          .filter(prefix => {
            const engine = searchEngines[prefix];
            return prefix.toLowerCase().includes(query) ||
              engine.name.toLowerCase().includes(query);
          })
          .map(prefix => ({ prefix, engine: searchEngines[prefix] }));
        
        showAutocomplete(matches);
        updateSearchSource();
        return;
      }

      // 3. Detect exact prefix match (e.g. user typed "yt:" or "scholar:")
      // Strip it immediately and select the engine
      for (const key of Object.keys(searchEngines)) {
        if (valueLower.startsWith(key.toLowerCase())) {
          const query = value.trim().substring(key.length).trim();
          const radio = document.querySelector(`input[name="searchEngine"][value="${key}"]`);
          if (radio) {
            radio.checked = true;
            document.querySelectorAll('input[name="searchEngine"]').forEach(r =>
              r.parentElement.classList.remove('selected')
            );
            radio.parentElement.classList.add('selected');
          }
          searchInput.value = query;
          if (autocompleteDiv) autocompleteDiv.style.display = 'none';
          updateSearchSource();
          return;
        }
      }

      // 4. Autocomplete logic
      if (!valueLower || valueLower.includes(' ')) {
        if (autocompleteDiv) autocompleteDiv.style.display = 'none';
        updateSearchSource();
        return;
      }

      const matches = Object.keys(searchEngines)
        .filter(prefix => {
          const engine = searchEngines[prefix];
          return prefix.toLowerCase().startsWith(valueLower) ||
            engine.name.toLowerCase().includes(valueLower);
        })
        .map(prefix => ({ prefix, engine: searchEngines[prefix] }));

      showAutocomplete(matches);
      updateSearchSource();
    });

    // Event listener for Yandex source input
    yandexSourceText.addEventListener('input', () => {
      scheduleYandexTranslation();
    });

    // Event listener for Yandex source language change
    yandexSourceLang.addEventListener('change', () => {
      scheduleYandexTranslation();
    });

    // Event listener for Yandex Copy button
    yandexCopyBtn.addEventListener('click', () => {
      const textToCopy = yandexTargetText.value;
      if (textToCopy.trim()) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          yandexTranslateStatus.textContent = 'Copied to clipboard!';
          yandexTranslateStatus.className = 'success';
          setTimeout(() => yandexTranslateStatus.textContent = '', 2000);
        }).catch(err => {
          yandexTranslateStatus.textContent = 'Failed to copy.';
          yandexTranslateStatus.className = 'error';
        });
      } else {
        yandexTranslateStatus.textContent = 'Nothing to copy.';
        yandexTranslateStatus.className = 'error';
        setTimeout(() => yandexTranslateStatus.textContent = '', 2000);
      }
    });

    // Event listener for Yandex Insert button
    yandexInsertBtn.addEventListener('click', () => {
      const translatedText = yandexTargetText.value;
      if (translatedText.trim()) {
        const currentInput = searchInput.value;
        const start = searchInput.selectionStart;
        const end = searchInput.selectionEnd;

        // Replace selected text or insert at cursor
        searchInput.value = currentInput.substring(0, start) + translatedText + currentInput.substring(end);

        // Move cursor to the end of the inserted text
        searchInput.selectionStart = start + translatedText.length;
        searchInput.selectionEnd = start + translatedText.length;
        searchInput.focus();

        yandexTranslateStatus.textContent = 'Inserted into search bar!';
        yandexTranslateStatus.className = 'success';
        setTimeout(() => yandexTranslateStatus.textContent = '', 2000);
      } else {
        yandexTranslateStatus.textContent = 'Nothing to insert.';
        yandexTranslateStatus.className = 'error';
        setTimeout(() => yandexTranslateStatus.textContent = '', 2000);
      }
    });

    searchInput.addEventListener('click', () => {
      const textToCopy = yandexTargetText.value;
      if (textToCopy.trim()) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          yandexTranslateStatus.textContent = 'Copied to clipboard!';
          yandexTranslateStatus.className = 'success';
          setTimeout(() => yandexTranslateStatus.textContent = '', 2000);
        }).catch(err => {
          // It's fine if this fails, we don't want to be too intrusive
        });
      }
    });

    window.addEventListener('load', () => {
      updateSearchSource();
      searchInput.focus();
      // AI-Assisted Comment: Dynamically add favicons to search engine options on page load.
      addFaviconsToSearchEngines();
    });

    const bingOperatorDescriptions = {
      '" "': "Searches for an exact phrase match. Example: \"search engine\"",
      'OR': "Returns results with either term. Example: bing OR google",
      'NOT': "Excludes results with this term. Example: search NOT engine",
      'site:': "Restricts search to a specific site. Example: site:microsoft.com",
      'filetype:': "Restricts to a specific file type. Example: filetype:pdf",
      'inurl:': "Finds the term in the page URL. Example: inurl:blog",
      'inbody:': "Searches only in the body text. Example: inbody:\"microservices\"",
      'intitle:': "Finds the term in the page title. Example: intitle:AI",
      'define:': "Displays the definition of a word. Example: define:algorithm",
      'imagesize:': "Searches for images of a specific size. Example: imagesize:large",
      'feed:': "Returns RSS or Atom feeds. Example: feed:tech",
      'language:': "Searches in a specific language. Example: language:fr"
    };

    bingOperatorFilters.addEventListener('mouseover', function (e) {
      if (e.target.classList.contains('operator-btn')) {
        const operator = e.target.dataset.operator;
        const description = bingOperatorDescriptions[operator];

        if (description) {
          tooltipTimeout = setTimeout(() => {
            operatorTooltip.innerHTML = description;
            operatorTooltip.style.display = 'block';

            const rect = e.target.getBoundingClientRect();
            const tooltipRect = operatorTooltip.getBoundingClientRect();

            let top = rect.top - tooltipRect.height - 5;
            if (top < 0) {
              top = rect.bottom + 5;
            }
            if (top + tooltipRect.height > window.innerHeight) {
              top = rect.top - tooltipRect.height - 5;
            }

            let left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
            if (left < 0) left = 5;
            if (left + tooltipRect.width > window.innerWidth) {
              left = window.innerWidth - tooltipRect.width - 5;
            }

            operatorTooltip.style.top = `${top}px`;
            operatorTooltip.style.left = `${left}px`;

            setTimeout(() => { operatorTooltip.style.opacity = 1; }, 10);
          }, 300);
        }
      }
    });

    bingOperatorFilters.addEventListener('mouseout', function (e) {
      if (e.target.classList.contains('operator-btn')) {
        clearTimeout(tooltipTimeout);
        operatorTooltip.style.opacity = 0;
        setTimeout(() => {
          if (operatorTooltip.style.opacity === '0') {
            operatorTooltip.style.display = 'none';
          }
        }, 200);
      }
    });

    bingOperatorFilters.addEventListener('click', function (e) {
      if (e.target.classList.contains('operator-btn')) {
        const operator = e.target.dataset.operator;
        const input = document.getElementById('searchInput');

        if (input.value.trim() && !input.value.endsWith(' ')) {
          input.value += ' ';
        }
        let textToInsert = operator;
        let cursorOffset = 0;

        if (operator === '" "') {
          textToInsert = '""';
          cursorOffset = -1; // Place cursor inside quotes
        } else if (operator === 'NOT' || operator === 'OR') {
          textToInsert = operator + ' ';
        } else if (operator.endsWith(':')) {
          textToInsert = operator; // Operator with colon, like site:
        }

        input.focus();
        const start = input.selectionStart;
        const end = input.selectionEnd;

        input.value = input.value.substring(0, start) + textToInsert + input.value.substring(end);
        input.selectionStart = start + textToInsert.length + cursorOffset;
        input.selectionEnd = start + textToInsert.length + cursorOffset;
      }
    });



    // AI-Assisted Comment: This constant stores a reference to the dark mode toggle button.
    const darkModeToggleBtn = document.getElementById('darkModeToggleBtn');

    // AI-Assisted Comment: This adds a click event listener to the dark mode toggle button.
    // It adds or removes the 'dark-mode' class on the body and saves the user's preference in localStorage.
    darkModeToggleBtn.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('darkMode', 'enabled');
      } else {
        localStorage.setItem('darkMode', 'disabled');
      }
    });

    // AI-Assisted Comment: This checks for the user's dark mode preference in localStorage on page load.
    // If dark mode was previously enabled, it's automatically applied.
    if (localStorage.getItem('darkMode') === 'enabled') {
      document.body.classList.add('dark-mode');
    }

    const operatorTooltip = document.createElement('div');
    operatorTooltip.id = 'operatorTooltip';
    operatorTooltip.className = 'operator-tooltip';
    document.body.appendChild(operatorTooltip);

    const operatorDescriptions = {
      '" "': "Searches for an exact phrase match. Example: \"climate change\"",
      'OR': "Returns results with either term. Example: python OR java",
      '-': "Excludes results with this term. Example: apple -fruit",
      '*': "Acts as a wildcard for any word. Example: \"best * for productivity\"",
      '( )': "Groups terms for complex queries. Example: (solar OR wind) energy",
      'in': "Converts units or currencies. Example: 100 km in miles",
      'site:': "Restricts search to a specific site. Example: site:nytimes.com",
      'intitle:': "Finds the term in the page title. Example: intitle:SEO",
      'allintitle:': "Finds all terms in the page title. Example: allintitle:SEO trends",
      'inurl:': "Finds the term in the page URL. Example: inurl:blog",
      'allinurl:': "Finds all terms in the URL. Example: allinurl:blog seo",
      'intext:': "Searches only in the body text. Example: intext:\"quantum computing\"",
      'allintext:': "Finds all terms in the body text. Example: allintext:AI ethics",
      'filetype:': "Restricts to a specific file type. Example: filetype:pdf",
      'related:': "Finds sites similar to a given domain. Example: related:mozilla.org",
      'define:': "Displays the definition of a word. Example: define:serendipity",
      'source:': "In Google News, filters by outlet. Example: AI source:bbc",
      'stocks:': "Fetches stock information. Example: stocks:GOOGL",
      'weather:': "Shows weather for a location. Example: weather:Tokyo",
      'before:': "Filters results before a date (YYYY-MM-DD). Example: iPhone before:2023-01-01",
      'after:': "Filters results after a date (YYYY-MM-DD). Example: iPhone after:2023-09-01",
      'AROUND()': "Finds terms within N words of each other. Example: \"electric cars\" AROUND(5) battery"
    };

    function createNotification(message, type = 'info') {
      // Remove existing notification if any
      const existing = document.querySelector('.notification');
      if (existing) {
        document.body.removeChild(existing);
      }

      const notification = document.createElement('div');
      notification.className = `notification ${type}`;
      notification.textContent = message;

      document.body.appendChild(notification);

      // Trigger reflow
      void notification.offsetWidth;

      notification.classList.add('show');

      setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
          if (document.body.contains(notification)) {
            document.body.removeChild(notification);
          }
        }, 300);
      }, 3000);
    }

    function copyCurrentSearch() {
      navigator.clipboard.writeText(searchInput.value).then(() => {
        // Optional: Provide visual feedback to the user
        // alert('Current search copied to clipboard!');
        console.log('Search query copied to clipboard');
      }).catch(err => {
        console.error('Failed to copy search query: ', err);
      });
    }

    let tooltipTimeout;


    googleOperatorFilters.addEventListener('mouseover', function (e) {
      if (e.target.classList.contains('operator-btn')) {
        const operator = e.target.dataset.operator;
        const description = operatorDescriptions[operator];

        if (description) {
          tooltipTimeout = setTimeout(() => {
            operatorTooltip.innerHTML = description;
            operatorTooltip.style.display = 'block';

            const rect = e.target.getBoundingClientRect();
            const tooltipRect = operatorTooltip.getBoundingClientRect();

            let top = rect.top - tooltipRect.height - 5;
            if (top < 0) { // If it goes off the top of the screen, place it below
              top = rect.bottom + 5;
            }

            // ADDED: Prevent tooltip from going off the bottom of the screen
            if (top + tooltipRect.height > window.innerHeight) {
              top = rect.top - tooltipRect.height - 5;
            }

            let left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
            if (left < 0) left = 5; // Adjust for left edge
            if (left + tooltipRect.width > window.innerWidth) {
              left = window.innerWidth - tooltipRect.width - 5; // Adjust for right edge
            }

            operatorTooltip.style.top = `${top}px`;
            operatorTooltip.style.left = `${left}px`;

            setTimeout(() => { operatorTooltip.style.opacity = 1; }, 10);
          }, 300); // 0.3 second delay
        }
      }
    });

    googleOperatorFilters.addEventListener('mouseout', function (e) {
      if (e.target.classList.contains('operator-btn')) {
        clearTimeout(tooltipTimeout);
        operatorTooltip.style.opacity = 0;
        setTimeout(() => {
          if (operatorTooltip.style.opacity === '0') {
            operatorTooltip.style.display = 'none';
          }
        }, 200); // Match transition duration
      }
    });



    googleOperatorFilters.addEventListener('click', function (e) {
      if (e.target.classList.contains('operator-btn')) {
        const operator = e.target.dataset.operator;
        const input = document.getElementById('searchInput');

        if (input.value.trim() && !input.value.endsWith(' ')) {
          input.value += ' ';
        }

        let textToInsert = operator;
        let cursorOffset = 0;

        if (operator === '" "') {
          textToInsert = '""';
          cursorOffset = -1; // Place cursor inside quotes
        } else if (operator === '( )') {
          textToInsert = '()';
          cursorOffset = -1;
        } else if (operator === 'in') {
          // 'in' operator needs special handling, often used as 'X in Y'
          // For now, just insert 'in '
          textToInsert = 'in ';
        } else if (operator.endsWith(':')) {
          textToInsert = operator; // Operator with colon, like site:
        } else if (operator === 'AROUND()') {
          textToInsert = 'AROUND()';
          cursorOffset = -1; // Place cursor inside parentheses
        }

        input.focus();
        const start = input.selectionStart;
        const end = input.selectionEnd;

        input.value = input.value.substring(0, start) + textToInsert + input.value.substring(end);
        input.selectionStart = start + textToInsert.length + cursorOffset;
        input.selectionEnd = start + textToInsert.length + cursorOffset;
      }
    });



    // ============================================
    // LANGUAGE TRANSLATION FEATURE
    // ============================================

    // Extended language database (100+ languages)
    const allLanguages = {
      ar: 'Arabic', zh: 'Chinese', en: 'English', fr: 'French', ru: 'Russian', es: 'Spanish',
      de: 'German', ja: 'Japanese', pt: 'Portuguese', it: 'Italian', ko: 'Korean', nl: 'Dutch',
      tr: 'Turkish', pl: 'Polish', sv: 'Swedish', da: 'Danish', fi: 'Finnish', no: 'Norwegian',
      cs: 'Czech', hu: 'Hungarian', ro: 'Romanian', uk: 'Ukrainian', el: 'Greek', he: 'Hebrew',
      th: 'Thai', vi: 'Vietnamese', id: 'Indonesian', ms: 'Malay', hi: 'Hindi', bn: 'Bengali',
      ur: 'Urdu', fa: 'Persian', sw: 'Swahili', ta: 'Tamil', te: 'Telugu', mr: 'Marathi',
      pa: 'Punjabi', gu: 'Gujarati', kn: 'Kannada', ml: 'Malayalam', si: 'Sinhala', km: 'Khmer',
      lo: 'Lao', my: 'Burmese', ka: 'Georgian', am: 'Amharic', ne: 'Nepali', af: 'Afrikaans',
      sq: 'Albanian', hy: 'Armenian', az: 'Azerbaijani', eu: 'Basque', be: 'Belarusian',
      bs: 'Bosnian', bg: 'Bulgarian', ca: 'Catalan', hr: 'Croatian', et: 'Estonian',
      tl: 'Filipino', gl: 'Galician', is: 'Icelandic', ga: 'Irish', lv: 'Latvian',
      lt: 'Lithuanian', mk: 'Macedonian', mt: 'Maltese', mn: 'Mongolian', sr: 'Serbian',
      sk: 'Slovak', sl: 'Slovenian', cy: 'Welsh', yi: 'Yiddish', zu: 'Zulu', xh: 'Xhosa',
      sn: 'Shona', st: 'Sesotho', yo: 'Yoruba', ig: 'Igbo', ha: 'Hausa', ps: 'Pashto',
      sd: 'Sindhi', ug: 'Uyghur', ku: 'Kurdish', tg: 'Tajik', uz: 'Uzbek', kk: 'Kazakh',
      ky: 'Kyrgyz', tk: 'Turkmen', mg: 'Malagasy', ny: 'Chichewa', so: 'Somali',
      co: 'Corsican', fy: 'Frisian', gd: 'Scottish Gaelic', haw: 'Hawaiian', hmn: 'Hmong',
      lb: 'Luxembourgish', sm: 'Samoan', ceb: 'Cebuano', la: 'Latin', eo: 'Esperanto'
    };

    let selectedOutputLang = 'original';

    const langIcon = document.getElementById('langIcon');
    const langPopup = document.getElementById('langPopup');
    const closeLangPopup = document.getElementById('closeLangPopup');
    const langButtons = document.querySelectorAll('.lang-btn');
    const langSearchInput = document.getElementById('langSearchInput');
    const langSuggestions = document.getElementById('langSuggestions');

    function openLangPopup() {
      langPopup.classList.add('show');
      langSearchInput.focus();
    }

    function closeLangPopupFn() {
      langPopup.classList.remove('show');
      langSearchInput.value = '';
      langSuggestions.style.display = 'none';

      if (!filetypesPopup.classList.contains('show') &&
        !googleWikiPopup.classList.contains('show') &&
        !bingWikiPopup.classList.contains('show') &&
        !keyboardShortcutsPopup.classList.contains('show')) {
        popupOverlay.classList.remove('show');
      }
    }

    function updateLangIcon(langCode) {
      selectedOutputLang = langCode;

      if (langCode === 'original') {
        langIcon.textContent = '🌐';
        langIcon.classList.remove('language-selected');
        langIcon.title = 'Select output language';
      } else {
        langIcon.textContent = langCode.toUpperCase();
        langIcon.classList.add('language-selected');
        const langName = allLanguages[langCode] || langCode.toUpperCase();
        langIcon.title = `Translate to ${langName}`;
      }

      localStorage.setItem('selectedOutputLang', langCode);
    }

    // NEW: Search autocomplete functionality
    langSearchInput.addEventListener('input', function () {
      const query = this.value.toLowerCase().trim();

      if (!query) {
        langSuggestions.style.display = 'none';
        return;
      }

      const matches = Object.entries(allLanguages)
        .filter(([code, name]) =>
          code.includes(query) || name.toLowerCase().includes(query)
        )
        .slice(0, 10);

      if (matches.length) {
        langSuggestions.innerHTML = matches
          .map(([code, name]) => `
        <div class="lang-suggestion" data-code="${code}">
          <strong>${name}</strong> <span>(${code})</span>
        </div>
      `)
          .join('');

        langSuggestions.style.display = 'block';

        langSuggestions.querySelectorAll('.lang-suggestion').forEach(item => {
          item.addEventListener('click', () => {
            const code = item.getAttribute('data-code');
            updateLangIcon(code);
            closeLangPopupFn();
          });
        });
      } else {
        langSuggestions.style.display = 'none';
      }
    });

    langIcon.addEventListener('click', (e) => {
      e.stopPropagation();
      openLangPopup();
    });

    closeLangPopup.addEventListener('click', closeLangPopupFn);

    langPopup.addEventListener('click', (e) => {
      if (e.target === langPopup) {
        closeLangPopupFn();
      }
    });

    langButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const lang = btn.getAttribute('data-lang');
        updateLangIcon(lang);
        closeLangPopupFn();
      });
    });

    window.addEventListener('load', () => {
      const savedLang = localStorage.getItem('selectedOutputLang');
      if (savedLang) {
        updateLangIcon(savedLang);
      }
    });
    // Autocomplete functionality
    const autocompleteDiv = document.createElement('div');
    autocompleteDiv.id = 'autocomplete';
    if (dynamicIsland) {
      dynamicIsland.appendChild(autocompleteDiv);
    } else {
      searchInput.parentElement.appendChild(autocompleteDiv);
    }

    let selectedIndex = -1;

    const engineCategories = {
      'general': ['g:', 'yt:', 'brave:', 'ddg:', 'yan:', 'bing:', 'bd:', 'gplus:'],
      'academic': ['scholar:', 'pubmed:', 'arxiv:', 'gpat:', 'these2.0:', 'cismef-th:',
        'these-ma:', 'these-fr:', 'rgate:', 'ndltd:', 'proinserm:', 'bdedu:'],
      'medical': ['cismef:', 'msps:', 'has:', 'vidal:', 'mesh:', 'lissa:', 'anm:', 'hetop:',
        'nejm:', 'rp:', 'utd:', 'coch:', 'medscape:', 'openmd:', 'dd:', 'webmd:',
        'nih:', 'drugs:', 'cdc:', 'cismef-bp:', 'cismef-edu:', 'cismef-edn:', 'cismef-pat:'],
      'ai': ['wolf:', 'chatgpt:', 'claude:', 'gemini:', 'gai:', 'perplexity:',
        'copilot:', 'cbd:', 'ernie:', 'duckai:', 'se:']
    };

    const categoryTitles = {
      'general': '🌐 Recherche Générale',
      'academic': '🎓 Académique / Thèses',
      'medical': '⚕️ Médical / Santé',
      'ai': '🤖 IA / Avancé'
    };

    function getCategoryForPrefix(prefix) {
      for (const [category, prefixes] of Object.entries(engineCategories)) {
        if (prefixes.includes(prefix)) {
          return category;
        }
      }
      return 'general'; // default
    }

    // SMART POSITIONING FUNCTION
    function positionAutocomplete() {
      const ytRow = document.querySelector('.yt-search-row');
      const island = document.getElementById('dynamicIsland');
      const anchor = ytRow || island;
      if (!anchor) return;

      const rect = anchor.getBoundingClientRect();
      const autocompleteHeight = 400;
      const gap = 8;

      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      const showAbove = spaceAbove > autocompleteHeight + gap && spaceAbove > spaceBelow;

      if (showAbove) {
        autocompleteDiv.style.bottom = (window.innerHeight - rect.top + gap) + 'px';
        autocompleteDiv.style.top = 'auto';
      } else {
        autocompleteDiv.style.top = (rect.bottom + gap) + 'px';
        autocompleteDiv.style.bottom = 'auto';
      }

      autocompleteDiv.style.width = rect.width + 'px';
      autocompleteDiv.style.maxWidth = rect.width + 'px';
      autocompleteDiv.style.left = rect.left + 'px';
    }

    function showAutocomplete(matches) {
      if (matches.length === 0) {
        autocompleteDiv.style.display = 'none';
        return;
      }

      // Group matches by category
      const categorizedMatches = {
        general: [],
        academic: [],
        medical: [],
        ai: []
      };

      matches.forEach(match => {
        const category = getCategoryForPrefix(match.prefix);
        categorizedMatches[category].push(match);
      });

      // Create grid structure
      autocompleteDiv.innerHTML = '<div class="autocomplete-grid"></div>';
      const grid = autocompleteDiv.querySelector('.autocomplete-grid');

      // Create columns for each category
      ['general', 'academic', 'medical', 'ai'].forEach(category => {
        const column = document.createElement('div');
        column.className = 'autocomplete-column';

        // Only show column if it has items
        if (categorizedMatches[category].length > 0) {
          const title = document.createElement('div');
          title.className = 'autocomplete-column-title';
          title.textContent = categoryTitles[category];
          column.appendChild(title);

          categorizedMatches[category].forEach((match, index) => {
            const item = document.createElement('div');
            item.className = 'autocomplete-item';
            if (index === selectedIndex) item.classList.add('selected');

            // Favicon
            const favicon = document.createElement('img');
            favicon.className = 'favicon-icon';
            let faviconUrl;
            if (match.engine.favicon) {
              faviconUrl = match.engine.favicon;
            } else if (match.engine.domain) {
              faviconUrl = `https://www.google.com/s2/favicons?sz=32&domain=${match.engine.domain}`;
            }
            if (faviconUrl) {
              favicon.src = faviconUrl;
              favicon.alt = '';
              item.appendChild(favicon);
            }

            // Prefix
            const prefix = document.createElement('span');
            prefix.className = 'autocomplete-prefix';
            prefix.textContent = match.prefix;
            item.appendChild(prefix);

            // Name
            const name = document.createElement('span');
            name.className = 'autocomplete-name';
            name.textContent = match.engine.name;
            item.appendChild(name);

            item.addEventListener('click', () => {
              // Select the matching radio button
              const radio = document.querySelector(`input[name="searchEngine"][value="${match.prefix}"]`);
              if (radio) {
                radio.checked = true;
                document.querySelectorAll('input[name="searchEngine"]').forEach(r =>
                  r.parentElement.classList.remove('selected')
                );
                radio.parentElement.classList.add('selected');
              }
              
              // Robust Prefix Stripping:
              // If user typed "schol" and clicked "scholar:", we clear the input.
              // If user typed "scholar:query" and clicked "scholar:", we keep "query".
              const currentValue = searchInput.value.trim();
              let query = '';
              
              if (currentValue.toLowerCase().startsWith(match.prefix.toLowerCase())) {
                query = currentValue.substring(match.prefix.length).trim();
              } else if (match.prefix.toLowerCase().startsWith(currentValue.toLowerCase())) {
                query = ''; // Partial match, just clear it to start query fresh
              } else {
                query = currentValue; // Should not happen with current filter
              }
              
              searchInput.value = query;
              if (autocompleteDiv) autocompleteDiv.style.display = 'none';
              updateSearchSource();
              searchInput.focus();
            });

            column.appendChild(item);
          });
        }

        grid.appendChild(column);
      });

      // Show and position
      autocompleteDiv.style.display = 'block';
      positionAutocomplete();

      // Auto-highlight first item
      const allItems = autocompleteDiv.querySelectorAll('.autocomplete-item');
      if (allItems.length > 0) {
        selectedIndex = 0;
        allItems[0].classList.add('selected');
      }
    }

    searchInput.addEventListener('keydown', function (e) {
      if (!autocompleteDiv || autocompleteDiv.style.display === 'none') return;
      const items = autocompleteDiv.querySelectorAll('.autocomplete-item');
      if (items.length === 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        selectedIndex = Math.min(selectedIndex + 1, items.length - 1);
        items.forEach((item, i) => item.classList.toggle('selected', i === selectedIndex));
        items[selectedIndex]?.scrollIntoView({ block: 'nearest' });
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        selectedIndex = Math.max(selectedIndex - 1, 0);
        items.forEach((item, i) => item.classList.toggle('selected', i === selectedIndex));
        items[selectedIndex]?.scrollIntoView({ block: 'nearest' });
      } else if (e.key === 'Enter') {
        if (selectedIndex >= 0) {
          e.preventDefault();
          items[selectedIndex]?.click();
        } else if (items.length > 0) {
          // Auto-select top match if none selected
          e.preventDefault();
          items[0]?.click();
        }
      } else if (e.key === 'Escape') {
        autocompleteDiv.style.display = 'none';
      }
    });

    const focusOverlay = document.getElementById('focusOverlay');
    const searchContainer = document.querySelector('.search-container');
    const dynamicIsland = document.getElementById('dynamicIsland');

    searchInput.addEventListener('focus', () => {
      focusOverlay.classList.add('active');
      searchContainer.classList.add('focused');
      if (dynamicIsland) dynamicIsland.classList.add('focused');
      const islandRow = document.querySelector('.island-row');
      if (islandRow) islandRow.classList.add('row-focused');
    });

    searchInput.addEventListener('blur', () => {
      setTimeout(() => {
        focusOverlay.classList.remove('active');
        searchContainer.classList.remove('focused');
        if (dynamicIsland) dynamicIsland.classList.remove('focused');
        const islandRow = document.querySelector('.island-row');
        if (islandRow) islandRow.classList.remove('row-focused');
      }, 200);
    });

    focusOverlay.addEventListener('click', () => {
      searchInput.blur();
      if (autocompleteDiv) autocompleteDiv.style.display = 'none';
    });

    // Consolidated main search input listener
    searchInput.addEventListener('input', function (e) {
      const value = e.target.value;
      const valueLower = value.trim().toLowerCase();
      selectedIndex = -1;

      // 1. Grid Filtering
      const gridItems = document.querySelectorAll('.category-section label');
      const categorySections = document.querySelectorAll('.category-section');
      
      if (!valueLower || valueLower.includes(' ')) {
        gridItems.forEach(label => label.style.display = 'flex');
        categorySections.forEach(section => section.style.display = 'block');
      } else {
        categorySections.forEach(section => {
          let hasVisible = false;
          const labels = section.querySelectorAll('label');
          labels.forEach(label => {
            const prefix = label.querySelector('input').value.toLowerCase();
            const name = label.textContent.toLowerCase();
            if (prefix.includes(valueLower) || name.includes(valueLower)) {
              label.style.display = 'flex';
              hasVisible = true;
            } else {
              label.style.display = 'none';
            }
          });
          section.style.display = hasVisible ? 'block' : 'none';
        });
      }

      // 2. Intelligent Auto-Select on Space
      // If user typed "g: " (prefix + space), strip it and select.
      if (value.endsWith(' ')) {
        const potentialPrefix = value.trim().toLowerCase();
        for (const key of Object.keys(searchEngines)) {
          if (potentialPrefix === key.toLowerCase()) {
            const radio = document.querySelector(`input[name="searchEngine"][value="${key}"]`);
            if (radio) {
              radio.checked = true;
              document.querySelectorAll('input[name="searchEngine"]').forEach(r =>
                r.parentElement.classList.remove('selected')
              );
              radio.parentElement.classList.add('selected');
            }
            searchInput.value = ''; // Clear for query
            if (autocompleteDiv) autocompleteDiv.style.display = 'none';
            updateSearchSource();
            return;
          }
        }
      }

      // 3. Meta-prefix handling for 'se:'
      if (valueLower.startsWith('se:')) {
        const query = valueLower.substring(3).trim();
        const matches = Object.keys(searchEngines)
          .filter(prefix => {
            const engine = searchEngines[prefix];
            return prefix.toLowerCase().includes(query) || engine.name.toLowerCase().includes(query);
          })
          .map(prefix => ({ prefix, engine: searchEngines[prefix] }));
        showAutocomplete(matches);
        updateSearchSource();
        return;
      }

      // 4. Autocomplete logic (matches stable18)
      if (!valueLower || value.includes(' ')) {
        if (autocompleteDiv) autocompleteDiv.style.display = 'none';
        updateSearchSource();
        return;
      }

      const matches = Object.keys(searchEngines)
        .filter(prefix => {
          const engine = searchEngines[prefix];
          return prefix.toLowerCase().startsWith(valueLower) ||
            engine.name.toLowerCase().includes(valueLower);
        })
        .map(prefix => ({ prefix, engine: searchEngines[prefix] }));

      showAutocomplete(matches);
      updateSearchSource();
    });
