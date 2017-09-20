import React from 'react'
import Form from "react-jsonschema-form";
import HasOneWidget from './formLib/HasOneWidget'
import HasManyField from './formLib/HasManyField'

const widgets = {
  hasOneWidget: HasOneWidget,
}

const fields = {
  hasManyField: HasManyField,
}

function ExtendedForm (props) {
  return <Form
    widgets={widgets}
    fields={fields}
    {...props}
  />
}

export default ExtendedForm;
