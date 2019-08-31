import React from 'react';
import {
    TouchableOpacity,
    View,
    Text,
    PermissionsAndroid,
    StyleSheet,
} from 'react-native';
import styles from './src/styles.js';

import Geolocation from 'react-native-geolocation-service';

export default class App extends React.Component {

    state = {
        location: null,
        locations: [],
    };

    async watchPosition() {

        const granted = await this.getPermission();
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            this.watchID = Geolocation.watchPosition(
                (position) => {
                    this.setState({
                        location: null,
                        locations: [...this.state.locations, position.coords],
                    });
                }, (error) => {
                    console.log(error.code, error.message);
                }, {enableHighAccuracy: true, distanceFilter: 1, fastestInterval: 1500},
            );
        }

    }

    async getLocation() {

        console.log('hello');

        const granted = await this.getPermission();

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {

            Geolocation.getCurrentPosition(
                (position) => {
                    this.setState({location: position, locations: []});
                },
                error => console.log(error.code, error.message),
                {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
            );
        }
    }

    async getPermission() {
        return await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
                title: 'I need your coordinates',
                message: 'Just agree',
            },
        );
    }

    componentDidMount() {
        // let promise = this.watchPosition();
        // promise.then(r => console.log(r));
    }

    stopObserving() {
        if (this.watchID != null) {
            Geolocation.clearWatch(this.watchID);
            Geolocation.stopObserving();
        }
        this.setState({location: null, locations: []});
    }

    render() {
        const {button, info, container} = styles;

        return <View style={container}>
            <TouchableOpacity
                onPress={() => this.getLocation()}>
                <Text style={button}>Get current location</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.watchPosition()}>
                <Text style={button}>Watch position</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.stopObserving()}>
                <Text style={button}>Stop watching</Text>
            </TouchableOpacity>
            <Text style={info}>{this.state.location != null && this.state.location.coords != null ?
                `${this.state.location.coords.latitude} ${this.state.location.coords.longitude}`
                : ''}</Text>

            {this.state.locations.map(l => console.log('map=>', l))}

            {this.state.locations.length > 0 ?
                this.state.locations
                    .slice(Math.max(this.state.locations.length - 4, 1))
                    .map(l => <Text
                        style={info}
                        key={l.longitude + l.latitude}
                    >{l.latitude} {l.longitude}</Text>) : console.log('fsdf')}
        </View>;
    };
}


