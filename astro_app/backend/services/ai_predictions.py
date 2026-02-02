"""
AI Prediction Service
Generates natural language predictions using AI
This is the ONLY module that uses AI in the entire system

Supports:
- Replit AI Integrations for Gemini (primary - no API key needed)
- Google Gemini AI (fallback)
- OpenAI GPT-4 (fallback)
"""
from typing import Dict, List, Any, Optional
import os
import logging
import time
import random
from datetime import datetime

logger = logging.getLogger(__name__)

class AIPredictionService:
    """
    Generate astrological predictions using AI
    Supports Replit AI Integrations, Google Gemini, and OpenAI GPT-4
    
    Environment Variables (checked in order):
        AI_INTEGRATIONS_GEMINI_API_KEY: Replit AI Integration (preferred)
        AI_INTEGRATIONS_GEMINI_BASE_URL: Replit AI Integration base URL
        GEMINI_API_KEY: Google Gemini API key (fallback)
        OPENAI_API_KEY: OpenAI API key (fallback)
    """
    
    def __init__(self):
        """Initialize AI service with automatic provider selection"""
        self.provider = None
        self.client = None
        self.enabled = False
        
        # Try Replit AI Integrations first (recommended - no API key needed)
        replit_gemini_key = os.getenv('AI_INTEGRATIONS_GEMINI_API_KEY')
        replit_gemini_base = os.getenv('AI_INTEGRATIONS_GEMINI_BASE_URL')
        gemini_key = os.getenv('GEMINI_API_KEY')
        openai_key = os.getenv('OPENAI_API_KEY')
        
        if replit_gemini_key and replit_gemini_base:
            self._init_replit_gemini(replit_gemini_key, replit_gemini_base)
        elif gemini_key:
            self._init_gemini(gemini_key)
        elif openai_key:
            self._init_openai(openai_key)
        
        if not self.enabled:
            logger.info("AI Prediction Service disabled (no API key found)")
    
    def _init_replit_gemini(self, api_key: str, base_url: str):
        """Initialize Replit AI Integrations for Gemini"""
        try:
            from google import genai
            client = genai.Client(
                api_key=api_key,
                http_options={'base_url': base_url}
            )
            self.client = client
            self.model_name = 'gemini-2.5-flash'
            self.provider = 'replit-gemini'
            self.enabled = True
            logger.info("✅ AI Service initialized with Replit AI Integrations (Gemini 2.5 Flash)")
        except ImportError:
            logger.warning("google-genai package not installed")
        except Exception as e:
            logger.error(f"Failed to initialize Replit Gemini: {e}")
    
    def _init_gemini(self, api_key: Optional[str]):
        """Initialize Google Gemini"""
        if not api_key:
            logger.warning("GEMINI_API_KEY not found")
            return
        
        try:
            from google import genai
            client = genai.Client(api_key=api_key)
            self.client = client
            self.model_name = 'gemini-2.5-flash'
            self.provider = 'gemini'
            self.enabled = True
            logger.info("✅ AI Service initialized with Google Gemini (google-genai)")
        except ImportError:
            logger.warning("google-genai package not installed. Install with: pip install google-genai")
        except Exception as e:
            logger.error(f"Failed to initialize Gemini: {e}")
    
    def _init_openai(self, api_key: Optional[str]):
        """Initialize OpenAI"""
        if not api_key:
            logger.warning("OPENAI_API_KEY not found")
            return
        
        try:
            from openai import OpenAI
            self.client = OpenAI(api_key=api_key, timeout=20.0)
            self.provider = 'openai'
            self.enabled = True
            logger.info("✅ AI Service initialized with OpenAI GPT-4")
        except ImportError:
            logger.warning("openai package not installed. Install with: pip install openai")
        except Exception as e:
            logger.error(f"Failed to initialize OpenAI: {e}")
    
    def generate_period_predictions(
        self,
        context: Dict[str, Any],
        birth_details: Dict[str, Any],
        events: List[Dict[str, Any]],
        daily_results: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """
        Generate comprehensive predictions for the period
        
        Args:
            context: Summary statistics (average score, trends, etc.)
            birth_details: User's birth information
            events: All detected astrological events
            daily_results: Daily analysis results
        
        Returns:
            Dict with predictions for different life areas
        """
        if not self.enabled:
            return self._generate_rule_based_predictions(context, events)
        
        try:
            # Build prompt
            prompt = self._build_prompt(context, birth_details, events, daily_results)
            
            # Call appropriate AI provider
            if self.provider == 'gemini':
                response_text = self._call_gemini(prompt)
                model_name = getattr(self, 'model_name', 'gemini-1.5-flash')
            else:  # openai
                response_text = self._call_openai(prompt)
                model_name = 'gpt-4'
            
            # Parse response
            predictions = self._parse_ai_response(response_text)
            predictions['generated_by'] = 'ai'
            predictions['provider'] = self.provider
            predictions['model'] = model_name
            predictions['confidence'] = 0.85
            
            return predictions
            
        except Exception as e:
            logger.error(f"AI prediction failed: {e}")
            # Fallback to rule-based
            return self._generate_rule_based_predictions(context, events)
    
    def _call_gemini(self, prompt: str) -> str:
        """Call Google Gemini API (works with both Replit integration and direct API)"""
        full_prompt = f"{self._get_system_prompt()}\n\n{prompt}"
        
        def call_api():
            if hasattr(self.client, 'models') and hasattr(self.client.models, 'generate_content'):
                return self.client.models.generate_content(
                    model=self.model_name,
                    contents=full_prompt
                )
            else:
                raise RuntimeError(f"Gemini client does not support generate_content. Client type: {type(self.client)}")
        
        try:
            response = self._execute_with_retry(call_api)
            if response and hasattr(response, 'text'):
                return response.text
            else:
                logger.error(f"Gemini response has no text attribute. Response: {response}")
                return ""
        except Exception as e:
            logger.error(f"Gemini API call failed: {e}")
            raise
            
    def _execute_with_retry(self, func, max_retries=3, initial_delay=2.0):
        """
        Execute a function with exponential backoff retry logic
        Handles 429 Resource Exhausted errors
        """
        delay = initial_delay
        
        for attempt in range(max_retries + 1):
            try:
                return func()
            except Exception as e:
                error_str = str(e).lower()
                is_rate_limit = '429' in error_str or 'resource exhausted' in error_str or 'quota' in error_str
                
                if is_rate_limit and attempt < max_retries:
                    # Add jitter
                    sleep_time = delay * (1 + random.random() * 0.1)
                    logger.warning(f"⚠️ Rate limit hit. Retrying in {sleep_time:.2f}s... (Attempt {attempt+1}/{max_retries})")
                    time.sleep(sleep_time)
                    delay *= 2  # Exponential backoff
                else:
                    # If not rate limit or max retries reached, re-raise
                    if is_rate_limit:
                        logger.error(f"❌ Max retries ({max_retries}) reached for rate limit.")
                    raise e
    
    def _call_openai(self, prompt: str) -> str:
        """Call OpenAI API"""
        response = self.client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": self._get_system_prompt()},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=1200
        )
        return response.choices[0].message.content
    
    def _get_system_prompt(self) -> str:
        """System prompt for AI"""
        return """You are an expert Vedic astrologer with deep knowledge of classical texts.

Your role:
- Provide personalized astrological predictions based on the data provided
- Be specific and actionable in your advice
- Balance optimism with realism
- Reference specific astrological factors when relevant
- Suggest practical remedies based on Vedic tradition

Guidelines:
- Base predictions ONLY on the astrological data provided
- Don't make up planetary positions or events
- Be concise but comprehensive
- Use professional, respectful tone
- Avoid overly negative or alarming language
- Focus on empowerment and guidance

Structure your response with clear sections for:
1. Overall Period Assessment
2. Career & Professional Life
3. Health & Wellness
4. Relationships & Social Life
5. Financial Matters
6. Remedies & Recommendations"""
    
    def _build_prompt(
        self,
        context: Dict,
        birth_details: Dict,
        events: List[Dict],
        daily_results: List[Dict]
    ) -> str:
        """Build detailed prompt for AI"""
        
        # Format events
        occurring_events = [e for e in events if e.get('occurring', False)]
        auspicious_events = [e for e in occurring_events if e.get('category') == 'auspicious']
        inauspicious_events = [e for e in occurring_events if e.get('category') == 'inauspicious']
        
        # Find best and worst days
        sorted_days = sorted(daily_results, key=lambda x: x.get('score', 50), reverse=True)
        best_days = sorted_days[:3]
        worst_days = sorted_days[-3:]
        
        prompt = f"""Generate astrological predictions for this period:

PERIOD OVERVIEW:
- Average Score: {context.get('average_score', 50):.1f}/100
- Overall Trend: {context.get('trend', 'stable')}
- Total Days Analyzed: {len(daily_results)}

SCORE DISTRIBUTION:
- Excellent Days (80-100): {context.get('excellent_days', 0)} days
- Good Days (65-79): {context.get('good_days', 0)} days
- Average Days (50-64): {context.get('average_days', 0)} days
- Below Average (35-49): {context.get('below_average_days', 0)} days
- Challenging Days (0-34): {context.get('poor_days', 0)} days

ASTROLOGICAL EVENTS:
Favorable Events ({len(auspicious_events)}):
{self._format_events(auspicious_events[:5])}

Challenging Events ({len(inauspicious_events)}):
{self._format_events(inauspicious_events[:5])}

BEST DAYS:
{self._format_days(best_days)}

CHALLENGING DAYS:
{self._format_days(worst_days)}

Based on this astrological analysis, provide:
1. Overall assessment of the period
2. Career and professional guidance
3. Health and wellness advice
4. Relationship insights
5. Financial outlook
6. Three specific Vedic remedies

Be specific, actionable, and reference the astrological factors."""
        
        return prompt
    
    def _format_events(self, events: List[Dict]) -> str:
        """Format events for prompt"""
        if not events:
            return "- None significant"
        
        formatted = []
        for event in events:
            name = event.get('name', 'Unknown')
            desc = event.get('description', '')
            strength = event.get('strength', 0)
            formatted.append(f"- {name} (Strength: {strength}/100): {desc}")
        
        return "\n".join(formatted)
    
    def _format_days(self, days: List[Dict]) -> str:
        """Format days for prompt"""
        formatted = []
        for day in days:
            date = day.get('date', '')
            score = day.get('score', 0)
            quality = day.get('quality', '')
            formatted.append(f"- {date}: {score:.1f}/100 ({quality})")
        
        return "\n".join(formatted)
    
    def _parse_ai_response(self, response: str) -> Dict[str, str]:
        """Parse AI response into structured format"""
        # Simple parsing - split by sections
        sections = {
            'overall': '',
            'career': '',
            'health': '',
            'relationships': '',
            'finances': '',
            'remedies': []
        }
        
        # Try to extract sections (basic implementation)
        # In production, use more sophisticated parsing
        lines = response.split('\n')
        current_section = 'overall'
        
        for line in lines:
            line_lower = line.lower()
            if 'career' in line_lower or 'professional' in line_lower:
                current_section = 'career'
            elif 'health' in line_lower or 'wellness' in line_lower:
                current_section = 'health'
            elif 'relationship' in line_lower or 'social' in line_lower:
                current_section = 'relationships'
            elif 'financ' in line_lower or 'money' in line_lower:
                current_section = 'finances'
            elif 'remed' in line_lower:
                current_section = 'remedies'
            else:
                if current_section == 'remedies':
                    if line.strip() and (line.strip().startswith('-') or line.strip().startswith('•')):
                        sections['remedies'].append(line.strip().lstrip('-•').strip())
                else:
                    sections[current_section] += line + ' '
        
        # Clean up
        for key in ['overall', 'career', 'health', 'relationships', 'finances']:
            sections[key] = sections[key].strip()
        
        # Ensure we have at least 3 remedies
        if len(sections['remedies']) < 3:
            sections['remedies'].extend([
                "Perform daily meditation for mental clarity",
                "Donate to charitable causes on auspicious days",
                "Chant mantras appropriate to your birth chart"
            ])
        sections['remedies'] = sections['remedies'][:3]
        
        return sections
    
    def _generate_rule_based_predictions(
        self,
        context: Dict,
        events: List[Dict]
    ) -> Dict[str, Any]:
        """
        Fallback rule-based predictions when AI is not available
        """
        avg_score = context.get('average_score', 50)
        
        # Overall assessment
        if avg_score >= 75:
            overall = "This is an excellent period with strong planetary support. The cosmic energies are aligned favorably for progress and achievement."
            career = "Outstanding time for career advancement, new initiatives, and professional recognition. Take bold steps forward."
            health = "Health prospects are very favorable. This is an ideal time to start new health routines or treatments."
            relationships = "Harmonious period for all relationships. Good time for important commitments and social activities."
            finances = "Financial prospects are bright. Favorable for investments and financial planning."
        elif avg_score >= 60:
            overall = "A moderately favorable period with mixed planetary influences. Progress is possible with effort and planning."
            career = "Steady progress in career is indicated. Focus on consolidation rather than major changes."
            health = "Health is generally stable. Maintain current wellness routines and avoid stress."
            relationships = "Relationships require patience and understanding. Communication is key."
            finances = "Financial situation is stable. Good time for conservative financial decisions."
        else:
            overall = "A challenging period requiring caution and patience. Focus on maintaining stability rather than expansion."
            career = "Not ideal for major career moves. Focus on completing existing projects and building skills."
            health = "Take extra care of health. Avoid stress and maintain healthy lifestyle."
            relationships = "Be diplomatic in relationships. Avoid conflicts and misunderstandings."
            finances = "Exercise financial caution. Avoid major investments or expenditures."
        
        return {
            'overall': overall,
            'career': career,
            'health': health,
            'relationships': relationships,
            'finances': finances,
            'remedies': [
                "Perform daily meditation or prayer for mental clarity and spiritual strength",
                "Donate to charitable causes, especially on auspicious days indicated in the calendar",
                "Wear gemstones or perform rituals as recommended by a qualified astrologer based on your birth chart"
            ],
            'generated_by': 'rule_based',
            'confidence': 0.7
        }
    
    def generate_nadi_insight(
        self,
        dasha_hierarchy: Dict[str, Any],
        event_name: Optional[str] = None,
        significators: Optional[Dict] = None
    ) -> str:
        """
        Generate KP/Nadi specific insights
        """
        if not self.enabled:
            return "AI service is not available. Please check API key configuration."

        try:
            # Build prompt
            prompt = self._build_nadi_prompt(dasha_hierarchy, event_name, significators)
            
            # Call AI
            if self.provider == 'gemini':
                response = self._call_gemini(prompt)
            else:
                response = self._call_openai(prompt)
                
            return response
            
        except Exception as e:
            logger.error(f"AI Nadi insight failed: {e}")
            return "Unable to generate insight at this time."

    def _build_nadi_prompt(
        self,
        dasha: Dict,
        event_name: Optional[str],
        significators: Optional[Dict]
    ) -> str:
        md = dasha.get('mahadasha', {})
        ad = dasha.get('antardasha', {})
        pd = dasha.get('antara', {})
        
        md_lord = md.get('lord', 'Unknown')
        ad_lord = ad.get('lord', 'Unknown')
        pd_lord = pd.get('lord', 'Unknown')
        
        base_prompt = f"""As an expert KP Astrologer using Nakshatra Nadi techniques, analyze this period:
        
CURRENT DASHA PERIOD:
- Mahadasha (MD): {md_lord} (Ends: {md.get('end_date','').split(' ')[0]})
- Antardasha (AD): {ad_lord} (Ends: {ad.get('end_date','').split(' ')[0]})
- Pratyantar (PD): {pd_lord} (Ends: {pd.get('end_date','').split(' ')[0]})
"""

        if event_name:
            prompt = f"{base_prompt}\n\nUSER QUESTION: Analyze the potential for '{event_name.upper()}' during this specific period.\n"
            prompt += f"Explain how {md_lord} (MD), {ad_lord} (AD), and {pd_lord} (PD) will likely influence {event_name}.\n"
            prompt += "Is this a good time for this event? What are the blockages? Provide a short, direct answer with one specific remedy."
        else:
            prompt = f"{base_prompt}\n\nAnalyze the current time period general influence.\n"
            prompt += "Focus on the interplay between the Dasha, Bhukti and Antara lords.\n"
            prompt += "Provide a 3-sentence summary of what the user can expect right now in terms of general opportunities and mindset."
            
        return prompt
    
    def generate_comprehensive_chart_reading(
        self,
        chart_data: Dict[str, Any],
        dasha_data: Optional[Dict] = None
    ) -> Dict[str, Any]:
        """
        Generate a comprehensive birth chart reading like a professional astrologer
        explaining to a client in person.
        
        This is the MAIN method for explaining birth charts comprehensively.
        """
        if not self.enabled:
            return self._generate_fallback_chart_reading(chart_data, dasha_data)
        
        try:
            prompt = self._build_comprehensive_chart_prompt(chart_data, dasha_data)
            
            if self.provider in ['gemini', 'replit-gemini']:
                response = self._call_gemini(prompt)
            else:
                response = self._call_openai(prompt)
            
            return self._parse_comprehensive_reading(response, chart_data)
            
        except Exception as e:
            logger.error(f"Comprehensive chart reading failed: {e}")
            return self._generate_fallback_chart_reading(chart_data, dasha_data)
    
    def _get_comprehensive_system_prompt(self) -> str:
        """System prompt for comprehensive chart readings - like a professional astrologer"""
        return """You are a renowned Vedic astrologer with 40+ years of experience, explaining a birth chart to a client sitting in front of you.

YOUR PERSONALITY:
- Warm, wise, and deeply knowledgeable
- You speak like you're having a personal consultation
- Use "you" and "your" to address the client directly
- Be encouraging but honest about challenges
- Share insights as if revealing cosmic secrets

YOUR EXPERTISE:
- Deep knowledge of Parashari, Jaimini, and Nadi systems
- Expert in Vimshottari Dasha, Yogas, and planetary dignities
- Understanding of psychological astrology alongside traditional

COMMUNICATION STYLE:
- Start each section with an engaging insight
- Use metaphors and analogies to explain complex concepts
- Connect planetary positions to real-life manifestations
- Avoid technical jargon unless you explain it
- Make the client feel understood and guided

STRUCTURE YOUR READING AS:
1. COSMIC IDENTITY: Who you are at the soul level (Ascendant, Sun, Moon)
2. LIFE MISSION: Your dharma and purpose (10th house, Atmakaraka)
3. WEALTH & PROSPERITY: Financial patterns (2nd, 11th houses, dhana yogas)
4. RELATIONSHIPS: Love and partnership patterns (7th house, Venus)
5. CAREER PATH: Professional inclinations and timing
6. HEALTH PATTERNS: Physical constitution and areas to watch
7. CURRENT COSMIC WEATHER: What's happening now (current dasha)
8. SACRED GUIDANCE: Remedies and recommendations

Remember: You're not just reading a chart - you're helping someone understand their cosmic blueprint."""

    def _build_comprehensive_chart_prompt(self, chart: Dict, dasha: Optional[Dict]) -> str:
        """Build prompt for comprehensive chart reading"""
        planets = chart.get('planets', [])
        ascendant = chart.get('ascendant', {})
        houses = chart.get('houses', [])
        
        # Extract key positions
        asc_sign = ascendant.get('zodiac_sign', ascendant.get('sign', 'Unknown'))
        asc_nak = ascendant.get('nakshatra', 'Unknown')
        if isinstance(asc_nak, dict):
            asc_nak = asc_nak.get('name', 'Unknown')
        
        # Format planets
        planet_info = []
        for p in planets:
            name = p.get('name', '')
            sign = p.get('zodiac_sign', p.get('sign', 'Unknown'))
            nak = p.get('nakshatra', 'Unknown')
            if isinstance(nak, dict):
                nak = nak.get('name', 'Unknown')
            house = p.get('house', 0)
            retro = 'R' if p.get('is_retrograde') else ''
            lon = p.get('longitude', 0)
            deg = lon % 30
            planet_info.append(f"- {name}{retro}: {sign} ({deg:.1f}°) in House {house}, Nakshatra: {nak}")
        
        # Current dasha info
        dasha_info = "Not available"
        if dasha and dasha.get('dashas'):
            from datetime import datetime
            now = datetime.now()
            for maha in dasha['dashas']:
                try:
                    maha_start = datetime.fromisoformat(maha['start_date'].replace('Z', '+00:00'))
                    maha_end = datetime.fromisoformat(maha['end_date'].replace('Z', '+00:00'))
                    if maha_start <= now <= maha_end:
                        for antar in maha.get('antardashas', []):
                            antar_start = datetime.fromisoformat(antar['start_date'].replace('Z', '+00:00'))
                            antar_end = datetime.fromisoformat(antar['end_date'].replace('Z', '+00:00'))
                            if antar_start <= now <= antar_end:
                                dasha_info = f"{maha['planet']} Mahadasha (until {maha_end.strftime('%b %Y')}), {antar['planet']} Antardasha (until {antar_end.strftime('%b %Y')})"
                                break
                        break
                except:
                    pass
        
        prompt = f"""{self._get_comprehensive_system_prompt()}

BIRTH CHART DATA:

ASCENDANT (LAGNA):
Sign: {asc_sign}
Nakshatra: {asc_nak}
Longitude: {ascendant.get('longitude', 0):.2f}°

PLANETARY POSITIONS:
{chr(10).join(planet_info)}

CURRENT DASHA PERIOD:
{dasha_info}

---

Now, provide a comprehensive, personal reading as if you're sitting with this client explaining their chart. 

Start with a warm, personal greeting that reflects their Ascendant energy. Then go through each life area with specific insights based on their planetary positions.

Use JSON format with these keys:
{{
  "greeting": "A warm, personalized opening based on their Ascendant",
  "cosmic_identity": {{
    "title": "Your Cosmic Identity",
    "summary": "2-3 sentences about their core nature",
    "ascendant_meaning": "What their rising sign reveals about them",
    "moon_meaning": "Their emotional nature and inner world",
    "sun_meaning": "Their soul purpose and vitality"
  }},
  "life_mission": {{
    "title": "Your Life Mission & Purpose",
    "summary": "Their dharma and what they're here to do",
    "career_themes": ["theme1", "theme2", "theme3"],
    "advice": "Specific guidance"
  }},
  "wealth_patterns": {{
    "title": "Wealth & Prosperity Patterns",
    "summary": "Their relationship with money and abundance",
    "strengths": "Where money flows easily",
    "challenges": "Areas to work on",
    "timing": "Best periods for financial growth"
  }},
  "relationships": {{
    "title": "Love & Relationships",
    "summary": "Their partnership patterns",
    "partner_type": "The kind of partner they attract/need",
    "challenges": "Relationship lessons",
    "advice": "How to improve relationships"
  }},
  "health_patterns": {{
    "title": "Health & Vitality",
    "summary": "Their physical constitution",
    "strengths": "Natural health advantages",
    "areas_to_watch": "Health areas needing attention",
    "recommendations": "Lifestyle suggestions"
  }},
  "current_period": {{
    "title": "Current Cosmic Weather",
    "summary": "What's happening right now in their life",
    "opportunities": "What to embrace",
    "challenges": "What to be mindful of",
    "timeline": "Key dates or periods to note"
  }},
  "sacred_guidance": {{
    "title": "Sacred Guidance & Remedies",
    "mantras": ["mantra1", "mantra2"],
    "gemstones": ["gemstone with explanation"],
    "rituals": ["specific ritual or practice"],
    "lifestyle": "Daily practice recommendations"
  }},
  "closing": "A warm, encouraging closing message"
}}

Respond ONLY with valid JSON. Be specific to their chart positions."""

        return prompt

    def _parse_comprehensive_reading(self, response: str, chart: Dict) -> Dict[str, Any]:
        """Parse the comprehensive reading response with robust JSON extraction"""
        import json
        import re
        
        if not response:
            logger.warning("Empty response from AI")
            return self._generate_fallback_chart_reading(chart, None)
        
        try:
            cleaned = response.strip()
            if cleaned.startswith('```json'):
                cleaned = cleaned[7:]
            elif cleaned.startswith('```'):
                cleaned = cleaned[3:]
            if cleaned.endswith('```'):
                cleaned = cleaned[:-3]
            cleaned = cleaned.strip()
            
            parsed = json.loads(cleaned)
            
        except json.JSONDecodeError:
            json_match = re.search(r'\{[\s\S]*\}', response)
            if json_match:
                try:
                    parsed = json.loads(json_match.group())
                except json.JSONDecodeError:
                    logger.warning("Could not parse JSON from AI response, using fallback")
                    fallback = self._generate_fallback_chart_reading(chart, None)
                    fallback['raw_reading'] = response[:500]
                    fallback['generated_by'] = 'ai_fallback'
                    return fallback
            else:
                logger.warning("No JSON found in AI response, using fallback")
                fallback = self._generate_fallback_chart_reading(chart, None)
                fallback['raw_reading'] = response[:500]
                fallback['generated_by'] = 'ai_fallback'
                return fallback
        
        result = self._ensure_complete_reading(parsed, chart)
        result['generated_by'] = 'ai'
        result['provider'] = self.provider
        result['model'] = self.model_name
        return result
    
    def _ensure_complete_reading(self, parsed: Dict, chart: Dict) -> Dict:
        """Ensure all required sections exist in the reading"""
        fallback = self._generate_fallback_chart_reading(chart, None)
        
        required_sections = [
            'greeting', 'cosmic_identity', 'life_mission', 'wealth_patterns',
            'relationships', 'health_patterns', 'current_period', 'sacred_guidance', 'closing'
        ]
        
        for section in required_sections:
            if section not in parsed or parsed[section] is None:
                parsed[section] = fallback.get(section, {})
            elif isinstance(parsed[section], dict) and isinstance(fallback.get(section), dict):
                for key, value in fallback[section].items():
                    if key not in parsed[section] or parsed[section][key] is None:
                        parsed[section][key] = value
        
        return parsed

    def _generate_fallback_chart_reading(self, chart: Dict, dasha: Optional[Dict]) -> Dict[str, Any]:
        """Generate fallback reading when AI is unavailable"""
        planets = chart.get('planets', [])
        ascendant = chart.get('ascendant', {})
        
        asc_sign = ascendant.get('zodiac_sign', ascendant.get('sign', 'Unknown'))
        moon = next((p for p in planets if p.get('name') == 'Moon'), {})
        sun = next((p for p in planets if p.get('name') == 'Sun'), {})
        
        moon_sign = moon.get('zodiac_sign', moon.get('sign', 'Unknown'))
        sun_sign = sun.get('zodiac_sign', sun.get('sign', 'Unknown'))
        
        return {
            'greeting': f"Welcome! Your {asc_sign} Ascendant gives you a unique perspective on life.",
            'cosmic_identity': {
                'title': 'Your Cosmic Identity',
                'summary': f'With {asc_sign} rising, {moon_sign} Moon, and {sun_sign} Sun, you have a rich and complex personality.',
                'ascendant_meaning': f'Your {asc_sign} Ascendant shapes how the world sees you.',
                'moon_meaning': f'Your {moon_sign} Moon reveals your emotional nature.',
                'sun_meaning': f'Your {sun_sign} Sun represents your core identity.'
            },
            'life_mission': {
                'title': 'Your Life Mission & Purpose',
                'summary': 'Your chart shows unique talents waiting to be developed.',
                'career_themes': ['Leadership', 'Service', 'Creativity'],
                'advice': 'Follow your intuition in career matters.'
            },
            'wealth_patterns': {
                'title': 'Wealth & Prosperity Patterns',
                'summary': 'Your chart indicates potential for financial growth.',
                'strengths': 'Natural ability to attract resources',
                'challenges': 'Learning patience with long-term investments',
                'timing': 'Watch for opportunities in favorable dasha periods'
            },
            'relationships': {
                'title': 'Love & Relationships',
                'summary': 'Your chart reveals deep capacity for meaningful connections.',
                'partner_type': 'Someone who complements your nature',
                'challenges': 'Balancing independence with partnership',
                'advice': 'Communication is key to lasting relationships'
            },
            'health_patterns': {
                'title': 'Health & Vitality',
                'summary': 'Your constitution is shaped by your planetary placements.',
                'strengths': 'Natural resilience and vitality',
                'areas_to_watch': 'Stress management and regular rest',
                'recommendations': 'Yoga and meditation suit your nature'
            },
            'current_period': {
                'title': 'Current Cosmic Weather',
                'summary': 'This is a time of growth and transformation.',
                'opportunities': 'New beginnings are favored',
                'challenges': 'Patience may be tested',
                'timeline': 'The coming months hold significant potential'
            },
            'sacred_guidance': {
                'title': 'Sacred Guidance & Remedies',
                'mantras': ['Om Namah Shivaya for peace', 'Gayatri Mantra for wisdom'],
                'gemstones': ['Consult for personalized gemstone recommendations'],
                'rituals': ['Light a lamp at dawn and dusk'],
                'lifestyle': 'Regular meditation and prayer strengthen your chart'
            },
            'closing': 'Your chart is a map of infinite potential. Trust your journey and embrace your cosmic destiny.',
            'generated_by': 'fallback',
            'note': 'AI service unavailable - basic reading provided'
        }
