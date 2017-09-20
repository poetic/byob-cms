import React from 'react'
import { SimpleSelect } from 'react-selectize'
import withOptionItems from './withOptionItems'

function SimpleSelectWidget (props) {
  const { optionItems } = props
  const valueItem = optionItems.find(option => option.value === props.value)

  return <SimpleSelect
    disabled={props.disabled || props.readonly}
    options={optionItems}
    value={valueItem}
    onValueChange={v => props.onChange(v && v.value)}
  />
}

const HasOneWidget = withOptionItems(SimpleSelectWidget, 'widget')

export default HasOneWidget
