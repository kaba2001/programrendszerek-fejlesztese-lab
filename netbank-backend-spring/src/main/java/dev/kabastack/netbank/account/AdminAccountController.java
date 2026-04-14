package dev.kabastack.netbank.account;

import java.util.List;
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
}
