import os
import re
from flask import Flask, jsonify, render_template, request, url_for, session, flash, redirect, request
from flask_session import Session
from passlib.apps import custom_app_context as pwd_context
import urllib
from tempfile import mkdtemp
from flask_jsglue import JSGlue
from urllib.request import urlopen
import feedparser
import requests
import json
import datetime

import datetime
from cs50 import SQL


# configure application
app = Flask(__name__)
JSGlue(app)

# ensure responses aren't cached
if app.config["DEBUG"]:
    @app.after_request
    def after_request(response):
        response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
        response.headers["Expires"] = 0
        response.headers["Pragma"] = "no-cache"
        return response

db = SQL("sqlite:///weather.db")
    
@app.route("/")
def index():
    # r=requests.get("http://samples.openweathermap.org/data/2.5/weather?q=London,uk&appid=c2eb160ee418e93642d21cd97e216c7c")
    # weather = r.json();
    # print(weather)
    # if not os.environ.get("API_KEY"):
    #     raise RuntimeError("API_KEY not set")
    return render_template("index.html")

@app.route("/search")   #implementing search bar
def search():
    print("in search")
    q= request.args.get("q")
    q += '%'
    
    place = db.execute("SELECT * from places where place_name LIKE :q", q=q)
   
    return jsonify(place)

  
@app.route("/getinfo")
def getinfo():
    
   
    lat = request.args.get("lat")
    lng = request.args.get("lng")
    
    url = "https://api.darksky.net/forecast/35d72e631f751572f08e52a24a0e9160/"
    url = url+ lat +"," + lng +"?" + "UNITS=us" 
    # url += "&appid=c2eb160ee418e93642d21cd97e216c7c"
    # url = "https://api.darksky.net/forecast/35d72e631f751572f08e52a24a0e9160/37.8267,-122.4233"
   
    # r=requests.get("http://samples.openweathermap.org/data/2.5/weather?q=Loxley&appid=c2eb160ee418e93642d21cd97e216c7c");
    r= requests.get(url)
    weather = r.json()
    return (jsonify(weather))

@app.route("/news")
def news():
    return render_template("news.html")
    
@app.route("/live_cameras")
def live_cameras():
    return render_template("live-cameras.html")
    
@app.route("/photos")
def photos():
    return render_template("photos.html")
    
@app.route("/contact")
def contact():
    return render_template("contact.html")

@app.route("/single")
def single():
    return render_template("single.html")

@app.route("/hourlyData")
def hourlyData():
    return render_template("hourlyData.html")
    
    
    
    