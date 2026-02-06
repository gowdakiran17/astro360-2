export interface VedicRemedy {
    gemstone: string;
    metal: string;
    rudraksha: string;
    karma: string;
    donation: string;
    mantra: string;
    diet: string;
    abstinence: string;
    environment: string;
    secrets: string[];    // Expanded Gupt Upay (Array of 3)
    deity: string;
    color: string;
    day: string;
    situational: {
        business: string;
        interview: string;
        marriage: string;
        promotion: string;
        jobSearch: string;
        marriageDelay: string;
        marriageStability: string;
        businessGrowth: string;
    };
    why: Record<string, string>; // The "Why" behind each category
    timing?: 'sunrise' | 'midday' | 'sunset' | 'night';
    direction?: 'East' | 'West' | 'North' | 'South' | 'North-East' | 'North-West' | 'South-East' | 'South-West';
}

export const ZODIAC_LORDS: Record<string, string> = {
    'Aries': 'Mars', 'Taurus': 'Venus', 'Gemini': 'Mercury', 'Cancer': 'Moon',
    'Leo': 'Sun', 'Virgo': 'Mercury', 'Libra': 'Venus', 'Scorpio': 'Mars',
    'Sagittarius': 'Jupiter', 'Capricorn': 'Saturn', 'Aquarius': 'Saturn', 'Pisces': 'Jupiter'
};

