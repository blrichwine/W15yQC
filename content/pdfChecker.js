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

 * File:        pdfChecker.js
 * Description: Handles displaying the ARIA Landmarks quick check dialog
 * Author:	Brian Richwine
 * Created:	2014.08.04
 * Modified:
 * Language:	JavaScript
 * Project:	W15y Quick Check
 *
 * Dev Notes:
 * 2014.08.04 - Created!
 *
 * TEST PDFs:
 *   http://www.udlcenter.org/sites/udlcenter.org/files/updateguidelines2_0.pdf
 *   http://www.udlcenter.org/sites/udlcenter.org/files/UDLinPostsecondary.pdf
 *   http://www.adobe.com/content/dam/Adobe/en/devnet/acrobat/pdfs/pdf_reference_1-7.pdf
 *   http://www.adobe.com/enterprise/accessibility/pdfs/acro6_pg_ue.pdf
 *   http://www.csus.edu/accessibility/guides/creating_accessible_pdfs.pdf
 *   http://wac.osu.edu/pdf/why-pdf.pdf
 *
 * TODO:
 *
 *
 */
"use strict";

if (!blr) {
  var blr = {};
}

/*
 * Object:  RemoveStylesWindow
 * Returns:
 */
blr.W15yQC.pdfChecker = {

  /*
   * checkIfTaggedPDF
   *  1. Perform HTTP HEAD request to get PDF length
   *  2.
   *
   *
   */

   errors: false,
   warnings: false,
   logElement: null,
   re: null, // Report Element

   warn: function(s) {
     blr.W15yQC.pdfChecker.warnings=true;
     blr.W15yQC.pdfChecker.log("WARNING: "+s);
   },

   error: function(s) {
     blr.W15yQC.pdfChecker.errors=true;
     blr.W15yQC.pdfChecker.log("ERROR: "+s);
   },

   log: function(s) {
    if (blr.W15yQC.pdfChecker.logElement!=null) {
      blr.W15yQC.pdfChecker.logElement.value=blr.W15yQC.fnJoin(blr.W15yQC.pdfChecker.logElement.value,s,"\n");
    }
   },


  checkIfTaggedPDF: function (sURL) {
    if (blr.W15yQC.fnAppearsToBeFullyQualifiedURL(sURL)===true) {
      blr.W15yQC.pdfChecker.getPDF(sURL);
    }
  },

  getPDFVersion: function(stream) {
    stream.reset();
    if (stream.find('%PDF-', 1024)) {
      // Found the header, trim off any garbage before it.
      stream.moveStart();
      // Reading file format version
      var MAX_VERSION_LENGTH = 12;
      var version = '', ch;
      while ((ch = stream.getByte()) > 0x20) { // SPACE
        if (version.length >= MAX_VERSION_LENGTH) {
          break;
        }
        version += String.fromCharCode(ch);
      }
      // removing "%PDF-"-prefix
      return version.substring(5);
    }
    return null;
  },

  readFileTrailerForXrefStart: function(stream) {
    var xrefOffset='', ch='';

    stream.pos=stream.length-Math.min(stream.length-5,50);
    if (stream.find('%%EOF', 51, true)) {
      // Found the file trailer, look for startxref
      stream.pos=stream.pos-Math.max(0,Math.min(stream.pos-5,20));
      if (stream.find('startxref', 20, true)) {
        stream.pos+=9; // skip startxref text
        while (ch!=-1 && (ch < 0x30 || ch > 0x39)) { // Non digits
          ch=stream.getByte();
        }
        if (ch!=-1) {
          while(ch>=0x30 && ch<=0x39) {
            xrefOffset+=String.fromCharCode(ch);
            ch=stream.getByte();
          }
          if (xrefOffset!=='') {
            return parseInt(xrefOffset, 10);
          }
        }
      }
    }
    return null;
  },

  isLinearized: function(stream, length) {
    var origPos=stream.pos, lex, p, o, l;
    stream.pos=1;
    if(stream.find('<<',1024)) {
      lex=new blr.W15yQC.pdfChecker.Lexer(stream);
      p=new blr.W15yQC.pdfChecker.Parser(lex, false);
      o=p.getObj();

      if (o!=null && o.map && o.map.Linearized && o.map.L) {
        l=parseInt(o.map.L,10);
        if (l==length) {
          stream.pos=origPos;
          return true;
        }
      }
    }
    stream.pos=origPos;
    return false;
  },

  parseDigits: function(stream) {
    var origPos=stream.pos, i=0, ch, foundDigits=false;

    stream.skipWhiteSpace();
    ch=stream.peekByte();
    while(ch>=0x30 && ch<=0x39) {
      foundDigits=true;
      i=i*10+ch-0x30;
      stream.skip(1);
      ch=stream.peekByte();
    }
    if (foundDigits==true) {
      return i;
    }
    return null;
  },

  parseXrefsAndGetRootOffset: function(stream, xRefs, rootObject) {
    var l, m, first, count, objNum, trailerOffset, prevXref, rootOffset, lex, p, o, aIndex, aW;
    if (xRefs===null || xRefs===undefined) {
      xRefs={};
    }
    l=stream.getLine(20);
    if (/^xref\s*$/.test(l)) { // cross-referece table
      l=stream.getLine(20);
      while (/^\d+\s\d+\s*$/.test(l)) {
        m=l.match(/^(\d+)\s(\d+)\s*$/);
        if (m!=null) {
          first=parseInt(m[1]);
          count=parseInt(m[2]);
          for(objNum=first;objNum<first+count;objNum++) {
            l=stream.getLine(50);
            m=l.match(/^(\d+)\s(\d+)\s(\w+)\s*$/);
            if (m!=null) {
              if(((objNum in xRefs)==false)||(xRefs[objNum].v<m[2])) {
                xRefs[objNum]={"o":m[1], "v":m[2], "s":m[3]};
              }
            }
          }
        }
        l=stream.getLine(200);
      }
    } else if (/^\d+\s+\d+\sobj\s*$/.test(l)) { // cross-reference stream PDF32000 pg 49
      lex=new blr.W15yQC.pdfChecker.Lexer(stream);
      p=new blr.W15yQC.pdfChecker.Parser(lex, false);
      o=p.getObj();

      if (rootObject==null && o!=null && o.map && o.map.Root) {
        rootObject=o.map.Root.num;
      }
      if (o!=null && o.map && o.map.Prev) {
        prevXref=parseInt(o.map.Prev,10);
      }
      if (o!=null && o.map && o.map.Type && o.map.Type.name=='XRef' && o.Index && o.W) {
        // Found real cross-reference stream
        aIndex=o.Index;
        aW=o.W;
      } else {
        alert("Don't know what we found!");
      }
    }

    // Read trailer dictionary
    if (!/^trailer\s*$/.test(l)) {
      stream.find('trailer');
      stream.find('<');
    }

    lex=new blr.W15yQC.pdfChecker.Lexer(stream);
    p=new blr.W15yQC.pdfChecker.Parser(lex, false);
    o=p.getObj();

    if (rootObject==null && o!=null && o.map && o.map.Root) {
      rootObject=o.map.Root.num;
    }

    if (rootObject!=null && (rootObject in xRefs)) {

      rootOffset=parseInt(xRefs[rootObject].o,10);
      return rootOffset;
    }

    if (o!=null && o.map && o.map.Prev) {
      prevXref=parseInt(o.map.Prev,10);
      stream.pos=prevXref;

      rootOffset=blr.W15yQC.pdfChecker.parseXrefsAndGetRootOffset(stream,xRefs,rootObject);
      return rootOffset;
    }

    return null;
  },

  checkPDF: function(pdfStream) {
        var pdfVer, startxref;
        var pdfObj={};
        var results={"version":null, "isLinearized":null, "hasOutline":null, "isStructured":null, "isTagged":null, "defaultLang":null, "errors":false};
        var pdfDict={};
        var rootOffset, lex, p, o, str, mi, outline;


        // var byte3 = uInt8Array[4]; // byte at offset 4
        blr.W15yQC.pdfChecker.log("Stream Length: "+pdfStream.length);
        pdfVer=blr.W15yQC.pdfChecker.getPDFVersion(pdfStream);
        if (pdfVer!=null) {
          blr.W15yQC.pdfChecker.log("PDF Version:"+pdfVer);
          results.version=pdfVer;

          startxref=blr.W15yQC.pdfChecker.readFileTrailerForXrefStart(pdfStream);
          if (startxref!=null) {
            //blr.W15yQC.pdfChecker.log("startxref: "+startxref);
            pdfStream.pos=startxref;

            var xref = new blr.W15yQC.pdfChecker.XRef(pdfStream);
            xref.setStartXRef(startxref);
            xref.parse(false);
            //blr.W15yQC.pdfChecker.log("\nXREF Parsed.");

            var rootDict, value=false;
            try {
              rootDict = xref.trailer.get('Root');
              if (rootDict.has) {
                if (blr.W15yQC.pdfChecker.isLinearized(pdfStream, pdfStream.length)) {
                  blr.W15yQC.pdfChecker.log("PDF is linearized.");
                  results.isLinearized=true;
                } else {
                  results.isLinearized=false;
                }
                if (rootDict.has('Outlines')) {
                  results.hasOutline=true;
                  //outline=rootDict.get('Outlines');
                  //blr.W15yQC.pdfChecker.log("Outlines:"+blr.W15yQC.objectToString(outline));
                } else {
                  results.hasOutline=false;
                }
                if (rootDict.has('StructTreeRoot')) {
                  results.isStructured=true;
                  blr.W15yQC.pdfChecker.log("Has StructTreeRoot");
                  try {
                    str = rootDict.get('StructTreeRoot');
                    if (str!=null && str.has('Lang')) {
                      results.defaultLang=str.get('Lang');
                      if (blr.W15yQC.fnStringHasContent(results.defaultLang)) {
                        blr.W15yQC.pdfChecker.log("Default Lang value set in StructTreeRoot:"+results.defaultLang);
                      }
                    }
                  } catch(e) {
                    blr.W15yQC.pdfChecker.error("Error reading structtreeroot:"+e);
                  }
                } else {
                  results.isStructured=false;
                }
                results.isTagged=false;
                if (rootDict.has('MarkInfo')) {
                  mi = rootDict.get('MarkInfo');
                  mi=mi.map.Marked;
                  blr.W15yQC.pdfChecker.log('MarkInfo:'+mi);
                  if (mi==true) {
                    results.isTagged=true;
                  }
                }
                if (blr.W15yQC.fnStringHasContent(results.defaultLang)==false && rootDict.has('Lang')) {
                  value = rootDict.get('Lang');
                  blr.W15yQC.pdfChecker.log('Root Dictionary Lang:'+value);
                  if (blr.W15yQC.fnStringHasContent(value)) {
                    results.defaultLang=value;
                  }
                }
              } else {
                blr.W15yQC.pdfChecker.error('The document root directory could not be read.');
              }
            } catch (err) {
              blr.W15yQC.pdfChecker.error('The document root dictionary is invalid.'+err);
            }

          } else {
            blr.W15yQC.pdfChecker.error("PDF file trailer and startxref NOT FOUND");
          }
        } else {
          blr.W15yQC.pdfChecker.error("PDF Version NOT FOUND");
        }
        results.errors=(blr.W15yQC.pdfChecker.error==true);
        blr.W15yQC.pdfChecker.log('Results: '+blr.W15yQC.objectToString(results));
  },

   getPDF: function(sURL, tb, re) {
    if (tb!=null) {
      blr.W15yQC.pdfChecker.logElement=tb;
    } else {
      blr.W15yQC.pdfChecker.logElement=null;
    }
    if (re!=null) {
      blr.W15yQC.pdfChecker.re = re;
    } else {
      blr.W15yQC.pdfChecker.re = null;
    }

    return new Promise(function(resolve, reject) {
      var xhr = new XMLHttpRequest();

      xhr.open('GET', sURL, true);
      xhr.responseType = 'arraybuffer';

      xhr.onload = function(e) {
        var results=blr.W15yQC.pdfChecker.checkPDF(new blr.W15yQC.pdfChecker.Stream(this.response)); // this.response == uInt8Array.buffer
        resolve(results);
      };

      xhr.onerror = function() {
        reject(null);
      };

      blr.W15yQC.pdfChecker.log('Requesting: '+sURL);
      xhr.send();
     });
    }
};


blr.W15yQC.pdfChecker.shadow=function(obj, prop, value) {
  Object.defineProperty(obj, prop, { value: value,
                                     enumerable: true,
                                     configurable: true,
                                     writable: false });
  return value;
}


blr.W15yQC.pdfChecker.bytesToString=function(bytes) {
  var length = bytes.length;
  var MAX_ARGUMENT_COUNT = 8192;
  if (length < MAX_ARGUMENT_COUNT) {
    return String.fromCharCode.apply(null, bytes);
  }
  var strBuf = [];
  for (var i = 0; i < length; i += MAX_ARGUMENT_COUNT) {
    var chunkEnd = Math.min(i + MAX_ARGUMENT_COUNT, length);
    var chunk = bytes.subarray(i, chunkEnd);
    strBuf.push(String.fromCharCode.apply(null, chunk));
  }
  return strBuf.join('');
}


blr.W15yQC.pdfChecker.stringToArray=function(str) {
  var length = str.length;
  var array = [];
  for (var i = 0; i < length; ++i) {
    array[i] = str.charCodeAt(i);
  }
  return array;
}


blr.W15yQC.pdfChecker.stringToBytes=function(str) {
  var length = str.length;
  var bytes = new Uint8Array(length);
  for (var i = 0; i < length; ++i) {
    bytes[i] = str.charCodeAt(i) & 0xFF;
  }
  return bytes;
}


blr.W15yQC.pdfChecker.string32=function(value) {
  return String.fromCharCode((value >> 24) & 0xff, (value >> 16) & 0xff,
                             (value >> 8) & 0xff, value & 0xff);
}


blr.W15yQC.pdfChecker.log2=function(x) {
  var n = 1, i = 0;
  while (x > n) {
    n <<= 1;
    i++;
  }
  return i;
}


blr.W15yQC.pdfChecker.readInt8=function(data, start) {
  return (data[start] << 24) >> 24;
}


blr.W15yQC.pdfChecker.readUint16=function(data, offset) {
  return (data[offset] << 8) | data[offset + 1];
}


blr.W15yQC.pdfChecker.readUint32=function(data, offset) {
  return ((data[offset] << 24) | (data[offset + 1] << 16) |
         (data[offset + 2] << 8) | data[offset + 3]) >>> 0;
}


blr.W15yQC.pdfChecker.Name = (function NameClosure() {
  function Name(name) {
    this.name = name;
  }

  Name.prototype = {};

  var nameCache = {};

  Name.get = function Name_get(name) {
    var nameValue = nameCache[name];
    return (nameValue ? nameValue : (nameCache[name] = new Name(name)));
  };

  return Name;
})();

blr.W15yQC.pdfChecker.Cmd = (function CmdClosure() {
  function Cmd(cmd) {
    this.cmd = cmd;
  }

  Cmd.prototype = {};

  var cmdCache = {};

  Cmd.get = function Cmd_get(cmd) {
    var cmdValue = cmdCache[cmd];
    return (cmdValue ? cmdValue : (cmdCache[cmd] = new Cmd(cmd)));
  };

  return Cmd;
})();


blr.W15yQC.pdfChecker.isEmptyObj=function(obj) {
  for (var key in obj) {
    return false;
  }
  return true;
}

blr.W15yQC.pdfChecker.isBool=function(v) {
  return typeof v == 'boolean';
}

blr.W15yQC.pdfChecker.isInt=function(v) {
  return typeof v == 'number' && ((v | 0) == v);
}

blr.W15yQC.pdfChecker.isNum=function(v) {
  return typeof v == 'number';
}

blr.W15yQC.pdfChecker.isString=function(v) {
  return typeof v == 'string';
}

blr.W15yQC.pdfChecker.isNull=function(v) {
  return v === null;
}

blr.W15yQC.pdfChecker.isName=function(v) {
  return v instanceof blr.W15yQC.pdfChecker.Name;
}

blr.W15yQC.pdfChecker.isCmd=function(v, cmd) {
  return v instanceof blr.W15yQC.pdfChecker.Cmd && (!cmd || v.cmd == cmd);
}

blr.W15yQC.pdfChecker.isDict=function(v, type) {
  if (!(v instanceof blr.W15yQC.pdfChecker.Dict)) {
    return false;
  }
  if (!type) {
    return true;
  }
  var dictType = v.get('Type');
  return blr.W15yQC.pdfChecker.isName(dictType) && dictType.name == type;
}

blr.W15yQC.pdfChecker.isArray=function(v) {
  return v instanceof Array;
}

blr.W15yQC.pdfChecker.isStream=function(v) {
  return typeof v == 'object' && v !== null && v !== undefined &&
         ('getBytes' in v);
}

blr.W15yQC.pdfChecker.isArrayBuffer=function(v) {
  return typeof v == 'object' && v !== null && v !== undefined &&
         ('byteLength' in v);
}

blr.W15yQC.pdfChecker.isRef=function(v) {
  return v instanceof blr.W15yQC.pdfChecker.Ref;
}

blr.W15yQC.pdfChecker.isPDFFunction=function(v) {
  var fnDict;
  if (typeof v != 'object') {
    return false;
  } else if (blr.W15yQC.pdfChecker.isDict(v)) {
    fnDict = v;
  } else if (blr.W15yQC.pdfChecker.isStream(v)) {
    fnDict = v.dict;
  } else {
    return false;
  }
  return fnDict.has('FunctionType');
}



blr.W15yQC.pdfChecker.ARCFourCipher = (function ARCFourCipherClosure() {
  function ARCFourCipher(key) {
    this.a = 0;
    this.b = 0;
    var s = new Uint8Array(256);
    var i, j = 0, tmp, keyLength = key.length;
    for (i = 0; i < 256; ++i) {
      s[i] = i;
    }
    for (i = 0; i < 256; ++i) {
      tmp = s[i];
      j = (j + tmp + key[i % keyLength]) & 0xFF;
      s[i] = s[j];
      s[j] = tmp;
    }
    this.s = s;
  }

  ARCFourCipher.prototype = {
    encryptBlock: function ARCFourCipher_encryptBlock(data) {
      var i, n = data.length, tmp, tmp2;
      var a = this.a, b = this.b, s = this.s;
      var output = new Uint8Array(n);
      for (i = 0; i < n; ++i) {
        a = (a + 1) & 0xFF;
        tmp = s[a];
        b = (b + tmp) & 0xFF;
        tmp2 = s[b];
        s[a] = tmp2;
        s[b] = tmp;
        output[i] = data[i] ^ s[(tmp + tmp2) & 0xFF];
      }
      this.a = a;
      this.b = b;
      return output;
    }
  };
  ARCFourCipher.prototype.decryptBlock = ARCFourCipher.prototype.encryptBlock;

  return ARCFourCipher;
})();

blr.W15yQC.pdfChecker.calculateMD5 = (function calculateMD5Closure() {
  var r = new Uint8Array([
    7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22,
    5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20,
    4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23,
    6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21]);

  var k = new Int32Array([
    -680876936, -389564586, 606105819, -1044525330, -176418897, 1200080426,
    -1473231341, -45705983, 1770035416, -1958414417, -42063, -1990404162,
    1804603682, -40341101, -1502002290, 1236535329, -165796510, -1069501632,
    643717713, -373897302, -701558691, 38016083, -660478335, -405537848,
    568446438, -1019803690, -187363961, 1163531501, -1444681467, -51403784,
    1735328473, -1926607734, -378558, -2022574463, 1839030562, -35309556,
    -1530992060, 1272893353, -155497632, -1094730640, 681279174, -358537222,
    -722521979, 76029189, -640364487, -421815835, 530742520, -995338651,
    -198630844, 1126891415, -1416354905, -57434055, 1700485571, -1894986606,
    -1051523, -2054922799, 1873313359, -30611744, -1560198380, 1309151649,
    -145523070, -1120210379, 718787259, -343485551]);

  function hash(data, offset, length) {
    var h0 = 1732584193, h1 = -271733879, h2 = -1732584194, h3 = 271733878;
    // pre-processing
    var paddedLength = (length + 72) & ~63; // data + 9 extra bytes
    var padded = new Uint8Array(paddedLength);
    var i, j, n;
    for (i = 0; i < length; ++i) {
      padded[i] = data[offset++];
    }
    padded[i++] = 0x80;
    n = paddedLength - 8;
    while (i < n) {
      padded[i++] = 0;
    }
    padded[i++] = (length << 3) & 0xFF;
    padded[i++] = (length >> 5) & 0xFF;
    padded[i++] = (length >> 13) & 0xFF;
    padded[i++] = (length >> 21) & 0xFF;
    padded[i++] = (length >>> 29) & 0xFF;
    padded[i++] = 0;
    padded[i++] = 0;
    padded[i++] = 0;
    // chunking
    // TODO ArrayBuffer ?
    var w = new Int32Array(16);
    for (i = 0; i < paddedLength;) {
      for (j = 0; j < 16; ++j, i += 4) {
        w[j] = (padded[i] | (padded[i + 1] << 8) |
                (padded[i + 2] << 16) | (padded[i + 3] << 24));
      }
      var a = h0, b = h1, c = h2, d = h3, f, g;
      for (j = 0; j < 64; ++j) {
        if (j < 16) {
          f = (b & c) | ((~b) & d);
          g = j;
        } else if (j < 32) {
          f = (d & b) | ((~d) & c);
          g = (5 * j + 1) & 15;
        } else if (j < 48) {
          f = b ^ c ^ d;
          g = (3 * j + 5) & 15;
        } else {
          f = c ^ (b | (~d));
          g = (7 * j) & 15;
        }
        var tmp = d, rotateArg = (a + f + k[j] + w[g]) | 0, rotate = r[j];
        d = c;
        c = b;
        b = (b + ((rotateArg << rotate) | (rotateArg >>> (32 - rotate)))) | 0;
        a = tmp;
      }
      h0 = (h0 + a) | 0;
      h1 = (h1 + b) | 0;
      h2 = (h2 + c) | 0;
      h3 = (h3 + d) | 0;
    }
    return new Uint8Array([
      h0 & 0xFF, (h0 >> 8) & 0xFF, (h0 >> 16) & 0xFF, (h0 >>> 24) & 0xFF,
      h1 & 0xFF, (h1 >> 8) & 0xFF, (h1 >> 16) & 0xFF, (h1 >>> 24) & 0xFF,
      h2 & 0xFF, (h2 >> 8) & 0xFF, (h2 >> 16) & 0xFF, (h2 >>> 24) & 0xFF,
      h3 & 0xFF, (h3 >> 8) & 0xFF, (h3 >> 16) & 0xFF, (h3 >>> 24) & 0xFF
    ]);
  }
  return hash;
})();

blr.W15yQC.pdfChecker.NullCipher = (function NullCipherClosure() {
  function NullCipher() {}

  NullCipher.prototype = {
    decryptBlock: function NullCipher_decryptBlock(data) {
      return data;
    }
  };

  return NullCipher;
})();


