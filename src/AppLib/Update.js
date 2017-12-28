import React from 'react'
import { gql, graphql } from 'react-apollo'
import { startCase, upperFirst } from 'lodash';
import graphqlWithoutCache from '../graphqlWithoutCache'
import Form from './Form';
import jsonSchemaToGqlQuery from '../GqlCmsConfigLib/jsonSchemaToGqlQuery'
import getCRUDSchemaFromResource from '../GqlCmsConfigLib/getCRUDSchemaFromResource'
import removeTypename from '../removeTypename'
import nullToUndefined from '../formLib/nullToUndefined'
import undefinedToNull from '../formLib/undefinedToNull'
import { toast } from 'react-toastify'
import alertFirstGqlMsg from '../alertFirstGqlMsg'

function Update (props) {
  const { config, resource, mutate, data, history } = props;
  const dirtyFormData = data[resource.crudMapping.readOne]
  const purifiedFormData = nullToUndefined(
    removeTypename(
      dirtyFormData
    )
  )
  if (data.loading) {
    return null;
  }
  const onSubmit = async ({ formData }) => {
    const input = undefinedToNull(formData)
    try {
      await mutate({ variables: { input } })
      history.push(`/${resource.name}`)
      toast.success('Update Success')
    } catch (e) {
      alertFirstGqlMsg(e)
    }
  }
  const onCancel = () => {
    history.push(`/${resource.name}`)
  }
  const updateSchema = getCRUDSchemaFromResource({
    config,
    resource,
    crudType: 'update'
  })
  return <div>
    <h1>Update {startCase(resource.name)}</h1>
    <Form
      jsonSchemaFormExtensions={config.jsonSchemaFormExtensions}
      schema={updateSchema.jsonSchema}
      uiSchema={updateSchema.uiSchema}
      formData={purifiedFormData}
      noHtml5Validate
      onSubmit={onSubmit}
      onCancel={onCancel}
    />
  </div>
}

function UpdateWithData (props) {
  const { config, resource } = props;
  const { crudMapping, uniqKey } = resource;
  const updateSchema = getCRUDSchemaFromResource({
    config,
    resource,
    crudType: 'update'
  })

  let Component = Update
  const fieldsQuery = jsonSchemaToGqlQuery(updateSchema.jsonSchema)
  const ReadOneQuery = gql`
  query ${crudMapping.readOne}($${uniqKey}: String!) {
    ${crudMapping.readOne}(${uniqKey}: $${uniqKey}) ${fieldsQuery}
  }
  `
  const uniqKeyValue = props.match.params[uniqKey]
  Component = graphqlWithoutCache(
    ReadOneQuery,
    { options: { variables: { [uniqKey]: uniqKeyValue } } }
  )(Component)

  const UpdateQuery = gql`
  mutation ${crudMapping.update}($input: ${upperFirst(updateSchema.inputName || resource.name + 'Input')}!) {
    ${crudMapping.update}(${resource.name} : $input, ${uniqKey}: "${uniqKeyValue}")
  }
  `;
  Component = graphql(UpdateQuery)(Component)

  return <Component {...props} />
}

export default UpdateWithData
