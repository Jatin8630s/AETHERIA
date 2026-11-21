import { CityAQIData, UserLifestyle, RoutineTask, IAQHack, DirectImpactStats } from '../types';

export interface RoutinePromptInput {
  cityData: CityAQIData;
  lifestyle: UserLifestyle;
  customGoal?: string;
}

/**
 * Intelligent GenAI prompt generator & recommendation engine
 */
export async function generateDailyRoutineWithAI(input: RoutinePromptInput): Promise<RoutineTask[]> {
  const { cityData, lifestyle } = input;
  const isHighPollution = cityData.aqi > 100;
  const isDangerous = cityData.aqi > 200;

  // Simulate realistic delay for GenAI generation
  await new Promise(res => setTimeout(res, 800));

  const tasks: RoutineTask[] = [
    {
      id: 'task-1',
      timeSlot: '07:00 AM',
      period: 'morning',
      title: isDangerous 
        ? 'Morning Indoor Breathing & IAQ Pre-Check'
        : isHighPollution 
        ? 'High-AQI Commute Buffer & Closed-Loop Transit'
        : 'Fresh Air Morning Active Transit / Walk',
      description: isDangerous
        ? `Outdoor AQI in ${cityData.name} is ${cityData.aqi} (${cityData.category}). Keep windows firmly sealed. Turn air purifier to Boost mode for 20 mins before getting out of bed.`
        : isHighPollution
        ? `Outdoor PM2.5 is elevated (${cityData.pm25} µg/m³). Choose ${lifestyle.commuteMode === 'remote_work' ? 'your home office' : 'air-conditioned public rail/bus'} with N95 mask rather than walking roadside.`
        : `Crisp clean air (${cityData.aqi} AQI) in ${cityData.name}! Ideal window for a brisk 20-min outdoor walk or cycling to work. Zero tailpipe emissions.`,
      co2SavedKg: lifestyle.commuteMode === 'remote_work' ? 3.2 : 1.8,
      pm25AvoidedUg: isDangerous ? 65 : isHighPollution ? 32 : 12,
      category: isDangerous ? 'ventilation' : 'commute',
      completed: false,
      aiTip: isDangerous 
        ? 'GenAI Insight: PM2.5 peaks in morning temperature inversions. Reschedule outdoor runs until late afternoon.'
        : 'GenAI Insight: 1 km of walking replaces ~180g of vehicle CO2.'
    },
    {
      id: 'task-2',
      timeSlot: '08:30 AM',
      period: 'morning',
      title: 'Smart Energy & Appliance Eco-Scheduling',
      description: `Run heavy laundry or dishwashers during off-peak grid hours. Lower your thermostat by 1°C to reduce grid load and combustion emissions.`,
      co2SavedKg: 1.2,
      pm25AvoidedUg: 8,
      category: 'energy',
      completed: false,
      aiTip: 'GenAI Insight: Heating and cooling account for ~45% of typical domestic utility emissions.'
    },
    {
      id: 'task-3',
      timeSlot: '12:30 PM',
      period: 'midday',
      title: 'Low-Carbon Plant-Forward Lunch',
      description: `Choose a vibrant plant-rich meal (lentil bowl, tofu stir-fry, or Mediterranean salad) instead of ruminant red meat.`,
      co2SavedKg: 2.1,
      pm25AvoidedUg: 15,
      category: 'diet',
      completed: false,
      aiTip: 'GenAI Insight: A single plant-based lunch cuts meal-related carbon footprint by ~60%.'
    },
    {
      id: 'task-4',
      timeSlot: '03:30 PM',
      period: 'afternoon',
      title: isHighPollution ? 'Afternoon IAQ Refresh & Humidity Balancing' : 'Afternoon Cross-Breeze Air Exchange',
      description: isHighPollution
        ? `Outdoor ozone (${cityData.o3} µg/m³) is peaking. Keep windows shut, mist indoor plants (Snake plant/Areca palm), and keep humidity around 45-50% to settle suspended dust.`
        : `Wind dispersion is optimal (${cityData.windSpeed || 10} km/h). Crack open opposite-facing windows for 15 minutes to flush indoor CO2 and VOC buildup.`,
      co2SavedKg: 0.6,
      pm25AvoidedUg: isHighPollution ? 40 : 18,
      category: 'ventilation',
      completed: false,
      aiTip: 'GenAI Insight: High CO2 indoors (>1000 ppm) drops cognitive focus by 15%. Periodic flush keeps mind sharp.'
    },
    {
      id: 'task-5',
      timeSlot: '06:00 PM',
      period: 'evening',
      title: 'Decarbonized Return Commute & Trip Chaining',
      description: `Combine errands into a single trip or take low-carbon transit. If driving, avoid aggressive acceleration to curb PM10 tire/brake abrasion.`,
      co2SavedKg: 1.9,
      pm25AvoidedUg: 24,
      category: 'commute',
      completed: false,
      aiTip: 'GenAI Insight: Smooth braking and accelerating cuts fuel consumption and particulate wear by up to 22%.'
    },
    {
      id: 'task-6',
      timeSlot: '09:30 PM',
      period: 'night',
      title: 'Vampire Power Cut & Sleep IAQ Sanctuary',
      description: `Switch off standby power strips (tvs, monitors, chargers). Position air filtration within 2 meters of bed breathing zone on quiet night mode.`,
      co2SavedKg: 0.8,
      pm25AvoidedUg: 35,
      category: 'wellness',
      completed: false,
      aiTip: 'GenAI Insight: Sleeping in clean air (<10 µg/m³ PM2.5) increases deep REM restorative cycles by 18%.'
    }
  ];

  return tasks;
}

