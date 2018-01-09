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
  graphqlUrl,
  jsonSchemaFormExtensions: {
    // widgets: {
    //   imageWidget: ImageWidget,
    // },
    // fields: {
    //   sortableField: SortableField,
    // },
  },
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
      name: 'user',
      uniqKey: '_id',
      crudMapping: {
        readMany: 'users',
        readOne: 'user',
      },
      readManySchema: {
        jsonSchema: {
          type: 'object',
          properties: {
            fullName: {
              type: 'string'
            },
            email: {
              type: 'number'
            },
          }
        }
      },
      defaultSchema: {
      },
    },
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
            sortIndex: {
              type: 'number'
            },
          }
        }
      },
      defaultSchema: {
        jsonSchema: {
          title: 'Life Event Category',
          type: 'object',
          required: [
            'title',
          ],
          properties: {
            title: {
              type: 'string'
            },
            sortIndex: {
              type: 'number',
              default: 1000,
            },
            lifeEventIds: {
              title: 'Sort Associated Life Events',
              type: 'array',
              default: [],
              items: {
                type: 'string'
              }
            }
          }
        },
        uiSchema: {
          lifeEventIds: {
            'ui:field': 'sortableField',
          }
        },
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
        // NOTE for now this is a hack since we can only render
        // one field for this object
        cellFormatter(value, object, fieldName) {
          if (fieldName === 'published') {
            return value ? 'Yes' : 'No'
          }
          if (value && typeof value === 'object') {
            return value.title
          }
          return value
        },
        jsonSchema: {
          type: 'object',
          properties: {
            title: {
              type: 'string'
            },
            lifeEventCategory: {
              type: 'object',
              properties: {
                title: {
                  type: 'string',
                }
              }
            },
            published: {
              type: 'boolean',
            }
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
            'imageId',
            'published',
            'lifeEventCategoryId',
            'dropIds'
          ],
          properties: {
            title: {
              type: 'string'
            },
            slug: {
              type: 'string',
              title: 'Url Slug',
            },
            published: {
              type: 'boolean',
              default: false
            },
            subTitle: {
              type: 'string'
            },
            imageId: {
              type: 'string'
            },
            durationDescription: {
              type: 'string'
            },
            sponsoredBy: {
              type: 'string'
            },
            lifeEventContentItems: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  itemTitle: {
                    type: 'string'
                  },
                  itemContent: {
                    type: 'string'
                  }
                }
              },
              default: [
              {
                'itemTitle': 'He or She Might Be Thinking About...',
              }, {
                'itemTitle': 'Words That Might Be Encouraging',
              }, {
                'itemTitle': 'Words That Might Be Discouraging',
              }],
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
          // imageId: {
          //   'ui:widget': 'imageWidget',
          // },
          lifeEventContentItems: {
            items: {
              itemContent: {
                'ui:widget': 'wysiwygWidget',
                'ui:options':  {
                  wysiwygConfig: {
                    toolbar: {
                      options: ['link', 'list', 'remove'],
                      link: {
                        showOpenOptionOnHover: false,
                      },
                      list: {
                        options: ['unordered'],
                      },
                    },
                    editorClassName: 'form-control',
                  },
                  blockType: 'unordered-list-item'
                }
              }
            },
          },
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
                'DROP_TYPE_AUDI',
                'DROP_TYPE_EXPE',
                'DROP_TYPE_GIFT',
                'DROP_TYPE_WORD',
              ],
              enumNames: [
                'audio / video',
                'experience',
                'gift',
                'word',
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
            tagIds: {
              type: 'array',
              items: {
                type: 'string',
              }
            },
          }
        },
        uiSchema: {
          tagIds: {
            'ui:field': 'hasManyField',
          }
        },
      },
    },
    {
      name: 'hallmarkHoliday',
      uniqKey: '_id',
      crudMapping: {
        readMany: 'hallmarkHolidays',
        readOne: 'hallmarkHoliday',
        create: 'createHallmarkHoliday',
        update: 'updateHallmarkHoliday',
        // delete: 'deleteHallmarkHoliday',
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
            'type',
          ],
          properties: {
            title: {
              type: 'string'
            },
            content: {
              type: 'string'
            },
            // type: {
            //   type: 'string',
            //   enum: Object.keys(HALLMARK_HOLIDAY_TYPE_MAP),
            //   enumNames: Object.values(HALLMARK_HOLIDAY_TYPE_MAP),
            // },
            // monthAndDay: {
            //   type: 'object',
            //   properties: {
            //     month: {
            //       type: 'number',
            //       enum: Object.keys(MONTHS_MAP).map(Number),
            //       enumNames: Object.values(MONTHS_MAP)
            //     },
            //     dayOfMonth: {
            //       type: 'number',
            //       enum: range(1, 32),
            //     }
            //   }
            // },
            // monthOccurrenceAndDayOfWeek: {
            //   type: 'object',
            //   properties: {
            //     month: {
            //       type: 'number',
            //       enum: Object.keys(MONTHS_MAP).map(Number),
            //       enumNames: Object.values(MONTHS_MAP)
            //     },
            //     occurrence: {
            //       title: '',
            //       type: 'number',
            //       enum: [
            //         0,1,2,3,4,5
            //       ],
            //       enumNames: [
            //         '1st',
            //         '2nd',
            //         '3rd',
            //         '4th',
            //         '5th',
            //         '6th',
            //       ]
            //     },
            //     // dayOfWeek: {
            //       // type: 'number',
            //       // enum: Object.keys(DAYS_OF_WEEK_MAP).map(Number),
            //       // enumNames: Object.values(DAYS_OF_WEEK_MAP),
            //     // },
            //   },
            // },
          },
        },
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
