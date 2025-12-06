import pypdf
import io

def extract_text_from_pdf(file_content: bytes) -> str:
    try:
        reader = pypdf.PdfReader(io.BytesIO(file_content))
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"
        return text
    except Exception as e:
        print(f"Error reading PDF: {e}")
        return ""
