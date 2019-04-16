# Note-Sharing-System-Study-Genie-

## Run the Back-end Server

1. Install python 3.6

2. Install mongodb

       brew install mongodb(or apt-get or yum)
3. Create database

       sudo mkdir -p /data/db
       sudo chmod -R 0777 /data/db

4. Install Python Dependencies

       pip install -r requirements.txt
       python3 -m nltk.downloader stopwords
       python3 -m nltk.downloader punkt

5. Start MongoDB

       sudo mongod

6. Start Server

       python3 main.py



## Run the Front-end App

1. Navigate into study-genie-webapp 

       cd study-genie-webapp

2. Install dependencies. 

       npm install

3. Start the app on localhost:8080

       npm start


 
