/*
   This file is part of W15y Quick Check
   Copyright (C) 2011, 2012  Brian L. Richwine

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.

 * File:        contrastDialog.js
 * Description: Handles displaying the Contrast Tool dialog
 * Author:	Brian Richwine
 * Created:	2012.04.15
 * Modified:
 * Language:	JavaScript
 * Project:	W15y Quick Check
 *
 * Dev Notes:
 * 2012.04.15 - Created!
 *
 * TODO:
 *
 *    - Internationalize?
 *
 *
 */
if (!blr) {
  var blr = {};
}

/*
 * Object:  QuickW15yContrastDialog
 * Returns:
 */
blr.W15yQC.ContrastDialog = {

  updatingValues: false,
  bCmdIsPressed: false,
  fgc1: 0,
  fgc2: 0,
  bgc: 0,
  color2enabled: false,
  computeClosestColorsFilter: null,
  updateColorHistoryChangeFilterTimerID: null,
  suggestedColorIds: ['button-C1RedLeft','button-C1RedRight','button-C1GreenLeft','button-C1GreenRight',
                      'button-C1BlueLeft','button-C1BlueRight','button-C1HueLeft','button-C1HueRight',
                      'button-C1VLeft','button-C1VRight','button-C1SatLeft','button-C1SatRight',
                      'button-C2RedLeft','button-C2RedRight','button-C2GreenLeft','button-C2GreenRight',
                      'button-C2BlueLeft','button-C2BlueRight','button-C2HueLeft','button-C2HueRight',
                      'button-C2VLeft','button-C2VRight','button-C2SatLeft','button-C2SatRight',
                      'button-BGRedLeft','button-BGRedRight','button-BGGreenLeft','button-BGGreenRight',
                      'button-BGBlueLeft','button-BGBlueRight','button-BGHueLeft','button-BGHueRight',
                      'button-BGVLeft','button-BGVRight','button-BGSatLeft','button-BGSatRight'
                      ],
  colors: [[0,0,0],[255,255,255],[255,0,0],[0,255,255]],
  colorSetHistory: [],
  storedColors: [],

  init: function (dialog) {
    blr.W15yQC.fnReadUserPrefs();
    if (dialog != null && dialog.arguments != null && dialog.arguments.length > 2) {
      blr.W15yQC.ContrastDialog.fnColor1HTMLColorChange(dialog.arguments[1]);
      blr.W15yQC.ContrastDialog.fnBGHTMLColorChange(dialog.arguments[2]);
    }
    blr.W15yQC.ContrastDialog.fnColor1SliderChange();
    blr.W15yQC.ContrastDialog.fnColor2SliderChange();
    blr.W15yQC.ContrastDialog.fnBGSliderChange();
    blr.W15yQC.ContrastDialog.fnUpdateContrastValuesDisplay();
    blr.W15yQC.ContrastDialog.fnUpdateColorHistory();
  },

  windowOnKeyDown: function (dialog, evt) {
    switch (evt.keyCode) {
      case 224:
        blr.W15yQC.ContrastDialog.bCmdIsPressed = true;
        break;
      case 27:
        dialog.close();
        break;
      case 87:
        if (blr.W15yQC.ContrastDialog.bCmdIsPressed == true) {
            evt.stopPropagation();
            evt.preventDefault();
            dialog.close();
        }
        break;
      case 90:
        if(blr.W15yQC.ContrastDialog.bCmdIsPressed == true) {
            evt.stopPropagation();
            evt.preventDefault();
            blr.W15yQC.ContrastDialog.fnUndoColorChange();
        }
        break;
    }
  },

  windowOnKeyUp: function (evt) {
    switch (evt.keyCode) {
      case 224:
        blr.W15yQC.ContrastDialog.bCmdIsPressed = false;
        break;
    }
  },

  forceMinSize: function (dialog) {
    var maxH = (blr.W15yQC.ContrastDialog.storedColors != null && blr.W15yQC.ContrastDialog.storedColors.length>0) ? 710 : 610;
    if(dialog == null) { dialog=window; }
    if (dialog.outerWidth > 100 && dialog.outerHeight > 100 && (dialog.outerWidth < 940 || dialog.outerHeight != maxH)) {
      dialog.resizeTo(Math.max(940, dialog.outerWidth), maxH);
    }
    var rect, width,
    gbc1 = document.getElementById('gbColor1'),
    resultsC1BG = document.getElementById('resultsC1BG');
    if (gbc1 != null && resultsC1BG != null) {
      rect = gbc1.getBoundingClientRect();
      if (rect != null) {
        width = rect.right - rect.left;
        if (width > 50) {
          resultsC1BG.setAttribute('style', 'max-width:' + width.toString() + 'px');
        }
      }
    }
  },

  fnGetColorString: function (ic) {
    return '#' + ('000000' + ic.toString(16)).substr(-6).toUpperCase();
  },

  fnComputeHueFromRGB: function (r, g, b) {
    var h = 57.2957795130823 * Math.atan2(1.73205080756888 * (g - b), 2 * r - g - b);
    while (h < 0) {
      h = h + 360;
    }
    while (h >= 360) {
      h = h - 360;
    }
    return h;
  },

  fnComputeSaturationFromRGB: function (r, g, b) {
    var minRGB = r,
      maxRGB = r;
    if (g > maxRGB) maxRGB = g;
    if (b > maxRGB) maxRGB = b;
    if (g < minRGB) minRGB = g;
    if (b < minRGB) minRGB = b;

    if (maxRGB < 0.01) return 0;
    return 100 * (maxRGB - minRGB) / maxRGB;
  },

  fnComputeBrightnessFromRGB: function (r, g, b) {
    var maxRGB = r;
    if (g > maxRGB) maxRGB = g;
    if (b > maxRGB) maxRGB = b;
    return maxRGB / 2.55;
  },

  fnRGBFromHTMLColor: function (sHTMLColor) {
    var m;
    if (sHTMLColor != null && sHTMLColor.match) {
      m = sHTMLColor.match(/^\s*#?(([abcdef0-9])([abcdef0-9])([abcdef0-9])|([abcdef0-9][abcdef0-9])([abcdef0-9][abcdef0-9])([abcdef0-9][abcdef0-9]))\s*$/i);
      if (m != null) {
        if (m[2] == undefined) {
          return [parseInt(m[5], 16), parseInt(m[6], 16), parseInt(m[7], 16)];
        } else {
          return [parseInt(m[2] + m[2], 16), parseInt(m[3] + m[3], 16), parseInt(m[4] + m[4], 16)];
        }
      }
    }
    return [0, 0, 0];
  },

  fnHSV2RGB: function (h, s, v) {
    var r, g, b,
    i, f, p, q, t;

    s = s / 100;
    v = v / 100;
    if (h >= 360) {
      h = h - 360;
    }

    if (s < 0.001) {
      r = g = b = v;
    } else {
      h /= 60; // sector 0 to 5
      i = Math.floor(h);
      f = h - i; // decimal part of h
      p = v * (1 - s);
      q = v * (1 - s * f);
      t = v * (1 - s * (1 - f));

      switch (i) {
        case 0:
          r = v;
          g = t;
          b = p;
          break;
        case 1:
          r = q;
          g = v;
          b = p;
          break;
        case 2:
          r = p;
          g = v;
          b = t;
          break;
        case 3:
          r = p;
          g = q;
          b = v;
          break;
        case 4:
          r = t;
          g = p;
          b = v;
          break;
        default:
          r = v;
          g = p;
          b = q;
      }
    }

    r = Math.round(r * 255);
    g = Math.round(g * 255);
    b = Math.round(b * 255);
    return [r, g, b];
  },

  fnCalculateLuminance: function (r, g, b) {
    r = r <= 0.03928 ? r / 12.92 : Math.pow(((r + 0.055) / 1.055), 2.4);
    g = g <= 0.03928 ? g / 12.92 : Math.pow(((g + 0.055) / 1.055), 2.4);
    b = b <= 0.03928 ? b / 12.92 : Math.pow(((b + 0.055) / 1.055), 2.4);
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  },

  fnComputeWCAG2LuminosityRatio: function (r1, g1, b1, r2, g2, b2) {
    var l1 = blr.W15yQC.ContrastDialog.fnCalculateLuminance(r1 / 255, g1 / 255, b1 / 255),
      l2 = blr.W15yQC.ContrastDialog.fnCalculateLuminance(r2 / 255, g2 / 255, b2 / 255);
    return Math.round(((l1 >= l2) ? (l1 + .05) / (l2 + .05) : (l2 + .05) / (l1 + .05)) * 100) / 100;
  },

  fnComputeColorDistance: function (r1, g1, b1, r2, g2, b2) {
  var   rmean = (r1 + r2) / 2,
        dr = r1 - r2,
        dg = g1 - g2,
        db = b1 - b2;
  return ((((512+rmean)*dr*dr)>>8) + 4*dg*dg + (((767-rmean)*db*db)>>8));
  },

  //fnFindClosestPassingColor1: function(minLR) {
  //  var r, g, b, d, dr, db, dg, drll, drhl, dgll, dghl, dbll, dbhl,
  //  r1, g1, b1, r2, g2, b2, rbg, gbr, bbg,
  //  c, lr1, lr2,
  //  colors=[[0,0,0],[255,255,255],[255,0,0],[0,255,255]];
  //
  //  r1 = parseInt(document.getElementById('sRed1').value, 10);
  //  g1 = parseInt(document.getElementById('sGreen1').value, 10);
  //  b1 = parseInt(document.getElementById('sBlue1').value, 10);
  //
  //  if(blr.W15yQC.ContrastDialog.color2enabled==true) {
  //      r2 = parseInt(document.getElementById('sRed2').value, 10);
  //      g2 = parseInt(document.getElementById('sGreen2').value, 10);
  //      b2 = parseInt(document.getElementById('sBlue2').value, 10);
  //  } else {
  //      r2 = 0;
  //      g2 = 0;
  //      b2 = 0;
  //  }
  //
  //  rbg = parseInt(document.getElementById('sRedBG').value, 10);
  //  gbg = parseInt(document.getElementById('sGreenBG').value, 10);
  //  bbg = parseInt(document.getElementById('sBlueBG').value, 10);
  //
  //  bestR=null;
  //  bestG=null;
  //  bestB=null;
  //  bestColorDistance=1000000;
  //  if(blr.W15yQC.ContrastDialog.fnComputeWCAG2LuminosityRatio(r1, g1, b1, rbg, gbg, bbg)<minLR) {
  //      for(d=2; d<100; d+=2) {
  //          drll = r1-d >= 0 ? r1-d : 0;
  //          drhl = r1+d <= 255 ? r1+d : 255;
  //          dgll = g1-d >= 0 ? g1-d : 0;
  //          dghl = g1+d <= 255 ? g1+d : 255;
  //          dbll = b1-d >= 0 ? b1-d : 0;
  //          dbhl = b1+d <= 255 ? b1+d : 255;
  //          if(bestR!=null) { // check if we are done looking for closer passing color
  //              if(blr.W15yQC.ContrastDialog.fnComputeColorDistance(drll,g1,b1, r1,g1,b1) >= bestColorDistance &&
  //                 blr.W15yQC.ContrastDialog.fnComputeColorDistance(drhl,g1,b1, r1,g1,b1) >= bestColorDistance &&
  //                 blr.W15yQC.ContrastDialog.fnComputeColorDistance(r1,dgll,b1, r1,g1,b1) >= bestColorDistance &&
  //                 blr.W15yQC.ContrastDialog.fnComputeColorDistance(r1,dghl,b1, r1,g1,b1) >= bestColorDistance &&
  //                 blr.W15yQC.ContrastDialog.fnComputeColorDistance(r1,g1,dbll, r1,g1,b1) >= bestColorDistance &&
  //                 blr.W15yQC.ContrastDialog.fnComputeColorDistance(r1,g1,dbhl, r1,g1,b1) >= bestColorDistance ) {
  //                  break; // Won't be finding anything closer
  //              }
  //          }
  //          for(dr=drll; dr<=drhl; dr=dr+d+d)  {
  //              for(dg=dgll; dg<=dghl; dg++)
  //                for(db=dbll; db<=dbhl; db+=2) {
  //                  lr1=blr.W15yQC.ContrastDialog.fnComputeWCAG2LuminosityRatio(dr, dg, db, rbg, gbg, bbg);
  //                  if(blr.W15yQC.ContrastDialog.color2enabled==true && lr1>=minLR) {
  //                      lr2=blr.W15yQC.ContrastDialog.fnComputeWCAG2LuminosityRatio(dr, dg, db, r2, g2, b2);
  //                      if(lr2>=minLR) {
  //                          cd=blr.W15yQC.ContrastDialog.fnComputeColorDistance(dr,dg,db,r1,g1,b1);
  //                          if(cd<bestColorDistance) {
  //                              cd=bestColorDistance;
  //                              bestR=dr;
  //                              bestG=dg;
  //                              bestB=db;
  //                          }
  //                      }
  //                  } else if(lr1>=minLR) {
  //                      cd=blr.W15yQC.ContrastDialog.fnComputeColorDistance(dr,dg,db,r1,g1,b1);
  //                      if(cd<bestColorDistance) {
  //                          cd=bestColorDistance;
  //                          bestR=dr;
  //                          bestG=dg;
  //                          bestB=db;
  //                      }
  //                  }
  //                }
  //          }
  //          for(dg=dgll; dg<=dghl; dg=dg+d+d)  {
  //              for(dr=drll; dr<=drhl; dr++)
  //                for(db=dbll; db<=dbhl; db+=2) {
  //                  lr1=blr.W15yQC.ContrastDialog.fnComputeWCAG2LuminosityRatio(dr, dg, db, rbg, gbg, bbg);
  //                  if(blr.W15yQC.ContrastDialog.color2enabled==true && lr1>=minLR) {
  //                      lr2=blr.W15yQC.ContrastDialog.fnComputeWCAG2LuminosityRatio(dr, dg, db, r2, g2, b2);
  //                      if(lr2>=minLR) {
  //                          cd=blr.W15yQC.ContrastDialog.fnComputeColorDistance(dr,dg,db,r1,g1,b1);
  //                          if(cd<bestColorDistance) {
  //                              cd=bestColorDistance;
  //                              bestR=dr;
  //                              bestG=dg;
  //                              bestB=db;
  //                          }
  //                      }
  //                  } else if(lr1>=minLR) {
  //                      cd=blr.W15yQC.ContrastDialog.fnComputeColorDistance(dr,dg,db,r1,g1,b1);
  //                      if(cd<bestColorDistance) {
  //                          cd=bestColorDistance;
  //                          bestR=dr;
  //                          bestG=dg;
  //                          bestB=db;
  //                      }
  //                  }
  //                }
  //          }
  //          for(db=dbll; db<=dbhl; db=db+d+d)  {
  //              for(dr=drll; dr<=drhl; dr++)
  //                for(dg=dgll; dg<=dghl; dg+=2) {
  //                  lr1=blr.W15yQC.ContrastDialog.fnComputeWCAG2LuminosityRatio(dr, dg, db, rbg, gbg, bbg);
  //                  if(blr.W15yQC.ContrastDialog.color2enabled==true && lr1>=minLR) {
  //                      lr2=blr.W15yQC.ContrastDialog.fnComputeWCAG2LuminosityRatio(dr, dg, db, r2, g2, b2);
  //                      if(lr2>=minLR) {
  //                          cd=blr.W15yQC.ContrastDialog.fnComputeColorDistance(dr,dg,db,r1,g1,b1);
  //                          if(cd<bestColorDistance) {
  //                              cd=bestColorDistance;
  //                              bestR=dr;
  //                              bestG=dg;
  //                              bestB=db;
  //                          }
  //                      }
  //                  } else if(lr1>=minLR) {
  //                      cd=blr.W15yQC.ContrastDialog.fnComputeColorDistance(dr,dg,db,r1,g1,b1);
  //                      if(cd<bestColorDistance) {
  //                          cd=bestColorDistance;
  //                          bestR=dr;
  //                          bestG=dg;
  //                          bestB=db;
  //                      }
  //                  }
  //                }
  //          }
  //      }
  //  }
  //
  //  if(bestR != null) {
  //      // setup button with best color  button-C1Closest
  //      document.getElementById('button-C1Closest').label=blr.W15yQC.ContrastDialog.fnGetColorString(bestR*65536+bestG*256+bestB);
  //      document.getElementById('button-C1Closest').style.backgroundColor='rgb('+bestR.toString()+','+bestG.toString()+','+bestB.toString()+')';
  //      document.getElementById('button-C1Closest').style.color=blr.W15yQC.ContrastDialog.fnPickHighestContrastColor(bestR, bestG, bestB, colors);
  //      document.getElementById('button-C1Closest').disabled=false;
  //  } else {
  //      document.getElementById('button-C1Closest').label='X';
  //      document.getElementById('button-C1Closest').style.backgroundColor='inherit';
  //      document.getElementById('button-C1Closest').style.color='#000000';
  //      document.getElementById('button-C1Closest').disabled=true;
  //  }
  //  return;
  //},

  fnPickHighestContrastColor: function(r,g,b,colors) {
    var i, lr, bestLR=0, bestIndex;

    for(i=0;i<colors.length;i++) {
        lr=blr.W15yQC.ContrastDialog.fnComputeWCAG2LuminosityRatio(r,g,b, colors[i][0], colors[i][1], colors[i][2]);
        if(colors[i][0]==0 && colors[i][1]==0 && colors[i][2]==0) { lr=lr*0.8; } // Black text is difficult to read on dark backgrounds.
        if(lr>bestLR) {
            bestLR=lr;
            bestIndex=i;
        }
    }
    return 'rgb('+colors[bestIndex][0]+','+colors[bestIndex][1]+','+colors[bestIndex][2]+')';
  },

  fnTogglePassingValues: function() {
    if(document.getElementById('button-C1RedLeft').hasAttribute('hidden')==true) {
        blr.W15yQC.ContrastDialog.fnShowPassingValues();
        document.getElementById('button-togglePassingValues').label='Hide Passing Values';
    } else {
        blr.W15yQC.ContrastDialog.fnHidePassingValues();
        document.getElementById('button-togglePassingValues').label='Show Passing Values';
    }
  },

  fnShowPassingValues: function() {
    var i;

    for(i=0;i<blr.W15yQC.ContrastDialog.suggestedColorIds.length;i++) {
        document.getElementById(blr.W15yQC.ContrastDialog.suggestedColorIds[i]).removeAttribute('hidden');
    }
  },

  fnHidePassingValues: function() {
    var i;

    for(i=0;i<blr.W15yQC.ContrastDialog.suggestedColorIds.length;i++) {
        document.getElementById(blr.W15yQC.ContrastDialog.suggestedColorIds[i]).setAttribute('hidden','true');
    }
  },

  fnSetRGBPassingColorButton: function(id, sliderValue, r,g,b) {
    var button=document.getElementById(id);
    if(sliderValue!=null) {
        button.label=sliderValue;
        button.style.backgroundColor='rgb('+r.toString()+','+g.toString()+','+b.toString()+')';
        button.style.color=blr.W15yQC.ContrastDialog.fnPickHighestContrastColor(r, g, b, blr.W15yQC.ContrastDialog.colors);
        button.disabled=false;
    } else {
        button.label='X';
        button.style.backgroundColor='inherit';
        button.style.color='black';
        button.disabled=true;
    }
  },

  fnSetHSVPassingColorButton: function(id, sliderValue, h,s,v) {
    var rgb, cr,cg,cb, button=document.getElementById(id);
    if(sliderValue!=null) {
        rgb=blr.W15yQC.ContrastDialog.fnHSV2RGB(h, s, v);
        cr=rgb[0];
        cg=rgb[1];
        cb=rgb[2];
        button.label=sliderValue;
        button.style.backgroundColor='rgb('+cr.toString()+','+cg.toString()+','+cb.toString()+')';
        button.style.color=blr.W15yQC.ContrastDialog.fnPickHighestContrastColor(cr, cg, cb, blr.W15yQC.ContrastDialog.colors);
        button.disabled=false;
    } else {
        button.label='X';
        button.style.backgroundColor='inherit';
        button.style.color='#000000';
        button.disabled=true;
    }
  },

  fnComputePassingRGBValues: function(minLR) {
    var rLeft=null, rRight=null, gLeft=null, gRight=null, bLeft=null, bRight=null,
    r1, g1, b1, r2, g2, b2, rbg, gbg, bbg, hue, saturation, brightness, h, s, v, cr, cg, cb, rgb,
    satLeft, satRight, vLeft, vRight, hueLeft, hueRight,
    c, lr1, lr2,
    i,idConfigurations=[['1','2','BG', 'C1'], ['2','1','BG', 'C2'], ['BG','2','1', 'BG']];

    for(i=0;i<idConfigurations.length;i++) {

        r1 = parseInt(document.getElementById('sRed'+idConfigurations[i][0]).value, 10);
        g1 = parseInt(document.getElementById('sGreen'+idConfigurations[i][0]).value, 10);
        b1 = parseInt(document.getElementById('sBlue'+idConfigurations[i][0]).value, 10);

        hue = parseInt(document.getElementById('sHue'+idConfigurations[i][0]).value, 10);
        saturation = parseInt(document.getElementById('sSat'+idConfigurations[i][0]).value, 10);
        brightness = parseInt(document.getElementById('sBrightness'+idConfigurations[i][0]).value, 10);

        if(blr.W15yQC.ContrastDialog.color2enabled==true) {
            r2 = parseInt(document.getElementById('sRed'+idConfigurations[i][1]).value, 10);
            g2 = parseInt(document.getElementById('sGreen'+idConfigurations[i][1]).value, 10);
            b2 = parseInt(document.getElementById('sBlue'+idConfigurations[i][1]).value, 10);
        } else {
            r2 = null;
            g2 = null;
            b2 = null;
        }

        rbg = parseInt(document.getElementById('sRed'+idConfigurations[i][2]).value, 10);
        gbg = parseInt(document.getElementById('sGreen'+idConfigurations[i][2]).value, 10);
        bbg = parseInt(document.getElementById('sBlue'+idConfigurations[i][2]).value, 10);

        rLeft=null;
        for(c=r1-1;c>=0;c--) {
            lr1=blr.W15yQC.ContrastDialog.fnComputeWCAG2LuminosityRatio(c, g1, b1, rbg, gbg, bbg);
            if(blr.W15yQC.ContrastDialog.color2enabled==true && lr1>=minLR) {
                lr2=blr.W15yQC.ContrastDialog.fnComputeWCAG2LuminosityRatio(c, g1, b1, r2, g2, b2);
                if(lr2>=minLR) {
                    rLeft=c;
                    break;
                }
            } else if(lr1>=minLR) {
                rLeft=c;
                break;
            }
        }
        rRight=null;
        for(c=r1+1;c<=255;c++) {
            lr1=blr.W15yQC.ContrastDialog.fnComputeWCAG2LuminosityRatio(c, g1, b1, rbg, gbg, bbg);
            //alert('loop 2: c='+c.toString()+' lr1='+lr1.toString()+' minLR='+minLR.toString());
            if(blr.W15yQC.ContrastDialog.color2enabled==true && lr1>=minLR) {
                lr2=blr.W15yQC.ContrastDialog.fnComputeWCAG2LuminosityRatio(c, g1, b1, r2, g2, b2);
                if(lr2>=minLR) {
                    rRight=c;
                    break;
                }
            } else if(lr1>=minLR) {
                rRight=c;
                break;
            }
        }

        gLeft=null;
        for(c=g1-1;c>=0;c--) {
            lr1=blr.W15yQC.ContrastDialog.fnComputeWCAG2LuminosityRatio(r1, c, b1, rbg, gbg, bbg);
            if(blr.W15yQC.ContrastDialog.color2enabled==true && lr1>=minLR) {
                lr2=blr.W15yQC.ContrastDialog.fnComputeWCAG2LuminosityRatio(r1, c, b1, r2, g2, b2);
                if(lr2>=minLR) {
                    gLeft=c;
                    break;
                }
            } else if(lr1>=minLR) {
                gLeft=c;
                break;
            }
        }
        gRight=null;
        for(c=g1+1;c<=255;c++) {
            lr1=blr.W15yQC.ContrastDialog.fnComputeWCAG2LuminosityRatio(r1, c, b1, rbg, gbg, bbg);
            if(blr.W15yQC.ContrastDialog.color2enabled==true && lr1>=minLR) {
                lr2=blr.W15yQC.ContrastDialog.fnComputeWCAG2LuminosityRatio(r1, c, b1, r2, g2, b2);
                if(lr2>=minLR) {
                    gRight=c;
                    break;
                }
            } else if(lr1>=minLR) {
                gRight=c;
                break;
            }
        }

        bLeft=null;
        for(c=b1-1;c>=0;c--) {
            lr1=blr.W15yQC.ContrastDialog.fnComputeWCAG2LuminosityRatio(r1, g1, c, rbg, gbg, bbg);
            if(blr.W15yQC.ContrastDialog.color2enabled==true && lr1>=minLR) {
                lr2=blr.W15yQC.ContrastDialog.fnComputeWCAG2LuminosityRatio(r1, g1, c, r2, g2, b2);
                if(lr2>=minLR) {
                    bLeft=c;
                    break;
                }
            } else if(lr1>=minLR) {
                bLeft=c;
                break;
            }
        }
        bRight=null;
        for(c=b1+1;c<=255;c++) {
            lr1=blr.W15yQC.ContrastDialog.fnComputeWCAG2LuminosityRatio(r1, g1, c, rbg, gbg, bbg);
            if(blr.W15yQC.ContrastDialog.color2enabled==true && lr1>=minLR) {
                lr2=blr.W15yQC.ContrastDialog.fnComputeWCAG2LuminosityRatio(r1, g1, c, r2, g2, b2);
                if(lr2>=minLR) {
                    bRight=c;
                    break;
                }
            } else if(lr1>=minLR) {
                bRight=c;
                break;
            }
        }

        hueLeft=null;
        h=hue-1;
        if(h<0) { h=359; }
        while(h!=hue) {
            rgb=blr.W15yQC.ContrastDialog.fnHSV2RGB(h, saturation, brightness);
            cr=rgb[0];
            cg=rgb[1];
            cb=rgb[2];
            lr1=blr.W15yQC.ContrastDialog.fnComputeWCAG2LuminosityRatio(cr, cg, cb, rbg, gbg, bbg);
            if(blr.W15yQC.ContrastDialog.color2enabled==true && lr1>=minLR) {
                lr2=blr.W15yQC.ContrastDialog.fnComputeWCAG2LuminosityRatio(cr, cg, cb, r2, g2, b2);
                if(lr2>=minLR) {
                    hueLeft=h;
                    break;
                }
            } else if(lr1>=minLR) {
                hueLeft=h;
                break;
            }

            h--;
            if(h<0) { h=359; }
        }
        hueRight=null;
        h=hue+1;
        if(h>359) { h=0; }
        while(h!=hue) {
            rgb=blr.W15yQC.ContrastDialog.fnHSV2RGB(h, saturation, brightness);
            cr=rgb[0];
            cg=rgb[1];
            cb=rgb[2];
            lr1=blr.W15yQC.ContrastDialog.fnComputeWCAG2LuminosityRatio(cr, cg, cb, rbg, gbg, bbg);
            if(blr.W15yQC.ContrastDialog.color2enabled==true && lr1>=minLR) {
                lr2=blr.W15yQC.ContrastDialog.fnComputeWCAG2LuminosityRatio(cr, cg, cb, r2, g2, b2);
                if(lr2>=minLR) {
                    hueRight=h;
                    break;
                }
            } else if(lr1>=minLR) {
                hueRight=h;
                break;
            }

            h++;
            if(h>359) { h=0; }
        }

        if(hueRight!=null && hueLeft!=null && hueRight< hueLeft) {
            hueRight=h;
            hueRight=hueLeft;
            hueLeft=h;
        }

        satLeft=null;
        for(s=saturation-1; s>=0; s--) {
            rgb=blr.W15yQC.ContrastDialog.fnHSV2RGB(hue, s, brightness);
            cr=rgb[0];
            cg=rgb[1];
            cb=rgb[2];
            lr1=blr.W15yQC.ContrastDialog.fnComputeWCAG2LuminosityRatio(cr, cg, cb, rbg, gbg, bbg);
            if(blr.W15yQC.ContrastDialog.color2enabled==true && lr1>=minLR) {
                lr2=blr.W15yQC.ContrastDialog.fnComputeWCAG2LuminosityRatio(cr, cg, cb, r2, g2, b2);
                if(lr2>=minLR) {
                    satLeft=s;
                    break;
                }
            } else if(lr1>=minLR) {
                satLeft=s;
                break;
            }
        }
        satRight=null;
        for(s=saturation+1; s<=100; s++) {
            rgb=blr.W15yQC.ContrastDialog.fnHSV2RGB(hue, s, brightness);
            cr=rgb[0];
            cg=rgb[1];
            cb=rgb[2];
            lr1=blr.W15yQC.ContrastDialog.fnComputeWCAG2LuminosityRatio(cr, cg, cb, rbg, gbg, bbg);
            if(blr.W15yQC.ContrastDialog.color2enabled==true && lr1>=minLR) {
                lr2=blr.W15yQC.ContrastDialog.fnComputeWCAG2LuminosityRatio(cr, cg, cb, r2, g2, b2);
                if(lr2>=minLR) {
                    satRight=s;
                    break;
                }
            } else if(lr1>=minLR) {
                satRight=s;
                break;
            }
        }

        vLeft=null;
        for(v=brightness-1; v>=0; v--) {
            rgb=blr.W15yQC.ContrastDialog.fnHSV2RGB(hue, saturation, v);
            cr=rgb[0];
            cg=rgb[1];
            cb=rgb[2];
            lr1=blr.W15yQC.ContrastDialog.fnComputeWCAG2LuminosityRatio(cr, cg, cb, rbg, gbg, bbg);
            if(blr.W15yQC.ContrastDialog.color2enabled==true && lr1>=minLR) {
                lr2=blr.W15yQC.ContrastDialog.fnComputeWCAG2LuminosityRatio(cr, cg, cb, r2, g2, b2);
                if(lr2>=minLR) {
                    vLeft=v;
                    break;
                }
            } else if(lr1>=minLR) {
                vLeft=v;
                break;
            }
        }
        vRight=null;
        for(v=brightness+1; v<=100; v++) {
            rgb=blr.W15yQC.ContrastDialog.fnHSV2RGB(hue, saturation, v);
            cr=rgb[0];
            cg=rgb[1];
            cb=rgb[2];
            lr1=blr.W15yQC.ContrastDialog.fnComputeWCAG2LuminosityRatio(cr, cg, cb, rbg, gbg, bbg);
            if(blr.W15yQC.ContrastDialog.color2enabled==true && lr1>=minLR) {
                lr2=blr.W15yQC.ContrastDialog.fnComputeWCAG2LuminosityRatio(cr, cg, cb, r2, g2, b2);
                if(lr2>=minLR) {
                    vRight=v;
                    break;
                }
            } else if(lr1>=minLR) {
                vRight=v;
                break;
            }
        }

        blr.W15yQC.ContrastDialog.fnSetRGBPassingColorButton('button-'+idConfigurations[i][3]+'RedLeft', rLeft, rLeft,g1,b1);
        blr.W15yQC.ContrastDialog.fnSetRGBPassingColorButton('button-'+idConfigurations[i][3]+'RedRight', rRight, rRight,g1,b1);

        blr.W15yQC.ContrastDialog.fnSetRGBPassingColorButton('button-'+idConfigurations[i][3]+'GreenLeft', gLeft, r1,gLeft,b1);
        blr.W15yQC.ContrastDialog.fnSetRGBPassingColorButton('button-'+idConfigurations[i][3]+'GreenRight', gRight, r1,gRight,b1);

        blr.W15yQC.ContrastDialog.fnSetRGBPassingColorButton('button-'+idConfigurations[i][3]+'BlueLeft', bLeft, r1,g1,bLeft);
        blr.W15yQC.ContrastDialog.fnSetRGBPassingColorButton('button-'+idConfigurations[i][3]+'BlueRight', bRight, r1,g1,bRight);

        blr.W15yQC.ContrastDialog.fnSetHSVPassingColorButton('button-'+idConfigurations[i][3]+'HueLeft', hueLeft, hueLeft, saturation, brightness);
        blr.W15yQC.ContrastDialog.fnSetHSVPassingColorButton('button-'+idConfigurations[i][3]+'HueRight', hueRight, hueRight, saturation, brightness);

        blr.W15yQC.ContrastDialog.fnSetHSVPassingColorButton('button-'+idConfigurations[i][3]+'SatLeft', satLeft, hue, satLeft, brightness);
        blr.W15yQC.ContrastDialog.fnSetHSVPassingColorButton('button-'+idConfigurations[i][3]+'SatRight', satRight, hue, satRight, brightness);

        blr.W15yQC.ContrastDialog.fnSetHSVPassingColorButton('button-'+idConfigurations[i][3]+'VLeft', vLeft, hue, saturation, vLeft);
        blr.W15yQC.ContrastDialog.fnSetHSVPassingColorButton('button-'+idConfigurations[i][3]+'VRight', vRight, hue, saturation, vRight);
    }

  },

  //selectC1Closest: function(c) {
  //  switch(c) {
  //      case 'X':
  //          return;
  //          break;
  //      case 'Find':
  //          blr.W15yQC.ContrastDialog.fnFindClosestPassingColor1(4.5);
  //          break;
  //      default:
  //          blr.W15yQC.ContrastDialog.fnColor1HTMLColorChange(c);
  //  }
  //},

  setSlider: function(newSliderValue, id) {
    var v=parseInt(newSliderValue,10);
    if(isNaN(v)==false) {
        document.getElementById(id).value=v;
    }
  },

  // ----- Color 1

  fnColor1HTMLColorChange: function (newColor) {
    var RGB, r, g, b;
    if (blr.W15yQC.ContrastDialog.updatingValues == false) {
      if (newColor != null) {
        document.getElementById('tbHTMLColor1').value = newColor;
      }
      blr.W15yQC.ContrastDialog.updatingValues = true;
      RGB = blr.W15yQC.ContrastDialog.fnRGBFromHTMLColor(document.getElementById('tbHTMLColor1').value);
      r = document.getElementById('sRed1').value = RGB[0];
      g = document.getElementById('sGreen1').value = RGB[1];
      b = document.getElementById('sBlue1').value = RGB[2];
      blr.W15yQC.ContrastDialog.fgc1 = r * 65536 + g * 256 + b;
      document.getElementById('tbHTMLColor1').value = blr.W15yQC.ContrastDialog.fnGetColorString(blr.W15yQC.ContrastDialog.fgc1);
      document.getElementById('cp1').color = document.getElementById('tbHTMLColor1').value;
      document.getElementById('sHue1').value = blr.W15yQC.ContrastDialog.fnComputeHueFromRGB(r, g, b);
      document.getElementById('sSat1').value = blr.W15yQC.ContrastDialog.fnComputeSaturationFromRGB(r, g, b);
      document.getElementById('sBrightness1').value = blr.W15yQC.ContrastDialog.fnComputeBrightnessFromRGB(r, g, b);
      blr.W15yQC.ContrastDialog.fnUpdateContrastValuesDisplay();
      blr.W15yQC.ContrastDialog.updatingValues = false;
    }
  },

  fnColor1ColorPickerChange: function () {
    var RGB, r, g, b;
    if (blr.W15yQC.ContrastDialog.updatingValues == false) {
      blr.W15yQC.ContrastDialog.updatingValues = true;
      RGB = blr.W15yQC.ContrastDialog.fnRGBFromHTMLColor(document.getElementById('cp1').color);
      r = document.getElementById('sRed1').value = RGB[0];
      g = document.getElementById('sGreen1').value = RGB[1];
      b = document.getElementById('sBlue1').value = RGB[2];
      blr.W15yQC.ContrastDialog.fgc1 = r * 65536 + g * 256 + b;
      document.getElementById('tbHTMLColor1').value = blr.W15yQC.ContrastDialog.fnGetColorString(blr.W15yQC.ContrastDialog.fgc1);
      //document.getElementById('cp1').color = blr.W15yQC.ContrastDialog.fnGetColorString(blr.W15yQC.ContrastDialog.fgc1);
      document.getElementById('sHue1').value = blr.W15yQC.ContrastDialog.fnComputeHueFromRGB(r, g, b);
      document.getElementById('sSat1').value = blr.W15yQC.ContrastDialog.fnComputeSaturationFromRGB(r, g, b);
      document.getElementById('sBrightness1').value = blr.W15yQC.ContrastDialog.fnComputeBrightnessFromRGB(r, g, b);
      blr.W15yQC.ContrastDialog.fnUpdateContrastValuesDisplay();
      blr.W15yQC.ContrastDialog.updatingValues = false;
    }
  },

  fnColor1SliderChange: function () {
    var r, g, b;
    if (blr.W15yQC.ContrastDialog.updatingValues == false) {
      blr.W15yQC.ContrastDialog.updatingValues = true;
      r = parseInt(document.getElementById('sRed1').value, 10);
      g = parseInt(document.getElementById('sGreen1').value, 10);
      b = parseInt(document.getElementById('sBlue1').value, 10);

      blr.W15yQC.ContrastDialog.fgc1 = r * 65536 + g * 256 + b;
      document.getElementById('tbHTMLColor1').value = blr.W15yQC.ContrastDialog.fnGetColorString(blr.W15yQC.ContrastDialog.fgc1);
      document.getElementById('cp1').color = document.getElementById('tbHTMLColor1').value;
      document.getElementById('sHue1').value = blr.W15yQC.ContrastDialog.fnComputeHueFromRGB(r, g, b);
      document.getElementById('sSat1').value = blr.W15yQC.ContrastDialog.fnComputeSaturationFromRGB(r, g, b);
      document.getElementById('sBrightness1').value = blr.W15yQC.ContrastDialog.fnComputeBrightnessFromRGB(r, g, b);
      blr.W15yQC.ContrastDialog.fnUpdateContrastValuesDisplay();
      blr.W15yQC.ContrastDialog.updatingValues = false;
    }
  },

  fnColor1HSBChange: function () {
    var RGB;
    if (blr.W15yQC.ContrastDialog.updatingValues == false) {
      blr.W15yQC.ContrastDialog.updatingValues = true;
      RGB = blr.W15yQC.ContrastDialog.fnHSV2RGB(document.getElementById('sHue1').value, document.getElementById('sSat1').value, document.getElementById('sBrightness1').value);
      document.getElementById('sRed1').value = RGB[0];
      document.getElementById('sGreen1').value = RGB[1];
      document.getElementById('sBlue1').value = RGB[2];
      blr.W15yQC.ContrastDialog.fgc1 = RGB[0] * 65536 + RGB[1] * 256 + RGB[2];
      document.getElementById('tbHTMLColor1').value = blr.W15yQC.ContrastDialog.fnGetColorString(blr.W15yQC.ContrastDialog.fgc1);
      document.getElementById('cp1').color = document.getElementById('tbHTMLColor1').value;
      blr.W15yQC.ContrastDialog.fnUpdateContrastValuesDisplay();
      blr.W15yQC.ContrastDialog.updatingValues = false;
    }
  },

  // ------ Color 2

  fnColor2HTMLColorChange: function (newColor) {
    var RGB, r, g, b;
    if (blr.W15yQC.ContrastDialog.updatingValues == false) {
      blr.W15yQC.ContrastDialog.updatingValues = true;
      if (newColor != null) {
        document.getElementById('tbHTMLColor2').value = newColor;
      }
      RGB = blr.W15yQC.ContrastDialog.fnRGBFromHTMLColor(document.getElementById('tbHTMLColor2').value);
      r = document.getElementById('sRed2').value = RGB[0];
      g = document.getElementById('sGreen2').value = RGB[1];
      b = document.getElementById('sBlue2').value = RGB[2];
      blr.W15yQC.ContrastDialog.fgc2 = r * 65536 + g * 256 + b;
      document.getElementById('tbHTMLColor2').value = blr.W15yQC.ContrastDialog.fnGetColorString(blr.W15yQC.ContrastDialog.fgc2);
      document.getElementById('cp2').color = document.getElementById('tbHTMLColor2').value;
      document.getElementById('sHue2').value = blr.W15yQC.ContrastDialog.fnComputeHueFromRGB(r, g, b);
      document.getElementById('sSat2').value = blr.W15yQC.ContrastDialog.fnComputeSaturationFromRGB(r, g, b);
      document.getElementById('sBrightness2').value = blr.W15yQC.ContrastDialog.fnComputeBrightnessFromRGB(r, g, b);
      blr.W15yQC.ContrastDialog.fnUpdateContrastValuesDisplay();
      blr.W15yQC.ContrastDialog.updatingValues = false;
    }
  },

  fnColor2ColorPickerChange: function () {
    var RGB, r, g, b;
    if (blr.W15yQC.ContrastDialog.updatingValues == false) {
      blr.W15yQC.ContrastDialog.updatingValues = true;
      RGB = blr.W15yQC.ContrastDialog.fnRGBFromHTMLColor(document.getElementById('cp2').color);
      r = document.getElementById('sRed2').value = RGB[0];
      g = document.getElementById('sGreen2').value = RGB[1];
      b = document.getElementById('sBlue2').value = RGB[2];
      blr.W15yQC.ContrastDialog.fgc2 = r * 65536 + g * 256 + b;
      document.getElementById('tbHTMLColor2').value = blr.W15yQC.ContrastDialog.fnGetColorString(blr.W15yQC.ContrastDialog.fgc2);
      document.getElementById('sHue2').value = blr.W15yQC.ContrastDialog.fnComputeHueFromRGB(r, g, b);
      document.getElementById('sSat2').value = blr.W15yQC.ContrastDialog.fnComputeSaturationFromRGB(r, g, b);
      document.getElementById('sBrightness2').value = blr.W15yQC.ContrastDialog.fnComputeBrightnessFromRGB(r, g, b);
      blr.W15yQC.ContrastDialog.fnUpdateContrastValuesDisplay();
      blr.W15yQC.ContrastDialog.updatingValues = false;
    }
  },

  fnColor2SliderChange: function () {
    var r, g, b;
    if (blr.W15yQC.ContrastDialog.updatingValues == false) {
      blr.W15yQC.ContrastDialog.updatingValues = true;
      r = parseInt(document.getElementById('sRed2').value, 10);
      g = parseInt(document.getElementById('sGreen2').value, 10);
      b = parseInt(document.getElementById('sBlue2').value, 10);

      blr.W15yQC.ContrastDialog.fgc2 = r * 65536 + g * 256 + b;
      document.getElementById('tbHTMLColor2').value = blr.W15yQC.ContrastDialog.fnGetColorString(blr.W15yQC.ContrastDialog.fgc2);
      document.getElementById('cp2').color = document.getElementById('tbHTMLColor2').value;
      document.getElementById('sHue2').value = blr.W15yQC.ContrastDialog.fnComputeHueFromRGB(r, g, b);
      document.getElementById('sSat2').value = blr.W15yQC.ContrastDialog.fnComputeSaturationFromRGB(r, g, b);
      document.getElementById('sBrightness2').value = blr.W15yQC.ContrastDialog.fnComputeBrightnessFromRGB(r, g, b);
      blr.W15yQC.ContrastDialog.fnUpdateContrastValuesDisplay();
      blr.W15yQC.ContrastDialog.updatingValues = false;
    }
  },

  fnColor2HSBChange: function () {
    var RGB;
    if (blr.W15yQC.ContrastDialog.updatingValues == false) {
      blr.W15yQC.ContrastDialog.updatingValues = true;
      RGB = blr.W15yQC.ContrastDialog.fnHSV2RGB(document.getElementById('sHue2').value, document.getElementById('sSat2').value, document.getElementById('sBrightness2').value);
      document.getElementById('sRed2').value = RGB[0];
      document.getElementById('sGreen2').value = RGB[1];
      document.getElementById('sBlue2').value = RGB[2];
      blr.W15yQC.ContrastDialog.fgc2 = RGB[0] * 65536 + RGB[1] * 256 + RGB[2];
      document.getElementById('tbHTMLColor2').value = blr.W15yQC.ContrastDialog.fnGetColorString(blr.W15yQC.ContrastDialog.fgc2);
      document.getElementById('cp2').color = document.getElementById('tbHTMLColor2').value;
      blr.W15yQC.ContrastDialog.fnUpdateContrastValuesDisplay();
      blr.W15yQC.ContrastDialog.updatingValues = false;
    }
  },

  // ------ BG Color

  fnBGHTMLColorChange: function (newColor) {
    var RGB, r, g, b;
    if (blr.W15yQC.ContrastDialog.updatingValues == false) {
      blr.W15yQC.ContrastDialog.updatingValues = true;
      if (newColor != null) {
        document.getElementById('tbHTMLColorBG').value = newColor;
      }
      RGB = blr.W15yQC.ContrastDialog.fnRGBFromHTMLColor(document.getElementById('tbHTMLColorBG').value);
      r = document.getElementById('sRedBG').value = RGB[0];
      g = document.getElementById('sGreenBG').value = RGB[1];
      b = document.getElementById('sBlueBG').value = RGB[2];
      blr.W15yQC.ContrastDialog.bgc = r * 65536 + g * 256 + b;
      document.getElementById('tbHTMLColorBG').value = blr.W15yQC.ContrastDialog.fnGetColorString(blr.W15yQC.ContrastDialog.bgc);
      document.getElementById('cpBG').color = document.getElementById('tbHTMLColorBG').value;
      document.getElementById('sHueBG').value = blr.W15yQC.ContrastDialog.fnComputeHueFromRGB(r, g, b);
      document.getElementById('sSatBG').value = blr.W15yQC.ContrastDialog.fnComputeSaturationFromRGB(r, g, b);
      document.getElementById('sBrightnessBG').value = blr.W15yQC.ContrastDialog.fnComputeBrightnessFromRGB(r, g, b);
      blr.W15yQC.ContrastDialog.fnUpdateContrastValuesDisplay();
      blr.W15yQC.ContrastDialog.updatingValues = false;
    }
  },

  fnBGColorPickerChange: function () {
    var RGB, r, g, b;
    if (blr.W15yQC.ContrastDialog.updatingValues == false) {
      blr.W15yQC.ContrastDialog.updatingValues = true;
      RGB = blr.W15yQC.ContrastDialog.fnRGBFromHTMLColor(document.getElementById('cpBG').color);
      r = document.getElementById('sRedBG').value = RGB[0];
      g = document.getElementById('sGreenBG').value = RGB[1];
      b = document.getElementById('sBlueBG').value = RGB[2];
      blr.W15yQC.ContrastDialog.bgc = r * 65536 + g * 256 + b;
      document.getElementById('tbHTMLColorBG').value = blr.W15yQC.ContrastDialog.fnGetColorString(blr.W15yQC.ContrastDialog.bgc);
      document.getElementById('sHueBG').value = blr.W15yQC.ContrastDialog.fnComputeHueFromRGB(r, g, b);
      document.getElementById('sSatBG').value = blr.W15yQC.ContrastDialog.fnComputeSaturationFromRGB(r, g, b);
      document.getElementById('sBrightnessBG').value = blr.W15yQC.ContrastDialog.fnComputeBrightnessFromRGB(r, g, b);
      blr.W15yQC.ContrastDialog.fnUpdateContrastValuesDisplay();
      blr.W15yQC.ContrastDialog.updatingValues = false;
    }
  },

  fnBGSliderChange: function () {
    var r, g, b;
    if (blr.W15yQC.ContrastDialog.updatingValues == false) {
      blr.W15yQC.ContrastDialog.updatingValues = true;
      r = parseInt(document.getElementById('sRedBG').value, 10);
      g = parseInt(document.getElementById('sGreenBG').value, 10);
      b = parseInt(document.getElementById('sBlueBG').value, 10);

      blr.W15yQC.ContrastDialog.bgc = r * 65536 + g * 256 + b;
      document.getElementById('tbHTMLColorBG').value = blr.W15yQC.ContrastDialog.fnGetColorString(blr.W15yQC.ContrastDialog.bgc);
      document.getElementById('cpBG').color = document.getElementById('tbHTMLColorBG').value;
      document.getElementById('sHueBG').value = blr.W15yQC.ContrastDialog.fnComputeHueFromRGB(r, g, b);
      document.getElementById('sSatBG').value = blr.W15yQC.ContrastDialog.fnComputeSaturationFromRGB(r, g, b);
      document.getElementById('sBrightnessBG').value = blr.W15yQC.ContrastDialog.fnComputeBrightnessFromRGB(r, g, b);
      blr.W15yQC.ContrastDialog.fnUpdateContrastValuesDisplay();
      blr.W15yQC.ContrastDialog.updatingValues = false;
    }
  },

  fnBGHSBChange: function () {
    var RGB;
    if (blr.W15yQC.ContrastDialog.updatingValues == false) {
      blr.W15yQC.ContrastDialog.updatingValues = true;
      RGB = blr.W15yQC.ContrastDialog.fnHSV2RGB(document.getElementById('sHueBG').value, document.getElementById('sSatBG').value, document.getElementById('sBrightnessBG').value);
      document.getElementById('sRedBG').value = RGB[0];
      document.getElementById('sGreenBG').value = RGB[1];
      document.getElementById('sBlueBG').value = RGB[2];
      blr.W15yQC.ContrastDialog.bgc = RGB[0] * 65536 + RGB[1] * 256 + RGB[2];
      document.getElementById('tbHTMLColorBG').value = blr.W15yQC.ContrastDialog.fnGetColorString(blr.W15yQC.ContrastDialog.bgc);
      document.getElementById('cpBG').color = document.getElementById('tbHTMLColorBG').value;
      blr.W15yQC.ContrastDialog.fnUpdateContrastValuesDisplay();
      blr.W15yQC.ContrastDialog.updatingValues = false;
    }
  },

  fnUpdateColorHistory: function() {
    var c1, c2, cbg, i;

    c1=document.getElementById('tbHTMLColor1').value;
    c2=document.getElementById('tbHTMLColor2').value;
    cbg=document.getElementById('tbHTMLColorBG').value;

    if(c1 != null && c2 != null && cbg != null) {
        if(blr.W15yQC.ContrastDialog.colorSetHistory==null || blr.W15yQC.ContrastDialog.colorSetHistory.length<1) {
            blr.W15yQC.ContrastDialog.colorSetHistory = [[c1, c2, cbg, blr.W15yQC.ContrastDialog.color2enabled]];
        } else {
            i=blr.W15yQC.ContrastDialog.colorSetHistory.length-1;
            if(blr.W15yQC.ContrastDialog.colorSetHistory[i][0]!=c1 || blr.W15yQC.ContrastDialog.colorSetHistory[i][1]!=c2 || blr.W15yQC.ContrastDialog.colorSetHistory[i][2]!=cbg ||
               blr.W15yQC.ContrastDialog.colorSetHistory[i][3]!=blr.W15yQC.ContrastDialog.color2enabled) {
                blr.W15yQC.ContrastDialog.colorSetHistory.push([c1,c2,cbg,blr.W15yQC.ContrastDialog.color2enabled]);
            }
            if(blr.W15yQC.ContrastDialog.colorSetHistory.length>500) {
                blr.W15yQC.ContrastDialog.colorSetHistory.unshift();
                blr.W15yQC.ContrastDialog.colorSetHistory.unshift();
                blr.W15yQC.ContrastDialog.colorSetHistory.unshift();
            }
        }
    }
  },

  fnUndoColorChange: function() {
    var c1, c2, cbg, cs=null;

    c1=document.getElementById('tbHTMLColor1').value;
    c2=document.getElementById('tbHTMLColor2').value;
    cbg=document.getElementById('tbHTMLColorBG').value;

    while(blr.W15yQC.ContrastDialog.colorSetHistory!= null && blr.W15yQC.ContrastDialog.colorSetHistory.length>0) {
        cs=blr.W15yQC.ContrastDialog.colorSetHistory.pop();
        if(c1!=cs[0] || c2!=cs[1] || cbg!=cs[2]) {
            blr.W15yQC.ContrastDialog.fnColor1HTMLColorChange(cs[0]);
            blr.W15yQC.ContrastDialog.fnColor2HTMLColorChange(cs[1]);
            blr.W15yQC.ContrastDialog.fnBGHTMLColorChange(cs[2]);
            blr.W15yQC.ContrastDialog.addSecondColor(cs[3]);
            blr.W15yQC.ContrastDialog.fnUpdateContrastValuesDisplay();

            blr.W15yQC.ContrastDialog.colorSetHistory.push([cs[0],cs[1],cs[2],cs[3]]);
            return;
        }
    }
    if(cs!=null && blr.W15yQC.ContrastDialog.colorSetHistory.length<1) {
        blr.W15yQC.ContrastDialog.colorSetHistory.push([cs[0],cs[1],cs[2],cs[3]]);
    }
  },

  fnUpdateContrastValuesDisplay: function () {
    var el1, el2, r1, g1, b1, r2, g2, b2, rBG, gBG, bBG, lrc1bg, lrc2bg, lrc1rc2, c1, c2, bg, if1, if2, if3;

    r1 = parseInt(document.getElementById('sRed1').value, 10);
    g1 = parseInt(document.getElementById('sGreen1').value, 10);
    b1 = parseInt(document.getElementById('sBlue1').value, 10);

    r2 = parseInt(document.getElementById('sRed2').value, 10);
    g2 = parseInt(document.getElementById('sGreen2').value, 10);
    b2 = parseInt(document.getElementById('sBlue2').value, 10);

    rBG = parseInt(document.getElementById('sRedBG').value, 10);
    gBG = parseInt(document.getElementById('sGreenBG').value, 10);
    bBG = parseInt(document.getElementById('sBlueBG').value, 10);

    lrc1bg = blr.W15yQC.ContrastDialog.fnComputeWCAG2LuminosityRatio(r1, g1, b1, rBG, gBG, bBG);
    lrc2bg = blr.W15yQC.ContrastDialog.fnComputeWCAG2LuminosityRatio(r2, g2, b2, rBG, gBG, bBG);
    lrc1rc2 = blr.W15yQC.ContrastDialog.fnComputeWCAG2LuminosityRatio(r1, g1, b1, r2, g2, b2);

    document.getElementById('resultsC1BGContrast').value = lrc1bg;
    document.getElementById('resultsC2BGContrast').value = lrc2bg;
    document.getElementById('resultsC1C2Contrast').value = lrc1rc2;

    blr.W15yQC.ContrastDialog.setResults(lrc1bg, 'C1BGWCAG2AACompliant', 'C1BGWCAG2AACompliant18p', 'C1BGWCAG2AAACompliant', 'C1BGWCAG2AAACompliant18p');
    blr.W15yQC.ContrastDialog.setResults(lrc2bg, 'C2BGWCAG2AACompliant', 'C2BGWCAG2AACompliant18p', 'C2BGWCAG2AAACompliant', 'C2BGWCAG2AAACompliant18p');
    blr.W15yQC.ContrastDialog.setResults(lrc1rc2, 'C1C2WCAG2AACompliant', 'C1C2WCAG2AACompliant18p', 'C1C2WCAG2AAACompliant', 'C1C2WCAG2AAACompliant18p');

    if1 = document.getElementById("iframeC1BG");
    c1 = blr.W15yQC.ContrastDialog.fnGetColorString(blr.W15yQC.ContrastDialog.fgc1);
    c2 = blr.W15yQC.ContrastDialog.fnGetColorString(blr.W15yQC.ContrastDialog.fgc2);
    bg = blr.W15yQC.ContrastDialog.fnGetColorString(blr.W15yQC.ContrastDialog.bgc);
    if1.contentDocument.body.style.color = c1;
    if1.contentDocument.body.style.backgroundColor = bg;
    if1.contentDocument.body.style.margin = '0';
    if1.contentDocument.body.style.padding = '0';

    while (if1.contentDocument.body.firstChild) {
      if1.contentDocument.body.removeChild(if1.contentDocument.body.firstChild);
    }
    el1 = if1.contentDocument.createElement('p');
    el1.setAttribute('style', 'margin:0;padding:4px;font-size:12pt');
    el1.appendChild(if1.contentDocument.createTextNode('Example text at 12 points. ')); // TODO: i18n this!
    el2 = if1.contentDocument.createElement('i');
    el1.appendChild(if1.contentDocument.createTextNode('Example text in italic. '));
    el1.appendChild(el2);
    el2 = if1.contentDocument.createElement('b');
    el2.appendChild(if1.contentDocument.createTextNode('Example text in bold.'));
    el1.appendChild(el2);
    if1.contentDocument.body.appendChild(el1);

    if2 = document.getElementById("iframeC2BG");
    if2.contentDocument.body.style.color = c2;
    if2.contentDocument.body.style.backgroundColor = bg;
    if2.contentDocument.body.style.margin = '0';
    if2.contentDocument.body.style.padding = '0';

    while (if2.contentDocument.body.firstChild) {
      if2.contentDocument.body.removeChild(if2.contentDocument.body.firstChild);
    }
    el1 = if2.contentDocument.createElement('p');
    el1.setAttribute('style', 'margin:0;padding:4px;font-size:12pt');
    el1.appendChild(if2.contentDocument.createTextNode('Example text at 12 points. ')); // TODO: i18n this!
    el2 = if2.contentDocument.createElement('i');
    el1.appendChild(if2.contentDocument.createTextNode('Example text in italic. '));
    el1.appendChild(el2);
    el2 = if2.contentDocument.createElement('b');
    el2.appendChild(if2.contentDocument.createTextNode('Example text in bold.'));
    el1.appendChild(el2);
    if2.contentDocument.body.appendChild(el1);

    if3 = document.getElementById("iframeC1C2");
    if3.contentDocument.body.style.color = c1;
    if3.contentDocument.body.style.backgroundColor = bg;
    if3.contentDocument.body.style.margin = '0';
    if3.contentDocument.body.style.padding = '7px';

    while (if3.contentDocument.body.firstChild) {
      if3.contentDocument.body.removeChild(if3.contentDocument.body.firstChild);
    }

    el1 = if3.contentDocument.createElement('div');
    el1.setAttribute('style', 'width:16px;height:16px;background-color:' + c1 + ';margin:3px;float:left');
    if3.contentDocument.body.appendChild(el1);

    el1 = if3.contentDocument.createElement('div');
    el1.setAttribute('style', 'width:16px;height:16px;background-color:' + c2 + ';margin:3px;float:left');
    if3.contentDocument.body.appendChild(el1);

    el1 = if3.contentDocument.createElement('div');
    el1.setAttribute('style', 'color:' + c1 + ';float:right;width:210px');
    el1.appendChild(if3.contentDocument.createTextNode('This has '));
    el2 = if3.contentDocument.createElement('span');
    el2.setAttribute('style', 'color:' + c2);
    el2.appendChild(if3.contentDocument.createTextNode('two different'));
    el1.appendChild(el2);
    el1.appendChild(if3.contentDocument.createTextNode(' colors in it.'));
    if3.contentDocument.body.appendChild(el1);

    blr.W15yQC.ContrastDialog.fnComputePassingRGBValues(4.5);
    window.clearTimeout(blr.W15yQC.ContrastDialog.updateColorHistoryChangeFilterTimerID);
    blr.W15yQC.ContrastDialog.updateColorHistoryChangeFilterTimerID=window.setTimeout(function(){blr.W15yQC.ContrastDialog.fnUpdateColorHistory();},100);
  },

  setResults: function (lRatio, id1, id2, id3, id4) {
    document.getElementById(id1).value = (lRatio >= 4.5) ? 'Yes' : 'No';
    document.getElementById(id2).value = (lRatio >= 3) ? 'Yes' : 'No';
    document.getElementById(id3).value = (lRatio >= 7) ? 'Yes' : 'No';
    document.getElementById(id4).value = (lRatio >= 4.5) ? 'Yes' : 'No';
    document.getElementById(id1).style.backgroundColor = (lRatio >= 4.5) ? '#FDFDFD' : '#FFA6A6';
    document.getElementById(id2).style.backgroundColor = (lRatio >= 3) ? '#FDFDFD' : '#FFA6A6';
    document.getElementById(id3).style.backgroundColor = (lRatio >= 7) ? '#FDFDFD' : '#FFA6A6';
    document.getElementById(id4).style.backgroundColor = (lRatio >= 4.5) ? '#FDFDFD' : '#FFA6A6';
  },

  addSecondColor: function (force) {
    var gbColor2 = document.getElementById('gbColor2'),
      resultsC1C2 = document.getElementById('resultsC1C2'),
      resultsC2BG = document.getElementById('resultsC2BG'),
      buttonaddColor = document.getElementById('button-addColor');
    if((force==null && blr.W15yQC.ContrastDialog.color2enabled ==  false) || (force != null && force==true)) {
        gbColor2.hidden = false;
        resultsC1C2.hidden = false;
        resultsC2BG.hidden = false;
        blr.W15yQC.ContrastDialog.color2enabled = true;
        buttonaddColor.label = 'Remove Second Color';
    } else {
        gbColor2.hidden = true;
        resultsC1C2.hidden = true;
        resultsC2BG.hidden = true;
        blr.W15yQC.ContrastDialog.color2enabled=false;
        buttonaddColor.label = 'Add Second Color';
    }
    blr.W15yQC.ContrastDialog.fnComputePassingRGBValues(4.5);
  },

  fnStoreColorValues: function() {
    var c1=document.getElementById('tbHTMLColor1').value,
        c2=document.getElementById('tbHTMLColor2').value,
        bgc=document.getElementById('tbHTMLColorBG').value, i,
        treeitem, treerow, treecell, tbc;
        
    if(blr.W15yQC.ContrastDialog.storedColors==null) {
        blr.W15yQC.ContrastDialog.storedColors=[];
    }
    for(i=0;i<blr.W15yQC.ContrastDialog.storedColors.length; i++) {
        if(blr.W15yQC.ContrastDialog.storedColors[i][0]==c1 &&
           blr.W15yQC.ContrastDialog.storedColors[i][1]==c2 &&
           blr.W15yQC.ContrastDialog.storedColors[i][2]==bgc &&
           blr.W15yQC.ContrastDialog.storedColors[i][3]==blr.W15yQC.ContrastDialog.color2enabled) {
            return;
        }
    }
    blr.W15yQC.ContrastDialog.storedColors.push([c1, c2, bgc,
                                                 blr.W15yQC.ContrastDialog.color2enabled,
                                                 document.getElementById('resultsC1BGContrast').value,
                                                 document.getElementById('resultsC2BGContrast').value,
                                                 document.getElementById('resultsC1C2Contrast').value
                                               ]);

    treeitem = document.createElement('treeitem');
    treerow = document.createElement('treerow');
    treecell = document.createElement('treecell');
    tbc = document.getElementById('treeboxChildren');

    treecell.setAttribute('label', i + 1);
    treerow.appendChild(treecell);

    treecell = document.createElement('treecell');
    treecell.setAttribute('label', c1);
    treerow.appendChild(treecell);
    
    treecell = document.createElement('treecell');
    treecell.setAttribute('label', blr.W15yQC.ContrastDialog.color2enabled ? c2 : '-' );
    treerow.appendChild(treecell);
    
    treecell = document.createElement('treecell');
    treecell.setAttribute('label', bgc);
    treerow.appendChild(treecell);
    
    treecell = document.createElement('treecell');
    treecell.setAttribute('label', document.getElementById('resultsC1BGContrast').value);
    treerow.appendChild(treecell);
    
    treecell = document.createElement('treecell');
    treecell.setAttribute('label', blr.W15yQC.ContrastDialog.color2enabled ? document.getElementById('resultsC2BGContrast').value : '-');
    treerow.appendChild(treecell);
    
    treecell = document.createElement('treecell');
    treecell.setAttribute('label', blr.W15yQC.ContrastDialog.color2enabled ? document.getElementById('resultsC1C2Contrast').value : '-');
    treerow.appendChild(treecell);

    treeitem.appendChild(treerow);
    tbc.appendChild(treeitem);
    document.getElementById('savedColors').hidden=false;
    document.getElementById('vb').height=594;
    blr.W15yQC.ContrastDialog.forceMinSize();
    document.getElementById('treebox').treeBoxObject.ensureRowIsVisible(blr.W15yQC.ContrastDialog.storedColors.length);
    if(blr.W15yQC.ContrastDialog.storedColors.length>2) {
        document.getElementById('treebox').treeBoxObject.ensureRowIsVisible(blr.W15yQC.ContrastDialog.storedColors.length-3);
    }
    document.getElementById('treebox').view.selection.select(blr.W15yQC.ContrastDialog.storedColors.length);
    if(blr.W15yQC.ContrastDialog.color2enabled) {
        document.getElementById('col-header-c2').setAttribute('hidden','false');
        document.getElementById('col-header-lcc2bg').setAttribute('hidden','false');
        document.getElementById('col-header-lcc1c2').setAttribute('hidden','false');
    }
  },
  
  fnSetColorsToSelectedStoredColors: function() {
    var treebox = document.getElementById('treebox'), selectedRow = treebox.currentIndex;
    
    if (isNaN(selectedRow) == false && selectedRow >= 0 && selectedRow<blr.W15yQC.ContrastDialog.storedColors.length) {
        blr.W15yQC.ContrastDialog.fnColor1HTMLColorChange(blr.W15yQC.ContrastDialog.storedColors[selectedRow][0]);
        blr.W15yQC.ContrastDialog.fnColor2HTMLColorChange(blr.W15yQC.ContrastDialog.storedColors[selectedRow][1]);
        blr.W15yQC.ContrastDialog.fnBGHTMLColorChange(blr.W15yQC.ContrastDialog.storedColors[selectedRow][2]);
        blr.W15yQC.ContrastDialog.addSecondColor(blr.W15yQC.ContrastDialog.storedColors[selectedRow][3]);
        blr.W15yQC.ContrastDialog.fnUpdateContrastValuesDisplay();
    }
    
  },

  fnDeleteSelectedStoredColor: function() {
    var treebox=document.getElementById('treebox'),
      selectedRow = treebox.currentIndex,
      row;

    if(selectedRow>=0) {
      blr.W15yQC.ContrastDialog.storedColors.splice(selectedRow,1);
      row=treebox.getElementsByTagName('treeitem')[selectedRow];
      if(row!=null) {
        row.parentNode.removeChild(row);
      }
    }
  },  
  
  fnSaveStoredColors: function() {
    var dialogID = 'SavedColorsWindow',
        dialogPath = 'chrome://W15yQC/content/SavedColorsWindow.xul';
    window.openDialog(dialogPath, dialogID, 'chrome,resizable=yes,centerscreen,modal',blr,blr.W15yQC.ContrastDialog.storedColors);
  },
  
  cleanup: function () {}

};