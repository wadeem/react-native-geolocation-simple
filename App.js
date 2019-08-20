import React from 'react';
import {
    TouchableOpacity,
    View,
    Text,
    PermissionsAndroid,
    StyleSheet,
} from 'react-native';

import Geolocation from 'react-native-geolocation-service';

export default class App extends React.Component {

    state = {
        location: {},
    };

    async watchPosition() {

        const granted = await this.getPermission();
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            this.watchID = Geolocation.watchPosition(
                (position) => {
                    this.setState({location: position});
                    console.log(this.state.location);
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
                    this.setState({location: position});
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
        // let promise = this.watchPosition();
        // promise.then(r => console.log(r));
    }

    stopObserving() {
        Geolocation.clearWatch(this.watchID);
        Geolocation.stopObserving();
        this.setState({location:{}})
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
        </View>;
    };
}

const styles = StyleSheet.create({
    button: {
        padding: 10, fontSize: 18,
    },
    container: {
        alignItems: 'center', justifyContent: 'center', flex: 1,
    },
    info: {
        fontSize: 20, margin: 10,color:'forestgreen'
    },

});
