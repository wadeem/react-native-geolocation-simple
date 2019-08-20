import React from 'react';
import {
    TouchableOpacity,
    View,
    Text,
    PermissionsAndroid,
} from 'react-native';

import Geolocation from 'react-native-geolocation-service';

export default class App extends React.Component {

    state = {location: {}};

    async watchPosition() {

        const granted = await this.getPermission();
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            Geolocation.watchPosition(
                (position) => {
                    this.setState({location: position});
                    console.log(position);
                }, (error) => {
                    console.log(error.code, error.message);
                }, {enableHighAccuracy: true, distanceFilter: 1, fastestInterval: 500},
            );
        }

    }


    async getLocation() {

        console.log('hello');

        const granted = await this.getPermission();

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {

            Geolocation.getCurrentPosition(
                (position) => {
                    console.log(position);
                    // this.setState({location: position});
                },
                (error) => {
                    // See error code charts below.
                    console.log(error.code, error.message);
                },
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
        let promise = this.watchPosition();
        promise.then(position=>this.setState({location:position}))
    }

    render() {
        return <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}><TouchableOpacity
            // onPress={() => this.watchPosition()}
        >
            <Text style={{fontSize: 18}}>Map</Text>
            <Text>{this.state.location != null && this.state.location.coords!=null ?
                `${this.state.location.coords.latitude} ${this.state.location.coords.longitude}`
                : ''}</Text>
        </TouchableOpacity></View>;

    };
}
