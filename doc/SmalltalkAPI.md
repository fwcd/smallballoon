# Smalltalk API Classes
This documentation enumerates the built-in classes in the Smalltalk implementation.

## Object
The basic component of every Smalltalk application. Receives messages.

## Transscript
The output console.

| Class method | Description |
| ------------ | ----------- |
| show:String | Prints a string to the console |

## String
A sequence of characters. Can only be created through literals currently.

## Number
A floating-point number.

| Instance method | Description |
| --------------- | ----------- |
| plus:Number -> Number | Performs addition |
| minus:Number -> Number | Performs subtraction |
| times:Number -> Number | Performs multiplication |
| divide:Number -> Number | Performs division |

## Nil
An object representing the absence of a value.

## Message
Holds an piece of information that is used to call a method.

## Block
Encapsulates Smalltalk code that can be dynamically called.