Array := Object subclass.

Array setClassMethod:"create" to:[
	| instance |
	instance := Array new.
	instance set:"jsArray" to:(JS get:"[]").
	instance.
].

Array setClassMethod:"of:" to:[:firstElement |
	| instance |
	instance := Array create.
	instance push:firstElement.
	instance.
].

Array setMethod:"at:" to:[:index |
	(self get:"jsArray") getProperty:index.
].

Array setMethod:"at:put:" to:[:index :item |
	(self get:"jsArray") setProperty:index to:item.
].

Array setMethod:"push:" to:[:item |
	(self get:"jsArray") push:item.
].

Array setMethod:"pop:" to:[:item |
	(self get:"jsArray") pop:item.
].

Array setMethod:"length" to:[
	(self get:"jsArray") mapUsingJS:"this.length".
].

Array setMethod:"forEach:" to:[:then |
	| i len |
	i := 0.
	len := self length.
	[i lessThan:len] whileTrue:[
		then each:(self at:i).
		i := i plus:1.
	].
].