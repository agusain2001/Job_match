import docx
import io

def extract_text_from_docx(file_content: bytes) -> str:
    try:
        doc = docx.Document(io.BytesIO(file_content))
        text = ""
        for para in doc.paragraphs:
            text += para.text + "\n"
        return text
    except Exception as e:
        print(f"Error reading DOCX: {e}")
        return ""
