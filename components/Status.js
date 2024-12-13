import React, { useState, useEffect } from 'react';
import { StatusBar as RNStatusBar, StyleSheet, Text, View, Platform } from 'react-native';
import Constants from 'expo-constants'; // If using Expo
import NetInfo from '@react-native-community/netinfo'; // Import NetInfo

const Status = () => {
  const [info, setInfo] = useState('none'); // 'none' means disconnected, otherwise connected

  useEffect(() => {
    // Get the initial connection status using NetInfo.fetch()
    NetInfo.fetch().then((connectionInfo) => {
      setInfo(connectionInfo.isConnected ? 'connected' : 'none');
    });

    // Add event listener for network status changes
    const subscription = NetInfo.addEventListener((state) => {
      setInfo(state.isConnected ? 'connected' : 'none');
    });

    // Cleanup event listener when the component unmounts
    return () => {
      subscription();
    };
  }, []);

  const isConnected = info !== 'none';
  const backgroundColor = isConnected ? 'green' : 'red';

  const statusBar = (
    <RNStatusBar
      backgroundColor={backgroundColor}
      barStyle={isConnected ? 'dark-content' : 'light-content'}
      animated={false}
    />
  );

  const messageContainer = (
    <View style={styles.messageContainer} pointerEvents="none">
      {statusBar}
      {!isConnected && (
        <View style={styles.bubble}>
          <Text style={styles.text}>No network connection</Text>
        </View>
      )}
    </View>
  );

  if (Platform.OS === 'ios') {
    return (
      <View style={[styles.status, { backgroundColor }]}>
        {messageContainer}
      </View>
    );
  }

  return messageContainer;
};

const statusHeight = Platform.OS === 'ios' ? Constants.statusBarHeight : 0;

const styles = StyleSheet.create({
  status: {
    zIndex: 1,
    height: statusHeight,
    backgroundColor: 'transparent',
  },
  messageContainer: {
    zIndex: 1,
    position: 'absolute',
    top: statusHeight + 20,
    right: 0,
    left: 0,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  bubble: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 25,
    backgroundColor: 'red',
    minWidth: '70%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default Status;
