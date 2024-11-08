# Dockerfile

# Use an official Python runtime as a parent image
FROM python:3.10-slim-buster

# Copy requirements.txt to leverage Docker cache
COPY requirements.txt ./

# Install the dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the code
COPY . .

# Expose the port that FastAPI listens on
EXPOSE 8000

# Command to run the app
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
