import requests
from bs4 import BeautifulSoup


r = requests.get("https://devnetproject.netlify.app/")

print(r)

soup = BeautifulSoup(r.content, 'html.parser')

s = soup.find('script')

if s == "name:":    
    print[0: 10]
else:
    print("")

print(soup.prettify)