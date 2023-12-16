import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {

  apiKey: "xxxx",
  authDomain: "notezzz-dcd1c.firebaseapp.com",
  databaseURL: "https://notezzz-dcd1c-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "notezzz-dcd1c",
  storageBucket: "notezzz-dcd1c.appspot.com",
  messagingSenderId: "xxxx",
  appId: "xxxx",
  measurementId: "xxxxN"

};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export default database;
