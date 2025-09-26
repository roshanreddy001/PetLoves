from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import re
import random
from typing import List, Dict, Any
import logging
import os
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    context: str = "pet_care"

class ChatResponse(BaseModel):
    response: str
    is_pet_related: bool
    confidence: float
    message_type: str  # "pet_advice", "non_pet_redirect", "error"

class RoshanGPTService:
    def __init__(self):
        # Initialize Google Gemini API
        self.google_api_key = os.getenv('GOOGLE_API_KEY')
        if self.google_api_key:
            genai.configure(api_key=self.google_api_key)
            self.model = genai.GenerativeModel('gemini-pro')
            logger.info("🤖 Google Gemini API initialized successfully")
        else:
            self.model = None
            logger.warning("⚠️ Google API key not found. Using fallback responses.")
        # Comprehensive pet-related keywords and phrases
        self.pet_keywords = [
            # Animals
            'dog', 'dogs', 'cat', 'cats', 'puppy', 'puppies', 'kitten', 'kittens', 
            'pet', 'pets', 'animal', 'animals', 'bird', 'birds', 'fish', 'fishes',
            'rabbit', 'rabbits', 'hamster', 'hamsters', 'guinea pig', 'guinea pigs',
            'ferret', 'ferrets', 'reptile', 'reptiles', 'turtle', 'turtles',
            'snake', 'snakes', 'lizard', 'lizards', 'parrot', 'parrots',
            'canary', 'canaries', 'goldfish', 'budgie', 'budgies',
            
            # Pet care activities
            'feeding', 'food', 'nutrition', 'diet', 'eating', 'treats', 'kibble',
            'grooming', 'brushing', 'bathing', 'nail', 'nails', 'claws', 'fur', 'coat',
            'exercise', 'walk', 'walking', 'walks', 'play', 'playing', 'toy', 'toys',
            'training', 'obedience', 'behavior', 'behaviour', 'discipline', 'commands',
            
            # Health and medical
            'vet', 'veterinarian', 'veterinary', 'health', 'sick', 'illness', 'disease',
            'vaccination', 'vaccinations', 'vaccine', 'vaccines', 'medicine', 'medication',
            'treatment', 'injury', 'wound', 'pain', 'symptoms', 'checkup', 'examination',
            'flea', 'fleas', 'tick', 'ticks', 'worm', 'worms', 'parasite', 'parasites',
            'allergy', 'allergies', 'allergic',
            
            # Pet supplies and accessories
            'collar', 'collars', 'leash', 'leashes', 'harness', 'bed', 'beds',
            'crate', 'crates', 'cage', 'cages', 'litter', 'bowl', 'bowls',
            'feeder', 'feeders', 'carrier', 'carriers', 'scratching post',
            
            # Pet behaviors and characteristics
            'barking', 'bark', 'meowing', 'meow', 'purring', 'purr', 'scratching',
            'scratch', 'biting', 'bite', 'chewing', 'chew', 'shedding', 'shed',
            'house training', 'potty training', 'litter box', 'aggressive', 'friendly',
            'playful', 'anxious', 'stressed', 'hyperactive',
            
            # Pet life stages
            'adult', 'senior', 'elderly', 'young', 'old', 'breeding', 'pregnancy',
            'birth', 'adoption', 'rescue', 'shelter',
            
            # Pet-specific terms
            'paw', 'paws', 'tail', 'tails', 'whiskers', 'breed', 'breeds',
            'spay', 'neuter', 'microchip', 'pet insurance'
        ]
        
        # Pet-related question patterns
        self.pet_patterns = [
            r'my (dog|cat|pet|puppy|kitten|bird|fish|rabbit|hamster)',
            r'how to (train|feed|groom|care for|walk|bathe)',
            r'what (food|treats|toys|medicine) (for|should)',
            r'is it (safe|okay|good|bad) for (pets|dogs|cats|animals)',
            r'can (dogs|cats|pets|animals) (eat|have|do|play)',
            r'why does my (dog|cat|pet|animal)',
            r'how often should (i|you|we) (feed|walk|groom|bathe)',
            r'best (food|toys|treats|medicine|vet) for',
            r'pet (insurance|care|health|training|behavior|nutrition)',
            r'(dog|cat|pet) (training|behavior|health|nutrition|grooming)',
            r'veterinary|veterinarian|vet (advice|care|visit|checkup)',
            r'animal (care|health|behavior|training|nutrition)'
        ]
        
        # Pet care responses
        self.pet_responses = [
            {
                "response": "🐾 That's a great question about pet care! For the best advice tailored to your pet's specific needs, I recommend consulting with a qualified veterinarian. They can provide personalized guidance based on your pet's breed, age, health status, and individual requirements.",
                "type": "general_advice"
            },
            {
                "response": "🥗 Pet nutrition is crucial for your furry friend's health! Choose high-quality food appropriate for your pet's age, size, and activity level. Always transition to new foods gradually over 7-10 days, and consult your veterinarian before making significant dietary changes.",
                "type": "nutrition"
            },
            {
                "response": "🏃‍♂️ Regular exercise is essential for your pet's physical and mental well-being! Dogs typically need 30 minutes to 2 hours of activity daily depending on their breed and age, while cats benefit from 10-15 minutes of interactive play sessions multiple times a day.",
                "type": "exercise"
            },
            {
                "response": "✂️ Pet grooming is vital for health and hygiene! Regular brushing prevents matting and reduces shedding, nail trimming prevents overgrowth and injury, and dental care prevents periodontal disease. Establish a routine early to make grooming a positive experience.",
                "type": "grooming"
            },
            {
                "response": "🏥 If you notice any changes in your pet's behavior, appetite, energy levels, or bathroom habits, it's important to schedule a veterinary visit. Early detection and treatment of health issues can prevent more serious problems and ensure your pet's well-being.",
                "type": "health_monitoring"
            },
            {
                "response": "🎓 Pet training requires patience, consistency, and positive reinforcement! Reward good behavior with treats, praise, or playtime. Keep training sessions short (5-10 minutes) and frequent. Remember, every pet learns at their own pace.",
                "type": "training"
            },
            {
                "response": "🏠 Creating a safe environment for your pet includes pet-proofing your home, providing comfortable sleeping areas, ensuring access to fresh water, and maintaining appropriate temperature. Remove toxic plants, secure hazardous items, and create designated spaces for eating and resting.",
                "type": "environment"
            },
            {
                "response": "💉 Vaccinations and regular check-ups are fundamental for preventing diseases and maintaining your pet's health. Follow your veterinarian's recommended vaccination schedule, and don't skip annual or bi-annual wellness exams even if your pet seems healthy.",
                "type": "preventive_care"
            },
            {
                "response": "🧸 Mental stimulation is just as important as physical exercise! Provide puzzle toys, rotate toys regularly, teach new tricks, and engage in interactive play. Mental enrichment prevents boredom-related behavioral issues and keeps your pet's mind sharp.",
                "type": "mental_stimulation"
            },
            {
                "response": "👥 Proper socialization helps your pet become well-adjusted and confident. Expose them to different people, animals, environments, and experiences in a controlled, positive manner. Start early, but remember that socialization is a lifelong process.",
                "type": "socialization"
            }
        ]
        
        # Non-pet related responses
        self.non_pet_responses = [
            "🐾 I'm RoshanGPT, your dedicated Pet Care Assistant! I'm specifically designed to help with pet-related questions and concerns. Please ask me about pet care, health, nutrition, training, or any other pet-related topics, and I'll be happy to assist you!",
            "🐕 I specialize exclusively in pet care and animal-related topics! Whether you have questions about dog training, cat nutrition, pet health, grooming tips, or any other pet care concerns, I'm here to help. What would you like to know about your furry, feathered, or scaled friends?",
            "🐱 As your Pet Care Assistant, I focus on providing helpful information about pets and animals. I can assist with questions about pet behavior, health, nutrition, training, grooming, and general pet care. Please feel free to ask me anything related to your beloved pets!",
            "🦮 I'm designed to be your go-to resource for all things pet-related! From puppy training tips to senior pet care, from choosing the right food to understanding pet behavior - I'm here to help with your pet care journey. What pet-related question can I answer for you today?",
            "🐾 My expertise lies in pet care and animal welfare! I can provide guidance on pet health, nutrition, training, grooming, behavior, and much more. Please ask me about your pets, and I'll do my best to provide helpful, informative responses tailored to your pet care needs."
        ]

    def calculate_pet_relevance_score(self, message: str) -> float:
        """Calculate how pet-related a message is (0.0 to 1.0)"""
        message_lower = message.lower()
        score = 0.0
        
        # Check for direct keyword matches
        keyword_matches = sum(1 for keyword in self.pet_keywords if keyword in message_lower)
        keyword_score = min(keyword_matches * 0.1, 0.6)  # Max 0.6 from keywords
        
        # Check for pattern matches
        pattern_matches = sum(1 for pattern in self.pet_patterns if re.search(pattern, message_lower))
        pattern_score = min(pattern_matches * 0.2, 0.4)  # Max 0.4 from patterns
        
        total_score = keyword_score + pattern_score
        return min(total_score, 1.0)

    def is_pet_related(self, message: str, threshold: float = 0.3) -> tuple[bool, float]:
        """Determine if a message is pet-related"""
        score = self.calculate_pet_relevance_score(message)
        return score >= threshold, score

    def generate_pet_response(self, message: str) -> Dict[str, Any]:
        """Generate a pet-related response using Google Gemini API"""
        try:
            if self.model and self.google_api_key:
                # Create a pet-focused prompt for Gemini
                system_prompt = """
You are RoshanGPT, a specialized Pet Care Assistant. Your role is to provide helpful, accurate, and caring advice about pets and animals. 

Guidelines:
- Focus exclusively on pet care, health, nutrition, training, behavior, and related topics
- Provide practical, actionable advice
- Always recommend consulting a veterinarian for serious health concerns
- Use a warm, caring tone with appropriate emojis
- Keep responses concise but informative (beautiful and understanding format)
- If asked about non-pet topics, politely redirect to pet-related subjects

User Question: {}

Provide a helpful response:""".format(message)

                response = self.model.generate_content(system_prompt)
                
                if response and response.text:
                    return {
                        "response": response.text.strip(),
                        "is_pet_related": True,
                        "confidence": 0.95,
                        "message_type": "pet_advice",
                        "source": "gemini_ai"
                    }
                else:
                    logger.warning("⚠️ Empty response from Gemini API, using fallback")
                    
        except Exception as e:
            logger.error(f"❌ Error calling Gemini API: {str(e)}")
        
        # Fallback to predefined responses if API fails
        response_data = random.choice(self.pet_responses)
        return {
            "response": response_data["response"],
            "is_pet_related": True,
            "confidence": 0.9,
            "message_type": "pet_advice",
            "category": response_data["type"],
            "source": "fallback"
        }

    def generate_non_pet_response(self, message: str = "") -> Dict[str, Any]:
        """Generate a response for non-pet-related queries"""
        try:
            if self.model and self.google_api_key and message:
                # Use Gemini to create a personalized redirect response
                redirect_prompt = f"""
You are RoshanGPT, a Pet Care Assistant. The user asked: "{message}"

This question is not related to pets or animals. Politely redirect them to ask about pet care topics instead. 
Mention some specific pet care areas you can help with (like nutrition, training, health, grooming, behavior).
Use a friendly tone with pet emojis. Keep it brief (1-2 sentences).

Response:"""
                
                response = self.model.generate_content(redirect_prompt)
                
                if response and response.text:
                    return {
                        "response": response.text.strip(),
                        "is_pet_related": False,
                        "confidence": 0.95,
                        "message_type": "non_pet_redirect",
                        "source": "gemini_ai"
                    }
        except Exception as e:
            logger.error(f"❌ Error generating redirect response: {str(e)}")
        
        # Fallback to predefined responses
        response = random.choice(self.non_pet_responses)
        return {
            "response": response,
            "is_pet_related": False,
            "confidence": 0.95,
            "message_type": "non_pet_redirect",
            "source": "fallback"
        }

    def process_message(self, message: str) -> Dict[str, Any]:
        """Process a message and return appropriate response"""
        try:
            is_pet, confidence = self.is_pet_related(message)
            
            logger.info(f"🤖 Processing message: '{message[:50]}...' | Pet-related: {is_pet} | Confidence: {confidence:.2f}")
            
            if is_pet:
                return self.generate_pet_response(message)
            else:
                return self.generate_non_pet_response(message)
                
        except Exception as e:
            logger.error(f"❌ Error processing message: {str(e)}")
            return {
                "response": "I apologize, but I'm experiencing some technical difficulties. Please try again in a moment, or consult with a veterinarian for immediate pet care concerns.",
                "is_pet_related": False,
                "confidence": 0.0,
                "message_type": "error"
            }

