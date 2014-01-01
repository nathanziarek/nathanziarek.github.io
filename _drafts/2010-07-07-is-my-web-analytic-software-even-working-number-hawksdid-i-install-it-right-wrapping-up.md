---
layout: article
title: Is My Web Analytic Software Even Working?

Number hawksDid I install it right?Wrapping Up
excerpt: 
permalink: 2010-07-07-is-my-web-analytic-software-even-working-number-hawksdid-i-install-it-right-wrapping-up
categories: google-analytics webtrends clicky web-inspector 
published: true
author: Nathan Ziarek
---

## Is My Web Analytic Software Even Working?  
\[ Posted [Sun, 07 Mar 2010 10:24:00][0] \]

A recent question on the Google Analytics forums had me thinking about how I test various web tracking solutions.

It seems as if these types of questions fall into two camps:

1. Recent installs verifying the code is correct and
2. Number hawks verifying the accuracy of the numbers.

## Number hawks

The latter group is in for a surprise: there is no way to be confident in the numbers. Web traffic is more an art than a science.

Take the **Ziarek Phone Call Theorem**. A visitor, navigating your site, receives a phone call and stops browsing for 35 minutes before continuing to click around.

Most (perhaps all) analytics tools would consider this 2 visits: The initial browsing, followed by a period of inactivity, followed by more browsing. Because the threshold for inactivity can vary from package to package (one might split the visits at 10 minutes of inactivity, another at half-an-hour), these numbers will often be different, sometimes drastically so.

While the incidence of this particular situation is probably slim, there are plenty of ways (long articles, complex, javascript-driven forms) to incur the same timeout scenario. More important than the "Visits" numbers not aligning are the calculations that rely on visits. The cascade of one minor difference in calculation creates significant shifts in the numbers without any being truly "wrong".

## Did I install it right?

There are a thousand possible configurations for the tracking code, but most errors fall into one of four buckets:

### You've not entered any personalization variables correctly.

In Google Analytics, for example, there is a string...

> pageTracker = \_gat.\_getTracker("**UA-123456-1**");
> 

...where **UA-123456-1** specifies your account. The only way to make sure this number is right is to audit. No tricks here, unfortunately.

### You've made customizations to the code, but not all browsers support those customizations.

(Shame on you for not testing)

Look at the browser report and note if a particular browser is completely absent. If you notice few or no visits from IE (still with 70% of the market), then perhaps your customizations are producing errors in IE. Keep in mind your visitor base --- if you run a Mac blog, the likelyhood of IE visits diminishes.

### The code is installed incorrectly.

(My experience is with Google Chrome and Apple's Safari, although I assume the same results are possible with FireFox/FireBug and Opera. I won't make that same assumption with Internet Explorer.)

1. Determine the method of communication between the script on the page and the server. Most software uses an image file --- Google Analytics has **\_\_utm.gif**, WebTrends **dcs.gif** and Clicky **in.php**.
2. 
In Safari or Chrome, right click on any page that should be tracked and select the Inspector option.

![Inspect Element](http://media.tumblr.com/tumblr_kyx1btFLL81qzxpmp.png)
3. 
A window will appear (either attached to the screen or floating above it) with a number of tools. These tools are constantly being changed and upgraded, so don't worry if your screen doesn't look exactly like this. You are looking for the "Resources" tab.

![Inspector Palette](http://media.tumblr.com/tumblr_kyx1opCyqt1qzxpmp.png)
4. 
On the left-hand side you'll see a list of all the resources needed to make this page operate. If you see the file from step 1 (\_\_utm.gif in this example), you know that the page is communicating with the server successfully.

### You just aren't getting any traffic

Sorry to be the bearer of bad news. At this point, you've pretty-well verified that you are tracking your visits correctly. If you still aren't seeing any traffic, maybe it's because you just aren't getting any.

My favorite line from Tommy Boy is when Chris Farley gets in the elevator with Dan Akroid. After learning that the Christmas tree smell in the elevator is a car freshener Tommy Boy used as cologne, Akroid replies "Step one is identifying the cause. Step two is eliminating it."

You've identified the issue (and it's a bummer), but you know what you need to fix. Advertise, be creative, write more, and engage in social media. Whatever it is your site does, think of all marketing activities in terms of driving traffic.

## Wrapping Up

Monitoring your web traffic for the first time is a bit of a catch 22\. You can't know what your traffic might be until you start to monitor it, and you can't know if that data is correct without something historic to compare it to.

My suggestion is to worry less about the numbers and focus on the trends. Are you looking to increase revenue? Watch those numbers fluctuate based on your campaigns and tweak as needed. Be less concerned with making ten thousand dollars a month and more concerned with making the _next_ dollar.

The trends will tell you more about what you are doing right than a simple visit number ever will.

Tagged with: google analytics, webtrends, clicky, web inspector


[0]: http://nathanziarek.tumblr.com/post/432578598