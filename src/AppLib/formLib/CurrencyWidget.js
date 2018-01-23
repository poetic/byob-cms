import PropTypes from 'prop-types';
import React from 'react';
import NumerWidget from './NumberWidget';

const CurrencyWidget = ({ options, ...otherProps }) => {
  const mergedOptions = {
    ...options,
    props: {
      decimalScale: 2,
      placeholder: '$',
      prefix: '$',
      ...options.props,
    },
  };

  return (
    <NumerWidget
      options={mergedOptions}
      {...otherProps}
    />
  );
};

CurrencyWidget.propTypes = {
  options: PropTypes.object,
};

CurrencyWidget.defaultProps = {
  options: {},
};

export default CurrencyWidget;
