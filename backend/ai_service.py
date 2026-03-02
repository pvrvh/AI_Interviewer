from groq import Groq
import os
from dotenv import load_dotenv

load_dotenv()

class AIService:
    def __init__(self):
        self.api_key = os.getenv('GROQ_API_KEY')
        self.model = os.getenv('GROQ_MODEL', 'llama-3.3-70b-versatile')
        
        if self.api_key:
            self.client = Groq(api_key=self.api_key)
        else:
            self.client = None
        
        # Store question history for context
        self.question_history = {}
    
    def generate_questions(self, category, difficulty, count=5, user_history=None):
        """Generate contextual questions based on user's performance history"""
        
        if not self.client:
            fallback_questions = self._get_fallback_questions(category, difficulty, count)
            return self._normalize_questions(fallback_questions, category, difficulty)
        
        try:
            # Build context from user history
            context = self._build_context(category, difficulty, user_history)
            
            prompt = f"""You are an expert technical interviewer. Generate {count} {difficulty} level interview questions for {category}.

{context}

Requirements:
1. Questions should progressively build on each other
2. Start with fundamentals, then move to advanced concepts
3. Each question should be unique and specific
4. Focus on practical, real-world scenarios
5. Avoid generic or overly broad questions

Format each question EXACTLY like this:
Question: [the question]
Focus Area: [specific topic/concept]
Follow-up: [potential follow-up question]
---

Generate {count} questions following this exact format."""

            chat_completion = self.client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content": "You are an expert technical interviewer who creates progressive, contextual interview questions. Always follow the exact format provided."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                model=self.model,
                temperature=0.7,
                max_tokens=2048,
            )
            
            questions_text = chat_completion.choices[0].message.content
            questions = self._parse_questions(questions_text)
            
            # If parsing fails, use fallback
            if not questions or len(questions) < count:
                print("Warning: AI response parsing failed, using fallback")
                fallback_questions = self._get_fallback_questions(category, difficulty, count)
                return self._normalize_questions(fallback_questions, category, difficulty)
            
            return self._normalize_questions(questions[:count], category, difficulty)
            
        except Exception as e:
            print(f"Groq API Error: {str(e)}")
            fallback_questions = self._get_fallback_questions(category, difficulty, count)
            return self._normalize_questions(fallback_questions, category, difficulty)

    def _normalize_questions(self, questions, category, difficulty):
        """Normalize question payload to the route/database schema."""
        normalized_questions = []

        for q_data in questions:
            question_text = q_data.get('question') or q_data.get('question_text')
            if not question_text:
                continue

            focus_area = q_data.get('focus_area', '').strip()
            followup = q_data.get('followup', '').strip()

            hints = q_data.get('hints')
            if not isinstance(hints, list):
                hints = []
                if focus_area:
                    hints.append(f"Focus on: {focus_area}")
                if followup:
                    hints.append(f"Consider this follow-up: {followup}")

            normalized_questions.append({
                'question': question_text,
                'type': q_data.get('type') or category or 'technical',
                'difficulty': q_data.get('difficulty') or difficulty or 'medium',
                'expected_answer': q_data.get('expected_answer') or '',
                'hints': hints
            })

        return normalized_questions
    
    def _build_context(self, category, difficulty, user_history):
        """Build context based on user's previous performance"""
        if not user_history:
            return "This is the user's first interview session. Start with foundational concepts."
        
        context_parts = []
        
        # Analyze previous performance
        weak_areas = user_history.get('weak_areas', [])
        strong_areas = user_history.get('strong_areas', [])
        avg_score = user_history.get('average_score', 0)
        total_questions = user_history.get('total_questions', 0)
        
        context_parts.append(f"User has completed {total_questions} questions with an average score of {avg_score:.1f}%")
        
        if weak_areas:
            context_parts.append(f"User needs improvement in: {', '.join(weak_areas)}")
        
        if strong_areas:
            context_parts.append(f"User is strong in: {', '.join(strong_areas)}")
        
        if avg_score < 50:
            context_parts.append("Focus on fundamental concepts and provide more guidance.")
        elif avg_score > 80:
            context_parts.append("User is advanced. Include challenging edge cases and design patterns.")
        else:
            context_parts.append("User has moderate understanding. Balance fundamentals with intermediate concepts.")
        
        return "\n".join(context_parts)
    
    def generate_followup_question(self, original_question, user_answer, answer_quality):
        """Generate intelligent follow-up based on user's answer"""
        
        if not self.client:
            return self._get_generic_followup(original_question)
        
        try:
            prompt = f"""Based on this interview exchange, generate ONE relevant follow-up question:

Original Question: {original_question}
User's Answer: {user_answer}
Answer Quality: {answer_quality}/100

Guidelines:
- If answer was strong (>70): Ask about edge cases, optimizations, or advanced scenarios
- If answer was weak (<50): Ask a clarifying question about fundamentals
- If answer was medium: Probe deeper into the concept

Generate ONLY the follow-up question, nothing else. Make it specific and relevant."""

            chat_completion = self.client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content": "You are an expert interviewer creating follow-up questions. Be concise and specific."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                model=self.model,
                temperature=0.7,
                max_tokens=150,
            )
            
            return chat_completion.choices[0].message.content.strip()
            
        except Exception as e:
            print(f"Groq API Error: {str(e)}")
            return self._get_generic_followup(original_question)
    
    def evaluate_answer_with_context(self, question, answer, difficulty, previous_score=None):
        """Evaluate answer with context from previous performance"""
        
        if not self.client:
            return self._get_fallback_evaluation(answer)
        
        try:
            context = ""
            if previous_score is not None:
                if previous_score < 50:
                    context = "This user is struggling. Provide encouraging, educational feedback with specific learning resources."
                elif previous_score > 80:
                    context = "This user is advanced. Be more critical and detailed in your evaluation."
                else:
                    context = "This user has moderate understanding. Provide balanced feedback."
            else:
                context = "This is the user's first answer. Provide constructive, encouraging feedback."
            
            prompt = f"""Evaluate this interview answer:

Question: {question}
Difficulty: {difficulty}
Answer: {answer}

Context: {context}

Provide a detailed evaluation with:
1. Score (0-100) - Be fair and realistic
2. Strengths - What they did well (2-3 specific points)
3. Areas for Improvement - Specific, actionable feedback (2-3 points)
4. Key Concepts - Core concepts they should understand (2-3 concepts)
5. Suggested Resources - Specific topics to study (2-3 topics)

Use this EXACT format:
SCORE: [number between 0-100]
STRENGTHS:
- [strength 1]
- [strength 2]
IMPROVEMENTS:
- [improvement 1]
- [improvement 2]
KEY_CONCEPTS:
- [concept 1]
- [concept 2]
RESOURCES:
- [resource 1]
- [resource 2]"""

            chat_completion = self.client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content": "You are an expert interviewer providing constructive, detailed feedback. Always use the exact format requested."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                model=self.model,
                temperature=0.7,
                max_tokens=1000,
            )
            
            evaluation_text = chat_completion.choices[0].message.content
            evaluation = self._parse_evaluation(evaluation_text)
            
            # Add formatted feedback text
            evaluation['feedback'] = self._format_feedback(evaluation)
            
            return evaluation
            
        except Exception as e:
            print(f"Groq API Error: {str(e)}")
            return self._get_fallback_evaluation(answer)
    
    def get_tips(self, category):
        """Get interview preparation tips for a specific category"""
        
        if not self.client:
            return self._get_fallback_tips(category)
        
        try:
            prompt = f"""Provide 5-7 expert interview preparation tips for {category} interviews. 
Focus on practical, actionable advice that will help candidates succeed.

Format each tip as:
Tip: [concise tip title]
Details: [2-3 sentences explaining the tip]
---

Make tips specific to {category} and include both technical and soft skill advice."""

            chat_completion = self.client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content": "You are an experienced technical recruiter and interview coach."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                model=self.model,
                temperature=0.7,
                max_tokens=800,
            )
            
            tips_text = chat_completion.choices[0].message.content
            return self._parse_tips(tips_text)
            
        except Exception as e:
            print(f"Groq API Error: {str(e)}")
            return self._get_fallback_tips(category)
    
    def _parse_tips(self, text):
        """Parse tips from AI response"""
        tips = []
        current_tip = {}
        
        lines = text.split('\n')
        for line in lines:
            line = line.strip()
            
            if line.startswith('Tip:'):
                if current_tip:
                    tips.append(current_tip)
                current_tip = {'title': line.replace('Tip:', '').strip()}
            elif line.startswith('Details:'):
                current_tip['details'] = line.replace('Details:', '').strip()
            elif line == '---' and current_tip:
                tips.append(current_tip)
                current_tip = {}
        
        # Add last tip if exists
        if current_tip and 'title' in current_tip:
            tips.append(current_tip)
        
        return tips if tips else self._get_fallback_tips('')
    
    def _get_fallback_tips(self, category):
        """Fallback tips when API is unavailable"""
        return [
            {
                'title': 'Master the Fundamentals',
                'details': f'Ensure you have a solid understanding of core {category} concepts. Review basic principles and common patterns before diving into advanced topics.'
            },
            {
                'title': 'Practice Coding Problems',
                'details': 'Solve problems on platforms like LeetCode, HackerRank, or CodeSignal. Focus on understanding the problem-solving approach rather than memorizing solutions.'
            },
            {
                'title': 'Explain Your Thought Process',
                'details': 'Always articulate your reasoning clearly. Interviewers value your problem-solving approach as much as the final solution.'
            },
            {
                'title': 'Ask Clarifying Questions',
                'details': 'Before jumping into a solution, make sure you understand the requirements fully. This shows attention to detail and prevents wasted effort.'
            },
            {
                'title': 'Study System Design',
                'details': 'For senior roles, understand scalability, databases, caching, and distributed systems. Practice designing real-world systems.'
            },
            {
                'title': 'Review Your Past Work',
                'details': 'Be ready to discuss your previous projects in detail. Prepare examples that demonstrate your problem-solving and technical skills.'
            },
            {
                'title': 'Stay Current',
                'details': f'Keep up with the latest trends and best practices in {category}. Show that you\'re passionate about continuous learning.'
            }
        ]
    
    def _format_feedback(self, evaluation):
        """Format evaluation into readable feedback"""
        feedback_parts = [
            f"Score: {evaluation['score']}/100\n",
            "Strengths:",
            *[f"• {s}" for s in evaluation['strengths']],
            "\nAreas for Improvement:",
            *[f"• {i}" for i in evaluation['improvements']],
            "\nKey Concepts to Master:",
            *[f"• {k}" for k in evaluation['key_concepts']],
            "\nSuggested Study Topics:",
            *[f"• {r}" for r in evaluation['resources']]
        ]
        return "\n".join(feedback_parts)
    
    def _parse_questions(self, text):
        """Parse structured questions from AI response"""
        questions = []
        current_q = {}
        
        lines = text.split('\n')
        for line in lines:
            line = line.strip()
            
            if line.startswith('Question:'):
                if current_q and 'question' in current_q:
                    questions.append(current_q)
                current_q = {'question': line.replace('Question:', '').strip()}
            elif line.startswith('Focus Area:'):
                current_q['focus_area'] = line.replace('Focus Area:', '').strip()
            elif line.startswith('Follow-up:'):
                current_q['followup'] = line.replace('Follow-up:', '').strip()
            elif line == '---':
                if current_q and 'question' in current_q:
                    questions.append(current_q)
                    current_q = {}
        
        # Add last question if exists
        if current_q and 'question' in current_q:
            questions.append(current_q)
        
        return questions
    
    def _parse_evaluation(self, text):
        """Parse structured evaluation from AI response"""
        evaluation = {
            'score': 0,
            'strengths': [],
            'improvements': [],
            'key_concepts': [],
            'resources': []
        }
        
        lines = text.split('\n')
        current_section = None
        
        for line in lines:
            line = line.strip()
            
            if line.startswith('SCORE:'):
                try:
                    score_text = line.split(':')[1].strip()
                    # Extract number from text (handles "75/100" or "75")
                    score_num = ''.join(filter(str.isdigit, score_text))
                    evaluation['score'] = min(100, max(0, int(score_num))) if score_num else 50
                except:
                    evaluation['score'] = 50
            elif line.startswith('STRENGTHS:'):
                current_section = 'strengths'
            elif line.startswith('IMPROVEMENTS:') or line.startswith('AREAS FOR IMPROVEMENT:'):
                current_section = 'improvements'
            elif line.startswith('KEY_CONCEPTS:') or line.startswith('KEY CONCEPTS:'):
                current_section = 'key_concepts'
            elif line.startswith('RESOURCES:') or line.startswith('SUGGESTED RESOURCES:'):
                current_section = 'resources'
            elif line and (line.startswith('-') or line.startswith('•') or line.startswith('*')):
                if current_section:
                    clean_line = line.lstrip('-•* ').strip()
                    if clean_line:
                        evaluation[current_section].append(clean_line)
        
        return evaluation
    
    def _get_generic_followup(self, question):
        """Generate a generic follow-up"""
        return f"Can you elaborate more on your approach and explain the reasoning behind your answer?"
    
    def _get_fallback_questions(self, category, difficulty, count):
        """Contextual fallback questions organized by topic"""
        
        fallback_db = {
            'Technical': {
                'Easy': [
                    {'question': 'What is the difference between == and === in JavaScript?', 'focus_area': 'JavaScript Fundamentals', 'followup': 'How does type coercion work in JavaScript?'},
                    {'question': 'Explain what a closure is in programming.', 'focus_area': 'Scope & Closures', 'followup': 'Give a practical use case for closures.'},
                    {'question': 'What is the purpose of the "this" keyword in JavaScript?', 'focus_area': 'Context Binding', 'followup': 'How can you change what "this" refers to?'},
                    {'question': 'What is a RESTful API and what are its key principles?', 'focus_area': 'API Design', 'followup': 'What are the main HTTP methods and their uses?'},
                    {'question': 'Explain the difference between var, let, and const in JavaScript.', 'focus_area': 'Variable Declaration', 'followup': 'When would you use each one?'}
                ],
                'Medium': [
                    {'question': 'How does event delegation work and why is it useful?', 'focus_area': 'DOM Events', 'followup': 'What are the performance benefits?'},
                    {'question': 'What is the event loop in JavaScript?', 'focus_area': 'Asynchronous JavaScript', 'followup': 'How do promises fit into the event loop?'},
                    {'question': 'Explain the concept of prototypal inheritance.', 'focus_area': 'OOP in JavaScript', 'followup': 'How is it different from classical inheritance?'},
                    {'question': 'What are Higher-Order Functions? Provide examples.', 'focus_area': 'Functional Programming', 'followup': 'How do map, filter, and reduce work?'},
                    {'question': 'How would you optimize a slow-loading web page?', 'focus_area': 'Performance Optimization', 'followup': 'What tools would you use to identify bottlenecks?'}
                ],
                'Hard': [
                    {'question': 'Design a debounce function and explain when you would use it.', 'focus_area': 'Advanced JavaScript Patterns', 'followup': 'How is debounce different from throttle?'},
                    {'question': 'How would you implement a Promise from scratch?', 'focus_area': 'Async Patterns', 'followup': 'What are the states of a Promise?'},
                    {'question': 'Explain how Virtual DOM works in React.', 'focus_area': 'React Internals', 'followup': 'What is reconciliation?'},
                    {'question': 'Design a caching strategy for a large-scale web application.', 'focus_area': 'System Design', 'followup': 'How would you handle cache invalidation?'},
                    {'question': 'How would you implement a pub/sub system?', 'focus_area': 'Design Patterns', 'followup': 'What are the advantages over direct communication?'}
                ]
            },
            'Behavioral': {
                'Easy': [
                    {'question': 'Tell me about a time you worked on a team project.', 'focus_area': 'Teamwork', 'followup': 'What was your specific contribution?'},
                    {'question': 'Describe a challenging problem you solved recently.', 'focus_area': 'Problem Solving', 'followup': 'What did you learn from it?'},
                    {'question': 'How do you prioritize your tasks when working on multiple projects?', 'focus_area': 'Time Management', 'followup': 'Give an example of when you had multiple deadlines.'},
                    {'question': 'What motivates you as a developer?', 'focus_area': 'Self-Awareness', 'followup': 'How do you stay current with new technologies?'},
                    {'question': 'Tell me about a time you received constructive criticism.', 'focus_area': 'Growth Mindset', 'followup': 'How did you respond and improve?'}
                ],
                'Medium': [
                    {'question': 'Describe a time when you had to learn a new technology quickly.', 'focus_area': 'Adaptability', 'followup': 'What strategies did you use?'},
                    {'question': 'Tell me about a conflict you had with a team member and how you resolved it.', 'focus_area': 'Conflict Resolution', 'followup': 'What would you do differently?'},
                    {'question': 'Share an example of when you had to make a difficult technical decision.', 'focus_area': 'Decision Making', 'followup': 'How did you weigh the tradeoffs?'},
                    {'question': 'How have you handled working on a project with unclear requirements?', 'focus_area': 'Ambiguity Management', 'followup': 'How did you seek clarification?'},
                    {'question': 'Describe a time when you had to advocate for a technical approach.', 'focus_area': 'Communication & Influence', 'followup': 'How did you persuade others?'}
                ],
                'Hard': [
                    {'question': 'Tell me about a time when you failed at something significant.', 'focus_area': 'Resilience', 'followup': 'What systemic changes did you make afterward?'},
                    {'question': 'Describe a situation where you had to balance technical debt with new features.', 'focus_area': 'Strategic Thinking', 'followup': 'How did you convince stakeholders?'},
                    {'question': 'How have you mentored or coached junior developers?', 'focus_area': 'Leadership', 'followup': 'How did you measure their growth?'},
                    {'question': 'Tell me about a time you identified and solved a problem before it became critical.', 'focus_area': 'Proactive Thinking', 'followup': 'What was your thought process?'},
                    {'question': 'Describe a situation where you had to push back on a stakeholder request.', 'focus_area': 'Negotiation', 'followup': 'What was the outcome and relationship impact?'}
                ]
            },
            'System Design': {
                'Easy': [
                    {'question': 'Design a basic URL shortener service.', 'focus_area': 'System Architecture', 'followup': 'How would you generate unique short URLs?'},
                    {'question': 'How would you design a simple key-value store?', 'focus_area': 'Data Storage', 'followup': 'What data structure would you use?'},
                    {'question': 'Design the database schema for a blogging platform.', 'focus_area': 'Database Design', 'followup': 'How would you handle comments and tags?'},
                    {'question': 'How would you implement a rate limiter for an API?', 'focus_area': 'API Design', 'followup': 'What algorithms could you use?'},
                    {'question': 'Design a basic authentication system.', 'focus_area': 'Security', 'followup': 'How would you store passwords securely?'}
                ],
                'Medium': [
                    {'question': 'Design a notification system for a social media app.', 'focus_area': 'Distributed Systems', 'followup': 'How would you handle millions of users?'},
                    {'question': 'How would you design a file storage service like Dropbox?', 'focus_area': 'Storage & Sync', 'followup': 'How would you handle file versioning?'},
                    {'question': 'Design a real-time chat application.', 'focus_area': 'Real-time Communication', 'followup': 'What protocol would you use (WebSocket, SSE)?'},
                    {'question': 'How would you design a search autocomplete feature?', 'focus_area': 'Search & Indexing', 'followup': 'How would you handle typos and ranking?'},
                    {'question': 'Design a recommendation system for an e-commerce site.', 'focus_area': 'Machine Learning Integration', 'followup': 'What algorithms would you consider?'}
                ],
                'Hard': [
                    {'question': 'Design YouTube or Netflix at scale.', 'focus_area': 'Large-Scale Systems', 'followup': 'How would you handle video encoding and CDN distribution?'},
                    {'question': 'How would you design a distributed cache system?', 'focus_area': 'Caching Strategy', 'followup': 'How do you ensure consistency across nodes?'},
                    {'question': 'Design a ride-sharing service like Uber.', 'focus_area': 'Geospatial Systems', 'followup': 'How would you match drivers and riders efficiently?'},
                    {'question': 'How would you design a globally distributed payment system?', 'focus_area': 'Financial Systems', 'followup': 'How do you handle transactions and eventual consistency?'},
                    {'question': 'Design a system to handle 1 billion requests per day.', 'focus_area': 'Scalability', 'followup': 'What are the bottlenecks and how would you address them?'}
                ]
            }
        }
        
        category_map = {
            'technical': 'Technical',
            'behavioral': 'Behavioral',
            'system_design': 'System Design'
        }

        normalized_category = category_map.get(str(category).lower(), category)
        normalized_difficulty = str(difficulty).capitalize()

        questions = fallback_db.get(normalized_category, {}).get(normalized_difficulty, [])
        return questions[:count] if questions else []
    
    def _get_fallback_evaluation(self, answer):
        """Provide a basic evaluation without AI"""
        word_count = len(answer.split())
        
        if word_count < 20:
            score = 40
            feedback = "Your answer is too brief. Try to provide more detail, examples, and explanations."
            strengths = ['Attempted the question']
            improvements = ['Add more specific details', 'Include concrete examples', 'Explain your reasoning']
        elif word_count < 50:
            score = 60
            feedback = "Good start! Your answer shows understanding but could use more depth."
            strengths = ['Showed basic understanding', 'Clear communication']
            improvements = ['Add specific technical details', 'Include real-world examples', 'Explain edge cases']
        else:
            score = 75
            feedback = "Well-detailed answer! You've demonstrated good understanding of the topic."
            strengths = ['Comprehensive answer', 'Good level of detail', 'Clear explanations']
            improvements = ['Consider discussing trade-offs', 'Mention potential optimizations', 'Add more technical depth']
        
        return {
            'score': score,
            'feedback': feedback,
            'strengths': strengths,
            'improvements': improvements,
            'key_concepts': ['Practice fundamental concepts', 'Study related topics'],
            'resources': ['Review official documentation', 'Practice similar problems']
        }
# Create global instance and wrapper functions for backward compatibility
_ai_service = AIService()

def generate_interview_questions(category, difficulty, count=5):
    """Wrapper function for backward compatibility with route files"""
    return _ai_service.generate_questions(category, difficulty, count)

def evaluate_answer(question_text, answer_text, category=None, difficulty=None):
    """Wrapper function for backward compatibility with route files"""
    return _ai_service.evaluate_answer_with_context(
        question=question_text,
        answer=answer_text,
        difficulty=difficulty,
        previous_score=None
    )

def get_interview_tips(category):
    """Wrapper function for backward compatibility with route files"""
    return _ai_service.get_tips(category)