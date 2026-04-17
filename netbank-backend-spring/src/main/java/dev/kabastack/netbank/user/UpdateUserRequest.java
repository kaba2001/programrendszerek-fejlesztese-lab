package dev.kabastack.netbank.user;

import lombok.Data;

@Data
public class UpdateUserRequest {
  private String firstName;
  private String lastName;
}
