import { Colors } from "@/constants/theme";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ExpandableTextProps {
  text: string;
  fullText: string;
  numberOfLines?: number;
  expandLabel?: string;
  collapseLabel?: string;
}

export function ExpandableText({
  text,
  fullText,
  numberOfLines = 2,
  expandLabel = "Показать ещё",
  collapseLabel = "Скрыть",
}: ExpandableTextProps) {
  const [expanded, setExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [lineHeight, setLineHeight] = useState(20);

  return (
    <View style={styles.wrapper}>
      <Text
        style={[styles.preview, styles.hiddenMeasure]}
        onTextLayout={(e) => {
          const lines = e.nativeEvent.lines;
          if (lines.length > 0) setLineHeight(lines[0].height);
          setIsOverflowing(lines.length > numberOfLines);
        }}
      >
        {text}
      </Text>

      <Text
        style={styles.preview}
        numberOfLines={expanded ? undefined : numberOfLines}
        ellipsizeMode={expanded ? undefined : "clip"}
      >
        {fullText}
      </Text>

      {!expanded && isOverflowing && (
        <View style={[styles.gradientRow, { height: lineHeight }]}>
          <LinearGradient
            colors={["rgba(255,255,255,0)", "#FFFFFF"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradient}
          />
          <TouchableOpacity
            onPress={() => setExpanded(true)}
            activeOpacity={0.7}
            style={[styles.labelWrapper, { height: lineHeight }]}
          >
            <Text style={styles.toggleLabel}>{expandLabel}</Text>
          </TouchableOpacity>
        </View>
      )}

      {expanded && isOverflowing && (
        <TouchableOpacity
          onPress={() => setExpanded(false)}
          activeOpacity={0.7}
          style={styles.collapseButton}
        >
          <Text style={styles.toggleLabel}>{collapseLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingBottom: 16,
  },
  preview: {
    fontSize: 15,
    color: Colors.text,
    lineHeight: 20,
  },
  hiddenMeasure: {
    position: "absolute",
    opacity: 0,
    top: 0,
    left: 0,
    right: 0,
  },
  gradientRow: {
    position: "absolute",
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },

  gradient: {
    width: 60,
    height: "100%",
  },
  labelWrapper: {
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    paddingLeft: 2,
  },
  toggleLabel: {
    fontSize: 15,
    lineHeight: 20,
    color: Colors.primary,
  },
  collapseButton: {
    marginTop: 2,
  },
});
