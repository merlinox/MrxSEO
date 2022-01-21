var bg = chrome.extension.getBackgroundPage();

var menu = {};
var info = {};

var sections; // defined and updated in content_script
var page;

var toggableSections = [
    "toggle_anchors",
    "toggle_arelxfn",
    "toggle_cms",
    "toggle_common",
    "toggle_forms",
    "toggle_headers",
    "toggle_html",
    "toggle_html5",
    "toggle_images",
    "toggle_links",
    "toggle_markup",
    "toggle_media",
    "toggle_mobile",
    "toggle_opengraph",
    "toggle_presentation",
    "toggle_rhints",
    "toggle_externalr",
    "toggle_script",
    "toggle_social",
    "toggle_structureddata",
    "toggle_structureddata_jsonld",
    "toggle_structureddata_rdfa2",
    "structureddata_microdata",
    "structureddata_other",
    "toggle_svg",
    "toggle_twitter",
    "toggle_videos",
    "toggle_othermetadata",
    "toggle_verification",
    "toggle_security",
    "toggle_largeimages",
    "toggle_geo",
    "toggle_arev"
];

function closeAll() {
    for (var i = 0, len = toggableSections.length; i < len; i++) {
        console.log(toggableSections[i]);
        menu[toggableSections[i]] = "hide";
    }
}

function openAll() {
    for (var i = 0, len = toggableSections.length; i < len; i++) {
        console.log(toggableSections[i]);
        menu[toggableSections[i]] = "show";
    }
}

function tools(url) {

    // console.log("@tools");

    url = url.replace("https://", "");
    url = url.replace("http://", "");
    url = url.split("?")[0];
    domain = url.split("/")[0];

    parts = domain.split(".");
    if (parts.length > 2) parts = parts.slice(1);

    sdomain = parts.join(".");

    html("linksinfo", "<b>The following links will analyze this URL: " + domain + "</b><br><span style='color:#ddd'>TIP: ctrl-click to open the links keeping this pop-up open.</span><br><br>");

    var ref = "?referer=http://goo.gl/ffGBYq";
    var refadd = "&referer=http://goo.gl/ffGBYq";

    // SEO
    var out = "";

    // Safety
    out = "";
    out += favlnk("http://www.google.com/safebrowsing/diagnostic?site=" + domain + refadd, "Google Safe Browsing");	// safety - ok2019
    out += favlnk("http://www.siteadvisor.com/sites/" + domain + ref, "McAfee SiteAdvisor");						// safety - ok2019
    out += favlnk("http://www.mywot.com/en/scorecard/" + domain + ref, "WOT");										// safety rating - ok2019
    out += favlnk("http://safeweb.norton.com/report/show?url=" + domain + refadd, "Norton Safe Web");					// safety rating - ok2019
    html("links2", out);

    out = "";
    out += favlnk("http://www.alexa.com/siteinfo/" + domain + ref, "Alexa");					// traffic - ok2019
    out += favlnk("http://www.majesticseo.com/reports/site-explorer/summary/" + domain + ref, "MajesticSEO");	// backlinks - ok2019
    out += favlnk("http://www.semrush.com/info/" + domain + ref, "SEMRush (login required)");					// keyword
    out += favlnk("http://www.wmtips.com/tools/info/?url=" + domain + refadd, "WMTIPS");			// traffic info - ok2019
    // out += favlnk("http://siteanalytics.compete.com/"+sdomain+ref,"Compete");				// traffic keywords
    //out += favlnk("https://www.google.com/adplanner/site_profile#siteDetails?identifier="+domain,"Google Ad Planner");	// info traffic keywords
    //out += favlnk("http://trends.google.com/websites?q="+domain,"Google Trends");	// traffic
    //out += favlnk("http://www.majesticseo.com/search.php?q="+domain+refadd,"MajesticSEO");	// backlinks
    // out += favlnk("http://www.quantcast.com/"+domain+ref,"Quantacast");	// info
    // out += favlnk("http://www.serpanalytics.com/sites/"+domain+ref,"SERPAnalytics");		// traffic keywords
    //out += favlnk("http://serversiders.com/"+domain,"Serversiders");				// info traffic
    html("links1", out);

    // Social
    out = "";
    out += favlnk("https://search.google.com/structured-data/ting-tool#url=" + url, "Google Structured Data Testing Tool");		// checker - ok2019
    out += favlnk("https://developers.facebook.com/tools/debug/og/object?q=" + url + refadd, "Open Graph Object Debugger (FB)");		// checker - ok2019
    out += favlnk("http://developers.pinterest.com/rich_pins/validator/?link=" + url + refadd, "Rich Pins validator (Pinterest)");	// checker - ok2019
    out += favlnk("https://sitechecker.pro/seo-report/https://" + domain, "Sitechecker");					// pagetest - ok2019
    out += favlnk("https://web.dev/measure", "web.dev Measure");					// pagetest - ok2019
    // out += favlnk("http://www.wmtips.com/tools/keyword-density-analyzer/?url=http://"+domain+refadd,"Keyword Density Analyzer");	// keywords - ok2019
    // out += favlnk("https://plus.google.com/ripple/details?url="+url+refadd,"Ripples Explorer (G+)");								//
    // out += favlnk("http://backtweets.com/search?q="+domain+refadd,"BackTweets");													// comunity
    html("links4", out);

    // Other
    out = "";
    out += favlnk("http://whois.domaintools.com/" + domain + ref, "DomainTools");					// info
    out += favlnk("http://images.google.com/images?q=site:" + sdomain + refadd, "Google Images");
    out += favlnk("http://www.intodns.com/" + sdomain + ref, "intoDNS");
    out += favlnk("http://www.wmtips.com/go/copyscape/https://" + url + ref, "Copyscape Plagiarism");
    out += favlnk("http://web.archive.org/web/*/" + url, "WaybackMachine");
    // out += favlnk("http://nibbler.silktide.com/reports/"+domain+ref,"Nibbler");					// info
    html("links3", out);
}

