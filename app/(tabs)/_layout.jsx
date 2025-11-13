import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="home"     options={{ title: "Home" }} />
      <Tabs.Screen name="bookmark" options={{ title: "Bookmark" }} />
      <Tabs.Screen name="create"   options={{ title: "Create" }} />
      <Tabs.Screen name="profile"  options={{ title: "Profile" }} />
    </Tabs>
  );
}
