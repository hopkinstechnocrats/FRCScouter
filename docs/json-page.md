JSON Page
===

JSON Page is a method of representing webpages in a JSON format for easy editing and storage.

Overview
---
Let's take a look at how it works by going through an example.

// actually will probably make a tool to generate these

```json
JSON Page example
{
    "version": "JSONPage.5.0.0",
    "name": "sample-page",
    "format": "objects-decending",
    "objects": [
        {
            "object-type": "text-massive",
            "text": "Hello World!"
        },
        {
            "object-type": "text",
            "text": "This is how you create a JSON Page."
        },
        {
            "object-type": "button",
            "text": "does nothing",
            "action": "none"
        }
        {
            "object-type": "break",
            "amount": 3
        },
        {
            "object-type": "button",
            "text": "go to page b",
            "action": {
                "type": "redirect",
                "name": "page-b",
                "sub-action": "none"
            }
        },
        {
            "object-type": "break",
            "amount": 1
        },
        {
            "object-type": "button",
            "text": "submit",
            "action": {
                "type": "network",
                "direction": "send",
                "data": "variable-name-a",
                "sub-action": "none"
            }
        }
    ]
}
```

Objects
---
```
====================================
|    name    |  field   |   type   |
|text-massive|   text   |  String  |
|    text    |   text   |  String  |
====================================
```

Types
---
 - String | A set of characters. A piece of text.
 - Number | A number. Seriously?
 - action | [Action docs](put a sublink here)

Actions
---
stuff about actions here
