import React, { useState, useContext } from 'react';
import { View, Text, ImageBackground, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { AreaInput, Background, Container, Input, Logo, SubmitButton, SubmitText, Link, LinkText, styles } from '../../styles/styles';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import minhasCores from '../../styles/colors';
import { AuthContext } from '../../contexts/auth';
import { Picker } from '@react-native-picker/picker';
import cores from '../../styles/colors'

export default function SignUp() {

    const { signUp } = useContext(AuthContext);

    const navigation = useNavigation();

    const [userName, setUserName] = useState('')
    const [userEmail, setUserEmail] = useState('')
    const [userPassword, setUserPassword] = useState('')
    const [repeatUserPassword, setRepeatUserPassword] = useState('')

    const [loading, setLoading] = useState(false)

    const validacaoEmail = /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)$/


    function alert(type) {
        if (type == 'erro') {
            Alert.alert(
                `Atenção!`,
                `Preencha corretamente todos os campos solicitados para continuar.\n\nTente novamente.`,
                [
                    { text: "Continuar", onPress: () => console.log('erro') }
                ],
                { cancelable: false }
            );
        }

        if (type == 'success') {
            Alert.alert(
                `Cadastro concluído!`,
                `Os dados foram remetidos para análise.\n\nAguarde a aprovação.`,
                [
                    { text: "Continuar", onPress: () => navigation.navigate('SignIn') }
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

                    <Text style={style.textHeader}>Preencha o formulário para cadastra-se</Text>
                    
                    <AreaInput>
                        <Ionicons name="person" size={20} color={minhasCores.color5} style={{ marginLeft: 5 }} />
                        <Input
                            placeholder="Nome"
                            autoCorrect={false}
                            autoCapitalize="none"
                            value={userName}
                            onChangeText={text => setUserName(text)}
                        />
                        <Ionicons name={userName && userName.length >= 2 ? "checkmark" : "close"} size={20} color={userName === '' ? '#00000000' : (userName && userName.length >= 2 ? cores.success : cores.danger)} style={{ marginLeft: -5 }} />
                    </AreaInput>

                    <AreaInput>
                        <Ionicons name="mail" size={20} color={minhasCores.color5} style={{ marginLeft: 5 }} />
                        <Input
                            placeholder="Email"
                            autoCorrect={false}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={userEmail}
                            onChangeText={text => setUserEmail(text.toLowerCase())}
                        />
                        <Ionicons name={!validacaoEmail.test(userEmail) ? "close" : "checkmark"} size={20} color={userEmail === '' ? '#00000000' : (!validacaoEmail.test(userEmail) ? cores.danger : cores.success)} />
                    </AreaInput>

                    <AreaInput>
                        <Ionicons name="lock-closed-sharp" size={20} color={minhasCores.color5} style={{ marginLeft: 5 }} />
                        <Input
                            placeholder="Senha"
                            autoCorrect={false}
                            autoCapitalize="none"
                            value={userPassword}
                            onChangeText={text => setUserPassword(text)}
                            secureTextEntry={true}
                        />
                        <Ionicons name={userPassword.length <= 7 ? "close" : "checkmark"} size={20} color={userPassword == '' ? '#00000000' : (userPassword.length <= 7 ? cores.danger : cores.success)} style={{ marginLeft: -5 }} />
                    </AreaInput>
                    
                     <AreaInput>
                        <Ionicons name="lock-closed-sharp" size={20} color={minhasCores.color5} style={{ marginLeft: 5 }} />
                        <Input
                            placeholder="Confirma sua senha"
                            autoCorrect={false}
                            autoCapitalize="none"
                            value={repeatUserPassword}
                            onChangeText={text => setRepeatUserPassword(text)}
                            secureTextEntry={true}
                        />
                        <Ionicons name={repeatUserPassword != userPassword ? "close" : "checkmark"} size={20} color={repeatUserPassword == '' ? '#00000000' : (repeatUserPassword != userPassword ? cores.danger : cores.success)} style={{ marginLeft: -5 }} />
                    </AreaInput>

                    {loading ?
                        (<ActivityIndicator color={cores.color5} size={45} />)
                        :
                        (
                            <SubmitButton onPress={() => {
                                if (!!validacaoEmail.test(userEmail) && userPassword.length >= 8 && !!userName && repeatUserPassword === userPassword) {
                                    setLoading(true)
                                    signUp(userEmail, userName, userPassword)
                                    setLoading(false)
                                    alert('success')
                                } else {
                                    alert('erro')
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
        color: minhasCores.dark,
        fontSize: 20,
        marginBottom: 30,
        marginTop: 10
    },
    piker: {
        backgroundColor: '#00000050',
        borderBottomWidth: 3,
        borderTopRightRadius: 5,
        borderTopLeftRadius: 5,
        borderBottomColor: '#3C74A6',
        width: '65%',
        // flex: 1,
        alignSelf: 'center',
        flexDirection: 'row',
        height: 40,
        marginBottom: 20,
        alignItems: 'center',
        paddingBottom: 10,
        paddingTop: 5,
        paddingRight: 15,
    },
})