export const VEDIC_REMEDIES: Record<string, any> = {
    'Sun': {
        gemstone: 'Ruby', metal: 'Gold / Copper', rudraksha: '1 Mukhi',
        karma: 'Touch feet of father or elders daily. Wake up before sunrise.',
        donation: 'Donate wheat or copper vessels to a temple on Sunday.',
        mantra: 'Om Hram Hrim Hraum Sah Suryaya Namah',
        diet: 'Consume ginger, honey, and black pepper. Avoid cold foods.',
        abstinence: 'Avoid salt on Sundays. Do not lie or be arrogant.',
        environment: 'Keep the Eastern part of your home bright and airy.',
        secrets: [
            'Bury a square copper piece in the soil of a secluded spot on a Sunday morning.',
            'Carry a small square piece of pure copper in your pocket/purse at all times.',
            'Keep a red-colored handkerchief in your pocket when going for important work.'
        ],
        deity: 'Lord Shiva / Surya',
        why: {
            gemstone: 'Enhances willpower, professional authority, and heart energy.',
            metal: 'Gold conducts Solar heat to the blood; Copper purifies blood circulation.',
            rudraksha: '1-Mukhi connects the individual consciousness to the Supreme Soul.',
            karma: 'Sun represents the Father; respecting him aligns your solar-solar plexus frequency.',
            donation: 'Giving wheat on Sundays releases internal ego blockages related to status.',
            mantra: 'Sonic vibrations that trigger the Sahasrara and Manipura chakras.',
            diet: 'Ginger and honey stimulate Agni (digestive fire), reflecting Sun\'s heat.',
            abstinence: 'Salt on Sundays weakens the Solar magnetic field in the body.',
            vault: 'Esoteric metal burying redirects stubborn bad luck related to reputation.'
        }
    },
    'Moon': {
        gemstone: 'Pearl', metal: 'Silver', rudraksha: '2 Mukhi',
        karma: 'Respect mother and elderly women. Offer water to plants daily.',
        donation: 'Donate milk, rice, or white clothes to needy women on Monday.',
        mantra: 'Om Shram Shrim Shraum Sah Chandraya Namah',
        diet: 'Consume coconut water, cucumber, and pears. Avoid sour foods at night.',
        abstinence: 'Avoid milk at night. Do not waste water.',
        environment: 'Keep the North-West corner clean and clutter-free.',
        secrets: [
            'Drink water from a silver glass or vessel daily to stabilize emotions.',
            'Keep a solid square piece of silver in your wallet or purse.',
            'Offer raw milk mixed with water to a Shiva Lingam on Mondays.'
        ],
        deity: 'Lord Shiva / Gauri',
        color: 'bg-white',
        day: 'Monday',
        situational: {
            business: 'Silver trading or liquid assets',
            interview: 'Wear white or cream',
            marriage: 'Gauri Puja',
            promotion: 'Offer milk to Shiva',
            jobSearch: 'North-West direction',
            marriageDelay: 'Gauri Shankar Rudraksha',
            marriageStability: 'Silver coin in water',
            businessGrowth: 'Moonlight meditation'
        },
        why: {
            gemstone: 'Stabilizes fluctuating emotions and cools the nervous system.',
            metal: 'Silver has high thermal conductivity, cooling the brain and emotional body.',
            rudraksha: '2-Mukhi symbolizes the unity of Shiva-Shakti, bringing peace to the mind.',
            karma: 'Moon represents the Mother; service to her ensures emotional stability and fluid luck.',
            donation: 'White items on Monday balance the watery elements in the subtle body.',
            mantra: 'Soft sonic frequencies that nourish the Swadhisthana (Sacral) chakra.',
            vault: 'Silver interacts with the lunar bio-field to calm the mind.'
        }
    },
    'Mars': {
        gemstone: 'Red Coral', metal: 'Gold / Copper', rudraksha: '3 Mukhi',
        karma: 'Avoid harsh speech with siblings. Help those in physical distress.',
        donation: 'Donate red lentils (masoor dal) or jaggery on Tuesday.',
        mantra: 'Om Kram Krim Kraum Sah Bhaumaya Namah',
        diet: 'Consume red lentils, pomegranate, and warm spices. Avoid heavy meat.',
        abstinence: 'Avoid anger on Tuesdays.',
        environment: 'Keep the South direction heavy.',
        secrets: [
            'Wear a copper ring on the ring finger of your right hand.',
            'Float sweet batashas (sugar drops) in flowing water on Tuesdays.',
            'Keep a piece of red coral or red agate in the South corner of your home.'
        ],
        deity: 'Lord Kartikeya / Hanuman',
        color: 'bg-red-500',
        day: 'Tuesday',
        situational: {
            business: 'Real estate or metals',
            interview: 'Wear red tie/accessory',
            marriage: 'Mangala Gauri',
            promotion: 'Hanuman Chalisa',
            jobSearch: 'South direction',
            marriageDelay: 'Kumbh Vivah',
            marriageStability: 'Coral in bedroom',
            businessGrowth: 'Copper pyramid'
        },
        why: {
            gemstone: 'Increases courage, vitality, and physical stamina.',
            metal: 'Copper balances the heat (pitta) of Mars, grounding aggressive energy.',
            rudraksha: '3-Mukhi represents Agni; it purifies the soul of past karmic guilt.',
            karma: 'Mars is the Protector; helping siblings aligns your inner warrior energy.',
            donation: 'Giving red items on Tuesday releases built-up heat and frustration.',
            vault: 'Copper and sweets pacify the fiery turbulence of Mars.'
        }
    },
    'Mercury': {
        gemstone: 'Emerald', metal: 'Gold / Silver', rudraksha: '4 Mukhi',
        karma: 'Respect younger sisters and aunts. Feed green grass to cows.',
        donation: 'Donate green clothes or pulses to children on Wednesday.',
        mantra: 'Om Bram Brim Braum Sah Budhaya Namah',
        diet: 'Consume green leafy vegetables and mung beans. Avoid alcohol.',
        abstinence: 'Avoid broad-leaved plants indoors.',
        environment: 'Keep the North direction open and green.',
        secrets: [
            'Wear a green thread on your right wrist on Wednesdays.',
            'Keep a solid silver ball in your pocket for business acumen.',
            'Brush your teeth with alum (fitkari) to purify speech.'
        ],
        deity: 'Lord Vishnu / Ganesha',
        color: 'bg-green-500',
        day: 'Wednesday',
        situational: {
            business: 'Trading and communication',
            interview: 'Wear green',
            marriage: 'Vishnu Sahasranama',
            promotion: 'Feed cows',
            jobSearch: 'North direction',
            marriageDelay: 'Emerald offering',
            marriageStability: 'Green plants in bedroom',
            businessGrowth: 'Budh Yantra'
        },
        why: {
            gemstone: 'Sharpens intellect, communication, and business acumen.',
            metal: 'Gold enhances Mercury\'s analytical side; Silver cools its nervous speed.',
            rudraksha: '4-Mukhi represents Brahma; it expands logical reasoning and memory.',
            karma: 'Mercury is the Communicator; respecting students/daughters aligns your mental field.',
            donation: 'Green items on Wednesday improve neuro-linguistic resonance.',
            vault: 'Green thread and silver ball balance the nervous electrical impulses.'
        }
    },
    'Jupiter': {
        gemstone: 'Yellow Sapphire', metal: 'Gold', rudraksha: '5 Mukhi',
        karma: 'Respect teachers and spiritual guides. Clean a nearby temple.',
        donation: 'Donate yellow sweets or books to students on Thursday.',
        mantra: 'Om Gram Grim Graum Sah Gurave Namah',
        diet: 'Consume turmeric, honey, and grams. Avoid non-veg on Thursdays.',
        abstinence: 'Avoid laziness and disrespecting elders.',
        environment: 'Keep the North-East corner sacred and clean.',
        secrets: [
            'Wear a turmeric root tied in a yellow cloth around your neck or arm.',
            'Apply a saffron or turmeric tilak on your forehead daily.',
            'Keep a yellow handkerchief in your pocket at all times.'
        ],
        deity: 'Lord Shiva / Brihaspati',
        color: 'bg-yellow-500',
        day: 'Thursday',
        situational: {
            business: 'Consulting or teaching',
            interview: 'Wear yellow',
            marriage: 'Guru Puja',
            promotion: 'Offer yellow sweets',
            jobSearch: 'North-East direction',
            marriageDelay: 'Banana tree worship',
            marriageStability: 'Yellow sapphire',
            businessGrowth: 'Sri Yantra'
        },
        why: {
            gemstone: 'Attracts wisdom, wealth, and divine grace (Bhagya).',
            metal: 'Gold is the purest conductor of the expansive "Visha-Guna" of Jupiter.',
            rudraksha: '5-Mukhi represents Kalagni Rudra; it controls blood pressure and heart health.',
            karma: 'Jupiter is the Guru; service to wisdom-bearers attracts expansion.',
            donation: 'Sharing sweets/wisdom on Thursday aligns your causal body with abundance.',
            vault: 'Turmeric and saffron amplify the bio-magnetic aura of wisdom.'
        }
    },
    'Venus': {
        gemstone: 'Diamond / Zircon', metal: 'Silver / Platinum', rudraksha: '6 Mukhi',
        karma: 'Respect your spouse. Avoid excessive sensory indulgence.',
        donation: 'Donate white flowers or curd to a lady on Friday.',
        mantra: 'Om Dram Drim Draum Sah Shukraya Namah',
        diet: 'Consume rice, curd, and milk. Avoid sour and spicy foods.',
        abstinence: 'Avoid untidiness and coarse speech.',
        environment: 'Keep the South-East direction beautiful.',
        secrets: [
            'Keep a piece of silver or a silver coin in your wallet.',
            'Use floral perfumes or scents (ittar) daily, especially on Fridays.',
            'Feed cows with green fodder or roti on Fridays.'
        ],
        deity: 'Goddess Lakshmi',
        color: 'bg-pink-500',
        day: 'Friday',
        situational: {
            business: 'Luxury goods or arts',
            interview: 'Wear white or pink',
            marriage: 'Lakshmi Puja',
            promotion: 'Offer lotus flower',
            jobSearch: 'South-East direction',
            marriageDelay: 'Diamond offering',
            marriageStability: 'Rose quartz',
            businessGrowth: 'Sri Suktam'
        },
        why: {
            gemstone: 'Enhances artistic creativity, relationship harmony, and luxury.',
            metal: 'Silver resonates with the aesthetic and cooling nature of Venus.',
            rudraksha: '6-Mukhi represents Kartikeya; it increases sensory control and magnetism.',
            karma: 'Venus is the Partner; respecting the feminine energy stabilizes material wealth.',
            donation: 'White items on Friday refine the Shukra (Semen/Life-force) quality.',
            vault: 'Scents and silver attract the high-frequency vibration of Lakshmi.'
        }
    },
    'Saturn': {
        gemstone: 'Blue Sapphire', metal: 'Iron / Steel', rudraksha: '7 Mukhi',
        karma: 'Be regular and disciplined. Help laborers and the elderly.',
        donation: 'Donate mustard oil, black sesame, or iron items on Saturday.',
        mantra: 'Om Pram Prim Praum Sah Shanaishcharaya Namah',
        diet: 'Consume black sesame and urad dal. Avoid alcohol and tamasic food.',
        abstinence: 'Avoid laziness and lying.',
        environment: 'Keep the West direction heavy and dark.',
        secrets: [
            'Keep a piece of iron or wear an iron ring made from a horseshoe.',
            'Feed crows or black dogs with roti or biscuits daily.',
            'Pour mustard oil on the ground or at a Shani temple on Saturdays.'
        ],
        deity: 'Lord Shani / Hanuman',
        color: 'bg-blue-900',
        day: 'Saturday',
        situational: {
            business: 'Iron, oil, or machinery',
            interview: 'Wear blue or black',
            marriage: 'Shani Shanti',
            promotion: 'Offer oil to Shani',
            jobSearch: 'West direction',
            marriageDelay: 'Shani Chalisa',
            marriageStability: 'Blue sapphire',
            businessGrowth: 'Shani Yantra'
        },
        why: {
            gemstone: 'Provides disciplined focus, long-term success, and protection.',
            metal: 'Iron is heavy and grounded, matching the slow, structured energy of Shani.',
            rudraksha: '7-Mukhi represents Mahalakshmi; it brings hidden wealth found through labor.',
            karma: 'Saturn is the Judge; serving those who work hard aligns you with universal law.',
            donation: 'Oil/Sesame on Saturday absorbs the shadow (Chhaya) elements of karma.',
            vault: 'Iron and oil absorb the heavy, karmic density of Saturn.'
        }
    },
    'Rahu': {
        gemstone: 'Hessonite (Gomed)', metal: 'Silver / Lead', rudraksha: '8 Mukhi',
        karma: 'Maintain clean hygiene. Help sweepers or laborers.',
        donation: 'Donate black/grey blankets or coconut in water on Saturday.',
        mantra: 'Om Bhram Bhrim Bhraum Sah Rahave Namah',
        diet: 'Avoid tamasic foods. Consume coconut water.',
        abstinence: 'Avoid pollution and drugs.',
        environment: 'Keep the South-West direction clean.',
        secrets: [
            'Keep a square piece of silver in your pocket.',
            'Drop a coconut in flowing water on Saturdays.',
            'Keep some fennel seeds (saunf) under your pillow.'
        ],
        deity: 'Goddess Durga',
        color: 'bg-gray-600',
        day: 'Saturday',
        situational: {
            business: 'Technology or foreign trade',
            interview: 'Wear grey',
            marriage: 'Durga Saptashati',
            promotion: 'Feed fish',
            jobSearch: 'South-West direction',
            marriageDelay: 'Rahu Shanti',
            marriageStability: 'Hessonite',
            businessGrowth: 'Saraswati Puja'
        },
        why: {
            gemstone: 'Filters chaotic mental clouds and clarifies hidden ambitions.',
            metal: 'Lead acts as a dense shield against Rahu\'s erratic electromagnetic waves.',
            rudraksha: '8-Mukhi represents Ganesha; it removes obstacles caused by technical/social shocks.',
            karma: 'Rahu is the Outcast; supporting sweepers aligns your field with Rahu\'s energy.',
            vault: 'Silver and coconut ground the electrical storms of Rahu.'
        }
    },
    'Ketu': {
        gemstone: 'Cat\'s Eye (Lehsunia)', metal: 'Gold / Silver', rudraksha: '9 Mukhi',
        karma: 'Feed stray dogs. Practice detachment and meditation.',
        donation: 'Donate black and white blankets to homeless.',
        mantra: 'Om Stram Strim Straum Sah Ketave Namah',
        diet: 'Consume saffron and simple vegetarian food.',
        abstinence: 'Avoid lying and hypocrisy.',
        environment: 'Keep the North-East corner spiritual.',
        secrets: [
            'Pierce your ears or nose (or wear gold in ears).',
            'Feed a dual-colored (black and white) dog.',
            'Apply a tilak of turmeric and saffron on your forehead.'
        ],
        deity: 'Lord Ganesha',
        color: 'bg-stone-500',
        day: 'Tuesday',
        situational: {
            business: 'Spirituality or research',
            interview: 'Wear brown',
            marriage: 'Ganesha Puja',
            promotion: 'Feed dogs',
            jobSearch: 'North-East direction',
            marriageDelay: 'Ketu Shanti',
            marriageStability: 'Cat\'s Eye',
            businessGrowth: 'Ganesha Yantra'
        },
        why: {
            gemstone: 'Enhances spiritual intuition, detachment, and sudden breakthroughs.',
            metal: 'Gold-Silver dualism represents the psychic balance Ketu mediates.',
            rudraksha: '9-Mukhi represents Durga; it gives fearless focus and spiritual strength.',
            karma: 'Ketu is the Dog; feeding them aligns you with the "unconditional" luck of Ketu.',
            vault: 'Piercing and dogs stabilize the detached, fiery energy of Ketu.'
        }
    }
};

