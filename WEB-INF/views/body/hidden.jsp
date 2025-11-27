<%@ page language="java" contentType="text/html; charset=utf8" pageEncoding="utf8"%>
<%@ taglib uri="http://www.springframework.org/tags" prefix="spring"%>
<%@ taglib uri="jakarta.tags.core" prefix="c" %>
<%@ taglib uri="jakarta.tags.fmt" prefix="fmt" %>
<c:set var="contextPath" value="${pageContext.request.contextPath}"/>
<div id="mg-echo-hidden-wrap">
    <div id="mg-echo-booking-confirmation-wrapper" style="display: none;">
        <div id="mg-echo-booking-confirmation" class="mg-echo-view">
            <div class="mg-echo-content-info-panel">
                <svg class="mg-echo-close-icon" width="24px" height="24px" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg">
                    <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                        <g id="close-icon-fill" transform="translate(-912.000000, -46.000000)" fill="#000000">
                            <path d="M925.414214,58 L928.944907,54.4693066 C929.338692,54.0755211 929.340272,53.4407768 928.949747,53.0502525 C928.556501,52.6570056 927.923891,52.6618954 927.530693,53.055093 L924,56.5857864 L920.469307,53.055093 C920.075521,52.6613076 919.440777,52.6597282 919.050253,53.0502525 C918.657006,53.4434995 918.661895,54.076109 919.055093,54.4693066 L922.585786,58 L919.055093,61.5306934 C918.661308,61.9244789 918.659728,62.5592232 919.050253,62.9497475 C919.443499,63.3429944 920.076109,63.3381046 920.469307,62.944907 L924,59.4142136 L927.530693,62.944907 C927.924479,63.3386924 928.559223,63.3402718 928.949747,62.9497475 C929.342994,62.5565005 929.338105,61.923891 928.944907,61.5306934 L925.414214,58 Z M924,70 C917.372583,70 912,64.627417 912,58 C912,51.372583 917.372583,46 924,46 C930.627417,46 936,51.372583 936,58 C936,64.627417 930.627417,70 924,70 Z M924,68 C929.522847,68 934,63.5228475 934,58 C934,52.4771525 929.522847,48 924,48 C918.477153,48 914,52.4771525 914,58 C914,63.5228475 918.477153,68 924,68 Z" id="Close"></path>
                        </g>
                    </g>
                </svg>
                <div class="echo-title"><spring:message code="booking"/> #<span data-bind="id">12345</span></div>
                <div class="echo-row-wrapper mg-echo-table mg-echo-border-box">
                    <div class="mg-echo-column mg-echo-cell mg-echo-valign-top">
                        <div class="column-title"><spring:message code="journey_details"/></div>
                        <div class="mg-echo-booking-confirmation-item">
                            <span class="mg-echo-booking-confirmation-label"><spring:message code="service"/></span>
                            <span class="mg-echo-booking-confirmation-value" data-bind="serviceRecord.name"></span>
                        </div>
                        <div class="mg-echo-booking-confirmation-item">
                            <span class="mg-echo-booking-confirmation-label"><spring:message code="from"/></span>
                            <span class="mg-echo-booking-confirmation-value" data-bind="pickup.address"></span>
                        </div>
                        <div class="mg-echo-booking-confirmation-item pickup-notes-confirmation">
                            <span class="mg-echo-booking-confirmation-label"></span>
                            <span class="mg-echo-booking-confirmation-value" data-bind="pickup.customerNotes"></span>
                        </div>
                        <div class="mg-echo-booking-confirmation-item">
                            <span class="mg-echo-booking-confirmation-label"><spring:message code="to"/></span>
                            <span class="mg-echo-booking-confirmation-value" data-bind="dropoff.address"></span>
                        </div>
                        <div class="mg-echo-booking-confirmation-item">
                            <span class="mg-echo-booking-confirmation-label"><spring:message code="pickup_time"/></span>
                            <span class="mg-echo-booking-confirmation-value" data-bind="date"></span>
                        </div>
                        <div class="mg-echo-booking-confirmation-item">
                            <span class="mg-echo-booking-confirmation-label"><spring:message code="extras_options"/></span>
                            <span class="mg-echo-booking-confirmation-value" data-bind="extras"></span>
                        </div>
                    </div>
                    <div class="mg-echo-column mg-echo-cell mg-echo-valign-top mg-echo-passengers-info">
                        <div class="column-title"><spring:message code="passengers_info"/></div>
                        <div class="mg-echo-booking-confirmation-item">
                            <span class="mg-echo-booking-confirmation-label"><spring:message code="email"/></span>
                            <span class="mg-echo-booking-confirmation-value" data-bind="contactRecord.email"></span>
                        </div>
                        <div class="mg-echo-booking-confirmation-item">
                            <span class="mg-echo-booking-confirmation-label"><spring:message code="name"/></span>
                            <span class="mg-echo-booking-confirmation-value" data-bind="contactRecord.fullName"></span>
                        </div>
                        <div class="mg-echo-booking-confirmation-item">
                            <span class="mg-echo-booking-confirmation-label"><spring:message code="mobile"/></span>
                            <span class="mg-echo-booking-confirmation-value" data-bind="contactRecord.phone"></span>
                        </div>
                        <div class="mg-echo-booking-confirmation-item">
                            <span class="mg-echo-booking-confirmation-label"><spring:message code="pay_with"/></span>
                            <span class="mg-echo-booking-confirmation-value mg-echo-nowrap" data-bind="mop"></span>
                        </div>
                    </div>
                    <div class="mg-echo-column mg-echo-cell mg-echo-valign-top additional-info">
                        <div class="response-time">
                            <div class="mg-echo-label"><spring:message code="response_time"/></div>
                            <div class="value" data-bind="responseTime"></div>
                        </div>
                        <div class="total-price">
                            <div class="mg-echo-label"><spring:message code="estimated_total"/></div>
                            <div class="value" data-bind="totalPrice"></div>
                        </div>
                    </div>
                </div>
                <c:choose>
                    <c:when test="${companyResources == 'ECTR'}">
                        <div class="echo-row-wrapper extra-charges">
                            <spring:message code="extra_charges_text"/>
                        </div>
                    </c:when>
                    <c:otherwise>
                        <div class="echo-row-wrapper extra-charges"><spring:message code="the_total"/> <span class="extra-charges-vat"></span>, <spring:message code="extra_charges_text"/>
                            <a class="extra-charges-link" target="_blank" href="${companySettings['pricingUrl']}"> <spring:message code="more_info_extra_charges"/></a>
                        </div>
                    </c:otherwise>
                </c:choose>
            </div>
            <div class="mg-echo-bottom-buttons-panel-wrap">
                <div class="mg-echo-bottom-buttons-panel">
                    <div class="echo-btn echo-btn-style-3 echo-btn-print"><spring:message code="print"/></div>
                    <div class="echo-btn echo-btn-style-3 echo-btn-show-on-map"><spring:message code="show_on_map"/></div>
                    <div class="echo-btn echo-btn-style-3 mg-echo-booking-confirmation-close-btn"><spring:message code="close"/></div>
                </div>
            </div>
        </div>
    </div>
    <div class="mg-echo-print-report"></div>
    <div id="mg-echo-booking-form-step-2-wrapper" style="display:none;">
        <div class="mg-echo-fixed-wrap">
            <div id="mg-echo-booking-form-step-2" class="mg-echo-view state-anonym">
                <div class="mg-echo-right-overlay form-blocker"></div>
                <div class="mg-echo-right-overlay">
                    <div class="mg-echo-background-right-overlay"></div>
                    <svg class="mg-echo-close-icon" width="24px" height="24px" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg">
                        <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                            <g id="close-icon-fill" transform="translate(-912.000000, -46.000000)" fill="#000000">
                                <path d="M925.414214,58 L928.944907,54.4693066 C929.338692,54.0755211 929.340272,53.4407768 928.949747,53.0502525 C928.556501,52.6570056 927.923891,52.6618954 927.530693,53.055093 L924,56.5857864 L920.469307,53.055093 C920.075521,52.6613076 919.440777,52.6597282 919.050253,53.0502525 C918.657006,53.4434995 918.661895,54.076109 919.055093,54.4693066 L922.585786,58 L919.055093,61.5306934 C918.661308,61.9244789 918.659728,62.5592232 919.050253,62.9497475 C919.443499,63.3429944 920.076109,63.3381046 920.469307,62.944907 L924,59.4142136 L927.530693,62.944907 C927.924479,63.3386924 928.559223,63.3402718 928.949747,62.9497475 C929.342994,62.5565005 929.338105,61.923891 928.944907,61.5306934 L925.414214,58 Z M924,70 C917.372583,70 912,64.627417 912,58 C912,51.372583 917.372583,46 924,46 C930.627417,46 936,51.372583 936,58 C936,64.627417 930.627417,70 924,70 Z M924,68 C929.522847,68 934,63.5228475 934,58 C934,52.4771525 929.522847,48 924,48 C918.477153,48 914,52.4771525 914,58 C914,63.5228475 918.477153,68 924,68 Z" id="Close"></path>
                            </g>
                        </g>
                    </svg>
                    <form id="mg-echo-step-form" class="mg-echo-step-form" method="POST">
                        <div class="form-error-messages">
                            <div class="error-message heap" style="display:none;"></div>
                            <div class="error-message capacity" style="display:none;"></div>
                            <div class="error-message price" style="display:none;"></div>
                            <div class="error-message session" style="display:none;"></div>
                        </div>
                        <div class="column-title">
                            <spring:message code="bookers_info"/>
                        </div>
                        <div class="mg-echo-step mg-echo-step-start">
                            <div class="email-wrapper field-container-wrapper stretched">
                                <div class="field-container">
                                    <div class="mg-echo-label left"><spring:message code="email"/></div>
                                    <div class="error-icon right"></div>
                                    <div class="mg-echo-edit-icon"></div>
                                    <span class="input-wrapper stretched"><input name="email" class="email"></span>
                                </div>
                            </div>
                            <button type="submit" class="mg-echo-next-btn"><spring:message code="next"/></button>
                        </div>

                        <div class="login-wrapper mg-echo-step mg-echo-step-login">
                            <div class="password-wrapper field-container-wrapper stretched">
                                <div class="field-container">
                                    <div class="mg-echo-label left"><spring:message code="password"/></div>
                                    <div class="error-icon right"></div>
                                    <div class="mg-echo-eye-icon"></div>
                                    <span class="input-wrapper stretched"><input name="password" class="password" type="password"></span>
                                </div>
                            </div>
                            <div class="mg-echo-table">
                                <div class="mg-echo-cell mg-echo-valign-top">
                                    <button type="submit" class="mg-echo-next-btn"><spring:message code="next"/></button>
                                </div>
                                <div class="mg-echo-cell mg-echo-align-right reset-password-wrapper">
                                    <div class="reset-password-msg"></div>
                                    <a href="javascript: void(0)" id="reset-password"><spring:message code="reset_password"/></a>
                                </div>
                            </div>
                        </div>

                        <div class="mg-echo-step mg-echo-step-registration">
                            <div class="phone-wrapper field-container-wrapper">
                                <div class="field-container">
                                    <div class="mg-echo-label left"><spring:message code="mobile"/></div>
                                    <div class="error-icon right"></div>
                                    <span class="input-wrapper"><input name="phone" class="phone" maxlength="25"></span>
                                </div>
                            </div>
                            <div class="name-wrapper field-container-wrapper stretched">
                                <div class="field-container">
                                    <div class="mg-echo-label left"><spring:message code="name"/></div>
                                    <div class="error-icon right"></div>
                                    <span class="input-wrapper stretched"><input name="name" class="name"></span>
                                </div>
                                <div class="error-text" data-error></div>
                            </div>
                            <div class="password-wrapper field-container-wrapper stretched">
                                <div class="field-container">
                                    <div class="mg-echo-label left"><spring:message code="password"/></div>
                                    <div class="error-icon right"></div>
                                    <div class="mg-echo-eye-icon"></div>
                                    <span class="input-wrapper stretched"><input name="password" class="password" type="password"></span>
                                </div>
                                <div class="error-text" data-error></div>
                            </div>
                            <div class="mg-agree-wrapper">
                                <input name="agreeTerms" class="mg-checkbox" id="agreeTerms" type="checkbox">
                                <label for="agreeTerms"></label>
                                <label for="agreeTerms" class="mg-checkbox-label">
                                </label>
                            </div>
                            <div id="reCaptchaBlock"></div>
                            <button type="submit" class="mg-echo-next-btn"><spring:message code="next"/></button>
                        </div>

                        <div class="mg-echo-step mg-echo-step-confirmation-code">
                            <p><spring:message code="password_has_been_sent"/> <span class="phone-label"></span> <spring:message code="password_has_been_sent_desc"/></p>
                            <div class="confirmationCode-wrapper field-container-wrapper stretched">
                                <div class="field-container">
                                    <div class="error-icon right"></div>
                                    <span class="input-wrapper stretched"><input name="confirmationCode" class="confirmationCode"></span>
                                </div>
                            </div>
                            <button type="submit" class="mg-echo-next-btn"><spring:message code="next"/></button>
                            <a href="javascript: void(0)" id="code-resend"><spring:message code="resend_code"/></a>
                            <div class="error-text" data-error></div>
                        </div>
                    </form>
                    <form id="mg-echo-reset-password-form" class="mg-echo-reset-password-form mg-echo-step-active" method="POST">
                        <div class="form-error-messages">
                            <div class="error-message heap" style="display:none;"></div>
                        </div>
                        <div class="column-title">
                            <spring:message code="set_new_password"/>
                        </div>
                        <div class="email-wrapper field-container-wrapper stretched">
                            <div class="field-container">
                                <div class="mg-echo-label left"><spring:message code="email"/></div>
                                <div class="error-icon right"></div>
                                <div class="mg-echo-edit-icon"></div>
                                <span class="input-wrapper stretched"><input name="email" class="email"></span>
                            </div>
                        </div>
                        <div class="password-wrapper field-container-wrapper stretched">
                            <div class="field-container">
                                <div class="mg-echo-label left"><spring:message code="password"/></div>
                                <div class="error-icon right"></div>
                                <div class="mg-echo-eye-icon"></div>
                                <span class="input-wrapper stretched"><input name="password" class="password" type="password"></span>
                            </div>
                            <div class="error-text" data-error></div>
                        </div>
                        <button type="submit" class="mg-echo-next-btn"><spring:message code="next"/></button>
                    </form>
                </div>

                <div class="mg-echo-lock-overlay" style="display:none;">
                    <div class="mg-echo-background-right-overlay"></div>
                    <svg class="mg-echo-credit-card-lock-close-icon" width="24px" height="24px" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg">
                        <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                            <g id="close-icon-fill" transform="translate(-912.000000, -46.000000)" fill="#ffffff">
                                <path d="M925.414214,58 L928.944907,54.4693066 C929.338692,54.0755211 929.340272,53.4407768 928.949747,53.0502525 C928.556501,52.6570056 927.923891,52.6618954 927.530693,53.055093 L924,56.5857864 L920.469307,53.055093 C920.075521,52.6613076 919.440777,52.6597282 919.050253,53.0502525 C918.657006,53.4434995 918.661895,54.076109 919.055093,54.4693066 L922.585786,58 L919.055093,61.5306934 C918.661308,61.9244789 918.659728,62.5592232 919.050253,62.9497475 C919.443499,63.3429944 920.076109,63.3381046 920.469307,62.944907 L924,59.4142136 L927.530693,62.944907 C927.924479,63.3386924 928.559223,63.3402718 928.949747,62.9497475 C929.342994,62.5565005 929.338105,61.923891 928.944907,61.5306934 L925.414214,58 Z M924,70 C917.372583,70 912,64.627417 912,58 C912,51.372583 917.372583,46 924,46 C930.627417,46 936,51.372583 936,58 C936,64.627417 930.627417,70 924,70 Z M924,68 C929.522847,68 934,63.5228475 934,58 C934,52.4771525 929.522847,48 924,48 C918.477153,48 914,52.4771525 914,58 C914,63.5228475 918.477153,68 924,68 Z" id="Close"></path>
                            </g>
                        </g>
                    </svg>
                    <div class="mg-echo-credit-card-lock-container">
                        <div class="mg-echo-credit-card-lock-image"></div>
                        <p class="mg-echo-credit-card-lock-message"><spring:message code="complete_payment_form"/></p>
                    </div>
                </div>

                <div class="mg-echo-proceed-payment-lock-overlay" style="display:none;">
                    <div class="mg-echo-background-right-overlay"></div>
                    <svg class="mg-echo-proceed-payment-lock-close-icon" width="24px" height="24px" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg">
                        <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                            <g id="close-icon-fill" transform="translate(-912.000000, -46.000000)" fill="#ffffff">
                                <path d="M925.414214,58 L928.944907,54.4693066 C929.338692,54.0755211 929.340272,53.4407768 928.949747,53.0502525 C928.556501,52.6570056 927.923891,52.6618954 927.530693,53.055093 L924,56.5857864 L920.469307,53.055093 C920.075521,52.6613076 919.440777,52.6597282 919.050253,53.0502525 C918.657006,53.4434995 918.661895,54.076109 919.055093,54.4693066 L922.585786,58 L919.055093,61.5306934 C918.661308,61.9244789 918.659728,62.5592232 919.050253,62.9497475 C919.443499,63.3429944 920.076109,63.3381046 920.469307,62.944907 L924,59.4142136 L927.530693,62.944907 C927.924479,63.3386924 928.559223,63.3402718 928.949747,62.9497475 C929.342994,62.5565005 929.338105,61.923891 928.944907,61.5306934 L925.414214,58 Z M924,70 C917.372583,70 912,64.627417 912,58 C912,51.372583 917.372583,46 924,46 C930.627417,46 936,51.372583 936,58 C936,64.627417 930.627417,70 924,70 Z M924,68 C929.522847,68 934,63.5228475 934,58 C934,52.4771525 929.522847,48 924,48 C918.477153,48 914,52.4771525 914,58 C914,63.5228475 918.477153,68 924,68 Z" id="Close"></path>
                            </g>
                        </g>
                    </svg>
                    <div class="mg-echo-proceed-payment-lock-container">
                        <div class="mg-echo-proceed-payment-lock-image"></div>
                        <p class="mg-echo-proceed-payment-lock-message"><spring:message code="proceed_payment_lock_message"/></p>
                        <div class="mg-echo-proceed-payment-lock-button"><spring:message code="proceed_payment_lock_button"/></div>
                    </div>
                </div>

                <div class="mg-echo-flex-column">
                    <div class="for-mobile form-error-messages">
                        <div class="error-message heap" style="display:none;"></div>
                        <div class="error-message capacity" style="display:none;"></div>
                        <div class="error-message price" style="display:none;"></div>
                        <div class="success-message" style="display:none;"></div>
                    </div>
                    <form class="mg-echo-booking-form-full" method="POST">
                        <div class="mg-echo-booking-form-full-inner_wrap">

                            <svg class="mg-echo-close-icon" width="24px" height="24px" viewBox="0 0 24 24" version="1.1"
                                 xmlns="http://www.w3.org/2000/svg">
                                <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                    <g id="close-icon-fill" transform="translate(-912.000000, -46.000000)" fill="#000000">
                                        <path d="M925.414214,58 L928.944907,54.4693066 C929.338692,54.0755211 929.340272,53.4407768 928.949747,53.0502525 C928.556501,52.6570056 927.923891,52.6618954 927.530693,53.055093 L924,56.5857864 L920.469307,53.055093 C920.075521,52.6613076 919.440777,52.6597282 919.050253,53.0502525 C918.657006,53.4434995 918.661895,54.076109 919.055093,54.4693066 L922.585786,58 L919.055093,61.5306934 C918.661308,61.9244789 918.659728,62.5592232 919.050253,62.9497475 C919.443499,63.3429944 920.076109,63.3381046 920.469307,62.944907 L924,59.4142136 L927.530693,62.944907 C927.924479,63.3386924 928.559223,63.3402718 928.949747,62.9497475 C929.342994,62.5565005 929.338105,61.923891 928.944907,61.5306934 L925.414214,58 Z M924,70 C917.372583,70 912,64.627417 912,58 C912,51.372583 917.372583,46 924,46 C930.627417,46 936,51.372583 936,58 C936,64.627417 930.627417,70 924,70 Z M924,68 C929.522847,68 934,63.5228475 934,58 C934,52.4771525 929.522847,48 924,48 C918.477153,48 914,52.4771525 914,58 C914,63.5228475 918.477153,68 924,68 Z" id="Close"></path>
                                    </g>
                                </g>
                            </svg>

                            <div class="mg-echo-fields mg-echo-booking-form-full-top">
                                <div class="mg-echo-column left">
                                    <div class="echo-title"><spring:message code="booking"/></div>
                                    <div class="subtitle"><spring:message code="fill_out_the_form_below"/></div>
                                </div>
                                <div class="mg-echo-column right passengers-info">
                                    <div class="mg-echo-auth-panel">
                                        <div class="mg-echo-auth-name"><spring:message code="you_are_signed_in_as"/> <a href="${companySettings['url']}/web-portal/login_private" class="mg-echo-auth-name-value"></a></div>
                                        <div class="mg-echo-auth-email"><span class="mg-echo-auth-email-value"></span> &bull; <a href="javascript:void(0);" class="mg-echo-logout-link"><spring:message code="log_out"/></a></div>
                                    </div>
                                </div>
                            </div>

                            <div class="for-desktop form-error-messages">
                                <div class="error-message heap" style="display:none;"></div>
                                <div class="error-message capacity" style="display:none;"></div>
                                <div class="error-message price" style="display:none;"></div>
                                <div class="success-message" style="display:none;"></div>
                            </div>

                            <div class="mg-echo-fields">
                                <div class="mg-echo-column left">
                                    <div class="column-title">
                                        <spring:message code="journey_details"/>
                                    </div>
                                    <div class="service-wrapper field-container-wrapper stretched" id="mg-echo-service-wrapper">
                                        <div class="field-container">
                                            <div class="mg-echo-label"><spring:message code="service"/></div>
                                            <div class="trigger std right"></div>
                                            <div class="error-icon right"></div>
                                            <div class="mg-echo-loading right"></div>
                                            <span class="input-wrapper stretched"><input name="service" id="mg-echo-service" class="service" tabindex="0"></span>
                                        </div>
                                        <div class="mg-echo-dropdown"></div>
                                    </div>
                                    <div class="stops-wrapper stretched" id="mg-echo-stops-wrapper-step-2">
                                        <div class="pickup-wrapper field-container-wrapper stretched" id="mg-echo-pickup-wrapper-step-2">
                                            <div class="field-container">
                                                <div class="mg-echo-label left"><spring:message code="from"/></div>
                                                <div class="error-icon right"></div>
                                                <span class="input-wrapper stretched"><input name="pickup" id="mg-echo-pickup-step-2" class="pickup"></span>
                                            </div>
                                            <div class="mg-echo-dropdown"></div>
                                        </div>
                                        <div class="pickup-notes"></div>
                                        <div class="dropoff-wrapper field-container-wrapper stretched" id="mg-echo-dropoff-wrapper-step-2">
                                            <div class="field-container">
                                                <div class="mg-echo-label left"><spring:message code="to"/></div>
                                                <div class="error-icon right"></div>
                                                <span class="input-wrapper stretched"><input  name="dropoff" id="mg-echo-dropoff-step-2" class="dropoff" placeholder="<spring:message code="estimated_price_text"/>"></span>
                                            </div>
                                            <div class="mg-echo-dropdown"></div>
                                        </div>
                                    </div>
                                    <div id="mg-echo-passengers-wrapper"
                                         class="passangers-wrapper field-container-wrapper stretched"
                                         type="text">
                                        <div class="field-container">
                                            <div class="mg-echo-label left">Passengers</div>
                                            <div class="trigger std right"></div>
                                            <div class="error-icon right"></div>
                                            <div class="mg-echo-loading right"></div>
                                            <span class="input-wrapper stretched">
                                                <input name="passangers" id="mg-echo-passangers" class="mop" readonly>
                                            </span>
                                        </div>
                                        <div class="mg-echo-dropdown"></div>
                                    </div>
                                    <div id="mg-echo-extras-wrapper" class="extras-info">
                                        <div class="mg-extras-result">
                                            <div class="column-title">
                                                <spring:message code="extras_options"/>
                                            </div>
                                        </div>
                                        <div class="mg-extras-add">
                                            <div class="mg-extras-selected-items"></div>
                                            <div class="mg-extras-add-button">
                                                <div class="mg-extras-name">
                                                    <span class="mg-extras-add-button-text-1"><spring:message code="add_extras"/></span>
                                                    <span class="mg-extras-add-button-text-2"><spring:message code="add_more"/></span>
                                                </div>
                                                <div class="mg-extras-options customSelect-suggestions"></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div id="flight-checker-wrapper" class="flight-checker-wrapper field-container-wrapper">
                                        <div class="date field-container input-group">
                                            <div class="mg-echo-label"><spring:message code="pickup_time"/></div>
                                            <div class="flight-checker">
                                                <div class="mg-onoffswitch-wrapper">
                                                    <div class="onoffswitch"><input type="checkbox" name="adjustPickupTime" class="onoffswitch-checkbox" checked="checked" id="adjust-pickup-time"><label class="onoffswitch-label" for="adjust-pickup-time"><span class="onoffswitch-inner"></span><span class="onoffswitch-switch"></span></label></div>
                                                    <span><spring:message code="link_pickup_time_to_landing_time"/></span>
                                                </div>
                                                <div class="adjustPickupTimeBlock">
                                                    <div class="mg-echo-table">
                                                        <div class="adjustPickupTimeBlock-flight mg-echo-cell">
                                                            <div class="flight-checker-label"><spring:message code="flight<br>number"/></div>
                                                            <div class="flight-checker-inputWrapper"><input name="flightNumber" type="text"></div>
                                                        </div>
                                                        <div class="adjustPickupTimeBlock-landingDate mg-echo-cell">
                                                            <div class="flight-checker-label"><spring:message code="landing<br>date"/></div>
                                                            <div class="flight-checker-inputWrapper mg-echo-relative">
                                                                <input name="scheduledLandingDate" type="text" readonly>
                                                            </div>
                                                        </div>
                                                        <div class="adjustPickupTimeBlock-holdOff mg-echo-cell">
                                                            <div class="flight-checker-label"><spring:message code="delay<br>pickup_by"/></div>
                                                            <div class="flight-checker-inputWrapper">
                                                                <select name="holdOffTime">
                                                                </select>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="flight-checker-messages"></div>
                                                </div>
                                                <div class="notAdjustPickupTimeBlock">
                                                    <div class="flight-checker-inputWrapper mg-echo-relative">
                                                        <input type="text" readonly>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div id="flight-window-wrapper" class="flight-checker-wrapper field-container-wrapper">
                                        <div class="date field-container input-group">
                                            <div class="flight-checker">
                                                <div class="adjustPickupTimeBlock">
                                                    <div class="mg-echo-table">
                                                        <div class="adjustPickupTimeBlock-flight mg-echo-cell">
                                                            <div class="flight-checker-inputWrapper"><input name="flightNumber" type="text" disabled></div>
                                                        </div>
                                                        <div class="adjustPickupTimeBlock-landingDate mg-echo-cell">
                                                            <div id="flight-window-date" class="flight-checker-inputWrapper mg-echo-relative">
                                                                <input name="scheduledLandingDate" type="text" readonly>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="flight-checker-messages"></div>
                                                </div>
                                            </div>
                                        </div>
                                        <div id="mg-echo-lateAllowance-wrapper"></div>
                                        <div id="mg-echo-jobWorkflowType-wrapper"></div>
                                    </div>
                                    <div class="date-wrapper field-container-wrapper" id="mg-echo-date-wrapper-step-2">
                                        <div class="date field-container input-group" id="mg-echo-date-step-2">
                                            <div class="mg-echo-label left"><spring:message code="pickup_time"/></div>
                                            <div class="datepickerbutton trigger add-on right"></div>
                                            <div class="error-icon right"></div>
                                            <div class="mg-echo-loading right"></div>
                                            <span class="input-wrapper stretched"><input name="datetime" id="mg-echo-datetime-step-2" class="datetime" readonly></span>
                                        </div>
                                    </div>
                                    <input name="dateType" id="mg-echo-date-type-step-2" class="mg-echo-hidden">
                                    <div class="additional-instructions-wrapper-all">
                                        <div class="stretched">
                                            <div class="column-title mg-echo-title-margin">
                                                <spring:message code="additional_instructions"/>
                                            </div>
                                            <div class="mg-echo-additional-label">
                                                <c:choose>
                                                    <c:when test="${companyResources == 'ECTR' or companyResources == 'APL'}">
                                                        <spring:message code="additional_instructions_text"/>
                                                    </c:when>
                                                    <c:otherwise>
                                                        <spring:message code="additional_instructions_text"/> <span class="mg-echo-company-phone"></span>
                                                    </c:otherwise>
                                                </c:choose>
                                            </div>
                                        </div>
                                        <div class="additional-instructions-wrapper field-container-wrapper stretched" id="mg-echo-additional-instructions-wrapper-step-2">
                                            <div class="additional-instructions-wrapper field-container stretched">
                                                <div class="error-icon right"></div>
                                                <span class="input-wrapper stretched">
                                                    <textarea
                                                            name="additionalInstructions"
                                                            id="mg-echo-additional-instructions"
                                                            class="additional-instructions placeholder-right mg-echo-border-box"
                                                            rows="30"
                                                            maxlength="512"
                                                    ></textarea>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="mg-echo-column right passengers-info mg-echo-passengers-info-wrap">
                                    <div class="column-title">
                                        <spring:message code="passengers_contact_info"/>
                                    </div>
                                    <div class="contact-wrapper" id="mg-echo-contact-wrapper">
                                        <div class="mg-echo-phone-and-passport-wrap">
                                            <div class="phone-wrapper field-container-wrapper stretched" id="mg-echo-phone-wrapper">
                                                <div class="field-container">
                                                    <div class="mg-echo-label left"><spring:message code="mobile"/></div>
                                                    <div class="error-icon right"></div>
                                                    <span class="input-wrapper stretched"><input name="phone" class="phone"></span>
                                                </div>
                                            </div>
                                            <div class="passport-wrapper field-container-wrapper stretched" id="mg-echo-passport-wrapper">
                                                <div class="field-container">
                                                    <div class="mg-echo-label left">Passport
                                                    </div>
                                                    <div class="error-icon right"></div>
                                                    <span class="input-wrapper stretched"><input name="passport" class="passport"></span>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="name-wrapper field-container-wrapper stretched" id="mg-echo-name-wrapper">
                                            <div class="field-container">
                                                <div class="mg-echo-label left"><spring:message code="name"/></div>
                                                <div class="error-icon right"></div>
                                                <span class="input-wrapper stretched"><input name="name" class="name"></span>
                                            </div>
                                            <div class="error-text" data-error></div>
                                        </div>
                                        <div class="email-wrapper field-container-wrapper stretched" id="mg-echo-email-wrapper">
                                            <div class="field-container">
                                                <div class="mg-echo-label left"><spring:message code="email"/></div>
                                                <div class="error-icon right"></div>
                                                <span class="input-wrapper stretched"><input name="email" class="email"></span>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="mop-wrapper field-container-wrapper stretched" id="mg-echo-mop-wrapper">
                                        <div class="field-container">
                                            <div class="mg-echo-label left"><spring:message code="pay_with"/></div>
                                            <div class="trigger std right"></div>
                                            <div class="error-icon right"></div>
                                            <div class="mg-echo-loading right"></div>
                                            <span class="input-wrapper stretched"><input  name="mop" id="mg-echo-mop" class="mop" readonly></span>
                                        </div>
                                        <div class="mg-echo-dropdown"></div>
                                    </div>
                                    <div class="mop-description" id="mg-echo-creditCard-PrePayment-Text"><spring:message code="credit_card_prepayment_text"/></div>

                                    <div class="credit-card-form-wrapper" id="mg-echo-credit-card-form-wrapper">

                                        <div class="column-title">
                                            <spring:message code="card_details"/>
                                        </div>
                                        <div class="mg-echo-additional-label" id="mg-echo-isCreditCardRequired"><spring:message code="credit_card_required_text"/></div>
                                        <input name="credit-card-id" id="#mg-echo-credit-card-id" class="mg-echo-hidden">
                                        <input name="credit-card-type" id="#mg-echo-credit-card-type" class="mg-echo-hidden">
                                        <div class="credit-card-number-wrapper field-container-wrapper stretched" id="mg-echo-credit-card-number-wrapper">
                                            <div class="field-container">
                                                <div class="mg-echo-label left"><spring:message code="number"/></div>
                                                <div class="mg-echo-label type left" style="display: none;"></div>
                                                <div class="change-credit-card-btn right" style="display:none;">
                                                    <a class="icon change-credit-card" href="#"><span class="mg-echo-btn-text"><spring:message code="change_card"/></span></a>
                                                </div>
                                                <div class="back-to-existed-card-btn right" style="display:none;">
                                                    <a class="back-to-existed-card" href="#"><span class="mg-echo-btn-text"></span><span class="text-template" style="display:none;">Back to {1}</span></a>
                                                </div>
                                                <div class="error-icon right"></div>
                                                <span class="input-wrapper stretched"><input name="credit-card-number" class="credit-card-number"></span>
                                            </div>
                                        </div>
                                        <div class="holder-wrapper field-container-wrapper stretched" id="mg-echo-holder-wrapper">
                                            <div class="field-container">
                                                <div class="mg-echo-label left"><spring:message code="name"/></div>
                                                <div class="error-icon right"></div>
                                                <span class="input-wrapper stretched"><input name="holder" class="holder"></span>
                                            </div>
                                        </div>
                                        <div class="clear"></div>
                                        <div class="expiry-and-cvv-wrapper">
                                            <div class="expiry-wrapper field-container-wrapper stretched left" id="mg-echo-expiry-wrapper">
                                                <div class="field-container">
                                                    <div class="mg-echo-label left"><spring:message code="expiry"/></div>
                                                    <div class="error-icon right"></div>
                                                    <span class="input-wrapper stretched"><input name="expiry" id="mg-echo-expiry" class="expiry" maxlength="5" placeholder="<spring:message code="MM/YY"/>"></span>
                                                </div>
                                            </div>
                                            <div class="cvv-wrapper field-container-wrapper stretched right" id="mg-echo-cvv-wrapper">
                                                <div class="field-container">
                                                    <div class="mg-echo-label left">CVV/CVC</div>
                                                    <div class="error-icon right"></div>
                                                    <span class="input-wrapper stretched"><input name="expiry" id="mg-echo-cvv" class="cvv" maxlength="4"></span>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="clear"></div>
                                        <div class="postcode-wrapper field-container-wrapper stretched" id="mg-echo-postcode-wrapper">
                                            <div class="field-container">
                                                <div class="mg-echo-label left"><spring:message code="postal_code"/></div>
                                                <div class="error-icon right"></div>
                                                <span class="input-wrapper stretched"><input name="postcode" class="postcode"></span>
                                            </div>
                                        </div>
                                        <div class="clear"></div>
                                    </div>
                                </div>
                            </div>
                            <div class="clear"></div>
                            <div class="mg-echo-bottom-panel">
                                <div class="mg-echo-info-panel mg-echo-column left mg-echo-flex">
                                    <div>
                                        <div class="mg-echo-flex response-time-wrap">
                                            <div class="response-time" style="display:none;">
                                                <div class="mg-echo-label"> <spring:message code="response_time"/></div>
                                                <div class="value"></div>
                                            </div>
                                            <div class="price-wrapper">
                                                <div class="total-price">
                                                    <div class="estimated-total"> <spring:message code="estimated_total"/></div>
                                                    <div class="mg-echo-price"></div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="estimated-journey-time">
                                            <spring:message code="estimated_journey_time"/> <span class="value"></span>
                                        </div>
                                    </div>
                                    <div>
                                    <c:choose>
                                        <c:when test="${companyResources == 'ECTR'}">
                                            <div class="extra-charges">
                                                <spring:message code="extra_charges_text"/>
                                                <spring:message arguments="${companySettings['termsUrl.en']}" code="more_info_extra_charges"/>
                                            </div>
                                        </c:when>
                                        <c:otherwise>
                                            <div class="extra-charges"><spring:message code="the_total"/> <span class="extra-charges-vat"></span>, <spring:message code="extra_charges_text"/>
                                                <a class="extra-charges-link" target="_blank" href="${companySettings['pricingUrl']}"> <spring:message code="more_info_extra_charges"/></a>
                                            </div>
                                        </c:otherwise>
                                    </c:choose>
                                    </div>
                                </div>
                                <div class="button-wrapper mg-echo-column right">
                                    <div class="mg-echo-book stretched">
                                        <div class="mg-echo-loading" style="display: none;"></div>
                                        <div class="mg-echo-btn-text"><spring:message code="book"/></div>
                                    </div>
                                    <div class="mg-echo-link-btn mg-close">
                                        <a href="#"><spring:message code="cancel"/></a>
                                    </div>
                                    <div class="mg-echo-link-btn logout" style="display:none;">
                                        <a href="#"><spring:message code="logout"/></a>
                                    </div>
                                    <div class="mg-echo-btn-next"><spring:message code="next"/></div>
                                </div>
                            </div>
                        </div>
                    </form>
                    <div class="mg-echo-bottom-panel-fixed">
                        <div class="mg-echo-book stretched">
                            <div class="mg-echo-loading" style="display: none;"></div>
                            <div class="mg-echo-btn-text"><spring:message code="book"/> <span></span></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
