# IntegrationService

[![Build Status](https://travis-ci.org/Wildix/IntegrationService.svg?branch=master)](https://travis-ci.org/Wildix/IntegrationService)

A JavaScript library for communication with Collaboration via WIService

Based on the [Backbone](http://backbonejs.org/) library

Quick start
------------
    var WIService = new Wildix.IntegrationService({
        name: "MySomeApplication",
        version: '1.0.0'
    });

    WIService.Roster.on('all', function(eventName, userOrCollection, b, c){
        // when the Roster plugin generates any event
        console.log('Roster event:', eventName, userOrCollection, b, c);
    });

    WIService.Telephony.on('all', function(eventName, callOrCollection, b, c){
        // when the Telephony plugin generates any event
        console.log('Telephony event:', eventName, callOrCollection, b, c);
    });

    WIService.Roster.subscribe();
    WIService.Telephony.subscribe();

Links
-----

- Documentation: https://wildix.github.io/IntegrationService/

