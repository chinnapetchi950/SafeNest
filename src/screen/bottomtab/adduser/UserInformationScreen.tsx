import Ionicons from "@react-native-vector-icons/ionicons";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, Text, View, TouchableOpacity, StyleSheet } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { colors } from "../../../styles/colors";
import globalstyles from "../../../styles/globalstyles";
import useUserInformationViewModel from "../../../viewmodels/adduser/AddUserViewModel";
import CustomTextField, { CommonButton } from "../../components/TextFieldComponent";
import { SafeAreaView } from "react-native-safe-area-context";


export const UserInformationScreen = () => {
  const viewModel = useUserInformationViewModel();

  const goNext = () => {
    if (viewModel?.step === 1) viewModel?.setStep(2);
    else viewModel?.handleRegister();
  };

  const goBack = () => {
    viewModel?.handleRegisterForm();
  };

  return (
    <SafeAreaView style={{flex:1}}>

  
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#fff",padding:14,marginTop:20 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ---------- Header ---------- */}
        <Text style={[globalstyles.bold_white, styles.bold]}>
          {viewModel?.step === 1 ? "User Information" : "Identity Information"}
        </Text>

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
                  label="Second Name"
                  placeholder="Second Name"
                  error={viewModel.errors.secondName}
                />
              </View>
              <View style={[styles.halfInput, { marginLeft: 8 }]}>
                <CustomTextField
                  value={viewModel.form.firstName}
                  onChangeText={(text) =>
                    viewModel.handleInputChange("firstName", text)
                  }
                  label="First Name"
                  placeholder="First Name"
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
                  label="Fourth Name"
                  placeholder="Fourth Name"
                />
              </View>
              <View style={[styles.halfInput, { marginLeft: 8 }]}>
                <CustomTextField
                  value={viewModel.form.thirdName}
                  onChangeText={(text) =>
                    viewModel.handleInputChange("thirdName", text)
                  }
                  label="Third Name"
                  placeholder="Third Name"
                />
              </View>
            </View>

            <CustomTextField
              value={viewModel.form.lastName}
              onChangeText={(text) =>
                viewModel.handleInputChange("lastName", text)
              }
              label="Last Name"
              placeholder="Last Name"
            />

            <CustomTextField
              value={viewModel.form.email}
              onChangeText={(text) =>
                viewModel.handleInputChange("email", text)
              }
              label="Email"
              placeholder="example@gmail.com"
              prefixIcon="mail-outline"
                        error={viewModel.errors.email}

            />

            <CustomTextField
              value={viewModel.form.phone}
              onChangeText={(text) =>
                viewModel.handleInputChange("phone", text)
              }
              label="Phone Number"
              placeholder="XXXXXXXXXXX"
              prefixIcon="call-outline"
              keyboardType="phone-pad"
                        error={viewModel.errors.phone}

            />

            <CustomTextField
              value={viewModel.form.password}
              onChangeText={(text) =>
                viewModel.handleInputChange("password", text)
              }
              label="Password"
              placeholder="Enter password"
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
              label="National ID Card"
              placeholder="Enter National ID Number"
              suffixIcon="id-card-outline"
                        error={viewModel.errors.nationalId}

            />


            <TouchableOpacity
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
              label="Residence Card"
              placeholder="Enter Residence Card Number"
              suffixIcon="id-card-outline"
          error={viewModel.errors.residenceCard}

            />

            <TouchableOpacity
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
            </TouchableOpacity>

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
        {viewModel?.step === 2 && (
          <CommonButton title="Back" onPress={goBack} style={{ flex: 1, marginRight: 10 }} textStyle={undefined} />
        )}
        <CommonButton
          title={viewModel?.step === 1 ? "Next" : "Submit"}
          onPress={goNext}
          style={{ flex: 1 }} textStyle={undefined}        />
      </View>
    </KeyboardAvoidingView>
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
});