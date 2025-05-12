# Smart Nutrition Estimator

## Overview

This project is a Node.js-based nutrition estimator for home-cooked Indian meals, developed as part of the Vyb AI Assignment. It calculates nutritional content (energy in kJ and kcal, carbohydrates, and protein) for dishes based on hardcoded ingredient data, eliminating the dependency on Google Spreadsheets. The system processes a list of dishes, handles edge cases, logs assumptions, and generates JSON output files for nutritional information.

## Features

* **Hardcoded Data**: Uses static data for ingredients, unit conversions, food categories, and nutrition values.
* **Nutrition Calculation**: Estimates nutritional content per serving, scaled to standard serving sizes (e.g., katori, tablespoon).
* **Edge Case Handling**: Manages missing quantities, invalid ingredients, and ambiguous dish types with logged assumptions.
* **API Endpoint**: Provides a POST endpoint (`/get-nutrition`) to compute nutrition for a given dish.
* **Output Generation**: Saves results as JSON files in the `output/` directory.
* **Logging**: Records assumptions and edge case handling in `debug-log.txt`.
* **Unit Tests**: Includes Jest tests for the `estimateGrams` function to ensure accurate unit conversions.

## Project Structure

```
vyb-ai-assignment/
├── src/
│   └── server.js               # Main Express API with hardcoded data and logic
├── tests/
│   └── utils.test.js          # Unit tests for estimateGrams function
├── output/                    # Directory for generated JSON output files
├── debug-log.txt              # Log file for edge case handling and assumptions
├── README.md                  # Project documentation
├── package.json               # Dependencies and scripts
```

## Approach

The system:

* **Fetches Ingredients**: Retrieves ingredient lists for dishes from a hardcoded `simulatedIngredients` object.
* **Maps Ingredients**: Matches ingredients to nutrition data, handling synonyms (e.g., "jeera" to "Cumin").
* **Estimates Weights**: Converts quantities (e.g., "2 medium", "1 tbsp") to grams using unit mappings and density factors.
* **Calculates Nutrition**: Computes total energy (kJ, kcal), carbohydrates, and protein based on ingredient weights.
* **Scales to Serving Size**: Adjusts nutrition values to standard serving sizes based on dish type (e.g., 150g for Veg Gravy).
* **Handles Edge Cases**: Logs assumptions for missing data, invalid inputs, or ambiguous dish types.
* **Outputs Results**: Generates JSON files and responds with nutrition data via the API.

## Assumptions

* **Serving Sizes**: Vary by dish type (e.g., 150g for Veg Gravy, 100g for Veg Fry).
* **Missing Quantities**: Default to ingredient-specific values (e.g., 100g for potato) or 100g if unspecified.
* **Invalid Ingredients**: Skipped with a log entry if not found in nutrition data or if malformed (e.g., missing name).
* **Unit Conversions**: 1ml ≈ 1g for liquids (e.g., cream, milk).
* **Density for Tablespoons**: Uses specific density values (e.g., 0.867 for butter, 0.833 for cumin).
* **Dish Type Classification**: Based on keywords (e.g., "sabzi" for Veg Fry, "curry" for Veg Gravy), defaulting to "Other" (150g) if unclear.

## Fallback Design

* **Missing Quantities**: Use ingredient-specific defaults or 100g.
* **Missing/Invalid Ingredients**: Skip with a log entry.
* **Ambiguous Units**: Convert using predefined `unitConversions` or default to 100g.
* **Unrecognized Dish Types**: Default to "Other" with a 150g serving size.
* **Zero Total Grams**: Set to the dish's serving weight to avoid division by zero.

## Setup and Installation

### Clone the Repository

```bash
git clone https://github.com/Prateek-Fst/NutritionGenerator.git
```

### Install Dependencies

```bash
npm install
```

### Run Tests

```bash
npm test
```

Runs Jest tests in `tests/utils.test.js` to verify `estimateGrams` for butter, cumin, and tomato conversions.

### Start the Server

```bash
npm start
```

Starts the Express server on `http://localhost:3000`.

### Test the API

```bash
curl -X POST -H "Content-Type: application/json" -d '{"dishName":"Paneer Butter Masala"}' http://localhost:3000/get-nutrition
```

Outputs JSON with nutrition data and saves results to `output/paneer_butter_masala.json`.

## Example Output

For "Paneer Butter Masala":

```json
{
  "dishName": "Paneer Butter Masala",
  "dishType": "Veg Gravy",
  "nutritionPerServing": {
    "energy_kj": 549.23,
    "energy_kcal": 132.45,
    "carb_g": 4.32,
    "protein_g": 7.65
  },
  "servingWeight": 150
}
```

## Edge Case Handling

### Jeera Aloo (mild fried)

* **Issue**: Missing quantity for potato.
* **Handling**: Defaults to 100g.
* **Log**: "Assumption: Missing quantity for 'Potato'. Defaulting to 100g."

### Gobhi Sabzi

* **Issue**: Ambiguous dish type.
* **Handling**: Classified as "Veg Fry" due to "sabzi" keyword.
* **Log**: "Assumption: Classified 'Gobhi Sabzi' as 'Veg Fry' based on name match."

### Chana Masala

* **Issue**: None (all ingredients available).
* **Handling**: Processes normally.

### Paneer Curry with Capsicum

* **Issue**: Quantity in "glass".
* **Handling**: Converts to 250g (from `unitConversions.glass`).
* **Log**: "Assumption: Converted 1 glass of 'Paneer' to 250g (assuming 1ml ≈ 1g)."

### Mixed Veg

* **Issue**: No fixed recipe.
* **Handling**: Uses provided ingredients, classified as "Veg Gravy".
* **Log**: "Assumption: Classified 'Mixed veg' as 'Veg Gravy' based on name match."

Logs are saved in `debug-log.txt`, and JSON outputs are generated in the `output/` directory.

## Reasoning Task

### Task Chosen

Map "lightly roasted jeera powder" to a nutrition entry.

### Reasoning

"Lightly roasted jeera powder" refers to roasted cumin powder. Roasting has minimal impact on nutritional content, so it maps to "Cumin" in the nutrition data (375 kcal/100g). The `unitMappings` includes "cumin" with aliases like "jeera" for accurate mapping.

### Log Entry

"Assumption: Mapped synonym 'jeera' to 'Cumin'."

## Dependencies

* `express`: ^4.18.2 (for the API server)
* `jest`: ^29.7.0 (for unit testing)

### Install via:

```bash
npm install express jest
```
