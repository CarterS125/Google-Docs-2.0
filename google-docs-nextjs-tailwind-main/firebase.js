import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyAUmp_XROy14VqDUnLy0TfvO7EUn7R2ydc",
  authDomain: "docs-clone-257b8.firebaseapp.com",
  projectId: "docs-clone-257b8",
  storageBucket: "docs-clone-257b8.appspot.com",
  messagingSenderId: "297693853265",
  appId: "1:297693853265:web:92782c2d419e9c29766a70",
};

const app = !firebase.apps.length
  ? firebase.initializeApp(firebaseConfig)
  : firebase.app();

const db = app.firestore();

export { db };
