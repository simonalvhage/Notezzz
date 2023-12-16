import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { ref, set, push } from 'firebase/database';
import database from './firebaseConfig';
import { getDeviceId } from './getDeviceId';
import { ScrollView, Keyboard } from 'react-native';

function CreateNoteScreen({ route, navigation }) {
  const [note, setNote] = useState({ title: '', content: '' });
  const [noteId, setNoteId] = useState('');
  const [deviceId, setDeviceId] = useState('');

  useEffect(() => {
    (async () => {
      const id = await getDeviceId();
      setDeviceId(id);

      // Hantera redigering av befintlig anteckning
      if (route.params?.noteId) {
        setNoteId(route.params.noteId);
        setNote(route.params.note);
      } else {
        // Skapa en ny anteckning
        const newNoteRef = push(ref(database, `notes/${id}`));
        setNoteId(newNoteRef.key);
      }
    })();
  }, [route.params]);

  useEffect(() => {
    if (deviceId && noteId) {
      set(ref(database, `notes/${deviceId}/${noteId}`), note);
    }
  }, [note, deviceId, noteId]);

  const handleTextChange = (text) => {
    const title = text.split('\n')[0];
    const currentTime = new Date().toISOString(); // ISO-format på tiden
    setNote({ title, content: text, lastEdited: currentTime });
  };
  

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        keyboardDismissMode="on-drag" // Denna prop får tangentbordet att försvinna när användaren drar
        onScrollBeginDrag={Keyboard.dismiss} // Denna rad får tangentbordet att dra sig tillbaka vid skrollning
      >
        <TextInput
          style={styles.input}
          placeholder="Skriv din anteckning..."
          multiline
          value={note.content}
          onChangeText={handleTextChange}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  input: {
    flex: 1,
    fontSize: 18,
  },
});

export default CreateNoteScreen;
