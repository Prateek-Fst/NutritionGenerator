const express = require('express');
const fs = require('fs');

const app = express();
app.use(express.json());

const logFile = 'debug-log.txt';

function logToFile(message) {
  fs.appendFileSync(logFile, `${new Date().toISOString()} - ${message}\n`);
}

const unitMappings = {
  paneer: { default: 100, aliases: ['cheese', 'paneer'] },
  butter: { default: 50, tbspDensity: 0.867, aliases: ['butter', 'ghee', 'makhan'] },
  tomato: { medium: 100, large: 150, aliases: ['tomato', 'tamatar'] },
  onion: { medium: 100, large: 150, aliases: ['onion', 'pyaz'] },
  cream: { default: 100, aliases: ['cream', 'malai'] },
  milk: { default: 100, aliases: ['milk', 'doodh'] },
  potato: { medium: 100, large: 150, aliases: ['potato', 'aloo'] },
  cauliflower: { default: 100, aliases: ['cauliflower', 'gobhi', 'gobi', 'phoolgobhi', 'phool gobhi'] },
  lentil: { default: 100, aliases: ['lentil', 'lentils', 'dal', 'daal', 'chana'] },
  garlic: { default: 10, aliases: ['garlic', 'lahsun'] },
  ginger: { default: 10, aliases: ['ginger', 'adrak', 'adarak'] },
  capsicum: { default: 100, aliases: ['capsicum', 'bell pepper', 'shimla mirch', 'shimlamirch', 'shimlamirchi', 'shimla mirchi', 'simlamirch', 'simlamirchi'] },
  oil: { default: 100, tbspDensity: 0.867, aliases: ['oil', 'tel', 'mustardoil', 'mustard oil', 'sunfloweroil', 'sunflower oil', 'vegetable oil', 'sarson ka tel', 'sarso tel'] },
  sugar: { default: 100, tbspDensity: 0.833, aliases: ['sugar', 'chini'] },
  flour: { default: 100, tbspDensity: 0.533, aliases: ['flour', 'atta', 'maida'] },
  cumin: { default: 10, tbspDensity: 0.833, aliases: ['cumin', 'jeera'] },
  chickpea: { default: 100, aliases: ['chickpea', 'chana'] },
  carrot: { default: 100, aliases: ['carrot', 'gajar'] }
};

const simulatedIngredients = {
  'Paneer Butter Masala': [
    { name: 'Paneer', quantity: '200g' },
    { name: 'Butter', quantity: '50g' },
    { name: 'Tomato', quantity: '2 medium' },
    { name: 'Onion', quantity: '1 large' },
    { name: 'Cream', quantity: '100ml' },
  ],
  'Aloo Gobi': [
    { name: 'Potato', quantity: '2 medium' },
    { name: 'Cauliflower', quantity: '200g' },
    { name: 'Tomato', quantity: '1 medium' },
    { name: 'Onion', quantity: '1 medium' },
    { name: 'Ginger', quantity: '10g' },
  ],
  'Dal Tadka': [
    { name: 'Lentil', quantity: '100g' },
    { name: 'Tomato', quantity: '1 medium' },
    { name: 'Onion', quantity: '1 medium' },
    { name: 'Garlic', quantity: '10g' },
    { name: 'Butter', quantity: '20g' },
  ],
  'Jeera Aloo (mild fried)': [
    { name: 'Potato', quantity: '' },
    { name: 'Cumin', quantity: '1 tsp' },
  ],
  'Gobhi Sabzi': [
    { name: 'Cauliflower', quantity: '200g' },
    { name: 'Potato', quantity: '1 medium' },
    { name: 'Tomato', quantity: '1 medium' },
  ],
  'Chana masala': [
    { name: 'Chickpea', quantity: '100g' },
    { name: 'Tomato', quantity: '1 medium' },
    { name: 'Onion', quantity: '1 medium' },
  ],
  'Paneer Curry with capsicum': [
    { name: 'Paneer', quantity: '1 glass' },
    { name: 'Capsicum', quantity: '100g' },
    { name: 'Tomato', quantity: '1 medium' },
  ],
  'Mixed veg': [
    { name: 'Potato', quantity: '1 medium' },
    { name: 'Cauliflower', quantity: '100g' },
    { name: 'Carrot', quantity: '100g' },
  ],
};

const unitConversions = {
  piece: 1,
  katori: 150,
  glass: 250,
  teaspoon: 5,
  tablespoon: 15,
  teacup: 100
};

