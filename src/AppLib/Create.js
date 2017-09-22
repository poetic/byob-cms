import React from 'react'
import { gql, graphql } from 'react-apollo'
import Form from './Form';
import { upperFirst } from 'lodash';
import getCRUDSchemaFromResource from '../GqlCmsConfigLib/getCRUDSchemaFromResource'

function Create (props) {
  const { resource, mutate, config } = props;
  const onSubmit = async ({ formData }) => {
    try {
      await mutate({ variables: { input: formData } })
      window.alert('Create Success')
    } catch (e) {
      window.alert(e)
    }
  }
  const createSchema = getCRUDSchemaFromResource({
    resource,
    crudType: 'create'
  })
  return <div>
    <h1>create {resource.name}</h1>
    <Form
      jsonSchemaFormExtensions={config.jsonSchemaFormExtensions}
      schema={createSchema.jsonSchema}
      uiSchema={createSchema.uiSchema}
      noHtml5Validate
      onSubmit={onSubmit}
    />
  </div>
}

function CreateWithData (props) {
  const { resource } = props;
  const { crudMapping } = resource;
  let Component = Create
  const CreateQuery = gql`
  mutation ${crudMapping.create}($input: ${upperFirst(resource.name + 'Input')}!) {
    ${crudMapping.create}(${resource.name} : $input)
  }
  `;
  Component = graphql(CreateQuery)(Component)

  return <Component {...props} />
}

export default CreateWithData
