#!/bin/bash
echo Updating W15yQC Beta Version number from $1 to $2
releaseDate=$(date "+%B %d, %Y")

#sed -e "s/releaseVersion: '1.0 - Beta $1'/releaseVersion: '1.0 - Beta $2'/" -e "s/releaseDate: '[a-zA-Z0-9 ,]*'/releaseDate: '$releaseDate'/" <~/Dropbox/dev/W15yQC/content/overlay.js >~/Dropbox/dev/W15yQC/content/overlay.new.js
#mv ~/Dropbox/dev/W15yQC/content/overlay.js ~/Dropbox/dev/W15yQC/content/overlay.old.js
#mv ~/Dropbox/dev/W15yQC/content/overlay.new.js ~/Dropbox/dev/W15yQC/content/overlay.js

sed "s/b$1<\/em:version>/b$2<\/em:version>/" <~/Dropbox/dev/W15yQC/install.rdf >~/Dropbox/dev/W15yQC/install.new.rdf
mv ~/Dropbox/dev/W15yQC/install.rdf ~/Dropbox/dev/W15yQC/install.old.rdf
mv ~/Dropbox/dev/W15yQC/install.new.rdf ~/Dropbox/dev/W15yQC/install.rdf

~/Dropbox/dev/W15yQC/build_mac.sh
mkdir ~/Dropbox/dev/W15yQC-gh-pages/W15yQC/downloads/ver-1.0-b$2
cp ~/Dropbox/dev/W15yQC/W15yQC.xpi ~/Dropbox/dev/W15yQC/w15yqc-v1.0-b$2.xpi
cp ~/Dropbox/dev/W15yQC/w15yqc-v1.0-b$2.xpi ~/Dropbox/dev/W15yQC-gh-pages/W15yQC/downloads/ver-1.0-b$2/w15yqc-v1.0-b$2.xpi
cp ~/Dropbox/dev/W15yQC/w15yqc-v*.xpi ~/Dropbox/dev/supsW15yQC/oldVersions/
rm ~/Dropbox/dev/W15yQC/w15yqc-v*.xpi
