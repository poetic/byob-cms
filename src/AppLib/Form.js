import React from 'react'
import Form from "react-jsonschema-form";
import HasOneWidget from './formLib/HasOneWidget'
import HasManyField from './formLib/HasManyField'
import FieldTemplate from './formLib/FieldTemplate'
// NOTE: TitleField is used for ArrayField
import TitleField from './formLib/TitleField'

const defaultWidgets = {
  hasOneWidget: HasOneWidget,
}

const defaultFields = {
  hasManyField: HasManyField,
  TitleField,
}

function ExtendedForm (props) {
  const jsonSchemaFormExtensions = props.jsonSchemaFormExtensions || {}
  const {
    widgets={},
    fields={},
  } = jsonSchemaFormExtensions

  return <Form
    FieldTemplate={FieldTemplate}
    widgets={{...defaultWidgets, ...widgets}}
    fields={{...defaultFields, ...fields}}
    {...props}
  />
}

export default ExtendedForm;
