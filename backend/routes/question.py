from flask import Blueprint, request, jsonify
from models import db, Question, Answer, Interview
from routes.auth import token_required
from ai_service import generate_interview_questions, evaluate_answer
import json

bp = Blueprint('question', __name__, url_prefix='/api/questions')

@bp.route('/generate', methods=['POST'])
@token_required
def generate_questions(current_user):
    data = request.get_json()
    
    if not data or not data.get('interview_id'):
        return jsonify({'error': 'Missing interview_id'}), 400
    
    interview = Interview.query.filter_by(id=data['interview_id'], user_id=current_user.id).first()
    
    if not interview:
        return jsonify({'error': 'Interview not found'}), 404
    
    count = data.get('count', 5)
    
    # Generate questions using AI
    generated_questions = generate_interview_questions(
        interview.category,
        interview.difficulty,
        count
    )
    
    questions = []
    for q_data in generated_questions:
        question = Question(
            interview_id=interview.id,
            question_text=q_data['question'],
            question_type=q_data['type'],
            difficulty=q_data['difficulty'],
            expected_answer=q_data['expected_answer'],
            hints=json.dumps(q_data['hints'])
        )
        db.session.add(question)
        questions.append(question)
    
    db.session.commit()
    
    return jsonify({
        'message': 'Questions generated successfully',
        'questions': [q.to_dict() for q in questions]
    }), 201

@bp.route('/<int:question_id>', methods=['GET'])
@token_required
def get_question(current_user, question_id):
    question = Question.query.get(question_id)
    
    if not question:
        return jsonify({'error': 'Question not found'}), 404
    
    # Verify user owns the interview
    interview = Interview.query.filter_by(id=question.interview_id, user_id=current_user.id).first()
    if not interview:
        return jsonify({'error': 'Unauthorized'}), 403
    
    question_dict = question.to_dict()
    question_dict['answers'] = [a.to_dict() for a in question.answers]
    
    return jsonify({'question': question_dict}), 200

@bp.route('/<int:question_id>/answer', methods=['POST'])
@token_required
def submit_answer(current_user, question_id):
    question = Question.query.get(question_id)
    
    if not question:
        return jsonify({'error': 'Question not found'}), 404
    
    # Verify user owns the interview
    interview = Interview.query.filter_by(id=question.interview_id, user_id=current_user.id).first()
    if not interview:
        return jsonify({'error': 'Unauthorized'}), 403
    
    data = request.get_json()
    
    if not data or not data.get('answer_text'):
        return jsonify({'error': 'Missing answer text'}), 400
    
    # Evaluate answer using AI
    evaluation = evaluate_answer(
        question_text=question.question_text,
        answer_text=data['answer_text'],
        category=interview.category,
        difficulty=question.difficulty
    )
    
    answer = Answer(
        question_id=question.id,
        answer_text=data['answer_text'],
        score=evaluation['score'],
        feedback=evaluation['feedback'],
        strengths=json.dumps(evaluation['strengths']),
        improvements=json.dumps(evaluation['improvements'])
    )
    
    db.session.add(answer)

    # Recalculate interview score from latest answer per question
    total_score = 0
    answered_count = 0
    for q in interview.questions:
        if q.answers:
            latest_answer = max(q.answers, key=lambda a: a.submitted_at)
            total_score += latest_answer.score or 0
            answered_count += 1

    interview.score = round(total_score / answered_count, 2) if answered_count > 0 else 0

    db.session.commit()
    
    return jsonify({
        'message': 'Answer submitted successfully',
        'answer': answer.to_dict(),
        'evaluation': evaluation
    }), 201

@bp.route('/<int:question_id>/hints', methods=['GET'])
@token_required
def get_hints(current_user, question_id):
    question = Question.query.get(question_id)
    
    if not question:
        return jsonify({'error': 'Question not found'}), 404
    
    # Verify user owns the interview
    interview = Interview.query.filter_by(id=question.interview_id, user_id=current_user.id).first()
    if not interview:
        return jsonify({'error': 'Unauthorized'}), 403
    
    hints = json.loads(question.hints) if question.hints else []
    
    return jsonify({'hints': hints}), 200