const foodCategories = [
  { category: 'Dry Rice Item', measuringUnit: 'Katori', weight: 124 },
  { category: 'Wet Rice Item', measuringUnit: 'Katori', weight: 150 },
  { category: 'Veg Gravy', measuringUnit: 'Katori', weight: 150 },
  { category: 'Veg Fry', measuringUnit: 'Katori', weight: 100 },
  { category: 'Non - Veg Gravy', measuringUnit: 'Katori', weight: 150 },
  { category: 'Non - Veg Fry', measuringUnit: 'Katori', weight: 100 },
  { category: 'Dals', measuringUnit: 'Katori', weight: 150 },
  { category: 'Wet Breakfast Item', measuringUnit: 'Katori', weight: 130 },
  { category: 'Dry Breakfast Item', measuringUnit: 'Katori', weight: 100 },
  { category: 'Chutneys', measuringUnit: 'Tbsp', weight: 15 },
  { category: 'Plain Flatbreads', measuringUnit: 'Piece', weight: 50 },
  { category: 'Stuffed Flatbreads', measuringUnit: 'Piece', weight: 100 },
  { category: 'Salads', measuringUnit: 'Katori', weight: 100 },
  { category: 'Raita', measuringUnit: 'Katori', weight: 150 },
  { category: 'Plain Soups', measuringUnit: 'Katori', weight: 150 },
  { category: 'Mixed Soups', measuringUnit: 'Cup', weight: 250 },
  { category: 'Hot Beverages', measuringUnit: 'Cup', weight: 250 },
  { category: 'Beverages', measuringUnit: 'Cup', weight: 250 },
  { category: 'Snacks', measuringUnit: 'Katori', weight: 100 },
  { category: 'Sweets', measuringUnit: 'Katori', weight: 120 }
];

const nutritionData = [
  { food_name: 'Paneer', energy_kj: 1100, energy_kcal: 265, carb_g: 1.2, protein_g: 18.3 },
  { food_name: 'Butter', energy_kj: 3050, energy_kcal: 717, carb_g: 0.1, protein_g: 0.9 },
  { food_name: 'Tomato', energy_kj: 75, energy_kcal: 18, carb_g: 3.9, protein_g: 0.9 },
  { food_name: 'Onion', energy_kj: 167, energy_kcal: 40, carb_g: 9.3, protein_g: 1.1 },
  { food_name: 'Cream', energy_kj: 1000, energy_kcal: 240, carb_g: 2.9, protein_g: 2.1 },
  { food_name: 'Potato', energy_kj: 322, energy_kcal: 77, carb_g: 17.5, protein_g: 2 },
  { food_name: 'Cauliflower', energy_kj: 104, energy_kcal: 25, carb_g: 5, protein_g: 1.9 },
  { food_name: 'Ginger', energy_kj: 335, energy_kcal: 80, carb_g: 17.8, protein_g: 1.8 },
  { food_name: 'Lentil', energy_kj: 1439, energy_kcal: 343, carb_g: 60, protein_g: 24 },
  { food_name: 'Garlic', energy_kj: 623, energy_kcal: 149, carb_g: 33, protein_g: 6.4 },
  { food_name: 'Cumin', energy_kj: 1569, energy_kcal: 375, carb_g: 44.2, protein_g: 17.8 },
  { food_name: 'Chickpea', energy_kj: 1582, energy_kcal: 378, carb_g: 62.9, protein_g: 20.5 },
  { food_name: 'Capsicum', energy_kj: 84, energy_kcal: 20, carb_g: 4.6, protein_g: 0.9 },
  { food_name: 'Carrot', energy_kj: 171, energy_kcal: 41, carb_g: 9.6, protein_g: 0.9 }
];

function getIngredients(dishName) {
  const ingredients = simulatedIngredients[dishName];
  if (!ingredients) {
    logToFile(`Assumption: No recipe found for '${dishName}'. Returning empty ingredients list.`);
    return [];
  }
  return ingredients;
}

function mapIngredientToFood(ingredientName) {
  let lowerName = ingredientName.toLowerCase();
  for (const [key, value] of Object.entries(unitMappings)) {
    if (value.aliases && value.aliases.includes(lowerName)) {
      lowerName = key;
      logToFile(`Assumption: Mapped synonym '${ingredientName}' to '${key}'.`);
    }
  }
  const food = nutritionData.find(food => food.food_name.toLowerCase() === lowerName);
  if (!food) {
    logToFile(`Assumption: Ingredient '${ingredientName}' not found in nutrition DB. Skipping.`);
  }
  return food;
}

