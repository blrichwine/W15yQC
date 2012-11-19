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

 * File:        overlay.js
 * Description: Inspects for common accessibility coding issues
 * Author:  Brian Richwine
 * Created: 2011.11.11
 * Modified:
 * Language:  JavaScript
 * Project: Quick Web Accessibility Checker
 *
 */

/*global blr: false, Components: false, Application: false */


if (!blr) { var blr = {}; }

/*
 * Object:  W15yQC
 */
if (!blr.W15yQC) {
  blr.W15yQC = {
    version: '1.0-B07',
    // Following are variables for setting various options:
    bHonorARIAHiddenAttribute: true,
    bHonorCSSDisplayNoneAndVisibilityHidden: true,
    userExpertLevel: null,
    userLocale: null,
    bEnglishLocale: true,
    highlightTimeoutID: null,
    sb: null,
    pageLoadHandlerForFocusHighlighter: null,
    
    // User prefs
    bIncludeHidden: false,
    bAutoScrollToSelectedElementInInspectorDialogs: true,
    
    // Homophones object for sounds like routine
    // TODO: add 20 most mispelled words
    // http://en.wikipedia.org/wiki/Wikipedia:Lists_of_common_misspellings/Homophones
    // http://en.wikipedia.org/wiki/Wikipedia:Lists_of_common_misspellings
    homophones: {
accomodate: 'accommodate',
acknowlege: 'acknowledge',
acommodate: 'accommodate',
acomodate: 'accommodate',
aknowledge: 'acknowledge',
acknowlegment: 'acknowledgment',
acknowledgement: 'acknowledgment',
acknowlegement: 'acknowledgment',
add: 'ad',
aide: 'aid',
aisle: 'ill',
allowed: 'aloud',
alter: 'altar',
apse: 'apps',
arent: 'aunt',
arguement: 'argument',
arguemant: 'argument',
arguemint: 'argument',
ark: 'arc',
assent: 'ascent',
assocation: 'association',
aural: 'oral',
b: 'be',
bah: 'baa',
baize: 'bays',
bale: 'bail',
banned: 'band',
bar: 'baa',
barred: 'bard',
basis: 'bases',
bass: 'base',
baste: 'based',
bawl: 'ball',
bawled: 'balled',
bear: 'bare',
becuase: 'because',
bee: 'be',
beech: 'beach',
been: 'bean',
beet: 'beat',
begining: 'beginning',
behavior: 'behavior',
behaviour: 'behavior',
beleive: 'believe',
berry: 'bury',
bier: 'beer',
billed: 'build',
birth: 'berth',
block: 'bloc',
blonde: 'blond',
blue: 'blew',
booze: 'boos',
bore: 'boar',
bored: 'board',
borne: 'born',
bough: 'bow',
braise: 'brays',
bread: 'bred',
brake: 'break',
browse: 'brows',
bruise: 'brews',
bryan: 'brian',
buoy: 'boy',
bussed: 'bust',
butt: 'but',
buy: 'bi',
by: 'bi',
bye: 'bi',
byte: 'bite',
c: 'sea',
cache: 'cash',
caste: 'cast',
caught: 'court',
calender: 'calendar',
chants: 'chance',
chaste: 'chased',
cheep: 'cheap',
cheque: 'check',
choose: 'chews',
chord: 'cord',
ciao: 'chow',
clause: 'claws',
clime: 'climb',
climes: 'climbs',
commerical: 'commercial',
comission: 'commission',
comision: 'commission',
commision: 'commission',
comitted: 'committed',
commited: 'committed',
comitment : 'commitment',
comitmment: 'commitment',
comitmant: 'complement',
concensus: 'consensus',
consencus: 'consensus',
consensus: 'consensus',
consenssus: 'consensus',
congradulations: 'contratulations',
copse: 'cops',
core: 'caw',
cores: 'cause',
corps: 'caw',
coup: 'coo',
course: 'coarse',
crewed: 'crude',
cruise: 'crews',
cs: 'seas',
damn: 'dam',
damned: 'dammed',
daze: 'days',
deductable: 'deductible',
deductuble: 'deductible',
deductabel: 'deductible',
deer: 'dear',
definately: 'definitely',
definatly: 'definitely',
definantly: 'definitely',
definetly: 'definitely',
definently: 'definitely',
depindant: 'dependant',
dependent: 'dependant',
dependunt: 'dependant',
dessert: 'desert',
diffrent: 'different',
dock: 'doc',
done: 'dun',
doze: 'does',
draught: 'draft',
due: 'dew',
dye: 'die',
dyed: 'died',
earn: 'urn',
effect: 'affect',
eight: 'ate',
embarras: 'embarrass',
embaras: 'embarrass',
embarass: 'embarrass',
enviroment: 'environment',
es: 'ease',
eye: 'aye',
eyed: 'id',
existanc: 'existence',
existance: 'existence',
existanse: 'existence',
fare: 'fair',
farther: 'father',
febuary: 'february',
feet: 'feat',
feint: 'faint',
firey: 'fiery',
filled: 'field',
fined: 'find',
flare: 'flair',
flecks: 'flex',
flee: 'flea',
flew: 'flu',
floor: 'flaw',
floored: 'flawed',
flower: 'flour',
flue: 'flu',
fore: 'for',
forword: 'foreward',
forworde: 'foreward',
foreword: 'foreward',
fought: 'fort',
four: 'for',
fowl: 'foul',
freeze: 'frees',
frieze: 'frees',
fur: 'fir',
further: 'farther',
gaze: 'gays',
gilled: 'gild',
gnaw: 'nor',
gores: 'gauze',
goverment: 'government',
great: 'grate',
greatful: 'grateful',
greece: 'grease',
greys: 'graze',
grown: 'groan',
gs: 'jeez',
guessed: 'guest',
guild: 'gild',
har: 'ah',
haras: 'harass', 
harrass: 'harass', 
herrass: 'harass', 
hare: 'hair',
harry: 'hairy',
haul: 'hall',
heard: 'herd',
heed: 'hed',
heel: 'heal',
heir: 'air',
here: 'hear',
heres: 'hears',
hey: 'hay',
high: 'hi',
hoarse: 'horse',
hoe: 'ho',
hose: 'hoes',
hour: 'our',
house: 'hows',
hurts: 'hertz',
hymn: 'him',
i: 'aye',
idol: 'idle',
inadvertant: 'inadvertent',
inadvartant: 'inadvertent',
inadvartent: 'inadvertent',
indispensabel: 'indispensable',
indispensible: 'indispensable',
indespensible: 'indispensable',
inn: 'in',
isle: 'ill',
jeans: 'genes',
judgment: 'judgement',
judgemant: 'judgement',
judgmant: 'judgement',
knead: 'need',
kneaded: 'needed',
kneed: 'need',
knew: 'new',
knight: 'night',
knit: 'nit',
knot: 'not',
know: 'no',
knows: 'nose',
kurd: 'curd',
lacks: 'lax',
lamb: 'lam',
lane: 'lain',
lapse: 'laps',
laze: 'lays',
lead: 'led',
leased: 'least',
leek: 'leak',
liason: 'liaison',
liasson: 'liaison',
liasone: 'liaison',
libary: 'library',
licens: 'license',
lisense: 'license',
lisence: 'license',
links: 'lynx',
lock: 'loch',
lode: 'load',
lone: 'loan',
lore: 'law',
loose: 'lose',
lute: 'loot',
lye: 'lie',
maid: 'made',
maine: 'main',
maize: 'maze',
male: 'mail',
mane: 'main',
manner: 'manor',
marque: 'mark',
martial: 'marshal',
mayor: 'mare',
meddle: 'medal',
meet: 'meat',
mete: 'meat',
mettle: 'metal',
might: 'mite',
mined: 'mind',
minks: 'minx',
minor: 'miner',
mints: 'mince',
mispell: 'misspell',
missed: 'mist',
more: 'moor',
mourn: 'morn',
mourning: 'morning',
mousse: 'moose',
mowed: 'mode',
mown: 'moan',
muse: 'mews',
mussel: 'muscle',
none: 'nun',
o: 'oh',
oar: 'or',
oared: 'awed',
ocassion: 'occasion',
ocasion: 'occasion',
occassion: 'occasion',
ocurrance: 'occurrence',
occurrance: 'occurrence',
occurance: 'occurrence',
occurence: 'occurrence',
ocurred: 'occurred',
ocured: 'occurred',
occured: 'occurred',
offical: 'official',
ore: 'or',
owe: 'oh',
owed: 'ode',
p: 'pea',
packed: 'pact',
pale: 'pail',
pane: 'pain',
pare: 'pair',
passed: 'past',
pause: 'paws',
pear: 'pair',
peddled: 'pedaled',
pee: 'pea',
peek: 'peak',
peeked: 'peaked',
peeled: 'pealed',
perserverance: 'perseverance',
persaverence: 'perseverance',
perserverence: 'perseverance',
phew: 'few',
pie: 'pi',
piece: 'peace',
pier: 'peer',
plaice: 'place',
plane: 'plain',
played: 'plaid',
please: 'pleas',
plumb: 'plum',
poll: 'pole',
pour: 'poor',
poured: 'pored',
pours: 'pores',
praise: 'prays',
perogative: 'prerogative',
perogitive: 'prerogative',
preragitive: 'prerogative',
prey: 'pray',
preyed: 'prayed',
preys: 'prays',
pried: 'pride',
principle: 'principal',
prints: 'prince',
prise: 'pries',
privelege: 'privilege',
privlege: 'privilege',
privelige: 'privilege',
prize: 'pries',
proceed: 'procede',
proceede: 'procede',
proced: 'procede',
prophet: 'profit',
prose: 'pros',
purr: 'per',
q: 'cue',
quay: 'key',
queue: 'cue',
r: 'ah',
raise: 'rays',
raised: 'razed',
raze: 'rays',
read: 'red',
reciept: 'receipt',
recieve: 'receive',
reed: 'red',
reel: 'real',
realy: 'really',
reign: 'rain',
reigned: 'rained',
rein: 'rain',
reined: 'rained',
rhodes: 'roads',
riffed: 'rift',
right: 'rite',
roar: 'raw',
rode: 'road',
roll: 'role',
rome: 'roam',
rose: 'roes',
rough: 'ruff',
route: 'root',
routed: 'rooted',
row: 'roe',
rowed: 'road',
rows: 'roes',
ryes: 'rise',
sacks: 'sax',
sale: 'sail',
sales: 'sails',
scene: 'seen',
scent: 'cent',
scents: 'cents',
sealing: 'ceiling',
see: 'sea',
seem: 'seam',
seemed: 'seamed',
seer: 'sear',
sees: 'seas',
seize: 'seas',
sell: 'cell',
sense: 'cents',
sensor: 'censor',
sent: 'cent',
separete: 'separate',
seperate: 'separate',
seperat: 'separate',
serial: 'cereal',
sew: 'so',
sheer: 'shear',
sheik: 'shake',
shoo: 'shoe',
shoot: 'chute',
shore: 'sure',
sighed: 'side',
sighs: 'size',
sight: 'cite',
sighted: 'cited',
sine: 'sign',
site: 'cite',
sited: 'cited',
slow: 'sloe',
soar: 'saw',
soared: 'sawed',
soled: 'sold',
some: 'sum',
sore: 'saw',
sought: 'sort',
soul: 'sole',
sow: 'so',
stare: 'stair',
stationery: 'stationary',
stayed: 'staid',
steak: 'stake',
steel: 'steal',
straight: 'strait',
sun: 'son',
supercede: 'supersede',
superceed: 'supersede',
suparseed: 'supersede',
surf: 'serf',
surge: 'serge',
sweet: 'suite',
sword: 'sawed',
t: 'tea',
tacked: 'tact',
tacks: 'tax',
tale: 'tail',
tar: 'ta',
taught: 'talk',
taut: 'talk',
tease: 'teas',
tee: 'tea',
teem: 'team',
tees: 'teas',
teh: 'the',
thai: 'tie',
then: 'than',
there: 'their',
theres: 'theirs',
theyre: 'their',
thier: 'their',
thom: 'tom',
thomas: 'tomas',
through: 'threw',
thrown: 'throne',
thyme: 'time',
tied: 'tide',
tier: 'tear',
toed: 'toad',
tonne: 'ton',
too: 'to',
tow: 'toe',
towed: 'toad',
truely: 'truly',
trussed: 'trust',
ts: 'teas',
tucks: 'tux',
two: 'to',
tyre: 'tire',
u: 'ewe',
untill: 'until',
vane: 'vain',
vein: 'vain',
waive: 'wave',
waived: 'waved',
waste: 'waist',
wear: 'ware',
weave: 'weve',
wee: 'we',
weed: 'wed',
week: 'weak',
weigh: 'way',
weighed: 'wade',
weight: 'wait',
weighted: 'waited',
well: 'weel',
were: 'weir',
whacks: 'wax',
whale: 'wail',
whats: 'watts',
wheel: 'weel',
wheeze: 'wees',
where: 'ware',
whet: 'wet',
whey: 'way',
wile: 'while',
whine: 'wine',
whined: 'wined',
whit: 'wit',
who: 'hoo',
whole: 'hole',
whose: 'whos',
wich: 'which',
wiegh: 'way',
wise: 'whys',
witch: 'which',
won: 'one',
wonder: 'wander',
wore: 'war',
worn: 'warn',
would: 'wood',
wrack: 'rack',
wrap: 'rap',
wrapped: 'rapped',
wrest: 'rest',
wrested: 'rested',
wring: 'ring',
write: 'rite',
wrote: 'rote',
wrung: 'rung',
x: 'ex',
y: 'why',
yew: 'ewe',
yews: 'use',
yolk: 'yoke',
you: 'ewe',
youll: 'yule',
your: 'yore',
youre: 'yore',
ys: 'whys'
},

    // fnCreateStrBundle based on: chrome://global/content/strres.js
    strBundleService: null,
    fnCreateStrBundle: function(path) {
      if (blr.W15yQC.strBundleService == null) {
          try {
              blr.W15yQC.strBundleService =
                  Components.classes["@mozilla.org/intl/stringbundle;1"].getService();
              blr.W15yQC.strBundleService =
                  blr.W15yQC.strBundleService.QueryInterface(Components.interfaces.nsIStringBundleService);
          } catch (ex) {
              return null;
          }
      }
      return blr.W15yQC.strBundleService.createBundle(path);
    },

    fnInitStringBundles: function() {
      if(blr.W15yQC.sb == null) {
        // The following doesn't work from dialog boxes
        blr.W15yQC.sb = document.getElementById("overlay-string-bundle");
        if(blr.W15yQC.sb == null || !blr.W15yQC.sb.getString) {
          blr.W15yQC.sb = blr.W15yQC.fnCreateStrBundle("chrome://W15yQC/locale/overlay.properties");
        }
      }
    },

    fnGetString: function(sKey, aParameters) {
      if(blr.W15yQC.sb == null) { blr.W15yQC.fnInitStringBundles(); }
      var sString;
      if(blr.W15yQC.sb != null) {
        if(blr.W15yQC.sb.getString) {
          try {
            if(aParameters != null && aParameters.length > 0) {
              sString = blr.W15yQC.sb.getFormattedString(sKey, aParameters);
            } else {
              sString = blr.W15yQC.sb.getString(sKey);
            }
          } catch(ex) {
            try {
              sString = blr.W15yQC.sb.getFormattedString('missingSBProperty', [sKey]);
            } catch(ex2) {
            }
          }
        } else {
          try {
            if(aParameters != null && aParameters.length>0) {
              sString = blr.W15yQC.sb.formatStringFromName(sKey,aParameters,aParameters.length);
            } else {
              sString = blr.W15yQC.sb.GetStringFromName(sKey);
            }
          } catch(ex3) {
            sString = blr.W15yQC.sb.formatStringFromName('missingSBProperty', [sKey], 1);
          }
        }
        if(sString != null) { return sString; }
      }
      return 'String Bundle System Unavailable. Something serious is wrong!';
    },
    
    // TODO: Try replacing processNextEvent with http://dbaron.org/log/20100309-faster-timeouts  window.postMessage
    fnDoEvents: function() {
      var thread;
      try {
        thread = Components.classes['@mozilla.org/thread-manager;1'].getService(Components.interfaces.nsIThreadManager).currentThread;
        while (thread.hasPendingEvents()) thread.processNextEvent(false);
      } catch(ex) {
      }
    },

    fnIsValidLocale: function(sLocale) {
      return /^([xi]-[a-z0-9]+|[a-z]{2,3}(-[a-z0-9]+)?)$/i.test(sLocale); // QA iframeTests01.html
    },
    
    fnSetIsEnglishLocale: function(sLocale) {
      if(sLocale == null || sLocale=='' || (sLocale.substring && sLocale.substring(0,2).toLowerCase()=='en')) {
        blr.W15yQC.bEnglishLocale = true;
      }
      else {
        blr.W15yQC.bEnglishLocale = false;
      }
      return blr.W15yQC.bEnglishLocale;
    },
    
    fnGetUserLocale: function() { //Used to decide if need to disable the english only text checks
      blr.W15yQC.userLocale = Application.prefs.getValue('general.useragent.locale','');
      return blr.W15yQC.userLocale;
    },
    
    onMenuItemCommand: function (bSaveToFile) {
      var converter,
          file,
          foStream,
          fp,
          nsIFilePicker,
          rd=blr.W15yQC.fnInspect(),
          rv;
      if(bSaveToFile==true) {
        if(rd != null) {
          nsIFilePicker = Components.interfaces.nsIFilePicker;
  
          fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
          fp.init(window, "Dialog Title", nsIFilePicker.modeSave);
          fp.appendFilters(nsIFilePicker.filterHTML | nsIFilePicker.filterAll);
          rv = fp.show();
          if (rv == nsIFilePicker.returnOK || rv == nsIFilePicker.returnReplace) {
            
            file = fp.file;
            // work with returned nsILocalFile...
            if(/\.html?$/.test(file.path)==false) {
              file.initWithPath(file.path+'.html');
            }
  
            foStream = Components.classes["@mozilla.org/network/file-output-stream;1"].  
                           createInstance(Components.interfaces.nsIFileOutputStream);  

            foStream.init(file, 0x2A, 438, 0);
            converter = Components.classes["@mozilla.org/intl/converter-output-stream;1"].createInstance(Components.interfaces.nsIConverterOutputStream);  
            converter.init(foStream, "UTF-8", 0, 0);  
            converter.writeString('<html>'+rd.documentElement.innerHTML+'</html>');
            converter.close(); // this closes foStream            
          }
        }
      }
    },

    fnLog: function (sMsg) {
      try {
        var consoleServ = Components.classes['@mozilla.org/consoleservice;1'].getService(Components.interfaces.nsIConsoleService);
        consoleServ.logStringMessage(sMsg);
      } catch (ex) {};
    },

    autoAdjustColumnWidths: function (treebox, iLimitCounter) {
      // Auto-size the narrower XUL treebox columns

      var cols, i, j, newWidth, ch,
          tree,
          rowCount,
          bChangeMade;

      if (iLimitCounter == null) {
        iLimitCounter = 1;
      } else {
        iLimitCounter++;
      }
      if (iLimitCounter < 30 && treebox != null && treebox.columns != null && treebox.columns.length && treebox.columns.length > 0) {
        cols = treebox.columns;
        tree = cols.tree;
        rowCount = tree.treeBody.childElementCount;
        bChangeMade = false;
        for (i = 0; i < cols.length; i++) {
          if (cols[i].width > 1 && cols[i].width < 150) {
            for (j = 0; j < rowCount; j++) { // Check each row
              if (tree.isCellCropped(j, cols[i])) {
                newWidth = cols[i].width + 5;
                ch = treebox.ownerDocument.getElementById(cols[i].id);
                if (ch) {
                  ch.setAttribute('width', newWidth);
                  bChangeMade = true;
                }
                break;
              }
            }
          }
        }
        if (bChangeMade) { // Need to release the thread so change takes place.
          tree.invalidate();
          setTimeout(function () {
            blr.W15yQC.autoAdjustColumnWidths(treebox, iLimitCounter);
          }, 2);
        }
      }
    },

    fnMaxDecimalPlaces: function (sNumber, iPlaces) {
      if (/\d*\.\d+/.test(sNumber) && sNumber.toString().length - sNumber.toString().indexOf('.') - 1 > iPlaces) {
        return parseFloat(sNumber).toFixed(iPlaces);
      }
      return sNumber;
    },

    fnCleanSpaces: function (str, bKeepNewLines) {
      if (str && str.replace) {
        if (bKeepNewLines) {
          str = blr.W15yQC.fnTrim(str.replace(/[ \t]+/g, ' '));
        } else {
          str = blr.W15yQC.fnTrim(str.replace(/\s+/g, ' '));
        }
      }
      return str;
    },

    fnTrim: function (str) {
      if(str != null && str.replace) { return str.replace(/^\s*|\s*$/g, ''); }
      if(str != null) { blr.W15yQC.fnLog("fnTrim: passed:"+str.toString()); }
      return str;
    },

    fnJoin: function (s1, s2, sSeparator) {
      var sRet = null;
      if (s1 == null) { return s2; }
      if (s2 == null) { return s1; }
      if (sSeparator == null) { sSeparator = ' '; }
      s1 = blr.W15yQC.fnCleanSpaces(s1, true);
      s2 = blr.W15yQC.fnCleanSpaces(s2, true);
      if (s1 == '') { return s2; }
      if (s2 == '') { return s1; }
      if (s1.length > 0 && s2.length > 0) {
        sRet = s1 + sSeparator + s2;
      } else {
        sRet = s1 + s2;
      }
      return sRet;
    },

    fnJoinIfNew: function (s1, s2, sSeparator) {
      if (s1 == null) { return s2; }
      if (s2 == null) { return s1; }
      s1 = blr.W15yQC.fnCleanSpaces(s1, true);
      s2 = blr.W15yQC.fnCleanSpaces(s2, true);
      if (s1 == '') { return s2; }
      if (s2 == '') { return s1; }
      if (s1.indexOf(s2) < 0 && s2.indexOf(s1) < 0) { // Join if s2 is not in s1 and vice versa
        return blr.W15yQC.fnJoin(s1, s2, sSeparator);
      }
      return s1;
    },

    fnCutoffString: function (s, maxLen) {
      if (maxLen != null && maxLen > 0 && s != null && s.length > maxLen) {
        if (maxLen > 3) { s = s.substr(0, maxLen - 3) + '...'; }
        s = s.substr(0, maxLen);
      }
      return s;
    },

    // Severity Levels: 0=notice, 1=warning, 2=failure
    // Expert Levels: 0=Basic, 1=Advanced, 2=Expert
    noteDetails: { // [Severity, Expert level, hasExplanation, URL]
      missingSBProperty: [2,0,false,null],
      docTitleMissing: [2,0,false,null],
      docTitleEmpty: [2,0,false,null],
      docLangNotGiven: [2,0,true,null],
      docLangNotSpecified: [2,0,true,null],
      docInvalidLang: [2,0,false,null],
      docLangAttrInvalidUseUnderscore: [2,0,false,null],
      docTitleNotUnique: [1,0,false,null],
      docCSSSuppressingOutline: [1,0,true,null],
      docUsesFullJustifiedText: [2,0,true,null],
      docNonUniqueIDs: [1,1,false,null],
      docInvalidIDs: [1,1,false,null],
      
      idIsNotUnique: [2,1,false,null],
      idIsNotValid: [1,1,false,null],

      frameContentScriptGenerated: [0,0,false,null],
      frameTitleMissing: [2,0,false,null],
      frameTitleOnlyASCII: [2,0,false,null],
      frameTitleNotMeaningful: [1,0,false,null],
      frameTitleNotUnique: [2,0,false,null],
      frameTitleSoundsSame: [1,0,false,null],
      frameTitleEmpty: [2,0,false,null],
      frameIDNotValid: [1,1,false,null],
      frameIDNotUnique: [1,1,false,null],

      ldmkAndLabelNotUnique: [2,0,false,null],
      ldmkNotUnique: [2,0,false,null],
      ldmkIDNotValid: [1,0,false,null],
      ldmkIDNotUnique: [2,0,false,null],
      ldmkMainLandmarkMissing: [2,0,true,null],
      ldmkMultipleMainLandmarks: [2,0,true,null],
      ldmkMultipleBannerLandmarks: [1,0,true,null],
      ldmkMultipleContentInfoLandmarks: [1,0,true,null],
      
      ariaLmkAndLabelNotUnique: [2,0,false,null],
      ariaLmkNotUnique: [2,0,false,null],
      ariaLevelAttributeValueInvalid: [2,0,false,null],
      ariaHeadingMissingAriaLevel: [1,0,true,null],
      ariaHasBothLabelAndLabelledBy: [2,0,true,null],
      ariaMultipleRoleValues: [1,0,false,null],
      ariaInvalidAttrWUndefValue: [1,1,true,null],
      ariaAttributeMustBeValidNumber: [2,0,false,null],
      ariaAttrMustBePosIntOneOrGreater: [2,0,false,null],
      ariaPosInSetWOAriaSetSize: [2,0,false,null],
      ariaEmptyValueTextWValueNowWarning: [1,1,true,null],
      ariaInvalidAriaLabeledBy: [2,0,false,null],
      ariaIDNotValid: [1,0,false,null],
      ariaIDNotUnique: [2,0,false,null],

      ariaAbstractRole: [2,1,false,null],
      ariaUnknownRole: [2,1,false,null],
      ariaLabelledbyIDsMissing: [2,1,false,null],
      ariaDescribedbyIDsMissing: [2,1,false,null],
      ariaMissingProperties: [2,1,true,null],
      ariaMissingContainer: [2,1,true,null],
      
      imgLongdescImageFileName: [2,0,false,null],
      imgLongdescShouldBeURL: [2,0,false,null],
      imgMissingAltAttribute: [2,0,false,null],
      imgNoAltText: [1,0,false,null],
      imgHasAltTextAndPresRole: [2,0,false,null],
      imgSpacerWithAltTxt: [1,0,false,null],
      imgSpacerShouldHaveEmptyAltTxt: [1,0,false,null],
      imgAltTxtIsFileName: [1,0,false,null],
      imgAltTxtIsURL: [1,0,false,null],
      imgAltTxtIsJunk: [1,0,false,null],
      imgAltTxtIsDefault: [1,0,false,null],
      imgAltTxtIsDecorative: [1,0,false,null],
      imgAltTxtIncludesImageTxt: [1,0,false,null],
      imgIDNotValid: [1,0,false,null],
      imgIDNotUnique: [2,0,false,null],
      imgAltTxtOnlyASCII: [2,0,false,null],
      
      akConflict: [1,0,false,null],
      akNoLabel: [2,0,false,null],
      akLabelOnlyASCII: [2,0,false,null],
      akLabelNotMeaningful: [1,0,false,null],
      akValueNotUnique: [2,0,false,null],
      akLabelNotUnique: [2,0,false,null],
      akLabelEmpty: [2,0,false,null],
      akIDNotValid: [1,0,false,null],
      akIDNotUnique: [1,0,false,null],

      hSkippedLevel: [2,1,false,null],
      hTxtMissing: [2,1,false,null],
      hTxtOnlyASCII: [2,1,false,null],
      hTxtNotMeaninfgul: [1,1,false,null],
      hTxtEmpty: [2,1,false,null],
      hIDNotValid: [1,1,false,null],
      hIDNotUnique: [1,1,false,null],

      frmNameNotUnique: [1,1,false,null],
      frmFormIsNested: [2,1,false,null],
      frmFormContainsForms: [2,1,false,null],
      frmIDNotValid: [1,1,false,null],
      frmIDNotUnique: [1,1,false,null],

      frmCtrlNotLabeled: [2,0,false,null],
      frmCtrlLabelOnlyASCII: [2,0,false,null],
      frmCtrlLabelNotMeaningful: [1,0,false,null],
      frmCtrlLabelNextPrev: [1,0,false,null],
      fmrCtrlLabelNotUnique: [2,0,false,null],
      frmCtrlLabelDoesntSoundUnique: [2,0,false,null],
      frmCtrlLabelEmpty: [2,0,false,null],
      frmCtrlInputTypeImageWOAltText: [2,0,false,null],
      frmCtrlInputTypeImageWOAltAttr: [2,0,false,null],
      frmCtrlRedundantOCandOK: [2,0,false,null],
      frmCtrlHasBothOCandOK: [1,0,false,null],
      frmCtrlForValInvalid: [1,0,false,null],
      frmCtrlNoFrmCtrlForForValue: [2,0,false,null],
      frmCtrlNoElForForValue: [2,0,false,null],
      frmCtrlForValIDNotUnique: [2,0,false,null],
      frmCtrlForForValueIsHidden: [1,1,false,null],
      frmCtrlForValueEmpty: [2,0,false,null],
      frmCtrlImplicitLabel: [2,0,false,null],
      frmCtrlLegendWOFieldset: [2,0,false,null],
      frmCtrlFieldsetWOLegend: [2,0,false,null],
      frmCtrlRadioButtonWOLegendText: [1,0,false,null],
      frmCtrlIDNotValid: [2,0,false,null],
      frmCtrlIDNotUnique: [2,0,false,null],

      lnkTxtMissing: [2,0,false,null],
      lnkTxtOnlyASCII: [2,0,false,null],
      lnkTxtNotMeaningful: [2,0,false,null],
      lnkTxtNextPrev: [2,0,false,null],
      lnkTxtBeginWithLink: [1,0,false,null],
      lnkInvalid: [1,0,false,null],
      lnkLinkMissingHrefValue: [1,0,false,null],
      lnkTooSmallToHit: [2,0,false,null],
      lnkTxtNotUnique: [2,0,false,null],
      lnkTxtDoesntSoundUnique: [1,0,false,null],
      lnkTxtDiffSameHrefOnclick: [1,0,false,null],
      lnkTxtDiffSameHref: [1,0,false,null],
      lnkTxtEmpty: [2,0,false,null],
      lnkIsNamedAnchor: [0,0,false,null],
      lnkTargetsLink: [0,0,false,null],
      lnkTargets: [0,0,false,null],
      lnkTargetDoesNotExist: [2,0,false,null],
      lnkTargetDoesNotAppearValid: [1,0,false,null],
      lnkHasBothOCandOK: [2,0,false,null],
      lnkHasInvalidAltAttribute: [1,0,false,null],
      lnkTargetIDisNotUnique: [2,0,false,null],
      lnkTargetIDNotValid: [1,0,false,null],
      lnkServerSideImageMap: [2,0,false,null],
      lnkIDNotValid: [2,0,false,null],
      lnkIDNotUnique: [2,0,false,null],

      tblMultipleCaptions: [2,0,false,null],
      tblNestedTR: [1,1,false,null],
      tblEmptyTR: [1,1,false,null],
      tblOutsideRow: [1,1,false,null],
      tblColspanRowspanColision: [1,1,false,null],
      tblRowspanRowspanColision: [1,1,false,null],
      tblRowWOCols: [1,1,false,null],
      tblEmptyTable: [1,1,false,null],
      tblRowpanExceedsTableRows: [1,1,false,null],
      tblIsDataTable: [0,0,false,null],
      tblCheckCaptionSummary: [1,0,false,null],
      tblCaptionSameAsSummary: [1,0,false,null],
      tblSummaryLooksLikeLayout: [2,0,false,null],
      tblSummaryLooksLikeADefault: [2,0,false,null],
      tblSummaryNotMeaningful: [2,0,false,null],
      tblCaptionLooksLikeLayout: [2,0,false,null],
      tblCaptionLooksLikeADefault: [2,0,false,null],
      tblCaptionNotMeaningful: [2,0,false,null],
      tblDTMissingTHs: [2,0,false,null],
      tblDTisComplex: [1,0,false,null],
      tblDTwTDwoHeadersAttrib: [2,0,false,null],
      tblNotEveryCellWithContentInDTHasHeaders: [2,0,false,null],
      tblIsLayoutTable: [0,0,false,null],
      tblUnequalColCount: [1,0,false,null],
      tblLayoutTblIsComplex: [1,0,false,null],
      tblLayoutTblIsComplexWOpresRole: [1,0,false,null],
      tblTooLargeForLayoutTable: [1,0,false,null]
    },

    fnGetNoteSeverityLevel: function(msgKey) {
      var severityLevel = 0;
      if(blr.W15yQC.noteDetails.hasOwnProperty(msgKey)) {
        severityLevel = blr.W15yQC.noteDetails[msgKey][0];
      }
      return severityLevel;
    },

    fnAddNote: function(no, sMsgKey, aParameters) {
      var sl=blr.W15yQC.fnGetNoteSeverityLevel(sMsgKey);
      blr.W15yQC.fnLog("fnAddNote-begin:"+sMsgKey+' '+aParameters);
      blr.W15yQC.fnLog(no.toString());
      if(no.notes == null) { no.notes = []; }
      if(sl==1) {
        no.warning = true;
      } else if(sl==2) {
        no.failed = true;
      }
      no.notes.push(new blr.W15yQC.note(sMsgKey, aParameters));
    },

    fnResolveNote: function(note, msgHash) {
      if(note != null && note.msgKey && note.msgKey.length) {
        var msgKey = note.msgKey,
            aParameters = note.aParameters,
            sMsgTxt = null,
            bHasExplanation = false,
            sExplanation = null,
            severityLevel = 0,
            expertLevel = 0,
            nd,
            URL = null;

        if(blr.W15yQC.noteDetails.hasOwnProperty(msgKey)) {
          nd = blr.W15yQC.noteDetails[msgKey];
          severityLevel = nd[0];
          expertLevel = nd[1];
          bHasExplanation = nd[2];
          URL = nd[3];
        }

        if(bHasExplanation == true && (msgHash == null || msgHash.hasItem(msgKey) == false)) {
          sExplanation = blr.W15yQC.fnGetString(msgKey+'.e');
          if(msgHash != null) { msgHash.setItem(msgKey, 1); }
        }

        if(severityLevel != 1 && severityLevel != 2) { severityLevel = 0; }
        if(expertLevel != 1 && expertLevel != 2) { expertLevel = 0; }

        sMsgTxt = blr.W15yQC.fnGetString(msgKey, aParameters);
        if(sMsgTxt == null) {
          severityLevel = 2;
          expertLevel = 0;
          sMsgTxt = blr.W15yQC.fnGetString('missingSBProperty', [msgKey]);
          if(sMsgTxt == null) { sMsgTxt = 'Missing String Bundle Property for:'+msgKey; }
        }
        return new blr.W15yQC.resolvedNote(msgKey, severityLevel, expertLevel, sMsgTxt, sExplanation, URL);
      }
      return null;
    },

    fnMakeHTMLNotesList: function(no, msgHash) {
          blr.W15yQC.userExpertLevel = Application.prefs.getValue("extensions.W15yQC.userExpertLevel",0);
          var sHTML = '',
          noteLevelDisplayOrder = [0,2,1],
          noteLevelClasses = ['', 'warning', 'failure'],
          noteLevelTexts = ['', blr.W15yQC.fnGetString('noteWarning'),blr.W15yQC.fnGetString('noteFailure')],
          noteLevelIndex,
          noteLevel,
          noteClass,
          i,
          rn,
          noteText;
      if(no != null && no.notes != null && no.notes.length > 0) {
        sHTML = '<ul class="results">';
        for(noteLevelIndex=0;noteLevelIndex<3;noteLevelIndex++) {
          noteLevel = noteLevelDisplayOrder[noteLevelIndex];
          noteClass = noteLevelClasses[noteLevel];
          noteText = noteLevelTexts[noteLevel];
          for(i=0; i<no.notes.length; i++) {
            if(blr.W15yQC.fnGetNoteSeverityLevel(no.notes[i].msgKey) == noteLevel) {
              rn = blr.W15yQC.fnResolveNote(no.notes[i], msgHash);
              if(rn != null && rn.expertLevel<= blr.W15yQC.userExpertLevel) {
                if(noteLevel==1) {
                  no.warning = true;
                } else if(noteLevel==2) {
                  no.failed = true;
                }
                sHTML=sHTML+'<li><span class="srt">'+noteText+'</span> '+blr.W15yQC.fnMakeWebSafe(blr.W15yQC.fnJoin(rn.msgText,rn.msgExplanation,' '))+'</li>';
              }
            }
          }
        }
        sHTML += '</ul>';
      }
      return sHTML;
    },

    fnMakeTextNotesList: function(no, msgHash) {
      blr.W15yQC.userExpertLevel = Application.prefs.getValue("extensions.W15yQC.userExpertLevel",0);
      var sNotes = '',
      noteLevelDisplayOrder = [2,1,0],
      noteLevelClasses = ['', 'warning', 'failure'],
      noteLevelTexts = [blr.W15yQC.fnGetString('noteNote'), blr.W15yQC.fnGetString('noteWarning'),blr.W15yQC.fnGetString('noteFailure')],
      noteLevelIndex,
      bLevelTextDisplayed,
      noteLevel,
      noteText,
      i,
      rn;

      if(no != null && no.notes != null && no.notes.length > 0) {
        for(noteLevelIndex=0;noteLevelIndex<3;noteLevelIndex++) {
          bLevelTextDisplayed = false;
          noteLevel = noteLevelDisplayOrder[noteLevelIndex];
          noteText = noteLevelTexts[noteLevel];
          for(i=0; i<no.notes.length; i++) {
            if(blr.W15yQC.fnGetNoteSeverityLevel(no.notes[i].msgKey) == noteLevel) {
              rn = blr.W15yQC.fnResolveNote(no.notes[i], msgHash);
              if(rn != null && rn.expertLevel<= blr.W15yQC.userExpertLevel) {
                if(noteLevel==1) {
                  no.warning = true;
                } else if(noteLevel==2) {
                  no.failed = true;
                }
                if(bLevelTextDisplayed == false) {
                  bLevelTextDisplayed = true;
                  sNotes=blr.W15yQC.fnJoin(sNotes, noteText+' ',"\n\n");
                }
                sNotes=blr.W15yQC.fnJoin(sNotes,blr.W15yQC.fnJoin(rn.msgText,rn.msgExplanation,' '),' ');
              }
            }
          }
        }
      }
      return sNotes;
    },

    fnAddPageLevelNote: function(no, sMsgKey, aParameters) {
      if(!no) { no = []; }
      if(!no.pageLevel) { no.pageLevel = { failed:false, warning:false}; }
      blr.W15yQC.fnAddNote(no.pageLevel,sMsgKey, aParameters);
    },
    
    fnStringHasContent: function(s) {
      return (s!=null)&&/\S/.test(s);
    },

    fnElementHasOwnContent: function(node) {
      if(node!=null && node.firstChild) {
        node = node.firstChild;
        while(node!=null) {
          if(node.nodeType==3 && node.data!=null &&/\S/.test(node.data)) { return true; }
          node=node.nextSibling;
        }
      }
      return false;
    },
    
    fnElementsOwnContent: function(node) {
      var sText='';
      if(node!=null && node.firstChild) {
        node = node.firstChild;
        while(node!=null) {
          if(node.nodeType==3 && node.data!=null) { sText+=node.data; }
          node=node.nextSibling;
        }
      }
      return blr.W15yQC.fnCleanSpaces(sText);
    },
    
    fnElementIsChildOf: function(childNode, sParentTagName) {
      if(childNode != null && childNode.parentNode && childNode.parentNode != null && sParentTagName != null) {
        sParentTagName=sParentTagName.toLowerCase();
        var node=childNode.parentNode;
        while(node!=null && node.tagName && node.tagName.toLowerCase() !== sParentTagName) { node=node.parentNode;}
         if (node != null && node.tagName && node.tagName.toLowerCase()==sParentTagName) return true;
      }
      return false;
    },
    
    fnStringsEffectivelyEqual: function (s1, s2) { // TODO: Improve this! What contexts is this used in?
      if (s1 == s2) { return true; }
      if (blr.W15yQC.fnCleanSpaces(s1+' ',false).toLowerCase() == blr.W15yQC.fnCleanSpaces(s2+' ',false).toLowerCase()) {
        return true;
      }
      return false;
    },

    fnIsValidPositiveInt: function (sInt) {
      sInt = blr.W15yQC.fnTrim(sInt);
      if(sInt != null && sInt.length>0 && /^[0-9]+$/.test(sInt) && !isNaN(parseInt(sInt,10)) && parseInt(sInt,10)>=0) {
        return true;
      }
      return false;
    },

    fnIsValidNumber: function (sNumber) {
      sNumber = blr.W15yQC.fnTrim(sNumber);
      if(sNumber != null && sNumber.length>0 && /^[0-9e\.\,\+\-]+$/.test(sNumber) && !isNaN(parseFloat(sNumber))) {
        return true;
      }
      return false;
    },

    fnStringIsTrueFalse: function(s) {
      if(s!=null) {
        s=blr.W15yQC.fnTrim(s.toLowerCase());
        if(s=='true'||s=='false') { return true; }
      }
      return false;
    },
    
    fnMakeWebSafe: function (sString) {
      if (sString != null && sString.replace && sString.length > 0) {
        sString = sString.replace(/</g, '&lt;');
      }
      return sString;
    },

    fnGetNodeAttribute: function (node, sAttributeName, sDefault) {
      var sAttributeValue = sDefault;
      if (node && node.hasAttribute && node.hasAttribute(sAttributeName)) {
        sAttributeValue = node.getAttribute(sAttributeName);
      }
      return sAttributeValue;
    },

    fnHasClass: function (ele, cls) {
      return ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
    },

    fnAddClass: function (ele, cls) {
      if (!blr.W15yQC.fnHasClass(ele, cls)) { ele.className += " " + cls; }
    },

    fnAppendPElementTo: function (node, doc, sText) {
      var element = doc.createElement('p');
      element.appendChild(doc.createTextNode(sText));
      node.appendChild(element);
    },

    fnAppendExpandContractHeadingTo: function (node, doc, sText) {
      var element, aEl, spanEl;
      element = doc.createElement('h2'); 
      element.setAttribute('tabindex', '-1');
      aEl = doc.createElement('a');
      aEl.setAttribute('tabindex',0);
      aEl.setAttribute('class','ec');
      aEl.setAttribute('href','javascript:expandContractSection=\''+sText+'\';');
      aEl.setAttribute('title','Expand Contract Section: '+sText); // TODO: i18n
      aEl.setAttribute('onclick','ec(this,\'' + sText + '\');return false;');
      spanEl=doc.createElement('span');
      spanEl.appendChild(doc.createTextNode('Hide ')); // TODO: i18n
      spanEl.setAttribute('class','auralText');
      aEl.appendChild(spanEl);
      aEl.appendChild(doc.createTextNode(sText));
      element.appendChild(aEl);
      node.appendChild(element);
    },

    fnCreateTableHeaders: function (doc, table, aTableHeaders) {
      var thead, tr, i, j, th, thTextArray;
      if (doc && table && aTableHeaders && aTableHeaders.length > 0) {
        thead = doc.createElement('thead');
        tr = doc.createElement('tr');
        for (i = 0; i < aTableHeaders.length; i++) {
          th = doc.createElement('th');
          th.setAttribute('scope', 'col');
          thTextArray=aTableHeaders[i].split('<br>');
          for(j=0;j<thTextArray.length;j++) {
            if(j>0) {
              th.appendChild(doc.createElement('br'));
            }
            th.appendChild(doc.createTextNode(thTextArray[j]));
          }
          tr.appendChild(th);
        }
        thead.appendChild(tr);
        table.appendChild(thead);
      }
      return table;
    },

    fnAppendTableRow: function (doc, tableBody, aTableCells, sClass) {
      var i, sText, td, tr;
      if (doc && tableBody && aTableCells && aTableCells.length > 0) {
        tr = doc.createElement('tr');
        for (i = 0; i < aTableCells.length; i++) {
          td = doc.createElement('td');
          if (aTableCells[i] != null) {
            sText = aTableCells[i].toString();
            sText = sText.replace(/([^<&;\s|\/-]{45,50})/g, "$1<br />"); // Chars known to cause FF to break long strings of text to wrap a td cell ('<' to avoid breaking into tags)
            td.innerHTML = sText; // Consider appending pre-created elements?
          }
          tr.appendChild(td);
        }
        if (sClass != null && sClass.length != null && sClass.length > 0) {
          tr.setAttribute('class', sClass);
        }
        tableBody.appendChild(tr);
      }
      return tableBody;
    },

    fnToggleFocusHighlighter: function() {
      let focusInspectorOn=Application.prefs.getValue("extensions.W15yQC.focusHighlighterTurnedOn",false);
      if(focusInspectorOn) {
        Application.prefs.setValue("extensions.W15yQC.focusHighlighterTurnedOn",false);
        blr.W15yQC.fnTurnOffFocusHighlighter();
      } else {
        Application.prefs.setValue("extensions.W15yQC.focusHighlighterTurnedOn",true);
        blr.W15yQC.fnTurnOnFocusHighlighter();
      }
    },
    
    fnTurnOnFocusHighlighter: function() {
      if(blr.W15yQC.pageLoadHandlerForFocusHighlighter==null) {
        blr.W15yQC.pageLoadHandlerForFocusHighlighter=function(e) {blr.W15yQC._onPageLoadInstallFocusHighlighter(e);};
      }
      gBrowser.addEventListener("load", blr.W15yQC.pageLoadHandlerForFocusHighlighter, true);
      blr.W15yQC.fnInstallFocusInspector();
    },

    fnTurnOffFocusHighlighter: function() {
      gBrowser.removeEventListener("load", blr.W15yQC.pageLoadHandlerForFocusHighlighter, true);
      blr.W15yQC.pageLoadHandlerForFocusHighlighter=null;
    },
    
    
    _onPageLoadInstallFocusHighlighter: function(event) {
      // this is the content document of the loaded page.
      let doc = event.originalTarget;
     
      if (doc instanceof HTMLDocument) {
        // is this an inner frame?
        if (doc.defaultView.frameElement) {
          // Frame within a tab was loaded.
          // Find the root document:
          while (doc.defaultView.frameElement) {
            doc = doc.defaultView.frameElement.ownerDocument;
          }
        }
      }
      blr.W15yQC.fnInstallFocusInspector(doc);
    },
    
    fnInstallFocusInspector: function(doc) {
      if(doc==null) {
        doc=window.top.content.document;
      }
      function w15yqcHighlightElementWithFocus(e) {
        try {
          if (typeof w15yqcPrevElWithFocus != 'undefined' && w15yqcPrevElWithFocus != null && w15yqcPrevElWithFocus.style) {
            w15yqcPrevElWithFocus.style.outline = w15yqcOriginalItemStyle;
          }
        } catch(ex)
        {
        }
        
        w15yqcPrevElWithFocus = e.target;

        if(blr.W15yQC.pageLoadHandlerForFocusHighlighter!=null) { // see if still turned on
          var origNode = w15yqcPrevElWithFocus;
          var box = w15yqcPrevElWithFocus.getBoundingClientRect();
          while(box != null && box.width == 0 && box.height==0 && w15yqcPrevElWithFocus.firstChild && w15yqcPrevElWithFocus.firstChild != null) {
            w15yqcPrevElWithFocus = w15yqcPrevElWithFocus.firstChild;
            if(w15yqcPrevElWithFocus.getBoundingClientRect) {
              box = w15yqcPrevElWithFocus.getBoundingClientRect();
            }
          }
          if(box == null || box.width == 0 || box.height==0) {
            w15yqcPrevElWithFocus=origNode;
          }
  
          if (w15yqcPrevElWithFocus != null && w15yqcPrevElWithFocus.style) {
            w15yqcOriginalItemStyle = e.target.ownerDocument.defaultView.getComputedStyle(w15yqcPrevElWithFocus,null).getPropertyValue("outline");
            //w15yqcPrevElWithFocus.style.outline = "solid 2px red";
            w15yqcOriginalItemPosition=e.target.ownerDocument.defaultView.getComputedStyle(w15yqcPrevElWithFocus,null).getPropertyValue("position");
            w15yqcOriginalItemZIndex=e.target.ownerDocument.defaultView.getComputedStyle(w15yqcPrevElWithFocus,null).getPropertyValue("z-index");
            if(w15yqcOriginalItemPosition=="static") {
              //w15yqcPrevElWithFocus.style.position = "relative";
            }
            //w15yqcPrevElWithFocus.style.zIndex = "199999";
            blr.W15yQC.highlightElement(e.target, e.target.ownerDocument);
          }
        }
      }
      
      function w15yqcRemoveFocusIndication(e) {
        if(e != null && e.target && e.target.ownerDocument) {
          blr.W15yQC.resetHighlightElement(e.target.ownerDocument);
        }
        try {
          if (typeof w15yqcPrevElWithFocus != 'undefined' && w15yqcPrevElWithFocus != null && w15yqcPrevElWithFocus.style) {
            //w15yqcPrevElWithFocus.style.outline = w15yqcOriginalItemStyle;
            //w15yqcPrevElWithFocus.style.position = w15yqcOriginalItemPosition;
            //w15yqcPrevElWithFocus.style.zIndex = w15yqcOriginalItemZIndex;
            //w15yqcPrevElWithFocus = null;
          }
        }catch(ex)
        {
        }
      }
      if (doc!=null && doc.addEventListener) {
        var frames = doc.defaultView.frames; // or // var frames = window.parent.frames;
        doc.addEventListener( 'focus', w15yqcHighlightElementWithFocus, true);
        doc.addEventListener( 'blur', w15yqcRemoveFocusIndication, true);
        for (var i = 0; i < doc.defaultView.frames.length; i++) { // QA this on deeply nested frames
          doc.defaultView.frames[i].document.addEventListener( 'focus', w15yqcHighlightElementWithFocus, true);
          doc.defaultView.frames[i].document.addEventListener( 'blur', w15yqcRemoveFocusIndication, true);
        }
      }
    },
    
    setUserLevelBasic: function() {
      blr.W15yQC.userExpertLevel=0;
      Application.prefs.setValue("extensions.W15yQC.userExpertLevel", 0);
      Application.prefs.setValue("extensions.W15yQC.HTMLReport.includeLabelElementsInFormControls", false);
    },
    
    setUserLevelAdvanced: function() {
      blr.W15yQC.userExpertLevel=1;
      Application.prefs.setValue("extensions.W15yQC.userExpertLevel", 1);
      Application.prefs.setValue("extensions.W15yQC.HTMLReport.includeLabelElementsInFormControls", true);
    },
    
    setUserLevelExpert: function() {
      blr.W15yQC.userExpertLevel=2;
      Application.prefs.setValue("extensions.W15yQC.userExpertLevel", 2);
      Application.prefs.setValue("extensions.W15yQC.HTMLReport.includeLabelElementsInFormControls", true);
    },
    
    fnInitMainMenuPopup: function(doc) {
      blr.W15yQC.userExpertLevel=Application.prefs.getValue("extensions.W15yQC.userExpertLevel",0);
      var sLabel=blr.W15yQC.fnGetString('menuLabelUserExpertLevel')+' ';
      switch(blr.W15yQC.userExpertLevel.toString()) {
        case '1':
          sLabel+=blr.W15yQC.fnGetString('menuLabelUELAdvanced');
          break;
        case '2':
          sLabel+=blr.W15yQC.fnGetString('menuLabelUELExpert');
          break;
        case '0':
        default:
          sLabel+=blr.W15yQC.fnGetString('menuLabelUELBasic');
          Application.prefs.setValue("extensions.W15yQC.userExpertLevel", 0);
          break;
      }
      doc.getElementById('W15yQC_menuEntry_omUserLevel').setAttribute('label',sLabel);
    },
    
    fnInitToolsMenuPopup: function(doc) {
      let focusInspectorOn=Application.prefs.getValue("extensions.W15yQC.focusHighlighterTurnedOn",false);
      if(focusInspectorOn) {
        doc.getElementById('W15yQC_menuEntry_focusHighlighter').setAttribute('checked','true');
      } else {
        doc.getElementById('W15yQC_menuEntry_focusHighlighter').removeAttribute('checked');
      }
    },
    
    fnInitToolsToolbarMenuPopup: function(doc) {
      let focusInspectorOn=Application.prefs.getValue("extensions.W15yQC.focusHighlighterTurnedOn",false);
      if(focusInspectorOn) {
        doc.getElementById('W15yQCTBFocusHighlighter').setAttribute('checked','true');
      } else {
        doc.getElementById('W15yQCTBFocusHighlighter').removeAttribute('checked');
      }
    },
    
    fnInitUserLevelMenuPopup: function(doc) {
      blr.W15yQC.userExpertLevel=Application.prefs.getValue("extensions.W15yQC.userExpertLevel",0);
      switch(blr.W15yQC.userExpertLevel.toString()) {
        case '1':
          doc.getElementById('W15yQC_menuEntry_omulAdvanced').setAttribute('checked','true');
          doc.getElementById('W15yQC_menuEntry_omulBasic').removeAttribute('checked');
          doc.getElementById('W15yQC_menuEntry_omulExpert').removeAttribute('checked');
          break;
        case '2':
          doc.getElementById('W15yQC_menuEntry_omulExpert').setAttribute('checked','true');
          doc.getElementById('W15yQC_menuEntry_omulBasic').removeAttribute('checked');
          doc.getElementById('W15yQC_menuEntry_omulAdvanced').removeAttribute('checked');
          break;
        case '0':
        default:
          doc.getElementById('W15yQC_menuEntry_omulBasic').setAttribute('checked','true');
          doc.getElementById('W15yQC_menuEntry_omulAdvanced').removeAttribute('checked');
          doc.getElementById('W15yQC_menuEntry_omulExpert').removeAttribute('checked');
          Application.prefs.setValue("extensions.W15yQC.userExpertLevel", 0);
      }
    },
    
    openDialog: function (sDialogName,firebugObj) {
      var dialogPath = null;
      var dialogID = null;
      
      if(Application.prefs.getValue("extensions.W15yQC.userAgreedToLicense",false)==false) {
        dialogID = 'licenseDialog';
        dialogPath = 'chrome://W15yQC/content/licenseDialog.xul';
        window.openDialog(dialogPath, dialogID, 'chrome,resizable=yes,centerscreen,modal',blr);
      }

      if(Application.prefs.getValue("extensions.W15yQC.userAgreedToLicense",false)==true) {
        switch (sDialogName) {
        case 'accessKeys':
          dialogID = 'accessKeysResultDialog';
          dialogPath = 'chrome://W15yQC/content/accessKeysDialog.xul';
          break;
        case 'ariaLandmarks':
          dialogID = 'ariaLandmarksResultsDialog';
          dialogPath = 'chrome://W15yQC/content/ariaLandmarksDialog.xul';
          break;
        case 'documents':
          dialogID = 'documentsResultsDialog';
          dialogPath = 'chrome://W15yQC/content/documentsDialog.xul';
          break;
        case 'formControls':
          dialogID = 'formControlsResultsDialog';
          dialogPath = 'chrome://W15yQC/content/formControlsDialog.xul';
          break;
        case 'frames':
          dialogID = 'framesResultsDialog';
          dialogPath = 'chrome://W15yQC/content/framesDialog.xul';
          break;
        case 'images':
          dialogID = 'imagesResultsDialog';
          dialogPath = 'chrome://W15yQC/content/imagesDialog.xul';
          break;
        case 'headings':
          dialogID = 'headingsResultsDialog';
          dialogPath = 'chrome://W15yQC/content/headingsDialog.xul';
          break;
        case 'links':
          dialogID = 'linksResultsDialog';
          dialogPath = 'chrome://W15yQC/content/linksDialog.xul';
          break;
        case 'tables':
          dialogID = 'tablesResultsDialog';
          dialogPath = 'chrome://W15yQC/content/tablesDialog.xul';
          break;
        case 'contrast':
          dialogID = 'contrastToolDialog';
          dialogPath = 'chrome://W15yQC/content/contrastDialog.xul';
          break;
        case 'lumCheck':
          dialogID = 'luminosityCheckDialog';
          dialogPath = 'chrome://W15yQC/content/luminosityCheckDialog.xul';
          break;
        case 'idsCheck':
          dialogID = 'badIDResultsDialog';
          dialogPath = 'chrome://W15yQC/content/badIDsDialog.xul';
          break;
        case 'options':
          dialogID = 'optionsDialog';
          dialogPath = 'chrome://W15yQC/content/options.xul';
          break;
        case 'about':
          dialogID = 'aboutDialog';
          dialogPath = 'chrome://W15yQC/content/aboutDialog.xul';
          break;
        }
        if (dialogID != null) { window.openDialog(dialogPath, dialogID, 'chrome,resizable=yes,centerscreen',blr,firebugObj); }
      }
    },

    fnOpenURL: function(url) {
      var win = window.open(url);
      return win.content.document;
    },

    fnGetMaxNodeRectangleDimensions: function(node) {
      if(node != null && node.getClientRects()) {
        var w = 0,
            h = 0,
            i,
            rect,
            rects = node.getClientRects();
        if(rects != null && rects.length>0) {
          for(i=0;i<rects.length;i++) {
            rect = rects[i];
            if(rect.width > w && rect.height > h) {
              w = rect.width;
              h = rect.height;
            }
          }
        }
        return [w, h];
      }
      return null;
    },

    fnMoveToElement: function(node) {
      var err;
      if(node != null && node.hasAttribute && node.nodeType==1) {
        try {
          if(blr.W15yQC.fnNodeIsHidden(node) || blr.W15yQC.fnNodeIsMasked(node)) {
            node.ownerDocument.defaultView.scrollTo(0,0);
          } else {
            node.scrollIntoView(true);
          }
          blr.W15yQC.fnDoEvents();
        } catch(err) {}
      }
    },

    fnMoveFocusToElement: function(node) {
      if(node != null && node.hasAttribute && node.nodeType==1) {
        if(node.hasAttribute('tabindex')) {
          var oldTIValue=node.getAttribute('tabindex');
          node.setAttribute('tabindex',-1);
          node.focus();
          node.setAttribute('tabindex',oldTIValue);
        } else {
          node.setAttribute('tabindex',-1);
          node.focus();
          node.removeAttribute('tabindex');
        }
        node.ownerDocument.defaultView.focus();
      }
    },
    
    fnSetHighlightTimeout: function(doc,id) {
      try{
        blr.W15yQC.highlightTimeoutID.push(setTimeout(function () { doc.getElementById('W15yQCElementHighlight'+id.toString()).style.backgroundColor='transparent'; }, 500));
      } catch(ex) {
      }
    },
    
    highlightElement: function (node, doc, highlightBGColor,idCounter) { // TODO: Improve the MASKED routine to not indicate empty links as MASKED
      // https://developer.mozilla.org/en/DOM/element.getClientRects
      var origNode, div, box, scrollLeft, scrollTop, x, y, w, h, l, t, o, rect, rects, i, bSetTimeouts=false, tagName=null, bEmptyElement=false;
      if(highlightBGColor==null) { highlightBGColor='yellow'; }
      if (doc != null && node != null) {
        if(idCounter==null && Array.isArray( blr.W15yQC.highlightTimeoutID )) {
          bSetTimeouts=true;
          for(i=0;i<blr.W15yQC.highlightTimeoutID.length;i++) {
            blr.W15yQC.fnLog('clearTimeout:'+i.toString()+' '+blr.W15yQC.highlightTimeoutID[i].toString());
            clearTimeout(blr.W15yQC.highlightTimeoutID[i]);
            blr.W15yQC.highlightTimeoutID = [];
          }
        } else {
          blr.W15yQC.highlightTimeoutID = [];
        }
        
        if(idCounter==null) {
          idCounter=0;
          blr.W15yQC.resetHighlightElement(doc);
        }
        
        if(node.tagName) {
          tagName=node.tagName;
          if(tagName!=null) {
            tagName=tagName.toLowerCase();
            if(/^a$/.test(tagName)) {
              if(blr.W15yQC.fnStringHasContent(blr.W15yQC.fnGetDisplayableTextRecursively(node))==false) {
                bEmptyElement=true;
              }
            }
          }
        }
        origNode = node;
        div = null;
        box = node.getBoundingClientRect();
        while(box != null && box.width == 0 && box.height==0 && node.firstChild && node.firstChild != null) {
          node = node.firstChild;
          if(node.getBoundingClientRect) {
            box = node.getBoundingClientRect();
          }
        }
        if(box == null || box.width == 0 || box.height==0) {
          node=origNode;
        }
        scrollLeft = doc.documentElement.scrollLeft || doc.body.scrollLeft;
        scrollTop = doc.documentElement.scrollTop || doc.body.scrollTop;
        
        x = 0;
        y = 0;
        w = 0;
        h = 0;
        if(box != null) {
          x = box.left + scrollLeft;
          y = box.top + scrollTop;
          w = box.width;
          h = box.height;
        }

        l = x;
        t = y;

        o = 0.5;
        if (x < 0 || y < 0) {
          o = 0.9;
          l = 4;
          t = 4;
          w = 'auto';
          h = 'auto';
          div = doc.createElement('div');
          div.appendChild(doc.createTextNode(blr.W15yQC.fnGetString('heOffscreen')));
          div.setAttribute('style', "position:absolute;top:" + t + "px;left:" + l + "px;width:" + w + ";height:" + h + ";background-color:"+highlightBGColor+";outline:3px dashed red;color:black;opacity:" + o + ";padding:0;margin:0;z-index:200000");
          idCounter=idCounter+1;
          div.setAttribute('id', 'W15yQCElementHighlight'+idCounter.toString());
          doc.body.appendChild(div);
          //if(bSetTimeouts) { blr.W15yQC.fnSetHighlightTimeout(doc,idCounter); }
        } else if (w < 2 && h < 2 && w > 0 && h > 0 && bEmptyElement==false) {
          o = 0.9;
          //l = 4;
          //t = 4;
          w = 'auto';
          h = 'auto';
          div = doc.createElement('div');
          div.appendChild(doc.createTextNode(blr.W15yQC.fnGetString('heMasked')));
          div.setAttribute('style', "position:absolute;top:" + t + "px;left:" + l + "px;width:" + w + ";height:" + h + ";background-color:"+highlightBGColor+";outline:3px dashed red;color:black;opacity:" + o + ";padding:0;margin:0;z-index:200000");
          idCounter=idCounter+1;
          div.setAttribute('id', 'W15yQCElementHighlight'+idCounter.toString());
          doc.body.appendChild(div);
          //if(bSetTimeouts) { blr.W15yQC.fnSetHighlightTimeout(doc,idCounter); }
        } else {
          rects = node.getClientRects();
          if(rects != null && rects.length>1) {
            for(i=0;i<rects.length;i++) {
              rect = rects[i];
              x = rect.left + scrollLeft;
              y = rect.top + scrollTop;
              w = rect.width;
              h = rect.height;
              if(x>=0 && y>=0 && w>0 && h>0) {
                if(w>2) { w=w-2; }
                if(h>2) { h=h-2; }
                w = w + 'px';
                h = h + 'px';
                div = doc.createElement('div');
                div.setAttribute('style', "position:absolute;top:" + y + "px;left:" + x + "px;width:" + w + ";height:" + h + ";background-color:"+highlightBGColor+";outline:3px dashed red;color:black;opacity:" + o + ";padding:0;margin:0;z-index:200000");
                idCounter=idCounter+1;
                div.setAttribute('id', 'W15yQCElementHighlight'+idCounter.toString());
                doc.body.appendChild(div);
                if(bSetTimeouts) { blr.W15yQC.fnSetHighlightTimeout(doc,idCounter); }
              }
            }
          } else {
            div = doc.createElement('div');
            if(w<2 && h<2 && bEmptyElement==true) {
              div.appendChild(doc.createTextNode(blr.W15yQC.fnGetString('heEmpty')));
              w = 'auto';
              h = 'auto';
            } else {
              w = Math.max(w,6) + 'px';
              h = Math.max(h,6) + 'px';
            }
            div.setAttribute('style', "position:absolute;top:" + t + "px;left:" + l + "px;width:" + w + ";height:" + h + ";background-color:"+highlightBGColor+";outline:3px dashed red;color:black;opacity:" + o + ";padding:0;margin:0;z-index:200000");
            div.setAttribute('onmouseover','this.style.zIndex="-50000";');
            //div.setAttribute('onmouseout','this.style.zIndex="200000";');
            idCounter=idCounter+1;
            div.setAttribute('id', 'W15yQCElementHighlight'+idCounter.toString());
            doc.body.appendChild(div);
            if(bSetTimeouts) { blr.W15yQC.fnSetHighlightTimeout(doc,idCounter); }
          }
        }

      }
      return idCounter;
    },

    fnResetHighlights: function(aDocumentsList) {
      var i;
      if(aDocumentsList!=null && aDocumentsList.length>0) {
        for(i=0;i<aDocumentsList.length;i++) blr.W15yQC.resetHighlightElement(aDocumentsList[i].doc);
        for(i=0;i<aDocumentsList.length;i++) blr.W15yQC.resetHighlightElement(aDocumentsList[i].doc);
      }
    },

    resetHighlightElement: function (doc) {
      var he=null, idCounter, failureCount;
      if (doc != null && doc.getElementById) {
        try {
          he = doc.getElementById('W15yQCElementHighlight');
          if (he != null && he.parentNode != null && he.parentNode.removeChild) { he.parentNode.removeChild(he); }
        } catch(err) {}
        idCounter = 0;
        failureCount = 0;
        do {
          idCounter++;
          try{
            he = doc.getElementById('W15yQCElementHighlight'+idCounter.toString());
            if (he != null && he.parentNode != null) {
              he.parentNode.removeChild(he);
            } else {
              failureCount++;
            }
          } catch(err) {
            failureCount++;
          }
        } while(failureCount<5);
      }
    },

    fnRemoveWWWAndEndingSlash: function(sUrl) {
      sUrl = sUrl.replace(/:\/\/www\./i, '://');
      sUrl = sUrl.replace(/[\/\\]$/, '');
      return sUrl;
    },

    fnNormalizeURL: function(docURL, sUrl) {
      var firstPart;
      if(docURL != null && sUrl != null && sUrl.length>0) {
        docURL = blr.W15yQC.fnTrim(docURL);
        sUrl = blr.W15yQC.fnTrim(sUrl);
        if(sUrl.slice(0,2) == '//') { // TODO: This needs QA'd
          firstPart = docURL.match(/^([a-z-]+:)\/\//);
            if(firstPart != null) {
              sUrl=firstPart[1]+sUrl;
            }
        }
        if ( sUrl.match(/^[a-z-]+:\/\//) == null ) {
          firstPart = docURL.match(/^(file:\/\/)([^?]*[\/\\])?/);
          if(firstPart != null) {
            sUrl = firstPart[1]+firstPart[2]+sUrl;
          } else {
            firstPart = docURL.match(/^([a-z-]+:\/\/)([^\/\\]+[^\/\\])([^?]*[\/\\])?/);
            if(firstPart != null) {
              if(sUrl.match(/^[\/\\]/) != null) {
                sUrl = firstPart[1]+firstPart[2]+sUrl;
              } else {
                sUrl = firstPart[1]+firstPart[2]+firstPart[3]+sUrl;
              }
            }
          }
        }
      }
      if(sUrl != null) { sUrl = sUrl.replace(/\s/g,'%20'); }
      return sUrl;
    },

    fnURLsAreEqual: function (docURL1, url1, docURL2, url2) {
      if(url1 != null) { url1 = blr.W15yQC.fnRemoveWWWAndEndingSlash(blr.W15yQC.fnNormalizeURL(docURL1, url1)); }
      if(url2 != null) { url2 = blr.W15yQC.fnRemoveWWWAndEndingSlash(blr.W15yQC.fnNormalizeURL(docURL2, url2)); }
      return (url1 == url2);
    },

    fnLinkTextsAreDifferent: function(s1, s2) {
      if(s1 == s2) { return false; }
      if(s1 != null) { s1 = blr.W15yQC.fnCleanSpaces(s1).toLowerCase(); }
      if(s2 != null) { s2 = blr.W15yQC.fnCleanSpaces(s2).toLowerCase(); }
      return (s1 != s2);
    },

    fnScriptValuesAreDifferent: function(s1,s2) {
      // TODO: Make this more advanced!
      if(s1 == s2) { return false; }
      if(s1 != null) { s1 = blr.W15yQC.fnTrim(s1); }
      if(s2 != null) { s2 = blr.W15yQC.fnTrim(s2); }
      if(s1 == s2 && s1.match(/\bthis\b/) == false) {
        return false;
      } 
      return true;
    },

    fnSpellOutNumbers: function (sString) {
      var re, matches;
      if (sString != null && sString.length && sString.length > 0) {
        re = /(\$\s*)?\d*\.?\d+/g;
        matches = re.exec(sString);
        while (matches != null) {
          sString = sString.replace(matches[0], ' ' + blr.W15yQC.fnSpellOutNumber(matches[0]) + ' ');
          matches = re.exec(sString);
        }
        sString = blr.W15yQC.fnCleanSpaces(sString);
      }
      return sString;
    },

    fnSpellOutNumber: function (sString) {
      var sResult = '',
          bCurrency = false,
          sWholePart = '',
          sWholePartResult = '',
          sDecimalPart = '',
          sDecimalPartResult = '',
          sMagnitude = [" ", " Thousand ", " Million ", " Billion ", " Trillion "],
          iMagnitude,
          sThisPart;

      blr.W15yQC.fnLog('fnSpellOutNumber IN:'+sString);
      sString = blr.W15yQC.fnTrim(sString);
      sString = sString.replace(/\$\s+/, '$');
      if (sString != null && sString.length && sString.length > 0) {
        if (sString.indexOf('$') >= 0) {
          bCurrency = true;
          sString = sString.substring(sString.indexOf('$') + 1);
        }
        if (sString.indexOf('.') >= 0) {
          sDecimalPart = blr.W15yQC.fnTrim(sString.substring(sString.indexOf('.') + 1));
          sWholePart = blr.W15yQC.fnTrim(sString.substring(0, sString.indexOf('.')));
        } else {
          sWholePart = sString;
        }

        if (sWholePart.length < 16) {
          iMagnitude = 0;
          if (sWholePart == '0') {
            sWholePartResult = "Zero";
          } else {
            while (sWholePart.length > 0) {
              sThisPart = '00' + sWholePart;
              sThisPart = sThisPart.substring(sThisPart.length - 3);
              sWholePartResult = blr.W15yQC.fnSpellOutHundreds(sThisPart) + sMagnitude[iMagnitude] + " " + sWholePartResult;
              iMagnitude += 1;
              if (sWholePart.length > 3) {
                sWholePart = sWholePart.substring(0, sWholePart.length - 3);
              } else {
                sWholePart = '';
              }
            }
          }
        } else {
          while (sWholePart.length > 0) {
            sWholePartResult = sWholePartResult + " " + blr.W15yQC.fnSpellOutDigitWZero(sWholePart[0]);
            sWholePart = sWholePart.substring(1);
          }
        }
        if (bCurrency == true && sWholePartResult.length > 0 && sDecimalPart.length == 2) {
          sDecimalPartResult = blr.W15yQC.fnSpellOutTens(sDecimalPart);
          sResult = sWholePartResult + " dollars and " + sDecimalPartResult + " cents";
        } else {
          while (sDecimalPart.length > 0) {
            sDecimalPartResult = sDecimalPartResult + " " + blr.W15yQC.fnSpellOutDigitWZero(sDecimalPart[0]);
            sDecimalPart = sDecimalPart.substring(1);
          }
          sResult = sWholePartResult;
          if (sDecimalPartResult.length > 0) { sResult += " point " + sDecimalPartResult; }
          if (bCurrency == true) { sResult += " dollars"; }
        }
      }
      blr.W15yQC.fnLog('fnSpellOutNumber OUT:'+sResult);

      return blr.W15yQC.fnCleanSpaces(sResult);
    },
    
    fnSpellOutHundreds: function (sString) {
      var sResult = '';
      if (sString != null) {
        sString = "000" + sString;
        sString = sString.substring(sString.length - 3);
        if (sString[0] != '0') {
          sResult = blr.W15yQC.fnSpellOutDigit(sString[0]) + " hundred ";
        }
        if (sString[1] != '0') {
          sResult += blr.W15yQC.fnSpellOutTens(sString.substring(1));
        } else if (sString[2] != 0) {
          sResult += blr.W15yQC.fnSpellOutDigit(sString[2]);
        }
      }
      return sResult;
    },
    
    fnSpellOutTens: function (sString) {
      var sTensDigit, sResult = '';
      if (sString != null && sString.length && sString.length > 1) {
        if (sString.length > 2) { sString = sString.substring(sString.length - 2); }
        sTensDigit = sString[0];
        if (sTensDigit == '0') {
          return blr.W15yQC.fnSpellOutDigit(sString[1]);
        } else if (sTensDigit == '1') {
          switch (sString) {
          case '10':
            return "Ten";
          case '11':
            return "Eleven";
          case '12':
            return "Twelve";
          case '13':
            return "Thirteen";
          case '14':
            return "Fourteen";
          case '15':
            return "Fifteen";
          case '16':
            return "Sixteen";
          case '17':
            return "Seventeen";
          case '18':
            return "Eighteen";
          case '19':
            return "Nineteen";
          }
          return '';
        } else {
          switch (sTensDigit) {
          case '2':
            sResult = "Twenty ";
            break;
          case '3':
            sResult = "Thirty ";
            break;
          case '4':
            sResult = "Forty ";
            break;
          case '5':
            sResult = "Fifty ";
            break;
          case '6':
            sResult = "Sixty ";
            break;
          case '7':
            sResult = "Seventy ";
            break;
          case '8':
            sResult = "Eighty ";
            break;
          case '9':
            sResult = "Ninety ";
            break;
          }
          return sResult + blr.W15yQC.fnSpellOutDigit(sString[1]);
        }
      }
      return '';
    },

    fnSpellOutDigitWZero: function (sString) {
      if (sString != null && sString.length && sString.length > 0 && sString[0] == '0') { return "Zero"; }
      return blr.W15yQC.fnSpellOutDigit(sString);
    },

    fnSpellOutDigit: function (sString) {
      if (sString != null) {
        if (sString.length && sString.length > 1) { sString = sString[sString.length - 1]; }
        switch (sString) {
        case '1':
          return "One";
        case '2':
          return "Two";
        case '3':
          return "Three";
        case '4':
          return "Four";
        case '5':
          return "Five";
        case '6':
          return "Six";
        case '7':
          return "Seven";
        case '8':
          return "Eight";
        case '9':
          return "Nine";
        }
      }
      return '';
    },

    fnSoundEx: function (WordString, LengthOption, CensusOption) { // http://creativyst.com/Doc/Articles/SoundEx1/SoundEx1.htm#JavaScriptCode
      var TmpStr,
          WordStr = "",
          CurChar,
          LastChar,
          SoundExLen = 10,
          WSLen,
          FirstLetter,
          i;

      if (CensusOption) {
        LengthOption = 4;
      }

      if (LengthOption != undefined) {
        SoundExLen = LengthOption;
      }
      if (SoundExLen > 10) {
        SoundExLen = 10;
      }
      if (SoundExLen < 4) {
        SoundExLen = 4;
      }

      if (WordString == null || WordString.length<1) {
        return ("");
      }

    if(blr.W15yQC.homophones.hasOwnProperty(WordString.toLowerCase())) {
      WordString = blr.W15yQC.homophones[WordString.toLowerCase()];
    }

      WordString = WordString.toUpperCase();

      /* Clean and tidy
       */
      WordStr = WordString;

      WordStr = WordStr.replace(/[^A-Z]/gi, " "); // rpl non-chars w space
      WordStr = WordStr.replace(/^\s*/g, ""); // remove leading space
      WordStr = WordStr.replace(/\s*$/g, ""); // remove trailing space
      if (!CensusOption) {
        /* Some of our own improvements
         */
        WordStr = WordStr.replace(/DG/g, "G"); // Change DG to G
        WordStr = WordStr.replace(/GH/g, "H"); // Change GH to H
        WordStr = WordStr.replace(/GN/g, "N"); // Change GN to N
        WordStr = WordStr.replace(/KN/g, "N"); // Change KN to N
        WordStr = WordStr.replace(/PH/g, "F"); // Change PH to F
        WordStr = WordStr.replace(/MP([STZ])/g, "M$1"); // MP if fllwd by ST|Z
        WordStr = WordStr.replace(/^PS/g, "S"); // Chng leadng PS to S
        WordStr = WordStr.replace(/^PF/g, "F"); // Chng leadng PF to F
        WordStr = WordStr.replace(/MB/g, "M"); // Chng MB to M
        WordStr = WordStr.replace(/TCH/g, "CH"); // Chng TCH to CH
      }


      /* The above improvements
       * may change this first letter
       */
      FirstLetter = WordStr.substr(0, 1);


      /* in case 1st letter is
       * an H or W and we're in
       * CensusOption = 1
       */
      if (FirstLetter == "H" || FirstLetter == "W") {
        TmpStr = WordStr.substr(1);
        WordStr = "-";
        WordStr += TmpStr;
      }

      /* In properly done census
       * SoundEx the H and W will
       * be squezed out before
       * performing the test
       * for adjacent digits
       * (this differs from how
       * 'real' vowels are handled)
       */
      if (CensusOption == 1) {
        WordStr = WordStr.replace(/[HW]/g, ".");
      }


      /* Begin Classic SoundEx
       */
      WordStr = WordStr.replace(/[AEIOUYHW]/g, "0");
      WordStr = WordStr.replace(/[BPFV]/g, "1");
      WordStr = WordStr.replace(/[CSGJKQXZ]/g, "2");
      WordStr = WordStr.replace(/[DT]/g, "3");
      WordStr = WordStr.replace(/[L]/g, "4");
      WordStr = WordStr.replace(/[MN]/g, "5");
      WordStr = WordStr.replace(/[R]/g, "6");

      /* Properly done census:
       * squeze H and W out
       * before doing adjacent
       * digit removal.
       */
      if (CensusOption == 1) {
        WordStr = WordStr.replace(/\./g, "");
      }

      /* Remove extra equal adjacent digits
       */
      WSLen = WordStr.length;
      LastChar = "";
      TmpStr = "";
      // removed v10c djr:  TmpStr = "-";  /* rplcng skipped first char */
      for (i = 0; i < WSLen; i++) {
        CurChar = WordStr.charAt(i);
        if (CurChar == LastChar) {
          TmpStr += " ";
        } else {
          TmpStr += CurChar;
          LastChar = CurChar;
        }
      }
      WordStr = TmpStr;


      WordStr = WordStr.substr(1); /* Drop first letter code   */
      WordStr = WordStr.replace(/\s/g, ""); /* remove spaces            */
      WordStr = WordStr.replace(/0/g, ""); /* remove zeros             */
      WordStr += "0000000000"; /* pad with zeros on right  */

      WordStr = FirstLetter + WordStr; /* Add first letter of word */

      WordStr = WordStr.substr(0, SoundExLen); /* size to taste     */

      return (WordStr);
    },


    fnGetSoundExTokens: function (sText) {
      var i, tokens, sTokens = '';
      if (sText != null && sText.length && sText.length > 0) {
        sText = blr.W15yQC.fnSpellOutNumbers(sText);
        sText = sText.replace(/[^a-zA-Z]/g, ' ');
        sText = blr.W15yQC.fnCleanSpaces(sText);
        sText = sText.replace(/\balot\b/i,'a lot');
        sText = sText.replace(/\bawhile\b/i,'a while');
        tokens = sText.split(' ');
        for (i = 0; i < tokens.length; i++) {
          sTokens += blr.W15yQC.fnSoundEx(tokens[i]) + ' ';
        }
      }
      blr.W15yQC.fnLog("SoundEX:IN:" + sText);
      blr.W15yQC.fnLog("SoundEX:OUT:" + sTokens);
      return blr.W15yQC.fnCleanSpaces(sTokens);
    },

    fnOnlyASCIISymbolsWithNoLettersOrDigits: function (sText) {
      if (sText && sText.length && sText.length > 0) {
        if(blr.W15yQC.bEnglishLocale==true) {
          sText = sText.replace(/[^a-zA-Z0-9���؁�斃���獾���������镊�����������쐛������]+/g, '');
          if (sText.length > 0) {
            return false;
          } 
          return true;
        } else { // TODO: Improve this by checking for unicode characters in common languages
          sText = sText.replace(/[~`!@#$%^&*\(\)-_+=\[{\]}\\\|;:'",<\.>\/\?\s���ª���ש��������������]+/g, '');
          if (sText.length > 0) {
            return false;
          }
          return true;
        }
      }
      return false;
    },

    fnNodeHasPresentationRole: function (node) {
      if (node && node.hasAttribute && node.hasAttribute('role')==true && node.getAttribute('role').toLowerCase()=='presentation') {
        return true;
      }
      return false;
    },

    fnIsValidHtmlID: function (sID) {
      if(sID != null && sID.length) {
        sID = blr.W15yQC.fnTrim(sID);
        if(/^[a-z][a-z0-9:\._-]*$/i.test(sID)) {
          return true;
        }
      }
      return false;
    },
    
    fnWhyInvalidID: function(sID) {
      var sMsg=null, sMsg1=null, sMsg2=null, sMsg3=null;
      sID = blr.W15yQC.fnTrim(sID);
      if(sID==null || blr.W15yQC.fnStringHasContent(sID)) {
        if(/^[a-z]/i.test(sID)==false){
          sMsg1='begin with a letter [a-z]';
        }
        if(/\s/.test(sID)) {
          sMsg2='not contain spaces'
        }
        sID=sID.replace(/^[a-z0-9\s:\._-]/ig,'');
        if(sID.length>0) {
          sMsg3="not contain the characters:'"+sID+"'";
        }
      }
      if(sMsg1!=null || sMsg2!=null || sMsg3!=null) {
        sMsg='Should ';
        if(sMsg1!=null) sMsg=sMsg+sMsg1;
        if(sMsg2!=null && sMsg3!=null) {
          if(sMsg1!=null) {
            sMsg=sMsg+', '+sMsg2+', and '+sMsg3;
          } else {
            sMsg=sMsg+sMsg2+' and '+sMsg3;
          }
        } else {
          sMsg=sMsg+' and ';
          if(sMsg2!=null) sMsg=sMsg+sMsg2;
          if(sMsg3!=null) sMsg=sMsg+sMsg3;
        }
      }
    },
    
    fnIsValidHtmlIDList: function (sIDs) {
      if(sIDs != null && sIDs.length) {
        sIDs = blr.W15yQC.fnCleanSpaces(sIDs);
        if(/^[a-z][a-z0-9:\._-]*( [a-z][a-z0-9:\._-]*)*$/i.test(sIDs)) {
          return true;
        }
      }
      return false;
    },
    
    fnListMissingIDs: function (doc, sIDs) {
      var sMissingIDs = null;
      if(doc!=null && sIDs != null && sIDs.length) {
        aIDs = sIDs.split(' ');
        if (aIDs != null) {
          for (i = 0; i < aIDs.length; i++) {
            if (doc.getElementById(aIDs[i]) == null) { sMissingIDs = blr.W15yQC.fnJoin(sMissingIDs, aIDs[i], ', '); }
          }
        }
      }
      return sMissingIDs;
    },

    fnIsMeaningfulLinkText: function(sText, minLength) {
      if (minLength == null) { minLength = 3; } // TODO: Make this a pref parameter
      if(sText != null && sText.toLowerCase) {
        if(blr.W15yQC.bEnglishLocale) { sText = sText.replace(/[^a-zA-Z0-9\s]/g, ' '); }
        sText = blr.W15yQC.fnCleanSpaces(sText).toLowerCase();
        // Meaningful but short word exceptions:
        if(sText == 'go' || sText == 'ok' || sText == 'faq' || sText == 'map' | sText=='iu') { return true; }

        if (sText && sText.length && sText.length >= minLength && sText.toLowerCase) {
          if (blr.W15yQC.fnOnlyASCIISymbolsWithNoLettersOrDigits(sText)) { return false; }
          switch (sText.toLowerCase()) {
          case 'click':
          case 'click here':
          case 'clicking here':
          case 'click here for more':
          case 'click here to find out more':
          case 'click this':
          case 'click this for more':
          case 'click this to find out more':
          case 'even more':
          case 'here':
          case 'more':
          case 'read':
          case 'read this':
          case 'read more':
          case 'reading more':
          case 'read more here':
          case 'see':
          case 'see here':
          case 'see all':
          case 'seehere':
          case 'touch':
          case 'touch here':
          case 'press here':
          case 'tap':
          case 'tap here':
          case 'this':
          case 'x':
            return false;
          }
          if(!blr.W15yQC.fnOnlyASCIISymbolsWithNoLettersOrDigits(sText)) { return true; }
        }
      }
      return false;
    },

    fnIsMeaningfulHeadingText: function(sText, minLength) {
      if (minLength == null) { minLength = 3; } // TODO: Make this a pref parameter
      if(sText != null && sText.toLowerCase) {
        if(blr.W15yQC.bEnglishLocale) { sText = sText.replace(/[^a-zA-Z0-9\s]/g, ' '); }
        sText = blr.W15yQC.fnCleanSpaces(sText).toLowerCase();
        // Meaningful but short word exceptions:
        if(sText == 'go' || sText == 'faq' || sText == 'map') { return true; }

        if (sText && sText.length && sText.length >= minLength && sText.toLowerCase) {
          if (!blr.W15yQC.fnOnlyASCIISymbolsWithNoLettersOrDigits(sText)) { return true; }
        }
      }
      return false;
    },

    fnIsMeaningfulDocTitleText: function(sText, minLength) {
      if (minLength == null) { minLength = 3; } // TODO: What should the minimum doc title be?
      if(sText != null && sText.toLowerCase) {
        if(blr.W15yQC.bEnglishLocale) { sText = sText.replace(/[^a-zA-Z0-9\s]/g, ' '); }
        sText = blr.W15yQC.fnCleanSpaces(sText).toLowerCase();

        if (sText && sText.length && sText.length >= minLength && sText.toLowerCase) {
          if (blr.W15yQC.fnOnlyASCIISymbolsWithNoLettersOrDigits(sText)) { return false; }
          switch (sText.toLowerCase()) {
          case 'home':
          case 'home page':
          case 'homepage':
            return false;
          }
          if (!blr.W15yQC.fnOnlyASCIISymbolsWithNoLettersOrDigits(sText)) { return true; }
        }
      }
      return false;
    },

    fnIsMeaningfulFormLabelText: function(sText, minLength) {
      if (minLength == null) { minLength = 3; } // TODO: Make this a pref parameter
      if(sText != null && sText.toLowerCase) {
        if(blr.W15yQC.bEnglishLocale) { sText = sText.replace(/[^a-zA-Z0-9\s]/g, ' '); }
        sText = blr.W15yQC.fnCleanSpaces(sText).toLowerCase();
        // Meaningful but short word exceptions:
        if(sText == 'go' || sText == 'ok') { return true; }

        if (sText && sText.length && sText.length >= minLength && sText.toLowerCase) {
          if (blr.W15yQC.fnOnlyASCIISymbolsWithNoLettersOrDigits(sText)) { return false; }
          switch (sText.toLowerCase()) {
          case 'click':
          case 'click here':
          case 'clicking here':
          case 'click here for more':
          case 'click here to find out more':
          case 'even more':
          case 'here':
          case 'more':
          case 'read':
          case 'read more':
          case 'reading more':
          case 'read more here':
          case 'see':
          case 'see here':
          case 'seehere':
          case 'touch':
          case 'tap':
          case 'press':
          case 'touch here':
          case 'press here':
          case 'tap here':
          case 'x':
          case 'no':
          case 'yes':
            return false;
          }
          if (!blr.W15yQC.fnOnlyASCIISymbolsWithNoLettersOrDigits(sText)) { return true; }
        }
      }
      return false;
    },

    fnAppearsToBeDefaultTableSummaryOrCaption: function (sText) { // TODO: QA This
      sText = blr.W15yQC.fnCleanSpaces(sText.replace(/[^a-zA-Z\s]/g, ' ')); // Strip punctuation
      if (sText != null && sText.match(/^\s*((tabe?le?)? ?(captions?)? ?(sum?ma?re?y)?|{{{.*}}}|alt(ernat[ei](ve)?)? ?te?xt|photo(graph)?|pic|picture|video title|image|img|img te?xt|article ima?ge?|title|icon)\s*$/i)) {
        return true;
      }
      return false;
    },

    fnAppearsToBeSummaryOrCaptionOnLayoutTable: function (sText) { // TODO: QA This
      sText = blr.W15yQC.fnCleanSpaces(sText.replace(/[^a-zA-Z\s]/g, ' ')); // Strip punctuation
      if (sText != null && sText.match(/^\s*(layout\b.*|[a-z]+\s+contents?|search|navigation|.*\btoolbar|content(\s+area(\scontrols?)?)?|(tabe?le?)?\s*(for)?\s*[a-z]*\s*layout\b.*|([a-z]+\s+)?ban+[eao]r|home|ad|ad row|ad table)\s*$/i)) {
        return true;
      }
      return false;
    },

    fnIsMeaningfulTableSummaryOrCaption: function (sText, minLength) { // TODO: Where is this used? Should it be a specific instance?
      if (minLength == null) { minLength = 3; } // TODO: Make this a pref parameter
      if(sText != null && sText.toLowerCase) {
        if(blr.W15yQC.bEnglishLocale) { sText = sText.replace(/[^a-zA-Z0-9\s]/g, ' '); } // TODO: Handle accented characters
        sText = blr.W15yQC.fnCleanSpaces(sText).toLowerCase();

        if (sText && sText.length && sText.length >= minLength && sText.toLowerCase) {
          if (blr.W15yQC.fnOnlyASCIISymbolsWithNoLettersOrDigits(sText)) { return false; }
          if (blr.W15yQC.fnAppearsToBeJunkText(sText)) { return false; }
          if (blr.W15yQC.fnAppearsToBeDefaultTableSummaryOrCaption(sText)) { return false; }
          switch (sText.toLowerCase()) {
          case 'table':
            return false;
          }
          if (!blr.W15yQC.fnOnlyASCIISymbolsWithNoLettersOrDigits(sText)) { return true; }
        }
      }
      return false;
    },

    fnIsMeaningfulText: function (sText, minLength) { // TODO: Where is this used? Should it be a specific instance?
      if (minLength == null) { minLength = 3; } // TODO: Make this a pref parameter
      if(sText != null && sText.toLowerCase) {
        if(blr.W15yQC.bEnglishLocale) { sText = sText.replace(/[^a-zA-Z0-9\s]/g, ' '); }
        sText = blr.W15yQC.fnCleanSpaces(sText).toLowerCase();
        // Meaningful but short word exceptions:
        if(sText == 'go' || sText == 'faq' || sText == 'map') { return true; }

        if (sText && sText.length && sText.length >= minLength && sText.toLowerCase) {
          if (blr.W15yQC.fnOnlyASCIISymbolsWithNoLettersOrDigits(sText)) { return false; }
          switch (sText.toLowerCase()) {
          case 'click':
          case 'click here':
          case 'click here for more':
          case 'click here to find out more':
          case 'even more':
          case 'here':
          case 'more':
          case 'read':
          case 'read more':
          case 'read more here':
          case 'see':
          case 'see here':
          case 'seehere':
          case 'touch':
          case 'press':
          case 'tap':
          case 'touch here':
          case 'press here':
          case 'tap here':
          case 'x':
            return false;
          }
          if (!blr.W15yQC.fnOnlyASCIISymbolsWithNoLettersOrDigits(sText)) { return true; }
        }
      }
      return false;
    },

    fnCanTagHaveAlt: function (tagname) {
      switch (tagname.toLowerCase()) {
      case 'img':
      case 'area':
      case 'applet':
      case 'input':
        return true;
      }
      return false;
    },

    fnAppearsToBeJunkText: function (sText) {
      // From wikipedia: A computer study of over a million samples of
      // normal English prose found that the longest word one is likely to
      // encounter on an everyday basis is uncharacteristically, at 20 letters.
      //
      // GUIDs are typically 32 characters
      // This will match anything that has 22 or more consecutive characters without whitespace
      sText = blr.W15yQC.fnCleanSpaces(sText);
      if (sText != null && sText.match(/[^\s]{22,23}/)) {
        return true;
      }
      return false;
    },

    fnAppearsToBeImageFileName: function (sText) { // TODO: QA THIS
      if (sText != null && (sText.match(/.\.(apng|bmp|gif|ico|jbig|jpg|jng|jpeg|mng|pcx|png|svg|tif|tiff)\s*$/i) ||
                            sText.match(/\w_img$/i) || sText.match(/^(img|ico)_\w/i) || sText.match(/^DCSIMG/i))) {
        return true;
      }
      return false;
    },

    // http://regexlib.com/REDetails.aspx?regexp_id=96
    fnAppearsToBeURL: function (sText) { // TODO: QA THIS!!!
      if (sText != null && sText.match(/(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:\/~\+#]*[\w\-\@?^=%&amp;\/~\+#])?/i)) {
        return true;
      }
      return false;
    },

    fnAppearsToBeValidLongdesc: function(sText) {
      // Should be a text based href value
      if(sText != null && sText.match && sText.length && sText.length>0) {
        if(sText != null && sText.match(/^((http|ftp|https):\/\/[\w\-]+(\.[\w\-]+)+(:\d+)?([\\\/]~)?)?[\w\-\.,@^=%&\\\/]+\.([xs]?html?|php|asp|txt)([#\?].*)?\s*$/i) != null) {
          return true;
        }
      }
      return false;
    },

    fnAppearsToBeDefaultAltText: function (sText) {
      // Strip punctuation
      sText = blr.W15yQC.fnCleanSpaces(sText.replace(/[^a-zA-Z\s]/g, ' '));
      if (sText != null && sText.match(/^\s*(thumb(nail)?|alt(ernat[ei](ve)?)? te?xt|photo|pic|picture|{{{[a-z_ ]+}}}|video title|image|img|img te?xt|article ima?ge?|title|icon|show name)\s*$/i)) {
        return true;
      }
      return false;
    },

    fnAltTextAppearsIfItShouldBeEmpty: function (sText) {
      if (sText != null && sText.match(/^\s*(none|blank|decorative\s*(ima?ge?|photo|pic\w*)?)\s*$/i)) {
        return true;
      }
      return false;
    },

    fnAltTextAppearsIfItShouldBeEmptyCauseItIsASpacer: function (sText) {
      if (sText != null && sText.match(/\b(spacer([\. ](gif|jpg|ima?ge?|pic).*))\s*$/i)) {
        return true;
      }
      return false;
    },

    fnAltTextAppearsToHaveRedundantImageReferenceInIt: function (sText) {
      if(sText != null && (sText.match(/^\s*(graphic|image|img|photo|picture|pic|pict)\s*of\s/i) ||
                           sText.match(/\b(graphic|image|img|photo|picture|pic|pict)[^a-zA-Z]*$/i))) {
        return true;
      }
      return false;
    },

    fnIsMeaningfulAltTextTest: function (sText, no) {
      sText = blr.W15yQC.fnCleanSpaces(sText);
      if (sText == null || sText == '') {
        blr.W15yQC.fnAddNote(no, 'imgNoAltText'); // QA imageTests01.html
        return no;
      }
      if (blr.W15yQC.fnAltTextAppearsIfItShouldBeEmptyCauseItIsASpacer(sText)) { // QA File imageTests01.html
        blr.W15yQC.fnAddNote(no, 'imgSpacerShouldHaveEmptyAltTxt'); // QA imageTests01.html
        return no;
      }
      if (blr.W15yQC.fnAppearsToBeImageFileName(sText)) { // QA File imageTests01.html
        blr.W15yQC.fnAddNote(no, 'imgAltTxtIsFileName'); // QA imageTests01.html
        return no;
      }
      if (blr.W15yQC.fnAppearsToBeURL(sText)) { // QA File imageTests01.html
        blr.W15yQC.fnAddNote(no, 'imgAltTxtIsURL'); // QA imageTests01.html
        return no;
      }
      if (blr.W15yQC.fnAppearsToBeJunkText(sText)) { // QA File imageTests01.html
        blr.W15yQC.fnAddNote(no, 'imgAltTxtIsJunk'); // QA imageTests01.html
        return no;
      }
      if (blr.W15yQC.fnAppearsToBeDefaultAltText(sText)) { // QA File imageTests01.html
        blr.W15yQC.fnAddNote(no, 'imgAltTxtIsDefault'); // QA imageTests01.html
        return no;
      }
      if (blr.W15yQC.fnAltTextAppearsIfItShouldBeEmpty(sText)) { // QA File imageTests01.html
        blr.W15yQC.fnAddNote(no, 'imgAltTxtIsDecorative'); // QA imageTests01.html
        return no;
      }
      if (blr.W15yQC.fnAltTextAppearsToHaveRedundantImageReferenceInIt(sText)) { // QA File imageTests01.html
        blr.W15yQC.fnAddNote(no, 'imgAltTxtIncludesImageTxt'); // QA imageTests01.html
        return no;
      }

      return no;
    },

    fnIsOnlyNextOrPreviousText: function (str) { // TODO: What about other languages?
      if(str != null && str.replace) {
        if(blr.W15yQC.bEnglishLocale) { str=str.replace(/[^a-z0-9\s]/ig,' '); }
        str = blr.W15yQC.fnCleanSpaces(str);
        if(str.match(/^(next|prev|previous)$/i)) { return true; }
      }
      return false;
    },

    fnNodeIsHidden: function (node) { // TODO: Improve and QA This!, USE THE NODE's WINDOW
      //returns true if element should be invisible to screen-readers.
      if(blr.W15yQC.bIncludeHidden) { return false; }
      if (node != null) {
        if (node.tagName.toLowerCase() == 'input' && node.hasAttribute('type') && node.getAttribute('type').toLowerCase() == 'hidden') {
          return true;
        }
        if(node.hasAttribute('hidden') && (node.getAttribute('hidden')=='hidden' || node.getAttribute('hidden')=='')) { // For now, strict interpretation
          return true;
        }
        while (node != null && node.nodeType==1 && node.nodeName.toLowerCase() != 'body' && node.nodeName.toLowerCase() != 'frameset' &&
               window.getComputedStyle(node, null).getPropertyValue("display").toLowerCase() != 'none' &&
               window.getComputedStyle(node, null).getPropertyValue("visibility").toLowerCase() != 'hidden' &&
               (node.hasAttribute('aria-hidden') == false || node.getAttribute('aria-hidden') == "false")) {
          node = node.parentNode;
        }
        if (node != null && (node.nodeName.toLowerCase() == 'body' || node.nodeName.toLowerCase() == 'frameset')) {
          return false;
        }
        return true;
      }
      return true;
    },

    fnNodeIsOffScreen: function (node) {
      if(node != null) {

        var y = node.offsetTop;
        var x = node.offsetLeft;

        while (node.offsetParent != null && node.offsetParent != node.ownerDocument) {
          node = node.offsetParent;
          x += node.offsetLeft;
          y += node.offsetTop;
        }
        if (x < -1 || y < -1) {
          return true;
        }
      }
      return false;
    },

    fnNodeIsMasked: function (node) { // QA This
      // TODO: Some masked nodes only use clip: rect(1px, 1px, 1px, 1px) --- how do we detect this?
      if (node != null) {
        do {
          var compStyle = window.getComputedStyle (node, null);

          if (/absolute|fixed/.test(compStyle.getPropertyValue("position").toLowerCase()) == true) {
            if (/hidden/.test(compStyle.getPropertyValue("overflow").toLowerCase()) == true &&
              (parseInt(compStyle.getPropertyValue("width"),10) <= 1 || parseInt(compStyle.getPropertyValue("height"),10) <= 1) &&
              parseInt(compStyle.getPropertyValue("top"),10) > -1 &&
              parseInt(compStyle.getPropertyValue("left"),10) > -1) { return true; }
            var value = compStyle.getPropertyCSSValue ("clip");
            if (value!=null) {
              var valueType = value.primitiveType;
              if (valueType == CSSPrimitiveValue.CSS_RECT) {
                  var rect = value.getRectValue ();
                  var topPX = rect.top.getFloatValue (CSSPrimitiveValue.CSS_PX);
                  var rightPX = rect.right.getFloatValue (CSSPrimitiveValue.CSS_PX);
                  var bottomPX = rect.bottom.getFloatValue (CSSPrimitiveValue.CSS_PX);
                  var leftPX = rect.left.getFloatValue (CSSPrimitiveValue.CSS_PX);
                  if(topPX<1.1 && rightPX<1.1 && bottomPX<1.1 && leftPX<1.1) { return true; }
              }
            }
          }
          node = node.nodeParent;
        } while (node != null && node.tagName != null && node.tagName.toLowerCase() != 'body');
      }
      return false;
    },

    fnMinDistanceBetweenNodes: function(n1, n2) {
      var box1, box2, x1, y1, w1, h1, x2, y2, w2, h2, dx, dy, scrollLeft1, scrollTop1, scrollLeft2, scrollTop2;
      if(n1 != null && n2 != null && n1.getBoundingClientRect && n2.getBoundingClientRect &&
         blr.W15yQC.fnNodeIsHidden(n1)==false && blr.W15yQC.fnNodeIsHidden(n2)==false) {
        box1 = n1.getBoundingClientRect();
        box2 = n2.getBoundingClientRect();
        if(box1 != null && box2 != null) {
          scrollLeft1 = n1.ownerDocument.documentElement.scrollLeft || n1.ownerDocument.body.scrollLeft;
          scrollTop1 = n1.ownerDocument.documentElement.scrollTop || n1.ownerDocument.body.scrollTop;
  
          x1 = 0;
          y1 = 0;
          w1 = 0;
          h1 = 0;
          if(box1 != null) {
            x1 = box1.left + scrollLeft1;
            y1 = box1.top + scrollTop1;
            w1 = box1.width;
            h1 = box1.height;
          }
          blr.W15yQC.fnLog("***x1 y1 w1 h1:"+x1+' '+y1+' '+w1+' '+h1);

          scrollLeft2 = n2.ownerDocument.documentElement.scrollLeft || n2.ownerDocument.body.scrollLeft;
          scrollTop2 = n2.ownerDocument.documentElement.scrollTop || n2.ownerDocument.body.scrollTop;
  
          x2 = 0;
          y2 = 0;
          w2 = 0;
          h2 = 0;
          if(box2 != null) {
            x2 = box2.left + scrollLeft2;
            y2 = box2.top + scrollTop2;
            w2 = box2.width;
            h2 = box2.height;
          }
          blr.W15yQC.fnLog("***x1 y1 w1 h1:"+x2+' '+y2+' '+w2+' '+h2);
        }
 
        dx=100000;
        if((x1>=x2 && x1<=x2+w2) || (x2>=x1 && x2<=x1+w1)) { // look for overlap
          dx=0;
        } else { // find closest x point
          dx=Math.min(Math.abs(x1-x2),Math.abs((x1+w1)-(x2+w2)),Math.abs(x1-(x2+w2)),Math.abs((x1+w1)-x2));
        }

        dy=100000;
        if((y1>=y2 && y1<=y2+h2) || (y2>=y1 && y2<=y1+h1)) { // look for overlap
          dy=0;
        } else { // find closest x point
          dy=Math.min(Math.abs(y1-y2),Math.abs((y1+h1)-(y2+h2)),Math.abs(y1-(y2+h2)),Math.abs((y1+h1)-y2));
        }
        blr.W15yQC.fnLog("******dx dy d:"+dx+' '+dy+' '+Math.floor(Math.sqrt(dx*dx+dy*dy)));
        return Math.floor(Math.sqrt(dx*dx+dy*dy));
      }
      return 100000;
    },
    
    fnJAWSAnnouncesControlAs: function (node) { // TODO: Vet this with JAWS
      var nType;
      if(node != null && node.tagName) {
        switch (node.tagName.toLowerCase()) {
          case 'input':
            if(node.hasAttribute('type')) {
              nType=node.getAttribute('type');
              if(nType != null && nType.toLowerCase) {
                switch(nType.toLowerCase()) {
                  case 'button':
                    return 'button';
                  case 'text':
                    return 'edit';
                  case 'submit':
                    break;
                }
              }
              return '';
            }
            break;
          case 'button':
            return 'button';
          case 'select':
            return 'combobox';
          case 'textarea':
            return '' ;
        }
      }
      return '';
    },
    
    fnIsLabelControlNode: function (node) {
      if (node != null && node.tagName) {
        switch (node.tagName.toLowerCase()) {
        case 'label':
        case 'fieldset':
        case 'legend':
          return true;
        }
      }
      if (node.hasAttribute && node.hasAttribute('role')) {
        switch (node.getAttribute('role')) {
        case 'radiogroup':
          return true;
        }
      }
      return false;
    },
    
    fnIsFormControlNode: function (node) {
      if (node != null && node.tagName) {
        switch (node.tagName.toLowerCase()) {
        case 'input':
        case 'button':
        case 'select':
        case 'textarea':
          return true;
        }
        if (node.hasAttribute && node.hasAttribute('role')) {
          switch (node.getAttribute('role')) {
          case 'button':
          case 'checkbox':
          case 'radio':
            return true;
          }
        }
      }
      return false;
    },

    fnIsFormControlOrLabelNode: function (node) {
      if(blr.W15yQC.fnIsFormControlNode(node) || blr.W15yQC.fnIsLabelControlNode(node)) {
        return true;
      }
      return false;
    },

    fnGetOwnerDocumentNumber: function (node, aDocumentsList) {
      var i;
      if (node !== null && aDocumentsList !== null && aDocumentsList.length) {
        for (i = 0; i < aDocumentsList.length; i++) {
          if (node.ownerDocument === aDocumentsList[i].doc) { return i + 1; }
        }
      }
      return 'huh?';
    },

    fnGetParentFormElement: function (node) {
      // Check if node has a form attribute and if so, does that form exist?
      var parentFormID, parentForm;
      if (node != null) {
        if (node.getAttribute && node.hasAttribute('form')) {
          parentFormID = node.getAttribute('form');
          parentForm = node.ownerDocument.getElementById(parentFormID);
          if (parentForm != null && parentForm.nodeName && parentForm.nodeName.toLowerCase() == 'form') {
            return parentForm;
          }
        }
        // Look for parent form elements by moving up parentNodes
        while (node != null && node.nodeName.toLowerCase() != 'body' && node.nodeName.toLowerCase() != 'form') {
          node = node.parentNode;
        }
        if (node != null && node.nodeName && node.nodeName.toLowerCase() == 'form') {
          return node;
        } 
        return null;
      }
      return null;
    },

    fnGetParentFormNumber: function (node, aFormsList) {
      var i;
      if (node !== null && aFormsList !== null && aFormsList.length) {
        for (i = 0; i < aFormsList.length; i++) {
          if (node === aFormsList[i].node) { return i + 1; }
        }
      }
      return 'Orphan';
    },

    fnGetElementXPath: function (node) {
      var sXPath = '',
          nodeWalker = node,
          segs,
          i, sib;
      if (node != null && node.tagName) {
        for (segs = []; nodeWalker && nodeWalker.nodeType == 1; nodeWalker = nodeWalker.parentNode) {
          for (i = 1, sib = nodeWalker.previousSibling; sib; sib = sib.previousSibling) {
            if (sib.localName == nodeWalker.localName) { i++; }
          }
          segs.unshift(nodeWalker.localName.toLowerCase() + '[' + i + ']');
        }
        sXPath = segs.length ? '/' + segs.join('/') : '';
      }
      return sXPath;
    },

    fnDescribeElement: function (node, maxLength, maxAttributeLength, sMode) {
      var sDescription = '',
          sAttributes = '',
          sSrc,
          attrName,
          sTagName,
          i;
      if (node != null && node.tagName) {
        if (node.hasAttribute('type') == true) {
          sAttributes = blr.W15yQC.fnJoin(sAttributes, 'type="' + blr.W15yQC.fnCutoffString(node.getAttribute('type'), maxAttributeLength) + '"', ' ');
        }
        if (node.hasAttribute('id') == true) {
          sAttributes = blr.W15yQC.fnJoin(sAttributes, 'id="' + blr.W15yQC.fnCutoffString(node.getAttribute('id'), maxAttributeLength) + '"', ' ');
        }
        if (node.hasAttribute('name') == true) {
          sAttributes = blr.W15yQC.fnJoin(sAttributes, 'name="' + blr.W15yQC.fnCutoffString(node.getAttribute('name'), maxAttributeLength) + '"', ' ');
        }
        if (node.hasAttribute('value') == true) {
          sAttributes = blr.W15yQC.fnJoin(sAttributes, 'value="' + blr.W15yQC.fnCutoffString(node.getAttribute('value'), maxAttributeLength) + '"', ' ');
        }
        if (node.hasAttribute('role') == true) {
          sAttributes = blr.W15yQC.fnJoin(sAttributes, 'role="' + blr.W15yQC.fnCutoffString(node.getAttribute('role'), maxAttributeLength) + '"', ' ');
        }
        if (node.hasAttribute('aria-level') == true) {
          sAttributes = blr.W15yQC.fnJoin(sAttributes, 'aria-level="' + blr.W15yQC.fnCutoffString(node.getAttribute('aria-level'), maxAttributeLength) + '"', ' ');
        }
        if (node.hasAttribute('src') == true) {
          sSrc = node.getAttribute('src');
          if (/^\s*data:/.test(sSrc)) {
            sAttributes = blr.W15yQC.fnJoin(sAttributes, 'src="' + blr.W15yQC.fnCutoffString(node.getAttribute('src'), 35) + '"', ' ');
          } else {
            sAttributes = blr.W15yQC.fnJoin(sAttributes, 'src="' + blr.W15yQC.fnCutoffString(node.getAttribute('src'), maxAttributeLength) + '"', ' ');
          }
        }
        if (node.hasAttribute('alt') == true) {
          sAttributes = blr.W15yQC.fnJoin(sAttributes, 'alt="' + blr.W15yQC.fnCutoffString(node.getAttribute('alt'), maxAttributeLength) + '"', ' ');
        }
        if (node.hasAttribute('title') == true) {
          sAttributes = blr.W15yQC.fnJoin(sAttributes, 'title="' + blr.W15yQC.fnCutoffString(node.getAttribute('title'), maxAttributeLength) + '"', ' ');
        }
        if (node.hasAttribute('summary') == true) {
          sAttributes = blr.W15yQC.fnJoin(sAttributes, 'summary="' + blr.W15yQC.fnCutoffString(node.getAttribute('summary'), 15) + '"', ' ');
        }
        if (node.attributes && node.attributes.length) {
          for (i = 0; i < node.attributes.length; i++) {
            attrName = node.attributes[i].name.toLowerCase();
            if (attrName !== 'type' && attrName !== 'id' && attrName !== 'name' && attrName !== 'value' &&
                attrName !== 'role' && attrName !== 'aria-level' && attrName !== 'src' && attrName !== 'alt' && attrName !== 'title' && attrName !== 'summary') {
              sAttributes = blr.W15yQC.fnJoin(sAttributes, node.attributes[i].name + '="' + blr.W15yQC.fnCutoffString(node.attributes[i].value, maxAttributeLength) + '"', ' ');
            }
          }
        }
        sDescription = blr.W15yQC.fnJoin('<' + node.tagName, sAttributes, ' ') + '>';
        sTagName = node.tagName.toLowerCase();
        if (sTagName == 'button' || sTagName == 'a') {
          sDescription = blr.W15yQC.fnCutoffString(sDescription + blr.W15yQC.fnCutoffString(blr.W15yQC.fnCleanSpaces(node.innerHTML), maxAttributeLength), maxLength) + '</' + node.tagName + '>';
        } else {
          sDescription = blr.W15yQC.fnCutoffString(sDescription, maxLength);
        }
      }
      return sDescription;
    },

    fnGetLegendText: function (aNode, bARIAOnly) {
      var legendNodes, sLabelText=null;
      if(bARIAOnly == null) bARIAOnly=false;
      if (aNode && aNode.nodeName) {
        //Seek upward until we reach a fieldset node
        // aNode = aNode.parentNode;
        while ((aNode != null) && (aNode.nodeName.toLowerCase() != 'fieldset' || bARIAOnly==true) && (aNode.nodeName.toLowerCase() != 'form') && (aNode.nodeName.toLowerCase() != 'body') &&
               (!aNode.hasAttribute || aNode.hasAttribute('role')==false || aNode.getAttribute('role').toLowerCase() != 'radiogroup')) {
          aNode = aNode.parentNode;
        }
        if( (aNode.hasAttribute && aNode.hasAttribute('role') && aNode.getAttribute('role').toLowerCase() == 'radiogroup')) {
          if (aNode.hasAttribute('aria-label')) {
            sLabelText = blr.W15yQC.fnCleanSpaces(aNode.getAttribute('aria-label'));
          }
          if ((sLabelText == null || sLabelText.length < 1) && aNode.hasAttribute('aria-labelledby')) {
            sLabelText = blr.W15yQC.fnCleanSpaces(blr.W15yQC.fnGetTextFromIdList(aNode.getAttribute('aria-labelledby'), aNode.ownerDocument));
          }
        }
        if (sLabelText != null && sLabelText.length > 0) {
          return sLabelText;
        }
        if (aNode != null && aNode.nodeName.toLowerCase() == 'fieldset') {
          //We now have the fieldset, look for the legend attribute
          legendNodes = aNode.getElementsByTagName("LEGEND");
          if (legendNodes && legendNodes.length > 0) {
            return blr.W15yQC.fnGetDisplayableTextRecursively(legendNodes[0]);
          }
        }
      }
      return null;
    },

    fnFindImplicitLabelNode: function (aNode) {
      if (aNode != null && aNode.parentNode != null) {
        aNode = aNode.parentNode;
        while ((aNode != null) && (aNode.nodeName.toLowerCase() != 'form') && (aNode.nodeName.toLowerCase() != 'label') && (aNode.nodeName.toLowerCase() != 'body')) {
          aNode = aNode.parentNode;
        }

        if ((aNode != null) && (aNode.nodeName.toLowerCase() == 'label')) {
          return aNode;
        } else {
          return null;
        }
      }
      return null;
    },

    fnFindLabelNodesForId: function (id, doc) {
      var aLabelNodesForId = [],
          aLabels,
          i,
          labelNode;
      if (id != null && doc != null && doc.getElementsByTagName) {
        aLabels = doc.getElementsByTagName("label");
        for (i = 0; i < aLabels.length; i++) {
          labelNode = aLabels[i];
          if (labelNode.getAttribute) {
            if (labelNode.getAttribute("for") == id) {
              aLabelNodesForId.push(labelNode);
            }
          }
        }
      }
      return aLabelNodesForId;
    },

    fnGetTextFromIdList: function (sIDList, doc) {
      var sLabelText = null,
          aIDs,
          i;
      if (sIDList != null && doc != null) {
        aIDs = sIDList.split(' ');
        for (i=0;i<aIDs.length; i++) {
          sLabelText = blr.W15yQC.fnJoin(sLabelText, blr.W15yQC.fnGetDisplayableTextRecursively(doc.getElementById(aIDs[i])), ' ');
        }
      }
      return sLabelText;
    },

    fnGetARIALabelText: function (node, doc) {
      var sLabelText = null;
      if (node != null && node.hasAttribute && doc != null) {
        if (node.hasAttribute('aria-label')) {
          sLabelText = blr.W15yQC.fnCleanSpaces(node.getAttribute('aria-label'));
        }
        if ((sLabelText == null || sLabelText.length < 1) && node.hasAttribute('aria-labelledby')) {
          sLabelText = blr.W15yQC.fnCleanSpaces(blr.W15yQC.fnGetTextFromIdList(node.getAttribute('aria-labelledby'), doc));
        }
      }
      return sLabelText;
    },

    fnGetFormControlLabelTagText: function (node, doc) {
      var sLabelText = null,
          implicitLabelNode,
          explictLabelsList,
          i;
      if (node != null && node.getAttribute && doc != null) {
        if(node.hasAttribute('role') && node.getAttribute('role').toLowerCase()=='radio') {
          sLabelText = blr.W15yQC.fnGetDisplayableTextRecursively(node);
        } else {
          implicitLabelNode = blr.W15yQC.fnFindImplicitLabelNode(node);
          if (implicitLabelNode != null) {
            sLabelText = blr.W15yQC.fnCleanSpaces(blr.W15yQC.fnGetDisplayableTextRecursively(implicitLabelNode));
          }
  
          if ((sLabelText == null || sLabelText.length < 1) && node.hasAttribute('id')) {
            explictLabelsList = blr.W15yQC.fnFindLabelNodesForId(node.getAttribute('id'), doc);
            for (i = 0; i < explictLabelsList.length; i++) {
              sLabelText = blr.W15yQC.fnJoin(sLabelText, blr.W15yQC.fnGetDisplayableTextRecursively(explictLabelsList[i]), ' ');
            }
            sLabelText = blr.W15yQC.fnCleanSpaces(sLabelText);
          }
        }
      }
      return sLabelText;
    },

    fnGetEffectiveLabelText: function (node, doc) {
      // TODO: pick up role="button", etc? JAWS does...
      // TODO: return an effective Label Object that contains the text and a property that tells the text source
      // textarea, select, button, input
      /* Q: Is the decision that JAWS makes from the lack of the attribute or the string, does aria-label="" stop progression the same as no title attribute?
       * A: Empty aria-label and elements pointed to by aria-labelledby are the same as not having an aria-label or aria-labelled by (JAWS 13 + IE9 - Windows 7 32 bit)
       */
      var sLabelText = '',
          nTagName,
          inputType,
          implicitLabelNode,
          explictLabelsList,
          i;

      if (node != null && node.tagName) {
        nTagName = node.tagName.toLowerCase();

        if (nTagName == 'input') {
          inputType = '';
          if (node.hasAttribute('type')) { inputType = blr.W15yQC.fnCleanSpaces(node.getAttribute('type').toLowerCase()); }
          if (inputType == '') { inputType = 'text'; } // default type
          switch (inputType) {
          case 'submit':
            // Vetted against JAWS Version 13.0.527 32 bit, IE 9.0.8112.16421, Windows 7 32 bit, 2-Dec-2011
            if (node.hasAttribute('aria-label')) {
              sLabelText = blr.W15yQC.fnCleanSpaces(node.getAttribute('aria-label'));
            }
            if (sLabelText.length < 1 && node.hasAttribute('aria-labelledby')) {
              sLabelText = blr.W15yQC.fnCleanSpaces(blr.W15yQC.fnGetTextFromIdList(node.getAttribute('aria-labelledby'), doc));
            }
            if (sLabelText.length < 1 && node.hasAttribute('value')) {
              sLabelText = blr.W15yQC.fnCleanSpaces(node.getAttribute('value'));
            }
            if (sLabelText.length < 1) {
              sLabelText = 'Submit Query';
            }
            break;

          case 'reset':
            // Vet this
            if (node.hasAttribute('aria-label')) {
              sLabelText = blr.W15yQC.fnCleanSpaces(node.getAttribute('aria-label'));
            }
            if (sLabelText.length < 1 && node.hasAttribute('aria-labelledby')) {
              sLabelText = blr.W15yQC.fnCleanSpaces(blr.W15yQC.fnGetTextFromIdList(node.getAttribute('aria-labelledby'), doc));
            }
            if (sLabelText.length < 1 && node.hasAttribute('value')) {
              sLabelText = blr.W15yQC.fnCleanSpaces(node.getAttribute('value'));
            }
            if (sLabelText.length < 1) {
              sLabelText = 'Reset Query';
            }
            break;

          case 'image':
            // Vetted against JAWS Version 13.0.527 32 bit, IE 9.0.8112.16421, Windows 7 32 bit, 2-Dec-2011
            if (node.hasAttribute('aria-label')) {
              sLabelText = blr.W15yQC.fnCleanSpaces(node.getAttribute('aria-label'));
            }
            if (sLabelText.length < 1 && node.hasAttribute('aria-labelledby')) {
              sLabelText = blr.W15yQC.fnCleanSpaces(blr.W15yQC.fnGetTextFromIdList(node.getAttribute('aria-labelledby'), doc));
            }
            if (sLabelText.length < 1 && node.hasAttribute('title')) {
              sLabelText = blr.W15yQC.fnCleanSpaces(node.getAttribute('title'));
            }
            if (sLabelText.length < 1 && node.hasAttribute('value')) {
              sLabelText = blr.W15yQC.fnCleanSpaces(node.getAttribute('value'));
            }
            if (sLabelText.length < 1 && node.hasAttribute('alt')) {
              sLabelText = blr.W15yQC.fnCleanSpaces(node.getAttribute('alt'));
            }
            if (sLabelText.length < 1 && node.hasAttribute('src')) {
              sLabelText = blr.W15yQC.fnCleanSpaces(node.getAttribute('src'));
            }
            if (sLabelText.length < 1 && node.hasAttribute('name')) {
              sLabelText = blr.W15yQC.fnCleanSpaces(node.getAttribute('name'));
            }
            if (sLabelText.length < 1 && node.hasAttribute('id')) {
              sLabelText = blr.W15yQC.fnCleanSpaces(node.getAttribute('id'));
            }
            break;

          case 'button':
            // Vetted against JAWS Version 13.0.527 32 bit, IE 9.0.8112.16421, Windows 7 32 bit, 2-Dec-2011
            if (node.hasAttribute('aria-label')) {
              sLabelText = blr.W15yQC.fnCleanSpaces(node.getAttribute('aria-label'));
            }
            if (sLabelText.length < 1 && node.hasAttribute('aria-labelledby')) {
              sLabelText = blr.W15yQC.fnCleanSpaces(blr.W15yQC.fnGetTextFromIdList(node.getAttribute('aria-labelledby'), doc));
            }
            if (sLabelText.length < 1 && node.hasAttribute('value')) {
              sLabelText = blr.W15yQC.fnCleanSpaces(node.getAttribute('value'));
            }
            if (sLabelText.length < 1 && node.hasAttribute('title')) {
              sLabelText = blr.W15yQC.fnCleanSpaces(node.getAttribute('title'));
            }
            if (sLabelText.length < 1 && node.hasAttribute('alt')) {
              sLabelText = blr.W15yQC.fnCleanSpaces(node.getAttribute('alt'));
            }
            if (sLabelText.length < 1 && node.hasAttribute('name')) {
              sLabelText = blr.W15yQC.fnCleanSpaces(node.getAttribute('name'));
            }
            break;

          case 'radio':
            // Vetted against JAWS Version 13.0.527 32 bit, IE 9.0.8112.16421, Windows 7 32 bit, 2-Dec-2011
          case 'checkbox':
            // Vetted against JAWS Version 13.0.527 32 bit, IE 9.0.8112.16421, Windows 7 32 bit, 2-Dec-2011
            if (node.hasAttribute('aria-label')) {
              sLabelText = blr.W15yQC.fnCleanSpaces(node.getAttribute('aria-label'));
            }

            if (sLabelText.length < 1 && node.hasAttribute('aria-labelledby')) {
              sLabelText = blr.W15yQC.fnCleanSpaces(blr.W15yQC.fnGetTextFromIdList(node.getAttribute('aria-labelledby'), doc));
            }

            if (sLabelText.length < 1) {
              implicitLabelNode = blr.W15yQC.fnFindImplicitLabelNode(node);
              if (implicitLabelNode != null) {
                sLabelText = blr.W15yQC.fnCleanSpaces(blr.W15yQC.fnGetDisplayableTextRecursively(implicitLabelNode));
              }
            }

            if (sLabelText.length < 1 && node.hasAttribute('id')) {
              explictLabelsList = blr.W15yQC.fnFindLabelNodesForId(node.getAttribute('id'), doc);
              for (i = 0; i < explictLabelsList.length; i++) {
                sLabelText = blr.W15yQC.fnJoin(sLabelText, blr.W15yQC.fnGetDisplayableTextRecursively(explictLabelsList[i]), ' ');
              }
              sLabelText = blr.W15yQC.fnCleanSpaces(sLabelText);
            }

            if (sLabelText.length < 1 && node.hasAttribute('title')) {
              sLabelText = blr.W15yQC.fnCleanSpaces(node.getAttribute('title'));
            }

            if (sLabelText.length < 1 && node.hasAttribute('alt')) {
              sLabelText = blr.W15yQC.fnCleanSpaces(node.getAttribute('alt'));
            }
            break;

          default:
            // type='text' and unrecognized types
            // type='text'  -- Vetted against JAWS Version 13.0.527 32 bit, IE 9.0.8112.16421, Windows 7 32 bit, 2-Dec-2011
            if (node.hasAttribute('aria-label')) {
              sLabelText = blr.W15yQC.fnCleanSpaces(node.getAttribute('aria-label'));
            }

            if (sLabelText.length < 1 && node.hasAttribute('aria-labelledby')) {
              sLabelText = blr.W15yQC.fnCleanSpaces(blr.W15yQC.fnGetTextFromIdList(node.getAttribute('aria-labelledby'), doc));
            }

            if (sLabelText.length < 1) { // Mimic IE 9 + JAWS 12 behavior, FF 7 + JAWS 12 would add label elements along with aria-labelled by content.
              implicitLabelNode = blr.W15yQC.fnFindImplicitLabelNode(node);
              if (implicitLabelNode != null) {
                sLabelText = blr.W15yQC.fnCleanSpaces(blr.W15yQC.fnGetDisplayableTextRecursively(implicitLabelNode));
              }
            }

            if (sLabelText.length < 1 && node.hasAttribute('id')) {
              explictLabelsList = blr.W15yQC.fnFindLabelNodesForId(node.getAttribute('id'), doc);
              for (i = 0; i < explictLabelsList.length; i++) {
                sLabelText = blr.W15yQC.fnJoin(sLabelText, blr.W15yQC.fnGetDisplayableTextRecursively(explictLabelsList[i]), ' ');
              }
              sLabelText = blr.W15yQC.fnCleanSpaces(sLabelText);
            }

            if (sLabelText.length < 1 && node.hasAttribute('title')) {
              sLabelText = blr.W15yQC.fnCleanSpaces(node.getAttribute('title'));
            }

            if (sLabelText.length < 1 && node.hasAttribute('alt')) {
              sLabelText = blr.W15yQC.fnCleanSpaces(node.getAttribute('alt'));
            }
          }
          sLabelText = blr.W15yQC.fnJoin(blr.W15yQC.fnGetLegendText(node), sLabelText, ' ');
          // end tagName == input
        } else if (nTagName == 'button') { // Vetted against JAWS Version 13.0.527 32 bit, IE 9.0.8112.16421, Windows 7 32 bit, 2-Dec-2011
          if (node.hasAttribute('aria-label')) {
            sLabelText = blr.W15yQC.fnCleanSpaces(node.getAttribute('aria-label'));
          }
          if (sLabelText.length < 1 && node.hasAttribute('aria-labelledby')) {
            sLabelText = blr.W15yQC.fnCleanSpaces(blr.W15yQC.fnGetTextFromIdList(node.getAttribute('aria-labelledby'), doc));
          }
          if (sLabelText.length < 1) {
            sLabelText = blr.W15yQC.fnCleanSpaces(blr.W15yQC.fnGetDisplayableTextRecursively(node));
          }
          if (sLabelText.length < 1 && node.hasAttribute('alt')) {
            sLabelText = blr.W15yQC.fnCleanSpaces(node.getAttribute('alt'));
          }
          if (sLabelText.length < 1 && node.hasAttribute('title')) {
            sLabelText = blr.W15yQC.fnCleanSpaces(node.getAttribute('title'));
          }
          if (sLabelText.length < 1 && node.hasAttribute('value')) {
            sLabelText = blr.W15yQC.fnCleanSpaces(node.getAttribute('value'));
          }
          if (sLabelText.length < 1 && node.hasAttribute('name')) {
            sLabelText = blr.W15yQC.fnCleanSpaces(node.getAttribute('name'));
          }
          sLabelText = blr.W15yQC.fnJoin(blr.W15yQC.fnGetLegendText(node), sLabelText, ' ');
        } else if (nTagName == 'a') { // TODO: Vet this with JAWS!!!
          if (node.hasAttribute('aria-label')) {
            sLabelText = blr.W15yQC.fnCleanSpaces(node.getAttribute('aria-label'));
          }
          if (sLabelText.length < 1 && node.hasAttribute('aria-labelledby')) {
            sLabelText = blr.W15yQC.fnCleanSpaces(blr.W15yQC.fnGetTextFromIdList(node.getAttribute('aria-labelledby'), doc));
          }
          if (sLabelText.length < 1) {
            sLabelText = blr.W15yQC.fnCleanSpaces(blr.W15yQC.fnGetDisplayableTextRecursively(node));
          }
          if (sLabelText.length < 1 && node.hasAttribute('title')) {
            sLabelText = blr.W15yQC.fnCleanSpaces(node.getAttribute('title'));
          }
        } else if (nTagName == 'h1' || nTagName == 'h2' || nTagName == 'h3' || nTagName == 'h4' || nTagName == 'h5' || nTagName == 'h6') { // TODO: Vet this with JAWS!!!
          if (node.hasAttribute('aria-label')) {
            sLabelText = blr.W15yQC.fnCleanSpaces(node.getAttribute('aria-label'));
          }
          if (sLabelText.length < 1 && node.hasAttribute('aria-labelledby')) {
            sLabelText = blr.W15yQC.fnCleanSpaces(blr.W15yQC.fnGetTextFromIdList(node.getAttribute('aria-labelledby'), doc));
          }
          if (sLabelText.length < 1) {
            sLabelText = blr.W15yQC.fnCleanSpaces(blr.W15yQC.fnGetDisplayableTextRecursively(node));
          }
          if (sLabelText.length < 1 && node.hasAttribute('title')) {
            sLabelText = blr.W15yQC.fnCleanSpaces(node.getAttribute('title'));
          }
        } else if (nTagName == 'select') { // Vetted against JAWS Version 13.0.527 32 bit, IE 9.0.8112.16421, Windows 7 32 bit, 2-Dec-2011
          if (node.hasAttribute('aria-label')) {
            sLabelText = blr.W15yQC.fnCleanSpaces(node.getAttribute('aria-label'));
          }

          if (sLabelText.length < 1 && node.hasAttribute('aria-labelledby')) {
            sLabelText = blr.W15yQC.fnCleanSpaces(blr.W15yQC.fnGetTextFromIdList(node.getAttribute('aria-labelledby'), doc));
          }

          if (sLabelText.length < 1) {
            implicitLabelNode = blr.W15yQC.fnFindImplicitLabelNode(node);
            if (implicitLabelNode != null) {
              sLabelText = blr.W15yQC.fnCleanSpaces(blr.W15yQC.fnGetDisplayableTextRecursively(implicitLabelNode));
            }
          }

          if (sLabelText.length < 1 && node.hasAttribute('id')) {
            explictLabelsList = blr.W15yQC.fnFindLabelNodesForId(node.getAttribute('id'), doc);
            for (i = 0; i < explictLabelsList.length; i++) {
              sLabelText = blr.W15yQC.fnJoin(sLabelText, blr.W15yQC.fnGetDisplayableTextRecursively(explictLabelsList[i]), ' ');
            }
            sLabelText = blr.W15yQC.fnCleanSpaces(sLabelText);
          }

          if (sLabelText.length < 1 && node.hasAttribute('title')) {
            sLabelText = blr.W15yQC.fnCleanSpaces(node.getAttribute('title'));
          }

          if (sLabelText.length < 1 && node.hasAttribute('alt')) {
            sLabelText = blr.W15yQC.fnCleanSpaces(node.getAttribute('alt'));
          }
          sLabelText = blr.W15yQC.fnJoin(blr.W15yQC.fnGetLegendText(node), sLabelText, ' ');

        } else if (nTagName == 'textarea') { // Vetted against JAWS Version 13.0.527 32 bit, IE 9.0.8112.16421, Windows 7 32 bit, 2-Dec-2011
          if (node.hasAttribute('aria-label')) {
            sLabelText = blr.W15yQC.fnCleanSpaces(node.getAttribute('aria-label'));
          }
          if (sLabelText.length < 1 && node.hasAttribute('aria-labelledby')) {
            sLabelText = blr.W15yQC.fnCleanSpaces(blr.W15yQC.fnGetTextFromIdList(node.getAttribute('aria-labelledby'), doc));
          }
          if (sLabelText.length < 1) { // Mimic IE 9 + JAWS 12 behavior, FF 7 + JAWS 12 would add label elements along with aria-labelled by content.
            implicitLabelNode = blr.W15yQC.fnFindImplicitLabelNode(node);
            if (implicitLabelNode != null) {
              sLabelText = blr.W15yQC.fnCleanSpaces(blr.W15yQC.fnGetDisplayableTextRecursively(implicitLabelNode));
            }
          }
          if (sLabelText.length < 1 && node.hasAttribute('id')) {
            explictLabelsList = blr.W15yQC.fnFindLabelNodesForId(node.getAttribute('id'), doc);
            for (i = 0; i < explictLabelsList.length; i++) {
              sLabelText = blr.W15yQC.fnJoin(sLabelText, blr.W15yQC.fnGetDisplayableTextRecursively(explictLabelsList[i]), ' ');
            }
            sLabelText = blr.W15yQC.fnCleanSpaces(sLabelText);
          }
          if (sLabelText.length < 1 && node.hasAttribute('title')) {
            sLabelText = blr.W15yQC.fnCleanSpaces(node.getAttribute('title'));
          }
          if (sLabelText.length < 1 && node.hasAttribute('alt')) {
            sLabelText = blr.W15yQC.fnCleanSpaces(node.getAttribute('alt'));
          }

          sLabelText = blr.W15yQC.fnJoin(blr.W15yQC.fnGetLegendText(node), sLabelText, ' ');
          } else if (nTagName == 'img' || nTagName == 'area') { // JAWS 13: aria-label, alt, title, aria-labelledby -- TODO: Vet area with JAWS
            if (node.hasAttribute('aria-label')) {
              sLabelText = blr.W15yQC.fnCleanSpaces(node.getAttribute('aria-label'));
            }
            if (sLabelText.length < 1 && node.hasAttribute('alt')) {
              sLabelText = blr.W15yQC.fnCleanSpaces(node.getAttribute('alt'));
            }
            if (sLabelText.length < 1 && node.hasAttribute('title')) {
              sLabelText = blr.W15yQC.fnCleanSpaces(node.getAttribute('title'));
            }
            if (sLabelText.length < 1 && node.hasAttribute('aria-labelledby')) {
              sLabelText = blr.W15yQC.fnCleanSpaces(blr.W15yQC.fnGetTextFromIdList(node.getAttribute('aria-labelledby'), doc));
            }
          } else if (node.hasAttribute('role')) { // TODO: Vet this, not checked with JAWS
            if (node.hasAttribute('aria-label')) {
              sLabelText = blr.W15yQC.fnCleanSpaces(node.getAttribute('aria-label'));
            }

            if (sLabelText.length < 1 && node.hasAttribute('aria-labelledby')) {
              sLabelText = blr.W15yQC.fnCleanSpaces(blr.W15yQC.fnGetTextFromIdList(node.getAttribute('aria-labelledby'), doc));
            }

            if (sLabelText.length < 1) { // Mimic IE 9 + JAWS 12 behavior, FF 7 + JAWS 12 would add label elements along with aria-labelled by content.
              implicitLabelNode = blr.W15yQC.fnFindImplicitLabelNode(node);
              if (implicitLabelNode != null) {
                sLabelText = blr.W15yQC.fnCleanSpaces(blr.W15yQC.fnGetDisplayableTextRecursively(implicitLabelNode));
              }
            }

            if (sLabelText.length < 1 && node.hasAttribute('id')) {
              explictLabelsList = blr.W15yQC.fnFindLabelNodesForId(node.getAttribute('id'), doc);
              for (i = 0; i < explictLabelsList.length; i++) {
                sLabelText = blr.W15yQC.fnJoin(sLabelText, blr.W15yQC.fnGetDisplayableTextRecursively(explictLabelsList[i]), ' ');
              }
              sLabelText = blr.W15yQC.fnCleanSpaces(sLabelText);
            }

            if (sLabelText.length < 1 && node.hasAttribute('title')) {
              sLabelText = blr.W15yQC.fnCleanSpaces(node.getAttribute('title'));
            }

            if (sLabelText.length < 1 && node.hasAttribute('alt')) {
              sLabelText = blr.W15yQC.fnCleanSpaces(node.getAttribute('alt'));
            }
            
            if(node.getAttribute('role').toLowerCase()=='radio') {
              if (sLabelText.length < 1) { // TODO: Make sure this is correct
                sLabelText = blr.W15yQC.fnCleanSpaces(blr.W15yQC.fnGetDisplayableTextRecursively(node));
              }
              sLabelText = blr.W15yQC.fnJoin(blr.W15yQC.fnGetLegendText(node,true), sLabelText, ' '); // ARIA Radiogroups only apply to role='radio'
            }
          }
      }
      return sLabelText;
    },

    fnGetARIADescriptionText: function (node, doc) {
      var sDescription = '';
      if (node != null && node.hasAttribute && doc != null && doc.getElementById) {
        if (node.hasAttribute('aria-describedby')) {
          sDescription = blr.W15yQC.fnJoin(sDescription, blr.W15yQC.fnGetTextFromIdList(node.getAttribute('aria-describedby'), doc), ' ');
        }
      }
      return sDescription;
    },

    fnGetNodeState: function (node) {
      var sStateDescription = null;
      if (node != null && node.tagName != null) {
        if (blr.W15yQC.fnNodeIsHidden(node) == true) {
          sStateDescription = blr.W15yQC.fnJoin(sStateDescription, blr.W15yQC.fnGetString('nsHidden'), ', ');
        }
        if (blr.W15yQC.fnNodeIsMasked(node) == true) {
          sStateDescription = blr.W15yQC.fnJoin(sStateDescription, blr.W15yQC.fnGetString('nsMasked'), ', ');
        }
        if (blr.W15yQC.fnNodeIsOffScreen(node) == true) {
          sStateDescription = blr.W15yQC.fnJoin(sStateDescription, blr.W15yQC.fnGetString('nsPosOffScrn'), ', ');
        }
        if (node.disabled == true) {
          sStateDescription = blr.W15yQC.fnJoin(sStateDescription, blr.W15yQC.fnGetString('nsDisabled'), ', ');
        }
        if (node.readOnly == true) {
          sStateDescription = blr.W15yQC.fnJoin(sStateDescription, blr.W15yQC.fnGetString('nsReadOnly'), ', ');
        } 
        if (node.hasAttribute('hidden') == true) {
          sStateDescription = blr.W15yQC.fnJoin(sStateDescription, 'hidden="' + node.getAttribute('hidden') + '"', ', ');
        }
        if (node.hasAttribute('aria-autocomplete') == true) {
          sStateDescription = blr.W15yQC.fnJoin(sStateDescription, 'aria-autocomplete="' + node.getAttribute('aria-autocomplete') + '"', ', ');
        }
        if (node.hasAttribute('aria-busy') == true) {
          sStateDescription = blr.W15yQC.fnJoin(sStateDescription, 'aria-busy="' + node.getAttribute('aria-busy') + '"', ', ');
        }
        if (node.hasAttribute('aria-disabled') == true) {
          sStateDescription = blr.W15yQC.fnJoin(sStateDescription, 'aria-disabled="' + node.getAttribute('aria-disabled') + '"', ', ');
        }
        if (node.hasAttribute('aria-grabbed') == true) {
          sStateDescription = blr.W15yQC.fnJoin(sStateDescription, 'aria-grabbed="' + node.getAttribute('aria-grabbed') + '"', ', ');
        }
        if (node.hasAttribute('aria-haspopup') == true) {
          sStateDescription = blr.W15yQC.fnJoin(sStateDescription, 'aria-haspopup="' + node.getAttribute('aria-haspopup') + '"', ', ');
        }
        if (node.hasAttribute('aria-hidden') == true) {
          sStateDescription = blr.W15yQC.fnJoin(sStateDescription, 'aria-hidden="' + node.getAttribute('aria-hidden') + '"', ', ');
        }
        if (node.hasAttribute('aria-invalid') == true) {
          sStateDescription = blr.W15yQC.fnJoin(sStateDescription, 'aria-invalid="' + node.getAttribute('aria-invalid') + '"', ', ');
        }
        if (node.hasAttribute('aria-required') == true) {
          sStateDescription = blr.W15yQC.fnJoin(sStateDescription, 'aria-required="' + node.getAttribute('aria-required') + '"', ', ');
        }
      }
      return blr.W15yQC.fnCleanSpaces(sStateDescription);
    },

    fnGetDisplayableTextRecursively: function (rootNode, bRecursion) {
      // TODO: Vet this with JAWS
      // TODO: QA THIS, rethink this...
      // TODO: Gan we get this from Firefox? What about ARIA-label and other ARIA attribute?
      // How does display:none, visibility:hidden, and aria-hidden=true affect child text collection?
      var sNodeChildText = '',
          sRecursiveText = null,
          c;
      if (bRecursion == null) { bRecursion = 0; }
      if (rootNode != null) {
        for (c = rootNode.firstChild; c != null; c = c.nextSibling) {
          if (c.nodeType == 1 || c.nodeType == 3) { // Only pay attention to element and text nodes
            if (c.tagName && ((c.contentWindow && c.contentWindow.document !== null) || (c.contentDocument && c.contentDocument.body !== null)) && blr.W15yQC.fnNodeIsHidden(c) == false) { // Found a frame
              // don't get frame contents, but instead check if it has a title attribute
              if (c.hasAttribute('title')) {
                sNodeChildText = blr.W15yQC.fnJoin(sNodeChildText, c.getAttribute('title'), ' ');
              }
            } else { // keep looking through current document
              if (c.nodeType == 3 && c.nodeValue != null) { // text content
                sNodeChildText = blr.W15yQC.fnJoin(sNodeChildText, c.nodeValue, ' ');
              }
              if (c.nodeType == 1 || c.nodeType == 3) {
                if (bRecursion < 100) { sRecursiveText = blr.W15yQC.fnGetDisplayableTextRecursively(c, bRecursion + 1); }
  
                if (sRecursiveText == null || (c.nodeType == 1 && blr.W15yQC.fnTrim(sRecursiveText).length == 0)) {
                  if (c.tagName != null && blr.W15yQC.fnCanTagHaveAlt(c.tagName) && c.hasAttribute('alt') == true) {
                    sNodeChildText = blr.W15yQC.fnJoin(sNodeChildText, c.getAttribute('alt'));
                  } else if (c.hasAttribute && c.hasAttribute('title')) {
                    sNodeChildText = blr.W15yQC.fnJoin(sNodeChildText, c.getAttribute('title'));
                  }
                } else {
                  sNodeChildText = blr.W15yQC.fnJoin(sNodeChildText, sRecursiveText, ' ');
                }
              }
            }
          }
        }

        sNodeChildText = blr.W15yQC.fnCleanSpaces(sNodeChildText);

        if ((bRecursion == null || bRecursion == 0) && (sNodeChildText == null || sNodeChildText.length == 0) && rootNode.hasAttribute && rootNode.tagName) {
          if (blr.W15yQC.fnCanTagHaveAlt(rootNode.tagName) && rootNode.hasAttribute('alt') == true) {
            sNodeChildText = blr.W15yQC.fnCleanSpaces(rootNode.getAttribute('alt'));
          } else if (rootNode.hasAttribute('title')) {
            sNodeChildText = blr.W15yQC.fnCleanSpaces(rootNode.getAttribute('title'));
          }
        }
      }
      return sNodeChildText;
    },

    fnElementUsesARIA: function (node) {
      var i, attrName;
      for (i = 0; i < node.attributes.length; i++) {
        attrName = node.attributes[i].name.toLowerCase();
        if(attrName == 'role' || attrName.match(/^aria-/) != null) { return true; }
      }
      return false;
    },

    ARIAChecks : {
          "alert" : {
            container : null,
            validProps : ["aria-expanded"],
            reqProps : null,
            reqChildren : null,
            roleType : null
          },

          "alertdialog" : {
            container : null,
            validProps : ["aria-expanded"],
            reqProps : null,
            reqChildren : null,
            roleType : null
          },

          "application" : {
            container : null,
            validProps : ["aria-expanded"],
            reqProps : null,
            reqChildren : null,
            roleType : "landmark"
          },

          "article" : {
            container : null,
            props : ["aria-expanded"],
            reqProps : null,
            reqChildren : null,
            roleType : null
          },

          "banner" : {
            container : null,
            props : ["aria-expanded"],
            reqProps : null,
            reqChildren : null,
            roleType : "landmark"
          },

          "button" : {
            container : null,
            props : ["aria-expanded", "aria-pressed"],
            reqProps : null,
            reqChildren : null,
            roleType : "widget"
          },

          "checkbox" : {
            container : null,
            props : null,
            reqProps : ["aria-checked"],
            reqChildren : null,
            roleType : "widget"
          },

          "columnheader" : {
            container : ["row"],
            props : ["aria-expanded", "aria-sort", "aria-readonly", "aria-selected", "aria-required"],
            reqProps : null,
            reqChildren : null,
            roleType : null
          },

          "combobox" : {
            container : null,
            props : ["aria-autocomplete", "aria-required", "aria-activedescendant"],
            reqProps : ["aria-expanded"],
            reqChildren : ["listbox", "textbox"],
            roleType : "widget"
          },

          "complementry" : {
            container : null,
            props : ["aria-expanded"],
            reqProps : ["aria-labelledby"],
            reqChildren : null,
            roleType : "landmark"
          },

          "contentinfo" : {
            container : null,
            props : ["aria-expanded"],
            reqProps : ["aria-labelledby"],
            reqChildren : null,
            roleType : "landmark"
          },

          "definition" : {
            container : null,
            props : ["aria-expanded"],
            reqProps : null,
            reqChildren : null,
            roleType : null
          },

          "dialog" : {
            container : null,
            props : ["aria-expanded"],
            reqProps : null,
            reqChildren : null,
            roleType : null
          },

          "directory" : {
            container : null,
            props : ["aria-expanded"],
            reqProps : null,
            reqChildren : null,
            roleType : null
          },

          "document" : {
            container : null,
            props : ["aria-expanded"],
            reqProps : null,
            reqChildren : null,
            roleType : null
          },

          "form" : {
            container : null,
            props : ["aria-expanded"],
            reqProps : null,
            reqChildren : null,
            roleType : "landmark"
          },

          "grid" : {
            container : null,
            props : ["aria-level", "aria-multiselectable", "aria-readonly", "aria-activedescendant", "aria-expanded"],
            reqProps : null,
            reqChildren : ["row", "rowgroup"],
            roleType : null
          },

          "gridcell" : {
            container : ["row"],
            props : ["aria-readonly", "aria-selected", "aria-expanded", "aria-required"],
            reqProps : null,
            reqChildren : null,
            roleType : null
          },

          "group" : {
            container : null,
            props : ["aria-activedescendant", "aria-expanded"],
            reqProps : null,
            reqChildren : null,
            roleType : null
          },

          "heading" : {
            container : null,
            props : ["aria-level", "aria-expanded"],
            reqProps : null,
            reqChildren : null,
            roleType : null
          },

          "img" : {
            container : null,
            props : ["aria-expanded"],
            reqProps : null,
            reqChildren : null,
            roleType : null
          },

          "link" : {
            container : null,
            props : null,
            reqProps : null,
            reqChildren : null,
            roleType : "widget"
          },

          "list" : {
            container : null,
            props : ["aria-expanded"],
            reqProps : null,
            reqChildren : ["group", "listitem"],
            roleType : null
          },

          "listbox" : {
            container : null,
            props : ["aria-expanded", "aria-activedescendant", "aria-multiselectable", "aria-required"],
            reqProps : null,
            reqChildren : ["option"],
            roleType : null
          },

          "listitem" : {
            container : ["list"],
            props : ["aria-expanded", "aria-level", "aria-posinset", "aria-setsize"],
            reqProps : null,
            reqChildren : null,
            roleType : null
          },

          "log" : {
            container : null,
            props : ["aria-expanded"],
            reqProps : null,
            reqChildren : null,
            roleType : null
          },

          "main" : {
            container : null,
            props : ["aria-expanded"],
            reqProps : null,
            reqChildren : null,
            roleType : "landmark"
          },

          "marquee" : {
            container : null,
            props : ["aria-expanded"],
            reqProps : null,
            reqChildren : null,
            roleType : null
          },

          "math" : {
            container : null,
            props : ["aria-expanded"],
            reqProps : null,
            reqChildren : null,
            roleType : null
          },

          "menu" : {
            container : null,
            props : ["aria-expanded", "aria-activedescendant"],
            reqProps : null,
            reqChildren : ["menuitem", "menuitemcheckbox", "menuitemradio"],
            roleType : null
          },

          "menubar" : {
            container : null,
            props : ["aria-activedescendant", "aria-expanded"],
            reqProps : null,
            reqChildren : null,
            roleType : null
          },

          "menuitem" : {
            container : ["menu", "menubar"],
            props : null,
            reqProps : null,
            reqChildren : null,
            roleType : "widget"
          },

          "menuitemcheckbox" : {
            container : ["menu", "menubar"],
            props : null,
            reqProps : ["aria-checked"],
            reqChildren : null,
            roleType : "widget"
          },

          "menuitemradio" : {
            container : ["menu", "menubar"],
            props : ["aria-selected", "aria-posinset", "aria-setsize"],
            reqProps : ["aria-checked"],
            reqChildren : null,
            roleType : "widget"
          },

          "navigation" : {
            container : null,
            props : ["aria-expanded"],
            reqProps : ["aria-labelledby"],
            reqChildren : null,
            roleType : "landmark"
          },

          "note" : {
            container : null,
            props : ["aria-expanded"],
            reqProps : null,
            reqChildren : null,
            roleType : null
          },

          "option" : {
            container : ["listbox"],
            props : ["aria-expanded", "aria-checked", "aria-selected", "aria-posinset", "aria-setsize"],
            reqProps : null,
            reqChildren : null,
            roleType : "widget"
          },

          "presentation" : {
            container : null,
            props : null,
            reqProps : null,
            reqChildren : null,
            roleType : null
          },

          "progressbar" : {
            container : null,
            props : ["aria-valuetext", "aria-valuenow", "aria-valuemax", "aria-valuemin"],
            reqProps : null,
            reqChildren : null,
            roleType : "widget"
          },

          "radio" : {
            container : null,
            props : ["aria-selected", "aria-posinset", "aria-setsize"],
            reqProps : ["aria-checked"],
            reqChildren : null,
            roleType : "widget"
          },

          "radiogroup" : {
            container : null,
            props : ["aria-activedescendant", "aria-expanded", "aria-required"],
            reqProps : ["aria-labelledby"],
            reqChildren : ["radio"],
            roleType : null
          },

          "region" : {
            container : null,
            props : ["aria-expanded"],
            reqProps : null,
            reqChildren : null,
            roleType : null
          },

          "row" : {
            container : ["grid", "treegrid", "rowgroup"],
            props : ["aria-level", "aria-selected", "aria-activedescendant", "aria-expanded"],
            reqProps : null,
            reqChildren : ["gridcell", "rowheader", "columnheader"],
            roleType : null
          },

          "rowgroup" : {
            container : ["grid"],
            props : ["aria-expanded", "aria-activedescendant"],
            reqProps : null,
            reqChildren : ["row"],
            roleType : null
          },

          "rowheader" : {
            container : ["row"],
            props : ["aria-expanded", "aria-sort", "aria-required", "aria-readonly", "aria-selected"],
            reqProps : null,
            reqChildren : null,
            roleType : null
          },

          "scrollbar" : {
            container : null,
            props : ["aria-valuetext"],
            reqProps : ["aria-controls", "aria-orientation", "aria-valuenow", "aria-valuemax", "aria-valuemin"],
            reqChildren : null,
            roleType : "widget"
          },

          "search" : {
            container : null,
            props : ["aria-expanded"],
            reqProps : ["aria-labelledby"],
            reqChildren : null,
            roleType : "landmark"
          },

          "separator" : {
            container : null,
            props : ["aria-expanded", "aria-orientation"],
            reqProps : null,
            reqChildren : null,
            roleType : null
          },

          "slider" : {
            container : null,
            props : ["aria-orientation", "aria-valuetext"],
            reqProps : ["aria-valuemax", "aria-valuenow", "aria-valuemin"],
            reqChildren : null,
            roleType : "widget"
          },

          "spinbutton" : {
            container : null,
            props : ["aria-required", "aria-valuetext"],
            reqProps : ["aria-valuemax", "aria-valuenow", "aria-valuemin"],
            reqChildren : null,
            roleType : "widget"
          },

          "status" : {
            container : null,
            props : ["aria-expanded"],
            reqProps : null,
            reqChildren : null,
            roleType : null
          },

          "tab" : {
            container : ["tablist"],
            props : ["aria-selected", "aria-expanded"],
            reqProps : null,
            reqChildren : null,
            roleType : null
          },

          "tablist" : {
            container : null,
            props : ["aria-activedescendant", "aria-expanded", "aria-level"],
            reqProps : null,
            reqChildren : ["tab"],
            roleType : null
          },

          "tabpanel" : {
            container : null,
            props : ["aria-expanded"],
            reqProps : null,
            reqChildren : null,
            roleType : null
          },

          "textbox" : {
            container : null,
            props : ["aria-activedescendant", "aria-autocomplete", "aria-multiline", "aria-readonly", "aria-required"],
            reqProps : null,
            reqChildren : null,
            roleType : "widget"
          },

          "timer" : {
            container : null,
            props : ["aria-expanded"],
            reqProps : null,
            reqChildren : null,
            roleType : null
          },

          "toolbar" : {
            container : null,
            props : ["aria-activedescendant", "aria-expanded"],
            reqProps : null,
            reqChildren : null,
            roleType : null
          },

          "tooltip" : {
            container : null,
            props : ["aria-expanded"],
            reqProps : null,
            reqChildren : null,
            roleType : null
          },

          "tree" : {
            container : null,
            props : ["aria-multiselectable", "aria-activedescendant", "aria-expanded", "aria-required"],
            reqProps : null,
            reqChildren : ["group", "treeitem"],
            roleType : null
          },

          "treegrid" : {
            container : null,
            props : ["aria-activedescendant", "aria-expanded", "aria-level", "aria-multiselectable", "aria-readonly", "aria-required"],
            reqProps : null,
            reqChildren : ["row"],
            roleType : null
          },

          "treeitem" : {
            container : ["group", "tree"],
            props : ["aria-checked", "aria-selected", "aria-expanded", "aria-level", "aria-posinset", "aria-setsize"],
            reqProps : null,
            reqChildren : null,
            roleType : null
            }
        },

    fnGetARIAAttributeValueWarnings: function(no, node) { // Based on: http://www.w3.org/TR/wai-aria/states_and_properties
      var doc, sRole='',i, attrName, attrValue, tagName, sMsg;  
      if(node != null && node.hasAttribute) {
        if(node.hasAttribute('role')) { sRole = node.getAttribute('role'); }
        doc=node.ownerDocument;
        tagName = node.tagName.toLowerCase();
        for (i = 0; i < node.attributes.length; i++) {
          attrName = node.attributes[i].name.toLowerCase();
          if(/^aria-/.test(attrName)) {
            attrValue = node.attributes[i].value.toLowerCase();
            switch(attrName) {
              case 'aria-activedescendant': // a single ID that is a descendant or logical descendant
                if(blr.W15yQC.fnStringHasContent(attrValue)) {
                  if(blr.W15yQC.fnIsValidHtmlID(attrValue)) {
                    sMsg = blr.W15yQC.fnListMissingIDs(doc, attrValue);
                    if(sMsg != null) {
                      blr.W15yQC.fnAddNote(no, 'ariaAttributesIDsDontExist', [attrName, sMsg]); // TODO: QA This
                    } else {
                      if(blr.W15yQC.fnIsDescendant(node,doc.getElementById(attrValue))==false) {
                        blr.W15yQC.fnAddNote(no, 'ariaTargetElementIsNotADescendant', [attrValue]); // TODO: QA This
                      }
                    }
                  } else {
                    blr.W15yQC.fnAddNote(no, 'ariaAttributeMustBeValidID', [attrName]); // TODO: QA This
                  }
                }
                break;
              case 'aria-atomic':
                if(blr.W15yQC.fnStringHasContent(attrValue)==true && blr.W15yQC.fnStringIsTrueFalse(attrValue)==false) {
                  blr.W15yQC.fnAddNote(no, 'ariaAttributeMustBeTF', [attrValue, attrName]); // TODO: QA This
                }
                break;
              case 'aria-autocomplete':
                if(/^(combobox|textbox)$/.test(sRole)==false && /^(select|textbox)$/.test(tagName)==false) {
                  if(blr.W15yQC.fnStringHasContent(role)) {
                    blr.W15yQC.fnAddNote(no, 'ariaAttributeWithUnexpectedRole', [attrName,tagName,role]); // TODO: QA This
                  } else {
                    blr.W15yQC.fnAddNote(no, 'ariaAttributeWithUnexpectedTag', [attrName,tagName]); // TODO: QA This
                  }
                }
                if(blr.W15yQC.fnStringHasContent(attrValue)==true && /^(inline|list|both|none)$/.test(attrValue)==false) {
                  blr.W15yQC.fnAddNote(no, 'ariaAttributeValueInvalid', [attrValue,attrName,'inline, list, both, none']); // TODO: QA This
                }
                break;
              case 'aria-busy': // (state)
                if(blr.W15yQC.fnStringHasContent(attrValue)==true && blr.W15yQC.fnStringIsTrueFalse(attrValue)==false) {
                  blr.W15yQC.fnAddNote(no, 'ariaAttributeMustBeTF', [attrValue, attrName]); // TODO: QA This
                }
                break;
              case 'aria-checked': // (state)
                // TODO: What contexts is this valid in?
                if(/^(checkbox|menuitemcheckbox|menuitemradio|option|radio|treeitem)$/.test(sRole)==false) {
                  if(blr.W15yQC.fnStringHasContent(role)) {
                    blr.W15yQC.fnAddNote(no, 'ariaAttributeWithUnexpectedRole', [attrName,tagName,role]); // TODO: QA This
                  } else {
                    blr.W15yQC.fnAddNote(no, 'ariaAttributeWithUnexpectedTag', [attrName,tagName]); // TODO: QA This
                  }
                }
                if(blr.W15yQC.fnStringHasContent(attrValue)==true && /^(true|false|mixed|undefined)$/.test(attrValue)==false) {
                  blr.W15yQC.fnAddNote(no, 'ariaAttributeValueInvalid', [attrValue, attrName,'true, false, mixed, undefined']); // TODO: QA This
                }
                break;
              case 'aria-controls':
                if(blr.W15yQC.fnStringHasContent(attrValue)) {
                  if(blr.W15yQC.fnIsValidHtmlIDList(attrValue)) {
                    sMsg = blr.W15yQC.fnListMissingIDs(doc, attrValue);
                    if(sMsg != null) {
                      blr.W15yQC.fnAddNote(no, 'ariaAttributesIDsDontExist', [attrName, sMsg]); // TODO: QA This
                    }
                  } else {
                    blr.W15yQC.fnAddNote(no, 'ariaAttributeMustBeValidIDList', [attrName]); // TODO: QA this
                  }
                }
                break;
              case 'aria-describedby':
                if(blr.W15yQC.fnStringHasContent(attrValue)) {
                  if(blr.W15yQC.fnIsValidHtmlIDList(attrValue)) {
                    sMsg = blr.W15yQC.fnListMissingIDs(doc, attrValue);
                    if(sMsg != null) {
                      blr.W15yQC.fnAddNote(no, 'ariaAttributesIDsDontExist', [attrName, sMsg]); // TODO: QA This
                    }
                  } else {
                    blr.W15yQC.fnAddNote(no, 'ariaAttributeMustBeValidIDList', [attrName]); // TODO: QA This
                  }
                }
                break;
              case 'aria-disabled': // (state)
                if(blr.W15yQC.fnStringHasContent(attrValue) && blr.W15yQC.fnStringIsTrueFalse(attrValue)==false) {
                  blr.W15yQC.fnAddNote(no, 'ariaAttributeMustBeTF', [attrValue,attrName]); // TODO: QA This
                }
                break;
              case 'aria-dropeffect':
                if(blr.W15yQC.fnStringHasContent(attrValue)==true && /^(copy|move|link|execute|popup|none)(\s+(copy|move|link|execute|popup|none))*$/.test(attrValue)==false) {
                  blr.W15yQC.fnAddNote(no, 'ariaAttributeWithInvalidValue', [attrValue,attrName,'copy, move, link, execute, popup, none']); // TODO: QA This
                }
                if(/none/.test(attrValue) && attrValue != 'none') {
                  sMsg=blr.W15yQC.fnCleanSpaces(attrValue.replace('none',''));
                  blr.W15yQC.fnAddNote(no, 'ariaAttributeValueDoesntMakeSenseWith', [sMsg, attrName, 'none']); // TODO: QA This
                }
                break;
              case 'aria-expanded': // (state)
                // TODO: Figure out how to determine if this is on the right element, or controlling the right element
                if(blr.W15yQC.fnStringHasContent(attrValue)==true && /^(true|false|undefined)$/.test(attrValue)==false) {
                  blr.W15yQC.fnAddNote(no, 'ariaAttributeValueInvalid', [attrValue, attrName,'true, false, undefined']); // TODO: QA This
                }
                break;
              case 'aria-flowto':
                // TODO: determine if we need to detect the path's name (name of target element)
                if(blr.W15yQC.fnStringHasContent(attrValue)) {
                  if(blr.W15yQC.fnIsValidHtmlIDList(attrValue)) {
                    sMsg = blr.W15yQC.fnListMissingIDs(doc, attrValue);
                    if(sMsg != null) {
                      blr.W15yQC.fnAddNote(no, 'ariaAttributesIDsDontExist', [attrName, sMsg]); // TODO: QA This
                    }
                  } else {
                    blr.W15yQC.fnAddNote(no, 'ariaAttributeMustBeValidIDList', [attrName]); // TODO: QA This
                  }
                }
                break;
              case 'aria-grabbed': // (state)
                // TODO: Figure out how to determine if this is on the right element, or controlling the right element
                if(blr.W15yQC.fnStringHasContent(attrValue)==true && /^(true|false|undefined)$/.test(attrValue)==false) {
                  blr.W15yQC.fnAddNote(no, 'ariaAttributeValueInvalid', [attrValue, attrName,'true, false, undefined']); // TODO: QA This
                }
                break;
              case 'aria-haspopup':
                if(blr.W15yQC.fnStringHasContent(attrValue) && blr.W15yQC.fnStringIsTrueFalse(attrValue)==false) {
                  blr.W15yQC.fnAddNote(no, 'ariaAttributeMustBeTF', [,attrValue, attrName]); // TODO: QA This
                }
                break;
              case 'aria-hidden': // (state)
                if(blr.W15yQC.fnStringHasContent(attrValue) && blr.W15yQC.fnStringIsTrueFalse(attrValue)==false) {
                  blr.W15yQC.fnAddNote(no, 'ariaAttributeMustBeTF', [attrValue, attrName]); // TODO: QA This
                }
                break;
              case 'aria-invalid': // (state)
                // TODO: Figure out how to determine if this is on the right element, or controlling the right element
                if(blr.W15yQC.fnStringHasContent(attrValue)==true && /^(true|false|spelling|grammar)$/.test(attrValue)==false) {
                  blr.W15yQC.fnAddNote(no, 'ariaInvalidAttrWUndefValue', [attrValue]); // TODO: QA This
                }
                break;
              case 'aria-label':
                // TODO: Which cases require a value?
                if (blr.W15yQC.fnStringHasContent(attrValue) && blr.W15yQC.fnStringHasContent(node.getAttribute('aria-labelledby'))) {
                  blr.W15yQC.fnAddNote(no, 'ariaHasBothLabelAndLabelledBy'); // TODO: QA This, Make this a real check for content getting replaced.
                }
                break;
              case 'aria-labeledby': 
                blr.W15yQC.fnAddNote(no, 'ariaInvalidAriaLabeledBy');
                break;
              case 'aria-labelledby':
                if(blr.W15yQC.fnStringHasContent(attrValue)) {
                  if(blr.W15yQC.fnIsValidHtmlIDList(attrValue)) {
                    sMsg = blr.W15yQC.fnListMissingIDs(doc, attrValue);
                    if(sMsg != null) {
                      blr.W15yQC.fnAddNote(no, 'ariaAttributesIDsDontExist', [attrName, sMsg]); // TODO: QA this
                    }
                  } else {
                    blr.W15yQC.fnAddNote(no, 'ariaAttributeMustBeValidIDList', [attrName]); // TODO: QA This
                  }
                }
                break;                
              case 'aria-level':
                if(blr.W15yQC.fnIsValidPositiveInt(attrValue)==false || parseInt(sInt,10)<1) {
                  blr.W15yQC.fnAddNote(no, 'ariaAttrMustBePosIntOneOrGreater',[attrValue,attrName]); // TODO: QA This
                }
                break;
              case 'aria-live':
                if(blr.W15yQC.fnStringHasContent(attrValue)==true && /^(assertive|polite|off)$/.test(attrValue)==false) {
                  blr.W15yQC.fnAddNote(no, 'ariaAttributeValueInvalid', [attrValue, attrName,'assertive, polite, off']); // TODO: QA This
                }
                break;
              case 'aria-multiline':
                if(/^(textbox)$/.test(sRole)==false && /^(input|textarea)$/.test(tagName)==false) {
                  if(blr.W15yQC.fnStringHasContent(role)) {
                    blr.W15yQC.fnAddNote(no, 'ariaAttributeWithUnexpectedRole', [attrName,tagName,role]); // TODO: QA This
                  } else {
                    blr.W15yQC.fnAddNote(no, 'ariaAttributeWithUnexpectedTag', [attrName,tagName]); // TODO: QA This
                  }
                }
                if(blr.W15yQC.fnStringHasContent(attrValue) && blr.W15yQC.fnStringIsTrueFalse(attrValue)==false) {
                  blr.W15yQC.fnAddNote(no, 'ariaAttributeMustBeTF', [attrValue, attrName]); // TODO: QA This
                }
                break;
              case 'aria-multiselectable':
                // TODO: Detect appropriate use
                if(blr.W15yQC.fnStringHasContent(attrValue) && blr.W15yQC.fnStringIsTrueFalse(attrValue)==false) {
                  blr.W15yQC.fnAddNote(no, 'ariaAttributeMustBeTF', [attrValue, attrName]); // TODO: QA This
                }
                break;
              case 'aria-orientation':
                if(blr.W15yQC.fnStringHasContent(attrValue)==true && /^(horizontal|vertical)$/.test(attrValue)==false) {
                  blr.W15yQC.fnAddNote(no, 'ariaAttributeValueInvalid', [attrValue, attrName,'horizontal, vertical']); // TODO: QA This
                }
                break;
              case 'aria-owns':
                if(blr.W15yQC.fnStringHasContent(attrValue)) {
                  if(blr.W15yQC.fnIsValidHtmlIDList(attrValue)) {
                    sMsg = blr.W15yQC.fnListMissingIDs(doc, attrValue);
                    if(sMsg != null) {
                      blr.W15yQC.fnAddNote(no, 'ariaAttributesIDsDontExist', [attrName, sMsg]); // TODO: QA This
                    }
                  } else {
                    blr.W15yQC.fnAddNote(no, 'ariaAttributeMustBeValidIDList', [attrName]); // TODO: QA This
                  }
                }
                break;                
              case 'aria-posinset':
                if(node.hasAttribute('aria-setsize')==false) {
                  blr.W15yQC.fnAddNote(no, 'ariaPosInSetWOAriaSetSize'); // TODO: QA This
                }
                if(blr.W15yQC.fnIsValidPositiveInt(attrValue)==false || parseInt(sInt,10)<1) {
                  blr.W15yQC.fnAddNote(no, 'ariaAttrMustBePosIntOneOrGreater',[attrValue,attrName]); // TODO: QA This
                }
                break;
              case 'aria-pressed': // (state)
                if(/^(button)$/.test(sRole)==false && /^(button)$/.test(tagName)==false) {
                  if(blr.W15yQC.fnStringHasContent(role)) {
                    blr.W15yQC.fnAddNote(no, 'ariaAttributeWithUnexpectedRole', [attrName,tagName,role]); // TODO: QA This
                  } else {
                    blr.W15yQC.fnAddNote(no, 'ariaAttributeWithUnexpectedTag', [attrName,tagName]); // TODO: QA This
                  }
                }
                if(blr.W15yQC.fnStringHasContent(attrValue)==true && /^(true|false|mixed|undefined)$/.test(attrValue)==false) {
                  blr.W15yQC.fnAddNote(no, 'ariaAttributeValueInvalid', [attrValue, attrName,'true, false, mixed, undefined']); // TODO: QA This
                }
                break;
              case 'aria-readonly':
                // TODO: Where should this be used?
                if(blr.W15yQC.fnStringHasContent(attrValue) && blr.W15yQC.fnStringIsTrueFalse(attrValue)==false) {
                  blr.W15yQC.fnAddNote(no, 'ariaAttributeMustBeTF', [attrValue, attrName]); // TODO: QA This
                }
                break;
              case 'aria-relevant':
                if(blr.W15yQC.fnStringHasContent(attrValue)==true && /^(additions|removals|text|all)(\s+(additions|removals|text|all))*$/.test(attrValue)==false) {
                  blr.W15yQC.fnAddNote(no, 'ariaAttributeWithInvalidValue', [attrValue,attrName,'copy, move, link, execute, popup, none']); // TODO: QA This
                }
                if(/all/.test(attrValue) && attrValue != 'all') {
                  sMsg = blr.W15yQC.fnCleanSpaces(attrValue.replace('all',''));
                  blr.W15yQC.fnAddNote(no, 'ariaAttributeValueDoesntMakeSenseWith', [sMsg, attrName, 'all']); // TODO: QA This
                }
                break;
              case 'aria-required':
                if(/^(combobox|gridcell|listbox|radiogroup|spinbutton|textbox|tree)$/.test(sRole)==false && /^(input|textarea)$/.test(tagName)==false) {
                  if(blr.W15yQC.fnStringHasContent(role)) {
                    blr.W15yQC.fnAddNote(no, 'ariaAttributeWithUnexpectedRole', [attrName,tagName,role]); // TODO: QA This
                  } else {
                    blr.W15yQC.fnAddNote(no, 'ariaAttributeWithUnexpectedTag', [attrName,tagName]); // TODO: QA This
                  }
                }
                if(blr.W15yQC.fnStringHasContent(attrValue) && blr.W15yQC.fnStringIsTrueFalse(attrValue)==false) {
                  blr.W15yQC.fnAddNote(no, 'ariaAttributeMustBeTF', [attrValue, attrName]); // TODO: QA This
                }
                break;
              case 'aria-selected': // (state)
                if(blr.W15yQC.fnStringHasContent(attrValue)==true && /^(true|false|undefined)$/.test(attrValue)==false) {
                  blr.W15yQC.fnAddNote(no, 'ariaAttributeValueInvalid', [attrValue, attrName,'true, false, undefined']); // TODO QA This
                }
                break;
              case 'aria-setsize':
                if(blr.W15yQC.fnIsValidPositiveInt(attrValue)==false || parseInt(sInt,10)<1) {
                  blr.W15yQC.fnAddNote(no, 'ariaAttrMustBePosIntOneOrGreater',[attrValue,attrName]); // TODO: QA This
                }
                break;
              case 'aria-sort':
                if(blr.W15yQC.fnStringHasContent(attrValue)==true && /^(ascending|descending|none|other)$/.test(attrValue)==false) {
                  blr.W15yQC.fnAddNote(no, 'ariaAttributeValueInvalid', [attrValue, attrName,'ascending, descending, none, other']); // TODO: QA This
                }
                break;
              case 'aria-valuemax':
                if(blr.W15yQC.fnStringHasContent(attrValue)) {
                  if(blr.W15yQC.fnIsValidNumber(attrValue)) {
                    if(blr.W15yQC.fnIsValidNumber(node.getAttribute('aria-valuemin'))) {
                      if(parseFloat(attrValue)<parseFloat(node.getAttribute('aria-valuemin'))) {
                        blr.W15yQC.fnAddNote(no, 'ariaMaxNotGreaterThanAriaMin'); // TODO: QA This
                      }
                    } else {
                      blr.W15yQC.fnAddNote(no, 'ariaMaxWOAriaMin'); // TODO: QA This
                    }
                    if(blr.W15yQC.fnIsValidNumber(node.getAttribute('aria-valuenow'))) {
                      if(parseFloat(attrValue)<parseFloat(node.getAttribute('aria-valuenow'))) {
                        blr.W15yQC.fnAddNote(no, 'ariaMaxNotGreaterThanEqualAriaNow'); // TODO: QA This
                      }
                    }
                  } else {
                    blr.W15yQC.fnAddNote(no, 'ariaAttributeMustBeValidNumber', [attrValue, attrName]); // TODO: QA This
                  }
                }
                break;                
              case 'aria-valuemin':
                if(blr.W15yQC.fnStringHasContent(attrValue)) {
                  if(blr.W15yQC.fnIsValidNumber(attrValue)) {
                    if(blr.W15yQC.fnIsValidNumber(node.getAttribute('aria-valuemin'))==false) {
                      blr.W15yQC.fnAddNote(no, 'ariaMinWOAriaMax'); // TODO: QA This
                    }
                    if(blr.W15yQC.fnIsValidNumber(node.getAttribute('aria-valuenow'))) {
                      if(parseFloat(attrValue)>parseFloat(node.getAttribute('aria-valuenow'))) {
                        blr.W15yQC.fnAddNote(no, 'ariaMinNotLessThanEqualAriaNow'); // TODO: QA This
                      }
                    }
                  } else {
                    blr.W15yQC.fnAddNote(no, 'ariaAttributeMustBeValidNumber', [attrValue, attrName]); // TODO: QA This
                  }
                }
                break;                
              case 'aria-valuenow':
                if(blr.W15yQC.fnStringHasContent(attrValue)) {
                  if(blr.W15yQC.fnIsValidNumber(attrValue)==false) {
                    blr.W15yQC.fnAddNote(no, 'ariaAttributeMustBeValidNumber', [attrValue, attrName]); // TODO: QA This
                  }
                }
                break;                
              case 'aria-valuetext':
                if(blr.W15yQC.fnStringHasContent(attrValue)==false) {
                  if(blr.W15yQC.fnIsValidNumber(node.getAttribute('aria-valuenow'))) {
                    blr.W15yQC.fnAddNote(no, 'ariaEmptyValueTextWValueNowWarning');  // TODO: QA This
                  }
                }
              default:
                blr.W15yQC.fnAddNote(no, 'ariaUnrecognizedARIAAttribute', [attrName]); // TODO: QA This
                break;
            }
          }
        }
      }
    },

    fnInvalidARIAPresentationRoleUse: function(node) { // based on: https://dvcs.w3.org/hg/aria-unofficial/raw-file/tip/index.html#do
      var tagName,type;
      if(node != null && node.tagName) {
        tagName=node.tagName.toLowerCase();
        switch(tagName) {
          case 'a':
          case 'area':
            if(blr.W15yQC.fnStringHasContent(node.getAttribute('href'))) { return true; }
            break;
          case 'dialog':
            if(blr.W15yQC.fnStringHasContent(node.getAttribute('open'))==false) { return true; }
            break;
          case 'input': 
            if(node.hasAttribute('type')==false || node.getAttribute('type').toLowerCase()!='hidden') { return true; }
            break;
          case 'button':
          case 'keygen':
          case 'menu':
          case 'option':
          case 'select':
          case 'textarea':
            return true;
            break;
        }
      }
      if(node.hasAttribute('tabindex') && node.hasAttribute('disabled')==false && node.getAttribute('tabindex')!="-1" && blr.W15yQC.fnNodeIsHidden(node)==false) {
        return true;
      }
      return false;
    },
    
    fnCheckARIARole: function(no, node, sRole) {
      var sMsg, i, c, bFoundRequiredChild, bFoundRequiredContainer, cRole;
      if(blr.W15yQC.ARIAChecks.hasOwnProperty(sRole) == true) {
        // Check for required properties
        if(blr.W15yQC.ARIAChecks[sRole].reqProps != null) {
          sMsg=null;
          for(i=0;i<blr.W15yQC.ARIAChecks[sRole].reqProps.length;i++) {
            if(node.hasAttribute(blr.W15yQC.ARIAChecks[sRole].reqProps[i])==false) { blr.W15yQC.fnJoin(sMsg,blr.W15yQC.ARIAChecks[sRole].reqProps[i],', '); }
          }
        }
        if(sMsg != null) { blr.W15yQC.fnAddNote(no, 'ariaMissingProperties', [sMsg]); } // QA
        // Check validity of the ARIA- attributes
        // TODO: finish this
        
        // Check for required parents
        if(blr.W15yQC.ARIAChecks[sRole].container != null) {
          sMsg=null;
          bFoundRequiredContainer = false;
          c=node.parent;
          while(c != null && bFoundRequiredContainer == false) {
            if(c.hasAttribute && c.hasAttribute('role')) {
              cRole = c.getAttribute('role');
              for(i=0;i<blr.W15yQC.ARIAChecks[sRole].container.length;i++) {
                if(cRole == blr.W15yQC.ARIAChecks[sRole].container[i]) {
                  bFoundRequiredContainer = true;
                  break;
                }
              }
            }
          }
          if(!bFoundRequiredContainer) {
            for(i=0;i<blr.W15yQC.ARIAChecks[sRole].container.length;i++) {
              blr.W15yQC.fnJoin(sMsg,blr.W15yQC.ARIAChecks[sRole].container[i],', ');
            }
            if(sMsg != null) { blr.W15yQC.fnAddNote(no, 'ariaMissingContainer', [sMsg]); } // QA
          }
        }
        // Check for required children
        if(blr.W15yQC.ARIAChecks[sRole].reqChildren != null) {
          sMsg=null;
          bFoundRequiredChild = false;
          // TODO: Finish this
        }        
      }
      return no;
    },
    
    fnAnalyzeARIAMarkupOnNode: function (node, doc, no) {
      var sRole, sMissingIDs, sIDs, i;
      blr.W15yQC.fnLog('analyze aria markup-starts:no:'+no+'--'+no.toString());
      if (node != null && node.hasAttribute && doc != null) {
        if (node.hasAttribute('role')) {
          // TODO: check role values, check for multiple role values
          sRole = blr.W15yQC.fnTrim(node.getAttribute('role'));
          if (sRole != null && sRole.length > 0) {
            if(/[a-z][,\s]+[a-z]/i.test(sRole)) {
              blr.W15yQC.fnAddNote(no, 'ariaMultipleRoleValues'); // TODO: QA This
              sRole=sRole.replace(/^[a-z]+/,'$&');
            }
            switch (sRole.toLowerCase()) {
              // landmarks
            case 'application':
            case 'banner':
            case 'complementary':
            case 'contentinfo':
            case 'form':
            case 'main':
            case 'navigation':
            case 'search':
              // Document Structure
            case 'article':
            case 'columnheader':
            case 'definition':
            case 'directory':
            case 'document':
            case 'group':
            case 'heading':
            case 'img':
            case 'list':
            case 'listitem':
            case 'math':
            case 'note':
            case 'presentation':
            case 'region':
            case 'row':
            case 'rowheader':
            case 'separator':
            case 'toolbar':
              // Widgets
            case 'alert':
            case 'alertdialog':
            case 'button':
            case 'checkbox':
            case 'dialog':
            case 'gridcell':
            case 'link':
            case 'log':
            case 'marquee':
            case 'menuitem':
            case 'menuitemcheckbox':
            case 'menuitemradio':
            case 'option':
            case 'progressbar':
            case 'radio':
            case 'scrollbar':
            case 'slider':
            case 'spinbutton':
            case 'status':
            case 'tab':
            case 'tabpanel':
            case 'textbox':
            case 'timer':
            case 'tooltip':
            case 'treeitem':
              // Composite user interface widgets
            case 'combobox':
            case 'grid':
            case 'listbox':
            case 'menu':
            case 'menubar':
            case 'radiogroup':
            case 'tablist':
            case 'tree':
            case 'treegrid':
              no = blr.W15yQC.fnCheckARIARole(no, node, sRole);
              break;
            case 'command':
            case 'composite':
            case 'input':
            case 'landmark':
            case 'range':
            case 'roletype':
            case 'section':
            case 'sectionhead':
            case 'select':
            case 'structure':
            case 'widget':
            case 'window':
              blr.W15yQC.fnAddNote(no, 'ariaAbstractRole',[sRole]);
              break;
            default:
              blr.W15yQC.fnAddNote(no, 'ariaUnknownRole');
            }
          }
        }

        if (node.hasAttribute('role')==true && node.getAttribute('role').toLowerCase()=='heading' && node.hasAttribute('aria-level')==false) { // TODO: Create a check aria role routine
          blr.W15yQC.fnAddNote(no, 'ariaHeadingMissingAriaLevel');
        }
        blr.W15yQC.fnGetARIAAttributeValueWarnings(no,node);
      }
      blr.W15yQC.fnLog('analyze aria markup:no:'+no+'--'+no.toString());
      return no;
    },

    fnMakeTableSortable: function (node, doc, sTableId) {
      var script = doc.createElement('script');
      script.appendChild(doc.createTextNode('fnMakeTableSortable("' + sTableId + '");'));
      node.appendChild(script);
    },

    fnInitDisplayWindow: function (doc) {
      var topURL, topNav, topNavLI, topNavA, topNavSpan, titleText, outputWindow, reportDoc, bannerDiv, bannerH1, styleRules, styleElement, scriptElement, sScript, contentMeta, genMeta;
      
      topURL = doc.URL;
      titleText = blr.W15yQC.fnGetString('hrsTitle', [topURL]);
      outputWindow = window.open('');
      reportDoc = outputWindow.document;
      
      contentMeta = reportDoc.createElement('meta');
      contentMeta.setAttribute('name','generator');
      contentMeta.setAttribute('content','W15yQC Web Accessibility Quick Check');

      genMeta = reportDoc.createElement('meta');
      genMeta.setAttribute('http-equiv','Content-Type');
      genMeta.setAttribute('content','text/html; charset=utf-8');
      reportDoc.head.appendChild(contentMeta);
      reportDoc.head.appendChild(genMeta);
      reportDoc.title = titleText;

      bannerDiv = reportDoc.createElement('div');
      bannerDiv.setAttribute('id', 'banner');
      bannerDiv.setAttribute('role', 'banner');
      bannerH1 = reportDoc.createElement('h1');
      bannerH1.appendChild(reportDoc.createTextNode(blr.W15yQC.fnGetString('hrsBanner')));
      bannerDiv.appendChild(bannerH1);
      reportDoc.body.appendChild(bannerDiv);

      topNav = reportDoc.createElement('ul');
      topNav.setAttribute('id', 'topNav');
      topNav.setAttribute('role', 'navigation');
      
      topNavLI=reportDoc.createElement('li');
      topNavA=reportDoc.createElement('a');
      topNavA.setAttribute('tabindex','0');
      topNavA.setAttribute('class','collapseAll');
      topNavA.setAttribute('href','javascript:collapseAll()');
      topNavA.appendChild(reportDoc.createTextNode('Collapse All')); // TODO: i18n
      topNavLI.appendChild(topNavA);
      topNav.appendChild(topNavLI);

      topNavLI=reportDoc.createElement('li');
      topNavA=reportDoc.createElement('a');
      topNavA.setAttribute('tabindex','0');
      topNavA.setAttribute('class','expandAll');
      topNavA.setAttribute('href','javascript:expandAll()');
      topNavA.appendChild(reportDoc.createTextNode('Expand All')); // TODO: i18n
      topNavLI.appendChild(topNavA);
      topNav.appendChild(topNavLI);

      topNavLI=reportDoc.createElement('li');
      topNavA=reportDoc.createElement('a');
      topNavA.setAttribute('tabindex','0');
      topNavA.setAttribute('id','displayToggle');
      topNavA.setAttribute('href','javascript:fnToggleDisplayOfNonIssues()');
      topNavA.appendChild(reportDoc.createTextNode('Show Issues Only')); // TODO: i18n
      topNavLI.appendChild(topNavA);
      topNav.appendChild(topNavLI);

      topNavLI=reportDoc.createElement('li');
      topNavA=reportDoc.createElement('a');
      topNavA.setAttribute('tabindex','0');
      topNavA.setAttribute('href','http://blrichwine.github.com/W15yQC/');
      topNavA.appendChild(reportDoc.createTextNode('Help')); // TODO: i18n
      topNavSpan=reportDoc.createElement('span');
      topNavSpan.setAttribute('class','auralText');
      topNavSpan.appendChild(reportDoc.createTextNode(' (opens in a new window)'));
      topNavA.appendChild(topNavSpan);
      topNavLI.appendChild(topNavA);
      topNav.appendChild(topNavLI);

      reportDoc.body.appendChild(topNav);

      reportDoc.body.setAttribute('lang', 'en-US'); // TODO: Get this from FF
      reportDoc.body.setAttribute('dir', 'ltr');

      styleRules = "body { font-family: 'Lucida Sans Unicode', 'Lucida Grande', sans-serif; margin:0; padding:0}";
      styleRules += ".auralText {position:absolute;width:1px;height:1px;overflow:hidden;}";
      styleRules += "a {cursor:pointer !important; color:black; text-decoration:none}";
      styleRules += "a:hover {text-decoration:underline;} a:focus {outline: black dotted thin;}";
      styleRules += "div#banner {background-color:#000}";
      styleRules += "h1 {margin: 0 0 0 12px; padding: 14px 10px 15px 40px; color: #E6E6E6; font-size: 40px; font-weight: lighter; line-height: 32px; font-style: normal;}";
      styleRules += "h1 {background:#000 url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAG6klEQVRYha2Xe1CU1xnGf+d8exF2UTBWJaMUBRRYUEehUS6itExUqDeopjTWOh1SM1OTOJ381ZlOZuwlM23NTE3FaG2SiUFUcNVqUkdbtYKxgcoorrkUawMhCQZ0YVfd2/ed/rHLIuWaic/Mmf3O+eac93mf9/KdFYCp3uk8jhCrlGGg+KpQgEAKga7rJzZUVJQDoa9ygr3e6VSPAl1dXertgwedgByvcRMwQamw37f++wlCCEA85B2jzpVSzEr+Jgdqani6spLiZcvW1hw6dK5y48Zvj0cJCcj+Y6WUaJqGxWLGYjFjNofHaHMptTAlKXG7e5k+fTrLCguXHqqr64g4OCaBgUmEwDunTvKBy8UNlwtN0/jru6eGnbuuX0fTZFSTmNgYenrukJiYyNL8/OmH6+s/GYvEoJdh+aFs9RoE0B+aVWWrB81Ly1YDYBgGuq5H91stFoizR5UoKih4vN7p/Lx83bpERgjHEAJChDOaqF9q0DulBpaFEAgZViAtNZW3a2ujOwzDYFNlJcAUwA64RyEQNiKFQJOS48ecpKakoFQ4yeYvWMjx405mz5o1qEyVUmRnz8PrvUduTg65OTlDDBhh1SzDGR8gEDlVSAES1peXDywrBSjWrls3SCkpZTRkIT3IXbc7SkrXdQzDYNrUqZH9I2PYEPQfjFJRifvjL4TAZDLR2uriustFR0c70ZgomDFzJlkOB1lZmWFV5egtYRABKTWk1Kg7cpjU1DQWLlpE3ZHDpKSkogzFotwcPB4P9XX1JMRPYvXKEhJnJA068PPOds6cPU9zcxMvPP8cmqaNnwARzzdsfCrqdcX3NkAkMb1eL3/at5/Kp8pJSstk5/H3Ob3nMh6fH4lgYqyVFQuT2b7ph9y42sKvfvMymZkZ4yegRQzJaMaHk1AAZk2j9lAt3y1diX1aMmt+7WTz8vlUb5tPSGj0+gzc9wM0XGujbEcdB7aXUvak4vTfz49KYFCA+pPr4MEarvyrmStXwkPTNFquXiMu1kZa9gJ+vLeB6p+uY5FjNr2Glc8emOgKWnArK6lzU3EszGXLH88yN3s+iVOn8Nzz2yv+39awCggpQMAPNj2NQEQTTzNptLS0UFJcxKtnPmJHnsFs9ynoaYfeDvB0gKeddlsOR1JeJu6xOKYlJbHnzA3W5i/h3223tgF/BnxjKhBuRHLgOdKe2262MSc9nUv/8ZKzxArTNEi1w4JpkDcbVmST9MFO7pvMxMSYSU6ZweVbfSSnpIEgHZgwtgIRg2+9+SbpGRlRBQqXLgUDMEL4hRWMHgj0QLAHQndB7wG6oQcsdpjwwIzFBH5MQAhDN4bYGpaAFAIB/GjLFiBcBf2tWVc6RkjHGmMHvQtUL3AXRMS46gQdbDYwIwlKDYs1FkI6BsYQtUdUQDxUAQ+vG7oiFNJJiI+Fs++Auwt6PwV3O9zRQYfOnDLirGAEJaEATIqLxdD1sHojYJhGJNm/fz8ZGZnk5eXR0NBAcfFy0lJTuNp6jSUz57Aj+AaTZlq5L0wETGC1gc0OcVawKvBLxe1uPzlJdlqvu/D5fW2MQGNIEgJUVT1Dfn4+AAUFBRiGYvGSxZz/RyOlyQr3gyCd3Xfx9nVj9vcxwfcAs9eP7g3hvx+kz6PTe9dgRbLk3MVL3Lx5s5oRPsfDVkF4hCtB0zSEEDzxrVz8wSBtrVeoSvcjzBMJ6RaC/gABnw+/L8ADj5+OTp2OdtjqCNLa9B5r1qym5MmVvx8fASmQmuS11/Zw6VIDJrOJffv20tjYQGNjIy9s28aJk+/y0ZX3qEq5Q0aCRogpdHsT+LQ7ji++jGWGprN1rpubrU2cPnuOSfHxPPuTKn676w0Pw3yWBTD1SH19V8X69YRCoajXMFAFD8Pr9bDzlT+gCUH+4lzSM+YgIgmrEHz44ce839zClz13yHA4mJSQQFFRMQlxBv98ZTn5LzZbgcCwBHRdj/aCsdDU3MSF8xdxuW5ESSqlyMpy8J2SYvbue530TAcxcY+xwNZKzrISsE2kYdczePzaklU/b7g8hEC/x7t372bevHkopTAMg6KiIqqrq8nOziZiiYLCwjFJVj27nVJHgLWTT0CMHZYdALuNhl1bKfzZhRgirXnqkaNHH8kfk+FQ82Kuuv1qolI1c5VyZinV26pU0wp1eVeJAiwSxr61fB1Yin/H375wcNvtA58OFzZDcAK6kgCxJgAB3qPHjtkNpca8w40bQiClCSUtd77/y7Oba18q+0uxaOUbGtDXiWIKgEUA8Tabbfa9e/fiH43lIegD7gOTa18quygAIWHDL04+AXwsCLdjO6Ncnb8mApExGXg8YssLfAbcFqNsfNSwALGR3wBhVQL/A5NkaCaixmeaAAAAAElFTkSuQmCC) no-repeat left center}";
      styleRules += "ul#topNav { background-color:#F0F0F0;margin:0; padding: 0 0 0 2px; border-bottom: 1px solid #c5c5bd;list-style-type:none; height:34px; display:block}";
      styleRules += "ul#topNav li { display:block; float:left; list-style: none outside none; margin:0; padding:2px 20px;background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA+gAAAAhCAMAAAB9cnE3AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2hpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYxIDY0LjE0MDk0OSwgMjAxMC8xMi8wNy0xMDo1NzowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDowMTgwMTE3NDA3MjA2ODExOEY2MjhDM0VEODk2NjkzNSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDoyMTNFNzI2NjE2QzMxMUUxOTY2QkE2QzFFNUJDN0U2NiIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDoyMTNFNzI2NTE2QzMxMUUxOTY2QkE2QzFFNUJDN0U2NiIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1LjEgTWFjaW50b3NoIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MDI4MDExNzQwNzIwNjgxMThGNjI4QzNFRDg5NjY5MzUiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MDE4MDExNzQwNzIwNjgxMThGNjI4QzNFRDg5NjY5MzUiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz59AujPAAAAwFBMVEX29vbg4N7w8PD09PTp6enk5OLe3tzj4+Hn5+Xf393FxL///f///v////rDxL7///v//vnExLzFxb39/vjGx7/+//rl5eXh4eH+/fjm5uTt7Or7/PbExb/r6er08vPz8vDBwrrv7e739fbi4uLt6+z9/f/h4d/4+Pr19PLm5ub5+ff7+/v29PXDxLzw7+3+//nu7u7///3i4uDr6+vp6efy8vLv7+/8/Pz4+Pj6+vr39/f//vrl5eP+/v79/f3///+NdNdeAAABVklEQVR42uza2VLCQBCF4Y6agGgwhE1EBfcdFTeESN7/rQi5T81Nxprp+r8X6NPVdZJcRN4BqJY/xi8SOWm/gu05kWdM+f3cj+vXm3/YGE9l7qSggu05c8+Y8vu5H9evN3902+1J4KRGBdtzAs+Y8vu5H9evN/9V1k0lc1LVs8n2nMwzpvx+7sf1680/DIuih05qVrA9J/SMKb+f+3H9evMPRq+uvtGrPt5sz/HtmW7K7+d+XL/e/A+j8VQ+Aag2aMY92QOg28lxKh8AVDvbFv0NgGrXs6Lo3wBUu5glqewA0G2SdOQLgGrnk7gjuwBUe94WHYBul/dF0ZcAVJNl/1QWAFS7WxRF/wWgXL8tPwBUu3k6assagGr5uij6HwDVyqLnAHSj6ABFB6DAweGqRdEBig6AogOg6AAoOoD/Kjq/EwC6lUXnB0FAt7LoKwCqJXHS2ggwAL36KW6IggE3AAAAAElFTkSuQmCC);background-repeat:no-repeat;background-position:100% 0;overflow:hidden;height:34px;line-height:32px}";
      styleRules += "ul#topNav a {padding:0; margin:0}";
      styleRules += "h2,h3,h4,h5,h6 { padding-top: 0; padding-bottom: 0;}";
      styleRules += "h2 {margin: 12px 0 0 5px; }";
      styleRules += "h3 {margin: 5px 0 0 10px; }";
      styleRules += "h4 {margin: 5px 0 0 15px; }";
      styleRules += "h2+p, h2+table, h2+ul, h2+div {margin: 0 3px 0 27px; }";
      styleRules += "h3+p, h3+table, h3+ul {margin: 0 3px 0 32px; }";
      styleRules += "h4+p, h4+table, h4+ul {margin: 0 3px 0 37px; }";
      styleRules += "p, table, ul { padding-top: 0; padding-bottom:0; margin-top: 0; margin-bottom: 3px; }";
      styleRules += ".hideSibling+* {display:none;}";
      styleRules += ".hideSibling a.ec { background-image:url(data:image/gif;base64,R0lGODlhEAAQANUAAO7t7urp6uXk5dPS0+3t7unp6tvb3Onq6uTl5eLj49vc29bX1urq6e7t7dfW1v////n5+fHx8e3t7enp6eXl5ePj4+Dg4Nvb29fX19PT09DQ0MzMzMTExK2trZqampSUlDg4OP///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAACEALAAAAAAQABAAAAZ6wJBwSCwOMZykcsnZDDmah3Q61XyeUSrVioV4O6COF8IVQiNocAcdKYc4g0mn4wF55pPM1byogP6AIAkOe28GF3N1dx0KBoUcFpEWapIWjxQUAgJqFAiYjwEHDAUMoxOjB48AqwQSDQQNEhIEhRsft7i5H05Gvb6/QkEAOw%3D%3D);background-repeat: no-repeat;padding-left: 20px;}";
      styleRules += "a.ec { cursor:pointer;background-position:left center;background-image:url(data:image/gif;base64,R0lGODlhDQANAOYAAK6xr8/Drvz8++Hj5dfSx9ze39fX1r7Bwf/+97m7vPz8+rO2teHi5NTW1M7BrNXY2bq9u7m5utLV2Obn6c/KxN/f3v/99MXIyP336dnUzMLExv//9v///Orbxd/h4tnOva+xsNrb2NHT1e7m2v358uzj1Pj06s/CrsPExeDg383Aq9fX09zY0NDS09fY1djGrNLMwK2wrv//+9HEsba3tv//+NXJtuXn6NPV1+Tm57/Cw9XPxL65sOfp6tHT1O3z9tPW2f/98sLDwd7e3a6wr8/PzdfSyLCxrf39+8vO0eLk5kxMTKCnrrK3vKassf///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAAAAAAALAAAAAANAA0AAAeEgElNTE6Fhk5MTYISA0qOj0oDQIM9T5aXlxOEDE9InkgCAgocBYUFmJgWIoU3TygGQxUpIQdBOIU/FEu7vEs8HoU5T0INKwYuRREYPoUPG08yNQgIJCYlGoUtIywZRgQEOzAfB4gXHTYzJwEBDiovNIk6EAsgRAAAMQBHCYqDh4aJkgQCADs%3D);background-repeat: no-repeat;padding-left:20px;}";
      styleRules += "li.warning {background-color: #FFC900;} li.failed {background-color: #FF7B7B;} li.skippedHeadingLevel {background-color: #FFC900;}";
      styleRules += ".headingNote {font-style:italic;font-size:90%;}";
      styleRules += "li.newDocument { border-top: 1px solid black; }";
      styleRules += ".AIList li:hover { background: none repeat scroll 0 0 #D0DAFD; }";
      styleRules += "li.failed:hover { background: none repeat scroll 0 0 #E66F6F; }";
      styleRules += "li.warning:hover { background: none repeat scroll 0 0 #F1BD00; }";
      styleRules += "#AIDocumentDetails div, #AIHeadingsList div { margin: 5px 20px 20px 20px; padding: 4px; min-width: 480px; border: 1px solid #CCCCCC; box-shadow: 0 1px 0 #FFFFFF inset;}";
      styleRules += "thead tr { background-color: #EEEEEE; border: 1px solid #CCCCCC; box-shadow: 0 1px 0 #FFFFFF inset; }";
      styleRules += "table { border-collapse: collapse; font-size: 12px; margin: 20px; text-align: left; min-width: 480px; border: 1px solid #CCCCCC; box-shadow: 0 1px 0 #FFFFFF inset;}";
      styleRules += "th { margin:0;color: #000; font-size: 13px; font-weight: normal; padding: 8px; border-right: none; border-left: 1px solid #FFFFFF; box-shadow: -1px 0 0 #DDDDDD;}";
      styleRules += "th {white-space:nowrap;}";
      styleRules += "th:last-of-type {min-width: 150px; border-right:none; box-shadow: none}";
      styleRules += "th a {margin-right:15px}";
      styleRules += "th a:before {content:\"\";float:right;width:10px;height:16px;margin:0 0 0 5px;z-index: -1;opacity: 1;background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH1AgLBBMlj+gFUAAAADFJREFUeNpjYMAEPlCMAhixKEIGW7Ap9GHADrYgK8SlCMNk6gGirSbZMwSDh4HYAAcAlJYHN316hgAAAAAASUVORK5CYII%3D) no-repeat 0 0;background-position:right center;}";
      styleRules += "th.SortedAsc1 a:before,th.SortedAsc2 a:before,th.SortedAsc3 a:before,th.SortedAsc4 a:before,th.SortedAsc5 a:before {background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAMAAAC67D+PAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAAGUExURQAAAP///6XZn90AAAACdFJOU/8A5bcwSgAAAENJREFUeNpiYAQCBgYQCRBADGAWmA0QQAwQFogNEEAMUBaQDRBADAgAEEBgDRAAEEBITIAAQmICBBASEyCAkJgAAQYADRsAR8j1xfwAAAAASUVORK5CYII%3D) no-repeat 0 0;background-position:right center;}";
      styleRules += "th.SortedDes1 a:before, th.SortedDes2 a:before, th.SortedDes3 a:before, th.SortedDes4 a:before, th.SortedDes5 a:before {background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAMAAAC67D+PAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAAGUExURQAAAP///6XZn90AAAACdFJOU/8A5bcwSgAAAEFJREFUeNpiYIQDgABiQDABAgiJCRBASEyAAEJiAgQQAwIABBADI5wBEEBABVAWI0AAMUAVASmAAGKAaACRAAEGABHVAEeRYKW7AAAAAElFTkSuQmCC) no-repeat 0 0;background-position:right center;}";
      styleRules += "th.SortedAsc2 a:before, th.SortedDes2 a:before {opacity: 0.5;}";
      styleRules += "th.SortedAsc3 a:before, th.SortedDes3 a:before {opacity: 0.3;}";
      styleRules += "th.SortedAsc4 a:before, th.SortedDes4 a:before {opacity: 0.2;}";
      styleRules += "th.SortedAsc5 a:before, th.SortedDes5 a:before {opacity: 0.15;}";
      styleRules += "td { margin:0; background: none repeat scroll 0 0 #E8EDFF; border-top: 1px solid #FFFFFF; color: #000; padding: 8px; border-left: 1px solid #B9C9FE; }";
      styleRules += "tr.warning td { background-color: #FFC900; color: #000;} tr.failed td { background-color: #FF7B7B; color: #000}";
      styleRules += "#AIARIAElementsList ul ul {border-left:1px solid #757575;margin-left:5px;padding-left:8px} #AIARIAElementsList li {list-style:none;overflow:auto;width:100%;min-width:800px}";
      styleRules += "td:first-child, th:first-child { border-left: none !important; box-shadow:none;}";
      styleRules += "td ul{padding-left:12px}";
      styleRules += "tbody tr:hover td { background: none repeat scroll 0 0 #D0DAFD; }";
      styleRules += "tbody tr.failed:hover td { background: none repeat scroll 0 0 #E66F6F; }";
      styleRules += "tbody tr.warning:hover td { background: none repeat scroll 0 0 #F1BD00; }";
      styleRules += "div#AIFooter {background-color:#000;margin-top:10px;padding:0}";
      styleRules += "div#AIFooter p {color:#fff;padding:5px 0 5px 10px;font-size:70%;margin:0}";

      styleElement = reportDoc.createElement('style');
      styleElement.setAttribute("type", "text/css");
      styleElement.appendChild(reportDoc.createTextNode(styleRules));
      reportDoc.head.appendChild(styleElement);

      scriptElement = reportDoc.createElement('script');
      sScript = "function ec(node, sLinkText) { if(node.parentNode.getAttribute('class')=='hideSibling'){node.parentNode.setAttribute('class','');node.innerHTML='<span class=\"auralText\">"+blr.W15yQC.fnGetString('hrsHide')+" </span>'+sLinkText}else{node.parentNode.setAttribute('class','hideSibling');node.innerHTML='<span class=\"auralText\">"+blr.W15yQC.fnGetString('hrsReveal')+" </span>'+sLinkText}}";
      sScript += "function collapseAll() {var nodesList=window.top.content.document.getElementsByClassName('ec');for(var i=0;i<nodesList.length;i++){;nodesList[i].parentNode.setAttribute('class','hideSibling')}}";
      sScript += "function expandAll() {var nodesList=window.top.content.document.getElementsByClassName('ec');for(var i=0;i<nodesList.length;i++){;nodesList[i].parentNode.setAttribute('class','')}}";
      sScript += "function fnToggleDisplayOfNonIssues(){var a=document.getElementById('displayToggle');var b=document.getElementsByTagName('tr');if(/"+blr.W15yQC.fnGetString('hrsShowIssuesOnly')+"/.test(a.innerHTML)==true){a.innerHTML='"+blr.W15yQC.fnGetString('hrsShowAll')+"';if(b!=null&&b.length>1&&b[0].getElementsByTagName){for(var c=0;c<b.length;c++){if(/warning|failed/.test(b[c].className)!=true){var d=b[c].getElementsByTagName('th');if(d==null||d.length<1){b[c].setAttribute('style','display:none')}}}}}else{a.innerHTML='"+blr.W15yQC.fnGetString('hrsShowIssuesOnly')+"';if(b!=null&&b.length>1&&b[0].getElementsByTagName){for(var c=0;c<b.length;c++){if(b[c].getAttribute('style')=='display:none'){b[c].setAttribute('style','')}}}}}";
      sScript += "var sortData = function(originalRowNumber, columnData) {this.originalRowNumber = originalRowNumber;this.columnData = columnData;};";
      sScript += "sortData.prototype = {originalRowNumber: null,columnData: null};";
      sScript += "function fnMakeTableSortable(sTableID) {if(sTableID != null){var table = document.getElementById(sTableID);if(table != null && table.getElementsByTagName){var tableHead = table.getElementsByTagName('thead')[0];if(tableHead != null && tableHead.getElementsByTagName) {var tableHeaderCells = tableHead.getElementsByTagName('th'); if(tableHeaderCells != null) { for(var i=0; i<tableHeaderCells.length; i++) { var newTh = tableHeaderCells[i].cloneNode(false); newTh.innerHTML = '<a href=\"javascript:sortTable=\\''+sTableID+'\\';sortCol=\\''+i+'\\';\" onclick=\"fnPerformStableTableSort(\\''+sTableID+'\\','+i+');return false;\">'+tableHeaderCells[i].innerHTML+'</a>'; tableHeaderCells[i].parentNode.replaceChild(newTh, tableHeaderCells[i]); }}}}}}";
      sScript += "function fnPerformStableTableSort(tableID,sortOnColumnNumber){try{if(tableID!=null&&sortOnColumnNumber!=null){var table=document.getElementById(tableID);if(table!=null&&table.getElementsByTagName){var tableHead=table.getElementsByTagName('thead')[0];var tableBody=table.getElementsByTagName('tbody')[0];if(tableBody!=null&&tableBody.getElementsByTagName){var tableBodyRows=tableBody.getElementsByTagName('tr');if(tableBodyRows!=null&&tableBodyRows.length>1&&tableBodyRows[0].getElementsByTagName){var sortOrder='a';var columnHeaders=tableHead.getElementsByTagName('th');var sortColumnHeader=columnHeaders[sortOnColumnNumber];var currentSortIndicatorMatch=/\\bSorted...(\\d+)\\b/.exec(sortColumnHeader.className);var currentSortDepth=999;if(currentSortIndicatorMatch!=null&&currentSortIndicatorMatch.length>1){currentSortDepth=parseInt(currentSortIndicatorMatch[1],10);}if(/\\bSortedAsc/.test(sortColumnHeader.className)== true){sortOrder='d';sortColumnHeader.className=sortColumnHeader.className.replace(/\\bSortedAsc\\d+\\b/,'SortedDes1');}else if(/\\bSortedDes/.test(sortColumnHeader.className)== true){sortOrder='a';sortColumnHeader.className=sortColumnHeader.className.replace(/\\bSortedDes\\d+\\b/,'SortedAsc1');}else{sortOrder='a';sortColumnHeader.className += ' SortedAsc1';}for(var i=0;i<columnHeaders.length;i++){if(i==sortOnColumnNumber)continue;var sortIndicatorMatch=/\\bSorted(...)(\\d+)/.exec(columnHeaders[i].className);if(sortIndicatorMatch!=null){var sortDepth=999;if(sortIndicatorMatch!=null&&sortIndicatorMatch.length>1){sortDepth=parseInt(sortIndicatorMatch[2],10);}if(sortDepth<=currentSortDepth){columnHeaders[i].className=columnHeaders[i].className.replace(/\\bSorted...\\d+\\b/,'Sorted'+sortIndicatorMatch[1]+(sortDepth+1));}}}var tableRowsSortDataCache=[];var numberOfColumns=0;for(var i=0;i<tableBodyRows.length;i++){var rowDataCells=tableBodyRows[i].getElementsByTagName('td');tableRowsSortDataCache.push(new sortData(i,(/^\\s*\\d+\\s*$/.test(rowDataCells[sortOnColumnNumber].innerHTML)==true?parseInt(rowDataCells[sortOnColumnNumber].innerHTML,10):rowDataCells[sortOnColumnNumber].innerHTML)));}if(sortOrder=='a'){for(var i=0;i<tableRowsSortDataCache.length;i++){for(var j=i+1;j<tableRowsSortDataCache.length;j++){if(tableRowsSortDataCache[i].columnData>tableRowsSortDataCache[j].columnData ||(tableRowsSortDataCache[i].columnData==tableRowsSortDataCache[i].columnData&&tableRowsSortDataCache[i].originalRowNumber>tableRowsSortDataCache[j].originalRowNumber)){var tmpRow=tableRowsSortDataCache[i];tableRowsSortDataCache[i]=tableRowsSortDataCache[j];tableRowsSortDataCache[j]=tmpRow;}}}}else{for(var i=0;i<tableRowsSortDataCache.length;i++){for(var j=i+1;j<tableRowsSortDataCache.length;j++){if(tableRowsSortDataCache[i].columnData<tableRowsSortDataCache[j].columnData ||(tableRowsSortDataCache[i].columnData==tableRowsSortDataCache[i].columnData&&tableRowsSortDataCache[i].originalRowNumber>tableRowsSortDataCache[j].originalRowNumber)){var tmpRow=tableRowsSortDataCache[i];tableRowsSortDataCache[i]=tableRowsSortDataCache[j];tableRowsSortDataCache[j]=tmpRow;}}}}var sortedTBody=document.createElement('tbody');for(var i=0;i<tableRowsSortDataCache.length;i++){sortedTBody.appendChild(tableBodyRows[tableRowsSortDataCache[i].originalRowNumber].cloneNode(true));}table.replaceChild(sortedTBody,tableBody);}}}}}catch(ex){}}";
      sScript += "document.addEventListener('keypress',function(e){if(e.which==104){e.stopPropagation();e.preventDefault();scrollToNextHeading()}else if(e.which==72){e.stopPropagation();e.preventDefault();scrollToPreviousHeading()}},false);function scrollToNextHeading(){var aH2s=document.getElementsByTagName('h2');var bMadeJump=false;for(var i=0;i<aH2s.length-1;i++){if(aH2s[i]===document.activeElement){aH2s[i+1].scrollIntoView(true);aH2s[i+1].focus();var a=aH2s[i-1].getElementsByTagName('a');if(a!=null)a[0].focus();bMadeJump=true;break}}if(bMadeJump==false){for(var i=0;i<aH2s.length;i++){if(nodeY(aH2s[i])>window.scrollY){aH2s[i].scrollIntoView(true);aH2s[i].focus();var a=aH2s[i].getElementsByTagName('a');if(a!=null)a[0].focus();break}}}}function scrollToPreviousHeading(){var aH2s=document.getElementsByTagName('h2');var bMadeJump=false;for(var i=1;i<aH2s.length;i++){if(aH2s[i]===document.activeElement){aH2s[i-1].scrollIntoView(true);aH2s[i-1].focus();var a=aH2s[i-1].getElementsByTagName('a');if(a!=null)a[0].focus();bMadeJump=true;break}}if(bMadeJump==false){var previousElement=document.body;for(var i=0;i<aH2s.length;i++){if(nodeY(aH2s[i])>=window.scrollY){previousElement.scrollIntoView(true);previousElement.focus();var a=previousElement.getElementsByTagName('a');if(a!=null)a[0].focus();break}previousElement=aH2s[i]}}}function nodeY(node){var y=node.offsetTop;while(node.offsetParent!=null&&node.offsetParent!=node.ownerDocument){node=node.offsetParent;y+=node.offsetTop}return y}";
      scriptElement.appendChild(reportDoc.createTextNode("/*<![CDATA[*/ " + sScript + " /*]]>*/"));
      reportDoc.head.appendChild(scriptElement);

      return reportDoc;
    },

    fnDisplayFooter: function (rd) {
      var div, p, scriptElement, sScript;
      div = rd.createElement('div');
      div.setAttribute('id', 'AIFooter');
      div.setAttribute('role', 'contentinfo');
      div.setAttribute('aria-label', 'Footer');
      p = rd.createElement('p');
      p.appendChild(rd.createTextNode(blr.W15yQC.fnGetString('hrsFooter',[blr.W15yQC.version])));
      div.appendChild(p);
      rd.body.appendChild(div);

      if(Application.prefs.getValue("extensions.W15yQC.HTMLReport.collapsedByDefault",false) || Application.prefs.getValue("extensions.W15yQC.HTMLReport.showOnlyIssuesByDefault",false)) {
        scriptElement = rd.createElement('script');
        sScript = '';
        if(Application.prefs.getValue("extensions.W15yQC.HTMLReport.collapsedByDefault",false)) {
          sScript = 'collapseAll();';
        }
        if(Application.prefs.getValue("extensions.W15yQC.HTMLReport.showOnlyIssuesByDefault",false)) {
          sScript += 'fnToggleDisplayOfNonIssues();';
        }
        scriptElement.appendChild(rd.createTextNode("/*<![CDATA[*/ " + sScript + " /*]]>*/"));
        rd.body.appendChild(scriptElement);
      }
      
    },

    
    /*
   */
    fnMakeHeadingCountsString: function (listObj, keyPlural, keyNone) {
      var sDocumentsSectionHeading='', s='';
      
      if(listObj && (listObj.warningCount && listObj.warningCount>0) ||(listObj.failedCount && listObj.failedCount>0)) {
        try{
          if(listObj.warningCount && listObj.warningCount==1) {
            s=' (1 warning, ';
          } else {
            s=' ('+listObj.warningCount.toString()+' with warnings, '; // TODO: i18n this!
          }
          if(listObj.failedCount && listObj.failedCount==1) {
            s=s+'1 failure)';
          } else {
            s=s+listObj.failedCount.toString()+' with failures)';
          }
        }
        catch(ex){ s='FAILED'+ex.toString();}
      }
      if (listObj && listObj.length && listObj.length > 0) {
        sDocumentsSectionHeading = blr.W15yQC.fnGetString(keyPlural) + ': ' + listObj.length.toString();
      } else {
        sDocumentsSectionHeading = blr.W15yQC.fnGetString(keyNone);
      }

      return sDocumentsSectionHeading+s;
    },
    
    fnUpdateWarningAndFailureCounts: function(listObject) {
      var i;
      if(listObject!=null && listObject.length) {
        listObject.warningCount=0;
        listObject.failedCount=0;
        for(i=0;i<listObject.length;i++) {
          if(listObject[i].failed) {
            listObject.failedCount++;
          } else if(listObject[i].warning) {
            listObject.warningCount++;
          }
        }
        if(listObject.pageLevel) {
          if(listObject.pageLevel.failed) {
            listObject.failedCount++;
          } else if(listObject.pageLevel.warning) {
            listObject.warningCount++;
          }
        }
      }
    },
    
    fnGetFrameTitles: function (doc, rootNode, aFramesList) {
      var c, frameTitle, frameSrc, frameId, frameName, role, xPath, nodeDescription, frameDocument;
      if (aFramesList == null) { aFramesList = []; }

      if (doc != null) {
        if (rootNode == null) { rootNode = doc.body; }
        for (c = rootNode.firstChild; c != null; c = c.nextSibling) {
          if (c.nodeType == 1) { // Only pay attention to element nodes
            if (c.tagName && ((c.contentWindow && c.contentWindow.document !== null) || (c.contentDocument && c.contentDocument.body !== null)) && blr.W15yQC.fnNodeIsHidden(c) == false) { // Found a frame
              // document the frame
              frameTitle = blr.W15yQC.fnGetNodeAttribute(c, 'title', null);
              frameSrc = blr.W15yQC.fnGetNodeAttribute(c, 'src', null);
              frameId = blr.W15yQC.fnGetNodeAttribute(c, 'id', null);
              frameName = blr.W15yQC.fnGetNodeAttribute(c, 'name', null);
              role = blr.W15yQC.fnGetNodeAttribute(c, 'role', null);
              xPath = blr.W15yQC.fnGetElementXPath(c);
              nodeDescription = blr.W15yQC.fnDescribeElement(c, 400);
              aFramesList.push(new blr.W15yQC.frameElement(c, xPath, nodeDescription, doc, aFramesList.length, role, frameId, frameName, frameTitle, frameSrc));
              // get frame contents
              frameDocument = c.contentWindow ? c.contentWindow.document : c.contentDocument;
              blr.W15yQC.fnGetFrameTitles(frameDocument, frameDocument.body, aFramesList);
            } else { // keep looking through current document
              blr.W15yQC.fnGetFrameTitles(doc, c, aFramesList);
            }
          }
        }
      }
      return aFramesList;
    },

    fnAnalyzeFrameTitles: function (aFramesList, aDocumentsList) {
      var i, framedDocumentBody, j;
      if(blr.W15yQC.sb == null) { blr.W15yQC.fnInitStringBundles(); }
      // Check if frame titles are empty, too short, only ASCII symbols, the same as other frame titles, or sounds like any other frame titles
      for (i = 0; i < aFramesList.length; i++) {
        aFramesList[i].ownerDocumentNumber = blr.W15yQC.fnGetOwnerDocumentNumber(aFramesList[i].node, aDocumentsList);
        framedDocumentBody = null;
        if(aFramesList[i].node != null) {
          if(aFramesList[i].node.contentWindow != null && aFramesList[i].node.contentWindow.document && aFramesList[i].node.contentWindow.document.body) {
            framedDocumentBody = aFramesList[i].node.contentWindow.document.body;
          } else if(aFramesList[i].node.contentDocument && aFramesList[i].node.contentDocument.body) {
            framedDocumentBody = aFramesList[i].node.contentDocument.body;
          }
        }
        aFramesList[i].containsDocumentNumber = blr.W15yQC.fnGetOwnerDocumentNumber(framedDocumentBody, aDocumentsList);
        if (aFramesList[i].title != null && aFramesList[i].title.length && aFramesList[i].title.length > 0) {
          aFramesList[i].title = blr.W15yQC.fnCleanSpaces(aFramesList[i].title);
          aFramesList[i].soundex = blr.W15yQC.fnSetIsEnglishLocale(aDocumentsList[aFramesList[i].ownerDocumentNumber-1].language) ? blr.W15yQC.fnGetSoundExTokens(aFramesList[i].title) : '';
        } else {
          aFramesList[i].soundex = '';
        }
      }
      for (i = 0; i < aFramesList.length; i++) {
        if (blr.W15yQC.fnGetNodeAttribute(aFramesList[i].node, 'src', 'about:blank').toLowerCase() == 'about:blank') {
          blr.W15yQC.fnAddNote(aFramesList[i], 'frameContentScriptGenerated');
        }
        if (aFramesList[i].title == null) {
          blr.W15yQC.fnAddNote(aFramesList[i], 'frameTitleMissing'); // QA iframeTests01.html
        } else if (aFramesList[i].title != null && aFramesList[i].title.length > 0) {
          if (blr.W15yQC.fnOnlyASCIISymbolsWithNoLettersOrDigits(aFramesList[i].title)) {
            blr.W15yQC.fnAddNote(aFramesList[i], 'frameTitleOnlyASCII'); // QA iframeTests01.html
          } else if (blr.W15yQC.fnIsMeaningfulDocTitleText (aFramesList[i].title) == false) { // TODO: QA This
            blr.W15yQC.fnAddNote(aFramesList[i], 'frameTitleNotMeaningful'); // TODO: QA This
          }
          for (j = 0; j < aFramesList.length; j++) {
            if (j != i) {
              if (aFramesList[j].title != null && aFramesList[j].title.length > 0) {
                if (blr.W15yQC.fnStringsEffectivelyEqual(aFramesList[i].title, aFramesList[j].title)) {
                  blr.W15yQC.fnAddNote(aFramesList[i], 'frameTitleNotUnique'); // QA iframeTests01.html
                } else if (aFramesList[i].soundex.length>2 && aFramesList[i].soundex == aFramesList[j].soundex) {
                  blr.W15yQC.fnAddNote(aFramesList[i], 'frameTitleSoundsSame'); // QA iframeTests01.html
                }
              }
            }
          }
        } else {
          blr.W15yQC.fnAddNote(aFramesList[i], 'frameTitleEmpty'); // QA iframeTests01.html
        }
        if(aFramesList[i].node != null && aFramesList[i].node.hasAttribute('id')==true) {
          if(blr.W15yQC.fnIsValidHtmlID(aFramesList[i].node.getAttribute('id'))==false) {
            blr.W15yQC.fnAddNote(aFramesList[i], 'frameIDNotValid'); // QA iframeTests01.html
          }
          if(aDocumentsList[aFramesList[i].ownerDocumentNumber-1].idHashTable.getItem(aFramesList[i].node.getAttribute('id'))>1) {
            blr.W15yQC.fnAddNote(aFramesList[i], 'frameIDNotUnique'); // QA iframeTests01.html
          }
        }
      }
      blr.W15yQC.fnUpdateWarningAndFailureCounts(aFramesList);
    },

    fnDisplayWindowDetails: function (rd) {
      var div, div2, element;
      div = rd.createElement('div');
      div.setAttribute('id', 'AIDocumentDetails');
      blr.W15yQC.fnAppendExpandContractHeadingTo(div, rd, blr.W15yQC.fnGetString('hrsWindowDetails'));
      div2 = rd.createElement('div');
      element = rd.createElement('h3');
      element.appendChild(rd.createTextNode(blr.W15yQC.fnGetString('hrsWindowTitle')));
      div2.appendChild(element);

      element = rd.createElement('p');
      element.appendChild(rd.createTextNode(window.top.content.document.title));
      div2.appendChild(element);

      element = rd.createElement('h3');
      element.appendChild(rd.createTextNode(blr.W15yQC.fnGetString('hrsWindowURL')));
      div2.appendChild(element);

      element = rd.createElement('p');
      element.appendChild(rd.createTextNode(window.top.content.document.URL));
      div2.appendChild(element);

      div.appendChild(div2);
      rd.body.appendChild(div);
    },

    fnDisplayFrameTitleResults: function (rd, aFramesList) {
      var div, table, msgHash, tbody, i, sNotes, sClass;
      div = rd.createElement('div');
      div.setAttribute('id', 'AIFramesList');

      blr.W15yQC.fnAppendExpandContractHeadingTo(div, rd, blr.W15yQC.fnMakeHeadingCountsString(aFramesList, 'hrsFrames', 'hrsNoFrames'));

      if (aFramesList && aFramesList.length > 0) {
        table = rd.createElement('table');
        table.setAttribute('id', 'AIFramesTable');
        table = blr.W15yQC.fnCreateTableHeaders(rd, table, [blr.W15yQC.fnGetString('hrsTHNumberSym'), blr.W15yQC.fnGetString('hrsTHFrameElement'),
                                                            blr.W15yQC.fnGetString('hrsTHOwnerDocNumber'), blr.W15yQC.fnGetString('hrsTHContainsDocNumber'),
                                                            blr.W15yQC.fnGetString('hrsTHTitle'), blr.W15yQC.fnGetString('hrsTHSrc'),
                                                            blr.W15yQC.fnGetString('hrsTHNotes')]);
        msgHash = new blr.W15yQC.HashTable();
        tbody = rd.createElement('tbody');
        for (i = 0; i < aFramesList.length; i++) {
          sNotes = blr.W15yQC.fnMakeHTMLNotesList(aFramesList[i], msgHash);
          sClass = '';
          if (aFramesList[i].failed) {
            sClass = 'failed';
          } else if (aFramesList[i].warning) {
            sClass = 'warning';
          }
          blr.W15yQC.fnAppendTableRow(rd, tbody, [i + 1, blr.W15yQC.fnMakeWebSafe(aFramesList[i].nodeDescription), aFramesList[i].ownerDocumentNumber, aFramesList[i].containsDocumentNumber, aFramesList[i].title, aFramesList[i].src, sNotes], sClass);
        }
        table.appendChild(tbody);
        div.appendChild(table);
        blr.W15yQC.fnMakeTableSortable(div, rd, 'AIFramesTable');
      } else {
        blr.W15yQC.fnAppendPElementTo(div, rd, blr.W15yQC.fnGetString('hrsNoFramesDetected'));
      }
      rd.body.appendChild(div);
    },

    fnGetDocumentLanguage: function (doc) {
      var aHTMLList;
      if (doc != null) {
        if (doc.body && doc.body.hasAttribute && doc.body.hasAttribute('lang')) {
          return doc.body.getAttribute('lang');
        }
        if (doc.getElementsByTagName) {
          aHTMLList = doc.getElementsByTagName('html');
          if (aHTMLList && aHTMLList.length > 0 && aHTMLList[0].hasAttribute && aHTMLList[0].hasAttribute('lang')) {
            return aHTMLList[0].getAttribute('lang');
          }
        }
      }
      return null;
    },

    fnGetDocumentDirection: function (doc) {
      if (doc != null && doc.getElementsByTagName) {
        var aHTMLList = doc.getElementsByTagName('html');
        if (aHTMLList && aHTMLList.length > 0 && aHTMLList[0].hasAttribute && aHTMLList[0].hasAttribute('dir')) {
          return aHTMLList[0].getAttribute('dir');
        }
      }
      if (doc != null && doc.body && doc.body.hasAttribute && doc.body.hasAttribute('dir')) {
        return doc.body.getAttribute('dir');
      }
      return null;
    },

    fnGetDocType: function (doc) {
      var sDocType;
      if (doc !== null && doc.doctype !== null && doc.doctype.name !== null) {
        sDocType = doc.doctype.name;
        if (doc.doctype.publicId) { sDocType = sDocType + ' PUBLIC "' + doc.doctype.publicId + '"'; }
        if (doc.doctype.systemId) { sDocType = sDocType + ' "' + doc.doctype.systemId + '"'; }
        if (doc.doctype.internalSubset) { sDocType = sDocType + ' [' + doc.doctype.internalSubset + ']'; }
        return sDocType;
      }
      return null;
    },

    fnGetDocuments: function (doc, rootNode, aDocumentsList) {
      var docNumber, c, sID, idCount, frameDocument,style,bUsesFullJustifiedText=false;
       // QA Framesets - framesetTest01.html
       // QA iFrames - iframeTests01.html
      // TODO: Store framing node (frameset, iframe, object, etc.)
      if (doc != null) {
        if (aDocumentsList == null) {
          aDocumentsList = [];
          // Put the top window's document in the list
          aDocumentsList.push(new blr.W15yQC.documentDescription(doc, doc.URL, aDocumentsList.length, doc.title, blr.W15yQC.fnGetDocumentLanguage(doc), blr.W15yQC.fnGetDocumentDirection(doc), doc.compatMode, blr.W15yQC.fnGetDocType(doc)));
        }
        docNumber = aDocumentsList.length - 1;

        if (rootNode == null) { rootNode = doc.body; }
        if (rootNode != null && rootNode.firstChild != null) {
          for (c = rootNode.firstChild; c != null; c = c.nextSibling) {
            if (c.nodeType == 1) { // Only pay attention to element nodes
              style = window.getComputedStyle(c, null);
              if(style!=null) {
                if(/justify/i.test(style.getPropertyValue('text-align'))) {
                  bUsesFullJustifiedText=true;
                }
              }
              if (c.tagName && c.hasAttribute('id') == true) {
                sID = blr.W15yQC.fnTrim(c.getAttribute('id'));
                idCount = 1;
                if(aDocumentsList[docNumber].idHashTable.hasItem(sID)) {
                  idCount = aDocumentsList[docNumber].idHashTable.getItem(sID)+1;
                  aDocumentsList[docNumber].IDsUnique = false;
                  if(idCount == 2) {
                    if(aDocumentsList[docNumber].nonUniqueIDs.length<5) {
                      aDocumentsList[docNumber].nonUniqueIDs.push(sID);
                    }
                    aDocumentsList[docNumber].nonUniqueIDsCount++;
                    blr.W15yQC.fnLog('non unique id found');
                  }
                }
                aDocumentsList[docNumber].idHashTable.setItem(sID, idCount);
                if(blr.W15yQC.fnIsValidHtmlID(sID) == false) {
                  aDocumentsList[docNumber].IDsValid = false;
                  if(idCount < 2 && aDocumentsList[docNumber].invalidIDs.length<5) {
                    aDocumentsList[docNumber].invalidIDs.push(sID);
                    aDocumentsList[docNumber].invalidIDsCount++;
                  }
                }
              }
  
              if (c.tagName && ((c.contentWindow && c.contentWindow.document !== null) || (c.contentDocument && c.contentDocument.body !== null)) && blr.W15yQC.fnNodeIsHidden(c) == false) { // Found a frame
                // Document the new document
                frameDocument = c.contentWindow ? c.contentWindow.document : c.contentDocument;
                // TODO: for blank/missing src attributes on frames, should this blank out the URL? Right now it reports the parent URL
                aDocumentsList.push(new blr.W15yQC.documentDescription(frameDocument, frameDocument.URL, aDocumentsList.length, frameDocument.title, blr.W15yQC.fnGetDocumentLanguage(frameDocument), blr.W15yQC.fnGetDocumentDirection(frameDocument), doc.compatMode, blr.W15yQC.fnGetDocType(frameDocument)));
  
                // get frame contents
                blr.W15yQC.fnGetDocuments(frameDocument, frameDocument.body, aDocumentsList);
              } else { // keep looking through current document
                blr.W15yQC.fnGetDocuments(doc, c, aDocumentsList);
              }
            }
          }
        }
      }
      if(bUsesFullJustifiedText) {
        blr.W15yQC.fnAddNote(aDocumentsList[aDocumentsList.length-1], 'docUsesFullJustifiedText');
      }
      return aDocumentsList;
    },

    fnAnalyzeDocuments: function (aDocumentsList) {
      var i, aSameTitles, j, k, sIDList, selectorTest, doc, suspectCSS='';
      if(blr.W15yQC.sb == null) { blr.W15yQC.fnInitStringBundles(); }
      if (aDocumentsList !== null && aDocumentsList.length) {
        for (i = 0; i < aDocumentsList.length; i++) { // TODO: Add is meaningful document title check
          suspectCSS='';
          if (aDocumentsList[i].title == null) {
            blr.W15yQC.fnAddNote(aDocumentsList[i], 'docTitleMissing'); // QA iframeTests01.html -- TODO: Can't produce, scan this be detected?
          } else if (blr.W15yQC.fnCleanSpaces(aDocumentsList[i].title).length < 1) {
            blr.W15yQC.fnAddNote(aDocumentsList[i], 'docTitleEmpty'); // QA contents_of_frame_1.html
          }
          if (aDocumentsList[i].language == null) {
            blr.W15yQC.fnAddNote(aDocumentsList[i], 'docLangNotGiven'); // QA contents_of_frame_3.html
          } else {
            if (!aDocumentsList[i].language.length || aDocumentsList[i].language.length < 1) {
              blr.W15yQC.fnAddNote(aDocumentsList[i], 'docLangNotSpecified'); // QA firstNested.html
            } else if (blr.W15yQC.fnIsValidLocale(aDocumentsList[i].language) == false) {
              if(/_/.test(aDocumentsList[i].language)) {
                blr.W15yQC.fnAddNote(aDocumentsList[i], 'docLangAttrInvalidUseUnderscore',[aDocumentsList[i].language]); // QA iframeTests01.html
              } else {
                blr.W15yQC.fnAddNote(aDocumentsList[i], 'docInvalidLang', [aDocumentsList[i].language]); // QA iframeTests01.html
              }
            }
          }
          aSameTitles = [];
          if(aDocumentsList[i].title != null && aDocumentsList[i].title.length>0) {
            for (j=0; j < aDocumentsList.length; j++) {
              if(i != j) {
                if(blr.W15yQC.fnStringsEffectivelyEqual(aDocumentsList[i].title, aDocumentsList[j].title)) {
                  aSameTitles.push(j+1);
                }
              }
            }
            if(aSameTitles.length>0) {
              blr.W15yQC.fnAddNote(aDocumentsList[i], 'docTitleNotUnique', [blr.W15yQC.fnCutoffString(aSameTitles.toString(),99)]); //QA iframeTests01.html
            }
          }
          if (aDocumentsList[i].IDsUnique == false) {
            aDocumentsList[i].warning = true;
            sIDList = aDocumentsList[i].nonUniqueIDs.toString().replace(/,/g,', ');
            if(aDocumentsList[i].nonUniqueIDsCount>5) { sIDList = sIDList + '...'; }

            sIDList = blr.W15yQC.fnCutoffString(sIDList, 150);
            blr.W15yQC.fnAddNote(aDocumentsList[i], 'docNonUniqueIDs',[aDocumentsList[i].nonUniqueIDsCount, sIDList]);  // QA iframeTests01.html
          }
          if (aDocumentsList[i].IDsValid == false) {
            sIDList = aDocumentsList[i].invalidIDs.toString().replace(/,/g,', ');
            if(aDocumentsList[i].invalidIDsCount>5) { sIDList = sIDList + '...'; }
            sIDList = blr.W15yQC.fnCutoffString(sIDList, 150);
            blr.W15yQC.fnAddNote(aDocumentsList[i], 'docInvalidIDs',[aDocumentsList[i].invalidIDsCount,sIDList]); // QA iframeTests01.html
          }

          selectorTest = /{[^:]outline[^:]*:[^;}]+(\b0|none)/;
          doc=aDocumentsList[i].doc;
          for(j = 0; j < doc.styleSheets.length; ++j) {
            for(k = 0; k < doc.styleSheets[j].cssRules.length; ++k) {
              if(selectorTest.test(doc.styleSheets[j].cssRules[k].cssText)){
                suspectCSS=blr.W15yQC.fnJoinIfNew(suspectCSS, doc.styleSheets[j].cssRules[k].cssText,' ');
              }
            }
          }
          if(suspectCSS!='') {
            blr.W15yQC.fnAddNote(aDocumentsList[i], 'docCSSSuppressingOutline',[blr.W15yQC.fnCutoffString(suspectCSS,500)]); // 
          }
        }
      }
      blr.W15yQC.fnUpdateWarningAndFailureCounts(aDocumentsList);
    },

    fnDisplayDocumentsResults: function (rd, aDocumentsList) {
      var div, table, msgHash, tbody, i, dd, sNotes, sClass;
      div = rd.createElement('div');
      div.setAttribute('id', 'AIDocumentsList');
// (listObj, keyPlural, keyNone)

      blr.W15yQC.fnAppendExpandContractHeadingTo(div, rd, blr.W15yQC.fnMakeHeadingCountsString(aDocumentsList, 'hrsDocuments', 'hrsNoDocuments'));

      if (aDocumentsList && aDocumentsList.length > 0) {
        table = rd.createElement('table');
        table.setAttribute('id', 'AIDocumentsTable');

        table = blr.W15yQC.fnCreateTableHeaders(rd, table, [blr.W15yQC.fnGetString('hrsTHDocumentNumber'), blr.W15yQC.fnGetString('hrsTHTitle'),
                                                            blr.W15yQC.fnGetString('hrsTHLanguage'), blr.W15yQC.fnGetString('hrsTHDirection'),
                                                            blr.W15yQC.fnGetString('hrsTHDocumentURL'), blr.W15yQC.fnGetString('hrsTHCompatMode'),
                                                            blr.W15yQC.fnGetString('hrsTHDoctype'),blr.W15yQC.fnGetString('hrsTHNotes')]);
        msgHash = new blr.W15yQC.HashTable();
        tbody = rd.createElement('tbody');
        for (i = 0; i < aDocumentsList.length; i++) {
          dd = aDocumentsList[i];
          sNotes = blr.W15yQC.fnMakeHTMLNotesList(dd, msgHash);
          sClass = '';
          if (dd.failed) {
            sClass = 'failed';
          } else if (dd.warning) {
            sClass = 'warning';
          }
          blr.W15yQC.fnAppendTableRow(rd, tbody, [i + 1, dd.title, dd.language, dd.dir, dd.URL, dd.compatMode, dd.docType, sNotes], sClass);
        }
        table.appendChild(tbody);
        div.appendChild(table);
        blr.W15yQC.fnMakeTableSortable(div, rd, 'AIDocumentsTable');
      } else {
        blr.W15yQC.fnAppendPElementTo(div, rd, blr.W15yQC.fnGetString('hrsNoDocumentsDetected'));
      }
      rd.body.appendChild(div);
    },

    fnIsDescendant: function(parent, child) {
      var node;
      if(child != null) {
        node = child.parentNode;
        while (node != null) {
         if (node === parent) { return true; }
         node = node.parentNode;
        }
      }
      return false;
    },

    fnGetARIALandmarks: function (doc, rootNode, aARIALandmarksList, baseLevel) {
      var c, level, i, frameDocument, sTagName, sRole, xPath, nodeDescription, sARIALabel, sState;
      if (aARIALandmarksList == null) { aARIALandmarksList = []; } 
      if (baseLevel == null) { baseLevel = 0; }

      if (doc != null) {
        if (rootNode == null) { rootNode = doc.body; }
        for (c = rootNode.firstChild; c != null; c = c.nextSibling) {
          if (c.nodeType == 1) { // Only pay attention to element nodes
            if (((c.contentWindow && c.contentWindow.document !== null) || (c.contentDocument && c.contentDocument.body !== null)) && blr.W15yQC.fnNodeIsHidden(c) == false) { // Found a frame
              // determine level, and then get frame contents
              level = baseLevel+1;
              for(i=aARIALandmarksList.length-1; i>=0; i--) {
                if(blr.W15yQC.fnIsDescendant(aARIALandmarksList[i].node,c)==true) {
                  level = aARIALandmarksList[i].level+1;
                  break;
                }
              }            
              frameDocument = c.contentWindow ? c.contentWindow.document : c.contentDocument;
              blr.W15yQC.fnGetARIALandmarks(frameDocument, frameDocument.body, aARIALandmarksList, level);
            } else { // keep looking through current document
              if (c.hasAttribute && c.hasAttribute('role') == true && blr.W15yQC.fnNodeIsHidden(c) == false) {
                sTagName = c.tagName.toLowerCase();
                sRole = c.getAttribute('role');
                switch (sRole) {
                  case 'application':
                  case 'banner':
                  case 'complementary':
                  case 'contentinfo':
                  case 'form':
                  case 'main':
                  case 'navigation':
                  case 'search':
                    // Document landmark: node, nodeDescription, doc, orderNumber, role value, ariaLabel
                    xPath = blr.W15yQC.fnGetElementXPath(c);
                    nodeDescription = blr.W15yQC.fnDescribeElement(c, 400);
                    sARIALabel = null;
                    level = baseLevel+1;
                    for(i=aARIALandmarksList.length-1; i>=0; i--) {
                      if(blr.W15yQC.fnIsDescendant(aARIALandmarksList[i].node,c)==true) {
                        level = aARIALandmarksList[i].level+1;
                        break;
                      }
                    }
                    if (c.hasAttribute('aria-label') == true) {
                      sARIALabel = c.getAttribute('aria-label');
                    } else if (c.hasAttribute('aria-labelledby') == true) {
                      sARIALabel = blr.W15yQC.fnGetTextFromIdList(c.getAttribute('aria-labelledby'), doc);
                    }
                    sState = blr.W15yQC.fnGetNodeState(c);
                    aARIALandmarksList.push(new blr.W15yQC.ariaLandmarkElement(c, xPath, nodeDescription, doc, aARIALandmarksList.length, level, sRole, sARIALabel, sState));
                    break;
                }
              }
              blr.W15yQC.fnGetARIALandmarks(doc, c, aARIALandmarksList);
            }
          }
        }
      }
      return aARIALandmarksList;
    },

    fnAnalyzeARIALandmarks: function (aARIALandmarksList, aDocumentsList) {
      var iMainLandmarkCount, iBannerLandmarkCount, iContentInfoLandmarkCount, i, sRoleAndLabel, aSameLabelText, j, sRoleAndLabel2;
      if(blr.W15yQC.sb == null) { blr.W15yQC.fnInitStringBundles(); }
      // TODO: Learn what is important to analyze in ARIA landmarks!
      
      if (aARIALandmarksList != null && aARIALandmarksList.length) {
        iMainLandmarkCount = 0;
        iBannerLandmarkCount = 0;
        iContentInfoLandmarkCount = 0;
        for (i = 0; i < aARIALandmarksList.length; i++) {
          aARIALandmarksList[i].ownerDocumentNumber = blr.W15yQC.fnGetOwnerDocumentNumber(aARIALandmarksList[i].node, aDocumentsList);
          blr.W15yQC.fnAnalyzeARIAMarkupOnNode(aARIALandmarksList[i].node, aARIALandmarksList[i].doc, aARIALandmarksList[i]);
          if(aARIALandmarksList[i].role.toLowerCase() == 'main') {
            iMainLandmarkCount++;
          } else if(aARIALandmarksList[i].role.toLowerCase() == 'banner') {
            iBannerLandmarkCount++;
          } if(aARIALandmarksList[i].role.toLowerCase() == 'contentinfo') {
            iContentInfoLandmarkCount++;
          } 
          sRoleAndLabel = blr.W15yQC.fnCleanSpaces(blr.W15yQC.fnJoin(aARIALandmarksList[i].role, aARIALandmarksList[i].label, ' '));
          
          aSameLabelText = [];
          for (j = 0; j < aARIALandmarksList.length; j++) {
            if (i != j) {
              sRoleAndLabel2 = blr.W15yQC.fnCleanSpaces(blr.W15yQC.fnJoin(aARIALandmarksList[j].role, aARIALandmarksList[j].label, ' '));
              if (blr.W15yQC.fnStringsEffectivelyEqual(sRoleAndLabel, sRoleAndLabel2)) {
                aSameLabelText.push(j+1);
              }
            }
          }
          
          if(aSameLabelText.length>0) {
            if(blr.W15yQC.fnStringHasContent(aARIALandmarksList[i].label)) {
              blr.W15yQC.fnAddNote(aARIALandmarksList[i], 'ldmkAndLabelNotUnique', [blr.W15yQC.fnCutoffString(aSameLabelText.toString(),99)]);   // QA ariaTests01.html
            } else {
              blr.W15yQC.fnAddNote(aARIALandmarksList[i], 'ldmkNotUnique', [blr.W15yQC.fnCutoffString(aSameLabelText.toString(),99)]); // QA ariaTests01.html
            }
          }
          
          if(aARIALandmarksList[i].node != null && aARIALandmarksList[i].node.hasAttribute('id')==true) {
            if(blr.W15yQC.fnIsValidHtmlID(aARIALandmarksList[i].node.getAttribute('id'))==false) {
              blr.W15yQC.fnAddNote(aARIALandmarksList[i], 'ldmkIDNotValid');
            }
            if(aDocumentsList[aARIALandmarksList[i].ownerDocumentNumber-1].idHashTable.getItem(aARIALandmarksList[i].node.getAttribute('id'))>1) {
              blr.W15yQC.fnAddNote(aARIALandmarksList[i], 'ldmkIDNotUnique');
            }
          }
        }
        if(iMainLandmarkCount < 1) {
          blr.W15yQC.fnAddPageLevelNote(aARIALandmarksList, 'ldmkMainLandmarkMissing'); // TODO: QA This
        } else if(iMainLandmarkCount > 1) {
          blr.W15yQC.fnAddPageLevelNote(aARIALandmarksList, 'ldmkMultipleMainLandmarks', [iMainLandmarkCount]); // TODO: QA This
        }
        if(iBannerLandmarkCount > 1) {
          blr.W15yQC.fnAddPageLevelNote(aARIALandmarksList, 'ldmkMultipleBannerLandmarks', [iBannerLandmarkCount]); // TODO: QA This
        }
        if(iContentInfoLandmarkCount > 1) {
          blr.W15yQC.fnAddPageLevelNote(aARIALandmarksList, 'ldmkMultipleContentInfoLandmarks', [iContentInfoLandmarkCount]); // TODO: QA This
        }
      }
      blr.W15yQC.fnUpdateWarningAndFailureCounts(aARIALandmarksList);
    },

    fnDisplayARIALandmarksResults: function (rd, aARIALandmarksList) {
      var div, table, msgHash, tbody, i, lo, sPadding, j, sNotes, sClass;
      div = rd.createElement('div');
      div.setAttribute('id', 'AIARIALandmarksList');

      blr.W15yQC.fnAppendExpandContractHeadingTo(div, rd, blr.W15yQC.fnMakeHeadingCountsString(aARIALandmarksList,'hrsARIALandmarks','hrsNoARIALandmarks'));

      if (aARIALandmarksList && (aARIALandmarksList.length > 0 || (aARIALandmarksList.pageLevel && aARIALandmarksList.pageLevel.notes && aARIALandmarksList.pageLevel.notes.length>0))) {
        table = rd.createElement('table');
        table.setAttribute('id', 'AIIARIALandmarksTable');
        table = blr.W15yQC.fnCreateTableHeaders(rd, table, [blr.W15yQC.fnGetString('hrsTHNumberSym'), blr.W15yQC.fnGetString('hrsLandmarkElement'),
                                                            blr.W15yQC.fnGetString('hrsTHOwnerDocNumber'), blr.W15yQC.fnGetString('hrsTHLevel'),
                                                            blr.W15yQC.fnGetString('hrsTHRole'), blr.W15yQC.fnGetString('hrsTHARIALabel'),
                                                            blr.W15yQC.fnGetString('hrsTHState'), blr.W15yQC.fnGetString('hrsTHNotes')]);
        msgHash = new blr.W15yQC.HashTable();
        tbody = rd.createElement('tbody');
        // Elements
        for (i = 0; i < aARIALandmarksList.length; i++) {
          lo = aARIALandmarksList[i];
          sPadding = '';
          for(j=1; j<lo.level; j++) {
            sPadding += '&nbsp;';
          }
          sNotes = blr.W15yQC.fnMakeHTMLNotesList(lo, msgHash);
          sClass = '';
          if (lo.failed) {
            sClass = 'failed';
          } else if (lo.warning) {
            sClass = 'warning';
          }
          blr.W15yQC.fnAppendTableRow(rd, tbody, [i + 1, sPadding+blr.W15yQC.fnMakeWebSafe(lo.nodeDescription), lo.ownerDocumentNumber, lo.level, lo.role, lo.label, lo.stateDescription, sNotes], sClass);
        }
        // Page Level
        if(aARIALandmarksList.pageLevel && aARIALandmarksList.pageLevel.notes) {
          for (i = 0; i < aARIALandmarksList.pageLevel.notes.length; i++) {
            lo = aARIALandmarksList.pageLevel;
            sNotes = blr.W15yQC.fnMakeHTMLNotesList(lo, msgHash);
            sClass = '';
            if (lo.failed) {
              sClass = 'failed';
            } else if (lo.warning) {
              sClass = 'warning';
            }
            blr.W15yQC.fnAppendTableRow(rd, tbody, [i + 1 + aARIALandmarksList.length, '--'+blr.W15yQC.fnGetString('hrsPageLevel')+'--', '', '', '', '', '', sNotes], sClass);
          }
        }
        
        table.appendChild(tbody);
        div.appendChild(table);
        blr.W15yQC.fnMakeTableSortable(div, rd, 'AIIARIALandmarksTable');
      } else {
        blr.W15yQC.fnAppendPElementTo(div, rd, blr.W15yQC.fnGetString('hrsNoARIALandmarksDetected'));
      }
      rd.body.appendChild(div);
    },

    fnGetARIAElements: function (doc, rootNode, aARIAElementsList, ARIAElementStack) {
      var c, frameDocument, sTagName, xPath, nodeDescription, sRole, sARIALabel, sState; 
      if (aARIAElementsList == null) { aARIAElementsList = []; }
      if (ARIAElementStack == null) { ARIAElementStack = []; }
      if (doc != null) {
        if (rootNode == null) { rootNode = doc.body; }
        for (c = rootNode.firstChild; c != null; c = c.nextSibling) {
          if (c.nodeType == 1) { // Only pay attention to element nodes
            if (c.tagName && ((c.contentWindow && c.contentWindow.document !== null) || (c.contentDocument && c.contentDocument.body !== null)) && blr.W15yQC.fnNodeIsHidden(c) == false) { // Found a frame
              // get frame contents
              frameDocument = c.contentWindow ? c.contentWindow.document : c.contentDocument;
              blr.W15yQC.fnGetARIAElements(frameDocument, frameDocument.body, aARIAElementsList, null);
            } else { // keep looking through current document
              if (c != null && c.hasAttribute && c.tagName && blr.W15yQC.fnElementUsesARIA(c) == true) {
                sTagName = c.tagName.toLowerCase();
                while(ARIAElementStack.length>0 && blr.W15yQC.fnIsDescendant(ARIAElementStack[ARIAElementStack.length-1],c) == false) {
                  ARIAElementStack.pop();
                }
                  // Document ARIA Element: node, nodeDescription, doc, orderNumber, role value, ariaLabel
                  xPath = blr.W15yQC.fnGetElementXPath(c);
                  nodeDescription = blr.W15yQC.fnDescribeElement(c, 400);
                  sRole = c.getAttribute('role');
                  // TODO: Don't restrict this to just an ARIA label, other elements may be involved.
                  sARIALabel = null;
                  if (c.hasAttribute('aria-label') == true) {
                    sARIALabel = c.getAttribute('aria-label');
                  } else if (c.hasAttribute('aria-labelledby') == true) {
                    sARIALabel = blr.W15yQC.fnGetTextFromIdList(c.getAttribute('aria-labelledby'), doc);
                  }
                  sState = blr.W15yQC.fnGetNodeState(c);
                  aARIAElementsList.push(new blr.W15yQC.ariaElement(c, xPath, nodeDescription, doc, aARIAElementsList.length, ARIAElementStack.length+1, sRole, sARIALabel, sState));
                  ARIAElementStack.push(c);
              }
              blr.W15yQC.fnGetARIAElements(doc, c, aARIAElementsList, ARIAElementStack);
            }
          }
        }
      }
      return aARIAElementsList;
    },

    fnAnalyzeARIAElements: function (aARIAElementsList, aDocumentsList) { // TODO: Finish this
      var i, sRoleAndLabel, sRoleAndLabel2, j;
      if(blr.W15yQC.sb == null) { blr.W15yQC.fnInitStringBundles(); }
      // TODO: Learn what is important to analyze in ARIA
      if (aARIAElementsList != null && aARIAElementsList.length) {

        for (i = 0; i < aARIAElementsList.length; i++) {
          aARIAElementsList[i].ownerDocumentNumber = blr.W15yQC.fnGetOwnerDocumentNumber(aARIAElementsList[i].node, aDocumentsList);
          aARIAElementsList[i].stateDescription = blr.W15yQC.fnGetNodeState(aARIAElementsList[i].node);
          blr.W15yQC.fnAnalyzeARIAMarkupOnNode(aARIAElementsList[i].node, aARIAElementsList[i].doc, aARIAElementsList[i]);

          if(aARIAElementsList[i].node != null && aARIAElementsList[i].node.hasAttribute('id')==true) {
            if(blr.W15yQC.fnIsValidHtmlID(aARIAElementsList[i].node.getAttribute('id'))==false) {
              blr.W15yQC.fnAddNote(aARIAElementsList[i], 'ariaIDNotValid');
            }
            if(aDocumentsList[aARIAElementsList[i].ownerDocumentNumber-1].idHashTable.getItem(aARIAElementsList[i].node.getAttribute('id'))>1) {
              blr.W15yQC.fnAddNote(aARIAElementsList[i], 'ariaIDNotUnique');
            }
          }
        }
      }
      blr.W15yQC.fnUpdateWarningAndFailureCounts(aARIAElementsList);
      return aARIAElementsList;
    },

    fnDisplayARIAElementsResults: function (rd, aARIAElementsList) {
      var div, innerDiv, list, previousHeadingLevel, previousDocument, i, sDoc, nextLogicalLevel, j, li, divARIAEl, divWidth, sNotesTxt, sMessage, span;
      div = rd.createElement('div');
      innerDiv = rd.createElement('div');
      div.setAttribute('id', 'AIARIAElementsList');
      div.setAttribute('class', 'AIList');

      blr.W15yQC.fnAppendExpandContractHeadingTo(div, rd, blr.W15yQC.fnMakeHeadingCountsString(aARIAElementsList,'hrsARIAEls','hrsNoARIAEls'));

      if (aARIAElementsList && aARIAElementsList.length > 0) {

        list = [];
        list.push(rd.createElement('ul'));
        previousHeadingLevel = 0;

        previousDocument = null;
        if (aARIAElementsList && aARIAElementsList.length && aARIAElementsList.length > 0) { previousDocument = aARIAElementsList[0].doc; }
        for (i = 0; i < aARIAElementsList.length; i++) {
          sDoc = '';
          if (i == 0) {
            sDoc = 'Contained in doc #' + aARIAElementsList[i].ownerDocumentNumber;
          }
          nextLogicalLevel = parseInt(previousHeadingLevel,10) + 1;
          for (j = nextLogicalLevel; j < aARIAElementsList[i].level; j++) {
            // Add "skipped" heading levels
            li = rd.createElement('li');
            if (previousDocument != aARIAElementsList[i].doc) {
              blr.W15yQC.fnAddClass(li, 'newDocument');
              sDoc = 'In doc #' + aARIAElementsList[i].ownerDocumentNumber;
              previousDocument = aARIAElementsList[i].doc;
            }
            li.appendChild(rd.createTextNode("[h" + j + "] Missing Heading"));
            li.setAttribute('class', 'skippedHeadingLevel');
            if (previousHeadingLevel > 0) {
              list.push(rd.createElement('ul'));
            }
            list[list.length - 1].appendChild(li);
            previousHeadingLevel = j;
          }

          li = rd.createElement('li');
          if (previousDocument != aARIAElementsList[i].doc) {
            blr.W15yQC.fnAddClass(li, 'newDocument');
            sDoc = 'In doc #' + aARIAElementsList[i].ownerDocumentNumber;
            previousDocument = aARIAElementsList[i].doc;
          }
          divARIAEl = rd.createElement('div');
          divWidth = 600-aARIAElementsList[i].level*15;
          divARIAEl.setAttribute('style','float:left;width:'+divWidth+'px');
          divARIAEl.appendChild(rd.createTextNode(aARIAElementsList[i].nodeDescription));
          li.appendChild(divARIAEl);
          sNotesTxt = blr.W15yQC.fnMakeTextNotesList(aARIAElementsList[i]);
          sMessage = blr.W15yQC.fnJoin(sDoc, blr.W15yQC.fnJoin(sNotesTxt, aARIAElementsList[i].stateDescription, ', state:'), ' - ');
          if (sMessage != null && sMessage.length != null && sMessage.length > 0) {
            span = rd.createElement('span');

            span.appendChild(rd.createTextNode(' (' + sMessage + ')'));
            span.setAttribute('class', 'headingNote');
            li.appendChild(span);
          }

          if (aARIAElementsList[i].failed) {
            li.setAttribute('class', 'failed');
          } else if (aARIAElementsList[i].warning) {
            li.setAttribute('class', 'warning');
          }
          if (aARIAElementsList[i].nodeDescription != null) { li.setAttribute('title', aARIAElementsList[i].nodeDescription); }

          if (aARIAElementsList[i].level > previousHeadingLevel && previousHeadingLevel > 0) {
            list.push(rd.createElement('ul'));
          } else {
            while (aARIAElementsList[i].level < previousHeadingLevel) {
              list[list.length - 2].appendChild(list[list.length - 1]);
              list.pop();
              previousHeadingLevel--;
            }
          }
          list[list.length - 1].appendChild(li);
          previousHeadingLevel = parseInt(aARIAElementsList[i].level,10);
        }
        while (list.length > 1) {
          list[list.length - 2].appendChild(list[list.length - 1]);
          list.pop();
        }
        innerDiv.appendChild(list[0]);
        div.appendChild(innerDiv);
      } else {
        blr.W15yQC.fnAppendPElementTo(div, rd, blr.W15yQC.fnGetString('hrsNoARIAElsDetected'));
      }
      rd.body.appendChild(div);
    },

    fnGetColorString: function(ic) {
        return '#'+('000000'+ic.toString(16)).substr(-6).toUpperCase();
    },
    
    fnParseCSSColorValues: function(sColor) {
      if(sColor != null && sColor.match) {
        var aMatches = sColor.match(/^\s*rgb\((\d+),\s*(\d+),\s*(\d+)\)\s*$/i);
        if(aMatches != null) {
          return [aMatches[1],aMatches[2],aMatches[3]];
        }
      }
      return null;
    },
    
    fnCalculateLuminance: function(r,g,b){
        r = r <= 0.03928 ? r / 12.92 : Math.pow(((r+0.055)/1.055), 2.4);
        g = g <= 0.03928 ? g / 12.92 : Math.pow(((g+0.055)/1.055), 2.4);
        b = b <= 0.03928 ? b / 12.92 : Math.pow(((b+0.055)/1.055), 2.4);
        return 0.2126*r + 0.7152*g + 0.0722*b;
    },

    fnComputeWCAG2LuminosityRatio: function(r1,g1,b1, r2,g2,b2) {
        var l1 = blr.W15yQC.fnCalculateLuminance(r1/255, g1/255, b1/255),
            l2 = blr.W15yQC.fnCalculateLuminance(r2/255, g2/255, b2/255);
        return Math.round(((l1 >= l2) ? (l1 + 0.05) / (l2 + 0.05) : (l2 + 0.05) / (l1 + 0.05)) *100) / 100;
    },

    fnGetColorValues: function(el) {
      var style, textSize, textWeight, bBgImage, bgTransparent, el2, style2, fgColor, bgColor, aFGColor, aBGColor;
      style = window.getComputedStyle(el, null);
      if(style!=null) {
        textSize = style.getPropertyValue('font-size');
        textWeight = style.getPropertyValue('font-weight');
        bBgImage = style.getPropertyValue('background-image').toLowerCase()!=='none';
        bgTransparent = style.getPropertyValue('background-color').toLowerCase()=='transparent';
        el2=el;
        while(bBgImage==false && bgTransparent==true && el2.parentNode != null) {
          el2=el2.parentNode;
          if(el2.nodeType==1) {
            style2 = window.getComputedStyle(el2, null); 
            if(style2!=null && style2.getPropertyValue('background-image').toLowerCase() !=='none' && bgTransparent==true) {
              bBgImage=true;
              blr.W15yQC.fnLog('gcv-newspulse-foundImage:'+el.tagName+' -- '+el2.tagName+' '+style2.getPropertyValue('background-image'));
              break;
            } else {
              bgTransparent = style2.getPropertyValue('background-color').toLowerCase()=='transparent';
            }
          }
        }

        fgColor=style.getPropertyValue('color');
        el2=el;
        while(/transparent/i.test(fgColor) && el2.parentNode != null) {
          el2=el2.parentNode;
          if(el2.nodeType==1) {
            style2 = window.getComputedStyle(el2, null);
            if(style2!=null) {
              fgColor=style2.getPropertyValue('background-color');
            }
          }
        }
        if(/transparent/i.test(fgColor)) { fgColor = 'rgb(0, 0, 0)'; }
        
        bgColor=style.getPropertyValue('background-color');
        el2=el;
        while(/transparent/i.test(bgColor) && el2.parentNode != null) {
          el2=el2.parentNode;
          if(el2.nodeType==1) {
            style2 = window.getComputedStyle(el2, null);
            if(style2!=null) {
              bgColor=style2.getPropertyValue('background-color');
            }
          }
        }
        if(/transparent/i.test(bgColor)) { bgColor = 'rgb(255, 255, 255)'; }

        aFGColor = blr.W15yQC.fnParseCSSColorValues(fgColor);
        aBGColor = blr.W15yQC.fnParseCSSColorValues(bgColor);
        if(aFGColor != null && aBGColor != null) { return [aFGColor[0], aFGColor[1], aFGColor[2], aBGColor[0], aBGColor[1], aBGColor[2], textSize, textWeight, bBgImage]; }
      }
      return null;
    },
    
    fnGetLuminosityCheckElements: function(doc, rootNode, aLumCheckList, parentsColor, parentsBGColor) {
      var c, frameDocument, tagName, aColors, xPath, nodeDescription, sText, sTextSize, fgColor, bgColor, textWeight, bBgImage, fgLum, bgLum, lRatio;
      if (aLumCheckList == null) { aLumCheckList = []; }

      if (doc != null) {
        if (rootNode == null) { rootNode = doc.body; }
        for (c = rootNode.firstChild; c != null; c = c.nextSibling) {
          if (c.nodeType == 1) { // Only pay attention to element nodes
            if (c.tagName && ((c.contentWindow && c.contentWindow.document !== null) ||
                              (c.contentDocument && c.contentDocument.body !== null)) && blr.W15yQC.fnNodeIsHidden(c) == false) { // Found a frame
              // get frame contents
              frameDocument = c.contentWindow ? c.contentWindow.document : c.contentDocument;
              blr.W15yQC.fnGetLuminosityCheckElements(frameDocument, frameDocument.body, aLumCheckList);
            } else { // keep looking through current document
              if (c.tagName && blr.W15yQC.fnNodeIsHidden(c) == false) {
                tagName = c.tagName.toLowerCase();
                if(tagName != 'script' && tagName != 'style' && tagName != 'option' && blr.W15yQC.fnElementHasOwnContent(c)) {
                  aColors = blr.W15yQC.fnGetColorValues(c);
                  xPath = blr.W15yQC.fnGetElementXPath(c);
                  nodeDescription = blr.W15yQC.fnDescribeElement(c, 400);
                  sText = blr.W15yQC.fnElementsOwnContent(c);
                  if(aColors != null) {
                    fgColor = [aColors[0], aColors[1], aColors[2]];
                    bgColor = [aColors[3], aColors[4], aColors[5]];
                    sTextSize = aColors[6];
                    textWeight = aColors[7];
                    bBgImage = aColors[8];
                    //fgLum;
                    //bgLum;
                    lRatio = blr.W15yQC.fnComputeWCAG2LuminosityRatio(aColors[0], aColors[1], aColors[2], aColors[3], aColors[4], aColors[5]);
                    aLumCheckList.push(new blr.W15yQC.contrastElement(c, xPath, nodeDescription, doc, aLumCheckList.length, sText, sTextSize, textWeight, fgColor, bgColor, bBgImage, fgLum, bgLum, lRatio));
                  }
                }
              }
              blr.W15yQC.fnGetLuminosityCheckElements(doc, c, aLumCheckList);
            }
          }
        }
      }
      return aLumCheckList;
    },
        
    fnAnalyzeLuminosityCheckElements: function(aLumCheckList, aDocumentsList) {
      var spec, minRatio, i, textSize, textWeight, lRatio;
      if(blr.W15yQC.sb == null) { blr.W15yQC.fnInitStringBundles(); }
      
      spec=Application.prefs.getValue('extensions.W15yQC.testContrast.MinSpec','WCAG2 AA');
      minRatio=7.0;

      if (aLumCheckList != null && aLumCheckList.length) {
        for (i = 0; i < aLumCheckList.length; i++) {
          aLumCheckList[i].ownerDocumentNumber = blr.W15yQC.fnGetOwnerDocumentNumber(aLumCheckList[i].node, aDocumentsList);
          textSize = parseFloat(aLumCheckList[i].textSize);
          textWeight = parseInt(aLumCheckList[i].textWeight,10);
          lRatio = parseFloat(aLumCheckList[i].luminosityRatio);
          if(textSize>=18) {
            minRatio=spec=='WCAG2 AA' ? 3.0 : 4.5;
          } else if(textSize >= 14 && textWeight>=700) {
            minRatio=spec=='WCAG2 AA' ? 3.0 : 4.5;
          } else {
            minRatio=spec=='WCAG2 AA' ? 4.5 : 7.0;
          }
          if(lRatio<=minRatio) {
            aLumCheckList[i].failed=true;
          } else if(aLumCheckList[i].hasBackgroundImage==true) {
            aLumCheckList[i].warning=true;
          }
        }
      }
      blr.W15yQC.fnUpdateWarningAndFailureCounts(aLumCheckList);
    },
    
    fnGetImages: function (doc, rootNode, aImagesList) {
      var c, frameDocument, tagName, xPath, nodeDescription, effectiveLabel, role, box, width=null, height=null, title, alt, src, sARIALabel;
      if (aImagesList == null) { aImagesList = []; }

      if (doc != null) {
        if (rootNode == null) { rootNode = doc.body; }
        for (c = rootNode.firstChild; c != null; c = c.nextSibling) {
          if (c.nodeType == 1) { // Only pay attention to element nodes
            if (c.tagName && ((c.contentWindow && c.contentWindow.document !== null) || (c.contentDocument && c.contentDocument.body !== null)) && blr.W15yQC.fnNodeIsHidden(c) == false) { // Found a frame
              // get frame contents
              frameDocument = c.contentWindow ? c.contentWindow.document : c.contentDocument;
              blr.W15yQC.fnGetImages(frameDocument, frameDocument.body, aImagesList);
            } else { // keep looking through current document
              if (c.tagName && blr.W15yQC.fnNodeIsHidden(c) == false) {
                tagName = c.tagName.toLowerCase();
                switch (tagName) {
                  case 'area':
                    xPath = blr.W15yQC.fnGetElementXPath(c);
                    nodeDescription = blr.W15yQC.fnDescribeElement(c, 400);
                    effectiveLabel = blr.W15yQC.fnGetEffectiveLabelText(c, doc);
                    role = blr.W15yQC.fnGetNodeAttribute(c, 'role', null);
                    box = c.getBoundingClientRect();
                    if (box != null) {
                      width = box.width;
                      height = box.height;
                    }
                    title = null;
                    if (c.hasAttribute('title')) { title = c.getAttribute('title'); }
                    alt = null;
                    if (c.hasAttribute('alt')) { alt = c.getAttribute('alt'); }
                    src = null;
                    if (c.hasAttribute('src')) { src = blr.W15yQC.fnCutoffString(c.getAttribute('src'), 200); }
                    sARIALabel = null;
                    if (c.hasAttribute('aria-label') == true) {
                      sARIALabel = c.getAttribute('aria-label');
                    } else if (c.hasAttribute('aria-labelledby') == true) {
                      sARIALabel = blr.W15yQC.fnGetTextFromIdList(c.getAttribute('aria-labelledby'));
                    }
                    aImagesList.push(new blr.W15yQC.image(c, xPath, nodeDescription, doc, aImagesList.length, role, src, width, height, effectiveLabel, alt, title, sARIALabel));
                    break;
                case 'img':
                  // Document image: node, nodeDescription, doc, orderNumber, src, width, height, alt, title, ariaLabel
                  xPath = blr.W15yQC.fnGetElementXPath(c);
                  nodeDescription = blr.W15yQC.fnDescribeElement(c, 400);
                  effectiveLabel = blr.W15yQC.fnGetEffectiveLabelText(c, doc);
                  role = blr.W15yQC.fnGetNodeAttribute(c, 'role', null);
                  box = c.getBoundingClientRect();
                  if (box != null) {
                    width = box.width;
                    height = box.height;
                  }
                  title = null;
                  if (c.hasAttribute('title')) { title = c.getAttribute('title'); }
                  alt = null;
                  if (c.hasAttribute('alt')) { alt = c.getAttribute('alt'); }
                  src = null;
                  if (c.hasAttribute('src')) { src = blr.W15yQC.fnCutoffString(c.getAttribute('src'), 200); }
                  sARIALabel = null;
                  if (c.hasAttribute('aria-label') == true) {
                    sARIALabel = c.getAttribute('aria-label');
                  } else if (c.hasAttribute('aria-labelledby') == true) {
                    sARIALabel = blr.W15yQC.fnGetTextFromIdList(c.getAttribute('aria-labelledby'));
                  }
                  blr.W15yQC.fnLog('Image el:'+effectiveLabel);
                  aImagesList.push(new blr.W15yQC.image(c, xPath, nodeDescription, doc, aImagesList.length, role, src, width, height, effectiveLabel, alt, title, sARIALabel));
                  break;
                case 'input': // TODO: QA This!
                  if (c.hasAttribute('type') && c.getAttribute('type').toLowerCase() == 'image') {
                    // Document image: node, nodeDescription, doc, orderNumber, src, alt, title, ariaLabel
                    xPath = blr.W15yQC.fnGetElementXPath(c);
                    nodeDescription = blr.W15yQC.fnDescribeElement(c, 400);
                    title = null;
                    effectiveLabel = blr.W15yQC.fnGetEffectiveLabelText(c, doc);
                    box = c.getBoundingClientRect();
                    if (box != null) {
                      width = box.width;
                      height = box.height;
                    }
                    if (c.hasAttribute('title')) { title = c.getAttribute('title'); }
                    alt = null;
                    if (c.hasAttribute('alt')) { alt = c.getAttribute('alt'); }
                    src = null;
                    if (c.hasAttribute('src')) { src = blr.W15yQC.fnCutoffString(c.getAttribute('src'), 200); }
                    sARIALabel = null;
                    if (c.hasAttribute('aria-label') == true) {
                      sARIALabel = c.getAttribute('aria-label');
                    } else if (c.hasAttribute('aria-labelledby') == true) {
                      sARIALabel = blr.W15yQC.fnGetTextFromIdList(c.getAttribute('aria-labelledby'));
                    }
                    aImagesList.push(new blr.W15yQC.image(c, xPath, nodeDescription, doc, aImagesList.length, role, src, width, height, effectiveLabel, alt, title, sARIALabel));
                  }
                  break;
                }
              }
              blr.W15yQC.fnGetImages(doc, c, aImagesList);
            }
          }
        }
      }
      return aImagesList;
    },

    fnAnalyzeImages: function (aImagesList, aDocumentsList) {
      var i, sCombinedLabel;
      if(blr.W15yQC.sb == null) { blr.W15yQC.fnInitStringBundles(); }
      if (aImagesList != null && aImagesList.length) {

        for (i = 0; i < aImagesList.length; i++) {
          aImagesList[i].ownerDocumentNumber = blr.W15yQC.fnGetOwnerDocumentNumber(aImagesList[i].node, aDocumentsList);
          if (aImagesList[i].node != null && aImagesList[i].node.hasAttribute && aImagesList[i].node.hasAttribute('longdesc') == true) {
            aImagesList[i].longdescURL = aImagesList[i].node.getAttribute('longdesc');
            if(blr.W15yQC.fnAppearsToBeValidLongdesc(aImagesList[i].longdescURL) == false) {
              if(blr.W15yQC.fnAppearsToBeImageFileName(aImagesList[i].longdescURL)) {
                blr.W15yQC.fnAddNote(aImagesList[i], 'imgLongdescImageFileName'); // QA imageTests01.html
              } else {
                blr.W15yQC.fnAddNote(aImagesList[i], 'imgLongdescShouldBeURL'); // QA imageTests01.html
              }
            }
          }
          aImagesList[i].stateDescription = blr.W15yQC.fnGetNodeState(aImagesList[i].node);
          if (aImagesList[i].alt == null && blr.W15yQC.fnNodeHasPresentationRole(aImagesList[i].node) == false) {
            blr.W15yQC.fnAddNote(aImagesList[i], 'imgMissingAltAttribute'); // QA imageTests01.html
          }
          sCombinedLabel = blr.W15yQC.fnTrim(blr.W15yQC.fnJoin(blr.W15yQC.fnJoin(aImagesList[i].alt, aImagesList[i].title, ''), aImagesList[i].ariaLabel, ''));
          if (sCombinedLabel == null || sCombinedLabel.length < 1) {
            if(aImagesList[i].alt != null && blr.W15yQC.fnNodeHasPresentationRole(aImagesList[i].node)==false) {
              blr.W15yQC.fnAddNote(aImagesList[i], 'imgNoAltText'); // QA imageTests01.html
            }
          } else if(blr.W15yQC.fnNodeHasPresentationRole(aImagesList[i].node) == true) {
              blr.W15yQC.fnAddNote(aImagesList[i], 'imgHasAltTextAndPresRole'); // QA imageTests01.html
          } else {
            if (blr.W15yQC.fnOnlyASCIISymbolsWithNoLettersOrDigits(aImagesList[i].effectiveLabel)) {
              blr.W15yQC.fnAddNote(aImagesList[i], 'imgAltTxtOnlyASCII'); // QA imageTests01.html
            }
            aImagesList[i] = blr.W15yQC.fnIsMeaningfulAltTextTest(aImagesList[i].effectiveLabel, aImagesList[i]);
            if(blr.W15yQC.fnAltTextAppearsIfItShouldBeEmptyCauseItIsASpacer(aImagesList[i].src) == true) {
              blr.W15yQC.fnAddNote(aImagesList[i], 'imgSpacerWithAltTxt'); // QA imageTests01.html
            }
          }

          aImagesList[i] = blr.W15yQC.fnAnalyzeARIAMarkupOnNode(aImagesList[i].node, aImagesList[i].doc, aImagesList[i]);

          if(aImagesList[i].node != null && aImagesList[i].node.hasAttribute('id')==true) {
            if(blr.W15yQC.fnIsValidHtmlID(aImagesList[i].node.getAttribute('id'))==false) {
              blr.W15yQC.fnAddNote(aImagesList[i], 'imgIDNotValid'); // QA imageTests01.html
            }
            if(aDocumentsList[aImagesList[i].ownerDocumentNumber-1].idHashTable.getItem(aImagesList[i].node.getAttribute('id'))>1) {
              blr.W15yQC.fnAddNote(aImagesList[i], 'imgIDNotUnique'); // QA imageTests01.html
            }
          }
        }
      }
      blr.W15yQC.fnUpdateWarningAndFailureCounts(aImagesList);
    },

    fnDisplayImagesResults: function (rd, aImagesList) {
      var div = rd.createElement('div'), table, msgHash, tbody, i, io, sNotes, sClass;
      div.setAttribute('id', 'AIImagesList');

      blr.W15yQC.fnAppendExpandContractHeadingTo(div, rd, blr.W15yQC.fnMakeHeadingCountsString(aImagesList,'hrsImages','hrsNoImages'));

      if (aImagesList && aImagesList.length > 0) {
        table = rd.createElement('table');
        table.setAttribute('id', 'AIImagesTable');
        table = blr.W15yQC.fnCreateTableHeaders(rd, table, [blr.W15yQC.fnGetString('hrsTHNumberSym'), blr.W15yQC.fnGetString('hrsTHImageElement'),
                                                            blr.W15yQC.fnGetString('hrsTHOwnerDocNumber'), blr.W15yQC.fnGetString('hrsTHAlt'),
                                                            blr.W15yQC.fnGetString('hrsTHTitle'), blr.W15yQC.fnGetString('hrsTHARIALabel'),
                                                            blr.W15yQC.fnGetString('hrsTHSrc'), blr.W15yQC.fnGetString('hrsTHNotes')]);
        msgHash = new blr.W15yQC.HashTable();

        tbody = rd.createElement('tbody');
        for (i = 0; i < aImagesList.length; i++) {
          io = aImagesList[i];
          sNotes = blr.W15yQC.fnMakeHTMLNotesList(io, msgHash);
          sClass = '';
          if (io.failed) {
            sClass = 'failed';
          } else if (io.warning) {
            sClass = 'warning';
          }
          blr.W15yQC.fnAppendTableRow(rd, tbody, [i + 1, blr.W15yQC.fnMakeWebSafe(io.nodeDescription), io.ownerDocumentNumber, io.alt, io.title, io.ariaLabel, io.src, sNotes], sClass);
        }
        table.appendChild(tbody);
        div.appendChild(table);
        blr.W15yQC.fnMakeTableSortable(div, rd, 'AIImagesTable');
      } else {
        blr.W15yQC.fnAppendPElementTo(div, rd, blr.W15yQC.fnGetString('hrsNoImagesDetected'));
      }
      rd.body.appendChild(div);

    },

    fnGetAccessKeys: function (doc, rootNode, aAccessKeysList) {
      var c, frameDocument, tagName, accessKey, xPath, nodeDescription, effectiveLabel, role;
      if (aAccessKeysList == null) { aAccessKeysList = []; }

      if (doc != null) {
        if (rootNode == null) { rootNode = doc.body; }
        for (c = rootNode.firstChild; c != null; c = c.nextSibling) {
          if (c.nodeType == 1) { // Only pay attention to element nodes
            if (c.tagName && ((c.contentWindow && c.contentWindow.document !== null) || (c.contentDocument && c.contentDocument.body !== null)) && blr.W15yQC.fnNodeIsHidden(c) == false) { // Found a frame
              // get frame contents
              frameDocument = c.contentWindow ? c.contentWindow.document : c.contentDocument;
              blr.W15yQC.fnGetAccessKeys(frameDocument, frameDocument.body, aAccessKeysList);
            } else { // keep looking through current document
              if (c.tagName && c.hasAttribute('accesskey') == true) {
                if (blr.W15yQC.fnNodeIsHidden(c) == false) {
                  // Document accesskey
                  tagName = c.tagName.toLowerCase();
                  accessKey = c.getAttribute('accesskey');
                  xPath = blr.W15yQC.fnGetElementXPath(c);
                  nodeDescription = blr.W15yQC.fnDescribeElement(c, 400);
                  effectiveLabel = blr.W15yQC.fnGetEffectiveLabelText(c);
                  role = blr.W15yQC.fnGetNodeAttribute(c, 'role', null);
                  aAccessKeysList.push(new blr.W15yQC.accessKey(c, xPath, nodeDescription, doc, aAccessKeysList.length, role, accessKey, effectiveLabel));
                }
              }
              blr.W15yQC.fnGetAccessKeys(doc, c, aAccessKeysList);
            }
          }
        }
      }
      return aAccessKeysList;
    },

    fnAnalyzeAccessKeys: function (aAccessKeysList, aDocumentsList) {
      var htMajorConflicts, i, ak, aValuesDuplicated, aLabelsDuplicated, j, ak2;
      if(blr.W15yQC.sb == null) { blr.W15yQC.fnInitStringBundles(); }
      htMajorConflicts = { // What version of IE? What about the menus in IE 7, IE 8, IE 9? Specify it is the english version...
        'c': "Alt+C is used to open the Favorites Center in IE.",
        'd': "Alt+D is used to access the Address Bar in IE.",
        'f': "Alt+F is used to access the File Menu in IE and Opens the Tools menu in Chrome.",
        'h': "Alt+H is used to access the Help Menu in IE.",
        'j': "Alt+J is used to open the RSS Menu in IE",
        'l': "Alt+L is used to open the Help Menu in IE.",
        'm': "Alt+M is used to open the Home Menu in IE.",
        'n': "Alt+N is used to move Focus to the Information Bar in IE.",
        'o': "Alt+O is used to open the Tools Menu in IE.",
        'p': "Alt+P is used to open the Page Menu in IE.",
        'r': "Alt+R is used to open the Print Menu in IE.",
        's': "Alt+S is used to open the Safety Menu in IE and to read the Status Bar in the WindowEyes Screen-reader.",
        'z': "Alt+Z is used to open the Add to Favorites Menu in IE."
      };
      if (aAccessKeysList != null && aAccessKeysList.length && aAccessKeysList.length > 0) {
        for (i = 0; i < aAccessKeysList.length; i++) {
          aAccessKeysList[i].ownerDocumentNumber = blr.W15yQC.fnGetOwnerDocumentNumber(aAccessKeysList[i].node, aDocumentsList);
          aAccessKeysList[i].stateDescription = blr.W15yQC.fnGetNodeState(aAccessKeysList[i].node);
        }
        for (i = 0; i < aAccessKeysList.length; i++) {
          ak = aAccessKeysList[i];
          if (htMajorConflicts[ak.accessKey.toLowerCase()] != null && htMajorConflicts[ak.accessKey.toLowerCase()].length) {
            blr.W15yQC.fnAddNote(ak, 'akConflict',[htMajorConflicts[ak.accessKey.toLowerCase()]]); //  QA accesskeyTests01.html
          }
          if (ak.effectiveLabel == null) {
            blr.W15yQC.fnAddNote(ak, 'akNoLabel'); // Can't get this to fire
          } else if (ak.effectiveLabel.length && ak.effectiveLabel.length > 0) {
            if (blr.W15yQC.fnOnlyASCIISymbolsWithNoLettersOrDigits(ak.effectiveLabel)) {
              blr.W15yQC.fnAddNote(ak, 'akLabelOnlyASCII'); // QA accesskeyTests01.html
            } else if (blr.W15yQC.fnIsMeaningfulLinkText(ak.effectiveLabel) == false) {
              blr.W15yQC.fnAddNote(ak, 'akLabelNotMeaningful'); //  QA accesskeyTests01.html
            }
            aValuesDuplicated = [];
            aLabelsDuplicated = [];
            for (j = 0; j < aAccessKeysList.length; j++) {
              if (i != j) {
                ak2 = aAccessKeysList[j];
                if (ak2 != null && ak2.accessKey != null) {
                  if (ak.accessKey == ak2.accessKey) {
                    aValuesDuplicated.push(j+1);
                  }
                  if (blr.W15yQC.fnStringsEffectivelyEqual(ak.effectiveLabel, ak2.effectiveLabel)) {
                    aLabelsDuplicated.push(j+1);
                  }
                }
              }
            }
            
            if(aValuesDuplicated.length>0) {
              blr.W15yQC.fnAddNote(ak, 'akValueNotUnique', [blr.W15yQC.fnCutoffString(aValuesDuplicated.toString(),99)]); //
            }
            if(aLabelsDuplicated.length>0) {
              blr.W15yQC.fnAddNote(ak, 'akLabelNotUnique', [blr.W15yQC.fnCutoffString(aLabelsDuplicated.toString(),99)]); //
            }
          } else {
            blr.W15yQC.fnAddNote(ak, 'akLabelEmpty'); // QA accesskeyTests01.html
          }

          ak = blr.W15yQC.fnAnalyzeARIAMarkupOnNode(ak.node, ak.doc, ak);
          if(aAccessKeysList[i].node != null && aAccessKeysList[i].node.hasAttribute('id')==true) {
            if(blr.W15yQC.fnIsValidHtmlID(aAccessKeysList[i].node.getAttribute('id'))==false) {
              blr.W15yQC.fnAddNote(ak, 'akIDNotValid'); // QA accesskeyTests01.html
            }
            if(aDocumentsList[aAccessKeysList[i].ownerDocumentNumber-1].idHashTable.getItem(aAccessKeysList[i].node.getAttribute('id'))>1) {
              blr.W15yQC.fnAddNote(ak, 'akIDNotUnique'); // QA accesskeyTests01.html
            }
          }
        }
      }
      blr.W15yQC.fnUpdateWarningAndFailureCounts(aAccessKeysList);
    },

    fnDisplayAccessKeysResults: function (rd, aAccessKeysList) {
      var div, table, msgHash, tbody, i, ak, sNotes, sClass;
      div = rd.createElement('div');
      div.setAttribute('id', 'AIAccesskeysList');

      blr.W15yQC.fnAppendExpandContractHeadingTo(div, rd, blr.W15yQC.fnMakeHeadingCountsString(aAccessKeysList,'hrsAccessKeys','hrsNoAccessKeys'));

      if (aAccessKeysList != null && aAccessKeysList.length > 0) {
        table = rd.createElement('table');
        table.setAttribute('id', 'AIAccesskeysTable');

        table = blr.W15yQC.fnCreateTableHeaders(rd, table, [blr.W15yQC.fnGetString('hrsTHNumberSym'), blr.W15yQC.fnGetString('hrsTHElementDescription'),
                                                            blr.W15yQC.fnGetString('hrsTHOwnerDocNumber'), blr.W15yQC.fnGetString('hrsTHAccessKey'),
                                                            blr.W15yQC.fnGetString('hrsTHEffectiveLabel'), blr.W15yQC.fnGetString('hrsTHState'),
                                                            blr.W15yQC.fnGetString('hrsTHNotes')]);
        msgHash = new blr.W15yQC.HashTable();
        tbody = rd.createElement('tbody');
        for (i = 0; i < aAccessKeysList.length; i++) {
          ak = aAccessKeysList[i];
          sNotes = blr.W15yQC.fnMakeHTMLNotesList(ak, msgHash);
          sClass = '';
          if (ak.failed) {
            sClass = 'failed';
          } else if (ak.warning) {
            sClass = 'warning';
          }
          blr.W15yQC.fnAppendTableRow(rd, tbody, [i + 1, blr.W15yQC.fnMakeWebSafe(ak.nodeDescription), ak.ownerDocumentNumber, ak.accessKey, ak.effectiveLabel, ak.stateDescription, sNotes], sClass);
        }
        table.appendChild(tbody);
        div.appendChild(table);
        blr.W15yQC.fnMakeTableSortable(div, rd, 'AIAccesskeysTable');
      } else {
        blr.W15yQC.fnAppendPElementTo(div, rd, blr.W15yQC.fnGetString('hrsNoAccessKeysDetected'));
      }
      rd.body.appendChild(div);
    },

    fnGetHeadings: function (doc, rootNode, aHeadingsList) {
      var c, frameDocument, tagName, headingLevel, xPath, nodeDescription, role, text, bFoundHeading;
      if (aHeadingsList == null) { aHeadingsList = []; }

      if (doc != null) {
        if (rootNode == null) { rootNode = doc.body; }
        for (c = rootNode.firstChild; c != null; c = c.nextSibling) {
          if (c.nodeType == 1) { // Only pay attention to element nodes
            if (c.tagName && ((c.contentWindow && c.contentWindow.document !== null) || (c.contentDocument && c.contentDocument.body !== null)) && blr.W15yQC.fnNodeIsHidden(c) == false) { // Found a frame
              // get frame contents
              frameDocument = c.contentWindow ? c.contentWindow.document : c.contentDocument;
              blr.W15yQC.fnGetHeadings(frameDocument, frameDocument.body, aHeadingsList);
            } else { // keep looking through current document
              if (c.tagName) {
                bFoundHeading=false;
                tagName = c.tagName.toLowerCase();
                if(c.hasAttribute && c.hasAttribute('role') && c.getAttribute('role').toLowerCase()=='heading') {
                  bFoundHeading=true;
                  if(c.hasAttribute('aria-level') && blr.W15yQC.fnIsValidPositiveInt(c.getAttribute('aria-level'))==true) {
                    headingLevel=parseInt(c.getAttribute('aria-level'));
                  } else { // TODO: Look deeper at this. JAWS 13 seems to default to heading level 2 if not specified
                    headingLevel=2;
                  }
                } else {
                  switch (tagName) {
                  case 'h1':
                  case 'h2':
                  case 'h3':
                  case 'h4':
                  case 'h5':
                  case 'h6':
                    if (blr.W15yQC.fnNodeIsHidden(c) == false) {
                      // Document heading
                      bFoundHeading=true;
                      headingLevel = tagName.substring(1);
                    }
                    break;
                  }
                }
                if(bFoundHeading==true) {
                  xPath = blr.W15yQC.fnGetElementXPath(c);
                  nodeDescription = blr.W15yQC.fnDescribeElement(c, 400);
                  role = blr.W15yQC.fnGetNodeAttribute(c, 'role', null);
                  text = blr.W15yQC.fnGetDisplayableTextRecursively(c);
                  aHeadingsList.push(new blr.W15yQC.headingElement(c, xPath, nodeDescription, doc, aHeadingsList.length, role, headingLevel, text));
                }
              }
              blr.W15yQC.fnGetHeadings(doc, c, aHeadingsList);
            }
          }
        }
      }
      return aHeadingsList;
    },

    fnAnalyzeHeadings: function (aHeadingsList, aDocumentsList, progressWindow) {
      var i, previousHeadingLevel;
      if(blr.W15yQC.sb == null) { blr.W15yQC.fnInitStringBundles(); }
      if (aHeadingsList != null && aHeadingsList.length && aHeadingsList.length > 0) {
        for (i = 0; i < aHeadingsList.length; i++) {
          aHeadingsList[i].ownerDocumentNumber = blr.W15yQC.fnGetOwnerDocumentNumber(aHeadingsList[i].node, aDocumentsList);
          aHeadingsList[i].stateDescription = blr.W15yQC.fnGetNodeState(aHeadingsList[i].node);
          if (aHeadingsList[i].text != null && aHeadingsList[i].text.length && aHeadingsList[i].text.length > 0) {
            aHeadingsList[i].text = blr.W15yQC.fnCleanSpaces(aHeadingsList[i].text);
          }
        }
        previousHeadingLevel = 0;
        for (i = 0; i < aHeadingsList.length; i++) {
          if((i % 4) == 0) {
            if(progressWindow != null) {
              progressWindow.document.getElementById('percent').value=Math.round(3*i/aHeadingsList.length)+12;
              progressWindow.document.getElementById('detailText').value='Analyzing Headings ' + (Math.round(100*i/aHeadingsList.length)).toString();
              progressWindow.focus();
              blr.W15yQC.fnDoEvents();
            }
          }
          if (aHeadingsList[i].level - previousHeadingLevel > 1) {
              blr.W15yQC.fnAddNote(aHeadingsList[i], 'hSkippedLevel'); // QA: headings01.html
          }
          previousHeadingLevel = aHeadingsList[i].level;

          if (aHeadingsList[i].text == null) {
            blr.W15yQC.fnAddNote(aHeadingsList[i], 'hTxtMissing'); // Not sure this can happen
          } else if (aHeadingsList[i].text.length && aHeadingsList[i].text.length > 0) {
            if (blr.W15yQC.fnOnlyASCIISymbolsWithNoLettersOrDigits(aHeadingsList[i].text)) {
              blr.W15yQC.fnAddNote(aHeadingsList[i], 'hTxtOnlyASCII'); // QA: headings01.html
            } else if (blr.W15yQC.fnIsMeaningfulHeadingText(aHeadingsList[i].text) == false) {
              blr.W15yQC.fnAddNote(aHeadingsList[i], 'hTxtNotMeaninfgul'); // QA: headings01.html
            }
          } else {
            blr.W15yQC.fnAddNote(aHeadingsList[i], 'hTxtEmpty'); // QA: headings01.html
          }

          aHeadingsList[i] = blr.W15yQC.fnAnalyzeARIAMarkupOnNode(aHeadingsList[i].node, aHeadingsList[i].doc, aHeadingsList[i]);
          if(aHeadingsList[i].node != null && aHeadingsList[i].node.hasAttribute('id')==true) {
            if(blr.W15yQC.fnIsValidHtmlID(aHeadingsList[i].node.getAttribute('id'))==false) {
              blr.W15yQC.fnAddNote(aHeadingsList[i], 'hIDNotValid'); // QA: headings01.html
            }
            if(aDocumentsList[aHeadingsList[i].ownerDocumentNumber-1].idHashTable.getItem(aHeadingsList[i].node.getAttribute('id'))>1) {
              blr.W15yQC.fnAddNote(aHeadingsList[i], 'hIDNotUnique'); // QA: headings01.html
            }
          }
        }
      }
      blr.W15yQC.fnUpdateWarningAndFailureCounts(aHeadingsList);
    },

    fnDisplayHeadingsResults: function (rd, aHeadingsList) {
      var div, innerDiv, list, previousHeadingLevel, previousDocument, i, sDoc, nextLogicalLevel, j, li, sNotesTxt, sMessage, span;
      div = rd.createElement('div');
      innerDiv = rd.createElement('div');
      div.setAttribute('id', 'AIHeadingsList');
      div.setAttribute('class', 'AIList');

      blr.W15yQC.fnAppendExpandContractHeadingTo(div, rd, blr.W15yQC.fnMakeHeadingCountsString(aHeadingsList,'hrsHeadings','hrsNoHeadings'));

      if (aHeadingsList && aHeadingsList.length > 0) {

        list = [];
        list.push(rd.createElement('ul'));
        previousHeadingLevel = 0;

        previousDocument = null;
        if (aHeadingsList && aHeadingsList.length && aHeadingsList.length > 0) { previousDocument = aHeadingsList[0].doc; }
        for (i = 0; i < aHeadingsList.length; i++) {
          sDoc = '';
          if (i == 0) {
            sDoc = 'Contained in doc #' + aHeadingsList[i].ownerDocumentNumber;
          }
          nextLogicalLevel = parseInt(previousHeadingLevel,10) + 1;
          for (j = nextLogicalLevel; j < aHeadingsList[i].level; j++) {
            // Add "skipped" heading levels
            li = rd.createElement('li');
            if (previousDocument != aHeadingsList[i].doc) {
              blr.W15yQC.fnAddClass(li, 'newDocument');
              sDoc = 'In doc #' + aHeadingsList[i].ownerDocumentNumber;
              previousDocument = aHeadingsList[i].doc;
            }
            li.appendChild(rd.createTextNode("[h" + j + "] "+ blr.W15yQC.fnGetString('hrsMissingHeading')));
            li.setAttribute('class', 'skippedHeadingLevel');
            if (previousHeadingLevel > 0) {
              list.push(rd.createElement('ul'));
            }
            list[list.length - 1].appendChild(li);
            previousHeadingLevel = j;
          }

          li = rd.createElement('li');
          if (previousDocument != aHeadingsList[i].doc) {
            blr.W15yQC.fnAddClass(li, 'newDocument');
            sDoc = 'In doc #' + aHeadingsList[i].ownerDocumentNumber;
            previousDocument = aHeadingsList[i].doc;
          }
          li.appendChild(rd.createTextNode("[h" + aHeadingsList[i].level + "] " + aHeadingsList[i].text));

          sNotesTxt = blr.W15yQC.fnMakeTextNotesList(aHeadingsList[i].notes);
          sMessage = blr.W15yQC.fnJoin(sDoc, blr.W15yQC.fnJoin(sNotesTxt, aHeadingsList[i].stateDescription, ', '+blr.W15yQC.fnGetString('hrsHeadingState')+':'), ' - ');
          if (sMessage != null && sMessage.length != null && sMessage.length > 0) {
            span = rd.createElement('span');

            span.appendChild(rd.createTextNode(' (' + sMessage + ')'));
            span.setAttribute('class', 'headingNote');
            li.appendChild(span);
          }

          if (aHeadingsList[i].failed) {
            li.setAttribute('class', 'failed');
          } else if (aHeadingsList[i].warning) {
            li.setAttribute('class', 'warning');
          }
          if (aHeadingsList[i].nodeDescription != null) { li.setAttribute('title', aHeadingsList[i].nodeDescription); }

          if (aHeadingsList[i].level > previousHeadingLevel && previousHeadingLevel > 0) {
            list.push(rd.createElement('ul'));
          } else {
            while (aHeadingsList[i].level < previousHeadingLevel) {
              list[list.length - 2].appendChild(list[list.length - 1]);
              list.pop();
              previousHeadingLevel--;
            }
          }
          list[list.length - 1].appendChild(li);
          previousHeadingLevel = parseInt(aHeadingsList[i].level,10);
        }
        while (list.length > 1) {
          list[list.length - 2].appendChild(list[list.length - 1]);
          list.pop();
        }
        innerDiv.appendChild(list[0]);
        div.appendChild(innerDiv);
      } else {
        blr.W15yQC.fnAppendPElementTo(div, rd, blr.W15yQC.fnGetString('hrsNoHeadingsDetected'));
      }
      rd.body.appendChild(div);
    },

    fnGetFormControls: function (doc, rootNode, aDocumentsList, aFormsList, aFormControlsList) {
      var bIncludeLabelControls, c, frameDocument, sXPath, sFormDescription, ownerDocumentNumber, sRole, sName, sAction, sMethod, xPath, sFormElementDescription, parentFormNode,
          role, sTitle, sLegendText, sLabelTagText, sEffectiveLabelText, sARIALabelText, sARIADescriptionText, sStateDescription, sValue;
          
      bIncludeLabelControls = Application.prefs.getValue('extensions.W15yQC.getElements.includeLabelElementsInFormControls',false); 
      if (aFormControlsList == null) { aFormControlsList = []; }
      if (aFormsList == null) { aFormsList = []; }

      if (doc != null) {
        if (rootNode == null) { rootNode = doc.body; }
        for (c = rootNode.firstChild; c != null; c = c.nextSibling) {
          if (c.nodeType == 1) { // Only pay attention to element nodes
            if (((c.contentWindow && c.contentWindow.document !== null) || (c.contentDocument && c.contentDocument.body !== null)) && blr.W15yQC.fnNodeIsHidden(c) == false) { // Dig into frames!
              frameDocument = c.contentWindow ? c.contentWindow.document : c.contentDocument;
              blr.W15yQC.fnGetFormControls(frameDocument, frameDocument.body, aDocumentsList, aFormsList, aFormControlsList);
            } else {
              if (c.tagName != null && c.tagName.toLowerCase() == 'form') {
                sXPath = blr.W15yQC.fnGetElementXPath(c);
                sFormDescription = blr.W15yQC.fnDescribeElement(c);
                ownerDocumentNumber = blr.W15yQC.fnGetOwnerDocumentNumber(c, aDocumentsList);
                sRole = blr.W15yQC.fnGetNodeAttribute(c, 'role', null);
                sName = blr.W15yQC.fnGetNodeAttribute(c, 'name', null);
                sAction = blr.W15yQC.fnGetNodeAttribute(c, 'action', null);
                sMethod = blr.W15yQC.fnGetNodeAttribute(c, 'method', null);
                aFormsList.push(new blr.W15yQC.formElement(c, sXPath, sFormDescription, doc, ownerDocumentNumber, aFormsList.length + 1, sName, sRole, sAction, sMethod));
              } else if ((blr.W15yQC.fnIsFormControlNode(c) || (bIncludeLabelControls == true && blr.W15yQC.fnIsLabelControlNode(c))) && blr.W15yQC.fnNodeIsHidden(c) == false) {
                // Document the form control
                xPath = blr.W15yQC.fnGetElementXPath(c);
                sFormElementDescription = blr.W15yQC.fnDescribeElement(c, 400);
                parentFormNode = blr.W15yQC.fnGetParentFormElement(c);
                sFormDescription = blr.W15yQC.fnDescribeElement(parentFormNode);
                role = blr.W15yQC.fnGetNodeAttribute(c, 'role', null);
                sTitle = blr.W15yQC.fnGetNodeAttribute(c, 'title', null);
                sLegendText = '';
                sLabelTagText = '';
                sEffectiveLabelText = '';
                if(blr.W15yQC.fnIsFormControlNode(c)) {
                  sLegendText = blr.W15yQC.fnGetLegendText(c);
                  sLabelTagText = blr.W15yQC.fnGetFormControlLabelTagText(c, doc);
                  sEffectiveLabelText = blr.W15yQC.fnGetEffectiveLabelText(c, doc);
                } else {
                  blr.W15yQC.fnLog("---In front of switch:"+c.tagName.toLowerCase());
                  switch(c.tagName.toLowerCase()) {
                    case 'fieldset':
                      sLabelTagText = blr.W15yQC.fnGetLegendText(c);
                      break;
                    case 'legend':                    
                    case 'label':
                    default:
                      sLabelTagText = blr.W15yQC.fnCleanSpaces(blr.W15yQC.fnGetDisplayableTextRecursively(c));
                      break;
                  }
                sEffectiveLabelText = sLabelTagText;
              }
                sARIALabelText = blr.W15yQC.fnGetARIALabelText(c, doc);
                sARIADescriptionText = blr.W15yQC.fnGetARIADescriptionText(c, doc);
                sStateDescription = blr.W15yQC.fnGetNodeState(c);
                sName = c.getAttribute('name');
                sValue = c.getAttribute('value');
  
                aFormControlsList.push(new blr.W15yQC.formControlElement(c, xPath, sFormElementDescription, parentFormNode, sFormDescription, doc, aFormControlsList.length, role, sName, sTitle, sLegendText, sLabelTagText, sARIALabelText, sARIADescriptionText, sEffectiveLabelText, sStateDescription, sValue));
              }
              blr.W15yQC.fnGetFormControls(doc, c, aDocumentsList, aFormsList, aFormControlsList);
            }
          }
        }
      }
      return [aFormsList, aFormControlsList];
    },

    fnAnalyzeFormControls: function (aFormsList, aFormControlsList, aDocumentsList) {
      var i, j, aSameNames, subForms, aSameLabelText, aSoundsTheSame, bShouldntHaveBoth, nodeTagName, nodeTypeValue,
          explictLabelsList, minDist, bCheckedLabel, sForValue, targetNode, iDist;

      // TODO: Add check that name value is unique to a given form unless it is a radio button
      if(blr.W15yQC.sb == null) { blr.W15yQC.fnInitStringBundles(); }
      // Check if form labels are empty, not meaningful, the same as other form controls, or sound like any other label texts
      if (aFormsList != null && aFormsList.length > 0) {
        for (i = 0; i < aFormsList.length; i++) {
          aFormsList[i].ownerDocumentNumber = blr.W15yQC.fnGetOwnerDocumentNumber(aFormsList[i].node, aDocumentsList);
          aSameNames = [];
          for (j = 0; j < aFormsList.length; j++) {
            if (i != j) {
              // If it has a name, check that the name is unique compared to other forms in the same document
              if (aFormsList[i].name != null && aFormsList[j].name != null && aFormsList[i].ownerDocumentNumber == aFormsList[j].ownerDocumentNumber && aFormsList[i].name.toLowerCase() == aFormsList[j].name.toLowerCase()) {
                aSameNames.push(j+1);
              }
            }
          }
          if(aSameNames.length>0) {
            blr.W15yQC.fnAddNote(aFormsList[i], 'frmNameNotUnique', [blr.W15yQC.fnCutoffString(aSameNames.toString(),99)]); //
          }
          // Check that it is not nested in another form and that it does not contain any form elements
          if (blr.W15yQC.fnGetParentFormElement(aFormsList[i].node.parentNode) != null) {
            blr.W15yQC.fnAddNote(aFormsList[i], 'frmFormIsNested'); //
          }
          subForms = aFormsList[i].node.getElementsByTagName('FORM');
          if (subForms != null && subForms.length > 0) {
            blr.W15yQC.fnAddNote(aFormsList[i], 'frmFormContainsForms'); //
          }
          if(aFormsList[i].node != null && aFormsList[i].node.hasAttribute('id')==true) {
            if(blr.W15yQC.fnIsValidHtmlID(aFormsList[i].node.getAttribute('id'))==false) {
              blr.W15yQC.fnAddNote(aFormsList[i], 'frmIDNotValid'); //
            }
            if(aDocumentsList[aFormsList[i].ownerDocumentNumber-1].idHashTable.getItem(aFormsList[i].node.getAttribute('id'))>1) {
              blr.W15yQC.fnAddNote(aFormsList[i], 'frmIDNotUnique'); //
            }
          }
        }
      }
      blr.W15yQC.fnUpdateWarningAndFailureCounts(aFormsList);

      if (aFormControlsList != null && aFormControlsList.length > 0) {
        for (i = 0; i < aFormControlsList.length; i++) {
          aFormControlsList[i].ownerDocumentNumber = blr.W15yQC.fnGetOwnerDocumentNumber(aFormControlsList[i].node, aDocumentsList);
          aFormControlsList[i].parentFormNumber = blr.W15yQC.fnGetParentFormNumber(aFormControlsList[i].parentFormNode, aFormsList);
          aFormControlsList[i].legendText = blr.W15yQC.fnCleanSpaces(aFormControlsList[i].legendText);
          aFormControlsList[i].labelTagText = blr.W15yQC.fnCleanSpaces(aFormControlsList[i].labelTagText);
          aFormControlsList[i].title = blr.W15yQC.fnCleanSpaces(aFormControlsList[i].title);
          aFormControlsList[i].ARIALabelText = blr.W15yQC.fnCleanSpaces(aFormControlsList[i].ARIALabelText);
          aFormControlsList[i].ARIADescriptionText = blr.W15yQC.fnCleanSpaces(aFormControlsList[i].ARIADescriptionText);
          aFormControlsList[i].soundex = blr.W15yQC.fnSetIsEnglishLocale(aDocumentsList[aFormControlsList[i].ownerDocumentNumber-1].language) ? blr.W15yQC.fnGetSoundExTokens(aFormControlsList[i].effectiveLabelText+' '+blr.W15yQC.fnJAWSAnnouncesControlAs(aFormControlsList[i].node)) : '';
        }

        for (i = 0; i < aFormControlsList.length; i++) {
          if (aFormControlsList[i].labelTagText == null && aFormControlsList[i].legendText == null && aFormControlsList[i].title == null && (aFormControlsList[i].effectiveLabelText == null || aFormControlsList[i].effectiveLabelText.length < 1)) {
              blr.W15yQC.fnAddNote(aFormControlsList[i], 'frmCtrlNotLabeled'); //
          } else if (aFormControlsList[i].effectiveLabelText != null && aFormControlsList[i].effectiveLabelText.length > 0) {
            if (blr.W15yQC.fnOnlyASCIISymbolsWithNoLettersOrDigits(aFormControlsList[i].effectiveLabelText)) {
              blr.W15yQC.fnAddNote(aFormControlsList[i], 'frmCtrlLabelOnlyASCII'); // 
            } else if (blr.W15yQC.fnIsOnlyNextOrPreviousText(aFormControlsList[i].effectiveLabelText) == true) {
              blr.W15yQC.fnAddNote(aFormControlsList[i], 'frmCtrlLabelNextPrev'); //
            } else if (blr.W15yQC.fnIsMeaningfulFormLabelText(aFormControlsList[i].effectiveLabelText) == false) {
              blr.W15yQC.fnAddNote(aFormControlsList[i], 'frmCtrlLabelNotMeaningful'); //
            }
            if(blr.W15yQC.fnIsLabelControlNode(aFormControlsList[i].node)==false) {
              aSameLabelText = [];
              aSoundsTheSame = [];
              
              for (j = 0; j < aFormControlsList.length; j++) {
                if (j != i && blr.W15yQC.fnIsLabelControlNode(aFormControlsList[j].node)==false) {
                  if (aFormControlsList[j].effectiveLabelText != null && aFormControlsList[j].effectiveLabelText.length > 0) {
                    if (blr.W15yQC.fnStringsEffectivelyEqual(aFormControlsList[i].effectiveLabelText.toLowerCase()+blr.W15yQC.fnJAWSAnnouncesControlAs(aFormControlsList[i].node),
                        aFormControlsList[j].effectiveLabelText.toLowerCase()+blr.W15yQC.fnJAWSAnnouncesControlAs(aFormControlsList[j].node))) {
                      aSameLabelText.push(j+1);
                    } else if (aFormControlsList[i].soundex.length>2 && aFormControlsList[i].soundex == aFormControlsList[j].soundex) {
                      aSoundsTheSame.push(j+1);
                    }
                  }
                }
              }
              
              if(aSameLabelText.length>0) {
                blr.W15yQC.fnAddNote(aFormControlsList[i], 'fmrCtrlLabelNotUnique', [blr.W15yQC.fnCutoffString(aSameLabelText.toString(),99)]); //
              }
              if(aSoundsTheSame.length>0) {
                blr.W15yQC.fnAddNote(aFormControlsList[i], 'frmCtrlLabelDoesntSoundUnique', [blr.W15yQC.fnCutoffString(aSoundsTheSame.toString(),99)]); //
              }
            }
          } else {
            blr.W15yQC.fnAddNote(aFormControlsList[i], 'frmCtrlLabelEmpty'); //
          }

          // Look for form controls with both keyboard and mouse handlers
          bShouldntHaveBoth = false;
          nodeTagName = '';
          nodeTypeValue = '';
          if(aFormControlsList[i].node != null && aFormControlsList[i].node.tagName) {
            nodeTagName = aFormControlsList[i].node.tagName.toLowerCase();
            nodeTypeValue = blr.W15yQC.fnGetNodeAttribute(aFormControlsList[i].node,'type','').toLowerCase();
          }
          if(nodeTagName == 'button' || (nodeTagName == 'input' && (nodeTypeValue == 'button' || nodeTypeValue == 'submit' || nodeTypeValue == 'image' ||
                                                                    nodeTypeValue == 'checkbox' || nodeTypeValue == 'radio' || nodeTypeValue == 'reset'))) {
            bShouldntHaveBoth = true;
          }
          if(bShouldntHaveBoth == true && aFormControlsList[i].node.hasAttribute('onclick') == true && aFormControlsList[i].node.hasAttribute('onkeypress') == true &&
             aFormControlsList[i].node.getAttribute('onclick').length>0 && aFormControlsList[i].node.getAttribute('onkeypress').length>0) {
            if(blr.W15yQC.fnScriptValuesAreDifferent(aFormControlsList[i].node.getAttribute('onclick')) == blr.W15yQC.fnCleanSpaces(aFormControlsList[i].node.getAttribute('onkeypress'))) {
              blr.W15yQC.fnAddNote(aFormControlsList[i], 'frmCtrlHasBothOCandOK'); //
            } else {
              blr.W15yQC.fnAddNote(aFormControlsList[i], 'frmCtrlRedundantOCandOK'); //
            }
          }
          
          // frmCtrlRadioButtonWOLegendText
          if(nodeTagName == 'input' && nodeTypeValue == 'radio' && blr.W15yQC.fnStringHasContent(aFormControlsList[i].legendText)==false) {
              blr.W15yQC.fnAddNote(aFormControlsList[i], 'frmCtrlRadioButtonWOLegendText'); // formcontrols01.html
          }
          // frmCtrlInputTypeImageWOAltAttr frmCtrlInputTypeImageWOAltText
          if(nodeTagName == 'input' && nodeTypeValue == 'image' && aFormControlsList[i].node.hasAttribute('alt')==false) {
              blr.W15yQC.fnAddNote(aFormControlsList[i], 'frmCtrlInputTypeImageWOAltAttr'); //
          } else if(nodeTagName == 'input' && nodeTypeValue == 'image' && blr.W15yQC.fnStringHasContent(aFormControlsList[i].node.getAttribute('alt'))==false) {
              blr.W15yQC.fnAddNote(aFormControlsList[i], 'frmCtrlInputTypeImageWOAltText'); //
          }
          
          // Check form control's dist from label
          if(aFormControlsList[i].node.hasAttribute('id') == true && (nodeTagName == 'button' || nodeTagName == 'textarea' || nodeTagName == 'select' || nodeTagName == 'input')) {
            explictLabelsList = blr.W15yQC.fnFindLabelNodesForId(aFormControlsList[i].node.getAttribute('id'), aFormControlsList[i].doc);
            minDist = 10000;
            bCheckedLabel = false;
            for (j = 0; j < explictLabelsList.length; j++) {
              if(blr.W15yQC.fnNodeIsOffScreen(explictLabelsList[j])== false && blr.W15yQC.fnNodeIsMasked(explictLabelsList[j])== false) {
                minDist = Math.min(minDist, blr.W15yQC.fnMinDistanceBetweenNodes(explictLabelsList[j], aFormControlsList[i].node));
                bCheckedLabel=true;
              }
            }
            if(bCheckedLabel && explictLabelsList.length>0 && minDist>100) {
              blr.W15yQC.fnAddNote(aFormControlsList[i], 'frmCtrlLabelDistance', [minDist]); //
            }
          }

          // Look for label issues
          // TODO: Add empty label check, implicit with no child form control check
          if(nodeTagName == 'label') {
            if(aFormControlsList[i].node.hasAttribute('for') == true) {
              sForValue = aFormControlsList[i].node.getAttribute('for');
              if(sForValue != null && sForValue.length>0) {
                if(blr.W15yQC.fnIsValidHtmlID(sForValue) == false) {
                  blr.W15yQC.fnAddNote(aFormControlsList[i], 'frmCtrlForValInvalid'); //
                } else if(aDocumentsList[aFormControlsList[i].ownerDocumentNumber-1].idHashTable.getItem(sForValue)>1) {
                  blr.W15yQC.fnAddNote(aFormControlsList[i], 'frmCtrlForValIDNotUnique'); //
                }
                targetNode = aFormControlsList[i].doc.getElementById(sForValue);
                if(targetNode != null && targetNode.tagName) {
                  if(blr.W15yQC.fnIsFormControlNode(targetNode) == false) {
                    blr.W15yQC.fnAddNote(aFormControlsList[i], 'frmCtrlNoFrmCtrlForForValue'); //
                  }
                  if(blr.W15yQC.fnNodeIsHidden(targetNode) == true) {
                    blr.W15yQC.fnAddNote(aFormControlsList[i], 'frmCtrlForForValueIsHidden'); //
                  } else if(blr.W15yQC.fnNodeIsOffScreen(aFormControlsList[i].node)== false && blr.W15yQC.fnNodeIsMasked(aFormControlsList[i].node)== false){
                    iDist = blr.W15yQC.fnMinDistanceBetweenNodes(targetNode,aFormControlsList[i].node);
                    if( iDist > 100) {
                      blr.W15yQC.fnAddNote(aFormControlsList[i], 'frmCtrlLabelDistance', [iDist]); //
                    } 
                  }
                } else {
                  blr.W15yQC.fnAddNote(aFormControlsList[i], 'frmCtrlNoElForForValue'); //
                }
              } else {
                blr.W15yQC.fnAddNote(aFormControlsList[i], 'frmCtrlForValueEmpty'); //
              }
            } else {
              blr.W15yQC.fnAddNote(aFormControlsList[i], 'frmCtrlImplicitLabel'); //
            }
          } else if(nodeTagName == 'legend') {
            if(blr.W15yQC.fnElementIsChildOf(aFormControlsList[i].node,'fieldset')==false) {
              blr.W15yQC.fnAddNote(aFormControlsList[i], 'frmCtrlLegendWOFieldset'); 
            }
          } else if(nodeTagName == 'fieldset') {
            var legels=aFormControlsList[i].node.getElementsByTagName('legend');
            if(legels==null || legels.length!=1) {
              blr.W15yQC.fnAddNote(aFormControlsList[i], 'frmCtrlFieldsetWOLegend'); 
            }
          }
          
          aFormControlsList[i] = blr.W15yQC.fnAnalyzeARIAMarkupOnNode(aFormControlsList[i].node, aFormControlsList[i].doc, aFormControlsList[i]);
          if(aFormControlsList[i].node != null && aFormControlsList[i].node.hasAttribute('id')==true) {
            if(blr.W15yQC.fnIsValidHtmlID(aFormControlsList[i].node.getAttribute('id'))==false) {
              blr.W15yQC.fnAddNote(aFormControlsList[i], 'frmCtrlIDNotValid'); //
            }
            if(aDocumentsList[aFormControlsList[i].ownerDocumentNumber-1].idHashTable.getItem(aFormControlsList[i].node.getAttribute('id'))>1) {
              blr.W15yQC.fnAddNote(aFormControlsList[i], 'frmCtrlIDNotUnique'); //
            }
          }
        }
      }
      blr.W15yQC.fnUpdateWarningAndFailureCounts(aFormControlsList);
    },

    fnDisplayFormResults: function (rd, aFormsList) {
      var div, table, msgHash, tbody, i, fce, sNotes, sClass;
      div = rd.createElement('div');
      div.setAttribute('id', 'AIFormsList');

      blr.W15yQC.fnAppendExpandContractHeadingTo(div, rd, blr.W15yQC.fnMakeHeadingCountsString(aFormsList,'hrsForms','hrsNoForms'));

      if (aFormsList && aFormsList.length > 0) {
        table = rd.createElement('table');
        msgHash = new blr.W15yQC.HashTable();
        table.setAttribute('id', 'AIFormsTable');
        table = blr.W15yQC.fnCreateTableHeaders(rd, table, [blr.W15yQC.fnGetString('hrsTHNumberSym'), blr.W15yQC.fnGetString('hrsTHOwnerDocNumber'),
                                                            blr.W15yQC.fnGetString('hrsTHFormElement'), blr.W15yQC.fnGetString('hrsTHName'),
                                                            blr.W15yQC.fnGetString('hrsTHAction'), blr.W15yQC.fnGetString('hrsTHMethod'),
                                                            blr.W15yQC.fnGetString('hrsTHState'), blr.W15yQC.fnGetString('hrsTHNotes')]);

        tbody = rd.createElement('tbody');
        for (i = 0; i < aFormsList.length; i++) {
          fce = aFormsList[i];
          sNotes = blr.W15yQC.fnMakeHTMLNotesList(fce, msgHash);
          sClass = '';
          if (fce.failed) {
            sClass = 'failed';
          } else if (fce.warning) {
            sClass = 'warning';
          }
          blr.W15yQC.fnAppendTableRow(rd, tbody, [i + 1, fce.ownerDocumentNumber, blr.W15yQC.fnMakeWebSafe(fce.nodeDescription), fce.name, fce.action, fce.method, fce.stateDescription, sNotes], sClass);
        }
        table.appendChild(tbody);
        div.appendChild(table);
        blr.W15yQC.fnMakeTableSortable(div, rd, 'AIFormsTable');
      } else {
        blr.W15yQC.fnAppendPElementTo(div, rd, blr.W15yQC.fnGetString('hrsNoFormsDetected'));
      }
      rd.body.appendChild(div);
    },

    fnDisplayFormControlResults: function (rd, aFormControlsList) {
      var div, i, ak, bHasARIALabel, bHasLegend, bHasTitle, bHasARIADescription, bHasRole, bHasValue, bHasStateDescription,
          aTableHeaders, table, msgHash, tbody, fce, sNotes, sClass, aTableCells; 

      div = rd.createElement('div');
      div.setAttribute('id', 'AIFormControlsList');

      blr.W15yQC.fnAppendExpandContractHeadingTo(div, rd, blr.W15yQC.fnMakeHeadingCountsString(aFormControlsList,'hrsFormsCtrls','hrsNoFormCtrls'));

      if (aFormControlsList && aFormControlsList.length > 0) {
        bHasARIALabel = false;
        bHasLegend = false;
        bHasTitle = false;
        bHasARIADescription = false;
        bHasRole = false;
        bHasValue = false;
        bHasStateDescription = false;
        for (i = 0; i < aFormControlsList.length; i++) {
          ak = aFormControlsList[i];
          if (ak.legendText != null && ak.legendText.length > 0) { bHasLegend = true; }
          if (ak.title != null && ak.title.length > 0) { bHasTitle = true; }
          if (ak.role != null && ak.role.length > 0) { bHasRole = true; }
          if (ak.value != null && ak.value.length > 0) { bHasValue = true; }
          if (ak.ARIALabelText != null && ak.ARIALabelText.length > 0) { bHasARIALabel = true; }
          if (ak.ARIADescriptionText != null && ak.ARIADescriptionText.length > 0) { bHasARIADescription = true; }
          if (ak.stateDescription != null && ak.stateDescription.length > 0) { bHasStateDescription = true; }
        }

        aTableHeaders = [blr.W15yQC.fnGetString('hrsTHNumberSym'), blr.W15yQC.fnGetString('hrsTHFormNum'),
                             blr.W15yQC.fnGetString('hrsTHOwnerDocNumber'), blr.W15yQC.fnGetString('hrsTHFormCtrlEl')];
        if (bHasLegend) { aTableHeaders.push(blr.W15yQC.fnGetString('hrsTHLegend')); }
        aTableHeaders.push(blr.W15yQC.fnGetString('hrsTHLabelText'));
        if (bHasTitle) { aTableHeaders.push(blr.W15yQC.fnGetString('hrsTHTitle')); }
        if (bHasARIALabel) { aTableHeaders.push(blr.W15yQC.fnGetString('hrsTHARIALabel')); }
        aTableHeaders.push(blr.W15yQC.fnGetString('hrsTHEffectiveLabel'));
        if (bHasARIADescription) { aTableHeaders.push(blr.W15yQC.fnGetString('hrsTHARIADescription')); }
        aTableHeaders.push(blr.W15yQC.fnGetString('hrsTHName'));
        aTableHeaders.push(blr.W15yQC.fnGetString('hrsTHValue'));
        if (bHasStateDescription) { aTableHeaders.push(blr.W15yQC.fnGetString('hrsTHState')); }
        aTableHeaders.push(blr.W15yQC.fnGetString('hrsTHNotes'));

        table = rd.createElement('table');
        table.setAttribute('id', 'AIFormControlsTable');
        table = blr.W15yQC.fnCreateTableHeaders(rd, table, aTableHeaders);
        msgHash = new blr.W15yQC.HashTable();

        tbody = rd.createElement('tbody');
        for (i = 0; i < aFormControlsList.length; i++) {
          fce = aFormControlsList[i];
          sNotes = blr.W15yQC.fnMakeHTMLNotesList(fce, msgHash);
          sClass = '';
          if (fce.failed) {
            sClass = 'failed';
          } else if (fce.warning) {
            sClass = 'warning';
          }
          aTableCells = [i + 1, fce.parentFormNumber, fce.ownerDocumentNumber, blr.W15yQC.fnMakeWebSafe(fce.nodeDescription)];
          if (bHasLegend) { aTableCells.push(fce.legendText); }
          aTableCells.push(fce.labelTagText);
          if (bHasTitle) { aTableCells.push(fce.title); }
          if (bHasARIALabel) { aTableCells.push(fce.ARIALabelText); }
          aTableCells.push(fce.effectiveLabelText);
          if (bHasARIADescription) { aTableCells.push(fce.ARIADescriptionText); }
          aTableCells.push(fce.name);
          aTableCells.push(fce.value);
          if (bHasStateDescription) { aTableCells.push(fce.stateDescription); }
          aTableCells.push(sNotes);

          blr.W15yQC.fnAppendTableRow(rd, tbody, aTableCells, sClass);
        }
        table.appendChild(tbody);
        div.appendChild(table);
        blr.W15yQC.fnMakeTableSortable(div, rd, 'AIFormControlsTable');
      } else {
        blr.W15yQC.fnAppendPElementTo(div, rd, blr.W15yQC.fnGetString('hrsNoFormsCtrlsDetected'));
      }
      rd.body.appendChild(div);
    },


    fnGetLinks: function (doc, rootNode, aLinksList) {
      var c, frameDocument, xPath, nodeDescription, role, text, title, target, href, sState;
      if (aLinksList == null) { aLinksList = []; }

      if (doc != null) {
        if (rootNode == null) { rootNode = doc.body; }
        for (c = rootNode.firstChild; c != null; c = c.nextSibling) {
          if (c.nodeType == 1) { // Only pay attention to element nodes
            if (c.tagName && ((c.contentWindow && c.contentWindow.document !== null) || (c.contentDocument && c.contentDocument.body !== null)) && blr.W15yQC.fnNodeIsHidden(c) == false) { // Found a frame
              // get frame contents
              frameDocument = c.contentWindow ? c.contentWindow.document : c.contentDocument;
              blr.W15yQC.fnGetLinks(frameDocument, frameDocument.body, aLinksList);
            } else { // keep looking through current document
              if (c.tagName && blr.W15yQC.fnNodeIsHidden(c) == false) {
                if(c.tagName.toLowerCase()=='a') {  // document the link
                  xPath = blr.W15yQC.fnGetElementXPath(c);
                  nodeDescription = blr.W15yQC.fnDescribeElement(c, 400);
                  role = blr.W15yQC.fnGetNodeAttribute(c, 'role', null);
                  text = blr.W15yQC.fnGetDisplayableTextRecursively(c);
                  title = blr.W15yQC.fnGetNodeAttribute(c, 'title', null);
                  target = blr.W15yQC.fnGetNodeAttribute(c, 'target', null);
                  href = blr.W15yQC.fnGetNodeAttribute(c, 'href', null);
                  sState = blr.W15yQC.fnGetNodeState(c);
                  aLinksList.push(new blr.W15yQC.linkElement(c, xPath, nodeDescription, doc, aLinksList.length, role, sState, text, title, target, href));
                } else if(c.tagName.toLowerCase()=='area') {
                  xPath = blr.W15yQC.fnGetElementXPath(c);
                  nodeDescription = blr.W15yQC.fnDescribeElement(c, 400);
                  role = blr.W15yQC.fnGetNodeAttribute(c, 'role', null);
                  text = blr.W15yQC.fnGetEffectiveLabelText(c, doc); // TODO: Vet this with JAWS!
                  title = blr.W15yQC.fnGetNodeAttribute(c, 'title', null);
                  target = blr.W15yQC.fnGetNodeAttribute(c, 'target', null);
                  href = blr.W15yQC.fnGetNodeAttribute(c, 'href', null);
                  sState = blr.W15yQC.fnGetNodeState(c);
                  aLinksList.push(new blr.W15yQC.linkElement(c, xPath, nodeDescription, doc, aLinksList.length, role, sState, text, title, target, href));
                }
              }
              blr.W15yQC.fnGetLinks(doc, c, aLinksList);
            }
          }
        }
      }
      return aLinksList;
    },


    fnAnalyzeLinks: function (aLinksList, aDocumentsList, progressWindow) {
      var i, aChildImages, j, linkText, maxRect, aSameHrefAndOnclick, aSameLinkText, aSoundsTheSame, aDiffTextSameHref, hrefsAreEqual,
          bLinkTextsAreDifferent, bOnclickValuesAreDifferent, sHref, sTargetId, sSamePageLinkTarget, aTargetLinksList, iTargetedLink, targetNode;
      blr.W15yQC.fnLog('fnAnalyzeLinks-starts');
      if(blr.W15yQC.sb == null) { blr.W15yQC.fnInitStringBundles(); }
      // Check if link Texts are empty, too short, only ASCII symbols, the same as other link texts, or sounds like any other link texts
      for (i = 0; i < aLinksList.length; i++) {
        aLinksList[i].ownerDocumentNumber = blr.W15yQC.fnGetOwnerDocumentNumber(aLinksList[i].node, aDocumentsList);
        aLinksList[i].stateDescription = blr.W15yQC.fnGetNodeState(aLinksList[i].node);
        if (aLinksList[i].text != null && aLinksList[i].text.length && aLinksList[i].text.length > 0) {
          aLinksList[i].text = blr.W15yQC.fnCleanSpaces(aLinksList[i].text);
          blr.W15yQC.fnLog('i='+i+' aLinksList[i].odn='+aLinksList[i].ownerDocumentNumber);
          aLinksList[i].soundex = blr.W15yQC.fnSetIsEnglishLocale(aDocumentsList[aLinksList[i].ownerDocumentNumber-1].language) ? blr.W15yQC.fnGetSoundExTokens(aLinksList[i].text) : '';
        } else {
          aLinksList[i].soundex = '';
        }
        if (aLinksList[i].title != null && aLinksList[i].text.length && aLinksList[i].title.length > 0) {
          aLinksList[i].title = blr.W15yQC.fnCleanSpaces(aLinksList[i].title);
        }
      }

      for (i = 0; i < aLinksList.length; i++) {
        if(i>20 && (i % 5)==0){
          if(progressWindow != null) {
            progressWindow.document.getElementById('percent').value=Math.round(51*i/aLinksList.length)+24;
            progressWindow.document.getElementById('detailText').value='Inspecting Links ' + (Math.round(100*i/aLinksList.length)).toString();
            progressWindow.focus();
          }
          blr.W15yQC.fnDoEvents();
        }

        aChildImages=aLinksList[i].node.getElementsByTagName('img');
        if(aChildImages != null && aChildImages.length>0) {
          for(j=0; j< aChildImages.length; j++) { 
            if(aChildImages[j].hasAttribute('ismap')==true) {
              blr.W15yQC.fnAddNote(aLinksList[i], 'lnkServerSideImageMap'); // TODO: QA This, determine how ismap is actually used
            }
          }
        }
        
        if (aLinksList[i].href == null && aLinksList[i].node.hasAttribute('name') == false && aLinksList[i].node.hasAttribute('id') == false) {
          blr.W15yQC.fnAddNote(aLinksList[i], 'lnkInvalid'); //
        } else if (blr.W15yQC.fnStringHasContent(aLinksList[i].node.getAttribute('href'))==false &&
                   (blr.W15yQC.fnStringHasContent(aLinksList[i].node.getAttribute('title')) == true ||
                    blr.W15yQC.fnStringHasContent(aLinksList[i].node.getAttribute('alt')) == true ||
                    blr.W15yQC.fnStringHasContent(aLinksList[i].node.getAttribute('target')) == true ||
                    blr.W15yQC.fnStringHasContent(aLinksList[i].text) == true)) {
                      blr.W15yQC.fnAddNote(aLinksList[i], 'lnkLinkMissingHrefValue'); //
                }

        if(aLinksList[i].node.hasAttribute('alt')) {
          blr.W15yQC.fnAddNote(aLinksList[i], 'lnkHasInvalidAltAttribute'); //
        }

        if (aLinksList[i].text == null) {
          blr.W15yQC.fnAddNote(aLinksList[i], 'lnkTxtMissing'); //
        } else if (aLinksList[i].text.length && aLinksList[i].text.length > 0) { //TODO: Make sure these tests need to be in this if clause, or is that hiding something?
          linkText = blr.W15yQC.fnTrim(aLinksList[i].text.toLowerCase());
          if (blr.W15yQC.fnOnlyASCIISymbolsWithNoLettersOrDigits(linkText)) {
            blr.W15yQC.fnAddNote(aLinksList[i], 'lnkTxtOnlyASCII'); //
          } else if (blr.W15yQC.fnIsOnlyNextOrPreviousText(linkText)) {
            blr.W15yQC.fnAddNote(aLinksList[i], 'lnkTxtNextPrev'); //
          } else if (linkText.match(/^link to /i)) { // TODO: Make functions for testing for this.
            blr.W15yQC.fnAddNote(aLinksList[i], 'lnkTxtBeginWithLink'); //
          } else if (blr.W15yQC.fnIsMeaningfulLinkText(linkText) == false) {
            blr.W15yQC.fnAddNote(aLinksList[i], 'lnkTxtNotMeaningful'); //
          }

          maxRect = blr.W15yQC.fnGetMaxNodeRectangleDimensions(aLinksList[i].node);

          if(maxRect != null && maxRect[0] < 14 && maxRect[1] < 14 && (maxRect[0] > 0 && maxRect[1]>0) &&
             blr.W15yQC.fnNodeIsMasked(aLinksList[i].node)==false && blr.W15yQC.fnNodeIsOffScreen(aLinksList[i].node)==false) {
            blr.W15yQC.fnAddNote(aLinksList[i], 'lnkTooSmallToHit', [maxRect[0],maxRect[1]]); // TODO: QA This, Check order
          }

          aSameLinkText = [];
          aSoundsTheSame = [];
          aSameHrefAndOnclick = [];
          aDiffTextSameHref = [];

          for (j = 0; j < aLinksList.length; j++) {
            if (j != i) {
              hrefsAreEqual = blr.W15yQC.fnURLsAreEqual(aLinksList[i].doc.URL,aLinksList[i].href, aLinksList[j].doc.URL,aLinksList[j].href);
              bLinkTextsAreDifferent = blr.W15yQC.fnLinkTextsAreDifferent(aLinksList[i].text,aLinksList[j].text);
              if (aLinksList[j].text && aLinksList[j].text.length > 0) {
                if (bLinkTextsAreDifferent == false && (aLinksList[i].href == null || hrefsAreEqual == false || aLinksList[i].href.length < 1)) {
                  aSameLinkText.push(j+1);
                } else if (aLinksList[i].length>2 && aLinksList[i].soundex == aLinksList[j].soundex && hrefsAreEqual == false) {
                  aSoundsTheSame.push(j+1);
                }
              }

              if (aLinksList[i].href != null && hrefsAreEqual == true && bLinkTextsAreDifferent == true) {
                bOnclickValuesAreDifferent = blr.W15yQC.fnScriptValuesAreDifferent(blr.W15yQC.fnGetNodeAttribute(aLinksList[i].node,'onclick',null), blr.W15yQC.fnGetNodeAttribute(aLinksList[j].node,'onclick',null));
                if(aLinksList[i].node.hasAttribute('onclick') == true || aLinksList[j].node.hasAttribute('onclick') == true) {
                  if(bOnclickValuesAreDifferent == false) {
                    aSameHrefAndOnclick.push(j+1);
                  }
                } else { // unless javascript:;, #, javascript:void(0)
                  if(/^\s*(#|javascript:;?|javascript:\s*void\(\s*0\s*\)\s*;?)\s*$/i.test(aLinksList[i].href)==false) { aDiffTextSameHref.push(j+1); }
                }
              }
            }
          }

          if(aSameLinkText.length>0) {
            blr.W15yQC.fnAddNote(aLinksList[i], 'lnkTxtNotUnique', [blr.W15yQC.fnCutoffString(aSameLinkText.toString(),99)]); //
          }

          if(aSoundsTheSame.length>0) {
            blr.W15yQC.fnAddNote(aLinksList[i], 'lnkTxtDoesntSoundUnique',[blr.W15yQC.fnCutoffString(aSoundsTheSame.toString(),99)]); //
          }

          if(aSameHrefAndOnclick.length>0) {
            blr.W15yQC.fnAddNote(aLinksList[i], 'lnkTxtDiffSameHrefOnclick',[blr.W15yQC.fnCutoffString(aSameHrefAndOnclick.toString(),99)]); //
          }

          if(aDiffTextSameHref.length>0) {
            blr.W15yQC.fnAddNote(aLinksList[i], 'lnkTxtDiffSameHref',[blr.W15yQC.fnCutoffString(aDiffTextSameHref.toString(),99)]); //
          }

        } else {
          if (aLinksList[i].node && aLinksList[i].node.hasAttribute && aLinksList[i].node.hasAttribute('href') == true) {
            blr.W15yQC.fnAddNote(aLinksList[i], 'lnkTxtEmpty'); //
          } else if (aLinksList[i].node && aLinksList[i].node.getAttribute && ((aLinksList[i].node.getAttribute('name') != null && aLinksList[i].node.getAttribute('name').length > 0) || (aLinksList[i].node.getAttribute('id') != null && aLinksList[i].node.getAttribute('id').length > 0))) {
            blr.W15yQC.fnAddNote(aLinksList[i], 'lnkIsNamedAnchor'); //
          }
        }

        if (aLinksList[i].node && aLinksList[i].node.hasAttribute && aLinksList[i].node.hasAttribute('href') == true) {
          // TODO: Check for ambiguious targets - duplicate IDs or Names
          blr.W15yQC.fnLog('Check for ambiguious targets - duplicate IDs or Names');
          sHref = aLinksList[i].node.getAttribute('href');
          if (sHref != null) {
            sHref = blr.W15yQC.fnTrim(sHref);
            if (sHref.length > 1 && sHref[0] == '#') { // Found same page link
              sTargetId = sHref.substring(1);
              sSamePageLinkTarget = null;
              // Same page links seem to target elements with a given id first, named anchors second...
              // First, see if the id matches one of the other links so we can better describe the target
              // New strat: First use getElementById,
              //  2: if get an el, see if it is one of the links
              //  3: if get an el, and not one of the links display el
              //  4: if no el, check for name on link
              //  5: what if both id and name?
              //  6: what if multiple el with same name?

              aTargetLinksList=[];
              iTargetedLink=null;
              blr.W15yQC.fnLog('sTargetId:');
              blr.W15yQC.fnLog(sTargetId);
              targetNode = aLinksList[i].doc.getElementById(sTargetId);
              if (targetNode != null) {
                for (j = 0; j < aLinksList.length; j++) {
                  if (aLinksList[j] != null && aLinksList[j].node != null && aLinksList[j].ownerDocumentNumber == aLinksList[i].ownerDocumentNumber &&
                      aLinksList[j].node.hasAttribute &&
                      ((aLinksList[j].node.hasAttribute('id') && aLinksList[j].node.getAttribute('id') == sTargetId) ||
                       (aLinksList[j].node.hasAttribute('name') && aLinksList[j].node.getAttribute('name') == sTargetId))) {
                    aTargetLinksList.push(j + 1);
                    if(targetNode===aLinksList[j].node) { iTargetedLink=j+1; } // Note which one actually was targeted
                  }
                }
                if(iTargetedLink != null) { // getElementById returned a link in the list
                  if(aTargetLinksList.length>1) {
                    blr.W15yQC.fnAddNote(aLinksList[i], 'lnkTargetAmbiguousMultipleLinks',[aTargetLinksList.toString()]); //
                  } else if(aTargetLinksList.length==1) {
                    blr.W15yQC.fnAddNote(aLinksList[i], 'lnkTargetsLink',[aTargetLinksList[0]]); //
                  }
                } else { // getElementById did not return a link in the list
                  if(aTargetLinksList.length>0) { // ambiguous - also matched a link
                    if(targetNode.tagName && targetNode.tagName.toLowerCase()=='a') {
                      blr.W15yQC.fnAddNote(aLinksList[i], 'lnkTargetAmbiguousAndHiddenLink',[aTargetLinksList.toString(),blr.W15yQC.fnDescribeElement(targetNode)]); //
                    } else {
                      blr.W15yQC.fnAddNote(aLinksList[i], 'lnkTargetAmbiguousLinksAndNonLink',[aTargetLinksList.toString(),blr.W15yQC.fnDescribeElement(targetNode)]); //
                    }
                  } else {
                    blr.W15yQC.fnAddNote(aLinksList[i], 'lnkTargets',[blr.W15yQC.fnDescribeElement(targetNode)]); //
                  }
                }
              } else { // getElementByID returned null
                for (j = 0; j < aLinksList.length; j++) {
                  if (aLinksList[j] != null && aLinksList[j].node != null && aLinksList[j].ownerDocumentNumber == aLinksList[i].ownerDocumentNumber &&
                      aLinksList[j].node.hasAttribute &&
                      ((aLinksList[j].node.hasAttribute('id') && aLinksList[j].node.getAttribute('id') == sTargetId) ||
                       (aLinksList[j].node.hasAttribute('name') && aLinksList[j].node.getAttribute('name') == sTargetId))) {
                    aTargetLinksList.push(j + 1);
                  }
                }
                if(aTargetLinksList.length>1) {
                  blr.W15yQC.fnAddNote(aLinksList[i], 'lnkTargetAmbiguousMultipleLinks',[aTargetLinksList.toString()]); //
                } else if(aTargetLinksList.length==1) {
                  blr.W15yQC.fnAddNote(aLinksList[i], 'lnkTargetsLink',[aTargetLinksList[0]]); //
                } else {
                  if(blr.W15yQC.fnIsValidHtmlID(sTargetId)) {
                    blr.W15yQC.fnAddNote(aLinksList[i], 'lnkTargetDoesNotExist'); //
                  } else {
                    blr.W15yQC.fnAddNote(aLinksList[i], 'lnkTargetDoesNotAppearValid'); //
                  }
                }
              }




              //for (var j = 0; j < aLinksList.length; j++) {
              //  if (aLinksList[j] != null && aLinksList[j].node != null && aLinksList[j].ownerDocumentNumber == aLinksList[i].ownerDocumentNumber && aLinksList[j].node.hasAttribute && aLinksList[j].node.hasAttribute('id') && aLinksList[j].node.getAttribute('id') == sTargetId) {
              //    blr.W15yQC.fnAddNote(aLinksList[i], 'lnkTargetsLink',[(j + 1)]); //
              //    bTargetFound = true;
              //    break;
              //  }
              //}
              //if (sSamePageLinkTarget == null) {
              //  // See if any other nodes have the desired id
              //  var targetNode = aLinksList[i].doc.getElementById(sTargetId);
              //  if (targetNode != null) {
              //    blr.W15yQC.fnAddNote(aLinksList[i], 'lnkTargets',[blr.W15yQC.fnDescribeElement(targetNode)]); //
              //    bTargetFound = true;
              //  }
              //}
              //if (sSamePageLinkTarget == null) {
              //  // Now look and see if any links have the desired name value
              //  for (var j = 0; j < aLinksList.length; j++) {
              //    if (aLinksList[j] != null && aLinksList[j].node != null && aLinksList[j].ownerDocumentNumber == aLinksList[i].ownerDocumentNumber && aLinksList[j].node.hasAttribute && aLinksList[j].node.hasAttribute('name') && aLinksList[j].node.getAttribute('name') == sTargetId) {
              //      blr.W15yQC.fnAddNote(aLinksList[i], 'lnkTargetsLink',[(j + 1)]); //
              //      bTargetFound = true;
              //      break;
              //    }
              //  }
              //}
              //
              //if (bTargetFound == false) {
              //  blr.W15yQC.fnAddNote(aLinksList[i], 'lnkTargetDoesNotExist'); //
              //}
              //// is link target ambiguous / non unique?

              if(aDocumentsList[aLinksList[i].ownerDocumentNumber-1].idHashTable.getItem(sTargetId)>1) {
                blr.W15yQC.fnAddNote(aLinksList[i], 'lnkTargetIDisNotUnique'); //
              }

              // is link target a valid ID?
              if(blr.W15yQC.fnIsValidHtmlID(sTargetId)==false) {
                blr.W15yQC.fnAddNote(aLinksList[i], 'lnkTargetIDNotValid'); //
              }

            }
          }
        }

        if(aLinksList[i].node != null && aLinksList[i].node.hasAttribute('onclick') == true && aLinksList[i].node.hasAttribute('onkeypress') == true &&
           aLinksList[i].node.getAttribute('onclick').length>0 && aLinksList[i].node.getAttribute('onkeypress').length>0) { // TODO: Make this check more sophisticated
            if(/^\s*return\s*\(*\s*false\)*\s*\s*;*\s*$/.test(aLinksList[i].node.getAttribute('onkeypress').toLowerCase())==false) {
              blr.W15yQC.fnAddNote(aLinksList[i], 'lnkHasBothOCandOK'); //
            }
        }

        aLinksList[i] = blr.W15yQC.fnAnalyzeARIAMarkupOnNode(aLinksList[i].node, aLinksList[i].doc, aLinksList[i]);

        if(aLinksList[i].node != null && aLinksList[i].node.hasAttribute('id')==true) {
          if(blr.W15yQC.fnIsValidHtmlID(aLinksList[i].node.getAttribute('id'))==false) {
            blr.W15yQC.fnAddNote(aLinksList[i], 'lnkIDNotValid'); //
          }
          if(aDocumentsList[aLinksList[i].ownerDocumentNumber-1].idHashTable.getItem(aLinksList[i].node.getAttribute('id'))>1) {
            blr.W15yQC.fnAddNote(aLinksList[i], 'lnkIDNotUnique'); //
          }
        }
      }
      blr.W15yQC.fnUpdateWarningAndFailureCounts(aLinksList);
    },

    fnDisplayLinkResults: function (rd, aLinksList) {
      var div, table, msgHash, tbody, i, sNotes, sClass;
      div = rd.createElement('div');
      div.setAttribute('id', 'AILinksList');

      blr.W15yQC.fnAppendExpandContractHeadingTo(div, rd, blr.W15yQC.fnMakeHeadingCountsString(aLinksList,'hrsLinks','hrsNoLinks'));

      if (aLinksList && aLinksList.length > 0) {
        table = rd.createElement('table');
        table.setAttribute('id', 'AILinksTable');
        table = blr.W15yQC.fnCreateTableHeaders(rd, table, [blr.W15yQC.fnGetString('hrsTHNumberSym'), blr.W15yQC.fnGetString('hrsTHLinkElement'),
                                                            blr.W15yQC.fnGetString('hrsTHOwnerDocNumber'), blr.W15yQC.fnGetString('hrsTHLinkTxt'),
                                                            blr.W15yQC.fnGetString('hrsTHTitle'), blr.W15yQC.fnGetString('hrsTHHref'),
                                                            blr.W15yQC.fnGetString('hrsTHState'), blr.W15yQC.fnGetString('hrsTHNotes')]);
        msgHash = new blr.W15yQC.HashTable();

        tbody = rd.createElement('tbody');
        for (i = 0; i < aLinksList.length; i++) {
          sNotes = blr.W15yQC.fnMakeHTMLNotesList(aLinksList[i], msgHash);
          sClass = '';
          if (aLinksList[i].failed) {
            sClass = 'failed';
          } else if (aLinksList[i].warning) {
            sClass = 'warning';
          }
          blr.W15yQC.fnAppendTableRow(rd, tbody, [i + 1, blr.W15yQC.fnMakeWebSafe(aLinksList[i].nodeDescription), aLinksList[i].ownerDocumentNumber, aLinksList[i].text, aLinksList[i].title, blr.W15yQC.fnCutoffString(aLinksList[i].href,500), aLinksList[i].stateDescription, sNotes], sClass);
        }
        table.appendChild(tbody);
        div.appendChild(table);
        blr.W15yQC.fnMakeTableSortable(div, rd, 'AILinksTable');
      } else {
        blr.W15yQC.fnAppendPElementTo(div, rd, blr.W15yQC.fnGetString('hrsNoLinksDetected'));
      }
      rd.body.appendChild(div);
    },

    fnGetTables: function (doc, rootNode, aTablesList, inTable, nestingDepth) {
      var c, frameDocument, tagName, xPath, nodeDescription, title, tableSummary, role;
      // TODO: test if inTable is working properly in nested tables
      // TODO: verify nesting level stats
      // TODO: list parent table
      if (aTablesList == null) { aTablesList = []; }
      if (nestingDepth == null) { nestingDepth = 0; }

      if (doc != null) {
        if (rootNode == null) { rootNode = doc.body; }
        for (c = rootNode.firstChild; c != null; c = c.nextSibling) {
          if (c.nodeType == 1) { // Only pay attention to element nodes
            if (c.tagName && ((c.contentWindow && c.contentWindow.document !== null) || (c.contentDocument && c.contentDocument.body !== null)) && blr.W15yQC.fnNodeIsHidden(c) == false) { // Found a frame
              // get frame contents
              frameDocument = c.contentWindow ? c.contentWindow.document : c.contentDocument;
              blr.W15yQC.fnGetTables(frameDocument, frameDocument.body, aTablesList, null, nestingDepth);
            } else { // keep looking through current document
              if (c.tagName) {
                tagName = c.tagName.toLowerCase();
                if (tagName == 'table' && blr.W15yQC.fnNodeIsHidden(c) == false) {
                  // Document table
                  if(inTable != null || nestingDepth>0) {
                    nestingDepth += 1;
                  }
                  tagName = c.tagName.toLowerCase();
                  xPath = blr.W15yQC.fnGetElementXPath(c);
                  nodeDescription = blr.W15yQC.fnDescribeElement(c, 400);
                  title = blr.W15yQC.fnGetNodeAttribute(c, 'title', null);
                  tableSummary = blr.W15yQC.fnCleanSpaces(blr.W15yQC.fnGetNodeAttribute(c, 'summary', null));
                  role = blr.W15yQC.fnGetNodeAttribute(c, 'role', null);
                  inTable = aTablesList.length;
                  aTablesList.push(new blr.W15yQC.table(c, xPath, nodeDescription, doc, aTablesList.length, role, nestingDepth, title, tableSummary));
                  if(tableSummary != null && tableSummary.length>0) {
                    aTablesList[inTable].isDataTable=true;
                  }
                } else if(inTable != null) {
                  switch(tagName) {
                    case 'th':
                      aTablesList[inTable].isDataTable=true;
                      aTablesList[inTable].bHasTHCells = true;
                      if(c.hasAttribute('rowspan') || c.hasAttribute('colspan')) {
                        aTablesList[inTable].isComplex=true;
                      }
                      break;
                    case 'caption':
                      aTablesList[inTable].isDataTable=true;
                      aTablesList[inTable].bHasCaption = true;
                      if(aTablesList[inTable].caption == null) {
                        aTablesList[inTable].caption = blr.W15yQC.fnCleanSpaces(blr.W15yQC.fnGetDisplayableTextRecursively(c));
                      } else {
                        blr.W15yQC.fnAddNote(aTablesList[inTable], 'tblMultipleCaptions'); // TODO: QA THIS
                      }
                      break;
                    case 'td':
                      if(c.hasAttribute('rowspan') || c.hasAttribute('colspan')) {
                        aTablesList[inTable].isComplex=true;
                      }
                      if(c.hasAttribute('headers')) {
                        aTablesList[inTable].isDataTable=true;
                        aTablesList[inTable].bHasHeadersAttr = true;
                      }
                      break;
                    case 'tr':
                      break;
                  }
                }
              }
            }
            blr.W15yQC.fnGetTables(doc, c, aTablesList, inTable, nestingDepth);
            if(inTable != null && c.tagName.toLowerCase() == 'table') {
              inTable = null;
              if(nestingDepth>0) { nestingDepth += -1; }
            }
          }
        }
      }
      return aTablesList;
    },

    fnAnalyzeTables: function (aTablesList, aDocumentsList) {
      var i, node, j, maxColumns, rowCount, bHasThead, bHasMultipleTheads, bHasTfoot, bHasMultipleTfoots, bHasTbody, bHasMultipleTbodys, bHasRowsOutsideOfTheadAndTbody,
      theaderRows, bMarkedAsPresentation, bRowsUnbalanced, bRowspanColspanConflict, firstRowWithContent, firstColumnWithContent,
      columnHasHeader, columnRowSpans, columnsInRow, bRowHasHeader, bTableUsesThElements, bTableUsesHeadersAttribute, bTableUsesAxisAttribute, bEveryTdInContentAreaHasHeadersAttribute,
      bEveryTdCellWithContentHasAHeadersAttribute, bEveryCellWithContentHasARowOrColumnHeader, bEveryTdCellWithContentHasHeaderOfSomeType, nodeStack,
      bInTableRow, columnsInThisRow, bInThead, bInTbody, bInTfoot, maxRowSpanRows, tableNode, tagName, bIsColumnHeader,
      cellContent, rowSpanValue, colSpanValue, newNode, stackedTagName, crsIndex, sWhyDataTable, colOffset, sColsList;
      
      if(blr.W15yQC.sb == null) { blr.W15yQC.fnInitStringBundles(); }
      // This does not pretend to fully validate a table
      // TODO: Finish this!!!
      // Detects colspan values that colide into rowspan values from above.
      // Detects when rows don't all have the same number of columns
      // Detects when "datatables" don't have any header cells
      //
      // TODO: Test on a table caption, on nest tables with captions, on multiple captions on a given table
      // QUESTION: If a table has multiple captions, what does JAWS do?
      for (i = 0; i < aTablesList.length; i++) {
        aTablesList[i].ownerDocumentNumber = blr.W15yQC.fnGetOwnerDocumentNumber(aTablesList[i].node, aDocumentsList);
        aTablesList[i].stateDescription = blr.W15yQC.fnGetNodeState(aTablesList[i].node);
        // Find parent table element
        if(i>0 && aTablesList[i].nestingLevel>0) {
          node = aTablesList[i].node.parentNode;
           while(node != null && node.tagName && node.tagName.toLowerCase() != 'table' && node.tagName.toLowerCase() !='body') {
            node = node.parentNode;
           }
           if(node != null && node.tagName && node.tagName.toLowerCase() == 'table') {
            for(j=0; j<i; j++) {
              if(aTablesList[j].node === node) {
                aTablesList[i].parentTable = j+1;
                break;
              }
            }
           }
        }
      }

      for (i = 0; i < aTablesList.length; i++) {
        // Determine the max number of columns in a row
        // Determine the number of rows
        // Determine if each row has the same number of columns
        maxColumns = 0;
        rowCount = 0;
        bHasThead = false;
        bHasMultipleTheads = false;
        bHasMultipleTfoots = false;
        bHasTbody = false;
        bHasTfoot = false;
        bHasMultipleTbodys = false;
        bHasRowsOutsideOfTheadAndTbody = false;
        theaderRows = 0;
        bMarkedAsPresentation = false;
        bRowsUnbalanced = false;
        bRowspanColspanConflict = false;
        firstRowWithContent = 0;
        firstColumnWithContent = 0;
        columnHasHeader = [];
        columnRowSpans = [];
        columnsInRow = [];
        bRowHasHeader = false;
        bTableUsesThElements = false;
        bTableUsesHeadersAttribute = false;
        bTableUsesAxisAttribute = false;
        bEveryTdInContentAreaHasHeadersAttribute = true;
        bEveryTdCellWithContentHasAHeadersAttribute = true;
        bEveryCellWithContentHasARowOrColumnHeader = true;
        bEveryTdCellWithContentHasHeaderOfSomeType = true;
        nodeStack = [];
        bInTableRow = false;
        columnsInThisRow = 0;
        bInThead = false;
        bInTfoot = false;
        bInTbody = false;
        maxRowSpanRows = 0;

        if((aTablesList[i].node.role != null && aTablesList[i].node.role.toLowerCase() == 'presentation') ||
           (blr.W15yQC.fnCleanSpaces(blr.W15yQC.fnGetNodeAttribute(aTablesList[i].node, 'datatable', null)) == '0')) {
            bMarkedAsPresentation = true;
           }

        if(aTablesList[i].node != null && aTablesList[i].node.tagName && aTablesList[i].node.tagName.toLowerCase() == 'table') {
          tableNode = aTablesList[i].node;
          node = tableNode.firstChild;
          if(node != null) {
            while(node != null) {
              tagName = '';
              if (node.nodeType == 1) {
                // Only pay attention to element nodes
                if(node.tagName && node.tagName.length > 0) {
                  bIsColumnHeader=false;
                  tagName = node.tagName.toLowerCase();
                  switch(tagName) {
                    case 'thead':
                      if(bHasThead) { bHasMultipleTheads = true; }
                      bHasThead = true;
                      bInThead = true;
                      break;
                    case 'tfoot':
                      if(bHasTfoot) { bHasMultipleTfoots = true; }
                      bHasTfoot = true;
                      bInTfoot = true;
                      break;
                    case 'tbody':
                      if(bHasTbody) { bHasMultipleTbodys = true; }
                      bHasTbody = true;
                      bInTbody = true;
                      break;
                    case 'tr':
                      blr.W15yQC.fnLog(aTablesList[i].caption+' tr found:columnRowSpans:'+columnRowSpans.toString());
                      bRowHasHeader = false;
                      if(bInTableRow == true) {
                        blr.W15yQC.fnAddNote(aTablesList[i], 'tblNestedTR'); //
                      } else {
                        rowCount++;
                      }
                      if(node.firstChild == null) {
                        blr.W15yQC.fnAddNote(aTablesList[i], 'tblEmptyTR'); //
                      } else {
                        bInTableRow = true;
                      }
                      if(bInTbody == false && bInThead == false) {
                        bHasRowsOutsideOfTheadAndTbody = true;
                      }
                      columnsInThisRow = 0;
                      bRowHasHeader = false;

                      //if(columnRowSpans.length<1) {
                      //  columnRowSpans.push(0);
                      //  columnHasHeader.push(false);
                      //}
                      blr.W15yQC.fnLog(aTablesList[i].caption+' just before while:columnsInThisRow:'+columnsInThisRow+' columnRowSpans:'+columnRowSpans.toString());
                      if(columnRowSpans.length>0) {
                        while(columnRowSpans[columnsInThisRow]>0) {
                          blr.W15yQC.fnLog(aTablesList[i].caption+' in while');
                          columnsInThisRow++;
                          if(columnRowSpans.length<columnsInThisRow+1) {
                            columnRowSpans.push(0);
                            if(columnHasHeader.length>1) {
                              columnHasHeader.push(columnHasHeader[columnHasHeader.length-1]);
                            } else {
                              columnHasHeader.push(false);
                            }
                          }
                        }
                      }
                      break;

                    case 'th':
                        bTableUsesThElements = true;
                        if(node.hasAttribute('scope')==false) {
                          if(columnsInThisRow<1) {
                            bRowHasHeader = true;
                          }
                          if(rowCount<=1) {
                            bIsColumnHeader = true;
                          }
                        }
                        aTablesList[i].isDataTable = true;
                        aTablesList[i].bHasTHCells = true;
                        
                    case 'td':
                      if(!bInTableRow) {
                        blr.W15yQC.fnAddNote(aTablesList[i], 'tblOutsideRow', [tagName]); // QA This
                      } else {
                        if(node.hasAttribute('scope')==true) { // TODO: How to handle rowgroup, colgroup values?
                          aTablesList[i].isDataTable = true;
                          aTablesList[i].bHasScopeAttr = true;
                          if(node.getAttribute('scope').toLowerCase()=='row') {
                            bRowHasHeader = true;
                          } else if(node.getAttribute('scope').toLowerCase()=='col') {
                            bIsColumnHeader = true;
                          }
                        }
                        // Does the cell use a headers attribute?
                        if(node.hasAttribute('headers') ==true) {
                          bTableUsesHeadersAttribute = true;
                          aTablesList[i].isDataTable = true;
                          aTablesList[i].bHasHeadersAttr = true;
                        }
                        if(node.hasAttribute('axis') ==true) {
                          bTableUsesAxisAttribute = true;
                          aTablesList[i].isDataTable = true;
                          aTablesList[i].bHasAxisAttr = true;
                        }
                        if(node.hasAttribute('abbr') ==true) {
                          aTablesList[i].isDataTable = true;
                          aTablesList[i].bHasAbbrAttr = true;
                        }
                        // Find out if a rowspan in this column in a previous row is pushing this cell over
                        if(columnRowSpans.length>=columnsInThisRow+1) {
                          while(columnRowSpans[columnsInThisRow]>0) { 
                            columnsInThisRow++;
                            if(columnRowSpans.length<columnsInThisRow+1) {
                              columnRowSpans.push(0); 
                              if(columnHasHeader.length>0) {
                                columnHasHeader.push(columnHasHeader[columnHasHeader.length-1]);
                              } else {
                                columnHasHeader.push(false);
                              }
                            }
                          }
                        }
                        if(columnRowSpans.length<columnsInThisRow+1) {
                          columnRowSpans.push(0);
                          columnHasHeader.push(bIsColumnHeader);
                        } else if(bIsColumnHeader) {
                          columnHasHeader[columnsInThisRow]=true;
                        }
                        // Find out if this cell has any content
                        cellContent = blr.W15yQC.fnTrim(blr.W15yQC.fnGetDisplayableTextRecursively(node));
                        if(cellContent != null && cellContent.length>0) {
                          //  Is it the first in the row/col?
                          if(columnsInThisRow + 1 < firstColumnWithContent) {
                            firstColumnWithContent = columnsInThisRow + 1;
                          }
                          if(rowCount < firstRowWithContent) {
                            firstRowWithContent = rowCount;
                          }
                          if(tagName=='td') {
                            if(aTablesList[i].node.hasAttribute('headers') != true) {
                              bEveryTdCellWithContentHasAHeadersAttribute = false;
                            }
                            if(columnHasHeader[columnsInThisRow]==false && bRowHasHeader==false) {
                              bEveryCellWithContentHasARowOrColumnHeader = false;
                            }
                            if(columnHasHeader[columnsInThisRow]==false && bRowHasHeader==false && node.hasAttribute('headers') != true) {
                              bEveryTdCellWithContentHasHeaderOfSomeType = false;
                            }
                          }                         
                        }
                        // Get the rowspan value
                        rowSpanValue = 1;
                        if(node.hasAttribute('rowspan') && blr.W15yQC.fnIsValidPositiveInt(node.getAttribute('rowspan'))) {
                          rowSpanValue = parseInt(node.getAttribute('rowspan'),10);
                          // TODO: What happens is rowspan is < 0?
                        }
                        // Find how many columns this cell represents
                        colSpanValue = 1;
                        if(node.hasAttribute('colspan') && blr.W15yQC.fnIsValidPositiveInt(node.getAttribute('colspan'))) {
                          colSpanValue = parseInt(node.getAttribute('colspan'),10);
                          // TODO: What happens is colspan is < 0?
                          blr.W15yQC.fnLog(aTablesList[i].caption+' colspan value:'+colSpanValue);
                          // Detect any colspan into rowspan colisions
                          for(colOffset=0;colOffset<colSpanValue;colOffset++) {
                            if(columnRowSpans.length>=columnsInThisRow+colOffset-1 && columnRowSpans[columnsInThisRow+colOffset]>0) {
                              // colspan colision with rowspan from previous row
                              blr.W15yQC.fnAddNote(aTablesList[i], 'tblColspanRowspanColision', [rowCount,(1+columnsInThisRow),(columnsInThisRow+colOffset+1)]); //
                            }
                          }
                        }

                        while(colSpanValue>0) {
                          while(columnRowSpans.length<columnsInThisRow+1) {
                            columnRowSpans.push(0);
                            columnHasHeader.push(bIsColumnHeader);
                          }
                          // Detect any colspan into rowspan colisions
                          if(columnRowSpans[columnsInThisRow]>0 && rowSpanValue>1) {
                            // rowspan colision with rowspan from previous row
                            blr.W15yQC.fnAddNote(aTablesList[i], 'tblRowspanRowspanColision', [rowCount,columnsInThisRow]); //
                          }
                          if(columnRowSpans[columnsInThisRow] < rowSpanValue) { columnRowSpans[columnsInThisRow] = rowSpanValue; }
                          blr.W15yQC.fnLog(aTablesList[i].caption+' rc:'+rowCount+' col:'+columnsInThisRow+' rowspan:'+rowSpanValue);
                          columnsInThisRow++;
                          colSpanValue--;
                        }

                        if(rowCount>firstRowWithContent && firstRowWithContent>0 && !node.hasAttribute('headers') && cellContent != null && cellContent.length >0) {
                          bEveryTdInContentAreaHasHeadersAttribute = false;
                        }
                      }
                      break;

                    default:
                      // TODO: handle expected tags above, give warning if something unexpected appears here!
                      break;
                  }
                }
              }
              // Leave current node and Find next node to examine
              if(node.firstChild != null &&
                 tagName != 'th' && tagName != 'td' && tagName != 'table' && tagName != 'caption') { // Don't dig into children of these nodes
                // Moving deeper...
                // TODO: Check that  a valid/expected tag is here
                nodeStack.push(node);
                node = node.firstChild;
              } else if(node.nextSibling != null || (nodeStack != null && nodeStack.length>0)) {
                newNode = null;
                do { // Handle leaving a node...
                  if (node.nodeType == 1 && node.tagName != null) {
                    stackedTagName = node.tagName.toLowerCase();
                    switch(stackedTagName) {
                      case 'tr':
                        blr.W15yQC.fnLog('leaving tr:columnRowSpans:'+columnRowSpans.toString());
                        while(columnRowSpans[columnsInThisRow]>0) {
                          columnsInThisRow++;
                          if(columnRowSpans.length<columnsInThisRow+1) {
                            columnRowSpans.push(0);
                            columnHasHeader.push(bIsColumnHeader);
                          }
                        }
                        if(columnsInThisRow != maxColumns && maxColumns>0) {
                          bRowsUnbalanced = true;
                          aTablesList[i].isComplex = true;
                        }
                        if(columnsInThisRow>maxColumns) {
                          maxColumns=columnsInThisRow;
                        } else if(columnsInThisRow == 0) {
                          blr.W15yQC.fnAddNote(aTablesList[i], 'tblRowWOCols'); //
                        }
                        columnsInRow.push(columnsInThisRow);
                        bInTableRow = false;
                        for(crsIndex=0;crsIndex<columnRowSpans.length;crsIndex++) {
                          if(columnRowSpans[crsIndex]>0) { columnRowSpans[crsIndex]--; }
                        }
                        break;

                      case 'thead':
                        bInThead = false;
                        break;

                      case 'tfoot':
                        bInTfoot = false;
                        break;

                      case 'tbody':
                        bInTbody = false;
                        break;
                    }
                  }
                  if(node.nextSibling != null) {
                    newNode = node.nextSibling;
                  } else {
                    if(nodeStack != null && nodeStack.length>0) {
                      node = nodeStack.pop();
                    } else {
                      node = null;
                    }
                  }
                } while(newNode == null && node != null);
                node = newNode;
              } else {
                node = null;
              }


            }
          } else { // empty table
            blr.W15yQC.fnAddNote(aTablesList[i], 'tblEmptyTable'); //
          }
        }

        for(crsIndex=0;crsIndex<columnRowSpans.length;crsIndex++) {
          if(columnRowSpans[crsIndex]>0) {
            blr.W15yQC.fnAddNote(aTablesList[i], 'tblRowpanExceedsTableRows',[(crsIndex+1)]); //
            break;
          }
        }
        aTablesList[i].maxRows = rowCount;
        aTablesList[i].maxCols = maxColumns;

        if(aTablesList[i].isDataTable == true) { // Looks like it is a data table
          sWhyDataTable='';
          if(aTablesList[i].bHasTHCells == true) { sWhyDataTable = 'Has TH Cells'; }
          if(aTablesList[i].bHasHeadersAttr == true) { sWhyDataTable = blr.W15yQC.fnJoin(sWhyDataTable, 'Has headers attributes',', '); }
          if(aTablesList[i].bHasScopeAttr == true) { sWhyDataTable = blr.W15yQC.fnJoin(sWhyDataTable, 'Has scope attributes',', '); }
          if(aTablesList[i].bHasAxisAttr == true) { sWhyDataTable = blr.W15yQC.fnJoin(sWhyDataTable, 'Has axis attributes',', '); }
          if(aTablesList[i].bHasAbbrAttr == true) { sWhyDataTable = blr.W15yQC.fnJoin(sWhyDataTable, 'Has abbr attributes',', '); }
          if(bHasTfoot == true) { sWhyDataTable = blr.W15yQC.fnJoin(sWhyDataTable, 'Has tfoot tags',', '); }
          if(bHasThead == true) { sWhyDataTable = blr.W15yQC.fnJoin(sWhyDataTable, 'Has thead tags',', '); }
          if(aTablesList[i].bHasCaption == true) { sWhyDataTable = blr.W15yQC.fnJoin(sWhyDataTable, 'Has a caption',', '); }
          if(aTablesList[i].node.hasAttribute('summary') == true) { sWhyDataTable = blr.W15yQC.fnJoin(sWhyDataTable, 'Has a summary',', '); }
          
          blr.W15yQC.fnAddNote(aTablesList[i], 'tblIsDataTable', [sWhyDataTable+'.']); // TODO: QA This
          // Warn that they should check if the table needs either a caption or a summary
          if(blr.W15yQC.fnStringHasContent(aTablesList[i].summary) == false && blr.W15yQC.fnStringHasContent(aTablesList[i].caption) == false) {
            blr.W15yQC.fnAddNote(aTablesList[i], 'tblCheckCaptionSummary'); //
          } else if(blr.W15yQC.fnStringsEffectivelyEqual(aTablesList[i].summary,aTablesList[i].caption)==true) {
            blr.W15yQC.fnAddNote(aTablesList[i], 'tblCaptionSameAsSummary'); // TODO: QA This!
          }

          if(blr.W15yQC.fnStringHasContent(aTablesList[i].summary)) {
            if(blr.W15yQC.fnAppearsToBeDefaultTableSummaryOrCaption(aTablesList[i].summary)) {              
              blr.W15yQC.fnAddNote(aTablesList[i], 'tblSummaryLooksLikeADefault'); //
            } else if(blr.W15yQC.fnAppearsToBeSummaryOrCaptionOnLayoutTable(aTablesList[i].summary) && aTablesList[i].bHasTHCells==false && aTablesList[i].bHasHeadersAttr==false) {
              blr.W15yQC.fnAddNote(aTablesList[i], 'tblSummaryLooksLikeLayout'); //
            } else if(blr.W15yQC.fnIsMeaningfulTableSummaryOrCaption(aTablesList[i].summary)) {              
              blr.W15yQC.fnAddNote(aTablesList[i], 'tblSummaryNotMeaningful'); //
            }
          }

          if(blr.W15yQC.fnStringHasContent(aTablesList[i].caption)) {
            if(blr.W15yQC.fnAppearsToBeDefaultTableSummaryOrCaption(aTablesList[i].caption)) {              
              blr.W15yQC.fnAddNote(aTablesList[i], 'tblCaptionLooksLikeADefault'); //
            } else if(blr.W15yQC.fnAppearsToBeSummaryOrCaptionOnLayoutTable(aTablesList[i].caption) && aTablesList[i].bHasTHCells==false && aTablesList[i].bHasHeadersAttr==false) {
              blr.W15yQC.fnAddNote(aTablesList[i], 'tblCaptionLooksLikeLayout'); //
            } else if(blr.W15yQC.fnIsMeaningfulTableSummaryOrCaption(aTablesList[i].caption)==false) {              
              blr.W15yQC.fnAddNote(aTablesList[i], 'tblCaptionNotMeaningful'); //
            }
          }
          
          // Warn that data tables should use table headers (th elements).
          if(bTableUsesThElements == false) {
            blr.W15yQC.fnAddNote(aTablesList[i], 'tblDTMissingTHs'); //
          } else if(bEveryCellWithContentHasARowOrColumnHeader==false && bEveryTdCellWithContentHasHeaderOfSomeType==false) {
            blr.W15yQC.fnAddNote(aTablesList[i], 'tblNotEveryCellWithContentInDTHasHeaders'); //
          }
          
          if(aTablesList[i].isComplex == true) {
            blr.W15yQC.fnAddNote(aTablesList[i], 'tblDTisComplex'); //

            if(bEveryTdCellWithContentHasAHeadersAttribute == false) {
              blr.W15yQC.fnAddNote(aTablesList[i], 'tblDTwTDwoHeadersAttrib'); //
            }

          }
          //bEveryTdCellWithContentHasAHeadersAttribute
          //bTableUsesHeadersAttribute
          //everyCellWithCOntentHasARowOrColumnHeader

        } else { // Looks like it is a layout table          
          if(aTablesList[i].maxCols * aTablesList[i].maxRows > 25 && Math.min(aTablesList[i].maxCols, aTablesList[i].maxRows)>4) {
            blr.W15yQC.fnAddNote(aTablesList[i], 'tblTooLargeForLayoutTable',[aTablesList[i].maxCols, aTablesList[i].maxRows]); // QA tabletests01.html
          } else {
            blr.W15yQC.fnAddNote(aTablesList[i], 'tblIsLayoutTable'); //
          }
        }

        // End of table analysis, now provide any warning / failure notices
        if(bRowsUnbalanced) {
          aTablesList[i].warning = true;
          sColsList = '';
          if(columnsInRow != null && columnsInRow.length>0 && columnsInRow.length<100) {
            sColsList = ': ['+columnsInRow.toString()+'].';
          } else {
            sColsList = '.';
          }
          blr.W15yQC.fnAddNote(aTablesList[i], 'tblUnequalColCount',[sColsList]); //
        }

        if(aTablesList[i].isComplex ==true) {
          if(aTablesList[i].isDataTable == true) { // TODO: Is something missing here?
          } else {
            aTablesList[i].warning = true;
            if(bMarkedAsPresentation == true) {
              blr.W15yQC.fnAddNote(aTablesList[i], 'tblLayoutTblIsComplex'); //
            } else {
              blr.W15yQC.fnAddNote(aTablesList[i], 'tblLayoutTblIsComplexWOpresRole'); //
            }
          }
        }
      }
      blr.W15yQC.fnUpdateWarningAndFailureCounts(aTablesList);
    },

    fnDisplayTableResults: function (rd, aTablesList) {
      var div, table, msgHash, tbody, i, sNotes, sClass, sSize;
      
      div = rd.createElement('div');
      div.setAttribute('id', 'AITablesList');

      blr.W15yQC.fnAppendExpandContractHeadingTo(div, rd, blr.W15yQC.fnMakeHeadingCountsString(aTablesList,'hrsTables','hrsNoTables'));

      if (aTablesList && aTablesList.length > 0) {
        table = rd.createElement('table');
        table.setAttribute('id', 'AITablesTable');
        // TODO: Make summary and caption columns so they only appear when needed.
        table = blr.W15yQC.fnCreateTableHeaders(rd, table, [blr.W15yQC.fnGetString('hrsTHNumberSym'), blr.W15yQC.fnGetString('hrsTHTableElement'),
                                                            blr.W15yQC.fnGetString('hrsTHOwnerDocNumber'), blr.W15yQC.fnGetString('hrsTHSummary'),
                                                            blr.W15yQC.fnGetString('hrsTHCaption'), blr.W15yQC.fnGetString('hrsTHSizeCR'),
                                                            blr.W15yQC.fnGetString('hrsTHState'), blr.W15yQC.fnGetString('hrsTHNotes')]);
        msgHash = new blr.W15yQC.HashTable();
        tbody = rd.createElement('tbody');
        for (i = 0; i < aTablesList.length; i++) {
          sNotes = blr.W15yQC.fnMakeHTMLNotesList(aTablesList[i], msgHash);
          sClass = '';
          if (aTablesList[i].failed) {
            sClass = 'failed';
          } else if (aTablesList[i].warning) {
            sClass = 'warning';
          }
          sSize = aTablesList[i].maxCols+' x '+aTablesList[i].maxRows;
          blr.W15yQC.fnAppendTableRow(rd, tbody, [i + 1, blr.W15yQC.fnMakeWebSafe(aTablesList[i].nodeDescription), aTablesList[i].ownerDocumentNumber, aTablesList[i].summary, aTablesList[i].caption, sSize, aTablesList[i].state, sNotes], sClass);
        }
        table.appendChild(tbody);
        div.appendChild(table);
        blr.W15yQC.fnMakeTableSortable(div, rd, 'AITablesTable');
      } else {
        blr.W15yQC.fnAppendPElementTo(div, rd, blr.W15yQC.fnGetString('hrsNoTablesDetected'));
      }
      rd.body.appendChild(div);
    },


    fnGetBadIDs: function (doc, aDocumentsList, rootNode, aBadIDsList) {
      var docNumber, c, sID, idCount, frameDocument, bNotUnique, bNotValid, xPath, nodeDescription;
      if (doc != null) {
        if (aBadIDsList == null) { aBadIDsList = []; }
        if (rootNode == null) { rootNode = doc.body; }
        if (rootNode != null && rootNode.firstChild != null) {
          for (c = rootNode.firstChild; c != null; c = c.nextSibling) {
            if (c.nodeType == 1) { // Only pay attention to element nodes
              if (c.tagName && c.hasAttribute('id') == true) {
                bNotUnique=false;
                bNotValid=false;
                sID = blr.W15yQC.fnTrim(c.getAttribute('id'));
                if(docNumber==null) { docNumber = blr.W15yQC.fnGetOwnerDocumentNumber(rootNode, aDocumentsList); }

                if(aDocumentsList[docNumber-1].idHashTable.getItem(sID)>1) { bNotUnique=true; }  
                if(blr.W15yQC.fnIsValidHtmlID(sID)==false) { bNotValid=true; }

                if(bNotUnique == true || bNotValid==true) {
                  xPath = blr.W15yQC.fnGetElementXPath(c);
                  nodeDescription = blr.W15yQC.fnDescribeElement(c, 400);
                  aBadIDsList.push(new blr.W15yQC.badId(c, xPath, nodeDescription, doc, aBadIDsList.length, docNumber, sID));
                  if(bNotUnique==true) {
                    blr.W15yQC.fnAddNote(aBadIDsList[aBadIDsList.length-1], 'idIsNotUnique');
                    aBadIDsList[aBadIDsList.length-1].failed = true;
                  } 
                  if(bNotValid==true) {
                    blr.W15yQC.fnAddNote(aBadIDsList[aBadIDsList.length-1], 'idIsNotValid');
                    aBadIDsList[aBadIDsList.length-1].warning = true;
                  } 
                }
              }

              if (c.tagName && ((c.contentWindow && c.contentWindow.document !== null) || (c.contentDocument && c.contentDocument.body !== null)) && blr.W15yQC.fnNodeIsHidden(c) == false) { // Found a frame
                // get frame contents
                frameDocument = c.contentWindow ? c.contentWindow.document : c.contentDocument;
                blr.W15yQC.fnGetBadIDs(frameDocument, aDocumentsList, frameDocument.body, aBadIDsList);
              } else { // keep looking through current document
                blr.W15yQC.fnGetBadIDs(doc, aDocumentsList, c, aBadIDsList);
              }
            }
          }
        }
      }
      blr.W15yQC.fnUpdateWarningAndFailureCounts(aBadIDsList);
      return aBadIDsList;
    },



    /*
     *
     * ======== Inspect methods ========
     *
     */

    fnInspectWindowTitle: function (rd) {
      blr.W15yQC.fnReadUserPrefs();
      if(blr.W15yQC.sb == null) { blr.W15yQC.fnInitStringBundles(); }
      blr.W15yQC.fnDisplayWindowDetails(rd);
    },

    fnInspectDocuments: function (rd, progressWindow) {
      blr.W15yQC.fnReadUserPrefs();
      var aDocumentsList;
      if(blr.W15yQC.sb == null) { blr.W15yQC.fnInitStringBundles(); }
      blr.W15yQC.fnSetIsEnglishLocale(blr.W15yQC.fnGetUserLocale());

      aDocumentsList = blr.W15yQC.fnGetDocuments(window.top.content.document);
      blr.W15yQC.fnUpdateProgress(progressWindow, 2, 'Analyzing Documents');
      blr.W15yQC.fnAnalyzeDocuments(aDocumentsList);
      blr.W15yQC.fnDisplayDocumentsResults(rd, aDocumentsList);
      return aDocumentsList;
    },

    fnInspectFrameTitles: function (rd, aDocumentsList, progressWindow) {
      blr.W15yQC.fnReadUserPrefs();
      var aFramesList = blr.W15yQC.fnGetFrameTitles(window.top.content.document);
      blr.W15yQC.fnUpdateProgress(progressWindow, 7, 'Analyzing Frames');
      blr.W15yQC.fnAnalyzeFrameTitles(aFramesList, aDocumentsList);
      blr.W15yQC.fnDisplayFrameTitleResults(rd, aFramesList);
    },

    fnInspectHeadings: function (rd, aDocumentsList, progressWindow) {
      blr.W15yQC.fnReadUserPrefs();
      var aHeadingsList = blr.W15yQC.fnGetHeadings(window.top.content.document);
      blr.W15yQC.fnUpdateProgress(progressWindow, 12, 'Analyzing Headings');
      blr.W15yQC.fnAnalyzeHeadings(aHeadingsList, aDocumentsList, progressWindow);
      blr.W15yQC.fnDisplayHeadingsResults(rd, aHeadingsList);
    },

    fnInspectARIALandmarks: function (rd, aDocumentsList, progressWindow) {
      blr.W15yQC.fnReadUserPrefs();
      var aARIALandmarksList = blr.W15yQC.fnGetARIALandmarks(window.top.content.document);
      blr.W15yQC.fnUpdateProgress(progressWindow, 17, 'Analyzing Landmarks');
      blr.W15yQC.fnAnalyzeARIALandmarks(aARIALandmarksList, aDocumentsList);
      blr.W15yQC.fnDisplayARIALandmarksResults(rd, aARIALandmarksList);
    },

    fnInspectARIAElements: function (rd, aDocumentsList, progressWindow) {
      blr.W15yQC.fnReadUserPrefs();
      var aARIAElementsList = blr.W15yQC.fnGetARIAElements(window.top.content.document);
      blr.W15yQC.fnUpdateProgress(progressWindow, 22, 'Analyzing ARIA');
      blr.W15yQC.fnAnalyzeARIAElements(aARIAElementsList, aDocumentsList);
      blr.W15yQC.fnDisplayARIAElementsResults(rd, aARIAElementsList);
    },

    fnInspectForms: function (rd, aDocumentsList, progressWindow) {
      blr.W15yQC.fnReadUserPrefs();
      var aFormControlsLists = blr.W15yQC.fnGetFormControls(window.top.content.document, null, aDocumentsList),
          aFormControlsList = aFormControlsLists[1],
          aFormsList = aFormControlsLists[0];
      blr.W15yQC.fnUpdateProgress(progressWindow, 80, 'Analyzing Forms');
      blr.W15yQC.fnAnalyzeFormControls(aFormsList, aFormControlsList, aDocumentsList);
      blr.W15yQC.fnDisplayFormResults(rd, aFormsList);
      blr.W15yQC.fnDisplayFormControlResults(rd, aFormControlsList);
    },

    fnInspectLinks: function (rd, aDocumentsList, progressWindow) {
      blr.W15yQC.fnReadUserPrefs();
      var aLinksList = blr.W15yQC.fnGetLinks(window.top.content.document);
      blr.W15yQC.fnAnalyzeLinks(aLinksList, aDocumentsList, progressWindow);
      blr.W15yQC.fnDisplayLinkResults(rd, aLinksList);
    },

    fnInspectImages: function (rd, aDocumentsList, progressWindow) {
      blr.W15yQC.fnReadUserPrefs();
      var aImagesList = blr.W15yQC.fnGetImages(window.top.content.document);
      blr.W15yQC.fnUpdateProgress(progressWindow, 87, 'Analyzing Images');
      blr.W15yQC.fnAnalyzeImages(aImagesList, aDocumentsList);
      blr.W15yQC.fnDisplayImagesResults(rd, aImagesList);
    },

    fnInspectLuminosityRatios: function (rd, aDocumentsList) {
      blr.W15yQC.fnReadUserPrefs();
      var aLumCheckList = blr.W15yQC.fnGetLuminosityCheckElements(window.top.content.document);
    },

    fnInspectAccessKeys: function (rd, aDocumentsList, progressWindow) {
      blr.W15yQC.fnReadUserPrefs();
      var aAccessKeysList = blr.W15yQC.fnGetAccessKeys(window.top.content.document);
      blr.W15yQC.fnUpdateProgress(progressWindow, 92, 'Analyzing Access Keys');
      blr.W15yQC.fnAnalyzeAccessKeys(aAccessKeysList, aDocumentsList);
      blr.W15yQC.fnDisplayAccessKeysResults(rd, aAccessKeysList);
    },

    fnInspectTables: function (rd, aDocumentsList, progressWindow) {
      blr.W15yQC.fnReadUserPrefs();
      var aTablesList = blr.W15yQC.fnGetTables(window.top.content.document);
      blr.W15yQC.fnUpdateProgress(progressWindow, 97, 'Analyzing Tables');
      blr.W15yQC.fnAnalyzeTables(aTablesList, aDocumentsList);
      blr.W15yQC.fnDisplayTableResults(rd, aTablesList);
    },

    /*
     *
     * ======== Main Inspect Method That Starts it All for the Report Generator (web page output) ========
     *
     */

    fnUpdateProgress: function(progressWindow, v, detailText) {
      if(progressWindow != null && progressWindow.document) {
        progressWindow.document.getElementById('percent').value=v;
        progressWindow.document.getElementById('detailText').value=detailText;
        progressWindow.focus();
      }
      blr.W15yQC.fnDoEvents();
    },
        
    fnInspect: function () {
      var reportDoc, aDocumentsList, dialogID, dialogPath, progressWindow;
      if(blr.W15yQC.sb == null) { blr.W15yQC.fnInitStringBundles(); }
      // Sanity checks against the code:
      blr.W15yQC.fnNonDOMIntegrityTests();
      blr.W15yQC.fnReadUserPrefs();
      if(Application.prefs.getValue("extensions.W15yQC.userAgreedToLicense",false)==false) {
        dialogID = 'licenseDialog';
        dialogPath = 'chrome://W15yQC/content/licenseDialog.xul';
        window.openDialog(dialogPath, dialogID, 'chrome,resizable=yes,centerscreen,modal',blr);
      }
      if(Application.prefs.getValue("extensions.W15yQC.userAgreedToLicense",false)==true) {
        progressWindow = window.openDialog('chrome://W15yQC/content/progressDialog.xul', 'w15yQCProgressDialog', 'dialog=yes,alwaysRaised=yes,chrome,resizable=no,centerscreen');
        blr.W15yQC.fnDoEvents();
        reportDoc = blr.W15yQC.fnInitDisplayWindow(window.top.content.document);
        blr.W15yQC.fnInspectWindowTitle(reportDoc);
        blr.W15yQC.fnUpdateProgress(progressWindow, 1, 'Getting Documents');
 
        aDocumentsList = blr.W15yQC.fnInspectDocuments(reportDoc);
        blr.W15yQC.fnUpdateProgress(progressWindow, 5, 'Getting Frame Titles');

        blr.W15yQC.fnInspectFrameTitles(reportDoc, aDocumentsList);
        blr.W15yQC.fnUpdateProgress(progressWindow, 10, 'Getting Headings');

        blr.W15yQC.fnInspectHeadings(reportDoc, aDocumentsList, progressWindow);
        blr.W15yQC.fnUpdateProgress(progressWindow, 15, 'Getting ARIA Landmarks');

        blr.W15yQC.fnInspectARIALandmarks(reportDoc, aDocumentsList);
        if(blr.W15yQC.userExpertLevel>0 && Application.prefs.getValue("extensions.W15yQC.enableARIAElementsInspector",true)) {
          blr.W15yQC.fnUpdateProgress(progressWindow, 18, 'Getting ARIA');
          blr.W15yQC.fnInspectARIAElements(reportDoc, aDocumentsList);
          }
        blr.W15yQC.fnUpdateProgress(progressWindow, 24, 'Getting Links');

        blr.W15yQC.fnInspectLinks(reportDoc, aDocumentsList, progressWindow);
        blr.W15yQC.fnUpdateProgress(progressWindow, 75, 'Getting Forms');

        blr.W15yQC.fnInspectForms(reportDoc, aDocumentsList, progressWindow);
        blr.W15yQC.fnUpdateProgress(progressWindow, 85, 'Geting Images');

        blr.W15yQC.fnInspectImages(reportDoc, aDocumentsList, progressWindow);
        blr.W15yQC.fnUpdateProgress(progressWindow, 90, 'Getting Access Keys');

        blr.W15yQC.fnInspectAccessKeys(reportDoc, aDocumentsList, progressWindow);
        blr.W15yQC.fnUpdateProgress(progressWindow, 95, 'Getting Tables');

        blr.W15yQC.fnInspectTables(reportDoc, aDocumentsList, progressWindow);
        blr.W15yQC.fnUpdateProgress(progressWindow, 100, 'Cleaning up...');
        blr.W15yQC.fnDisplayFooter(reportDoc);
        progressWindow.close();
        progressWindow = null;
        reportDoc.defaultView.focus();
        return reportDoc;
      }
      return null;
    },
    
    fnReadUserPrefs: function() {
      if(Application.prefs.getValue("extensions.W15yQC.testContrast.MinSpec",'')=='') {
        Application.prefs.setValue("extensions.W15yQC.testContrast.MinSpec", "WCAG2 AA");
      }
      blr.W15yQC.userExpertLevel = Application.prefs.getValue("extensions.W15yQC.userExpertLevel",0);
      blr.W15yQC.bIncludeHidden = Application.prefs.getValue("extensions.W15yQC.getElements.includeHiddenElements",false);
      blr.W15yQC.bAutoScrollToSelectedElementInInspectorDialogs = Application.prefs.getValue("extensions.W15yQC.inspectElements.autoScrollToSelectedElements",true);

      let focusInspectorOn=Application.prefs.getValue("extensions.W15yQC.focusHighlighterTurnedOn",false);
      if(focusInspectorOn) {
        blr.W15yQC.fnTurnOnFocusHighlighter();
      }
      
    },

    fnRemoveStyles: function () {
      var i, rd, nsIFilePicker, fp, rv, foStream, file, converter, outputWindow, reportDoc, srcDoc, metaElements;
      outputWindow = window.open('');
      reportDoc = outputWindow.document;
      srcDoc = window.top.content.document;
      metaElements = srcDoc.head.getElementsByTagName('meta');
      if(metaElements != null && metaElements.length>0) {
        for(i=0;i<metaElements.length;i++) {
          reportDoc.head.appendChild(reportDoc.importNode(metaElements[i], false));
        }
      }
      reportDoc.title = 'Removed Style View - '+srcDoc.title+' - W15yQC';
      blr.W15yQC.fnBuildRemoveStylesView(reportDoc, reportDoc.body, srcDoc);
      rd=reportDoc;
              if(rd != null) {
          nsIFilePicker = Components.interfaces.nsIFilePicker;
  
          fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
          fp.init(window, "Dialog Title", nsIFilePicker.modeSave);
          fp.appendFilters(nsIFilePicker.filterHTML | nsIFilePicker.filterAll);
          rv = fp.show();
          if (rv == nsIFilePicker.returnOK || rv == nsIFilePicker.returnReplace) {
            
            file = fp.file;
            // work with returned nsILocalFile...
            if(/\.html?$/.test(file.path)==false) {
              file.initWithPath(file.path+'.html');
            }
  
            foStream = Components.classes["@mozilla.org/network/file-output-stream;1"].  
                           createInstance(Components.interfaces.nsIFileOutputStream);  
              
            // use 0x02 | 0x10 to open file for appending.  
            foStream.init(file, 0x2A, 438, 0);
            converter = Components.classes["@mozilla.org/intl/converter-output-stream;1"].createInstance(Components.interfaces.nsIConverterOutputStream);  
            converter.init(foStream, "UTF-8", 0, 0);  
            converter.writeString('<html>'+rd.documentElement.innerHTML+'</html>');
            converter.close(); // this closes foStream            
          }
        }

    },
    
    fnBuildRemoveStylesView: function (rd, appendNode, doc, rootNode, oValues) {
      var node, c, frameDocument, div, p, thisFrameNumber, i;
      if(oValues == null) {
        oValues = {
          iNumberOfLinks: 0,
          iNumberOfFrames: 0,
          iNumberOfARIALandmarks: 0
        };
      }
      if (doc != null) {
        if (rootNode == null) { rootNode = doc.body; }
        if (appendNode == null) { appendNode = rd.body; }
        for (c = rootNode.firstChild; c != null; c = c.nextSibling) {
          if(c.nodeType == 1) { //alert(c.nodeType+' '+c.nodeName);
            if (c.nodeType == 1 && c.tagName && ((c.contentWindow && c.contentWindow.document !== null) ||
                              (c.contentDocument && c.contentDocument.body !== null))  && blr.W15yQC.fnNodeIsHidden(c) == false) { // Found a frame
              frameDocument = c.contentWindow ? c.contentWindow.document : c.contentDocument;
              div = rd.createElement('div');
              div.setAttribute('style','border:thin solid black');
              appendNode.appendChild(div);
              p=rd.createElement('p');
              p.setAttribute('style','background-color:#eee;margin:0px;padding:0px');
              oValues.iNumberOfFrames++;
              p.appendChild(rd.createTextNode('Frame('+oValues.iNumberOfFrames+'): '+(c.hasAttribute('title') ? 'Title: '+c.getAttribute('title') : 'Missing Title')));
              thisFrameNumber = oValues.iNumberOfFrames;
              div.appendChild(p);
              blr.W15yQC.fnBuildRemoveStylesView(rd, div, frameDocument, frameDocument.body, oValues);
              p=rd.createElement('p');
              p.setAttribute('style','background-color:#eee;margin:0px;padding:0px');
              p.appendChild(rd.createTextNode('Frame('+thisFrameNumber+') Ends'));
              div.appendChild(p);
            } else { // keep looking through current document
              if (c.hasAttribute && c.tagName && c.tagName.toLowerCase() !== 'style' && blr.W15yQC.fnNodeIsHidden(c) == false) {
                if(/^(b|big|center|em|font|i|link|small|strong|tt|u)$/i.test(c.tagName)) {
                  node = rd.createElement('span');
                } else {
                  node = rd.importNode(c, false);
                  if(/^(img|input)$/i.test(node.tagName) && node.hasAttribute('src')) {
                    node.setAttribute('src','dont-load-'+node.getAttribute('src'));
                  }
                }
                for(i=0;i<node.attributes.length;i++) {
                  if(/^(on[a-z]+|style|class|align|border)$/i.test(node.attributes[i].name)==true) {
                    node.removeAttribute(node.attributes[i].name);
                  } else if(/^javascript:/i.test(node.attributes[i].value)) {
                    node.setAttribute(node.attributes[i].name, 'javascript:return false;');
                  }
                }
                node.removeAttribute('style');
                appendNode.appendChild(node); //alert('appending:'+node.tagName+' to:'+appendNode.tagName);
                //alert('digging into:'+node.tagName);
                blr.W15yQC.fnBuildRemoveStylesView(rd, node, doc, c, oValues);
              }
            }
          } else {
            node = rd.importNode(c, true);
            if(node.removeAttribute) { node.removeAttribute('style'); }
            appendNode.appendChild(node); //alert('appending:'+c.nodeName+' to:'+appendNode.tagName);
            blr.W15yQC.fnBuildRemoveStylesView(rd, node, doc, c, oValues);
          }
        }
      }
      return appendNode.parent || appendNode;
    },

    //fnBuildSemanticView: function (rd, doc, rootNode, baseLevel, list, oValues) {
    //  /* What does JAWS Read at startup?
    //   *
    //   *  1. Number of Links, Frames, Landmarks
    //   *     - Crawl page, display semantics, then fill this back in.
    //   *  2. Page title
    //   *  3. Page Blocks Containers:
    //   *     - Landmarks
    //   *     - Frames
    //   *     - Paragraphs
    //   *     - Lists
    //   *  4. Closed Containers:
    //   *     - Headings
    //   *     -
    //   *
    //   */
    //  var level, c, i, frameDocument, sTagName, sRole, sARIALabel, sState;
      
      //if(oValues == null) {
      //  oValues = {
      //    iNumberOfLinks: 0,
      //    iNumberOfFrames: 0,
      //    iNumberOfARIALandmarks: 0
      //  };
      //}
      //if (baseLevel == null) { baseLevel = 0; }
      //if(list == null) { list = []; }
      //
      //if (doc != null) {
      //  if (rootNode == null) rootNode = doc.body;
      //  for (c = rootNode.firstChild; c != null; c = c.nextSibling) {
      //    if (c.nodeType !== 1) continue; // Only pay attention to element nodes
      //    if (c.tagName && ((c.contentWindow && c.contentWindow.document !== null) || (c.contentDocument && c.contentDocument.body !== null)) && blr.W15yQC.fnNodeIsHidden(c) == false) { // Found a frame
      //      oValues.iNumberOfFrames++;
      //      // determine level, and then get frame contents
      //      level = baseLevel+1;
      //      for(i=aARIALandmarksList.length-1; i>=0; i--) {
      //        if(blr.W15yQC.fnIsDescendant(aARIALandmarksList[i].node,c)==true) {
      //          level = aARIALandmarksList[i].level+1;
      //          break;
      //        }
      //      }
      //      frameDocument = c.contentWindow ? c.contentWindow.document : c.contentDocument;
      //      blr.W15yQC.fnBuildSemanticView(rd, frameDocument, frameDocument.body, level, list, oValues);
      //    } else { // keep looking through current document
      //      if (c != null && c.hasAttribute && c.tagName && blr.W15yQC.fnNodeIsHidden(c) == false) {
      //        // Do we need to close some blocks?
      //        while(list.length>0 && blr.W15yQC.fnIsDescendant(list[list.length-1],c)==false) {
      //          // close last list item
      //          list.pop();
      //        }
      //        sTagName = c.tagName.toLowerCase();
      //        sRole = c.getAttribute('role');
      //        switch (sRole) {
      //          case 'application':
      //          case 'banner':
      //          case 'complementary':
      //          case 'contentinfo':
      //          case 'form':
      //          case 'main':
      //          case 'navigation':
      //          case 'search':
      //            // Landmark Role
      //            //var xPath = blr.W15yQC.fnGetElementXPath(c);
      //            //var nodeDescription = blr.W15yQC.fnDescribeElement(c, 400);
      //            sARIALabel = null;
      //            level = baseLevel+1;
      //            for(i=aARIALandmarksList.length-1; i>=0; i--) {
      //              if(blr.W15yQC.fnIsDescendant(aARIALandmarksList[i].node,c)==true) {
      //                level = aARIALandmarksList[i].level+1;
      //                break;
      //              }
      //            }
      //            if (c.hasAttribute('aria-label') == true) {
      //              sARIALabel = c.getAttribute('aria-label');
      //            } else if (c.hasAttribute('aria-labelledby') == true) {
      //              sARIALabel = blr.W15yQC.fnGetTextFromIdList(c.getAttribute('aria-labelledby'), doc);
      //            }
      //            sState = blr.W15yQC.fnGetNodeState(c);
      //            aARIALandmarksList.push(new blr.W15yQC.ariaLandmarkElement(c, xPath, nodeDescription, doc, aARIALandmarksList.length, level, sRole, sARIALabel, sState));
      //            break;
      //        }
      //        blr.W15yQC.fnBuildSemanticView(rd, doc, c, level, list, oValues);
      //      }
      //    }
      //  }
      //}
      //// Do we need to close some blocks?
      //while(list.length>0 && blr.W15yQC.fnIsDescendant(list[list.length-1],c)==false) {
      //  // close last list item
      //  list.pop();
      //}

    //},

    fnNonDOMIntegrityTests: function () {
      if (blr.W15yQC.fnMaxDecimalPlaces(10.234324, 2).toString() != "10.23") {
        blr.W15yQC.fnLog("fnMaxDecimalPlaces test 1 failed.");
      }
      if (blr.W15yQC.fnCleanSpaces(" this  is  a  test ") != "this is a test") {
        blr.W15yQC.fnLog("fnMaxDecimalPlaces test 1 failed.");
      }
      if (blr.W15yQC.fnTrim(" this  is  a  test ") != "this  is  a  test") {
        blr.W15yQC.fnLog("fnMaxDecimalPlaces test 1 failed.");
      }
      if (blr.W15yQC.fnJoin(" just a test ", " part two ", ",") != "just a test, part two") {
        blr.W15yQC.fnLog("fnMaxDecimalPlaces test 1 failed.");
      }
      if (blr.W15yQC.fnMaxDecimalPlaces(10.234324, 2).toString() != "10.23") {
        blr.W15yQC.fnLog("fnMaxDecimalPlaces test 1 failed.");
      }
      if (blr.W15yQC.fnMaxDecimalPlaces(10.234324, 2).toString() != "10.23") {
        blr.W15yQC.fnLog("fnMaxDecimalPlaces test 1 failed.");
      }
    }
  };

  // ----------------
  //     Objects
  // ----------------
  /*
   * Possible problem here: instance properties should be defined solely in the constructor,
   * From: Zakas, Nicholas C. (2011-01-20). Professional JavaScript for Web Developers (Wrox Programmer to Programmer) (p. 166). Wrox. Kindle Edition.
   */
  /*
   * combination inheritance is the most frequently used inheritance pattern in JavaScript.
   * Zakas, Nicholas C. (2011-01-20). Professional JavaScript for Web Developers (Wrox Programmer to Programmer) (p. 177). Wrox. Kindle Edition.
   */

  blr.W15yQC.note = function (msgKey, aParameters) {
    this.msgKey = msgKey;
    this.aParameters = aParameters;
  };

  blr.W15yQC.note.prototype = {
    msgKey: null,
    aParameters: null
  };

  blr.W15yQC.resolvedNote = function (msgKey, severityLevel, expertLevel, msgText, msgExplanation, sURL) {
    this.msgKey = msgKey;
    this.severityLevel = severityLevel;
    this.expertLevel = expertLevel;
    this.msgText = msgText;
    this.msgExplanation = msgExplanation;
    this.sURL = sURL;
  };

  blr.W15yQC.resolvedNote.prototype = {
    msgKey: null,
    severityLevel: null,
    expertLevel: null,
    msgText: null,
    msgExplanation: null,
    sURL: null
  };

  blr.W15yQC.documentDescription = function (doc, URL, orderNumber, title, language, dir, compatMode, docType) {
    this.doc = doc;
    this.URL = URL;
    this.orderNumber = orderNumber;
    this.title = title;
    this.language = language;
    this.dir = dir;
    this.compatMode = compatMode;
    this.docType = docType;
    this.idHashTable = new blr.W15yQC.HashTable();
    this.IDsValid = true;
    this.IDsUnique = true;
    this.nonUniqueIDs = [];
    this.invalidIDs = [];
    this.nonUniqueIDsCount=0;
    this.invalidIDsCount=0;
  };

  blr.W15yQC.documentDescription.prototype = {
    doc: null,
    URL: null,
    orderNumber: null,
    language: null,
    dir: null,
    compatMode: null,
    docType: null,
    idHashTable: null,
    IDsUnique: false,
    IDsValid: true,
    nonUniqueIDs: [],
    invalidIDs: [],
    nonUniqueIDsCount: 0,
    invalidIDsCount: 0,
    notes: null,
    failed: false,
    warning: false,
    title: null,
    soundex: null
  };


  blr.W15yQC.frameElement = function (node, xpath, nodeDescription, doc, orderNumber, role, id, name, title, src) {
    this.node = node;
    this.xpath = xpath;
    this.nodeDescription = nodeDescription;
    this.doc = doc;
    this.orderNumber = orderNumber;
    this.role = role;
    this.id = id;
    this.name = name;
    this.title = title;
    this.src = src;
  };

  blr.W15yQC.frameElement.prototype = {
    node: null,
    xpath: null,
    nodeDescription: null,
    doc: null,
    orderNumber: null,
    ownerDocumentNumber: null,
    containsDocumentNumber: null,
    role: null,
    notes: null,
    failed: false,
    warning: false,
    id: null,
    name: null,
    title: null,
    soundex: null,
    src: null,
    stateDescription: null
  };

  blr.W15yQC.headingElement = function (node, xpath, nodeDescription, doc, orderNumber, role, level, text) {
    this.node = node;
    this.xpath = xpath;
    this.nodeDescription = nodeDescription;
    this.doc = doc;
    this.orderNumber = orderNumber;
    this.role = role;
    this.level = level;
    this.text = text;
  };

  blr.W15yQC.headingElement.prototype = {
    node: null,
    xpath: null,
    nodeDescription: null,
    doc: null,
    orderNumber: null,
    ownerDocumentNumber: null,
    role: null,
    notes: null,
    failed: false,
    warning: false,
    state: null,
    text: null,
    level: null,
    soundex: null,
    stateDescription: null
  };

  blr.W15yQC.ariaElement = function (node, xpath, nodeDescription, doc, orderNumber, level, role, label, stateDescription) {
    this.node = node;
    this.xpath = xpath;
    this.nodeDescription = nodeDescription;
    this.doc = doc;
    this.orderNumber = orderNumber;
    this.level = level;
    this.role = role;
    this.label = label;
    this.stateDescription = stateDescription;
  };

  blr.W15yQC.ariaElement.prototype = {
    node: null,
    xpath: null,
    nodeDescription: null,
    doc: null,
    orderNumber: null,
    level: null,
    ownerDocumentNumber: null,
    role: null,
    notes: null,
    failed: false,
    warning: false,
    label: null,
    soundex: null,
    stateDescription: null
  };

  blr.W15yQC.ariaLandmarkElement = function (node, xpath, nodeDescription, doc, orderNumber, level, role, label, stateDescription) {
    this.node = node;
    this.xpath = xpath;
    this.nodeDescription = nodeDescription;
    this.doc = doc;
    this.orderNumber = orderNumber;
    this.level = level;
    this.role = role;
    this.label = label;
    this.stateDescription = stateDescription;
  };

  blr.W15yQC.ariaLandmarkElement.prototype = {
    node: null,
    xpath: null,
    nodeDescription: null,
    doc: null,
    orderNumber: null,
    ownerDocumentNumber: null,
    level:null,
    role: null,
    notes: null,
    failed: false,
    warning: false,
    label: null,
    soundex: null,
    stateDescription: null
  };

  blr.W15yQC.formElement = function (node, xpath, nodeDescription, doc, ownerDocumentNumber, orderNumber, name, role, action, method) {
    this.node = node;
    this.xpath = xpath;
    this.nodeDescription = nodeDescription;
    this.doc = doc;
    this.ownerDocumentNumber = ownerDocumentNumber;
    this.orderNumber = orderNumber;
    this.name = name;
    this.role = role;
    this.action = action;
    this.method = method;
  };

  blr.W15yQC.formElement.prototype = {
    node: null,
    xpath: null,
    nodeDescription: null,
    doc: null,
    orderNumber: null,
    ownerDocumentNumber: null,
    name: null,
    role: null,
    action: null,
    method: null,
    notes: null,
    failed: false,
    warning: false,
    stateDescription: null
  };

  blr.W15yQC.formControlElement = function (node, xpath, nodeDescription, parentFormNode, parentFormDescription, doc, orderNumber, role, name, title, legendText, labelText, ARIALabelText, ARIADescriptionText, effectiveLabelText, stateDescription, value) {
    this.node = node;
    this.xpath = xpath;
    this.nodeDescription = nodeDescription;
    this.parentFormNode = parentFormNode;
    this.parentFormDescription = parentFormDescription;
    this.doc = doc;
    this.orderNumber = orderNumber;
    this.role = role;
    this.name = name;
    this.value = value;
    this.title = title;
    this.legendText = legendText;
    this.labelTagText = labelText;
    this.ARIALabelText = ARIALabelText;
    this.ARIADescriptionText = ARIADescriptionText;
    this.effectiveLabelText = effectiveLabelText;
    this.stateDescription = stateDescription;
  };

  blr.W15yQC.formControlElement.prototype = {
    node: null,
    xpath: null,
    nodeDescription: null,
    parentFormNode: null,
    parentFormDescription: null,
    parentFormNumber: null,
    doc: null,
    orderNumber: null,
    ownerDocumentNumber: null,
    role: null,
    name: null,
    value: null,
    title: null,
    notes: null,
    failed: false,
    warning: false,
    legendText: null,
    labelTagText: null,
    ARIALabelText: null,
    ARIADescriptionText: null,
    effectiveLabelText: null,
    soundex: null,
    stateDescription: null
  };

  blr.W15yQC.linkElement = function (node, xpath, nodeDescription, doc, orderNumber, role, stateDescription, text, title, target, href) {
    this.node = node;
    this.xpath = xpath;
    this.nodeDescription = nodeDescription;
    this.doc = doc;
    this.orderNumber = orderNumber;
    this.role = role;
    this.stateDescription = stateDescription;
    this.text = text;
    this.title = title;
    this.target = target;
    this.href = href;
  };

  blr.W15yQC.linkElement.prototype = {
    node: null,
    xpath: null,
    nodeDescription: null,
    doc: null,
    orderNumber: null,
    ownerDocumentNumber: null,
    role: null,
    notes: null,
    failed: false,
    warning: false,
    text: null,
    state: null,
    soundex: null,
    title: null,
    target: null,
    href: null,
    stateDescription: null
  };

  blr.W15yQC.image = function (node, xpath, nodeDescription, doc, orderNumber, role, src, width, height, effectiveLabel, alt, title, ariaLabel) {
    this.node = node;
    this.xpath = xpath;
    this.nodeDescription = nodeDescription;
    this.doc = doc;
    this.orderNumber = orderNumber;
    this.role = role;
    this.width = width;
    this.height = height;
    this.src = src;
    this.effectiveLabel = effectiveLabel;
    this.alt = alt;
    this.title = title;
    this.ariaLabel = ariaLabel;
  };

  blr.W15yQC.image.prototype = {
    node: null,
    xpath: null,
    nodeDescription: null,
    doc: null,
    orderNumber: null,
    ownerDocumentNumber: null,
    role: null,
    src: null,
    width: null,
    height: null,
    alt: null,
    effectiveLabel: null,
    ariaLabel: null,
    longdescURL: null,
    longdescText: null,
    notes: null,
    failed: false,
    warning: false,
    text: null,
    soundex: null,
    title: null
  };

  blr.W15yQC.contrastElement = function (node, xpath, nodeDescription, doc, orderNumber, sText, sTextSize, textWeight, fgColor, bgColor, bHasBGImage, fgLuminosity, bgLuminosity, lRatio) {
    this.node = node;
    this.xpath = xpath;
    this.nodeDescription = nodeDescription;
    this.doc = doc;
    this.orderNumber = orderNumber;
    this.text = sText;
    this.textSize = sTextSize;
    this.textWeight = textWeight;
    this.fgColor = fgColor;
    this.bgColor = bgColor;
    this.hasBackgroundImage = bHasBGImage;
    this.fgLuminosity = fgLuminosity;
    this.bgLuminosity = bgLuminosity;
    this.luminosityRatio = lRatio;
  };

  blr.W15yQC.contrastElement.prototype = {
    node: null,
    xpath: null,
    nodeDescription: null,
    doc: null,
    orderNumber: null,
    text: null,
    textSize: null,
    textWeight: null,
    ownerDocumentNumber: null,
    fgColor: null,
    bgColor: null,
    hasBackgroundImage: false,
    fgLuminosity: null,
    bgLuminosity: null,
    luminosityRatio: null,
    failed: false,
    warning: false
  };

  blr.W15yQC.accessKey = function (node, xpath, nodeDescription, doc, orderNumber, role, accessKey, effectiveLabel) {
    this.node = node;
    this.xpath = xpath;
    this.nodeDescription = nodeDescription;
    this.doc = doc;
    this.orderNumber = orderNumber;
    this.role = role;
    this.accessKey = accessKey;
    this.effectiveLabel = effectiveLabel;
  };

  blr.W15yQC.accessKey.prototype = {
    node: null,
    xpath: null,
    nodeDescription: null,
    doc: null,
    orderNumber: null,
    ownerDocumentNumber: null,
    role: null,
    accessKey: null,
    effectiveLabel: null,
    notes: null,
    failed: false,
    warning: false,
    stateDescription: null
  };

  blr.W15yQC.badId = function (node, xpath, nodeDescription, doc, orderNumber, ownerDocumentNumber, sID) {
    this.node = node;
    this.xpath = xpath;
    this.nodeDescription = nodeDescription;
    this.doc = doc;
    this.orderNumber = orderNumber;
    this.ownerDocumentNumber = ownerDocumentNumber;
    this.id = sID;
  };

  blr.W15yQC.badId.prototype = {
    node: null,
    xpath: null,
    nodeDescription: null,
    doc: null,
    orderNumber: null,
    ownerDocumentNumber: null,
    id: null,
    notes: null,
    failed: false,
    warning: false
  };

  blr.W15yQC.table = function (node, xpath, nodeDescription, doc, orderNumber, role, nestingLevel, title, summary) {
    this.node = node;
    this.xpath = xpath;
    this.nodeDescription = nodeDescription;
    this.doc = doc;
    this.orderNumber = orderNumber;
    this.role = role;
    this.nestingLevel = nestingLevel;
    this.title = title;
    this.summary = summary;
  };

  blr.W15yQC.table.prototype = {
    node: null,
    xpath: null,
    nodeDescription: null,
    doc: null,
    orderNumber: null,
    ownerDocumentNumber: null,
    title: null,
    role: null,
    summary: null,
    caption: null,
    maxCols: null,
    maxRows: null,
    isComplex: false,
    isDataTable: false,
    bHasTHCells: false,
    bHasHeadersAttr: false,
    bHasAxisAttr: false,
    bHasAbbrAttr: false,
    bHasScopeAttr: false,
    bHasCaption: false,
    bHasSummary: false,
    whyDataTable: null,
    nestingLevel: null,
    parentTable: null,
    notes: null,
    failed: false,
    warning: false,
    soundex: null
  };


  blr.W15yQC.HashTable = function (obj)
{ // http://www.mojavelinux.com/articles/javascript_hashes.html
    var p;
    this.length = 0;
    this.items = {};
    for (p in obj) {
        if (obj.hasOwnProperty(p)) {
            this.items[p] = obj[p];
            this.length++;
        }
    }

    this.setItem = function(key, value)
    {
        var previous;
        if (this.hasItem(key)) {
            previous = this.items[key];
        }
        else {
            this.length++;
        }
        this.items[key] = value;
        return previous;
    }

    this.getItem = function(key) {
      return this.hasItem(key) ? this.items[key] : undefined;
    }

    this.hasItem = function(key)
    {
      return this.items.hasOwnProperty(key);
    }

    this.removeItem = function(key)
    {
      var previous;
      if (this.hasItem(key)) {
        previous = this.items[key];
        this.length--;
        delete this.items[key];
        return previous;
      }
      else {
        return undefined;
      }
    }

    this.keys = function()
    {
      var keys = [], k;
      for (k in this.items) {
          if (this.hasItem(k)) {
              keys.push(k);
          }
      }
      return keys;
    }

    this.values = function()
    {
      var values = [], k;
      for (k in this.items) {
        if (this.hasItem(k)) {
          values.push(this.items[k]);
        }
      }
      return values;
    }

    this.each = function(fn) {
      for (k in this.items) {
        if (this.hasItem(k)) {
          fn(k, this.items[k]);
        }
      }
    }

    this.clear = function()
    {
      this.items = {}
      this.length = 0;
    }
  }
}

blr.W15yQC.fnReadUserPrefs();