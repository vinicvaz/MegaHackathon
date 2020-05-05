driver = webdriver.Chrome('/home/vinicius/Downloads/chromedriver_linux64/chromedriver')
## Get HTML pages with bs4 and selenium (use selenium to expand the button)
for i,link in enumerate(links):
    urll = link
    driver.get(urll)
    response = rq.get(urll)
    status = response.status_code
    print(status)
    if status != 200:
        print('Erro de requisição')
        while status!=200:
            print('erro de status')
            driver.get(urll)
            response = rq.get(urll)
            status = response.status_code
            time.sleep(4)
    else:
        
        ## Click on button
        try:
            driver.find_element_by_xpath('//*[@id="root-app"]/div/div[2]/div[3]/div[1]/div[2]/div/div/div[3]/span/p').click()
            soup = BeautifulSoup(driver.page_source,"lxml")
            print("Catch")
            with open("./raw_data_products/product_{}.html".format(i),'w+') as output:
                output.write(soup.decode())
        except Exception:
            print('Not catch')
            with open("./raw_data_products/product_{}.html".format(i),'w+') as output:
                output.write(soup.decode())
    
    print(i)
driver.close()