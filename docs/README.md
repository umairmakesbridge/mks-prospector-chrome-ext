# mks-google-prospector

This project was generated with the [react-chrome-redux-examples by tshaddix](https://github.com/tshaddix/react-chrome-redux-examples/tree/master)

## Getting Started

### Commands for style guide

- [Initialization] (`docsify init ./docs`)
- [Generate HTML from .md] (`docsify serve ./docs`)

### Components Details

#### AddBox

This component is designed for creating add dialog.
- Add New task
- Add Basic Fields
- Add Custom Fields

Prop | Type | Default | Req | Description
--- | --- | --- | --- | ---
showTitle | `String` | "Box Title" | true | Title of the dialog
addFieldsObj | `Array of Objects` | "" | true | Form fields that want to be generated
boxType | `String` | "" | true | Type of form which needs to be generated
create | `Function` | "Call Back Method" | true | Function which attached to save button
cancel | `Function` | "Call Back Method" | true | Function which attached to cancel button

#### AddNewContact

This component is designed for creating new subscriber contact in bridgemail system

Prop | Type | Default | Description
--- | --- | --- | ---
users_details | `String` | "" | Current logged in user details
onEmailSelect | `String` | "" | if email is selected from email body and it doesn't exists in bridgemail system

#### ContactInfo

A wrapper component contain subscriber
  - basic information
  - custom fields
  - tags
  - salesforce details
  - subsriber lists

##### ContactBasicInfo

This component generate all the basic contact details of subscriber

Prop | Type | Description
--- | --- | ---
email | `String` | Email of the subscriber
firstName | `String` | First name of the subscriber
lastName | `String` | Last name of the subscriber
company | `String` | Company of the subscriber
telephone | `String` | Telephone of the subscriber
city | `String` | City of the subscriber
state | `String` | State of the subscriber
address1 | `String` | Address of the subscriber
jobStatus | `String` | Job Status of the subscriber
salesRep | `String` | Sales representative of the subscriber
salesStatus | `String` | Sales status of the subscriber
birthDate | `String` | Date of birth of the subscriber
areaCode | `String` | Area code of the subscriber
country | `String` | Country of the subscriber
zip | `String` | Zip of the subscriber
industry | `String` | Industry of the subscriber
source | `String` | Source of the subscriber
occupation | `String` | Occupation of the subscriber

##### ContactTags

Tags component to attach tags to a subscriber.

Prop | Type | Description
--- | --- | ---
Tags | `String` | Comma separated tags

##### CustomFields

Component responsible for all custom fields generation and addition

Prop | Type | Description
--- | --- | ---
custom_fields | `Array of Objects` | All custom fields added to subscriber
contact | `Object` | Subscriber complete information
users_details | `Object` | Current logged in user information object

### ActivityCard

The ActivityCard Component is a wrap for multiple components.The list of components are mentioned below

Component Name | Type | Description
--- | --- | ---
Campaign Card | "N" / "WV" / "MT" | Campaign activity timeline
Signup Card  | "SU" | Signup of new user activity
Nurture Track Card | "T" | Nurture Track activity timeline
Workflow Card | "W" / "MM / "A" | Workflow activity timeline
Score Card | "SC" | Score activity timeline
Alert Card | "A" /  "B" / "botId available" | Alert activity timeline


#### Campaign_Card
Prop | Type | Default |  Description
--- | --- | --- | --- |  ---
Campaign Name | `String` | "" | Name of Campaign
Subject | `String` | "" | Subject of the Campaign
Url    | `String` | "" | click url is provided
isFuture | `String` | "" | If camapign is schedule in future
