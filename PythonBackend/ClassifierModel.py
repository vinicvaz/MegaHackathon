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
import Read_Database
from Read_Database import * 
import time


'''
To run this class do:
pip install -r requirements.txt

'''


class ClassifierModel:

    def __init__(self):

        
        #self.random_forest = jb.load(path+"/models/random_forest_20200504.pkl.z")
        self.lgbm = jb.load('./models/lgbm_20200504.pkl.z')
        self.vectorizer = jb.load('./models/questions_vectorizer_20200504.pkl.z')
        self.db = Read_Database()

        print('Model loading')

        with open("intents.json") as file:
            print('Loading intents')
            self.data = json.load(file)

        try:
            with open("./models/data.pickle", "rb") as f:
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
            self.model.load("./models/model.tflearn")
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



    def _run_models(self, data):

        data_converted = {
            "product_id": int(data['product_id']),
            "question": data['question']
        }
        # print(data_converted)


        classification = self._get_predictions(data_converted['question'])
        # print("classification:", classification)

        if classification==1:
            question_return = {
                "question_id": data['question_id'],
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
                "question_id": data['question_id'],
                "product_id": data['product_id'],
                "question": data['question'],
                "status": "automatic",
                "answer": None,
                "is_good": 0,
                "tag": tag
            }
            
            return question_return
    
    def _update_processed_questions(self, data):

        status = data['status']
        is_good = data['is_good']
        answer = data['answer']
        question_id = data['question_id']

        query_data = (status, is_good, answer, question_id)
        query = """Update questions set status = ?, is_good = ?, answer = ? where id = ?"""

        cur = self.db.conn.cursor()

        cur.execute(query, query_data)
        self.db.conn.commit()
        
        cur.close()

    def _verify_processed_questions(self, data):
        
        if data['is_good']==1:
            self.update_processed_questions(data)
        else:
            tag = data['tag']
            product_id = data['product_id']
            
            answer = self._create_answer(tag,product_id)
            data['answer'] = answer

            self._update_processed_questions(data)
            



    def _create_answer(self, tag, product_id):
        
        if (tag == "frete"):
            answer="Todos os fretes são calculados automaticamente via plataforma. Qualquer outra dúvida estamos à disposição!";
            return answer
        elif (tag=='valor'):
            query = """select price from products where id=?"""
            cur = self.db.conn.cursor()
            value = cur.execute(query, (product_id,))
            value = cur.fetchall()[0][0]
            cur.close()

            answer = "O preço da unidade deste produto é de {}. Qualquer dúvida estamos à disposição!".format(value)
            return answer
        elif (tag=='pagamento'):
            answer = "Olá. Aceitamos todos os pagamentos via plataforma"
        elif (tag=='tamanho'):
            query = """select width, height, lenght from products where id=?"""
            cur = self.db.conn.cursor()
            value = cur.execute(query, (product_id,))
            value = cur.fetchall()
            cur.close()
            width, height, lenght = value[0][0], value[0][1], value[0][2]
            answer = "As dimensões do produto são: largura: {}, altura: {}, comprimento: {}. Qualquer outra dúvida estamos à disposição!".format(width, height, lenght)
            return answer
        elif (tag=='peso'):
            query = """select weight from products where id=?"""
            cur = self.db.conn.cursor()
            value = cur.execute(query, (product_id,))
            value = cur.fetchall()[0][0]
            cur.close()

            answer = "O peso do produto é {} kg".format(value)
            return answer
        elif (tag=='cor'):
            query = """select color from products where id=?"""
            cur = self.db.conn.cursor()
            value = cur.execute(query, (product_id,))
            value = cur.fetchall()[0][0].split()
            
            if len(value)==1:
                answer = "Temos disponivel apenas na cor {}.".format(value[0])    
            else:
                answer = "Temos disponivel nas cores "
                for e in value:
                    answer = answer+e+" "
                answer = answer.strip()+'. Qualquer dúvida estamos a disposição!'
            return answer

        
        elif (tag=='estoque'):
            query = """select quantity from products where id=?"""
            cur = self.db.conn.cursor()
            value = cur.execute(query, (product_id,))
            value = cur.fetchall()[0][0]

            if value==1:
                answer = "Temos apenas uma unidade disponível, aproveite. Qualquer outra dúvida estamos à disposição!"
            else:
                answer = "Temos {} unidades disponíveis. Qualquer outra dúvida estamos à disposição!".format(value)
            return answer

            
            
        
        
        



if __name__ == '__main__':
    model = ClassifierModel()

    while True:
        questions = model.db.select_new_questions()



        for question in questions:
            data_dict = {
                "question_id": question[0],
                "product_id": question[6],
                "question": question[2]
            }

            response = model._run_models(data_dict)
            model._verify_processed_questions(response)
        print('Answers Updated, sleeping for 2 seconds')
        time.sleep(2)

        


        



