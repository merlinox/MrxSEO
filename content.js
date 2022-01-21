
var prefix = "SEO Mrx";
var debug = isDevMode();
logme(prefix + ": Loaded")

function isDevMode() {
  return !('update_url' in chrome.runtime.getManifest());
}

function logme(t) {
  if (debug) console.log(prefix + ": " + t);
}
function logmeVoid(t) {
  if (debug) console.log(t);
}


function getCanonicals() {
  var cs = document.querySelectorAll("link[rel='canonical']");
  return cs;
}
function getCanonicalHrefs() {
  var cs = [];
  var css = getCanonicals();
  for (var i = 0; i < css.length; i++) {
    cs.push(css[i].href);
  }
  return cs;
}
function getMetaDesc() {
  var css = document.querySelectorAll("meta[name='description']");
  logmeVoid("getMetaDesc");
  var cs = [];
  for (var i = 0; i < css.length; i++) {
    cs.push(css[i].content);
  }
  logmeVoid(cs);
  return cs;
}

function getAmp() {
  var csOrig = document.querySelectorAll("link[rel='amphtml']");
  logmeVoid("getAmp");
  logmeVoid(csOrig);
  var cs = [];
  for (var i = 0; i < csOrig.length; i++) {
    cs.push(csOrig[i].href);
  }
  logmeVoid(cs);
  return cs;
}


function getHreflangs() {
  var cs = document.querySelectorAll("link[rel='alternate'][hreflang]");
  return cs;
}
function getHreflangDetails() {
  var cs = [];
  var css = getHreflangs();
  var item;
  for (var i = 0; i < css.length; i++) {
    item = {};
    item.hreflang = css[i].hreflang;
    item.href = css[i].href;

    //cs.push(JSON.stringify(item));
    cs.push(item);
  }
  logmeVoid("content:getHreflangDetails");
  logmeVoid(cs);
  return cs;
}

function getRobots() {
  var cs = document.querySelectorAll("meta[name='robots'],meta[name='googlebots'],meta[name='bingbots']");
  return cs;
}

function getRobotsDetails() {
  var cs = [];
  var css = getRobots();
  var item;
  for (var i = 0; i < css.length; i++) {
    cs.push("[" + css[i].name + "] " + css[i].content);
  }
  return cs;
}

function noFollowHighlighter() {
  var elem;
  var highColor = "#F3C";
  var highSize = 5;
  var highAll = false;
  var rsCounter = 0;

  var rs = getRobots();
  for (var i = 0; i < rs.length; i++) {
    if (rs[i].content.indexOf("nofollow") >= 0) {
      highAll = true;
      break;
    }
  }

  if (highAll) {
    var cs = document.querySelectorAll("a[href]");
  } else {
    var cs = document.querySelectorAll("a[href][rel]");
  }

  for (var i = 0; i < cs.length; i++) {
    elem = cs[i];
    if (cs[i].rel.indexOf("nofollow") >= 0 || highAll) {
      cs[i].style.border = highSize + "px solid " + highColor;
      rsCounter++;
    }
  }

  return rsCounter;
}

//https://gist.github.com/akirattii/2f55bb320f414becbc42bbe56313a28b


function imgNoSize(){
	logmeVoid("imgNoSize starts");
	n = 0;
	is = document.getElementsByTagName("img");
	rsIs = [];
	for (i=0;i<is.length;i++){
		if (is[i].getAttribute("width") == null || is[i].getAttribute("height") == null){
			n++;
			rsIs.push(is[i]);
		}
	}
	console.group("getImageWithoutDimensions");
	console.log(rsIs);
	console.groupEnd();
	return rsIs;
}


chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    var rs;
    switch (request.action) {
      case "getWindow":
        sendResponse({ farewell: window });
        break;
      case "getData":
        rs = window.getData();
        sendResponse({ farewell: rs });
        break;
      case "getCanonicals":
        rs = window.getCanonicalHrefs();
        sendResponse({ farewell: rs });
        break;
      case "getHreflangs":
        rs = window.getHreflangDetails();
        sendResponse({ farewell: rs });
        break;
      case "getAmp":
        rs = window.getAmp();
        sendResponse({ farewell: rs });
        break;
      case "getRobots":
        rs = window.getRobotsDetails();
        sendResponse({ farewell: rs });
        break;
      case "getMetaDesc":
        rs = window.getMetaDesc();
        sendResponse({ farewell: rs });
        break;
      case "noFollowHighlight":
        rs = window.noFollowHighlighter();
        sendResponse({ farewell: rs });
        break;
	  case "imgNoSize":
        rs = window.imgNoSize();
        sendResponse({ farewell: rs });
        break;
      default:
        sendResponse({ farewell: 'none' });
        break;
    }
  }
);

//check canonical
var alertIcon = "";
if (getCanonicalHrefs().length > 0 && getCanonicalHrefs()[0] != document.location.href) {
  //fare mettere icona di alert
  alertIcon = "!";
}

var robots = getRobots();
for (i = 0; i < robots.length; i++) {
  strTest = robots[i].content.toString().toLowerCase();
  if (strTest.indexOf("noindex") >= 0) {
    alertIcon += " X";
    break;
  }
}


chrome.runtime.sendMessage({ alertIcon: alertIcon }, function (response) {
  console.log(`message from background: ${JSON.stringify(response)}`);
});