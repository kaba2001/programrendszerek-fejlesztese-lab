package dev.kabastack.netbank.user;

import java.util.List;
import java.util.UUID;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/users")
public class AdminUserController {

  private final UserService service;

  public AdminUserController(UserService service) {
    this.service = service;
  }

  @GetMapping
  public ResponseEntity<List<UserResponse>> getAllUsers() {
    return ResponseEntity.ok(service.getAllUsers());
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteUser(@PathVariable UUID id) {
    service.deleteUser(id);
    return ResponseEntity.noContent().build();
  }

  @PatchMapping("/{id}/status")
  public ResponseEntity<UserResponse> updateUserStatus(
      @PathVariable UUID id, @RequestBody UpdateUserStatusRequest request) {
    return ResponseEntity.ok(service.updateUserStatus(id, request));
  }
}
