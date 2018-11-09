import React, { Component } from 'react';
import List from './List';
import Map from './Map';
import InfoWindow from './InfoWindow';
import './App.css';

const FOURSQUARE = require('react-foursquare')({
    clientID: 'YT0MPEVNRTAXN5WLFZ2Z1VFI2L5HAQIMYYWVE3TVHWDLC2XT',
    clientSecret: 'P5VYBTPZF5KQNPGONBOWWCMJDQWYH5AAUM4SS1S24RH3XJDX'
});

class App extends Component {
    state = {
        places: [],
        selectedPlace: null
    };

    handleSetMarkers = places => {
        this.setState({ places });
    };

    handleMarkerClick = marker => {
        const places = this.state.places.map((p, index) => {
            if (index === marker) {
                p.clicked = true;
            } else {
                p.clicked = false;
            }
            return p;
        });

        this.getInfo(this.state.places[marker])
            .then(fsResponse => {
                this.setState({
                    places: places,
                    selectedPlace: fsResponse.response.venue
                });
                document.querySelector('.info-window').focus();
            })
            .catch(error => {
                this.showError();
                console.log(error);
            });
    };

    handleHidingInfoWindow = () => {
        // Update places
        const places = this.state.places.map((p, index) => {
            p.clicked = false;
            return p;
        });

        this.setState({ places: places, selectedPlace: null });
    };

    getInfo = place => {
        return FOURSQUARE.venues.getVenue({
            venue_id: place.id
        });
    };

    showError = () => {
        const block = document.querySelector('.error');
        block.style.opacity = 1;
        setTimeout(() => {
            block.style.opacity = 0;
        }, 3000);
    };

    render() {
        const placesInfo = this.state.places.map(v => {
            return { lat: v.location.lat, lng: v.location.lng, clicked: v.clicked };
        });

        return (
            <div className="app-container">
                <List
                    foursquare={FOURSQUARE}
                    setMarkers={this.handleSetMarkers}
                    onPlaceClick={this.handleMarkerClick}
                />
                <Map
                    places={placesInfo}
                    hideInfoWindow={this.handleHidingInfoWindow}
                    onMarkerClick={this.handleMarkerClick}
                    onError={this.showError}
                />
                {this.state.selectedPlace && (
                    <InfoWindow
                        place={this.state.selectedPlace}
                        foursquare={FOURSQUARE}
                        hideInfoWindow={this.handleHidingInfoWindow}
                    />
                )}
                <div style={{ opacity: 0 }} className="error">
                    OOPS! An error occurred!
                </div>
            </div>
        );
    }
}

export default App;
