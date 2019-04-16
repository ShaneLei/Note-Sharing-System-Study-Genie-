import operator
from flask import Flask, request, session, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from bson import json_util
from bson.objectid import ObjectId
import requests
import json
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
import re
import string
import random
import datetime
from gensim.summarization import summarize

app = Flask(__name__)
app.secret_key = 'secret'

cors = CORS(app, resources={"*"}, allow_headers=[
    "Content-Type", "Authorization", "Access-Control-Allow-Credentials"],
            supports_credentials=True)
database_name = "database"
client = MongoClient()
db = client.aw
logins = db.logins
notes = db.notes
groups = db.groups
userStats = db.userStats

@app.route('/')
def hello_world():
    return "Hello World"


@app.route('/register', methods=['POST', 'OPTIONS'])
def register():
    if request.method != 'POST':
        return json.dumps({'response': "Not a POST request", 'responsecode': 0})

    register_info = request.get_json()
    print(request, register_info)
    if register_info is None:
        return json.dumps({'response': "Please send registration forms", 'responsecode': 0})

    try:
        if register_info['userid']:
            print("User name is :- ", register_info['userid'])
        if register_info['password']:
            print("Password is :- ", register_info['password'])

        if not logins.find_one({"userid": register_info['userid']}):
            logins.insert_one({'userid': register_info['userid'], '': register_info['firstname'], 'lastname': register_info['lastname'], 'password': register_info['password'], 'labels': [], 'groups': []})
            userStats.insert_one({'userid': register_info['userid'], 'login_day_count': [0,0,0,0,0,0,0]})
        else:
            return json.dumps({'response': 'User Name already taken', 'responsecode': 0})

        return json.dumps({'response': "Thank you " + register_info['userid'] + " for registering", 'responsecode': 1})
    except Exception as e:
        print(e)
        return json.dumps({'response': "Registration Error " + str(e), 'responsecode': 0})


@app.route('/login', methods=['POST', 'OPTIONS'])
def login():
    try:
        if request.method != 'POST':
            return json.dumps({'response': "Not a POST request"})

        login_info = request.get_json()
        print(request, login_info)
        if login_info is None:
            return json.dumps({'response': "Please send login forms", 'responsecode': 0})

        try:
            if login_info['userid']:
                print("User name is :- ", login_info['userid'])
            if login_info['password']:
                print("Password is :- ", login_info['password'])
        except Exception as e:
            print(e)
            return json.dumps({'response': "Login Credentials Error", 'responsecode': 0})

        if logins.find_one({'userid': login_info['userid'], 'password': login_info['password']}):
            token = ''.join(random.choices(string.ascii_uppercase + string.digits, k=20))
            user_stats = userStats.find_one({'userid': login_info['userid']})
            login_day_count = user_stats['login_day_count']
            day = datetime.datetime.today().weekday()
            login_day_count[day] += 1
            print(login_day_count)
            userStats.update({'userid': user_stats['userid']}, {'$set': {"login_day_count": login_day_count}})

            logins.update({'userid': login_info['userid']}, {'$set': {"token": token}})
            return json.dumps({'response': "Logged In", 'token': token, 'responsecode': 1})

        else:
            return json.dumps({'response': "Invalid Username or Password", 'responsecode': 0})
    except Exception as e:
        print(e)
        return json.dumps({'response': "Login Error", 'responsecode': 0})


@app.route('/logout', methods=['POST', 'OPTIONS'])
def logout():
    try:
        if request.method != 'POST':
            return json.dumps({'response': "Not a POST request", 'responsecode': 0})

        logout_info = request.get_json()
        print(request, logout_info)

        if logout_info is None:
            return json.dumps({'response': "Please send logout forms", 'responsecode': 0})

        try:
            if logout_info['token']:
                print("Token is :- ", logout_info['token'])
                logins.update({"token": logout_info['token']}, {'$set': {"token": ''}})
                return json.dumps({'response': "Logged out", 'responsecode': 1})
        except Exception as e:
            print(e)
            return json.dumps({'response': "Logout Credentials Error", 'responsecode': 0})
    except Exception as e:
        print(e)
        return json.dumps({'response': "Logout Error", 'responsecode': 0})


