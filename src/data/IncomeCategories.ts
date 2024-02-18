const incomeAssets = [
  { name: "Bonus", source: require("../assets/categories/bonus.png") },
  { name: "Business", source: require("../assets/categories/business.png") },
  {
    name: "Investment Income",
    source: require("../assets/categories/investmentIncome.png"),
  },
  { name: "Others", source: require("../assets/categories/others.png") },
  { name: "Pension", source: require("../assets/categories/pension.png") },
  { name: "pocket money", source: require("../assets/categories/pocketMoney.png") },
  { name: "Salary", source: require("../assets/categories/salary.png") },
];

export const getCategorySource = (name: string) => {
  const uppercaseName = name.toLowerCase();
  const category = incomeAssets.find(
    category => category.name.toLowerCase() === uppercaseName,
  );
  return category ? category.source : null;
};

export default incomeAssets;
