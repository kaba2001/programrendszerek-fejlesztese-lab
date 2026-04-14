package dev.kabastack.netbank.contact;

import dev.kabastack.netbank.user.User;
import java.util.List;
import java.util.UUID;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contacts")
public class ContactController {

  private final ContactService service;

  public ContactController(ContactService service) {
    this.service = service;
  }

  @GetMapping
  public ResponseEntity<List<ContactResponse>> getMyContacts(@AuthenticationPrincipal User user) {
    return ResponseEntity.ok(service.getContactsByUser(user));
  }

  @GetMapping("/{id}")
  public ResponseEntity<ContactResponse> getContact(
      @PathVariable UUID id, @AuthenticationPrincipal User user) {
    return ResponseEntity.ok(service.getContactByIdForUser(id, user));
  }

  @PostMapping
  public ResponseEntity<ContactResponse> createContact(
      @RequestBody ContactRequest request, @AuthenticationPrincipal User user) {
    return ResponseEntity.ok(service.createContact(request, user));
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteContact(
      @PathVariable UUID id, @AuthenticationPrincipal User user) {
    service.deleteContact(id, user);
    return ResponseEntity.noContent().build();
  }
}
