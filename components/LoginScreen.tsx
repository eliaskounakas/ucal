import { useState } from 'react'
import { SafeAreaView } from 'react-native';
import LoginScreen from 'react-native-login-screen'
import UspaceClient from 'uspace-api-wrapper';

export interface LoginProps {
  session: string,
  setSession: Function,
}

export default function Login({ session, setSession }: LoginProps) {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const uClient = new UspaceClient();
  
  return (
      <LoginScreen
        logoImageSource={require('../assets/icon.png')}
        onLoginPress={async () => {
         uClient.login(username, password)
          .then(() => {
            setSession(uClient.getSession);
          })
          .catch((err) => {
            console.error(err);
            alert(err);
          });
        }}
        onSignupPress={() => {}}
        onEmailChange={setUsername}
        onPasswordChange={setPassword}
        enablePasswordValidation
        disableSignup
        disableSocialButtons
        emailPlaceholder={"Username"}
        disableEmailTooltip
      />
  )
}