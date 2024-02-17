import {StatusBar} from 'expo-status-bar';
import {useEffect, useState} from 'react';
import {Alert, Button, StyleSheet, Text, TextInput, View} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import Constants from 'expo-constants';
//import * as Location from 'expo-location';

export default function App() {
	const [address, setAddress] = useState('');
	const [location, setLocation] = useState(null);

	const initRegion = {
		longitude: 24.9427473,
		latitude: 60.1674881,
		latitudeDelta: 1,
		longitudeDelta: 1,
	};

	//https://geocode.maps.co/search?q=address&api_key=api_key

	const fetchLocation = async (e) => {
		e.preventDefault();
		if (!address) return;
		//console.log('fetch');
		try {
			const result = await fetch(
				`https://geocode.maps.co/search?q=${address}&api_key=${process.env.EXPO_PUBLIC_API_KEY}`
			);
			const json = await result.json();
			//console.log(json[0], json[0].lat, json[0].lon);
			return setLocation({latitude: parseFloat(json[0].lat), longitude: parseFloat(json[0].lon)});
		} catch (error) {
			console.log(error);
			return Alert.alert('Address not found', 'Please use correct address');
		}
	};

	return (
		<View style={styles.container}>
			<MapView
				//initialRegion={initRegion}
				region={{
					latitude: location ? location.latitude : initRegion.latitude,
					longitude: location ? location.longitude : initRegion.longitude,
					latitudeDelta: location ? 0.05 : initRegion.latitudeDelta,
					longitudeDelta: location ? 0.05 : initRegion.longitudeDelta,
				}}
				style={styles.mapView}
			>
				{location && location.latitude && location.longitude && (
					<Marker coordinate={{latitude: location.latitude, longitude: location.longitude}} title={address} />
				)}
			</MapView>
			<View style={styles.searchArea}>
				<TextInput
					placeholder='Address to find...'
					value={address}
					onChangeText={(e) => setAddress(e)}
					style={styles.addressInput}
				/>
				<Button title='Find address' onPress={(e) => fetchLocation(e)} />
			</View>
			<StatusBar style='auto' />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		marginTop: Constants.statusBarHeight,
		display: 'flex',
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
	},
	mapView: {
		flex: 12,
		width: '100%',
	},
	searchArea: {
		flex: 2,
		width: '100%',
		paddingLeft: 10,
		paddingRight: 10,
		//alignItems: 'center',
		justifyContent: 'center',
	},
	addressInput: {
		//width: 300,
		margin: 0,
		marginBottom: 10,
		marginTop: 5,
		padding: 0,
		borderColor: '#000000',
		borderBottomWidth: 1,
	},
});

