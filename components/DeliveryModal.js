import {
	View,
	Text,
	StyleSheet,
	TextInput,
	ScrollView,
	Modal,
	Pressable,
	ActivityIndicator,
} from "react-native"
import React, { useCallback, useEffect, useRef, useState } from "react"
import SelectDropdown from "react-native-select-dropdown"
import {
	ArrowLeftCircleIcon,
	ChevronDownIcon,
	ChevronUpIcon,
	PencilSquareIcon,
	PlusCircleIcon,
} from "react-native-heroicons/solid"
import { TouchableOpacity } from "react-native"
import firestore from "@react-native-firebase/firestore"
import Checkbox from "expo-checkbox"
import { firebase } from "@react-native-firebase/auth"
import Toast from "react-native-root-toast"
import SingleDel from "./SingleDel"
import { useFocusEffect } from "@react-navigation/native"

const DeliveryModal = ({ route, navigation }) => {
	const [isChecked, setChecked] = useState(false)
	const [isloading, setloading] = useState(false)
	const [isTnC, setTnC] = useState(false)
	const [isEditphn, setEditphn] = useState(false)
	const [showForm, setshowForm] = useState(false)
	const [modalVisible, setModalVisible] = useState(false)
	const hostels = [
		"Bhabha Bhavan",
		"Gajjar Bhavan",
		"Mother Teresa Bhavan",
		"Narmad Bhavan",
		"Nehru Bhavan",
		"Raman Bhavan",
		"Sarabhai Bhavan",
		"Swami Vivekanand Bhavan",
		"Tagore Bhavan",
	]
	const user = firebase.auth().currentUser
	const [del, setdel] = useState(null)
	const [name, setname] = useState(null)
	const [phn, setphn] = useState(null)
	const [editphn, seteditphn] = useState(null)
	const [room, setroom] = useState(null)
	const [adno, setadno] = useState(null)
	const [hostel, sethostel] = useState(null)
	const cartData = route?.params?.cartData
	const delRef = firestore().collection("DeliveryDetails").doc(user.uid)
	useEffect(() => {
		let Name = user.displayName.replace(" SVNIT", "")
		Name = (Name[0] + Name.slice(1).toLowerCase()).split(" ")
		setname(
			Name.map((word) => {
				return word[0].toUpperCase() + word.substring(1)
			}).join(" ")
		)
		setadno(user.email.split("@")[0])
		delRef.onSnapshot((doc) => {
			if (doc?.exists) {
				setshowForm(false)
				setTnC(true)
				setphn(doc.data().phone_no)
				setdel(doc.data().info)
			} else {
				setdel(null)
				setshowForm(true)
				setTnC(false)
			}
		})
	}, [])
	const showToast = (mess) => {
		Toast.show(mess, {
			position: 100,
			backgroundColor: "black",
			textColor: "white",
			opacity: 1,
			duration: 1000,
		})
	}
	const validatephn = (no) => {
		const regex = new RegExp(
			"^[+]?[(]?[0-9]{3}[)]?[-s.]?[0-9]{3}[-s.]?[0-9]{4,6}$"
		)
		return regex.test(no)
	}
	const info = () => {
		if (!name || !phn || !room || !hostel) {
			showToast("⚠️All Fields are Required to Proceed!")
			return
		}
		if (!validatephn(phn)) {
			showToast("Enter Correct Phone No !")
			return
		}
		if (!isChecked) {
			if (!isTnC) {
				showToast("Please Accept Terms & Conditions !")
				return
			}
		}
		setModalVisible(true)
	}
	const handleProceed = () => {
		setloading(true)
		delRef.get().then(async (doc) => {
			if (doc?.exists && doc.data()?.info.length > 0) {
				await delRef
					.update({
						info: firestore.FieldValue.arrayUnion({
							name,
							admission_no: adno,
							phn,
							room: room.trim(),
							hostel,
							photoUrl: user.photoURL,
							uid: user.uid,
						}),
					})
					.then(() => {
						setloading(false)
						setModalVisible(false)
						!isTnC &&
							navigation.reset({
								index: 0,
								routes: [{ name: "DelScreen" }],
							})
					})
			} else {
				await delRef
					.set({
						info: [
							{
								name,
								admission_no: adno,
								phn: phn.trim(),
								room: room.trim(),
								hostel,
								photoUrl: user.photoURL,
								uid: user.uid,
							},
						],
						phone_no: phn.trim(),
						history: [],
						orderIds: [],
					})
					.then(() => {
						setloading(false)
						setModalVisible(false)
						!isTnC &&
							navigation.reset({
								index: 0,
								routes: [{ name: "DelScreen" }],
							})
					})
			}
		})
	}
	const editPhnNo = () => {
		if (!validatephn(editphn)) {
			showToast("Enter Correct Phone No !")
			return
		}
		delRef.get().then(async (doc) => {
			if (doc?.exists) {
				await delRef
					.update({
						phone_no: editphn,
					})
					.then(() => {
						setEditphn(false)
						setModalVisible(false)
						showToast("Phone No. Edited !")
					})
			}
		})
	}

	return (
		<View className='flex-1 pt-3 px-5 pb-20'>
			<ScrollView showsVerticalScrollIndicator={false}>
				<View className='flex-row justify-between'>
					<View>
						<Text className='text-3xl font-bold'>
							Delivery Details
						</Text>

						{cartData && (
							<Text className='text-xs text-gray-400'>
								{`${
									showForm ? "Enter" : "Select"
								} Your Details`}
							</Text>
						)}
					</View>
					{!showForm && (
						<View className='gap-y-1'>
							{!isEditphn && (
								<>
									<TouchableOpacity
										onPress={() => {
											setshowForm(true)
										}}
										className='rounded-lg border-[0.8px] border-orange-200
						items-center flex-row p-2 bg-orange-100'
									>
										<PlusCircleIcon
											size={20}
											color='orange'
										/>
										<Text className='font-bold'>
											Add Address
										</Text>
									</TouchableOpacity>

									<TouchableOpacity
										onPress={() => {
											setEditphn(true)
										}}
										className='rounded-lg border-[0.8px] border-orange-200
						items-center flex-row p-2 bg-orange-100'
									>
										<PencilSquareIcon
											size={20}
											color='orange'
										/>
										<Text className='font-bold'>
											Edit Phone No.
										</Text>
									</TouchableOpacity>
								</>
							)}
						</View>
					)}
					{isTnC && (showForm || isEditphn) && (
						<TouchableOpacity
							onPress={() => {
								setshowForm(false)
								setEditphn(false)
							}}
							className='rounded-full border-[0.8px] border-gray-200
						items-center flex-row p-2 bg-gray-200'
						>
							<ArrowLeftCircleIcon size={20} color='black' />
							<Text className='font-bold'>Back</Text>
						</TouchableOpacity>
					)}
				</View>
				{!showForm && !isEditphn && (
					<View className='py-5 flex-row'>
						<ScrollView
							contentContainerStyle={{
								flexWrap: "wrap",
								flexDirection: "row",
							}}
						>
							{del?.map((info, idx) => (
								<SingleDel
									cartData={cartData}
									key={idx}
									data={info}
									navigation={navigation}
								/>
							))}
						</ScrollView>
					</View>
				)}
				{showForm && (
					<View className='bg-gray-100 pt-7'>
						<View className='gap-y-5'>
							{!isTnC && (
								<View className='gap-1'>
									<View className='flex-row items-center'>
										<Text className='px-1 text-bold'>
											Phone No.
										</Text>
										<Text className='px-1 text-gray-400'>
											(WhatsApp)
										</Text>
									</View>
									<TextInput
										onChangeText={(e) => {
											setphn(e)
										}}
										className='px-4 py-2  border-[0.5px] border-gray-300 rounded-lg'
										keyboardType='numeric'
										maxLength={10}
										placeholder=''
									/>
								</View>
							)}

							<View className='flex-row items-center justify-between'>
								<View className='gap-1 mr-5 flex-1'>
									<Text className='px-1 text-bold'>
										Room No.
									</Text>
									<TextInput
										onChangeText={(e) => {
											setroom(e)
										}}
										className='px-4 py-[10px] border-[0.5px] border-gray-300 rounded-lg'
										placeholder=''
										maxLength={5}
									/>
								</View>
								<View className='gap-1 flex-1'>
									<Text className='px-1 text-bold'>
										Hostel Name:
									</Text>
									<SelectDropdown
										data={hostels}
										onSelect={(selectedItem) => {
											sethostel(selectedItem)
										}}
										defaultButtonText={"Select Hostel..."}
										buttonTextAfterSelection={(
											selectedItem
										) => {
											return selectedItem
										}}
										rowTextForSelection={(item) => {
											return item
										}}
										buttonStyle={styles.dropdown1BtnStyle}
										buttonTextStyle={
											styles.dropdown1BtnTxtStyle
										}
										renderDropdownIcon={(isOpened) => {
											return isOpened ? (
												<ChevronUpIcon
													size={10}
													color='grey'
												/>
											) : (
												<ChevronDownIcon
													size={10}
													color='grey'
												/>
											)
										}}
										dropdownIconPosition={"right"}
										dropdownStyle={
											styles.dropdown1DropdownStyle
										}
										rowStyle={styles.dropdown1RowStyle}
										rowTextStyle={
											styles.dropdown1RowTxtStyle
										}
									/>
								</View>
							</View>
						</View>
						{!isTnC && (
							<>
								<View
									className='pl-2 pt-10'
									style={{ height: 200 }}
								>
									<ScrollView className='border-[0.8px] pr-5 gap-2 border-gray-300 rounded-lg'>
										<Text className='font-bold text-gray-500'>
											Terms and Conditions for Delivery
											Contract.
										</Text>
										<Text className='text-sm text-gray-400'>
											Please read these Terms and
											Conditions ("Agreement") carefully
											before entering into a delivery
											contract with Geetha Caterers
											("Company").
										</Text>
										<Text className='text-sm text-gray-400'>
											This Agreement sets forth the terms
											and conditions governing the
											delivery of goods by the Company. By
											engaging in a delivery contract with
											the Company, you ("Contractor")
											agree to be bound by these terms and
											conditions:
										</Text>
										<Text className='font-bold text-gray-500'>
											1).Delivery Payment:
										</Text>
										<Text className='text-sm text-gray-400'>
											{" "}
											a. The Contractor shall be entitled
											to receive payment for each delivery
											contract upon successful delivery of
											the goods to the designated
											recipient or destination.
										</Text>
										<Text className='text-sm text-gray-400'>
											{" "}
											b. The payment amount shall be as
											agreed upon between the Contractor
											and the Company and specified in the
											delivery contract.
										</Text>
										<Text className='font-bold text-gray-500'>
											{" "}
											2).Product Damages:
										</Text>
										<Text className='text-sm text-gray-400'>
											{" "}
											a. The Contractor acknowledges that
											it is their responsibility to handle
											and transport the goods with utmost
											care and professionalism during the
											delivery process.
										</Text>
										<Text className='text-sm text-gray-400'>
											{" "}
											b. In the event that a product is
											damaged during the delivery, the
											Contractor shall promptly inform the
											Company and provide all necessary
											details regarding the damage.
										</Text>
										<Text className='font-bold text-gray-500'>
											3).Resolution of Damages:
										</Text>
										<Text className='text-sm text-gray-400'>
											{" "}
											a. Upon notification of a damaged
											product, the Company shall evaluate
											the circumstances and determine an
											appropriate course of action, which
											may include replacing the damaged
											product or compensating the
											recipient.
										</Text>
										<Text className='text-sm text-gray-400'>
											{" "}
											b. The Contractor shall cooperate
											with the Company in the
											investigation and resolution of any
											reported damages.
										</Text>
										<Text className='font-bold text-gray-500'>
											{" "}
											4).Failure to Comply:
										</Text>
										<Text className='text-sm text-gray-400'>
											{" "}
											a. The Contractor understands that
											failure to comply with the terms and
											conditions of this Agreement,
											including non-payment for completed
											deliveries or failure to report
											damaged products, may result in
											disciplinary actions.
										</Text>
										<Text className='text-sm text-gray-400'>
											{" "}
											b. Disciplinary actions may include,
											but are not limited to, warnings,
											suspension of delivery privileges,
											termination of the contract, or
											legal recourse if deemed necessary.
										</Text>
										<Text className='font-bold text-gray-500'>
											5).Insurance and Liability:
										</Text>
										<Text className='text-sm text-gray-400'>
											{" "}
											a. The Contractor shall maintain
											appropriate insurance coverage to
											protect against any potential
											liability arising from the delivery
											services provided.
										</Text>
										<Text className='text-sm text-gray-400'>
											{" "}
											b. The Contractor is solely
											responsible for any loss, damage, or
											harm caused to the goods during the
											delivery process, except in cases of
											force majeure or circumstances
											beyond the Contractor's reasonable
											control.
										</Text>
									</ScrollView>
								</View>
								<TouchableOpacity
									onPress={() => {
										setChecked((prev) => !prev)
									}}
									className='flex-row py-2 items-center'
								>
									<View>
										<Checkbox
											value={isChecked}
											onValueChange={setChecked}
											color={
												isChecked
													? "rgb(251 146 60)"
													: undefined
											}
										/>
									</View>

									<Text className='p-2 text-gray-400 text-xs'>
										By accepting a delivery contract, the
										Contractor acknowledges that they have
										read, understood, and agreed to abide by
										these Terms and Conditions. Failure to
										comply with these terms may result in
										disciplinary actions.
									</Text>
								</TouchableOpacity>
							</>
						)}
						<View>
							<TouchableOpacity
								className='py-5 mt-7 bg-orange-400 rounded-lg'
								onPress={() => {
									info()
								}}
							>
								<Text className='text-center font-bold text-gray-50'>
									Add Delivery Details
								</Text>
							</TouchableOpacity>
						</View>
					</View>
				)}
				{modalVisible && (
					<>
						<Modal
							animationType='slide'
							transparent={true}
							visible={modalVisible}
							onRequestClose={() => {
								setModalVisible(!modalVisible)
							}}
							className='relative'
						>
							<View
								style={{
									shadowColor: "#000000",
									shadowOffset: {
										width: 0,
										height: 5,
									},
									shadowOpacity: 0.2,
									shadowRadius: 5.62,
									elevation: 7,
								}}
								className='justify-center items-center flex-1'
							>
								<View
									style={{
										opacity: 0.8,
									}}
									className='absolute top-0 bg-black w-full h-full'
								/>
								<View
									className={`w-80 justify-center p-5 bg-orange-50 rounded-3xl`}
								>
									{isloading && (
										<View className='justify-center'>
											<ActivityIndicator
												size={20}
												color='orange'
											/>
										</View>
									)}
									{!isloading && (
										<>
											<View>
												<Text className='text-xl text-center font-bold'>
													Confirm Your Details
												</Text>
											</View>
											<View className='gap-y-2 py-2'>
												<View className='px-1 pt-3 border-dashed border-t-[0.8px] border-gray-300 justify-between'>
													<Text className='text-xs text-gray-400'>
														Full Name :
													</Text>
													<Text className='text-gray-500 text-sm font-bold'>
														{name}
													</Text>
												</View>
												<View className='px-1 justify-between'>
													<Text className='text-xs text-gray-400'>
														Phone Number :
													</Text>
													<Text className='text-gray-500 text-sm font-bold'>
														{isEditphn
															? editphn
															: phn}
													</Text>
												</View>
												{!isEditphn && (
													<>
														<View className='px-1 justify-between'>
															<Text className='text-xs text-gray-400'>
																Room No. :
															</Text>
															<Text className='text-gray-500 text-sm font-bold'>
																{room}
															</Text>
														</View>
														<View className='px-1 pb-2 justify-between'>
															<Text className='text-xs text-gray-400'>
																Hostel :
															</Text>
															<Text className='text-gray-500 text-sm font-bold'>
																{hostel}
															</Text>
														</View>
													</>
												)}
											</View>
											<View className='flex-row gap-1 mt-3 items-center'>
												<Pressable
													onPress={() => {
														setModalVisible(false)
													}}
													className='flex-row flex-1 justify-center items-center gap-x-1  p-4 border-[0.5px] border-gray-800 rounded-lg'
												>
													<Text className='text-gray-800 text-center font-bold'>
														&lt; Back
													</Text>
												</Pressable>
												<Pressable
													onPress={
														isEditphn
															? editPhnNo
															: handleProceed
													}
													className='flex-row flex-1 justify-center items-center gap-x-1 p-4 bg-gray-800 rounded-lg'
												>
													<Text className='text-gray-50 text-center font-bold'>
														Proceed &gt;
													</Text>
												</Pressable>
											</View>
										</>
									)}
								</View>
							</View>
						</Modal>
					</>
				)}
				{isEditphn && !showForm && (
					<>
						<View className='gap-1 mt-7'>
							<View className='flex-row items-center'>
								<Text className='px-1 text-bold'>
									Phone No.
								</Text>
								<Text className='px-1 text-gray-400'>
									(WhatsApp)
								</Text>
							</View>
							<TextInput
								onChangeText={(e) => {
									seteditphn(e)
								}}
								className='px-4 py-2  border-[0.5px] border-gray-300 rounded-lg'
								keyboardType='numeric'
								maxLength={10}
								placeholder=''
							/>
						</View>
						<TouchableOpacity
							className='py-5 mt-7 bg-orange-400 rounded-lg'
							onPress={() => {
								setModalVisible(true)
							}}
						>
							<Text className='text-center font-bold text-gray-50'>
								Edit Phone Details
							</Text>
						</TouchableOpacity>
					</>
				)}
			</ScrollView>
		</View>
	)
}

const styles = StyleSheet.create({
	dropdown1BtnStyle: {
		width: "100%",
		backgroundColor: "rgb(243 244 246)",
		borderRadius: 8,
		borderWidth: 0.5,
		borderColor: "rgb(209 213 219)",
	},
	dropdown1BtnTxtStyle: { color: "#475569", fontSize: 13, textAlign: "left" },
	dropdown1DropdownStyle: {
		backgroundColor: "#EFEFEF",
	},
	dropdown1RowStyle: {
		backgroundColor: "#EFEFEF",
		borderBottomColor: "#C5C5C5",
	},
	dropdown1RowTxtStyle: { color: "#444", textAlign: "left" },
})

export default DeliveryModal
