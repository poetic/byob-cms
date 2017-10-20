import React from 'react'
import Form from "react-jsonschema-form";
import HasOneWidget from './formLib/HasOneWidget'
import HasManyField from './formLib/HasManyField'
import FieldTemplate from './formLib/FieldTemplate'
// NOTE: TitleField is used for ArrayField
import TitleField from './formLib/TitleField'

function FormButtons (props) {
  const { onCancel, readOnly } = props
  if (readOnly) {
    return <div>
      <button type="button" className="btn btn-primary" onClick={onCancel}>
        Back
      </button>
      <button type="submit" style={{ display: 'none' }}>
        Submit
      </button>
    </div>
  } else {
    return <div>
      <button type="button" className="btn btn-danger" onClick={onCancel}>
        Cancel
      </button>
      <button type="submit" className="btn btn-primary" style={{ float: 'right' }}>
        Submit
      </button>
    </div>
  }
}

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
  >
    <FormButtons
      onCancel={props.onCancel}
      readOnly={props.readOnly}
    />
  </Form>
}

export default ExtendedForm;
