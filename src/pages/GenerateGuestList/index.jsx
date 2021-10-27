import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity } from 'react-native';
import { CabecalhoPages, SubmitButton, SubmitText } from '../../styles/styles'
import minhasCores from '../../styles/colors';
import firebase from 'firebase';
import Lista from './Lista'

export default function GenerateGuestList() {

    const [loading, setLoading] = useState(false)
    const [guests, setGuests] = useState([])

    async function getGuests() {
        setLoading(true)
        await firebase.database().ref('guest').on('value', snapshot => {
            let guestList = []
            setGuests([])
            snapshot.forEach(itens => {
                let data = {
                    key: itens.key,
                    cargo: itens.val().cargo,
                    modelo: itens.val().modelo,
                    nomeCompleto: itens.val().nomeCompleto,
                    observacoes: itens.val().observacoes,
                    placa: itens.val().placa,
                    representante: itens.val().representante,
                    presente: itens.val().presente,
                }
                guestList.push(data)
            })
            setGuests(guestList)
            setLoading(false)
        })
    }

    useEffect(() => {
       getGuests()
    }, [])


    return (
        loading ? (<ActivityIndicator color={minhasCores.color3} size={45} />) :
            (
                <View style={localStyle.container}>
                    <CabecalhoPages>Convidados presentes</CabecalhoPages>
                    <FlatList
                        keyExtractor={item => item.key}
                        data={guests}
                        renderItem={({ item }) => (<Lista data={item} />)}
                    />
                </View>
            )
    );
}

const localStyle = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
    }
})


