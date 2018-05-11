# Smalltalk API
This documentation documents the API of the Smalltalk implementation. Most of these classes are not defined in Smalltalk itself and are used to interface with the JS runtime. Internally (in TypeScript) those classes are usually prefixed with "ST".

## Globals
| Name | Type |
| ---- | ---- |
| Transscript | Transscript |
| Object | Class |
| true | Boolean |
| false | Boolean |

## Classes

### Object
The basic building block of every Smalltalk application. The foundation of everything. Receives messages.

### Class
The meta-representation of a dynamic class that has been created in Smalltalk.

| Method | Description |
| ------ | ----------- |
| new -> Instance | Instantiates this class |
| setMethod:String to:Block -> Nil | Registers an instance method |
| setClassMethod:String to:Block -> Nil | Registers a class method |

Delegates other messages to registered class methods.

### Instance
The meta-representation of an instance of a `Class`.

| Method | Description |
| ------ | ----------- |
| set:String to:Object -> Nil | Sets a property |
| get:String -> Object | Fetches a property by name |

Delegates other messages to registered instance methods in `Class`.

### Transscript
The output console.

| Method | Description |
| ------ | ----------- |
| show:String -> Nil | Prints a string to the console |

### String
A sequence of characters. Can only be created through literals currently.

### Number
A floating-point number.

| Method | Description |
| ------ | ----------- |
| plus:Number -> Number | Performs addition |
| minus:Number -> Number | Performs subtraction |
| times:Number -> Number | Performs multiplication |
| divide:Number -> Number | Performs division |

## Boolean
A truth value that can either be true or false.

### Nil
An object representing the absence of a value. Equivalent to "null" or "void" in other languages.

### Message
Holds an piece of information that is used to call a method.

### Block
Encapsulates Smalltalk code that can be dynamically called.