function copyItem(item) {
    console.log("copyItem", item);
    if (item) {
        var range = document.createRange();
        range.selectNode(item);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
        document.execCommand("copy");
        window.getSelection().removeAllRanges();
        return true;
    } else {
        return false;
    }
}

document.addEventListener('DOMContentLoaded', function () {
    // request on popup open
    chrome.runtime.sendMessage({ mex: { action: "pageInfo" } }, function (response) {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            // console.log("tabs",tabs[0].url);
            if (!tabs[0].url) {
                html("out-inner", "Not available in Chrome special pages and local files, sorry.");
            } else {
                if (response.cnt == -1) {
                    html("out-inner", "Not available in Chrome special pages and local files, sorry.");
                } else {
                    if (response.out != undefined) {
                        sections = response.sections;
                        page = response.page;
                        html("out-inner", response.out);
                        html("outextra-inner", response.outextra);

                        Tipped.create('.tip', { detach: true, fadeOut: 0, hideOnClickOutside: true, maxWidth: 320 });

                        // clip

                        document.addEventListener('click', function (event) {
                            if (event.target.matches('.values_list .ccopy')) {
                                event.preventDefault();
                                var item2copy = event.target.closest(".values_list").querySelector(".content");
                                copyItem(item2copy);
                            }
                        }, false);

                        // end clip

                        chrome.storage.sync.get(['menu'], function (result) {
                            menu = result.menu;	// set global
                            if (menu == undefined) {
                                menu = {};
                            }

                            // Sections
                            jQuery("[data-toggle]").each(function () {
                                var target = jQuery(this).data("toggle");
                                var st_target = "toggle_" + target;
                                if (menu[st_target] == "hide") {
                                    jQuery("[data-section=" + target + "]").addClass("hidden");
                                }
                            });

                            var intros = [
                                ["common", "Here you can find all the basic elements that should never report any issue, in every page of the website."],
                                ["othermetadata", "In this section you can see all the unrecognized meta tags.\nIn most cases these are custom tags only useful to the website developers."],
                                ["largeimages", "Bigger images have more chances to appear in the images SERP pages."],
                                ["rhints", "A resource hint is a dns-prefetch, preconnect, prefetch, or prerender relationship that is used to indicate an origin or resource that should be connected to, or fetched, by the user agent.\nThey allow the optimization of the delivery of resources, reduce round trips, and fetch resources to deliver content faster while a user is browsing a page."],
                                ["externalr", "External resources are page elements or scripts loaded from other locations and are usaully used to add features or track site usage.\nRemember to disable any ad-blocker to see the full list of resources, or navigate in incognoto mode."],
                                ["structureddata", "Structured Data helps search engines better understand what the content of a page and allows users to see the value of a website before they visit via rich snippets.\n\nIt is coded using in-page markup on the page that the information applies to. The structured data on the page should describe the content of that page.\nYou should mark up your siteâ€™s pages using one of three supported formats:\nâ€¢ JSON-LD (recommended by Google)\nâ€¢ Microdata\nâ€¢ RDFa"],
                                ["cms", "These tags should give some hints about what CMS or any other site building tools were used"]
                            ];

                            for (const [section, info] of intros) {
                                var target = document.querySelector("[data-toggle='" + section + "']");
                                if (target) {
                                    // console.log(menu,"toggle_"+section+"_info", menu["toggle_"+section+"_info"]);
                                    target.insertAdjacentHTML("afterend", "<p class='section_intro" + (menu["toggle_" + section + "_info"] != "hide" ? " visible" : "") + "'><img src='../images/info.png' data-infotoggle='" + section + "'><span>" + info.replace(/\n/g, "<br>") + "</span><em data-infotoggle='" + section + "'>close</em></p>");
                                }
                            }

                            var toggles = document.querySelectorAll("[data-infotoggle]");
                            for (var i = 0; i < toggles.length; i++) {
                                toggles[i].onclick = function (e) {
                                    var container = e.target.parentNode;
                                    target = e.target.dataset.infotoggle;
                                    var st_target = "toggle_" + target + "_info";
                                    if (container.classList.contains('visible')) {
                                        container.classList.remove("visible");
                                        menu[st_target] = "hide";
                                        chrome.storage.sync.set({ "menu": menu }, function () { });
                                    } else {
                                        container.classList.add("visible");
                                        menu[st_target] = "show";
                                        chrome.storage.sync.set({ "menu": menu }, function () { });
                                    }

                                };
                            }

                        });



                        // JSON-LD test
                        if (response.jout.jsonld.length > 0) {
                            var tmp = JSON.stringify({ 'jsonld': response.jout.jsonld, 'url': tabs[0].url });
                            bg._gaq.push(['_trackEvent', 'test jsonld', tmp]);
                        } else {
                            // console.log("no JSON-LD");
                        }

                    } else {
                        html("out-inner", "<p style='padding:5px 20px; font-size:120%;'>No data. Please wait for the page to load and try again.</p><p style='padding:5px 20px; font-size:120%;'>If the extension was just installed or automatically updated, you need to refresh the page</p>");
                    }
                }
            }

            jQuery("#menu>span").click(function () {
                var target = jQuery(this).data("target");
                if (target == "pagedata" || target == "pagedataextra") {
                    jQuery(".minitoolbar").show();
                } else {
                    jQuery(".minitoolbar").hide();
                }

                if (jQuery(this).attr("class") != "active") {
                    jQuery("#outer").scrollTop(0);
                    jQuery("#menu span").removeClass("active");
                    jQuery(this).addClass("active");
                    jQuery(".panel").hide();

                    localStorage.setItem("section", target);


                    switch (target) {
                        case "pagedata":
                            jQuery("#out").show();
                            break;

                        case "pagedataextra":
                            jQuery("#outextra").show();
                            break;

                        case "onlinetools":
                            jQuery("#tools").show();
                            break;

                        case "options":
                            jQuery("#options").show();
                            break;

                        case "about":
                            jQuery("#about").show();
                            break;

                    }

                }
            });

            jQuery("[data-toggle]").click(function () {
                var target = jQuery(this).data("toggle");
                var st_target = "toggle_" + target;
                if (jQuery("[data-section=" + target + "]").hasClass("hidden")) {
                    // remove
                    jQuery("[data-section=" + target + "]").removeClass("hidden");
                    menu[st_target] = "show";
                    chrome.storage.sync.set({ "menu": menu }, function () { });
                } else {
                    // add
                    jQuery("[data-section=" + target + "]").addClass("hidden");
                    menu[st_target] = "hide";
                    chrome.storage.sync.set({ "menu": menu }, function () { });
                }
            });

            jQuery("[data-target=" + localStorage.getItem("section") + "]").click();

            jQuery("#showNofollow").click(function () {
                var checked = jQuery(this).prop('checked');
                bg.setTF("nofollow", checked);
                // message to BG
                chrome.extension.sendRequest({ action: 'nofollow', value: checked }, function (response) {
                    //console.log(response.result);
                });
            });

            jQuery("#hideUpdate").click(function () {
                var checked = jQuery(this).prop('checked');
                bg.setTF("hideupdate", checked);
                bg._gaq.push(['_trackEvent', 'hideupdate', checked.toString()]);
            });

            jQuery("#debugmode").click(function () {
                var checked = jQuery(this).prop('checked');
                // bg.setTF("debugmode",checked);
                chrome.storage.sync.set({ debugmode: checked }, function () {
                    console.log('Value is set to ' + value);
                    bg._gaq.push(['_trackEvent', 'debugmode', value.toString()]);
                });

            });

            jQuery("#print").click(function () {
                chrome.storage.local.set({
                    data2print: {
                        sections: sections,
                        page: page
                    }
                }, function () {
                    chrome.tabs.create({ url: 'views/print.html' }, function (tab) { });
                });
            });

            jQuery("#closeAll").click(function () {
                jQuery("[data-toggle]").each(function () {
                    var target = jQuery(this).data("toggle");
                    var st_target = "toggle_" + target;
                    jQuery("[data-section=" + target + "]").addClass("hidden");
                });
                // console.log("closeall A", menu);
                closeAll();
                // console.log("closeall B", menu);
                chrome.storage.sync.set({ "menu": menu }, function () { });
            });

            jQuery("#openAll").click(function () {
                jQuery("[data-toggle]").each(function () {
                    var target = jQuery(this).data("toggle");
                    var st_target = "toggle_" + target;
                    jQuery("[data-section=" + target + "]").removeClass("hidden");
                });
                console.log("openall A", menu);
                openAll();
                console.log("openall B", menu);
                chrome.storage.sync.set({ "menu": menu }, function () { });
            });

            jQuery("#isDebug").click(function () {
                var checked = jQuery(this).prop('checked');
                bg.setTF("isdebug", checked);
            });


            tools(tabs[0].url);

            // "activate" links
            var links = document.getElementsByTagName("a");
            for (var i = 0; i < links.length; i++) {
                (function () {
                    var ln = links[i];
                    var location = ln.href;
                    var dl = ln.download;
                    // console.log(ln.text);
                    // console.dir(ln);
                    if (!dl) {
                        ln.onclick = function (e) {
                            bg._gaq.push(['_trackEvent', 'onlinetool', this.innerText]);
                            e.preventDefault();
                            var ctrl = e.ctrlKey || (e.which == 2);
                            chrome.tabs.create({ active: (!ctrl), url: location });
                            if (!ctrl) window.close();
                        };
                    }
                })();
            }

            jQuery("#showNofollow").prop('checked', bg.getTF("nofollow"));
            jQuery("#hideUpdate").prop('checked', bg.getTF("hideupdate"));
            // jQuery("#debugmode").prop('checked', bg.getTF("debugmode") );

            chrome.storage.sync.get(['debugmode'], function (result) {
                jQuery("#debugmode").prop('checked', result.debugmode);
            });

            bg._gaq.push(['_trackEvent', 'popup open', tabs[0].url]);

        });
    });

    jQuery('[data-trans]').each(function () {
        jQuery(this).html(chrome.i18n.getMessage(jQuery(this).data("trans")));
        jQuery(this).removeAttr("data-trans");
    });

});