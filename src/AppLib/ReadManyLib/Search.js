import React from 'react'

class Search extends React.Component {
  render() {
    const { search, onSearchChange } = this.props
    const style = {
      maxWidth: "500px",
      margin: "30px 0",
    }
    return <form style={style} >
      <div className="input-group">
        <input
          className="form-control"
          type="text"
          value={search || ''}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </form>
  }
}

export default Search
