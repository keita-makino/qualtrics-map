# qualtrics-map

A react-based component that displays an embedded google map in Qualtrics.  

## Features

- Collection of multple answers in one question.
  - e.g., "From:" and "To:"
- Use either of address bar with autocomplete or map marker

![Example](example.png)

# Installation

## Google Maps API

This library uses Google Maps [Javascript API](https://developers.google.com/maps/documentation/javascript/tutorial) and [Places API](https://developers.google.com/places/web-service/intro).  
Make sure you have a key to access those APIs.

## Serve bundle.js

1. Clone or download the repository.
2. `npm ci`
3. `npm run build`
4. Anywhere in your local environment, create an empty text file `bundle.txt`. 
5. Go to the files library on qualtrics.
6. Upload the text file.
7. Click the uploaed file and then "Edit" on the right-top.
8. Select "Choose a new file from your computer" and upload the `bundle.js`.

## Qualtrics Survey Settings

1. In the survey settings and click Look & Feel on the top.
2. Select "General" tab and then edit the "Header".
3. In the editor, click the paper icon to insert the bundle file.
4. Select `bundle.js`.
5. Click the "<>" icon to enter coding-view.
6. Copy the url of href attribute.
7. Copy and paste the following code, replacing the `[apiKey]` and `[fileUrl]` with respectively the API key and the url.

```
<script>
  var apiKeyGoogleMap = "[apiKey]";
</script><br />
<script src="[fileUrl]"></script>
```

## Use It

1. The question that you want add the map has to be set as "Text Entry" question.
2. Add / remove text fields and set the field tag as you need. (e.g., Two text fields named "From:" and "To:".)
2. In the question, click the gear icon and then "Add Javascript..."
4. Copy and paste the following code.
5. **All done!**

```
Qualtrics.SurveyEngine.addOnload(function()
{
	mapRender(apiKeyGoogleMap);
});
```
