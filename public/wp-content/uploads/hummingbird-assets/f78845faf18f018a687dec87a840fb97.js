/**handles:colormag-custom,colormag-bxslider,colormag-sticky-menu,colormag-news-ticker,colormag-featured-image-popup,colormag-navigation,colormag-fitvids**/
function colormagInit(){var e=function(){jQuery("#cm-masthead .search-form-top").removeClass("show"),jQuery("#cm-content").removeClass("backdrop")};jQuery(document).off("click.colormag",".search-top").on("click.colormag",".search-top",(function(){jQuery(this).next("#cm-masthead .search-form-top").toggleClass("show"),jQuery("#cm-content").toggleClass("backdrop"),setTimeout((function(){jQuery("#cm-masthead .search-form-top input").focus()}),200),function(){var e=jQuery(".cm-desktop-row .search-form-top.show, .cm-mobile-row .search-form-top.show");if(e.length){e.css({right:"",left:""});var o=e[0].getBoundingClientRect(),t=window.innerWidth;o.right>t?(e.css({right:0,left:"auto"}),e.css({"--arrow-right":"10px"})):o.left<0&&(e.css({left:0,right:"auto"}),e.css({"--arrow-left":"10px"}))}}(),jQuery(document).off("keyup.colormag").on("keyup.colormag",(function(o){27===o.keyCode&&jQuery("#cm-masthead .search-form-top").hasClass("show")&&e()})),jQuery(document).off("click.outEvent.colormag").on("click.outEvent.colormag",(function(o){o.target.closest(".cm-top-search")||(e(),jQuery(document).off("click.outEvent.colormag"))}))})),jQuery("#scroll-up").hide(),jQuery(window).off("scroll.colormag").on("scroll.colormag",(function(){jQuery(this).scrollTop()>1e3?jQuery("#scroll-up").fadeIn():jQuery("#scroll-up").fadeOut()})),jQuery("a#scroll-up").off("click.colormag").on("click.colormag",(function(){return jQuery("body,html").animate({scrollTop:0},800),!1})),jQuery(".cm-menu-primary-container .menu-item-has-children"),jQuery(".cm-submenu-toggle").off("click.colormag").on("click.colormag",(function(){jQuery(this).parent(".menu-item-has-children").children("ul.sub-menu").first().slideToggle("1000")})),jQuery(document).off("click.colormag","#cm-primary-nav ul li.menu-item-has-children > a").on("click.colormag","#cm-primary-nav ul li.menu-item-has-children > a",(function(e){var o=jQuery(this).parent(".menu-item-has-children");!o.hasClass("focus")&&jQuery(window).width()<=768&&(o.addClass("focus"),e.preventDefault(),o.children(".sub-menu").css({display:"block"}))}));let o,t=document.getElementsByClassName("cm-header-builder");function i(){if(window.matchMedia("(max-width: 768px)").matches&&jQuery("#cm-masthead .sticky-wrapper, .cm-header-bottom-row .sticky-wrapper, #cm-masthead .headroom").length>=1){var e=jQuery(window).height()-88,o=jQuery("#cm-primary-nav").find("ul").first();o.css("max-height",e),o.addClass("menu-scrollbar")}}var r,a,n,c,s,l,u,d,m,p,f;(o=t.length>0?".cm-header-bottom-row":".cm-primary-nav","complete"===document.readyState?i():jQuery(window).off("load.colormag").on("load.colormag",i),void 0!==jQuery.fn.magnificPopup&&(jQuery(".image-popup").magnificPopup({type:"image"}),jQuery(".gallery").find('a[href*=".jpg"], a[href*=".jpeg"], a[href*=".png"], a[href*=".gif"], a[href*=".ico"]').magnificPopup({type:"image",gallery:{enabled:!0}}),jQuery(".colormag-ticker-news-popup-link").magnificPopup({type:"ajax",callbacks:{parseAjax:function(e){var o=jQuery.magnificPopup.instance,t=jQuery(o.currItem.el[0]).data("fragment");e.data=jQuery(e.data).find(t)}}})),void 0!==jQuery.fn.fitVids&&jQuery(".fitvids-video").fitVids(),void 0!==jQuery.fn.newsTicker&&jQuery(".newsticker").newsTicker({row_height:20,max_rows:1,speed:1e3,direction:"down",duration:4e3,autostart:1,pauseOnHover:1,start:function(){jQuery(".newsticker").css("visibility","visible")}}),void 0!==jQuery.fn.sticky)&&((y=jQuery("#wpadminbar")).length?jQuery(o).sticky({topSpacing:y.height(),zIndex:999}):jQuery(o).sticky({topSpacing:0,zIndex:999}));if(jQuery(".wp-block-search__input").attr("placeholder","Search posts"),void 0!==jQuery.fn.headroom){var g=jQuery(o).offset().top,y=jQuery("#wpadminbar"),h=jQuery(o).width();y.length&&(g=y.height()+jQuery(o).offset().top),jQuery(o).headroom({offset:g,tolerance:0,onPin:function(){y.length?jQuery(o).css({top:y.height(),position:"fixed",width:h}):jQuery(o).css({top:0,position:"fixed","z-index":999,width:h})},onTop:function(){jQuery(o).css({top:0,position:"relative"})}})}if(void 0!==jQuery.fn.bxSlider&&(jQuery(".cm-slider-area-rotate").bxSlider({mode:"horizontal",speed:1500,auto:!0,pause:5e3,adaptiveHeight:!0,nextText:"",prevText:"",nextSelector:".slide-next",prevSelector:".slide-prev",pager:!1,tickerHover:!0,onSliderLoad:function(){jQuery(".cm-slider-area-rotate").css("visibility","visible"),jQuery(".cm-slider-area-rotate").css("height","auto")}}),jQuery(".blog .gallery-images, .archive .gallery-images, .search .gallery-images, .single-post .gallery-images").bxSlider({mode:"fade",speed:1500,auto:!0,pause:3e3,adaptiveHeight:!0,nextText:"",prevText:"",nextSelector:".slide-next",prevSelector:".slide-prev",pager:!1})),void 0!==jQuery.fn.easytabs&&jQuery(".cm-tabbed-widget").easytabs(),void 0!==jQuery.fn.theiaStickySidebar&&"undefined"!=typeof ResizeSensor){var j=jQuery("#site-navigation-sticky-wrapper").outerHeight();null===j&&(j=0),jQuery("#cm-primary, #cm-secondary, #tertiary").theiaStickySidebar({additionalMarginTop:40+j})}function v(e){e.find(".player-frame").each((function(){var e=jQuery(this),o=jQuery('[data-id="'+e.attr("id")+'"]');e.addVideoEvent("play",(function(e,t,i){o.removeClass("is-paused").addClass("is-playing")})),e.addVideoEvent("pause",(function(e,t,i){o.removeClass("is-playing").addClass("is-paused")})),e.addVideoEvent("finish",(function(e,t,i){o.removeClass("is-paused is-playing")}))}))}if(jQuery(".video-player").each((function(e){var o=jQuery(this),t="video-playlist-item-"+e,i=jQuery(this).find(".player-frame");o.attr("id",t),i.video(),v(o),i.addVideoEvent("ready",(function(){i.css("visibility","visible").fadeIn()})),o.off("click.colormag",".video-playlist-item").on("click.colormag",".video-playlist-item",(function(){var e=jQuery(this),t=e.data("id"),i=jQuery("#"+t),r=e.data("src");o.find(".player-frame").each((function(){jQuery(this).pauseVideo().hide()})),i.length?i.playVideo():(o.find(".video-frame").append('<iframe id="'+t+'" class="player-frame" src="'+r+'" frameborder="0" width="100%" height="434" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>'),(i=jQuery("#"+t)).video(),i.addVideoEvent("ready",(function(e,o,t){i.playVideo()}))),i.css("visibility","visible").fadeIn(),v(o)}))})),"undefined"!=typeof google&&"undefined"!=typeof colormag_google_maps_widget_settings){r=parseFloat(colormag_google_maps_widget_settings.longitude),a=parseFloat(colormag_google_maps_widget_settings.latitude),n=parseInt(colormag_google_maps_widget_settings.zoom_size),c={lat:a,lng:r},s=new google.maps.Map(document.getElementById("GoogleMaps"),{zoom:n,center:c}),new google.maps.Marker({position:c,map:s}),jQuery("#GoogleMaps").css({height:colormag_google_maps_widget_settings.height})}m=jQuery(".share-buttons #facebook")[0],p=jQuery(".share-buttons #twitter")[0],f=jQuery(".share-buttons #pinterest")[0],m&&jQuery(m).off("click.colormag").on("click.colormag",(function(e){return e.preventDefault(),(l=window.open("https://www.facebook.com/sharer/sharer.php?u="+document.URL+"&p[title]="+document.title,"facebook-popup","height=350,width=600")).focus&&l.focus(),!1})),p&&jQuery(p).off("click.colormag").on("click.colormag",(function(e){return e.preventDefault(),(u=window.open("https://twitter.com/share?text="+document.title+"&url="+document.URL,"twitter-popup","height=350,width=600")).focus&&u.focus(),!1})),f&&jQuery(f).off("click.colormag").on("click.colormag",(function(e){e.preventDefault();var o=jQuery(".cm-posts .cm-featured-image img").attr("src")?jQuery(".cm-posts .cm-featured-image img").attr("src"):"";return(d=window.open("https://pinterest.com/pin/create/button/?url="+document.URL+"&media="+o+"&description="+document.title,"pinterest-popup","height=350,width=600")).focus&&d.focus(),!1}))}if(jQuery(".wp-block-group__inner-container h2").wrap('<div class="block-title"></div>'),jQuery(".wp-block-heading").wrap('<div class="block-title"></div>'),jQuery(document).ready((function(){colormagInit()})),"undefined"!=typeof wp&&wp.customize&&(wp.customize.bind("preview-ready",(function(){colormagInit()})),wp.customize.preview&&(wp.customize.preview.bind("url",(function(){colormagInit()})),wp.customize.preview.bind("section",(function(){colormagInit()}))),wp.customize.bind("change",(function(){setTimeout((function(){colormagInit()}),100)})),wp.customize.bind("preview-url",(function(){colormagInit()}))),"undefined"!=typeof MutationObserver){var observer=new MutationObserver((function(e){var o=!1;e.forEach((function(e){if("childList"===e.type){var t=e.target;t&&(t.classList.contains("cm-header-builder")||t.classList.contains("cm-desktop-row")||t.classList.contains("cm-mobile-row")||t.closest(".cm-header-builder"))&&(o=!0)}})),o&&setTimeout((function(){colormagInit()}),50)}));jQuery(document).ready((function(){var e=document.querySelector(".cm-header-builder");e&&observer.observe(e,{childList:!0,subtree:!0})}))}
!function(t){var e={mode:"horizontal",slideSelector:"",infiniteLoop:!0,hideControlOnEnd:!1,speed:500,easing:null,slideMargin:0,startSlide:0,randomStart:!1,captions:!1,ticker:!1,tickerHover:!1,adaptiveHeight:!1,adaptiveHeightSpeed:500,video:!1,useCSS:!0,preloadImages:"visible",responsive:!0,slideZIndex:50,wrapperClass:"cm-slider",touchEnabled:!0,swipeThreshold:50,oneToOneTouch:!0,preventDefaultSwipeX:!0,preventDefaultSwipeY:!1,ariaLive:!0,ariaHidden:!0,keyboardEnabled:!1,pager:!0,pagerType:"full",pagerShortSeparator:" / ",pagerSelector:null,buildPager:null,pagerCustom:null,controls:!0,nextText:"Next",prevText:"Prev",nextSelector:null,prevSelector:null,autoControls:!1,startText:"Start",stopText:"Stop",autoControlsCombine:!1,autoControlsSelector:null,auto:!1,pause:4e3,autoStart:!0,autoDirection:"next",stopAutoOnClick:!1,autoHover:!1,autoDelay:0,autoSlideForOnePage:!1,minSlides:1,maxSlides:1,moveSlides:0,slideWidth:0,shrinkItems:!1,onSliderLoad:function(){return!0},onSlideBefore:function(){return!0},onSlideAfter:function(){return!0},onSlideNext:function(){return!0},onSlidePrev:function(){return!0},onSliderResize:function(){return!0},onAutoChange:function(){return!0}};t.fn.bxSlider=function(n){if(0===this.length)return this;if(this.length>1)return this.each((function(){t(this).bxSlider(n)})),this;var s={},o=this,r=t(window).width(),a=t(window).height();if(!t(o).data("bxSlider")){var l=function(){t(o).data("bxSlider")||(s.settings=t.extend({},e,n),s.settings.slideWidth=parseInt(s.settings.slideWidth),s.children=o.children(s.settings.slideSelector),s.children.length<s.settings.minSlides&&(s.settings.minSlides=s.children.length),s.children.length<s.settings.maxSlides&&(s.settings.maxSlides=s.children.length),s.settings.randomStart&&(s.settings.startSlide=Math.floor(Math.random()*s.children.length)),s.active={index:s.settings.startSlide},s.carousel=s.settings.minSlides>1||s.settings.maxSlides>1,s.carousel&&(s.settings.preloadImages="all"),s.minThreshold=s.settings.minSlides*s.settings.slideWidth+(s.settings.minSlides-1)*s.settings.slideMargin,s.maxThreshold=s.settings.maxSlides*s.settings.slideWidth+(s.settings.maxSlides-1)*s.settings.slideMargin,s.working=!1,s.controls={},s.interval=null,s.animProp="vertical"===s.settings.mode?"top":"left",s.usingCSS=s.settings.useCSS&&"fade"!==s.settings.mode&&function(){for(var t=document.createElement("div"),e=["WebkitPerspective","MozPerspective","OPerspective","msPerspective"],i=0;i<e.length;i++)if(void 0!==t.style[e[i]])return s.cssPrefix=e[i].replace("Perspective","").toLowerCase(),s.animProp="-"+s.cssPrefix+"-transform",!0;return!1}(),"vertical"===s.settings.mode&&(s.settings.maxSlides=s.settings.minSlides),o.data("origStyle",o.attr("style")),o.children(s.settings.slideSelector).each((function(){t(this).data("origStyle",t(this).attr("style"))})),d())},d=function(){var e=s.children.eq(s.settings.startSlide);o.wrap('<div class="'+s.settings.wrapperClass+'"><div class="bx-viewport"></div></div>'),s.viewport=o.parent(),s.settings.ariaLive&&!s.settings.ticker&&s.viewport.attr("aria-live","polite"),s.loader=t('<div class="bx-loading" />'),s.viewport.prepend(s.loader),o.css({width:"horizontal"===s.settings.mode?1e3*s.children.length+215+"%":"auto",position:"relative"}),s.usingCSS&&s.settings.easing?o.css("-"+s.cssPrefix+"-transition-timing-function",s.settings.easing):s.settings.easing||(s.settings.easing="swing"),s.viewport.css({width:"100%",overflow:"hidden",position:"relative"}),s.viewport.parent().css({maxWidth:u()}),s.children.css({float:"horizontal"===s.settings.mode?"left":"none",listStyle:"none",position:"relative"}),s.children.css("width",h()),"horizontal"===s.settings.mode&&s.settings.slideMargin>0&&s.children.css("marginRight",s.settings.slideMargin),"vertical"===s.settings.mode&&s.settings.slideMargin>0&&s.children.css("marginBottom",s.settings.slideMargin),"fade"===s.settings.mode&&(s.children.css({position:"absolute",zIndex:0,display:"none"}),s.children.eq(s.settings.startSlide).css({zIndex:s.settings.slideZIndex,display:"block"})),s.controls.el=t('<div class="bx-controls" />'),s.settings.captions&&k(),s.active.last=s.settings.startSlide===f()-1,s.settings.video&&o.fitVids(),"none"===s.settings.preloadImages?e=null:("all"===s.settings.preloadImages||s.settings.ticker)&&(e=s.children),s.settings.ticker?s.settings.pager=!1:(s.settings.controls&&C(),s.settings.auto&&s.settings.autoControls&&T(),s.settings.pager&&b(),(s.settings.controls||s.settings.autoControls||s.settings.pager)&&s.viewport.after(s.controls.el)),null===e?g():c(e,g)},c=function(e,i){var n=e.find('img:not([src=""]), iframe').length,s=0;0!==n?e.find('img:not([src=""]), iframe').each((function(){t(this).one("load error",(function(){++s===n&&i()})).each((function(){t(this).trigger("load")}))})):i()},g=function(){if(s.settings.infiniteLoop&&"fade"!==s.settings.mode&&!s.settings.ticker){var e="vertical"===s.settings.mode?s.settings.minSlides:s.settings.maxSlides,i=s.children.slice(0,e).clone(!0).addClass("bx-clone"),n=s.children.slice(-e).clone(!0).addClass("bx-clone");s.settings.ariaHidden&&(i.attr("aria-hidden",!0),n.attr("aria-hidden",!0)),o.append(i).prepend(n)}s.loader.remove(),m(),"vertical"===s.settings.mode&&(s.settings.adaptiveHeight=!0),s.viewport.height(p()),o.redrawSlider(),s.settings.onSliderLoad.call(o,s.active.index),s.initialized=!0,s.settings.responsive&&t(window).on("resize",Z),s.settings.auto&&s.settings.autoStart&&(f()>1||s.settings.autoSlideForOnePage)&&L(),s.settings.ticker&&O(),s.settings.pager&&z(s.settings.startSlide),s.settings.controls&&D(),navigator.maxTouchPoints>1&&B(),s.settings.keyboardEnabled&&!s.settings.ticker&&t(document).keydown(N)},p=function(){var e=0,n=t();if("vertical"===s.settings.mode||s.settings.adaptiveHeight)if(s.carousel){var o=1===s.settings.moveSlides?s.active.index:s.active.index*x();for(n=s.children.eq(o),i=1;i<=s.settings.maxSlides-1;i++)n=o+i>=s.children.length?n.add(s.children.eq(i-1)):n.add(s.children.eq(o+i))}else n=s.children.eq(s.active.index);else n=s.children;return"vertical"===s.settings.mode?(n.each((function(i){e+=t(this).outerHeight()})),s.settings.slideMargin>0&&(e+=s.settings.slideMargin*(s.settings.minSlides-1))):e=Math.max.apply(Math,n.map((function(){return t(this).outerHeight(!1)})).get()),"border-box"===s.viewport.css("box-sizing")?e+=parseFloat(s.viewport.css("padding-top"))+parseFloat(s.viewport.css("padding-bottom"))+parseFloat(s.viewport.css("border-top-width"))+parseFloat(s.viewport.css("border-bottom-width")):"padding-box"===s.viewport.css("box-sizing")&&(e+=parseFloat(s.viewport.css("padding-top"))+parseFloat(s.viewport.css("padding-bottom"))),e},u=function(){var t="100%";return s.settings.slideWidth>0&&(t="horizontal"===s.settings.mode?s.settings.maxSlides*s.settings.slideWidth+(s.settings.maxSlides-1)*s.settings.slideMargin:s.settings.slideWidth),t},h=function(){var t=s.settings.slideWidth,e=s.viewport.width();if(0===s.settings.slideWidth||s.settings.slideWidth>e&&!s.carousel||"vertical"===s.settings.mode)t=e;else if(s.settings.maxSlides>1&&"horizontal"===s.settings.mode){if(e>s.maxThreshold)return t;e<s.minThreshold?t=(e-s.settings.slideMargin*(s.settings.minSlides-1))/s.settings.minSlides:s.settings.shrinkItems&&(t=Math.floor((e+s.settings.slideMargin)/Math.ceil((e+s.settings.slideMargin)/(t+s.settings.slideMargin))-s.settings.slideMargin))}return t},v=function(){var t=1,e=null;return"horizontal"===s.settings.mode&&s.settings.slideWidth>0?s.viewport.width()<s.minThreshold?t=s.settings.minSlides:s.viewport.width()>s.maxThreshold?t=s.settings.maxSlides:(e=s.children.first().width()+s.settings.slideMargin,t=Math.floor((s.viewport.width()+s.settings.slideMargin)/e)||1):"vertical"===s.settings.mode&&(t=s.settings.minSlides),t},f=function(){var t=0,e=0,i=0;if(s.settings.moveSlides>0){if(!s.settings.infiniteLoop){for(;e<s.children.length;)++t,e=i+v(),i+=s.settings.moveSlides<=v()?s.settings.moveSlides:v();return i}t=Math.ceil(s.children.length/x())}else t=Math.ceil(s.children.length/v());return t},x=function(){return s.settings.moveSlides>0&&s.settings.moveSlides<=v()?s.settings.moveSlides:v()},m=function(){var t,e,i;s.children.length>s.settings.maxSlides&&s.active.last&&!s.settings.infiniteLoop?"horizontal"===s.settings.mode?(t=(e=s.children.last()).position(),S(-(t.left-(s.viewport.width()-e.outerWidth())),"reset",0)):"vertical"===s.settings.mode&&(i=s.children.length-s.settings.minSlides,t=s.children.eq(i).position(),S(-t.top,"reset",0)):(t=s.children.eq(s.active.index*x()).position(),s.active.index===f()-1&&(s.active.last=!0),void 0!==t&&("horizontal"===s.settings.mode?S(-t.left,"reset",0):"vertical"===s.settings.mode&&S(-t.top,"reset",0)))},S=function(e,i,n,r){var a,l;s.usingCSS?(l="vertical"===s.settings.mode?"translate3d(0, "+e+"px, 0)":"translate3d("+e+"px, 0, 0)",o.css("-"+s.cssPrefix+"-transition-duration",n/1e3+"s"),"slide"===i?(o.css(s.animProp,l),0!==n?o.on("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd",(function(e){t(e.target).is(o)&&(o.off("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd"),A())})):A()):"reset"===i?o.css(s.animProp,l):"ticker"===i&&(o.css("-"+s.cssPrefix+"-transition-timing-function","linear"),o.css(s.animProp,l),0!==n?o.on("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd",(function(e){t(e.target).is(o)&&(o.off("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd"),S(r.resetValue,"reset",0),F())})):(S(r.resetValue,"reset",0),F()))):((a={})[s.animProp]=e,"slide"===i?o.animate(a,n,s.settings.easing,(function(){A()})):"reset"===i?o.css(s.animProp,e):"ticker"===i&&o.animate(a,n,"linear",(function(){S(r.resetValue,"reset",0),F()})))},w=function(){for(var e="",i="",n=f(),o=0;o<n;o++)i="",s.settings.buildPager&&t.isFunction(s.settings.buildPager)||s.settings.pagerCustom?(i=s.settings.buildPager(o),s.pagerEl.addClass("bx-custom-pager")):(i=o+1,s.pagerEl.addClass("bx-default-pager")),e+='<div class="bx-pager-item"><a href="" data-slide-index="'+o+'" class="bx-pager-link">'+i+"</a></div>";s.pagerEl.html(e)},b=function(){s.settings.pagerCustom?s.pagerEl=t(s.settings.pagerCustom):(s.pagerEl=t('<div class="bx-pager" />'),s.settings.pagerSelector?t(s.settings.pagerSelector).html(s.pagerEl):s.controls.el.addClass("bx-has-pager").append(s.pagerEl),w()),s.pagerEl.on("click touchend","a",I)},C=function(){s.controls.next=t('<a class="bx-next" href="">'+s.settings.nextText+"</a>"),s.controls.prev=t('<a class="bx-prev" href="">'+s.settings.prevText+"</a>"),s.controls.next.on("click touchend",P),s.controls.prev.on("click touchend",E),s.settings.nextSelector&&t(s.settings.nextSelector).append(s.controls.next),s.settings.prevSelector&&t(s.settings.prevSelector).append(s.controls.prev),s.settings.nextSelector||s.settings.prevSelector||(s.controls.directionEl=t('<div class="bx-controls-direction" />'),s.controls.directionEl.append(s.controls.prev).append(s.controls.next),s.controls.el.addClass("bx-has-controls-direction").append(s.controls.directionEl))},T=function(){s.controls.start=t('<div class="bx-controls-auto-item"><a class="bx-start" href="">'+s.settings.startText+"</a></div>"),s.controls.stop=t('<div class="bx-controls-auto-item"><a class="bx-stop" href="">'+s.settings.stopText+"</a></div>"),s.controls.autoEl=t('<div class="bx-controls-auto" />'),s.controls.autoEl.on("click",".bx-start",M),s.controls.autoEl.on("click",".bx-stop",y),s.settings.autoControlsCombine?s.controls.autoEl.append(s.controls.start):s.controls.autoEl.append(s.controls.start).append(s.controls.stop),s.settings.autoControlsSelector?t(s.settings.autoControlsSelector).html(s.controls.autoEl):s.controls.el.addClass("bx-has-controls-auto").append(s.controls.autoEl),q(s.settings.autoStart?"stop":"start")},k=function(){s.children.each((function(e){var i=t(this).find("img:first").attr("title");void 0!==i&&(""+i).length&&t(this).append('<div class="bx-caption"><span>'+i+"</span></div>")}))},P=function(t){t.preventDefault(),s.controls.el.hasClass("disabled")||(s.settings.auto&&s.settings.stopAutoOnClick&&o.stopAuto(),o.goToNextSlide())},E=function(t){t.preventDefault(),s.controls.el.hasClass("disabled")||(s.settings.auto&&s.settings.stopAutoOnClick&&o.stopAuto(),o.goToPrevSlide())},M=function(t){o.startAuto(),t.preventDefault()},y=function(t){o.stopAuto(),t.preventDefault()},I=function(e){var i,n;e.preventDefault(),s.controls.el.hasClass("disabled")||(s.settings.auto&&s.settings.stopAutoOnClick&&o.stopAuto(),void 0!==(i=t(e.currentTarget)).attr("data-slide-index")&&(n=parseInt(i.attr("data-slide-index")))!==s.active.index&&o.goToSlide(n))},z=function(e){var i=s.children.length;if("short"===s.settings.pagerType)return s.settings.maxSlides>1&&(i=Math.ceil(s.children.length/s.settings.maxSlides)),void s.pagerEl.html(e+1+s.settings.pagerShortSeparator+i);s.pagerEl.find("a").removeClass("active"),s.pagerEl.each((function(i,n){t(n).find("a").eq(e).addClass("active")}))},A=function(){if(s.settings.infiniteLoop){var t="";0===s.active.index?t=s.children.eq(0).position():s.active.index===f()-1&&s.carousel?t=s.children.eq((f()-1)*x()).position():s.active.index===s.children.length-1&&(t=s.children.eq(s.children.length-1).position()),t&&("horizontal"===s.settings.mode?S(-t.left,"reset",0):"vertical"===s.settings.mode&&S(-t.top,"reset",0))}s.working=!1,s.settings.onSlideAfter.call(o,s.children.eq(s.active.index),s.oldIndex,s.active.index)},q=function(t){s.settings.autoControlsCombine?s.controls.autoEl.html(s.controls[t]):(s.controls.autoEl.find("a").removeClass("active"),s.controls.autoEl.find("a:not(.bx-"+t+")").addClass("active"))},D=function(){1===f()?(s.controls.prev.addClass("disabled"),s.controls.next.addClass("disabled")):!s.settings.infiniteLoop&&s.settings.hideControlOnEnd&&(0===s.active.index?(s.controls.prev.addClass("disabled"),s.controls.next.removeClass("disabled")):s.active.index===f()-1?(s.controls.next.addClass("disabled"),s.controls.prev.removeClass("disabled")):(s.controls.prev.removeClass("disabled"),s.controls.next.removeClass("disabled")))},H=function(){o.startAuto()},W=function(){o.stopAuto()},L=function(){s.settings.autoDelay>0?setTimeout(o.startAuto,s.settings.autoDelay):(o.startAuto(),t(window).focus(H).blur(W)),s.settings.autoHover&&o.hover((function(){s.interval&&(o.stopAuto(!0),s.autoPaused=!0)}),(function(){s.autoPaused&&(o.startAuto(!0),s.autoPaused=null)}))},O=function(){var e,i,n,r,a,l,d,c,g=0;"next"===s.settings.autoDirection?o.append(s.children.clone().addClass("bx-clone")):(o.prepend(s.children.clone().addClass("bx-clone")),e=s.children.first().position(),g="horizontal"===s.settings.mode?-e.left:-e.top),S(g,"reset",0),s.settings.pager=!1,s.settings.controls=!1,s.settings.autoControls=!1,s.settings.tickerHover&&(s.usingCSS?(r="horizontal"===s.settings.mode?4:5,s.viewport.hover((function(){i=o.css("-"+s.cssPrefix+"-transform"),n=parseFloat(i.split(",")[r]),S(n,"reset",0)}),(function(){c=0,s.children.each((function(e){c+="horizontal"===s.settings.mode?t(this).outerWidth(!0):t(this).outerHeight(!0)})),a=s.settings.speed/c,l="horizontal"===s.settings.mode?"left":"top",d=a*(c-Math.abs(parseInt(n))),F(d)}))):s.viewport.hover((function(){o.stop()}),(function(){c=0,s.children.each((function(e){c+="horizontal"===s.settings.mode?t(this).outerWidth(!0):t(this).outerHeight(!0)})),a=s.settings.speed/c,l="horizontal"===s.settings.mode?"left":"top",d=a*(c-Math.abs(parseInt(o.css(l)))),F(d)}))),F()},F=function(t){var e,i,n=t||s.settings.speed,r={left:0,top:0},a={left:0,top:0};"next"===s.settings.autoDirection?r=o.find(".bx-clone").first().position():a=s.children.first().position(),e="horizontal"===s.settings.mode?-r.left:-r.top,i="horizontal"===s.settings.mode?-a.left:-a.top,S(e,"ticker",n,{resetValue:i})},N=function(e){var i=document.activeElement.tagName.toLowerCase();if(null==new RegExp(i,["i"]).exec("input|textarea")&&function(e){var i=t(window),n={top:i.scrollTop(),left:i.scrollLeft()},s=e.offset();return n.right=n.left+i.width(),n.bottom=n.top+i.height(),s.right=s.left+e.outerWidth(),s.bottom=s.top+e.outerHeight(),!(n.right<s.left||n.left>s.right||n.bottom<s.top||n.top>s.bottom)}(o)){if(39===e.keyCode)return P(e),!1;if(37===e.keyCode)return E(e),!1}},B=function(){s.touch={start:{x:0,y:0},end:{x:0,y:0}},(!!("ontouchstart"in window)||window.navigator.msMaxTouchPoints>0)&&s.viewport.bind("touchstart MSPointerDown pointerdown",X),s.viewport.on("click",".bxslider a",(function(t){s.viewport.hasClass("click-disabled")&&(t.preventDefault(),s.viewport.removeClass("click-disabled"))}))},X=function(t){if("touchstart"===t.type||0===t.button)if(s.controls.el.addClass("disabled"),s.working)s.controls.el.removeClass("disabled");else{s.touch.originalPos=o.position();var e=t.originalEvent,i=void 0!==e.changedTouches?e.changedTouches:[e];if("function"==typeof PointerEvent&&void 0===e.pointerId)return;s.touch.start.x=i[0].pageX,s.touch.start.y=i[0].pageY,s.viewport.get(0).setPointerCapture&&(s.pointerId=e.pointerId,s.viewport.get(0).setPointerCapture(s.pointerId)),s.originalClickTarget=e.originalTarget||e.target,s.originalClickButton=e.button,s.originalClickButtons=e.buttons,s.originalEventType=e.type,s.hasMove=!1,s.viewport.on("touchmove MSPointerMove pointermove",V),s.viewport.on("touchend MSPointerUp pointerup",R),s.viewport.on("MSPointerCancel pointercancel",Y)}},Y=function(t){t.preventDefault(),S(s.touch.originalPos.left,"reset",0),s.controls.el.removeClass("disabled"),s.viewport.off("MSPointerCancel pointercancel",Y),s.viewport.off("touchmove MSPointerMove pointermove",V),s.viewport.off("touchend MSPointerUp pointerup",R),s.viewport.get(0).releasePointerCapture&&s.viewport.get(0).releasePointerCapture(s.pointerId)},V=function(t){var e=t.originalEvent,i=void 0!==e.changedTouches?e.changedTouches:[e],n=Math.abs(i[0].pageX-s.touch.start.x),o=Math.abs(i[0].pageY-s.touch.start.y),r=0,a=0;s.hasMove=!0,(3*n>o&&s.settings.preventDefaultSwipeX||3*o>n&&s.settings.preventDefaultSwipeY)&&t.preventDefault(),"touchmove"!==t.type&&t.preventDefault(),"fade"!==s.settings.mode&&s.settings.oneToOneTouch&&("horizontal"===s.settings.mode?(a=i[0].pageX-s.touch.start.x,r=s.touch.originalPos.left+a):(a=i[0].pageY-s.touch.start.y,r=s.touch.originalPos.top+a),S(r,"reset",0))},R=function(e){e.preventDefault(),s.viewport.off("touchmove MSPointerMove pointermove",V),s.controls.el.removeClass("disabled");var i=e.originalEvent,n=void 0!==i.changedTouches?i.changedTouches:[i],r=0,a=0;s.touch.end.x=n[0].pageX,s.touch.end.y=n[0].pageY,"fade"===s.settings.mode?(a=Math.abs(s.touch.start.x-s.touch.end.x))>=s.settings.swipeThreshold&&(s.touch.start.x>s.touch.end.x?o.goToNextSlide():o.goToPrevSlide(),o.stopAuto()):("horizontal"===s.settings.mode?(a=s.touch.end.x-s.touch.start.x,r=s.touch.originalPos.left):(a=s.touch.end.y-s.touch.start.y,r=s.touch.originalPos.top),!s.settings.infiniteLoop&&(0===s.active.index&&a>0||s.active.last&&a<0)?S(r,"reset",200):Math.abs(a)>=s.settings.swipeThreshold?(a<0?o.goToNextSlide():o.goToPrevSlide(),o.stopAuto()):S(r,"reset",200)),s.viewport.off("touchend MSPointerUp pointerup",R),s.viewport.get(0).releasePointerCapture&&s.viewport.get(0).releasePointerCapture(s.pointerId),!1!==s.hasMove||0!==s.originalClickButton&&"touchstart"!==s.originalEventType||t(s.originalClickTarget).trigger({type:"click",button:s.originalClickButton,buttons:s.originalClickButtons})},Z=function(e){if(s.initialized)if(s.working)window.setTimeout(Z,10);else{var i=t(window).width(),n=t(window).height();r===i&&a===n||(r=i,a=n,o.redrawSlider(),s.settings.onSliderResize.call(o,s.active.index))}},U=function(t){var e=v();s.settings.ariaHidden&&!s.settings.ticker&&(s.children.attr("aria-hidden","true"),s.children.slice(t,t+e).attr("aria-hidden","false"))};return o.goToSlide=function(e,i){var n,r,a,l,d=!0,c=0,g={left:0,top:0},u=null;if(s.oldIndex=s.active.index,s.active.index=function(t){return t<0?s.settings.infiniteLoop?f()-1:s.active.index:t>=f()?s.settings.infiniteLoop?0:s.active.index:t}(e),!s.working&&s.active.index!==s.oldIndex){if(s.working=!0,void 0!==(d=s.settings.onSlideBefore.call(o,s.children.eq(s.active.index),s.oldIndex,s.active.index))&&!d)return s.active.index=s.oldIndex,void(s.working=!1);"next"===i?s.settings.onSlideNext.call(o,s.children.eq(s.active.index),s.oldIndex,s.active.index)||(d=!1):"prev"===i&&(s.settings.onSlidePrev.call(o,s.children.eq(s.active.index),s.oldIndex,s.active.index)||(d=!1)),s.active.last=s.active.index>=f()-1,(s.settings.pager||s.settings.pagerCustom)&&z(s.active.index),s.settings.controls&&D(),"fade"===s.settings.mode?(s.settings.adaptiveHeight&&s.viewport.height()!==p()&&s.viewport.animate({height:p()},s.settings.adaptiveHeightSpeed),s.children.filter(":visible").fadeOut(s.settings.speed).css({zIndex:0}),s.children.eq(s.active.index).css("zIndex",s.settings.slideZIndex+1).fadeIn(s.settings.speed,(function(){t(this).css("zIndex",s.settings.slideZIndex),A()}))):(s.settings.adaptiveHeight&&s.viewport.height()!==p()&&s.viewport.animate({height:p()},s.settings.adaptiveHeightSpeed),!s.settings.infiniteLoop&&s.carousel&&s.active.last?"horizontal"===s.settings.mode?(g=(u=s.children.eq(s.children.length-1)).position(),c=s.viewport.width()-u.outerWidth()):(n=s.children.length-s.settings.minSlides,g=s.children.eq(n).position()):s.carousel&&s.active.last&&"prev"===i?(r=1===s.settings.moveSlides?s.settings.maxSlides-x():(f()-1)*x()-(s.children.length-s.settings.maxSlides),g=(u=o.children(".bx-clone").eq(r)).position()):"next"===i&&0===s.active.index?(g=o.find("> .bx-clone").eq(s.settings.maxSlides).position(),s.active.last=!1):e>=0&&(l=e*parseInt(x()),g=s.children.eq(l).position()),void 0!==g&&(a="horizontal"===s.settings.mode?-(g.left-c):-g.top,S(a,"slide",s.settings.speed)),s.working=!1),s.settings.ariaHidden&&U(s.active.index*x())}},o.goToNextSlide=function(){if((s.settings.infiniteLoop||!s.active.last)&&!0!==s.working){var t=parseInt(s.active.index)+1;o.goToSlide(t,"next")}},o.goToPrevSlide=function(){if((s.settings.infiniteLoop||0!==s.active.index)&&!0!==s.working){var t=parseInt(s.active.index)-1;o.goToSlide(t,"prev")}},o.startAuto=function(t){s.interval||(s.interval=setInterval((function(){"next"===s.settings.autoDirection?o.goToNextSlide():o.goToPrevSlide()}),s.settings.pause),s.settings.onAutoChange.call(o,!0),s.settings.autoControls&&!0!==t&&q("stop"))},o.stopAuto=function(t){s.autoPaused&&(s.autoPaused=!1),s.interval&&(clearInterval(s.interval),s.interval=null,s.settings.onAutoChange.call(o,!1),s.settings.autoControls&&!0!==t&&q("start"))},o.getCurrentSlide=function(){return s.active.index},o.getCurrentSlideElement=function(){return s.children.eq(s.active.index)},o.getSlideElement=function(t){return s.children.eq(t)},o.getSlideCount=function(){return s.children.length},o.isWorking=function(){return s.working},o.redrawSlider=function(){s.children.add(o.find(".bx-clone")).outerWidth(h()),s.viewport.css("height",p()),s.settings.ticker||m(),s.active.last&&(s.active.index=f()-1),s.active.index>=f()&&(s.active.last=!0),s.settings.pager&&!s.settings.pagerCustom&&(w(),z(s.active.index)),s.settings.ariaHidden&&U(s.active.index*x())},o.destroySlider=function(){s.initialized&&(s.initialized=!1,t(".bx-clone",this).remove(),s.children.each((function(){void 0!==t(this).data("origStyle")?t(this).attr("style",t(this).data("origStyle")):t(this).removeAttr("style")})),void 0!==t(this).data("origStyle")?this.attr("style",t(this).data("origStyle")):t(this).removeAttr("style"),t(this).unwrap().unwrap(),s.controls.el&&s.controls.el.remove(),s.controls.next&&s.controls.next.remove(),s.controls.prev&&s.controls.prev.remove(),s.pagerEl&&s.settings.controls&&!s.settings.pagerCustom&&s.pagerEl.remove(),t(".bx-caption",this).remove(),s.controls.autoEl&&s.controls.autoEl.remove(),clearInterval(s.interval),s.settings.responsive&&t(window).off("resize",Z),s.settings.keyboardEnabled&&t(document).off("keydown",N),t(this).removeData("bxSlider"),t(window).off("blur",W).off("focus",H))},o.reloadSlider=function(e){void 0!==e&&(n=e),o.destroySlider(),l(),t(o).data("bxSlider",this)},l(),t(o).data("bxSlider",this),this}}}(jQuery);
!function(t){"function"==typeof define&&define.amd?define(["jquery"],t):"object"==typeof module&&module.exports?module.exports=t(require("jquery")):t(jQuery)}((function(t){var e=Array.prototype.slice,i=Array.prototype.splice,n={topSpacing:0,bottomSpacing:0,className:"is-sticky",wrapperClassName:"sticky-wrapper",center:!1,getWidthFrom:"",widthFromWrapper:!0,responsiveWidth:!1,zIndex:"auto"},r=t(window),s=t(document),o=[],c=r.height(),a=function(){for(var e=r.scrollTop(),i=s.height(),n=i-c,a=e>n?n-e:0,p=0,d=o.length;p<d;p++){var l=o[p],h=l.stickyWrapper.offset().top-l.topSpacing-a;if(l.stickyWrapper.css("height",l.stickyElement.outerHeight()),e<=h)null!==l.currentTop&&(l.stickyElement.css({width:"",position:"",top:"","z-index":""}),l.stickyElement.parent().removeClass(l.className),l.stickyElement.trigger("sticky-end",[l]),l.currentTop=null);else{var u,g=i-l.stickyElement.outerHeight()-l.topSpacing-l.bottomSpacing-e-a;if(g<0?g+=l.topSpacing:g=l.topSpacing,l.currentTop!==g)l.getWidthFrom?u=t(l.getWidthFrom).width()||null:l.widthFromWrapper&&(u=l.stickyWrapper.width()),null==u&&(u=l.stickyElement.width()),l.stickyElement.css("width",u).css("position","fixed").css("top",g).css("z-index",l.zIndex),l.stickyElement.parent().addClass(l.className),null===l.currentTop?l.stickyElement.trigger("sticky-start",[l]):l.stickyElement.trigger("sticky-update",[l]),l.currentTop===l.topSpacing&&l.currentTop>g||null===l.currentTop&&g<l.topSpacing?l.stickyElement.trigger("sticky-bottom-reached",[l]):null!==l.currentTop&&g===l.topSpacing&&l.currentTop<g&&l.stickyElement.trigger("sticky-bottom-unreached",[l]),l.currentTop=g;var m=l.stickyWrapper.parent();l.stickyElement.offset().top+l.stickyElement.outerHeight()>=m.offset().top+m.outerHeight()&&l.stickyElement.offset().top<=l.topSpacing?l.stickyElement.css("position","absolute").css("top","").css("bottom",0).css("z-index",""):l.stickyElement.css("position","fixed").css("top",g).css("bottom","").css("z-index",l.zIndex)}}},p=function(){c=r.height();for(var e=0,i=o.length;e<i;e++){var n=o[e],s=null;n.getWidthFrom?n.responsiveWidth&&(s=t(n.getWidthFrom).width()):n.widthFromWrapper&&(s=n.stickyWrapper.width()),null!=s&&n.stickyElement.css("width",s)}},d={init:function(e){return this.each((function(){var i=t.extend({},n,e),r=t(this),s=r.attr("id"),c=s?s+"-"+n.wrapperClassName:n.wrapperClassName,a=t("<div></div>").attr("id",c).addClass(i.wrapperClassName);r.wrapAll((function(){if(0==t(this).parent("#"+c).length)return a}));var p=r.parent();i.center&&p.css({width:r.outerWidth(),marginLeft:"auto",marginRight:"auto"}),"right"===r.css("float")&&r.css({float:"none"}).parent().css({float:"right"}),i.stickyElement=r,i.stickyWrapper=p,i.currentTop=null,o.push(i),d.setWrapperHeight(this),d.setupChangeListeners(this)}))},setWrapperHeight:function(e){var i=t(e),n=i.parent();n&&n.css("height",i.outerHeight())},setupChangeListeners:function(t){window.MutationObserver?new window.MutationObserver((function(e){(e[0].addedNodes.length||e[0].removedNodes.length)&&d.setWrapperHeight(t)})).observe(t,{subtree:!0,childList:!0}):window.addEventListener?(t.addEventListener("DOMNodeInserted",(function(){d.setWrapperHeight(t)}),!1),t.addEventListener("DOMNodeRemoved",(function(){d.setWrapperHeight(t)}),!1)):window.attachEvent&&(t.attachEvent("onDOMNodeInserted",(function(){d.setWrapperHeight(t)})),t.attachEvent("onDOMNodeRemoved",(function(){d.setWrapperHeight(t)})))},update:a,unstick:function(e){return this.each((function(){for(var e=t(this),n=-1,r=o.length;r-- >0;)o[r].stickyElement.get(0)===this&&(i.call(o,r,1),n=r);-1!==n&&(e.unwrap(),e.css({width:"",position:"",top:"",float:"","z-index":""}))}))}};window.addEventListener?(window.addEventListener("scroll",a,!1),window.addEventListener("resize",p,!1)):window.attachEvent&&(window.attachEvent("onscroll",a),window.attachEvent("onresize",p)),t.fn.sticky=function(i){return d[i]?d[i].apply(this,e.call(arguments,1)):"object"!=typeof i&&i?void t.error("Method "+i+" does not exist on jQuery.sticky"):d.init.apply(this,arguments)},t.fn.unstick=function(i){return d[i]?d[i].apply(this,e.call(arguments,1)):"object"!=typeof i&&i?void t.error("Method "+i+" does not exist on jQuery.sticky"):d.unstick.apply(this,arguments)},t((function(){setTimeout(a,0)}))}));
!function(t,i,s,o){"use strict";var n="newsTicker",e={row_height:20,max_rows:3,speed:400,duration:2500,direction:"up",autostart:1,pauseOnHover:1,nextButton:null,prevButton:null,startButton:null,stopButton:null,hasMoved:function(){},movingUp:function(){},movingDown:function(){},start:function(){},stop:function(){},pause:function(){},unpause:function(){}};function h(i,s){this.element=i,this.$el=t(i),this.options=t.extend({},e,s),this._defaults=e,this._name=n,this.moveInterval,this.state=0,this.paused=0,this.moving=0,this.$el.is("ul, ol")&&this.init()}h.prototype={init:function(){this.$el.height(this.options.row_height*this.options.max_rows).css({overflow:"hidden"}),this.checkSpeed(),this.options.nextButton&&void 0!==this.options.nextButton[0]&&this.options.nextButton.click(function(t){this.moveNext(),this.resetInterval()}.bind(this)),this.options.prevButton&&void 0!==this.options.prevButton[0]&&this.options.prevButton.click(function(t){this.movePrev(),this.resetInterval()}.bind(this)),this.options.stopButton&&void 0!==this.options.stopButton[0]&&this.options.stopButton.click(function(t){this.stop()}.bind(this)),this.options.startButton&&void 0!==this.options.startButton[0]&&this.options.startButton.click(function(t){this.start()}.bind(this)),this.options.pauseOnHover&&this.$el.hover(function(){this.state&&this.pause()}.bind(this),function(){this.state&&this.unpause()}.bind(this)),this.options.autostart&&this.start()},start:function(){this.state||(this.state=1,this.resetInterval(),this.options.start())},stop:function(){this.state&&(clearInterval(this.moveInterval),this.state=0,this.options.stop())},resetInterval:function(){this.state&&(clearInterval(this.moveInterval),this.moveInterval=setInterval(function(){this.move()}.bind(this),this.options.duration))},move:function(){this.paused||this.moveNext()},moveNext:function(){"down"===this.options.direction?this.moveDown():"up"===this.options.direction&&this.moveUp()},movePrev:function(){"down"===this.options.direction?this.moveUp():"up"===this.options.direction&&this.moveDown()},pause:function(){this.paused||(this.paused=1),this.options.pause()},unpause:function(){this.paused&&(this.paused=0),this.options.unpause()},moveDown:function(){this.moving||(this.moving=1,this.options.movingDown(),this.$el.children("li:last").detach().prependTo(this.$el).css("marginTop","-"+this.options.row_height+"px").animate({marginTop:"0px"},this.options.speed,function(){this.moving=0,this.options.hasMoved()}.bind(this)))},moveUp:function(){if(!this.moving){this.moving=1,this.options.movingUp();var t=this.$el.children("li:first");t.animate({marginTop:"-"+this.options.row_height+"px"},this.options.speed,function(){t.detach().css("marginTop","0").appendTo(this.$el),this.moving=0,this.options.hasMoved()}.bind(this))}},updateOption:function(t,i){void 0!==this.options[t]&&(this.options[t]=i,"duration"!=t&&"speed"!=t||(this.checkSpeed(),this.resetInterval()))},add:function(i){this.$el.append(t("<li>").html(i))},getState:function(){return paused?2:this.state},checkSpeed:function(){this.options.duration<this.options.speed+25&&(this.options.speed=this.options.duration-25)},destroy:function(){this._destroy()}},t.fn[n]=function(i){var s=arguments;return this.each((function(){var o=t(this),e=t.data(this,"plugin_"+n),p="object"==typeof i&&i;e||o.data("plugin_"+n,e=new h(this,p)),"string"==typeof i&&e[i].apply(e,Array.prototype.slice.call(s,1))}))}}(jQuery,window,document);
!(function (e) {
	'function' == typeof define && define.amd
		? define(['jquery'], e)
		: 'object' == typeof exports
			? e(require('jquery'))
			: e(window.jQuery || window.Zepto);
})(function (c) {
	function e() {}
	function d(e, t) {
		m.ev.on(x + e + I, t);
	}
	function p(e, t, n, o) {
		var i = document.createElement('div');
		return (
			(i.className = 'mfp-' + e),
			n && (i.innerHTML = n),
			o ? t && t.appendChild(i) : ((i = c(i)), t && i.appendTo(t)),
			i
		);
	}
	function u(e, t) {
		m.ev.triggerHandler(x + e, t),
			m.st.callbacks &&
				((e = e.charAt(0).toLowerCase() + e.slice(1)), m.st.callbacks[e]) &&
				m.st.callbacks[e].apply(m, Array.isArray(t) ? t : [t]);
	}
	function f(e) {
		return (
			(e === A && m.currTemplate.closeBtn) ||
				((m.currTemplate.closeBtn = c(
					m.st.closeMarkup.replace('%title%', m.st.tClose),
				)),
				(A = e)),
			m.currTemplate.closeBtn
		);
	}
	function r() {
		c.magnificPopup.instance ||
			((m = new e()).init(), (c.magnificPopup.instance = m));
	}
	function a() {
		y && (v.after(y.addClass(l)).detach(), (y = null));
	}
	function i() {
		n && c(document.body).removeClass(n);
	}
	function t() {
		i(), m.req && m.req.abort();
	}
	var m,
		o,
		g,
		s,
		h,
		A,
		l,
		v,
		y,
		n,
		w = 'Close',
		F = 'BeforeClose',
		C = 'MarkupParse',
		b = 'Open',
		j = 'Change',
		x = 'mfp',
		I = '.' + x,
		T = 'mfp-ready',
		N = 'mfp-removing',
		k = 'mfp-prevent-close',
		P = !!window.jQuery,
		_ = c(window),
		S =
			((c.magnificPopup = {
				instance: null,
				proto: (e.prototype = {
					constructor: e,
					init: function () {
						var e = navigator.appVersion;
						(m.isLowIE = m.isIE8 = document.all && !document.addEventListener),
							(m.isAndroid = /android/gi.test(e)),
							(m.isIOS = /iphone|ipad|ipod/gi.test(e)),
							(m.supportsTransition = (function () {
								var e = document.createElement('p').style,
									t = ['ms', 'O', 'Moz', 'Webkit'];
								if (void 0 !== e.transition) return !0;
								for (; t.length; ) if (t.pop() + 'Transition' in e) return !0;
								return !1;
							})()),
							(m.probablyMobile =
								m.isAndroid ||
								m.isIOS ||
								/(Opera Mini)|Kindle|webOS|BlackBerry|(Opera Mobi)|(Windows Phone)|IEMobile/i.test(
									navigator.userAgent,
								)),
							(g = c(document)),
							(m.popupsCache = {});
					},
					open: function (e) {
						if (!1 === e.isObj) {
							(m.items = e.items.toArray()), (m.index = 0);
							for (var t, n = e.items, o = 0; o < n.length; o++)
								if ((t = (t = n[o]).parsed ? t.el[0] : t) === e.el[0]) {
									m.index = o;
									break;
								}
						} else
							(m.items = Array.isArray(e.items) ? e.items : [e.items]),
								(m.index = e.index || 0);
						if (!m.isOpen) {
							(m.types = []),
								(h = ''),
								e.mainEl && e.mainEl.length
									? (m.ev = e.mainEl.eq(0))
									: (m.ev = g),
								e.key
									? (m.popupsCache[e.key] || (m.popupsCache[e.key] = {}),
										(m.currTemplate = m.popupsCache[e.key]))
									: (m.currTemplate = {}),
								(m.st = c.extend(!0, {}, c.magnificPopup.defaults, e)),
								(m.fixedContentPos =
									'auto' === m.st.fixedContentPos
										? !m.probablyMobile
										: m.st.fixedContentPos),
								m.st.modal &&
									((m.st.closeOnContentClick = !1),
									(m.st.closeOnBgClick = !1),
									(m.st.showCloseBtn = !1),
									(m.st.enableEscapeKey = !1)),
								m.bgOverlay ||
									((m.bgOverlay = p('bg').on('click' + I, function () {
										m.close();
									})),
									(m.wrap = p('wrap')
										.attr('tabindex', -1)
										.on('click' + I, function (e) {
											m._checkIfClose(e.target) && m.close();
										})),
									(m.container = p('container', m.wrap))),
								(m.contentContainer = p('content')),
								m.st.preloader &&
									(m.preloader = p('preloader', m.container, m.st.tLoading));
							var i = c.magnificPopup.modules;
							for (o = 0; o < i.length; o++) {
								var r = (r = i[o]).charAt(0).toUpperCase() + r.slice(1);
								m['init' + r].call(m);
							}
							u('BeforeOpen'),
								m.st.showCloseBtn &&
									(m.st.closeBtnInside
										? (d(C, function (e, t, n, o) {
												n.close_replaceWith = f(o.type);
											}),
											(h += ' mfp-close-btn-in'))
										: m.wrap.append(f())),
								m.st.alignTop && (h += ' mfp-align-top'),
								m.fixedContentPos
									? m.wrap.css({
											overflow: m.st.overflowY,
											overflowX: 'hidden',
											overflowY: m.st.overflowY,
										})
									: m.wrap.css({ top: _.scrollTop(), position: 'absolute' }),
								(!1 !== m.st.fixedBgPos &&
									('auto' !== m.st.fixedBgPos || m.fixedContentPos)) ||
									m.bgOverlay.css({ height: g.height(), position: 'absolute' }),
								m.st.enableEscapeKey &&
									g.on('keyup' + I, function (e) {
										27 === e.keyCode && m.close();
									}),
								_.on('resize' + I, function () {
									m.updateSize();
								}),
								m.st.closeOnContentClick || (h += ' mfp-auto-cursor'),
								h && m.wrap.addClass(h);
							var a = (m.wH = _.height()),
								s = {},
								l =
									(m.fixedContentPos &&
										m._hasScrollBar(a) &&
										(l = m._getScrollbarSize()) &&
										(s.marginRight = l),
									m.fixedContentPos &&
										(m.isIE7
											? c('body, html').css('overflow', 'hidden')
											: (s.overflow = 'hidden')),
									m.st.mainClass);
							return (
								m.isIE7 && (l += ' mfp-ie7'),
								l && m._addClassToMFP(l),
								m.updateItemHTML(),
								u('BuildControls'),
								c('html').css(s),
								m.bgOverlay
									.add(m.wrap)
									.prependTo(m.st.prependTo || c(document.body)),
								(m._lastFocusedEl = document.activeElement),
								setTimeout(function () {
									m.content
										? (m._addClassToMFP(T), m._setFocus())
										: m.bgOverlay.addClass(T),
										g.on('focusin' + I, m._onFocusIn);
								}, 16),
								(m.isOpen = !0),
								m.updateSize(a),
								u(b),
								e
							);
						}
						m.updateItemHTML();
					},
					close: function () {
						m.isOpen &&
							(u(F),
							(m.isOpen = !1),
							m.st.removalDelay && !m.isLowIE && m.supportsTransition
								? (m._addClassToMFP(N),
									setTimeout(function () {
										m._close();
									}, m.st.removalDelay))
								: m._close());
					},
					_close: function () {
						u(w);
						var e = N + ' ' + T + ' ';
						m.bgOverlay.detach(),
							m.wrap.detach(),
							m.container.empty(),
							m.st.mainClass && (e += m.st.mainClass + ' '),
							m._removeClassFromMFP(e),
							m.fixedContentPos &&
								((e = { marginRight: '' }),
								m.isIE7
									? c('body, html').css('overflow', '')
									: (e.overflow = ''),
								c('html').css(e)),
							g.off('keyup.mfp focusin' + I),
							m.ev.off(I),
							m.wrap.attr('class', 'mfp-wrap').removeAttr('style'),
							m.bgOverlay.attr('class', 'mfp-bg'),
							m.container.attr('class', 'mfp-container'),
							!m.st.showCloseBtn ||
								(m.st.closeBtnInside &&
									!0 !== m.currTemplate[m.currItem.type]) ||
								(m.currTemplate.closeBtn && m.currTemplate.closeBtn.detach()),
							m.st.autoFocusLast &&
								m._lastFocusedEl &&
								c(m._lastFocusedEl).trigger('focus'),
							(m.currItem = null),
							(m.content = null),
							(m.currTemplate = null),
							(m.prevHeight = 0),
							u('AfterClose');
					},
					updateSize: function (e) {
						var t;
						m.isIOS
							? ((t = document.documentElement.clientWidth / window.innerWidth),
								(t = window.innerHeight * t),
								m.wrap.css('height', t),
								(m.wH = t))
							: (m.wH = e || _.height()),
							m.fixedContentPos || m.wrap.css('height', m.wH),
							u('Resize');
					},
					updateItemHTML: function () {
						var e = m.items[m.index],
							t =
								(m.contentContainer.detach(),
								m.content && m.content.detach(),
								(e = e.parsed ? e : m.parseEl(m.index)).type),
							n =
								(u('BeforeChange', [m.currItem ? m.currItem.type : '', t]),
								(m.currItem = e),
								m.currTemplate[t] ||
									((n = !!m.st[t] && m.st[t].markup),
									u('FirstMarkupParse', n),
									(m.currTemplate[t] = !n || c(n))),
								s &&
									s !== e.type &&
									m.container.removeClass('mfp-' + s + '-holder'),
								m['get' + t.charAt(0).toUpperCase() + t.slice(1)](
									e,
									m.currTemplate[t],
								));
						m.appendContent(n, t),
							(e.preloaded = !0),
							u(j, e),
							(s = e.type),
							m.container.prepend(m.contentContainer),
							u('AfterChange');
					},
					appendContent: function (e, t) {
						(m.content = e)
							? m.st.showCloseBtn &&
								m.st.closeBtnInside &&
								!0 === m.currTemplate[t]
								? m.content.find('.mfp-close').length || m.content.append(f())
								: (m.content = e)
							: (m.content = ''),
							u('BeforeAppend'),
							m.container.addClass('mfp-' + t + '-holder'),
							m.contentContainer.append(m.content);
					},
					parseEl: function (e) {
						var t,
							n = m.items[e];
						if (
							(n = n.tagName
								? { el: c(n) }
								: ((t = n.type), { data: n, src: n.src })).el
						) {
							for (var o = m.types, i = 0; i < o.length; i++)
								if (n.el.hasClass('mfp-' + o[i])) {
									t = o[i];
									break;
								}
							(n.src = n.el.attr('data-mfp-src')),
								n.src || (n.src = n.el.attr('href'));
						}
						return (
							(n.type = t || m.st.type || 'inline'),
							(n.index = e),
							(n.parsed = !0),
							(m.items[e] = n),
							u('ElementParse', n),
							m.items[e]
						);
					},
					addGroup: function (t, n) {
						function e(e) {
							(e.mfpEl = this), m._openClick(e, t, n);
						}
						var o = 'click.magnificPopup';
						((n = n || {}).mainEl = t),
							n.items
								? ((n.isObj = !0), t.off(o).on(o, e))
								: ((n.isObj = !1),
									n.delegate
										? t.off(o).on(o, n.delegate, e)
										: (n.items = t).off(o).on(o, e));
					},
					_openClick: function (e, t, n) {
						var o = (void 0 !== n.midClick ? n : c.magnificPopup.defaults)
							.midClick;
						if (
							o ||
							!(
								2 === e.which ||
								e.ctrlKey ||
								e.metaKey ||
								e.altKey ||
								e.shiftKey
							)
						) {
							o = (void 0 !== n.disableOn ? n : c.magnificPopup.defaults)
								.disableOn;
							if (o)
								if ('function' == typeof o) {
									if (!o.call(m)) return !0;
								} else if (_.width() < o) return !0;
							e.type && (e.preventDefault(), m.isOpen) && e.stopPropagation(),
								(n.el = c(e.mfpEl)),
								n.delegate && (n.items = t.find(n.delegate)),
								m.open(n);
						}
					},
					updateStatus: function (e, t) {
						var n;
						m.preloader &&
							(o !== e && m.container.removeClass('mfp-s-' + o),
							(n = {
								status: e,
								text: (t = t || 'loading' !== e ? t : m.st.tLoading),
							}),
							u('UpdateStatus', n),
							(e = n.status),
							(t = n.text),
							m.st.allowHTMLInStatusIndicator
								? m.preloader.html(t)
								: m.preloader.text(t),
							m.preloader.find('a').on('click', function (e) {
								e.stopImmediatePropagation();
							}),
							m.container.addClass('mfp-s-' + e),
							(o = e));
					},
					_checkIfClose: function (e) {
						if (!c(e).closest('.' + k).length) {
							var t = m.st.closeOnContentClick,
								n = m.st.closeOnBgClick;
							if (t && n) return !0;
							if (
								!m.content ||
								c(e).closest('.mfp-close').length ||
								(m.preloader && e === m.preloader[0])
							)
								return !0;
							if (e === m.content[0] || c.contains(m.content[0], e)) {
								if (t) return !0;
							} else if (n && c.contains(document, e)) return !0;
							return !1;
						}
					},
					_addClassToMFP: function (e) {
						m.bgOverlay.addClass(e), m.wrap.addClass(e);
					},
					_removeClassFromMFP: function (e) {
						this.bgOverlay.removeClass(e), m.wrap.removeClass(e);
					},
					_hasScrollBar: function (e) {
						return (
							(m.isIE7 ? g.height() : document.body.scrollHeight) >
							(e || _.height())
						);
					},
					_setFocus: function () {
						(m.st.focus ? m.content.find(m.st.focus).eq(0) : m.wrap).trigger(
							'focus',
						);
					},
					_onFocusIn: function (e) {
						if (e.target !== m.wrap[0] && !c.contains(m.wrap[0], e.target))
							return m._setFocus(), !1;
					},
					_parseMarkup: function (i, e, t) {
						var r;
						t.data && (e = c.extend(t.data, e)),
							u(C, [i, e, t]),
							c.each(e, function (e, t) {
								if (void 0 === t || !1 === t) return !0;
								var n, o;
								1 < (r = e.split('_')).length
									? 0 < (n = i.find(I + '-' + r[0])).length &&
										('replaceWith' === (o = r[1])
											? n[0] !== t[0] && n.replaceWith(t)
											: 'img' === o
												? n.is('img')
													? n.attr('src', t)
													: n.replaceWith(
															c('<img>')
																.attr('src', t)
																.attr('class', n.attr('class')),
														)
												: n.attr(r[1], t))
									: m.st.allowHTMLInTemplate
										? i.find(I + '-' + e).html(t)
										: i.find(I + '-' + e).text(t);
							});
					},
					_getScrollbarSize: function () {
						var e;
						return (
							void 0 === m.scrollbarSize &&
								(((e = document.createElement('div')).style.cssText =
									'width: 99px; height: 99px; overflow: scroll; position: absolute; top: -9999px;'),
								document.body.appendChild(e),
								(m.scrollbarSize = e.offsetWidth - e.clientWidth),
								document.body.removeChild(e)),
							m.scrollbarSize
						);
					},
				}),
				modules: [],
				open: function (e, t) {
					return (
						r(),
						((e = e ? c.extend(!0, {}, e) : {}).isObj = !0),
						(e.index = t || 0),
						this.instance.open(e)
					);
				},
				close: function () {
					return c.magnificPopup.instance && c.magnificPopup.instance.close();
				},
				registerModule: function (e, t) {
					t.options && (c.magnificPopup.defaults[e] = t.options),
						c.extend(this.proto, t.proto),
						this.modules.push(e);
				},
				defaults: {
					disableOn: 0,
					key: null,
					midClick: !1,
					mainClass: '',
					preloader: !0,
					focus: '',
					closeOnContentClick: !1,
					closeOnBgClick: !0,
					closeBtnInside: !0,
					showCloseBtn: !0,
					enableEscapeKey: !0,
					modal: !1,
					alignTop: !1,
					removalDelay: 0,
					prependTo: null,
					fixedContentPos: 'auto',
					fixedBgPos: 'auto',
					overflowY: 'auto',
					closeMarkup:
						'<button title="%title%" type="button" class="mfp-close">&#215;</button>',
					tClose: 'Close (Esc)',
					tLoading: 'Loading...',
					autoFocusLast: !0,
					allowHTMLInStatusIndicator: !1,
					allowHTMLInTemplate: !1,
				},
			}),
			(c.fn.magnificPopup = function (e) {
				r();
				var t,
					n,
					o,
					i = c(this);
				return (
					'string' == typeof e
						? 'open' === e
							? ((t = P ? i.data('magnificPopup') : i[0].magnificPopup),
								(n = parseInt(arguments[1], 10) || 0),
								(o = t.items
									? t.items[n]
									: ((o = i), (o = t.delegate ? o.find(t.delegate) : o).eq(n))),
								m._openClick({ mfpEl: o }, i, t))
							: m.isOpen &&
								m[e].apply(m, Array.prototype.slice.call(arguments, 1))
						: ((e = c.extend(!0, {}, e)),
							P ? i.data('magnificPopup', e) : (i[0].magnificPopup = e),
							m.addGroup(i, e)),
					i
				);
			}),
			'inline'),
		E =
			(c.magnificPopup.registerModule(S, {
				options: {
					hiddenClass: 'hide',
					markup: '',
					tNotFound: 'Content not found',
				},
				proto: {
					initInline: function () {
						m.types.push(S),
							d(w + '.' + S, function () {
								a();
							});
					},
					getInline: function (e, t) {
						var n, o, i;
						return (
							a(),
							e.src
								? ((n = m.st.inline),
									(o = c(e.src)).length
										? ((i = o[0].parentNode) &&
												i.tagName &&
												(v ||
													((l = n.hiddenClass), (v = p(l)), (l = 'mfp-' + l)),
												(y = o.after(v).detach().removeClass(l))),
											m.updateStatus('ready'))
										: (m.updateStatus('error', n.tNotFound), (o = c('<div>'))),
									(e.inlineElement = o))
								: (m.updateStatus('ready'), m._parseMarkup(t, {}, e), t)
						);
					},
				},
			}),
			'ajax');
	c.magnificPopup.registerModule(E, {
		options: {
			settings: null,
			cursor: 'mfp-ajax-cur',
			tError: 'The content could not be loaded.',
		},
		proto: {
			initAjax: function () {
				m.types.push(E),
					(n = m.st.ajax.cursor),
					d(w + '.' + E, t),
					d('BeforeChange.' + E, t);
			},
			getAjax: function (o) {
				n && c(document.body).addClass(n), m.updateStatus('loading');
				var e = c.extend(
					{
						url: o.src,
						success: function (e, t, n) {
							e = { data: e, xhr: n };
							u('ParseAjax', e),
								m.appendContent(c(e.data), E),
								(o.finished = !0),
								i(),
								m._setFocus(),
								setTimeout(function () {
									m.wrap.addClass(T);
								}, 16),
								m.updateStatus('ready'),
								u('AjaxContentAdded');
						},
						error: function () {
							i(),
								(o.finished = o.loadError = !0),
								m.updateStatus(
									'error',
									m.st.ajax.tError.replace('%url%', o.src),
								);
						},
					},
					m.st.ajax.settings,
				);
				return (m.req = c.ajax(e)), '';
			},
		},
	});
	var z;
	c.magnificPopup.registerModule('image', {
		options: {
			markup:
				'<div class="mfp-figure"><div class="mfp-close"></div><figure><div class="mfp-img"></div><figcaption><div class="mfp-bottom-bar"><div class="mfp-title"></div><div class="mfp-counter"></div></div></figcaption></figure></div>',
			cursor: 'mfp-zoom-out-cur',
			titleSrc: 'title',
			verticalFit: !0,
			tError: 'The image could not be loaded.',
		},
		proto: {
			initImage: function () {
				var e = m.st.image,
					t = '.image';
				m.types.push('image'),
					d(b + t, function () {
						'image' === m.currItem.type &&
							e.cursor &&
							c(document.body).addClass(e.cursor);
					}),
					d(w + t, function () {
						e.cursor && c(document.body).removeClass(e.cursor),
							_.off('resize' + I);
					}),
					d('Resize' + t, m.resizeImage),
					m.isLowIE && d('AfterChange', m.resizeImage);
			},
			resizeImage: function () {
				var e,
					t = m.currItem;
				t &&
					t.img &&
					m.st.image.verticalFit &&
					((e = 0),
					m.isLowIE &&
						(e =
							parseInt(t.img.css('padding-top'), 10) +
							parseInt(t.img.css('padding-bottom'), 10)),
					t.img.css('max-height', m.wH - e));
			},
			_onImageHasSize: function (e) {
				e.img &&
					((e.hasSize = !0),
					z && clearInterval(z),
					(e.isCheckingImgSize = !1),
					u('ImageHasSize', e),
					e.imgHidden) &&
					(m.content && m.content.removeClass('mfp-loading'),
					(e.imgHidden = !1));
			},
			findImageSize: function (t) {
				function n(e) {
					z && clearInterval(z),
						(z = setInterval(function () {
							0 < i.naturalWidth
								? m._onImageHasSize(t)
								: (200 < o && clearInterval(z),
									3 === ++o ? n(10) : 40 === o ? n(50) : 100 === o && n(500));
						}, e));
				}
				var o = 0,
					i = t.img[0];
				n(1);
			},
			getImage: function (e, t) {
				function n() {
					e &&
						(e.img.off('.mfploader'),
						e === m.currItem &&
							(m._onImageHasSize(e),
							m.updateStatus('error', a.tError.replace('%url%', e.src))),
						(e.hasSize = !0),
						(e.loaded = !0),
						(e.loadError = !0));
				}
				function o() {
					e &&
						(e.img[0].complete
							? (e.img.off('.mfploader'),
								e === m.currItem &&
									(m._onImageHasSize(e), m.updateStatus('ready')),
								(e.hasSize = !0),
								(e.loaded = !0),
								u('ImageLoadComplete'))
							: ++r < 200
								? setTimeout(o, 100)
								: n());
				}
				var i,
					r = 0,
					a = m.st.image,
					s = t.find('.mfp-img');
				return (
					s.length &&
						(((i = document.createElement('img')).className = 'mfp-img'),
						e.el &&
							e.el.find('img').length &&
							(i.alt = e.el.find('img').attr('alt')),
						(e.img = c(i).on('load.mfploader', o).on('error.mfploader', n)),
						(i.src = e.src),
						s.is('img') && (e.img = e.img.clone()),
						0 < (i = e.img[0]).naturalWidth
							? (e.hasSize = !0)
							: i.width || (e.hasSize = !1)),
					m._parseMarkup(
						t,
						{
							title: (function (e) {
								if (e.data && void 0 !== e.data.title) return e.data.title;
								var t = m.st.image.titleSrc;
								if (t) {
									if ('function' == typeof t) return t.call(m, e);
									if (e.el) return e.el.attr(t) || '';
								}
								return '';
							})(e),
							img_replaceWith: e.img,
						},
						e,
					),
					m.resizeImage(),
					e.hasSize
						? (z && clearInterval(z),
							e.loadError
								? (t.addClass('mfp-loading'),
									m.updateStatus('error', a.tError.replace('%url%', e.src)))
								: (t.removeClass('mfp-loading'), m.updateStatus('ready')))
						: (m.updateStatus('loading'),
							(e.loading = !0),
							e.hasSize ||
								((e.imgHidden = !0),
								t.addClass('mfp-loading'),
								m.findImageSize(e))),
					t
				);
			},
		},
	});
	function O(e) {
		var t;
		m.currTemplate[L] &&
			(t = m.currTemplate[L].find('iframe')).length &&
			(e || (t[0].src = '//about:blank'), m.isIE8) &&
			t.css('display', e ? 'block' : 'none');
	}
	function M(e) {
		var t = m.items.length;
		return t - 1 < e ? e - t : e < 0 ? t + e : e;
	}
	function D(e, t, n) {
		return e.replace(/%curr%/gi, t + 1).replace(/%total%/gi, n);
	}
	c.magnificPopup.registerModule('zoom', {
		options: {
			enabled: !1,
			easing: 'ease-in-out',
			duration: 300,
			opener: function (e) {
				return e.is('img') ? e : e.find('img');
			},
		},
		proto: {
			initZoom: function () {
				var e,
					t,
					n,
					o,
					i,
					r,
					a = m.st.zoom,
					s = '.zoom';
				a.enabled &&
					m.supportsTransition &&
					((t = a.duration),
					(n = function (e) {
						var e = e
								.clone()
								.removeAttr('style')
								.removeAttr('class')
								.addClass('mfp-animated-image'),
							t = 'all ' + a.duration / 1e3 + 's ' + a.easing,
							n = {
								position: 'fixed',
								zIndex: 9999,
								left: 0,
								top: 0,
								'-webkit-backface-visibility': 'hidden',
							},
							o = 'transition';
						return (
							(n['-webkit-' + o] = n['-moz-' + o] = n['-o-' + o] = n[o] = t),
							e.css(n),
							e
						);
					}),
					(o = function () {
						m.content.css('visibility', 'visible');
					}),
					d('BuildControls' + s, function () {
						m._allowZoom() &&
							(clearTimeout(i),
							m.content.css('visibility', 'hidden'),
							(e = m._getItemToZoom())
								? ((r = n(e)).css(m._getOffset()),
									m.wrap.append(r),
									(i = setTimeout(function () {
										r.css(m._getOffset(!0)),
											(i = setTimeout(function () {
												o(),
													setTimeout(function () {
														r.remove(), (e = r = null), u('ZoomAnimationEnded');
													}, 16);
											}, t));
									}, 16)))
								: o());
					}),
					d(F + s, function () {
						if (m._allowZoom()) {
							if ((clearTimeout(i), (m.st.removalDelay = t), !e)) {
								if (!(e = m._getItemToZoom())) return;
								r = n(e);
							}
							r.css(m._getOffset(!0)),
								m.wrap.append(r),
								m.content.css('visibility', 'hidden'),
								setTimeout(function () {
									r.css(m._getOffset());
								}, 16);
						}
					}),
					d(w + s, function () {
						m._allowZoom() && (o(), r && r.remove(), (e = null));
					}));
			},
			_allowZoom: function () {
				return 'image' === m.currItem.type;
			},
			_getItemToZoom: function () {
				return !!m.currItem.hasSize && m.currItem.img;
			},
			_getOffset: function (e) {
				var e = e
						? m.currItem.img
						: m.st.zoom.opener(m.currItem.el || m.currItem),
					t = e.offset(),
					n = parseInt(e.css('padding-top'), 10),
					o = parseInt(e.css('padding-bottom'), 10),
					e =
						((t.top -= c(window).scrollTop() - n),
						{
							width: e.width(),
							height: (P ? e.innerHeight() : e[0].offsetHeight) - o - n,
						});
				return (
					(B =
						void 0 === B
							? void 0 !== document.createElement('p').style.MozTransform
							: B)
						? (e['-moz-transform'] = e.transform =
								'translate(' + t.left + 'px,' + t.top + 'px)')
						: ((e.left = t.left), (e.top = t.top)),
					e
				);
			},
		},
	});
	var B,
		L = 'iframe',
		H =
			(c.magnificPopup.registerModule(L, {
				options: {
					markup:
						'<div class="mfp-iframe-scaler"><div class="mfp-close"></div><iframe class="mfp-iframe" src="//about:blank" frameborder="0" allowfullscreen></iframe></div>',
					srcAction: 'iframe_src',
					patterns: {
						youtube: {
							index: 'youtube.com',
							id: 'v=',
							src: '//www.youtube.com/embed/%id%?autoplay=1',
						},
						vimeo: {
							index: 'vimeo.com/',
							id: '/',
							src: '//player.vimeo.com/video/%id%?autoplay=1',
						},
						gmaps: { index: '//maps.google.', src: '%id%&output=embed' },
					},
				},
				proto: {
					initIframe: function () {
						m.types.push(L),
							d('BeforeChange', function (e, t, n) {
								t !== n && (t === L ? O() : n === L && O(!0));
							}),
							d(w + '.' + L, function () {
								O();
							});
					},
					getIframe: function (e, t) {
						var n = e.src,
							o = m.st.iframe,
							i =
								(c.each(o.patterns, function () {
									if (-1 < n.indexOf(this.index))
										return (
											this.id &&
												(n =
													'string' == typeof this.id
														? n.substr(
																n.lastIndexOf(this.id) + this.id.length,
																n.length,
															)
														: this.id.call(this, n)),
											(n = this.src.replace('%id%', n)),
											!1
										);
								}),
								{});
						return (
							o.srcAction && (i[o.srcAction] = n),
							m._parseMarkup(t, i, e),
							m.updateStatus('ready'),
							t
						);
					},
				},
			}),
			c.magnificPopup.registerModule('gallery', {
				options: {
					enabled: !1,
					arrowMarkup:
						'<button title="%title%" type="button" class="mfp-arrow mfp-arrow-%dir%"></button>',
					preload: [0, 2],
					navigateByImgClick: !0,
					arrows: !0,
					tPrev: 'Previous (Left arrow key)',
					tNext: 'Next (Right arrow key)',
					tCounter: '%curr% of %total%',
					langDir: null,
					loop: !0,
				},
				proto: {
					initGallery: function () {
						var r = m.st.gallery,
							e = '.mfp-gallery';
						if (((m.direction = !0), !r || !r.enabled)) return !1;
						r.langDir || (r.langDir = document.dir || 'ltr'),
							(h += ' mfp-gallery'),
							d(b + e, function () {
								r.navigateByImgClick &&
									m.wrap.on('click' + e, '.mfp-img', function () {
										if (1 < m.items.length) return m.next(), !1;
									}),
									g.on('keydown' + e, function (e) {
										37 === e.keyCode
											? 'rtl' === r.langDir
												? m.next()
												: m.prev()
											: 39 === e.keyCode &&
												('rtl' === r.langDir ? m.prev() : m.next());
									}),
									m.updateGalleryButtons();
							}),
							d('UpdateStatus' + e, function () {
								m.updateGalleryButtons();
							}),
							d('UpdateStatus' + e, function (e, t) {
								t.text &&
									(t.text = D(t.text, m.currItem.index, m.items.length));
							}),
							d(C + e, function (e, t, n, o) {
								var i = m.items.length;
								n.counter = 1 < i ? D(r.tCounter, o.index, i) : '';
							}),
							d('BuildControls' + e, function () {
								var e, t, n, o, i;
								1 < m.items.length &&
									r.arrows &&
									!m.arrowLeft &&
									((t =
										'rtl' === r.langDir
											? ((o = r.tNext), (e = r.tPrev), (i = 'next'), 'prev')
											: ((o = r.tPrev), (e = r.tNext), (i = 'prev'), 'next')),
									(n = r.arrowMarkup),
									(o = m.arrowLeft =
										c(
											n
												.replace(/%title%/gi, o)
												.replace(/%action%/gi, i)
												.replace(/%dir%/gi, 'left'),
										).addClass(k)),
									(i = m.arrowRight =
										c(
											n
												.replace(/%title%/gi, e)
												.replace(/%action%/gi, t)
												.replace(/%dir%/gi, 'right'),
										).addClass(k)),
									'rtl' === r.langDir
										? ((m.arrowNext = o), (m.arrowPrev = i))
										: ((m.arrowNext = i), (m.arrowPrev = o)),
									o.on('click', function () {
										'rtl' === r.langDir ? m.next() : m.prev();
									}),
									i.on('click', function () {
										'rtl' === r.langDir ? m.prev() : m.next();
									}),
									m.container.append(o.add(i)));
							}),
							d(j + e, function () {
								m._preloadTimeout && clearTimeout(m._preloadTimeout),
									(m._preloadTimeout = setTimeout(function () {
										m.preloadNearbyImages(), (m._preloadTimeout = null);
									}, 16));
							}),
							d(w + e, function () {
								g.off(e),
									m.wrap.off('click' + e),
									(m.arrowRight = m.arrowLeft = null);
							});
					},
					next: function () {
						var e = M(m.index + 1);
						if (!m.st.gallery.loop && 0 === e) return !1;
						(m.direction = !0), (m.index = e), m.updateItemHTML();
					},
					prev: function () {
						var e = m.index - 1;
						if (!m.st.gallery.loop && e < 0) return !1;
						(m.direction = !1), (m.index = M(e)), m.updateItemHTML();
					},
					goTo: function (e) {
						(m.direction = e >= m.index), (m.index = e), m.updateItemHTML();
					},
					preloadNearbyImages: function () {
						for (
							var e = m.st.gallery.preload,
								t = Math.min(e[0], m.items.length),
								n = Math.min(e[1], m.items.length),
								o = 1;
							o <= (m.direction ? n : t);
							o++
						)
							m._preloadItem(m.index + o);
						for (o = 1; o <= (m.direction ? t : n); o++)
							m._preloadItem(m.index - o);
					},
					_preloadItem: function (e) {
						var t;
						(e = M(e)),
							m.items[e].preloaded ||
								((t = m.items[e]).parsed || (t = m.parseEl(e)),
								u('LazyLoad', t),
								'image' === t.type &&
									(t.img = c('<img class="mfp-img" />')
										.on('load.mfploader', function () {
											t.hasSize = !0;
										})
										.on('error.mfploader', function () {
											(t.hasSize = !0),
												(t.loadError = !0),
												u('LazyLoadError', t);
										})
										.attr('src', t.src)),
								(t.preloaded = !0));
					},
					updateGalleryButtons: function () {
						m.st.gallery.loop ||
							'object' != typeof m.arrowPrev ||
							null === m.arrowPrev ||
							(0 === m.index ? m.arrowPrev.hide() : m.arrowPrev.show(),
							m.index === m.items.length - 1
								? m.arrowNext.hide()
								: m.arrowNext.show());
					},
				},
			}),
			'retina');
	c.magnificPopup.registerModule(H, {
		options: {
			replaceSrc: function (e) {
				return e.src.replace(/\.\w+$/, function (e) {
					return '@2x' + e;
				});
			},
			ratio: 1,
		},
		proto: {
			initRetina: function () {
				var n, o;
				1 < window.devicePixelRatio &&
					((n = m.st.retina), (o = n.ratio), 1 < (o = isNaN(o) ? o() : o)) &&
					(d('ImageHasSize.' + H, function (e, t) {
						t.img.css({
							'max-width': t.img[0].naturalWidth / o,
							width: '100%',
						});
					}),
					d('ElementParse.' + H, function (e, t) {
						t.src = n.replaceSrc(t, o);
					}));
			},
		},
	}),
		r();
});

