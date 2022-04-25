import time
import xlsxwriter
import psycopg2
import json
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager


# Function that connects to database.
def connect():
    global conn
    global cur
    """ Connect to the PostgreSQL database server """
    try:
        # connect to the PostgreSQL server
        print('Connecting to the PostgreSQL database...')
        # Opens up database connection.
        conn = psycopg2.connect(
            user='',
            host='',
            database='',
            password='',)

        # create a cursor
        cur = conn.cursor()

      # execute a statement
        print('PostgreSQL database version:')
        cur.execute('SELECT version()')

        # display the PostgreSQL database server version
        db_version = cur.fetchone()
        print(db_version)

    except (Exception, psycopg2.DatabaseError) as error:
        print(error)


# Function that waits for the AJAX call to complete.
def ajax_complete(driver):
    try:
        return 0 == driver.execute_script("return jQuery.active")
    except:
        pass


connect()

data = {
    "id": "dateoccasion",
    "name": "dateOccasion",
    "type": "list",
    "occurrences": [],
    "sensitive": False,
    "fuzzy": 0.65,
    "examples": [],
    "pattern": ""
}

cur.execute("SELECT * FROM IMPORTANT_DATES")

rows = cur.fetchall()

for r in rows:
    data["occurrences"].append({"name": r[0], "synonyms": []})
    # print(r[0])

# print(data)


json_string = json.dumps(data)
# Using a JSON string
with open('dateoccasion.json', 'w') as outfile:
    outfile.write(json_string)

conn.close()
cur.close()
