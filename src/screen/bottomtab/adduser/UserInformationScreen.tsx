import Ionicons from 'react-native-vector-icons/Ionicons';
import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, Text, View, TouchableOpacity, StyleSheet } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { colors } from "../../../styles/colors";
import globalstyles from "../../../styles/globalstyles";
import useUserInformationViewModel from "../../../viewmodels/adduser/AddUserViewModel";
import CustomTextField, { CommonButton } from "../../components/TextFieldComponent";
import { SafeAreaView } from "react-native-safe-area-context";
import ProgressBarRTL from '../../components/ProgressLine';
import React from 'react';
import SuccessModal from '../../components/UserSuccessModal';
import ViewAccountModal from '../../components/ViewAccountModal';
import { useTranslation } from 'react-i18next';

export const UserInformationScreen = ({navigation}) => {
  const { t } = useTranslation();
  const viewModel = useUserInformationViewModel();
const [showAccountModal, setShowAccountModal] = useState(false);

  const goNext = () => {
    if (viewModel?.step === 1)     viewModel?.handleRegisterForm();

      //viewModel?.setStep(2);
    else viewModel?.handleRegister();
  };

  const goBack = () => {
    viewModel?.handleRegisterForm();
  };

  return (
    <SafeAreaView style={{flex:1,backgroundColor:'#fff'}}>
    <View
  style={{
    //flex: 1,
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'flex-end', // 👈 pushes BOTH to the right
    alignItems: 'center',
    marginHorizontal:20
  }}
>
  <Text style={styles.headerTitle}>{viewModel?.step === 1 ? t('user.userInformation') : t('user.accountInformation')}</Text>

  <Ionicons
  onPress={()=>{viewModel?.step === 2?goBack():navigation.goBack()}}
    name="chevron-forward-outline"
    size={24}
    color="#111"
    style={{ marginLeft: 6 }} // spacing between text & icon
  />
</View>

      {/* Reusable Progress */}
      <ProgressBarRTL totalSteps={3} currentStep={viewModel?.step === 1?2:3} />

      {/* Title */}
      <Text style={styles.titlehed}>{t('user.accountType')}</Text>
  
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#fff",padding:14,marginTop:20 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={{
        //paddingHorizontal: 20,
        paddingBottom: 180,   // 👈 IMPORTANT: add space for bottom button
      }} showsVerticalScrollIndicator={false}>
        {/* ---------- Header ---------- */}
        {/* <Text style={[globalstyles.bold_white, styles.bold]}>
          {viewModel?.step === 1 ? "User Information" : "Identity Information"}
        </Text> */}

        {/* ---------- STEP 1: User Info ---------- */}
        {viewModel?.step === 1 && (
          <>
            <View style={styles.row}>
              <View style={styles.halfInput}>
                <CustomTextField
                  value={viewModel.form.secondName}
                  onChangeText={(text) =>
                    viewModel.handleInputChange("secondName", text)
                  }
                  label={t('user.secondName')}
                  placeholder={t('user.secondNamePlaceholder')}
                  error={viewModel.errors.secondName}
                />
              </View>
              <View style={[styles.halfInput, { marginLeft: 8 }]}>
                <CustomTextField
                  value={viewModel.form.firstName}
                  onChangeText={(text) =>
                    viewModel.handleInputChange("firstName", text)
                  }
                  label={t('user.firstName')}
                  placeholder={t('user.firstNamePlaceholder')}
                                error={viewModel.errors.firstName}

                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.halfInput}>
                <CustomTextField
                  value={viewModel.form.fourthName}
                  onChangeText={(text) =>
                    viewModel.handleInputChange("fourthName", text)
                  }
                  label={t('user.fourthName')}
                  placeholder={t('user.fourthNamePlaceholder')}
                />
              </View>
              <View style={[styles.halfInput, { marginLeft: 8 }]}>
                <CustomTextField
                  value={viewModel.form.thirdName}
                  onChangeText={(text) =>
                    viewModel.handleInputChange("thirdName", text)
                  }
                  label={t('user.thirdName')}
                  placeholder={t('user.thirdNamePlaceholder')}
                />
              </View>
            </View>

            <CustomTextField
              value={viewModel.form.lastName}
              onChangeText={(text) =>
                viewModel.handleInputChange("lastName", text)
              }
              label={t('user.lastName')}
              placeholder={t('user.lastNamePlaceholder')}
            />

            <CustomTextField
              value={viewModel.form.email}
              onChangeText={(text) =>
                viewModel.handleInputChange("email", text)
              }
              label={t('auth.email')}
              placeholder={t('auth.emailPlaceholder')}
              prefixIcon="mail-outline"
                        error={viewModel.errors.email}

            />

            <CustomTextField
              value={viewModel.form.phone}
              onChangeText={(text) =>
                viewModel.handleInputChange("phone", text)
              }
              label={t('auth.phoneNumber')}
              placeholder={t('auth.phonePlaceholder')}
              prefixIcon="call-outline"
              keyboardType="phone-pad"
                        error={viewModel.errors.phone}

            />

            <CustomTextField
              value={viewModel.form.password}
              onChangeText={(text) =>
                viewModel.handleInputChange("password", text)
              }
              label={t('auth.password')}
              placeholder={t('auth.passwordPlaceholder')}
              prefixIcon="eye-outline"
                        error={viewModel.errors.password}

              isPassword
            />
          </>
        )}

        {/* ---------- STEP 2: Identity Info ---------- */}
        {viewModel?.step === 2 && (
          <>
            <CustomTextField
              value={viewModel.form.nationalId}
              onChangeText={(text) =>
                viewModel.handleInputChange("nationalId", text)
              }
              label={t('user.nationalId')}
              placeholder={t('user.nationalIdPlaceholder')}
              suffixIcon="id-card-outline"
                        error={viewModel.errors.nationalId}

            />


            {/* <TouchableOpacity
              onPress={() => viewModel.selectImage("nationalId")}
            >
              <CustomTextField
                value={viewModel.form.nationalIdImage}
                onChangeText={(text) =>
                  viewModel.handleInputChange("nationalIdImage", text)
                }
                label="National ID Card Image"
                placeholder="Upload National ID Card"
                suffixIcon="arrow-back-outline"
                          error={viewModel.errors.nationalIdImage}

              />
            </TouchableOpacity> */}
            <TouchableOpacity onPress={() => viewModel.selectImage("nationalId")}>
  <CustomTextField
    value={viewModel.form.nationalIdImage?.fileName || ""}
    label={t('user.nationalIdImage')}
    placeholder={t('user.nationalIdImagePlaceholder')}
    suffixIcon="arrow-back-outline"
    editable={false}
    error={viewModel.errors.nationalIdImage}
  />
</TouchableOpacity>

            {viewModel.uploads.nationalId.file && (
              <View style={styles.fileBox}>
                <TouchableOpacity
                  onPress={() => viewModel.handleRemoveFile("nationalId")}
                  style={styles.closeBtn}
                >
                  <Ionicons name="close-circle" size={20} color="#FF6B6B" />
                </TouchableOpacity>
                <View style={{ flex: 1 }}>
                  <Text style={styles.fileName}>
                    {viewModel.uploads.nationalId.file.fileName}
                  </Text>
                  <View style={styles.progressBarContainer}>
                    <LinearGradient
                      colors={["#4ADE80", "#22C55E"]}
                      style={[
                        styles.progressBar,
                        {
                          width: `${
                            viewModel.uploads.nationalId.progress * 100
                          }%`,
                        },
                      ]}
                    />
                  </View>
                </View>
              </View>
            )}

            <CustomTextField
              value={viewModel.form.residenceCard}
              onChangeText={(text) =>
                viewModel.handleInputChange("residenceCard", text)
              }
              label={t('user.residenceCard')}
              placeholder={t('user.residenceCardPlaceholder')}
              suffixIcon="id-card-outline"
          error={viewModel.errors.residenceCard}

            />

<TouchableOpacity onPress={() => viewModel.selectImage("residence")}>
  <CustomTextField
    value={viewModel.form.residenceCardImage?.fileName || ""}
    label={t('user.residenceCardImage')}
    placeholder={t('user.residenceCardImagePlaceholder')}
    suffixIcon="arrow-back-outline"
    error={viewModel?.errors.residenceCardImage}
    editable={false}
  />
</TouchableOpacity>
            {/* <TouchableOpacity
              onPress={() => viewModel.selectImage("residence")}
            >
              <CustomTextField
                value={viewModel.form.residenceCardImage}
                onChangeText={(text) =>
                  viewModel.handleInputChange("residenceCardImage", text)
                }
                label="Residence Card Image"
                placeholder="Upload Residence Card"
                suffixIcon="arrow-back-outline"
                            error={viewModel.errors.residenceCardImage}

              />
            </TouchableOpacity> */}

            {viewModel.uploads.residence.file && (
              <View style={styles.fileBox}>
                <TouchableOpacity
                  onPress={() => viewModel.handleRemoveFile("residence")}
                  style={styles.closeBtn}
                >
                  <Ionicons name="close-circle" size={20} color="#FF6B6B" />
                </TouchableOpacity>
                <View style={{ flex: 1 }}>
                  <Text style={styles.fileName}>
                    {viewModel.uploads.residence.file.fileName}
                  </Text>
                  <View style={styles.progressBarContainer}>
                    <LinearGradient
                      colors={["#4ADE80", "#22C55E"]}
                      style={[
                        styles.progressBar,
                        {
                          width: `${
                            viewModel.uploads.residence.progress * 100
                          }%`,
                        },
                      ]}
                    />
                  </View>
                </View>
              </View>
            )}
          </>
        )}
      </ScrollView>

      {/* ---------- Bottom Buttons ---------- */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          padding: 20,
          backgroundColor: "#fff",
        }}
      >
        
        {/* {viewModel?.step === 2 && (
          <CommonButton title="Back" onPress={goBack} style={{ flex: 1, marginRight: 10 }} textStyle={undefined} />
        )} */}
        {/* <CommonButton
          title={viewModel?.step === 1 ? "Next" : "Add"}
          onPress={goNext}
          style={{ flex: 1,backgroundColor:'red' }} textStyle={undefined}        /> */}


              
      </View>
    </KeyboardAvoidingView>
              <View style={styles.bottomContainer}>
  <TouchableOpacity
    onPress={goNext}
    style={[
      styles.button,
      (viewModel.step === 1
        ? !viewModel.isStep1Valid()
        : !viewModel.isStep2Valid()) && styles.buttonDisabled,
    ]}
    disabled={
      viewModel.step === 1
        ? !viewModel.isStep1Valid()
        : !viewModel.isStep2Valid()
    }
  >
    <Text style={styles.buttonText}>
      {viewModel.step === 1 ? t('buttons.next') : t('buttons.add')}
    </Text>
  </TouchableOpacity>
