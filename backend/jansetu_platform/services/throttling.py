"""Request throttling service."""
import redis
from datetime import datetime, timedelta
from ..config import settings

redis_client = redis.from_url(settings.REDIS_URL, decode_responses=True)


class ThrottlingService:
    """Service for request throttling."""
    
    def __init__(self):
        self.requests_per_minute = settings.THROTTLE_REQUESTS_PER_MINUTE
    
    def check_throttle(self, user_id: int) -> tuple[bool, Optional[int]]:
        """Check if user has exceeded rate limit.
        
        Returns:
            (allowed, remaining_requests)
        """
        key = f"throttle:user:{user_id}"
        current_time = datetime.utcnow()
        minute_start = current_time.replace(second=0, microsecond=0)
        
        # Get current count
        count = redis_client.get(key)
        if count is None:
            # First request in this minute
            redis_client.setex(key, 60, "1")
            return True, self.requests_per_minute - 1
        
        count = int(count)
        
        if count >= self.requests_per_minute:
            return False, 0
        
        # Increment count
        redis_client.incr(key)
        redis_client.expire(key, 60)  # Reset expiry
        
        return True, self.requests_per_minute - count - 1
    
    def reset_throttle(self, user_id: int) -> None:
        """Reset throttle for a user (for testing/admin purposes)."""
        key = f"throttle:user:{user_id}"
        redis_client.delete(key)
