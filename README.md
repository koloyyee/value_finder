# Value Seeker Assistant

Stock Screener (Finviz):

Finviz is a great place to search for stocks,
especially with a their great stock screener,
however, you can't save it...
therefore I made this Chrome Extension to save the screener.

<!-- Company summary(AI):

When looking for value company the qualitative is as important as quantitative analysis,
through understanding the business, we, investors will know if the company is within our circle of competence.

Business Summary (AI):

Highlight text, right-click and summarize -->

Note taking:

Save notes with source, quotes, ticker(optional), title, and note.

## Suggestions?

If you have any suggestion for other functionality please open issue!

## Objective

Stock Screener is the first place to find great investment opportunities,
Finviz is a great resources for investors to find new ideas,
however it does have the saving stock screener options,
therefore we are creating a Chrome Extension to allow investors
to save a list of screener for quick access.
In this Chrome Extension we also support ticker quick search
and return the company information on Finviz,
I believe this Chrome Extension will let investors to access
their useful screener and companies,
while driving more traffics to Finviz.

## Goal

When users are not on Finviz,
users are able view the list of screener if there are any,
else system will a message to signify the list is empty
and encourage user to go to Finviz screener to save to their list.

The screener list save with Chrome Storage API in Key-Value pair,
which key and value are both unique
if user input a screener name not unique there will be a warning message,
if the link is not unique, there will be a warning message,
the screener input is cannot be empty
and if the link is not on the Finviz screener page,
when any of the above failed the input will not be saved

This extension will support search by ticker and return the Finviz company page.
