import React, { createContext, useState, useEffect } from 'react';
import { Alert } from 'react-native';
import firebase from '../services/firebaseConnection';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext({});

function AuthProvider({ children }) {

    const [user, setUser] = useState(false);
    const [loading, setLoading] = useState(true)
    const [authorized, setAuthorized] = useState(false)

    function cathError(error) {
        Alert.alert(
            `Ocorreu um erro.`,
            `Verifique os dados digitados e tente novamente.\n\nDescrição do erro:${error}`,
            `Verifique os dados digitados e tente novamente.\n\nCertamente o seu cadastro ainda não foi aprovado. Aguarde a aprovação pelo administrador do evento para prosseguir.`,
            [
                { text: "Verificar", onPress: () => console.log('erro') }
            ],
            { cancelable: false }
        );
    }

    useEffect(() => {
        async function loadStorage() {
            const storageUser = await AsyncStorage.getItem('Auth_user');

            if (storageUser) {
                setUser(JSON.parse(storageUser))
                setLoading(false)
            }
            setLoading(false)
        }

        loadStorage()
    }, [])

    //login
    async function signIn(email, password, keepConnected) {
        setLoading(true)
        await firebase.auth().signInWithEmailAndPassword(email, password)
            .then(async (value) => {
                let uid = value.user.uid;
                await firebase.database().ref('usersAuth').child(uid).once('value')
                    .then((snapshot) => {
                        let data = {
                            uid,
                            nome: snapshot.val().userName,
                            email: snapshot.val().userEmail,
                        };
                        setUser(data);
                        keepConnected && storageUser(data)
                        setLoading(false)
                    })
            })
            .catch((error) => {
                cathError(error)
                setLoading(false)
            })
    }

    //cadastrar usuário
    async function signUp(userEmail, userName, userPassword) {
        await firebase.auth().createUserWithEmailAndPassword(userEmail, userPassword)
            .then(async (value) => {
                let uid = value.user.uid;
                await firebase.database().ref('tempUsers').child(uid).set({
                    userEmail, userName
                })
                    .catch((error) => {
                        alert(error.code)
                    })
            })
    }

    async function storageUser(data) {
        await AsyncStorage.setItem('Auth_user', JSON.stringify(data))
    }

    async function signOut() {
        await firebase.auth().signOut();
        await AsyncStorage.clear()
            .then(() => {
                setUser(null);
            })
    }

    return (
        <AuthContext.Provider value={{ signed: !user, user, loading, signUp, signIn, signOut, setLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;