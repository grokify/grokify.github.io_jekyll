# TLS Certs

## Parsing Certificates

You can parse the certs here:

https://decoder.link/result

Paste in either of the following:

1. Server cert: [tls_grokbase.com_letsencrypt_server.pem](tls_grokbase.com_letsencrypt_server.pem)
1. Intermediate CA cert: [tls_grokbase.com_letsencrypt_inca.pem](tls_grokbase.com_letsencrypt_inca.pem)

## Chaining Certificates

You can verify the cert chain here:

https://decoder.link/ca_matcher

Steps:

1. For "END-ENTITY CERTIFICATE", paste in the PEM-encoded cert here: [tls_grokbase.com_letsencrypt_server.pem](tls_grokbase.com_letsencrypt_server.pem)
1. For "CA CERTIFICATE", paste in the PEM-encoded cert here: [tls_grokbase.com_letsencrypt_inca.pem](tls_grokbase.com_letsencrypt_inca.pem)
1. Click "MATCH"
