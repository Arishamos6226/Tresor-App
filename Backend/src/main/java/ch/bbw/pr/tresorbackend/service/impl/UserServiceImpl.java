package ch.bbw.pr.tresorbackend.service.impl;

import ch.bbw.pr.tresorbackend.model.User;
import ch.bbw.pr.tresorbackend.repository.UserRepository;
import ch.bbw.pr.tresorbackend.service.SafeDbCall;
import ch.bbw.pr.tresorbackend.service.UserService;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

/**
 * UserServiceImpl
 * @author Peter Rutschmann
 */
@Service
@AllArgsConstructor
public class UserServiceImpl implements UserService {
   private UserRepository userRepository;

   @Override
   public User createUser(User user) {
      return SafeDbCall.safeDbCall(() -> userRepository.save(user), null);
   }

   @Override
   public User getUserById(Long userId) {
      Optional<User> user = SafeDbCall.safeDbCall(() -> userRepository.findById(userId), Optional.empty());
      if (user.isPresent()) return user.get();
      return null;

   }

   @Override
   public User findByEmail(String email) {
      Optional<User> user = SafeDbCall.safeDbCall(() -> userRepository.findByEmail(email), Optional.empty());
      if (user.isPresent()) return user.get();
      return null;
   }

   @Override
   public List<User> getAllUsers() {
      return (List<User>) SafeDbCall.safeDbCall(() -> userRepository.findAll(), List.of());
   }

   @Override
   public User updateUser(User user) {
      Optional<User> optionalExistingUser = SafeDbCall.safeDbCall(() -> userRepository.findById(user.getId())
              , Optional.empty());
      if (! optionalExistingUser.isPresent()) return null;
      User existingUser = optionalExistingUser.get();
      if (user.getFirstName() != null && !user.getFirstName().isBlank()) {
         existingUser.setFirstName(user.getFirstName());
      }
      if (user.getLastName() != null && !user.getLastName().isBlank()) {
         existingUser.setLastName(user.getLastName());
      }
      if (user.getEmail() != null && !user.getEmail().isBlank()) {
         existingUser.setEmail(user.getEmail());
      }
      if (user.getRole() != null && !user.getRole().isBlank()) {
         existingUser.setRole(user.getRole());
      }
      User updatedUser = userRepository.save(existingUser);
      return updatedUser;
   }

   @Override
   // In UserService.java ergänzen:
   public User updatePassword(User user) {
      User existingUser = userRepository.findById(user.getId()).orElse(null);
      if (existingUser == null) return null;
      existingUser.setPassword(user.getPassword());
      return userRepository.save(existingUser);
   }

   @Override
   public boolean deleteUser(Long userId) {
      return SafeDbCall.safeDbCall(() -> userRepository.deleteById(userId));
   }
}
