const expenseAssets = [
  {
    name: "Air Tickets",
    source: require("../assets/categories/airTickets.png"),
  },
  {
    name: "Auto Rickshaw",
    source: require("../assets/categories/autoRickshaw.png"),
  },
  { name: "Bike", source: require("../assets/categories/bike.png") },
  { name: "Bills", source: require("../assets/categories/bills.png") },
  { name: "Bus", source: require("../assets/categories/bus.png") },
  { name: "Cable TV", source: require("../assets/categories/cableTV.png") },
  { name: "Car", source: require("../assets/categories/car.png") },
  { name: "Card Fee", source: require("../assets/categories/cardFee.png") },
  {
    name: "Car Insurance",
    source: require("../assets/categories/carInsurance.png"),
  },
  { name: "Cigarrete", source: require("../assets/categories/cigarrete.png") },
  { name: "Cleaner", source: require("../assets/categories/cleaner.png") },
  { name: "Clothes", source: require("../assets/categories/clothes.png") },
  { name: "Diet", source: require("../assets/categories/diet.png") },
  { name: "Drinks", source: require("../assets/categories/drinks.png") },
  { name: "Driver", source: require("../assets/categories/driver.png") },
  { name: "Earning", source: require("../assets/categories/earning.png") },
  { name: "Education", source: require("../assets/categories/education.png") },
  {
    name: "Electricity",
    source: require("../assets/categories/electricity.png"),
  },
  {
    name: "Entertainment",
    source: require("../assets/categories/entertainment.png"),
  },
  { name: "Fast Food", source: require("../assets/categories/fastFood.png") },
  { name: "Festivals", source: require("../assets/categories/festivals.png") },
  { name: "Fitness", source: require("../assets/categories/fitness.png") },
  {
    name: "Fruits & Vegetable",
    source: require("../assets/categories/fruits&vegetables.png"),
  },
  { name: "Fuel", source: require("../assets/categories/fuel.png") },
  { name: "Furniture", source: require("../assets/categories/furniture.png") },
  { name: "Gifts", source: require("../assets/categories/gifts.png") },
  { name: "Groceries", source: require("../assets/categories/groceries.png") },
  { name: "Health", source: require("../assets/categories/health.png") },
  {
    name: "Health Insurance",
    source: require("../assets/categories/healthInsurance.png"),
  },
  { name: "Hobbies", source: require("../assets/categories/hobbies.png") },
  {
    name: "Home Insurance",
    source: require("../assets/categories/homeInsurance.png"),
  },
  { name: "Internet", source: require("../assets/categories/internet.png") },
  { name: "Laundry", source: require("../assets/categories/laundry.png") },
  { name: "Medicines", source: require("../assets/categories/medicines.png") },
  { name: "Milk", source: require("../assets/categories/milk.png") },
  { name: "Others", source: require("../assets/categories/others.png") },
  { name: "Parking", source: require("../assets/categories/parking.png") },
  { name: "Party", source: require("../assets/categories/party.png") },
  { name: "Pets", source: require("../assets/categories/pets.png") },
  { name: "Phone", source: require("../assets/categories/phone.png") },
  {
    name: "Repair",
    source: require("../assets/categories/repair&maintenance.png"),
  },
  { name: "shopping", source: require("../assets/categories/shopping.png") },
  {
    name: "stationary",
    source: require("../assets/categories/stationary.png"),
  },
  { name: "taxes", source: require("../assets/categories/taxes.png") },
  { name: "taxi", source: require("../assets/categories/taxi.png") },
  { name: "toys", source: require("../assets/categories/toys.png") },
  { name: "vacation", source: require("../assets/categories/vacation.png") },
  { name: "water", source: require("../assets/categories/water.png") },
];

export const getCategorySource = (name: string) => {
  const uppercaseName = name.toUpperCase();

  const category = expenseAssets.find(
    category => category.name.toUpperCase() === uppercaseName,
  );

  return category ? category.source : null;
};

export default expenseAssets;
