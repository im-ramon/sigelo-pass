import React, { useState, useContext } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, ActivityIndicator, Alert, Switch } from 'react-native'
import { Ionicons, FontAwesome, AntDesign, MaterialIcons, Fontisto } from '@expo/vector-icons';
import { AreaInput, Background, Container, Input, Logo, SubmitButton, SubmitText, Link, LinkText, CabecalhoPages } from '../../styles/styles';
import { style } from './style'
import firebase from '../../services/firebaseConnection';
import { AppContext } from '../../contexts/appContexts';
import minhasCores from '../../styles/colors'
import { Picker } from '@react-native-picker/picker'
import * as Print from 'expo-print';

export default function Lista({ data }) {

    const { pageName } = useContext(AppContext);

    const [modalActive, setModalActive] = useState(false)
    const [loadingUpdate, setLoadingUpdate] = useState(false)
    const [textoResposta, setTextoResposta] = useState('Atualizar')
    const [btnCor, setBtnCor] = useState(minhasCores.color3)
    const [loadingQR, setLoadingQR] = useState(false)

    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);

    //Dados do formulário: 
    const [key, setKey] = useState(data.key)
    const [nomeCompleto, setNomeCompleto] = useState(data.nomeCompleto)
    const [representante, setrepresentante] = useState(data.representante)
    const [cargo, setCargo] = useState(data.cargo)
    const [tipoConvidado, setTipoConvidado] = useState(data.tipoConvidado)
    const [retrato, setRetrato] = useState(data.retrato)
    const [leitura, setLeitura] = useState(data.leitura)
    const [antiguidade, setAntiguidade] = useState(data.antiguidade)
    const [presente, setPresente] = useState(data.presente)

    const regexPlate = /^[A-Za-z]{3}([0-9]{1}[A-Za-z]{1}[0-9]{2}|[0-9]{4}$)/
    const regexAllTexts = /[^A-Z a-z0-9]/gi

    const alertFill = () => {
        Alert.alert(
            "Atenção!",
            `Preencha corretamente todos os campos para continuar.`,
            [
                {
                    text: "Continuar",
                    onPress: () => { },
                    style: "cancel"
                },
            ],
            { cancelable: false }
        );
    }


    const openConfirmDelete = () =>
        Alert.alert(
            "Atenção!",
            `Você deletará PERMANENTEMENTE o registro.\nNão será possível recuperar o QR Code do convite.\n\nDeseja continuar?`,
            [
                {
                    text: "Voltar",
                    onPress: () => { },
                    style: "cancel"
                },
                {
                    text: "Excluir",
                    onPress: () => { deleteOnFirebase(data.key) },
                    style: "cancel"
                }
            ],
            { cancelable: false }
        );

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

    async function updateOnFirebase(key, nomeCompleto, representante, cargo, tipoConvidado, retrato, leitura, antiguidade) {
        setLoadingUpdate(true)
        await firebase.database().ref('guest').child(key).update({ nomeCompleto, representante, cargo, tipoConvidado, retrato, leitura, antiguidade })
            .then(() => {
                setLoadingUpdate(false)
                setBtnCor(`${minhasCores.success}`)
                setTextoResposta('Atualizado')

                setTimeout(() => {
                    setModalActive(false)
                }, 300);
            });
    }

    async function deleteOnFirebase(key) {
        await firebase.database().ref('guest').child(key).remove()
            .then(() => {
                Alert.alert(
                    "Concluído!",
                    `Registro deletado com sucesso do banco de dados.`,
                    [
                        {
                            text: "Continuar",
                            onPress: () => console.log("Continue"),
                            style: "cancel"
                        },
                    ],
                    { cancelable: true }
                );
            });
    }

    return (
        <View style={LocalStyle.container}>

            <View style={LocalStyle.sectionGuestData}>
                <Text style={LocalStyle.textSimples}>Nome: <Text style={LocalStyle.textDestaque}>{`${data.nomeCompleto}`}</Text></Text>
                <Text style={LocalStyle.textSimples}>Representado por: <Text style={LocalStyle.textDestaque}>{data.representante}</Text></Text>
                <Text style={LocalStyle.textSimples}>Cargo/ Função: <Text style={LocalStyle.textDestaque}>{data.cargo}</Text></Text>
                <Text style={LocalStyle.textSimples}>---------------------------------------------------------------------</Text>
                <Text style={LocalStyle.textSimples}>Tipo de convidado: <Text style={LocalStyle.textDestaque}>{data.tipoConvidado == 'autoridade' ? 'Autoridade' : 'Convidado'}</Text></Text>
                <Text style={LocalStyle.textSimples}>Antiguidade: <Text style={LocalStyle.textDestaque}>{data.antiguidade}</Text></Text>
                <Text style={LocalStyle.textSimples}>Leitura pelo S/3: <Text style={LocalStyle.textDestaque}>{data.leitura == 'sims3' ? 'Sim' : 'Não'}</Text></Text>
                <Text style={LocalStyle.textSimples}>Autorizado retrato: <Text style={LocalStyle.textDestaque}>{data.retrato == 'simretrato' ? 'Sim' : 'Não'}</Text></Text>
                <View style={{ ...LocalStyle.textSimplesPresenteArea, backgroundColor: data.presente == 'sim' ? minhasCores.success_light : minhasCores.warning_light }}>
                    <Text style={LocalStyle.textSimplesPresente}>
                        {data.presente == 'sim' ? 'Convidado presente' : 'Convidado ainda não chegou'}
                    </Text>
                    {data.presente == 'sim' ? (<AntDesign name="checkcircleo" size={24} color="black" style={LocalStyle.textSimplesPresenteIcon} />) : (<AntDesign name="closecircleo" style={LocalStyle.textSimplesPresenteIcon} size={24} color="black" />)}
                </View>
            </View>

            <View style={LocalStyle.footer}>
                <TouchableOpacity style={LocalStyle.btnEdit} onPress={() => { setBtnCor(minhasCores.color3); setTextoResposta('Atualizar'); setModalActive(true); }}>
                    <AntDesign name="edit" size={24} color="black" />
                </TouchableOpacity>

                <TouchableOpacity style={LocalStyle.btnDelete} onPress={() => { openConfirmDelete() }}>
                    <Ionicons name="ios-trash-outline" size={24} color="black" />
                </TouchableOpacity>

                {pageName === 'allGuests' &&

                    (<TouchableOpacity style={LocalStyle.btnQRCOde} onPress={() => {
                        setLoadingQR(true);
                        Print.printAsync({
                            html: makeHTML()
                        }).then(() => { setLoadingQR(false) })
                    }}>
                        {(loadingQR ? <ActivityIndicator color={'#fff'} size={24} /> : <AntDesign name="qrcode" size={24} color="#fff" />)}
                    </TouchableOpacity>)

                }
            </View>

            <Modal animationType="slide" visible={modalActive} >
                <View style={styleModal.modalContainer}>

                    <View style={styleModal.header}>
                        <TouchableOpacity onPress={() => { setModalActive(false) }}>
                            <Ionicons name="close-circle-sharp" size={32} color={minhasCores.danger} />
                        </TouchableOpacity>
                    </View>


                    <View style={styleModal.modalBody}>

                        <Container>
                            <CabecalhoPages>Editar cadastro</CabecalhoPages>
                            <ScrollView style={style.containerScrollView} showsVerticalScrollIndicator={false}>

                                <AreaInput style={style.areaInput}>
                                    <Ionicons name="person" size={20} color={minhasCores.color5} style={{ marginLeft: 5 }} />
                                    <Input
                                        placeholder="Nome"
                                        autoCorrect={false}
                                        autoCapitalize="sentences"
                                        value={nomeCompleto}
                                        onChangeText={text => setNomeCompleto(text.replace(regexAllTexts, ''))}
                                    />
                                    <Ionicons name={nomeCompleto.length > 1 ? "checkmark" : "close"} size={20} color={nomeCompleto === '' ? "#00000000" : (nomeCompleto.length > 1 ? minhasCores.success : minhasCores.danger)} style={{ marginLeft: 10 }} />
                                </AreaInput>

                                <AreaInput style={style.areaInput}>
                                    <MaterialIcons name="person-pin" size={22} color={minhasCores.color5} style={{ marginLeft: 5 }} />
                                    <Input
                                        placeholder="Representante"
                                        autoCorrect={false}
                                        autoCapitalize="sentences"
                                        value={representante}
                                        onChangeText={text => setRepresentante(text.replace(regexAllTexts, ''))}
                                    />
                                    <Ionicons name={representante.length > 1 ? "checkmark" : "close"} size={20} color={representante === '' ? "#00000000" : (representante.length > 1 ? minhasCores.success : minhasCores.danger)} style={{ marginLeft: 10 }} />
                                </AreaInput>


                                <AreaInput style={style.areaInput}>
                                    <MaterialIcons name="military-tech" size={22} color={minhasCores.color5} style={{ marginLeft: 5 }} />
                                    <Input
                                        placeholder="Função/ Cargo"
                                        autoCorrect={false}
                                        autoCapitalize="sentences"
                                        value={cargo}
                                        onChangeText={text => setCargo(text.replace(regexAllTexts, ''))}
                                    />
                                    <Ionicons name={cargo.length > 1 ? "checkmark" : "close"} size={20} color={cargo === '' ? "#00000000" : (cargo.length > 1 ? minhasCores.success : minhasCores.danger)} style={{ marginLeft: 10 }} />
                                </AreaInput>

                                <View style={style.areaInputPicker}>
                                    <Fontisto name="persons" style={{ marginRight: 10, marginLeft: 28, fontSize: 16 }} color={minhasCores.color5} />
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
                                    <FontAwesome name="hand-stop-o" style={{ marginRight: 10, marginLeft: 28, fontSize: 18 }} color={minhasCores.color5} />
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
                                    <Ionicons name="newspaper-outline" style={{ marginRight: 10, marginLeft: 28, fontSize: 18 }} color={minhasCores.color5} />
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
                                    <MaterialIcons name="format-list-numbered" size={22} color={minhasCores.color5} style={{ marginLeft: 5 }} />
                                    <Input
                                        placeholder="Antiguidade"
                                        autoCorrect={false}
                                        autoCapitalize="sentences"
                                        value={antiguidade}
                                        onChangeText={text => setAntiguidade(text)}
                                    />
                                    <Ionicons name={representante.length > 1 ? "checkmark" : "close"} size={20} color={representante === '' ? "#00000000" : (representante.length > 1 ? minhasCores.success : minhasCores.danger)} style={{ marginLeft: 10 }} />
                                </AreaInput>

                                {loadingUpdate ?

                                    (<View style={{ marginBottom: 50 }}><ActivityIndicator color={minhasCores.success} size={45} /></View>)

                                    : (
                                        <SubmitButton style={{

                                            flex: 1,
                                            alignSelf: 'center',
                                            marginBottom: 50,
                                            backgroundColor: `${btnCor}`
                                        }}

                                            onPress={() => {
                                                if (nomeCompleto != '' && cargo != '') {
                                                    updateOnFirebase(key, nomeCompleto, representante, cargo, tipoConvidado, retrato, leitura, antiguidade)
                                                } else {
                                                    alertFill()
                                                }
                                            }}>
                                            <SubmitText>
                                                {`${textoResposta}`}
                                            </SubmitText>

                                        </SubmitButton>

                                    )}

                            </ScrollView>
                        </Container>

                    </View>

                </View>
            </Modal>

        </View>
    )
}

