// Platform-specific maps wrapper
import { Platform } from 'react-native';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Web-compatible mock components
const WebMapView = React.forwardRef((props, ref) => {
  const { style, children, ...otherProps } = props;
  return (
    <View style={[webStyles.mapContainer, style]} {...otherProps}>
      <View style={webStyles.mapPlaceholder}>
        <Text style={webStyles.mapPlaceholderText}>
          Map view is not available on web.
        </Text>
        <Text style={webStyles.mapPlaceholderSubtext}>
          Please use the mobile app for map functionality.
        </Text>
      </View>
      {children}
    </View>
  );
});

const WebMarker = ({ children, ...props }) => {
  return <View>{children}</View>;
};

const WebCallout = ({ children }) => {
  return <View>{children}</View>;
};

const webStyles = StyleSheet.create({
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

// Conditionally export based on platform
let MapView, Marker, Callout, PROVIDER_GOOGLE;

if (Platform.OS === 'web') {
  // Use web-compatible mock
  MapView = WebMapView;
  Marker = WebMarker;
  Callout = WebCallout;
  PROVIDER_GOOGLE = 'google';
} else {
  // Use native react-native-maps
  // Use dynamic import to avoid bundling issues
  const nativeMaps = require('react-native-maps');
  MapView = nativeMaps.default;
  Marker = nativeMaps.Marker;
  Callout = nativeMaps.Callout;
  PROVIDER_GOOGLE = nativeMaps.PROVIDER_GOOGLE;
}

export { MapView, Marker, Callout, PROVIDER_GOOGLE };
export default MapView;

