from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

def build_database_uri():
    # Prefer managed database URL in production.
    database_url = os.getenv('DATABASE_URL')
    if database_url:
        if database_url.startswith('postgres://'):
            database_url = database_url.replace('postgres://', 'postgresql://', 1)
        if database_url.startswith('postgresql://') and '+pg8000' not in database_url:
            database_url = database_url.replace('postgresql://', 'postgresql+pg8000://', 1)
        return database_url

    # Render persistent disk path fallback when no managed DB is configured.
    sqlite_path = os.getenv('SQLITE_PATH', '/var/data/interview_prep.db')
    if os.name == 'nt':
        sqlite_path = os.getenv('SQLITE_PATH', 'interview_prep.db')
    return f"sqlite:///{sqlite_path}"


cors_origins = os.getenv('CORS_ORIGINS', '*')
if cors_origins == '*':
    CORS(app)
else:
    allowed_origins = [origin.strip() for origin in cors_origins.split(',') if origin.strip()]
    CORS(app, resources={r"/api/*": {"origins": allowed_origins}})

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = build_database_uri()
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key')

# Import models first
from models import db, User, Interview, Question, Answer

# Initialize database with app
db.init_app(app)
from routes import auth, interview, question, analytics

# Register blueprints
app.register_blueprint(auth.bp)
app.register_blueprint(interview.bp)
app.register_blueprint(question.bp)
app.register_blueprint(analytics.bp)

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'timestamp': datetime.now().isoformat()})

# Initialize database
with app.app_context():
    db.create_all()

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    debug = os.getenv('FLASK_DEBUG', 'false').lower() == 'true'
    app.run(debug=debug, host='0.0.0.0', port=port)
