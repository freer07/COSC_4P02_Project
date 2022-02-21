from multiprocessing.dummy import Array
from pickle import TRUE
from bs4 import BeautifulSoup
import requests
import jsonpickle
import random

url = "https://brocku.ca/webcal/2021/undergrad/"
req = requests.get(url)
soup = BeautifulSoup(req.text, "html.parser")

def rreplace(s, old, new):
    return (s[::-1].replace(old[::-1],new[::-1], 1))[::-1]


class qnas:
    def __init__(self, id, answerList, questionsList):
        self.id = id
        self.data = {
            "action": "text",
            "contexts": ["global"],
            "enabled": 'true',
            "answers": answerList,
            "questions": questionsList,
            "redirectFlow": "",
            "redirectNode": ""
        }
        

class qaList:
     def __init__(self, list):
        self.en = list
      

list1 = qaList(["Question 1", "Questions 2"])
list2 = qaList(["Answer 1", "Answer 2"])


entries = [] 


for entry in soup.find_all("a"):
    link = "https://www.brocku.ca" + entry.get('href');

    req = requests.get(link)
    soup = BeautifulSoup(req.text, "html.parser")
    questionsTemp = []

    for entry in soup.find_all(id = "webcalsidebar"):
        for item in entry.find_all("a"):
            questionsTemp.append(item.text) 


    questions = qaList(questionsTemp)
    answers = qaList(["You can find more information here: " + link])
    id = "brockfaq" + str(random.randint(0,10000000000)) + "123123"
    entr = qnas(id, answers, questions)
    entries.append(entr)
    

data = {}
data['qnas'] = entries
frozen = jsonpickle.encode(data, unpicklable=False)
print(frozen)











