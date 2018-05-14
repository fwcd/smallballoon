Set := Object subclass.

Set setClassMethod:"create" to:[
	Set new.
].

Set setMethod:"insert:" to:[:item |
	self set:item to:true.
].

Set setMethod:"remove:" to:[:item |
	self set:item to:false.
].

Set setMethod:"contains:" to:[:item |
	true equals:(self get:item).
].