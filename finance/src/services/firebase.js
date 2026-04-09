// Importa as funções principais do Firebase
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: COLOQUE AS SUAS CHAVES AQUI (As que o Firebase gerou no Passo 2)
const firebaseConfig = {
  apiKey: "AIzaSyCFbNX83uY8j1GvrE5hydO3nsRSmEFI6ok",
  authDomain: "finance-4e162.firebaseapp.com",
  projectId: "finance-4e162",
  storageBucket: "finance-4e162.firebasestorage.app",
  messagingSenderId: "567138641102",
  appId: "1:567138641102:web:17870ac3d0343a488ddc9f"
};


// Inicializa o Firebase no seu App
const app = initializeApp(firebaseConfig);

// Exporta as ferramentas prontas para usarmos na tela de Login e Dashboard
export const auth = getAuth(app);
export const db = getFirestore(app);
