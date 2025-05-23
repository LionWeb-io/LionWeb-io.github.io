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
writeJsonAsFile("nodes-homogeneous.json", serializationChunk);
