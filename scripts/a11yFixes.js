if(typeof a11yFixes=="undefined") {
  var a11yFixes={
    forceHeadingLevels: function () {
      for(var iHl=1;iHl<=6;iHl++) {
        var hs=document.getElementsByTagName('h'+iHl);
        for(var i=0;i<hs.length;i++) {
          if (!hs[i].hasAttribute('role')) {
            hs[i].setAttribute('aria-level',iHl);
            hs[i].setAttribute('role','heading');
          }
        }
      }
    }
  };
}


(function () {
  for(var iHl=1;iHl<=6;iHl++) {
    var hs=document.getElementsByTagName('h'+iHl);
    for(var i=0;i<hs.length;i++) {
      if (!hs[i].hasAttribute('role')) {
        hs[i].setAttribute('aria-level',iHl);
        hs[i].setAttribute('role','heading');
      }
    }
  }
})();
