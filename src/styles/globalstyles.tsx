import { Dimensions, StyleSheet } from "react-native"
import { colors } from "./colors"

export const height = {
  windowWidth: Dimensions.get('window').width,
  windowHeight: Dimensions.get('window').height
}
export const fontSize={
    fontSize:10,
    fs11:11,
    fs12:12,
    fs13:13,
    fs14:14,
    fs15:15,
    fs16:16,
    fs17:17,
    fs18:18,
    fs19:19,
    fs20:20,

}
export const fontFamily={
    poppin_regular:"ReadexPro-Regular.ttf",
    poppin_bold:"ReadexPro-Bold.ttf",
    poppin_semibold:"ReadexPro-SemiBold.ttf",
    poppin_medium:"ReadexPro-Medium.ttf",
    poppin_light:"ReadexPro-Light.ttf",
}
export default StyleSheet.create({
  mainbg:{
backgroundColor:"#FFFFFF",
flex:1,
padding:10,
paddingVertical:20
  },
  center: { alignSelf: "center", },
  
  regular_Font: {
    fontSize: fontSize.fs15,
    color: colors.white,
    fontFamily: fontFamily.poppin_regular
  },
  regular_FontMedium: {
    fontSize: fontSize.fs15,
    color: colors.white,
    fontFamily: fontFamily.poppin_medium
  },
 
  regular_FontMediumblack: {
    fontSize: fontSize.fs15,
    color: colors.black,
    fontFamily: fontFamily.poppin_medium
  },

  regular_Fontblack: {
    fontSize: fontSize.fs13,
    color: colors.black,
    fontFamily: fontFamily.poppin_regular
  },
  regular_FontblackFontWeight: {
    fontSize: fontSize.fs13,
    color: colors.black,
    fontFamily: fontFamily.poppin_regular,
    fontWeight: "700"
  },
  semibold_black: {
    fontSize: fontSize.fs15,
    color: colors.black,
    fontFamily: fontFamily.poppin_semibold,
    fontWeight:'700'
  },
  bold_white: {
    fontSize: fontSize.fs15,
    color: colors.white,
    fontFamily: fontFamily.poppin_bold
  },

  spbtwn: {
    justifyContent: "space-between",
    flexDirection: "row"
  },
  
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  main: {
    flexDirection: "row", margin: 10,
    backgroundColor: colors.white, borderRadius: 45,
    elevation: 5,

    // iOS shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  button: {
    flex: 1,
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 15,
    marginLeft: 10,
    alignItems: 'center',
  },
 

  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    justifyContent: 'center',
    alignItems: 'center',
  },
  

})


