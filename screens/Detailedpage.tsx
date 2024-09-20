import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';

const Detailedpage: React.FC = () => {
    const markerData = {
        title: "Apartment for sale",
        image: require('../images/house.jpg'),
        images: [require('../images/house.jpg'), require('../images/house.jpg'), require('../images/house.jpg')], // Dummy images for slider
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce convallis magna id sollicitudin maximus.",
        Area: 250,
        Bedrooms: 3,
        washrooms: 2,
        furnished: true,
        kitchen: true,
        water: true,
        electricity: true,
        extras: ["This is very nice and you will love it.", "neat and clean with extra facilities ", "Enjoy your time with us"] 
    };

    return (
        <ScrollView style={styles.container}>
            <ScrollView horizontal>
                {markerData.images.map((image, index) => (
                    <Image key={index} source={image} style={styles.image} />
                ))}
            </ScrollView>
            <Text style={styles.title}>{markerData.title}</Text>
            <Text style={styles.description}>{markerData.description}</Text>
            <View style={styles.sectionContainer}>
                <Text style={styles.heading}>Apartment Booking</Text>
                <View style={styles.detailContainer}>
                    <DetailRow title="Area" value={markerData.Area} />
                    <DetailRow title="Bedrooms" value={markerData.Bedrooms} />
                    <DetailRow title="Washrooms" value={markerData.washrooms} />
                    <DetailRow title="Furnished" value={markerData.furnished ? 'Yes' : 'No'} />
                    <DetailRow title="Kitchen" value={markerData.kitchen ? 'Yes' : 'No'} />
                    <DetailRow title="Water" value={markerData.water ? 'Available' : 'Not Available'} />
                    <DetailRow title="Electricity" value={markerData.electricity ? 'Available' : 'Not Available'} />
                </View>
            </View>
            <View style={styles.sectionContainer}>
                <Text style={styles.heading}>Extras</Text>
                {markerData.extras.map((extra, index) => (
                    <Text key={index} style={styles.extraText}>{extra}</Text>
                ))}
            </View>
        </ScrollView>
    );
};

const DetailRow = ({ title, value }) => (
    <View style={styles.detailRow}>
        <Text style={styles.detailTitle}>{title}</Text>
        <Text style={styles.detailValue}>{value}</Text>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    image: {
        width: 200,
        height: 200,
        resizeMode: 'cover',
        marginBottom: 10,
    },
    description: {
        fontSize: 16,
        marginBottom: 20,
    },
    sectionContainer: {
        marginBottom: 20,
        backgroundColor: '#f2f2f2',
        padding: 15,
        borderRadius: 10,
    },
    heading: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    detailContainer: {
        alignSelf: 'stretch',
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    detailTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    detailValue: {
        fontSize: 16,
    },
    extraText: {
        fontSize: 16,
        marginBottom: 5,
    },
});

export default Detailedpage;
