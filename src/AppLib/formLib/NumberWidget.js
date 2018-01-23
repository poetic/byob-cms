import PropTypes from 'prop-types';
import React from 'react';
import NumberFormat from 'react-number-format';

const NumberWidget = ({ onChange, value, options }) => {
  const { props = {} } = options;

  return (
    <NumberFormat
      className="form-control"
      onValueChange={({ floatValue }) => {
        onChange(floatValue || undefined);
      }}
      value={value}
      thousandSeparator
      {...props}
    />
  );
};

NumberWidget.propTypes = {
  onChange: PropTypes.func.isRequired,
  options: PropTypes.object,
  value: PropTypes.number,
};

NumberWidget.defaultProps = {
  options: {},
  value: undefined,
};

export default NumberWidget;
