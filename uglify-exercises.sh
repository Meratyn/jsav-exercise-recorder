#!/bin/bash

# Simply remove all code comments

cd testbench/OpenDSA/AV/Development
cpp -undef -P DijkstraPE-research.js > DijkstraPE-research-ugly.js
cpp -undef -P DijkstraPE-research-v2.js > DijkstraPE-research-v2-ugly.js

# update to DSA Y
cp DijkstraPE-research-ugly.js \
../../../../../traky/tools/extras/OpenDSA/AV/Development/DijkstraPE-research.js

cp DijkstraPE-research-v2-ugly.js \
../../../../../traky/tools/extras/OpenDSA/AV/Development/DijkstraPE-research-v2.js
