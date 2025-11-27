<!DOCTYPE html>
<%@ page language="java" contentType="text/html; charset=utf8" pageEncoding="utf8"%>
<%@ taglib uri="http://www.springframework.org/tags" prefix="spring"%>
<%@ taglib uri="jakarta.tags.core" prefix="c" %>
<%@ taglib uri="jakarta.tags.fmt" prefix="fmt" %>
<%@taglib uri="http://www.springframework.org/tags/form" prefix="form"%>
<c:set var="contextPath" value="${pageContext.request.contextPath}"/>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${companyName} - Inline Booking</title>
    <link rel="shortcut icon" href="${properties["app.inlinebooking.path"]}resources/company/${companyResources}/favicon.ico"/>

    <!-- Bootstrap -->
    <link rel="stylesheet" href="${properties["app.lib.path"]}bootstrap/css/bootstrap.min.css" >

    <link rel="stylesheet" href="${properties["app.inlinebooking.path"]}resources/css/reset-password.css?ver=${properties["app.version"]}" >
    <link rel="stylesheet" href="${properties["app.inlinebooking.path"]}resources/company/${companyResources}/css/reset-password.css?ver=${properties["app.version"]}" >

    <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
    <!--[if lt IE 9]>
    <script type="text/javascript" src="${properties["app.lib.path"]}html5shiv.js?ver=${properties["app.version"]}"></script>
    <script type="text/javascript" src="${properties["app.lib.path"]}bootstrap/js/respond.min.js?ver=${properties["app.version"]}"></script>
    <![endif]-->

    <script type="text/javascript" src="${properties["app.lib.path"]}bootstrap/js/bootstrap.min.js"></script>
</head>
<body>
<div id="wrap">

    <div class="header page-header">
        <div class="header-left"></div>
        <div class="header-center"></div>
        <div class="header-right"></div>
    </div>

    <div class="container-wrap container">
        <div class="loginForm col-md-6 col-md-offset-3 col-sm-8 col-sm-offset-2">
            <div class="register-text col-md-6 col-md-offset-3 col-sm-8 col-sm-offset-2">
                <div class="header-logo"></div>
                <div class="header-title">
                    Reset Password
                </div>
            </div>

            <form:form class="form-horizontal" role="form" method="POST" action="${contextPath}/reset_password" commandName="resetPassword">

                <div class="errorMessage">
                    <form:errors cssClass="error-message"/>
                </div>
                <c:if test="${message != null}"><div class="successMessage"><c:out value="${message}"/></div></c:if>

                <form:hidden path="confirmationCode"/>
                <form:hidden path="isPrivateAccountSelected"/>

                <div class="form-group"><!--
                --><label for="newPassword" class="col-sm-4 control-label"><span required>New password</span>:</label><!--
                --><div class="col-sm-8"><!--
                    --><form:password path="newPassword" id="newPassword" cssClass="form-control input-sm" placeholder="New password"/><!--
                    --><span class="help-block error-message"><form:errors path="newPassword" /></span><!--
                --></div><!--
            --></div>

                <div class="form-group"><!--
                --><label for="newPasswordRepeated" class="col-sm-4 control-label"><span required>Confirm password</span>:</label><!--
                --><div class="col-sm-8"><!--
                    --><form:password path="newPasswordRepeated" id="newPasswordRepeated" cssClass="form-control input-sm" placeholder="Confirm password"/><!--
                    --><span class="help-block error-message"><form:errors path="newPasswordRepeated" /></span><!--
                --></div><!--
            --></div>

                <div class="col-sm-offset-0.5 col-sm-10.5 splitter"></div>

                <div class="form-group form-footer">
                    <div class="col-sm-offset-4 col-sm-8 buttons">
                        <span class="button button-main">
                            <span class="button btn-default"><!--
                                --><em class="btn-left"></em><!-- in order to display inline blocks correctly
                                --><em class="mg-echo-btn-text"><button type="submit">Confirm</button></em><!--
                                --><em class="btn-right"></em><!--
                            --></span>
                        </span>
                    </div>
                </div>
            </form:form>
        </div>
    </div>
</div>

<div id="footer">
    <div class="footer-logo"></div>
    <div class="footer-text">
        If you are having trouble logging in please contact
        <a href="mailto:${companySettings['clientRelationsEmail']}" class="email">${companySettings['clientRelationsEmail']}</a>
        <span class="phone">or ${companySettings['phone']}></span>
    </div>
    <div class="copyright">
        IntelliMotion Solutions
    </div>
</div>

<script type="text/javascript" src="${contextPath}/analytics.js?ver=${properties["app.version"]}"></script>
<script>
    //For Google Analytics
    var dimensionValue = '${userName}';
    ga('set', 'dimension1', dimensionValue);

    var dimensionValue = '${SESSION.currentAccountNumber}';
    ga('set', 'dimension2', dimensionValue);
</script>
</body>
</html>