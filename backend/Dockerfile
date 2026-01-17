FROM python:3.14-slim

WORKDIR /app

# Install system dependencies including Rust for building packages
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    make \
    curl \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Install Rust (required for building pydantic-core from source)
# Using minimal profile and default toolchain for faster installation
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y --default-toolchain stable --profile minimal
ENV PATH="/root/.cargo/bin:${PATH}"
ENV CARGO_NET_GIT_FETCH_WITH_CLI=true

# Upgrade pip and install build tools
RUN pip install --upgrade pip setuptools wheel

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose port
EXPOSE 8000

# Run the application
CMD ["uvicorn", "jansetu_platform.main:app", "--host", "0.0.0.0", "--port", "8000"]
