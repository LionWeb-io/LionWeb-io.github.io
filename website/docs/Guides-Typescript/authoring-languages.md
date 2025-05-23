---
sidebar_position: 41
---

# Authoring Languages for LionWeb

LionWeb is an open initiative to enable **interoperability among language engineering tools**. 

Therefore, typically one would:
* Use one of the tools compatible with LionWeb to author a language
* Export the language into LionWeb format and import it in other tools

Alternatively, a language can also be defined programmatically using the API provided by LionWeb Typescript.

## Using LionWeb-compatible tools to author languages

In most real-world use cases, **language definitions (or metamodels)** are created using **dedicated language workbenches or modeling tools**. These tools provide expressive, user-friendly environments to author, maintain, and evolve languages.

You may want to consider

- [**JetBrains MPS**](https://www.jetbrains.com/mps/): A powerful projectional editor with LionWeb export support provided through [LionWeb MPS](http://github.com/lionweb-io/lionweb-mps).
- [**Freon**](https://www.freon4dsl.dev/): A lightweight web-based projectional editor, with support for LionWeb provided through [LionWeb-Freon-M3](https://github.com/LionWeb-io/lionweb-freon-m3).
- [**StarLasu**](https://starlasu.strumenta.com/): A cross-platform framework for language engineering framework developed by [Strumenta](https://strumenta.com).

These tools allow engineers to create languages using their built-in mechanisms and then **export them to LionWeb-compatible formats**. Once exported, these languages can be:

- Used in other LionWeb-aware tools.
- Serialized to formats like **JSON**, **FlatBuffer**, or **BroadBuffer**.
- Re-imported across the ecosystem.

This workflow maximizes **interoperability and reuse**, allowing language definitions to move seamlessly across platforms.

---

## Authoring Languages Programmatically

While most users rely on external tools, **it is also possible to author languages programmatically** using LionWeb-Typescript.

Using the API in the `core` module, you can define metamodels directly in Typescript code. This gives you the flexibility to:

- Build metamodels dynamically.
- Serialize and persist them.
- Use them in Typescript libraries and programs.
- Export them to LionWeb formats for use elsewhere.

### Supported Serialization Formats

The LionWeb Typescript implementation supports serialization in **JSON** (standard and human-readable).
As of now, it does not support **ProtoBuf** and **FlatBuffers** (compact binary format). If you want support
for them to be added please feel free to reach out and let us know.

---

## Example: Defining a Language Programmatically

The following example shows how to define a minimal language with a single concept `Task` that has a `name` property.

```typescript
import {builtinPrimitives, chain, concatenator, LanguageFactory, lastOf, serializeLanguages} from "@lionweb/core"
import {hasher, writeJsonAsFile} from "@lionweb/utilities"
import {LanguageRegistry, LionWebValidator, ValidationResult} from "@lionweb/validation"
const {stringDatatype} = builtinPrimitives

// Step 1: Create a language factory
const factory = new LanguageFactory(
    "Task Language", // Language name
    "1.0",            // Version
    chain(concatenator("-"), hasher({ encoding: "base64" })), // ID generation strategy
    lastOf            // Conflict resolution strategy
);

// Step 2: Export the language object
export const taskLanguage = factory.language;

// Step 3: Define the "Task" concept
export const Task = factory.concept("Task", false); // abstract = false

// Step 4: Add a 'name' property of type string
export const Task_name = factory.property(Task, "name").ofType(stringDatatype);

// Step 5: Serialize to JSON
const serializationChunk = serializeLanguages(taskLanguage);

// Step 6: Validate the language
const myLanguageRegistry = new LanguageRegistry();
const validationResult = new ValidationResult();

new LionWebValidator(serializationChunk, myLanguageRegistry).validateAll();
if (validationResult.hasErrors()) {
    throw new Error(`Let's fix these errors: ${validationResult.issues.map(i => i.errorMsg()).join(", ")}`);
}

// Step 7: Write JSON to file
writeJsonAsFile("task-language.json", serializationChunk);
```
