import React from 'react'

class Search extends React.Component {
  render() {
    const { search, onSearchChange } = this.props
    const style = {
      maxWidth: "500px",
      margin: "30px 0",
    }
    return <form style={style} >
      <input
        placeholder="Search..."
        className="form-control"
        type="text"
        value={search || ''}
        style={{ display: 'inline-block', width: '50%' }}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      {
        search
          ? <span style={{ padding: '10px' }} onClick={() => onSearchChange("")}>
            X
          </span>
          : null
      }
    </form>
  }
}

export default Search
