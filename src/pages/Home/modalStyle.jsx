import { StyleSheet } from 'react-native'
import cores from '../../styles/colors'

const styles = StyleSheet.create({
    body: {
      flex: 1,
      backgroundColor: '#ffffffbc',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%'
    },
    root: {
        width: '80%',
        height: '40%',
        borderRadius: 25,
        backgroundColor: '#fff',
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.37,
        shadowRadius: 7.49,
        elevation: 12,
    },
    header: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },  
    textHeader: {
        fontSize: 24,
        color: cores.color3,
        backgroundColor: cores.white,
        borderColor: cores.color7,
        paddingHorizontal: 16,
        borderRadius: 12,
        textAlign: 'center',
        borderWidth: 2,
    },
    btnClose: {
        backgroundColor: '#fff',
        borderRadius: 50,
        color: cores.color3,
        width: 40,
        height: 40,
        right: -10,
        top: -20,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.37,
        shadowRadius: 7.49,
        elevation: 12,
    },
    iconBtnClose: {
        color: cores.color3,
    }, 
    main: {
        flex: 5,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    footer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%'
    },
    text: {
        color: cores.white,
    },  
    textVersion: {
        color: `${cores.white}`,
    }, 
    viewGit: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    },
    textGit: {
        color: `${cores.white}`,
        fontSize: 18,
    },
    themeArea: {
        height: '25%',
        width: '80%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    themeAreaBtn:{
        flex: 1,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    themeBtn: {
        width: '45%',
        height: 80,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        borderWidth: 5,
        marginVertical: 10,
        marginHorizontal: 10,
    }
})


export default styles