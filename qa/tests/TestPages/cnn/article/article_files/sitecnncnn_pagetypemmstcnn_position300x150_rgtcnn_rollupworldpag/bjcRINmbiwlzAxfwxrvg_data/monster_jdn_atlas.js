function monster_jdn()
{
 function q(v){return((v!=null)?'"' + v + '"' : '""');}
 function a(n,v){return(n+'='+q(v)+' ');}
 function o(e,l){return("<" + e + " " + l + ">");}
 function c(e){return("</" + e + ">");}
 var y = 'http://jdn.monster.com/render/adservercontinuation.aspx';
 if (typeof(monster_jdn_continuation) != "undefined")
  y = monster_jdn_continuation;
 var callnano = true;
 var t = new Date();
 var s = '~';
 var st = '';
 var st1 = '';
 var f = '';
 var affiliate = 'ffaf0dfa-78cf-43bd-9d95-207438e09152';
 var width = 160;
 var height = 600;
 var tp = "";
 if (typeof(monster_jdn_affiliate) != "undefined")
  affiliate = monster_jdn_affiliate;
 if (typeof(monster_jdn_ad_width) != "undefined")
  width = monster_jdn_ad_width;
 if (typeof(monster_jdn_ad_height) != "undefined")
  height = monster_jdn_ad_height;
 if (typeof(monster_jdn_ad_type) != "undefined")
  tp = monster_jdn_ad_type;
 if (typeof(monster_jdn_ad_function) != "undefined")
  f = monster_jdn_ad_function;
 if ((tp == "none") || (callnano))
  {y1 = "http://jdn.monster.com/render/nano.aspx";
   width1 = 0; height1 = 0;
   st1 = a('style','visibility:hidden');}
   var rc = "";
   if (typeof (monster_jdn_ad_click) != "undefined")
  	rc = monster_jdn_ad_click;
   var al = affiliate + s + width + s + height + s + t.getTime() + s + t.getTimezoneOffset() + s;
   if (rc != "")
    al = al + "click;" + escape(rc) + s;
   var dl = escape(document.referrer);
   al = al + dl + s + f;

var cx = 
  o('iframe', 
    a('name','monster_jdn_iframe_nano') +
    st1 + 
    a('width',Math.abs(width1)) +
    a('height',Math.abs(height1)) +
    a('marginwidth',0) +
    a('marginheight',0) +
    a('hspace',0) +
    a('vspace',0) +
    a('frameborder',0) +
    a('scrolling','no') +
    a('allowtransparency',true) +
    a('bordercolor','#000000') +
    a('src',y1 + '?' + 
      affiliate + s + 
      width + s + 
      height + s + 
      t.getTime() + s +
      t.getTimezoneOffset() + s +
      escape(document.referrer) + s + f)) +
  c('iframe');
document.write(cx);

var x =
  o('iframe',
    a('name', 'monster_jdn_iframe') +
    st +
    a('width', Math.abs(width)) +
    a('height', Math.abs(height)) +
    a('marginwidth', 0) +
    a('marginheight', 0) +
    a('hspace', 0) +
    a('vspace', 0) +
    a('frameborder', 0) +
    a('scrolling', 'no') +
    a('allowtransparency', true) +
    a('bordercolor', '#000000') +
    a('src', y + '?' + al)) +
  c('iframe');
document.write(x); 
}
monster_jdn();
monster_jdn = null;
