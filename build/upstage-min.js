YUI.add("upstage-controls",function(e){var a=e.Upstage,c=e.Node.create,d="boundingBox";function b(){b.superclass.constructor.apply(this,arguments);}b.NAME="controls";b.ATTRS={height:{value:37},total:{value:e.all(".slide").size(),readOnly:true},footer:{value:""},slide:{value:1}};b.HTML_PARSER={footer:function(f){return f.one(".credit").get("innerHTML");}};e.extend(b,e.Widget,{renderUI:function(){var g=this.get("contentBox");if(!g){return e.error("controls: contentBox is missing");}var f=c("<div class='nav'></div>");f.appendChild(c("<a class='prev' href='#'>&larr;</a>"));f.appendChild(c("<a class='currentSlide'>0/0</a>"));f.appendChild(c("<a class='next' href='#'>&rarr;</a>"));g.appendChild(f);g.setStyles({"height":0,"display":"block"});g.transition({duration:0.2,easing:"ease-out",height:this.get("height")+"px"});},bindUI:function(){var f=this.get(d);f.one(".prev").on("click",e.bind(a.fire,a,"warp",-1));f.one(".next").on("click",e.bind(a.fire,a,"warp",1));a.on("navigate",e.bind("set",this,"slide"));a.on("navigate",e.bind("syncUI",this));},syncUI:function(f){var g=this.get(d);g.one(".currentSlide").setContent(this.get("slide")+"/"+this.get("total"));g.one(".credit").setContent(this.get("footer"));}});a.on("start",function(){new b({srcNode:"#ft"}).render();});},"@VERSION@",{requires:["upstage-slideshow","widget","transition","node"]});YUI.add("upstage-gesture",function(h){var b=h.Upstage;var e=10;var a=500;function g(i,j,k){b.publish(i,{emitFacade:true,defaultFn:h.bind(b.fire,b,j,k)});}g("ui:tap","warp",1);g("ui:heldtap","position",1);g("ui:swipeleft","warp",1);g("ui:swiperight","warp",-1);var f=h.bind(b.fire,b);function c(o,k){var n=o.getData("gestureX"),i=k.pageX;if((n-i)>e){f("ui:swipeleft",o);}else{if((i-n)>e){f("ui:swiperight",o);}else{var m=o.getData("gestureDate").getTime(),j=(new Date).getTime(),l=j-m;if(l>a){f("ui:heldtap",l);}else{f("ui:tap",l);}}}}function d(i){switch(i.target.get("tagName").toUpperCase()){case"A":case"INPUT":case"BUTTON":return;}i.preventDefault();var j=i.currentTarget;j.once("selectstart",function(k){k.preventDefault();});j.setData("gestureX",i.pageX);j.setData("gestureDate",new Date);j.once("gesturemoveend",h.bind(c,this,j));}b.on("start",function(){h.one("body").delegate("gesturemovestart",d,".slide");});},"@VERSION@",{requires:["upstage-slideshow","event-move"]});YUI.add("upstage-keyboard",function(c){var a=c.Upstage;function b(d){switch(d.keyCode){case 32:case 34:case 39:case 40:a.fire("warp",1);break;case 33:case 37:case 38:a.fire("warp",-1);break;case 36:a.fire("position",1);break;case 35:a.fire("position",9999);break;}}a.on("start",function(){c.on("key",b,"body","down:");});},"@VERSION@",{requires:["upstage-slideshow","node","event"]});YUI.add("upstage-l10n",function(d){d.namespace("UpstageL10N");var b=d.UpstageL10N,c=d.Intl,a="upstage-l10n";b.setActiveLang=function(e){return c.setLang(a,e);};b.getActiveLang=function(){return c.getLang(a);};b.get=function(e,f){return c.get(a,e,f);};b.add=function(g,e){var f=c.add(a,g,e);if(!b.getActiveLang()){b.setActiveLang(g);}return f;};},"@VERSION@",{requires:["intl"],lang:["en"]});YUI.add("upstage-permalink",function(f){var b=f.Upstage,c=f.Selection.getText;f.HistoryHash.hashPrefix="!";var d=new f.HistoryHash,e,g;b.on("start",function(){e=f.one("title");g=c(e);b.fire("position",d.get("slide")||1);});b.on("navigate",function(h){d.addValue("slide",h);});b.on("transition",function(m){var l=m.details[1],i=l.getData("slide"),h=b.L10N.get("Slide"),j;if(i==1){j=g;}else{var k=l.one("h1");if(k){j=c(k);}if(!j){j=h+" "+l.getData("slide");}j=g+": "+j;}e.setContent(j);});function a(h){if(h&&h.newVal){h=h.newVal;}else{h=1;}b.fire("position",h);}d.on("slideChange",a);d.on("slideRemove",a);},"@VERSION@",{requires:["upstage-slideshow","node","history","selection"]});YUI.add("upstage-slideshow",function(b){b.namespace("Upstage");var a=b.Upstage;b.augment(a,b.EventTarget);a.on("start",function(){b.mix(a,{L10N:b.UpstageL10N});b.all(".slide").each(function(d,c){c++;d.set("id","slide"+c);d.setData("slide",c);});a.fire("position",1);});a.on("warp",function(d,e){if(e&&e.halt){e.halt();}var c=a.currentSlide+parseInt(d,10);a.fire("position",c);});a.on("position",function(c){c=Math.max(1,c);c=Math.min(c,b.all(".slide").size());var d=a.currentSlide||1;a.currentSlide=parseInt(c,10);if(d!=c){a.fire("navigate",c);a.fire("transition",b.one("#slide"+d),b.one("#slide"+c));}});a.publish("transition",{emitFacade:true,defaultFn:function(e){var d=e.details[0],c=e.details[1];d.setStyle("display","none");c.setStyle("display","block");}});},"@VERSION@",{requires:["upstage-l10n","oop","node","event-custom"]});YUI.add("upstage-transition-fade",function(d){var b=false;var a=new d.AsyncQueue;function c(){b=false;a.stop();}d.Upstage.on("transition",function(g){if(b){d.all(".slide").setStyles({"opacity":"1","display":"none"});return c();}g.preventDefault();b=true;var f=g.details[0],e=g.details[1];a.add(function(){a.pause();f.transition({duration:0.2,easing:"ease-out",opacity:0},d.bind(a.run,a));});a.add(function(){a.pause();e.setStyles({"opacity":"0","display":"block"});e.transition({duration:0.2,easing:"ease-out",opacity:1},d.bind(a.run,a));});a.add(function(){f.setStyles({"display":"none","opacity":"1"});});a.add(c);a.run();});},"@VERSION@",{requires:["upstage-slideshow","transition","async-queue"]});YUI.add("upstage",function(a){},"@VERSION@",{requires:["upstage-slideshow","upstage-controls","upstage-keyboard","upstage-gesture","upstage-permalink"]});