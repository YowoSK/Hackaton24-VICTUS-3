# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from werkzeug.utils import secure_filename
import tempfile
from document_validator import extract_text_from_pdf, validate_with_openai, generate_autofill_suggestions
import openai

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = tempfile.gettempdir()
ALLOWED_EXTENSIONS = {'pdf'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
#app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024

def allowed_file(filename):
    """
    Check if a file is allowed based on its extension.
    
    Args:
        filename (str): The name of the file.
    
    Returns:
        bool: True if the file is allowed, False otherwise.
    """
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/api/validate', methods=['POST'])
def validate_documents():
    """
    Validate documents by extracting text and using OpenAI for validation and autofill suggestions.
    
    Returns:
        json: Validation results and autofill suggestions.
    """
    try:

        template_file = request.files['templateFile']
        filled_file = request.files['filledFile']

        template_filename = secure_filename(template_file.filename)
        filled_filename = secure_filename(filled_file.filename)

        template_path = os.path.join(app.config['UPLOAD_FOLDER'], template_filename)
        filled_path = os.path.join(app.config['UPLOAD_FOLDER'], filled_filename)

        template_file.save(template_path)
        filled_file.save(filled_path)

        # Extract text from PDFs
        template_text = extract_text_from_pdf(template_path)
        target_text = extract_text_from_pdf(filled_path)

        # Get prompt from request if provided
        prompt = request.form.get('prompt', '')

        # Perform validation
        validation_results = validate_with_openai(target_text, template_text, None)
        autofill_suggestions = generate_autofill_suggestions(template_text, target_text)

        # Clean up temporary files
        os.remove(template_path)
        os.remove(filled_path)

        return jsonify({
            'validation_results': validation_results,
            'autofill_suggestions': autofill_suggestions,
            'status': 'success'
        })

    except Exception as e:
        # Clean up files in case of error
        try:
            if 'template_path' in locals(): os.remove(template_path)
            if 'filled_path' in locals(): os.remove(filled_path)
        except:
            pass
        return jsonify({'error': str(e)}), 500

@app.route('/api/generate', methods=['POST'])
def generate_text():
    """
    Generate text using OpenAI's language model.
    
    Returns:
        json: Generated text.
    """
    try:
        data = request.get_json()
        prompt = data.get('prompt', '')

        openai_api_key = os.getenv("OPENAI_API_KEY")
        if not openai_api_key:
            raise ValueError("OpenAI API key not found in environment variables.")

        openai.api_key = openai_api_key

        response = openai.Completion.create(
            engine="text-davinci-003",
            prompt=prompt,
            max_tokens=150,
            n=1,
            stop=None,
            temperature=0.7,
        )

        generated_text = response.choices[0].text.strip()

        return jsonify({
            'generated_text': generated_text,
            'status': 'success'
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=3001, debug=True)
