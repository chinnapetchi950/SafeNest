import React, { useState,useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform,
  ScrollView,
  FlatList,
  KeyboardAvoidingView
} from 'react-native';
import CustomTextField, {
  CommonButton,
} from '../../components/TextFieldComponent';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import useFilterBottomSheetViewModel from '../../../viewmodels/staff/CreatingChildViewModel';
import DateTimePicker from '@react-native-community/datetimepicker';
import globalstyles from '../../../styles/globalstyles';
import DropDownPicker from "react-native-dropdown-picker";

import { launchImageLibrary } from 'react-native-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import useRegisterChildViewModel from '../../../viewmodels/useRegisterChildViewModel';
import Storage from '../../../utils/storage';
import { useTranslation } from '../../../contexts/LanguageContext';
export const RegisterChildScreen = () => {
  const navigation = useNavigation();
  const viewModel = useFilterBottomSheetViewModel();
  const { t } = useTranslation();
    const [role, setRole] = useState(null);
    const [openUser, setOpenUser] = useState(false);

  const handleNext = () => {
    navigation.navigate('SessionDetailsScreen');
  };
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [images, setImages] = useState([]);
  const formatDate = date => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

   useEffect(() => {
      const loadRole = async () => {
        const r = await Storage.getItem('admin'); // contains "admin" or "user"
        setRole(r);
      };
      loadRole();
    }, []);
  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const date = new Date(selectedDate);
      const formateDate = formatDate(date);
      const formatted = `${date.getFullYear()}/${String(
        date.getMonth() + 1,
      ).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`;
      viewModel.handleInputChange('date_of_birth', formateDate);
    }
  };

  const pickImage = viewModel.pickImages;

  //   const removeImage = (index: number) => {
  //     //let list = [...images];
  //     // list.splice(index, 1);
  //     // setImages(list);
  //     const updated = images.filter((_, i) => i !== index);
  // setImages([...updated]);
  //   };
  //   const removeImage = (index) => {
  //   setImages(prev => prev.filter((_, i) => i !== index));
  // };
  const removeImage = index => {
    viewModel.removeImage(index);
  };

  const renderItem = ({ item, index }) => (
    <View style={styles.uploadCard}>
      {/* Delete Icon */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <TouchableOpacity onPress={() => removeImage(index)}>
          <Ionicons name="close-circle-outline" size={20} color="red" />
        </TouchableOpacity>
        <View>
          <Text style={styles.fileName}>{item.fileName} - {t('child.attachment')}</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
            <Text style={styles.fileSize}>{item.fileSize}</Text>
          </View>
        </View>
      </View>

      <View style={{ flex: 1 }}>
        {/* Progress Bar */}
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${item.progress}%` }]} />
        </View>
      </View>
    </View>
  );
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0} 
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{t('child.registerNewChild')}</Text>
          <Ionicons name="chevron-forward" size={22} color="#000" />
        </View>

        {/* Step Progress */}
        <View style={styles.progressWrapper}>
          {/* Left Circle */}
          <View style={styles.leftCircle} />

          {/* Line */}
          <View style={styles.line} />

          {/* Right Active Circle */}
          <View style={styles.activeCircle} />
        </View>

        {/* Texts Under Progress Bar */}
        <View style={styles.labelRow}>
          <Text style={styles.inactiveLabel}>{t('child.sessionDetails')}</Text>
          {/* <Text style={styles.activeLabel}>Child Details</Text> */}
        </View>

  <Text style={styles.sectionTitle}>{t('child.childDetails')}</Text>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 80 }}
        >
          <View style={{ flex: 1 }}>
     {role === "admin" && (
  <>
  <Text style={[styles.label,    globalstyles.semibold_black
]}> {t('child.assignChildToStaff')}</Text>
    <DropDownPicker
      open={openUser}
      value={viewModel.form.user_id}
      items={viewModel.users}
      setOpen={setOpenUser}
      setValue={(cb) =>
        viewModel.handleInputChange("user_id", cb(viewModel.form.user_id))
      }
  placeholder={t('child.assignChildToStaffPlaceholder')}
      // style={styles.dropdown}
      zIndex={3000}
      zIndexInverse={1000}
       listMode="SCROLLVIEW"
                        ArrowDownIconComponent={() => (
                            <Ionicons name="chevron-down" size={22} color="#999" />
                          )}
                          ArrowUpIconComponent={() => (
                            <Ionicons name="chevron-up" size={22} color="#999" />
                          )}
                        style={{
                          borderColor: "#D0D0D0",
                          borderRadius: 10,
                          height: 50,
                          marginBottom: 10,
                        }}
                        dropDownContainerStyle={{
                          borderColor: "#D0D0D0",
                          borderRadius: 10,
                        }}
                        placeholderStyle={[
                          globalstyles.regular_FontMediumblack,
                          {
                            color: "#999",
                            fontSize: 16,
                            textAlign: "right",
                          },
                        ]}
                        labelStyle={[
                          globalstyles.regular_FontMediumblack,
                          {
                            color: "#000",
                            fontSize: 14,
                            textAlign: "right",
                          },
                        ]}
                        arrowIconContainerStyle={{
                          position: "absolute",
                          left: 15,
                        }}
    />
  </>
)}

            <CustomTextField
              value={viewModel.form.phone}
              onChangeText={text => viewModel.handleInputChange('phone', text)}
              label={t('auth.phoneNumber')}
              placeholder={t('child.phonePlaceholder')}
              prefixIcon="call-outline"
              keyboardType="number-pad"
              error={viewModel.errors?.phone}
            />

            <CustomTextField
              value={viewModel.form.guardian_name}
              onChangeText={text =>
                viewModel.handleInputChange('guardian_name', text)
              }
              label={t('child.guardianName')}
              placeholder={t('child.guardianNamePlaceholder')}
              prefixIcon="person-sharp"
              error={viewModel.errors?.guardian_name}
            />

            <CustomTextField
              value={viewModel.form.name}
              onChangeText={text => viewModel.handleInputChange('name', text)}
              label={t('child.childName')}
              placeholder={t('child.childNamePlaceholder')}
              prefixIcon="person-sharp"
              error={viewModel.errors?.name}
            />

            {/* <CustomTextField
            value={viewModel.form.playHours}
            onChangeText={text =>
              viewModel.handleInputChange('playHours', text)
            }
            label="Play Hours"
            placeholder="Hour / Minute"
            prefixIcon="time-outline"
            error={viewModel.errors.playHours}
          /> */}

            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => setShowDatePicker(true)}
            >
                <CustomTextField
                value={viewModel.form.date_of_birth}
                label={t('child.dateOfBirth')}
                placeholder={t('child.dateOfBirthPlaceholder')}
                prefixIcon="calendar-outline"
                error={viewModel.errors?.date_of_birth}
                editable={false} // disable manual typing
              />
            </TouchableOpacity>
            <CustomTextField
              value={viewModel.form.address}
              onChangeText={text =>
                viewModel.handleInputChange('address', text)
              }
              label={t('child.address')}
              placeholder={t('child.addressPlaceholder')}
              prefixIcon="location-outline"
              error={viewModel.errors?.address}
            />
            {showDatePicker && (
              <DateTimePicker
                value={
                  viewModel.form.date_of_birth
                    ? new Date(viewModel.form.date_of_birth)
                    : new Date()
                }
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleDateChange}
              />
            )}

            {/* <View style={{ marginTop: 15 }}>
            <Text style={styles.label}>Play Hours</Text>
            <View style={styles.playHoursRow}>
              <View style={styles.playBox}>
                <Ionicons
                  name="caret-up-outline"
                  size={12}
                  color="#A1A1AA"
                  style={styles.arrowUp}
                />
                <Ionicons
                  name="caret-down-outline"
                  size={12}
                  color="#A1A1AA"
                  style={styles.arrowDown}
                />
                <Text style={styles.playText}>Minute</Text>
              </View>

              <View style={styles.playBox}>
                <Ionicons
                  name="caret-up-outline"
                  size={12}
                  color="#A1A1AA"
                  style={styles.arrowUp}
                />
                <Ionicons
                  name="caret-down-outline"
                  size={12}
                  color="#A1A1AA"
                  style={styles.arrowDown}
                />
                <Text style={styles.playText}>Hour</Text>
              </View>
            </View>
          </View> */}
              <Text
              style={[
                globalstyles.semibold_black,
                { alignSelf: 'flex-end', fontWeight: '700', marginRight: 6 },
              ]}
            >
              {t('child.gender')}
            </Text>
            <View style={styles.genderRow}>
              {/* Female */}
              <TouchableOpacity
                style={[styles.genderOption, { marginRight: 30 }]}
                onPress={() => viewModel?.handleSelectGender('female')}
              >
                <Text style={styles.optionText}>{t('child.female')}</Text>
                <View
                  style={[
                    styles.checkbox,
                    viewModel?.selectedGender === 'female' &&
                      styles.checkboxSelected,
                  ]}
                >
                  {viewModel?.selectedGender === 'female' && (
                    <Ionicons name="checkmark" size={14} color="#fff" />
                  )}
                </View>
              </TouchableOpacity>

              {/* Male */}
              <TouchableOpacity
                style={styles.genderOption}
                onPress={() => viewModel?.handleSelectGender('male')}
              >
                <Text style={styles.optionText}>{t('child.male')}</Text>
                <View
                  style={[
                    styles.checkbox,
                    viewModel?.selectedGender === 'male' &&
                      styles.checkboxSelected,
                  ]}
                >
                  {viewModel?.selectedGender === 'male' && (
                    <Ionicons name="checkmark" size={14} color="#fff" />
                  )}
                </View>
              </TouchableOpacity>
            </View>

            <View style={{ marginTop: 10 }}>
              {/* Initial Empty Upload Box */}
                <Text
                style={[
                  globalstyles.regular_FontblackFontWeight,
                  {
                    alignSelf: 'flex-end',
                    fontWeight: '400',
                    marginRight: 6,
                    marginBottom: 10,
                  },
                ]}
              >
                {t('child.uploadChildPhoto')}
              </Text>
              {images.length === 0 && (
                <TouchableOpacity style={styles.emptyBox} onPress={pickImage}>
                  <Ionicons name={'images-outline'} size={22} color="#3AB54A" />
                  <Text style={styles.addText}>{t('child.addImageHere')}</Text>
                </TouchableOpacity>
              )}

              {/* Uploaded List */}
              <FlatList
                data={viewModel.form.pictures}
                keyExtractor={(_, i) => i.toString()}
                renderItem={renderItem}
                extraData={viewModel.form.pictures}
              />

              {/* Add More Button */}
              {viewModel.form.pictures.length < 5 &&
                viewModel.form.pictures.length != 0 && (
                  <TouchableOpacity
                    onPress={pickImage}
                    style={styles.addMoreBtn}
                  >
        <Text style={styles.addMoreText}>{t('child.addMore')}</Text>
                  </TouchableOpacity>
                )}
            </View>
          </View>
        </ScrollView>
        <View style={styles.bottomContainer}>
            <TouchableOpacity
            onPress={viewModel?.handleNext}
            style={[
              styles.button,
              viewModel.isnextButtonDisabled && styles.buttonDisabled,
            ]}
            disabled={viewModel.isnextButtonDisabled}
          >
      <Text style={styles.buttonText}>{t('buttons.next')}</Text>
          </TouchableOpacity>
        </View>
        {/* <CommonButton
          title={'Next'}
          onPress={() => {
            navigation.navigate('SessionDetailsScreen');
          }}
          style={{}}
          textStyle={undefined}
        /> */}
      </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  arrowUp: {
    position: 'absolute',
    top: 5,
    right: 10,
  },
  arrowDown: {
    position: 'absolute',
    bottom: 5,
    right: 10,
  },
  options: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 15,
    color: '#555',
    marginRight: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#aaa',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  checkboxSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  dropdown: { marginBottom: 15, borderRadius: 10 },

  playHoursRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    alignSelf: 'flex-end',
  },

  playBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E4E4E7',
    borderRadius: 8,
    backgroundColor: '#FAFAFA',
    paddingVertical: 10,
    alignItems: 'center',
    marginRight: 8,
    position: 'relative',
  },
  playText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginRight: 10,
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    // marginHorizontal:40,
  },
  stepBarActive: {
    flex: 1,
    height: 4,
    backgroundColor: '#A37BFF',
    borderRadius: 10,
  },
  stepBarInactive: {
    flex: 1,
    height: 4,
    backgroundColor: '#E5E5E5',
    borderRadius: 10,
    marginLeft: 5,
  },
  sectionTitle: {
    color: '#A37BFF',
    fontWeight: '700',
    fontSize: 18,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    textAlign: 'center',
  },
  label: {
    marginTop: 10,
    marginBottom:6,
    textAlign:'right'
  },
  genderRow: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    marginTop: 10,
    marginBottom: 10,
  },
  genderOption: {
    flexDirection: 'row',
    borderRadius: 8,
    paddingVertical: 8,
    //paddingHorizontal: 4,
    marginRight: 10,
  },
  genderOptionActive: {
    backgroundColor: '#A37BFF',
  },
  genderText: {
    color: '#999',
    fontWeight: '500',
  },
  genderTextActive: {
    color: '#fff',
  },
  uploadBox: {
    marginVertical: 15,
  },
  addImageBtn: {
    borderWidth: 1,
    borderColor: '#A37BFF',
    borderStyle: 'dashed',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },
  addImageText: {
    color: '#A37BFF',
    fontWeight: '500',
  },
  nextBtn: {
    backgroundColor: '#A37BFF',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  nextBtnDisabled: {
    backgroundColor: '#E0D4FF',
  },
  nextText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },

  pointer: {
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderTopWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#fff',
    marginTop: -1,
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  reset: { color: '#7A5AF8', fontWeight: '600' },
  filter: { color: '#7A5AF8', fontWeight: '600' },
  field: { marginBottom: 15 },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 45,
  },
  input: { flex: 1, marginLeft: 8 },

  //  filter: {
  //   color: "#000",
  //   fontWeight: "600",
  // },

  selected: {
    color: '#4CAF50',
    fontWeight: '700',
  },
  // overlay: {
  //   flex: 1,
  //   justifyContent: "flex-start",
  //   alignItems: "flex-end",
  //   backgroundColor: "rgba(0,0,0,0.2)",
  //   paddingTop: 60,
  //   paddingRight: 20,
  // },
  // menuContainer: {
  //   backgroundColor: "#fff",
  //   borderRadius: 10,
  //   width: 220,
  //   elevation: 5,
  //   paddingVertical: 5,
  // },
  // menuItem: {
  //   flexDirection: "row",
  //   justifyContent: "space-between",
  //   alignItems: "center",
  //   paddingVertical: 12,
  //   paddingHorizontal: 15,
  // },
  // menuItemLast: {
  //   borderTopWidth: 0.5,
  //   borderTopColor: "#E5E5E5",
  // },
  // menuText: { color: "#000" },
  // pointer: {
  //   position: "absolute",
  //   top: -8,
  //   right: 15,
  //   width: 15,
  //   height: 15,
  //   backgroundColor: "#fff",
  //   transform: [{ rotate: "45deg" }],
  // },

  emptyBox: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
  },
  uploadIcon: {
    fontSize: 20,
    color: '#3AB54A',
    marginRight: 10,
  },
  addText: {
    color: '#3AB54A',
    fontSize: 15,
  },

  uploadCard: {
    flexDirection: 'column',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: 'white',
    padding: 18,
    borderRadius: 14,
    marginVertical: 10,
    //alignItems: 'flex-start',
  },
  deleteIcon: {
    color: 'red',
    fontSize: 22,
    marginRight: 12,
  },
  fileName: {
    color: '#3AB54A',
    fontWeight: '600',
    fontSize: 14,
    marginLeft: 10,
  },
  fileSize: {
    color: '#9CA3AF',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 10,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 20,
    marginTop: 10,
    marginLeft: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3AB54A',
    borderRadius: 20,
  },

  addMoreBtn: {
    alignSelf: 'center',
    marginTop: 10,
  },
  addMoreText: {
    color: '#A278F4',
    fontWeight: '600',
    fontSize: 15,
  },
  progressWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    //marginBottom: 15,
    marginHorizontal: 50,
    marginVertical: 10,
  },

  leftCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#D0D0D0',
    backgroundColor: '#fff',
  },

  line: {
    flex: 1,
    height: 2,
    backgroundColor: '#D0D0D0',
    marginHorizontal: 4,
  },

  activeCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#A278F4',
  },

  /* labels below bar */
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
  },

  inactiveLabel: {
    fontSize: 11,
    color: '#C4C4C4',
  },

  activeLabel: {
    fontSize: 13,
    color: '#A278F4',
    fontWeight: '600',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  button: {
    width: '95%',
    backgroundColor: '#A278F4',
    borderRadius: 25,
    paddingVertical: 14,
    alignItems: 'center',
    marginLeft: 30,
    justifyContent: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
