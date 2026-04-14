package dev.kabastack.netbank.contact;

import dev.kabastack.netbank.user.User;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
public class ContactService {

  private final ContactRepository repository;

  public ContactService(ContactRepository repository) {
    this.repository = repository;
  }

  public List<ContactResponse> getContactsByUser(User user) {
    return repository.findAllByUser(user).stream().map(this::mapToResponse).toList();
  }

  public ContactResponse getContactByIdForUser(UUID contactId, User user) {
    Contact contact = getContactAndVerifyOwnership(contactId, user);
    return mapToResponse(contact);
  }

  public ContactResponse createContact(ContactRequest request, User user) {
    Contact contact = new Contact();
    contact.setUser(user);
    contact.setPartnerName(request.getPartnerName());
    contact.setPartnerAccountNumber(request.getPartnerAccountNumber());

    Contact savedContact = repository.save(contact);
    return mapToResponse(savedContact);
  }

  public void deleteContact(UUID contactId, User user) {
    Contact contact = getContactAndVerifyOwnership(contactId, user);
    repository.delete(contact);
  }

  private Contact getContactAndVerifyOwnership(UUID contactId, User user) {
    Contact contact =
        repository
            .findById(contactId)
            .orElseThrow(() -> new RuntimeException("Partner not found!"));

    if (!contact.getUser().getId().equals(user.getId())) {
      throw new RuntimeException("Error");
    }
    return contact;
  }

  private ContactResponse mapToResponse(Contact contact) {
    return ContactResponse.builder()
        .id(contact.getId())
        .partnerName(contact.getPartnerName())
        .partnerAccountNumber(contact.getPartnerAccountNumber())
        .build();
  }
}
