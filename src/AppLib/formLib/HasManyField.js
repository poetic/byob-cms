import React from 'react'
import { MultiSelect } from 'react-selectize'
import { sortBy } from 'lodash'
import Label from './Label'
import renderValue from './renderValue'
import withOptionItems from './withOptionItems'

class MultiSelectWidget extends React.Component {
  render() {
    const {
      optionItems,
      name,
      schema,
      uiSchema,
      idSchema,
      required,
      onChange,
      formData,
      disabled,
      readonly,
    } = this.props

    const id = idSchema.$id
    const lbl = uiSchema['ui:title'] || schema.title || name
    const valueItems = (formData || []).map(item => optionItems.find(opt => opt.value === item))

    // NOTE: the reason we do this is to fix a bug in react selectize
    // that package caches the renderValue function and it will use the
    // up to date closure data for the function, we use a instance method
    // to bypass this problem
    this.removeByValue = (value) => {
      const nextFormData = formData.filter(v => v !== value)
      onChange(nextFormData)
    }

    this.resortItems = (values) => {
      onChange(values)
    }

    return (
      <div>
        <Label label={lbl} required={required} id={id} />
        <MultiSelect
          disabled={disabled || readonly}
          values={valueItems}
          options={sortBy(optionItems, ({ label }) => label.toUpperCase())}
          onValuesChange={(v) => {
            onChange(v.map(val => val.value))
          }}
          renderValue={item => renderValue(item, valueItems, this)}
        />
      </div>
    )
  }
}

const HasManyField = withOptionItems(MultiSelectWidget, 'field')

export default HasManyField
