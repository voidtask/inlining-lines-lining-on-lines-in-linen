<!--
    paste script below before other inline booking scripts
    *
    * rootPath -       context path for api requests
    * currency -        currency code: &euro; , &pound;
    * extraChargesLink - link to extra charges page
-->
<script type="text/javascript">
    var mg_echo_conf = {
        rootPath: "${companySettings['url']}/inline-booking",
        currency: "&pound;",
        currencyPosition: "left",
        locale: "en",
        companyPhone: "${companySettings['phone']}",
        analytics: "${companySettings['analytics']}",
        captchaPublicKey: "${captchaPublicKey}",
        preferredCountries: "${preferredCountries}",
        defaultPickup: "",
        blockAddressChange: false,
        extraParams: window.location.search    }
</script>