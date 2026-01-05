import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { RFValue } from "react-native-responsive-fontsize";
import { useTranslation } from 'react-i18next';

const LanguageHeader = ({
  title = "",
  showLanguage = true,
  onLanguageChange = () => {},
  leftComponent = null,
  rightComponent = null,
  headerTextStyle,
  headerContainerStyle = {},
}) => {
  // ✅ Correct hook usage
  const { t, i18n } = useTranslation();

  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState(
    i18n.language || "en"
  );

  useEffect(() => {
    setCurrentLanguage(i18n.language || "en");
  }, [i18n.language]);

  const toggleDropdown = () => setDropdownVisible(!dropdownVisible);

  const selectLanguage = async (langCode) => {
    await i18n.changeLanguage(langCode); // ✅ correct
    setCurrentLanguage(langCode);
    onLanguageChange(langCode);
    setDropdownVisible(false);
  };

  const getLanguageDisplay = (code) => (code === "ar" ? "Ar" : "En");

  const languages = [
    { code: "en", label: t("language.english") },
    { code: "ar", label: t("language.arabic") },
  ];

  return (
    <View style={[styles.container, headerContainerStyle]}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />

      <View style={styles.headerRow}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {leftComponent}
          <Text style={[styles.title, headerTextStyle]}>{title}</Text>
        </View>

        {rightComponent ? (
          rightComponent
        ) : (
          showLanguage && (
            <View>
              <TouchableOpacity style={styles.langBox} onPress={toggleDropdown}>
                <Image
                  source={require("../../../assets/images/flag.png")}
                  style={styles.flag}
                />
                <Text style={styles.langText}>
                  {getLanguageDisplay(currentLanguage)}
                </Text>
                <Ionicons
                  name={dropdownVisible ? "chevron-up" : "chevron-down"}
                  size={16}
                  color="#555"
                />
              </TouchableOpacity>

              {dropdownVisible && (
                <View style={styles.dropdown}>
                  {languages.map((lang) => (
                    <TouchableOpacity
                      key={lang.code}
                      style={styles.dropdownItem}
                      onPress={() => selectLanguage(lang.code)}
                    >
                      <Text style={styles.dropdownText}>{lang.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          )
        )}
      </View>
    </View>
  );
};

export default LanguageHeader;



const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: "#fff",
    elevation: 5,
    zIndex: 10,
  },
  headerRow: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    position: "relative",
  },
  title: {
    fontSize: RFValue(18),
    fontWeight: "700",
    color: "#000",
    marginLeft: 10,
  },
  langBox: {
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
  },
  flag: {
    width: 22,
    height: 22,
    borderRadius: 50,
    marginRight: 5,
  },
  langText: {
    fontSize: RFValue(14),
    marginRight: 4,
    color: "#000",
  },
  dropdown: {
    position: "absolute",
    top: 40,
    right: 0,
    backgroundColor: "#fff",
    elevation: 5,
    borderRadius: 8,
    paddingVertical: 5,
    width: 120,
    zIndex: 100,
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  dropdownText: {
    fontSize: RFValue(14),
    color: "#000",
  },
});
