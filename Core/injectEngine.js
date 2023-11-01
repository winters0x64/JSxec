document.addEventListener('DOMContentLoaded',()=>{
    var injection_code = document.getElementById('injection_area');
    var injection_button = document.getElementById('injection_button');

    chrome.tabs.query({active: true},function(tab) {
        var url = tab[0].url;

        // Load presaved scripts
        chrome.storage.sync.get(url, function(_code) {
            if (_code[url] != undefined) {
              injection_code.value = _code[url];
            } 
            else {
                injection_code.value = '';
            }
        });

        // Inject the code
        injection_button.addEventListener('click',()=>{
            var _code = injection_code.value;

            // If there is not code remove the saved file
            if (!_code) {
                chrome.storage.sync.remove(url, function() {
                    console.log('Removed cache for ' + url);
                });
                window.close();
                return;
            }

            chrome.tabs.executeScript({
                code: _code
            });

            // Save the injected script
            var keypair = {};
            keypair[url] = _code;
            chrome.storage.sync.set(keypair, function() {
                console.log('script stored in cache ' + JSON.stringify(keypair));
            });
            window.close();
        });
    });
});