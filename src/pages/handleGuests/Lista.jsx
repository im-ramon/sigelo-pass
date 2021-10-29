import React, { useState, useContext } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, ActivityIndicator, Alert, Switch } from 'react-native'
import { Ionicons, MaterialCommunityIcons, MaterialIcons, AntDesign, Octicons } from '@expo/vector-icons';
import { AreaInput, Background, Container, Input, Logo, SubmitButton, SubmitText, Link, LinkText, CabecalhoPages } from '../../styles/styles';
import { style } from './style'
import firebase from '../../services/firebaseConnection';
import { AppContext } from '../../contexts/appContexts';
import minhasCores from '../../styles/colors'
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
    const [cargo, setCargo] = useState(data.cargo)
    const [modelo, setModelo] = useState(data.modelo)
    const [placa, setPlaca] = useState(data.placa)
    const [observacoes, setObservacoes] = useState(data.observacoes)
    const [representante, setRepresentante] = useState(data.representante)
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

    async function updateOnFirebase(key, nomeCompleto, cargo, modelo, representante, placa, observacoes, presente) {
        setLoadingUpdate(true)
        await firebase.database().ref('guest').child(key).update({ nomeCompleto, cargo, modelo, representante, placa, observacoes, presente })
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
                <Text style={LocalStyle.textSimples}>Veículo: <Text style={LocalStyle.textDestaque}>{data.modelo}</Text></Text>
                <Text style={LocalStyle.textSimples}>Placa: <Text style={LocalStyle.textDestaque}>{data.placa}</Text></Text>
                <Text style={LocalStyle.textSimples}>Observações: <Text style={LocalStyle.textDestaque}>{data.observacoes}</Text></Text>
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
                                    <Ionicons name="person" size={20} color={minhasCores.color5} />
                                    <Input
                                        placeholder="Nome completo"
                                        autoCorrect={false}
                                        autoCapitalize="sentences"
                                        value={nomeCompleto}
                                        onChangeText={text => setNomeCompleto(text.replace(regexAllTexts, ''))}
                                    />
                                    <Ionicons name={nomeCompleto.length > 1 ? "checkmark" : "close"} size={20} color={nomeCompleto === '' ? "#00000000" : (nomeCompleto.length > 1 ? minhasCores.success : minhasCores.danger)} style={{ marginLeft: 0 }} />
                                </AreaInput>

                                <AreaInput style={style.areaInput}>
                                    <MaterialIcons name="military-tech" size={22} color={minhasCores.color5} />
                                    <Input
                                        placeholder="Cargo/ Função"
                                        autoCorrect={false}
                                        autoCapitalize="sentences"
                                        value={cargo}
                                        onChangeText={text => setCargo(text.replace(regexAllTexts, ''))}
                                    />
                                    <Ionicons name={cargo.length > 1 ? "checkmark" : "close"} size={20} color={cargo === '' ? "#00000000" : (cargo.length > 1 ? minhasCores.success : minhasCores.danger)} style={{ marginLeft: 0 }} />
                                </AreaInput>

                                <AreaInput style={style.areaInput}>
                                    <MaterialIcons name="person-pin" size={22} color={minhasCores.color5} />
                                    <Input
                                        placeholder="Cargo/ Função"
                                        autoCorrect={false}
                                        autoCapitalize="sentences"
                                        value={representante}
                                        onChangeText={text => setRepresentante(text.replace(regexAllTexts, ''))}
                                    />
                                    <Ionicons name={cargo.length > 1 ? "checkmark" : "close"} size={20} color={cargo === '' ? "#00000000" : (cargo.length > 1 ? minhasCores.success : minhasCores.danger)} style={{ marginLeft: 0 }} />
                                </AreaInput>

                                <AreaInput style={style.areaInput}>
                                    <Ionicons name="car" size={20} color={minhasCores.color5} />
                                    <Input
                                        placeholder="Modelo do veículo"
                                        autoCorrect={false}
                                        autoCapitalize="sentences"
                                        value={modelo}
                                        onChangeText={text => setModelo(text)}
                                    />
                                    <Ionicons name={modelo.length > 1 ? "checkmark" : "close"} size={20} color={modelo === '' ? "#00000000" : (modelo.length > 1 ? minhasCores.success : minhasCores.danger)} style={{ marginLeft: 0 }} />
                                </AreaInput>

                                <AreaInput style={style.areaInput}>
                                    <MaterialCommunityIcons name="scoreboard" size={20} color={minhasCores.color5} />
                                    <Input
                                        placeholder="Placa do veículo"
                                        maxLength={7}
                                        autoCorrect={false}
                                        autoCapitalize="characters"
                                        value={placa}
                                        onChangeText={text => setPlaca(text.replace(regexAllTexts, '').toUpperCase())}
                                    />
                                    <Ionicons name={regexPlate.test(placa) ? "checkmark" : "close"} size={20} color={placa === '' ? '#00000000' : (regexPlate.test(placa) ? minhasCores.success : minhasCores.danger)} style={{ marginLeft: 0 }} />
                                </AreaInput>

                                <AreaInput style={style.areaInput}>
                                    <Ionicons name="add" size={20} color={minhasCores.color5} />
                                    <Input
                                        placeholder="Observações"
                                        autoCorrect={false}
                                        autoCapitalize="sentences"
                                        value={observacoes}
                                        onChangeText={text => setObservacoes(text)}
                                    />
                                </AreaInput>

                                <View style={LocalStyle.confirmPresent}>
                                    <Text>Convidado presente? </Text>

                                    <View style={LocalStyle.confirmPresentBtnArea}>
                                        <TouchableOpacity onPress={() => { setPresente('sim') }} style={{ ...LocalStyle.confirmPresentBtn, backgroundColor: presente === 'sim' ? minhasCores.success : minhasCores.dark_soft }}>
                                            <Text style={LocalStyle.confirmPresentBtnAreaText}>
                                                SIM
                                            </Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity onPress={() => { setPresente('nao') }} style={{ ...LocalStyle.confirmPresentBtn, backgroundColor: presente === 'nao' ? minhasCores.danger : minhasCores.dark_soft }}>
                                            <Text style={LocalStyle.confirmPresentBtnAreaText}>
                                                NÃO
                                            </Text>
                                        </TouchableOpacity>
                                    </View>

                                </View>

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
                                                    updateOnFirebase(key, nomeCompleto, cargo, modelo, representante, placa, observacoes, presente)
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
        borderColor: minhasCores.dark_soft,
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
