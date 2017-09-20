import React from 'react'
import { gql } from 'react-apollo'
import { groupBy, difference, union, find } from 'lodash'
import { MultiSelect } from 'react-selectize';
import Label from './Label'
import graphqlWithoutCache from '../../graphqlWithoutCache'
import renderValue from './renderValue'

class TagIdsField extends React.Component {
  // NOTE: this is used for MultiSelect
  removeByValue(value) {
    const { formData, onChange } = this.props
    const nextFormData = formData.filter(v => v !== value)
    onChange(nextFormData)
  }

  render() {
    const props = this.props;
    const {
      name,
      uiSchema,
      idSchema,
      required,
      onChange,
      formData,
      disabled,
      readonly,
      data: { loading, tags, tagQuestions },
    } = props

    if (loading) {
      return null
    }

    const id = idSchema.$id;
    const label = uiSchema["ui:title"] || name;

    const tagsGroundByQuestions = groupBy(tags, 'tagQuestionId')
    const tagsGroundByQuestionsElements = tagQuestions.map((tagQuestion) => {
      const optionItems = tagsGroundByQuestions[tagQuestion._id].map((t) => ({
        value: t._id,
        label: t.title,
      }))
      const valuesForQuestion = formData.filter((tagId) => {
        return find(tags, { _id: tagId }).tagQuestionId === tagQuestion._id
      })
      const valueObjects = optionItems.filter((optionItem) => {
        return valuesForQuestion.includes(optionItem.value)
      })
      return <div key={tagQuestion._id}>
        <Label label={tagQuestion.title} id={tagQuestion._id} />
        <MultiSelect
          disabled={disabled || readonly}
          values={valueObjects}
          options={optionItems}
          onValuesChange={v => {
            const values = v.map(v => v.value)
            const nextFormData = union(difference(formData, valuesForQuestion), values)
            onChange(nextFormData)
          }}
          renderValue={item => renderValue(item, this)}
        />
      </div>
    })

    return <div>
      <Label label={label} required={required} id={id} />
      {tagsGroundByQuestionsElements}
    </div>
  }
}

const Query = gql`
  query TagsAndTagQuestions {
    tags {
      _id
      title
      tagQuestionId
    }
    tagQuestions {
      _id
      title
    }
  }
`

const TagIdsFieldWithData = graphqlWithoutCache(Query)(TagIdsField)
export default TagIdsFieldWithData
