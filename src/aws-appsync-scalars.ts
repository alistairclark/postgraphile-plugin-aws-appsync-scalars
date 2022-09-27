import {
    makeAddInflectorsPlugin,
    makePluginByCombiningPlugins
} from 'graphile-utils';
import {
    Plugin,
    SchemaBuilder
} from 'postgraphile';


const AwsCustomScalarNamesPlugin = makeAddInflectorsPlugin(
    ({ builtin: oldBuiltin }) => {
        return {
            builtin(text: any) {
                const awsTypeMappings = {
                    'JSON': 'AWSJSON',
                    'Datetime': 'AWSDateTime',
                    'Date': 'AWSDate'
                } as {[key: string]: string};
                return awsTypeMappings?.[text] ?? oldBuiltin.call(this, text);
            }
        };
    },
    true
);

const cursorPlugin: Plugin = (builder: SchemaBuilder) => {
    builder.hook('build', (_, build, __) => {
        const { getTypeByName: oldGetTypeByName, graphql } = build;
        build.getTypeByName = (name: string) => {
            if (name === "Cursor") {
                return graphql.GraphQLString
            }
            return oldGetTypeByName.call(this, name);
        };
        return build;
    });
};

export const awsAppsyncScalarsPlugin = makePluginByCombiningPlugins(
    AwsCustomScalarNamesPlugin,
    cursorPlugin
);
