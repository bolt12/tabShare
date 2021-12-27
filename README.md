# TabShare

Share your Google Chrome Tabs easily.

## Description

Want to share a bunch of links with someone and don't want to paste them one by one in a
text file? Want someone to share a bunch of links with you and don't want to manually
open them one by one in new tabs?

If you are reading this then surely you found yourself looking either for gifts or
choosing between many different options and keeping tabs open only to tediously share it
with someone.

If you were looking for a solution, now you can with Google Chrome's new extension: TabShare !

## How to use

Open TabShare extension window. If you wish to share tabs all you have to do is to SHIFT
or CONTROL select the tabs you want, decide whether you wish to group the tabs or not,
name the group if that is the case and then press "Share selected tabs". A `tabShare.json`
file will be downloaded! All you have to do is to share that with someone that also has
the TabShare extension and can load the file!

Make sure the URLs from your tabs are valid ones and/or can be accessible via HTTP or
HTTPS protocols. For example: "chrome://extensions/:" is not a valid HTTP URL.

Have fun sharing and contributing with ideas for improving! TabShare is only in Beta
version and would appreciate feedback! :)

### File Format

JSON file format:

```json
{
  "groups": [
    {
      "name": "MyGroup",
      "tabs": [ "http://www.myurl.com" ]
    }
  ]
}
```

The `tabs` key needs to have valid HTTP URLs.

## Features and TODOs

- Import tabShare file to load tabs automatically.
- Generate tabShare file to share with others.
- It works with Chrome's tab groups features.

### TODOs

- Share groups that already exist in the current session;
  (NOTE: Selecting tabs in a group does not preserve the group)
- Fix query to work with multiple chrome sessions;
  (NOTE: Right now if the last focused chrome window/session is not
   the desired one, tabShare will open the tabs in the incorrect window)
- Not only download the file but also show it in the UI instead so one can copy
  paste it;
- Instead of a `.json` file to share, use an encoded short link or even token.

## Contributing

First a disclaimer: I wrote this extension to solve a specific problem I had in the
simplest way possible, hence having used vanilla Javascript. I am not really proud of
the code I ended up writing but it works and it, truly is, simple. Having said this, I hope
contributions to keep simple as well, unless there's a really good reason to change and do
this extension with a framework like React, Vue or whatever latest trend is.

I would really appreciate ideas and contributions on how to improve user experience and
UI, hopefully something that could fit your patterns of using this extension!

## Credit

Icons made by [Smashicons](https://www.flaticon.com/authors/smashicons) from [www.flaticon.com](https://www.flaticon.com).
