document.addEventListener('DOMContentLoaded', () => {
    const urlsToTest = [
        { url: "https://tools.google.com", name: "Google Update Tools" },
        { url: "https://edgedl.me.gvt1.com", name: "Update Payload (EdgeDL)" },
        { url: "https://dl.google.com", name: "Update Payload (DL)" },
        { url: "https://m.google.com", name: "Device Management" },
        { url: "https://clients3.google.com", name: "System Clock Sync" },
        { url: "https://www.googleapis.com", name: "Google APIs" },
        { url: "https://accounts.google.com", name: "Google Accounts" },
        { url: "https://www.google.com", name: "Google Search (HTTPS)" },
        { url: "https://www.gstatic.com", name: "Static Content (gstatic HTTPS)" },
        { url: "https://ssl.gstatic.com", name: "Static Content (ssl.gstatic)" },
        { url: "https://chromeos-ca.gstatic.com", name: "Google Attestation CA" },
        { url: "http://connectivitycheck.gstatic.com", name: "ChromeOS HTTP Check" }, // HTTP
        { url: "http://www.gstatic.com", name: "Captive Portal Check (HTTP)" }, // HTTP
        { url: "https://accounts.google.com", name: "auth" },
        { url: "https://dl-ssl.google.com", name: "Updates" },
        { url: "https://clients1.google.com", name: "Auto-update ping" },
        { url: "https://clients2.google.com", name: "Crash reports" },
        { url: "https://clients4.google.com", name: "User profiles, metrics" },
        { url: "https://clients6.google.com", name: "Chrome Remote Desktop?" },
        { url: "https://remotedesktop.google.com", name: "Chrome Remote Desktop" },
        { url: "https://pack.google.com", name: "Updates... not sure its used anymore" },
        { url: "https://policies.google.com", name: "Management" },
        { url: "https://safebrowsing.google.com", name: "Safebrowsing" },
        { url: "https://chrome.google.com", name: "Extension download endpoint" },
      //  { url: "http://mtalk.google.com", name: "Used in some single app kiosk scenarios" }
        { url: "https://accounts.gstatic.com", name: "ZZZZZZZ" },
        { url: "https://accounts.youtube.com", name: "ZZZZZZZ" },
        { url: "https://alkalichromeosflexhwis2-pa.googleapis.com", name: "ZZZZZZZ" },
      //  { url: "https://alt.gstatic.com", name: "ZZZZZZZ" },
        { url: "https://aratea-pa.googleapis.com", name: "ZZZZZZZ" },
        { url: "https://chromeosquirksserver-pa.googleapis.com", name: "ZZZZZZZ" },
        { url: "https://clients1.google.com", name: "ZZZZZZZ" },
        { url: "https://clients2.googleusercontent.com", name: "ZZZZZZZ" },
        { url: "https://cloudsearch.googleapis.com", name: "ZZZZZZZ" },
        { url: "https://commondatastorage.googleapis.com", name: "ZZZZZZZ" },
        { url: "https://cros-omahaproxy.appspot.com", name: "ZZZZZZZ" },
        { url: "https://enterprise-safebrowsing.googleapis.com", name: "ZZZZZZZ" },
        { url: "https://firebaseperusertopics-pa.googleapis.com", name: "ZZZZZZZ" },
        { url: "https://gweb-gettingstartedguide.appspot.com", name: "ZZZZZZZ" },
        { url: "https://omahaproxy.appspot.com", name: "ZZZZZZZ" },
        { url: "https://pack.google.com", name: "ZZZZZZZ" },
        { url: "https://printerconfigurations.googleusercontent.com", name: "ZZZZZZZ" },
        { url: "https://safebrowsing-cache.google.com", name: "ZZZZZZZ" },
        { url: "https://safebrowsing.googleapis.com", name: "ZZZZZZZ" },
        { url: "https://sb-ssl.google.com", name: "ZZZZZZZ" },
        { url: "https://scone-pa.clients6.google.com", name: "ZZZZZZZ" },
        { url: "https://storage.googleapis.com ", name: "ZZZZZZZ" },
        // { url: "https://0-10-191-35.1e100.net", name: "Wildcard" },
        { url: "https://googleusercontent.com", name: "Wildcard" },
         //{ url: "https://100.152.32.70.googleusercontent.com", name: "Wildcard" },
        { url: "https://edge0-global.gvt1.com", name: "ZZZZZZZ" }
        
    ];

    const resultsDiv = document.getElementById('results');
    const startButton = document.getElementById('startTestsButton');

    function displayInitialUrls() {
        resultsDiv.innerHTML = ''; // Clear previous results
        urlsToTest.forEach((item, index) => {
            const resultItem = document.createElement('div');
            resultItem.id = `result-${index}`;
            resultItem.innerHTML = `
                <div class="url-info">
                    <span class="url-name">${item.name}</span>
                    <span class="url-target">${item.url}</span>
                </div>
                <span class="status status-pending">Pending...</span>
            `;
            resultsDiv.appendChild(resultItem);
        });
    }

    async function testUrl(item, index) {
        const resultItem = document.getElementById(`result-${index}`);
        const statusSpan = resultItem.querySelector('.status');

        statusSpan.textContent = 'Checking...';
        statusSpan.className = 'status status-checking';

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10-second timeout

            // We use 'no-cors' mode for a basic reachability test.
            // This means we can't read the response body or actual status code for cross-origin requests
            // if CORS headers aren't permissive. However, a successful fetch (no error thrown)
            // indicates that the browser could make contact with the server.
            const response = await fetch(item.url, {
                method: 'GET',
                mode: 'no-cors',
                signal: controller.signal,
                cache: 'no-store' // Try to bypass cache for a fresh check
            });

            clearTimeout(timeoutId);

            // For 'no-cors' mode, response.ok and response.status are not reliable (will be false/0 for opaque responses).
            // The primary success indicator is that the fetch promise resolved without a network error.
            statusSpan.textContent = 'Online';
            statusSpan.className = 'status status-success';

        } catch (error) {
            clearTimeout(controller.signal.reason && controller.signal.reason.timeoutId); // Clear timeout if error is not AbortError from our timeout
            if (error.name === 'AbortError') {
                statusSpan.textContent = 'Timeout';
            } else {
                statusSpan.textContent = 'Offline/Error';
            }
            statusSpan.className = 'status status-failure';
            console.warn(`Error fetching ${item.url}:`, error);
        }
    }

    startButton.addEventListener('click', async () => {
        startButton.disabled = true;
        startButton.textContent = 'Testing...';
        displayInitialUrls(); // Re-initialize list with pending status

        // Test URLs sequentially to avoid overwhelming the browser or network
        for (let i = 0; i < urlsToTest.length; i++) {
            await testUrl(urlsToTest[i], i);
        }
        
        startButton.disabled = false;
        startButton.textContent = 'Start Tests Again';
    });

    // Display URLs on load, ready for testing
    displayInitialUrls();
});