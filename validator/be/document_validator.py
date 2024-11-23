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


def validate_with_openai(text, standards):
    try:
        openai_api_key = os.getenv("OPENAI_API_KEY")
        client = OpenAI(api_key=openai_api_key)
        prompt = f"""
            Analyze the following document and check if it meets these standards:
            {standards}

            Document content:
            {text}
            """
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": prompt},
            ],
            #max_tokens=500,
        )


        return response['choices'][0]['text']
    except Exception as e:
        print(f"Error with OpenAI validation: {e}")
        return None


def main():
    pdf_path = ""

    standards = {
        "Introduction": "Must describe the purpose.",
        "Conclusion": "Should summarize the findings.",
        "References": "Include citations."
    }

    text = extract_text_from_pdf(pdf_path)

    ai_results = validate_with_openai(text, standards)
    print("\nAI Validation Results:")
    print(ai_results)

if __name__ == "__main__":
    main()