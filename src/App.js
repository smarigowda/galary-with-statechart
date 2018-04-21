import React, { Component } from 'react';
import './App.css';
import './App.scss';

const galleryMachine = {
  start: {
    SEARCH: 'loading'
  },
  loading: {
    SEARCH_SUCCESS: 'gallery',
    SEARCH_FAILURE: 'error',
    CANCEL_SEARCH: 'gallery'
  },
  error: {
    SEARCH: 'loading'
  },
  gallery: {
    SEARCH: 'loading',
    SELECT_PHOTO: 'photo'
  },
  photo: {
    EXIT_PHOTO: 'gallery'
  }
};

class App extends Component {
  constructor() {
    super();
    
    this.state = {
      gallery: 'start', // finite state
      query: '',
      items: []
    };
  }

  handleSubmit(e) {
    e.preventDefault();
    e.persist();
    console.log('handleSubmit called...');
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
          placeholder="search for photos..."
          disabled={state === 'loading'}  
        />
        <div className="ui-buttons">
          <button
            className="ui-button"
            disabled={state === 'loading'}>
              {searchText}
          </button>
          {state === 'loading' &&
            <button
              className="ui-button"
              type="button"
              onClick={() => this.transition({ type: 'CANCEL_SEARCH' })}>
              Cancel
            </button>
          }
        </div>
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