function initMobileNavigation(){const e=document.querySelector(".cm-mobile-nav-container");if(!e)return;const t=e.querySelector(".cm-menu-toggle"),a=e.querySelector(".cm-mobile-menu"),n=e.querySelector(".cm-mobile-header-row");if(!t||!a||!n)return;const i=t.cloneNode(!0);t.parentNode.replaceChild(i,t),i.setAttribute("aria-expanded","false"),i.addEventListener("click",(function(t){t.preventDefault();const i=t.currentTarget,s="true"===i.getAttribute("aria-expanded");i.setAttribute("aria-expanded",!s),s?(e.classList.remove("cm-toggle-open"),a.classList.remove("cm-mobile-menu--open"),n.classList.remove("cm-mobile-menu--open")):(e.classList.add("cm-toggle-open"),a.classList.add("cm-mobile-menu--open"),n.classList.add("cm-mobile-menu--open"))}))}!function(){var e,t,a,n,i,s;if((e=document.getElementById("cm-primary-nav"))&&void 0!==(t=e.getElementsByClassName("cm-menu-toggle")[0]))if(void 0!==(a=e.getElementsByTagName("ul")[0])){for(a.setAttribute("aria-expanded","false"),-1===a.className.indexOf("nav-menu")&&(a.className+="nav-menu"),t.onclick=function(){-1!==e.className.indexOf("cm-mobile-nav")?(e.className=e.className.replace("cm-mobile-nav","cm-primary-nav"),t.setAttribute("aria-expanded","false"),a.setAttribute("aria-expanded","false")):(e.className=e.className.replace("cm-primary-nav","cm-mobile-nav"),t.setAttribute("aria-expanded","true"),a.setAttribute("aria-expanded","true"))},i=0,s=(n=a.getElementsByTagName("a")).length;i<s;i++)n[i].addEventListener("focus",o,!0),n[i].addEventListener("blur",o,!0);!function(e){var t,a,n=e.querySelectorAll(".menu-item-has-children > a, .page_item_has_children > a");if("ontouchstart"in window&&window.matchMedia("(min-width: 768px)").matches)for(t=function(e){var t,a=this.parentNode;if(a.classList.contains("focus"))a.classList.remove("focus");else{for(e.preventDefault(),t=0;t<a.parentNode.children.length;++t)a!==a.parentNode.children[t]&&a.parentNode.children[t].classList.remove("focus");a.classList.add("focus")}},a=0;a<n.length;++a)n[a].addEventListener("touchstart",t,!1)}(e)}else t.style.display="none";function o(){for(var e=this;-1===e.className.indexOf("nav-menu");)"li"===e.tagName.toLowerCase()&&(-1!==e.className.indexOf("focus")?e.className=e.className.replace(" focus",""):e.className+=" focus"),e=e.parentElement}}(),document.addEventListener("DOMContentLoaded",(function(){initMobileNavigation()})),"undefined"!=typeof wp&&wp.customize&&wp.customize.bind("preview-ready",(function(){initMobileNavigation(),wp.customize.selectiveRefresh.bind("partial-content-rendered",(function(){setTimeout(initMobileNavigation,150)})),wp.customize.preview.bind("refresh",(function(){setTimeout(initMobileNavigation,150)}))}));
/*!
* FitVids 1.1
*
* Copyright 2013, Chris Coyier - http://css-tricks.com + Dave Rupert - http://daverupert.com
* Credit to Thierry Koblentz - http://www.alistapart.com/articles/creating-intrinsic-ratios-for-video/
* Released under the WTFPL license - http://sam.zoy.org/wtfpl/
*
*/
!function(t){"use strict";t.fn.fitVids=function(e){var i={customSelector:null,ignore:null};if(!document.getElementById("fit-vids-style")){var r=document.head||document.getElementsByTagName("head")[0],a=document.createElement("div");a.innerHTML='<p>x</p><style id="fit-vids-style">.fluid-width-video-wrapper{width:100%;position:relative;padding:0;}.fluid-width-video-wrapper iframe,.fluid-width-video-wrapper object,.fluid-width-video-wrapper embed {position:absolute;top:0;left:0;width:100%;height:100%;}</style>',r.appendChild(a.childNodes[1])}return e&&t.extend(i,e),this.each((function(){var e=['iframe[src*="player.vimeo.com"]','iframe[src*="youtube.com"]','iframe[src*="youtube-nocookie.com"]','iframe[src*="kickstarter.com"][src*="video.html"]',"object","embed"];i.customSelector&&e.push(i.customSelector);var r=".fitvidsignore";i.ignore&&(r=r+", "+i.ignore);var a=t(this).find(e.join(","));(a=(a=a.not("object object")).not(r)).each((function(){var e=t(this);if(!(e.parents(r).length>0||"embed"===this.tagName.toLowerCase()&&e.parent("object").length||e.parent(".fluid-width-video-wrapper").length)){e.css("height")||e.css("width")||!isNaN(e.attr("height"))&&!isNaN(e.attr("width"))||(e.attr("height",9),e.attr("width",16));var i=("object"===this.tagName.toLowerCase()||e.attr("height")&&!isNaN(parseInt(e.attr("height"),10))?parseInt(e.attr("height"),10):e.height())/(isNaN(parseInt(e.attr("width"),10))?e.width():parseInt(e.attr("width"),10));if(!e.attr("name")){var a="fitvid"+t.fn.fitVids._count;e.attr("name",a),t.fn.fitVids._count++}e.wrap('<div class="fluid-width-video-wrapper"></div>').parent(".fluid-width-video-wrapper").css("padding-top",100*i+"%"),e.removeAttr("height").removeAttr("width")}}))}))},t.fn.fitVids._count=0}(window.jQuery||window.Zepto);