self.addEventListener("push", (event) => {
  if (!event.data) return;

  const { title, body, icon, url } = event.data.json();

  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon: icon || "/icon.png",
      badge: "/icon.png",
      data: { url: url || "/" },
      vibrate: [200, 100, 200],
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const targetUrl = event.notification.data?.url || "/";

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url.endsWith(targetUrl) && "focus" in client) {
            return client.focus();
          }
        }
        return clients.openWindow(targetUrl);
      })
  );
});
