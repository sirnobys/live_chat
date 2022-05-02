import json

from flask import Flask, send_from_directory
from flask_socketio import SocketIO, emit, join_room,send
from flask_cors import CORS
import sqlite3
from flask_mysqldb import MySQL



app = Flask(__name__)
app.config['SECRET_KEY'] = 'development key'
socket = SocketIO(app, cors_allowed_origins="*")
CORS(app)

app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = ''
app.config['MYSQL_DB'] = 'chat'
mysql = MySQL(app)

active_users={}
messages=[]


@app.route('/')
def serve_static_index():
    cursor = mysql.connection.cursor()
    sql = "SELECT * FROM user"
    cursor.execute(sql,)
    users = cursor.fetchall()
    sql = "SELECT * FROM block"
    cursor.execute(sql, )
    block = cursor.fetchall()

    data = {"messages":[], "users":[], "block":[]}
    sql = "SELECT * FROM message"
    cursor.execute(sql, )
    messages = cursor.fetchall()

    for val in messages:
        data["messages"].append({"room": val[1], "sender": val[2], "receiver": val[3], "time": val[4], "message": val[5]})

    for val in users:
        data["users"].append({"name": val[1], "email": val[2], "picture": val[3]})
    for val in block:
        data["block"].append({"user": val[1], "blocked_user": val[2]})
    return json.dumps(data,)


@socket.on('connect')
def on_connect():
    print('user connected', )
    retrieve_active_users()


def retrieve_active_users():
    emit('retrieve_active_users', broadcast=True)


@socket.on('activate_user')
def on_active_user(data):
    active_users[data['email']]=data
    emit('user_activated', active_users, broadcast=True)
    cursor = mysql.connection.cursor()
    sql_check = "SELECT * FROM user WHERE email = %s"
    cursor.execute(sql_check, (data['email'],))
    val = cursor.fetchall()
    if len(val) < 1:
        cursor.execute("INSERT INTO user (name, email, picture) values (%s,%s,%s) ", (data["name"], data["email"], data["picture"]))
        mysql.connection.commit()
    cursor.close()


@socket.on('deactivate_user')
def on_inactive_user(data):
    del active_users[data['email']]
    print(active_users)
    emit('user_deactivated', active_users, broadcast=True)


@socket.on('block_user')
def on_block(data):
    cursor = mysql.connection.cursor()
    sql = "INSERT into block (blocked_user, user) value (%s,%s)"
    # cursor.execute(sql, (data['blocked_user'], data['user'],))
    # mysql.connection.commit()
    emit('user_blocked', data, broadcast=True)


@socket.on('send_message')
def on_chat_sent(data):
    messages.append(data)
    emit('message_sent', messages, broadcast=True)
    cursor = mysql.connection.cursor()
    sql= "INSERT into message (room, sender, receiver, time, message) values (%s,%s,%s,%s,%s)"
    cursor.execute(sql, (data['room'], data['sender'], data['receiver'], data['sent'], data['message']))
    mysql.connection.commit()
    cursor.close()


if __name__ == "__main__":
    app.run(debug=True)