@app.route('/get_users', methods=['POST', 'OPTIONS'])
def get_users():
    try:
        if request.method != 'POST':
            return json.dumps({'response': "Not a POST request", 'responsecode': 0})

        get_user_info = request.get_json()
        print(request, get_user_info)

        if get_user_info is None:
            return json.dumps({'response': "Please send get users forms", 'responsecode': 0})

        try:
            if get_user_info['token']:
                user_details = logins.find_one({"token": get_user_info['token']})
                if not user_details:
                    return json.dumps({'response': "Invalid Token", 'responsecode': 0})
                users = logins.find()
                ret = []
                for user in users:
                    ret.append(user['userid'])

                return json.dumps({'response': "Get Users Successful", 'users': sorted(ret), 'responsecode': 1})
            else:
                return json.dumps({'response': "Get Users Token Error", 'responsecode': 0})
        except Exception as e:
            print(e)
            return json.dumps({'response': "Get Users Error", 'responsecode': 0})
    except Exception as e:
        print(e)
        return json.dumps({'response': "Get Users Error", 'responsecode': 0})


@app.route('/get_user', methods=['POST', 'OPTIONS'])
def get_user():
    try:
        if request.method != 'POST':
            return json.dumps({'response': "Not a POST request", 'responsecode': 0})

        get_user_info = request.get_json()
        print(request, get_user_info)

        if get_user_info is None:
            return json.dumps({'response': "Please send get user forms", 'responsecode': 0})

        try:
            if get_user_info['token']:
                user_details = logins.find_one({"token": get_user_info['token']})
                if not user_details:
                    return json.dumps({'response': "Invalid Token", 'responsecode': 0})

                return json.dumps({'response': "Get User Successful", 'user': json.loads(json.dumps(user_details, default=json_util.default)), 'responsecode': 1})
            else:
                return json.dumps({'response': "Get User Token Error", 'responsecode': 0})
        except Exception as e:
            print(e)
            return json.dumps({'response': "Get User Error", 'responsecode': 0})
    except Exception as e:
        print(e)
        return json.dumps({'response': "Get User Error", 'responsecode': 0})


@app.route('/add_note', methods=['POST', 'OPTIONS'])
def add_note():
    try:
        if request.method != 'POST':
            return json.dumps({'response': "Not a POST request", 'responsecode': 0})

        note_info = request.get_json()
        print(request, note_info)

        if note_info is None:
            return json.dumps({'response': "Please send add note forms", 'responsecode': 0})

        try:
            if note_info['token']:
                now = datetime.datetime.now()
                user_details = logins.find_one({"token": note_info['token']})
                if not user_details:
                    return json.dumps({'response': "Invalid Token", 'responsecode': 0})
                user = user_details['userid']

                note_groups = set(note_info['groups'].split(','))
                verified_note_groups = []
                for group in note_groups:
                    if groups.find_one({"members": {"$all": [user]}, "group_name": group}):
                        verified_note_groups.append(group)
                notes.insert({'title': note_info['title'], 'visibility': note_info['visibility'],
                              'note_content': note_info['note_content'], 'labels': note_info['labels'].split(','),
                              'groups': verified_note_groups,
                              'creation_date': now, 'creation_user': user,
                              'last_updated_date': now, 'updation_user': user, 'liked_users': [], 'disliked_users': []})
                user_labels = set(user_details['labels'])
                for label in note_info['labels'].split(','):
                    user_labels.add(label)
                logins.update({'userid': user}, {'$set': {"labels": list(user_labels)}})

                return json.dumps({'response': "Note Added", 'responsecode': 1})
            else:
                return json.dumps({'response': "Invalid Token", 'responsecode': 0})
        except Exception as e:
            print(e)
            return json.dumps({'response': "Add Note Error", 'responsecode': 0})

    except Exception as e:
        print(e)
        return json.dumps({'response': "Add Note Error", 'responsecode': 0})


