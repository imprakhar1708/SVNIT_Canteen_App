import {
	View,
	Text,
	Image,
	TouchableOpacity,
	ScrollView,
	ActivityIndicator,
} from "react-native"
import React, { useCallback, useEffect, useState } from "react"
import { firebase as firebaseAuth } from "@react-native-firebase/auth"
import { firebase } from "../Firebase/firebaseConfig"
import {
	BanknotesIcon,
	ShoppingBagIcon as OrderO,
	HeartIcon as FavO,
} from "react-native-heroicons/outline"
import {
	BanknotesIcon as CashS,
	ShoppingBagIcon as OrderS,
	HeartIcon as FavS,
	PlusCircleIcon,
	MinusCircleIcon,
	GiftIcon,
} from "react-native-heroicons/solid"
import firestore from "@react-native-firebase/firestore"
import SingleOrder from "../components/SingleOrder"
import SingleFavItem from "../components/SingleFavItem"
import moment from "moment"
import { useFocusEffect } from "@react-navigation/native"
import CashPointsBttn from "../components/CashPointsBttn"
import SingleCashpoints from "../components/SingleCashpoints"
const UserScreen = ({ navigation }) => {
	const [active, setactive] = useState("order")
	const [orderData, setorderData] = useState(null)
	const [cashPoints, setcashPoints] = useState(0)
	const [isLoadingcp, setisLoadingcp] = useState(true)
	const [isLoading, setisLoading] = useState(true)
	const [favData, setfavData] = useState(null)
	const [cpData, setcpData] = useState(null)
	const user = firebaseAuth.auth().currentUser

	useEffect(() => {
		const orderRef = firestore()
			.collection("OrderDetails")
			.doc(user.uid)
			.onSnapshot((docSnapshot) => {
				setisLoading(true)
				if (
					docSnapshot?.exists &&
					docSnapshot?.data()?.orders.length > 0
				) {
					const dataSort = docSnapshot?.data()?.orders
					dataSort?.sort((a, b) => {
						return (
							parseInt(moment(b.time).format("x")) -
							parseInt(moment(a.time).format("x"))
						)
					})
					setorderData(dataSort)
				} else {
					setorderData(null)
				}
				setisLoading(false)
			})

		const favRef = firestore()
			.collection("FavDetails")
			.doc(user.uid)
			.onSnapshot((docSnapshot) => {
				setisLoading(true)
				if (
					docSnapshot?.exists &&
					docSnapshot?.data()?.favItems.length > 0
				) {
					setfavData(docSnapshot?.data()?.fav)
				} else {
					setfavData(null)
				}
				setisLoading(false)
			})
		const cpRef = firestore()
			.collection("CashPointDetails")
			.doc(user.uid)
			.onSnapshot((docSnapshot) => {
				setisLoadingcp(true)
				if (docSnapshot?.exists) {
					setcashPoints(docSnapshot?.data()?.cashPoints)
					if (docSnapshot?.data()?.history.length > 0) {
						const dataSort = docSnapshot?.data()?.history
						dataSort?.sort((a, b) => {
							return (
								parseInt(moment(b.date).format("x")) -
								parseInt(moment(a.date).format("x"))
							)
						})

						setcpData(dataSort)
					} else {
						setcpData(null)
					}
				} else {
					setcashPoints(0)
					setcpData(null)
				}
				setisLoadingcp(false)
			})
		return () => {
			orderRef()
			favRef()
			cpRef()
		}
	}, [])

	useFocusEffect(
		useCallback(() => {
			setactive("order")
		}, [])
	)

	return (
		<View className='flex-1 px-5 pb-64'>
			<View className='items-center gap-1'>
				<View>
					<Image
						source={{ uri: user?.photoURL }}
						className='w-24 h-24 rounded-full'
					/>
				</View>
				<Text className='text-lg text-gray-500 font-bold'>
					{user?.displayName}
				</Text>
				<Text className='text-gray-500 font-bold'>
					( {user?.email.split("@")[0].toUpperCase()} )
				</Text>
			</View>
			<View className='py-3'>
				{isLoadingcp && (
					<View className='px-7 w-full py-5 border-[0.8px] border-gray-300 bg-gray-200 rounded-2xl flex-row justify-center'>
						<ActivityIndicator size={15} color='grey' />
					</View>
				)}
				{!isLoadingcp && (
					<View className='pl-5 pr-2 py-2 border-[0.8px] border-gray-300 bg-gray-200 rounded-2xl flex-row justify-between'>
						<View>
							<View className='flex-row items-center gap-x-1'>
								<Text className='text-2xl font-black '>
									{cashPoints}
								</Text>
								<BanknotesIcon size={20} color='green' />
							</View>
							<View>
								<Text className='text-xs font-bold text-gray-400'>
									available balance
								</Text>
							</View>
						</View>
						<View className='flex-row'>
							<CashPointsBttn />
						</View>
					</View>
				)}
			</View>
			<View>
				<View className='gap-x-2 py-1 flex-row justify-around rounded-2xl'>
					<TouchableOpacity
						onPress={() => {
							setactive("order")
						}}
						className={`py-3 justify-center border-[.8px] border-gray-300 bg-gray-200 items-center ${
							active === "order" ? "bg-gray-800" : ""
						} rounded-2xl flex-1`}
					>
						{active === "order" ? (
							<OrderS size={25} color='rgb(209 213 219)' />
						) : (
							<OrderO size={25} color='black' />
						)}
						<Text
							className={`${
								active === "order" ? "text-gray-50" : ""
							}`}
						>
							Orders
						</Text>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => {
							setactive("cash")
						}}
						className={`py-3 justify-center border-[.8px] border-gray-300 bg-gray-200 items-center ${
							active === "cash" ? "bg-gray-800" : ""
						} rounded-2xl flex-1`}
					>
						{active === "cash" ? (
							<CashS size={25} color='rgb(209 213 219)' />
						) : (
							<BanknotesIcon size={25} color='black' />
						)}
						<Text
							className={`${
								active === "cash" ? "text-gray-50" : ""
							}`}
						>
							Cashpoints
						</Text>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => {
							setactive("fav")
						}}
						className={`py-3 justify-center border-[.8px] border-gray-300 bg-gray-200 items-center ${
							active === "fav" ? "bg-gray-800" : ""
						} rounded-2xl flex-1`}
					>
						{active === "fav" ? (
							<FavS size={25} color='rgb(209 213 219)' />
						) : (
							<FavO size={25} color='black' />
						)}
						<Text
							className={`${
								active === "fav" ? "text-gray-50" : ""
							}`}
						>
							Favourites
						</Text>
					</TouchableOpacity>
				</View>
				{isLoading && (
					<View className='self-center w-full mt-20'>
						<ActivityIndicator size={30} color='grey' />
					</View>
				)}
				{!isLoading && active === "order" && orderData && (
					<ScrollView
						showsVerticalScrollIndicator={false}
						contentContainerStyle={{
							paddingTop: 10,
							paddingBottom: 125,
						}}
					>
						{orderData?.map((order) => (
							<SingleOrder
								navigation={navigation}
								key={order.id}
								data={order}
							/>
						))}
					</ScrollView>
				)}
				{!isLoading && active === "fav" && favData && (
					<ScrollView
						showsVerticalScrollIndicator={false}
						contentContainerStyle={{
							paddingTop: 10,
							paddingBottom: 125,
							flexDirection: "row",
							flexWrap: "wrap",
							justifyContent: "space-evenly",
						}}
					>
						{favData?.map((fav, idx) => (
							<SingleFavItem
								navigation={navigation}
								key={idx}
								Item={fav}
							/>
						))}
					</ScrollView>
				)}
				{!isLoading && active === "cash" && cpData && (
					<View className='pt-2'>
						<ScrollView
							showsVerticalScrollIndicator={false}
							contentContainerStyle={{
								paddingTop: 10,
								paddingBottom: 220,
								rowGap: 10,
							}}
						>
							{cpData?.map((item, idx) => (
								<SingleCashpoints key={idx} item={item} />
							))}
						</ScrollView>
					</View>
				)}
				{!isLoading && active === "fav" && !favData && (
					<View className='items-center'>
						<Image
							source={require("../assets/no_fav.png")}
							className='w-72 h-72'
						/>
						<Text className='text-gray-400'>
							No Favourite Items...
						</Text>
					</View>
				)}
				{!isLoading && active === "order" && !orderData && (
					<View className='items-center'>
						<Image
							source={require("../assets/no_orders.png")}
							className='w-72 h-72'
						/>
						<Text className='text-gray-400'>
							No Previous Orders...
						</Text>
					</View>
				)}
				{!isLoading && active === "cash" && !cpData && (
					<View className='items-center'>
						<Image
							source={require("../assets/no_cp.png")}
							className='w-72 h-72'
						/>
						<Text className='text-gray-400'>
							No Cashpoint Data...
						</Text>
					</View>
				)}
			</View>
		</View>
	)
}

export default UserScreen
