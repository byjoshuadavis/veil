# Envelope822: Convert email or HTTP messages to Javascript objects

Envelope822 turns this

    Subject: Hello, Envelope822!
    Date: Wed Dec 27 2024 09:06:59 GMT+0700 (ICT)
    From: jhs@example.com

    Hello, Envelope822. Welcome to the party.

into this.

```javascript
{ Date: Wed, 27 Dec 2023 02:06:59 GMT,
  From: 'jhs@example.com',
  Subject: 'Hello, Envelope822!',
  body: 'Hello, Envelope822. Welcome to the party.' }
```

Envelope822 is available as an NPM module.

    $ npm install envelope822

## Example

```ts
import envelope822 from 'envelope822';

var message = 'Date: Tue, 17 Jan 2012 02:11:48 GMT\n'
            + 'Subject: This is the example\n'
            + '\n'
            + 'This is the body'

message = envelope822.parse(message)
console.dir(message)
```

Output:

    { Date: Tue, 17 Jan 2012 02:11:48 GMT,
      Subject: 'This is the example'
      body: 'This is the body' }

## Tests

Envelope822 uses [node-tap][tap]. If you clone this Git repository, tap is included.

    $ ./node_modules/.bin/tap test
    XXX

    ok

## License

Apache 2.0, originally forked from [Veil](https://github.com/iriscouch/veil)