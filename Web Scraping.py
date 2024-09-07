import requests
from bs4 import BeautifulSoup
import csv
import time
import random

user_agents = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3", 
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:55.0) Gecko/20100101 Firefox/55.0",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.0 Mobile/14E304 Safari/602.1"]

with open('agents.csv', 'w', newline='') as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(['Agent Name', 'Agent Number'])

for i in range(1,99):
        url = f'https://www.realtor.com/realestateagents/fort-collins_co/pg-{i}'
        r = requests.get(url , headers={'User-Agent' : random.choice(user_agents)})
        soup = BeautifulSoup(r.content, 'html.parser')

        names = soup.findAll('div', class_="jsx-3873707352 agent-name d-flex")
        number = soup.findAll('div', class_="jsx-3873707352 agent-phone hidden-xs hidden-xxs")
        
        if not names or not number:
                break
        
        with open('agents.csv', 'a', newline='') as csvfile:
                writer = csv.writer(csvfile)

                for name,number in zip(names, number):
                        agent_name = name.get_text().strip()
                        agent_number = number.get_text().strip()

                        writer.writerow([agent_name, agent_number])
        time.sleep(random.uniform(3,7))