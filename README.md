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
- brand  
  The text on the left of the navbar
- graphqlUrl  
  The backend graphql url used by byob-cms
- resources
- resources.[].name  
  The name of the resource (needs to be singular). Used for GraphQL arguments and input types
- resources.[].displayName  
  The display name of the resource (should be singular). Used for titles and routes. If missing, defaults to resources.[].name
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
- readManySchema.cellFormatter  
  cellFormatter is a function used to format each td in the table  
  function signature: (value, object, fieldName) -> ReactElement  
  default value:
  ```
  function defaultCellFormatter (value) {
    return <pre>
      {JSON.stringify(value, null, 2)}
    </pre>
  }
  ```
- defaultSchema
- defaultSchema.jsonSchema
- defaultSchema.uiSchema
- jsonSchemaFormExtensions  
  You can extend json schema form by providing this object
- jsonSchemaFormExtensions.widgets  
  https://github.com/mozilla-services/react-jsonschema-form#custom-component-registration
- jsonSchemaFormExtensions.fields  
  https://github.com/mozilla-services/react-jsonschema-form#custom-field-components
- Login
  You can define your own custom Login component, setAccessToken function is
  passed in as a prop. After you call it, the following graphql requests will
  contain this value in the header as "authorization".  
  You can also use built in components like this:
  ```
  import { CodeLogin } from 'byob-cms';
  ```

## pre-defined jsonSchema widgets and fields
- numberWidget, currencyWidget (both use [react-number-format](https://github.com/s-yadav/react-number-format))
    - Formats/filters text input and evaluates field as number value
    - Passing/overriding props:
      ```
      'ui:options': {
        props: {
          decimalScale: 0, // Blocks floats
          allowNegative: false,
        },
      },
      ```
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
- wysiwygWidget  
    Wysiwyg Widget use [React Draft Wysiwyg](https://github.com/jpuri/react-draft-wysiwyg).  
    props:
    - ui:options
      - wysiwygConfig: An array of props passing directly to Editor Component. You can find the full list of props here https://github.com/jpuri/react-draft-wysiwyg/blob/master/src/config/defaultToolbar.js
      - blockType: This is a special prop that does not use directly in the Editor component. Use this if you want to start your wysiwyg with a specific container. For example, specify `blockType: 'unordered-list-item'` will begin your wysiwyg with an unordered list element.
- hasManyField  
    Same as hasOneWidget, but for array of values
