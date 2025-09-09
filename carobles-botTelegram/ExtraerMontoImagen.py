from PIL import Image
from pytesseract import *
import re

pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

def extraerMontoTransferencia(path_imagen):
    try:
        img = Image.open(path_imagen)

        resultado =pytesseract.image_to_string(img)

        patron_numero = r"\$\s*(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2})?|\d+(?:[.,]\d{2})?)"
        extraer_valor_numerico = lambda texto: float(re.search(patron_numero, resultado).group(1)) if re.search(patron_numero, resultado) else None
    
        return extraer_valor_numerico(resultado)
    except:
        return None