import React from 'react';
import ReactDOM from 'react-dom';
import './stylesheets/react-selectize.css';
import './stylesheets/react-jsonschemaform.css';
import App, { CodeLogin } from './App';

const config = {
  graphqlUrl: 'http://localhost:4000/admin-graphql',
  Login: CodeLogin,
  jsonSchemaFormExtensions: {
    // widgets: {
    //   testWidget: () => null
    // }
  },
  readManySchema: {
    // NOTE: this returns a string or react component
    cellFormatter(value, object, fieldName) {
      return JSON.stringify(value)
    },
    paginationStrategy: {
      type: 'STATIC',
      itemsPerPage: 2,
    },
  },
  resources: [
    {
      // NOTE: name is singular
      name: 'lifeEventCategory',
      uniqKey: '_id',
      crudMapping: {
        create: 'createLifeEventCategory',
        readMany: 'lifeEventCategories',
        readOne: 'lifeEventCategory',
        update: 'updateLifeEventCategory',
        // delete: 'deleteLifeEventCategory',
      },
      // readManySchema: {
      //   jsonSchema: {
      //     type: 'object',
      //     properties: {
      //       _id: {
      //         type: 'string'
      //       },
      //       title: {
      //         type: 'string'
      //       },
      //     }
      //   }
      // },
      defaultSchema: {
        jsonSchema: {
          title: 'Life Event',
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
    {
      // NOTE: name is singular
      name: 'lifeEvent',
      uniqKey: '_id',
      crudMapping: {
        create: 'createLifeEvent',
        readMany: 'lifeEvents',
        readOne: 'lifeEvent',
        update: 'updateLifeEvent',
        // delete: 'deleteLifeEvent',
      },
      defaultSchema: {
        jsonSchema: {
          title: 'Life Event',
          type: 'object',
          required: [
            'title',
            'subTitle',
            'imageUrl',
            'phases',
            'toSays',
            'notToSays',
            'durationInDays',
            'lifeEventCategoryId',
            'dropIds'
          ],
          properties: {
            title: {
              type: 'string'
            },
            subTitle: {
              type: 'string'
            },
            imageUrl: {
              type: 'string'
            },
            phases: {
              type: 'array',
              default: [],
              items: {
                type: 'object',
                properties: {
                  title: {
                    type: 'string'
                  },
                  items: {
                    type: 'array',
                    default: [],
                    items: {
                      type: 'string'
                    }
                  }
                }
              }
            },
            toSays: {
              type: 'array',
              default: [],
              items: {
                type: 'string'
              }
            },
            notToSays: {
              type: 'array',
              default: [],
              items: {
                type: 'string'
              }
            },
            durationInDays: {
              type: 'integer',
            },
            lifeEventCategoryId: {
              type: 'string',
            },
            dropIds: {
              type: 'array',
              default: [],
              items: {
                type: 'string'
              }
            },
          }
        },
        uiSchema: {
          lifeEventCategoryId: {
            'ui:widget': 'hasOneWidget',
          },
          dropIds: {
            'ui:field': 'hasManyField'
          }
        },
      },
    },
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
      defaultSchema: {
        jsonSchema: {
          title: 'Drop',
          type: 'object',
          required: [
            'title',
            'content',
            'type',
            'lifeEventIds',
            'tagIds',
          ],
          properties: {
            title: {
              type: 'string',
            },
            content: {
              type: 'string',
            },
            type: {
              type: 'string',
              enum: [
                'DROP_TYPE_WORD',
                'DROP_TYPE_GIFT',
                'DROP_TYPE_EXPE',
                'DROP_TYPE_AUDI',
              ],
              enumNames: [
                'word',
                'gift',
                'experience',
                'audio / video',
              ],
            },
            url: {
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
            'ui:field': 'lifeEventIdsField'
          },
          tagIds: {
            'ui:field': 'tagIdsField'
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
        // delete: 'deleteTag',
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
        // delete: 'deleteTagQuestion',
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

ReactDOM.render(
  <App config={config}/>,
  document.getElementById('root')
);
