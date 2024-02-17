import {StatusBar} from 'expo-status-bar';
import {useEffect, useState} from 'react';
import {Alert, Button, StyleSheet, Text, TextInput, View} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import Constants from 'expo-constants';
import * as Location from 'expo-location';

export default function App() {
	const [address, setAddress] = useState('');
	const [title, setTitle] = useState('');
	const [location, setLocation] = useState({
		longitude: null,
		latitude: null,
		latitudeDelta: null,
		longitudeDelta: null,
		defaultLocation: null,
	});
	//const [initRegion, setInitRegion] = useState();

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
			setTitle(JSON.stringify(json[0].display_name));
			setAddress('');
			return setLocation({
				latitude: parseFloat(json[0].lat),
				longitude: parseFloat(json[0].lon),
				latitudeDelta: 0.05,
				longitudeDelta: 0.05,
				defaultLocation: false,
			});
		} catch (error) {
			console.log(error);
			return Alert.alert('Address not found', 'Please use correct address');
		}
	};

	useEffect(() => {
		if (location && location.latitude && location.longitude) return;

		(async () => {
			let {status} = await Location.requestForegroundPermissionsAsync();
			if (status !== 'granted') {
				Alert.alert(
					'Permission to access your location was denied',
					'Please, change your permissions to locate on app settings'
				);
			}

			let initialLocation = await Location.getCurrentPositionAsync({});
			//console.log(initialLocation);
			//`https://geocode.maps.co/reverse?lat=${initialLocation.coords.latitude}&lon={initialLocation.coords.longitude}&api_key=${process.env.EXPO_PUBLIC_API_KEY}`
			const result = await fetch(
				`https://geocode.maps.co/reverse?lat=${initialLocation.coords.latitude}&lon=${initialLocation.coords.longitude}&api_key=${process.env.EXPO_PUBLIC_API_KEY}`
			);
			const json = await result.json();
			//console.log(json);
			setTitle(JSON.stringify(json.display_name));
			setAddress('');
			return setLocation({
				longitude: initialLocation.coords.longitude,
				latitude: initialLocation.coords.latitude,
				latitudeDelta: 1,
				longitudeDelta: 1,
				defaultLocation: true,
			});
		})();
	}, []);

	return (
		<View style={styles.container}>
			{location && location.latitude && location.longitude && (
				<MapView
					//initialRegion={initRegion}
					region={{
						latitude: location && location.latitude && location.latitude,
						longitude: location && location.longitude && location.longitude,
						latitudeDelta: location && location.latitudeDelta && location.latitudeDelta,
						longitudeDelta: location && location.longitudeDelta && location.longitudeDelta,
					}}
					style={styles.mapView}
				>
					<Marker coordinate={{latitude: location.latitude, longitude: location.longitude}} title={title} />
				</MapView>
			)}
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

