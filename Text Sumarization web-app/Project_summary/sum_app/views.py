from django.shortcuts import render
import pdfplumber
import spacy
from spacy.lang.en.stop_words import STOP_WORDS
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.probability import FreqDist
from nltk.tokenize import sent_tokenize
from sklearn.feature_extraction.text import TfidfVectorizer
import re
from googletrans import Translator

nlp = spacy.load("en_core_web_sm")
stop_words = set(stopwords.words('english'))

def extract_text_from_pdf(uploaded_file):
    pdf_text = ''
    with pdfplumber.open(uploaded_file) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            # Remove CID identifiers from the page text
            page_text_cleaned = re.sub(r'\(cid:\d+\)', '', page_text)
            pdf_text += page_text_cleaned
    return pdf_text

def translate_text(text, source_lang, target_lang):
    if not text:
        return ''

    translator = Translator()
    translated_text = translator.translate(text, src=source_lang, dest=target_lang).text
    return translated_text

def process_text(text, summary_length=100):
    # Tokenize the text into words
    words = word_tokenize(text.lower())

    # Remove stopwords
    filtered_words = [word for word in words if word not in stop_words]

    # Remove special characters and unwanted symbols
    filtered_words = [re.sub(r'[^a-zA-Z0-9\s]', '', word) for word in filtered_words]

    # Calculate word frequency
    word_freq = FreqDist(filtered_words)

    # Generate summary (limit to summary_length characters)
    summary = ' '.join(word for word, _ in word_freq.most_common(summary_length))

    # Extract keywords using TF-IDF
    tfidf_vectorizer = TfidfVectorizer(stop_words='english')
    tfidf_matrix = tfidf_vectorizer.fit_transform([text])
    feature_names = tfidf_vectorizer.get_feature_names_out()
    tfidf_scores = tfidf_matrix.toarray()[0]
    keywords = [(feature_names[i], tfidf_scores[i]) for i in tfidf_scores.argsort()[::-1][:5]]

    return summary, keywords
def index(request):
    if request.method == 'POST' and request.FILES['customFile']:
        # Get the uploaded PDF file
        uploaded_file = request.FILES['customFile']

        # Step 1: Extract text from the PDF file
        pdf_text = extract_text_from_pdf(uploaded_file)

        # Step 2: Translate the extracted text to English
        translated_text = translate_text(pdf_text, 'mr', 'en')

        # Step 3: Process the translated text (tokenization, remove stopwords, remove special characters, generate summary)
        summary, keywords = process_text(translated_text)

        # Step 4: Translate the summary back to Marathi
        translator = Translator()
        translated_summary = translator.translate(summary, src='en', dest='en').text

        # Render the template with the extracted text, summary, translated summary, and keywords
        return render(request, 'index.html', {'extracted_text': translated_text, 'summary': summary, 'translated_summary': translated_summary, 'keywords': keywords})

    return render(request, 'index.html')
