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
                    'Time': 'AWSTime',
                    'Date': 'AWSDate',
                    'UUID': 'String'
                } as { [key: string]: string };
                return awsTypeMappings?.[text] ?? oldBuiltin.call(this, text);
            }
        };
    },
    true
);

const typeReplacementPlugin: Plugin = (builder: SchemaBuilder) => {
    builder.hook('build', (_, build, __) => {
        const {
            getTypeByName: oldGetTypeByName,
            graphql,
            pgRegisterGqlTypeByTypeId
        } = build;

        const dbTypeMappings = {
            BigInt: graphql.GraphQLInt,
            BigFloat: graphql.GraphQLFloat
        };

        const dbTypeOids = {
            // BigInt (8 bytes):
            BigInt: 20,
            // Numeric / Decimal
            BigFloat: 1700
        };

        Object.entries(dbTypeMappings).forEach(
            ([typeName, scalarType]) => {
                const oid = dbTypeOids[typeName as keyof typeof dbTypeOids];
                pgRegisterGqlTypeByTypeId(
                    `${oid}`,
                    () => { return scalarType; }
                );
            }
        );

        build.getTypeByName = (name: string) => {
            const nameMapping = {
                Cursor: graphql.GraphQLString,
                ...dbTypeMappings
            };
            return nameMapping[name as keyof typeof nameMapping] ?? oldGetTypeByName.call(this, name);
        };
        return build;
    });
};

export const awsAppsyncScalarsPlugin = makePluginByCombiningPlugins(
    AwsCustomScalarNamesPlugin,
    typeReplacementPlugin
);
