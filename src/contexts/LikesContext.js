import React, { createContext, useContext, useState } from "react";

const LikesContext = createContext(null);

export function LikesProvider({ children }) {
  const [likedMap, setLikedMap] = useState({});
  const [engagementCounts, setEngagementCounts] = useState({});

  // items: array of { id }
  // baseCount: starting engagement count
  // likedByDefault: if true, mark these items as liked initially
  const setInitialData = (items, baseCount = 13, likedByDefault = false) => {
    const counts = {};
    const liked = {};
    items.forEach((i) => {
      counts[i.id] = baseCount;
      liked[i.id] = Boolean(likedByDefault);
    });
    setEngagementCounts(counts);
    setLikedMap(liked);
  };

  const toggleLike = (id) => {
    setLikedMap((prev) => {
      const nextLiked = !prev[id];
      setEngagementCounts((prevCounts) => ({
        ...prevCounts,
        [id]: (prevCounts[id] || 0) + (nextLiked ? 1 : -1),
      }));
      return { ...prev, [id]: nextLiked };
    });
  };

  return (
    <LikesContext.Provider
      value={{ likedMap, engagementCounts, toggleLike, setInitialData }}
    >
      {children}
    </LikesContext.Provider>
  );
}

export function useLikes() {
  const ctx = useContext(LikesContext);
  if (!ctx) throw new Error("useLikes must be used within LikesProvider");
  return ctx;
}
