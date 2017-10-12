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
    function onSubmit (e) {
      e.preventDefault();
      onSearchChange(text)
    }
    const style = {
      maxWidth: "500px",
      margin: "30px 0",
    }
    return <form
      onSubmit={onSubmit}
      style={style}
    >
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
            type="submit">
            Search
          </button>
        </span>
      </div>
    </form>
  }
}

export default Search
