import React, { useState, useEffect, useContext } from 'react';
import { Text, View, StyleSheet, Button, Modal, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import firebase from '../../services/firebaseConnection';
import { AreaInput, Background, Container, Input, Logo, SubmitButton, SubmitText, Link, LinkText, CabecalhoPages } from '../../styles/styles';
import { Ionicons, MaterialCommunityIcons, MaterialIcons, AntDesign } from '@expo/vector-icons';
import minhasCores from '../../styles/colors';
import { AppContext } from '../../contexts/appContexts';

export default function ScannerQR() {

    const { today } = useContext(AppContext);

    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);

    const [modalActive, setModalActive] = useState(false)

    const [loading, setLoading] = useState(false)

    const [key, setKey] = useState('buscando...')
    const [nomeCompleto, setNomeCompleto] = useState('buscando...')
    const [cargo, setCargo] = useState(0)
    const [modelo, setModelo] = useState('buscando...')
    const [placa, setPlaca] = useState('buscando...')
    const [representante, setRepresentante] = useState('buscando...')
    const [observacoes, setObservacoes] = useState('buscando...')


    useEffect(() => {
        (async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    async function dados(data) {
        await firebase.database().ref('guest/' + data.replace(/\.?\,?\#?\$?\[?\]?/g, '')).on('value', (snapshot) => {
            try {
                setKey(data)
                setNomeCompleto(snapshot.val().nomeCompleto)
                setCargo(snapshot.val().cargo)
                setModelo(snapshot.val().modelo)
                setPlaca(snapshot.val().placa)
                setRepresentante(snapshot.val().representante)
                setObservacoes(snapshot.val().observacoes)

                //Gambiarra para corrigir erro de atualização do "state: validade". Pesquisar porque está demorando de atualizar
                setModalActive(true)
                setLoading(false)

            } catch (e) {
                Alert.alert(
                    `Ocorreu um erro`,
                    `Não foi possível encontar os dados do adesivo escaneado no banco de dados. Por favor, tente novamente.\n\n- Informações técnicas do erro:\n\t${e}\n\t${data}`,
                    [
                        { text: "Tentar novamente", onPress: () => setScanned(false) }
                    ],
                    { cancelable: false }
                );

                setLoading(false)
            }
        })
    }

    const handleBarCodeScanned = ({ type, data }) => {
        setLoading(true)
        setScanned(true);
        dados(data);
    };

    if (hasPermission === null) {
        return <Text>Solicitando permissão para acessar a câmera...</Text>;
    }
    if (hasPermission === false) {
        return <Text>Sem acesso à câmera.</Text>;
    }

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

    async function updateOnFirebase(key, nomeCompleto, cargo, modelo, representante, placa, observacoes) {
        setLoading(true)
        await firebase.database().ref('guest').child(key).update({ nomeCompleto, cargo, modelo, representante, placa, observacoes, presente: 'sim' })
            .then(() => {
                setLoading(false)
                Alert.alert(
                    `Presença confirmada!`,
                    `A presença de "${nomeCompleto}"" foi confirmada no evento.`,
                    [
                        { text: "Continuar", onPress: () => {setScanned(false); setModalActive(false);} }
                    ],
                    { cancelable: false }
                );
                    
            });
    }

    return (
        <View style={styles.container}>
            <Text style={styles.textAbsolute}>Aponte a câmera para o QRCode no convite.</Text>

            {/* MODAL */}
            <Modal animationType="slide" visible={modalActive} >
                <View style={styles.modalContainer}>

                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => { setModalActive(false) }}>
                            <Ionicons name="close-circle-sharp" size={32} color={minhasCores.danger} />
                        </TouchableOpacity>
                    </View>


                    <View style={styles.modalBody}>
                        <CabecalhoPages>Convidado encontrado</CabecalhoPages>

                        <View style={styles.rootAreaInput}>
                            <Text style={styles.text}>Nome: </Text>
                            <AreaInput style={styles.AreaInputNew}>
                                <Input
                                    style={styles.InputNew}
                                    placeholder="Nome"
                                    autoCorrect={false}
                                    autoCapitalize="sentences"
                                    value={nomeCompleto}
                                    onChangeText={text => setNomeCompleto(text)}
                                />
                            </AreaInput>
                        </View>

                        <View style={styles.rootAreaInput}>
                            <Text style={styles.text}>Cargo/ Função: </Text>
                            <AreaInput style={styles.AreaInputNew}>
                                <Input
                                    style={styles.InputNew}
                                    placeholder="Cargo/ Função"
                                    autoCorrect={false}
                                    autoCapitalize="sentences"
                                    value={cargo}
                                    onChangeText={text => setCargo(text)}
                                />
                            </AreaInput>
                        </View>

                        <View style={styles.rootAreaInput}>
                            <Text style={styles.text}>Representado por: </Text>
                            <AreaInput style={styles.AreaInputNew}>
                                <Input
                                    style={styles.InputNew}
                                    placeholder="Representado por"
                                    autoCorrect={false}
                                    autoCapitalize="sentences"
                                    value={representante}
                                    onChangeText={text => setRepresentante(text)}
                                />
                            </AreaInput>
                        </View>

                        <View style={styles.rootAreaInput}>
                            <Text style={styles.text}>Veículo: </Text>
                            <AreaInput style={styles.AreaInputNew}>
                                <Input
                                    style={styles.InputNew}
                                    placeholder="Modelo do ceículo"
                                    autoCorrect={false}
                                    autoCapitalize="sentences"
                                    value={modelo}
                                    onChangeText={text => setModelo(text)}
                                />
                            </AreaInput>
                        </View>

                        <View style={styles.rootAreaInput}>
                            <Text style={styles.text}>Placa: </Text>
                            <AreaInput style={styles.AreaInputNew}>
                                <Input
                                    style={styles.InputNew}
                                    placeholder="Placa"
                                    autoCorrect={false}
                                    autoCapitalize="characters"
                                    value={placa}
                                    onChangeText={text => setPlaca(text)}
                                />
                            </AreaInput>
                        </View>

                        <View style={styles.rootAreaInput}>
                            <Text style={styles.text}>Observações: </Text>
                            <AreaInput style={styles.AreaInputNew}>
                                <Input
                                    style={styles.InputNew}
                                    placeholder="Observações"
                                    autoCorrect={false}
                                    autoCapitalize="sentences"
                                    value={observacoes}
                                    onChangeText={text => setObservacoes(text)}
                                />
                            </AreaInput>
                        </View>

                        <SubmitButton onPress={() => { updateOnFirebase(key, nomeCompleto, cargo, modelo, representante, placa, observacoes) }} style={styles.confirmGuestBtn}>
                            <SubmitText>
                                {loading ? (<ActivityIndicator color={minhasCores.white} size={45} />) : 'Confirma presença'}
                            </SubmitText>
                        </SubmitButton>
                    </View>


                </View>
            </Modal>


            <BarCodeScanner
                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                style={StyleSheet.absoluteFillObject}
            />

            {loading ? (<ActivityIndicator size={64} color={minhasCores.color3} />) : (scanned && <Button title={'Escanear outro selo'} onPress={() => setScanned(false)} />)}

        </View>
    );
}


const styles = StyleSheet.create({
    confirmGuestBtn: {
        marginTop: 70,
        backgroundColor: minhasCores.success,
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        backgroundColor: minhasCores.white,
        flex: 1,
        paddingHorizontal: 10,
    },
    header: {
        flex: 1,
        justifyContent: 'flex-start',
        marginLeft: 10,
        marginTop: 18,
        backgroundColor: minhasCores.white,
        flexDirection: 'row'
    },
    headerH1: {
        color: '#dedede',
        textAlign: 'center',
        fontSize: 28,
        backgroundColor: '#F27405',
        width: '80%',
        paddingVertical: 5,
        fontWeight: 'bold',
        marginBottom: 30,
        borderRadius: 10,
    },
    modalBody: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 12,
    },
    text: {
        color: minhasCores.color3,
        fontSize: 16,
        fontWeight: '900',
    },
    textAchado: {
        color: minhasCores.dark,
        fontSize: 16,
    },
    areaData: {
        backgroundColor: '#f0f',
        width: '80%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    rootAreaInput: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'flex-end',
        marginBottom: 10,
        marginRight: 18,
    },
    AreaInputNew: {
        marginBottom: 0,
        paddingLeft: 0,
    },
    InputNew: {
        margin: 0,
        paddingLeft: 0,
    },
    textAbsolute: {
        position: 'absolute',
        zIndex: 1,
        fontSize: 18,
        top: 30,
        color: minhasCores.color5
    },
    textResposta: {
        fontSize: 24,
        color: '#ffffff'
    },
    tipoRespota: {
        backgroundColor: '#121212',
        marginTop: 35,
        height: 250,
        width: 300,
        alignItems: 'center',
        paddingVertical: 20,
        paddingHorizontal: 50,
        borderRadius: 10
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
export const style = StyleSheet.create({
    textH1: {
        fontSize: 28,
        color: '#ffffff',
        borderRadius: 10,
        marginBottom: 30,
        marginTop: 25,
        borderBottomWidth: 3,
        borderBottomColor: '#F27405',
        paddingHorizontal: 10,
        paddingVertical: 2,
    },
    viewTextArea: {
        width: '80%',
    },
    viewText: {
        color: '#dedede',
        textAlign: 'center',
    },
    searchArea: {
        backgroundColor: minhasCores.white,
        width: '100%',
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        bottom: 0,
        zIndex: 2,
        flexDirection: 'row',
        borderTopColor: minhasCores.color3,
        borderTopWidth: 5,
    },
    btnSearch: {
        backgroundColor: minhasCores.white,
        height: 70,
        width: 70,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 5,
        top: -10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.37,
        shadowRadius: 7.49,
        elevation: 12,
    },
    inputSearch: {
        backgroundColor: minhasCores.white,
        width: '80%',
        height: '100%',
        fontSize: 16,
        color: minhasCores.dark,
        paddingLeft: 5,
    },
    imgLogo: {
        width: 150,
        height: 150,
        marginBottom: 30,
    },
    containerScrollView: {
        width: '100%',
    },
    areaInput: {
        width: '85%',
        flex: 1,
        alignSelf: 'center',
    },
    datePiker: {
        width: '80%',
        flex: 1,
        alignSelf: 'center',
        flexDirection: 'row',
        backgroundColor: '#00000050',
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        width: '80%',
        height: 40,
        marginBottom: 23,
        borderBottomColor: minhasCores.color3,
        borderBottomWidth: 3,
        paddingBottom: 5,
        paddingTop: 5,
        alignItems: 'center'
    },
    btnEnviar: {
        flex: 1,
        alignSelf: 'center',
        marginBottom: 50,
    },
    piker: {
        backgroundColor: '#00000050',
        borderBottomWidth: 3,
        borderBottomColor: minhasCores.color3,
        width: '80%',
        flex: 1,
        alignSelf: 'center',
        flexDirection: 'row',
        height: 40,
        marginBottom: 20,
        alignItems: 'center',
        paddingBottom: 10,
        paddingTop: 5,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        paddingRight: 8,
    },
})