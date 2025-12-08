import React, { useState } from 'react';
import {
  TouchableOpacity,
  Animated,
  I18nManager,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ProgressBarRTL from '../../components/ProgressLine';
import { SafeAreaView } from 'react-native-safe-area-context';

const AccountTypeScreen = () => {
  const [selected, setSelected] = useState('');
  const navigation = useNavigation();

  const descriptions = {
    manager:
      'This account is intended for managers. It allows you to oversee users, manage activities, and access overall analytics.',
    user: 'This account is intended for staff within the play area. It allows you to record children’s attendance, manage play sessions, and communicate with parents.',
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}

      <View
  style={{
    //flex: 1,
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'flex-end', // 👈 pushes BOTH to the right
    alignItems: 'center',
  }}
>
  <Text style={styles.headerTitle}>Identity Information</Text>

  <Ionicons
  onPress={()=>navigation.goBack()}
    name="chevron-forward-outline"
    size={24}
    color="#111"
    style={{ marginLeft: 6 }} // spacing between text & icon
  />
</View>

      {/* Reusable Progress */}
      <ProgressBarRTL totalSteps={3} currentStep={1} />

      {/* Title */}
      <Text style={styles.title}>Account Type</Text>

      {/* Options */}
      <View style={styles.optionContainer}>
        <TouchableOpacity
          style={[
            styles.option,
            selected === 'manager' && styles.optionSelected,
          ]}
          onPress={() => setSelected('manager')}
        >
          <Ionicons
            name="person-outline"
            size={38}
            color={selected === 'manager' ? '#fff' : '#B5B5C3'}
          />
          <Text
            style={[
              styles.optionText,
              selected === 'manager' && styles.selectedText,
            ]}
          >
            Manager
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.option, selected === 'user' && styles.optionSelected]}
          onPress={() => setSelected('user')}
        >
          <Ionicons
            name="person-circle-outline"
            size={38}
            color={selected === 'user' ? '#fff' : '#B5B5C3'}
          />
          <Text
            style={[
              styles.optionText,
              selected === 'user' && styles.selectedText,
            ]}
          >
            User
          </Text>
        </TouchableOpacity>
      </View>

      {/* Dynamic Description */}
      <Text style={styles.description}>{descriptions[selected]}</Text>

      {/* Next Button */}
      <TouchableOpacity
        activeOpacity={0.8}
        disabled={selected === ''?true:false}
        onPress={() => {
          navigation.navigate('UserInformationScreen');
        }}
        style={styles.bottomButtonWrapper}
      >
        <View
          style={[
            styles.nextButton,
            {
              borderRadius: 25,
              paddingVertical: 14,
              backgroundColor: selected === '' ? '#ccc' : '#A278F4',
            },
          ]}
        >
          <Text style={styles.nextText}>Next</Text>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default AccountTypeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 18,
    color: '#111',
    fontWeight: '600',
    textAlign:'right'
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: 30,
    color: '#A594F9',
    fontWeight: '600',
  },
  optionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 40,
  },
  option: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#F1F1F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionSelected: {
    backgroundColor: '#A594F9',
  },
  optionText: {
    fontSize: 13,
    marginTop: 6,
    color: '#A1A1AA',
    fontWeight: '500',
  },
  selectedText: {
    color: '#fff',
    fontWeight: '600',
  },
  description: {
    textAlign: 'center',
    color: '#6B7280',
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 40,
  },

  bottomButtonWrapper: {
    position: 'absolute',
    bottom: 30, // adjust spacing from bottom
    left: 20,
    right: 20,
    borderRadius: 25,
  },
  nextButton: {
    //height: 40,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },

  container1: {
    width: '100%',
    paddingHorizontal: 16,
    marginTop: 20,
  },
  lineContainer: {
    position: 'relative',
    height: 4,
    justifyContent: 'center',
  },
  fullLine: {
    position: 'absolute',
    height: 3,
    width: '100%',
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
  },
  activeLine: {
    position: 'absolute',
    height: 3,
    borderRadius: 3,
    right: 0, // Start from right for RTL
  },
  stepsRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: -7,
  },
  stepItem: {
    alignItems: 'center',
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  label: {
    fontSize: 12,
    marginTop: 6,
    textAlign: 'center',
  },
});
