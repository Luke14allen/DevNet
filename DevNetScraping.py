import requests
from bs4 import BeautifulSoup
import csv





r = requests.get("https://devnetproject.netlify.app/")

print(r)

soup = BeautifulSoup(r.content, 'html.parser')

s = soup.find('script')

script_tag = soup.find('script', string=lambda t: t and 'const realtors =' in t)

raw_data = [p.get_text() for p in soup.find_all('p')]

# Clean data
cleaned_data = [text.strip().replace('\n', ' ') for text in raw_data if text.strip()]



with open("agents_info.csv","w",newline='')as csvfile:
    writer = csv.writer(csvfile)
    writer.writerow(["name", "phone", 'Email'])
    writer.writerows(script_tag)

print("printed info onto agents_info.csv")

