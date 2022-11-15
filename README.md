# Max LH Bradley Terry Ratings on Google Sheets
An implementation of maximum likelihood estimation of Bradley Terry ratings as a function on Google Sheets.

## Usage
`=calculateMaxLHRatings(winsGrid, iters)`

The winsGrid input has to be an adjency matrix where the winners are in the rows and the losers in the columns. 
The names of the teams need to be in the same order in both the columns and the rows (you can just transpose one to get the other).
Make sure to include the names of the teams in the input to the function.

Here's an example:

![Example](/images/example2.png "An example of suitable input")

The function breaks the teams into strongly connected groups and rates them within those groups, so you don't need to make sure all the teams are strongly connected.

Iters is the number of iterations performed for the numerical approximation of the ratings, the default is 1000. If the function takes too long to run consider reducing this number.

## Installation
Open the spreadsheet where you want to have the function and go to Extensions > App Script and then either copy and paste the code directly into the default script or make a new one and paste it there.

