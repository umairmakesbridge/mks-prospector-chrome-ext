
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if( request.message === "clicked_browser_action" ) {
      var firstHref = $("a[href^='http']").eq(0).attr("href");
      //app.init();
      console.log(firstHref);
    }else if(request.message == 'browser_loaded'){
        console.log('Loaded');
        window['chromeExtension'] = chrome.extension;
        if(document.getElementById('_mks_main_file')==null){
          var q = document.createElement('script');
          q.src = chrome.extension.getURL('jquery.min.js');
          (document.head || document.documentElement).appendChild(q);


          var g = document.createElement('script');
          g.src = chrome.extension.getURL('gmail.js');
          (document.head || document.documentElement).appendChild(g);



          function refresh(f) {
            if ((/in/.test(document.readyState)) || (typeof Gmail === undefined)) {
              setTimeout('refresh(' + f + ')', 10);
            } else {
              f();
            }
          }


          var main = function() {
            var h = document.createElement('script');
            h.src = chrome.extension.getURL('jquery.highlight.js');
            (document.head || document.documentElement).appendChild(g);
            
            var s = document.createElement('script');
            s.id  = "_mks_main_file";
            s.src = chrome.extension.getURL('main.js');
            (document.head || document.documentElement).appendChild(s);
          }


          refresh(main);


        }

        //app.init();
    }
  }
);
