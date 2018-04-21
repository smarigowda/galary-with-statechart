import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor() {
    super();
    
    this.state = {
      gallery: 'start', // finite state
      query: '',
      items: []
    };
  }

  renderForm(state) {
    const searchText = {
      loading: 'Searching...',
      error: 'Try search again',
      start: 'Search'
    }[state] || 'Search';
    return (
      <form onSubmit={e => this.handleSubmit(e)}>
        <input
          type="search"
          className="ui-input"
          value={this.state.query}
          onChange={e => this.handleChangeQuery(e.target.value)}
          placeholder="Search Flickr for photos..."
          disabled={state === 'loading'}  
        />
      </form>
    )
  }

  render() {
    const galleryState = this.state.gallery;
    return (
      <div className="ui-app" data-state={galleryState}>
        {this.renderForm(galleryState)}
      </div>
    )
  }
}

export default App;
