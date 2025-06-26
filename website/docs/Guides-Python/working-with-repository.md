---
title: Working with the LionWeb Repository
sidebar_position: 44
---

# Working with the LionWeb Repository

Working with the [LionWeb Server](https://github.com/LionWeb-io/lionweb-server) we can store and retrieve nodes. 
It is also a mean to exchange models with other LionWeb-compliant components. You can refer to the website of the 
LionWeb Server to learn how to start it. 

This page provides an overview of how to interact with the server using the provided Python client and outlines the 
basic concepts involved.

## Overview

The LionWeb Server is a generic storage system designed to hold nodes conforming to the LionWeb metamodel.

It provides two sets of APIs:

* The Bulk APIs: intended to store and retrieve entire partitions or large sub-trees
* The Delta APIs: currently under development, it will support real-time collaboration

The LionWeb Server can also optionally support versioning.

In this guide we will only focus on the Bulk APIs.

## Working with the Bulk APIs

It offers REST APIs for communication, which are wrapped in a convenient Python client: `RepoClient`. This client supports features like:

- Creating and managing **partitions** (top-level model containers)
- Storing and retrieving **nodes**
- Supporting multiple **LionWeb versions**

## Example Usage

The following example demonstrates how to use the LionWeb Java client to:

1. Connect to a running LionWeb Repository
2. Define a language and register it
3. Create a partition node
4. Add children to that partition
5. Store and retrieve nodes

```python
import uuid
from typing import Optional, List

from lionweb import LionWebVersion
from lionweb.language import Concept, Property, LionCoreBuiltins, Containment, Language
from lionweb.repoclient import RepoClient
from lionweb.model import DynamicNode
from lionweb.repoclient.repo_client import RepositoryConfiguration
from lionweb.utils import root

# Global elements
task_list_concept: Concept
task_concept: Concept
name_property: Property
tasks_containment: Containment
task_language: Language

def define_language():
    global task_list_concept, task_concept, name_property, tasks_containment, task_language

    # Define the 'TaskList' concept
    task_list_concept = Concept(
        name="TaskList", key="TaskList", id="TaskList-id", abstract=False, partition=True
    )

    # Define the 'Task' concept
    task_concept = Concept(
        name="Task", key="Task", id="Task-id", abstract=False, partition=False
    )

    # Add a 'tasks' containment
    tasks_containment = Containment(
        name="tasks",
        key="TasksList-tasks",
        id="TasksList-tasks-id",
        type=task_concept,
        multiple=True,
        optional=False,
    )
    task_list_concept.add_feature(tasks_containment)

    # Add a 'name' property
    name_property = Property(
        name="name", key="task-name", id="task-name-id", type=LionCoreBuiltins.get_string()
    )
    task_concept.add_feature(name_property)

    # Define the language container
    task_language = Language(
        name="Task Language",
        key="task",
        id="task-id",
        version="1.0"
    )
    task_language.add_element(task_list_concept)
    task_language.add_element(task_concept)


# === Define specific DynamicNode subclasses ===

class Task(DynamicNode):
    def __init__(self, name: str, id: Optional[str] = None):
        super().__init__(id or str(uuid.uuid4()), task_concept)
        self.set_name(name)

    def set_name(self, name: str):
        self.set_property_value(name_property, name)

    def get_name(self) -> str:
        return self.get_property_value(name_property)


class TaskList(DynamicNode):
    def __init__(self, id:Optional[str] = None):
        super().__init__(id or str(uuid.uuid4()), task_list_concept)

    def add_task(self, task: Task):
        self.add_child(tasks_containment, task)

    def get_tasks(self) -> List[Task]:
        return self.get_children(tasks_containment)

def repo_example():
    # Create the client
    client = RepoClient(lionweb_version=LionWebVersion.V2024_1, repo_url="http://localhost:3005", repository_name="myRepo")
    client.create_repository(RepositoryConfiguration(name='myRepo', lionweb_version=LionWebVersion.V2024_1, history=False))

    # Register the language
    client.serialization().register_language(task_language)

    def task_list_deserializer(classifier, sci, nodes_by_id, property_values) -> TaskList:
        return TaskList(id=sci.id)


    def task_deserializer(classifier, sci, nodes_by_id, property_values) -> Task:
        return Task(id=sci.id, name=property_values[name_property])

    client.serialization().instantiator.register_custom_deserializer(task_list_concept.id, task_list_deserializer)
    client.serialization().instantiator.register_custom_deserializer(task_concept.id, task_deserializer)

    # Create a partition node
    tl1 = TaskList(id="TL1")

    # Create the partition on the server
    client.create_partition(tl1)

    # Create two files
    t1 = Task(name="Do laundry")
    t2 = Task(name="Write documentation for LionWeb Python")

    # Add them to the partition
    tl1.add_task(t1)
    tl1.add_task(t2)

    # Store the model in the repository
    client.store([tl1])

    # Retrieve and check
    retrieved_nodes = client.retrieve(["TL1"])
    assert len(retrieved_nodes) == 3

    retrieved_tl1 = root(retrieved_nodes)
    assert retrieved_tl1.id == 'TL1'

if __name__ == "__main__":
    define_language()
    repo_example()
```

And this is how the result would look like in the [LionWeb Repo Admin UI](https://github.com/LionWeb-io/lionweb-repo-admin-ui):

![](/img/repo-admin-ui.png)

### Creating partitions

Something to keep in mind is that the LionWeb Repository will only let us create partitions without children. 
So, we may need to create a partition and only then add children to it by invoking **store**.
