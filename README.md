# qualtrics-map

A react-based component that displays an embedded Google Maps in [Qualtrics](https://www.qualtrics.com).

## Features

- Collection of multiple answers in one question.
  - e.g., "From:" and "To:"
- Use either of address bar with autocomplete or map marker.

---

![Example](example.png)

---

# Installation

## Google Maps API

This library uses Google Maps [Javascript API](https://developers.google.com/maps/documentation/javascript/tutorial) and [Places API](https://developers.google.com/places/web-service/intro).  
Make sure you have a key to access those APIs.

## Get bundle.js

There are two ways to obtain your `bundle.js`. Choose one way as your needs and then proceed to "Qualtrics Survey Settings".

### Using Template

Download the template from the [relaese page](https://github.com/keita-makino/qualtrics-map/releases).

### Build by Yourself

Alternatively, you can build the component in your environment.  
This approach is neeeded if you want to custom the component (placeholder text, button color, and others).

1. Clone or download the repository.
1. `npm ci`
1. `npm run build`
1. Anywhere in your local environment, create an empty text file `bundle.txt`.

## Qualtrics Survey Settings

### File Upload

1. Go to the files library in Qualtrics.
1. Upload the text file.
1. Click the upload file and then "Edit" on the right-top.
1. Select "Choose a new file from your computer" and upload the `bundle.js`.

### Header Settings

1. In the survey settings and click Look & Feel on the top.
1. Select "General" tab and then edit the "Header".
1. In the editor, click the paper icon to insert the bundle file.
1. Select `bundle.js`.
1. Click the "<>" icon to enter coding-view.
1. Copy the url of href attribute.
1. Copy and paste the following code, replacing the `[apiKey]` and `[fileUrl]` with respectively the API key and the url.

```
<script>
  var apiKeyGoogleMap = "[apiKey]";
</script><br />
<script src="[fileUrl]"></script>
```

## Use It

1. The question that you want add the map has to be set as "Text Entry" + "Form" question.
1. Add / remove text fields and set the field tag as you need. (e.g., Two text fields named "From:" and "To:").
1. In the question, click the gear icon and then "Add Javascript..."
1. Copy and paste the following code.
1. **All done!**

```
Qualtrics.SurveyEngine.addOnload(function()
{
	document.querySelectorAll('[role*=presentation]')[0].style.display = "none";
});

Qualtrics.SurveyEngine.addOnReady(function()
{
	mapRender(apiKeyGoogleMap);
});
```