blr.W15yQC.pdfChecker.AES128Cipher = (function AES128CipherClosure() {
  var rcon = new Uint8Array([
    0x8d, 0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1b, 0x36, 0x6c,
    0xd8, 0xab, 0x4d, 0x9a, 0x2f, 0x5e, 0xbc, 0x63, 0xc6, 0x97, 0x35, 0x6a,
    0xd4, 0xb3, 0x7d, 0xfa, 0xef, 0xc5, 0x91, 0x39, 0x72, 0xe4, 0xd3, 0xbd,
    0x61, 0xc2, 0x9f, 0x25, 0x4a, 0x94, 0x33, 0x66, 0xcc, 0x83, 0x1d, 0x3a,
    0x74, 0xe8, 0xcb, 0x8d, 0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80,
    0x1b, 0x36, 0x6c, 0xd8, 0xab, 0x4d, 0x9a, 0x2f, 0x5e, 0xbc, 0x63, 0xc6,
    0x97, 0x35, 0x6a, 0xd4, 0xb3, 0x7d, 0xfa, 0xef, 0xc5, 0x91, 0x39, 0x72,
    0xe4, 0xd3, 0xbd, 0x61, 0xc2, 0x9f, 0x25, 0x4a, 0x94, 0x33, 0x66, 0xcc,
    0x83, 0x1d, 0x3a, 0x74, 0xe8, 0xcb, 0x8d, 0x01, 0x02, 0x04, 0x08, 0x10,
    0x20, 0x40, 0x80, 0x1b, 0x36, 0x6c, 0xd8, 0xab, 0x4d, 0x9a, 0x2f, 0x5e,
    0xbc, 0x63, 0xc6, 0x97, 0x35, 0x6a, 0xd4, 0xb3, 0x7d, 0xfa, 0xef, 0xc5,
    0x91, 0x39, 0x72, 0xe4, 0xd3, 0xbd, 0x61, 0xc2, 0x9f, 0x25, 0x4a, 0x94,
    0x33, 0x66, 0xcc, 0x83, 0x1d, 0x3a, 0x74, 0xe8, 0xcb, 0x8d, 0x01, 0x02,
    0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1b, 0x36, 0x6c, 0xd8, 0xab, 0x4d,
    0x9a, 0x2f, 0x5e, 0xbc, 0x63, 0xc6, 0x97, 0x35, 0x6a, 0xd4, 0xb3, 0x7d,
    0xfa, 0xef, 0xc5, 0x91, 0x39, 0x72, 0xe4, 0xd3, 0xbd, 0x61, 0xc2, 0x9f,
    0x25, 0x4a, 0x94, 0x33, 0x66, 0xcc, 0x83, 0x1d, 0x3a, 0x74, 0xe8, 0xcb,
    0x8d, 0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1b, 0x36, 0x6c,
    0xd8, 0xab, 0x4d, 0x9a, 0x2f, 0x5e, 0xbc, 0x63, 0xc6, 0x97, 0x35, 0x6a,
    0xd4, 0xb3, 0x7d, 0xfa, 0xef, 0xc5, 0x91, 0x39, 0x72, 0xe4, 0xd3, 0xbd,
    0x61, 0xc2, 0x9f, 0x25, 0x4a, 0x94, 0x33, 0x66, 0xcc, 0x83, 0x1d, 0x3a,
    0x74, 0xe8, 0xcb, 0x8d]);

  var s = new Uint8Array([
    0x63, 0x7c, 0x77, 0x7b, 0xf2, 0x6b, 0x6f, 0xc5, 0x30, 0x01, 0x67, 0x2b,
    0xfe, 0xd7, 0xab, 0x76, 0xca, 0x82, 0xc9, 0x7d, 0xfa, 0x59, 0x47, 0xf0,
    0xad, 0xd4, 0xa2, 0xaf, 0x9c, 0xa4, 0x72, 0xc0, 0xb7, 0xfd, 0x93, 0x26,
    0x36, 0x3f, 0xf7, 0xcc, 0x34, 0xa5, 0xe5, 0xf1, 0x71, 0xd8, 0x31, 0x15,
    0x04, 0xc7, 0x23, 0xc3, 0x18, 0x96, 0x05, 0x9a, 0x07, 0x12, 0x80, 0xe2,
    0xeb, 0x27, 0xb2, 0x75, 0x09, 0x83, 0x2c, 0x1a, 0x1b, 0x6e, 0x5a, 0xa0,
    0x52, 0x3b, 0xd6, 0xb3, 0x29, 0xe3, 0x2f, 0x84, 0x53, 0xd1, 0x00, 0xed,
    0x20, 0xfc, 0xb1, 0x5b, 0x6a, 0xcb, 0xbe, 0x39, 0x4a, 0x4c, 0x58, 0xcf,
    0xd0, 0xef, 0xaa, 0xfb, 0x43, 0x4d, 0x33, 0x85, 0x45, 0xf9, 0x02, 0x7f,
    0x50, 0x3c, 0x9f, 0xa8, 0x51, 0xa3, 0x40, 0x8f, 0x92, 0x9d, 0x38, 0xf5,
    0xbc, 0xb6, 0xda, 0x21, 0x10, 0xff, 0xf3, 0xd2, 0xcd, 0x0c, 0x13, 0xec,
    0x5f, 0x97, 0x44, 0x17, 0xc4, 0xa7, 0x7e, 0x3d, 0x64, 0x5d, 0x19, 0x73,
    0x60, 0x81, 0x4f, 0xdc, 0x22, 0x2a, 0x90, 0x88, 0x46, 0xee, 0xb8, 0x14,
    0xde, 0x5e, 0x0b, 0xdb, 0xe0, 0x32, 0x3a, 0x0a, 0x49, 0x06, 0x24, 0x5c,
    0xc2, 0xd3, 0xac, 0x62, 0x91, 0x95, 0xe4, 0x79, 0xe7, 0xc8, 0x37, 0x6d,
    0x8d, 0xd5, 0x4e, 0xa9, 0x6c, 0x56, 0xf4, 0xea, 0x65, 0x7a, 0xae, 0x08,
    0xba, 0x78, 0x25, 0x2e, 0x1c, 0xa6, 0xb4, 0xc6, 0xe8, 0xdd, 0x74, 0x1f,
    0x4b, 0xbd, 0x8b, 0x8a, 0x70, 0x3e, 0xb5, 0x66, 0x48, 0x03, 0xf6, 0x0e,
    0x61, 0x35, 0x57, 0xb9, 0x86, 0xc1, 0x1d, 0x9e, 0xe1, 0xf8, 0x98, 0x11,
    0x69, 0xd9, 0x8e, 0x94, 0x9b, 0x1e, 0x87, 0xe9, 0xce, 0x55, 0x28, 0xdf,
    0x8c, 0xa1, 0x89, 0x0d, 0xbf, 0xe6, 0x42, 0x68, 0x41, 0x99, 0x2d, 0x0f,
    0xb0, 0x54, 0xbb, 0x16]);

  var inv_s = new Uint8Array([
    0x52, 0x09, 0x6a, 0xd5, 0x30, 0x36, 0xa5, 0x38, 0xbf, 0x40, 0xa3, 0x9e,
    0x81, 0xf3, 0xd7, 0xfb, 0x7c, 0xe3, 0x39, 0x82, 0x9b, 0x2f, 0xff, 0x87,
    0x34, 0x8e, 0x43, 0x44, 0xc4, 0xde, 0xe9, 0xcb, 0x54, 0x7b, 0x94, 0x32,
    0xa6, 0xc2, 0x23, 0x3d, 0xee, 0x4c, 0x95, 0x0b, 0x42, 0xfa, 0xc3, 0x4e,
    0x08, 0x2e, 0xa1, 0x66, 0x28, 0xd9, 0x24, 0xb2, 0x76, 0x5b, 0xa2, 0x49,
    0x6d, 0x8b, 0xd1, 0x25, 0x72, 0xf8, 0xf6, 0x64, 0x86, 0x68, 0x98, 0x16,
    0xd4, 0xa4, 0x5c, 0xcc, 0x5d, 0x65, 0xb6, 0x92, 0x6c, 0x70, 0x48, 0x50,
    0xfd, 0xed, 0xb9, 0xda, 0x5e, 0x15, 0x46, 0x57, 0xa7, 0x8d, 0x9d, 0x84,
    0x90, 0xd8, 0xab, 0x00, 0x8c, 0xbc, 0xd3, 0x0a, 0xf7, 0xe4, 0x58, 0x05,
    0xb8, 0xb3, 0x45, 0x06, 0xd0, 0x2c, 0x1e, 0x8f, 0xca, 0x3f, 0x0f, 0x02,
    0xc1, 0xaf, 0xbd, 0x03, 0x01, 0x13, 0x8a, 0x6b, 0x3a, 0x91, 0x11, 0x41,
    0x4f, 0x67, 0xdc, 0xea, 0x97, 0xf2, 0xcf, 0xce, 0xf0, 0xb4, 0xe6, 0x73,
    0x96, 0xac, 0x74, 0x22, 0xe7, 0xad, 0x35, 0x85, 0xe2, 0xf9, 0x37, 0xe8,
    0x1c, 0x75, 0xdf, 0x6e, 0x47, 0xf1, 0x1a, 0x71, 0x1d, 0x29, 0xc5, 0x89,
    0x6f, 0xb7, 0x62, 0x0e, 0xaa, 0x18, 0xbe, 0x1b, 0xfc, 0x56, 0x3e, 0x4b,
    0xc6, 0xd2, 0x79, 0x20, 0x9a, 0xdb, 0xc0, 0xfe, 0x78, 0xcd, 0x5a, 0xf4,
    0x1f, 0xdd, 0xa8, 0x33, 0x88, 0x07, 0xc7, 0x31, 0xb1, 0x12, 0x10, 0x59,
    0x27, 0x80, 0xec, 0x5f, 0x60, 0x51, 0x7f, 0xa9, 0x19, 0xb5, 0x4a, 0x0d,
    0x2d, 0xe5, 0x7a, 0x9f, 0x93, 0xc9, 0x9c, 0xef, 0xa0, 0xe0, 0x3b, 0x4d,
    0xae, 0x2a, 0xf5, 0xb0, 0xc8, 0xeb, 0xbb, 0x3c, 0x83, 0x53, 0x99, 0x61,
    0x17, 0x2b, 0x04, 0x7e, 0xba, 0x77, 0xd6, 0x26, 0xe1, 0x69, 0x14, 0x63,
    0x55, 0x21, 0x0c, 0x7d]);

  var mix = new Uint32Array([
    0x00000000, 0x0e090d0b, 0x1c121a16, 0x121b171d, 0x3824342c, 0x362d3927,
    0x24362e3a, 0x2a3f2331, 0x70486858, 0x7e416553, 0x6c5a724e, 0x62537f45,
    0x486c5c74, 0x4665517f, 0x547e4662, 0x5a774b69, 0xe090d0b0, 0xee99ddbb,
    0xfc82caa6, 0xf28bc7ad, 0xd8b4e49c, 0xd6bde997, 0xc4a6fe8a, 0xcaaff381,
    0x90d8b8e8, 0x9ed1b5e3, 0x8ccaa2fe, 0x82c3aff5, 0xa8fc8cc4, 0xa6f581cf,
    0xb4ee96d2, 0xbae79bd9, 0xdb3bbb7b, 0xd532b670, 0xc729a16d, 0xc920ac66,
    0xe31f8f57, 0xed16825c, 0xff0d9541, 0xf104984a, 0xab73d323, 0xa57ade28,
    0xb761c935, 0xb968c43e, 0x9357e70f, 0x9d5eea04, 0x8f45fd19, 0x814cf012,
    0x3bab6bcb, 0x35a266c0, 0x27b971dd, 0x29b07cd6, 0x038f5fe7, 0x0d8652ec,
    0x1f9d45f1, 0x119448fa, 0x4be30393, 0x45ea0e98, 0x57f11985, 0x59f8148e,
    0x73c737bf, 0x7dce3ab4, 0x6fd52da9, 0x61dc20a2, 0xad766df6, 0xa37f60fd,
    0xb16477e0, 0xbf6d7aeb, 0x955259da, 0x9b5b54d1, 0x894043cc, 0x87494ec7,
    0xdd3e05ae, 0xd33708a5, 0xc12c1fb8, 0xcf2512b3, 0xe51a3182, 0xeb133c89,
    0xf9082b94, 0xf701269f, 0x4de6bd46, 0x43efb04d, 0x51f4a750, 0x5ffdaa5b,
    0x75c2896a, 0x7bcb8461, 0x69d0937c, 0x67d99e77, 0x3daed51e, 0x33a7d815,
    0x21bccf08, 0x2fb5c203, 0x058ae132, 0x0b83ec39, 0x1998fb24, 0x1791f62f,
    0x764dd68d, 0x7844db86, 0x6a5fcc9b, 0x6456c190, 0x4e69e2a1, 0x4060efaa,
    0x527bf8b7, 0x5c72f5bc, 0x0605bed5, 0x080cb3de, 0x1a17a4c3, 0x141ea9c8,
    0x3e218af9, 0x302887f2, 0x223390ef, 0x2c3a9de4, 0x96dd063d, 0x98d40b36,
    0x8acf1c2b, 0x84c61120, 0xaef93211, 0xa0f03f1a, 0xb2eb2807, 0xbce2250c,
    0xe6956e65, 0xe89c636e, 0xfa877473, 0xf48e7978, 0xdeb15a49, 0xd0b85742,
    0xc2a3405f, 0xccaa4d54, 0x41ecdaf7, 0x4fe5d7fc, 0x5dfec0e1, 0x53f7cdea,
    0x79c8eedb, 0x77c1e3d0, 0x65daf4cd, 0x6bd3f9c6, 0x31a4b2af, 0x3fadbfa4,
    0x2db6a8b9, 0x23bfa5b2, 0x09808683, 0x07898b88, 0x15929c95, 0x1b9b919e,
    0xa17c0a47, 0xaf75074c, 0xbd6e1051, 0xb3671d5a, 0x99583e6b, 0x97513360,
    0x854a247d, 0x8b432976, 0xd134621f, 0xdf3d6f14, 0xcd267809, 0xc32f7502,
    0xe9105633, 0xe7195b38, 0xf5024c25, 0xfb0b412e, 0x9ad7618c, 0x94de6c87,
    0x86c57b9a, 0x88cc7691, 0xa2f355a0, 0xacfa58ab, 0xbee14fb6, 0xb0e842bd,
    0xea9f09d4, 0xe49604df, 0xf68d13c2, 0xf8841ec9, 0xd2bb3df8, 0xdcb230f3,
    0xcea927ee, 0xc0a02ae5, 0x7a47b13c, 0x744ebc37, 0x6655ab2a, 0x685ca621,
    0x42638510, 0x4c6a881b, 0x5e719f06, 0x5078920d, 0x0a0fd964, 0x0406d46f,
    0x161dc372, 0x1814ce79, 0x322bed48, 0x3c22e043, 0x2e39f75e, 0x2030fa55,
    0xec9ab701, 0xe293ba0a, 0xf088ad17, 0xfe81a01c, 0xd4be832d, 0xdab78e26,
    0xc8ac993b, 0xc6a59430, 0x9cd2df59, 0x92dbd252, 0x80c0c54f, 0x8ec9c844,
    0xa4f6eb75, 0xaaffe67e, 0xb8e4f163, 0xb6edfc68, 0x0c0a67b1, 0x02036aba,
    0x10187da7, 0x1e1170ac, 0x342e539d, 0x3a275e96, 0x283c498b, 0x26354480,
    0x7c420fe9, 0x724b02e2, 0x605015ff, 0x6e5918f4, 0x44663bc5, 0x4a6f36ce,
    0x587421d3, 0x567d2cd8, 0x37a10c7a, 0x39a80171, 0x2bb3166c, 0x25ba1b67,
    0x0f853856, 0x018c355d, 0x13972240, 0x1d9e2f4b, 0x47e96422, 0x49e06929,
    0x5bfb7e34, 0x55f2733f, 0x7fcd500e, 0x71c45d05, 0x63df4a18, 0x6dd64713,
    0xd731dcca, 0xd938d1c1, 0xcb23c6dc, 0xc52acbd7, 0xef15e8e6, 0xe11ce5ed,
    0xf307f2f0, 0xfd0efffb, 0xa779b492, 0xa970b999, 0xbb6bae84, 0xb562a38f,
    0x9f5d80be, 0x91548db5, 0x834f9aa8, 0x8d4697a3]);

  function expandKey128(cipherKey) {
    var b = 176, result = new Uint8Array(b);
    result.set(cipherKey);
    for (var j = 16, i = 1; j < b; ++i) {
      // RotWord
      var t1 = result[j - 3], t2 = result[j - 2],
          t3 = result[j - 1], t4 = result[j - 4];
      // SubWord
      t1 = s[t1]; t2 = s[t2]; t3 = s[t3]; t4 = s[t4];
      // Rcon
      t1 = t1 ^ rcon[i];
      for (var n = 0; n < 4; ++n) {
        result[j] = (t1 ^= result[j - 16]); j++;
        result[j] = (t2 ^= result[j - 16]); j++;
        result[j] = (t3 ^= result[j - 16]); j++;
        result[j] = (t4 ^= result[j - 16]); j++;
      }
    }
    return result;
  }

  function decrypt128(input, key) {
    var state = new Uint8Array(16);
    state.set(input);
    var i, j, k;
    var t, u, v;
    // AddRoundKey
    for (j = 0, k = 160; j < 16; ++j, ++k) {
      state[j] ^= key[k];
    }
    for (i = 9; i >= 1; --i) {
      // InvShiftRows
      t = state[13]; state[13] = state[9]; state[9] = state[5];
      state[5] = state[1]; state[1] = t;
      t = state[14]; u = state[10]; state[14] = state[6];
      state[10] = state[2]; state[6] = t; state[2] = u;
      t = state[15]; u = state[11]; v = state[7]; state[15] = state[3];
      state[11] = t; state[7] = u; state[3] = v;
      // InvSubBytes
      for (j = 0; j < 16; ++j) {
        state[j] = inv_s[state[j]];
      }
      // AddRoundKey
      for (j = 0, k = i * 16; j < 16; ++j, ++k) {
        state[j] ^= key[k];
      }
      // InvMixColumns
      for (j = 0; j < 16; j += 4) {
        var s0 = mix[state[j]], s1 = mix[state[j + 1]],
            s2 = mix[state[j + 2]], s3 = mix[state[j + 3]];
        t = (s0 ^ (s1 >>> 8) ^ (s1 << 24) ^ (s2 >>> 16) ^ (s2 << 16) ^
            (s3 >>> 24) ^ (s3 << 8));
        state[j] = (t >>> 24) & 0xFF;
        state[j + 1] = (t >> 16) & 0xFF;
        state[j + 2] = (t >> 8) & 0xFF;
        state[j + 3] = t & 0xFF;
      }
    }
    // InvShiftRows
    t = state[13]; state[13] = state[9]; state[9] = state[5];
    state[5] = state[1]; state[1] = t;
    t = state[14]; u = state[10]; state[14] = state[6];
    state[10] = state[2]; state[6] = t; state[2] = u;
    t = state[15]; u = state[11]; v = state[7]; state[15] = state[3];
    state[11] = t; state[7] = u; state[3] = v;
    for (j = 0; j < 16; ++j) {
      // InvSubBytes
      state[j] = inv_s[state[j]];
      // AddRoundKey
      state[j] ^= key[j];
    }
    return state;
  }

  function AES128Cipher(key) {
    this.key = expandKey128(key);
    this.buffer = new Uint8Array(16);
    this.bufferPosition = 0;
  }

  function decryptBlock2(data, finalize) {
    var i, j, ii, sourceLength = data.length,
        buffer = this.buffer, bufferLength = this.bufferPosition,
        result = [], iv = this.iv;
    for (i = 0; i < sourceLength; ++i) {
      buffer[bufferLength] = data[i];
      ++bufferLength;
      if (bufferLength < 16) {
        continue;
      }
      // buffer is full, decrypting
      var plain = decrypt128(buffer, this.key);
      // xor-ing the IV vector to get plain text
      for (j = 0; j < 16; ++j) {
        plain[j] ^= iv[j];
      }
      iv = buffer;
      result.push(plain);
      buffer = new Uint8Array(16);
      bufferLength = 0;
    }
    // saving incomplete buffer
    this.buffer = buffer;
    this.bufferLength = bufferLength;
    this.iv = iv;
    if (result.length === 0) {
      return new Uint8Array([]);
    }
    // combining plain text blocks into one
    var outputLength = 16 * result.length;
    if (finalize) {
      // undo a padding that is described in RFC 2898
      var lastBlock = result[result.length - 1];
      outputLength -= lastBlock[15];
      result[result.length - 1] = lastBlock.subarray(0, 16 - lastBlock[15]);
    }
    var output = new Uint8Array(outputLength);
    for (i = 0, j = 0, ii = result.length; i < ii; ++i, j += 16) {
      output.set(result[i], j);
    }
    return output;
  }

  AES128Cipher.prototype = {
    decryptBlock: function AES128Cipher_decryptBlock(data, finalize) {
      var i, sourceLength = data.length;
      var buffer = this.buffer, bufferLength = this.bufferPosition;
      // waiting for IV values -- they are at the start of the stream
      for (i = 0; bufferLength < 16 && i < sourceLength; ++i, ++bufferLength) {
        buffer[bufferLength] = data[i];
      }
      if (bufferLength < 16) {
        // need more data
        this.bufferLength = bufferLength;
        return new Uint8Array([]);
      }
      this.iv = buffer;
      this.buffer = new Uint8Array(16);
      this.bufferLength = 0;
      // starting decryption
      this.decryptBlock = decryptBlock2;
      return this.decryptBlock(data.subarray(16), finalize);
    }
  };

  return AES128Cipher;
})();

blr.W15yQC.pdfChecker.CipherTransform = (function CipherTransformClosure() {
  function CipherTransform(stringCipherConstructor, streamCipherConstructor) {
    this.stringCipherConstructor = stringCipherConstructor;
    this.streamCipherConstructor = streamCipherConstructor;
  }
  CipherTransform.prototype = {
    createStream: function CipherTransform_createStream(stream, length) {
      var cipher = new this.streamCipherConstructor();
      return new blr.W15yQC.pdfChecker.DecryptStream(stream, length,
        function cipherTransformDecryptStream(data, finalize) {
          return cipher.decryptBlock(data, finalize);
        }
      );
    },
    decryptString: function CipherTransform_decryptString(s) {
      var cipher = new this.stringCipherConstructor();
      var data = stringToBytes(s);
      data = cipher.decryptBlock(data, true);
      return bytesToString(data);
    }
  };
  return CipherTransform;
})();

blr.W15yQC.pdfChecker.CipherTransformFactory = (function CipherTransformFactoryClosure() {
  var defaultPasswordBytes = new Uint8Array([
    0x28, 0xBF, 0x4E, 0x5E, 0x4E, 0x75, 0x8A, 0x41,
    0x64, 0x00, 0x4E, 0x56, 0xFF, 0xFA, 0x01, 0x08,
    0x2E, 0x2E, 0x00, 0xB6, 0xD0, 0x68, 0x3E, 0x80,
    0x2F, 0x0C, 0xA9, 0xFE, 0x64, 0x53, 0x69, 0x7A]);

  function prepareKeyData(fileId, password, ownerPassword, userPassword, flags, revision, keyLength, encryptMetadata) {
    var hashDataSize = 40 + ownerPassword.length + fileId.length;
    var hashData = new Uint8Array(hashDataSize), i = 0, j, n;
    if (password) {
      n = Math.min(32, password.length);
      for (; i < n; ++i) {
        hashData[i] = password[i];
      }
    }
    j = 0;
    while (i < 32) {
      hashData[i++] = defaultPasswordBytes[j++];
    }
    // as now the padded password in the hashData[0..i]
    for (j = 0, n = ownerPassword.length; j < n; ++j) {
      hashData[i++] = ownerPassword[j];
    }
    hashData[i++] = flags & 0xFF;
    hashData[i++] = (flags >> 8) & 0xFF;
    hashData[i++] = (flags >> 16) & 0xFF;
    hashData[i++] = (flags >>> 24) & 0xFF;
    for (j = 0, n = fileId.length; j < n; ++j) {
      hashData[i++] = fileId[j];
    }
    if (revision >= 4 && !encryptMetadata) {
      hashData[i++] = 0xFF;
      hashData[i++] = 0xFF;
      hashData[i++] = 0xFF;
      hashData[i++] = 0xFF;
    }
    var hash = blr.W15yQC.pdfChecker.calculateMD5(hashData, 0, i);
    var keyLengthInBytes = keyLength >> 3;
    if (revision >= 3) {
      for (j = 0; j < 50; ++j) {
        hash = blr.W15yQC.pdfChecker.calculateMD5(hash, 0, keyLengthInBytes);
      }
    }
    var encryptionKey = hash.subarray(0, keyLengthInBytes);
    var cipher, checkData;

    if (revision >= 3) {
      for (i = 0; i < 32; ++i) {
        hashData[i] = defaultPasswordBytes[i];
      }
      for (j = 0, n = fileId.length; j < n; ++j) {
        hashData[i++] = fileId[j];
      }
      cipher = new blr.W15yQC.pdfChecker.ARCFourCipher(encryptionKey);
      checkData = cipher.encryptBlock(blr.W15yQC.pdfChecker.calculateMD5(hashData, 0, i));
      n = encryptionKey.length;
      var derivedKey = new Uint8Array(n), k;
      for (j = 1; j <= 19; ++j) {
        for (k = 0; k < n; ++k) {
          derivedKey[k] = encryptionKey[k] ^ j;
        }
        cipher = new blr.W15yQC.pdfChecker.ARCFourCipher(derivedKey);
        checkData = cipher.encryptBlock(checkData);
      }
      for (j = 0, n = checkData.length; j < n; ++j) {
        if (userPassword[j] != checkData[j]) {
          return null;
        }
      }
    } else {
      cipher = new blr.W15yQC.pdfChecker.ARCFourCipher(encryptionKey);
      checkData = cipher.encryptBlock(defaultPasswordBytes);
      for (j = 0, n = checkData.length; j < n; ++j) {
        if (userPassword[j] != checkData[j]) {
          return null;
        }
      }
    }
    return encryptionKey;
  }

  function decodeUserPassword(password, ownerPassword, revision, keyLength) {
    var hashData = new Uint8Array(32), i = 0, j, n;
    n = Math.min(32, password.length);
    for (; i < n; ++i) {
      hashData[i] = password[i];
    }
    j = 0;
    while (i < 32) {
      hashData[i++] = defaultPasswordBytes[j++];
    }
    var hash = blr.W15yQC.pdfChecker.calculateMD5(hashData, 0, i);
    var keyLengthInBytes = keyLength >> 3;
    if (revision >= 3) {
      for (j = 0; j < 50; ++j) {
        hash = blr.W15yQC.pdfChecker.calculateMD5(hash, 0, hash.length);
      }
    }

    var cipher, userPassword;
    if (revision >= 3) {
      userPassword = ownerPassword;
      var derivedKey = new Uint8Array(keyLengthInBytes), k;
      for (j = 19; j >= 0; j--) {
        for (k = 0; k < keyLengthInBytes; ++k) {
          derivedKey[k] = hash[k] ^ j;
        }
        cipher = new blr.W15yQC.pdfChecker.ARCFourCipher(derivedKey);
        userPassword = cipher.encryptBlock(userPassword);
      }
    } else {
      cipher = new blr.W15yQC.pdfChecker.ARCFourCipher(hash.subarray(0, keyLengthInBytes));
      userPassword = cipher.encryptBlock(ownerPassword);
    }
    return userPassword;
  }

  var identityName = blr.W15yQC.pdfChecker.Name.get('Identity');

  function CipherTransformFactory(dict, fileId, password) {
    var filter = dict.get('Filter');
    if (!blr.W15yQC.pdfChecker.isName(filter) || filter.name != 'Standard') {
     blr.W15yQC.pdfChecker.error('unknown encryption method');
    }
    this.dict = dict;
    var algorithm = dict.get('V');
    if (!blr.W15yQC.pdfChecker.isInt(algorithm) ||
        (algorithm != 1 && algorithm != 2 && algorithm != 4)) {
     blr.W15yQC.pdfChecker.error('unsupported encryption algorithm');
    }
    this.algorithm = algorithm;
    var keyLength = dict.get('Length') || 40;
    if (!blr.W15yQC.pdfChecker.isInt(keyLength) || keyLength < 40 || (keyLength % 8) !== 0) {
     blr.W15yQC.pdfChecker.error('invalid key length');
    }

    // prepare keys
    var ownerPassword = blr.W15yQC.pdfChecker.stringToBytes(dict.get('O')).subarray(0, 32);
    var userPassword = blr.W15yQC.pdfChecker.stringToBytes(dict.get('U')).subarray(0, 32);
    var flags = dict.get('P');
    var revision = dict.get('R');
    var encryptMetadata = (algorithm == 4 &&  // meaningful when V is 4
      dict.get('EncryptMetadata') !== false); // makes true as default value
    this.encryptMetadata = encryptMetadata;

    var fileIdBytes = blr.W15yQC.pdfChecker.stringToBytes(fileId);
    var passwordBytes;
    if (password) {
      passwordBytes = blr.W15yQC.pdfChecker.stringToBytes(password);
    }

    var encryptionKey = prepareKeyData(fileIdBytes, passwordBytes,
                                       ownerPassword, userPassword, flags,
                                       revision, keyLength, encryptMetadata);
    if (!encryptionKey && !password) {
      throw new PasswordException('No password given', PasswordResponses.NEED_PASSWORD);
    } else if (!encryptionKey && password) {
      // Attempting use the password as an owner password
      var decodedPassword = decodeUserPassword(passwordBytes, ownerPassword,
                                               revision, keyLength);
      encryptionKey = prepareKeyData(fileIdBytes, decodedPassword,
                                     ownerPassword, userPassword, flags,
                                     revision, keyLength, encryptMetadata);
    }

    if (!encryptionKey) {
      throw new PasswordException('Incorrect Password', PasswordResponses.INCORRECT_PASSWORD);
    }

    this.encryptionKey = encryptionKey;

    if (algorithm == 4) {
      this.cf = dict.get('CF');
      this.stmf = dict.get('StmF') || identityName;
      this.strf = dict.get('StrF') || identityName;
      this.eff = dict.get('EFF') || this.strf;
    }
  }

  function buildObjectKey(num, gen, encryptionKey, isAes) {
    var key = new Uint8Array(encryptionKey.length + 9), i, n;
    for (i = 0, n = encryptionKey.length; i < n; ++i) {
      key[i] = encryptionKey[i];
    }
    key[i++] = num & 0xFF;
    key[i++] = (num >> 8) & 0xFF;
    key[i++] = (num >> 16) & 0xFF;
    key[i++] = gen & 0xFF;
    key[i++] = (gen >> 8) & 0xFF;
    if (isAes) {
      key[i++] = 0x73;
      key[i++] = 0x41;
      key[i++] = 0x6C;
      key[i++] = 0x54;
    }
    var hash = calculateMD5(key, 0, i);
    return hash.subarray(0, Math.min(encryptionKey.length + 5, 16));
  }

  function buildCipherConstructor(cf, name, num, gen, key) {
    var cryptFilter = cf.get(name.name);
    var cfm;
    if (cryptFilter !== null && cryptFilter !== undefined) {
      cfm = cryptFilter.get('CFM');
    }
    if (!cfm || cfm.name == 'None') {
      return function cipherTransformFactoryBuildCipherConstructorNone() {
        return new NullCipher();
      };
    }
    if ('V2' == cfm.name) {
      return function cipherTransformFactoryBuildCipherConstructorV2() {
        return new blr.W15yQC.pdfChecker.ARCFourCipher(buildObjectKey(num, gen, key, false));
      };
    }
    if ('AESV2' == cfm.name) {
      return function cipherTransformFactoryBuildCipherConstructorAESV2() {
        return new AES128Cipher(buildObjectKey(num, gen, key, true));
      };
    }
    //error('Unknown crypto method');
  }

  CipherTransformFactory.prototype = {
    createCipherTransform:
      function CipherTransformFactory_createCipherTransform(num, gen) {
      if (this.algorithm == 4) {
        return new CipherTransform(
          buildCipherConstructor(this.cf, this.stmf, num, gen, this.encryptionKey),
          buildCipherConstructor(this.cf, this.strf, num, gen, this.encryptionKey) );
      }
      // algorithms 1 and 2
      var key = buildObjectKey(num, gen, this.encryptionKey, false);
      var cipherConstructor = function buildCipherCipherConstructor() {
        return new blr.W15yQC.pdfChecker.ARCFourCipher(key);
      };
      return new CipherTransform(cipherConstructor, cipherConstructor);
    }
  };

  return CipherTransformFactory;
})();




