import React, { useState, useContext } from 'react';
import { View, Text, ImageBackground, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { AreaInput, Background, Container, Input, Logo, SubmitButton, SubmitText, Link, styles } from '../../styles/styles';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import minhasCores from '../../styles/colors';
import { AuthContext } from '../../contexts/auth';
import { Picker } from '@react-native-picker/picker';
import firebase from '../../services/firebaseConnection'

export default function PassawordReset() {

    const { signUp } = useContext(AuthContext);

    const navigation = useNavigation();

    const [emailUser, setEmailUser] = useState('')

    const [loading, setLoading] = useState(false)

    const validacaoEmail = /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)$/

    function resetEmail(emailAddress) {
        firebase.auth().sendPasswordResetEmail(emailAddress).then(function () {
            myalert('success', '_')
        }).catch(function (error) {
            myalert('erro', error)
        });
    }


    function myalert(type, error) {
        if (type == 'erro') {
            Alert.alert(
                `Ocorreu um erro`,
                `Verifique o e-mail digitado e tente novamente!\n\n${!!error ? 'Descrição do erro:' + error : ''}`,
                [
                    { text: "Tentar novamente", onPress: () => {} }
                ],
                { cancelable: false }
            );
        }

        if (type == 'success') {
            Alert.alert(
                `E-mail enviado`,
                `Acesse seu e-mail e clique no link de recuperação de senha.\n`,
                [
                    { text: "Continuar", onPress: () => navigation.navigate('SignIn') }
                ],
                { cancelable: false }
            );
        }
        
        if (type == 'invalidEmail') {
            Alert.alert(
                `Atenção!`,
                `Preenchar o campo e-mail corretamente para continuar.\n`,
                [
                    { text: "Continuar", onPress: () => console.log('erro') }
                ],
                { cancelable: false }
            );
        }
    }

    return (
        <Background>
            <ImageBackground source={require('../../assets/background-light.jpg')} style={styles.image}>
                <Container>
                    <Logo source={require('../../assets/logo-1.png')} />

                    <Text style={style.textHeader}>Recuperar senha</Text>
                    <Text style={{...style.textHeader2, fontSize: 13}}>Digite o e-mail da conta que deseja recuperar a senha:</Text>

                    <AreaInput>
                        <Ionicons name="mail" size={20} color={minhasCores.color5} style={{ marginLeft: 5 }} />
                        <Input
                            placeholder="Email"
                            autoCorrect={false}
                            autoCapitalize="none"
                            keyboardType="email-address"
                            value={emailUser}
                            autoFocus={true}
                            onChangeText={text => setEmailUser(text)}
                        />
                        <Ionicons name={!validacaoEmail.test(emailUser) ? "close" : "checkmark"} size={20} color={emailUser === '' ? '#00000000' : (!validacaoEmail.test(emailUser) ? minhasCores.danger : minhasCores.success)} />
                    </AreaInput>

                    {loading ?
                        (<ActivityIndicator color={minhasCores.color3} size={45} />)
                        :
                        (
                            <SubmitButton onPress={() => {
                                if (validacaoEmail.test(emailUser)) {
                                    resetEmail(emailUser)
                                } else {
                                    myalert('erro')
                                }
                            }}>
                                <SubmitText>
                                    Enviar
                                </SubmitText>
                            </SubmitButton>
                        )
                    }

                </Container>
            </ImageBackground>
        </Background >
    );
}

const style = StyleSheet.create({
    viewTextArea: {
        width: '80%',
    },
    viewText: {
        color: '#dedede',
        textAlign: 'center',
    },
    textHeader: {
        color: minhasCores.color1,
        fontSize: 20,
        marginBottom: 10,
        marginTop: 24,
        width: '80%',
        textAlign: 'center'
    },
    textHeader2: {
        color: minhasCores.color1,
        fontSize: 20,
        marginBottom: 30,
        marginTop: 0,
        width: '80%',
        textAlign: 'center'
    },
    piker: {
        backgroundColor: '#121212',
        borderBottomWidth: 3,
        borderBottomColor: '#3C74A6',
        width: '65%',
        // flex: 1,
        alignSelf: 'center',
        flexDirection: 'row',
        height: 35,
        marginBottom: 20,
        alignItems: 'center',
        paddingBottom: 10,
    },
})