# Initialize the service
roshan_gpt_service = RoshanGPTService()

@router.post("/api/roshan-gpt/chat", response_model=ChatResponse)
async def chat_with_roshan_gpt(request: ChatRequest):
    """
    Chat endpoint for RoshanGPT - Pet Care Assistant
    
    This endpoint processes user messages and determines if they are pet-related.
    - If pet-related: Returns helpful pet care advice
    - If not pet-related: Politely redirects to pet-related topics
    """
    try:
        if not request.message or not request.message.strip():
            raise HTTPException(status_code=400, detail="Message cannot be empty")
        
        # Process the message
        result = roshan_gpt_service.process_message(request.message.strip())
        
        return ChatResponse(
            response=result["response"],
            is_pet_related=result["is_pet_related"],
            confidence=result["confidence"],
            message_type=result["message_type"]
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Unexpected error in chat endpoint: {str(e)}")
        raise HTTPException(
            status_code=500, 
            detail="Internal server error. Please try again later."
        )

@router.get("/api/roshan-gpt/health")
async def health_check():
    """Health check endpoint for RoshanGPT service"""
    api_status = "configured" if roshan_gpt_service.google_api_key else "not_configured"
    ai_model = "Google Gemini Pro" if roshan_gpt_service.model else "Fallback Responses"
    
    return {
        "status": "healthy",
        "service": "RoshanGPT Pet Care Assistant",
        "version": "2.0.0",
        "ai_model": ai_model,
        "api_status": api_status,
        "capabilities": [
            "AI-powered pet care advice",
            "Pet health guidance",
            "Pet nutrition information", 
            "Pet training tips",
            "Pet behavior insights",
            "Non-pet query redirection",
            "Personalized responses"
        ]
    }
