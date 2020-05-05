# -*- coding: utf-8 -*-
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
warnings.filterwarnings('ignore')

from tensorflow.python.util import deprecation
deprecation._PRINT_DEPRECATION_WARNINGS = False

with open("../json_files/intents.json") as file:
    data = json.load(file)

#caso já tenha treinado é só abrir
try:
    with open("data.pickle", "rb") as f:
        print('Opening data file')
        words, labels, training, output = pickle.load(f)
#do contrário, treina
except:
    words = []
    labels = []
    docs_x = []
    docs_y = []
    
    #Passando por cada sentença dos intents patterns
    for intent in data["intents"]:
        for pattern in intent["patterns"]:
            #Transforma cada palavra da sentença em um token e adiciona na lista de palavras
            wrds = nltk.word_tokenize(pattern)
            words.extend(wrds)
            docs_x.append(wrds)
            docs_y.append(intent["tag"])

        if intent["tag"] not in labels:
            labels.append(intent["tag"])
            
    #Ignora '?' e palavras repetidas
    words = [stemmer.stem(w.lower()) for w in words if w != "?"]
    words = sorted(list(set(words)))

    labels = sorted(labels)

    #Cria os dados de treinamento e a saída
    training = []
    output = []

    out_empty = [0 for _ in range(len(labels))]
    
    #Set de treinamento e bag de words pra cada sentença
    for x, doc in enumerate(docs_x):
        bag = []
        
        #Relaciona as palavras
        wrds = [stemmer.stem(w.lower()) for w in doc]

        for w in words:
            if w in wrds:
                bag.append(1)
            else:
                bag.append(0)
                
        #Saída é '1' para a tag atual e '0' para cada tag
        output_row = out_empty[:]
        output_row[labels.index(docs_y[x])] = 1

        training.append(bag)
        output.append(output_row)

    #Converte pra np.array
    training = numpy.array(training)
    output = numpy.array(output)

    with open("data.pickle", "wb") as f:
        pickle.dump((words, labels, training, output), f)

tensorflow.reset_default_graph()

#Cria a rede neural
net = tflearn.input_data(shape=[None, len(training[0])])
net = tflearn.fully_connected(net, 8)
net = tflearn.fully_connected(net, 8)
net = tflearn.fully_connected(net, len(output[0]), activation="softmax")
net = tflearn.regression(net)

model = tflearn.DNN(net)

#Caso já tenha um modelo carrega
'''
try:
    print('Model loaded')
    model.load("model.tflearn")
#Senão define o modelo e configura a tensorboard
except:
    '''
model.fit(training, output, n_epoch=1000, batch_size=8, show_metric=True)
model.save("model.tflearn")

#Retorna a bag de palabras com 0 ou 1 pra cada palavra na bag que exita na sentença
def bag_of_words(s, words):
    bag = [0 for _ in range(len(words))]

    s_words = nltk.word_tokenize(s)
    s_words = [stemmer.stem(word.lower()) for word in s_words]

    for se in s_words:
        for i, w in enumerate(words):
            if w == se:
                bag[i] = 1
            
    return numpy.array(bag)

#chat de teste com o bot
def chat():
    print("Start talking with the bot (type quit to stop)!")
    while True:
        inp = input("You: ")
        if inp.lower() == "quit":
            break

        results = model.predict([bag_of_words(inp, words)])
        results_index = numpy.argmax(results)
        tag = labels[results_index]

        for tg in data["intents"]:
            if tg['tag'] == tag:
                responses = tg['responses']

        print(random.choice(responses))
        
#Executa o chat de teste até usar 'quit' para parar
chat()
