---
title: Configuration
sidebar_position: 3
---

# Configuration

The file `server-config.json` is used to configure the server:
It should be in the same folder where the server is started, if it does not exist, default values will be used.

It is possible to specify a different path for the configuration file.
For example:
```
npm run dev ../../../lwrepo-conf/server-config.json
```

Below is the server-config.json with all default values

````json5
{
  "server": {
    // The port where the server can be reached
    "serverPort": 3005,
    // Token to use for minimal security
    "expectedToken": null,
    // maximum body size
    "bodyLimit": '50mb'

  },
  "startup": {
    // Whether to create a new database at startup.
    // Note that the new database will overwrite any existing database  
    // Values are "always" | "never" | "if-not-exists"
    "createDatabase": "always",
    // The list of repositories to be created at startup, can be empty
    "createRepositories": [
      {
        // Repository name
        "name": "default",
        //
        // Values are "always" | "never" | "if-not-exists"
        "create": "if-not-exists",
        // Whether the repository should keep the history
        "history": false,
        // Values can be: "2023.1" | "2024.1"
        "lionWebVersion": "2024.1"
      }
    ]
  },
  "logging": {
    // Logging level for reuests logging
    "request": "info",
    // Logging level for detailed tracing
    "trace": "silent",
    // Logging level for database actions
    "database": "silent",
    // logging level for (automatic) request/response logging
    "express": "silent"
  },
  "postgres": {
    // Postgress configuration
    "database": {
      // The address at which the Postgres server can be reached
      "host": "postgres",
      // The username used to connect to the Postgres server
      "user": "postgres",
      // The name of the admin database
      "maintenanceDb": "postgres" ,
      // The name of the Postgres database to be used within the Postgres server.
      "db": "lionweb",
      // The password used to connect to the Postgres server
      "password": "lionweb",
      // The port at which the Postgres server can be reached
      "port": 5432
    },
    // NOTE that you can have at most one of rootcert and rootcertcontent
    "certificates": {
      // If present, the root certificate is used to verify SSL connections. 
      // It should indicate a file. It should not be used with `rootcertcontent`
      "rootcert": null,
      // If present, the root certificate is used to verify SSL connections.
      // It should indicate the content of the file certificate. It should not be used with `rootcert`.
      "rootcertcontent": null
    }
  }
}
````

## Server configuration

* **server.serverPort** (default `3005`): Port at which the lionweb server can be reached
* **server.bodyLimit** (default `50mb`): Maximum size of the body requests accepted by the lionweb server
* **server.expectedToken** (default to _no token_): When a token is specified, it should be provided in all calls. 
  Otherwise, they would be rejected.

## Startup configuration

In this section we specify what operations to do when running the server in setup mode or in combined setup and run mode.
In other words, this has an effect only if the flag `--setup` is specified when starting the server.

* **startup.createDatabase** (default `"always"`): Controls whether a new database should be created at startup.  
  Accepted values:
  - `"always"`: Always create a new database, overwriting any existing one.
  - `"never"`: Never create a new database.
  - `"if-not-exists"`: Create the database only if it does not already exist.

Note that if the database exists, but it does not contain the right tables the server will fail to run.

* **startup.createRepositories**: A list of repositories to be created when the server starts (can be empty).  
  Each entry may include:
  - **name**: The name of the repository.
  - **create** (default `"if-not-exists"`): Determines whether the repository should be created.  
    Accepted values:
    - `"always"`: Always create the repository.
    - `"never"`: Do not create the repository.
    - `"if-not-exists"`: Create it only if it doesn't exist.
  - **history** (default `false`): Whether to enable history tracking for the repository.
  - **lionWebVersion** (default `"2024.1"`): Specifies the LionWeb version the repository should use.  
    Accepted values: `"2023.1"` or `"2024.1"`.


## Database configuration

* **postgres.database.db** (default `lionweb`): The name of the application-specific Postgres database.
* **postgres.database.host** (default `postgres`): Hostname or IP address of the Postgres server.
* **postgres.database.user** (default `postgres`): Username for connecting to the database.
* **postgres.database.password** (default `lionweb`): Password for authenticating the database user.
* **postgres.database.port** (default `5432`): Port on which the Postgres server is listening.
* **postgres.database.maintenanceDb** (default `postgres`): Name of the Postgres admin (maintenance) database.

* **postgres.certificates.rootcert** (default `null`): Path to an SSL root certificate file (mutually exclusive with `rootcertcontent`).
* **postgres.certificates.rootcertcontent** (default `null`): Contents of an SSL root certificate, embedded directly (mutually exclusive with `rootcert`).

## Logging configuration

* **logging.database** (default `silent`): Print queries and other information related to the DB
* **logging.request** (default `info`): Print logs about the requests received
* **logging.trace** (default `silent`): Detailed internal logs for debugging purposes. Use with caution in production.
* **logging.express** (default `silent`): Automatically logs HTTP request and response details. Useful for development or auditing.
