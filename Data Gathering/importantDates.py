import time
import xlsxwriter
import psycopg2
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
            host="",
            database="",
            user="",
            password="")

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


def saveList(list):
    for l in list:
        # print(l.get_attribute("innerHTML"))

        tdList = l.find_elements(By.TAG_NAME, "td")

        occasion = tdList[0].get_attribute("innerHTML")
        session = tdList[1].get_attribute("innerHTML")
        stakeholderType = tdList[2].get_attribute("innerHTML")
        date = tdList[3].get_attribute("innerHTML")
        print(occasion + " \t " + session + " \t " +
              stakeholderType + " \t " + date + " \n")

        # Preparing SQL queries to INSERT a record into the database.
        print("Posting!!\n")
        postgres_insert_query = """INSERT INTO IMPORTANT_DATES VALUES (%s,%s,%s,%s)"""
        record_to_insert = (str(occasion), str(session),
                            str(stakeholderType), str(date))
        cur.execute(postgres_insert_query, record_to_insert)


# Functions that grabs correct elements from the dynamic web-page.
def pullData(url):

    driver = webdriver.Chrome(ChromeDriverManager().install())
    driver.get(url)
    time.sleep(2)

    div = driver.find_element(By.ID, "fall-winter")
    list = div.find_element(
        By.TAG_NAME, "tbody").find_elements(By.TAG_NAME, "tr")

    saveList(list)

    div = driver.find_element(By.ID, "spring")
    list = div.find_element(
        By.TAG_NAME, "tbody").find_elements(By.TAG_NAME, "tr")

    saveList(list)

    div = driver.find_element(By.ID, "summer")
    list = div.find_element(
        By.TAG_NAME, "tbody").find_elements(By.TAG_NAME, "tr")

    saveList(list)

    conn.commit()


connect()

url = "https://brocku.ca/important-dates/"
pullData(url)

conn.close()
cur.close()
