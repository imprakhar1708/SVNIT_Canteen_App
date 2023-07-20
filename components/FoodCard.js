import { View, Text, Image, TouchableOpacity, Dimensions } from "react-native"
import React, { useCallback, useState } from "react"
import { ClockIcon } from "react-native-heroicons/outline"
import {
	HeartIcon as HeartS,
	PlusCircleIcon,
} from "react-native-heroicons/solid"
import { HeartIcon as HeartO } from "react-native-heroicons/outline"
import { firebase } from "../Firebase/firebaseConfig"
import { firebase as firebaseAuth } from "@react-native-firebase/auth"
import firestore from "@react-native-firebase/firestore"
import Toast from "react-native-root-toast"
import { useFocusEffect } from "@react-navigation/native"

const FoodCard = ({ uri, title, price, time, navigation, available, item }) => {
	const user = firebaseAuth.auth().currentUser
	const cartDocRef = firestore().collection("CartDetails").doc(user.uid)
	const docRef = firestore().collection("FavDetails").doc(user.uid)
	const foodObj = {
		foodImageUrl: item.foodImageUrl,
		id: item.id,
		foodName: item.foodName,
		foodDescription: item.foodDescription,
		foodPrice: item.foodPrice,
		time: item.time,
	}
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
							qty: 1 + currQty,
							food: foodObj,
							timeAdded: time,
						},
					]

					await cartDocRef
						.update({
							cart: updateCart,
						})
						.then(() => {
							showCartToast()
						})
				} else {
					await cartDocRef
						.update({
							cart: firestore.FieldValue.arrayUnion({
								qty: 1,
								food: foodObj,
								timeAdded: new Date().getTime(),
							}),
							cartItems: firestore.FieldValue.arrayUnion(item.id),
						})
						.then(() => {
							showCartToast()
						})
				}
			} else {
				await cartDocRef
					.set({
						cart: [
							{
								qty: 1,
								food: foodObj,
								timeAdded: new Date().getTime(),
							},
						],
						cartItems: [item.id],
					})
					.then(() => {
						showCartToast()
					})
			}
		})
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
				position: 150,
				backgroundColor: "black",
				textColor: "white",
				opacity: 1,
				duration: 1000,
			}
		)
	}

	const showUnavailableToast = () => {
		Toast.show(`${title} is Currently Unavailable 😔!`, {
			position: 180,
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

	const [liked, setliked] = useState(false)
	return (
		<TouchableOpacity
			style={{ elevation: 3 }}
			className='rounded-lg overflow-hidden mb-3 relative'
			onPress={() => {
				available
					? navigation.navigate("FoodDetails", { item })
					: showUnavailableToast()
			}}
		>
			<Image
				source={{
					uri: uri,
				}}
				style={available ? "" : { tintColor: "grey" }}
				width={Dimensions.get("window").width / 2.3}
				height={160}
			/>
			{!available && (
				<Image
					source={{
						uri: uri,
					}}
					style={{
						opacity: 0.3,
						position: "absolute",
					}}
					width={Dimensions.get("window").width / 2.3}
					height={160}
				/>
			)}
			<View className='pl-3 pr-2 py-2 flex-row bg-orange-50 items-start justify-between'>
				<View>
					<Text className='text-md font-bold'>{title}</Text>
					<View className='flex-row items-center'>
						<Text className='font-bold text-sm text-orange-400'>
							₹{price}{" "}
						</Text>
						<Text className='font-bold text-xs text-gray-400'>
							&#11825;{" "}
							{available ? time + " mins" : "Not Available"}
						</Text>
					</View>
				</View>
				<TouchableOpacity
					className={` ${
						available ? "bg-orange-100" : "bg-gray-200"
					} justify-center items-center rounded-full`}
					onPress={() => {
						available ? addToCart() : showUnavailableToast()
					}}
				>
					<PlusCircleIcon
						size={35}
						color={`${available ? "orange" : "rgb(156 163 175)"}`}
					/>
				</TouchableOpacity>
			</View>
			{/* <View className='flex-row absolute top-2 left-2 bg-white rounded-full p-1 items-center'>
				{available && <ClockIcon size={15} color='orange' />}
				<Text style={{ fontSize: 10 }}>
					{available ? time + " mins" : "Not Available"}
				</Text>
			</View> */}
			<View className='absolute top-2 bg-red-100 justify-center items-center rounded-full left-2'>
				<TouchableOpacity className='p-1' onPress={addnRemoveFav}>
					{liked === true ? (
						<HeartS size={25} color='red' />
					) : (
						<HeartO size={25} color='red' />
					)}
				</TouchableOpacity>
			</View>
		</TouchableOpacity>
	)
}

export default FoodCard
