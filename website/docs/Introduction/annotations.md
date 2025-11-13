---
title: Annotations
sidebar_position: 34
---

# Annotations

Annotations provide a generic mechanism for extending languages without modifying them. They are useful for:

- cross-cutting concerns that apply across many languages or many kinds of nodes.
- extending a language we do not own

An annotation definition can be reused with instances of different languages, even if the original language designer never anticipated that extension. This is a key aspect that provides extensibility.

## Generic and Reusable Extensions
A common example for using annotation is adding comments. You can define a comment annotation once and apply it to any node of any language. Tools that understand this annotation can use it; tools that don’t need it are free to ignore it. This enables optional, non-intrusive extensions. 

This example shows also how annotations are sort of metadata: they are relevant to some users and can be ignored by others. Let's imagine a node with a comment:

- A process generating documentation for a partition may benefit from the comment.
- At the same time a process executing the partition may ignore the annotation containing the comment, as it is irrelevant for it

Annotations may also be constrained. For instance, you could define a “synonym” annotation that applies only to nodes that provide a name (i.e., implementing the interface `INamed`, part of _LionCore Builtins_). The annotation system supports this level of restriction.

Of course we may also have annotations restricted to specific concepts. Let's imagine we are using a valuable language provided by someone else. We may want to add an extra field to a a certain concept, however we may not control the language and we may not change freely if other tools we use rely on the language being defined in a certain way. We can still add an annotation that, let's say, can be applied to instances of the concept `Car` and could specify a `Color` field. We may then have an editor that is aware of such annotation and can display the node using the color specified in the annotation.

## How Annotations Relate to Nodes
Annotations behave much like ordinary nodes:
- both are classifier instances,
- both carry structured data.

The difference is in their attachment:
- regular nodes participate in containment trees,
- annotations are not children of the nodes they describe,
- instead, they act as metadata associated with nodes.

This avoids mixing cross-cutting information with the primary structure of the model.

Note also that annotations can be attached to nodes but not to other annotations.

Annotations may contain nodes.
