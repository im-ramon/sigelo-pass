import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import minhasCores from '../styles/colors';
import PassawordReset from '../pages/PassawordReset';

const AuthSatck = createStackNavigator();

function AuthRoutes() {
    return (
        <AuthSatck.Navigator>
            <AuthSatck.Screen
            name="SignIn"
            component={SignIn}
            options={{headerShown: false}}
            />
            
            <AuthSatck.Screen
            name="SignUp"
            component={SignUp}
            options={{
                headerStyle: {
                    backgroundColor: '#fff',
                    borderBottomWidth: 2,
                    borderBottomColor: '#000'
                }, 
                headerTintColor: '#000',
                headerBackTitleVisible: false,
                headerTitle: 'Voltar'
            }}
            />
            
            <AuthSatck.Screen
            name="PassawordReset"
            component={PassawordReset}
            options={{
                headerStyle: {
                    backgroundColor: '#fff',
                    borderBottomWidth: 2,
                    borderBottomColor: minhasCores.color3,
                }, 
                headerTintColor: '#000',
                headerBackTitleVisible: false,
                headerTitle: 'Voltar'
            }}
            />
        </AuthSatck.Navigator>
    );
}

export default AuthRoutes;