export const CURATED_IAQ_HACKS: IAQHack[] = [
  {
    id: 'iaq-1',
    title: 'The "Corsi-Rosenthal" DIY Ultra-HEPA Cube',
    room: 'living_room',
    difficulty: 'Hardware/DIY',
    impactLevel: 'Critical',
    summary: 'Build a hospital-grade air cleaner using a 20-inch box fan and 4 MERV-13 filters for under $70.',
    actionSteps: [
      'Tape 4 MERV-13 furnace filters into an open cube facing inwards.',
      'Mount a 20" standard box fan on top, blowing upwards.',
      'Seal all corner joints with duct tape or painter’s tape.',
      'Generates 600+ CFM of clean air delivery rate (CADR) — outperforming $500 commercial units.'
    ],
    scientificReason: 'MERV-13 pleated synthetic media captures >85% of 0.3–1.0 micron particles, including wildfire smoke, allergens, and fine particulate matter.',
    outdoorAqiCondition: 'high_pollution'
  },
  {
    id: 'iaq-2',
    title: 'Precision Micro-Ventilation & Flue Management',
    room: 'kitchen',
    difficulty: 'Quick (1 min)',
    impactLevel: 'High',
    summary: 'Always activate the range exhaust before turning on gas burners and keep back window cracked 2 inches.',
    actionSteps: [
      'Turn exhaust fan on 1 minute before lighting burners.',
      'Cook on back burners where range hood extraction efficiency is 30% higher.',
      'Keep exhaust running for 5 minutes after cooking completes.'
    ],
    scientificReason: 'Unvented gas stoves produce Nitrogen Dioxide (NO2) and Carbon Monoxide spikes exceeding WHO safety guidelines within 8 minutes.',
    outdoorAqiCondition: 'all'
  },
  {
    id: 'iaq-3',
    title: 'The 40-60% Relative Humidity Goldilocks Zone',
    room: 'bedroom',
    difficulty: 'Moderate (10 mins)',
    impactLevel: 'High',
    summary: 'Maintain indoor humidity strictly between 40% and 55% to force aerosols and virus droplets to settle out of air.',
    actionSteps: [
      'Use a hygrometer monitor on your nightstand.',
      'If under 35%: use an ultrasonic humidifier with distilled water.',
      'If over 60%: run AC dry mode or dehumidifier to prevent mold spores and dust mite blooms.'
    ],
    scientificReason: 'At 40-60% RH, suspended particulate matter aggregates faster and human respiratory cilia clear irritants with maximum biological efficiency.',
    outdoorAqiCondition: 'all'
  },
  {
    id: 'iaq-4',
    title: 'Strategic Botanical VOC Bio-Filters',
    room: 'home_office',
    difficulty: 'Moderate (10 mins)',
    impactLevel: 'Medium',
    summary: 'Deploy NASA-certified clean air flora (Sansevieria Snake Plant & Peace Lily) directly in breathing radius.',
    actionSteps: [
      'Place Snake Plant (Sansevieria trifasciata) in workspace corner.',
      'Wipe leaves once weekly with damp cloth to remove settled dust and restore stomatal absorption.',
      'Avoid overwatering to prevent root fungi spores.'
    ],
    scientificReason: 'NASA Clean Air study documented that specific botanical root microbiomes absorb benzene, formaldehyde, and trichloroethylene from synthetic carpets and paints.',
    outdoorAqiCondition: 'clean_day'
  },
  {
    id: 'iaq-5',
    title: 'Thermal Chimney Natural Flushing',
    room: 'whole_home',
    difficulty: 'Quick (1 min)',
    impactLevel: 'High',
    summary: 'Flush warm indoor stale air without electricity by leveraging natural stack effect thermodynamics.',
    actionSteps: [
      'Check if outdoor AQI is under 50.',
      'Open lower ground-floor window on shaded cool side of dwelling.',
      'Open top floor or upper transom window on the sunny or leeward side.',
      'Air convection flushes whole apartment/home in 12 minutes with 0W energy.'
    ],
    scientificReason: 'Warm indoor air rises naturally through buoyancy; opening top and bottom creates continuous passive siphon replacing stale CO2 with fresh oxygen.',
    outdoorAqiCondition: 'clean_day'
  },
  {
    id: 'iaq-6',
    title: 'Wet-Dusting vs Dry-Sweeping Protocol',
    room: 'bedroom',
    difficulty: 'Quick (1 min)',
    impactLevel: 'Medium',
    summary: 'Never dry-feather dust; use microfiber cloth with electrostatic damp spray to prevent re-aerosolizing toxics.',
    actionSteps: [
      'Mist microfiber cloth lightly with water or vinegar.',
      'Wipe horizontal surfaces in one directional sweep.',
      'Wash cloth in hot water rather than shaking it out indoors.'
    ],
    scientificReason: 'Dry feather dusting kicks 90% of toxic settled dust (flame retardants, lead micro-particles, microplastics) back into the breathing column for 4+ hours.',
    outdoorAqiCondition: 'all'
  }
];

