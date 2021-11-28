import {createContext, useContext, useEffect, useState} from 'react';
import {auth, db} from '../firebase'

// export const AuthContext = createContext({
//   token: null,
//   userId: null,
// })

const AuthContext = createContext({
  currentUser: null,
  signUp: null,
  signIn: null,
  signOut: null,
  passwordReset: null,
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);
  const signUp = (email, password, name, surname) => {
    return new Promise(function (resolve, reject) {
      auth
        .createUserWithEmailAndPassword(email, password)
        .then((ref) => {
          ref.user.updateProfile({
            displayName: `${name} ${surname}`,
          });

          return ref.user;
        })
        .then((user) => {
          db.collection("users").doc(user.uid).set({
            role: "user",
            name,
            surname,
          }).then(r => {
            console.log('result', r);
            resolve(r);
          })
        })
        .catch((error) => reject(error));
    });
  };
  const signIn = (email, password) => {
    let promise = new Promise(function (resolve, reject) {
      auth
        .signInWithEmailAndPassword(email, password)
        .then((ref) => {
          resolve(ref);
        })
        .catch((error) => {
          reject(error);
        });
    });
    return promise;
  };
  const signOut = () => {
    return auth.signOut();
  };
  const passwordReset = (email) => {
    return new Promise(function (resolve, reject) {
      auth
        .sendPasswordResetEmail(email)
        .then(() => {
          resolve(`Password Reset Email sent to ${email}`);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  useEffect(() => {
    return auth.onAuthStateChanged((user) => {
      if (user) {
        db.collection('users').doc(user.uid).get()
          .then((doc) => {
            const userInfo = {...auth.currentUser.providerData[0], ...doc.data()};
            console.log('setCurrentUser userInfo', userInfo);
            setCurrentUser(userInfo);
            setLoading(false);
          })
          .catch((e) => {
            console.log('userInfo error', e);
          });

      } else {
        setCurrentUser(user);
        setLoading(false);
      }
    });
  }, []);
  const value = {
    currentUser,
    signUp,
    signIn,
    signOut,
    passwordReset
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
