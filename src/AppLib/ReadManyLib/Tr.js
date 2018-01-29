import PropTypes from 'prop-types';
import React from 'react';
import { gql } from 'react-apollo';
import { toast } from 'react-toastify';
import TdAction from './TdAction';
import alertFirstGqlMsg from '../../alertFirstGqlMsg';

function Tr(props) {
  const {
    row,
    resource,
    cellFormatter,
    mutate,
    changeUrl,
    columnNames,
  } = props;

  const handleDelete = async () => {
    // eslint-disable-next-line no-alert
    const confirm = window.confirm('Are you sure you want to delete?');

    if (!confirm) {
      return;
    }

    const { crudMapping, uniqKey } = resource;
    const uniqKeyQuery = { [uniqKey]: row[uniqKey] };

    const deleteMutation = gql`
      mutation ${crudMapping.delete}($${uniqKey}: String!) {
        ${crudMapping.delete}(${uniqKey}: $${uniqKey})
      }
    `;

    try {
      await mutate({
        mutation: deleteMutation,
        variables: uniqKeyQuery,
      });

      changeUrl();
      toast.success('Delete Success');
    } catch (error) {
      alertFirstGqlMsg(error);
    }
  }

  const tdFieldElements = columnNames.map(columnName => (
    <td key={columnName}>
      {cellFormatter(row[columnName], row, columnName)}
    </td>
  ));

  return (
    <tr>
      {tdFieldElements}
      <TdAction
        key="actions"
        resource={resource}
        row={row}
        handleDelete={handleDelete}
      />
    </tr>
  );
}

Tr.propTypes = {
  row: PropTypes.object.isRequired,
  resource: PropTypes.object.isRequired,
  cellFormatter: PropTypes.func.isRequired,
  mutate: PropTypes.func.isRequired,
  changeUrl: PropTypes.func.isRequired,
  columnNames: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default Tr;
