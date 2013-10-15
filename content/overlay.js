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
"use strict";

/*global blr: false, Components: false, Application: false */


if (!blr) { var blr = {}; }

/*
 * Object:  W15yQC
 */
if (!blr.W15yQC) {
  blr.W15yQC = {
    releaseVersion: '1.0 - Beta 36',
    releaseDate: 'October 15, 2013',
    // Following are variables for setting various options:
    bHonorARIAHiddenAttribute: true,
    bHonorCSSDisplayNoneAndVisibilityHidden: true,
    w15yqcPrevElWithFocus: null,
    w15yqcOriginalItemStyle: null,
    w15yqcOriginalItemPosition: null,
    w15yqcOriginalItemZIndex: null,
    bQuick: false,
    userExpertLevel: null,
    userLocale: null,
    bEnglishLocale: true,
    highlightTimeoutID: null,
    sb: null,
    pageLoadHandlerForFocusHighlighter: null,
    skipStatusUpdateCounter: 1,
    // User prefs
    bIncludeHidden: false,
    bFirstHeadingMustBeLevel1: true,
    bOnlyOneLevel1Heading: false,
    bHonorARIA: true,
    bAutoScrollToSelectedElementInInspectorDialogs: true,
    domainEq1: [],
    domainEq2: [],
    storedColors: [],

    dominantAriaRoles: /\b(button|heading|checkbox|combobox|menuitem|menuitemcheckbox|menuitemradio|option|progressbar|radio|scrollbar|slider|spinbutton|tab|textbox|treeitem|listbox|tree|treegrid|img)\b/i,

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
        while (thread.hasPendingEvents()) { thread.processNextEvent(false); }
      } catch(ex) { alert('fnDoEvents failed:'+ex.toString());
      }

      try {
        thread = Components.classes['@mozilla.org/thread-manager;1'].getService(Components.interfaces.nsIThreadManager).currentThread;
        while (thread.hasPendingEvents()) { thread.processNextEvent(false); }
      } catch(ex) { alert('fnDoEvents failed:'+ex.toString());
      }
    },

    fnIsValidLocale: function(sLocale) {
      return (/^([xi]-[a-z0-9]+|[a-z]{2,3}(-[a-z0-9]+)?)$/i.test(sLocale)); // QA iframeTests01.html
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

    objectToString: function (o, bDig) {
      var p, out = '';
      if (o != null) {
        for (p in o) {
          if (o[p].toString() == '[object Object]' && bDig != false) {
            out += 'STARTOBJ' + p + ': [' + blr.W15yQC.LinksDialog.objectToString(o[p], false) + ']\n';
          } else {
            out += p + ': ' + o[p] + '\n';
          }
        }
      }
      return out;
    },

    fnLog: function (sMsg) {
      try {
        var consoleServ = Components.classes['@mozilla.org/consoleservice;1'].getService(Components.interfaces.nsIConsoleService);
        if(/lt/.test(sMsg)) {consoleServ.logStringMessage(sMsg); }
      } catch (ex) {}
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
        } else if(iLimitCounter>1) {
          for (i = 0; i < cols.length; i++) {
            if (cols[i].width > 1 && cols[i].width < 150) {
              newWidth = cols[i].width + 1; // Final bump to make sure columns don't clip on scrolling treeview
              ch = treebox.ownerDocument.getElementById(cols[i].id);
              if (ch) {
                ch.setAttribute('width', newWidth);
              }
            }
          }
        }
      }
    },

    fnMaxDecimalPlaces: function (sNumber, iPlaces) {
      if (/\d*\.\d+/.test(sNumber) && sNumber.toString().length - sNumber.toString().indexOf('.') - 1 > iPlaces) {
        return parseFloat(sNumber).toFixed(iPlaces);
      }
      return sNumber;
    },

    fnFormatArrayAsList: function(a,def) {
      var s;
      if(a!=null && a.length && a.length>0) {
        s=a.toString().replace(/(\w),(\w)/g,'$1, $2');
      } else if (def!=null) {
          s=def;
      } else {
        s='none';
      }
      return s;
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
      return str;
    },

    fnJoin: function (s1, s2, sSeparator) {
      if (s1 == null) { return s2; }
      if (s2 == null) { return s1; }
      if (sSeparator == null) { sSeparator = ' '; }
      s1 = blr.W15yQC.fnCleanSpaces(s1, true);
      s2 = blr.W15yQC.fnCleanSpaces(s2, true);
      if (s1 == '') { return s2; }
      if (s2 == '') { return s1; }
      return s1 + sSeparator + s2;
    },

    fnJoinNoClean: function (s1, s2, sSeparator) {
      if (s1 == null) { return s2; }
      if (s2 == null) { return s1; }
      if (sSeparator == null) { sSeparator = ' '; }
      if (s1 == '') { return s2; }
      if (s2 == '') { return s1; }
      return s1 + sSeparator + s2;
    },

    fnJoinIfNew: function (s1, s2, sSeparator) {
      if (s1 == null) { return s2; }
      if (s2 == null) { return s1; }
      s1 = blr.W15yQC.fnCleanSpaces(s1, true);
      s2 = blr.W15yQC.fnCleanSpaces(s2, true);
      if (s1 == '') { return s2; }
      if (s2 == '') { return s1; }
      if (s1.indexOf(s2) < 0 && s2.indexOf(s1) < 0) { // Join if s2 is not in s1 and vice versa
        if (sSeparator == null) { sSeparator = ' '; }
        return s1 + sSeparator + s2;
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

    fnFormatList: function (s) {
      if(s!=null ) {s = s.replace(/,/g, ', ');}
      return s;
    },

    // Severity Levels: 0=notice, 1=warning, 2=failure
    // Expert Levels: 0=Basic, 1=Advanced, 2=Expert
    noteDetails: { // [Quick, Severity, Expert level, hasExplanation, URL]
      missingSBProperty: [false,2,0,false,null],
      docTitleMissing: [true,2,0,false,null],
      docTitleEmpty: [true,2,0,false,null],
      docLangNotGiven: [true,2,0,true,null],
      docLangNotSpecified: [true,2,0,true,null],
      docInvalidLang: [true,2,0,false,null],
      docLangAttrInvalidUseUnderscore: [true,2,0,false,null],
      docLangConflictFound: [false,2,0,false,null],
      docInvalidLangList: [false,1,0,false,null],
      docValidLangList: [false,0,0,false,null],
      docTitleNotUnique: [false,1,0,false,null],
      docCSSSuppressingOutline: [false,1,0,true,null],
      docUsesFullJustifiedText: [false,2,0,true,null],
      docNonUniqueIDs: [false,1,1,false,null],
      docInvalidIDs: [false,1,1,false,null],

      idIsNotUnique: [false,2,1,false,null],
      idIsNotValid: [false,1,1,false,null],

      frameContentScriptGenerated: [false,0,0,false,null],
      frameTitleMissing: [true,2,0,false,null],
      frameTitleOnlyASCII: [true,2,0,false,null],
      frameTitleNotMeaningful: [true,1,0,false,null],
      frameTitleNotUnique: [true,2,0,false,null],
      frameTitleSoundsSame: [true,1,0,false,null],
      frameTitleEmpty: [true,2,0,false,null],
      frameIDNotValid: [false,1,1,false,null],
      frameIDNotUnique: [false,2,1,false,null],

      ldmkAndLabelNotUnique: [true,2,0,false,null],
      ldmkNotUnique: [true,2,0,false,null],
      ldmkAndLabelNotSoundUnique: [true,2,0,false,null],
      ldmkNotSoundUnique: [true,2,0,false,null],
      ldmkIDNotValid: [false,1,0,false,null],
      ldmkIDNotUnique: [false,2,0,false,null],
      ldmkMainLandmarkMissing: [true,2,0,true,null],
      ldmkMultipleMainLandmarks: [true,2,0,true,null],
      ldmkMultipleBannerLandmarks: [false,1,0,true,null],
      ldmkMultipleContentInfoLandmarks: [false,1,0,true,null],

      ariaLmkAndLabelNotUnique: [true,2,0,false,null],
      ariaLmkNotUnique: [true,2,0,false,null],
      ariaHeadingMissingAriaLevel: [false,1,0,true,null],
      ariaHasBothLabelAndLabelledBy: [false,2,0,true,null],
      ariaMultipleRoleValues: [false,1,0,false,null],
      ariaIgnoringRoleValue: [false,1,0,false,null],
      ariaAttributeWithUnexpectedTag: [false,1,0,false,null],
      ariaAttributeWithUnexpectedRole: [false,1,0,false,null],
      ariaAttributeMustBeValidID: [false,1,0,false,null],
      ariaAttributeMustBeValidIDList: [false,1,0,false,null],
      ariaAttributeMustBeTF: [false,1,0,false,null],
      ariaAttributeWithInvalidValue: [false,1,0,false,null],
      ariaAttributeValueInvalid: [false,1,0,false,null],
      ariaAttributeValueDoesntMakeSenseWith: [false,1,0,false,null],
      ariaTargetElementIsNotADescendant: [false,1,0,false,null],
      ariaInvalidAttrWUndefValue: [false,1,1,true,null],
      ariaAttributeMustBeValidNumber: [false,2,0,false,null],
      ariaAttrMustBePosIntOneOrGreater: [false,2,0,false,null],
      ariaMaxNotGreaterThanAriaMin: [false,2,0,false,null],
      ariaMaxNotGreaterThanEqualAriaNow: [false,2,0,false,null],
      ariaMinNotLessThanEqualAriaNow: [false,2,0,false,null],
      ariaMaxWOAriaMin: [false,2,0,false,null],
      ariaMinWOAriaMax: [false,2,0,false,null],
      ariaPosInSetWOAriaSetSize: [false,2,0,false,null],
      ariaEmptyValueTextWValueNowWarning: [false,1,1,true,null],
      ariaInvalidAriaLabeledBy: [false,2,0,false,null],
      ariaIDNotValid: [false,1,0,false,null],
      ariaIDNotUnique: [false,2,0,false,null],
      ariaUnrecognizedARIAAttribute: [false,2,0,false,null],

      ariaAbstractRole: [false,2,1,false,null],
      ariaUnknownRole: [false,2,1,false,null],
      ariaAttributesEveryIDDoesntExist: [false,2,0,false,null],
      ariaAttributesIDsDontExist: [false,1,1,false,null],
      ariaMissingProperties: [false,2,1,false,null],
      ariaMissingContainer: [false,2,1,false,null],

      imgLongdescImageFileName: [true,2,0,false,null],
      imgLongdescShouldBeURL: [true,2,0,false,null],
      imgMissingAltAttribute: [true,2,0,false,null],
      imgNoAltText: [true,1,0,false,null],
      imgWithLongdescShouldHaveAltText: [true,2,0,false,null],
      imgHasAltTextAndPresRole: [false,2,0,false,null],
      imgSpacerWithAltTxt: [true,1,0,false,null],
      imgSpacerShouldHaveEmptyAltTxt: [true,1,0,false,null],
      imgAltTxtIsFileName: [true,1,0,false,null],
      imgAltTxtIsURL: [true,1,0,false,null],
      imgAltTxtIsJunk: [true,1,0,false,null],
      imgAltTxtIsDefault: [true,1,0,false,null],
      imgAltTxtIsDecorative: [true,1,0,false,null],
      imgAltTxtIncludesImageTxt: [true,1,0,false,null],
      imgAltLengthTooLong: [true,1,0,true,null],
      imgIDNotValid: [false,1,0,false,null],
      imgIDNotUnique: [false,2,0,false,null],
      imgAltTxtOnlyASCII: [true,2,0,false,null],

      akConflict: [false,1,0,false,null],
      akNoLabel: [true,2,0,false,null],
      akLabelOnlyASCII: [false,2,0,false,null],
      akLabelNotMeaningful: [true,1,0,false,null],
      akValueNotUnique: [true,2,0,false,null],
      akLabelNotUnique: [true,2,0,false,null],
      akLabelEmpty: [true,2,0,false,null],
      akIDNotValid: [false,1,0,false,null],
      akIDNotUnique: [false,2,0,false,null],

      hSkippedLevel: [true,2,1,false,null],
      hShouldNotBeMultipleLevel1Headings: [true,2,1,false,null],
      hTxtMissing: [true,2,1,false,null],
      hTxtOnlyASCII: [true,2,1,false,null],
      hTxtNotMeaninfgul: [true,1,1,false,null],
      hTxtEmpty: [true,2,1,false,null],
      hHeadingNotUniqueInSection: [true,2,1,false,null],
      hHeadingRoleOverriddenByInheritedRole: [true,1,1,false,null],
      hHeadingRoleOverriddenByRoleAttr: [true,1,1,false,null],
      hIDNotValid: [false,1,1,false,null],
      hIDNotUnique: [false,2,1,false,null],

      frmNameNotUnique: [false,1,1,false,null],
      frmFormIsNested: [false,2,1,false,null],
      frmFormContainsForms: [false,2,1,false,null],
      frmIDNotValid: [false,1,1,false,null],
      frmIDNotUnique: [false,2,1,false,null],

      frmCtrlNotLabeled: [true,2,0,false,null],
      frmCtrlLabelOnlyASCII: [true,2,0,false,null],
      frmCtrlLabelNotMeaningful: [true,1,0,false,null],
      frmCtrlLabelNextPrev: [true,1,0,false,null],
      fmrCtrlLabelNotUnique: [true,2,0,false,null],
      frmCtrlLabelDoesntSoundUnique: [true,2,0,false,null],
      frmCtrlLabelEmpty: [true,2,0,false,null],
      frmCtrlInputTypeImageWOAltText: [true,2,0,false,null],
      frmCtrlInputTypeImageWOAltAttr: [true,2,0,false,null],
      frmCtrlRedundantOCandOK: [false,2,0,false,null],
      frmCtrlHasBothOCandOK: [false,1,0,false,null],
      frmCtrlForValInvalid: [false,1,0,false,null],
      frmCtrlNoFrmCtrlForForValue: [false,2,0,false,null],
      frmCtrlNoElForForValue: [false,2,0,false,null],
      frmCtrlForValIDNotUnique: [false,2,0,false,null],
      frmCtrlForForValueIsHidden: [false,1,1,false,null],
      frmCtrlForValueEmpty: [false,2,0,false,null],
      frmCtrlImplicitLabel: [false,1,0,false,null],
      frmCtrlEmptyLabel: [false,1,0,false,null],
      frmCtrlLegendWOFieldset: [false,2,0,false,null],
      frmCtrlFieldsetWOLegend: [false,2,0,false,null],
      frmCtrlRadioButtonWOLegendText: [false,1,0,false,null],
      frmCtrlIDNotValid: [false,1,0,false,null],
      frmCtrlIDNotUnique: [false,2,0,false,null],

      lnkTxtMissing: [true,2,0,false,null],
      lnkTxtOnlyASCII: [true,2,0,false,null],
      lnkTxtNotMeaningful: [true,2,0,false,null],
      lnkTxtNextPrev: [true,2,0,false,null],
      lnkTxtBeginWithLink: [true,1,0,false,null],
      lnkInvalid: [false,1,0,false,null],
      lnkLinkMissingHrefValue: [false,1,0,false,null],
      lnkTooSmallToHit: [false,2,0,false,null],
      lnkTxtNotUnique: [true,2,0,false,null],
      lnkTxtDoesntSoundUnique: [true,1,0,false,null],
      lnkTxtDiffSameHrefOnclick: [true,1,0,false,null],
      lnkTxtDiffSameHref: [true,1,0,false,null],
      lnkTxtEmpty: [true,2,0,false,null],
      lnkTitleTxtDiffThanLinkTxt: [false, 1, 0, true, null],
      lnkTextComesOnlyFromTitle: [true, 2, 0, true, null],
      lnkTextComesOnlyFromAlt: [true, 2, 0, true, null],
      lnkIsNamedAnchor: [true,0,0,false,null],
      lnkTargetsLink: [true,0,0,false,null],
      lnkTargets: [true,0,0,false,null],
      lnkTargetDoesNotExist: [true,2,0,false,null],
      lnkTargetDoesNotAppearValid: [true,1,0,false,null],
      lnkHasBothOCandOK: [false,2,0,false,null],
      lnkHasInvalidAltAttribute: [false,1,0,false,null],
      lnkTargetIDisNotUnique: [false,2,0,false,null],
      lnkTargetIDNotValid: [false,1,0,false,null],
      lnkServerSideImageMap: [false,2,0,false,null],
      lnkIDNotValid: [false,1,0,false,null],
      lnkIDNotUnique: [false,2,0,false,null],

      tblMultipleCaptions: [false,2,0,false,null],
      tblNestedTR: [false,1,1,false,null],
      tblEmptyTR: [false,1,1,false,null],
      tblOutsideRow: [false,1,1,false,null],
      tblColspanRowspanColision: [false,1,1,false,null],
      tblRowspanRowspanColision: [false,1,1,false,null],
      tblRowWOCols: [false,1,1,false,null],
      tblEmptyTable: [false,1,1,false,null],
      tblRowpanExceedsTableRows: [false,1,1,false,null],
      tblIsDataTable: [true,0,0,false,null],
      tblCheckCaptionSummary: [true,1,0,false,null],
      tblCaptionSameAsSummary: [false,1,0,false,null],
      tblSummaryLooksLikeLayout: [true,2,0,false,null],
      tblSummaryLooksLikeADefault: [true,2,0,false,null],
      tblSummaryNotMeaningful: [true,2,0,false,null],
      tblCaptionLooksLikeLayout: [true,2,0,false,null],
      tblCaptionLooksLikeADefault: [true,2,0,false,null],
      tblCaptionNotMeaningful: [true,2,0,false,null],
      tblDTMissingTHs: [false,2,0,false,null],
      tblDTisComplex: [true,1,0,false,null],
      tblDTwTDwoHeadersAttrib: [false,2,0,false,null],
      tblNotEveryCellWithContentInDTHasHeaders: [true,2,0,false,null],
      tblIsLayoutTable: [true,0,0,false,null],
      tblUnequalColCount: [true,1,0,false,null],
      tblLayoutTblIsComplex: [true,1,0,false,null],
      tblLayoutTblIsComplexWOpresRole: [false,1,0,false,null],
      tblTooLargeForLayoutTable: [false,1,0,false,null]
    },

    fnGetNoteSeverityLevel: function(msgKey) {
      var severityLevel = 0;
      if(blr.W15yQC.noteDetails.hasOwnProperty(msgKey)) {
        severityLevel = blr.W15yQC.noteDetails[msgKey][1];
      }
      return severityLevel;
    },

    fnAddNote: function(no, sMsgKey, aParameters) {
      var sl=blr.W15yQC.fnGetNoteSeverityLevel(sMsgKey);
      if(no.notes == null) { no.notes = []; }
      if(blr.W15yQC.fnOkToIncludeNote(sMsgKey)==true) {
        if(sl==1) {
          no.warning = true;
        } else if(sl==2) {
          no.failed = true;
        }
        no.notes.push(new blr.W15yQC.note(sMsgKey, aParameters));
      }
    },

    fnOkToIncludeNote: function(msgKey) {
      var expertLevel=0, severityLevel=0, bIncludeInQuickReport=false;
      if(blr.W15yQC.noteDetails.hasOwnProperty(msgKey)) {
        bIncludeInQuickReport = blr.W15yQC.noteDetails[msgKey][0];
        severityLevel = blr.W15yQC.noteDetails[msgKey][1];
        expertLevel = blr.W15yQC.noteDetails[msgKey][2];
        if((expertLevel<= blr.W15yQC.userExpertLevel && blr.W15yQC.bQuick==false) || (bIncludeInQuickReport==true && blr.W15yQC.bQuick==true)) {
          return true;
        }
      }
      return false;
    },

    fnResolveNote: function(note, msgHash) {
      if(note != null && note.msgKey && note.msgKey.length) {
        var msgKey = note.msgKey,
            aParameters = note.aParameters,
            sMsgTxt = null,
            bHasExplanation = false,
            sExplanation = null,
            bIncludeInQuickReport = false,
            severityLevel = 0,
            expertLevel = 0,
            nd,
            URL = null;

        if(blr.W15yQC.noteDetails.hasOwnProperty(msgKey)) {
          nd = blr.W15yQC.noteDetails[msgKey];
          bIncludeInQuickReport = nd[0];
          severityLevel = nd[1];
          expertLevel = nd[2];
          bHasExplanation = nd[3];
          URL = nd[4];
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
        return new blr.W15yQC.resolvedNote(msgKey, bIncludeInQuickReport, severityLevel, expertLevel, sMsgTxt, sExplanation, URL);
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
        no.warning=false;
        no.failed=false;
        sHTML = '<ul class="results">';
        for(noteLevelIndex=0;noteLevelIndex<3;noteLevelIndex++) {
          noteLevel = noteLevelDisplayOrder[noteLevelIndex];
          noteClass = noteLevelClasses[noteLevel];
          noteText = noteLevelTexts[noteLevel];
          for(i=0; i<no.notes.length; i++) {
            if(blr.W15yQC.fnGetNoteSeverityLevel(no.notes[i].msgKey) == noteLevel) {
              rn = blr.W15yQC.fnResolveNote(no.notes[i], msgHash);
              if(rn != null && ((rn.expertLevel<= blr.W15yQC.userExpertLevel && blr.W15yQC.bQuick==false) || (rn.bQuick==true && blr.W15yQC.bQuick==true))) {
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
        no.warning=false;
        no.failed=false;
        for(noteLevelIndex=0;noteLevelIndex<3;noteLevelIndex++) {
          bLevelTextDisplayed = false;
          noteLevel = noteLevelDisplayOrder[noteLevelIndex];
          noteText = noteLevelTexts[noteLevel];
          for(i=0; i<no.notes.length; i++) {
            if(blr.W15yQC.fnGetNoteSeverityLevel(no.notes[i].msgKey) == noteLevel) {
              rn = blr.W15yQC.fnResolveNote(no.notes[i], msgHash);
              if(rn != null && ((rn.expertLevel<= blr.W15yQC.userExpertLevel && blr.W15yQC.bQuick==false) || (rn.bQuick==true && blr.W15yQC.bQuick==true))) {
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
      return (s!=null)&&(s.length>0)&&/\S/.test(s);
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
         if (node != null && node.tagName && node.tagName.toLowerCase()==sParentTagName) {return true;}
      }
      return false;
    },

    fnFirstChildElementIs: function(node, sElementTagName) {
      var nodeStack=[], n;
      sElementTagName=sElementTagName.toLowerCase();
      if(node != null && node.firstChild && node.firstChild != null) {
        n=node.firstChild;
        while(n != null && n.nodeType != null) {
          if(n.nodeType==1 && n.tagName && n.tagName != null && n.tagName.toLowerCase()==sElementTagName) {
              return true;
          } else if(n.nodeType==3 && blr.W15yQC.fnStringHasContent(n.textContent)) {
              return false;
          }
          if(n.firstChild !=null) {
            nodeStack.push(n);
            n=n.firstChild;
          } else if(n.nextSibling!=null) {
            n=n.nextSibling;
          } else if(nodeStack.length>0) {
            n=nodeStack.pop();
            n=n.nextSibling;
          } else {
            n=null;
          }
        }
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

    fnIsValidSimpleFloat: function (sNumber) {
      sNumber = blr.W15yQC.fnTrim(sNumber);
      if(sNumber != null && sNumber.length>0 && /^[0-9\.]+$/.test(sNumber) && !isNaN(parseFloat(sNumber))) {
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
        sAttributeValue = blr.W15yQC.fnTrim(node.getAttribute(sAttributeName));
      }
      return sAttributeValue;
    },

    fnHasClass: function (ele, cls) {
      return ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
    },

    fnAddClass: function (ele, cls) {
      if (!blr.W15yQC.fnHasClass(ele, cls)) { ele.className += " " + cls; }
    },

    fnAppendPElementTo: function (node, sText) {
      var element;
      if (node!=null && node.ownerDocument) {
        element = node.ownerDocument.createElement('p');
        element.appendChild(node.ownerDocument.createTextNode(sText));
        node.appendChild(element);
      }
    },

    fnAppendExpandContractHeadingTo: function (node, sText) {
      var element, aEl, spanEl, doc;
      if (node!=null && node.ownerDocument) {
        doc=node.ownerDocument;
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
      }
    },

    fnCreateTableHeaders: function (table, aTableHeaders) {
      var thead, tr, i, j, th, thTextArray, doc;
      if (table && aTableHeaders && aTableHeaders.length > 0) {
        doc=table.ownerDocument;
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

    fnAppendTableRow: function (tableBody, aTableCells, sClass) {
      var i, doc, sText, td, tr;
      if (tableBody && aTableCells && aTableCells.length > 0) {
        doc=tableBody.ownerDocument;
        tr = doc.createElement('tr');
        for (i = 0; i < aTableCells.length; i++) {
          td = doc.createElement('td');
          if (aTableCells[i] != null) {
            sText = aTableCells[i].toString();
            sText = sText.replace(/([^<&;\s|\/-]{45,50})/g, "$1<br />"); // Break long strings. Chars known to cause FF to break long strings of text to wrap a td cell ('<' to avoid breaking into tags)
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
      var focusInspectorOn=Application.prefs.getValue("extensions.W15yQC.focusHighlighterTurnedOn",false);
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
      var doc = event.originalTarget;

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
      var i;
      if(doc==null) {
        doc=window.top.content.document;
      }

      function w15yqcHighlightElementWithFocus(e) {
        try {
          if (typeof blr.W15yQC.w15yqcPrevElWithFocus != 'undefined' && blr.W15yQC.w15yqcPrevElWithFocus != null && blr.W15yQC.w15yqcPrevElWithFocus.style) {
            blr.W15yQC.w15yqcPrevElWithFocus.style.outline = blr.W15yQC.w15yqcOriginalItemStyle;
          }
        } catch(ex)
        {
        }

        blr.W15yQC.w15yqcPrevElWithFocus = e.target;

        if(blr.W15yQC.pageLoadHandlerForFocusHighlighter!=null) { // see if still turned on
          var origNode = blr.W15yQC.w15yqcPrevElWithFocus,
              box = null;
          if(blr.W15yQC.w15yqcPrevElWithFocus.getBoundingClientRect) { box = blr.W15yQC.w15yqcPrevElWithFocus.getBoundingClientRect(); }
          while(box != null && box.width == 0 && box.height==0 && blr.W15yQC.w15yqcPrevElWithFocus.firstChild && blr.W15yQC.w15yqcPrevElWithFocus.firstChild != null) {
            blr.W15yQC.w15yqcPrevElWithFocus = blr.W15yQC.w15yqcPrevElWithFocus.firstChild;
            if(blr.W15yQC.w15yqcPrevElWithFocus.getBoundingClientRect) {
              box = blr.W15yQC.w15yqcPrevElWithFocus.getBoundingClientRect();
            }
          }
          if(box == null || box.width == 0 || box.height==0) {
            blr.W15yQC.w15yqcPrevElWithFocus=origNode;
          }

          if (blr.W15yQC.w15yqcPrevElWithFocus != null && blr.W15yQC.w15yqcPrevElWithFocus.style) {
            blr.W15yQC.w15yqcOriginalItemStyle = e.target.ownerDocument.defaultView.getComputedStyle(blr.W15yQC.w15yqcPrevElWithFocus,null).getPropertyValue("outline");
            //blr.W15yQC.w15yqcPrevElWithFocus.style.outline = "solid 2px red";
            blr.W15yQC.w15yqcOriginalItemPosition=e.target.ownerDocument.defaultView.getComputedStyle(blr.W15yQC.w15yqcPrevElWithFocus,null).getPropertyValue("position");
            blr.W15yQC.w15yqcOriginalItemZIndex=e.target.ownerDocument.defaultView.getComputedStyle(blr.W15yQC.w15yqcPrevElWithFocus,null).getPropertyValue("z-index");
            if(blr.W15yQC.w15yqcOriginalItemPosition=="static") {
              //blr.W15yQC.w15yqcPrevElWithFocus.style.position = "relative";
            }
            //blr.W15yQC.w15yqcPrevElWithFocus.style.zIndex = "199999";
            blr.W15yQC.highlightElement(e.target);
          }
        }
      }

      function w15yqcRemoveFocusIndication(e) {
        var i;
        if(e != null && e.target && e.target.ownerDocument) {
          blr.W15yQC.resetHighlightElement(e.target.ownerDocument);
        }
        try {
          if (typeof blr.W15yQC.w15yqcPrevElWithFocus != 'undefined' && blr.W15yQC.w15yqcPrevElWithFocus != null && blr.W15yQC.w15yqcPrevElWithFocus.style) {
            //blr.W15yQC.w15yqcPrevElWithFocus.style.outline = blr.W15yQC.w15yqcOriginalItemStyle;
            //blr.W15yQC.w15yqcPrevElWithFocus.style.position = blr.W15yQC.w15yqcOriginalItemPosition;
            //blr.W15yQC.w15yqcPrevElWithFocus.style.zIndex = blr.W15yQC.w15yqcOriginalItemZIndex;
            //blr.W15yQC.w15yqcPrevElWithFocus = null;
          }
        }catch(ex)
        {
        }
      }

      if (doc!=null && doc.addEventListener) {
        doc.addEventListener( 'focus', w15yqcHighlightElementWithFocus, true);
        doc.addEventListener( 'blur', w15yqcRemoveFocusIndication, true);
        for (i = 0; i < doc.defaultView.frames.length; i++) { // QA this on deeply nested frames
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
          Application.prefs.setValue("extensions.W15yQC.HTMLReport.includeLabelElementsInFormControls", false);
          break;
      }
      doc.getElementById('W15yQC_menuEntry_omUserLevel').setAttribute('label',sLabel);
    },

    fnInitToolsMenuPopup: function(doc) {
      var focusInspectorOn=Application.prefs.getValue("extensions.W15yQC.focusHighlighterTurnedOn",false);
      if(focusInspectorOn) {
        doc.getElementById('W15yQC_menuEntry_focusHighlighter').setAttribute('checked','true');
      } else {
        doc.getElementById('W15yQC_menuEntry_focusHighlighter').removeAttribute('checked');
      }
    },

    fnInitToolsToolbarMenuPopup: function(doc) {
      var focusInspectorOn=Application.prefs.getValue("extensions.W15yQC.focusHighlighterTurnedOn",false);
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
      var dialogPath = null, dialogID = null, win;

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
        case 'scanner':
          dialogID = 'scannerWindow';
          dialogPath = 'chrome://W15yQC/content/scanner.xul';
          break;
        }
        if (dialogID != null) {
          blr.W15yQC.bQuick = false; // Make sure this has been reset
          blr.W15yQC.fnDoEvents();
          win=window.openDialog(dialogPath, dialogID, 'chrome,resizable=yes,centerscreen',blr,firebugObj);
          blr.W15yQC.fnDoEvents();
          if(win!=null && win.focus) { win.focus(); }
          blr.W15yQC.fnDoEvents();
        }
      }
    },

    openHTMLReportWindow: function (bQuick, firebugObj, sReports, sourceDocument) {
      var dialogPath = 'chrome://W15yQC/content/HTMLReportWindow.xul', dialogID = 'HTMLReportWindow', win;

      if(Application.prefs.getValue("extensions.W15yQC.userAgreedToLicense",false)==false) {
        dialogID = 'licenseDialog';
        dialogPath = 'chrome://W15yQC/content/licenseDialog.xul';
        window.openDialog(dialogPath, dialogID, 'chrome,resizable=yes,centerscreen,modal',blr);
      }

      if(Application.prefs.getValue("extensions.W15yQC.userAgreedToLicense",false)==true) {
        win=window.openDialog(dialogPath, dialogID, 'chrome,resizable=yes,centerscreen,toolbars=yes', blr, firebugObj, sReports, bQuick, sourceDocument);
        if(win!=null && win.focus) { win.focus(); }
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
      var i, l, r, height, rects, iMinTopR=null, iMaxBottomR=null, iFrames=null;

      if(node != null && blr.W15yQC.fnNodeIsHidden(node)==false) {
        try {
					if(node.scrollIntoView && blr.W15yQC.fnNodeInViewPort(node)==false) {
						node.scrollIntoView(true);
					}
        } catch(err) {}

        try {
          height = node.ownerDocument.defaultView.innerHeight;
          rects = node.getClientRects();
          if (node.offsetWidth >0 && node.offsetHeight > 0) {
            for (i = 0, l = rects.length; i < l; i++) {
              r = rects[i];
              if(i==0) {
                iMinTopR=r.top;
                iMaxBottomR=r.bottom;
              } else {
                if(r.top<iMinTopR) { iMinTopR=r.top; }
                if(r.bottom>r.bottom) { iMaxBottomR=r.bottom; }
              }
            }
            if(iMinTopR<10 ) {
              // Move document up
              node.ownerDocument.defaultView.scrollBy(0,iMinTopR-10);
            } else if(height-iMaxBottomR<10 && iMinTopR>10) {
              // Move document down
              node.ownerDocument.defaultView.scrollBy(0,(iMaxBottomR-height+10));
            }
          }
        } catch(ex) {}
        if (node.ownerDocument && node.ownerDocument.defaultView && node.ownerDocument.defaultView.parent != null) {
          iFrames=node.ownerDocument.defaultView.parent.document.getElementsByTagName('iframe');
          for (i=0;i<iFrames.length;i++) {
            if (iFrames[i].contentDocument===node.ownerDocument) {
              blr.W15yQC.fnMoveToElement(iFrames[i]);
            }
          }
        }
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
        blr.W15yQC.highlightTimeoutID.push(setTimeout(function () { try{doc.getElementById('W15yQCElementHighlight'+id.toString()).style.backgroundColor='transparent'; }catch(ex){}}, 500));
      } catch(ex) {
      }
    },

    highlightElement: function (node, highlightBGColor,idCounter) { // TODO: Improve the MASKED routine to not indicate empty links as MASKED
      // https://developer.mozilla.org/en/DOM/element.getClientRects
      var origNode, div, box, scrollLeft, scrollTop, x, y, w, h, l, t, o, rect, rects, i, bSetTimeouts=false, tagName=null, bEmptyElement=false, doc;
      if(highlightBGColor==null) { highlightBGColor='yellow'; }
      if (node != null && node.ownerDocument) {
        doc=node.ownerDocument;
        if(idCounter==null && Array.isArray( blr.W15yQC.highlightTimeoutID )) {
          bSetTimeouts=true;
          for(i=0;i<blr.W15yQC.highlightTimeoutID.length;i++) {
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
        box = node.getBoundingClientRect(); // TODO: Really need to get the maximum visible bounding rectangle of all children
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
        if(box != null && box.left) {
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
        for(i=0;i<aDocumentsList.length;i++) { blr.W15yQC.resetHighlightElement(aDocumentsList[i].doc); }
        for(i=0;i<aDocumentsList.length;i++) { blr.W15yQC.resetHighlightElement(aDocumentsList[i].doc); }
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


    fnHighlightFormElement: function (node, skipHighlightingFocusedElement) {
      var idCounter, aIDs, i, el, aLabels, nodeID;

        if(skipHighlightingFocusedElement!=true) {
          idCounter = blr.W15yQC.highlightElement(node, 'yellow');
        } else {
          idCounter=0;
        }
        if (blr.W15yQC.fnIsFormControlNode(node) == true) {
          if (node.hasAttribute('aria-labelledby')) {
            aIDs = node.getAttribute('aria-labelledby').split(' ');
            for (i = 0; i < aIDs.length; i++) {
              el = node.ownerDocument.getElementById(aIDs[i]);
              if (el != null) {
                idCounter = blr.W15yQC.highlightElement(node, 'yellow', idCounter);
              }
            }
          } else {
            el = node.parentNode;
            while (el != null && el.tagName.toLowerCase() != 'label' && el.tagName.toLowerCase() != 'body') {
              el = el.parentNode;
            }
            if (el != null && el.tagName.toLowerCase() == 'label') {
              idCounter = blr.W15yQC.highlightElement(el, '#FFAAAA', idCounter);
            }
            el = node.parentNode;
            while (el != null && el.tagName.toLowerCase() != 'fieldset' && el.tagName.toLowerCase() != 'body') {
              el = el.parentNode;
            }
            if (el != null && el.tagName.toLowerCase() == 'fieldset') {
              aLabels = el.getElementsByTagName('legend');
              if (aLabels != null && aLabels.length > 0) {
                idCounter = blr.W15yQC.highlightElement(aLabels[0], '#AAAAFF', idCounter);
              }
            }
            if (node.hasAttribute('id')) {
              nodeID = node.getAttribute('id');
              aLabels = node.ownerDocument.getElementsByTagName('label');
              if (aLabels != null && aLabels.length > 0) {
                for (i = 0; i < aLabels.length; i++) {
                  if (aLabels[i].getAttribute('for') == nodeID) {
                    idCounter = blr.W15yQC.highlightElement(aLabels[i], '#FFAAAA', idCounter);
                  }
                }
              }
            }
          }
          if (node.hasAttribute('aria-describedby')) {
            aIDs = node.getAttribute('aria-describedby').split(' ');
            for (i = 0; i < aIDs.length; i++) {
              el = node.ownerDocument.getElementById(aIDs[i]);
              if (el != null) {
                idCounter = blr.W15yQC.highlightElement(el, '#AAFFAA', idCounter);
              }
            }
          }
        }

    },

    fnNormalizeURL: function(docURL, sUrl) {
      var firstPart,
          r2=/\/\.\//g,
          r3=/([^\/])\/[^\.\/][^\/]*\/\.\.\//g,
          r4=/(:\/\/[^\/]+\/)\.\.(\/(.*))?$/;

      if(/^\s*(tel|mailto):/i.test(sUrl)==false) {
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
        if(sUrl != null) {
          sUrl = sUrl.replace(/\s/g,'%20');
          sUrl = sUrl.replace(r3,'$1/');
          sUrl = sUrl.replace(r3,'$1/');
          sUrl = sUrl.replace(r3,'$1/');
          sUrl = sUrl.replace(r4,'$1$3');
          sUrl = sUrl.replace(r2, '/');
          sUrl = sUrl.replace(r2, '/');
          sUrl = sUrl.replace(/([^\/:]\/)\/+/g, '/');
        }
      }
      return sUrl;
    },

    fnURLsAreEqual: function (docURL1, url1, docURL2, url2) {
      var i, r, bIgnoreWWW=false, r1=/#.*$/, r2=/[\/\\](index|home)\.s?html?$/i, r3=/:\/\/www\./i, r4=/[\/\\]$/;
      bIgnoreWWW=Application.prefs.getValue("extensions.W15yQC.extensions.W15yQC.DomainEquivalences.ignoreWWW",false);

      if(url1 != null) {
        url1 = blr.W15yQC.fnNormalizeURL(docURL1, url1);
        if(bIgnoreWWW) { url1 = url1.replace(r3, '://'); }
        //url1 = url1.replace(r1, '');
        url1 = url1.replace(r4, '');

        for(i=0;i<blr.W15yQC.domainEq1.length;i++) {
          url1 = url1.replace('//'+blr.W15yQC.domainEq1[i], '//'+blr.W15yQC.domainEq2[i],'i');
        }
      }
      if(url2 != null) {
        url2 = blr.W15yQC.fnNormalizeURL(docURL2, url2);
        if(bIgnoreWWW) { url2 = url2.replace(r3, '://'); }
        //url2 = url2.replace(r1, '');
        url2 = url2.replace(r4, '');
        for(i=0;i<blr.W15yQC.domainEq1.length;i++) {
          url2 = url2.replace('//'+blr.W15yQC.domainEq1[i], '//'+blr.W15yQC.domainEq2[i],'i');
        }
      }

      if(url1!=url2 && url1!=null && url2!=null) {
        url1=url1.replace(r2,'');
        url2=url2.replace(r2,'');
      }
      return (url1 == url2);
    },

    fnLinkTextsAreDifferent: function(s1, s2) { // TODO: QA This function
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

      return WordStr;
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
      return blr.W15yQC.fnCleanSpaces(sTokens);
    },

    fnOnlyASCIISymbolsWithNoLettersOrDigits: function (sText) {
      if (sText && sText.length && sText.length > 0) {
        if(blr.W15yQC.bEnglishLocale==true) {
