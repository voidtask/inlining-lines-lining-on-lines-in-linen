<%@ page language="java" contentType="text/html; charset=utf8" pageEncoding="utf8"%>
<%@ taglib uri="http://www.springframework.org/tags" prefix="spring"%>
<%@ taglib uri="jakarta.tags.core" prefix="c" %>
<%@ taglib uri="jakarta.tags.fmt" prefix="fmt" %>
<c:set var="contextPath" value="${pageContext.request.contextPath}"/>
<!DOCTYPE html>
<html>
<head>
    <title>Echo - Inline Booking Test View</title>
    <link rel="shortcut icon" href="${inlinebookingStatic}resources/company/${companyResources}/favicon.ico?ver=${version}"/>
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
    <jsp:include page="head/properties.jsp"/>
    <c:choose>
        <c:when test="${debug == true}">
            <script type="text/javascript">
                mg_echo_conf.debug = true;
                mg_echo_conf.rootPath = 'https://localhost/inline-booking';
            </script>
            <jsp:include page="head/resources-dev.jsp"/>
        </c:when>
        <c:otherwise>
            <jsp:include page="head/resources-prod.jsp"/>
        </c:otherwise>
    </c:choose>
</head>
<body>
    <div id="mg-echo-content">
        <div id="mg-echo-ib-form"></div>
    </div>
    <div class="footer">
        <div class="footer">
            <jsp:useBean id="currentDate" class="java.util.Date" />
            Copyright &copy; <fmt:formatDate value="${currentDate}" pattern="yyyy" /> Echo
        </div>
    </div>
</body>
</html>