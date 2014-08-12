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
  prompts: null,

  /*
   * checkIfTaggedPDF
   *  1. Perform HTTP HEAD request to get PDF length
   *  2.
   *
   *
   */

   log: function(s) {
    var d=document.getElementById('note-text');
    d.value=blr.W15yQC.fnJoin(d.value,s,"\n");
   },

  check: function() {
    var sURL=document.getElementById('tbURL').value;

    blr.W15yQC.pdfChecker.log('**** START ****');
    blr.W15yQC.pdfChecker.log('Called to check URL:'+sURL);
    blr.W15yQC.pdfChecker.checkIfTaggedPDF(sURL);
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
        blr.W15yQC.pdfChecker.log("peekbytes: "+String.fromCharCode.apply(null, stream.peekBytes(19)));
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
    var l, m, first, count, objNum, trailerOffset, prevXref, rootOffset;
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
            blr.W15yQC.pdfChecker.log("In for: "+objNum+' '+l);
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
      alert('UNHANDLED CROSS-REERENCE STREAM');
    }

    blr.W15yQC.pdfChecker.log("after xRef: "+l);
    // Read trailer dictionary
    if (!/^trailer\s*$/.test(l)) {
      stream.find('trailer');
      stream.find('<');
    }

    var lex=new blr.W15yQC.pdfChecker.Lexer(stream);
    var p=new blr.W15yQC.pdfChecker.Parser(lex, false);
    var o=p.getObj();
    blr.W15yQC.pdfChecker.log("-- o:"+blr.W15yQC.objectToString(o, true)+"\nOBJECT TO STRING OVER");

    if (rootObject==null && o!=null && o.map && o.map.Root) {
      rootObject=o.map.Root.num;
      blr.W15yQC.pdfChecker.log("Root obj:"+rootObject);
    }

    if (rootObject!=null && (rootObject in xRefs)) {

      rootOffset=parseInt(xRefs[rootObject].o,10);
      return rootOffset;
    }

    if (o!=null && o.map && o.map.Prev) {
      prevXref=parseInt(o.map.Prev,10);
      stream.pos=prevXref;
      blr.W15yQC.pdfChecker.log("Prev xRef:"+prevXref);

      rootOffset=blr.W15yQC.pdfChecker.parseXrefsAndGetRootOffset(stream,xRefs,rootObject);
      return rootOffset;
    }

    blr.W15yQC.pdfChecker.log("Failed to find Root");
    return null;
  },



  parseDictionary: function(dictName, stream) {
    var dict={};

    stream.skipWhiteSpace();
    if (stream.find('<<',5)) {
      stream.skip(2);

    } else {
      alert("DICTIONARY NOT FOUND");
    }

  },

   getPDF: function(sURL) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', sURL, true);
    xhr.responseType = 'arraybuffer';

    xhr.onload = function(e) {
      var pdfVer, startxref, pdfStream = new blr.W15yQC.pdfChecker.Stream(this.response); // this.response == uInt8Array.buffer
      var pdfObj={};
      var pdfDict={};
      var rootOffset, lex, p, o;


      // var byte3 = uInt8Array[4]; // byte at offset 4
      blr.W15yQC.pdfChecker.log("Stream Length: "+pdfStream.length);
      pdfVer=blr.W15yQC.pdfChecker.getPDFVersion(pdfStream);
      if (pdfVer!=null) {
        blr.W15yQC.pdfChecker.log("PDF Version:"+pdfVer);
        startxref=blr.W15yQC.pdfChecker.readFileTrailerForXrefStart(pdfStream);
        if (startxref!=null) {
          blr.W15yQC.pdfChecker.log("startxref: "+startxref);
          pdfStream.pos=startxref;

      var xref = new blr.W15yQC.pdfChecker.XRef(pdfStream);
      xref.setStartXRef(startxref);
      xref.parse(false);
      blr.W15yQC.pdfChecker.log("\nXREF:"+blr.W15yQC.objectToString(xref));

          rootOffset=blr.W15yQC.pdfChecker.parseXrefsAndGetRootOffset(pdfStream);
          if (rootOffset!=null) {
            blr.W15yQC.pdfChecker.log("rootOffset: "+rootOffset);
            pdfStream.pos=rootOffset;
            blr.W15yQC.pdfChecker.log("root dict: "+String.fromCharCode.apply(null, pdfStream.peekBytes(400)));
            pdfStream.find('<<');
            var lex=new blr.W15yQC.pdfChecker.Lexer(pdfStream);
            var p=new blr.W15yQC.pdfChecker.Parser(lex, false);
            var o=p.getObj();
            blr.W15yQC.pdfChecker.log("-- Root obj:"+blr.W15yQC.objectToString(o, true)+"\nOBJECT TO STRING OVER");

          }
        } else {
          blr.W15yQC.pdfChecker.log("ERROR: PDF file trailer and startxref NOT FOUND");
        }
      } else {
        blr.W15yQC.pdfChecker.log("ERROR: PDF Version NOT FOUND");
      }
    };

    blr.W15yQC.pdfChecker.log('Requesting: '+sURL);
    xhr.send();
   }
};


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


