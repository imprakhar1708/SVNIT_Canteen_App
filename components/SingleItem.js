import { View, Text } from "react-native"
import React from "react"

const SingleItem = ({ data }) => {
	return (
		<View className='flex-row justify-between'>
			<Text className='text-gray-500'>
				{data.qty}x {data.food.foodName}
			</Text>
			<Text className='text-gray-500'>
				₹{data.food.foodPrice}x{data.qty}
			</Text>
		</View>
	)
}

export default SingleItem
