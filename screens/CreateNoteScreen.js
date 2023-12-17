import React, { useState, useEffect } from 'react';
import { View, TextInput, ScrollView, StyleSheet, Alert } from 'react-native';
import { ref, set, onValue, push } from 'firebase/database';
import database from '../firebaseConfig';
import { getDeviceId } from '../getDeviceId';

function CreateNoteScreen({ route, navigation }) {
  const [note, setNote] = useState({ title: '', content: '', editors: [] });
  const [noteId, setNoteId] = useState('');
  const [deviceId, setDeviceId] = useState('');
  const [sharedNoteDeviceId, setSharedNoteDeviceId] = useState(null);

  useEffect(() => {
    (async () => {
      const id = await getDeviceId();
      setDeviceId(id);

      if (route.params?.noteId) {
        setNoteId(route.params.noteId);
        listenToNoteChanges(route.params.noteId, id);
      } else if (route.params?.shareCode) {
        joinSharedNote(route.params.shareCode, id);
      } else {
        const newNoteId = await createNewNote(id);
        setNoteId(newNoteId);
        listenToNoteChanges(newNoteId, id);
      }
    })();
  }, [route.params]);

  const createNewNote = async (userId) => {
    const newNoteRef = push(ref(database, `notes/${userId}`));
    const newNote = { title: 'Ny Anteckning', content: '', editors: [userId] };
    await set(newNoteRef, newNote);
    return newNoteRef.key;
  };

  const joinSharedNote = async (code, userId) => {
    const notesRef = ref(database, 'notes');
    onValue(notesRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        let found = false;

        for (const deviceId in data) {
          for (const noteId in data[deviceId]) {
            const currentNote = data[deviceId][noteId];
            if (currentNote.shareCode === code) {
              found = true;
              updateNoteEditors(deviceId, noteId, currentNote, userId);
              setNoteId(noteId);
              setSharedNoteDeviceId(deviceId); // Store the device ID of the note creator
              listenToNoteChanges(noteId, deviceId);
              break;
            }
          }
          if (found) break;
        }

        if (!found) {
          Alert.alert("Error", "No note found with the given code.");
        }
      } else {
        Alert.alert("Error", "Unable to fetch notes.");
      }
    }, { onlyOnce: true });
  };

  const updateNoteEditors = (foundDeviceId, foundNoteId, note, userId) => {
    const editors = note.editors || [];
    if (!editors.includes(userId)) {
      editors.push(userId);
    }
    const noteRef = ref(database, `notes/${foundDeviceId}/${foundNoteId}`);
    set(noteRef, { ...note, editors });
  };

  const listenToNoteChanges = (noteId, userId) => {
    const noteRef = ref(database, `notes/${sharedNoteDeviceId || userId}/${noteId}`);
    onValue(noteRef, (snapshot) => {
      if (snapshot.exists()) {
        setNote(snapshot.val());
      }
    });
  };

  const handleTextChange = (text) => {
    const title = text.split('\n')[0] || 'Ny Anteckning';
    const lastEdited = new Date().toISOString(); // Get current timestamp
    const updatedNote = { ...note, title, content: text, editors: note.editors, lastEdited };

    setNote(updatedNote);
    if (note.editors) {
      note.editors.forEach(editorId => {
        const editorNoteRef = ref(database, `notes/${editorId}/${noteId}`);
        set(editorNoteRef, updatedNote);
      });
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        keyboardDismissMode="on-drag"
        onScrollBeginDrag={() => Keyboard.dismiss()}
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
  scrollView: {
    flex: 1,
  },
  input: {
    flex: 1,
    fontSize: 18,
  },
});

export default CreateNoteScreen;
