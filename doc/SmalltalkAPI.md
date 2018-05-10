# Smalltalk API
This documentation documents the API of the Smalltalk implementation. Most of these classes are not defined in Smalltalk itself and are used to interface with the JS runtime. Internally (in TypeScript) those classes are usually prefixed with "ST".

## Globals
| Name | Type |
| ---- | ---- |
| Transscript | Transscript |
| Object | Class |

## Classes

### Object
The basic building block of every Smalltalk application. The foundation of everything. Receives messages.

### Class
The meta-representation of a dynamic class that has been created in Smalltalk.

### Instance
The meta-representation of an instance of a dynamic class.

### Transscript
The output console.

| Method | Description |
| ------ | ----------- |
| show:String | Prints a string to the console |

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

### Nil
An object representing the absence of a value.

### Message
Holds an piece of information that is used to call a method.

### Block
Encapsulates Smalltalk code that can be dynamically called.