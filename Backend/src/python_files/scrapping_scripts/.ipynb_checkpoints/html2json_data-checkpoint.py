import pandas as pd
import numpy as np
import time
import re
import json
import requests as rq # http requests
import bs4 as bs4 # beautiful soup for parsing
from bs4 import BeautifulSoup
import tqdm
from os import listdir
from selenium import webdriver
from bs4 import BeautifulSoup


driver = webdriver.Chrome('/home/vinicius/Downloads/chromedriver_linux64/chromedriver')
data_questions = {
    'id': [],
    'product_id': [],
    'questions': [],
    'status': [],
    'answers': [],
    'is_good': [],
}

data_products = {
    "id": [], # primary key
    "name": [], # string
    "quantity": [], #int
    "size": [], #tuple
    "color": [], #list
    "price": [], #float
    "weight": [], #float
    "image": [], #list
    "description": [],
}
question_id = 0


for i,file in enumerate(sorted(listdir(image_source))):
    filename = 'file://{}{}'.format(image_source,file)
    driver.get(filename)
    time.sleep(2)

    try:
        driver.find_element_by_xpath('//*[@id="root-app"]/div/div[2]/div[3]/div[1]/div[2]/div/div/div[3]/span').click()
        soup = BeautifulSoup(driver.page_source,"lxml")
        print("Catch on method 2")
    except Exception:
        print('Not catch on method 1, raising Exception Method')
        try:
            driver.find_element_by_xpath('/html/body/main/div[2]/div[1]/div[1]/section[5]/a').click()
            soup = BeautifulSoup(driver.page_source,"lxml")
            print('Catch on method 2')
        except:
            print('Not found questions button on file {}'.format(filename))
            soup = BeautifulSoup(driver.page_source,"lxml")

    ## Here the page is full loaded
    questions = soup.find_all('p', {'class': 'ui-pdp-color--BLACK ui-pdp-size--SMALL ui-pdp-family--REGULAR ui-pdp-qadb__questions-list__question__label'})
    questions2 = soup.find_all('article', {'class': 'questions__item questions__item--question'})

    answers = soup.find_all('p', {'class': 'ui-pdp-color--BLACK ui-pdp-size--SMALL ui-pdp-family--REGULAR ui-pdp-qadb__questions-list__answer-item__answer'})
    answers2 = soup.find_all('article', {'class': 'questions__item questions__item--answer'})

    product_name = soup.find_all('h1', {'class': 'ui-pdp-title'})
    product_name2 = soup.find_all('header', {'class': 'item-title'})

    description = soup.find_all('li', {'class': 'ui-pdp-features__item'})
    description2 = soup.find_all('div', {'class': 'item-description__text'})

    price = soup.find_all('div', {'class': 'ui-pdp-price mt-16 ui-pdp-price--size-large'})
    price2 = soup.find_all('fieldset', {'class': 'item-price'})

    for e in price:
        price = e.find('span', {'class': 'price-tag-fraction'}).text

    for e in price2:
        cents = e.find('span', {'class':'price-tag-cents'})

        if cents:
            price2 = '{}.{}'.format(e.find('span', {'class':'price-tag-fraction'}).text, e.find('span', {'class':'price-tag-cents'}).text)
        else:
            price2 = '{}'.format(e.find('span', {'class':'price-tag-fraction'}).text)

    for e in product_name2:
        product_name2 = e.find('h1').text.strip()

    description_list = []
    for e in info:
        description_list.append(e.text)
    description = ' '.join(description_list)


    for e in desc:
        description2 = e.text.strip()


    if len(product_name)>0:
        data_products['id'].append(i)
        data_products['name'].append(product_name[0].text)
        data_products['quantity'].append(None) #valor generico
        data_products['size'].append(None)
        data_products['color'].append(None)
        data_products['price'].append(price)
        data_products['weight'].append(None)
        data_products['image'].append(None)
        data_products['description'].append(description)

    elif len(product_name2)>0:
        data_products['id'].append(i)
        data_products['name'].append(product_name2)
        data_products['quantity'].append(None) 
        data_products['size'].append(None)
        data_products['color'].append(None)
        data_products['price'].append(price2)
        data_products['weight'].append(None)
        data_products['image'].append(None)
        data_products['description'].append(description2)



    ## Save Questions Info
    if len(questions)>0 and len(answers)>0:
        print('cai no questions 1')
        for question, answer in zip(questions, answers):
            data_questions['id'].append(question_id)
            data_questions['product_id'].append(i)
            data_questions['questions'].append(question.text)
            data_questions['answers'].append(answer.text)
            data_questions['is_good'].append(np.nan)
            data_questions['status'].append('manual')

            question_id+=1

    elif len(questions2) >0 and len(answers2) > 0:
        print('cai na questions 2')
        for question, answer in zip(questions2,answers2):
            data_questions['id'].append(question_id)
            data_questions['product_id'].append(i)
            data_questions['questions'].append(question.find('p').text)
            data_questions['answers'].append(answer.find('p').text)
            data_questions['is_good'].append(np.nan)
            data_questions['status'].append('manual')

            question_id+=1