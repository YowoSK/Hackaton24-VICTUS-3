import os

import pdfplumber
from openai import OpenAI


def extract_text_from_pdf(file_path):
    text = ""
    try:
        with pdfplumber.open(file_path) as pdf:
            for page in pdf.pages:
                text += page.extract_text()
        print("PDF text extracted successfully!")
    except Exception as e:
        print(f"Error extracting text from PDF: {e}")
    return text


def validate_with_openai(target_text, standard_text, corrections):
    try:
        openai_api_key = os.getenv("OPENAI_API_KEY")
        client = OpenAI(api_key=openai_api_key)

        corrections_text = (
            f"\nHuman corrections:\n{corrections}\n"
            f"The following corrections must be implemented and reflected in the response. "
            f"Failure to address these will result in rejection."
            if corrections else ""
        )
        prompt = f"""
            You are given two documents:
            
            Standard document:
            {standard_text}
            
            Target document:
            {target_text}
            
            Your task is to validate the target document against the standard document. 
            Identify if the target document aligns with the standard, pointing out any deviations or inconsistencies. 
            {corrections_text}
            """

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": prompt},
            ],
            temperature=0
        )
        response_dict = response.model_dump()
        response_message = response_dict["choices"][0]["message"]["content"]

        return response_message
    except Exception as e:
        print(f"Error with OpenAI validation: {e}")
        return None


def generate_autofill_suggestions(standard_text, target_text):
    try:
        openai_api_key = os.getenv("OPENAI_API_KEY")
        client = OpenAI(api_key=openai_api_key)

        prompt = f"""
            If the target document has incomplete sections compared to the standard document. Based on the content of the standard document, provide autofill suggestions to complete the missing parts in the target document.

            Standard Document:
            {standard_text}

            Target Document:
            {target_text}
            """
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": prompt},
            ],
            temperature=0.7,
        )
        return response.model_dump()["choices"][0]["message"]["content"]
    except Exception as e:
        print(f"Error generating autofill suggestions: {e}")
        return None


def human_review():

    print("\nWould you approve the AI's validation? (yes/no)")
    feedback = input().strip().lower()

    if feedback == 'yes':
        validation_status = "approved"
        corrections = ""
        print("Human feedback: Approved")
    else:
        print("Please provide your corrections or suggestions (type 'none' to skip):")
        corrections = input().strip()

        if corrections.lower() != 'none':
            validation_status = "rejected"
            print(f"Human feedback: Rejected. Corrections: {corrections}")
        else:
            validation_status = "approved"
            print("Human feedback: Approved with no corrections.")

    return validation_status, corrections

def main():
    standard_pdf_path = r"C:\Users\brank\Downloads\Official.pdf"
    target_pdf_path = r"C:\Users\brank\Downloads\2024_Hackathon_LLM DATA Validator.pdf"

    standard_text = extract_text_from_pdf(standard_pdf_path)
    target_text = extract_text_from_pdf(target_pdf_path)

    corrections = None
    while True:
        ai_results = validate_with_openai(target_text, standard_text, corrections)
        print("\nAI Validation Results:")
        print(ai_results)

        autofill_suggestions = generate_autofill_suggestions(standard_text, target_text)
        print("\nAutofill Suggestions:")
        print(autofill_suggestions)

        validation_status, corrections = human_review()

        if validation_status == "approved":
            print("\nDocument validation process completed successfully!")
            break

if __name__ == "__main__":
    main()