blr.W15yQC.pdfChecker.XRef = (function XRefClosure() {
  function XRef(stream, password) {
    this.stream = stream;
    this.entries = [];
    this.xrefstms = {};
    // prepare the XRef cache
    this.cache = [];
    this.password = password;
  }

  XRef.prototype = {
    setStartXRef: function XRef_setStartXRef(startXRef) {
      // Store the starting positions of xref tables as we process them
      // so we can recover from missing data errors
      this.startXRefQueue = [startXRef];
    },

    parse: function XRef_parse(recoveryMode) {
      var trailerDict;
      if (!recoveryMode) {
        trailerDict = this.readXRef();
      } else {
        //warn('Indexing all PDF objects');
        trailerDict = this.indexObjects();
      }
      trailerDict.assignXref(this);
      this.trailer = trailerDict;
      var encrypt = trailerDict.get('Encrypt');
      if (encrypt) {
        var ids = trailerDict.get('ID');
        var fileId = (ids && ids.length) ? ids[0] : '';
        this.encrypt = new blr.W15yQC.pdfChecker.CipherTransformFactory(encrypt, fileId, this.password);
      }

      // get the root dictionary (catalog) object
      if (!(this.root = trailerDict.get('Root'))) {
        //error('Invalid root reference');
      }
    },

    processXRefTable: function XRef_processXRefTable(parser) {
      if (!('tableState' in this)) {
        // Stores state of the table as we process it so we can resume
        // from middle of table in case of missing data error
        this.tableState = {
          entryNum: 0,
          streamPos: parser.lexer.stream.pos,
          parserBuf1: parser.buf1,
          parserBuf2: parser.buf2
        };
      }

      var obj = this.readXRefTable(parser);

      // Sanity check
      if (!blr.W15yQC.pdfChecker.isCmd(obj, 'trailer')) {
        //error('Invalid XRef table: could not find trailer dictionary');
      }
      // Read trailer dictionary, e.g.
      // trailer
      //    << /Size 22
      //      /Root 20R
      //      /Info 10R
      //      /ID [ <81b14aafa313db63dbd6f981e49f94f4> ]
      //    >>
      // The parser goes through the entire stream << ... >> and provides
      // a getter interface for the key-value table
      var dict = parser.getObj();

      // The pdflib PDF generator can generate a nested trailer dictionary
      if (!blr.W15yQC.pdfChecker.isDict(dict) && dict.dict) {
        dict = dict.dict;
      }
      if (!blr.W15yQC.pdfChecker.isDict(dict)) {
        //error('Invalid XRef table: could not parse trailer dictionary');
      }
      delete this.tableState;

      return dict;
    },

    readXRefTable: function XRef_readXRefTable(parser) {
      // Example of cross-reference table:
      // xref
      // 0 1                    <-- subsection header (first obj #, obj count)
      // 0000000000 65535 f     <-- actual object (offset, generation #, f/n)
      // 23 2                   <-- subsection header ... and so on ...
      // 0000025518 00002 n
      // 0000025635 00000 n
      // trailer
      // ...

      var stream = parser.lexer.stream;
      var tableState = this.tableState;
      stream.pos = tableState.streamPos;
      parser.buf1 = tableState.parserBuf1;
      parser.buf2 = tableState.parserBuf2;

      // Outer loop is over subsection headers
      var obj;

      while (true) {
        if (!('firstEntryNum' in tableState) || !('entryCount' in tableState)) {
          if (blr.W15yQC.pdfChecker.isCmd(obj = parser.getObj(), 'trailer')) {
            break;
          }
          tableState.firstEntryNum = obj;
          tableState.entryCount = parser.getObj();
        }

        var first = tableState.firstEntryNum;
        var count = tableState.entryCount;
        if (!blr.W15yQC.pdfChecker.isInt(first) || !blr.W15yQC.pdfChecker.isInt(count)) {
          //error('Invalid XRef table: wrong types in subsection header');
        }
        // Inner loop is over objects themselves
        for (var i = tableState.entryNum; i < count; i++) {
          tableState.streamPos = stream.pos;
          tableState.entryNum = i;
          tableState.parserBuf1 = parser.buf1;
          tableState.parserBuf2 = parser.buf2;

          var entry = {};
          entry.offset = parser.getObj();
          entry.gen = parser.getObj();
          var type = parser.getObj();

          if (blr.W15yQC.pdfChecker.isCmd(type, 'f')) {
            entry.free = true;
          } else if (blr.W15yQC.pdfChecker.isCmd(type, 'n')) {
            entry.uncompressed = true;
          }

          // Validate entry obj
          if (!blr.W15yQC.pdfChecker.isInt(entry.offset) || !blr.W15yQC.pdfChecker.isInt(entry.gen) ||
              !(entry.free || entry.uncompressed)) {
            console.log(entry.offset, entry.gen, entry.free, entry.uncompressed);
            //error('Invalid entry in XRef subsection: ' + first + ', ' + count);
          }

          if (!this.entries[i + first]) {
            this.entries[i + first] = entry;
          }
        }

        tableState.entryNum = 0;
        tableState.streamPos = stream.pos;
        tableState.parserBuf1 = parser.buf1;
        tableState.parserBuf2 = parser.buf2;
        delete tableState.firstEntryNum;
        delete tableState.entryCount;
      }

      // Per issue 3248: hp scanners generate bad XRef
      if (first === 1 && this.entries[1] && this.entries[1].free) {
        // shifting the entries
        this.entries.shift();
      }

      // Sanity check: as per spec, first object must be free
      if (this.entries[0] && !this.entries[0].free) {
        //error('Invalid XRef table: unexpected first object');
      }
      return obj;
    },

    processXRefStream: function XRef_processXRefStream(stream) {
      if (!('streamState' in this)) {
        // Stores state of the stream as we process it so we can resume
        // from middle of stream in case of missing data error
        var streamParameters = stream.dict;
        var byteWidths = streamParameters.get('W');
        var range = streamParameters.get('Index');
        if (!range) {
          range = [0, streamParameters.get('Size')];
        }

        this.streamState = {
          entryRanges: range,
          byteWidths: byteWidths,
          entryNum: 0,
          streamPos: stream.pos
        };
      }
      this.readXRefStream(stream);
      delete this.streamState;

      return stream.dict;
    },

    readXRefStream: function XRef_readXRefStream(stream) {
      var i, j;
      var streamState = this.streamState;
      stream.pos = streamState.streamPos;

      var byteWidths = streamState.byteWidths;
      var typeFieldWidth = byteWidths[0];
      var offsetFieldWidth = byteWidths[1];
      var generationFieldWidth = byteWidths[2];

      var entryRanges = streamState.entryRanges;
      while (entryRanges.length > 0) {
        var first = entryRanges[0];
        var n = entryRanges[1];

        if (!blr.W15yQC.pdfChecker.isInt(first) || !blr.W15yQC.pdfChecker.isInt(n)) {
          //error('Invalid XRef range fields: ' + first + ', ' + n);
        }
        if (!blr.W15yQC.pdfChecker.isInt(typeFieldWidth) || !blr.W15yQC.pdfChecker.isInt(offsetFieldWidth) ||
            !blr.W15yQC.pdfChecker.isInt(generationFieldWidth)) {
          //error('Invalid XRef entry fields length: ' + first + ', ' + n);
        }
        for (i = streamState.entryNum; i < n; ++i) {
          streamState.entryNum = i;
          streamState.streamPos = stream.pos;

          var type = 0, offset = 0, generation = 0;
          for (j = 0; j < typeFieldWidth; ++j) {
            type = (type << 8) | stream.getByte();
          }
          // if type field is absent, its default value is 1
          if (typeFieldWidth === 0) {
            type = 1;
          }
          for (j = 0; j < offsetFieldWidth; ++j) {
            offset = (offset << 8) | stream.getByte();
          }
          for (j = 0; j < generationFieldWidth; ++j) {
            generation = (generation << 8) | stream.getByte();
          }
          var entry = {};
          entry.offset = offset;
          entry.gen = generation;
          switch (type) {
            case 0:
              entry.free = true;
              break;
            case 1:
              entry.uncompressed = true;
              break;
            case 2:
              break;
            default:
              //error('Invalid XRef entry type: ' + type);
          }
          if (!this.entries[first + i]) {
            this.entries[first + i] = entry;
          }
        }

        streamState.entryNum = 0;
        streamState.streamPos = stream.pos;
        entryRanges.splice(0, 2);
      }
    },

    indexObjects: function XRef_indexObjects() {
      // Simple scan through the PDF content to find objects,
      // trailers and XRef streams.
      function readToken(data, offset) {
        var token = '', ch = data[offset];
        while (ch !== 13 && ch !== 10) {
          if (++offset >= data.length) {
            break;
          }
          token += String.fromCharCode(ch);
          ch = data[offset];
        }
        return token;
      }
      function skipUntil(data, offset, what) {
        var length = what.length, dataLength = data.length;
        var skipped = 0;
        // finding byte sequence
        while (offset < dataLength) {
          var i = 0;
          while (i < length && data[offset + i] == what[i]) {
            ++i;
          }
          if (i >= length) {
            break; // sequence found
          }
          offset++;
          skipped++;
        }
        return skipped;
      }
      var trailerBytes = new Uint8Array([116, 114, 97, 105, 108, 101, 114]);
      var startxrefBytes = new Uint8Array([115, 116, 97, 114, 116, 120, 114,
                                          101, 102]);
      var endobjBytes = new Uint8Array([101, 110, 100, 111, 98, 106]);
      var xrefBytes = new Uint8Array([47, 88, 82, 101, 102]);

      var stream = this.stream;
      stream.pos = 0;
      var buffer = stream.getBytes();
      var position = stream.start, length = buffer.length;
      var trailers = [], xrefStms = [];
      while (position < length) {
        var ch = buffer[position];
        if (ch === 32 || ch === 9 || ch === 13 || ch === 10) {
          ++position;
          continue;
        }
        if (ch === 37) { // %-comment
          do {
            ++position;
            if (position >= length) {
              break;
            }
            ch = buffer[position];
          } while (ch !== 13 && ch !== 10);
          continue;
        }
        var token = readToken(buffer, position);
        var m;
        if (token === 'xref') {
          position += skipUntil(buffer, position, trailerBytes);
          trailers.push(position);
          position += skipUntil(buffer, position, startxrefBytes);
        } else if ((m = /^(\d+)\s+(\d+)\s+obj\b/.exec(token))) {
          this.entries[m[1]] = {
            offset: position,
            gen: m[2] | 0,
            uncompressed: true
          };

          var contentLength = skipUntil(buffer, position, endobjBytes) + 7;
          var content = buffer.subarray(position, position + contentLength);

          // checking XRef stream suspect
          // (it shall have '/XRef' and next char is not a letter)
          var xrefTagOffset = skipUntil(content, 0, xrefBytes);
          if (xrefTagOffset < contentLength &&
              content[xrefTagOffset + 5] < 64) {
            xrefStms.push(position);
            this.xrefstms[position] = 1; // don't read it recursively
          }

          position += contentLength;
        } else {
          position += token.length + 1;
        }
      }
      // reading XRef streams
      var i, ii;
      for (i = 0, ii = xrefStms.length; i < ii; ++i) {
        this.startXRefQueue.push(xrefStms[i]);
        this.readXRef(/* recoveryMode */ true);
      }
      // finding main trailer
      var dict;
      for (i = 0, ii = trailers.length; i < ii; ++i) {
        stream.pos = trailers[i];
        var parser = new blr.W15yQC.pdfChecker.Parser(new blr.W15yQC.pdfChecker.Lexer(stream), true, null);
        var obj = parser.getObj();
        if (!blr.W15yQC.pdfChecker.isCmd(obj, 'trailer')) {
          continue;
        }
        // read the trailer dictionary
        if (!blr.W15yQC.pdfChecker.isDict(dict = parser.getObj())) {
          continue;
        }
        // taking the first one with 'ID'
        if (dict.has('ID')) {
          return dict;
        }
      }
      // no tailer with 'ID', taking last one (if exists)
      if (dict) {
        return dict;
      }
      // nothing helps
      // callingblr.W15yQC.pdfChecker.error() would reject worker with an UnknownErrorException.
      throw new InvalidPDFException('Invalid PDF structure');
    },

    readXRef: function XRef_readXRef(recoveryMode) {
      var stream = this.stream;

      //try {
        while (this.startXRefQueue.length) {
          var startXRef = this.startXRefQueue[0];

          stream.pos = startXRef + stream.start;

          var parser = new blr.W15yQC.pdfChecker.Parser(new blr.W15yQC.pdfChecker.Lexer(stream), true, null);
          var obj = parser.getObj();
          var dict;

          // Get dictionary
          if (blr.W15yQC.pdfChecker.isCmd(obj, 'xref')) {
            // Parse end-of-file XRef
            dict = this.processXRefTable(parser);
            if (!this.topDict) {
              this.topDict = dict;
            }

            // Recursively get other XRefs 'XRefStm', if any
            obj = dict.get('XRefStm');
            if (blr.W15yQC.pdfChecker.isInt(obj)) {
              var pos = obj;
              // ignore previously loaded xref streams
              // (possible infinite recursion)
              if (!(pos in this.xrefstms)) {
                this.xrefstms[pos] = 1;
                this.startXRefQueue.push(pos);
              }
            }
          } else if (blr.W15yQC.pdfChecker.isInt(obj)) {
            // Parse in-stream XRef
            if (!blr.W15yQC.pdfChecker.isInt(parser.getObj()) ||
                !blr.W15yQC.pdfChecker.isCmd(parser.getObj(), 'obj') ||
                !blr.W15yQC.pdfChecker.isStream(obj = parser.getObj())) {
              //error('Invalid XRef stream');
            }
            dict = this.processXRefStream(obj);
            if (!this.topDict) {
              this.topDict = dict;
            }
            if (!dict) {
              //error('Failed to read XRef stream');
            }
          } else {
            //error('Invalid XRef stream header');
          }

          // Recursively get previous dictionary, if any
          obj = dict.get('Prev');
          if (blr.W15yQC.pdfChecker.isInt(obj)) {
            this.startXRefQueue.push(obj);
          } else if (blr.W15yQC.pdfChecker.isRef(obj)) {
            // The spec says Prev must not be a reference, i.e. "/Prev NNN"
            // This is a fallback for non-compliant PDFs, i.e. "/Prev NNN 0 R"
            this.startXRefQueue.push(obj.num);
          }

          this.startXRefQueue.shift();
        }

        return this.topDict;
      //} catch (e) {
      //  if (e instanceof MissingDataException) {
      //    throw e;
      //  }
        //info('(while reading XRef): ' + e);
      //}

      if (recoveryMode) {
        return;
      }
      throw new XRefParseException();
    },

    getEntry: function XRef_getEntry(i) {
      var xrefEntry = this.entries[i];
      if (xrefEntry && !xrefEntry.free && xrefEntry.offset) {
        return xrefEntry;
      }
      return null;
    },

    fetchIfRef: function XRef_fetchIfRef(obj) {
      if (!blr.W15yQC.pdfChecker.isRef(obj)) {
        return obj;
      }
      return this.fetch(obj);
    },

    fetch: function XRef_fetch(ref, suppressEncryption) {
      //assert(blr.W15yQC.pdfChecker.isRef(ref), 'ref object is not a reference');
      var num = ref.num;
      if (num in this.cache) {
        var cacheEntry = this.cache[num];
        return cacheEntry;
      }

      var xrefEntry = this.getEntry(num);

      // the referenced entry can be free
      if (xrefEntry === null) {
        return (this.cache[num] = null);
      }

      if (xrefEntry.uncompressed) {
        xrefEntry = this.fetchUncompressed(ref, xrefEntry, suppressEncryption);
      } else {
        xrefEntry = this.fetchCompressed(xrefEntry, suppressEncryption);
      }

      if (blr.W15yQC.pdfChecker.isDict(xrefEntry)) {
        xrefEntry.objId = 'R' + ref.num + '.' + ref.gen;
      }
      return xrefEntry;
    },

    fetchUncompressed: function XRef_fetchUncompressed(ref, xrefEntry, suppressEncryption) {
      var gen = ref.gen;
      var num = ref.num;
      if (xrefEntry.gen !== gen) {
        //error('inconsistent generation in XRef');
      }
      var stream = this.stream.makeSubStream(xrefEntry.offset +
                                             this.stream.start);
      var parser = new blr.W15yQC.pdfChecker.Parser(new blr.W15yQC.pdfChecker.Lexer(stream), true, this);
      var obj1 = parser.getObj();
      var obj2 = parser.getObj();
      var obj3 = parser.getObj();
      if (!blr.W15yQC.pdfChecker.isInt(obj1) || parseInt(obj1, 10) !== num ||
          !blr.W15yQC.pdfChecker.isInt(obj2) || parseInt(obj2, 10) !== gen ||
          !blr.W15yQC.pdfChecker.isCmd(obj3)) {
        //error('bad XRef entry');
      }
      if (!blr.W15yQC.pdfChecker.isCmd(obj3, 'obj')) {
        // some bad PDFs use "obj1234" and really mean 1234
        if (obj3.cmd.indexOf('obj') === 0) {
          num = parseInt(obj3.cmd.substring(3), 10);
          if (!isNaN(num)) {
            return num;
          }
        }
        //error('bad XRef entry');
      }
      if (this.encrypt && !suppressEncryption) {
        try {
          xrefEntry = parser.getObj(this.encrypt.createCipherTransform(num, gen));
        } catch (ex) {
          // Almost all streams must be encrypted, but sometimes
          // they are not, probably due to some broken generators.
          // Retrying without encryption...
          return this.fetch(ref, true);
        }
      } else {
        xrefEntry = parser.getObj();
      }
      if (!blr.W15yQC.pdfChecker.isStream(xrefEntry)) {
        this.cache[num] = xrefEntry;
      }
      return xrefEntry;
    },

    fetchCompressed: function XRef_fetchCompressed(xrefEntry, suppressEncryption) {
      var tableOffset = xrefEntry.offset;
      var stream = this.fetch(new blr.W15yQC.pdfChecker.Ref(tableOffset, 0));
      if (!blr.W15yQC.pdfChecker.isStream(stream)) {
        //error('bad ObjStm stream');
      }
      var first = stream.dict.get('First');
      var n = stream.dict.get('N');
      if (!blr.W15yQC.pdfChecker.isInt(first) || !blr.W15yQC.pdfChecker.isInt(n)) {
        //error('invalid first and n parameters for ObjStm stream');
      }
      var parser = new blr.W15yQC.pdfChecker.Parser(new blr.W15yQC.pdfChecker.Lexer(stream), false, this);
      parser.allowStreams = true;
      var i, entries = [], num, nums = [];
      // read the object numbers to populate cache
      for (i = 0; i < n; ++i) {
        num = parser.getObj();
        if (!blr.W15yQC.pdfChecker.isInt(num)) {
          //error('invalid object number in the ObjStm stream: ' + num);
        }
        nums.push(num);
        var offset = parser.getObj();
        if (!blr.W15yQC.pdfChecker.isInt(offset)) {
          //error('invalid object offset in the ObjStm stream: ' + offset);
        }
      }
      // read stream objects for cache
      for (i = 0; i < n; ++i) {
        entries.push(parser.getObj());
        num = nums[i];
        var entry = this.entries[num];
        if (entry && entry.offset === tableOffset && entry.gen === i) {
          this.cache[num] = entries[i];
        }
      }
      xrefEntry = entries[xrefEntry.gen];
      if (xrefEntry === undefined) {
        //error('bad XRef entry for compressed object');
      }
      return xrefEntry;
    },

    fetchIfRefAsync: function XRef_fetchIfRefAsync(obj) {
      if (!blr.W15yQC.pdfChecker.isRef(obj)) {
        return Promise.resolve(obj);
      }
      return this.fetchAsync(obj);
    },

    fetchAsync: function XRef_fetchAsync(ref, suppressEncryption) {
      return new Promise(function (resolve, reject) {
          var tryFetch = function () {
            try {
              resolve(this.fetch(ref, suppressEncryption));
            } catch (e) {
              if (e instanceof MissingDataException) {
                this.stream.manager.requestRange(e.begin, e.end, tryFetch);
                return;
              }
              reject(e);
            }
          }.bind(this);
          tryFetch();
        }.bind(this));
      },

    getCatalogObj: function XRef_getCatalogObj() {
      return this.root;
    }
  };

  return XRef;
})();


