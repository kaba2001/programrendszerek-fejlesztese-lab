package dev.kabastack.netbank.account;

import java.util.List;
import java.util.UUID;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/accounts")
public class AdminAccountController {

  private final AccountService service;

  public AdminAccountController(AccountService service) {
    this.service = service;
  }

  @GetMapping
  public ResponseEntity<List<AccountResponse>> getAllAccounts() {
    return ResponseEntity.ok(service.getAllAccounts());
  }

  @PostMapping
  public ResponseEntity<AccountResponse> createAccount(@RequestBody AccountRequest request) {
    return ResponseEntity.ok(service.createAccount(request));
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteAccount(@PathVariable UUID id) {
    service.deleteAccount(id);
    return ResponseEntity.noContent().build();
  }

  @PatchMapping("/{id}/status")
  public ResponseEntity<AccountResponse> updateAccountStatus(
      @PathVariable UUID id, @RequestBody UpdateAccountStatusRequest request) {
    return ResponseEntity.ok(service.updateAccountStatus(id, request.getStatus()));
  }
}
