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
  fgc1: 0,
  fgc2: 0,
  fgc3: 0,
  bgc: 0,
  color2enabled: false,
  computeClosestColorsFilter: null,

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
  },

  forceMinSize: function (dialog) {
    if (dialog.outerWidth > 100 && dialog.outerHeight > 100 && (dialog.outerWidth < 940 || dialog.outerHeight != 610)) {
      dialog.resizeTo(Math.max(940, dialog.outerWidth), 610);
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
  
  fnFindClosestPassingColor1: function(minLR) {
    var r, g, b, d, dr, db, dg, drll, drhl, dgll, dghl, dbll, dbhl,
    r1, g1, b1, r2, g2, b2, rbg, gbr, bbg,
    c, lr1, lr2,
    colors=[[0,0,0],[255,255,255],[255,0,0],[0,255,255]];

    r1 = parseInt(document.getElementById('sRed1').value, 10);
    g1 = parseInt(document.getElementById('sGreen1').value, 10);
    b1 = parseInt(document.getElementById('sBlue1').value, 10);
    
    if(blr.W15yQC.ContrastDialog.color2enabled==true) {
        r2 = parseInt(document.getElementById('sRed2').value, 10);
        g2 = parseInt(document.getElementById('sGreen2').value, 10);
        b2 = parseInt(document.getElementById('sBlue2').value, 10);
    } else {
        r2 = 0;
        g2 = 0;
        b2 = 0;
    }
    
    rbg = parseInt(document.getElementById('sRedBG').value, 10);
    gbg = parseInt(document.getElementById('sGreenBG').value, 10);
    bbg = parseInt(document.getElementById('sBlueBG').value, 10);
    
    bestR=null;
    bestG=null;
    bestB=null;
    bestColorDistance=1000000;
    if(blr.W15yQC.ContrastDialog.fnComputeWCAG2LuminosityRatio(r1, g1, b1, rbg, gbg, bbg)<minLR) {
        for(d=2; d<100; d+=2) {
            drll = r1-d >= 0 ? r1-d : 0;
            drhl = r1+d <= 255 ? r1+d : 255;
            dgll = g1-d >= 0 ? g1-d : 0;
            dghl = g1+d <= 255 ? g1+d : 255;
            dbll = b1-d >= 0 ? b1-d : 0;
            dbhl = b1+d <= 255 ? b1+d : 255;
            if(bestR!=null) { // check if we are done looking for closer passing color
                if(blr.W15yQC.ContrastDialog.fnComputeColorDistance(drll,g1,b1, r1,g1,b1) >= bestColorDistance &&
                   blr.W15yQC.ContrastDialog.fnComputeColorDistance(drhl,g1,b1, r1,g1,b1) >= bestColorDistance &&
                   blr.W15yQC.ContrastDialog.fnComputeColorDistance(r1,dgll,b1, r1,g1,b1) >= bestColorDistance &&
                   blr.W15yQC.ContrastDialog.fnComputeColorDistance(r1,dghl,b1, r1,g1,b1) >= bestColorDistance &&
                   blr.W15yQC.ContrastDialog.fnComputeColorDistance(r1,g1,dbll, r1,g1,b1) >= bestColorDistance &&
                   blr.W15yQC.ContrastDialog.fnComputeColorDistance(r1,g1,dbhl, r1,g1,b1) >= bestColorDistance ) {
                    break; // Won't be finding anything closer
                }
            }
            for(dr=drll; dr<=drhl; dr=dr+d+d)  {
                for(dg=dgll; dg<=dghl; dg++) 
                  for(db=dbll; db<=dbhl; db+=2) {
                    lr1=blr.W15yQC.ContrastDialog.fnComputeWCAG2LuminosityRatio(dr, dg, db, rbg, gbg, bbg);
                    if(blr.W15yQC.ContrastDialog.color2enabled==true && lr1>=minLR) {
                        lr2=blr.W15yQC.ContrastDialog.fnComputeWCAG2LuminosityRatio(dr, dg, db, r2, g2, b2);
                        if(lr2>=minLR) {
                            cd=blr.W15yQC.ContrastDialog.fnComputeColorDistance(dr,dg,db,r1,g1,b1);
                            if(cd<bestColorDistance) {
                                cd=bestColorDistance;
                                bestR=dr;
                                bestG=dg;
                                bestB=db;
                            }
                        }
                    } else if(lr1>=minLR) {
                        cd=blr.W15yQC.ContrastDialog.fnComputeColorDistance(dr,dg,db,r1,g1,b1);
                        if(cd<bestColorDistance) {
                            cd=bestColorDistance;
                            bestR=dr;
                            bestG=dg;
                            bestB=db;
                        }
                    }
                  }
            }
            for(dg=dgll; dg<=dghl; dg=dg+d+d)  {
                for(dr=drll; dr<=drhl; dr++) 
                  for(db=dbll; db<=dbhl; db+=2) {
                    lr1=blr.W15yQC.ContrastDialog.fnComputeWCAG2LuminosityRatio(dr, dg, db, rbg, gbg, bbg);
                    if(blr.W15yQC.ContrastDialog.color2enabled==true && lr1>=minLR) {
                        lr2=blr.W15yQC.ContrastDialog.fnComputeWCAG2LuminosityRatio(dr, dg, db, r2, g2, b2);
                        if(lr2>=minLR) {
                            cd=blr.W15yQC.ContrastDialog.fnComputeColorDistance(dr,dg,db,r1,g1,b1);
                            if(cd<bestColorDistance) {
                                cd=bestColorDistance;
                                bestR=dr;
                                bestG=dg;
                                bestB=db;
                            }
                        }
                    } else if(lr1>=minLR) {
                        cd=blr.W15yQC.ContrastDialog.fnComputeColorDistance(dr,dg,db,r1,g1,b1);
                        if(cd<bestColorDistance) {
                            cd=bestColorDistance;
                            bestR=dr;
                            bestG=dg;
                            bestB=db;
                        }
                    }
                  }
            }
            for(db=dbll; db<=dbhl; db=db+d+d)  {
                for(dr=drll; dr<=drhl; dr++) 
                  for(dg=dgll; dg<=dghl; dg+=2) {
                    lr1=blr.W15yQC.ContrastDialog.fnComputeWCAG2LuminosityRatio(dr, dg, db, rbg, gbg, bbg);
                    if(blr.W15yQC.ContrastDialog.color2enabled==true && lr1>=minLR) {
                        lr2=blr.W15yQC.ContrastDialog.fnComputeWCAG2LuminosityRatio(dr, dg, db, r2, g2, b2);
                        if(lr2>=minLR) {
                            cd=blr.W15yQC.ContrastDialog.fnComputeColorDistance(dr,dg,db,r1,g1,b1);
                            if(cd<bestColorDistance) {
                                cd=bestColorDistance;
                                bestR=dr;
                                bestG=dg;
                                bestB=db;
                            }
                        }
                    } else if(lr1>=minLR) {
                        cd=blr.W15yQC.ContrastDialog.fnComputeColorDistance(dr,dg,db,r1,g1,b1);
                        if(cd<bestColorDistance) {
                            cd=bestColorDistance;
                            bestR=dr;
                            bestG=dg;
                            bestB=db;
                        }
                    }
                  }
            }
        }
    }

    if(bestR != null) {
        // setup button with best color  button-C1Closest
        document.getElementById('button-C1Closest').label=blr.W15yQC.ContrastDialog.fnGetColorString(bestR*65536+bestG*256+bestB);
        document.getElementById('button-C1Closest').style.backgroundColor='rgb('+bestR.toString()+','+bestG.toString()+','+bestB.toString()+')';
        document.getElementById('button-C1Closest').style.color=blr.W15yQC.ContrastDialog.fnPickHighestContrastColor(bestR, bestG, bestB, colors);        
        document.getElementById('button-C1Closest').disabled=false;
    } else {
        document.getElementById('button-C1Closest').label='X';
        document.getElementById('button-C1Closest').style.backgroundColor='inherit';
        document.getElementById('button-C1Closest').style.color='#000000';
        document.getElementById('button-C1Closest').disabled=true;
    }
    return;
  },
  
  fnPickHighestContrastColor: function(r,g,b,colors) {
    var i, lr, bestLR=0, bestIndex;
    
    for(i=0;i<colors.length;i++) {
        lr=blr.W15yQC.ContrastDialog.fnComputeWCAG2LuminosityRatio(r,g,b, colors[i][0], colors[i][1], colors[i][2]);
        if(colors[i][0]==0 && colors[i][1]==0 && colors[i][2]==0) { lr=lr*0.8; } 
        if(lr>bestLR) {
            bestLR=lr;
            bestIndex=i;
        }
    }
    return 'rgb('+colors[bestIndex][0]+','+colors[bestIndex][1]+','+colors[bestIndex][2]+')';
  },
  
  fnComputePassingRGBValues: function(minLR) {
    var rLeft=null, rRight=null, gLeft=null, gRight=null, bLeft=null, bRight=null,
    r1, g1, b1, r2, g2, b2, rbg, gbr, bbg, hue, saturation, brightness, h, s, v, cr, cg, cb, rbg,
    satLeft, satRight, vLeft, vRight, hueLeft, hueRight,
    c, lr1, lr2,
    colors=[[0,0,0],[255,255,255],[255,0,0],[0,255,255]];

    r1 = parseInt(document.getElementById('sRed1').value, 10);
    g1 = parseInt(document.getElementById('sGreen1').value, 10);
    b1 = parseInt(document.getElementById('sBlue1').value, 10);
    
    hue = parseInt(document.getElementById('sHue1').value, 10);
    saturation = parseInt(document.getElementById('sSat1').value, 10);
    brightness = parseInt(document.getElementById('sBrightness1').value, 10);

    if(blr.W15yQC.ContrastDialog.color2enabled==true) {
        r2 = parseInt(document.getElementById('sRed2').value, 10);
        g2 = parseInt(document.getElementById('sGreen2').value, 10);
        b2 = parseInt(document.getElementById('sBlue2').value, 10);
    } else {
        r2 = null;
        g2 = null;
        b2 = null;
    }
    
    rbg = parseInt(document.getElementById('sRedBG').value, 10);
    gbg = parseInt(document.getElementById('sGreenBG').value, 10);
    bbg = parseInt(document.getElementById('sBlueBG').value, 10);
    
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
    
    if(hueRight!=null && hueLeft!=null && hueRight<hue && hueLeft>hue) {
        hueRight=h;
        hueRight=hueLeft;
        hueLeft=h;
    }
    
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
    
    if(rLeft!=null) {
        document.getElementById('button-C1RedLeft').label=rLeft;
        document.getElementById('button-C1RedLeft').style.backgroundColor='rgb('+rLeft.toString()+','+g1.toString()+','+b1.toString()+')';
        document.getElementById('button-C1RedLeft').style.color=blr.W15yQC.ContrastDialog.fnPickHighestContrastColor(rLeft, g1, b1, colors);
    } else {
        document.getElementById('button-C1RedLeft').label='X';
        document.getElementById('button-C1RedLeft').style.backgroundColor='inherit';
        document.getElementById('button-C1RedLeft').style.color='black';
    }
    if(rRight!=null) {
        document.getElementById('button-C1RedRight').label=rRight;
        document.getElementById('button-C1RedRight').style.backgroundColor='rgb('+rRight.toString()+','+g1.toString()+','+b1.toString()+')';
        document.getElementById('button-C1RedRight').style.color=blr.W15yQC.ContrastDialog.fnPickHighestContrastColor(rRight, g1, b1, colors);
    } else {
        document.getElementById('button-C1RedRight').label='X';
        document.getElementById('button-C1RedRight').style.backgroundColor='inherit';
        document.getElementById('button-C1RedRight').style.color='#000000';
    }
    if(gLeft!=null) {
        document.getElementById('button-C1GreenLeft').label=gLeft;
        document.getElementById('button-C1GreenLeft').style.backgroundColor='rgb('+r1.toString()+','+gLeft.toString()+','+b1.toString()+')';
        document.getElementById('button-C1GreenLeft').style.color=blr.W15yQC.ContrastDialog.fnPickHighestContrastColor(r1, gLeft, b1, colors);
    } else {
        document.getElementById('button-C1GreenLeft').label='X';
        document.getElementById('button-C1GreenLeft').style.backgroundColor='inherit';
        document.getElementById('button-C1GreenLeft').style.color='#000000';
    }
    if(gRight!=null) {
        document.getElementById('button-C1GreenRight').label=gRight;
        document.getElementById('button-C1GreenRight').style.backgroundColor='rgb('+r1.toString()+','+gRight.toString()+','+b1.toString()+')';
        document.getElementById('button-C1GreenRight').style.color=blr.W15yQC.ContrastDialog.fnPickHighestContrastColor(r1, gRight, b1, colors);
    } else {
        document.getElementById('button-C1GreenRight').label='X';
        document.getElementById('button-C1GreenRight').style.backgroundColor='inherit';
        document.getElementById('button-C1GreenRight').style.color='#000000';
    }
    if(bLeft!=null) {
        document.getElementById('button-C1BlueLeft').label=bLeft;
        document.getElementById('button-C1BlueLeft').style.backgroundColor='rgb('+r1.toString()+','+g1.toString()+','+bLeft.toString()+')';
        document.getElementById('button-C1BlueLeft').style.color=blr.W15yQC.ContrastDialog.fnPickHighestContrastColor(r1, g1, bLeft, colors);
    } else {
        document.getElementById('button-C1BlueLeft').label='X';
        document.getElementById('button-C1BlueLeft').style.backgroundColor='inherit';
        document.getElementById('button-C1BlueLeft').style.color='#000000';
    }
    if(bRight!=null) {
        document.getElementById('button-C1BlueRight').label=bRight;
        document.getElementById('button-C1BlueRight').style.backgroundColor='rgb('+r1.toString()+','+g1.toString()+','+bRight.toString()+')';
        document.getElementById('button-C1BlueRight').style.color=blr.W15yQC.ContrastDialog.fnPickHighestContrastColor(r1, g1, bRight, colors);
    } else {
        document.getElementById('button-C1BlueRight').label='X';
        document.getElementById('button-C1BlueRight').style.backgroundColor='inherit';
        document.getElementById('button-C1BlueRight').style.color='#000000';
    }

    
    if(hueLeft!=null) {
        rgb=blr.W15yQC.ContrastDialog.fnHSV2RGB(hueLeft, saturation, brightness);
        cr=rgb[0];
        cg=rgb[1];
        cb=rgb[2];
        document.getElementById('button-C1HueLeft').label=hueLeft;
        document.getElementById('button-C1HueLeft').style.backgroundColor='rgb('+cr.toString()+','+cg.toString()+','+cb.toString()+')';
        document.getElementById('button-C1HueLeft').style.color=blr.W15yQC.ContrastDialog.fnPickHighestContrastColor(cr, cg, cb, colors);
    } else {
        document.getElementById('button-C1HueLeft').label='X';
        document.getElementById('button-C1HueLeft').style.backgroundColor='inherit';
        document.getElementById('button-C1HueLeft').style.color='#000000';
    }
    if(hueRight!=null) {
        rgb=blr.W15yQC.ContrastDialog.fnHSV2RGB(hueRight, saturation, brightness);
        cr=rgb[0];
        cg=rgb[1];
        cb=rgb[2];
        document.getElementById('button-C1HueRight').label=hueRight;
        document.getElementById('button-C1HueRight').style.backgroundColor='rgb('+cr.toString()+','+cg.toString()+','+cb.toString()+')';
        document.getElementById('button-C1HueRight').style.color=blr.W15yQC.ContrastDialog.fnPickHighestContrastColor(cr, cg, cb, colors);
    } else {
        document.getElementById('button-C1HueRight').label='X';
        document.getElementById('button-C1HueRight').style.backgroundColor='inherit';
        document.getElementById('button-C1HueRight').style.color='#000000';
    }
    
    
    if(vLeft!=null) {
        rgb=blr.W15yQC.ContrastDialog.fnHSV2RGB(hue, saturation, vLeft);
        cr=rgb[0];
        cg=rgb[1];
        cb=rgb[2];
        document.getElementById('button-C1VLeft').label=vLeft;
        document.getElementById('button-C1VLeft').style.backgroundColor='rgb('+cr.toString()+','+cg.toString()+','+cb.toString()+')';
        document.getElementById('button-C1VLeft').style.color=blr.W15yQC.ContrastDialog.fnPickHighestContrastColor(cr, cg, cb, colors);
    } else {
        document.getElementById('button-C1VLeft').label='X';
        document.getElementById('button-C1VLeft').style.backgroundColor='inherit';
        document.getElementById('button-C1VLeft').style.color='#000000';
    }
    if(vRight!=null) {
        rgb=blr.W15yQC.ContrastDialog.fnHSV2RGB(hue, saturation, vRight);
        cr=rgb[0];
        cg=rgb[1];
        cb=rgb[2];
        document.getElementById('button-C1VRight').label=vRight;
        document.getElementById('button-C1VRight').style.backgroundColor='rgb('+cr.toString()+','+cg.toString()+','+cb.toString()+')';
        document.getElementById('button-C1VRight').style.color=blr.W15yQC.ContrastDialog.fnPickHighestContrastColor(cr, cg, cb, colors);
    } else {
        document.getElementById('button-C1VRight').label='X';
        document.getElementById('button-C1VRight').style.backgroundColor='inherit';
        document.getElementById('button-C1VRight').style.color='#000000';
    }
    
    if(satLeft!=null) {
        rgb=blr.W15yQC.ContrastDialog.fnHSV2RGB(hue, satLeft, brightness);
        cr=rgb[0];
        cg=rgb[1];
        cb=rgb[2];
        document.getElementById('button-C1SatLeft').label=satLeft;
        document.getElementById('button-C1SatLeft').style.backgroundColor='rgb('+cr.toString()+','+cg.toString()+','+cb.toString()+')';
        document.getElementById('button-C1SatLeft').style.color=blr.W15yQC.ContrastDialog.fnPickHighestContrastColor(cr, cg, cb, colors);
    } else {
        document.getElementById('button-C1SatLeft').label='X';
        document.getElementById('button-C1SatLeft').style.backgroundColor='inherit';
        document.getElementById('button-C1SatLeft').style.color='#000000';
    }
    if(satRight!=null) {
        rgb=blr.W15yQC.ContrastDialog.fnHSV2RGB(hue, satRight, brightness);
        cr=rgb[0];
        cg=rgb[1];
        cb=rgb[2];
        document.getElementById('button-C1SatRight').label=satRight;
        document.getElementById('button-C1SatRight').style.backgroundColor='rgb('+cr.toString()+','+cg.toString()+','+cb.toString()+')';
        document.getElementById('button-C1SatRight').style.color=blr.W15yQC.ContrastDialog.fnPickHighestContrastColor(cr, cg, cb, colors);
    } else {
        document.getElementById('button-C1SatRight').label='X';
        document.getElementById('button-C1SatRight').style.backgroundColor='inherit';
        document.getElementById('button-C1SatRight').style.color='#000000';
    }
    
  },

  selectC1Closest: function(c) {
    switch(c) {
        case 'X':
            return;
            break;
        case 'Find':
            blr.W15yQC.ContrastDialog.fnFindClosestPassingColor1(4.5);
            break;
        default:
            blr.W15yQC.ContrastDialog.fnColor1HTMLColorChange(c);
    }
  },
  
  selectC1Red: function(c) {
    var r,g,b, cNew;
      r = parseInt(c,10);
      g = parseInt(document.getElementById('sGreen1').value, 10);
      b = parseInt(document.getElementById('sBlue1').value, 10);
      cNew = r * 65536 + g * 256 + b;
      blr.W15yQC.ContrastDialog.fnColor1HTMLColorChange(blr.W15yQC.ContrastDialog.fnGetColorString(cNew));
  },
  
  selectC1Green: function(c) {
    var r,g,b, cNew;
      r = parseInt(document.getElementById('sRed1').value, 10);
      g = parseInt(c,10);
      b = parseInt(document.getElementById('sBlue1').value, 10);
      cNew = r * 65536 + g * 256 + b;
      blr.W15yQC.ContrastDialog.fnColor1HTMLColorChange(blr.W15yQC.ContrastDialog.fnGetColorString(cNew));
  },
  
  selectC1Blue: function(c) {
    var r,g,b, cNew;
      r = parseInt(document.getElementById('sRed1').value, 10);
      g = parseInt(document.getElementById('sGreen1').value, 10);
      b = parseInt(c,10);
      cNew = r * 65536 + g * 256 + b;
      blr.W15yQC.ContrastDialog.fnColor1HTMLColorChange(blr.W15yQC.ContrastDialog.fnGetColorString(cNew));
  },
  
  
  selectC1Hue: function(c) {
    c = parseInt(c,10);
    document.getElementById('sHue1').value=c;
    blr.W15yQC.ContrastDialog.fnColor1HSBChange();
  },
  
  
  selectC1Saturation: function(c) {
    c = parseInt(c,10);
    document.getElementById('sSat1').value=c;
    blr.W15yQC.ContrastDialog.fnColor1HSBChange();
  },
  
  
  selectC1Brightness: function(c) {
    c = parseInt(c,10);
    document.getElementById('sBrightness1').value=c;
    blr.W15yQC.ContrastDialog.fnColor1HSBChange();
  },
  
  // ----- Color 1

  fnColor1HTMLColorChange: function (newColor) {
    var RGB, r, g, b;
    if (blr.W15yQC.ContrastDialog.updatingValues == false) {
      if (newColor != null) document.getElementById('tbHTMLColor1').value = newColor;
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

  fnColor2HTMLColorChange: function () {
    var RGB, r, g, b;
    if (blr.W15yQC.ContrastDialog.updatingValues == false) {
      blr.W15yQC.ContrastDialog.updatingValues = true;
      RGB = blr.W15yQC.ContrastDialog.fnRGBFromHTMLColor(document.getElementById('tbHTMLColor2').value);
      r = document.getElementById('sRed2').value = RGB[0];
      g = document.getElementById('sGreen2').value = RGB[1];
      b = document.getElementById('sBlue2').value = RGB[2];
      blr.W15yQC.ContrastDialog.fgc2 = r * 65536 + g * 256 + b;
      document.getElementById('tbHTMLColor2').value = blr.W15yQC.ContrastDialog.fnGetColorString(blr.W15yQC.ContrastDialog.fgc2);
      document.getElementById('cp1').color = document.getElementById('tbHTMLColor1').value;
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
      document.getElementById('cp2').color = document.getElementById('tbHTMLColor2').value;
      document.getElementById('tbHTMLColor2').value = blr.W15yQC.ContrastDialog.fnGetColorString(blr.W15yQC.ContrastDialog.fgc2);
      blr.W15yQC.ContrastDialog.fnUpdateContrastValuesDisplay();
      blr.W15yQC.ContrastDialog.updatingValues = false;
    }
  },

  // ------ BG Color

  fnBGHTMLColorChange: function (newColor) {
    var RGB, r, g, b;
    if (blr.W15yQC.ContrastDialog.updatingValues == false) {
      if (newColor != null) document.getElementById('tbHTMLColorBG').value = newColor;
      blr.W15yQC.ContrastDialog.updatingValues = true;
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
    
    //if(lrc1bg<4.5) {
    //    document.getElementById('button-C1Closest').label='Find';
    //    document.getElementById('button-C1Closest').style.backgroundColor='inherit';
    //    document.getElementById('button-C1Closest').style.color='#000000';
    //    document.getElementById('button-C1Closest').disabled=false;
    //} else {
    //    document.getElementById('button-C1Closest').label='X';
    //    document.getElementById('button-C1Closest').style.backgroundColor='inherit';
    //    document.getElementById('button-C1Closest').style.color='#000000';
    //    document.getElementById('button-C1Closest').disabled=true;
    //}
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

  addSecondColor: function () {
    var gbColor2 = document.getElementById('gbColor2'),
      resultsC1C2 = document.getElementById('resultsC1C2'),
      resultsC2BG = document.getElementById('resultsC2BG'),
      buttonaddColor = document.getElementById('button-addColor');
    gbColor2.hidden = false;
    resultsC1C2.hidden = false;
    resultsC2BG.hidden = false;
    buttonaddColor.hidden = true;
    blr.W15yQC.ContrastDialog.color2enabled=true;
    blr.W15yQC.ContrastDialog.fnComputePassingRGBValues(4.5);
  },

  cleanup: function () {}

};