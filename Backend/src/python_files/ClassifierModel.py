import pandas as pd
import re
import joblib as jb
from scipy.sparse import hstack, csr_matrix
import json
import string
from nltk.corpus import stopwords
from string import punctuation
import warnings
warnings.filterwarnings("ignore")
#Parte de Neuro-linguistic programming
import nltk
#nltk.download('punkt') talvez precise dessa linha
from nltk.stem.lancaster import LancasterStemmer
stemmer = LancasterStemmer()

#Parte do Tensorflow
import numpy
import tflearn
import tensorflow
import random

#Parte dos intents do chat-bot
import json
import pickle
import warnings
warnings.filterwarnings("ignore")

'''
To run this class do:
pip install -r requirements.txt

'''


class ClassifierModel:

    def __init__(self, path):

        self.path = path
        #self.random_forest = jb.load(path+"/models/random_forest_20200504.pkl.z")
        self.lgbm = jb.load(path+'/models/lgbm_20200504.pkl.z')
        self.vectorizer = jb.load(path+'/models/questions_vectorizer_20200504.pkl.z')


        print('Model loading')

        with open(self.path+"/intents.json") as file:
            print('Loading intents')
            self.data = json.load(file)

        try:
            with open(self.path+"/data.pickle", "rb") as f:
                print('Opening data file')
                self.words, self.labels, self.training, self.output = pickle.load(f)
        except:
            print('Error loading data file')

        net = tflearn.input_data(shape=[None, len(self.training[0])])
        net = tflearn.fully_connected(net, 8)
        net = tflearn.fully_connected(net, 8)
        net = tflearn.fully_connected(net, len(self.output[0]), activation="softmax")
        net = tflearn.regression(net)

        self.model = tflearn.DNN(net)

        try:
            self.model.load(self.path+"/model.tflearn")
            print('Model loaded')
        except:
            print('Cant find model file')


    def _remove_punct(self,text):
        text = str(text)
        text  = "".join([char for char in text if char not in string.punctuation])
        text = re.sub('[0-9]+', ' ', text)

        return text.lower()

    def _remove_stops(self,text):
        clean = [word for word in text.split() if word.lower() not in stopwords.words('portuguese')]
        return ' '.join(clean)

    def _get_predictions(self,data):
        text = data

        text_clean = self._remove_stops(self._remove_punct(text))
        text_list = [text_clean]

        #numeric = pd.DataFrame({'product_id': [data['product_id']]})

        text_vec = self.vectorizer.transform(text_list)
        stack = hstack([text_vec])

        p = self.lgbm.predict(stack)
        proba = self.lgbm.predict_proba(stack)[:,1]

        return int(p)

    def _bag_of_words(self,s, words):
        bag = [0 for _ in range(len(words))]

        s_words = nltk.word_tokenize(s)
        s_words = [stemmer.stem(word.lower()) for word in s_words]

        for se in s_words:
            for i, w in enumerate(words):
                if w == se:
                    bag[i] = 1
        return numpy.array(bag)


    def _get_tag_context(self,data):
        product_id = data['product_id']
        question = data['question']

        results = self.model.predict([self._bag_of_words(question, self.words)])
        results_index = numpy.argmax(results)
        tag = self.labels[results_index]

        for tg in self.data["intents"]:
            if tg['tag'] == tag:
                responses = tg['responses']

        return random.choice(responses)



    def run_models(self, data):
        # print(data)

        data_converted = {
            "product_id": int(data['product_id']),
            "question": data['question']
        }
        # print(data_converted)


        classification = self._get_predictions(data_converted['question'])
        # print("classification:", classification)

        if classification==1:
            question_return = {
                "product_id": data['product_id'],
                "question": data['question'],
                "status": 'waiting', # new, manual, automatic, waiting, deleted
                "answer": None,
                "is_good": 1,
                "tag": None
            }
            # print(question_return)
            return question_return

        else:
            tag = self._get_tag_context(data)
            question_return = {
                "product_id": data['product_id'],
                "question": data['question'],
                "status": "automatic",
                "answer": None,
                "is_good": 0,
                "tag": tag
            }
            # print(question_return)
            return question_return



if __name__ == '__main__':
    model = ClassifierModel('.')
    while True:


        x = input('Digite a pergunta a simular: ')

        data = {
            "product_id": 4,
            "question": x
        }

        result = model.run_models(data)

        print(result)

