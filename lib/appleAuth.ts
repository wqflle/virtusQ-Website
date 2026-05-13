import * as AppleAuthentication from "expo-apple-authentication";
import { OAuthProvider, signInWithCredential } from "firebase/auth";
import { auth } from "./auth";

export async function signInWithApple() {
  const result = await AppleAuthentication.signInAsync({
    requestedScopes: [
      AppleAuthentication.AppleAuthenticationScope.EMAIL,
      AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
    ],
  });

  const provider = new OAuthProvider("apple.com");

  const credential = provider.credential({
    idToken: result.identityToken!,
  });

  await signInWithCredential(auth, credential);
}