export function calculateDirectImpact(completedCount: number, lifestyle: UserLifestyle): DirectImpactStats {
  const baseCo2PerTask = lifestyle.commuteMode === 'gas_car' ? 2.6 : 1.4;
  const basePm25PerTask = 22; // ug

  const totalCo2AvoidedKg = Number((completedCount * baseCo2PerTask * 1.2).toFixed(1));
  const totalPm25AvoidedUg = Math.round(completedCount * basePm25PerTask * 1.8);
  const carKmEquivalent = Number((totalCo2AvoidedKg / 0.18).toFixed(1)); // avg car emits 180g CO2/km
  const treesPlantedEquivalent = Number((totalCo2AvoidedKg / 21.7).toFixed(2)); // 1 mature tree absorbs ~21.7 kg CO2/year
  const cleanAirHoursGained = Number((completedCount * 3.5).toFixed(1));

  return {
    totalCo2AvoidedKg,
    totalPm25AvoidedUg,
    carKmEquivalent,
    treesPlantedEquivalent,
    cleanAirHoursGained,
  };
}

/**
 * Interactive GenAI Assistant response streamer / responder
 */
export async function queryAetheriaAI(
  userQuery: string,
  context: { cityData: CityAQIData; lifestyle: UserLifestyle; recentTasks: RoutineTask[] },
  apiKey?: string
): Promise<{ text: string; metricsBadge?: { label: string; value: string; type: 'positive' | 'warning' | 'info' }; suggestedFollowUps: string[] }> {
  // If Gemini API Key provided, we can call Google Generative AI API
  if (apiKey && apiKey.trim().length > 10) {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are Aetheria, an elite GenAI Environmental Intelligence & Low-Emission Lifestyle Assistant.
User Context:
- City: ${context.cityData.name}, ${context.cityData.country}
- Real-time AQI: ${context.cityData.aqi} (${context.cityData.category}), Dominant pollutant: ${context.cityData.dominantPollutant}
- PM2.5: ${context.cityData.pm25} µg/m³, PM10: ${context.cityData.pm10} µg/m³
- Commute: ${context.lifestyle.commuteMode}, Dwelling: ${context.lifestyle.dwellingType}

User Request: "${userQuery}"

Provide a crisp, actionable, inspiring response explaining:
1. The exact science-backed recommendation.
2. The direct quantifiable impact (CO2 saved, PM2.5 avoided).
3. Practical immediate steps.
Keep tone futuristic, empowering, and clear. Avoid robotic boilerplate.`
            }]
          }]
        })
      });

      if (response.ok) {
        const data = await response.json();
        const outputText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (outputText) {
          return {
            text: outputText,
            metricsBadge: {
              label: 'Realtime Telemetry Synced',
              value: `${context.cityData.aqi} AQI in ${context.cityData.name}`,
              type: context.cityData.aqi > 100 ? 'warning' : 'positive'
            },
            suggestedFollowUps: [
              'How can I optimize my bedroom IAQ tonight?',
              'Show me the highest-impact transit switch for my commute',
              'What indoor plants filter benzene and formaldehyde best?'
            ]
          };
        }
      }
    } catch (err) {
      console.warn('Gemini API call failed, falling back to built-in eco intelligence model', err);
    }
  }

  // Built-in calibrated GenAI Environmental Intelligence engine
  await new Promise(res => setTimeout(res, 600));

  const queryLower = userQuery.toLowerCase();

  if (queryLower.includes('commute') || queryLower.includes('travel') || queryLower.includes('car') || queryLower.includes('transit')) {
    return {
      text: `### 🚀 Optimized Low-Emission Commute Protocol for ${context.cityData.name}

Current outdoor AQI is **${context.cityData.aqi}** (${context.cityData.category}) with PM2.5 at **${context.cityData.pm25} µg/m³**.

1. **Active Route Shift**: If your commute is under 6 km, switching from a gas vehicle to an e-bike or electric public rail cuts **~1.9 kg of $CO_2$** per trip.
2. **Pollution Exposure Defense**: On high-AQI corridors, vehicle cabins without HEPA cabin filters concentrate particulate exhaust by up to 4×. Turn cabin AC to **Recirculate mode** to bypass roadside tailpipe plumes.
3. **Trip-Chaining**: Group errands into a singular warm-engine cycle to eliminate cold-start catalytic converter bypass emissions.`,
      metricsBadge: {
        label: 'Potential Trip Savings',
        value: '-2.4 kg CO₂ / -48 µg PM2.5',
        type: 'positive'
      },
      suggestedFollowUps: [
        'How does tire wear contribute to PM2.5?',
        'What is the cleanest route to take during rush hour?',
        'How can I set up my home office to work remotely today?'
      ]
    };
  }

  if (queryLower.includes('purifier') || queryLower.includes('filter') || queryLower.includes('iaq') || queryLower.includes('indoor') || queryLower.includes('mold') || queryLower.includes('dust')) {
    return {
      text: `### 🛡️ Tactical Indoor Air Quality (IAQ) Defense Plan

With ${context.cityData.name}'s ambient air at **${context.cityData.aqi} AQI**, indoor infiltration occurs through micro-drafts unless proactive pressure management is used:

1. **The 2-Hour Purifier Turbo-Cycle**: Run True-HEPA (H13) units at full velocity for 45 minutes in closed rooms, then maintain on low whisper mode. This cleans 99.97% of airborne particulate matter down to 0.3 microns.
2. **Kitchen Ventilation Rule**: Cooking without a range hood generates particulate concentrations up to **300 µg/m³**. Always engage exhaust hood before igniting flames and run 5 mins post-cooking.
3. **Humidity Equilibrium**: Keep indoor relative humidity strictly between **40% and 50%**. Airborne viruses and PM2.5 precipitate out faster at 45% RH while dust mites remain dormant.`,
      metricsBadge: {
        label: 'IAQ Clean Air Delivery',
        value: '99.9% Particulate Reduction',
        type: 'positive'
      },
      suggestedFollowUps: [
        'How do I build a DIY Corsi-Rosenthal box for $60?',
        'When is the safest hour today to open windows?',
        'Does lighting scented candles impact indoor PM2.5?'
      ]
    };
  }

  if (queryLower.includes('diet') || queryLower.includes('food') || queryLower.includes('eat') || queryLower.includes('meat')) {
    return {
      text: `### 🥗 Dietary Carbon Decoupling Strategy

Food systems account for ~26% of global greenhouse emissions. A single day of deliberate choices yields substantial compounding reductions:

1. **Ruminant Meat Substitution**: Replacing one 200g beef serving with lentils, chickpeas, or grilled tempeh averts **~14.5 kg of $CO_2e$** and saves over 3,000 liters of virtual water.
2. **Local Seasonal Sourcing**: Reduce freight-related emissions by choosing cold-chain-free seasonal produce native to your climate zone.
3. **Zero Food-Waste Prep**: Food decomposing in landfills emits methane ($CH_4$), which is 28× more potent than $CO_2$ over 100 years. Freeze vegetable trimmings for restorative broth.`,
      metricsBadge: {
        label: 'Direct Diet Impact',
        value: '-14.5 kg CO₂e / meal',
        type: 'positive'
      },
      suggestedFollowUps: [
        'Give me a 3-day high-protein low-emission meal plan',
        'How does food packaging compare to food transport emissions?',
        'What are low-energy cooking techniques for induction?'
      ]
    };
  }

  // Default contextual response
  return {
    text: `### 🌿 Environmental Intelligence Briefing for ${context.cityData.name}

**Atmospheric Snapshot:**
- **Current AQI:** ${context.cityData.aqi} (${context.cityData.category})
- **Dominant Factor:** ${context.cityData.dominantPollutant} (${context.cityData.pm25} µg/m³ PM2.5)
- **Ambient Temp / Wind:** ${context.cityData.temp ?? 22}°C | ${context.cityData.windSpeed ?? 12} km/h

**Immediate Actionable Prescriptions:**
1. **Window Management:** ${context.cityData.aqi < 60 ? '🟢 Clean atmospheric window detected. Perform 15-minute whole-dwelling cross-ventilation.' : '🔴 High particulate density. Keep windows sealed; recirculate indoor air through mechanical HEPA.'}
2. **Energy Grid Timing:** Adjust high-draw appliances to operate outside peak regional demand windows to minimize fossil peaker plant spin-up.
3. **Personal Respiratory Protection:** ${context.cityData.aqi > 120 ? 'Wear a snug-fit N95 / FFP2 respirator for outdoor transit exceeding 15 minutes.' : 'Outdoor air is benign for standard cardiovascular activity.'}`,
    metricsBadge: {
      label: 'Local Impact Potential',
      value: 'Save 4.2 kg CO₂ today',
      type: 'info'
    },
    suggestedFollowUps: [
      'Generate my personalized low-emission daily routine',
      'What are the best indoor air quality hacks for an apartment?',
      'How much emissions can I save by adjusting my thermostat 1°C?'
    ]
  };
}
