import React, { useState, useEffect } from 'react';
import { TextInput, StyleSheet, View, Text } from 'react-native';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue } from 'firebase/database';
const firebaseConfig = {

  apiKey: "API_KEY",
  authDomain: "notezzz-dcd1c.firebaseapp.com",
  databaseURL: "https://notezzz-dcd1c-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "notezzz-dcd1c",
  storageBucket: "notezzz-dcd1c.appspot.com",
  messagingSenderId: "SENDER_ID",
  appId: "APP_ID",
  measurementId: "MEASURMENT_ID"

};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export default function App() {
  const [text, setText] = useState('');

  useEffect(() => {
    const textRef = ref(database, 'sharedText');
    onValue(textRef, (snapshot) => {
      const newText = snapshot.val() || '';
      setText(newText);
    });

    return () => {
      // Unsubscribe from changes on unmount
    };
  }, []);

  const handleTextChange = (newText) => {
    setText(newText);
    set(ref(database, 'sharedText'), newText);
  };

  return (
    <View style={styles.container}>
      <Text>Text Editor</Text>
      <TextInput
        style={styles.textInput}
        multiline
        value={text}
        onChangeText={handleTextChange}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  textInput: {
    height: 100,
    width: '100%',
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
  },
});
