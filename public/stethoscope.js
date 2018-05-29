var checkStethoscope;

(function() {
  var query =
    "query ValidateDevice($policy: DevicePolicy!) { \
    policy { \
      validate(policy: $policy) { \
        status \
        osVersion \
        firewall \
        diskEncryption \
        screenLock \
        automaticUpdates \
        remoteLogin \
        stethoscopeVersion \
        requiredApplications { \
          name \
          status \
        } \
        bannedApplications { \
          name \
          status \
        } \
        suggestedApplications { \
          name \
          status \
        } \
      } \
    } \
    device { \
      deviceId \
      deviceName \
      platform \
      platformName \
      friendlyName \
      osVersion \
      osName \
      osBuild \
      firmwareVersion \
      hardwareModel \
      hardwareSerial \
      stethoscopeVersion \
      osqueryVersion \
      ipAddresses { \
        interface \
        address \
        mask \
        broadcast \
      } \
      macAddresses { \
        interface \
        type \
        mac \
        physicalAdapter \
        lastChange \
      } \
      security { \
        firewall \
        publicFirewall \
        privateFirewall \
        domainFirewall \
        automaticUpdates \
        diskEncryption \
        screenLock \
        remoteLogin \
        automaticAppUpdates \
        automaticSecurityUpdates \
        automaticOsUpdates \
        automaticDownloadUpdates \
        automaticConfigDataInstall \
      } \
    } \
  }";

  checkStethoscope = function(policy) {
    return fetch(
      "http://127.0.0.1:37370/graphql?" +
        "query=" +
        encodeURIComponent(query) +
        "&" +
        "variables=" +
        encodeURIComponent(JSON.stringify({ policy: policy }))
    ).then(res => res.json());
  };
})();
