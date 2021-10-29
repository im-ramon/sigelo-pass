import React, { useState } from 'react';
import { View, Text, ImageBackground, StyleSheet, Image, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { AreaInput, CabecalhoPages, Background, Container, Input, Logo, SubmitButton, SubmitText, Link, LinkText, styles } from '../../styles/styles';
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { style } from './style'
import { Picker } from '@react-native-picker/picker'
import firebase from '../../services/firebaseConnection'
import DateTimePicker from '@react-native-community/datetimepicker';
import minhascores from '../../styles/colors';

export default function AddGuest() {

    const navigation = useNavigation();

    //dados do formulário: 
    const [nomeCompleto, setNomeCompleto] = useState('')
    const [representante, setRepresentante] = useState('')
    const [cargo, setCargo] = useState('')
    const [modelo, setModelo] = useState('')
    const [placa, setPlaca] = useState('')
    const [observacoes, setObservacoes] = useState('')

    const [loadingUpdate, setLoadingUpdate] = useState(false)

    const regexPlate = /^[A-Za-z]{3}([0-9]{1}[A-Za-z]{1}[0-9]{2}|[0-9]{4}$)/
    const regexAllTexts = /[^A-Z a-z0-9]/gi

    function alertFunc(type) {
        if (type == 'erro') {
            Alert.alert(
                `Atenção!`,
                `Preencha os campos corretamente para continuar.\n\nTente novamente.`,
                [
                    { text: "Continuar", onPress: () => console.log('erro') }
                ],
                { cancelable: false }
            );
        }

        if (type == 'success') {
            Alert.alert(
                `Cadastro concluído`,
                `O convidado foi registrado!.\n`,
                [
                    {
                        text: "Inserir outro convidado", onPress: () => {
                            console.log('ToStay')
                            setNomeCompleto('')
                            setRepresentante('')
                            setCargo('')
                            setModelo('')
                            setPlaca('')
                            setObservacoes('')
                        }
                    },
                    { text: "Página inicial", onPress: () => navigation.navigate('Home') },
                ],
                { cancelable: false }
            );
        }
    }

    async function insertNoFireBase(nomeCompleto, representante, cargo, modelo, placa, observacoes) {
        let database = firebase.database().ref('guest');
        let randomKey = database.push().key

        await database.child(randomKey).set({
            nomeCompleto: nomeCompleto || '-', 
            representante: representante || '-', 
            cargo: cargo || '-', 
            modelo: modelo || '-', 
            placa: placa || '-', 
            observacoes: observacoes || '-',
            presente: 'nao',
        }).then((foo) => {
            alertFunc('success')
        }).catch(err => {
            alert(err)
        }).finally(()=>{
            setLoadingUpdate(false)
        })
    }


    return (
        <Background>
            <ImageBackground source={require('../../assets/background-light.jpg')} style={styles.image}>
                <Container>
                    <CabecalhoPages>Cadastrar convidados</CabecalhoPages>
                    <ScrollView style={style.containerScrollView}>

                        <AreaInput style={style.areaInput}>
                            <Ionicons name="person" size={20} color={minhascores.color5} style={{ marginLeft: 5 }} />
                            <Input
                                placeholder="Nome"
                                autoCorrect={false}
                                autoCapitalize="sentences"
                                value={nomeCompleto}
                                onChangeText={text => setNomeCompleto(text.replace(regexAllTexts, ''))}
                            />
                            <Ionicons name={nomeCompleto.length > 1 ? "checkmark" : "close"} size={20} color={nomeCompleto === '' ? "#00000000" : (nomeCompleto.length > 1 ? minhascores.success : minhascores.danger)} style={{ marginLeft: 10 }} />
                        </AreaInput>

                        <AreaInput style={style.areaInput}>
                            <MaterialIcons name="person-pin" size={22} color={minhascores.color5} style={{ marginLeft: 5 }} />
                            <Input
                                placeholder="Representante"
                                autoCorrect={false}
                                autoCapitalize="sentences"
                                value={representante}
                                onChangeText={text => setRepresentante(text.replace(regexAllTexts, ''))}
                            />
                            <Ionicons name={representante.length > 1 ? "checkmark" : "close"} size={20} color={representante === '' ? "#00000000" : (representante.length > 1 ? minhascores.success : minhascores.danger)} style={{ marginLeft: 10 }} />
                        </AreaInput>


                        <AreaInput style={style.areaInput}>
                            <MaterialIcons name="military-tech" size={22} color={minhascores.color5} style={{ marginLeft: 5 }} />
                            <Input
                                placeholder="Função/ Cargo"
                                autoCorrect={false}
                                autoCapitalize="sentences"
                                value={cargo}
                                onChangeText={text => setCargo(text.replace(regexAllTexts, ''))}
                            />
                            <Ionicons name={cargo.length > 1 ? "checkmark" : "close"} size={20} color={cargo === '' ? "#00000000" : (cargo.length > 1 ? minhascores.success : minhascores.danger)} style={{ marginLeft: 10 }} />
                        </AreaInput>

                        <AreaInput style={style.areaInput}>
                            <Ionicons name="car" size={20} color={minhascores.color5} style={{ marginLeft: 5 }} />
                            <Input
                                placeholder="Modelo do veículo"
                                autoCorrect={false}
                                autoCapitalize="sentences"
                                value={modelo}
                                onChangeText={text => setModelo(text)}
                            />
                            <Ionicons name={modelo.length > 1 ? "checkmark" : "close"} size={20} color={modelo === '' ? "#00000000" : (modelo.length > 1 ? minhascores.success : minhascores.danger)} style={{ marginLeft: 10 }} />
                        </AreaInput>

                        <AreaInput style={style.areaInput}>
                            <MaterialCommunityIcons name="scoreboard" size={20} color={minhascores.color5} style={{ marginLeft: 5 }} />
                            <Input
                                placeholder="Placa do veículo"
                                maxLength={7}
                                autoCorrect={false}
                                value={placa}
                                autoCapitalize='characters'
                                onChangeText={text => setPlaca(text.replace(regexAllTexts, '').toUpperCase())}
                            />
                            <Ionicons name={regexPlate.test(placa) ? "checkmark" : "close"} size={20} color={placa === '' ? '#00000000' : (regexPlate.test(placa) ? minhascores.success : minhascores.danger)} style={{ marginLeft: 10 }} />
                        </AreaInput>

                        <AreaInput style={style.areaInput}>
                            <Ionicons name="add" size={20} color={minhascores.color5} style={{ marginLeft: 5 }} />
                            <Input
                                placeholder="Observações"
                                autoCorrect={false}
                                autoCapitalize="sentences"
                                value={observacoes}
                                onChangeText={text => setObservacoes(text)}
                            />
                        </AreaInput>

                        {loadingUpdate ?

                            (<View style={{ marginBottom: 50 }}><ActivityIndicator color={minhascores.color3} size={45} /></View>)
                            :
                            (
                                <SubmitButton style={style.btnEnviar} onPress={() => {
                                    if (nomeCompleto != '' && cargo != '') {
                                        setLoadingUpdate(true)
                                        insertNoFireBase(nomeCompleto, representante, cargo, modelo, placa, observacoes)
                                    } else {
                                        alertFunc('erro')
                                    }
                                }}>
                                    <SubmitText>
                                        Enviar
                                    </SubmitText>
                                </SubmitButton>
                            )
                        }

                    </ScrollView>
                </Container>
            </ImageBackground>
        </Background >
    );
}