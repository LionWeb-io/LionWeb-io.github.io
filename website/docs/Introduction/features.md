# LionWeb Implementations

| **Feature**                                         | **LW C#** | **LW Java** | **LW Kotlin** | **LW TypeScript** | **LW Python** |
|-----------------------------------------------------|:---------:|:-----------:|:-------------:|:-----------------:|:-------------:|
| M1 (model) de/serializer from/to LW JSON            |     ✅     |      ✅      |       ✅       |         ✅         |       ✅       |
| M2 (language) de/serializer from/to LW JSON         |     ✅     |      ✅      |       ✅       |         ✅         |       ✅       |
| Language agnostic (Reflective) API to CRUD LW nodes |     ✅     |      ✅      |       ✅       |         ✅         |       ✅       |
| Language specific API to CRUD LW nodes              |     ✅     |      ✅      |       ✅       |         ✅         |       ✅       |
| Bulk protocol Client                                |     ❓     |      ✅      |       ✅       |         ✅         |       ✅       |
| Delta protocol Client                               |     ➖     |      🏗️      |       ➖       |         ➖         |       ➖       |


# LionWeb Integrations

| **Feature**                  | **MPS** | **EMF** |   **Freon**   | **Rascal** | **Modelix** | **LW Repository** |
|------------------------------|:-------:|:-------:|:-------------:|:----------:|:-----------:|:-----------------:|
| Depends on LW implementation | LW Java | LW Java | LW TypeScript |   LW Java  |      ❓      |   LW TypeScript   |
| Export to LW M1 (model)      |    ✅    |    ✅    |       ✅       |      ✅     |      ✅      |         ➖         |
| Export to LW M2 (language)   |    ✅    |    ✅    |       ✅       |      ❓     |      ❓      |         ➖         |
| Import from LW M1 (model)    |    ✅    |    ✅    |       ✅       |      ✅     |      ✅      |         ➖         |
| Import from LW M2 (language) |    ❓    |    ✅    |       ✅       |      ✅     |      ❓      |         ➖         |
| Bulk protocol Server         |    ❓    |    ➖    |       ➖       |      ➖     |      ✅      |         ✅         |
| Bulk protocol Client         |    ➖    |    ➖    |       ❓       |      ➖     |      ➖      |         ➖         |
| Delta protocol Server        |    ➖    |    ➖    |       ➖       |      ➖     |      ➖      |         🏗️         |
| Delta protocol Client        |    ➖    |    ➖    |       ➖       |      ➖     |      ➖      |         ➖         |
