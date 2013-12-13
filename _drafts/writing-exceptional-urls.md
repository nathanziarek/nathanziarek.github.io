{{{
    "summary": "It's easy to get lulled into thinking URLs don't matter...but they're part of the interface. Learn to love them.",
    "keywords": ["urls", "seo", "ux", "canonical"],
    "status": "draft",
    "publishedOn": "January 1 2031"
}}}

#Writing Exceptional URLs

Even in the age of AJAX and mobile apps, URLs still act as the building block of modern websites. Creating stronger URLs *probably* won't win you any awards or help you get the girl (guy), but they will make your site appear notably more professional and help provide cleaner analytics reports.

##Why This Matters

###Analytics

Even in modern analytics packages, URLs are the building blocks of the interaction model. Standard, persistent URL structures properly aggregate metrics and aid in building understandable reports.

###Search Engine Optimization (SEO)

To maximize value from a search engine results page (SERP), you need to (1) be present and (2) garner clicks.

Search engines qualify results based any number of attributes, but the most important is keyword coverage; using the same words and phrases as your customers. The more confident the search engine is a page is about the searcher’s query, the higher it ranks in the results. Matching keywords in the URL increases the search engine’s confidence in the page.

Getting users to click relies on visibility – being high on the page and differentiating the look of your result. SEs like Google bold matched keywords and users spend 24% of their time glancing at the URL [1]. It aids in confidence.

###User Experience

URLs are for people, not computers. [2]

We found that searchers are particularly interested in the URL when they are accessing the credibility of a destination. If the URL looks like garbage, less people are likely to click on that search hit. On the other hand, if the URL looks like the page will address the user’s question, they are more likely to click. [3]

Hierarchical URLs provide confidence that the user is in the correct area. It also provides hack-ability, allowing users to remove portions of the URL to gain access to a broader set of results like breadcrumbs.

###Social

Good URLs act as a UI – provide context about the link and understanding. consider email [3], twitter and facebook. Users look at URLs to determine if they want to click. Twitter truncates...

##Making a good URL.

###Keep them short

SEO – Users more likely to click on short URLs in search results according to marketing sherpa [4], Google weights the words in long titles a little less [5]

Social – Twitter only shows the domain and the next 15 characters

###Make them hackable

SEO – Search engines will take a URL and attempt to visit each “folder” in the structure

Ux – Users will cut off product name to see other, similar products.

Directories should end in /, pages do not need to end in anything [6]

###Make them mutable

You don’t want to change URLs frequently [7], if at all, but there will be time when a product name changes and you want the URL to reflect that.

A standard method of doing this is including a unique identifier in the URL name-of-page-ABC123.html

###Follow good canonicalization

 * Use dashes (instead of underscores) when replacing spaces or other non-alphanumeric characters.
 * URLs are case sensitive [8], so stick with a standard capitalization scheme. While any scheme will work, all lowercase is easier to type and generally looks nicer rendered as a string.

###Stay away from subdomains

Subdomains needlessly make the URL longer and cut into the available space to be used for keywords and product names.

<!--
/catalog/name-of-product-uniqueid
URL Filenames Are Dynamically Generated
Manually creating URLs for all products in a non-starter due to the sheer size of the catalogs. For keyword-rich URLs to realistically work, they will need to be dynamically generated.

Manually creating URLs is a non-starter due to the sheer size of the catalog. URLs for products and categories should be dynamically driven according to the following algorithm:
Remove all non-alphanumeric characters (except dashes); Crush multiple spaces to one space; Replace spaces with dashes; append product id to end
URLs should be editable
I’ve seen time where automatic URLs create embarrassing or incorrect descritions. The that end, URLs should be editable. Past URLs should 301 redirect to the new URL.



You don’t want to edit them often—ideally at all—since every new URL will require time to get back to the SEO ranking of the last one, but manually creating URL
Define top-level category by site hierarchy
•    Catalog -- /catalog/name-of-product OR Product /product/name-of-product
•	Category -- /category/healthcare/blood-pressure-cuffs
•	Invoice -- /invoice/invoice-number
•	Order History – /order-history/po-number
•	Search -- /search



Domain Name
Stick with custom domain name instead of a subdomain
Folder Structure
We need to consider what data we might want to grab out of a URL. Do we care about manufacturers or catalogs?
/catalog/dsef/title-of-product   vs   /3m/legal-pad
File Name
Don’t add an “.html” to the end. Strip out all unnecessary words (to, and, the). Place manufacturer name at the end “by Pancea”
Pages must exist at every level
Separate category structure from product structure from spend management structure

De-dupe – should we remove the same words if they occur repeatedly? i.e. http://www.medline.com/product/Excel-Extra-Wide-Wheelchairs/Extra-Wide/Bariatric/Z05-PF05040 -- favor the later version? http://www.medline.com/product/Excel-Wheelchairs/Extra-Wide/Bariatric/Z05-PF05040
 
Works Cited
[1] 	E. Cutrell and Z. Guan, "An eye-tracking study of information usage in Web search: Variations in target position and contextual snippet length," Microsoft Research, Redmond, 2007.
[2] 	A. Bonini, "URLs are for People, not Computers," 5 4 2013. [Online]. Available: http://www.not-implemented.com/urls-are-for-people-not-computers/. [Accessed 6 4 2013].
[3] 	J. Nielsen, "URL as UI," 21 3 1999. [Online]. Available: http://www.nngroup.com/articles/url-as-ui/. [Accessed 9 4 2013].
[4] 	Marketing Sherpa, "3,186 Search Marketers Reveal What Tactics Work & What Don't in SEM," 12 10 2007. [Online]. Available: http://www.marketingsherpa.com/article/3186-search-marketers-reveal-what. [Accessed 11 4 2013].
[5] 	S. Spencer, "Interview with Google’s Matt Cutts at Pubcon," 31 1 2008. [Online]. Available: http://www.stephanspencer.com/matt-cutts-interview/. [Accessed 11 4 2013].
[6] 	J. Jacek, "Clean URL Design - Best Practices," 12 5 2011. [Online]. Available: http://rield.com/how-to/url-design. [Accessed 15 4 2013].
[7] 	M. McGee, "7 Rules for Writing URLs," 9 6 2009. [Online]. Available: http://www.smallbusinesssem.com/7-rules-for-writing-urls/2043/. [Accessed 11 4 2013].
[8] 	J. Sherrod, "Case Sensitive URLs and SEO – Case Matters," 2 2013. [Online]. Available: http://www.searchdiscovery.com/blog/seo/case-sensitive-urls-and-seo-case-matters/. [Accessed 15 4 2013].
[9] 	T. Berners-Lee, "Cool URIs don't change," W3C, [Online]. Available: http://www.w3.org/Provider/Style/URI.html. [Accessed 1998].
[10] 	Google, 16 10 2012. [Online]. Available: http://support.google.com/webmasters/bin/answer.py?hl=en&answer=76329. [Accessed 8 4 2013].
-->