@app.route('/edit_note', methods=['POST', 'OPTIONS'])
def edit_note():
    try:
        if request.method != 'POST':
            return json.dumps({'response': "Not a POST request", 'responsecode': 0})

        note_info = request.get_json()
        print(request, note_info)

        if note_info is None:
            return json.dumps({'response': "Please send Edit note forms", 'responsecode': 0})

        try:
            if note_info['token']:
                now = datetime.datetime.now()
                user_details = logins.find_one({"token": note_info['token']})
                if not user_details:
                    return json.dumps({'response': "Invalid Token", 'responsecode': 0})
                user = user_details['userid']

                note_groups = set(note_info['groups'].split(','))
                verified_note_groups = []
                for group in note_groups:
                    if groups.find_one({"members": {"$all": [user]}, "group_name": group}):
                        verified_note_groups.append(group)
                notes.update({"_id": ObjectId(note_info["_id"])} ,{'$set':{'title': note_info['title'], 'visibility': note_info['visibility'],
                              'note_content': note_info['note_content'], 'labels': note_info['labels'].split(','),
                              'groups': verified_note_groups,
                              'last_updated_date': now, 'updation_user': user}})
                user_labels = set(user_details['labels'])
                for label in note_info['labels'].split(','):
                    user_labels.add(label)

                new_user_labels = []
                for label in user_labels:
                    if notes.find_one({"labels": {"$all": [label]}}):
                        new_user_labels.append(label)
                logins.update({'userid': user}, {'$set': {"labels": list(new_user_labels)}})

                return json.dumps({'response': "Note Edited", 'responsecode': 1})
            else:
                return json.dumps({'response': "Invalid Token", 'responsecode': 0})
        except Exception as e:
            print(e)
            return json.dumps({'response': "Edit Note Error", 'responsecode': 0})

    except Exception as e:
        print(e)
        return json.dumps({'response': "Edit Note Error", 'responsecode': 0})


@app.route('/get_notes', methods=['POST', 'OPTIONS'])
def get_notes():
    try:
        if request.method != 'POST':
            return json.dumps({'response': "Not a POST request", 'responsecode': 0})

        get_notes_info = request.get_json()
        print(request, get_notes_info)

        if get_notes_info is None:
            return json.dumps({'response': "Please send get notes forms", 'responsecode': 0})

        try:
            user_details = logins.find_one({"token": get_notes_info['token']})
            if not user_details:
                return json.dumps({'response': "Invalid Token", 'responsecode': 0})
            user = user_details['userid']

            query = {'creation_user': user}
            label_group_query = {}
            if 'labels' in get_notes_info:
                if get_notes_info['labels'] is not "":
                    label_group_query = {'creation_user': user}
                    label_group_query.update({'labels': {'$all': get_notes_info['labels'].split(',')}})
            if 'groups' in get_notes_info:
                if get_notes_info['groups'] is not "":
                    label_group_query.update({'groups': {'$all': get_notes_info['groups'].split(',')}})

            ret_set = set()
            results = []
            if 'labels' in get_notes_info or 'groups' in get_notes_info:
                label_group_results = notes.find(label_group_query)
                for result in label_group_results:
                    ret_set.add(json.dumps(result, default=json_util.default))
            else:
                results = notes.find(query)

            for result in results:
                ret_set.add(json.dumps(result, default=json_util.default))

            ret_val = []
            for ret in ret_set:
                result = json.loads(ret)
                result['like_count'] = len(result['liked_users'])
                result['dislike_count'] = len(result['disliked_users'])
                result['labels'] = ",".join(result['labels'])
                result['groups'] = ",".join(result['groups'])
                result['like_status'] = 0
                if user in result['liked_users']:
                    result['like_status'] = 1
                if user in result['disliked_users']:
                    result['like_status'] = -1
                ret_val.append(result)
            print(ret_val)

            return json.dumps({'response': "Get Notes Successful", 'notes': ret_val, 'responsecode': 1})
        except Exception as e:
            print(e)
            return json.dumps({'response': "Get Notes Error", 'responsecode': 0})

    except Exception as e:
        print(e)
        return json.dumps({'response': "Get Notes Error", 'responsecode': 0})


