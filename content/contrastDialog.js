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
if (!blr) { var blr = {}; }

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
    
    init: function(dialog) {
        blr.W15yQC.fnReadUserPrefs();
        if(dialog!=null && dialog.arguments != null && dialog.arguments.length>2) {
            blr.W15yQC.ContrastDialog.fnColor1HTMLColorChange(dialog.arguments[1]);
            blr.W15yQC.ContrastDialog.fnBGHTMLColorChange(dialog.arguments[2]);
        }
        blr.W15yQC.ContrastDialog.fnColor1SliderChange();
        blr.W15yQC.ContrastDialog.fnColor2SliderChange();
        blr.W15yQC.ContrastDialog.fnBGSliderChange();
        blr.W15yQC.ContrastDialog.fnUpdateContrastValuesDisplay();
    },
    
    forceMinSize: function(dialog) {
        if(dialog.outerWidth>100 && dialog.outerHeight>100 && (dialog.outerWidth<940 || dialog.outerHeight!=610)) { dialog.resizeTo(Math.max(940,dialog.outerWidth),610); }
        var rect, width,
            gbc1=document.getElementById('gbColor1'),
            resultsC1BG=document.getElementById('resultsC1BG'); 
        if(gbc1!=null && resultsC1BG!=null) {
            rect = gbc1.getBoundingClientRect();
            if(rect!=null) {
                width=rect.right-rect.left;
                if(width>50) {
                    resultsC1BG.setAttribute('style','max-width:'+width.toString()+'px');
                }
            }
        }
    },
    
    fnGetColorString: function(ic) {
        return '#'+('000000'+ic.toString(16)).substr(-6).toUpperCase();
    },

    fnComputeHueFromRGB: function(r,g,b) {
        var h = 57.2957795130823*Math.atan2(1.73205080756888*(g-b),2*r-g-b);
        while(h<0) {
            h=h+360;
        }
        while(h>=360) {
            h=h-360;
        }
        return h;
    },
    
    fnComputeSaturationFromRGB: function(r,g,b) {
        var minRGB = r, maxRGB = r;
        if(g>maxRGB) maxRGB = g;
        if(b>maxRGB) maxRGB = b;
        if(g<minRGB) minRGB = g;
        if(b<minRGB) minRGB = b;
        
        if(maxRGB<0.01) return 0;
        return 100*(maxRGB-minRGB)/maxRGB;
    },
    
    fnComputeBrightnessFromRGB: function(r,g,b) {
        var maxRGB = r;
        if(g>maxRGB) maxRGB = g;
        if(b>maxRGB) maxRGB = b;
        return maxRGB/2.55;
    },
    
    fnRGBFromHTMLColor: function(sHTMLColor) {
        var m;
        if(sHTMLColor != null && sHTMLColor.match) {
        m = sHTMLColor.match(/^\s*#?(([abcdef0-9])([abcdef0-9])([abcdef0-9])|([abcdef0-9][abcdef0-9])([abcdef0-9][abcdef0-9])([abcdef0-9][abcdef0-9]))\s*$/i);
        if(m != null) {
            if(m[2] == undefined) {
                return [parseInt(m[5],16),parseInt(m[6],16),parseInt(m[7],16)];
            } else {
                return [parseInt(m[2]+m[2],16),parseInt(m[3]+m[3],16),parseInt(m[4]+m[4],16)];			}
            }
        }
        return [0,0,0];
    },
    
    fnHSV2RGB: function(h,s,v) {
            var r, g, b,
                i, f, p, q, t;
             
            s= s / 100;
            v= v / 100;
            if(h>=360) {
                h=h-360;
            }
             
            if(s < 0.001) {
                r = g = b = v;
            } else {
                h /= 60; // sector 0 to 5
                i = Math.floor(h);
                f = h - i; // decimal part of h
                p = v * (1 - s);
                q = v * (1 - s * f);
                t = v * (1 - s * (1 - f));
                 
                switch(i) {
                    case 0: r = v; g = t; b = p;
                    break;
                    case 1: r = q; g = v; b = p;
                    break;
                    case 2: r = p; g = v; b = t;
                    break;
                    case 3: r = p; g = q; b = v;
                    break;
                    case 4: r = t; g = p; b = v;
                    break;
                    default: r = v; g = p; b = q;
                }
            }
             
            r = Math.round(r * 255);
            g = Math.round(g * 255);
            b = Math.round(b * 255);
            return [r,g,b];
    },

    fnCalculateLuminance: function(r,g,b){
        r = r <= 0.03928 ? r / 12.92 : Math.pow(((r+0.055)/1.055), 2.4);
        g = g <= 0.03928 ? g / 12.92 : Math.pow(((g+0.055)/1.055), 2.4);
        b = b <= 0.03928 ? b / 12.92 : Math.pow(((b+0.055)/1.055), 2.4);
        return 0.2126*r + 0.7152*g + 0.0722*b;
    },

    fnComputeWCAG2LuminosityRatio: function(r1,g1,b1, r2,g2,b2) {
        var l1 = blr.W15yQC.ContrastDialog.fnCalculateLuminance(r1/255, g1/255, b1/255),
            l2 = blr.W15yQC.ContrastDialog.fnCalculateLuminance(r2/255, g2/255, b2/255);
        return Math.round(((l1 >= l2) ? (l1 + .05) / (l2 + .05) : (l2 + .05) / (l1 + .05)) *100) / 100;
    },
    
    
// ----- Color 1

    fnColor1HTMLColorChange: function(newColor) {
        var RGB, r, g, b;
        if(blr.W15yQC.ContrastDialog.updatingValues==false) {
            if(newColor!=null) document.getElementById('tbHTMLColor1').value=newColor;
            blr.W15yQC.ContrastDialog.updatingValues = true;
            RGB = blr.W15yQC.ContrastDialog.fnRGBFromHTMLColor(document.getElementById('tbHTMLColor1').value);
            r = document.getElementById('sRed1').value = RGB[0];
            g = document.getElementById('sGreen1').value = RGB[1];
            b = document.getElementById('sBlue1').value = RGB[2];
            blr.W15yQC.ContrastDialog.fgc1 = r*65536+g*256+b;
            document.getElementById('tbHTMLColor1').value = blr.W15yQC.ContrastDialog.fnGetColorString(blr.W15yQC.ContrastDialog.fgc1);
            document.getElementById('cp1').color = document.getElementById('tbHTMLColor1').value;
            document.getElementById('sHue1').value = blr.W15yQC.ContrastDialog.fnComputeHueFromRGB(r,g,b);
            document.getElementById('sSat1').value = blr.W15yQC.ContrastDialog.fnComputeSaturationFromRGB(r,g,b);
            document.getElementById('sBrightness1').value = blr.W15yQC.ContrastDialog.fnComputeBrightnessFromRGB(r,g,b);
            blr.W15yQC.ContrastDialog.fnUpdateContrastValuesDisplay();
            blr.W15yQC.ContrastDialog.updatingValues = false;
        }
    },

    fnColor1ColorPickerChange: function() {
        var RGB, r, g, b;
        if(blr.W15yQC.ContrastDialog.updatingValues==false) {
            blr.W15yQC.ContrastDialog.updatingValues = true;
            RGB = blr.W15yQC.ContrastDialog.fnRGBFromHTMLColor(document.getElementById('cp1').color);
            r = document.getElementById('sRed1').value = RGB[0];
            g = document.getElementById('sGreen1').value = RGB[1];
            b = document.getElementById('sBlue1').value = RGB[2];
            blr.W15yQC.ContrastDialog.fgc1 = r*65536+g*256+b;
            document.getElementById('tbHTMLColor1').value = blr.W15yQC.ContrastDialog.fnGetColorString(blr.W15yQC.ContrastDialog.fgc1);
            //document.getElementById('cp1').color = blr.W15yQC.ContrastDialog.fnGetColorString(blr.W15yQC.ContrastDialog.fgc1);
            document.getElementById('sHue1').value = blr.W15yQC.ContrastDialog.fnComputeHueFromRGB(r,g,b);
            document.getElementById('sSat1').value = blr.W15yQC.ContrastDialog.fnComputeSaturationFromRGB(r,g,b);
            document.getElementById('sBrightness1').value = blr.W15yQC.ContrastDialog.fnComputeBrightnessFromRGB(r,g,b);
            blr.W15yQC.ContrastDialog.fnUpdateContrastValuesDisplay();
            blr.W15yQC.ContrastDialog.updatingValues = false;
        }
    },
    
    fnColor1SliderChange: function() {
        var r, g, b;
        if(blr.W15yQC.ContrastDialog.updatingValues==false) {
            blr.W15yQC.ContrastDialog.updatingValues = true;
            r = parseInt(document.getElementById('sRed1').value,10);
            g = parseInt(document.getElementById('sGreen1').value,10);
            b = parseInt(document.getElementById('sBlue1').value,10);
            
            blr.W15yQC.ContrastDialog.fgc1 = r*65536+g*256+b;
            document.getElementById('tbHTMLColor1').value = blr.W15yQC.ContrastDialog.fnGetColorString(blr.W15yQC.ContrastDialog.fgc1);
            document.getElementById('cp1').color = document.getElementById('tbHTMLColor1').value;
            document.getElementById('sHue1').value = blr.W15yQC.ContrastDialog.fnComputeHueFromRGB(r,g,b);
            document.getElementById('sSat1').value = blr.W15yQC.ContrastDialog.fnComputeSaturationFromRGB(r,g,b);
            document.getElementById('sBrightness1').value = blr.W15yQC.ContrastDialog.fnComputeBrightnessFromRGB(r,g,b);
            blr.W15yQC.ContrastDialog.fnUpdateContrastValuesDisplay();
            blr.W15yQC.ContrastDialog.updatingValues = false;
        }
    },
    
    fnColor1HSBChange: function() {
        var RGB;
        if(blr.W15yQC.ContrastDialog.updatingValues==false) {
            blr.W15yQC.ContrastDialog.updatingValues = true;
            RGB = blr.W15yQC.ContrastDialog.fnHSV2RGB(document.getElementById('sHue1').value,document.getElementById('sSat1').value,document.getElementById('sBrightness1').value);
            document.getElementById('sRed1').value = RGB[0];
            document.getElementById('sGreen1').value = RGB[1];
            document.getElementById('sBlue1').value = RGB[2];
            blr.W15yQC.ContrastDialog.fgc1 = RGB[0]*65536+RGB[1]*256+RGB[2];
            document.getElementById('tbHTMLColor1').value = blr.W15yQC.ContrastDialog.fnGetColorString(blr.W15yQC.ContrastDialog.fgc1);
            document.getElementById('cp1').color = document.getElementById('tbHTMLColor1').value;
            blr.W15yQC.ContrastDialog.fnUpdateContrastValuesDisplay();
            blr.W15yQC.ContrastDialog.updatingValues = false;
        }
    },
    
// ------ Color 2

    fnColor2HTMLColorChange: function() {
        var RGB, r, g, b;
        if(blr.W15yQC.ContrastDialog.updatingValues==false) {
            blr.W15yQC.ContrastDialog.updatingValues = true;
            RGB = blr.W15yQC.ContrastDialog.fnRGBFromHTMLColor(document.getElementById('tbHTMLColor2').value);
            r = document.getElementById('sRed2').value = RGB[0];
            g = document.getElementById('sGreen2').value = RGB[1];
            b = document.getElementById('sBlue2').value = RGB[2];
            blr.W15yQC.ContrastDialog.fgc2 = r*65536+g*256+b;
            document.getElementById('tbHTMLColor2').value = blr.W15yQC.ContrastDialog.fnGetColorString(blr.W15yQC.ContrastDialog.fgc2);
            document.getElementById('cp1').color = document.getElementById('tbHTMLColor1').value;
            document.getElementById('sHue2').value = blr.W15yQC.ContrastDialog.fnComputeHueFromRGB(r,g,b);
            document.getElementById('sSat2').value = blr.W15yQC.ContrastDialog.fnComputeSaturationFromRGB(r,g,b);
            document.getElementById('sBrightness2').value = blr.W15yQC.ContrastDialog.fnComputeBrightnessFromRGB(r,g,b);
            blr.W15yQC.ContrastDialog.fnUpdateContrastValuesDisplay();
            blr.W15yQC.ContrastDialog.updatingValues = false;
        }
    },
    
    fnColor2ColorPickerChange: function() {
        var RGB, r, g, b;
        if(blr.W15yQC.ContrastDialog.updatingValues==false) {
            blr.W15yQC.ContrastDialog.updatingValues = true;
            RGB = blr.W15yQC.ContrastDialog.fnRGBFromHTMLColor(document.getElementById('cp2').color);
            r = document.getElementById('sRed2').value = RGB[0];
            g = document.getElementById('sGreen2').value = RGB[1];
            b = document.getElementById('sBlue2').value = RGB[2];
            blr.W15yQC.ContrastDialog.fgc2 = r*65536+g*256+b;
            document.getElementById('tbHTMLColor2').value = blr.W15yQC.ContrastDialog.fnGetColorString(blr.W15yQC.ContrastDialog.fgc2);
            document.getElementById('sHue2').value = blr.W15yQC.ContrastDialog.fnComputeHueFromRGB(r,g,b);
            document.getElementById('sSat2').value = blr.W15yQC.ContrastDialog.fnComputeSaturationFromRGB(r,g,b);
            document.getElementById('sBrightness2').value = blr.W15yQC.ContrastDialog.fnComputeBrightnessFromRGB(r,g,b);
            blr.W15yQC.ContrastDialog.fnUpdateContrastValuesDisplay();
            blr.W15yQC.ContrastDialog.updatingValues = false;
        }
    },
    
    fnColor2SliderChange: function() {
        var r, g, b;
        if(blr.W15yQC.ContrastDialog.updatingValues==false) {
            blr.W15yQC.ContrastDialog.updatingValues = true;
            r = parseInt(document.getElementById('sRed2').value,10);
            g = parseInt(document.getElementById('sGreen2').value,10);
            b = parseInt(document.getElementById('sBlue2').value,10);
            
            blr.W15yQC.ContrastDialog.fgc2 = r*65536+g*256+b;
            document.getElementById('tbHTMLColor2').value = blr.W15yQC.ContrastDialog.fnGetColorString(blr.W15yQC.ContrastDialog.fgc2);
            document.getElementById('cp2').color = document.getElementById('tbHTMLColor2').value;
            document.getElementById('sHue2').value = blr.W15yQC.ContrastDialog.fnComputeHueFromRGB(r,g,b);
            document.getElementById('sSat2').value = blr.W15yQC.ContrastDialog.fnComputeSaturationFromRGB(r,g,b);
            document.getElementById('sBrightness2').value = blr.W15yQC.ContrastDialog.fnComputeBrightnessFromRGB(r,g,b);
            blr.W15yQC.ContrastDialog.fnUpdateContrastValuesDisplay();
            blr.W15yQC.ContrastDialog.updatingValues = false;
        }
    },
    
    fnColor2HSBChange: function() {
        var RGB;
        if(blr.W15yQC.ContrastDialog.updatingValues==false) {
            blr.W15yQC.ContrastDialog.updatingValues = true;
            RGB = blr.W15yQC.ContrastDialog.fnHSV2RGB(document.getElementById('sHue2').value,document.getElementById('sSat2').value,document.getElementById('sBrightness2').value);
            document.getElementById('sRed2').value = RGB[0];
            document.getElementById('sGreen2').value = RGB[1];
            document.getElementById('sBlue2').value = RGB[2];
            blr.W15yQC.ContrastDialog.fgc2 = RGB[0]*65536+RGB[1]*256+RGB[2];
            document.getElementById('cp2').color = document.getElementById('tbHTMLColor2').value;
            document.getElementById('tbHTMLColor2').value = blr.W15yQC.ContrastDialog.fnGetColorString(blr.W15yQC.ContrastDialog.fgc2);
            blr.W15yQC.ContrastDialog.fnUpdateContrastValuesDisplay();
            blr.W15yQC.ContrastDialog.updatingValues = false;
        }
    },
    
// ------ BG Color

    fnBGHTMLColorChange: function(newColor) {
        var RGB, r, g, b;
        if(blr.W15yQC.ContrastDialog.updatingValues==false) {
            if(newColor!=null) document.getElementById('tbHTMLColorBG').value=newColor;
            blr.W15yQC.ContrastDialog.updatingValues = true;
            RGB = blr.W15yQC.ContrastDialog.fnRGBFromHTMLColor(document.getElementById('tbHTMLColorBG').value);
            r = document.getElementById('sRedBG').value = RGB[0];
            g = document.getElementById('sGreenBG').value = RGB[1];
            b = document.getElementById('sBlueBG').value = RGB[2];
            blr.W15yQC.ContrastDialog.bgc = r*65536+g*256+b;
            document.getElementById('tbHTMLColorBG').value = blr.W15yQC.ContrastDialog.fnGetColorString(blr.W15yQC.ContrastDialog.bgc);
            document.getElementById('cpBG').color = document.getElementById('tbHTMLColorBG').value;
            document.getElementById('sHueBG').value = blr.W15yQC.ContrastDialog.fnComputeHueFromRGB(r,g,b);
            document.getElementById('sSatBG').value = blr.W15yQC.ContrastDialog.fnComputeSaturationFromRGB(r,g,b);
            document.getElementById('sBrightnessBG').value = blr.W15yQC.ContrastDialog.fnComputeBrightnessFromRGB(r,g,b);
            blr.W15yQC.ContrastDialog.fnUpdateContrastValuesDisplay();
            blr.W15yQC.ContrastDialog.updatingValues = false;
        }
    },
    
    fnBGColorPickerChange: function() {
        var RGB, r, g, b;
        if(blr.W15yQC.ContrastDialog.updatingValues==false) {
            blr.W15yQC.ContrastDialog.updatingValues = true;
            RGB = blr.W15yQC.ContrastDialog.fnRGBFromHTMLColor(document.getElementById('cpBG').color);
            r = document.getElementById('sRedBG').value = RGB[0];
            g = document.getElementById('sGreenBG').value = RGB[1];
            b = document.getElementById('sBlueBG').value = RGB[2];
            blr.W15yQC.ContrastDialog.bgc = r*65536+g*256+b;
            document.getElementById('tbHTMLColorBG').value = blr.W15yQC.ContrastDialog.fnGetColorString(blr.W15yQC.ContrastDialog.bgc);
            document.getElementById('sHueBG').value = blr.W15yQC.ContrastDialog.fnComputeHueFromRGB(r,g,b);
            document.getElementById('sSatBG').value = blr.W15yQC.ContrastDialog.fnComputeSaturationFromRGB(r,g,b);
            document.getElementById('sBrightnessBG').value = blr.W15yQC.ContrastDialog.fnComputeBrightnessFromRGB(r,g,b);
            blr.W15yQC.ContrastDialog.fnUpdateContrastValuesDisplay();
            blr.W15yQC.ContrastDialog.updatingValues = false;
        }
    },
    
    fnBGSliderChange: function() {
        var r, g, b;
        if(blr.W15yQC.ContrastDialog.updatingValues==false) {
            blr.W15yQC.ContrastDialog.updatingValues = true;
            r = parseInt(document.getElementById('sRedBG').value,10);
            g = parseInt(document.getElementById('sGreenBG').value,10);
            b = parseInt(document.getElementById('sBlueBG').value,10);
            
            blr.W15yQC.ContrastDialog.bgc = r*65536+g*256+b;
            document.getElementById('tbHTMLColorBG').value = blr.W15yQC.ContrastDialog.fnGetColorString(blr.W15yQC.ContrastDialog.bgc);
            document.getElementById('cpBG').color = document.getElementById('tbHTMLColorBG').value;
            document.getElementById('sHueBG').value = blr.W15yQC.ContrastDialog.fnComputeHueFromRGB(r,g,b);
            document.getElementById('sSatBG').value = blr.W15yQC.ContrastDialog.fnComputeSaturationFromRGB(r,g,b);
            document.getElementById('sBrightnessBG').value = blr.W15yQC.ContrastDialog.fnComputeBrightnessFromRGB(r,g,b);
            blr.W15yQC.ContrastDialog.fnUpdateContrastValuesDisplay();
            blr.W15yQC.ContrastDialog.updatingValues = false;
        }
    },
    
    fnBGHSBChange: function() {
        var RGB;
        if(blr.W15yQC.ContrastDialog.updatingValues==false) {
            blr.W15yQC.ContrastDialog.updatingValues = true;
            RGB = blr.W15yQC.ContrastDialog.fnHSV2RGB(document.getElementById('sHueBG').value,document.getElementById('sSatBG').value,document.getElementById('sBrightnessBG').value);
            document.getElementById('sRedBG').value = RGB[0];
            document.getElementById('sGreenBG').value = RGB[1];
            document.getElementById('sBlueBG').value = RGB[2];
            blr.W15yQC.ContrastDialog.bgc = RGB[0]*65536+RGB[1]*256+RGB[2];
            document.getElementById('tbHTMLColorBG').value = blr.W15yQC.ContrastDialog.fnGetColorString(blr.W15yQC.ContrastDialog.bgc);
            document.getElementById('cpBG').color = document.getElementById('tbHTMLColorBG').value;
            blr.W15yQC.ContrastDialog.fnUpdateContrastValuesDisplay();
            blr.W15yQC.ContrastDialog.updatingValues = false;
        }
    },
    
    fnUpdateContrastValuesDisplay: function() {
        var el1, el2, r1, g1, b1, r2, g2, b2, rBG, gBG, bBG, lrc1bg, lrc2bg, lrc1rc2, c1, c2, bg, if1, if2, if3;
        r1 = parseInt(document.getElementById('sRed1').value,10);
        g1 = parseInt(document.getElementById('sGreen1').value,10);
        b1 = parseInt(document.getElementById('sBlue1').value,10);
        
        r2 = parseInt(document.getElementById('sRed2').value,10);
        g2 = parseInt(document.getElementById('sGreen2').value,10);
        b2 = parseInt(document.getElementById('sBlue2').value,10);
        
        rBG = parseInt(document.getElementById('sRedBG').value,10);
        gBG = parseInt(document.getElementById('sGreenBG').value,10);
        bBG = parseInt(document.getElementById('sBlueBG').value,10);
        
        lrc1bg = blr.W15yQC.ContrastDialog.fnComputeWCAG2LuminosityRatio(r1,g1,b1, rBG,gBG,bBG);
        lrc2bg = blr.W15yQC.ContrastDialog.fnComputeWCAG2LuminosityRatio(r2,g2,b2, rBG,gBG,bBG);
        lrc1rc2 = blr.W15yQC.ContrastDialog.fnComputeWCAG2LuminosityRatio(r1,g1,b1, r2,g2,b2);
        
        document.getElementById('resultsC1BGContrast').value = lrc1bg;
        document.getElementById('resultsC2BGContrast').value = lrc2bg;
        document.getElementById('resultsC1C2Contrast').value = lrc1rc2;
        
        blr.W15yQC.ContrastDialog.setResults(lrc1bg,'C1BGWCAG2AACompliant','C1BGWCAG2AACompliant18p','C1BGWCAG2AAACompliant','C1BGWCAG2AAACompliant18p');
        blr.W15yQC.ContrastDialog.setResults(lrc2bg,'C2BGWCAG2AACompliant','C2BGWCAG2AACompliant18p','C2BGWCAG2AAACompliant','C2BGWCAG2AAACompliant18p');
        blr.W15yQC.ContrastDialog.setResults(lrc1rc2,'C1C2WCAG2AACompliant','C1C2WCAG2AACompliant18p','C1C2WCAG2AAACompliant','C1C2WCAG2AAACompliant18p');

        if1 = document.getElementById("iframeC1BG");
        c1=blr.W15yQC.ContrastDialog.fnGetColorString(blr.W15yQC.ContrastDialog.fgc1);
        c2=blr.W15yQC.ContrastDialog.fnGetColorString(blr.W15yQC.ContrastDialog.fgc2);
        bg=blr.W15yQC.ContrastDialog.fnGetColorString(blr.W15yQC.ContrastDialog.bgc);
        if1.contentDocument.body.style.color=c1;
        if1.contentDocument.body.style.backgroundColor=bg;
        if1.contentDocument.body.style.margin='0';
        if1.contentDocument.body.style.padding='0';

        while (if1.contentDocument.body.firstChild) {
            if1.contentDocument.body.removeChild(if1.contentDocument.body.firstChild);
        }
        el1=if1.contentDocument.createElement('p');
        el1.setAttribute('style','margin:0;padding:4px;font-size:12pt');
        el1.appendChild(if1.contentDocument.createTextNode('Example text at 12 points. ')); // TODO: i18n this!
        el2=if1.contentDocument.createElement('i');
        el1.appendChild(if1.contentDocument.createTextNode('Example text in italic. '));
        el1.appendChild(el2);
        el2=if1.contentDocument.createElement('b');
        el2.appendChild(if1.contentDocument.createTextNode('Example text in bold.'));
        el1.appendChild(el2);
        if1.contentDocument.body.appendChild(el1);
        
        if2 = document.getElementById("iframeC2BG");
        if2.contentDocument.body.style.color=c2;
        if2.contentDocument.body.style.backgroundColor=bg;
        if2.contentDocument.body.style.margin='0';
        if2.contentDocument.body.style.padding='0';

        while (if2.contentDocument.body.firstChild) {
            if2.contentDocument.body.removeChild(if2.contentDocument.body.firstChild);
        }
        el1=if2.contentDocument.createElement('p');
        el1.setAttribute('style','margin:0;padding:4px;font-size:12pt');
        el1.appendChild(if2.contentDocument.createTextNode('Example text at 12 points. ')); // TODO: i18n this!
        el2=if2.contentDocument.createElement('i');
        el1.appendChild(if2.contentDocument.createTextNode('Example text in italic. '));
        el1.appendChild(el2);
        el2=if2.contentDocument.createElement('b');
        el2.appendChild(if2.contentDocument.createTextNode('Example text in bold.'));
        el1.appendChild(el2);
        if2.contentDocument.body.appendChild(el1);
        
        if3 = document.getElementById("iframeC1C2");
        if3.contentDocument.body.style.color=c1;
        if3.contentDocument.body.style.backgroundColor=bg;
        if3.contentDocument.body.style.margin='0';
        if3.contentDocument.body.style.padding='7px';
        
        while (if3.contentDocument.body.firstChild) {
            if3.contentDocument.body.removeChild(if3.contentDocument.body.firstChild);
        }

        el1=if3.contentDocument.createElement('div');
        el1.setAttribute('style','width:16px;height:16px;background-color:'+c1+';margin:3px;float:left');
        if3.contentDocument.body.appendChild(el1);

        el1=if3.contentDocument.createElement('div');
        el1.setAttribute('style','width:16px;height:16px;background-color:'+c2+';margin:3px;float:left');
        if3.contentDocument.body.appendChild(el1);

        el1=if3.contentDocument.createElement('div');
        el1.setAttribute('style','color:'+c1+';float:right;width:210px');
        el1.appendChild(if3.contentDocument.createTextNode('This has '));
        el2=if3.contentDocument.createElement('span');
        el2.setAttribute('style','color:'+c2);
        el2.appendChild(if3.contentDocument.createTextNode('two different'));
        el1.appendChild(el2);
        el1.appendChild(if3.contentDocument.createTextNode(' colors in it.'));
        if3.contentDocument.body.appendChild(el1);
    },
    
    setResults: function(lRatio,id1,id2,id3,id4) {
        document.getElementById(id1).value = (lRatio >= 4.5) ? 'Yes' : 'No';
        document.getElementById(id2).value = (lRatio >= 3) ? 'Yes' : 'No';
        document.getElementById(id3).value = (lRatio >= 7) ? 'Yes' : 'No';
        document.getElementById(id4).value = (lRatio >= 4.5) ? 'Yes' : 'No';
        document.getElementById(id1).style.backgroundColor = (lRatio >= 4.5) ? '#FDFDFD' : '#FFA6A6';
        document.getElementById(id2).style.backgroundColor = (lRatio >= 3) ? '#FDFDFD' : '#FFA6A6';
        document.getElementById(id3).style.backgroundColor = (lRatio >= 7) ? '#FDFDFD' : '#FFA6A6';
        document.getElementById(id4).style.backgroundColor = (lRatio >= 4.5) ? '#FDFDFD' : '#FFA6A6';
    },
 
    addSecondColor: function() {
        var gbColor2=document.getElementById('gbColor2'),
            resultsC1C2=document.getElementById('resultsC1C2'),
            resultsC2BG=document.getElementById('resultsC2BG'),
            buttonaddColor=document.getElementById('button-addColor');
        gbColor2.hidden=false;
        resultsC1C2.hidden=false;
        resultsC2BG.hidden=false;
        buttonaddColor.hidden=true;
    },
    
    cleanup: function() {
    }

};