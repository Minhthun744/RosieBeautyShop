package com.minhthuong.userservice.controller;

import com.minhthuong.userservice.dto.LoginRequest;
import com.minhthuong.userservice.dto.LoginResponse;
import com.minhthuong.userservice.entity.User;
import com.minhthuong.userservice.service.UserService;
import com.minhthuong.userservice.utils.JwtTokenUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            System.out.println("Login request received for user: " + loginRequest.getUserName() + 
                ", role: " + loginRequest.getRole());
                
            User user = userService.getUserByName(loginRequest.getUserName());
            System.out.println("User retrieved: " + user);

            if (user != null && passwordEncoder.matches(loginRequest.getPassword(), user.getUserPassword())) {
                // Check if role is required for this login
                if (loginRequest.getRole() != null && !loginRequest.getRole().isEmpty()) {
                    // For admin login, verify the user has the required role
                    boolean hasRequiredRole = user.getRole() != null && 
                                           loginRequest.getRole().equals(user.getRole().getRoleName());
                    
                    if (!hasRequiredRole) {
                        System.out.println("User does not have the required role: " + loginRequest.getRole());
                        return ResponseEntity.status(403).body("Access denied. Insufficient permissions.");
                    }
                    System.out.println("User has required role: " + loginRequest.getRole());
                }

                String authToken = jwtTokenUtil.generateToken(user);
                LoginResponse response = new LoginResponse(
                        user.getId(),
                        user.getUserName(),
                        "Bearer " + authToken);
                        
                System.out.println("Login successful. Returning response: " + response);
                return ResponseEntity.ok(response);
            }

            System.out.println("Invalid username or password. Returning bad request response.");
            return ResponseEntity.badRequest().body("Invalid username or password");
        } catch (Exception e) {
            System.out.println("Exception occurred: " + e.getMessage());
            e.printStackTrace();
            System.out.println("Error during login. Returning internal server error response.");
            return ResponseEntity.internalServerError().body("Error during login: " + e.getMessage());
        }
    }
}
