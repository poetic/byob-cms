import { upperFirst, startCase } from 'lodash';
import React from 'react'
import { gql, graphql } from 'react-apollo'
import { toast } from 'react-toastify'
import Form from './Form';
import getCRUDSchemaFromResource from '../GqlCmsConfigLib/getCRUDSchemaFromResource'
import alertFirstGqlMsg from '../alertFirstGqlMsg'
import undefinedToNull from '../formLib/undefinedToNull'

function Create (props) {
  const { resource, mutate, config, history } = props

  const resourceName = resource.displayName || resource.name

  const onSubmit = async ({ formData }) => {
    const input = undefinedToNull(formData)
    try {
      await mutate({ variables: { input } })
      history.push(`/${resourceName}`)
      toast.success('Create Success')
    } catch (e) {
      alertFirstGqlMsg(e)
    }
  }
  const onCancel = () => {
    history.push(`/${resourceName}`)
  }
  const createSchema = getCRUDSchemaFromResource({
    config,
    resource,
    crudType: 'create'
  })
  return <div>
    <h1>Create {startCase(resourceName)}</h1>
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
