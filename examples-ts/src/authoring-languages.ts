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
