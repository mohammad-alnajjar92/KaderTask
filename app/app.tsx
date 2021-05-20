/**
 * Welcome to the main entry point of the app. In this file, we'll
 * be kicking off our app or storybook.
 *
 * Most of this file is boilerplate and you shouldn't need to modify
 * it very often. But take some time to look through and understand
 * what is going on here.
 *
 * The app navigation resides in ./app/navigation, so head over there
 * if you're interested in adding screens and navigators.
 */
import "./i18n"
import "./utils/ignore-warnings"
import React, { useState, useEffect, useRef, FunctionComponent as Component } from "react"
import { NavigationContainerRef, NavigationContainer, useRoute } from "@react-navigation/native"
import { SafeAreaProvider, initialWindowSafeAreaInsets } from "react-native-safe-area-context"
import { StatusBar, Platform, View } from "react-native"
import SplashScreen from 'react-native-splash-screen';
import {
  useBackButtonHandler,
  canExit,
  setRootNavigation,
  PrimaryNavigator,
} from "./navigation"
import { RootStore, RootStoreProvider, setupRootStore } from "./models"
import { NetInformation } from "./components/net-info";
import { color } from "../app/theme"

// import 'mobx-react-lite/batchingForReactNative';
// This puts screens in a native ViewController or Activity. If you want fully native
// stack navigation, use `createNativeStackNavigator` in place of `createStackNavigator`:
// https://github.com/kmagiera/react-native-screens#using-native-stack-navigator
import { enableScreens } from "react-native-screens"
import { showToast } from "./utils/general"
enableScreens();
export const NAVIGATION_PERSISTENCE_KEY = "NAVIGATION_STATE"


/**
 * This is the root component of our app.
 */
const App: Component<{}> = () => {
  const navigationRef = useRef<NavigationContainerRef>()
  const [rootStore, setRootStore] = useState<RootStore | undefined>(undefined)
  setRootNavigation(navigationRef)
  useBackButtonHandler(navigationRef, canExit)
  // Kick off initial async loading actions, like loading fonts and RootStore
  useEffect(() => {
    ; (async () => {
      setupRootStore().then(setRootStore).finally(async () =>  SplashScreen.hide());

    })()
  }, [])

  // Before we show the app, we have to wait for our state to be ready.
  // In the meantime, don't render anything. This will be the background
  // color set in native by rootView's background color. You can replace
  // with your own loading component if you wish.
  if (!rootStore) return null

  // otherwise, we're ready to render the app
  return (
    <RootStoreProvider value={rootStore}>
      {Platform.OS === 'ios' ? <StatusBar hidden /> :
        <StatusBar backgroundColor={color.mainTheme} />
      }
      <SafeAreaProvider initialSafeAreaInsets={initialWindowSafeAreaInsets}>
        <NavigationContainer>
          <PrimaryNavigator/>
        </NavigationContainer>
      </SafeAreaProvider>
    </RootStoreProvider>
  )
}

export default App
