# Arcane Vocabulary Tutor

This is a test application I wrote to experiment with [AngularJS](https://angularjs.org/) 
and [Twitter Bootstrap](http://getbootstrap.com/getting-started).

## Local Setup Instructions

* To setup locally do:

```
~$ npm install
```

* Then start the web-server:

```
~$ ./bin/run-www
```

* To view, navigate to [localhost:3000](http://localhost:3000) in your web browser and voila.

## Usage

To enter a new word, just type it in to the input bar; hit enter; 
the editing dialog will appear; fill in a definition and click Save Changes.

To browse words, begin by typing any character into the input bar;
scroll down the list to see what words start with what you typed.
If you would like to edit any of them, just click on the word you would
like to edit, and the editing dialog will appear. Make the changes you would
like and click 'Save'. That easy.

_(hint: type a single period '.' to see the whole list of words)_

## Explanation

This is a simple vocabulary/dictionary-type storage. It demonstrates a few features:
* Local storage -- there is a database in your web browser! It uses [Queryable](https://github.com/gmn/queryable) which extends JSON to make it queryable.
* AngularJS's two-way binding -- pretty much everything in the application is tied to the search bar
* Twitter Bootstrap's simple layout techniques. And jQuery-based easy javascript dialogs.
* Responsive design for free! The layout works equally well in iPad, iPhone, and Desktop monitors.
* UI Design -- look, no buttons! All you need is right there, and activated by the ENTER key (which is device ubiquitous).
* Express. It uses [Node](http://nodejs.org) & [Express](https://github.com/visionmedia/express) for the server environment.

There is a **[live demo](http://lit-tundra-5131.herokuapp.com/)**

For questions, comments, bugs - contact **Gregory Naughton** - greg@naughton.org
