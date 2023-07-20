import { View, Text, Image, TouchableOpacity } from "react-native"
import React, { useState } from "react"
import { MinusCircleIcon, PlusCircleIcon } from "react-native-heroicons/solid"
import { firebase } from "../Firebase/firebaseConfig"
import firestore from "@react-native-firebase/firestore"
import { firebase as firebaseAuth } from "@react-native-firebase/auth"

const CartItem = ({ qty, item, navigation, disabled, del }) => {
	const foodObj = {
		foodImageUrl: item.foodImageUrl,
		id: item.id,
		foodName: item.foodName,
		foodDescription: item.foodDescription,
		foodPrice: item.foodPrice,
		time: item.time,
	}
	const user = firebaseAuth.auth().currentUser
	const docRef = firestore().collection("CartDetails").doc(user.uid)
	const addnRemoveFromCart = (no) => {
		docRef.get().then(async (doc) => {
			if (doc?.data()?.cartItems.includes(item.id)) {
				const currQty = await doc.data().cart.filter((foodItem) => {
					return foodItem.food.id === item.id
				})[0].qty
				const currCart = await doc.data().cart.filter((foodItem) => {
					return foodItem.food.id != item.id
				})
				const time = await doc.data().cart.filter((foodItem) => {
					return foodItem.food.id === item.id
				})[0].timeAdded

				const updateCart = [
					...currCart,
					{
						qty: no + currQty,
						food: foodObj,
						timeAdded: time,
					},
				]
				if (currQty > 1) {
					docRef.update({
						cart: updateCart,
					})
				} else {
					if (currQty == 1 && no > 0) {
						docRef.update({
							cart: updateCart,
						})
					} else {
						docRef.update({
							cart: currCart,
							cartItems: firestore.FieldValue.arrayRemove(
								item.id
							),
						})
					}
				}
			}
		})
	}
	return (
		<View className='rounded-xl p-4 mb-3 flex-row justify-between items-center border-[0.8px] border-gray-300 relative'>
			<View className='flex-row gap-4'>
				<TouchableOpacity
					disabled={disabled}
					onPress={() => {
						del
							? null
							: navigation.navigate("FoodDetails", { item })
					}}
				>
					<Image
						source={{
							uri: item.foodImageUrl,
						}}
						className='rounded-xl'
						height={75}
						width={75}
					/>
				</TouchableOpacity>
				<View className='justify-evenly p-1'>
					<Text className='text-md text-gray-800 '>
						{item.foodName}
					</Text>
					<Text className='text-lg text-gray-600 font-bold'>
						₹{item.foodPrice}
					</Text>
				</View>
			</View>
			<View className='self-center'>
				{!del && (
					<View className='flex-row gap-2 items-center'>
						<TouchableOpacity
							disabled={disabled}
							onPress={() => {
								qty > 0 ? addnRemoveFromCart(-1) : null
							}}
						>
							<MinusCircleIcon size={30} color='rgb(55 65 81)' />
						</TouchableOpacity>
						<Text className='text-md text-gray-700 font-bold'>
							{qty}
						</Text>
						<TouchableOpacity
							disabled={disabled}
							onPress={() => {
								addnRemoveFromCart(1)
							}}
						>
							<PlusCircleIcon size={30} color='rgb(55 65 81)' />
						</TouchableOpacity>
					</View>
				)}
				{del && (
					<View>
						<Text className='font-bold'>Qty : {qty}</Text>
					</View>
				)}
			</View>
		</View>
	)
}

export default CartItem
