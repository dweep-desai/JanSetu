"""Redis cache service."""
import json
import redis
from typing import Optional, Any
from ..config import settings

try:
    redis_client = redis.from_url(settings.REDIS_URL, decode_responses=True)
except Exception:
    redis_client = None


class CacheService:
    """Service for caching data in Redis."""
    
    def get(self, key: str) -> Optional[Any]:
        """Get value from cache."""
        if not redis_client:
            return None
        try:
            value = redis_client.get(key)
            if value:
                return json.loads(value)
            return None
        except Exception:
            return None
    
    def set(self, key: str, value: Any, ttl: int = None) -> bool:
        """Set value in cache."""
        if not redis_client:
            return False
        try:
            if ttl is None:
                ttl = settings.CACHE_TTL_SECONDS
            
            serialized = json.dumps(value, default=str)
            redis_client.setex(key, ttl, serialized)
            return True
        except Exception:
            return False
    
    def delete(self, key: str) -> bool:
        """Delete key from cache."""
        if not redis_client:
            return False
        try:
            redis_client.delete(key)
            return True
        except Exception:
            return False
    
    def get_cache_key(self, service_id: str, path: str, params: dict = None) -> str:
        """Generate cache key for a request."""
        if params:
            param_str = "&".join(f"{k}={v}" for k, v in sorted(params.items()))
            return f"gateway:{service_id}:{path}:{param_str}"
        return f"gateway:{service_id}:{path}"
