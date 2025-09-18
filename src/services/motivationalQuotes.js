// Motivational Quotes Service
// src/services/motivationalQuotes.js

export const MOOD_QUOTES = {
  happy: [
    "Don't give up on your dreams - you're closer than you think! 🌟",
    "Keep pushing forward! Every step brings you closer to success! 🚀",
    "Your positive energy is unstoppable! Chase those dreams! ✨",
    "Believe in yourself - you have everything it takes to succeed! 💪",
    "Don't let anyone dim your light! Keep shining bright! �",
    "Great things happen to those who don't give up! Keep going! �",
    "Your dreams are valid and achievable! Never stop believing! 💫",
    "Success is just around the corner - don't give up now! 🏆"
  ],
  sad: [
    "Don't give up on your dreams, even when it feels impossible 💙",
    "Every setback is a setup for a comeback! Keep fighting! 💪",
    "The darkest nights produce the brightest stars! Don't give up! ⭐",
    "Your dreams are worth fighting for, even on tough days 🌈",
    "Don't let today's sadness steal tomorrow's dreams! 🌅",
    "Champions are made in moments like these - don't give up! �",
    "Your breakthrough is on the other side of this breakdown �",
    "Tough times don't last, but tough dreamers do! Keep going! �"
  ],
  stressed: [
    "Don't give up! Every challenge is making you stronger! 💪",
    "Pressure makes diamonds - you're becoming something precious! 💎",
    "Don't quit when the miracle is just around the corner! 🌟",
    "Your dreams are bigger than your current stress! Don't give up! 🎯",
    "Every master was once a disaster - keep pushing through! �",
    "Don't let temporary stress kill your permanent dreams! ✨",
    "You've overcome 100% of your bad days so far! Don't give up! �",
    "The struggle you're in today is developing the strength for tomorrow! 💫"
  ],
  relaxed: [
    "Perfect time to visualize your dreams coming true! Don't give up! 🎯",
    "Use this calm energy to plan your next big move! Keep dreaming! 🧠",
    "Don't give up on your goals - peaceful minds achieve great things! ✨",
    "Your dreams deserve this focused, calm energy! Keep going! 🌊",
    "Clear minds create clear paths to success! Don't give up! 🛤️",
    "This peaceful moment is preparing you for greatness! Stay focused! 🧘",
    "Don't let comfort make you forget your dreams! Keep pushing! 🎨",
    "Great achievements come from calm determination! Never give up! �️"
  ]
};

export const DREAM_FOCUSED_QUOTES = [
  "Don't give up on your dreams - they're waiting for you! 🌟",
  "Every expert was once a beginner. Every pro was once an amateur! 💪",
  "Your only limit is your mind. Don't give up! 🧠✨",
  "Dreams don't have expiration dates. It's never too late! ⏰💫",
  "The difference between ordinary and extraordinary is that little 'extra'! 🚀",
  "Don't watch life from the sidelines. Chase your dreams! 🏃‍♀️💨",
  "Your dreams are valid, no matter where you come from! 🌍💝",
  "Doubt kills more dreams than failure ever will. Keep believing! 💭⚡",
  "Don't give up! Great things take time. 🌰🌳",
  "You are never too old to set another goal or dream a new dream! 🎯✨",
  "The future belongs to those who believe in their dreams! 🔮💫",
  "Don't let yesterday's failures ruin today's dreams! 📅🌟",
  "Champions never give up, and those who give up never win! 🏆💪",
  "Your comeback story starts with 'I never gave up'! 📖✨",
  "Impossible is just an opinion. Prove them wrong! 💥🚀"
];

export const STUDY_MOTIVATION = {
  happy: [
    "Don't give up on learning - education is the key to your dreams! 📚✨",
    "Every lesson learned is a step closer to your goals! Keep studying! 🚀",
    "Your future self will thank you for not giving up on learning today! 🎓"
  ],
  sad: [
    "Don't let sadness stop your education - learning can lift your spirits! 📖💙",
    "Every page you read is proof you haven't given up on yourself! 🌱",
    "Study through the storm - your dreams are worth the effort! ⛈️�"
  ],
  stressed: [
    "Don't give up on studying! Small progress is still progress! �✨",
    "One chapter at a time - you don't have to learn everything today! 🐌📚",
    "Stressed but blessed - your education journey is shaping your future! 🧘‍♀️🎯"
  ],
  relaxed: [
    "Perfect mindset for deep learning - don't waste this peaceful energy! 🧘📚",
    "Calm minds absorb knowledge like sponges - keep learning! 🧠✨",
    "Use this tranquility to study something that excites your soul! 🏊‍♀️💫"
  ]
};

