import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        position: 'absolute',
        width: '100%',
        backgroundColor: 'transparent',
        zIndex: 2
    },
    svg: {
        backgroundColor: 'transparent',
        width: '200%',
        top:0,
        position: 'absolute',
        overflow: 'hidden',
        zIndex: 1
    },
    rowTab: {
        flexDirection: 'row', 
        position: 'absolute',
        justifyContent: 'flex-start',
        alignItems:'flex-start',
        backgroundColor: 'transparent',
        zIndex: 2
    },
    bottomView:{
        position: 'absolute',
        bottom:0
    }
})