import {
	View,
	Text,
	Image,
	TextInput,
	ScrollView,
	TouchableOpacity,
	ActivityIndicator,
} from "react-native"
import React, { useEffect, useState } from "react"
import { MagnifyingGlassIcon } from "react-native-heroicons/outline"
import { ShoppingCartIcon } from "react-native-heroicons/solid"
import firestore from "@react-native-firebase/firestore"
import { firebase } from "../Firebase/firebaseConfig"
import FoodCard from "../components/FoodCard"
import { BannerAd, BannerAdSize, TestIds } from "react-native-google-mobile-ads"
import { SafeAreaView } from "react-native-safe-area-context"

const HomeScreen = ({ navigation }) => {
	const adUnitId = TestIds.BANNER
	const [foodData, setfoodData] = useState(null)
	const [filter, setfilter] = useState("none")
	const [isLoading, setisLoading] = useState(true)
	const [sortfoodData, setsortfoodData] = useState(null)
	const [filterfoodData, setfilterfoodData] = useState(null)
	const foodRef = firestore().collection("FoodData")
	const categories = [
		{ title: "⭐ Popular", tag: "popular" },
		{ title: "🥪 Breakfast", tag: "breakfast" },
		{ title: "🍦 Desserts", tag: "desserts" },
		{ title: "🌮 Snacks", tag: "snacks" },
		{ title: "☕ Drinks", tag: "drinks" },
	]
	useEffect(() => {
		foodRef.onSnapshot((querySnapshot) => {
			const food = []
			querySnapshot?.forEach((doc) => {
				const {
					available,
					foodName,
					foodDescription,
					foodPrice,
					foodImageUrl,
					foodType,
					id,
					mealType,
					time,
				} = doc.data()
				food.push({
					foodName,
					available,
					foodDescription,
					foodImageUrl,
					foodPrice,
					foodType,
					id,
					mealType,
					time,
				})
			})
			setfoodData(food)
			setsortfoodData(food)
			setfilterfoodData(food)
			setisLoading(false)
		})
	}, [])

	useEffect(() => {
		if (filter === "none") {
			setfilterfoodData(sortfoodData)
		} else {
			setfilterfoodData(
				sortfoodData.filter((item) => {
					return item.mealType === filter
				})
			)
		}
	}, [filter])

	return (
		<SafeAreaView className='flex-1 pb-20'>
			<ScrollView className='px-2 pt-1 flex-1' stickyHeaderIndices={[2]}>
				<View className='p-2 flex-row justify-between items-center'>
					<View>
						<Text className='text-lg text-gray-500'>
							Hi Foodie,
						</Text>
						<Text className='text-xl font-bold'>Hungry Today?</Text>
					</View>
					<View className='items-center justify-center'>
						<Image
							className='h-16 w-16'
							source={require("../assets/logo.png")}
						/>
					</View>
				</View>

				<View className='m-2 p-2 items-center justify-between bg-gray-300 border-[0.5px] border-gray-500 rounded-2xl flex-row'>
					<MagnifyingGlassIcon size={25} color='black' />
					<TextInput
						onChangeText={(e) => {
							setfilterfoodData(
								sortfoodData?.filter((item) => {
									return item?.foodName
										?.toLowerCase()
										?.includes(e.toLowerCase().trim())
								})
							)
						}}
						className='flex-1 px-2'
						type='text'
						placeholder='Search here...'
					/>
				</View>

				<View className='gap-2 py-2 bg-gray-100'>
					<ScrollView
						// contentContainerStyle={{ marginVertical: 3 }}
						horizontal
					>
						{categories.map((category) => (
							<TouchableOpacity
								key={category.tag}
								onPress={() => {
									filter === category.tag
										? setfilter("none")
										: setfilter(category.tag)
								}}
								className={
									filter === category.tag
										? "px-3 py-2 rounded-xl bg-black mx-2"
										: "px-3 py-2 rounded-xl border-gray-300 border-[0.5px] mx-2"
								}
							>
								<Text
									className={
										filter === category.tag
											? "text-white"
											: ""
									}
								>
									{category.title}
								</Text>
							</TouchableOpacity>
						))}
					</ScrollView>
					<View>
						<BannerAd
							unitId={adUnitId}
							width={260}
							height={50}
							size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
							requestOptions={{
								requestNonPersonalizedAdsOnly: true,
							}}
						/>
					</View>
				</View>
				{filterfoodData?.length === 0 && (
					<Text className='text-gray-400 text-center'>
						No Items Found...
					</Text>
				)}
				{isLoading && (
					<View className='self-center w-full'>
						<ActivityIndicator size={30} color='grey' />
					</View>
				)}
				{!isLoading && (
					<ScrollView
						contentContainerStyle={{
							flexWrap: "wrap",
							justifyContent: "space-evenly",
							flexDirection: "row",
						}}
						showsVerticalScrollIndicator={false}
						// className='flex-wrap justify-evenly flex-row'
					>
						{filterfoodData?.map((foodItem) => (
							<FoodCard
								key={foodItem.id}
								title={foodItem.foodName}
								available={foodItem.available}
								uri={foodItem.foodImageUrl}
								price={foodItem.foodPrice}
								time={foodItem.time}
								navigation={navigation}
								item={foodItem}
							/>
						))}
					</ScrollView>
				)}
			</ScrollView>
		</SafeAreaView>
	)
}

export default HomeScreen