blr.W15yQC.pdfChecker.Dict = (function DictClosure() {
  var nonSerializable = function nonSerializableClosure() {
    return nonSerializable; // creating closure on some variable
  };

  var GETALL_DICTIONARY_TYPES_WHITELIST = {
    'Background': true,
    'ExtGState': true,
    'Halftone': true,
    'Layout': true,
    'Mask': true,
    'Pagination': true,
    'Printing': true
  };

  function isRecursionAllowedFor(dict) {
    if (!blr.W15yQC.pdfChecker.isName(dict.Type)) {
      return true;
    }
    var dictType = dict.Type.name;
    return GETALL_DICTIONARY_TYPES_WHITELIST[dictType] === true;
  }

  // xref is optional
  function Dict(xref) {
    // Map should only be used internally, use functions below to access.
    this.map = Object.create(null);
    this.xref = xref;
    this.objId = null;
    this.__nonSerializable__ = nonSerializable; // disable cloning of the Dict
  }

  Dict.prototype = {
    assignXref: function Dict_assignXref(newXref) {
      this.xref = newXref;
    },

    // automatically dereferences Ref objects
    get: function Dict_get(key1, key2, key3) {
      var value;
      var xref = this.xref;
      if (typeof (value = this.map[key1]) != 'undefined' || key1 in this.map ||
          typeof key2 == 'undefined') {
        return xref ? xref.fetchIfRef(value) : value;
      }
      if (typeof (value = this.map[key2]) != 'undefined' || key2 in this.map ||
          typeof key3 == 'undefined') {
        return xref ? xref.fetchIfRef(value) : value;
      }
      value = this.map[key3] || null;
      return xref ? xref.fetchIfRef(value) : value;
    },

    // Same as get(), but returns a promise and uses fetchIfRefAsync().
    getAsync: function Dict_getAsync(key1, key2, key3) {
      var value;
      var xref = this.xref;
      if (typeof (value = this.map[key1]) !== undefined || key1 in this.map ||
          typeof key2 === undefined) {
        if (xref) {
          return xref.fetchIfRefAsync(value);
        }
        return Promise.resolve(value);
      }
      if (typeof (value = this.map[key2]) !== undefined || key2 in this.map ||
          typeof key3 === undefined) {
        if (xref) {
          return xref.fetchIfRefAsync(value);
        }
        return Promise.resolve(value);
      }
      value = this.map[key3] || null;
      if (xref) {
        return xref.fetchIfRefAsync(value);
      }
      return Promise.resolve(value);
    },

    // no dereferencing
    getRaw: function Dict_getRaw(key) {
      return this.map[key];
    },

    // creates new map and dereferences all Refs
    getAll: function Dict_getAll() {
      var all = Object.create(null);
      var queue = null;
      var key, obj;
      for (key in this.map) {
        obj = this.get(key);
        if (obj instanceof Dict) {
          if (isRecursionAllowedFor(obj)) {
            (queue || (queue = [])).push({target: all, key: key, obj: obj});
          } else {
            all[key] = this.getRaw(key);
          }
        } else {
          all[key] = obj;
        }
      }
      if (!queue) {
        return all;
      }

      // trying to take cyclic references into the account
      var processed = Object.create(null);
      while (queue.length > 0) {
        var item = queue.shift();
        var itemObj = item.obj;
        var objId = itemObj.objId;
        if (objId && objId in processed) {
          item.target[item.key] = processed[objId];
          continue;
        }
        var dereferenced = Object.create(null);
        for (key in itemObj.map) {
          obj = itemObj.get(key);
          if (obj instanceof Dict) {
            if (isRecursionAllowedFor(obj)) {
              queue.push({target: dereferenced, key: key, obj: obj});
            } else {
              dereferenced[key] = itemObj.getRaw(key);
            }
          } else {
            dereferenced[key] = obj;
          }
        }
        if (objId) {
          processed[objId] = dereferenced;
        }
        item.target[item.key] = dereferenced;
      }
      return all;
    },

    set: function Dict_set(key, value) {
      this.map[key] = value;
    },

    has: function Dict_has(key) {
      return key in this.map;
    },

    forEach: function Dict_forEach(callback) {
      for (var key in this.map) {
        callback(key, this.get(key));
      }
    }
  };

  Dict.empty = new Dict(null);

  return Dict;
})();

blr.W15yQC.pdfChecker.Ref = (function RefClosure() {
  function Ref(num, gen) {
    this.num = num;
    this.gen = gen;
  }

  Ref.prototype = {};

  return Ref;
})();

// The reference is identified by number and generation.
// This structure stores only one instance of the reference.
blr.W15yQC.pdfChecker.RefSet = (function RefSetClosure() {
  function RefSet() {
    this.dict = {};
  }

  RefSet.prototype = {
    has: function RefSet_has(ref) {
      return ('R' + ref.num + '.' + ref.gen) in this.dict;
    },

    put: function RefSet_put(ref) {
      this.dict['R' + ref.num + '.' + ref.gen] = true;
    },

    remove: function RefSet_remove(ref) {
      delete this.dict['R' + ref.num + '.' + ref.gen];
    }
  };

  return RefSet;
})();



blr.W15yQC.pdfChecker.EOF = {};

blr.W15yQC.pdfChecker.isEOF = function(v) {
  return (v == blr.W15yQC.pdfChecker.EOF);
}

// super class for the decoding streams
blr.W15yQC.pdfChecker.DecodeStream = (function DecodeStreamClosure() {
  function DecodeStream(maybeMinBufferLength) {
    this.pos = 0;
    this.bufferLength = 0;
    this.eof = false;
    this.buffer = null;
    this.minBufferLength = 512;
    if (maybeMinBufferLength) {
      // Compute the first power of two that is as big as maybeMinBufferLength.
      while (this.minBufferLength < maybeMinBufferLength) {
        this.minBufferLength *= 2;
      }
    }
  }

  DecodeStream.prototype = {
    ensureBuffer: function DecodeStream_ensureBuffer(requested) {
      var buffer = this.buffer;
      var current;
      if (buffer) {
        current = buffer.byteLength;
        if (requested <= current) {
          return buffer;
        }
      } else {
        current = 0;
      }
      var size = this.minBufferLength;
      while (size < requested) {
        size *= 2;
      }
      var buffer2 = new Uint8Array(size);
      for (var i = 0; i < current; ++i) {
        buffer2[i] = buffer[i];
      }
      return (this.buffer = buffer2);
    },
    getByte: function DecodeStream_getByte() {
      var pos = this.pos;
      while (this.bufferLength <= pos) {
        if (this.eof) {
          return -1;
        }
        this.readBlock();
      }
      return this.buffer[this.pos++];
    },
    getUint16: function DecodeStream_getUint16() {
      var b0 = this.getByte();
      var b1 = this.getByte();
      return (b0 << 8) + b1;
    },
    getInt32: function DecodeStream_getInt32() {
      var b0 = this.getByte();
      var b1 = this.getByte();
      var b2 = this.getByte();
      var b3 = this.getByte();
      return (b0 << 24) + (b1 << 16) + (b2 << 8) + b3;
    },
    getBytes: function DecodeStream_getBytes(length) {
      var end, pos = this.pos;

      if (length) {
        this.ensureBuffer(pos + length);
        end = pos + length;

        while (!this.eof && this.bufferLength < end) {
          this.readBlock();
        }
        var bufEnd = this.bufferLength;
        if (end > bufEnd) {
          end = bufEnd;
        }
      } else {
        while (!this.eof) {
          this.readBlock();
        }
        end = this.bufferLength;

        // checking if bufferLength is still 0 then
        // the buffer has to be initialized
        if (!end) {
          this.buffer = new Uint8Array(0);
        }
      }

      this.pos = end;
      return this.buffer.subarray(pos, end);
    },
    peekBytes: function DecodeStream_peekBytes(length) {
      var bytes = this.getBytes(length);
      this.pos -= bytes.length;
      return bytes;
    },
    makeSubStream: function DecodeStream_makeSubStream(start, length, dict) {
      var end = start + length;
      while (this.bufferLength <= end && !this.eof) {
        this.readBlock();
      }
      return new Stream(this.buffer, start, length, dict);
    },
    skip: function Stream_skip(n) {
      if (!n) {
        n = 1;
      }
      this.pos += n;
    },
    reset: function DecodeStream_reset() {
      this.pos = 0;
    },
    getBaseStreams: function DecodeStream_getBaseStreams() {
      if (this.str && this.str.getBaseStreams) {
        return this.str.getBaseStreams();
      }
      return [];
    }
  };

  return DecodeStream;
})();

blr.W15yQC.pdfChecker.LZWStream = (function LZWStreamClosure() {
  function LZWStream(str, maybeLength, earlyChange) {
    this.str = str;
    this.dict = str.dict;
    this.cachedData = 0;
    this.bitsCached = 0;

    var maxLzwDictionarySize = 4096;
    var lzwState = {
      earlyChange: earlyChange,
      codeLength: 9,
      nextCode: 258,
      dictionaryValues: new Uint8Array(maxLzwDictionarySize),
      dictionaryLengths: new Uint16Array(maxLzwDictionarySize),
      dictionaryPrevCodes: new Uint16Array(maxLzwDictionarySize),
      currentSequence: new Uint8Array(maxLzwDictionarySize),
      currentSequenceLength: 0
    };
    for (var i = 0; i < 256; ++i) {
      lzwState.dictionaryValues[i] = i;
      lzwState.dictionaryLengths[i] = 1;
    }
    this.lzwState = lzwState;

    blr.W15yQC.pdfChecker.DecodeStream.call(this, maybeLength);
  }

  LZWStream.prototype = Object.create(blr.W15yQC.pdfChecker.DecodeStream.prototype);

  LZWStream.prototype.readBits = function LZWStream_readBits(n) {
    var bitsCached = this.bitsCached;
    var cachedData = this.cachedData;
    while (bitsCached < n) {
      var c = this.str.getByte();
      if (c === -1) {
        this.eof = true;
        return null;
      }
      cachedData = (cachedData << 8) | c;
      bitsCached += 8;
    }
    this.bitsCached = (bitsCached -= n);
    this.cachedData = cachedData;
    this.lastCode = null;
    return (cachedData >>> bitsCached) & ((1 << n) - 1);
  };

  LZWStream.prototype.readBlock = function LZWStream_readBlock() {
    var blockSize = 512;
    var estimatedDecodedSize = blockSize * 2, decodedSizeDelta = blockSize;
    var i, j, q;

    var lzwState = this.lzwState;
    if (!lzwState) {
      return; // eof was found
    }

    var earlyChange = lzwState.earlyChange;
    var nextCode = lzwState.nextCode;
    var dictionaryValues = lzwState.dictionaryValues;
    var dictionaryLengths = lzwState.dictionaryLengths;
    var dictionaryPrevCodes = lzwState.dictionaryPrevCodes;
    var codeLength = lzwState.codeLength;
    var prevCode = lzwState.prevCode;
    var currentSequence = lzwState.currentSequence;
    var currentSequenceLength = lzwState.currentSequenceLength;

    var decodedLength = 0;
    var currentBufferLength = this.bufferLength;
    var buffer = this.ensureBuffer(this.bufferLength + estimatedDecodedSize);

    for (i = 0; i < blockSize; i++) {
      var code = this.readBits(codeLength);
      var hasPrev = currentSequenceLength > 0;
      if (code < 256) {
        currentSequence[0] = code;
        currentSequenceLength = 1;
      } else if (code >= 258) {
        if (code < nextCode) {
          currentSequenceLength = dictionaryLengths[code];
          for (j = currentSequenceLength - 1, q = code; j >= 0; j--) {
            currentSequence[j] = dictionaryValues[q];
            q = dictionaryPrevCodes[q];
          }
        } else {
          currentSequence[currentSequenceLength++] = currentSequence[0];
        }
      } else if (code == 256) {
        codeLength = 9;
        nextCode = 258;
        currentSequenceLength = 0;
        continue;
      } else {
        this.eof = true;
        delete this.lzwState;
        break;
      }

      if (hasPrev) {
        dictionaryPrevCodes[nextCode] = prevCode;
        dictionaryLengths[nextCode] = dictionaryLengths[prevCode] + 1;
        dictionaryValues[nextCode] = currentSequence[0];
        nextCode++;
        codeLength = (nextCode + earlyChange) & (nextCode + earlyChange - 1) ?
          codeLength : Math.min(Math.log(nextCode + earlyChange) /
          0.6931471805599453 + 1, 12) | 0;
      }
      prevCode = code;

      decodedLength += currentSequenceLength;
      if (estimatedDecodedSize < decodedLength) {
        do {
          estimatedDecodedSize += decodedSizeDelta;
        } while (estimatedDecodedSize < decodedLength);
        buffer = this.ensureBuffer(this.bufferLength + estimatedDecodedSize);
      }
      for (j = 0; j < currentSequenceLength; j++) {
        buffer[currentBufferLength++] = currentSequence[j];
      }
    }
    lzwState.nextCode = nextCode;
    lzwState.codeLength = codeLength;
    lzwState.prevCode = prevCode;
    lzwState.currentSequenceLength = currentSequenceLength;

    this.bufferLength = currentBufferLength;
  };

  return LZWStream;
})();

blr.W15yQC.pdfChecker.Ascii85Stream = (function Ascii85StreamClosure() {
  function Ascii85Stream(str, maybeLength) {
    this.str = str;
    this.dict = str.dict;
    this.input = new Uint8Array(5);

    // Most streams increase in size when decoded, but Ascii85 streams
    // typically shrink by ~20%.
    if (maybeLength) {
      maybeLength = 0.8 * maybeLength;
    }
    blr.W15yQC.pdfChecker.DecodeStream.call(this, maybeLength);
  }

  Ascii85Stream.prototype = Object.create(blr.W15yQC.pdfChecker.DecodeStream.prototype);

  Ascii85Stream.prototype.readBlock = function Ascii85Stream_readBlock() {
    var TILDA_CHAR = 0x7E; // '~'
    var Z_LOWER_CHAR = 0x7A; // 'z'
    var EOF = -1;

    var str = this.str;

    var c = str.getByte();
    while (Lexer.isSpace(c)) {
      c = str.getByte();
    }

    if (c === EOF || c === TILDA_CHAR) {
      this.eof = true;
      return;
    }

    var bufferLength = this.bufferLength, buffer;
    var i;

    // special code for z
    if (c == Z_LOWER_CHAR) {
      buffer = this.ensureBuffer(bufferLength + 4);
      for (i = 0; i < 4; ++i) {
        buffer[bufferLength + i] = 0;
      }
      this.bufferLength += 4;
    } else {
      var input = this.input;
      input[0] = c;
      for (i = 1; i < 5; ++i) {
        c = str.getByte();
        while (blr.W15yQC.pdfChecker.Lexer.isSpace(c)) {
          c = str.getByte();
        }

        input[i] = c;

        if (c === EOF || c == TILDA_CHAR) {
          break;
        }
      }
      buffer = this.ensureBuffer(bufferLength + i - 1);
      this.bufferLength += i - 1;

      // partial ending;
      if (i < 5) {
        for (; i < 5; ++i) {
          input[i] = 0x21 + 84;
        }
        this.eof = true;
      }
      var t = 0;
      for (i = 0; i < 5; ++i) {
        t = t * 85 + (input[i] - 0x21);
      }

      for (i = 3; i >= 0; --i) {
        buffer[bufferLength + i] = t & 0xFF;
        t >>= 8;
      }
    }
  };

  return Ascii85Stream;
})();

blr.W15yQC.pdfChecker.AsciiHexStream = (function AsciiHexStreamClosure() {
  function AsciiHexStream(str, maybeLength) {
    this.str = str;
    this.dict = str.dict;

    this.firstDigit = -1;

    // Most streams increase in size when decoded, but AsciiHex streams shrink
    // by 50%.
    if (maybeLength) {
      maybeLength = 0.5 * maybeLength;
    }
    blr.W15yQC.pdfChecker.DecodeStream.call(this, maybeLength);
  }

  AsciiHexStream.prototype = Object.create(blr.W15yQC.pdfChecker.DecodeStream.prototype);

  AsciiHexStream.prototype.readBlock = function AsciiHexStream_readBlock() {
    var UPSTREAM_BLOCK_SIZE = 8000;
    var bytes = this.str.getBytes(UPSTREAM_BLOCK_SIZE);
    if (!bytes.length) {
      this.eof = true;
      return;
    }

    var maxDecodeLength = (bytes.length + 1) >> 1;
    var buffer = this.ensureBuffer(this.bufferLength + maxDecodeLength);
    var bufferLength = this.bufferLength;

    var firstDigit = this.firstDigit;
    for (var i = 0, ii = bytes.length; i < ii; i++) {
      var ch = bytes[i], digit;
      if (ch >= 0x30 && ch <= 0x39) { // '0'-'9'
        digit = ch & 0x0F;
      } else if ((ch >= 0x41 && ch <= 0x46) || (ch >= 0x61 && ch <= 0x66)) {
        // 'A'-'Z', 'a'-'z'
        digit = (ch & 0x0F) + 9;
      } else if (ch === 0x3E) { // '>'
        this.eof = true;
        break;
      } else { // probably whitespace
        continue; // ignoring
      }
      if (firstDigit < 0) {
        firstDigit = digit;
      } else {
        buffer[bufferLength++] = (firstDigit << 4) | digit;
        firstDigit = -1;
      }
    }
    if (firstDigit >= 0 && this.eof) {
      // incomplete byte
      buffer[bufferLength++] = (firstDigit << 4);
      firstDigit = -1;
    }
    this.firstDigit = firstDigit;
    this.bufferLength = bufferLength;
  };

  return AsciiHexStream;
})();

blr.W15yQC.pdfChecker.RunLengthStream = (function RunLengthStreamClosure() {
  function RunLengthStream(str, maybeLength) {
    this.str = str;
    this.dict = str.dict;

    blr.W15yQC.pdfChecker.DecodeStream.call(this, maybeLength);
  }

  RunLengthStream.prototype = Object.create(blr.W15yQC.pdfChecker.DecodeStream.prototype);

  RunLengthStream.prototype.readBlock = function RunLengthStream_readBlock() {
    // The repeatHeader has following format. The first byte defines type of run
    // and amount of bytes to repeat/copy: n = 0 through 127 - copy next n bytes
    // (in addition to the second byte from the header), n = 129 through 255 -
    // duplicate the second byte from the header (257 - n) times, n = 128 - end.
    var repeatHeader = this.str.getBytes(2);
    if (!repeatHeader || repeatHeader.length < 2 || repeatHeader[0] == 128) {
      this.eof = true;
      return;
    }

    var buffer;
    var bufferLength = this.bufferLength;
    var n = repeatHeader[0];
    if (n < 128) {
      // copy n bytes
      buffer = this.ensureBuffer(bufferLength + n + 1);
      buffer[bufferLength++] = repeatHeader[1];
      if (n > 0) {
        var source = this.str.getBytes(n);
        buffer.set(source, bufferLength);
        bufferLength += n;
      }
    } else {
      n = 257 - n;
      var b = repeatHeader[1];
      buffer = this.ensureBuffer(bufferLength + n + 1);
      for (var i = 0; i < n; i++) {
        buffer[bufferLength++] = b;
      }
    }
    this.bufferLength = bufferLength;
  };

  return RunLengthStream;
})();


