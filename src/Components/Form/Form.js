import React from 'react';
import './Form.scss';

const form = props => {
  const searchText = {
    loading: 'Searching...',
    error: 'Try search again',
    start: 'Search'
  }[props.state] || 'Search';
  return (
    <form onSubmit={e => props.handleSubmit(e)}>
    <input
      type="search"
      className="ui-input"
      value={props.query}
      onChange={e => props.handleChangeQuery(e.target.value)}
      placeholder="search for photos..."
      disabled={props.state === 'loading'}  
    />
    <div className="ui-buttons">
      <button
        className="ui-button"
        disabled={props.state === 'loading'}>
          {searchText}
      </button>
      {props.state === 'loading' &&
        <button
          className="ui-button"
          type="button"
          onClick={() => props.transition({ type: 'CANCEL_SEARCH' })}
        >
          Cancel
        </button>
      }
    </div>
  </form>
  )
}

export default form;