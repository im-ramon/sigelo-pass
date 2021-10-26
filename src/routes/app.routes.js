import React from 'react';
import { createStackNavigator, TransitionSpecs, HeaderStyleInterpolators } from '@react-navigation/stack';
import Home from '../pages/Home';
import ScannerQR from '../pages/ScannerQR';
import AddGuest from '../pages/AddGuest';
import handleGuests from '../pages/handleGuests';
import Approver from '../pages/Approver';
import Profiles from '../pages/Profiles';
import ExportAllQR from '../pages/ExportAllQR';

import minhascores from '../styles/colors'


const AppSatck = createStackNavigator();

const MyTransition = {
    gestureDirection: 'horizontal',
    transitionSpec: {
        open: TransitionSpecs.TransitionIOSSpec,
        close: TransitionSpecs.TransitionIOSSpec,
    },
    headerStyleInterpolator: HeaderStyleInterpolators.forFade,
    cardStyleInterpolator: ({ current, next, layouts }) => {
        return {
            cardStyle: {
                transform: [
                    {
                        translateX: current.progress.interpolate({
                            inputRange: [0, 1],
                            outputRange: [layouts.screen.width, 0],
                        }),
                    },
                ],
            },
            overlayStyle: {
                opacity: current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 0.5],
                }),
            },
        };
    },
}

const configAnimation = {
    cardOverlayEnabled: true,
    gestureEnabled: true,
    ...MyTransition,
}

function AppRoutes() {
    return (
        <AppSatck.Navigator>
            <AppSatck.Screen
                name="Home"
                component={Home}
                options={{
                    ...configAnimation,
                    headerShown: false,
                }} />

            <AppSatck.Screen
                name="ScannerQR"
                component={ScannerQR}
                options={{
                    ...configAnimation,
                    headerShown: true,
                    title: 'Voltar',
                    headerStyle: {
                        backgroundColor: minhascores.white,
                        borderBottomColor: minhascores.color3,
                        borderBottomWidth: 2
                    },
                    headerTintColor: minhascores.color5
                }}
            />

            <AppSatck.Screen
                name="AddGuest"
                component={AddGuest}
                options={{
                    ...configAnimation,
                    headerShown: true,
                    title: 'Voltar',
                    headerStyle: {
                        backgroundColor: minhascores.white,
                        borderBottomColor: minhascores.color3,
                        borderBottomWidth: 2
                    },
                    headerTintColor: minhascores.color5,
                }}
            />

            <AppSatck.Screen
                name="handleGuests"
                component={handleGuests}
                options={{
                    ...configAnimation,
                    headerShown: true,
                    title: 'Voltar',
                    headerStyle: {
                        backgroundColor: minhascores.white,
                        borderBottomColor: minhascores.color3,
                        borderBottomWidth: 2
                    },
                    headerTintColor: minhascores.color5
                }}
            />

            <AppSatck.Screen
                name="Approver"
                component={Approver}
                options={{
                    ...configAnimation,
                    headerShown: true,
                    title: 'Voltar',
                    headerStyle: {
                        backgroundColor: minhascores.color1,
                        borderBottomColor: '#F27405',
                        borderBottomWidth: 2
                    },
                    headerTintColor: '#fff',

                }}
            />

            <AppSatck.Screen
                name="Profiles"
                component={Profiles}
                options={{
                    ...configAnimation,
                    headerShown: true,
                    title: 'Voltar',
                    headerStyle: {
                        backgroundColor: minhascores.color1,
                        borderBottomColor: '#F27405',
                        borderBottomWidth: 2
                    },
                    headerTintColor: '#fff',

                }}
            />
            
            <AppSatck.Screen
                name="ExportAllQR"
                component={ExportAllQR}
                options={{
                    ...configAnimation,
                    headerShown: true,
                    title: 'Voltar',
                    headerStyle: {
                        backgroundColor: minhascores.white,
                        borderBottomColor: minhascores.color3,
                        borderBottomWidth: 2
                    },
                    headerTintColor: minhascores.color5,

                }}
            />

        </AppSatck.Navigator>
    );
}

export default AppRoutes;