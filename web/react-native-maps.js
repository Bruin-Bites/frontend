// Web-compatible mock for react-native-maps
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Mock MapView component for web
export const MapView = React.forwardRef((props, ref) => {
  const { style, children, ...otherProps } = props;
  return (
    <View style={[styles.mapContainer, style]} {...otherProps}>
      <View style={styles.mapPlaceholder}>
        <Text style={styles.mapPlaceholderText}>
          Map view is not available on web.
        </Text>
        <Text style={styles.mapPlaceholderSubtext}>
          Please use the mobile app for map functionality.
        </Text>
      </View>
      {children}
    </View>
  );
});

// Mock Marker component
export const Marker = ({ children, ...props }) => {
  return <View>{children}</View>;
};

// Mock Callout component
export const Callout = ({ children }) => {
  return <View>{children}</View>;
};

// Mock PROVIDER_GOOGLE constant
export const PROVIDER_GOOGLE = 'google';

const styles = StyleSheet.create({
  mapContainer: {
    flex: 1,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapPlaceholder: {
    padding: 20,
    alignItems: 'center',
  },
  mapPlaceholderText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  mapPlaceholderSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});

export default MapView;

