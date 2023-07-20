import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	ScrollView,
	ActivityIndicator,
	Image,
} from "react-native"
import React, { useCallback, useEffect, useState } from "react"
import { MagnifyingGlassIcon } from "react-native-heroicons/outline"
import SingleActiveOrder from "../components/SingleActiveOrder"
import firestore from "@react-native-firebase/firestore"
import { firebase } from "@react-native-firebase/auth"
import SortnFilter from "../components/SortnFilter"
import { useFocusEffect } from "@react-navigation/native"

const MyOrdersDel = () => {
	const [isloading, setloading] = useState(false)
	const [data, setdata] = useState(null)
	const [sort, setSort] = useState("recent")
	const [filter, setFilter] = useState("all")
	const [filtermyOrders, setfiltermyOrders] = useState(null)
	const [myOrders, setmyOrders] = useState(null)
	const contractRef = firestore().collection("ContractDetails").doc("active")
	useEffect(() => {
		contractRef.onSnapshot(async (doc) => {
			setloading(true)
			if (doc?.exists && doc?.data()?.active.length > 0) {
				const allOrders = await doc.data().active
				setdata(allOrders)
			} else {
				setdata(null)
			}
			setloading(false)
		})
	}, [])
	useEffect(() => {
		const sortMyOrders = data?.filter(({ owner_info }) => {
			return owner_info?.uid == firebase.auth().currentUser.uid
		})
		sortMyOrders?.sort((a, b) => b.timeAdded - a.timeAdded)
		setmyOrders(sortMyOrders)
	}, [data])
	const filterer = (arr, hostel) => {
		if (hostel === "all") return arr
		return arr?.filter((item) => {
			return item.owner_info.hostel === hostel
		})
	}
	useEffect(() => {
		sort === "recent"
			? setfiltermyOrders(filterer(myOrders, filter))
			: sort === "lth"
			? setfiltermyOrders(
					filterer(
						myOrders?.sort(
							(a, b) => b.order_data.cp - a.order_data.cp
						),
						filter
					)
			  )
			: setfiltermyOrders(
					filterer(
						myOrders?.sort(
							(a, b) => a.order_data.cp - b.order_data.cp
						),
						filter
					)
			  )
	}, [myOrders, filter, sort])
	return (
		<View>
			{isloading && (
				<View className='justify-center h-96'>
					<ActivityIndicator size={20} color='orange' />
				</View>
			)}
			{!isloading && myOrders?.length > 0 && (
				<>
					<View className='my-4 mx-2 p-2 items-end justify-between'>
						<SortnFilter setFilter={setFilter} setSort={setSort} />
					</View>
					{data && filtermyOrders?.length === 0 && (
						<Text className='text-gray-400 text-center'>
							No Active Orders for Selected Filter...
						</Text>
					)}
					<ScrollView
						showsVerticalScrollIndicator={false}
						contentContainerStyle={{
							paddingHorizontal: 10,
							paddingBottom: 150,
						}}
					>
						{filtermyOrders?.map((order, { idx }) => (
							<SingleActiveOrder
								mine={true}
								key={order?.id}
								data={order}
							/>
						))}
					</ScrollView>
				</>
			)}
			{!isloading && (!myOrders || myOrders?.length == 0) && (
				<View className='justify-center h-5/6 items-center'>
					<Image
						source={require("../assets/no_active_my.png")}
						className='w-72 h-72'
					/>
					<Text className='text-gray-400'>
						No Active Order Contracts...
					</Text>
				</View>
			)}
		</View>
	)
}

export default MyOrdersDel
