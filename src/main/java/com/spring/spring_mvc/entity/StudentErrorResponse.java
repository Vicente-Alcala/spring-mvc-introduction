package com.spring.spring_mvc.entity;

/**
 * POJO representing a standardized JSON
 * error response returned by the REST API
 * when an exception occurs.
 */
public class StudentErrorResponse {
    private int status;
    private String message;
    private long timestamp;

    public StudentErrorResponse() {
    }

    /**
     * Creates an error response with the specified HTTP status,
     * error message, and timestamp.
     *
     * @param status the HTTP status code of the error
     * @param message the description of the error
     * @param timestamp the time when the error occurred, in milliseconds
     */
    public StudentErrorResponse(int status, String message, long timestamp) {
        this.status = status;
        this.message = message;
        this.timestamp = timestamp;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public long getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(long timestamp) {
        this.timestamp = timestamp;
    }

}
