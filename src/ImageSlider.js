import React, { useRef, useState, useEffect } from "react";
import {
  View,
  FlatList,
  Image,
  Dimensions,
  Animated,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

const { width } = Dimensions.get("window");

const ImageSlider = ({
  images,
  height = 200,
  autoPlay = true,
  autoPlayInterval = 3000,
  indicatorColor = "#ccc",
  activeIndicatorColor = "grey",
  onImagePress,
  containerStyle,
}) => {
  const [currentIndex, setCurrentIndex] = useState(1);
  const flatListRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const progressAnimations = useRef(
    images.map(() => new Animated.Value(0))
  ).current;

  const infiniteImages = useRef([
    images[images.length - 1],
    ...images,
    images[0],
  ]).current;

  const [data] = useState(infiniteImages);

  // Animate progress bar
  const animateProgress = (index) => {
    progressAnimations.forEach((anim, i) => {
      Animated.timing(anim, {
        toValue: i === index ? 1 : 0,
        duration: autoPlayInterval,
        useNativeDriver: false,
      }).start();
    });
  };

  useEffect(() => {
    if (autoPlay) {
      const interval = setInterval(() => {
        let nextIndex = currentIndex + 1;
        flatListRef.current.scrollToIndex({
          index: nextIndex,
          animated: true,
        });
        setCurrentIndex(nextIndex);
      }, autoPlayInterval);

      return () => clearInterval(interval);
    }
  }, [currentIndex, autoPlay, autoPlayInterval]);

  useEffect(() => {
    animateProgress(currentIndex - 1);
  }, [currentIndex]);

  const handleMomentumScrollEnd = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(offsetX / width);

    if (newIndex === 0) {
      flatListRef.current.scrollToIndex({
        index: data.length - 2,
        animated: false,
      });
      setCurrentIndex(data.length - 2);
    } else if (newIndex === data.length - 1) {
      flatListRef.current.scrollToIndex({
        index: 1,
        animated: false,
      });
      setCurrentIndex(1);
    } else {
      setCurrentIndex(newIndex);
    }
  };

  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      style={styles.imageContainer}
      onPress={() => onImagePress?.(item, index - 1)}
      activeOpacity={0.8}
    >
      <Image source={{ uri: item }} style={[styles.image, { height }]} />
    </TouchableOpacity>
  );

  const renderIndicator = () => (
    <View style={styles.indicatorContainer}>
      {images.map((_, index) => {
        const animatedWidth = progressAnimations[index].interpolate({
          inputRange: [0, 1],
          outputRange: [8, 20],
        });

        return (
          <Animated.View
            key={index}
            style={[
              styles.indicator,
              {
                backgroundColor:
                  index === currentIndex - 1
                    ? activeIndicatorColor
                    : indicatorColor,
                width: animatedWidth,
              },
            ]}
          />
        );
      })}
    </View>
  );

  return (
    <View style={[styles.container, containerStyle]}>
      <FlatList
        ref={flatListRef}
        data={data}
        renderItem={renderItem}
        keyExtractor={(_, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        initialScrollIndex={1}
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
      />
      {renderIndicator()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: {
    width,
  },
  image: {
    width: "100%",
    resizeMode: "cover",
  },
  indicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 10,
  },
  indicator: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 5,
  },
});

export default ImageSlider;
