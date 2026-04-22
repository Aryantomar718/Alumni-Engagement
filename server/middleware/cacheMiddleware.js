const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 300 }); // Default 5 minutes

/**
 * Middleware to cache API responses
 * @param {Number} ttl - Time to live in seconds
 */
const cacheMiddleware = (ttl) => (req, res, next) => {
  // Only cache GET requests
  if (req.method !== 'GET') return next();

  const key = req.originalUrl || req.url;
  const cachedResponse = cache.get(key);

  if (cachedResponse) {
    console.log(`📦 Cache hit for ${key}`);
    return res.json(cachedResponse);
  }

  // Intercept the original res.json to store result in cache
  res.originalJson = res.json;
  res.json = (data) => {
    cache.set(key, data, ttl);
    res.originalJson(data);
  };

  next();
};

/**
 * Utility to clear cache for a specific key or all
 */
const clearCache = (key) => {
  if (key) {
    cache.del(key);
  } else {
    cache.flushAll();
  }
};

module.exports = { cacheMiddleware, clearCache };