const LocalStyle = StyleSheet.create({
    container: {
        borderWidth: 2,
        borderRadius: 10,
        borderStyle: 'dashed',
        borderColor: minhasCores.color3,
        // borderColor: minhasCores.dark_soft,
        backgroundColor: minhasCores.white,
        width: '100%',
        marginTop: 20,
        paddingTop: 10,
        paddingBottom: 60,
        paddingHorizontal: 2,
        marginBottom: 8,
        zIndex: 2,
    },
    header: {
        borderWidth: 3,
        borderRadius: 15,
        borderColor: minhasCores.dark_soft,
        transform: [{ translateY: -20 }],
        backgroundColor: minhasCores.color3,
        marginHorizontal: 30
    },
    textHeader: {
        textAlign: 'center',
        fontSize: 18,
        color: minhasCores.white,
        fontWeight: 'bold',
        marginVertical: 5,
    },
    textDestaque: {
        color: minhasCores.black,
        fontWeight: 'bold',
        fontSize: 16
    },
    textSimples: {
        color: minhasCores.color5,
        fontWeight: '100',
        fontSize: 14
    },
    textSimplesPresenteArea: {
        borderColor: minhasCores.dark_soft,
        flexDirection: 'row',
        borderWidth: 2,
        height: 45,
        marginTop: 10,
        borderRadius: 10,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    textSimplesPresenteIcon: {
        marginLeft: 8,
    },
    textSimplesPresente: {
        color: minhasCores.black,
        fontWeight: '100',
        fontSize: 16,
        textAlign: 'center',
    },
    sectionGuestData: {
        borderRadius: 11,
        paddingHorizontal: 10,
        paddingBottom: 10,
        overflow: 'hidden'
    },
    btnEdit: {
        backgroundColor: minhasCores.success + 'dd',
        flex: 1,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: minhasCores.color7,
        borderLeftWidth: 3,
        borderWidth: 3, borderRadius: 11,
    },
    btnDelete: {
        backgroundColor: minhasCores.danger_light,
        flex: 1,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: minhasCores.color7,
        borderWidth: 3, borderRadius: 11,
    },
    btnQRCOde: {
        backgroundColor: minhasCores.dark,
        flex: 1,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: minhasCores.color7,
        borderWidth: 3, borderRadius: 11,
    },
    footer: {
        flex: 1,
        borderRadius: 10,
        textAlign: 'center',
        color: minhasCores.white,
        fontSize: 18,
        position: 'absolute',
        bottom: 0,
        marginBottom: 2,
        alignSelf: 'center',
        flexDirection: 'row',
    },
    linearGradient: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: "100%",
        borderRadius: 10,
        width: "100%",
    },
    confirmPresent: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 16,
    },
    confirmPresentBtnArea: {
        marginTop: 5,
        justifyContent: 'space-evenly',
        alignItems: 'center',
        width: '60%',
        flexDirection: 'row',
    },
    confirmPresentBtn: {
        borderRadius: 15,
        borderWidth: 2,
        borderColor: minhasCores.dark_soft,
        width: 65,
        height: 35,
        alignItems: 'center',
        justifyContent: 'center',
    },
    confirmPresentBtnAreaText: {
        fontSize: 16,
        textAlign: 'center'
    }
})

const styleModal = StyleSheet.create({
    modalContainer: {
        backgroundColor: minhasCores.white,
        flex: 1,
        paddingHorizontal: 10,
    },
    header: {
        flex: 1,
        justifyContent: 'flex-start',
        marginLeft: 10,
        marginTop: 13,
        backgroundColor: minhasCores.white,
        flexDirection: 'row'
    },
    modalBody: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 20,
    },
})
