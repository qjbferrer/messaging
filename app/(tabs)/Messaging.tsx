import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import MessageList from '@/components/MessageList';
import { createImageMessage, createTextMessage } from '@/utils/MessageUtils';
import Status from '@/components/Status';
import Toolbar from '@/components/Toolbar';  // Import the Toolbar component


const App = () => {
 const [messages, setMessages] = useState([
   createImageMessage('https://unsplash.it/300/300'),
   createTextMessage('Testing'),
   createTextMessage('Joseph Bryan'),
   /*createLocationMessage({
       latitude: 37.78825,
       longitude: -122.4324,
   }),*/
 ]);
 const [isInputFocused, setInputFocused] = useState(false);  // Track if the input is focused


 const deleteMessage = (id) => {
   setMessages((prevMessages) => prevMessages.filter((message) => message.id !== id));
 };


 const handleSubmit = (text) => {
   // Add the new text message
   setMessages((prevMessages) => [createTextMessage(text), ...prevMessages]);
 };


 const handleChangeFocus = (isFocused) => {
   setInputFocused(isFocused);  // Update focus state
 };


 return (
   <SafeAreaView style={styles.container}>
     <Status />
     <MessageList messages={messages} onDeleteMessage={deleteMessage} />
     <View style={styles.toolbarContainer}>
       <Toolbar
         isFocused={isInputFocused}
         onSubmit={handleSubmit}
         onChangeFocus={handleChangeFocus}
         onPressCamera={() => {}}
         onPressLocation={() => {}}
       />
     </View>
   </SafeAreaView>
 );
};


const styles = StyleSheet.create({
 container: {
   flex: 1,
   backgroundColor: '#f0f0f0',
   padding: 16,
 },
 title: {
   fontSize: 24,
   fontWeight: 'bold',
   marginBottom: 16,
   textAlign: 'center',
 },
 toolbarContainer: {
   borderTopWidth: 1,
   borderColor: '#ccc',
   marginTop: 'auto',
 },
});


export default App;