blr.W15yQC.pdfChecker.CCITTFaxStream = (function CCITTFaxStreamClosure() {

  var ccittEOL = -2;
  var twoDimPass = 0;
  var twoDimHoriz = 1;
  var twoDimVert0 = 2;
  var twoDimVertR1 = 3;
  var twoDimVertL1 = 4;
  var twoDimVertR2 = 5;
  var twoDimVertL2 = 6;
  var twoDimVertR3 = 7;
  var twoDimVertL3 = 8;

  var twoDimTable = [
    [-1, -1], [-1, -1],                   // 000000x
    [7, twoDimVertL3],                    // 0000010
    [7, twoDimVertR3],                    // 0000011
    [6, twoDimVertL2], [6, twoDimVertL2], // 000010x
    [6, twoDimVertR2], [6, twoDimVertR2], // 000011x
    [4, twoDimPass], [4, twoDimPass],     // 0001xxx
    [4, twoDimPass], [4, twoDimPass],
    [4, twoDimPass], [4, twoDimPass],
    [4, twoDimPass], [4, twoDimPass],
    [3, twoDimHoriz], [3, twoDimHoriz],   // 001xxxx
    [3, twoDimHoriz], [3, twoDimHoriz],
    [3, twoDimHoriz], [3, twoDimHoriz],
    [3, twoDimHoriz], [3, twoDimHoriz],
    [3, twoDimHoriz], [3, twoDimHoriz],
    [3, twoDimHoriz], [3, twoDimHoriz],
    [3, twoDimHoriz], [3, twoDimHoriz],
    [3, twoDimHoriz], [3, twoDimHoriz],
    [3, twoDimVertL1], [3, twoDimVertL1], // 010xxxx
    [3, twoDimVertL1], [3, twoDimVertL1],
    [3, twoDimVertL1], [3, twoDimVertL1],
    [3, twoDimVertL1], [3, twoDimVertL1],
    [3, twoDimVertL1], [3, twoDimVertL1],
    [3, twoDimVertL1], [3, twoDimVertL1],
    [3, twoDimVertL1], [3, twoDimVertL1],
    [3, twoDimVertL1], [3, twoDimVertL1],
    [3, twoDimVertR1], [3, twoDimVertR1], // 011xxxx
    [3, twoDimVertR1], [3, twoDimVertR1],
    [3, twoDimVertR1], [3, twoDimVertR1],
    [3, twoDimVertR1], [3, twoDimVertR1],
    [3, twoDimVertR1], [3, twoDimVertR1],
    [3, twoDimVertR1], [3, twoDimVertR1],
    [3, twoDimVertR1], [3, twoDimVertR1],
    [3, twoDimVertR1], [3, twoDimVertR1],
    [1, twoDimVert0], [1, twoDimVert0],   // 1xxxxxx
    [1, twoDimVert0], [1, twoDimVert0],
    [1, twoDimVert0], [1, twoDimVert0],
    [1, twoDimVert0], [1, twoDimVert0],
    [1, twoDimVert0], [1, twoDimVert0],
    [1, twoDimVert0], [1, twoDimVert0],
    [1, twoDimVert0], [1, twoDimVert0],
    [1, twoDimVert0], [1, twoDimVert0],
    [1, twoDimVert0], [1, twoDimVert0],
    [1, twoDimVert0], [1, twoDimVert0],
    [1, twoDimVert0], [1, twoDimVert0],
    [1, twoDimVert0], [1, twoDimVert0],
    [1, twoDimVert0], [1, twoDimVert0],
    [1, twoDimVert0], [1, twoDimVert0],
    [1, twoDimVert0], [1, twoDimVert0],
    [1, twoDimVert0], [1, twoDimVert0],
    [1, twoDimVert0], [1, twoDimVert0],
    [1, twoDimVert0], [1, twoDimVert0],
    [1, twoDimVert0], [1, twoDimVert0],
    [1, twoDimVert0], [1, twoDimVert0],
    [1, twoDimVert0], [1, twoDimVert0],
    [1, twoDimVert0], [1, twoDimVert0],
    [1, twoDimVert0], [1, twoDimVert0],
    [1, twoDimVert0], [1, twoDimVert0],
    [1, twoDimVert0], [1, twoDimVert0],
    [1, twoDimVert0], [1, twoDimVert0],
    [1, twoDimVert0], [1, twoDimVert0],
    [1, twoDimVert0], [1, twoDimVert0],
    [1, twoDimVert0], [1, twoDimVert0],
    [1, twoDimVert0], [1, twoDimVert0],
    [1, twoDimVert0], [1, twoDimVert0],
    [1, twoDimVert0], [1, twoDimVert0]
  ];

  var whiteTable1 = [
    [-1, -1],                               // 00000
    [12, ccittEOL],                         // 00001
    [-1, -1], [-1, -1],                     // 0001x
    [-1, -1], [-1, -1], [-1, -1], [-1, -1], // 001xx
    [-1, -1], [-1, -1], [-1, -1], [-1, -1], // 010xx
    [-1, -1], [-1, -1], [-1, -1], [-1, -1], // 011xx
    [11, 1792], [11, 1792],                 // 1000x
    [12, 1984],                             // 10010
    [12, 2048],                             // 10011
    [12, 2112],                             // 10100
    [12, 2176],                             // 10101
    [12, 2240],                             // 10110
    [12, 2304],                             // 10111
    [11, 1856], [11, 1856],                 // 1100x
    [11, 1920], [11, 1920],                 // 1101x
    [12, 2368],                             // 11100
    [12, 2432],                             // 11101
    [12, 2496],                             // 11110
    [12, 2560]                              // 11111
  ];

  var whiteTable2 = [
    [-1, -1], [-1, -1], [-1, -1], [-1, -1],     // 0000000xx
    [8, 29], [8, 29],                           // 00000010x
    [8, 30], [8, 30],                           // 00000011x
    [8, 45], [8, 45],                           // 00000100x
    [8, 46], [8, 46],                           // 00000101x
    [7, 22], [7, 22], [7, 22], [7, 22],         // 0000011xx
    [7, 23], [7, 23], [7, 23], [7, 23],         // 0000100xx
    [8, 47], [8, 47],                           // 00001010x
    [8, 48], [8, 48],                           // 00001011x
    [6, 13], [6, 13], [6, 13], [6, 13],         // 000011xxx
    [6, 13], [6, 13], [6, 13], [6, 13],
    [7, 20], [7, 20], [7, 20], [7, 20],         // 0001000xx
    [8, 33], [8, 33],                           // 00010010x
    [8, 34], [8, 34],                           // 00010011x
    [8, 35], [8, 35],                           // 00010100x
    [8, 36], [8, 36],                           // 00010101x
    [8, 37], [8, 37],                           // 00010110x
    [8, 38], [8, 38],                           // 00010111x
    [7, 19], [7, 19], [7, 19], [7, 19],         // 0001100xx
    [8, 31], [8, 31],                           // 00011010x
    [8, 32], [8, 32],                           // 00011011x
    [6, 1], [6, 1], [6, 1], [6, 1],             // 000111xxx
    [6, 1], [6, 1], [6, 1], [6, 1],
    [6, 12], [6, 12], [6, 12], [6, 12],         // 001000xxx
    [6, 12], [6, 12], [6, 12], [6, 12],
    [8, 53], [8, 53],                           // 00100100x
    [8, 54], [8, 54],                           // 00100101x
    [7, 26], [7, 26], [7, 26], [7, 26],         // 0010011xx
    [8, 39], [8, 39],                           // 00101000x
    [8, 40], [8, 40],                           // 00101001x
    [8, 41], [8, 41],                           // 00101010x
    [8, 42], [8, 42],                           // 00101011x
    [8, 43], [8, 43],                           // 00101100x
    [8, 44], [8, 44],                           // 00101101x
    [7, 21], [7, 21], [7, 21], [7, 21],         // 0010111xx
    [7, 28], [7, 28], [7, 28], [7, 28],         // 0011000xx
    [8, 61], [8, 61],                           // 00110010x
    [8, 62], [8, 62],                           // 00110011x
    [8, 63], [8, 63],                           // 00110100x
    [8, 0], [8, 0],                             // 00110101x
    [8, 320], [8, 320],                         // 00110110x
    [8, 384], [8, 384],                         // 00110111x
    [5, 10], [5, 10], [5, 10], [5, 10],         // 00111xxxx
    [5, 10], [5, 10], [5, 10], [5, 10],
    [5, 10], [5, 10], [5, 10], [5, 10],
    [5, 10], [5, 10], [5, 10], [5, 10],
    [5, 11], [5, 11], [5, 11], [5, 11],         // 01000xxxx
    [5, 11], [5, 11], [5, 11], [5, 11],
    [5, 11], [5, 11], [5, 11], [5, 11],
    [5, 11], [5, 11], [5, 11], [5, 11],
    [7, 27], [7, 27], [7, 27], [7, 27],         // 0100100xx
    [8, 59], [8, 59],                           // 01001010x
    [8, 60], [8, 60],                           // 01001011x
    [9, 1472],                                  // 010011000
    [9, 1536],                                  // 010011001
    [9, 1600],                                  // 010011010
    [9, 1728],                                  // 010011011
    [7, 18], [7, 18], [7, 18], [7, 18],         // 0100111xx
    [7, 24], [7, 24], [7, 24], [7, 24],         // 0101000xx
    [8, 49], [8, 49],                           // 01010010x
    [8, 50], [8, 50],                           // 01010011x
    [8, 51], [8, 51],                           // 01010100x
    [8, 52], [8, 52],                           // 01010101x
    [7, 25], [7, 25], [7, 25], [7, 25],         // 0101011xx
    [8, 55], [8, 55],                           // 01011000x
    [8, 56], [8, 56],                           // 01011001x
    [8, 57], [8, 57],                           // 01011010x
    [8, 58], [8, 58],                           // 01011011x
    [6, 192], [6, 192], [6, 192], [6, 192],     // 010111xxx
    [6, 192], [6, 192], [6, 192], [6, 192],
    [6, 1664], [6, 1664], [6, 1664], [6, 1664], // 011000xxx
    [6, 1664], [6, 1664], [6, 1664], [6, 1664],
    [8, 448], [8, 448],                         // 01100100x
    [8, 512], [8, 512],                         // 01100101x
    [9, 704],                                   // 011001100
    [9, 768],                                   // 011001101
    [8, 640], [8, 640],                         // 01100111x
    [8, 576], [8, 576],                         // 01101000x
    [9, 832],                                   // 011010010
    [9, 896],                                   // 011010011
    [9, 960],                                   // 011010100
    [9, 1024],                                  // 011010101
    [9, 1088],                                  // 011010110
    [9, 1152],                                  // 011010111
    [9, 1216],                                  // 011011000
    [9, 1280],                                  // 011011001
    [9, 1344],                                  // 011011010
    [9, 1408],                                  // 011011011
    [7, 256], [7, 256], [7, 256], [7, 256],     // 0110111xx
    [4, 2], [4, 2], [4, 2], [4, 2],             // 0111xxxxx
    [4, 2], [4, 2], [4, 2], [4, 2],
    [4, 2], [4, 2], [4, 2], [4, 2],
    [4, 2], [4, 2], [4, 2], [4, 2],
    [4, 2], [4, 2], [4, 2], [4, 2],
    [4, 2], [4, 2], [4, 2], [4, 2],
    [4, 2], [4, 2], [4, 2], [4, 2],
    [4, 2], [4, 2], [4, 2], [4, 2],
    [4, 3], [4, 3], [4, 3], [4, 3],             // 1000xxxxx
    [4, 3], [4, 3], [4, 3], [4, 3],
    [4, 3], [4, 3], [4, 3], [4, 3],
    [4, 3], [4, 3], [4, 3], [4, 3],
    [4, 3], [4, 3], [4, 3], [4, 3],
    [4, 3], [4, 3], [4, 3], [4, 3],
    [4, 3], [4, 3], [4, 3], [4, 3],
    [4, 3], [4, 3], [4, 3], [4, 3],
    [5, 128], [5, 128], [5, 128], [5, 128],     // 10010xxxx
    [5, 128], [5, 128], [5, 128], [5, 128],
    [5, 128], [5, 128], [5, 128], [5, 128],
    [5, 128], [5, 128], [5, 128], [5, 128],
    [5, 8], [5, 8], [5, 8], [5, 8],             // 10011xxxx
    [5, 8], [5, 8], [5, 8], [5, 8],
    [5, 8], [5, 8], [5, 8], [5, 8],
    [5, 8], [5, 8], [5, 8], [5, 8],
    [5, 9], [5, 9], [5, 9], [5, 9],             // 10100xxxx
    [5, 9], [5, 9], [5, 9], [5, 9],
    [5, 9], [5, 9], [5, 9], [5, 9],
    [5, 9], [5, 9], [5, 9], [5, 9],
    [6, 16], [6, 16], [6, 16], [6, 16],         // 101010xxx
    [6, 16], [6, 16], [6, 16], [6, 16],
    [6, 17], [6, 17], [6, 17], [6, 17],         // 101011xxx
    [6, 17], [6, 17], [6, 17], [6, 17],
    [4, 4], [4, 4], [4, 4], [4, 4],             // 1011xxxxx
    [4, 4], [4, 4], [4, 4], [4, 4],
    [4, 4], [4, 4], [4, 4], [4, 4],
    [4, 4], [4, 4], [4, 4], [4, 4],
    [4, 4], [4, 4], [4, 4], [4, 4],
    [4, 4], [4, 4], [4, 4], [4, 4],
    [4, 4], [4, 4], [4, 4], [4, 4],
    [4, 4], [4, 4], [4, 4], [4, 4],
    [4, 5], [4, 5], [4, 5], [4, 5],             // 1100xxxxx
    [4, 5], [4, 5], [4, 5], [4, 5],
    [4, 5], [4, 5], [4, 5], [4, 5],
    [4, 5], [4, 5], [4, 5], [4, 5],
    [4, 5], [4, 5], [4, 5], [4, 5],
    [4, 5], [4, 5], [4, 5], [4, 5],
    [4, 5], [4, 5], [4, 5], [4, 5],
    [4, 5], [4, 5], [4, 5], [4, 5],
    [6, 14], [6, 14], [6, 14], [6, 14],         // 110100xxx
    [6, 14], [6, 14], [6, 14], [6, 14],
    [6, 15], [6, 15], [6, 15], [6, 15],         // 110101xxx
    [6, 15], [6, 15], [6, 15], [6, 15],
    [5, 64], [5, 64], [5, 64], [5, 64],         // 11011xxxx
    [5, 64], [5, 64], [5, 64], [5, 64],
    [5, 64], [5, 64], [5, 64], [5, 64],
    [5, 64], [5, 64], [5, 64], [5, 64],
    [4, 6], [4, 6], [4, 6], [4, 6],             // 1110xxxxx
    [4, 6], [4, 6], [4, 6], [4, 6],
    [4, 6], [4, 6], [4, 6], [4, 6],
    [4, 6], [4, 6], [4, 6], [4, 6],
    [4, 6], [4, 6], [4, 6], [4, 6],
    [4, 6], [4, 6], [4, 6], [4, 6],
    [4, 6], [4, 6], [4, 6], [4, 6],
    [4, 6], [4, 6], [4, 6], [4, 6],
    [4, 7], [4, 7], [4, 7], [4, 7],             // 1111xxxxx
    [4, 7], [4, 7], [4, 7], [4, 7],
    [4, 7], [4, 7], [4, 7], [4, 7],
    [4, 7], [4, 7], [4, 7], [4, 7],
    [4, 7], [4, 7], [4, 7], [4, 7],
    [4, 7], [4, 7], [4, 7], [4, 7],
    [4, 7], [4, 7], [4, 7], [4, 7],
    [4, 7], [4, 7], [4, 7], [4, 7]
  ];

  var blackTable1 = [
    [-1, -1], [-1, -1],                             // 000000000000x
    [12, ccittEOL], [12, ccittEOL],                 // 000000000001x
    [-1, -1], [-1, -1], [-1, -1], [-1, -1],         // 00000000001xx
    [-1, -1], [-1, -1], [-1, -1], [-1, -1],         // 00000000010xx
    [-1, -1], [-1, -1], [-1, -1], [-1, -1],         // 00000000011xx
    [-1, -1], [-1, -1], [-1, -1], [-1, -1],         // 00000000100xx
    [-1, -1], [-1, -1], [-1, -1], [-1, -1],         // 00000000101xx
    [-1, -1], [-1, -1], [-1, -1], [-1, -1],         // 00000000110xx
    [-1, -1], [-1, -1], [-1, -1], [-1, -1],         // 00000000111xx
    [11, 1792], [11, 1792], [11, 1792], [11, 1792], // 00000001000xx
    [12, 1984], [12, 1984],                         // 000000010010x
    [12, 2048], [12, 2048],                         // 000000010011x
    [12, 2112], [12, 2112],                         // 000000010100x
    [12, 2176], [12, 2176],                         // 000000010101x
    [12, 2240], [12, 2240],                         // 000000010110x
    [12, 2304], [12, 2304],                         // 000000010111x
    [11, 1856], [11, 1856], [11, 1856], [11, 1856], // 00000001100xx
    [11, 1920], [11, 1920], [11, 1920], [11, 1920], // 00000001101xx
    [12, 2368], [12, 2368],                         // 000000011100x
    [12, 2432], [12, 2432],                         // 000000011101x
    [12, 2496], [12, 2496],                         // 000000011110x
    [12, 2560], [12, 2560],                         // 000000011111x
    [10, 18], [10, 18], [10, 18], [10, 18],         // 0000001000xxx
    [10, 18], [10, 18], [10, 18], [10, 18],
    [12, 52], [12, 52],                             // 000000100100x
    [13, 640],                                      // 0000001001010
    [13, 704],                                      // 0000001001011
    [13, 768],                                      // 0000001001100
    [13, 832],                                      // 0000001001101
    [12, 55], [12, 55],                             // 000000100111x
    [12, 56], [12, 56],                             // 000000101000x
    [13, 1280],                                     // 0000001010010
    [13, 1344],                                     // 0000001010011
    [13, 1408],                                     // 0000001010100
    [13, 1472],                                     // 0000001010101
    [12, 59], [12, 59],                             // 000000101011x
    [12, 60], [12, 60],                             // 000000101100x
    [13, 1536],                                     // 0000001011010
    [13, 1600],                                     // 0000001011011
    [11, 24], [11, 24], [11, 24], [11, 24],         // 00000010111xx
    [11, 25], [11, 25], [11, 25], [11, 25],         // 00000011000xx
    [13, 1664],                                     // 0000001100100
    [13, 1728],                                     // 0000001100101
    [12, 320], [12, 320],                           // 000000110011x
    [12, 384], [12, 384],                           // 000000110100x
    [12, 448], [12, 448],                           // 000000110101x
    [13, 512],                                      // 0000001101100
    [13, 576],                                      // 0000001101101
    [12, 53], [12, 53],                             // 000000110111x
    [12, 54], [12, 54],                             // 000000111000x
    [13, 896],                                      // 0000001110010
    [13, 960],                                      // 0000001110011
    [13, 1024],                                     // 0000001110100
    [13, 1088],                                     // 0000001110101
    [13, 1152],                                     // 0000001110110
    [13, 1216],                                     // 0000001110111
    [10, 64], [10, 64], [10, 64], [10, 64],         // 0000001111xxx
    [10, 64], [10, 64], [10, 64], [10, 64]
  ];

  var blackTable2 = [
    [8, 13], [8, 13], [8, 13], [8, 13],     // 00000100xxxx
    [8, 13], [8, 13], [8, 13], [8, 13],
    [8, 13], [8, 13], [8, 13], [8, 13],
    [8, 13], [8, 13], [8, 13], [8, 13],
    [11, 23], [11, 23],                     // 00000101000x
    [12, 50],                               // 000001010010
    [12, 51],                               // 000001010011
    [12, 44],                               // 000001010100
    [12, 45],                               // 000001010101
    [12, 46],                               // 000001010110
    [12, 47],                               // 000001010111
    [12, 57],                               // 000001011000
    [12, 58],                               // 000001011001
    [12, 61],                               // 000001011010
    [12, 256],                              // 000001011011
    [10, 16], [10, 16], [10, 16], [10, 16], // 0000010111xx
    [10, 17], [10, 17], [10, 17], [10, 17], // 0000011000xx
    [12, 48],                               // 000001100100
    [12, 49],                               // 000001100101
    [12, 62],                               // 000001100110
    [12, 63],                               // 000001100111
    [12, 30],                               // 000001101000
    [12, 31],                               // 000001101001
    [12, 32],                               // 000001101010
    [12, 33],                               // 000001101011
    [12, 40],                               // 000001101100
    [12, 41],                               // 000001101101
    [11, 22], [11, 22],                     // 00000110111x
    [8, 14], [8, 14], [8, 14], [8, 14],     // 00000111xxxx
    [8, 14], [8, 14], [8, 14], [8, 14],
    [8, 14], [8, 14], [8, 14], [8, 14],
    [8, 14], [8, 14], [8, 14], [8, 14],
    [7, 10], [7, 10], [7, 10], [7, 10],     // 0000100xxxxx
    [7, 10], [7, 10], [7, 10], [7, 10],
    [7, 10], [7, 10], [7, 10], [7, 10],
    [7, 10], [7, 10], [7, 10], [7, 10],
    [7, 10], [7, 10], [7, 10], [7, 10],
    [7, 10], [7, 10], [7, 10], [7, 10],
    [7, 10], [7, 10], [7, 10], [7, 10],
    [7, 10], [7, 10], [7, 10], [7, 10],
    [7, 11], [7, 11], [7, 11], [7, 11],     // 0000101xxxxx
    [7, 11], [7, 11], [7, 11], [7, 11],
    [7, 11], [7, 11], [7, 11], [7, 11],
    [7, 11], [7, 11], [7, 11], [7, 11],
    [7, 11], [7, 11], [7, 11], [7, 11],
    [7, 11], [7, 11], [7, 11], [7, 11],
    [7, 11], [7, 11], [7, 11], [7, 11],
    [7, 11], [7, 11], [7, 11], [7, 11],
    [9, 15], [9, 15], [9, 15], [9, 15],     // 000011000xxx
    [9, 15], [9, 15], [9, 15], [9, 15],
    [12, 128],                              // 000011001000
    [12, 192],                              // 000011001001
    [12, 26],                               // 000011001010
    [12, 27],                               // 000011001011
    [12, 28],                               // 000011001100
    [12, 29],                               // 000011001101
    [11, 19], [11, 19],                     // 00001100111x
    [11, 20], [11, 20],                     // 00001101000x
    [12, 34],                               // 000011010010
    [12, 35],                               // 000011010011
    [12, 36],                               // 000011010100
    [12, 37],                               // 000011010101
    [12, 38],                               // 000011010110
    [12, 39],                               // 000011010111
    [11, 21], [11, 21],                     // 00001101100x
    [12, 42],                               // 000011011010
    [12, 43],                               // 000011011011
    [10, 0], [10, 0], [10, 0], [10, 0],     // 0000110111xx
    [7, 12], [7, 12], [7, 12], [7, 12],     // 0000111xxxxx
    [7, 12], [7, 12], [7, 12], [7, 12],
    [7, 12], [7, 12], [7, 12], [7, 12],
    [7, 12], [7, 12], [7, 12], [7, 12],
    [7, 12], [7, 12], [7, 12], [7, 12],
    [7, 12], [7, 12], [7, 12], [7, 12],
    [7, 12], [7, 12], [7, 12], [7, 12],
    [7, 12], [7, 12], [7, 12], [7, 12]
  ];

  var blackTable3 = [
    [-1, -1], [-1, -1], [-1, -1], [-1, -1], // 0000xx
    [6, 9],                                 // 000100
    [6, 8],                                 // 000101
    [5, 7], [5, 7],                         // 00011x
    [4, 6], [4, 6], [4, 6], [4, 6],         // 0010xx
    [4, 5], [4, 5], [4, 5], [4, 5],         // 0011xx
    [3, 1], [3, 1], [3, 1], [3, 1],         // 010xxx
    [3, 1], [3, 1], [3, 1], [3, 1],
    [3, 4], [3, 4], [3, 4], [3, 4],         // 011xxx
    [3, 4], [3, 4], [3, 4], [3, 4],
    [2, 3], [2, 3], [2, 3], [2, 3],         // 10xxxx
    [2, 3], [2, 3], [2, 3], [2, 3],
    [2, 3], [2, 3], [2, 3], [2, 3],
    [2, 3], [2, 3], [2, 3], [2, 3],
    [2, 2], [2, 2], [2, 2], [2, 2],         // 11xxxx
    [2, 2], [2, 2], [2, 2], [2, 2],
    [2, 2], [2, 2], [2, 2], [2, 2],
    [2, 2], [2, 2], [2, 2], [2, 2]
  ];

  function CCITTFaxStream(str, maybeLength, params) {
    this.str = str;
    this.dict = str.dict;

    params = params || blr.W15yQC.pdfChecker.Dict.empty;

    this.encoding = params.get('K') || 0;
    this.eoline = params.get('EndOfLine') || false;
    this.byteAlign = params.get('EncodedByteAlign') || false;
    this.columns = params.get('Columns') || 1728;
    this.rows = params.get('Rows') || 0;
    var eoblock = params.get('EndOfBlock');
    if (eoblock === null || eoblock === undefined) {
      eoblock = true;
    }
    this.eoblock = eoblock;
    this.black = params.get('BlackIs1') || false;

    this.codingLine = new Uint32Array(this.columns + 1);
    this.refLine = new Uint32Array(this.columns + 2);

    this.codingLine[0] = this.columns;
    this.codingPos = 0;

    this.row = 0;
    this.nextLine2D = this.encoding < 0;
    this.inputBits = 0;
    this.inputBuf = 0;
    this.outputBits = 0;

    var code1;
    while ((code1 = this.lookBits(12)) === 0) {
      this.eatBits(1);
    }
    if (code1 == 1) {
      this.eatBits(12);
    }
    if (this.encoding > 0) {
      this.nextLine2D = !this.lookBits(1);
      this.eatBits(1);
    }

    blr.W15yQC.pdfChecker.DecodeStream.call(this, maybeLength);
  }

  CCITTFaxStream.prototype = Object.create(blr.W15yQC.pdfChecker.DecodeStream.prototype);

  CCITTFaxStream.prototype.readBlock = function CCITTFaxStream_readBlock() {
    while (!this.eof) {
      var c = this.lookChar();
      this.ensureBuffer(this.bufferLength + 1);
      this.buffer[this.bufferLength++] = c;
    }
  };

  CCITTFaxStream.prototype.addPixels =
      function ccittFaxStreamAddPixels(a1, blackPixels) {
    var codingLine = this.codingLine;
    var codingPos = this.codingPos;

    if (a1 > codingLine[codingPos]) {
      if (a1 > this.columns) {
        blr.W15yQC.pdfChecker.info('row is wrong length');
        this.err = true;
        a1 = this.columns;
      }
      if ((codingPos & 1) ^ blackPixels) {
        ++codingPos;
      }

      codingLine[codingPos] = a1;
    }
    this.codingPos = codingPos;
  };

  CCITTFaxStream.prototype.addPixelsNeg =
      function ccittFaxStreamAddPixelsNeg(a1, blackPixels) {
    var codingLine = this.codingLine;
    var codingPos = this.codingPos;

    if (a1 > codingLine[codingPos]) {
      if (a1 > this.columns) {
        blr.W15yQC.pdfChecker.info('row is wrong length');
        this.err = true;
        a1 = this.columns;
      }
      if ((codingPos & 1) ^ blackPixels) {
        ++codingPos;
      }

      codingLine[codingPos] = a1;
    } else if (a1 < codingLine[codingPos]) {
      if (a1 < 0) {
        blr.W15yQC.pdfChecker.info('invalid code');
        this.err = true;
        a1 = 0;
      }
      while (codingPos > 0 && a1 < codingLine[codingPos - 1]) {
        --codingPos;
      }
      codingLine[codingPos] = a1;
    }

    this.codingPos = codingPos;
  };

  CCITTFaxStream.prototype.lookChar = function CCITTFaxStream_lookChar() {
    var refLine = this.refLine;
    var codingLine = this.codingLine;
    var columns = this.columns;

    var refPos, blackPixels, bits, i;

    if (this.outputBits === 0) {
      if (this.eof) {
        return null;
      }
      this.err = false;

      var code1, code2, code3;
      if (this.nextLine2D) {
        for (i = 0; codingLine[i] < columns; ++i) {
          refLine[i] = codingLine[i];
        }
        refLine[i++] = columns;
        refLine[i] = columns;
        codingLine[0] = 0;
        this.codingPos = 0;
        refPos = 0;
        blackPixels = 0;

        while (codingLine[this.codingPos] < columns) {
          code1 = this.getTwoDimCode();
          switch (code1) {
            case twoDimPass:
              this.addPixels(refLine[refPos + 1], blackPixels);
              if (refLine[refPos + 1] < columns) {
                refPos += 2;
              }
              break;
            case twoDimHoriz:
              code1 = code2 = 0;
              if (blackPixels) {
                do {
                  code1 += (code3 = this.getBlackCode());
                } while (code3 >= 64);
                do {
                  code2 += (code3 = this.getWhiteCode());
                } while (code3 >= 64);
              } else {
                do {
                  code1 += (code3 = this.getWhiteCode());
                } while (code3 >= 64);
                do {
                  code2 += (code3 = this.getBlackCode());
                } while (code3 >= 64);
              }
              this.addPixels(codingLine[this.codingPos] +
                             code1, blackPixels);
              if (codingLine[this.codingPos] < columns) {
                this.addPixels(codingLine[this.codingPos] + code2,
                               blackPixels ^ 1);
              }
              while (refLine[refPos] <= codingLine[this.codingPos] &&
                     refLine[refPos] < columns) {
                refPos += 2;
              }
              break;
            case twoDimVertR3:
              this.addPixels(refLine[refPos] + 3, blackPixels);
              blackPixels ^= 1;
              if (codingLine[this.codingPos] < columns) {
                ++refPos;
                while (refLine[refPos] <= codingLine[this.codingPos] &&
                       refLine[refPos] < columns) {
                  refPos += 2;
                }
              }
              break;
            case twoDimVertR2:
              this.addPixels(refLine[refPos] + 2, blackPixels);
              blackPixels ^= 1;
              if (codingLine[this.codingPos] < columns) {
                ++refPos;
                while (refLine[refPos] <= codingLine[this.codingPos] &&
                       refLine[refPos] < columns) {
                  refPos += 2;
                }
              }
              break;
            case twoDimVertR1:
              this.addPixels(refLine[refPos] + 1, blackPixels);
              blackPixels ^= 1;
              if (codingLine[this.codingPos] < columns) {
                ++refPos;
                while (refLine[refPos] <= codingLine[this.codingPos] &&
                       refLine[refPos] < columns) {
                  refPos += 2;
                }
              }
              break;
            case twoDimVert0:
              this.addPixels(refLine[refPos], blackPixels);
              blackPixels ^= 1;
              if (codingLine[this.codingPos] < columns) {
                ++refPos;
                while (refLine[refPos] <= codingLine[this.codingPos] &&
                       refLine[refPos] < columns) {
                  refPos += 2;
                }
              }
              break;
            case twoDimVertL3:
              this.addPixelsNeg(refLine[refPos] - 3, blackPixels);
              blackPixels ^= 1;
              if (codingLine[this.codingPos] < columns) {
                if (refPos > 0) {
                  --refPos;
                } else {
                  ++refPos;
                }
                while (refLine[refPos] <= codingLine[this.codingPos] &&
                       refLine[refPos] < columns) {
                  refPos += 2;
                }
              }
              break;
            case twoDimVertL2:
              this.addPixelsNeg(refLine[refPos] - 2, blackPixels);
              blackPixels ^= 1;
              if (codingLine[this.codingPos] < columns) {
                if (refPos > 0) {
                  --refPos;
                } else {
                  ++refPos;
                }
                while (refLine[refPos] <= codingLine[this.codingPos] &&
                       refLine[refPos] < columns) {
                  refPos += 2;
                }
              }
              break;
            case twoDimVertL1:
              this.addPixelsNeg(refLine[refPos] - 1, blackPixels);
              blackPixels ^= 1;
              if (codingLine[this.codingPos] < columns) {
                if (refPos > 0) {
                  --refPos;
                } else {
                  ++refPos;
                }
                while (refLine[refPos] <= codingLine[this.codingPos] &&
                       refLine[refPos] < columns) {
                  refPos += 2;
                }
              }
              break;
            case blr.W15yQC.pdfChecker.EOF:
              this.addPixels(columns, 0);
              this.eof = true;
              break;
            default:
              blr.W15yQC.pdfChecker.info('bad 2d code');
              this.addPixels(columns, 0);
              this.err = true;
          }
        }
      } else {
        codingLine[0] = 0;
        this.codingPos = 0;
        blackPixels = 0;
        while (codingLine[this.codingPos] < columns) {
          code1 = 0;
          if (blackPixels) {
            do {
              code1 += (code3 = this.getBlackCode());
            } while (code3 >= 64);
          } else {
            do {
              code1 += (code3 = this.getWhiteCode());
            } while (code3 >= 64);
          }
          this.addPixels(codingLine[this.codingPos] + code1, blackPixels);
          blackPixels ^= 1;
        }
      }

      if (this.byteAlign) {
        this.inputBits &= ~7;
      }

      var gotEOL = false;

      if (!this.eoblock && this.row == this.rows - 1) {
        this.eof = true;
      } else {
        code1 = this.lookBits(12);
        while (code1 === 0) {
          this.eatBits(1);
          code1 = this.lookBits(12);
        }
        if (code1 == 1) {
          this.eatBits(12);
          gotEOL = true;
        } else if (code1 == blr.W15yQC.pdfChecker.EOF) {
          this.eof = true;
        }
      }

      if (!this.eof && this.encoding > 0) {
        this.nextLine2D = !this.lookBits(1);
        this.eatBits(1);
      }

      if (this.eoblock && gotEOL) {
        code1 = this.lookBits(12);
        if (code1 == 1) {
          this.eatBits(12);
          if (this.encoding > 0) {
            this.lookBits(1);
            this.eatBits(1);
          }
          if (this.encoding >= 0) {
            for (i = 0; i < 4; ++i) {
              code1 = this.lookBits(12);
              if (code1 != 1) {
                blr.W15yQC.pdfChecker.info('bad rtc code: ' + code1);
              }
              this.eatBits(12);
              if (this.encoding > 0) {
                this.lookBits(1);
                this.eatBits(1);
              }
            }
          }
          this.eof = true;
        }
      } else if (this.err && this.eoline) {
        while (true) {
          code1 = this.lookBits(13);
          if (code1 == blr.W15yQC.pdfChecker.EOF) {
            this.eof = true;
            return null;
          }
          if ((code1 >> 1) == 1) {
            break;
          }
          this.eatBits(1);
        }
        this.eatBits(12);
        if (this.encoding > 0) {
          this.eatBits(1);
          this.nextLine2D = !(code1 & 1);
        }
      }

      if (codingLine[0] > 0) {
        this.outputBits = codingLine[this.codingPos = 0];
      } else {
        this.outputBits = codingLine[this.codingPos = 1];
      }
      this.row++;
    }

    var c;
    if (this.outputBits >= 8) {
      c = (this.codingPos & 1) ? 0 : 0xFF;
      this.outputBits -= 8;
      if (this.outputBits === 0 && codingLine[this.codingPos] < columns) {
        this.codingPos++;
        this.outputBits = (codingLine[this.codingPos] -
                           codingLine[this.codingPos - 1]);
      }
    } else {
      bits = 8;
      c = 0;
      do {
        if (this.outputBits > bits) {
          c <<= bits;
          if (!(this.codingPos & 1)) {
            c |= 0xFF >> (8 - bits);
          }
          this.outputBits -= bits;
          bits = 0;
        } else {
          c <<= this.outputBits;
          if (!(this.codingPos & 1)) {
            c |= 0xFF >> (8 - this.outputBits);
          }
          bits -= this.outputBits;
          this.outputBits = 0;
          if (codingLine[this.codingPos] < columns) {
            this.codingPos++;
            this.outputBits = (codingLine[this.codingPos] -
                               codingLine[this.codingPos - 1]);
          } else if (bits > 0) {
            c <<= bits;
            bits = 0;
          }
        }
      } while (bits);
    }
    if (this.black) {
      c ^= 0xFF;
    }
    return c;
  };

  // This functions returns the code found from the table.
  // The start and end parameters set the boundaries for searching the table.
  // The limit parameter is optional. Function returns an array with three
  // values. The first array element indicates whether a valid code is being
  // returned. The second array element is the actual code. The third array
  // element indicates whether EOF was reached.
  CCITTFaxStream.prototype.findTableCode =
      function ccittFaxStreamFindTableCode(start, end, table, limit) {

    var limitValue = limit || 0;
    for (var i = start; i <= end; ++i) {
      var code = this.lookBits(i);
      if (code == blr.W15yQC.pdfChecker.EOF) {
        return [true, 1, false];
      }
      if (i < end) {
        code <<= end - i;
      }
      if (!limitValue || code >= limitValue) {
        var p = table[code - limitValue];
        if (p[0] == i) {
          this.eatBits(i);
          return [true, p[1], true];
        }
      }
    }
    return [false, 0, false];
  };

  CCITTFaxStream.prototype.getTwoDimCode =
      function ccittFaxStreamGetTwoDimCode() {

    var code = 0;
    var p;
    if (this.eoblock) {
      code = this.lookBits(7);
      p = twoDimTable[code];
      if (p && p[0] > 0) {
        this.eatBits(p[0]);
        return p[1];
      }
    } else {
      var result = this.findTableCode(1, 7, twoDimTable);
      if (result[0] && result[2]) {
        return result[1];
      }
    }
    blr.W15yQC.pdfChecker.info('Bad two dim code');
    return blr.W15yQC.pdfChecker.EOF;
  };

  CCITTFaxStream.prototype.getWhiteCode =
      function ccittFaxStreamGetWhiteCode() {

    var code = 0;
    var p;
    if (this.eoblock) {
      code = this.lookBits(12);
      if (code == blr.W15yQC.pdfChecker.EOF) {
        return 1;
      }

      if ((code >> 5) === 0) {
        p = whiteTable1[code];
      } else {
        p = whiteTable2[code >> 3];
      }

      if (p[0] > 0) {
        this.eatBits(p[0]);
        return p[1];
      }
    } else {
      var result = this.findTableCode(1, 9, whiteTable2);
      if (result[0]) {
        return result[1];
      }

      result = this.findTableCode(11, 12, whiteTable1);
      if (result[0]) {
        return result[1];
      }
    }
    blr.W15yQC.pdfChecker.info('bad white code');
    this.eatBits(1);
    return 1;
  };

  CCITTFaxStream.prototype.getBlackCode =
      function ccittFaxStreamGetBlackCode() {

    var code, p;
    if (this.eoblock) {
      code = this.lookBits(13);
      if (code == blr.W15yQC.pdfChecker.EOF) {
        return 1;
      }
      if ((code >> 7) === 0) {
        p = blackTable1[code];
      } else if ((code >> 9) === 0 && (code >> 7) !== 0) {
        p = blackTable2[(code >> 1) - 64];
      } else {
        p = blackTable3[code >> 7];
      }

      if (p[0] > 0) {
        this.eatBits(p[0]);
        return p[1];
      }
    } else {
      var result = this.findTableCode(2, 6, blackTable3);
      if (result[0]) {
        return result[1];
      }

      result = this.findTableCode(7, 12, blackTable2, 64);
      if (result[0]) {
        return result[1];
      }

      result = this.findTableCode(10, 13, blackTable1);
      if (result[0]) {
        return result[1];
      }
    }
    blr.W15yQC.pdfChecker.info('bad black code');
    this.eatBits(1);
    return 1;
  };

  CCITTFaxStream.prototype.lookBits = function CCITTFaxStream_lookBits(n) {
    var c;
    while (this.inputBits < n) {
      if ((c = this.str.getByte()) === -1) {
        if (this.inputBits === 0) {
          return blr.W15yQC.pdfChecker.EOF;
        }
        return ((this.inputBuf << (n - this.inputBits)) &
                (0xFFFF >> (16 - n)));
      }
      this.inputBuf = (this.inputBuf << 8) + c;
      this.inputBits += 8;
    }
    return (this.inputBuf >> (this.inputBits - n)) & (0xFFFF >> (16 - n));
  };

  CCITTFaxStream.prototype.eatBits = function CCITTFaxStream_eatBits(n) {
    if ((this.inputBits -= n) < 0) {
      this.inputBits = 0;
    }
  };

  return CCITTFaxStream;
})();