export class MotivationalQuotesService {
  
  // Get a random quote based on mood
  static getQuoteByMood(mood) {
    const quotes = MOOD_QUOTES[mood];
    if (!quotes || quotes.length === 0) return null;
    
    const randomIndex = Math.floor(Math.random() * quotes.length);
    return quotes[randomIndex];
  }
  
  // Get a study-specific motivational quote based on mood
  static getStudyQuoteByMood(mood) {
    const quotes = STUDY_MOTIVATION[mood];
    if (!quotes || quotes.length === 0) {
      // Fallback to general mood quotes
      return this.getQuoteByMood(mood);
    }
    
    const randomIndex = Math.floor(Math.random() * quotes.length);
    return quotes[randomIndex];
  }
  
  // Get multiple quotes for variety
  static getMultipleQuotes(mood, count = 3) {
    const quotes = MOOD_QUOTES[mood];
    if (!quotes || quotes.length === 0) return [];
    
    // Shuffle quotes and return requested count
    const shuffled = [...quotes].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, quotes.length));
  }
  
  // Get quote with metadata
  static getQuoteWithMetadata(mood) {
    const quote = this.getQuoteByMood(mood);
    if (!quote) return null;
    
    return {
      quote,
      mood,
      timestamp: new Date(),
      category: 'general'
    };
  }
  
  // Get study quote with metadata
  static getStudyQuoteWithMetadata(mood) {
    const quote = this.getStudyQuoteByMood(mood);
    if (!quote) return null;
    
    return {
      quote,
      mood,
      timestamp: new Date(),
      category: 'study'
    };
  }
  
  // Check if mood has quotes available
  static hasMoodQuotes(mood) {
    return MOOD_QUOTES.hasOwnProperty(mood) && MOOD_QUOTES[mood].length > 0;
  }
  
  // Get all available moods
  static getAvailableMoods() {
    return Object.keys(MOOD_QUOTES);
  }

  // Get a random dream-focused quote
  static getRandomDreamQuote() {
    const quote = DREAM_FOCUSED_QUOTES[Math.floor(Math.random() * DREAM_FOCUSED_QUOTES.length)];
    return {
      quote,
      mood: 'dream-focused',
      timestamp: new Date(),
      category: 'dream'
    };
  }

  // Get dream-focused quote for specific context
  static getDreamQuoteForContext(context = 'general') {
    let filteredQuotes = DREAM_FOCUSED_QUOTES;
    
    // Filter quotes based on context if needed
    if (context === 'persistence') {
      filteredQuotes = DREAM_FOCUSED_QUOTES.filter(quote => 
        quote.toLowerCase().includes('give up') || 
        quote.toLowerCase().includes('persist') ||
        quote.toLowerCase().includes('keep')
      );
    }
    
    const quote = filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];
    return {
      quote,
      mood: 'dream-focused',
      timestamp: new Date(),
      category: `dream-${context}`
    };
  }

  // Mix mood-based quote with dream quote
  static getMixedMotivationalQuote(mood = 'happy') {
    const useDreamQuote = Math.random() > 0.5; // 50% chance for dream quote
    
    if (useDreamQuote) {
      return this.getRandomDreamQuote();
    } else {
      return this.getQuoteWithMetadata(mood);
    }
  }

  // Get multiple quotes for notification variety
  static getMultipleQuotes(count = 3, mood = 'happy', includeDreamQuotes = true) {
    const quotes = [];
    
    for (let i = 0; i < count; i++) {
      if (includeDreamQuotes && Math.random() > 0.6) {
        quotes.push(this.getRandomDreamQuote());
      } else {
        quotes.push(this.getQuoteWithMetadata(mood));
      }
    }
    
    return quotes;
  }
}

export default MotivationalQuotesService;
