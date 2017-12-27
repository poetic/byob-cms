import React from 'react';
import ReactDOM from 'react-dom';
import './stylesheets/react-selectize.css';
import './stylesheets/react-jsonschemaform.css';
import './stylesheets/bootstrap-override.css';
import './stylesheets/react-toastify.css';
import Cms, { EmailPasswordLogin, StateHOF } from './App';
import { connect } from 'react-redux';
import jwtDecode from 'jwt-decode';
import { ToastContainer } from 'react-toastify'

const graphqlUrl = 'http://localhost:4000/admin-graphql'

const AdminGqlCmsConfig = {
  brand: 'Encouragement CMS',
  title: 'Encouragement CMS',
  Login: EmailPasswordLogin,
  graphqlUrl,
  readManySchema: {
    cellFormatter(value, object, fieldName) {
      if (value && typeof value === 'object') {
        return <pre>{JSON.stringify(value)}</pre>
      }
      return value
    },
    sortStrategy: {
      type: 'SINGLE',
      defaultSortField: 'title',
    },
    searchStrategy: {
      type: 'FULLTEXT'
    },
    paginationStrategy: {
      type: 'STATIC',
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
      readManySchema: {
        jsonSchema: {
          type: 'object',
          properties: {
            title: {
              type: 'string'
            },
          }
        }
      },
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
      readManySchema: {
        jsonSchema: {
          type: 'object',
          properties: {
            title: {
              type: 'string'
            },
          }
        }
      },
      defaultSchema: {
        jsonSchema: {
          title: 'Life Event',
          type: 'object',
          required: [
            'title',
            'subTitle',
            'imageUrl',
            'durationDescription',
            'notToSays',
            'toSays',
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
            durationDescription: {
              type: 'string'
            },
            notToSays: {
              title: 'Things not to say',
              type: 'array',
              default: [],
              items: {
                type: 'string'
              }
            },
            toSays: {
              title: 'What to say instead',
              type: 'array',
              default: [],
              items: {
                type: 'string'
              }
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
      readManySchema: {
        jsonSchema: {
          type: 'object',
          properties: {
            title: {
              type: 'string'
            },
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
            'ui:field': 'hasManyField'
          },
          tagIds: {
            'ui:field': 'hasManyField'
          },
        },
      }
    },
    {
      name: 'customDrop',
      uniqKey: '_id',
      crudMapping: {
        // create: 'createDrop',
        readMany: 'customDrops',
        readOne: 'customDrop',
        // update: 'updateDrop',
        // delete: 'deleteDrop',
      },
      readOneSchema: {
        show: true
      },
      readManySchema: {
        jsonSchema: {
          type: 'object',
          properties: {
            title: {
              type: 'string'
            },
            content: {
              type: 'string',
            },
          }
        }
      },
      defaultSchema: {
        jsonSchema: {
          title: 'Custom Drop',
          type: 'object',
          required: [
            'title',
            'content',
          ],
          properties: {
            title: {
              type: 'string',
            },
            content: {
              type: 'string',
            },
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
      readManySchema: {
        jsonSchema: {
          type: 'object',
          properties: {
            title: {
              type: 'string'
            },
          }
        }
      },
      defaultSchema: {
        jsonSchema: {
          title: 'Tag',
          type: 'object',
          required: [
            'title',
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
      readManySchema: {
        jsonSchema: {
          type: 'object',
          properties: {
            title: {
              type: 'string'
            },
          }
        }
      },
      defaultSchema: {
        jsonSchema: {
          title: 'Tag Question',
          type: 'object',
          required: [
            'title',
            'question',
          ],
          properties: {
            title: {
              type: 'string'
            },
            question: {
              type: 'string'
            },
          }
        },
        uiSchema: { },
      },
    },
  ]
}

const ContentEditorGqlCmsConfig = {
  brand: 'Encouragement CMS',
  title: 'Encouragement CMS',
  Login: EmailPasswordLogin,
  initialPath: 'lifeEvent',
  graphqlUrl,
  readManySchema: {
    cellFormatter(value, object, fieldName) {
      if (value && typeof value === 'object') {
        return <pre>{JSON.stringify(value)}</pre>
      }
      return value
    },
    sortStrategy: {
      type: 'SINGLE',
      defaultSortField: 'title',
    },
    searchStrategy: {
      type: 'FULLTEXT'
    },
    paginationStrategy: {
      type: 'STATIC',
    },
  },
  resources: [
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
      readManySchema: {
        jsonSchema: {
          type: 'object',
          properties: {
            title: {
              type: 'string'
            },
          }
        }
      },
      defaultSchema: {
        jsonSchema: {
          title: 'Life Event',
          type: 'object',
          required: [
            'title',
            'subTitle',
            'imageUrl',
            'durationDescription',
            'notToSays',
            'toSays',
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
            durationDescription: {
              type: 'string'
            },
            notToSays: {
              title: 'Things not to say',
              type: 'array',
              default: [],
              items: {
                type: 'string'
              }
            },
            toSays: {
              title: 'What to say instead',
              type: 'array',
              default: [],
              items: {
                type: 'string'
              }
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
  ]
}

function RoleRouter (props) {
  const { accessToken } = props
  if (!accessToken) {
    return <div>
      <ToastContainer
        position="top-center"
        type="default"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
      />
      <EmailPasswordLogin/>
    </div>
  }
  const { role } = jwtDecode(accessToken)
  switch (role) {
    case 'ADMIN':
      return <Cms config={AdminGqlCmsConfig}/>
    case 'CONTENT_EDITOR':
      return <Cms config={ContentEditorGqlCmsConfig}/>
    default:
      return null
  }
}

const RoleRouterWithState = StateHOF(connect(
  (state) => ({ accessToken: state.accessToken }),
  {}
)(RoleRouter))

ReactDOM.render(<RoleRouterWithState config={AdminGqlCmsConfig}/>, document.getElementById('root'));
