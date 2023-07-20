import React from "react"
import {
	SafeAreaView,
	Image,
	StyleSheet,
	FlatList,
	View,
	Text,
	StatusBar,
	TouchableOpacity,
	Dimensions,
} from "react-native"

const { width, height } = Dimensions.get("window")

const COLORS = { primary: "#fff", white: "#fff" }

const slides = [
	{
		id: "1",
		image: require("../assets/order.png"),
		title: "Discover The Menu",
		subtitle: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
	},
	{
		id: "2",
		image: require("../assets/pay.png"),
		title: "Complete The Payment",
		subtitle: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
	},
	{
		id: "3",
		image: require("../assets/takeaway.png"),
		title: "Takeaway Your Order",
		subtitle: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
	},
]

const Slide = ({ item }) => {
	return (
		<View style={{ alignItems: "center" }}>
			<Image
				source={item?.image}
				style={{ height: "75%", width, resizeMode: "contain" }}
			/>
			<View>
				<Text style={styles.title}>{item?.title}</Text>
				<Text style={styles.subtitle}>{item?.subtitle}</Text>
			</View>
		</View>
	)
}

const OnboardingScreen = ({ navigation }) => {
	const [currentSlideIndex, setCurrentSlideIndex] = React.useState(0)
	const ref = React.useRef()
	const updateCurrentSlideIndex = (e) => {
		const contentOffsetX = e.nativeEvent.contentOffset.x
		const currentIndex = Math.round(contentOffsetX / width)
		setCurrentSlideIndex(currentIndex)
	}

	const goToNextSlide = () => {
		const nextSlideIndex = currentSlideIndex + 1
		if (nextSlideIndex != slides.length) {
			const offset = nextSlideIndex * width
			ref?.current.scrollToOffset({ offset })
			setCurrentSlideIndex(currentSlideIndex + 1)
		}
	}

	const skip = () => {
		const lastSlideIndex = slides.length - 1
		const offset = lastSlideIndex * width
		ref?.current.scrollToOffset({ offset })
		setCurrentSlideIndex(lastSlideIndex)
	}

	const Footer = () => {
		return (
			<View
				style={{
					height: height * 0.25,
					justifyContent: "space-between",
					paddingHorizontal: 20,
				}}
			>
				{/* Indicator container */}
				<View
					style={{
						flexDirection: "row",
						justifyContent: "center",
						marginTop: 20,
					}}
				>
					{/* Render indicator */}
					{slides.map((_, index) => (
						<View
							key={index}
							style={[
								styles.indicator,
								currentSlideIndex == index && {
									backgroundColor: "orange",
									width: 25,
								},
							]}
						/>
					))}
				</View>

				{/* Render buttons */}
				<View style={{ marginBottom: 20, padding: 12 }}>
					{currentSlideIndex == slides.length - 1 ? (
						<View style={{ height: 50 }}>
							<TouchableOpacity
								style={styles.btn}
								onPress={() => {
									navigation.navigate("Login&SignUp")
								}}
							>
								<Text
									style={{
										color: "white",
										fontWeight: "bold",
										fontSize: 15,
									}}
								>
									GET STARTED
								</Text>
							</TouchableOpacity>
						</View>
					) : (
						<View style={{ flexDirection: "row", padding: 12 }}>
							<TouchableOpacity
								activeOpacity={0.8}
								style={[
									styles.btn,
									{
										borderColor: "grey",
										borderWidth: 1,
										backgroundColor: "transparent",
									},
								]}
								onPress={skip}
							>
								<Text
									style={{
										fontWeight: "bold",
										fontSize: 15,
										color: "grey",
									}}
								>
									SKIP
								</Text>
							</TouchableOpacity>
							<View style={{ width: 15 }} />
							<TouchableOpacity
								activeOpacity={0.8}
								onPress={goToNextSlide}
								style={styles.btn}
							>
								<Text
									style={{
										color: "white",
										fontWeight: "bold",
										fontSize: 15,
									}}
								>
									NEXT
								</Text>
							</TouchableOpacity>
						</View>
					)}
				</View>
			</View>
		)
	}

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: COLORS.primary }}>
			<StatusBar backgroundColor={COLORS.primary} />
			<FlatList
				ref={ref}
				onMomentumScrollEnd={updateCurrentSlideIndex}
				contentContainerStyle={{ height: height * 0.75 }}
				showsHorizontalScrollIndicator={false}
				horizontal
				data={slides}
				pagingEnabled
				renderItem={({ item }) => <Slide item={item} />}
			/>

			<Footer />
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	subtitle: {
		color: "grey",
		fontSize: 13,
		marginTop: 10,
		maxWidth: "70%",
		textAlign: "center",
		lineHeight: 23,
	},
	title: {
		color: "black",
		fontSize: 22,
		fontWeight: "900",
		marginTop: 20,
		textAlign: "center",
	},
	image: {
		height: "100%",
		width: "100%",
		resizeMode: "contain",
	},
	indicator: {
		height: 2.5,
		width: 10,
		backgroundColor: "grey",
		marginHorizontal: 3,
		borderRadius: 2,
	},
	btn: {
		flex: 1,
		height: 50,
		borderRadius: 10,
		backgroundColor: "orange",
		justifyContent: "center",
		alignItems: "center",
	},
})
export default OnboardingScreen
