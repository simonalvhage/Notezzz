import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { ref, onValue, set, remove } from 'firebase/database';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import database from '../firebaseConfig';
import { getDeviceId } from '../getDeviceId';

function NotesListScreen({ navigation }) {
  const [notes, setNotes] = useState([]);
  const [deviceId, setDeviceId] = useState('');

  useEffect(() => {
    (async () => {
      const id = await getDeviceId();
      setDeviceId(id);
    })();

    if (deviceId) {
      const notesRef = ref(database, `notes/${deviceId}`);
      onValue(notesRef, (snapshot) => {
        const data = snapshot.val();
        const loadedNotes = [];
        for (const key in data) {
          loadedNotes.push({ id: key, ...data[key] });
        }
        setNotes(loadedNotes);
      });
    }
  }, [deviceId]);

  const generateShareCode = () => {
    const words = [
      "Tree", "Bird", "Book", "Rain", "Star", 
      "Fish", "Leaf", "Rock", "Cloud", "Moon", 
      "Sun", "Fire", "Ice", "Snow", "Wind", 
      "Sand", "Wave", "Stream", "Leaf", "Stone"
    ];
    return words[Math.floor(Math.random() * words.length)] + " " +
           words[Math.floor(Math.random() * words.length)];
  };

  const handleShare = (noteId, note) => {
    const shareCode = generateShareCode();
    const noteRef = ref(database, `notes/${deviceId}/${noteId}`);
    set(noteRef, { ...note, shareCode });

    Alert.alert("Dela Anteckning", `Din delningskod: ${shareCode}`);
  };

  const handleNotePress = (noteId, note) => {
    navigation.navigate('CreateNote', { noteId, note });
  };

  const handleEnterInvitationCode = () => {
    // För iOS
    Alert.prompt(
      "Ange Inbjudningskod",
      "Skriv in den två-ordiga koden för att gå med i en delad anteckning.",
      [
        {
          text: "Avbryt",
          style: "cancel"
        },
        {
          text: "OK",
          onPress: (code) => navigation.navigate('CreateNote', { shareCode: code }),
        }
      ],
      "plain-text"
    );

    // För Android, använd en custom modal eller dialog
  };

  const handleDelete = (noteId) => {
    Alert.alert(
      "Radera Anteckning",
      "Är du säker på att du vill radera denna anteckning?",
      [
        { text: "Avbryt" },
        { text: "Radera", onPress: () => deleteNote(noteId) }
      ]
    );
  };

  const deleteNote = (noteId) => {
    const noteRef = ref(database, `notes/${deviceId}/${noteId}`);
    remove(noteRef);
  };

  const handleOptions = (noteId, note) => {
    Alert.alert(
      "Alternativ",
      "Välj ett alternativ",
      [
        { text: "Avbryt" },
        { text: "Radera", onPress: () => handleDelete(noteId) },
        { text: "Dela", onPress: () => handleShare(noteId, note) }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {notes.map((note) => (
          <View key={note.id} style={styles.note}>
            <TouchableOpacity
              style={styles.noteContent}
              onPress={() => handleNotePress(note.id, note)}
            >
              <Text style={styles.titleText}>{note.title}</Text>
              <Text style={styles.dateText}>
      Last edited: {note.lastEdited ? new Date(note.lastEdited).toLocaleString() : 'N/A'}
    </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleOptions(note.id, note)} style={styles.deleteButton}>
              <Text style={styles.deleteText}>•••</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('CreateNote')}
      >
        <MaterialCommunityIcons name="plus" size={24} color="white" />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.invitationButton}
        onPress={handleEnterInvitationCode}
      >
        <Text style={styles.invitationButtonText}>Got Invitation Code</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  note: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  noteContent: {
    flex: 1,
  },
  titleText: {
    fontSize: 18,
  },
  dateText: {
    fontSize: 12,
    color: 'grey',
  },
  deleteText: {
    color: 'black',
  },
  fab: {
    position: 'absolute',
    width: 70,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
    right: 20,
    bottom: 40,
    backgroundColor: '#007bff',
    borderRadius: 40,
    elevation: 8,
  },
});

export default NotesListScreen;
