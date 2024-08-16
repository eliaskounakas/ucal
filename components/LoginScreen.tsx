import { useState } from 'react'
import { Dimensions, StyleSheet, Text, ActivityIndicator, View } from 'react-native';
const { width: ScreenWidth } = Dimensions.get("screen");
import LoginScreen from 'react-native-login-screen'
import UspaceClient from 'uspace-api-wrapper';
import BouncyCheckbox from "react-native-bouncy-checkbox";

export interface LoginProps {
  setSession: Function,
}

export default function Login({ setSession }: LoginProps) {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [stayLoggedIn, setStayLoggedIn] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const uClient = new UspaceClient();
  
  return (
      <>
        <LoginScreen
          style={styles.loginContainer}
          logoImageSource={require('../assets/icon.png')}
          loginButtonText={isLoading ? "Logging in..."  : "Login"}
          loginButtonStyle={{ backgroundColor: isLoading ? "#ADD8E6" : "#25A9E2" }}
          onLoginPress={async () => {
            setIsLoading(true);
            setErrorMessage('');
            const loginResponse = await uClient.login(username, password);

            if (loginResponse.ok) {
              setSession(uClient.getSession);
              if (stayLoggedIn) {
                // Save session to local storage
              }
            } else {
              setErrorMessage(await loginResponse.text())
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
              onPress={(isChecked) => {setStayLoggedIn(isChecked)}}
            />
          }
          customSocialLoginButtons={
            <Text style={styles.errorMessage}>
              {errorMessage}
            </Text>
          }
        />
      </>
  )
}

const styles = StyleSheet.create({
  loginContainer: {
    paddingTop: '50%',
  },
  checkbox: {
    marginTop: 16,
    width: ScreenWidth * 0.9,
  },
  errorMessage: {
    color: '#cc0000',
    textAlign: 'center',
  },

});