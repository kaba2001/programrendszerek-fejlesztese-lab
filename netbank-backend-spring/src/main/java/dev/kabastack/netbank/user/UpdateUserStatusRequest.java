package dev.kabastack.netbank.user;

import lombok.Data;

@Data
public class UpdateUserStatusRequest {
  private User.Status status;
}
