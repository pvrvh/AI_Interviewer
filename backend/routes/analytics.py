from flask import Blueprint, request, jsonify
from models import db, Interview, Question, Answer
from routes.auth import token_required
from ai_service import get_interview_tips
from sqlalchemy import func
import json

bp = Blueprint('analytics', __name__, url_prefix='/api/analytics')

@bp.route('/dashboard', methods=['GET'])
@token_required
def get_dashboard(current_user):
    # Get user statistics
    total_interviews = Interview.query.filter_by(user_id=current_user.id).count()
    completed_interviews = Interview.query.filter_by(user_id=current_user.id, status='completed').count()
    
    # Get average score
    avg_score = db.session.query(func.avg(Interview.score)).filter_by(
        user_id=current_user.id,
        status='completed'
    ).scalar() or 0
    
    # Get total questions answered
    total_questions = db.session.query(func.count(Answer.id)).join(
        Question
    ).join(
        Interview
    ).filter(
        Interview.user_id == current_user.id
    ).scalar() or 0
    
    # Get score by category
    category_stats = db.session.query(
        Interview.category,
        func.avg(Interview.score).label('avg_score'),
        func.count(Interview.id).label('count')
    ).filter_by(
        user_id=current_user.id,
        status='completed'
    ).group_by(Interview.category).all()
    
    category_data = [
        {
            'category': stat[0],
            'average_score': round(float(stat[1]) if stat[1] else 0, 2),
            'count': stat[2]
        }
        for stat in category_stats
    ]
    
    # Get recent interviews
    recent_interviews = Interview.query.filter_by(
        user_id=current_user.id
    ).order_by(Interview.created_at.desc()).limit(5).all()
    
    return jsonify({
        'total_interviews': total_interviews,
        'completed_interviews': completed_interviews,
        'average_score': round(float(avg_score), 2),
        'total_questions_answered': total_questions,
        'category_stats': category_data,
        'recent_interviews': [i.to_dict() for i in recent_interviews]
    }), 200

@bp.route('/progress', methods=['GET'])
@token_required
def get_progress(current_user):
    # Get interviews by difficulty
    difficulty_stats = db.session.query(
        Interview.difficulty,
        func.avg(Interview.score).label('avg_score'),
        func.count(Interview.id).label('count')
    ).filter_by(
        user_id=current_user.id,
        status='completed'
    ).group_by(Interview.difficulty).all()
    
    difficulty_data = [
        {
            'difficulty': stat[0],
            'average_score': round(float(stat[1]) if stat[1] else 0, 2),
            'count': stat[2]
        }
        for stat in difficulty_stats
    ]
    
    # Get improvement over time (last 10 completed interviews)
    timeline = Interview.query.filter_by(
        user_id=current_user.id,
        status='completed'
    ).order_by(Interview.completed_at).limit(10).all()
    
    timeline_data = [
        {
            'date': i.completed_at.strftime('%Y-%m-%d') if i.completed_at else '',
            'score': i.score,
            'category': i.category
        }
        for i in timeline
    ]
    
    return jsonify({
        'difficulty_stats': difficulty_data,
        'timeline': timeline_data
    }), 200

@bp.route('/tips/<category>', methods=['GET'])
@token_required
def get_tips(current_user, category):
    tips = get_interview_tips(category)
    
    return jsonify({'tips': tips}), 200

@bp.route('/interview/<int:interview_id>/report', methods=['GET'])
@token_required
def get_interview_report(current_user, interview_id):
    interview = Interview.query.filter_by(id=interview_id, user_id=current_user.id).first()
    
    if not interview:
        return jsonify({'error': 'Interview not found'}), 404
    
    # Get all questions and answers for this interview
    questions_data = []
    total_score = 0
    answered_count = 0
    
    for question in interview.questions:
        q_dict = question.to_dict()
        if question.answers:
            latest_answer = max(question.answers, key=lambda a: a.submitted_at)
            q_dict['answer'] = latest_answer.to_dict()
            total_score += latest_answer.score
            answered_count += 1
        questions_data.append(q_dict)
    
    avg_score = round(total_score / answered_count, 2) if answered_count > 0 else 0
    
    return jsonify({
        'interview': interview.to_dict(),
        'questions': questions_data,
        'summary': {
            'total_questions': len(interview.questions),
            'answered_questions': answered_count,
            'average_score': avg_score
        }
    }), 200
