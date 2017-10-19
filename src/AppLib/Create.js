import React from 'react'
import { gql, graphql } from 'react-apollo'
import { startCase } from 'lodash';
import Form from './Form';
import { upperFirst } from 'lodash';
import getCRUDSchemaFromResource from '../GqlCmsConfigLib/getCRUDSchemaFromResource'
import { toast } from 'react-toastify'
import alertFirstGqlMsg from '../alertFirstGqlMsg'

function Create (props) {
  const { resource, mutate, config, history } = props;
  const onSubmit = async ({ formData }) => {
    try {
      await mutate({ variables: { input: formData } })
      history.push(`/${resource.name}`)
      toast.success('Create Success')
    } catch (e) {
      alertFirstGqlMsg(e)
    }
  }
  const onCancel = () => {
    history.push(`/${resource.name}`)
  }
  const createSchema = getCRUDSchemaFromResource({
    config,
    resource,
    crudType: 'create'
  })
  return <div>
    <h1>Create {startCase(resource.name)}</h1>
    <Form
      jsonSchemaFormExtensions={config.jsonSchemaFormExtensions}
      schema={createSchema.jsonSchema}
      uiSchema={createSchema.uiSchema}
      noHtml5Validate
      onSubmit={onSubmit}
      onCancel={onCancel}
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
