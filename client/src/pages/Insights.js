import React, { useEffect, useState } from 'react';

const Insights = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [plans, setPlans] = useState({
    workoutPlan: null,
    fullDayNutritionPlan: null
  });

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const profileResponse = await fetch('http://localhost:5000/api/auth/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!profileResponse.ok) {
        throw new Error('Failed to fetch user profile');
      }

      const profileData = await profileResponse.json();
      
      const plansResponse = await fetch('http://localhost:5000/api/insights/plans', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userPreferences: {
            age: profileData.age,
            weight: profileData.weight,
            height: profileData.height,
            gender: profileData.gender,
            dietaryPreferences: profileData.dietaryPreferences,
            allergies: profileData.allergies || [],
            goals: profileData.goals
          }
        })
      });

      const plansData = await plansResponse.json();

      if (!plansResponse.ok) {
        throw new Error(plansData.message || 'Failed to fetch plans');
      }

      setPlans({
        workoutPlan: plansData.workoutPlan,
        fullDayNutritionPlan: plansData.fullDayNutritionPlan
      });
    } catch (err) {
      setError(err.message);
      console.error('Error fetching plans:', err);
    } finally {
      setLoading(false);
    }
  };

  const parseMacros = (text) => {
    if (!text) return [];
    const macroMatches = text.match(/Protein:.*?(\d+)g.*?Carbs:.*?(\d+)g.*?Fats:.*?(\d+)g/);
    if (macroMatches) {
      return [
        `Protein: ${macroMatches[1]}g`,
        `Carbs: ${macroMatches[2]}g`,
        `Fats: ${macroMatches[3]}g`
      ];
    }
    return [];
  };

  const parseIngredients = (text) => {
    if (!text) return [];
    return text.split('-')
      .map(item => item.trim())
      .filter(item => item && !item.toLowerCase().includes('ingredients:'));
  };

  const parseInstructions = (text) => {
    if (!text) return [];
    const steps = text.split(/\d+\./g)
      .map(step => step.trim())
      .filter(Boolean);
    return steps;
  };

  const extractCalories = (text) => {
    const calorieMatch = text.match(/Calories:?\s*(\d+)/);
    return calorieMatch ? calorieMatch[1] : null;
  };

  const renderMealSection = (title, mealData) => {
    if (!mealData) return null;

    const calories = extractCalories(mealData);
    const macros = parseMacros(mealData);
    const ingredients = parseIngredients(mealData);
    const instructions = parseInstructions(mealData);

    return (
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h3 className="text-2xl font-bold mb-4 text-blue-600 border-b pb-2">{title}</h3>
        
        {calories && (
          <div className="mb-4">
            <h4 className="text-lg font-semibold text-gray-700">Calories</h4>
            <p className="text-gray-600">{calories} calories</p>
          </div>
        )}

        {macros.length > 0 && (
          <div className="mb-4">
            <h4 className="text-lg font-semibold text-gray-700">Macronutrients</h4>
            <div className="flex flex-wrap gap-4 mt-2">
              {macros.map((macro, index) => (
                <div key={index} className="bg-blue-50 px-3 py-1 rounded-full text-blue-600">
                  {macro}
                </div>
              ))}
            </div>
          </div>
        )}

        {ingredients.length > 0 && (
          <div className="mb-4">
            <h4 className="text-lg font-semibold text-gray-700">Ingredients</h4>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              {ingredients.map((ingredient, index) => (
                <li key={index} className="text-gray-600">{ingredient}</li>
              ))}
            </ul>
          </div>
        )}

        {instructions.length > 0 && (
          <div className="mb-4">
            <h4 className="text-lg font-semibold text-gray-700">Instructions</h4>
            <ol className="list-decimal pl-5 mt-2 space-y-2">
              {instructions.map((instruction, index) => (
                <li key={index} className="text-gray-600">{instruction}</li>
              ))}
            </ol>
          </div>
        )}
      </div>
    );
  };

  const renderWorkoutPlan = (workoutPlan) => {
    if (!workoutPlan) return null;

    const sections = workoutPlan.split('###').filter(Boolean);
    
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-2xl font-bold mb-6 text-blue-600 border-b pb-2">Your Workout Plan</h2>
        {sections.map((section, index) => {
          const [title, ...content] = section.split('\n').filter(Boolean);
          return (
            <div key={index} className="mb-6">
              <h3 className="text-xl font-semibold mb-3 text-gray-800">{title.trim()}</h3>
              <div className="space-y-2">
                {content.map((line, lineIndex) => {
                  const formattedLine = line.trim();
                  if (formattedLine.startsWith('-')) {
                    return (
                      <div key={lineIndex} className="pl-4">
                        <p className="text-gray-600">{formattedLine.substring(1).trim()}</p>
                      </div>
                    );
                  }
                  return (
                    <p key={lineIndex} className="text-gray-700">{formattedLine}</p>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen p-4">
      <div className="bg-blue-600 text-white py-6 px-4 rounded mb-6">
        <h1 className="text-3xl font-bold">Your Personalized Insights</h1>
      </div>

      {loading && (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-blue-600 text-lg">Loading your personalized plans...</div>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative my-4">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="max-w-4xl mx-auto">
          {renderWorkoutPlan(plans.workoutPlan)}

          <div className="space-y-6">
            {renderMealSection('Breakfast', plans.fullDayNutritionPlan?.breakfast)}
            {renderMealSection('Morning Snack', plans.fullDayNutritionPlan?.snack1)}
            {renderMealSection('Lunch', plans.fullDayNutritionPlan?.lunch)}
            {renderMealSection('Afternoon Snack', plans.fullDayNutritionPlan?.snack2)}
            {renderMealSection('Dinner', plans.fullDayNutritionPlan?.dinner)}
          </div>

          <button
            onClick={fetchPlans}
            className="fixed bottom-4 right-4 bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Refresh Plans
          </button>
        </div>
      )}
    </div>
  );
};

export default Insights;