@app.route('/delete_note', methods=['POST', 'OPTIONS'])
def delete_note():
    try:
        if request.method != 'POST':
            return json.dumps({'response': "Not a POST request", 'responsecode': 0})

        delete_notes_info = request.get_json()
        print(request, delete_notes_info)

        if delete_notes_info is None:
            return json.dumps({'response': "Please send delete note forms", 'responsecode': 0})

        try:
            user_details = logins.find_one({"token": delete_notes_info['token']})
            if not user_details:
                return json.dumps({'response': "Invalid Token", 'responsecode': 0})
            user = user_details['userid']

            if '_id' in delete_notes_info:
                if delete_notes_info['_id'] is not "":
                    notes.remove({"_id": ObjectId(delete_notes_info['_id']), "creation_user": user})

                    user_labels = set(user_details['labels'])
                    new_user_labels = []
                    for label in user_labels:
                        if notes.find_one({"labels": {"$all": [label]}}):
                            new_user_labels.append(label)
                    logins.update({'userid': user},
                                  {'$set': {"labels": list(new_user_labels)}})
            return json.dumps({'response': "Delete Note Successful", 'responsecode': 1})
        except Exception as e:
            print(e)
            return json.dumps({'response': "Delete Note Error", 'responsecode': 0})

    except Exception as e:
        print(e)
        return json.dumps({'response': "Delete Note Error", 'responsecode': 0})


@app.route('/feed', methods=['POST', 'OPTIONS'])
def feed():
    try:
        if request.method != 'POST':
            return json.dumps({'response': "Not a POST request", 'responsecode': 0})

        feed_info = request.get_json()
        print(request, feed_info)

        if feed_info is None:
            return json.dumps({'response': "Please send feed forms", 'responsecode': 0})

        try:
            user_details = logins.find_one({"token": feed_info['token']})
            if not user_details:
                return json.dumps({'response': "Invalid Token", 'responsecode': 0})
            user = user_details['userid']

            query = {'visibility': "all"}
            user_notes = notes.find({"creation_user": user})
            user_text = ""
            user_labels = []
            for note in user_notes:
                user_text += note['note_content'] + " " + ' '.join(str(x) for x in note['labels'])
                user_labels.extend(note['labels'])
            user_liked_notes = notes.find({'liked_users': {'$in': [user]}})
            for note in user_liked_notes:
                user_text += note['note_content'] + " " + ' '.join(str(x) for x in note['labels'])
                user_labels.extend(note['labels'])
            stop_words = set(stopwords.words('english'))
            word_tokens = word_tokenize(user_text)
            filtered_words = [re.sub(r"[^a-zA-Z0-9]+", ' ', w) for w in word_tokens if (not w in stop_words) and (w.strip() != '' and w.strip() is not None)]
            results = notes.find(query)
            all_notes = []
            for result in results:
                result['like_count'] = len(result['liked_users'])
                result['dislike_count'] = len(result['disliked_users'])
                result['like_status'] = 0
                result['labels'] = ",".join(result['labels'])
                result['groups'] = ",".join(result['groups'])
                if user in result['liked_users']:
                    result['like_status'] = 1
                if user in result['disliked_users']:
                    result['like_status'] = -1
                all_notes.append(json.loads(json.dumps(result, default=json_util.default)))

            for note in all_notes:
                note_word_tokens = word_tokenize(note['note_content'])
                note_filtered_words = [re.sub(r"[^a-zA-Z0-9]+", ' ', w) for w in note_word_tokens if (not w in stop_words) and (w.strip() != '' and w.strip() is not None)]
                note['content_weight'] = len(set(note_filtered_words) & set(filtered_words))
                note_labels = note['labels'].split(',')
                note['label_weight'] = len(set(note_labels) & set(user_labels))
                note['like_weight'] = int(note['like_count'])

            total_content_weight = 1.0
            total_label_weight = 1.0
            total_like_weight = 1.0
            for note in all_notes:
                total_content_weight += note['content_weight']
                total_label_weight += note['label_weight']
                total_like_weight += note['like_weight']

            for note in all_notes:
                note['score'] = (note['content_weight'] / total_content_weight) * 50 + (note['label_weight'] / total_label_weight) * 30 + (note['like_weight'] / total_like_weight) * 20
                if note['creation_user'] == user:
                    note['score'] = 0

            return_list = sorted(all_notes, key=lambda k: k['score'])
            return_list.reverse()
            print(return_list)
            return json.dumps({'response': "Feed Successful", 'notes': return_list, 'responsecode': 1})
        except Exception as e:
            print(e)
            return json.dumps({'response': "Feed Error", 'responsecode': 0})

    except Exception as e:
        print(e)
        return json.dumps({'response': "Feed Error", 'responsecode': 0})


