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

    WIService.Roster.on('all', function(eventName, a, b, c, d){
        // Called when the Roster plugin generates any event
        console.log('Roster event:', eventName, a, b, c, d);
    });

    WIService.Telephony.on('all', function(eventName, a, b, c, d){
        // Called when the Telephony plugin generates any event
        console.log('Telephony event:', eventName, a, b, c, d);
    });

    WIService.Roster.subscribe();
    WIService.Telephony.subscribe();

