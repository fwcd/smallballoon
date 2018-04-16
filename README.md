# Balloon
A Smalltalk interpreter for TypeScript/NodeJS.

The project is still in a very early stage, so expect parts of it to lack functionality or not work at all.

## Dependencies
* TypeScript 2.8.1 (development)
* ES5 (target)

## Setup
>`npm install -g typescript`

## Compile sources
>`tsc` (Optionally enable the -w flag to automatically compile changes.)

The JS sources will appear in the build folder

## Run main sources
>`npm run main -- path/to/your/smalltalk/app.st`

## Run test sources
>`npm run test`