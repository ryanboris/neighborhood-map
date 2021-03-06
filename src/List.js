import React, { Component } from 'react';
import Geocode from 'react-geocode';
import escapeRegExp from 'escape-string-regexp';

Geocode.setApiKey('AIzaSyBAhp0EZe4AmKQuB6ddFsADGlVXf7al_oc');

class List extends Component {
    state = {
        places: [],
        query: ''
    };

    componentDidMount() {
        Geocode.fromAddress('Googleplex').then(geoResponse => {
            this.props.foursquare.venues
                .getVenues({
                    ll: `${39.33182},${-76.6452}`,
                    categoryId: '4d4b7104d754a06370d81259'
                })
                .then(fsResponse => {
                    const venues = fsResponse.response.venues;
                    this.props.setMarkers(venues);
                    this.setState({ places: venues });
                });
        });
    }

    handleQueryUpdate = query => {
        this.setState({ query }, () => {
            const filtered = this.getFilteredPlaces();
            this.props.setMarkers(filtered);
        });
    };

    handleSandwichClick = () => {
        const map = document.querySelector('.map-container');
        map.style.marginLeft = map.style.marginLeft === '250px' ? '0' : '250px';

        const sandwich = document.querySelector('.sandwich');
        sandwich.style.left = sandwich.style.left === '250px' ? '0' : '250px';
    };

    getFilteredPlaces() {
        const { query, places } = this.state;

        if (!query) {
            return places;
        }

        const match = new RegExp(escapeRegExp(query), 'i');
        return places.filter(p => match.test(p.name));
    }

    getInputField = () => {
        const { query } = this.state;

        return (
            <input
                tabIndex={1}
                className="filter-places"
                type="text"
                value={query}
                onChange={event => this.handleQueryUpdate(event.target.value)}
                placeholder="Filter places"
            />
        );
    };

    getPlaceList = () => {
        let filteredPlaces = this.getFilteredPlaces();

        return (
            <ol className="places" role="listbox" aria-label="List of places">
                {filteredPlaces.map((p, index) => (
                    <li
                        tabIndex={index + 2}
                        role="option"
                        aria-selected="true"
                        key={index}
                        className="place"
                        onClick={() => {
                            this.props.onPlaceClick(index);
                        }}
                        onKeyUp={event => {
                            if (event.keyCode === 13) {
                                this.props.onPlaceClick(index);
                            }
                        }}
                    >
                        {p.name}
                    </li>
                ))}
            </ol>
        );
    };

    render() {
        return (
            <div>
                <div className="sidebar">
                    <div className="heading" role="heading">
                        <h1 className="title">Places</h1>
                        {this.getInputField()}
                    </div>
                    <div className="place-list" role="region">
                        {this.getPlaceList()}
                    </div>
                </div>
                <div tabIndex="-1" style={{ left: '250px' }} className="sandwich" onClick={this.handleSandwichClick}>
                    <img src="menu.png" alt="Toggle menu" />
                </div>
            </div>
        );
    }
}

export default List;
