import {Dimensions, Platform, StatusBar} from 'react-native'

const {height: W_HEIGHT, width: W_WIDTH} = Dimensions.get('window')

let isIPhoneX = false

if (Platform.OS === 'ios' && !Platform.isPad) {
  isIPhoneX =
    W_HEIGHT === 780 ||
    W_WIDTH === 780 ||
    W_HEIGHT === 812 ||
    W_WIDTH === 812 ||
    W_HEIGHT === 844 ||
    W_WIDTH === 844 ||
    W_HEIGHT === 896 ||
    W_WIDTH === 896 ||
    W_HEIGHT === 926 ||
    W_WIDTH === 926
}

const screenWidth = Dimensions.get('window').width
const screenHeight = Dimensions.get('window').height

const widthPx = (widthPercent: number) => {
  const elemWidth = typeof widthPercent === 'number' ? widthPercent : parseFloat(widthPercent)
  return (screenWidth * elemWidth) / 100
}

const heightPx = (heightPercent: number) => {
  const elemHeight = typeof heightPercent === 'number' ? heightPercent : parseFloat(heightPercent)
  return ((screenHeight - Number(getStatusBarHeight().toFixed(0))) * elemHeight) / 100
}

const getStatusBarHeight = () => {
  return Platform.select({
    ios: isIPhoneX ? 78 : 20,
    android: Number(StatusBar.currentHeight) > 24 ? 0 : StatusBar.currentHeight,
    default: 0
  })
}

const [shortDimension, longDimension] =
  W_WIDTH < W_HEIGHT ? [W_WIDTH, W_HEIGHT] : [W_HEIGHT, W_WIDTH]

// guideline size
const guidelineBaseWidth = 375
const guidelineBaseHeight = 812

const scale = (size: number) =>
  Number(Number((shortDimension / guidelineBaseWidth) * size).toFixed())
const verticalScale = (size: number) =>
  Number(Number((longDimension / guidelineBaseHeight) * size).toFixed())
const moderateScale = (size: number, factor = 0.5) =>
  Number(Number(size + (scale(size) - size) * factor).toFixed())

const INPUT_HEIGHT = verticalScale(56)

export const STATUSBAR_HEIGHT = getStatusBarHeight() / 1.8

export {
  getStatusBarHeight,
  heightPx,
  INPUT_HEIGHT,
  moderateScale,
  scale,
  verticalScale,
  W_HEIGHT,
  W_WIDTH,
  widthPx
}
