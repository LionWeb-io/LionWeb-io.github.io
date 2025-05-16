---
id: about-lionweb
title: About LionWeb
sidebar_position: 1
---

# LionWeb

**LionWeb** stands for **L**anguage **I**nterfaces **on** the **Web**.

## Mission

<strong>To create an ecosystem of interoperable components for building
language-oriented modeling tools on the web.</strong>

We believe that a lively ecosystem will facilitate the adoption of
language engineering and modeling solutions by reducing vendor lock-in.
Development of advanced solutions will be accelerated by mixing and
matching components, potentially sourced from different vendors or open
source initiatives. It will also foster innovation, as incremental
improvements can be defined on top of the existing libraries and
components.

## Reference Architecture

![Reference Architecture Diagram](https://github.com/LionWeb-io/.github/raw/main/profile/ref-arch.png)

A **model** is a graph structure with nodes and edges and one primary containment hierarchy [B]. Nodes are typed by a reference to a concept (a node in the metamodel of the language) and edges are named and typed (with a primitive type or a concept). Nodes also have properties which have names and primitive types. Nodes are identified by unique IDs. A LionWeb language -- or its metamodel -- is an instance of the LionWeb meta-metamodel.

A **repository** [A] stores models and provides clients [C,D,E,F,G] access to the nodes in a model. Conceptually, it is the center of a LionWeb system, with clients connected to it in a star topology (although the technical architecture may be different).

**Original models** are models that cannot be (re-)computed from other models. They are CRUDed by users (mediated by tools). Typically, they are what we'd call (a collection of) ASTs. They have to be persisted in the repository because they cannot be recomputed. **Derived models** are calculated from other (original or derived) models without direct human interaction. They are usually some form of analysis result, such as one related to a type system. Nodes in derived models are typically associated with an original node -- e.g., the type computed for an AST node. The repository manages this association. Derived models may be persisted or be recalculated on the fly.

A **client** is any program that works with models and nodes in the repository. We identify two kinds of clients, although there might be more: editors [F,G] and processors [C,D,E]. An **editor** CRUDs original models based on its direct interactions with users. A **processor** is a client that CRUDs models without direct user interaction. Processors can CRUD original models (e.g., importers [D] or generators [E]) or derived models [C] (e.g., compute type systems, desugar models, or interpret models).

One important design guideline for LionWeb is that we treat original and derived models similarly in terms of how they are transported to and from clients and/or how they are updated.

Clients can communicate with the repository in two ways: bulk and delta. **Bulk** communication means that a client requests a set of nodes from the repository, processes those in isolation (e.g., import or otherwise create new nodes, modifies existing nodes, or generates output) and then writes the changed set of nodes. **Delta** communication means that, after receiving an initial snapshot similar to the bulk case, the client continues to receive changes (aka deltas) from the repo; it also writes back changes continuously. Delta communication is also the basis for multi-client realtime collaboration.

## Working documents

- [Roadmap](roadmap/roadmap.adoc)
- [Reference Architecture](reference-architecture/reference-architecture.adoc)
- [Use Cases](documentation/use-cases.adoc)
- [Meta-Metamodel (M3)](metametamodel/metametamodel.adoc)
- [Serialization Format](serialization/serialization.adoc)
- [Bulk Repository Access API](bulk/repo-access-api.adoc)

## Versions of the LionWeb Specifications

- [2023.1](2023.1/index.adoc)
- [2024.1](2024.1/index.adoc)

## Legal

All our specifications and code is released as open source under the [Apache 2.0](https://www.apache.org/licenses/LICENSE-2.0). It explicitly allows commercial use. LionWeb is currently not its own legal entity, it's just a voluntary collaboration of people.




