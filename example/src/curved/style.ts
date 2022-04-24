import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: 'transparent',
    zIndex: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2.5,
    alignSelf: 'center',
    overflow: 'visible',
  },
  svg: {
    backgroundColor: 'transparent',
    top: 0,
    position: 'absolute',
    zIndex: 1,
  },
  rowTab: {
    flexDirection: 'row',
    position: 'absolute',
    backgroundColor: 'transparent',
    alignSelf: 'center',
    zIndex: 2,
    bottom: 0,
  },
});
