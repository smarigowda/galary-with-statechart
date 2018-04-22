import React from 'react';
import './Photo.scss';

const photo = props => {
  return (
    <section
      className="ui-photo-detail">
      <img
        alt="detail"
        src={props.url}
        className="ui-photo"
        onClick={() => props.transition({ type: 'EXIT_PHOTO' })}
      />
    </section>
  )
}

export default photo;