import { precacheAndRoute } from "workbox-precaching";

// Cache First (Cache Falling Back to Network)
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") self.skipWaiting();
});
// self.__WB_MANIFEST is default injection point
precacheAndRoute(self.__WB_MANIFEST);
