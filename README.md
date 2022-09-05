postgraphile-plugin-aws-appsync-scalars
=======================================


This plugin for PostGraphile converts Postgraphile-generated custom scalar names to those AWS AppSync accepts.

Current name mappings:

| PostGraphile type | AWS type |
|-------------------|----------|
| JSON | AWSJSON |
| Datetime | AWSDateTime |
| Date | AWSDate |
| Cursor | String |


Limitations
-----------

No warning is issued if you failed to set dynamic-json to false. In that case,
the resulting schema will presented by AWS AppSync will not match what PostGrahile expects to receive.


Installation
------------

Install using NPM or Yarn.

NPM:

```bash
npm install --save @cloudcycle/postgraphile-plugin-aws-appsync-scalars
```

Yarn:
```bash
yarn add @cloudcycle/postgraphile-plugin-aws-appsync-scalars
```

Usage
-----

CLI:

```bash
postgraphile --dynamic-json false --append-plugins @cloudcycle/postgraphile-plugin-aws-appsync-scalars
```

Library:

```javascript
import awsAppsyncScalarsPlugin from '@cloudcycle/postgraphile-plugin-aws-appsync-scalars';
```

Then add it to the appendPlugins array. E.g.:

```javascript
app.use(
  postgraphile(process.env.AUTH_DATABASE_URL, "app_public", {
    appendPlugins: [awsAppsyncScalarsPlugin],
    dynamicJson: false,

    // Optional customisation
    graphileBuildOptions: {
      /*
       * Uncomment if you want simple collections to lose the 'List' suffix
       * (and connections to gain a 'Connection' suffix).
       */
      //pgOmitListSuffix: true,
      /*
       * Uncomment if you want 'userPatch' instead of 'patch' in update
       * mutations.
       */
      //pgSimplifyPatch: false,
      /*
       * Uncomment if you want 'allUsers' instead of 'users' at root level.
       */
      //pgSimplifyAllRows: false,
      /*
       * Uncomment if you want primary key queries and mutations to have
       * `ById` (or similar) suffix; and the `nodeId` queries/mutations
       * to lose their `ByNodeId` suffix.
       */
      // pgShortPk: true,
    },
    // ... other settings ...
  })
);
```

Roadmap
-------

* Add unit tests
* Allow user-specified types (e.g. SQL domains) to be converted.
* Allow AWS types for fields, arguments etc. to be specified via smart-comments, so
that we could make use of the extra checking AWS AppSync performs when using AWSEmail,
AWSPhone etc.
