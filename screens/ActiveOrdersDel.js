import { View, Text, ScrollView, ActivityIndicator, Image } from "react-native"
import React, { useEffect, useState } from "react"
import SingleActiveOrder from "../components/SingleActiveOrder"
import firestore from "@react-native-firebase/firestore"
import { firebase } from "@react-native-firebase/auth"
import SortnFilter from "../components/SortnFilter"
import Toast from "react-native-root-toast"

const ActiveOrdersDel = ({ navigation }) => {
	const [isloading, setloading] = useState(false)
	const [data, setdata] = useState(null)
	const [sort, setSort] = useState("recent")
	const [filter, setFilter] = useState("all")
	const [notMyOrders, setnotMyOrders] = useState(null)
	const [isacceptAvailable, setisacceptAvailable] = useState(false)
	const [filternotMyOrders, setfilternotMyOrders] = useState(null)
	const user = firebase.auth().currentUser
	const contractRef = firestore().collection("ContractDetails").doc("active")
	const delRef = firestore()
		.collection("DeliveryDetails")
		.doc(firebase.auth().currentUser.uid)
	const acceptedContractRef = firestore()
		.collection("AcceptedContractDetails")
		.doc("active")
	useEffect(() => {
		contractRef.onSnapshot(async (doc) => {
			setloading(true)
			if (doc?.exists && doc?.data()?.active.length > 0) {
				const allOrders = await doc?.data()?.active
				setdata(allOrders)
				setloading(false)
			} else {
				setdata(null)
				setloading(false)
			}
		})
		acceptedContractRef.onSnapshot(async (doc) => {
			let available = true
			if (doc?.exists) {
				const accept = await doc?.data()?.active
				accept?.forEach((item) => {
					if (
						item.delivery_info.admission_no ===
						user.email.split("@")[0]
					) {
						available = false
					}
				})
				setisacceptAvailable(available)
			} else {
				setisacceptAvailable(true)
			}
		})
	}, [])
	useEffect(() => {
		const sortNotMyOrders = data?.filter(({ owner_info }) => {
			return owner_info?.uid != user.uid
		})
		sortNotMyOrders?.sort((a, b) => b.timeAdded - a.timeAdded)
		setnotMyOrders(sortNotMyOrders)
	}, [data])
	const filterer = (arr, hostel) => {
		if (hostel === "all") return arr
		return arr?.filter((item) => {
			return item.owner_info.hostel === hostel
		})
	}
	useEffect(() => {
		sort === "recent"
			? setfilternotMyOrders(filterer(notMyOrders, filter))
			: sort === "lth"
			? setfilternotMyOrders(
					filterer(
						notMyOrders?.sort(
							(a, b) =>
								parseInt(b.order_data.cp) -
								parseInt(a.order_data.cp)
						),
						filter
					)
			  )
			: setfilternotMyOrders(
					filterer(
						notMyOrders?.sort(
							(a, b) =>
								parseInt(a.order_data.cp) -
								parseInt(b.order_data.cp)
						),
						filter
					)
			  )
	}, [notMyOrders, sort, filter])

	const deleteActiveOrder = (id) => {
		contractRef.get().then(async (doc) => {
			if (doc?.exists) {
				const active = doc.data().active
				const remainingActive = active.filter((item) => {
					return item?.id != id
				})
				await contractRef
					.update({
						active: remainingActive,
					})
					.then(() => {
						navigation.navigate("History")
						showDoneToast("Delivery Contract Accepted ✅")
					})
			}
		})
	}
	const acceptOrder = async (Data) => {
		let phone_no
		let name

		delRef
			.get()
			.then(async (doc) => {
				phone_no = await doc?.data().phone_no
				name = await doc?.data().info[0].name
			})
			.then(() => {
				acceptedContractRef.get().then((doc) => {
					if (doc?.exists) {
						acceptedContractRef.update({
							active: firestore.FieldValue.arrayUnion({
								...Data,
								delivery_info: {
									phn: phone_no,
									photoUrl: user.photoURL,
									admission_no: user.email.split("@")[0],
									uid: user.uid,
									name,
								},
							}),
						})
						delRef.update({
							history: firestore.FieldValue.arrayUnion({
								...Data,
								status: "Waiting",
								timeAdded: new Date().getTime().toString(),
							}),
							orderIds: firestore.FieldValue.arrayUnion(Data?.id),
						})
						deleteActiveOrder(Data?.id)
					} else {
						acceptedContractRef.set({
							active: [
								{
									...Data,
									delivery_info: {
										phn: phone_no,
										photoUrl: user.photoURL,
										admission_no: user.email.split("@")[0],
										uid: user.uid,
										name,
									},
								},
							],
						})
						delRef.update({
							history: firestore.FieldValue.arrayUnion({
								...Data,
								status: "Waiting",
								timeAdded: new Date().getTime().toString(),
							}),
							orderIds: firestore.FieldValue.arrayUnion(Data?.id),
						})
						deleteActiveOrder(Data?.id)
					}
				})
			})
	}
	const showDoneToast = (mess) => {
		Toast.show(mess, {
			position: 100,
			backgroundColor: "black",
			textColor: "white",
			opacity: 1,
			duration: 4000,
		})
	}
	return (
		<View className='flex-1'>
			{isloading && (
				<View className='justify-center h-96'>
					<ActivityIndicator size={20} color='orange' />
				</View>
			)}
			{!isloading && notMyOrders?.length > 0 && (
				<>
					<View className='my-4 mx-2 p-2 items-end justify-between'>
						<SortnFilter setFilter={setFilter} setSort={setSort} />
					</View>
					{data && filternotMyOrders?.length === 0 && (
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
						{filternotMyOrders?.map((order, { idx }) => (
							<SingleActiveOrder
								acceptOrder={acceptOrder}
								mine={false}
								isacceptAvailable={isacceptAvailable}
								key={order?.id}
								data={order}
								navigation={navigation}
							/>
						))}
					</ScrollView>
				</>
			)}
			{!isloading && (!notMyOrders || notMyOrders?.length == 0) && (
				<View className='justify-center h-3/5 items-center'>
					<Image
						source={require("../assets/no_active.png")}
						className='w-80 h-80'
					/>
					<Text className='text-gray-400'>
						No Active Order Contracts...
					</Text>
				</View>
			)}
		</View>
	)
}

export default ActiveOrdersDel
