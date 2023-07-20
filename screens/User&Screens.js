import React from "react"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import UserScreen from "./UserScreen"
import Header from "../components/Header"
import TrackOrder from "./TrackOrder"

const UsernScreens = () => {
	const Stack = createNativeStackNavigator()
	return (
		<>
			<Stack.Navigator>
				<Stack.Screen
					options={{
						header: ({ navigation }) => (
							<Header
								navigation={navigation}
								share={false}
								title=''
								logout={true}
							/>
						),
					}}
					name='UserScreen'
					component={UserScreen}
				/>
				<Stack.Screen
					options={{
						header: ({ navigation, route }) => (
							<Header
								title='Order Details'
								navigation={navigation}
							/>
						),
					}}
					name='TrackOrder'
					component={TrackOrder}
				/>
			</Stack.Navigator>
		</>
	)
}

export default UsernScreens
