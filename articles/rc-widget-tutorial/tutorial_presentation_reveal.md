### RingCentral JS Widget

Tyler Liu

---

## Agenda

* What is RingCentral JS Widget
* GitHub Pages integration
  * Setup
  * Github Pages Embed
  * Github Pages Click-to-Dial
* Salesforce Lightning integration
  * Prerequisites
  * Setup
  * Salesforce Lightning Embed
  * Salesforce Lightning Click-to-Dial
  * Salesforce Lightning Inbound Screen Pop
  * Salesforce Lightning Call Logging

---

## What is RingCentral JS Widget

https://github.com/ringcentral/ringcentral-js-widget

RingCentral integration widgets aim to provide reusable UI components to allow developers to integrate RingCentral unified communication service into third party processes or tools more easily.

It is for you if you want lots of RingCentral features inside your browser.

---

## GitHub Pages integration - Setup

GitHub Pages is a hosting service for static websites. So the approach described here applies to websites that want to integrate RingCentral JS Widget on client side without server side code.

Demo code: https://github.com/embbnux/ringcentral-widget-demo

Live demo: https://embbnux.github.io/ringcentral-widget-demo/

---

## GitHub Pages integration - Embed

It’s recommended to use `<iframe>` to embed.
Let’s take the live demo 
https://embbnux.github.io/ringcentral-widget-demo/ for example, there is an <iframe> and its source is https://embbnux.github.io/ringcentral-widget-demo/app.html

Recommended size for the iframe is 300px * 500px.

Sample code:

```html
<iframe id="rc-phone-iframe" width="300" height="500" src="https://embbnux.github.io/ringcentral-widget-demo/app.html"></iframe>
```

---

## GitHub Pages integration - Click-to-Dial

The website and the embedded iframe communicate via Window.postMessage().

Simply post a message to the iframe to trigger Click-to-Dial:

`<a href="#" onClick="callNumber('123-456-78')">123-456-78</a>`

```js
function callNumber(number) {
    document.querySelector("#rc-phone-iframe").contentWindow.postMessage({
        type: 'rc-adapter-new-call',
        phoneNumber: number,
        toCall: true,
    }, '*');
}
```

---

## Salesforce Lightning integration - Prerequisites

Salesforce developer account: https://developer.salesforce.com/signup

Knowledge of VisualForce: https://trailhead.salesforce.com/projects/quickstart-visualforce

Knowledge of Apex: https://trailhead.salesforce.com/modules/apex_database

Knowledge of Salesforce Call Center: https://trailhead.salesforce.com/modules/service_call

---

## Salesforce Lightning integration - Setup

Login your Salesforce developer account: https://login.salesforce.com/

Create a call center by importing the following definition file:

```xml
<callCenter>
  <section sortOrder="0" name="reqGeneralInfo" label="General Information">
    <item sortOrder="0" name="reqInternalName" label="Internal Name">RingCentralAdapterOpenCTI</item>
    <item sortOrder="1" name="reqDisplayName" label="Display Name">RingCentral Call Center Adapter Open CTI</item>
    <item sortOrder="2" name="reqAdapterUrl" label="CTI Adapter URL">/apex/RCPhone</item>
    <item sortOrder="3" name="reqUseApi" label="Use CTI API">true</item>
    <item sortOrder="4" name="reqSoftphoneHeight" label="Softphone Height">550</item>
    <item sortOrder="5" name="reqSoftphoneWidth" label="Softphone Width">300</item>
    <item sortOrder="6" name="reqSalesforceCompatibilityMode" label="Salesforce Compatibility Mode">Lightning</item>
  </section>
</callCenter>
```

Add the current user to call center.

---

## Salesforce Lightning integration - Embed

Create a VisualForce page named RCPhone:

<apex:page>
    <style>
        .hasMotif {
            margin : 0px;
        }
    </style>
    <apex:iframe src="https://embbnux.github.io/ringcentral-widget-demo/app.html" height="500" width="300" frameborder="false"/>
</apex:page>

Create new Salesforce app, add a Open CTI Softphone to its utility bar. Launch this app and verify that there is an embedded phone in the utility bar.

---

## Salesforce Lightning integration - Click-to-Dial

```html
<script src="/support/api/40.0/lightning/opencti_min.js"></script>
  <script>
        function postMessage(data) {
            document.getElementsByTagName('iframe')[0].contentWindow.postMessage(data, '*');
        }  
        sforce.opencti.enableClickToDial();
        sforce.opencti.onClickToDial({
            listener: function(result) {
                postMessage({
                    type: 'rc-adapter-new-call',
                    phoneNumber: result.number,
                    toCall: true,
                });
                sforce.opencti.setSoftphonePanelVisibility({ visible: true });
            }
        });
   </script>
```

## Salesforce Lightning integration - Inbound Screen Pop - 1

Create an Apex class named “RCPhoneHelper”:

  global class RCPhoneHelper {
    webService static Contact searchContact(String phone) {
        List<List<SObject>> l = [FIND :phone IN PHONE FIELDS RETURNING Contact(Id limit 1)];
        if(l.size() > 0 && l[0].size() > 0) {
            return (Contact)l[0][0];
        }
        return null;
    }
}

---

Salesforce Lightning integration - Inbound Screen Pop - 2

function receiveMessage(event) {
    if(event.data.type === 'rc-call-ring-notify') {
        sforce.opencti.setSoftphonePanelVisibility({ visible: true });
        sforce.opencti.runApex({ apexClass: 'RCPhoneHelper', methodName: 'searchContact', methodParams: 'phone=' + event.data.call.from,
            callback: function(response) {
                if(response.success == true) {
                    var contactId = response.returnValue.runApex.Id;
                    if(contactId !== null) {
                        sforce.opencti.screenPop({
                            type: sforce.opencti.SCREENPOP_TYPE.SOBJECT,
                            params: { recordId: contactId }
                        });
                    }
                }
            } 
        });
    } 
}
window.addEventListener("message", receiveMessage, false);

---

## Salesforce Lightning integration - Call Logging - 1

Add an Apex method to RCPhoneHelper class:

```js
webService static void logACall(string contactId, Integer duration, String fromNumber, String toNumber) {
        Task t = new Task(
            ActivityDate = date.today(),
            CallDurationInSeconds = duration,
            CallType = 'Inbound',
            Description = 'From: ' + fromNumber + '\nTo: ' + toNumber + '\nDuration: ' + duration + ' seconds',
            Status = 'Completed',
            Subject = 'Call log',
            TaskSubtype = 'Call',
            Type = 'Call',
            WhoId = contactId   
        );             
        insert t;
    }
```

---

## Salesforce Lightning integration - Call Logging - 2

```js
              else if (event.data.type === 'rc-call-end-notify') {
                if(event.data.call.startTime !== null) {
                    sforce.opencti.runApex({ apexClass: 'RCPhoneHelper', methodName: 'searchContact', methodParams: 'phone=' + event.data.call.from,
                        callback: function(response) {
                            if(response.success == true) {
                                var contactId = response.returnValue.runApex.Id;
                                if(contactId !== null) {
                                     sforce.opencti.runApex({ apexClass: 'RCPhoneHelper', methodName: 'logACall',  methodParams: 'contactId=' + contactId 
                                         + '&duration=' + Math.round((event.data.call.endTime - event.data.call.startTime) / 1000) 
                                         + '&fromNumber=' + event.data.call.from 
                                         + '&toNumber=' + event.data.call.to,
                                        callback: function(rr) {  console.log(rr); }
                                     });
                                }
                            }
                        } 
                    });
                }
            }
```

