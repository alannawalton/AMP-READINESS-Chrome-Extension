chrome.runtime.onMessage.addListener(function(request, sender) {
  if (request.action == "getSource") {
      htmlOfTab = request.source;
      findDetectedApps(htmlOfTab);
  }
});

function onWindowLoad() {

  var htmlOfTab;

  chrome.tabs.executeScript(null, {
    file: "getPagesSource.js"
  }, function() {
    
  });

}




function findDetectedApps(html) {
    var htmlString = html;
    let linkToApps = (chrome.runtime.getURL('apps.json'));
    var xhr = new XMLHttpRequest();
    var detectedApps;
    let listAllApps;
    xhr.open("GET", linkToApps , true);
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        listAllApps = JSON.parse(xhr.response).apps;
        detectedApps = findAllItems(listAllApps, htmlString);
        console.log(detectedApps);
      }
    }
    xhr.send();
}

function findAllItems(apps, htmlString) {
    let obj = apps;
    let foundThis = [];
    console.log(htmlString);
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        let val = obj[key];
        if (val.script != null) {
          if (val.script.length > 0) {
            if (typeof(val.script) == 'object') {
              for (let x in val.script) {
                let tempScript = val.script[x].split('\\;');
                let regX = new RegExp(tempScript[0]);
                console.log(key, tempScript[0]);
                if (doesRegexExist(regX, htmlString)) {
                  foundThis.push(key);
                }
              }
            }
            else {
              let tempScript = val.script.split('\\;');
              let regX = new RegExp(tempScript[0]);
              console.log(key, tempScript[0]);
              if (doesRegexExist(regX, htmlString)) {
                foundThis.push(key);
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

window.onload = onWindowLoad;