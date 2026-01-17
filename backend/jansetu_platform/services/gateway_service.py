"""Gateway service for routing requests to downstream services."""
import httpx
from typing import Optional, Dict, Any
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from ..models.service import Service, ServiceStatus
from ..config import settings
class GatewayService:
    """Service for handling gateway routing logic."""
    
    def __init__(self, db: Session):
        self.db = db
        self.timeout = settings.GATEWAY_TIMEOUT_SECONDS
    
    def resolve_service(self, service_id: str) -> Optional[Service]:
        """Resolve service from registry."""
        # Query database (caching complex objects is handled differently)
        service = self.db.query(Service).filter(Service.service_id == service_id).first()
        return service
    
    
    async def forward_request(
        self,
        service: Service,
        path: str,
        method: str,
        headers: Dict[str, str],
        params: Optional[Dict[str, Any]] = None,
        body: Optional[Any] = None
    ) -> tuple[Dict[str, Any], int, Dict[str, str]]:
        """Forward request to downstream service."""
        # Build target URL
        base_url = service.base_url.rstrip('/')
        target_path = path.lstrip('/')
        target_url = f"{base_url}/{target_path}"
        
        # Prepare headers (remove host and connection headers)
        forward_headers = {
            k: v for k, v in headers.items()
            if k.lower() not in ['host', 'connection', 'content-length']
        }
        
        # Forward request
        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                if method == "GET":
                    response = await client.get(target_url, headers=forward_headers, params=params)
                elif method == "POST":
                    response = await client.post(target_url, headers=forward_headers, json=body, params=params)
                elif method == "PUT":
                    response = await client.put(target_url, headers=forward_headers, json=body, params=params)
                elif method == "DELETE":
                    response = await client.delete(target_url, headers=forward_headers, params=params)
                elif method == "PATCH":
                    response = await client.patch(target_url, headers=forward_headers, json=body, params=params)
                else:
                    raise HTTPException(
                        status_code=status.HTTP_405_METHOD_NOT_ALLOWED,
                        detail=f"Method {method} not supported"
                    )
                
                # Extract response
                response_data = response.json() if response.headers.get("content-type", "").startswith("application/json") else {"data": response.text}
                status_code = response.status_code
                response_headers = dict(response.headers)
                
                return response_data, status_code, response_headers
                
        except httpx.TimeoutException:
            raise HTTPException(
                status_code=status.HTTP_504_GATEWAY_TIMEOUT,
                detail=f"Service '{service.name}' did not respond within {self.timeout} seconds"
            )
        except httpx.RequestError as e:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail=f"Error connecting to service '{service.name}': {str(e)}"
            )
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Unexpected error: {str(e)}"
            )
