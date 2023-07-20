import { View, Text } from "react-native"
import React, { useCallback, useState } from "react"
import SelectDropdown from "react-native-select-dropdown"
import { StyleSheet } from "react-native"
import {
	ArrowsUpDownIcon,
	ChevronDownIcon,
	ChevronUpIcon,
	FunnelIcon,
} from "react-native-heroicons/outline"
import { useFocusEffect } from "@react-navigation/native"

const SortnFilter = ({ Sort, Filter, setSort, setFilter }) => {
	const [reset, setreset] = useState(false)
	const filter = [
		"All",
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
	const sort = [
		{ id: "recent", render: "Recent", bttn: "Most Recent" },
		{ id: "htl", render: "High to Low", bttn: "CPoints: High to Low" },
		{ id: "lth", render: "Low to High", bttn: "CPoints: Low to High" },
	]

	return (
		<View key={reset} className='flex-row'>
			<SelectDropdown
				data={sort}
				defaultValueByIndex={0}
				onSelect={(selectedItem) => {
					setSort(selectedItem.id)
				}}
				renderCustomizedButtonChild={(selectedItem) => {
					return (
						<View className='flex-row p-2 justify-center items-center'>
							<View className='flex-1'>
								<ArrowsUpDownIcon size={15} color='black' />
							</View>

							<Text className='font-bold flex-[10] text-center text-gray-500'>
								{selectedItem?.render
									? selectedItem?.render
									: "Sort"}
							</Text>
							<View className='flex-1'>
								<ChevronDownIcon size={15} color='grey' />
							</View>
						</View>
					)
				}}
				rowTextForSelection={(item) => {
					return item.bttn
				}}
				buttonStyle={styles.dropdown1BtnStyle}
				buttonTextStyle={styles.dropdown1BtnTxtStyle}
				dropdownIconPosition={"right"}
				dropdownStyle={styles.dropdown1DropdownStyle}
				rowStyle={styles.dropdown1RowStyle}
				rowTextStyle={styles.dropdown1RowTxtStyle}
			/>
			<SelectDropdown
				data={filter}
				defaultValueByIndex={0}
				onSelect={(selectedItem) => {
					setFilter(selectedItem === "All" ? "all" : selectedItem)
				}}
				renderCustomizedButtonChild={(selectedItem) => {
					return (
						<View className='flex-row p-2 justify-center items-center'>
							<View className='flex-1'>
								<FunnelIcon size={15} color='black' />
							</View>

							<Text className='font-bold flex-[10] text-center text-gray-500'>
								{selectedItem
									? selectedItem.split(" ")[0] === "Mother"
										? "MTB"
										: selectedItem.split(" ")[0]
									: "Filter"}
							</Text>
							<View className='flex-1'>
								<ChevronDownIcon size={15} color='grey' />
							</View>
						</View>
					)
				}}
				buttonTextAfterSelection={(selectedItem) => {
					return selectedItem.split(" ")[0]
				}}
				rowTextForSelection={(item) => {
					return item
				}}
				buttonStyle={styles.dropdown1BtnStyle}
				buttonTextStyle={styles.dropdown1BtnTxtStyle}
				dropdownIconPosition={"right"}
				dropdownStyle={styles.dropdown1DropdownStyle}
				rowStyle={styles.dropdown1RowStyle}
				rowTextStyle={styles.dropdown1RowTxtStyle}
			/>
		</View>
	)
}

const styles = StyleSheet.create({
	dropdown1BtnStyle: {
		width: "49%",
		marginRight: 10,
		backgroundColor: "rgb(243, 244, 246)",
		borderRadius: 8,
		borderWidth: 0.5,
		borderColor: "rgb(209 213 219)",
	},
	dropdown1BtnTxtStyle: {
		color: "#475569",
		fontSize: 13,
		textAlign: "center",
	},
	dropdown1DropdownStyle: {
		backgroundColor: "#EFEFEF",
	},
	dropdown1RowStyle: {
		backgroundColor: "#EFEFEF",
		borderBottomColor: "#C5C5C5",
	},
	dropdown1RowTxtStyle: { color: "#444", textAlign: "left" },
})

export default SortnFilter