function estimateGrams(ingredient) {
  const { name, quantity } = ingredient;
  const lowerName = name.toLowerCase();

  if (!quantity) {
    logToFile(`Assumption: Missing quantity for '${name}'. Defaulting to ${unitMappings[lowerName]?.default || 100}g.`);
    return unitMappings[lowerName]?.default || 100;
  }

  if (quantity.endsWith('g')) {
    return parseFloat(quantity);
  } else if (quantity.includes('medium')) {
    const count = parseInt(quantity.split(' ')[0]) || 1;
    return count * (unitMappings[lowerName]?.medium || unitMappings[lowerName]?.default || 100);
  } else if (quantity.includes('large')) {
    const count = parseInt(quantity.split(' ')[0]) || 1;
    return count * (unitMappings[lowerName]?.large || unitMappings[lowerName]?.default || 150);
  } else if (quantity.endsWith('ml')) {
    return parseFloat(quantity);
  } else if (quantity.includes('tbsp')) {
    const count = parseInt(quantity.split(' ')[0]) || 1;
    const ml = unitConversions['tablespoon'] * count;
    const density = unitMappings[lowerName]?.tbspDensity || 1;
    logToFile(`Assumption: Converted ${count} tbsp of '${name}' to ${ml * density}g (density: ${density}g/ml).`);
    return ml * density;
  } else if (quantity.includes('tsp')) {
    const count = parseInt(quantity.split(' ')[0]) || 1;
    const ml = unitConversions['teaspoon'] * count;
    const density = unitMappings[lowerName]?.tbspDensity || 1;
    logToFile(`Assumption: Converted ${count} tsp of '${name}' to ${ml * density}g (density: ${density}g/ml).`);
    return ml * density;
  } else if (quantity.includes('glass')) {
    const count = parseInt(quantity.split(' ')[0]) || 1;
    const ml = unitConversions['glass'] * count;
    logToFile(`Assumption: Converted ${count} glass of '${name}' to ${ml}g (assuming 1ml ≈ 1g).`);
    return ml;
  } else {
    logToFile(`Assumption: Unrecognized quantity '${quantity}' for '${name}'. Defaulting to ${unitMappings[lowerName]?.default

 || 100}g.`);
    return unitMappings[lowerName]?.default || 100;
  }
}

function calculateNutrition(ingredients) {
  let totalNutrition = {
    energy_kj: 0,
    energy_kcal: 0,
    carb_g: 0,
    protein_g: 0
  };

  ingredients.forEach(ingredient => {
    const food = mapIngredientToFood(ingredient.name);
    if (food) {
      const grams = estimateGrams(ingredient);
      const factor = grams / 100;
      totalNutrition.energy_kj += food.energy_kj * factor;
      totalNutrition.energy_kcal += food.energy_kcal * factor;
      totalNutrition.carb_g += food.carb_g * factor;
      totalNutrition.protein_g += food.protein_g * factor;
    }
  });

  return totalNutrition;
}

function scaleToKatori(totalNutrition, totalGrams, servingWeight) {
  const factor = servingWeight / totalGrams;
  return {
    energy_kj: totalNutrition.energy_kj * factor,
    energy_kcal: totalNutrition.energy_kcal * factor,
    carb_g: totalNutrition.carb_g * factor,
    protein_g: totalNutrition.protein_g * factor
  };
}

function identifyDishType(dishName) {
  const lowerName = dishName.toLowerCase();

  for (const category of foodCategories) {
    const catLower = category.category.toLowerCase();
    if (
      (lowerName.includes('sabzi') && catLower.includes('veg fry')) ||
      (lowerName.includes('curry') && catLower.includes('veg gravy')) ||
      (lowerName.includes('dal') && catLower.includes('dals')) ||
      (lowerName.includes('aloo') && catLower.includes('veg fry')) ||
      (lowerName.includes('chana') && catLower.includes('dals')) ||
      (lowerName.includes('mixed veg') && catLower.includes('veg gravy'))
    ) {
      logToFile(`Assumption: Classified '${dishName}' as '${category.category}' based on name match.`);
      return { type: category.category, servingWeight: category.weight };
    }
  }

  logToFile(`Assumption: No specific category match for '${dishName}'. Defaulting to 'Other' with 150g serving.`);
  return { type: 'Other', servingWeight: 150 };
}

app.post('/get-nutrition', async (req, res) => {
  const { dishName } = req.body;
  if (!dishName) return res.status(400).json({ error: 'Dish name is required' });

  try {
    fs.writeFileSync(logFile, '');

    const ingredients = getIngredients(dishName);
    const { type: dishType, servingWeight } = identifyDishType(dishName);

    let totalGrams = 0;
    ingredients.forEach(ingredient => {
      totalGrams += estimateGrams(ingredient);
    });

    if (totalGrams === 0) {
      logToFile(`Assumption: Total grams is 0 for '${dishName}'. Setting to ${servingWeight}g.`);
      totalGrams = servingWeight;
    }

    const totalNutrition = calculateNutrition(ingredients);
    const katoriNutrition = scaleToKatori(totalNutrition, totalGrams, servingWeight);

    const output = {
      dishName,
      dishType,
      nutritionPerServing: katoriNutrition,
      servingWeight
    };

    fs.writeFileSync(`./output/${dishName.toLowerCase().replace(/[^a-z0-9]/g, '_')}.json`, JSON.stringify(output, null, 2));
    res.json(output);
  } catch (error) {
    console.error(`Error processing '${dishName}':`, error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// Only start the server if this module is run directly
if (require.main === module) {
  app.listen(3000, () => {
    console.log('Server running on port 3000');
  });
}

module.exports = { estimateGrams };