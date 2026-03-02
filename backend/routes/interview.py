from flask import Blueprint, request, jsonify
from models import db, Interview, Question
from routes.auth import token_required
from datetime import datetime

bp = Blueprint('interview', __name__, url_prefix='/api/interviews')

@bp.route('', methods=['GET'])
@token_required
def get_interviews(current_user):
    interviews = Interview.query.filter_by(user_id=current_user.id).order_by(Interview.created_at.desc()).all()
    return jsonify({'interviews': [i.to_dict() for i in interviews]}), 200

@bp.route('/<int:interview_id>', methods=['GET'])
@token_required
def get_interview(current_user, interview_id):
    interview = Interview.query.filter_by(id=interview_id, user_id=current_user.id).first()
    
    if not interview:
        return jsonify({'error': 'Interview not found'}), 404
    
    interview_dict = interview.to_dict()
    interview_dict['questions'] = [
        {
            **q.to_dict(),
            'answers': [a.to_dict() for a in q.answers]
        }
        for q in interview.questions
    ]
    
    return jsonify({'interview': interview_dict}), 200

@bp.route('', methods=['POST'])
@token_required
def create_interview(current_user):
    data = request.get_json()
    
    if not data or not data.get('title') or not data.get('category') or not data.get('difficulty'):
        return jsonify({'error': 'Missing required fields'}), 400
    
    interview = Interview(
        user_id=current_user.id,
        title=data['title'],
        category=data['category'],
        difficulty=data['difficulty']
    )
    
    db.session.add(interview)
    db.session.commit()
    
    return jsonify({
        'message': 'Interview created successfully',
        'interview': interview.to_dict()
    }), 201

@bp.route('/<int:interview_id>', methods=['PUT'])
@token_required
def update_interview(current_user, interview_id):
    interview = Interview.query.filter_by(id=interview_id, user_id=current_user.id).first()
    
    if not interview:
        return jsonify({'error': 'Interview not found'}), 404
    
    data = request.get_json()
    
    if 'status' in data:
        interview.status = data['status']
        if data['status'] == 'completed':
            interview.completed_at = datetime.utcnow()
    
    if 'score' in data:
        interview.score = data['score']
    
    db.session.commit()
    
    return jsonify({
        'message': 'Interview updated successfully',
        'interview': interview.to_dict()
    }), 200

@bp.route('/<int:interview_id>', methods=['DELETE'])
@token_required
def delete_interview(current_user, interview_id):
    interview = Interview.query.filter_by(id=interview_id, user_id=current_user.id).first()
    
    if not interview:
        return jsonify({'error': 'Interview not found'}), 404
    
    db.session.delete(interview)
    db.session.commit()
    
    return jsonify({'message': 'Interview deleted successfully'}), 200
