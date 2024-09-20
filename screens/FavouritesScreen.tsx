// File: /screens/FavouritesScreen.tsx

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, FlatList } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import NotFound from '../assets/NotFound';

const FavouritesScreen: React.FC = () => {
  const [isFavouriteTab, setIsFavouriteTab] = useState(true);

  // Sample data for properties (replace with real data)
  const favouriteProperties:any[] = [];
  const contactedProperties = [
    {
      id: '1',
      type: 'Apartment for rent',
      price: '43,000 SAR / yearly',
      details: '1 Bedroom | 1 Living Room | 1 Bath',
      address: 'Address of the place, properly written in order and neatly organized.',
      image: 'https://via.placeholder.com/150',
    },
    {
      id: '2',
      type: 'Apartment for rent',
      price: '43,000 SAR / yearly',
      details: '1 Bedroom | 1 Living Room | 1 Bath',
      address: 'Address of the place, properly written in order and neatly organized.',
      image: 'https://via.placeholder.com/150',
    },
  ];

  const renderPropertyItem = ({ item }: { item: any }) => (
    <View style={styles.propertyContainer}>
      <View style={styles.propertyInfo}>
        <Text style={styles.propertyType}>{item.type}</Text>
        <Text style={styles.propertyPrice}>{item.price}</Text>
        <Text style={styles.propertyDetails}>{item.details}</Text>
        <Text style={styles.propertyAddress}>{item.address}</Text>
      </View>
      <Image source={{ uri: item.image }} style={styles.propertyImage} />
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <NotFound/>
      <Text style={styles.emptyTitle}>
        {isFavouriteTab ? 'You have no favourites' : 'You have not contacted anyone'}
      </Text>
      <Text style={styles.emptySubtitle}>
        {isFavouriteTab
          ? 'Start adding and view them here. You can add them using the heart icon.'
          : 'Start contacting properties and view them here.'}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Favourites</Text>
      </View>

      {/* Tab Toggle */}
      <View style={styles.tabContainer}>
        <TouchableOpacity onPress={() => setIsFavouriteTab(true)}>
          <Text style={[styles.tabText, isFavouriteTab && styles.activeTab]}>Favourites</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setIsFavouriteTab(false)}>
          <Text style={[styles.tabText, !isFavouriteTab && styles.activeTab]}>Contacted</Text>
        </TouchableOpacity>
      </View>
      <View style={[styles.tabIndicator, { left: isFavouriteTab ? '20%' : '60%' }]} />

      {/* Conditional Rendering for Favourites and Contacted */}
      {(isFavouriteTab ? favouriteProperties : contactedProperties).length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={isFavouriteTab ? favouriteProperties : contactedProperties}
          renderItem={renderPropertyItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#1f1f1f',
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
    backgroundColor: '#1f1f1f',
    paddingVertical: 10,
  },
  tabText: {
    fontSize: 18,
    color: '#fff',
  },
  activeTab: {
    color: '#00D6BE',
    fontWeight: 'bold',
  },
  tabIndicator: {
    width: 60,
    height: 3,
    backgroundColor: '#00D6BE',
    position: 'absolute',
    top: 110,
  },
  listContent: {
    padding: 20,
  },
  propertyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1f1f1f',
    borderRadius: 10,
    marginBottom: 15,
    padding: 15,
  },
  propertyInfo: {
    flex: 1,
  },
  propertyType: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 5,
  },
  propertyPrice: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#00D6BE',
  },
  propertyDetails: {
    fontSize: 14,
    color: '#888',
    marginVertical: 5,
  },
  propertyAddress: {
    fontSize: 12,
    color: '#888',
  },
  propertyImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginLeft: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyImage: {
    width: 300,
    height: 200,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
});

export default FavouritesScreen;
