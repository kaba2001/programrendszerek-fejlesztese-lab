package dev.kabastack.netbank.user;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

  private final UserService service;

  public UserController(UserService service) {
    this.service = service;
  }

  @GetMapping("/me")
  public ResponseEntity<UserResponse> getMe(@AuthenticationPrincipal User user) {
    return ResponseEntity.ok(service.getMe(user));
  }

  @PatchMapping("/me")
  public ResponseEntity<UserResponse> updateMe(
      @AuthenticationPrincipal User user, @RequestBody UpdateUserRequest request) {
    return ResponseEntity.ok(service.updateMe(user, request));
  }
}
