package dev.kabastack.netbank.account;

import dev.kabastack.netbank.user.User;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AccountRepository extends JpaRepository<Account, UUID> {
  List<Account> findAllByUser(User user);
}
