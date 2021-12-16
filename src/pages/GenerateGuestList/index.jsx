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

    function printHTML(allGuests, tipo) {
        setLoading(true);
        Print.printAsync({
            html: makeHTML(allGuests, tipo)
        }).then(() => {
            setLoading(false)
        })
    }

    function compararAntiguidade(a, b) {
        return a.antiguidade - b.antiguidade;
    }

    function makeHTML(allGuests, tipo) {
        if (tipo === 's') {
            allGuests.sort(compararAntiguidade)
            let i = 0
            let html = `
            <head><title>Convidados presentes</title></head><div>
                <table style="border-collapse:collapse; width: 18cm; font-family: sans-serif;">
                    <caption style="font-size: 24px; font-weight: 600;">Autoridades presentes - Leitura S/3</caption>
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
                if (item.presente === 'sim' && item.leitura == 'sims3') {
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

        if (tipo === 'p') {
            allGuests.sort(compararAntiguidade)
            let i = 0
            let html = `
            <head><title>Convidados presentes</title></head><div>
                <table style="border-collapse:collapse; width: 18cm; font-family: sans-serif;">
                    <caption style="font-size: 24px; font-weight: 600;">Convidados autorizados a acessar o palanque</caption>
                    <thead>
                        <tr style="background: rgb(82, 192, 49);">
                            <th style="border: 1px solid black; padding: 2px 4px; text-align: center;">Nº assento</th>
                            <th style="border: 1px solid black; padding: 2px 4px; text-align: center;">Nome</th>
                            <th style="border: 1px solid black; padding: 2px 4px; text-align: center;">Representado por</th>
                            <th style="border: 1px solid black; padding: 2px 4px; text-align: center;">Cargo/ Função</th>
                        </tr>
                    </thead>
                    <tbody>`


            allGuests.forEach((item, index) => {
                if (item.presente === 'sim' && item.palanque == 'simpalanque') {
                    if (i == 3) { i = 6 }
                    if (i == 4) { i = 7 }
                    if (i == 5) { i = 8 }
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

            const footer = `</tbody></table><div>Quatitadade presente (contando os assentos 4, 5 e 6): ${i}</div></div>`
            return html + footer
        }
    }

    async function getGuests() {
        setLoading(true)
        await firebase.database().ref('guest').on('value', snapshot => {
            let guestList = []
            setGuests([])
            snapshot.forEach(itens => {
                let data = {
                    key: itens.key,
                    nomeCompleto: itens.val().nomeCompleto,
                    representante: itens.val().representante,
                    cargo: itens.val().cargo,
                    tipoConvidado: itens.val().tipoConvidado,
                    retrato: itens.val().retrato,
                    leitura: itens.val().leitura,
                    antiguidade: itens.val().antiguidade,
                    palanque: itens.val().palanque,
                    presente: itens.val().presente
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
                        <View style={{ width: '100%', flex: 1, justifyContent: 'center', alignItems: 'center' }} >
                            <SubmitButton style={{ width: '80%' }} onPress={() => { printHTML(guests, 's') }}>
                                <SubmitText>Relação de convidados - S/3</SubmitText>
                            </SubmitButton>
                            <SubmitButton style={{ width: '80%' }} onPress={() => { printHTML(guests, 'p') }}>
                                <SubmitText>Relação de convidados - Palanque</SubmitText>
                            </SubmitButton>
                        </View>
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


