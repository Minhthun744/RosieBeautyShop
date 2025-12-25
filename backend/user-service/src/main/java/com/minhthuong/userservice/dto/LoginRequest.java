package com.minhthuong.userservice.dto;

public class LoginRequest {
    private String userName;
    private String password;
    private int active;
    private String role;

    // Default constructor
    public LoginRequest() {
    }

    // Constructor with all fields
    public LoginRequest(String userName, String password, int active, String role) {
        this.userName = userName;
        this.password = password;
        this.active = active;
        this.role = role;
    }

    // Getters and setters
    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public int getActive() {
        return active;
    }

    public void setActive(int active) {
        this.active = active;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}
