# Balloon
A Smalltalk interpreter for JavaScript/TypeScript. A quick example:

```smalltalk
i := 0.
[i lessOrEqual:5] whileTrue:[
	Transcript show:i.
	i := i plus:1.
].
```

100% interoperable with JS:

```smalltalk
(JS get:"console") log:"Hello JavaScript!".
```

```javascript
new STLoader().runSTCode('Transcript show:"Hello Smalltalk!"');
```

## Dependencies
* TypeScript 2.8.1 (development)
* ES5 (target)
* Node.js (only used to open files)

## Setup using npm
>`npm install -g typescript`

>`npm install`

## Compile sources
>`tsc` (Optionally enable the -w flag to automatically compile changes.)

The JS sources will appear in the build folder

## Run main sources
>`npm run main -- path/to/your/smalltalk/app.st`

## Run test sources
>`npm run test`