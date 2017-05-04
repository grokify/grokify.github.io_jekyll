```php

$request = $rcsdk->createMultipartBuilder()
                 ->setBody(array(
                     'to'         => array(
                         array('phoneNumber' => '16501112233  '),
                     ),
                     'faxResolution' => 'High',
                 ))
                 ->add('Plain Text', 'file.txt')
                 ->add(fopen('path/to/file', 'r'))
                 ->request('/account/~/extension/~/fax'); // also has optional $method argument

$response = $platform->sendRequest($request);

```
