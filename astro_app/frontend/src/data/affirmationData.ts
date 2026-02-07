
export interface Affirmation {
    id: number;
    text: string;
    category: 'Self-Love' | 'Success' | 'Health' | 'Peace' | 'Strength';
}

export const affirmations: Affirmation[] = [
    { id: 1, text: "I am worthy of love and happiness.", category: "Self-Love" },
    { id: 2, text: "I attract abundance and prosperity.", category: "Success" },
    { id: 3, text: "My body is healthy and full of energy.", category: "Health" },
    { id: 4, text: "I am at peace with my past and future.", category: "Peace" },
    { id: 5, text: "I have the strength to overcome any obstacle.", category: "Strength" },
    { id: 6, text: "I trust the timing of my life.", category: "Peace" },
    { id: 7, text: "I am confident in my abilities.", category: "Self-Love" },
    { id: 8, text: "Success flows to me naturally.", category: "Success" },
    { id: 9, text: "I radiate positivity and light.", category: "Self-Love" },
    { id: 10, text: "I am grateful for all that I have.", category: "Peace" },
    { id: 11, text: "I embrace new challenges with courage.", category: "Strength" },
    { id: 12, text: "My mind is clear and focused.", category: "Health" },
    { id: 13, text: "I deserve the best life has to offer.", category: "Self-Love" },
    { id: 14, text: "I am creating the life of my dreams.", category: "Success" },
    { id: 15, text: "I am surrounded by love and support.", category: "Self-Love" },
    { id: 16, text: "I forgive myself and others.", category: "Peace" },
    { id: 17, text: "I am resilient and strong.", category: "Strength" },
    { id: 18, text: "Every day is a fresh start.", category: "Peace" },
    { id: 19, text: "I am open to new opportunities.", category: "Success" },
    { id: 20, text: "I listen to my body with love.", category: "Health" },
    { id: 21, text: "I am a magnet for miracles.", category: "Success" },
    { id: 22, text: "My potential is limitless.", category: "Success" },
    { id: 23, text: "I choose to be happy today.", category: "Self-Love" },
    { id: 24, text: "I am safe and protected.", category: "Peace" },
    { id: 25, text: "I speak my truth with confidence.", category: "Strength" },
    { id: 26, text: "I nurture my body with healthy choices.", category: "Health" },
    { id: 27, text: "I am calm, cool, and collected.", category: "Peace" },
    { id: 28, text: "I believe in myself.", category: "Self-Love" },
    { id: 29, text: "I am attracting financial freedom.", category: "Success" },
    { id: 30, text: "I am filled with vitality.", category: "Health" }
];

export const getDailyAffirmation = (dateString: string): Affirmation => {
    // Deterministic random based on date string
    let hash = 0;
    for (let i = 0; i < dateString.length; i++) {
        hash = dateString.charCodeAt(i) + ((hash << 5) - hash);
    }
    const idx = Math.abs(hash) % affirmations.length;
    return affirmations[idx];
};