blr.W15yQC.pdfChecker.JpegStream = (function JpegStreamClosure() {
  function JpegStream(stream, maybeLength, dict, xref) {
    // TODO: per poppler, some images may have 'junk' before that
    // need to be removed
    this.stream = stream;
    this.maybeLength = maybeLength;
    this.dict = dict;

    blr.W15yQC.pdfChecker.DecodeStream.call(this, maybeLength);
  }

  JpegStream.prototype = Object.create(blr.W15yQC.pdfChecker.DecodeStream.prototype);

  Object.defineProperty(JpegStream.prototype, 'bytes', {
    get: function JpegStream_bytes() {
      // If this.maybeLength is null, we'll get the entire stream.
      return blr.W15yQC.pdfChecker.shadow(this, 'bytes', this.stream.getBytes(this.maybeLength));
    },
    configurable: true
  });

  JpegStream.prototype.ensureBuffer = function JpegStream_ensureBuffer(req) {
    if (this.bufferLength) {
      return;
    }
    try {
      var jpegImage = new JpegImage();
      if (this.colorTransform != -1) {
        jpegImage.colorTransform = this.colorTransform;
      }
      jpegImage.parse(this.bytes);
      var data = jpegImage.getData(this.drawWidth, this.drawHeight,
                                   /* forceRGBoutput = */true);
      this.buffer = data;
      this.bufferLength = data.length;
      this.eof = true;
    } catch (e) {
      blr.W15yQC.pdfChecker.error('JPEG error: ' + e);
    }
  };

  JpegStream.prototype.getBytes = function JpegStream_getBytes(length) {
    this.ensureBuffer();
    return this.buffer;
  };

  JpegStream.prototype.getIR = function JpegStream_getIR() {
    return PDFJS.createObjectURL(this.bytes, 'image/jpeg');
  };
  /**
   * Checks if the image can be decoded and displayed by the browser without any
   * further processing such as color space conversions.
   */
  JpegStream.prototype.isNativelySupported =
      function JpegStream_isNativelySupported(xref, res) {
    var cs = ColorSpace.parse(this.dict.get('ColorSpace', 'CS'), xref, res);
    return cs.name === 'DeviceGray' || cs.name === 'DeviceRGB';
  };
  /**
   * Checks if the image can be decoded by the browser.
   */
  JpegStream.prototype.isNativelyDecodable =
      function JpegStream_isNativelyDecodable(xref, res) {
    var cs = ColorSpace.parse(this.dict.get('ColorSpace', 'CS'), xref, res);
    var numComps = cs.numComps;
    return numComps == 1 || numComps == 3;
  };

  return JpegStream;
})();

/**
 * For JPEG 2000's we use a library to decode these images and
 * the stream behaves like all the other DecodeStreams.
 */
blr.W15yQC.pdfChecker.JpxStream = (function JpxStreamClosure() {
  function JpxStream(stream, maybeLength, dict) {
    this.stream = stream;
    this.maybeLength = maybeLength;
    this.dict = dict;

    blr.W15yQC.pdfChecker.DecodeStream.call(this, maybeLength);
  }

  JpxStream.prototype = Object.create(blr.W15yQC.pdfChecker.DecodeStream.prototype);

  Object.defineProperty(JpxStream.prototype, 'bytes', {
    get: function JpxStream_bytes() {
      // If this.maybeLength is null, we'll get the entire stream.
      return blr.W15yQC.pdfChecker.shadow(this, 'bytes', this.stream.getBytes(this.maybeLength));
    },
    configurable: true
  });

  JpxStream.prototype.ensureBuffer = function JpxStream_ensureBuffer(req) {
    if (this.bufferLength) {
      return;
    }

    var jpxImage = new JpxImage();
    jpxImage.parse(this.bytes);

    var width = jpxImage.width;
    var height = jpxImage.height;
    var componentsCount = jpxImage.componentsCount;
    var tileCount = jpxImage.tiles.length;
    if (tileCount === 1) {
      this.buffer = jpxImage.tiles[0].items;
    } else {
      var data = new Uint8Array(width * height * componentsCount);

      for (var k = 0; k < tileCount; k++) {
        var tileComponents = jpxImage.tiles[k];
        var tileWidth = tileComponents.width;
        var tileHeight = tileComponents.height;
        var tileLeft = tileComponents.left;
        var tileTop = tileComponents.top;

        var src = tileComponents.items;
        var srcPosition = 0;
        var dataPosition = (width * tileTop + tileLeft) * componentsCount;
        var imgRowSize = width * componentsCount;
        var tileRowSize = tileWidth * componentsCount;

        for (var j = 0; j < tileHeight; j++) {
          var rowBytes = src.subarray(srcPosition, srcPosition + tileRowSize);
          data.set(rowBytes, dataPosition);
          srcPosition += tileRowSize;
          dataPosition += imgRowSize;
        }
      }
      this.buffer = data;
    }
    this.bufferLength = this.buffer.length;
    this.eof = true;
  };

  return JpxStream;
})();

/**
 * For JBIG2's we use a library to decode these images and
 * the stream behaves like all the other DecodeStreams.
 */
blr.W15yQC.pdfChecker.Jbig2Stream = (function Jbig2StreamClosure() {
  function Jbig2Stream(stream, maybeLength, dict) {
    this.stream = stream;
    this.maybeLength = maybeLength;
    this.dict = dict;

    blr.W15yQC.pdfChecker.DecodeStream.call(this, maybeLength);
  }

  Jbig2Stream.prototype = Object.create(blr.W15yQC.pdfChecker.DecodeStream.prototype);

  Object.defineProperty(Jbig2Stream.prototype, 'bytes', {
    get: function Jbig2Stream_bytes() {
      // If this.maybeLength is null, we'll get the entire stream.
      return blr.W15yQC.pdfChecker.shadow(this, 'bytes', this.stream.getBytes(this.maybeLength));
    },
    configurable: true
  });

  Jbig2Stream.prototype.ensureBuffer = function Jbig2Stream_ensureBuffer(req) {
    if (this.bufferLength) {
      return;
    }

    var jbig2Image = new Jbig2Image();

    var chunks = [], decodeParams = this.dict.get('DecodeParms');

    // According to the PDF specification, DecodeParms can be either
    // a dictionary, or an array whose elements are dictionaries.
    if (isArray(decodeParams)) {
      if (decodeParams.length > 1) {
        blr.W15yQC.pdfChecker.warn('JBIG2 - \'DecodeParms\' array with multiple elements ' +
             'not supported.');
      }
      decodeParams = decodeParams[0];
    }
    if (decodeParams && decodeParams.has('JBIG2Globals')) {
      var globalsStream = decodeParams.get('JBIG2Globals');
      var globals = globalsStream.getBytes();
      chunks.push({data: globals, start: 0, end: globals.length});
    }
    chunks.push({data: this.bytes, start: 0, end: this.bytes.length});
    var data = jbig2Image.parseChunks(chunks);
    var dataLength = data.length;

    // JBIG2 had black as 1 and white as 0, inverting the colors
    for (var i = 0; i < dataLength; i++) {
      data[i] ^= 0xFF;
    }

    this.buffer = data;
    this.bufferLength = dataLength;
    this.eof = true;
  };

  return Jbig2Stream;
})();

blr.W15yQC.pdfChecker.Parser = (function ParserClosure() {
  function Parser(lexer, allowStreams, xref) {
    this.lexer = lexer;
    this.allowStreams = allowStreams;
    this.xref = xref;
    this.imageCache = {
      length: 0,
      adler32: 0,
      stream: null
    };
    this.refill();
  }

  Parser.prototype = {
    refill: function Parser_refill() {
      this.buf1 = this.lexer.getObj();
      this.buf2 = this.lexer.getObj();
    },
    shift: function Parser_shift() {
      if (blr.W15yQC.pdfChecker.isCmd(this.buf2, 'ID')) {
        this.buf1 = this.buf2;
        this.buf2 = null;
      } else {
        this.buf1 = this.buf2;
        this.buf2 = this.lexer.getObj();
      }
    },
    getObj: function Parser_getObj(cipherTransform) {
      if (blr.W15yQC.pdfChecker.isCmd(this.buf1, 'BI')) { // inline image
        this.shift();
        return this.makeInlineImage(cipherTransform);
      }
      if (blr.W15yQC.pdfChecker.isCmd(this.buf1, '[')) { // array
        this.shift();
        var array = [];
        while (!blr.W15yQC.pdfChecker.isCmd(this.buf1, ']') && !blr.W15yQC.pdfChecker.isEOF(this.buf1)) {
          array.push(this.getObj(cipherTransform));
        }
        if (blr.W15yQC.pdfChecker.isEOF(this.buf1)) {
          //error('End of file inside array');
        }
        this.shift();
        return array;
      }
      if (blr.W15yQC.pdfChecker.isCmd(this.buf1, '<<')) { // dictionary or stream
        this.shift();
        var dict = new blr.W15yQC.pdfChecker.Dict(this.xref);
        while (!blr.W15yQC.pdfChecker.isCmd(this.buf1, '>>') && !blr.W15yQC.pdfChecker.isEOF(this.buf1)) {
          if (!blr.W15yQC.pdfChecker.isName(this.buf1)) {
            blr.W15yQC.pdfChecker.info('Malformed dictionary: key must be a name object');
            this.shift();
            continue;
          }

          var key = this.buf1.name;
          this.shift();
          if (blr.W15yQC.pdfChecker.isEOF(this.buf1)) {
            break;
          }
          dict.set(key, this.getObj(cipherTransform));
        }
        if (blr.W15yQC.pdfChecker.isEOF(this.buf1)) {
          //error('End of file inside dictionary');
        }

        // Stream objects are not allowed inside content streams or
        // object streams.
        if (blr.W15yQC.pdfChecker.isCmd(this.buf2, 'stream')) {
          return (this.allowStreams ? this.makeStream(dict, cipherTransform) : dict);
        }
        this.shift();
        return dict;
      }
      if (blr.W15yQC.pdfChecker.isInt(this.buf1)) { // indirect reference or integer
        var num = this.buf1;
        this.shift();
        if (blr.W15yQC.pdfChecker.isInt(this.buf1) && blr.W15yQC.pdfChecker.isCmd(this.buf2, 'R')) {
          var ref = new blr.W15yQC.pdfChecker.Ref(num, this.buf1);
          this.shift();
          this.shift();
          return ref;
        }
        return num;
      }
      if (blr.W15yQC.pdfChecker.isString(this.buf1)) { // string
        var str = this.buf1;
        this.shift();
        if (cipherTransform) {
          str = cipherTransform.decryptString(str);
        }
        return str;
      }

      // simple object
      var obj = this.buf1;
      this.shift();
      return obj;
    },
    makeInlineImage: function Parser_makeInlineImage(cipherTransform) {
      var lexer = this.lexer;
      var stream = lexer.stream;

      // parse dictionary
      var dict = new Dict(null);
      while (!blr.W15yQC.pdfChecker.isCmd(this.buf1, 'ID') && !blr.W15yQC.pdfChecker.isEOF(this.buf1)) {
        if (!blr.W15yQC.pdfChecker.isName(this.buf1)) {
          //error('Dictionary key must be a name object');
        }

        var key = this.buf1.name;
        this.shift();
        if (blr.W15yQC.pdfChecker.isEOF(this.buf1)) {
          break;
        }
        dict.set(key, this.getObj(cipherTransform));
      }

      // parse image stream
      var startPos = stream.pos;

      // searching for the /EI\s/
      var state = 0, ch, i, ii;
      while (state != 4 && (ch = stream.getByte()) !== -1) {
        switch (ch | 0) {
          case 0x20:
          case 0x0D:
          case 0x0A:
            // let's check next five bytes to be ASCII... just be sure
            var followingBytes = stream.peekBytes(5);
            for (i = 0, ii = followingBytes.length; i < ii; i++) {
              ch = followingBytes[i];
              if (ch !== 0x0A && ch !== 0x0D && (ch < 0x20 || ch > 0x7F)) {
                // not a LF, CR, SPACE or any visible ASCII character
                state = 0;
                break; // some binary stuff found, resetting the state
              }
            }
            state = (state === 3 ? 4 : 0);
            break;
          case 0x45:
            state = 2;
            break;
          case 0x49:
            state = (state === 2 ? 3 : 0);
            break;
          default:
            state = 0;
            break;
        }
      }

      var length = (stream.pos - 4) - startPos;
      var imageStream = stream.makeSubStream(startPos, length, dict);

      // trying to cache repeat images, first we are trying to "warm up" caching
      // using length, then comparing adler32
      var MAX_LENGTH_TO_CACHE = 1000;
      var cacheImage = false, adler32;
      if (length < MAX_LENGTH_TO_CACHE && this.imageCache.length === length) {
        var imageBytes = imageStream.getBytes();
        imageStream.reset();

        var a = 1;
        var b = 0;
        for (i = 0, ii = imageBytes.length; i < ii; ++i) {
          a = (a + (imageBytes[i] & 0xff)) % 65521;
          b = (b + a) % 65521;
        }
        adler32 = (b << 16) | a;

        if (this.imageCache.stream && this.imageCache.adler32 === adler32) {
          this.buf2 = blr.W15yQC.pdfChecker.Cmd.get('EI');
          this.shift();

          this.imageCache.stream.reset();
          return this.imageCache.stream;
        }
        cacheImage = true;
      }
      if (!cacheImage && !this.imageCache.stream) {
        this.imageCache.length = length;
        this.imageCache.stream = null;
      }

      if (cipherTransform) {
        imageStream = cipherTransform.createStream(imageStream, length);
      }

      imageStream = this.filter(imageStream, dict, length);
      imageStream.dict = dict;
      if (cacheImage) {
        imageStream.cacheKey = 'inline_' + length + '_' + adler32;
        this.imageCache.adler32 = adler32;
        this.imageCache.stream = imageStream;
      }

      this.buf2 = blr.W15yQC.pdfChecker.Cmd.get('EI');
      this.shift();

      return imageStream;
    },
    fetchIfRef: function Parser_fetchIfRef(obj) {
      // not relying on the xref.fetchIfRef -- xref might not be set
      return (blr.W15yQC.pdfChecker.isRef(obj) ? this.xref.fetch(obj) : obj);
    },
    makeStream: function Parser_makeStream(dict, cipherTransform) {
      var lexer = this.lexer;
      var stream = lexer.stream;

      // get stream start position
      lexer.skipToNextLine();
      var pos = stream.pos - 1;

      // get length
      var length = this.fetchIfRef(dict.get('Length'));
      if (!blr.W15yQC.pdfChecker.isInt(length)) {
        blr.W15yQC.pdfChecker.info('Bad ' + length + ' attribute in stream');
        length = 0;
      }

      // skip over the stream data
      stream.pos = pos + length;
      lexer.nextChar();

      this.shift(); // '>>'
      this.shift(); // 'stream'
      if (!blr.W15yQC.pdfChecker.isCmd(this.buf1, 'endstream')) {
        // bad stream length, scanning for endstream
        stream.pos = pos;
        var SCAN_BLOCK_SIZE = 2048;
        var ENDSTREAM_SIGNATURE_LENGTH = 9;
        var ENDSTREAM_SIGNATURE = [0x65, 0x6E, 0x64, 0x73, 0x74, 0x72, 0x65, 0x61, 0x6D];
        var skipped = 0, found = false, i, j;
        while (stream.pos < stream.end) {
          var scanBytes = stream.peekBytes(SCAN_BLOCK_SIZE);
          var scanLength = scanBytes.length - ENDSTREAM_SIGNATURE_LENGTH;
          found = false;
          for (i = 0, j = 0; i < scanLength; i++) {
            var b = scanBytes[i];
            if (b !== ENDSTREAM_SIGNATURE[j]) {
              i -= j;
              j = 0;
            } else {
              j++;
              if (j >= ENDSTREAM_SIGNATURE_LENGTH) {
                i++;
                found = true;
                break;
              }
            }
          }
          if (found) {
            skipped += i - ENDSTREAM_SIGNATURE_LENGTH;
            stream.pos += i - ENDSTREAM_SIGNATURE_LENGTH;
            break;
          }
          skipped += scanLength;
          stream.pos += scanLength;
        }
        if (!found) {
          //error('Missing endstream');
        }
        length = skipped;

        lexer.nextChar();
        this.shift();
        this.shift();
      }
      this.shift(); // 'endstream'

      stream = stream.makeSubStream(pos, length, dict);
      if (cipherTransform) {
        stream = cipherTransform.createStream(stream, length);
      }
      stream = this.filter(stream, dict, length);
      stream.dict = dict;
      return stream;
    },
    filter: function Parser_filter(stream, dict, length) {
      var filter = this.fetchIfRef(dict.get('Filter', 'F'));
      var params = this.fetchIfRef(dict.get('DecodeParms', 'DP'));
      if (blr.W15yQC.pdfChecker.isName(filter)) {
        return this.makeFilter(stream, filter.name, length, params);
      }

      var maybeLength = length;
      if (blr.W15yQC.pdfChecker.isArray(filter)) {
        var filterArray = filter;
        var paramsArray = params;
        for (var i = 0, ii = filterArray.length; i < ii; ++i) {
          filter = filterArray[i];
          if (!blr.W15yQC.pdfChecker.isName(filter)) {
            //error('Bad filter name: ' + filter);
          }

          params = null;
          if (blr.W15yQC.pdfChecker.isArray(paramsArray) && (i in paramsArray)) {
            params = paramsArray[i];
          }
          stream = this.makeFilter(stream, filter.name, maybeLength, params);
          // after the first stream the length variable is invalid
          maybeLength = null;
        }
      }
      return stream;
    },
    makeFilter: function Parser_makeFilter(stream, name, maybeLength, params) {
      if (stream.dict.get('Length') === 0) {
        return new NullStream(stream);
      }
      if (name == 'FlateDecode' || name == 'Fl') {
        if (params) {
          return new blr.W15yQC.pdfChecker.PredictorStream(new blr.W15yQC.pdfChecker.FlateStream(stream, maybeLength), maybeLength, params);
        }
        return new blr.W15yQC.pdfChecker.FlateStream(stream, maybeLength);
      }
      if (name == 'LZWDecode' || name == 'LZW') {
        var earlyChange = 1;
        if (params) {
          if (params.has('EarlyChange')) {
            earlyChange = params.get('EarlyChange');
          }
          return new blr.W15yQC.pdfChecker.PredictorStream(
            new blr.W15yQC.pdfChecker.LZWStream(stream, maybeLength, earlyChange), maybeLength, params);
        }
        return new blr.W15yQC.pdfChecker.LZWStream(stream, maybeLength, earlyChange);
      }
      if (name == 'DCTDecode' || name == 'DCT') {
        return new blr.W15yQC.pdfChecker.JpegStream(stream, maybeLength, stream.dict, this.xref);
      }
      if (name == 'JPXDecode' || name == 'JPX') {
        return new blr.W15yQC.pdfChecker.JpxStream(stream, maybeLength, stream.dict);
      }
      if (name == 'ASCII85Decode' || name == 'A85') {
        return new blr.W15yQC.pdfChecker.Ascii85Stream(stream, maybeLength);
      }
      if (name == 'ASCIIHexDecode' || name == 'AHx') {
        return new blr.W15yQC.pdfChecker.AsciiHexStream(stream, maybeLength);
      }
      if (name == 'CCITTFaxDecode' || name == 'CCF') {
        return new blr.W15yQC.pdfChecker.CCITTFaxStream(stream, maybeLength, params);
      }
      if (name == 'RunLengthDecode' || name == 'RL') {
        return new blr.W15yQC.pdfChecker.RunLengthStream(stream, maybeLength);
      }
      if (name == 'JBIG2Decode') {
        return new blr.W15yQC.pdfChecker.Jbig2Stream(stream, maybeLength, stream.dict);
      }
      //warn('filter "' + name + '" not supported yet');
      return stream;
    }
  };

  return Parser;
})();

