package dev.kabastack.netbank.user;

import java.util.UUID;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserResponse {
  private UUID id;
  private User.Role role;
  private String firstName;
  private String lastName;
  private String email;
  private Boolean isActive;
  private User.Status status;
}
