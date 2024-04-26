import { auth } from "./Firebase";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithPopup,
  updatePassword,
  signInWithEmailAndPassword,
  updateProfile,
  reload,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

export const checkUserLoggedIn = () => {
  return auth.currentUser == null;
};

export const updateUser = (name, password) => {
  // Actualizar la información del usuario
  var user = auth.currentUser;
  user
    .updateProfile({
      displayName: name,
      photoURL: "URL de la nueva foto de perfil",
    })
    .then(function () {
      console.log("Información de usuario actualizada exitosamente");
    })
    .catch(function (error) {
      console.error("Error al actualizar la información del usuario:", error);
    });

  user
    .updatePassword(password)
    .then(function () {
      // Actualización exitosa
      console.log("Contraseña del usuario actualizada exitosamente");
    })
    .catch(function (error) {
      // Ocurrió un error al actualizar la contraseña del usuario
      console.error("Error al actualizar la contraseña del usuario:", error);
    });
};

export const doCreateUserWithEmailAndPassword = async (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const registerUser = async (name, email, password) => {
  if (!email || !password) return;
  /*
  createUserWithEmailAndPassword(auth, email, password).then(
    async (userCredential) => {
      //  ^^^^^ async function
      // Signed in
      const user = userCredential.user;

      // Updating user name
      await updateProfile(auth.currentUser, {
        displayName: name,
        photoURL: "https://robohash.org/2?set=set2",
      });
    }
  );
*/
  try {
    // Crear usuario y obtener credencial
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    console.log("1");
    if (userCredential && auth.currentUser) {
      console.log("2");
      updateProfile(auth.currentUser, {
        displayName: name,
        photoURL: "https://robohash.org/2?set=set2",
      });
      signOut(auth);
      await doSignInWithEmailAndPassword(email, password);

      return userCredential;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const doSignInWithEmailAndPassword = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const doSignInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  //result.user
  return result;
};

export const doSignOut = () => {
  return auth.signOut();
};

export const doPasswordReset = (email) => {
  return sendPasswordResetEmail(auth, email);
};

export const doPasswordChange = (password) => {
  return updatePassword(auth.currentUser, password);
};

export const doSendEmailVerification = () => {
  return sendEmailVerification(auth.currentUser, {
    url: `${window.location.origin}/home`,
  });
};
