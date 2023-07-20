import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native"
import React, { useCallback, useState } from "react"
import { SafeAreaView } from "react-native-safe-area-context"
import {
	ClockIcon,
	MinusCircleIcon,
	PlusCircleIcon,
	HeartIcon as HeartS,
} from "react-native-heroicons/solid"
import { firebase } from "../Firebase/firebaseConfig"
import firestore from "@react-native-firebase/firestore"
import { firebase as firebaseAuth } from "@react-native-firebase/auth"
import { HeartIcon as HeartO } from "react-native-heroicons/outline"
import Toast from "react-native-root-toast"
import { useFocusEffect } from "@react-navigation/native"

const FoodDetailsScreen = ({ route }) => {
	const [liked, setliked] = useState(false)
	const [qty, setqty] = useState(1)
	const item = route.params.item
	const docRef = firestore()
		.collection("FavDetails")
		.doc(firebaseAuth.auth().currentUser.uid)

	const foodObj = {
		foodImageUrl: item.foodImageUrl,
		id: item.id,
		foodName: item.foodName,
		foodDescription: item.foodDescription,
		foodPrice: item.foodPrice,
		time: item.time,
	}
	const user = firebaseAuth.auth().currentUser
	const cartDocRef = firestore().collection("CartDetails").doc(user.uid)
	const addToCart = () => {
		cartDocRef.get().then(async (doc) => {
			if (doc?.exists) {
				if (doc?.data()?.cartItems.includes(item.id)) {
					const currQty = await doc.data().cart.filter((foodItem) => {
						return foodItem.food.id === item.id
					})[0].qty

					const currCart = await doc
						.data()
						.cart.filter((foodItem) => {
							return foodItem.food.id != item.id
						})

					const time = await doc.data().cart.filter((foodItem) => {
						return foodItem.food.id === item.id
					})[0].timeAdded

					const updateCart = [
						...currCart,
						{
							qty: qty + currQty,
							food: foodObj,
							timeAdded: time,
						},
					]

					await cartDocRef
						.update({
							cart: updateCart,
						})
						.then(() => {
							setqty(1)
							showCartToast()
						})
				} else {
					await cartDocRef
						.update({
							cart: firestore.FieldValue.arrayUnion({
								qty,
								food: foodObj,
								timeAdded: new Date().getTime(),
							}),
							cartItems: firestore.FieldValue.arrayUnion(item.id),
						})
						.then(() => {
							setqty(1)
							showCartToast()
						})
				}
			} else {
				await cartDocRef
					.set({
						cart: [
							{
								qty,
								food: foodObj,
								timeAdded: new Date().getTime(),
							},
						],
						cartItems: [item.id],
					})
					.then(() => {
						setqty(1)
						showCartToast()
					})
			}
		})
	}

	const addnRemoveFav = async () => {
		docRef.get().then(async (doc) => {
			if (doc?.exists) {
				if (doc?.data()?.favItems.includes(item.id)) {
					const currFav = await doc.data().fav.filter((fooditem) => {
						return fooditem.id === item.id
					})[0]
					await docRef
						.update({
							favItems: firestore.FieldValue.arrayRemove(item.id),
							fav: firestore.FieldValue.arrayRemove(currFav),
						})
						.then(() => {
							setliked(false)
							showToast("Removed")
						})
				} else {
					await docRef
						.update({
							favItems: firestore.FieldValue.arrayUnion(item.id),
							fav: firestore.FieldValue.arrayUnion(item),
						})
						.then(() => {
							setliked(true)
							showToast("Added")
						})
				}
			} else {
				await docRef
					.set({
						favItems: [item.id],
						fav: [item],
					})
					.then(() => {
						setliked(true)
						showToast("Added")
					})
			}
		})
	}

	const showToast = (action) => {
		Toast.show(
			`${action} ${item.foodName} ${
				action === "Added" ? "to" : "from"
			} ❤️ !`,
			{
				position: 100,
				backgroundColor: "black",
				textColor: "white",
				opacity: 1,
				duration: 1000,
			}
		)
	}

	const showCartToast = () => {
		Toast.show(`Added ${item.foodName} to Cart 🛒 !`, {
			position: 100,
			backgroundColor: "black",
			textColor: "white",
			opacity: 1,
			duration: 1000,
		})
	}

	useFocusEffect(
		useCallback(() => {
			docRef?.get().then((doc) => {
				doc?.data()?.favItems.includes(item.id)
					? setliked(true)
					: setliked(false)
			})
		}, [])
	)

	return (
		<SafeAreaView className='flex-1 px-2 pb-20 flex-col'>
			<ScrollView showsVerticalScrollIndicator={false}>
				<View className='relative'>
					<Image
						source={{ uri: item.foodImageUrl }}
						className='w-full h-80 rounded-3xl'
					/>
					<TouchableOpacity
						className='absolute top-5 right-5'
						onPress={addnRemoveFav}
					>
						{liked === true ? (
							<HeartS size={35} color='red' />
						) : (
							<HeartO size={35} color='red' />
						)}
					</TouchableOpacity>
				</View>
				<View className='pb-10 border-dashed border-b-2 border-gray-300'>
					<View className='flex-row items-center px-5 pt-5 pb-2 justify-between'>
						<Text className='text-gray-800 font-bold text-2xl '>
							{item.foodName}
						</Text>
						<View className='flex-row bg-white rounded-full p-1 items-center'>
							<ClockIcon size={15} color='orange' />
							<Text className='text-xs'> {item.time} mins</Text>
						</View>
					</View>
					<Text className='text-gray-500 px-5'>
						{item.foodDescription}
					</Text>
				</View>
				<View className='mb-7'>
					<View className='flex-row items-center justify-between p-5'>
						<View className='flex-row gap-2 items-center'>
							<TouchableOpacity
								onPress={() => {
									qty > 1 ? setqty((qty) => qty - 1) : null
								}}
							>
								<MinusCircleIcon
									size={30}
									color='rgb(55 65 81)'
								/>
							</TouchableOpacity>
							<Text className='text-md text-gray-700 font-bold'>
								{qty}
							</Text>
							<TouchableOpacity
								onPress={() => {
									setqty((qty) => qty + 1)
								}}
							>
								<PlusCircleIcon
									size={30}
									color='rgb(55 65 81)'
								/>
							</TouchableOpacity>
						</View>
						<View>
							<Text className='text-3xl text-gray-600 font-extrabold'>
								₹{item.foodPrice}
							</Text>
						</View>
					</View>
				</View>
				<TouchableOpacity
					style={{
						shadowColor: "#ffa500",
						shadowOffset: {
							width: 0,
							height: 11,
						},
						shadowOpacity: 0.23,
						shadowRadius: 11.78,
						elevation: 15,
					}}
					onPress={addToCart}
					className='py-5 justify-center items-center mx-5 mb-5 rounded-2xl bg-orange-400'
				>
					<Text className='text-white font-extrabold'>
						+Add To Cart
					</Text>
				</TouchableOpacity>
			</ScrollView>
		</SafeAreaView>
	)
}

export default FoodDetailsScreen
