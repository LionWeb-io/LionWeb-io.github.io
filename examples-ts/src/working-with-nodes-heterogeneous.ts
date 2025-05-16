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