blr.W15yQC.pdfChecker.Lexer = (function LexerClosure() {
  function Lexer(stream, knownCommands) {
    this.stream = stream;
    this.nextChar();

    // While lexing, we build up many strings one char at a time. Using += for
    // this can result in lots of garbage strings. It's better to build an
    // array of single-char strings and then join() them together at the end.
    // And reusing a single array (i.e. |this.strBuf|) over and over for this
    // purpose uses less memory than using a new array for each string.
    this.strBuf = [];

    // The PDFs might have "glued" commands with other commands, operands or
    // literals, e.g. "q1". The knownCommands is a dictionary of the valid
    // commands and their prefixes. The prefixes are built the following way:
    // if there a command that is a prefix of the other valid command or
    // literal (e.g. 'f' and 'false') the following prefixes must be included,
    // 'fa', 'fal', 'fals'. The prefixes are not needed, if the command has no
    // other commands or literals as a prefix. The knowCommands is optional.
    this.knownCommands = knownCommands;
  }

  Lexer.isSpace = function Lexer_isSpace(ch) {
    // Space is one of the following characters: SPACE, TAB, CR or LF.
    return (ch === 0x20 || ch === 0x09 || ch === 0x0D || ch === 0x0A);
  };

  // A '1' in this array means the character is white space. A '1' or
  // '2' means the character ends a name or command.
  var specialChars = [
    1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0, // 0x
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // 1x
    1, 0, 0, 0, 0, 2, 0, 0, 2, 2, 0, 0, 0, 0, 0, 2, // 2x
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 2, 0, // 3x
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // 4x
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 2, 0, 0, // 5x
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // 6x
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 2, 0, 0, // 7x
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // 8x
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // 9x
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // ax
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // bx
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // cx
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // dx
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // ex
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0  // fx
  ];

  function toHexDigit(ch) {
    if (ch >= 0x30 && ch <= 0x39) { // '0'-'9'
      return ch & 0x0F;
    }
    if ((ch >= 0x41 && ch <= 0x46) || (ch >= 0x61 && ch <= 0x66)) {
      // 'A'-'F', 'a'-'f'
      return (ch & 0x0F) + 9;
    }
    return -1;
  }

  Lexer.prototype = {
    nextChar: function Lexer_nextChar() {
      return (this.currentChar = this.stream.getByte());
    },
    peekChar: function Lexer_peekChar() {
      return this.stream.peekBytes(1)[0];
    },
    getNumber: function Lexer_getNumber() {
      var ch = this.currentChar;
      var eNotation = false;
      var divideBy = 0; // different from 0 if it's a floating point value
      var sign = 1;

      if (ch === 0x2D) { // '-'
        sign = -1;
        ch = this.nextChar();
      } else if (ch === 0x2B) { // '+'
        ch = this.nextChar();
      }
      if (ch === 0x2E) { // '.'
        divideBy = 10;
        ch = this.nextChar();
      }
      if (ch < 0x30 || ch > 0x39) { // '0' - '9'
        //error('Invalid number: ' + String.fromCharCode(ch));
        return 0;
      }

      var baseValue = ch - 0x30; // '0'
      var powerValue = 0;
      var powerValueSign = 1;

      while ((ch = this.nextChar()) >= 0) {
        if (0x30 <= ch && ch <= 0x39) { // '0' - '9'
          var currentDigit = ch - 0x30; // '0'
          if (eNotation) { // We are after an 'e' or 'E'
            powerValue = powerValue * 10 + currentDigit;
          } else {
            if (divideBy !== 0) { // We are after a point
              divideBy *= 10;
            }
            baseValue = baseValue * 10 + currentDigit;
          }
        } else if (ch === 0x2E) { // '.'
          if (divideBy === 0) {
            divideBy = 1;
          } else {
            // A number can have only one '.'
            break;
          }
        } else if (ch === 0x2D) { // '-'
          // ignore minus signs in the middle of numbers to match
          // Adobe's behavior
          //warn('Badly formated number');
        } else if (ch === 0x45 || ch === 0x65) { // 'E', 'e'
          // 'E' can be either a scientific notation or the beginning of a new
          // operator
          ch = this.peekChar();
          if (ch === 0x2B || ch === 0x2D) { // '+', '-'
            powerValueSign = (ch === 0x2D) ? -1 : 1;
            this.nextChar(); // Consume the sign character
          } else if (ch < 0x30 || ch > 0x39) { // '0' - '9'
            // The 'E' must be the beginning of a new operator
            break;
          }
          eNotation = true;
        } else {
          // the last character doesn't belong to us
          break;
        }
      }

      if (divideBy !== 0) {
        baseValue /= divideBy;
      }
      if (eNotation) {
        baseValue *= Math.pow(10, powerValueSign * powerValue);
      }
      return sign * baseValue;
    },
    getString: function Lexer_getString() {
      var numParen = 1;
      var done = false;
      var strBuf = this.strBuf;
      strBuf.length = 0;

      var ch = this.nextChar();
      while (true) {
        var charBuffered = false;
        switch (ch | 0) {
          case -1:
            //warn('Unterminated string');
            done = true;
            break;
          case 0x28: // '('
            ++numParen;
            strBuf.push('(');
            break;
          case 0x29: // ')'
            if (--numParen === 0) {
              this.nextChar(); // consume strings ')'
              done = true;
            } else {
              strBuf.push(')');
            }
            break;
          case 0x5C: // '\\'
            ch = this.nextChar();
            switch (ch) {
              case -1:
                //warn('Unterminated string');
                done = true;
                break;
              case 0x6E: // 'n'
                strBuf.push('\n');
                break;
              case 0x72: // 'r'
                strBuf.push('\r');
                break;
              case 0x74: // 't'
                strBuf.push('\t');
                break;
              case 0x62: // 'b'
                strBuf.push('\b');
                break;
              case 0x66: // 'f'
                strBuf.push('\f');
                break;
              case 0x5C: // '\'
              case 0x28: // '('
              case 0x29: // ')'
                strBuf.push(String.fromCharCode(ch));
                break;
              case 0x30: case 0x31: case 0x32: case 0x33: // '0'-'3'
              case 0x34: case 0x35: case 0x36: case 0x37: // '4'-'7'
                var x = ch & 0x0F;
                ch = this.nextChar();
                charBuffered = true;
                if (ch >= 0x30 && ch <= 0x37) { // '0'-'7'
                  x = (x << 3) + (ch & 0x0F);
                  ch = this.nextChar();
                  if (ch >= 0x30 && ch <= 0x37) {  // '0'-'7'
                    charBuffered = false;
                    x = (x << 3) + (ch & 0x0F);
                  }
                }
                strBuf.push(String.fromCharCode(x));
                break;
              case 0x0D: // CR
                if (this.peekChar() === 0x0A) { // LF
                  this.nextChar();
                }
                break;
              case 0x0A: // LF
                break;
              default:
                strBuf.push(String.fromCharCode(ch));
                break;
            }
            break;
          default:
            strBuf.push(String.fromCharCode(ch));
            break;
        }
        if (done) {
          break;
        }
        if (!charBuffered) {
          ch = this.nextChar();
        }
      }
      return strBuf.join('');
    },
    getName: function Lexer_getName() {
      var ch;
      var strBuf = this.strBuf;
      strBuf.length = 0;
      while ((ch = this.nextChar()) >= 0 && !specialChars[ch]) {
        if (ch === 0x23) { // '#'
          ch = this.nextChar();
          var x = toHexDigit(ch);
          if (x != -1) {
            var x2 = toHexDigit(this.nextChar());
            if (x2 == -1) {
              //error('Illegal digit in hex char in name: ' + x2);
            }
            strBuf.push(String.fromCharCode((x << 4) | x2));
          } else {
            strBuf.push('#', String.fromCharCode(ch));
          }
        } else {
          strBuf.push(String.fromCharCode(ch));
        }
      }
      if (strBuf.length > 128) {
        //error('Warning: name token is longer than allowed by the spec: ' +
        //      strBuf.length);
      }
      return blr.W15yQC.pdfChecker.Name.get(strBuf.join(''));
    },
    getHexString: function Lexer_getHexString() {
      var strBuf = this.strBuf;
      strBuf.length = 0;
      var ch = this.currentChar;
      var isFirstHex = true;
      var firstDigit;
      var secondDigit;
      while (true) {
        if (ch < 0) {
          //warn('Unterminated hex string');
          break;
        } else if (ch === 0x3E) { // '>'
          this.nextChar();
          break;
        } else if (specialChars[ch] === 1) {
          ch = this.nextChar();
          continue;
        } else {
          if (isFirstHex) {
            firstDigit = toHexDigit(ch);
            if (firstDigit === -1) {
              //warn('Ignoring invalid character "' + ch + '" in hex string');
              ch = this.nextChar();
              continue;
            }
          } else {
            secondDigit = toHexDigit(ch);
            if (secondDigit === -1) {
              //warn('Ignoring invalid character "' + ch + '" in hex string');
              ch = this.nextChar();
              continue;
            }
            strBuf.push(String.fromCharCode((firstDigit << 4) | secondDigit));
          }
          isFirstHex = !isFirstHex;
          ch = this.nextChar();
        }
      }
      return strBuf.join('');
    },
    getObj: function Lexer_getObj() {
      // skip whitespace and comments
      var comment = false;
      var ch = this.currentChar;
      while (true) {
        if (ch < 0) {
          return blr.W15yQC.pdfChecker.EOF;
        }
        if (comment) {
          if (ch === 0x0A || ch == 0x0D) { // LF, CR
            comment = false;
          }
        } else if (ch === 0x25) { // '%'
          comment = true;
        } else if (specialChars[ch] !== 1) {
          break;
        }
        ch = this.nextChar();
      }

      // start reading token
      switch (ch | 0) {
        case 0x30: case 0x31: case 0x32: case 0x33: case 0x34: // '0'-'4'
        case 0x35: case 0x36: case 0x37: case 0x38: case 0x39: // '5'-'9'
        case 0x2B: case 0x2D: case 0x2E: // '+', '-', '.'
          return this.getNumber();
        case 0x28: // '('
          return this.getString();
        case 0x2F: // '/'
          return this.getName();
        // array punctuation
        case 0x5B: // '['
          this.nextChar();
          return blr.W15yQC.pdfChecker.Cmd.get('[');
        case 0x5D: // ']'
          this.nextChar();
          return blr.W15yQC.pdfChecker.Cmd.get(']');
        // hex string or dict punctuation
        case 0x3C: // '<'
          ch = this.nextChar();
          if (ch === 0x3C) {
            // dict punctuation
            this.nextChar();
            return blr.W15yQC.pdfChecker.Cmd.get('<<');
          }
          return this.getHexString();
        // dict punctuation
        case 0x3E: // '>'
          ch = this.nextChar();
          if (ch === 0x3E) {
            this.nextChar();
            return blr.W15yQC.pdfChecker.Cmd.get('>>');
          }
          return blr.W15yQC.pdfChecker.Cmd.get('>');
        case 0x7B: // '{'
          this.nextChar();
          return blr.W15yQC.pdfChecker.Cmd.get('{');
        case 0x7D: // '}'
          this.nextChar();
          return blr.W15yQC.pdfChecker.Cmd.get('}');
        case 0x29: // ')'
          //error('Illegal character: ' + ch);
          break;
      }

      // command
      var str = String.fromCharCode(ch);
      var knownCommands = this.knownCommands;
      var knownCommandFound = knownCommands && (str in knownCommands);
      while ((ch = this.nextChar()) >= 0 && !specialChars[ch]) {
        // stop if known command is found and next character does not make
        // the str a command
        var possibleCommand = str + String.fromCharCode(ch);
        if (knownCommandFound && !(possibleCommand in knownCommands)) {
          break;
        }
        if (str.length == 128) {
          //error('Command token too long: ' + str.length);
        }
        str = possibleCommand;
        knownCommandFound = knownCommands && (str in knownCommands);
      }
      if (str == 'true') {
        return true;
      }
      if (str == 'false') {
        return false;
      }
      if (str == 'null') {
        return null;
      }
      return blr.W15yQC.pdfChecker.Cmd.get(str);
    },
    skipToNextLine: function Lexer_skipToNextLine() {
      var ch = this.currentChar;
      while (ch >= 0) {
        if (ch === 0x0D) { // CR
          ch = this.nextChar();
          if (ch === 0x0A) { // LF
            this.nextChar();
          }
          break;
        } else if (ch === 0x0A) { // LF
          this.nextChar();
          break;
        }
        ch = this.nextChar();
      }
    }
  };

  return Lexer;
})();

blr.W15yQC.pdfChecker.Stream = (function StreamClosure() {
  function Stream(arrayBuffer, start, length, dict) {
    this.bytes = (arrayBuffer instanceof Uint8Array ?
                  arrayBuffer : new Uint8Array(arrayBuffer));
    this.start = start || 0;
    this.pos = this.start;
    this.end = (start + length) || this.bytes.length;
    this.dict = dict;
  }

  // required methods for a stream. if a particular stream does not
  // implement these, an error should be thrown
  Stream.prototype = {
    get length() {
      return this.end - this.start;
    },
    getByte: function Stream_getByte() {
      if (this.pos >= this.end) {
        return -1;
      }
      return this.bytes[this.pos++];
    },
    getUint16: function Stream_getUint16() {
      var b0 = this.getByte();
      var b1 = this.getByte();
      return (b0 << 8) + b1;
    },
    getInt32: function Stream_getInt32() {
      var b0 = this.getByte();
      var b1 = this.getByte();
      var b2 = this.getByte();
      var b3 = this.getByte();
      return (b0 << 24) + (b1 << 16) + (b2 << 8) + b3;
    },
    getLine: function(limit) {
      var ch, n, strBuf = [];
      if (limit==null||this.pos + limit > this.end) {
        limit = this.end - this.pos;
      }
      for (n = 0; n < limit; ++n) {
        ch=this.getByte();
        if (ch>=0x20) {
          strBuf.push(String.fromCharCode(ch));
        } else {
          if (ch==0x0D && this.peekByte()==0x0A) {
            ch=this.getByte();
          }
          break;
        }
      }
      return strBuf.join('');
    },
    // returns subarray of original buffer
    // should only be read
    getBytes: function Stream_getBytes(length) {
      var bytes = this.bytes;
      var pos = this.pos;
      var strEnd = this.end;

      if (!length) {
        return bytes.subarray(pos, strEnd);
      }
      var end = pos + length;
      if (end > strEnd) {
        end = strEnd;
      }
      this.pos = end;
      return bytes.subarray(pos, end);
    },
    peekByte: function Stream_peekByte() {
      if (this.pos >= this.end) {
        return -1;
      }
      return this.bytes[this.pos];
    },
    peekBytes: function Stream_peekBytes(length) {
      var bytes = this.getBytes(length);
      this.pos -= bytes.length;
      return bytes;
    },
    skip: function Stream_skip(n) {
      if (!n) {
        n = 1;
      }
      this.pos += n;
    },
    skipWhiteSpace: function(limit) {
      if (limit==null || (this.pos + limit > this.end)) {
        limit = this.end - this.pos;
      }
      while(this.peekByte()<=0x20 && limit>0) {
        this.skip(1);
        limit--;
      }
    },
    skipToNextLine: function(limit) {
      var ch;
      if (limit==null || (this.pos + limit > this.end)) {
        limit = this.end - this.pos;
      }

      ch=this.peekByte();
      while(ch!=0x0D && ch!=0x0A && limit>0) {
        this.skip(1);
        limit--;
        ch=this.peekByte();
      }
      if (ch==0x0D) {
        this.skip(1);
        if (this.peekByte()==0x0A) {
          this.skip(1);
        }
      } else if (ch==0x0A) {
        this.skip(1);
        if (this.peekByte()==0x0D) {
          this.skip(1);
        }
      }
    },
    reset: function Stream_reset() {
      this.pos = this.start;
    },
    moveStart: function Stream_moveStart() {
      this.start = this.pos;
    },
    makeSubStream: function Stream_makeSubStream(start, length, dict) {
      return new blr.W15yQC.pdfChecker.Stream(this.bytes.buffer, start, length, dict);
    },
    find: function(needle, limit, backwards) {
      var n, str, origPos=this.pos, strBuf = [], index;
      if (limit==null || (this.pos + limit > this.end)) {
        limit = this.end - this.pos;
      }
      for (n = 0; n < limit; ++n) {
        strBuf.push(String.fromCharCode(this.getByte()));
      }
      str = strBuf.join('');
      this.pos = origPos;
      index = backwards ? str.lastIndexOf(needle) : str.indexOf(needle);
      if (index == -1) {
        return false; /* not found */
      }
      this.pos += index;
      return true; /* found */
    },
    isStream: true
  };

  return Stream;
})();


blr.W15yQC.pdfChecker.StringStream = (function StringStreamClosure() {
  function StringStream(str) {
    var length = str.length;
    var bytes = new Uint8Array(length);
    for (var n = 0; n < length; ++n) {
      bytes[n] = str.charCodeAt(n);
    }
    blr.W15yQC.pdfChecker.Stream.call(this, bytes);
  }

  StringStream.prototype = blr.W15yQC.pdfChecker.Stream.prototype;

  return StringStream;
})();


blr.W15yQC.pdfChecker.StreamsSequenceStream = (function StreamsSequenceStreamClosure() {
  function StreamsSequenceStream(streams) {
    this.streams = streams;
    blr.W15yQC.pdfChecker.DecodeStream.call(this, /* maybeLength = */ null);
  }

  StreamsSequenceStream.prototype = Object.create(blr.W15yQC.pdfChecker.DecodeStream.prototype);

  StreamsSequenceStream.prototype.readBlock =
      function streamSequenceStreamReadBlock() {

    var streams = this.streams;
    if (streams.length === 0) {
      this.eof = true;
      return;
    }
    var stream = streams.shift();
    var chunk = stream.getBytes();
    var bufferLength = this.bufferLength;
    var newLength = bufferLength + chunk.length;
    var buffer = this.ensureBuffer(newLength);
    buffer.set(chunk, bufferLength);
    this.bufferLength = newLength;
  };

  StreamsSequenceStream.prototype.getBaseStreams =
    function StreamsSequenceStream_getBaseStreams() {

    var baseStreams = [];
    for (var i = 0, ii = this.streams.length; i < ii; i++) {
      var stream = this.streams[i];
      if (stream.getBaseStreams) {
        Util.concatenateToArray(baseStreams, stream.getBaseStreams());
      }
    }
    return baseStreams;
  };

  return StreamsSequenceStream;
})();



