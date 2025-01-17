const express = require('express');
const router = express.Router();
const { getPlans } = require('../services/aiInsights');  

router.post('/plans', async (req, res) => {
  console.log("Received userPreferences:", req.body.userPreferences); 
  const { userPreferences } = req.body;  

  if (!userPreferences) {
    return res.status(400).json({ 
      message: 'User preferences are required',
      workoutPlan: null,
      fullDayNutritionPlan: null
    });
  }

  try {
    const plans = await getPlans(userPreferences);
    
    if (!plans.workoutPlan || !plans.fullDayNutritionPlan) {
      return res.status(500).json({
        message: 'Failed to generate complete plans',
        workoutPlan: null,
        fullDayNutritionPlan: null
      });
    }

    res.status(200).json({
      message: 'Plans generated successfully',
      workoutPlan: plans.workoutPlan,
      fullDayNutritionPlan: plans.fullDayNutritionPlan
    });
    
  } catch (error) {
    console.error('Error generating plans:', error);
    res.status(500).json({
      message: 'Error generating plans',
      error: error.message,
      workoutPlan: null,
      fullDayNutritionPlan: null
    });
  }
});
module.exports = router;
