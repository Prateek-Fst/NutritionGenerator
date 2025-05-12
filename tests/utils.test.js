const { estimateGrams } = require('../src/server');

test('estimateGrams for butter 1 tbsp', () => {
  expect(estimateGrams({ name: 'Butter', quantity: '1 tbsp' })).toBeCloseTo(15 * 0.867);
});

test('estimateGrams for cumin 1 tsp', () => {
  expect(estimateGrams({ name: 'Cumin', quantity: '1 tsp' })).toBeCloseTo(5 * 0.833);
});

test('estimateGrams for tomato 2 medium', () => {
  expect(estimateGrams({ name: 'Tomato', quantity: '2 medium' })).toBe(200);
});