import React from 'react'
import Form from "react-jsonschema-form";
import HasOneWidget from './formLib/HasOneWidget'
import HasManyField from './formLib/HasManyField'

const defaultWidgets = {
  hasOneWidget: HasOneWidget,
}

const defaultFields = {
  hasManyField: HasManyField,
}

function ExtendedForm (props) {
  const jsonSchemaFormExtensions = props.jsonSchemaFormExtensions || {}
  const {
    widgets={},
    fields={},
  } = jsonSchemaFormExtensions

  return <Form
    widgets={{...defaultWidgets, ...widgets}}
    fields={{...defaultFields, ...fields}}
    {...props}
  />
}

export default ExtendedForm;
