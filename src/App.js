import React, { Component } from 'react';
import './App.css';
import './App.scss';
import fetchJsonp from 'fetch-jsonp';

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
      currentState: 'start', // finite state
      query: '',
      items: [],
      photo: {},
    };
  }

  handleSubmit(e) {
    e.preventDefault();
    e.persist();
    console.log('handleSubmit called...');
    this.transition({ type: 'SEARCH', query: this.state.query });
  }

  handleChangeQuery(value) {
    this.setState({ query: value })
  }

  transition(action) {
    const currentGalleryState = this.state.currentState;
    const nextGalleryState = galleryMachine[currentGalleryState][action.type];
    if(nextGalleryState) {
      const output = this.command(nextGalleryState, action);
      this.setState({
        currentState: nextGalleryState,
        ...output
      });
    }
  }

  command(state, action) {
    switch(state) {
      case 'loading':
        this.search(action.query);
        break;
      case 'gallery':
        if(action.items) {
          console.log(action.items);
          return { items: action.items };
        }
        break;
      case 'error':
        break;
      case 'photo':
        if(action.item) {
          return { photo: action.item }
        }
        break;
      default:
        break;
    }
  }

  search(query) {
    console.log('search called');
    const encodedQuery = encodeURIComponent(query);
    setTimeout(() => {
      // console.log('search complete');
      // this.transition({ type: 'SEARCH_SUCCESS', items: [{id: 1}, {id: 2}] });
      // this.transition({ type: 'SEARCH_FAILURE' });
      fetchJsonp(
        `https://api.flickr.com/services/feeds/photos_public.gne?lang=en-us&format=json&tags=${encodedQuery}`,
        { jsonpCallback: 'jsoncallback' })
        .then(res => res.json())
        .then(data => {
          this.transition({ type: 'SEARCH_SUCCESS', items: data.items });
        })
        .catch(error => {
          this.transition({ type: 'SEARCH_FAILURE' });
        });
    }, 1000);
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
              onClick={() => this.transition({ type: 'CANCEL_SEARCH' })}
            >
              Cancel
            </button>
          }
        </div>
      </form>
    )
  }

  renderGallery(state) {
    console.log(`render gallery called with state = ${state}`);
    return (
      <section className="ui-items" data-state={state}>
        {state === 'error'
          ? <span className="ui-error">Uh oh, search failed.</span>
          : this.state.items.map((item, i) =>
            <img
              alt='gallery'
              src={item.media.m}
              className="ui-item"
              style={{'--i': i}}
              key={item.link}
              onClick={() => this.transition({
                type: 'SELECT_PHOTO', item
              })}
            />
          )
        }
      </section>
    );
  }

  renderPhoto(state) {
    if (state !== 'photo') return;
    
    return (
      <section
        className="ui-photo-detail">
        <img
          alt="detail"
          src={this.state.photo.media.m}
          className="ui-photo"
          onClick={() => this.transition({ type: 'EXIT_PHOTO' })}
        />
      </section>
    )
  }

  render() {
    const galleryState = this.state.currentState;
    return (
      <div className="ui-app" data-state={galleryState}>
        {this.renderForm(galleryState)}
        {this.renderGallery(galleryState)}
        {this.renderPhoto(galleryState)}
      </div>
    )
  }
}

export default App;
