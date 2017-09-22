# BYOB CMS
byob-cms is a react component for client only CMS
There are three basic concepts in byob-cms:
- config  
  "config" is an javascript object that contains all the info needed
  for byob-cms to build the cms.
  You should pass config into byob-cms component as a prop.

- resource

  "resource" is a RESTful concept.
  You can do CRUD on the records in resources.
  You can think of a resource as a class and a record as an instance,
  or a resource as a model and a record as a document.

- schema

  We use https://github.com/mozilla-services/react-jsonschema-form package
  to render forms in the cms. There for you can provide
  jsonSchema and uiSchema to define the structure of the form.
  We let you configure schemas for CRUD pages. "defaultSchema" is used
  when you do not provide a schema for that CRUD type.

## Usage
You can import this package as a component and give it a config prop.
```
import React from 'react';
import ReactDOM from 'react-dom';
import CMS from 'byob-cms'

ReactDOM.render(
  <CMS config={config}/>,
  document.getElementById('root')
);
```

## Config example
```
const config = {
  graphqlUrl: 'http://localhost:4000',
  resources: [
    {
      name: 'drop',
      uniqKey: '_id',
      crudMapping: {
        create: 'createDrop',
        readMany: 'drops',
        readOne: 'drop',
        update: 'updateDrop',
        // delete: 'deleteDrop',
      },
      readManySchema: {
        jsonSchema: {
          type: 'object',
          properties: {
            _id: 'string',
            title: 'string',
          }
        }
      },
      defaultSchema: {
        jsonSchema: {
          title: 'Drop',
          type: 'object',
          required: [
            'title',
            'content',
            'tagIds',
          ],
          properties: {
            title: {
              type: 'string',
            },
            content: {
              type: 'string',
            },
            lifeEventIds: {
              type: 'array',
              default: [],
              items: {
                type: 'string'
              }
            },
            tagIds: {
              type: 'array',
              default: [],
              items: {
                type: 'string'
              }
            }
          },
        },
        uiSchema: {
          lifeEventIds: {
            'ui:field': 'hasManyField'
          },
          tagIds: {
            'ui:field': 'hasManyField'
          },
        },
      }
    },
    {
      name: 'tag',
      uniqKey: '_id',
      crudMapping: {
        readMany: 'tags',
        readOne: 'tag',
        create: 'createTag',
        update: 'updateTag',
        delete: 'deleteTag',
      },
      readManySchema: {
        jsonSchema: {
          type: 'object',
          properties: {
            _id: 'string',
            title: 'string',
          }
        }
      },
      defaultSchema: {
        jsonSchema: {
          title: 'Tag',
          type: 'object',
          required: [
            'title',
            'tagQuestionId',
          ],
          properties: {
            title: {
              type: 'string'
            },
            tagQuestionId: {
              type: 'string',
            },
          }
        },
        uiSchema: {
          tagQuestionId: {
            'ui:widget': 'hasOneWidget',
          }
        },
      },
    },
    {
      name: 'tagQuestion',
      uniqKey: '_id',
      crudMapping: {
        readMany: 'tagQuestions',
        readOne: 'tagQuestion',
        create: 'createTagQuestion',
        update: 'updateTagQuestion',
        delete: 'deleteTagQuestion',
      },
      readManySchema: {
        jsonSchema: {
          type: 'object',
          properties: {
            _id: 'string',
            title: 'string',
          }
        }
      },
      defaultSchema: {
        jsonSchema: {
          title: 'Tag Question',
          type: 'object',
          required: [
            'title',
          ],
          properties: {
            title: {
              type: 'string'
            },
          }
        },
        uiSchema: { },
      },
    },
  ]
}

```

## config API reference
- graphqlUrl
  The backend graphql url used by byob-cms
- resources
- resources.[].name
  The name of the resource, need to be singular
- resources.[].uniqKey
  Unique key used in your records. Most of the time its 'id' or '\_id'.
- resources.[].crudMapping
  GraphQL mutation and query names for crud options
- resources.[].crudMapping.create
  ```
  mutation ${crudMapping.create}($input: ${upperFirst(resource.name + 'Input')}!) {
    ${crudMapping.create}(${resource.name} : $input)
  }
  ```
- resources.[].crudMapping.update
  ```
  mutation ${crudMapping.update}($input: ${upperFirst(resource.name + 'Input')}!) {
    ${crudMapping.update}(${resource.name} : $input, ${uniqKey}: "${uniqKeyValue}")
  }
  ```
- resources.[].crudMapping.delete
  ```
  mutation ${crudMapping.delete}($${uniqKey}: String!) {
    ${crudMapping.delete}(${uniqKey}: $${uniqKey})
  }
  ```
- resources.[].crudMapping.readOne
  ```
  query ${crudMapping.readOne}($${uniqKey}: String!) {
    ${crudMapping.readOne}(${uniqKey}: $${uniqKey}) ${jsonSchemaToGqlQuery(readOneSchema.jsonSchema)}
  }
  ```
- resources.[].crudMapping.readMany
  ```
  query ${crudMapping.readMany} {
    ${crudMapping.readMany} ${jsonSchemaToGqlQuery(readManySchema.jsonSchema)}
  }
  ```
- createSchema
- createSchema.jsonSchema
- createSchema.uiSchema
- updateSchema
- updateSchema.jsonSchema
- updateSchema.uiSchema
- readOneSchema
- readOneSchema.jsonSchema
- readOneSchema.uiSchema
- readManySchema
- readManySchema.jsonSchema
- readManySchema.uiSchema
- defaultSchema
- defaultSchema.jsonSchema
- defaultSchema.uiSchema
- jsonSchemaFormExtensions
  You can extend json schema form by providing this object
- jsonSchemaFormExtensions.widgets
  https://github.com/mozilla-services/react-jsonschema-form#custom-component-registration
- jsonSchemaFormExtensions.fields
  https://github.com/mozilla-services/react-jsonschema-form#custom-field-components

## pre-defined jsonSchema widgets
- hasOneWidget
  ```
  // by default gqlOptionsName is `${fieldName}Options`
  query ${upperFirst(gqlOptionsName)}Query {
    ${gqlOptionsName} {
      value
      label
    }
  }
  ```
  props:
  - ui:options
  - ui:options.gqlOptionsName
- hasManyField
  Same as hasOneWidget, but for array of values
