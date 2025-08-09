# Value Seeker Chrome Extension

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

Value finder is a chrome extension for value investors who
wants to conduct qualitative analysis through reading SEC filings,
screener, and important links. The application supports note taking,
and export whenever the user wants.

Our goal is to help user to perform qualitative analysis through
reading the fundamentals of a company.

Currently Value Finder do not require registration nor AI support,
in future we could add AI summary or check AI lookup of the companies
while not requiring users to register.

## Design Detail

The screener list save with Chrome Storage API in Key-Value pair,
which key and value are both unique
if user input a screener name not unique there will be a warning message,
if the link is not unique, there will be a warning message,
the screener input is cannot be empty
and if the link is not on the Finviz screener page,
when any of the above failed the input will not be saved

### Ticker lookup and bookmarking

This extension will support search by ticker and return the Finviz company page,
with the sec 10k, 10q, 40f and 144 filing link. During the input of
the ticker search, application should suggest ticker based on input ticker or
input company name, or company cik.The application supports bookmarking and
group by the ticker but no duplicate links allowed.

### Note taking

Value finder will support note taking features, user can highlight the text from html file and
automatically shared to the side panel on the right, all the notes will have
a title input, quote, note text field, optional ticker, and optional tagging.
The notes can be export as a csv, text or json(?), can be exported
a single note, group by ticker, group by tag, or all notes.
