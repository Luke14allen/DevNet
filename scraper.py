import requests
from bs4 import BeautifulSoup
import json
import csv
import re

url = 'https://devnetproject.netlify.app/'

url_response = requests.get(url)

# Check's if the request was successful
if url_response.status_code == 200:
    soup = BeautifulSoup(url_response.text, 'html.parser')

    # Find the tag containing the realtor data
    tag = soup.find('script', string=lambda t: t and 'const realtors =' in t)

    if tag:
        # Extract the JSON data from the script tag
        tag_content = tag.string
        search = re.search(r'const\s+realtors\s*=\s*(\[[\s\S]*?\]);', tag_content)

        if search:
            realtors_group = search.group(1)
            
            try:
                # Use regex to properly format the JSON
                realtors_data = re.sub(r'(\w+):', r'"\1":', realtors_group)

                # Parse the JSON data
                realtors = json.loads(realtors_data)
                
                # Sorts realtors by name alphabeticaly
                realtors_sorted = sorted(realtors, key=lambda x: x['name'])
                
                # Writes to a CSV file
                with open('realtors.csv', 'w', newline='', encoding='utf-8') as csvfile:
                    fieldnames = realtors_sorted[0].keys()
                    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
                    writer.writeheader()
                    for realtor in realtors_sorted:
                        writer.writerow(realtor)
            except json.JSONDecodeError:
                print("Error decoding JSON data")
        else:
            print("could not get data")
    else:
        print("could not get website data")
else:
    print(f"failed to get website data, status code: {url_response.status_code}")