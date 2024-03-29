## Voice

```php
$apiResponse = $sdk->platform()->post('/account/~/extension/~/ringout', array(
    'from' => array('phoneNumber' => 'your-ringcentral-number'),
    'to' => array('phoneNumber' => 'mobile-number'),
    'playPrompt' => true
));
```

## SMS

```php
$apiResponse = $sdk->platform()->post('/account/~/extension/~/sms', array(
    'from' => array('phoneNumber' => 'your-ringcentral-sms-number'),
    'to' => array(
        array('phoneNumber' => 'mobile-number'),
    ),
    'text' => 'Test from PHP',
));
```

```js
rcsdk.platform()
    .post('/account/~/extension/~/sms', {
        from: {phoneNumber:'your-ringcentral-sms-number'},
        to: [
            {phoneNumber:'mobile-number'}
        ],
        text: 'Message content'
    })
    .then(function(response) {
        alert('Success: ' + response.json().id);
    })
    .catch(function(e) {
        alert('Error: ' + e.message);
    });
```

## Fax

```php
$request = $rcsdk->createMultipartBuilder()
                 ->setBody(array(
                     'to' => array(
                         array('phoneNumber' => 'recipient-fax-number'),
                     ),
                     'faxResolution' => 'High',
                 ))
                 ->add('Plain Text', 'file.txt')
                 ->add(fopen('path/to/file', 'r'))
                 ->request('/account/~/extension/~/fax');

$response = $platform->sendRequest($request);
```

```js
var body = {
        to: [{phoneNumber: 'recipient-fax-number'}],
        faxResolution: 'High'
    },
    formData = new FormData();

// This is the mandatory part, the name and type should always be as follows
formData.append('json', new File([JSON.stringify(body)], 'request.json', {type: 'application/json'}));

// Find the input[type=file] field on the page
var fileField = document.getElementById('input-type-file-field');

// Iterate through all currently selected files
for (var i = 0, file; file = fileField.files[i]; ++i) {
    formData.append('attachment', file); // you can also use file.name instead of 'attachment'
}

// To send a plain text
formData.append('attachment', new File(['some plain text'], 'text.txt', {type: 'application/octet-stream'}));

// Send the fax
rcsdk.platform().post('/account/~/extension/~/fax', formData);
```
