# Smalltalk API
This documentation documents the API of the Smalltalk implementation. Most of these classes are not defined in Smalltalk itself and are used to interface with the JS runtime. Internally (in TypeScript) those classes are usually prefixed with "ST".

## Globals
| Name | Type |
| ---- | ---- |
| Transcript | Transcript |
| Object | Class |
| true | Boolean |
| false | Boolean |
| JS | JSRuntime |
| Runtime | Runtime |

## Classes

### Object
The basic building block of every Smalltalk application. The foundation of everything. Receives messages.

### ObjectBase
The root of most Smalltalk class hierarchies. Provides basic, universal methods.

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
| set:Object to:Object -> Nil | Sets a property by name |
| get:Object -> Object | Fetches a property by name |
| asString -> String | Converts this instance to a string |

Delegates other messages to registered instance methods in `Class`.

### Transcript
The output console.

| Method | Description |
| ------ | ----------- |
| show:String -> Nil | Prints a string to the console |

### String
A sequence of characters. Can only be created through literals currently.

| Method | Description |
| ------ | ----------- |
| equals:String -> Boolean | Checks for equality (case-sensitive) |
| toNumber -> Number | Converts this string to a number |
| and:Object -> String | Concatenates this string with another |

### Number
A floating-point number.

| Method | Description |
| ------ | ----------- |
| plus:Number -> Number | Performs addition |
| minus:Number -> Number | Performs subtraction |
| times:Number -> Number | Performs multiplication |
| divide:Number -> Number | Performs division |
| sqrt -> Number | Returns the square root of this number |
| pow:Number -> Number | Raises this number to the given exponent |
| greaterThan:Number -> Boolean | Checks whether this number is greater than another |
| greaterOrEqual:Number -> Boolean | Checks whether this number is greater than or equal to another |
| lessThan:Number -> Boolean | Checks whether this number is less than another |
| lessOrEqual:Number -> Boolean | Checks whether this number is less than or equal to another |
| equals:Number -> Boolean | Checks whether this number is equal to another |
| asString -> String | Converts this number to a string |

## Boolean
A truth value that can either be true or false.

| Method | Description |
| ------ | ----------- |
| and:Boolean -> Boolean | Performs logical AND |
| not -> Boolean | Performs logical NOT |
| or:Boolean -> Boolean | Performs logical OR |
| xor:Boolean -> Boolean | Performs logical XOR |
| ifTrue:Block -> Nil | Executes the block if this boolean is true |
| ifFalse:Block -> Nil | Executes the block if this boolean is false |
| ifTrue:Block ifFalse:Block -> Nil | Executes the first block if this boolean is true, otherwise execute the other block |

### Nil
An object representing the absence of a value. Equivalent to "null" or "void" in other languages.

### Message
Holds an piece of information that is used to call a method.

### Block
Encapsulates Smalltalk code that can be dynamically called. The last statement in a block is returned.

| Method | Description |
| ------ | ----------- |
| value -> Object | Evaluates this block |
| whileTrue:Block -> Nil | Runs the given block as long as this block evaluates to true (before performing an iteration) |
| whileFalse:Block -> Nil | Runs the given block as long as this block evaluates to false (before performing an iteration) |
| doWhileTrue:Block -> Nil | Runs the given block as long as this block evaluates to true (after performing an iteration) |
| doWhileFalse:Block -> Nil | Runs the given block as long as this block evaluates to false (after performing an iteration) |

Otherwise a message is interpreted as an evaluation using only the block parameters as argument labels.

### JSRuntime
An API class that allows Smalltalk to call JavaScript code.

| Method | Description |
| ------ | ----------- |
| eval:String -> Object | Runs JavaScript code and tries to convert the result to a Smalltalk type |
| get:String -> JSObject | Runs JavaScript code and returns a reference to the provided JS object in a Smalltalk wrapper |

### JSObject
A wrapper for a JavaScript object that is accessible from Smalltalk.

| Method | Description |
| ------ | ----------- |
| toSTObject -> Object | Tries to convert the object to a Smalltalk representation (Object or Number, otherwise String) |
| mapUsingJS:String -> Object | Interprets the parameter as JavaScript code with "this" representing this object and wraps the evaluated result in another JSObject |
| getProperty:Object -> Object | Returns the wrapped JS object after calling the subscript operator using the given parameter |
| evalProperty:Object -> Object | Returns the JS object converted to a Smalltalk type after calling the subscript operator using the given parameter |
| setProperty:Object to:Object -> Nil | Associates the second argument with this object (converted to a JS type) after calling the subscript operator using the first argument |

Interprets other messages as method calls on this particular JS object. For example:

```smalltalk
jsObject log:"Test" and:24.
```

would be equivalent to:

```javascript
jsObject.log("Test", 24);
```

### Runtime
Provides access to runtime-related methods.

| Method | Description |
| ------ | ----------- |
| import:String -> Nil | Imports a Smalltalk file to the current context using a relative path |