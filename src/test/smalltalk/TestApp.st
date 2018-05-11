a := "Test".
b := (6 times:2).
c := b divide:3.

Transscript show:"=== Number testing ===".
Transscript show:a.
Transscript show:((3 plus:b) divide:(10 minus:c)).

Transscript show:"=== Boolean testing ===".
Transscript show:(true and:false).
Transscript show:(true xor:false).
Transscript show:((false not) ifTrue:[
	Transscript show:"Boolean is true!".
]).