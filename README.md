# React Native Image Slider

## Installation

```bash
npm install rn-image-slider
```

## Usage

```javascript
import React from "react";
import { View } from "react-native";
import ImageSlider from "rn-image-slider";

const images = [
  "https://example.com/image1.jpg",
  "https://example.com/image2.jpg",
  "https://example.com/image3.jpg",
];

const App = () => (
  <View style={{ flex: 1 }}>
    <ImageSlider
      images={images}
      interval={3000}
      onSlideChange={(index) => console.log(`Slide changed to index: ${index}`)}
    />
  </View>
);

export default App;
```

## Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |

## License

MIT
