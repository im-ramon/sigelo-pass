import React, { useContext, useState } from 'react';
import { ImageBackground, StyleSheet, View, Text, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { Background } from '../../styles/styles';
import { Ionicons, FontAwesome5, AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../contexts/auth'
import { AppContext } from '../../contexts/appContexts'
import { LinearGradient } from 'expo-linear-gradient';
import minhasCores from '../../styles/colors';
import modalStyle from './modalStyle';

export default function Home() {

    const navigation = useNavigation();

    const { signOut, user, setLoading } = useContext(AuthContext);
    const { setPageName } = useContext(AppContext);

    const [eventType, setEventType] = useState('0');
    const [modalActive, setModalActive] = useState(false);

    // Isso aqui pode quebrar o App no futura, ATENÇÃO!!!!
    const appJSON = require('../../../app.json')
    // Isso aqui pode quebrar o App no futura, ATENÇÃO!!!!


    const navigateTo = (pageNameNav) => {
        setPageName(pageNameNav)
        navigation.navigate('handleGuests')
    }

    return (
        <Background>
            <LinearGradient colors={[minhasCores.color3, minhasCores.color4, minhasCores.color5]} style={style.linearGradient} />

            <View style={style.header}>
                <View style={style.menu}>
                    <TouchableOpacity style={style.menuItem} onPress={() => signOut()}>
                        <Ionicons name="md-exit-outline" size={40} color={minhasCores.light} style={{ transform: [{ rotate: "180deg" }] }} />
                    </TouchableOpacity>

                    <TouchableOpacity style={style.menuItem} onPress={() => { setModalActive(true) }}>
                        <Ionicons name="information-circle-outline" size={40} color={minhasCores.light} />
                    </TouchableOpacity>
                </View>

                <Text style={style.textWelcome}>Bem vindo, {user.nome}!</Text>

                <View style={style.toggleTypeEventArea}>
                    <TouchableOpacity style={{ ...style.btnToggleTypeEventArea, backgroundColor: eventType === '0' ? minhasCores.color5 : '#ffffff10' }} onPress={() => { setEventType('0') }}>
                        <Text style={style.textToggleTypeEventArea}>Todos</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ ...style.btnToggleTypeEventArea, backgroundColor: eventType === '1' ? minhasCores.color5 : '#ffffff10' }} onPress={() => { setEventType('1') }}>
                        <Text style={style.textToggleTypeEventArea}>Evento</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ ...style.btnToggleTypeEventArea, backgroundColor: eventType === '2' ? minhasCores.color5 : '#ffffff10' }} onPress={() => { setEventType('2') }}>
                        <Text style={style.textToggleTypeEventArea}>Cadastro</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={style.sectionMaster}>
                <ScrollView style={style.sectionScrollView}>
                    <View style={style.section}>
                        {(eventType === '1' || eventType === '0') && (
                            <TouchableOpacity style={style.section_btnLarge} onPress={() => { navigation.navigate('ScannerQR') }}>
                                <View style={{ ...style.icon, backgroundColor: '#e5f6fc' }}>
                                    <AntDesign name="qrcode" size={48} color={'#3fb5d2'} />
                                </View>
                                <Text style={style.section_btn_text}>Escanear convite</Text>
                            </TouchableOpacity>
                        )}

                        {(eventType === '1' || eventType === '0') && (
                            <TouchableOpacity style={style.section_btn} onPress={() => { navigation.navigate('GenerateGuestList') }}>
                                <View style={{ ...style.icon, backgroundColor: '#f0eaff' }}>
                                    <FontAwesome5 name="clipboard-list" size={32} color={'#5e38ea'} />
                                </View>
                                <Text style={style.section_btn_text}>Convidados presentes</Text>
                            </TouchableOpacity>
                        )}

                        {(eventType === '1' || eventType === '0') && (
                            <TouchableOpacity style={style.section_btn} onPress={() => { navigateTo('presentGuests') }} >
                                <View style={{ ...style.icon, backgroundColor: '#fdeff2' }}>
                                    <FontAwesome5 name="user-check" size={32} color={'#ec6e82'} />
                                </View>
                                <Text style={style.section_btn_text}>Confirmar presenças</Text>
                            </TouchableOpacity>
                        )}

                        {(eventType === '2' || eventType === '0') && (
                            <TouchableOpacity style={style.section_btn} onPress={() => { navigation.navigate('AddGuest') }}>
                                <View style={{ ...style.icon, backgroundColor: '#ebf7ff' }}>
                                    <FontAwesome5 name="user-plus" size={32} color={'#4bc1f9'} />
                                </View>
                                <Text style={style.section_btn_text}>Adicionar convidado</Text>
                            </TouchableOpacity>
                        )}

                        {(eventType === '2' || eventType === '0') && (
                            <TouchableOpacity style={style.section_btn} onPress={() => { navigateTo('allGuests') }}>
                                <View style={{ ...style.icon, backgroundColor: '#f3f6fe' }}>
                                    <FontAwesome5 name="user-cog" size={32} color={'#b66ce1'} />
                                </View>
                                <Text style={style.section_btn_text}>Gerenciar convidados</Text>
                            </TouchableOpacity>
                        )}

                        {(eventType === '2' || eventType === '0') && (
                            <TouchableOpacity style={style.section_btn} onPress={() => { navigation.navigate('Approver') }}>
                                <View style={{ ...style.icon, backgroundColor: '#fef5f0' }}>
                                    <FontAwesome5 name="users-cog" size={32} color={'#f69b63'} />
                                </View>
                                <Text style={style.section_btn_text}>Gerenciar controladores</Text>
                            </TouchableOpacity>
                        )}

                        {(eventType === '2' || eventType === '0') && (
                            <TouchableOpacity style={style.section_btn} onPress={() => { navigation.navigate('ExportAllQR') }}>
                                <View style={{ ...style.icon, backgroundColor: '#ffd5d5' }}>
                                    <FontAwesome5 name="file-export" size={32} color={'#bb0e0e'} />
                                </View>
                                <Text style={style.section_btn_text}>Exportar todos convites</Text>
                            </TouchableOpacity>
                        )}

                        {(eventType === '2' || eventType === '0') && (
                            <TouchableOpacity style={style.section_btn} onPress={() => { navigation.navigate('Approver') }}>
                                <View style={{ ...style.icon, backgroundColor: '#f8f8c4' }}>
                                    <FontAwesome5 name="users-cog" size={32} color={'#999901'} />
                                </View>
                                <Text style={style.section_btn_text}>Gerenciar controladores</Text>
                            </TouchableOpacity>
                        )}

                    </View>
                </ScrollView>
            </View>

            <Modal
                animationType="fade"
                transparent={true}
                visible={modalActive}
                style={style.modalContainer}
            >
                <View style={modalStyle.body}>
                    <View style={modalStyle.root}>
                        <LinearGradient colors={[minhasCores.color4, minhasCores.color3]} style={style.linearGradient2} />
                        <TouchableOpacity onPress={() => { setModalActive(false) }} style={modalStyle.btnClose}>
                            <AntDesign name="closecircleo" size={24} style={modalStyle.iconBtnClose} />
                        </TouchableOpacity>
                        <View style={modalStyle.header}>
                            <Text style={modalStyle.textHeader}>Informações</Text>
                        </View>

                        <View style={modalStyle.main}>
                            <Text style={modalStyle.textVersion}>Versão {appJSON.expo.version}</Text>
                            <Text style={modalStyle.textVersion}>Desenvolvido por Ramon Oliveira</Text>
                            <Text style={modalStyle.textVersion}>www.ramonoliveira.dev</Text>
                            <Text style={{ ...modalStyle.textVersion, marginTop: 24 }}>Suporte: contato@ramonoliveira.dev</Text>
                        </View>


                        <View style={modalStyle.footer}>
                            <View style={modalStyle.viewGit}><AntDesign name="github" size={22} color="#ffffff" /><Text style={modalStyle.textGit}> /im-ramon</Text></View>
                        </View>
                    </View>
                </View>

            </Modal>
        </Background>
    );
}

