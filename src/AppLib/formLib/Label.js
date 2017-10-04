import React from 'react'
import formatLabel from './formatLabel';

const REQUIRED_FIELD_SYMBOL = "*";

function Label(props) {
  const { label, required, id } = props;
  if (!label) {
    // See #312: Ensure compatibility with old versions of React.
    return <div />;
  }
  const formattedLabel = formatLabel(label)
  return (
    <label className="control-label" htmlFor={id}>
      {required ? formattedLabel + REQUIRED_FIELD_SYMBOL : formattedLabel}
    </label>
  );
}


export default Label;
