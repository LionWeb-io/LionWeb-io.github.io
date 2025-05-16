---
title: Working with the LionWeb Repository
sidebar_position: 44
---

# Working with the LionWeb Repository

Working with the [LionWeb Repository](https://github.com/LionWeb-io/lionweb-repository) we can store and retrieve nodes. 
It is also a mean to exchange models with other LionWeb-compliant components. You can refer to the website of the 
LionWeb Repository to learn how to start it. 

This page provides an overview of how to interact with the repository using the provided Typescript client and outlines the 
basic concepts involved.

## Overview

The LionWeb Repository is a generic storage system designed to hold nodes conforming to the LionWeb metamodel.

It provides two sets of APIs:

* The Bulk APIs: intended to store and retrieve entire partitions or large sub-trees
* The Delta APIs: currently under development, it will support real-time collaboration

The LionWeb Repository can also optionally support versioning.

In this guide we will only focus on the Bulk APIs.

## Working with the Bulk APIs

It offers REST APIs for communication, which are wrapped in a convenient Typescript client: `RepoClient`. This client supports features like:

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

**CODE TO BE WRITTEN AFTER RELEASING THE CLIENT**

And this is how the result would look like in the [LionWeb Repo Admin UI](https://github.com/LionWeb-io/lionweb-repo-admin-ui):

![](/img/repo-admin-ui.png)

### Creating partitions

Something to keep in mind is that the LionWeb Repository will only let us create partitions without children. 
So, we may need to create a partition and only then add children to it by invoking **store**.