</View>

<SuccessModal
        visible={viewModel?.showSuccess}
        onClose={() => {viewModel?.setShowSuccess(false)
          navigation.navigate("BottomTabs", {screen: "Home"});
        }}
        onDone={() => {
         viewModel?.setShowSuccess(false);
         navigation.navigate("BottomTabs", {screen: "Home"})
          console.log("Done clicked");
        }}
        onViewAccount={() => {
          console.log("View account clicked");
          setTimeout(() => setShowAccountModal(true), 200)
        }}
      />
      <ViewAccountModal
  visible={showAccountModal}
  user={viewModel?.user}
  onClose={() =>{viewModel?.setShowSuccess(false),setShowAccountModal(false),navigation.navigate("BottomTabs", {screen: "Home"})}}
/>
      </SafeAreaView>
  );
};



const styles = StyleSheet.create({

uploadBox: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  placeholder: { marginLeft: 8, color: "#666" },
  fileBox: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  closeBtn: { marginRight: 10 },
  fileName: { color: "#22C55E", fontWeight: "500" },
  fileSize: { fontSize: 12, color: "#999", marginVertical: 4 },
  progressBarContainer: {
    height: 5,
    borderRadius: 5,
    backgroundColor: "#E5E7EB",
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: 5,
  },
  uploadingOverlay: {
    position: "absolute",
    top: "40%",
    left: "35%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 8,
    elevation: 3,
  },

    bold:{alignSelf:"center",
        color:colors.primary,
        fontSize:20,
        fontWeight:"700",
        paddingVertical:8
    },
  container: {
    paddingHorizontal: 20,
    paddingBottom: 100,
    marginTop:15
  },
  row: {
    flexDirection: "row",
    marginTop:20
  
  },
  halfInput: {
   width:"48%"
  },
  nextButtonWrapper: {
    position: "absolute",
    bottom: 25,
    left: 20,
    right: 20,
  },
  nextButton: {
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  nextText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
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
    justifyContent: 'center',
    alignSelf:'center',
    //marginLeft:40
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
   headerTitle: {
    fontSize: 18,
    color: '#111',
    fontWeight: '600',
    textAlign:'right'
  },
   titlehed: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: 5,
    color: '#A594F9',
    fontWeight: '600',
  },
});