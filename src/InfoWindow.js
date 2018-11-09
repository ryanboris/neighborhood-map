import React, { Component } from 'react';
import Draggable from 'react-draggable';

class InfoWindow extends Component {
    render() {
        const { place } = this.props;

        return (
            <Draggable>
                <article className="info-window" tabIndex="1">
                    <h2 className="info-name">{place.name}</h2>
                    <p
                        onClick={() => {
                            this.props.hideInfoWindow();
                        }}
                        className="close-window"
                    >
                        X
                    </p>
                    <p className="info-category">{place.categories[0].name}</p>
                    <p className="info-address">
                        {place.location.address}, {place.location.city}
                    </p>
                    <p className="info-rating">
                        Rating: {place.rating} ({place.likes.summary})
                    </p>
                    {place.bestPhoto && (
                        <img
                            aria-label={place.name}
                            alt={place.name}
                            src={`${place.bestPhoto.prefix}300x200${place.bestPhoto.suffix}`}
                            onDragStart={event => event.preventDefault()}
                        />
                    )}
                    <p className="attribution">from FourSquare</p>
                </article>
            </Draggable>
        );
    }
}

export default InfoWindow;
