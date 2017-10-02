import React from 'react'

class Search extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      text: this.props.search
    }
  }
  render() {
    const { onSearchChange } = this.props
    const { text } = this.state
    return <div style={{ maxWidth: "500px" }}>
      <div className="input-group">
        <input
          className="form-control"
          type="text"
          value={text}
          onChange={(e) => this.setState({ text: e.target.value })}
        />
        <span className="input-group-btn">
          <button
            className="btn btn-default"
            type="button"
            onClick={() => onSearchChange(text)}>
            Search
          </button>
        </span>
      </div>
    </div>
  }
}

export default Search
