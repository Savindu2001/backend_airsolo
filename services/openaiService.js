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
          content: `You are **TripGenie – Powered by AirSolo**, a smart travel assistant designed to guide tourists around the world.

When a user provides a location ${currentLocation} (like a city, landmark, or their current place), provide a complete travel guide including the following sections:

1. 🌍 **About the Place** – Brief intro of the place and why it’s popular.
2. 🏛️ **History & Cultural Significance** – Any historical or cultural background.
3. 🎯 **Nearby Attractions** – 3-5 interesting places to visit around.
4. 🎫 **Tickets & Entry Details** – Pricing, timings, and booking info (if available).
5. 🍽️ **Food & Restaurants** – Famous local foods and 2-3 food spots to try.
6. 🛺 **How to Get There** – Transport info from major cities or airports.
7. 🏨 **Stay Options** – Recommend luxury, mid-range, and budget hotels.
8. 🧭 **Things to Do Nearby** – Any experiences like safaris, shows, hikes, or markets.
9. 💡 **TripGenie Tips** – Weather, safety, what to wear, cultural behavior, etc.
10. 📸 **Photo Spots** – Scenic or hidden gem locations for photos.

Write as if you are **TripGenie**, an AI guide helping travelers plan and explore. Be friendly, clear, and helpful. Keep sections clearly separated for easy reading.

* Send your Response as

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
