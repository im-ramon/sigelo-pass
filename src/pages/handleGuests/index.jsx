import React, { useState, useEffect, useContext, useMemo } from 'react';
import { View, Text, ImageBackground, StyleSheet, Modal, ActivityIndicator, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { AreaInput, Background, Container, Input, Logo, SubmitButton, SubmitText, Link, LinkText, styles, CabecalhoPages } from '../../styles/styles';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { style } from './style'
import firebase from '../../services/firebaseConnection'
import Lista from './Lista'
import { AuthContext } from '../../contexts/auth';
import { AppContext } from '../../contexts/appContexts';
import minhasCores from '../../styles/colors'

export default function handleGuests() {

    const navigation = useNavigation();
    const [search, setSearch] = useState(null)

    //dados do formulário: 
    const [allGuests, setAllGuests] = useState([])
    const [filterGuests, setFilterGuests] = useState([])
    const [loadingList, setLoadingList] = useState(true)

    const { setLoading } = useContext(AuthContext)
    const { pageName } = useContext(AppContext);

    async function listarUsuarios() {
        firebase.database().ref('guest').on('value', snapshot => {
            let guestList = []
            setAllGuests([])
            snapshot.forEach(itens => {
                let data = {
                    key: itens.key,
                    nomeCompleto: itens.val().nomeCompleto,
                    representante: itens.val().representante,
                    cargo: itens.val().cargo,
                    tipoConvidado: itens.val().tipoConvidado,
                    retrato: itens.val().retrato,
                    leitura: itens.val().leitura,
                    antiguidade: itens.val().antiguidade,
                    palanque: itens.val().palanque,
                    presente: itens.val().presente
                }
                guestList.push(data)
            })
            // guestList = guestList.sort((a, b) => a.nomeCompleto - b.nomeCompleto) // ORDENAÇÃO POR NOME
            setAllGuests(guestList)
            setFilterGuests(guestList)
            setLoadingList(false)
        })
    }

    useEffect(() => {
        setLoadingList(true)
        listarUsuarios()
    }, [])

    useEffect(() => {
        search === '' ? setFilterGuests(allGuests) : search != null && (setFilterGuests(allGuests.filter(item => item.nomeCompleto.toLowerCase().indexOf(search.toLowerCase()) > -1 || item.representante.toLowerCase().indexOf(search.toLowerCase()) > -1 || item.cargo.toLowerCase().indexOf(search.toLowerCase()) > -1)))
    }, [search])


    return (
        <Background>
            <ImageBackground source={require('../../assets/background-light.jpg')} style={styles.image}>
                <View style={style.searchArea}>
                    <TouchableOpacity style={style.btnSearch}>
                        <FontAwesome name="search" size={32} color={minhasCores.color3} />
                    </TouchableOpacity>

                    <TextInput
                        style={style.inputSearch}
                        value={search}
                        placeholder='Pesquisar convidado...'
                        placeholderTextColor='#00000030'
                        onChangeText={(text) => { setSearch(text) }}
                        autoCapitalize='none'
                    />
                </View>
                <Container>

                    <CabecalhoPages>{pageName == 'allGuests' ? 'Todos os convidados' : 'Confirmar presença'}</CabecalhoPages>
                    <View style={localStyle.flatListConteiner}>
                        {loadingList ?

                            (<ActivityIndicator color={minhasCores.color3} size={45} />)

                            : (
                                <FlatList
                                    keyExtractor={item => item.key}
                                    data={filterGuests}
                                    showsVerticalScrollIndicator={false}
                                    style={localStyle.flatList}
                                    renderItem={({ item }) => (<Lista data={item} />)}
                                />
                            )}
                    </View>

                </Container>
            </ImageBackground>
        </Background>
    );
}

const localStyle = StyleSheet.create({
    flatListConteiner: {
        width: '85%',
        flex: 1,
        justifyContent: 'center',
        paddingBottom: 50,
    },
    flatList: {
        width: '100%',
        flex: 1,
    }
})

