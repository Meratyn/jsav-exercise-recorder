#!/bin/bash

# A quick and dirty script to update the schema files. 
# It assumes that JAAL is in the same folder as jsav-exercise-recorder
rm -r ./schemas/*
cp ../../JAAL/spec/schemas/* schemas/
