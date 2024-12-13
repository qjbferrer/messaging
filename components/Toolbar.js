import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Modal, Alert, Animated } from 'react-native';
import PropTypes from 'prop-types';
import * as Location from 'expo-location';

export default class Toolbar extends React.Component {
  static propTypes = {
    isFocused: PropTypes.bool.isRequired,
    onChangeFocus: PropTypes.func,
    onSubmit: PropTypes.func,
    onPressCamera: PropTypes.func,
    onPressLocation: PropTypes.func,
  };

  static defaultProps = {
    onChangeFocus: () => {},
    onSubmit: () => {},
    onPressCamera: () => {},
    onPressLocation: () => {},
  };

  state = {
    text: '',
    cameraMessage: '',
    locationMessage: '',
    modalVisible: false,
    modalMessage: '',
    fadeAnim: new Animated.Value(0), // Initial opacity for modal animation
  };

  handleChangeText = (text) => {
    this.setState({ text });
  };

  handleSubmitEditing = () => {
    const { onSubmit } = this.props;
    const { text } = this.state;
    if (!text) return;
    onSubmit(text);
    this.setState({ text: '' });
  };

  setInputRef = (ref) => {
    this.input = ref;
  };

  componentDidUpdate(prevProps) {
    if (prevProps.isFocused !== this.props.isFocused) {
      if (this.props.isFocused) {
        this.input.focus();
      } else {
        this.input.blur();
      }
    }
  }

  handleFocus = () => {
    const { onChangeFocus } = this.props;
    onChangeFocus(true);
  };

  handleBlur = () => {
    const { onChangeFocus } = this.props;
    onChangeFocus(false);
  };

  // Handle Camera Button Press
  handlePressCamera = () => {
    this.setState(
      {
        modalVisible: true,
        modalMessage: 'Camera button pressed',
      },
      () => {
        // Start fade-in animation
        Animated.timing(this.state.fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }
    );
  };

  // Handle Location Button Press
  handlePressLocation = async () => {
    this.setState({
      modalVisible: true,
      modalMessage: 'Requesting location permission...',
    });

    // Request location permission
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Location permission is required to use this feature.');
      this.setState({
        modalMessage: 'Location permission denied. Please enable GPS/location in settings.',
      });
      return;
    }

    try {
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      this.setState({
        modalMessage: `Location retrieved: Latitude: ${latitude}, Longitude: ${longitude}`,
      });
    } catch (error) {
      Alert.alert('Error', 'Unable to retrieve location.');
      console.error(error);
    }
  };

  // Close the modal with fade-out animation
  closeModal = () => {
    Animated.timing(this.state.fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      this.setState({ modalVisible: false });
    });
  };

  render() {
    const { onPressCamera, onPressLocation } = this.props;
    const { text, modalVisible, modalMessage, fadeAnim } = this.state;

    return (
      <View style={styles.toolbar}>
        <ToolbarButton title={"📷"} onPress={this.handlePressCamera} />
        <ToolbarButton title={"📍"} onPress={this.handlePressLocation} />
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            underlineColorAndroid={"transparent"}
            placeholder={"Type something!"}
            blurOnSubmit={false}
            value={text}
            onChangeText={this.handleChangeText}
            onSubmitEditing={this.handleSubmitEditing}
            ref={this.setInputRef}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
          />
        </View>

        {/* Modal Popup for Camera and Location Messages */}
        <Modal
          transparent={true}
          visible={modalVisible}
          animationType="none" // Disable the default modal animation
          onRequestClose={this.closeModal}
        >
          <View style={styles.modalOverlay}>
            <Animated.View
              style={[styles.modalContainer, { opacity: fadeAnim }]} // Bind fadeAnim to opacity
            >
              <Text style={styles.modalText}>{modalMessage}</Text>
              {/* Close Button */}
              <TouchableOpacity onPress={this.closeModal} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </Modal>
      </View>
    );
  }
}

const ToolbarButton = ({ title, onPress }) => (
  <TouchableOpacity onPress={onPress}>
    <Text style={styles.button}>{title}</Text>
  </TouchableOpacity>
);

ToolbarButton.propTypes = {
  title: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: 'white',
  },
  button: {
    marginRight: 12,
    fontSize: 20,
    color: 'grey',
  },
  inputContainer: {
    flex: 1,
    justifyContent: 'center',
    marginLeft: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Transparent background
  },
  modalContainer: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 15,
  },
  closeButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
});
