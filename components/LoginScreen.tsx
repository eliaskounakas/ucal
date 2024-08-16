import { useState } from 'react'
import { Dimensions, StyleSheet } from 'react-native';
const { width: ScreenWidth } = Dimensions.get("screen");
import LoginScreen from 'react-native-login-screen'
import UspaceClient from 'uspace-api-wrapper';
import BouncyCheckbox from "react-native-bouncy-checkbox";

export interface LoginProps {
  session: string,
  setSession: Function,
}

export default function Login({ session, setSession }: LoginProps) {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [stayLoggedIn, setStayLoggedIn] = useState<boolean>(false);

  const uClient = new UspaceClient();
  
  return (
      <>
        <LoginScreen
        style={styles.loginContainer}
        logoImageSource={require('../assets/icon.png')}
        onLoginPress={async () => {
         const loginResponse = await uClient.login(username, password);
          if (loginResponse.ok) {
            setSession(uClient.getSession);
            return;
          }
          alert(await loginResponse.text())
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
            unFillColor="#FFFFFF"
            text="Stay signed in"
            iconStyle={{ borderColor: "#25A9E2" }}
            innerIconStyle={{ borderWidth: 2 }}
            textStyle={{
              textDecorationLine: "none",
            }}
            onPress={() => {}}
          />
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
});