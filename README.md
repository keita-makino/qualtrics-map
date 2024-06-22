# qualtrics-map

A react-based component that displays an embedded [Mapbox](https://www.mapbox.com/) interface on [Qualtrics](https://www.qualtrics.com).

## Breaking change on v3.1.0

Qualtrics recently introduced a new "Simple" layout under the Look and feel settings but this component does not work with it so please use one of the other layouts.

The way to set the default center has been changed on v3.1.0. Please refer to the installation manual below if you have migrated from an earlier version.

Version 3.1.0 also introduces a new feature of default pins. You can set the editable property for each of the pins.

## Breaking change on v3.0.0

The recent change (January 2024) disabled the use of `removeChild` method on an HTMLElement that does not have a parent node, which made the previous Google Maps no longer work.  
The early versions of v3 may have some bugs or unintended behaviors. Please report them via the issues if you find one.

## Features

- Collection of multiple answers to one question.
  - e.g., "From:" and "To:"
- Use either the address bar with autocomplete or a map marker.

---

## Example

![Example](/public/example.gif)

---

# Installation

## Mapbox API

This library uses [Mapbox API](https://www.mapbox.com/product-apis). If you do not have an account, please create one via the link.  
After creating the account, please obtain the access token for this map via the [account page](https://account.mapbox.com/).

## CDN URL

Copy [https://cdn.jsdelivr.net/gh/keita-makino/qualtrics-map/dist/bundle.js](https://cdn.jsdelivr.net/gh/keita-makino/qualtrics-map/dist/bundle.js) <- this address (_not the contents of this address_).

## Qualtrics survey settings

### Header settings

1. In the survey edit screen, click "Look & Feel" on right-top.
1. Select "General" tab and then edit the "Header".
1. Click the "<>" icon to enter coding-view.
1. Copy and paste the following code.

```javascript
<script>
  jQuery.noConflict();
  var countryCode = '${loc://CountryCode}';
  var postalCode = '${loc://PostalCode}';
</script><br />
<link href="https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-geocoder/v5.0.0/mapbox-gl-geocoder.css" rel="stylesheet" type="text/css" />
<link href="https://api.mapbox.com/mapbox-gl-js/v3.1.0/mapbox-gl.css" rel="stylesheet" />
<script src="https://cdn.jsdelivr.net/gh/keita-makino/qualtrics-map@3.0.1/dist/bundle.js"></script>
```

### JavaScript coding

1. The question that you want to add the map to has to be set as a "Form Field" question.
1. Add/remove text fields and set the field tag as you need. (e.g., Two text fields named "From:" and "To:").
1. In the question, click the gear icon and then "Add Javascript..."
1. Use the following code.
1. If you need to set a default center location or zoom level, use the latter one.
1. **All done!**

```javascript
Qualtrics.SurveyEngine.addOnload(function () {
  document
    .getElementById(this.questionId)
    .querySelectorAll('[role*=presentation]')[0].style.display = 'none';
});

Qualtrics.SurveyEngine.addOnReady(function () {
  mapRender(
    'the access token you copied from the account page',
    document.getElementById(this.questionId),
  );
});

// If you need to set a default center and zoom level
Qualtrics.SurveyEngine.addOnReady(function () {
  mapRender(accessToken, document.getElementById('QID1'), {
    defaultView: {
      location: {
        lat: 50,
        lng: -100,
      },
      zoom: 13,
    },
    defaultPins: [
      {
        location: {
          lat: 50,
          lng: -100,
        },
        editable: false,
      },
    ],
  });
});

// If you need to have default pins
Qualtrics.SurveyEngine.addOnReady(function () {
  mapRender(accessToken, document.getElementById('QID1'), {
    defaultPins: [
      {
        location: {
          lat: 50,
          lng: -100,
        },
        editable: false,
      },
      {
        location: {
          lat: 51,
          lng: -100,
        },
        editable: true,
      },
    ],
  });
});
```

## Notes

This package relies on the [Mapbox Geocoding API](https://docs.mapbox.com/api/search/geocoding/) for forward and reverse geocoding. The API is free until 100,000 calls per month but will charge after that, so please note that if you target a _very large_ project.
