<%@ taglib uri="jakarta.tags.core" prefix="c" %>
<c:choose>
    <c:when test="${accountNumber != null and accountNumber != privateAccountNumber}">
        <link rel="stylesheet" type="text/css" href="${companySettings['url']}/inline-booking-static/resources/company/${companyResources}__${accountNumber}/css/inline-booking-css-all.css">
    </c:when>
    <c:otherwise>
        <link rel="stylesheet" type="text/css" href="${companySettings['url']}/inline-booking-static/resources/company/${companyResources}/css/inline-booking-css-all.css">
    </c:otherwise>
</c:choose>
<script src="https://www.google.com/recaptcha/api.js" async defer></script>
<script type="text/javascript" src="${companySettings['url']}/inline-booking-static/inline-booking-js-all.js"></script>