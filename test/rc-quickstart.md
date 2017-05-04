
## SMS

```php
$apiResponse = $sdk->platform()->post('/account/~/extension/~/sms', array(
    'from' => array('phoneNumber' => 'your-ringcentral-sms-number'),
    'to'   => array(
        array('phoneNumber' => 'mobile-number'),
    ),
    'text' => 'Test from PHP',
));
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
