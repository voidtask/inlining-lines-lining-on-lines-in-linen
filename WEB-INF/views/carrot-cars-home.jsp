<%@ page language="java" contentType="text/html; charset=utf8" pageEncoding="utf8"%>
<%@ taglib uri="http://www.springframework.org/tags" prefix="spring"%>
<%@ taglib uri="jakarta.tags.core" prefix="c" %>
<%@ taglib uri="jakarta.tags.fmt" prefix="fmt" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <link rel="alternate" type="application/rss+xml" title="Carrot Cars RSS" href="https://www.carrotcars.co.uk/rss.xml" />
    <link rel="alternate" type="application/rss+xml" title="Carrot Cars News Feed" href="https://www.carrotcars.co.uk/news/feed" />
    <link rel="alternate" type="application/rss+xml" title="Carrot Cars Press Release Feed" href="https://www.carrotcars.co.uk/press-releases/feed" />
    <link rel="alternate" type="application/rss+xml" title="Carrot Cars Case Study Feed" href="https://www.carrotcars.co.uk/case-studies/feed" />
    <link rel="alternate" type="application/rss+xml" title="Carrot Cars Blog" href="https://www.carrotcars.co.uk/blog/feed" />
    <link rel="shortcut icon" href="/sites/carrotcars.co.uk/files/favicon.ico" type="image/x-icon" />
    <meta name="description" content="Cheap, clean &amp; reliable minicabs" />
    <meta name="abstract" content="Cheap, clean &amp; reliable minicabs" />
    <meta name="keywords" content="Docklands Taxi,E14 Taxi,Canary Wharf Taxi" />
    <meta name="copyright" content="Copyright © 2009-2011 Flashbit LLC. All rights reserved." />
    <link rel="canonical" href="https://www.carrotcars.co.uk/" />
    <meta name="revisit-after" content="1 day" />
    <link type="text/css" rel="stylesheet" media="all" href="/inline-booking-static/resources/company/${companyResources}/css/home-page/fpss-CC-Rasper.css?B" />
    <link type="text/css" rel="stylesheet" media="all" href="/inline-booking-static/resources/company/${companyResources}/css/home-page/node.css?B" />
    <link type="text/css" rel="stylesheet" media="all" href="/inline-booking-static/resources/company/${companyResources}/css/home-page/defaults.css?B" />
    <link type="text/css" rel="stylesheet" media="all" href="/inline-booking-static/resources/company/${companyResources}/css/home-page/system.css?B" />
    <link type="text/css" rel="stylesheet" media="all" href="/inline-booking-static/resources/company/${companyResources}/css/home-page/system-menus.css?B" />
    <link type="text/css" rel="stylesheet" media="all" href="/inline-booking-static/resources/company/${companyResources}/css/home-page/user.css?B" />
    <link type="text/css" rel="stylesheet" media="all" href="/inline-booking-static/resources/company/${companyResources}/css/home-page/content-module.css?B" />
    <link type="text/css" rel="stylesheet" media="all" href="/inline-booking-static/resources/company/${companyResources}/css/home-page/date.css?B" />
    <link type="text/css" rel="stylesheet" media="all" href="/inline-booking-static/resources/company/${companyResources}/css/home-page/datepicker.1.7.css?B" />
    <link type="text/css" rel="stylesheet" media="all" href="/inline-booking-static/resources/company/${companyResources}/css/home-page/jquery.timeentry.css?B" />
    <link type="text/css" rel="stylesheet" media="all" href="/inline-booking-static/resources/company/${companyResources}/css/home-page/filefield.css?B" />
    <link type="text/css" rel="stylesheet" media="all" href="/inline-booking-static/resources/company/${companyResources}/css/home-page/transporter_booker.css?B" />
    <link type="text/css" rel="stylesheet" media="all" href="/inline-booking-static/resources/company/${companyResources}/css/home-page/fieldgroup.css?B" />
    <link type="text/css" rel="stylesheet" media="all" href="/inline-booking-static/resources/company/${companyResources}/css/home-page/views.css?B" />
    <link type="text/css" rel="stylesheet" media="all" href="/inline-booking-static/resources/company/${companyResources}/css/home-page/socialdock.css?B" />
    <link type="text/css" rel="stylesheet" media="all" href="/inline-booking-static/resources/company/${companyResources}/css/home-page/style.css?B" />
    <link type="text/css" rel="stylesheet" media="print" href="/inline-booking-static/resources/company/${companyResources}/css/home-page/print.css?B" />
    <%--<script type="text/javascript" src="/inline-booking-static/resources/company/${companyResources}/js/home-page/jquery.js?B"></script>--%>
    <%--<script type="text/javascript" src="/lib/jquery-1.11.1.js"></script>--%>
    <script type="text/javascript" src="/inline-booking-static/resources/company/${companyResources}/js/home-page/drupal.js?B"></script>
    <script type="text/javascript" src="/inline-booking-static/resources/company/${companyResources}/js/home-page/swfobject.js?B"></script>
    <script type="text/javascript" src="/inline-booking-static/resources/company/${companyResources}/js/home-page/transporter_booker.js?B"></script>
    <script type="text/javascript" src="/inline-booking-static/resources/company/${companyResources}/js/home-page/jquery.alphanumeric.min.js?B"></script>
    <script type="text/javascript" src="/inline-booking-static/resources/company/${companyResources}/js/home-page/jquery.cookie.js?B"></script>
    <script type="text/javascript" src="/inline-booking-static/resources/company/${companyResources}/js/home-page/googleanalytics.js?B"></script>
    <script type="text/javascript" src="/inline-booking-static/resources/company/${companyResources}/js/home-page/jquery-comp.js?B"></script>
    <script type="text/javascript" src="/inline-booking-static/resources/company/${companyResources}/js/home-page/jquery-fpss-comp.js?B"></script>
    <script type="text/javascript" src="/inline-booking-static/resources/company/${companyResources}/js/home-page/base.js?B"></script>
    <script type="text/javascript" src="/inline-booking-static/resources/company/${companyResources}/js/home-page/ajax_view.js?B"></script>
    <script type="text/javascript" src="/inline-booking-static/resources/company/${companyResources}/js/home-page/jquery.form.js?B"></script>
    <script type="text/javascript" src="/inline-booking-static/resources/company/${companyResources}/js/home-page/ahah.js?B"></script>
    <script type="text/javascript" src="/inline-booking-static/resources/company/${companyResources}/js/home-page/jquery.alphanumeric.min.cc.js?B"></script>
    <script type="text/javascript" src="/inline-booking-static/resources/company/${companyResources}/js/home-page/carrotpal.js?B"></script>
    <script type="text/javascript" src="/inline-booking-static/resources/company/${companyResources}/js/home-page/retina.min.js?B"></script>
    <script type="text/javascript" src="/inline-booking-static/resources/company/${companyResources}/js/home-page/account_application.js?B"></script>
    <script type="text/javascript" src="/inline-booking-static/resources/company/${companyResources}/js/home-page/guestlist.js?B"></script>
    <script type="text/javascript" src="/inline-booking-static/resources/company/${companyResources}/js/home-page/jquery-feedbackradio.min.js?B"></script>
    <script type="text/javascript" src="/inline-booking-static/resources/company/${companyResources}/js/home-page/scripts.js?B"></script>


    <jsp:include page="head/properties.jsp"/>
    <%--<%@include file="head/properties.txt" %>--%>

    <c:choose>
        <c:when test="${debug == true}">
            <jsp:include page="head/resources-dev.jsp"/>
        </c:when>

        <c:otherwise>
            <jsp:include page="head/resources-prod.jsp"/>
        </c:otherwise>
    </c:choose>

    <script type="text/javascript">
        <!--//--><![CDATA[//><!--
        jQuery.extend(Drupal.settings, { "basePath": "/", "themePath": "/sites/carrotcars.co.uk/themes/carrotcars", "ajaxURL": "/transporter_booker/book", "quoteRemark": "Please allow 5 minutes to respond in order to offer you the best price.", "specialRequestTip": "", "googleanalytics": { "trackOutbound": 1, "trackMailto": 1, "trackDownload": 1, "trackDownloadExtensions": "7z|aac|arc|arj|asf|asx|avi|bin|csv|doc(x|m)?|dot(x|m)?|exe|flv|gif|gz|gzip|hqx|jar|jpe?g|js|mp(2|3|4|e?g)|mov(ie)?|msi|msp|pdf|phps|png|ppt(x|m)?|pot(x|m)?|pps(x|m)?|ppam|sld(x|m)?|thmx|qtm?|ra(m|r)?|sea|sit|tar|tgz|torrent|txt|wav|wma|wmv|wpd|xls(x|m|b)?|xlt(x|m)|xlam|xml|z|zip", "trackDomainMode": "1" }, "views": { "ajax_path": "/views/ajax", "ajaxViews": [ { "view_name": "news", "view_display_id": "block_1", "view_args": "", "view_path": "node/4", "view_base_path": "news", "view_dom_id": 1, "pager_element": 0 } ] }, "ahah": { "btn-view-booking-form": { "url": "/transporter_booker/block/booking/form", "event": "click", "keypress": null, "wrapper": "transporter-booker-block-wrapper", "selector": "#btn-view-booking-form", "effect": "none", "method": "replace", "progress": { "type": "NONE" }, "button": { "op": "Book it!" } }, "btn-view-quotation-form": { "url": "/transporter_booker/block/quotation/form", "event": "click", "keypress": null, "wrapper": "transporter-booker-block-wrapper", "selector": "#btn-view-quotation-form", "effect": "none", "method": "replace", "progress": { "type": "NONE" }, "button": { "op": "Get a quote!" } } } });
        //--><!]]>
    </script>
    <script type="text/javascript">
        <!--//--><![CDATA[//><!--
        (function(i,s,o,g,r,a,m){i["GoogleAnalyticsObject"]=r;i[r]=i[r]||function(){(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)})(window,document,"script","//www.google-analytics.com/analytics.js","ga");ga("create", "UA-4156571-11", { "cookieDomain": "carrotcars.co.uk" });ga("send", "pageview");
        //--><!]]>
    </script>
    <script type="text/javascript">
        <!--//--><![CDATA[//><!--
        var speed_delay = 8000;var slide_speed = 500;var fpssLoaderDelay = 500;var CTRrotateAction = 'click';
        //--><!]]>
    </script>
    <!--[if lt IE 9]>
    <link type="text/css" rel="stylesheet" media="all" href="/sites/carrotcars.co.uk/themes/carrotcars/styles-ie.css">
    <script src="//html5shim.googlecode.com/svn/trunk/html5.js"></script>
    <![endif]-->
    <title>Cheap, Clean, Reliable Minicabs! | Carrot Cars</title>
</head>

<body>

<div id="wrapper">

    <header>
        <div class="header--left">
            <div id="block-block-4" class="clear-block block block-block block-region-header_left ">
                <div class="content"><div class="phone"><span>0207 </span><span>005 </span><span>0557 </span></div>
                </div>
            </div><div id="block-socialdock-1" class="clear-block block block-socialdock block-region-header_left ">
            <div class="content">  <ul class="cf">
                <li>
                    <a href="https://www.facebook.com/carrotcars"target="_blank" title="Facebook profile" class="icon-facebook">Facebook profile</a></li>
                <li>
                    <a href="https://twitter.com/CarrotCars"target="_blank" title="Twitter profile" class="icon-twitter">Twitter profile</a></li>
                <li>
                    <a href="https://plus.google.com/+CarrotCarsLondon/about?hl=en"target="_blank" title="Google+ profile" class="icon-googleplus">Google+ profile</a></li>
                <li>
                    <a href="https://www.pinterest.com/carrotcars"target="_blank" title="Pinterest profile" class="icon-pinterest">Pinterest profile</a></li>
                <li>
                    <a href="https://carrotcars.co.uk/blog/feed"target="_blank" title="RSS feed" class="icon-rss">RSS feed</a></li>
            </ul>
            </div>
        </div>        </div>
        <div class="header--right">
            <div id="block-block-5" class="clear-block block block-block block-region-header_right ">
                <div class="content"><div><a href="/" class="logo">&nbsp;</a></div>
                </div>
            </div>        </div>
        <div id="block-fpss-8" class="clear-block block block-fpss block-region-header ">
            <div class="content"><div id="fpss-outer-container"><div id="fpss-container"><div id="fpss-slider"><div id="slide-loading"></div><div id="slide-wrapper"><div id="slide-outer">
                <div class="slide">
                    <div class="slide-inner">
                        <a class="fpss_img" href="/news/city-airport-taxi">
                <span>
                  <span style="background:url(/inline-booking-static/resources/company/${companyResources}/images/home-page/icons.png) no-repeat;">
                    <span>
                      <img src="/inline-booking-static/resources/company/${companyResources}/images/home-page/icons.png" alt="Click on the slide!" />
                    </span>
                  </span>
                </span>
                        </a>
                        <div class="fpss-introtext">
                            <div class="slidetext">
                                <h3>Affordable airport transfer</h3>
                                <p>Carrot Cars will take you from and to the airport in the blink of an eye at a reasonable price.</p>
                                <a href="/news/city-airport-taxi" class="smallGreenButton"><span>Read more</span></a>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="slide">
                    <div class="slide-inner">
                        <a class="fpss_img" href="/cheap-clean-reliable-minicabs-0">
                <span>
                  <span style="background:url(/inline-booking-static/resources/company/${companyResources}/images/home-page/area-of-operations--2014.png) no-repeat;">
                    <span>
                      <img src="/inline-booking-static/resources/company/${companyResources}/images/home-page/area-of-operations--2014.png" alt="Click on the slide!" />
                    </span>
                  </span>
                </span>
                        </a>
                        <div class="fpss-introtext">
                            <div class="slidetext">
                                <h3>Area of operations</h3>
                                <p>Carrot Cars operates in the following areas of London: Wapping E1, Limehouse E14, Poplar E14, Royal Docks E16, Canary Wharf Docklands E14, City EC2 & EC3&#8230;</p>
                                <a href="/cheap-clean-reliable-minicabs-0" class="smallGreenButton"><span>Read more</span></a>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="slide">
                    <div class="slide-inner">
                        <a class="fpss_img" href="/cheap-clean-reliable-minicabs-1">
                <span>
                  <span style="background:url(/sites/default/files/header.jpg) no-repeat;">
                    <span>
                      <img src="/sites/default/files/header.jpg" alt="Click on the slide!" />
                    </span>
                  </span>
                </span>
                        </a>
                        <div class="fpss-introtext">
                            <div class="slidetext">
                                <h3>Cheap, clean, reliable minicabs!</h3>
                                <p>Carrot Cars drives the best cars at the best price. It’s a bargain for those casual trips around the town.</p>
                                <a href="/cheap-clean-reliable-minicabs-1" class="smallGreenButton"><span>Read more</span></a>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="slide">
                    <div class="slide-inner">
                        <a class="fpss_img" href="/minicab-docklands-taxi">
                <span>
                  <span style="background:url(/sites/carrotcars.co.uk/files/doorhandle.jpg) no-repeat;">
                    <span>
                      <img src="/sites/carrotcars.co.uk/files/doorhandle.jpg" alt="Click on the slide!" />
                    </span>
                  </span>
                </span>
                        </a>
                        <div class="fpss-introtext">
                            <div class="slidetext">
                                <h3>Stop waiting</h3>
                                <p>Stop waiting for something that may not be coming.

                                    Dial 0207 005 0557 for Carrot Cars so you're not left waiting.</p>
                                <a href="/minicab-docklands-taxi" class="smallGreenButton"><span>Read more</span></a>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="slide">
                    <div class="slide-inner">
                        <a class="fpss_img" href="/taxi-canary-wharf-taxi">
                <span>
                  <span style="background:url(/sites/carrotcars.co.uk/files/our-fleet.jpg) no-repeat;">
                    <span>
                      <img src="/sites/carrotcars.co.uk/files/our-fleet.jpg" alt="Click on the slide!" />
                    </span>
                  </span>
                </span>
                        </a>
                        <div class="fpss-introtext">
                            <div class="slidetext">
                                <h3>Clean and comfortable cars</h3>
                                <p>Carrot Cars are continuously aiming to increase their fleet of clean and reliable cars, all fit and fine for your travelling needs.</p>
                                <a href="/taxi-canary-wharf-taxi" class="smallGreenButton"><span>Read more</span></a>
                            </div>
                        </div>
                    </div>
                </div>
            </div></div></div><div id="navi-outer"><div id="pseudobox"></div><div class="ul_container"><ul><li><a class="navbutton off navi" href="javascript:void(0);" title="Click to navigate!">
                <span class="navbar-img"><img src="/inline-booking-static/resources/company/${companyResources}/images/home-page/icons.png" alt="Click to navigate!" /></span>
                <span class="navbar-key">01</span>
                <span class="navbar-title">Affordable airport transfer</span>
                <span class="navbar-tagline">Affordable airport transfer</span>
                <span class="navbar-clr">&nbsp;</span></a></li><li><a class="navbutton off navi" href="javascript:void(0);" title="Click to navigate!">
                <span class="navbar-img"><img src="/inline-booking-static/resources/company/${companyResources}/images/home-page/area-of-operations--2014.png" alt="Click to navigate!" /></span>
                <span class="navbar-key">02</span>
                <span class="navbar-title">Area of operations</span>
                <span class="navbar-tagline">Area of operations</span>
                <span class="navbar-clr">&nbsp;</span></a></li><li><a class="navbutton off navi" href="javascript:void(0);" title="Click to navigate!">
                <span class="navbar-img"><img src="/inline-booking-static/resources/company/${companyResources}/images/home-page/header.jpg" alt="Click to navigate!" /></span>
                <span class="navbar-key">03</span>
                <span class="navbar-title">Cheap, clean, reliable minicabs!</span>
                <span class="navbar-tagline">Cheap, clean, reliable minicabs!</span>
                <span class="navbar-clr">&nbsp;</span></a></li><li><a class="navbutton off navi" href="javascript:void(0);" title="Click to navigate!">
                <span class="navbar-img"><img src="/inline-booking-static/resources/company/${companyResources}/images/home-page/doorhandle.jpg" alt="Click to navigate!" /></span>
                <span class="navbar-key">04</span>
                <span class="navbar-title">Stop waiting</span>
                <span class="navbar-tagline">Stop waiting</span>
                <span class="navbar-clr">&nbsp;</span></a></li><li><a class="navbutton off navi" href="javascript:void(0);" title="Click to navigate!">
                <span class="navbar-img"><img src="/sites/carrotcars.co.uk/files/our-fleet.jpg" alt="Click to navigate!" /></span>
                <span class="navbar-key">05</span>
                <span class="navbar-title">Clean and comfortable cars</span>
                <span class="navbar-tagline">Clean and comfortable cars</span>
                <span class="navbar-clr">&nbsp;</span></a></li><li class="noimages"><a id="fpss-container_next" href="javascript:void(0);" onclick="showNext();clearSlide();" title="Next"></a></li><li class="noimages"><a id="fpss-container_playButton" href="javascript:void(0);" onclick="playButtonClicked();return false;" title="Play/Pause Slide">Pause</a></li><li class="noimages"><a id="fpss-container_prev" href="javascript:void(0);" onclick="showPrev();clearSlide();" title="Previous"></a></li><li class="clr"></li></ul></div></div><div class="fpss-clr"></div></div><div class="fpss-clr"></div></div></div>
        </div>                  <ul id="mainMenu"><li class="menu-307 active-trail first active"><a href="/cheap-clean-reliable-minicabs-1" title="Welcome to Carrot Cars!" class="active">Home</a></li>
        <li class="menu-1179"><a href="/minicab-docklands-taxi" title="How we can serve you!">Services</a></li>
        <li class="menu-309"><a href="/taxi-canary-wharf-taxi" title="Our Fleet">Our Fleet</a></li>
        <li class="menu-310"><a href="/e14-taxi" title="Accounts">Accounts</a></li>
        <li class="menu-999"><a href="/cheap-london-airport-transfers" title="Cheap London Airport Transfers">Airports</a></li>
        <li class="menu-996"><a href="/pco-minicab-driver-job-docklands-e14" title="Work for us">Driver Jobs</a></li>
        <li class="menu-998 last"><a href="/we-are-here-help" title="Contact us ">Contacts</a></li>
    </ul>                <div class="floatsplit"></div>
    </header>

    <%--todo: update their jquery from 1.2 to 1.11--%>

    <jsp:include page="body/visible.jsp"></jsp:include>

    <div id="leftBar">
        <div id="block-block-7" class="clear-block block block-block block-region-left ">
            <h2>SERVICE AREAS</h2>
            <div class="content"><p style="padding-left: 30px;"><a href="https://www.carrotcars.co.uk/taxi-e1-wapping" title="E1 - Wapping"><strong style="line-height: 10px;">E1 - Wapping</strong></a></p>
                <p style="padding-left: 30px;"><a href="https://www.carrotcars.co.uk/taxi-e14-canary-wharf-docklands" title="taxi e14 docklands"><strong style="line-height: 10px;">E14 - Docklands</strong></a></p>
                <p style="padding-left: 30px;"><a href="https://www.carrotcars.co.uk/taxi-e16-docklands" title="E16 - Docklands"><strong style="line-height: 10px;">E16 - Excel</strong></a></p>
                <p style="padding-left: 30px;"><a href="https://www.carrotcars.co.uk/Taxi-ec2-city-london" title="EC2 taxi"><strong style="line-height: 10px;">EC2 - City of London</strong></a></p>
                <p style="padding-left: 30px;"><a href="https://www.carrotcars.co.uk/Taxi-ec3-city-london" title="EC3 Taxi"><strong style="line-height: 10px;">EC3 - City of London</strong></a></p>
                <p style="padding-left: 30px;"><a href="http://www.carrotcars.co.uk/cheap-london-airport-transfers" title="Cheap London Airport Transfers"><strong style="line-height: 10px;">ALL LONDON AIRPORTS</strong></a></p>
            </div>
        </div><div id="block-menu-menu-helpful-links" class="clear-block block block-menu block-region-left ">
        <h2>Helpful links</h2>
        <div class="content"><ul class="menu"><li class="leaf first"><a href="/live-airport-info" title="LIVE Airport Info">LIVE Airport Info</a></li>
            <li class="leaf"><a href="/live-transport-info" title="LIVE Transport Info">LIVE Transport Info</a></li>
            <li class="leaf"><a href="/places-eat-canary-wharf-docklands-e14" title="Places to eat">Places to Eat</a></li>
            <li class="leaf"><a href="/places-drink-canary-wharf-docklands-e14" title="Places to drink!">Places to Drink</a></li>
            <li class="leaf"><a href="http://www.carrotcars.co.uk/places-stay-canary-wharf-docklands-e14" title="Places to stay!">Places to Stay</a></li>
            <li class="leaf"><a href="/places-see-canary-wharf-docklands-e14-and-surrounding-areas" title="Things to do!">Places to See</a></li>
            <li class="leaf last"><a href="/blog" title="Blog of Carrot Cars">Carrot Cars Blog</a></li>
        </ul></div>
    </div><div id="block-views-news-block_1" class="clear-block block block-views block-region-left ">
        <h2>Recent News</h2>
        <div class="content"><div class="view view-time-relative-list view-news view-id-news view-display-id-block_1 view-dom-id-1">



            <div class="view-content">
                <div class="item-list">
                    <ul>
                        <li class="views-row views-row-1 views-row-odd views-row-first">
                            <div class="views-field-title">
                                <span class="field-content"><a href="/news/carrot-cars-update-improving-docklands-minicab-service" title="Carrot Cars Update - Improving Docklands Minicab Service">Carrot Cars Update - Improving Docklands Minicab Service</a></span>
                            </div>

                            <div class="views-field-created">
                                <span class="field-content">21st November 2015</span>
                            </div>
                        </li>
                        <li class="views-row views-row-2 views-row-even">
                            <div class="views-field-title">
                                <span class="field-content"><a href="/news/carrot-cars-boosts-ec3-city-london-taxi-services" title="Carrot Cars boosts EC3 City of London Taxi Services">Carrot Cars boosts EC3 City of London Taxi Services</a></span>
                            </div>

                            <div class="views-field-created">
                                <span class="field-content">1st April 2015</span>
                            </div>
                        </li>
                        <li class="views-row views-row-3 views-row-odd">
                            <div class="views-field-title">
                                <span class="field-content"><a href="/news/taxi-private-hire-operator-year-2015" title="Taxi & Private Hire Operator of the Year 2015">Taxi & Private Hire Operator of the Year 2015</a></span>
                            </div>

                            <div class="views-field-created">
                                <span class="field-content">17th March 2015</span>
                            </div>
                        </li>
                        <li class="views-row views-row-4 views-row-even">
                            <div class="views-field-title">
                                <span class="field-content"><a href="/news/ski-holiday-transfers" title="Ski Holiday Transfers">Ski Holiday Transfers</a></span>
                            </div>

                            <div class="views-field-created">
                                <span class="field-content">30th January 2015</span>
                            </div>
                        </li>
                        <li class="views-row views-row-5 views-row-odd views-row-last">
                            <div class="views-field-title">
                                <span class="field-content"><a href="/news/london-transport-awards-2015-taxi-private-hire-operator-year" title="London Transport Awards 2015 - Taxi & Private Hire Operator of the year">London Transport Awards 2015 - Taxi & Private Hire Operator of the year</a></span>
                            </div>

                            <div class="views-field-created">
                                <span class="field-content">22nd January 2015</span>
                            </div>
                        </li>
                    </ul>
                </div>    </div>


            <div class="item-list"><ul class="pager"><li class="pager-previous first">&nbsp;</li>
                <li class="pager-current">1 of 8</li>
                <li class="pager-next last"><a href="/cheap-clean-reliable-minicabs-1?page=1" class="active">››</a></li>
            </ul></div>
        </div></div>
    </div>        </div>

    <div id="content" class="">
        <h1>Cheap, Clean, Reliable Minicabs!</h1>
        <h3>This is who we are</h3>
        <p><a href="http://www.transporttimesevents.co.uk/awards-winners.php/London-Transport-Awards-1/" target="_blank" title="Taxi Awards">Taxi &amp; Private Hire Operator of the year</a>&nbsp;-&nbsp;<a href="http://www.transporttimesevents.co.uk/awards-winners.php/London-Transport-Awards-1/" target="_blank" title="Taxi Awards">London Transport Awards 2015</a>.</p>
        <p>Best service in Canary Wharf, Docklands E14, Wapping E1, Excel E16 and surrounding areas -&nbsp;<strong>NOW SERVING EC2 &amp; EC3 IN THE CITY OF LONDON.</strong></p>
        <p>Any London Airport to any London postcode guaranteed.</p>
        <p><img src="/sites/carrotcars.co.uk/files/Canary%20Wharf%20minicab.JPG" alt="canary wharf minicab" title="canary wharf minicab" width="330" /></p>
        <p>Carrot Cars offers a cheap, clean and reliable minicab service for business and residential customers who value speed and quality. A 24/7 365 days a year service to cover everything you can expect from a professional minicab company and more.</p>
        <p><strong>Academy trained staff</strong></p>
        <p>All our drivers and operators are academy trained to ensure our service to you will consistently be friendly, efficient and professional. We invest in our staff with ongoing training programs to keep all continuously passionate of the highest levels of service, and this is what gives us that added 'wow' factor.</p>
        <p><strong>Latest technology</strong></p>
        <p>We use the latest in&nbsp;XDA and satellite technology which helps us locate the nearest vehicle to you, minimising both your waiting and journey times. This GPS tracking technology also enables us to reduce our carbon emission by 20% more than the average minicab company.</p>
        <p><strong>Your Safety</strong></p>
        <p>Your safety is our main priority! Our business has operator licence number 06294/01/01 granted by the London Public Carriage Office (PCO). All our drivers and vehicles have individual PCO minicab licences and have been checked by the CRB. Our cars have their MOT done at least twice a year and every vehicle has a special insurance which also covers you in the unlikely event of a mishap.</p>
        <p>We at Carrot Cars pride ourselves on offering this cheap, clean and reliable ride in comfort to all our clients.&nbsp;</p>
        <p>More information on Minicabs, London Black Taxis and Cabs -<a href="https://www.tfl.gov.uk/modes/taxis-and-minicabs/" target="_blank" title="London black taxis">&nbsp;https://www.tfl.gov.uk/modes/taxis-and-minicabs/</a></p>
        <p><a href="http://transporttimesevents.co.uk/" title="London Transport Times">London Transport Awards 2015</a> - Shortlist Taxi &amp; Private Hire Operator of the year</p>
    </div>

    <div id="rightBar">
        <div id="block-block-6" class="clear-block block block-block block-region-right block--transparent">
            <div class="content"><div><a href="http://www.transporttimesevents.co.uk/awards-winners.php/London-Transport-Awards-1/" target="_blank" title="London Transport Awards 2015"><img src="/sites/carrotcars.co.uk/files/Email%20Signature%20Best%20Taxi%20Service%20Provider.png" alt="London Transport Awards: Taxi &amp; Private Hire Operator of the Year 2015" title="London Transport Awards: Taxi &amp; Private Hire Operator of the Year 2015" width="205" height="122" /></a></div>
            </div>
        </div><div id="block-transporter_booker-0" class="clear-block block block-transporter_booker">
        <h2 id="book"><span id="quote">BOOK NOW</span></h2>
        <div class="content">
            <form id="transporterBookerForm-0" action="#" method="post">
                <div id="stage1" style="display:normal;">
                    <p id="houseNoContainer" style="display:none;">
                        <label for="houseNo">House name or number</label>
                        <input type="text" name="houseNo" id="houseNo">
                    </p>
                    <p class="absMandatory row--iconed">
                        <label for="pAddress" class="inlineLabel">Pick-up *</label>
                        <input type="text" name="pAddress" id="pAddress" class="tinyField">
                    </p>
                    <p id="viaContainer" style="display:none;">
                        <label for='via'>Via</label>
                        <input type='text' name='via' id='via'>
                    </p>
                    <p class="absMandatory">
                        <label for="dAddress" class="inlineLabel">Drop-off *</label>
                        <input type="text" name="dAddress" id="dAddress" class="tinyField">
                    </p>
                    <p class="formFooter">
                        <a href="#book" class="smallGreenButton submitLink" id="goBooking"><span>Book it!</span></a>
                        <a href="#quote" class="smallGreenButton submitLink" id="getQuote"><span>Get a quote!</span></a>
                    </p>
                    <div class="floatsplit"></div>
                </div>
                <div id="stage2" style="display:none;">
                    <p>
                        <label for="name">Name *</label>
                        <input type="text" name="name" id="name">
                    </p>
                    <p>
                        <label for="phone">Phone *</label>
                        <input type="text" name="phone" id="phone" />
                    </p>
                    <p class="absMandatory">
                        <label for="email">Email *</label>
                        <input type="text" name="email" id="email" />
                    </p>
                    <p>
                        <input type="checkbox" name="airportTransfer" id="airportTransfer">
                        <label for="airportTransfer">I need airport transfer</label>
                    </p>
                    <p>
                        <label for="pDate" id="pDateLabel">Pick-up date</label>
                        <br />
                        <select name="pDate" id="pDate"><option></option></select>
                        <select name="pMonth" id="pMonth"><option></option></select>
                    </p>
                    <p>
                        <label for="pTimeHours" id="pTimeLabel">Pick-up time</label>
                        <br />
                        <select name="pTimeHours" id="pTimeHours"><option></option></select> :
                        <select name="pTimeMins" id="pTimeMins"><option></option></select>
                    </p>
                    <p>
                        <label for='passengers'>Passengers</label>
                        <select name='passengers' id='passengers'>
                            <option></option>
                        </select>
                    </p>
                    <p class="absMandatory">
                        <label for='vehicleType'>Vehicle type</label>
                        <select name='vehicleType' id='vehicleType'>
                            <option value="Saloon">Saloon</option>
                            <option value="Estate">Estate</option>
                            <option value="6-seater">6-seater</option>
                            <option value="Executive">Executive</option>
                        </select>
                    </p>
                    <p><label for="notes">Special requests</label> <input type="text" name="notes" id="notes"></p>
                    <p class="formFooter"><a href="#" class="smallGreenButton submitLink" id="bookingLink"><span>Book it!</span></a></p>
                </div>
            </form>
        </div>
        <a href="#carrotpal" class="floatsplit payment-option-icons"></a>
    </div><div id="block-fbit_sidebanner-0" class="clear-block block block-fbit_sidebanner block-region-right ">
        <div class="content"><div class="swftools-wrapper swftools-swf"><div id="swfobject2-id-14529625141" class="swftools swfobject2">
            <p>You are missing some Flash content that should appear here!</p>
            <p><a href="http://get.adobe.com/flashplayer/" title="Installing Adobe Flash Player will enable interactive content on millions of websites">Install Flash Player</a>.</p>
        </div>
            <script type="text/javascript">
                swfobject.embedSWF("https://www.carrotcars.co.uk/sites/carrotcars.co.uk/modules/fbit_sidebanner/banner.swf", "swfobject2-id-14529625141", "201", "150", "9", "", { "airport1": "Stansted", "price1": "STN\r", "airport2": "Heathrow", "price2": "LHR\r", "airport3": "City Airport", "price3": "LCY\r", "airport4": "Gatwick", "price4": "LGW\r", "airport5": "Southend", "price5": "SEN", "clickTAG": "/book-online#book", "width": "201", "height": "150" }, { "swliveconnect": "default", "play": "true", "loop": "true", "menu": "false", "quality": "autohigh", "scale": "showall", "align": "l", "salign": "tl", "wmode": "opaque", "bgcolor": "#fffFFF", "version": "9", "allowfullscreen": "true", "allowscriptaccess": "sameDomain", "height": "150", "width": "201", "base": "https://www.carrotcars.co.uk/sites/carrotcars.co.uk/files/", "src": "https://www.carrotcars.co.uk/sites/carrotcars.co.uk/modules/fbit_sidebanner/banner.swf" }, { "id": "swf14529625141" });
            </script>
        </div></div>
    </div><div id="block-carrotpal-form" class="clear-block block block-carrotpal block-region-right ">
        <h2>PAYMENT OPTIONS</h2>
        <div class="content"><form id="carrotpal-form" action="https://www.paypal.com/cgi-bin/webscr" method="post">
            <h4>Cash, credit/debit cards and Pingit are accepted in all our cars.</h4>
            <p>Alternatively, given your booking reference, select one of the prepayment options:</p>
            <p>
                <label>
                    <input type="radio" name="payment" value="card" checked="checked" />
                    Credit or Debit Card    </label>
            </p>
            <p>
                <label>
                    <input type="radio" name="payment" value="paypal" />
                    PayPal    </label>
            </p>
            <p>
                <label>
                    <input type="radio" name="payment" value="pingit" />
                    Barclays Pingit    </label>
            </p>
            <p class="form-item absMandatory">
                <label for="refNo" class="inlineLabel">Booking no.</label>
                <input type="text" name="item_number" id="refNo" class="numberField tinierField" style="float:right;" />
                <span class="floatsplit"></span>
            </p>
            <p class="form-item absMandatory floatsplit">
                <label for="amount" class="inlineLabel">
                    Amount (£)    </label>
                <input type="text" name="amount" id="amount" class="numberField tinierField" style="float:right;" />
            </p>
            <p class="form-item absMandatory">
                <label class="carrotpal-terms-label">
                    <input type="checkbox" name="terms" id="carrotpal-terms" />
                    I agree to              <a href="/sites/carrotcars.co.uk/files/carrotpal-terms.html?1420505671" id="carrotpal-terms-link" class="dotted-underline">
                    Terms and Conditions        </a>
                </label>
            </p>
            <p class="formFooter">
                <input type="hidden" name="cmd" value="_xclick" />
                <input type="hidden" name="business" value="paypal@carrotcars.co.uk" />
                <input type="hidden" name="item_name" value="Advance payment for minicab service (incl. 4.9% prepayment surcharge)" />
                <input type="hidden" name="currency_code" value="GBP" />
                <input type="hidden" name="notify_url" value="https://www.carrotcars.co.uk/carrotpal/thanks" />
                <input type="hidden" name="cpp_header_image" value="/inline-booking-static/resources/company/${companyResources}/images/home-page/Carrot-Cars-PayPal-header-750x90.png" />
                <input type="hidden" name="fee_rate" value="4.9" />
                <input type="hidden" name="quantity" value="1" />
                <a href="#block-carrotpal-form" class="smallGreenButton submitLink fullWidthLink" id="goPay">
                    <span>Pay</span>
                </a>
                <a href="/sites/carrotcars.co.uk/files/carrotpal-pingit.html" id="carrotpal-pingit-button" class="smallGreenButton submitLink fullWidthLink" style="display:none;">
                    <span>Learn about Pingit</span>
                </a>
            </p>
        </form>
            <a href="#block-carrotpal-form" class="floatsplit payment-option-icons"></a></div>
    </div>        </div>

    <footer>
        <div id="bottomLinks">
            <ul><li class="menu-307 active-trail first active"><a href="/cheap-clean-reliable-minicabs-1" title="Welcome to Carrot Cars!" class="active">Home</a></li>
                <li class="menu-1179"><a href="/minicab-docklands-taxi" title="How we can serve you!">Services</a></li>
                <li class="menu-309"><a href="/taxi-canary-wharf-taxi" title="Our Fleet">Our Fleet</a></li>
                <li class="menu-310"><a href="/e14-taxi" title="Accounts">Accounts</a></li>
                <li class="menu-999"><a href="/cheap-london-airport-transfers" title="Cheap London Airport Transfers">Airports</a></li>
                <li class="menu-996"><a href="/pco-minicab-driver-job-docklands-e14" title="Work for us">Driver Jobs</a></li>
                <li class="menu-998 last"><a href="/we-are-here-help" title="Contact us ">Contacts</a></li>
            </ul>                  </div>
        <div class="phone">
            Dial <span>0207 005 0557</span>
        </div>
        <a class="logo" title="Carrot Cars" href="/"></a>
        <div class="floatsplit"></div>
        <div>
            <small>Copyright &copy; 2009-2016 Ivory Enterprise Ltd.</small>
        </div>
    </footer>

</div>

<%--**************** paste this to the end of body of your site **********************--%>
<jsp:include page="body/hidden.jsp"/>
</body>
</html>