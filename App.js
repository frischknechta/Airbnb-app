import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "./containers/HomeScreen";
import ProfileScreen from "./containers/ProfileScreen";
import SignInScreen from "./containers/SignInScreen";
import SignUpScreen from "./containers/SignUpScreen";
import LogoTitle from "./components/LogoTitle";
import RoomScreen from "./containers/RoomScreen";
import GoBackButton from "./components/GoBackButton";
import AroundMeScreen from "./containers/AroundMeScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);

  const setToken = async (token) => {
    if (token) {
      await AsyncStorage.setItem("userToken", token);
    } else {
      await AsyncStorage.removeItem("userToken");
      await AsyncStorage.removeItem("userId");
    }

    setUserToken(token);
  };

  useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      // We should also handle error for production apps
      const userToken = await AsyncStorage.getItem("userToken");

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      setUserToken(userToken);

      setIsLoading(false);
    };

    bootstrapAsync();
  }, []);

  if (isLoading === true) {
    // We haven't finished checking for the token yet
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {userToken === null ? (
          // No token found, user isn't signed in
          <>
            <Stack.Screen name="SignIn">
              {() => <SignInScreen setToken={setToken} />}
            </Stack.Screen>
            <Stack.Screen name="SignUp">
              {() => <SignUpScreen setToken={setToken} />}
            </Stack.Screen>
          </>
        ) : (
          // User is signed in ! 🎉
          <Stack.Screen name="Tab" options={{ headerShown: false }}>
            {() => (
              <Tab.Navigator
                screenOptions={{
                  headerShown: false,
                  tabBarActiveTintColor: "#EB5A61",
                  tabBarInactiveTintColor: "#717171",
                  tabBarStyle: { paddingBottom: 25, height: 80 },
                  tabBarHideOnKeyboard: true,
                }}
              >
                <Tab.Screen
                  name="TabHome"
                  options={{
                    tabBarLabel: "Home",
                    tabBarIcon: ({ color, size }) => (
                      <Ionicons name={"home"} size={size} color={color} />
                    ),
                  }}
                >
                  {() => (
                    <Stack.Navigator
                      screenOptions={{
                        headerBackVisible: false,
                        headerLeft: ({ canGoBack }) => {
                          return canGoBack ? <GoBackButton /> : null;
                        },
                        headerTitle: (props) => <LogoTitle {...props} />,
                        headerStyle: {
                          backgroundColor: "white",
                        },
                        headerTitleStyle: { color: "white" },
                        headerTitleAlign: "center",
                      }}
                    >
                      <Stack.Screen name="Home">
                        {() => <HomeScreen />}
                      </Stack.Screen>

                      <Stack.Screen name="Room">
                        {(props) => <RoomScreen {...props} />}
                      </Stack.Screen>
                    </Stack.Navigator>
                  )}
                </Tab.Screen>
                <Tab.Screen
                  name="TabAroundMe"
                  options={{
                    tabBarLabel: "Around Me",
                    tabBarIcon: ({ color, size }) => (
                      <Ionicons
                        name={"location-outline"}
                        size={size}
                        color={color}
                      />
                    ),
                  }}
                >
                  {() => (
                    <Stack.Navigator
                      screenOptions={{
                        headerBackVisible: false,
                        headerLeft: ({ canGoBack }) => {
                          return canGoBack ? <GoBackButton /> : null;
                        },
                        headerTitle: (props) => <LogoTitle {...props} />,
                        headerStyle: {
                          backgroundColor: "white",
                        },
                        headerTitleStyle: { color: "white" },
                        headerTitleAlign: "center",
                      }}
                    >
                      <Stack.Screen name="AroundMe">
                        {(props) => <AroundMeScreen {...props} />}
                      </Stack.Screen>

                      <Stack.Screen name="RoomAroundMe">
                        {(props) => <RoomScreen {...props} />}
                      </Stack.Screen>
                    </Stack.Navigator>
                  )}
                </Tab.Screen>
                <Tab.Screen
                  name="TabProfile"
                  options={{
                    tabBarLabel: "Profile",
                    tabBarIcon: ({ color, size }) => (
                      <Ionicons
                        name={"person-outline"}
                        size={size}
                        color={color}
                      />
                    ),
                  }}
                >
                  {() => (
                    <Stack.Navigator
                      screenOptions={{
                        headerBackVisible: false,
                        headerLeft: ({ canGoBack }) => {
                          return canGoBack ? <GoBackButton /> : null;
                        },
                        headerTitle: (props) => <LogoTitle {...props} />,
                        headerStyle: {
                          backgroundColor: "white",
                        },
                        headerTitleStyle: { color: "white" },
                        headerTitleAlign: "center",
                      }}
                    >
                      <Stack.Screen
                        name="Profile"
                        options={{
                          title: "User Profile",
                        }}
                      >
                        {(props) => (
                          <ProfileScreen {...props} setToken={setToken} />
                        )}
                      </Stack.Screen>
                    </Stack.Navigator>
                  )}
                </Tab.Screen>
              </Tab.Navigator>
            )}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
