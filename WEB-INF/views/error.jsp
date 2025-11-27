<%@ page language="java" contentType="text/html; charset=utf8" pageEncoding="utf8"%>
<%@ taglib uri="http://www.springframework.org/tags" prefix="spring"%>
<%@ taglib uri="jakarta.tags.core" prefix="c" %>
<%@ taglib uri="jakarta.tags.fmt" prefix="fmt" %>
<c:set var="contextPath" value="${pageContext.request.contextPath}"/>

<head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=Edge"/>
    <%--<link rel="stylesheet" href="${properties["app.inlinebooking.path"]}resources/css/exception.css?ver=${properties["app.version"]}">--%>
    <link rel="stylesheet" href="${properties["app.inlinebooking.path"]}resources/company/${companyResources}/css/error.css?ver=${properties["app.version"]}">
    <title>${companyName} - Inline Booking</title>
    <link rel="shortcut icon" href = "${properties["app.inlinebooking.path"]}resources/company/${companyResources}/favicon.ico?ver=${properties["app.version"]}"/>
</head>
<body>
    <div class="content">
        <div class="message"><c:out value="${message}"/></div>
    <div>
</body>
