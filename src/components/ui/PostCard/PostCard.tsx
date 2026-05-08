import { Colors } from "@/constants/theme";
import { unlockedPostsStore } from "@/stores/";
import { Post } from "@/types/api";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { observer } from "mobx-react-lite";
import React from "react";
import {
    Image,
    Pressable,
    StyleSheet,
    Text,
    useWindowDimensions,
    View,
} from "react-native";
import { Button } from "../Button";
import { ExpandableText } from "../ExpandableText";
import { CommentButton, LikeButton } from "./components";

export const PostCard = observer(({
  post,
  onPress,
}: {
  post: Post;
  onPress: () => void;
}) => {
  const { width } = useWindowDimensions();
  const {
    author,
    title,
    preview,
    coverUrl,
    commentsCount,
    likesCount,
    isLiked,
    body
  } = post;

  const locked = post.tier === "paid" && !unlockedPostsStore.isUnlocked(post.id);

  return (
    <Pressable style={styles.card} onPress={onPress}>
      {/* Шапка — аватар + имя */}
      <View style={styles.header}>
        <Image source={{ uri: author.avatarUrl }} style={styles.avatar} />
        <Text style={styles.authorName}>{author.displayName}</Text>
      </View>

      {/* Обложка с оверлеем для платных постов */}
      <View style={{ height: width }}>
        <Image
          source={{ uri: coverUrl }}
          style={styles.cover}
          blurRadius={locked ? 40 : 0}
          onError={(e) => console.log("avatar error:", e.nativeEvent.error)}
        />

        {locked && (
          <View style={styles.overlay}>
            <View style={styles.donateIconWrapper}>
              <View style={styles.donateIcon}>
                <FontAwesome5
                  name="dollar-sign"
                  size={12}
                  color={Colors.primary}
                />
              </View>
            </View>
            <Text style={styles.donateText}>
              Контент скрыт пользователем.{"\n"}Доступ откроется после доната
            </Text>
            <Button
              text="Отправить донат"
              onPress={() => unlockedPostsStore.unlock(post.id)}
              style={{ maxWidth: "61%" }}
            />
          </View>
        )}
      </View>

      {/* Контент */}
      <View style={styles.content}>
        {locked ? (
          <>
            <View style={styles.skeletonTitle} />
            <View style={styles.skeletonPreview} />
          </>
        ) : (
          <>
            <Text style={styles.title}>{title}</Text>
            <ExpandableText
              numberOfLines={2}
              text={preview}
              fullText={body || preview}
            />
            <View style={styles.actions}>
              <LikeButton postId={post.id} liked={isLiked} count={likesCount} />
              <CommentButton count={commentsCount} />
            </View>
          </>
        )}
      </View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.border,
  },
  authorName: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.text,
  },
  cover: {
    width: "100%",
    height: "100%",
    backgroundColor: Colors.border,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.35)",
  },
  donateIconWrapper: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  donateIcon: {
    backgroundColor: Colors.background,
    height: 20,
    width: 20,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  donateText: {
    color: Colors.defaultColor,
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 13,
    maxWidth: "61%",
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    lineHeight: 26,
    color: Colors.text,
    paddingBottom: 8,
  },
  preview: {
    fontSize: 15,
    color: Colors.text,
    lineHeight: 20,
    paddingBottom: 16,
  },
  skeletonTitle: {
    height: 26,
    borderRadius: 22,
    backgroundColor: Colors.gray,
    marginBottom: 8,
    marginTop: 8,
    width: "45%",
  },
  skeletonPreview: {
    height: 40,
    borderRadius: 22,
    backgroundColor: Colors.gray,
    width: "100%",
  },
  actions: {
    flexDirection: "row",
    gap: 8,
  },
});