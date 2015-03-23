// IU Oncourse - Head scripts to support ajax search box
  var searchbox = null;
    $(document).ready(function(){
       //create search window box
       grandcontainer = document.createElement("div");
       $(grandcontainer).css("position", "relative");
       grandcontainer.id='grandsearchboxcontainer';

       searchboxcontainer = document.createElement("div");
       searchboxcontainer.id = "searchboxcontainer";
       $(searchboxcontainer).width(620).css("float","right").css("margin", ".5em 0 0 11em").css("display", "none"); //.css("background-color", "#7D110C");
       grandcontainer.appendChild(searchboxcontainer);

       searchbox = document.createElement("div");
       searchbox.id = "searchbox";
       $(searchbox).width(600).css("margin", "0 10px").css("background-color", "#fff").height(35);
       searchboxcontainer.appendChild(searchbox);

       closediv = document.createElement("div");
       $(closediv).append("<a href=\"#\" id=\"searchbox_close\" onclick=\"toggleSearch()\">x</a>").width(15).css("float", "right");
       searchbox.appendChild(closediv);

       form = document.createElement("form");
       form.id="searchbox_form";
       form.name="searchbox_form";
       form.onsubmit=searchbox_search;
       searchbox.appendChild(form);

       ul = document.createElement("ul");
       $(ul).css("listStyleType", "none").css("padding",0).css("margin",0).css("padding-top", "6px"); //.css("marginTop", "8px");
       form.appendChild(ul);

       google = document.createElement("li");
       google.className="option";
       google.innerHTML = "<img src=\"/library/image/google_white.gif\" align=\"absmiddle\" />";
       $(google).append("<input type=\"radio\" name=\"search_option\" value=\"http://www.google.com/search?q=\" />").css("margin-top", "-3px");
       ul.appendChild(google);

       iu = document.createElement("li");
       iu.className="option";
       iu.innerHTML = "<img src=\"/library/image/blockiu_white.gif\" align=\"absmiddle\" style=\"margin-top: -4px\" />";
       $(iu).append("<input type=\"radio\" name=\"search_option\" value=\"http://search2.iu.edu/search?client=indiana&site=iunw&site=iufw&site=iuk&site=iue&site=iupui&site=iusb&site=iub&output=xml_no_dtd&proxystylesheet=indiana&btnG=Google+Search&access=p&sort=date%3AD%3AL%3Ad1&q=\" />");
       ul.appendChild(iu);

       kb = document.createElement("li");
       kb.className="option";
       kb.innerHTML = "<a href=\"#\" title=\"IU Knowledge Base\">KB</a>";
       $(kb).append("<input type=\"radio\" name=\"search_option\" value=\"http://kb.iu.edu/index.cgi?search=\" />");
       ul.appendChild(kb);

       iucat = document.createElement("li");
       iucat.className="option";
       iucat.innerHTML = "<a href=\"#\" title=\"IU Libraries' Online Catalog\">IUCAT</a>";
       $(iucat).append("<input type=\"radio\" name=\"search_option\" value=\"http://www.iucat.iu.edu/uhtbin/cgisirsi/x/0/0/5?searchdata1=\" />");
       ul.appendChild(iucat);

       box = document.createElement("li");
       box.innerHTML = "<input type=\"text\" size=\"10\" name=\"searchbox_searchterm\" />";
       ul.appendChild(box);

       button = document.createElement("li");
       button.innerHTML = "<input type=\"button\" value=\"Search\" onclick=\"searchbox_search();\" />";
       ul.appendChild(button);

       $(grandcontainer).insertAfter("#siteNavWrapper");
       $("div#searchbox ul li.option").click(function(){$(this).children("input[type='radio']").get(0).checked=true;});
       if( $("div#searchbox ul li").css("float", "left").css("display", "inline").css("paddingRight", "15px").children("input[type='radio']").get(0) != null)
       {
       		$("div#searchbox ul li").css("float", "left").css("display", "inline").css("paddingRight", "15px").children("input[type='radio']").get(0).checked=true;
       }

    });

    function searchbox_search() {
       window.open($("form#searchbox_form input[@name=search_option]:checked").val() + $("form#searchbox_form input[type='text']").val(), "search", "");
       return false;
    }

    function toggleSearch(){
       $("div#searchboxcontainer").slideToggle("slow");
    }

  //IU Scripts for Menu nav to work in IE
      $(document).ready(function(){
         $("ul#siteLinkList li a").hover(function(){$(this).parent().addClass('hover');}, function(){$(this).parent().removeClass('hover');});
      });

  //IU Scripts to have tool hover description boxes
//COmment out until OPC-Release on July 28, 2007
timeout = null;
  $(document).ready(function(){
      $("div#toolMenuWrap div#toolMenu ul li a").hover(
         function(e){that=this;that.alt = that.title; that.title = ''; eLeft = e.pageX; eTop = e.pageY;
            timeout=setTimeout(function(){if(that.alt != ''){
            $("<p id=\"hoverDescription\">" + that.alt + "</p>").hide().appendTo("body");
            //($("p#hoverDescription").width() > 400 ? $("p#hoverDescription").width(400) : null);
            $("p#hoverDescription").css({left: eLeft + ($.browser.msie?5:0) + "px", top: eTop + ($.browser.msie?5:0) + "px"}).show();
            $().mousemove(function(ee){ $("p#hoverDescription").css({left: ee.pageX + ($.browser.msie?5:0) + "px", top: ee.pageY + ($.browser.msie?5:0) + "px"});});
	      }}, 750);},function(){
            clearTimeout(timeout);
            this.title = (this.title==''?this.alt:this.title);
            $("p#hoverDescription").remove();
         }
      );
   });
