a := "Test".
b := (6 times:2).
c := b divide:3.

Transcript show:"=== Number testing ===".
Transcript show:a.
Transcript show:((3 plus:b) divide:(10 minus:c)).

Transcript show:"=== Boolean testing ===".
Transcript show:(true and:false).
Transcript show:(true xor:false).
Transcript show:((false not) ifTrue:[
	Transcript show:"Reached a true block".
] ifFalse:[
	Transcript show:"Reached a false block".
]).

i := 0.
[i lessOrEqual:5] whileTrue:[
	Transcript show:i.
	i := i plus:1.
].

Transcript show:"=== JS-bridge testing ===".
JS run:"console.log('Hello JavaScript!')".