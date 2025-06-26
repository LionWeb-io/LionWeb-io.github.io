---
sidebar_position: 42
---

# Creating and Working with Nodes in LionWeb

LionWeb provides a flexible and language-agnostic model for working with models (or trees, or ASTs: let's consider these as synonyms in this context). 

The main component is the **Node**.

When working with LionWeb nodes in Typescript, there are **two complementary approaches** depending on your needs:

1. **Homogeneous nodes**, using generic, universal APIs which work with all form of nodes. When choosing this approach, we may want to consider `DynamicNode`.
2. **Heterogeneous nodes**, using language-specific, statically-typed Typescript classes, defined for a certain LionWeb language and just that one.

## The Core Abstraction: `Node`

At the heart of LionWeb is the `Node` interface. Implementing it guarantees:

- Serialization and deserialization
- Compatibility with the LionWeb Server
- Introspection through classifiers and features
- Tool support (e.g., editors, model processors)

By relying on this interface, LionWeb tooling can process, manipulate, and analyze any conforming node in a uniform manner.

## Option 1: Homogeneous Nodes

This approach is ideal for **generic tools** and **runtime interoperability**. The key class here is `DynamicNode`.

### When to Use

- You receive nodes from external systems or clients
- You want to handle **unknown or dynamic languages**
- You’re building **generic tools** (e.g., validators, browsers)

### How it Works

`DynamicNode` implements `Node` and stores features dynamically. You can query and manipulate the node’s structure by name.

### Example

```typescript
import {
    builtinPrimitives,
    chain,
    concatenator, dynamicExtractionFacade,
    dynamicInstantiationFacade,
    LanguageFactory,
    lastOf,
    serializeLanguages, serializeNodes
} from "@lionweb/core"
import {hasher, writeJsonAsFile} from "@lionweb/utilities"
import {LanguageRegistry, LionWebValidator, ValidationResult} from "@lionweb/validation"
const {stringDatatype} = builtinPrimitives
import {DynamicNode} from "@lionweb/core"

// === Define the Language ===

const factory = new LanguageFactory(
    "Task Language", // Language name
    "1.0",            // Version
    chain(concatenator("-"), hasher({ encoding: "base64" })), // ID generation strategy
    lastOf            // Conflict resolution strategy
);

export const taskLanguage = factory.language;

// Define 'TaskList' concept
export const TaskList = factory.concept("TaskList", false);
TaskList.partition = true;

// Define 'Task' concept
export const Task = factory.concept("Task", false);

// Add a 'tasks' containment to TaskList
export const TaskList_tasks = factory
    .containment(TaskList, "tasks")
    .ofType(Task);
TaskList_tasks.optional = false;
TaskList_tasks.multiple = true;

// Add a 'name' property to Task
export const Task_name = factory
    .property(Task, "name")
    .ofType(stringDatatype);

// === Use DynamicNode to Build a Model ===

// Create root node (TaskList)
const errands : DynamicNode = {
    annotations: [],
    classifier: TaskList,
    id: "errands",
    settings: {}
};

// Create first Task
const task1 : DynamicNode = {
    annotations: [],
    classifier: Task,
    id: "task1-id",
    settings: {}
};
dynamicInstantiationFacade.setFeatureValue(task1, Task_name, "My Task #1")
dynamicInstantiationFacade.setFeatureValue(errands, TaskList_tasks, task1);

// Create second Task
const task2 : DynamicNode = {
    annotations: [],
    classifier: Task,
    id: "task2-id",
    settings: {}
};
dynamicInstantiationFacade.setFeatureValue(task2, Task_name, "My Task #2")
dynamicInstantiationFacade.setFeatureValue(errands, TaskList_tasks, task2);

// === Validate the model tree ===

const validationResult = new ValidationResult();
const languageRegistry = new LanguageRegistry();

new LionWebValidator(validationResult, languageRegistry).validateAll();

if (validationResult.hasErrors()) {
    throw new Error(`The tree is invalid:\n${validationResult.issues.join("\n")}`);
}

// === Access the model using containment reference ===

const tasks = dynamicExtractionFacade.getFeatureValue(errands, TaskList_tasks) as Array<DynamicNode>;
console.log(`Tasks found: ${tasks.length}`);
for (const task of tasks) {
    console.log(` - ${dynamicExtractionFacade.getFeatureValue(task, Task_name)}`);
}

const serializationChunk = serializeNodes([errands], dynamicExtractionFacade);
writeJsonAsFile("nodes.json", serializationChunk);
```

### Evaluation

- No static typing
- No compile-time safety
- No code completion or type checking
- Work out of the box, without the need to write any code for each language

If you use a feature that is not part of the concept of the node you are working with, you’ll get a runtime exception.

## Option 2: Heterogeneous Nodes

This approach is recommended when building **interpreters**, **compilers**, or other tools for a **specific language**.

You define a Typescript class for each concept, typically:

- Implementing the `Node` interface
- Optionally extending `DynamicNode` for convenience

### But how can you define these classes?

Of course, you can do that in the good old way: writing the code yourself.

Or you can define a code generator which, given a language, produce the corresponding classes. This may also be a feature we eventually implement in LionWeb Typescript.

### When to Use

- You are building tooling for a specific DSL or language
- You want type-safe code with IDE support
- You require structured, validated access to features

### Example

```typescript
import {
    builtinPrimitives,
    chain, Classifier,
    ClassifierDeducer,
    concatenator, Concept, dynamicExtractionFacade,
    dynamicInstantiationFacade, Enumeration, EnumerationLiteral, ExtractionFacade,
    Feature,
    Id,
    LanguageFactory,
    lastOf, ResolveInfoDeducer, serializeNodes,
} from "@lionweb/core"
import {hasher, writeJsonAsFile} from "@lionweb/utilities"
import {LanguageRegistry, LionWebValidator, ValidationResult} from "@lionweb/validation"

const {stringDatatype} = builtinPrimitives
import {v4 as uuidv4} from 'uuid';
import {Node} from "@lionweb/core/dist/types";

// === Define the Language ===

const factory = new LanguageFactory(
    "Task Language", // Language name
    "1.0",            // Version
    chain(concatenator("-"), hasher({encoding: "base64"})), // ID generation strategy
    lastOf            // Conflict resolution strategy
);

export const taskLanguage = factory.language;

// Define 'TaskList' concept
export const TaskListConcept = factory.concept("TaskList", false);
TaskListConcept.partition = true;

// Define 'Task' concept
export const TaskConcept = factory.concept("Task", false);

// Add a 'tasks' containment to TaskList
export const TaskList_tasks = factory
    .containment(TaskListConcept, "tasks")
    .ofType(TaskConcept);
TaskList_tasks.optional = false;
TaskList_tasks.multiple = true;

// Add a 'name' property to Task
export const Task_name = factory
    .property(TaskConcept, "name")
    .ofType(stringDatatype);

// === Define classes for our concepts ===

abstract class BaseNode {
    parent?: Node;

    constructor(public classifier: Concept, public id: string = uuidv4(), public annotations: BaseNode[] = []) {

    }
}

class TaskList extends BaseNode {
    tasks: Task[] = [];

    constructor(id: string = uuidv4()) {
        super(TaskListConcept, id);
    }

    addTask(task: Task) {
        this.tasks.push(task);
        task.parent = this;
    }
}

class Task extends BaseNode {
    name: string = "<unnamed>";

    constructor(id: string = uuidv4()) {
        super(TaskConcept, id);
    }
}

// === Use our classes to build a model ===

// Create root node (TaskList)
const errands = new TaskList();

// Create first Task
const task1 = new Task();
task1.name = "My Task #1";
errands.addTask(task1);

// Create second Task
const task2 = new Task();
task2.name = "My Task #2";
errands.addTask(task2);


// === Validate the model tree ===

const validationResult = new ValidationResult();
const languageRegistry = new LanguageRegistry();

new LionWebValidator(validationResult, languageRegistry).validateAll();

if (validationResult.hasErrors()) {
    throw new Error(`The tree is invalid:\n${validationResult.issues.join("\n")}`);
}

// === Access the model ===

console.log(`Tasks found: ${errands.tasks.length}`);
for (const task of errands.tasks) {
    console.log(` - ${task.name}`);
}

class MyExtractionFacade implements ExtractionFacade<BaseNode> {
    classifierOf: ClassifierDeducer<BaseNode> = (node: BaseNode) => node.classifier;
    getFeatureValue(node: BaseNode, feature: Feature) : unknown {
        if (feature == TaskList_tasks) {
            return (node as TaskList).tasks;
        }
        if (feature == Task_name) {
            return (node as Task).name;
        }
        throw new Error(`To be implemented: ${feature}`)
    }
    enumerationLiteralFrom(encoding: unknown, enumeration: Enumeration) : EnumerationLiteral | null {
        throw new Error("Not implemented");
    }
    resolveInfoFor?: ResolveInfoDeducer<BaseNode> | undefined = (node: BaseNode) => {
        throw new Error("Not implemented");
    };
    constructor() {
        this.classifierOf = (node: BaseNode) => node.classifier;
    }
}
const myExtractionFacade = new MyExtractionFacade();

const serializationChunk = serializeNodes([errands], myExtractionFacade);
writeJsonAsFile("nodes-heterogeneous.json", serializationChunk);
```

### Evaluation

- Full IDE support (auto-completion, navigation)
- Catch errors at compile time
- Clear API for collaborators
- Require extra work for defining the classes

## Suggested approach

- Use `DynamicNode` in **model editors**, **importers**, **migrators**
- Use custom classes (like `TaskList`) in **interpreters**, **generators**, **type checkers**

## Interoperability

Both approaches can co-exist. For example, you might parse a file into `DynamicNode` objects and then convert them into typed classes using a factory or builder.
