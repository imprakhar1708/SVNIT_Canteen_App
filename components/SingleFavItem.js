import { View, Text, Image, TouchableOpacity, Dimensions } from "react-native"
import React, { useEffect, useState } from "react"
import Toast from "react-native-root-toast"
import { firebase } from "../Firebase/firebaseConfig"
import firestore from "@react-native-firebase/firestore"

const SingleFavItem = ({ Item, navigation }) => {
	const [item, setItem] = useState(null)
	useEffect(() => {
		return firestore()
			.collection("FoodData")
			.onSnapshot((qS) => {
				qS.forEach((doc) => {
					doc?.data().id === Item.id ? setItem(doc?.data()) : null
				})
			})
	}, [])
	return (
		<TouchableOpacity
			onPress={() => {
				item.available
					? navigation.navigate("FoodDetails", { item })
					: Toast.show(
							`${item?.foodName} is Currently Unavailable 😔!`,
							{
								position: -150,
								backgroundColor: "black",
								textColor: "white",
								opacity: 1,
								duration: 1000,
							}
					  )
			}}
			className='p-2 mb-3 relative rounded-3xl border-[.8px] border-gray-300'
		>
			<View className='flex-row justify-between items-center'>
				<View className='flex-row gap-4'>
					{item?.foodImageUrl && (
						<Image
							source={{ uri: item?.foodImageUrl }}
							width={Dimensions.get("window").width / 2.6}
							className='h-36 rounded-xl'
						/>
					)}
				</View>
				<View
					className='absolute w-full rounded-xl bg-black h-full'
					style={{ opacity: 0.3 }}
				/>
				<View className='absolute justify-center bottom-1 left-2'>
					<Text className='text-lg z-10 text-white p-1'>
						{item?.foodName}
					</Text>
					<Text className='text-xl z-10 text-gray-200 font-bold p-1'>
						₹{item?.foodPrice}
					</Text>
				</View>
			</View>
		</TouchableOpacity>
	)
}

export default SingleFavItem
