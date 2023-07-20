import { View, Text, ScrollView, Image } from "react-native"
import React, { useEffect, useState } from "react"
import { firebase } from "@react-native-firebase/auth"
import firestore from "@react-native-firebase/firestore"
import SingleDelHistory from "../components/SingleDelHistory"

const HistoryDel = () => {
	const user = firebase.auth().currentUser
	const [data, setdata] = useState(null)
	const [sortdata, setsortdata] = useState(null)
	const delRef = firestore().collection("DeliveryDetails").doc(user.uid)
	useEffect(() => {
		delRef?.onSnapshot((doc) => {
			setdata(doc?.data()?.history)
		})
	}, [])
	useEffect(() => {
		const sortedData = data?.sort(
			(a, b) => parseInt(b.timeAdded) - parseInt(a.timeAdded)
		)
		setsortdata(sortedData)
	}, [data])
	return (
		<View className='flex-1'>
			{data?.length > 0 && (
				<ScrollView
					showsVerticalScrollIndicator={false}
					contentContainerStyle={{
						paddingTop: 20,
						paddingHorizontal: 10,
						paddingBottom: 70,
					}}
				>
					{sortdata?.map((order) => (
						<SingleDelHistory data={order} key={order?.id} />
					))}
				</ScrollView>
			)}
			{data?.length == 0 && (
				<View className='justify-center h-3/5 items-center'>
					<Image
						source={require("../assets/no_history.png")}
						className='w-80 h-80'
					/>
					<Text className='text-gray-400'>
						No Delivery History...
					</Text>
				</View>
			)}
		</View>
	)
}

export default HistoryDel
