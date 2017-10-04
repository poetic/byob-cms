import React from "react";
import PropTypes from "prop-types";
import formatLabel from './formatLabel';

const REQUIRED_FIELD_SYMBOL = "*";

function TitleField(props) {
  const { id, title, required } = props;
  const formattedLabel = formatLabel(title)
  const legend = required ? formattedLabel + REQUIRED_FIELD_SYMBOL : formattedLabel;
  return <legend id={id}>{legend}</legend>;
}

if (process.env.NODE_ENV !== "production") {
  TitleField.propTypes = {
    id: PropTypes.string,
    title: PropTypes.string,
    required: PropTypes.bool,
  };
}

export default TitleField;
