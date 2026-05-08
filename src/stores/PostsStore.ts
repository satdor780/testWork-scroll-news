import { makeAutoObservable } from "mobx";

class UnlockedPostsStore {
  unlockedIds: Set<string> = new Set();

  constructor() {
    makeAutoObservable(this);
  }

  unlock(postId: string) {
    this.unlockedIds.add(postId);
  }

  isUnlocked(postId: string): boolean {
    return this.unlockedIds.has(postId);
  }
}

export const unlockedPostsStore = new UnlockedPostsStore();
