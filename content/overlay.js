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

if (typeof blr == "undefined" || !blr) {var blr = {}};

/*
 * Object:  W15yQC
 */
(function() {

if (!blr.W15yQC) {
  blr.W15yQC = {
    releaseVersion: '1.0 - Beta 45',
    releaseDate: 'March 12, 2014',
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
d: 'dee',
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
g: 'gee',
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
j: 'jay',
jeans: 'genes',
judgment: 'judgement',
judgemant: 'judgement',
judgmant: 'judgement',
k: 'kay',
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
r: 'are',
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

    fnGetDoctypeString: function (doc) {
      var dt;
      if(doc!=null && doc.doctype) {
        dt=doc.doctype;
        return '<!DOCTYPE ' + dt.name
         + (dt.publicId ? ' PUBLIC "' + dt.publicId + '"' : '')
         + (!dt.publicId && dt.systemId ? ' SYSTEM' : '') 
         + (dt.systemId ? ' "' + dt.systemId + '"' : '')
         + '>';
      }
      return '';
    },
    
    fnRemoveElementFromChain: function(el) {
      if (el!==null && el.parentNode) {
        while (el.firstChild!==null) {
          el.parentNode.insertBefore(el.firstChild,el);
        }
        el.parentNode.removeChild(el);
      }
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
      ldmkMainShouldNotBeNested: [false,2,0,false,null],
      ldmkBannerShouldNotBeNested: [false,1,0,false,null],
      ldmkLandmarkNameInLabel: [false,1,0,false,null],
      ldmkMainStartsWithNav: [false,2,0,false,null],
      
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
      imgEffectiveLabelDiffThanTitle: [false,1,1,false,null],
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
      hNoLevel1Heading: [true,2,1,false,null],
      hTxtMissing: [true,2,1,false,null],
      hTxtOnlyASCII: [true,2,1,false,null],
      hTxtNotMeaninfgul: [true,1,1,false,null],
      hTxtEmpty: [true,2,1,false,null],
      hHeadingNotUniqueInSection: [true,2,1,false,null],
      hHeadingRoleOverriddenByInheritedRole: [true,1,1,false,null],
      hHeadingRoleOverriddenByRoleAttr: [true,1,1,false,null],
      hChildOfSectioningElementWOLevel: [false,1,1,true,null],
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
      lnkOpensInANewWindowWOWarning: [false,1,1,true,null],
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

    fnElementIsChildOfSectioningElement: function(el) {
      while(el!=null && el.parentNode!=null && el.tagName.toLowerCase()!='body') {
        el=el.parentNode;
        if (el!=null && /^(article|aside|nav|section)$/i.test(el.tagName)) {
          return true;
        }
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
      return ele!=null && ele.className ? (new RegExp('\\b' + cls + '\\b','i')).test(ele.className) : false;
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
        aEl.setAttribute('onmouseup','blur();');
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

    // Based on exec Command_inspect function in https://mxr.mozilla.org/mozilla-central/source/browser/devtools/inspector/CmdInspect.jsm
    // Loosely informed by DevTools API: https://developer.mozilla.org/en-US/docs/Tools/DevToolsAPI
    inspectNode: function (node) {
      let {devtools} = Components.utils.import("resource://gre/modules/devtools/Loader.jsm", {});
      let gBrowser = window.gBrowser;
      let target = devtools.TargetFactory.forTab(gBrowser.selectedTab);
      return gDevTools.showToolbox(target, "inspector").then(function(toolbox) {
        let inspector = toolbox.getCurrentPanel();
        inspector.selection.setNode(node, "browser-context-menu");
      }.bind(this));
    },
      
    openDialog: function (sDialogName) {
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
          win=window.openDialog(dialogPath, dialogID, 'chrome,resizable=yes,centerscreen',blr);
          blr.W15yQC.fnDoEvents();
          if(win!=null && win.focus) { win.focus(); }
          blr.W15yQC.fnDoEvents();
        }
      }
    },

    openHTMLReportWindow: function (bQuick, sReports, sourceDocument) {
      var dialogPath = 'chrome://W15yQC/content/HTMLReportWindow.xul', dialogID = 'HTMLReportWindow', win;

      if(Application.prefs.getValue("extensions.W15yQC.userAgreedToLicense",false)==false) {
        dialogID = 'licenseDialog';
        dialogPath = 'chrome://W15yQC/content/licenseDialog.xul';
        window.openDialog(dialogPath, dialogID, 'chrome,resizable=yes,centerscreen,modal',blr);
      }

      if(Application.prefs.getValue("extensions.W15yQC.userAgreedToLicense",false)==true) {
        win=window.openDialog(dialogPath, dialogID, 'chrome,resizable=yes,centerscreen,toolbars=yes', blr, null, sReports, bQuick, sourceDocument);
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

    // TODO: Investigate how Mozilla's inspector tool highlights elements.
    highlightElement: function (node, highlightBGColor,idCounter) {
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
      var firstPart, m,
          r2=/\/\.\//g,
          r3=/([^\/])\/[^\.\/][^\/]*\/\.\.\//g,
          r4=/(:\/\/[^\/]+\/)\.\.(\/(.*))?$/,
          r5=/^([a-z]+:\/\/[^\/]+\/.*?)(\/[^\/]+\/+\.\.\/+)(.*$)/i,
          r6=/^([a-z]+:\/\/[^\/]+\/.*?)(\/\/)(.*$)/i;
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
                if(sUrl.match(/^[\/\\]/) != null || (typeof firstPart[3] == 'undefined')) {
                  sUrl = firstPart[1]+firstPart[2]+sUrl;
                } else {
                  sUrl = firstPart[1]+firstPart[2]+firstPart[3]+'/'+sUrl;
                }
              }
            }
          }
        }
        if(sUrl != null) {
          sUrl = sUrl.replace(/\s/g,'%20');
          sUrl = sUrl.replace(r4,'$1$3');
          while(m=sUrl.match(r6)) {
            sUrl=m[1]+'/'+m[3];
          }
          while(m=sUrl.match(r5)) {
            sUrl=m[1]+'/'+m[3];
          }
          sUrl = sUrl.replace(r3,'$1/');
          sUrl = sUrl.replace(r3,'$1/');
          sUrl = sUrl.replace(r3,'$1/');
          sUrl = sUrl.replace(r4,'$1$3');
          sUrl = sUrl.replace(r2, '/');
          sUrl = sUrl.replace(r2, '/');
          sUrl = sUrl.replace(/([^\/:]\/)\/+/g, '$1');
        }
      }
      return sUrl;
    },


    fnURLsAreEqual: function (docURL1, url1, docURL2, url2) {
      var i, r, bIgnoreWWW=false, r1=/#.*$/, r2=/[\/\\](index|home)\.([sx]?html?|php[34]?|asp|aspx|cgi)$/i, r3=/:\/\/www\./i, r4=/[\/\\]$/;
      bIgnoreWWW=Application.prefs.getValue("extensions.W15yQC.extensions.W15yQC.DomainEquivalences.ignoreWWW",true);

      if(url1 != null) {
        url1 = blr.W15yQC.fnNormalizeURL(docURL1, url1);
        if(bIgnoreWWW) { url1 = url1.replace(r3, '://'); }
        //url1 = url1.replace(r1, '');

        for(i=0;i<blr.W15yQC.domainEq1.length;i++) {
          url1 = url1.replace('//'+blr.W15yQC.domainEq1[i], '//'+blr.W15yQC.domainEq2[i],'i');
        }
      }
      if(url2 != null) {
        url2 = blr.W15yQC.fnNormalizeURL(docURL2, url2);
        if(bIgnoreWWW) { url2 = url2.replace(r3, '://'); }
        //url2 = url2.replace(r1, '');
        for(i=0;i<blr.W15yQC.domainEq1.length;i++) {
          url2 = url2.replace('//'+blr.W15yQC.domainEq1[i], '//'+blr.W15yQC.domainEq2[i],'i');
        }
      }

      if(url1!=url2 && url1!=null && url2!=null && (r2.test(url1)==false || r2.test(url2)==false)) {
        url1=url1.replace(r2,'');
        url2=url2.replace(r2,'');
      }
      if(url1!=null) { url1 = url1.replace(r4, ''); }
      if(url2!=null) { url2 = url2.replace(r4, ''); }
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

      if (WordString.length<2) {
        return WordString;
      }
      
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
          sText = sText.replace(/[^a-zA-Z0-9€™“Øœæ–ƒÎÙå—ç¾˜„‚‡®Œˆèé•ŠŸŽ’…‹š‘ž†‰ì›ïËÌñßó]+/g, '');
          if (sText.length > 0) {
            return false;
          }
          return true;
        } else { // TODO: Improve this by checking for unicode characters in common languages
          sText = sText.replace(/[~`!@#$%^&*\(\)-_+=\[{\]}\\\|;:'",<\.>\/\?\sÃà ÑÂª¬¸·×©¤§±¹½¨¡¥²³¦ÅÖÈ]+/g, '');
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
      var sMsg=null, sMsg1=null, sMsg2=null, sMsg3=null, sID2;
      sID = blr.W15yQC.fnTrim(sID);
      if(blr.W15yQC.fnStringHasContent(sID)) {
        if(/^[a-z]/i.test(sID)==false){
          sMsg1='begin with a letter [a-z]';
        }
        if(/\s/.test(sID)) {
          sMsg2='not contain spaces'
        }
        sID2=sID.replace(/[a-z0-9\s:\._-]/ig,'');
        if(blr.W15yQC.fnStringHasContent(sID2)) {
          if(sID2.length>1) {
            sMsg3="not contain the characters:'"+sID2+"'";
          } else {
            sMsg3="not contain the character:'"+sID2+"'";
          }
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
          if(sMsg2!=null) sMsg=sMsg+' and '+sMsg2;
          if(sMsg3!=null) sMsg=sMsg+' and '+sMsg3;
        }
      }
      return blr.W15yQC.fnTrim(sMsg);
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
      var i, aIDs, sMissingIDs = null, bFoundAnID=false;
      if(doc!=null && sIDs != null && sIDs.length) {
        aIDs = sIDs.split(' ');
        if (aIDs != null) {
          for (i = 0; i < aIDs.length; i++) {
            if (doc.getElementById(aIDs[i]) == null) {
              sMissingIDs = blr.W15yQC.fnJoin(sMissingIDs, aIDs[i], ', ');
            } else {
              bFoundAnID=true;
            }
          }
        }
      }
      if (bFoundAnID==false) {
        sMissingIDs=sMissingIDs+' (every ID)';
      }
      return sMissingIDs;
    },

    fnAppearsToBeSkipNavLink: function (sLinkText, sHref) {
      if(sLinkText!=null && sLinkText.length>2) {
        if(/#/.test(sHref)) {
          return true;
        }
        if(/(skip|jump).*(nav|main content)/i.test(sLinkText)) {
          return true;
        }
      }
      return false;
    },

    fnIsMeaningfulLinkText: function(sText, minLength) {
      if (minLength == null) { minLength = 3; } // TODO: Make this a pref parameter
      if(sText != null && sText.toLowerCase) {
        if(blr.W15yQC.bEnglishLocale) { sText = sText.replace(/[^a-zA-Z0-9\s]/g, ' '); }
        sText = blr.W15yQC.fnCleanSpaces(sText).toLowerCase();
        // Meaningful but short word exceptions:
        if(sText == 'go' || sText == 'ok' || sText == 'faq' || sText == 'map' || sText=='iu') { return true; }

        if (sText && sText.length && sText.length >= minLength && sText.toLowerCase) {
          if (blr.W15yQC.fnOnlyASCIISymbolsWithNoLettersOrDigits(sText)) { return false; }
          switch (sText.toLowerCase()) {
          case 'back':
          case 'click':
          case 'click here':
          case 'clicking here':
          case 'click here for more':
          case 'click here to find out more':
          case 'click this':
          case 'click this for more':
          case 'click this to find out more':
          case 'even more':
          case 'get more':
          case 'get details':
          case 'learn more':
          case 'here':
          case 'no':
          case 'yes':
          case 'next':
          case 'prev':
          case 'previous':
          case 'more':
          case 'read':
          case 'read this':
          case 'read more':
          case 'reading more':
          case 'read more here':
          case 'see':
          case 'see here':
          case 'see all':
          case 'see more':
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


    fnAppearsToBeALayoutTable: function(t) {
      var i,j, cell;
      if(t != null && t.tagName && t.tagName.toLowerCase()=='table') {
        if(t.hasAttribute('role')==true && t.getAttribute('role').toLowerCase()=='presentation') {
           return true;
        }
        if((t.caption == null || blr.W15yQC.fnStringHasContent(t.caption.textContent)==false) && blr.W15yQC.fnStringHasContent(t.getAttribute('summary'))==false) {
          if(t.rows && t.rows.length) {
            for(i=0;i<t.rows.length;i++) {
              if(t.rows[i] != null && t.rows[i].cells && t.rows[i].cells.length) {
                for(j=0;j<t.rows[i].cells.length;j++) {
                  cell=t.rows[i].cells[j];
                  if(cell.tagName.toLowerCase()=='th' || cell.hasAttribute('axis') || cell.hasAttribute('headers')) {
                    return false;
                  }
                }
              }
            }
          }
          return true;
        } // has caption or summary
      } // is not a table
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

        if (sText.length >= minLength) {
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

    fnAppearsToBeRelativeURL: function (sText) { // TODO: QA THIS!!!
      if (sText != null && sText.match(/(\/|\.(s?html?|php|asp))/i) && sText.match(/^\s*(\.\.?\/)?([\w\-\.,@?^=%&amp;:\/~\+#]*[\w\-\@?^=%&amp;\/~\+#])?\s*$/i)) {
        return true;
      }
      return false;
    },

    fnAppearsToBeFullyQualifiedURL: function (sURL) { // TODO: QA THIS!!!
      if (sURL != null && sURL.match(/[a-z]+:\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:\/~\+#]*[\w\-\@?^=%&amp;\/~\+#])?/i)) {
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
      if (sText != null && sText.match(/^(spac.r|blank filler|filler|blank|shim|layout|inv.s.b[ale]+)(\s(img|image|graphic|pic|picture))?$/i)) {
        return true;
      }
      return false;
    },

    fnImageFilenameAppearsToBeASpacer: function (sText) {
      if (sText != null && sText.match(/\b((spac.r|shim|inv.s.ble)([\. ](gif|jpg|ima?ge?|pic).*))\s*$/i)) {
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

    fnIsOnlyNextOrPreviousText: function (str) { // TODO: What about other languages?
      if(str != null && str.replace) {
        if(blr.W15yQC.bEnglishLocale) { str=str.replace(/[^a-z0-9\s]/ig,' '); }
        str = blr.W15yQC.fnCleanSpaces(str);
        if(str.match(/^(next|prev|back|previous)$/i)) { return true; }
      }
      return false;
    },

    fnNodeInViewPort: function (node) { // TODO: QA This. Does it work correctly with frames, etc?
      var i, l, r, height, rects;
      try {
        height = node.ownerDocument.defaultView.innerHeight;
        rects = node.getClientRects();
        if (node.offsetWidth === 0 || node.offsetHeight === 0) { return false; }
        for (i = 0, l = rects.length; i < l; i++) {
          r = rects[i];
          if( r.top+(node.offsetHeight/2) > 0 ? r.top+(node.offsetHeight/2) <= height : (r.bottom-(node.offsetHeight/2) > 0 && r.bottom-(node.offsetHeight/2) <= height)) { return true; }
        }
      } catch(ex) {}
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
               (window.getComputedStyle(node, null)==null||(window.getComputedStyle(node, null).getPropertyValue("display").toLowerCase() != 'none' &&
               window.getComputedStyle(node, null).getPropertyValue("visibility").toLowerCase() != 'hidden')) &&
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
          node = node.parentNode;
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
        return Math.floor(Math.sqrt(dx*dx+dy*dy));
      }
      return 100000;
    },

    fnJAWSAnnouncesControlAs: function (node) { // TODO: Vet this with JAWS
      var nType, sRole;
      if(node != null && node.tagName) {
        if (node.hasAttribute('role')) {
          sRole=blr.W15yQC.fnTrim(node.getAttribute('role'));
          if (sRole!=null) {
            switch(sRole.toLowerCase()) {
              case 'button':
                return 'button';
              case 'checkbox':
                return 'check box';
              case 'radio':
                return 'radio button';
              case 'textbox':
                return 'edit';
            }
          }
        }
        switch (node.tagName.toLowerCase()) {
          case 'input':
            if(node.hasAttribute('type')) {
              nType=node.getAttribute('type');
              if(nType != null && nType.toLowerCase) {
                switch(nType.toLowerCase()) {
                  case 'button':
                  case 'submit':
                  case 'reset':
                  case 'image':
                    return 'button';
                  case 'radio':
                    return 'radio button';
                  case 'checkbox':
                    return 'checkbox';
                  case 'password':
                    return 'password edit';
                  case 'text':
                  default:
                    return 'edit';
                }
              }
            }
            return 'edit';
            break;
          case 'button':
            return 'button';
          case 'select':
            return 'combobox';
          case 'textarea':
            return 'edit' ;
          default:
            return '';
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
      var sRole, sFirstRole;
      if (node != null && node.tagName) {
        switch (node.tagName.toLowerCase()) {
        case 'input':
        case 'button':
        case 'select':
        case 'textarea':
          return true;
        }
        if (node.hasAttribute && node.hasAttribute('role')) {
          sRole=node.getAttribute('role');
          sFirstRole=sRole.replace(/^(\w+)\s.*$/, "$1");
          switch (sFirstRole) {
          case 'button':
          case 'checkbox':
          case 'combobox':
          case 'listbox':
          case 'radio':
          case 'slider':
          case 'spinbutton':
          case 'textbox':
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
      try {
        if (node !== null && node.ownerDocument && node.ownerDocument != null && aDocumentsList !== null && aDocumentsList.length) {
          for (i = 0; i < aDocumentsList.length; i++) {
            try {
              if (node.ownerDocument === aDocumentsList[i].doc) { return i + 1; }
            } catch (ex) { }
          }
        }
      } catch (ex2) { }
      return -1;
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

    fnGetARIALabelText: function (node) {
      var sLabelText = null, doc;
      if (node != null && node.hasAttribute && node.ownerDocument) {
        doc=node.ownerDocument;
        if (node.hasAttribute('aria-label')) {
          sLabelText = blr.W15yQC.fnCleanSpaces(node.getAttribute('aria-label'));
        }
        if ((sLabelText == null || sLabelText.length < 1) && node.hasAttribute('aria-labelledby')) {
          sLabelText = blr.W15yQC.fnCleanSpaces(blr.W15yQC.fnGetTextFromIdList(node.getAttribute('aria-labelledby'), doc));
        }
      }
      return sLabelText;
    },

    fnGetFormControlLabelTagText: function (node) { // TODO: QA This. What happens with both explicit and implicit labels.
      var sLabelText = null, implicitLabelNode, explictLabelsList, i, doc;
      if (node != null && node.getAttribute && node.ownerDocument) {
        doc=node.ownerDocument;
        if(node.hasAttribute('role') && node.getAttribute('role').toLowerCase()=='radio') { // TODO: Check this!! I don't believe it.
          sLabelText = blr.W15yQC.fnGetDisplayableTextRecursively(node);  // TODO: Check this!! I don't believe it.
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


    fnBuildLabel: function(node, aConfig, iRecursion, aStopElements,aElements) {
      var sLabelText='',
          sLabelSource='',
          bFirst=false,
          bFieldsetHandled=false,
          bSkipToFieldset=false,
          implicitLabelNode,
          explictLabelsList,
          sTagName,
          l,
          doc,
          i,j;

      if(node !=null && node.hasAttribute && aConfig!=null && aConfig.length) {
        sTagName=node.tagName.toLowerCase();
        doc=node.ownerDocument;
        for(i=0; i<aConfig.length; i++) {
          aConfig[i]=aConfig[i].toLowerCase();
          l=(sLabelText==null ? 0 : sLabelText.length);

          if(aConfig[i]=='fieldset' && bFieldsetHandled==false) {
            bFieldsetHandled=true;
            sLabelText = blr.W15yQC.fnCleanSpaces(blr.W15yQC.fnJoin(blr.W15yQC.fnGetLegendText(node), sLabelText, ' '));
            if(sLabelText.length > l) { sLabelSource = blr.W15yQC.fnJoin('fieldset legend', sLabelSource, ', '); }
          } else if(bSkipToFieldset!=true) {
            switch(aConfig[i]) {
              case 'first':
                bFirst=true;
                break;

              case 'check':
                break;

              case 'aria':
                sLabelText = blr.W15yQC.fnCleanSpaces(blr.W15yQC.fnJoin(sLabelText, node.getAttribute('aria-label'), ' '));
                if(sLabelText.length>l) {
                  sLabelSource = blr.W15yQC.fnJoin(sLabelSource, 'aria-label attribute', ', ');
                } else if (node.hasAttribute('aria-labelledby')) {
                  sLabelText = blr.W15yQC.fnCleanSpaces(blr.W15yQC.fnJoin(sLabelText, blr.W15yQC.fnGetTextFromIdList(node.getAttribute('aria-labelledby'), doc),' '));
                  if(sLabelText.length>l) { sLabelSource = blr.W15yQC.fnJoin(sLabelSource, 'aria-labelledby elements', ', '); }
                }
                break;

              case 'aria-describedby':
                if (node.hasAttribute('aria-describedby')) {
                  sLabelText = blr.W15yQC.fnCleanSpaces(blr.W15yQC.fnJoin(sLabelText, blr.W15yQC.fnGetTextFromIdList(node.getAttribute('aria-describedby'), doc),' '));
                  if(sLabelText.length>l) { sLabelSource = blr.W15yQC.fnJoin(sLabelSource, 'aria-describedby elements', ', '); }
                }
                break;

              case 'aria-labelledby':
                if (node.hasAttribute('aria-labelledby')) {
                  sLabelText = blr.W15yQC.fnCleanSpaces(blr.W15yQC.fnJoin(sLabelText, blr.W15yQC.fnGetTextFromIdList(node.getAttribute('aria-labelledby'), doc),' '));
                  if(sLabelText.length>l) { sLabelSource = blr.W15yQC.fnJoin(sLabelSource, 'aria-labelledby elements', ', '); }
                }
                break;

              case 'implicit label':
                implicitLabelNode = blr.W15yQC.fnFindImplicitLabelNode(node);
                if (implicitLabelNode != null) {
                  sLabelText = blr.W15yQC.fnCleanSpaces(blr.W15yQC.fnJoin(sLabelText, blr.W15yQC.fnGetDisplayableTextRecursivelyStrict(implicitLabelNode,iRecursion,aStopElements,aElements),' '));
                  if(sLabelText.length > l) { sLabelSource = blr.W15yQC.fnJoin(sLabelSource, 'implicit label', ', '); }
                }
                break;

              case 'explicit label':
                explictLabelsList = blr.W15yQC.fnFindLabelNodesForId(node.getAttribute('id'), doc);
                for (j = 0; j < explictLabelsList.length; j++) {
                  sLabelText = blr.W15yQC.fnJoin(sLabelText, blr.W15yQC.fnGetDisplayableTextRecursivelyStrict(explictLabelsList[j],iRecursion,aStopElements,aElements), ' ');
                }
                sLabelText = blr.W15yQC.fnCleanSpaces(sLabelText);
                if(sLabelText.length > l) { sLabelSource = blr.W15yQC.fnJoin(sLabelSource, 'explicit label', ', '); }
                break;

              case 'child text':
                if (sTagName == 'a' || sTagName=='li' || sTagName=='dt' || sTagName=='dd') { // TODO: Vet this with JAWS!!!
                  sLabelText = blr.W15yQC.fnCleanSpaces(blr.W15yQC.fnJoin(sLabelText, blr.W15yQC.fnGetDisplayableTextRecursivelyStrict(node,iRecursion,['ul','ol','dl','li','dt','dl','dd'],aElements),' '));
                } else {
                  sLabelText = blr.W15yQC.fnCleanSpaces(blr.W15yQC.fnJoin(sLabelText,blr.W15yQC.fnGetDisplayableTextRecursivelyStrict(node,iRecursion,aStopElements,aElements),' '));
                }
                if(sLabelText.length > l) {
                  sLabelSource = blr.W15yQC.fnJoin(sLabelSource, 'child text', ', ');
                }
                break;

              case 'default':
                if(aConfig.length>i+1) {
                  sLabelText = blr.W15yQC.fnCleanSpaces(blr.W15yQC.fnJoin(sLabelText, aConfig[i+1], ' '));
                  i++;
                }
                if(sLabelText.length > l) { sLabelSource = blr.W15yQC.fnJoin(sLabelSource, 'default text', ', '); }
                break;

              case 'alt':
              case 'aria-label':
              case 'title':
              case 'value':
              case 'name':
              case 'id':
              case 'src':
                if (node.hasAttribute(aConfig[i])) {
                  sLabelText = blr.W15yQC.fnCleanSpaces(blr.W15yQC.fnJoin(sLabelText, node.getAttribute(aConfig[i]), ' '));
                  if (sLabelText.length > l) { sLabelSource = blr.W15yQC.fnJoin(sLabelSource, aConfig[i]+' attribute', ', '); }
                }
                break;

              default:
                alert("BAD aConfig value passed to fnBuildLabel!!: "+aConfig[i]);
            }
          }

          if((bFirst==true || aConfig[i]=='check') && sLabelText.length>0) {
            bSkipToFieldset=true;
          }
        }
        //if (node.hasAttribute('aria-describedby')) {
        //  l=(sLabelText==null ? 0 : sLabelText.length);
        //  sLabelText = blr.W15yQC.fnCleanSpaces(blr.W15yQC.fnJoin(sLabelText, blr.W15yQC.fnGetTextFromIdList(node.getAttribute('aria-describedby'), doc),' '));
        //  if(sLabelText.length>l) { sLabelSource = blr.W15yQC.fnJoin(sLabelSource, 'aria-describedby elements', ', '); }
        //}
        
       }
      return [sLabelText, sLabelSource];
    },

    fnGetEffectiveLabel: function (node,iRecursion,aStopElements, aElements) {
      // TODO: Which ARIA roles override the native HTML element's role?
      // TODO: Which ARIA roles allow child text collection. When does the title attribute override them?
      // TODO: pick up role="button", etc? JAWS does...
      // TODO: return an effective Label Object that contains the text and a property that tells the text source
      // textarea, select, button, input
      /* Q: Is the decision that JAWS makes from the lack of the attribute or the string, does aria-label="" stop progression the same as no title attribute?
       * A: Empty aria-label and elements pointed to by aria-labelledby are the same as not having an aria-label or aria-labelled by (JAWS 13 + IE9 - Windows 7 32 bit)
       *
       * JAWS 14 on Windows 8 tests
       *
       *   Firefox 19:
       *     Frames: Listed by title attribute on the iframe element, if title attribute is missing, then it is listed by the first of aria-labelledby, aria-label, or src attribute
       *
       *   IE 10
       *     Frames: Listed by title of document contained in the frame, then if missing by the first of title attribute on the iframe element, aria-label, aria-labelled by, or src.
       */
      var sLabelText = '',
          sLabelSource ='',
          aLabel=[null,''],
          sTagName,
          sRole,
          inputType,
          implicitLabelNode,
          explictLabelsList,
          doc,
          i,
          l;

      if (node != null && node.tagName) {
        sTagName = node.tagName.toLowerCase();
        if(node.hasAttribute && node.hasAttribute('role')) {
          sRole=node.getAttribute('role').toLowerCase();
          sRole=sRole.replace(/^(\w+)\s.*$/, "$1");
        } else {
          sRole='';
        }
        doc=node.ownerDocument;

          if (sTagName == 'input') {
            inputType = '';
            if (node.hasAttribute('type')) { inputType = blr.W15yQC.fnCleanSpaces(node.getAttribute('type').toLowerCase()); }
            if (inputType == '') { inputType = 'text'; } // default type
            switch (inputType) {
              case 'submit':
                // Vetted against JAWS Version 13.0.527 32 bit, IE 9.0.8112.16421, Windows 7 32 bit, 2-Dec-2011
                aLabel=blr.W15yQC.fnBuildLabel(node, ['first','aria','value', 'default', 'Submit Query', 'fieldset'],iRecursion,aStopElements,aElements);
                break;

              case 'reset':
                // Vet this
                aLabel=blr.W15yQC.fnBuildLabel(node, ['first','aria','value', 'default', 'Reset Query', 'fieldset'],iRecursion,aStopElements,aElements);
                break;

              case 'image':
                // Vetted against JAWS Version 13.0.527 32 bit, IE 9.0.8112.16421, Windows 7 32 bit, 2-Dec-2011
                aLabel=blr.W15yQC.fnBuildLabel(node, ['first','aria','alt','title','value','src','name','id', 'fieldset'],iRecursion,aStopElements,aElements);
                break;

              case 'button':
                // Vetted against JAWS Version 13.0.527 32 bit, IE 9.0.8112.16421, Windows 7 32 bit, 2-Dec-2011
                aLabel=blr.W15yQC.fnBuildLabel(node, ['first','aria','value','title','alt','name', 'fieldset'],iRecursion,aStopElements,aElements);
                break;

              case 'radio':
                // Vetted against JAWS Version 13.0.527 32 bit, IE 9.0.8112.16421, Windows 7 32 bit, 2-Dec-2011
              case 'checkbox':
                // Vetted against JAWS Version 13.0.527 32 bit, IE 9.0.8112.16421, Windows 7 32 bit, 2-Dec-2011
                // TODO: Does an implicit label really preempt any explicit labels?
                aLabel=blr.W15yQC.fnBuildLabel(node, ['first','aria','implicit label','explicit label','title','alt', 'fieldset'],iRecursion,aStopElements,aElements);
                break;

              default:
                // type='text' and unrecognized types
                // type='text'  -- Vetted against JAWS Version 13.0.527 32 bit, IE 9.0.8112.16421, Windows 7 32 bit, 2-Dec-2011
                // Mimic IE 9 + JAWS 12 behavior, FF 7 + JAWS 12 would add label elements along with aria-labelled by content.
                aLabel=blr.W15yQC.fnBuildLabel(node, ['first','aria','implicit label','explicit label','title','alt', 'fieldset'],iRecursion,aStopElements,aElements);
            }
            // end tagName == input
          } else if (sTagName == 'button') { // Vetted against JAWS Version 13.0.527 32 bit, IE 9.0.8112.16421, Windows 7 32 bit, 2-Dec-2011
            aLabel=blr.W15yQC.fnBuildLabel(node, ['first','aria','child text','alt','title','value','name', 'fieldset'],iRecursion,aStopElements,aElements);

          } else if (sTagName == 'a' || sTagName=='li' || sTagName=='dt' || sTagName=='dd') { // TODO: Vet this with JAWS!!!
            aLabel=blr.W15yQC.fnBuildLabel(node, ['first','aria','child text','title'],iRecursion,aStopElements,aElements);

          } else if (sTagName == 'h1' || sTagName == 'h2' || sTagName == 'h3' || sTagName == 'h4' || sTagName == 'h5' || sTagName == 'h6') { // TODO: Vet this with JAWS!!!
            aLabel=blr.W15yQC.fnBuildLabel(node, ['first','aria','child text','title'],iRecursion,aStopElements,aElements);

          } else if (sTagName == 'select') { // Vetted against JAWS Version 13.0.527 32 bit, IE 9.0.8112.16421, Windows 7 32 bit, 2-Dec-2011
            aLabel=blr.W15yQC.fnBuildLabel(node, ['first','aria','implicit label','explicit label','title','alt', 'fieldset'],iRecursion,aStopElements,aElements);

          } else if (sTagName == 'textarea') { // Vetted against JAWS Version 13.0.527 32 bit, IE 9.0.8112.16421, Windows 7 32 bit, 2-Dec-2011
            aLabel=blr.W15yQC.fnBuildLabel(node, ['first','aria','implicit label','explicit label','title','alt', 'fieldset'],iRecursion,aStopElements,aElements);

          } else if (sTagName == 'img' || sTagName == 'area') { // JAWS 13: aria-label, alt, title, aria-labelledby -- TODO: Vet area with JAWS
            aLabel=blr.W15yQC.fnBuildLabel(node, ['first','aria-label','alt','title','aria-labelledby'],iRecursion,aStopElements,aElements);

          } else if (sTagName == 'iframe' || sTagName == 'frame') { // JAWS 14 FF19 Win8: ignore doc title, title attribute, aria-labelledby, aria-label
            aLabel=blr.W15yQC.fnBuildLabel(node, ['first','title','aria-labelledby', 'aria-label'],iRecursion,aStopElements,aElements);

          } else if (sTagName == 'article' || sTagName == 'aside' || sTagName == 'header' || sTagName == 'footer' || sTagName == 'nav' || sTagName == 'section') { // TODO: QA This
            aLabel=blr.W15yQC.fnBuildLabel(node, ['first', 'aria', 'title'],iRecursion,aStopElements,aElements);

          } else if (blr.W15yQC.fnStringHasContent(sRole)) { // TODO: Vet this, not checked with JAWS
            if(/^(button|checkbox|columnheader|directory|gridcell|heading|landmark|link|listitem|menuitem|menuitemcheckbox|menuitemradio|option|radio|row|rowgroup|rowheader|section|sectionhead|tab|treeitem)/.test(sRole)==true) {
              aLabel=blr.W15yQC.fnBuildLabel(node, ['first','aria','title','child text','fieldset'],iRecursion,aStopElements,aElements); // TODO: Does the title attribute really trump child text for 'Name From: Contents' roles?
            } else {
              aLabel=blr.W15yQC.fnBuildLabel(node, ['first','aria','implicit label','explicit label','title','alt'],iRecursion,aStopElements,aElements);
            }
          } else {
            aLabel=blr.W15yQC.fnBuildLabel(node, ['first','aria','child text','title'],iRecursion,aStopElements,aElements);
          }
      }
      return aLabel;
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

    fnGetDisplayableTextBetweenElements: function (rootNode, stopNode, iRecursion, aStopElements) {
      // TODO: Vet this with JAWS
      // TODO: How is this used? Getting the title and alt text isn't exactly displayable text. What should this function do? Do we need another one?
      // TODO: QA THIS, rethink this...
      // TODO: Gan we get this from Firefox? What about ARIA-label and other ARIA attribute?
      // How does display:none, visibility:hidden, and aria-hidden=true affect child text collection?
      var sNodeChildText = '',
          sRecursiveText = null,
          node;
      if (rootNode != null) {
        if (iRecursion == null) {
          iRecursion = 0;
        }
        if (aStopElements==null) {
          aStopElements=['option'];
        }
        for (node = rootNode.firstChild; node != null; node = node.nextSibling) {
          if (node===stopNode) {
            break;
          }
          if (node.nodeType == 1 || node.nodeType == 3) { // Only pay attention to element and text nodes
            if (node.tagName && ((node.contentWindow && node.contentWindow.document !== null) ||
                              (node.contentDocument && node.contentDocument.body !== null)) && blr.W15yQC.fnNodeIsHidden(node) == false) { // Found a frame
              // don't get frame contents, but instead check if it has a title attribute
              if (node.hasAttribute('title')) {
                sNodeChildText = blr.W15yQC.fnJoin(sNodeChildText, node.getAttribute('title'), ' ');
              }
            } else { // keep looking through current document
              if (node.nodeType == 3 && node.nodeValue != null) { // text content
                sNodeChildText = blr.W15yQC.fnJoin(sNodeChildText, node.nodeValue, ' ');
              }
              if (node.nodeType == 1 || node.nodeType == 3) {
                sRecursiveText='';
                if (iRecursion < 100 && (node.nodeType!=1 || (((iRecursion>0 && aStopElements!=null) ? aStopElements.indexOf(node.tagName.toLowerCase()) : -1) < 0 && blr.W15yQC.fnNodeIsHidden(node) == false))) {
                  sRecursiveText = blr.W15yQC.fnGetDisplayableTextBetweenElements(node, iRecursion + 1, aStopElements);
                }
                if (blr.W15yQC.fnStringHasContent(sRecursiveText) == false && node.nodeType == 1) {
                  sRecursiveText = node.getAttribute('aria-label');
                  if(blr.W15yQC.fnStringHasContent(sRecursiveText)== false && node.hasAttribute('aria-labelledby')) {
                    sRecursiveText = blr.W15yQC.fnGetTextFromIdList(node.getAttribute('aria-labelledby'), node.ownerDocument);
                  }
                  if (blr.W15yQC.fnStringHasContent(sRecursiveText) == false && node.tagName != null && blr.W15yQC.fnCanTagHaveAlt(node.tagName) && node.hasAttribute('alt') == true) {
                    sRecursiveText = blr.W15yQC.fnJoin(sNodeChildText, node.getAttribute('alt'));
                  }
                  if (blr.W15yQC.fnStringHasContent(sRecursiveText) == false && node.hasAttribute && node.hasAttribute('title')) {
                    sRecursiveText = blr.W15yQC.fnJoin(sNodeChildText, node.getAttribute('title'));
                  }
                }
                sNodeChildText = blr.W15yQC.fnJoin(sNodeChildText, sRecursiveText, ' ');
              }
            }
          }
        }

        sNodeChildText = blr.W15yQC.fnCleanSpaces(sNodeChildText);

        if ((iRecursion == null || iRecursion == 0) && (sNodeChildText == null || sNodeChildText.length == 0) && rootNode.hasAttribute && rootNode.tagName) {
          if (blr.W15yQC.fnCanTagHaveAlt(rootNode.tagName) && rootNode.hasAttribute('alt') == true) {
            sNodeChildText = blr.W15yQC.fnCleanSpaces(rootNode.getAttribute('alt'));
          } else if (rootNode.hasAttribute('title')) {
            sNodeChildText = blr.W15yQC.fnCleanSpaces(rootNode.getAttribute('title'));
          }
        }
      }

      return sNodeChildText;
    },

    
    fnGetDisplayableTextRecursively: function (rootNode, iRecursion, aStopElements) {
      // TODO: Vet this with JAWS
      // TODO: How is this used? Getting the title and alt text isn't exactly displayable text. What should this function do? Do we need another one?
      // TODO: QA THIS, rethink this...
      // TODO: Gan we get this from Firefox? What about ARIA-label and other ARIA attribute?
      // How does display:none, visibility:hidden, and aria-hidden=true affect child text collection?
      var sNodeChildText = '',
          sRecursiveText = null,
          node;
      if (rootNode != null) {
        if (iRecursion == null) {
          iRecursion = 0;
        }
        if (aStopElements==null) {
          aStopElements=['option'];
        }
        for (node = rootNode.firstChild; node != null; node = node.nextSibling) {
          if (node.nodeType == 1 || node.nodeType == 3) { // Only pay attention to element and text nodes
            if (node.tagName && ((node.contentWindow && node.contentWindow.document !== null) ||
                              (node.contentDocument && node.contentDocument.body !== null)) && blr.W15yQC.fnNodeIsHidden(node) == false) { // Found a frame
              // don't get frame contents, but instead check if it has a title attribute
              if (node.hasAttribute('title')) {
                sNodeChildText = blr.W15yQC.fnJoin(sNodeChildText, node.getAttribute('title'), ' ');
              }
            } else { // keep looking through current document
              if (node.nodeType == 3 && node.nodeValue != null) { // text content
                sNodeChildText = blr.W15yQC.fnJoin(sNodeChildText, node.nodeValue, ' ');
              }
              if (node.nodeType == 1 || node.nodeType == 3) {
                if (iRecursion < 100 && (node.nodeType!=1 || (((iRecursion>0 && aStopElements!=null) ? aStopElements.indexOf(node.tagName.toLowerCase()) : -1) < 0 && blr.W15yQC.fnNodeIsHidden(node) == false))) {
                  sRecursiveText = blr.W15yQC.fnGetDisplayableTextRecursively(node, iRecursion + 1, aStopElements);
                }
                if (sRecursiveText == null || (node.nodeType == 1 && blr.W15yQC.fnTrim(sRecursiveText).length == 0)) {
                  if (node.tagName != null && blr.W15yQC.fnCanTagHaveAlt(node.tagName) && node.hasAttribute('alt') == true) {
                    sNodeChildText = blr.W15yQC.fnJoin(sNodeChildText, node.getAttribute('alt'));
                  } else if (node.hasAttribute && node.hasAttribute('title')) {
                    sNodeChildText = blr.W15yQC.fnJoin(sNodeChildText, node.getAttribute('title'));
                  }
                } else {
                  sNodeChildText = blr.W15yQC.fnJoin(sNodeChildText, sRecursiveText, ' ');
                }
              }
            }
          }
        }

        sNodeChildText = blr.W15yQC.fnCleanSpaces(sNodeChildText);

        if ((iRecursion == null || iRecursion == 0) && (sNodeChildText == null || sNodeChildText.length == 0) && rootNode.hasAttribute && rootNode.tagName) {
          if (blr.W15yQC.fnCanTagHaveAlt(rootNode.tagName) && rootNode.hasAttribute('alt') == true) {
            sNodeChildText = blr.W15yQC.fnCleanSpaces(rootNode.getAttribute('alt'));
          } else if (rootNode.hasAttribute('title')) {
            sNodeChildText = blr.W15yQC.fnCleanSpaces(rootNode.getAttribute('title'));
          }
        }
      }

      return sNodeChildText;
    },

    fnGetDisplayableTextRecursivelyStrict: function (rootNode, iRecursion, aStopElements, aElements) {
      // URGENT **** Build a list of elements passed as rootNode and don't revisit nodes already processed (prevent loops)
      // Does not return title or alt attribute values on the rootNode
      // TODO: Vet this with JAWS
      // TODO: How is this used? Getting the title and alt text isn't exactly displayable text. What should this function do? Do we need another one?
      // TODO: QA THIS, rethink this...
      // TODO: Gan we get this from Firefox? What about ARIA-label and other ARIA attribute?
      // How does display:none, visibility:hidden, and aria-hidden=true affect child text collection?
      
      var sNodeChildText = '',
          sRecursiveText = null,
          sRootBlockSpace = '',
          sBlockSpace = '',
          node,
          i;
      if (rootNode != null) {
        if (iRecursion == null) { 
          iRecursion = 0;
        }
        if (aElements==null) {
          aElements=[rootNode];
        } else {
          for (i=0;i<aElements.length;i++) {
            if (rootNode===aElements[i]) {
              return '';
            }
          }
          aElements.push(rootNode);
        }
        if (aStopElements==null) {
          aStopElements=['option'];
        }
        if(rootNode.nodeType==1 && /block/i.test(rootNode.ownerDocument.defaultView.getComputedStyle(rootNode, null).getPropertyValue('display'))) {
          sRootBlockSpace = ' ';
        }
        
        for (node = rootNode.firstChild; node != null; node = node.nextSibling) {
          if (node.nodeType == 1 || node.nodeType == 3) { // Only pay attention to element and text nodes
            if (node.tagName && ((node.contentWindow && node.contentWindow.document !== null) ||
                              (node.contentDocument && node.contentDocument.body !== null)) && blr.W15yQC.fnNodeIsHidden(node) == false) { // Found a frame
              // don't get frame contents, but instead check if it has an ARIA label content or a title attribute
              // TODO: ARIA LABEL CONTENT
              if (node.hasAttribute('title')) {
                sNodeChildText = blr.W15yQC.fnJoinNoClean(sNodeChildText, node.getAttribute('title'), ' ')+' ';
              }
            } else { // keep looking through current document
              if (node.nodeType == 3 && node.nodeValue != null) { // text content
                sNodeChildText = blr.W15yQC.fnJoinNoClean(sNodeChildText, node.nodeValue, '');
              }
              if (node.nodeType == 1 || node.nodeType == 3) {
                if (iRecursion < 100 && (node.nodeType!=1 || (((iRecursion>0 && aStopElements!=null) ? aStopElements.indexOf(node.tagName.toLowerCase()) : -1) < 0 && blr.W15yQC.fnNodeIsHidden(node) == false))) {
                  if(node.nodeType==1 && /block/i.test(node.ownerDocument.defaultView.getComputedStyle(node, null).getPropertyValue('display'))) {
                    sBlockSpace = ' ';
                  }
                  sRecursiveText = blr.W15yQC.fnGetEffectiveLabel(node, iRecursion + 1, aStopElements, aElements)[0];
                }
                if (sRecursiveText == null || (node.nodeType == 1 && blr.W15yQC.fnTrim(sRecursiveText).length == 0)) {
                  if (node.tagName != null && blr.W15yQC.fnCanTagHaveAlt(node.tagName) && node.hasAttribute('alt') == true) {
                    sRecursiveText = node.getAttribute('alt');
                  } else if (node.hasAttribute && node.hasAttribute('title')) {
                    sRecursiveText = node.getAttribute('title');
                  }
                }
                sNodeChildText = blr.W15yQC.fnJoinNoClean(sNodeChildText, sRecursiveText, sBlockSpace)+sBlockSpace;
                if(blr.W15yQC.fnStringHasContent(sRecursiveText)) { sBlockSpace=''; }
              }
            }
          }
        }

        sNodeChildText = sRootBlockSpace+sNodeChildText+sRootBlockSpace;
        if (iRecursion==0) {
          sNodeChildText = blr.W15yQC.fnCleanSpaces(sNodeChildText);
        }
      }

      return sNodeChildText;
    },

    fnElementUsesARIA: function (node) {
      var i, attrName;
      if(node.hasAttribute('role')) { return true; }
      for (i = 0; i < node.attributes.length; i++) {
        attrName = node.attributes[i].name.toLowerCase();
        if(attrName.match(/^aria-/) != null) { return true; }
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
            props : null,
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
            props : null,
            reqProps : null,
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
            props : null,
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
            reqProps : null,
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
            reqProps : null,
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
      var doc, sRole='',i, attrName, attrValue, attrValueLC, tagName, sMsg;
      if(node != null && node.hasAttribute) {
        if(node.hasAttribute('role')) {
          sRole = node.getAttribute('role').toLowerCase();
          sRole=sRole.replace(/^(\w+)\s.*$/, "$1");
        }
        doc=node.ownerDocument;
        tagName = node.tagName.toLowerCase();
        for (i = 0; i < node.attributes.length; i++) {
          attrName = node.attributes[i].name.toLowerCase();
          if(/^aria-/.test(attrName)) {
            attrValue = node.attributes[i].value;
            attrValueLC = attrValue.toLowerCase();
            switch(attrName) {
              case 'aria-activedescendant': // a single ID that is a descendant or logical descendant
                if(/^(combobox|grid|group|listbox|menu|menubar|radiogroup|row|rowgroup|tablist|textbox|toolbar|tree|treegrid)(\s.*)?$/.test(sRole)==false) {
                  if(blr.W15yQC.fnStringHasContent(sRole)) {
                    blr.W15yQC.fnAddNote(no, 'ariaAttributeWithUnexpectedRole', [attrName,tagName,sRole]); // TODO: QA This
                  } else {
                    blr.W15yQC.fnAddNote(no, 'ariaAttributeWithUnexpectedTag', [attrName,tagName]); // TODO: QA This
                  }
                }
                if(blr.W15yQC.fnStringHasContent(attrValue)) {
                  if(blr.W15yQC.fnIsValidHtmlID(attrValue)) {
                    sMsg = blr.W15yQC.fnListMissingIDs(doc, attrValue);
                    if(sMsg != null) {
                      if (/every id/i.test(sMsg)) {
                        sMsg=sMsg.replace(/\s?\(.*$/i,'');
                        blr.W15yQC.fnAddNote(no, 'ariaAttributesEveryIDDoesntExist', [attrName, sMsg]); // TODO: QA This
                      } else {
                        blr.W15yQC.fnAddNote(no, 'ariaAttributesIDsDontExist', [attrName, sMsg]); // TODO: QA This
                      }
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
                  if(blr.W15yQC.fnStringHasContent(sRole)) {
                    blr.W15yQC.fnAddNote(no, 'ariaAttributeWithUnexpectedRole', [attrName,tagName,sRole]); // TODO: QA This
                  } else {
                    blr.W15yQC.fnAddNote(no, 'ariaAttributeWithUnexpectedTag', [attrName,tagName]); // TODO: QA This
                  }
                }
                if(blr.W15yQC.fnStringHasContent(attrValue)==true && /^(inline|list|both|none)$/.test(attrValueLC)==false) {
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
                  if(blr.W15yQC.fnStringHasContent(sRole)) {
                    blr.W15yQC.fnAddNote(no, 'ariaAttributeWithUnexpectedRole', [attrName,tagName,sRole]); // TODO: QA This
                  } else {
                    blr.W15yQC.fnAddNote(no, 'ariaAttributeWithUnexpectedTag', [attrName,tagName]); // TODO: QA This
                  }
                }
                if(blr.W15yQC.fnStringHasContent(attrValue)==true && /^(true|false|mixed|undefined)$/.test(attrValueLC)==false) {
                  blr.W15yQC.fnAddNote(no, 'ariaAttributeValueInvalid', [attrValue, attrName,'true, false, mixed, undefined']); // TODO: QA This
                }
                break;
              case 'aria-controls':
                if(blr.W15yQC.fnStringHasContent(attrValue)) {
                  if(blr.W15yQC.fnIsValidHtmlIDList(attrValue)) {
                    sMsg = blr.W15yQC.fnListMissingIDs(doc, attrValue);
                    if(sMsg != null) {
                      if (/every id/i.test(sMsg)) {
                        sMsg=sMsg.replace(/\s?\(.*$/i,'');
                        blr.W15yQC.fnAddNote(no, 'ariaAttributesEveryIDDoesntExist', [attrName, sMsg]); // TODO: QA This
                      } else {
                        blr.W15yQC.fnAddNote(no, 'ariaAttributesIDsDontExist', [attrName, sMsg]); // TODO: QA This
                      }
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
                      if (/every id/i.test(sMsg)) {
                        sMsg=sMsg.replace(/\s?\(.*$/i,'');
                        blr.W15yQC.fnAddNote(no, 'ariaAttributesEveryIDDoesntExist', [attrName, sMsg]); // TODO: QA This
                      } else {
                        blr.W15yQC.fnAddNote(no, 'ariaAttributesIDsDontExist', [attrName, sMsg]); // TODO: QA This
                      }
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
                if(blr.W15yQC.fnStringHasContent(attrValue)==true && /^(copy|move|link|execute|popup|none)(\s+(copy|move|link|execute|popup|none))*$/.test(attrValueLC)==false) {
                  blr.W15yQC.fnAddNote(no, 'ariaAttributeWithInvalidValue', [attrValue,attrName,'copy, move, link, execute, popup, none']); // TODO: QA This
                }
                if(/none/.test(attrValueLC) && attrValueLC != 'none') {
                  sMsg=blr.W15yQC.fnCleanSpaces(attrValueLC.replace('none',''));
                  blr.W15yQC.fnAddNote(no, 'ariaAttributeValueDoesntMakeSenseWith', [sMsg, attrName, 'none']); // TODO: QA This
                }
                break;
              case 'aria-expanded': // (state)
                // TODO: Figure out how to determine if this is on the right element, or controlling the right element
                if(blr.W15yQC.fnStringHasContent(attrValue)==true && /^(true|false|undefined)$/.test(attrValueLC)==false) {
                  blr.W15yQC.fnAddNote(no, 'ariaAttributeValueInvalid', [attrValue, attrName,'true, false, undefined']); // TODO: QA This
                }
                break;
              case 'aria-flowto':
                // TODO: determine if we need to detect the path's name (name of target element)
                if(blr.W15yQC.fnStringHasContent(attrValue)) {
                  if(blr.W15yQC.fnIsValidHtmlIDList(attrValue)) {
                    sMsg = blr.W15yQC.fnListMissingIDs(doc, attrValue);
                    if(sMsg != null) {
                      if (/every id/i.test(sMsg)) {
                        sMsg=sMsg.replace(/\s?\(.*$/i,'');
                        blr.W15yQC.fnAddNote(no, 'ariaAttributesEveryIDDoesntExist', [attrName, sMsg]); // TODO: QA This
                      } else {
                        blr.W15yQC.fnAddNote(no, 'ariaAttributesIDsDontExist', [attrName, sMsg]); // TODO: QA This
                      }
                    }
                  } else {
                    blr.W15yQC.fnAddNote(no, 'ariaAttributeMustBeValidIDList', [attrName]); // TODO: QA This
                  }
                }
                break;
              case 'aria-grabbed': // (state)
                // TODO: Figure out how to determine if this is on the right element, or controlling the right element
                if(blr.W15yQC.fnStringHasContent(attrValue)==true && /^(true|false|undefined)$/.test(attrValueLC)==false) {
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
                if(blr.W15yQC.fnStringHasContent(attrValue)==false || /^(true|false|spelling|grammar)$/.test(attrValueLC)==false) {
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
                      if (/every id/i.test(sMsg)) {
                        sMsg=sMsg.replace(/\s?\(.*$/i,'');
                        blr.W15yQC.fnAddNote(no, 'ariaAttributesEveryIDDoesntExist', [attrName, sMsg]); // TODO: QA This
                      } else {
                        blr.W15yQC.fnAddNote(no, 'ariaAttributesIDsDontExist', [attrName, sMsg]); // TODO: QA This
                      }
                    }
                  } else {
                    blr.W15yQC.fnAddNote(no, 'ariaAttributeMustBeValidIDList', [attrName]); // TODO: QA This
                  }
                }
                break;
              case 'aria-level':
                if(blr.W15yQC.fnIsValidPositiveInt(attrValue)==false || parseInt(attrValue,10)<1) {
                  blr.W15yQC.fnAddNote(no, 'ariaAttrMustBePosIntOneOrGreater',[attrValue,attrName]); // TODO: QA This
                }
                break;
              case 'aria-live':
                if(blr.W15yQC.fnStringHasContent(attrValue)==true && /^(assertive|polite|off)$/.test(attrValueLC)==false) {
                  blr.W15yQC.fnAddNote(no, 'ariaAttributeValueInvalid', [attrValue, attrName,'assertive, polite, off']); // TODO: QA This
                }
                break;
              case 'aria-multiline':
                if(/^(textbox)$/.test(sRole)==false && /^(input|textarea)$/.test(tagName)==false) {
                  if(blr.W15yQC.fnStringHasContent(sRole)) {
                    blr.W15yQC.fnAddNote(no, 'ariaAttributeWithUnexpectedRole', [attrName,tagName,sRole]); // TODO: QA This
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
                if(blr.W15yQC.fnStringHasContent(attrValue)==true && /^(horizontal|vertical)$/.test(attrValueLC)==false) {
                  blr.W15yQC.fnAddNote(no, 'ariaAttributeValueInvalid', [attrValue, attrName,'horizontal, vertical']); // TODO: QA This
                }
                break;
              case 'aria-owns':
                if(blr.W15yQC.fnStringHasContent(attrValue)) {
                  if(blr.W15yQC.fnIsValidHtmlIDList(attrValue)) {
                    sMsg = blr.W15yQC.fnListMissingIDs(doc, attrValue);
                    if(sMsg != null) {
                      if (/every id/i.test(sMsg)) {
                        sMsg=sMsg.replace(/\s?\(.*$/i,'');
                        blr.W15yQC.fnAddNote(no, 'ariaAttributesEveryIDDoesntExist', [attrName, sMsg]); // TODO: QA This
                      } else {
                        blr.W15yQC.fnAddNote(no, 'ariaAttributesIDsDontExist', [attrName, sMsg]); // TODO: QA This
                      }
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
                if(blr.W15yQC.fnIsValidPositiveInt(attrValue)==false || parseInt(attrValue,10)<1) {
                  blr.W15yQC.fnAddNote(no, 'ariaAttrMustBePosIntOneOrGreater',[attrValue,attrName]); // TODO: QA This
                }
                break;
              case 'aria-pressed': // (state)
                if(/^(button)$/.test(sRole)==false && /^(button)$/.test(tagName)==false) {
                  if(blr.W15yQC.fnStringHasContent(sRole)) {
                    blr.W15yQC.fnAddNote(no, 'ariaAttributeWithUnexpectedRole', [attrName,tagName,sRole]); // TODO: QA This
                  } else {
                    blr.W15yQC.fnAddNote(no, 'ariaAttributeWithUnexpectedTag', [attrName,tagName]); // TODO: QA This
                  }
                }
                if(blr.W15yQC.fnStringHasContent(attrValue)==true && /^(true|false|mixed|undefined)$/.test(attrValueLC)==false) {
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
                if(blr.W15yQC.fnStringHasContent(attrValue)==true && /^(additions|removals|text|all)(\s+(additions|removals|text|all))*$/.test(attrValueLC)==false) {
                  blr.W15yQC.fnAddNote(no, 'ariaAttributeWithInvalidValue', [attrValue,attrName,'copy, move, link, execute, popup, none']); // TODO: QA This
                }
                if(/all/.test(attrValueLC) && attrValue != 'all') {
                  sMsg = blr.W15yQC.fnCleanSpaces(attrValueLC.replace('all',''));
                  blr.W15yQC.fnAddNote(no, 'ariaAttributeValueDoesntMakeSenseWith', [sMsg, attrName, 'all']); // TODO: QA This
                }
                break;
              case 'aria-required':
                if(/^(combobox|gridcell|listbox|radiogroup|spinbutton|textbox|tree)$/.test(sRole)==false && /^(input|textarea)$/.test(tagName)==false) {
                  if(blr.W15yQC.fnStringHasContent(sRole)) {
                    blr.W15yQC.fnAddNote(no, 'ariaAttributeWithUnexpectedRole', [attrName,tagName,sRole]); // TODO: QA This
                  } else {
                    blr.W15yQC.fnAddNote(no, 'ariaAttributeWithUnexpectedTag', [attrName,tagName]); // TODO: QA This
                  }
                }
                if(blr.W15yQC.fnStringHasContent(attrValue) && blr.W15yQC.fnStringIsTrueFalse(attrValue)==false) {
                  blr.W15yQC.fnAddNote(no, 'ariaAttributeMustBeTF', [attrValue, attrName]); // TODO: QA This
                }
                break;
              case 'aria-selected': // (state)
                if(blr.W15yQC.fnStringHasContent(attrValue)==true && /^(true|false|undefined)$/.test(attrValueLC)==false) {
                  blr.W15yQC.fnAddNote(no, 'ariaAttributeValueInvalid', [attrValue, attrName,'true, false, undefined']); // TODO QA This
                }
                break;
              case 'aria-setsize':
                if(blr.W15yQC.fnIsValidPositiveInt(attrValue)==false || parseInt(attrValue,10)<1) {
                  blr.W15yQC.fnAddNote(no, 'ariaAttrMustBePosIntOneOrGreater',[attrValue,attrName]); // TODO: QA This
                }
                break;
              case 'aria-sort':
                if(blr.W15yQC.fnStringHasContent(attrValue)==true && /^(ascending|descending|none|other)$/.test(attrValueLC)==false) {
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
                    if(blr.W15yQC.fnIsValidNumber(node.getAttribute('aria-valuemax'))==false) {
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
                break;
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
            if(node.hasAttribute(blr.W15yQC.ARIAChecks[sRole].reqProps[i])==false) { sMsg=blr.W15yQC.fnJoin(sMsg,blr.W15yQC.ARIAChecks[sRole].reqProps[i],', '); }
          }
        }
        if(sMsg != null) { blr.W15yQC.fnAddNote(no, 'ariaMissingProperties', [sMsg]); } // QA
        // Check validity of the ARIA- attributes
        // TODO: finish this

        // Check for required parents
        if(blr.W15yQC.ARIAChecks[sRole].container != null) {
          sMsg=null;
          bFoundRequiredContainer = false;
          c=node.parentNode;
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
            c=c.parentNode;
          }
          if(!bFoundRequiredContainer) {
            sMsg=null;
            for(i=0;i<blr.W15yQC.ARIAChecks[sRole].container.length;i++) {
              sMsg=blr.W15yQC.fnJoin(sMsg,blr.W15yQC.ARIAChecks[sRole].container[i],', ');
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

    fnIsValidARIARole: function(sRole) {
      if(sRole!=null) {
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
            return true;
            break;
        }
      }
      return false;
    },

    fnIsAbstractARIARole: function(sRole) {
      if(sRole!=null) {
        switch (sRole.toLowerCase()) {
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
            return true;
            break;
        }
      }
      return false;
    },

    fnAnalyzeARIAMarkupOnNode: function (node, no) {
      var sRole, sFirstRole, i, roles;
      if (node != null && node.hasAttribute) {
        if (node.hasAttribute('role')) {
          // TODO: check role values, check for multiple role values
          sRole = blr.W15yQC.fnTrim(node.getAttribute('role'));
          sFirstRole=sRole.replace(/^(\w+)\s.*$/, "$1");
          if (sRole != null && sRole.length > 0) {
            if(/[a-z][,\s]+[a-z]/i.test(sRole)) {
              blr.W15yQC.fnAddNote(no, 'ariaMultipleRoleValues'); // TODO: QA This
            }
            if (blr.W15yQC.fnStringHasContent(sRole)==true) {
              roles=sRole.split(' ');
              for (i=0;i<roles.length;i++) {
                if (i>0) {
                  blr.W15yQC.fnAddNote(no, 'ariaIgnoringRoleValue',[roles[i]]); // TODO: QA This
                }
                if(blr.W15yQC.fnIsValidARIARole(roles[i])==true) {
                  no = blr.W15yQC.fnCheckARIARole(no, node, roles[i]); // TODO: QA This
                } else if(blr.W15yQC.fnIsAbstractARIARole(roles[i])==true) {
                  blr.W15yQC.fnAddNote(no, 'ariaAbstractRole',[roles[i]]); // TODO: QA This
                } else {
                  blr.W15yQC.fnAddNote(no, 'ariaUnknownRole',[roles[i]]); // TODO: QA This
                }
              }
            }
          }
          if (sFirstRole=='heading' && node.hasAttribute('aria-level')==false) { // TODO: Create a check aria role routine
            blr.W15yQC.fnAddNote(no, 'ariaHeadingMissingAriaLevel');
          }
        }

        blr.W15yQC.fnGetARIAAttributeValueWarnings(no,node);
      }
      return no;
    },

    fnMakeTableSortable: function (node, doc, sTableId) {
      var script = doc.createElement('script');
      script.appendChild(doc.createTextNode('fnMakeTableSortable("' + sTableId + '");'));
      node.appendChild(script);
    },

    fnInitDisplayWindow: function (windowURL, reportDoc, bQuick) {
      var topNav, topNavLI, topNavA, topNavSpan, outputWindow, bannerDiv, bannerH1, styleRules, styleElement, scriptElement, sScript, contentMeta, genMeta;

      if(reportDoc == null) {
        outputWindow = window.open('');
        if(outputWindow && outputWindow.document) reportDoc = outputWindow.document;
      }

      contentMeta = reportDoc.createElement('meta');
      contentMeta.setAttribute('name','generator');
      if(bQuick==true) {
          contentMeta.setAttribute('content','W15yQC Web Accessibility Quick Check');
          reportDoc.title = blr.W15yQC.fnGetString('hrsQuickReport', [windowURL]);
        } else {
          contentMeta.setAttribute('content','W15yQC Web Accessibility Full Check');
          reportDoc.title = blr.W15yQC.fnGetString('hrsFullReport', [windowURL]);
        }

      genMeta = reportDoc.createElement('meta');
      genMeta.setAttribute('http-equiv','Content-Type');
      genMeta.setAttribute('content','text/html; charset=utf-8');
      reportDoc.head.appendChild(contentMeta);
      reportDoc.head.appendChild(genMeta);

      bannerDiv = reportDoc.createElement('div');
      bannerDiv.setAttribute('id', 'banner');
      bannerDiv.setAttribute('role', 'banner');
      bannerH1 = reportDoc.createElement('h1');
      if (bQuick==true) {
        bannerH1.appendChild(reportDoc.createTextNode(blr.W15yQC.fnGetString('hrsBannerQuick')));
      } else {
        bannerH1.appendChild(reportDoc.createTextNode(blr.W15yQC.fnGetString('hrsBannerFull')));
      }
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
      styleRules += "div.ariaEl { margin: inherit !important; padding: inherit !important; min-width: inherit !important; border: none !important; box-shadow: none !important;}";
      styleRules += ".AISection div { margin: 5px 20px 20px 20px; padding: 4px; min-width: 480px; border: 1px solid #CCCCCC; box-shadow: 0 1px 0 #FFFFFF inset;}";
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
      sScript += "function collapseAll() {var nodesList=document.getElementsByClassName('ec');for(var i=0;i<nodesList.length;i++){;nodesList[i].parentNode.setAttribute('class','hideSibling')}}";
      sScript += "function expandAll() {var nodesList=document.getElementsByClassName('ec');for(var i=0;i<nodesList.length;i++){;nodesList[i].parentNode.setAttribute('class','')}}";
      sScript += "function fnToggleDisplayOfNonIssues(){var a=document.getElementById('displayToggle');var b=document.getElementsByTagName('tr');if(/"+blr.W15yQC.fnGetString('hrsShowIssuesOnly')+"/.test(a.innerHTML)==true){a.innerHTML='"+blr.W15yQC.fnGetString('hrsShowAll')+"';if(b!=null&&b.length>1&&b[0].getElementsByTagName){for(var c=0;c<b.length;c++){if(/warning|failed/.test(b[c].className)!=true){var d=b[c].getElementsByTagName('th');if(d==null||d.length<1){b[c].setAttribute('style','display:none')}}}}}else{a.innerHTML='"+blr.W15yQC.fnGetString('hrsShowIssuesOnly')+"';if(b!=null&&b.length>1&&b[0].getElementsByTagName){for(var c=0;c<b.length;c++){if(b[c].getAttribute('style')=='display:none'){b[c].setAttribute('style','')}}}}}";
      sScript += "var sortData = function(originalRowNumber, columnData) {this.originalRowNumber = originalRowNumber;this.columnData = columnData;};";
      sScript += "sortData.prototype = {originalRowNumber: null,columnData: null};";
      sScript += "function fnMakeTableSortable(sTableID) {if(sTableID != null){var table = document.getElementById(sTableID);if(table != null && table.getElementsByTagName){var tableHead = table.getElementsByTagName('thead')[0];if(tableHead != null && tableHead.getElementsByTagName) {var tableHeaderCells = tableHead.getElementsByTagName('th'); if(tableHeaderCells != null) { for(var i=0; i<tableHeaderCells.length; i++) { var newTh = tableHeaderCells[i].cloneNode(false); newTh.innerHTML = '<a href=\"javascript:sortTable=\\''+sTableID+'\\';sortCol=\\''+i+'\\';\" onclick=\"fnPerformStableTableSort(\\''+sTableID+'\\','+i+');return false;\">'+tableHeaderCells[i].innerHTML+'</a>'; tableHeaderCells[i].parentNode.replaceChild(newTh, tableHeaderCells[i]); }}}}}}";
      sScript += "function fnPerformStableTableSort(tableID,sortOnColumnNumber){try{if(tableID!=null&&sortOnColumnNumber!=null){var table=document.getElementById(tableID);if(table!=null&&table.getElementsByTagName){var tableHead=table.getElementsByTagName('thead')[0];var tableBody=table.getElementsByTagName('tbody')[0];if(tableBody!=null&&tableBody.getElementsByTagName){var tableBodyRows=tableBody.getElementsByTagName('tr');if(tableBodyRows!=null&&tableBodyRows.length>1&&tableBodyRows[0].getElementsByTagName){var sortOrder='a';var columnHeaders=tableHead.getElementsByTagName('th');var sortColumnHeader=columnHeaders[sortOnColumnNumber];var currentSortIndicatorMatch=/\\bSorted...(\\d+)\\b/.exec(sortColumnHeader.className);var currentSortDepth=999;if(currentSortIndicatorMatch!=null&&currentSortIndicatorMatch.length>1){currentSortDepth=parseInt(currentSortIndicatorMatch[1],10);}if(/\\bSortedAsc/.test(sortColumnHeader.className)== true){sortOrder='d';sortColumnHeader.className=sortColumnHeader.className.replace(/\\bSortedAsc\\d+\\b/,'SortedDes1');}else if(/\\bSortedDes/.test(sortColumnHeader.className)== true){sortOrder='a';sortColumnHeader.className=sortColumnHeader.className.replace(/\\bSortedDes\\d+\\b/,'SortedAsc1');}else{sortOrder='a';sortColumnHeader.className += ' SortedAsc1';}for(var i=0;i<columnHeaders.length;i++){if(i==sortOnColumnNumber)continue;var sortIndicatorMatch=/\\bSorted(...)(\\d+)/.exec(columnHeaders[i].className);if(sortIndicatorMatch!=null){var sortDepth=999;if(sortIndicatorMatch!=null&&sortIndicatorMatch.length>1){sortDepth=parseInt(sortIndicatorMatch[2],10);}if(sortDepth<=currentSortDepth){columnHeaders[i].className=columnHeaders[i].className.replace(/\\bSorted...\\d+\\b/,'Sorted'+sortIndicatorMatch[1]+(sortDepth+1));}}}var tableRowsSortDataCache=[];var numberOfColumns=0;for(var i=0;i<tableBodyRows.length;i++){var rowDataCells=tableBodyRows[i].getElementsByTagName('td');tableRowsSortDataCache.push(new sortData(i,(/^\\s*\\d+\\s*$/.test(rowDataCells[sortOnColumnNumber].innerHTML)==true?parseInt(rowDataCells[sortOnColumnNumber].innerHTML,10):rowDataCells[sortOnColumnNumber].innerHTML)));}if(sortOrder=='a'){for(var i=0;i<tableRowsSortDataCache.length;i++){for(var j=i+1;j<tableRowsSortDataCache.length;j++){if(tableRowsSortDataCache[i].columnData.toLowerCase()>tableRowsSortDataCache[j].columnData.toLowerCase() ||(tableRowsSortDataCache[i].columnData.toLowerCase()==tableRowsSortDataCache[i].columnData.toLowerCase()&&tableRowsSortDataCache[i].originalRowNumber>tableRowsSortDataCache[j].originalRowNumber)){var tmpRow=tableRowsSortDataCache[i];tableRowsSortDataCache[i]=tableRowsSortDataCache[j];tableRowsSortDataCache[j]=tmpRow;}}}}else{for(var i=0;i<tableRowsSortDataCache.length;i++){for(var j=i+1;j<tableRowsSortDataCache.length;j++){if(tableRowsSortDataCache[i].columnData.toLowerCase()<tableRowsSortDataCache[j].columnData.toLowerCase() ||(tableRowsSortDataCache[i].columnData.toLowerCase()==tableRowsSortDataCache[i].columnData.toLowerCase()&&tableRowsSortDataCache[i].originalRowNumber>tableRowsSortDataCache[j].originalRowNumber)){var tmpRow=tableRowsSortDataCache[i];tableRowsSortDataCache[i]=tableRowsSortDataCache[j];tableRowsSortDataCache[j]=tmpRow;}}}}var sortedTBody=document.createElement('tbody');for(var i=0;i<tableRowsSortDataCache.length;i++){sortedTBody.appendChild(tableBodyRows[tableRowsSortDataCache[i].originalRowNumber].cloneNode(true));}table.replaceChild(sortedTBody,tableBody);}}}}}catch(ex){}}";
      sScript += "document.addEventListener('keypress',function(e){if(e.which==104){e.stopPropagation();e.preventDefault();scrollToNextHeading()}else if(e.which==72){e.stopPropagation();e.preventDefault();scrollToPreviousHeading()}},false);function scrollToNextHeading(){var ae=document.activeElement,aH2s=document.getElementsByTagName('h2');var bMadeJump=false;if(ae != null && ae.parentNode && ae.parentNode.tagName && ae.parentNode.tagName.toLowerCase()=='h2'){ae=ae.parentNode;}if(aH2s[aH2s.length-1]===ae){bMadeJump=true;}for(var i=0;i<aH2s.length-1;i++){if(aH2s[i]===ae){aH2s[i+1].scrollIntoView(true);aH2s[i+1].focus();var a=aH2s[i+1].getElementsByTagName('a');if(a!=null)a[0].focus();bMadeJump=true;break}}if(bMadeJump==false){for(var i=0;i<aH2s.length;i++){if(nodeY(aH2s[i])>window.scrollY){aH2s[i].scrollIntoView(true);aH2s[i].focus();var a=aH2s[i].getElementsByTagName('a');if(a!=null)a[0].focus();break}}}}function scrollToPreviousHeading(){var ae=document.activeElement,aH2s=document.getElementsByTagName('h2');var bMadeJump=false;if(ae != null && ae.parentNode && ae.parentNode.tagName && ae.parentNode.tagName.toLowerCase()=='h2'){ae=ae.parentNode;}if(aH2s[0]===ae){bMadeJump=true;}for(var i=1;i<aH2s.length;i++){if(aH2s[i]===ae){aH2s[i-1].scrollIntoView(true);aH2s[i-1].focus();var a=aH2s[i-1].getElementsByTagName('a');if(a!=null)a[0].focus();bMadeJump=true;break}}if(bMadeJump==false){var previousElement=document.body;for(var i=0;i<aH2s.length;i++){if(nodeY(aH2s[i])>=window.scrollY){previousElement.scrollIntoView(true);previousElement.focus();var a=previousElement.getElementsByTagName('a');if(a!=null)a[0].focus();break}previousElement=aH2s[i]}}}function nodeY(node){var y=node.offsetTop;while(node.offsetParent!=null&&node.offsetParent!=node.ownerDocument){node=node.offsetParent;y+=node.offsetTop}return y}";
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
      p.appendChild(rd.createTextNode(blr.W15yQC.fnGetString('hrsFooter',[blr.W15yQC.releaseVersion])));
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
    fnMakeHeadingCountsString: function (listObj, keyPlural, keyNone, bOnlyListed) {
      var sDocumentsSectionHeading='', s='', i, iListedCount=0, bHasListedFeature=false, iListedWarningsCount=0, iListedFailuresCount=0,
          iDisplayedCount, iDisplayedWarningsCount, iDisplayedFailuresCount;

      if(bOnlyListed==null) { bOnlyListed=false; }

      if(listObj!=null && listObj.length>0 && listObj[0].hasOwnProperty('listedByAT')==true) {
        bHasListedFeature=true;
        for(i=0;i<listObj.length;i++) {
          if(listObj[i].listedByAT != false) {
            iListedCount++;
            if(listObj[i].failed==true) { iListedFailuresCount++; }
            if(listObj[i].warning==true) { iListedWarningsCount++; }
          }
        }
      }

      if(bOnlyListed==true && bHasListedFeature==true) {
        iDisplayedCount=iListedCount;
        iDisplayedWarningsCount=iListedWarningsCount;
        iDisplayedFailuresCount=iListedFailuresCount;
        if(listObj!=null && listObj.pageLevel) {
          if(listObj.pageLevel.failed) {
            iDisplayedFailuresCount++;
          } else if(listObj.pageLevel.warning) {
            iDisplayedWarningsCount++;
          }
        }
      } else {
        iDisplayedCount=listObj==null?0:listObj.length;
        iDisplayedWarningsCount=(listObj==null)?0:listObj.warningCount;
        iDisplayedFailuresCount=(listObj==null)?0:listObj.failedCount;
      }
      
      if(listObj!=null && (iDisplayedWarningsCount>0 || iDisplayedFailuresCount>0)) {
        try{
          if(iDisplayedWarningsCount==1) {
            s=' (1 with warning, ';
          } else {
            s=' ('+iDisplayedWarningsCount.toString()+' with warnings, '; // TODO: i18n this!
          }
          if(iDisplayedFailuresCount==1) {
            s=s+'1 failure)';
          } else {
            s=s+iDisplayedFailuresCount.toString()+' with failures)';
          }
        }
        catch(ex){ s='FAILED'+ex.toString();}
      }
      if (listObj && iDisplayedCount > 0) {
        if(bHasListedFeature==true && iListedCount<listObj.length && bOnlyListed!=true) {
          sDocumentsSectionHeading = blr.W15yQC.fnGetString(keyPlural) + ': ' + iDisplayedCount.toString()+ ' ('+iListedCount.toString()+' listed)';
        } else {
          sDocumentsSectionHeading = blr.W15yQC.fnGetString(keyPlural) + ': ' + iDisplayedCount.toString();
        }
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
      var c, frameTitle, frameSrc, frameId, frameName, role, xPath, nodeDescription, frameDocument, aLabel, effectiveLabel, effectiveLabelSource;
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
              aLabel=blr.W15yQC.fnGetEffectiveLabel(node);
              effectiveLabel=aLabel[0];
              effectiveLabelSource=aLabel[1];
              nodeDescription = blr.W15yQC.fnDescribeElement(c, 400);
              aFramesList.push(new blr.W15yQC.frameElement(c, xPath, nodeDescription, doc, aFramesList.length, role, frameId, frameName, frameTitle, effectiveLabel, effectiveLabelSource, frameSrc));
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

    fnAnalyzeFrameTitles: function (oW15yResults) {
      var i, framedDocumentBody, j, aFramesList=oW15yResults.aFrames, aDocumentsList=oW15yResults.aDocuments;

      oW15yResults.PageScore.bAllFramesHaveTitles=true;

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
          oW15yResults.PageScore.bAllFramesHaveTitles=false;
          blr.W15yQC.fnAddNote(aFramesList[i], 'frameTitleMissing'); // QA iframeTests01.html
        } else if (aFramesList[i].title != null && aFramesList[i].title.length > 0) {
          if (blr.W15yQC.fnOnlyASCIISymbolsWithNoLettersOrDigits(aFramesList[i].title)) {
            oW15yResults.PageScore.bAllFramesHaveTitles=false;
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
          oW15yResults.PageScore.bAllFramesHaveTitles=false;
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

    fnDisplayWindowDetails: function (rd, oW15yQCReport) {
      var div, div2, element, sWindowTitle, sWindowURL, sMainDocType, sMainDocTypeDesc='';
      div = rd.createElement('div');
      div.setAttribute('id', 'AIDocumentDetails');
      div.setAttribute('class', 'AISection');
      blr.W15yQC.fnAppendExpandContractHeadingTo(div, blr.W15yQC.fnGetString('hrsWindowDetails'));
      div2 = rd.createElement('div');
      element = rd.createElement('h3');
      element.appendChild(rd.createTextNode(blr.W15yQC.fnGetString('hrsWindowTitle')));
      div2.appendChild(element);

      if(oW15yQCReport != null) {
        sWindowTitle = oW15yQCReport.sWindowTitle;
        sWindowURL = oW15yQCReport.sWindowURL;
        sMainDocType= blr.W15yQC.fnGetDoctypeString(oW15yQCReport.aDocuments[0].doc);
      } else {
        sWindowTitle = window.top.content.document.title;
        sWindowURL = window.top.content.document.URL;
        sMainDocType= blr.W15yQC.fnGetDoctypeString(window.top.content.document);
      }

      element = rd.createElement('p');
      element.appendChild(rd.createTextNode(sWindowTitle));
      div2.appendChild(element);

      element = rd.createElement('h3');
      element.appendChild(rd.createTextNode(blr.W15yQC.fnGetString('hrsWindowURL')));
      div2.appendChild(element);

      element = rd.createElement('p');
      element.appendChild(rd.createTextNode(sWindowURL));
      div2.appendChild(element);

      element = rd.createElement('h3');
      switch (sMainDocType) {
        case '<!DOCTYPE html>':
          sMainDocTypeDesc='HTML5';
          break;
        case '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">':
          sMainDocTypeDesc='XHTML 1.0 Strict';
          break;
        case '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">':
          sMainDocTypeDesc='XHTML 1.0 Transitional';
          break;
        case '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Frameset//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-frameset.dtd">':
          sMainDocTypeDesc='XHTML 1.0 Frameset';
          break;
        case '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">':
          sMainDocTypeDesc='XHTML 1.1';
          break;
        case '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML Basic 1.1//EN" "http://www.w3.org/TR/xhtml-basic/xhtml-basic11.dtd">':
          sMainDocTypeDesc='XHTML Basic 1.1';
          break;
        case '<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">':
          sMainDocTypeDesc='HTML 4.01 Strict';
          break;
        case '<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">':
          sMainDocTypeDesc='HTML 4.01 Transitional';
          break;
        case '<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Frameset//EN" "http://www.w3.org/TR/html4/frameset.dtd">':
          sMainDocTypeDesc='HTML 4.01 Frameset';
          break;
        case '<!DOCTYPE math PUBLIC "-//W3C//DTD MathML 2.0//EN" "http://www.w3.org/Math/DTD/mathml2/mathml2.dtd">':
          sMainDocTypeDesc='MathML 2.0';
          break;
        case '<!DOCTYPE math SYSTEM "http://www.w3.org/Math/DTD/mathml1/mathml.dtd">':
          sMainDocTypeDesc='MathML 1.01';
          break;
        case '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1 plus MathML 2.0 plus SVG 1.1//EN" "http://www.w3.org/2002/04/xhtml-math-svg/xhtml-math-svg.dtd">':
          sMainDocTypeDesc='XHTML+MathML+SVG';
          break;
        case '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1 plus MathML 2.0 plus SVG 1.1//EN" "http://www.w3.org/2002/04/xhtml-math-svg/xhtml-math-svg.dtd">':
          sMainDocTypeDesc='XHTML+MathML+SVG Profile (XHTML As the Host Language)';
          break;
        case '<!DOCTYPE svg:svg PUBLIC "-//W3C//DTD XHTML 1.1 plus MathML 2.0 plus SVG 1.1//EN" "http://www.w3.org/2002/04/xhtml-math-svg/xhtml-math-svg.dtd">':
          sMainDocTypeDesc='XHTML+MathML+SVG Profile (SVG As the Host Language)';
          break;
        case '<!DOCTYPE html PUBLIC "-//IETF//DTD HTML 2.0//EN">':
          sMainDocTypeDesc='HTML 2.0';
          break;
        case '<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 3.2 Final//EN">':
          sMainDocTypeDesc='HTML 3.2';
          break;
        case '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML Basic 1.0//EN" "http://www.w3.org/TR/xhtml-basic/xhtml-basic10.dtd">':
          sMainDocTypeDesc='XHTML Basic 1.0';
          break;
        case '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">':
          sMainDocTypeDesc='SVG 1.1 Full';
          break;
        case '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.0//EN" "http://www.w3.org/TR/2001/REC-SVG-20010904/DTD/svg10.dtd">':
          sMainDocTypeDesc='SVG 1.0';
          break;
        case '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1 Basic//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11-basic.dtd">':
          sMainDocTypeDesc='SVG 1.1 Basic';
          break;
        case '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1 Tiny//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11-tiny.dtd">':
          sMainDocTypeDesc='SVG 1.1 Tiny';
          break;
        case '':
          sMainDocTypeDesc='Missing';
          break;
        default:
          sMainDocTypeDesc='Unrecognized';
          break;
      }
      element.appendChild(rd.createTextNode(blr.W15yQC.fnGetString('hrsMainDocType')+' ('+sMainDocTypeDesc+')'));
      div2.appendChild(element);

      element = rd.createElement('p');
      element.appendChild(rd.createTextNode(sMainDocType));
      div2.appendChild(element);
      
      div.appendChild(div2);
      rd.body.appendChild(div);
    },

    fnDisplayFrameTitleResults: function (rd, aFramesList, bQuick) {
      var div, table, msgHash, tbody, i, sNotes, sClass;
      div = rd.createElement('div');
      div.setAttribute('id', 'AIFramesList');
      div.setAttribute('class', 'AISection');

      blr.W15yQC.fnAppendExpandContractHeadingTo(div, blr.W15yQC.fnMakeHeadingCountsString(aFramesList, 'hrsFrames', 'hrsNoFrames'));

      if (aFramesList && aFramesList.length > 0) {
        table = rd.createElement('table');
        table.setAttribute('id', 'AIFramesTable');

        if (bQuick==true) {
          table = blr.W15yQC.fnCreateTableHeaders(table, [blr.W15yQC.fnGetString('hrsTHNumberSym'), blr.W15yQC.fnGetString('hrsTHEffectiveLabel'), blr.W15yQC.fnGetString('hrsTHNotes')]);
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
            blr.W15yQC.fnAppendTableRow(tbody, [i + 1, aFramesList[i].effectiveLabel, sNotes], sClass);
          }
        } else {
          table = blr.W15yQC.fnCreateTableHeaders(table, [blr.W15yQC.fnGetString('hrsTHNumberSym'), blr.W15yQC.fnGetString('hrsTHFrameElement'),
                                                              blr.W15yQC.fnGetString('hrsTHOwnerDocNumber'), blr.W15yQC.fnGetString('hrsTHContainsDocNumber'),
                                                              blr.W15yQC.fnGetString('hrsTHEffectiveLabel'), blr.W15yQC.fnGetString('hrsTHEffectiveLabelSource'),
                                                              blr.W15yQC.fnGetString('hrsTHSrc'), blr.W15yQC.fnGetString('hrsTHNotes')]);
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
            blr.W15yQC.fnAppendTableRow(tbody, [i + 1, blr.W15yQC.fnMakeWebSafe(aFramesList[i].nodeDescription), aFramesList[i].ownerDocumentNumber, aFramesList[i].containsDocumentNumber, aFramesList[i].effectiveLabel, aFramesList[i].effectiveLabelSource, aFramesList[i].src, sNotes], sClass);
          }
        }

        table.appendChild(tbody);
        div.appendChild(table);
        blr.W15yQC.fnMakeTableSortable(div, rd, 'AIFramesTable');

      } else {
        blr.W15yQC.fnAppendPElementTo(div, blr.W15yQC.fnGetString('hrsNoFramesDetected'));
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

    fnAddLangValue: function(docListObj, node) {
      var i,found=false, langValue, hadAttribute=false;

      if(node && node.hasAttribute) {
        if(node.hasAttribute('lang')) {
          hadAttribute=true;
          langValue=node.getAttribute('lang');
          if(node.hasAttribute('xml:lang') && langValue != node.getAttribute('xml:lang')) docListObj.hasLangConflict=true;
        }
        if(!blr.W15yQC.fnStringHasContent(langValue) && node.hasAttribute('xml:lang')) {
          hadAttribute=true;
          langValue=node.getAttribute('xml:lang');
        }
      }
      if(hadAttribute) {
        for(i=0;i<docListObj.validLangValues.length;i++) {
          if(docListObj.validLangValues[i]==langValue) {
            found=true;
            break;
          }
        }
        for(i=0;i<docListObj.invalidLangValues.length;i++) {
          if(docListObj.invalidLangValues[i]==langValue) {
            found=true;
            break;
          }
        }
        if(!found) {
          if(blr.W15yQC.fnIsValidLocale(langValue)) {
            docListObj.validLangValues.push(langValue);
          } else {
            docListObj.invalidLangValues.push(langValue);
          }
        }
      }
    },

    /*
     * TODO: Why are so many sTagName==X contained in an if sRole has content if block? Are the checks really being made?
     * Optimize this:
     *   parameter passing for config values instead of reading application prefs for each element
     *   elimindate redundant element checks (node.tagName, etc.)
     *   Handle inherited aria-role values and determine if they block current role
     *   Handle role="presentation" and see if that should make the element "hidden" or not (how to keep presentation role elements out of lists?)
     *
     */
    fnGetElements: function (doc, progressWindow, total, rootNode, oW15yResults, ARIAElementStack, ARIALandmarkLevel, inTable, bInScript, sInheritedRoles, nestingDepth) {
      var docNumber, node, sID, idCount, frameDocument, style, i, sSectioningElements='',
        sARIALabel, sRole, sFirstRole, sTagName, bFoundHeading, headingLevel, xPath, nodeDescription, sAnnouncedAs, el,
        text, title, target, href, sState, effectiveLabel, effectiveLabelSource, box, width, height, alt, src, sXPath, sFormDescription, sFormElementDescription, ownerDocumentNumber,
        sName, sAction, sMethod, parentFormNode, sTitle, sLegendText, sLabelTagText, sEffectiveLabelText, sARIADescriptionText, sStateDescription, sValue, frameTitle,
        frameSrc, frameId, frameName, tableSummary, i, accessKey, aLabel, controlType, bAddedARIARole=false, sPreviousInheritedRoles='',
        bIncludeLabelControls = Application.prefs.getValue('extensions.W15yQC.getElements.includeLabelElementsInFormControls',false);

      if (doc != null) {
        sPreviousInheritedRoles=sInheritedRoles;
        bAddedARIARole=false;
        if (oW15yResults == null) {
          blr.W15yQC.fnDoEvents(); // This one is magical. Leave it in place!
          total=doc.getElementsByTagName('a').length+
            doc.getElementsByTagName('h1').length+
            doc.getElementsByTagName('h2').length+
            doc.getElementsByTagName('h3').length+
            doc.getElementsByTagName('h4').length+
            doc.getElementsByTagName('h5').length+
            doc.getElementsByTagName('h6').length;
          for (i=0;i<doc.defaultView.frames.length;i++) {
            total=total+doc.defaultView.frames[i].document.getElementsByTagName('a').length+
              doc.defaultView.frames[i].document.getElementsByTagName('h1').length+
              doc.defaultView.frames[i].document.getElementsByTagName('h2').length+
              doc.defaultView.frames[i].document.getElementsByTagName('h3').length+
              doc.defaultView.frames[i].document.getElementsByTagName('h4').length+
              doc.defaultView.frames[i].document.getElementsByTagName('h5').length+
              doc.defaultView.frames[i].document.getElementsByTagName('h6').length;
          }
          blr.W15yQC.fnReadUserPrefs();
          oW15yResults = new blr.W15yQC.W15yResults();
          oW15yResults.iTextSize=0;
          ARIALandmarkLevel=0;
          sInheritedRoles='';
          bAddedARIARole=false;
          bInScript=false;
          sPreviousInheritedRoles='';
          oW15yResults.PageScore=new blr.W15yQC.PageScore();
          oW15yResults.PageScore.bAllContentContainedInLandmark=true;
          oW15yResults.PageScore.bUsesARIABesidesLandmarks=false;
          oW15yResults.PageScore.bAllIDsAreUnique=true;
          // Put the top window's document in the list
          title=null;
          el=null;
          if (doc.head!=null) {
            el=doc.head.getElementsByTagName('TITLE');
            if (el!=null) {
              if (typeof el[0] != 'undefined') {
                title=blr.W15yQC.fnTrim(doc.title+'');
              }
            }
          }
          oW15yResults.aDocuments.push(new blr.W15yQC.documentDescription(doc, doc.URL, oW15yResults.aDocuments.length, title, blr.W15yQC.fnGetDocumentLanguage(doc), blr.W15yQC.fnGetDocumentDirection(doc), doc.compatMode, blr.W15yQC.fnGetDocType(doc)));
          if(doc.body!=null) {
            blr.W15yQC.fnAddLangValue(oW15yResults.aDocuments[oW15yResults.aDocuments.length-1],doc.body);
            if(doc.body.parentNode != null) {
              blr.W15yQC.fnAddLangValue(oW15yResults.aDocuments[oW15yResults.aDocuments.length-1],doc.body.parentNode);
            }
          }
          oW15yResults.sWindowTitle = doc.title;
          oW15yResults.sWindowURL = doc.URL;
          oW15yResults.dDateChecked = Date.now();
          ARIAElementStack = [];
        }

        if (rootNode == null) { rootNode = doc.body; }
        if (rootNode != null && rootNode.firstChild != null) {
          // is this necessary to do for each element? looks like it takes some time! When does this change?
          for (i = 0; i < oW15yResults.aDocuments.length; i++) {
            if (doc === oW15yResults.aDocuments[i].doc) {
              docNumber = i;
              break;
            }
          }

          for (node = rootNode.firstChild; node != null; node = node.nextSibling) {
            bInScript=false;
            if (node.localName==='script' || bInScript==true) { // Don't dig into script content
              bInScript=true;
            } else {
              bAddedARIARole=false;
              sRole=null;
              if (node.nodeType == 1 && node.tagName && node.hasAttribute) { // Only pay attention to element nodes
                style = window.getComputedStyle(node, null);
                if(style!=null) {
                  if(/justify/i.test(style.getPropertyValue('text-align'))) {
                    oW15yResults.aDocuments[docNumber].hasFullJustifiedText=true;
                  }
                }
  
                if (node.hasAttribute('id') == true) {
                  sID = blr.W15yQC.fnTrim(node.getAttribute('id'));
                  idCount = 1;
                  if(oW15yResults.aDocuments[docNumber].idHashTable.hasItem(sID)) {
                    idCount = oW15yResults.aDocuments[docNumber].idHashTable.getItem(sID)+1;
                    oW15yResults.PageScore.bAllIDsAreUnique=false;
                    oW15yResults.aDocuments[docNumber].IDsUnique = false;
                    if(idCount == 2) {
                      if(oW15yResults.aDocuments[docNumber].nonUniqueIDs.length<5) {
                        oW15yResults.aDocuments[docNumber].nonUniqueIDs.push(sID);
                      }
                      oW15yResults.aDocuments[docNumber].nonUniqueIDsCount++;
                    }
                  }
                  oW15yResults.aDocuments[docNumber].idHashTable.setItem(sID, idCount);
                  if(blr.W15yQC.fnIsValidHtmlID(sID) == false) {
                    oW15yResults.aDocuments[docNumber].IDsValid = false;
                    if(idCount < 2 && oW15yResults.aDocuments[docNumber].invalidIDs.length<5) {
                      oW15yResults.aDocuments[docNumber].invalidIDs.push(sID);
                      oW15yResults.aDocuments[docNumber].invalidIDsCount++;
                    }
                  }
                }
                blr.W15yQC.fnAddLangValue(oW15yResults.aDocuments[docNumber],node);
  
                if (((node.contentWindow && node.contentWindow.document !== null) || (node.contentDocument && node.contentDocument.body !== null)) && blr.W15yQC.fnNodeIsHidden(node) == false) { // Found a frame
                  // document the frame
                  frameTitle = blr.W15yQC.fnGetNodeAttribute(node, 'title', null);
                  frameSrc = blr.W15yQC.fnGetNodeAttribute(node, 'src', null);
                  frameId = blr.W15yQC.fnGetNodeAttribute(node, 'id', null);
                  frameName = blr.W15yQC.fnGetNodeAttribute(node, 'name', null);
                  sRole = blr.W15yQC.fnGetNodeAttribute(node, 'role', null);
                  xPath = blr.W15yQC.fnGetElementXPath(node);
                  nodeDescription = blr.W15yQC.fnDescribeElement(node, 400);
                  aLabel=blr.W15yQC.fnGetEffectiveLabel(node);
                  effectiveLabel=aLabel[0];
                  effectiveLabelSource=aLabel[1];
  
                  oW15yResults.aFrames.push(new blr.W15yQC.frameElement(node, xPath, nodeDescription, doc, oW15yResults.aFrames.length, sRole, frameId, frameName, frameTitle, effectiveLabel, effectiveLabelSource, frameSrc));
                  oW15yResults.aFrames[oW15yResults.aFrames.length-1].ownerDocumentNumber=docNumber+1;
                  // Document the new document
                  frameDocument = node.contentWindow ? node.contentWindow.document : node.contentDocument;
                  // TODO: for blank/missing src attributes on frames, should this blank out the URL? Right now it reports the parent URL
                  title=null;
                  el=null;
                  if (frameDocument.head!=null) {
                    el=frameDocument.head.getElementsByTagName('TITLE');
                    if (el!=null) {
                      if (typeof el[0] != 'undefined') {
                        title=blr.W15yQC.fnTrim(frameDocument.title+'');
                      }
                    }
                  }
                  oW15yResults.aDocuments.push(new blr.W15yQC.documentDescription(frameDocument, frameDocument.URL, oW15yResults.aDocuments.length, title, blr.W15yQC.fnGetDocumentLanguage(frameDocument), blr.W15yQC.fnGetDocumentDirection(frameDocument), doc.compatMode, blr.W15yQC.fnGetDocType(frameDocument)));
                  oW15yResults.aDocuments[oW15yResults.aDocuments.length-1].ownerDocumentNumber=docNumber+1;
                  if(frameDocument && frameDocument.body) { blr.W15yQC.fnAddLangValue(oW15yResults.aDocuments[oW15yResults.aDocuments.length-1],frameDocument.body); }
                  if(frameDocument && frameDocument.body && frameDocument.body.parentNode) { blr.W15yQC.fnAddLangValue(oW15yResults.aDocuments[oW15yResults.aDocuments.length-1],frameDocument.body.parentNode); }
  
                  // get frame contents
                  blr.W15yQC.fnGetElements(frameDocument, progressWindow, total, frameDocument.body, oW15yResults, ARIAElementStack, ARIALandmarkLevel, inTable, bInScript, '', nestingDepth);
                } else { // Not a new frame
                  bAddedARIARole=false;
                  sRole='';
                  sFirstRole='';
                  if (blr.W15yQC.fnNodeIsHidden(node) == false) {
                    sARIALabel=null;
                    sRole=blr.W15yQC.fnGetNodeAttribute(node, 'role', null);
                    if(blr.W15yQC.fnStringHasContent(sRole)) {
                      sRole=sRole.toLowerCase();
                      sFirstRole=sRole.replace(/^(\w+)\s.*$/, "$1");
                    }
                    sTagName = node.tagName.toLowerCase();
                    
                    if (blr.W15yQC.fnElementUsesARIA(node) == true) {
                      while(ARIAElementStack.length>0 && blr.W15yQC.fnIsDescendant(ARIAElementStack[ARIAElementStack.length-1], node) == false) {
                        ARIAElementStack.pop();
                      }
                      // Document ARIA Element: node, nodeDescription, doc, orderNumber, role value, ariaLabel
                      xPath = blr.W15yQC.fnGetElementXPath(node);
                      nodeDescription = blr.W15yQC.fnDescribeElement(node, 400);
                      // TODO: Don't restrict this to just an ARIA label, other elements may be involved.
                      sARIALabel = blr.W15yQC.fnGetNodeAttribute(node, 'aria-label', null);
                      if (blr.W15yQC.fnStringHasContent(sARIALabel)==false) {
                        sARIALabel = blr.W15yQC.fnGetTextFromIdList(node.getAttribute('aria-labelledby'), doc);
                      }
                      sState = blr.W15yQC.fnGetNodeState(node);
                      oW15yResults.aARIAElements.push(new blr.W15yQC.ariaElement(node, xPath, nodeDescription, doc, oW15yResults.aARIAElements.length, ARIAElementStack.length+1, sRole, sARIALabel, sState));
                      oW15yResults.aARIAElements[oW15yResults.aARIAElements.length-1].ownerDocumentNumber=docNumber+1;
                      ARIAElementStack.push(node);
  
                      switch (sFirstRole) {
                        case 'application':
                        case 'banner':
                        case 'complementary':
                        case 'contentinfo':
                        case 'form':
                        case 'main':
                        case 'navigation':
                        case 'search':
                          // Document landmark: node, nodeDescription, doc, orderNumber, role value, ariaLabel
                          ARIALandmarkLevel = 1;
                          for(i=oW15yResults.aARIALandmarks.length-1; i>=0; i--) {
                            if(blr.W15yQC.fnIsDescendant(oW15yResults.aARIALandmarks[i].node,node)==true && oW15yResults.aARIALandmarks[i].level+1>ARIALandmarkLevel) {
                              ARIALandmarkLevel = oW15yResults.aARIALandmarks[i].level+1;
                              break;
                            }
                          }
                          aLabel=blr.W15yQC.fnGetEffectiveLabel(node);
                          effectiveLabel=blr.W15yQC.fnCleanSpaces(blr.W15yQC.fnJoin(aLabel[0],sFirstRole.replace(/contentinfo/,'content info')+' landmark',' '));
                          effectiveLabelSource=blr.W15yQC.fnCleanSpaces(blr.W15yQC.fnJoin(aLabel[1], 'role attribute', ', '));
                          oW15yResults.aARIALandmarks.push(new blr.W15yQC.ariaLandmarkElement(node, xPath, nodeDescription, doc, oW15yResults.aARIALandmarks.length, ARIALandmarkLevel, effectiveLabel, effectiveLabelSource, sFirstRole, sState));
                          oW15yResults.aARIALandmarks[oW15yResults.aARIALandmarks.length-1].ownerDocumentNumber=docNumber+1;
                          break;
                        default:
                          oW15yResults.PageScore.bUsesARIABesidesLandmarks=true;
                      }
                    }
    
                    switch (sTagName) { // TODO: Debug how to handle HTML5 elements! Explore how JAWS 15 in FF or NVDA reports these
                      case 'article': // http://blog.paciellogroup.com/2011/03/html5-accessibility-chops-section-elements/
                      case 'section':
                        //break;
                      case 'aside':
                      case 'header':
                      case 'main':
                      case 'nav':
                      case 'footer':
                          // Document landmark: node, nodeDescription, doc, orderNumber, role value, ariaLabel
                          if (sFirstRole=='') {
                            xPath = blr.W15yQC.fnGetElementXPath(node);
                            nodeDescription = blr.W15yQC.fnDescribeElement(node, 400);
                            ARIALandmarkLevel = 1;
                            for(i=oW15yResults.aARIALandmarks.length-1; i>=0; i--) {
                              if(blr.W15yQC.fnIsDescendant(oW15yResults.aARIALandmarks[i].node,node)==true && oW15yResults.aARIALandmarks[i].level+1>ARIALandmarkLevel) {
                                ARIALandmarkLevel = oW15yResults.aARIALandmarks[i].level+1;
                                break;
                              }
                            }
                            sState = blr.W15yQC.fnGetNodeState(node);
                            aLabel=blr.W15yQC.fnGetEffectiveLabel(node);
                            effectiveLabel=blr.W15yQC.fnCleanSpaces(blr.W15yQC.fnJoin(aLabel[0],sTagName+' region',' '));
                            effectiveLabelSource=blr.W15yQC.fnCleanSpaces(blr.W15yQC.fnJoin(aLabel[1], 'HTML5 region element', ', '));
                            oW15yResults.aARIALandmarks.push(new blr.W15yQC.ariaLandmarkElement(node, xPath, nodeDescription, doc, oW15yResults.aARIALandmarks.length, ARIALandmarkLevel, effectiveLabel, effectiveLabelSource, sFirstRole, sState));
                            oW15yResults.aARIALandmarks[oW15yResults.aARIALandmarks.length-1].ownerDocumentNumber=docNumber+1;
                          }
                        break;
                      case 'area':
                        xPath = blr.W15yQC.fnGetElementXPath(node);
                        nodeDescription = blr.W15yQC.fnDescribeElement(node, 400);
                        aLabel = blr.W15yQC.fnGetEffectiveLabel(node);
                        effectiveLabel=aLabel[0];
                        effectiveLabelSource=aLabel[1];
                        box = node.getBoundingClientRect();
                        if (box != null) {
                          width = box.width;
                          height = box.height;
                        }
                        title = null;
                        if (node.hasAttribute('title')) { title = node.getAttribute('title'); }
                        alt = null;
                        if (node.hasAttribute('alt')) { alt = node.getAttribute('alt'); }
                        src = null;
                        if (node.hasAttribute('src')) { src = blr.W15yQC.fnCutoffString(node.getAttribute('src'), 200); }
                        oW15yResults.aImages.push(new blr.W15yQC.image(node, xPath, nodeDescription, doc, oW15yResults.aImages.length, sRole, src, width, height, effectiveLabel, effectiveLabelSource, alt, title, sARIALabel));
                        oW15yResults.aImages[oW15yResults.aImages.length-1].ownerDocumentNumber=docNumber+1;
                        if(blr.W15yQC.fnStringHasContent(effectiveLabel)) {
                          oW15yResults.iTextSize=oW15yResults.iTextSize+effectiveLabel.length;
                          if(ARIALandmarkLevel<1) { oW15yResults.PageScore.bAllContentContainedInLandmark=false; }
                        }
                        break;
                      case 'canvas':
                        // TODO: What to do here? Get alternative content? text?
                        break;
                      case 'img':
                        // Document image: node, nodeDescription, doc, orderNumber, src, width, height, alt, title, ariaLabel
                        xPath = blr.W15yQC.fnGetElementXPath(node);
                        nodeDescription = blr.W15yQC.fnDescribeElement(node, 400);
                        aLabel = blr.W15yQC.fnGetEffectiveLabel(node);
                        effectiveLabel=aLabel[0];
                        effectiveLabelSource=aLabel[1];
                        box = node.getBoundingClientRect();
                        if (box != null) {
                          width = box.width;
                          height = box.height;
                        }
                        title = null;
                        if (node.hasAttribute('title')) { title = node.getAttribute('title'); }
                        alt = null;
                        if (node.hasAttribute('alt')) { alt = node.getAttribute('alt'); }
                        src = null;
                        if (node.hasAttribute('src')) { src = blr.W15yQC.fnCutoffString(node.getAttribute('src'), 200); }
                        oW15yResults.aImages.push(new blr.W15yQC.image(node, xPath, nodeDescription, doc, oW15yResults.aImages.length, sRole, src, width, height, effectiveLabel, effectiveLabelSource, alt, title, sARIALabel));
                        oW15yResults.aImages[oW15yResults.aImages.length-1].ownerDocumentNumber=docNumber+1;
                        if(blr.W15yQC.fnStringHasContent(effectiveLabel)) {
                          oW15yResults.iTextSize=oW15yResults.iTextSize+effectiveLabel.length;
                          if(ARIALandmarkLevel<1) { oW15yResults.PageScore.bAllContentContainedInLandmark=false; }
                        }
                        break;
                      case 'input': // TODO: QA This!
                        if (node.hasAttribute('type') && node.getAttribute('type').toLowerCase() == 'image') {
                          // Document image: node, nodeDescription, doc, orderNumber, src, alt, title, ariaLabel
                          xPath = blr.W15yQC.fnGetElementXPath(node);
                          nodeDescription = blr.W15yQC.fnDescribeElement(node, 400);
                          aLabel = blr.W15yQC.fnGetEffectiveLabel(node);
                          effectiveLabel=aLabel[0];
                          effectiveLabelSource=aLabel[1];
                          box = node.getBoundingClientRect();
                          if (box != null) {
                            width = box.width;
                            height = box.height;
                          }
                          title = null;
                          if (node.hasAttribute('title')) { title = node.getAttribute('title'); }
                          alt = null;
                          if (node.hasAttribute('alt')) { alt = node.getAttribute('alt'); }
                          src = null;
                          if (node.hasAttribute('src')) { src = blr.W15yQC.fnCutoffString(node.getAttribute('src'), 200); }
                          oW15yResults.aImages.push(new blr.W15yQC.image(node, xPath, nodeDescription, doc, oW15yResults.aImages.length, sRole, src, width, height, effectiveLabel, effectiveLabelSource, alt, title, sARIALabel));
                          oW15yResults.aImages[oW15yResults.aImages.length-1].ownerDocumentNumber=docNumber+1;
                        }
                        break;
                    }
                    if (node.hasAttribute('accesskey') == true) { // Document accesskey
                      accessKey = node.getAttribute('accesskey');
                      xPath = blr.W15yQC.fnGetElementXPath(node);
                      nodeDescription = blr.W15yQC.fnDescribeElement(node, 400);
                      aLabel = blr.W15yQC.fnGetEffectiveLabel(node);
                      effectiveLabel=aLabel[0];
                      effectiveLabelSource=aLabel[1];
                      oW15yResults.aAccessKeys.push(new blr.W15yQC.accessKey(node, xPath, nodeDescription, doc, oW15yResults.aAccessKeys.length, sRole, accessKey, effectiveLabel, effectiveLabelSource));
                      oW15yResults.aAccessKeys[oW15yResults.aAccessKeys.length-1].ownerDocumentNumber=docNumber+1;
                    }
  
                    bFoundHeading=false;
                    if(sFirstRole=='heading') {
                      bFoundHeading=true;
                      if(node.hasAttribute('aria-level') && blr.W15yQC.fnIsValidPositiveInt(node.getAttribute('aria-level'))==true) {
                        headingLevel=parseInt(node.getAttribute('aria-level'));
                      } else { // TODO: Look deeper at this. JAWS 13 seems to default to heading level 2 if not specified
                        headingLevel=2;
                      }
                    } else {
                      switch (sTagName) {
                      case 'h1':
                      case 'h2':
                      case 'h3':
                      case 'h4':
                      case 'h5':
                      case 'h6':
                        if (blr.W15yQC.fnNodeIsHidden(node) == false) {
                          // Document heading
                          bFoundHeading=true;
                          headingLevel = sTagName.substring(1);
                        }
                        break;
                      }
                    }
                    if(bFoundHeading==true) {
                      xPath = blr.W15yQC.fnGetElementXPath(node);
                      nodeDescription = blr.W15yQC.fnDescribeElement(node, 400);
                      aLabel=blr.W15yQC.fnGetEffectiveLabel(node);
                      effectiveLabel=aLabel[0];
                      effectiveLabelSource=aLabel[1];
                      text = blr.W15yQC.fnGetDisplayableTextRecursively(node);
                      oW15yResults.aHeadings.push(new blr.W15yQC.headingElement(node, xPath, nodeDescription, doc, oW15yResults.aHeadings.length, sRole, sInheritedRoles, headingLevel, effectiveLabel, effectiveLabelSource, text));
                      oW15yResults.aHeadings[oW15yResults.aHeadings.length-1].ownerDocumentNumber=docNumber+1;
                      if(progressWindow) {
                        blr.W15yQC.skipStatusUpdateCounter=blr.W15yQC.skipStatusUpdateCounter-1;
                        if (blr.W15yQC.skipStatusUpdateCounter<1) {
                          progressWindow.fnUpdateProgress('Getting Elements: '+oW15yResults.aHeadings.length.toString()+' headings, '+oW15yResults.aLinks.length.toString()+' links', (oW15yResults.aLinks.length+oW15yResults.aHeadings.length)/total*100);
                          blr.W15yQC.skipStatusUpdateCounter=5;
                        }
                      }
                    }
  
                    if (sTagName == 'form') {
                      sXPath = blr.W15yQC.fnGetElementXPath(node);
                      sFormDescription = blr.W15yQC.fnDescribeElement(node);
                      ownerDocumentNumber = blr.W15yQC.fnGetOwnerDocumentNumber(node, oW15yResults.aDocuments);
                      sID = blr.W15yQC.fnGetNodeAttribute(node, 'id', null);
                      sName = blr.W15yQC.fnGetNodeAttribute(node, 'name', null);
                      sAction = blr.W15yQC.fnGetNodeAttribute(node, 'action', null);
                      sMethod = blr.W15yQC.fnGetNodeAttribute(node, 'method', null);
                      oW15yResults.aForms.push(new blr.W15yQC.formElement(node, sXPath, sFormDescription, doc, ownerDocumentNumber, oW15yResults.aForms.length + 1, sID, sName, sRole, sAction, sMethod));
                      oW15yResults.aForms[oW15yResults.aForms.length-1].ownerDocumentNumber=docNumber+1;
                    } else if ((blr.W15yQC.fnIsFormControlNode(node) || (bIncludeLabelControls == true && blr.W15yQC.bQuick != true && blr.W15yQC.fnIsLabelControlNode(node)))) {
                      // Document the form control
                      xPath = blr.W15yQC.fnGetElementXPath(node);
                      sFormElementDescription = blr.W15yQC.fnDescribeElement(node, 400);
                      parentFormNode = blr.W15yQC.fnGetParentFormElement(node);
                      sFormDescription = blr.W15yQC.fnDescribeElement(parentFormNode);
                      sTitle = blr.W15yQC.fnGetNodeAttribute(node, 'title', null);
                      sLegendText = '';
                      sLabelTagText = '';
                      sEffectiveLabelText = '';
                      if(blr.W15yQC.fnIsFormControlNode(node)) {
                        sLegendText = blr.W15yQC.fnGetLegendText(node);
                        sLabelTagText = blr.W15yQC.fnGetFormControlLabelTagText(node);
                        aLabel = blr.W15yQC.fnGetEffectiveLabel(node);
                        effectiveLabel=aLabel[0];
                        effectiveLabelSource=aLabel[1];
                      } else {
                        switch(sTagName) {
                          case 'fieldset':
                            sLabelTagText = blr.W15yQC.fnGetLegendText(node);
                            break;
                          case 'legend':
                          case 'label':
                          default:
                            sLabelTagText = blr.W15yQC.fnCleanSpaces(blr.W15yQC.fnGetDisplayableTextRecursively(node));
                            break;
                        }
                        effectiveLabel = sLabelTagText;
                        effectiveLabelSource = 'Label';
                      }
                      if(sTagName=='input' && node.hasAttribute('type')) {
                        controlType='type='+node.getAttribute('type');
                      } else {
                        controlType='';
                      }
                      if(blr.W15yQC.fnStringHasContent(sRole)) { controlType=blr.W15yQC.fnJoin(controlType,'role='+sRole,', '); }
                      if(blr.W15yQC.fnStringHasContent(controlType)) { controlType='['+controlType+']'; }
                      controlType=sTagName+controlType;
                      sAnnouncedAs=blr.W15yQC.fnJAWSAnnouncesControlAs(node);
                      sARIADescriptionText = blr.W15yQC.fnGetARIADescriptionText(node, doc);
                      sStateDescription = blr.W15yQC.fnGetNodeState(node);
                      sID = node.getAttribute('id');
                      sName = node.getAttribute('name');
                      sValue = node.getAttribute('value');
  
                      oW15yResults.aFormControls.push(new blr.W15yQC.formControlElement(node, xPath, sFormElementDescription, parentFormNode, sFormDescription, doc, oW15yResults.aFormControls.length, controlType, sRole, sID, sName, sTitle, sLegendText, sLabelTagText, sARIALabel, sARIADescriptionText, effectiveLabel, effectiveLabelSource, sAnnouncedAs, sStateDescription, sValue));
                      oW15yResults.aFormControls[oW15yResults.aFormControls.length-1].ownerDocumentNumber=docNumber+1;
                    }
  
                    if(sTagName=='a') {  // document the link
                      xPath = blr.W15yQC.fnGetElementXPath(node);
                      nodeDescription = blr.W15yQC.fnDescribeElement(node, 400);
                      aLabel = blr.W15yQC.fnGetEffectiveLabel(node);
                      effectiveLabel=aLabel[0];
                      effectiveLabelSource=aLabel[1];
                      text = blr.W15yQC.fnGetDisplayableTextRecursively(node);
                      title = blr.W15yQC.fnGetNodeAttribute(node, 'title', null);
                      target = blr.W15yQC.fnGetNodeAttribute(node, 'target', null);
                      href = blr.W15yQC.fnGetNodeAttribute(node, 'href', null);
                      sState = blr.W15yQC.fnGetNodeState(node);
                      oW15yResults.aLinks.push(new blr.W15yQC.linkElement(node, xPath, nodeDescription, doc, oW15yResults.aLinks.length, sRole, sState, effectiveLabel, effectiveLabelSource, text, title, target, href));
                      oW15yResults.aLinks[oW15yResults.aLinks.length-1].ownerDocumentNumber=docNumber+1;
                      if(progressWindow) {
                        blr.W15yQC.skipStatusUpdateCounter=blr.W15yQC.skipStatusUpdateCounter-1;
                        if (blr.W15yQC.skipStatusUpdateCounter<1) {
                          progressWindow.fnUpdateProgress('Getting Elements: '+oW15yResults.aHeadings.length.toString()+' headings, '+oW15yResults.aLinks.length.toString()+' links', (oW15yResults.aLinks.length+oW15yResults.aHeadings.length)/total*100);
                          blr.W15yQC.skipStatusUpdateCounter=5;
                        }
                      }
                    } else if(sTagName=='area') { // TODO: Any checks we need to do to make sure this is a valid area before including?
                      xPath = blr.W15yQC.fnGetElementXPath(node);
                      nodeDescription = blr.W15yQC.fnDescribeElement(node, 400);
                      aLabel = blr.W15yQC.fnGetEffectiveLabel(node);
                      effectiveLabel=aLabel[0];
                      effectiveLabelSource=aLabel[1];
                      text=aLabel[0];  // TODO: Vet this with JAWS!
                      title = blr.W15yQC.fnGetNodeAttribute(node, 'title', null);
                      target = blr.W15yQC.fnGetNodeAttribute(node, 'target', null);
                      href = blr.W15yQC.fnGetNodeAttribute(node, 'href', null);
                      sState = blr.W15yQC.fnGetNodeState(node);
                      oW15yResults.aLinks.push(new blr.W15yQC.linkElement(node, xPath, nodeDescription, doc, oW15yResults.aLinks.length, sRole, sState, effectiveLabel, effectiveLabelSource, text, title, target, href));
                      oW15yResults.aLinks[oW15yResults.aLinks.length-1].ownerDocumentNumber=docNumber+1;
                      if(progressWindow) {
                        blr.W15yQC.skipStatusUpdateCounter=blr.W15yQC.skipStatusUpdateCounter-1;
                        if (blr.W15yQC.skipStatusUpdateCounter<1) {
                          progressWindow.fnUpdateProgress('Getting Elements: '+oW15yResults.aHeadings.length.toString()+' headings, '+oW15yResults.aLinks.length.toString()+' links', (oW15yResults.aLinks.length+oW15yResults.aHeadings.length)/total*100);
                          blr.W15yQC.skipStatusUpdateCounter=5;
                        }
                      }
                    }
                    if (sTagName == 'table') {
                      // Document table
                      if (nestingDepth == null) { nestingDepth = 0; }
                      if(inTable != null || nestingDepth>0) {
                        nestingDepth += 1;
                      }
                      xPath = blr.W15yQC.fnGetElementXPath(node);
                      nodeDescription = blr.W15yQC.fnDescribeElement(node, 400);
                      title = blr.W15yQC.fnGetNodeAttribute(node, 'title', null);
                      tableSummary = blr.W15yQC.fnCleanSpaces(blr.W15yQC.fnGetNodeAttribute(node, 'summary', null));
                      inTable = oW15yResults.aTables.length;
                      oW15yResults.aTables.push(new blr.W15yQC.table(node, xPath, nodeDescription, doc, oW15yResults.aTables.length, sRole, nestingDepth, title, tableSummary));
                      oW15yResults.aTables[oW15yResults.aTables.length-1].ownerDocumentNumber=docNumber+1;
                      if(tableSummary != null && tableSummary.length>0) {
                        oW15yResults.aTables[inTable].isDataTable=true;
                      }
                    } else if(inTable != null) { // TODO: Is this necessary? Does the table analysis do this?
                      switch(sTagName) {
                        case 'th':
                          oW15yResults.aTables[inTable].isDataTable=true;
                          oW15yResults.aTables[inTable].bHasTHCells = true;
                          if(node.hasAttribute('rowspan') || node.hasAttribute('colspan')) {
                            oW15yResults.aTables[inTable].isComplex=true;
                          }
                          break;
                        case 'caption':
                          oW15yResults.aTables[inTable].isDataTable=true;
                          oW15yResults.aTables[inTable].bHasCaption = true;
                          if(oW15yResults.aTables[inTable].caption == null) {
                            oW15yResults.aTables[inTable].caption = blr.W15yQC.fnCleanSpaces(blr.W15yQC.fnGetDisplayableTextRecursively(node));
                          } else {
                            blr.W15yQC.fnAddNote(oW15yResults.aTables[inTable], 'tblMultipleCaptions'); // TODO: QA THIS
                          }
                          break;
                        case 'td':
                          if(node.hasAttribute('rowspan') || node.hasAttribute('colspan')) {
                            oW15yResults.aTables[inTable].isComplex=true;
                          }
                          if(node.hasAttribute('headers')) {
                            oW15yResults.aTables[inTable].isDataTable=true;
                            oW15yResults.aTables[inTable].bHasHeadersAttr = true;
                          }
                          break;
                        case 'tr':
                          break;
                      }
                    }
                  }
  
                  if (node.firstChild != null) { // keep looking through current document
                    if(blr.W15yQC.fnStringHasContent(sRole)) {
                      if(blr.W15yQC.fnIsValidARIARole(sRole) && blr.W15yQC.fnIsARIALandmarkRole(sRole)!=true) {
                        bAddedARIARole=true;
                        sPreviousInheritedRoles=sInheritedRoles;
                        sInheritedRoles=blr.W15yQC.fnJoin(sInheritedRoles,sRole,':');
                      }
                    }
                    blr.W15yQC.fnGetElements(doc, progressWindow, total, node, oW15yResults, ARIAElementStack, ARIALandmarkLevel, inTable, bInScript, sInheritedRoles, nestingDepth);
                    if(bAddedARIARole==true) {
                      sInheritedRoles=sPreviousInheritedRoles;
                    }
                    bAddedARIARole=false;
                  }
                  if(inTable != null && node.tagName.toLowerCase() == 'table') {
                    inTable = null; // TODO: Does this need to be an array stack?
                    if(nestingDepth>0) { nestingDepth += -1; }
                  }
                }
              } else if (node.nodeType == 3 && node.textContent && blr.W15yQC.fnStringHasContent(node.textContent)){
                oW15yResults.iTextSize=oW15yResults.iTextSize+node.textContent.length;
                if(ARIALandmarkLevel<1 && !bInScript) {
                    oW15yResults.PageScore.bAllContentContainedInLandmark=false;
                }
              }
            }
            bInScript=false;
          }
        }
      }
      blr.W15yQC.skipStatusUpdateCounter=1;
      return oW15yResults;
    },


    fnGetDocuments: function (doc, rootNode, aDocumentsList) {
      var docNumber, c, sID, idCount, frameDocument,style;
       // QA Framesets - framesetTest01.html
       // QA iFrames - iframeTests01.html
      // TODO: Store framing node (frameset, iframe, object, etc.)
      if (doc != null) {
        if (aDocumentsList == null) {
          aDocumentsList = [];
          // Put the top window's document in the list
          aDocumentsList.push(new blr.W15yQC.documentDescription(doc, doc.URL, aDocumentsList.length, doc.title, blr.W15yQC.fnGetDocumentLanguage(doc), blr.W15yQC.fnGetDocumentDirection(doc), doc.compatMode, blr.W15yQC.fnGetDocType(doc)));
          blr.W15yQC.fnAddLangValue(aDocumentsList[aDocumentsList.length-1],doc.body);
          blr.W15yQC.fnAddLangValue(aDocumentsList[aDocumentsList.length-1],doc.body.parentNode);
        }
        docNumber = aDocumentsList.length - 1;

        if (rootNode == null) { rootNode = doc.body; }
        if (rootNode != null && rootNode.firstChild != null) {
          for (c = rootNode.firstChild; c != null; c = c.nextSibling) {
            if (c.nodeType == 1) { // Only pay attention to element nodes
              style = window.getComputedStyle(c, null);
              if(style!=null) {
                if(/justify/i.test(style.getPropertyValue('text-align'))) {
                  aDocumentsList[aDocumentsList.length-1].hasFullJustifiedText=true;
                }
              }
              if(c.tagName) {
                if (c.hasAttribute('id') == true) {
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
                blr.W15yQC.fnAddLangValue(aDocumentsList[aDocumentsList.length-1],c);
              }

              if (c.tagName && ((c.contentWindow && c.contentWindow.document !== null) || (c.contentDocument && c.contentDocument.body !== null)) && blr.W15yQC.fnNodeIsHidden(c) == false) { // Found a frame
                // Document the new document
                frameDocument = c.contentWindow ? c.contentWindow.document : c.contentDocument;
                // TODO: for blank/missing src attributes on frames, should this blank out the URL? Right now it reports the parent URL
                aDocumentsList.push(new blr.W15yQC.documentDescription(frameDocument, frameDocument.URL, aDocumentsList.length, frameDocument.title, blr.W15yQC.fnGetDocumentLanguage(frameDocument), blr.W15yQC.fnGetDocumentDirection(frameDocument), doc.compatMode, blr.W15yQC.fnGetDocType(frameDocument)));
                blr.W15yQC.fnAddLangValue(aDocumentsList[aDocumentsList.length-1],frameDocument.body);
                blr.W15yQC.fnAddLangValue(aDocumentsList[aDocumentsList.length-1],frameDocument.body.parentNode);

                // get frame contents
                blr.W15yQC.fnGetDocuments(frameDocument, frameDocument.body, aDocumentsList);
              } else { // keep looking through current document
                blr.W15yQC.fnGetDocuments(doc, c, aDocumentsList);
              }
            }
          }
        }
      }
      return aDocumentsList;
    },

    fnAnalyzeDocuments: function (oW15yResults) {
      var i, aSameTitles, j, k, sIDList, sLangList, selectorTest, doc, suspectCSS='', aDocumentsList=oW15yResults.aDocuments;

      oW15yResults.PageScore.bAllDocumentsHaveTitles=true;
      oW15yResults.PageScore.bAllDocumentsHaveDefaultHumanLanguage=true;

      if(blr.W15yQC.sb == null) { blr.W15yQC.fnInitStringBundles(); }
      if (aDocumentsList !== null && aDocumentsList.length) {
        for (i = 0; i < aDocumentsList.length; i++) { // TODO: Add is meaningful document title check
          suspectCSS='';
          if (aDocumentsList[i].title == null) {
            oW15yResults.PageScore.bAllDocumentsHaveTitles=false;
            blr.W15yQC.fnAddNote(aDocumentsList[i], 'docTitleMissing'); // QA iframeTests01.html -- TODO: Can't produce, can this be detected?
          } else if (blr.W15yQC.fnStringHasContent(aDocumentsList[i].title)==false) {
            oW15yResults.PageScore.bAllDocumentsHaveTitles=false;
            blr.W15yQC.fnAddNote(aDocumentsList[i], 'docTitleEmpty'); // QA contents_of_frame_1.html
          }
          if (aDocumentsList[i].language == null) {
            oW15yResults.bAllDocumentsHaveDefaultHumanLanguage=false;
            blr.W15yQC.fnAddNote(aDocumentsList[i], 'docLangNotGiven'); // QA contents_of_frame_3.html
          } else {
            if (!aDocumentsList[i].language.length || aDocumentsList[i].language.length < 1) {
              oW15yResults.bAllDocumentsHaveDefaultHumanLanguage=false;
              blr.W15yQC.fnAddNote(aDocumentsList[i], 'docLangNotSpecified'); // QA firstNested.html
            } else if (blr.W15yQC.fnIsValidLocale(aDocumentsList[i].language) == false) {
              oW15yResults.bAllDocumentsHaveDefaultHumanLanguage=false;
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

          suspectCSS='';
          try {
            selectorTest = /{[^:]outline[^:]*:[^;}]+(\b0|none)/;
            doc=aDocumentsList[i].doc;
            for(j = 0; j < doc.styleSheets.length; ++j) {
              for(k = 0; k < doc.styleSheets[j].cssRules.length; ++k) {
                if(selectorTest.test(doc.styleSheets[j].cssRules[k].cssText)){
                  suspectCSS=blr.W15yQC.fnJoinIfNew(suspectCSS, doc.styleSheets[j].cssRules[k].cssText,' ');
                }
              }
            }
          } catch(ex) {

          }
          if(suspectCSS!='') {
            blr.W15yQC.fnAddNote(aDocumentsList[i], 'docCSSSuppressingOutline',[blr.W15yQC.fnCutoffString(suspectCSS,500)]); //
          }
          if(aDocumentsList[i].validLangValues.length>0) {
            sLangList = aDocumentsList[i].validLangValues.toString().replace(/,/g,', ');
            sLangList = blr.W15yQC.fnCutoffString(sLangList, 150);
            blr.W15yQC.fnAddNote(aDocumentsList[i], 'docValidLangList',[sLangList]); // TODO: QA This
          }
          if(aDocumentsList[i].invalidLangValues.length>0) {
            sLangList = "'"+aDocumentsList[i].invalidLangValues.toString()+"'";
            sLangList = sLangList.replace(/,/g,"', '");
            sLangList = blr.W15yQC.fnCutoffString(sLangList, 150);
            blr.W15yQC.fnAddNote(aDocumentsList[i], 'docInvalidLangList',[sLangList]); // TODO: QA This
          }
          if(aDocumentsList[i].hasLangConflict==true) {
            blr.W15yQC.fnAddNote(aDocumentsList[aDocumentsList.length-1], 'docLangConflictFound'); // TODO: QA This
          }
          if(aDocumentsList[i].hasFullJustifiedText==true) {
            blr.W15yQC.fnAddNote(aDocumentsList[aDocumentsList.length-1], 'docUsesFullJustifiedText'); // TODO: QA This
          }
        }
      }
      blr.W15yQC.fnUpdateWarningAndFailureCounts(aDocumentsList);
    },

    fnDisplayDocumentsResults: function (rd, aDocumentsList) {
      var div, table, msgHash, tbody, i, dd, sNotes, sClass;
      div = rd.createElement('div');
      div.setAttribute('id', 'AIDocumentsList');
      div.setAttribute('class', 'AISection');

      blr.W15yQC.fnAppendExpandContractHeadingTo(div, blr.W15yQC.fnMakeHeadingCountsString(aDocumentsList, 'hrsDocuments', 'hrsNoDocuments'));

      if (aDocumentsList && aDocumentsList.length > 0) {
        table = rd.createElement('table');
        table.setAttribute('id', 'AIDocumentsTable');

        table = blr.W15yQC.fnCreateTableHeaders(table, [blr.W15yQC.fnGetString('hrsTHDocumentNumber'), blr.W15yQC.fnGetString('hrsTHTitle'),
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
          blr.W15yQC.fnAppendTableRow(tbody, [i + 1, dd.title, dd.language, dd.dir, dd.URL, dd.compatMode, dd.docType, sNotes], sClass);
        }
        table.appendChild(tbody);
        div.appendChild(table);
        blr.W15yQC.fnMakeTableSortable(div, rd, 'AIDocumentsTable');
      } else {
        blr.W15yQC.fnAppendPElementTo(div, blr.W15yQC.fnGetString('hrsNoDocumentsDetected'));
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

    fnIsInheritableARIARole: function(sRole) {
      if(blr.W15yQC.fnStringHasContent(sRole)) {
        if(blr.W15yQC.fnIsValidARIARole(sRole) && !blr.W15yQC.fnIsARIALandmarkRole(sRole)) {
          return true;
        }
      }
      return false;
    },

    fnHasInheritableRole: function(tagName, sRole) {
      return (blr.W15yQC.fnIsInheritableARIARole(sRole));
    },

    fnIsARIALandmarkRole: function(sRole) {
      if(blr.W15yQC.fnStringHasContent(sRole)) {
        switch (sRole.toLowerCase()) {
          case 'application':
          case 'banner':
          case 'complementary':
          case 'contentinfo':
          case 'form':
          case 'main':
          case 'navigation':
          case 'search':
            return true;
            break;
        }
      }
      return false;
    },

    fnIsARIALandmark: function(node) {
      return (node != null && node.hasAttribute && node.hasAttribute('role') && blr.W15yQC.fnIsARIALandmarkRole(node.getAttribute('role')));
    },

    fnIsHTML5SectionElement: function(node) {
      return (node != null && node.hasAttribute && blr.W15yQC.fnIsARIALandmarkRole(node.getAttribute('role'))==false && /^(article|aside|footer|header|main|nav|section)$/i.test(node.tagName)==true);
    },

    fnGetARIALandmarks: function (doc, rootNode, aARIALandmarksList, baseLevel) {
      var c, level, i, frameDocument, sTagName, sRole, xPath, nodeDescription, effectiveLabel, effectiveLabelSource, aLabel, sState;
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
                sRole = c.getAttribute('role').toLowerCase();
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
                    level = baseLevel+1;
                    for(i=aARIALandmarksList.length-1; i>=0; i--) {
                      if(blr.W15yQC.fnIsDescendant(aARIALandmarksList[i].node,c)==true) {
                        level = aARIALandmarksList[i].level+1;
                        break;
                      }
                    }
                    aLabel=blr.W15yQC.fnGetEffectiveLabel(c);
                    effectiveLabel = aLabel[0];
                    effectiveLabelSource = aLabel[1];
                    sState = blr.W15yQC.fnGetNodeState(c);
                    aARIALandmarksList.push(new blr.W15yQC.ariaLandmarkElement(c, xPath, nodeDescription, doc, aARIALandmarksList.length, level, effectiveLabel, effectiveLabelSource, sRole, sState));
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

    fnAnalyzeARIALandmarks: function (oW15yResults) {
      var aARIALandmarksList=oW15yResults.aARIALandmarks, aDocumentsList=oW15yResults.aDocuments, iMainLandmarkCount, iBannerLandmarkCount,
        iContentInfoLandmarkCount, i, sRole, sRoleAndLabel, aSameLabelText, aLabelAndRoleSoundSame, j, sRoleAndLabel2,
        node;

      if(blr.W15yQC.sb == null) { blr.W15yQC.fnInitStringBundles(); }
      // TODO: Learn what is important to analyze in ARIA landmarks!

      oW15yResults.PageScore.bUsesARIALandmarks=false;
      oW15yResults.PageScore.bHasMainLandmark=false;
      oW15yResults.PageScore.bMainLandmarkContainsHeading=false;
      oW15yResults.PageScore.bAllLandmarksUnique=true;
      oW15yResults.PageScore.bLandmarksBesidesApplication=false;

      if (aARIALandmarksList != null && aARIALandmarksList.length && aARIALandmarksList.length>0) {
        oW15yResults.PageScore.bUsesARIALandmarks=true;
        iMainLandmarkCount = 0;
        iBannerLandmarkCount = 0;
        iContentInfoLandmarkCount = 0;

        for (i = 0; i < aARIALandmarksList.length; i++) {
          if (/application/i.test(aARIALandmarksList[i].role)==false) {
            oW15yResults.PageScore.bLandmarksBesidesApplication=true;
          }
          aARIALandmarksList[i].roleAndLabel = blr.W15yQC.fnCleanSpaces(blr.W15yQC.fnJoin(aARIALandmarksList[i].effectiveLabel, aARIALandmarksList[i].role, ' '));
          aARIALandmarksList[i].soundex = blr.W15yQC.fnSetIsEnglishLocale(aDocumentsList[aARIALandmarksList[i].ownerDocumentNumber-1].language) ? blr.W15yQC.fnGetSoundExTokens(aARIALandmarksList[i].roleAndLabel) : '';
        }

        for (i = 0; i < aARIALandmarksList.length; i++) {
          blr.W15yQC.fnAnalyzeARIAMarkupOnNode(aARIALandmarksList[i].node, aARIALandmarksList[i]);
          sRole=blr.W15yQC.fnGetNodeAttribute(aARIALandmarksList[i].node,'role','').toLowerCase();
          if(sRole == 'main' || aARIALandmarksList[i].node.tagName.toLowerCase()=='main') {
            oW15yResults.PageScore.bHasMainLandmark=true;
            if(aARIALandmarksList[i].node.getElementsByTagName('h1') ||
               aARIALandmarksList[i].node.getElementsByTagName('h2') ||
               aARIALandmarksList[i].node.getElementsByTagName('h3') ||
               aARIALandmarksList[i].node.getElementsByTagName('h4') ||
               aARIALandmarksList[i].node.getElementsByTagName('h5') ||
               aARIALandmarksList[i].node.getElementsByTagName('h6')) {
              oW15yResults.PageScore.bMainLandmarkContainsHeading=true; // TODO: This wont find headings in sub frames or ARIA headings
            }
            iMainLandmarkCount++;
            // Check nesting
            node=aARIALandmarksList[i].node != null ? (aARIALandmarksList[i].node.parentNode ? aARIALandmarksList[i].node.parentNode : null) : null;
            while (node != null && node.nodeType==1 && node.nodeName.toLowerCase() != 'body' && node.nodeName.toLowerCase() != 'frameset') {
              if (node.hasAttribute && node.hasAttribute('role')==true && blr.W15yQC.fnStringHasContent(node.getAttribute('role'))) {
                  blr.W15yQC.fnAddNote(aARIALandmarksList[i], 'ldmkMainShouldNotBeNested', [node.getAttribute('role')]);   // TODO QA This
              }
              node = node.parentNode?node.parentNode:null;
            }
          } else if(sRole == 'banner') {
            iBannerLandmarkCount++;
            // Check nesting
            node=aARIALandmarksList[i].node != null ? (aARIALandmarksList[i].node.parentNode ? aARIALandmarksList[i].node.parentNode : null) : null;
            while (node != null && node.nodeType==1 && node.nodeName.toLowerCase() != 'body' && node.nodeName.toLowerCase() != 'frameset') {
              if (node.hasAttribute && node.hasAttribute('role')==true && blr.W15yQC.fnStringHasContent(node.getAttribute('role'))) {
                  blr.W15yQC.fnAddNote(aARIALandmarksList[i], 'ldmkBannerShouldNotBeNested', [node.getAttribute('role')]);   // TODO QA This
              }
              node = node.parentNode?node.parentNode:null;
            }            
          } else if(sRole == 'contentinfo') {
            iContentInfoLandmarkCount++;
          } else if (sRole == 'navigation') {
            node=aARIALandmarksList[i].node != null ? (aARIALandmarksList[i].node.parentNode ? aARIALandmarksList[i].node.parentNode : null) : null;
            while (node != null && node.nodeType==1 && node.nodeName.toLowerCase() != 'body' && node.nodeName.toLowerCase() != 'frameset') {
              if (node.hasAttribute && node.hasAttribute('role')==true && /\bmain\b/i.test(node.getAttribute('role'))==true &&
                  blr.W15yQC.fnStringHasContent(blr.W15yQC.fnGetDisplayableTextBetweenElements(node,aARIALandmarksList[i].node))==false) {
                  blr.W15yQC.fnAddNote(aARIALandmarksList[i], 'ldmkMainStartsWithNav');   // TODO QA This
              }
              node = node.parentNode?node.parentNode:null;
            }            
          }
          sRoleAndLabel = aARIALandmarksList[i].roleAndLabel;
          if (blr.W15yQC.fnStringHasContent(sRole)) {
            j = sRoleAndLabel.match(new RegExp(sRole, 'ig'));
            if(j && j.length>2) {
              blr.W15yQC.fnAddNote(aARIALandmarksList[i], 'ldmkLandmarkNameInLabel');   // TODO QA This
            }
          }

          aSameLabelText = [];
          aLabelAndRoleSoundSame = [];
          for (j = 0; j < aARIALandmarksList.length; j++) {
            if (i != j) {
              if (blr.W15yQC.fnStringsEffectivelyEqual(sRoleAndLabel, aARIALandmarksList[j].roleAndLabel)) {
                aSameLabelText.push(j+1);
              } else if (aARIALandmarksList[i].soundex == aARIALandmarksList[j].soundex) {
                aLabelAndRoleSoundSame.push(j+1);
              }
            }
          }

          if(aSameLabelText.length>0) {
            oW15yResults.PageScore.bAllLandmarksUnique=false;
            if(blr.W15yQC.fnStringHasContent(aARIALandmarksList[i].effectiveLabel)) {
              blr.W15yQC.fnAddNote(aARIALandmarksList[i], 'ldmkAndLabelNotUnique', [blr.W15yQC.fnCutoffString(aSameLabelText.toString(),99)]);   // QA ariaTests01.html
            } else {
              blr.W15yQC.fnAddNote(aARIALandmarksList[i], 'ldmkNotUnique', [blr.W15yQC.fnCutoffString(aSameLabelText.toString(),99)]); // QA ariaTests01.html
            }
          }

          if(aLabelAndRoleSoundSame.length>0) {
            //oW15yResults.PageScore.bAllLandmarksUnique=false;
            if(blr.W15yQC.fnStringHasContent(aARIALandmarksList[i].effectiveLabel)) {
              blr.W15yQC.fnAddNote(aARIALandmarksList[i], 'ldmkAndLabelNotSoundUnique', [blr.W15yQC.fnCutoffString(aLabelAndRoleSoundSame.toString(),99)]);   // TODO: Needs QA
            } else {
              blr.W15yQC.fnAddNote(aARIALandmarksList[i], 'ldmkNotSoundUnique', [blr.W15yQC.fnCutoffString(aLabelAndRoleSoundSame.toString(),99)]); // TODO: Needs QA
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
        if(iMainLandmarkCount < 1 && oW15yResults.PageScore.bLandmarksBesidesApplication==true) {
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

    fnDisplayARIALandmarksResults: function (rd, aARIALandmarksList, bQuick) {
      var div, divContainer, innerDiv, list, previousHeadingLevel, previousDocument, sDoc, li, sNotesTxt, sMessage, span, nextLogicalLevel,
        table, msgHash, tbody, i, lo, sPadding, j, sNotes, sClass, bHasMultipleDocs=false, colHeaders=[], colValues=[];



     div = rd.createElement('div');
      divContainer = rd.createElement('div');
      innerDiv = rd.createElement('div');
      div.setAttribute('id', 'AIARIALandmarksList');
      div.setAttribute('class', 'AISection');
      innerDiv.setAttribute('class', 'AIList');

      blr.W15yQC.fnAppendExpandContractHeadingTo(div, blr.W15yQC.fnMakeHeadingCountsString(aARIALandmarksList,'hrsARIALandmarks','hrsNoARIALandmarks'));

      if (aARIALandmarksList && (aARIALandmarksList.length > 0 || (aARIALandmarksList.pageLevel && aARIALandmarksList.pageLevel.notes && aARIALandmarksList.pageLevel.notes.length>0))) {
        for(i=0;i<aARIALandmarksList.length;i++) {
          if(aARIALandmarksList[i].ownerDocumentNumber>1) { bHasMultipleDocs=true; break; }
        }
        list = [];
        list.push(rd.createElement('ul'));
        previousHeadingLevel = 0;

        previousDocument = null;
        if (aARIALandmarksList && aARIALandmarksList.length && aARIALandmarksList.length > 0) { previousDocument = aARIALandmarksList[0].doc; }

        for (i = 0; i < aARIALandmarksList.length; i++) {
          sDoc = '';
          if (i == 0 && bHasMultipleDocs==true) {
            sDoc = 'Contained in doc #' + aARIALandmarksList[i].ownerDocumentNumber; // TODO i18n this!
          }
          nextLogicalLevel = parseInt(previousHeadingLevel,10) + 1;
          for (j = nextLogicalLevel; j < aARIALandmarksList[i].level; j++) {
            // Add "skipped" heading levels
            li = rd.createElement('li');
            if (i==0) {
              li.setAttribute('style','display:none');
            }
            if (previousDocument != aARIALandmarksList[i].doc) {
              blr.W15yQC.fnAddClass(li, 'newDocument');
              sDoc = 'In doc #' + aARIALandmarksList[i].ownerDocumentNumber;
              previousDocument = aARIALandmarksList[i].doc;
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
          if (previousDocument != aARIALandmarksList[i].doc) {
            blr.W15yQC.fnAddClass(li, 'newDocument');
            sDoc = 'In doc #' + aARIALandmarksList[i].ownerDocumentNumber; // TODO: i18n this
            previousDocument = aARIALandmarksList[i].doc;
          }
          li.appendChild(rd.createTextNode(aARIALandmarksList[i].effectiveLabel));

          sNotesTxt = blr.W15yQC.fnMakeTextNotesList(aARIALandmarksList[i]);
          sMessage = blr.W15yQC.fnJoin(sDoc, blr.W15yQC.fnJoin(sNotesTxt, aARIALandmarksList[i].stateDescription, ', '+blr.W15yQC.fnGetString('hrsHeadingState')+':'), ' - ');
          if (sMessage != null && sMessage.length != null && sMessage.length > 0) {
            span = rd.createElement('span');

            span.appendChild(rd.createTextNode(' (' + sMessage + ')'));
            span.setAttribute('class', 'headingNote');
            li.appendChild(span);
          }

          if (aARIALandmarksList[i].failed) {
            li.setAttribute('class', 'failed');
          } else if (aARIALandmarksList[i].warning) {
            li.setAttribute('class', 'warning');
          }
          if (aARIALandmarksList[i].nodeDescription != null) { li.setAttribute('title', aARIALandmarksList[i].nodeDescription); }

          if (aARIALandmarksList[i].level > previousHeadingLevel && previousHeadingLevel > 0) {
            list.push(rd.createElement('ul'));
          } else {
            while (aARIALandmarksList[i].level < previousHeadingLevel) {
              list[list.length - 2].appendChild(list[list.length - 1]);
              list.pop();
              previousHeadingLevel--;
            }
          }
          list[list.length - 1].appendChild(li);
          previousHeadingLevel = parseInt(aARIALandmarksList[i].level,10);
        }
        while (list.length > 1) {
          list[list.length - 2].appendChild(list[list.length - 1]);
          list.pop();
        }
        innerDiv.appendChild(list[0]);
        divContainer.appendChild(innerDiv);
        div.appendChild(divContainer);



// ------

        table = rd.createElement('table');
        table.setAttribute('id', 'AIIARIALandmarksTable');

        if (bQuick) {
          table = blr.W15yQC.fnCreateTableHeaders(table, [blr.W15yQC.fnGetString('hrsTHNumberSym'), blr.W15yQC.fnGetString('hrsTHEffectiveLabel'), blr.W15yQC.fnGetString('hrsTHNotes')]);
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
            blr.W15yQC.fnAppendTableRow(tbody, [i + 1, lo.effectiveLabel, sNotes], sClass);
          }
        } else {
          colHeaders=[blr.W15yQC.fnGetString('hrsTHNumberSym'), blr.W15yQC.fnGetString('hrsLandmarkElement'),
                      blr.W15yQC.fnGetString('hrsTHOwnerDocNumber'), blr.W15yQC.fnGetString('hrsTHLevel'),
                      blr.W15yQC.fnGetString('hrsTHEffectiveLabel'), blr.W15yQC.fnGetString('hrsTHEffectiveLabelSource'),
                      blr.W15yQC.fnGetString('hrsTHRole'), blr.W15yQC.fnGetString('hrsTHState'),
                      blr.W15yQC.fnGetString('hrsTHNotes')];
          if (bHasMultipleDocs==false) {
            colHeaders.splice(2,1);
          }
          table = blr.W15yQC.fnCreateTableHeaders(table, colHeaders);
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
            colValues=[i + 1, sPadding+blr.W15yQC.fnMakeWebSafe(lo.nodeDescription), lo.ownerDocumentNumber, lo.level, lo.effectiveLabel, lo.effectiveLabelSource, lo.role, lo.stateDescription, sNotes];
            if (bHasMultipleDocs==false) {
              colValues.splice(2,1);
            }
            blr.W15yQC.fnAppendTableRow(tbody, colValues, sClass);
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
              blr.W15yQC.fnAppendTableRow(tbody, [i + 1 + aARIALandmarksList.length, '--'+blr.W15yQC.fnGetString('hrsPageLevel')+'--', '', '', '', '', '', sNotes], sClass);
            }
          }
        }

        table.appendChild(tbody);
        divContainer.appendChild(table);
        blr.W15yQC.fnMakeTableSortable(div, rd, 'AIIARIALandmarksTable');
      } else {
        blr.W15yQC.fnAppendPElementTo(div, blr.W15yQC.fnGetString('hrsNoARIALandmarksDetected'));
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

    fnAnalyzeARIAElements: function (oW15yResults) { // TODO: Finish this
      var i, sRoleAndLabel, sRoleAndLabel2, j, aARIAElementsList=oW15yResults.aARIAElements, aDocumentsList=oW15yResults.aDocuments;
      if(blr.W15yQC.sb == null) { blr.W15yQC.fnInitStringBundles(); }
      // TODO: Learn what is important to analyze in ARIA

      //oW15yResults.PageScore.bAllARIARolesAreValid=true;
      //oW15yResults.PageScore.bNoARIAErrors=true;

      if (aARIAElementsList != null && aARIAElementsList.length && aARIAElementsList.length>0) {

        for (i = 0; i < aARIAElementsList.length; i++) {
          //aARIAElementsList[i].ownerDocumentNumber = blr.W15yQC.fnGetOwnerDocumentNumber(aARIAElementsList[i].node, aDocumentsList);
          aARIAElementsList[i].stateDescription = blr.W15yQC.fnGetNodeState(aARIAElementsList[i].node);
          blr.W15yQC.fnAnalyzeARIAMarkupOnNode(aARIAElementsList[i].node, aARIAElementsList[i]);

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
      div.setAttribute('class', 'AISection');
      innerDiv.setAttribute('class', 'AIList');

      blr.W15yQC.fnAppendExpandContractHeadingTo(div, blr.W15yQC.fnMakeHeadingCountsString(aARIAElementsList,'hrsARIAEls','hrsNoARIAEls'));

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
          divARIAEl.setAttribute('class','ariaEl');
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
        blr.W15yQC.fnAppendPElementTo(div, blr.W15yQC.fnGetString('hrsNoARIAElsDetected'));
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

    fnGetLuminosityCheckElements: function(doc, rootNode, aLumCheckList, parentsColor, parentsBGColor) { // TODO: What percentage of text is non-compliant?
      var node, frameDocument, tagName, aColors, xPath, nodeDescription, sText, sTextSize, sID, sClass,
        fgColor, fgC, bgColor, bgC, textWeight, bBgImage, fgLum, bgLum, lRatio;
      if (aLumCheckList == null) {
        aLumCheckList = [];
        blr.W15yQC.fnDoEvents();
      }

      if (doc != null) {
        if (rootNode == null) { rootNode = doc.body; }
        for (node = rootNode.firstChild; node != null; node = node.nextSibling) {
          if (node.nodeType == 1) { // Only pay attention to element nodes
            if (node.tagName && ((node.contentWindow && node.contentWindow.document !== null) ||
                              (node.contentDocument && node.contentDocument.body !== null)) && blr.W15yQC.fnNodeIsHidden(node) == false) { // Found a frame
              // get frame contents
              frameDocument = node.contentWindow ? node.contentWindow.document : node.contentDocument;
              blr.W15yQC.fnGetLuminosityCheckElements(frameDocument, frameDocument.body, aLumCheckList);
            } else { // keep looking through current document
              if (node.tagName && blr.W15yQC.fnNodeIsHidden(node) == false) {
                tagName = node.tagName.toLowerCase();
                sText='';
                if(tagName != 'script' && tagName != 'style' && tagName != 'option' && (blr.W15yQC.fnElementHasOwnContent(node)||tagName=='input')) {
                  aColors = blr.W15yQC.fnGetColorValues(node);
                  xPath = blr.W15yQC.fnGetElementXPath(node);
                  nodeDescription = blr.W15yQC.fnDescribeElement(node, 400);
                  if (tagName=='input' && /^button$/i.test(node.getAttribute('type'))==true && blr.W15yQC.fnStringHasContent(node.getAttribute('value'))) {
                    sText = node.getAttribute('value'); // TODO: Enhance this to work with select elements, input text boxes, textareas, others.
                  } else if (tagName=='input' && /^submit$/i.test(node.getAttribute('type'))==true) {
                    sText = node.getAttribute('value');
                    if (!blr.W15yQC.fnStringHasContent(sText)) {
                      sText="Submit";
                    }
                  } else {
                    sText = blr.W15yQC.fnElementsOwnContent(node);
                  }
                  if(aColors != null) {
                    fgColor = [aColors[0], aColors[1], aColors[2]];
                    fgC = blr.W15yQC.fnGetColorString(parseInt(fgColor[0], 10) * 65536 + parseInt(fgColor[1], 10) * 256 + parseInt(fgColor[2], 10));
                    bgColor = [aColors[3], aColors[4], aColors[5]];
                    bgC = blr.W15yQC.fnGetColorString(parseInt(bgColor[0], 10) * 65536 + parseInt(bgColor[1], 10) * 256 + parseInt(bgColor[2], 10));
                    sTextSize = aColors[6];
                    textWeight = aColors[7];
                    bBgImage = aColors[8];
                    sID = node.getAttribute('id');
                    sClass = node.getAttribute('class');
                    //fgLum;
                    //bgLum;
                    lRatio = blr.W15yQC.fnComputeWCAG2LuminosityRatio(aColors[0], aColors[1], aColors[2], aColors[3], aColors[4], aColors[5]);
                    aLumCheckList.push(new blr.W15yQC.contrastElement(node, xPath, nodeDescription, doc, aLumCheckList.length, sID, sClass, sText, sTextSize, textWeight, fgColor, fgC, bgColor, bgC, bBgImage, fgLum, bgLum, lRatio));
                  }
                }
              }
              blr.W15yQC.fnGetLuminosityCheckElements(doc, node, aLumCheckList);
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
      var c, frameDocument, tagName, xPath, nodeDescription, effectiveLabel, effectiveLabelSource, role, box, width=null, height=null, title, alt, src, aLabel, sARIALabel;
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
                    aLabel = blr.W15yQC.fnGetEffectiveLabel(c);
                    effectiveLabel=aLabel[0];
                    effectiveLabelSource=aLabel[1];
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
                    aImagesList.push(new blr.W15yQC.image(c, xPath, nodeDescription, doc, aImagesList.length, role, src, width, height, effectiveLabel, effectiveLabelSource, alt, title, sARIALabel));
                    break;
                case 'canvas':

                    break;
                case 'img':
                  // Document image: node, nodeDescription, doc, orderNumber, src, width, height, alt, title, ariaLabel
                  xPath = blr.W15yQC.fnGetElementXPath(c);
                  nodeDescription = blr.W15yQC.fnDescribeElement(c, 400);
                  aLabel = blr.W15yQC.fnGetEffectiveLabel(c);
                  effectiveLabel=aLabel[0];
                  effectiveLabelSource=aLabel[1];
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
                  aImagesList.push(new blr.W15yQC.image(c, xPath, nodeDescription, doc, aImagesList.length, role, src, width, height, effectiveLabel, effectiveLabelSource, alt, title, sARIALabel));
                  break;
                case 'input': // TODO: QA This!
                  if (c.hasAttribute('type') && c.getAttribute('type').toLowerCase() == 'image') {
                    // Document image: node, nodeDescription, doc, orderNumber, src, alt, title, ariaLabel
                    xPath = blr.W15yQC.fnGetElementXPath(c);
                    nodeDescription = blr.W15yQC.fnDescribeElement(c, 400);
                    title = null;
                    aLabel = blr.W15yQC.fnGetEffectiveLabel(c);
                    effectiveLabel=aLabel[0];
                    effectiveLabelSource=aLabel[1];
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
                    aImagesList.push(new blr.W15yQC.image(c, xPath, nodeDescription, doc, aImagesList.length, role, src, width, height, effectiveLabel, effectiveLabelSource, alt, title, sARIALabel));
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

    fnAnalyzeImages: function (oW15yResults) {
      var i, sCombinedLabel, sText, aImagesList=oW15yResults.aImages, aDocumentsList=oW15yResults.aDocuments;
      if(blr.W15yQC.sb == null) { blr.W15yQC.fnInitStringBundles(); }

      oW15yResults.PageScore.bAllImagesHaveAltTextOrAreMarkedPresentational=true;
      oW15yResults.PageScore.bAllAltTextIsMeaningful=true;

      if (aImagesList != null && aImagesList.length) {

        for (i = 0; i < aImagesList.length; i++) {
          try{
            //aImagesList[i].ownerDocumentNumber = blr.W15yQC.fnGetOwnerDocumentNumber(aImagesList[i].node, aDocumentsList);
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
            if (blr.W15yQC.fnStringHasContent(aImagesList[i].effectiveLabel)==false && aImagesList[i].alt == null && blr.W15yQC.fnNodeHasPresentationRole(aImagesList[i].node) == false) {
              oW15yResults.PageScore.bAllImagesHaveMeaningfulAltTextOrAreMarkedPresentational=false;
              blr.W15yQC.fnAddNote(aImagesList[i], 'imgMissingAltAttribute'); // QA imageTests01.html
            }
            sCombinedLabel = blr.W15yQC.fnTrim(blr.W15yQC.fnJoin(blr.W15yQC.fnJoin(aImagesList[i].alt, aImagesList[i].title, ''), aImagesList[i].ariaLabel, ''));
            if (sCombinedLabel == null || sCombinedLabel.length < 1) {
              if(aImagesList[i].alt != null && blr.W15yQC.fnNodeHasPresentationRole(aImagesList[i].node)==false) {
                if (blr.W15yQC.fnStringHasContent(aImagesList[i].node.getAttribute('longdesc'))) {
                  blr.W15yQC.fnAddNote(aImagesList[i], 'imgWithLongdescShouldHaveAltText'); // QA qa_imgWithLongdescShouldHaveAltText.html
                } else {
                  blr.W15yQC.fnAddNote(aImagesList[i], 'imgNoAltText'); // QA imageTests01.html
                }
              }
            } else if(blr.W15yQC.fnNodeHasPresentationRole(aImagesList[i].node) == true) {
                blr.W15yQC.fnAddNote(aImagesList[i], 'imgHasAltTextAndPresRole'); // QA imageTests01.html
            } else {
              if (blr.W15yQC.fnOnlyASCIISymbolsWithNoLettersOrDigits(aImagesList[i].effectiveLabel)) {
                oW15yResults.PageScore.bAllAltTextIsMeaningful=false;
                blr.W15yQC.fnAddNote(aImagesList[i], 'imgAltTxtOnlyASCII'); // QA imageTests01.html
              }

              sText = blr.W15yQC.fnCleanSpaces(aImagesList[i].effectiveLabel);
              if (sText == null || sText == '') {
                blr.W15yQC.fnAddNote(aImagesList[i], 'imgNoAltText'); // QA imageTests01.html
              } else if (blr.W15yQC.fnAltTextAppearsIfItShouldBeEmptyCauseItIsASpacer(sText)) { // QA File imageTests01.html
                oW15yResults.PageScore.bAllAltTextIsMeaningful=false;
                blr.W15yQC.fnAddNote(aImagesList[i], 'imgSpacerShouldHaveEmptyAltTxt'); // QA imageTests01.html
              } else if (blr.W15yQC.fnAppearsToBeImageFileName(sText)) { // QA File imageTests01.html
                oW15yResults.PageScore.bAllAltTextIsMeaningful=false;
                blr.W15yQC.fnAddNote(aImagesList[i], 'imgAltTxtIsFileName'); // QA imageTests01.html
              } else if (blr.W15yQC.fnAppearsToBeURL(sText) || blr.W15yQC.fnAppearsToBeRelativeURL(sText)) { // QA File imageTests01.html
                oW15yResults.PageScore.bAllAltTextIsMeaningful=false;
                blr.W15yQC.fnAddNote(aImagesList[i], 'imgAltTxtIsURL'); // QA imageTests01.html
              } else if (blr.W15yQC.fnAppearsToBeJunkText(sText)) { // QA File imageTests01.html
                oW15yResults.PageScore.bAllAltTextIsMeaningful=false;
                blr.W15yQC.fnAddNote(aImagesList[i], 'imgAltTxtIsJunk'); // QA imageTests01.html
              } else if (blr.W15yQC.fnAppearsToBeDefaultAltText(sText)) { // QA File imageTests01.html
                oW15yResults.PageScore.bAllAltTextIsMeaningful=false;
                blr.W15yQC.fnAddNote(aImagesList[i], 'imgAltTxtIsDefault'); // QA imageTests01.html
              } else if (blr.W15yQC.fnAltTextAppearsIfItShouldBeEmpty(sText)) { // QA File imageTests01.html
                oW15yResults.PageScore.bAllAltTextIsMeaningful=false;
                blr.W15yQC.fnAddNote(aImagesList[i], 'imgAltTxtIsDecorative'); // QA imageTests01.html
              } else if (blr.W15yQC.fnAltTextAppearsToHaveRedundantImageReferenceInIt(sText)) { // QA File imageTests01.html
                oW15yResults.PageScore.bAllAltTextIsMeaningful=false;
                blr.W15yQC.fnAddNote(aImagesList[i], 'imgAltTxtIncludesImageTxt'); // QA imageTests01.html
              }

              if(blr.W15yQC.fnImageFilenameAppearsToBeASpacer(aImagesList[i].src) == true) {
                oW15yResults.PageScore.bAllAltTextIsMeaningful=false;
                blr.W15yQC.fnAddNote(aImagesList[i], 'imgSpacerWithAltTxt'); // QA imageTests01.html
              }
            }
            if(aImagesList[i].effectiveLabel && aImagesList[i].effectiveLabel.length && aImagesList[i].effectiveLabel.length>100) {
              blr.W15yQC.fnAddNote(aImagesList[i], 'imgAltLengthTooLong'); // QA imageTests01.html
            }
            if (blr.W15yQC.fnStringHasContent(aImagesList[i].effectiveLabel)==true && blr.W15yQC.fnStringHasContent(aImagesList[i].title)==true &&
                blr.W15yQC.fnStringsEffectivelyEqual(aImagesList[i].effectiveLabel,aImagesList[i].title)==false) {
              blr.W15yQC.fnAddNote(aImagesList[i], 'imgEffectiveLabelDiffThanTitle'); // QA imageTests01.html
            }
            aImagesList[i] = blr.W15yQC.fnAnalyzeARIAMarkupOnNode(aImagesList[i].node, aImagesList[i]);

            if(aImagesList[i].node != null && aImagesList[i].node.hasAttribute('id')==true) {
              if(blr.W15yQC.fnIsValidHtmlID(aImagesList[i].node.getAttribute('id'))==false) {
                blr.W15yQC.fnAddNote(aImagesList[i], 'imgIDNotValid'); // QA imageTests01.html
              }
              if(aDocumentsList[aImagesList[i].ownerDocumentNumber-1].idHashTable.getItem(aImagesList[i].node.getAttribute('id'))>1) {
                blr.W15yQC.fnAddNote(aImagesList[i], 'imgIDNotUnique'); // QA imageTests01.html
              }
            }
          } catch(ex) { }
        }
      }
      blr.W15yQC.fnUpdateWarningAndFailureCounts(aImagesList);
    },

    fnDisplayImagesResults: function (rd, aImagesList, bQuick) {
      var div = rd.createElement('div'), table, msgHash, tbody, i, io, sNotes, sClass, bHasARIALabel=false, bHasTitle=false, bHasAlt=false, bHasMultipleDocs=false, colHeaders=[], colValues=[];
      div.setAttribute('id', 'AIImagesList');
      div.setAttribute('class', 'AISection');

      blr.W15yQC.fnAppendExpandContractHeadingTo(div, blr.W15yQC.fnMakeHeadingCountsString(aImagesList,'hrsImages','hrsNoImages'));

      if (aImagesList && aImagesList.length > 0) {
        for (i = 0; i < aImagesList.length; i++) {
          io = aImagesList[i];
          if (io.ownerDocumentNumber>1) { bHasMultipleDocs=true; }
          if(blr.W15yQC.fnStringHasContent(io.title)) { bHasTitle=true; }
          if(blr.W15yQC.fnStringHasContent(io.alt)) { bHasAlt=true; }
          if(blr.W15yQC.fnStringHasContent(io.ariaLabel)) { bHasARIALabel=true; }
        }
        table = rd.createElement('table');
        table.setAttribute('id', 'AIImagesTable');
        if (bQuick) {
          colHeaders = [blr.W15yQC.fnGetString('hrsTHNumberSym'), blr.W15yQC.fnGetString('hrsTHEffectiveLabel'), blr.W15yQC.fnGetString('hrsTHNotes')];

          table = blr.W15yQC.fnCreateTableHeaders(table, colHeaders);
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
            colValues=[i + 1, io.effectiveLabel, sNotes];
            blr.W15yQC.fnAppendTableRow(tbody, colValues, sClass);
          }
        } else {
          colHeaders = [blr.W15yQC.fnGetString('hrsTHNumberSym'), blr.W15yQC.fnGetString('hrsTHImageElement'),
                        blr.W15yQC.fnGetString('hrsTHOwnerDocNumber'), blr.W15yQC.fnGetString('hrsTHEffectiveLabel'),
                        blr.W15yQC.fnGetString('hrsTHEffectiveLabelSource')];
          if(bHasAlt) { colHeaders.push(blr.W15yQC.fnGetString('hrsTHAlt')); }
          if(bHasTitle) { colHeaders.push(blr.W15yQC.fnGetString('hrsTHTitle')); }
          if(bHasARIALabel) { colHeaders.push(blr.W15yQC.fnGetString('hrsTHARIALabel')); }
          colHeaders.push(blr.W15yQC.fnGetString('hrsTHSrc'));
          colHeaders.push(blr.W15yQC.fnGetString('hrsTHNotes'));
          if (bHasMultipleDocs==false) {
            colHeaders.splice(2,1);
          }

          table = blr.W15yQC.fnCreateTableHeaders(table, colHeaders);
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
            colValues=[i + 1, blr.W15yQC.fnMakeWebSafe(io.nodeDescription), io.ownerDocumentNumber, io.effectiveLabel, io.effectiveLabelSource];
            if(bHasAlt) { colValues.push(io.alt); }
            if(bHasTitle) { colValues.push(io.title); }
            if(bHasARIALabel) { colValues.push(io.ariaLabel); }
            colValues.push(io.src);
            colValues.push(sNotes);
            if (bHasMultipleDocs==false) {
              colValues.splice(2,1);
            }
            blr.W15yQC.fnAppendTableRow(tbody, colValues, sClass);
          }
        }
        table.appendChild(tbody);
        div.appendChild(table);
        blr.W15yQC.fnMakeTableSortable(div, rd, 'AIImagesTable');
      } else {
        blr.W15yQC.fnAppendPElementTo(div, blr.W15yQC.fnGetString('hrsNoImagesDetected'));
      }
      rd.body.appendChild(div);
    },

    fnGetAccessKeys: function (doc, rootNode, aAccessKeysList) {
      var c, frameDocument, tagName, accessKey, xPath, nodeDescription, effectiveLabel, effectiveLabelSource, role;
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
                  aLabel = blr.W15yQC.fnGetEffectiveLabel(c);
                  effectiveLabel=aLabel[0];
                  effectiveLabelSource=aLabel[1];
                  role = blr.W15yQC.fnGetNodeAttribute(c, 'role', null);
                  aAccessKeysList.push(new blr.W15yQC.accessKey(c, xPath, nodeDescription, doc, aAccessKeysList.length, role, accessKey, effectiveLabel, effectiveLabelSource));
                }
              }
              blr.W15yQC.fnGetAccessKeys(doc, c, aAccessKeysList);
            }
          }
        }
      }
      return aAccessKeysList;
    },

    fnAnalyzeAccessKeys: function (oW15yResults) {
      var htMajorConflicts, i, ak, aValuesDuplicated, aLabelsDuplicated, j, ak2, aAccessKeysList=oW15yResults.aAccessKeys, aDocumentsList=oW15yResults.aDocuments;
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

      oW15yResults.PageScore.bUsesAccessKeys=false;
      oW15yResults.PageScore.bAllAccessKeysUnique=true;
      oW15yResults.PageScore.bNoAccessKeysHaveConflicts=true;
      oW15yResults.PageScore.bAllAccessKeysHaveLabels=true;

      if (aAccessKeysList != null && aAccessKeysList.length && aAccessKeysList.length > 0) {
        oW15yResults.PageScore.bUsesAccessKeys=true;
        for (i = 0; i < aAccessKeysList.length; i++) {
          //aAccessKeysList[i].ownerDocumentNumber = blr.W15yQC.fnGetOwnerDocumentNumber(aAccessKeysList[i].node, aDocumentsList);
          aAccessKeysList[i].stateDescription = blr.W15yQC.fnGetNodeState(aAccessKeysList[i].node);
        }
        for (i = 0; i < aAccessKeysList.length; i++) {
          ak = aAccessKeysList[i];
          if (htMajorConflicts[ak.accessKey.toLowerCase()] != null && htMajorConflicts[ak.accessKey.toLowerCase()].length) {
            oW15yResults.PageScore.bNoAccessKeysHaveConflicts=false;
            blr.W15yQC.fnAddNote(ak, 'akConflict',[htMajorConflicts[ak.accessKey.toLowerCase()]]); //  QA accesskeyTests01.html
          }
          if (ak.effectiveLabel == null) {
            blr.W15yQC.fnAddNote(ak, 'akNoLabel'); // Can't get this to fire
          } else if (ak.effectiveLabel.length && ak.effectiveLabel.length > 0) {
            if (blr.W15yQC.fnOnlyASCIISymbolsWithNoLettersOrDigits(ak.effectiveLabel)) {
              oW15yResults.PageScore.bAllAccessKeysHaveLabels=false;
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
              oW15yResults.PageScore.bAllAccessKeysUnique=true;
              blr.W15yQC.fnAddNote(ak, 'akValueNotUnique', [blr.W15yQC.fnCutoffString(aValuesDuplicated.toString(),99)]); //
            }
            if(aLabelsDuplicated.length>0) {
              blr.W15yQC.fnAddNote(ak, 'akLabelNotUnique', [blr.W15yQC.fnCutoffString(aLabelsDuplicated.toString(),99)]); //
            }
          } else {
            oW15yResults.PageScore.bAllAccessKeysHaveLabels=false;
            blr.W15yQC.fnAddNote(ak, 'akLabelEmpty'); // QA accesskeyTests01.html
          }

          ak = blr.W15yQC.fnAnalyzeARIAMarkupOnNode(ak.node, ak);
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

    fnDisplayAccessKeysResults: function (rd, aAccessKeysList, bQuick) {
      var div, table, msgHash, tbody, i, ak, sNotes, sClass;
      div = rd.createElement('div');
      div.setAttribute('id', 'AIAccesskeysList');
      div.setAttribute('class', 'AISection');

      blr.W15yQC.fnAppendExpandContractHeadingTo(div, blr.W15yQC.fnMakeHeadingCountsString(aAccessKeysList,'hrsAccessKeys','hrsNoAccessKeys'));

      if (aAccessKeysList != null && aAccessKeysList.length > 0) {
        table = rd.createElement('table');
        table.setAttribute('id', 'AIAccesskeysTable');

        if (bQuick==true) {
          table = blr.W15yQC.fnCreateTableHeaders(table, [blr.W15yQC.fnGetString('hrsTHNumberSym'), blr.W15yQC.fnGetString('hrsTHAccessKey'),
                                                              blr.W15yQC.fnGetString('hrsTHEffectiveLabel'), blr.W15yQC.fnGetString('hrsTHNotes')]);
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
            blr.W15yQC.fnAppendTableRow(tbody, [i + 1, ak.accessKey, ak.effectiveLabel, sNotes], sClass);
          }
        } else {
          table = blr.W15yQC.fnCreateTableHeaders(table, [blr.W15yQC.fnGetString('hrsTHNumberSym'), blr.W15yQC.fnGetString('hrsTHElementDescription'),
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
            blr.W15yQC.fnAppendTableRow(tbody, [i + 1, blr.W15yQC.fnMakeWebSafe(ak.nodeDescription), ak.ownerDocumentNumber, ak.accessKey, ak.effectiveLabel, ak.stateDescription, sNotes], sClass);
          }
        }
        table.appendChild(tbody);
        div.appendChild(table);
        blr.W15yQC.fnMakeTableSortable(div, rd, 'AIAccesskeysTable');
      } else {
        blr.W15yQC.fnAppendPElementTo(div, blr.W15yQC.fnGetString('hrsNoAccessKeysDetected'));
      }
      rd.body.appendChild(div);
    },

    fnGetHeadings: function (doc, rootNode, aHeadingsList) {
      var c, frameDocument, tagName, headingLevel, xPath, nodeDescription, role, aLabel, effectiveLabel, effectiveLabelSource, text, bFoundHeading;
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
                  aLabel = blr.W15yQC.fnGetEffectiveLabel(c);
                  effectiveLabel=aLabel[0];
                  effectiveLabelSource=aLabel[1];
                  text = blr.W15yQC.fnGetDisplayableTextRecursively(c);

                  aHeadingsList.push(new blr.W15yQC.headingElement(c, xPath, nodeDescription, doc, aHeadingsList.length, role, '', headingLevel, effectiveLabel, effectiveLabelSource, text));
                }
              }
              blr.W15yQC.fnGetHeadings(doc, c, aHeadingsList);
            }
          }
        }
      }
      return aHeadingsList;
    },

    fnAnalyzeHeadings: function (oW15yResults, progressWindow) {
      var i, previousHeadingLevel, aHeadingsList=oW15yResults.aHeadings, aDocumentsList=oW15yResults.aDocuments, listedHeadingCount=0, firstListedHeading=true,
          j;

      oW15yResults.PageScore.bUsesHeadings=false;
      oW15yResults.PageScore.bHasALevelOneHeading=false;
      oW15yResults.PageScore.bHeadingHierarchyIsCorrect=true;
      oW15yResults.PageScore.bHasMultipleHeadings=false;
      oW15yResults.PageScore.bHasTooManyLevelOneHeadings=false;
      oW15yResults.PageScore.bHasEnoughHeadingsForContent=true;
      oW15yResults.PageScore.bNotAllHeadingsHaveMeaningfulText=false;
      oW15yResults.PageScore.bNotAllHeadingsInASectionAreUnique=false;
      
      if(blr.W15yQC.sb == null) { blr.W15yQC.fnInitStringBundles(); }
      if (aHeadingsList != null && aHeadingsList.length && aHeadingsList.length > 0) {
        for (i = 0; i < aHeadingsList.length; i++) {
          //aHeadingsList[i].ownerDocumentNumber = blr.W15yQC.fnGetOwnerDocumentNumber(aHeadingsList[i].node, aDocumentsList);
          aHeadingsList[i].stateDescription = blr.W15yQC.fnGetNodeState(aHeadingsList[i].node);
          if (aHeadingsList[i].level == null || aHeadingsList[i].level<1) { // TODO: QA This - what happens if level>6?
            aHeadingsList[i].level=2; // JAWS defaults to level 2 if ARIA heading level is not specified
          }
          if (blr.W15yQC.dominantAriaRoles.test(aHeadingsList[i].inheritedRoles)) {  // TODO: QA This!
            aHeadingsList[i].listedByAT=false;
            blr.W15yQC.fnAddNote(aHeadingsList[i], 'hHeadingRoleOverriddenByInheritedRole', [aHeadingsList[i].inheritedRoles]); // TODO: QA This
          } else if(/^\s*heading\s*$/i.test(aHeadingsList[i].role)==false && blr.W15yQC.dominantAriaRoles.test(aHeadingsList[i].role)) {
            aHeadingsList[i].listedByAT=false;
            blr.W15yQC.fnAddNote(aHeadingsList[i], 'hHeadingRoleOverriddenByRoleAttr', [aHeadingsList[i].role]); // TODO: QA This
          } else if(/^\s*presentation\s*$/i.test(aHeadingsList[i].role)) {
            aHeadingsList[i].listedByAT=false;
            blr.W15yQC.fnAddNote(aHeadingsList[i], 'hHeadingRoleOverriddenByRoleAttr', [aHeadingsList[i].role]); // TODO: QA This
          } else {
            aHeadingsList[i].listedByAT=true;
            listedHeadingCount++;
          }

          if (blr.W15yQC.fnStringHasContent(aHeadingsList[i].text)) {
            aHeadingsList[i].text = blr.W15yQC.fnCleanSpaces(aHeadingsList[i].text);
          }

          if(aHeadingsList[i].listedByAT==true && aHeadingsList[i].level==1) {
            if (blr.W15yQC.bOnlyOneLevel1Heading==true && oW15yResults.PageScore.bHasALevelOneHeading==true) {
              oW15yResults.PageScore.bHasTooManyLevelOneHeadings=true;
              blr.W15yQC.fnAddNote(aHeadingsList[i], 'hShouldNotBeMultipleLevel1Headings'); // TODO: QA This
            }
            oW15yResults.PageScore.bHasALevelOneHeading=true;
          }
        }

        if(listedHeadingCount>0) {
          oW15yResults.PageScore.bUsesHeadings=true;
          if(aHeadingsList.length > 1) {
            oW15yResults.PageScore.bHasMultipleHeadings=true;
          }
        }

        for (i = 0; i < aHeadingsList.length; i++) {
          if((i % 4) == 0) {
            if(progressWindow != null) {
              progressWindow.fnUpdateProgress('Analyzing Headings ' + (Math.round(100*i/aHeadingsList.length)).toString()+'%', Math.round(3*i/aHeadingsList.length)+12);
              //progressWindow.document.getElementById('percent').value=Math.round(3*i/aHeadingsList.length)+12;
              //progressWindow.document.getElementById('detailText').value='Analyzing Headings ' + (Math.round(100*i/aHeadingsList.length)).toString()+'%';
              progressWindow.focus();
              blr.W15yQC.fnDoEvents();
            }
          }
          if(aHeadingsList[i].listedByAT==true) {
            if(firstListedHeading==true) {
              firstListedHeading=false;
              
              if(oW15yResults.PageScore.bUsesHeadings==true && blr.W15yQC.bFirstHeadingMustBeLevel1==true) {
                previousHeadingLevel = 0;
              } else {
                previousHeadingLevel = aHeadingsList[0].level;
              }
            }

            for (j=i+1;j<aHeadingsList.length;j++) {
              if (aHeadingsList[j].level<aHeadingsList[i].level) {
                break; // End of section
              }
              if(aHeadingsList[j].listedByAT==true && aHeadingsList[i].level==aHeadingsList[j].level &&
                 blr.W15yQC.fnStringsEffectivelyEqual(aHeadingsList[i].effectiveLabel,aHeadingsList[j].effectiveLabel)) {
                aHeadingsList[i].aSameTextAs.push(j+1);
                aHeadingsList[j].aSameTextAs.push(i+1);
              }
            }
            if (aHeadingsList[i].level - previousHeadingLevel > 1) {
                oW15yResults.PageScore.bHeadingHierarchyIsCorrect=false;
                blr.W15yQC.fnAddNote(aHeadingsList[i], 'hSkippedLevel'); // QA: headings01.html
            }
            previousHeadingLevel = aHeadingsList[i].level;
          }

          if (blr.W15yQC.fnStringHasContent(aHeadingsList[i].effectiveLabel)==false) {
            blr.W15yQC.fnAddNote(aHeadingsList[i], 'hTxtMissing'); // Not sure this can happen
            oW15yResults.PageScore.bNotAllHeadingsHaveMeaningfulText=true;
          } else if (aHeadingsList[i].effectiveLabel.length && aHeadingsList[i].effectiveLabel.length > 0) {
            if (blr.W15yQC.fnOnlyASCIISymbolsWithNoLettersOrDigits(aHeadingsList[i].effectiveLabel)) {
              blr.W15yQC.fnAddNote(aHeadingsList[i], 'hTxtOnlyASCII'); // QA: headings01.html
            } else if (blr.W15yQC.fnIsMeaningfulHeadingText(aHeadingsList[i].effectiveLabel) == false) {
              blr.W15yQC.fnAddNote(aHeadingsList[i], 'hTxtNotMeaninfgul'); // QA: headings01.html
            }
          } else {
            blr.W15yQC.fnAddNote(aHeadingsList[i], 'hTxtEmpty'); // QA: headings01.html
          }

          aHeadingsList[i] = blr.W15yQC.fnAnalyzeARIAMarkupOnNode(aHeadingsList[i].node, aHeadingsList[i]);
          if(aHeadingsList[i].node != null && aHeadingsList[i].node.hasAttribute('id')==true) {
            if(blr.W15yQC.fnIsValidHtmlID(aHeadingsList[i].node.getAttribute('id'))==false) {
              blr.W15yQC.fnAddNote(aHeadingsList[i], 'hIDNotValid'); // QA: headings01.html
            }
            if(aDocumentsList[aHeadingsList[i].ownerDocumentNumber-1].idHashTable.getItem(aHeadingsList[i].node.getAttribute('id'))>1) {
              blr.W15yQC.fnAddNote(aHeadingsList[i], 'hIDNotUnique'); // QA: headings01.html
            }
          }
          if (aHeadingsList[i].aSameTextAs.length>0) {
            blr.W15yQC.fnAddNote(aHeadingsList[i], 'hHeadingNotUniqueInSection', [aHeadingsList[i].aSameTextAs.toString()]); // TODO: QA This
            oW15yResults.PageScore.bNotAllHeadingsInASectionAreUnique=true;
          }
          
          if (aHeadingsList[i].node != null && blr.W15yQC.fnIsValidPositiveInt(aHeadingsList[i].node.getAttribute('aria-level'))==false &&
              blr.W15yQC.fnElementIsChildOfSectioningElement(aHeadingsList[i].node)==true) {
              blr.W15yQC.fnAddNote(aHeadingsList[i], 'hChildOfSectioningElementWOLevel'); // QA: headings01.html
          }
        }
      }
      if (oW15yResults.PageScore.bHasALevelOneHeading!==true &&
          Application.prefs.getValue('extensions.W15yQC.getElements.mustHaveLevel1Heading',false)==true) {
        blr.W15yQC.fnAddPageLevelNote(aHeadingsList, 'hNoLevel1Heading'); // TODO: QA This
      }
      blr.W15yQC.fnUpdateWarningAndFailureCounts(aHeadingsList);
    },

    fnDisplayHeadingsResults: function (rd, aHeadingsList, bQuick) {
      var div, divContainer, innerDiv, list, multipleDocs=false, previousHeadingLevel, previousDocument, i,
        sDoc, nextLogicalLevel, j, li, sNotesTxt, sMessage, span,
        table, msgHash, tbody, sNotes, sClass, lo;

      div = rd.createElement('div');
      divContainer = rd.createElement('div');
      innerDiv = rd.createElement('div');
      div.setAttribute('id', 'AIHeadingsList');
      div.setAttribute('class', 'AISection');
      innerDiv.setAttribute('class', 'AIList');

      blr.W15yQC.fnAppendExpandContractHeadingTo(div, blr.W15yQC.fnMakeHeadingCountsString(aHeadingsList,'hrsHeadings','hrsNoHeadings', bQuick));

      if (aHeadingsList && aHeadingsList.length > 0) {
        for(i=0;i<aHeadingsList.length;i++) {
          if(aHeadingsList[i].ownerDocumentNumber>1) { multipleDocs=true; break; }
          if (aHeadingsList[i].level==null || aHeadingsList[i].level<1) {
            aHeadingsList[i].level=2;
          }
        }
        list = [];
        list.push(rd.createElement('ul'));
        previousHeadingLevel = 0;

        previousDocument = null;
        if (aHeadingsList && aHeadingsList.length && aHeadingsList.length > 0) { previousDocument = aHeadingsList[0].doc; }
        for (i = 0; i < aHeadingsList.length; i++) {
          if(aHeadingsList[i].listedByAT==true) {
            sDoc = '';
            if (i == 0 && multipleDocs==true) {
              sDoc = 'Contained in doc #' + aHeadingsList[i].ownerDocumentNumber; // TODO i18n this!
            }
            nextLogicalLevel = parseInt(previousHeadingLevel,10) + 1;
            for (j = nextLogicalLevel; j < aHeadingsList[i].level; j++) {
              // Add "skipped" heading levels
              li = rd.createElement('li');
              if (i==0) {
                li.setAttribute('style','display:none');
              }
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
              sDoc = 'In doc #' + aHeadingsList[i].ownerDocumentNumber; // TODO: i18n this
              previousDocument = aHeadingsList[i].doc;
            }
            li.appendChild(rd.createTextNode("[h" + aHeadingsList[i].level + "] " + aHeadingsList[i].effectiveLabel));

            sNotesTxt = blr.W15yQC.fnMakeTextNotesList(aHeadingsList[i]);
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
        }
        while (list.length > 1) {
          list[list.length - 2].appendChild(list[list.length - 1]);
          list.pop();
        }
        innerDiv.appendChild(list[0]);
        divContainer.appendChild(innerDiv);
        div.appendChild(divContainer);

      if (aHeadingsList && aHeadingsList.length > 0) {
        table = rd.createElement('table');
        table.setAttribute('id', 'AIHeadingsTable');

        if (bQuick==true) {
          table = blr.W15yQC.fnCreateTableHeaders(table, [blr.W15yQC.fnGetString('hrsTHNumberSym'), blr.W15yQC.fnGetString('hrsTHHeadingLevel'), blr.W15yQC.fnGetString('hrsTHEffectiveLabel'), blr.W15yQC.fnGetString('hrsTHNotes')]);
          msgHash = new blr.W15yQC.HashTable();
          tbody = rd.createElement('tbody');
          for (i = 0; i < aHeadingsList.length; i++) {
            sNotes = blr.W15yQC.fnMakeHTMLNotesList(aHeadingsList[i], msgHash);
            sClass = '';
            if (aHeadingsList[i].failed) {
              sClass = 'failed';
            } else if (aHeadingsList[i].warning) {
              sClass = 'warning';
            }
            blr.W15yQC.fnAppendTableRow(tbody, [i + 1, aHeadingsList[i].level, aHeadingsList[i].effectiveLabel, sNotes], sClass);
          }
        } else {
          table = blr.W15yQC.fnCreateTableHeaders(table, [blr.W15yQC.fnGetString('hrsTHNumberSym'), blr.W15yQC.fnGetString('hrsTHHeadingElement'),
                                                              blr.W15yQC.fnGetString('hrsTHOwnerDocNumber'), blr.W15yQC.fnGetString('hrsTHHeadingLevel'),
                                                              blr.W15yQC.fnGetString('hrsTHEffectiveLabel'), blr.W15yQC.fnGetString('hrsTHEffectiveLabelSource'),
                                                              blr.W15yQC.fnGetString('hrsTHNotes')]);
          msgHash = new blr.W15yQC.HashTable();
          tbody = rd.createElement('tbody');
          for (i = 0; i < aHeadingsList.length; i++) {
            sNotes = blr.W15yQC.fnMakeHTMLNotesList(aHeadingsList[i], msgHash);
            sClass = '';
            if (aHeadingsList[i].failed) {
              sClass = 'failed';
            } else if (aHeadingsList[i].warning) {
              sClass = 'warning';
            }
            blr.W15yQC.fnAppendTableRow(tbody, [i + 1, blr.W15yQC.fnMakeWebSafe(aHeadingsList[i].nodeDescription), aHeadingsList[i].ownerDocumentNumber, aHeadingsList[i].level, aHeadingsList[i].effectiveLabel, aHeadingsList[i].effectiveLabelSource, sNotes], sClass);
          }
        }

        
        // Page Level
        if(aHeadingsList.pageLevel && aHeadingsList.pageLevel.notes) {
          for (i = 0; i < aHeadingsList.pageLevel.notes.length; i++) {
            lo = aHeadingsList.pageLevel;
            sNotes = blr.W15yQC.fnMakeHTMLNotesList(lo, msgHash);
            sClass = '';
            if (lo.failed) {
              sClass = 'failed';
            } else if (lo.warning) {
              sClass = 'warning';
            }
            if(bQuick) {
              blr.W15yQC.fnAppendTableRow(tbody, [i + 1 + aHeadingsList.length, '--'+blr.W15yQC.fnGetString('hrsPageLevel')+'--', '', sNotes], sClass);
            } else {
              blr.W15yQC.fnAppendTableRow(tbody, [i + 1 + aHeadingsList.length, '--'+blr.W15yQC.fnGetString('hrsPageLevel')+'--', '', '', '', '', sNotes], sClass);
            }
          }
        }
        
        
        table.appendChild(tbody);
        divContainer.appendChild(table);
        blr.W15yQC.fnMakeTableSortable(div, rd, 'AIHeadingsTable');
      }

      } else {
        blr.W15yQC.fnAppendPElementTo(div, blr.W15yQC.fnGetString('hrsNoHeadingsDetected'));
      }
      rd.body.appendChild(div);
    },

    fnGetFormControls: function (doc, rootNode, aDocumentsList, aFormsList, aFormControlsList) {
      var bIncludeLabelControls, c, frameDocument, sXPath, sFormDescription, ownerDocumentNumber, sRole, sID, sName, sAction, sMethod, xPath, sFormElementDescription, parentFormNode,
          controlType, sTitle, sLegendText, sLabelTagText, effectiveLabel, effectiveLabelSource, sARIALabelText, sARIADescriptionText, sStateDescription, sValue, sAnnouncedAs;

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
                //ownerDocumentNumber = blr.W15yQC.fnGetOwnerDocumentNumber(c, aDocumentsList);
                sRole = blr.W15yQC.fnGetNodeAttribute(c, 'role', null);
                sID = blr.W15yQC.fnGetNodeAttribute(c, 'id', null);
                sName = blr.W15yQC.fnGetNodeAttribute(c, 'name', null);
                sAction = blr.W15yQC.fnGetNodeAttribute(c, 'action', null);
                sMethod = blr.W15yQC.fnGetNodeAttribute(c, 'method', null);
                aFormsList.push(new blr.W15yQC.formElement(c, sXPath, sFormDescription, doc, ownerDocumentNumber, aFormsList.length + 1, sID, sName, sRole, sAction, sMethod));
              } else if ((blr.W15yQC.fnIsFormControlNode(c) || (bIncludeLabelControls == true && blr.W15yQC.fnIsLabelControlNode(c))) && blr.W15yQC.fnNodeIsHidden(c) == false) {
                // Document the form control
                xPath = blr.W15yQC.fnGetElementXPath(c);
                sFormElementDescription = blr.W15yQC.fnDescribeElement(c, 400);
                parentFormNode = blr.W15yQC.fnGetParentFormElement(c);
                sFormDescription = blr.W15yQC.fnDescribeElement(parentFormNode);
                sRole = blr.W15yQC.fnGetNodeAttribute(c, 'role', null);
                sTitle = blr.W15yQC.fnGetNodeAttribute(c, 'title', null);
                sLegendText = '';
                sLabelTagText = '';
                sEffectiveLabelText = '';
                if(blr.W15yQC.fnIsFormControlNode(c)) {
                  sLegendText = blr.W15yQC.fnGetLegendText(c);
                  sLabelTagText = blr.W15yQC.fnGetFormControlLabelTagText(c);
                  aLabel = blr.W15yQC.fnGetEffectiveLabel(c);
                  effectiveLabel=aLabel[0];
                  effectiveLabelSource=aLabel[1];
                } else {
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
                effectiveLabel = sLabelTagText;
                effectiveLabelSource = 'Label';
              }

                if(c.tagName.toLowerCase()=='input' && node.hasAttribute('type')) {
                  controlType='type='+node.getAttribute('type');
                } else {
                  controlType='';
                }
                if(blr.W15yQC.fnStringHasContent(sRole)) { controlType=blr.W15yQC.fnJoin(controlType,'role='+sRole,', '); }
                if(blr.W15yQC.fnStringHasContent(controlType)) { controlType='['+controlType+']'; }
                controlType=c.tagName.toLowerCase()+controlType;
                sAnnouncedAs = blr.W15yQC.fnJAWSAnnouncesControlAs(c);
                sARIALabelText = blr.W15yQC.fnGetARIALabelText(c);
                sARIADescriptionText = blr.W15yQC.fnGetARIADescriptionText(c, doc);
                sStateDescription = blr.W15yQC.fnGetNodeState(c);
                sID = c.getAttribute('id');
                sName = c.getAttribute('name');
                sValue = c.getAttribute('value');

                aFormControlsList.push(new blr.W15yQC.formControlElement(c, xPath, sFormElementDescription, parentFormNode, sFormDescription, doc, aFormControlsList.length, controlType, sRole, sID, sName, sTitle, sLegendText, sLabelTagText, sARIALabelText, sARIADescriptionText, effectiveLabel, effectiveLabelSource, sAnnouncedAs, sStateDescription, sValue));
              }
              blr.W15yQC.fnGetFormControls(doc, c, aDocumentsList, aFormsList, aFormControlsList);
            }
          }
        }
      }
      return [aFormsList, aFormControlsList];
    },

    fnAnalyzeFormControls: function (oW15yResults) {
      var aFormsList=oW15yResults.aForms, aFormControlsList=oW15yResults.aFormControls, aDocumentsList=oW15yResults.aDocuments,
          i, j, aSameNames, subForms, aSameLabelText, aSoundsTheSame, bShouldntHaveBoth, nodeTagName, nodeTypeValue,
          explictLabelsList, minDist, bCheckedLabel, sForValue, targetNode, iDist,
          bIsFormControl=false, iFormControlCount=0, iUnLabeledFormControlCount=0;

      oW15yResults.PageScore.bAllFormControlsAreLabeled=true;
      oW15yResults.PageScore.bMostFormControlsAreLabeled=true;
      oW15yResults.PageScore.bSomeFormControlsAreLabeled=true;
      oW15yResults.PageScore.bMostFormControlsAreNotLabeled=false;
      oW15yResults.PageScore.bAllRadioButtonsHaveLegends=true;
      oW15yResults.PageScore.bAllFormControlsHaveMeaningfulLabels=true;

      // TODO: Add check that name value is unique to a given form unless it is a radio button
      if(blr.W15yQC.sb == null) { blr.W15yQC.fnInitStringBundles(); }
      // Check if form labels are empty, not meaningful, the same as other form controls, or sound like any other label texts
      if (aFormsList != null && aFormsList.length > 0) {
        for (i = 0; i < aFormsList.length; i++) {
          //aFormsList[i].ownerDocumentNumber = blr.W15yQC.fnGetOwnerDocumentNumber(aFormsList[i].node, aDocumentsList);
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
          //aFormControlsList[i].ownerDocumentNumber = blr.W15yQC.fnGetOwnerDocumentNumber(aFormControlsList[i].node, aDocumentsList);
          aFormControlsList[i].parentFormNumber = blr.W15yQC.fnGetParentFormNumber(aFormControlsList[i].parentFormNode, aFormsList);
          aFormControlsList[i].legendText = blr.W15yQC.fnCleanSpaces(aFormControlsList[i].legendText);
          aFormControlsList[i].labelTagText = blr.W15yQC.fnCleanSpaces(aFormControlsList[i].labelTagText);
          aFormControlsList[i].title = blr.W15yQC.fnCleanSpaces(aFormControlsList[i].title);
          aFormControlsList[i].ARIALabelText = blr.W15yQC.fnCleanSpaces(aFormControlsList[i].ARIALabelText);
          aFormControlsList[i].ARIADescriptionText = blr.W15yQC.fnCleanSpaces(aFormControlsList[i].ARIADescriptionText);
          aFormControlsList[i].soundex = blr.W15yQC.fnSetIsEnglishLocale(aDocumentsList[aFormControlsList[i].ownerDocumentNumber-1].language) ? blr.W15yQC.fnGetSoundExTokens(aFormControlsList[i].effectiveLabel+' '+blr.W15yQC.fnJAWSAnnouncesControlAs(aFormControlsList[i].node)) : '';
        }

        for (i = 0; i < aFormControlsList.length; i++) {
          bIsFormControl=!blr.W15yQC.fnIsLabelControlNode(aFormControlsList[i].node);
          if(bIsFormControl==true && blr.W15yQC.fnFindImplicitLabelNode(aFormControlsList[i].node) != null) {
            blr.W15yQC.fnAddNote(aFormControlsList[i], 'frmCtrlImplicitLabel'); //
          }
          if (aFormControlsList[i].labelTagText == null && aFormControlsList[i].legendText == null && aFormControlsList[i].title == null &&
             (aFormControlsList[i].effectiveLabel == null || aFormControlsList[i].effectiveLabel.length < 1)) {
              blr.W15yQC.fnAddNote(aFormControlsList[i], 'frmCtrlNotLabeled'); //
              if(bIsFormControl) {
                oW15yResults.PageScore.bAllFormControlsAreLabeled=false;
                iUnLabeledFormControlCount++;
              }
          } else if (aFormControlsList[i].effectiveLabel != null && aFormControlsList[i].effectiveLabel.length > 0) {
            if (blr.W15yQC.fnOnlyASCIISymbolsWithNoLettersOrDigits(aFormControlsList[i].effectiveLabel)) {
              if(bIsFormControl) { oW15yResults.PageScore.bAllFormControlsAreLabeled=false; }
              if(bIsFormControl) { oW15yResults.PageScore.bAllFormControlsHaveMeaningfulLabels=false; }
              blr.W15yQC.fnAddNote(aFormControlsList[i], 'frmCtrlLabelOnlyASCII'); //
            } else if (blr.W15yQC.fnIsOnlyNextOrPreviousText(aFormControlsList[i].effectiveLabel) == true) {
              if(bIsFormControl) { oW15yResults.PageScore.bAllFormControlsHaveMeaningfulLabels=false; }
              blr.W15yQC.fnAddNote(aFormControlsList[i], 'frmCtrlLabelNextPrev'); //
            } else if (blr.W15yQC.fnIsMeaningfulFormLabelText(aFormControlsList[i].effectiveLabel) == false) {
              if(bIsFormControl) { oW15yResults.PageScore.bAllFormControlsHaveMeaningfulLabels=false; }
              blr.W15yQC.fnAddNote(aFormControlsList[i], 'frmCtrlLabelNotMeaningful'); //
            }

            if(bIsFormControl!=false) {
              iFormControlCount++;
              aSameLabelText = [];
              aSoundsTheSame = [];

              for (j = 0; j < aFormControlsList.length; j++) {
                if (j != i && blr.W15yQC.fnIsLabelControlNode(aFormControlsList[j].node)==false) {
                  if (aFormControlsList[j].effectiveLabel != null && aFormControlsList[j].effectiveLabel.length > 0) {
                    if (blr.W15yQC.fnStringsEffectivelyEqual(aFormControlsList[i].effectiveLabel.toLowerCase()+blr.W15yQC.fnJAWSAnnouncesControlAs(aFormControlsList[i].node),
                        aFormControlsList[j].effectiveLabel.toLowerCase()+blr.W15yQC.fnJAWSAnnouncesControlAs(aFormControlsList[j].node))) {
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
            oW15yResults.PageScore.bAllFormControlsAreLabeled=false;
            iUnLabeledFormControlCount++;
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
              oW15yResults.PageScore.bAllRadioButtonsHaveLegends=false;
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
              if(aFormControlsList[i].node.getElementsByTagName('input').length>0 || aFormControlsList[i].node.getElementsByTagName('button').length>0) {
                blr.W15yQC.fnAddNote(aFormControlsList[i], 'frmCtrlImplicitLabel'); //
              } else {
              blr.W15yQC.fnAddNote(aFormControlsList[i], 'frmCtrlEmptyLabel'); //
              }
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

          aFormControlsList[i] = blr.W15yQC.fnAnalyzeARIAMarkupOnNode(aFormControlsList[i].node, aFormControlsList[i]);
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
      if(iUnLabeledFormControlCount==0) {
        oW15yResults.PageScore.bAllFormControlsAreLabeled=true;
        oW15yResults.PageScore.bMostFormControlsAreLabeled=true;
        oW15yResults.PageScore.bSomeFormControlsAreLabeled=true;
        oW15yResults.PageScore.bMostFormControlsAreNotLabeled=false;
      } else if(iUnLabeledFormControlCount<iFormControlCount) {
        oW15yResults.PageScore.bAllFormControlsAreLabeled=false;
        oW15yResults.PageScore.bSomeFormControlsAreLabeled=true;
        if((iFormControlCount>20 && iUnLabeledFormControlCount<5) ||
           ((iFormControlCount<=20 && iFormControlCount>8) && iUnLabeledFormControlCount<3) ||
           (iFormControlCount>4 && iUnLabeledFormControlCount<2)) {
          oW15yResults.PageScore.bMostFormControlsAreLabeled=true;
        } else {
          oW15yResults.PageScore.bMostFormControlsAreLabeled=false;
          if(iUnLabeledFormControlCount<2 || iUnLabeledFormControlCount>iFormControlCount/2) {
            oW15yResults.PageScore.bMostFormControlsAreNotLabeled=true;
          }
        }
      } else {
        oW15yResults.PageScore.bAllFormControlsAreLabeled=false;
        oW15yResults.PageScore.bMostFormControlsAreLabeled=false;
        oW15yResults.PageScore.bSomeFormControlsAreLabeled=false;
        oW15yResults.PageScore.bMostFormControlsAreNotLabeled=true;
      }
      blr.W15yQC.fnUpdateWarningAndFailureCounts(aFormControlsList);
    },

    fnDisplayFormResults: function (rd, aFormsList) {
      var div, table, msgHash, tbody, i, fce, sNotes, sClass;
      div = rd.createElement('div');
      div.setAttribute('id', 'AIFormsList');
      div.setAttribute('class', 'AISection');

      blr.W15yQC.fnAppendExpandContractHeadingTo(div, blr.W15yQC.fnMakeHeadingCountsString(aFormsList,'hrsForms','hrsNoForms'));

      if (aFormsList && aFormsList.length > 0) {
        table = rd.createElement('table');
        msgHash = new blr.W15yQC.HashTable();
        table.setAttribute('id', 'AIFormsTable');
        table = blr.W15yQC.fnCreateTableHeaders(table, [blr.W15yQC.fnGetString('hrsTHNumberSym'), blr.W15yQC.fnGetString('hrsTHOwnerDocNumber'),
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
          blr.W15yQC.fnAppendTableRow(tbody, [i + 1, fce.ownerDocumentNumber, blr.W15yQC.fnMakeWebSafe(fce.nodeDescription), fce.name, fce.action, fce.method, fce.stateDescription, sNotes], sClass);
        }
        table.appendChild(tbody);
        div.appendChild(table);
        blr.W15yQC.fnMakeTableSortable(div, rd, 'AIFormsTable');
      } else {
        blr.W15yQC.fnAppendPElementTo(div, blr.W15yQC.fnGetString('hrsNoFormsDetected'));
      }
      rd.body.appendChild(div);
    },

    fnDisplayFormControlResults: function (rd, aFormControlsList, bQuick) {
      var div, i, ak, bHasARIALabel, bHasLegend, bHasLabel, bHasTitle, bHasARIADescription, bHasRole, bHasValue, bHasStateDescription, bHasMultipleDocs,
          aTableHeaders, table, msgHash, tbody, fce, sNotes, sClass, aTableCells;

      div = rd.createElement('div');
      div.setAttribute('id', 'AIFormControlsList');
      div.setAttribute('class', 'AISection');

      blr.W15yQC.fnAppendExpandContractHeadingTo(div, blr.W15yQC.fnMakeHeadingCountsString(aFormControlsList,'hrsFormsCtrls','hrsNoFormCtrls'));

      if (aFormControlsList && aFormControlsList.length > 0) {
        bHasARIALabel = false;
        bHasLabel = false;
        bHasLegend = false;
        bHasTitle = false;
        bHasARIADescription = false;
        bHasRole = false;
        bHasValue = false;
        bHasStateDescription = false;
        bHasMultipleDocs = false;
        for (i = 0; i < aFormControlsList.length; i++) {
          ak = aFormControlsList[i];
          if (ak.ownerDocumentNumber>1) {
            bHasMultipleDocs=true;
          }
          if (ak.legendText != null && ak.legendText.length > 0) { bHasLegend = true; }
          if (ak.labelTagText != null && ak.labelTagText.length > 0) { bHasLabel = true; }
          if (ak.title != null && ak.title.length > 0) { bHasTitle = true; }
          if (ak.role != null && ak.role.length > 0) { bHasRole = true; }
          if (ak.value != null && ak.value.length > 0) { bHasValue = true; }
          if (ak.ARIALabelText != null && ak.ARIALabelText.length > 0) { bHasARIALabel = true; }
          if (ak.ARIADescriptionText != null && ak.ARIADescriptionText.length > 0) { bHasARIADescription = true; }
          if (ak.stateDescription != null && ak.stateDescription.length > 0) { bHasStateDescription = true; }
        }

        if (bQuick==true) {
          aTableHeaders = [blr.W15yQC.fnGetString('hrsTHNumberSym'), blr.W15yQC.fnGetString('hrsTHTitle'), blr.W15yQC.fnGetString('hrsTHNotes')];

          table = rd.createElement('table');
          table.setAttribute('id', 'AIFormControlsTable');
          table = blr.W15yQC.fnCreateTableHeaders(table, aTableHeaders);
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
            blr.W15yQC.fnAppendTableRow(tbody, [i + 1, blr.W15yQC.fnJoin(blr.W15yQC.fnStringHasContent(fce.effectiveLabel)?fce.effectiveLabel:'unlabeled', fce.announcedAs,' '), sNotes], sClass);
          }
        } else {
          aTableHeaders = [blr.W15yQC.fnGetString('hrsTHNumberSym'), blr.W15yQC.fnGetString('hrsTHFormNum')];
          if (bHasMultipleDocs) { aTableHeaders.push(blr.W15yQC.fnGetString('hrsTHOwnerDocNumber')); }
          aTableHeaders.push(blr.W15yQC.fnGetString('hrsTHFormCtrlEl'));
          if (bHasLegend) { aTableHeaders.push(blr.W15yQC.fnGetString('hrsTHLegend')); }
          if (bHasLabel) { aTableHeaders.push(blr.W15yQC.fnGetString('hrsTHLabelText')); }
          if (bHasTitle) { aTableHeaders.push(blr.W15yQC.fnGetString('hrsTHTitle')); }
          if (bHasARIALabel) { aTableHeaders.push(blr.W15yQC.fnGetString('hrsTHARIALabel')); }
          aTableHeaders.push(blr.W15yQC.fnGetString('hrsTHEffectiveLabel'));
          aTableHeaders.push(blr.W15yQC.fnGetString('hrsTHEffectiveLabelSource'));
          if (bHasARIADescription) { aTableHeaders.push(blr.W15yQC.fnGetString('hrsTHARIADescription')); }
          aTableHeaders.push(blr.W15yQC.fnGetString('hrsTHName'));
          aTableHeaders.push(blr.W15yQC.fnGetString('hrsTHValue'));
          if (bHasStateDescription) { aTableHeaders.push(blr.W15yQC.fnGetString('hrsTHState')); }
          aTableHeaders.push(blr.W15yQC.fnGetString('hrsTHNotes'));

          table = rd.createElement('table');
          table.setAttribute('id', 'AIFormControlsTable');
          table = blr.W15yQC.fnCreateTableHeaders(table, aTableHeaders);
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
            aTableCells = [i + 1, fce.parentFormNumber];
            if (bHasMultipleDocs) { aTableCells.push(fce.ownerDocumentNumber); }
            aTableCells.push(blr.W15yQC.fnMakeWebSafe(fce.nodeDescription));
            if (bHasLegend) { aTableCells.push(fce.legendText); }
            if (bHasLabel) { aTableCells.push(fce.labelTagText); }
            if (bHasTitle) { aTableCells.push(fce.title); }
            if (bHasARIALabel) { aTableCells.push(fce.ARIALabelText); }
            aTableCells.push(blr.W15yQC.fnJoin(blr.W15yQC.fnStringHasContent(fce.effectiveLabel)?fce.effectiveLabel:'unlabeled', fce.announcedAs,' '));
            aTableCells.push(fce.effectiveLabelSource);
            if (bHasARIADescription) { aTableCells.push(fce.ARIADescriptionText); }
            aTableCells.push(fce.name);
            aTableCells.push(fce.value);
            if (bHasStateDescription) { aTableCells.push(fce.stateDescription); }
            aTableCells.push(sNotes);

            blr.W15yQC.fnAppendTableRow(tbody, aTableCells, sClass);
          }
        }

        table.appendChild(tbody);
        div.appendChild(table);
        blr.W15yQC.fnMakeTableSortable(div, rd, 'AIFormControlsTable');
      } else {
        blr.W15yQC.fnAppendPElementTo(div, blr.W15yQC.fnGetString('hrsNoFormsCtrlsDetected'));
      }
      rd.body.appendChild(div);
    },


    fnGetLinks: function (doc, rootNode, aLinksList) {
      var c, frameDocument, xPath, nodeDescription, role, text, title, target, href, sState, aLabel, effectiveLabel, effectiveLabelSource;
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
              if (c.tagName && blr.W15yQC.fnNodeIsHidden(c) == false && (blr.W15yQC.bQuick==false || blr.W15yQC.fnStringHasContent(c.getAttribute('href'))==true)) { // TODO: QA bquick
                if(c.tagName.toLowerCase()=='a') {  // document the link
                  xPath = blr.W15yQC.fnGetElementXPath(c);
                  nodeDescription = blr.W15yQC.fnDescribeElement(c, 400);
                  role = blr.W15yQC.fnGetNodeAttribute(c, 'role', null);
                  aLabel = blr.W15yQC.fnGetEffectiveLabel(c);
                  effectiveLabel=aLabel[0];
                  effectiveLabelSource=aLabel[1];
                  text = blr.W15yQC.fnGetDisplayableTextRecursively(c);
                  title = blr.W15yQC.fnGetNodeAttribute(c, 'title', null);
                  target = blr.W15yQC.fnGetNodeAttribute(c, 'target', null);
                  href = blr.W15yQC.fnGetNodeAttribute(c, 'href', null);
                  sState = blr.W15yQC.fnGetNodeState(c);
                  aLinksList.push(new blr.W15yQC.linkElement(c, xPath, nodeDescription, doc, aLinksList.length, role, sState, effectiveLabel, effectiveLabelSource, text, title, target, href));
                } else if(c.tagName.toLowerCase()=='area') { // TODO: Any checks we need to do to make sure this is a valid area before including?
                  xPath = blr.W15yQC.fnGetElementXPath(c);
                  nodeDescription = blr.W15yQC.fnDescribeElement(c, 400);
                  role = blr.W15yQC.fnGetNodeAttribute(c, 'role', null);
                  aLabel = blr.W15yQC.fnGetEffectiveLabel(c);
                  effectiveLabel=aLabel[0];
                  effectiveLabelSource=aLabel[1];
                  text=aLabel[0]; // TODO: Vet this with JAWS!
                  title = blr.W15yQC.fnGetNodeAttribute(c, 'title', null);
                  target = blr.W15yQC.fnGetNodeAttribute(c, 'target', null);
                  href = blr.W15yQC.fnGetNodeAttribute(c, 'href', null);
                  sState = blr.W15yQC.fnGetNodeState(c);
                  aLinksList.push(new blr.W15yQC.linkElement(c, xPath, nodeDescription, doc, aLinksList.length, role, sState, effectiveLabel, effectiveLabelSource, text, title, target, href));
                }
              }
              blr.W15yQC.fnGetLinks(doc, c, aLinksList);
            }
          }
        }
      }
      return aLinksList;
    },

    fnThreeConsecutiveLetters: function(s1,s2,s3) {
      var re=/^[a-z0-9] [a-z0-9] [a-z0-9]$/i;
      if (s1!=null && s2!=null && s3!=null && re.test(s1+' '+s2+' '+s3)) {
        if ( (s1.charCodeAt(0)+1)==(s2.charCodeAt(0)) && (s2.charCodeAt(0)+1)==(s3.charCodeAt(0)) ) {
          return true;
        }
      }
      return false;
    },
    
    fnThreeConsecutiveInts: function(s1,s2,s3) {
      var re=/^\d+ \d+ \d+$/;
      if (re.test(s1+' '+s2+' '+s3)) {
        if ((parseInt(s1)+1)==parseInt(s2) && (parseInt(s2)+1)==parseInt(s3)) {
          return true;
        }
      }
      return blr.W15yQC.fnThreeConsecutiveLetters(s1,s2,s3);
    },
 
    fnAnalyzeLinks: function (oW15yResults, progressWindow) { // TODO: Eliminate double sounds like checking for each pair of links, only do it once!
      var aLinksList=oW15yResults.aLinks, aDocumentsList=oW15yResults.aDocuments, i, aChildImages, j, linkText, maxRect, bHrefsAreEqual, bIsALink,
          bLinkTextsAreDifferent, bOnclickValuesAreDifferent, sHref, sTargetId, sSamePageLinkTarget, aTargetLinksList, iTargetedLink, targetNode, skipStatusUpdateCounter=1;
      if(blr.W15yQC.sb == null) { blr.W15yQC.fnInitStringBundles(); }

      oW15yResults.PageScore.bAllLinksHaveText=true;
      oW15yResults.PageScore.bAllLinksHaveMeaningfulText=true;
      oW15yResults.PageScore.bAllLinksAreUnique=true;
      oW15yResults.PageScore.bNoLinksHaveTitleTextDiffThanLinkText=true;

      // Check if link Texts are empty, too short, only ASCII symbols, the same as other link texts, or sounds like any other link texts
      for (i = 0; i < aLinksList.length; i++) {
        aLinksList[i].listedByAT=true;
        if (blr.W15yQC.fnStringHasContent(aLinksList[i].effectiveLabel)==true) {
          aLinksList[i].soundex = blr.W15yQC.fnSetIsEnglishLocale(aDocumentsList[aLinksList[i].ownerDocumentNumber-1].language) ? blr.W15yQC.fnGetSoundExTokens(aLinksList[i].effectiveLabel) : '';
        } else {
          aLinksList[i].soundex = '';
        }
        if (aLinksList[i].title!=null) {
          aLinksList[i].title = blr.W15yQC.fnCleanSpaces(aLinksList[i].title);
        }
      }

      for (i = 0; i < aLinksList.length; i++) {
        if(i>20 && (i % 5)==0){
          if(progressWindow != null) {
            skipStatusUpdateCounter=skipStatusUpdateCounter-1;
            if (skipStatusUpdateCounter<1) {
              progressWindow.fnUpdateProgress('Inspecting Links ' + (Math.round(100*i/aLinksList.length)).toString()+'%', Math.round(51*i/aLinksList.length)+24);
              skipStatusUpdateCounter=3;
              blr.W15yQC.fnDoEvents();
            }
          }
        }
        if(aLinksList[i]==null || aLinksList[i].node==null || !aLinksList[i].node.hasAttribute) continue;

        aChildImages=aLinksList[i].node.getElementsByTagName('img');
        if(aChildImages != null && aChildImages.length>0) {
          for(j=0; j< aChildImages.length; j++) {
            if(aChildImages[j].hasAttribute('ismap')==true) {
              blr.W15yQC.fnAddNote(aLinksList[i], 'lnkServerSideImageMap'); // TODO: QA This, determine how ismap is actually used
            }
          }
        }

        if (aLinksList[i].href == null && aLinksList[i].node.hasAttribute('name') == false && aLinksList[i].node.hasAttribute('id') == false) {
          aLinksList[i].listedByAT=false;
          blr.W15yQC.fnAddNote(aLinksList[i], 'lnkInvalid'); // QA This... what if href=""
        } else if (blr.W15yQC.fnStringHasContent(aLinksList[i].node.getAttribute('href'))==false &&
                   (blr.W15yQC.fnStringHasContent(aLinksList[i].node.getAttribute('title')) == true ||
                    blr.W15yQC.fnStringHasContent(aLinksList[i].node.getAttribute('alt')) == true ||
                    blr.W15yQC.fnStringHasContent(aLinksList[i].node.getAttribute('target')) == true ||
                    blr.W15yQC.fnStringHasContent(aLinksList[i].effectiveLabel) == true)) {
                      aLinksList[i].listedByAT=false;
                      blr.W15yQC.fnAddNote(aLinksList[i], 'lnkLinkMissingHrefValue'); // QA this. what if href=""
                }

        if(aLinksList[i].node.hasAttribute('alt') && blr.W15yQC.fnCanTagHaveAlt(aLinksList[i].node.tagName)==false) {
          blr.W15yQC.fnAddNote(aLinksList[i], 'lnkHasInvalidAltAttribute'); //
        }

        linkText = blr.W15yQC.fnTrim(aLinksList[i].effectiveLabel.toLowerCase());

        if (aLinksList[i].text == null && blr.W15yQC.fnStringHasContent(aLinksList[i].effectiveLabel)==false) {
          oW15yResults.PageScore.bAllLinksHaveText=false;
          blr.W15yQC.fnAddNote(aLinksList[i], 'lnkTxtMissing'); //
        } else if (blr.W15yQC.fnStringHasContent(aLinksList[i].effectiveLabel)==true) { // TODO: QA All empty link scenarios and make sure we get the right errors
          if (blr.W15yQC.fnOnlyASCIISymbolsWithNoLettersOrDigits(linkText)) {
            oW15yResults.PageScore.bAllLinksHaveText=false;
            oW15yResults.PageScore.bAllLinksHaveMeaningfulText=false;
            blr.W15yQC.fnAddNote(aLinksList[i], 'lnkTxtOnlyASCII'); //
          } else if (blr.W15yQC.fnIsOnlyNextOrPreviousText(linkText)) {
            oW15yResults.PageScore.bAllLinksHaveMeaningfulText=false;
            blr.W15yQC.fnAddNote(aLinksList[i], 'lnkTxtNextPrev'); //
          } else if (linkText.match(/^link to /i)) { // TODO: Make functions for testing for this.
            blr.W15yQC.fnAddNote(aLinksList[i], 'lnkTxtBeginWithLink'); //
          } else if (blr.W15yQC.fnIsMeaningfulLinkText(linkText) == false) {
            if (aLinksList.length>2 && ((i>1 && blr.W15yQC.fnThreeConsecutiveInts(aLinksList[i-2].effectiveLabel,aLinksList[i-1].effectiveLabel,aLinksList[i].effectiveLabel)) ||
                (i>0 && i+1<aLinksList.length && blr.W15yQC.fnThreeConsecutiveInts(aLinksList[i-1].effectiveLabel,aLinksList[i].effectiveLabel,aLinksList[i+1].effectiveLabel)) ||
                (i+2<aLinksList.length && blr.W15yQC.fnThreeConsecutiveInts(aLinksList[i].effectiveLabel,aLinksList[i+1].effectiveLabel,aLinksList[i+2].effectiveLabel)))){
              //found sequence of numbered links.
            } else {
              oW15yResults.PageScore.bAllLinksHaveMeaningfulText=false;
              blr.W15yQC.fnAddNote(aLinksList[i], 'lnkTxtNotMeaningful'); //
            }
          }
          maxRect = blr.W15yQC.fnGetMaxNodeRectangleDimensions(aLinksList[i].node);

          if(maxRect != null && maxRect[0] < 14 && maxRect[1] < 14 && (maxRect[0] > 0 && maxRect[1]>0) &&
             blr.W15yQC.fnNodeIsMasked(aLinksList[i].node)==false && blr.W15yQC.fnNodeIsOffScreen(aLinksList[i].node)==false) {
            blr.W15yQC.fnAddNote(aLinksList[i], 'lnkTooSmallToHit', [maxRect[0],maxRect[1]]); // TODO: QA This, Check order
          }

          if(aLinksList[i].node.hasAttribute('href') || aLinksList[i].node.hasAttribute('onclick')) { // TODO: Look to see if an onclick handler has been applied
            for (j = i+1; j < aLinksList.length; j++) {
              if(aLinksList[j].href != null || aLinksList[j].node.hasAttribute('onclick')) {
                bHrefsAreEqual = blr.W15yQC.fnURLsAreEqual(aLinksList[i].doc.URL, aLinksList[i].href, aLinksList[j].doc.URL, aLinksList[j].href); // TODO: Optimize this
                bLinkTextsAreDifferent = blr.W15yQC.fnLinkTextsAreDifferent(aLinksList[i].effectiveLabel, aLinksList[j].effectiveLabel); // TODO: Optimize this
                if (aLinksList[j].effectiveLabel && aLinksList[j].effectiveLabel.length > 0) {
                  if (bLinkTextsAreDifferent == false && (bHrefsAreEqual == false || aLinksList[i].href == null || aLinksList[i].href.length < 1)) {
                    aLinksList[i].aSameLinkText.push(j+1);
                    aLinksList[j].aSameLinkText.push(i+1);
                  } else if (bHrefsAreEqual == false && aLinksList[i].soundex == aLinksList[j].soundex) {
                    aLinksList[i].aSoundsTheSame.push(j+1);
                    aLinksList[j].aSoundsTheSame.push(i+1);
                  }
                }

                if (aLinksList[i].href != null && bHrefsAreEqual == true && bLinkTextsAreDifferent == true) {
                  if(aLinksList[i].node.hasAttribute('onclick') == true || aLinksList[j].node.hasAttribute('onclick') == true) {
                    if(!blr.W15yQC.fnScriptValuesAreDifferent(blr.W15yQC.fnGetNodeAttribute(aLinksList[i].node,'onclick',null), blr.W15yQC.fnGetNodeAttribute(aLinksList[j].node,'onclick',null))) {
                      aLinksList[i].aSameHrefAndOnclick.push(j+1);
                      aLinksList[j].aSameHrefAndOnclick.push(i+1);
                    }
                  } else { // unless javascript:;, #, javascript:void(0)
                    if(/^\s*(#|javascript:;?|javascript:\s*void\(\s*0\s*\)\s*;?)\s*$/i.test(aLinksList[i].href)==false) { // TODO: premake RE to optimize?
                      aLinksList[i].aDiffTextSameHref.push(j+1);
                      aLinksList[j].aDiffTextSameHref.push(i+1);
                    }
                  }
                }
              }
            }
          }

          if(aLinksList[i].aSameLinkText.length>0) {
            oW15yResults.PageScore.bAllLinksAreUnique=false;
            blr.W15yQC.fnAddNote(aLinksList[i], 'lnkTxtNotUnique', [blr.W15yQC.fnCutoffString(aLinksList[i].aSameLinkText.toString(),99)]); //
          }

          if(aLinksList[i].aSoundsTheSame.length>0) {
            oW15yResults.PageScore.bAllLinksAreUnique=true;
            blr.W15yQC.fnAddNote(aLinksList[i], 'lnkTxtDoesntSoundUnique',[blr.W15yQC.fnCutoffString(aLinksList[i].aSoundsTheSame.toString(),99)]); //
          }

          if(aLinksList[i].aSameHrefAndOnclick.length>0) {
            blr.W15yQC.fnAddNote(aLinksList[i], 'lnkTxtDiffSameHrefOnclick',[blr.W15yQC.fnCutoffString(aLinksList[i].aSameHrefAndOnclick.toString(),99)]); //
          }

          if(aLinksList[i].aDiffTextSameHref.length>0) {
            blr.W15yQC.fnAddNote(aLinksList[i], 'lnkTxtDiffSameHref',[blr.W15yQC.fnCutoffString(aLinksList[i].aDiffTextSameHref.toString(),99)]); //
          }

        } else {
          if (aLinksList[i].node.hasAttribute('href') == true) {
            oW15yResults.PageScore.bAllLinksHaveText=false;
            blr.W15yQC.fnAddNote(aLinksList[i], 'lnkTxtEmpty'); // QA This
          }
        }

        if (aLinksList[i].node!=null && aLinksList[i].node.hasAttribute('target')==true && /_blank/i.test(aLinksList[i].node.getAttribute('target')) &&
            /opens (in )?(a )?new window/i.test(aLinksList[i].effectiveLabel)==false) {
          blr.W15yQC.fnAddNote(aLinksList[i], 'lnkOpensInANewWindowWOWarning'); // QA This
        }

        if (aLinksList[i].node!=null && aLinksList[i].node.hasAttribute('onclick')==true && /(window\.open|popupUrl)\(/.test(aLinksList[i].node.getAttribute('onclick')) &&
            /opens (in )?(a )?new window/i.test(aLinksList[i].effectiveLabel)==false) {
          blr.W15yQC.fnAddNote(aLinksList[i], 'lnkOpensInANewWindowWOWarning'); // QA This
        }


        if (aLinksList[i].node!=null && aLinksList[i].node.hasAttribute('href')==true && /javascript.*(window\.open|popupUrl)\(/i.test(aLinksList[i].node.getAttribute('href')) &&
            /opens (in )?(a )?new window/i.test(aLinksList[i].effectiveLabel)==false) {
          blr.W15yQC.fnAddNote(aLinksList[i], 'lnkOpensInANewWindowWOWarning'); // QA This
        }

        if(blr.W15yQC.fnStringHasContent(aLinksList[i].title) && blr.W15yQC.fnStringsEffectivelyEqual(aLinksList[i].title, linkText)==false) {
          oW15yResults.PageScore.bNoLinksHaveTitleTextDiffThanLinkText=false;
          blr.W15yQC.fnAddNote(aLinksList[i], 'lnkTitleTxtDiffThanLinkTxt'); // TODO: QA This!
        }

        if (/title attribute/i.test(aLinksList[i].effectiveLabelSource)) {
          blr.W15yQC.fnAddNote(aLinksList[i], 'lnkTextComesOnlyFromTitle'); // TODO: QA This!
        } else if (/alt attribute/i.test(aLinksList[i].effectiveLabelSource) && blr.W15yQC.fnCanTagHaveAlt(aLinksList[i].node.tagName)==false) {
          blr.W15yQC.fnAddNote(aLinksList[i], 'lnkTextComesOnlyFromAlt'); // TODO: QA This!
        }

        if (aLinksList[i].node.hasAttribute('href') == true) {
          // TODO: Check for ambiguious targets - duplicate IDs or Names
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

              if(aDocumentsList[aLinksList[i].ownerDocumentNumber-1].idHashTable.getItem(sTargetId)>1) {
                blr.W15yQC.fnAddNote(aLinksList[i], 'lnkTargetIDisNotUnique'); //
              }

              // is link target a valid ID?
              if(blr.W15yQC.fnIsValidHtmlID(sTargetId)==false) {
                blr.W15yQC.fnAddNote(aLinksList[i], 'lnkTargetIDNotValid'); //
              }

            }
          }
        } else if (blr.W15yQC.fnStringHasContent(aLinksList[i].node.getAttribute('name')+aLinksList[i].node.getAttribute('id'))==true) {
          aLinksList[i].listedByAT=false;
          blr.W15yQC.fnAddNote(aLinksList[i], 'lnkIsNamedAnchor'); //
        }

        if(aLinksList[i].node != null && aLinksList[i].node.hasAttribute('onclick') == true && aLinksList[i].node.hasAttribute('onkeypress') == true &&
           aLinksList[i].node.getAttribute('onclick').length>0 && aLinksList[i].node.getAttribute('onkeypress').length>0) { // TODO: Make this check more sophisticated
            if(/^\s*return\s*\(*\s*false\)*\s*\s*;*\s*$/.test(aLinksList[i].node.getAttribute('onkeypress').toLowerCase())==false) {
              blr.W15yQC.fnAddNote(aLinksList[i], 'lnkHasBothOCandOK'); //
            }
        }

        aLinksList[i] = blr.W15yQC.fnAnalyzeARIAMarkupOnNode(aLinksList[i].node, aLinksList[i]);

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

    fnDisplayLinkResults: function (rd, aLinksList, bQuick) {
      var div, table, msgHash, tbody, i, sNotes, sClass, bHasMultipleDocs=false, colHeaders=[], colValues=[];
      div = rd.createElement('div');
      div.setAttribute('id', 'AILinksList');
      div.setAttribute('class', 'AISection');

      blr.W15yQC.fnAppendExpandContractHeadingTo(div, blr.W15yQC.fnMakeHeadingCountsString(aLinksList,'hrsLinks','hrsNoLinks'));

      if (aLinksList && aLinksList.length > 0) {
        table = rd.createElement('table');
        table.setAttribute('id', 'AILinksTable');
        if(bQuick==true) {
          table = blr.W15yQC.fnCreateTableHeaders(table, [blr.W15yQC.fnGetString('hrsTHNumberSym'),blr.W15yQC.fnGetString('hrsTHEffectiveLabel'),
                                                              blr.W15yQC.fnGetString('hrsTHNotes')]);
          msgHash = new blr.W15yQC.HashTable();

          tbody = rd.createElement('tbody');
          for (i = 0; i < aLinksList.length; i++) {
            if (aLinksList[i].listedByAT!=false) {
              sNotes = blr.W15yQC.fnMakeHTMLNotesList(aLinksList[i], msgHash);
              sClass = '';
              if (aLinksList[i].failed) {
                sClass = 'failed';
              } else if (aLinksList[i].warning) {
                sClass = 'warning';
              }
              blr.W15yQC.fnAppendTableRow(tbody, [i + 1, aLinksList[i].effectiveLabel, sNotes], sClass);
            }
          }
        } else {
          colHeaders=[blr.W15yQC.fnGetString('hrsTHNumberSym'), blr.W15yQC.fnGetString('hrsTHLinkElement'),
                      blr.W15yQC.fnGetString('hrsTHOwnerDocNumber'), blr.W15yQC.fnGetString('hrsTHEffectiveLabel'),
                      blr.W15yQC.fnGetString('hrsTHEffectiveLabelSource'), blr.W15yQC.fnGetString('hrsTHHref'),
                      blr.W15yQC.fnGetString('hrsTHState'), blr.W15yQC.fnGetString('hrsTHNotes')];
          for (i=0;i<aLinksList.length; i++) {
            if (aLinksList[i].ownerDocumentNumber>1) {
              bHasMultipleDocs=true;
              break;
            }
          }
          if (bHasMultipleDocs==false) {
            colHeaders.splice(2,1);
          }
          table = blr.W15yQC.fnCreateTableHeaders(table, colHeaders);
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
            colValues=[i + 1, blr.W15yQC.fnMakeWebSafe(aLinksList[i].nodeDescription), aLinksList[i].ownerDocumentNumber, aLinksList[i].effectiveLabel, aLinksList[i].effectiveLabelSource, blr.W15yQC.fnCutoffString(aLinksList[i].href,500), aLinksList[i].stateDescription, sNotes];
            if (bHasMultipleDocs==false) {
              colValues.splice(2,1);
            }
            blr.W15yQC.fnAppendTableRow(tbody, colValues, sClass);
          }
        }
        table.appendChild(tbody);
        div.appendChild(table);
        blr.W15yQC.fnMakeTableSortable(div, rd, 'AILinksTable');
      } else {
        blr.W15yQC.fnAppendPElementTo(div, blr.W15yQC.fnGetString('hrsNoLinksDetected'));
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

    fnAnalyzeTables: function (oW15yResults) {
      var aTablesList=oW15yResults.aTables, aDocumentsList=oW15yResults.aDocuments,
      i, node, j, maxColumns, rowCount, bHasThead, bHasMultipleTheads, bHasTfoot, bHasMultipleTfoots, bHasTbody, bHasMultipleTbodys, bHasRowsOutsideOfTheadAndTbody,
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

      oW15yResults.PageScore.bHasTables=false;
      oW15yResults.PageScore.bLayoutTablesAreMarkedPresentational=true;
      oW15yResults.PageScore.bAllContentInDataTablesCoveredByHeader=true;
      oW15yResults.PageScore.bDataTablesAreNotComplex=true;
      oW15yResults.PageScore.bLargeDataTablesHaveCaptionsOrSummary=true;


      for (i = 0; i < aTablesList.length; i++) {
        //aTablesList[i].ownerDocumentNumber = blr.W15yQC.fnGetOwnerDocumentNumber(aTablesList[i].node, aDocumentsList);
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
                      if(columnRowSpans.length>0) {
                        while(columnRowSpans[columnsInThisRow]>0) {
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
                        while(columnRowSpans[columnsInThisRow]>0) { // TODO: This is generating reference to undefined property columnRowSpans[columnsInThisRow] warnings
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
            } else if(blr.W15yQC.fnIsMeaningfulTableSummaryOrCaption(aTablesList[i].summary)==false) {
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
      div.setAttribute('class', 'AISection');

      blr.W15yQC.fnAppendExpandContractHeadingTo(div, blr.W15yQC.fnMakeHeadingCountsString(aTablesList,'hrsTables','hrsNoTables'));

      if (aTablesList && aTablesList.length > 0) {
        table = rd.createElement('table');
        table.setAttribute('id', 'AITablesTable');
        // TODO: Make summary and caption columns so they only appear when needed.
        table = blr.W15yQC.fnCreateTableHeaders(table, [blr.W15yQC.fnGetString('hrsTHNumberSym'), blr.W15yQC.fnGetString('hrsTHTableElement'),
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
          blr.W15yQC.fnAppendTableRow(tbody, [i + 1, blr.W15yQC.fnMakeWebSafe(aTablesList[i].nodeDescription), aTablesList[i].ownerDocumentNumber, aTablesList[i].summary, aTablesList[i].caption, sSize, aTablesList[i].state, sNotes], sClass);
        }
        table.appendChild(tbody);
        div.appendChild(table);
        blr.W15yQC.fnMakeTableSortable(div, rd, 'AITablesTable');
      } else {
        blr.W15yQC.fnAppendPElementTo(div, blr.W15yQC.fnGetString('hrsNoTablesDetected'));
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
                if(blr.W15yQC.fnStringHasContent(sID)) {
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
    
    fnCheckMandates: function(oW15yQCReport) {
      var mandates, i, j, k, m, results, doc, nodesSnapshot, el, text, bFound, sLogic, re, result, mo, sMsg='';
      
      if (oW15yQCReport!=null || !oW15yQCReport.iMandateFailuresCount) {
        oW15yQCReport.iMandateFailuresCount=0;
      }

      if (oW15yQCReport!=null && oW15yQCReport.aDocuments!=null && Application.prefs.getValue('extensions.W15yQC.extensions.W15yQC.mandatesEnabled',false)) {
        mandates=JSON.parse(Application.prefs.getValue("extensions.W15yQC.mandates","[]"));
        if (mandates!=null) {
          for (i=0;i<mandates.length;i++) {
            m=mandates[i];
            if (m.enabled==true && m.tests!=null && m.tests.length>0) {
              doc=oW15yQCReport.aDocuments[0].doc;
              results=[];
              for (j=0;j<m.tests.length;j++) {
                if (blr.W15yQC.fnStringHasContent(m.tests[i].xPath)) {
                  nodesSnapshot = doc.evaluate(m.tests[i].xPath, doc, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null );
                  if (nodesSnapshot!=null && nodesSnapshot.snapshotLength>0) {
                    bFound=false;
                    for (k=0;k<nodesSnapshot.snapshotLength;k++) {
                      el=nodesSnapshot.snapshotItem(k);
                      if (blr.W15yQC.fnStringHasContent(m.tests[i].text)) {
                        if (el.textContent.toLowerCase().indexOf(m.tests[i].text.toLowerCase())>=0) {
                          bFound=true;
                          break;
                        }
                      } else {
                        bFound=true;
                        break;
                      }
                    }
                    results.push(bFound);
                  } else {
                    results.push(false);
                  }
                } else { // text only search, no xPath
                  if (doc.textContent.toLowerCase().indexOf(m.tests[i].text.toLowerCase())>=0) {
                    results.push(true);
                  } else {
                    results.push(false);
                  }
                }
              }
              if (results.length!=m.tests.length) {
                alert('fnCheckMandates code logic failure -- results length does not match tests length.');
                result=false;
              } else {
                // evaluate logic results
                sLogic=m.logic;
                sLogic=sLogic.replace(/\bnot\b/ig,'!');
                sLogic=sLogic.replace(/\band\b/ig,'&');
                sLogic=sLogic.replace(/\bor\b/ig,'|');
                if(/^[\d\s\(\)\&\|\!]+$/.test(sLogic)) {
                  for(j=m.tests.length;j>=1;j--) {
                    re=new RegExp(j.toString(), 'g');
                    if (re.test(sLogic)) {
                      sLogic=sLogic.replace(re,results[j-1].toString());
                    }
                  }
                  try {
                    result=eval(sLogic);
                  } catch(ex) {
                    result=false;
                    sMsg='Syntax error in logic string.';
                  }
                }
              }
              if(oW15yQCReport.aMandates==null) {
                oW15yQCReport.aMandates=[];
                oW15yQCReport.iMandateFailuresCount=0;
              }
              mo={title:m.title, result:result, weight:m.weight, message:sMsg};
              oW15yQCReport.aMandates.push(mo);
              if (!result) {
                oW15yQCReport.iMandateFailuresCount++;
              }
            }
          }
        }
      }
    },

    fnDisplayMandatesCheckResults: function (rd, aMandatesList, iMandateFailuresCount) {
      var div, table, msgHash, tbody, i, sNotes, sClass, sSize;

      if (aMandatesList!=null && aMandatesList.length>0) {
        div = rd.createElement('div');
        div.setAttribute('id', 'AIMandatesList');
        div.setAttribute('class', 'AISection');
  
        blr.W15yQC.fnAppendExpandContractHeadingTo(div, aMandatesList.length+" Mandates ("+iMandateFailuresCount+" Failures)");
  
        if (aMandatesList && aMandatesList.length > 0) {
          table = rd.createElement('table');
          table.setAttribute('id', 'AIMandatesTable');
          // TODO: Make summary and caption columns so they only appear when needed.
          table = blr.W15yQC.fnCreateTableHeaders(table, [blr.W15yQC.fnGetString('hrsTHNumberSym'), blr.W15yQC.fnGetString('hrsTHName'), blr.W15yQC.fnGetString('hrsTHResult')]);
          tbody = rd.createElement('tbody');
          for (i = 0; i < aMandatesList.length; i++) {
            sClass = '';
            if (!aMandatesList[i].result) {
              sClass = 'failed';
            }
            blr.W15yQC.fnAppendTableRow(tbody, [i + 1, blr.W15yQC.fnMakeWebSafe(aMandatesList[i].title), aMandatesList[i].result?'Passed':'Failed'], sClass);
          }
          table.appendChild(tbody);
          div.appendChild(table);
          blr.W15yQC.fnMakeTableSortable(div, rd, 'AIMandatesTable');
        }
        rd.body.appendChild(div);
      }
    },
    
    fnQuantify: function (count, s1, s2) {
      if(count == 1) {
        return '1 '+s1;
      } else if(count>1) {
        return count.toString()+' '+s2;
      } else return '';
    },

    fnComputeScore: function(oW15yQCReport) {
      var score=100, ps, itemsCount=0, failures=0, warnings=0, sDesc='', offset=0, i;
      if(oW15yQCReport!=null) {
        ps=oW15yQCReport.PageScore;
        if(ps!=null) {
          // Page and Frame Titles (15)
          if(ps.bAllDocumentsHaveTitles!=true) {
            score=score-5;
            sDesc=blr.W15yQC.fnJoin(sDesc,"Not all documents have titles (-5).",' ');
          }
          if(ps.bAllDocumentsHaveDefaultHumanLanguage!=true) {
            score=score-5;
            sDesc=blr.W15yQC.fnJoin(sDesc,"Not all documents specify default human language (-5).",' ');
          }
          if(ps.bAllFramesHaveTitles!=true) {
            score=score-5;
            sDesc=blr.W15yQC.fnJoin(sDesc,"Not all frames have titles (-5).",' ');
          }

          // Headings and Landmarks (20) 35
          if(ps.bUsesHeadings==true || ps.bUsesARIALandmarks==true) {
            if(ps.bUsesHeadings==true) {
              if(ps.bHasALevelOneHeading!=true) {
                score=score-4;
                sDesc=blr.W15yQC.fnJoin(sDesc,"Does not have a level one heading (-4).",' ');
              }
              if(ps.bHasTooManyLevelOneHeadings==true) {
                score=score-4;
                sDesc=blr.W15yQC.fnJoin(sDesc,"Should have only one level 1 heading (-4).",' ');
              }
              if(ps.bHeadingHierarchyIsCorrect!=true) {
                score=score-4;
                sDesc=blr.W15yQC.fnJoin(sDesc,"Headings hierarchy skips levels (-4).",' ');
              }
              if(ps.bHasMultipleHeadings!=true) {
                score=score-4;
                sDesc=blr.W15yQC.fnJoin(sDesc,"Does not have multiple headings (-4).",' ');
              }
              if(ps.bNotAllHeadingsHaveMeaningfulText==true) {
                score=score-4;
                sDesc=blr.W15yQC.fnJoin(sDesc,"Not all headings have meaningful text (-4).",' ');
              }
              if(ps.bNotAllHeadingsInASectionAreUnique==true) {
                score=score-4;
                sDesc=blr.W15yQC.fnJoin(sDesc,"Not all headings of a given level are unique within their section (-4).",' ');
              }
              if(ps.bHasEnoughHeadingsForContent!=true) {
                score=score-4;
                sDesc=blr.W15yQC.fnJoin(sDesc,"Does not have enough headings for content (-4).",' ');
              }
            } else {
              score=score-20;
              sDesc=blr.W15yQC.fnJoin(sDesc,"Does not use Headings (-20).",' ');
            }
            if(ps.bUsesARIALandmarks==true && ps.bLandmarksBesidesApplication==true) {
              if(ps.bHasMainLandmark!=true) {
                score=score-4;
                sDesc=blr.W15yQC.fnJoin(sDesc,"Uses ARIA Landmarks, but does not have a Main Landmark (-4).",' ');
              } else if(ps.bMainLandmarkContainsHeading!=true) {
                score=score-4;
                sDesc=blr.W15yQC.fnJoin(sDesc,"Main ARIA Landmark does not contain a heading (-4).",' ');
              }
              if(ps.bAllLandmarksUnique!=true) {
                score=score-4;
                sDesc=blr.W15yQC.fnJoin(sDesc,"Not all ARIA Landmarks are unique (-4).",' ');
              }
              if(ps.bAllContentContainedInLandmark!=true) {
                score=score-4;
                sDesc=blr.W15yQC.fnJoin(sDesc,"Not all content is contained in an ARIA Landmark (-4).",' ');
              }
            }
          } else {
            score=score-20;
            sDesc=blr.W15yQC.fnJoin(sDesc,"Does not use Headings or ARIA Landmarks (-20).",' ');
          }

          // Links (15) 50
          if(ps.bAllLinksHaveText!=true) {
            score=score-5;
            sDesc=blr.W15yQC.fnJoin(sDesc,"Not all links have link text (-5).",' ');
          }
          if(ps.bHasSkipNavLinks!=true && !(ps.bUsesARIALandmarks == true && ps.bMainLandmarkContainsHeading==true)) {
            score=score-3;
            sDesc=blr.W15yQC.fnJoin(sDesc,"Does not appear to have skip navigation links or ARIA Main Landmark (-3).",' ');
          }
          if(ps.bAllLinksHaveMeaningfulText!=true) {
            score=score-3;
            sDesc=blr.W15yQC.fnJoin(sDesc,"Not all links have meaningful link text (-3).",' ');
          }
          if(ps.bAllLinksAreUnique!=true) {
            score=score-4;
            sDesc=blr.W15yQC.fnJoin(sDesc,"Not all links have unique link text (-4).",' ');
          }
          if(ps.bNoLinksHaveTitleTextDiffThanLinkText!=true) {
            score=score-3;
            sDesc=blr.W15yQC.fnJoin(sDesc,"Some links have title text that is different from the link text (-3).",' ');
          }
          // Form Controls (15) 65
          if(ps.bAllFormControlsAreLabeled!=true) {
            if(ps.bMostFormControlsAreLabeled==true) {
              score=score-5;
              sDesc=blr.W15yQC.fnJoin(sDesc,"Most, but not all, form controls are labeled (-5).",' ');
            } else if(ps.bMostFormControlsAreNotLabeled==false && ps.bSomeFormControlsAreLabeled==true) {
              score=score-10;
              sDesc=blr.W15yQC.fnJoin(sDesc,"Only some of the form controls are labeled (-10).",' ');
            } else if(ps.bMostFormControlsAreNotLabeled==true && ps.bSomeFormControlsAreLabeled==true) {
              score=score-15;
              sDesc=blr.W15yQC.fnJoin(sDesc,"Most of the form controls are not labeled (-15).",' ');
            } else {
              score=score-20;
              sDesc=blr.W15yQC.fnJoin(sDesc,"None of the form controls are labeled (-20).",' ');
            }
          }
          if(ps.bAllRadioButtonsHaveLegends!=true) {
            score=score-5;
            sDesc=blr.W15yQC.fnJoin(sDesc,"Not all radio buttons have legends (-5).",' ');
          }
          if(ps.bAllFormControlsHaveMeaningfulLabels!=true) {
            score=score-5;
            sDesc=blr.W15yQC.fnJoin(sDesc,"Not all form controls have meaningful labels (-5).",' ');
          }
          // Images (15) 80
          if(ps.bAllImagesHaveAltTextOrAreMarkedPresentational!=true) {
            score=score-10;
            sDesc=blr.W15yQC.fnJoin(sDesc,"Not all images have alt text or are marked presentational (-5).",' ');
          }
          if(ps.bAllAltTextIsMeaningful!=true) {
            score=score-5;
            sDesc=blr.W15yQC.fnJoin(sDesc,"Some images have alternate text that does not appear to be meaningful (-5).",' ');
          }

          // Accesskeys (potential -10) 80
          if(ps.bUsesAccessKeys==true) {
            if(ps.bAllAccessKeysUnique!=true) {
              score=score-5;
              sDesc=blr.W15yQC.fnJoin(sDesc,"Not all access keys are unique (-5).",' ');
            }
            if(ps.bNoAccessKeysHaveConflicts!=true) {
              score=score-5;
              sDesc=blr.W15yQC.fnJoin(sDesc,"Some access keys conflict with browser functions (-5).",' ');
            }
          }

          // Tables (10) 90
          if(ps.bHasTables==true) {
            if(ps.bLayoutTablesAreMarkedPresentational!=true) {
              score=score-5;
              sDesc=blr.W15yQC.fnJoin(sDesc,"Not all apparent layout tables are marked presentational (-5).",' ');
            }
            if(ps.bAllContentInDataTablesCoveredByHeader!=true) {
              score=score-5;
              sDesc=blr.W15yQC.fnJoin(sDesc,"Not all content in data tables are covered by headers (-5).",' ');
            }
            if(ps.bDataTablesAreNotComplex!=true) {
              score=score-5;
              sDesc=blr.W15yQC.fnJoin(sDesc,"Some data tables are complex (-5).",' ');
            }
            if(ps.bLargeDataTablesHaveCaptionsOrSummary!=true) {
              score=score-5;
              sDesc=blr.W15yQC.fnJoin(sDesc,"Not all large data tables have captions or summaries (-5).",' ');
            }
          }

          // Mandates
          if (oW15yQCReport.aMandates!=null) {
            for (i=0;i<oW15yQCReport.aMandates.length;i++) {
              if (!oW15yQCReport.aMandates[i].result) {
                score=score-oW15yQCReport.aMandates[i].weight;
                sDesc=blr.W15yQC.fnJoin(sDesc,"Failed mandate '"+oW15yQCReport.aMandates[i].title+"' ("+(0-oW15yQCReport.aMandates[i].weight)+").",' ');
              }
            }
          }
          itemsCount=0;
          failures=0;
          warnings=0;
          if(oW15yQCReport.aFrames && oW15yQCReport.aFrames.length>0) {
            itemsCount=oW15yQCReport.aFrames.length;
            failures=oW15yQCReport.aFrames.failedCount;
            warnings=oW15yQCReport.aFrames.warningCount;
          }

          if(oW15yQCReport.aHeadings && oW15yQCReport.aHeadings.length>0) {
            itemsCount=itemsCount+oW15yQCReport.aHeadings.length;
            failures=failures+oW15yQCReport.aHeadings.failedCount;
            warnings=warnings+oW15yQCReport.aHeadings.warningCount;
          }

          if(oW15yQCReport.aARIALandmarks && oW15yQCReport.aARIALandmarks.length>0) {
            itemsCount=itemsCount+oW15yQCReport.aARIALandmarks.length;
            failures=failures+oW15yQCReport.aARIALandmarks.failedCount;
            warnings=warnings+oW15yQCReport.aARIALandmarks.warningCount;
          }

          if(oW15yQCReport.aARIAElements && oW15yQCReport.aARIAElements.length>0) {
            itemsCount=itemsCount+oW15yQCReport.aARIAElements.length;
            failures=failures+oW15yQCReport.aARIAElements.failedCount;
            warnings=warnings+oW15yQCReport.aARIAElements.warningCount;
          }

          if(oW15yQCReport.aLinks && oW15yQCReport.aLinks.length>0) {
            itemsCount=itemsCount+oW15yQCReport.aLinks.length;
            failures=failures+oW15yQCReport.aLinks.failedCount;
            warnings=warnings+oW15yQCReport.aLinks.warningCount;
          }

          if(oW15yQCReport.aImages && oW15yQCReport.aImages.length>0) {
            itemsCount=itemsCount+oW15yQCReport.aImages.length;
            failures=failures+oW15yQCReport.aImages.failedCount;
            warnings=warnings+oW15yQCReport.aImages.warningCount;
          }

          if(oW15yQCReport.aFormControls && oW15yQCReport.aFormControls.length>0) {
            itemsCount=itemsCount+oW15yQCReport.aFormControls.length;
            failures=failures+oW15yQCReport.aFormControls.failedCount;
            warnings=warnings+oW15yQCReport.aFormControls.warningCount;
          }

          if(oW15yQCReport.aAccessKeys && oW15yQCReport.aAccessKeys.length>0) {
            itemsCount=itemsCount+oW15yQCReport.aAccessKeys.length;
            failures=failures+oW15yQCReport.aAccessKeys.failedCount;
            warnings=warnings+oW15yQCReport.aAccessKeys.warningCount;
          }

          if(oW15yQCReport.aTables && oW15yQCReport.aTables.length>0) {
            itemsCount=itemsCount+oW15yQCReport.aTables.length;
            failures=failures+oW15yQCReport.aTables.failedCount;
            warnings=warnings+oW15yQCReport.aTables.warningCount;
          }

          if(itemsCount>0) {
            offset=Math.floor((30.0*(itemsCount-failures)/itemsCount)*((itemsCount-warnings/5)/itemsCount))-30;
            score=score+offset;
            if(offset<0) {
              sDesc=blr.W15yQC.fnJoin(sDesc,"Penalty for "+failures.toString()+" failures and "+warnings.toString()+" warnings on "+itemsCount.toString()+" items ("+offset.toString()+").",' ');
            }
          }
        }
      }
      oW15yQCReport.PageScore.sDescription=sDesc;
      if(score<0) { score=0; }
      oW15yQCReport.iScore=score;
    },

    fnDescribeWindow: function (oW15yQCReport) { // TODO: QA This
      /*
       * all content contained in landmark. main landmrk missing.
       * has skip navigation link(s)
       * has x data tables (x with summaries or captions, x complex, x with content not covered by headers)
       * has following valid ARIA roles: xxx, following invalid rolls:
       * use of ARIA appears invalid
       * has bad IDs
       * has x lists of links
       * has x unlabeled form controls. has x other controls with errors / x warnings.
       * document default language is (not) indicated,x/x documents have default language indicated
       * page content has the following lang attribute values:
       * page has mathml
       * doc types used: xxxx, and x unrecognized doc types
       *
       */
      var i, sDesc='', sLinksTo='', documentsCount=0, wordProcCount=0, slidesCount=0, pdfsCount=0, spreadSheetCount=0,
        audioFileCount=0, avFileCount=0, ebookFileCount=0, pageLayoutFileCount=0, bHasSkipNav=false, sRole,
        ariaLandmarks=new blr.W15yQC.HashTable(), ariaRoles=new blr.W15yQC.HashTable(), invalidAriaRoles=new blr.W15yQC.HashTable();
      //oW15yQCReport = new blr.W15yQC.W15yResults();
      if(oW15yQCReport != null) {
        oW15yQCReport.PageScore.bHasSkipNavLinks=false;
        if(oW15yQCReport.aFrames && oW15yQCReport.aFrames.length && oW15yQCReport.aFrames.length>0) {
          sDesc=blr.W15yQC.fnJoin(sDesc, blr.W15yQC.fnQuantify(oW15yQCReport.aFrames.length, 'frame', 'frames'), ', ');
        }
        if(oW15yQCReport.aHeadings && oW15yQCReport.aHeadings.length && oW15yQCReport.aHeadings.length>0) {
          sDesc=blr.W15yQC.fnJoin(sDesc, blr.W15yQC.fnQuantify(oW15yQCReport.aHeadings.length, 'heading', 'headings'), ', ');
        }
        if(oW15yQCReport.aARIALandmarks && oW15yQCReport.aARIALandmarks.length && oW15yQCReport.aARIALandmarks.length>0) {
          sDesc=blr.W15yQC.fnJoin(sDesc, blr.W15yQC.fnQuantify(oW15yQCReport.aARIALandmarks.length, 'landmark', 'landmarks'), ', ');
        }
        if(oW15yQCReport.aARIAElements && oW15yQCReport.aARIAElements.length && oW15yQCReport.aARIAElements.length>0) {
          for(i=0; i<oW15yQCReport.aARIAElements.length; i++) {
            sRole=oW15yQCReport.aARIAElements[i].role;
            if(blr.W15yQC.fnStringHasContent(sRole)==true) {
              if(blr.W15yQC.fnIsARIALandmark(oW15yQCReport.aARIAElements[i].node)==true) {
                ariaLandmarks.setItem(sRole,true);
              } else if(blr.W15yQC.fnIsValidARIARole(sRole)==true) {
                ariaRoles.setItem(sRole,true);
              } else {
                invalidAriaRoles.setItem(sRole,true);
              }
            }
          }
        }
        if(oW15yQCReport.aLinks && oW15yQCReport.aLinks.length && oW15yQCReport.aLinks.length>0) {
          sDesc=blr.W15yQC.fnJoin(sDesc, blr.W15yQC.fnQuantify(oW15yQCReport.aLinks.length, 'link', 'links'), ', ');
          if(blr.W15yQC.fnAppearsToBeSkipNavLink(oW15yQCReport.aLinks[0].text,oW15yQCReport.aLinks[0].href)==true) {
            bHasSkipNav=true;
            oW15yQCReport.PageScore.bHasSkipNavLinks=true;
          }
          for(i=0;i<oW15yQCReport.aLinks.length;i++) {
            if(/^([a-z]+\/\/.+\.[a-z]+\/.+|.+)\.(docx?|odt|pages|rtf|sdw|wpd|wri|wps)$/i.test(oW15yQCReport.aLinks[i].href)) {
              wordProcCount++;
            } else if(/^([a-z]+\/\/.+\.[a-z]+\/.+|.+)\.(pdf)$/i.test(oW15yQCReport.aLinks[i].href)) {
              pdfsCount++;
            } else if(/^([a-z]+\/\/.+\.[a-z]+\/.+|.+)\.(eps2?|indd?|pm[0-9]|ps|pub)$/i.test(oW15yQCReport.aLinks[i].href)) {
              pageLayoutFileCount++;
            } else if(/^([a-z]+\/\/.+\.[a-z]+\/.+|.+)\.(aeh|apk|azw|cbr|cbz|cb7|cbt|cba|ceb|djvu|epub|fb2|ibooks|kf8|lit|lrf|lrx|mobi|pdb|prc|tebr|tr2|tr3|xeb)$/i.test(oW15yQCReport.aLinks[i].href)) {
              ebookFileCount++;
            } else if(/^([a-z]+\/\/.+\.[a-z]+\/.+|.+)\.(pptx?|key|pps|sdd)$/i.test(oW15yQCReport.aLinks[i].href)) {
              slidesCount++;
            } else if(/^([a-z]+\/\/.+\.[a-z]+\/.+|.+)\.(xlr|xlsx?|sdc)$/i.test(oW15yQCReport.aLinks[i].href)) {
              spreadSheetCount++;
            } else if(/^([a-z]+\/\/.+\.[a-z]+\/.+|.+)\.(aif|cda|iff|m3u|m4a|mid|mp3|mpa|ogg|ra|wav|wma)$/i.test(oW15yQCReport.aLinks[i].href)) {
              audioFileCount++;
            } else if(/^([a-z]+\/\/.+\.[a-z]+\/.+|.+)\.(3gt|3gp|asf|asx|avi|fla|flv|mov|mp4|mpe?g|rm|srt|swf|vob|wmv|smil?)$/i.test(oW15yQCReport.aLinks[i].href)) {
              avFileCount++;
            }
          }
          documentsCount=wordProcCount + pdfsCount + pageLayoutFileCount + ebookFileCount + slidesCount + spreadSheetCount;
        }
        if(wordProcCount>0) {
          sLinksTo=blr.W15yQC.fnJoin(sLinksTo, blr.W15yQC.fnQuantify(wordProcCount, 'word processor file', 'word processor files'), ', ');
        }
        if(pdfsCount>0) {
          sLinksTo=blr.W15yQC.fnJoin(sLinksTo, blr.W15yQC.fnQuantify(pdfsCount, 'PDF file', 'PDF files'), ', ');
        }
        if(pageLayoutFileCount>0) {
          sLinksTo=blr.W15yQC.fnJoin(sLinksTo, blr.W15yQC.fnQuantify(pageLayoutFileCount, 'non-PDF page layout file', 'non-PDF page layout files'), ', ');
        }
        if(ebookFileCount>0) {
          sLinksTo=blr.W15yQC.fnJoin(sLinksTo, blr.W15yQC.fnQuantify(ebookFileCount, 'eBook file', 'eBook files'), ', ');
        }
        if(slidesCount>0) {
          sLinksTo=blr.W15yQC.fnJoin(sLinksTo, blr.W15yQC.fnQuantify(slidesCount, 'slide presentation file', 'slide presentation files'), ', ');
        }
        if(spreadSheetCount>0) {
          sLinksTo=blr.W15yQC.fnJoin(sLinksTo, blr.W15yQC.fnQuantify(spreadSheetCount, 'spreadsheet file', 'spreadsheet files'), ', ');
        }
        if(audioFileCount>0) {
          sLinksTo=blr.W15yQC.fnJoin(sLinksTo, blr.W15yQC.fnQuantify(audioFileCount, 'audio file', 'audio files'), ', ');
        }
        if(avFileCount>0) {
          sLinksTo=blr.W15yQC.fnJoin(sLinksTo, blr.W15yQC.fnQuantify(avFileCount, 'audio-video file', 'audio-video files'), ', ');
        }

        if(sDesc.length>2) {
          sDesc='Page contains: '+sDesc+".";
        }
        if(sLinksTo.length>2) {
          sDesc=blr.W15yQC.fnJoin(sDesc,'Page links to: '+sLinksTo+'.',"\n");
        }
        if(bHasSkipNav) {
          sDesc=blr.W15yQC.fnJoin(sDesc,'Appears to have skip navigation link(s).',"\n");
        }
        if(ariaLandmarks.length>0) {
          sDesc=blr.W15yQC.fnJoin(sDesc, 'Page contains the following ARIA Landmarks: '+blr.W15yQC.fnFormatArrayAsList(ariaLandmarks.keys())+'.', "\n")
        }
        if(ariaRoles.length>0) {
          sDesc=blr.W15yQC.fnJoin(sDesc, 'Page contains the following ARIA Roles: '+blr.W15yQC.fnFormatArrayAsList(ariaRoles.keys())+'.', "\n")
        }
        if(invalidAriaRoles.length>0) {
          sDesc=blr.W15yQC.fnJoin(sDesc, 'Page contains the following invalid ARIA Roles: '+blr.W15yQC.fnFormatArrayAsList(invalidAriaRoles.keys())+'.', "\n")
        }
      }
      oW15yQCReport.iDocumentCount=documentsCount;
      oW15yQCReport.sWindowDescription=sDesc;
    },


    fnDisplayPageSummary: function(rd, oW15yQCReport, bQuick) {
      var div, div2=null, element, h2;

      div=rd.getElementById('AIDocumentDetails');
      if (div!=null) {
        div2=div.getElementsByTagName('div');
        if (div2 != null && div2.length>0) {
          div2=div2[0];
        } else {
          div2=null;
        }
      }
      if (div2==null) {
        div = rd.createElement('div');
        div.setAttribute('id', 'AIPageSummary');
        blr.W15yQC.fnAppendExpandContractHeadingTo(div, 'Page Summary');

        div2 = rd.createElement('div');

        div.appendChild(div2);
        rd.body.appendChild(div);
      }
      element = rd.createElement('h3');
      element.appendChild(rd.createTextNode('Page Description'));
      div2.appendChild(element);

      element = rd.createElement('p');
      element.appendChild(rd.createTextNode(oW15yQCReport.sWindowDescription));
      div2.appendChild(element);

      if (bQuick!=true) {
        element = rd.createElement('h3');
        element.appendChild(rd.createTextNode('Page Score'));
        div2.appendChild(element);

        element = rd.createElement('p');

        element.appendChild(rd.createTextNode(oW15yQCReport.iScore+' - '+oW15yQCReport.PageScore.sDescription));
        div2.appendChild(element);
        h2=div.getElementsByTagName('h2');
        if (h2 != null && h2.length>0) {
          h2=h2[0];
          h2.appendChild(rd.createTextNode(' (Page Score: '+oW15yQCReport.iScore.toString()+'/100)'));
        }
      }
    },


    /*
     *
     * ======== Main Inspect Method That Starts it All for the Report Generator (web page output) ========
     *
     */

    fnFullInspect: function (reportDoc, sourceDocument, sReports, progressWindow) {
      var aDocumentsList, dialogID, dialogPath, oW15yQCReport;
      blr.W15yQC.bQuick = false;
      if(blr.W15yQC.sb == null) { blr.W15yQC.fnInitStringBundles(); }
      blr.W15yQC.fnNonDOMIntegrityTests();
      blr.W15yQC.fnReadUserPrefs();

      if(Application.prefs.getValue("extensions.W15yQC.userAgreedToLicense",false)==false) {
        dialogID = 'licenseDialog';
        dialogPath = 'chrome://W15yQC/content/licenseDialog.xul';
        window.openDialog(dialogPath, dialogID, 'chrome,resizable=yes,centerscreen,modal',blr);
      }

      if(Application.prefs.getValue("extensions.W15yQC.userAgreedToLicense",false)==true) {
        if(sReports==null) { sReports=''; }
        if(sourceDocument==null) { sourceDocument=window.top.content.document; }

        blr.W15yQC.fnDoEvents();

        oW15yQCReport = blr.W15yQC.fnGetElements(sourceDocument, progressWindow);
        reportDoc = blr.W15yQC.fnInitDisplayWindow(sourceDocument.URL, reportDoc);

        if(sReports=='' || sReports.indexOf('title')>=0) {
          blr.W15yQC.fnDisplayWindowDetails(reportDoc, oW15yQCReport);
        }

        if(progressWindow!=null) { progressWindow.fnUpdateProgress('Analyzing Documents', 1); }

        if(sReports=='' || sReports.indexOf('documents')>=0) {
          blr.W15yQC.fnAnalyzeDocuments(oW15yQCReport);
          blr.W15yQC.fnDisplayDocumentsResults(reportDoc, oW15yQCReport.aDocuments);
        }

        if(progressWindow!=null) { progressWindow.fnUpdateProgress('Analyzing Frame Titles', 5); }

        if(sReports=='' || sReports.indexOf('frames')>=0) {
          blr.W15yQC.fnAnalyzeFrameTitles(oW15yQCReport);
          blr.W15yQC.fnDisplayFrameTitleResults(reportDoc, oW15yQCReport.aFrames);
        }
        if(progressWindow!=null) { progressWindow.fnUpdateProgress('Analyzing Headings', 10); }

        if(sReports=='' || sReports.indexOf('headings')>=0) {
          blr.W15yQC.fnAnalyzeHeadings(oW15yQCReport, progressWindow);
          blr.W15yQC.fnDisplayHeadingsResults(reportDoc, oW15yQCReport.aHeadings);
        }
        if(progressWindow!=null) { progressWindow.fnUpdateProgress('Analyzing ARIA Landmarks', 15); }

        if(sReports=='' || sReports.indexOf('landmarks')>=0) {
          blr.W15yQC.fnAnalyzeARIALandmarks(oW15yQCReport);
          blr.W15yQC.fnDisplayARIALandmarksResults(reportDoc, oW15yQCReport.aARIALandmarks);
        }

        if(sReports=='' || sReports.indexOf('aria')>=0 && blr.W15yQC.userExpertLevel>0 && Application.prefs.getValue("extensions.W15yQC.enableARIAElementsInspector",true)) {
          if(progressWindow!=null) { progressWindow.fnUpdateProgress('Analyzing ARIA', 18); }
          blr.W15yQC.fnAnalyzeARIAElements(oW15yQCReport);
          blr.W15yQC.fnDisplayARIAElementsResults(reportDoc, oW15yQCReport.aARIAElements);
        }
        if(progressWindow!=null) { progressWindow.fnUpdateProgress('Analyzing Links', 24); }

        if(sReports=='' || sReports.indexOf('links')>=0) {
          blr.W15yQC.fnAnalyzeLinks(oW15yQCReport, progressWindow);
          blr.W15yQC.fnDisplayLinkResults(reportDoc, oW15yQCReport.aLinks);
        }
        if(progressWindow!=null) { progressWindow.fnUpdateProgress('Analyzing Forms', 75); }

        if(sReports=='' || sReports.indexOf('forms')>=0) {
          blr.W15yQC.fnAnalyzeFormControls(oW15yQCReport);
          blr.W15yQC.fnDisplayFormResults(reportDoc, oW15yQCReport.aForms);
          blr.W15yQC.fnDisplayFormControlResults(reportDoc, oW15yQCReport.aFormControls);
        }
        if(progressWindow!=null) { progressWindow.fnUpdateProgress('Analyzing Images', 85); }

        if(sReports=='' || sReports.indexOf('images')>=0) {
          blr.W15yQC.fnAnalyzeImages(oW15yQCReport);
          blr.W15yQC.fnDisplayImagesResults(reportDoc, oW15yQCReport.aImages);
        }
        if(progressWindow!=null) { progressWindow.fnUpdateProgress('Analyzing Access Keys', 90); }

        if(sReports=='' || sReports.indexOf('accesskeys')>=0) {
          blr.W15yQC.fnAnalyzeAccessKeys(oW15yQCReport);
          blr.W15yQC.fnDisplayAccessKeysResults(reportDoc, oW15yQCReport.aAccessKeys);
        }
        if(progressWindow!=null) { progressWindow.fnUpdateProgress('Analyzing Tables', 95); }

        if(sReports=='' || sReports.indexOf('tables')>=0) {
          blr.W15yQC.fnAnalyzeTables(oW15yQCReport);
          blr.W15yQC.fnDisplayTableResults(reportDoc, oW15yQCReport.aTables);
        }
try{
        if(sReports=='' || sReports.indexOf('mandates')>=0) {
          blr.W15yQC.fnCheckMandates(oW15yQCReport);
          blr.W15yQC.fnDisplayMandatesCheckResults(reportDoc, oW15yQCReport.aMandates, oW15yQCReport.iMandateFailuresCount);
        }
        if(sReports=='' || sReports.indexOf('pageSummary')>=0) {
          blr.W15yQC.fnDescribeWindow(oW15yQCReport);
          blr.W15yQC.fnComputeScore(oW15yQCReport);
          blr.W15yQC.fnDisplayPageSummary(reportDoc, oW15yQCReport);
        }
} catch(ex) {alert(ex.toString());}

        if(progressWindow!=null) { progressWindow.fnUpdateProgress( 100, 'Cleaning up...'); }

        blr.W15yQC.fnDisplayFooter(reportDoc);

        reportDoc.defaultView.focus();
        return reportDoc;
      }
      return null;
    },

    fnQuickInspect: function (reportDoc, sourceDocument, sReports, progressWindow) {
      var aDocumentsList, dialogID, dialogPath, oW15yQCReport;

      blr.W15yQC.bQuick = true;
      if(blr.W15yQC.sb == null) { blr.W15yQC.fnInitStringBundles(); }
      blr.W15yQC.fnNonDOMIntegrityTests();
      blr.W15yQC.fnReadUserPrefs();

      if(Application.prefs.getValue("extensions.W15yQC.userAgreedToLicense",false)==false) {
        dialogID = 'licenseDialog';
        dialogPath = 'chrome://W15yQC/content/licenseDialog.xul';
        window.openDialog(dialogPath, dialogID, 'chrome,resizable=yes,centerscreen,modal',blr);
      }

      if(Application.prefs.getValue("extensions.W15yQC.userAgreedToLicense",false)==true) {
        if(sourceDocument==null) { sourceDocument=window.top.content.document; }

        blr.W15yQC.fnDoEvents();

        oW15yQCReport = blr.W15yQC.fnGetElements(sourceDocument, progressWindow);
        reportDoc = blr.W15yQC.fnInitDisplayWindow(sourceDocument.URL, reportDoc, true);

        blr.W15yQC.fnDisplayWindowDetails(reportDoc, oW15yQCReport);

        if(progressWindow!=null) { progressWindow.fnUpdateProgress('Analyzing Documents', 1); }

        blr.W15yQC.fnAnalyzeDocuments(oW15yQCReport);

        if(progressWindow!=null) { progressWindow.fnUpdateProgress('Analyzing Frame Titles', 5); }

        blr.W15yQC.fnAnalyzeFrameTitles(oW15yQCReport);
        blr.W15yQC.fnDisplayFrameTitleResults(reportDoc, oW15yQCReport.aFrames, true);

        if(progressWindow!=null) { progressWindow.fnUpdateProgress('Analyzing Headings', 10); }

        blr.W15yQC.fnAnalyzeHeadings(oW15yQCReport, progressWindow);
        blr.W15yQC.fnDisplayHeadingsResults(reportDoc, oW15yQCReport.aHeadings, true);

        if(progressWindow!=null) { progressWindow.fnUpdateProgress('Analyzing ARIA Landmarks', 15); }

        blr.W15yQC.fnAnalyzeARIALandmarks(oW15yQCReport);
        blr.W15yQC.fnDisplayARIALandmarksResults(reportDoc, oW15yQCReport.aARIALandmarks, true);

        if(progressWindow!=null) { progressWindow.fnUpdateProgress('Analyzing ARIA', 18); }
        blr.W15yQC.fnAnalyzeARIAElements(oW15yQCReport);

        if(progressWindow!=null) { progressWindow.fnUpdateProgress('Analyzing Links', 24); }

        blr.W15yQC.fnAnalyzeLinks(oW15yQCReport, progressWindow);
        blr.W15yQC.fnDisplayLinkResults(reportDoc, oW15yQCReport.aLinks, true);

        if(progressWindow!=null) { progressWindow.fnUpdateProgress('Analyzing Forms', 75); }

        blr.W15yQC.fnAnalyzeFormControls(oW15yQCReport);
        blr.W15yQC.fnDisplayFormControlResults(reportDoc, oW15yQCReport.aFormControls, true);

        if(progressWindow!=null) { progressWindow.fnUpdateProgress('Analyzing Images', 85); }

        blr.W15yQC.fnAnalyzeImages(oW15yQCReport);

        if(progressWindow!=null) { progressWindow.fnUpdateProgress('Analyzing Access Keys', 90); }

        blr.W15yQC.fnAnalyzeAccessKeys(oW15yQCReport);
        blr.W15yQC.fnDisplayAccessKeysResults(reportDoc, oW15yQCReport.aAccessKeys, true);

        if(progressWindow!=null) { progressWindow.fnUpdateProgress('Analyzing Tables', 95); }

        blr.W15yQC.fnAnalyzeTables(oW15yQCReport);
        
        if(progressWindow!=null) { progressWindow.fnUpdateProgress('Checking Mandates', 97); }
        blr.W15yQC.fnCheckMandates(oW15yQCReport);
        
        blr.W15yQC.fnDescribeWindow(oW15yQCReport);
        blr.W15yQC.fnComputeScore(oW15yQCReport);
        blr.W15yQC.fnDisplayPageSummary(reportDoc, oW15yQCReport, true);

        if(progressWindow!=null) { progressWindow.fnUpdateProgress( 100, 'Cleaning up...'); }

        blr.W15yQC.fnDisplayFooter(reportDoc);

        reportDoc.defaultView.focus();
        blr.W15yQC.bQuick = false;
        return reportDoc;
      }
      blr.W15yQC.bQuick = false;
      return null;
    },


    fnScannerInspect: function (sourceDocument, progressWindow) {
      var oW15yQCReport=null;
      blr.W15yQC.bQuick = false;

      oW15yQCReport = blr.W15yQC.fnGetElements(sourceDocument, progressWindow);

      if(progressWindow!=null) { progressWindow.fnUpdateProgress('Analyzing Documents', 1); }
      blr.W15yQC.fnAnalyzeDocuments(oW15yQCReport);

      if(progressWindow!=null) { progressWindow.fnUpdateProgress('Analyzing Frame Titles', 5); }
      blr.W15yQC.fnAnalyzeFrameTitles(oW15yQCReport);

      if(progressWindow!=null) { progressWindow.fnUpdateProgress('Analyzing Headings', 10); }
      blr.W15yQC.fnAnalyzeHeadings(oW15yQCReport, progressWindow);

      if(progressWindow!=null) { progressWindow.fnUpdateProgress('Analyzing ARIA Landmarks', 15); }
      blr.W15yQC.fnAnalyzeARIALandmarks(oW15yQCReport);

      if(blr.W15yQC.userExpertLevel>0 && Application.prefs.getValue("extensions.W15yQC.enableARIAElementsInspector",true)) {
        if(progressWindow!=null) { progressWindow.fnUpdateProgress('Analyzing ARIA', 18); }
        blr.W15yQC.fnAnalyzeARIAElements(oW15yQCReport);
      }

      if(progressWindow!=null) { progressWindow.fnUpdateProgress('Analyzing Links', 24); }
      blr.W15yQC.fnAnalyzeLinks(oW15yQCReport, progressWindow);

      if(progressWindow!=null) { progressWindow.fnUpdateProgress('Analyzing Forms', 75); }
      blr.W15yQC.fnAnalyzeFormControls(oW15yQCReport);

      if(progressWindow!=null) { progressWindow.fnUpdateProgress('Analyzing Images', 85); }
      blr.W15yQC.fnAnalyzeImages(oW15yQCReport);

      if(progressWindow!=null) { progressWindow.fnUpdateProgress('Analyzing Access Keys', 90); }
      blr.W15yQC.fnAnalyzeAccessKeys(oW15yQCReport);

      if(progressWindow!=null) { progressWindow.fnUpdateProgress('Analyzing Tables', 95); }
      blr.W15yQC.fnAnalyzeTables(oW15yQCReport);

      if(progressWindow!=null) { progressWindow.fnUpdateProgress('Checking Mandates', 97); }
      blr.W15yQC.fnCheckMandates(oW15yQCReport);

      if(progressWindow!=null) progressWindow.fnUpdateProgress('Creating Page Description', 98);
      blr.W15yQC.fnDescribeWindow(oW15yQCReport);

      blr.W15yQC.fnComputeScore(oW15yQCReport);

      if(progressWindow!=null) progressWindow.fnUpdateProgress('Cleaning up...', 100);
      Components.utils.forceShrinkingGC();
      return oW15yQCReport;
    },

    fnReadUserPrefs: function() {
      var sDomains, aEquivDomains, aDomainPair, focusInspectorOn, i;
      if(Application.prefs.getValue("extensions.W15yQC.testContrast.MinSpec",'')=='') {
        Application.prefs.setValue("extensions.W15yQC.testContrast.MinSpec", "WCAG2 AA");
      }
      blr.W15yQC.userExpertLevel = Application.prefs.getValue("extensions.W15yQC.userExpertLevel",0);
      blr.W15yQC.bIncludeHidden = Application.prefs.getValue("extensions.W15yQC.getElements.includeHiddenElements",false);
      blr.W15yQC.bFirstHeadingMustBeLevel1 = Application.prefs.getValue("extensions.W15yQC.getElements.firstHeadingMustBeLevel1", true);
      blr.W15yQC.bOnlyOneLevel1Heading = Application.prefs.getValue("extensions.W15yQC.getElements.onlyOneLevel1Heading", false);
      blr.W15yQC.bHonorARIA = Application.prefs.getValue("extensions.W15yQC.getElements.honorARIA", true);

      blr.W15yQC.bAutoScrollToSelectedElementInInspectorDialogs = Application.prefs.getValue("extensions.W15yQC.inspectElements.autoScrollToSelectedElements",true);

      focusInspectorOn=Application.prefs.getValue("extensions.W15yQC.focusHighlighterTurnedOn",false);
      if(focusInspectorOn) {
        blr.W15yQC.fnTurnOnFocusHighlighter();
      }
      blr.W15yQC.domainEq1=[];
      blr.W15yQC.domainEq2=[];
      sDomains=Application.prefs.getValue("extensions.W15yQC.DomainEquivalences","");
      if(sDomains!=null && sDomains.length>3) {
        aEquivDomains=sDomains.split("|");
        if(aEquivDomains != null && aEquivDomains.length>0) {
          for(i=0;i<aEquivDomains.length;i++) {
            if(/=/.test(aEquivDomains[i])==true) {
              aDomainPair=aEquivDomains[i].split("=");
              if(aDomainPair!=null && aDomainPair.length==2) {
                blr.W15yQC.domainEq1.push(aDomainPair[0]);
                blr.W15yQC.domainEq2.push(aDomainPair[1]);
              }
            }
          }
        }
      }
    },

    fnRemoveStyles: function () {
      var dialogPath = 'chrome://W15yQC/content/removeStylesWindow.xul', dialogID = 'RemoveStylesWindow', i, srcDoc, metaElements, win;

      if(Application.prefs.getValue("extensions.W15yQC.userAgreedToLicense",false)==false) {
        dialogID = 'licenseDialog';
        dialogPath = 'chrome://W15yQC/content/licenseDialog.xul';
        window.openDialog(dialogPath, dialogID, 'chrome,resizable=yes,centerscreen,modal',blr);
      }

      if(Application.prefs.getValue("extensions.W15yQC.userAgreedToLicense",false)==true) {
        srcDoc = window.top.content.document;
        win=window.openDialog(dialogPath, dialogID, 'chrome,resizable=yes,centerscreen,toolbars=yes',blr,srcDoc);
        if(win!=null && win.focus) win.focus();
      }
    },

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

  blr.W15yQC.PageScore = function () {
    this.iScore=0;
    this.iDocumentCount=0;
    this.sDescription=null;
    this.bHasSkipNavLinks=null;
    this.bAllDocumentsHaveTitles=true;
    this.bAllDocumentsHaveDefaultHumanLanguage=null;
    this.bAllFramesHaveTitles=null;
    this.bUsesHeadings=null;
    this.bHasALevelOneHeading=null;
    this.bHeadingHierarchyIsCorrect=null;
    this.bHasEnoughHeadingsForContent=null;
    this.bHasMultipleHeadings=null;
    this.bNotAllHeadingsHaveMeaningfulText=null;
    this.bNotAllHeadingsInASectionAreUnique=null;
    this.bMainLandmarkContainsHeading=null;
    this.bUsesARIALandmarks=null;
    this.bHasMainLandmark=null;
    this.bLandmarksBesidesApplication=null;
    this.bAllLandmarksUnique=null;
    this.bAllContentContainedInLandmark=null;
    this.bHasTables=null;
    this.bLayoutTablesAreMarkedPresentational=null;
    this.bAllContentInDataTablesCoveredByHeader=null;
    this.bDataTablesAreNotComplex=null;
    this.bLargeDataTablesHaveCaptionsOrSummary=null;
    this.bAllFormControlsAreLabeled=null;
    this.bMostFormControlsAreLabeled=null;
    this.bSomeFormControlsAreLabeled=null;
    this.bMostFormControlsAreNotLabeled=null;
    this.bAllRadioButtonsHaveLegends=null;
    this.bAllFormControlsHaveMeaningfulLabels=null;
    this.bAllLinksHaveText=null;
    this.bAllLinksHaveMeaningfulText=null;
    this.bAllLinksAreUnique=null;
    this.bNoLinksHaveTitleTextDiffThanLinkText=null;
    this.bAllImagesHaveAltTextOrAreMarkedPresentational=null;
    this.bAllAltTextIsMeaningful=null;
    this.bUsesARIABesidesLandmarks=null;
    this.bAllARIARolesAreValid=null;
    this.bNoARIAErrors=null;
    this.bUsesAccessKeys=null;
    this.bAllAccessKeysHaveLabels=null;
    this.bAllAccessKeysUnique=null;
    this.bNoAccessKeysHaveConflicts=null;
    this.bAllIDsAreUnique=null;
  };

  blr.W15yQC.PageScore.prototype = {
    iScore: null,
    sDescription: null,
    iDocumentCount: null,
    bHasSkipNavLinks: null,
    bAllDocumentsHaveTitles: null,
    bAllDocumentsHaveDefaultHumanLanguage: null,
    bAllFramesHaveTitles: null,
    bUsesHeadings: null,
    bHasALevelOneHeading: null,
    bHasTooManyLevelOneHeadings: null,
    bHeadingHierarchyIsCorrect: null,
    bHasEnoughHeadingsForContent: null,
    bHasMultipleHeadings: null,
    bNotAllHeadingsInASectionAreUnique: null,
    bNotAllHeadingsHaveMeaningfulText: null,
    bHasLandmarksOrMultipleHeadings: null,
    bMainLandmarkContainsHeading: null,
    bUsesARIALandmarks: null,
    bHasMainLandmark: null,
    bLandmarksBesidesApplication: null,
    bAllLandmarksUnique: null,
    bAllContentContainedInLandmark: null,
    bHasTables: null,
    bLayoutTablesAreMarkedPresentational: null,
    bAllContentInDataTablesCoveredByHeader: null,
    bDataTablesAreNotComplex: null,
    bLargeDataTablesHaveCaptionsOrSummary: null,
    bAllFormControlsAreLabeled: null,
    bMostFormControlsAreLabeled: null,
    bSomeFormControlsAreLabeled: null,
    bMostFormControlsAreNotLabeled: null,
    bAllRadioButtonsHaveLegends: null,
    bAllFormControlsHaveMeaningfulLabels: null,
    bAllLinksHaveText: null,
    bAllLinksHaveMeaningfulText: null,
    bAllLinksAreUnique: null,
    bNoLinksHaveTitleTextDiffThanLinkText: null,
    bAllImagesHaveAltTextOrAreMarkedPresentational: null,
    bAllAltTextIsMeaningful: null,
    bUsesARIABesidesLandmarks: null,
    bAllARIARolesAreValid: null,
    bNoARIAErrors: null,
    bUsesAccessKeys: null,
    bAllAccessKeysHaveLabels: null,
    bAllAccessKeysUnique: null,
    bNoAccessKeysHaveConflicts: null,
    bAllIDsAreUnique: null,
  };


  blr.W15yQC.W15yResults = function () {
    this.sWindowTitle=null;
    this.sWindowURL= null;
    this.sWindowDescription=null;
    this.iTextSize = 0;
    this.PageScore = null;
    this.dDateChecked= null;
    this.aDocuments= [];
    this.aFrames= [];
    this.aHeadings= [];
    this.aARIALandmarks= [];
    this.aARIAElements= [];
    this.aForms= [];
    this.aFormControls= [];
    this.aLinks= [];
    this.aImages= [];
    this.aAccessKeys= [];
    this.aBadIDs= [];
    this.aTables= [];
  };

  blr.W15yQC.W15yResults.prototype = {
    sWindowTitle: null,
    sWindowURL: null,
    sWindowDescription: null,
    iTextSize: null,
    PageScore: null,
    iScore: null,
    dDateChecked: null,
    aDocuments: [],
    aFrames: [],
    aHeadings: [],
    aARIALandmarks: [],
    aARIAElements: [],
    aForms: [],
    aFormControls: [],
    aLinks: [],
    aImages: [],
    aAccessKeys: [],
    aBadIDs: [],
    aTables: [],
    toString: function() {
      if(this.iTextSize!=null) return this.iTextSize.toString();
      return '';
    }
  };

  blr.W15yQC.note = function (msgKey, aParameters) {
    this.msgKey = msgKey;
    this.aParameters = aParameters;
  };

  blr.W15yQC.note.prototype = {
    msgKey: null,
    aParameters: null
  };

  blr.W15yQC.resolvedNote = function (msgKey, bQuick, severityLevel, expertLevel, msgText, msgExplanation, sURL) {
    this.msgKey = msgKey;
    this.bQuick = bQuick;
    this.severityLevel = severityLevel;
    this.expertLevel = expertLevel;
    this.msgText = msgText;
    this.msgExplanation = msgExplanation;
    this.sURL = sURL;
  };

  blr.W15yQC.resolvedNote.prototype = {
    msgKey: null,
    bQuick: true,
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
    this.invalidLangValues = [];
    this.hasLangConflict = false;
    this.hasFullJustifiedText = false;
    this.validLangValues = [];
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
    invalidLangValues: [],
    validLangValues: [],
    hasLangConflict: false,
    hasFullJustifiedText: false,
    nonUniqueIDsCount: 0,
    invalidIDsCount: 0,
    notes: null,
    failed: false,
    warning: false,
    title: null,
    soundex: null
  };


  blr.W15yQC.frameElement = function (node, xpath, nodeDescription, doc, orderNumber, role, id, name, title, effectiveLabel, effectiveLabelSource, src) {
    this.node = node;
    this.xpath = xpath;
    this.nodeDescription = nodeDescription;
    this.doc = doc;
    this.orderNumber = orderNumber;
    this.role = role;
    this.id = id;
    this.name = name;
    this.effectiveLabel = effectiveLabel;
    this.effectiveLabelSource = effectiveLabelSource;
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
    state: null,
    listedByAT: true,
    notes: null,
    failed: false,
    warning: false,
    id: null,
    name: null,
    effectiveLabel: null,
    effectiveLabelSource: null,
    title: null,
    soundex: null,
    src: null,
    stateDescription: null
  };


  blr.W15yQC.headingElement = function (node, xpath, nodeDescription, doc, orderNumber, role, inheritedRoles, level, effectiveLabel, effectiveLabelSource, text) {
    this.node = node;
    this.xpath = xpath;
    this.nodeDescription = nodeDescription;
    this.doc = doc;
    this.orderNumber = orderNumber;
    this.ownerDocumentNumber = null;
    this.role = role;
    this.inheritedRoles = inheritedRoles;
    this.state = null;
    this.level = level;
    this.listedByAT = null;
    this.aSameTextAs = [];
    this.notes = null;
    this.failed = false;
    this.warning = false;
    this.soundex=null;
    this.stateDescription=null;
    this.effectiveLabel = effectiveLabel;
    this.effectiveLabelSource = effectiveLabelSource;
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
    inheritedRoles: null,
    state: null,
    listedByAT: true,
    aSameTextAs: [],
    notes: null,
    failed: false,
    warning: false,
    effectiveLabel: null,
    effectiveLabelSource: null,
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


  blr.W15yQC.ariaLandmarkElement = function (node, xpath, nodeDescription, doc, orderNumber, level, effectiveLabel, effectiveLabelSource, role, stateDescription) {
    this.node = node;
    this.xpath = xpath;
    this.nodeDescription = nodeDescription;
    this.doc = doc;
    this.orderNumber = orderNumber;
    this.level = level;
    this.effectiveLabel = effectiveLabel;
    this.effectiveLabelSource = effectiveLabelSource;
    this.role = role;
    this.stateDescription = stateDescription;
  };

  blr.W15yQC.ariaLandmarkElement.prototype = {
    node: null,
    xpath: null,
    nodeDescription: null,
    doc: null,
    orderNumber: null,
    ownerDocumentNumber: null,
    state: null,
    listedByAT: true,
    level:null,
    effectiveLabel: null,
    effectiveLabelSource: null,
    role: null,
    notes: null,
    failed: false,
    warning: false,
    soundex: null,
    stateDescription: null
  };


  blr.W15yQC.formElement = function (node, xpath, nodeDescription, doc, ownerDocumentNumber, orderNumber, id, name, role, action, method) {
    this.node = node;
    this.xpath = xpath;
    this.nodeDescription = nodeDescription;
    this.doc = doc;
    this.ownerDocumentNumber = ownerDocumentNumber;
    this.orderNumber = orderNumber;
    this.id = id;
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
    id: null,
    name: null,
    role: null,
    action: null,
    method: null,
    notes: null,
    failed: false,
    warning: false,
    stateDescription: null
  };


  blr.W15yQC.formControlElement = function (node, xpath, nodeDescription, parentFormNode, parentFormDescription, doc, orderNumber, controlType, role, id, name, title, legendText, labelText, ARIALabelText, ARIADescriptionText, effectiveLabel, effectiveLabelSource, announcedAs, stateDescription, value) {
    this.node = node;
    this.xpath = xpath;
    this.nodeDescription = nodeDescription;
    this.parentFormNode = parentFormNode;
    this.parentFormDescription = parentFormDescription;
    this.doc = doc;
    this.orderNumber = orderNumber;
    this.controlType = controlType;
    this.role = role;
    this.id = id;
    this.name = name;
    this.value = value;
    this.title = title;
    this.legendText = legendText;
    this.labelTagText = labelText;
    this.ARIALabelText = ARIALabelText;
    this.ARIADescriptionText = ARIADescriptionText;
    this.effectiveLabel = effectiveLabel;
    this.effectiveLabelSource = effectiveLabelSource;
    this.announcedAs = announcedAs;
    this.stateDescription = stateDescription;
  };

  blr.W15yQC.formControlElement.prototype = {
    node: null,
    xpath: null,
    nodeDescription: null,
    controlType: null,
    parentFormNode: null,
    parentFormDescription: null,
    parentFormNumber: null,
    doc: null,
    orderNumber: null,
    ownerDocumentNumber: null,
    role: null,
    state: null,
    listedByAT: true,
    id: null,
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
    effectiveLabel: null,
    effectiveLabelSource: null,
    announcedAs: null,
    soundex: null,
    stateDescription: null
  };


  blr.W15yQC.linkElement = function (node, xpath, nodeDescription, doc, orderNumber, role, stateDescription, effectiveLabel, effectiveLabelSource, text, title, target, href) {
    this.node = node;
    this.xpath = xpath;
    this.nodeDescription = nodeDescription;
    this.doc = doc;
    this.orderNumber = orderNumber;
    this.ownerDocumentNumber = null;
    this.role = role;
    this.aSameLinkText= [];
    this.aSoundsTheSame= [];
    this.aSameHrefAndOnclick= [];
    this.aDiffTextSameHref= [];
    this.stateDescription = stateDescription;
    this.effectiveLabel = effectiveLabel;
    this.effectiveLabelSource = effectiveLabelSource;
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
    aSameLinkText: null,
    aSoundsTheSame: null,
    aSameHrefAndOnclick: null,
    aDiffTextSameHref: null,
    notes: null,
    failed: false,
    warning: false,
    effectiveLabel: null,
    effectiveLabelSource: null,
    text: null,
    state: null,
    listedByAT: true,
    soundex: null,
    title: null,
    target: null,
    href: null,
    stateDescription: null
  };


  blr.W15yQC.image = function (node, xpath, nodeDescription, doc, orderNumber, role, src, width, height, effectiveLabel, effectiveLabelSource, alt, title, ariaLabel) {
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
    this.effectiveLabelSource = effectiveLabelSource;
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
    state: null,
    listedByAT: true,
    src: null,
    width: null,
    height: null,
    alt: null,
    effectiveLabel: null,
    effectiveLabelSource: null,
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


  blr.W15yQC.contrastElement = function (node, xpath, nodeDescription, doc, orderNumber, id, sClass, sText, sTextSize, textWeight, fgColor, fgC, bgColor, bgC, bHasBGImage, fgLuminosity, bgLuminosity, lRatio) {
    this.node = node;
    this.xpath = xpath;
    this.nodeDescription = nodeDescription;
    this.doc = doc;
    this.orderNumber = orderNumber;
    this.id = id;
    this.sClass = sClass;
    this.text = sText;
    this.textSize = sTextSize;
    this.textWeight = textWeight;
    this.fgColor = fgColor;
    this.fgC = fgC;
    this.bgColor = bgColor;
    this.bgC = bgC;
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
    id: null,
    sClass: null,
    text: null,
    textSize: null,
    textWeight: null,
    ownerDocumentNumber: null,
    fgColor: null,
    fgC: null,
    bgColor: null,
    bgC: null,
    hasBackgroundImage: false,
    fgLuminosity: null,
    bgLuminosity: null,
    luminosityRatio: null,
    failed: false,
    warning: false
  };


  blr.W15yQC.accessKey = function (node, xpath, nodeDescription, doc, orderNumber, role, accessKey, effectiveLabel, effectiveLabelSource) {
    this.node = node;
    this.xpath = xpath;
    this.nodeDescription = nodeDescription;
    this.doc = doc;
    this.orderNumber = orderNumber;
    this.role = role;
    this.accessKey = accessKey;
    this.effectiveLabel = effectiveLabel;
    this.effectiveLabelSource = effectiveLabelSource;
  };

  blr.W15yQC.accessKey.prototype = {
    node: null,
    xpath: null,
    nodeDescription: null,
    doc: null,
    orderNumber: null,
    ownerDocumentNumber: null,
    role: null,
    state: null,
    listedByAT: true,
    accessKey: null,
    effectiveLabel: null,
    effectiveLabelSource: null,
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
    obj=null;

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
})();
blr.W15yQC.fnReadUserPrefs();
