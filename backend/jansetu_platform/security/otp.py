"""OTP generation and verification using Redis."""
import random
import string
import redis
from typing import Optional
from ..config import settings

# Redis client - handle connection errors gracefully
try:
    redis_client = redis.from_url(settings.REDIS_URL, decode_responses=True, socket_connect_timeout=2)
    # Test connection
    redis_client.ping()
except Exception as e:
    print(f"Warning: Redis connection failed: {e}")
    print("OTP will work but won't persist across restarts")
    redis_client = None


def generate_otp(length: int = None) -> str:
    """Generate a random OTP."""
    if length is None:
        length = settings.OTP_LENGTH
    return ''.join(random.choices(string.digits, k=length))


def store_otp(otp_id: str, aadhar: str, otp_code: str) -> None:
    """Store OTP in Redis with expiration."""
    import sys
    if redis_client is None:
        # Fallback: just print OTP (for development)
        otp_msg = f"\n{'='*50}\nOTP for Aadhar {aadhar}: {otp_code} (Redis not available)\n{'='*50}\n"
        print(otp_msg, flush=True)
        sys.stdout.flush()
        return
    try:
        key = f"otp:{otp_id}"
        value = f"{aadhar}:{otp_code}"
        ttl = settings.OTP_EXPIRE_MINUTES * 60
        redis_client.setex(key, ttl, value)
    except Exception as e:
        print(f"Warning: Failed to store OTP in Redis: {e}", flush=True)
        otp_msg = f"\n{'='*50}\nOTP for Aadhar {aadhar}: {otp_code}\n{'='*50}\n"
        print(otp_msg, flush=True)
        sys.stdout.flush()


def verify_otp(otp_id: str, aadhar: str, otp_code: str) -> bool:
    """Verify OTP from Redis."""
    if redis_client is None:
        # In development without Redis, accept any 6-digit code
        # Remove this in production!
        return len(otp_code) == 6 and otp_code.isdigit()
    
    try:
        key = f"otp:{otp_id}"
        stored_value = redis_client.get(key)
        
        if not stored_value:
            return False
        
        stored_aadhar, stored_otp = stored_value.split(":")
        
        if stored_aadhar == aadhar and stored_otp == otp_code:
            # Delete OTP after successful verification
            redis_client.delete(key)
            return True
        
        return False
    except Exception as e:
        print(f"Warning: Failed to verify OTP from Redis: {e}")
        return False


def delete_otp(otp_id: str) -> None:
    """Delete OTP from Redis."""
    key = f"otp:{otp_id}"
    redis_client.delete(key)
