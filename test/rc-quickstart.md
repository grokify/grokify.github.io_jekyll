## Voice

```php
$apiResponse = $sdk->platform()->post('/account/~/extension/~/ringout', array(
    'from' => array('phoneNumber' => 'your-ringcentral-sms-number'),
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
        from: {phoneNumber:'+12223334444'},
        to: [
            {phoneNumber:'+15556667777'}
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
                         array('phoneNumber' => '16501112233'),
                     ),
                     'faxResolution' => 'High',
                 ))
                 ->add('Plain Text', 'file.txt')
                 ->add(fopen('path/to/file', 'r'))
                 ->request('/account/~/extension/~/fax');

$response = $platform->sendRequest($request);
```