const style = StyleSheet.create({
    header: {
        flex: 4,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        marginTop: 30,
        marginBottom: 30,
    },
    menu: {
        flex: 1,
        width: '100%',
        justifyContent: 'space-between',
        flexDirection: 'row',
        padding: 10,
        marginBottom: 10,
    },
    menuItem: {
        backgroundColor: `${minhasCores.light}05`,
        borderRadius: 25,
        width: 70,
        height: 70,
        alignItems: 'center',
        justifyContent: 'center',
    },
    sectionScrollView: {
        flex: 1,
    },
    sectionMaster: {
        flex: 12,
        backgroundColor: '#fff',
        width: '100%',
        height: '100%',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        flexDirection: 'column',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingTop: 30,
        paddingLeft: 5,
    },
    typeEvent: {
        flex: 1,

    },
    toggleTypeEventArea: {
        borderColor: '#ffffff50',
        borderWidth: 2,
        borderStyle: 'dashed',
        height: 100,
        width: '75%',
        borderRadius: 30,
        // flex: 1,
        justifyContent: 'space-around',
        alignItems: 'flex-start',
        flexDirection: 'row',
        marginTop: 8,
        position: 'relative',
        top: 66,
        padding: 10,
    },
    btnToggleTypeEventArea: {
        width: '32%',
        height: 45,
        borderRadius: 15,
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#ffffff30'
    },
    textToggleTypeEventArea: {
        color: minhasCores.white,
        textAlign: 'center',
    },
    section: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingBottom: 50,
    },
    bodyBackground: {
        flex: 1,
        borderRadius: 50,
        justifyContent: "center",
        alignItems: 'center',
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    textWelcome: {
        flex: 2,
        color: minhasCores.white,
        fontSize: 26,
        height: 55,
        width: '85%',
        textAlign: 'center',
        position: 'relative',
        top: 35,
    },
    textType: {
        color: '#ff0',
        fontSize: 16,
    },
    section_btn: {
        width: 160,
        height: 160,
        borderColor: '#d1d1d1',
        borderWidth: 2.5,
        marginBottom: 30,
        backgroundColor: minhasCores.white,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25,
        padding: 15,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.37,
        shadowRadius: 7.49,
        elevation: 12,
    },
    section_btnLarge: {
        width: (180 * 2),
        height: 180 / 1.61803,
        borderColor: '#d1d1d1',
        borderWidth: 2.5,
        marginBottom: 30,
        backgroundColor: minhasCores.white,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25,
        padding: 15,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.37,
        shadowRadius: 7.49,
        elevation: 12,
    },
    section_btn_text: {
        color: minhasCores.dark,
        textAlign: 'center',
        fontSize: 14,
        fontWeight: '100',
        marginTop: 6,
    },
    linearGradient: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: "50%",
    },
    linearGradient2: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: "100%",
        borderRadius: 25,
    },
    icon: {
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        height: 70,
        width: 70,
        // borderWidth: 2,
        // borderColor: '#ffffff'
    }
});