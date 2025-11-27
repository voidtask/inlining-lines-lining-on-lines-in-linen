<!DOCTYPE html>
<%@ page language="java" contentType="text/html; charset=utf8" pageEncoding="utf8"%>
<%@ taglib uri="http://www.springframework.org/tags" prefix="spring"%>
<%@ taglib uri="jakarta.tags.core" prefix="c" %>
<%@ taglib uri="jakarta.tags.fmt" prefix="fmt" %>
<c:set var="contextPath" value="${pageContext.request.contextPath}"/>
<html>
<head>
    <title>${companySettings['domen']}</title>
    <meta charset="utf-8">

</head>
<body>
<link rel="stylesheet" href="${companySettings['url']}/inline-booking-static/resources/css/report.css?ver=${version}" charset="utf-8">
<img class="background-white" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=">
<div class="container">

    <div class="block-head">

        <div class="box2 left">
            <div class="mg-echo-report-h1"><spring:message code="job"/> #<span data-bind="id"></span>, ${companySettings['name']}</div>
        </div>

        <div class="box2">
            <div class="mg-echo-report-h1" style="text-align:right;"><img class="mg-echo-logo" src="${companySettings['url']}/inline-booking-static/resources/company/${companyResources}/images/logo.png" height="40px"></div>
            <div class="mg-echo-report-h3" style="text-align:right;">${companySettings['phone']}</div>
        </div>

    </div>
    <div class="mg-echo-report-hr"></div>
    <!-- Booker, MOP, Job details and driver -->
    <div class="block">
        <div class="booker mop box3">
            <p><span class="mg-echo-label"><spring:message code="method_of_payment"/></span><br>
                <span data-bind="mop-type"></span>
            </p>
        </div>
        <div class="booker card-details box3">
            <p><span class="mg-echo-label"><spring:message code="card_details"/></span><br>
                <span data-bind="creditCard.name"></span><br>
                <span data-bind="mop"></span><br>
                Expiry <span data-bind="creditCard.expiry"></span>
            </p>
        </div>
        <div class="booker pickup-time box3">
            <p><span class="mg-echo-label"><spring:message code="pickup_time"/></span><br>
                <span data-bind="date"></span>
            </p>
        </div>
    </div>

    <div class="mg-echo-report-hr"></div>

    <!-- Stops -->
    <div class="block box1">
        <div class="mg-echo-report-h2"><spring:message code="stops"/></div>
            <table>
                <thead>
                <td><spring:message code="type"/></td>
                <td><spring:message code="address"/></td>
                </thead>
                <tr>
                    <td class="nowrap">1. <spring:message code="pickup"/></td>
                    <td data-bind="pickup.address"></td>
                </tr>
                <tr>
                    <td class="no-border nowrap">2. <spring:message code="drop_off"/></td>
                    <td class="no-border" data-bind="dropoff.address"></td>
                </tr>
            </table>
    </div>
    <hr>

    <!-- Passengers -->
    <div class="block box1">
        <div class="mg-echo-report-h2"><spring:message code="passengers"/></div>
            <table>
                <thead>
                <td><spring:message code="name"/></td>
                <td><spring:message code="mobile"/></td>
                <td><spring:message code="email"/></td>
                </thead>
                <tr>
                    <td class="no-border" data-bind="contactRecord.fullName"></td>
                    <td class="no-border" data-bind="contactRecord.phone"></td>
                    <td class="no-border" data-bind="contactRecord.email"></td>
                </tr>

            </table>
    </div>

</div>

</body>
</html>
