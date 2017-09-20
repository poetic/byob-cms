import React from 'react'
import { gql, graphql } from 'react-apollo'
import Form from './Form';
import jsonSchemaToGqlQuery from '../GqlCmsConfigLib/jsonSchemaToGqlQuery'
import getCRUDSchemaFromResource from '../GqlCmsConfigLib/getCRUDSchemaFromResource'
import removeTypename from '../removeTypename'

class ReadOne extends React.Component {
  componentDidMount() {
    const { loading, refetch } = this.props.data
    if (!loading) {
      refetch()
    }
  }
  render() {
    const { resource, data } = this.props;
    const purifiedFormData = removeTypename(data[resource.crudMapping.readOne])
    if (data.loading) {
      return null;
    }
    const readOneSchema = getCRUDSchemaFromResource({
      resource,
      crudType: 'readOne'
    })
    const uiSchema = {
      'ui:disabled': true,
      ...readOneSchema.uiSchema
    }
    return <div>
      <Form
        schema={readOneSchema.jsonSchema}
        uiSchema={uiSchema}
        formData={purifiedFormData}
        noHtml5Validate
        onSubmit={() => {}}
      >
        <button type="submit" style={{ display: 'none' }}>Submit</button>
      </Form>
    </div>
  }
}

function ReadOneWithData (props) {
  const { resource } = props;
  const { crudMapping, uniqKey } = resource;
  const readOneSchema = getCRUDSchemaFromResource({
    resource,
    crudType: 'readOne'
  })

  let Component = ReadOne
  const fieldsQuery = jsonSchemaToGqlQuery(readOneSchema.jsonSchema)
  const ReadOneQuery = gql`
  query ${crudMapping.readOne}($${uniqKey}: String!) {
    ${crudMapping.readOne}(${uniqKey}: $${uniqKey}) ${fieldsQuery}
  }
  `
  const uniqKeyValue = props.match.params[uniqKey]
  Component = graphql(
    ReadOneQuery,
    { options: { variables: { [uniqKey]: uniqKeyValue } } }
  )(Component)

  return <Component {...props} />
}

export default ReadOneWithData
