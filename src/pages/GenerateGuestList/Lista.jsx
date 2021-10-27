import React, { useState, useContext } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, ActivityIndicator, Alert, Switch } from 'react-native'
import { Ionicons, MaterialCommunityIcons, MaterialIcons, AntDesign } from '@expo/vector-icons';
import { AreaInput, Background, Container, Input, Logo, SubmitButton, SubmitText, Link, LinkText, CabecalhoPages } from '../../styles/styles';
import minhasCores from '../../styles/colors'
import * as Print from 'expo-print';

export default function Lista({ data }) {

    const [loading, setLoading] = useState(false)

    function makeHTML() {
        const tamanhoQRCode = 500
        let HTML = `
            <div style="display: flex; padding: 1em; width: 21cm; flex-wrap: wrap;">
                <div style="width: 30%; display: flex; justify-content: center; align-items: center; flex-direction: column; border: 3px dashed #00000030; margin: .2em;">
                    <img src="https://chart.googleapis.com/chart?chs=${tamanhoQRCode}x${tamanhoQRCode}&cht=qr&chl=${key}" width="100%">
                    <div style="display: flex; justify-content: center; align-items: center; flex-direction: column; background-color: #00000015; width: 100%;">
                        <p style="line-height: 0cm;">${nomeCompleto}</p>
                    </div>
                </div>
            </div>
            `
        return HTML
    }

    return (
        data.presente == 'sim' && (
            <View style={localStyle.container}>
                <Text>{`${data.nomeCompleto}`}</Text>
                <Text>Representado por: <Text>{data.representante}</Text></Text>
                <Text>Cargo/ Função: <Text>{data.cargo}</Text></Text>
                <Text>Veículo: <Text>{data.modelo}</Text></Text>
                <Text>Placa: <Text>{data.placa}</Text></Text>
                <Text>Observações: <Text>{data.observacoes}</Text></Text>
            </View >
        )
    )
}

const localStyle = StyleSheet.create({
    container: {
        backgroundColor: minhasCores.success,
        marginBottom: 10,
    },
})
