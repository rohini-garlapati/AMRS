import pypdfium2 as pdfium
import matplotlib.pyplot as plt
from PIL import Image
from io import BytesIO
import pytesseract as tess
from textblob import TextBlob
import string
import re
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize, sent_tokenize
import spacy
import sys
import os
# import docx
from transformers import pipeline

def convert_pdf_to_images(file_path, scale=300/72):
    pdf_file = pdfium.PdfDocument(file_path)  
    page_indices = [i for i in range(len(pdf_file))]
    renderer = pdf_file.render(
        pdfium.PdfBitmap.to_pil,
        page_indices = page_indices, 
        scale = scale,
    )
    
    list_final_images = [] 
    
    for i, image in zip(page_indices, renderer):
        image_byte_array = BytesIO()
        image.save(image_byte_array, format='jpeg', optimize=True)
        image_byte_array = image_byte_array.getvalue()
        list_final_images.append(dict({i:image_byte_array}))
    
    return list_final_images

def display_images(list_dict_final_images):
    all_images = [list(data.values())[0] for data in list_dict_final_images]
    for index, image_bytes in enumerate(all_images):
        image = Image.open(BytesIO(image_bytes))
        figure = plt.figure(figsize = (image.width / 100, image.height / 100))
        plt.title(f"----- Page Number {index+1} -----")
        plt.imshow(image)
        plt.axis("off")
        plt.show()

def extract_text_with_pytesseract(list_dict_final_images):
    image_list = [list(data.values())[0] for data in list_dict_final_images]
    image_content = []
    for index, image_bytes in enumerate(image_list):
        image = Image.open(BytesIO(image_bytes))
        raw_text = str(tess.image_to_string(image))
        image_content.append(raw_text)
    return "\n".join(image_content)

def extract_text_from_txt(file_path):
    with open(file_path, 'r') as file:
        return file.read()

# def extract_text_from_doc(file_path):
#     doc = docx.Document(file_path)
#     full_text = []
#     for para in doc.paragraphs:
#         full_text.append(para.text)
#     return '\n'.join(full_text)

def remove_url(text):
    pattern = re.compile(r'https?://\S+|www\.\S+')
    return pattern.sub(r'', text)

def remove_headers_footers(text):
    text = re.sub(r'Page \d+ of \d+', '', text)
    text = re.sub(r'ABC Hospital\n123 Medical Road\nAnytown, USA', '', text)
    text = re.sub(r'[-]{5,}', '', text)
    return text

def remove_punc(text):
    exclude = string.punctuation
    return text.translate(str.maketrans('', '', exclude))

def remove_stopwords(text):
    text_stwords = []
    for word in text.split():
        if word in stopwords.words('english'):
            text_stwords.append('')
        else:
            text_stwords.append(word)
    x = text_stwords[:]
    text_stwords.clear()
    return " ".join(x)

def text_preprocessing(text_with_pytesseract):
    text_hf = remove_headers_footers(text_with_pytesseract)
    text_lowercase = text_hf.lower()
    text_nourl = remove_url(text_lowercase)
    text_punc = remove_punc(text_nourl)
    text_punc = text_punc.replace('\n', " ")
    text_stwords = remove_stopwords(text_punc)
    textblb = TextBlob(text_stwords)
    text_spellCheck = textblb.correct().string
    return text_spellCheck

def summarizationtxt(text):
    summerizer=pipeline('summarization', model='sshleifer/distilbart-cnn-12-6')
    summarized_text=summerizer(text,max_length=300,min_length=100,do_sample=False)
    return  summarized_text

def summarizationpdf(text):
    summerizer = pipeline('summarization', model='sshleifer/distilbart-cnn-12-6')
    max_chunk_length = 1024
    chunks = [text[i:i + max_chunk_length] for i in range(0, len(text), max_chunk_length)]
    
    summarized_chunks = []
    for chunk in chunks:
        summarized_chunk = summerizer(chunk, max_length=27, min_length=10, do_sample=False)
        summarized_chunks.append(summarized_chunk[0]['summary_text'])
    
    return ' '.join(summarized_chunks)

def main(file_path):
    try:
        tess.pytesseract.tesseract_cmd = r"C:\Users\dhani\AppData\Local\Programs\Tesseract-OCR\tesseract.exe"
        file_extension = os.path.splitext(file_path)[1].lower()
        
        if file_extension == '.pdf':
            list_images = convert_pdf_to_images(file_path)
            extracted_text = extract_text_with_pytesseract(list_images)
            preprocessed_text= text_preprocessing(extracted_text)
            print(summarizationpdf(preprocessed_text))
        elif file_extension == '.txt':
            preprocessed_text = extract_text_from_txt(file_path)
            print(summarizationtxt(preprocessed_text))
        # elif file_extension == '.doc' or file_extension == '.docx':
        #     extracted_text = extract_text_from_doc(file_path)
        else:
            print("Unsupported file format.")
            sys.exit(1)
        
        
        
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python python.py <file_path>")
        sys.exit(1)
    
    file_path = sys.argv[1]
    main(file_path)
