import { useState, useEffect } from "react";
import { Dimensions, StyleSheet, Text, StatusBar } from "react-native";
const { width: ScreenWidth } = Dimensions.get("screen");
import LoginScreen from "react-native-login-screen";
import UspaceClient from "uspace-api-wrapper";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import * as SecureStore from "expo-secure-store";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();

export interface LoginProps {
  setSession: Function;
}

export default function Login({ setSession }: LoginProps) {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [stayLoggedIn, setStayLoggedIn] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const uClient = new UspaceClient();

  useEffect(() => {
    const tryLogin = async () => {
      const username: string | null = await SecureStore.getItemAsync(
        "ucal-username"
      );
      const password: string | null = await SecureStore.getItemAsync(
        "ucal-password"
      );
      console.log(username, password);
      if (username && password) {
        setIsLoading(true);
        const uClient = new UspaceClient();
        const loginResponse = await uClient.login(username, password);

        if (loginResponse.ok) {
          setSession(uClient.getSession);
          return;
        }

        setErrorMessage(await loginResponse.text());
      }
    };

    tryLogin()
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        SplashScreen.hideAsync();
        setIsLoading(false);
      });
  }, []);

  return (
    <>
      <LoginScreen
        style={styles.loginContainer}
        logoImageSource={require("../assets/favicon.png")}
        loginButtonText={isLoading ? "Logging in..." : "Login"}
        loginButtonStyle={{
          backgroundColor: isLoading ? "#ADD8E6" : "#25A9E2",
        }}
        onLoginPress={async () => {
          if (isLoading) return;

          setIsLoading(true);
          setErrorMessage("");
          const loginResponse = await uClient.login(username, password);

          if (loginResponse.ok) {
            if (stayLoggedIn) {
              await SecureStore.setItemAsync("ucal-username", username);
              await SecureStore.setItemAsync("ucal-password", password);
            }

            setSession(uClient.getSession);
          } else {
            setErrorMessage(await loginResponse.text());
          }

          setIsLoading(false);
        }}
        onSignupPress={() => {}}
        onEmailChange={setUsername}
        onPasswordChange={setPassword}
        enablePasswordValidation
        disableSignup
        disableDivider
        disableSocialButtons
        emailPlaceholder={"Username"}
        disableEmailTooltip
        textInputChildren={
          <BouncyCheckbox
            style={styles.checkbox}
            size={25}
            fillColor="#25A9E2"
            text="Stay signed in"
            iconStyle={{ borderColor: "#25A9E2" }}
            innerIconStyle={{ borderWidth: 2 }}
            textStyle={{
              textDecorationLine: "none",
            }}
            onPress={(isChecked) => {
              setStayLoggedIn(isChecked);
            }}
          />
        }
        customSocialLoginButtons={
          <Text style={styles.errorMessage}>{errorMessage}</Text>
        }
      />
    </>
  );
}

const styles = StyleSheet.create({
  loginContainer: {
    paddingTop: StatusBar.currentHeight,
  },
  checkbox: {
    marginTop: 16,
    width: ScreenWidth * 0.9,
  },
  errorMessage: {
    color: "#cc0000",
    textAlign: "center",
  },
});