blr.W15yQC.pdfChecker.CipherTransformFactory = (function CipherTransformFactoryClosure() {
  function CipherTransformFactory() {

  }

  CipherTransformFactory.prototype = {
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
        this.encrypt = new CipherTransformFactory(encrypt, fileId,
                                                  this.password);
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
            console.log(entry.offset, entry.gen, entry.free,
                        entry.uncompressed);
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
        var parser = new Parser(new Lexer(stream), true, null);
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
      // calling error() would reject worker with an UnknownErrorException.
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

    fetchUncompressed: function XRef_fetchUncompressed(ref, xrefEntry,
                                                       suppressEncryption) {
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
          xrefEntry = parser.getObj(this.encrypt.createCipherTransform(num,
                                                                       gen));
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

    fetchCompressed: function XRef_fetchCompressed(xrefEntry,
                                                   suppressEncryption) {
      var tableOffset = xrefEntry.offset;
      var stream = this.fetch(new Ref(tableOffset, 0));
      if (!blr.W15yQC.pdfChecker.isStream(stream)) {
        //error('bad ObjStm stream');
      }
      var first = stream.dict.get('First');
      var n = stream.dict.get('N');
      if (!blr.W15yQC.pdfChecker.isInt(first) || !blr.W15yQC.pdfChecker.isInt(n)) {
        //error('invalid first and n parameters for ObjStm stream');
      }
      var parser = new Parser(new Lexer(stream), false, this);
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
            info('Malformed dictionary: key must be a name object');
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
          return (this.allowStreams ?
                  this.makeStream(dict, cipherTransform) : dict);
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
        info('Bad ' + length + ' attribute in stream');
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
        var ENDSTREAM_SIGNATURE = [0x65, 0x6E, 0x64, 0x73, 0x74, 0x72, 0x65,
                                   0x61, 0x6D];
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
          return new PredictorStream(new FlateStream(stream, maybeLength),
                                     maybeLength, params);
        }
        return new FlateStream(stream, maybeLength);
      }
      if (name == 'LZWDecode' || name == 'LZW') {
        var earlyChange = 1;
        if (params) {
          if (params.has('EarlyChange')) {
            earlyChange = params.get('EarlyChange');
          }
          return new PredictorStream(
            new LZWStream(stream, maybeLength, earlyChange),
                          maybeLength, params);
        }
        return new LZWStream(stream, maybeLength, earlyChange);
      }
      if (name == 'DCTDecode' || name == 'DCT') {
        return new JpegStream(stream, maybeLength, stream.dict, this.xref);
      }
      if (name == 'JPXDecode' || name == 'JPX') {
        return new JpxStream(stream, maybeLength, stream.dict);
      }
      if (name == 'ASCII85Decode' || name == 'A85') {
        return new Ascii85Stream(stream, maybeLength);
      }
      if (name == 'ASCIIHexDecode' || name == 'AHx') {
        return new AsciiHexStream(stream, maybeLength);
      }
      if (name == 'CCITTFaxDecode' || name == 'CCF') {
        return new CCITTFaxStream(stream, maybeLength, params);
      }
      if (name == 'RunLengthDecode' || name == 'RL') {
        return new RunLengthStream(stream, maybeLength);
      }
      if (name == 'JBIG2Decode') {
        return new Jbig2Stream(stream, maybeLength, stream.dict);
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



  blr.W15yQC.pdfChecker.Stream=function(arrayBuffer, start, length, dict) {
    this.bytes = (arrayBuffer instanceof Uint8Array ?
                  arrayBuffer : new Uint8Array(arrayBuffer));
    this.start = start || 0;
    this.pos = this.start;
    this.end = (start + length) || this.bytes.length;
    this.dict = dict;
  };

  blr.W15yQC.pdfChecker.Stream.prototype= {
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
