import requests
import psycopg2
from bs4 import BeautifulSoup

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


programs = ["ACTG", "AHSC", "APCO", "BCHM", "BIOL", "BTEC", "CANA", "CHEM", "CHYS", "CLAS", "COMM", "COSC", "CRIM", "ECON",  "EDUC", "ENGL", "ENTR", "ERSC", "ETHC", "FILM", "FNCE", "FREN", "GEOG", "GREE", "HIST", "HLSC", "IASC", "ITAL", "ITIS", "KINE", "LABR", "LATI", "LING", "MACC", "MARS", "MATH", "MBAB", "MGMT", "MKTG", "MPAC", "MPHA", "MUSI", "NEUR", "NUSC", "OBHR", "OEVI", "OPER", "PCUL", "PHIL", "PHYS", "POLI", "PSYC", "RECL", "SCIE", "SOCI", "SPMA", "STAC", "STAT", "WGST"] 
url = "https://brocku.ca/guides-and-timetables/wp-content/plugins/brocku-plugin-course-tables/ajax.php"


for program in programs:
    payload={'action': 'get_programexams',
    'session': 'fw',
    'type': 'ex',
    'level': 'all',
    'program': program,
    'year': '2021',
    'period': 'April'}
    files=[

    ]
    headers = {}

    response = requests.request("POST", url, headers=headers, data=payload, files=files)

    soup = htmlParse = BeautifulSoup(response.text, 'html.parser')

    tags = soup.find_all(class_="exam-row normal")

    for item in tags:
        code = item.find(class_="course-code").text
        duration = item.find(class_="duration").text
        sectionId =  item.find(class_="section").text
        startDay = item.find(class_="day").text
        startTime = item.find(class_="start").text
        endTime = item.find(class_="end").text
        loc = item.find(class_="location").text
        
        postgres_insert_query = """INSERT INTO EXAMS VALUES (%s,%s,%s,%s,%s,%s,%s)"""
        record_to_insert = (code, duration, sectionId, startDay,startTime,endTime,loc)
        cur.execute(postgres_insert_query, record_to_insert)


conn.commit()
conn.close()
