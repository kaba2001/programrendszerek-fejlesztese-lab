package dev.kabastack.netbank.user;

import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
public class UserService {

  private final UserRepository repository;

  public UserService(UserRepository repository) {
    this.repository = repository;
  }

  public List<UserResponse> getAllUsers() {
    return repository.findAll().stream().map(this::mapToResponse).toList();
  }

  public void deleteUser(UUID id) {
    User user = repository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
    repository.delete(user);
  }

  public UserResponse updateUserStatus(UUID id, UpdateUserStatusRequest request) {
    User user = repository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
    user.setStatus(request.getStatus());
    return mapToResponse(repository.save(user));
  }

  public UserResponse getMe(User currentUser) {
    return mapToResponse(currentUser);
  }

  public UserResponse updateMe(User currentUser, UpdateUserRequest request) {
    if (request.getFirstName() != null) currentUser.setFirstName(request.getFirstName());
    if (request.getLastName() != null) currentUser.setLastName(request.getLastName());
    if (request.getEmail() != null) currentUser.setEmail(request.getEmail());
    return mapToResponse(repository.save(currentUser));
  }

  private UserResponse mapToResponse(User user) {
    return UserResponse.builder()
        .id(user.getId())
        .role(user.getRole())
        .firstName(user.getFirstName())
        .lastName(user.getLastName())
        .email(user.getEmail())
        .isActive(user.isActive())
        .status(user.getStatus())
        .build();
  }
}
