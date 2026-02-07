
export interface TarotCard {
    id: number;
    name: string;
    image: string; // URL or local path
    keywords: string[];
    meaning_upright: string;
    meaning_reversed: string;
    element: 'Fire' | 'Water' | 'Air' | 'Earth' | 'Spirit';
}

export const majorArcana: TarotCard[] = [
    {
        id: 0,
        name: "The Fool",
        image: "https://upload.wikimedia.org/wikipedia/en/9/90/RWS_Tarot_00_Fool.jpg",
        keywords: ["Beginnings", "Innocence", "Spontaneity", "Free Spirit"],
        meaning_upright: "A new journey lies ahead. Embrace the unknown with an open heart. Trust in the universe and take that leap of faith.",
        meaning_reversed: "Recklessness or naivety may be guiding you. Look before you leap.",
        element: "Air"
    },
    {
        id: 1,
        name: "The Magician",
        image: "https://upload.wikimedia.org/wikipedia/en/d/de/RWS_Tarot_01_Magician.jpg",
        keywords: ["Manifestation", "Resourcefulness", "Power", "Inspired Action"],
        meaning_upright: "You have all the tools you need to succeed. Align your will with the divine to manifest your desires.",
        meaning_reversed: "Manipulation or untapped potential. Are you using your power wisely?",
        element: "Air"
    },
    {
        id: 2,
        name: "The High Priestess",
        image: "https://upload.wikimedia.org/wikipedia/en/8/88/RWS_Tarot_02_High_Priestess.jpg",
        keywords: ["Intuition", "Sacred Knowledge", "Divine Feminine", "Subconscious"],
        meaning_upright: "Trust your intuition. The answers you seek are within you. Connect with your inner voice.",
        meaning_reversed: "Secrets, disconnected from intuition, withdrawal and silence.",
        element: "Water"
    },
    {
        id: 3,
        name: "The Empress",
        image: "https://upload.wikimedia.org/wikipedia/en/d/d2/RWS_Tarot_03_Empress.jpg",
        keywords: ["Femininity", "Beauty", "Nature", "Nurturing", "Abundance"],
        meaning_upright: "Creativity and abundance are flowing to you. Connect with nature and nurture your ideas.",
        meaning_reversed: "Creative block, dependence on others.",
        element: "Earth"
    },
    {
        id: 4,
        name: "The Emperor",
        image: "https://upload.wikimedia.org/wikipedia/en/c/c3/RWS_Tarot_04_Emperor.jpg",
        keywords: ["Authority", "Structure", "Control", "Fatherhood"],
        meaning_upright: "Structure and discipline will bring success. Take charge of your life with logic and reason.",
        meaning_reversed: "Domination, excessive control, lack of discipline.",
        element: "Fire"
    },
    {
        id: 5,
        name: "The Hierophant",
        image: "https://upload.wikimedia.org/wikipedia/en/8/8d/RWS_Tarot_05_Hierophant.jpg",
        keywords: ["Spiritual Wisdom", "Religious Beliefs", "Conformity", "Tradition"],
        meaning_upright: "Follow tradition and established beliefs. Seek guidance from a mentor or spiritual teacher.",
        meaning_reversed: "Personal beliefs, freedom, challenging the status quo.",
        element: "Earth"
    },
    {
        id: 6,
        name: "The Lovers",
        image: "https://upload.wikimedia.org/wikipedia/en/d/db/RWS_Tarot_06_Lovers.jpg",
        keywords: ["Love", "Harmony", "Relationships", "Values Alignment", "Choices"],
        meaning_upright: "Harmony in relationships. Make choices that align with your true values.",
        meaning_reversed: "Disharmony, imbalance, misalignment of values.",
        element: "Air"
    },
    {
        id: 7,
        name: "The Chariot",
        image: "https://upload.wikimedia.org/wikipedia/en/9/9b/RWS_Tarot_07_Chariot.jpg",
        keywords: ["Control", "Willpower", "Success", "Action", "Determination"],
        meaning_upright: "Victory comes through willpower and determination. Stay focused and overcome obstacles.",
        meaning_reversed: "Lack of control, lack of direction, aggression.",
        element: "Water"
    },
    {
        id: 8,
        name: "Strength",
        image: "https://upload.wikimedia.org/wikipedia/en/f/f5/RWS_Tarot_08_Strength.jpg",
        keywords: ["Strength", "Courage", "Persuasion", "Influence", "Compassion"],
        meaning_upright: "Inner strength and compassion will overcome any challenge. Tame your inner beasts with love.",
        meaning_reversed: "Self-doubt, weakness, insecurity.",
        element: "Fire"
    },
    {
        id: 9,
        name: "The Hermit",
        image: "https://upload.wikimedia.org/wikipedia/en/4/4d/RWS_Tarot_09_Hermit.jpg",
        keywords: ["Soul Searching", "Introspection", "Being Alone", "Inner Guidance"],
        meaning_upright: "Take time for solitude and introspection. The light of wisdom is found within.",
        meaning_reversed: "Isolation, loneliness, withdrawal.",
        element: "Earth"
    },
    {
        id: 10,
        name: "Wheel of Fortune",
        image: "https://upload.wikimedia.org/wikipedia/en/3/3c/RWS_Tarot_10_Wheel_of_Fortune.jpg",
        keywords: ["Good Luck", "Karma", "Life Cycles", "Destiny", "A Turning Point"],
        meaning_upright: "The wheel is turning in your favor. Embrace change and the cycles of life.",
        meaning_reversed: "Bad luck, resistance to change, breaking cycles.",
        element: "Fire"
    },
    {
        id: 11,
        name: "Justice",
        image: "https://upload.wikimedia.org/wikipedia/en/e/e0/RWS_Tarot_11_Justice.jpg",
        keywords: ["Justice", "Fairness", "Truth", "Cause and Effect", "Law"],
        meaning_upright: "Truth and fairness will prevail. Be accountable for your actions.",
        meaning_reversed: "Unfairness, lack of accountability, dishonesty.",
        element: "Air"
    },
    {
        id: 12,
        name: "The Hanged Man",
        image: "https://upload.wikimedia.org/wikipedia/en/2/2b/RWS_Tarot_12_Hanged_Man.jpg",
        keywords: ["Pause", "Surrender", "Letting Go", "New Perspective"],
        meaning_upright: "Pause and look at things from a different perspective. Surrender to the process.",
        meaning_reversed: "Delays, resistance, stalling.",
        element: "Water"
    },
    {
        id: 13,
        name: "Death",
        image: "https://upload.wikimedia.org/wikipedia/en/d/d7/RWS_Tarot_13_Death.jpg",
        keywords: ["Endings", "Change", "Transformation", "Transition"],
        meaning_upright: "A major phase is ending to make way for the new. Embrace transformation.",
        meaning_reversed: "Resistance to change, personal transformation, inner purging.",
        element: "Water"
    },
    {
        id: 14,
        name: "Temperance",
        image: "https://upload.wikimedia.org/wikipedia/en/f/f8/RWS_Tarot_14_Temperance.jpg",
        keywords: ["Balance", "Moderation", "Patience", "Purpose"],
        meaning_upright: "Find balance and moderation in all things. Patience will bring peace.",
        meaning_reversed: "Imbalance, excess, lack of long-term vision.",
        element: "Fire"
    },
    {
        id: 15,
        name: "The Devil",
        image: "https://upload.wikimedia.org/wikipedia/en/5/55/RWS_Tarot_15_Devil.jpg",
        keywords: ["Shadow Self", "Attachment", "Addiction", "Restriction", "Sexuality"],
        meaning_upright: "Confront your shadow self. Break free from attachments that bind you.",
        meaning_reversed: "Releasing limiting beliefs, exploring dark thoughts, detachment.",
        element: "Earth"
    },
    {
        id: 16,
        name: "The Tower",
        image: "https://upload.wikimedia.org/wikipedia/en/5/53/RWS_Tarot_16_Tower.jpg",
        keywords: ["Sudden Change", "Upheaval", "Chaos", "Revelation", "Awakening"],
        meaning_upright: "Sudden change allows for rebuilding on a stronger foundation. Let the old structures fall.",
        meaning_reversed: "Personal transformation, fear of change, averting disaster.",
        element: "Fire"
    },
    {
        id: 17,
        name: "The Star",
        image: "https://upload.wikimedia.org/wikipedia/en/d/db/RWS_Tarot_17_Star.jpg",
        keywords: ["Hope", "Faith", "Purpose", "Renewal", "Spirituality"],
        meaning_upright: "Hope and healing are here. Trust that the universe is guiding you.",
        meaning_reversed: "Lack of faith, despair, self-trust, disconnection.",
        element: "Air"
    },
    {
        id: 18,
        name: "The Moon",
        image: "https://upload.wikimedia.org/wikipedia/en/7/7f/RWS_Tarot_18_Moon.jpg",
        keywords: ["Illusion", "Fear", "Anxiety", "Subconscious", "Intuition"],
        meaning_upright: "Things may not be what they seem. Trust your intuition to guide you through the darkness.",
        meaning_reversed: "Release of fear, repressed emotion, inner confusion.",
        element: "Water"
    },
    {
        id: 19,
        name: "The Sun",
        image: "https://upload.wikimedia.org/wikipedia/en/1/17/RWS_Tarot_19_Sun.jpg",
        keywords: ["Positivity", "Fun", "Warmth", "Success", "Vitality"],
        meaning_upright: "Joy and success are yours. Let your light shine brightly.",
        meaning_reversed: "Inner child, feeling down, overly optimistic.",
        element: "Fire"
    },
    {
        id: 20,
        name: "Judgement",
        image: "https://upload.wikimedia.org/wikipedia/en/d/dd/RWS_Tarot_20_Judgement.jpg",
        keywords: ["Judgement", "Rebirth", "Inner Calling", "Absolution"],
        meaning_upright: "A time of reckoning and rebirth. Heed your higher calling.",
        meaning_reversed: "Self-doubt, inner critic, ignoring the call.",
        element: "Fire"
    },
    {
        id: 21,
        name: "The World",
        image: "https://upload.wikimedia.org/wikipedia/en/f/ff/RWS_Tarot_21_World.jpg",
        keywords: ["Completion", "Integration", "Accomplishment", "Travel"],
        meaning_upright: "A cycle is complete. Celebrate your achievements and prepare for a new beginning.",
        meaning_reversed: "Seeking closure, short-cuts, delays.",
        element: "Earth"
    }
];

export const getRandomCard = (): TarotCard => {
    // Simple random for MVP. In production, seed with date to keep "Card of the Day" consistent per user/day.
    const idx = Math.floor(Math.random() * majorArcana.length);
    return majorArcana[idx];
};

export const getDailyCard = (dateString: string): TarotCard => {
    // Deterministic random based on date string
    let hash = 0;
    for (let i = 0; i < dateString.length; i++) {
        hash = dateString.charCodeAt(i) + ((hash << 5) - hash);
    }
    const idx = Math.abs(hash) % majorArcana.length;
    return majorArcana[idx];
};
