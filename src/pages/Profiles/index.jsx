import React, { useState, useEffect, useContext } from 'react';
import { View, Text, ImageBackground, StyleSheet, Modal, ActivityIndicator, FlatList, TouchableOpacity } from 'react-native';
import { AreaInput, Background, Container, Input, Logo, SubmitButton, SubmitText, Link, LinkText, styles, CabecalhoPages } from '../../styles/styles';
import { Ionicons, MaterialCommunityIcons, MaterialIcons, AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { style } from './style'
import firebase from '../../services/firebaseConnection'
import Lista from './Lista'
import { AuthContext } from '../../contexts/auth';
import minhasCores from '../../styles/colors'
import { AppContext } from '../../contexts/appContexts';


export default function Profiles() {

    const [usersAuth, setUsersAuth] = useState([])
    const [usersNoAuth, setUsersNoAuth] = useState([])
    const [loadingList, setLoadingList] = useState(true)

    async function getUsersAuth() {
        firebase.database().ref('usersAuth').on('value', snapshot => {
            setLoadingList(true)
            let arrayUsers = []
            setUsersAuth([])
            snapshot.forEach(itens => {
                let data = {
                    key: itens.key,
                    email: itens.val().userEmail,
                    nome: itens.val().userName,
                    pass: true
                }
                arrayUsers.push(data)
            })
            setUsersAuth(arrayUsers)
            setLoadingList(false)
        })
    }
    async function getUsersNoAuth() {
        firebase.database().ref('tempUsers').on('value', snapshot => {
            setLoadingList(true)
            let arrayUsers = []
            setUsersNoAuth([])
            snapshot.forEach(itens => {
                let data = {
                    key: itens.key,
                    email: itens.val().userEmail,
                    nome: itens.val().userName,
                    pass: false
                }
                arrayUsers.push(data)
            })
            setUsersNoAuth(arrayUsers)
            setLoadingList(false)
        })
    }

    let users = usersAuth.concat(usersNoAuth)

    useEffect(() => {
        getUsersAuth()
        getUsersNoAuth()
    }, [])


    return (
        <Background>
            <ImageBackground source={require('../../assets/background-light.jpg')} style={styles.image}>
                
                <Container>
                    <CabecalhoPages>Gerenciar usuários</CabecalhoPages>
                    <View style={localStyle.flatListConteiner}>
                    {
                        loadingList ?

                            (<ActivityIndicator color={minhasCores.color3} size={45} />)
                            :
                            users.length == 0 ?
                                (
                                    <Text style={{ color: '#dedede', fontSize: 20, textAlign: 'center' }}>Não há usuários registrados.</Text>
                                )
                                :
                                (
                                    <FlatList
                                        keyExtractor={item => item.key}
                                        data={users}
                                        style={localStyle.flatList}
                                        renderItem={({ item }) => (<Lista data={item} />)}
                                    />
                                )
                    }
                     </View>
                </Container>
            </ImageBackground>
        </Background>
    );
}

const localStyle = StyleSheet.create({
    flatListConteiner: {
        width: '85%',
        flex: 1,
        justifyContent: 'center'
    },
    flatList: {
        width: '100%',
        flex: 1,
    }
})