@app.route('/vote_note', methods=['POST', 'OPTIONS'])
def vote_note():
    try:
        if request.method != 'POST':
            return json.dumps({'response': "Not a POST request", 'responsecode': 0})

        vote_note_info = request.get_json()
        print(request, vote_note_info)

        if vote_note_info is None:
            return json.dumps({'response': "Please send feed forms", 'responsecode': 0})

        try:
            user_details = logins.find_one({"token": vote_note_info['token']})
            if not user_details:
                return json.dumps({'response': "Invalid Token", 'responsecode': 0})
            user = user_details['userid']

            note = notes.find_one({"_id": ObjectId(vote_note_info['_id'])})
            liked_users = set(note['liked_users'])
            disliked_users = set(note['disliked_users'])

            disliked_users.discard(user)
            liked_users.discard(user)
            if vote_note_info['like_status'] == 1:
                liked_users.add(user)
            if vote_note_info['like_status'] == -1:
                disliked_users.add(user)

            notes.update({"_id": ObjectId(vote_note_info["_id"])},
                         {'$set': {'liked_users': list(liked_users), 'disliked_users': list(disliked_users)}})

            return json.dumps({'response': "Vote Note Successful", 'responsecode': 1})
        except Exception as e:
            print(e)
            return json.dumps({'response': "Vote Note Error", 'responsecode': 0})

    except Exception as e:
        print(e)
        return json.dumps({'response': "Vote Note Error", 'responsecode': 0})


@app.route('/create_group', methods=['POST', 'OPTIONS'])
def create_group():
    try:
        if request.method != 'POST':
            return json.dumps({'response': "Not a POST request", 'responsecode': 0})

        create_group_info = request.get_json()
        print(request, create_group_info)

        if create_group_info is None:
            return json.dumps({'response': "Please send create group forms", 'responsecode': 0})

        try:
            user_details = logins.find_one({"token": create_group_info['token']})
            if not user_details:
                return json.dumps({'response': "Invalid Token", 'responsecode': 0})
            user = user_details['userid']

            if groups.find_one({"group_name": create_group_info['group_name']}):
                return json.dumps({'response': "Group Name already taken", 'responsecode': 0})
            group_users = create_group_info['members'].split(",")
            group_users.append(user)
            group_users = list(set(group_users))
            groups.insert({'group_name': create_group_info['group_name'], 'description': create_group_info['description'],
                          'members': group_users})

            for u in group_users:
                add_user_details = logins.find_one({'userid': u})
                user_groups = set(add_user_details['groups'])
                user_groups.add(create_group_info['group_name'])
                logins.update({'userid': u}, {'$set': {"groups": list(user_groups)}})

            return json.dumps({'response': "Create Group Successful", 'responsecode': 1})
        except Exception as e:
            print(e)
            return json.dumps({'response': "Create Group Error", 'responsecode': 0})

    except Exception as e:
        print(e)
        return json.dumps({'response': "Create Group Error", 'responsecode': 0})


@app.route('/edit_group', methods=['POST', 'OPTIONS'])
def edit_group():
    try:
        if request.method != 'POST':
            return json.dumps({'response': "Not a POST request", 'responsecode': 0})

        edit_group_info = request.get_json()
        print(request, edit_group_info)

        if edit_group_info is None:
            return json.dumps({'response': "Please send edit group forms", 'responsecode': 0})

        try:
            user_details = logins.find_one({"token": edit_group_info['token']})
            if not user_details:
                return json.dumps({'response': "Invalid Token", 'responsecode': 0})
            user = user_details['userid']

            group_users = edit_group_info['members'].split(",")
            group_users = list(set(group_users))
            old_group = groups.find_one({"_id": ObjectId(edit_group_info["_id"])})
            removed_users = set(old_group['members']) - set(edit_group_info['members'])
            for u in removed_users:
                removed_user_details = logins.find_one({'userid': u})
                user_groups = set(removed_user_details['groups'])
                user_groups.remove(edit_group_info['group_name'])
                logins.update({'userid': u}, {'$set': {"groups": list(user_groups)}})

            groups.update({"_id": ObjectId(edit_group_info["_id"])},
                         {'$set': {'group_name': edit_group_info['group_name'], 'description': edit_group_info['description'],
                          'members': group_users}})

            for u in group_users:
                add_user_details = logins.find_one({'userid': u})
                user_groups = set(add_user_details['groups'])
                user_groups.add(edit_group_info['group_name'])
                logins.update({'userid': u}, {'$set': {"groups": list(user_groups)}})


            return json.dumps({'response': "Edit Group Successful", 'responsecode': 1})
        except Exception as e:
            print(e)
            return json.dumps({'response': "Edit Group Error", 'responsecode': 0})

    except Exception as e:
        print(e)
        return json.dumps({'response': "Edit Group Error", 'responsecode': 0})


