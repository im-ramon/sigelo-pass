import React, { useState, useContext } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, ActivityIndicator, Alert } from 'react-native'
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { AreaInput, Background, Container, Input, Logo, SubmitButton, SubmitText, Link, LinkText, styles } from '../../styles/styles';
import { Picker } from '@react-native-picker/picker'
import { style } from './style'
import firebase from '../../services/firebaseConnection';
import { AppContext } from '../../contexts/appContexts';
import { AuthContext } from '../../contexts/auth'
import minhascores from '../../styles/colors'
import { LinearGradient } from 'expo-linear-gradient';

export default function Lista({ data }) {

    const { user } = useContext(AuthContext);

    const [key, setKey] = useState(data.key)
    const [email, setEmail] = useState(data.email)
    const [nome, setNome] = useState(data.nome)
    const [pass, setPass] = useState(data.pass)

    function myAlert(type, key, email, nome) {

        if (type == 'aproveRequest') {
            Alert.alert(
                "Atenção",
                `Ao confirmar, você estará concedendo ao usuário acesso ao aplicativo. \n\nDeseja continuar?`,
                [
                    {
                        text: "Voltar",
                        onPress: () => console.log("Cancel Pressed"),
                        style: "cancel"
                    },
                    { text: "Confirmar", onPress: () => aproverOnFirebase(key, email, nome) }
                ],
                { cancelable: false }
            );
            return;
        }

        if (type == 'deleteRequest') {
            Alert.alert(
                "Atenção",
                `Ao confirmar, você estará rejeitando a solicitação de acesso ao aplicativo. \n\nDeseja continuar?`,
                [
                    {
                        text: "Voltar",
                        onPress: () => console.log("Cancel Pressed"),
                        style: "cancel"
                    },
                    { text: "Confirmar", onPress: () => deleteOnFirebase(key, 'tempUsers') }
                ],
                { cancelable: false }
            );
            return;
        }

        if (type == 'deleteUser') {
            Alert.alert(
                "Atenção",
                `Ao confirmar, você estará excluindo o usuário do seu aplicativo. \n\nDeseja continuar?`,
                [
                    {
                        text: "Voltar",
                        onPress: () => console.log("Cancel Pressed"),
                        style: "cancel"
                    },
                    { text: "Confirmar", onPress: () => deleteOnFirebase(key, 'usersAuth') }
                ],
                { cancelable: false }
            );
            return;
        }

        if (type == 'blockUser') {
            Alert.alert(
                "Atenção",
                `Ao confirmar, você estará bloqueando o usuário do seu aplicativo. \n\nDeseja continuar?`,
                [
                    {
                        text: "Voltar",
                        onPress: () => console.log("Cancel Pressed"),
                        style: "cancel"
                    },
                    { text: "Confirmar", onPress: () => blockOnFirebase(key, email, nome) }
                ],
                { cancelable: false }
            );
            return;
        }
    }

    async function aproverOnFirebase(key, email, nome) {
        deleteOnFirebase(key, 'tempUsers').then(()=>{
            firebase.database().ref('usersAuth').child(key).set({ userEmail: email, userName: nome })
        })
    }

    async function blockOnFirebase(key, email, nome) {
        deleteOnFirebase(key, 'usersAuth').then(()=>{
            firebase.database().ref('tempUsers').child(key).set({ userEmail: email, userName: nome })
        })
    }

    async function deleteOnFirebase(key, node) {
        await firebase.database().ref(node).child(key).remove()
    }



    return (
        user.uid != data.key && 
        <View style={LocalStyle.container}>
            <View style={LocalStyle.sectionDadosCarro}>
                <Text style={LocalStyle.textDestaque}>Operador: <Text style={LocalStyle.textSimples}>{nome}</Text></Text>
                <Text style={LocalStyle.textDestaque}>E-mail: <Text style={LocalStyle.textSimples}>{email}</Text></Text>
                <Text style={LocalStyle.textDestaque}>Tipo de usário: <Text style={LocalStyle.textSimples}>{pass ? 'Usuário aprovado' : 'Usuário aguardando aprovação'}</Text></Text>
            </View>

            <View style={LocalStyle.footer}>
                {pass &&
                    <TouchableOpacity style={{ ...LocalStyle.btn, backgroundColor: minhascores.warning_light }} onPress={() => { myAlert('blockUser', key, email, nome) }}>
                        <MaterialIcons name="block" size={24} color="black" />
                    </TouchableOpacity>
                }

                {pass &&
                    <TouchableOpacity style={{ ...LocalStyle.btn, backgroundColor: minhascores.danger_light }} onPress={() => { myAlert('deleteUser', key, email, nome) }}>
                        <AntDesign name="delete" size={24} color="black" />
                    </TouchableOpacity>
                }

                {!pass &&
                    <TouchableOpacity style={{ ...LocalStyle.btn, backgroundColor: minhascores.danger_light }} onPress={() => { myAlert('deleteRequest', key, email, nome) }}>
                        <AntDesign name="delete" size={24} color="black" />
                    </TouchableOpacity>
                }

                {!pass &&
                    <TouchableOpacity style={{ ...LocalStyle.btn, backgroundColor: minhascores.success_light }} onPress={() => { myAlert('aproveRequest', key, email, nome) }}>
                        <AntDesign name="checkcircleo" size={24} color="black" />
                    </TouchableOpacity>
                }

            </View>
        </View>
    )
}

const LocalStyle = StyleSheet.create({
    container: {
        borderWidth: 2,
        borderRadius: 10,
        borderStyle: 'dashed',
        borderColor: minhascores.color3,
        backgroundColor: minhascores.white,
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
        borderColor: minhascores.black,
        transform: [{ translateY: -20 }],
        backgroundColor: minhascores.color5,
        marginHorizontal: 30
    },
    textHeader: {
        textAlign: 'center',
        fontSize: 18,
        color: '#dedede',
        fontWeight: 'bold',
        marginVertical: 5,
    },
    textDestaque: {
        color: minhascores.color5,
        fontSize: 16
    },
    textSimples: {
        color: minhascores.dark,
        fontWeight: 'bold',
        fontSize: 14
    },
    sectionDadosCarro: {
        borderRadius: 11,
        paddingHorizontal: 10,
        paddingBottom: 10,
        overflow: 'hidden'
    },
    btn: {
        backgroundColor: minhascores.danger,
        height: 50,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: minhascores.dark_soft,
        borderWidth: 3, borderRadius: 11,
    },
    footer: {
        flex: 1,
        borderRadius: 10,
        textAlign: 'center',
        color: '#dedede',
        fontSize: 18,
        marginBottom: 8,
        backgroundColor: minhascores.white,
        position: 'absolute',
        bottom: 0,
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
    }
})

// const styleModal = StyleSheet.create({
//     modalContainer: {
//         backgroundColor: minhascores.light,
//         flex: 1,
//         paddingHorizontal: 10,
//     },
//     header: {
//         flex: 1,
//         justifyContent: 'flex-start',
//         marginLeft: 10,
//         marginTop: 13,
//         backgroundColor: '#141414',
//         flexDirection: 'row'
//     },
//     modalBody: {
//         alignItems: 'center',
//         justifyContent: 'center',
//         flex: 12,
//     },
// })
