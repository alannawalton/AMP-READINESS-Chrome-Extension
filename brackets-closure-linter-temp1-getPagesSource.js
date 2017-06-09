// @author Rob W <http://stackoverflow.com/users/938089/rob-w>
// Demo: var serialized_html = DOMtoString(document);

function DOMtoString(document_root) {
    var html = '',
        node = document_root.firstChild;
    while (node) {
        switch (node.nodeType) {
        case Node.ELEMENT_NODE:
            html += node.outerHTML;
            break;
        case Node.TEXT_NODE:
            html += node.nodeValue;
            break;
        case Node.CDATA_SECTION_NODE:
            html += '<![CDATA[' + node.nodeValue + ']]>';
            break;
        case Node.COMMENT_NODE:
            html += '<!--' + node.nodeValue + '-->';
            break;
        case Node.DOCUMENT_TYPE_NODE:
            // (X)HTML documents are identified by public identifiers
            html += "<!DOCTYPE " + node.name + (node.publicId ? ' PUBLIC "' + node.publicId + '"' : '') + (!node.publicId && node.systemId ? ' SYSTEM' : '') + (node.systemId ? ' "' + node.systemId + '"' : '') + '>\n';
            break;
        }
        node = node.nextSibling;
    }
    return html;
}

function findDetectedApps() {
    let htmlString = DOMtoString(document);
    var apps;
    var xhr = new XMLHttpRequest;
    xhr.open("GET", chrome.runtime.getURL("app.json"));
    xhr.onreadystatechange = function() {
      if (this.readyState == 4) {
        console.log("request finished, now parsing");
        appss = xhr.responseText;
        window.parsed_json = JSON.parse(xhr.responseText);
        console.log("parse results:");
        console.dir(window.parsed_json);
      }
    };
    xhr.send()
}

chrome.runtime.sendMessage({
    action: "getSource",
    detectedApps: 
});