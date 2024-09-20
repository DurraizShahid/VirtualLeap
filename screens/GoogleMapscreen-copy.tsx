import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, Alert, StyleSheet, ScrollView, PermissionsAndroid } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, Region, MapType } from 'react-native-maps';
import Icon from 'react-native-vector-icons/FontAwesome';
import Geolocation from '@react-native-community/geolocation';
import { useNavigation } from '@react-navigation/native'; // Ensure you're using React Navigation

const darkModeStyle = [
    {
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#212121"
            }
        ]
    },
    {
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#757575"
            }
        ]
    },
    {
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "color": "#212121"
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "administrative.country",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#9e9e9e"
            }
        ]
    },
    {
        "featureType": "administrative.land_parcel",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#bdbdbd"
            }
        ]
    },
    {
        "featureType": "administrative.neighborhood",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#ffffff"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#ffffff"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#181818"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#616161"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#2c2c2c"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#ffffff"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#5c5c5c"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#ffffff"
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#ffffff"
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#757575"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#000000"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#3d3d3d"
            }
        ]
    }
];

const GoogleMapscreen: React.FC = () => {
    const [location, setLocation] = useState<Region | null>(null);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [selectedMarker, setSelectedMarker] = useState<any | null>(null);
    const [markers, setMarkers] = useState<any[]>([]);
    const [filter, setFilter] = useState<string>('');
    const [mapType, setMapType] = useState<MapType>('standard');
    const mapViewRef = useRef<MapView | null>(null);
    const navigation = useNavigation(); // To navigate between screens

    useEffect(() => {
        const requestLocationPermission = async () => {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        title: "Location Permission",
                        message: "This app needs access to your location.",
                        buttonPositive: "OK",
                        buttonNegative: "Cancel",
                    }
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    fetchUserLocation();
                } else {
                    Alert.alert("Permission Denied", "Location permission denied. App cannot fetch location.");
                }
            } catch (error) {
                console.error("Error requesting location permission:", error);
            }
        };

        const fetchUserLocation = () => {
            Geolocation.getCurrentPosition(
                position => {
                    const { latitude, longitude } = position.coords;
                    const initialRegion: Region = {
                        latitude,
                        longitude,
                        latitudeDelta: 0.005,
                        longitudeDelta: 0.005,
                    };
                    setLocation(initialRegion);
                    generateMarkers(latitude, longitude);
                },
                error => {
                    console.error('Error getting location:', error);
                    Alert.alert('Error', 'Could not get your location.');
                },
                { enableHighAccuracy: false, timeout: 5000, maximumAge: 10000 }
            );
        };

        requestLocationPermission();
    }, []);

    const generateMarkers = (latitude: number, longitude: number) => {
        const newMarkers = Array.from({ length: 25 }).map((_, index) => {
            const randomLat = latitude + (Math.random() - 0.5) * 0.01;
            const randomLng = longitude + (Math.random() - 0.5) * 0.01;
            const price = Math.floor(5000 + Math.random() * 50000);
            return {
                id: index,
                coordinate: { latitude: randomLat, longitude: randomLng },
                price: formatPrice(price),
            };
        });
        setMarkers(newMarkers);
    };

    const formatPrice = (price: number) => {
        if (price >= 1000) {
            return `${(price / 1000).toFixed(1)}k AED`;
        }
        return `${price} AED`;
    };

    const handleMarkerPress = (marker: any) => {
        setSelectedMarker(marker);
        setModalVisible(true);
    };

    const filteredMarkers = markers.filter(marker => marker.price.includes(filter));

    const centerMapOnLocation = () => {
        if (location && mapViewRef.current) {
            mapViewRef.current.animateToRegion(location, 1000);
        }
    };

    // Function to toggle between map types
    const toggleMapType = () => {
        if (mapType === 'standard') {
            setMapType('satellite');
        } else if (mapType === 'satellite') {
            setMapType('terrain');
        } else if (mapType === 'terrain') {
            setMapType('hybrid');
        } else {
            setMapType('standard');
        }
    };

    // Function to navigate to FavouritesScreen
    const goToFavourites = () => {
        navigation.navigate('FavouritesScreen'); // Make sure 'FavouritesScreen' is defined in your navigation
    };

    return (
        <View style={styles.container}>
            <View style={styles.filterContainer}>
                <View style={styles.searchBar}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search for Properties..."
                        placeholderTextColor="gray"
                        onChangeText={text => setFilter(text)}
                    />
                    <Icon name="search" size={20} color="gray" style={styles.searchIcon} />
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
                    {["All", "Cheap", "Expensive"].map((filterName, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.filterButton}
                            onPress={() => setFilter(filterName)}
                        >
                            <Text style={styles.filterText}>{filterName}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {location && (
                <MapView
                    provider={PROVIDER_GOOGLE}
                    style={styles.map}
                    ref={mapViewRef}
                    mapType={mapType}
                    initialRegion={location}
                    customMapStyle={darkModeStyle}
                >
                    {filteredMarkers.map(marker => (
                        <Marker
                            key={marker.id}
                            coordinate={marker.coordinate}
                            onPress={() => handleMarkerPress(marker)}
                        >
                            <View style={styles.customMarker}>
                                <Text style={styles.markerText}>{marker.price}</Text>
                            </View>
                        </Marker>
                    ))}
                </MapView>
            )}

            {/* Map buttons */}
            <TouchableOpacity style={styles.currentLocationButton} onPress={centerMapOnLocation}>
                <Icon name="crosshairs" size={20} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.listButton} onPress={() => Alert.alert('List button pressed')}>
                <Icon name="list" size={20} color="white" />
                <Text style={styles.listButtonText}>List View</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.toggleMapTypeButton} onPress={toggleMapType}>
                <Icon name="globe" size={20} color="white" />
            </TouchableOpacity>

            {/* Favourites button */}
            <TouchableOpacity style={styles.favouritesButton} onPress={goToFavourites}>
                <Icon name="heart-o" size={20} color="white" />
            </TouchableOpacity>

            {/* Scrollable bottom buttons */}
            <View style={styles.bottomScrollContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.bottomScrollContent}>
                {["Daily/Monthly", "For Rent", "For Sale"].map((buttonName, index) => (
                    <TouchableOpacity key={index} style={styles.bottomButton}>
                        <Icon name="briefcase" size={20} color={styles.bottomButtonText.color} style={styles.icon} />
                        <Text style={styles.bottomButtonText}>{buttonName}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>

            {/* Marker modal */}
            <Modal visible={modalVisible} transparent>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text>Property Price: {selectedMarker?.price}</Text>
                        <TouchableOpacity onPress={() => setModalVisible(false)}>
                            <Text style={styles.closeButton}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    customMarker: {
        backgroundColor: '#38ADA9',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 20,
    },
    markerText: {
        color: 'white',
        fontWeight: 'bold',
    },
    filterContainer: {
        position: 'absolute',
        top: 20,
        left: 0,
        right: 0,
        zIndex: 10,
        paddingHorizontal: 10,
    },
    searchBar: {
        flexDirection: 'row',
        backgroundColor: '#23252F',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 15,
        alignItems: 'center',
    },
    searchInput: {
        flex: 1,
        color: '#38ADA9',
    },
    searchIcon: {
        marginRight: 10,
    },
    filterScroll: {
        flexDirection: 'row',
        marginTop: 10,
    },
    filterButton: {
        backgroundColor: '#19191C',
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginHorizontal: 5,
        borderRadius: 20,
    },
    filterText: {
        color: '#38ADA9',
        fontWeight: 'bold',
    },
    currentLocationButton: {
        position: 'absolute',
        bottom: 170,
        left: 10,
        backgroundColor: '#23252F',
        borderRadius: 20,
        padding: 20,
    },
    listButton: {
        position: 'absolute',
        bottom: 100,
        left: 10,
        backgroundColor: '#23252F',
        borderRadius: 20,
        padding: 20, // Adjust padding for button size
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center', // Center content horizontally
        zIndex: 1000,
    },
    listButtonText: {
        color: '#FFFFFF',
        marginLeft: 20, // Space between icon and text
        fontSize: 15,   // Adjust font size as needed
        fontWeight: 'light',
    },
        toggleMapTypeButton: {
        position: 'absolute',
        bottom: 240,
        left: 10,
        backgroundColor: '#23252F',
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
    },
    favouritesButton: {
        position: 'absolute',
        bottom: 100, // Adjust position to place above the "For Rent" and "For Sale" buttons
        right: 10,
        backgroundColor: '#23252F',
        borderRadius: 20,
        padding: 20,
    },
    buttonText: {
        color: '#FFFFFF',
        marginTop: 5,
        fontSize: 12,
    },
    bottomScrollContainer: {
        position: 'absolute',
        bottom: 20,
        left: 10,
        right: 10,
        backgroundColor: 'transparent',
        padding: 10,
        borderRadius: 10,
        zIndex: 1,
    },
    bottomScrollContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    bottomButton: {
        backgroundColor: '#19191C',
        borderRadius: 10,
        paddingVertical: 15, // Increase vertical padding for height
        paddingHorizontal: 20, 
        padding: 10,
        marginHorizontal: 5,
        flexDirection: 'row',
        alignItems: 'center',
    },
    bottomButtonText: {
        color: '#6C768A',
        marginLeft: 5,
    },
    icon: {
        marginRight: 5,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        width: '80%',
        padding: 20,
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        alignItems: 'center',
    },
    closeButton: {
        color: 'blue',
        marginTop: 10,
    },
});

export default GoogleMapscreen;
