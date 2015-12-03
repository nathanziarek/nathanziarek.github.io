---
layout: article
title: Building a Better TV Experience
snippet: Four interactions I'd like to see for a better TV Experience.
permalink: building-better-tv-interfaces
published: true
author: Nathan Ziarek
categories: [ux,appletv]
video: /media/global-queue.m4v
image: /media/better-tv-experience.jpg
---

A few years back, my wife and I cut the cord and cancelled DirecTV. It wasn't due to any anti-TV zealotry--I still probably watch more TV than most people would consider healthy--but we wanted to save a few bucks and get off the couch a bit more. Honestly, with the huge array of options available--a Vizio smart TV, couple of AppleTVs, a Chromecast, Netflix, iTunes--I figured we really weren't giving up much.

There have been some big changes in the industry lately, and with rampant rumors of a new AppleTV, I thought it'd be a good time to take stock of how far we've come.

I'm really disappointed at how little has changed.

We have more content available to us than ever, and Netflix is producing some **truly excellent** series. Video quality is better than ever and HBONow's launch feels like a break in the dam for ala carte programming.

Yet, that all felt *inevitable*. The streaming experience is still riddled with issues: content is difficult to find, there are inconsistencies in interface and terminology. And ***why*** can't fast forward work reliably?

Innovation in this market has decidedly focused on how we interact with the system.

Apple maintained a tried-and-true hierarchical menu and ultra-simple remote. Amazon brought voice control and Google decided to forgo an interface at all, tying it right into your mobile device. Both Amazon and Google's approach feel almost like gimmicks rather than useful additions to aid in consuming content. Even with federated search, none address the general difficulty of finding something to watch.

Content providers have been similarly uninspired. Dish Network's Sling service is inexpensive and considerably slimmed down from most cable packages, but ultimately just a digital version of what we have today. We're still paying for channels we don't want, and there's no acknowledgement that over-the-top TV can take advantage of its digital roots and be better (or at least different) than what we have today.

Where's the innovation in the experience?

I've been mulling over the *10-foot interface* for some time--starting years and years (and years) ago with MythTV. With interest in the space heating up, I thought it was time to plant my flag as to what I'd like to see in a new-age television system.

## Apps as Channels (Apps as TV Shows?)

In many ways, we're already seeing this, making it almost too obvious to list. With the introduction of HBONow & CBS AllAccess, we have a number of content companies engaging directly with the consumer.

This idea needs to grow in a post-cable era to allow content companies to package together programming in smart, innovative ways. 

A largely-undiscussed benefit of the cable company / media conglomerate structure is that it frees the media companies from having to maintain infrastructure, customer support and billing. By turning channels into apps, these media companies can take advantage of massive existing storefronts--namely the App Store and Google Play--that can handle all the dirty work of subscriptions and transactions.

I can't say I'm entirely confident the media companies will play well with others--the [Aereo case][aereo] is a shining example--and there's a strong chance they'll over-value their programming and want to bundle all of their properties into one big (expensive) application.

Short term, we're going to have to be ok with that. CBS AllAccess costs **$6 per month**--an absurd amount of money considering Netflix has more content, is available on every device under the sun and costs just a few bucks more.

Long term, apps-as-channels opens the door to great improvisation for the media companies. Disney can bundle their entire empire into a single app and CBS can create a *Two Broke Girls* app we can all ignore. Collegiate teams can create focussed apps for a conference, school or sport.

For years I've read on the cord-cutters subreddit that users would be happy to pay for an HBO-only subscription. With the release of HBONow, that wish has been fulfilled and replaced with rumblings that they wish they really only buy Game of Thrones. The channel-as-app model allows HBO to consider this if it makes economic sense.

It might lead to a tangle of small apps representing a fraction of the content available on a network, but it'll also open up a world of truly one-to-one customer-to-content connections.

## Extension Points

When I'm browsing my TV, the last thing I want is to constantly "code switch" as each new app presents a different interface and set of options for finding content. While the ability for companies to tailor their content is extremely important, the user experience requires a strong guiding hand and a framework that keeps the end-user in control.

I'm not sure anyone does that better than Apple. The new Apple Watch feature "Glances" is a prime example--it allows apps to push whatever data is necessary to make them functional, but does so in a way that presents a consistent interface.

What's really interesting about this is that I rarely use the "app" on my watch. The glance is often exactly what I'm looking for.

Our new-world TV interface should work the same way.

### Global Queue

