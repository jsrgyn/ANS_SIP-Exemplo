
# XML Validator

Typed node.js XML validator.

## Installation

Using yarn:

```bash
yarn add xml-validator
```

Using npm:

```bash
npm i xml-validator
```

## 👀 Quickstart

```typescript
import { XmlValidator } from "../src";

const validator = new XmlValidator();

const validation = validator.validate("<root></root>")

console.log(validation.isValid); // true
console.log(validation.error); // ""
```

## Advanced Example

```typescript
import { XmlValidator } from "../src";

const validator = new XmlValidator({
    userAgent: "MyMozilaFirefox",
});

{
    console.log("example1")
    const { isValid, error } = validator.validate("<root</root>")
    console.log(isValid); // false
    console.log(error); // about:blank:1:6: disallowed character in tag name.
}

{
    console.log("example2")
    const { isValid, error } = validator.validate("<root></root>")
    console.log(isValid); // true
    console.log(error); // ""
}

validator.validateUrl("https://www.w3schools.com/xml/simple.xml")
    .then(validation => {
        console.log("example3")
        console.log(validation.isValid); // true
        console.log(validation.error); // ""
    })

validator.validateUrl("https://www.w3schools.com/xml/note_error.xml")
    .then(validation => {
        console.log("example5")
        console.log(validation.isValid); // false
        console.log(validation.error); // https://www.w3schools.com/xml/note_error.xml:4:19: unexpected close tag.
    })
```

## Methods

### `validate(content: string, type: XmlTypes = "application/xml")`

Returns validation result of passed XML string using specified DOM type.  

### `validateUrl(url: string)`

Returns validation result of downloaded XML file from specified URL, DOM type asserts automaticly.

### `validateFile(url: string, type: XmlTypes = "application/xml")`

Returns validation result of XML file from certain path (URL) using specified DOM type.

## License

MIT - Made by [tsziming](https://github.com/tsziming)
