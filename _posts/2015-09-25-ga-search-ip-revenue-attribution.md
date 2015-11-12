---
layout: article
title: Google Analytics Revenue Attribution for Search Terms and Internal Promotions
excerpt: Understanding the revenue numbers from the Internal Promotion and Search Term reports.
permalink: google-analytics-revenue-attribution-search-internal-promotion
published: true
author: Nathan Ziarek
categories: [GoogleAnalytics]
image: /media/internal-promotion.png
---

Google Analytics is often a complete black box. Information comes in and reports pop out, but *what* those numbers mean is  hidden.

After implementing a fairly thorough installation of Internal Promotions within the Enhanced Commerce tools, we were stuck with some important questions:

*How are these promotions impacting sales? What does the revenue column on the internal promotions report mean? How is revenue attributed to a promotion?*

Hours of searching and comments on Twitter lead us nowhere. Intentional or not, the GA team is not forthcoming with how these values are calculated.

The information is important, so we took the time to create a new profile and run some tests. The results are disappointingly simple: **both search terms and internal promotions attribute revenue based on the last interaction.**

What does this mean? Let's look at a couple of scenarios:

## Scenario One

John browses to your site and search for "bags". He refines his search to "leather bags", finds a product and purchases it for $100.

| Search Term  | Unique Searches   | Revenue   | Transactions  | AoV     | Conversion Rate | Per Search |
| ------------ | :----------------:|----------:|:-------------:|--------:|----------------:|-----------:|
| bags         | 1                 | 0.00      | 0             | 0.00    | 0%              | 0.00       |
| leather bags | 1                 | 100.00    | 1             | 100.00  | 100%            | 100.00     |

The term "bags" gets no revenue attributed to it, while "leather bags" get the entire transaction amount.

## Scenario Two

Anne visits your site and sees a **gloves** promotion on the homepage. She ignores it and browses around before seeing a **boots** promotion that she clicks on. She finds a great pair of shoes she adds to the cart. She continues to browse for a pair of jeans, finding a buy-one-get-one promotion that she clicks on. Nothing catches her fancy, so she buys the boots for $50.

| Promotions    | Impressions    | Clicks     | CTR    | Transactions   | Revenue   | 
| ------------- | :------------: | :--------: | -----: | -------------: | --------: |
| Gloves        | 1              | 0          | 0%     | 0              | 0.00      |
| Boots         | 1              | 1          | 100%   | 0              | 0.00      |
| Jeans         | 1              | 1          | 100%   | 1              | 50.00     |

Promotions for *gloves*, *boots*, and *jeans* were seen, but only *jeans* gets any credit for the transaction.

This particular scenario was interesting. We used the [add-to-cart action of the Enhanced Commerce tool][1] directly after the click to the *boots* promotion. It was assumed that this would give Google Analytics an indication that the revenue from that purchase should be attributed to the *boots* promotion. Yet, Google Analytics funneled that spend to the *jeans* promotion.

## Suggestions

### Attribution Models

Google Analytics already has a concept of 'attribution models' for use in campaign tracking and referral traffic. This tool can perform adjustments to how revenue is allocated to transactions that occurred after several other interactions. A customer that received an email, then clicked a banner ad before ultimately purchasing could have their transaction apply only to the last interaction (the banner click), spread 50/50, or any other number of possibilities.

Google could potentially enable a similar tool here. In our second scenario above, I'd much prefer that the $50 transaction was spread evenly over all three promotions. While this gives two promotions 'credit' for a conversion they didn't take part in, it  at least attributes the *boots* promotion with something.

Long term, if the *boots* promotion is driving sales, it'll bubble up to the top. Take an example of Peter, Paul, and Mary seeing these same three promotions:

| Person    | Gloves Promo  | Boots Promo   | Jeans Promo   | Transaction   |
| --------- | :-----------: | :-----------: | :-----------: | ------------: |
| Peter     | Clicked       | Seen          | Clicked       | $100.00       |
| Paul      | Seen          | Clicked       | Clicked       | $200.00       |
| Mary      | Seen          | Seen          | Seen          | $50.00        |
| Attributed| $50.00        | $100.00       | **$150.00**   |               |

The *jeans* promotion had to share it's success with the other two running promotions, but over time the revenue it'd bring in would grow as a product of it's success.

Even if this model isn't applicable to your business, the ability to choose the right attribution model would have huge benefits.

### Add to Cart

A better model would be to stick with last interaction attribution but take into account where the "add to cart" action took place. Looking back to scenario 2, we had the following actions:

1. Glove Promotion Viewed
2. Boot Promotion Viewed & Clicked
3. Boots Added to Cart ($50)
4. Jean Promotion Viewed & Clicked
5. Checkout

The "Add to Cart" interaction took place directly after the Boot Promotion was clicked. Using that as our last interaction means all $50 of this transaction would be attributed to the Boot Promo.

This model isn't perfect, but it's much closer to the intent of the customer. Let's take another quick scenario:

1. Glove Promotion Clicked
2. Boot Promotion Clicked
3. Boots Added to Cart ($100)
4. Jean Promotion Clicked
5. Jeans Added to Cart ($150)

Again, using the last-interaction model, we'd see *Boot* get credit for $100 of the sale and *Jeans* with credit for $150. The glove promotion, while clicked, doesn't get any credit for the transaction.

## Summary

These models are just frameworks to crunch large amounts of data into actionable insights. Without sitting with the customer, we're never going to know if a promotion from the homepage made them think of something else, eventually leading to a purchase of something totally unrelated.

However, being smarter with the data at our disposal gets us closer to understanding the user flow at a high level and is definitely worth the time to instrument the data collection.

[1]: https://developers.google.com/analytics/devguides/collection/analyticsjs/enhanced-ecommerce#add-remove-cart