Before getting to anything fancy (and, honestly, if that's what you're looking for, you might want to find another article), let's start by catching up to the humble DVR we've come to know, love and despise for the last 15 years.

A **global queue** would allow any app to push a *shortcut* to content to a centrally-managed list. Shows in Netflix's "My List" could live next to YouTube's "Watch Later" videos. The supplying app would provide a bare amount of data (title, image, played status, description) and the system would handle the display and browsing of the content. Two-way communication would be necessary to allow the global queue the ability to mark a video "watched" or "removed".

Selecting any piece of content would launch the appropriate app and take you directly to the video or detail, with only a momentary delay as the app loads.

I have a number of items bookmarked in the five or six services I use, and I *never* remember them when I'm ready to shut down in front of the TV. A simple global queue stops me from having to remember and hunt down my content. Once I've subscribed to *House of Cards*, the new season will just get pushed to my queue.

<video poster="/media/global-queue.m4v.png" src="/media/global-queue.m4v" width="1280" height="720" type="video/mp4" controls></video>

### Information Architecture

Obviously your TV and phone are not the same, but many of the systems I've played with treat the interface that way. Trawling through a screen packed with icons is not ideal, and the only way to prevent that is through some method of organization. While it's tempting to simply provide a simple folder-like interface, I don't see that model working for the big screen. It's too manual to do with a remote and too putzy for most folks to engage.

Instead, I'd propose that applications register as one of a few types:

* Television & Video
* Game
* Photos
* Music
* Application

I'm sure this list is missing something--it isn't intended to be a complete taxonomy--but automatic categorization has a few benefits. It reduces clutter on the screen without expecting users to organize their apps manually (most wouldn't anyway--read up on the [paradox of the active user][paradox] for more info) and it keeps initial decision-making low.
With the screen clear of icon debris, we now have an opportunity to enable another time-saving enhancement: a scrolling global-queue list of your most recent content.

<video poster="/media/information-architecture-home.m4v.png" src="/media/information-architecture-home.m4v" width="1280" height="720" type="video/mp4" controls></video>

## Streams

Even as video on the web has gotten better--higher quality, better availability--it hasn't been able to shake it's broadcast roots. It's designed to be a single entity beamed to the masses, with no acknowledgement of personalization or any sort of advanced features enabled by a connection to the Repository of all Human Knowledge &reg;.

### Interactive Extras

The Apple Watch has me thinking more about specific interactions that lead to consistent results. Force Touch doesn't seem to be there quite yet (it's always a bit of a guess as to what options you're going to get!), but the idea that we could have a button dedicated on the remote to do something specific is intriguing.

I watch a lot of college hoops. Like any good sports nut, I'm constantly interested in the stats. *How many fouls does he have?* or *How many assists is that?* While I can keep my iPad handy at all times, it doesn't really work when watching with a group. I'm not interested in being the stats announcer.

<video src="/media/data-stream.m4v" poster="/media/data-stream.m4v.png" width="1280" height="720" type="video/mp4" controls></video>

This is something that could be easily misused, but it isn't difficult to foresee scenarios in any type of television where having some behind-the-scenes or more detailed information would be useful and build a greater connection between the viewer and the content.

### Ticker

ESPN knows a lot about me. I've been a magazine subscriber, an avid poster on their message boards, and have customized their apps to show only the teams and sports I'm interested in. It's suspect that the "news" ticker on WatchESPN is the same one seen by everyone else on the planet, embedded into the video stream with no way to customize.

Taking this a small step further, if I'm ok with the intrusion of the ticker, why would I want to limit it to the context of the content I'm currently watching? Isn't breaking political news just as important, or a tweet from a friend more relevant?

Tickers would work much like they work on the Apple Watch, or how Google Now works for Android devices. Applications can provide data to a standard interface--maybe a notification like on a PC or a news-ticker like on CNN--and that data will simply scroll past.

<video src="/media/glances.m4v" poster="/media/glances.m4v.png" width="1280" height="720" type="video/mp4" controls></video>

We'll have to work out some type of "do not disturb" functionality, and in-practice the constant intrusion might be too much, but I'm tired of CNN scrollers with late-breaking news about the Kardashians. I can't be the only one.

## Wrapping Up

The sky's the limit when it comes to the TV interface. It's going to take a company willing to twist some arms and standardize portions of the interface to get it right.

I'll be watching WWDC in June to see if that company is Apple.

[aereo]: http://en.wikipedia.org/wiki/American_Broadcasting_Cos._v._Aereo,_Inc.
[paradox]: http://www.nngroup.com/articles/paradox-of-the-active-user/

