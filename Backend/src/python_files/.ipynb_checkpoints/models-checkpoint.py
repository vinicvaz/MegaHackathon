import pandas as pd
import numpy as np
import re
import joblib as jb
from scipy.sparse import hstack, csr_matrix
import json

def remove_punct(text):
    text = str(text)
    text  = "".join([char for char in text if char not in string.punctuation])
    text = re.sub('[0-9]+', ' ', text)
    
    return text.lower()

def remove_stops(text):
    clean = [word for word in text.split() if word.lower() not in stopwords.words('portuguese')]
    return ' '.join(clean)


def get_classifier_predictions(product_id,text):
    text_clean = remove_stops(remove_punct(text))
    text_list = [text_clean]
    
    dict_info = {
        'product_id': [product_id],
    }
    numeric = pd.DataFrame(dict_info)

    
    text_vec = vectorizer.transform(text_list)
    stack = hstack([numeric,text_vec])

    p = mdl.predict(stack)
    proba = mdl.predict_proba(stack)[:,1]
    
    print('Previsao:', int(p))
