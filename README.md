postgraphile-plugin-aws-appsync-scalars
=======================================


This plugin for PostGraphile converts Postgraphile-generated custom scalar names to those AWS AppSync accepts.

Current name mappings:

| PostGraphile type | AWS type |
|-------------------|----------|
| JSON | AWSJSON |
| Datetime | AWSDateTime |
| Date | AWSDate |
| BigInt | Int |
| BigFloat | Float |
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
    appendPlugins: [
      awsAppsyncScalarsPlugin,
      // Any other plugins that reference types explicitly
      // should go here.
    ],

    // Ensure JSON fields are returned serialised to strings, as this is
    // what the AWSJSON type expects.
    dynamicJson: false,

    // Optional customisation
    graphileBuildOptions: {
    },
    // ... other settings ...
  })
);
```

Interoperability
----------------

The order in which this plugin is specified could affect the resulting
schema, and you may achieve more predictable results by listing this plugin first. When another plugin makes explicit references to
types, this plugin needs to be listed in _append_plugins_ before it. In particular, this is the case with [the @graphile/pg-aggregates plugin](https://www.npmjs.com/package/@graphile/pg-aggregates).

Roadmap
-------

* Add unit tests
* Support scalar types from the PostGIS plugin, notably GeoJSON.
* Allow the mapping of PosgreSQL types to AppSync compatible types to be
  customised.
* Allow user-specified types (e.g. SQL domains) to be converted.
* Allow AWS types for fields, arguments etc. to be specified via smart-comments, so
that we could make use of the extra checking AWS AppSync performs when using AWSEmail,
AWSPhone etc.
