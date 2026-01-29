const CACHE_NAME = 'ronika-online-first-v1';
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// هنگام نصب، فایل‌ها را کش کن (فقط برای احتیاط)
self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

// پاک کردن کش‌های قدیمی وقتی سرویس ورکر جدید فعال شد
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          return caches.delete(key);
        }
      }));
    })
  );
  return self.clients.claim();
});

// استراتژی "اول شبکه" (Network First)
self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        // اگر اینترنت بود، پاسخ را بگیر و کش را هم آپدیت کن
        const resClone = res.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(e.request, resClone);
        });
        return res;
      })
      .catch(() => {
        // اگر اینترنت نبود، از کش استفاده کن
        return caches.match(e.request);
      })
  );
});
