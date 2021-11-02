import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity } from 'react-native';
import { CabecalhoPages, SubmitButton, SubmitText } from '../../styles/styles'
import minhasCores from '../../styles/colors';
import firebase from 'firebase';
// import Lista from './Lista'
import * as Print from 'expo-print';

export default function GenerateGuestList() {

    const [loading, setLoading] = useState(false)
    const [guests, setGuests] = useState([])

    function printHTML(allGuests) {
        setLoading(true);
        Print.printAsync({
            html: makeHTML(allGuests)
        }).then(() => {
            setLoading(false)
        })
    }

    function makeHTML(allGuests) {
        let i = 0
        let html = `
            <head><title>Convidados presentes</title></head><div>
                <table style="border-collapse:collapse; width: 18cm; font-family: sans-serif;">
                    <caption style="font-size: 24px; font-weight: 600;">Convidados presentes</caption>
                    <thead>
                        <tr style="background: rgb(82, 192, 49);">
                            <th style="border: 1px solid black; padding: 2px 4px; text-align: center;">Ord.</th>
                            <th style="border: 1px solid black; padding: 2px 4px; text-align: center;">Nome</th>
                            <th style="border: 1px solid black; padding: 2px 4px; text-align: center;">Representado por</th>
                            <th style="border: 1px solid black; padding: 2px 4px; text-align: center;">Cargo/ Função</th>
                        </tr>
                    </thead>
                    <tbody>`


        allGuests.forEach((item, index) => {
            if (item.presente === 'sim') {
                // i++;
                html = html + `
                            <tr ${index % 2 == 0 && index !== 0 ? 'style="background: rgb(218, 218, 218);"' : ''}>
                            <td style="border: 1px solid black;padding: 2px 4px; text-align: center;">${++i}</td>
                            <td style="border: 1px solid black;padding: 2px 4px; text-align: left;">${item.nomeCompleto}</td>
                            <td style="border: 1px solid black;padding: 2px 4px; text-align: left;">${item.representante}</td>
                            <td style="border: 1px solid black;padding: 2px 4px; text-align: left;">${item.cargo}</td>
                            </tr>
                            `
            }
        })

        const footer = `</tbody></table><div>Quatitadade presente: ${i}</div></div>`
        return html + footer
    }

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
            setTimeout(() => {
                setLoading(false)
            }, 500);
        })
    }

    useEffect(() => {
        getGuests()
    }, [])


    return (
        <View style={localStyle.container}>
            <CabecalhoPages>Convidados presentes</CabecalhoPages>
            <View style={localStyle.btnArea}>
                {loading ? (<ActivityIndicator color={minhasCores.color3} size={45} />) :
                    (
                        <SubmitButton onPress={() => { printHTML(guests) }}>
                            <SubmitText>Imprimir relação de convidados</SubmitText>
                        </SubmitButton>
                    )}
            </View>
        </View>
    );
}

const localStyle = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    btnArea: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    flatList: {
        flex: 1,
        width: '100%',
        paddingHorizontal: 10,
    }
})


