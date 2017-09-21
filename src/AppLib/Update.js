import React from 'react'
import { gql, graphql } from 'react-apollo'
import { upperFirst } from 'lodash';
import graphqlWithoutCache from '../graphqlWithoutCache'
import Form from './Form';
import jsonSchemaToGqlQuery from '../GqlCmsConfigLib/jsonSchemaToGqlQuery'
import getCRUDSchemaFromResource from '../GqlCmsConfigLib/getCRUDSchemaFromResource'
import removeTypename from '../removeTypename'
import nullToUndefined from '../formLib/nullToUndefined'
import undefinedToNull from '../formLib/undefinedToNull'

function Update (props) {
  const { resource, mutate, data } = props;
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
      window.alert('Update Success')
    } catch (e) {
      window.alert(e)
    }
  }
  const updateSchema = getCRUDSchemaFromResource({
    resource,
    crudType: 'update'
  })
  return <div>
    <h1>update {resource.name}</h1>
    <Form
      schema={updateSchema.jsonSchema}
      uiSchema={updateSchema.uiSchema}
      formData={purifiedFormData}
      noHtml5Validate
      onSubmit={onSubmit}
    />
  </div>
}

function UpdateWithData (props) {
  const { resource } = props;
  const { crudMapping, uniqKey } = resource;
  const updateSchema = getCRUDSchemaFromResource({
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
  mutation ${crudMapping.update}($input: ${upperFirst(resource.name + 'Input')}!) {
    ${crudMapping.update}(${resource.name} : $input, ${uniqKey}: "${uniqKeyValue}")
  }
  `;
  Component = graphql(UpdateQuery)(Component)

  return <Component {...props} />
}

export default UpdateWithData
