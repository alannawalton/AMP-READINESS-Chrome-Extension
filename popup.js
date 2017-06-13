chrome.runtime.onMessage.addListener(function (request, sender) {
    if (request.action == "getSource") {
        htmlOfTab = request.source;
        var appsinPage = findDetectedApps(htmlOfTab);

    }
});

function onWindowLoad() {

    var htmlOfTab;

    chrome.tabs.executeScript(null, {
        file: "getPagesSource.js"
    }, function () {

    });

}

function findDetectedApps(html) {
    var htmlString = html;
    let linkToApps = (chrome.runtime.getURL('apps.json'));
    var xhr = new XMLHttpRequest();
    var detectedApps;
    let listAllApps;

    xhr.open("GET", linkToApps, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            listAllApps = JSON.parse(xhr.response).apps;
            detectedApps = findAllItems(listAllApps, htmlString);
            console.log("detectedApps", detectedApps);
            document.getElementById('supported').appendChild(makeList(detectedApps.supported));
            document.getElementById('notSupported').appendChild(makeList(detectedApps.notSupported));
        }
    }
    xhr.send();
    return detectedApps;
}

function findAllItems(apps, htmlString) {
    let obj = apps;
    let foundThis = {
        "supported": [],
        "notSupported": []
    };
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            let val = obj[key];
            if (val.script != null) {
                if (val.script.length > 0) {
                    if (typeof (val.script) == 'object') {
                        for (let x in val.script) {
                            let tempScript = val.script[x].split('\\;');
                            let regX = new RegExp(tempScript[0]);
                            if (doesRegexExist(regX, htmlString)) {
                                if (foundThis.supported.indexOf(key) == -1 && foundThis.notSupported.indexOf(key) == -1) {

                                    if (isSupported(key)) {
                                        foundThis.supported.push(key);
                                    } else {
                                        foundThis.notSupported.push(key);
                                    }
                                }
                            }
                        }
                    } else {
                        let tempScript = val.script.split('\\;');
                        let regX = new RegExp(tempScript[0]);
                        if (doesRegexExist(regX, htmlString)) {
                            if (foundThis.supported.indexOf(key) == -1 && foundThis.notSupported.indexOf(key) == -1) {
                                if (isSupported(key)) {
                                    foundThis.supported.push(key);
                                } else {
                                    foundThis.notSupported.push(key);
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return foundThis;
}

function doesRegexExist(regexString, htmlString) {
    let value = regexString.test(htmlString)
    return (value);
}

function isSupported(key) {
    var ampSupported = ["A8", "A9", "AcccessTrade", "Adblade", "Adform", "Adfox", "Ad Generation", "Adhese",
 "ADITION", "Adman", "AdmanMedia", "AdReactor", "AdSense", "AdsNative", "AdSpirit", "AdSpeed", "AdStir", "AdTech", "AdThrive", "Ad Up Technology", "Adverline", "Adverticum", "AdvertServe", "Affiliate-B", "AMoAd", "AppNexus", "Atomx", "Bidtellect", "brainy", "CA A.J.A. Infeed", "CA-ProFit-X", "Chargeads", "Colombia", "Content.ad", "Criteo", "CSA", "CxenseDisplay", "Dianomi", "DistroScale", "Dot and Media", "Doubleclick", "DoubleClick for Publishers (DFP)", "DoubleClick Ad Exchange (AdX)", "E-Planning", "Ezoic", "FlexOneELEPHANT", "FlexOneHARRIER", "fluct", "Felmat", "Flite", "Fusion", "Google AdSense", "GenieeSSP", "GMOSSP", "GumGum", "Holder", "Imedia", "I-Mobile", "iBillboard", "Improve Digital", "Index Exchange", "Industrybrains", "InMobi", "Kargo", "Kiosked", "Kixer", "Ligatus", "LOKA", "MADS", "MANTIS", "MediaImpact", "Media.net", "Mediavine", "Meg", "MicroAd", "Mixpo", "myWidget", "Nativo", "Navegg", "Nend", "NETLETIX", "Nokta", "Open AdStream (OAS)", "OpenX", "plista", "polymorphicAds", "popin", "PubMatic", "Pubmine", "PulsePoint", "Purch", "Rambler&Co", "Relap", "Revcontent", "Rubicon Project", "Sharethrough", "Sklik", "SlimCut Media", "Smart AdServer", "smartclip", "Sortable", "SOVRN", "SpotX", "SunMedia", "Swoop", "Teads", "TripleLift", "ValueCommerce", "Webediads", "Weborama", "Widespace", "Xlift", "Yahoo", "YahooJP", "Yandex", "Yieldbot", "Yieldmo", "Yieldone", "Zedo", "Zucks", "Bringhub", "Outbrain", "Taboola", "ZergNet", "Acquia Lift", "Adobe Analytics", "AFS Analytics", "AT Internet", "Baidu Analytics", "Burt", "Chartbeat", "Clicky Web Analytics", "comScore", "Cxense", "Dynatrace", "Eulerian Analytics", "Gemius", "Google AdWords", "Google Analytics", "INFOnline / IVW", "Krux", "Linkpulse", "Lotame", "Médiamétrie", "mParticle", "Nielsen", "OEWA", "Parsely", "Piano", "Quantcast Measurement", "Segment", "SOASTA mPulse", "SimpleReach", "Snowplow Analytics", "Webtrekk", "Yandex Metrica"];

    console.log("key", ampSupported.indexOf(key));
    if (ampSupported.indexOf(key) == -1) {
        console.log("IN IT");
        return false;
    }
    return true;
}


function makeList(array) {
    console.log("array", array);
    // Create the list element:
    var list = document.createElement('ul');

    for (var i = 0; i < array.length; i++) {
        // Create the list item:
        var item = document.createElement('li');

        // Set its contents:
        item.appendChild(document.createTextNode(array[i]));

        // Add it to the list:
        list.appendChild(item);
    }

    // Finally, return the constructed list:
    return list;
}




window.onload = onWindowLoad;