blr.W15yQC.pdfChecker.FlateStream = (function FlateStreamClosure() {
  var codeLenCodeMap = new Uint32Array([
    16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15
  ]);

  var lengthDecode = new Uint32Array([
    0x00003, 0x00004, 0x00005, 0x00006, 0x00007, 0x00008, 0x00009, 0x0000a,
    0x1000b, 0x1000d, 0x1000f, 0x10011, 0x20013, 0x20017, 0x2001b, 0x2001f,
    0x30023, 0x3002b, 0x30033, 0x3003b, 0x40043, 0x40053, 0x40063, 0x40073,
    0x50083, 0x500a3, 0x500c3, 0x500e3, 0x00102, 0x00102, 0x00102
  ]);

  var distDecode = new Uint32Array([
    0x00001, 0x00002, 0x00003, 0x00004, 0x10005, 0x10007, 0x20009, 0x2000d,
    0x30011, 0x30019, 0x40021, 0x40031, 0x50041, 0x50061, 0x60081, 0x600c1,
    0x70101, 0x70181, 0x80201, 0x80301, 0x90401, 0x90601, 0xa0801, 0xa0c01,
    0xb1001, 0xb1801, 0xc2001, 0xc3001, 0xd4001, 0xd6001
  ]);

  var fixedLitCodeTab = [new Uint32Array([
    0x70100, 0x80050, 0x80010, 0x80118, 0x70110, 0x80070, 0x80030, 0x900c0,
    0x70108, 0x80060, 0x80020, 0x900a0, 0x80000, 0x80080, 0x80040, 0x900e0,
    0x70104, 0x80058, 0x80018, 0x90090, 0x70114, 0x80078, 0x80038, 0x900d0,
    0x7010c, 0x80068, 0x80028, 0x900b0, 0x80008, 0x80088, 0x80048, 0x900f0,
    0x70102, 0x80054, 0x80014, 0x8011c, 0x70112, 0x80074, 0x80034, 0x900c8,
    0x7010a, 0x80064, 0x80024, 0x900a8, 0x80004, 0x80084, 0x80044, 0x900e8,
    0x70106, 0x8005c, 0x8001c, 0x90098, 0x70116, 0x8007c, 0x8003c, 0x900d8,
    0x7010e, 0x8006c, 0x8002c, 0x900b8, 0x8000c, 0x8008c, 0x8004c, 0x900f8,
    0x70101, 0x80052, 0x80012, 0x8011a, 0x70111, 0x80072, 0x80032, 0x900c4,
    0x70109, 0x80062, 0x80022, 0x900a4, 0x80002, 0x80082, 0x80042, 0x900e4,
    0x70105, 0x8005a, 0x8001a, 0x90094, 0x70115, 0x8007a, 0x8003a, 0x900d4,
    0x7010d, 0x8006a, 0x8002a, 0x900b4, 0x8000a, 0x8008a, 0x8004a, 0x900f4,
    0x70103, 0x80056, 0x80016, 0x8011e, 0x70113, 0x80076, 0x80036, 0x900cc,
    0x7010b, 0x80066, 0x80026, 0x900ac, 0x80006, 0x80086, 0x80046, 0x900ec,
    0x70107, 0x8005e, 0x8001e, 0x9009c, 0x70117, 0x8007e, 0x8003e, 0x900dc,
    0x7010f, 0x8006e, 0x8002e, 0x900bc, 0x8000e, 0x8008e, 0x8004e, 0x900fc,
    0x70100, 0x80051, 0x80011, 0x80119, 0x70110, 0x80071, 0x80031, 0x900c2,
    0x70108, 0x80061, 0x80021, 0x900a2, 0x80001, 0x80081, 0x80041, 0x900e2,
    0x70104, 0x80059, 0x80019, 0x90092, 0x70114, 0x80079, 0x80039, 0x900d2,
    0x7010c, 0x80069, 0x80029, 0x900b2, 0x80009, 0x80089, 0x80049, 0x900f2,
    0x70102, 0x80055, 0x80015, 0x8011d, 0x70112, 0x80075, 0x80035, 0x900ca,
    0x7010a, 0x80065, 0x80025, 0x900aa, 0x80005, 0x80085, 0x80045, 0x900ea,
    0x70106, 0x8005d, 0x8001d, 0x9009a, 0x70116, 0x8007d, 0x8003d, 0x900da,
    0x7010e, 0x8006d, 0x8002d, 0x900ba, 0x8000d, 0x8008d, 0x8004d, 0x900fa,
    0x70101, 0x80053, 0x80013, 0x8011b, 0x70111, 0x80073, 0x80033, 0x900c6,
    0x70109, 0x80063, 0x80023, 0x900a6, 0x80003, 0x80083, 0x80043, 0x900e6,
    0x70105, 0x8005b, 0x8001b, 0x90096, 0x70115, 0x8007b, 0x8003b, 0x900d6,
    0x7010d, 0x8006b, 0x8002b, 0x900b6, 0x8000b, 0x8008b, 0x8004b, 0x900f6,
    0x70103, 0x80057, 0x80017, 0x8011f, 0x70113, 0x80077, 0x80037, 0x900ce,
    0x7010b, 0x80067, 0x80027, 0x900ae, 0x80007, 0x80087, 0x80047, 0x900ee,
    0x70107, 0x8005f, 0x8001f, 0x9009e, 0x70117, 0x8007f, 0x8003f, 0x900de,
    0x7010f, 0x8006f, 0x8002f, 0x900be, 0x8000f, 0x8008f, 0x8004f, 0x900fe,
    0x70100, 0x80050, 0x80010, 0x80118, 0x70110, 0x80070, 0x80030, 0x900c1,
    0x70108, 0x80060, 0x80020, 0x900a1, 0x80000, 0x80080, 0x80040, 0x900e1,
    0x70104, 0x80058, 0x80018, 0x90091, 0x70114, 0x80078, 0x80038, 0x900d1,
    0x7010c, 0x80068, 0x80028, 0x900b1, 0x80008, 0x80088, 0x80048, 0x900f1,
    0x70102, 0x80054, 0x80014, 0x8011c, 0x70112, 0x80074, 0x80034, 0x900c9,
    0x7010a, 0x80064, 0x80024, 0x900a9, 0x80004, 0x80084, 0x80044, 0x900e9,
    0x70106, 0x8005c, 0x8001c, 0x90099, 0x70116, 0x8007c, 0x8003c, 0x900d9,
    0x7010e, 0x8006c, 0x8002c, 0x900b9, 0x8000c, 0x8008c, 0x8004c, 0x900f9,
    0x70101, 0x80052, 0x80012, 0x8011a, 0x70111, 0x80072, 0x80032, 0x900c5,
    0x70109, 0x80062, 0x80022, 0x900a5, 0x80002, 0x80082, 0x80042, 0x900e5,
    0x70105, 0x8005a, 0x8001a, 0x90095, 0x70115, 0x8007a, 0x8003a, 0x900d5,
    0x7010d, 0x8006a, 0x8002a, 0x900b5, 0x8000a, 0x8008a, 0x8004a, 0x900f5,
    0x70103, 0x80056, 0x80016, 0x8011e, 0x70113, 0x80076, 0x80036, 0x900cd,
    0x7010b, 0x80066, 0x80026, 0x900ad, 0x80006, 0x80086, 0x80046, 0x900ed,
    0x70107, 0x8005e, 0x8001e, 0x9009d, 0x70117, 0x8007e, 0x8003e, 0x900dd,
    0x7010f, 0x8006e, 0x8002e, 0x900bd, 0x8000e, 0x8008e, 0x8004e, 0x900fd,
    0x70100, 0x80051, 0x80011, 0x80119, 0x70110, 0x80071, 0x80031, 0x900c3,
    0x70108, 0x80061, 0x80021, 0x900a3, 0x80001, 0x80081, 0x80041, 0x900e3,
    0x70104, 0x80059, 0x80019, 0x90093, 0x70114, 0x80079, 0x80039, 0x900d3,
    0x7010c, 0x80069, 0x80029, 0x900b3, 0x80009, 0x80089, 0x80049, 0x900f3,
    0x70102, 0x80055, 0x80015, 0x8011d, 0x70112, 0x80075, 0x80035, 0x900cb,
    0x7010a, 0x80065, 0x80025, 0x900ab, 0x80005, 0x80085, 0x80045, 0x900eb,
    0x70106, 0x8005d, 0x8001d, 0x9009b, 0x70116, 0x8007d, 0x8003d, 0x900db,
    0x7010e, 0x8006d, 0x8002d, 0x900bb, 0x8000d, 0x8008d, 0x8004d, 0x900fb,
    0x70101, 0x80053, 0x80013, 0x8011b, 0x70111, 0x80073, 0x80033, 0x900c7,
    0x70109, 0x80063, 0x80023, 0x900a7, 0x80003, 0x80083, 0x80043, 0x900e7,
    0x70105, 0x8005b, 0x8001b, 0x90097, 0x70115, 0x8007b, 0x8003b, 0x900d7,
    0x7010d, 0x8006b, 0x8002b, 0x900b7, 0x8000b, 0x8008b, 0x8004b, 0x900f7,
    0x70103, 0x80057, 0x80017, 0x8011f, 0x70113, 0x80077, 0x80037, 0x900cf,
    0x7010b, 0x80067, 0x80027, 0x900af, 0x80007, 0x80087, 0x80047, 0x900ef,
    0x70107, 0x8005f, 0x8001f, 0x9009f, 0x70117, 0x8007f, 0x8003f, 0x900df,
    0x7010f, 0x8006f, 0x8002f, 0x900bf, 0x8000f, 0x8008f, 0x8004f, 0x900ff
  ]), 9];

  var fixedDistCodeTab = [new Uint32Array([
    0x50000, 0x50010, 0x50008, 0x50018, 0x50004, 0x50014, 0x5000c, 0x5001c,
    0x50002, 0x50012, 0x5000a, 0x5001a, 0x50006, 0x50016, 0x5000e, 0x00000,
    0x50001, 0x50011, 0x50009, 0x50019, 0x50005, 0x50015, 0x5000d, 0x5001d,
    0x50003, 0x50013, 0x5000b, 0x5001b, 0x50007, 0x50017, 0x5000f, 0x00000
  ]), 5];

  function FlateStream(str, maybeLength) {
    this.str = str;
    this.dict = str.dict;

    var cmf = str.getByte();
    var flg = str.getByte();
    if (cmf == -1 || flg == -1) {
     blr.W15yQC.pdfChecker.error('Invalid header in flate stream: ' + cmf + ', ' + flg);
    }
    if ((cmf & 0x0f) != 0x08) {
      blr.W15yQC.pdfChecker.error('Unknown compression method in flate stream: ' + cmf + ', ' + flg);
    }
    if ((((cmf << 8) + flg) % 31) !== 0) {
      blr.W15yQC.pdfChecker.error('Bad FCHECK in flate stream: ' + cmf + ', ' + flg);
    }
    if (flg & 0x20) {
     blr.W15yQC.pdfChecker.error('FDICT bit set in flate stream: ' + cmf + ', ' + flg);
    }

    this.codeSize = 0;
    this.codeBuf = 0;

    blr.W15yQC.pdfChecker.DecodeStream.call(this, maybeLength);
  }

  FlateStream.prototype = Object.create(blr.W15yQC.pdfChecker.DecodeStream.prototype);

  FlateStream.prototype.getBits = function FlateStream_getBits(bits) {
    var str = this.str;
    var codeSize = this.codeSize;
    var codeBuf = this.codeBuf;

    var b;
    while (codeSize < bits) {
      if ((b = str.getByte()) === -1) {
       blr.W15yQC.pdfChecker.error('Bad encoding in flate stream');
      }
      codeBuf |= b << codeSize;
      codeSize += 8;
    }
    b = codeBuf & ((1 << bits) - 1);
    this.codeBuf = codeBuf >> bits;
    this.codeSize = codeSize -= bits;

    return b;
  };

  FlateStream.prototype.getCode = function FlateStream_getCode(table) {
    var str = this.str;
    var codes = table[0];
    var maxLen = table[1];
    var codeSize = this.codeSize;
    var codeBuf = this.codeBuf;

    while (codeSize < maxLen) {
      var b;
      if ((b = str.getByte()) === -1) {
       blr.W15yQC.pdfChecker.error('Bad encoding in flate stream');
      }
      codeBuf |= (b << codeSize);
      codeSize += 8;
    }
    var code = codes[codeBuf & ((1 << maxLen) - 1)];
    var codeLen = code >> 16;
    var codeVal = code & 0xffff;
    if (codeSize === 0 || codeSize < codeLen || codeLen === 0) {
     blr.W15yQC.pdfChecker.error('Bad encoding in flate stream');
    }
    this.codeBuf = (codeBuf >> codeLen);
    this.codeSize = (codeSize - codeLen);
    return codeVal;
  };

  FlateStream.prototype.generateHuffmanTable =
    function flateStreamGenerateHuffmanTable(lengths) {
    var n = lengths.length;

    // find max code length
    var maxLen = 0;
    var i;
    for (i = 0; i < n; ++i) {
      if (lengths[i] > maxLen) {
        maxLen = lengths[i];
      }
    }

    // build the table
    var size = 1 << maxLen;
    var codes = new Uint32Array(size);
    for (var len = 1, code = 0, skip = 2;
         len <= maxLen;
         ++len, code <<= 1, skip <<= 1) {
      for (var val = 0; val < n; ++val) {
        if (lengths[val] == len) {
          // bit-reverse the code
          var code2 = 0;
          var t = code;
          for (i = 0; i < len; ++i) {
            code2 = (code2 << 1) | (t & 1);
            t >>= 1;
          }

          // fill the table entries
          for (i = code2; i < size; i += skip) {
            codes[i] = (len << 16) | val;
          }
          ++code;
        }
      }
    }

    return [codes, maxLen];
  };

  FlateStream.prototype.readBlock = function FlateStream_readBlock() {
    var buffer, len;
    var str = this.str;
    // read block header
    var hdr = this.getBits(3);
    if (hdr & 1) {
      this.eof = true;
    }
    hdr >>= 1;

    if (hdr === 0) { // uncompressed block
      var b;

      if ((b = str.getByte()) === -1) {
       blr.W15yQC.pdfChecker.error('Bad block header in flate stream');
      }
      var blockLen = b;
      if ((b = str.getByte()) === -1) {
       blr.W15yQC.pdfChecker.error('Bad block header in flate stream');
      }
      blockLen |= (b << 8);
      if ((b = str.getByte()) === -1) {
       blr.W15yQC.pdfChecker.error('Bad block header in flate stream');
      }
      var check = b;
      if ((b = str.getByte()) === -1) {
       blr.W15yQC.pdfChecker.error('Bad block header in flate stream');
      }
      check |= (b << 8);
      if (check != (~blockLen & 0xffff) &&
          (blockLen !== 0 || check !== 0)) {
        // Ignoring error for bad "empty" block (see issue 1277)
       blr.W15yQC.pdfChecker.error('Bad uncompressed block length in flate stream');
      }

      this.codeBuf = 0;
      this.codeSize = 0;

      var bufferLength = this.bufferLength;
      buffer = this.ensureBuffer(bufferLength + blockLen);
      var end = bufferLength + blockLen;
      this.bufferLength = end;
      if (blockLen === 0) {
        if (str.peekBytes(1).length === 0) {
          this.eof = true;
        }
      } else {
        for (var n = bufferLength; n < end; ++n) {
          if ((b = str.getByte()) === -1) {
            this.eof = true;
            break;
          }
          buffer[n] = b;
        }
      }
      return;
    }

    var litCodeTable;
    var distCodeTable;
    if (hdr == 1) { // compressed block, fixed codes
      litCodeTable = fixedLitCodeTab;
      distCodeTable = fixedDistCodeTab;
    } else if (hdr == 2) { // compressed block, dynamic codes
      var numLitCodes = this.getBits(5) + 257;
      var numDistCodes = this.getBits(5) + 1;
      var numCodeLenCodes = this.getBits(4) + 4;

      // build the code lengths code table
      var codeLenCodeLengths = new Uint8Array(codeLenCodeMap.length);

      var i;
      for (i = 0; i < numCodeLenCodes; ++i) {
        codeLenCodeLengths[codeLenCodeMap[i]] = this.getBits(3);
      }
      var codeLenCodeTab = this.generateHuffmanTable(codeLenCodeLengths);

      // build the literal and distance code tables
      len = 0;
      i = 0;
      var codes = numLitCodes + numDistCodes;
      var codeLengths = new Uint8Array(codes);
      var bitsLength, bitsOffset, what;
      while (i < codes) {
        var code = this.getCode(codeLenCodeTab);
        if (code == 16) {
          bitsLength = 2; bitsOffset = 3; what = len;
        } else if (code == 17) {
          bitsLength = 3; bitsOffset = 3; what = (len = 0);
        } else if (code == 18) {
          bitsLength = 7; bitsOffset = 11; what = (len = 0);
        } else {
          codeLengths[i++] = len = code;
          continue;
        }

        var repeatLength = this.getBits(bitsLength) + bitsOffset;
        while (repeatLength-- > 0) {
          codeLengths[i++] = what;
        }
      }

      litCodeTable =
        this.generateHuffmanTable(codeLengths.subarray(0, numLitCodes));
      distCodeTable =
        this.generateHuffmanTable(codeLengths.subarray(numLitCodes, codes));
    } else {
     blr.W15yQC.pdfChecker.error('Unknown block type in flate stream');
    }

    buffer = this.buffer;
    var limit = buffer ? buffer.length : 0;
    var pos = this.bufferLength;
    while (true) {
      var code1 = this.getCode(litCodeTable);
      if (code1 < 256) {
        if (pos + 1 >= limit) {
          buffer = this.ensureBuffer(pos + 1);
          limit = buffer.length;
        }
        buffer[pos++] = code1;
        continue;
      }
      if (code1 == 256) {
        this.bufferLength = pos;
        return;
      }
      code1 -= 257;
      code1 = lengthDecode[code1];
      var code2 = code1 >> 16;
      if (code2 > 0) {
        code2 = this.getBits(code2);
      }
      len = (code1 & 0xffff) + code2;
      code1 = this.getCode(distCodeTable);
      code1 = distDecode[code1];
      code2 = code1 >> 16;
      if (code2 > 0) {
        code2 = this.getBits(code2);
      }
      var dist = (code1 & 0xffff) + code2;
      if (pos + len >= limit) {
        buffer = this.ensureBuffer(pos + len);
        limit = buffer.length;
      }
      for (var k = 0; k < len; ++k, ++pos) {
        buffer[pos] = buffer[pos - dist];
      }
    }
  };

  return FlateStream;
})();

blr.W15yQC.pdfChecker.PredictorStream = (function PredictorStreamClosure() {
  function PredictorStream(str, maybeLength, params) {
    var predictor = this.predictor = params.get('Predictor') || 1;

    if (predictor <= 1) {
      return str; // no prediction
    }
    if (predictor !== 2 && (predictor < 10 || predictor > 15)) {
     blr.W15yQC.pdfChecker.error('Unsupported predictor: ' + predictor);
    }

    if (predictor === 2) {
      this.readBlock = this.readBlockTiff;
    } else {
      this.readBlock = this.readBlockPng;
    }

    this.str = str;
    this.dict = str.dict;

    var colors = this.colors = params.get('Colors') || 1;
    var bits = this.bits = params.get('BitsPerComponent') || 8;
    var columns = this.columns = params.get('Columns') || 1;

    this.pixBytes = (colors * bits + 7) >> 3;
    this.rowBytes = (columns * colors * bits + 7) >> 3;

    blr.W15yQC.pdfChecker.DecodeStream.call(this, maybeLength);
    return this;
  }

  PredictorStream.prototype = Object.create(blr.W15yQC.pdfChecker.DecodeStream.prototype);

  PredictorStream.prototype.readBlockTiff =
      function predictorStreamReadBlockTiff() {
    var rowBytes = this.rowBytes;

    var bufferLength = this.bufferLength;
    var buffer = this.ensureBuffer(bufferLength + rowBytes);

    var bits = this.bits;
    var colors = this.colors;

    var rawBytes = this.str.getBytes(rowBytes);
    this.eof = !rawBytes.length;
    if (this.eof) {
      return;
    }

    var inbuf = 0, outbuf = 0;
    var inbits = 0, outbits = 0;
    var pos = bufferLength;
    var i;

    if (bits === 1) {
      for (i = 0; i < rowBytes; ++i) {
        var c = rawBytes[i];
        inbuf = (inbuf << 8) | c;
        // bitwise addition is exclusive or
        // first shift inbuf and then add
        buffer[pos++] = (c ^ (inbuf >> colors)) & 0xFF;
        // truncate inbuf (assumes colors < 16)
        inbuf &= 0xFFFF;
      }
    } else if (bits === 8) {
      for (i = 0; i < colors; ++i) {
        buffer[pos++] = rawBytes[i];
      }
      for (; i < rowBytes; ++i) {
        buffer[pos] = buffer[pos - colors] + rawBytes[i];
        pos++;
      }
    } else {
      var compArray = new Uint8Array(colors + 1);
      var bitMask = (1 << bits) - 1;
      var j = 0, k = bufferLength;
      var columns = this.columns;
      for (i = 0; i < columns; ++i) {
        for (var kk = 0; kk < colors; ++kk) {
          if (inbits < bits) {
            inbuf = (inbuf << 8) | (rawBytes[j++] & 0xFF);
            inbits += 8;
          }
          compArray[kk] = (compArray[kk] +
                           (inbuf >> (inbits - bits))) & bitMask;
          inbits -= bits;
          outbuf = (outbuf << bits) | compArray[kk];
          outbits += bits;
          if (outbits >= 8) {
            buffer[k++] = (outbuf >> (outbits - 8)) & 0xFF;
            outbits -= 8;
          }
        }
      }
      if (outbits > 0) {
        buffer[k++] = (outbuf << (8 - outbits)) +
                      (inbuf & ((1 << (8 - outbits)) - 1));
      }
    }
    this.bufferLength += rowBytes;
  };

  PredictorStream.prototype.readBlockPng =
      function predictorStreamReadBlockPng() {

    var rowBytes = this.rowBytes;
    var pixBytes = this.pixBytes;

    var predictor = this.str.getByte();
    var rawBytes = this.str.getBytes(rowBytes);
    this.eof = !rawBytes.length;
    if (this.eof) {
      return;
    }

    var bufferLength = this.bufferLength;
    var buffer = this.ensureBuffer(bufferLength + rowBytes);

    var prevRow = buffer.subarray(bufferLength - rowBytes, bufferLength);
    if (prevRow.length === 0) {
      prevRow = new Uint8Array(rowBytes);
    }

    var i, j = bufferLength, up, c;
    switch (predictor) {
      case 0:
        for (i = 0; i < rowBytes; ++i) {
          buffer[j++] = rawBytes[i];
        }
        break;
      case 1:
        for (i = 0; i < pixBytes; ++i) {
          buffer[j++] = rawBytes[i];
        }
        for (; i < rowBytes; ++i) {
          buffer[j] = (buffer[j - pixBytes] + rawBytes[i]) & 0xFF;
          j++;
        }
        break;
      case 2:
        for (i = 0; i < rowBytes; ++i) {
          buffer[j++] = (prevRow[i] + rawBytes[i]) & 0xFF;
        }
        break;
      case 3:
        for (i = 0; i < pixBytes; ++i) {
          buffer[j++] = (prevRow[i] >> 1) + rawBytes[i];
        }
        for (; i < rowBytes; ++i) {
          buffer[j] = (((prevRow[i] + buffer[j - pixBytes]) >> 1) +
                           rawBytes[i]) & 0xFF;
          j++;
        }
        break;
      case 4:
        // we need to save the up left pixels values. the simplest way
        // is to create a new buffer
        for (i = 0; i < pixBytes; ++i) {
          up = prevRow[i];
          c = rawBytes[i];
          buffer[j++] = up + c;
        }
        for (; i < rowBytes; ++i) {
          up = prevRow[i];
          var upLeft = prevRow[i - pixBytes];
          var left = buffer[j - pixBytes];
          var p = left + up - upLeft;

          var pa = p - left;
          if (pa < 0) {
            pa = -pa;
          }
          var pb = p - up;
          if (pb < 0) {
            pb = -pb;
          }
          var pc = p - upLeft;
          if (pc < 0) {
            pc = -pc;
          }

          c = rawBytes[i];
          if (pa <= pb && pa <= pc) {
            buffer[j++] = left + c;
          } else if (pb <= pc) {
            buffer[j++] = up + c;
          } else {
            buffer[j++] = upLeft + c;
          }
        }
        break;
      default:
       blr.W15yQC.pdfChecker.error('Unsupported predictor: ' + predictor);
    }
    this.bufferLength += rowBytes;
  };

  return PredictorStream;
})();

blr.W15yQC.pdfChecker.DecryptStream = (function DecryptStreamClosure() {
  function DecryptStream(str, maybeLength, decrypt) {
    this.str = str;
    this.dict = str.dict;
    this.decrypt = decrypt;
    this.nextChunk = null;
    this.initialized = false;

    blr.W15yQC.pdfChecker.DecodeStream.call(this, maybeLength);
  }

  var chunkSize = 512;

  DecryptStream.prototype = Object.create(blr.W15yQC.pdfChecker.DecodeStream.prototype);

  DecryptStream.prototype.readBlock = function DecryptStream_readBlock() {
    var chunk;
    if (this.initialized) {
      chunk = this.nextChunk;
    } else {
      chunk = this.str.getBytes(chunkSize);
      this.initialized = true;
    }
    if (!chunk || chunk.length === 0) {
      this.eof = true;
      return;
    }
    this.nextChunk = this.str.getBytes(chunkSize);
    var hasMoreData = this.nextChunk && this.nextChunk.length > 0;

    var decrypt = this.decrypt;
    chunk = decrypt(chunk, !hasMoreData);

    var bufferLength = this.bufferLength;
    var i, n = chunk.length;
    var buffer = this.ensureBuffer(bufferLength + n);
    for (i = 0; i < n; i++) {
      buffer[bufferLength++] = chunk[i];
    }
    this.bufferLength = bufferLength;
  };

  return DecryptStream;
})();

//
//blr.W15yQC.pdfChecker.Stream=function(arrayBuffer, start, length, dict) {
//    this.bytes = (arrayBuffer instanceof Uint8Array ?
//                  arrayBuffer : new Uint8Array(arrayBuffer));
//    this.start = start || 0;
//    this.pos = this.start;
//    this.end = (start + length) || this.bytes.length;
//    this.dict = dict;
//  };
//
//  blr.W15yQC.pdfChecker.Stream.prototype= {
//    get length() {
//      return this.end - this.start;
//    },
//    getByte: function Stream_getByte() {
//      if (this.pos >= this.end) {
//        return -1;
//      }
//      return this.bytes[this.pos++];
//    },
//    getUint16: function Stream_getUint16() {
//      var b0 = this.getByte();
//      var b1 = this.getByte();
//      return (b0 << 8) + b1;
//    },
//    getInt32: function Stream_getInt32() {
//      var b0 = this.getByte();
//      var b1 = this.getByte();
//      var b2 = this.getByte();
//      var b3 = this.getByte();
//      return (b0 << 24) + (b1 << 16) + (b2 << 8) + b3;
//    },
//    getLine: function(limit) {
//      var ch, n, strBuf = [];
//      if (limit==null||this.pos + limit > this.end) {
//        limit = this.end - this.pos;
//      }
//      for (n = 0; n < limit; ++n) {
//        ch=this.getByte();
//        if (ch>=0x20) {
//          strBuf.push(String.fromCharCode(ch));
//        } else {
//          if (ch==0x0D && this.peekByte()==0x0A) {
//            ch=this.getByte();
//          }
//          break;
//        }
//      }
//      return strBuf.join('');
//    },
//    // returns subarray of original buffer
//    // should only be read
//    getBytes: function Stream_getBytes(length) {
//      var bytes = this.bytes;
//      var pos = this.pos;
//      var strEnd = this.end;
//
//      if (!length) {
//        return bytes.subarray(pos, strEnd);
//      }
//      var end = pos + length;
//      if (end > strEnd) {
//        end = strEnd;
//      }
//      this.pos = end;
//      return bytes.subarray(pos, end);
//    },
//    peekByte: function Stream_peekByte() {
//      if (this.pos >= this.end) {
//        return -1;
//      }
//      return this.bytes[this.pos];
//    },
//    peekBytes: function Stream_peekBytes(length) {
//      var bytes = this.getBytes(length);
//      this.pos -= bytes.length;
//      return bytes;
//    },
//    skip: function Stream_skip(n) {
//      if (!n) {
//        n = 1;
//      }
//      this.pos += n;
//    },
//    skipWhiteSpace: function(limit) {
//      if (limit==null || (this.pos + limit > this.end)) {
//        limit = this.end - this.pos;
//      }
//      while(this.peekByte()<=0x20 && limit>0) {
//        this.skip(1);
//        limit--;
//      }
//    },
//    skipToNextLine: function(limit) {
//      var ch;
//      if (limit==null || (this.pos + limit > this.end)) {
//        limit = this.end - this.pos;
//      }
//
//      ch=this.peekByte();
//      while(ch!=0x0D && ch!=0x0A && limit>0) {
//        this.skip(1);
//        limit--;
//        ch=this.peekByte();
//      }
//      if (ch==0x0D) {
//        this.skip(1);
//        if (this.peekByte()==0x0A) {
//          this.skip(1);
//        }
//      } else if (ch==0x0A) {
//        this.skip(1);
//        if (this.peekByte()==0x0D) {
//          this.skip(1);
//        }
//      }
//    },
//    reset: function Stream_reset() {
//      this.pos = this.start;
//    },
//    moveStart: function Stream_moveStart() {
//      this.start = this.pos;
//    },
//    makeSubStream: function Stream_makeSubStream(start, length, dict) {
//      return new blr.W15yQC.pdfChecker.Stream(this.bytes.buffer, start, length, dict);
//    },
//    find: function(needle, limit, backwards) {
//      var n, str, origPos=this.pos, strBuf = [], index;
//      if (limit==null || (this.pos + limit > this.end)) {
//        limit = this.end - this.pos;
//      }
//      for (n = 0; n < limit; ++n) {
//        strBuf.push(String.fromCharCode(this.getByte()));
//      }
//      str = strBuf.join('');
//      this.pos = origPos;
//      index = backwards ? str.lastIndexOf(needle) : str.indexOf(needle);
//      if (index == -1) {
//        return false; /* not found */
//      }
//      this.pos += index;
//      return true; /* found */
//    },
//    isStream: true
//  };
