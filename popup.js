var currentVersion = "1.7";
var currentTab = "";
var differentUrlSign = "&#9888;&#65039;";

function canonicals(cs) {
  console.log("canonicals");
  console.log(cs);
  var html = "";
  var differentUrl = "";
  if (cs.length > 0) {
    html += "<ol>";
    for (var i = 0; i < cs.length; i++) {
      if (currentTab.url != cs[i]){ differentUrl = " " + differentUrlSign;};
      html += "<li><a href='" + cs[i] + "' target='_blank'>" + cs[i] + "</a>" + differentUrl  + "</li>";
    }
    html += "</ol>";
  } else {
    html += "None";
  }
  document.getElementById("dCanonical").innerHTML = html;
  document.getElementById("dCurrent").innerHTML = "<a href='" + currentTab.url + "' target='_blank'>" + currentTab.url + "</a>";
  document.getElementById("dTitle").innerHTML = currentTab.title;
  document.getElementById("currentVersion").innerHTML = "Version " + currentVersion;
}

function hreflangs(cs) {
  console.log("hreflangs");
  console.log(cs);
  var html = "";
  var elem;
  if (cs.length > 0) {
    html += "<table id='hreflang'>";
    
    for (var i = 0; i < cs.length; i++) {
      elem = cs[i];
      html += "<tr><td>" + elem.hreflang + "</td><td><a href='" + elem.href + "' target='_blank'>" + elem.href + "</a></td></tr>";
    }
    html += "</table>";
  } else {
    html += "None";
  }
  document.getElementById("dHreflang").innerHTML = html;
}

function amp(cs) {
  console.log("amp");
  console.log(cs);
  var html = "";
  var elem;
  if (cs.length > 0) {
    html += "<ol>";
    for (var i = 0; i < cs.length; i++) {
      html += "<li><a href='" + cs[i] + "' target='_blank'>" + cs[i] + "</a></li>";
    }
    html += "</ol>";
  } else {
    html += "None";
  }
  document.getElementById("dAmp").innerHTML = html;
}

function metaDesc(cs) {
  console.log("metaDesc");
  console.log(cs);
  var html = "";
  var elem;
  if (cs.length > 0) {
    html += "<ol>";
    for (var i = 0; i < cs.length; i++) {
      html += "<li>" + cs[i] + " <span class='len'>[" + cs[i].length + "]</span></li>";
    }
    html += "</ol>";
  } else {
    html += "None";
  }
  document.getElementById("dMetaDesc").innerHTML = html;
}


function robots(cs) {
  console.log("robots");
  console.log(cs);
  var html = "";
  if (cs.length > 0) {
    html += "<ol>";
    for (var i = 0; i < cs.length; i++) {
      html += "<li>" + cs[i] + "</li>";
    }
    html += "</ol>";
  } else {
    html += "None";
  }
  document.getElementById("dMetaRobots").innerHTML = html;
}

function noFollowHighlight(){
  console.group("function noFollowHighlight");
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { action: "noFollowHighlight" }, function (response) {
      //console.log(response.farewell);
      var nofollowBt = document.getElementById("nofollowBt");
      nofollowBt.innerText += " - Found " + response.farewell;
    });
  });
  console.groupEnd();
}

function imgNoSize(){
  console.group("function imgNoSize");
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { action: "imgNoSize" }, function (response) {
	  var rs = response.farewell;
      var imgNoSizeBt = document.getElementById("imgNoSizeBt");
      imgNoSizeBt.innerText += " - Found " + rs.length;
    });
  });
  console.groupEnd();
}



function main() {
  //https://stackoverflow.com/questions/1964225/accessing-current-tab-dom-object-from-popup-html
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { action: "getCanonicals" }, function (response) {
      //console.log(response.farewell);
      canonicals(response.farewell);
    });
    chrome.tabs.sendMessage(tabs[0].id, { action: "getHreflangs" }, function (response) {
      //console.log(response.farewell);
      hreflangs(response.farewell);
    });
    chrome.tabs.sendMessage(tabs[0].id, { action: "getRobots" }, function (response) {
      //console.log(response.farewell);
      robots(response.farewell);
    });
    chrome.tabs.sendMessage(tabs[0].id, { action: "getAmp" }, function (response) {
      //console.log(response.farewell);
      amp(response.farewell);
    });
    chrome.tabs.sendMessage(tabs[0].id, { action: "getMetaDesc" }, function (response) {
      //console.log(response.farewell);
      metaDesc(response.farewell);
    });
    
    //set current tab
    currentTab = tabs[0];

    //set button action
    var nofollowBt = document.getElementById("nofollowBt");
    nofollowBt.addEventListener("click",noFollowHighlight);
	
	var imgNoSizeBt = document.getElementById("imgNoSizeBt");
    imgNoSizeBt.addEventListener("click",imgNoSize);
  });
  
}


main();