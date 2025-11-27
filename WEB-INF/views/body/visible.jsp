<%@ page language="java" contentType="text/html; charset=utf8" pageEncoding="utf8"%>
<%@ taglib uri="http://www.springframework.org/tags" prefix="spring"%>
<%@ taglib uri="jakarta.tags.core" prefix="c" %>
<%@ taglib uri="jakarta.tags.fmt" prefix="fmt" %>
<c:set var="contextPath" value="${pageContext.request.contextPath}"/>
<div id="mg-echo-booking-form-step-1" class="mg-echo-view">
    <div class="echo-title"><spring:message code="book_a_car_online"/></div>
    <div class="error-message" style="display:none;"></div>
    <form method="POST">
        <div class="success-message" style="display:none;"></div>

        <div class="stops-wrapper mg-echo-flex" id="mg-echo-stops-wrapper">
            <div class="pickup-wrapper field-container-wrapper stretched" id="mg-echo-pickup-wrapper">
                <div class="field-container">
                    <div class="mg-echo-label left"><spring:message code="from"/></div>
                    <div class="error-icon right"></div>
                    <span class="input-wrapper stretched"><input tabindex="1"  name="pickup" id="mg-echo-pickup" class="pickup"></span>
                </div>
            </div>
            <div class="dropoff-wrapper field-container-wrapper" id="mg-echo-dropoff-wrapper">
                <div class="field-container">
                    <div class="mg-echo-label left"><spring:message code="to"/></div>
                    <div class="error-icon right"></div>
                    <span class="input-wrapper stretched"><input tabindex="2"  name="dropoff" id="mg-echo-dropoff" class="dropoff"></span>
                </div>
                <div class="error-text" data-error></div>
            </div>
            <button tabindex="3" type="button" class="btn big next"><spring:message code="book"/> <span class="button-preprice"></span></button>
        </div>
        <div class="clear"></div>
    </form>
</div>