@app.route('/get_groups', methods=['POST', 'OPTIONS'])
def get_groups():
    try:
        if request.method != 'POST':
            return json.dumps({'response': "Not a POST request", 'responsecode': 0})

        get_groups_info = request.get_json()
        print(request, get_groups_info)

        if get_groups_info is None:
            return json.dumps({'response': "Please send Get group forms", 'responsecode': 0})

        try:
            user_details = logins.find_one({"token": get_groups_info['token']})
            if not user_details:
                return json.dumps({'response': "Invalid Token", 'responsecode': 0})
            user = user_details['userid']

            query = {'members': {'$all': [user]}}
            user_groups = groups.find(query)
            ret = []
            for group in user_groups:
                ret.append(json.loads(json.dumps(group, default=json_util.default)))

            print(ret)

            return json.dumps({'response': "Get Group Successful", 'groups': ret, 'responsecode': 1})
        except Exception as e:
            print(e)
            return json.dumps({'response': "Get Group Error", 'responsecode': 0})

    except Exception as e:
        print(e)
        return json.dumps({'response': "Get Group Error", 'responsecode': 0})


@app.route('/delete_group', methods=['POST', 'OPTIONS'])
def delete_group():
    try:
        if request.method != 'POST':
            return json.dumps({'response': "Not a POST request", 'responsecode': 0})

        delete_group_info = request.get_json()
        print(request, delete_group_info)

        if delete_group_info is None:
            return json.dumps({'response': "Please send Delete group forms", 'responsecode': 0})

        try:
            user_details = logins.find_one({"token": delete_group_info['token']})
            if not user_details:
                return json.dumps({'response': "Invalid Token", 'responsecode': 0})
            user = user_details['userid']

            group = groups.find_one({"_id": ObjectId(delete_group_info["_id"])})
            for u in group['members']:
                user_details = logins.find_one({'userid': u})
                user_groups = set(user_details['groups'])
                user_groups.remove(group['group_name'])
                logins.update({'userid': u}, {'$set': {"groups": list(user_groups)}})
            groups.remove({"_id": ObjectId(delete_group_info["_id"])})

            return json.dumps({'response': "Delete Group Successful", 'responsecode': 1})
        except Exception as e:
            print(e)
            return json.dumps({'response': "Delete Group Error", 'responsecode': 0})

    except Exception as e:
        print(e)
        return json.dumps({'response': "Delete Group Error", 'responsecode': 0})


@app.route('/group_stats', methods=['POST', 'OPTIONS'])
def group_stats():
    try:
        if request.method != 'POST':
            return json.dumps({'response': "Not a POST request", 'responsecode': 0})

        group_stats_info = request.get_json()
        print(request, group_stats_info)

        if group_stats_info is None:
            return json.dumps({'response': "Please send Group Stats forms", 'responsecode': 0})

        try:
            user_details = logins.find_one({"token": group_stats_info['token']})
            if not user_details:
                return json.dumps({'response': "Invalid Token", 'responsecode': 0})
            user = user_details['userid']

            group = groups.find_one({"group_name": group_stats_info["group_name"]})

            ret = []
            for user in group['members']:
                user_group_notes = notes.find({'creation_user':user, 'groups': {'$all': group_stats_info['group_name'].split(',')}})
                user_notes_count = user_group_notes.count()
                user_like_count = 0
                user_dislike_count = 0
                for note in user_group_notes:
                    user_like_count += len(note['liked_users'])
                    user_dislike_count += len(note['disliked_users'])
                ret.append({'name': user, 'Note Count': user_notes_count, 'Like count': user_like_count, 'Dislike Count': user_dislike_count})

            print(ret)
            return json.dumps({'response': "Group Stats Successful", 'group_stats': ret, 'responsecode': 1})
        except Exception as e:
            print(e)
            return json.dumps({'response': "Group Stats Error", 'responsecode': 0})

    except Exception as e:
        print(e)
        return json.dumps({'response': "Group Stats Error", 'responsecode': 0})


