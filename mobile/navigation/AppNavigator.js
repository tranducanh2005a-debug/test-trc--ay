import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SplashView from "../views/SplashView";
import LoginView from "../views/LoginView";
import RegisterView from "../views/RegisterView";
import DetailView from "../views/DetailView";
import BottomTab from "./BottomTab";
import AppDrawer from "./AppDrawer";
import SearchView from "../views/SearchView";
import SearchResultView from "../views/SearchResultView";
import CheckoutScreen from "../views/CheckoutScreen";
import OrderSuccessScreen from "../views/OrderSuccessScreen";
import EditProfileView from "../views/EditProfileView";
import OrderHistoryView from "../views/OrderHistoryView";


const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Splash" component={SplashView} options={{ headerShown: false }}/>
      <Stack.Screen name="Login" component={LoginView} />
      <Stack.Screen name="Register" component={RegisterView} />
      <Stack.Screen name="Search" component={SearchView} />
      <Stack.Screen name="SearchResult" component={SearchResultView} />
      <Stack.Screen name="Main" component={AppDrawer} options={{ headerShown: false }}/>
      <Stack.Screen name="Detail" component={DetailView} options={{ headerShown: false }}/>
      <Stack.Screen name="Checkout" component={CheckoutScreen} options={{ title: "Thanh toán" }}/>
      <Stack.Screen name="OrderSuccess" component={OrderSuccessScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="EditProfile" component={EditProfileView} />
      <Stack.Screen name="OrderHistory" component={OrderHistoryView} />
    </Stack.Navigator>
  );
}