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


# Functions that grabs correct elements from the dynamic web-page.
def pullData(url):
 
  driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))
  driver.get(url)

  list = driver.find_elements(By.CLASS_NAME, "course-row")

  # Open up all the rows in the system. 
  for l in list:    
    print(l.find_element(By.CLASS_NAME, "course-code").text)

    try:
     l.click()
     ajax_complete(driver)
     time.sleep(2)
    
    except:
      driver.close()
      pullData(url)
      return;
    
  
  # Loop through data and make database calls.
  list = driver.find_elements(By.CLASS_NAME, "course-row")


  for l in list:

    # Grabs inital information from each of the rows in the table.
    courseCode = l.find_element(By.CLASS_NAME, "course-code").text
    courseName = l.find_element(By.CLASS_NAME, "title").text
    duration = l.find_element(By.CLASS_NAME, "duration").text
    days = l.find_element(By.CLASS_NAME, "days").text
    times = l.find_element(By.CLASS_NAME, "time").text
    classType = l.find_element(By.CLASS_NAME, "type").text
    
    format = 'No Format Found'
    prerequisites = 'No Prerequisites Found'
    restrictions = 'No Restrictions Found'
    exclusions = 'No Exclusions Found'
    notes = 'No Notes Found'
    instructor = ''
    fullDuration = ''
    courseDays = ''
    location = ''
    description = ''

    # Grabs remaining details within the left side of drop-down. 
    try:
      left = l.find_element(By.CLASS_NAME, 'description')

      try:
        description = l.find_element(By.CLASS_NAME, 'page-intro').text
      except:
        print('No Description Found')

      try:
        formatTitle = left.find_element(By.XPATH,"..//strong[contains(text(),'Format:')]")
        formatInfo = formatTitle.find_element(By.XPATH, "..");
        format = formatInfo.text
      except:
        print('No Format Found')
      
      try:
        restrictionsTitle = left.find_element(By.XPATH,"..//strong[contains(text(),'Restrictions:')]")
        restrictionsInfo = restrictionsTitle.find_element(By.XPATH, "./..");
        restrictions = restrictionsInfo.text
      except:
        print('No Restrictions Found')

      try:
        exclusionsTitle = left.find_element(By.XPATH,"..//strong[contains(text(),'Exclusions:')]")
        exclusionsInfo = exclusionsTitle.find_element(By.XPATH, "./..");
        exclusions = exclusionsInfo.text
      except:
        print('No Exclusions Found')

      try:
        notesTitle = left.find_element(By.XPATH,"..//strong[contains(text(),'Notes:')]")
        notesInfo = notesTitle.find_element(By.XPATH, "./..");
        notes = notesInfo.text
      except:
        print('No Notes Found')

      try:
        prerequisitesTitle = left.find_element(By.XPATH,"..//strong[contains(text(),'Prerequisites:')]")
        prerequisitesInfo = prerequisitesTitle.find_element(By.XPATH, "./..");
        prerequisites = prerequisitesInfo.text
      except:
        print('No Prerequisites Found')
    except:
      print('No Description')
      break


    # Grabbing information from right side on drop down. 
    try:
      right = l.find_element(By.CLASS_NAME, 'vitals')

      try:
        coursecal = right.find_element(By.CLASS_NAME, 'coursecal')
        days = coursecal.find_elements(By.TAG_NAME, 'td')

        temp = 0;

        for day in days:
            if day.get_attribute("class") == 'active':
              if temp == 0: courseDays = courseDays + "Sunday, "
              if temp == 1: courseDays = courseDays + "Monday, "
              if temp == 2: courseDays = courseDays + "Tuesday, "
              if temp == 3: courseDays = courseDays + "Wednesday, "
              if temp == 4: courseDays = courseDays + "Thursday, "
              if temp == 5: courseDays = courseDays + "Friday, "
              if temp == 6: courseDays = courseDays + "Saturday, "
            temp = temp + 1
            
      except:
        print('No Days Found')

      try:
        instructorTitle = right.find_element(By.XPATH,"..//strong[contains(text(),'Instructor:')]")
        instructorInfo = instructorTitle.find_element(By.XPATH, "./..");
        instructor = instructorInfo.text
      except:
        print('No Instructor Found')

      try:
        fullDurationTitle = right.find_element(By.XPATH,"..//strong[contains(text(),'Duration:')]")
        fullDurationInfo = fullDurationTitle.find_element(By.XPATH, "./..");
        fullDuration = fullDurationInfo.text
      except:
        print('No Full Duration Found')

      try:
        locationTitle = right.find_element(By.XPATH,"..//strong[contains(text(),'Location:')]")
        locationInfo = locationTitle.find_element(By.XPATH, "./..");
        location = locationInfo.text
      except:
        print('No Location Found')

    except:
      print('No Vital Infomation')
      break


    # Preparing SQL queries to INSERT a record into the database.
    print("Posting!!")
    postgres_insert_query = """INSERT INTO COURSES VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)"""
    record_to_insert = (courseCode, courseName, description, duration,fullDuration,instructor,location,format,restrictions,prerequisites,exclusions,notes,courseDays,times,classType)
    cur.execute(postgres_insert_query, record_to_insert)

  conn.commit()


  
connect();

programDriver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))
programDriver.get('https://brocku.ca/guides-and-timetables/timetables/?session=fw&type=ug&level=all')

# Grabs a list of programs at Brock.
programs = programDriver.find_elements(By.CLASS_NAME, "code")
programDriver.close
counter = 0

for l in programs:
  print("_____________")
  print(counter)
  print(l.text)
  url = "https://brocku.ca/guides-and-timetables/timetables/?session=FW&type=UG&level=All&program=" + l.text
  pullData(url)
  counter = counter + 1

conn.close()
cur.close()