@app.route('/auto_generate_note', methods=['POST', 'OPTIONS'])
def auto_generate_note():
    try:
        if request.method != 'POST':
            return json.dumps({'response': "Not a POST request", 'responsecode': 0})

        auto_generate_note_info = request.get_json()
        print(request, auto_generate_note_info)

        if auto_generate_note_info is None:
            return json.dumps({'response': "Please send Delete group forms", 'responsecode': 0})

        try:
            user_details = logins.find_one({"token": auto_generate_note_info['token']})
            if not user_details:
                return json.dumps({'response': "Invalid Token", 'responsecode': 0})

            group = groups.find_one({"group_name": auto_generate_note_info["group_name"]})
            group_notes = notes.find({'groups': {'$all': [group['group_name']]}})
            text = ""
            for note in group_notes:
                text += ". " + note['note_content']
            ret = summarize(text, ratio=0.25)
            print(ret)

            return json.dumps({'response': "Auto Generate Note Successful", 'note': ret, 'responsecode': 1})
        except Exception as e:
            print(e)
            return json.dumps({'response': "Auto Generate Note Error", 'responsecode': 0})

    except Exception as e:
        print(e)
        return json.dumps({'response': "Auto Generate Note Error", 'responsecode': 0})


@app.route('/user_stats', methods=['POST', 'OPTIONS'])
def user_stats():
    try:
        if request.method != 'POST':
            return json.dumps({'response': "Not a POST request", 'responsecode': 0})

        user_stats_info = request.get_json()
        print(request, user_stats_info)

        if user_stats_info is None:
            return json.dumps({'response': "Please send User Stats forms", 'responsecode': 0})

        try:
            user_details = logins.find_one({"token": user_stats_info['token']})
            if not user_details:
                return json.dumps({'response': "Invalid Token", 'responsecode': 0})
            user = user_details['userid']
            user_stats = userStats.find_one({'userid': user})
            login_day_count = user_stats['login_day_count']

            word_data = []
            label_data = []
            labels = []
            content = ""

            # Label and Text Count Visual
            for i in notes.find({'creation_user': user}):
                content += i['note_content'].lower() + " "
                labels.extend(i['labels'])

            stop_words = set(stopwords.words('english'))
            word_tokens = word_tokenize(content)
            filtered_sentence = [re.sub(r"[^a-zA-Z0-9]+", ' ', w) for w in word_tokens if not w in stop_words]
            freqwords = {}
            freqlabels = {}
            for w in filtered_sentence:
                if w in freqwords:
                    freqwords[w] += 1
                else:
                    freqwords[w] = 1
            for label in labels:
                if label in freqlabels:
                    freqlabels[label] += 1
                else:
                    freqlabels[label] = 1

            freqSortedlabels = dict(sorted(freqlabels.items(), key=operator.itemgetter(1), reverse=True)[:15])
            freqSortedwords = dict(sorted(freqwords.items(), key=operator.itemgetter(1), reverse=True)[:15])
            for key, value in freqSortedwords.items():
                if len(key) > 2:
                    word_data.append({'value': key, 'count': value})

            for key, value in freqSortedlabels.items():
                label_data.append({'value': key, 'count': value})

            groups = user_details['groups']
            group_data = []
            for group in groups:
                group_data.append({'name':group, 'Users notes': notes.find({'groups': group, 'creation_user': user}).count(), 'Total Notes': notes.find({'groups':group}).count()})

            print(login_day_count)
            print(word_data)
            print(label_data)
            print(group_data)

            return json.dumps({'response': "User Stats Successful", 'login_day_count': login_day_count, 'word_data': word_data, 'label_data': label_data, 'group_data': group_data, 'responsecode': 1})
        except Exception as e:
            print(e)
            return json.dumps({'response': "User Stats Error", 'responsecode': 0})

    except Exception as e:
        print(e)
        return json.dumps({'response': "User Stats Error", 'responsecode': 0})


if __name__ == '__main__':
    app.run()
