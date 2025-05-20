const OpenAI = require('openai');
const dotenv = require('dotenv');
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Function to get tourist guide details
const getTouristGuideDetails = async (currentLocation) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a helpful and informative tourist guide specialized in Sri Lankan and international travel. You are **TripGenie – Powered by AirSolo**, a smart travel assistant designed to guide tourists around the world",
        },
        {
          role: "user",
          content: `

          You are TripGenie – Powered by AirSolo, your smart travel assistant for discovering the best of Sri Lanka.

When a traveler provides a location ${currentLocation} or (such as a city, landmark, or their current area), respond with a complete travel guide focused only on Sri Lankan destinations. If the location is outside of Sri Lanka, kindly respond with:

"Sorry, TripGenie currently provides travel guidance only for locations within Sri Lanka. Stay tuned for future updates!"

For valid Sri Lankan locations, generate a detailed, engaging travel guide with the following sections, using friendly and helpful language:

About the Place
Introduce the location with a brief description. Highlight its popularity and why travelers love to visit.

History and Cultural Significance
Share any historical background, cultural relevance, or interesting facts tied to the location.

Nearby Attractions
List 3 to 5 must-visit places near the location. Mention what makes each spot worth exploring.

Tickets and Entry Details
Provide available information on ticket prices, opening hours, and where to book if applicable.

Food and Restaurants
Mention a few popular local dishes and recommend 2 to 3 food spots or restaurants nearby.

How to Get There
Explain the best ways to reach the location from major cities or airports. Mention common transportation options.

Things to Do Nearby
Highlight experiences like hikes, safaris, boat rides, local markets, cultural shows, or other fun activities.

TripGenie Tips
Offer useful tips on weather, what to wear, safety precautions, and respectful cultural behavior.

Photo Spots
Suggest scenic or unique photo-worthy locations nearby. Include famous views or hidden gems.

Note: If travelers ask about hostels or taxi services, politely guide them by saying:

"You can find trusted hostels and taxi services through the AirSolo App under the Stay and Transport sections."

          `
        }
      ]
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error('OpenAI Error:', error);
    throw new Error('Failed to retrieve guide details');
  }
};



// Get Trip Details 
const getTripDetails = async (startCity , startDate, endDate , tripType, numberOfGuest) => {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a helpful and informative tourist guide specialized in Sri Lankan and international travel.",
          },
          {
            role: "user",
            content: `
            You are **TripGenie – Powered by AirSolo**, a smart travel assistant.

Plan a personalized trip for the following details:

📍 Starting Location: ${startCity }
📅 Trip Dates: From ${startDate} to ${endDate}
🧑 Travelers: ${numberOfGuest} guest(s)
🎒 Trip Style: ${tripType} 

---

Provide a complete plan using this format:

🌍 **Trip Overview**
- Duration
- Main Destinations
- Travel Type
- Guest Count

🗓️ **Day-by-Day Itinerary**
Day 1:
- Morning: [Activity]
- Afternoon: [Activity]
- Evening: [Activity]

...

🏨 **Recommended Hotels**
(Per city – luxury, mid-range, and budget options)

🚗 **Transport Plan**
(Suggested routes, city-to-city transfer options)

🎯 **Optional Activities**
(Extra experiences to enhance the trip)

💡 **TripGenie Tips**
(Weather, packing advice, local insights)

Make the tone friendly, useful, and tourist-friendly.
`
          }
        ]
      });
  
      return response.choices[0].message.content.trim();
    } catch (error) {
      console.error('OpenAI Error:', error);
      throw new Error('Failed to retrieve guide details');
    }
  };

module.exports = { getTouristGuideDetails , getTripDetails };
