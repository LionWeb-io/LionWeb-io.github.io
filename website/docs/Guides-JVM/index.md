---
title: Introduction to LionWeb JVM
sidebar_position: 1
---

# Welcome to LionWeb JVM

Once upon a time we had two separate libraries and two repositories supporting LionWeb JVM languages.
They were LionWeb Java and LionWeb Kotlin.

We have since refactor them into a single repository with modules dedicated to Java and modules dedicated to Kotlin.

The library now lives at [https://github.com/LionWeb-io/lionweb-jvm](https://github.com/LionWeb-io/lionweb-jvm).

As of 1.4.3, the repository also ships a **standalone server** module that bundles a Bulk HTTP API,
a Delta WebSocket API, and an optional web UI dashboard into a single shadow JAR. See the
[Server Guide](./server) for details.

If you are interested in using LionWeb with other JVM languages such as Scala, Groovy, Clojure, Frege, or others please let us know!