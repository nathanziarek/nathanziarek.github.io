---
layout: article
title: Google Ups the Ante with Analytics Enhancements
excerpt: 
permalink: 2009-22-22-google-ups-the-ante-with-analytics-enhancements
categories: google-analytics 
published: true
author: Nathan Ziarek
---

## Google Ups the Ante with Analytics Enhancements  
\[ Posted [Thu, 22 Oct 2009 10:00:00][0] \]

I doubt I'll ever understand how Google is able to justify continued development on this excellent tool, but I know enough not to look a gift horse in the mouth. (Actually, as a bit of a city boy, I really don't know not to do that, but hope I'll remember the adage should the situation ever present itself).

This most recent set of enhancements touch features across the board, including mobile tracking, table filtering, advanced segments and custom reports.

Three things really pop out at me:

1. **Mobile tracking** is really just the Google-blessed version of many of the server-side tracking solutions out there to address mobile devices with poor JavaScript support. I find it underwhelming --- easily the weakest of this crop --- in that it is very specialized. As we move into single content sources with targeted stylesheets controlling the output to screen, I think we'll move away from specialty mobile sites. These workarounds for _web sites_ will be short-lived, but leave it to Google:

> What's more, for apps on Android devices, usage can be tied back to ad campaigns: from ad to marketplace to download to engagement. ([Analytics Tracking for Mobile Apps][1])
> 

2. I've long thought that the most effective way to monetize Twitter was to take their wealth of realtime data and throw money at some innovative statisticians to develop algorithms and useful metrics that companies don't even know they **need** access to.

Google seems to have done something similar (although, again, I don't know how without charging for it) with their "**Intelligence**" system. Their analytic experts have poured through data to discover useful metrics and then developed algorithms that can automatically spot anomalies in your data. "Last Tuesday saw double the number of pages per visit on average" or "this week saw an extraordinarily high bounce rate."

I love this sort of work because it gives non-experts a chance to understand the data that makes up their site in a way that's easy to follow.
3. 
**[Custom Variables][2]** are going to rock, and they are going to rock hard. Pushing aside the five variable limit, their implementation (living at either the page, visitor or session level) are going to open the door to all manner of innovative and powerful metrics.

I'm still a little unclear on how these will interact with the previous single variable you could set (`_setVar()` anyone?), but imagine that relatively low-power add-on will be depreciated in due course.

**UPDATE**: \_setVar() has indeed been depreciated. I'm in the process of porting my includes over to the new custom tracking code, although I doubt Google will be dropping support for the old way any time soon.

There's lots more --- including video of the new features --- over at [Google's Analytics blog][3]. If this kind of stuff gets your engine revved up, I suggest you take a few minutes to get acquainted.

Am I nuts to think this is really cool stuff?

Tagged with: google analytics


[0]: http://nathanziarek.tumblr.com/post/220035154
[1]: http://code.google.com/apis/analytics/docs/tracking/mobileAppsTracking.html
[2]: http://code.google.com/apis/analytics/docs/tracking/gaTrackingCustomVariables.html
[3]: http://analytics.blogspot.com/2009/10/google-analytics-now-more-powerful.html