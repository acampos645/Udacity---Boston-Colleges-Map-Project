# Neighborhood Map Project
This is single-page web application that shows the information of 10 prominent schools in the Boston area.  It was done so using Knockout.js, the Google Maps API and Wikipedia API

Since I have worked in Boston and been involved in college admissions, I felt that creating a basic map showing the layout of schools in the city would be good practice

##Accessing App:
The application can be run locally by downloading the files from the following Github repository:

*[https://github.com/acampos645/acampos645](https://github.com/acampos645/acampos645)

Once downloaded, unzip the files and open the index.html file with a browswer.  When the application is loaded, a map of Boston with 10 markers should be displayed along with a sidebar of information.

##Using the App
Information for each marker can be accessed in one of two ways:

* Clicking on each of the markers will open up an infowindow  with more informatoin for each school.  This includes information requested from and a link to its associated Wikipedia article.  When each marker is clicked, the icon turns green so that the user knows which markers have been red.

* School address and websites are shown in the left list.  It also includes a search function that filters the markers and school listings in real time.  Clicking on a listing will open an infowindow and recenter the map on the corresponding marker

##Future Direction
In future iterations of this project, I would like to add the following features:

*Filtering of schools based on student GPA and SAT scores
*Implementation of Yelp API to show points of interest near each college
