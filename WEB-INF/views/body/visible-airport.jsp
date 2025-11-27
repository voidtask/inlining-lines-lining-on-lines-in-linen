<%@ page language="java" contentType="text/html; charset=utf8" pageEncoding="utf8"%>
<%@ taglib uri="http://www.springframework.org/tags" prefix="spring"%>
<%@ taglib uri="jakarta.tags.core" prefix="c" %>
<%@ taglib uri="jakarta.tags.fmt" prefix="fmt" %>
<c:set var="contextPath" value="${pageContext.request.contextPath}"/>
<div id="mg-echo-booking-form-step-1" class="mg-echo-view mg-echo-airport">
    <div class="echo-title"><spring:message code="book_a_transfer_online"/></div>
    <div class="error-message" style="display:none;"></div>
    <form method="POST">
        <div class="success-message" style="display:none;"></div>

        <div class="stops-wrapper mg-echo-flex" id="mg-echo-stops-wrapper">
            <div class="flightNumber-wrapper field-container-wrapper stretched" id="mg-echo-flightNumber-wrapper">
                <div class="mg-echo-label">Flight number</div>
                <div class="field-container">
                    <div class="error-icon right"></div>
                    <span class="input-wrapper stretched">
                        <input tabindex="1" name="flightNumber" id="mg-echo-flightNumber" class="flightNumber">
                    </span>
                </div>
            </div>
        </div>
        <div class="clear"></div>
        <div class="airport-message"></div>
        <div class="mg-echo-airport-search-btn">Search</div>

        <div class="mg-echo-trips-wrapper">
            
            <div class="date-wrapper field-container-wrapper stretched" id="mg-echo-date-wrapper">
                <div class="mg-echo-label">Date</div>
                <div class="field-container input-group mg-echo-relative date">
                    <div class="datepickerbutton trigger add-on right"></div>
                    <div class="error-icon right"></div>
                    <span class="input-wrapper stretched"><input tabindex="2" name="scheduledLandingDate" placeholder="dd/mm/yyyy" readonly></span>
                </div>
            </div>

            <div class="pickup-wrapper field-container-wrapper stretched" id="mg-echo-pickup-wrapper">
                <div class="mg-auto-fill-airport">
                    <div class="mg-echo-label"><spring:message code="from"/></div>
                    <div class="mg-echo-pickup-list"></div>
                </div>
                <div class="mg-manual-fill-pickup">

                    <div class="field-container">
                        <div class="mg-echo-label left"><spring:message code="from"/></div>
                        <div class="error-icon right"></div>
                        <span class="input-wrapper stretched"><input tabindex="3"  name="dropoff" id="mg-echo-pickup" class="pickup"></span>
                    </div>
                    <div class="error-text" data-error></div>
                </div>
            </div>
            <div class="dropoff-wrapper field-container-wrapper stretched" id="mg-echo-dropoff-wrapper">
                <div class="mg-auto-fill-airport">
                    <div class="mg-echo-label"><spring:message code="to"/></div>
                    <div class="mg-echo-dropoff-list"></div>
                </div>
                <div class="mg-manual-fill-dropoff">
                    <div class="field-container">
                        <div class="mg-echo-label left"><spring:message code="to"/></div>
                        <div class="error-icon right"></div>
                        <span class="input-wrapper stretched"><input tabindex="3"  name="dropoff" id="mg-echo-dropoff" class="dropoff"></span>
                    </div>
                    <div class="error-text" data-error></div>
                </div>
            </div>
            <button tabindex="4" type="button" class="btn big next"><spring:message code="book"/> <span class="button-preprice"></span></button>
        </div>

        <div class="mg-echo-airport-error-wrapper">
            <div class="mg-echo-airport-error-icon"></div>
            <div class="mg-echo-airport-error-message"></div>
        </div>

    </form>
</div>