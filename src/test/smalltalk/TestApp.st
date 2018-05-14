b := (6 times:2).
c := b divide:3.

Transcript show:"=== Number testing ===".
Transcript show:((3 plus:b) divide:(10 minus:c)).

Transcript show:"=== Boolean testing ===".
Transcript show:(true and:false).
Transcript show:(true xor:false).
Transcript show:((false not) ifTrue:[
	Transcript show:"Reached a true block".
] ifFalse:[
	Transcript show:"Reached a false block".
]).

Transcript show:"=== Block testing ===".
i := 0.
[i lessOrEqual:5] whileTrue:[
	i := i plus:1.
	Transcript show:i.
].

Transcript show:"=== JS-bridge testing ===".
JS run:"console.log('Hello JavaScript!')".

Transcript show:"=== Import testing ===".
Runtime import:"src/test/smalltalk/TestImport.st".
Transcript show:someVariable.
Transcript show:anotherVariable.

Transcript show:"=== Local variable testing ===".
a := "A global variable".
b := "A global variable".
[
	| a |
	a := "A local variable".
	b := "A global variable assigned from a block".
	Transcript show:("Local a: " and:a).
	Transcript show:("Local b: " and:b).
] value.
Transcript show:("Global a: " and:a).
Transcript show:("Global b: " and:b).

Transcript show:"=== Dynamic classes testing ===".
Vector := Object subclass.
Vector setMethod:"x" to:[self get:"x"].
Vector setMethod:"y" to:[self get:"y"].
Vector setClassMethod:"ofX:y:" to:[:x :y |
	| vec |
	vec := Vector new.
	vec set:"x" to:x.
	vec set:"y" to:y.
	vec.
].
Vector setMethod:"add:" to:[:other |
	Vector ofX:((self x) plus:(other x)) y:((self y) plus:(other y)).
].

vecA := Vector ofX:24 y:12.
vecB := Vector ofX:13 y:4.
vecC := vecA add:vecB.
Transcript show:vecC.