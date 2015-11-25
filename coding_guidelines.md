# linee guida

## REST

- errori gestiti
status 200, body { resp: 'err', code: <error code>, msg: <error message>, data: { ... } }
- errori non gestiti
status 500
- a buon fine
status 200, body { resp: 'ok', data: { ... } }
