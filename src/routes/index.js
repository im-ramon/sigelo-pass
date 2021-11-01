import React, { useContext } from 'react';
import { View, ActivityIndicator, StyleSheet, Image } from 'react-native'
import { AuthContext } from '../contexts/auth';
import AppContextProvider from '../contexts/appContexts'
import AuthRoutes from './auth.routes';
import AppRoutes from './app.routes'
import minhasCores from '../styles/colors'

function Routes() {
    const { signed, loading } = useContext(AuthContext)

    if (loading) {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: minhasCores.white }}>
                <Image style={style.imgLogo} source={require('../../src/assets/logo-6.png')} />
                <ActivityIndicator size="large" color={minhasCores.color3} />
            </View>
        )
    }

    return (
        signed ? <AuthRoutes /> : <AppContextProvider><AppRoutes /></AppContextProvider>
    );
}

const style = StyleSheet.create({   
    imgLogo: {
        width: 150,
        height: 150,
        marginBottom: 30,
    },
})

export default Routes;