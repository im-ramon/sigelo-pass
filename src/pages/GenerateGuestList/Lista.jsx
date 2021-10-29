import React, { useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons';
import minhasCores from '../../styles/colors'

export default function Lista({ data }) {
    return (
        data.presente == 'sim' && (
            <View style={localStyle.container}>
                <View style={localStyle.guestDataArea}>
                    <Text style={localStyle.textFit}>Convidado: <Text style={localStyle.textStrong}>{`${data.nomeCompleto}`}</Text></Text>
                    <Text style={localStyle.textFit}>Representado por: <Text style={localStyle.textStrong}>{data.representante}</Text></Text>
                    <Text style={localStyle.textFit}>Cargo/ Função: <Text style={localStyle.textStrong}>{data.cargo}</Text></Text>
                    <Text style={localStyle.textFit}>Observações: <Text style={localStyle.textStrong}>{data.observacoes}</Text></Text>
                </View>

                <View style={localStyle.guestIconArea}>
                    <MaterialIcons name="verified" size={64} color={minhasCores.success} />
                </View>
            </View >
        )
    )
}

const localStyle = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: minhasCores.dark_soft,
        width: '100%',
        flexDirection: 'row',
        marginBottom: 10,
        paddingHorizontal: 25,
        paddingVertical: 10,
        borderColor: '#cacaca',
        borderWidth: 2,
        borderStyle: 'dashed',
        borderRadius: 15,
    },
    guestDataArea: {
        flex: 4,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    guestIconArea: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textStrong: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    textFit: {
        fontSize: 16,
        fontWeight: 'normal',
    }
})
