import firebase from 'firebase';

var config = {
   /* write your firebase config */
};

firebase.initializeApp(config);
var fs = firebase.firestore();

const settings = {};
fs.settings(settings);

export const firestore = fs;
export const firebaseAuth = firebase.auth();
export const storage = firebase.storage().ref();
export default firebase;