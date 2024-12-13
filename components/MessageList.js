import React from 'react';
import PropTypes from 'prop-types';
import {
  FlatList,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
  BackHandler,
} from 'react-native';
import MapView from 'expo';
import { MessageShape } from '@/utils/MessageUtils';

export default class MessageList extends React.Component {
  static propTypes = {
    messages: PropTypes.arrayOf(MessageShape).isRequired,
    onDeleteMessage: PropTypes.func.isRequired,
  };

  state = {
    fullscreenImageUri: null, // Store URI for fullscreen image
  };

  keyExtractor = (item) => item.id.toString();

  handlePressMessage = (item) => {
    if (item.type === 'text') {
      // Show Alert for text message
      Alert.alert(
        'Delete Message',
        'Are you sure you want to delete this message?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Delete', style: 'destructive', onPress: () => this.handleDeleteMessage(item.id) },
        ],
        { cancelable: true }
      );
    } else if (item.type === 'image') {
      // Show fullscreen image
      this.setState({ fullscreenImageUri: item.uri });
    }
  };

  handleDeleteMessage = (id) => {
    const { onDeleteMessage } = this.props;
    onDeleteMessage(id); // Call the parent's delete function
  };

  handleCloseFullscreen = () => {
    this.setState({ fullscreenImageUri: null });
  };

  handleBackPress = () => {
    if (this.state.fullscreenImageUri) {
      this.handleCloseFullscreen();
      return true; // Prevent default back action
    }
    return false;
  };

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

  renderMessageItem = ({ item }) => (
    <View style={styles.messageRow}>
      <TouchableOpacity onPress={() => this.handlePressMessage(item)}>
        {this.renderMessageBody(item)}
      </TouchableOpacity>
    </View>
  );

  renderMessageBody = ({ type, text, uri, coordinate }) => {
    switch (type) {
      case 'text':
        return (
          <View style={styles.messageBubble}>
            <Text style={styles.messageText}>{text}</Text>
          </View>
        );
      case 'image':
        return <Image style={styles.image} source={{ uri }} />;
      case 'location':
        return (
          <MapView
            style={styles.map}
            initialRegion={{
              ...coordinate,
              latitudeDelta: 0.08,
              longitudeDelta: 0.04,
            }}
          >
            <MapView.Marker coordinate={coordinate} />
          </MapView>
        );
      default:
        return null;
    }
  };

  renderFullscreenImage = () => {
    const { fullscreenImageUri } = this.state;
    if (!fullscreenImageUri) return null;

    return (
      <Modal
        visible
        transparent={false}
        onRequestClose={this.handleCloseFullscreen}
      >
        <View style={styles.fullscreenContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={this.handleCloseFullscreen}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
          <Image style={styles.fullscreenImage} source={{ uri: fullscreenImageUri }} />
        </View>
      </Modal>
    );
  };

  render() {
    const { messages } = this.props;
    return (
      <>
        <FlatList
          style={styles.container}
          inverted
          data={messages}
          renderItem={this.renderMessageItem}
          keyExtractor={this.keyExtractor}
          keyboardShouldPersistTaps="handled"
        />
        {this.renderFullscreenImage()}
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'visible',
    paddingRight: 10,
  },
  messageRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginLeft: 60,
  },
  messageBubble: {
    backgroundColor: 'skyblue',
    padding: 10,
    borderRadius: 15,
    marginVertical: 5,
  },
  messageText: {
    color: 'white',
  },
  image: {
    width: 250,
    height: 250,
    borderRadius: 15,
    marginVertical: 5,
  },
  map: {
    width: 100,
    height: 100,
    borderRadius: 15,
    marginVertical: 5,
  },
  fullscreenContainer: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
});
