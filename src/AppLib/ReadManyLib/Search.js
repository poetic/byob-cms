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
    return <div>
      <input
        type="text"
        value={text}
        onChange={(e) => this.setState({ text: e.target.value })}
      />
      <button onClick={() => onSearchChange(text)}>Search</button>
    </div>
  }
}

export default Search
