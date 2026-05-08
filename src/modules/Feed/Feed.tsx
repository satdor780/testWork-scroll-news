import { Button, PostCard } from "@/components/ui";
import { Colors } from "@/constants/theme";
import { usePosts } from "@/hooks";
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

// Ошибка загрузки — с кнопкой повтора
function ErrorState({ onRetry }: { onRetry: () => void }) {
  const { height } = useWindowDimensions();

  return (
    <View style={[styles.stateContainer, { minHeight: height * 0.8 }]}>
      <Image
        source={require("../../assets/not-found.png")}
        style={styles.stateImage}
        resizeMode="contain"
      />
      <Text style={styles.stateTitle}>Не удалось загрузить публикации</Text>
      <Button text="Повторить" onPress={onRetry} style={styles.stateButton} />
    </View>
  );
}

// Пустой список — отдельный кейс
function EmptyState() {
  const { height } = useWindowDimensions();

  return (
    <View style={[styles.stateContainer, { minHeight: height * 0.8 }]}>
      <Image
        source={require("../../assets/not-found.png")}
        style={styles.stateImage}
        resizeMode="contain"
      />
      <Text style={styles.stateTitle}>Публикаций пока нет</Text>
    </View>
  );
}

export default function Feed() {
  // const router = useRouter();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    error,
    isLoading,
    refetch,
    isRefetching,
  } = usePosts();

  const posts = data?.pages.flatMap((p) => p.posts) ?? [];

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (error) {
    return <ErrorState onRetry={refetch} />;
  }

  return (
    <FlatList
      data={posts}
      style={styles.flatList}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <PostCard post={item} onPress={() => null} /> // router.push(`/post/${item.id}`)
      )}
      contentContainerStyle={styles.list}
      showsVerticalScrollIndicator={false}
      // Pull-to-refresh
      refreshControl={
        <RefreshControl
          refreshing={isRefetching}
          onRefresh={refetch}
          tintColor={Colors.primary}
          colors={[Colors.primary]}
        />
      }
      onEndReached={() => {
        if (hasNextPage) fetchNextPage();
      }}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        hasNextPage ? (
          <ActivityIndicator style={styles.footer} color={Colors.primary} />
        ) : null
      }
      ListEmptyComponent={<EmptyState />}
    />
  );
}

const styles = StyleSheet.create({
  flatList: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  list: {
    flexGrow: 1,
    paddingBottom: 24,
    backgroundColor: Colors.backgroundSecondaty,
    gap: 16,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.background,
  },
  footer: {
    paddingVertical: 20,
  },
  stateContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.background,
    paddingHorizontal: 24,
    gap: 16,
  },
  stateImage: {
    width: 160,
    height: 160,
    marginBottom: 8,
  },
  stateTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: Colors.text,
    textAlign: "center",
    marginBottom: 8,
  },
  stateButton: {
    height: 52,
    borderRadius: 100,
  },
});
