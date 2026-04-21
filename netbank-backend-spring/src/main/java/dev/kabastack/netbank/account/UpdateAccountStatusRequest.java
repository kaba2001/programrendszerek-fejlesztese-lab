package dev.kabastack.netbank.account;

import lombok.Data;

@Data
public class UpdateAccountStatusRequest {
  private Account.Status status;
}
