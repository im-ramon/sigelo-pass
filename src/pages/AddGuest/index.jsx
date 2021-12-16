import React, { useState } from 'react';
import { View, Text, ImageBackground, StyleSheet, Image, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { AreaInput, CabecalhoPages, Background, Container, Input, Logo, SubmitButton, SubmitText, Link, LinkText, styles } from '../../styles/styles';
import { Ionicons, FontAwesome, MaterialIcons, Fontisto } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { style } from './style'
import { Picker } from '@react-native-picker/picker'
import firebase from '../../services/firebaseConnection'
import minhascores from '../../styles/colors';

export default function AddGuest() {

    const navigation = useNavigation();

    //dados do formulário: 
    const [nomeCompleto, setNomeCompleto] = useState('')
    const [representante, setRepresentante] = useState('')
    const [cargo, setCargo] = useState('')
    const [tipoConvidado, setTipoConvidado] = useState('autoridade')
    const [retrato, setRetrato] = useState('naoretrato')
    const [leitura, setLeitura] = useState('naos3')
    const [antiguidade, setAntiguidade] = useState('0')
    const [palanque, setPalanque] = useState('simpalanque')

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
                            setTipoConvidado('autoridade')
                            setRetrato('naoretrato')
                            setLeitura('naos3')
                            setAntiguidade('0')
                            setPalanque('naopalanque')
                        }
                    },
                    { text: "Página inicial", onPress: () => navigation.navigate('Home') },
                ],
                { cancelable: false }
            );
        }
    }

    async function insertNoFireBase(nomeCompleto, representante, cargo, tipoConvidado, retrato, leitura, antiguidade, palanque) {
        let database = firebase.database().ref('guest');
        let randomKey = database.push().key

        await database.child(randomKey).set({
            nomeCompleto: nomeCompleto || '-',
            representante: representante || '-',
            cargo: cargo || '-',
            tipoConvidado: tipoConvidado || '-',
            retrato: retrato || '-',
            leitura: leitura || '-',
            antiguidade: antiguidade || '0',
            palanque: palanque || '-',
            presente: 'nao',
        }).then((foo) => {
            alertFunc('success')
        }).catch(err => {
            alert(err)
        }).finally(() => {
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

                        <View style={style.areaInputPicker}>
                            <Fontisto name="persons" style={{ marginRight: 10, marginLeft: 28, fontSize: 16 }} color={minhascores.color5} />
                            <Picker
                                style={style.picker}
                                selectedValue={tipoConvidado}
                                onValueChange={(itemValue, itemIndex) =>
                                    setTipoConvidado(itemValue)
                                }>
                                <Picker.Item label="Autoridade" value="autoridade" />
                                <Picker.Item label="Convidado" value="convidado" />
                            </Picker>
                        </View>

                        <View style={style.areaInputPicker}>
                            <FontAwesome name="hand-stop-o" style={{ marginRight: 10, marginLeft: 28, fontSize: 18 }} color={minhascores.color5} />
                            <Picker
                                style={style.picker}
                                selectedValue={retrato}
                                onValueChange={(itemValue, itemIndex) =>
                                    setRetrato(itemValue)
                                }>
                                <Picker.Item label="Autorizado - Retrato" value="simretrato" />
                                <Picker.Item label="Não autorizado - Retrato" value="naoretrato" />
                            </Picker>
                        </View>
                        
                        <View style={style.areaInputPicker}>
                            <FontAwesome name="hand-stop-o" style={{ marginRight: 10, marginLeft: 28, fontSize: 18 }} color={minhascores.color5} />
                            <Picker
                                style={style.picker}
                                selectedValue={palanque}
                                onValueChange={(itemValue, itemIndex) =>
                                    setPalanque(itemValue)
                                }>
                                <Picker.Item label="Autorizado - Palanque" value="simpalanque" />
                                <Picker.Item label="Não autorizado - Palanque" value="naopalanque" />
                            </Picker>
                        </View>

                        <View style={style.areaInputPicker}>
                            <Ionicons name="newspaper-outline" style={{ marginRight: 10, marginLeft: 28, fontSize: 18 }} color={minhascores.color5} />
                            <Picker
                                style={style.picker}
                                selectedValue={leitura}
                                onValueChange={(itemValue, itemIndex) =>
                                    setLeitura(itemValue)
                                }>
                                <Picker.Item label="Será lido pelo S/3" value="sims3" />
                                <Picker.Item label="Não será lido pelo S/3" value="naos3" />
                            </Picker>
                        </View>

                        <AreaInput style={style.areaInput}>
                        <MaterialIcons name="format-list-numbered" size={22} color={minhascores.color5} style={{ marginLeft: 5 }} />
                            <Input
                                placeholder="Antiguidade"
                                autoCorrect={false}
                                autoCapitalize="sentences"
                                value={antiguidade}
                                onChangeText={text => setAntiguidade(text)}
                            />
                            <Ionicons name={representante.length > 1 ? "checkmark" : "close"} size={20} color={representante === '' ? "#00000000" : (representante.length > 1 ? minhascores.success : minhascores.danger)} style={{ marginLeft: 10 }} />
                        </AreaInput>


                        {loadingUpdate ?

                            (<View style={{ marginBottom: 50 }}><ActivityIndicator color={minhascores.color3} size={45} /></View>)
                            :
                            (
                                <SubmitButton style={style.btnEnviar} onPress={() => {
                                    if (nomeCompleto != '' && cargo != '') {
                                        setLoadingUpdate(true)
                                        insertNoFireBase(nomeCompleto, representante, cargo, tipoConvidado, retrato, leitura, antiguidade, palanque)
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