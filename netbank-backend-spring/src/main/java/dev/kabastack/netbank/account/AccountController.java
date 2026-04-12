package dev.kabastack.netbank.account;

import dev.kabastack.netbank.user.User;
import java.util.List;
import java.util.UUID;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/accounts")
public class AccountController {

  private final AccountService service;

  public AccountController(AccountService service) {
    this.service = service;
  }

  @GetMapping("/me")
  public ResponseEntity<List<AccountResponse>> getMyAccounts(@AuthenticationPrincipal User user) {
    return ResponseEntity.ok(service.getAccountsByUser(user));
  }

  @GetMapping("/{id}")
  public ResponseEntity<AccountResponse> getAccountDetails(
      @PathVariable UUID id, @AuthenticationPrincipal User user) {
    return ResponseEntity.ok(service.getAccountByIdForUser(id, user));
  }
}
