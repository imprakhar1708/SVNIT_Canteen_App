import React from "react"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import HomeScreen from "./HomeScreen"

import Header from "../components/Header"
import FoodDetailsScreen from "./FoodDetailsScreen"

const HomenDetailsScreen = () => {
	const Stack = createNativeStackNavigator()
	return (
		<>
			<Stack.Navigator>
				<Stack.Screen
					options={{ headerShown: false }}
					name='HomeScreen'
					component={HomeScreen}
				/>
				<Stack.Screen
					options={{
						header: ({ navigation, route }) => (
							<Header
								share={true}
								navigation={navigation}
								title={route.params.item.foodName}
							/>
						),
					}}
					name='FoodDetails'
					component={FoodDetailsScreen}
				/>
			</Stack.Navigator>
		</>
	)
}

export default HomenDetailsScreen
