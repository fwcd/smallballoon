Vector2D := Object subclass.

Vector2D setMethod:"x" to:[self get:"x"].
Vector2D setMethod:"y" to:[self get:"y"].

Vector2D setClassMethod:"ofX:andY:" to:[:x :y |
	| vec |
	vec := Vector2D new.
	vec set:"x" to:x.
	vec set:"y" to:y.
	vec.
].
Vector2D setMethod:"plus:" to:[:other |
	Vector2D ofX:((self x) plus:(other x)) andY:((self y) plus:(other y)).
].
Vector2D setMethod:"minus:" to:[:other |
	Vector2D ofX:((self x) minus:(other x)) andY:((self y) minus:(other y)).
].
Vector2D setMethod:"scale:" to:[:factor |
	Vector2D ofX:((self x) times:factor) andY:((self y) times:factor).
].
Vector2D setMethod:"dot:" to:[:other |
	((self x) times:(other x)) plus:((self y) times:(other y)).
].
Vector2D setMethod:"length" to:[
	(((self x) pow:2) plus:((self y) pow:2)) sqrt.
].
Vector2D setMethod:"normalize" to:[
	| len |
	len := self length.
	self scale:(1 divide:len).
].