import React, { Component } from 'react';
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from 'react-google-maps';

/**
 * Set value to true on map load callback
 */
function onMapLoaded() {
    console.log('map callback');
    window.isMapLoaded = true;
}

const MapComponent = withScriptjs(
    withGoogleMap(props => {
        return (
            <GoogleMap
                defaultZoom={10}
                defaultCenter={props.places.length > 0 ? props.places[0] : { lat: 39.33182, lng: -76.6452 }}
                defaultOptions={{ mapTypeControl: false }}
                onClick={props.hideInfoWindow}
            >
                {props.isMarkerShown &&
                    props.places.map((place, index) => (
                        <Marker
                            key={index}
                            position={place}
                            animation={place.clicked ? window.google.maps.Animation.BOUNCE : 0}
                            onClick={() => {
                                props.onMarkerClick(index);
                            }}
                        />
                    ))}
            </GoogleMap>
        );
    })
);

/**
 * Map container with map component inside
 */
class Map extends Component {
    componentDidMount() {
        // Set initial value
        window.isMapLoaded = false;

        // Set map callback function
        window.onMapLoaded = onMapLoaded;

        // Set timeout for 10 seconds
        setTimeout(() => {
            if (!window.isMapLoaded) {
                this.props.onError();
            }
        }, 10000);
    }

    render() {
        return (
            <div role="region" aria-label="map" className="map-container" style={{ marginLeft: '250px' }}>
                <MapComponent
                    isMarkerShown={this.props.places.length > 0}
                    googleMapURL="https://www.google.com/maps/embed/v1/place?q=place_id:ChIJt4P01q4DyIkRWOcjQqiWSAQ&key=AIzaSyCTdLTZyGyYT-ExwSHhd6tCh98YGSpdRr4"
                    loadingElement={<div style={{ height: `100%` }} />}
                    containerElement={<div style={{ height: `100%` }} />}
                    mapElement={<div style={{ height: `100%` }} />}
                    places={this.props.places}
                    hideInfoWindow={this.props.hideInfoWindow}
                    onMarkerClick={this.props.onMarkerClick}
                />
            </div>
        );
    }
}

export default Map;
