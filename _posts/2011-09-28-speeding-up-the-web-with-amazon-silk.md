---
layout: article
title: Speeding up the Web with Amazon Silk
snippet: 
permalink: speeding-up-the-web-with-amazon-silk
published: true
author: Nathan Ziarek
categories: []
---


Amazon today released the details about a few upcoming Kindles. The devices themselves are interesting, although evolutionary. The [Kindle Fire][1] might be the first Android tablet to seriously challenge the iPad in the tablet space.

The fascinating bit is the new browser Amazon has developed named [Silk][2]. It utilizes Amazon's massive cloud computing infrastructure to offload some of the work of rendering a page. It may turn out to be nothing more than the system Opera has in place for the Opera mini browser, but it's an interesting rethinking of the browser at a time when highly-portable devices are tearing up the sale charts (netbooks, smartphones, the iPad).

Silk works by funneling parts of your request through AWS. Amazon claims the browser is able to make real-time, dynamic decisions as to how to use the cloud infrastructure. Are you requesting a 10 megapixel image? EC2 can rapidly downsample and deliver an 80kb instead of an 80Mb one. Amazon doesn't mention it, but they are also very capable of compressing the HTML, both in terms of removing whitespace and gzipping. Add together a number of these changes, and you might possibly shave off 50% of the total download weight.

Running everything through an optimized server has other benefits as well. Once the server connection is made to EC2, those powerful, distributed, connected computers can make all future requests on your behalf. The fewer HTTP connections you make, the faster the overall experience can be. This has the possibility to make the Silk browser *fly*.

Speed matters, and Silk may have it in spades.

The other enhancement Amazon announced was something akin to precognition. As they gather data on where people visit (privacy issues galore), they can start to preload the next most likely link.

The proof is in the pudding. This might turn out to be a slightly more famous version of what Opera already has accomplished. Still, I love the innovation.

 [1]: http://www.amazon.com/gp/product/B0051VVOB2/ref=as_li_ss_tl?ie=UTF8&tag=lattothepar07-20&linkCode=as2&camp=217145&creative=399373&creativeASIN=B0051VVOB2 "Kindle Fire"
 [2]: http://www.amazon.com/silk/ "Amazon Silk"